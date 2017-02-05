/* eslint import/no-extraneous-dependencies: 0 */
'use strict';

const join = require('path').join;
const test = require('tape');
const Fly = require('fly');

const dir = join(__dirname, 'fixtures');
const tmp = join(__dirname, '.tmp');

test('fly-babel', t => {
	t.plan(16);

	const src = `${dir}/a.js`;
	const want = '"use strict";\n\nObject.defineProperty(exports, "__esModule"';

	const fly = new Fly({
		plugins: [
			require('../'),
			require('fly-clear')
		],
		tasks: {
			* a(f) {
				t.ok('babel' in fly.plugins, 'add the `babel` plugin');

				yield f.source(src).babel({presets: ['es2015']}).target(tmp);

				const arr = yield f.$.expand(`${tmp}/*`);
				const str = yield f.$.read(`${tmp}/a.js`, 'utf8');
				t.ok(str.length, 'via `presets`: write new file');
				t.equal(arr.length, 1, 'via `presets`: exclude sourcemaps by default');
				t.true(str.includes(want), 'via `presets`: transpile to es5 code');

				yield f.clear(tmp);
			},
			* b(f) {
				yield f.source(src).babel({preload: true}).target(tmp);

				const arr = yield f.$.expand(`${tmp}/*`);
				const str = yield f.$.read(`${tmp}/a.js`, 'utf8');
				t.equal(arr.length, 1, 'via `preload`: exclude sourcemaps by default');
				t.true(str.includes(want), 'via `preload`: transpile to es5 code');

				yield f.clear(tmp);
			},
			* c(f) {
				yield f.source(`${dir}/*.js`).babel({presets: ['es2015'], sourceMaps: true}).target(tmp);

				const arr = yield f.$.expand(`${tmp}/*`);
				const str = yield f.$.read(`${tmp}/a.js`, 'utf8');
				t.equal(arr.length, 2, 'via `sourceMaps: true`; create file & external sourcemap');
				t.true(/var a/.test(str), 'via `sourceMaps: true`; transpile to es5 code');
				t.true(/sourceMappingURL/.test(str), 'via `sourceMaps: true`; append `sourceMappingURL` link');

				yield f.clear(tmp);
			},
			* d(f) {
				yield f.source(`${dir}/*.js`).babel({presets: ['es2015'], sourceMaps: 'inline'}).target(tmp);

				const arr = yield f.$.expand(`${tmp}/*`);
				const str = yield f.$.read(`${tmp}/a.js`, 'utf8');
				t.ok(/var a/.test(str), 'via `sourceMaps: "inline"`; transpile to es5 code');
				t.equal(arr.length, 1, 'via `sourceMaps: "inline"`; do not create external sourcemap file');
				t.ok(/sourceMappingURL/.test(str), 'via `sourceMaps: "inline"`; embed `sourceMappingURL` content');

				yield f.clear(tmp);
			},
			* e(f) {
				yield f.source(`${dir}/*.js`).babel({presets: ['es2015'], sourceMaps: 'both'}).target(tmp);

				const arr = yield f.$.expand(`${tmp}/*`);
				const str = yield f.$.read(`${tmp}/a.js`, 'utf8');
				t.ok(/var a/.test(str), 'via `sourceMaps: "both"`; transpile to es5 code');
				t.equal(arr.length, 2, 'via `sourceMaps: "both"`; create external sourcemap file');
				t.ok(/sourceMappingURL/.test(str), 'via `sourceMaps: "both"`; embed `sourceMappingURL` content');

				yield f.clear(tmp);
			},
			* f(f) {
				yield f.source(`${dir}/*.js`).babel({
					preload: true,
					presets: [['es2015', {modules: 'systemjs'}]]
				}).target(tmp);

				const str = yield f.$.read(`${tmp}/a.js`, 'utf8');
				t.true(str.includes('System.register'), 'via `preload` + `presets`; keep detailed `presets` entry');

				yield f.clear(tmp);
			}
		}
	});

	fly.serial(['a', 'b', 'c', 'd', 'e', 'f']);
});
