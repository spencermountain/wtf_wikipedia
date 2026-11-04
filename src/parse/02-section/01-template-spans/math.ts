import makeResult from '../../templates/result.ts'
import defaults from '../../../_lib/defaults.ts'
import parseBlock from '../../block/index.ts'
import type { DocInfo, SectionData } from '../../../types/index.ts'

//stop at the next opening tag, so that repeated unclosed tags don't each scan to the end of the page
const mathReg = /<math((?:(?!<math)[^>])*)>((?:(?!<math).)*?)<\/math>/gs
const chemReg = /<chem((?:(?!<chem)[^>])*)>((?:(?!<chem).)*?)<\/chem>/gs

//parse out math and chem templates - e.g. xml <math>y=mx+b</math>
//https://en.wikipedia.org/wiki/Help:Displaying_a_formula
const parseMath = function (section: SectionData, opts: DocInfo = defaults) {
  section.remaining = section.remaining.replace(mathReg, (wiki, attrs, inside) => {
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
  section.remaining = section.remaining.replace(chemReg, (wiki, attrs, inside) => {
    section.templates.push(makeResult(wiki, 'chem', { formula: inside }, '', opts))

    //return empty string to remove the template from the wiki text
    return ''
  })
  return section
}
export default parseMath
