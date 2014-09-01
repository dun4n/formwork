'use strict';

function Pet(name) {
  this.name = name;
};

Pet.prototype.setType = function(type) {
  this.type = type;
};

module.exports = Pet;