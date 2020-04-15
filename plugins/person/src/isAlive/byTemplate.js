// blp = biography of living persons

// {{WikiProject Biography}} (with living=yes parameter)
// {{WikiProject banner shell}} (with blp=y parameter)

const isAlive = {
  BLP: true,
  'BLP unsourced': true,
  'BLP unsourced section': true,
  'BLP primary sources': true,
  'BLP self-published': true,
  'BLP sources': true,
  'BLP sources section': true,
  'BLP IMDb-only refimprove': true,
  'BLP IMDb refimprove': true,
  'BLP no footnotes': true,
  'BLP more footnotes': true,
  'BLP one source': true,
  'Active politician': true,
  Activepol: true,
  'Current person': true
}

const isDead = {
  'Recent death': true,
  'Recent death presumed': true,
  'Recent death confirmed': true,
  Obituary: true,
  Elegy: true,
  Eulogy: true,
  Panegyric: true,
  Memorial: true
}
const byTemplate = function (doc) {
  let templates = doc.templates()
  for (let i = 0; i < templates.length; i++) {
    const title = templates[i].template
    if (isAlive.hasOwnProperty(title)) {
      return true
    }
    if (isDead.hasOwnProperty(title)) {
      return false
    }
  }
  let bio = doc.template('WikiProject Biography')
  if (bio) {
    //living blp BLP
    console.log(bio)
  }
  return null
}
module.exports = byTemplate
