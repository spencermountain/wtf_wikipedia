const Hashes = require('jshashes')

const server = 'https://upload.wikimedia.org/wikipedia/commons/'

const encodeTitle = function(file) {
  let title = file.replace(/^(image|file?)\:/i, '')
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1)
  //spaces to underscores
  title = title.trim().replace(/ /g, '_')
  return title
}

//the wikimedia image url is a little silly:
//https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F
const commonsURL = function() {
  let file = this.data.file
  let title = encodeTitle(file)
  let hash = new Hashes.MD5().hex(title)
  let path = hash.substr(0, 1) + '/' + hash.substr(0, 2) + '/'
  title = encodeURIComponent(title)
  path += title
  return server + path
}
module.exports = commonsURL
