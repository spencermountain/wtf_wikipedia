const makeImage = (img) => {
  return '  <img src="' + img.thumbnail() + '" alt="' + img.alt() + '"/>';
};
module.exports = makeImage;
