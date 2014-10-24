var Path = require('path');

var formworkPath = 'node_modules/formwork/lib/formwork.js';

module.exports = (function() {
  var loadedFormwork = Object.keys(require.cache).filter(function(key) {
    if(key.indexOf(formworkPath) === -1)
      return false;

      var loadedPkg = require(Path.join(Path.dirname(key), '../package.json'));
      var thisPkg = require('../package.json');

      return loadedPkg.version === thisPkg.version;
  });

  if(loadedFormwork.length) {
    return require(loadedFormwork[0]);
  } else {
    return require('./formwork.js');
  }
})();