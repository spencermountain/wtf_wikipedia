const parseLine = require('../sentence/').parseLine;
const Image = require('../image/Image');
// Most templates are '{{template}}', but then, some are '<template></template>'.
// -> this is those ones.

//okay, <gallery> is a xml-tag, with newline-seperated data, somehow pivoted by '|'...
//all deities help us. truly -> https://en.wikipedia.org/wiki/Help:Gallery_tag
const parseGallery = function(wiki, section) {
  wiki = wiki.replace(/<gallery([^>]+?)>([\s\S]+?)<\/gallery>/g, (_, attrs, inside) => {
    let images = inside.split(/\n/g);
    images = images.filter(str => str);
    //parse the line, which has an image and sometimes a caption
    images = images.map((str) => {
      let arr = str.split(/\|/);
      let img = new Image(arr[0]).json();
      let caption = arr.slice(1).join('|');
      if (caption !== '') {
        img.caption = parseLine(caption);
      }
      return img;
    });
    //add it to our templates list
    if (images.length > 0) {
      section.templates.push({
        template: 'gallery',
        images: images
      });
    }
    return '';
  });
  return wiki;
};

const xmlTemplates = function(section, wiki) {
  wiki = parseGallery(wiki, section);
  return wiki;
};

module.exports = xmlTemplates;
