/* eslint-env node */
const path = require('path');
const commonjs = require('@rollup/plugin-commonjs');
const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
module.exports = {
  input: path.join(__dirname, './bundle.js'),
  output: {
    file: path.join(__dirname, './umd/mapbox-sdk.js'),
    format: 'umd',
    name: 'mapboxSdk'
  },
  plugins: [
    nodeResolve({
      browser: true
    }),
    babel(),
    commonjs(),
    terser()
  ]
};
