const bad = [
  'living',
  'births',
  'former',
  'deceased',
  'missing',
  'with',
  'descent',
  'award',
  'winners',
  'nominees',
  'alumni',
  'other'
].map((str) => new RegExp(`\\b${str}\\b`, 'i'))

const good = ['male', 'female'].map((str) => new RegExp(`\\b${str}\\b`, 'i'))

const like = ['male', 'female', 'century'].map((str) => new RegExp(`\\b${str}\\b`, 'i'))

const dislike = ['people', 'place', 'from', 'in', 'people from'].map(
  (str) => new RegExp(`\\b${str}\\b`),
  'i'
)

module.exports = {
  good: good,
  bad: bad,
  like: like,
  dislike: dislike
}
