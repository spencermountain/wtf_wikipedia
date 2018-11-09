const strip = require('../_parsers/_strip');
const delta = require('./_delta');
const fmt = require('./_format');
const ymd = fmt.ymd;
const toText = fmt.toText;

//wrap it up as a template
const template = function(date) {
  return {
    template: 'date',
    data: date
  };
};

const getBoth = function(tmpl) {
  tmpl = strip(tmpl);
  let arr = tmpl.split('|');
  let from = ymd(arr.slice(1, 4));
  let to = arr.slice(4, 7);
  //assume now, if 'to' is empty
  if (to.length === 0) {
    let d = new Date();
    to = [d.getFullYear(), d.getMonth(), d.getDate()];
  }
  to = ymd(to);
  return {
    from: from,
    to: to
  };
};

const parsers = {

  //generic {{date|year|month|date}} template
  date: (tmpl, r) => {
    tmpl = strip(tmpl);
    let arr = tmpl.split('|');
    arr = arr.slice(1, 8);
    //support 'df=yes|1894|7|26'
    if (arr[0] && /^df=/.test(arr[0])) {
      arr.shift();
    }
    let date = ymd(arr);
    date.text = toText(date); //make the replacement string
    if (date.text) {
      r.templates.push(template(date));
    }
    return date.text;
  },

  //support parsing of 'February 10, 1992'
  natural_date: (tmpl, r) => {
    tmpl = strip(tmpl);
    let arr = tmpl.split('|');
    let str = arr[1] || '';
    // - just a year
    let date = {};
    if (/^[0-9]{4}$/.test(str)) {
      date.year = parseInt(str, 10);
    } else {
      //parse the date, using the js date object (for now?)
      let txt = str.replace(/[a-z]+\/[a-z]+/i);
      txt = txt.replace(/[0-9]+:[0-9]+(am|pm)?/i);
      let d = new Date(txt);
      if (isNaN(d.getTime()) === false) {
        date.year = d.getFullYear();
        date.month = d.getMonth() + 1;
        date.date = d.getDate();
      }
    }
    r.templates.push(template(date));
    return str.trim();
  },

  //just grab the first value, and assume it's a year
  one_year: (tmpl, r) => {
    tmpl = strip(tmpl);
    let arr = tmpl.split('|');
    let str = arr[1] || '';
    let year = parseInt(str, 10);
    r.templates.push(template({
      year: year
    }));
    return str.trim();
  },

  //assume 'y|m|d' | 'y|m|d'
  two_dates: (tmpl, r) => {
    tmpl = strip(tmpl);
    let arr = tmpl.split('|');
    //'b' means show birth-date, otherwise show death-date
    if (arr[1] === 'B' || arr[1] === 'b') {
      let date = ymd(arr.slice(2, 5));
      r.templates.push(template(date));
      return toText(date);
    }
    let date = ymd(arr.slice(5, 8));
    r.templates.push(template(date));
    return toText(date);
  },

  'age': (tmpl) => {
    let d = getBoth(tmpl);
    let diff = delta(d.from, d.to);
    return diff.years || 0;
  },

  'diff-y': (tmpl) => {
    let d = getBoth(tmpl);
    let diff = delta(d.from, d.to);
    if (diff.years === 1) {
      return diff.years + ' year';
    }
    return (diff.years || 0) + ' years';
  },
  'diff-ym': (tmpl) => {
    let d = getBoth(tmpl);
    let diff = delta(d.from, d.to);
    let arr = [];
    if (diff.years === 1) {
      arr.push(diff.years + ' year');
    } else if (diff.years && diff.years !== 0) {
      arr.push(diff.years + ' years');
    }
    if (diff.months === 1) {
      arr.push('1 month');
    } else if (diff.months && diff.months !== 0) {
      arr.push(diff.months + ' months');
    }
    return arr.join(', ');
  },
  'diff-ymd': (tmpl) => {
    let d = getBoth(tmpl);
    let diff = delta(d.from, d.to);
    let arr = [];
    if (diff.years === 1) {
      arr.push(diff.years + ' year');
    } else if (diff.years && diff.years !== 0) {
      arr.push(diff.years + ' years');
    }
    if (diff.months === 1) {
      arr.push('1 month');
    } else if (diff.months && diff.months !== 0) {
      arr.push(diff.months + ' months');
    }
    if (diff.days === 1) {
      arr.push('1 day');
    } else if (diff.days && diff.days !== 0) {
      arr.push(diff.days + ' days');
    }
    return arr.join(', ');
  },
  'diff-yd': (tmpl) => {
    let d = getBoth(tmpl);
    let diff = delta(d.from, d.to);
    let arr = [];
    if (diff.years === 1) {
      arr.push(diff.years + ' year');
    } else if (diff.years && diff.years !== 0) {
      arr.push(diff.years + ' years');
    }
    //ergh...
    diff.days += (diff.months || 0) * 30;
    if (diff.days === 1) {
      arr.push('1 day');
    } else if (diff.days && diff.days !== 0) {
      arr.push(diff.days + ' days');
    }
    return arr.join(', ');
  },
  'diff-d': (tmpl) => {
    let d = getBoth(tmpl);
    let diff = delta(d.from, d.to);
    let arr = [];
    //ergh...
    diff.days += (diff.years || 0) * 365;
    diff.days += (diff.months || 0) * 30;
    if (diff.days === 1) {
      arr.push('1 day');
    } else if (diff.days && diff.days !== 0) {
      arr.push(diff.days + ' days');
    }
    return arr.join(', ');
  },

};
module.exports = parsers;
