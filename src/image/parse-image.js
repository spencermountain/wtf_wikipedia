const Image = require('./Image');
const i18n = require('../data/i18n');
let fileNames = `(?:${i18n.images.concat(i18n.files).join('|')})`;
const file_reg = new RegExp(fileNames + ':(.+?)[\\||\\]]', 'i');

//images are usually [[image:my_pic.jpg]]
const parse_image = function(img) {
  let m = img.match(file_reg);
  if (m === null || !m[1]) {
    return null;
  }
  let file = m[1] || '';
  //titlecase it
  let title = file.charAt(0).toUpperCase() + file.substring(1);
  //spaces to underscores
  title = title.replace(/ /g, '_');
  if (title) {
    return new Image(file, img);
  }
  return null;
};
module.exports = parse_image;

// console.log(parse_image("[[image:my_pic.jpg]]"));
