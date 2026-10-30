const escape = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const defaults = {
  images: true,
}
const dontDo = {
  image: true,
  caption: true,
  alt: true,
  signature: true,
  signature_alt: true,
}

//
const infobox = function (Block, options) {
  options = { ...defaults, ...options }
  const data = this.json().data
  let html = '<table class="infobox">\n'
  html += '  <thead>\n'
  html += '  </thead>\n'
  html += '  <tbody>\n'
  //put image and caption on the top
  if (options.images === true && data.image) {
    html += '    <tr>\n'
    html += '       <td colspan="2" style="text-align:center">\n'
    html += '       ' + this.image().html() + '\n'
    html += '       </td>\n'
    if (data.caption || data.alt) {
      const caption = data.caption ? new Block(data.caption).html(options) : new Block(data.alt).html(options)
      html += '       <td colspan="2" style="text-align:center">\n'
      html += '         ' + caption + '\n'
      html += '       </td>\n'
    }
    html += '    </tr>\n'
  }
  Object.keys(data).forEach((k) => {
    if (dontDo[k] === true) {
      return
    }
    const blocks = [].concat(data[k])
    let key = k.replace(/_/g, ' ')
    key = key.charAt(0).toUpperCase() + key.substring(1) //titlecase it
    const val = blocks.map((block) => new Block(block).html(options)).join(' ')
    html += '    <tr>\n'
    html += '      <td>' + escape(key) + '</td>\n'
    html += '      <td>' + val + '</td>\n'
    html += '    </tr>\n'
  })
  html += '  </tbody>\n'
  html += '</table>\n'
  return html
}
export default infobox
