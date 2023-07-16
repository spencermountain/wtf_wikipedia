export default {
  name: 'Director',
  //
  children: {},
  //
  categories: {
    mapping: ['directors of palme d\'or winners', 'best director aacta international award winners'],
    patterns: [/film directors/i],
  },
  //
  descriptions: {
    patterns: [/director/],
  },
  //
  infoboxes: {
    mapping: ['director'],
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
    patterns: [/director-stub$/],
  },
  //
  titles: {
    mapping: ['director'],
    patterns: [],
  },
}
