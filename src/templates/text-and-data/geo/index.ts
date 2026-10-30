import parseCoor from './_lib.ts'

// shows the hemisphere letter instead of a sign, like '33.86°S 151.21°E'
const toText = function (obj) {
  if (typeof obj.lat !== 'number' || typeof obj.lon !== 'number') {
    return ''
  }
  let ns = obj.lat < 0 ? 'S' : 'N'
  let ew = obj.lon < 0 ? 'W' : 'E'
  return `${Math.abs(obj.lat)}°${ns} ${Math.abs(obj.lon)}°${ew}`
}

const templates = {
  coord: (tmpl, parser) => {
    let obj = parseCoor(tmpl, parser)
    //display inline, by default
    if (!obj.display || obj.display.indexOf('inline') !== -1) {
      return { data: obj, replacement: toText(obj) }
    }
    return { data: obj, replacement: '' }
  },
}

//{{coord|latitude|longitude|coordinate parameters|template parameters}}
//{{coord|dd|N/S|dd|E/W|coordinate parameters|template parameters}}
//{{coord|dd|mm|N/S|dd|mm|E/W|coordinate parameters|template parameters}}
//{{coord|dd|mm|ss|N/S|dd|mm|ss|E/W|coordinate parameters|template parameters}}

export default templates
