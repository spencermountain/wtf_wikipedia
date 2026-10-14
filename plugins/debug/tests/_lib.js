import loadPlugin from '../../../tests/lib/plugin.js'

export default await loadPlugin(new URL('../', import.meta.url))
