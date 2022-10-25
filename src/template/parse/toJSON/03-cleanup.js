const whoCares = {
  classname: true,
  style: true,
  align: true,
  margin: true,
  left: true,
  break: true,
  boxsize: true,
  framestyle: true,
  item_style: true,
  collapsible: true,
  list_style_type: true,
  'list-style-type': true,
  colwidth: true,
}

//remove wiki-cruft & some styling info from templates
function cleanup (obj) {
  Object.keys(obj).forEach((k) => {
    if (whoCares[k.toLowerCase()] === true) {
      delete obj[k]
    }
    //remove empty values, too
    if (obj[k] === null || obj[k] === '') {
      delete obj[k]
    }
  })
  return obj
}
export default cleanup
