var i18n = require("../data/i18n");
//images are usually [[image:my_pic.jpg]]

function parse_image(img) {
  img = img.match(new RegExp("(" + i18n.images.concat(i18n.files).join("|") + "):.*?[\\|\\]]", "i")) || [""];
  img = img[0].replace(/\|$/, "");
  return img;
}
module.exports = parse_image;
