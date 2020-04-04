const byDescription = function (doc) {
  let tmpl = doc.template('short description')
  if (tmpl && tmpl.description) {
    let desc = tmpl.description
    if (desc.match(/(basketball|hockey|soccer|football|sports) team/)) {
      return [{ cat: 'Organization/SportsTeam', reason: desc }]
    }
    console.log(desc)
  }
  return []
}
module.exports = byDescription
