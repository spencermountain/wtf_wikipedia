
//
const toMarkdown = function(c) {
  if (c.data && c.data.url && c.data.title) {
    return `⌃ [${c.data.title}](${c.data.url})`;
  } else if (c.data.encyclopedia) {
    return `⌃ ${c.data.encyclopedia}`;
  } else if (c.data.title) { //cite book, etc
    let str = c.data.title;
    if (c.data.author) {
      str += c.data.author;
    }
    if (c.data.first && c.data.last) {
      str += c.data.first + ' ' + c.data.last;
    }
    return `⌃ ${str}`;
  } else if (c.inline) {
    return `⌃ ${c.inline.markdown()}`;
  }
  return '';
};
module.exports = toMarkdown;
