/*! wtf-plugin-disambig 1.0.0 MIT */
// const birthDate = require('./birthDate')
const shouldSkip = /see also/;

function escapeRegExp(str) {
  str = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  return new RegExp(str, 'i')
}

const parseLine = function (line) {
  const link = line.link(0);
  if (!link || link.type() !== 'internal') {
    return null
  }
  let desc = line.text();
  const reg = escapeRegExp(link.text());
  // ensure the link is toward the start of the sentence
  const m = desc.match(reg);
  if (!m || m.index > 20) {
    return null
  }
  desc = desc.replace(reg, '');
  desc = desc.replace(/[,:]? ?/, '');
  return {
    link: link.page(),
    desc: desc,
  }
};

// A '''[[berry]]''' is a small, pulpy and often edible fruit in non-technical language.
const getMain = function (s) {
  const txt = s.text().slice(0, 120);
  if (!/ is /.test(txt)) {
    return null
  }
  const link = s.link(0);
  if (!link) {
    return null
  }
  const reg = escapeRegExp(link.text());
  // ensure the link is toward the start of the sentence
  const m = txt.match(reg);
  if (!m || m.index > 20) {
    return null
  }
  return link.page()
};

const getTitle = function (doc) {
  let title = doc.title() || '';
  title = title.replace(/ \(disambig|disambiguation\)$/, '');
  return title
};

const addMethod = function (models) {
  // parse a disambiguation page into an array of pages
  models.Doc.prototype.disambiguation = function () {
    if (this.isDisambiguation() !== true) {
      return null
    }
    // remove 'see also'
    const sec = this.section('see also');
    if (sec !== null) {
      sec.remove();
    }
    const intro = this.section().sentence();
    const main = getMain(intro);

    const pages = [];
    this.sections().forEach((s) => {
      const title = s.title();
      if (shouldSkip.test(title) === true) {
        return
      }
      s.lists().forEach((list) => {
        list.lines().forEach((line) => {
          const found = parseLine(line);
          if (found) {
            found.section = title;
            pages.push(found);
          }
        });
      });
    });
    return {
      text: getTitle(this),
      main: main,
      pages: pages,
    }
  };
  // alias
  models.Doc.prototype.disambig = models.Doc.prototype.disambiguation;
};

export { addMethod as default };
