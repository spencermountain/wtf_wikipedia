const lastTry = function (s) {
  s.remove('(small|large|minor|major)')
  s.remove('(extinct|retired|annual|biweekly|monthly|daily)')
  s.remove('(female|male)')
  s.remove('(private|independent|official|unofficial|officially)')
  s.remove('(southern|northern|eastern|western|northeastern|northwestern)')

  //
  s.remove('^(family|clade|genus|species|order) of')
  return s
}
module.exports = lastTry
