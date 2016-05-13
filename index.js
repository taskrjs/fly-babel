const babel = require("babel-core").transform
const assign = require("object-assign")

module.exports = function () {
  return this.filter("babel", function (data, options) {
    options.filename = options.file.base
    delete options.file
    return assign({ ext: ".js"}, babel(data.toString(), options))
  })
}
