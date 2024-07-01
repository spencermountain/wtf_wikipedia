import parse from '../../parse/toJSON/index.js'
let templates = {}
// these templates all have a predictable pattern
// {{HSC|Ship Name|ID}} -> [[HSC Name (id)]]
let arr = [
  // ships
  'mv',
  'm/v',
  'gts',
  'hsc',
  'ms',
  'm/s',
  'my',
  'm/y',
  'ps',
  'rms',
  'rv',
  'r/v',
  'sb',
  'ss',
  's/s',
  'sv',
  's/v',
  'sy',
  's/y',
  'tss',
  'ans',
  'hmas',
  'hmbs',
  'bns',
  'hmcs',
  'ccgs',
  'arc',
  'hdms',
  'bae',
  'ens',
  'eml',
  'rfns',
  'fns',
  'hs',
  'sms',
  'smu',
  'gs',
  'icgv',
  'ins',
  'kri',
  'lé',
  'jsub',
  'jds',
  'js',
  'hnlms',
  'hmnzs',
  'nns',
  'hnoms',
  'hmpngs',
  'bap',
  'rps',
  'brp',
  'orp',
  'nrp',
  'nms',
  'rss',
  'sas',
  'hmsas',
  'roks',
  'hswms',
  'htms',
  'tcg',
  'hms',
  'hmt',
  'rfaux',
  'usat',
  'uscgc',
  'usns',
  'usrc',
  'uss',
  'usav',
]

arr.forEach((word) => {
  templates[word] = (tmpl) => {
    let { name, id } = parse(tmpl, ['name', 'id'])
    return id ? `[[${word.toUpperCase()} ${name} (${id})]]` : `[[${word.toUpperCase()} ${name}]]`
  }
})

let links = ['no redirect', 'tl-r', 'template link no redirect', 'redirect?', 'subatomic particle', 'auto link', 'bl']
links.forEach((word) => {
  templates[word] = (tmpl) => {
    let data = parse(tmpl, ['page', 'text'])
    if (data.text && data.text !== data.page) {
      return `[[${data.page}|${data.text}]]`
    }
    return `[[${data.page}]]`
  }
})
export default templates
