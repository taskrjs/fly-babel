var babel = require('babel-core').transform
var assign = require('object-assign')
var readPkg = require('read-pkg-up')

var BABEL_REGEX = /(^babel-)(preset|plugin)-(.*)/i

module.exports = function () {
  var cache
  return this.filter('babel', function (data, options) {
    if (options.preload) {
      delete options.preload

      var pkg = cache || (cache = readPkg.sync().pkg)
      var deps = Object.keys(pkg.devDependencies || {})

      deps.forEach(function (value) {
        var segs = BABEL_REGEX.exec(value)
        if (segs) {
          var key = (segs[2] + 's')
          options[key] = (options[key] || []).concat(segs[3])
        }
      })
    }
    options.filename = options.file.base
    delete options.file
    return assign({ext: '.js'}, babel(data.toString(), options))
  })
}
