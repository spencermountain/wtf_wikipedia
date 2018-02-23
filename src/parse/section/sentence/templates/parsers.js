const months = [
  undefined, //1-based months.. :/
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
  'December',
];

const parsers = {

  //generic {{date|year|month|date}} template
  date: (tmpl, obj) => {
    let arr = tmpl.split('|');
    arr = arr.slice(1, 4);
    arr = arr.map((num) => parseInt(num, 10));
    let date = {
      year: arr[0],
      month: arr[1],
      date: arr[2],
    };
    //make the replacement string
    let str = String(arr[0]);
    if (date.month !== undefined && months[date.month] !== undefined) {
      if (date.date === undefined) {
        //January 1995
        str = `${months[date.month]} ${date.year}`;
      } else {
        //January 5, 1995
        str = `${months[date.month]} ${date.date}, ${date.year}`;
      }
    }
    date.text = str;
    obj.dates = obj.dates || [];
    obj.dates.push(date);
    return str;
  }
};
module.exports = parsers;
