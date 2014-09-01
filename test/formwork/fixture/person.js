'use strict';

function Person(name, nick) {
  this.initialized = false;
  this.name = name;
  this.nick = nick;
  this.pets = [];
};

Person.prototype.init = function(name) {
  this.name = name;
  this.initialized = true;
};

Person.prototype.setName = function(name) {
  this.name = name;
};

Person.prototype.addPet = function(pet) {
  if(pet)
    this.pets.push(pet);
}

module.exports = Person;