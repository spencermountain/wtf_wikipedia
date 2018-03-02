const doTable = require('./table');
const doSentence = require('./sentence');
const doImage = require('./image');

const doList = (list, options) => {
  return list.map((o) => {
    let str = doSentence(o, options);
    return ' * ' + str;
  }).join('\n');
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
  if (section.images() && options.images === true) {
    md += section.images().map((img) => doImage(img)).join('\n');
    md += '\n';
  }
  //make a mardown table
  if (section.tables() && options.tables === true) {
    md += '\n';
    md += section.tables().map((table) => doTable(table, options)).join('\n');
    md += '\n';
  }
  //make a mardown bullet-list
  if (section.lists() && options.lists === true) {
    md += section.lists().map((list) => doList(list, options)).join('\n');
    md += '\n';
  }
  //finally, write the sentence text.
  if (section.sentences() && options.sentences === true) {
    md += section.sentences().map((s) => doSentence(s, options)).join(' ');
  }
  return md;
};
module.exports = doSection;
