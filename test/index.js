const test = require("tape").test
const bind = require("fly-util").bind
const babel = require(bind("../"))

test("fly-babel", (t) => {
  t.plan(3)
  babel.call({
    filter: function (name, transform, options) {
      t.equal(name, "babel", "add babel filter")
      t.ok(/var a/.test(transform("let a = 0")), "babel transform")
      t.equal(options.ext, ".js", "extension is .js")
    }
  })
})
