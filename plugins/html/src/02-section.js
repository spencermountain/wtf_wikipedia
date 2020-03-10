const defaults = {
  headers: true,
  images: true,
  tables: true,
  lists: true,
  paragraphs: true
}
const doSection = function(options) {
  options = Object.assign({}, defaults, options)
  let html = ''
  //make the header
  if (options.headers === true && this.title()) {
    let num = 1 + this.depth
    html += '  <h' + num + '>' + this.title() + '</h' + num + '>'
    html += '\n'
  }
  //put any images under the header
  if (options.images === true) {
    let imgs = this.images()
    if (imgs.length > 0) {
      html += imgs.map(image => image.html(options)).join('\n')
    }
  }
  //make a html table
  if (options.tables === true) {
    html += this.tables()
      .map(t => t.html(options))
      .join('\n')
  }
  // //make a html bullet-list
  if (options.lists === true) {
    html += this.lists()
      .map(list => list.html(options))
      .join('\n')
  }
  //finally, write the sentence text.
  if (options.paragraphs === true && this.paragraphs().length > 0) {
    html += '  <div class="text">\n'
    this.paragraphs().forEach(p => {
      html += '    <p class="paragraph">\n'
      html +=
        '      ' +
        p
          .sentences()
          .map(s => s.html(options))
          .join(' ')
      html += '\n    </p>\n'
    })
    html += '  </div>\n'
  } else if (options.sentences === true) {
    html +=
      '      ' +
      this.sentences()
        .map(s => s.html(options))
        .join(' ')
  }
  return '<div class="section">\n' + html + '</div>\n'
}
module.exports = doSection
