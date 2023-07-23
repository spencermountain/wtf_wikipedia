/**
 * @fileoverview wtf_wikipedia/demo/detailedDemo/detailedDemo.js
 * demonstrates a detailed example of the wtf_wikipedia API.
 */
const TEXT_SHOW_LENGTH = 150;        // how much of the text string to show
const NF = wtf.Helper.formatNumber;  // alias to shorten the function name

wtf.Helper.init(main);  // calls main after doc loaded, breaks back button cache


// main entry point for the app
async function main() {
  let resultsStr = '';

  let queryString = 'Grace Hopper';
  let doc = await wtf.Helper.fetchNicely(queryString);

  resultsStr += showTopLevelApi(queryString, doc);
  let section = doc.sections()[0];
  resultsStr += showSectionApi(section);

  document.querySelector('.mainSection').innerHTML = resultsStr;
}

function showTopLevelApi(queryString, doc) {
  let msg = '<h2>let doc = wtf.fetch("' + queryString + '")</h2>';

  msg += addToMsg('doc,title()', doc.title());
  msg += addToMsg('doc.pageID()', doc.pageID());
  msg += addToMsg('doc.wikidata()', doc.wikidata());
  msg += addToMsg('doc.domain()', doc.domain());
  msg += addToMsg('doc.url()', doc.url());
  msg += addToMsg('doc.lang()', doc.lang());
  msg += addToMsg('doc.namespace()', doc.namespace());
  msg += addToMsg('doc.isRedirect()', doc.isRedirect());
  msg += addToMsg('doc.redirectTo()', doc.redirectTo());
  msg += addToMsg('doc.isDisambiguation()', doc.isDisambiguation());
  msg += addToMsg('doc.coordinates()', doc.coordinates());
  msg += showCount('doc.categories', doc.categories(),
                   ': [' + doc.categories().join(', ').substring(0,80)+'...]');
  msg += showCount('doc.sections', doc.sections());
  msg += showCount('doc.paragraphs', doc.paragraphs());
  msg += showCount('doc.sentences', doc.sentences());
  msg += showCount('doc.images', doc.images());
  msg += showCount('doc.links', doc.links());
  msg += showCount('doc.lists', doc.lists());
  msg += showCount('doc.tables', doc.tables());
  msg += showCount('doc.templates', doc.templates());
  msg += showCount('doc.infoboxes', doc.infoboxes());
  msg += showCount('doc.references', doc.references());

  msg += showPartialText('doc.text', doc.text());
  msg += showPartialText('doc.json', JSON.stringify(doc.json()));
  msg += showPartialText('doc.wikitext', doc.wikitext());

  return msg;
}


function showSectionApi(section) {
  let msg = '<br><h2>let section = doc.sections()[0]</h2>';

  msg += addToMsg('section.title()', section.title());
  msg += addToMsg('section.index()', section.index());
  msg += addToMsg('section.indentation()', section.indentation());
  msg += addToMsg('section.coordinates()', section.coordinates());

  msg += showCount('section.paragraphs', section.paragraphs());
  msg += showCount('section.sentences', section.sentences());
  msg += showCount('section.images', section.images());
  msg += showCount('section.links', section.links());

  msg += showCount('section.lists', section.lists());
  msg += showCount('section.tables', section.tables());
  msg += showCount('section.templates', section.templates());
  msg += showCount('section.infoboxes', section.infoboxes());
  msg += showCount('section.references', section.references());
  msg += showCount('section.interwiki', section.interwiki());

  msg += addToMsg('section.remove()', ); //section.remove());
  msg += addToMsg('section.nextSibling()', section.nextSibling());
  msg += addToMsg('section.lastSibling()', section.lastSibling());
  msg += addToMsg('section.children()', section.children());
  msg += addToMsg('section.parent()', section.parent());

  msg += showPartialText('section.text', section.text());
  msg += showPartialText('section.json', JSON.stringify(section.json()));
  msg += showPartialText('section.wikitext', section.wikitext());

  return msg;
}

function showCount(listName, list, optStr='') {
  let subName = listName.substring(listName.indexOf('.') + 1);
  let str = 'there are ' + NF(list.length) + ' ' + subName + optStr;
  return addToMsg(listName + '()', str);
}

function showPartialText(listName, text) {
  let str = 'text is ' + NF(text.length) + ' chars: ' +
      text.substring(0, TEXT_SHOW_LENGTH) + '...';
  return addToMsg(listName + '()', str);
}

function addToMsg(key='<br>', value='') {
  return '<div class=line>' +
      '<div class=key>' + key + '</div> ' +
      '<div class=value>' + value + '</div>' +
    '</div>';
}
