const defaults = {
  images: true
}
const dontDo = {
  image: true,
  caption: true,
  alt: true,
  signature: true,
  'signature alt': true
}

//
const infobox = function(options) {
  options = Object.assign({}, defaults, options)
  let html = '<table class="infobox">\n'
  html += '  <thead>\n'
  html += '  </thead>\n'
  html += '  <tbody>\n'
  //put image and caption on the top
  if (options.images === true && this.data.image) {
    html += '    <tr>\n'
    html += '       <td colspan="2" style="text-align:center">\n'
    html += '       ' + this.image().html() + '\n'
    html += '       </td>\n'
    if (this.data.caption || this.data.alt) {
      let caption = this.data.caption
        ? this.data.caption.html(options)
        : this.data.alt.html(options)
      html += '       <td colspan="2" style="text-align:center">\n'
      html += '         ' + caption + '\n'
      html += '       </td>\n'
    }
    html += '    </tr>\n'
  }
  Object.keys(this.data).forEach(k => {
    if (dontDo[k] === true) {
      return
    }
    let s = this.data[k]
    let key = k.replace(/_/g, ' ')
    key = key.charAt(0).toUpperCase() + key.substring(1) //titlecase it
    let val = s.html(options)
    html += '    <tr>\n'
    html += '      <td>' + key + '</td>\n'
    html += '      <td>' + val + '</td>\n'
    html += '    </tr>\n'
  })
  html += '  </tbody>\n'
  html += '</table>\n'
  return html
}
module.exports = infobox
