/**
 * turn {{name|one|two|three}} into [name, one, two, three]
 *
 * @private
 * @param {string} tmpl the template text
 * @returns {string[]} a array containing all the split parameters
 */
const pipeSplitter = function (tmpl) {
  //start with a naive '|' split
  let arr = tmpl.split(/\n?\|/)
  //we've split by '|', which is pretty lame
  //look for broken-up links and fix them :/
  arr.forEach((a, i) => {
    if (a === null) {
      return
    }
    //has '[[' but no ']]'
    //has equal number of opening and closing tags. handle nested case '[[[[' ']]'
    if (
      /\[\[[^\]]+$/.test(a) ||
      /\{\{[^}]+$/.test(a) ||
      a.split('{{').length !== a.split('}}').length ||
      a.split('[[').length !== a.split(']]').length
    ) {
      arr[i + 1] = arr[i] + '|' + arr[i + 1]
      arr[i] = null
    }
  })
  //cleanup any mistakes we've made
  arr = arr.filter((a) => a !== null)
  arr = arr.map((a) => (a || '').trim())

  //remove empty fields, only at the end:
  for (let i = arr.length - 1; i >= 0; i -= 1) {
    if (arr[i] === '') {
      arr.pop()
    }
    break
  }
  return arr
}
export default pipeSplitter
