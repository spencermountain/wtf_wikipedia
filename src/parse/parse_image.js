var i18n = require("../data/i18n");
//images are usually [[image:my_pic.jpg]]

function parse_image(img) {
  var reg = new RegExp("(" + i18n.images.concat(i18n.files).join("|") + "):.*?[\\|\\]]", "i");
  img = img.match(reg) || [""];
  img = img[0].replace(/[\|\]]$/, "");
  return img;
}
module.exports = parse_image;

// console.log(parse_image("[[image:my_pic.jpg]]"));
