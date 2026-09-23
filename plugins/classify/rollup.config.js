import pluginBuild from '../../scripts/rollup-plugin.js'

export default pluginBuild(import.meta.url, {
  global: 'wtfClassify',
  size: { expect: 59, warn: 10 },
})
