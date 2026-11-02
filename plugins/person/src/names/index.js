import byInfobox from '../getInfobox.js'

// the subject's common name is usually the first bold text of the first sentence
const firstBold = function (doc) {
  const s = doc.sentences()[0]
  if (!s) {
    return null
  }
  const bolds = s.bolds()
  if (bolds[0] && bolds[0].text) {
    return bolds[0].text
  }
  return null
}

const aliasFields = ['nickname', 'nicknames', 'other_names', 'other_name', 'alias', 'aliases', 'stage_name']

const names = function (doc) {
  const name = byInfobox(doc, ['name']) || firstBold(doc) || doc.title || null
  const birthName = byInfobox(doc, ['birth_name', 'birthname', 'full_name', 'fullname', 'real_name'])
  let aliases = []
  aliasFields.forEach((field) => {
    const str = byInfobox(doc, [field])
    if (str) {
      aliases = aliases.concat(str.split(/[·,\n]/))
    }
  })
  aliases = aliases.map((str) => str.trim()).filter((str) => str)
  if (!name && !birthName && aliases.length === 0) {
    return null
  }
  return { name: name, birthName: birthName, aliases: aliases }
}
export default names
