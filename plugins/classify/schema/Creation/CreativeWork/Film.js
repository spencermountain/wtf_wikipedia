export default {
  name: 'Film',
  children: {},
  //
  categories: {
    mapping: [],
    // The lookahead commits to the first year on each line, avoiding repeated suffix scans.
    patterns: [/^(?=(.*?[0-9]{4}))\1.*? films/m, / films$/, /^films /],
  },
  //
  descriptions: {
    patterns: [/[0-9]{4} film/],
  },
  //
  infoboxes: {
    mapping: ['film'],
    patterns: [],
  },
  //
  sections: {
    mapping: ['cast'],
    patterns: [],
  },
  //
  templates: {
    mapping: ['imdb title', 'film date', 'rotten-tomatoes'],
    patterns: [/-film-stub$/],
  },
  //
  titles: {
    mapping: ['movie'],
    patterns: [/ \([0-9]{4} film\)$/],
  },
}
