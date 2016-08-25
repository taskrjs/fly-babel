const babel = require('babel-core').transform
const assign = require('object-assign')
const readPkg = require('read-pkg-up')

var BABEL_REGEX = /(^babel-)(preset|plugin)-(.*)/i

module.exports = function () {
  var cache
  return this.filter('babel', function (data, options) {
    if (options.preload) {
      delete options.preload

      var pkg = cache || (cache = readPkg.sync().pkg)
      var deps = Object.keys(pkg.devDependencies || {})

      deps.forEach(function (value) {
        var parsed = BABEL_REGEX.exec(value)
        if (parsed) {
          (options[parsed[2] + 's'] || (options[parsed[2] + 's'] = [])).push(parsed[3])
        }
      })
    }
    options.filename = options.file.base
    delete options.file
    return assign({ext: '.js'}, babel(data.toString(), options))
  })
}
