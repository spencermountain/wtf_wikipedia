// assembles the pack — template names in ./aliases.js, citation param maps in ./citations.js
import register from '../../register.js'
import version from '../../_version.js'
import aliases from './aliases.js'

const infoboxes = [
  'boaty ny taksônômia', // mg
  'boks klassans', // kw
  'bosca sonraí tacsanomaíochta', // kept by hand
  'capsa taxinomica', // la
  'dora tewran', // diq
  'kishtey fys baagh', // gv
  'poki sona pi ijo wile', // tok
  'puha fakafaʻahinga', // to
  'taksonomiija', // se
  'taksonomiýa', // tk
  'taksōn infobox', // szl
  'tassonomìa', // pms
  'taxobox öömrang', // frr
  'taxonomio', // io
  'taxotaula infotaula', // kept by hand
  'wd bosca sonraí ainmhí bheo', // ga
  'таксанамічная інфармацыя', // be-x-old
  'таксаҥа', // mhr
  'таксон', // bxr lez
  'таксономиясь', // myv
  'таксономія', // kept by hand
  'زيبيل/جاندار', // glk
  'صندخ/موجود', // mzn
  'जीवचौकट', // mr
  'වර්ගීකරණකොටුව', // si
  'ຕາລາງຈຳແໜກພັນ', // lo
  '物種明細模', // zh-yue
]

const parsers = {}

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'other'
plugin.version = version

export { data }
export default plugin
