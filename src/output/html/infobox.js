const doSentence = require('./sentence');

const dontDo = {
  image: true,
  caption: true
};
//
const infobox = function(obj, options) {
  let html = '<table>\n';
  Object.keys(obj.data).forEach((k) => {
    if (dontDo[k] === true) {
      return;
    }
    let val = doSentence(obj.data[k], options);
    html += '  <tr>\n';
    html += '    <td>' + k + '</td>\n';
    html += '    <td>' + val + '</td>\n';
    html += '  </tr>\n';
  });
  html += '</table>\n';
  return html;
};
module.exports = infobox;
