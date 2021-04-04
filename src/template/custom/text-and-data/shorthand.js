module.exports = {
  mlbplayer: {
    props: ['number', 'name', 'il'],
    out: 'name',
  },
  syntaxhighlight: {
    props: [],
    out: 'code',
  },
  samp: {
    props: ['1'],
    out: '1',
  },
  //https://en.wikipedia.org/wiki/Template:Sub
  sub: {
    props: ['text'],
    out: 'text',
  },
  //https://en.wikipedia.org/wiki/Template:Sup
  sup: {
    props: ['text'],
    out: 'text',
  },

  //https://en.wikipedia.org/wiki/Template:Chem2
  chem2: {
    props: ['equation'],
    out: 'equation',
  },
  //https://en.wikipedia.org/wiki/Template:Interlanguage_link
  ill: {
    props: ['text', 'lan1', 'text1', 'lan2', 'text2'],
    out: 'text',
  },
  //https://en.wikipedia.org/wiki/Template:Abbr
  abbr: {
    props: ['abbr', 'meaning', 'ipa'],
    out: 'abbr',
  },
  // name: {
  //   props: [],
  //   out: '',
  // },
}
