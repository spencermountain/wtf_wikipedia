const keyValue = require('../parsers/key-value');
const getInside = require('../parsers/inside');

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

const inline = {
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
  nowrap: (tmpl) => {
    let obj = getInside(tmpl);
    return obj.data;
  },
  //https://en.wikipedia.org/wiki/Template:Height - {{height|ft=6|in=1}}
  height: (tmpl) => {
    let obj = keyValue(tmpl);
    let result = [];
    let units = ['m', 'cm', 'ft', 'in']; //order matters
    units.forEach((unit) => {
      if (obj.hasOwnProperty(unit) === true) {
        result.push(obj[unit].text() + unit);
      }
    });
    return result.join(' ');
  }
};
//aliases
//current/local
inline.localday = inline.currentday;
inline.localdayname = inline.currentdayname;
inline.localmonth = inline.currentmonth;
inline.localyear = inline.currentyear;
inline.local = inline.current;

inline.currentmonthname = inline.currentmonth;
inline.currentmonthabbrev = inline.currentmonth;

module.exports = inline;
