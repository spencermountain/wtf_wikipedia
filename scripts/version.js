const fs = require('fs')
const pkg = require('../package.json')

//set new version number
fs.writeFileSync('./src/_version.js', `module.exports = '${pkg.version}'`)
