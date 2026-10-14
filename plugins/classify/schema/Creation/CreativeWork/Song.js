export default {
  name: 'Song',
  children: {},
  //
  categories: {
    mapping: [],
    // The lookahead commits to the first year on each line, avoiding repeated suffix scans.
    patterns: [/^(?=(.*?[0-9]{4}))\1.*? songs/m, /^songs /, / songs$/, /song stubs$/],
  },
  //
  descriptions: {
    patterns: [],
  },
  //
  infoboxes: {
    mapping: [],
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
    mapping: ['song'],
    patterns: [],
  },
}
