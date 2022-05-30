/* wtf-plugin-image 1.1.0  MIT */
import unfetch from 'isomorphic-unfetch';

/* eslint-disable no-bitwise */
/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */


/**
   * Add integers, wrapping at 2^32.
   * This uses 16-bit operations internally to work around bugs in interpreters.
   *
   * @param {number} x First integer
   * @param {number} y Second integer
   * @returns {number} Sum
   */
function safeAdd(x, y) {
  let lsw = (x & 0xffff) + (y & 0xffff);
  let msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xffff)
}

/**
   * Bitwise rotate a 32-bit number to the left.
   *
   * @param {number} num 32-bit number
   * @param {number} cnt Rotation count
   * @returns {number} Rotated number
   */
function bitRotateLeft(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt))
}

/**
   * Basic operation the algorithm uses.
   *
   * @param {number} q q
   * @param {number} a a
   * @param {number} b b
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
}
/**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
function md5ff(a, b, c, d, x, s, t) {
  return md5cmn((b & c) | (~b & d), a, b, x, s, t)
}
/**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
function md5gg(a, b, c, d, x, s, t) {
  return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
}
/**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t)
}
/**
   * Basic operation the algorithm uses.
   *
   * @param {number} a a
   * @param {number} b b
   * @param {number} c c
   * @param {number} d d
   * @param {number} x x
   * @param {number} s s
   * @param {number} t t
   * @returns {number} Result
   */
function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t)
}

/**
   * Calculate the MD5 of an array of little-endian words, and a bit length.
   *
   * @param {Array} x Array of little-endian words
   * @param {number} len Bit length
   * @returns {Array<number>} MD5 Array
   */
function binlMD5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << len % 32;
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  let i;
  let olda;
  let oldb;
  let oldc;
  let oldd;
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (i = 0; i < x.length; i += 16) {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;

    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }
  return [a, b, c, d]
}

/**
   * Convert an array of little-endian words to a string
   *
   * @param {Array<number>} input MD5 Array
   * @returns {string} MD5 string
   */
function binl2rstr(input) {
  let i;
  let output = '';
  let length32 = input.length * 32;
  for (i = 0; i < length32; i += 8) {
    output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff);
  }
  return output
}

/**
   * Convert a raw string to an array of little-endian words
   * Characters >255 have their high-byte silently ignored.
   *
   * @param {string} input Raw input string
   * @returns {Array<number>} Array of little-endian words
   */
function rstr2binl(input) {
  let i;
  let output = [];
  output[(input.length >> 2) - 1] = undefined;
  for (i = 0; i < output.length; i += 1) {
    output[i] = 0;
  }
  let length8 = input.length * 8;
  for (i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
  }
  return output
}

/**
   * Calculate the MD5 of a raw string
   *
   * @param {string} s Input string
   * @returns {string} Raw MD5 string
   */
function rstrMD5(s) {
  return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
}

/**
   * Calculates the HMAC-MD5 of a key and some data (raw strings)
   *
   * @param {string} key HMAC key
   * @param {string} data Raw input string
   * @returns {string} Raw MD5 string
   */
function rstrHMACMD5(key, data) {
  let i;
  let bkey = rstr2binl(key);
  let ipad = [];
  let opad = [];
  let hash;
  ipad[15] = opad[15] = undefined;
  if (bkey.length > 16) {
    bkey = binlMD5(bkey, key.length * 8);
  }
  for (i = 0; i < 16; i += 1) {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5c5c5c5c;
  }
  hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
  return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
}

/**
   * Convert a raw string to a hex string
   *
   * @param {string} input Raw input string
   * @returns {string} Hex encoded string
   */
function rstr2hex(input) {
  let hexTab = '0123456789abcdef';
  let output = '';
  let x;
  let i;
  for (i = 0; i < input.length; i += 1) {
    x = input.charCodeAt(i);
    output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
  }
  return output
}

/**
   * Encode a string as UTF-8
   *
   * @param {string} input Input string
   * @returns {string} UTF8 string
   */
function str2rstrUTF8(input) {
  return unescape(encodeURIComponent(input))
}

/**
   * Encodes input string as raw MD5 string
   *
   * @param {string} s Input string
   * @returns {string} Raw MD5 string
   */
function rawMD5(s) {
  return rstrMD5(str2rstrUTF8(s))
}
/**
   * Encodes input string as Hex encoded string
   *
   * @param {string} s Input string
   * @returns {string} Hex encoded string
   */
function hexMD5(s) {
  return rstr2hex(rawMD5(s))
}
/**
   * Calculates the raw HMAC-MD5 for the given key and data
   *
   * @param {string} k HMAC key
   * @param {string} d Input string
   * @returns {string} Raw MD5 string
   */
function rawHMACMD5(k, d) {
  return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
}
/**
   * Calculates the Hex encoded HMAC-MD5 for the given key and data
   *
   * @param {string} k HMAC key
   * @param {string} d Input string
   * @returns {string} Raw MD5 string
   */
function hexHMACMD5(k, d) {
  return rstr2hex(rawHMACMD5(k, d))
}

/**
   * Calculates MD5 value for a given string.
   * If a key is provided, calculates the HMAC-MD5 value.
   * Returns a Hex encoded string unless the raw argument is given.
   *
   * @param {string} string Input string
   * @param {string} [key] HMAC key
   * @param {boolean} [raw] Raw output switch
   * @returns {string} MD5 output
   */
function md5(string, key, raw) {
  if (!key) {
    if (!raw) {
      return hexMD5(string)
    }
    return rawMD5(string)
  }
  if (!raw) {
    return hexHMACMD5(key, string)
  }
  return rawHMACMD5(key, string)
}

// import jsHash from 'jshashes'


const server = 'https://upload.wikimedia.org/wikipedia/commons/';

const encodeTitle = function (file) {
  let title = file.replace(/^(image|file?):/i, '');
  title = title.trim();
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1);
  //spaces to underscores
  title = title.replace(/ /g, '_');
  return title
};

//the wikimedia image url is a little silly:
//https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F
const commonsURL = function () {
  let file = this.data.file;
  let title = encodeTitle(file);
  // let hash = new jsHash.MD5().hex(title)
  let hash = md5(title);
  let path = hash.substr(0, 1) + '/' + hash.substr(0, 2) + '/';
  title = encodeURIComponent(title);
  path += title;
  return server + path
};

// test if the image url exists or not
const imgExists = function (callback) {
  const userAgent = this.data['_userAgent'];
  return unfetch(this.url(), {
    method: 'HEAD',
    headers: {
      'Api-User-Agent': userAgent,
      'User-Agent': userAgent
    }
  })
    .then(resp => {
      //support callback non-promise form
      let status = String(resp.status) || '';
      let bool = /^[23]/.test(status);
      if (callback) {
        callback(null, bool);
      }
      return bool
    })
    .catch(e => {
      console.error(e);
      if (callback) {
        callback(e, null);
      }
      return null
    })
};

// is there a good image of this
const mainImage = function () {
  let box = this.infobox();
  if (box) {
    let img = box.image();
    if (img) {
      return img
    }
  }
  let s = this.section();
  let imgs = s.images();
  if (imgs.length === 1) {
    return imgs[0]
  }
  return null
};

/**
 * capitalizes the input
 * hello -> Hello
 * hello there -> Hello there
 *
 * @private
 * @param {string} [str] the string that will be capitalized
 * @returns {string} the capitalized string
 */

/**
 * determines if an variable is an array or not
 *
 * @private
 * @param {*} x the variable that needs to be checked
 * @returns {boolean} whether the variable is an array
 */
function isArray(x) {
  return Object.prototype.toString.call(x) === '[object Array]'
}

const isInterWiki = /(wikibooks|wikidata|wikimedia|wikinews|wikipedia|wikiquote|wikisource|wikispecies|wikiversity|wikivoyage|wiktionary|foundation|meta)\.org/;

/**
 * turns a object into a query string
 * 
 * @private
 * @param {Object<string, string | number | boolean>} obj
 * @returns {string} QueryString
 */
const toQueryString = function (obj) {
  return Object.entries(obj)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
};

/**
 * cleans and prepares the tile by replacing the spaces with underscores (_) and trimming the white spaces of the ends
 *
 * @private
 * @param {string} page the title that needs cleaning
 * @returns {string} the cleaned title
 */
const cleanTitle = (page) => {
  return page.replace(/ /g, '_')
    .trim()
};

/**
 * generates the url for fetching the pages
 * 
 * @private
 * @param {import('.').fetchDefaults} options
 * @param {Object} [parameters]
 * @returns {string} the url that can be used to make the fetch
 */
const makeUrl = function (options, parameters) {
  let params = Object.assign({}, parameters);

  //default url
  let apiPath = '';

  //add support for third party apis
  if (options.domain) {
    //wikimedia is the only api that uses `/w/api` as its path. other wikis use other paths
    let path = isInterWiki.test(options.domain) ? 'w/api.php' : options.path;
    apiPath = `https://${options.domain}/${path}?`;
  } else if (options.lang && options.wiki) {
    apiPath = `https://${options.lang}.${options.wiki}.org/w/api.php?`;
  } else {
    return ''
  }


  if (!options.follow_redirects) {
    delete params.redirects;
  }

  // the origin header and url parameters need to be the same
  // if one is provided we should change both the header and the parameter
  if (options.origin) {
    params.origin = options.origin;
  }

  //support numerical ids
  let title = options.title;
  if (typeof title === 'number') {
    //single pageId
    params.pageids = title;
  } else if (typeof title === 'string') {
    //single page title
    params.titles = cleanTitle(title);
  } else if (title !== undefined && isArray(title) && typeof title[0] === 'number') {
    //pageid array
    params.pageids = title.join('|');
  } else if (title !== undefined && isArray(title) === true && typeof title[0] === 'string') {
    //title array
    params.titles = title.map(cleanTitle).join('|');
  } else {
    return ''
  }

  //make it!
  return `${apiPath}${toQueryString(params)}`
};

/**
 * factory for header options
 *
 * @private
 * @param {object} options
 * @returns {object} the generated options
 */
const makeHeaders = function (options) {
  let agent =
    options.userAgent || options['User-Agent'] || options['Api-User-Agent'] || 'User of the wtf_wikipedia library';

  let origin;
  if (options.noOrigin) {
    origin = '';
  } else {
    origin = options.origin || options.Origin || '*';
  }

  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Api-User-Agent': agent,
      'User-Agent': agent,
      Origin: origin,
      'Accept-Encoding': 'gzip',
    },
    redirect: 'follow',
  }
};

/**
 * Parses the API response for a single image.
 * 
 * @private
 * @param {Object} fetchedImage
 * @returns {Object} method(s) results
 */
const parseImage = function (fetchedImage) {
  // if the data is missing return empty object
  if (fetchedImage.hasOwnProperty('missing')) {
    return {}
  }

  const metaData = fetchedImage.imageinfo[0].extmetadata; // call to iiprop "extmetadata"
  const url = fetchedImage.imageinfo[0].url; // call to iiprop "url"
  return { // add the data for the properties that exists
    ...(metaData && {
      licenseRes: {
        license: metaData.LicenseShortName && metaData.LicenseShortName.value || "",
        artist: metaData.Artist && metaData.Artist.value || "",
        credit: metaData.Credit && metaData.Credit.value || "",
        attributionRequired: metaData.AttributionRequired && metaData.AttributionRequired.value || ""
      }
    }),
    ...(url && { existsRes: true })
  }
};
/**
 * Parses the wikimedia API's "imageinfo" prop response for an array of images or a single image.
 *
 * @private
 * @param {string[]} titles an array of images' titles (".file()" results)
 * @param {Object} fetched API response
 * @param {boolean} isDoc whether the call is from a Document or an Image
 * @returns {Object | Object[]} 
 */
const parseFetched = function (titles, fetched, isDoc) {
  if (isDoc) { // group of images
    // sort the results because API response is not in order, then find the info we need
    const fetchedValues = Object.values(fetched.query.pages);
    const newMethodsRes = [];
    titles = titles.map(i => {
      i = i.replace(/_/g, " ");
      i = i.replace(/^.*?:/, ""); // delete 'File:', 'Image:' etc.
      i = i[0].toUpperCase() + i.substring(1); // capitalize all of them
      return i
    });
    const regFileName = /^.*?:(.*)/;
    for (const t of titles) {
      for (const f of fetchedValues) {
        if (f.title.match(regFileName)[1] === t) {
          newMethodsRes.push(parseImage(f));
          break
        }
      }
    }
    return newMethodsRes
  }
  // a single image
  return parseImage(Object.values(fetched.query.pages)[0])
};

const methodsProps = { // the accepted methdos and the iiprop (imageinfo prop (URL parameter)) needed for each method
  license: "extmetadata",
  exists: "url"
};

/**
 * The error thrown when a method passed to the function is invalid
 * 
 * @class
 */
class InvalidMethod extends Error {
  constructor(invalidMethod) {
    super();
    const validMethods = Object.keys(methodsProps).join(', ');
    this.message = `'${invalidMethod}' cannot be passed to the 'images' method; ` +
      `valid values are:\n${validMethods}`;
    this.name = this.constructor.name;
  }
}

/**
 * Fetches the information for an image or all the images.
 * 
 * @param {string[] | string} [methods] the methods that the data will be requested for
 * @param {Object[]} [images] an array of images (the old "images" method's results)
 * @returns {Promise<Object[]>} methods' results for an array of images
 * @throws {InvalidMethod} throws if a passed method is invalid
 */
function fetch(methods = "", images = []) {

  const isDoc = images.length ? true : false; // whether the call is from a Document(".images()") or an Image
  let titles; // will be a string or an array of strings
  let iiprop; // will be a string
  const userAgent = isDoc ? this['_userAgent'] : this.data['_userAgent'];
  const mpEntries = Object.entries(methodsProps);

  if (isDoc) {
    titles = images.map(i => i.file());

    // find the related iiprop for each method if an array, or for a single method if a string
    if (Array.isArray(methods)) {
      iiprop = [];
      for (const m of methods) {
        for (const mp of mpEntries.entries()) { // mpEntries.entries(): [[<index>, [<method>, <iiprop>]], ...]
          if (m.toLowerCase() === mp[1][0]) {
            iiprop.push(mp[1][1]);
            break
          }
          if (mp[0] === mpEntries.length - 1) { // if it's the last one and a match isn't found ...
            throw new InvalidMethod(m)
          }
        }
      }
      iiprop = iiprop.join("|");
    }
    else if (typeof methods === "string") {
      for (const mp of mpEntries) {
        if (methods.toLowerCase() === mp[0]) {
          iiprop = mp[1];
          break
        }
      }
      if (!iiprop) { // if a match isn't found ...
        throw new InvalidMethod(methods)
      }
    }
  }
  else {
    titles = this.file();
    for (const mp of mpEntries) {
      if (methods.toLowerCase() === mp[0]) {
        iiprop = mp[1];
        break
      }
    }
    if (!iiprop) { // if a match isn't found ...
      throw new InvalidMethod(methods)
    }
  }

  const options = {
    title: titles,
    domain: "commons.wikimedia.org",
    userAgent: userAgent
  };
  const params = {
    action: 'query',
    prop: "imageinfo",
    iiprop: iiprop,
    maxlag: 5,
    format: 'json',
    origin: '*',
  };
  const url = makeUrl(options, params);
  const headers = makeHeaders(options);
  return unfetch(url, headers)
    .then(res => res.json())
    .then(res => {
      if (!isDoc) {
        this.data.pluginData = {
          ...this.data.pluginData,
          ...parseFetched(titles, res, isDoc)
        };
        return null
      }
      else {
        return parseFetched(titles, res, isDoc)
      }
    })
    .catch(e => {
      console.error(e);
    })
}

/**
 * The old "images" method
 * @callback oldMethod
 * @param {number} [clue]
 * @returns {Object[]} an array of images or a single image
 */

/**
 * Redefines the "images" method. When the user wants to call certain methods (that make requests)
 * for all the images; it calls the api once for all the images, then redefines those methods which
 * now only return the already fetched response.
 * 
 * @param {oldMethod} oldMethod
 * @returns {newMethod}
 */

const images = function (oldMethod) {

  /**
   * @typedef imagesOptions
   * @property {string | string[]} batch specifies the methods to be rquested beforehand in one API call
   */

  /**
   * The new "images" method.
   * 
   * @function newMethod
   * @param {number | imagesOptions} [clue]
   * @returns {Promise<Object[]> | Object[]} an array of images or a single image
   */

  const newMethod = function (clue) { // "this" refers to the document

    // adds userAgent to each image, to use for methods that call the API.
    const addUserAgent = function (imgs) {
      return imgs.map(i => {
        i.data['_userAgent'] = this['_userAgent'];
        return i
      })
    };
    let imagesArr;

    // return a single image (oldMethod accepts a number clue)
    if (typeof clue === "number") {
      imagesArr = oldMethod.call(this, clue);
      imagesArr = addUserAgent.call(this, imagesArr);
      return imagesArr
    }
    // return images based on the new clue value (options object)
    else if (typeof clue === "object") {
      if (clue.batch) {
        imagesArr = oldMethod.call(this);
        imagesArr = addUserAgent.call(this, imagesArr);
        return fetch.call(this, clue.batch, imagesArr).then(methodsRes => {
          let methodsRedefined = false;
          imagesArr = imagesArr.map((image, ind) => {

            // add the results to plugin data
            image.data.pluginData = {
              ...image.data.pluginData,
              ...methodsRes[ind]
            };

            // redefine methods on the image prototype just once
            if (!methodsRedefined) {
              if (Object.keys(methodsRes[ind]).length > 0) {
                methodsRedefined = true;
                const imageProto = Object.getPrototypeOf(image);
                Object.keys(image.data.pluginData).forEach(k => {
                  const methodName = k.slice(0, -3); // each key is like "<methodName>Res"
                  imageProto[methodName] = function () {
                    // return a Promise for consistency
                    return Promise.resolve(this.data.pluginData[k] || null)
                  };
                });
              }
            }
            return image
          });
          return imagesArr
        })
      }
    }
    imagesArr = oldMethod.call(this);
    imagesArr = addUserAgent.call(this, imagesArr);
    return imagesArr
  };
  return newMethod
};

/**
 * Returns the license information for the image.
 * 
 * @returns {Promise<Object>}
 */
const license = async function () {
  await fetch.call(this, "license");
  return this.data.pluginData.licenseRes || null
};

const addMethod = function (models) {
  models.Doc.prototype.mainImage = mainImage;
  // add a new method to Image class
  models.Image.prototype.commonsURL = commonsURL;
  models.Image.prototype.exists = imgExists;
  models.Image.prototype.license = license;
  // redefine the "images" method
  const oldImages = models.Doc.prototype.images; // store the old method to use in the new one
  models.Doc.prototype.images = images(oldImages);
};

export { addMethod as default };
