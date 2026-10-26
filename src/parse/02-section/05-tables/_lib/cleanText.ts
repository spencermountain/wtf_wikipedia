const cleanText = function (str) {
  //anything before a single-pipe is styling, so remove it
  const pipe = str.indexOf('|')
  const bracket = str.indexOf('[')
  if (pipe !== -1 && (bracket === -1 || pipe < bracket)) {
    str = str.replace(/^.*?\| ?/m, '') //class="unsortable"|title
  }
  str = str.replace(/style=['"].*?["']/, '')
  //'!' is used as a highlighed-column
  str = str.replace(/^!/, '')
  str = str.trim()

  return str
}

export default cleanText
