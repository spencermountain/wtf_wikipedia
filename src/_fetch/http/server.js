const https = require('https')

// use the native nodejs request function
const request = function(url, options = {}) {
  let agent =
    options.userAgent ||
    options['User-Agent'] ||
    options['Api-User-Agent'] ||
    'User of the wtf_wikipedia library'

  return new Promise((resolve, reject) => {
    const opts = {
      headers: {
        'Content-Type': 'application/json',
        'Api-User-Agent': agent,
        'User-Agent': agent
      }
    }
    https
      .get(url, opts, resp => {
        let data = ''
        // A chunk of data has been recieved.
        resp.on('data', chunk => {
          data += chunk
        })
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          try {
            let json = JSON.parse(data)
            resolve(json)
          } catch (e) {
            reject(e)
          }
        })
      })
      .on('error', err => {
        reject(err)
      })
  })
}
module.exports = request
