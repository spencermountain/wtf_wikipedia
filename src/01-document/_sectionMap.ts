// calls sec[fn](clue) across every section and flattens the results
const sectionMap = function (doc, fn, clue) {
  let arr = []
  doc.sections().forEach((sec) => {
    let list = []
    if (typeof clue === 'string') {
      list = sec[fn](clue)
    } else {
      list = sec[fn]()
    }
    list.forEach((t) => {
      arr.push(t)
    })
  })
  if (typeof clue === 'number') {
    if (arr[clue] === undefined) {
      return []
    }
    return [arr[clue]]
  }
  return arr
}
export default sectionMap
