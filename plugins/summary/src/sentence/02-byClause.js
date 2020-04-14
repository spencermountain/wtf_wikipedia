const byClause = function (s) {
  // 'an actor and also a politician'
  s.remove('and (also|eventually) (a|an|the|#Possessive) .*')
  // 'an actor who was a politician'
  s.remove('!of (who|that|which) #Adverb? (#Copula|form|comprise|forms|comprises) .*')
  // past-tense verbs 'located in spain'
  s.remove('#Adverb? (located|situated|founded|found|formed|built|developed) .*')
  //
  s.remove('#Adverb? (located|situated|founded|found|formed|built|developed) .*')

  return s
}
module.exports = byClause
