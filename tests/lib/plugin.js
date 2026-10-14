import { readFileSync } from 'node:fs'
import wtf from './index.js'

export default async function loadPlugin(directory, exports = ['default']) {
  const { name } = JSON.parse(readFileSync(new URL('package.json', directory), 'utf8'))
  const entry = process.env.TESTENV === 'prod' ? `builds/${name}.mjs` : 'src/index.js'
  const plugin = await import(new URL(entry, directory))
  exports.forEach((exportName) => wtf.plugin(plugin[exportName]))
  return wtf
}
