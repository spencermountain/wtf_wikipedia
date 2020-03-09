/* wtf_wikipedia 7.8.1 MIT */
import https from 'https';

const parseUrl = function(url) {
  let parsed = new URL(url); //eslint-disable-line
  let title = parsed.pathname.replace(/^\/(wiki\/)?/, '');
  title = decodeURIComponent(title);
  return {
    domain: parsed.host,
    title: title
  }
};
var _00ParseUrl = parseUrl;

const isInterWiki = /(wiktionary|wikinews|wikibooks|wikiquote|wikisource|wikispecies|wikiversity|wikivoyage|wikipedia|wikimedia|foundation|meta)\.org/;

const defaults = {
  action: 'query',
  prop: 'revisions', //we use the 'revisions' api here, instead of the Raw api, for its CORS-rules..
  rvprop: 'content',
  maxlag: 5,
  rvslots: 'main',
  origin: '*',
  format: 'json',
  redirects: 'true'
};

const toQueryString = function(obj) {
  return Object.entries(obj)
    .map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .join('&')
};

const isArray = function(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
};

const cleanTitle = page => {
  page = page.replace(/ /g, '_');
  page = page.trim();
  // page = encodeURIComponent(page)
  return page
};

const makeUrl = function(options) {
  let params = Object.assign({}, defaults);
  // default url
  let url = `https://${options.lang}.${options.wiki}.org/w/api.php?`;
  // from a 3rd party wiki
  if (options.domain) {
    let path = options.path;
    //wikimedia api uses ./w/api path. no others do
    if (isInterWiki.test(options.domain)) {
      path = 'w/api.php';
    }
    url = `https://${options.domain}/${path}?`;
  }
  if (!options.follow_redirects) {
    delete params.redirects;
  }
  // support numerical ids
  let page = options.title;
  if (typeof page === 'number' || (isArray(page) && typeof page[0] === 'number')) {
    params.pageids = page;
  } else if (isArray(page) === true) {
    //support array
    params.titles = page.map(cleanTitle).join('|');
  } else {
    console.log(page);
    // single page
    params.titles = cleanTitle(page);
    console.log(params.titles);
  }
  // make it!
  url += toQueryString(params);
  return url
};
var _01MakeUrl = makeUrl;

//this data-format from mediawiki api is nutso
const getResult = function(data) {
  let pages = Object.keys(data.query.pages);
  let docs = pages.map(id => {
    let page = data.query.pages[id] || {};
    if (page.hasOwnProperty('missing') || page.hasOwnProperty('invalid')) {
      return null
    }
    let text = page.revisions[0]['*'];
    //us the 'generator' result format, for the random() method
    if (!text && page.revisions[0].slots) {
      text = page.revisions[0].slots.main['*'];
    }
    let meta = {
      title: page.title,
      id: page.pageid,
      namespace: page.ns
    };
    try {
      return { wiki: text, meta: meta }
    } catch (e) {
      console.error(e);
      throw e
    }
  });
  return docs
};
var _02GetResult = getResult;

//helper for looping around all sections of a document
const sectionMap = function(doc, fn, clue) {
  let arr = [];
  doc.sections().forEach(sec => {
    let list = [];
    if (typeof clue === 'string') {
      list = sec[fn](clue);
    } else {
      list = sec[fn]();
    }
    list.forEach(t => {
      arr.push(t);
    });
  });
  if (typeof clue === 'number') {
    return arr[clue]
  }
  return arr
};
var _sectionMap = sectionMap;

//
const setDefaults = function(options, defaults) {
  return Object.assign({}, defaults, options)
};
var setDefaults_1 = setDefaults;

const defaults$1 = {
  title: true,
  sections: true,
  pageID: true,
  categories: true
};

//an opinionated output of the most-wanted data
const toJSON = function(doc, options) {
  options = setDefaults_1(options, defaults$1);
  let data = {};
  if (options.title) {
    data.title = doc.options.title || doc.title();
  }
  if (options.pageID && doc.options.pageID) {
    data.pageID = doc.options.pageID;
  }
  if (options.categories) {
    data.categories = doc.categories();
  }
  if (options.sections) {
    data.sections = doc.sections().map(i => i.json(options));
  }
  if (doc.isRedirect() === true) {
    data.isRedirect = true;
    data.redirectTo = doc.data.redirectTo;
    data.sections = [];
  }

  //these are default-off
  if (options.coordinates) {
    data.coordinates = doc.coordinates();
  }
  if (options.infoboxes) {
    data.infoboxes = doc.infoboxes().map(i => i.json(options));
  }
  if (options.images) {
    data.images = doc.images().map(i => i.json(options));
  }
  if (options.plaintext) {
    data.plaintext = doc.plaintext(options);
  }
  if (options.citations || options.references) {
    data.references = doc.references();
  }
  return data
};
var toJson = toJSON;

//alternative names for methods in API
const aliasList = {
  plaintext: 'text',

  wikiscript: 'wikitext',
  wiki: 'wikitext',
  original: 'wikitext'
};
var aliases = aliasList;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var browserPonyfill = createCommonjsModule(function (module, exports) {
var __self__ = (function (root) {
function F() {
this.fetch = false;
this.DOMException = root.DOMException;
}
F.prototype = root;
return new F();
})(typeof self !== 'undefined' ? self : commonjsGlobal);
(function(self) {

var irrelevant = (function (exports) {
  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob:
      'FileReader' in self &&
      'Blob' in self &&
      (function() {
        try {
          new Blob();
          return true
        } catch (e) {
          return false
        }
      })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj)
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      };
    }

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);
  }

  Request.prototype.clone = function() {
    return new Request(this, {body: this._bodyInit})
  };

  function decode(body) {
    var form = new FormData();
    body
      .trim()
      .split('&')
      .forEach(function(bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  exports.DOMException = self.DOMException;
  try {
    new exports.DOMException();
  } catch (err) {
    exports.DOMException = function(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };
    exports.DOMException.prototype = Object.create(Error.prototype);
    exports.DOMException.prototype.constructor = exports.DOMException;
  }

  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new exports.DOMException('Aborted', 'AbortError'))
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.onabort = function() {
        reject(new exports.DOMException('Aborted', 'AbortError'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function() {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  }

  fetch.polyfill = true;

  if (!self.fetch) {
    self.fetch = fetch;
    self.Headers = Headers;
    self.Request = Request;
    self.Response = Response;
  }

  exports.Headers = Headers;
  exports.Request = Request;
  exports.Response = Response;
  exports.fetch = fetch;

  return exports;

}({}));
})(__self__);
delete __self__.fetch.polyfill;
exports = __self__.fetch; // To enable: import fetch from 'cross-fetch'
exports.default = __self__.fetch; // For TypeScript consumers without esModuleInterop.
exports.fetch = __self__.fetch; // To enable: import {fetch} from 'cross-fetch'
exports.Headers = __self__.Headers;
exports.Request = __self__.Request;
exports.Response = __self__.Response;
module.exports = exports;
});
var browserPonyfill_1 = browserPonyfill.fetch;
var browserPonyfill_2 = browserPonyfill.Headers;
var browserPonyfill_3 = browserPonyfill.Request;
var browserPonyfill_4 = browserPonyfill.Response;

const defaults$2 = {
  caption: true,
  alt: true,
  links: true,
  thumb: true,
  url: true
};
//
const toJson$1 = function(img, options) {
  options = setDefaults_1(options, defaults$2);
  let json = {
    file: img.file()
  };
  if (options.thumb !== false) {
    json.thumb = img.thumbnail();
  }
  if (options.url !== false) {
    json.url = img.url();
  }
  //add captions
  if (options.caption !== false && img.data.caption) {
    json.caption = img.caption();
    if (options.links !== false && img.data.caption.links()) {
      json.links = img.links();
    }
  }
  if (options.alt !== false && img.data.alt) {
    json.alt = img.alt();
  }
  return json
};
var toJson_1 = toJson$1;

const server = 'https://wikipedia.org/wiki/Special:Redirect/file/';


const encodeTitle = function(file) {
  let title = file.replace(/^(image|file?)\:/i, '');
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1);
  //spaces to underscores
  title = title.trim().replace(/ /g, '_');
  return title
};

//the wikimedia image url is a little silly:
const makeSrc = function(file) {
  let title = encodeTitle(file);
  title = encodeURIComponent(title);
  return title
};

//the class for our image generation functions
const Image = function(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

const methods = {
  file() {
    return this.data.file || ''
  },
  alt() {
    let str = this.data.alt || this.data.file || '';
    str = str.replace(/^(file|image):/i, '');
    str = str.replace(/\.(jpg|jpeg|png|gif|svg)/i, '');
    return str.replace(/_/g, ' ')
  },
  caption() {
    if (this.data.caption) {
      return this.data.caption.text()
    }
    return ''
  },
  links() {
    if (this.data.caption) {
      return this.data.caption.links()
    }
    return []
  },
  url() {
    return server + makeSrc(this.file())
  },
  thumbnail(size) {
    size = size || 300;
    let path = makeSrc(this.file());
    return server + path + '?width=' + size
  },
  format() {
    let arr = this.file().split('.');
    if (arr[arr.length - 1]) {
      return arr[arr.length - 1].toLowerCase()
    }
    return null
  },
  exists(callback) {
    //check if the image (still) exists
    return new Promise(cb => {
      browserPonyfill(this.url(), {
        method: 'HEAD'
      }).then(function(res) {
        const exists = res.status === 200;
        //support callback non-promise form
        if (callback) {
          callback(exists);
        }
        cb(exists);
      });
    })
  },
  json: function(options) {
    options = options || {};
    return toJson_1(this, options)
  },
  text: function() {
    return ''
  }
};

Object.keys(methods).forEach(k => {
  Image.prototype[k] = methods[k];
});
//add alises, too
Object.keys(aliases).forEach(k => {
  Image.prototype[k] = methods[aliases[k]];
});
Image.prototype.src = Image.prototype.url;
Image.prototype.thumb = Image.prototype.thumbnail;
var Image_1 = Image;

const defaults$3 = {
  tables: true,
  lists: true,
  paragraphs: true
};

//
const Document = function(data, options) {
  this.options = options || {};
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

const methods$1 = {
  title: function(str) {
    //use like a setter
    if (str !== undefined) {
      this.data.title = str;
      return str
    }
    //few places this could be stored..
    if (this.data.title !== '') {
      return this.data.title
    }
    if (this.options.title) {
      return this.options.title
    }
    let guess = null;
    //guess the title of this page from first sentence bolding
    let sen = this.sentences(0);
    if (sen) {
      guess = sen.bolds(0);
    }
    return guess
  },
  isRedirect: function() {
    return this.data.type === 'redirect'
  },
  redirectTo: function() {
    return this.data.redirectTo
  },
  isDisambiguation: function() {
    return this.data.type === 'disambiguation'
  },
  categories: function(clue) {
    if (typeof clue === 'number') {
      return this.data.categories[clue]
    }
    return this.data.categories || []
  },
  sections: function(clue) {
    let arr = this.data.sections || [];
    arr.forEach(sec => (sec.doc = this));
    //grab a specific section, by its title
    if (typeof clue === 'string') {
      let str = clue.toLowerCase().trim();
      return arr.find(s => {
        return s.title().toLowerCase() === str
      })
    }
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr
  },
  paragraphs: function(n) {
    let arr = [];
    this.data.sections.forEach(s => {
      arr = arr.concat(s.paragraphs());
    });
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr
  },
  paragraph: function(n) {
    let arr = this.paragraphs() || [];
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr[0]
  },
  sentences: function(n) {
    let arr = [];
    this.sections().forEach(sec => {
      arr = arr.concat(sec.sentences());
    });
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr
  },
  images: function(clue) {
    let arr = _sectionMap(this, 'images', null);
    //grab image from infobox, first
    this.infoboxes().forEach(info => {
      let img = info.image();
      if (img) {
        arr.unshift(img); //put it at the top
      }
    });
    //look for 'gallery' templates, too
    this.templates().forEach(obj => {
      if (obj.template === 'gallery') {
        obj.images = obj.images || [];
        obj.images.forEach(img => {
          if (img instanceof Image_1 === false) {
            img = new Image_1(img);
          }
          arr.push(img);
        });
      }
    });
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr
  },
  links: function(clue) {
    return _sectionMap(this, 'links', clue)
  },
  interwiki: function(clue) {
    return _sectionMap(this, 'interwiki', clue)
  },
  lists: function(clue) {
    return _sectionMap(this, 'lists', clue)
  },
  tables: function(clue) {
    return _sectionMap(this, 'tables', clue)
  },
  templates: function(clue) {
    return _sectionMap(this, 'templates', clue)
  },
  references: function(clue) {
    return _sectionMap(this, 'references', clue)
  },
  coordinates: function(clue) {
    return _sectionMap(this, 'coordinates', clue)
  },
  infoboxes: function(clue) {
    let arr = _sectionMap(this, 'infoboxes');
    //sort them by biggest-first
    arr = arr.sort((a, b) => {
      if (Object.keys(a.data).length > Object.keys(b.data).length) {
        return -1
      }
      return 1
    });
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr
  },
  text: function(options) {
    options = setDefaults_1(options, defaults$3);
    //nah, skip these.
    if (this.isRedirect() === true) {
      return ''
    }
    let arr = this.sections().map(sec => sec.text(options));
    return arr.join('\n\n')
  },
  json: function(options) {
    options = setDefaults_1(options, defaults$3);
    return toJson(this, options)
  },
  debug: function() {
    console.log('\n');
    this.sections().forEach(sec => {
      let indent = ' - ';
      for (let i = 0; i < sec.depth; i += 1) {
        indent = ' -' + indent;
      }
      console.log(indent + (sec.title() || '(Intro)'));
    });
    return this
  }
};

//add alises
Object.keys(aliases).forEach(k => {
  Document.prototype[k] = methods$1[aliases[k]];
});
//add singular-methods, too
let plurals = [
  'sections',
  'infoboxes',
  'sentences',
  'citations',
  'references',
  'coordinates',
  'tables',
  'links',
  'images',
  'categories'
];
plurals.forEach(fn => {
  let sing = fn.replace(/ies$/, 'y');
  sing = sing.replace(/e?s$/, '');
  methods$1[sing] = function(n) {
    n = n || 0;
    return this[fn](n)
  };
});

Object.keys(methods$1).forEach(k => {
  Document.prototype[k] = methods$1[k];
});

//alias these ones
Document.prototype.isDisambig = Document.prototype.isDisambiguation;
Document.prototype.citations = Document.prototype.references;
Document.prototype.redirectsTo = Document.prototype.redirectTo;
Document.prototype.redirect = Document.prototype.redirectTo;
Document.prototype.redirects = Document.prototype.redirectTo;

var Document_1 = Document;

var i18n_1 = createCommonjsModule(function (module) {
// wikipedia special terms lifted and augmented from parsoid parser april 2015
// (not even close to being complete)
let i18n = {
  files: [
    'файл',
    'fitxer',
    'soubor',
    'datei',
    'file',
    'archivo',
    'پرونده',
    'tiedosto',
    'mynd',
    "su'wret",
    'fichier',
    'bestand',
    'датотека',
    'dosya',
    'fil',
    'ファイル',
    'चित्र',
    '파일' //ko
  ],
  images: ['image', 'चित्र'],
  templates: [
    'шаблён',
    'plantilla',
    'šablona',
    'vorlage',
    'template',
    'الگو',
    'malline',
    'snið',
    'shablon',
    'modèle',
    'sjabloon',
    'шаблон',
    'şablon'
  ],
  categories: [
    'катэгорыя',
    'categoria',
    'kategorie',
    'category',
    'categoría',
    'رده',
    'luokka',
    'flokkur',
    'kategoriya',
    'catégorie',
    'categorie',
    'категорија',
    'kategori',
    'kategoria',
    'تصنيف',
    'श्रेणी',
    '분류', //ko
    //--
    'flocc',
    'Kateqoriya'
  ],
  redirects: [
    'перанакіраваньне',
    'redirect',
    'přesměruj',
    'weiterleitung',
    'redirección',
    'redireccion',
    'تغییر_مسیر',
    'تغییرمسیر',
    'ohjaus',
    'uudelleenohjaus',
    'tilvísun',
    'aýdaw',
    'айдау',
    'redirection',
    'doorverwijzing',
    'преусмери',
    'преусмјери',
    'yönlendi̇rme',
    'yönlendi̇r',
    '重定向',
    'redirección',
    'redireccion',
    '重定向',
    'yönlendirm?e?',
    'تغییر_مسیر',
    'تغییرمسیر',
    'перанакіраваньне',
    'yönlendirme'
  ],
  specials: [
    'спэцыяльныя',
    'especial',
    'speciální',
    'spezial',
    'special',
    'ویژه',
    'toiminnot',
    'kerfissíða',
    'arnawlı',
    'spécial',
    'speciaal',
    'посебно',
    'özel',
    '特別'
  ],
  users: [
    'удзельнік',
    'usuari',
    'uživatel',
    'benutzer',
    'user',
    'usuario',
    'کاربر',
    'käyttäjä',
    'notandi',
    'paydalanıwshı',
    'utilisateur',
    'gebruiker',
    'корисник',
    'kullanıcı',
    '利用者'
  ],
  disambigs: [
    'disambig', //en
    'disambiguation', //en
    'dab', //en
    'disamb', //en
    'begriffsklärung', //de
    'ujednoznacznienie', //pl
    'doorverwijspagina', //nl
    '消歧义', //zh
    'desambiguación', //es
    'dubbelsinnig', //af
    'disambigua', //it
    'desambiguação', //pt
    'homonymie', //fr
    'неоднозначность', //ru
    'anlam ayrımı', //tr
    '曖昧さ回避' //ja
  ],
  infoboxes: [
    'infobox',
    'ficha',
    'канадский',
    'inligtingskas',
    'inligtingskas3', //af
    'لغة',
    'bilgi kutusu', //tr
    'yerleşim bilgi kutusu',
    'infoboks', //nn, no
    'ज्ञानसन्दूक'
  ],
  sources: [
    //blacklist these headings, as they're not plain-text
    'references',
    'see also',
    'external links',
    'further reading',
    'notes et références',
    'voir aussi',
    'liens externes',
    '参考文献', //references (ja)
    '脚注', //citations (ja)
    '関連項目', //see also (ja)
    '外部リンク' //external links (ja)
  ]
};

let dictionary = {};
Object.keys(i18n).forEach(k => {
  i18n[k].forEach(w => {
    dictionary[w] = true;
  });
});
i18n.dictionary = dictionary;

if ( module.exports) {
  module.exports = i18n;
}
});

// TODO: not used. remove local_title or english_title, and probably direction.
var languages = {
  aa: {
    english_title: 'Afar',
    direction: 'ltr',
    local_title: 'Afar'
  },
  ab: {
    english_title: 'Abkhazian',
    direction: 'ltr',
    local_title: 'Аҧсуа'
  },
  af: {
    english_title: 'Afrikaans',
    direction: 'ltr',
    local_title: 'Afrikaans'
  },
  ak: {
    english_title: 'Akan',
    direction: 'ltr',
    local_title: 'Akana'
  },
  als: {
    english_title: 'Alemannic',
    direction: 'ltr',
    local_title: 'Alemannisch'
  },
  am: {
    english_title: 'Amharic',
    direction: 'ltr',
    local_title: 'አማርኛ'
  },
  an: {
    english_title: 'Aragonese',
    direction: 'ltr',
    local_title: 'Aragonés'
  },
  ang: {
    english_title: 'Anglo-Saxon',
    direction: 'ltr',
    local_title: 'Englisc'
  },
  ar: {
    english_title: 'Arabic',
    direction: 'rtl',
    local_title: 'العربية'
  },
  arc: {
    english_title: 'Aramaic',
    direction: 'rtl',
    local_title: 'ܣܘܪܬ'
  },
  as: {
    english_title: 'Assamese',
    direction: 'ltr',
    local_title: 'অসমীয়া'
  },
  ast: {
    english_title: 'Asturian',
    direction: 'ltr',
    local_title: 'Asturianu'
  },
  av: {
    english_title: 'Avar',
    direction: 'ltr',
    local_title: 'Авар'
  },
  ay: {
    english_title: 'Aymara',
    direction: 'ltr',
    local_title: 'Aymar'
  },
  az: {
    english_title: 'Azerbaijani',
    direction: 'ltr',
    local_title: 'Azərbaycanca'
  },
  ba: {
    english_title: 'Bashkir',
    direction: 'ltr',
    local_title: 'Башҡорт'
  },
  bar: {
    english_title: 'Bavarian',
    direction: 'ltr',
    local_title: 'Boarisch'
  },
  'bat-smg': {
    english_title: 'Samogitian',
    direction: 'ltr',
    local_title: 'Žemaitėška'
  },
  bcl: {
    english_title: 'Bikol',
    direction: 'ltr',
    local_title: 'Bikol'
  },
  be: {
    english_title: 'Belarusian',
    direction: 'ltr',
    local_title: 'Беларуская'
  },
  'be-x-old': {
    english_title: 'Belarusian',
    direction: '(Taraškievica)',
    local_title: 'ltr'
  },
  bg: {
    english_title: 'Bulgarian',
    direction: 'ltr',
    local_title: 'Български'
  },
  bh: {
    english_title: 'Bihari',
    direction: 'ltr',
    local_title: 'भोजपुरी'
  },
  bi: {
    english_title: 'Bislama',
    direction: 'ltr',
    local_title: 'Bislama'
  },
  bm: {
    english_title: 'Bambara',
    direction: 'ltr',
    local_title: 'Bamanankan'
  },
  bn: {
    english_title: 'Bengali',
    direction: 'ltr',
    local_title: 'বাংলা'
  },
  bo: {
    english_title: 'Tibetan',
    direction: 'ltr',
    local_title: 'བོད་ཡིག'
  },
  bpy: {
    english_title: 'Bishnupriya',
    direction: 'Manipuri',
    local_title: 'ltr'
  },
  br: {
    english_title: 'Breton',
    direction: 'ltr',
    local_title: 'Brezhoneg'
  },
  bs: {
    english_title: 'Bosnian',
    direction: 'ltr',
    local_title: 'Bosanski'
  },
  bug: {
    english_title: 'Buginese',
    direction: 'ltr',
    local_title: 'ᨅᨔ'
  },
  bxr: {
    english_title: 'Buriat',
    direction: '(Russia)',
    local_title: 'ltr'
  },
  ca: {
    english_title: 'Catalan',
    direction: 'ltr',
    local_title: 'Català'
  },
  cdo: {
    english_title: 'Min',
    direction: 'Dong',
    local_title: 'Chinese'
  },
  ce: {
    english_title: 'Chechen',
    direction: 'ltr',
    local_title: 'Нохчийн'
  },
  ceb: {
    english_title: 'Cebuano',
    direction: 'ltr',
    local_title: 'Sinugboanong'
  },
  ch: {
    english_title: 'Chamorro',
    direction: 'ltr',
    local_title: 'Chamoru'
  },
  cho: {
    english_title: 'Choctaw',
    direction: 'ltr',
    local_title: 'Choctaw'
  },
  chr: {
    english_title: 'Cherokee',
    direction: 'ltr',
    local_title: 'ᏣᎳᎩ'
  },
  chy: {
    english_title: 'Cheyenne',
    direction: 'ltr',
    local_title: 'Tsetsêhestâhese'
  },
  co: {
    english_title: 'Corsican',
    direction: 'ltr',
    local_title: 'Corsu'
  },
  cr: {
    english_title: 'Cree',
    direction: 'ltr',
    local_title: 'Nehiyaw'
  },
  cs: {
    english_title: 'Czech',
    direction: 'ltr',
    local_title: 'Česky'
  },
  csb: {
    english_title: 'Kashubian',
    direction: 'ltr',
    local_title: 'Kaszëbsczi'
  },
  cu: {
    english_title: 'Old',
    direction: 'Church',
    local_title: 'Slavonic'
  },
  cv: {
    english_title: 'Chuvash',
    direction: 'ltr',
    local_title: 'Чăваш'
  },
  cy: {
    english_title: 'Welsh',
    direction: 'ltr',
    local_title: 'Cymraeg'
  },
  da: {
    english_title: 'Danish',
    direction: 'ltr',
    local_title: 'Dansk'
  },
  de: {
    english_title: 'German',
    direction: 'ltr',
    local_title: 'Deutsch'
  },
  diq: {
    english_title: 'Dimli',
    direction: 'ltr',
    local_title: 'Zazaki'
  },
  dsb: {
    english_title: 'Lower',
    direction: 'Sorbian',
    local_title: 'ltr'
  },
  dv: {
    english_title: 'Divehi',
    direction: 'rtl',
    local_title: 'ދިވެހިބަސް'
  },
  dz: {
    english_title: 'Dzongkha',
    direction: 'ltr',
    local_title: 'ཇོང་ཁ'
  },
  ee: {
    english_title: 'Ewe',
    direction: 'ltr',
    local_title: 'Ɛʋɛ'
  },
  far: {
    english_title: 'Farsi',
    direction: 'ltr',
    local_title: 'فارسی'
  },
  el: {
    english_title: 'Greek',
    direction: 'ltr',
    local_title: 'Ελληνικά'
  },
  en: {
    english_title: 'English',
    direction: 'ltr',
    local_title: 'English'
  },
  eo: {
    english_title: 'Esperanto',
    direction: 'ltr',
    local_title: 'Esperanto'
  },
  es: {
    english_title: 'Spanish',
    direction: 'ltr',
    local_title: 'Español'
  },
  et: {
    english_title: 'Estonian',
    direction: 'ltr',
    local_title: 'Eesti'
  },
  eu: {
    english_title: 'Basque',
    direction: 'ltr',
    local_title: 'Euskara'
  },
  ext: {
    english_title: 'Extremaduran',
    direction: 'ltr',
    local_title: 'Estremeñu'
  },
  ff: {
    english_title: 'Peul',
    direction: 'ltr',
    local_title: 'Fulfulde'
  },
  fi: {
    english_title: 'Finnish',
    direction: 'ltr',
    local_title: 'Suomi'
  },
  'fiu-vro': {
    english_title: 'Võro',
    direction: 'ltr',
    local_title: 'Võro'
  },
  fj: {
    english_title: 'Fijian',
    direction: 'ltr',
    local_title: 'Na'
  },
  fo: {
    english_title: 'Faroese',
    direction: 'ltr',
    local_title: 'Føroyskt'
  },
  fr: {
    english_title: 'French',
    direction: 'ltr',
    local_title: 'Français'
  },
  frp: {
    english_title: 'Arpitan',
    direction: 'ltr',
    local_title: 'Arpitan'
  },
  fur: {
    english_title: 'Friulian',
    direction: 'ltr',
    local_title: 'Furlan'
  },
  fy: {
    english_title: 'West',
    direction: 'Frisian',
    local_title: 'ltr'
  },
  ga: {
    english_title: 'Irish',
    direction: 'ltr',
    local_title: 'Gaeilge'
  },
  gan: {
    english_title: 'Gan',
    direction: 'Chinese',
    local_title: 'ltr'
  },
  gd: {
    english_title: 'Scottish',
    direction: 'Gaelic',
    local_title: 'ltr'
  },
  gil: {
    english_title: 'Gilbertese',
    direction: 'ltr',
    local_title: 'Taetae'
  },
  gl: {
    english_title: 'Galician',
    direction: 'ltr',
    local_title: 'Galego'
  },
  gn: {
    english_title: 'Guarani',
    direction: 'ltr',
    local_title: "Avañe'ẽ"
  },
  got: {
    english_title: 'Gothic',
    direction: 'ltr',
    local_title: 'gutisk'
  },
  gu: {
    english_title: 'Gujarati',
    direction: 'ltr',
    local_title: 'ગુજરાતી'
  },
  gv: {
    english_title: 'Manx',
    direction: 'ltr',
    local_title: 'Gaelg'
  },
  ha: {
    english_title: 'Hausa',
    direction: 'rtl',
    local_title: 'هَوُسَ'
  },
  hak: {
    english_title: 'Hakka',
    direction: 'Chinese',
    local_title: 'ltr'
  },
  haw: {
    english_title: 'Hawaiian',
    direction: 'ltr',
    local_title: 'Hawai`i'
  },
  he: {
    english_title: 'Hebrew',
    direction: 'rtl',
    local_title: 'עברית'
  },
  hi: {
    english_title: 'Hindi',
    direction: 'ltr',
    local_title: 'हिन्दी'
  },
  ho: {
    english_title: 'Hiri',
    direction: 'Motu',
    local_title: 'ltr'
  },
  hr: {
    english_title: 'Croatian',
    direction: 'ltr',
    local_title: 'Hrvatski'
  },
  ht: {
    english_title: 'Haitian',
    direction: 'ltr',
    local_title: 'Krèyol'
  },
  hu: {
    english_title: 'Hungarian',
    direction: 'ltr',
    local_title: 'Magyar'
  },
  hy: {
    english_title: 'Armenian',
    direction: 'ltr',
    local_title: 'Հայերեն'
  },
  hz: {
    english_title: 'Herero',
    direction: 'ltr',
    local_title: 'Otsiherero'
  },
  ia: {
    english_title: 'Interlingua',
    direction: 'ltr',
    local_title: 'Interlingua'
  },
  id: {
    english_title: 'Indonesian',
    direction: 'ltr',
    local_title: 'Bahasa'
  },
  ie: {
    english_title: 'Interlingue',
    direction: 'ltr',
    local_title: 'Interlingue'
  },
  ig: {
    english_title: 'Igbo',
    direction: 'ltr',
    local_title: 'Igbo'
  },
  ii: {
    english_title: 'Sichuan',
    direction: 'Yi',
    local_title: 'ltr'
  },
  ik: {
    english_title: 'Inupiak',
    direction: 'ltr',
    local_title: 'Iñupiak'
  },
  ilo: {
    english_title: 'Ilokano',
    direction: 'ltr',
    local_title: 'Ilokano'
  },
  io: {
    english_title: 'Ido',
    direction: 'ltr',
    local_title: 'Ido'
  },
  is: {
    english_title: 'Icelandic',
    direction: 'ltr',
    local_title: 'Íslenska'
  },
  it: {
    english_title: 'Italian',
    direction: 'ltr',
    local_title: 'Italiano'
  },
  iu: {
    english_title: 'Inuktitut',
    direction: 'ltr',
    local_title: 'ᐃᓄᒃᑎᑐᑦ'
  },
  ja: {
    english_title: 'Japanese',
    direction: 'ltr',
    local_title: '日本語'
  },
  jbo: {
    english_title: 'Lojban',
    direction: 'ltr',
    local_title: 'Lojban'
  },
  jv: {
    english_title: 'Javanese',
    direction: 'ltr',
    local_title: 'Basa'
  },
  ka: {
    english_title: 'Georgian',
    direction: 'ltr',
    local_title: 'ქართული'
  },
  kg: {
    english_title: 'Kongo',
    direction: 'ltr',
    local_title: 'KiKongo'
  },
  ki: {
    english_title: 'Kikuyu',
    direction: 'ltr',
    local_title: 'Gĩkũyũ'
  },
  kj: {
    english_title: 'Kuanyama',
    direction: 'ltr',
    local_title: 'Kuanyama'
  },
  kk: {
    english_title: 'Kazakh',
    direction: 'ltr',
    local_title: 'Қазақша'
  },
  kl: {
    english_title: 'Greenlandic',
    direction: 'ltr',
    local_title: 'Kalaallisut'
  },
  km: {
    english_title: 'Cambodian',
    direction: 'ltr',
    local_title: 'ភាសាខ្មែរ'
  },
  kn: {
    english_title: 'Kannada',
    direction: 'ltr',
    local_title: 'ಕನ್ನಡ'
  },
  khw: {
    english_title: 'Khowar',
    direction: 'rtl',
    local_title: 'کھوار'
  },
  ko: {
    english_title: 'Korean',
    direction: 'ltr',
    local_title: '한국어'
  },
  kr: {
    english_title: 'Kanuri',
    direction: 'ltr',
    local_title: 'Kanuri'
  },
  ks: {
    english_title: 'Kashmiri',
    direction: 'rtl',
    local_title: 'कश्मीरी'
  },
  ksh: {
    english_title: 'Ripuarian',
    direction: 'ltr',
    local_title: 'Ripoarisch'
  },
  ku: {
    english_title: 'Kurdish',
    direction: 'rtl',
    local_title: 'Kurdî'
  },
  kv: {
    english_title: 'Komi',
    direction: 'ltr',
    local_title: 'Коми'
  },
  kw: {
    english_title: 'Cornish',
    direction: 'ltr',
    local_title: 'Kernewek'
  },
  ky: {
    english_title: 'Kirghiz',
    direction: 'ltr',
    local_title: 'Kırgızca'
  },
  la: {
    english_title: 'Latin',
    direction: 'ltr',
    local_title: 'Latina'
  },
  lad: {
    english_title: 'Ladino',
    direction: 'ltr',
    local_title: 'Dzhudezmo'
  },
  lan: {
    english_title: 'Lango',
    direction: 'ltr',
    local_title: 'Leb'
  },
  lb: {
    english_title: 'Luxembourgish',
    direction: 'ltr',
    local_title: 'Lëtzebuergesch'
  },
  lg: {
    english_title: 'Ganda',
    direction: 'ltr',
    local_title: 'Luganda'
  },
  li: {
    english_title: 'Limburgian',
    direction: 'ltr',
    local_title: 'Limburgs'
  },
  lij: {
    english_title: 'Ligurian',
    direction: 'ltr',
    local_title: 'Líguru'
  },
  lmo: {
    english_title: 'Lombard',
    direction: 'ltr',
    local_title: 'Lumbaart'
  },
  ln: {
    english_title: 'Lingala',
    direction: 'ltr',
    local_title: 'Lingála'
  },
  lo: {
    english_title: 'Laotian',
    direction: 'ltr',
    local_title: 'ລາວ'
  },
  lt: {
    english_title: 'Lithuanian',
    direction: 'ltr',
    local_title: 'Lietuvių'
  },
  lv: {
    english_title: 'Latvian',
    direction: 'ltr',
    local_title: 'Latviešu'
  },
  'map-bms': {
    english_title: 'Banyumasan',
    direction: 'ltr',
    local_title: 'Basa'
  },
  mg: {
    english_title: 'Malagasy',
    direction: 'ltr',
    local_title: 'Malagasy'
  },
  man: {
    english_title: 'Mandarin',
    direction: 'ltr',
    local_title: '官話'
  },
  mh: {
    english_title: 'Marshallese',
    direction: 'ltr',
    local_title: 'Kajin'
  },
  mi: {
    english_title: 'Maori',
    direction: 'ltr',
    local_title: 'Māori'
  },
  min: {
    english_title: 'Minangkabau',
    direction: 'ltr',
    local_title: 'Minangkabau'
  },
  mk: {
    english_title: 'Macedonian',
    direction: 'ltr',
    local_title: 'Македонски'
  },
  ml: {
    english_title: 'Malayalam',
    direction: 'ltr',
    local_title: 'മലയാളം'
  },
  mn: {
    english_title: 'Mongolian',
    direction: 'ltr',
    local_title: 'Монгол'
  },
  mo: {
    english_title: 'Moldovan',
    direction: 'ltr',
    local_title: 'Moldovenească'
  },
  mr: {
    english_title: 'Marathi',
    direction: 'ltr',
    local_title: 'मराठी'
  },
  ms: {
    english_title: 'Malay',
    direction: 'ltr',
    local_title: 'Bahasa'
  },
  mt: {
    english_title: 'Maltese',
    direction: 'ltr',
    local_title: 'bil-Malti'
  },
  mus: {
    english_title: 'Creek',
    direction: 'ltr',
    local_title: 'Muskogee'
  },
  my: {
    english_title: 'Burmese',
    direction: 'ltr',
    local_title: 'Myanmasa'
  },
  na: {
    english_title: 'Nauruan',
    direction: 'ltr',
    local_title: 'Dorerin'
  },
  nah: {
    english_title: 'Nahuatl',
    direction: 'ltr',
    local_title: 'Nahuatl'
  },
  nap: {
    english_title: 'Neapolitan',
    direction: 'ltr',
    local_title: 'Nnapulitano'
  },
  nd: {
    english_title: 'North',
    direction: 'Ndebele',
    local_title: 'ltr'
  },
  nds: {
    english_title: 'Low German',
    direction: 'ltr',
    local_title: 'Plattdüütsch'
  },
  'nds-nl': {
    english_title: 'Dutch',
    direction: 'Low',
    local_title: 'Saxon'
  },
  ne: {
    english_title: 'Nepali',
    direction: 'ltr',
    local_title: 'नेपाली'
  },
  new: {
    english_title: 'Newar',
    direction: 'ltr',
    local_title: 'नेपालभाषा'
  },
  ng: {
    english_title: 'Ndonga',
    direction: 'ltr',
    local_title: 'Oshiwambo'
  },
  nl: {
    english_title: 'Dutch',
    direction: 'ltr',
    local_title: 'Nederlands'
  },
  nn: {
    english_title: 'Norwegian',
    direction: 'Nynorsk',
    local_title: 'ltr'
  },
  no: {
    english_title: 'Norwegian',
    direction: 'ltr',
    local_title: 'Norsk'
  },
  nr: {
    english_title: 'South',
    direction: 'Ndebele',
    local_title: 'ltr'
  },
  nso: {
    english_title: 'Northern',
    direction: 'Sotho',
    local_title: 'ltr'
  },
  nrm: {
    english_title: 'Norman',
    direction: 'ltr',
    local_title: 'Nouormand'
  },
  nv: {
    english_title: 'Navajo',
    direction: 'ltr',
    local_title: 'Diné'
  },
  ny: {
    english_title: 'Chichewa',
    direction: 'ltr',
    local_title: 'Chi-Chewa'
  },
  oc: {
    english_title: 'Occitan',
    direction: 'ltr',
    local_title: 'Occitan'
  },
  oj: {
    english_title: 'Ojibwa',
    direction: 'ltr',
    local_title: 'ᐊᓂᔑᓈᐯᒧᐎᓐ'
  },
  om: {
    english_title: 'Oromo',
    direction: 'ltr',
    local_title: 'Oromoo'
  },
  or: {
    english_title: 'Oriya',
    direction: 'ltr',
    local_title: 'ଓଡ଼ିଆ'
  },
  os: {
    english_title: 'Ossetian',
    direction: 'ltr',
    local_title: 'Иронау'
  },
  pa: {
    english_title: 'Panjabi',
    direction: 'ltr',
    local_title: 'ਪੰਜਾਬੀ'
  },
  pag: {
    english_title: 'Pangasinan',
    direction: 'ltr',
    local_title: 'Pangasinan'
  },
  pam: {
    english_title: 'Kapampangan',
    direction: 'ltr',
    local_title: 'Kapampangan'
  },
  pap: {
    english_title: 'Papiamentu',
    direction: 'ltr',
    local_title: 'Papiamentu'
  },
  pdc: {
    english_title: 'Pennsylvania',
    direction: 'German',
    local_title: 'ltr'
  },
  pi: {
    english_title: 'Pali',
    direction: 'ltr',
    local_title: 'Pāli'
  },
  pih: {
    english_title: 'Norfolk',
    direction: 'ltr',
    local_title: 'Norfuk'
  },
  pl: {
    english_title: 'Polish',
    direction: 'ltr',
    local_title: 'Polski'
  },
  pms: {
    english_title: 'Piedmontese',
    direction: 'ltr',
    local_title: 'Piemontèis'
  },
  ps: {
    english_title: 'Pashto',
    direction: 'rtl',
    local_title: 'پښتو'
  },
  pt: {
    english_title: 'Portuguese',
    direction: 'ltr',
    local_title: 'Português'
  },
  qu: {
    english_title: 'Quechua',
    direction: 'ltr',
    local_title: 'Runa'
  },
  rm: {
    english_title: 'Raeto',
    direction: 'Romance',
    local_title: 'ltr'
  },
  rmy: {
    english_title: 'Romani',
    direction: 'ltr',
    local_title: 'Romani'
  },
  rn: {
    english_title: 'Kirundi',
    direction: 'ltr',
    local_title: 'Kirundi'
  },
  ro: {
    english_title: 'Romanian',
    direction: 'ltr',
    local_title: 'Română'
  },
  'roa-rup': {
    english_title: 'Aromanian',
    direction: 'ltr',
    local_title: 'Armâneashti'
  },
  ru: {
    english_title: 'Russian',
    direction: 'ltr',
    local_title: 'Русский'
  },
  rw: {
    english_title: 'Rwandi',
    direction: 'ltr',
    local_title: 'Kinyarwandi'
  },
  sa: {
    english_title: 'Sanskrit',
    direction: 'ltr',
    local_title: 'संस्कृतम्'
  },
  sc: {
    english_title: 'Sardinian',
    direction: 'ltr',
    local_title: 'Sardu'
  },
  scn: {
    english_title: 'Sicilian',
    direction: 'ltr',
    local_title: 'Sicilianu'
  },
  sco: {
    english_title: 'Scots',
    direction: 'ltr',
    local_title: 'Scots'
  },
  sd: {
    english_title: 'Sindhi',
    direction: 'ltr',
    local_title: 'सिनधि'
  },
  se: {
    english_title: 'Northern',
    direction: 'Sami',
    local_title: 'ltr'
  },
  sg: {
    english_title: 'Sango',
    direction: 'ltr',
    local_title: 'Sängö'
  },
  sh: {
    english_title: 'Serbo-Croatian',
    direction: 'ltr',
    local_title: 'Srpskohrvatski'
  },
  si: {
    english_title: 'Sinhalese',
    direction: 'ltr',
    local_title: 'සිංහල'
  },
  simple: {
    english_title: 'Simple',
    direction: 'English',
    local_title: 'ltr'
  },
  sk: {
    english_title: 'Slovak',
    direction: 'ltr',
    local_title: 'Slovenčina'
  },
  sl: {
    english_title: 'Slovenian',
    direction: 'ltr',
    local_title: 'Slovenščina'
  },
  sm: {
    english_title: 'Samoan',
    direction: 'ltr',
    local_title: 'Gagana'
  },
  sn: {
    english_title: 'Shona',
    direction: 'ltr',
    local_title: 'chiShona'
  },
  so: {
    english_title: 'Somalia',
    direction: 'ltr',
    local_title: 'Soomaaliga'
  },
  sq: {
    english_title: 'Albanian',
    direction: 'ltr',
    local_title: 'Shqip'
  },
  sr: {
    english_title: 'Serbian',
    direction: 'ltr',
    local_title: 'Српски'
  },
  ss: {
    english_title: 'Swati',
    direction: 'ltr',
    local_title: 'SiSwati'
  },
  st: {
    english_title: 'Southern',
    direction: 'Sotho',
    local_title: 'ltr'
  },
  su: {
    english_title: 'Sundanese',
    direction: 'ltr',
    local_title: 'Basa'
  },
  sv: {
    english_title: 'Swedish',
    direction: 'ltr',
    local_title: 'Svenska'
  },
  sw: {
    english_title: 'Swahili',
    direction: 'ltr',
    local_title: 'Kiswahili'
  },
  ta: {
    english_title: 'Tamil',
    direction: 'ltr',
    local_title: 'தமிழ்'
  },
  te: {
    english_title: 'Telugu',
    direction: 'ltr',
    local_title: 'తెలుగు'
  },
  tet: {
    english_title: 'Tetum',
    direction: 'ltr',
    local_title: 'Tetun'
  },
  tg: {
    english_title: 'Tajik',
    direction: 'ltr',
    local_title: 'Тоҷикӣ'
  },
  th: {
    english_title: 'Thai',
    direction: 'ltr',
    local_title: 'ไทย'
  },
  ti: {
    english_title: 'Tigrinya',
    direction: 'ltr',
    local_title: 'ትግርኛ'
  },
  tk: {
    english_title: 'Turkmen',
    direction: 'ltr',
    local_title: 'Туркмен'
  },
  tl: {
    english_title: 'Tagalog',
    direction: 'ltr',
    local_title: 'Tagalog'
  },
  tlh: {
    english_title: 'Klingon',
    direction: 'ltr',
    local_title: 'tlhIngan-Hol'
  },
  tn: {
    english_title: 'Tswana',
    direction: 'ltr',
    local_title: 'Setswana'
  },
  to: {
    english_title: 'Tonga',
    direction: 'ltr',
    local_title: 'Lea'
  },
  tpi: {
    english_title: 'Tok',
    direction: 'Pisin',
    local_title: 'ltr'
  },
  tr: {
    english_title: 'Turkish',
    direction: 'ltr',
    local_title: 'Türkçe'
  },
  ts: {
    english_title: 'Tsonga',
    direction: 'ltr',
    local_title: 'Xitsonga'
  },
  tt: {
    english_title: 'Tatar',
    direction: 'ltr',
    local_title: 'Tatarça'
  },
  tum: {
    english_title: 'Tumbuka',
    direction: 'ltr',
    local_title: 'chiTumbuka'
  },
  tw: {
    english_title: 'Twi',
    direction: 'ltr',
    local_title: 'Twi'
  },
  ty: {
    english_title: 'Tahitian',
    direction: 'ltr',
    local_title: 'Reo'
  },
  udm: {
    english_title: 'Udmurt',
    direction: 'ltr',
    local_title: 'Удмурт'
  },
  ug: {
    english_title: 'Uyghur',
    direction: 'ltr',
    local_title: 'Uyƣurqə'
  },
  uk: {
    english_title: 'Ukrainian',
    direction: 'ltr',
    local_title: 'Українська'
  },
  ur: {
    english_title: 'Urdu',
    direction: 'rtl',
    local_title: 'اردو'
  },
  uz: {
    english_title: 'Uzbek',
    direction: 'ltr',
    local_title: 'Ўзбек'
  },
  ve: {
    english_title: 'Venda',
    direction: 'ltr',
    local_title: 'Tshivenḓa'
  },
  vi: {
    english_title: 'Vietnamese',
    direction: 'ltr',
    local_title: 'Việtnam'
  },
  vec: {
    english_title: 'Venetian',
    direction: 'ltr',
    local_title: 'Vèneto'
  },
  vls: {
    english_title: 'West',
    direction: 'Flemish',
    local_title: 'ltr'
  },
  vo: {
    english_title: 'Volapük',
    direction: 'ltr',
    local_title: 'Volapük'
  },
  wa: {
    english_title: 'Walloon',
    direction: 'ltr',
    local_title: 'Walon'
  },
  war: {
    english_title: 'Waray-Waray',
    direction: 'ltr',
    local_title: 'Winaray'
  },
  wo: {
    english_title: 'Wolof',
    direction: 'ltr',
    local_title: 'Wollof'
  },
  xal: {
    english_title: 'Kalmyk',
    direction: 'ltr',
    local_title: 'Хальмг'
  },
  xh: {
    english_title: 'Xhosa',
    direction: 'ltr',
    local_title: 'isiXhosa'
  },
  yi: {
    english_title: 'Yiddish',
    direction: 'rtl',
    local_title: 'ייִדיש'
  },
  yo: {
    english_title: 'Yoruba',
    direction: 'ltr',
    local_title: 'Yorùbá'
  },
  za: {
    english_title: 'Zhuang',
    direction: 'ltr',
    local_title: 'Cuengh'
  },
  zh: {
    english_title: 'Chinese',
    direction: 'ltr',
    local_title: '中文'
  },
  'zh-classical': {
    english_title: 'Classical',
    direction: 'Chinese',
    local_title: 'ltr'
  },
  'zh-min-nan': {
    english_title: 'Minnan',
    direction: 'ltr',
    local_title: 'Bân-lâm-gú'
  },
  'zh-yue': {
    english_title: 'Cantonese',
    direction: 'ltr',
    local_title: '粵語'
  },
  zu: {
    english_title: 'Zulu',
    direction: 'ltr',
    local_title: 'isiZulu'
  }
};

//some colon symbols are valid links, like `America: That place`
//so we have to whitelist allowable interwiki links
const interwikis = [
  'wiktionary',
  'wikinews',
  'wikibooks',
  'wikiquote',
  'wikisource',
  'wikispecies',
  'wikiversity',
  'wikivoyage',
  'wikipedia',
  'wikimedia',
  'foundation',
  'meta',
  'metawikipedia',
  'w',
  'wikt',
  'n',
  'b',
  'q',
  's',
  'v',
  'voy',
  'wmf',
  'c',
  'm',
  'mw',
  'phab',
  'd'
];
let allowed = interwikis.reduce((h, wik) => {
  h[wik] = true;
  return h
}, {});
//add language prefixes too..
Object.keys(languages).forEach(k => (allowed[k] = true));

//this is predictably very complicated.
// https://meta.wikimedia.org/wiki/Help:Interwiki_linking
const parseInterwiki = function(obj) {
  let str = obj.page || '';
  if (str.indexOf(':') !== -1) {
    let m = str.match(/^(.*):(.*)/);
    if (m === null) {
      return obj
    }
    let site = m[1] || '';
    site = site.toLowerCase();
    //only allow interwikis to these specific places
    if (allowed.hasOwnProperty(site) === false) {
      return obj
    }
    obj.wiki = site;
    obj.page = m[2];
  }
  return obj
};
var interwiki = parseInterwiki;

// const helpers = require('../_lib/helpers');

const ignore_links = /^:?(category|catégorie|Kategorie|Categoría|Categoria|Categorie|Kategoria|تصنيف|image|file|image|fichier|datei|media):/i;
const external_link = /\[(https?|news|ftp|mailto|gopher|irc)(:\/\/[^\]\| ]{4,1500})([\| ].*?)?\]/g;
const link_reg = /\[\[(.{0,160}?)\]\]([a-z']+)?(\w{0,10})/gi; //allow dangling suffixes - "[[flanders]]'s"
// const i18n = require('../_data/i18n');
// const isFile = new RegExp('(' + i18n.images.concat(i18n.files).join('|') + '):', 'i');

const external_links = function(links, str) {
  str.replace(external_link, function(all, protocol, link, text) {
    text = text || '';
    links.push({
      type: 'external',
      site: protocol + link,
      text: text.trim()
    });
    return text
  });
  return links
};

const internal_links = function(links, str) {
  //regular links
  str.replace(link_reg, function(_, s, apostrophe) {
    var txt = null;
    //make a copy of original
    var link = s;
    if (s.match(/\|/)) {
      //replacement link [[link|text]]
      s = s.replace(/\[\[(.{2,100}?)\]\](\w{0,10})/g, '$1$2'); //remove ['s and keep suffix
      link = s.replace(/(.{2,100})\|.{0,200}/, '$1'); //replaced links
      txt = s.replace(/.{2,100}?\|/, '');
      //handle funky case of [[toronto|]]
      if (txt === null && link.match(/\|$/)) {
        link = link.replace(/\|$/, '');
        txt = link;
      }
    }
    //kill off non-wikipedia namespaces
    if (link.match(ignore_links)) {
      return s
    }
    //kill off just these just-anchor links [[#history]]
    if (link.match(/^#/i)) {
      return s
    }
    //remove anchors from end [[toronto#history]]
    var obj = {
      page: link
    };
    obj.page = obj.page.replace(/#(.*)/, (a, b) => {
      obj.anchor = b;
      return ''
    });
    //grab any fr:Paris parts
    obj = interwiki(obj);
    if (txt !== null && txt !== obj.page) {
      obj.text = txt;
    }
    //finally, support [[link]]'s apostrophe
    if (apostrophe === "'s") {
      obj.text = obj.text || obj.page;
      obj.text += apostrophe;
    }

    //titlecase it, if necessary
    if (obj.page && /^[A-Z]/.test(obj.page) === false) {
      if (!obj.text) {
        obj.text = obj.page;
      }
      obj.page = obj.page.charAt(0).toUpperCase() + obj.page.substring(1);
    }
    links.push(obj);
    return s
  });
  return links
};

//grab an array of internal links in the text
const parse_links = function(str) {
  let links = [];
  //first, parse external links
  links = external_links(links, str);
  //internal links
  links = internal_links(links, str);

  if (links.length === 0) {
    return undefined
  }
  return links
};
var parse = parse_links;

//pulls target link out of redirect page
const REDIRECT_REGEX = new RegExp(
  '^[ \n\t]*?#(' + i18n_1.redirects.join('|') + ') *?(\\[\\[.{2,180}?\\]\\])',
  'i'
);

const isRedirect = function(wiki) {
  //too long to be a redirect?
  if (!wiki || wiki.length > 500) {
    return false
  }
  return REDIRECT_REGEX.test(wiki)
};

const parse$1 = function(wiki) {
  let m = wiki.match(REDIRECT_REGEX);
  if (m && m[2]) {
    let links = parse(m[2]) || [];
    return links[0]
  }
  return {}
};

var redirects = {
  isRedirect: isRedirect,
  parse: parse$1
};

const getReg = function(templates) {
  const allowedCharacters = '(\\|[a-z, =]*?)*?';
  return new RegExp(
    '\\{\\{ ?(' + templates.join('|') + ')' + allowedCharacters + ' ?\\}\\}',
    'i'
  )
};

const templateReg = getReg(i18n_1.disambigs);

//special disambig-templates en-wikipedia uses
let d = ' disambiguation';
const english = [
  'airport',
  'biology' + d,
  'call sign' + d,
  'caselaw' + d,
  'chinese title' + d,
  'dab',
  'dab',
  'disamb',
  'disambig',
  'disambiguation cleanup',
  'genus' + d,
  'geodis',
  'hndis',
  'hospital' + d,
  'lake index',
  'letter' + d,
  'letter-number combination' + d,
  'mathematical' + d,
  'military unit' + d,
  'mountainindex',
  'number' + d,
  'phonetics' + d,
  'place name' + d,
  'place name' + d,
  'portal' + d,
  'road' + d,
  'school' + d,
  'setindex',
  'ship index',
  'species latin name abbreviation' + d,
  'species latin name' + d,
  'split dab',
  'sport index',
  'station' + d,
  'synagogue' + d,
  'taxonomic authority' + d,
  'taxonomy' + d,
  'wp disambig'
];
const enDisambigs = getReg(english);

const isDisambig = function(wiki) {
  //test for {{disambiguation}} templates
  if (templateReg.test(wiki) === true) {
    return true
  }
  //more english-centric disambiguation templates

  //{{hndis}}, etc
  if (enDisambigs.test(wiki) === true) {
    return true
  }

  //try 'may refer to' on first line for en-wiki?
  // let firstLine = wiki.match(/^.+?\n/);
  // if (firstLine !== null && firstLine[0]) {
  //   if (/ may refer to/i.test(firstLine) === true) {
  //     return true;
  //   }
  // }
  return false
};

var disambig = {
  isDisambig: isDisambig
};

//okay, i know you're not supposed to regex html, but...
//https://en.wikipedia.org/wiki/Help:HTML_in_wikitext

//these are things we throw-away
//these will mess-up if they're nested, but they're not usually.
const ignore = [
  'table',
  'code',
  'score',
  'data',
  'categorytree',
  'charinsert',
  'hiero',
  'imagemap',
  'inputbox',
  'nowiki',
  'poem',
  'references',
  'source',
  'syntaxhighlight',
  'timeline'
];
const openTag = `< ?(${ignore.join('|')}) ?[^>]{0,200}?>`;
const closeTag = `< ?/ ?(${ignore.join('|')}) ?>`;
const anyChar = '\\s\\S'; //including newline
const noThanks = new RegExp(`${openTag}[${anyChar}]+?${closeTag}`, 'ig');

const kill_xml = function(wiki) {
  //(<ref> tags are parsed in Section class) - luckily, refs can't be recursive.
  //types of html/xml that we want to trash completely.
  wiki = wiki.replace(noThanks, ' ');
  //some xml-like fragments we can also kill
  wiki = wiki.replace(/ ?< ?(span|div|table|data) [a-zA-Z0-9=%\.#:;'" ]{2,100}\/? ?> ?/g, ' '); //<ref name="asd">
  //only kill ref tags if they are selfclosing
  wiki = wiki.replace(/ ?< ?(ref) [a-zA-Z0-9=" ]{2,100}\/ ?> ?/g, ' '); //<ref name="asd"/>
  //some formatting xml, we'll keep their insides though
  wiki = wiki.replace(
    / ?<[ \/]?(p|sub|sup|span|nowiki|div|table|br|tr|td|th|pre|pre2|hr)[ \/]?> ?/g,
    ' '
  ); //<sub>, </sub>
  wiki = wiki.replace(
    / ?<[ \/]?(abbr|bdi|bdo|blockquote|cite|del|dfn|em|i|ins|kbd|mark|q|s)[ \/]?> ?/g,
    ' '
  ); //<abbr>, </abbr>
  wiki = wiki.replace(/ ?<[ \/]?h[0-9][ \/]?> ?/g, ' '); //<h2>, </h2>
  wiki = wiki.replace(/ ?< ?br ?\/> ?/g, '\n'); //<br />
  return wiki.trim()
};
var kill_xml_1 = kill_xml;

//this mostly-formatting stuff can be cleaned-up first, to make life easier
function preProcess(r, wiki, options) {
  //remove comments
  wiki = wiki.replace(/<!--[\s\S]{0,2000}?-->/g, '');
  wiki = wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/gi, '');
  //signitures
  wiki = wiki.replace(/~~{1,3}/g, '');
  //windows newlines
  wiki = wiki.replace(/\r/g, '');
  //japanese periods - '。'
  wiki = wiki.replace(/\u3002/g, '. ');
  //horizontal rule
  wiki = wiki.replace(/----/g, '');
  //formatting for templates-in-templates...
  wiki = wiki.replace(/\{\{\}\}/g, ' – ');
  wiki = wiki.replace(/\{\{\\\}\}/g, ' / ');
  //space
  wiki = wiki.replace(/&nbsp;/g, ' ');
  //give it the inglorious send-off it deserves..
  wiki = kill_xml_1(wiki);
  //({{template}},{{template}}) leaves empty parentheses
  wiki = wiki.replace(/\([,;: ]+?\)/g, '');
  //these templates just screw things up, too
  wiki = wiki.replace(/{{(baseball|basketball) (primary|secondary) (style|color).*?\}\}/i, '');
  return wiki
}
var preProcess_1 = preProcess;

// dumpster-dive throws everything into mongodb  - github.com/spencermountain/dumpster-dive
// mongo has some opinions about what characters are allowed as keys and ids.
//https://stackoverflow.com/questions/12397118/mongodb-dot-in-key-name/30254815#30254815
const specialChar = /[\\\.$]/;

const encodeStr = function(str) {
  if (typeof str !== 'string') {
    str = '';
  }
  str = str.replace(/\\/g, '\\\\');
  str = str.replace(/^\$/, '\\u0024');
  str = str.replace(/\./g, '\\u002e');
  return str
};

const encodeObj = function(obj = {}) {
  let keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i += 1) {
    if (specialChar.test(keys[i]) === true) {
      let str = encodeStr(keys[i]);
      if (str !== keys[i]) {
        obj[str] = obj[keys[i]];
        delete obj[keys[i]];
      }
    }
  }
  return obj
};

var encode = {
  encodeObj: encodeObj
};

const defaults$4 = {
  headers: true,
  depth: true,
  paragraphs: true,
  images: true,
  tables: true,
  templates: true,
  infoboxes: true,
  lists: true,
  references: true
};
//
const toJSON$1 = function(section, options) {
  options = setDefaults_1(options, defaults$4);
  let data = {};
  if (options.headers === true) {
    data.title = section.title();
  }
  if (options.depth === true) {
    data.depth = section.depth;
  }
  //these return objects
  if (options.paragraphs === true) {
    let paragraphs = section.paragraphs().map(p => p.json(options));
    if (paragraphs.length > 0) {
      data.paragraphs = paragraphs;
    }
  }
  //image json data
  if (options.images === true) {
    let images = section.images().map(img => img.json(options));
    if (images.length > 0) {
      data.images = images;
    }
  }
  //table json data
  if (options.tables === true) {
    let tables = section.tables().map(t => t.json(options));
    if (tables.length > 0) {
      data.tables = tables;
    }
  }
  //template json data
  if (options.templates === true) {
    let templates = section.templates();
    if (templates.length > 0) {
      data.templates = templates;
      //encode them, for mongodb
      if (options.encode === true) {
        data.templates.forEach(t => encode.encodeObj(t));
      }
    }
  }
  //infobox json data
  if (options.infoboxes === true) {
    let infoboxes = section.infoboxes().map(i => i.json(options));
    if (infoboxes.length > 0) {
      data.infoboxes = infoboxes;
    }
  }
  //list json data
  if (options.lists === true) {
    let lists = section.lists().map(list => list.json(options));
    if (lists.length > 0) {
      data.lists = lists;
    }
  }
  //list references - default true
  if (options.references === true || options.citations === true) {
    let references = section.references().map(ref => ref.json(options));
    if (references.length > 0) {
      data.references = references;
    }
  }
  //default off
  if (options.sentences === true) {
    data.sentences = section.sentences().map(s => s.json(options));
  }
  return data
};
var toJson$2 = toJSON$1;

const defaults$5 = {
  tables: true,
  references: true,
  paragraphs: true,
  templates: true,
  infoboxes: true
};

//the stuff between headings - 'History' section for example
const Section = function(data) {
  this.depth = data.depth;
  this.doc = null;
  this._title = data.title || '';
  Object.defineProperty(this, 'doc', {
    enumerable: false,
    value: null
  });
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

const methods$2 = {
  title: function() {
    return this._title || ''
  },
  index: function() {
    if (!this.doc) {
      return null
    }
    let index = this.doc.sections().indexOf(this);
    if (index === -1) {
      return null
    }
    return index
  },
  indentation: function() {
    return this.depth
  },
  sentences: function(n) {
    let arr = this.paragraphs().reduce((list, p) => {
      return list.concat(p.sentences())
    }, []);
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr || []
  },
  paragraphs: function(n) {
    let arr = this.data.paragraphs || [];
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr || []
  },
  paragraph: function(n) {
    let arr = this.data.paragraphs || [];
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr[0]
  },
  links: function(n) {
    let arr = [];
    this.infoboxes().forEach(templ => {
      templ.links(n).forEach(link => arr.push(link));
    });
    this.sentences().forEach(s => {
      s.links(n).forEach(link => arr.push(link));
    });
    this.tables().forEach(t => {
      t.links(n).forEach(link => arr.push(link));
    });
    this.lists().forEach(list => {
      list.links(n).forEach(link => arr.push(link));
    });
    if (typeof n === 'number') {
      return arr[n]
    } else if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it
      let link = arr.find(o => o.page() === n);
      return link === undefined ? [] : [link]
    }
    return arr
  },
  tables: function(clue) {
    let arr = this.data.tables || [];
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr
  },
  templates: function(clue) {
    let arr = this.data.templates || [];
    arr = arr.map(t => t.json());
    if (typeof clue === 'number') {
      return arr[clue]
    }
    if (typeof clue === 'string') {
      clue = clue.toLowerCase();
      return arr.filter(o => o.template === clue || o.name === clue)
    }
    return arr
  },
  infoboxes: function(clue) {
    let arr = this.data.infoboxes || [];
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr
  },
  coordinates: function(clue) {
    let arr = [].concat(this.templates('coord'), this.templates('coor'));
    if (typeof clue === 'number') {
      if (!arr[clue]) {
        return []
      }
      return arr[clue]
    }
    return arr
  },
  lists: function(clue) {
    let arr = [];
    this.paragraphs().forEach(p => {
      arr = arr.concat(p.lists());
    });
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr
  },
  interwiki(num) {
    let arr = [];
    this.paragraphs().forEach(p => {
      arr = arr.concat(p.interwiki());
    });
    if (typeof num === 'number') {
      return arr[num]
    }
    return arr || []
  },
  images: function(clue) {
    let arr = [];
    this.paragraphs().forEach(p => {
      arr = arr.concat(p.images());
    });
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr || []
  },
  references: function(clue) {
    let arr = this.data.references || [];
    if (typeof clue === 'number') {
      return arr[clue]
    }
    return arr
  },

  //transformations
  remove: function() {
    if (!this.doc) {
      return null
    }
    let bads = {};
    bads[this.title()] = true;
    //remove children too
    this.children().forEach(sec => (bads[sec.title()] = true));
    let arr = this.doc.data.sections;
    arr = arr.filter(sec => bads.hasOwnProperty(sec.title()) !== true);
    this.doc.data.sections = arr;
    return this.doc
  },

  //move-around sections like in jquery
  nextSibling: function() {
    if (!this.doc) {
      return null
    }
    let sections = this.doc.sections();
    let index = this.index();
    for (let i = index + 1; i < sections.length; i += 1) {
      if (sections[i].depth < this.depth) {
        return null
      }
      if (sections[i].depth === this.depth) {
        return sections[i]
      }
    }
    return null
  },
  lastSibling: function() {
    if (!this.doc) {
      return null
    }
    let sections = this.doc.sections();
    let index = this.index();
    return sections[index - 1] || null
  },
  children: function(n) {
    if (!this.doc) {
      return null
    }

    let sections = this.doc.sections();
    let index = this.index();
    let children = [];
    //(immediately preceding sections with higher depth)
    if (sections[index + 1] && sections[index + 1].depth > this.depth) {
      for (let i = index + 1; i < sections.length; i += 1) {
        if (sections[i].depth > this.depth) {
          children.push(sections[i]);
        } else {
          break
        }
      }
    }
    if (typeof n === 'string') {
      n = n.toLowerCase();
      // children.forEach((c) => console.log(c));
      return children.find(s => s.title().toLowerCase() === n)
    }
    if (typeof n === 'number') {
      return children[n]
    }
    return children
  },
  parent: function() {
    if (!this.doc) {
      return null
    }
    let sections = this.doc.sections();
    let index = this.index();
    for (let i = index; i >= 0; i -= 1) {
      if (sections[i] && sections[i].depth < this.depth) {
        return sections[i]
      }
    }
    return null
  },
  text: function(options) {
    options = setDefaults_1(options, defaults$5);
    let pList = this.paragraphs();
    pList = pList.map(p => p.text(options));
    return pList.join('\n\n')
  },
  json: function(options) {
    options = setDefaults_1(options, defaults$5);
    return toJson$2(this, options)
  }
};
//aliases
methods$2.next = methods$2.nextSibling;
methods$2.last = methods$2.lastSibling;
methods$2.previousSibling = methods$2.lastSibling;
methods$2.previous = methods$2.lastSibling;
methods$2.citations = methods$2.references;
methods$2.sections = methods$2.children;
Object.keys(methods$2).forEach(k => {
  Section.prototype[k] = methods$2[k];
});
//add alises, too
Object.keys(aliases).forEach(k => {
  Section.prototype[k] = methods$2[aliases[k]];
});
var Section_1 = Section;

var helpers = {
  capitalise: function(str) {
    if (str && typeof str === 'string') {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
    return ''
  },
  onlyUnique: function(value, index, self) {
    return self.indexOf(value) === index
  },
  trim_whitespace: function(str) {
    if (str && typeof str === 'string') {
      str = str.replace(/^\s\s*/, '');
      str = str.replace(/\s\s*$/, '');
      str = str.replace(/ {2}/, ' ');
      str = str.replace(/\s, /, ', ');
      return str
    }
    return ''
  }
};
var helpers_1 = helpers;

const Link = function(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};
const methods$3 = {
  text: function() {
    return this.data.text
  },
  json: function() {
    return this.data
  },
  page: function() {
    return this.data.page
  },
  anchor: function() {
    return this.data.anchor
  },
  wiki: function() {
    return this.data.wiki
  },
  site: function() {
    return this.data.site
  },
  type: function() {
    return this.data.type
  }
};
Object.keys(methods$3).forEach(k => {
  Link.prototype[k] = methods$3[k];
});
var Link_1 = Link;

const cat_reg = new RegExp(
  '\\[\\[:?(' + i18n_1.categories.join('|') + '):[^\\]\\]]{2,80}\\]\\]',
  'gi'
);

//return only rendered text of wiki links
const removeLinks = function(line) {
  // categories, images, files
  line = line.replace(cat_reg, '');
  // [[Common links]]
  line = line.replace(/\[\[:?([^|]{1,80}?)\]\](\w{0,5})/g, '$1$2');
  // [[File:with|Size]]
  line = line.replace(/\[\[File:(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, '$1');
  // [[Replaced|Links]]
  line = line.replace(/\[\[:?(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, '$2$3');
  // External links
  line = line.replace(
    /\[(https?|news|ftp|mailto|gopher|irc):\/\/[^\]\| ]{4,1500}([\| ].*?)?\]/g,
    '$2'
  );
  return line
};
// console.log(resolve_links("[http://www.whistler.ca www.whistler.ca]"))

const getLinks = function(wiki, data) {
  let links = parse(wiki) || [];
  data.links = links.map(link => new Link_1(link));
  wiki = removeLinks(wiki);
  return wiki
};
var link = getLinks;

//handle the bold/italics
const formatting = function(obj) {
  let bolds = [];
  let italics = [];
  let wiki = obj.text || '';
  //bold and italics combined 5 's
  wiki = wiki.replace(/'''''(.{0,200}?)'''''/g, (a, b) => {
    bolds.push(b);
    italics.push(b);
    return b
  });
  //''''four'''' → bold with quotes
  wiki = wiki.replace(/''''(.{0,200}?)''''/g, (a, b) => {
    bolds.push(`'${b}'`);
    return `'${b}'`
  });
  //'''bold'''
  wiki = wiki.replace(/'''(.{0,200}?)'''/g, (a, b) => {
    bolds.push(b);
    return b
  });
  //''italic''
  wiki = wiki.replace(/''(.{0,200}?)''/g, (a, b) => {
    italics.push(b);
    return b
  });

  //pack it all up..
  obj.text = wiki;
  if (bolds.length > 0) {
    obj.fmt = obj.fmt || {};
    obj.fmt.bold = bolds;
  }
  if (italics.length > 0) {
    obj.fmt = obj.fmt || {};
    obj.fmt.italic = italics;
  }
  return obj
};
var formatting_1 = formatting;

const isNumber = /^[0-9,.]+$/;

const defaults$6 = {
  text: true,
  links: true,
  formatting: true,
  dates: true,
  numbers: true
};

const toJSON$2 = function(s, options) {
  options = setDefaults_1(options, defaults$6);
  let data = {};
  let text = s.plaintext();
  if (options.text === true) {
    data.text = text;
  }
  //add number field
  if (options.numbers === true && isNumber.test(text)) {
    let num = Number(text.replace(/,/g, ''));
    if (isNaN(num) === false) {
      data.number = num;
    }
  }
  if (options.links && s.links().length > 0) {
    data.links = s.links();
  }
  if (options.formatting && s.data.fmt) {
    data.formatting = s.data.fmt;
  }
  if (options.dates && s.data.dates !== undefined) {
    data.dates = s.data.dates;
  }
  return data
};
var toJson$3 = toJSON$2;

//where we store the formatting, link, date information
const Sentence = function(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

const methods$4 = {
  links: function(n) {
    let arr = this.data.links || [];
    if (typeof n === 'number') {
      return arr[n]
    } else if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it
      let link = arr.find(o => o.page === n);
      return link === undefined ? [] : [link]
    }
    return arr
  },
  interwiki: function(n) {
    let arr = this.links().filter(l => l.wiki !== undefined);
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr
  },
  bolds: function(n) {
    let arr = [];
    if (this.data && this.data.fmt && this.data.fmt.bold) {
      arr = this.data.fmt.bold || [];
    }
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr
  },
  italics: function(n) {
    let arr = [];
    if (this.data && this.data.fmt && this.data.fmt.italic) {
      arr = this.data.fmt.italic || [];
    }
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr
  },
  dates: function(n) {
    let arr = [];
    if (this.data && this.data.dates) {
      arr = this.data.dates || [];
    }
    if (typeof n === 'number') {
      return arr[n]
    }
    return arr
  },
  text: function(str) {
    if (str !== undefined && typeof str === 'string') {
      //set the text?
      this.data.text = str;
    }
    return this.data.text || ''
  },
  json: function(options) {
    return toJson$3(this, options)
  }
};

Object.keys(methods$4).forEach(k => {
  Sentence.prototype[k] = methods$4[k];
});
//add alises, too
Object.keys(aliases).forEach(k => {
  Sentence.prototype[k] = methods$4[aliases[k]];
});
Sentence.prototype.italic = Sentence.prototype.italics;
Sentence.prototype.bold = Sentence.prototype.bolds;
Sentence.prototype.plaintext = Sentence.prototype.text;

var Sentence_1 = Sentence;

//these are used for the sentence-splitter
var abbreviations = [
  'jr',
  'mr',
  'mrs',
  'ms',
  'dr',
  'prof',
  'sr',
  'sen',
  'corp',
  'calif',
  'rep',
  'gov',
  'atty',
  'supt',
  'det',
  'rev',
  'col',
  'gen',
  'lt',
  'cmdr',
  'adm',
  'capt',
  'sgt',
  'cpl',
  'maj',
  'dept',
  'univ',
  'assn',
  'bros',
  'inc',
  'ltd',
  'co',
  'corp',
  'arc',
  'al',
  'ave',
  'blvd',
  'cl',
  'ct',
  'cres',
  'exp',
  'rd',
  'st',
  'dist',
  'mt',
  'ft',
  'fy',
  'hwy',
  'la',
  'pd',
  'pl',
  'plz',
  'tce',
  'Ala',
  'Ariz',
  'Ark',
  'Cal',
  'Calif',
  'Col',
  'Colo',
  'Conn',
  'Del',
  'Fed',
  'Fla',
  'Ga',
  'Ida',
  'Id',
  'Ill',
  'Ind',
  'Ia',
  'Kan',
  'Kans',
  'Ken',
  'Ky',
  'La',
  'Me',
  'Md',
  'Mass',
  'Mich',
  'Minn',
  'Miss',
  'Mo',
  'Mont',
  'Neb',
  'Nebr',
  'Nev',
  'Mex',
  'Okla',
  'Ok',
  'Ore',
  'Penna',
  'Penn',
  'Pa',
  'Dak',
  'Tenn',
  'Tex',
  'Ut',
  'Vt',
  'Va',
  'Wash',
  'Wis',
  'Wisc',
  'Wy',
  'Wyo',
  'USAFA',
  'Alta',
  'Ont',
  'QuÔøΩ',
  'Sask',
  'Yuk',
  'jan',
  'feb',
  'mar',
  'apr',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
  'sept',
  'vs',
  'etc',
  'esp',
  'llb',
  'md',
  'bl',
  'phd',
  'ma',
  'ba',
  'miss',
  'misses',
  'mister',
  'sir',
  'esq',
  'mstr',
  'lit',
  'fl',
  'ex',
  'eg',
  'sep',
  'sept'
];

//split text into sentences, using regex
//@spencermountain MIT

//(Rule-based sentence boundary segmentation) - chop given text into its proper sentences.
// Ignore periods/questions/exclamations used in acronyms/abbreviations/numbers, etc.
// @spencermountain 2015 MIT

const abbreviations$1 = abbreviations.concat('[^]][^]]');
const abbrev_reg = new RegExp("(^| |')(" + abbreviations$1.join('|') + `)[.!?] ?$`, 'i');
const acronym_reg = new RegExp("[ |.|'|[][A-Z].? *?$", 'i');
const elipses_reg = new RegExp('\\.\\.\\.* +?$');
const hasWord = new RegExp('[a-zа-яぁ-ゟ][a-zа-яぁ-ゟ゠-ヿ]', 'iu');
// 3040-309F : hiragana
// 30A0-30FF : katakana

//turn a nested array into one array
const flatten = function(arr) {
  let all = [];
  arr.forEach(function(a) {
    all = all.concat(a);
  });
  return all
};

const naiive_split = function(text) {
  //first, split by newline
  let splits = text.split(/(\n+)/);
  splits = splits.filter(s => s.match(/\S/));
  //split by period, question-mark, and exclamation-mark
  splits = splits.map(function(str) {
    return str.split(/(\S.+?[.!?]"?)(?=\s+|$)/g) //\u3002
  });
  return flatten(splits)
};

// if this looks like a period within a wikipedia link, return false
const isBalanced = function(str) {
  str = str || '';
  const open = str.split(/\[\[/) || [];
  const closed = str.split(/\]\]/) || [];
  if (open.length > closed.length) {
    return false
  }
  //make sure quotes are closed too
  const quotes = str.match(/"/g);
  if (quotes && quotes.length % 2 !== 0 && str.length < 900) {
    return false
  }
  return true
};

const sentence_parser = function(text) {
  let sentences = [];
  //first do a greedy-split..
  let chunks = [];
  //ensure it 'smells like' a sentence
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return sentences
  }
  // This was the splitter regex updated to fix quoted punctuation marks.
  // let splits = text.split(/(\S.+?[.\?!])(?=\s+|$|")/g);
  // todo: look for side effects in this regex replacement:
  let splits = naiive_split(text);
  //filter-out the grap ones
  for (let i = 0; i < splits.length; i++) {
    let s = splits[i];
    if (!s || s === '') {
      continue
    }
    //this is meaningful whitespace
    if (!s.match(/\S/)) {
      //add it to the last one
      if (chunks[chunks.length - 1]) {
        chunks[chunks.length - 1] += s;
        continue
      } else if (splits[i + 1]) {
        //add it to the next one
        splits[i + 1] = s + splits[i + 1];
        continue
      }
    }
    chunks.push(s);
  }

  //detection of non-sentence chunks
  const isSentence = function(hmm) {
    if (hmm.match(abbrev_reg) || hmm.match(acronym_reg) || hmm.match(elipses_reg)) {
      return false
    }
    //too short? - no consecutive letters
    if (hasWord.test(hmm) === false) {
      return false
    }
    if (!isBalanced(hmm)) {
      return false
    }
    return true
  };
  //loop through these chunks, and join the non-sentence chunks back together..
  for (let i = 0; i < chunks.length; i++) {
    //should this chunk be combined with the next one?
    if (chunks[i + 1] && !isSentence(chunks[i])) {
      chunks[i + 1] = chunks[i] + (chunks[i + 1] || ''); //.replace(/ +/g, ' ');
    } else if (chunks[i] && chunks[i].length > 0) {
      //this chunk is a proper sentence..
      sentences.push(chunks[i]);
      chunks[i] = '';
    }
  }
  //if we never got a sentence, return the given text
  if (sentences.length === 0) {
    return [text]
  }
  return sentences
};

var parse$2 = sentence_parser;

// const templates = require('./templates');


function postprocess(line) {
  //remove empty parentheses (sometimes caused by removing templates)
  line = line.replace(/\([,;: ]*\)/g, '');
  //these semi-colons in parentheses are particularly troublesome
  line = line.replace(/\( *(; ?)+/g, '(');
  //dangling punctuation
  line = helpers_1.trim_whitespace(line);
  line = line.replace(/ +\.$/, '.');
  return line
}

function oneSentence(str) {
  let obj = {};
  //pull-out the [[links]]
  str = link(str, obj);
  obj.text = postprocess(str);

  // let links = parseLinks(str)
  // if (links) {
  // obj.links = links
  // }
  //pull-out the bolds and ''italics''
  obj = formatting_1(obj);
  //pull-out things like {{start date|...}}
  // obj = templates(obj);
  return new Sentence_1(obj)
}

//turn a text into an array of sentence objects
const parseSentences = function(wiki) {
  let sentences = parse$2(wiki);
  sentences = sentences.map(oneSentence);

  //remove :indented first line, as it is often a disambiguation
  if (sentences[0] && sentences[0].text() && sentences[0].text()[0] === ':') {
    sentences = sentences.slice(1);
  }
  return sentences
};

//used for consistency with other class-definitions
const addSentences = function(wiki, data) {
  data.sentences = parseSentences(wiki);
  return wiki
};

var _04Sentence = {
  parseSentences: parseSentences,
  oneSentence: oneSentence,
  addSentences: addSentences
};

//remove the top/bottom off the template
const strip = function(tmpl) {
  tmpl = tmpl.replace(/^\{\{/, '');
  tmpl = tmpl.replace(/\}\}$/, '');
  return tmpl
};
var _strip = strip;

//normalize template names
const fmtName = function(name) {
  name = (name || '').trim();
  name = name.toLowerCase();
  name = name.replace(/_/g, ' ');
  return name
};
var _fmtName = fmtName;

//turn {{name|one|two|three}} into [name, one, two, three]
const pipeSplitter = function(tmpl) {
  //start with a naiive '|' split
  let arr = tmpl.split(/\n?\|/);
  //we've split by '|', which is pretty lame
  //look for broken-up links and fix them :/
  arr.forEach((a, i) => {
    if (a === null) {
      return
    }
    //has '[[' but no ']]'
    //has equal number of openning and closing tags. handle nested case '[[[[' ']]'
    if (/\[\[[^\]]+$/.test(a) || /\{\{[^\}]+$/.test(a)
    || 
      (a.split('{{').length !== a.split('}}').length)
      || (a.split('[[').length !== a.split(']]').length)
    ) {
      arr[i + 1] = arr[i] + '|' + arr[i + 1];
      arr[i] = null;
    }
  });
  //cleanup any mistakes we've made
  arr = arr.filter(a => a !== null);
  arr = arr.map(a => (a || '').trim());
  //remove empty fields, only at the end:
  for (let i = arr.length - 1; i >= 0; i -= 1) {
    if (arr[i] === '') {
      arr.pop();
    }
    break
  }
  return arr
};
var _01PipeSplitter = pipeSplitter;

// every value in {{tmpl|a|b|c}} needs a name
// here we come up with names for them
const hasKey = /^[a-z0-9\u00C0-\u00FF\._\- '()œ]+=/iu;

//templates with these properties are asking for trouble
const reserved = {
  template: true,
  list: true,
  prototype: true
};

//turn 'key=val' into {key:key, val:val}
const parseKey = function(str) {
  let parts = str.split('=');
  let key = parts[0] || '';
  key = key.toLowerCase().trim();
  let val = parts.slice(1).join('=');
  //don't let it be called 'template'..
  if (reserved.hasOwnProperty(key)) {
    key = '_' + key;
  }
  return {
    key: key,
    val: val.trim()
  }
};

//turn [a, b=v, c] into {'1':a, b:v, '2':c}
const keyMaker = function(arr, order) {
  let o = 0;
  return arr.reduce((h, str) => {
    str = (str || '').trim();
    //support named keys - 'foo=bar'
    if (hasKey.test(str) === true) {
      let res = parseKey(str);
      if (res.key) {
        h[res.key] = res.val;
        return h
      }
    }
    //try a key from given 'order' names
    if (order && order[o]) {
      let key = order[o]; //here goes!
      h[key] = str;
    } else {
      h.list = h.list || [];
      h.list.push(str);
    }
    o += 1;
    return h
  }, {})
};

var _02KeyMaker = keyMaker;

const whoCares = {
  classname: true,
  style: true,
  align: true,
  margin: true,
  left: true,
  break: true,
  boxsize: true,
  framestyle: true,
  item_style: true,
  collapsible: true,
  list_style_type: true,
  'list-style-type': true,
  colwidth: true
};

//remove wiki-cruft & some styling info from templates
const cleanup = function(obj) {
  Object.keys(obj).forEach(k => {
    if (whoCares[k.toLowerCase()] === true) {
      delete obj[k];
    }
    //remove empty values, too
    if (obj[k] === null || obj[k] === '') {
      delete obj[k];
    }
  });
  return obj
};
var _03Cleanup = cleanup;

//remove the top/bottom off the template


const parseSentence = _04Sentence.oneSentence;




// most templates just want plaintext...
const makeFormat = function(str, fmt) {
  let s = parseSentence(str);
  //support various output formats
  if (fmt === 'json') {
    return s.json()
  } else if (fmt === 'raw') {
    return s
  }
  //default to flat text
  return s.text()
};

//
const parser = function(tmpl, order, fmt) {
  order = order || [];
  //renomove {{}}'s
  tmpl = _strip(tmpl || '');
  let arr = _01PipeSplitter(tmpl);
  //get template name
  let name = arr.shift();
  //name each value
  let obj = _02KeyMaker(arr, order);
  //remove wiki-junk
  obj = _03Cleanup(obj);
  //is this a infobox/reference?
  // let known = isKnown(obj);

  //using '|1=content' is an escaping-thing..
  if (obj['1'] && order[0] && obj.hasOwnProperty(order[0]) === false) {
    //move it over..
    obj[order[0]] = obj['1'];
    delete obj['1'];
  }

  Object.keys(obj).forEach(k => {
    if (k === 'list') {
      obj[k] = obj[k].map(v => makeFormat(v, fmt));
      return
    }
    obj[k] = makeFormat(obj[k], fmt);
  });
  //add the template name
  if (name) {
    obj.template = _fmtName(name);
  }
  return obj
};
var parse$3 = parser;

//also called 'citations'
const Reference = function(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

const methods$5 = {
  title: function() {
    let data = this.data;
    return data.title || data.encyclopedia || data.author || ''
  },
  links: function(n) {
    let arr = [];
    if (typeof n === 'number') {
      return arr[n]
    }
    //grab a specific link..
    if (typeof n === 'number') {
      return arr[n]
    } else if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it
      let link = arr.find(o => o.page() === n);
      return link === undefined ? [] : [link]
    }
    return arr || []
  },
  text: function() {
    return '' //nah, skip these.
  },

  json: function() {
    return this.data
  }
};
Object.keys(methods$5).forEach(k => {
  Reference.prototype[k] = methods$5[k];
});
var Reference_1 = Reference;

// const parse = require('../../templates/wikipedia/page').citation;
const parseSentence$1 = _04Sentence.oneSentence;


//structured Cite templates - <ref>{{Cite..</ref>
const hasCitation = function(str) {
  return (
    /^ *?\{\{ *?(cite|citation)/i.test(str) &&
    /\}\} *?$/.test(str) &&
    /citation needed/i.test(str) === false
  )
};

const parseCitation = function(tmpl) {
  let obj = parse$3(tmpl);
  obj.type = obj.template.replace(/cite /, '');
  obj.template = 'citation';
  return obj
};

//handle unstructured ones - <ref>some text</ref>
const parseInline = function(str) {
  let obj = parseSentence$1(str) || {};
  return {
    template: 'citation',
    type: 'inline',
    data: {},
    inline: obj
  }
};

// parse <ref></ref> xml tags
const parseRefs = function(wiki, data) {
  let references = [];
  wiki = wiki.replace(/ ?<ref>([\s\S]{0,1800}?)<\/ref> ?/gi, function(a, tmpl) {
    if (hasCitation(tmpl)) {
      let obj = parseCitation(tmpl);
      if (obj) {
        references.push(obj);
      }
      wiki = wiki.replace(tmpl, '');
    } else {
      references.push(parseInline(tmpl));
    }
    return ' '
  });
  // <ref name=""/>
  wiki = wiki.replace(/ ?<ref [^>]{0,200}?\/> ?/gi, ' ');
  // <ref name=""></ref>
  wiki = wiki.replace(/ ?<ref [^>]{0,200}?>([\s\S]{0,1800}?)<\/ref> ?/gi, function(a, tmpl) {
    if (hasCitation(tmpl)) {
      let obj = parseCitation(tmpl);
      if (obj) {
        references.push(obj);
      }
      wiki = wiki.replace(tmpl, '');
    } else {
      references.push(parseInline(tmpl));
    }
    return ' '
  });
  //now that we're done with xml, do a generic + dangerous xml-tag removal
  wiki = wiki.replace(/ ?<[ \/]?[a-z0-9]{1,8}[a-z0-9=" ]{2,20}[ \/]?> ?/g, ' '); //<samp name="asd">
  data.references = references.map(r => new Reference_1(r));
  return wiki
};
var reference = parseRefs;

const parseSentence$2 = _04Sentence.oneSentence;

const heading_reg = /^(={1,5})(.{1,200}?)={1,5}$/;

//interpret depth, title of headings like '==See also=='
const parseHeading = function(data, str) {
  let heading = str.match(heading_reg);
  if (!heading) {
    data.title = '';
    data.depth = 0;
    return data
  }
  let title = heading[2] || '';
  title = parseSentence$2(title).text();
  //amazingly, you can see inline {{templates}} in this text, too
  //... let's not think about that now.
  title = title.replace(/\{\{.+?\}\}/, '');
  //same for references (i know..)
  title = reference(title, {});
  //trim leading/trailing whitespace
  title = helpers_1.trim_whitespace(title);
  let depth = 0;
  if (heading[1]) {
    depth = heading[1].length - 2;
  }
  data.title = title;
  data.depth = depth;
  return data
};
var heading = parseHeading;

//remove top-bottoms
const cleanup$1 = function(lines) {
  lines = lines.filter(line => {
    //a '|+' row is a 'table caption', remove it.
    return line && /^\|\+/.test(line) !== true
  });
  if (/^{\|/.test(lines[0]) === true) {
    lines.shift();
  }
  if (/^\|}/.test(lines[lines.length - 1]) === true) {
    lines.pop();
  }
  if (/^\|-/.test(lines[0]) === true) {
    lines.shift();
  }
  return lines
};

//turn newline seperated into '|-' seperated
const findRows = function(lines) {
  let rows = [];
  let row = [];
  lines = cleanup$1(lines);
  for (let i = 0; i < lines.length; i += 1) {
    let line = lines[i];
    //'|-' is a row-seperator
    if (/^\|-/.test(line) === true) {
      //okay, we're done the row
      if (row.length > 0) {
        rows.push(row);
        row = [];
      }
    } else {
      //look for '||' inline row-splitter
      line = line.split(/(?:\|\||!!)/);
      //support newline -> '||'
      if (!line[0] && line[1]) {
        line.shift();
      }
      line.forEach(l => {
        l = l.replace(/^\| */, '');
        l = l.trim();
        row.push(l);
      });
    }
  }
  //finish the last one
  if (row.length > 0) {
    rows.push(row);
  }
  return rows
};
var _findRows = findRows;

const getRowSpan = /.*rowspan *?= *?["']?([0-9]+)["']?[ \|]*/;
const getColSpan = /.*colspan *?= *?["']?([0-9]+)["']?[ \|]*/;

//colspans stretch ←left/right→
const doColSpan = function(rows) {
  rows.forEach((row, r) => {
    row.forEach((str, c) => {
      let m = str.match(getColSpan);
      if (m !== null) {
        let num = parseInt(m[1], 10);

        //...maybe if num is so big, and centered, remove it?
        if (num > 3) {
          rows[r] = [];
          return
        }
        //splice-in n empty columns right here
        row[c] = str.replace(getColSpan, '');
        for (let i = 1; i < num; i += 1) {
          row.splice(c + 1, 0, '');
        }
      }
    });
  });
  rows = rows.filter(r => r.length > 0);
  return rows
};

//colspans stretch up/down
const doRowSpan = function(rows) {
  rows.forEach((row, r) => {
    row.forEach((str, c) => {
      let m = str.match(getRowSpan);
      if (m !== null) {
        let num = parseInt(m[1], 10);
        //copy this cell down n rows
        str = str.replace(getRowSpan, '');
        row[c] = str;
        for (let i = r + 1; i < r + num; i += 1) {
          if (!rows[i]) {
            break
          }
          rows[i].splice(c, 0, str);
        }
      }
    });
  });
  return rows
};

//
const handleSpans = function(rows) {
  rows = doRowSpan(rows);
  rows = doColSpan(rows);
  return rows
};
var _spans = handleSpans;

const parseSentence$3 = _04Sentence.oneSentence;



//common ones
const headings = {
  name: true,
  age: true,
  born: true,
  date: true,
  year: true,
  city: true,
  country: true,
  population: true,
  count: true,
  number: true
};

//additional table-cruft to remove before parseLine method
const cleanText = function(str) {
  str = parseSentence$3(str).text();
  //anything before a single-pipe is styling, so remove it
  if (str.match(/\|/)) {
    str = str.replace(/.+\| ?/, ''); //class="unsortable"|title
  }
  str = str.replace(/style=['"].*?["']/, '');
  //'!' is used as a highlighed-column
  str = str.replace(/^!/, '');
  str = str.trim();
  return str
};

//'!' starts a header-row
const findHeaders = function(rows = []) {
  let headers = [];
  let first = rows[0];
  if (first && first[0] && /^!/.test(first[0]) === true) {
    headers = first.map(h => {
      h = h.replace(/^\! */, '');
      h = cleanText(h);
      return h
    });
    rows.shift();
  }
  //try the second row, too (overwrite first-row, if it exists)
  first = rows[0];
  if (first && first[0] && first[1] && /^!/.test(first[0]) && /^!/.test(first[1])) {
    first.forEach((h, i) => {
      h = h.replace(/^\! */, '');
      h = cleanText(h);
      if (Boolean(h) === true) {
        headers[i] = h;
      }
    });
    rows.shift();
  }
  return headers
};

//turn headers, array into an object
const parseRow = function(arr, headers) {
  let row = {};
  arr.forEach((str, i) => {
    let h = headers[i] || 'col' + (i + 1);
    let s = parseSentence$3(str);
    s.text(cleanText(s.text()));
    row[h] = s;
  });
  return row
};

//should we use the first row as a the headers?
const firstRowHeader = function(rows) {
  if (rows.length <= 3) {
    return []
  }
  let headers = rows[0].slice(0);
  headers = headers.map(h => {
    h = h.replace(/^\! */, '');
    h = parseSentence$3(h).text();
    h = cleanText(h);
    h = h.toLowerCase();
    return h
  });
  for (let i = 0; i < headers.length; i += 1) {
    if (headings.hasOwnProperty(headers[i])) {
      rows.shift();
      return headers
    }
  }
  return []
};

//turn a {|...table string into an array of arrays
const parseTable = function(wiki) {
  let lines = wiki
    .replace(/\r/g, '')
    .replace(/\n(\s*[^|!{\s])/g, ' $1') //remove unecessary newlines
    .split(/\n/)
    .map(l => l.trim());
  let rows = _findRows(lines);
  //support colspan, rowspan...
  rows = _spans(rows);
  //grab the header rows
  let headers = findHeaders(rows);
  if (!headers || headers.length <= 1) {
    headers = firstRowHeader(rows);
    let want = rows[rows.length - 1] || [];
    //try the second row
    if (headers.length <= 1 && want.length > 2) {
      headers = firstRowHeader(rows.slice(1));
      if (headers.length > 0) {
        rows = rows.slice(2); //remove them
      }
    }
  }
  //index each column by it's header
  let table = rows.map(arr => {
    return parseRow(arr, headers)
  });
  return table
};

var parse$4 = parseTable;

//
const toJson$4 = function(tables, options) {
  return tables.map(table => {
    let row = {};
    Object.keys(table).forEach(k => {
      row[k] = table[k].json(); //(they're sentence objects)
    });
    //encode them, for mongodb
    if (options.encode === true) {
      row = encode.encodeObj(row);
    }
    return row
  })
};
var toJson_1$1 = toJson$4;

const defaults$7 = {};

const Table = function(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

const methods$6 = {
  links(n) {
    let links = [];
    this.data.forEach(r => {
      Object.keys(r).forEach(k => {
        links = links.concat(r[k].links());
      });
    });
    //grab a specific link..
    if (typeof n === 'number') {
      return links[n]
    } else if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it
      let link = links.find(o => o.page() === n);
      return link === undefined ? [] : [link]
    }
    return links
  },
  keyValue(options) {
    let rows = this.json(options);
    rows.forEach(row => {
      Object.keys(row).forEach(k => {
        row[k] = row[k].text;
      });
    });
    return rows
  },
  json(options) {
    options = setDefaults_1(options, defaults$7);
    return toJson_1$1(this.data, options)
  },

  text() {
    return ''
  }
};
methods$6.keyvalue = methods$6.keyValue;
methods$6.keyval = methods$6.keyValue;

Object.keys(methods$6).forEach(k => {
  Table.prototype[k] = methods$6[k];
});
//add alises, too
Object.keys(aliases).forEach(k => {
  Table.prototype[k] = methods$6[aliases[k]];
});
var Table_1 = Table;

// const table_reg = /\{\|[\s\S]+?\|\}/g; //the largest-cities table is ~70kchars.
const openReg = /^\s*{\|/;
const closeReg = /^\s*\|}/;

//tables can be recursive, so looky-here.
const findTables = function(section, wiki) {
  let list = [];
  let lines = wiki.split('\n');
  let stack = [];
  for (let i = 0; i < lines.length; i += 1) {
    //start a table
    if (openReg.test(lines[i]) === true) {
      stack.push(lines[i]);
      continue
    }
    //close a table
    if (closeReg.test(lines[i]) === true) {
      stack[stack.length - 1] += '\n' + lines[i];
      let table = stack.pop();
      list.push(table);
      continue
    }
    //keep-going on one
    if (stack.length > 0) {
      stack[stack.length - 1] += '\n' + lines[i];
    }
  }
  //work-em together for a Table class
  let tables = [];
  list.forEach(str => {
    if (str) {
      //also reremove a newline at the end of the table (awkward)
      wiki = wiki.replace(str + '\n', '');
      wiki = wiki.replace(str, '');
      let data = parse$4(str);
      if (data && data.length > 0) {
        tables.push(new Table_1(data));
      }
    }
  });

  if (tables.length > 0) {
    section.tables = tables;
  }
  return wiki
};

var table = findTables;

const defaults$8 = {
  sentences: true
};

const toJson$5 = function(p, options) {
  options = setDefaults_1(options, defaults$8);
  let data = {};
  if (options.sentences === true) {
    data.sentences = p.sentences().map(s => s.json(options));
  }
  return data
};
var toJson_1$2 = toJson$5;

const defaults$9 = {
  sentences: true,
  lists: true,
  images: true
};

const Paragraph = function(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

const methods$7 = {
  sentences: function(num) {
    if (typeof num === 'number') {
      return this.data.sentences[num]
    }
    return this.data.sentences || []
  },
  references: function(num) {
    if (typeof num === 'number') {
      return this.data.references[num]
    }
    return this.data.references
  },
  lists: function(num) {
    if (typeof num === 'number') {
      return this.data.lists[num]
    }
    return this.data.lists
  },
  images(num) {
    if (typeof num === 'number') {
      return this.data.images[num]
    }
    return this.data.images || []
  },
  links: function(n) {
    let arr = [];
    this.sentences().forEach(s => {
      arr = arr.concat(s.links(n));
    });
    if (typeof n === 'number') {
      return arr[n]
    } else if (typeof n === 'string') {
      //grab a specific link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it
      let link = arr.find(o => o.page() === n);
      return link === undefined ? [] : [link]
    }
    return arr || []
  },
  interwiki(num) {
    let arr = [];
    this.sentences().forEach(s => {
      arr = arr.concat(s.interwiki());
    });
    if (typeof num === 'number') {
      return arr[num]
    }
    return arr || []
  },
  text: function(options) {
    options = setDefaults_1(options, defaults$9);
    let str = this.sentences()
      .map(s => s.text(options))
      .join(' ');
    this.lists().forEach(list => {
      str += '\n' + list.text();
    });
    return str
  },
  json: function(options) {
    options = setDefaults_1(options, defaults$9);
    return toJson_1$2(this, options)
  }
};
methods$7.citations = methods$7.references;
Object.keys(methods$7).forEach(k => {
  Paragraph.prototype[k] = methods$7[k];
});
var Paragraph_1 = Paragraph;

//find all the pairs of '[[...[[..]]...]]' in the text
//used to properly root out recursive template calls, [[.. [[...]] ]]
//basically just adds open tags, and subtracts closing tags
function find_recursive(opener, closer, text) {
  var out = [];
  var last = [];
  const chars = text.split('');
  var open = 0;
  for (var i = 0; i < chars.length; i++) {
    const c = text[i];
    //increment open tag
    if (c === opener) {
      open += 1;
    }
    //decrement close tag
    else if (c === closer) {
      open -= 1;
      if (open < 0) {
        open = 0;
      }
    } else if (last.length === 0) {
      // If we're not inside of a pair of delimiters, we can discard the current letter.
      // The return of this function is only used to extract images.
      continue
    }

    last.push(c);
    if (open === 0 && last.length > 0) {
      //first, fix botched parse
      var open_count = 0;
      var close_count = 0;
      for (var j = 0; j < last.length; j++) {
        if (last[j] === opener) {
          open_count++;
        } else if (last[j] === closer) {
          close_count++;
        }
      }
      //is it botched?
      if (open_count > close_count) {
        last.push(closer);
      }
      //looks good, keep it
      out.push(last.join(''));
      last = [];
    }
  }
  return out
}
var recursive_match = find_recursive;

const parseSentence$4 = _04Sentence.oneSentence;
//regexes:
const isFile = new RegExp('(' + i18n_1.images.concat(i18n_1.files).join('|') + '):', 'i');
let fileNames = `(${i18n_1.images.concat(i18n_1.files).join('|')})`;
const file_reg = new RegExp(fileNames + ':(.+?)[\\||\\]]', 'iu');

//style directives for Wikipedia:Extended_image_syntax
const imgLayouts = {
  thumb: true,
  thumbnail: true,
  border: true,
  right: true,
  left: true,
  center: true,
  top: true,
  bottom: true,
  none: true,
  upright: true,
  baseline: true,
  middle: true,
  sub: true,
  super: true
};

//images are usually [[image:my_pic.jpg]]
const oneImage = function(img) {
  let m = img.match(file_reg);
  if (m === null || !m[2]) {
    return null
  }
  let file = `${m[1]}:${m[2] || ''}`;
  file = file.trim();
  //titlecase it
  let title = file.charAt(0).toUpperCase() + file.substring(1);
  //spaces to underscores
  title = title.replace(/ /g, '_');
  if (title) {
    let obj = {
      file: file
    };
    //try to grab other metadata, too
    img = img.replace(/^\[\[/, '');
    img = img.replace(/\]\]$/, '');

    //https://en.wikipedia.org/wiki/Wikipedia:Extended_image_syntax
    // - [[File:Name|Type|Border|Location|Alignment|Size|link=Link|alt=Alt|lang=Langtag|Caption]]
    let imgData = parse$3(img);
    let arr = imgData.list || [];
    //parse-out alt text, if explicitly given
    if (imgData.alt) {
      obj.alt = imgData.alt;
    }
    //remove 'thumb' and things
    arr = arr.filter(str => imgLayouts.hasOwnProperty(str) === false);
    if (arr[arr.length - 1]) {
      obj.caption = parseSentence$4(arr[arr.length - 1]);
    }
    return new Image_1(obj, img)
  }
  return null
};

const parseImages = function(matches, r, wiki) {
  matches.forEach(function(s) {
    if (isFile.test(s) === true) {
      r.images = r.images || [];
      let img = oneImage(s);
      if (img) {
        r.images.push(img);
      }
      wiki = wiki.replace(s, '');
    }
  });
  return wiki
};
var image = parseImages;

const defaults$a = {};

const toText = (list, options) => {
  return list
    .map(s => {
      let str = s.text(options);
      return ' * ' + str
    })
    .join('\n')
};

const List = function(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

const methods$8 = {
  lines() {
    return this.data
  },
  links(n) {
    let links = [];
    this.lines().forEach(s => {
      links = links.concat(s.links());
    });
    if (typeof n === 'number') {
      return links[n]
    } else if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it
      let link = links.find(o => o.page() === n);
      return link === undefined ? [] : [link]
    }
    return links
  },
  json(options) {
    options = setDefaults_1(options, defaults$a);
    return this.lines().map(s => s.json(options))
  },
  text() {
    return toText(this.data)
  }
};

Object.keys(methods$8).forEach(k => {
  List.prototype[k] = methods$8[k];
});
//add alises, too
Object.keys(aliases).forEach(k => {
  List.prototype[k] = methods$8[aliases[k]];
});
var List_1 = List;

const parseSentence$5 = _04Sentence.oneSentence;
const list_reg = /^[#\*:;\|]+/;
const bullet_reg = /^\*+[^:,\|]{4}/;
const number_reg = /^ ?\#[^:,\|]{4}/;
const has_word = /[a-z_0-9\]\}]/i;

// does it start with a bullet point or something?
const isList = function(line) {
  return list_reg.test(line) || bullet_reg.test(line) || number_reg.test(line)
};

//make bullets/numbers into human-readable *'s
const cleanList = function(list) {
  let number = 1;
  list = list.filter(l => l);
  for (var i = 0; i < list.length; i++) {
    var line = list[i];
    //add # numberings formatting
    if (line.match(number_reg)) {
      line = line.replace(/^ ?#*/, number + ') ');
      line = line + '\n';
      number += 1;
    } else if (line.match(list_reg)) {
      number = 1;
      line = line.replace(list_reg, '');
    }
    list[i] = parseSentence$5(line);
  }
  return list
};

const grabList = function(lines, i) {
  let sub = [];
  for (let o = i; o < lines.length; o++) {
    if (isList(lines[o])) {
      sub.push(lines[o]);
    } else {
      break
    }
  }
  sub = sub.filter(a => a && has_word.test(a));
  sub = cleanList(sub);
  return sub
};

const parseList = function(wiki, data) {
  let lines = wiki.split(/\n/g);
  // lines = lines.filter(l => has_word.test(l));
  let lists = [];
  let theRest = [];
  for (let i = 0; i < lines.length; i++) {
    if (isList(lines[i]) && lines[i + 1] && isList(lines[i + 1])) {
      let sub = grabList(lines, i);
      if (sub.length > 0) {
        lists.push(sub);
        i += sub.length - 1;
      }
    } else {
      theRest.push(lines[i]);
    }
  }
  data.lists = lists.map(l => new List_1(l));
  wiki = theRest.join('\n');
  return wiki
};
var list = parseList;

const parseSentences$1 = _04Sentence.addSentences;

const twoNewLines = /\r?\n\r?\n/;
const parse$5 = {
  image: image,
  list: list
};

const parseParagraphs = function(wiki) {
  let pList = wiki.split(twoNewLines);
  //don't create empty paragraphs
  pList = pList.filter(p => p && p.trim().length > 0);
  pList = pList.map(str => {
    let data = {
      lists: [],
      sentences: [],
      images: []
    };
    //parse the lists
    str = parse$5.list(str, data);
    //parse+remove scary '[[ [[]] ]]' stuff
    let matches = recursive_match('[', ']', str);
    // parse images
    str = parse$5.image(matches, data, str);
    //parse the sentences
    parseSentences$1(str, data);
    return new Paragraph_1(data)
  });
  return {
    paragraphs: pList,
    wiki: wiki
  }
};
var _03Paragraph = parseParagraphs;

//turn an infobox into some nice json
const toJson$6 = function(infobox, options) {
  let json = Object.keys(infobox.data).reduce((h, k) => {
    if (infobox.data[k]) {
      h[k] = infobox.data[k].json();
    }
    return h
  }, {});

  //support mongo-encoding keys
  if (options.encode === true) {
    json = encode.encodeObj(json);
  }
  return json
};
var toJson_1$3 = toJson$6;

//a formal key-value data table about a topic
const Infobox = function(obj) {
  this._type = obj.type;
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: obj.data
  });
};

const methods$9 = {
  type: function() {
    return this._type
  },
  links: function(n) {
    let arr = [];
    Object.keys(this.data).forEach(k => {
      this.data[k].links().forEach(l => arr.push(l));
    });
    if (typeof n === 'number') {
      return arr[n]
    } else if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it
      let link = arr.find(o => o.page() === n);
      return link === undefined ? [] : [link]
    }
    return arr
  },
  image: function() {
    let s = this.get('image') || this.get('image2');
    if (!s) {
      return null
    }
    let obj = s.json();
    obj.file = obj.text;
    obj.text = '';
    return new Image_1(obj)
  },
  get: function(key = '') {
    key = key.toLowerCase();
    let keys = Object.keys(this.data);
    for (let i = 0; i < keys.length; i += 1) {
      let tmp = keys[i].toLowerCase().trim();
      if (key === tmp) {
        return this.data[keys[i]]
      }
    }
    return null
  },
  text: function() {
    return ''
  },
  json: function(options) {
    options = options || {};
    return toJson_1$3(this, options)
  },
  keyValue: function() {
    return Object.keys(this.data).reduce((h, k) => {
      if (this.data[k]) {
        h[k] = this.data[k].text();
      }
      return h
    }, {})
  }
};
//aliases

Object.keys(methods$9).forEach(k => {
  Infobox.prototype[k] = methods$9[k];
});
//add alises, too
Object.keys(aliases).forEach(k => {
  Infobox.prototype[k] = methods$9[aliases[k]];
});
Infobox.prototype.data = Infobox.prototype.keyValue;
Infobox.prototype.template = Infobox.prototype.type;
Infobox.prototype.images = Infobox.prototype.image;
var Infobox_1 = Infobox;

const open = '{';
const close = '}';

//grab all first-level recursions of '{{...}}'
const findFlat = function(wiki) {
  let depth = 0;
  let list = [];
  let carry = [];
  for (
    var i = wiki.indexOf(open);
    i !== -1 && i < wiki.length;
    depth > 0 ? i++ : (i = wiki.indexOf(open, i + 1))
  ) {
    let c = wiki[i];
    //open it
    if (c === open) {
      depth += 1;
    }
    //close it
    if (depth > 0) {
      if (c === close) {
        depth -= 1;
        if (depth === 0) {
          carry.push(c);
          let tmpl = carry.join('');
          carry = [];
          //last check
          if (/\{\{/.test(tmpl) && /\}\}/.test(tmpl)) {
            list.push(tmpl);
          }
          continue
        }
      }
      //require two '{{' to open it
      if (depth === 1 && c !== open && c !== close) {
        depth = 0;
        carry = [];
        continue
      }
      carry.push(c);
    }
  }
  return list
};

//get all nested templates
const findNested = function(top) {
  let deep = [];
  top.forEach(str => {
    if (/\{\{/.test(str.substr(2)) === true) {
      str = _strip(str);
      findFlat(str).forEach(o => {
        if (o) {
          deep.push(o);
        }
      });
    }
  });
  return deep
};

const getTemplates = function(wiki) {
  let list = findFlat(wiki);
  return {
    top: list,
    nested: findNested(list)
  }
};

var _getTemplates = getTemplates;

const Template = function(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};
const methods$a = {
  text: function() {
    return ''
  },
  json: function() {
    return this.data
  }
};
Object.keys(methods$a).forEach(k => {
  Template.prototype[k] = methods$a[k];
});
var Template_1 = Template;

//we explicitly ignore these, because they sometimes have resolve some data
const list$1 = [
  //https://en.wikipedia.org/wiki/category:templates_with_no_visible_output
  'anchor',
  'defaultsort',
  'use list-defined references',
  'void',
  //https://en.wikipedia.org/wiki/Category:Protection_templates
  'pp',
  'pp-move-indef',
  'pp-semi-indef',
  'pp-vandalism',
  //https://en.wikipedia.org/wiki/Template:R
  'r',
  //out-of-scope still - https://en.wikipedia.org/wiki/Template:Tag
  '#tag',
  //https://en.wikipedia.org/wiki/Template:Navboxes
  'navboxes',
  'reflist',
  'ref-list',
  'div col',
  'authority control',
  //https://en.wikipedia.org/wiki/Template:Citation_needed
  // 'better source',
  // 'citation needed',
  // 'clarify',
  // 'cite quote',
  // 'dead link',
  // 'by whom',
  // 'dubious',
  // 'when',
  // 'who',
  // 'quantify',
  // 'refimprove',
  // 'weasel inline',
  //https://en.wikipedia.org/wiki/Template:End
  'pope list end',
  'shipwreck list end',
  'starbox end',
  'end box',
  'end',
  's-end'
];
const ignore$1 = list$1.reduce((h, str) => {
  h[str] = true;
  return h
}, {});
var _ignore = ignore$1;

//get the name of the template
//templates are usually '{{name|stuff}}'
const getName = function(tmpl) {
  let name = null;
  //{{name|foo}}
  if (/^\{\{[^\n]+\|/.test(tmpl)) {
    name = (tmpl.match(/^\{\{(.+?)\|/) || [])[1];
  } else if (tmpl.indexOf('\n') !== -1) {
    // {{name \n...
    name = (tmpl.match(/^\{\{(.+?)\n/) || [])[1];
  } else {
    //{{name here}}
    name = (tmpl.match(/^\{\{(.+?)\}\}$/) || [])[1];
  }
  if (name) {
    name = name.replace(/:.*/, '');
    name = _fmtName(name);
  }
  return name || null
};
// console.log(templateName('{{name|foo}}'));
// console.log(templateName('{{name here}}'));
// console.log(templateName('{{CITE book |title=the killer and the cartoons }}'));
// console.log(templateName(`{{name
// |key=val}}`));
var _getName = getName;

const i18nReg = new RegExp('^(subst.)?(' + i18n_1.infoboxes.join('|') + ')[: \n]', 'i');
//some looser ones
const startReg = /^infobox /i;
const endReg = / infobox$/i;
const yearIn = /$Year in [A-Z]/i;

//some known ones from
// https://en.wikipedia.org/wiki/Wikipedia:List_of_infoboxes
// and https://en.wikipedia.org/wiki/Category:Infobox_templates
const known = {
  'gnf protein box': true,
  'automatic taxobox': true,
  'chembox ': true,
  editnotice: true,
  geobox: true,
  hybridbox: true,
  ichnobox: true,
  infraspeciesbox: true,
  mycomorphbox: true,
  oobox: true,
  'paraphyletic group': true,
  speciesbox: true,
  subspeciesbox: true,
  'starbox short': true,
  taxobox: true,
  nhlteamseason: true,
  'asian games bid': true,
  'canadian federal election results': true,
  'dc thomson comic strip': true,
  'daytona 24 races': true,
  edencharacter: true,
  'moldova national football team results': true,
  samurai: true,
  protein: true,
  'sheet authority': true,
  'order-of-approx': true,
  'bacterial labs': true,
  'medical resources': true,
  ordination: true,
  'hockey team coach': true,
  'hockey team gm': true,
  'hockey team player': true,
  'hockey team start': true,
  mlbbioret: true
};
//
const isInfobox = function(name) {
  // known
  if (known.hasOwnProperty(name) === true) {
    return true
  }
  if (i18nReg.test(name)) {
    return true
  }
  if (startReg.test(name) || endReg.test(name)) {
    return true
  }
  //these are also infoboxes: 'Year in Belarus'
  if (yearIn.test(name)) {
    return true
  }
  return false
};

//turns template data into good inforbox data
const fmtInfobox = function(obj = {}) {
  let m = obj.template.match(i18nReg);
  let type = obj.template;
  if (m && m[0]) {
    type = type.replace(m[0], '');
  }
  type = type.trim();
  let infobox = {
    template: 'infobox',
    type: type,
    data: obj
  };
  delete infobox.data.template; // already have this.
  delete infobox.data.list; //just in case!
  return infobox
};

var _infobox = {
  isInfobox: isInfobox,
  format: fmtInfobox
};

var _months = [
  undefined, //1-based months.. :/
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

//assorted parsing methods for date/time templates


const monthName = _months.reduce((h, str, i) => {
  if (i === 0) {
    return h
  }
  h[str.toLowerCase()] = i;
  return h
}, {});

//parse year|month|date numbers
const ymd = function(arr) {
  let obj = {};
  let units = ['year', 'month', 'date', 'hour', 'minute', 'second'];
  //parse each unit in sequence..
  for (let i = 0; i < units.length; i += 1) {
    //skip it
    if (!arr[i] && arr[1] !== 0) {
      continue
    }
    let num = parseInt(arr[i], 10);
    if (isNaN(num) === false) {
      obj[units[i]] = num; //we good.
    } else if (units[i] === 'month' && monthName.hasOwnProperty(arr[i])) {
      //try for month-name, like 'january
      let month = monthName[arr[i]];
      obj[units[i]] = month;
    } else {
      //we dead. so skip this unit
      delete obj[units[i]];
    }
  }
  //try for timezone,too ftw
  let last = arr[arr.length - 1] || '';
  last = String(last);
  if (last.toLowerCase() === 'z') {
    obj.tz = 'UTC';
  } else if (/[+-][0-9]+:[0-9]/.test(last)) {
    obj.tz = arr[6];
  }
  return obj
};

//zero-pad a number
const pad = function(num) {
  if (num < 10) {
    return '0' + num
  }
  return String(num)
};

const toText$1 = function(date) {
  //eg '1995'
  let str = String(date.year || '');
  if (date.month !== undefined && _months.hasOwnProperty(date.month) === true) {
    if (date.date === undefined) {
      //January 1995
      str = `${_months[date.month]} ${date.year}`;
    } else {
      //January 5, 1995
      str = `${_months[date.month]} ${date.date}, ${date.year}`;
      //add times, if available
      if (date.hour !== undefined && date.minute !== undefined) {
        let time = `${pad(date.hour)}:${pad(date.minute)}`;
        if (date.second !== undefined) {
          time = time + ':' + pad(date.second);
        }
        str = time + ', ' + str;
        //add timezone, if there, at the end in brackets
      }
      if (date.tz) {
        str += ` (${date.tz})`;
      }
    }
  }
  return str
};

var _format = {
  toText: toText$1,
  ymd: ymd
};

const misc = {
  reign: tmpl => {
    let order = ['start', 'end'];
    let obj = parse$3(tmpl, order);
    return `(r. ${obj.start} – ${obj.end})`
  },
  circa: tmpl => {
    let obj = parse$3(tmpl, ['year']);
    return `c. ${obj.year}`
  },
  //we can't do timezones, so fake this one a little bit
  //https://en.wikipedia.org/wiki/Template:Time
  time: () => {
    let d = new Date();
    let obj = _format.ymd([d.getFullYear(), d.getMonth(), d.getDate()]);
    return _format.toText(obj)
  },
  monthname: tmpl => {
    let obj = parse$3(tmpl, ['num']);
    return _months[obj.num] || ''
  },
  //https://en.wikipedia.org/wiki/Template:OldStyleDate
  oldstyledate: tmpl => {
    let order = ['date', 'year'];
    let obj = parse$3(tmpl, order);
    let str = obj.date;
    if (obj.year) {
      str += ' ' + obj.year;
    }
    return str
  }
};
var misc_1 = misc;

//this is allowed to be rough
const day = 1000 * 60 * 60 * 24;
const month = day * 30;
const year = day * 365;

const getEpoch = function(obj) {
  return new Date(`${obj.year}-${obj.month || 0}-${obj.date || 1}`).getTime()
};

//very rough!
const delta = function(from, to) {
  from = getEpoch(from);
  to = getEpoch(to);
  let diff = to - from;
  let obj = {};
  //get years
  let years = Math.floor(diff / year, 10);
  if (years > 0) {
    obj.years = years;
    diff -= obj.years * year;
  }
  //get months
  let months = Math.floor(diff / month, 10);
  if (months > 0) {
    obj.months = months;
    diff -= obj.months * month;
  }
  //get days
  let days = Math.floor(diff / day, 10);
  if (days > 0) {
    obj.days = days;
    // diff -= (obj.days * day);
  }
  return obj
};

var _delta = delta;

const ymd$1 = _format.ymd;
const toText$2 = _format.toText;

//wrap it up as a template
const template = function(date) {
  return {
    template: 'date',
    data: date
  }
};

const getBoth = function(tmpl) {
  tmpl = _strip(tmpl);
  let arr = tmpl.split('|');
  let from = ymd$1(arr.slice(1, 4));
  let to = arr.slice(4, 7);
  //assume now, if 'to' is empty
  if (to.length === 0) {
    let d = new Date();
    to = [d.getFullYear(), d.getMonth(), d.getDate()];
  }
  to = ymd$1(to);
  return {
    from: from,
    to: to
  }
};

const parsers = {
  //generic {{date|year|month|date}} template
  date: (tmpl, r) => {
    let order = ['year', 'month', 'date', 'hour', 'minute', 'second', 'timezone'];
    let obj = parse$3(tmpl, order);
    let data = ymd$1([obj.year, obj.month, obj.date || obj.day]);
    obj.text = toText$2(data); //make the replacement string
    if (obj.timezone) {
      if (obj.timezone === 'Z') {
        obj.timezone = 'UTC';
      }
      obj.text += ` (${obj.timezone})`;
    }
    if (obj.hour && obj.minute) {
      if (obj.second) {
        obj.text = `${obj.hour}:${obj.minute}:${obj.second}, ` + obj.text;
      } else {
        obj.text = `${obj.hour}:${obj.minute}, ` + obj.text;
      }
    }
    if (obj.text) {
      r.templates.push(template(obj));
    }
    return obj.text
  },

  //support parsing of 'February 10, 1992'
  natural_date: (tmpl, r) => {
    let order = ['text'];
    let obj = parse$3(tmpl, order);
    let str = obj.text || '';
    // - just a year
    let date = {};
    if (/^[0-9]{4}$/.test(str)) {
      date.year = parseInt(str, 10);
    } else {
      //parse the date, using the js date object (for now?)
      let txt = str.replace(/[a-z]+\/[a-z]+/i, '');
      txt = txt.replace(/[0-9]+:[0-9]+(am|pm)?/i, '');
      let d = new Date(txt);
      if (isNaN(d.getTime()) === false) {
        date.year = d.getFullYear();
        date.month = d.getMonth() + 1;
        date.date = d.getDate();
      }
    }
    r.templates.push(template(date));
    return str.trim()
  },

  //just grab the first value, and assume it's a year
  one_year: (tmpl, r) => {
    let order = ['year'];
    let obj = parse$3(tmpl, order);
    let year = Number(obj.year);
    r.templates.push(
      template({
        year: year
      })
    );
    return String(year)
  },

  //assume 'y|m|d' | 'y|m|d' // {{BirthDeathAge|B|1976|6|6|1990|8|8}}
  two_dates: (tmpl, r) => {
    let order = [
      'b',
      'birth_year',
      'birth_month',
      'birth_date',
      'death_year',
      'death_month',
      'death_date'
    ];
    let obj = parse$3(tmpl, order);
    //'b' means show birth-date, otherwise show death-date
    if (obj.b && obj.b.toLowerCase() === 'b') {
      let date = ymd$1([obj.birth_year, obj.birth_month, obj.birth_date]);
      r.templates.push(template(date));
      return toText$2(date)
    }
    let date = ymd$1([obj.death_year, obj.death_month, obj.death_date]);
    r.templates.push(template(date));
    return toText$2(date)
  },

  age: tmpl => {
    let d = getBoth(tmpl);
    let diff = _delta(d.from, d.to);
    return diff.years || 0
  },

  'diff-y': tmpl => {
    let d = getBoth(tmpl);
    let diff = _delta(d.from, d.to);
    if (diff.years === 1) {
      return diff.years + ' year'
    }
    return (diff.years || 0) + ' years'
  },
  'diff-ym': tmpl => {
    let d = getBoth(tmpl);
    let diff = _delta(d.from, d.to);
    let arr = [];
    if (diff.years === 1) {
      arr.push(diff.years + ' year');
    } else if (diff.years && diff.years !== 0) {
      arr.push(diff.years + ' years');
    }
    if (diff.months === 1) {
      arr.push('1 month');
    } else if (diff.months && diff.months !== 0) {
      arr.push(diff.months + ' months');
    }
    return arr.join(', ')
  },
  'diff-ymd': tmpl => {
    let d = getBoth(tmpl);
    let diff = _delta(d.from, d.to);
    let arr = [];
    if (diff.years === 1) {
      arr.push(diff.years + ' year');
    } else if (diff.years && diff.years !== 0) {
      arr.push(diff.years + ' years');
    }
    if (diff.months === 1) {
      arr.push('1 month');
    } else if (diff.months && diff.months !== 0) {
      arr.push(diff.months + ' months');
    }
    if (diff.days === 1) {
      arr.push('1 day');
    } else if (diff.days && diff.days !== 0) {
      arr.push(diff.days + ' days');
    }
    return arr.join(', ')
  },
  'diff-yd': tmpl => {
    let d = getBoth(tmpl);
    let diff = _delta(d.from, d.to);
    let arr = [];
    if (diff.years === 1) {
      arr.push(diff.years + ' year');
    } else if (diff.years && diff.years !== 0) {
      arr.push(diff.years + ' years');
    }
    //ergh...
    diff.days += (diff.months || 0) * 30;
    if (diff.days === 1) {
      arr.push('1 day');
    } else if (diff.days && diff.days !== 0) {
      arr.push(diff.days + ' days');
    }
    return arr.join(', ')
  },
  'diff-d': tmpl => {
    let d = getBoth(tmpl);
    let diff = _delta(d.from, d.to);
    let arr = [];
    //ergh...
    diff.days += (diff.years || 0) * 365;
    diff.days += (diff.months || 0) * 30;
    if (diff.days === 1) {
      arr.push('1 day');
    } else if (diff.days && diff.days !== 0) {
      arr.push(diff.days + ' days');
    }
    return arr.join(', ')
  }
};
var parsers_1 = parsers;

//not all too fancy - used in {{timesince}}
const timeSince = function(str) {
  let d = new Date(str);
  if (isNaN(d.getTime())) {
    return ''
  }
  let now = new Date();
  let delta = now.getTime() - d.getTime();
  let predicate = 'ago';
  if (delta < 0) {
    predicate = 'from now';
    delta = Math.abs(delta);
  }
  //figure out units
  let hours = delta / 1000 / 60 / 60;
  let days = hours / 24;
  if (days < 365) {
    return parseInt(days, 10) + ' days ' + predicate
  }
  let years = days / 365;
  return parseInt(years, 10) + ' years ' + predicate
};
var _timeSince = timeSince;

const date = parsers_1.date;
const natural_date = parsers_1.natural_date;

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//date- templates we support
let dateTmpl = Object.assign({}, misc_1, {
  currentday: () => {
    let d = new Date();
    return String(d.getDate())
  },
  currentdayname: () => {
    let d = new Date();
    return days[d.getDay()]
  },
  currentmonth: () => {
    let d = new Date();
    return months[d.getMonth()]
  },
  currentyear: () => {
    let d = new Date();
    return String(d.getFullYear())
  },
  monthyear: () => {
    let d = new Date();
    return months[d.getMonth()] + ' ' + d.getFullYear()
  },
  'monthyear-1': () => {
    let d = new Date();
    d.setMonth(d.getMonth() - 1);
    return months[d.getMonth()] + ' ' + d.getFullYear()
  },
  'monthyear+1': () => {
    let d = new Date();
    d.setMonth(d.getMonth() + 1);
    return months[d.getMonth()] + ' ' + d.getFullYear()
  },
  //Explictly-set dates - https://en.wikipedia.org/wiki/Template:Date
  date: tmpl => {
    let order = ['date', 'fmt'];
    return parse$3(tmpl, order).date
  },
  'time ago': tmpl => {
    let order = ['date', 'fmt'];
    let time = parse$3(tmpl, order).date;
    return _timeSince(time)
  },
  //https://en.wikipedia.org/wiki/Template:Birth_date_and_age
  'birth date and age': (tmpl, r) => {
    let order = ['year', 'month', 'day'];
    let obj = parse$3(tmpl, order);
    //support 'one property' version
    if (obj.year && /[a-z]/i.test(obj.year)) {
      return natural_date(tmpl, r)
    }
    r.templates.push(obj);
    obj = _format.ymd([obj.year, obj.month, obj.day]);
    return _format.toText(obj)
  },
  'birth year and age': (tmpl, r) => {
    let order = ['birth_year', 'birth_month'];
    let obj = parse$3(tmpl, order);
    //support 'one property' version
    if (obj.death_year && /[a-z]/i.test(obj.death_year)) {
      return natural_date(tmpl, r)
    }
    r.templates.push(obj);
    let age = new Date().getFullYear() - parseInt(obj.birth_year, 10);
    obj = _format.ymd([obj.birth_year, obj.birth_month]);
    let str = _format.toText(obj);
    if (age) {
      str += ` (age ${age})`;
    }
    return str
  },
  'death year and age': (tmpl, r) => {
    let order = ['death_year', 'birth_year', 'death_month'];
    let obj = parse$3(tmpl, order);
    //support 'one property' version
    if (obj.death_year && /[a-z]/i.test(obj.death_year)) {
      return natural_date(tmpl, r)
    }
    r.templates.push(obj);
    obj = _format.ymd([obj.death_year, obj.death_month]);
    return _format.toText(obj)
  },
  //https://en.wikipedia.org/wiki/Template:Birth_date_and_age2
  'birth date and age2': (tmpl, r) => {
    let order = ['at_year', 'at_month', 'at_day', 'birth_year', 'birth_month', 'birth_day'];
    let obj = parse$3(tmpl, order);
    r.templates.push(obj);
    obj = _format.ymd([obj.birth_year, obj.birth_month, obj.birth_day]);
    return _format.toText(obj)
  },
  //https://en.wikipedia.org/wiki/Template:Birth_based_on_age_as_of_date
  'birth based on age as of date': (tmpl, r) => {
    let order = ['age', 'year', 'month', 'day'];
    let obj = parse$3(tmpl, order);
    r.templates.push(obj);
    let age = parseInt(obj.age, 10);
    let year = parseInt(obj.year, 10);
    let born = year - age;
    if (born && age) {
      return `${born} (age ${obj.age})`
    }
    return `(age ${obj.age})`
  },
  //https://en.wikipedia.org/wiki/Template:Death_date_and_given_age
  'death date and given age': (tmpl, r) => {
    let order = ['year', 'month', 'day', 'age'];
    let obj = parse$3(tmpl, order);
    r.templates.push(obj);
    obj = _format.ymd([obj.year, obj.month, obj.day]);
    let str = _format.toText(obj);
    if (obj.age) {
      str += ` (age ${obj.age})`;
    }
    return str
  },
  //sortable dates -
  dts: tmpl => {
    //remove formatting stuff, ewww
    tmpl = tmpl.replace(/\|format=[ymd]+/i, '');
    tmpl = tmpl.replace(/\|abbr=(on|off)/i, '');
    let order = ['year', 'month', 'date', 'bc'];
    let obj = parse$3(tmpl, order);
    if (obj.date && obj.month && obj.year) {
      //render 'june 5 2018'
      if (/[a-z]/.test(obj.month) === true) {
        return [obj.month, obj.date, obj.year].join(' ')
      }
      return [obj.year, obj.month, obj.date].join('-')
    }
    if (obj.month && obj.year) {
      return [obj.year, obj.month].join('-')
    }
    if (obj.year) {
      if (obj.year < 0) {
        obj.year = Math.abs(obj.year) + ' BC';
      }
      return obj.year
    }
    return ''
  },
  //date/age/time templates
  start: date,
  end: date,
  birth: date,
  death: date,
  'start date': date,
  'end date': date,
  'birth date': date,
  'death date': date,
  'start date and age': date,
  'end date and age': date,
  //this is insane (hyphen ones are different)
  'start-date': natural_date,
  'end-date': natural_date,
  'birth-date': natural_date,
  'death-date': natural_date,
  'birth-date and age': natural_date,
  'birth-date and given age': natural_date,
  'death-date and age': natural_date,
  'death-date and given age': natural_date,

  birthdeathage: parsers_1.two_dates,
  dob: date,
  // 'birth date and age2': date,

  age: parsers_1.age,
  'age nts': parsers_1.age,
  'age in years': parsers_1['diff-y'],
  'age in years and months': parsers_1['diff-ym'],
  'age in years, months and days': parsers_1['diff-ymd'],
  'age in years and days': parsers_1['diff-yd'],
  'age in days': parsers_1['diff-d']
  // 'age in years, months, weeks and days': true,
  // 'age as of date': true,
});
//aliases
dateTmpl.localday = dateTmpl.currentday;
dateTmpl.localdayname = dateTmpl.currentdayname;
dateTmpl.localmonth = dateTmpl.currentmonth;
dateTmpl.localyear = dateTmpl.currentyear;
dateTmpl.currentmonthname = dateTmpl.currentmonth;
dateTmpl.currentmonthabbrev = dateTmpl.currentmonth;
dateTmpl['death date and age'] = dateTmpl['birth date and age'];
dateTmpl.bda = dateTmpl['birth date and age'];
dateTmpl['birth date based on age at death'] = dateTmpl['birth based on age as of date'];
var dates = dateTmpl;

let templates = {
  //a convulated way to make a xml tag - https://en.wikipedia.org/wiki/Template:Tag
  tag: tmpl => {
    let obj = parse$3(tmpl, ['tag', 'open']);
    const ignore = {
      span: true,
      div: true,
      p: true
    };
    //pair, empty, close, single
    if (!obj.open || obj.open === 'pair') {
      //just skip generating spans and things..
      if (ignore[obj.tag]) {
        return obj.content || ''
      }
      return `<${obj.tag} ${obj.attribs || ''}>${obj.content || ''}</${obj.tag}>`
    }
    return ''
  },
  //dumb inflector - https://en.wikipedia.org/wiki/Template:Plural
  plural: tmpl => {
    tmpl = tmpl.replace(/plural:/, 'plural|');
    let order = ['num', 'word'];
    let obj = parse$3(tmpl, order);
    let num = Number(obj.num);
    let word = obj.word;
    if (num !== 1) {
      if (/.y$/.test(word)) {
        word = word.replace(/y$/, 'ies');
      } else {
        word += 's';
      }
    }
    return num + ' ' + word
  },
  // https://en.wikipedia.org/wiki/Template:First_word
  'first word': tmpl => {
    let obj = parse$3(tmpl, ['text']);
    let str = obj.text;
    if (obj.sep) {
      return str.split(obj.sep)[0]
    }
    return str.split(' ')[0]
  },
  trunc: tmpl => {
    let order = ['str', 'len'];
    let obj = parse$3(tmpl, order);
    return obj.str.substr(0, obj.len)
  },
  'str mid': tmpl => {
    let order = ['str', 'start', 'end'];
    let obj = parse$3(tmpl, order);
    let start = parseInt(obj.start, 10) - 1;
    let end = parseInt(obj.end, 10);
    return obj.str.substr(start, end)
  },
  //grab the first, second or third pipe
  p1: tmpl => {
    let order = ['one'];
    return parse$3(tmpl, order).one
  },
  p2: tmpl => {
    let order = ['one', 'two'];
    return parse$3(tmpl, order).two
  },
  p3: tmpl => {
    let order = ['one', 'two', 'three'];
    return parse$3(tmpl, order).three
  },
  //formatting things - https://en.wikipedia.org/wiki/Template:Nobold
  braces: tmpl => {
    let obj = parse$3(tmpl, ['text']);
    let attrs = '';
    if (obj.list) {
      attrs = '|' + obj.list.join('|');
    }
    return '{{' + (obj.text || '') + attrs + '}}'
  },
  nobold: tmpl => {
    return parse$3(tmpl, ['text']).text || ''
  },
  noitalic: tmpl => {
    return parse$3(tmpl, ['text']).text || ''
  },
  nocaps: tmpl => {
    return parse$3(tmpl, ['text']).text || ''
  },
  syntaxhighlight: (tmpl, r) => {
    let obj = parse$3(tmpl);
    r.templates.push(obj);
    return obj.code || ''
  },
  samp: (tmpl, r) => {
    let obj = parse$3(tmpl, ['1']);
    r.templates.push(obj);
    return obj['1'] || ''
  },
  //https://en.wikipedia.org/wiki/Template:Visible_anchor
  vanchor: tmpl => {
    return parse$3(tmpl, ['text']).text || ''
  },
  //https://en.wikipedia.org/wiki/Template:Resize
  resize: tmpl => {
    return parse$3(tmpl, ['size', 'text']).text || ''
  },
  //https://en.wikipedia.org/wiki/Template:Ra
  ra: tmpl => {
    let obj = parse$3(tmpl, ['hours', 'minutes', 'seconds']);
    return [obj.hours || 0, obj.minutes || 0, obj.seconds || 0].join(':')
  },
  //https://en.wikipedia.org/wiki/Template:Deg2HMS
  deg2hms: tmpl => {
    //this template should do the conversion
    let obj = parse$3(tmpl, ['degrees']);
    return (obj.degrees || '') + '°'
  },
  hms2deg: tmpl => {
    //this template should do the conversion too
    let obj = parse$3(tmpl, ['hours', 'minutes', 'seconds']);
    return [obj.hours || 0, obj.minutes || 0, obj.seconds || 0].join(':')
  },
  decdeg: tmpl => {
    //this template should do the conversion too
    let obj = parse$3(tmpl, ['deg', 'min', 'sec', 'hem', 'rnd']);
    return (obj.deg || obj.degrees) + '°'
  },
  rnd: tmpl => {
    //this template should do the conversion too
    let obj = parse$3(tmpl, ['decimal']);
    return obj.decimal || ''
  },
  //https://en.wikipedia.org/wiki/Template:DEC
  dec: tmpl => {
    let obj = parse$3(tmpl, ['degrees', 'minutes', 'seconds']);
    let str = (obj.degrees || 0) + '°';
    if (obj.minutes) {
      str += obj.minutes + `′`;
    }
    if (obj.seconds) {
      str += obj.seconds + '″';
    }
    return str
  },
  //https://en.wikipedia.org/wiki/Template:Val
  val: tmpl => {
    let obj = parse$3(tmpl, ['number', 'uncertainty']);
    let str = obj.number || '';
    //prefix/suffix
    if (obj.p) {
      str = obj.p + str;
    }
    if (obj.s) {
      str = obj.s + str;
    }
    //add units, too
    if (obj.u || obj.ul || obj.upl) {
      str = str + ' ' + (obj.u || obj.ul || obj.upl);
    }
    return str
  }
};

//aliases
templates['rndfrac'] = templates.rnd;
templates['rndnear'] = templates.rnd;
templates['unité'] = templates.val;

//templates that we simply grab their insides as plaintext
let inline = [
  'nowrap',
  'nobr',
  'big',
  'cquote',
  'pull quote',
  'small',
  'smaller',
  'midsize',
  'larger',
  'big',
  'kbd',
  'bigger',
  'large',
  'mono',
  'strongbad',
  'stronggood',
  'huge',
  'xt',
  'xt2',
  '!xt',
  'xtn',
  'xtd',
  'dc',
  'dcr',
  'mxt',
  '!mxt',
  'mxtn',
  'mxtd',
  'bxt',
  '!bxt',
  'bxtn',
  'bxtd',
  'delink', //https://en.wikipedia.org/wiki/Template:Delink
  //half-supported
  'pre',
  'var',
  'mvar',
  'pre2',
  'code'
];
inline.forEach(k => {
  templates[k] = tmpl => {
    return parse$3(tmpl, ['text']).text || ''
  };
});

var format = templates;

const tmpls = {
  //a strange, newline-based list - https://en.wikipedia.org/wiki/Template:Plainlist
  plainlist: tmpl => {
    tmpl = _strip(tmpl);
    //remove the title
    let arr = tmpl.split('|');
    arr = arr.slice(1);
    tmpl = arr.join('|');
    //split on newline
    arr = tmpl.split(/\n ?\* ?/);
    arr = arr.filter(s => s);
    return arr.join('\n\n')
  },

  //show/hide: https://en.wikipedia.org/wiki/Template:Collapsible_list
  'collapsible list': (tmpl, r) => {
    let obj = parse$3(tmpl);
    r.templates.push(obj);
    let str = '';
    if (obj.title) {
      str += `'''${obj.title}'''` + '\n\n';
    }
    if (!obj.list) {
      obj.list = [];
      for (let i = 1; i < 10; i += 1) {
        if (obj[i]) {
          obj.list.push(obj[i]);
          delete obj[i];
        }
      }
    }
    obj.list = obj.list.filter(s => s);
    str += obj.list.join('\n\n');
    return str
  },
  // https://en.wikipedia.org/wiki/Template:Ordered_list
  'ordered list': (tmpl, r) => {
    let obj = parse$3(tmpl);
    r.templates.push(obj);
    obj.list = obj.list || [];
    let lines = obj.list.map((str, i) => `${i + 1}. ${str}`);
    return lines.join('\n\n')
  },
  hlist: tmpl => {
    let obj = parse$3(tmpl);
    obj.list = obj.list || [];
    return obj.list.join(' · ')
  },
  pagelist: tmpl => {
    let arr = parse$3(tmpl).list || [];
    return arr.join(', ')
  },
  //actually rendering these links removes the text.
  //https://en.wikipedia.org/wiki/Template:Catlist
  catlist: tmpl => {
    let arr = parse$3(tmpl).list || [];
    return arr.join(', ')
  },
  //https://en.wikipedia.org/wiki/Template:Br_separated_entries
  'br separated entries': tmpl => {
    let arr = parse$3(tmpl).list || [];
    return arr.join('\n\n')
  },
  'comma separated entries': tmpl => {
    let arr = parse$3(tmpl).list || [];
    return arr.join(', ')
  },
  //https://en.wikipedia.org/wiki/Template:Bare_anchored_list
  'anchored list': tmpl => {
    let arr = parse$3(tmpl).list || [];
    arr = arr.map((str, i) => `${i + 1}. ${str}`);
    return arr.join('\n\n')
  },
  'bulleted list': tmpl => {
    let arr = parse$3(tmpl).list || [];
    arr = arr.filter(f => f);
    arr = arr.map(str => '• ' + str);
    return arr.join('\n\n')
  },
  //https://en.wikipedia.org/wiki/Template:Columns-list
  'columns-list': (tmpl, r) => {
    let arr = parse$3(tmpl).list || [];
    let str = arr[0] || '';
    let list = str.split(/\n/);
    list = list.filter(f => f);
    list = list.map(s => s.replace(/\*/, ''));
    r.templates.push({
      template: 'columns-list',
      list: list
    });
    list = list.map(s => '• ' + s);
    return list.join('\n\n')
  }
  // 'pagelist':(tmpl)=>{},
};
//aliases
tmpls.flatlist = tmpls.plainlist;
tmpls.ublist = tmpls.plainlist;
tmpls['unbulleted list'] = tmpls['collapsible list'];
tmpls['ubl'] = tmpls['collapsible list'];
tmpls['bare anchored list'] = tmpls['anchored list'];
tmpls['plain list'] = tmpls['plainlist'];
tmpls.cmn = tmpls['columns-list'];
tmpls.collist = tmpls['columns-list'];
tmpls['col-list'] = tmpls['columns-list'];
tmpls.columnslist = tmpls['columns-list'];
var lists = tmpls;

const inline$1 = {
  //https://en.wikipedia.org/wiki/Template:Convert#Ranges_of_values
  convert: tmpl => {
    let order = ['num', 'two', 'three', 'four'];
    let obj = parse$3(tmpl, order);
    //todo: support plural units
    if (obj.two === '-' || obj.two === 'to' || obj.two === 'and') {
      if (obj.four) {
        return `${obj.num} ${obj.two} ${obj.three} ${obj.four}`
      }
      return `${obj.num} ${obj.two} ${obj.three}`
    }
    return `${obj.num} ${obj.two}`
  },
  //https://en.wikipedia.org/wiki/Template:Term
  term: tmpl => {
    let obj = parse$3(tmpl, ['term']);
    return `${obj.term}:`
  },
  defn: tmpl => {
    let obj = parse$3(tmpl, ['desc']);
    return obj.desc
  },
  //https://en.wikipedia.org/wiki/Template:Linum
  lino: tmpl => {
    let obj = parse$3(tmpl, ['num']);
    return `${obj.num}`
  },
  linum: tmpl => {
    let obj = parse$3(tmpl, ['num', 'text']);
    return `${obj.num}. ${obj.text}`
  },
  //https://en.wikipedia.org/wiki/Template:Interlanguage_link
  ill: tmpl => {
    let order = ['text', 'lan1', 'text1', 'lan2', 'text2'];
    let obj = parse$3(tmpl, order);
    return obj.text
  },
  //https://en.wikipedia.org/wiki/Template:Frac
  frac: tmpl => {
    let order = ['a', 'b', 'c'];
    let obj = parse$3(tmpl, order);
    if (obj.c) {
      return `${obj.a} ${obj.b}/${obj.c}`
    }
    if (obj.b) {
      return `${obj.a}/${obj.b}`
    }
    return `1/${obj.b}`
  },
  //https://en.wikipedia.org/wiki/Template:Height - {{height|ft=6|in=1}}
  height: (tmpl, r) => {
    let obj = parse$3(tmpl);
    r.templates.push(obj);
    let result = [];
    let units = ['m', 'cm', 'ft', 'in']; //order matters
    units.forEach(unit => {
      if (obj.hasOwnProperty(unit) === true) {
        result.push(obj[unit] + unit);
      }
    });
    return result.join(' ')
  },
  'block indent': tmpl => {
    let obj = parse$3(tmpl);
    if (obj['1']) {
      return '\n' + obj['1'] + '\n'
    }
    return ''
  },
  quote: (tmpl, r) => {
    let order = ['text', 'author'];
    let obj = parse$3(tmpl, order);
    r.templates.push(obj);
    //create plaintext version
    if (obj.text) {
      let str = `"${obj.text}"`;
      if (obj.author) {
        str += '\n\n';
        str += `    - ${obj.author}`;
      }
      return str + '\n'
    }
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Lbs
  lbs: tmpl => {
    let obj = parse$3(tmpl, ['text']);
    return `[[${obj.text} Lifeboat Station|${obj.text}]]`
  },
  //Foo-class
  lbc: tmpl => {
    let obj = parse$3(tmpl, ['text']);
    return `[[${obj.text}-class lifeboat|${obj.text}-class]]`
  },
  lbb: tmpl => {
    let obj = parse$3(tmpl, ['text']);
    return `[[${obj.text}-class lifeboat|${obj.text}]]`
  },
  // https://en.wikipedia.org/wiki/Template:Own
  own: tmpl => {
    let obj = parse$3(tmpl, ['author']);
    let str = 'Own work';
    if (obj.author) {
      str += ' by ' + obj.author;
    }
    return str
  },
  //https://en.wikipedia.org/wiki/Template:Sic
  sic: (tmpl, r) => {
    let obj = parse$3(tmpl, ['one', 'two', 'three']);
    let word = (obj.one || '') + (obj.two || '');
    //support '[sic?]'
    if (obj.one === '?') {
      word = (obj.two || '') + (obj.three || '');
    }
    r.templates.push({
      template: 'sic',
      word: word
    });
    if (obj.nolink === 'y') {
      return word
    }
    return `${word} [sic]`
  },
  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  formatnum: (tmpl = '') => {
    tmpl = tmpl.replace(/:/, '|');
    let obj = parse$3(tmpl, ['number']);
    let str = obj.number || '';
    str = str.replace(/,/g, '');
    let num = Number(str);
    return num.toLocaleString() || ''
  },
  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  '#dateformat': (tmpl = '') => {
    tmpl = tmpl.replace(/:/, '|');
    let obj = parse$3(tmpl, ['date', 'format']);
    return obj.date
  },
  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  lc: (tmpl = '') => {
    tmpl = tmpl.replace(/:/, '|');
    let obj = parse$3(tmpl, ['text']);
    return (obj.text || '').toLowerCase()
  },
  lcfirst: (tmpl = '') => {
    tmpl = tmpl.replace(/:/, '|');
    let obj = parse$3(tmpl, ['text']);
    let text = obj.text;
    if (!text) {
      return ''
    }
    return text[0].toLowerCase() + text.substr(1)
  },
  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  uc: (tmpl = '') => {
    tmpl = tmpl.replace(/:/, '|');
    let obj = parse$3(tmpl, ['text']);
    return (obj.text || '').toUpperCase()
  },
  ucfirst: (tmpl = '') => {
    tmpl = tmpl.replace(/:/, '|');
    let obj = parse$3(tmpl, ['text']);
    let text = obj.text;
    if (!text) {
      return ''
    }
    return text[0].toUpperCase() + text.substr(1)
  },
  padleft: (tmpl = '') => {
    tmpl = tmpl.replace(/:/, '|');
    let obj = parse$3(tmpl, ['text', 'num']);
    let text = obj.text || '';
    return text.padStart(obj.num, obj.str || '0')
  },
  padright: (tmpl = '') => {
    tmpl = tmpl.replace(/:/, '|');
    let obj = parse$3(tmpl, ['text', 'num']);
    let text = obj.text || '';
    return text.padEnd(obj.num, obj.str || '0')
  },
  //abbreviation/meaning
  //https://en.wikipedia.org/wiki/Template:Abbr
  abbr: (tmpl = '') => {
    let obj = parse$3(tmpl, ['abbr', 'meaning', 'ipa']);
    return obj.abbr
  },
  //https://en.wikipedia.org/wiki/Template:Abbrlink
  abbrlink: (tmpl = '') => {
    let obj = parse$3(tmpl, ['abbr', 'page']);
    if (obj.page) {
      return `[[${obj.page}|${obj.abbr}]]`
    }
    return `[[${obj.abbr}]]`
  },
  //https://en.wikipedia.org/wiki/Template:Hover_title
  //technically 'h:title'
  h: (tmpl = '') => {
    let obj = parse$3(tmpl, ['title', 'text']);
    return obj.text
  },
  //https://en.wikipedia.org/wiki/Template:Finedetail
  finedetail: (tmpl = '') => {
    let obj = parse$3(tmpl, ['text', 'detail']); //technically references
    return obj.text
  },
  //https://en.wikipedia.org/wiki/Template:Sort
  sort: tmpl => {
    let order = ['sort', 'display'];
    return parse$3(tmpl, order).display
  }
};

//aliases
inline$1['str left'] = inline$1.trunc;
inline$1['str crop'] = inline$1.trunc;
inline$1['tooltip'] = inline$1.abbr;
inline$1['abbrv'] = inline$1.abbr;
inline$1['define'] = inline$1.abbr;

var misc$1 = inline$1;

var formatting$1 = Object.assign({}, format, lists, misc$1);

//converts DMS (decimal-minute-second) geo format to lat/lng format.
//major thank you to https://github.com/gmaclennan/parse-dms
//and https://github.com/WSDOT-GIS/dms-js 👏

//accepts an array of descending Degree, Minute, Second values, with a hemisphere at the end
//must have N/S/E/W as last thing
function parseDms(arr) {
  let hemisphere = arr.pop();
  var degrees = Number(arr[0] || 0);
  var minutes = Number(arr[1] || 0);
  var seconds = Number(arr[2] || 0);
  if (typeof hemisphere !== 'string' || isNaN(degrees)) {
    return null
  }
  var sign = 1;
  if (/[SW]/i.test(hemisphere)) {
    sign = -1;
  }
  let decDeg = sign * (degrees + minutes / 60 + seconds / 3600);
  return decDeg
}
var dmsFormat = parseDms;

const round = function(num) {
  if (typeof num !== 'number') {
    return num
  }
  let places = 100000;
  return Math.round(num * places) / places
};

//these hemispheres mean negative decimals
const negative = {
  s: true,
  w: true
};

const findLatLng = function(arr) {
  const types = arr.map(s => typeof s).join('|');
  //support {{lat|lng}}
  if (arr.length === 2 && types === 'number|number') {
    return {
      lat: arr[0],
      lon: arr[1]
    }
  }
  //support {{dd|N/S|dd|E/W}}
  if (arr.length === 4 && types === 'number|string|number|string') {
    if (negative[arr[1].toLowerCase()]) {
      arr[0] *= -1;
    }
    if (arr[3].toLowerCase() === 'w') {
      arr[2] *= -1;
    }
    return {
      lat: arr[0],
      lon: arr[2]
    }
  }
  //support {{dd|mm|N/S|dd|mm|E/W}}
  if (arr.length === 6) {
    return {
      lat: dmsFormat(arr.slice(0, 3)),
      lon: dmsFormat(arr.slice(3))
    }
  }
  //support {{dd|mm|ss|N/S|dd|mm|ss|E/W}}
  if (arr.length === 8) {
    return {
      lat: dmsFormat(arr.slice(0, 4)),
      lon: dmsFormat(arr.slice(4))
    }
  }
  return {}
};

const parseParams = function(obj) {
  obj.list = obj.list || [];
  obj.list = obj.list.map(str => {
    let num = Number(str);
    if (!isNaN(num)) {
      return num
    }
    //these are weird
    let split = str.split(/:/);
    if (split.length > 1) {
      obj.props = obj.props || {};
      obj.props[split[0]] = split.slice(1).join(':');
      return null
    }
    return str
  });
  obj.list = obj.list.filter(s => s !== null);
  return obj
};

const parseCoor = function(tmpl) {
  let obj = parse$3(tmpl);
  obj = parseParams(obj);
  let tmp = findLatLng(obj.list);
  obj.lat = round(tmp.lat);
  obj.lon = round(tmp.lon);
  obj.template = 'coord';
  delete obj.list;
  return obj
};

var coor = parseCoor;

const templates$1 = {
  coord: (tmpl, r) => {
    let obj = coor(tmpl);
    r.templates.push(obj);
    //display inline, by default
    if (!obj.display || obj.display.indexOf('inline') !== -1) {
      return `${obj.lat || ''}°N, ${obj.lon || ''}°W`
    }
    return ''
  },
  //https://en.wikivoyage.org/wiki/Template:Geo
  geo: ['lat', 'lon', 'zoom']
};
// {{coord|latitude|longitude|coordinate parameters|template parameters}}
// {{coord|dd|N/S|dd|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|N/S|dd|mm|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|ss|N/S|dd|mm|ss|E/W|coordinate parameters|template parameters}}
templates$1['coor'] = templates$1.coord;
// these are from the nl wiki
templates$1['coor title dms'] = templates$1.coord;
templates$1['coor title dec'] = templates$1.coord;
templates$1['coor dms'] = templates$1.coord;
templates$1['coor dm'] = templates$1.coord;
templates$1['coor dec'] = templates$1.coord;
var geo = templates$1;

let templates$2 = {
  /* mostly wiktionary*/
  etyl: tmpl => {
    let order = ['lang', 'page'];
    return parse$3(tmpl, order).page || ''
  },
  mention: tmpl => {
    let order = ['lang', 'page'];
    return parse$3(tmpl, order).page || ''
  },
  link: tmpl => {
    let order = ['lang', 'page'];
    return parse$3(tmpl, order).page || ''
  },
  'la-verb-form': tmpl => {
    let order = ['word'];
    return parse$3(tmpl, order).word || ''
  },
  'la-ipa': tmpl => {
    let order = ['word'];
    return parse$3(tmpl, order).word || ''
  },
  //https://en.wikipedia.org/wiki/Template:Sortname
  sortname: tmpl => {
    let order = ['first', 'last', 'target', 'sort'];
    let obj = parse$3(tmpl, order);
    let name = `${obj.first || ''} ${obj.last || ''}`;
    name = name.trim();
    if (obj.nolink) {
      return obj.target || name
    }
    if (obj.dab) {
      name += ` (${obj.dab})`;
      if (obj.target) {
        obj.target += ` (${obj.dab})`;
      }
    }
    if (obj.target) {
      return `[[${obj.target}|${name}]]`
    }
    return `[[${name}]]`
  }
};

//these are insane
// https://en.wikipedia.org/wiki/Template:Tl
const links = [
  'lts',
  't',
  'tfd links',
  'tiw',
  'tltt',
  'tetl',
  'tsetl',
  'ti',
  'tic',
  'tiw',
  'tlt',
  'ttl',
  'twlh',
  'tl2',
  'tlu',
  'demo',
  'hatnote',
  'xpd',
  'para',
  'elc',
  'xtag',
  'mli',
  'mlix',
  '#invoke',
  'url' //https://en.wikipedia.org/wiki/Template:URL
];

//keyValues
links.forEach(k => {
  templates$2[k] = tmpl => {
    let order = ['first', 'second'];
    let obj = parse$3(tmpl, order);
    return obj.second || obj.first
  };
});
//aliases
templates$2.m = templates$2.mention;
templates$2['m-self'] = templates$2.mention;
templates$2.l = templates$2.link;
templates$2.ll = templates$2.link;
templates$2['l-self'] = templates$2.link;
var links_1 = templates$2;

const sisterProjects = {
  wikt: 'wiktionary',
  commons: 'commons',
  c: 'commons',
  commonscat: 'commonscat',
  n: 'wikinews',
  q: 'wikiquote',
  s: 'wikisource',
  a: 'wikiauthor',
  b: 'wikibooks',
  voy: 'wikivoyage',
  v: 'wikiversity',
  d: 'wikidata',
  species: 'wikispecies',
  m: 'meta',
  mw: 'mediawiki'
};

const parsers$1 = {
  //https://en.wikipedia.org/wiki/Template:About
  about: (tmpl, r) => {
    let obj = parse$3(tmpl);
    obj.pos = r.title;
    r.templates.push(obj);
    return ''
  },
  //https://en.wikipedia.org/wiki/Template:Main
  main: (tmpl, r) => {
    let obj = parse$3(tmpl);
    obj.pos = r.title;
    r.templates.push(obj);
    return ''
  },
  'wide image': ['file', 'width', 'caption'],

  //https://en.wikipedia.org/wiki/Template:Redirect
  redirect: (tmpl, r) => {
    let data = parse$3(tmpl, ['redirect']);
    let list = data.list || [];
    let links = [];
    for (let i = 0; i < list.length; i += 2) {
      links.push({
        page: list[i + 1],
        desc: list[i]
      });
    }
    let obj = {
      template: 'redirect',
      redirect: data.redirect,
      links: links
    };
    r.templates.push(obj);
    return ''
  },

  //this one sucks - https://en.wikipedia.org/wiki/Template:GNIS
  'cite gnis': (tmpl, r) => {
    let order = ['id', 'name', 'type'];
    let obj = parse$3(tmpl, order);
    obj.type = 'gnis';
    obj.template = 'citation';
    r.templates.push(obj);
    return ''
  },
  sfn: ['author', 'year', 'location'],
  audio: ['file', 'text', 'type'],

  'spoken wikipedia': (tmpl, r) => {
    let order = ['file', 'date'];
    let obj = parse$3(tmpl, order);
    obj.template = 'audio';
    r.templates.push(obj);
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Sister_project_links
  'sister project links': (tmpl, r) => {
    let data = parse$3(tmpl);
    //rename 'wd' to 'wikidata'
    let links = {};
    Object.keys(sisterProjects).forEach(k => {
      if (data.hasOwnProperty(k) === true) {
        links[sisterProjects[k]] = data[k]; //.text();
      }
    });
    let obj = {
      template: 'sister project links',
      links: links
    };
    r.templates.push(obj);
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Subject_bar
  'subject bar': (tmpl, r) => {
    let data = parse$3(tmpl);
    Object.keys(data).forEach(k => {
      //rename 'voy' to 'wikivoyage'
      if (sisterProjects.hasOwnProperty(k)) {
        data[sisterProjects[k]] = data[k];
        delete data[k];
      }
    });
    let obj = {
      template: 'subject bar',
      links: data
    };
    r.templates.push(obj);
    return ''
  },

  'short description': ['description'],
  'coord missing': ['region'],
  //amazingly, this one does not obey any known patterns
  //https://en.wikipedia.org/wiki/Template:Gallery
  gallery: (tmpl, r) => {
    let obj = parse$3(tmpl);
    let images = (obj.list || []).filter(line => /^ *File ?:/.test(line));
    images = images.map(file => {
      let img = {
        file: file
      };
      return new Image_1(img).json()
    });
    obj = {
      template: 'gallery',
      images: images
    };
    r.templates.push(obj);
    return ''
  },
  //https://en.wikipedia.org/wiki/Template:See_also
  'see also': (tmpl, r) => {
    let data = parse$3(tmpl);
    data.pos = r.title;
    r.templates.push(data);
    return ''
  },
  unreferenced: ['date']
};
//aliases
parsers$1['cite'] = parsers$1.citation;
parsers$1['sfnref'] = parsers$1.sfn;
parsers$1['harvid'] = parsers$1.sfn;
parsers$1['harvnb'] = parsers$1.sfn;
parsers$1['unreferenced section'] = parsers$1.unreferenced;
parsers$1['redir'] = parsers$1.redirect;
parsers$1['sisterlinks'] = parsers$1['sister project links'];
parsers$1['main article'] = parsers$1['main'];

var page = parsers$1;

//random misc for inline wikipedia templates


const titlecase = str => {
  return str.charAt(0).toUpperCase() + str.substring(1)
};

//https://en.wikipedia.org/wiki/Template:Yes
let templates$3 = {};
let cells = [
  'rh',
  'rh2',
  'yes',
  'no',
  'maybe',
  'eliminated',
  'lost',
  'safe',
  'active',
  'site active',
  'coming soon',
  'good',
  'won',
  'nom',
  'sho',
  'longlisted',
  'tba',
  'success',
  'operational',
  'failure',
  'partial',
  'regional',
  'maybecheck',
  'partial success',
  'partial failure',
  'okay',
  'yes-no',
  'some',
  'nonpartisan',
  'pending',
  'unofficial',
  'unofficial2',
  'usually',
  'rarely',
  'sometimes',
  'any',
  'varies',
  'black',
  'non-album single',
  'unreleased',
  'unknown',
  'perhaps',
  'depends',
  'included',
  'dropped',
  'terminated',
  'beta',
  'table-experimental',
  'free',
  'proprietary',
  'nonfree',
  'needs',
  'nightly',
  'release-candidate',
  'planned',
  'scheduled',
  'incorrect',
  'no result',
  'cmain',
  'calso starring',
  'crecurring',
  'cguest',
  'not yet',
  'optional'
];
cells.forEach(str => {
  templates$3[str] = tmpl => {
    let data = parse$3(tmpl, ['text']);
    return data.text || titlecase(data.template)
  };
});

//these ones have a text result
let moreCells = [
  ['active fire', 'Active'],
  ['site active', 'Active'],
  ['site inactive', 'Inactive'],
  ['yes2', ''],
  ['no2', ''],
  ['ya', '✅'],
  ['na', '❌'],
  ['nom', 'Nominated'],
  ['sho', 'Shortlisted'],
  ['tba', 'TBA'],
  ['maybecheck', '✔️'],
  ['okay', 'Neutral'],
  ['n/a', 'N/A'],
  ['sdash', '—'],
  ['dunno', '?'],
  ['draw', ''],
  ['cnone', ''],
  ['nocontest', '']
];
moreCells.forEach(a => {
  templates$3[a[0]] = tmpl => {
    let data = parse$3(tmpl, ['text']);
    return data.text || a[1]
  };
});

//this one's a little different
templates$3.won = tmpl => {
  let data = parse$3(tmpl, ['text']);
  return data.place || data.text || titlecase(data.template)
};

var tableCell = templates$3;

var wikipedia = Object.assign({}, links_1, page, tableCell);

const zeroPad = function(num) {
  num = String(num);
  if (num.length === 1) {
    num = '0' + num;
  }
  return num
};

const parseTeam = function(obj, round, team) {
  if (obj[`rd${round}-team${zeroPad(team)}`]) {
    team = zeroPad(team);
  }
  let score = obj[`rd${round}-score${team}`];
  let num = Number(score);
  if (isNaN(num) === false) {
    score = num;
  }
  return {
    team: obj[`rd${round}-team${team}`],
    score: score,
    seed: obj[`rd${round}-seed${team}`]
  }
};

//these are weird.
const playoffBracket = function(tmpl) {
  let rounds = [];
  let obj = parse$3(tmpl);
  //try some rounds
  for (let i = 1; i < 7; i += 1) {
    let round = [];
    for (let t = 1; t < 16; t += 2) {
      let key = `rd${i}-team`;
      if (obj[key + t] || obj[key + zeroPad(t)]) {
        let one = parseTeam(obj, i, t);
        let two = parseTeam(obj, i, t + 1);
        round.push([one, two]);
      } else {
        break
      }
    }
    if (round.length > 0) {
      rounds.push(round);
    }
  }
  return {
    template: 'playoffbracket',
    rounds: rounds
  }
};

let all = {
  //playoff brackets
  '4teambracket': function(tmpl, r) {
    let obj = playoffBracket(tmpl);
    r.templates.push(obj);
    return ''
  }
};

//a bunch of aliases for these ones:
// https://en.wikipedia.org/wiki/Category:Tournament_bracket_templates
const brackets = [
  '2teambracket',
  '4team2elimbracket',
  '8teambracket',
  '16teambracket',
  '32teambracket',

  'cwsbracket',
  'nhlbracket',
  'nhlbracket-reseed',
  '4teambracket-nhl',
  '4teambracket-ncaa',
  '4teambracket-mma',
  '4teambracket-mlb',

  '8teambracket-nhl',
  '8teambracket-mlb',
  '8teambracket-ncaa',
  '8teambracket-afc',
  '8teambracket-afl',
  '8teambracket-tennis3',
  '8teambracket-tennis5',

  '16teambracket-nhl',
  '16teambracket-nhl divisional',
  '16teambracket-nhl-reseed',
  '16teambracket-nba',
  '16teambracket-swtc',
  '16teambracket-afc',
  '16teambracket-tennis3',
  '16teambracket-tennis5'
];
brackets.forEach(key => {
  all[key] = all['4teambracket'];
});

var brackets_1 = all;

const codes = {
  '£': 'GB£', // https://en.wikipedia.org/wiki/Template:GBP
  '¥': '¥', // https://en.wikipedia.org/wiki/Template:JPY
  '৳': '৳', // https://en.wikipedia.org/wiki/Template:BDT
  '₩': '₩', // https://en.wikipedia.org/wiki/Template:SK_won
  '€': '€', // https://en.wikipedia.org/wiki/Template:€
  '₱': '₱', // https://en.wikipedia.org/wiki/Template:Philippine_peso
  '₹': '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  '₽': '₽', // https://en.wikipedia.org/wiki/Template:RUB
  'cn¥': 'CN¥', // https://en.wikipedia.org/wiki/Template:CNY
  'gb£': 'GB£', // https://en.wikipedia.org/wiki/Template:GBP
  'india rs': '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  'indian rupee symbol': '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  'indian rupee': '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  'indian rupees': '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  'philippine peso': '₱', // https://en.wikipedia.org/wiki/Template:Philippine_peso
  'russian ruble': '₽', // https://en.wikipedia.org/wiki/Template:Russian_ruble
  'SK won': '₩', // https://en.wikipedia.org/wiki/Template:SK_won
  'turkish lira': 'TRY', //https://en.wikipedia.org/wiki/Template:Turkish_lira
  a$: 'A$', // https://en.wikipedia.org/wiki/Template:AUD
  au$: 'A$', //https://en.wikipedia.org/wiki/Template:AUD
  aud: 'A$', //https://en.wikipedia.org/wiki/Template:AUD
  bdt: 'BDT', //https://en.wikipedia.org/wiki/Template:BDT
  brl: 'BRL', //https://en.wikipedia.org/wiki/Template:BRL
  ca$: 'CA$', // https://en.wikipedia.org/wiki/Template:CAD
  cad: 'CA$', // https://en.wikipedia.org/wiki/Template:CAD
  chf: 'CHF', // https://en.wikipedia.org/wiki/Template:CHF
  cny: 'CN¥', // https://en.wikipedia.org/wiki/Template:CNY
  czk: 'czk', // https://en.wikipedia.org/wiki/Template:CZK
  dkk: 'dkk', // https://en.wikipedia.org/wiki/Template:DKK
  dkk2: 'dkk', // https://en.wikipedia.org/wiki/Template:DKK
  euro: '€', // https://en.wikipedia.org/wiki/Template:€
  gbp: 'GB£', // https://en.wikipedia.org/wiki/Template:GBP
  hk$: 'HK$', // https://en.wikipedia.org/wiki/Template:HKD
  hkd: 'HK$', // https://en.wikipedia.org/wiki/Template:HKD
  ils: 'ILS', // https://en.wikipedia.org/wiki/Template:ILS
  inr: '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  jpy: '¥', // https://en.wikipedia.org/wiki/Template:JPY
  myr: 'MYR', // https://en.wikipedia.org/wiki/Template:MYR
  nis: 'ILS', // https://en.wikipedia.org/wiki/Template:ILS
  nok: 'NOK', //https://en.wikipedia.org/wiki/Template:NOK
  nok2: 'NOK', //https://en.wikipedia.org/wiki/Template:NOK
  nz$: 'NZ$', //https://en.wikipedia.org/wiki/Template:NZD
  nzd: 'NZ$', //https://en.wikipedia.org/wiki/Template:NZD
  peso: 'peso', //https://en.wikipedia.org/wiki/Template:Peso
  pkr: '₨', // https://en.wikipedia.org/wiki/Template:Pakistani_Rupee
  r$: 'BRL', //https://en.wikipedia.org/wiki/Template:BRL
  rmb: 'CN¥', // https://en.wikipedia.org/wiki/Template:CNY
  rub: '₽', // https://en.wikipedia.org/wiki/Template:RUB
  ruble: '₽', // https://en.wikipedia.org/wiki/Template:Ruble
  rupee: '₹', // https://en.wikipedia.org/wiki/Template:Rupee
  s$: 'sgd', // https://en.wikipedia.org/wiki/Template:SGD
  sek: 'SEK', // https://en.wikipedia.org/wiki/Template:SEK
  sek2: 'SEK', // https://en.wikipedia.org/wiki/Template:SEK
  sfr: 'CHF', // https://en.wikipedia.org/wiki/Template:CHF
  sgd: 'sgd', // https://en.wikipedia.org/wiki/Template:SGD
  shekel: 'ILS', // https://en.wikipedia.org/wiki/Template:ILS
  sheqel: 'ILS', // https://en.wikipedia.org/wiki/Template:ILS
  ttd: 'TTD', //https://en.wikipedia.org/wiki/Template:TTD
  us$: 'US$', // https://en.wikipedia.org/wiki/Template:US$
  usd: 'US$', // https://en.wikipedia.org/wiki/Template:US$
  yen: '¥', // https://en.wikipedia.org/wiki/Template:JPY
  zar: 'R' //https://en.wikipedia.org/wiki/Template:ZAR
};

const parseCurrency = (tmpl, r) => {
  let o = parse$3(tmpl, ['amount', 'code']);
  r.templates.push(o);
  let code = o.template || '';
  if (code === 'currency') {
    code = o.code;
    if (!code) {
      o.code = code = 'usd'; //Special case when currency template has no code argument
    }
  } else if (
    code === '' ||
    code === 'monnaie' ||
    code === 'unité' ||
    code === 'nombre' ||
    code === 'nb'
  ) {
    code = o.code;
  }
  code = (code || '').toLowerCase();
  switch (code) {
    case 'us':
      o.code = code = 'usd';
      break
    case 'uk':
      o.code = code = 'gbp';
      break
  }
  let out = codes[code] || '';
  let str = `${out}${o.amount || ''}`;
  //support unknown currencies after the number - like '5 BTC'
  if (o.code && !codes[o.code.toLowerCase()]) {
    str += ' ' + o.code;
  }
  return str
};

const inrConvert = (tmpl, r) => {
  let o = parse$3(tmpl, ['rupee_value', 'currency_formatting']);
  r.templates.push(o);
  let formatting = o.currency_formatting;
  if (formatting) {
    let multiplier = 1;
    switch (formatting) {
      case 'k':
        multiplier = 1000;
        break
      case 'm':
        multiplier = 1000000;
        break
      case 'b':
        multiplier = 1000000000;
        break
      case 't':
        multiplier = 1000000000000;
        break
      case 'l':
        multiplier = 100000;
        break
      case 'c':
        multiplier = 10000000;
        break
      case 'lc':
        multiplier = 1000000000000;
        break
    }
    o.rupee_value = o.rupee_value * multiplier;
  }
  let str = `inr ${o.rupee_value || ''}`;
  return str
};

const currencies = {
  //this one is generic https://en.wikipedia.org/wiki/Template:Currency
  currency: parseCurrency,
  monnaie: parseCurrency,
  unité: parseCurrency,
  nombre: parseCurrency,
  nb: parseCurrency,
  iso4217: parseCurrency,
  inrconvert: inrConvert
};
//the others fit the same pattern..
Object.keys(codes).forEach(k => {
  currencies[k] = parseCurrency;
});

var currency = currencies;

let templates$4 = {
  //https://en.wikipedia.org/wiki/Template:Election_box
  'election box begin': (tmpl, r) => {
    let data = parse$3(tmpl);
    r.templates.push(data);
    return ''
  },
  'election box candidate': (tmpl, r) => {
    let data = parse$3(tmpl);
    r.templates.push(data);
    return ''
  },
  'election box hold with party link': (tmpl, r) => {
    let data = parse$3(tmpl);
    r.templates.push(data);
    return ''
  },
  'election box gain with party link': (tmpl, r) => {
    let data = parse$3(tmpl);
    r.templates.push(data);
    return ''
  }
};
//aliases
templates$4['election box begin no change'] = templates$4['election box begin'];
templates$4['election box begin no party'] = templates$4['election box begin'];
templates$4['election box begin no party no change'] = templates$4['election box begin'];
templates$4['election box inline begin'] = templates$4['election box begin'];
templates$4['election box inline begin no change'] = templates$4['election box begin'];

templates$4['election box candidate for alliance'] = templates$4['election box candidate'];
templates$4['election box candidate minor party'] = templates$4['election box candidate'];
templates$4['election box candidate no party link no change'] = templates$4['election box candidate'];
templates$4['election box candidate with party link'] = templates$4['election box candidate'];
templates$4['election box candidate with party link coalition 1918'] =
  templates$4['election box candidate'];
templates$4['election box candidate with party link no change'] = templates$4['election box candidate'];
templates$4['election box inline candidate'] = templates$4['election box candidate'];
templates$4['election box inline candidate no change'] = templates$4['election box candidate'];
templates$4['election box inline candidate with party link'] = templates$4['election box candidate'];
templates$4['election box inline candidate with party link no change'] =
  templates$4['election box candidate'];
templates$4['election box inline incumbent'] = templates$4['election box candidate'];
var elections = templates$4;

var flags = [
  ['🇦🇩', 'and', 'andorra'],
  ['🇦🇪', 'are', 'united arab emirates'],
  ['🇦🇫', 'afg', 'afghanistan'],
  ['🇦🇬', 'atg', 'antigua and barbuda'],
  ['🇦🇮', 'aia', 'anguilla'],
  ['🇦🇱', 'alb', 'albania'],
  ['🇦🇲', 'arm', 'armenia'],
  ['🇦🇴', 'ago', 'angola'],
  ['🇦🇶', 'ata', 'antarctica'],
  ['🇦🇷', 'arg', 'argentina'],
  ['🇦🇸', 'asm', 'american samoa'],
  ['🇦🇹', 'aut', 'austria'],
  ['🇦🇺', 'aus', 'australia'],
  ['🇦🇼', 'abw', 'aruba'],
  ['🇦🇽', 'ala', 'åland islands'],
  ['🇦🇿', 'aze', 'azerbaijan'],
  ['🇧🇦', 'bih', 'bosnia and herzegovina'],
  ['🇧🇧', 'brb', 'barbados'],
  ['🇧🇩', 'bgd', 'bangladesh'],
  ['🇧🇪', 'bel', 'belgium'],
  ['🇧🇫', 'bfa', 'burkina faso'],
  ['🇧🇬', 'bgr', 'bulgaria'],
  [
    '🇧🇬',
    'bul', //dupe
    'bulgaria'
  ],
  ['🇧🇭', 'bhr', 'bahrain'],
  ['🇧🇮', 'bdi', 'burundi'],
  ['🇧🇯', 'ben', 'benin'],
  ['🇧🇱', 'blm', 'saint barthélemy'],
  ['🇧🇲', 'bmu', 'bermuda'],
  ['🇧🇳', 'brn', 'brunei darussalam'],
  ['🇧🇴', 'bol', 'bolivia'],
  ['🇧🇶', 'bes', 'bonaire, sint eustatius and saba'],
  ['🇧🇷', 'bra', 'brazil'],
  ['🇧🇸', 'bhs', 'bahamas'],
  ['🇧🇹', 'btn', 'bhutan'],
  ['🇧🇻', 'bvt', 'bouvet island'],
  ['🇧🇼', 'bwa', 'botswana'],
  ['🇧🇾', 'blr', 'belarus'],
  ['🇧🇿', 'blz', 'belize'],
  ['🇨🇦', 'can', 'canada'],
  ['🇨🇨', 'cck', 'cocos (keeling) islands'],
  ['🇨🇩', 'cod', 'congo'],
  ['🇨🇫', 'caf', 'central african republic'],
  ['🇨🇬', 'cog', 'congo'],
  ['🇨🇭', 'che', 'switzerland'],
  ['🇨🇮', 'civ', "côte d'ivoire"],
  ['🇨🇰', 'cok', 'cook islands'],
  ['🇨🇱', 'chl', 'chile'],
  ['🇨🇲', 'cmr', 'cameroon'],
  ['🇨🇳', 'chn', 'china'],
  ['🇨🇴', 'col', 'colombia'],
  ['🇨🇷', 'cri', 'costa rica'],
  ['🇨🇺', 'cub', 'cuba'],
  ['🇨🇻', 'cpv', 'cape verde'],
  ['🇨🇼', 'cuw', 'curaçao'],
  ['🇨🇽', 'cxr', 'christmas island'],
  ['🇨🇾', 'cyp', 'cyprus'],
  ['🇨🇿', 'cze', 'czech republic'],
  ['🇩🇪', 'deu', 'germany'],
  [
    '🇩🇪',
    'ger', //alias
    'germany'
  ],
  ['🇩🇯', 'dji', 'djibouti'],
  ['🇩🇰', 'dnk', 'denmark'],
  ['🇩🇲', 'dma', 'dominica'],
  ['🇩🇴', 'dom', 'dominican republic'],
  ['🇩🇿', 'dza', 'algeria'],
  ['🇪🇨', 'ecu', 'ecuador'],
  ['🇪🇪', 'est', 'estonia'],
  ['🇪🇬', 'egy', 'egypt'],
  ['🇪🇭', 'esh', 'western sahara'],
  ['🇪🇷', 'eri', 'eritrea'],
  ['🇪🇸', 'esp', 'spain'],
  ['🇪🇹', 'eth', 'ethiopia'],
  ['🇫🇮', 'fin', 'finland'],
  ['🇫🇯', 'fji', 'fiji'],
  ['🇫🇰', 'flk', 'falkland islands (malvinas)'],
  ['🇫🇲', 'fsm', 'micronesia'],
  ['🇫🇴', 'fro', 'faroe islands'],
  ['🇫🇷', 'fra', 'france'],
  ['🇬🇦', 'gab', 'gabon'],
  ['🇬🇧', 'gbr', 'united kingdom'],
  ['🇬🇩', 'grd', 'grenada'],
  // ['🇬🇪', 'geo', 'georgia'],
  ['🇬🇫', 'guf', 'french guiana'],
  ['🇬🇬', 'ggy', 'guernsey'],
  ['🇬🇭', 'gha', 'ghana'],
  ['🇬🇮', 'gib', 'gibraltar'],
  ['🇬🇱', 'grl', 'greenland'],
  ['🇬🇲', 'gmb', 'gambia'],
  ['🇬🇳', 'gin', 'guinea'],
  ['🇬🇵', 'glp', 'guadeloupe'],
  ['🇬🇶', 'gnq', 'equatorial guinea'],
  ['🇬🇷', 'grc', 'greece'],
  ['🇬🇸', 'sgs', 'south georgia'],
  ['🇬🇹', 'gtm', 'guatemala'],
  ['🇬🇺', 'gum', 'guam'],
  ['🇬🇼', 'gnb', 'guinea-bissau'],
  ['🇬🇾', 'guy', 'guyana'],
  ['🇭🇰', 'hkg', 'hong kong'],
  ['🇭🇲', 'hmd', 'heard island and mcdonald islands'],
  ['🇭🇳', 'hnd', 'honduras'],
  ['🇭🇷', 'hrv', 'croatia'],
  ['🇭🇹', 'hti', 'haiti'],
  ['🇭🇺', 'hun', 'hungary'],
  ['🇮🇩', 'idn', 'indonesia'],
  ['🇮🇪', 'irl', 'ireland'],
  ['🇮🇱', 'isr', 'israel'],
  ['🇮🇲', 'imn', 'isle of man'],
  ['🇮🇳', 'ind', 'india'],
  ['🇮🇴', 'iot', 'british indian ocean territory'],
  ['🇮🇶', 'irq', 'iraq'],
  ['🇮🇷', 'irn', 'iran'],
  ['🇮🇸', 'isl', 'iceland'],
  ['🇮🇹', 'ita', 'italy'],
  ['🇯🇪', 'jey', 'jersey'],
  ['🇯🇲', 'jam', 'jamaica'],
  ['🇯🇴', 'jor', 'jordan'],
  ['🇯🇵', 'jpn', 'japan'],
  ['🇰🇪', 'ken', 'kenya'],
  ['🇰🇬', 'kgz', 'kyrgyzstan'],
  ['🇰🇭', 'khm', 'cambodia'],
  ['🇰🇮', 'kir', 'kiribati'],
  ['🇰🇲', 'com', 'comoros'],
  ['🇰🇳', 'kna', 'saint kitts and nevis'],
  ['🇰🇵', 'prk', 'north korea'],
  ['🇰🇷', 'kor', 'south korea'],
  ['🇰🇼', 'kwt', 'kuwait'],
  ['🇰🇾', 'cym', 'cayman islands'],
  ['🇰🇿', 'kaz', 'kazakhstan'],
  ['🇱🇦', 'lao', "lao people's democratic republic"],
  ['🇱🇧', 'lbn', 'lebanon'],
  ['🇱🇨', 'lca', 'saint lucia'],
  ['🇱🇮', 'lie', 'liechtenstein'],
  ['🇱🇰', 'lka', 'sri lanka'],
  ['🇱🇷', 'lbr', 'liberia'],
  ['🇱🇸', 'lso', 'lesotho'],
  ['🇱🇹', 'ltu', 'lithuania'],
  ['🇱🇺', 'lux', 'luxembourg'],
  ['🇱🇻', 'lva', 'latvia'],
  ['🇱🇾', 'lby', 'libya'],
  ['🇲🇦', 'mar', 'morocco'],
  ['🇲🇨', 'mco', 'monaco'],
  ['🇲🇩', 'mda', 'moldova'],
  ['🇲🇪', 'mne', 'montenegro'],
  ['🇲🇫', 'maf', 'saint martin (french part)'],
  ['🇲🇬', 'mdg', 'madagascar'],
  ['🇲🇭', 'mhl', 'marshall islands'],
  ['🇲🇰', 'mkd', 'macedonia'],
  ['🇲🇱', 'mli', 'mali'],
  ['🇲🇲', 'mmr', 'myanmar'],
  ['🇲🇳', 'mng', 'mongolia'],
  ['🇲🇴', 'mac', 'macao'],
  ['🇲🇵', 'mnp', 'northern mariana islands'],
  ['🇲🇶', 'mtq', 'martinique'],
  ['🇲🇷', 'mrt', 'mauritania'],
  ['🇲🇸', 'msr', 'montserrat'],
  ['🇲🇹', 'mlt', 'malta'],
  ['🇲🇺', 'mus', 'mauritius'],
  ['🇲🇻', 'mdv', 'maldives'],
  ['🇲🇼', 'mwi', 'malawi'],
  ['🇲🇽', 'mex', 'mexico'],
  ['🇲🇾', 'mys', 'malaysia'],
  ['🇲🇿', 'moz', 'mozambique'],
  ['🇳🇦', 'nam', 'namibia'],
  ['🇳🇨', 'ncl', 'new caledonia'],
  ['🇳🇪', 'ner', 'niger'],
  ['🇳🇫', 'nfk', 'norfolk island'],
  ['🇳🇬', 'nga', 'nigeria'],
  ['🇳🇮', 'nic', 'nicaragua'],
  ['🇳🇱', 'nld', 'netherlands'],
  ['🇳🇴', 'nor', 'norway'],
  ['🇳🇵', 'npl', 'nepal'],
  ['🇳🇷', 'nru', 'nauru'],
  ['🇳🇺', 'niu', 'niue'],
  ['🇳🇿', 'nzl', 'new zealand'],
  ['🇴🇲', 'omn', 'oman'],
  ['🇵🇦', 'pan', 'panama'],
  ['🇵🇪', 'per', 'peru'],
  ['🇵🇫', 'pyf', 'french polynesia'],
  ['🇵🇬', 'png', 'papua new guinea'],
  ['🇵🇭', 'phl', 'philippines'],
  ['🇵🇰', 'pak', 'pakistan'],
  ['🇵🇱', 'pol', 'poland'],
  ['🇵🇲', 'spm', 'saint pierre and miquelon'],
  ['🇵🇳', 'pcn', 'pitcairn'],
  ['🇵🇷', 'pri', 'puerto rico'],
  ['🇵🇸', 'pse', 'palestinian territory'],
  ['🇵🇹', 'prt', 'portugal'],
  ['🇵🇼', 'plw', 'palau'],
  ['🇵🇾', 'pry', 'paraguay'],
  ['🇶🇦', 'qat', 'qatar'],
  ['🇷🇪', 'reu', 'réunion'],
  ['🇷🇴', 'rou', 'romania'],
  ['🇷🇸', 'srb', 'serbia'],
  ['🇷🇺', 'rus', 'russia'],
  ['🇷🇼', 'rwa', 'rwanda'],
  ['🇸🇦', 'sau', 'saudi arabia'],
  ['🇸🇧', 'slb', 'solomon islands'],
  ['🇸🇨', 'syc', 'seychelles'],
  ['🇸🇩', 'sdn', 'sudan'],
  ['🇸🇪', 'swe', 'sweden'],
  ['🇸🇬', 'sgp', 'singapore'],
  ['🇸🇭', 'shn', 'saint helena, ascension and tristan da cunha'],
  ['🇸🇮', 'svn', 'slovenia'],
  ['🇸🇯', 'sjm', 'svalbard and jan mayen'],
  ['🇸🇰', 'svk', 'slovakia'],
  ['🇸🇱', 'sle', 'sierra leone'],
  ['🇸🇲', 'smr', 'san marino'],
  ['🇸🇳', 'sen', 'senegal'],
  ['🇸🇴', 'som', 'somalia'],
  ['🇸🇷', 'sur', 'suriname'],
  ['🇸🇸', 'ssd', 'south sudan'],
  ['🇸🇹', 'stp', 'sao tome and principe'],
  ['🇸🇻', 'slv', 'el salvador'],
  ['🇸🇽', 'sxm', 'sint maarten (dutch part)'],
  ['🇸🇾', 'syr', 'syrian arab republic'],
  ['🇸🇿', 'swz', 'swaziland'],
  ['🇹🇨', 'tca', 'turks and caicos islands'],
  ['🇹🇩', 'tcd', 'chad'],
  ['🇹🇫', 'atf', 'french southern territories'],
  ['🇹🇬', 'tgo', 'togo'],
  ['🇹🇭', 'tha', 'thailand'],
  ['🇹🇯', 'tjk', 'tajikistan'],
  ['🇹🇰', 'tkl', 'tokelau'],
  ['🇹🇱', 'tls', 'timor-leste'],
  ['🇹🇲', 'tkm', 'turkmenistan'],
  ['🇹🇳', 'tun', 'tunisia'],
  ['🇹🇴', 'ton', 'tonga'],
  ['🇹🇷', 'tur', 'turkey'],
  ['🇹🇹', 'tto', 'trinidad and tobago'],
  ['🇹🇻', 'tuv', 'tuvalu'],
  ['🇹🇼', 'twn', 'taiwan'],
  ['🇹🇿', 'tza', 'tanzania'],
  ['🇺🇦', 'ukr', 'ukraine'],
  ['🇺🇬', 'uga', 'uganda'],
  ['🇺🇲', 'umi', 'united states minor outlying islands'],
  ['🇺🇸', 'usa', 'united states'],
  [
    '🇺🇸',
    'us', //alias
    'united states'
  ],
  ['🇺🇾', 'ury', 'uruguay'],
  ['🇺🇿', 'uzb', 'uzbekistan'],
  ['🇻🇦', 'vat', 'vatican city'],
  ['🇻🇨', 'vct', 'saint vincent and the grenadines'],
  ['🇻🇪', 'ven', 'venezuela'],
  ['🇻🇬', 'vgb', 'virgin islands, british'],
  ['🇻🇮', 'vir', 'virgin islands, u.s.'],
  ['🇻🇳', 'vnm', 'viet nam'],
  ['🇻🇺', 'vut', 'vanuatu'],
  ['', 'win', 'west indies'],
  ['🇼🇫', 'wlf', 'wallis and futuna'],
  ['🇼🇸', 'wsm', 'samoa'],
  ['🇾🇪', 'yem', 'yemen'],
  ['🇾🇹', 'myt', 'mayotte'],
  ['🇿🇦', 'zaf', 'south africa'],
  ['🇿🇲', 'zmb', 'zambia'],
  ['🇿🇼 ', 'zwe', 'zimbabwe'],
  //others (later unicode versions)
  ['🇺🇳', 'un', 'united nations'],
  ['🏴󠁧󠁢󠁥󠁮󠁧󠁿󠁧󠁢󠁥󠁮󠁧󠁿', 'eng', 'england'],
  ['🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sct', 'scotland'],
  ['🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'wal', 'wales']
];

let templates$5 = {
  //https://en.wikipedia.org/wiki/Template:Flag
  // {{flag|USA}} →  USA
  flag: tmpl => {
    let order = ['flag', 'variant'];
    let obj = parse$3(tmpl, order);
    let name = obj.flag || '';
    obj.flag = (obj.flag || '').toLowerCase();
    let found = flags.find(a => obj.flag === a[1] || obj.flag === a[2]) || [];
    let flag = found[0] || '';
    return `${flag} [[${found[2]}|${name}]]`
  },
  // {{flagcountry|USA}} →  United States
  flagcountry: tmpl => {
    let order = ['flag', 'variant'];
    let obj = parse$3(tmpl, order);
    obj.flag = (obj.flag || '').toLowerCase();
    let found = flags.find(a => obj.flag === a[1] || obj.flag === a[2]) || [];
    let flag = found[0] || '';
    return `${flag} [[${found[2]}]]`
  },
  // (unlinked flag-country)
  flagcu: tmpl => {
    let order = ['flag', 'variant'];
    let obj = parse$3(tmpl, order);
    obj.flag = (obj.flag || '').toLowerCase();
    let found = flags.find(a => obj.flag === a[1] || obj.flag === a[2]) || [];
    let flag = found[0] || '';
    return `${flag} ${found[2]}`
  },
  //https://en.wikipedia.org/wiki/Template:Flagicon
  // {{flagicon|USA}} → United States
  flagicon: tmpl => {
    let order = ['flag', 'variant'];
    let obj = parse$3(tmpl, order);
    obj.flag = (obj.flag || '').toLowerCase();
    let found = flags.find(a => obj.flag === a[1] || obj.flag === a[2]);
    if (!found) {
      return ''
    }
    return `[[${found[2]}|${found[0]}]]`
  },
  //unlinked flagicon
  flagdeco: tmpl => {
    let order = ['flag', 'variant'];
    let obj = parse$3(tmpl, order);
    obj.flag = (obj.flag || '').toLowerCase();
    let found = flags.find(a => obj.flag === a[1] || obj.flag === a[2]) || [];
    return found[0] || ''
  },
  //same, but a soccer team
  fb: tmpl => {
    let order = ['flag', 'variant'];
    let obj = parse$3(tmpl, order);
    obj.flag = (obj.flag || '').toLowerCase();
    let found = flags.find(a => obj.flag === a[1] || obj.flag === a[2]);
    if (!found) {
      return ''
    }
    return `${found[0]} [[${found[2]} national football team|${found[2]}]]`
  },
  fbicon: tmpl => {
    let order = ['flag', 'variant'];
    let obj = parse$3(tmpl, order);
    obj.flag = (obj.flag || '').toLowerCase();
    let found = flags.find(a => obj.flag === a[1] || obj.flag === a[2]);
    if (!found) {
      return ''
    }
    return ` [[${found[2]} national football team|${found[0]}]]`
  }
};
//support {{can}}
flags.forEach(a => {
  templates$5[a[1]] = () => {
    return a[0]
  };
});
//cricket
templates$5['cr'] = templates$5.flagcountry;
templates$5['cr-rt'] = templates$5.flagcountry;
templates$5['cricon'] = templates$5.flagicon;

var flags_1 = templates$5;

const getLang = function(name) {
  //grab the language from the template name - 'ipa-de'
  let lang = name.match(/ipac?-(.+)/);
  if (lang !== null) {
    if (languages.hasOwnProperty(lang[1]) === true) {
      return languages[lang[1]].english_title
    }
    return lang[1]
  }
  return null
};

// pronounciation info
const templates$6 = {
  // https://en.wikipedia.org/wiki/Template:IPA
  ipa: (tmpl, r) => {
    let obj = parse$3(tmpl, ['transcription', 'lang', 'audio']);
    obj.lang = getLang(obj.template);
    obj.template = 'ipa';
    r.templates.push(obj);
    return ''
  },
  //https://en.wikipedia.org/wiki/Template:IPAc-en
  ipac: (tmpl, r) => {
    let obj = parse$3(tmpl);
    obj.transcription = (obj.list || []).join(',');
    delete obj.list;
    obj.lang = getLang(obj.template);
    obj.template = 'ipac';
    r.templates.push(obj);
    return ''
  }
};
// - other languages -
// Polish, {{IPAc-pl}}	{{IPAc-pl|'|sz|cz|e|ć|i|n}} → [ˈʂt͡ʂɛt͡ɕin]
// Portuguese, {{IPAc-pt}}	{{IPAc-pt|p|o|<|r|t|u|'|g|a|l|lang=pt}} and {{IPAc-pt|b|r|a|'|s|i|l|lang=br}} → [puɾtuˈɣaɫ] and [bɾaˈsiw]
Object.keys(languages).forEach(lang => {
  templates$6['ipa-' + lang] = templates$6.ipa;
  templates$6['ipac-' + lang] = templates$6.ipac;
});

var ipa = templates$6;

const templates$7 = {
  lang: tmpl => {
    let order = ['lang', 'text'];
    let obj = parse$3(tmpl, order);
    return obj.text
  },
  //this one has a million variants
  'lang-de': tmpl => {
    let order = ['text'];
    let obj = parse$3(tmpl, order);
    return obj.text
  },
  'rtl-lang': tmpl => {
    let order = ['lang', 'text'];
    let obj = parse$3(tmpl, order);
    return obj.text
  },
  //german keyboard letterscn
  taste: tmpl => {
    let obj = parse$3(tmpl, ['key']);
    return obj.key || ''
  },
  //https://en.wikipedia.org/wiki/Template:Nihongo
  nihongo: (tmpl, r) => {
    let obj = parse$3(tmpl, ['english', 'kanji', 'romaji', 'extra']);
    r.templates.push(obj);
    let str = obj.english || obj.romaji || '';
    if (obj.kanji) {
      str += ` (${obj.kanji})`;
    }
    return str
  }
};
//https://en.wikipedia.org/wiki/Category:Lang-x_templates
Object.keys(languages).forEach(k => {
  templates$7['lang-' + k] = templates$7['lang-de'];
});
templates$7['nihongo2'] = templates$7.nihongo;
templates$7['nihongo3'] = templates$7.nihongo;
templates$7['nihongo-s'] = templates$7.nihongo;
templates$7['nihongo foot'] = templates$7.nihongo;
var languages_1 = templates$7;

// const parseSentence = require('../../04-sentence').oneSentence;

//simply num/denom * 100
const percentage = function(obj) {
  if (!obj.numerator && !obj.denominator) {
    return null
  }
  let perc = Number(obj.numerator) / Number(obj.denominator);
  perc *= 100;
  let dec = Number(obj.decimals);
  if (isNaN(dec)) {
    dec = 1;
  }
  perc = perc.toFixed(dec);
  return Number(perc)
};

let templates$8 = {
  // https://en.wikipedia.org/wiki/Template:Math
  math: (tmpl, r) => {
    let obj = parse$3(tmpl, ['formula']);
    r.templates.push(obj);
    return '\n\n' + (obj.formula || '') + '\n\n'
  },

  //fraction - https://en.wikipedia.org/wiki/Template:Sfrac
  frac: (tmpl, r) => {
    let order = ['a', 'b', 'c'];
    let obj = parse$3(tmpl, order);
    let data = {
      template: 'sfrac'
    };
    if (obj.c) {
      data.integer = obj.a;
      data.numerator = obj.b;
      data.denominator = obj.c;
    } else if (obj.b) {
      data.numerator = obj.a;
      data.denominator = obj.b;
    } else {
      data.numerator = 1;
      data.denominator = obj.a;
    }
    r.templates.push(data);
    if (data.integer) {
      return `${data.integer} ${data.numerator}⁄${data.denominator}`
    }
    return `${data.numerator}⁄${data.denominator}`
  },
  //https://en.wikipedia.org/wiki/Template:Radic
  radic: tmpl => {
    let order = ['after', 'before'];
    let obj = parse$3(tmpl, order);
    return `${obj.before || ''}√${obj.after || ''}`
  },
  //{{percentage | numerator | denominator | decimals to round to (zero or greater) }}
  percentage: (tmpl = '') => {
    let obj = parse$3(tmpl, ['numerator', 'denominator', 'decimals']);
    let num = percentage(obj);
    if (num === null) {
      return ''
    }
    return num + '%'
  },
  // {{Percent-done|done=N|total=N|digits=N}}
  'percent-done': (tmpl = '') => {
    let obj = parse$3(tmpl, ['done', 'total', 'digits']);
    let num = percentage({
      numerator: obj.done,
      denominator: obj.total,
      decimals: obj.digits
    });
    if (num === null) {
      return ''
    }
    return `${obj.done} (${num}%) done`
  },
  'winning percentage': (tmpl = '', r) => {
    let obj = parse$3(tmpl, ['wins', 'losses', 'ties']);
    r.templates.push(obj);
    let wins = Number(obj.wins);
    let losses = Number(obj.losses);
    let ties = Number(obj.ties) || 0;
    let games = wins + losses + ties;
    if (obj.ignore_ties === 'y') {
      ties = 0;
    }
    if (ties) {
      wins += ties / 2;
    }
    let num = percentage({
      numerator: wins,
      denominator: games,
      decimals: 1
    });
    if (num === null) {
      return ''
    }
    return `.${num * 10}`
  },
  winlosspct: (tmpl = '', r) => {
    let obj = parse$3(tmpl, ['wins', 'losses']);
    r.templates.push(obj);
    let wins = Number(obj.wins);
    let losses = Number(obj.losses);
    let num = percentage({
      numerator: wins,
      denominator: wins + losses,
      decimals: 1
    });
    if (num === null) {
      return ''
    }
    num = `.${num * 10}`;
    return `${wins || 0} || ${losses || 0} || ${num || '-'}`
  }
};
//aliases
templates$8['sfrac'] = templates$8.frac;
templates$8['sqrt'] = templates$8.radic;
templates$8['pct'] = templates$8.percentage;
templates$8['percent'] = templates$8.percentage;
templates$8['winpct'] = templates$8['winning percentage'];
templates$8['winperc'] = templates$8['winning percentage'];

var math = templates$8;

const misc$2 = {
  uss: ['ship', 'id'],
  isbn: (tmpl, r) => {
    let order = ['id', 'id2', 'id3'];
    let obj = parse$3(tmpl, order);
    r.templates.push(obj);
    return 'ISBN: ' + (obj.id || '')
  },
  //https://en.wikipedia.org/wiki/Template:Marriage
  //this one creates a template, and an inline response
  marriage: (tmpl, r) => {
    let data = parse$3(tmpl, ['spouse', 'from', 'to', 'end']);
    r.templates.push(data);
    let str = `${data.spouse || ''}`;
    if (data.from) {
      if (data.to) {
        str += ` (m. ${data.from}-${data.to})`;
      } else {
        str += ` (m. ${data.from})`;
      }
    }
    return str
  },
  //https://en.wikipedia.org/wiki/Template:Based_on
  'based on': (tmpl, r) => {
    let obj = parse$3(tmpl, ['title', 'author']);
    r.templates.push(obj);
    return `${obj.title} by ${obj.author || ''}`
  },
  //https://en.wikipedia.org/wiki/Template:Video_game_release
  'video game release': (tmpl, r) => {
    let order = ['region', 'date', 'region2', 'date2', 'region3', 'date3', 'region4', 'date4'];
    let obj = parse$3(tmpl, order);
    let template = {
      template: 'video game release',
      releases: []
    };
    for (let i = 0; i < order.length; i += 2) {
      if (obj[order[i]]) {
        template.releases.push({
          region: obj[order[i]],
          date: obj[order[i + 1]]
        });
      }
    }
    r.templates.push(template);
    let str = template.releases.map(o => `${o.region}: ${o.date || ''}`).join('\n\n');
    return '\n' + str + '\n'
  },
  //barrels of oil https://en.wikipedia.org/wiki/Template:Bbl_to_t
  'bbl to t': (tmpl, r) => {
    let obj = parse$3(tmpl, ['barrels']);
    r.templates.push(obj);
    if (obj.barrels === '0') {
      return obj.barrels + ' barrel'
    }
    return obj.barrels + ' barrels'
  },
  //https://en.wikipedia.org/wiki/Template:Historical_populations
  'historical populations': (tmpl, r) => {
    let data = parse$3(tmpl);
    data.list = data.list || [];
    let years = [];
    for (let i = 0; i < data.list.length; i += 2) {
      let num = data.list[i + 1];
      years.push({
        year: data.list[i],
        val: Number(num) || num
      });
    }
    data.data = years;
    delete data.list;
    r.templates.push(data);
    return ''
  }
};
var misc_1$1 = misc$2;

// okay, these just hurts my feelings
// https://www.mediawiki.org/wiki/Help:Magic_words#Other
let punctuation = [
  // https://en.wikipedia.org/wiki/Template:%C2%B7
  ['·', '·'],
  ['·', '·'],
  ['dot', '·'],
  ['middot', '·'],
  ['•', ' • '],
  //yup, oxford comma template
  [',', ','],
  ['1/2', '1⁄2'],
  ['1/3', '1⁄3'],
  ['2/3', '2⁄3'],
  ['1/4', '1⁄4'],
  ['3/4', '3⁄4'],
  ['–', '–'],
  ['ndash', '–'],
  ['en dash', '–'],
  ['spaced ndash', ' – '],

  ['—', '—'],
  ['mdash', '—'],
  ['em dash', '—'],

  ['number sign', '#'],
  ['ibeam', 'I'],
  ['&', '&'],
  [';', ';'],
  ['ampersand', '&'],
  ['snds', ' – '],
  ['snd', ' – '],
  // these '{{^}}' things are nuts, and used as some ilicit spacing thing.
  ['^', ' '],
  ['!', '|'],
  ['\\', ' /'],
  ['`', '`'],
  ['=', '='],
  ['bracket', '['],
  ['[', '['],
  ['*', '*'],
  ['asterisk', '*'],
  ['long dash', '———'],
  ['clear', '\n\n'],
  ['h.', 'ḥ']
];
const templates$9 = {};
punctuation.forEach(a => {
  templates$9[a[0]] = () => {
    return a[1]
  };
});
var punctuation_1 = templates$9;

let templates$a = {
  //https://en.wikipedia.org/wiki/Template:Taxon_info
  'taxon info': ['taxon', 'item'],

  //minor planet - https://en.wikipedia.org/wiki/Template:MPC
  mpc: (tmpl, r) => {
    let obj = parse$3(tmpl, ['number', 'text']);
    r.templates.push(obj);
    return `[https://minorplanetcenter.net/db_search/show_object?object_id=P/2011+NO1 ${obj.text ||
      obj.number}]`
  },
  //https://en.wikipedia.org/wiki/Template:Chem2
  chem2: (tmpl, r) => {
    let obj = parse$3(tmpl, ['equation']);
    r.templates.push(obj);
    return obj.equation
  }, //https://en.wikipedia.org/wiki/Template:Sky
  sky: (tmpl, r) => {
    let obj = parse$3(tmpl, [
      'asc_hours',
      'asc_minutes',
      'asc_seconds',
      'dec_sign',
      'dec_degrees',
      'dec_minutes',
      'dec_seconds',
      'distance'
    ]);
    let template = {
      template: 'sky',
      ascension: {
        hours: obj.asc_hours,
        minutes: obj.asc_minutes,
        seconds: obj.asc_seconds
      },
      declination: {
        sign: obj.dec_sign,
        degrees: obj.dec_degrees,
        minutes: obj.dec_minutes,
        seconds: obj.dec_seconds
      },
      distance: obj.distance
    };
    r.templates.push(template);
    return ''
  }
};
var science = templates$a;

let sports = {
  player: (tmpl, r) => {
    let res = parse$3(tmpl, ['number', 'country', 'name', 'dl']);
    r.templates.push(res);
    let str = `[[${res.name}]]`;
    if (res.country) {
      let country = (res.country || '').toLowerCase();
      let flag = flags.find(a => country === a[1] || country === a[2]) || [];
      if (flag && flag[0]) {
        str = flag[0] + '  ' + str;
      }
    }
    if (res.number) {
      str = res.number + ' ' + str;
    }
    return str
  },

  //https://en.wikipedia.org/wiki/Template:Goal
  goal: (tmpl, r) => {
    let res = parse$3(tmpl);
    let obj = {
      template: 'goal',
      data: []
    };
    let arr = res.list || [];
    for (let i = 0; i < arr.length; i += 2) {
      obj.data.push({
        min: arr[i],
        note: arr[i + 1] || ''
      });
    }
    r.templates.push(obj);
    //generate a little text summary
    let summary = '⚽ ';
    summary += obj.data
      .map(o => {
        let note = o.note;
        if (note) {
          note = ` (${note})`;
        }
        return o.min + "'" + note
      })
      .join(', ');
    return summary
  },
  //yellow card
  yel: (tmpl, r) => {
    let obj = parse$3(tmpl, ['min']);
    r.templates.push(obj);
    if (obj.min) {
      return `yellow: ${obj.min || ''}'` //no yellow-card emoji
    }
    return ''
  },
  subon: (tmpl, r) => {
    let obj = parse$3(tmpl, ['min']);
    r.templates.push(obj);
    if (obj.min) {
      return `sub on: ${obj.min || ''}'` //no yellow-card emoji
    }
    return ''
  },
  suboff: (tmpl, r) => {
    let obj = parse$3(tmpl, ['min']);
    r.templates.push(obj);
    if (obj.min) {
      return `sub off: ${obj.min || ''}'` //no yellow-card emoji
    }
    return ''
  },
  pengoal: (tmpl, r) => {
    r.templates.push({
      template: 'pengoal'
    });
    return '✅'
  },
  penmiss: (tmpl, r) => {
    r.templates.push({
      template: 'penmiss'
    });
    return '❌'
  },
  //'red' card - {{sent off|cards|min1|min2}}
  'sent off': (tmpl, r) => {
    let obj = parse$3(tmpl, ['cards']);
    let result = {
      template: 'sent off',
      cards: obj.cards,
      minutes: obj.list || []
    };
    r.templates.push(result);
    let mins = result.minutes.map(m => m + "'").join(', ');
    return 'sent off: ' + mins
  }
};
var soccer = sports;

const misc$3 = {
  'baseball secondary style': function(tmpl) {
    let obj = parse$3(tmpl, ['name']);
    return obj.name
  },
  mlbplayer: function(tmpl, r) {
    let obj = parse$3(tmpl, ['number', 'name', 'dl']);
    r.templates.push(obj);
    return obj.name
  }
};

var sports$1 = Object.assign({}, misc$3, brackets_1, soccer);

const codes$1 = {
  adx: 'adx', //https://en.wikipedia.org/wiki/Template:Abu_Dhabi_Securities_Exchange
  aim: 'aim', //https://en.wikipedia.org/wiki/Template:Alternative_Investment_Market
  bvpasa: 'bvpasa', //https://en.wikipedia.org/wiki/Template:BVPASA
  asx: 'asx', //https://en.wikipedia.org/wiki/Template:Australian_Securities_Exchange
  athex: 'athex', //https://en.wikipedia.org/wiki/Template:Athens_Exchange
  bhse: 'bhse', //https://en.wikipedia.org/wiki/Template:Bahrain_Bourse
  bvb: 'bvb', //https://en.wikipedia.org/wiki/Template:Bucharest_Stock_Exchange
  bbv: 'bbv', //https://en.wikipedia.org/wiki/Template:BBV
  bsx: 'bsx', //https://en.wikipedia.org/wiki/Template:Bermuda_Stock_Exchange
  b3: 'b3', //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
  'bm&f': 'b3', //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
  'bm&f bovespa': 'b3', //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
  bwse: 'bwse', //https://en.wikipedia.org/wiki/Template:Botswana_Stock_Exchange
  'botswana stock exchange': 'botswana stock exchange', //https://en.wikipedia.org/wiki/Template:BM%26F_Bovespa
  bse: 'bse', //https://en.wikipedia.org/wiki/Template:Bombay_Stock_Exchange
  'bombay stock exchange': 'bombay stock exchange', //https://en.wikipedia.org/wiki/Template:Bombay_Stock_Exchange
  bpse: 'bpse', //https://en.wikipedia.org/wiki/Template:Budapest_Stock_Exchange
  bcba: 'bcba', //https://en.wikipedia.org/wiki/Template:Buenos_Aires_Stock_Exchange
  'canadian securities exchange': 'canadian securities exchange', //https://en.wikipedia.org/wiki/Template:Canadian_Securities_Exchange
  bvc: 'bvc', //https://en.wikipedia.org/wiki/Template:Colombian_Securities_Exchange
  cse: 'cse', //https://en.wikipedia.org/wiki/Template:Chittagong_Stock_Exchange
  darse: 'darse', //https://en.wikipedia.org/wiki/Template:Dar_es_Salaam_Stock_Exchange
  dse: 'dse', //https://en.wikipedia.org/wiki/Template:Dhaka_Stock_Exchange
  dfm: 'dfm', //https://en.wikipedia.org/wiki/Template:Dubai_Financial_Market
  euronext: 'euronext', //https://en.wikipedia.org/wiki/Template:Euronext
  fwb: 'fwb', //https://en.wikipedia.org/wiki/Template:Frankfurt_Stock_Exchange
  fse: 'fse', //https://en.wikipedia.org/wiki/Template:Fukuoka_Stock_Exchange
  gse: 'gse', //https://en.wikipedia.org/wiki/Template:Ghana_Stock_Exchange
  gtsm: 'gtsm', //https://en.wikipedia.org/wiki/Template:Gre_Tai_Securities_Market
  sehk: 'sehk', //https://en.wikipedia.org/wiki/Template:Hong_Kong_Stock_Exchange
  idx: 'idx', //https://en.wikipedia.org/wiki/Template:Indonesia_Stock_Exchange
  nse: 'nse', //https://en.wikipedia.org/wiki/Template:National_Stock_Exchange_of_India
  ise: 'ise', //https://en.wikipedia.org/wiki/Template:Irish_Stock_Exchange
  isin: 'isin', //https://en.wikipedia.org/wiki/Template:ISIN
  bist: 'bist', //https://en.wikipedia.org/wiki/Template:Borsa_Istanbul
  bit: 'bit', //https://en.wikipedia.org/wiki/Template:Borsa_Italiana
  jasdaq: 'jasdaq', //https://en.wikipedia.org/wiki/Template:JASDAQ
  jse: 'jse', //https://en.wikipedia.org/wiki/Template:Johannesburg_Stock_Exchange
  kase: 'kase', //https://en.wikipedia.org/wiki/Template:Kazakhstan_Stock_Exchange
  krx: 'krx', //https://en.wikipedia.org/wiki/Template:Korea_Exchange
  bvl: 'bvl', //https://en.wikipedia.org/wiki/Template:Lima_Stock_Exchange
  lse: 'lse', //https://en.wikipedia.org/wiki/Template:London_Stock_Exchange
  luxse: 'luxse', //https://en.wikipedia.org/wiki/Template:Luxembourg_Stock_Exchange
  bmad: 'bmad', //https://en.wikipedia.org/wiki/Template:Bolsa_de_Madrid
  myx: 'myx', //https://en.wikipedia.org/wiki/Template:Bursa_Malaysia
  bmv: 'bmv', //https://en.wikipedia.org/wiki/Template:Mexican_Stock_Exchange
  mcx: 'mcx', //https://en.wikipedia.org/wiki/Template:Moscow_Exchange
  mutf: 'mutf', //https://en.wikipedia.org/wiki/Template:Mutual_fund
  nag: 'nag', //https://en.wikipedia.org/wiki/Template:Nagoya_Stock_Exchange
  kn: 'kn', //https://en.wikipedia.org/wiki/Template:Nairobi_Securities_Exchange
  'nasdaq dubai': 'nasdaq dubai', //https://en.wikipedia.org/wiki/Template:NASDAQ_Dubai
  nasdaq: 'nasdaq', //https://en.wikipedia.org/wiki/Template:NASDAQ
  neeq: 'neeq', //https://en.wikipedia.org/wiki/Template:NEEQ
  nepse: 'nepse', //https://en.wikipedia.org/wiki/Template:Nepal_Stock_Exchange
  nyse: 'nyse', //https://en.wikipedia.org/wiki/Template:New_York_Stock_Exchange
  nzx: 'nzx', //https://en.wikipedia.org/wiki/Template:New_Zealand_Exchange
  amex: 'amex', //https://en.wikipedia.org/wiki/Template:NYSE_American
  'nyse arca': 'nyse arca', //https://en.wikipedia.org/wiki/Template:NYSE_Arca
  omx: 'omx', //https://en.wikipedia.org/wiki/Template:OMX
  'omx baltic': 'omx baltic', //https://en.wikipedia.org/wiki/Template:OMX_Baltic
  ose: 'ose', //https://en.wikipedia.org/wiki/Template:Oslo_Stock_Exchange
  'otc pink': 'otc pink', //https://en.wikipedia.org/wiki/Template:OTC_Pink
  otcqb: 'otcqb', //https://en.wikipedia.org/wiki/Template:OTCQB
  otcqx: 'otcqx', //https://en.wikipedia.org/wiki/Template:OTCQX
  'philippine stock exchange': 'philippine stock exchange', //https://en.wikipedia.org/wiki/Template:Philippine_Stock_Exchange
  prse: 'prse', //https://en.wikipedia.org/wiki/Template:Prague_Stock_Exchange
  qe: 'qe', //https://en.wikipedia.org/wiki/Template:Qatar_Stock_Exchange
  bcs: 'bcs', //https://en.wikipedia.org/wiki/Template:Santiago_Stock_Exchange
  'saudi stock exchange': 'saudi stock exchange', //https://en.wikipedia.org/wiki/Template:Saudi_Stock_Exchange
  sgx: 'sgx', //https://en.wikipedia.org/wiki/Template:Singapore_Exchange
  sse: 'sse', //https://en.wikipedia.org/wiki/Template:Shanghai_Stock_Exchange
  szse: 'szse', //https://en.wikipedia.org/wiki/Template:Shenzhen_Stock_Exchange
  swx: 'swx', //https://en.wikipedia.org/wiki/Template:SIX_Swiss_Exchange
  set: 'set', //https://en.wikipedia.org/wiki/Template:Stock_Exchange_of_Thailand
  tase: 'tase', //https://en.wikipedia.org/wiki/Template:Tel_Aviv_Stock_Exchange
  tyo: 'tyo', //https://en.wikipedia.org/wiki/Template:Tokyo_Stock_Exchange
  tsx: 'tsx', //https://en.wikipedia.org/wiki/Template:Toronto_Stock_Exchange
  twse: 'twse', //https://en.wikipedia.org/wiki/Template:Taiwan_Stock_Exchange
  'tsx-v': 'tsx-v', //https://en.wikipedia.org/wiki/Template:TSX_Venture_Exchange
  tsxv: 'tsxv', //https://en.wikipedia.org/wiki/Template:TSX_Venture_Exchange
  nex: 'nex', //https://en.wikipedia.org/wiki/Template:TSXV_NEX
  ttse: 'ttse', //https://en.wikipedia.org/wiki/Template:Trinidad_and_Tobago_Stock_Exchange
  'pfts ukraine stock exchange': 'pfts ukraine stock exchange', //https://en.wikipedia.org/wiki/Template:PFTS_Ukraine_Stock_Exchange
  wse: 'wse', //https://en.wikipedia.org/wiki/Template:Warsaw_Stock_Exchange
  wbag: 'wbag', //https://en.wikipedia.org/wiki/Template:Wiener_B%C3%B6rse
  zse: 'zse', //https://en.wikipedia.org/wiki/Template:Zagreb_Stock_Exchange
  'zagreb stock exchange': 'zagreb stock exchange', //https://en.wikipedia.org/wiki/Template:Zagreb_Stock_Exchange
  'zimbabwe stock exchange': 'zimbabwe stock exchange' //https://en.wikipedia.org/wiki/Template:Zimbabwe_Stock_Exchange
};

const parseStockExchange = (tmpl, r) => {
  let o = parse$3(tmpl, ['ticketnumber', 'code']);
  r.templates.push(o);
  let code = o.template || '';
  if (code === '') {
    code = o.code;
  }
  code = (code || '').toLowerCase();
  let out = codes$1[code] || '';
  let str = out;
  if (o.ticketnumber) {
    str = `${str}: ${o.ticketnumber}`;
  }
  if (o.code && !codes$1[o.code.toLowerCase()]) {
    str += ' ' + o.code;
  }
  return str
};

const currencies$1 = {};
//the others fit the same pattern..
Object.keys(codes$1).forEach(k => {
  currencies$1[k] = parseStockExchange;
});

var stockExchanges = currencies$1;

const hasMonth = /^jan /i;
const isYear = /^year /i;

const monthList = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec'
];

const toNumber = function(str) {
  str = str.replace(/,/g, '');
  str = str.replace(/−/g, '-');
  let num = Number(str);
  if (isNaN(num)) {
    return str
  }
  return num
};

let templates$b = {
  // this one is a handful!
  //https://en.wikipedia.org/wiki/Template:Weather_box
  'weather box': (tmpl, r) => {
    let obj = parse$3(tmpl);
    //collect all month-based data
    let byMonth = {};
    let properties = Object.keys(obj).filter(k => hasMonth.test(k));
    properties = properties.map(k => k.replace(hasMonth, ''));
    properties.forEach(prop => {
      byMonth[prop] = [];
      monthList.forEach(m => {
        let key = `${m} ${prop}`;
        if (obj.hasOwnProperty(key)) {
          let num = toNumber(obj[key]);
          delete obj[key];
          byMonth[prop].push(num);
        }
      });
    });
    //add these to original
    obj.byMonth = byMonth;

    //collect year-based data
    let byYear = {};
    Object.keys(obj).forEach(k => {
      if (isYear.test(k)) {
        let prop = k.replace(isYear, '');
        byYear[prop] = obj[k];
        delete obj[k];
      }
    });
    obj.byYear = byYear;

    r.templates.push(obj);
    return ''
  },

  //The 36 parameters are: 12 monthly highs (C), 12 lows (total 24) plus an optional 12 monthly rain/precipitation
  //https://en.wikipedia.org/wiki/Template:Weather_box/concise_C
  'weather box/concise c': (tmpl, r) => {
    let obj = parse$3(tmpl);
    obj.list = obj.list.map(s => toNumber(s));
    obj.byMonth = {
      'high c': obj.list.slice(0, 12),
      'low c': obj.list.slice(12, 24),
      'rain mm': obj.list.slice(24, 36)
    };
    delete obj.list;
    obj.template = 'weather box';
    r.templates.push(obj);
    return ''
  },
  'weather box/concise f': (tmpl, r) => {
    let obj = parse$3(tmpl);
    obj.list = obj.list.map(s => toNumber(s));
    obj.byMonth = {
      'high f': obj.list.slice(0, 12),
      'low f': obj.list.slice(12, 24),
      'rain inch': obj.list.slice(24, 36)
    };
    delete obj.list;
    obj.template = 'weather box';
    r.templates.push(obj);
    return ''
  },

  //https://en.wikipedia.org/wiki/Template:Climate_chart
  'climate chart': (tmpl, r) => {
    let list = parse$3(tmpl).list || [];
    let title = list[0];
    let source = list[38];
    list = list.slice(1);
    //amazingly, they use '−' symbol here instead of negatives...
    list = list.map(str => {
      if (str && str[0] === '−') {
        str = str.replace(/−/, '-');
      }
      return str
    });
    let months = [];
    //groups of three, for 12 months
    for (let i = 0; i < 36; i += 3) {
      months.push({
        low: toNumber(list[i]),
        high: toNumber(list[i + 1]),
        precip: toNumber(list[i + 2])
      });
    }
    let obj = {
      template: 'climate chart',
      data: {
        title: title,
        source: source,
        months: months
      }
    };
    r.templates.push(obj);
    return ''
  }
};

var weather = templates$b;

//this format seems to be a pattern for these
const generic = ['id', 'title', 'description', 'section'];
const idName = ['id', 'name'];

//https://en.wikipedia.org/wiki/Category:External_link_templates
const externals = {
  //https://en.wikipedia.org/wiki/Template:IMDb_title
  'imdb title': generic,
  'imdb name': generic,
  'imdb episode': generic,
  'imdb event': generic,
  'afi film': generic,
  'allmovie title': generic,
  allgame: generic,
  'tcmdb title': generic,
  'discogs artist': generic,
  'discogs label': generic,
  'discogs release': generic,
  'discogs master': generic,
  'librivox author': generic,
  'musicbrainz artist': generic,
  'musicbrainz label': generic,
  'musicbrainz recording': generic,
  'musicbrainz release': generic,
  'musicbrainz work': generic,
  youtube: generic,
  'goodreads author': idName,
  'goodreads book': generic,
  twitter: idName,
  facebook: idName,
  instagram: idName,
  tumblr: idName,
  pinterest: idName,
  'espn nfl': idName,
  'espn nhl': idName,
  'espn fc': idName,
  hockeydb: idName,
  'fifa player': idName,
  worldcat: idName,
  'worldcat id': idName,
  'nfl player': idName,
  'ted speaker': idName,
  playmate: idName,
  //https://en.wikipedia.org/wiki/Template:DMOZ
  dmoz: generic,

  'find a grave': ['id', 'name', 'work', 'last', 'first', 'date', 'accessdate'],

  congbio: ['id', 'name', 'date'],

  'hollywood walk of fame': ['name']
};
//alias
externals.imdb = externals['imdb name'];
externals['imdb episodess'] = externals['imdb episode'];
var websites = externals;

// const strip = require('./_parsers/_strip');

//wiktionary... who knows. we should atleast try.
const templates$c = {
  //{{inflection of|avoir||3|p|pres|ind|lang=fr}}
  //https://en.wiktionary.org/wiki/Template:inflection_of
  inflection: (tmpl, r) => {
    let obj = parse$3(tmpl, ['lemma']);
    obj.tags = obj.list;
    delete obj.list;
    obj.type = 'form-of';
    r.templates.push(obj);
    return obj.lemma || ''
  },

  //latin verbs
  'la-verb-form': (tmpl, r) => {
    let obj = parse$3(tmpl, ['word']);
    r.templates.push(obj);
    return obj.word || ''
  },
  'feminine plural': (tmpl, r) => {
    let obj = parse$3(tmpl, ['word']);
    r.templates.push(obj);
    return obj.word || ''
  },
  'male plural': (tmpl, r) => {
    let obj = parse$3(tmpl, ['word']);
    r.templates.push(obj);
    return obj.word || ''
  },
  rhymes: (tmpl, r) => {
    let obj = parse$3(tmpl, ['word']);
    r.templates.push(obj);
    return 'Rhymes: -' + (obj.word || '')
  }
};

//https://en.wiktionary.org/wiki/Category:Form-of_templates
let conjugations = [
  'abbreviation',
  'abessive plural',
  'abessive singular',
  'accusative plural',
  'accusative singular',
  'accusative',
  'acronym',
  'active participle',
  'agent noun',
  'alternative case form',
  'alternative form',
  'alternative plural',
  'alternative reconstruction',
  'alternative spelling',
  'alternative typography',
  'aphetic form',
  'apocopic form',
  'archaic form',
  'archaic spelling',
  'aspirate mutation',
  'associative plural',
  'associative singular',
  'attributive form',
  'attributive form',
  'augmentative',
  'benefactive plural',
  'benefactive singular',
  'causative plural',
  'causative singular',
  'causative',
  'clipping',
  'combining form',
  'comitative plural',
  'comitative singular',
  'comparative plural',
  'comparative singular',
  'comparative',
  'contraction',
  'dated form',
  'dated spelling',
  'dative plural definite',
  'dative plural indefinite',
  'dative plural',
  'dative singular',
  'dative',
  'definite',
  'deliberate misspelling',
  'diminutive',
  'distributive plural',
  'distributive singular',
  'dual',
  'early form',
  'eclipsis',
  'elative',
  'ellipsis',
  'equative',
  'euphemistic form',
  'euphemistic spelling',
  'exclusive plural',
  'exclusive singular',
  'eye dialect',
  'feminine noun',
  'feminine plural past participle',
  'feminine plural',
  'feminine singular past participle',
  'feminine singular',
  'feminine',
  'form',
  'former name',
  'frequentative',
  'future participle',
  'genitive plural definite',
  'genitive plural indefinite',
  'genitive plural',
  'genitive singular definite',
  'genitive singular indefinite',
  'genitive singular',
  'genitive',
  'gerund',
  'h-prothesis',
  'hard mutation',
  'harmonic variant',
  'imperative',
  'imperfective form',
  'inflected form',
  'inflection',
  'informal form',
  'informal spelling',
  'initialism',
  'ja-form',
  'jyutping reading',
  'late form',
  'lenition',
  'masculine plural past participle',
  'masculine plural',
  'medieval spelling',
  'misconstruction',
  'misromanization',
  'misspelling',
  'mixed mutation',
  'monotonic form',
  'mutation',
  'nasal mutation',
  'negative',
  'neuter plural past participle',
  'neuter plural',
  'neuter singular past participle',
  'neuter singular',
  'nominalization',
  'nominative plural',
  'nominative singular',
  'nonstandard form',
  'nonstandard spelling',
  'oblique plural',
  'oblique singular',
  'obsolete form',
  'obsolete spelling',
  'obsolete typography',
  'official form',
  'participle',
  'passive participle',
  'passive',
  'past active participle',
  'past participle',
  'past passive participle',
  'past tense',
  'perfective form',
  'plural definite',
  'plural indefinite',
  'plural',
  'polytonic form',
  'present active participle',
  'present participle',
  'present tense',
  'pronunciation spelling',
  'rare form',
  'rare spelling',
  'reflexive',
  'second-person singular past',
  'short for',
  'singular definite',
  'singular',
  'singulative',
  'soft mutation',
  'spelling',
  'standard form',
  'standard spelling',
  'substantivisation',
  'superlative',
  'superseded spelling',
  'supine',
  'syncopic form',
  'synonym',
  'terminative plural',
  'terminative singular',
  'uncommon form',
  'uncommon spelling',
  'verbal noun',
  'vocative plural',
  'vocative singular'
];
conjugations.forEach(name => {
  templates$c[name + ' of'] = (tmpl, r) => {
    let obj = parse$3(tmpl, ['lemma']);
    obj.tags = obj.list;
    delete obj.list;
    obj.type = 'form-of';
    r.templates.push(obj);
    return obj.lemma || ''
  };
});
var wiktionary = templates$c;

var templates$d = Object.assign(
  {},
  dates,
  formatting$1,
  geo,
  wikipedia,

  brackets_1,
  currency,
  elections,
  flags_1,
  ipa,
  languages_1,
  math,
  misc_1$1,
  punctuation_1,
  science,
  soccer,
  sports$1,
  stockExchanges,
  weather,
  websites,
  wiktionary
);

const generic$1 = parse$3;

const isArray$1 = function(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
};

// console.log(Object.keys(templates).length + ' Templates!');

//this gets all the {{template}} strings and decides how to parse them
const parseTemplate = function(tmpl, wiki, data) {
  let name = _getName(tmpl);
  //we explicitly ignore these templates
  if (_ignore.hasOwnProperty(name) === true) {
    wiki = wiki.replace(tmpl, '');
    return wiki
  }

  //match any known template forms (~1,000!)
  if (templates$d.hasOwnProperty(name) === true) {
    // handle generic shortened array-sytax
    if (isArray$1(templates$d[name]) === true) {
      let order = templates$d[name];
      let obj = generic$1(tmpl, order);
      data.templates.push(obj);
      wiki = wiki.replace(tmpl, '');
      return wiki
    }
    //do full function syntax
    let str = templates$d[name](tmpl, data);
    wiki = wiki.replace(tmpl, str);
    return wiki
  }
  // {{infobox settlement...}}
  if (_infobox.isInfobox(name) === true) {
    let obj = parse$3(tmpl, data, 'raw');
    let infobox = _infobox.format(obj);
    data.templates.push(infobox);
    wiki = wiki.replace(tmpl, '');
    return wiki
  }
  //cite book, cite arxiv...
  if (/^cite [a-z]/.test(name) === true) {
    let obj = parse$3(tmpl, data);
    data.templates.push(obj);
    wiki = wiki.replace(tmpl, '');
    return wiki
  }
  //fallback parser
  let obj = parse$3(tmpl);
  if (obj !== null && Object.keys(obj).length > 0) {
    data.templates.push(obj);
  }
  wiki = wiki.replace(tmpl, '');
  return wiki
};
var parse_1 = parseTemplate;

const isCitation = new RegExp('^(cite |citation)', 'i');
const citations = {
  citation: true,
  refn: true,
  harvnb: true
};
//ensure references and infoboxes at least look valid
const isObject = function(x) {
  return typeof x === 'object' && x !== null && x.constructor.toString().indexOf('Array') === -1
};

//reduce the scary recursive situations
const parseTemplates = function(wiki, data, options) {
  let templates = _getTemplates(wiki);
  //first, do the nested (second level) ones
  templates.nested.forEach(tmpl => {
    wiki = parse_1(tmpl, wiki, data);
  });
  //then, reparse wiki for the top-level ones
  templates = _getTemplates(wiki);

  //okay if we have a 3-level-deep template, do it again (but no further)
  if (templates.nested.length > 0) {
    templates.nested.forEach(tmpl => {
      wiki = parse_1(tmpl, wiki, data);
    });
    templates = _getTemplates(wiki); //this is getting crazy.
  }
  //okay, top-level
  templates.top.forEach(tmpl => {
    wiki = parse_1(tmpl, wiki, data);
  });
  //lastly, move citations + infoboxes out of our templates list
  let clean = [];
  data.templates.forEach(o => {
    //it's possible that we've parsed a reference, that we missed earlier
    if (citations[o.template] === true || isCitation.test(o.template) === true) {
      data.references = data.references || [];
      data.references.push(new Reference_1(o));
      return
    }
    if (o.template === 'infobox' && o.data && isObject(o.data)) {
      data.infoboxes = data.infoboxes || [];
      data.infoboxes.push(new Infobox_1(o));
      return
    }
    clean.push(new Template_1(o));
  });
  data.templates = clean;
  return wiki
};

var template$1 = parseTemplates;

const parseSentence$6 = _04Sentence.oneSentence;

//okay, <gallery> is a xml-tag, with newline-seperated data, somehow pivoted by '|'...
//all deities help us. truly -> https://en.wikipedia.org/wiki/Help:Gallery_tag
// - not to be confused with https://en.wikipedia.org/wiki/Template:Gallery...
const parseGallery = function(wiki, section) {
  wiki = wiki.replace(/<gallery([^>]*?)>([\s\S]+?)<\/gallery>/g, (_, attrs, inside) => {
    let images = inside.split(/\n/g);
    images = images.filter(str => str && str.trim() !== '');
    //parse the line, which has an image and sometimes a caption
    images = images.map(str => {
      let arr = str.split(/\|/);
      let obj = {
        file: arr[0].trim()
      };
      let img = new Image_1(obj).json();
      let caption = arr.slice(1).join('|');
      if (caption !== '') {
        img.caption = parseSentence$6(caption);
      }
      return img
    });
    //add it to our templates list
    if (images.length > 0) {
      section.templates.push({
        template: 'gallery',
        images: images,
        pos: section.title
      });
    }
    return ''
  });
  return wiki
};
var gallery = parseGallery;

//this is a non-traditional template, for some reason
//https://en.wikipedia.org/wiki/Template:Election_box
const parseElection = function(wiki, section) {
  wiki = wiki.replace(/\{\{election box begin([\s\S]+?)\{\{election box end\}\}/gi, tmpl => {
    let data = {
      templates: []
    };
    //put it through our full template parser..
    template$1(tmpl, data);
    //okay, pull it apart into something sensible..
    let templates = data.templates.map(t => t.json());
    let start = templates.find(t => t.template === 'election box') || {};
    let candidates = templates.filter(t => t.template === 'election box candidate');
    let summary =
      templates.find(
        t => t.template === 'election box gain' || t.template === 'election box hold'
      ) || {};
    if (candidates.length > 0 || summary) {
      section.templates.push({
        template: 'election box',
        title: start.title,
        candidates: candidates,
        summary: summary.data
      });
    }
    //remove it all
    return ''
  });
  return wiki
};
var election = parseElection;

const keys = {
  coach: ['team', 'year', 'g', 'w', 'l', 'w-l%', 'finish', 'pg', 'pw', 'pl', 'pw-l%'],
  player: [
    'year',
    'team',
    'gp',
    'gs',
    'mpg',
    'fg%',
    '3p%',
    'ft%',
    'rpg',
    'apg',
    'spg',
    'bpg',
    'ppg'
  ],
  roster: ['player', 'gp', 'gs', 'mpg', 'fg%', '3fg%', 'ft%', 'rpg', 'apg', 'spg', 'bpg', 'ppg']
};

//https://en.wikipedia.org/wiki/Template:NBA_player_statistics_start
const parseNBA = function(wiki, section) {
  wiki = wiki.replace(
    /\{\{nba (coach|player|roster) statistics start([\s\S]+?)\{\{s-end\}\}/gi,
    (tmpl, name) => {
      tmpl = tmpl.replace(/^\{\{.*?\}\}/, '');
      tmpl = tmpl.replace(/\{\{s-end\}\}/, '');
      name = name.toLowerCase().trim();
      let headers = '! ' + keys[name].join(' !! ');
      let table = '{|\n' + headers + '\n' + tmpl + '\n|}';
      let rows = parse$4(table);

      rows = rows.map(row => {
        Object.keys(row).forEach(k => {
          row[k] = row[k].text();
        });
        return row
      });
      section.templates.push({
        template: 'NBA ' + name + ' statistics',
        data: rows
      });
      return ''
    }
  );
  return wiki
};
var nba = parseNBA;

//https://en.wikipedia.org/wiki/Template:MLB_game_log_section

//this is pretty nuts
const whichHeadings = function(tmpl) {
  let headings = ['#', 'date', 'opponent', 'score', 'win', 'loss', 'save', 'attendance', 'record'];
  if (/\|stadium=y/i.test(tmpl) === true) {
    headings.splice(7, 0, 'stadium'); //save, stadium, attendance
  }
  if (/\|time=y/i.test(tmpl) === true) {
    headings.splice(7, 0, 'time'); //save, time, stadium, attendance
  }
  if (/\|box=y/i.test(tmpl) === true) {
    headings.push('box'); //record, box
  }
  return headings
};

const parseMlb = function(wiki, section) {
  wiki = wiki.replace(
    /\{\{mlb game log (section|month)[\s\S]+?\{\{mlb game log (section|month) end\}\}/gi,
    tmpl => {
      let headings = whichHeadings(tmpl);
      tmpl = tmpl.replace(/^\{\{.*?\}\}/, '');
      tmpl = tmpl.replace(/\{\{mlb game log (section|month) end\}\}/i, '');
      let headers = '! ' + headings.join(' !! ');
      let table = '{|\n' + headers + '\n' + tmpl + '\n|}';
      let rows = parse$4(table);
      rows = rows.map(row => {
        Object.keys(row).forEach(k => {
          row[k] = row[k].text();
        });
        return row
      });
      section.templates.push({
        template: 'mlb game log section',
        data: rows
      });
      return ''
    }
  );
  return wiki
};
var mlb = parseMlb;

let headings$1 = [
  'res',
  'record',
  'opponent',
  'method',
  'event',
  'date',
  'round',
  'time',
  'location',
  'notes'
];

//https://en.wikipedia.org/wiki/Template:MMA_record_start
const parseMMA = function(wiki, section) {
  wiki = wiki.replace(/\{\{mma record start[\s\S]+?\{\{end\}\}/gi, tmpl => {
    tmpl = tmpl.replace(/^\{\{.*?\}\}/, '');
    tmpl = tmpl.replace(/\{\{end\}\}/i, '');
    let headers = '! ' + headings$1.join(' !! ');
    let table = '{|\n' + headers + '\n' + tmpl + '\n|}';
    let rows = parse$4(table);
    rows = rows.map(row => {
      Object.keys(row).forEach(k => {
        row[k] = row[k].text();
      });
      return row
    });
    section.templates.push({
      template: 'mma record start',
      data: rows
    });
    return ''
  });
  return wiki
};
var mma = parseMMA;

const parseSentence$7 = _04Sentence.oneSentence;
//xml <math>y=mx+b</math> support
//https://en.wikipedia.org/wiki/Help:Displaying_a_formula
const parseMath = function(wiki, section) {
  wiki = wiki.replace(/<math([^>]*?)>([\s\S]+?)<\/math>/g, (_, attrs, inside) => {
    //clean it up a little?
    let formula = parseSentence$7(inside).text();
    section.templates.push({
      template: 'math',
      formula: formula,
      raw: inside
    });
    //should we atleast try to render it in plaintext? :/
    if (formula && formula.length < 12) {
      return formula
    }
    return ''
  });
  //try chemistry version too
  wiki = wiki.replace(/<chem([^>]*?)>([\s\S]+?)<\/chem>/g, (_, attrs, inside) => {
    section.templates.push({
      template: 'chem',
      data: inside
    });
    return ''
  });
  return wiki
};
var math$1 = parseMath;

// Most templates are '{{template}}', but then, some are '<template></template>'.
// ... others are {{start}}...{{end}}
// -> these are those ones.
const xmlTemplates = function(section, wiki) {
  wiki = gallery(wiki, section);
  wiki = election(wiki, section);
  wiki = math$1(wiki, section);
  wiki = nba(wiki, section);
  wiki = mma(wiki, section);
  wiki = mlb(wiki, section);
  return wiki
};

var startToEnd = xmlTemplates;

const isReference = /^(references?|einzelnachweise|referencias|références|notes et références|脚注|referenser|bronnen|примечания):?/i; //todo support more languages
const section_reg = /(?:\n|^)(={2,5}.{1,200}?={2,5})/g;

//interpret ==heading== lines
const parse$6 = {
  heading: heading,
  table: table,
  paragraphs: _03Paragraph,
  templates: template$1,
  references: reference,
  startEndTemplates: startToEnd
};

const oneSection = function(wiki, data, options) {
  wiki = parse$6.startEndTemplates(data, wiki, options);
  //parse-out the <ref></ref> tags
  wiki = parse$6.references(wiki, data);
  //parse-out all {{templates}}
  wiki = parse$6.templates(wiki, data, options);
  // //parse the tables
  wiki = parse$6.table(data, wiki);
  //now parse all double-newlines
  let res = parse$6.paragraphs(wiki, options);
  data.paragraphs = res.paragraphs;
  wiki = res.wiki;
  data = new Section_1(data, wiki);
  return data
};

const removeReferenceSection = function(sections) {
  return sections.filter((s, i) => {
    if (isReference.test(s.title()) === true) {
      if (s.paragraphs().length > 0) {
        return true
      }
      //does it have some wacky templates?
      if (s.templates().length > 0) {
        return true
      }
      //what it has children? awkward
      if (sections[i + 1] && sections[i + 1].depth > s.depth) {
        sections[i + 1].depth -= 1; //move it up a level?...
      }
      return false
    }
    return true
  })
};

const parseSections = function(wiki, options) {
  let split = wiki.split(section_reg);
  let sections = [];
  for (let i = 0; i < split.length; i += 2) {
    let heading = split[i - 1] || '';
    let content = split[i] || '';
    if (content === '' && heading === '') {
      //usually an empty 'intro' section
      continue
    }
    let data = {
      title: '',
      depth: null,
      templates: [],
      infoboxes: [],
      references: []
    };
    //figure-out title/depth
    parse$6.heading(data, heading);
    //parse it up
    let s = oneSection(content, data, options);
    sections.push(s);
  }
  //remove empty references section
  sections = removeReferenceSection(sections);

  return sections
};

var _02Section = parseSections;

const cat_reg$1 = new RegExp(
  '\\[\\[:?(' + i18n_1.categories.join('|') + '):(.{2,178}?)]](w{0,10})',
  'ig'
);
const cat_remove_reg = new RegExp('^\\[\\[:?(' + i18n_1.categories.join('|') + '):', 'ig');

const parse_categories = function(r, wiki) {
  r.categories = [];
  let tmp = wiki.match(cat_reg$1); //regular links
  if (tmp) {
    tmp.forEach(function(c) {
      c = c.replace(cat_remove_reg, '');
      c = c.replace(/\|?[ \*]?\]\]$/i, ''); //parse fancy onces..
      c = c.replace(/\|.*/, ''); //everything after the '|' is metadata
      if (c && !c.match(/[\[\]]/)) {
        r.categories.push(c.trim());
      }
    });
  }
  wiki = wiki.replace(cat_reg$1, '');
  return wiki
};
var categories = parse_categories;

const parse$7 = {
  section: _02Section,
  categories: categories
};

//convert wikiscript markup lang to json
const main = function(wiki, options) {
  options = options || {};
  wiki = wiki || '';
  let data = {
    type: 'page',
    title: '',
    sections: [],
    categories: [],
    coordinates: []
  };
  //detect if page is just redirect, and return it
  if (redirects.isRedirect(wiki) === true) {
    data.type = 'redirect';
    data.redirectTo = redirects.parse(wiki);
    parse$7.categories(data, wiki);
    return new Document_1(data, options)
  }
  //detect if page is just disambiguator page, and return
  if (disambig.isDisambig(wiki) === true) {
    data.type = 'disambiguation';
  }
  if (options.page_identifier) {
    data.page_identifier = options.page_identifier;
  }
  if (options.lang_or_wikiid) {
    data.lang_or_wikiid = options.lang_or_wikiid;
  }
  //give ourselves a little head-start
  wiki = preProcess_1(data, wiki);
  //pull-out [[category:whatevers]]
  wiki = parse$7.categories(data, wiki);
  //parse all the headings, and their texts/sentences
  data.sections = parse$7.section(wiki, options) || [];
  //all together now
  return new Document_1(data, options)
};

var _01Document = main;

// flip response object into proper Doc objs
const parseDoc = function(res) {
  let docs = res.map(o => {
    return _01Document(o.wiki, o.meta)
  });
  if (docs.length === 1) {
    return docs[0]
  }
  return docs
};
var _03ParseDoc = parseDoc;

// use the native nodejs request function
const request = function(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, resp => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', chunk => {
          data += chunk;
        });
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          try {
            let json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', err => {
        reject(err);
      });
  })
};
var server$1 = request;

const isUrl = /^https?:\/\//;

const defaults$b = {
  lang: 'en',
  wiki: 'wikipedia',
  domain: null,
  follow_redirects: true,
  path: 'api.php' //some 3rd party sites use a weird path
};

const fetch = function(title, options) {
  //support lang 2nd param
  if (typeof options === 'string') {
    options = { lang: options };
  }
  options = options || {};
  options = Object.assign(defaults$b, options);
  options.title = title;

  // parse url input
  if (isUrl.test(title)) {
    options = Object.assign(options, _00ParseUrl(title));
  }
  const url = _01MakeUrl(options);
  return server$1(url)
    .then(res => {
      let data = _02GetResult(res);
      return _03ParseDoc(data)
    })
    .catch(e => console.error(e))
};
var _fetch = fetch;

const fetchRandom = function() {};
var random = fetchRandom;

const fetchCategory = function(category, options) {};
var category = fetchCategory;

var _version = '7.4.2';

// export classes for plugin development
const models = {
  Doc: Document_1,
  Section: Section_1,
  Paragraph: Paragraph_1,
  Sentence: Sentence_1,
  Image: Image_1,
  Infobox: Infobox_1,
  Link: Link_1,
  List: List_1,
  Reference: Reference_1,
  Table: Table_1,
  Template: Template_1
};


//the main 'factory' exported method
const wtf = function(wiki, options) {
  return _01Document(wiki, options)
};
wtf.fetch = function(title, lang, options, cb) {
  return _fetch(title, lang)
};
wtf.random = function(lang, options, cb) {
  return random()
};
wtf.category = function(cat, lang, options, cb) {
  return category()
};
wtf.extend = function(fn) {
  fn(models, templates$d, this);
  return this
};
wtf.version = _version;

var src = wtf;

export default src;