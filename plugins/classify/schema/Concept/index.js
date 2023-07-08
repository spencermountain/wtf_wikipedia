import MedicalCondition from './MedicalCondition.js'
import Organism from './Organism.js'

export default {
  name: 'Concept',
  children: {
    MedicalCondition,
    Organism,
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
