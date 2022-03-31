import parseCoor from './_lib.js'

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
}

//{{coord|latitude|longitude|coordinate parameters|template parameters}}
//{{coord|dd|N/S|dd|E/W|coordinate parameters|template parameters}}
//{{coord|dd|mm|N/S|dd|mm|E/W|coordinate parameters|template parameters}}
//{{coord|dd|mm|ss|N/S|dd|mm|ss|E/W|coordinate parameters|template parameters}}

export default templates
