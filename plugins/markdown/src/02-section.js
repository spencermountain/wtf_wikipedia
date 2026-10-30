import joinSentences from './_lib/joinSentences.js'
const defaults = {
  headers: true,
  images: true,
  tables: true,
  lists: true,
  paragraphs: true,
}

const doSection = function (options) {
  options = { ...defaults, ...options }
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
    const images = this.images()
    if (images.length > 0) {
      md += images.map((img) => img.markdown()).join('\n')
      md += '\n'
    }
  }

  //make a markdown table
  if (options.tables === true) {
    const tables = this.tables()
    if (tables.length > 0) {
      md += '\n'
      md += tables.map((table) => table.markdown(options)).join('\n')
      md += '\n'
    }
  }

  const doLists = (lists) => {
    if (options.lists !== true || lists.length === 0) {
      return ''
    }
    return lists.map((list) => list.markdown(options)).join('\n')
  }

  //write the sentence text, with each paragraph's lists after its text
  if (options.paragraphs === true || options.sentences === true) {
    md += this.paragraphs()
      .map((p) => {
        const parts = [joinSentences(p.sentences(), (s) => s.markdown(options)), doLists(p.lists())]
        return parts.filter((str) => str).join('\n')
      })
      .filter((str) => str)
      .join('\n\n')
  } else {
    md += doLists(this.lists())
  }

  return md
}
export default doSection
