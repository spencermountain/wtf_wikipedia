import pluginBuild from '../../scripts/rollup-plugin.js'

export default pluginBuild(import.meta.url, {
  global: 'wtfDebug',
})
