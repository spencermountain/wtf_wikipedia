import wtf from '../../../src/index.js'
import languages from '../../../src/_data/languages.js'
const langs = Object.keys(languages)

for (let i = 0; i < langs.length; i += 1) {
  const lang = langs[i]
  const doc = await wtf.fetch('Toronto', lang)
  if (!doc) {
    // console.log('no doc for', lang)
    continue
  }
  const infobox = doc.infobox()
  if (!infobox) {
    // console.log('no infobox for', lang)
    continue
  }
  const coordinates = infobox.coordinates()
  if (!coordinates) {
    //eslint-disable-next-line no-console
    console.log(lang, infobox.json())
    continue
  }
  // console.log('✅', lang, coordinates)
}
