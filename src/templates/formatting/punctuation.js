
// https://www.mediawiki.org/wiki/Help:Magic_words#Other
// okay, these just hurts my feelings
// https://en.wikipedia.org/wiki/Template:%C2%B7
let punctuation = [
  ['·', '·'],
  ['·', '·'],
  ['dot', '·'],
  ['middot', '·'],
  ['•', ' • '],
  //yup, oxford comma template
  [',', ','],
  ['1/2', '1⁄2'],
  ['1/3', '1⁄3'],
  ['2/3', '2⁄3'],
  ['1/4', '1⁄4'],
  ['3/4', '3⁄4'],
  ['–', '–'],
  ['ndash', '–'],
  ['en dash', '–'],

  ['—', '—'],
  ['mdash', '—'],
  ['em dash', '—'],

  ['number sign', '#'],
  ['ibeam', 'I'],
  ['&', '&'],
  [';', ';'],
  ['ampersand', '&'],
  ['snds', ' – '],
  // these '{{^}}' things are nuts, and used as some ilicit spacing thing.
  ['^', ' '],
  ['!', '|'],
  ['\\', ' /'],
  ['`', '`'],
  ['=', '='],
  ['bracket', '['],
  ['[', '['],
  ['*', '*'],
  ['asterisk', '*'],
  ['long dash', '———'],
// ['', ''],
];
const templates = {};
punctuation.forEach((a) => {
  templates[a[0]] = () => {
    return a[1];
  };
});
module.exports = templates;
