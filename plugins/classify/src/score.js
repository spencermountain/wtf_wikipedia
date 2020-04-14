const types = require('./_types')

const topk = function (arr) {
  let obj = {}
  arr.forEach((a) => {
    obj[a] = obj[a] || 0
    obj[a] += 1
  })
  let res = Object.keys(obj).map((k) => [k, obj[k]])
  res = res.sort((a, b) => {
    if (a[1] > b[1]) {
      return -1
    } else if (a[1] < b[1]) {
      return 1
    }
    return 0
  })
  return res
}

const parse = function (cat) {
  let split = cat.split(/\//)
  return {
    root: split[0],
    child: split[1]
  }
}

const getScore = function (detail) {
  let cats = []
  Object.keys(detail).forEach((k) => {
    detail[k].forEach((obj) => {
      if (!types[obj.cat]) {
        console.error('Missing: ' + obj.cat)
      }
      cats.push(parse(obj.cat))
    })
  })
  // find top parent
  let roots = cats.map((obj) => obj.root).filter((s) => s)
  let tops = topk(roots)
  let top = tops[0]
  if (!top) {
    return {
      detail: detail,
      category: null,
      score: 0
    }
  }
  let root = top[0]
  // score as % of results
  let score = top[1] / cats.length
  // punish low counts
  if (top[1] === 1) {
    score *= 0.75
  }
  if (top[1] === 2) {
    score *= 0.85
  }
  if (top[1] === 3) {
    score *= 0.95
  }
  // if the second root is good
  if (tops[1]) {
    if (tops[1][1] === tops[0][1]) {
      score *= 0.5 //tie
    } else {
      score *= 0.8
    }
  }

  // find 2nd level
  let children = cats.filter((o) => o.root === root && o.child).map((obj) => obj.child)
  let topKids = topk(children)
  top = topKids[0]
  let category = root
  if (top) {
    category = `${root}/${top[0]}`
    // punish for any conflicting children
    if (topKids.length > 1) {
      score *= 0.7
    }
    // punish for low count
    if (top[1] === 1) {
      score *= 0.8
    }
  }
  return {
    root: root,
    category: category,
    score: score,
    detail: detail
  }
}
module.exports = getScore
