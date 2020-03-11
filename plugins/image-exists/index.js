/* global fetch */
const addMethod = function(models) {
  // add a new method to Image class
  models.Image.exists = function(callback) {
    //check if the image (still) exists
    return new Promise(cb => {
      // use the client-side fetch module
      fetch(this.url(), {
        method: 'HEAD'
      }).then(function(res) {
        const exists = res.status === 200
        //support callback non-promise form
        if (callback) {
          callback(exists)
        }
        cb(exists)
      })
    })
  }
}
module.exports = addMethod
