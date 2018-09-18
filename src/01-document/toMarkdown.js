const setDefaults = require('../lib/setDefaults');
const defaults = {
  redirects: true,
  infoboxes: true,
  templates: true,
  sections: true,
};
// we should try to make this look like the wikipedia does, i guess.
const softRedirect = function(doc) {
  let link = doc.redirectTo();
  let href = link.page;
  href = './' + href.replace(/ /g, '_');
  if (link.anchor) {
    href += '#' + link.anchor;
  }
  return `↳ [${link.text}](${href})`;
};

//turn a Doc object into a markdown string
const toMarkdown = function(doc, options) {
  options = setDefaults(options, defaults);
  let data = doc.data;
  let md = '';
  //if it's a redirect page, give it a 'soft landing':
  if (options.redirects === true && doc.isRedirect() === true) {
    return softRedirect(doc); //end it here
  }
  //render infoboxes (up at the top)
  if (options.infoboxes === true && options.templates === true) {
    md += doc.infoboxes().map(infobox => infobox.markdown(options)).join('\n\n');
  }
  //render each section
  if (options.sections === true || options.paragraphs === true || options.sentences === true) {
    md += data.sections.map(s => s.markdown(options)).join('\n\n');
  }
  //default false
  if (options.citations === true) {
    md += '## References';
    md += doc.citations().map((o, i) => {
      if (o.data && o.data.url && o.data.title) {
        return `${i} - [${o.data.title}](${o.data.url})`;
      } else if (o.data.encyclopedia) {
        return `${i} - ${o.data.encyclopedia}`;
      } else if (o.data.title) { //cite book, etc
        let str = o.data.title;
        if (o.data.author) {
          str += o.data.author;
        }
        if (o.data.first && o.data.last) {
          str += o.data.first + ' ' + o.data.last;
        }
        return `${i} - ${str}`;
      } else if (o.inline) {
        return `${i} - ${o.inline.markdown()}`;
      }
      return '';
    }).join('\n');

  }
  return md;
};
module.exports = toMarkdown;
