import { fromText as parseSentence } from '../../04-sentence/index.js'

//parse out math and chem templates - e.g. xml <math>y=mx+b</math>
//https://en.wikipedia.org/wiki/Help:Displaying_a_formula
const parseMath = function (catcher) {
  catcher.text = catcher.text.replace(/<math([^>]*)>([\s\S]*?)<\/math>/g, (_, attrs, inside) => {
    //clean it up a little?
    let formula = parseSentence(inside).text()
    catcher.templates.push({
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
  catcher.text = catcher.text.replace(/<chem([^>]*)>([\s\S]*?)<\/chem>/g, (_, attrs, inside) => {
    catcher.templates.push({
      template: 'chem',
      data: inside,
    })

    //return empty string to remove the template from the wiki text
    return ''
  })
}
export default parseMath
