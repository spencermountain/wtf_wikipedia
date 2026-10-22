import defaultParse from '../../../parse/templates/parse/toJSON/index.ts'

//converts DMS (decimal-minute-second) geo format to lat/lng format.
//thanks to https://github.com/gmaclennan/parse-dms and https://github.com/WSDOT-GIS/dms-js
function parseDMS(arr) {
  let hemisphere = arr.pop()
  let degrees = Number(arr[0] || 0)
  let minutes = Number(arr[1] || 0)
  let seconds = Number(arr[2] || 0)
  if (typeof hemisphere !== 'string' || isNaN(degrees)) {
    return null
  }
  let sign = 1
  if (/[SW]/i.test(hemisphere)) {
    sign = -1
  }
  return sign * (degrees + minutes / 60 + seconds / 3600)
}

// German Coordinate templates use NS=52/31/7/N and EW=13/24/30/E.
const parseNamedDMS = (value, directions, limit) => {
  if (typeof value !== 'string') {
    return null
  }
  let parts = value.split('/').map((part) => part.trim())
  let hemisphere = parts.at(-1).toLowerCase()
  if (parts.length < 2 || parts.length > 4 || !directions.includes(hemisphere) || hemisphere.length !== 1) {
    return null
  }
  let numbers = parts.slice(0, -1).map(Number)
  if (!parts[0] || !numbers.every(Number.isFinite) || numbers.some((num) => num < 0)) {
    return null
  }
  if (numbers.slice(1).some((num) => num >= 60)) {
    return null
  }
  let result = parseDMS([...numbers, hemisphere])
  return Math.abs(result) <= limit ? result : null
}

const round = function (num) {
  if (typeof num !== 'number') {
    return num
  }
  let places = 100000
  return Math.round(num * places) / places
}

//these hemispheres mean negative decimals
const negative = {
  s: true,
  w: true,
}

const findLatLng = function (arr) {
  const types = arr.map((s) => typeof s).join('|')
  //support {{lat|lng}}
  if (arr.length === 2 && types === 'number|number') {
    return {
      lat: arr[0],
      lon: arr[1],
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
      lon: arr[2],
    }
  }
  //support {{dd|mm|N/S|dd|mm|E/W}}
  if (arr.length === 6) {
    return {
      lat: parseDMS(arr.slice(0, 3)),
      lon: parseDMS(arr.slice(3)),
    }
  }
  //support {{dd|mm|ss|N/S|dd|mm|ss|E/W}}
  if (arr.length === 8) {
    return {
      lat: parseDMS(arr.slice(0, 4)),
      lon: parseDMS(arr.slice(4)),
    }
  }
  return {}
}

const parseParams = function (obj) {
  obj.list ||= []
  obj.list = obj.list.map((str) => {
    let num = Number(str)
    if (!isNaN(num)) {
      return num
    }
    //these are weird
    let split = str.split(/:/)
    if (split.length > 1) {
      obj.props ||= {}
      obj.props[split[0]] = split.slice(1).join(':')
      return null
    }
    return str
  })
  obj.list = obj.list.filter((s) => s !== null)
  return obj
}

const parseCoor = function (tmpl, _list, parse = defaultParse) {
  let obj = parse(tmpl)
  obj = parseParams(obj)
  let tmp = findLatLng(obj.list)
  if (obj.list.length === 0 && (obj.ns !== undefined || obj.ew !== undefined)) {
    tmp = {
      lat: parseNamedDMS(obj.ns, 'ns', 90),
      lon: parseNamedDMS(obj.ew, 'ew', 180),
    }
  }
  obj.lat = round(tmp.lat)
  obj.lon = round(tmp.lon)
  obj.template = 'coord'
  delete obj.list
  return obj
}

export default parseCoor
// {{Coor title dms|dd|mm|ss|N/S|dd|mm|ss|E/W|template parameters}}
// {{Coor title dec|latitude|longitude|template parameters}}
// {{Coor dms|dd|mm|ss|N/S|dd|mm|ss|E/W|template parameters}}
// {{Coor dm|dd|mm|N/S|dd|mm|E/W|template parameters}}
// {{Coor dec|latitude|longitude|template parameters}}

// {{coord|latitude|longitude|coordinate parameters|template parameters}}
// {{coord|dd|N/S|dd|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|N/S|dd|mm|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|ss|N/S|dd|mm|ss|E/W|coordinate parameters|template parameters}}
