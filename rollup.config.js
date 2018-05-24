
// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';
import rootImport from 'rollup-plugin-root-import';
import commonjs from 'rollup-plugin-commonjs';
// import serve from 'rollup-plugin-serve'

export default {
  entry: 'src/index.js',
  dest: 'build/index.min.js',
  format: 'es',
  sourceMap: 'inline',
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
    commonjs(),
    rootImport({
      // Will first look in `client/src/*` and then `common/src/*`.
      root: `${__dirname}/src`,
      useEntry: 'prepend',

      // If we don't find the file verbatim, try adding these extensions
      extensions: '.js'
    }),
    // serve({
    //   // Launch in browser (default: false)
    //   open: true,

    //   // Show server address in console (default: true)
    //   verbose: false,

    //   // Folder to serve files from
    //   contentBase: '',

    //   // Multiple folders to serve from
    //   contentBase: ['build/app', 'static'],

    //   // Set to true to return index.html instead of 404
    //   historyApiFallback: false,

    //   // Options used in setting up server
    //   host: 'localhost',
    //   port: 10001,


    //   //set headers
    //   headers: {
    //     foo: 'bar'
    //   }
    // }),
    (process.env.NODE_ENV === 'production' && uglify()),
  ],
};



