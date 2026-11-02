// the {{Fs player}} / {{Efs player}} squad rows - most club pages list a first-team squad
const rowNames = ['efs player', 'fs player', 'extended football squad player', 'football squad player']

const parseSquad = function (doc) {
  const players = rowNames
    .flatMap((name) => doc.templates(name))
    .map((t) => {
      const data = t.json().data || {}
      return {
        number: parseInt(data.no, 10) || null,
        name: data.name || '',
        position: data.pos || '',
        nation: data.nat || '',
      }
    })
  return players.filter((p) => p.name)
}
export default parseSquad
