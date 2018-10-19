import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import cssnext from 'postcss-cssnext'
import image from 'rollup-plugin-img'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'test/time-slicing/index.jsx',
  output: {
    file: 'test/public/test.js',
    format: 'cjs'
  },
  watch: {
    include: ['test/**', 'src/**']
  },
  plugins: [
    postcss({
      extensions: ['.css'],
      plugins: [
        cssnext()
      ]
    }),
    image({
      limit: 10000
    }),
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    serve('test/public'),
    livereload({
      watch: './test/public'
    })
  ],
  external: ['lodash', 'victory']
}
