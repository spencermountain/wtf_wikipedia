export default {
  name: 'Album',
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
    mapping: ['track listing'],
    patterns: [],
  },
  //
  templates: {
    mapping: ['track listing', 'tracklist'],
    patterns: [/-album-stub$/],
  },
  //
  titles: {
    mapping: ['album'],
    patterns: [],
  },
}
