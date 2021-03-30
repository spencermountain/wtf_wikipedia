module.exports = {
  id: 'Album',
  children: {},
  //
  categories: {
    mapping: ['albums recorded at abbey road studios'],
    patterns: [/[0-9]{4}.*? albums/, /^albums /, / albums$/, /album stubs$/],
  },
  //
  descriptions: {
    patterns: [],
  },
  //
  infoboxes: {
    mapping: ['album'],
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
