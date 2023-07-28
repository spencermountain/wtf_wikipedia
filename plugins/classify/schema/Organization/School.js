export default {
  name: 'School',
  //
  children: {},
  //
  categories: {
    mapping: [
      'land-grant universities and colleges',
    ],
    patterns: [
      /schools in ./,
      /(secondary|primary|high|elementary|public|private) schools/,
      /(schools|universities|colleges) established in [0-9]{4}/,
    ],
  },
  //
  descriptions: {
    patterns: [/(private|public|high|middle|elementary|primary|secondary) school/],
  },
  //
  infoboxes: {
    mapping: [
      'college',
      'school',
      'university',
      'residential_college',
      'law_school',
      'uk_school',
    ],
    patterns: [],
  },
  //
  sections: {
    mapping: [],
    patterns: [/alumni/],
  },
  //
  templates: {
    mapping: [],
    patterns: [/-school-stub$/],
  },
  //
  titles: {
    mapping: [],
    patterns: [],
  },
}
