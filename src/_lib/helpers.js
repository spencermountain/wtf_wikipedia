module.exports = {
  capitalise: function(str) {
    if (str && typeof str === 'string') {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
    return ''
  },
  trim_whitespace: function(str) {
    if (str && typeof str === 'string') {
      str = str.replace(/^\s\s*/, '')
      str = str.replace(/\s\s*$/, '')
      str = str.replace(/ {2}/, ' ')
      str = str.replace(/\s, /, ', ')
      return str
    }
    return ''
  }
}
