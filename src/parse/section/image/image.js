const Hashes = require('jshashes');
const i18n = require('../../../data/i18n');
const file_reg = new RegExp('(' + i18n.images.concat(i18n.files).join('|') + '):.*?[\\|\\]]', 'i');

//the wikimedia image url is a little silly:
//https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F
const make_image = function(file) {
  let title = file.replace(/^(image|file?)\:/i, '');
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1);
  //spaces to underscores
  title = title.replace(/ /g, '_');

  let hash = new Hashes.MD5().hex(title);
  let path = hash.substr(0, 1) + '/' + hash.substr(0, 2) + '/';
  title = encodeURIComponent(title);
  path += title;
  let server = 'https://upload.wikimedia.org/wikipedia/commons/';
  let thumb = '/300px-' + title;
  return {
    url: server + path,
    file: file,
    thumb: server + 'thumb/' + path + thumb
  };
};

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
