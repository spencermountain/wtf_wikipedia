const i18n = require('../../data/i18n');
const parseImage = require('../section/image/image');
const img_regex = new RegExp('^(' + i18n.images.concat(i18n.files).join('|') + ')', 'i');

//cleanup after ourselves
const postProcess = function(r) {
  // add image from infobox, if applicable
  if (r.infoboxes[0] && r.infoboxes[0].data && r.infoboxes[0].data['image'] && r.infoboxes[0].data['image'].text) {
    let img = r.infoboxes[0].data['image'].text || '';
    if (img && typeof img === 'string' && !img.match(img_regex)) {
      img = '[[File:' + img + ']]';
      img = parseImage(img);
      r.images.push(img);
    }
  }
  //loop around and add the others
  r.sections.forEach(s => {
    //image from {{wide image|...}} template
    if (s.templates && s.templates.wide_image) {
      let img = s.templates.wide_image[0];
      img = '[[File:' + img + ']]';
      img = parseImage(img);
      r.images.push(img);
    }
    if (s.images) {
      s.images.forEach(img => r.images.push(img));
    }
  });
  return r;
};
module.exports = postProcess;
