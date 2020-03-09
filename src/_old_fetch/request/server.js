const https = {} //require('https')

// use the native nodejs request function
const request = function(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, resp => {
        let data = ''
        // A chunk of data has been recieved.
        resp.on('data', chunk => {
          data += chunk
        })
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve(data)
        })
      })
      .on('error', err => {
        reject(err)
      })
  })
}
module.exports = request
