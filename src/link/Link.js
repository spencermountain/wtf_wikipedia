const Link = function(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  })
}
const methods = {
  text: function() {
    return ''
  },
  json: function() {
    return this.data
  }
}
Object.keys(methods).forEach(k => {
  Link.prototype[k] = methods[k]
})
module.exports = Link
