import parse from '../../parse/toJSON/index.js'
import Image from '../../../image/Image.js'
import { getLang, sisterProjects, toNumber } from '../_lib.js'

export default {
  // https://en.wikipedia.org/wiki/Template:IPA
  ipa: (tmpl, list) => {
    let obj = parse(tmpl, ['transcription', 'lang', 'audio'])
    obj.lang = getLang(obj.template)
    obj.template = 'ipa'
    list.push(obj)
    return '' //obj.transcription
  },
  //https://en.wikipedia.org/wiki/Template:IPAc-en
  ipac: (tmpl, list) => {
    let obj = parse(tmpl)
    obj.transcription = (obj.list || []).join(',')
    delete obj.list
    obj.lang = getLang(obj.template)
    obj.template = 'ipac'
    list.push(obj)
    return ''
  },

  quote: (tmpl, list) => {
    let obj = parse(tmpl, ['text', 'author'])
    list.push(obj)
    //create plaintext version
    if (obj.text) {
      let str = `"${obj.text}"`
      if (obj.author) {
        str += '\n\n'
        str += `    - ${obj.author}`
      }
      return str + '\n'
    }
    return ''
  },

  //this one sucks - https://en.wikipedia.org/wiki/Template:GNIS
  'cite gnis': (tmpl, list) => {
    let obj = parse(tmpl, ['id', 'name', 'type'])
    obj.type = 'gnis'
    obj.template = 'citation'
    list.push(obj)
    return ''
  },

  'spoken wikipedia': (tmpl, list) => {
    let obj = parse(tmpl, ['file', 'date'])
    obj.template = 'audio'
    list.push(obj)
    return ''
  },

  //yellow card
  yel: (tmpl, list) => {
    let obj = parse(tmpl, ['min'])
    list.push(obj)
    if (obj.min) {
      return `yellow: ${obj.min || ''}'` //no yellow-card emoji
    }
    return ''
  },

  subon: (tmpl, list) => {
    let obj = parse(tmpl, ['min'])
    list.push(obj)
    if (obj.min) {
      return `sub on: ${obj.min || ''}'` //no yellow-card emoji
    }
    return ''
  },

  suboff: (tmpl, list) => {
    let obj = parse(tmpl, ['min'])
    list.push(obj)
    if (obj.min) {
      return `sub off: ${obj.min || ''}'` //no yellow-card emoji
    }
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Sfn
  sfn: (tmpl, list, parser, alias) => {
    let obj = parse(tmpl, ['author', 'year', 'location'])
    if (alias) {
      obj.name = obj.template
      obj.teplate = alias
    }
    list.push(obj)
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Redirect
  redirect: (tmpl, list) => {
    let data = parse(tmpl, ['redirect'])
    let lines = data.list || []
    let links = []
    for (let i = 0; i < lines.length; i += 2) {
      links.push({
        page: lines[i + 1],
        desc: lines[i],
      })
    }
    let obj = {
      template: 'redirect',
      redirect: data.redirect,
      links: links,
    }
    list.push(obj)
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Sister_project_links
  'sister project links': (tmpl, list) => {
    let data = parse(tmpl)
    //rename 'wd' to 'wikidata'
    let links = {}
    Object.keys(sisterProjects).forEach((k) => {
      if (data.hasOwnProperty(k) === true) {
        links[sisterProjects[k]] = data[k] //.text();
      }
    })
    let obj = {
      template: 'sister project links',
      links: links,
    }
    list.push(obj)
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Subject_bar
  'subject bar': (tmpl, list) => {
    let data = parse(tmpl)
    Object.keys(data).forEach((k) => {
      //rename 'voy' to 'wikivoyage'
      if (sisterProjects.hasOwnProperty(k)) {
        data[sisterProjects[k]] = data[k]
        delete data[k]
      }
    })
    let obj = {
      template: 'subject bar',
      links: data,
    }
    list.push(obj)
    return ''
  },

  //amazingly, this one does not obey any known patterns
  //https://en.wikipedia.org/wiki/Template:Gallery
  gallery: (tmpl, list) => {
    let obj = parse(tmpl)
    let images = (obj.list || []).filter((line) => /^ *File ?:/.test(line))
    images = images.map((file) => {
      let img = {
        file: file,
      }
      // todo: add lang and domain information
      return new Image(img).json()
    })
    obj = {
      template: 'gallery',
      images: images,
    }
    list.push(obj)
    return ''
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
        if (parameter.match(/^[a-z_]/i)) {
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

  graph: (tmpl, list) => {
    let data = parse(tmpl)
    if (data.x) {
      data.x = data.x.split(',').map((str) => str.trim())
    }
    if (data.y) {
      data.y = data.y.split(',').map((str) => str.trim())
    }
    let y = 1
    while (data['y' + y]) {
      data['y' + y] = data['y' + y].split(',').map((str) => str.trim())
      y += 1
    }
    list.push(data)
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Historical_populations
  'historical populations': (tmpl, list) => {
    let data = parse(tmpl)
    data.list = data.list || []
    let years = []
    for (let i = 0; i < data.list.length; i += 2) {
      let num = data.list[i + 1]
      years.push({
        year: data.list[i],
        val: Number(num) || num,
      })
    }
    data.data = years
    delete data.list
    list.push(data)
    return ''
  },

  // this one is a handful!
  //https://en.wikipedia.org/wiki/Template:Weather_box
  'weather box': (tmpl, list) => {
    const hasMonth = /^jan /i
    const isYear = /^year /i
    let obj = parse(tmpl)
    const monthList = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    let byMonth = {}
    let properties = Object.keys(obj).filter((k) => hasMonth.test(k))
    properties = properties.map((k) => k.replace(hasMonth, ''))
    properties.forEach((prop) => {
      byMonth[prop] = []
      monthList.forEach((m) => {
        let key = `${m} ${prop}`
        if (obj.hasOwnProperty(key)) {
          let num = toNumber(obj[key])
          delete obj[key]
          byMonth[prop].push(num)
        }
      })
    })
    //add these to original
    obj.byMonth = byMonth
    //collect year-based data
    let byYear = {}
    Object.keys(obj).forEach((k) => {
      if (isYear.test(k)) {
        let prop = k.replace(isYear, '')
        byYear[prop] = obj[k]
        delete obj[k]
      }
    })
    obj.byYear = byYear
    list.push(obj)
    return ''
  },

  //The 36 parameters are: 12 monthly highs (C), 12 lows (total 24) plus an optional 12 monthly rain/precipitation
  //https://en.wikipedia.org/wiki/Template:Weather_box/concise_C
  'weather box/concise c': (tmpl, list) => {
    let obj = parse(tmpl)
    obj.list = obj.list.map((s) => toNumber(s))
    obj.byMonth = {
      'high c': obj.list.slice(0, 12),
      'low c': obj.list.slice(12, 24),
      'rain mm': obj.list.slice(24, 36),
    }
    delete obj.list
    obj.template = 'weather box'
    list.push(obj)
    return ''
  },

  'weather box/concise f': (tmpl, list) => {
    let obj = parse(tmpl)
    obj.list = obj.list.map((s) => toNumber(s))
    obj.byMonth = {
      'high f': obj.list.slice(0, 12),
      'low f': obj.list.slice(12, 24),
      'rain inch': obj.list.slice(24, 36),
    }
    delete obj.list
    obj.template = 'weather box'
    list.push(obj)
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Climate_chart
  'climate chart': (tmpl, list) => {
    let lines = parse(tmpl).list || []
    let title = lines[0]
    let source = lines[38]
    lines = lines.slice(1)
    //amazingly, they use '−' symbol here instead of negatives...
    lines = lines.map((str) => {
      if (str && str[0] === '−') {
        str = str.replace(/−/, '-')
      }
      return str
    })
    let months = []
    //groups of three, for 12 months
    for (let i = 0; i < 36; i += 3) {
      months.push({
        low: toNumber(lines[i]),
        high: toNumber(lines[i + 1]),
        precip: toNumber(lines[i + 2]),
      })
    }
    let obj = {
      template: 'climate chart',
      data: {
        title: title,
        source: source,
        months: months,
      },
    }
    list.push(obj)
    return ''
  },
  //https://en.wikipedia.org/wiki/Template:MedalCount
  medalcount: (tmpl, list) => {
    let all = parse(tmpl).list || []
    let lines = []
    for (let i = 0; i < all.length; i += 4) {
      lines.push({
        name: all[i],
        '1st': Number(all[i + 1]),
        '2nd': Number(all[i + 2]),
        '3rd': Number(all[i + 3]),
      })
    }
    let obj = {
      template: 'medalcount',
      list: lines,
    }
    list.push(obj)
    return ''
  },

  r: (tmpl, list) => {
    let obj = parse(tmpl, ['name'])
    obj.template = 'citation'
    list.push(obj)
    return ''
  },
}
