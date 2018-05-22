const parsers = require('./parsers');
const pipeSplit = require('../parsers/pipeSplit');
const date = parsers.date;
const natural_date = parsers.natural_date;

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//date- templates we support
const templates = {
  currentday: () => {
    let d = new Date();
    return String(d.getDate());
  },
  currentdayname: () => {
    let d = new Date();
    return days[d.getDay()];
  },
  currentmonth: () => {
    let d = new Date();
    return months[d.getMonth()];
  },
  currentyear: () => {
    let d = new Date();
    return String(d.getFullYear());
  },
  //Explictly-set dates - https://en.wikipedia.org/wiki/Template:Date
  date: (tmpl) => {
    let order = ['date', 'fmt'];
    return pipeSplit(tmpl, order).date;
  },
  //sortable dates -
  dts: (tmpl) => {
    //remove formatting stuff, ewww
    tmpl = tmpl.replace(/\|format=[ymd]+/i, '');
    tmpl = tmpl.replace(/\|abbr=(on|off)/i, '');
    let order = ['year', 'month', 'date', 'bc'];
    let obj = pipeSplit(tmpl, order);
    let text = obj.month || '';
    if (obj.date) {
      text += ' ' + obj.date;
    }
    if (obj.year) {
      if (obj.year < 0) {
        obj.year = Math.abs(obj.year) + ' BC';
      }
      text += ' ' + obj.year;
    }
    return text;
  },
  //date/age/time templates
  'start': date,
  'end': date,
  'birth': date,
  'death': date,
  'start date': date,
  'end date': date,
  'birth date': date,
  'death date': date,
  'start date and age': date,
  'end date and age': date,
  'birth date and age': date,
  'death date and age': date,
  'birth date and given age': date,
  'death date and given age': date,
  'birth year and age': parsers.one_year,
  'death year and age': parsers.one_year,

  //this is insane (hyphen ones are different)
  'start-date': natural_date,
  'end-date': natural_date,
  'birth-date': natural_date,
  'death-date': natural_date,
  'birth-date and age': natural_date,
  'birth-date and given age': natural_date,
  'death-date and age': natural_date,
  'death-date and given age': natural_date,

  'birthdeathage': parsers.two_dates,
  'dob': date,
  'bda': date,
  // 'birth date and age2': date,

  'age': parsers.age,
  'age nts': parsers.age,
  'age in years': parsers['diff-y'],
  'age in years and months': parsers['diff-ym'],
  'age in years, months and days': parsers['diff-ymd'],
  'age in years and days': parsers['diff-yd'],
  'age in days': parsers['diff-d'],
  // 'age in years, months, weeks and days': true,
  // 'age as of date': true,

};
templates.localday = templates.currentday;
templates.localdayname = templates.currentdayname;
templates.localmonth = templates.currentmonth;
templates.localyear = templates.currentyear;
templates.local = templates.current;
templates.currentmonthname = templates.currentmonth;
templates.currentmonthabbrev = templates.currentmonth;
module.exports = templates;
