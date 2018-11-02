
//handle the bold/italics
const formatting = function(obj) {
  let bolds = [];
  let italics = [];
  let wiki = obj.text || '';
  //bold and italics combined 5 's
  wiki = wiki.replace(/'''''(.{0,200}?)'''''/g, (a, b) => {
    bolds.push(b);
    italics.push(b);
    return b;
  });
  //''''four'''' → bold with quotes
  wiki = wiki.replace(/''''(.{0,200}?)''''/g, (a, b) => {
    bolds.push(`'${b}'`);
    return `'${b}'`;
  });
  //'''bold'''
  wiki = wiki.replace(/'''(.{0,200}?)'''/g, (a, b) => {
    bolds.push(b);
    return b;
  });
  //''italic''
  wiki = wiki.replace(/''(.{0,200}?)''/g, (a, b) => {
    italics.push(b);
    return b;
  });

  //pack it all up..
  obj.text = wiki;
  if (bolds.length > 0) {
    obj.fmt = obj.fmt || {};
    obj.fmt.bold = bolds;
  }
  if (italics.length > 0) {
    obj.fmt = obj.fmt || {};
    obj.fmt.italic = italics;
  }
  return obj;
};
module.exports = formatting;
