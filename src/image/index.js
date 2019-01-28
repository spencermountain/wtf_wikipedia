const i18n = require('../_data/i18n');
const Image = require('./Image');
const parseTemplate = require('../templates/_parsers/parse');
const parseSentence = require('../04-sentence').oneSentence;
//regexes:
const isFile = new RegExp('(' + i18n.images.concat(i18n.files).join('|') + '):', 'i');
let fileNames = `(${i18n.images.concat(i18n.files).join('|')})`;
const file_reg = new RegExp(fileNames + ':(.+?)[\\||\\]]', 'i');

//style directives for Wikipedia:Extended_image_syntax
const imgLayouts = {
  thumb: true,
  thumbnail: true,
  border: true,
  right: true,
  left: true,
  center: true,
  top: true,
  bottom: true,
  none: true,
  upright: true,
  baseline: true,
  middle: true,
  sub: true,
  super: true,
};

//images are usually [[image:my_pic.jpg]]
const oneImage = function(img) {
  let m = img.match(file_reg);
  if (m === null || !m[2]) {
    return null;
  }
  let file = `${m[1]}:${m[2] || ''}`;
  file = file.trim();
  //titlecase it
  let title = file.charAt(0).toUpperCase() + file.substring(1);
  //spaces to underscores
  title = title.replace(/ /g, '_');
  if (title) {
    let obj = {
      file: file
    };
    //try to grab other metadata, too
    img = img.replace(/^\[\[/, '');
    img = img.replace(/\]\]$/, '');

    //https://en.wikipedia.org/wiki/Wikipedia:Extended_image_syntax
    // - [[File:Name|Type|Border|Location|Alignment|Size|link=Link|alt=Alt|lang=Langtag|Caption]]
    let imgData = parseTemplate(img);
    let arr = imgData.list || [];
    //parse-out alt text, if explicitly given
    if (imgData.alt) {
      obj.alt = imgData.alt;
    }
    //remove 'thumb' and things
    arr = arr.filter((str) => imgLayouts.hasOwnProperty(str) === false);
    if (arr[arr.length - 1]) {
      obj.caption = parseSentence(arr[arr.length - 1]);
    }
    return new Image(obj, img);
  }
  return null;
};

const parseImages = function(matches, r, wiki) {
  matches.forEach(function(s) {
    if (isFile.test(s) === true) {
      r.images = r.images || [];
      let img = oneImage(s);
      if (img) {
        r.images.push(img);
      }
      wiki = wiki.replace(s, '');
    }
  });
  return wiki;
};
module.exports = parseImages;
