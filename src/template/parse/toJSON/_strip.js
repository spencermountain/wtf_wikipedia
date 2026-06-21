const strip = function (tmpl) {
  tmpl = tmpl.replace(/^\{\{/, '')
  tmpl = tmpl.replace(/\}\}$/, '')
  return tmpl
}
export default strip
