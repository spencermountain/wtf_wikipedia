const parse = require('./parse');
const defaults = {
  infoboxes: true,
  tables: true,
  lists: true,
  images: true,
  links: true,
  formatting: true,
  sentences: true,
};

const doInfobox = (infobox, options) => {
  let md = '';
  return md;
};
const doTable = (table) => {
  let md = '';
  return md;
};
const doImage = (image) => {
  let md = '';
  return md;
};
const doList = (list) => {
  let md = '';
  return md;
};

const doSentence = (sentence, options) => {
  let md = sentence.text;
  if (sentence.links) {
    //turn links back into links
    if (options.links === true) {
      sentence.links.forEach((link) => {
        let href = '';
        //if it's an external link, we good
        if (link.site) {
          href = link.site;
        } else {
          //otherwise, make it a relative internal link
          href = './' + link.page.replace(/ /g, '_');
        }
        let mdLink = '[' + link.text + '](' + href + ')';
        md = md.replace(link.text, mdLink);
      });
    }
  }
  return md;
};

const doSection = (section, options) => {
  let md = '';
  //make the header
  if (section.title) {
    let header = '##';
    for(let i = 0; i < section.depth; i += 1) {
      header += '#';
    }
    md += header + ' ' + section.title + '\n';
  }
  //put any images under the header
  if (section.images && options.images === true) {
    section.images.forEach((img) => {
      md += doImage(img);
    });
  }
  //make a mardown bullet-list
  if (section.lists && options.lists === true) {
    section.lists.forEach((list) => {
      md += doList(list);
    });
  }
  //finally, write the sentence text.
  if (section.sentences && options.sentences === true) {
    md += section.sentences.map((s) => doSentence(s, options)).join(' ');
  }
  return md;
};

const toMarkdown = function(str, options) {
  options = Object.assign(defaults, options);
  let data = parse(str, options);
  let md = '';
  //add the title on the top
  if (data.title) {
    md += '# ' + data.title;
  }
  //render infoboxes (up at the top)
  if (options.infoboxes === true && data.infoboxes) {
    md += data.infoboxes.map(o => doInfobox(o, options)).join('\n');
  }
  //render each section
  md += data.sections.map(s => doSection(s, options)).join('\n\n');
  return md;
};
module.exports = toMarkdown;
