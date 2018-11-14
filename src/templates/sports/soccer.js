const pipes = require('../_parsers/_pipes');
const pipeSplit = require('../_parsers/pipeSplit');

let sports = {
  //https://en.wikipedia.org/wiki/Template:Goal
  goal: (tmpl, r) => {
    let order = [
      'min1', 'note1',
      'min2', 'note2',
      'min3', 'note3',
      'min4', 'note4',
      'min5', 'note5',
      'min6', 'note6',
      'min7', 'note7',
      'min8', 'note8',
      'min9', 'note9',
      'min10', 'note10',
    ];
    let res = pipes(tmpl, order);
    let obj = {
      template: res.name,
      data: []
    };
    let arr = res.list;
    for(let i = 0; i < arr.length; i += 2) {
      obj.data.push({
        min: arr[i],
        note: arr[i + 1] || '',
      });
    }
    r.templates.push(obj);
    //generate a little text summary
    let summary = '⚽ ';
    summary += obj.data.map((o) => {
      let note = o.note;
      if (note) {
        note = ` (${note})`;
      }
      return o.min + '\'' + note;
    }).join(', ');
    return summary;
  },
  //yellow card
  yel: (tmpl, r) => {
    let obj = pipeSplit(tmpl, ['min']);
    r.templates.push(obj);
    if (obj.min) {
      return `yellow: ${obj.min || ''}'`; //no yellow-card emoji
    }
    return '';
  },
  'subon': (tmpl, r) => {
    let obj = pipeSplit(tmpl, ['min']);
    r.templates.push(obj);
    if (obj.min) {
      return `sub on: ${obj.min || ''}'`; //no yellow-card emoji
    }
    return '';
  },
  'suboff': (tmpl, r) => {
    let obj = pipeSplit(tmpl, ['min']);
    r.templates.push(obj);
    if (obj.min) {
      return `sub off: ${obj.min || ''}'`; //no yellow-card emoji
    }
    return '';
  },
  'pengoal': (tmpl, r) => {
    r.templates.push({
      template: 'pengoal'
    });
    return '✅';
  },
  'penmiss': (tmpl, r) => {
    r.templates.push({
      template: 'penmiss'
    });
    return '❌';
  },
  //'red' card - {{sent off|cards|min1|min2}}
  'sent off': (tmpl, r) => {
    let obj = pipes(tmpl);
    let template = {
      template: 'sent off',
      cards: obj.list[0],
      minutes: obj.list.slice(1)
    };
    r.templates.push(template);
    let mins = template.minutes.map(m => m + '\'').join(', ');
    return 'sent off: ' + mins;
  }
};
module.exports = sports;
