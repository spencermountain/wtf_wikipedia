const parse = require('../../_parsers/parse')

const inline = {
  //https://en.wikipedia.org/wiki/Template:Height - {{height|ft=6|in=1}}
  height: (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    let result = []
    let units = ['m', 'cm', 'ft', 'in'] //order matters
    units.forEach((unit) => {
      if (obj.hasOwnProperty(unit) === true) {
        result.push(obj[unit] + unit)
      }
    })
    return result.join(' ')
  },

  quote: (tmpl, list) => {
    let order = ['text', 'author']
    let obj = parse(tmpl, order)
    list.push(obj)
    //create plaintext version
    if (obj.text) {
      let str = `"${obj.text}"`
      if (obj.author) {
        str += '\n\n'
        str += `    - ${obj.author}`
      }
      return str + '\n'
    }
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Sic
  sic: (tmpl, list) => {
    let obj = parse(tmpl, ['one', 'two', 'three'])
    let word = (obj.one || '') + (obj.two || '')
    //support '[sic?]'
    if (obj.one === '?') {
      word = (obj.two || '') + (obj.three || '')
    }
    list.push({
      template: 'sic',
      word: word,
    })
    if (obj.nolink === 'y') {
      return word
    }
    return `${word} [sic]`
  },

  //abbreviation/meaning

  // these templates use the page's title
}

module.exports = inline
