import pluginBuild from '../../scripts/rollup-plugin.js'

export default pluginBuild(import.meta.url, {
  global: 'wtfDisambig',
  size: { expect: 55, warn: 15 },
  resolve: true,
  commonjs: { requireReturnsDefault: 'auto' },
})
