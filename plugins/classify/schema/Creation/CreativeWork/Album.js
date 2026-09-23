export default {
  name: 'Album',
  children: {},
  //
  categories: {
    mapping: ['albums recorded at abbey road studios'],
    // The lookahead commits to the first year on each line, avoiding repeated suffix scans.
    patterns: [/^(?=(.*?[0-9]{4}))\1.*? albums/m, /^albums /, / albums$/, /album stubs$/],
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
