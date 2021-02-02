const parse = require('../../parse/toJSON')

module.exports = {
  //https://en.wikipedia.org/wiki/Template:Ra
  ra: (tmpl) => {
    let obj = parse(tmpl, ['hours', 'minutes', 'seconds'])
    return [obj.hours || 0, obj.minutes || 0, obj.seconds || 0].join(':')
  },

  //https://en.wikipedia.org/wiki/Template:Deg2HMS
  deg2hms: (tmpl) => {
    //this template should do the conversion
    let obj = parse(tmpl, ['degrees'])
    return (obj.degrees || '') + '°'
  },

  hms2deg: (tmpl) => {
    //this template should do the conversion too
    let obj = parse(tmpl, ['hours', 'minutes', 'seconds'])
    return [obj.hours || 0, obj.minutes || 0, obj.seconds || 0].join(':')
  },

  decdeg: (tmpl) => {
    //this template should do the conversion too
    let obj = parse(tmpl, ['deg', 'min', 'sec', 'hem', 'rnd'])
    return (obj.deg || obj.degrees) + '°'
  },
}
