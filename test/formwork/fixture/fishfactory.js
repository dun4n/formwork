'use strict';

function FishFactory() {
  function Fish(name) {
    this.name = name;
  }

  return {
    create: function(name) {
      return new Fish(name);
    }
  }
};

module.exports = new FishFactory;