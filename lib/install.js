var exec = require('child_process').exec,
    FS = require('fs'),
    Path = require('path'),
    semver = require('semver');

module.exports = function install(dependencies, done) {
  if(!dependencies || Object.prototype.toString.call(dependencies) !== '[object Object]')
    return done();

  var execOptions = {cwd: process.cwd(), env: process.env};

  var nodeModulesPath = process.mainModule.paths.filter(function(path) {
    var path = path.replace('node_modules', 'package.json');
    return FS.existsSync(path)
  });

  nodeModulesPath = !nodeModulesPath.length ? Path.join(process.cwd, 'node_modules') : nodeModulesPath[0];

  (function i(queue) {
    if(!queue.length)
      return done();

    var name = queue.shift(),
        version = dependencies[name];

    if(typeof version !== 'string')
      throw new Error('Wrong version argument for dependency ' + name);

    // Check if the dependency has already been downloaded
    if(FS.existsSync(Path.join(nodeModulesPath, name))) {
      var pkgDesc = require(Path.join(nodeModulesPath, name, 'package.json'));

      if(semver.satisfies(pkgDesc.version, version))
        return i(queue);
    }

    var uri = [name, version].join('@');

    exec(['npm', 'install', uri].join(' '), execOptions, function(err) {
      if(!err) i(queue);
      else throw new Error('Failed to install dependency ' + name + ' (' + dependencies[name] + ')');
    });
  })(Object.keys(dependencies));
};