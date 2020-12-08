const wtf = require('./src/index')
wtf.extend(require('./plugins/api/src'))

const plugin = (models, templates) => {
  // add templates
  templates.tag = (text, data, c, d) => {
    console.log(d)
    return
  }
}

wtf.extend(plugin)

// wtf.fetch('https://wiki.openstreetmap.org/wiki/Tag:highway%3Dmotorway', { path: '/w/api.php' }).then((doc) => {
//   // console.log(doc.templates('ValueDescription'))
// })

wtf(`{{Tag|aerialway|subkey=occupancy}}`)
