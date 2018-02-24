const parse = require('../../parse');
const doTable = require('./table');
const doInfobox = require('./infobox');
const doSentence = require('./sentence');

const defaults = {
  infoboxes: true,
  tables: true,
  lists: true,
  title: true,
  images: true,
  links: true,
  formatting: true,
  sentences: true,
};

const doList = (list, options) => {
  return list.map((o) => {
    let str = doSentence(o, options);
    return ' * ' + str;
  }).join('\n');
};

//markdown images are like this: ![alt text](href)
const doImage = (image) => {
  let alt = image.file.replace(/^(file|image):/i, '');
  alt = alt.replace(/\.(jpg|jpeg|png|gif|svg)/i, '');
  return '![' + alt + '](' + image.thumb + ')';
};

const doSection = (section, options) => {
  let md = '';
  //make the header
  if (options.title === true && section.title) {
    let header = '##';
    for(let i = 0; i < section.depth; i += 1) {
      header += '#';
    }
    md += header + ' ' + section.title + '\n';
  }
  //put any images under the header
  if (section.images && options.images === true) {
    md += section.images.map((img) => doImage(img)).join('\n');
    md += '\n';
  }
  //make a mardown table
  if (section.tables && options.tables === true) {
    md += '\n';
    md += section.tables.map((table) => doTable(table, options)).join('\n');
    md += '\n';
  }
  //make a mardown bullet-list
  if (section.lists && options.lists === true) {
    md += section.lists.map((list) => doList(list, options)).join('\n');
    md += '\n';
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
  // if (data.title) {
  //   md += '# ' + data.title + '\n';
  // }
  //render infoboxes (up at the top)
  if (options.infoboxes === true && data.infoboxes) {
    md += data.infoboxes.map(o => doInfobox(o, options)).join('\n');
  }
  //render each section
  md += data.sections.map(s => doSection(s, options)).join('\n\n');
  return md;
};
module.exports = toMarkdown;
