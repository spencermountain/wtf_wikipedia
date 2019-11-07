const Image = require('./Image');
const i18n = require('../data/i18n');
const file_reg = new RegExp('(' + i18n.images.concat(i18n.files).join('|') + '):.*?[\\|\\]]', 'i');

//images are usually [[image:my_pic.jpg]]
const parse_image = function(img) {
  let m = img.match(file_reg) || [''];
  if (m === null) {
    return null;
  }
  let file = m[0].replace(/[\|\]]$/, '');
  let title = file.replace(/^(image|file?)\:/i, '');
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1);
  //spaces to underscores
  title = title.replace(/ /g, '_');
  if (title) {
    return new Image(file);
  }
  return null;
};
module.exports = parse_image;

// console.log(parse_image("[[image:my_pic.jpg]]"));
