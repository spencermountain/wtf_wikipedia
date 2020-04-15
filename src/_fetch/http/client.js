// use the native client-side fetch function
const request = function (url, opts) {
  //eslint-disable-next-line
  return fetch(url, opts).then(function (res) {
    return res.json()
  })
}
module.exports = request
