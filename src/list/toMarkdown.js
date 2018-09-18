
//
const toMarkdown = (list, options) => {
  return list.map((s) => {
    let str = s.markdown(options);
    return ' * ' + str;
  }).join('\n');
};
module.exports = toMarkdown;
