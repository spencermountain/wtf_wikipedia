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

// {{coord|36|42|N|3|13|E}} is shown as written: 36°42′N 3°13′E
const dmsText = function (tmpl, parser) {
  let list = (parser(tmpl).list || []).map((s) => String(s).trim())
  let ns = list.findIndex((s) => /^[NS]$/i.test(s))
  let ew = list.findIndex((s, i) => i > ns && /^[EW]$/i.test(s))
  if (ns < 2 || ew < ns + 3 || ew - ns !== ns + 1) {
    return null
  }
  const fmt = (parts, hemi) => {
    let [d, m, sec] = parts
    let str = `${d}°`
    if (m !== undefined) {
      str += `${m}′`
    }
    if (sec !== undefined) {
      str += `${sec}″`
    }
    return str + hemi.toUpperCase()
  }
  return `${fmt(list.slice(0, ns), list[ns])} ${fmt(list.slice(ns + 1, ew), list[ew])}`
}

const templates = {
  coord: (tmpl, parser) => {
    let obj = parseCoor(tmpl, parser)
    //display inline, by default
    if (!obj.display || obj.display.indexOf('inline') !== -1) {
      return { data: obj, replacement: dmsText(tmpl, parser) || toText(obj) }
    }
    return { data: obj, replacement: '' }
  },
}

//{{coord|latitude|longitude|coordinate parameters|template parameters}}
//{{coord|dd|N/S|dd|E/W|coordinate parameters|template parameters}}
//{{coord|dd|mm|N/S|dd|mm|E/W|coordinate parameters|template parameters}}
//{{coord|dd|mm|ss|N/S|dd|mm|ss|E/W|coordinate parameters|template parameters}}

export default templates
