export default {
  name: 'Director',
  //
  children: {},
  //
  categories: {
    mapping: ['Directors of Palme d\'Or winners', 'Best Director AACTA International Award winners'],
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
