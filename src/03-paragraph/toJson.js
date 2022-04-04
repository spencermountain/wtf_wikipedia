import setDefaults from '../_lib/setDefaults.js'

const defaults = {
  sentences: true,
}

const toJson = function (p, options) {
  options = setDefaults(options, defaults)
  let data = {}
  if (options.sentences === true) {
    data.sentences = p.sentences().map((s) => s.json(options))
  }
  return data
}
export default toJson
