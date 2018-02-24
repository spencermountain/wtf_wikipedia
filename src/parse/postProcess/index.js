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
  //loop around and add the other images
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

  //try to guess the page's title (from the bold first-line)
  if (r.sections[0] && r.sections[0].sentences[0]) {
    let s = r.sections[0].sentences[0];
    if (s.fmt && s.fmt.bold && s.fmt.bold[0]) {
      r.title = r.title || s.fmt.bold[0];
    }
  }
  return r;
};
module.exports = postProcess;
