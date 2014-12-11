var exec = require('child_process').exec,
    FS = require('fs'),
    Path = require('path'),
    npm = require('npm'),
    semver = require('semver'),
    async = require('async');

module.exports = function install(fw, dependencies, npmOptions, callback) {
  if(typeof npmOptions === 'function')
    callback = npmOptions;

  if(!dependencies || Object.prototype.toString.call(dependencies) !== '[object Object]')
    return callback();

  var execOptions = {cwd: process.cwd(), env: process.env};

  npm.load(npmOptions, function (err) {
    if (err) return callback(err);

    async.each(Object.keys(dependencies), function(key, cb) {
      var dependencyName = key,
          dependencyVersion = dependencies[key];

      if(typeof dependencyVersion !== 'string')
        cb('Wrong version argument for dependency ' + dependencyName);

      // Check for a local module
      var uri = FS.existsSync(Path.resolve(dependencyVersion)) ? dependencyVersion : [dependencyName, dependencyVersion].join('@');

      npm.commands.install([uri], function(err) {
        !err && fw.emit('dependency', dependencyName);

        cb(err);
      });
    }, callback);
  });
};