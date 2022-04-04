//markdown images are like this: ![alt text](href)
const toMarkdown = function () {
  let alt = this.data.file.replace(/^(file|image):/i, '')
  alt = alt
    .replace(/\.(jpg|jpeg|png|gif|svg)/i, '')
    .split('_')
    .join(' ')
  return '![' + alt + '](' + this.thumbnail() + ')'
}
export default toMarkdown
