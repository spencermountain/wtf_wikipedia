const languages = require('../../_data/languages');
const pipeSplit = require('../_parsers/pipeSplit');

const templates = {

  lang: (tmpl) => {
    let order = ['lang', 'text'];
    let obj = pipeSplit(tmpl, order);
    return obj.text;
  },
  //this one has a million variants
  'lang-de': (tmpl) => {
    let order = ['text'];
    let obj = pipeSplit(tmpl, order);
    return obj.text;
  },
  'rtl-lang': (tmpl) => {
    let order = ['lang', 'text'];
    let obj = pipeSplit(tmpl, order);
    return obj.text;
  },
  //german keyboard letterscn
  taste: (tmpl) => {
    let obj = pipeSplit(tmpl, ['key']);
    return obj.key || '';
  },
  //https://en.wikipedia.org/wiki/Template:Nihongo
  nihongo: (tmpl, r) => {
    let obj = pipeSplit(tmpl, ['english', 'kanji', 'romaji', 'extra']);
    r.templates.push(obj);
    let str = obj.english || obj.romaji || '';
    if (obj.kanji) {
      str += ` (${obj.kanji})`;
    }
    return str;
  }
};
//https://en.wikipedia.org/wiki/Category:Lang-x_templates
Object.keys(languages).forEach((k) => {
  templates['lang-' + k] = templates['lang-de'];
});
templates['nihongo2'] = templates.nihongo;
templates['nihongo3'] = templates.nihongo;
templates['nihongo-s'] = templates.nihongo;
templates['nihongo foot'] = templates.nihongo;
module.exports = templates;
