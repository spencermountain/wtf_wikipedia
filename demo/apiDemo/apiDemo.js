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
  resultsStr += showSectionApi(doc.sections()[0]);
  resultsStr += showParagraphApi(doc.paragraphs()[0]);
  resultsStr += showSentenceApi(doc.sentences()[0]);
  resultsStr += showImageApi(doc.images()[0]);
  resultsStr += showTemplateApi(doc.templates()[0]);
  resultsStr += showInfoboxApi(doc.infoboxes()[0]);
  resultsStr += showListApi(doc.lists()[0]) ;
  resultsStr += showReferenceApi(doc.references()[0]) ;
  resultsStr += showTableApi(doc.tables()[0]) ;

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
  msg += showCount('section.interwiki', section.interwiki());

  msg += showCount('section.lists', section.lists());
  msg += showCount('section.tables', section.tables());
  msg += showCount('section.templates', section.templates());
  msg += showCount('section.infoboxes', section.infoboxes());
  msg += showCount('section.references', section.references());

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

function showParagraphApi(paragraph) {
  let msg = '<br><h2>let paragraph = doc.paragraphs()[0]</h2>';

  msg += showCount('paragraph.sentences', paragraph.sentences());
  msg += showCount('paragraph.references', paragraph.references());
  msg += showCount('paragraph.images', paragraph.images());
  msg += showCount('paragraph.links', paragraph.links());
  msg += showCount('paragraph.interwiki', paragraph.interwiki());
  msg += showCount('paragraph.lists', paragraph.lists());

  msg += showPartialText('paragraph.text', paragraph.text());
  msg += showPartialText('paragraph.json', JSON.stringify(paragraph.json()));
  msg += showPartialText('paragraph.wikitext', paragraph.wikitext());

  return msg;
}


function showSentenceApi(sentence) {
  let msg = '<br><h2>let sentence = doc.sentences()[0]</h2>';
  msg += showCount('sentence.links', sentence.links());
  msg += showCount('sentence.bolds', sentence.bolds());
  msg += showCount('sentence.italics', sentence.italics());

  msg += showPartialText('sentence.text', sentence.text());
  msg += showPartialText('sentence.json', JSON.stringify(sentence.json()));
  msg += showPartialText('sentence.wikitext', sentence.wikitext());

  return msg;
}


function showImageApi(image) {
  let msg = '<br><h2>let image = doc.images()[0]</h2>';
  msg += addToMsg('image.url()', image.url());
  msg += addToMsg('image.thumbnail()', image.thumbnail());
  msg += showCount('image.links', image.links());
  msg += addToMsg('image.format()', image.format());

  msg += showPartialText('image.text', image.text());
  msg += showPartialText('image.json', JSON.stringify(image.json()));
  msg += showPartialText('image.wikitext', image.wikitext());

  return msg;
}


function showTemplateApi(template) {
  let msg = '<br><h2>let template = doc.templates()[0]</h2>';

  msg += showPartialText('template.text', template.text());
  msg += showPartialText('template.json', JSON.stringify(template.json()));
  msg += showPartialText('template.wikitext', template.wikitext());

  return msg;
}


function showInfoboxApi(infobox) {
  let msg = '<br><h2>let infobox = doc.infoboxes()[0]</h2>';
  msg += showCount('infobox.links', infobox.links());

  msg += addToMsg('infobox.keyValue()', showKeyValObj(infobox.keyValue()));

  msg += addToMsg('infobox.image()', infobox.image());
  msg += addToMsg('infobox.get("name")', infobox.get('name'));
  msg += addToMsg('infobox.template()', infobox.template());

  msg += showPartialText('infobox.text', infobox.text());
  msg += showPartialText('infobox.json', JSON.stringify(infobox.json()));
  msg += showPartialText('infobox.wikitext', infobox.wikitext());

  return msg;
}


function showListApi(list) {
  let msg = '<br><h2>let list = doc.lists()[0]</h2>';

  msg += showCount('list.lines', list.lines());
  msg += showCount('list.links', list.links());

  msg += showPartialText('list.text', list.text());
  msg += showPartialText('list.json', JSON.stringify(list.json()));
  msg += showPartialText('list.wikitext', list.wikitext());

  return msg;
}


function showReferenceApi(reference) {
  let msg = '<br><h2>let reference = doc.references()[0]</h2>';
  msg += addToMsg('reference.title()', reference.title());
  msg += showCount('reference.links', reference.links());

  msg += showPartialText('reference.text', reference.text());
  msg += showPartialText('reference.json', JSON.stringify(reference.json()));
  msg += showPartialText('reference.wikitext', reference.wikitext());

  return msg;
}


function showTableApi(table) {
  let msg = '<br><h2>let table = doc.tables()[0]</h2>';

  msg += showCount('table.links', table.links());
  msg += addToMsg('table.keyValue()', showKeyValObj(table.keyValue()));

  msg += showPartialText('table.text', table.text());
  msg += showPartialText('table.json', JSON.stringify(table.json()));
  msg += showPartialText('table.wikitext', table.wikitext());

  return msg;
}


function showCount(listName, list, optStr='') {
  list = list || [];  // force list to exist
  let subName = listName.substring(listName.indexOf('.') + 1);
  let str = 'there are ' + NF(list.length) + ' ' + subName + optStr;
  return addToMsg(listName + '()', str);
}


function showPartialText(listName, text) {
  text = text || '';  // force text to exist
  let truncatedStr = text.substring(0, TEXT_SHOW_LENGTH);
  if (text.length > truncatedStr.length) {
    truncatedStr += '...';
  }

  if (truncatedStr.length > 0) {
    truncatedStr = ': ' + truncatedStr;
  }

  let str = 'text is ' + NF(text.length) + ' chars' + truncatedStr;

  return addToMsg(listName + '()', str);
}


function showKeyValObj(keyValObj) {
  let entryList = Object.entries(keyValObj);
  let entryCount = entryList.length;
  let msg = 'there are ' + entryCount + ' key-value pairs: ';

  for (let i = 0; i < entryCount; ++i) {
    msg += '[' + entryList[i].join(':') + '] ';
  }

  if (msg.length > 90) {
    msg = msg.substring(0, 90) + '...';
  }

  return msg;
}


function addToMsg(key='<br>', value='') {
  return '<div class=line>' +
      '<div class=key>' + key + '</div> ' +
      '<div class=value>' + value + '</div>' +
    '</div>';
}
