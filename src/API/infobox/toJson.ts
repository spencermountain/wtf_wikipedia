import encodeObj from '../_lib/encode.ts'

const toJson = function (infobox, options) {
  let json = Object.fromEntries(
    Object.keys(infobox.data)
      .filter((k) => infobox.data[k])
      .map((k) => [k, infobox.data[k].json()])
  )

  //support mongo-encoding keys
  if (options.encode === true) {
    json = encodeObj(json)
  }
  return json
}
export default toJson
