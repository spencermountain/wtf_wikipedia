//markdown images are like this: ![alt text](href)
const doImage = (image) => {
  let alt = image.data.file.replace(/^(file|image):/i, '');
  alt = alt.replace(/\.(jpg|jpeg|png|gif|svg)/i, '');
  return '![' + alt + '](' + image.thumbnail() + ')';
};
module.exports = doImage;
