const Link = function(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  })
}
const methods = {
  text: function() {
    return this.data.text
  },
  json: function() {
    return this.data
  },
  page: function() {
    return this.data.page
  },
  anchor: function() {
    return this.data.anchor
  },
  wiki: function() {
    return this.data.wiki
  },
  site: function() {
    return this.data.site
  },
  type: function() {
    return this.data.type
  }
}
Object.keys(methods).forEach(k => {
  Link.prototype[k] = methods[k]
})
module.exports = Link
