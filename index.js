'use strict';

const babel = require('babel-core').transform;
const readPkg = require('read-pkg-up');

const BABEL_REGEX = /(^babel-)(preset|plugin)-(.*)/i;

function getBabels() {
	const pkg = readPkg.sync().pkg;
	return ['devDependencies', 'dependencies']
			.map(s => Object.keys(pkg[s] || {}))
			.reduce((a, b) => a.concat(b))
			.filter(s => BABEL_REGEX.test(s));
}

function genConfig(deps) {
	const out = {};
	deps.forEach(dep => {
		const segs = BABEL_REGEX.exec(dep);
		const k = `${segs[2]}s`;
		out[k] = (out[k] || []).concat(segs[3]);
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
			cache = cache || getBabels();
			console.log('this is cache: ', cache);
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
