const parse = require('../_parsers/parse')

const templates = {
  // https://en.wikivoyage.org/wiki/Template:Do
  listing: (tmpl, list) => {
    let obj = parse(tmpl, [])
    list.push(obj)
    // flatten it all into one line of text
    let name = obj.name
    if (obj.url) {
      name = `[${obj.url} ${obj.name}]`
    }
    let phone = ''
    if (obj.phone) {
      phone = `[tel:${obj.phone}]`
    }
    let updated = ''
    if (obj.lastedit) {
      updated = `(updated ${obj.lastedit})`
    }
    let out = `${name} ${obj.address || ''} ${obj.directions || ''} ${phone} ${obj.hours || ''} ${obj.content} ${
      obj.price
    } ${updated}`
    return out
  },
}
// are these sorta the same?
templates.see = templates.listing
templates.do = templates.listing
templates.buy = templates.listing
templates.eat = templates.listing
templates.drink = templates.listing
templates.sleep = templates.listing
templates.go = templates.listing

module.exports = templates
