
//
const formatting = function(obj) {
  let bolds = [];
  let italics = [];
  let wiki = obj.text || '';
  //bold and italics combined
  wiki = wiki.replace(/''{4}([^']{0,200})''{4}/g, (a, b) => {
    bolds.push(b);
    italics.push(b);
    return b;
  });
  //bold
  wiki = wiki.replace(/''{2}([^']{0,200})''{2}/g, (a, b) => {
    bolds.push(b);
    return b;
  });
  //italic
  wiki = wiki.replace(/''([^']{0,200})''/g, (a, b) => {
    italics.push(b);
    return b;
  });

  //pack it all up..
  obj.text = wiki;
  obj.fmt = {};
  if (bolds.length > 0) {
    obj.fmt.bold = bolds;
  }
  if (italics.length > 0) {
    obj.fmt.italic = italics;
  }
  return obj;
};
module.exports = formatting;
