//images are usually [[image:my_pic.jpg]]
function parse_image(img) {
  img = img.match(/(file|image):.*?[\|\]]/i) || ['']
  img = img[0].replace(/\|$/, '')
  return img
}
module.exports = parse_image
