// choose a good, representative image for this page, if one exists
const mainImage = function () {
  const box = this.infobox()
  if (box) {
    const img = box.image()
    if (img) {
      return img
    }
  }
  // fallback to a lone image in the first section
  const section = this.sections()[0]
  if (section) {
    const imgs = section.images()
    if (imgs.length === 1) {
      return imgs[0]
    }
  }
  return null
}
export default mainImage
