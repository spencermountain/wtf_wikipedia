const makeImage = (image) => {
  let alt = image.file.replace(/^(file|image):/i, '');
  alt = alt.replace(/\.(jpg|jpeg|png|gif|svg)/i, '');
  return '  <img src="' + image.thumbnail() + '" alt="' + alt + '"/>';
};
module.exports = makeImage;
