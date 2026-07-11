/* eslint-disable no-console */

const request = function (url, opts) {
  return fetch(url, opts).then(function (res) {
    return res.json()
  }).catch((e) => {
    console.error('\n\n=-=- http response error =-=-=-')
    console.error(url)
    console.error(e)
    return {}
  })
}
export default request