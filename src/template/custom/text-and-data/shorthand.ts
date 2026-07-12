const mlbplayer = {
  props: ['number', 'name', 'il'],
  out: 'name',
}
const syntaxhighlight = {
  props: [],
  out: 'code',
}
const samp = {
  props: ['1'],
  out: '1',
}
const sub = {
  props: ['text'],
  out: 'text',
}
const sup = {
  props: ['text'],
  out: 'text',
}
const chem2 = {
  props: ['equation'],
  out: 'equation',
}
const ill = {
  props: ['text', 'lan1', 'text1', 'lan2', 'text2'],
  out: 'text',
}
const abbr = {
  props: ['abbr', 'meaning', 'ipa'],
  out: 'abbr',
}

export default {
  mlbplayer,
  syntaxhighlight,
  samp,
  sub,
  sup,
  chem2,
  ill,
  abbr,
}