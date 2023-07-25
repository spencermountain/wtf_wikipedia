// @fileoverview apiDemoHtml.js (non ES6) -- creates HTML for apiDemo
'use strict';

let ApiDemoHtml = function(wtfHelper) {
  this.root = null;
  this.mainContainer = null;
  this.wtfHelper = wtfHelper;
};

ApiDemoHtml.SHORT_TEXT_LEN = 80;  // len of a one-liner partial result
ApiDemoHtml.LONG_TEXT_LEN = 300;  // len of a multi-liner partial result


let HtmlProto = ApiDemoHtml.prototype;  // alias for ease of function naming

HtmlProto.init = function(title) { // create header and scrollable main section
  this.root = this.wtfHelper.createDiv(null, 'apiDemoRoot');
  this.wtfHelper.createDiv(this.root, 'apiDemoHeader', title);
  this.mainContainer =
    this.wtfHelper.createDiv(this.root, 'apiDemoMainContainer');

  return this.mainContainer;
};


HtmlProto.getMainContainer = function() {
  return this.mainContainer;
};


// render the created HTML by attaching the root to the document.body
HtmlProto.render = function() {
  document.body.appendChild(this.root);
};


HtmlProto.createFirstApiSectionHeader = function(title) {
  return this.wtfHelper.createDiv(this.mainContainer,
                                  'apiDemoSectionHeaderFirst',
                                  title);
};


HtmlProto.createApiSectionHeader = function(title) {
  return this.wtfHelper.createDiv(this.mainContainer,
                                  'apiDemoSectionHeader',
                                  title);
};


// show the entry as a row with functionName  result
// the result may be a string or a count of the elements
HtmlProto.createEntry = function(functionName, result, showPartial=false) {
  let entryEle = this.wtfHelper.createDiv(this.mainContainer,  'apiDemoEntry');
  this.wtfHelper.createDiv(entryEle, 'apiDemoEntryTitle', functionName);

  // if the result is an array, show the item count, else show the results
  let resultText = '';

  if (Array.isArray(result)) {
    resultText = this.getResultCountString(functionName, result);
    if (showPartial) {
      resultText += this.getPartialList(result, ApiDemoHtml.SHORT_TEXT_LEN);
    }
  } else {
    resultText = result + ''; // converts to string
  }

  if (resultText.length > ApiDemoHtml.LONG_TEXT_LEN) {
    resultText = resultText.substring(0, ApiDemoHtml.LONG_TEXT_LEN) + '...';
    entryEle.classList.replace('apiDemoEntry', 'apiDemoEntryWithSpacing');
  }

  this.wtfHelper.createDiv(entryEle, 'apiDemoEntryResult', resultText);

  return entryEle;
};


// create a string that shows the resultList count and the element name
HtmlProto.getResultCountString = function(functionName, resultList) {
  let startPos = functionName.indexOf('.');
  startPos = startPos < 0 ? 0 : startPos + 1;

  let endPos = functionName.indexOf('(');
  endPos = endPos < 0 ? functionName.length : endPos;

  let itemName = functionName.substring(startPos, endPos);

  return 'there are ' + resultList.length + ' ' + itemName;
};


// get the substring of the joined resultList up to showListLength
HtmlProto.getPartialList = function(resultList, showListLength) {
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
};


HtmlProto.createImageList = function(imageList) {
  if (!Array.isArray(imageList) || imageList.length < 1) {
    return null;
  }

  let ele =
      this.wtfHelper.createDiv(this.mainContainer, 'apiDemoImageListContainer');

  for (let i = 0, iCount = imageList.length; i < iCount; ++i) {
    this.wtfHelper.createImg(ele, 'apiDemoImage', imageList[i].url());
  }

  return ele;
};


HtmlProto.createLinksHtml = function(functionName, linkList) {
  let linkStr = this.getResultCountString(functionName, linkList);

  let tempList = [];
  for (let i = 0, iCount = linkList.length; i < iCount; ++i) {
    let page = linkList[i].page();
    if (page && page !== 'undefined') {
      tempList.push(page);
    }
  }

  return this.createEntry(functionName, tempList, true);

};
