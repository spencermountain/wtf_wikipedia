//turn a json table into a html table
const toHtml = function(table, options) {
  let html = '<table class="table">\n';
  //make header
  html += '  <thead>\n';
  html += '  <tr>\n';
  Object.keys(table[0]).forEach((k) => {
    if (/^col[0-9]/.test(k) !== true) {
      html += '    <td>' + k + '</td>\n';
    }
  });
  html += '  </tr>\n';
  html += '  </thead>\n';
  html += '  <tbody>\n';
  //make rows
  table.forEach((o) => {
    html += '  <tr>\n';
    Object.keys(o).forEach((k) => {
      let val = o[k].html(options);
      html += '    <td>' + val + '</td>\n';
    });
    html += '  </tr>\n';
  });
  html += '  </tbody>\n';
  html += '</table>\n';
  return html;
};
module.exports = toHtml;
