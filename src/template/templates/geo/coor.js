const convertDMS = require('./dms-format')
const parse = require('../../_parsers/parse')

const round = function(num) {
  if (typeof num !== 'number') {
    return num
  }
  let places = 100000
  return Math.round(num * places) / places
}

//these hemispheres mean negative decimals
const negative = {
  s: true,
  w: true
}

const findLatLng = function(arr) {
  const types = arr.map(s => typeof s).join('|')
  //support {{lat|lng}}
  if (arr.length === 2 && types === 'number|number') {
    return {
      lat: arr[0],
      lon: arr[1]
    }
  }
  //support {{dd|N/S|dd|E/W}}
  if (arr.length === 4 && types === 'number|string|number|string') {
    if (negative[arr[1].toLowerCase()]) {
      arr[0] *= -1
    }
    if (arr[3].toLowerCase() === 'w') {
      arr[2] *= -1
    }
    return {
      lat: arr[0],
      lon: arr[2]
    }
  }
  //support {{dd|mm|N/S|dd|mm|E/W}}
  if (arr.length === 6) {
    return {
      lat: convertDMS(arr.slice(0, 3)),
      lon: convertDMS(arr.slice(3))
    }
  }
  //support {{dd|mm|ss|N/S|dd|mm|ss|E/W}}
  if (arr.length === 8) {
    return {
      lat: convertDMS(arr.slice(0, 4)),
      lon: convertDMS(arr.slice(4))
    }
  }
  return {}
}

const parseParams = function(obj) {
  obj.list = obj.list || []
  obj.list = obj.list.map(str => {
    let num = Number(str)
    if (!isNaN(num)) {
      return num
    }
    //these are weird
    let split = str.split(/:/)
    if (split.length > 1) {
      obj.props = obj.props || {}
      obj.props[split[0]] = split.slice(1).join(':')
      return null
    }
    return str
  })
  obj.list = obj.list.filter(s => s !== null)
  return obj
}

const parseCoor = function(tmpl) {
  let obj = parse(tmpl)
  obj = parseParams(obj)
  let tmp = findLatLng(obj.list)
  obj.lat = round(tmp.lat)
  obj.lon = round(tmp.lon)
  obj.template = 'coord'
  delete obj.list
  return obj
}

module.exports = parseCoor
// {{Coor title dms|dd|mm|ss|N/S|dd|mm|ss|E/W|template parameters}}
// {{Coor title dec|latitude|longitude|template parameters}}
// {{Coor dms|dd|mm|ss|N/S|dd|mm|ss|E/W|template parameters}}
// {{Coor dm|dd|mm|N/S|dd|mm|E/W|template parameters}}
// {{Coor dec|latitude|longitude|template parameters}}

// {{coord|latitude|longitude|coordinate parameters|template parameters}}
// {{coord|dd|N/S|dd|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|N/S|dd|mm|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|ss|N/S|dd|mm|ss|E/W|coordinate parameters|template parameters}}
