import joinSentences from './_lib/joinSentences.js'
const escape = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const defaults = {
  headers: true,
  images: true,
  tables: true,
  lists: true,
  paragraphs: true,
}

const doSection = function (options) {
  options = { ...defaults, ...options }
  let html = ''
  //make the header
  if (options.headers === true && this.title()) {
    // '== title ==' is an h2, like wikipedia
    const num = 2 + this.depth()
    html += '  <h' + num + '>' + escape(this.title()) + '</h' + num + '>'
    html += '\n'
  }
  //put any images under the header
  if (options.images === true) {
    const imgs = this.images()
    if (imgs.length > 0) {
      html += imgs.map((image) => image.html(options)).join('\n')
    }
  }
  //make a html table
  if (options.tables === true) {
    html += this.tables()
      .map((t) => t.html(options))
      .join('\n')
  }
  const doLists = (lists) => {
    if (options.lists !== true) {
      return ''
    }
    return lists.map((list) => list.html(options)).join('\n')
  }

  //write the sentence text, with each paragraph's lists after its text
  if (options.paragraphs === true && this.paragraphs().length > 0) {
    html += '  <div class="text">\n'
    this.paragraphs().forEach((p) => {
      if (p.sentences().length > 0) {
        html += '    <p class="paragraph">\n'
        html += '      ' + joinSentences(p.sentences(), (s) => s.html(options))
        html += '\n    </p>\n'
      }
      html += doLists(p.lists())
    })
    html += '  </div>\n'
  } else {
    html += doLists(this.lists())
    if (options.sentences === true) {
      html += '      ' + joinSentences(this.sentences(), (s) => s.html(options))
    }
  }
  return '<div class="section">\n' + html + '</div>\n'
}

export default doSection
