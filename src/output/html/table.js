const doSentence = require('./sentence');


const doTable = function(table, options) {
  let html = '<table>\n';
  //make header
  html += '  <thead>';
  Object.keys(table[0]).forEach((k) => {
    html += '    <td>' + k + '</td>\n';
  });
  html += '  </thead>';
  html += '  <tbody>';
  //make rows
  table.forEach((o) => {
    html += '  <tr>\n';
    Object.keys(o).forEach((k) => {
      let val = doSentence(o[k], options);
      html += '    <td>' + val + '</td>\n';
    });
    html += '  </tr>\n';
  });
  html += '  </tbody>';
  html += '</table>\n';
  return html;
};
module.exports = doTable;
