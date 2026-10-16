// is there a good image of this
const mainImage = function () {
  const box = this.infobox()
  if (box) {
    const img = box.image()
    if (img) {
      return img
    }
  }
  const s = this.section()
  const imgs = s.images()
  if (imgs.length === 1) {
    return imgs[0]
  }
  return null
}
export default mainImage
