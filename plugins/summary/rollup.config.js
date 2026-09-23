import pluginBuild from '../../scripts/rollup-plugin.js'

export default pluginBuild(import.meta.url, {
  global: 'wtfSummary',
  size: { expect: 184, warn: 10 },
  resolve: true,
})
