import CreativeWork from './CreativeWork/index.js'
import MedicalCondition from './MedicalCondition.js'
import Organism from './Organism.js'
import Product from './Product.js'

export default {
  name: 'Creation',
  children: {
    CreativeWork,
    MedicalCondition,
    Organism,
    Product,
  },
  //
  properties: {
    creators: () => { },
    date: () => { },
  },
  //
  categories: {
    mapping: [],
    patterns: [],
  },
  //
  descriptions: {
    patterns: [],
  },
  //
  infoboxes: {
    mapping: [],
    patterns: [],
  },
  //
  sections: {
    mapping: [],
    patterns: [],
  },
  //
  templates: {
    mapping: [],
    patterns: [],
  },
  //
  titles: {
    mapping: [],
    patterns: [],
  },
}
