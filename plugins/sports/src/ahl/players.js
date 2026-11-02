// the {{Ice hockey team player}} roster rows - many ahl pages have no stat tables
const parseRoster = function (doc) {
  const players = doc.templates('ice hockey team player').map((t) => {
    const data = t.json().data || {}
    return {
      number: parseInt(data.num, 10) || null,
      name: [data.first, data.last].filter(Boolean).join(' '),
      position: data.pos || '',
    }
  })
  return players.filter((p) => p.name)
}
export default parseRoster
