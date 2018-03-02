const i18n = require('../../data/i18n');
const parseImage = require('../parse/section/image/image');
const img_regex = new RegExp('^(' + i18n.images.concat(i18n.files).join('|') + ')', 'i');

//grab all images from the document and fully-parse them
const getImages = function(doc) {
  let images = [];
  // grab an image from infobox, if applicable
  let infobox = doc.infoboxes(0);
  if (infobox && infobox.data['image'] && infobox.data['image'].text) {
    let img = infobox.data['image'].text || '';
    if (img && typeof img === 'string' && !img.match(img_regex)) {
      img = '[[File:' + img + ']]';
      img = parseImage(img);
      images.push(img);
    }
  }

  //loop around each section and add its images
  doc.sections().forEach(s => {
    //try an image from {{wide image|...}} template
    if (s.templates() && s.templates().wide_image) {
      let img = s.templates().wide_image[0];
      img = '[[File:' + img + ']]';
      img = parseImage(img);
      r.images.push(img);
    }
    if (s.images()) {
      s.images().forEach(img => images.push(img));
    }
  });
  return images;
};

module.exports = getImages;
