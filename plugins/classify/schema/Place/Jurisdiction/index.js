import City from './City.js'
import Country from './Country.js'

export default {
  name: 'Jurisdiction',
  children: {
    City,
    Country
  },
  properties: {
    population: () => { },
    leader: () => { },
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
    mapping: [
      '2010 census',
      '2000 census',
      'economy',
      'transportation',
      'government',
      'communities',
      'transport',
      'culture',
      'sports',
      'adjacent counties',
      'major highways',
      'notable residents',
      'tourism',
      'cities',
      'population',
      'unincorporated communities',
      'infrastructure',
      'schools',
      'rail',
      'census-designated places',
      'towns',
      'local government',
      'points of interest',
      'attractions',
      'demographics',
      'climate',
      'notable people',
      'townships',
      'recreation',
      'arts and culture',
      'governance',
      'administrative divisions',
      'landmarks',
      'demography',
    ],
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
