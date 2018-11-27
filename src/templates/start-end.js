//these templates are a nightmare...
//{{template-start}} data is here {{template-end}}
const startEnd = function(tmpl, wiki, name, data) {
  let start = name;
  let end = name.replace(/ (start|begin)$/, ' end');
  if (wiki.indexOf(end) !== -1) {
    console.log(`---- ${start}  →   ${end}`);
  }
  return wiki;
};
module.exports = startEnd;
