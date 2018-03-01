//turn wiki-markup into a nicely-formatted text
const plaintext = function(doc) {
  let arr = doc.sections().map(d => {
    return d.sentences.map(a => a.text).join(' ');
  });
  return arr.join('\n\n');
};

module.exports = plaintext;
