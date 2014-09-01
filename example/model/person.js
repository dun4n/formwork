'use strict';

function Person(name) {
  this.name = name;
  this.pets = [];
};

Person.prototype.init = function() {
  this.initialized = true;
};

Person.prototype.addPet = function(pet) {
  if(pet)
    this.pets.push(pet);
}

module.exports = Person;