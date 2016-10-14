'use strict';

const babel = require('babel-core').transform;
const readPkg = require('read-pkg-up');

const BABEL_REGEX = /(^babel-)(preset|plugin)-(.*)/i;

function getPlugins() {
	const pkg = readPkg.sync().pkg;
	return Object.keys(pkg.devDependencies || {});
}

function genConfig(deps) {
	const out = {};
	deps.forEach(dep => {
		const segs = BABEL_REGEX.exec(dep);
		if (segs) {
			const k = `${segs[2]}s`;
			out[k] = (out[k] || []).concat(segs[3]);
		}
	});
	return out;
}

module.exports = function () {
	let cache;
	let config;

	this.plugin('babel', {}, function * (file, opts) {
		if (opts.preload) {
			delete opts.preload;
			// get dependencies
			cache = cache || getPlugins();
			// attach any deps to babel options
			config = config || genConfig(cache);
			// update options
			Object.assign(opts, config);
		}

		// attach file's name
		opts.filename = file.base;

		const output = babel(file.data, opts);

		if (output.map) {
			const map = `${file.base}.map`;

			// append `sourceMappingURL` to original file
			if (opts.sourceMaps !== 'both') {
				output.code += new Buffer(`\n//# sourceMappingURL=${map}`);
			}

			// add sourcemap to `files` array
			this._.files.push({
				base: map,
				dir: file.dir,
				data: new Buffer(JSON.stringify(output.map))
			});
		}

		// update file's data
		file.data = new Buffer(output.code);
	});
};
