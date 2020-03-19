const tree = {
  Person: {
    Athlete: true,
    Artist: true,
    Politician: true,
    Scientist: true,
    Actor: true
  },
  Place: {
    Country: true,
    City: true,
    Structure: true,
    BodyOfWater: true
  },
  Organization: {
    Company: true,
    SportsTeam: true,
    MusicalGroup: true
  },
  CreativeWork: {
    Film: true,
    TVShow: true,
    Book: true,
    Album: true
  },
  Event: {
    Election: true,
    Disaster: true,
    SportsEvent: true,
    War: true
  },
  Thing: {
    Product: true,
    Software: true,
    Character: true
  }
}

const isObject = function(obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Object]'
}

let types = {}
const doit = function(type, obj) {
  Object.keys(obj).forEach(k => {
    let tmp = k
    if (type) {
      tmp = type + '/' + k
    }
    types[tmp] = true
    if (isObject(tree[k])) {
      doit(tmp, tree[k])
    }
  })
}
doit('', tree)

module.exports = types
