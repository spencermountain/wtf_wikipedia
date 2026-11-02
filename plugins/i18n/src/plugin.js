// wraps one or more data packs as a wtf plugin:
//   import fr from 'wtf-plugin-i18n/fr'
//   import plugin from 'wtf-plugin-i18n/plugin'
//   wtf.extend(plugin(fr))
import register from './register.js'
import version from './_version.js'

const plugin = (...packs) => {
  const fn = (_models, templates, infoboxes, i18n) => {
    packs.forEach((data) => register(data, templates, infoboxes, i18n))
  }
  if (packs.length === 1) {
    fn.lang = packs[0].lang
  }
  fn.version = version
  return fn
}

export default plugin
