const aliveCats = {
  'Living people': true,
  'Year of birth missing (living people)': true,
  'Date of birth missing (living people)': true,
  'Place of birth missing (living people)': true,
  'Active politicians': true,
  'Biography articles of living people': true
}

const didDie = {
  'Dead people': true,
  'Date of death missing': true,
  'Date of death unknown': true,
  'Place of death missing': true,
  'Place of death unknown': true,
  'Year of death missing': true,
  'Year of death unknown': true,
  'Year of death uncertain': true,
  'Recent deaths': true,
  'People declared dead in absentia': true,
  'Politicians elected posthumously': true,
  'People who died in office': true,
  'Assassinated heads of state‎ ': true,
  'Assassinated heads of government': true,
  'Assassinated mayors': true,
  'People who died in Nazi concentration camps': true,
  'People executed in Nazi concentration camps': true,
  'Politicians who died in Nazi concentration camps': true,
  'People who have received posthumous pardons': true,
  'People lost at sea‎': true,
  'Deaths due to shipwreck': true,
  'People who died at sea': true,
  'Unsolved deaths‎': true,
  'Deaths by horse-riding accident‎': true,
  'Deaths from falls‎': true,
  'Deaths by poisoning‎‎': true,
  'Deaths from cerebrovascular disease‎': true,
  'Deaths from asphyxiation‎': true,
  'Deaths from sepsis‎': true,
  'Deaths from pneumonia‎': true,
  'Deaths from dysentery‎‎': true,
  'Deaths by drowning‎': true
}

const byCat = function (doc) {
  let cats = doc.categories()

  //confirmed alive categories
  if (cats.find((c) => aliveCats.hasOwnProperty(c))) {
    return true
  }
  //confirmed death categories
  if (cats.find((c) => didDie.hasOwnProperty(c))) {
    return false
  }
  return null
}
module.exports = byCat
