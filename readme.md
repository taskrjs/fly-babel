<div align="center">
  <a href="http://github.com/flyjs/fly">
    <img width=200px  src="https://cloud.githubusercontent.com/assets/8317250/8733685/0be81080-2c40-11e5-98d2-c634f076ccd7.png">
  </a>
</div>

# fly-babel [![][travis-badge]][travis-link]

> [Babel](http://babeljs.io) plugin for Fly.

## Install

```
npm install --save-dev fly-babel
```

## API

### .babel(options)

All Babel options can be found [here](http://babeljs.io/docs/usage/options/). 

> **Note:** For most cases, you only to think about `presets`, `plugins`, `sourceMaps`, `minified`, `comments`, and/or `babelrc`.

#### options.preload

Type: `boolean`<br>
Default: `false`

Automatically loads all babel-related plugins & presets from `package.json`. Will also auto-configure Babel to use these packages. See the [example](#preloading) for more.

## Usage

#### Basic

```js
exports.scripts = function * (fly) {
  yield fly.source('src/**/*.js')
    .babel({
      presets: ['es2015']
    })
    .target('dist/js')
}
```

#### Source Maps

You can create source maps for each file. 

Passing `true` will create an _external_ `.map` file. You may also use `'inline'` or `'both'`. Please see the [Babel options](http://babeljs.io/docs/usage/options/) for more information.

```js
exports.scripts = function * (fly) {
  yield fly.source('src/**/*.js')
    .babel({
      presets: ['es2015'],
      sourceMaps: true //=> external; also 'inline' or 'both'
    })
    .target('dist/js')
}
```

#### Preloading

For the especially lazy, you may "preload" all babel-related presets **and** plugins defined within your `package.json`. This spares you the need to define your `presets` and `plugins` values manually.

> **Note:** If you require a [complex configuration](http://babeljs.io/docs/plugins/#pluginpresets-options), you need to define that manually. While other plugins & presets will continue to "preload", your manual definitions will not be lost.

```js
exports.scripts = function * (fly) {
  yield fly.source('src/**/*.js')
    .babel({
      preload: true,
      plugins: [
        // complex plugin definition:
        ['transform-async-to-module-method', {
          'module': 'bluebird',
          'method': 'coroutine'
        }]
      ]
    })
    .target('dist');
  //=> after preloading:
  //=>   {
  //=>     presets: ['es2015'],
  //=>     plugins: [
  //=>       'transform-class-properties',
  //=>       ['transform-async-to-module-method', {...}]
  //=>     ]
  //=>   }
}
```

## License

MIT © [FlyJS](https://www.github.com/flyjs/fly)

[travis-link]:  https://travis-ci.org/flyjs/fly-babel
[travis-badge]: http://img.shields.io/travis/flyjs/fly-babel.svg?style=flat-square
