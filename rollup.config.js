
// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/app/index.js',
  dest: 'build/app/index.min.js',
  format: 'iife',
  sourceMap: 'inline',
  watch: {
    include: 'src/**'
  },
  plugins: [
    eslint({
      exclude: [
        'src/styles/**',
      ]
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    resolve({ jsnext: true }),
    (process.env.NODE_ENV === 'production' && uglify()),
  ],
};