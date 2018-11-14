const pipes = require('../_parsers/_pipes');

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
  }
};
module.exports = sports;
