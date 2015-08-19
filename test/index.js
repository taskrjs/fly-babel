const test = require("tape").test
const babel = require("../")

test("fly-babel", (t) => {
  t.plan(3)
  babel.call({
    filter: function (name, transform) {
      const result = transform("let a = 0")
      t.equal(name, "babel", "add babel filter")
      t.ok(/var a/.test(result.code), "babel transform")
      t.equal(result.ext, ".js", "extension is .js")
    }
  })
})
