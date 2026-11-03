const byPattern = function (str, patterns) {
  const types = Object.keys(patterns)
  for (let i = 0; i < types.length; i++) {
    const key = types[i]
    for (let o = 0; o < patterns[key].length; o++) {
      const reg = patterns[key][o]
      if (reg.test(str) === true) {
        return key
      }
    }
  }
  return null
}
export default byPattern
