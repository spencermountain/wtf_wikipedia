// use the native client-side fetch function
const request = function(url, opts) {
  return fetch(url, opts) //eslint-disable-line
}
module.exports = request
