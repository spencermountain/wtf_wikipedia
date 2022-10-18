//normalize template names
function fmtName (name) {
  name = (name || '').trim()
  name = name.toLowerCase()
  name = name.replace(/_/g, ' ')
  return name
}
export default fmtName
