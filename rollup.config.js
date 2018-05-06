
// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';
import rootImport from 'rollup-plugin-root-import';

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
    rootImport({
      // Will first look in `client/src/*` and then `common/src/*`.
      root: `${__dirname}/src`,
      useEntry: 'prepend',

      // If we don't find the file verbatim, try adding these extensions
      extensions: '.js'
    }),
    (process.env.NODE_ENV === 'production' && uglify()),
  ],
};



