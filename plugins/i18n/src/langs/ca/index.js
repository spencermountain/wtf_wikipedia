// assembles the pack — template names in ./aliases.js, citation param maps in ./citations.js
import register from '../../register.js'
import version from '../../_version.js'
import aliases from './aliases.js'
import parsers from './citations.js'

const infoboxes = [
  'esser viu',
  'ficha de taxón',
  'fitxa de tàxon',
  'iev',
  'infotaula d\'ésser viu',
  'infotaula esser viu',
  'infotaula taxonòmica',
  'infotaula ésser viu',
  'speciesbox',
  'taxocaixa',
  'taxocaixa amfibi',
  'taxocaixa animal',
  'taxocaixa anèl·lid',
  'taxocaixa arqueobacteri',
  'taxocaixa artròpode',
  'taxocaixa avial',
  'taxocaixa cnidari',
  'taxocaixa dinosaure',
  'taxocaixa equinoderm',
  'taxocaixa eubacteri',
  'taxocaixa eucariota',
  'taxocaixa fong',
  'taxocaixa mamaliaforme',
  'taxocaixa mammaliaforme',
  'taxocaixa mamífer',
  'taxocaixa mol·lusc',
  'taxocaixa ocell',
  'taxocaixa peix',
  'taxocaixa planta',
  'taxocaixa platihelmint',
  'taxocaixa rèptil',
  'taxocaixa sinàpsid',
  'taxocaixa virus',
  'ésser viu',
]

const data = { aliases, infoboxes, parsers }

const plugin = (_models, templates, boxes) => register(data, templates, boxes)
plugin.lang = 'ca'
plugin.version = version

export { data }
export default plugin
