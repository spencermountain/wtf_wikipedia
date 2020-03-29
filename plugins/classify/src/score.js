const topk = function(arr) {
  let obj = {}
  arr.forEach(a => {
    obj[a] = obj[a] || 0
    obj[a] += 1
  })
  let res = Object.keys(obj).map(k => [k, obj[k]])
  return res.sort((a, b) => (a[1] > b[1] ? -1 : 0))
}

const parse = function(cat) {
  let split = cat.split(/\//)
  return {
    root: split[0],
    child: split[1]
  }
}

const getScore = function(detail) {
  let cats = []
  Object.keys(detail).forEach(k => {
    detail[k].forEach(str => {
      cats.push(parse(str))
    })
  })
  // find top parent
  let roots = cats.map(obj => obj.root).filter(s => s)
  let top = topk(roots)[0]
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

  // find 2nd level
  let children = cats.map(obj => obj.child).filter(s => s)
  let tops = topk(children)
  top = tops[0]
  let category = root
  if (top) {
    category = `${root}/${top[0]}`
    // punish for any conflicting children
    if (tops.length > 1) {
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
    score: Math.ceil(score),
    detail: detail
  }
}
module.exports = getScore
