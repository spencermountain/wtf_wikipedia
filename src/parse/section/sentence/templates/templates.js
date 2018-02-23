//templates we support
const keep = {
  main: true,
  'main article': true,
  'wide image': true,
  coord: true,

  //date/age/time templates
  'start': 'date',
  'end': 'date',
  'birth': 'date',
  'death': 'date',
  'start date': 'date',
  'end date': 'date',
  'birth date': 'date',
  'death date': 'date',
  'birth date and age': 'date',
  'death date and age': 'date',
  'birth date and given age': 'date',
  'death date and given age': 'date',
  //this is insane
  'start-date': 'natural_date',
  'end-date': 'natural_date',
  'birth-date': 'natural_date',
  'death-date': 'natural_date',
  'birth-date and age': 'natural_date',
  'birth-date and given age': 'natural_date',
  'death-date and age': 'natural_date',
  'death-date and given age': 'natural_date',



  // 'birth date and age2': 'date',
  // 'birth date and given age': 'date',
  // 'death date and age': 'date',
  // 'death date and given age': 'date',
  // 'death year and age': 'date',
  // 'start date': 'date',
  // 'end date': 'date',
  // 'start date and age': 'date',
  // birthdeathage: 'date',
  dob: 'date',
  bda: 'date',
  // 'age': 'date',

  // 'age nts': true,
  // 'age in years, months and days': true,
  // 'age in years and months': true,
  // 'age in years and days': true,
  // 'age in years, months, weeks and days': true,
  // 'age in days': true,
  // 'age as of date': true,


};
module.exports = keep;
