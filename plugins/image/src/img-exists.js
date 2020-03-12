const http = require('./http/server')

// test if the image url exists or not
const imgExists = function(callback) {
  return http(this.url(), {
    method: 'HEAD'
  })
    .then(function(res) {
      const exists = res.status === 200
      //support callback non-promise form
      if (callback) {
        callback(null, exists)
      }
    })
    .catch(e => {
      console.error(e)
      if (callback) {
        callback(e, null)
      }
    })
}
module.exports = imgExists
