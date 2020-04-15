// blp = biography of living persons

// {{WikiProject Biography}} (with living=yes parameter)
// {{WikiProject banner shell}} (with blp=y parameter)

const isAlive = {
  blp: true,
  'blp unsourced': true,
  'blp unsourced section': true,
  'blp primary sources': true,
  'blp self-published': true,
  'blp sources': true,
  'blp sources section': true,
  'blp imdb-only refimprove': true,
  'blp imdb refimprove': true,
  'blp no footnotes': true,
  'blp more footnotes': true,
  'blp one source': true,
  'active politician': true,
  activepol: true,
  'current person': true
}

const isDead = {
  'recent death': true,
  'recent death presumed': true,
  'recent death confirmed': true,
  obituary: true,
  elegy: true,
  eulogy: true,
  panegyric: true,
  memorial: true
}
const byTemplate = function (doc) {
  let templates = doc.templates()
  for (let i = 0; i < templates.length; i++) {
    let title = templates[i].template || ''
    title = title.toLowerCase().trim()
    if (isAlive.hasOwnProperty(title)) {
      return true
    }
    if (isDead.hasOwnProperty(title)) {
      return false
    }
  }
  // `{{WikiProject Biography|living=yes|activepol=yes}}`
  let bio = doc.template('WikiProject Biography')
  if (bio) {
    //living blp BLP
    if (bio.living === 'yes' || bio.blp === 'yes' || bio.activepol === 'yes' || bio.BLP === 'yes') {
      return true
    }
    if (bio.living === 'no' || bio.blp === 'no' || bio.BLP === 'no') {
      return false
    }
  }
  return null
}
module.exports = byTemplate
