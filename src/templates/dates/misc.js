const format = require('./_format');
const months = require('./_months');
const pipeSplit = require('../_parsers/pipeSplit');

const misc = {

  'reign': (tmpl) => {
    let order = ['start', 'end'];
    let obj = pipeSplit(tmpl, order);
    return `(r. ${obj.start} – ${obj.end})`;
  },
  'circa': (tmpl) => {
    let order = ['year'];
    let obj = pipeSplit(tmpl, order);
    return `c. ${obj.year}`;
  },
  //we can't do timezones, so fake this one a little bit
  //https://en.wikipedia.org/wiki/Template:Time
  'time': () => {
    let d = new Date();
    let obj = format.ymd([d.getFullYear(), d.getMonth(), d.getDate()]);
    return format.toText(obj);
  },
  'monthname': (tmpl) => {
    let order = ['num'];
    let obj = pipeSplit(tmpl, order);
    return months[obj.num] || '';
  },
  //https://en.wikipedia.org/wiki/Template:OldStyleDate
  oldstyledate: (tmpl) => {
    let order = ['date', 'year'];
    let obj = pipeSplit(tmpl, order);
    let str = obj.date;
    if (obj.year) {
      str += ' ' + obj.year;
    }
    return str;
  },

};
module.exports = misc;
