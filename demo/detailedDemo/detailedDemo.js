/**
 * @fileoverview wtf_wikipedia/demo/detailedDemo/detailedDemo.js
 * demonstrates a detailed example of the wtf_wikipedia API.
 */

window.addEventListener('load', main);
window.addEventListener('unload', function () {});  // break back button cache

// main entry point for the app
async function main() {
  wtf.fetch('On a Friday', { lang: 'en' }).then((doc) => {
    let val = doc.infobox(0).get('current_members')
    let members = val.links().map((link) => link.page())
    document.querySelector('.results').innerHTML = members.join(', ')
  });
}
