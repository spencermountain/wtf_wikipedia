
//not all too fancy - used in {{timesince}}
const timeSince = function(str) {
  let d = new Date(str);
  if (isNaN(d.getTime())) {
    return '';
  }
  let now = new Date();
  let delta = now.getTime() - d.getTime();
  let predicate = 'ago';
  if (delta < 0) {
    predicate = 'from now';
    delta = Math.abs(delta);
  }
  //figure out units
  let hours = delta / 1000 / 60 / 60;
  let days = hours / 24;
  if (days < 365) {
    return parseInt(days, 10) + ' days ' + predicate;
  }
  let years = days / 365;
  return parseInt(years, 10) + ' years ' + predicate;
};
module.exports = timeSince;
