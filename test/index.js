const test = require("tape").test
const babel = require("../")

test("fly-babel", (t) => {
  t.plan(5)
  babel.call({
    filter: function (name, transform) {
      const content = "let a = 0"
      const result = transform(content, {presets: ["es2015"]})
      const map = transform(content, {sourceMaps: true}).map

      t.equal(name, "babel", "add babel filter")
      t.ok(/var a/.test(result.code), "babel transform")
      t.equal(result.ext, ".js", "extension is .js")
      t.equal(result.map, null, "no sourcemaps by default")
      t.equal(map.sourcesContent[0], content, "turn on sourcemaps")
    }
  })
})
