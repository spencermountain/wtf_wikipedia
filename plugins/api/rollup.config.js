import pluginBuild from '../../scripts/rollup-plugin.js'

export default pluginBuild(import.meta.url, {
  global: 'wtfApi',
  size: { expect: 24, warn: 10 },
  resolve: true,
  commonjs: { requireReturnsDefault: 'auto' },
})
