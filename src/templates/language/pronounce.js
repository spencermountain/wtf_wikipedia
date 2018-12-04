const parse = require('../_parsers/parse');
const languages = require('../../_data/languages');

const getLang = function(name) {
  //grab the language from the template name - 'ipa-de'
  let lang = name.match(/ipac?-(.+)/);
  if (lang !== null) {
    if (languages.hasOwnProperty(lang[1]) === true) {
      return languages[lang[1]].english_title;
    }
    return lang[1];
  }
  return null;
};

// pronounciation info
const templates = {
  // https://en.wikipedia.org/wiki/Template:IPA
  ipa: (tmpl, r) => {
    let obj = parse(tmpl, ['transcription', 'lang', 'audio']);
    obj.lang = getLang(obj.template);
    obj.template = 'ipa';
    r.templates.push(obj);
    return '';
  },
  //https://en.wikipedia.org/wiki/Template:IPAc-en
  ipac: (tmpl, r) => {
    let obj = parse(tmpl);
    obj.transcription = (obj.list || []).join(',');
    delete obj.list;
    obj.lang = getLang(obj.template);
    obj.template = 'ipac';
    r.templates.push(obj);
    return '';
  }
};
// - other languages -
// Polish, {{IPAc-pl}}	{{IPAc-pl|'|sz|cz|e|ć|i|n}} → [ˈʂt͡ʂɛt͡ɕin]
// Portuguese, {{IPAc-pt}}	{{IPAc-pt|p|o|<|r|t|u|'|g|a|l|lang=pt}} and {{IPAc-pt|b|r|a|'|s|i|l|lang=br}} → [puɾtuˈɣaɫ] and [bɾaˈsiw]
Object.keys(languages).forEach((lang) => {
  templates['ipa-' + lang] = templates.ipa;
  templates['ipac-' + lang] = templates.ipac;
});

module.exports = templates;
