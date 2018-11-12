const strip = require('../_parsers/_strip');
// pronounciation info
// https://en.wikipedia.org/wiki/Template:IPA
const ipaTemplates = {
  ipa: (tmpl, r) => {
    let arr = strip(tmpl).split('|');
    let lang = arr[0].replace(/^ipa(c-)?/i, '');
    lang = lang || null;
    let obj = {
      template: 'ipa',
      lang: lang,
      ipa: arr.slice(1).join('')
    };
    r.templates.push(obj);
    return '';
  }
};
// - other languages -
// Polish, {{IPAc-pl}}	{{IPAc-pl|'|sz|cz|e|ć|i|n}} → [ˈʂt͡ʂɛt͡ɕin]
// Portuguese, {{IPAc-pt}}	{{IPAc-pt|p|o|<|r|t|u|'|g|a|l|lang=pt}} and {{IPAc-pt|b|r|a|'|s|i|l|lang=br}} → [puɾtuˈɣaɫ] and [bɾaˈsiw]
let i18n = [
  'ipac-ar',
  'ipac-cmn',
  'ipac-en',
  'ipac-es',
  'ipac-fr',
  'ipac-ga',
  'ipac-he',
  'ipac-hu',
  'ipac-it',
  'ipac-ja',
  'ipac-ka',
  'ipac-ko',
  'ipac-mh',
  'ipa-mg',
  'ipac-mi',
  'ipac-pl',
  'ipac-pt',
  'ipac-ro',
  'ipac-yue',
];
i18n.forEach((k) => ipaTemplates[k] = ipaTemplates.ipa);
module.exports = ipaTemplates;
