/* global describe, it */
var expect = require('chai').expect,
    Path = require('path'),
    formwork = require('../../lib/');

var TEMPLATE_FILE = Path.join(__dirname, './fixture/config.tpl'),
    PROPERTIES_FILE = Path.join(__dirname, './fixture/properties.json'),
    MISSING_TEMPLATE_FILE_EXCEPTION = 'Missing template file',
    WRONG_TEMPLATE_FILE_EXCEPTION = 'Cannot load template file',
    WRONG_PROPERTIES_FILE_EXCEPTION = 'Cannot load properties file',
    FAKE_PATH = 'fake',
    FAKE_CANONICAL_PATH = Path.join(__dirname, 'fixture', FAKE_PATH),
    FAKE_REFERENCE = {type: 'Reference', value: {name: 'myName'}},
    FAKE_BEAN = {reference: 'myBean', value: {name: 'myName'}};

describe('Formwork', function() {

  it('should throw an exception if the template file is invalid', function() {
    expect(function() { new formwork(); } ).to.throw(MISSING_TEMPLATE_FILE_EXCEPTION);
    expect(function() { new formwork(FAKE_PATH); } ).to.throw(WRONG_TEMPLATE_FILE_EXCEPTION);
  });

  it('should throw an exception if the properties file is invalid', function() {
    expect(function() { new formwork(TEMPLATE_FILE, ''); } ).to.throw(WRONG_PROPERTIES_FILE_EXCEPTION);
  });

  it('should resolve type path when needed', function() {
    var t = new formwork(TEMPLATE_FILE, PROPERTIES_FILE);

    expect(t.resolveTypePath(FAKE_PATH)).equal(FAKE_PATH);
    expect(t.resolveTypePath(FAKE_PATH + '.js')).equal(FAKE_CANONICAL_PATH + '.js');
  });

  it('should properly return the value of an argument', function() {
    var t = new formwork(TEMPLATE_FILE, PROPERTIES_FILE);
    var value = t.getRealValue(FAKE_REFERENCE);

    expect(value).to.have.property('name');
    expect(value.name).equal(FAKE_REFERENCE.value.name);
  });

  it('should properly return an already registered bean', function() {
    var t = new formwork(TEMPLATE_FILE, PROPERTIES_FILE);
    t.references[FAKE_BEAN.reference] = FAKE_BEAN.reference;

    expect(t.buildBean(FAKE_BEAN)).equal(FAKE_BEAN.reference);
  });

});

var beans = new formwork(Path.join(__dirname, 'fixture/config.tpl'), Path.join(__dirname, 'fixture/properties.json'));
console.log(beans.resolve('anonymous_example'));
console.log(beans.resolve('anonymous'));
console.log(beans.resolve('configObject'));
console.log(beans.resolve('fish'));
console.log(beans.resolve('oneDog'));
console.log(beans.resolve('dogName'));
console.log(beans.resolve('person'));