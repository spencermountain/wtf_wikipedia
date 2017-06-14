const i18n = require('../../data/i18n');
const make_image = require('../../lib/make_image');
const file_reg = new RegExp('(' + i18n.images.concat(i18n.files).join('|') + '):.*?[\\|\\]]', 'i');
//images are usually [[image:my_pic.jpg]]

const parse_image = function(img) {
  img = img.match(file_reg) || [''];
  img = img[0].replace(/[\|\]]$/, '');
  //add url, etc to image
  img = make_image(img);
  return img;
};
module.exports = parse_image;

// console.log(parse_image("[[image:my_pic.jpg]]"));
