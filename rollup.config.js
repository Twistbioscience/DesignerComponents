// Rollup plugins
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';

const env = process.env.NODE_ENV;
const config = {
  input: 'src/index.js',
  plugins: [
    json({
      preferConst: true,
      compact: true
    }),
    babel({
      plugins: ['external-helpers']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
};

if (env === 'es' || env === 'cjs') {
  config.output = {format: env, indent: false};
  config.external = ['symbol-observable'];
}

if (env === 'development' || env === 'production') {
  config.output = {format: 'umd', name: 'DesignerComponents', indent: false};
}

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}

export default config;
