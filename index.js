const assign = require('object-assign')
const babel = require('babel-core').transform
const ext = '.js'

module.exports = function () {
	return this.filter('babel', function (data, opts) {
		// prepare babel config, "clones" `opts`
		var config = assign({filename: opts.file.base}, opts)
		delete config.file
		// compile output
		data = babel(data.toString(), config)

		// force `.js` file type
		opts.file.ext = ext

		// check for `sourceMaps: true`
		// if (data.map) {
			// write a new sourcemap file, with '.js.map' extn
		// }

		return {ext: ext, code: data.code}
	})
}
