const babel = require("babel-core").transform
const assign = require("object-assign")

module.exports = function () {
  return this.filter("babel", (data, options) => {
    return assign({ ext: ".js"}, babel(data.toString(), options))
  })
}
