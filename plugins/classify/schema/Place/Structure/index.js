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
      'power_station',
      'religious_building',
      'stadium',
      'military_structure',
      'religious_building',
      'shopping_mall',
      'lighthouse',
      'power_station',
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
