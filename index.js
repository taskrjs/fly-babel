const babel = require('babel-core').transform
const assign = require('object-assign')
const readPkg = require('read-pkg-up')

function matchType(deps, type) {
  var rgx = new RegExp('(^babel-' + type + ')-(.*)', 'ig')
  return deps.reduce(function (acc, value) {
    var matches = rgx.exec(value)
    return matches ? (acc.concat(matches[2])) : acc
  }, [])
}

module.exports = function () {
  var cache
  return this.filter('babel', function (data, options) {
    if (options.preload) {
      delete options.preload
      var pkg = cache || (cache = readPkg.sync().pkg)
      var deps = Object.keys(pkg.devDependencies || {})
      options.presets = matchType(deps, 'preset')
      options.plugins = matchType(deps, 'plugin')
    }
    options.filename = options.file.base
    delete options.file
    return assign({ext: '.js'}, babel(data.toString(), options))
  })
}
