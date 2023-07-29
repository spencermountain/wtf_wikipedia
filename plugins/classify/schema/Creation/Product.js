export default {
  name: 'Product',
  //
  children: {},
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
      'card_game',
      'computer',
      'laboratory_equipment',
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
