const https = require('https')

// use the native nodejs request function
const request = function(url, opts = {}) {
  return new Promise((resolve, reject) => {
    https
      .get(url, opts, resp => {
        let status = String(resp.statusCode) || ''
        let bool = /^[23]/.test(status)
        resolve(bool)
      })
      .on('error', err => {
        reject(err)
      })
  })
}
module.exports = request
