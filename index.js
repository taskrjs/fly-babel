module.exports = function () {
  return this.filter("babel", (data, options) => {
    return require("babel-core").transform(data.toString(), options).code
  }, { ext: ".js" })
}
