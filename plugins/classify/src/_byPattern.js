const byPattern = function (str, patterns) {
  for (let i = 0; i < patterns.length; i += 1) {
    const reg = patterns[i][0]
    if (reg.test(str) === true) {
      return patterns[i][1]
    }
  }
  return null
}
export default byPattern
