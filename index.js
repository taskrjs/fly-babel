const babel = require("babel-core").transform
const assign = require("object-assign")
const readPkg = require("read-pkg-up")
const BABEL_REGEX = /(^babel-preset)-(.*)/ig

module.exports = function () {
  var cache
  return this.filter("babel", function (data, options) {
    if (options.preload) {
      var pkg = cache || (cache = readPkg.sync().pkg)
      var deps = pkg.devDependencies || {}
      var presets = Object.keys(deps).reduce(function (acc, value) {
        var processed = BABEL_REGEX.exec(value)
        if (!processed) return acc
        acc.push(processed[2])
        return acc
      }, [])
      options.presets = presets
      delete options.preload
    }
    options.filename = options.file.base
    delete options.file
    return assign({ ext: ".js"}, babel(data.toString(), options))
  })
}
