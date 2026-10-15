import { trim_whitespace } from '../../_lib/helpers.ts'
import { fromText as parseSentence } from '../../../API/04-sentence/index.ts'
// import parseReferences from '../../API/reference/index.ts'
// import getTemplates from '../../API/template/find/01-nested.ts'
// import parseTemplates from '../../API/template/parse/index.ts'
const heading_reg = /^(={1,6})(.{1,200}?)={1,6}$/ //eslint-disable-line
// Commit to the first opening delimiter on each line before looking for its end.
// const hasTemplate = /^(?=(.*?\{\{))\1.+?\}\}/m

// const doInlineTemplates = function (wiki, doc?) {
//   let list = getTemplates(wiki)
//   list.forEach((item) => {
//     let [txt] = parseTemplates(item, doc)
//     wiki = wiki.replace(item.body, txt)
//   })
//   return wiki
// }

//estimates the depth of a section and normalizes its title
const parseHeading = function (heading: string) {
  let [_, prefix, title] = heading.match(heading_reg) || []
  if (!prefix || !title) {
    return { title: '', depth: 0 }
  }

  title = parseSentence(title).text()
  //trim leading/trailing whitespace
  title = trim_whitespace(title)
  // count number of == characters to determine depth
  let depth = prefix.length - 2

  //amazingly, you can see inline {{templates}} in this text, too
  // if (hasTemplate.test(title)) {
  // title = doInlineTemplates(title)
  // }
  //same for references (i know..)
  // let obj = { _wiki: title }
  // parseReferences(obj)
  // title = obj._wiki

  return { title, depth }
}

export default parseHeading
