const safeCuts = function (s) {
  // 'in hamilton, Canada'
  if (s.has('(#Place && @hasComma) #Country$')) {
    s.remove('#Country$')
  }
  // 'an american actress'
  s.remove('#Demonym')
  // professional hockey player
  s.remove('(professional|former)')
  return s
}
module.exports = safeCuts
