const aliasList = require('../lib/aliases');

const toHtml = (list) => {
  let html = '<ul class="list">\n';
  list.forEach((o) => {
    html += '  <li>' + o.text() + '</li>\n';
  });
  html += '</ul>\n';
  return html;
};

const toLatex = (list) => {
  let out = '\\begin{itemize}\n';
  list.forEach((o) => {
    out += '  \\item ' + o.text + '\n';
  });
  out += '\\end{itemize}\n';
  return out;
};

const toMarkdown = (list, options) => {
  return list.map((s) => {
    let str = s.markdown(options);
    return ' * ' + str;
  }).join('\n');
};

const toText = (list, options) => {
  return list.map((s) => {
    let str = s.text(options);
    return ' * ' + str;
  }).join('\n');
};

const List = function(data, wiki) {
  this.data = data;
  //hush this property in console.logs..
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki
  });
};

const methods = {
  wikitext() {
    return this.wiki;
  },
  links() {
    let links = [];
    this.data.forEach((s) => {
      links = links.concat(s.links());
    });
    return links;
  },
  html() {
    return toHtml(this.data);
  },
  latex() {
    return toLatex(this.data);
  },
  markdown() {
    return toMarkdown(this.data);
  },
  json() {
    return this.data.map(s => s.json());
  },
  text() {
    return toText(this.data);
  }
};

Object.keys(methods).forEach((k) => {
  List.prototype[k] = methods[k];
});
//add alises, too
Object.keys(aliasList).forEach((k) => {
  List.prototype[k] = methods[aliasList[k]];
});
module.exports = List;
