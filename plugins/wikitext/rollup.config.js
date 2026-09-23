import pluginBuild from '../../scripts/rollup-plugin.js'

export default pluginBuild(import.meta.url, {
  global: 'wtfWikitext',
  size: { expect: 10, warn: 10 },
})
