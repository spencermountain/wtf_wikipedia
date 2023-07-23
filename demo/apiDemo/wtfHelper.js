/**
 * @fileoverview wtfWikiHelper.js
 * Several helper functions to simplify writing wtf_wikipedia apps.
 */
'use strict';

wtf.Helper = {};  // create a namespace


// calls mainFn() after the page has loaded and breaks the back button cache.
wtf.Helper.init = function(mainFn) {
  window.addEventListener('load', mainFn);
  window.addEventListener('unload', function(){}); // break back button cache
};


// fetches one or more urls, blocking them into groups to play nicely
// returns a list of results
wtf.Helper.fetchNicely = async function(urlOrUrlList=null,
                                        options={
                                          'Api-User-Agent':'example@mail.com'
                                        },
                                        groupSize=5) {
  if (!urlOrUrlList || groupSize < 1) {  // catches '' and urlOrUrlList===null
    return null;
  }

  // make sure there is an Api-User-Agent
  options = options || {};
  options['Api-User-Agent'] = options['Api-User-Agent'] || 'example@mail.com';

  if (!Array.isArray(urlOrUrlList)) { // if not an array, just fetch it
    return wtf.fetch(urlOrUrlList, options);
  }

  let chunkList = wtf.Helper.chunk(urlOrUrlList);

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


// chunks array into smaller arrays (['a','b','c','d'] => [['a','b'],['c','d']]
wtf.Helper.chunk = function(list=null, chunkSize=5) {
  if (!list || !Array.isArray(list) || chunkSize < 1) {
    return [];
  }

  let result = [];
  for (let i = 0, count = list.length; i < count; i += chunkSize) {
    result.push(list.slice(i, i + chunkSize));
  }

  return result;
}
