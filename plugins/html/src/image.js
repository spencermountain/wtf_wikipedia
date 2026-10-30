const escape = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const makeImage = function () {
  return '  <img src="' + escape(this.thumbnail()) + '" alt="' + escape(this.alt()) + '"/>'
}
export default makeImage
