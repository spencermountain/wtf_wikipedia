export default {
  name: 'Book',
  children: {},
  //
  categories: {
    mapping: [],
    patterns: [/(film|novel) stubs$/, /[0-9]{4}.*? (poems|novels)/, / (poems|novels)$/],
  },
  //
  descriptions: {
    patterns: [],
  },
  //
  infoboxes: {
    mapping: ['book'],
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
    patterns: [/-novel-stub$/],
  },
  //
  titles: {
    mapping: ['book', 'novel'],
    patterns: [],
  },
}
