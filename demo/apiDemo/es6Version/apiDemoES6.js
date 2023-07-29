// @fileoverview apiDemoES6.js -- shows the wtf_wikipedia API functions
// The wtf_wikipedia apis are:
//     toplevel api
//     section api
//     paragraph api
//     sentence api
//     image api
//     template api
//     infobox api
//     list api
//     reference api
//     table api
// ----------------------------------------------------------------------
import {fetchNicely, loadMain} from './wtfHelper/wtfHelper.js';
import {createDiv, createImg}  from './html.js';

const SHORT_TEXT_LEN = 80;  // length of a one-liner partial result
const LONG_TEXT_LEN = 300;  // length of a multi-line partial result

loadMain(main);              // call main() after the HTML doc loads

async function main() {
  let root, mainContainer;

  let queryString = 'Grace Hopper';
  let doc = await fetchNicely(queryString);

  root = createDiv(null, 'apiDemoRoot');
  createDiv(root, 'apiDemoHeader', 'wtf_wikipedia API demo'); // create header
  mainContainer = createDiv(root, 'apiDemoMainContainer');

  // generate results for the wtf_wikipedia apis
  showTopLevelApi(mainContainer, doc, queryString);
  showSectionApi(mainContainer, doc.sections()[0]);
  showParagraphApi(mainContainer, doc.paragraphs()[0]);
  showSentenceApi(mainContainer, doc.sentences()[0]);
  showImageApi(mainContainer, doc.images()[0]);
  showTemplateApi(mainContainer, doc.templates()[0]);
  showInfoboxApi(mainContainer, doc.infoboxes()[0]);
  showListApi(mainContainer, doc.lists()[0]) ;
  showReferenceApi(mainContainer, doc.references()[0]) ;
  showTableApi(mainContainer, doc.tables()[0]) ;

  document.body.appendChild(root);
}


function showTopLevelApi(parent, doc, queryString) {
  createFirstApiSectionHeader(parent, 'let doc = wtf.fetch("'+queryString+'")');
  createEntry(parent, 'doc.title()', doc.title());
  createEntry(parent, 'doc.pageID()', doc.pageID());
  createEntry(parent, 'doc.wikidata()', doc.wikidata());
  createEntry(parent, 'doc.domain()', doc.domain());
  createEntry(parent, 'doc.url()', doc.url());
  createEntry(parent, 'doc.lang()', doc.lang());
  createEntry(parent, 'doc.namespace()', doc.namespace());
  createEntry(parent, 'doc.isRedirect()', doc.isRedirect());
  createEntry(parent, 'doc.redirectTo()', doc.redirectTo());
  createEntry(parent, 'doc.isDisambiguation()', doc.isDisambiguation());
  createEntry(parent, 'doc.coordinates()', doc.coordinates());
  createEntry(parent, 'doc.categories()', doc.categories(), true);
  createEntry(parent, 'doc.sections()', doc.sections());
  createEntry(parent, 'doc.paragraphs()', doc.paragraphs());
  createEntry(parent, 'doc.sentences()', doc.sentences());
  createEntry(parent, 'doc.images()', doc.images());
  createImageList(parent, doc.images());
  createLinksHtml(parent, 'doc.links()', doc.links());
  createEntry(parent, 'doc.lists()', doc.lists());
  createEntry(parent, 'doc.tables()', doc.tables());
  createEntry(parent, 'doc.templates()', doc.templates());
  createEntry(parent, 'doc.infoboxes()', doc.infoboxes());
  createEntry(parent, 'doc.references()', doc.references());
  createEntry(parent, 'doc.text()', doc.text(), true);
  createEntry(parent, 'doc.json()', JSON.stringify(doc.json()), true);
  createEntry(parent, 'doc.wikitext()', doc.wikitext(), true);
}


function showSectionApi(parent, section) {
  createApiSectionHeader(parent, 'let section = doc.sections()[0]');

  createEntry(parent, 'section.title()', section.title());
  createEntry(parent, 'section.index()', section.index());
  createEntry(parent, 'section.indentation()', section.indentation());
  createEntry(parent, 'section.coordinates()', section.coordinates());

  createEntry(parent, 'section.paragraphs()', section.paragraphs());
  createEntry(parent, 'section.sentences()', section.sentences());
  createEntry(parent, 'section.images()', section.images());
  createLinksHtml(parent, 'section.links()', section.links());
  createEntry(parent, 'section.interwiki()', section.interwiki());

  createEntry(parent, 'section.lists()', section.lists());
  createEntry(parent, 'section.tables()', section.tables());
  createEntry(parent, 'section.templates()', section.templates());
  createEntry(parent, 'section.infoboxes()', section.infoboxes());
  createEntry(parent, 'section.references()', section.references());

  createEntry(parent, 'section.remove()', ''); //section.remove());
  createEntry(parent, 'section.nextSibling()', section.nextSibling());
  createEntry(parent, 'section.lastSibling()', section.lastSibling());
  createEntry(parent, 'section.children()', section.children());
  createEntry(parent, 'section.parent()', section.parent());

  createEntry(parent, 'section.text()', section.text());
  createEntry(parent, 'section.json()', JSON.stringify(section.json()));
  createEntry(parent, 'section.wikitext()', section.wikitext());
}


function showParagraphApi(parent, paragraph) {
  createApiSectionHeader(parent, 'let paragraph = doc.paragraphs()[0]');

  createEntry(parent, 'paragraph.sentences()', paragraph.sentences());
  createEntry(parent, 'paragraph.references()', paragraph.references());
  createEntry(parent, 'paragraph.images()', paragraph.images());
  createLinksHtml(parent, 'paragraph.links()', paragraph.links());
  createEntry(parent, 'paragraph.interwiki()', paragraph.interwiki());
  createEntry(parent, 'paragraph.lists()', paragraph.lists());

  createEntry(parent, 'paragraph.text()', paragraph.text());
  createEntry(parent, 'paragraph.json()', JSON.stringify(paragraph.json()));
  createEntry(parent, 'paragraph.wikitext()', paragraph.wikitext());
}


function showSentenceApi(parent, sentence) {
  createApiSectionHeader(parent, 'let sentence = doc.sentences()[0]');
  createLinksHtml(parent, 'sentence.links()', sentence.links());
  createEntry(parent, 'sentence.bolds()', sentence.bolds());
  createEntry(parent, 'sentence.italics()', sentence.italics());

  createEntry(parent, 'sentence.text()', sentence.text());
  createEntry(parent, 'sentence.json()', JSON.stringify(sentence.json()));
  createEntry(parent, 'sentence.wikitext()', sentence.wikitext());
}


function showImageApi(parent, image) {
  createApiSectionHeader(parent, 'let image = doc.images()[0]');
  createEntry(parent, 'image.url()', image.url());
  createEntry(parent, 'image.thumbnail()', image.thumbnail());
  createLinksHtml(parent, 'image.links()', image.links());
  createEntry(parent, 'image.format()', image.format());

  createEntry(parent, 'image.text()', image.text());
  createEntry(parent, 'image.json()', JSON.stringify(image.json()));
  createEntry(parent, 'image.wikitext()', image.wikitext());
}


function showTemplateApi(parent, template) {
  createApiSectionHeader(parent, 'let template = doc.templates()[0]');

  createEntry(parent, 'template.text()', template.text());
  createEntry(parent, 'template.json()', JSON.stringify(template.json()));
  createEntry(parent, 'template.wikitext()', template.wikitext());
}


function showInfoboxApi(parent, infobox) {
  createApiSectionHeader(parent, 'let infobox = doc.infoboxes()[0]');
  createLinksHtml(parent, 'infobox.links()', infobox.links());

  createEntry(parent, 'infobox.keyValue()', showKeyValObj(infobox.keyValue()));

  createEntry(parent, 'infobox.image()', infobox.image());
  createEntry(parent, 'infobox.get("name")', infobox.get('name'));
  createEntry(parent, 'infobox.template()', infobox.template());

  createEntry(parent, 'infobox.text()', infobox.text());
  createEntry(parent, 'infobox.json()', JSON.stringify(infobox.json()));
  createEntry(parent, 'infobox.wikitext()', infobox.wikitext());
}


function showListApi(parent, list) {
  createApiSectionHeader(parent, 'let list = doc.lists()[0]');

  createEntry(parent, 'list.lines()', list.lines());
  createLinksHtml(parent, 'list.links()', list.links());

  createEntry(parent, 'list.text()', list.text());
  createEntry(parent, 'list.json()', JSON.stringify(list.json()));
  createEntry(parent, 'list.wikitext()', list.wikitext());
}


function showReferenceApi(parent, reference) {
  createApiSectionHeader(parent, 'let reference = doc.references()[0]');
  createEntry(parent, 'reference.title()', reference.title());
  createLinksHtml(parent, 'reference.links()', reference.links());

  createEntry(parent, 'reference.text()', reference.text());
  createEntry(parent, 'reference.json()', JSON.stringify(reference.json()));
  createEntry(parent, 'reference.wikitext()', reference.wikitext());
}


function showTableApi(parent, table) {
  createApiSectionHeader(parent, 'let table = doc.tables()[0]');

  createLinksHtml(parent, 'table.links()', table.links());
  createEntry(parent, 'table.keyValue()', showKeyValObj(table.keyValue()));

  createEntry(parent, 'table.text()', table.text());
  createEntry(parent, 'table.json()', JSON.stringify(table.json()));
  createEntry(parent, 'table.wikitext()', table.wikitext());
}


function showKeyValObj(keyValObj) {
  let entryList = Object.entries(keyValObj);
  let entryCount = entryList.length;
  let result = 'there are ' + entryCount + ' key-value pairs: ';

  for (let i = 0; i < entryCount; ++i) {
    result += '[' + entryList[i].join(':') + '] ';
  }

  if (result.length > 90) {
    result = result.substring(0, 90) + '...';
  }

  return result;
}


function createFirstApiSectionHeader(parent, title) {
  return createDiv(parent, 'apiDemoSectionHeaderFirst', title);
}


function createApiSectionHeader(parent, title) {
  return createDiv(parent, 'apiDemoSectionHeader', title);
}


// show the entry as a row with functionName  result
// the result may be a string or a count of the elements
function createEntry(parent, functionName, result, showPartial=false) {
  let entryEle = createDiv(parent,  'apiDemoEntry');
  createDiv(entryEle, 'apiDemoEntryTitle', functionName);

  // if the result is an array, show the item count, else show the results
  let resultText = '';

  if (Array.isArray(result)) {
    resultText = getResultCountString(functionName, result);
    if (showPartial) {
      resultText += getPartialList(result, SHORT_TEXT_LEN);
    }
  } else {
    resultText = result + ''; // converts to string
  }

  if (resultText.length > LONG_TEXT_LEN) {
    resultText = resultText.substring(0, LONG_TEXT_LEN) + '...';
    entryEle.classList.replace('apiDemoEntry', 'apiDemoEntryWithSpacing');
  }

  createDiv(entryEle, 'apiDemoEntryResult', resultText);

  return entryEle;
}


// create a string that shows the resultList count and the element name
function getResultCountString (functionName, resultList) {
  let startPos = functionName.indexOf('.');
  startPos = startPos < 0 ? 0 : startPos + 1;

  let endPos = functionName.indexOf('(');
  endPos = endPos < 0 ? functionName.length : endPos;

  let itemName = functionName.substring(startPos, endPos);

  return 'there are ' + resultList.length + ' ' + itemName;
}


// get the substring of the joined resultList up to showListLength
function getPartialList (resultList, showListLength) {
  if (showListLength < 1) {
    return '';
  }

  let partialList = ' [' + resultList.join(', ');
  if (partialList.length > showListLength) {
    partialList = partialList.substring(0, showListLength) + '...]';
  } else {
    partialList += ']';
  }

  return partialList;
}


function createImageList (parent, imageList) {
  let ele = null;

  if (Array.isArray(imageList) && imageList.length > 0) {
    let ele = createDiv(parent, 'apiDemoImageListContainer');

    for (let i = 0, iCount = imageList.length; i < iCount; ++i) {
      createImg(ele, 'apiDemoImage', imageList[i].url());
    }
  }

  return ele;
}


function createLinksHtml (parent, functionName, linkList) {
  let linkStr = getResultCountString(functionName, linkList);

  let tempList = [];
  for (let i = 0, iCount = linkList.length; i < iCount; ++i) {
    let page = linkList[i].page();
    if (page && page !== 'undefined') {
      tempList.push(page);
    }
  }

  return createEntry(parent, functionName, tempList, true);
}
