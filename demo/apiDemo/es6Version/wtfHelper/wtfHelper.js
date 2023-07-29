// @fileoverview wtfHelper.js provides a set of helpful functions for
// writing wtf_wikipedia apps.
import wtf from '../../../../builds/wtf_wikipedia-client.mjs';

export {
  chunk,
  fetchNicely,
  formatNumber,
  loadMain
};


// chunk array into smaller arrays ['a','b','c','d'] => [['a','b'],['c','d']]
/*export*/ function chunk(list=null, chunkSize=5) {
  let result = [];

  if (Array.isArray(list) && chunkSize > 0) {
    for (let i = 0, iCount = list.length; i < iCount; i += chunkSize) {
      result.push(list.slice(i, i + chunkSize));
    }
  }

  return result;
}


// fetches one or more urls, chunking into groups to play nicely with servers
// note: you should pass an options object with the Api-User-Agent so the
// server can throttle misbehaving requests.
// @returns a single result or a (possibly empty) list of results
/*export*/ async function fetchNicely(urlOrUrlList = null,
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
}


// format a number to have commas and follow locale styles
/*export*/ function formatNumber(num, minFractDigits = 0) {
  return num.toLocaleString(undefined,{minimumFractionDigits:minFractDigits});
}


// calls mainFn() after the HTML document loads; breaks the back button cache.
/*export*/ function loadMain(mainFn) {
  window.addEventListener('load', mainFn);
  window.addEventListener('unload', function(){}); // break back button cache
}
