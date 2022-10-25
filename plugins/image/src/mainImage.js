// is there a good image of this
function mainImage () {
  let box = this.infobox()
  if (box) {
    let img = box.image()
    if (img) {
      return img
    }
  }
  let s = this.section()
  let imgs = s.images()
  if (imgs.length === 1) {
    return imgs[0]
  }
  return null
}
export default mainImage
