import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import cssnext from 'postcss-cssnext'
import image from 'rollup-plugin-img'

export default {
  input: 'test/index.js',
  output: {
    file: 'dist/test.js',
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
    })
  ]
}
