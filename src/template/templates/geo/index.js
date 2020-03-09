const parseCoor = require('./coor')

const templates = {
  coord: (tmpl, list) => {
    let obj = parseCoor(tmpl)
    list.push(obj)
    //display inline, by default
    if (!obj.display || obj.display.indexOf('inline') !== -1) {
      return `${obj.lat || ''}°N, ${obj.lon || ''}°W`
    }
    return ''
  },
  //https://en.wikivoyage.org/wiki/Template:Geo
  geo: ['lat', 'lon', 'zoom']
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
