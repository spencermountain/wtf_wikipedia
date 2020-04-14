const isIndependent = function (c) {
  if (c.has('^(and|the|which|who|whom|also|a|an|the)')) {
    return true
  }
  // 'part of abu dabi'
  if (c.has('^(west|north|south|east|part) of')) {
    return true
  }
  // 'written by .'
  if (c.has('^#PastTense by .')) {
    return true
  }
  // 'sometimes called ..'
  if (c.has('^(occasionally|sometimes|frequently)')) {
    return true
  }
  // 'such as ..'
  if (c.has('^such as')) {
    return true
  }
  // 'featuring gold feathers ..'
  if (c.has('^(including|featuring|depicting)')) {
    return true
  }
  return false
}

const hardCuts = function (s) {
  // .. in san fransisco
  if (s.has('#Noun (located|based|situated|sited|found|discovered) (in|on) #Place+$')) {
    s.remove('(located|based) in #Place+$')
  } else if (
    s.has(
      '(#Noun|#Value) (in|on) the #Adjective? (region|province|district|coast|city) of #Place+$'
    )
  ) {
    s.remove('(in|on) the #Adjective? (region|province|district|coast|city) of #Place+$')
  } else if (s.has('(#Noun|#Value) in #Place+$')) {
    s.remove('in #Place+$')
  } else {
    s.remove('and? part of #Place+$')
    s.remove('and? near #Place+$')
  }

  // by clause
  let clauses = s.clauses()
  if (clauses.length > 1) {
    let first = clauses.eq(0)
    let second = clauses.eq(1)
    //can we just choose the first clause?
    if (isIndependent(second)) {
      s = clauses.eq(0)
    } else if (second.has('^(#PastTense)') && first.has('(#Noun|#Value)$')) {
      // 'produced by...'
      s = clauses.eq(0)
    } else if (second.has('^(#Gerund)') && first.has('#Noun$')) {
      // 'featuring a ...'
      s = clauses.eq(0)
    } else {
      // can we remove the last clause, atleast?
      let last = clauses.last()
      if (isIndependent(last)) {
        clauses.list.pop()
        s = clauses.join()
      }
    }
  }

  //.. writen by sandro leonardo
  if (s.has('(#Noun|and) #PastTense by')) {
    s.remove('#PastTense by .*')
  }
  //
  s.remove('and? designed to .*')
  s.remove('and? owned by .*')
  s.remove('and? consisting of .*')
  // , which collapsed
  if (s.has('@hasComma (which|who) #Verb')) {
    s.remove('(which|who) .*')
  }
  // , then
  // if (s.has('@hasComma (then)')) {
  //   s.remove('(which|who) .*')
  // }
  return s
}
module.exports = hardCuts
