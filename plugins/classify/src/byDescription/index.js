const byDescription = function (doc) {
  let tmpl = doc.template('short description')
  if (tmpl && tmpl.description) {
    let desc = tmpl.description
    // person
    if (desc.match(/(actor|actress)/)) {
      return [{ cat: 'Person/Actor', reason: desc }]
    }
    if (desc.match(/(artist|singer|musician|painter|poet|rapper|drummer)/)) {
      return [{ cat: 'Person/Artist', reason: desc }]
    }
    if (desc.match(/(keyboard|guitar|bass) player/)) {
      return [{ cat: 'Person/Artist', reason: desc }]
    }
    if (desc.match(/(politician|member of parliament)/)) {
      return [{ cat: 'Person/Politician', reason: desc }]
    }
    if (desc.match(/(hockey|soccer|backetball|football) player/)) {
      return [{ cat: 'Person/Athlete', reason: desc }]
    }
    if (desc.match(/(writer|celebrity|activist)/)) {
      return [{ cat: 'Person', reason: desc }]
    }
    // organizations
    if (desc.match(/(basketball|hockey|soccer|football|sports) team/)) {
      return [{ cat: 'Organization/SportsTeam', reason: desc }]
    }
    if (desc.match(/(company|subsidary)/)) {
      return [{ cat: 'Organization/Company', reason: desc }]
    }
    if (desc.match(/political party/)) {
      return [{ cat: 'Organization/PoliticalParty', reason: desc }]
    }
    if (desc.match(/(charity|organization|ngo)/)) {
      return [{ cat: 'Organization', reason: desc }]
    }
    // creativeworks
    if (desc.match(/television series/)) {
      return [{ cat: 'CreativeWork/TVShow', reason: desc }]
    }
    if (desc.match(/[0-9]{4} film/)) {
      return [{ cat: 'CreativeWork/Film', reason: desc }]
    }
    console.log(desc)
  }
  return []
}
module.exports = byDescription
