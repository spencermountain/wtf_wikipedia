import { fromText as parseSentence } from '../../../API/04-sentence/index.ts'
import type { SectionData } from '../../../types/index.ts'
//parse out math and chem templates - e.g. xml <math>y=mx+b</math>
//https://en.wikipedia.org/wiki/Help:Displaying_a_formula
const parseMath = function (section: SectionData) {
  section.remaining = section.remaining.replace(/<math([^>]*)>(.*?)<\/math>/gs, (_, attrs, inside) => {
    //clean it up a little?
    let formula = parseSentence(inside).text()
    section.templates.push({
      template: 'math',
      formula: formula,
      raw: inside,
    })

    //should we at least try to render it in plaintext? :/
    if (formula && formula.length < 12) {
      return formula
    }

    //return empty string to remove the template from the wiki text
    return ''
  })

  //try chemistry version too
  section.remaining = section.remaining.replace(/<chem([^>]*)>(.*?)<\/chem>/gs, (_, attrs, inside) => {
    section.templates.push({
      template: 'chem',
      data: inside,
    })

    //return empty string to remove the template from the wiki text
    return ''
  })
  return section
}
export default parseMath
