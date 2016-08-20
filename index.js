const babel = require("babel-core").transform
const assign = require("object-assign")
const readPkg = require("read-pkg-up")
const BABEL_REGEX = /(^babel-preset)-(.*)/ig

module.exports = function () {
  var cache
  return this.filter("babel", function (data, options) {
    if (options.preload) {
      delete options.preload
      var pkg = cache || (cache = readPkg.sync().pkg)
      options.presets = Object.keys(pkg.devDependencies || {}).reduce(function (acc, value) {
        var matches = BABEL_REGEX.exec(value)
        return matches ? (acc.concat(matches[2])) : acc
      }, [])
    }
    options.filename = options.file.base
    delete options.file
    return assign({ext: ".js"}, babel(data.toString(), options))
  })
}
