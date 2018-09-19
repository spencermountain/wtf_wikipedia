
//
const toHtml = function(c, options) {
  if (c.data && c.data.url && c.data.title) {
    let str = c.data.title;
    if (options.links === true) {
      str = `<a href="${c.data.url}">${str}</a>`;
    }
    return `<div class="reference">⌃ ${str} </div>`;
  }
  if (c.data.encyclopedia) {
    return `<div class="reference">⌃ ${c.data.encyclopedia}</div>`;
  }
  if (c.data.title) { //cite book, etc
    let str = c.data.title;
    if (c.data.author) {
      str += c.data.author;
    }
    if (c.data.first && c.data.last) {
      str += c.data.first + ' ' + c.data.last;
    }
    return `<div class="reference">⌃ ${str}</div>`;
  }
  if (c.inline) {
    return `<div class="reference">⌃ ${c.inline.html()}</div>`;
  }
  return '';
};
module.exports = toHtml;
