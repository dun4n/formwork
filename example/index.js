var Formwork = require('../lib'),
    Util = require('util'),
    inspectConfig = {colors: true, depth: null};

function construct(constructor, args) {
    function Factory() {
        return constructor.apply(this, [].concat(args));
    }

    Factory.prototype = constructor.prototype;

    return new Factory();
}

var configs = [
  'simple.tpl',
  'types.tpl',
  'virtual_type.tpl',
  'anonymous_type.tpl',
  ['with_properties.tpl', 'properties.json'],
  'inner_reference.tpl',
  'dependencies.tpl'
];

configs.forEach(function(config) {
  var fw = construct(Formwork, config);
  fw.on('ready', function() {
    console.log(['-', 'Config:', config].join(' '))
    console.log(Util.inspect(fw.references, inspectConfig));
    console.log('\n');
  });
  fw.init();
});