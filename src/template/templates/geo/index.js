const parseCoor = require('./coor')
const parse = require('../../_parsers/parse')

const templates = {
  coord: (tmpl, r) => {
    let obj = parseCoor(tmpl)
    r.templates.push(obj)
    //display inline, by default
    if (!obj.display || obj.display.indexOf('inline') !== -1) {
      return `${obj.lat || ''}°N, ${obj.lon || ''}°W`
    }
    return ''
  },
  //https://en.wikivoyage.org/wiki/Template:Geo
  geo: (tmpl, r) => {
    let order = ['lat', 'lon', 'zoom']
    let obj = parse(tmpl, order)
    r.templates.push(obj)
    return ``
  }
}
// {{coord|latitude|longitude|coordinate parameters|template parameters}}
// {{coord|dd|N/S|dd|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|N/S|dd|mm|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|ss|N/S|dd|mm|ss|E/W|coordinate parameters|template parameters}}
templates['coor'] = templates.coord
// these are from the nl wiki
templates['coor title dms'] = templates.coord
templates['coor title dec'] = templates.coord
templates['coor dms'] = templates.coord
templates['coor dm'] = templates.coord
templates['coor dec'] = templates.coord
module.exports = templates
