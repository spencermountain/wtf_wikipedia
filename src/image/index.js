const i18n = require('../data/i18n');
const Image = require('./Image');
const fileRegex = new RegExp('(' + i18n.images.concat(i18n.files).join('|') + '):', 'i');
let fileNames = `(${i18n.images.concat(i18n.files).join('|')})`;
const file_reg = new RegExp(fileNames + ':(.+?)[\\||\\]]', 'i');


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
    return new Image(obj, img);
  }
  return null;
};

// console.log(parse_image("[[image:my_pic.jpg]]"));


const parseImages = function(matches, r, wiki) {
  matches.forEach(function(s) {
    if (fileRegex.test(s) === true) {
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
