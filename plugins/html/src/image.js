const makeImage = function() {
  return '  <img src="' + this.thumbnail() + '" alt="' + this.alt() + '"/>'
}
module.exports = makeImage
