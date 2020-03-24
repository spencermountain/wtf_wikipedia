const parse = require('../_parsers/parse')

let templates = {
  //https://en.wikipedia.org/wiki/Template:Taxon_info
  'taxon info': ['taxon', 'item'],

  //minor planet - https://en.wikipedia.org/wiki/Template:MPC
  mpc: (tmpl, list) => {
    let obj = parse(tmpl, ['number', 'text'])
    list.push(obj)
    return `[https://minorplanetcenter.net/db_search/show_object?object_id=P/2011+NO1 ${obj.text || obj.number}]`
  },
  //https://en.wikipedia.org/wiki/Template:Chem2
  chem2: (tmpl, list) => {
    let obj = parse(tmpl, ['equation'])
    list.push(obj)
    return obj.equation
  },
  //https://en.wikipedia.org/wiki/Template:Sky
  sky: (tmpl, list) => {
    let obj = parse(tmpl, [
      'asc_hours',
      'asc_minutes',
      'asc_seconds',
      'dec_sign',
      'dec_degrees',
      'dec_minutes',
      'dec_seconds',
      'distance'
    ])
    let template = {
      template: 'sky',
      ascension: {
        hours: obj.asc_hours,
        minutes: obj.asc_minutes,
        seconds: obj.asc_seconds
      },
      declination: {
        sign: obj.dec_sign,
        degrees: obj.dec_degrees,
        minutes: obj.dec_minutes,
        seconds: obj.dec_seconds
      },
      distance: obj.distance
    }
    list.push(template)
    return ''
  },

  /*
{{Medical cases chart/Row
|1          = valid date
|2          = expression for deaths
|3          = expression for recoveries
|4          = expression for total cases (3rd classification)
|alttot1    = alternate expression for active cases (3rd classification)
|5          = expression for number in 4th classification
|6          = expression for total in 5th classification
|alttot2    = alternate expression for number in 5th classification
|7          = number in the first column
|8          = change in the first column
|firstright1= whether a change in the first column is not applicable (n.a.) (yes|y|1)
|9          = number in the second column
|10         = change in the second column
|firstright2= whether a change in the second column is not applicable (n.a.) (yes|y|1)
|divisor    = scaling divisor of the bars (bigger value = narrower bars)               [defaults to: 1]
|numwidth   = max width of the numbers in the right columns (xx or xxxx)<-(n|t|m|w|d)  [defaults to: mm]
|collapsible= whether the row is collapsible (yes|y|1)                                 {WIP}
|collapsed  = manual override of the initial row state (yes|y|1)                       {WIP}
|id         = manual override of the row id                                            {WIP}
}}
*/

  // this is a weird one
  //https://en.wikipedia.org/wiki/Template:Medical_cases_chart
  'medical cases chart': (tmpl, list) => {
    let order = [
      'date',
      'deaths_expr',
      'recovery_expr',
      'cases_expr',
      'alt_expr_1',
      '4th_expr',
      '5th_expr',
      'alt_expr_2',
      'col_1',
      'col_1_change',
      'show_col_1',
      'col_2',
      'col_2_change',
      'show_col_2',
      'divisor',
      'numwidth',
      'collabsible',
      'collapsed',
      'id'
    ]
    let obj = parse(tmpl)
    // parse each row template
    let rows = obj.rows.match(/\{\{Medical cases chart\/Row.*\}\}/gi)
    obj.rows = rows.map(row => {
      return parse(row, order)
    })
    list.push(obj)
    return ''
  },
  'medical cases chart/row': tmpl => {
    // actually keep this template
    return tmpl
  }
}
module.exports = templates
