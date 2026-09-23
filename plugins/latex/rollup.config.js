import pluginBuild from '../../scripts/rollup-plugin.js'

export default pluginBuild(import.meta.url, {
  global: 'wtfLatex',
  size: { expect: 10, warn: 10 },
})
