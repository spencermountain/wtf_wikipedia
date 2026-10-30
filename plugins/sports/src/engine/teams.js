// franchises are lists of {name, from}, newest-first
const matches = (name, want) => name.toLowerCase().includes(want)
const validFor = (names, year) => names.find((o) => o.from <= year) || null

// resolve('cleveland', 2015) → 'Cleveland Indians'
const resolveTeam = function (franchises, input, year) {
  const want = String(input)
    .toLowerCase()
    .trim()
    .replace(/^ny /, 'new york ')
    .replace(/^la /, 'los angeles ')
  // prefer the franchise actually using this name in this year
  // so 'Winnipeg Jets' 2018 is not routed through the Coyotes franchise
  for (const names of franchises) {
    const valid = validFor(names, year)
    if (valid && matches(valid.name, want)) {
      return valid.name
    }
  }
  // then follow any name across a rename - 'cleveland indians' 2023 → Guardians
  for (const names of franchises) {
    if (names.some((o) => matches(o.name, want))) {
      const valid = validFor(names, year)
      if (valid) {
        return valid.name
      }
    }
  }
  return input
}
export default resolveTeam
