const tree = {
  Person: {
    Athlete: true,
    Artist: true,
    Politician: true,
    Actor: true,
    Academic: true,
    ReligiousFigure: true,
  },
  Place: {
    Country: true,
    City: true,
    Structure: true,
    BodyOfWater: true,
    SpaceLocation: true,
  },
  Organization: {
    Company: true,
    SportsTeam: true,
    MusicalGroup: true,
    PoliticalParty: true,
  },
  CreativeWork: {
    Film: true,
    TVShow: true,
    Play: true,
    Book: true,
    Album: true,
    VideoGame: true,
  },
  Event: {
    Election: true,
    Disaster: true,
    SportsEvent: true,
    MilitaryConflict: true,
    SpaceMission: true,
  },
  Product: true,
  Organism: true,
  MedicalCondition: true,
  Concept: true,
  FictionalCharacter: true,
}

const isObject = function (obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Object]'
}

let types = {}
const doit = function (type, obj) {
  Object.keys(obj).forEach((k) => {
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
