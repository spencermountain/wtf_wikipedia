const capitalise = function (str) {
  if (str && typeof str === 'string') {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  return ''
}
export { capitalise }
