const setDefaults = require('../lib/setDefaults');
const defaults = {
  title: true,
  infoboxes: true,
  headers: true,
  sections: true,
  links: true,
};
// we should try to make this look like the wikipedia does, i guess.
const softRedirect = function(doc) {
  let link = doc.redirectTo();
  let href = link.page;
  href = './' + href.replace(/ /g, '_');
  if (link.anchor) {
    href += '#' + link.anchor;
  }
  return `  <div class="redirect">
  ↳ <a class="link" href="./${href}">${link.text}</a>
  </div>`;
};

//turn a Doc object into a HTML string
const toHtml = function(doc, options) {
  options = setDefaults(options, defaults);
  let data = doc.data;
  let html = '';
  html += '<!DOCTYPE html>\n';
  html += '<html>\n';
  html += '<head>\n';
  //add page title
  if (options.title === true && data.title) {
    html += '<title>' + data.title + '</title>\n';
  }
  html += '</head>\n';
  html += '<body>\n';

  //if it's a redirect page, give it a 'soft landing':
  if (doc.isRedirect() === true) {
    html += softRedirect(doc);
    return html + '\n</body>\n</html>'; //end it here.
  }
  //render infoboxes (up at the top)
  if (options.infoboxes === true) {
    html += doc.infoboxes().map(i => i.html(options)).join('\n');
  }
  //render each section
  if (options.sections === true && (options.paragraphs === true || options.sentences === true)) {
    html += data.sections.map(s => s.html(options)).join('\n');
  }
  //default off
  if (options.citations === true) {
    html += '<h2>References</h2>';
    html += doc.citations().map((o, i) => {
      if (o.data && o.data.url && o.data.title) {
        let str = o.data.title;
        if (options.links === true) {
          str = `<a href="${o.data.url}">${str}</a>`;
        }
        return `<div class="citation">${i} - ${str} </div>`;
      } else if (o.data.encyclopedia) {
        return `<div class="citation">${i} - ${o.data.encyclopedia}</div>`;
      } else if (o.data.title) { //cite book, etc
        let str = o.data.title;
        if (o.data.author) {
          str += o.data.author;
        }
        if (o.data.first && o.data.last) {
          str += o.data.first + ' ' + o.data.last;
        }
        return `<div class="citation">${i} - ${str}</div>`;
      } else if (o.inline) {
        return `<div class="citation">${i} - ${o.inline.html()}</div>`;
      }
      return '';
    }).join('\n');
  }
  html += '</body>\n';
  html += '</html>';
  return html;
};
module.exports = toHtml;
