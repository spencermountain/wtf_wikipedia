/**
 * @fileoverview wtf_wikipedia/demo/detailedDemo/detailedDemo.js
 * demonstrates a detailed example of the wtf_wikipedia API.
 */

wtf.Helper.init(main);  // calls main after doc loaded, breaks back button cache

const NF = wtf.Helper.formatNumber;  // alias to shorten the function name

// main entry point for the app
async function main() {
  let msg = '<div class=header>wtf_wikipedia API demo</div>';

  msg = await showQueryResults(msg, 'Grace Hopper');
  // msg += showAListOfResults();

  document.body.innerHTML = msg;
}


// build up the html and then add it all at once to minimize redraws
async function showQueryResults(msg, queryString) {
  const TEXT_SHOW_LENGTH = 150;
  const TAB = '&nbsp;&nbsp;';
  let subMsg = '';

  let doc = await wtf.Helper.fetchNicely(queryString);


  msg += '<div class=fetchLine>wtf.fetch(' + queryString + ')</div>';
  msg += '<div class=mainSection>';

  msg = addToMsg(msg, 'title()', doc.title());
  msg = addToMsg(msg, 'pageID()', doc.pageID());
  msg = addToMsg(msg, 'wikidata()', doc.wikidata());
  msg = addToMsg(msg, 'domain()', doc.domain());
  msg = addToMsg(msg, 'url()', doc.url());

  msg = addToMsg(msg, 'lang()', doc.lang());
  msg = addToMsg(msg, 'namespace()', doc.namespace());
  msg = addToMsg(msg, 'isRedirect()', doc.isRedirect());
  msg = addToMsg(msg, 'redirectTo()', doc.redirectTo());
  msg = addToMsg(msg, 'isDisambiguation()', doc.isDisambiguation());

  let catList = doc.categories();
  let catStr = '[' + catList.join(', ').substring(0, TEXT_SHOW_LENGTH) + '...]';
  subMsg = 'there are ' + NF(catList.length) + ' categories: ' + catStr;
  msg = addToMsg(msg, 'categories()', subMsg);

  let sectionList = doc.sections();
  subMsg = 'there are ' + NF(sectionList.length) + ' sections<br>';
  msg = addToMsg(msg, 'sections()', subMsg);

  let paragraphList = doc.paragraphs();
  subMsg = 'there are ' + NF(paragraphList.length) + ' paragraphs<br>';
  msg = addToMsg(msg, 'paragraphs()', subMsg);

  let sentenceList = doc.sentences();
  subMsg = 'there are ' + NF(sentenceList.length) + ' sentences<br>';
  msg = addToMsg(msg, 'sentences()', subMsg);

  let imageList = doc.images();
  subMsg = 'there are ' + NF(imageList.length) + ' images<br>';
  msg = addToMsg(msg, 'images()', subMsg);
  console.log('show the first 10 images');

  let linkList = doc.links();
  subMsg = 'there are ' + NF(linkList.length) + ' links<br>';
  msg = addToMsg(msg, 'links()', subMsg);

  let listList = doc.lists();
  subMsg = 'there are ' + NF(listList.length) + ' lists<br>';
  msg = addToMsg(msg, 'lists()', subMsg);
  console.log('show the first 10 lists');

  let tableList = doc.tables();
  subMsg = 'there are ' + NF(tableList.length) + ' tables<br>';
  msg = addToMsg(msg, 'tables()', subMsg);
  console.log('show the first 10 tables');

  let templateList = doc.templates();
  subMsg = 'there are ' + NF(templateList.length) + ' templates<br>';
  msg = addToMsg(msg, 'templates()', subMsg);
  console.log('show the first 10 templates');

  let infoBoxList = doc.infoboxes();
  subMsg = 'there are ' + NF(infoBoxList.length) + ' infoBoxes<br>';
  msg = addToMsg(msg, 'infoBoxes()', subMsg);
  console.log('show infoBox info');

  let referenceList = doc.references();
  subMsg = 'there are ' + NF(referenceList.length) + ' references<br>';
  msg = addToMsg(msg, 'references()', subMsg);
  console.log('show reference info');

  msg = addToMsg(msg, 'coordinates()', doc.coordinates());

  let text = doc.text();
  subMsg = 'text is ' + NF(text.length) + ' characters long: "' +
    text.substring(0, TEXT_SHOW_LENGTH) + '..."';
  msg = addToMsg(msg, 'text()', subMsg);

  let json = doc.json();
  let jsonStr = JSON.stringify(json);
  subMsg = 'json snippet: ' + jsonStr.substring(0, TEXT_SHOW_LENGTH) + '...}';
  msg = addToMsg(msg, 'json()', subMsg);

  let wikiText = doc.wikitext();
  subMsg = 'wikitext is ' + NF(wikiText.length) + ' characters long: ' +
    wikiText.substring(0, TEXT_SHOW_LENGTH) + '...';
  msg = addToMsg(msg, 'wikitext()', subMsg);

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
