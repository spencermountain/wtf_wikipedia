import pluginBuild from '../../scripts/rollup-plugin.js'

export default pluginBuild(import.meta.url, {
  global: 'wtfMarkdown',
  size: { expect: 10, warn: 10 },
})
