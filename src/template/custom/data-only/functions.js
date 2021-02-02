const parse = require('../../parse/toJSON')
const Image = require('../../../image/Image')
const lib = require('../_lib')

module.exports = {
  // https://en.wikipedia.org/wiki/Template:IPA
  ipa: (tmpl, list) => {
    let obj = parse(tmpl, ['transcription', 'lang', 'audio'])
    obj.lang = lib.getLang(obj.template)
    obj.template = 'ipa'
    list.push(obj)
    return ''
  },
  //https://en.wikipedia.org/wiki/Template:IPAc-en
  ipac: (tmpl, list) => {
    let obj = parse(tmpl)
    obj.transcription = (obj.list || []).join(',')
    delete obj.list
    obj.lang = lib.getLang(obj.template)
    obj.template = 'ipac'
    list.push(obj)
    return ''
  },

  quote: (tmpl, list) => {
    let order = ['text', 'author']
    let obj = parse(tmpl, order)
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
    let order = ['id', 'name', 'type']
    let obj = parse(tmpl, order)
    obj.type = 'gnis'
    obj.template = 'citation'
    list.push(obj)
    return ''
  },

  'spoken wikipedia': (tmpl, list) => {
    let order = ['file', 'date']
    let obj = parse(tmpl, order)
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
    Object.keys(lib.sisterProjects).forEach((k) => {
      if (data.hasOwnProperty(k) === true) {
        links[lib.sisterProjects[k]] = data[k] //.text();
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
      if (lib.sisterProjects.hasOwnProperty(k)) {
        data[lib.sisterProjects[k]] = data[k]
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
}
