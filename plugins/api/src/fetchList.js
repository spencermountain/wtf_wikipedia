import slow from 'slow'
function isObject (obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Object]'
}

function chunkBy (arr, chunkSize = 5) {
  let groups = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    groups.push(arr.slice(i, i + chunkSize))
  }
  return groups
}

function fetchList (pages, options, wtf) {
  // support a list of strings, or objects
  if (pages[0] && isObject(pages[0])) {
    pages = pages.map((o) => o.title)
  }
  // fetch in groups of 5
  let groups = chunkBy(pages)

  function doit (group) {
    return wtf.fetch(group, options) //returns a promise
  }
  //only allow three requests at a time
  return slow.three(groups, doit).then((res) => {
    // flatten into one list
    return res.reduce((arr, a) => {
      arr = arr.concat(a)
      return arr
    })
  })
}
export default fetchList
