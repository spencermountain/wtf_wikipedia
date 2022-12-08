import wikis from '../_data/interwiki.js'

const defaults = {
  type: 'internal',
}
const Link = function (data) {
  data = data || {}
  data = Object.assign({}, defaults, data)
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  })
}
const methods = {
  text: function (str) {
    if (str !== undefined) {
      this.data.text = str
    }
    let txt = this.data.text || this.data.page || ''
    // remove bold/italics
    txt = txt.replace(/'{2,}/g, '')
    return txt
  },
  json: function () {
    let obj = {
      text: this.data.text,
      type: this.type(),
    }
    if (obj.type === 'internal') {
      obj.page = this.page()
    } else if (obj.type === 'interwiki') {
      obj.wiki = this.wiki()
      obj.page = this.page()
    } else {
      obj.site = this.site()
    }
    let anchor = this.anchor()
    if (anchor) {
      obj.anchor = anchor
    }
    return obj
  },
  wikitext: function () {
    let txt = this.data.raw || ''
    return txt
  },
  page: function (str) {
    if (str !== undefined) {
      this.data.page = str
    }
    return this.data.page
  },
  anchor: function (str) {
    if (str !== undefined) {
      this.data.anchor = str
    }
    return this.data.anchor || ''
  },
  wiki: function (str) {
    if (str !== undefined) {
      this.data.wiki = str
    }
    return this.data.wiki
  },
  type: function (str) {
    if (str !== undefined) {
      this.data.type = str
    }
    return this.data.type
  },
  site: function (str) {
    if (str !== undefined) {
      this.data.site = str
    }
    return this.data.site
  },
  //create a url for any type of link
  href: function () {
    let type = this.type()
    if (type === 'external') {
      return this.site()
    }
    let page = this.page()
    page = page.replace(/ /g, '_')
    page = encodeURIComponent(page)
    let url = ''

    if (type === 'interwiki') {
      let wiki = this.wiki()
      url = 'https://en.wikipedia.org/wiki/$1'
      if (wikis.hasOwnProperty(wiki)) {
        url = 'http://' + wikis[this.wiki()]
      }
      url = url.replace(/\$1/g, page)
    } else {
      //internal link
      url = `./${this.page()}`
    }
    //add anchor on the end
    if (this.anchor()) {
      url += '#' + this.anchor()
    }
    return url
  },
}
Object.keys(methods).forEach((k) => {
  Link.prototype[k] = methods[k]
})
export default Link
