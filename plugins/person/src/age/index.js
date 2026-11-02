// current age of a living person - null for the dead
const age = function (doc) {
  if (doc.isAlive() === false) {
    return null
  }
  const birth = doc.birthDate()
  if (!birth || !birth.year) {
    return null
  }
  const now = new Date()
  let years = now.getFullYear() - birth.year
  // subtract one if their birthday hasn't happened yet this year (month is 0-indexed)
  if (birth.month !== undefined && birth.date !== undefined) {
    if (now.getMonth() < birth.month || (now.getMonth() === birth.month && now.getDate() < birth.date)) {
      years -= 1
    }
  }
  if (years < 0) {
    return null
  }
  return years
}
export default age
