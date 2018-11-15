const parseSentence = require('../../04-sentence/').oneSentence;
//xml <math>y=mx+b</math> support
//https://en.wikipedia.org/wiki/Help:Displaying_a_formula
const parseMath = function(wiki, section) {
  wiki = wiki.replace(/<math([^>]*?)>([\s\S]+?)<\/math>/g, (_, attrs, inside) => {
    //clean it up a little?
    let formula = parseSentence(inside).text();
    section.templates.push({
      template: 'math',
      formula: formula,
      raw: inside
    });
    //should we atleast try to render it in plaintext? :/
    if (formula && formula.length < 12) {
      return formula;
    }
    return '';
  });
  //try chemistry version too
  wiki = wiki.replace(/<chem([^>]*?)>([\s\S]+?)<\/chem>/g, (_, attrs, inside) => {
    section.templates.push({
      template: 'chem',
      data: inside,
    });
    return '';
  });
  return wiki;
};
module.exports = parseMath;
