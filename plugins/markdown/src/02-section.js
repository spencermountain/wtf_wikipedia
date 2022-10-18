const defaults = {
  headers: true,
  images: true,
  tables: true,
  lists: true,
  paragraphs: true
}

function doSection (options) {
  options = Object.assign({}, defaults, options)
  let md = ''

  //make the header
  if (options.headers === true && this.title()) {
    let header = '##'
    for (let i = 0; i < this.depth(); i += 1) {
      header += '#'
    }
    md += header + ' ' + this.title() + '\n'
  }

  //put any images under the header
  if (options.images === true) {
    let images = this.images()
    if (images.length > 0) {
      md += images.map((img) => img.markdown()).join('\n')
      md += '\n'
    }
  }

  //make a markdown table
  if (options.tables === true) {
    let tables = this.tables()
    if (tables.length > 0) {
      md += '\n'
      md += tables.map((table) => table.markdown(options)).join('\n')
      md += '\n'
    }
  }

  //make a markdown bullet-list
  if (options.lists === true) {
    let lists = this.lists()
    if (lists.length > 0) {
      md += lists.map((list) => list.markdown(options)).join('\n')
      md += '\n'
    }
  }

  //finally, write the sentence text.
  if (options.paragraphs === true || options.sentences === true) {
    md += this.paragraphs()
      .map((p) => {
        return p
          .sentences()
          .map((s) => s.markdown(options))
          .join(' ')
      })
      .join('\n\n')
  }

  return md
}
export default doSection
