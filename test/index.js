var test = require("tape").test
var babel = require("../")

test("fly-babel", function (t) {
  t.plan(5)
  babel.call({
    filter: function (name, transform) {
      const content = "let a = 0"
      const result = transform(content, {file: {}, presets: ["es2015"]})
      const map = transform(content, {file: {}, sourceMaps: true}).map

      t.equal(name, "babel", "add babel filter")
      t.ok(/var a/.test(result.code), "babel transform")
      t.equal(result.ext, ".js", "extension is .js")
      t.equal(result.map, null, "no sourcemaps by default")
      t.equal(map.sourcesContent[0], content, "turn on sourcemaps")
    }
  })
})
