'use strict';

const babel = require('babel-core').transform;
const readPkg = require('read-pkg-up');

const BABEL_REGEX = /(^babel-)(preset|plugin)-(.*)/i;

function * getPlugins() {
  const pkg = yield readPkg().pkg;
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
      cache = cache || yield getPlugins();
      // attach any deps to babel options
      config = config || genConfig(cache);
      // update options
      Object.assign(opts, config);
    }

    // attach file's name
    opts.filename = file.name;

    // update file's data
    file.data = babel(file.data.toString(), opts);
  });
};
