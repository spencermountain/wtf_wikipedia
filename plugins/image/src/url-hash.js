// import jsHash from 'jshashes'
import md5 from './_md5.js'


const server = 'https://upload.wikimedia.org/wikipedia/commons/'

function encodeTitle (file) {
  let title = file.replace(/^(image|file?):/i, '')
  title = title.trim()
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1)
  //spaces to underscores
  title = title.replace(/ /g, '_')
  return title
}

//the wikimedia image url is a little silly:
//https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F
function commonsURL () {
  let file = this.data.file
  let title = encodeTitle(file)
  // let hash = new jsHash.MD5().hex(title)
  let hash = md5(title)
  let path = hash.substr(0, 1) + '/' + hash.substr(0, 2) + '/'
  title = encodeURIComponent(title)
  path += title
  return server + path
}
export default commonsURL
