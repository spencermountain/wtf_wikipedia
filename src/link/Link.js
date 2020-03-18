const defaults = {
  type: 'internal'
}
const Link = function(data) {
  data = data || {}
  data = Object.assign({}, defaults, data)
  // console.log(data)
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  })
}
const methods = {
  text: function(str) {
    if (str !== undefined) {
      this.data.text = str
    }
    return this.data.text
  },
  json: function() {
    let obj = {
      text: this.text(),
      type: this.type()
    }
    if (obj.type === 'internal') {
      obj.page = this.page()
    } else if (obj.type === 'interwiki') {
      obj.wiki = this.wiki()
    } else {
      obj.site = this.site()
    }
    return obj
  },
  page: function(str) {
    if (str !== undefined) {
      this.data.page = str
    }
    return this.data.page
  },
  anchor: function(str) {
    if (str !== undefined) {
      this.data.anchor = str
    }
    return this.data.anchor
  },
  wiki: function(str) {
    if (str !== undefined) {
      this.data.wiki = str
    }
    return this.data.wiki
  },
  type: function(str) {
    if (str !== undefined) {
      this.data.type = str
    }
    return this.data.type
  },
  site: function(str) {
    if (str !== undefined) {
      this.data.site = str
    }
    return this.data.site
  },
  href: function() {
    let type = this.type()
    if (type === 'external') {
      return this.site()
    }
  }
}
Object.keys(methods).forEach(k => {
  Link.prototype[k] = methods[k]
})
module.exports = Link
