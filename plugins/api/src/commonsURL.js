import md5 from './_md5.js'

const server = 'https://upload.wikimedia.org/wikipedia/commons/'

const encodeTitle = function (file) {
  let title = file.replace(/^(image|file?):/i, '')
  title = title.trim()
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1)
  //spaces to underscores
  title = title.replace(/ /g, '_')
  return title
}

//instead of the wikimedia redirect server, generate a direct url.
//the commons image path is a little silly:
//https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F
const commonsURL = function (file) {
  let title = encodeTitle(file)
  const hash = md5(title)
  const path = hash.substring(0, 1) + '/' + hash.substring(0, 2) + '/'
  title = encodeURIComponent(title)
  return server + path + title
}
export default commonsURL
