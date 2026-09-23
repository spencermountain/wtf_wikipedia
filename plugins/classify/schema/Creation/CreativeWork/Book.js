export default {
  name: 'Book',
  children: {},
  //
  categories: {
    mapping: [],
    // The lookahead commits to the first year on each line, avoiding repeated suffix scans.
    patterns: [/(film|novel) stubs$/, /^(?=(.*?[0-9]{4}))\1.*? (poems|novels)/m, / (poems|novels)$/],
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
