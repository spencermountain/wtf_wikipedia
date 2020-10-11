//converts DMS (decimal-minute-second) geo format to lat/lng format.
//major thank you to https://github.com/gmaclennan/parse-dms
//and https://github.com/WSDOT-GIS/dms-js 👏

//accepts an array of descending Degree, Minute, Second values, with a hemisphere at the end
//must have N/S/E/W as last thing
function parseDms(arr) {
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

module.exports = parseDms
