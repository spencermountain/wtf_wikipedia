import makeResult from '../../templates/result.ts'
import defaults from '../../../_lib/defaults.ts'
import parseBlock from '../../block/index.ts'
import type { DocInfo, SectionData } from '../../../types/index.ts'
//parse out math and chem templates - e.g. xml <math>y=mx+b</math>
//https://en.wikipedia.org/wiki/Help:Displaying_a_formula
const parseMath = function (section: SectionData, opts: DocInfo = defaults) {
  section.remaining = section.remaining.replace(/<math([^>]*)>(.*?)<\/math>/gs, (wiki, attrs, inside) => {
    //clean it up a little?
    let formula = parseBlock(inside, opts).text
    const replacement = formula && formula.length < 12 ? formula : ''
    section.templates.push(makeResult(wiki, 'math', { formula }, replacement, opts))

    //should we at least try to render it in plaintext? :/
    if (formula && formula.length < 12) {
      return formula
    }

    //return empty string to remove the template from the wiki text
    return ''
  })

  //try chemistry version too
  section.remaining = section.remaining.replace(/<chem([^>]*)>(.*?)<\/chem>/gs, (wiki, attrs, inside) => {
    section.templates.push(makeResult(wiki, 'chem', { formula: inside }, '', opts))

    //return empty string to remove the template from the wiki text
    return ''
  })
  return section
}
export default parseMath
