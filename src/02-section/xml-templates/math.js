const parseSentence = require('../../04-sentence/').oneSentence;
//xml <math>y=mx+b</math> support
//https://en.wikipedia.org/wiki/Help:Displaying_a_formula
const parseMath = function(wiki, section) {
  wiki = wiki.replace(/<math([^>]*?)>([\s\S]+?)<\/math>/g, (_, attrs, inside) => {
    //clean it up a little
    let formula = parseSentence(inside).text();
    section.templates.push({
      template: 'math',
      formula: formula,
      raw: inside
    });
    return '';
  });
  return wiki;
};
module.exports = parseMath;
