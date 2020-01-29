const fetch = require('cross-fetch')

const request = function(url, options) {
  const fallbackUserAgent = 'Random user of the wtf_wikipedia library'
  let params = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Api-User-Agent':
        options['Api-User-Agent'] ||
        fallbackUserAgent,
      'User-Agent':
        options.userAgent ||
        options['User-Agent'] ||
        options['Api-User-Agent'] ||
        fallbackUserAgent
    }
  }
  return fetch(url, params)
    .then(response => {
      if (response.status !== 200) {
        throw response
      }
      return response.json()
    })
    .catch(console.error)
}
module.exports = request
