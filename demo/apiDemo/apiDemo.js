// @fileoverview apiDemo.js (non ES6) -- shows the wtf_wikipedia API functions
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
'use strict';

let wtfHelper = new WtfHelper();       // load useful wtf helper functions
let html = new ApiDemoHtml(wtfHelper); // creates apiDemo HTML elements
wtfHelper.loadMain(main);              // call main() after the HTML doc loads

async function main() {
  let queryString = 'Grace Hopper';
  let doc = await wtfHelper.fetchNicely(queryString);

  html.init('wtf_wikipedia API demo'); // creates header and main section

  // generate results for the wtf_wikipedia apis
  showTopLevelApi(doc, queryString);
  showSectionApi(doc.sections()[0]);
  showParagraphApi(doc.paragraphs()[0]);
  showSentenceApi(doc.sentences()[0]);
  showImageApi(doc.images()[0]);
  showTemplateApi(doc.templates()[0]);
  showInfoboxApi(doc.infoboxes()[0]);
  showListApi(doc.lists()[0]) ;
  showReferenceApi(doc.references()[0]) ;
  showTableApi(doc.tables()[0]) ;

  html.render();
}


function showTopLevelApi(doc, queryString) {
  html.createFirstApiSectionHeader('let doc = wtf.fetch("'+queryString+'")');
  html.createEntry('doc.title()', doc.title());
  html.createEntry('doc.pageID()', doc.pageID());
  html.createEntry('doc.wikidata()', doc.wikidata());
  html.createEntry('doc.domain()', doc.domain());
  html.createEntry('doc.url()', doc.url());
  html.createEntry('doc.lang()', doc.lang());
  html.createEntry('doc.namespace()', doc.namespace());
  html.createEntry('doc.isRedirect()', doc.isRedirect());
  html.createEntry('doc.redirectTo()', doc.redirectTo());
  html.createEntry('doc.isDisambiguation()', doc.isDisambiguation());
  html.createEntry('doc.coordinates()', doc.coordinates());
  html.createEntry('doc.categories()', doc.categories(), true);
  html.createEntry('doc.sections()', doc.sections());
  html.createEntry('doc.paragraphs()', doc.paragraphs());
  html.createEntry('doc.sentences()', doc.sentences());
  html.createEntry('doc.images()', doc.images());
  html.createImageList(doc.images());
  html.createLinksHtml('doc.links()', doc.links());
  html.createEntry('doc.lists()', doc.lists());
  html.createEntry('doc.tables()', doc.tables());
  html.createEntry('doc.templates()', doc.templates());
  html.createEntry('doc.infoboxes()', doc.infoboxes());
  html.createEntry('doc.references()', doc.references());
  html.createEntry('doc.text()', doc.text(), true);
  html.createEntry('doc.json()', JSON.stringify(doc.json()), true);
  html.createEntry('doc.wikitext()', doc.wikitext(), true);
}


function showSectionApi(section) {
  html.createApiSectionHeader('let section = doc.sections()[0]');

  html.createEntry('section.title()', section.title());
  html.createEntry('section.index()', section.index());
  html.createEntry('section.indentation()', section.indentation());
  html.createEntry('section.coordinates()', section.coordinates());

  html.createEntry('section.paragraphs()', section.paragraphs());
  html.createEntry('section.sentences()', section.sentences());
  html.createEntry('section.images()', section.images());
  html.createLinksHtml('section.links()', section.links());
  html.createEntry('section.interwiki()', section.interwiki());

  html.createEntry('section.lists()', section.lists());
  html.createEntry('section.tables()', section.tables());
  html.createEntry('section.templates()', section.templates());
  html.createEntry('section.infoboxes()', section.infoboxes());
  html.createEntry('section.references()', section.references());

  html.createEntry('section.remove()', ''); //section.remove());
  html.createEntry('section.nextSibling()', section.nextSibling());
  html.createEntry('section.lastSibling()', section.lastSibling());
  html.createEntry('section.children()', section.children());
  html.createEntry('section.parent()', section.parent());

  html.createEntry('section.text()', section.text());
  html.createEntry('section.json()', JSON.stringify(section.json()));
  html.createEntry('section.wikitext()', section.wikitext());
}


function showParagraphApi(paragraph) {
  html.createApiSectionHeader('let paragraph = doc.paragraphs()[0]');

  html.createEntry('paragraph.sentences()', paragraph.sentences());
  html.createEntry('paragraph.references()', paragraph.references());
  html.createEntry('paragraph.images()', paragraph.images());
  html.createLinksHtml('paragraph.links()', paragraph.links());
  html.createEntry('paragraph.interwiki()', paragraph.interwiki());
  html.createEntry('paragraph.lists()', paragraph.lists());

  html.createEntry('paragraph.text()', paragraph.text());
  html.createEntry('paragraph.json()', JSON.stringify(paragraph.json()));
  html.createEntry('paragraph.wikitext()', paragraph.wikitext());
}


function showSentenceApi(sentence) {
  html.createApiSectionHeader('let sentence = doc.sentences()[0]');
  html.createLinksHtml('sentence.links()', sentence.links());
  html.createEntry('sentence.bolds()', sentence.bolds());
  html.createEntry('sentence.italics()', sentence.italics());

  html.createEntry('sentence.text()', sentence.text());
  html.createEntry('sentence.json()', JSON.stringify(sentence.json()));
  html.createEntry('sentence.wikitext()', sentence.wikitext());
}


function showImageApi(image) {
  html.createApiSectionHeader('let image = doc.images()[0]');
  html.createEntry('image.url()', image.url());
  html.createEntry('image.thumbnail()', image.thumbnail());
  html.createLinksHtml('image.links()', image.links());
  html.createEntry('image.format()', image.format());

  html.createEntry('image.text()', image.text());
  html.createEntry('image.json()', JSON.stringify(image.json()));
  html.createEntry('image.wikitext()', image.wikitext());
}


function showTemplateApi(template) {
  html.createApiSectionHeader('let template = doc.templates()[0]');

  html.createEntry('template.text()', template.text());
  html.createEntry('template.json()', JSON.stringify(template.json()));
  html.createEntry('template.wikitext()', template.wikitext());
}


function showInfoboxApi(infobox) {
  html.createApiSectionHeader('let infobox = doc.infoboxes()[0]');
  html.createLinksHtml('infobox.links()', infobox.links());

  html.createEntry('infobox.keyValue()', showKeyValObj(infobox.keyValue()));

  html.createEntry('infobox.image()', infobox.image());
  html.createEntry('infobox.get("name")', infobox.get('name'));
  html.createEntry('infobox.template()', infobox.template());

  html.createEntry('infobox.text()', infobox.text());
  html.createEntry('infobox.json()', JSON.stringify(infobox.json()));
  html.createEntry('infobox.wikitext()', infobox.wikitext());
}


function showListApi(list) {
  html.createApiSectionHeader('let list = doc.lists()[0]');

  html.createEntry('list.lines()', list.lines());
  html.createLinksHtml('list.links()', list.links());

  html.createEntry('list.text()', list.text());
  html.createEntry('list.json()', JSON.stringify(list.json()));
  html.createEntry('list.wikitext()', list.wikitext());
}


function showReferenceApi(reference) {
  html.createApiSectionHeader('let reference = doc.references()[0]');
  html.createEntry('reference.title()', reference.title());
  html.createLinksHtml('reference.links()', reference.links());

  html.createEntry('reference.text()', reference.text());
  html.createEntry('reference.json()', JSON.stringify(reference.json()));
  html.createEntry('reference.wikitext()', reference.wikitext());
}


function showTableApi(table) {
  html.createApiSectionHeader('let table = doc.tables()[0]');

  html.createLinksHtml('table.links()', table.links());
  html.createEntry('table.keyValue()', showKeyValObj(table.keyValue()));

  html.createEntry('table.text()', table.text());
  html.createEntry('table.json()', JSON.stringify(table.json()));
  html.createEntry('table.wikitext()', table.wikitext());
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
