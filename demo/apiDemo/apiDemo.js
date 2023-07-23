/**
 * @fileoverview wtf_wikipedia/demo/detailedDemo/detailedDemo.js
 * demonstrates a detailed example of the wtf_wikipedia API.
 */

wtf.Helper.init(main);  // calls main after doc loaded, breaks back button cache

// main entry point for the app
async function main() {
  let msg = '<div class=header>wtf_wikipedia API demo</div>';

  msg = await showQueryResults(msg, 'Grace Hopper');
  // msg += showAListOfResults();

  document.body.innerHTML = msg;
}


// build up the html and then add it all at once to minimize redraws
async function showQueryResults(msg, queryString) {
  let doc = await wtf.Helper.fetchNicely(queryString);

  msg += '<div class=fetchLine>wtf.fetch(' + queryString + ')</div>';
  msg += '<div class=mainSection>';

  msg = addToMsg(msg, 'title()', doc.title());
  msg = addToMsg(msg, 'pageID()', doc.pageID());
  msg = addToMsg(msg, 'wikidata()', doc.wikidata());
  msg = addToMsg(msg, 'domain()', doc.domain());
  msg = addToMsg(msg, 'url()', doc.url());

  msg = addToMsg(msg, '.lang()', doc.lang());
  msg = addToMsg(msg, '.namespace()', doc.namespace());
  msg = addToMsg(msg, '.isRedirect()', doc.isRedirect());
  msg = addToMsg(msg, '.redirectTo()', doc.redirectTo());
  msg = addToMsg(msg, '.isDisambiguation()', doc.isDisambiguation());
  msg = addToMsg(msg, '.categories()', doc.categories());
  msg = addToMsg(msg, '.sections()', doc.sections());
  msg = addToMsg(msg, '.paragraphs()', doc.paragraphs());
  msg = addToMsg(msg, '.sentences()', doc.sentences());
  msg = addToMsg(msg, '.images()', doc.images());
  msg = addToMsg(msg, '.links()', doc.links());
  msg = addToMsg(msg, '.lists()', doc.lists());
  msg = addToMsg(msg, '.tables()', doc.tables());
  msg = addToMsg(msg, '.templates()', doc.templates());
  msg = addToMsg(msg, '.infoboxes()', doc.infoboxes());
  msg = addToMsg(msg, '.references()', doc.references());
  msg = addToMsg(msg, '.coordinates()', doc.coordinates());
  msg = addToMsg(msg, '.text()', doc.text());
  msg = addToMsg(msg, '.json()', doc.json());
  msg = addToMsg(msg, '.wikitext()', doc.wikitext());

  msg += '</div> <!-- mainSection -->';
  return msg;
}

function addToMsg(msg, key, value) {
  msg += '<div class=line>' +
    '<div class=key>' + key + '</div> ' +
    '<div class=value>' + value + '</div>' +
    '</div>';

  return msg;
}
