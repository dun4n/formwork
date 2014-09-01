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
  'inner_reference.tpl'
];

configs.forEach(function(config) {
  console.log(['-', 'Config:', config].join(' '))
  console.log(Util.inspect(construct(Formwork, config).references, inspectConfig));
  console.log('\n')
});