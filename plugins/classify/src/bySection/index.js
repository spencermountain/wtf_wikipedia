let mapping = {
  // person
  'early life': 'Person',
  'personal life': 'Person',
  career: 'Person',
  'career statistics': 'Person',
  'playing career': 'Person',
  'life and career': 'Person',
  'early life and education': 'Person',
  'film and television credits': 'Person',
  filmography: 'Person',
  'selected filmography': 'Person',
  // place
  demographics: 'Place',
  neighbourhoods: 'Place',
  climate: 'Place',
  'sister cities': 'Place/City',
  'notable people': 'Place',
  // creative-work
  cast: 'CreativeWork/Film',
  plot: 'CreativeWork',
  reception: 'CreativeWork',
  'critical reception': 'CreativeWork',
  'critical response': 'CreativeWork',
  'track listing': 'CreativeWork/Album',
  // org
  founding: 'Organization',
  founders: 'Organization',
  'coaching staff': 'Organization/SportsTeam',
  'band members': 'Organization/MusicalGroup'
}

const fromSection = function(doc) {
  let titles = doc.sections().map(s => {
    let str = s.title()
    str = str.toLowerCase().trim()
    return str
  })
  for (let i = 0; i < titles.length; i++) {
    const title = titles[i]
    if (mapping.hasOwnProperty(title)) {
      return mapping[title]
    }
  }
  return null
}
module.exports = fromSection
