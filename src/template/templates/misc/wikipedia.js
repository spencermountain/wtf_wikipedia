const parse = require('../../_parsers/parse')
const Image = require('../../../image/Image')
const lib = require('./_lib')

const parsers = {
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

  //this one's a little different
  won: (tmpl) => {
    let data = parse(tmpl, ['text'])
    return data.place || data.text || lib.titlecase(data.template)
  },
}

module.exports = parsers
