module.exports = {
  id: 'Film',
  children: {},
  //
  categories: {
    mapping: [],
    patterns: [/[0-9]{4}.*? films/, / films$/, /^films /],
  },
  //
  descriptions: {
    patterns: [],
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
    patterns: [],
  },
}
