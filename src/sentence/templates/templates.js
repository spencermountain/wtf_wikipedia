//templates we support
const keep = {
  'main': true,
  'main article': true,
  'wide image': true,
  'coord': true,

  //date/age/time templates
  'start': 'date',
  'end': 'date',
  'birth': 'date',
  'death': 'date',
  'start date': 'date',
  'end date': 'date',
  'birth date': 'date',
  'death date': 'date',
  'start date and age': 'date',
  'end date and age': 'date',
  'birth date and age': 'date',
  'death date and age': 'date',
  'birth date and given age': 'date',
  'death date and given age': 'date',
  'birth year and age': 'one_year',
  'death year and age': 'one_year',

  //this is insane (hyphen ones are different)
  'start-date': 'natural_date',
  'end-date': 'natural_date',
  'birth-date': 'natural_date',
  'death-date': 'natural_date',
  'birth-date and age': 'natural_date',
  'birth-date and given age': 'natural_date',
  'death-date and age': 'natural_date',
  'death-date and given age': 'natural_date',

  'birthdeathage': 'two_dates',
  'dob': 'date',
  'bda': 'date',
  // 'birth date and age2': 'date',

  'age': 'age',
  'age nts': 'age',
  'age in years': 'diff-y',
  'age in years and months': 'diff-ym',
  'age in years, months and days': 'diff-ymd',
  'age in years and days': 'diff-yd',
  'age in days': 'diff-d',
  // 'age in years, months, weeks and days': true,
  // 'age as of date': true,


};
module.exports = keep;
