module.exports = {
  id: 'Product',
  //
  children: {},
  properties: {},
  //
  categories: {
    mapping: [],
    patterns: [/products introduced in ./, /musical instruments/],
  },
  //
  descriptions: {
    patterns: [],
  },
  //
  infoboxes: {
    mapping: [
      'automobile',
      'beverage',
      'cpu',
      'electric_vehicle',
      'gpu',
      'mobile_phone',
      'motorcycle',
      'synthesizer',
      'television',
      'card game',
      'computer',
      'laboratory equipment',
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
    mapping: ['computer game', 'candy', 'board game', 'card game', 'automobile'],
    patterns: [],
  },
}
