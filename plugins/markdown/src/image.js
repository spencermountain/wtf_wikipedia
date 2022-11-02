//markdown images are like this: ![alt text](href)
function toMarkdown () {
  let alt = this.data.file.replace(/^(file|image):/i, '')
  alt = alt
    .replace(/\.(jpg|jpeg|png|gif|svg)/i, '')
    .split('_')
    .join(' ')
  return '![' + alt + '](' + this.thumbnail() + ')'
}
export default toMarkdown
