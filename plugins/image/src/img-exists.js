const http = require('./http/server')

// test if the image url exists or not
const imgExists = function(callback) {
  return http(this.url(), {
    method: 'HEAD'
  })
    .then(function(bool) {
      //support callback non-promise form
      if (callback) {
        callback(null, bool)
      }
      return bool
    })
    .catch(e => {
      console.error(e)
      if (callback) {
        callback(e, null)
      }
    })
}
module.exports = imgExists
