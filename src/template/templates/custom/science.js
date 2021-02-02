const parse = require('../../parse/toJSON')

let templates = {
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
      'distance',
    ])
    let template = {
      template: 'sky',
      ascension: {
        hours: obj.asc_hours,
        minutes: obj.asc_minutes,
        seconds: obj.asc_seconds,
      },
      declination: {
        sign: obj.dec_sign,
        degrees: obj.dec_degrees,
        minutes: obj.dec_minutes,
        seconds: obj.dec_seconds,
      },
      distance: obj.distance,
    }
    list.push(template)
    return ''
  },

  // Parse https://en.wikipedia.org/wiki/Template:Medical_cases_chart -- see
  // https://en.wikipedia.org/wiki/Module:Medical_cases_chart for the original
  // parsing code.
  'medical cases chart': (tmpl, list) => {
    let order = [
      'date',
      'deathsExpr',
      'recoveriesExpr',
      'casesExpr',
      '4thExpr',
      '5thExpr',
      'col1',
      'col1Change',
      'col2',
      'col2Change',
    ]

    let obj = parse(tmpl)
    obj.data = obj.data || ''
    let rows = obj.data.split('\n')

    // Mimic row parsing in _buildBars in the Lua source, from the following
    // line on:
    //
    //     for parameter in mw.text.gsplit(line, ';') do
    let dataArray = rows.map((row) => {
      let parameters = row.split(';')
      let rowObject = {
        options: new Map(),
      }
      let positionalIndex = 0
      for (let i = 0; i < parameters.length; i++) {
        let parameter = parameters[i].trim()
        if (parameter.match(/^[a-zA-Z_]/)) {
          // Named argument
          let [key, value] = parameter.split('=')
          // At this point, the Lua code evaluates alttot1 and alttot2 values as
          // #expr expressions, but we just pass them through. See also:
          // https://www.mediawiki.org/wiki/Help:Extension:ParserFunctions##expr
          if (value === undefined) {
            value = null
          }
          rowObject.options.set(key, value)
        } else {
          // Positional argument
          // Here again, the Lua code evaluates arguments at index 1 through 5
          // as #expr expressions, but we just pass them through.
          if (positionalIndex < order.length) {
            rowObject[order[positionalIndex]] = parameter
          }
          positionalIndex++
        }
      }
      for (; positionalIndex < order.length; positionalIndex++) {
        rowObject[order[positionalIndex]] = null
      }
      return rowObject
    })
    obj.data = dataArray
    list.push(obj)
    return ''
  },
}
module.exports = templates
