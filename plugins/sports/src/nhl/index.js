import teams from './teams.js'
import parse from './parse.js'

const makePage = function (team, year) {
  team = team.replace(/ /g, '_')
  year = year || new Date().getFullYear()
  let nextYear = Number(String(year).substr(2, 4)) + 1
  let page = `${year}–${nextYear}_${team}_season` //2018–19_Toronto_Maple_Leafs_season
  return page
}

const addMethod = function (models) {
  models.wtf.nhlSeason = function (team, year) {
    //soften-up the team-input
    team = teams.find((t) => {
      return t === team || t.toLowerCase().includes(team.toLowerCase())
    }) || team
    let page = makePage(team, year)
    return models.wtf.fetch(page).catch(console.log).then(parse)
  }
  // add it here too
  models.Doc.nhlSeason = parse
}
export default addMethod
