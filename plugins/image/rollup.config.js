import pluginBuild from '../../scripts/rollup-plugin.js'

export default pluginBuild(import.meta.url, {
  global: 'wtfImage',
  size: { expect: 24, warn: 10 },
  transpile: true,
})
