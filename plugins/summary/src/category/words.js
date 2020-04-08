const bad = [
  'living',
  'births',
  'former',
  'deceased',
  'with',
  'descent',
  'award',
  'winners',
  'nominees'
].map((str) => new RegExp(str))

const good = ['male', 'female'].map((str) => new RegExp(str))

const like = ['male', 'female', 'century'].map((str) => new RegExp(str))

const dislike = ['people', 'place', 'from'].map((str) => new RegExp(str))

module.exports = {
  good: good,
  bad: bad,
  like: like,
  dislike: dislike
}
