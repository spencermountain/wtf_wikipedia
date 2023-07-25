// @fileoverview wtfHelper.js provides a set of helpful functions for
// writing wtf_wikipedia apps. wtfHelper requires the wtf variable.
'use strict';

let WtfHelper = function() {};


// calls mainFn() after the HTML document loads; breaks the back button cache.
WtfHelper.prototype.loadMain = function(mainFn) {
  window.addEventListener('load', mainFn);
  window.addEventListener('unload', function(){}); // break back button cache
};


// fetches one or more urls, chunking into groups to play nicely with servers
// note: you should pass an options object with the Api-User-Agent so the
// server can throttle misbehaving requests.
// @returns a single result or a (possibly empty) list of results
WtfHelper.prototype.fetchNicely = async function(urlOrUrlList = null,
                                                  options = {},
                                                  groupSize = 5) {
  if (!urlOrUrlList || groupSize < 1) {  // '', null, missing urlOrUrlList
    return null;
  }

  // make sure there is an Api-User-Agent
  options = options || {};
  options['Api-User-Agent'] = options['Api-User-Agent'] || 'example@mail.com';

  // if not an array, just fetch the wiki results
  if (!Array.isArray(urlOrUrlList)) {
    return wtf.fetch(urlOrUrlList, options);
  }

  let chunkList = this.chunk(urlOrUrlList);

  if (chunkList.length < 1) {
    return null;
  }

  let resultList = [];
  for (let i = 0, iCount = chunkList.length; i < iCount; ++i) {
    let subList = chunkList[i];
    resultList.push(await wtf.fetch(subList, options));
  }

  return resultList;
};


// chunk array into smaller arrays ['a','b','c','d'] => [['a','b'],['c','d']]
WtfHelper.prototype.chunk = function(list=null, chunkSize=5) {
  let result = [];

  if (Array.isArray(list) && chunkSize > 0) {
    for (let i = 0, iCount = list.length; i < iCount; i += chunkSize) {
      result.push(list.slice(i, i + chunkSize));
    }
  }

  return result;
}


// format a number to have commas and follow locale styles
WtfHelper.prototype.formatNumber = function(num, minFractDigits = 0) {
  return num.toLocaleString(undefined,{minimumFractionDigits:minFractDigits});
}


// create HTML element of tagName type (e.g. 'div' or 'img')
WtfHelper.prototype.createElement = function(parent, className, tagName) {
  let element = document.createElement(tagName);
  className ? element.className = className : null;
  parent ? parent.appendChild(element) : null;
  return element;
}


WtfHelper.prototype.createBr = function(parent) {
  let element = this.createElement(parent, null, 'br');
  return element;
}


WtfHelper.prototype.createDiv = function(parent, className, text) {
  let element = this.createElement(parent, className, 'div');
  text ? element.insertAdjacentText('beforeend', text): null;
  return element;
}


WtfHelper.prototype.createH2 = function(parent, className, text) {
  let element = this.createElement(parent, className, 'H2');
  text ? element.insertAdjacentText('beforeend', text): null;
  return element;
}


WtfHelper.prototype.createImg = function(parent, className, url) {
  let element = this.createElement(parent, className, 'img');
  url ? element.src = url : null;
  return element;
}
