module.exports = function () {
  return this.filter("babel", (src, opts) => {
    try { return require("babel").transform(src, opts).code }
    catch (e) { throw e }
  }, { ext: ".js" })
}
