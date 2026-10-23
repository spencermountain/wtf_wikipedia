import parseCoor from './_lib.ts'

const templates = {
  coord: (tmpl, parser) => {
    let obj = parseCoor(tmpl, parser)
    //display inline, by default
    if (!obj.display || obj.display.indexOf('inline') !== -1) {
      return { data: obj, replacement: `${obj.lat || ''}°N, ${obj.lon || ''}°W` }
    }
    return { data: obj, replacement: '' }
  },
}

//{{coord|latitude|longitude|coordinate parameters|template parameters}}
//{{coord|dd|N/S|dd|E/W|coordinate parameters|template parameters}}
//{{coord|dd|mm|N/S|dd|mm|E/W|coordinate parameters|template parameters}}
//{{coord|dd|mm|ss|N/S|dd|mm|ss|E/W|coordinate parameters|template parameters}}

export default templates
