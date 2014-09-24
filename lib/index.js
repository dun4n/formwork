'use strict';

var fs = require('fs'),
    EventEmitter = require('events').EventEmitter,
    Path = require('path'),
    install = require('./install.js'),
    TEMPLATE_REGEXP = /\{([^\}\s;]*)\}/g,
    CHARSET_UTF8 = 'utf8';

// Utility method to generate a constructor
function construct(constructor, args) {
    function Factory() {
      return constructor.apply(this, args);
    }

    Factory.prototype = constructor.prototype;

    return new Factory();
}

function mergeTemplate(template, properties) {
  // Merge template and properties
  var tmp = template.match(TEMPLATE_REGEXP);
  tmp && tmp.forEach(function(i) {
    var key = i.replace(/{|}/g, '');

    var rawValue = (function f(keys, obj) {
      var key = keys.shift();

      return !obj ? undefined : keys.length > 0 ? obj[key] && f(keys, obj[key]) : obj[key];

    })(key.split('.'), properties);

    var value;

    switch(typeof rawValue) {
      case 'string':
        value = '\'' + rawValue + '\'';
        break;
      case 'object':
        value = JSON.stringify(rawValue);
        break;
      case 'undefined':
        value = JSON.stringify({type: 'Reference', value: key});
        break;
      default:
        value = rawValue;
    }

    template = template.replace(i, value);
  });

  return template;
}

function Formwork(template, properties) {
  if(!template || typeof template !== 'string')
    throw new Error('Missing template file');

  // The base directory of the template file, used to resolve template 'types'
  this.typesDirname = Path.dirname(Path.resolve(template));
  // References of instances already spawned
  this.references = {};
  // References of type / virtual type
  this.types = {};
  // Initialized ?
  this.initialized = false;

  if(typeof properties === 'string') {
    try {
      properties = require(properties);      
    } catch(e) {
      throw new Error('Cannot load properties file');
    }
  }

  try {
    template = fs.readFileSync(template, {encoding: CHARSET_UTF8});    
  } catch(e) {
    throw new Error('Cannot load template file');
  }

  template = mergeTemplate(template, properties);

  this.config = eval('(' + template + ')');

  // Register event handler from config
  if(this.config.on) {
    Object.keys(this.config.on).forEach(function(eventName) {
      this.on(eventName, this.config.on[eventName]);
    }, this);
  }

  var self = this;

  // Install dependencies
  install(this, this.config.dependencies, function() {

    // Register modules as type
    self.config.types && self.config.types.forEach(function(type) {
      this.registerType(type);
    }, self);

    // Build beans
    self.config.beans && self.processEagerBean();

    self.emit('ready');
  });
}

Formwork.prototype = new EventEmitter();

Formwork.prototype.processEagerBean = function() {
  this.config.beans.filter(function(beanConfig) {
    return !beanConfig.lazy;
  }).forEach(function(beanConfig) {
    var bean = this.buildBean(beanConfig);
    this.emit('bean', bean, beanConfig.reference);
  }, this);
};

Formwork.prototype.resolveTypePath = function(path) {
  if(path.indexOf('/') !== 0 && Path.extname(path) === '.js')
    return Path.join(this.typesDirname, path);

  return path;
};

Formwork.prototype.registerType = function(type) {
  if(typeof type === 'string') {
    this.types[type] = require(this.resolveTypePath(type));
  } else if(typeof type === 'object') {

    if(!type.hasOwnProperty('module')) {
      this.types[type.alias] = type.constructor;
    } else if(!type.hasOwnProperty('constructor')) {
      this.types[type.alias] = require(this.resolveTypePath(type.module));
    } else {
      this.types[type.alias] = require(this.resolveTypePath(type.module))[type.constructor];
    }
  }
};

Formwork.prototype.getRealValue = function(argument) {
  if(typeof argument !== 'object')
    return argument;

  if(argument.type === 'Reference') {
    if(typeof argument.value !== 'object') {

      var self = this;

      return (function f(obj, paths) {
        var key = paths.shift();

        if(!obj) {
          if(paths.length > 0)
            return f(self.resolve(key), paths);
          else
            return self.resolve(key);
        }

        if(!obj.hasOwnProperty(key)) {
          throw new Error('Wrong property key for reference');
        }

        if(obj.hasOwnProperty(key) && paths.length > 0) {
          return f(obj[key], paths);          
        }

        return obj[key];
      })(null, argument.value.split('.'));

    } else if(typeof argument.value === 'object' && argument.value.hasOwnProperty('reference')) {
      return this.resolve(argument.value);      
    } else {
      return argument.value;      
    }
  } else if(!argument.hasOwnProperty('type'))
    return argument;

  return argument.value;
};

Formwork.prototype.buildBean = function(bean) {
  if(this.references[bean.reference])
    return this.references[bean.reference];

  var instance;

  if(!bean.hasOwnProperty('type') && !bean.hasOwnProperty('constructor')) {
    instance = this.getRealValue(bean.value);
  } else {
    var clazz;

    if(!bean.hasOwnProperty('type') && bean.hasOwnProperty('constructor') && typeof bean.constructor === 'function') {
      clazz = bean.constructor;
    } else {

      clazz = this.types[bean.type] || require(this.resolveTypePath(bean.type));

      if(bean.hasOwnProperty('constructor') && typeof bean.constructor === 'string') {
        clazz = clazz[bean.constructor];        
      }
    }

    var constructorArgs = !Array.isArray(bean.arguments) ? [].concat(this.getRealValue(bean.arguments)) : bean.arguments.map(function(arg) {
      return this.getRealValue(arg);
    }, this);

    instance = construct(clazz, constructorArgs);

    // First to be executed
    if(bean.hasOwnProperty('init')) {
      var args;

      if(bean.init.arguments) {
        args = bean.init.arguments.map(function(arg) {
          return this.getRealValue(arg);
        }, this);
      }

      instance[bean.init.name].apply(instance, args);
    }
  }

  // Set properties
  if(bean.hasOwnProperty('properties')) {
    bean.properties.forEach(function(property) {
      // TODO check for references inside an array

      if(Array.isArray(property.value)) {
        instance[property.name] = property.value.map(function(p) {
          return this.getRealValue(p);
        }, this);
      } else {
        instance[property.name] = this.getRealValue(property.value);
      }
    }, this);
  }

  // Apply methods
  if(bean.hasOwnProperty('apply')) {

    bean.apply.forEach(function(apply) {
      var args = apply.arguments.map(function(arg) {
        return this.getRealValue(arg);
      }, this);

      instance[apply.name].apply(instance, args);
    }, this);
  }

  // Register the bean if a reference's name exists
  bean.hasOwnProperty('reference') && (this.references[bean.reference] = instance);

  return instance;
};

Formwork.prototype.resolve = function(reference) {
  if(this.references[reference])
    return this.references[reference];

  this.config.beans.filter(function(beanConfig) {
    return beanConfig.reference === reference
  }).forEach(function(beanConfig) {
    var bean = this.buildBean(beanConfig);
    this.emit('bean', bean, beanConfig.reference);
  }, this);

  return this.references[reference];

};

module.exports = Formwork;