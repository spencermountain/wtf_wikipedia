import Bridge from './Bridge.js'
import Airport from './Airport.js'

export default {
  name: 'Structure',
  //
  children: {
    Bridge,
    Airport
  },
  //
  categories: {
    mapping: [],
    patterns: [
      /(buildings|bridges) completed in /,
      /airports established in ./,
      /(airports|bridges) in ./,
      /buildings and structures in ./,
    ],
  },
  //
  descriptions: {
    patterns: [],
  },
  //
  infoboxes: {
    mapping: [
      'airport',
      'bridge',
      'building',
      'lighthouse',
      'military_structure',
      'power_station',
      'religious_building',
      'shopping_mall',
      'stadium',
    ],
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
