
//create links, bold, italic in markdown
const doSentence = (sentence, options) => {
  let md = sentence.text;
  if (sentence.links) {
    //turn links back into links
    if (options.links === true) {
      sentence.links.forEach((link) => {
        let href = '';
        //if it's an external link, we good
        if (link.site) {
          href = link.site;
        } else {
          //otherwise, make it a relative internal link
          href = './' + link.page.replace(/ /g, '_');
        }
        let mdLink = '[' + link.text + '](' + href + ')';
        md = md.replace(link.text, mdLink);
      });
    }
  }
  return md;
};
module.exports = doSentence;
