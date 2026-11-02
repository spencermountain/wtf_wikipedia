import fns from './functions.ts'
import hatnotes from './hatnotes.ts'

let templates = {
  //https://en.wikipedia.org/wiki/Category:External_link_templates
  'hollywood walk of fame': ['name'],
  'wide image': ['file', 'width', 'caption'],
  audio: ['file', 'text', 'type'],
  rp: ['page'],
  'short description': ['description'],
  'coord missing': ['region'],
  unreferenced: ['date'],
  'taxon info': ['taxon', 'item'], //https://en.wikipedia.org/wiki/Template:Taxon_info
  'portuguese name': ['first', 'second', 'suffix'], // https://en.wikipedia.org/wiki/Template:Portuguese_name
  geo: ['lat', 'lon', 'zoom'], //https://en.wikivoyage.org/wiki/Template:Geo
}

templates = Object.assign(templates, hatnotes, fns)

export default templates
