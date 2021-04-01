// is there a good image of this
const mainImage = function (opt = {}) {
  let box = this.infobox()
  if (box) {
    let img = box.image()
    console.log(img)
  }
  // let images = this.images() || []
  return null
}
module.exports = mainImage
