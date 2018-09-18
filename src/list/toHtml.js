
//
const toHtml = (list, options) => {
  let html = '  <ul class="list">\n';
  list.forEach((o) => {
    html += '    <li>' + o.html(options) + '</li>\n';
  });
  html += '  </ul>\n';
  return html;
};
module.exports = toHtml;
