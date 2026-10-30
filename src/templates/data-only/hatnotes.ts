import defaultParse from '../../parse/templates/parse/toJSON/text.ts'

// Block-level hatnotes - https://en.wikipedia.org/wiki/Category:Hatnote_templates
// These render nothing in .text(), but are kept as templates of kind 'hatnote' with their pages.

// {{main|Foo|Bar}} → pages: ['Foo', 'Bar']
const pageList = ['main', 'main article', 'see also', 'seealso', 'further', 'further information', 'details', 'broader', 'main list', 'see', 'excerpt', 'category see also', 'cat main', 'main category', 'wikipedia books']
// {{about|USE|USE2|PAGE2}} - the pages are the even arguments
const aboutList = ['about', 'for', 'other uses', 'other uses of', 'other people', 'other places', 'other ships', 'redirect-distinguish', 'distinguish', 'self reference', 'selfref']

let templates: Record<string, any> = {}
pageList.forEach((name) => {
  templates[name] = (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl)
    let pages = (obj.list || []).filter((s) => s)
    let data: any = { type: name, pages, list: pages }
    // {{main|Foo|l1=Label}}
    Object.keys(obj).forEach((k) => {
      if (/^l\d+$/.test(k)) {
        data.labels ||= {}
        data.labels[k] = obj[k]
      }
    })
    return { data, replacement: '' }
  }
  templates[name].kind = 'hatnote'
})
aboutList.forEach((name) => {
  templates[name] = (tmpl, parse = defaultParse) => {
    let obj = parse(tmpl)
    let list = (obj.list || []).filter((s) => s)
    let data: any = { type: name, list }
    if (name === 'about') {
      // {{about|USE1|USE2|PAGE2|USE3|PAGE3}}
      data.pages = list.filter((s, i) => i > 0 && i % 2 === 0)
    } else if (name === 'for') {
      // {{for|USE|PAGE1|PAGE2}}
      data.pages = list.slice(1)
    } else {
      data.pages = list
    }
    return { data, replacement: '' }
  }
  templates[name].kind = 'hatnote'
})
// {{hatnote|free text}}
templates.hatnote = (tmpl, parse = defaultParse) => {
  let obj = parse(tmpl, ['text'])
  return { data: { type: 'hatnote', text: obj.text || '' }, replacement: '' }
}
templates.hatnote.kind = 'hatnote'
export default templates
