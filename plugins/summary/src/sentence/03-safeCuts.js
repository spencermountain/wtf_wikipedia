const safeCuts = function (s) {
  // 'in hamilton, Canada'
  if (s.has('(#Place && @hasComma) #Country+$')) {
    s.remove('#Country+$')
  }
  // 'which spans the '
  if (s.has('#Noun (that|which|who) #PresentTense the .*')) {
    s.remove(' that #PresentTense the .*')
  }
  // 'owned by the ...'
  if (s.has('#Noun #PastTense by the .*')) {
    s.remove('#PastTense by the .*')
  }
  // 'an american actress'
  s.remove('#Demonym')
  // professional hockey player
  s.remove('(professional|former)')

  //event-templates
  s.remove('and? held annually .*')
  s.remove('taking place each .*')

  return s
}
module.exports = safeCuts
