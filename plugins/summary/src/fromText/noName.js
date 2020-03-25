// remove the first part of the sentence
const removeTitle = function(s, sentence, title) {
  s.remove('^.+ #Copula+')
  //remove bolds (longest-first)
  let bolds = sentence.bolds().sort((a, b) => {
    if (a.length > b.length) {
      return -1
    }
    return 1
  })
  bolds.forEach(b => {
    s = s.not(b)
  })
  s = s.not('^#Noun+ #Copula')
  s = s.not(`^${title}`)
  return s
}
module.exports = removeTitle
