
//
const toMarkdown = (list, options) => {
  return list.lines().map((s) => {
    let str = s.markdown(options);
    return ' * ' + str;
  }).join('\n');
};
module.exports = toMarkdown;
