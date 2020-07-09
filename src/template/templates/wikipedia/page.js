const parse = require('../../_parsers/parse')
const Image = require('../../../image/Image')

const sisterProjects = {
  wikt: 'wiktionary',
  commons: 'commons',
  c: 'commons',
  commonscat: 'commonscat',
  n: 'wikinews',
  q: 'wikiquote',
  s: 'wikisource',
  a: 'wikiauthor',
  b: 'wikibooks',
  voy: 'wikivoyage',
  v: 'wikiversity',
  d: 'wikidata',
  species: 'wikispecies',
  m: 'meta',
  mw: 'mediawiki',
}

const parsers = {
  // https://en.wikipedia.org/wiki/Template:About
  about: (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    return ''
  },

  // https://en.wikipedia.org/wiki/Template:Main
  main: (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    return ''
  },

  // https://en.wikipedia.org/wiki/Template:Main_list
  'main list': (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    return ''
  },

  // https://en.wikipedia.org/wiki/Template:See
  see: (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    return ''
  },

  // https://en.wikipedia.org/wiki/Template:For
  for: (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    return ''
  },

  // https://en.wikipedia.org/wiki/Template:Further
  further: (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    return ''
  },

  // same as "further" (but this name is still in use)
  'further information': (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    return ''
  },

  // https://en.wikipedia.org/wiki/Template:Listen
  listen: (tmpl, list) => {
    let obj = parse(tmpl)
    list.push(obj)
    return ''
  },

  'wide image': ['file', 'width', 'caption'],

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

  //this one sucks - https://en.wikipedia.org/wiki/Template:GNIS
  'cite gnis': (tmpl, list) => {
    let order = ['id', 'name', 'type']
    let obj = parse(tmpl, order)
    obj.type = 'gnis'
    obj.template = 'citation'
    list.push(obj)
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Sfn
  sfn: (tmpl, list, alias) => {
    let order = ['author', 'year', 'location']
    let obj = parse(tmpl, order)
    if (alias) {
      obj.name = obj.template
      obj.teplate = alias
    }
    list.push(obj)
    return ''
  },

  audio: ['file', 'text', 'type'],
  rp: ['page'],

  'spoken wikipedia': (tmpl, list) => {
    let order = ['file', 'date']
    let obj = parse(tmpl, order)
    obj.template = 'audio'
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

  'short description': ['description'],
  'coord missing': ['region'],
  //amazingly, this one does not obey any known patterns
  //https://en.wikipedia.org/wiki/Template:Gallery
  gallery: (tmpl, list) => {
    let obj = parse(tmpl)
    let images = (obj.list || []).filter((line) => /^ *File ?:/.test(line))
    images = images.map((file) => {
      let img = {
        file: file,
      }
      // TODO: add lang and domain information
      return new Image(img).json()
    })
    obj = {
      template: 'gallery',
      images: images,
    }
    list.push(obj)
    return ''
  },
  //https://en.wikipedia.org/wiki/Template:See_also
  'see also': (tmpl, list) => {
    let data = parse(tmpl)
    list.push(data)
    return ''
  },
  unreferenced: ['date'],
}
//aliases
parsers['cite'] = parsers.citation
parsers['sfnref'] = parsers.sfn
parsers['harvid'] = parsers.sfn
parsers['harvnb'] = parsers.sfn
parsers['unreferenced section'] = parsers.unreferenced
parsers['redir'] = parsers.redirect
parsers['sisterlinks'] = parsers['sister project links']
parsers['main article'] = parsers['main']

module.exports = parsers
