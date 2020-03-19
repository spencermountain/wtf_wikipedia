const tree = {
  Person: {
    Athlete: true,
    Artist: true,
    Politician: true,
    Scientist: true
  },
  Place: {
    Country: true,
    City: true,
    Building: true
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
    War: true
  },
  Thing: {
    Product: true,
    Organism: true,
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
