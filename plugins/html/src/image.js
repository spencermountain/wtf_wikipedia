const makeImage = function () {
  return '  <img src="' + this.thumbnail() + '" alt="' + this.alt() + '"/>'
}
export default makeImage
