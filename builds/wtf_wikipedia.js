/* wtf_wikipedia v7.2.8
   github.com/spencermountain/wtf_wikipedia
   MIT
*/

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wtf = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
var __root__ = (function (root) {
function F() { this.fetch = false; }
F.prototype = root;
return new F();
})(typeof self !== 'undefined' ? self : this);
(function(self) {

(function(self) {

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

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

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    };

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
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
    this.map[name] = oldValue ? oldValue+','+value : value;
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
    this.forEach(function(value, name) { items.push(name); });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) { items.push(value); });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) { items.push([name, value]); });
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
        throw new Error('unsupported BodyInit type')
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
    return (methods.indexOf(upcased) > -1) ? upcased : method
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
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'omit';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  };

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function(bytes) {
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

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);
      var xhr = new XMLHttpRequest();

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

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  };
  self.fetch.polyfill = true;
})(typeof self !== 'undefined' ? self : this);
}).call(__root__, void(0));
var fetch = __root__.fetch;
var Response = fetch.Response = __root__.Response;
var Request = fetch.Request = __root__.Request;
var Headers = fetch.Headers = __root__.Headers;
if (typeof module === 'object' && module.exports) {
module.exports = fetch;
// Needed for TypeScript consumers without esModuleInterop.
module.exports.default = fetch;
}

},{}],2:[function(_dereq_,module,exports){
module.exports={
  "name": "wtf_wikipedia",
  "description": "parse wikiscript into json",
  "version": "7.2.8",
  "author": "Spencer Kelly <spencermountain@gmail.com> (http://spencermounta.in)",
  "repository": {
    "type": "git",
    "url": "git://github.com/spencermountain/wtf_wikipedia.git"
  },
  "main": "src/index.js",
  "unpkg": "builds/wtf_wikipedia.min.js",
  "scripts": {
    "start": "node ./scripts/demo.js",
    "test": "node ./scripts/test.js",
    "test-spec": "tape ./tests/*.test.js | tap-spec",
    "coverage": "node scripts/coverage.js",
    "postpublish": "node ./scripts/coverage.js",
    "testb": "TESTENV=prod node ./scripts/test.js",
    "watch": "amble ./scratch.js",
    "build": "node ./scripts/build.js",
    "lint": "eslint ./src/**/*.js"
  },
  "bin": {
    "wtf_wikipedia": "./bin/wtf.js"
  },
  "engines": {
    "node": ">=6.0.0"
  },
  "files": [
    "builds",
    "api",
    "src",
    "bin"
  ],
  "keywords": [
    "wikipedia",
    "wikimedia",
    "wikipedia markup",
    "wikiscript"
  ],
  "dependencies": {
    "cross-fetch": "2.2.3"
  },
  "devDependencies": {
    "@babel/core": "7.2.0",
    "@babel/preset-env": "7.2.0",
    "amble": "0.0.7",
    "babelify": "10.0.0",
    "browserify": "16.2.3",
    "codecov": "3.1.0",
    "derequire": "2.0.6",
    "nyc": "13.1.0",
    "shelljs": "0.8.3",
    "tap-dancer": "0.1.2",
    "tap-spec": "5.0.0",
    "tape": "4.9.1",
    "terser": "^3.12.0"
  },
  "license": "MIT"
}
},{}],3:[function(_dereq_,module,exports){
"use strict";

var sectionMap = _dereq_('./_sectionMap');

var toMarkdown = _dereq_('./toMarkdown');

var toHtml = _dereq_('./toHtml');

var toJSON = _dereq_('./toJson');

var toLatex = _dereq_('./toLatex');

var setDefaults = _dereq_('../_lib/setDefaults');

var aliasList = _dereq_('../_lib/aliases');

var Image = _dereq_('../image/Image');

var defaults = {
  tables: true,
  lists: true,
  paragraphs: true
}; //

var Document = function Document(data, options) {
  this.options = options || {};
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

var methods = {
  title: function title() {
    if (this.options.title) {
      return this.options.title;
    }

    var guess = null; //guess the title of this page from first sentence bolding

    var sen = this.sentences(0);

    if (sen) {
      guess = sen.bolds(0);
    }

    return guess;
  },
  isRedirect: function isRedirect() {
    return this.data.type === 'redirect';
  },
  redirectTo: function redirectTo() {
    return this.data.redirectTo;
  },
  isDisambiguation: function isDisambiguation() {
    return this.data.type === 'disambiguation';
  },
  categories: function categories(clue) {
    if (typeof clue === 'number') {
      return this.data.categories[clue];
    }

    return this.data.categories || [];
  },
  sections: function sections(clue) {
    var _this = this;

    var arr = this.data.sections || [];
    arr.forEach(function (sec) {
      return sec.doc = _this;
    }); //grab a specific section, by its title

    if (typeof clue === 'string') {
      var str = clue.toLowerCase().trim();
      return arr.find(function (s) {
        return s.title().toLowerCase() === str;
      });
    }

    if (typeof clue === 'number') {
      return arr[clue];
    }

    return arr;
  },
  paragraphs: function paragraphs(n) {
    var arr = [];
    this.data.sections.forEach(function (s) {
      arr = arr.concat(s.paragraphs());
    });

    if (typeof n === 'number') {
      return arr[n];
    }

    return arr;
  },
  paragraph: function paragraph(n) {
    var arr = this.paragraphs() || [];

    if (typeof n === 'number') {
      return arr[n];
    }

    return arr[0];
  },
  sentences: function sentences(n) {
    var arr = [];
    this.sections().forEach(function (sec) {
      arr = arr.concat(sec.sentences());
    });

    if (typeof n === 'number') {
      return arr[n];
    }

    return arr;
  },
  images: function images(clue) {
    var arr = sectionMap(this, 'images', null); //grab image from infobox, first

    this.infoboxes().forEach(function (info) {
      if (info.data.image) {
        arr.unshift(info.image()); //put it at the top
      }
    }); //look for 'gallery' templates, too

    this.templates().forEach(function (obj) {
      if (obj.template === 'gallery') {
        obj.images = obj.images || [];
        obj.images.forEach(function (img) {
          if (img instanceof Image === false) {
            img = new Image(img);
          }

          arr.push(img);
        });
      }
    });

    if (typeof clue === 'number') {
      return arr[clue];
    }

    return arr;
  },
  links: function links(clue) {
    return sectionMap(this, 'links', clue);
  },
  interwiki: function interwiki(clue) {
    return sectionMap(this, 'interwiki', clue);
  },
  lists: function lists(clue) {
    return sectionMap(this, 'lists', clue);
  },
  tables: function tables(clue) {
    return sectionMap(this, 'tables', clue);
  },
  templates: function templates(clue) {
    return sectionMap(this, 'templates', clue);
  },
  references: function references(clue) {
    return sectionMap(this, 'references', clue);
  },
  coordinates: function coordinates(clue) {
    return sectionMap(this, 'coordinates', clue);
  },
  infoboxes: function infoboxes(clue) {
    var arr = sectionMap(this, 'infoboxes'); //sort them by biggest-first

    arr = arr.sort(function (a, b) {
      if (Object.keys(a.data).length > Object.keys(b.data).length) {
        return -1;
      }

      return 1;
    });

    if (typeof clue === 'number') {
      return arr[clue];
    }

    return arr;
  },
  text: function text(options) {
    options = setDefaults(options, defaults); //nah, skip these.

    if (this.isRedirect() === true) {
      return '';
    }

    var arr = this.sections().map(function (sec) {
      return sec.text(options);
    });
    return arr.join('\n\n');
  },
  markdown: function markdown(options) {
    options = setDefaults(options, defaults);
    return toMarkdown(this, options);
  },
  latex: function latex(options) {
    options = setDefaults(options, defaults);
    return toLatex(this, options);
  },
  html: function html(options) {
    options = setDefaults(options, defaults);
    return toHtml(this, options);
  },
  json: function json(options) {
    options = setDefaults(options, defaults);
    return toJSON(this, options);
  },
  debug: function debug() {
    console.log('\n');
    this.sections().forEach(function (sec) {
      var indent = ' - ';

      for (var i = 0; i < sec.depth; i += 1) {
        indent = ' -' + indent;
      }

      console.log(indent + (sec.title() || '(Intro)'));
    });
    return this;
  }
}; //add alises

Object.keys(aliasList).forEach(function (k) {
  Document.prototype[k] = methods[aliasList[k]];
}); //add singular-methods, too

var plurals = ['sections', 'infoboxes', 'sentences', 'citations', 'references', 'coordinates', 'tables', 'links', 'images', 'categories'];
plurals.forEach(function (fn) {
  var sing = fn.replace(/ies$/, 'y');
  sing = sing.replace(/e?s$/, '');

  methods[sing] = function (n) {
    n = n || 0;
    return this[fn](n);
  };
});
Object.keys(methods).forEach(function (k) {
  Document.prototype[k] = methods[k];
}); //alias these ones

Document.prototype.isDisambig = Document.prototype.isDisambiguation;
Document.prototype.citations = Document.prototype.references;
Document.prototype.redirectsTo = Document.prototype.redirectTo;
Document.prototype.redirect = Document.prototype.redirectTo;
Document.prototype.redirects = Document.prototype.redirectTo;
module.exports = Document;

},{"../_lib/aliases":77,"../_lib/setDefaults":82,"../image/Image":84,"./_sectionMap":4,"./toHtml":11,"./toJson":12,"./toLatex":13,"./toMarkdown":14}],4:[function(_dereq_,module,exports){
"use strict";

//helper for looping around all sections of a document
var sectionMap = function sectionMap(doc, fn, clue) {
  var arr = [];
  doc.sections().forEach(function (sec) {
    var list = [];

    if (typeof clue === 'string') {
      list = sec[fn](clue);
    } else {
      list = sec[fn]();
    }

    list.forEach(function (t) {
      arr.push(t);
    });
  });

  if (typeof clue === 'number') {
    return arr[clue];
  }

  return arr;
};

module.exports = sectionMap;

},{}],5:[function(_dereq_,module,exports){
"use strict";

var i18n = _dereq_('../_data/i18n');

var cat_reg = new RegExp('\\[\\[:?(' + i18n.categories.join('|') + '):(.{2,60}?)]](w{0,10})', 'ig');
var cat_remove_reg = new RegExp('^\\[\\[:?(' + i18n.categories.join('|') + '):', 'ig');

var parse_categories = function parse_categories(r, wiki) {
  r.categories = [];
  var tmp = wiki.match(cat_reg); //regular links

  if (tmp) {
    tmp.forEach(function (c) {
      c = c.replace(cat_remove_reg, '');
      c = c.replace(/\|?[ \*]?\]\]$/i, ''); //parse fancy onces..

      c = c.replace(/\|.*/, ''); //everything after the '|' is metadata

      if (c && !c.match(/[\[\]]/)) {
        r.categories.push(c);
      }
    });
  }

  wiki = wiki.replace(cat_reg, '');
  return wiki;
};

module.exports = parse_categories;

},{"../_data/i18n":68}],6:[function(_dereq_,module,exports){
"use strict";

var i18n = _dereq_('../_data/i18n');

var template_reg = new RegExp('\\{\\{ ?(' + i18n.disambigs.join('|') + ')(\\|[a-z, =]*?)? ?\\}\\}', 'i'); //special disambig-templates en-wikipedia uses

var d = ' disambiguation';
var english = ['airport', 'biology' + d, 'call sign' + d, 'caselaw' + d, 'chinese title' + d, 'dab', 'dab', 'disamb', 'disambig', 'disambiguation cleanup', 'genus' + d, 'geodis', 'hndis', 'hospital' + d, 'lake index', 'letter' + d, 'letter-number combination' + d, 'mathematical' + d, 'military unit' + d, 'mountainindex', 'number' + d, 'phonetics' + d, 'place name' + d, 'place name' + d, 'portal' + d, 'road' + d, 'school' + d, 'setindex', 'ship index', 'species latin name abbreviation' + d, 'species latin name' + d, 'split dab', 'sport index', 'station' + d, 'synagogue' + d, 'taxonomic authority' + d, 'taxonomy' + d, 'wp disambig'];
var enDisambigs = new RegExp('\\{\\{ ?(' + english.join('|') + ')(\\|[a-z, =]*?)? ?\\}\\}', 'i');

var isDisambig = function isDisambig(wiki) {
  //test for {{disambiguation}} templates
  if (template_reg.test(wiki) === true) {
    return true;
  } //more english-centric disambiguation templates
  //{{hndis}}, etc


  if (enDisambigs.test(wiki) === true) {
    return true;
  } //try 'may refer to' on first line for en-wiki?
  // let firstLine = wiki.match(/^.+?\n/);
  // if (firstLine !== null && firstLine[0]) {
  //   if (/ may refer to/i.test(firstLine) === true) {
  //     return true;
  //   }
  // }


  return false;
};

module.exports = {
  isDisambig: isDisambig
};

},{"../_data/i18n":68}],7:[function(_dereq_,module,exports){
"use strict";

var Document = _dereq_('./Document');

var redirects = _dereq_('./redirects');

var disambig = _dereq_('./disambig');

var preProcess = _dereq_('./preProcess');

var parse = {
  section: _dereq_('../02-section'),
  categories: _dereq_('./categories')
}; //convert wikiscript markup lang to json

var main = function main(wiki, options) {
  options = options || {};
  wiki = wiki || '';
  var data = {
    type: 'page',
    sections: [],
    categories: [],
    coordinates: []
  }; //detect if page is just redirect, and return it

  if (redirects.isRedirect(wiki) === true) {
    data.type = 'redirect';
    data.redirectTo = redirects.parse(wiki);
    parse.categories(data, wiki);
    return new Document(data, options);
  } //detect if page is just disambiguator page, and return


  if (disambig.isDisambig(wiki) === true) {
    data.type = 'disambiguation';
  }

  if (options.page_identifier) {
    data.page_identifier = options.page_identifier;
  }

  if (options.lang_or_wikiid) {
    data.lang_or_wikiid = options.lang_or_wikiid;
  } //give ourselves a little head-start


  wiki = preProcess(data, wiki, options); //pull-out [[category:whatevers]]

  wiki = parse.categories(data, wiki); //parse all the headings, and their texts/sentences

  data.sections = parse.section(wiki, options) || []; //all together now

  return new Document(data, options);
};

module.exports = main;

},{"../02-section":17,"./Document":3,"./categories":5,"./disambig":6,"./preProcess":8,"./redirects":10}],8:[function(_dereq_,module,exports){
"use strict";

var kill_xml = _dereq_('./kill_xml'); //this mostly-formatting stuff can be cleaned-up first, to make life easier


function preProcess(r, wiki, options) {
  //remove comments
  wiki = wiki.replace(/<!--[\s\S]{0,2000}?-->/g, '');
  wiki = wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/ig, ''); //signitures

  wiki = wiki.replace(/~~{1,3}/g, ''); //windows newlines

  wiki = wiki.replace(/\r/g, ''); //horizontal rule

  wiki = wiki.replace(/----/g, ''); //formatting for templates-in-templates...

  wiki = wiki.replace(/\{\{\}\}/g, ' – ');
  wiki = wiki.replace(/\{\{\\\}\}/g, ' / '); //space

  wiki = wiki.replace(/&nbsp;/g, ' '); //give it the inglorious send-off it deserves..

  wiki = kill_xml(wiki, r, options); //({{template}},{{template}}) leaves empty parentheses

  wiki = wiki.replace(/\([,;: ]+?\)/g, ''); //these templates just screw things up, too

  wiki = wiki.replace(/{{(baseball|basketball) (primary|secondary) (style|color).*?\}\}/i, '');
  return wiki;
}

module.exports = preProcess; // console.log(preProcess("hi [[as:Plancton]] there"));
// console.log(preProcess('hello <br/> world'))
// console.log(preProcess("hello <asd f> world </h2>"))

},{"./kill_xml":9}],9:[function(_dereq_,module,exports){
"use strict";

//okay, i know you're not supposed to regex html, but...
//https://en.wikipedia.org/wiki/Help:HTML_in_wikitext
//these are things we throw-away
//these will mess-up if they're nested, but they're not usually.
var ignore = ['table', 'code', 'score', 'data', 'categorytree', 'charinsert', 'hiero', 'imagemap', 'inputbox', 'nowiki', 'poem', 'references', 'source', 'syntaxhighlight', 'timeline'];
var openTag = "< ?(".concat(ignore.join('|'), ") ?[^>]{0,200}?>");
var closeTag = "< ?/ ?(".concat(ignore.join('|'), ") ?>");
var anyChar = '\\s\\S'; //including newline

var noThanks = new RegExp("".concat(openTag, "[").concat(anyChar, "]+?").concat(closeTag), 'ig');

var kill_xml = function kill_xml(wiki) {
  //(<ref> tags are parsed in Section class) - luckily, refs can't be recursive.
  //types of html/xml that we want to trash completely.
  wiki = wiki.replace(noThanks, ' '); //some xml-like fragments we can also kill

  wiki = wiki.replace(/ ?< ?(span|div|table|data) [a-zA-Z0-9=%\.#:;'" ]{2,100}\/? ?> ?/g, ' '); //<ref name="asd">
  //only kill ref tags if they are selfclosing

  wiki = wiki.replace(/ ?< ?(ref) [a-zA-Z0-9=" ]{2,100}\/ ?> ?/g, ' '); //<ref name="asd"/>
  //some formatting xml, we'll keep their insides though

  wiki = wiki.replace(/ ?<[ \/]?(p|sub|sup|span|nowiki|div|table|br|tr|td|th|pre|pre2|hr)[ \/]?> ?/g, ' '); //<sub>, </sub>

  wiki = wiki.replace(/ ?<[ \/]?(abbr|bdi|bdo|blockquote|cite|del|dfn|em|i|ins|kbd|mark|q|s)[ \/]?> ?/g, ' '); //<abbr>, </abbr>

  wiki = wiki.replace(/ ?<[ \/]?h[0-9][ \/]?> ?/g, ' '); //<h2>, </h2>

  wiki = wiki.replace(/ ?< ?br ?\/> ?/g, '\n'); //<br />

  return wiki.trim();
};

module.exports = kill_xml;

},{}],10:[function(_dereq_,module,exports){
"use strict";

var i18n = _dereq_('../_data/i18n');

var parseLink = _dereq_('../04-sentence/links'); //pulls target link out of redirect page


var REDIRECT_REGEX = new RegExp('^[ \n\t]*?#(' + i18n.redirects.join('|') + ') *?(\\[\\[.{2,180}?\\]\\])', 'i');

var isRedirect = function isRedirect(wiki) {
  //too long to be a redirect?
  if (!wiki || wiki.length > 500) {
    return false;
  }

  return REDIRECT_REGEX.test(wiki);
};

var parse = function parse(wiki) {
  var m = wiki.match(REDIRECT_REGEX);

  if (m && m[2]) {
    var links = parseLink(m[2]) || [];
    return links[0];
  }

  return {};
};

module.exports = {
  isRedirect: isRedirect,
  parse: parse
};

},{"../04-sentence/links":60,"../_data/i18n":68}],11:[function(_dereq_,module,exports){
"use strict";

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  title: true,
  infoboxes: true,
  headers: true,
  sections: true,
  links: true
}; // we should try to make this look like the wikipedia does, i guess.

var softRedirect = function softRedirect(doc) {
  var link = doc.redirectTo();
  var href = link.page;
  href = './' + href.replace(/ /g, '_');

  if (link.anchor) {
    href += '#' + link.anchor;
  }

  return "  <div class=\"redirect\">\n  \u21B3 <a class=\"link\" href=\"./".concat(href, "\">").concat(link.text, "</a>\n  </div>");
}; //turn a Doc object into a HTML string


var toHtml = function toHtml(doc, options) {
  options = setDefaults(options, defaults);
  var data = doc.data;
  var html = '';
  html += '<!DOCTYPE html>\n';
  html += '<html>\n';
  html += '<head>\n'; //add page title

  if (options.title === true && data.title) {
    html += '<title>' + data.title + '</title>\n';
  }

  html += '</head>\n';
  html += '<body>\n'; //if it's a redirect page, give it a 'soft landing':

  if (doc.isRedirect() === true) {
    html += softRedirect(doc);
    return html + '\n</body>\n</html>'; //end it here.
  } //render infoboxes (up at the top)


  if (options.infoboxes === true) {
    html += doc.infoboxes().map(function (i) {
      return i.html(options);
    }).join('\n');
  } //render each section


  if (options.sections === true && (options.paragraphs === true || options.sentences === true)) {
    html += data.sections.map(function (s) {
      return s.html(options);
    }).join('\n');
  } //default off


  if (options.references === true) {
    html += '<h2>References</h2>';
    html += doc.references().map(function (c) {
      return c.json(options);
    }).join('\n');
  }

  html += '</body>\n';
  html += '</html>';
  return html;
};

module.exports = toHtml;

},{"../_lib/setDefaults":82}],12:[function(_dereq_,module,exports){
"use strict";

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  title: true,
  sections: true,
  pageID: true,
  categories: true
}; //an opinionated output of the most-wanted data

var toJSON = function toJSON(doc, options) {
  options = setDefaults(options, defaults);
  var data = {};

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
    data.sections = doc.sections().map(function (i) {
      return i.json(options);
    });
  }

  if (doc.isRedirect() === true) {
    data.isRedirect = true;
    data.redirectTo = doc.data.redirectTo;
    data.sections = [];
  } //these are default-off


  if (options.coordinates) {
    data.coordinates = doc.coordinates();
  }

  if (options.infoboxes) {
    data.infoboxes = doc.infoboxes().map(function (i) {
      return i.json(options);
    });
  }

  if (options.images) {
    data.images = doc.images().map(function (i) {
      return i.json(options);
    });
  }

  if (options.plaintext) {
    data.plaintext = doc.plaintext(options);
  }

  if (options.citations) {
    data.references = doc.references();
  }

  if (options.markdown) {
    data.markdown = doc.markdown(options);
  }

  if (options.html) {
    data.html = doc.html(options);
  }

  if (options.latex) {
    data.latex = doc.latex(options);
  }

  return data;
};

module.exports = toJSON;

},{"../_lib/setDefaults":82}],13:[function(_dereq_,module,exports){
"use strict";

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  infoboxes: true,
  sections: true
}; // we should try to make this look like the wikipedia does, i guess.

var softRedirect = function softRedirect(doc) {
  var link = doc.redirectTo();
  var href = link.page;
  href = './' + href.replace(/ /g, '_'); //add anchor

  if (link.anchor) {
    href += '#' + link.anchor;
  }

  return '↳ \\href{' + href + '}{' + link.text + '}';
}; //


var toLatex = function toLatex(doc, options) {
  options = setDefaults(options, defaults);
  var out = ''; //if it's a redirect page, give it a 'soft landing':

  if (doc.isRedirect() === true) {
    return softRedirect(doc); //end it here.
  } //render infoboxes (up at the top)


  if (options.infoboxes === true) {
    out += doc.infoboxes().map(function (i) {
      return i.latex(options);
    }).join('\n');
  } //render each section


  if (options.sections === true || options.paragraphs === true || options.sentences === true) {
    out += doc.sections().map(function (s) {
      return s.latex(options);
    }).join('\n');
  } //default off
  //render citations


  if (options.citations === true) {
    out += doc.citations().map(function (c) {
      return c.latex(options);
    }).join('\n');
  }

  return out;
};

module.exports = toLatex;

},{"../_lib/setDefaults":82}],14:[function(_dereq_,module,exports){
"use strict";

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  redirects: true,
  infoboxes: true,
  templates: true,
  sections: true
}; // we should try to make this look like the wikipedia does, i guess.

var softRedirect = function softRedirect(doc) {
  var link = doc.redirectTo();
  var href = link.page;
  href = './' + href.replace(/ /g, '_');

  if (link.anchor) {
    href += '#' + link.anchor;
  }

  return "\u21B3 [".concat(link.text, "](").concat(href, ")");
}; //turn a Doc object into a markdown string


var toMarkdown = function toMarkdown(doc, options) {
  options = setDefaults(options, defaults);
  var data = doc.data;
  var md = ''; //if it's a redirect page, give it a 'soft landing':

  if (options.redirects === true && doc.isRedirect() === true) {
    return softRedirect(doc); //end it here
  } //render infoboxes (up at the top)


  if (options.infoboxes === true && options.templates === true) {
    md += doc.infoboxes().map(function (infobox) {
      return infobox.markdown(options);
    }).join('\n\n');
  } //render each section


  if (options.sections === true || options.paragraphs === true || options.sentences === true) {
    md += data.sections.map(function (s) {
      return s.markdown(options);
    }).join('\n\n');
  } //default false


  if (options.citations === true) {
    md += '## References';
    md += doc.citations().map(function (c) {
      return c.json(options);
    }).join('\n');
  }

  return md;
};

module.exports = toMarkdown;

},{"../_lib/setDefaults":82}],15:[function(_dereq_,module,exports){
"use strict";

var toMarkdown = _dereq_('./toMarkdown');

var toHtml = _dereq_('./toHtml');

var toJSON = _dereq_('./toJson');

var toLatex = _dereq_('./toLatex');

var setDefaults = _dereq_('../_lib/setDefaults');

var aliasList = _dereq_('../_lib/aliases');

var defaults = {
  tables: true,
  references: true,
  paragraphs: true,
  templates: true,
  infoboxes: true
}; //the stuff between headings - 'History' section for example

var Section = function Section(data) {
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

var methods = {
  title: function title() {
    return this._title || '';
  },
  index: function index() {
    if (!this.doc) {
      return null;
    }

    var index = this.doc.sections().indexOf(this);

    if (index === -1) {
      return null;
    }

    return index;
  },
  indentation: function indentation() {
    return this.depth;
  },
  sentences: function sentences(n) {
    var arr = this.paragraphs().reduce(function (list, p) {
      return list.concat(p.sentences());
    }, []);

    if (typeof n === 'number') {
      return arr[n];
    }

    return arr || [];
  },
  paragraphs: function paragraphs(n) {
    var arr = this.data.paragraphs || [];

    if (typeof n === 'number') {
      return arr[n];
    }

    return arr || [];
  },
  paragraph: function paragraph(n) {
    var arr = this.data.paragraphs || [];

    if (typeof n === 'number') {
      return arr[n];
    }

    return arr[0];
  },
  links: function links(n) {
    var arr = [];
    this.infoboxes().forEach(function (templ) {
      templ.links(n).forEach(function (link) {
        return arr.push(link);
      });
    });
    this.sentences().forEach(function (s) {
      s.links(n).forEach(function (link) {
        return arr.push(link);
      });
    });
    this.tables().forEach(function (t) {
      t.links(n).forEach(function (link) {
        return arr.push(link);
      });
    });
    this.lists().forEach(function (list) {
      list.links(n).forEach(function (link) {
        return arr.push(link);
      });
    });

    if (typeof n === 'number') {
      return arr[n];
    } else if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it

      var link = arr.find(function (o) {
        return o.page === n;
      });
      return link === undefined ? [] : [link];
    }

    return arr;
  },
  tables: function tables(clue) {
    var arr = this.data.tables || [];

    if (typeof clue === 'number') {
      return arr[clue];
    }

    return arr;
  },
  templates: function templates(clue) {
    var arr = this.data.templates || [];

    if (typeof clue === 'number') {
      return arr[clue];
    }

    if (typeof clue === 'string') {
      clue = clue.toLowerCase();
      return arr.filter(function (o) {
        return o.template === clue || o.name === clue;
      });
    }

    return arr;
  },
  infoboxes: function infoboxes(clue) {
    var arr = this.data.infoboxes || [];

    if (typeof clue === 'number') {
      return arr[clue];
    }

    return arr;
  },
  coordinates: function coordinates(clue) {
    var arr = [].concat(this.templates('coord'), this.templates('coor'));

    if (typeof clue === 'number') {
      return arr[clue];
    }

    return arr;
  },
  lists: function lists(clue) {
    var arr = [];
    this.paragraphs().forEach(function (p) {
      arr = arr.concat(p.lists());
    });

    if (typeof clue === 'number') {
      return arr[clue];
    }

    return arr;
  },
  interwiki: function interwiki(num) {
    var arr = [];
    this.paragraphs().forEach(function (p) {
      arr = arr.concat(p.interwiki());
    });

    if (typeof num === 'number') {
      return arr[num];
    }

    return arr || [];
  },
  images: function images(clue) {
    var arr = [];
    this.paragraphs().forEach(function (p) {
      arr = arr.concat(p.images());
    });

    if (typeof clue === 'number') {
      return arr[clue];
    }

    return arr || [];
  },
  references: function references(clue) {
    var arr = this.data.references || [];

    if (typeof clue === 'number') {
      return arr[clue];
    }

    return arr;
  },
  //transformations
  remove: function remove() {
    if (!this.doc) {
      return null;
    }

    var bads = {};
    bads[this.title()] = true; //remove children too

    this.children().forEach(function (sec) {
      return bads[sec.title()] = true;
    });
    var arr = this.doc.data.sections;
    arr = arr.filter(function (sec) {
      return bads.hasOwnProperty(sec.title()) !== true;
    });
    this.doc.data.sections = arr;
    return this.doc;
  },
  //move-around sections like in jquery
  nextSibling: function nextSibling() {
    if (!this.doc) {
      return null;
    }

    var sections = this.doc.sections();
    var index = this.index();

    for (var i = index + 1; i < sections.length; i += 1) {
      if (sections[i].depth < this.depth) {
        return null;
      }

      if (sections[i].depth === this.depth) {
        return sections[i];
      }
    }

    return null;
  },
  lastSibling: function lastSibling() {
    if (!this.doc) {
      return null;
    }

    var sections = this.doc.sections();
    var index = this.index();
    return sections[index - 1] || null;
  },
  children: function children(n) {
    if (!this.doc) {
      return null;
    }

    var sections = this.doc.sections();
    var index = this.index();
    var children = []; //(immediately preceding sections with higher depth)

    if (sections[index + 1] && sections[index + 1].depth > this.depth) {
      for (var i = index + 1; i < sections.length; i += 1) {
        if (sections[i].depth > this.depth) {
          children.push(sections[i]);
        } else {
          break;
        }
      }
    }

    if (typeof n === 'string') {
      n = n.toLowerCase(); // children.forEach((c) => console.log(c));

      return children.find(function (s) {
        return s.title().toLowerCase() === n;
      });
    }

    if (typeof n === 'number') {
      return children[n];
    }

    return children;
  },
  parent: function parent() {
    if (!this.doc) {
      return null;
    }

    var sections = this.doc.sections();
    var index = this.index();

    for (var i = index; i >= 0; i -= 1) {
      if (sections[i] && sections[i].depth < this.depth) {
        return sections[i];
      }
    }

    return null;
  },
  markdown: function markdown(options) {
    options = setDefaults(options, defaults);
    return toMarkdown(this, options);
  },
  html: function html(options) {
    options = setDefaults(options, defaults);
    return toHtml(this, options);
  },
  text: function text(options) {
    options = setDefaults(options, defaults);
    var pList = this.paragraphs();
    pList = pList.map(function (p) {
      return p.text(options);
    });
    return pList.join('\n\n');
  },
  latex: function latex(options) {
    options = setDefaults(options, defaults);
    return toLatex(this, options);
  },
  json: function json(options) {
    options = setDefaults(options, defaults);
    return toJSON(this, options);
  }
}; //aliases

methods.next = methods.nextSibling;
methods.last = methods.lastSibling;
methods.previousSibling = methods.lastSibling;
methods.previous = methods.lastSibling;
methods.citations = methods.references;
methods.sections = methods.children;
Object.keys(methods).forEach(function (k) {
  Section.prototype[k] = methods[k];
}); //add alises, too

Object.keys(aliasList).forEach(function (k) {
  Section.prototype[k] = methods[aliasList[k]];
});
module.exports = Section;

},{"../_lib/aliases":77,"../_lib/setDefaults":82,"./toHtml":40,"./toJson":41,"./toLatex":42,"./toMarkdown":43}],16:[function(_dereq_,module,exports){
"use strict";

var fns = _dereq_('../_lib/helpers');

var parseSentence = _dereq_('../04-sentence/').oneSentence;

var parseReferences = _dereq_('./reference/');

var heading_reg = /^(={1,5})(.{1,200}?)={1,5}$/; //interpret depth, title of headings like '==See also=='

var parseHeading = function parseHeading(data, str) {
  var heading = str.match(heading_reg);

  if (!heading) {
    data.title = '';
    data.depth = 0;
    return data;
  }

  var title = heading[2] || '';
  title = parseSentence(title).text(); //amazingly, you can see inline {{templates}} in this text, too
  //... let's not think about that now.

  title = title.replace(/\{\{.+?\}\}/, ''); //same for references (i know..)

  title = parseReferences(title, {}); //TODO: this is ridiculous
  //trim leading/trailing whitespace

  title = fns.trim_whitespace(title);
  var depth = 0;

  if (heading[1]) {
    depth = heading[1].length - 2;
  }

  data.title = title;
  data.depth = depth;
  return data;
};

module.exports = parseHeading;

},{"../04-sentence/":58,"../_lib/helpers":79,"./reference/":19}],17:[function(_dereq_,module,exports){
"use strict";

var Section = _dereq_('./Section');

var isReference = /^(references?|einzelnachweise|referencias|références|notes et références|脚注|referenser|bronnen|примечания):?/i; //todo support more languages

var section_reg = /(?:\n|^)(={2,5}.{1,200}?={2,5})/g; //interpret ==heading== lines

var parse = {
  heading: _dereq_('./heading'),
  table: _dereq_('./table'),
  paragraphs: _dereq_('../03-paragraph'),
  templates: _dereq_('../templates'),
  references: _dereq_('./reference'),
  startEndTemplates: _dereq_('./start-to-end')
};

var oneSection = function oneSection(wiki, data, options) {
  wiki = parse.startEndTemplates(data, wiki, options); //parse-out the <ref></ref> tags

  wiki = parse.references(wiki, data); //parse-out all {{templates}}

  wiki = parse.templates(wiki, data, options); // //parse the tables

  wiki = parse.table(data, wiki); //now parse all double-newlines

  var res = parse.paragraphs(wiki, options);
  data.paragraphs = res.paragraphs;
  wiki = res.wiki;
  data = new Section(data, wiki);
  return data;
}; //we re-create this in html/markdown outputs


var removeReferenceSection = function removeReferenceSection(sections) {
  return sections.filter(function (s, i) {
    if (isReference.test(s.title()) === true) {
      if (s.paragraphs().length > 0) {
        return true;
      } //does it have some wacky templates?


      if (s.templates().length > 0) {
        return true;
      } //what it has children? awkward


      if (sections[i + 1] && sections[i + 1].depth > s.depth) {
        sections[i + 1].depth -= 1; //move it up a level?...
      }

      return false;
    }

    return true;
  });
};

var parseSections = function parseSections(wiki, options) {
  var split = wiki.split(section_reg);
  var sections = [];

  for (var i = 0; i < split.length; i += 2) {
    var heading = split[i - 1] || '';
    var content = split[i] || '';

    if (content === '' && heading === '') {
      //usually an empty 'intro' section
      continue;
    }

    var data = {
      title: '',
      depth: null,
      templates: [],
      infoboxes: [],
      references: []
    }; //figure-out title/depth

    parse.heading(data, heading); //parse it up

    var s = oneSection(content, data, options);
    sections.push(s);
  } //remove empty references section


  sections = removeReferenceSection(sections);
  return sections;
};

module.exports = parseSections;

},{"../03-paragraph":45,"../templates":123,"./Section":15,"./heading":16,"./reference":19,"./start-to-end":26,"./table":32}],18:[function(_dereq_,module,exports){
"use strict";

var setDefaults = _dereq_('../../_lib/setDefaults');

var toLatex = _dereq_('./toLatex');

var toHtml = _dereq_('./toHtml');

var toMarkdown = _dereq_('./toMarkdown');

var toJson = _dereq_('./toJson');

var defaults = {}; //also called 'citations'

var Reference = function Reference(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

var methods = {
  title: function title() {
    var data = this.data;
    return data.title || data.encyclopedia || data.author || '';
  },
  links: function links(n) {
    var arr = [];

    if (typeof n === 'number') {
      return arr[n];
    } //grab a specific link..


    if (typeof n === 'number') {
      return arr[n];
    } else if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it

      var link = arr.find(function (o) {
        return o.page === n;
      });
      return link === undefined ? [] : [link];
    }

    return arr || [];
  },
  text: function text() {
    return ''; //nah, skip these.
  },
  markdown: function markdown(options) {
    options = setDefaults(options, defaults);
    return toMarkdown(this, options);
  },
  html: function html(options) {
    options = setDefaults(options, defaults);
    return toHtml(this, options);
  },
  latex: function latex(options) {
    options = setDefaults(options, defaults);
    return toLatex(this, options);
  },
  json: function json(options) {
    options = setDefaults(options, defaults);
    return toJson(this, options);
  }
};
Object.keys(methods).forEach(function (k) {
  Reference.prototype[k] = methods[k];
});
module.exports = Reference;

},{"../../_lib/setDefaults":82,"./toHtml":20,"./toJson":21,"./toLatex":22,"./toMarkdown":23}],19:[function(_dereq_,module,exports){
"use strict";

var parse = _dereq_('../../templates/_parsers/parse'); // const parse = require('../../templates/wikipedia/page').citation;


var parseSentence = _dereq_('../../04-sentence').oneSentence;

var Reference = _dereq_('./Reference'); //structured Cite templates - <ref>{{Cite..</ref>


var hasCitation = function hasCitation(str) {
  return /^ *?\{\{ *?(cite|citation)/i.test(str) && /\}\} *?$/.test(str) && /citation needed/i.test(str) === false;
};

var parseCitation = function parseCitation(tmpl) {
  var obj = parse(tmpl);
  obj.type = obj.template.replace(/cite /, '');
  obj.template = 'citation';
  return obj;
}; //handle unstructured ones - <ref>some text</ref>


var parseInline = function parseInline(str) {
  var obj = parseSentence(str) || {};
  return {
    template: 'citation',
    type: 'inline',
    data: {},
    inline: obj
  };
}; // parse <ref></ref> xml tags


var parseRefs = function parseRefs(wiki, data) {
  var references = [];
  wiki = wiki.replace(/ ?<ref>([\s\S]{0,1800}?)<\/ref> ?/gi, function (a, tmpl) {
    if (hasCitation(tmpl)) {
      var obj = parseCitation(tmpl);

      if (obj) {
        references.push(obj);
      }

      wiki = wiki.replace(tmpl, '');
    } else {
      references.push(parseInline(tmpl));
    }

    return ' ';
  }); // <ref name=""/>

  wiki = wiki.replace(/ ?<ref [^>]{0,200}?\/> ?/gi, ' '); // <ref name=""></ref>

  wiki = wiki.replace(/ ?<ref [^>]{0,200}?>([\s\S]{0,1800}?)<\/ref> ?/gi, function (a, tmpl) {
    if (hasCitation(tmpl)) {
      var obj = parseCitation(tmpl);

      if (obj) {
        references.push(obj);
      }

      wiki = wiki.replace(tmpl, '');
    } else {
      references.push(parseInline(tmpl));
    }

    return ' ';
  }); //now that we're done with xml, do a generic + dangerous xml-tag removal

  wiki = wiki.replace(/ ?<[ \/]?[a-z0-9]{1,8}[a-z0-9=" ]{2,20}[ \/]?> ?/g, ' '); //<samp name="asd">

  data.references = references.map(function (r) {
    return new Reference(r);
  });
  return wiki;
};

module.exports = parseRefs;

},{"../../04-sentence":58,"../../templates/_parsers/parse":106,"./Reference":18}],20:[function(_dereq_,module,exports){
"use strict";

//
var toHtml = function toHtml(c, options) {
  if (c.data && c.data.url && c.data.title) {
    var str = c.data.title;

    if (options.links === true) {
      str = "<a href=\"".concat(c.data.url, "\">").concat(str, "</a>");
    }

    return "<div class=\"reference\">\u2303 ".concat(str, " </div>");
  }

  if (c.data.encyclopedia) {
    return "<div class=\"reference\">\u2303 ".concat(c.data.encyclopedia, "</div>");
  }

  if (c.data.title) {
    //cite book, etc
    var _str = c.data.title;

    if (c.data.author) {
      _str += c.data.author;
    }

    if (c.data.first && c.data.last) {
      _str += c.data.first + ' ' + c.data.last;
    }

    return "<div class=\"reference\">\u2303 ".concat(_str, "</div>");
  }

  if (c.inline) {
    return "<div class=\"reference\">\u2303 ".concat(c.inline.html(), "</div>");
  }

  return '';
};

module.exports = toHtml;

},{}],21:[function(_dereq_,module,exports){
"use strict";

//
var toJson = function toJson(c) {
  return c.data;
};

module.exports = toJson;

},{}],22:[function(_dereq_,module,exports){
"use strict";

//not so impressive right now
var toLatex = function toLatex(c) {
  var str = c.title();
  return '⌃ ' + str + '\n';
};

module.exports = toLatex;

},{}],23:[function(_dereq_,module,exports){
"use strict";

//
var toMarkdown = function toMarkdown(c) {
  if (c.data && c.data.url && c.data.title) {
    return "\u2303 [".concat(c.data.title, "](").concat(c.data.url, ")");
  } else if (c.data.encyclopedia) {
    return "\u2303 ".concat(c.data.encyclopedia);
  } else if (c.data.title) {
    //cite book, etc
    var str = c.data.title;

    if (c.data.author) {
      str += c.data.author;
    }

    if (c.data.first && c.data.last) {
      str += c.data.first + ' ' + c.data.last;
    }

    return "\u2303 ".concat(str);
  } else if (c.inline) {
    return "\u2303 ".concat(c.inline.markdown());
  }

  return '';
};

module.exports = toMarkdown;

},{}],24:[function(_dereq_,module,exports){
"use strict";

var parseTemplates = _dereq_('../../templates'); //this is a non-traditional template, for some reason
//https://en.wikipedia.org/wiki/Template:Election_box


var parseElection = function parseElection(wiki, section) {
  wiki = wiki.replace(/\{\{election box begin([\s\S]+?)\{\{election box end\}\}/gi, function (tmpl) {
    var data = {
      templates: []
    }; //put it through our full template parser..

    parseTemplates(tmpl, data, {}); //okay, pull it apart into something sensible..

    var start = data.templates.find(function (t) {
      return t.template === 'election box';
    }) || {};
    var candidates = data.templates.filter(function (t) {
      return t.template === 'election box candidate';
    });
    var summary = data.templates.find(function (t) {
      return t.template === 'election box gain' || t.template === 'election box hold';
    }) || {};

    if (candidates.length > 0 || summary) {
      section.templates.push({
        template: 'election box',
        title: start.title,
        candidates: candidates,
        summary: summary.data
      });
    } //remove it all


    return '';
  });
  return wiki;
};

module.exports = parseElection;

},{"../../templates":123}],25:[function(_dereq_,module,exports){
"use strict";

var parseSentence = _dereq_('../../04-sentence/').oneSentence;

var Image = _dereq_('../../image/Image'); //okay, <gallery> is a xml-tag, with newline-seperated data, somehow pivoted by '|'...
//all deities help us. truly -> https://en.wikipedia.org/wiki/Help:Gallery_tag
// - not to be confused with https://en.wikipedia.org/wiki/Template:Gallery...


var parseGallery = function parseGallery(wiki, section) {
  wiki = wiki.replace(/<gallery([^>]*?)>([\s\S]+?)<\/gallery>/g, function (_, attrs, inside) {
    var images = inside.split(/\n/g);
    images = images.filter(function (str) {
      return str && str.trim() !== '';
    }); //parse the line, which has an image and sometimes a caption

    images = images.map(function (str) {
      var arr = str.split(/\|/);
      var obj = {
        file: arr[0].trim()
      };
      var img = new Image(obj).json();
      var caption = arr.slice(1).join('|');

      if (caption !== '') {
        img.caption = parseSentence(caption);
      }

      return img;
    }); //add it to our templates list

    if (images.length > 0) {
      section.templates.push({
        template: 'gallery',
        images: images
      });
    }

    return '';
  });
  return wiki;
};

module.exports = parseGallery;

},{"../../04-sentence/":58,"../../image/Image":84}],26:[function(_dereq_,module,exports){
"use strict";

var parseGallery = _dereq_('./gallery');

var parseElection = _dereq_('./election');

var parseNBA = _dereq_('./nba');

var parseMlb = _dereq_('./mlb');

var parseMMA = _dereq_('./mma');

var parseMath = _dereq_('./math'); // Most templates are '{{template}}', but then, some are '<template></template>'.
// ... others are {{start}}...{{end}}
// -> these are those ones.


var xmlTemplates = function xmlTemplates(section, wiki) {
  wiki = parseGallery(wiki, section);
  wiki = parseElection(wiki, section);
  wiki = parseMath(wiki, section);
  wiki = parseNBA(wiki, section);
  wiki = parseMMA(wiki, section);
  wiki = parseMlb(wiki, section);
  return wiki;
};

module.exports = xmlTemplates;

},{"./election":24,"./gallery":25,"./math":27,"./mlb":28,"./mma":29,"./nba":30}],27:[function(_dereq_,module,exports){
"use strict";

var parseSentence = _dereq_('../../04-sentence/').oneSentence; //xml <math>y=mx+b</math> support
//https://en.wikipedia.org/wiki/Help:Displaying_a_formula


var parseMath = function parseMath(wiki, section) {
  wiki = wiki.replace(/<math([^>]*?)>([\s\S]+?)<\/math>/g, function (_, attrs, inside) {
    //clean it up a little?
    var formula = parseSentence(inside).text();
    section.templates.push({
      template: 'math',
      formula: formula,
      raw: inside
    }); //should we atleast try to render it in plaintext? :/

    if (formula && formula.length < 12) {
      return formula;
    }

    return '';
  }); //try chemistry version too

  wiki = wiki.replace(/<chem([^>]*?)>([\s\S]+?)<\/chem>/g, function (_, attrs, inside) {
    section.templates.push({
      template: 'chem',
      data: inside
    });
    return '';
  });
  return wiki;
};

module.exports = parseMath;

},{"../../04-sentence/":58}],28:[function(_dereq_,module,exports){
"use strict";

var tableParser = _dereq_('../table/parse'); //https://en.wikipedia.org/wiki/Template:MLB_game_log_section
//this is pretty nuts


var whichHeadings = function whichHeadings(tmpl) {
  var headings = ['#', 'date', 'opponent', 'score', 'win', 'loss', 'save', 'attendance', 'record'];

  if (/\|stadium=y/i.test(tmpl) === true) {
    headings.splice(7, 0, 'stadium'); //save, stadium, attendance
  }

  if (/\|time=y/i.test(tmpl) === true) {
    headings.splice(7, 0, 'time'); //save, time, stadium, attendance
  }

  if (/\|box=y/i.test(tmpl) === true) {
    headings.push('box'); //record, box
  }

  return headings;
};

var parseMlb = function parseMlb(wiki, section) {
  wiki = wiki.replace(/\{\{mlb game log (section|month)[\s\S]+?\{\{mlb game log (section|month) end\}\}/gi, function (tmpl) {
    var headings = whichHeadings(tmpl);
    tmpl = tmpl.replace(/^\{\{.*?\}\}/, '');
    tmpl = tmpl.replace(/\{\{mlb game log (section|month) end\}\}/i, '');
    var headers = '! ' + headings.join(' !! ');
    var table = '{|\n' + headers + '\n' + tmpl + '\n|}';
    var rows = tableParser(table);
    rows = rows.map(function (row) {
      Object.keys(row).forEach(function (k) {
        row[k] = row[k].text();
      });
      return row;
    });
    section.templates.push({
      template: 'mlb game log section',
      data: rows
    });
    return '';
  });
  return wiki;
};

module.exports = parseMlb;

},{"../table/parse":35}],29:[function(_dereq_,module,exports){
"use strict";

var tableParser = _dereq_('../table/parse');

var headings = ['res', 'record', 'opponent', 'method', 'event', 'date', 'round', 'time', 'location', 'notes']; //https://en.wikipedia.org/wiki/Template:MMA_record_start

var parseMMA = function parseMMA(wiki, section) {
  wiki = wiki.replace(/\{\{mma record start[\s\S]+?\{\{end\}\}/gi, function (tmpl) {
    tmpl = tmpl.replace(/^\{\{.*?\}\}/, '');
    tmpl = tmpl.replace(/\{\{end\}\}/i, '');
    var headers = '! ' + headings.join(' !! ');
    var table = '{|\n' + headers + '\n' + tmpl + '\n|}';
    var rows = tableParser(table);
    rows = rows.map(function (row) {
      Object.keys(row).forEach(function (k) {
        row[k] = row[k].text();
      });
      return row;
    });
    section.templates.push({
      template: 'mma record start',
      data: rows
    });
    return '';
  });
  return wiki;
};

module.exports = parseMMA;

},{"../table/parse":35}],30:[function(_dereq_,module,exports){
"use strict";

var tableParser = _dereq_('../table/parse');

var keys = {
  coach: ['team', 'year', 'g', 'w', 'l', 'w-l%', 'finish', 'pg', 'pw', 'pl', 'pw-l%'],
  player: ['year', 'team', 'gp', 'gs', 'mpg', 'fg%', '3p%', 'ft%', 'rpg', 'apg', 'spg', 'bpg', 'ppg'],
  roster: ['player', 'gp', 'gs', 'mpg', 'fg%', '3fg%', 'ft%', 'rpg', 'apg', 'spg', 'bpg', 'ppg']
}; //https://en.wikipedia.org/wiki/Template:NBA_player_statistics_start

var parseNBA = function parseNBA(wiki, section) {
  wiki = wiki.replace(/\{\{nba (coach|player|roster) statistics start([\s\S]+?)\{\{s-end\}\}/gi, function (tmpl, name) {
    tmpl = tmpl.replace(/^\{\{.*?\}\}/, '');
    tmpl = tmpl.replace(/\{\{s-end\}\}/, '');
    name = name.toLowerCase().trim();
    var headers = '! ' + keys[name].join(' !! ');
    var table = '{|\n' + headers + '\n' + tmpl + '\n|}';
    var rows = tableParser(table);
    rows = rows.map(function (row) {
      Object.keys(row).forEach(function (k) {
        row[k] = row[k].text();
      });
      return row;
    });
    section.templates.push({
      template: 'NBA ' + name + ' statistics',
      data: rows
    });
    return '';
  });
  return wiki;
};

module.exports = parseNBA;

},{"../table/parse":35}],31:[function(_dereq_,module,exports){
"use strict";

var setDefaults = _dereq_('../../_lib/setDefaults');

var toHtml = _dereq_('./toHtml');

var toMarkdown = _dereq_('./toMarkdown');

var toLatex = _dereq_('./toLatex');

var toJson = _dereq_('./toJson');

var aliasList = _dereq_('../../_lib/aliases');

var defaults = {};

var Table = function Table(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

var methods = {
  links: function links(n) {
    var links = [];
    this.data.forEach(function (r) {
      Object.keys(r).forEach(function (k) {
        links = links.concat(r[k].links());
      });
    }); //grab a specific link..

    if (typeof n === 'number') {
      return links[n];
    } else if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it

      var link = links.find(function (o) {
        return o.page === n;
      });
      return link === undefined ? [] : [link];
    }

    return links;
  },
  keyValue: function keyValue(options) {
    var rows = this.json(options);
    rows.forEach(function (row) {
      Object.keys(row).forEach(function (k) {
        row[k] = row[k].text;
      });
    });
    return rows;
  },
  json: function json(options) {
    options = setDefaults(options, defaults);
    return toJson(this.data, options);
  },
  html: function html(options) {
    options = setDefaults(options, defaults);
    return toHtml(this.data, options);
  },
  markdown: function markdown(options) {
    options = setDefaults(options, defaults);
    return toMarkdown(this.data, options);
  },
  latex: function latex(options) {
    options = setDefaults(options, defaults);
    return toLatex(this.data, options);
  },
  text: function text() {
    return '';
  }
};
methods.keyvalue = methods.keyValue;
methods.keyval = methods.keyValue;
Object.keys(methods).forEach(function (k) {
  Table.prototype[k] = methods[k];
}); //add alises, too

Object.keys(aliasList).forEach(function (k) {
  Table.prototype[k] = methods[aliasList[k]];
});
module.exports = Table;

},{"../../_lib/aliases":77,"../../_lib/setDefaults":82,"./toHtml":36,"./toJson":37,"./toLatex":38,"./toMarkdown":39}],32:[function(_dereq_,module,exports){
"use strict";

var parseTable = _dereq_('./parse');

var Table = _dereq_('./Table'); // const table_reg = /\{\|[\s\S]+?\|\}/g; //the largest-cities table is ~70kchars.


var openReg = /^\s*{\|/;
var closeReg = /^\s*\|}/; //tables can be recursive, so looky-here.

var findTables = function findTables(section, wiki) {
  var list = [];
  var lines = wiki.split('\n');
  var stack = [];

  for (var i = 0; i < lines.length; i += 1) {
    //start a table
    if (openReg.test(lines[i]) === true) {
      stack.push(lines[i]);
      continue;
    } //close a table


    if (closeReg.test(lines[i]) === true) {
      stack[stack.length - 1] += '\n' + lines[i];
      var table = stack.pop();
      list.push(table);
      continue;
    } //keep-going on one


    if (stack.length > 0) {
      stack[stack.length - 1] += '\n' + lines[i];
    }
  } //work-em together for a Table class


  var tables = [];
  list.forEach(function (str) {
    if (str) {
      //also reremove a newline at the end of the table (awkward)
      wiki = wiki.replace(str + '\n', '');
      wiki = wiki.replace(str, '');
      var data = parseTable(str);

      if (data && data.length > 0) {
        tables.push(new Table(data));
      }
    }
  });

  if (tables.length > 0) {
    section.tables = tables;
  }

  return wiki;
};

module.exports = findTables;

},{"./Table":31,"./parse":35}],33:[function(_dereq_,module,exports){
"use strict";

//remove top-bottoms
var cleanup = function cleanup(lines) {
  lines = lines.filter(function (line) {
    //a '|+' row is a 'table caption', remove it.
    return line && /^\|\+/.test(line) !== true;
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

  return lines;
}; //turn newline seperated into '|-' seperated


var findRows = function findRows(lines) {
  var rows = [];
  var row = [];
  lines = cleanup(lines);

  for (var i = 0; i < lines.length; i += 1) {
    var line = lines[i]; //'|-' is a row-seperator

    if (/^\|-/.test(line) === true) {
      //okay, we're done the row
      if (row.length > 0) {
        rows.push(row);
        row = [];
      }
    } else {
      //look for '||' inline row-splitter
      line = line.split(/(?:\|\||!!)/); //support newline -> '||'

      if (!line[0] && line[1]) {
        line.shift();
      }

      line.forEach(function (l) {
        l = l.replace(/^\| */, '');
        l = l.trim();
        row.push(l);
      });
    }
  } //finish the last one


  if (row.length > 0) {
    rows.push(row);
  }

  return rows;
};

module.exports = findRows;

},{}],34:[function(_dereq_,module,exports){
"use strict";

var getRowSpan = /.*rowspan *?= *?["']([0-9]+)["'][ \|]*/;
var getColSpan = /.*colspan *?= *?["']([0-9]+)["'][ \|]*/; //colspans stretch ←left/right→

var doColSpan = function doColSpan(rows) {
  rows.forEach(function (row, r) {
    row.forEach(function (str, c) {
      var m = str.match(getColSpan);

      if (m !== null) {
        var num = parseInt(m[1], 10); //...maybe if num is so big, and centered, remove it?

        if (num > 3) {
          rows[r] = [];
          return;
        } //splice-in n empty columns right here


        row[c] = str.replace(getColSpan, '');

        for (var i = 1; i < num; i += 1) {
          row.splice(c + 1, 0, '');
        }
      }
    });
  });
  rows = rows.filter(function (r) {
    return r.length > 0;
  });
  return rows;
}; //colspans stretch up/down


var doRowSpan = function doRowSpan(rows) {
  rows.forEach(function (row, r) {
    row.forEach(function (str, c) {
      var m = str.match(getRowSpan);

      if (m !== null) {
        var num = parseInt(m[1], 10); //copy this cell down n rows

        str = str.replace(getRowSpan, '');
        row[c] = str;

        for (var i = r + 1; i < r + num; i += 1) {
          if (!rows[i]) {
            break;
          }

          rows[i].splice(c, 0, str);
        }
      }
    });
  });
  return rows;
}; //


var handleSpans = function handleSpans(rows) {
  rows = doRowSpan(rows);
  rows = doColSpan(rows);
  return rows;
};

module.exports = handleSpans;

},{}],35:[function(_dereq_,module,exports){
"use strict";

var parseSentence = _dereq_('../../../04-sentence/').oneSentence;

var findRows = _dereq_('./_findRows');

var handleSpans = _dereq_('./_spans'); //common ones


var headings = {
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
}; //additional table-cruft to remove before parseLine method

var cleanText = function cleanText(str) {
  str = parseSentence(str).text(); //anything before a single-pipe is styling, so remove it

  if (str.match(/\|/)) {
    str = str.replace(/.+\| ?/, ''); //class="unsortable"|title
  }

  str = str.replace(/style=['"].*?["']/, ''); //'!' is used as a highlighed-column

  str = str.replace(/^!/, '');
  str = str.trim();
  return str;
}; //'!' starts a header-row


var findHeaders = function findHeaders() {
  var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var headers = [];
  var first = rows[0];

  if (first && first[0] && /^!/.test(first[0]) === true) {
    headers = first.map(function (h) {
      h = h.replace(/^\! */, '');
      h = cleanText(h);
      return h;
    });
    rows.shift();
  } //try the second row, too (overwrite first-row, if it exists)


  first = rows[0];

  if (first && first[0] && first[1] && /^!/.test(first[0]) && /^!/.test(first[1])) {
    first.forEach(function (h, i) {
      h = h.replace(/^\! */, '');
      h = cleanText(h);

      if (Boolean(h) === true) {
        headers[i] = h;
      }
    });
    rows.shift();
  }

  return headers;
}; //turn headers, array into an object


var parseRow = function parseRow(arr, headers) {
  var row = {};
  arr.forEach(function (str, i) {
    var h = headers[i] || 'col' + (i + 1);
    var s = parseSentence(str);
    s.text(cleanText(s.text()));
    row[h] = s;
  });
  return row;
}; //should we use the first row as a the headers?


var firstRowHeader = function firstRowHeader(rows) {
  if (rows.length <= 3) {
    return [];
  }

  var headers = rows[0].slice(0);
  headers = headers.map(function (h) {
    h = h.replace(/^\! */, '');
    h = parseSentence(h).text();
    h = cleanText(h);
    h = h.toLowerCase();
    return h;
  });

  for (var i = 0; i < headers.length; i += 1) {
    if (headings.hasOwnProperty(headers[i])) {
      rows.shift();
      return headers;
    }
  }

  return [];
}; //turn a {|...table string into an array of arrays


var parseTable = function parseTable(wiki) {
  var lines = wiki.replace(/\r/g, '').split(/\n/);
  lines = lines.map(function (l) {
    return l.trim();
  });
  var rows = findRows(lines); //support colspan, rowspan...

  rows = handleSpans(rows); //grab the header rows

  var headers = findHeaders(rows);

  if (!headers || headers.length <= 1) {
    headers = firstRowHeader(rows);
    var want = rows[rows.length - 1] || []; //try the second row

    if (headers.length <= 1 && want.length > 2) {
      headers = firstRowHeader(rows.slice(1));

      if (headers.length > 0) {
        rows = rows.slice(2); //remove them
      }
    }
  } //index each column by it's header


  var table = rows.map(function (arr) {
    return parseRow(arr, headers);
  });
  return table;
};

module.exports = parseTable;

},{"../../../04-sentence/":58,"./_findRows":33,"./_spans":34}],36:[function(_dereq_,module,exports){
"use strict";

//turn a json table into a html table
var toHtml = function toHtml(table, options) {
  var html = '<table class="table">\n'; //make header

  html += '  <thead>\n';
  html += '  <tr>\n';
  Object.keys(table[0]).forEach(function (k) {
    if (/^col[0-9]/.test(k) !== true) {
      html += '    <td>' + k + '</td>\n';
    }
  });
  html += '  </tr>\n';
  html += '  </thead>\n';
  html += '  <tbody>\n'; //make rows

  table.forEach(function (o) {
    html += '  <tr>\n';
    Object.keys(o).forEach(function (k) {
      var val = o[k].html(options);
      html += '    <td>' + val + '</td>\n';
    });
    html += '  </tr>\n';
  });
  html += '  </tbody>\n';
  html += '</table>\n';
  return html;
};

module.exports = toHtml;

},{}],37:[function(_dereq_,module,exports){
"use strict";

var encode = _dereq_('../../_lib/encode'); //


var toJson = function toJson(tables, options) {
  return tables.map(function (table) {
    var row = {};
    Object.keys(table).forEach(function (k) {
      row[k] = table[k].json(); //(they're sentence objects)
    }); //encode them, for mongodb

    if (options.encode === true) {
      row = encode.encodeObj(row);
    }

    return row;
  });
};

module.exports = toJson;

},{"../../_lib/encode":78}],38:[function(_dereq_,module,exports){
"use strict";

//create a formal LATEX table
var doTable = function doTable(table, options) {
  var out = '\n%\\vspace*{0.3cm}\n';
  out += '\n% BEGIN TABLE: only left align columns in LaTeX table with horizontal line separation between columns';
  out += '\n% Format Align Column: \'l\'=left \'r\'=right align, \'c\'=center, \'p{5cm}\'=block with column width 5cm ';
  out += '\n\\begin{tabular}{|';
  Object.keys(table[0]).forEach(function () {
    out += 'l|';
  });
  out += '} \n';
  out += '\n  \\hline  %horizontal line\n'; //make header

  out += '\n  % BEGIN: Table Header';
  var vSep = '   ';
  Object.keys(table[0]).forEach(function (k) {
    out += '\n    ' + vSep;

    if (k.indexOf('col-') === 0) {
      out += '\\textbf{' + k + '}';
    } else {
      out += '  ';
    }

    vSep = ' & ';
  });
  out += '\\\\ ';
  out += '\n  % END: Table Header';
  out += '\n  % BEGIN: Table Body';
  out += '\n  \\hline  % ----- table row -----'; ////make rows

  table.forEach(function (o) {
    vSep = ' ';
    out += '\n  % ----- table row -----';
    Object.keys(o).forEach(function (k) {
      var s = o[k];
      var val = s.latex(options);
      out += '\n    ' + vSep + val + '';
      vSep = ' & ';
    });
    out += '  \\\\ '; // newline in latex table = two backslash \\

    out += '\n  \\hline  %horizontal line';
  });
  out += '\n    % END: Table Body';
  out += '\\end{tabular} \n';
  out += '\n\\vspace*{0.3cm}\n\n';
  return out;
};

module.exports = doTable;

},{}],39:[function(_dereq_,module,exports){
"use strict";

var pad = _dereq_('../../_lib/pad');
/* this is a markdown table:
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
*/


var makeRow = function makeRow(arr) {
  arr = arr.map(function (s) {
    return pad(s, 14);
  });
  return '| ' + arr.join(' | ') + ' |';
}; //markdown tables are weird


var doTable = function doTable(table, options) {
  var md = '';

  if (!table || table.length === 0) {
    return md;
  }

  var keys = Object.keys(table[0]); //first, grab the headers
  //remove auto-generated number keys

  var headers = keys.map(function (k) {
    if (/^col[0-9]/.test(k) === true) {
      return '';
    }

    return k;
  }); //draw the header (necessary!)

  md += makeRow(headers) + '\n';
  md += makeRow(headers.map(function () {
    return '---';
  })) + '\n'; //do each row..

  md += table.map(function (row) {
    //each column..
    var arr = keys.map(function (k) {
      if (!row[k]) {
        return '';
      }

      return row[k].markdown(options) || '';
    }); //make it a nice padded row

    return makeRow(arr);
  }).join('\n');
  return md + '\n';
};

module.exports = doTable;

},{"../../_lib/pad":80}],40:[function(_dereq_,module,exports){
"use strict";

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  headers: true,
  images: true,
  tables: true,
  lists: true,
  paragraphs: true
};

var doSection = function doSection(section, options) {
  options = setDefaults(options, defaults);
  var html = ''; //make the header

  if (options.headers === true && section.title()) {
    var num = 1 + section.depth;
    html += '  <h' + num + '>' + section.title() + '</h' + num + '>';
    html += '\n';
  } //put any images under the header


  if (options.images === true) {
    var imgs = section.images();

    if (imgs.length > 0) {
      html += imgs.map(function (image) {
        return image.html(options);
      }).join('\n');
    }
  } //make a html table


  if (options.tables === true) {
    html += section.tables().map(function (t) {
      return t.html(options);
    }).join('\n');
  } // //make a html bullet-list


  if (options.lists === true) {
    html += section.lists().map(function (list) {
      return list.html(options);
    }).join('\n');
  } //finally, write the sentence text.


  if (options.paragraphs === true && section.paragraphs().length > 0) {
    html += '  <div class="text">\n';
    section.paragraphs().forEach(function (p) {
      html += '    <p class="paragraph">\n';
      html += '      ' + p.sentences().map(function (s) {
        return s.html(options);
      }).join(' ');
      html += '\n    </p>\n';
    });
    html += '  </div>\n';
  } else if (options.sentences === true) {
    html += '      ' + section.sentences().map(function (s) {
      return s.html(options);
    }).join(' ');
  }

  return '<div class="section">\n' + html + '</div>\n';
};

module.exports = doSection;

},{"../_lib/setDefaults":82}],41:[function(_dereq_,module,exports){
"use strict";

var setDefaults = _dereq_('../_lib/setDefaults');

var encode = _dereq_('../_lib/encode');

var defaults = {
  headers: true,
  depth: true,
  paragraphs: true,
  images: true,
  tables: true,
  templates: true,
  infoboxes: true,
  lists: true
}; //

var toJSON = function toJSON(section, options) {
  options = setDefaults(options, defaults);
  var data = {};

  if (options.headers === true) {
    data.title = section.title();
  }

  if (options.depth === true) {
    data.depth = section.depth;
  } //these return objects


  if (options.paragraphs === true) {
    var paragraphs = section.paragraphs().map(function (p) {
      return p.json(options);
    });

    if (paragraphs.length > 0) {
      data.paragraphs = paragraphs;
    }
  } //image json data


  if (options.images === true) {
    var images = section.images().map(function (img) {
      return img.json(options);
    });

    if (images.length > 0) {
      data.images = images;
    }
  } //table json data


  if (options.tables === true) {
    var tables = section.tables().map(function (t) {
      return t.json(options);
    });

    if (tables.length > 0) {
      data.tables = tables;
    }
  } //template json data


  if (options.templates === true) {
    var templates = section.templates();

    if (templates.length > 0) {
      data.templates = templates; //encode them, for mongodb

      if (options.encode === true) {
        data.templates.forEach(function (t) {
          return encode.encodeObj(t);
        });
      }
    }
  } //infobox json data


  if (options.infoboxes === true) {
    var infoboxes = section.infoboxes().map(function (i) {
      return i.json(options);
    });

    if (infoboxes.length > 0) {
      data.infoboxes = infoboxes;
    }
  } //list json data


  if (options.lists === true) {
    var lists = section.lists().map(function (list) {
      return list.json(options);
    });

    if (lists.length > 0) {
      data.lists = lists;
    }
  } //default off


  if (options.sentences === true) {
    data.sentences = section.sentences().map(function (s) {
      return s.json(options);
    });
  }

  return data;
};

module.exports = toJSON;

},{"../_lib/encode":78,"../_lib/setDefaults":82}],42:[function(_dereq_,module,exports){
"use strict";

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  headers: true,
  images: true,
  tables: true,
  lists: true,
  paragraphs: true
}; //map '==' depth to 'subsection', 'subsubsection', etc

var doSection = function doSection(section, options) {
  options = setDefaults(options, defaults);
  var out = '';
  var num = 1; //make the header

  if (options.headers === true && section.title()) {
    num = 1 + section.depth;
    var vOpen = '\n';
    var vClose = '}';

    switch (num) {
      case 1:
        vOpen += '\\chapter{';
        break;

      case 2:
        vOpen += '\\section{';
        break;

      case 3:
        vOpen += '\\subsection{';
        break;

      case 4:
        vOpen += '\\subsubsection{';
        break;

      case 5:
        vOpen += '\\paragraph{';
        vClose = '} \\\\ \n';
        break;

      case 6:
        vOpen += '\\subparagraph{';
        vClose = '} \\\\ \n';
        break;

      default:
        vOpen += '\n% section with depth=' + num + ' undefined - use subparagraph instead\n\\subparagraph{';
        vClose = '} \\\\ \n';
    }

    out += vOpen + section.title() + vClose;
    out += '\n';
  } //put any images under the header


  if (options.images === true && section.images()) {
    out += section.images().map(function (img) {
      return img.latex(options);
    }).join('\n'); //out += '\n';
  } //make a out tablew


  if (options.tables === true && section.tables()) {
    out += section.tables().map(function (t) {
      return t.latex(options);
    }).join('\n');
  } // //make a out bullet-list


  if (options.lists === true && section.lists()) {
    out += section.lists().map(function (list) {
      return list.latex(options);
    }).join('\n');
  } //finally, write the sentence text.


  if (options.paragraphs === true || options.sentences === true) {
    out += section.paragraphs().map(function (s) {
      return s.latex(options);
    }).join(' ');
    out += '\n';
  } // var title_tag = ' SECTION depth=' + num + ' - TITLE: ' + section.title + '\n';
  // wrap a section comment
  //out = '\n% BEGIN' + title_tag + out + '\n% END' + title_tag;


  return out;
};

module.exports = doSection;

},{"../_lib/setDefaults":82}],43:[function(_dereq_,module,exports){
"use strict";

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  headers: true,
  images: true,
  tables: true,
  lists: true,
  paragraphs: true
};

var doSection = function doSection(section, options) {
  options = setDefaults(options, defaults);
  var md = ''; //make the header

  if (options.headers === true && section.title()) {
    var header = '##';

    for (var i = 0; i < section.depth; i += 1) {
      header += '#';
    }

    md += header + ' ' + section.title() + '\n';
  } //put any images under the header


  if (options.images === true) {
    var images = section.images();

    if (images.length > 0) {
      md += images.map(function (img) {
        return img.markdown();
      }).join('\n');
      md += '\n';
    }
  } //make a mardown table


  if (options.tables === true) {
    var tables = section.tables();

    if (tables.length > 0) {
      md += '\n';
      md += tables.map(function (table) {
        return table.markdown(options);
      }).join('\n');
      md += '\n';
    }
  } //make a mardown bullet-list


  if (options.lists === true) {
    var lists = section.lists();

    if (lists.length > 0) {
      md += lists.map(function (list) {
        return list.markdown(options);
      }).join('\n');
      md += '\n';
    }
  } //finally, write the sentence text.


  if (options.paragraphs === true || options.sentences === true) {
    md += section.paragraphs().map(function (p) {
      return p.sentences().map(function (s) {
        return s.markdown(options);
      }).join(' ');
    }).join('\n\n');
  }

  return md;
};

module.exports = doSection;

},{"../_lib/setDefaults":82}],44:[function(_dereq_,module,exports){
"use strict";

var toJSON = _dereq_('./toJson');

var toMarkdown = _dereq_('./toMarkdown');

var toHtml = _dereq_('./toHtml');

var toLatex = _dereq_('./toLatex');

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  sentences: true,
  lists: true,
  images: true
};

var Paragraph = function Paragraph(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

var methods = {
  sentences: function sentences(num) {
    if (typeof num === 'number') {
      return this.data.sentences[num];
    }

    return this.data.sentences || [];
  },
  references: function references(num) {
    if (typeof num === 'number') {
      return this.data.references[num];
    }

    return this.data.references;
  },
  lists: function lists(num) {
    if (typeof num === 'number') {
      return this.data.lists[num];
    }

    return this.data.lists;
  },
  images: function images(num) {
    if (typeof num === 'number') {
      return this.data.images[num];
    }

    return this.data.images || [];
  },
  links: function links(n) {
    var arr = [];
    this.sentences().forEach(function (s) {
      arr = arr.concat(s.links(n));
    });

    if (typeof n === 'number') {
      return arr[n];
    } else if (typeof n === 'string') {
      //grab a specific link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it

      var link = arr.find(function (o) {
        return o.page === n;
      });
      return link === undefined ? [] : [link];
    }

    return arr || [];
  },
  interwiki: function interwiki(num) {
    var arr = [];
    this.sentences().forEach(function (s) {
      arr = arr.concat(s.interwiki());
    });

    if (typeof num === 'number') {
      return arr[num];
    }

    return arr || [];
  },
  markdown: function markdown(options) {
    options = setDefaults(options, defaults);
    return toMarkdown(this, options);
  },
  html: function html(options) {
    options = setDefaults(options, defaults);
    return toHtml(this, options);
  },
  text: function text(options) {
    options = setDefaults(options, defaults);
    var str = this.sentences().map(function (s) {
      return s.text(options);
    }).join(' ');
    this.lists().forEach(function (list) {
      str += '\n' + list.text();
    });
    return str;
  },
  latex: function latex(options) {
    options = setDefaults(options, defaults);
    return toLatex(this, options);
  },
  json: function json(options) {
    options = setDefaults(options, defaults);
    return toJSON(this, options);
  }
};
methods.citations = methods.references;
Object.keys(methods).forEach(function (k) {
  Paragraph.prototype[k] = methods[k];
});
module.exports = Paragraph;

},{"../_lib/setDefaults":82,"./toHtml":52,"./toJson":53,"./toLatex":54,"./toMarkdown":55}],45:[function(_dereq_,module,exports){
"use strict";

var Paragraph = _dereq_('./Paragraph');

var find_recursive = _dereq_('../_lib/recursive_match');

var parseSentences = _dereq_('../04-sentence').addSentences;

var twoNewLines = /\r?\n\W*\r?\n/;
var parse = {
  image: _dereq_('../image'),
  list: _dereq_('./list')
};

var parseParagraphs = function parseParagraphs(wiki) {
  var pList = wiki.split(twoNewLines); //don't create empty paragraphs

  pList = pList.filter(function (p) {
    return p && p.trim().length > 0;
  });
  pList = pList.map(function (str) {
    var data = {
      lists: [],
      sentences: [],
      images: []
    }; //parse the lists

    str = parse.list(str, data); //parse+remove scary '[[ [[]] ]]' stuff

    var matches = find_recursive('[', ']', str); // parse images

    str = parse.image(matches, data, str); //parse the sentences

    parseSentences(str, data);
    return new Paragraph(data);
  });
  return {
    paragraphs: pList,
    wiki: wiki
  };
};

module.exports = parseParagraphs;

},{"../04-sentence":58,"../_lib/recursive_match":81,"../image":85,"./Paragraph":44,"./list":47}],46:[function(_dereq_,module,exports){
"use strict";

var aliasList = _dereq_('../../_lib/aliases');

var setDefaults = _dereq_('../../_lib/setDefaults');

var toJson = _dereq_('./toJson');

var toMarkdown = _dereq_('./toMarkdown');

var toHtml = _dereq_('./toHtml');

var toLatex = _dereq_('./toLatex');

var defaults = {};

var toText = function toText(list, options) {
  return list.map(function (s) {
    var str = s.text(options);
    return ' * ' + str;
  }).join('\n');
};

var List = function List(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

var methods = {
  lines: function lines() {
    return this.data;
  },
  links: function links(n) {
    var links = [];
    this.lines().forEach(function (s) {
      links = links.concat(s.links());
    });

    if (typeof n === 'number') {
      return links[n];
    } else if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it

      var link = links.find(function (o) {
        return o.page === n;
      });
      return link === undefined ? [] : [link];
    }

    return links;
  },
  markdown: function markdown(options) {
    options = setDefaults(options, defaults);
    return toMarkdown(this, options);
  },
  html: function html(options) {
    options = setDefaults(options, defaults);
    return toHtml(this, options);
  },
  latex: function latex(options) {
    options = setDefaults(options, defaults);
    return toLatex(this, options);
  },
  json: function json(options) {
    options = setDefaults(options, defaults);
    return toJson(this, options);
  },
  text: function text() {
    return toText(this.data);
  }
};
Object.keys(methods).forEach(function (k) {
  List.prototype[k] = methods[k];
}); //add alises, too

Object.keys(aliasList).forEach(function (k) {
  List.prototype[k] = methods[aliasList[k]];
});
module.exports = List;

},{"../../_lib/aliases":77,"../../_lib/setDefaults":82,"./toHtml":48,"./toJson":49,"./toLatex":50,"./toMarkdown":51}],47:[function(_dereq_,module,exports){
"use strict";

var List = _dereq_('./List');

var parseSentence = _dereq_('../../04-sentence/').oneSentence;

var list_reg = /^[#\*:;\|]+/;
var bullet_reg = /^\*+[^:,\|]{4}/;
var number_reg = /^ ?\#[^:,\|]{4}/;
var has_word = /[a-z_0-9\]\}]/i; // does it start with a bullet point or something?

var isList = function isList(line) {
  return list_reg.test(line) || bullet_reg.test(line) || number_reg.test(line);
}; //make bullets/numbers into human-readable *'s


var cleanList = function cleanList(list) {
  var number = 1;
  list = list.filter(function (l) {
    return l;
  });

  for (var i = 0; i < list.length; i++) {
    var line = list[i]; //add # numberings formatting

    if (line.match(number_reg)) {
      line = line.replace(/^ ?#*/, number + ') ');
      line = line + '\n';
      number += 1;
    } else if (line.match(list_reg)) {
      number = 1;
      line = line.replace(list_reg, '');
    }

    list[i] = parseSentence(line);
  }

  return list;
};

var grabList = function grabList(lines, i) {
  var sub = [];

  for (var o = i; o < lines.length; o++) {
    if (isList(lines[o])) {
      sub.push(lines[o]);
    } else {
      break;
    }
  }

  sub = sub.filter(function (a) {
    return a && has_word.test(a);
  });
  sub = cleanList(sub);
  return sub;
};

var parseList = function parseList(wiki, data) {
  var lines = wiki.split(/\n/g); // lines = lines.filter(l => has_word.test(l));

  var lists = [];
  var theRest = [];

  for (var i = 0; i < lines.length; i++) {
    if (isList(lines[i]) && lines[i + 1] && isList(lines[i + 1])) {
      var sub = grabList(lines, i);

      if (sub.length > 0) {
        lists.push(sub);
        i += sub.length - 1;
      }
    } else {
      theRest.push(lines[i]);
    }
  }

  data.lists = lists.map(function (l) {
    return new List(l);
  });
  wiki = theRest.join('\n');
  return wiki;
};

module.exports = parseList;

},{"../../04-sentence/":58,"./List":46}],48:[function(_dereq_,module,exports){
"use strict";

//
var toHtml = function toHtml(list, options) {
  var html = '  <ul class="list">\n';
  list.lines().forEach(function (s) {
    html += '    <li>' + s.html(options) + '</li>\n';
  });
  html += '  </ul>\n';
  return html;
};

module.exports = toHtml;

},{}],49:[function(_dereq_,module,exports){
"use strict";

//
var toJson = function toJson(p, options) {
  return p.lines().map(function (s) {
    return s.json(options);
  });
};

module.exports = toJson;

},{}],50:[function(_dereq_,module,exports){
"use strict";

//
var toLatex = function toLatex(list, options) {
  var out = '\\begin{itemize}\n';
  list.lines().forEach(function (s) {
    out += '  \\item ' + s.text(options) + '\n';
  });
  out += '\\end{itemize}\n';
  return out;
};

module.exports = toLatex;

},{}],51:[function(_dereq_,module,exports){
"use strict";

//
var toMarkdown = function toMarkdown(list, options) {
  return list.lines().map(function (s) {
    var str = s.markdown(options);
    return ' * ' + str;
  }).join('\n');
};

module.exports = toMarkdown;

},{}],52:[function(_dereq_,module,exports){
"use strict";

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  sentences: true
};

var toHtml = function toHtml(p, options) {
  options = setDefaults(options, defaults);
  var html = '';

  if (options.sentences === true) {
    html += p.sentences().map(function (s) {
      return s.html(options);
    }).join('\n');
  }

  return html;
};

module.exports = toHtml;

},{"../_lib/setDefaults":82}],53:[function(_dereq_,module,exports){
"use strict";

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  sentences: true
};

var toJson = function toJson(p, options) {
  options = setDefaults(options, defaults);
  var data = {};

  if (options.sentences === true) {
    data.sentences = p.sentences().map(function (s) {
      return s.json(options);
    });
  }

  return data;
};

module.exports = toJson;

},{"../_lib/setDefaults":82}],54:[function(_dereq_,module,exports){
"use strict";

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  sentences: true
};

var toLatex = function toLatex(p, options) {
  options = setDefaults(options, defaults);
  var out = '';

  if (options.sentences === true) {
    out += '\n\n% BEGIN Paragraph\n';
    out += p.sentences().reduce(function (str, s) {
      str += s.latex(options) + '\n';
      return str;
    }, '');
    out += '% END Paragraph';
  }

  return out;
};

module.exports = toLatex;

},{"../_lib/setDefaults":82}],55:[function(_dereq_,module,exports){
"use strict";

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  sentences: true
};

var toMarkdown = function toMarkdown(p, options) {
  options = setDefaults(options, defaults);
  var md = '';

  if (options.sentences === true) {
    md += p.sentences().reduce(function (str, s) {
      str += s.markdown(options) + '\n';
      return str;
    }, {});
  }

  return md;
};

module.exports = toMarkdown;

},{"../_lib/setDefaults":82}],56:[function(_dereq_,module,exports){
"use strict";

var toHtml = _dereq_('./toHtml');

var toMarkdown = _dereq_('./toMarkdown');

var toJSON = _dereq_('./toJson');

var toLatex = _dereq_('./toLatex');

var aliasList = _dereq_('../_lib/aliases'); //where we store the formatting, link, date information


var Sentence = function Sentence(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

var methods = {
  links: function links(n) {
    var arr = this.data.links || [];

    if (typeof n === 'number') {
      return arr[n];
    } else if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it

      var link = arr.find(function (o) {
        return o.page === n;
      });
      return link === undefined ? [] : [link];
    }

    return arr;
  },
  interwiki: function interwiki(n) {
    var arr = this.links().filter(function (l) {
      return l.wiki !== undefined;
    });

    if (typeof n === 'number') {
      return arr[n];
    }

    return arr;
  },
  bolds: function bolds(n) {
    var arr = [];

    if (this.data && this.data.fmt && this.data.fmt.bold) {
      arr = this.data.fmt.bold || [];
    }

    if (typeof n === 'number') {
      return arr[n];
    }

    return arr;
  },
  italics: function italics(n) {
    var arr = [];

    if (this.data && this.data.fmt && this.data.fmt.italic) {
      arr = this.data.fmt.italic || [];
    }

    if (typeof n === 'number') {
      return arr[n];
    }

    return arr;
  },
  dates: function dates(n) {
    var arr = [];

    if (this.data && this.data.dates) {
      arr = this.data.dates || [];
    }

    if (typeof n === 'number') {
      return arr[n];
    }

    return arr;
  },
  markdown: function markdown(options) {
    options = options || {};
    return toMarkdown(this, options);
  },
  html: function html(options) {
    options = options || {};
    return toHtml(this, options);
  },
  text: function text(str) {
    if (str !== undefined && typeof str === 'string') {
      //set the text?
      this.data.text = str;
    }

    return this.data.text || '';
  },
  json: function json(options) {
    return toJSON(this, options);
  },
  latex: function latex(options) {
    return toLatex(this, options);
  }
};
Object.keys(methods).forEach(function (k) {
  Sentence.prototype[k] = methods[k];
}); //add alises, too

Object.keys(aliasList).forEach(function (k) {
  Sentence.prototype[k] = methods[aliasList[k]];
});
Sentence.prototype.italic = Sentence.prototype.italics;
Sentence.prototype.bold = Sentence.prototype.bolds;
Sentence.prototype.plaintext = Sentence.prototype.text;
module.exports = Sentence;

},{"../_lib/aliases":77,"./toHtml":62,"./toJson":63,"./toLatex":64,"./toMarkdown":65}],57:[function(_dereq_,module,exports){
"use strict";

//handle the bold/italics
var formatting = function formatting(obj) {
  var bolds = [];
  var italics = [];
  var wiki = obj.text || ''; //bold and italics combined 5 's

  wiki = wiki.replace(/'''''(.{0,200}?)'''''/g, function (a, b) {
    bolds.push(b);
    italics.push(b);
    return b;
  }); //''''four'''' → bold with quotes

  wiki = wiki.replace(/''''(.{0,200}?)''''/g, function (a, b) {
    bolds.push("'".concat(b, "'"));
    return "'".concat(b, "'");
  }); //'''bold'''

  wiki = wiki.replace(/'''(.{0,200}?)'''/g, function (a, b) {
    bolds.push(b);
    return b;
  }); //''italic''

  wiki = wiki.replace(/''(.{0,200}?)''/g, function (a, b) {
    italics.push(b);
    return b;
  }); //pack it all up..

  obj.text = wiki;

  if (bolds.length > 0) {
    obj.fmt = obj.fmt || {};
    obj.fmt.bold = bolds;
  }

  if (italics.length > 0) {
    obj.fmt = obj.fmt || {};
    obj.fmt.italic = italics;
  }

  return obj;
};

module.exports = formatting;

},{}],58:[function(_dereq_,module,exports){
"use strict";

var helpers = _dereq_('../_lib/helpers');

var parseLinks = _dereq_('./links');

var parseFmt = _dereq_('./formatting');

var Sentence = _dereq_('./Sentence'); // const templates = require('./templates');


var sentenceParser = _dereq_('./parse');

var i18n = _dereq_('../_data/i18n');

var cat_reg = new RegExp('\\[\\[:?(' + i18n.categories.join('|') + '):[^\\]\\]]{2,80}\\]\\]', 'gi'); //return only rendered text of wiki links

var resolve_links = function resolve_links(line) {
  // categories, images, files
  line = line.replace(cat_reg, ''); // [[Common links]]

  line = line.replace(/\[\[:?([^|]{1,80}?)\]\](\w{0,5})/g, '$1$2'); // [[File:with|Size]]

  line = line.replace(/\[\[File:(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, ''); // [[Replaced|Links]]

  line = line.replace(/\[\[:?(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, '$2$3'); // External links

  line = line.replace(/\[(https?|news|ftp|mailto|gopher|irc):\/\/[^\]\| ]{4,1500}([\| ].*?)?\]/g, '$2');
  return line;
}; // console.log(resolve_links("[http://www.whistler.ca www.whistler.ca]"))


function postprocess(line) {
  //fix links
  line = resolve_links(line); //remove empty parentheses (sometimes caused by removing templates)

  line = line.replace(/\([,;: ]*\)/g, ''); //these semi-colons in parentheses are particularly troublesome

  line = line.replace(/\( *(; ?)+/g, '('); //dangling punctuation

  line = helpers.trim_whitespace(line);
  line = line.replace(/ +\.$/, '.');
  return line;
}

function oneSentence(str) {
  var obj = {
    text: postprocess(str)
  }; //pull-out the [[links]]

  var links = parseLinks(str);

  if (links) {
    obj.links = links;
  } //pull-out the bolds and ''italics''


  obj = parseFmt(obj); //pull-out things like {{start date|...}}
  // obj = templates(obj);

  return new Sentence(obj);
} //turn a text into an array of sentence objects


var parseSentences = function parseSentences(wiki) {
  var sentences = sentenceParser(wiki);
  sentences = sentences.map(oneSentence); //remove :indented first line, as it is often a disambiguation

  if (sentences[0] && sentences[0].text() && sentences[0].text()[0] === ':') {
    sentences = sentences.slice(1);
  }

  return sentences;
}; //used for consistency with other class-definitions


var addSentences = function addSentences(wiki, data) {
  data.sentences = parseSentences(wiki);
  return wiki;
};

module.exports = {
  parseSentences: parseSentences,
  oneSentence: oneSentence,
  addSentences: addSentences
};

},{"../_data/i18n":68,"../_lib/helpers":79,"./Sentence":56,"./formatting":57,"./links":60,"./parse":61}],59:[function(_dereq_,module,exports){
"use strict";

var languages = _dereq_('../_data/languages'); //some colon symbols are valid links, like `America: That place`
//so we have to whitelist allowable interwiki links


var interwikis = ['wiktionary', 'wikinews', 'wikibooks', 'wikiquote', 'wikisource', 'wikispecies', 'wikiversity', 'wikivoyage', 'wikipedia', 'wikimedia', 'foundation', 'meta', 'metawikipedia', 'w', 'wikt', 'n', 'b', 'q', 's', 'v', 'voy', 'wmf', 'c', 'm', 'mw', 'phab', 'd'];
var allowed = interwikis.reduce(function (h, wik) {
  h[wik] = true;
  return h;
}, {}); //add language prefixes too..

Object.keys(languages).forEach(function (k) {
  return allowed[k] = true;
}); //this is predictably very complicated.
// https://meta.wikimedia.org/wiki/Help:Interwiki_linking

var parseInterwiki = function parseInterwiki(obj) {
  var str = obj.page || '';

  if (str.indexOf(':') !== -1) {
    var m = str.match(/^(.*):(.*)/);

    if (m === null) {
      return obj;
    }

    var site = m[1] || '';
    site = site.toLowerCase(); //only allow interwikis to these specific places

    if (allowed.hasOwnProperty(site) === false) {
      return obj;
    }

    obj.wiki = site;
    obj.page = m[2];
  }

  return obj;
};

module.exports = parseInterwiki;

},{"../_data/languages":69}],60:[function(_dereq_,module,exports){
"use strict";

// const helpers = require('../_lib/helpers');
var parse_interwiki = _dereq_('./interwiki');

var ignore_links = /^:?(category|catégorie|Kategorie|Categoría|Categoria|Categorie|Kategoria|تصنيف|image|file|image|fichier|datei|media):/i;
var external_link = /\[(https?|news|ftp|mailto|gopher|irc)(:\/\/[^\]\| ]{4,1500})([\| ].*?)?\]/g;
var link_reg = /\[\[(.{0,160}?)\]\]([a-z']+)?(\w{0,10})/gi; //allow dangling suffixes - "[[flanders]]'s"
// const i18n = require('../_data/i18n');
// const isFile = new RegExp('(' + i18n.images.concat(i18n.files).join('|') + '):', 'i');

var external_links = function external_links(links, str) {
  str.replace(external_link, function (all, protocol, link, text) {
    text = text || '';
    links.push({
      type: 'external',
      site: protocol + link,
      text: text.trim()
    });
    return text;
  });
  return links;
};

var internal_links = function internal_links(links, str) {
  //regular links
  str.replace(link_reg, function (_, s, apostrophe) {
    var txt = null; //make a copy of original

    var link = s;

    if (s.match(/\|/)) {
      //replacement link [[link|text]]
      s = s.replace(/\[\[(.{2,100}?)\]\](\w{0,10})/g, '$1$2'); //remove ['s and keep suffix

      link = s.replace(/(.{2,100})\|.{0,200}/, '$1'); //replaced links

      txt = s.replace(/.{2,100}?\|/, ''); //handle funky case of [[toronto|]]

      if (txt === null && link.match(/\|$/)) {
        link = link.replace(/\|$/, '');
        txt = link;
      }
    } //kill off non-wikipedia namespaces


    if (link.match(ignore_links)) {
      return s;
    } //kill off just these just-anchor links [[#history]]


    if (link.match(/^#/i)) {
      return s;
    } //remove anchors from end [[toronto#history]]


    var obj = {
      page: link
    };
    obj.page = obj.page.replace(/#(.*)/, function (a, b) {
      obj.anchor = b;
      return '';
    }); //grab any fr:Paris parts

    obj = parse_interwiki(obj);

    if (txt !== null && txt !== obj.page) {
      obj.text = txt;
    } //finally, support [[link]]'s apostrophe


    if (apostrophe === '\'s') {
      obj.text = obj.text || obj.page;
      obj.text += apostrophe;
    } //titlecase it, if necessary


    if (obj.page && /^[A-Z]/.test(obj.page) === false) {
      if (!obj.text) {
        obj.text = obj.page;
      }

      obj.page = obj.page.charAt(0).toUpperCase() + obj.page.substring(1);
    }

    links.push(obj);
    return s;
  });
  return links;
}; //grab an array of internal links in the text


var parse_links = function parse_links(str) {
  var links = []; //first, parse external links

  links = external_links(links, str); //internal links

  links = internal_links(links, str);

  if (links.length === 0) {
    return undefined;
  }

  return links;
};

module.exports = parse_links;

},{"./interwiki":59}],61:[function(_dereq_,module,exports){
"use strict";

//split text into sentences, using regex
//@spencermountain MIT
//(Rule-based sentence boundary segmentation) - chop given text into its proper sentences.
// Ignore periods/questions/exclamations used in acronyms/abbreviations/numbers, etc.
// @spencermountain 2015 MIT
var abbreviations = _dereq_('../_data/abbreviations');

var abbrev_reg = new RegExp('(^| |\')(' + abbreviations.join('|') + ")[.!?] ?$", 'i');
var acronym_reg = new RegExp('[ |.][A-Z].? +?$', 'i');
var elipses_reg = new RegExp('\\.\\.\\.* +?$');
var hasWord = new RegExp('[a-z][a-z]', 'i'); //turn a nested array into one array

var flatten = function flatten(arr) {
  var all = [];
  arr.forEach(function (a) {
    all = all.concat(a);
  });
  return all;
};

var naiive_split = function naiive_split(text) {
  //first, split by newline
  var splits = text.split(/(\n+)/);
  splits = splits.filter(function (s) {
    return s.match(/\S/);
  }); //split by period, question-mark, and exclamation-mark

  splits = splits.map(function (str) {
    return str.split(/(\S.+?[.!?]"?)(?=\s+|$)/g);
  });
  return flatten(splits);
}; // if this looks like a period within a wikipedia link, return false


var isBalanced = function isBalanced(str) {
  str = str || '';
  var open = str.split(/\[\[/) || [];
  var closed = str.split(/\]\]/) || [];

  if (open.length > closed.length) {
    return false;
  } //make sure quotes are closed too


  var quotes = str.match(/"/g);

  if (quotes && quotes.length % 2 !== 0 && str.length < 900) {
    return false;
  }

  return true;
};

var sentence_parser = function sentence_parser(text) {
  var sentences = []; //first do a greedy-split..

  var chunks = []; //ensure it 'smells like' a sentence

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return sentences;
  } // This was the splitter regex updated to fix quoted punctuation marks.
  // let splits = text.split(/(\S.+?[.\?!])(?=\s+|$|")/g);
  // todo: look for side effects in this regex replacement:


  var splits = naiive_split(text); //filter-out the grap ones

  for (var i = 0; i < splits.length; i++) {
    var s = splits[i];

    if (!s || s === '') {
      continue;
    } //this is meaningful whitespace


    if (!s.match(/\S/)) {
      //add it to the last one
      if (chunks[chunks.length - 1]) {
        chunks[chunks.length - 1] += s;
        continue;
      } else if (splits[i + 1]) {
        //add it to the next one
        splits[i + 1] = s + splits[i + 1];
        continue;
      }
    }

    chunks.push(s);
  } //detection of non-sentence chunks


  var isSentence = function isSentence(hmm) {
    if (hmm.match(abbrev_reg) || hmm.match(acronym_reg) || hmm.match(elipses_reg)) {
      return false;
    } //too short? - no consecutive letters


    if (hasWord.test(hmm) === false) {
      return false;
    }

    if (!isBalanced(hmm)) {
      return false;
    }

    return true;
  }; //loop through these chunks, and join the non-sentence chunks back together..


  for (var _i = 0; _i < chunks.length; _i++) {
    //should this chunk be combined with the next one?
    if (chunks[_i + 1] && !isSentence(chunks[_i])) {
      chunks[_i + 1] = chunks[_i] + (chunks[_i + 1] || ''); //.replace(/ +/g, ' ');
    } else if (chunks[_i] && chunks[_i].length > 0) {
      //this chunk is a proper sentence..
      sentences.push(chunks[_i]);
      chunks[_i] = '';
    }
  } //if we never got a sentence, return the given text


  if (sentences.length === 0) {
    return [text];
  }

  return sentences;
};

module.exports = sentence_parser; // console.log(sentence_parser('Tony is nice. He lives in Japan.').length === 2);

},{"../_data/abbreviations":66}],62:[function(_dereq_,module,exports){
"use strict";

var smartReplace = _dereq_('../_lib/smartReplace');

var helpers = _dereq_('../_lib/helpers');

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  links: true,
  formatting: true
}; // create links, bold, italic in html

var doSentence = function doSentence(sentence, options) {
  options = setDefaults(options, defaults);
  var text = sentence.text(); //turn links into <a href>

  if (options.links === true) {
    sentence.links().forEach(function (link) {
      var href = '';
      var classNames = 'link';

      if (link.site) {
        //use an external link
        href = link.site;
        classNames += ' external';
      } else {
        //otherwise, make it a relative internal link
        href = helpers.capitalise(link.page);
        href = './' + href.replace(/ /g, '_'); //add anchor

        if (link.anchor) {
          href += "#".concat(link.anchor);
        }
      }

      var str = link.text || link.page;
      var tag = "<a class=\"".concat(classNames, "\" href=\"").concat(href, "\">").concat(str, "</a>");
      text = smartReplace(text, str, tag);
    });
  }

  if (options.formatting === true) {
    //support bolds
    sentence.bold().forEach(function (str) {
      var tag = '<b>' + str + '</b>';
      text = smartReplace(text, str, tag);
    }); //do italics

    sentence.italic().forEach(function (str) {
      var tag = '<i>' + str + '</i>';
      text = smartReplace(text, str, tag);
    });
  }

  return '<span class="sentence">' + text + '</span>';
};

module.exports = doSentence;

},{"../_lib/helpers":79,"../_lib/setDefaults":82,"../_lib/smartReplace":83}],63:[function(_dereq_,module,exports){
"use strict";

var setDefaults = _dereq_('../_lib/setDefaults');

var isNumber = /^[0-9,.]+$/;
var defaults = {
  text: true,
  links: true,
  formatting: true,
  dates: true,
  numbers: true
};

var toJSON = function toJSON(s, options) {
  options = setDefaults(options, defaults);
  var data = {};
  var text = s.plaintext();

  if (options.text === true) {
    data.text = text;
  } //add number field


  if (options.numbers === true && isNumber.test(text)) {
    var num = Number(text.replace(/,/g, ''));

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

  return data;
};

module.exports = toJSON;

},{"../_lib/setDefaults":82}],64:[function(_dereq_,module,exports){
"use strict";

var smartReplace = _dereq_('../_lib/smartReplace');

var helpers = _dereq_('../_lib/helpers');

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  links: true,
  formatting: true
}; // create links, bold, italic in html

var toLatex = function toLatex(sentence, options) {
  options = setDefaults(options, defaults);
  var text = sentence.plaintext(); //turn links back into links

  if (options.links === true && sentence.links().length > 0) {
    sentence.links().forEach(function (link) {
      var href = '';

      if (link.site) {
        //use an external link
        href = link.site;
      } else {
        //otherwise, make it a relative internal link
        href = helpers.capitalise(link.page);
        href = './' + href.replace(/ /g, '_'); //add anchor

        if (link.anchor) {
          href += "#".concat(link.anchor);
        }
      }

      var str = link.text || link.page;
      var tag = '\\href{' + href + '}{' + str + '}';
      text = smartReplace(text, str, tag);
    });
  }

  if (options.formatting === true) {
    if (sentence.data.fmt) {
      if (sentence.data.fmt.bold) {
        sentence.data.fmt.bold.forEach(function (str) {
          var tag = '\\textbf{' + str + '}';
          text = smartReplace(text, str, tag);
        });
      }

      if (sentence.data.fmt.italic) {
        sentence.data.fmt.italic.forEach(function (str) {
          var tag = '\\textit{' + str + '}';
          text = smartReplace(text, str, tag);
        });
      }
    }
  }

  return text;
};

module.exports = toLatex;

},{"../_lib/helpers":79,"../_lib/setDefaults":82,"../_lib/smartReplace":83}],65:[function(_dereq_,module,exports){
"use strict";

var smartReplace = _dereq_('../_lib/smartReplace');

var helpers = _dereq_('../_lib/helpers');

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  links: true,
  formatting: true
}; // add `[text](href)` to the text

var doLink = function doLink(md, link) {
  var href = ''; //if it's an external link, we good

  if (link.site) {
    href = link.site;
  } else {
    //otherwise, make it a relative internal link
    href = helpers.capitalise(link.page);
    href = './' + href.replace(/ /g, '_'); //add anchor

    if (link.anchor) {
      href += "#".concat(link.anchor);
    }
  }

  var str = link.text || link.page;
  var mdLink = '[' + str + '](' + href + ')';
  md = smartReplace(md, str, mdLink);
  return md;
}; //create links, bold, italic in markdown


var toMarkdown = function toMarkdown(sentence, options) {
  options = setDefaults(options, defaults);
  var md = sentence.text(); //turn links back into links

  if (options.links === true) {
    sentence.links().forEach(function (link) {
      md = doLink(md, link);
    });
  } //turn bolds into **bold**


  if (options.formatting === true) {
    sentence.bold().forEach(function (b) {
      md = smartReplace(md, b, '**' + b + '**');
    }); //support *italics*

    sentence.italic().forEach(function (i) {
      md = smartReplace(md, i, '*' + i + '*');
    });
  }

  return md;
};

module.exports = toMarkdown;

},{"../_lib/helpers":79,"../_lib/setDefaults":82,"../_lib/smartReplace":83}],66:[function(_dereq_,module,exports){
"use strict";

//these are used for the sentence-splitter
module.exports = ['jr', 'mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'sen', 'corp', 'calif', 'rep', 'gov', 'atty', 'supt', 'det', 'rev', 'col', 'gen', 'lt', 'cmdr', 'adm', 'capt', 'sgt', 'cpl', 'maj', 'dept', 'univ', 'assn', 'bros', 'inc', 'ltd', 'co', 'corp', 'arc', 'al', 'ave', 'blvd', 'cl', 'ct', 'cres', 'exp', 'rd', 'st', 'dist', 'mt', 'ft', 'fy', 'hwy', 'la', 'pd', 'pl', 'plz', 'tce', 'Ala', 'Ariz', 'Ark', 'Cal', 'Calif', 'Col', 'Colo', 'Conn', 'Del', 'Fed', 'Fla', 'Ga', 'Ida', 'Id', 'Ill', 'Ind', 'Ia', 'Kan', 'Kans', 'Ken', 'Ky', 'La', 'Me', 'Md', 'Mass', 'Mich', 'Minn', 'Miss', 'Mo', 'Mont', 'Neb', 'Nebr', 'Nev', 'Mex', 'Okla', 'Ok', 'Ore', 'Penna', 'Penn', 'Pa', 'Dak', 'Tenn', 'Tex', 'Ut', 'Vt', 'Va', 'Wash', 'Wis', 'Wisc', 'Wy', 'Wyo', 'USAFA', 'Alta', 'Ont', 'QuÔøΩ', 'Sask', 'Yuk', 'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'sept', 'vs', 'etc', 'esp', 'llb', 'md', 'bl', 'phd', 'ma', 'ba', 'miss', 'misses', 'mister', 'sir', 'esq', 'mstr', 'lit', 'fl', 'ex', 'eg', 'sep', 'sept', '..'];

},{}],67:[function(_dereq_,module,exports){
"use strict";

module.exports = [['🇦🇩', 'and', 'andorra'], ['🇦🇪', 'are', 'united arab emirates'], ['🇦🇫', 'afg', 'afghanistan'], ['🇦🇬', 'atg', 'antigua and barbuda'], ['🇦🇮', 'aia', 'anguilla'], ['🇦🇱', 'alb', 'albania'], ['🇦🇲', 'arm', 'armenia'], ['🇦🇴', 'ago', 'angola'], ['🇦🇶', 'ata', 'antarctica'], ['🇦🇷', 'arg', 'argentina'], ['🇦🇸', 'asm', 'american samoa'], ['🇦🇹', 'aut', 'austria'], ['🇦🇺', 'aus', 'australia'], ['🇦🇼', 'abw', 'aruba'], ['🇦🇽', 'ala', 'åland islands'], ['🇦🇿', 'aze', 'azerbaijan'], ['🇧🇦', 'bih', 'bosnia and herzegovina'], ['🇧🇧', 'brb', 'barbados'], ['🇧🇩', 'bgd', 'bangladesh'], ['🇧🇪', 'bel', 'belgium'], ['🇧🇫', 'bfa', 'burkina faso'], ['🇧🇬', 'bgr', 'bulgaria'], ['🇧🇬', 'bul', //dupe
'bulgaria'], ['🇧🇭', 'bhr', 'bahrain'], ['🇧🇮', 'bdi', 'burundi'], ['🇧🇯', 'ben', 'benin'], ['🇧🇱', 'blm', 'saint barthélemy'], ['🇧🇲', 'bmu', 'bermuda'], ['🇧🇳', 'brn', 'brunei darussalam'], ['🇧🇴', 'bol', 'bolivia'], ['🇧🇶', 'bes', 'bonaire, sint eustatius and saba'], ['🇧🇷', 'bra', 'brazil'], ['🇧🇸', 'bhs', 'bahamas'], ['🇧🇹', 'btn', 'bhutan'], ['🇧🇻', 'bvt', 'bouvet island'], ['🇧🇼', 'bwa', 'botswana'], ['🇧🇾', 'blr', 'belarus'], ['🇧🇿', 'blz', 'belize'], ['🇨🇦', 'can', 'canada'], ['🇨🇨', 'cck', 'cocos (keeling) islands'], ['🇨🇩', 'cod', 'congo'], ['🇨🇫', 'caf', 'central african republic'], ['🇨🇬', 'cog', 'congo'], ['🇨🇭', 'che', 'switzerland'], ['🇨🇮', 'civ', 'côte d\'ivoire'], ['🇨🇰', 'cok', 'cook islands'], ['🇨🇱', 'chl', 'chile'], ['🇨🇲', 'cmr', 'cameroon'], ['🇨🇳', 'chn', 'china'], ['🇨🇴', 'col', 'colombia'], ['🇨🇷', 'cri', 'costa rica'], ['🇨🇺', 'cub', 'cuba'], ['🇨🇻', 'cpv', 'cape verde'], ['🇨🇼', 'cuw', 'curaçao'], ['🇨🇽', 'cxr', 'christmas island'], ['🇨🇾', 'cyp', 'cyprus'], ['🇨🇿', 'cze', 'czech republic'], ['🇩🇪', 'deu', 'germany'], ['🇩🇪', 'ger', //alias
'germany'], ['🇩🇯', 'dji', 'djibouti'], ['🇩🇰', 'dnk', 'denmark'], ['🇩🇲', 'dma', 'dominica'], ['🇩🇴', 'dom', 'dominican republic'], ['🇩🇿', 'dza', 'algeria'], ['🇪🇨', 'ecu', 'ecuador'], ['🇪🇪', 'est', 'estonia'], ['🇪🇬', 'egy', 'egypt'], ['🇪🇭', 'esh', 'western sahara'], ['🇪🇷', 'eri', 'eritrea'], ['🇪🇸', 'esp', 'spain'], ['🇪🇹', 'eth', 'ethiopia'], ['🇫🇮', 'fin', 'finland'], ['🇫🇯', 'fji', 'fiji'], ['🇫🇰', 'flk', 'falkland islands (malvinas)'], ['🇫🇲', 'fsm', 'micronesia'], ['🇫🇴', 'fro', 'faroe islands'], ['🇫🇷', 'fra', 'france'], ['🇬🇦', 'gab', 'gabon'], ['🇬🇧', 'gbr', 'united kingdom'], ['🇬🇩', 'grd', 'grenada'], ['🇬🇪', 'geo', 'georgia'], ['🇬🇫', 'guf', 'french guiana'], ['🇬🇬', 'ggy', 'guernsey'], ['🇬🇭', 'gha', 'ghana'], ['🇬🇮', 'gib', 'gibraltar'], ['🇬🇱', 'grl', 'greenland'], ['🇬🇲', 'gmb', 'gambia'], ['🇬🇳', 'gin', 'guinea'], ['🇬🇵', 'glp', 'guadeloupe'], ['🇬🇶', 'gnq', 'equatorial guinea'], ['🇬🇷', 'grc', 'greece'], ['🇬🇸', 'sgs', 'south georgia'], ['🇬🇹', 'gtm', 'guatemala'], ['🇬🇺', 'gum', 'guam'], ['🇬🇼', 'gnb', 'guinea-bissau'], ['🇬🇾', 'guy', 'guyana'], ['🇭🇰', 'hkg', 'hong kong'], ['🇭🇲', 'hmd', 'heard island and mcdonald islands'], ['🇭🇳', 'hnd', 'honduras'], ['🇭🇷', 'hrv', 'croatia'], ['🇭🇹', 'hti', 'haiti'], ['🇭🇺', 'hun', 'hungary'], ['🇮🇩', 'idn', 'indonesia'], ['🇮🇪', 'irl', 'ireland'], ['🇮🇱', 'isr', 'israel'], ['🇮🇲', 'imn', 'isle of man'], ['🇮🇳', 'ind', 'india'], ['🇮🇴', 'iot', 'british indian ocean territory'], ['🇮🇶', 'irq', 'iraq'], ['🇮🇷', 'irn', 'iran'], ['🇮🇸', 'isl', 'iceland'], ['🇮🇹', 'ita', 'italy'], ['🇯🇪', 'jey', 'jersey'], ['🇯🇲', 'jam', 'jamaica'], ['🇯🇴', 'jor', 'jordan'], ['🇯🇵', 'jpn', 'japan'], ['🇰🇪', 'ken', 'kenya'], ['🇰🇬', 'kgz', 'kyrgyzstan'], ['🇰🇭', 'khm', 'cambodia'], ['🇰🇮', 'kir', 'kiribati'], ['🇰🇲', 'com', 'comoros'], ['🇰🇳', 'kna', 'saint kitts and nevis'], ['🇰🇵', 'prk', 'north korea'], ['🇰🇷', 'kor', 'south korea'], ['🇰🇼', 'kwt', 'kuwait'], ['🇰🇾', 'cym', 'cayman islands'], ['🇰🇿', 'kaz', 'kazakhstan'], ['🇱🇦', 'lao', 'lao people\'s democratic republic'], ['🇱🇧', 'lbn', 'lebanon'], ['🇱🇨', 'lca', 'saint lucia'], ['🇱🇮', 'lie', 'liechtenstein'], ['🇱🇰', 'lka', 'sri lanka'], ['🇱🇷', 'lbr', 'liberia'], ['🇱🇸', 'lso', 'lesotho'], ['🇱🇹', 'ltu', 'lithuania'], ['🇱🇺', 'lux', 'luxembourg'], ['🇱🇻', 'lva', 'latvia'], ['🇱🇾', 'lby', 'libya'], ['🇲🇦', 'mar', 'morocco'], ['🇲🇨', 'mco', 'monaco'], ['🇲🇩', 'mda', 'moldova'], ['🇲🇪', 'mne', 'montenegro'], ['🇲🇫', 'maf', 'saint martin (french part)'], ['🇲🇬', 'mdg', 'madagascar'], ['🇲🇭', 'mhl', 'marshall islands'], ['🇲🇰', 'mkd', 'macedonia'], ['🇲🇱', 'mli', 'mali'], ['🇲🇲', 'mmr', 'myanmar'], ['🇲🇳', 'mng', 'mongolia'], ['🇲🇴', 'mac', 'macao'], ['🇲🇵', 'mnp', 'northern mariana islands'], ['🇲🇶', 'mtq', 'martinique'], ['🇲🇷', 'mrt', 'mauritania'], ['🇲🇸', 'msr', 'montserrat'], ['🇲🇹', 'mlt', 'malta'], ['🇲🇺', 'mus', 'mauritius'], ['🇲🇻', 'mdv', 'maldives'], ['🇲🇼', 'mwi', 'malawi'], ['🇲🇽', 'mex', 'mexico'], ['🇲🇾', 'mys', 'malaysia'], ['🇲🇿', 'moz', 'mozambique'], ['🇳🇦', 'nam', 'namibia'], ['🇳🇨', 'ncl', 'new caledonia'], ['🇳🇪', 'ner', 'niger'], ['🇳🇫', 'nfk', 'norfolk island'], ['🇳🇬', 'nga', 'nigeria'], ['🇳🇮', 'nic', 'nicaragua'], ['🇳🇱', 'nld', 'netherlands'], ['🇳🇴', 'nor', 'norway'], ['🇳🇵', 'npl', 'nepal'], ['🇳🇷', 'nru', 'nauru'], ['🇳🇺', 'niu', 'niue'], ['🇳🇿', 'nzl', 'new zealand'], ['🇴🇲', 'omn', 'oman'], ['🇵🇦', 'pan', 'panama'], ['🇵🇪', 'per', 'peru'], ['🇵🇫', 'pyf', 'french polynesia'], ['🇵🇬', 'png', 'papua new guinea'], ['🇵🇭', 'phl', 'philippines'], ['🇵🇰', 'pak', 'pakistan'], ['🇵🇱', 'pol', 'poland'], ['🇵🇲', 'spm', 'saint pierre and miquelon'], ['🇵🇳', 'pcn', 'pitcairn'], ['🇵🇷', 'pri', 'puerto rico'], ['🇵🇸', 'pse', 'palestinian territory'], ['🇵🇹', 'prt', 'portugal'], ['🇵🇼', 'plw', 'palau'], ['🇵🇾', 'pry', 'paraguay'], ['🇶🇦', 'qat', 'qatar'], ['🇷🇪', 'reu', 'réunion'], ['🇷🇴', 'rou', 'romania'], ['🇷🇸', 'srb', 'serbia'], ['🇷🇺', 'rus', 'russia'], ['🇷🇼', 'rwa', 'rwanda'], ['🇸🇦', 'sau', 'saudi arabia'], ['🇸🇧', 'slb', 'solomon islands'], ['🇸🇨', 'syc', 'seychelles'], ['🇸🇩', 'sdn', 'sudan'], ['🇸🇪', 'swe', 'sweden'], ['🇸🇬', 'sgp', 'singapore'], ['🇸🇭', 'shn', 'saint helena, ascension and tristan da cunha'], ['🇸🇮', 'svn', 'slovenia'], ['🇸🇯', 'sjm', 'svalbard and jan mayen'], ['🇸🇰', 'svk', 'slovakia'], ['🇸🇱', 'sle', 'sierra leone'], ['🇸🇲', 'smr', 'san marino'], ['🇸🇳', 'sen', 'senegal'], ['🇸🇴', 'som', 'somalia'], ['🇸🇷', 'sur', 'suriname'], ['🇸🇸', 'ssd', 'south sudan'], ['🇸🇹', 'stp', 'sao tome and principe'], ['🇸🇻', 'slv', 'el salvador'], ['🇸🇽', 'sxm', 'sint maarten (dutch part)'], ['🇸🇾', 'syr', 'syrian arab republic'], ['🇸🇿', 'swz', 'swaziland'], ['🇹🇨', 'tca', 'turks and caicos islands'], ['🇹🇩', 'tcd', 'chad'], ['🇹🇫', 'atf', 'french southern territories'], ['🇹🇬', 'tgo', 'togo'], ['🇹🇭', 'tha', 'thailand'], ['🇹🇯', 'tjk', 'tajikistan'], ['🇹🇰', 'tkl', 'tokelau'], ['🇹🇱', 'tls', 'timor-leste'], ['🇹🇲', 'tkm', 'turkmenistan'], ['🇹🇳', 'tun', 'tunisia'], ['🇹🇴', 'ton', 'tonga'], ['🇹🇷', 'tur', 'turkey'], ['🇹🇹', 'tto', 'trinidad and tobago'], ['🇹🇻', 'tuv', 'tuvalu'], ['🇹🇼', 'twn', 'taiwan'], ['🇹🇿', 'tza', 'tanzania'], ['🇺🇦', 'ukr', 'ukraine'], ['🇺🇬', 'uga', 'uganda'], ['🇺🇲', 'umi', 'united states minor outlying islands'], ['🇺🇸', 'usa', 'united states'], ['🇺🇸', 'us', //alias
'united states'], ['🇺🇾', 'ury', 'uruguay'], ['🇺🇿', 'uzb', 'uzbekistan'], ['🇻🇦', 'vat', 'vatican city'], ['🇻🇨', 'vct', 'saint vincent and the grenadines'], ['🇻🇪', 'ven', 'venezuela'], ['🇻🇬', 'vgb', 'virgin islands, british'], ['🇻🇮', 'vir', 'virgin islands, u.s.'], ['🇻🇳', 'vnm', 'viet nam'], ['🇻🇺', 'vut', 'vanuatu'], ['🇼🇫', 'wlf', 'wallis and futuna'], ['🇼🇸', 'wsm', 'samoa'], ['🇾🇪', 'yem', 'yemen'], ['🇾🇹', 'myt', 'mayotte'], ['🇿🇦', 'zaf', 'south africa'], ['🇿🇲', 'zmb', 'zambia'], ['🇿🇼 ', 'zwe', 'zimbabwe'], //others (later unicode versions)
['🇺🇳', 'un', 'united nations'], ['🏴󠁧󠁢󠁥󠁮󠁧󠁿󠁧󠁢󠁥󠁮󠁧󠁿', 'eng', 'england'], ['🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sct', 'scotland'], ['🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'wal', 'wales']];

},{}],68:[function(_dereq_,module,exports){
"use strict";

// wikipedia special terms lifted and augmented from parsoid parser april 2015
// (not even close to being complete)
var i18n = {
  files: ['файл', 'fitxer', 'soubor', 'datei', 'file', 'archivo', 'پرونده', 'tiedosto', 'mynd', 'su\'wret', 'fichier', 'bestand', 'датотека', 'dosya', 'fil'],
  images: ['image'],
  templates: ['шаблён', 'plantilla', 'šablona', 'vorlage', 'template', 'الگو', 'malline', 'snið', 'shablon', 'modèle', 'sjabloon', 'шаблон', 'şablon'],
  categories: ['катэгорыя', 'categoria', 'kategorie', 'category', 'categoría', 'رده', 'luokka', 'flokkur', 'kategoriya', 'catégorie', 'categorie', 'категорија', 'kategori', 'kategoria', 'تصنيف'],
  redirects: ['перанакіраваньне', 'redirect', 'přesměruj', 'weiterleitung', 'redirección', 'redireccion', 'تغییر_مسیر', 'تغییرمسیر', 'ohjaus', 'uudelleenohjaus', 'tilvísun', 'aýdaw', 'айдау', 'redirection', 'doorverwijzing', 'преусмери', 'преусмјери', 'yönlendi̇rme', 'yönlendi̇r', '重定向', 'redirección', 'redireccion', '重定向', 'yönlendirm?e?', 'تغییر_مسیر', 'تغییرمسیر', 'перанакіраваньне', 'yönlendirme'],
  specials: ['спэцыяльныя', 'especial', 'speciální', 'spezial', 'special', 'ویژه', 'toiminnot', 'kerfissíða', 'arnawlı', 'spécial', 'speciaal', 'посебно', 'özel'],
  users: ['удзельнік', 'usuari', 'uživatel', 'benutzer', 'user', 'usuario', 'کاربر', 'käyttäjä', 'notandi', 'paydalanıwshı', 'utilisateur', 'gebruiker', 'корисник', 'kullanıcı'],
  disambigs: ['disambig', //en
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
  'anlam ayrımı' //tr
  ],
  infoboxes: ['infobox', 'ficha', 'канадский', 'inligtingskas', 'inligtingskas3', //af
  'لغة', 'bilgi kutusu', //tr
  'yerleşim bilgi kutusu', 'infoboks' //nn, no
  ],
  sources: [//blacklist these headings, as they're not plain-text
  'references', 'see also', 'external links', 'further reading', 'notes et références', 'voir aussi', 'liens externes']
};
var dictionary = {};
Object.keys(i18n).forEach(function (k) {
  i18n[k].forEach(function (w) {
    dictionary[w] = true;
  });
});
i18n.dictionary = dictionary;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = i18n;
}

},{}],69:[function(_dereq_,module,exports){
"use strict";

module.exports = {
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

},{}],70:[function(_dereq_,module,exports){
"use strict";

//from https://en.wikipedia.org/w/api.php?action=sitematrix&format=json
var site_map = {
  aawiki: 'https://aa.wikipedia.org',
  aawikipedia: 'https://aa.wikipedia.org',
  aawiktionary: 'https://aa.wiktionary.org',
  aawikibooks: 'https://aa.wikibooks.org',
  abwiki: 'https://ab.wikipedia.org',
  abwikipedia: 'https://ab.wikipedia.org',
  abwiktionary: 'https://ab.wiktionary.org',
  acewiki: 'https://ace.wikipedia.org',
  acewikipedia: 'https://ace.wikipedia.org',
  adywiki: 'https://ady.wikipedia.org',
  adywikipedia: 'https://ady.wikipedia.org',
  afwiki: 'https://af.wikipedia.org',
  afwikipedia: 'https://af.wikipedia.org',
  afwiktionary: 'https://af.wiktionary.org',
  afwikibooks: 'https://af.wikibooks.org',
  afwikiquote: 'https://af.wikiquote.org',
  akwiki: 'https://ak.wikipedia.org',
  akwikipedia: 'https://ak.wikipedia.org',
  akwiktionary: 'https://ak.wiktionary.org',
  akwikibooks: 'https://ak.wikibooks.org',
  alswiki: 'https://als.wikipedia.org',
  alswikipedia: 'https://als.wikipedia.org',
  amwiki: 'https://am.wikipedia.org',
  amwikipedia: 'https://am.wikipedia.org',
  amwiktionary: 'https://am.wiktionary.org',
  amwikiquote: 'https://am.wikiquote.org',
  anwiki: 'https://an.wikipedia.org',
  anwikipedia: 'https://an.wikipedia.org',
  anwiktionary: 'https://an.wiktionary.org',
  angwiki: 'https://ang.wikipedia.org',
  angwikipedia: 'https://ang.wikipedia.org',
  angwiktionary: 'https://ang.wiktionary.org',
  angwikibooks: 'https://ang.wikibooks.org',
  angwikiquote: 'https://ang.wikiquote.org',
  angwikisource: 'https://ang.wikisource.org',
  arwiki: 'https://ar.wikipedia.org',
  arwikipedia: 'https://ar.wikipedia.org',
  arwiktionary: 'https://ar.wiktionary.org',
  arwikibooks: 'https://ar.wikibooks.org',
  arwikinews: 'https://ar.wikinews.org',
  arwikiquote: 'https://ar.wikiquote.org',
  arwikisource: 'https://ar.wikisource.org',
  arwikiversity: 'https://ar.wikiversity.org',
  arcwiki: 'https://arc.wikipedia.org',
  arcwikipedia: 'https://arc.wikipedia.org',
  arzwiki: 'https://arz.wikipedia.org',
  arzwikipedia: 'https://arz.wikipedia.org',
  aswiki: 'https://as.wikipedia.org',
  aswikipedia: 'https://as.wikipedia.org',
  aswiktionary: 'https://as.wiktionary.org',
  aswikibooks: 'https://as.wikibooks.org',
  aswikisource: 'https://as.wikisource.org',
  astwiki: 'https://ast.wikipedia.org',
  astwikipedia: 'https://ast.wikipedia.org',
  astwiktionary: 'https://ast.wiktionary.org',
  astwikibooks: 'https://ast.wikibooks.org',
  astwikiquote: 'https://ast.wikiquote.org',
  atjwiki: 'https://atj.wikipedia.org',
  atjwikipedia: 'https://atj.wikipedia.org',
  avwiki: 'https://av.wikipedia.org',
  avwikipedia: 'https://av.wikipedia.org',
  avwiktionary: 'https://av.wiktionary.org',
  aywiki: 'https://ay.wikipedia.org',
  aywikipedia: 'https://ay.wikipedia.org',
  aywiktionary: 'https://ay.wiktionary.org',
  aywikibooks: 'https://ay.wikibooks.org',
  azwiki: 'https://az.wikipedia.org',
  azwikipedia: 'https://az.wikipedia.org',
  azwiktionary: 'https://az.wiktionary.org',
  azwikibooks: 'https://az.wikibooks.org',
  azwikiquote: 'https://az.wikiquote.org',
  azwikisource: 'https://az.wikisource.org',
  azbwiki: 'https://azb.wikipedia.org',
  azbwikipedia: 'https://azb.wikipedia.org',
  bawiki: 'https://ba.wikipedia.org',
  bawikipedia: 'https://ba.wikipedia.org',
  bawikibooks: 'https://ba.wikibooks.org',
  barwiki: 'https://bar.wikipedia.org',
  barwikipedia: 'https://bar.wikipedia.org',
  bat_smgwiki: 'https://bat-smg.wikipedia.org',
  bat_smgwikipedia: 'https://bat-smg.wikipedia.org',
  bclwiki: 'https://bcl.wikipedia.org',
  bclwikipedia: 'https://bcl.wikipedia.org',
  bewiki: 'https://be.wikipedia.org',
  bewikipedia: 'https://be.wikipedia.org',
  bewiktionary: 'https://be.wiktionary.org',
  bewikibooks: 'https://be.wikibooks.org',
  bewikiquote: 'https://be.wikiquote.org',
  bewikisource: 'https://be.wikisource.org',
  be_x_oldwiki: 'https://be-tarask.wikipedia.org',
  be_x_oldwikipedia: 'https://be-tarask.wikipedia.org',
  bgwiki: 'https://bg.wikipedia.org',
  bgwikipedia: 'https://bg.wikipedia.org',
  bgwiktionary: 'https://bg.wiktionary.org',
  bgwikibooks: 'https://bg.wikibooks.org',
  bgwikinews: 'https://bg.wikinews.org',
  bgwikiquote: 'https://bg.wikiquote.org',
  bgwikisource: 'https://bg.wikisource.org',
  bhwiki: 'https://bh.wikipedia.org',
  bhwikipedia: 'https://bh.wikipedia.org',
  bhwiktionary: 'https://bh.wiktionary.org',
  biwiki: 'https://bi.wikipedia.org',
  biwikipedia: 'https://bi.wikipedia.org',
  biwiktionary: 'https://bi.wiktionary.org',
  biwikibooks: 'https://bi.wikibooks.org',
  bjnwiki: 'https://bjn.wikipedia.org',
  bjnwikipedia: 'https://bjn.wikipedia.org',
  bmwiki: 'https://bm.wikipedia.org',
  bmwikipedia: 'https://bm.wikipedia.org',
  bmwiktionary: 'https://bm.wiktionary.org',
  bmwikibooks: 'https://bm.wikibooks.org',
  bmwikiquote: 'https://bm.wikiquote.org',
  bnwiki: 'https://bn.wikipedia.org',
  bnwikipedia: 'https://bn.wikipedia.org',
  bnwiktionary: 'https://bn.wiktionary.org',
  bnwikibooks: 'https://bn.wikibooks.org',
  bnwikisource: 'https://bn.wikisource.org',
  bnwikivoyage: 'https://bn.wikivoyage.org',
  bowiki: 'https://bo.wikipedia.org',
  bowikipedia: 'https://bo.wikipedia.org',
  bowiktionary: 'https://bo.wiktionary.org',
  bowikibooks: 'https://bo.wikibooks.org',
  bpywiki: 'https://bpy.wikipedia.org',
  bpywikipedia: 'https://bpy.wikipedia.org',
  brwiki: 'https://br.wikipedia.org',
  brwikipedia: 'https://br.wikipedia.org',
  brwiktionary: 'https://br.wiktionary.org',
  brwikiquote: 'https://br.wikiquote.org',
  brwikisource: 'https://br.wikisource.org',
  bswiki: 'https://bs.wikipedia.org',
  bswikipedia: 'https://bs.wikipedia.org',
  bswiktionary: 'https://bs.wiktionary.org',
  bswikibooks: 'https://bs.wikibooks.org',
  bswikinews: 'https://bs.wikinews.org',
  bswikiquote: 'https://bs.wikiquote.org',
  bswikisource: 'https://bs.wikisource.org',
  bugwiki: 'https://bug.wikipedia.org',
  bugwikipedia: 'https://bug.wikipedia.org',
  bxrwiki: 'https://bxr.wikipedia.org',
  bxrwikipedia: 'https://bxr.wikipedia.org',
  cawiki: 'https://ca.wikipedia.org',
  cawikipedia: 'https://ca.wikipedia.org',
  cawiktionary: 'https://ca.wiktionary.org',
  cawikibooks: 'https://ca.wikibooks.org',
  cawikinews: 'https://ca.wikinews.org',
  cawikiquote: 'https://ca.wikiquote.org',
  cawikisource: 'https://ca.wikisource.org',
  cbk_zamwiki: 'https://cbk-zam.wikipedia.org',
  cbk_zamwikipedia: 'https://cbk-zam.wikipedia.org',
  cdowiki: 'https://cdo.wikipedia.org',
  cdowikipedia: 'https://cdo.wikipedia.org',
  cewiki: 'https://ce.wikipedia.org',
  cewikipedia: 'https://ce.wikipedia.org',
  cebwiki: 'https://ceb.wikipedia.org',
  cebwikipedia: 'https://ceb.wikipedia.org',
  chwiki: 'https://ch.wikipedia.org',
  chwikipedia: 'https://ch.wikipedia.org',
  chwiktionary: 'https://ch.wiktionary.org',
  chwikibooks: 'https://ch.wikibooks.org',
  chowiki: 'https://cho.wikipedia.org',
  chowikipedia: 'https://cho.wikipedia.org',
  chrwiki: 'https://chr.wikipedia.org',
  chrwikipedia: 'https://chr.wikipedia.org',
  chrwiktionary: 'https://chr.wiktionary.org',
  chywiki: 'https://chy.wikipedia.org',
  chywikipedia: 'https://chy.wikipedia.org',
  ckbwiki: 'https://ckb.wikipedia.org',
  ckbwikipedia: 'https://ckb.wikipedia.org',
  cowiki: 'https://co.wikipedia.org',
  cowikipedia: 'https://co.wikipedia.org',
  cowiktionary: 'https://co.wiktionary.org',
  cowikibooks: 'https://co.wikibooks.org',
  cowikiquote: 'https://co.wikiquote.org',
  crwiki: 'https://cr.wikipedia.org',
  crwikipedia: 'https://cr.wikipedia.org',
  crwiktionary: 'https://cr.wiktionary.org',
  crwikiquote: 'https://cr.wikiquote.org',
  crhwiki: 'https://crh.wikipedia.org',
  crhwikipedia: 'https://crh.wikipedia.org',
  cswiki: 'https://cs.wikipedia.org',
  cswikipedia: 'https://cs.wikipedia.org',
  cswiktionary: 'https://cs.wiktionary.org',
  cswikibooks: 'https://cs.wikibooks.org',
  cswikinews: 'https://cs.wikinews.org',
  cswikiquote: 'https://cs.wikiquote.org',
  cswikisource: 'https://cs.wikisource.org',
  cswikiversity: 'https://cs.wikiversity.org',
  csbwiki: 'https://csb.wikipedia.org',
  csbwikipedia: 'https://csb.wikipedia.org',
  csbwiktionary: 'https://csb.wiktionary.org',
  cuwiki: 'https://cu.wikipedia.org',
  cuwikipedia: 'https://cu.wikipedia.org',
  cvwiki: 'https://cv.wikipedia.org',
  cvwikipedia: 'https://cv.wikipedia.org',
  cvwikibooks: 'https://cv.wikibooks.org',
  cywiki: 'https://cy.wikipedia.org',
  cywikipedia: 'https://cy.wikipedia.org',
  cywiktionary: 'https://cy.wiktionary.org',
  cywikibooks: 'https://cy.wikibooks.org',
  cywikiquote: 'https://cy.wikiquote.org',
  cywikisource: 'https://cy.wikisource.org',
  dawiki: 'https://da.wikipedia.org',
  dawikipedia: 'https://da.wikipedia.org',
  dawiktionary: 'https://da.wiktionary.org',
  dawikibooks: 'https://da.wikibooks.org',
  dawikiquote: 'https://da.wikiquote.org',
  dawikisource: 'https://da.wikisource.org',
  dewiki: 'https://de.wikipedia.org',
  dewikipedia: 'https://de.wikipedia.org',
  dewiktionary: 'https://de.wiktionary.org',
  dewikibooks: 'https://de.wikibooks.org',
  dewikinews: 'https://de.wikinews.org',
  dewikiquote: 'https://de.wikiquote.org',
  dewikisource: 'https://de.wikisource.org',
  dewikiversity: 'https://de.wikiversity.org',
  dewikivoyage: 'https://de.wikivoyage.org',
  dinwiki: 'https://din.wikipedia.org',
  dinwikipedia: 'https://din.wikipedia.org',
  diqwiki: 'https://diq.wikipedia.org',
  diqwikipedia: 'https://diq.wikipedia.org',
  dsbwiki: 'https://dsb.wikipedia.org',
  dsbwikipedia: 'https://dsb.wikipedia.org',
  dtywiki: 'https://dty.wikipedia.org',
  dtywikipedia: 'https://dty.wikipedia.org',
  dvwiki: 'https://dv.wikipedia.org',
  dvwikipedia: 'https://dv.wikipedia.org',
  dvwiktionary: 'https://dv.wiktionary.org',
  dzwiki: 'https://dz.wikipedia.org',
  dzwikipedia: 'https://dz.wikipedia.org',
  dzwiktionary: 'https://dz.wiktionary.org',
  eewiki: 'https://ee.wikipedia.org',
  eewikipedia: 'https://ee.wikipedia.org',
  elwiki: 'https://el.wikipedia.org',
  elwikipedia: 'https://el.wikipedia.org',
  elwiktionary: 'https://el.wiktionary.org',
  elwikibooks: 'https://el.wikibooks.org',
  elwikinews: 'https://el.wikinews.org',
  elwikiquote: 'https://el.wikiquote.org',
  elwikisource: 'https://el.wikisource.org',
  elwikiversity: 'https://el.wikiversity.org',
  elwikivoyage: 'https://el.wikivoyage.org',
  emlwiki: 'https://eml.wikipedia.org',
  emlwikipedia: 'https://eml.wikipedia.org',
  enwiki: 'https://en.wikipedia.org',
  enwikipedia: 'https://en.wikipedia.org',
  enwiktionary: 'https://en.wiktionary.org',
  enwikibooks: 'https://en.wikibooks.org',
  enwikinews: 'https://en.wikinews.org',
  enwikiquote: 'https://en.wikiquote.org',
  enwikisource: 'https://en.wikisource.org',
  enwikiversity: 'https://en.wikiversity.org',
  enwikivoyage: 'https://en.wikivoyage.org',
  eowiki: 'https://eo.wikipedia.org',
  eowikipedia: 'https://eo.wikipedia.org',
  eowiktionary: 'https://eo.wiktionary.org',
  eowikibooks: 'https://eo.wikibooks.org',
  eowikinews: 'https://eo.wikinews.org',
  eowikiquote: 'https://eo.wikiquote.org',
  eowikisource: 'https://eo.wikisource.org',
  eswiki: 'https://es.wikipedia.org',
  eswikipedia: 'https://es.wikipedia.org',
  eswiktionary: 'https://es.wiktionary.org',
  eswikibooks: 'https://es.wikibooks.org',
  eswikinews: 'https://es.wikinews.org',
  eswikiquote: 'https://es.wikiquote.org',
  eswikisource: 'https://es.wikisource.org',
  eswikiversity: 'https://es.wikiversity.org',
  eswikivoyage: 'https://es.wikivoyage.org',
  etwiki: 'https://et.wikipedia.org',
  etwikipedia: 'https://et.wikipedia.org',
  etwiktionary: 'https://et.wiktionary.org',
  etwikibooks: 'https://et.wikibooks.org',
  etwikiquote: 'https://et.wikiquote.org',
  etwikisource: 'https://et.wikisource.org',
  euwiki: 'https://eu.wikipedia.org',
  euwikipedia: 'https://eu.wikipedia.org',
  euwiktionary: 'https://eu.wiktionary.org',
  euwikibooks: 'https://eu.wikibooks.org',
  euwikiquote: 'https://eu.wikiquote.org',
  euwikisource: 'https://eu.wikisource.org',
  extwiki: 'https://ext.wikipedia.org',
  extwikipedia: 'https://ext.wikipedia.org',
  fawiki: 'https://fa.wikipedia.org',
  fawikipedia: 'https://fa.wikipedia.org',
  fawiktionary: 'https://fa.wiktionary.org',
  fawikibooks: 'https://fa.wikibooks.org',
  fawikinews: 'https://fa.wikinews.org',
  fawikiquote: 'https://fa.wikiquote.org',
  fawikisource: 'https://fa.wikisource.org',
  fawikivoyage: 'https://fa.wikivoyage.org',
  ffwiki: 'https://ff.wikipedia.org',
  ffwikipedia: 'https://ff.wikipedia.org',
  fiwiki: 'https://fi.wikipedia.org',
  fiwikipedia: 'https://fi.wikipedia.org',
  fiwiktionary: 'https://fi.wiktionary.org',
  fiwikibooks: 'https://fi.wikibooks.org',
  fiwikinews: 'https://fi.wikinews.org',
  fiwikiquote: 'https://fi.wikiquote.org',
  fiwikisource: 'https://fi.wikisource.org',
  fiwikiversity: 'https://fi.wikiversity.org',
  fiwikivoyage: 'https://fi.wikivoyage.org',
  fiu_vrowiki: 'https://fiu-vro.wikipedia.org',
  fiu_vrowikipedia: 'https://fiu-vro.wikipedia.org',
  fjwiki: 'https://fj.wikipedia.org',
  fjwikipedia: 'https://fj.wikipedia.org',
  fjwiktionary: 'https://fj.wiktionary.org',
  fowiki: 'https://fo.wikipedia.org',
  fowikipedia: 'https://fo.wikipedia.org',
  fowiktionary: 'https://fo.wiktionary.org',
  fowikisource: 'https://fo.wikisource.org',
  frwiki: 'https://fr.wikipedia.org',
  frwikipedia: 'https://fr.wikipedia.org',
  frwiktionary: 'https://fr.wiktionary.org',
  frwikibooks: 'https://fr.wikibooks.org',
  frwikinews: 'https://fr.wikinews.org',
  frwikiquote: 'https://fr.wikiquote.org',
  frwikisource: 'https://fr.wikisource.org',
  frwikiversity: 'https://fr.wikiversity.org',
  frwikivoyage: 'https://fr.wikivoyage.org',
  frpwiki: 'https://frp.wikipedia.org',
  frpwikipedia: 'https://frp.wikipedia.org',
  frrwiki: 'https://frr.wikipedia.org',
  frrwikipedia: 'https://frr.wikipedia.org',
  furwiki: 'https://fur.wikipedia.org',
  furwikipedia: 'https://fur.wikipedia.org',
  fywiki: 'https://fy.wikipedia.org',
  fywikipedia: 'https://fy.wikipedia.org',
  fywiktionary: 'https://fy.wiktionary.org',
  fywikibooks: 'https://fy.wikibooks.org',
  gawiki: 'https://ga.wikipedia.org',
  gawikipedia: 'https://ga.wikipedia.org',
  gawiktionary: 'https://ga.wiktionary.org',
  gawikibooks: 'https://ga.wikibooks.org',
  gawikiquote: 'https://ga.wikiquote.org',
  gagwiki: 'https://gag.wikipedia.org',
  gagwikipedia: 'https://gag.wikipedia.org',
  ganwiki: 'https://gan.wikipedia.org',
  ganwikipedia: 'https://gan.wikipedia.org',
  gdwiki: 'https://gd.wikipedia.org',
  gdwikipedia: 'https://gd.wikipedia.org',
  gdwiktionary: 'https://gd.wiktionary.org',
  glwiki: 'https://gl.wikipedia.org',
  glwikipedia: 'https://gl.wikipedia.org',
  glwiktionary: 'https://gl.wiktionary.org',
  glwikibooks: 'https://gl.wikibooks.org',
  glwikiquote: 'https://gl.wikiquote.org',
  glwikisource: 'https://gl.wikisource.org',
  glkwiki: 'https://glk.wikipedia.org',
  glkwikipedia: 'https://glk.wikipedia.org',
  gnwiki: 'https://gn.wikipedia.org',
  gnwikipedia: 'https://gn.wikipedia.org',
  gnwiktionary: 'https://gn.wiktionary.org',
  gnwikibooks: 'https://gn.wikibooks.org',
  gomwiki: 'https://gom.wikipedia.org',
  gomwikipedia: 'https://gom.wikipedia.org',
  gorwiki: 'https://gor.wikipedia.org',
  gorwikipedia: 'https://gor.wikipedia.org',
  gotwiki: 'https://got.wikipedia.org',
  gotwikipedia: 'https://got.wikipedia.org',
  gotwikibooks: 'https://got.wikibooks.org',
  guwiki: 'https://gu.wikipedia.org',
  guwikipedia: 'https://gu.wikipedia.org',
  guwiktionary: 'https://gu.wiktionary.org',
  guwikibooks: 'https://gu.wikibooks.org',
  guwikiquote: 'https://gu.wikiquote.org',
  guwikisource: 'https://gu.wikisource.org',
  gvwiki: 'https://gv.wikipedia.org',
  gvwikipedia: 'https://gv.wikipedia.org',
  gvwiktionary: 'https://gv.wiktionary.org',
  hawiki: 'https://ha.wikipedia.org',
  hawikipedia: 'https://ha.wikipedia.org',
  hawiktionary: 'https://ha.wiktionary.org',
  hakwiki: 'https://hak.wikipedia.org',
  hakwikipedia: 'https://hak.wikipedia.org',
  hawwiki: 'https://haw.wikipedia.org',
  hawwikipedia: 'https://haw.wikipedia.org',
  hewiki: 'https://he.wikipedia.org',
  hewikipedia: 'https://he.wikipedia.org',
  hewiktionary: 'https://he.wiktionary.org',
  hewikibooks: 'https://he.wikibooks.org',
  hewikinews: 'https://he.wikinews.org',
  hewikiquote: 'https://he.wikiquote.org',
  hewikisource: 'https://he.wikisource.org',
  hewikivoyage: 'https://he.wikivoyage.org',
  hiwiki: 'https://hi.wikipedia.org',
  hiwikipedia: 'https://hi.wikipedia.org',
  hiwiktionary: 'https://hi.wiktionary.org',
  hiwikibooks: 'https://hi.wikibooks.org',
  hiwikiquote: 'https://hi.wikiquote.org',
  hiwikiversity: 'https://hi.wikiversity.org',
  hiwikivoyage: 'https://hi.wikivoyage.org',
  hifwiki: 'https://hif.wikipedia.org',
  hifwikipedia: 'https://hif.wikipedia.org',
  hifwiktionary: 'https://hif.wiktionary.org',
  howiki: 'https://ho.wikipedia.org',
  howikipedia: 'https://ho.wikipedia.org',
  hrwiki: 'https://hr.wikipedia.org',
  hrwikipedia: 'https://hr.wikipedia.org',
  hrwiktionary: 'https://hr.wiktionary.org',
  hrwikibooks: 'https://hr.wikibooks.org',
  hrwikiquote: 'https://hr.wikiquote.org',
  hrwikisource: 'https://hr.wikisource.org',
  hsbwiki: 'https://hsb.wikipedia.org',
  hsbwikipedia: 'https://hsb.wikipedia.org',
  hsbwiktionary: 'https://hsb.wiktionary.org',
  htwiki: 'https://ht.wikipedia.org',
  htwikipedia: 'https://ht.wikipedia.org',
  htwikisource: 'https://ht.wikisource.org',
  huwiki: 'https://hu.wikipedia.org',
  huwikipedia: 'https://hu.wikipedia.org',
  huwiktionary: 'https://hu.wiktionary.org',
  huwikibooks: 'https://hu.wikibooks.org',
  huwikinews: 'https://hu.wikinews.org',
  huwikiquote: 'https://hu.wikiquote.org',
  huwikisource: 'https://hu.wikisource.org',
  hywiki: 'https://hy.wikipedia.org',
  hywikipedia: 'https://hy.wikipedia.org',
  hywiktionary: 'https://hy.wiktionary.org',
  hywikibooks: 'https://hy.wikibooks.org',
  hywikiquote: 'https://hy.wikiquote.org',
  hywikisource: 'https://hy.wikisource.org',
  hzwiki: 'https://hz.wikipedia.org',
  hzwikipedia: 'https://hz.wikipedia.org',
  iawiki: 'https://ia.wikipedia.org',
  iawikipedia: 'https://ia.wikipedia.org',
  iawiktionary: 'https://ia.wiktionary.org',
  iawikibooks: 'https://ia.wikibooks.org',
  idwiki: 'https://id.wikipedia.org',
  idwikipedia: 'https://id.wikipedia.org',
  idwiktionary: 'https://id.wiktionary.org',
  idwikibooks: 'https://id.wikibooks.org',
  idwikiquote: 'https://id.wikiquote.org',
  idwikisource: 'https://id.wikisource.org',
  iewiki: 'https://ie.wikipedia.org',
  iewikipedia: 'https://ie.wikipedia.org',
  iewiktionary: 'https://ie.wiktionary.org',
  iewikibooks: 'https://ie.wikibooks.org',
  igwiki: 'https://ig.wikipedia.org',
  igwikipedia: 'https://ig.wikipedia.org',
  iiwiki: 'https://ii.wikipedia.org',
  iiwikipedia: 'https://ii.wikipedia.org',
  ikwiki: 'https://ik.wikipedia.org',
  ikwikipedia: 'https://ik.wikipedia.org',
  ikwiktionary: 'https://ik.wiktionary.org',
  ilowiki: 'https://ilo.wikipedia.org',
  ilowikipedia: 'https://ilo.wikipedia.org',
  inhwiki: 'https://inh.wikipedia.org',
  inhwikipedia: 'https://inh.wikipedia.org',
  iowiki: 'https://io.wikipedia.org',
  iowikipedia: 'https://io.wikipedia.org',
  iowiktionary: 'https://io.wiktionary.org',
  iswiki: 'https://is.wikipedia.org',
  iswikipedia: 'https://is.wikipedia.org',
  iswiktionary: 'https://is.wiktionary.org',
  iswikibooks: 'https://is.wikibooks.org',
  iswikiquote: 'https://is.wikiquote.org',
  iswikisource: 'https://is.wikisource.org',
  itwiki: 'https://it.wikipedia.org',
  itwikipedia: 'https://it.wikipedia.org',
  itwiktionary: 'https://it.wiktionary.org',
  itwikibooks: 'https://it.wikibooks.org',
  itwikinews: 'https://it.wikinews.org',
  itwikiquote: 'https://it.wikiquote.org',
  itwikisource: 'https://it.wikisource.org',
  itwikiversity: 'https://it.wikiversity.org',
  itwikivoyage: 'https://it.wikivoyage.org',
  iuwiki: 'https://iu.wikipedia.org',
  iuwikipedia: 'https://iu.wikipedia.org',
  iuwiktionary: 'https://iu.wiktionary.org',
  jawiki: 'https://ja.wikipedia.org',
  jawikipedia: 'https://ja.wikipedia.org',
  jawiktionary: 'https://ja.wiktionary.org',
  jawikibooks: 'https://ja.wikibooks.org',
  jawikinews: 'https://ja.wikinews.org',
  jawikiquote: 'https://ja.wikiquote.org',
  jawikisource: 'https://ja.wikisource.org',
  jawikiversity: 'https://ja.wikiversity.org',
  jamwiki: 'https://jam.wikipedia.org',
  jamwikipedia: 'https://jam.wikipedia.org',
  jbowiki: 'https://jbo.wikipedia.org',
  jbowikipedia: 'https://jbo.wikipedia.org',
  jbowiktionary: 'https://jbo.wiktionary.org',
  jvwiki: 'https://jv.wikipedia.org',
  jvwikipedia: 'https://jv.wikipedia.org',
  jvwiktionary: 'https://jv.wiktionary.org',
  kawiki: 'https://ka.wikipedia.org',
  kawikipedia: 'https://ka.wikipedia.org',
  kawiktionary: 'https://ka.wiktionary.org',
  kawikibooks: 'https://ka.wikibooks.org',
  kawikiquote: 'https://ka.wikiquote.org',
  kaawiki: 'https://kaa.wikipedia.org',
  kaawikipedia: 'https://kaa.wikipedia.org',
  kabwiki: 'https://kab.wikipedia.org',
  kabwikipedia: 'https://kab.wikipedia.org',
  kbdwiki: 'https://kbd.wikipedia.org',
  kbdwikipedia: 'https://kbd.wikipedia.org',
  kbpwiki: 'https://kbp.wikipedia.org',
  kbpwikipedia: 'https://kbp.wikipedia.org',
  kgwiki: 'https://kg.wikipedia.org',
  kgwikipedia: 'https://kg.wikipedia.org',
  kiwiki: 'https://ki.wikipedia.org',
  kiwikipedia: 'https://ki.wikipedia.org',
  kjwiki: 'https://kj.wikipedia.org',
  kjwikipedia: 'https://kj.wikipedia.org',
  kkwiki: 'https://kk.wikipedia.org',
  kkwikipedia: 'https://kk.wikipedia.org',
  kkwiktionary: 'https://kk.wiktionary.org',
  kkwikibooks: 'https://kk.wikibooks.org',
  kkwikiquote: 'https://kk.wikiquote.org',
  klwiki: 'https://kl.wikipedia.org',
  klwikipedia: 'https://kl.wikipedia.org',
  klwiktionary: 'https://kl.wiktionary.org',
  kmwiki: 'https://km.wikipedia.org',
  kmwikipedia: 'https://km.wikipedia.org',
  kmwiktionary: 'https://km.wiktionary.org',
  kmwikibooks: 'https://km.wikibooks.org',
  knwiki: 'https://kn.wikipedia.org',
  knwikipedia: 'https://kn.wikipedia.org',
  knwiktionary: 'https://kn.wiktionary.org',
  knwikibooks: 'https://kn.wikibooks.org',
  knwikiquote: 'https://kn.wikiquote.org',
  knwikisource: 'https://kn.wikisource.org',
  kowiki: 'https://ko.wikipedia.org',
  kowikipedia: 'https://ko.wikipedia.org',
  kowiktionary: 'https://ko.wiktionary.org',
  kowikibooks: 'https://ko.wikibooks.org',
  kowikinews: 'https://ko.wikinews.org',
  kowikiquote: 'https://ko.wikiquote.org',
  kowikisource: 'https://ko.wikisource.org',
  kowikiversity: 'https://ko.wikiversity.org',
  koiwiki: 'https://koi.wikipedia.org',
  koiwikipedia: 'https://koi.wikipedia.org',
  krwiki: 'https://kr.wikipedia.org',
  krwikipedia: 'https://kr.wikipedia.org',
  krwikiquote: 'https://kr.wikiquote.org',
  krcwiki: 'https://krc.wikipedia.org',
  krcwikipedia: 'https://krc.wikipedia.org',
  kswiki: 'https://ks.wikipedia.org',
  kswikipedia: 'https://ks.wikipedia.org',
  kswiktionary: 'https://ks.wiktionary.org',
  kswikibooks: 'https://ks.wikibooks.org',
  kswikiquote: 'https://ks.wikiquote.org',
  kshwiki: 'https://ksh.wikipedia.org',
  kshwikipedia: 'https://ksh.wikipedia.org',
  kuwiki: 'https://ku.wikipedia.org',
  kuwikipedia: 'https://ku.wikipedia.org',
  kuwiktionary: 'https://ku.wiktionary.org',
  kuwikibooks: 'https://ku.wikibooks.org',
  kuwikiquote: 'https://ku.wikiquote.org',
  kvwiki: 'https://kv.wikipedia.org',
  kvwikipedia: 'https://kv.wikipedia.org',
  kwwiki: 'https://kw.wikipedia.org',
  kwwikipedia: 'https://kw.wikipedia.org',
  kwwiktionary: 'https://kw.wiktionary.org',
  kwwikiquote: 'https://kw.wikiquote.org',
  kywiki: 'https://ky.wikipedia.org',
  kywikipedia: 'https://ky.wikipedia.org',
  kywiktionary: 'https://ky.wiktionary.org',
  kywikibooks: 'https://ky.wikibooks.org',
  kywikiquote: 'https://ky.wikiquote.org',
  lawiki: 'https://la.wikipedia.org',
  lawikipedia: 'https://la.wikipedia.org',
  lawiktionary: 'https://la.wiktionary.org',
  lawikibooks: 'https://la.wikibooks.org',
  lawikiquote: 'https://la.wikiquote.org',
  lawikisource: 'https://la.wikisource.org',
  ladwiki: 'https://lad.wikipedia.org',
  ladwikipedia: 'https://lad.wikipedia.org',
  lbwiki: 'https://lb.wikipedia.org',
  lbwikipedia: 'https://lb.wikipedia.org',
  lbwiktionary: 'https://lb.wiktionary.org',
  lbwikibooks: 'https://lb.wikibooks.org',
  lbwikiquote: 'https://lb.wikiquote.org',
  lbewiki: 'https://lbe.wikipedia.org',
  lbewikipedia: 'https://lbe.wikipedia.org',
  lezwiki: 'https://lez.wikipedia.org',
  lezwikipedia: 'https://lez.wikipedia.org',
  lfnwiki: 'https://lfn.wikipedia.org',
  lfnwikipedia: 'https://lfn.wikipedia.org',
  lgwiki: 'https://lg.wikipedia.org',
  lgwikipedia: 'https://lg.wikipedia.org',
  liwiki: 'https://li.wikipedia.org',
  liwikipedia: 'https://li.wikipedia.org',
  liwiktionary: 'https://li.wiktionary.org',
  liwikibooks: 'https://li.wikibooks.org',
  liwikiquote: 'https://li.wikiquote.org',
  liwikisource: 'https://li.wikisource.org',
  lijwiki: 'https://lij.wikipedia.org',
  lijwikipedia: 'https://lij.wikipedia.org',
  lmowiki: 'https://lmo.wikipedia.org',
  lmowikipedia: 'https://lmo.wikipedia.org',
  lnwiki: 'https://ln.wikipedia.org',
  lnwikipedia: 'https://ln.wikipedia.org',
  lnwiktionary: 'https://ln.wiktionary.org',
  lnwikibooks: 'https://ln.wikibooks.org',
  lowiki: 'https://lo.wikipedia.org',
  lowikipedia: 'https://lo.wikipedia.org',
  lowiktionary: 'https://lo.wiktionary.org',
  lrcwiki: 'https://lrc.wikipedia.org',
  lrcwikipedia: 'https://lrc.wikipedia.org',
  ltwiki: 'https://lt.wikipedia.org',
  ltwikipedia: 'https://lt.wikipedia.org',
  ltwiktionary: 'https://lt.wiktionary.org',
  ltwikibooks: 'https://lt.wikibooks.org',
  ltwikiquote: 'https://lt.wikiquote.org',
  ltwikisource: 'https://lt.wikisource.org',
  ltgwiki: 'https://ltg.wikipedia.org',
  ltgwikipedia: 'https://ltg.wikipedia.org',
  lvwiki: 'https://lv.wikipedia.org',
  lvwikipedia: 'https://lv.wikipedia.org',
  lvwiktionary: 'https://lv.wiktionary.org',
  lvwikibooks: 'https://lv.wikibooks.org',
  maiwiki: 'https://mai.wikipedia.org',
  maiwikipedia: 'https://mai.wikipedia.org',
  map_bmswiki: 'https://map-bms.wikipedia.org',
  map_bmswikipedia: 'https://map-bms.wikipedia.org',
  mdfwiki: 'https://mdf.wikipedia.org',
  mdfwikipedia: 'https://mdf.wikipedia.org',
  mgwiki: 'https://mg.wikipedia.org',
  mgwikipedia: 'https://mg.wikipedia.org',
  mgwiktionary: 'https://mg.wiktionary.org',
  mgwikibooks: 'https://mg.wikibooks.org',
  mhwiki: 'https://mh.wikipedia.org',
  mhwikipedia: 'https://mh.wikipedia.org',
  mhwiktionary: 'https://mh.wiktionary.org',
  mhrwiki: 'https://mhr.wikipedia.org',
  mhrwikipedia: 'https://mhr.wikipedia.org',
  miwiki: 'https://mi.wikipedia.org',
  miwikipedia: 'https://mi.wikipedia.org',
  miwiktionary: 'https://mi.wiktionary.org',
  miwikibooks: 'https://mi.wikibooks.org',
  minwiki: 'https://min.wikipedia.org',
  minwikipedia: 'https://min.wikipedia.org',
  mkwiki: 'https://mk.wikipedia.org',
  mkwikipedia: 'https://mk.wikipedia.org',
  mkwiktionary: 'https://mk.wiktionary.org',
  mkwikibooks: 'https://mk.wikibooks.org',
  mkwikisource: 'https://mk.wikisource.org',
  mlwiki: 'https://ml.wikipedia.org',
  mlwikipedia: 'https://ml.wikipedia.org',
  mlwiktionary: 'https://ml.wiktionary.org',
  mlwikibooks: 'https://ml.wikibooks.org',
  mlwikiquote: 'https://ml.wikiquote.org',
  mlwikisource: 'https://ml.wikisource.org',
  mnwiki: 'https://mn.wikipedia.org',
  mnwikipedia: 'https://mn.wikipedia.org',
  mnwiktionary: 'https://mn.wiktionary.org',
  mnwikibooks: 'https://mn.wikibooks.org',
  mrwiki: 'https://mr.wikipedia.org',
  mrwikipedia: 'https://mr.wikipedia.org',
  mrwiktionary: 'https://mr.wiktionary.org',
  mrwikibooks: 'https://mr.wikibooks.org',
  mrwikiquote: 'https://mr.wikiquote.org',
  mrwikisource: 'https://mr.wikisource.org',
  mrjwiki: 'https://mrj.wikipedia.org',
  mrjwikipedia: 'https://mrj.wikipedia.org',
  mswiki: 'https://ms.wikipedia.org',
  mswikipedia: 'https://ms.wikipedia.org',
  mswiktionary: 'https://ms.wiktionary.org',
  mswikibooks: 'https://ms.wikibooks.org',
  mtwiki: 'https://mt.wikipedia.org',
  mtwikipedia: 'https://mt.wikipedia.org',
  mtwiktionary: 'https://mt.wiktionary.org',
  muswiki: 'https://mus.wikipedia.org',
  muswikipedia: 'https://mus.wikipedia.org',
  mwlwiki: 'https://mwl.wikipedia.org',
  mwlwikipedia: 'https://mwl.wikipedia.org',
  mywiki: 'https://my.wikipedia.org',
  mywikipedia: 'https://my.wikipedia.org',
  mywiktionary: 'https://my.wiktionary.org',
  mywikibooks: 'https://my.wikibooks.org',
  myvwiki: 'https://myv.wikipedia.org',
  myvwikipedia: 'https://myv.wikipedia.org',
  mznwiki: 'https://mzn.wikipedia.org',
  mznwikipedia: 'https://mzn.wikipedia.org',
  nawiki: 'https://na.wikipedia.org',
  nawikipedia: 'https://na.wikipedia.org',
  nawiktionary: 'https://na.wiktionary.org',
  nawikibooks: 'https://na.wikibooks.org',
  nawikiquote: 'https://na.wikiquote.org',
  nahwiki: 'https://nah.wikipedia.org',
  nahwikipedia: 'https://nah.wikipedia.org',
  nahwiktionary: 'https://nah.wiktionary.org',
  nahwikibooks: 'https://nah.wikibooks.org',
  napwiki: 'https://nap.wikipedia.org',
  napwikipedia: 'https://nap.wikipedia.org',
  ndswiki: 'https://nds.wikipedia.org',
  ndswikipedia: 'https://nds.wikipedia.org',
  ndswiktionary: 'https://nds.wiktionary.org',
  ndswikibooks: 'https://nds.wikibooks.org',
  ndswikiquote: 'https://nds.wikiquote.org',
  nds_nlwiki: 'https://nds-nl.wikipedia.org',
  nds_nlwikipedia: 'https://nds-nl.wikipedia.org',
  newiki: 'https://ne.wikipedia.org',
  newikipedia: 'https://ne.wikipedia.org',
  newiktionary: 'https://ne.wiktionary.org',
  newikibooks: 'https://ne.wikibooks.org',
  newwiki: 'https://new.wikipedia.org',
  newwikipedia: 'https://new.wikipedia.org',
  ngwiki: 'https://ng.wikipedia.org',
  ngwikipedia: 'https://ng.wikipedia.org',
  nlwiki: 'https://nl.wikipedia.org',
  nlwikipedia: 'https://nl.wikipedia.org',
  nlwiktionary: 'https://nl.wiktionary.org',
  nlwikibooks: 'https://nl.wikibooks.org',
  nlwikinews: 'https://nl.wikinews.org',
  nlwikiquote: 'https://nl.wikiquote.org',
  nlwikisource: 'https://nl.wikisource.org',
  nlwikivoyage: 'https://nl.wikivoyage.org',
  nnwiki: 'https://nn.wikipedia.org',
  nnwikipedia: 'https://nn.wikipedia.org',
  nnwiktionary: 'https://nn.wiktionary.org',
  nnwikiquote: 'https://nn.wikiquote.org',
  nowiki: 'https://no.wikipedia.org',
  nowikipedia: 'https://no.wikipedia.org',
  nowiktionary: 'https://no.wiktionary.org',
  nowikibooks: 'https://no.wikibooks.org',
  nowikinews: 'https://no.wikinews.org',
  nowikiquote: 'https://no.wikiquote.org',
  nowikisource: 'https://no.wikisource.org',
  novwiki: 'https://nov.wikipedia.org',
  novwikipedia: 'https://nov.wikipedia.org',
  nrmwiki: 'https://nrm.wikipedia.org',
  nrmwikipedia: 'https://nrm.wikipedia.org',
  nsowiki: 'https://nso.wikipedia.org',
  nsowikipedia: 'https://nso.wikipedia.org',
  nvwiki: 'https://nv.wikipedia.org',
  nvwikipedia: 'https://nv.wikipedia.org',
  nywiki: 'https://ny.wikipedia.org',
  nywikipedia: 'https://ny.wikipedia.org',
  ocwiki: 'https://oc.wikipedia.org',
  ocwikipedia: 'https://oc.wikipedia.org',
  ocwiktionary: 'https://oc.wiktionary.org',
  ocwikibooks: 'https://oc.wikibooks.org',
  olowiki: 'https://olo.wikipedia.org',
  olowikipedia: 'https://olo.wikipedia.org',
  omwiki: 'https://om.wikipedia.org',
  omwikipedia: 'https://om.wikipedia.org',
  omwiktionary: 'https://om.wiktionary.org',
  orwiki: 'https://or.wikipedia.org',
  orwikipedia: 'https://or.wikipedia.org',
  orwiktionary: 'https://or.wiktionary.org',
  orwikisource: 'https://or.wikisource.org',
  oswiki: 'https://os.wikipedia.org',
  oswikipedia: 'https://os.wikipedia.org',
  pawiki: 'https://pa.wikipedia.org',
  pawikipedia: 'https://pa.wikipedia.org',
  pawiktionary: 'https://pa.wiktionary.org',
  pawikibooks: 'https://pa.wikibooks.org',
  pawikisource: 'https://pa.wikisource.org',
  pagwiki: 'https://pag.wikipedia.org',
  pagwikipedia: 'https://pag.wikipedia.org',
  pamwiki: 'https://pam.wikipedia.org',
  pamwikipedia: 'https://pam.wikipedia.org',
  papwiki: 'https://pap.wikipedia.org',
  papwikipedia: 'https://pap.wikipedia.org',
  pcdwiki: 'https://pcd.wikipedia.org',
  pcdwikipedia: 'https://pcd.wikipedia.org',
  pdcwiki: 'https://pdc.wikipedia.org',
  pdcwikipedia: 'https://pdc.wikipedia.org',
  pflwiki: 'https://pfl.wikipedia.org',
  pflwikipedia: 'https://pfl.wikipedia.org',
  piwiki: 'https://pi.wikipedia.org',
  piwikipedia: 'https://pi.wikipedia.org',
  piwiktionary: 'https://pi.wiktionary.org',
  pihwiki: 'https://pih.wikipedia.org',
  pihwikipedia: 'https://pih.wikipedia.org',
  plwiki: 'https://pl.wikipedia.org',
  plwikipedia: 'https://pl.wikipedia.org',
  plwiktionary: 'https://pl.wiktionary.org',
  plwikibooks: 'https://pl.wikibooks.org',
  plwikinews: 'https://pl.wikinews.org',
  plwikiquote: 'https://pl.wikiquote.org',
  plwikisource: 'https://pl.wikisource.org',
  plwikivoyage: 'https://pl.wikivoyage.org',
  pmswiki: 'https://pms.wikipedia.org',
  pmswikipedia: 'https://pms.wikipedia.org',
  pmswikisource: 'https://pms.wikisource.org',
  pnbwiki: 'https://pnb.wikipedia.org',
  pnbwikipedia: 'https://pnb.wikipedia.org',
  pnbwiktionary: 'https://pnb.wiktionary.org',
  pntwiki: 'https://pnt.wikipedia.org',
  pntwikipedia: 'https://pnt.wikipedia.org',
  pswiki: 'https://ps.wikipedia.org',
  pswikipedia: 'https://ps.wikipedia.org',
  pswiktionary: 'https://ps.wiktionary.org',
  pswikibooks: 'https://ps.wikibooks.org',
  pswikivoyage: 'https://ps.wikivoyage.org',
  ptwiki: 'https://pt.wikipedia.org',
  ptwikipedia: 'https://pt.wikipedia.org',
  ptwiktionary: 'https://pt.wiktionary.org',
  ptwikibooks: 'https://pt.wikibooks.org',
  ptwikinews: 'https://pt.wikinews.org',
  ptwikiquote: 'https://pt.wikiquote.org',
  ptwikisource: 'https://pt.wikisource.org',
  ptwikiversity: 'https://pt.wikiversity.org',
  ptwikivoyage: 'https://pt.wikivoyage.org',
  quwiki: 'https://qu.wikipedia.org',
  quwikipedia: 'https://qu.wikipedia.org',
  quwiktionary: 'https://qu.wiktionary.org',
  quwikibooks: 'https://qu.wikibooks.org',
  quwikiquote: 'https://qu.wikiquote.org',
  rmwiki: 'https://rm.wikipedia.org',
  rmwikipedia: 'https://rm.wikipedia.org',
  rmwiktionary: 'https://rm.wiktionary.org',
  rmwikibooks: 'https://rm.wikibooks.org',
  rmywiki: 'https://rmy.wikipedia.org',
  rmywikipedia: 'https://rmy.wikipedia.org',
  rnwiki: 'https://rn.wikipedia.org',
  rnwikipedia: 'https://rn.wikipedia.org',
  rnwiktionary: 'https://rn.wiktionary.org',
  rowiki: 'https://ro.wikipedia.org',
  rowikipedia: 'https://ro.wikipedia.org',
  rowiktionary: 'https://ro.wiktionary.org',
  rowikibooks: 'https://ro.wikibooks.org',
  rowikinews: 'https://ro.wikinews.org',
  rowikiquote: 'https://ro.wikiquote.org',
  rowikisource: 'https://ro.wikisource.org',
  rowikivoyage: 'https://ro.wikivoyage.org',
  roa_rupwiki: 'https://roa-rup.wikipedia.org',
  roa_rupwikipedia: 'https://roa-rup.wikipedia.org',
  roa_rupwiktionary: 'https://roa-rup.wiktionary.org',
  roa_tarawiki: 'https://roa-tara.wikipedia.org',
  roa_tarawikipedia: 'https://roa-tara.wikipedia.org',
  ruwiki: 'https://ru.wikipedia.org',
  ruwikipedia: 'https://ru.wikipedia.org',
  ruwiktionary: 'https://ru.wiktionary.org',
  ruwikibooks: 'https://ru.wikibooks.org',
  ruwikinews: 'https://ru.wikinews.org',
  ruwikiquote: 'https://ru.wikiquote.org',
  ruwikisource: 'https://ru.wikisource.org',
  ruwikiversity: 'https://ru.wikiversity.org',
  ruwikivoyage: 'https://ru.wikivoyage.org',
  ruewiki: 'https://rue.wikipedia.org',
  ruewikipedia: 'https://rue.wikipedia.org',
  rwwiki: 'https://rw.wikipedia.org',
  rwwikipedia: 'https://rw.wikipedia.org',
  rwwiktionary: 'https://rw.wiktionary.org',
  sawiki: 'https://sa.wikipedia.org',
  sawikipedia: 'https://sa.wikipedia.org',
  sawiktionary: 'https://sa.wiktionary.org',
  sawikibooks: 'https://sa.wikibooks.org',
  sawikiquote: 'https://sa.wikiquote.org',
  sawikisource: 'https://sa.wikisource.org',
  sahwiki: 'https://sah.wikipedia.org',
  sahwikipedia: 'https://sah.wikipedia.org',
  sahwikiquote: 'https://sah.wikiquote.org',
  sahwikisource: 'https://sah.wikisource.org',
  satwiki: 'https://sat.wikipedia.org',
  satwikipedia: 'https://sat.wikipedia.org',
  scwiki: 'https://sc.wikipedia.org',
  scwikipedia: 'https://sc.wikipedia.org',
  scwiktionary: 'https://sc.wiktionary.org',
  scnwiki: 'https://scn.wikipedia.org',
  scnwikipedia: 'https://scn.wikipedia.org',
  scnwiktionary: 'https://scn.wiktionary.org',
  scowiki: 'https://sco.wikipedia.org',
  scowikipedia: 'https://sco.wikipedia.org',
  sdwiki: 'https://sd.wikipedia.org',
  sdwikipedia: 'https://sd.wikipedia.org',
  sdwiktionary: 'https://sd.wiktionary.org',
  sdwikinews: 'https://sd.wikinews.org',
  sewiki: 'https://se.wikipedia.org',
  sewikipedia: 'https://se.wikipedia.org',
  sewikibooks: 'https://se.wikibooks.org',
  sgwiki: 'https://sg.wikipedia.org',
  sgwikipedia: 'https://sg.wikipedia.org',
  sgwiktionary: 'https://sg.wiktionary.org',
  shwiki: 'https://sh.wikipedia.org',
  shwikipedia: 'https://sh.wikipedia.org',
  shwiktionary: 'https://sh.wiktionary.org',
  siwiki: 'https://si.wikipedia.org',
  siwikipedia: 'https://si.wikipedia.org',
  siwiktionary: 'https://si.wiktionary.org',
  siwikibooks: 'https://si.wikibooks.org',
  simplewiki: 'https://simple.wikipedia.org',
  simplewikipedia: 'https://simple.wikipedia.org',
  simplewiktionary: 'https://simple.wiktionary.org',
  simplewikibooks: 'https://simple.wikibooks.org',
  simplewikiquote: 'https://simple.wikiquote.org',
  skwiki: 'https://sk.wikipedia.org',
  skwikipedia: 'https://sk.wikipedia.org',
  skwiktionary: 'https://sk.wiktionary.org',
  skwikibooks: 'https://sk.wikibooks.org',
  skwikiquote: 'https://sk.wikiquote.org',
  skwikisource: 'https://sk.wikisource.org',
  slwiki: 'https://sl.wikipedia.org',
  slwikipedia: 'https://sl.wikipedia.org',
  slwiktionary: 'https://sl.wiktionary.org',
  slwikibooks: 'https://sl.wikibooks.org',
  slwikiquote: 'https://sl.wikiquote.org',
  slwikisource: 'https://sl.wikisource.org',
  slwikiversity: 'https://sl.wikiversity.org',
  smwiki: 'https://sm.wikipedia.org',
  smwikipedia: 'https://sm.wikipedia.org',
  smwiktionary: 'https://sm.wiktionary.org',
  snwiki: 'https://sn.wikipedia.org',
  snwikipedia: 'https://sn.wikipedia.org',
  snwiktionary: 'https://sn.wiktionary.org',
  sowiki: 'https://so.wikipedia.org',
  sowikipedia: 'https://so.wikipedia.org',
  sowiktionary: 'https://so.wiktionary.org',
  sqwiki: 'https://sq.wikipedia.org',
  sqwikipedia: 'https://sq.wikipedia.org',
  sqwiktionary: 'https://sq.wiktionary.org',
  sqwikibooks: 'https://sq.wikibooks.org',
  sqwikinews: 'https://sq.wikinews.org',
  sqwikiquote: 'https://sq.wikiquote.org',
  srwiki: 'https://sr.wikipedia.org',
  srwikipedia: 'https://sr.wikipedia.org',
  srwiktionary: 'https://sr.wiktionary.org',
  srwikibooks: 'https://sr.wikibooks.org',
  srwikinews: 'https://sr.wikinews.org',
  srwikiquote: 'https://sr.wikiquote.org',
  srwikisource: 'https://sr.wikisource.org',
  srnwiki: 'https://srn.wikipedia.org',
  srnwikipedia: 'https://srn.wikipedia.org',
  sswiki: 'https://ss.wikipedia.org',
  sswikipedia: 'https://ss.wikipedia.org',
  sswiktionary: 'https://ss.wiktionary.org',
  stwiki: 'https://st.wikipedia.org',
  stwikipedia: 'https://st.wikipedia.org',
  stwiktionary: 'https://st.wiktionary.org',
  stqwiki: 'https://stq.wikipedia.org',
  stqwikipedia: 'https://stq.wikipedia.org',
  suwiki: 'https://su.wikipedia.org',
  suwikipedia: 'https://su.wikipedia.org',
  suwiktionary: 'https://su.wiktionary.org',
  suwikibooks: 'https://su.wikibooks.org',
  suwikiquote: 'https://su.wikiquote.org',
  svwiki: 'https://sv.wikipedia.org',
  svwikipedia: 'https://sv.wikipedia.org',
  svwiktionary: 'https://sv.wiktionary.org',
  svwikibooks: 'https://sv.wikibooks.org',
  svwikinews: 'https://sv.wikinews.org',
  svwikiquote: 'https://sv.wikiquote.org',
  svwikisource: 'https://sv.wikisource.org',
  svwikiversity: 'https://sv.wikiversity.org',
  svwikivoyage: 'https://sv.wikivoyage.org',
  swwiki: 'https://sw.wikipedia.org',
  swwikipedia: 'https://sw.wikipedia.org',
  swwiktionary: 'https://sw.wiktionary.org',
  swwikibooks: 'https://sw.wikibooks.org',
  szlwiki: 'https://szl.wikipedia.org',
  szlwikipedia: 'https://szl.wikipedia.org',
  tawiki: 'https://ta.wikipedia.org',
  tawikipedia: 'https://ta.wikipedia.org',
  tawiktionary: 'https://ta.wiktionary.org',
  tawikibooks: 'https://ta.wikibooks.org',
  tawikinews: 'https://ta.wikinews.org',
  tawikiquote: 'https://ta.wikiquote.org',
  tawikisource: 'https://ta.wikisource.org',
  tcywiki: 'https://tcy.wikipedia.org',
  tcywikipedia: 'https://tcy.wikipedia.org',
  tewiki: 'https://te.wikipedia.org',
  tewikipedia: 'https://te.wikipedia.org',
  tewiktionary: 'https://te.wiktionary.org',
  tewikibooks: 'https://te.wikibooks.org',
  tewikiquote: 'https://te.wikiquote.org',
  tewikisource: 'https://te.wikisource.org',
  tetwiki: 'https://tet.wikipedia.org',
  tetwikipedia: 'https://tet.wikipedia.org',
  tgwiki: 'https://tg.wikipedia.org',
  tgwikipedia: 'https://tg.wikipedia.org',
  tgwiktionary: 'https://tg.wiktionary.org',
  tgwikibooks: 'https://tg.wikibooks.org',
  thwiki: 'https://th.wikipedia.org',
  thwikipedia: 'https://th.wikipedia.org',
  thwiktionary: 'https://th.wiktionary.org',
  thwikibooks: 'https://th.wikibooks.org',
  thwikinews: 'https://th.wikinews.org',
  thwikiquote: 'https://th.wikiquote.org',
  thwikisource: 'https://th.wikisource.org',
  tiwiki: 'https://ti.wikipedia.org',
  tiwikipedia: 'https://ti.wikipedia.org',
  tiwiktionary: 'https://ti.wiktionary.org',
  tkwiki: 'https://tk.wikipedia.org',
  tkwikipedia: 'https://tk.wikipedia.org',
  tkwiktionary: 'https://tk.wiktionary.org',
  tkwikibooks: 'https://tk.wikibooks.org',
  tkwikiquote: 'https://tk.wikiquote.org',
  tlwiki: 'https://tl.wikipedia.org',
  tlwikipedia: 'https://tl.wikipedia.org',
  tlwiktionary: 'https://tl.wiktionary.org',
  tlwikibooks: 'https://tl.wikibooks.org',
  tnwiki: 'https://tn.wikipedia.org',
  tnwikipedia: 'https://tn.wikipedia.org',
  tnwiktionary: 'https://tn.wiktionary.org',
  towiki: 'https://to.wikipedia.org',
  towikipedia: 'https://to.wikipedia.org',
  towiktionary: 'https://to.wiktionary.org',
  tpiwiki: 'https://tpi.wikipedia.org',
  tpiwikipedia: 'https://tpi.wikipedia.org',
  tpiwiktionary: 'https://tpi.wiktionary.org',
  trwiki: 'https://tr.wikipedia.org',
  trwikipedia: 'https://tr.wikipedia.org',
  trwiktionary: 'https://tr.wiktionary.org',
  trwikibooks: 'https://tr.wikibooks.org',
  trwikinews: 'https://tr.wikinews.org',
  trwikiquote: 'https://tr.wikiquote.org',
  trwikisource: 'https://tr.wikisource.org',
  tswiki: 'https://ts.wikipedia.org',
  tswikipedia: 'https://ts.wikipedia.org',
  tswiktionary: 'https://ts.wiktionary.org',
  ttwiki: 'https://tt.wikipedia.org',
  ttwikipedia: 'https://tt.wikipedia.org',
  ttwiktionary: 'https://tt.wiktionary.org',
  ttwikibooks: 'https://tt.wikibooks.org',
  ttwikiquote: 'https://tt.wikiquote.org',
  tumwiki: 'https://tum.wikipedia.org',
  tumwikipedia: 'https://tum.wikipedia.org',
  twwiki: 'https://tw.wikipedia.org',
  twwikipedia: 'https://tw.wikipedia.org',
  twwiktionary: 'https://tw.wiktionary.org',
  tywiki: 'https://ty.wikipedia.org',
  tywikipedia: 'https://ty.wikipedia.org',
  tyvwiki: 'https://tyv.wikipedia.org',
  tyvwikipedia: 'https://tyv.wikipedia.org',
  udmwiki: 'https://udm.wikipedia.org',
  udmwikipedia: 'https://udm.wikipedia.org',
  ugwiki: 'https://ug.wikipedia.org',
  ugwikipedia: 'https://ug.wikipedia.org',
  ugwiktionary: 'https://ug.wiktionary.org',
  ugwikibooks: 'https://ug.wikibooks.org',
  ugwikiquote: 'https://ug.wikiquote.org',
  ukwiki: 'https://uk.wikipedia.org',
  ukwikipedia: 'https://uk.wikipedia.org',
  ukwiktionary: 'https://uk.wiktionary.org',
  ukwikibooks: 'https://uk.wikibooks.org',
  ukwikinews: 'https://uk.wikinews.org',
  ukwikiquote: 'https://uk.wikiquote.org',
  ukwikisource: 'https://uk.wikisource.org',
  ukwikivoyage: 'https://uk.wikivoyage.org',
  urwiki: 'https://ur.wikipedia.org',
  urwikipedia: 'https://ur.wikipedia.org',
  urwiktionary: 'https://ur.wiktionary.org',
  urwikibooks: 'https://ur.wikibooks.org',
  urwikiquote: 'https://ur.wikiquote.org',
  uzwiki: 'https://uz.wikipedia.org',
  uzwikipedia: 'https://uz.wikipedia.org',
  uzwiktionary: 'https://uz.wiktionary.org',
  uzwikibooks: 'https://uz.wikibooks.org',
  uzwikiquote: 'https://uz.wikiquote.org',
  vewiki: 'https://ve.wikipedia.org',
  vewikipedia: 'https://ve.wikipedia.org',
  vecwiki: 'https://vec.wikipedia.org',
  vecwikipedia: 'https://vec.wikipedia.org',
  vecwiktionary: 'https://vec.wiktionary.org',
  vecwikisource: 'https://vec.wikisource.org',
  vepwiki: 'https://vep.wikipedia.org',
  vepwikipedia: 'https://vep.wikipedia.org',
  viwiki: 'https://vi.wikipedia.org',
  viwikipedia: 'https://vi.wikipedia.org',
  viwiktionary: 'https://vi.wiktionary.org',
  viwikibooks: 'https://vi.wikibooks.org',
  viwikiquote: 'https://vi.wikiquote.org',
  viwikisource: 'https://vi.wikisource.org',
  viwikivoyage: 'https://vi.wikivoyage.org',
  vlswiki: 'https://vls.wikipedia.org',
  vlswikipedia: 'https://vls.wikipedia.org',
  vowiki: 'https://vo.wikipedia.org',
  vowikipedia: 'https://vo.wikipedia.org',
  vowiktionary: 'https://vo.wiktionary.org',
  vowikibooks: 'https://vo.wikibooks.org',
  vowikiquote: 'https://vo.wikiquote.org',
  wawiki: 'https://wa.wikipedia.org',
  wawikipedia: 'https://wa.wikipedia.org',
  wawiktionary: 'https://wa.wiktionary.org',
  wawikibooks: 'https://wa.wikibooks.org',
  warwiki: 'https://war.wikipedia.org',
  warwikipedia: 'https://war.wikipedia.org',
  wowiki: 'https://wo.wikipedia.org',
  wowikipedia: 'https://wo.wikipedia.org',
  wowiktionary: 'https://wo.wiktionary.org',
  wowikiquote: 'https://wo.wikiquote.org',
  wuuwiki: 'https://wuu.wikipedia.org',
  wuuwikipedia: 'https://wuu.wikipedia.org',
  xalwiki: 'https://xal.wikipedia.org',
  xalwikipedia: 'https://xal.wikipedia.org',
  xhwiki: 'https://xh.wikipedia.org',
  xhwikipedia: 'https://xh.wikipedia.org',
  xhwiktionary: 'https://xh.wiktionary.org',
  xhwikibooks: 'https://xh.wikibooks.org',
  xmfwiki: 'https://xmf.wikipedia.org',
  xmfwikipedia: 'https://xmf.wikipedia.org',
  yiwiki: 'https://yi.wikipedia.org',
  yiwikipedia: 'https://yi.wikipedia.org',
  yiwiktionary: 'https://yi.wiktionary.org',
  yiwikisource: 'https://yi.wikisource.org',
  yowiki: 'https://yo.wikipedia.org',
  yowikipedia: 'https://yo.wikipedia.org',
  yowiktionary: 'https://yo.wiktionary.org',
  yowikibooks: 'https://yo.wikibooks.org',
  zawiki: 'https://za.wikipedia.org',
  zawikipedia: 'https://za.wikipedia.org',
  zawiktionary: 'https://za.wiktionary.org',
  zawikibooks: 'https://za.wikibooks.org',
  zawikiquote: 'https://za.wikiquote.org',
  zeawiki: 'https://zea.wikipedia.org',
  zeawikipedia: 'https://zea.wikipedia.org',
  zhwiki: 'https://zh.wikipedia.org',
  zhwikipedia: 'https://zh.wikipedia.org',
  zhwiktionary: 'https://zh.wiktionary.org',
  zhwikibooks: 'https://zh.wikibooks.org',
  zhwikinews: 'https://zh.wikinews.org',
  zhwikiquote: 'https://zh.wikiquote.org',
  zhwikisource: 'https://zh.wikisource.org',
  zhwikiversity: 'https://zh.wikiversity.org',
  zhwikivoyage: 'https://zh.wikivoyage.org',
  zh_classicalwiki: 'https://zh-classical.wikipedia.org',
  zh_classicalwikipedia: 'https://zh-classical.wikipedia.org',
  zh_min_nanwiki: 'https://zh-min-nan.wikipedia.org',
  zh_min_nanwikipedia: 'https://zh-min-nan.wikipedia.org',
  zh_min_nanwiktionary: 'https://zh-min-nan.wiktionary.org',
  zh_min_nanwikibooks: 'https://zh-min-nan.wikibooks.org',
  zh_min_nanwikiquote: 'https://zh-min-nan.wikiquote.org',
  zh_min_nanwikisource: 'https://zh-min-nan.wikisource.org',
  zh_yuewiki: 'https://zh-yue.wikipedia.org',
  zh_yuewikipedia: 'https://zh-yue.wikipedia.org',
  zuwiki: 'https://zu.wikipedia.org',
  zuwikipedia: 'https://zu.wikipedia.org',
  zuwiktionary: 'https://zu.wiktionary.org',
  zuwikibooks: 'https://zu.wikibooks.org'
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = site_map;
}

},{}],71:[function(_dereq_,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

//allow quite! flexible params to fetch, category
// [lang], [options], [callback]
var getParams = function getParams(a, b, c) {
  var options = {};
  var lang = 'en';
  var callback = null;

  if (typeof a === 'function') {
    callback = a;
  } else if (_typeof(a) === 'object') {
    options = a;
  } else if (typeof a === 'string') {
    lang = a;
  }

  if (typeof b === 'function') {
    callback = b;
  } else if (_typeof(b) === 'object') {
    options = b;
  }

  if (typeof c === 'function') {
    callback = c;
  }

  return {
    options: options,
    lang: lang,
    callback: callback
  };
};

module.exports = getParams;

},{}],72:[function(_dereq_,module,exports){
"use strict";

var fetch = _dereq_('cross-fetch');

var request = function request(url, options) {
  var params = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Api-User-Agent': options.userAgent || options['User-Agent'] || options['Api-User-Agent'] || 'Random user of the wtf_wikipedia library'
    }
  };
  return fetch(url, params).then(function (response) {
    if (response.status !== 200) {
      throw response;
    }

    return response.json();
  }).catch(console.error);
};

module.exports = request;

},{"cross-fetch":1}],73:[function(_dereq_,module,exports){
"use strict";

var site_map = _dereq_('../_data/site_map');

var isUrl = /^https?:\/\//;

function isArray(arr) {
  return arr.constructor.toString().indexOf('Array') > -1;
}

var makeTitle = function makeTitle() {
  var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  //if given a url...
  if (isUrl.test(title) === true) {
    title = title.replace(/.*?\/wiki\//, '');
    title = title.replace(/\?.*/, '');
  }

  title = encodeURIComponent(title);
  return title;
}; //construct a lookup-url for the wikipedia api


var makeUrl = function makeUrl(title, lang, options) {
  lang = lang || 'en';
  var url = "https://".concat(lang, ".wikipedia.org/w/api.php");

  if (site_map[lang]) {
    url = site_map[lang] + '/w/api.php';
  }

  if (options.wikiUrl) {
    url = options.wikiUrl;
  } //we use the 'revisions' api here, instead of the Raw api, for its CORS-rules..


  url += '?action=query&prop=revisions&rvprop=content&maxlag=5&rvslots=main&format=json';

  if (!options.wikiUrl) {
    url += '&origin=*';
  }

  if (options.follow_redirects !== false) {
    url += '&redirects=true';
  }

  var lookup = 'titles';
  var pages = []; //support one, or many pages

  if (isArray(title) === false) {
    pages = [title];
  } else {
    pages = title;
  } //assume numbers mean pageid, and strings are titles (like '1984')


  if (typeof pages[0] === 'number') {
    lookup = 'pageids';
  } else {
    pages = pages.map(makeTitle);
  }

  pages = pages.filter(function (p) {
    return p !== '';
  });
  pages = pages.join('|');
  url += '&' + lookup + '=' + pages;
  return url;
};

module.exports = makeUrl;

},{"../_data/site_map":70}],74:[function(_dereq_,module,exports){
"use strict";

var site_map = _dereq_('../_data/site_map');

var request = _dereq_('./_request');

var getParams = _dereq_('./_params');

var normalizeCategory = function normalizeCategory() {
  var cat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (/^Category/i.test(cat) === false) {
    cat = 'Category:' + cat;
  }

  cat = cat.replace(/ /g, '_');
  return cat;
};

var makeUrl = function makeUrl(cat, lang) {
  cat = encodeURIComponent(cat);
  var url = "https://".concat(lang, ".wikipedia.org/w/api.php");

  if (site_map[lang]) {
    url = site_map[lang] + '/w/api.php';
  }

  url += "?action=query&list=categorymembers&cmtitle=".concat(cat, "&cmlimit=500&format=json&origin=*&redirects=true&cmtype=page|subcat");
  return url;
};

var addResult = function addResult(body, out) {
  if (body.query && body.query.categorymembers) {
    var list = body.query.categorymembers;
    list.forEach(function (p) {
      if (p.ns === 14) {
        out.categories.push(p);
      } else {
        out.pages.push(p);
      }
    });
    return out;
  }

  return out;
};

var getCategories = function getCategories(cat, a, b, c) {
  var _getParams = getParams(a, b, c),
      lang = _getParams.lang,
      options = _getParams.options,
      callback = _getParams.callback; //cleanup cat name


  cat = normalizeCategory(cat);
  var url = makeUrl(cat, lang, options);
  var safety = 0;
  var output = {
    category: cat,
    pages: [],
    categories: []
  };

  var doit = function doit() {
    var cntd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var cb = arguments.length > 1 ? arguments[1] : undefined;
    var myUrl = url + '&cmcontinue=' + cntd;
    var p = request(myUrl, options);
    p.then(function (body) {
      output = addResult(body, output); //should we do another?

      if (body.continue && body.continue.cmcontinue && body.continue.cmcontinue !== cntd && safety < 25) {
        safety += 1;
        doit(body.continue.cmcontinue, cb);
      } else {
        cb(null, output);
      }
    });
  };

  return new Promise(function (resolve, reject) {
    doit('', function (err) {
      if (typeof callback === 'function') {
        callback(err, output);
      }

      if (err) {
        reject(err);
      }

      resolve(output);
    });
  });
};

module.exports = getCategories;

},{"../_data/site_map":70,"./_params":71,"./_request":72}],75:[function(_dereq_,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

//grab the content of any article, off the api
var request = _dereq_('./_request');

var makeUrl = _dereq_('./_url');

var getParams = _dereq_('./_params');

var parseDoc = _dereq_('../01-document'); //num pages per request


var MAX_PAGES = 5; //this data-format from mediawiki api is nutso

var postProcess = function postProcess(data) {
  var pages = Object.keys(data.query.pages);
  var docs = pages.map(function (id) {
    var page = data.query.pages[id] || {};

    if (page.hasOwnProperty('missing') || page.hasOwnProperty('invalid')) {
      return null;
    }

    var text = page.revisions[0]['*']; //us the 'generator' result format, for the random() method

    if (!text && page.revisions[0].slots) {
      text = page.revisions[0].slots.main['*'];
    }

    var opt = {
      title: page.title,
      pageID: page.pageid
    };

    try {
      return parseDoc(text, opt);
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
  return docs;
}; //recursive fn to fetch groups of pages, serially


var doPages = function doPages(pages, results, lang, options, cb) {
  var todo = pages.slice(0, MAX_PAGES);
  var url = makeUrl(todo, lang, options);
  var p = request(url, options);
  p.then(function (wiki) {
    var res = postProcess(wiki, options);
    results = results.concat(res);
    var remain = pages.slice(MAX_PAGES);

    if (remain.length > 0) {
      return doPages(remain, results, lang, options, cb); //recursive
    }

    return cb(results);
  }).catch(function (e) {
    console.error('wtf_wikipedia error: ' + e);
    cb(results);
  });
}; //grab a single, or list of pages (or ids)


var fetchPage = function fetchPage() {
  var pages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var a = arguments.length > 1 ? arguments[1] : undefined;
  var b = arguments.length > 2 ? arguments[2] : undefined;
  var c = arguments.length > 3 ? arguments[3] : undefined;

  if (_typeof(pages) !== 'object') {
    pages = [pages];
  }

  var _getParams = getParams(a, b, c),
      lang = _getParams.lang,
      options = _getParams.options,
      callback = _getParams.callback;

  return new Promise(function (resolve, reject) {
    // courtesy-check for spamming wp servers
    if (pages.length > 500) {
      console.error('wtf_wikipedia error: Requested ' + pages.length + ' pages.');
      reject('Requested too many pages, exiting.');
      return;
    }

    doPages(pages, [], lang, options, function (docs) {
      docs = docs.filter(function (d) {
        return d !== null;
      }); //return the first doc, if we only asked for one

      if (pages.length === 1) {
        docs = docs[0];
      }

      docs = docs || null; //support 'err-back' format

      if (callback && typeof callback === 'function') {
        callback(null, docs);
      }

      resolve(docs);
    });
  });
};

module.exports = fetchPage;

},{"../01-document":7,"./_params":71,"./_request":72,"./_url":73}],76:[function(_dereq_,module,exports){
"use strict";

var site_map = _dereq_('../_data/site_map');

var request = _dereq_('./_request');

var getParams = _dereq_('./_params');

var parseDoc = _dereq_('../01-document');

var makeUrl = function makeUrl(lang) {
  var url = "https://".concat(lang, ".wikipedia.org/w/api.php");

  if (site_map[lang]) {
    url = site_map[lang] + '/w/api.php';
  }

  url += "?format=json&action=query&generator=random&grnnamespace=0&prop=revisions&rvprop=content&grnlimit=1&rvslots=main&origin=*";
  return url;
}; //this data-format from mediawiki api is nutso


var postProcess = function postProcess(data, options) {
  var pages = Object.keys(data.query.pages);
  var id = pages[0];
  var page = data.query.pages[id] || {};

  if (page.hasOwnProperty('missing') || page.hasOwnProperty('invalid')) {
    return null;
  } //us the 'generator' result format, for the random() method


  var text = page.revisions[0].slots.main['*'];
  options.title = page.title;
  options.pageID = page.pageid;

  try {
    return parseDoc(text, options);
  } catch (e) {
    console.error(e);
    throw e;
  }
}; //fetch and parse a random page from the api


var getRandom = function getRandom(a, b, c) {
  var _getParams = getParams(a, b, c),
      lang = _getParams.lang,
      options = _getParams.options,
      callback = _getParams.callback;

  var url = makeUrl(lang);
  return new Promise(function (resolve, reject) {
    var p = request(url, options);
    p.then(function (res) {
      return postProcess(res, options);
    }).then(function (doc) {
      //support 'err-back' format
      if (typeof callback === 'function') {
        callback(null, doc);
      }

      resolve(doc);
    }).catch(reject);
  });
};

module.exports = getRandom;

},{"../01-document":7,"../_data/site_map":70,"./_params":71,"./_request":72}],77:[function(_dereq_,module,exports){
"use strict";

//alternative names for methods in API
var aliasList = {
  toMarkdown: 'markdown',
  toHtml: 'html',
  HTML: 'html',
  toJSON: 'json',
  toJson: 'json',
  JSON: 'json',
  toLatex: 'latex',
  plaintext: 'text',
  wikiscript: 'wikitext',
  wiki: 'wikitext',
  original: 'wikitext'
};
module.exports = aliasList;

},{}],78:[function(_dereq_,module,exports){
"use strict";

// dumpster-dive throws everything into mongodb  - github.com/spencermountain/dumpster-dive
// mongo has some opinions about what characters are allowed as keys and ids.
//https://stackoverflow.com/questions/12397118/mongodb-dot-in-key-name/30254815#30254815
var specialChar = /[\\\.$]/;

var encodeStr = function encodeStr(str) {
  if (typeof str !== 'string') {
    str = '';
  }

  str = str.replace(/\\/g, '\\\\');
  str = str.replace(/^\$/, "\\u0024");
  str = str.replace(/\./g, "\\u002e");
  return str;
};

var encodeObj = function encodeObj() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var keys = Object.keys(obj);

  for (var i = 0; i < keys.length; i += 1) {
    if (specialChar.test(keys[i]) === true) {
      var str = encodeStr(keys[i]);

      if (str !== keys[i]) {
        obj[str] = obj[keys[i]];
        delete obj[keys[i]];
      }
    }
  }

  return obj;
};

module.exports = {
  encodeObj: encodeObj
};

},{}],79:[function(_dereq_,module,exports){
"use strict";

var helpers = {
  capitalise: function capitalise(str) {
    if (str && typeof str === 'string') {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return '';
  },
  onlyUnique: function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  },
  trim_whitespace: function trim_whitespace(str) {
    if (str && typeof str === 'string') {
      str = str.replace(/^\s\s*/, '');
      str = str.replace(/\s\s*$/, '');
      str = str.replace(/ {2}/, ' ');
      str = str.replace(/\s, /, ', ');
      return str;
    }

    return '';
  }
};
module.exports = helpers;

},{}],80:[function(_dereq_,module,exports){
"use strict";

//center-pad each cell, to make the table more legible
var pad = function pad(str, cellWidth) {
  str = str || '';
  str = String(str);
  cellWidth = cellWidth || 15;
  var diff = cellWidth - str.length;
  diff = Math.ceil(diff / 2);

  for (var i = 0; i < diff; i += 1) {
    str = ' ' + str;

    if (str.length < cellWidth) {
      str = str + ' ';
    }
  }

  return str;
};

module.exports = pad;

},{}],81:[function(_dereq_,module,exports){
"use strict";

//find all the pairs of '[[...[[..]]...]]' in the text
//used to properly root out recursive template calls, [[.. [[...]] ]]
//basically just adds open tags, and subtracts closing tags
function find_recursive(opener, closer, text) {
  var out = [];
  var last = [];
  var chars = text.split('');
  var open = 0;

  for (var i = 0; i < chars.length; i++) {
    var c = text[i]; //increment open tag

    if (c === opener) {
      open += 1;
    } //decrement close tag
    else if (c === closer) {
        open -= 1;

        if (open < 0) {
          open = 0;
        }
      } else if (last.length === 0) {
        // If we're not inside of a pair of delimiters, we can discard the current letter.
        // The return of this function is only used to extract images.
        continue;
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
      } //is it botched?


      if (open_count > close_count) {
        last.push(closer);
      } //looks good, keep it


      out.push(last.join(''));
      last = [];
    }
  }

  return out;
}

module.exports = find_recursive; // console.log(find_recursive('{', '}', 'he is president. {{nowrap|{{small|(1995–present)}}}} he lives in texas'));
// console.log(find_recursive("{", "}", "this is fun {{nowrap{{small1995–present}}}} and it works"))

},{}],82:[function(_dereq_,module,exports){
"use strict";

//
var setDefaults = function setDefaults(options, defaults) {
  var obj = {};
  defaults = defaults || {};
  Object.keys(defaults).forEach(function (k) {
    obj[k] = defaults[k];
  });
  options = options || {};
  Object.keys(options).forEach(function (k) {
    obj[k] = options[k];
  });
  return obj;
};

module.exports = setDefaults;

},{}],83:[function(_dereq_,module,exports){
"use strict";

//escape a string like 'fun*2.Co' for a regExpr
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
} //sometimes text-replacements can be ambiguous - words used multiple times..


var smartReplace = function smartReplace(all, text, result) {
  if (!text || !all) {
    return all;
  }

  if (typeof all === 'number') {
    all = String(all);
  }

  text = escapeRegExp(text); //try a word-boundary replace

  var reg = new RegExp('\\b' + text + '\\b');

  if (reg.test(all) === true) {
    all = all.replace(reg, result);
  } else {
    //otherwise, fall-back to a much messier, dangerous replacement
    // console.warn('missing \'' + text + '\'');
    all = all.replace(text, result);
  }

  return all;
};

module.exports = smartReplace;

},{}],84:[function(_dereq_,module,exports){
"use strict";

var fetch = _dereq_('cross-fetch');

var toMarkdown = _dereq_('./toMarkdown');

var toHtml = _dereq_('./toHtml');

var toLatex = _dereq_('./toLatex');

var toJson = _dereq_('./toJson');

var server = 'https://wikipedia.org/wiki/Special:Redirect/file/';

var aliasList = _dereq_('../_lib/aliases');

var encodeTitle = function encodeTitle(file) {
  var title = file.replace(/^(image|file?)\:/i, ''); //titlecase it

  title = title.charAt(0).toUpperCase() + title.substring(1); //spaces to underscores

  title = title.trim().replace(/ /g, '_');
  return title;
}; //the wikimedia image url is a little silly:


var makeSrc = function makeSrc(file) {
  var title = encodeTitle(file);
  title = encodeURIComponent(title);
  return title;
}; //the class for our image generation functions


var Image = function Image(data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data
  });
};

var methods = {
  file: function file() {
    return this.data.file || '';
  },
  alt: function alt() {
    var str = this.data.alt || this.data.file || '';
    str = str.replace(/^(file|image):/i, '');
    str = str.replace(/\.(jpg|jpeg|png|gif|svg)/i, '');
    return str.replace(/_/g, ' ');
  },
  caption: function caption() {
    if (this.data.caption) {
      return this.data.caption.text();
    }

    return '';
  },
  links: function links() {
    if (this.data.caption) {
      return this.data.caption.links();
    }

    return [];
  },
  url: function url() {
    return server + makeSrc(this.file());
  },
  thumbnail: function thumbnail(size) {
    size = size || 300;
    var path = makeSrc(this.file());
    return server + path + '?width=' + size;
  },
  format: function format() {
    var arr = this.file().split('.');

    if (arr[arr.length - 1]) {
      return arr[arr.length - 1].toLowerCase();
    }

    return null;
  },
  exists: function exists(callback) {
    var _this = this;

    //check if the image (still) exists
    return new Promise(function (cb) {
      fetch(_this.url(), {
        method: 'HEAD'
      }).then(function (res) {
        var exists = res.status === 200; //support callback non-promise form

        if (callback) {
          callback(exists);
        }

        cb(exists);
      });
    });
  },
  markdown: function markdown(options) {
    options = options || {};
    return toMarkdown(this, options);
  },
  latex: function latex(options) {
    return toLatex(this, options);
  },
  html: function html(options) {
    options = options || {};
    return toHtml(this, options);
  },
  json: function json(options) {
    options = options || {};
    return toJson(this, options);
  },
  text: function text() {
    return '';
  }
};
Object.keys(methods).forEach(function (k) {
  Image.prototype[k] = methods[k];
}); //add alises, too

Object.keys(aliasList).forEach(function (k) {
  Image.prototype[k] = methods[aliasList[k]];
});
Image.prototype.src = Image.prototype.url;
Image.prototype.thumb = Image.prototype.thumbnail;
module.exports = Image;

},{"../_lib/aliases":77,"./toHtml":86,"./toJson":87,"./toLatex":88,"./toMarkdown":89,"cross-fetch":1}],85:[function(_dereq_,module,exports){
"use strict";

var i18n = _dereq_('../_data/i18n');

var Image = _dereq_('./Image');

var parseSentence = _dereq_('../04-sentence').oneSentence;

var isFile = new RegExp('(' + i18n.images.concat(i18n.files).join('|') + '):', 'i');
var fileNames = "(".concat(i18n.images.concat(i18n.files).join('|'), ")");
var file_reg = new RegExp(fileNames + ':(.+?)[\\||\\]]', 'i');
var altText = /^alt ?=/i; //style directives for Wikipedia:Extended_image_syntax

var imgLayouts = {
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
}; //images are usually [[image:my_pic.jpg]]

var oneImage = function oneImage(img) {
  var m = img.match(file_reg);

  if (m === null || !m[2]) {
    return null;
  }

  var file = "".concat(m[1], ":").concat(m[2] || '');
  file = file.trim(); //titlecase it

  var title = file.charAt(0).toUpperCase() + file.substring(1); //spaces to underscores

  title = title.replace(/ /g, '_');

  if (title) {
    var obj = {
      file: file
    }; //try to grab other metadata, too

    img = img.replace(/^\[\[/, '');
    img = img.replace(/\]\]$/, ''); //https://en.wikipedia.org/wiki/Wikipedia:Extended_image_syntax
    // - [[File:Name|Type|Border|Location|Alignment|Size|link=Link|alt=Alt|lang=Langtag|Caption]]

    var arr = img.split('|');
    arr = arr.slice(1); //parse-out alt text, if explicitly given

    arr.forEach(function (s) {
      if (altText.test(s) === true) {
        obj.alt = s.replace(altText, '');
      }
    }); //remove 'thumb' and things

    arr = arr.filter(function (str) {
      return imgLayouts.hasOwnProperty(str) === false;
    });

    if (arr[arr.length - 1]) {
      obj.caption = parseSentence(arr[arr.length - 1]);
    }

    return new Image(obj, img);
  }

  return null;
}; // console.log(parse_image("[[image:my_pic.jpg]]"));


var parseImages = function parseImages(matches, r, wiki) {
  matches.forEach(function (s) {
    if (isFile.test(s) === true) {
      r.images = r.images || [];
      var img = oneImage(s);

      if (img) {
        r.images.push(img);
      }

      wiki = wiki.replace(s, '');
    }
  });
  return wiki;
};

module.exports = parseImages;

},{"../04-sentence":58,"../_data/i18n":68,"./Image":84}],86:[function(_dereq_,module,exports){
"use strict";

var makeImage = function makeImage(img) {
  return '  <img src="' + img.thumbnail() + '" alt="' + img.alt() + '"/>';
};

module.exports = makeImage;

},{}],87:[function(_dereq_,module,exports){
"use strict";

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  caption: true,
  alt: true,
  links: true,
  thumb: true,
  url: true
}; //

var toJson = function toJson(img, options) {
  options = setDefaults(options, defaults);
  var json = {
    file: img.file()
  };

  if (options.thumb !== false) {
    json.thumb = img.thumbnail();
  }

  if (options.url !== false) {
    json.url = img.url();
  } //add captions


  if (options.caption !== false && img.data.caption) {
    json.caption = img.caption();

    if (options.links !== false && img.data.caption.links()) {
      json.links = img.links();
    }
  }

  if (options.alt !== false && img.data.alt) {
    json.alt = img.alt();
  }

  return json;
};

module.exports = toJson;

},{"../_lib/setDefaults":82}],88:[function(_dereq_,module,exports){
"use strict";

//
var toLatex = function toLatex(image) {
  var alt = image.alt();
  var out = '\\begin{figure}';
  out += '\n\\includegraphics[width=\\linewidth]{' + image.thumb() + '}';
  out += '\n\\caption{' + alt + '}'; // out += '\n%\\label{fig:myimage1}';

  out += '\n\\end{figure}';
  return out;
};

module.exports = toLatex;

},{}],89:[function(_dereq_,module,exports){
"use strict";

//markdown images are like this: ![alt text](href)
var doImage = function doImage(image) {
  var alt = image.data.file.replace(/^(file|image):/i, '');
  alt = alt.replace(/\.(jpg|jpeg|png|gif|svg)/i, '');
  return '![' + alt + '](' + image.thumbnail() + ')';
};

module.exports = doImage;

},{}],90:[function(_dereq_,module,exports){
"use strict";

var fetch = _dereq_('./_fetch/fetch');

var random = _dereq_('./_fetch/random');

var category = _dereq_('./_fetch/category');

var version = _dereq_('../package').version;

var parseDocument = _dereq_('./01-document/index.js'); //the main 'factory' exported method


var wtf = function wtf(wiki, options) {
  return parseDocument(wiki, options);
};

wtf.fetch = function (title, lang, options, cb) {
  return fetch(title, lang, options, cb);
};

wtf.random = function (lang, options, cb) {
  return random(lang, options, cb);
};

wtf.category = function (cat, lang, options, cb) {
  return category(cat, lang, options, cb);
};

wtf.version = version;
module.exports = wtf;

},{"../package":2,"./01-document/index.js":7,"./_fetch/category":74,"./_fetch/fetch":75,"./_fetch/random":76}],91:[function(_dereq_,module,exports){
"use strict";

var toMarkdown = _dereq_('./toMarkdown');

var toHtml = _dereq_('./toHtml');

var toLatex = _dereq_('./toLatex');

var toJson = _dereq_('./toJson');

var Image = _dereq_('../image/Image');

var aliasList = _dereq_('../_lib/aliases'); //a formal key-value data table about a topic


var Infobox = function Infobox(obj) {
  this._type = obj.type;
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: obj.data
  });
};

var methods = {
  type: function type() {
    return this._type;
  },
  links: function links(n) {
    var _this = this;

    var arr = [];
    Object.keys(this.data).forEach(function (k) {
      _this.data[k].links().forEach(function (l) {
        return arr.push(l);
      });
    });

    if (typeof n === 'number') {
      return arr[n];
    } else if (typeof n === 'string') {
      //grab a link like .links('Fortnight')
      n = n.charAt(0).toUpperCase() + n.substring(1); //titlecase it

      var link = arr.find(function (o) {
        return o.page === n;
      });
      return link === undefined ? [] : [link];
    }

    return arr;
  },
  image: function image() {
    var s = this.get('image');

    if (!s) {
      return null;
    }

    var obj = s.json();
    obj.file = obj.text;
    obj.text = '';
    return new Image(obj);
  },
  get: function get() {
    var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    key = key.toLowerCase();
    var keys = Object.keys(this.data);

    for (var i = 0; i < keys.length; i += 1) {
      var tmp = keys[i].toLowerCase().trim();

      if (key === tmp) {
        return this.data[keys[i]];
      }
    }

    return null;
  },
  markdown: function markdown(options) {
    options = options || {};
    return toMarkdown(this, options);
  },
  html: function html(options) {
    options = options || {};
    return toHtml(this, options);
  },
  latex: function latex(options) {
    options = options || {};
    return toLatex(this, options);
  },
  text: function text() {
    return '';
  },
  json: function json(options) {
    options = options || {};
    return toJson(this, options);
  },
  keyValue: function keyValue() {
    var _this2 = this;

    return Object.keys(this.data).reduce(function (h, k) {
      if (_this2.data[k]) {
        h[k] = _this2.data[k].text();
      }

      return h;
    }, {});
  }
}; //aliases

Object.keys(methods).forEach(function (k) {
  Infobox.prototype[k] = methods[k];
}); //add alises, too

Object.keys(aliasList).forEach(function (k) {
  Infobox.prototype[k] = methods[aliasList[k]];
});
Infobox.prototype.data = Infobox.prototype.keyValue;
Infobox.prototype.template = Infobox.prototype.type;
Infobox.prototype.images = Infobox.prototype.image;
module.exports = Infobox;

},{"../_lib/aliases":77,"../image/Image":84,"./toHtml":93,"./toJson":94,"./toLatex":95,"./toMarkdown":96}],92:[function(_dereq_,module,exports){
"use strict";

module.exports = {
  image: true,
  caption: true,
  alt: true,
  signature: true,
  'signature alt': true
};

},{}],93:[function(_dereq_,module,exports){
"use strict";

var dontDo = _dereq_('./_skip-keys');

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  images: true
}; //

var infobox = function infobox(obj, options) {
  options = setDefaults(options, defaults);
  var html = '<table class="infobox">\n';
  html += '  <thead>\n';
  html += '  </thead>\n';
  html += '  <tbody>\n'; //put image and caption on the top

  if (options.images === true && obj.data.image) {
    html += '    <tr>\n';
    html += '       <td colspan="2" style="text-align:center">\n';
    html += '       ' + obj.image().html() + '\n';
    html += '       </td>\n';

    if (obj.data.caption || obj.data.alt) {
      var caption = obj.data.caption ? obj.data.caption.html(options) : obj.data.alt.html(options);
      html += '       <td colspan="2" style="text-align:center">\n';
      html += '         ' + caption + '\n';
      html += '       </td>\n';
    }

    html += '    </tr>\n';
  }

  Object.keys(obj.data).forEach(function (k) {
    if (dontDo[k] === true) {
      return;
    }

    var s = obj.data[k];
    var key = k.replace(/_/g, ' ');
    key = key.charAt(0).toUpperCase() + key.substring(1); //titlecase it

    var val = s.html(options);
    html += '    <tr>\n';
    html += '      <td>' + key + '</td>\n';
    html += '      <td>' + val + '</td>\n';
    html += '    </tr>\n';
  });
  html += '  </tbody>\n';
  html += '</table>\n';
  return html;
};

module.exports = infobox;

},{"../_lib/setDefaults":82,"./_skip-keys":92}],94:[function(_dereq_,module,exports){
"use strict";

var encode = _dereq_('../_lib/encode'); //turn an infobox into some nice json


var toJson = function toJson(infobox, options) {
  var json = Object.keys(infobox.data).reduce(function (h, k) {
    if (infobox.data[k]) {
      h[k] = infobox.data[k].json();
    }

    return h;
  }, {}); //support mongo-encoding keys

  if (options.encode === true) {
    json = encode.encodeObj(json);
  }

  return json;
};

module.exports = toJson;

},{"../_lib/encode":78}],95:[function(_dereq_,module,exports){
"use strict";

var dontDo = _dereq_('./_skip-keys');

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  images: true
}; //

var infobox = function infobox(obj, options) {
  options = setDefaults(options, defaults);
  var out = '\n \\vspace*{0.3cm} % Info Box\n\n';
  out += '\\begin{tabular}{|@{\\qquad}l|p{9.5cm}@{\\qquad}|} \n';
  out += '  \\hline  %horizontal line\n'; //todo: render top image here

  Object.keys(obj.data).forEach(function (k) {
    if (dontDo[k] === true) {
      return;
    }

    var s = obj.data[k];
    var val = s.latex(options);
    out += '  % ---------- \n';
    out += '      ' + k + ' & \n';
    out += '      ' + val + '\\\\ \n';
    out += '  \\hline  %horizontal line\n';
  });
  out += '\\end{tabular} \n';
  out += '\n\\vspace*{0.3cm}\n\n';
  return out;
};

module.exports = infobox;

},{"../_lib/setDefaults":82,"./_skip-keys":92}],96:[function(_dereq_,module,exports){
"use strict";

var dontDo = _dereq_('./_skip-keys');

var pad = _dereq_('../_lib/pad');

var setDefaults = _dereq_('../_lib/setDefaults');

var defaults = {
  images: true
}; // render an infobox as a table with two columns, key + value

var doInfobox = function doInfobox(obj, options) {
  options = setDefaults(options, defaults);
  var md = '|' + pad('', 35) + '|' + pad('', 30) + '|\n';
  md += '|' + pad('---', 35) + '|' + pad('---', 30) + '|\n'; //todo: render top image here (somehow)

  Object.keys(obj.data).forEach(function (k) {
    if (dontDo[k] === true) {
      return;
    }

    var key = '**' + k + '**';
    var s = obj.data[k];
    var val = s.markdown(options); //markdown is more newline-sensitive than wiki

    val = val.split(/\n/g).join(', ');
    md += '|' + pad(key, 35) + '|' + pad(val, 30) + ' |\n';
  });
  return md;
};

module.exports = doInfobox;

},{"../_lib/pad":80,"../_lib/setDefaults":82,"./_skip-keys":92}],97:[function(_dereq_,module,exports){
"use strict";

var strip = _dereq_('./_parsers/_strip');

var open = '{';
var close = '}'; //grab all first-level recursions of '{{...}}'

var findFlat = function findFlat(wiki) {
  var depth = 0;
  var list = [];
  var carry = [];

  for (var i = wiki.indexOf(open); i !== -1 && i < wiki.length; depth > 0 ? i++ : i = wiki.indexOf(open, i + 1)) {
    var c = wiki[i]; //open it

    if (c === open) {
      depth += 1;
    } //close it


    if (depth > 0) {
      if (c === close) {
        depth -= 1;

        if (depth === 0) {
          carry.push(c);
          var tmpl = carry.join('');
          carry = []; //last check

          if (/\{\{/.test(tmpl) && /\}\}/.test(tmpl)) {
            list.push(tmpl);
          }

          continue;
        }
      } //require two '{{' to open it


      if (depth === 1 && c !== open && c !== close) {
        depth = 0;
        carry = [];
        continue;
      }

      carry.push(c);
    }
  }

  return list;
}; //get all nested templates


var findNested = function findNested(top) {
  var deep = [];
  top.forEach(function (str) {
    if (/\{\{/.test(str.substr(2)) === true) {
      str = strip(str);
      findFlat(str).forEach(function (o) {
        if (o) {
          deep.push(o);
        }
      });
    }
  });
  return deep;
};

var getTemplates = function getTemplates(wiki) {
  var list = findFlat(wiki);
  return {
    top: list,
    nested: findNested(list)
  };
};

module.exports = getTemplates; // console.log(getTemplates('he is president. {{nowrap|he is {{age|1980}} years}} he lives in {{date}} texas'));

},{"./_parsers/_strip":105}],98:[function(_dereq_,module,exports){
"use strict";

//we explicitly ignore these, because they sometimes have resolve some data
var list = [//https://en.wikipedia.org/wiki/category:templates_with_no_visible_output
'anchor', 'defaultsort', 'use list-defined references', 'void', //https://en.wikipedia.org/wiki/Category:Protection_templates
'pp', 'pp-move-indef', 'pp-semi-indef', 'pp-vandalism', //https://en.wikipedia.org/wiki/Template:R
'r', //out-of-scope still - https://en.wikipedia.org/wiki/Template:Tag
'#tag', //https://en.wikipedia.org/wiki/Template:Navboxes
'navboxes', 'reflist', 'ref-list', 'div col', 'authority control', //https://en.wikipedia.org/wiki/Template:Citation_needed
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
'pope list end', 'shipwreck list end', 'starbox end', 'end box', 'end', 's-end'];
var ignore = list.reduce(function (h, str) {
  h[str] = true;
  return h;
}, {});
module.exports = ignore;

},{}],99:[function(_dereq_,module,exports){
"use strict";

var i18n = _dereq_('../_data/i18n');

var i18nReg = new RegExp('^(subst.)?(' + i18n.infoboxes.join('|') + ')[: \n]', 'i'); //some looser ones

var startReg = /^infobox /i;
var endReg = / infobox$/i;
var yearIn = /$Year in [A-Z]/i; //some known ones from
// https://en.wikipedia.org/wiki/Wikipedia:List_of_infoboxes
// and https://en.wikipedia.org/wiki/Category:Infobox_templates

var known = {
  'gnf protein box': true,
  'automatic taxobox': true,
  'chembox ': true,
  'editnotice': true,
  'geobox': true,
  'hybridbox': true,
  'ichnobox': true,
  'infraspeciesbox': true,
  'mycomorphbox': true,
  'oobox': true,
  'paraphyletic group': true,
  'speciesbox': true,
  'subspeciesbox': true,
  'starbox short': true,
  'taxobox': true,
  'nhlteamseason': true,
  'asian games bid': true,
  'canadian federal election results': true,
  'dc thomson comic strip': true,
  'daytona 24 races': true,
  'edencharacter': true,
  'moldova national football team results': true,
  'samurai': true,
  'protein': true,
  'sheet authority': true,
  'order-of-approx': true,
  'bacterial labs': true,
  'medical resources': true,
  'ordination': true,
  'hockey team coach': true,
  'hockey team gm': true,
  'hockey team player': true,
  'hockey team start': true,
  'mlbbioret': true
}; //

var isInfobox = function isInfobox(name) {
  // known
  if (known.hasOwnProperty(name) === true) {
    return true;
  }

  if (i18nReg.test(name)) {
    return true;
  }

  if (startReg.test(name) || endReg.test(name)) {
    return true;
  } //these are also infoboxes: 'Year in Belarus'


  if (yearIn.test(name)) {
    return true;
  }

  return false;
}; //turns template data into good inforbox data


var fmtInfobox = function fmtInfobox() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var m = obj.template.match(i18nReg);
  var type = obj.template;

  if (m && m[0]) {
    type = type.replace(m[0], '');
  }

  type = type.trim();
  var infobox = {
    template: 'infobox',
    type: type,
    data: obj
  };
  delete infobox.data.template; // already have this.

  delete infobox.data.list; //just in case!

  return infobox;
};

module.exports = {
  isInfobox: isInfobox,
  format: fmtInfobox
};

},{"../_data/i18n":68}],100:[function(_dereq_,module,exports){
"use strict";

//turn {{name|one|two|three}} into [name, one, two, three]
var pipeSplitter = function pipeSplitter(tmpl) {
  //start with a naiive '|' split
  var arr = tmpl.split(/\n?\|/); //we've split by '|', which is pretty lame
  //look for broken-up links and fix them :/

  arr.forEach(function (a, i) {
    if (a === null) {
      return;
    } //has '[[' but no ']]'


    if (/\[\[[^\]]+$/.test(a) || /\{\{[^\}]+$/.test(a)) {
      arr[i + 1] = arr[i] + '|' + arr[i + 1];
      arr[i] = null;
    }
  }); //cleanup any mistakes we've made

  arr = arr.filter(function (a) {
    return a !== null;
  });
  arr = arr.map(function (a) {
    return (a || '').trim();
  }); //remove empty fields, only at the end:

  for (var i = arr.length - 1; i >= 0; i -= 1) {
    if (arr[i] === '') {
      arr.pop();
    }

    break;
  }

  return arr;
};

module.exports = pipeSplitter;

},{}],101:[function(_dereq_,module,exports){
"use strict";

// every value in {{tmpl|a|b|c}} needs a name
// here we come up with names for them
var hasKey = /^[ \x2D\.0-9_a-z\xC0-\xFF\u017F\u1E9E\u212A\u212B]+=/i; //templates with these properties are asking for trouble

var reserved = {
  template: true,
  list: true,
  prototype: true
}; //turn 'key=val' into {key:key, val:val}

var parseKey = function parseKey(str) {
  var parts = str.split('=');
  var key = parts[0] || '';
  key = key.toLowerCase().trim();
  var val = parts.slice(1).join('='); //don't let it be called 'template'..

  if (reserved.hasOwnProperty(key)) {
    key = '_' + key;
  }

  return {
    key: key,
    val: val.trim()
  };
}; //turn [a, b=v, c] into {'1':a, b:v, '2':c}


var keyMaker = function keyMaker(arr, order) {
  var o = 0;
  return arr.reduce(function (h, str) {
    str = (str || '').trim(); //support named keys - 'foo=bar'

    if (hasKey.test(str) === true) {
      var res = parseKey(str);

      if (res.key) {
        h[res.key] = res.val;
        return h;
      }
    } //try a key from given 'order' names


    if (order && order[o]) {
      var key = order[o]; //here goes!

      h[key] = str;
    } else {
      h.list = h.list || [];
      h.list.push(str);
    }

    o += 1;
    return h;
  }, {});
};

module.exports = keyMaker;

},{}],102:[function(_dereq_,module,exports){
"use strict";

var whoCares = {
  'classname': true,
  'style': true,
  'align': true,
  'margin': true,
  'left': true,
  'break': true,
  'boxsize': true,
  'framestyle': true,
  'item_style': true,
  'collapsible': true,
  'list_style_type': true,
  'list-style-type': true,
  'colwidth': true
}; //remove wiki-cruft & some styling info from templates

var cleanup = function cleanup(obj) {
  Object.keys(obj).forEach(function (k) {
    if (whoCares[k.toLowerCase()] === true) {
      delete obj[k];
    } //remove empty values, too


    if (obj[k] === null || obj[k] === '') {
      delete obj[k];
    }
  });
  return obj;
};

module.exports = cleanup;

},{}],103:[function(_dereq_,module,exports){
"use strict";

//normalize template names
var fmtName = function fmtName(name) {
  name = (name || '').trim();
  name = name.toLowerCase();
  name = name.replace(/_/g, ' ');
  return name;
};

module.exports = fmtName;

},{}],104:[function(_dereq_,module,exports){
"use strict";

var fmtName = _dereq_('./_fmtName'); //get the name of the template
//templates are usually '{{name|stuff}}'


var getName = function getName(tmpl) {
  var name = null; //{{name|foo}}

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
    name = fmtName(name);
  }

  return name || null;
}; // console.log(templateName('{{name|foo}}'));
// console.log(templateName('{{name here}}'));
// console.log(templateName('{{CITE book |title=the killer and the cartoons }}'));
// console.log(templateName(`{{name
// |key=val}}`));


module.exports = getName;

},{"./_fmtName":103}],105:[function(_dereq_,module,exports){
"use strict";

//remove the top/bottom off the template
var strip = function strip(tmpl) {
  tmpl = tmpl.replace(/^\{\{/, '');
  tmpl = tmpl.replace(/\}\}$/, '');
  return tmpl;
};

module.exports = strip;

},{}],106:[function(_dereq_,module,exports){
"use strict";

//remove the top/bottom off the template
var strip = _dereq_('./_strip');

var fmtName = _dereq_('./_fmtName');

var parseSentence = _dereq_('../../04-sentence').oneSentence;

var pipeSplitter = _dereq_('./01-pipe-splitter');

var keyMaker = _dereq_('./02-keyMaker');

var cleanup = _dereq_('./03-cleanup'); // most templates just want plaintext...


var makeFormat = function makeFormat(str, fmt) {
  var s = parseSentence(str); //support various output formats

  if (fmt === 'json') {
    return s.json();
  } else if (fmt === 'raw') {
    return s;
  } //default to flat text


  return s.text();
}; //


var parser = function parser(tmpl, order, fmt) {
  order = order || []; //renomove {{}}'s

  tmpl = strip(tmpl || '');
  var arr = pipeSplitter(tmpl); //get template name

  var name = arr.shift(); //name each value

  var obj = keyMaker(arr, order); //remove wiki-junk

  obj = cleanup(obj); //is this a infobox/reference?
  // let known = isKnown(obj);
  //using '|1=content' is an escaping-thing..

  if (obj['1'] && order[0] && obj.hasOwnProperty(order[0]) === false) {
    //move it over..
    obj[order[0]] = obj['1'];
    delete obj['1'];
  }

  Object.keys(obj).forEach(function (k) {
    if (k === 'list') {
      obj[k] = obj[k].map(function (v) {
        return makeFormat(v, fmt);
      });
      return;
    }

    obj[k] = makeFormat(obj[k], fmt);
  }); //add the template name

  if (name) {
    obj.template = fmtName(name);
  }

  return obj;
};

module.exports = parser;

},{"../../04-sentence":58,"./01-pipe-splitter":100,"./02-keyMaker":101,"./03-cleanup":102,"./_fmtName":103,"./_strip":105}],107:[function(_dereq_,module,exports){
"use strict";

//this is allowed to be rough
var day = 1000 * 60 * 60 * 24;
var month = day * 30;
var year = day * 365;

var getEpoch = function getEpoch(obj) {
  return new Date("".concat(obj.year, "-").concat(obj.month || 0, "-").concat(obj.date || 1)).getTime();
}; //very rough!


var delta = function delta(from, to) {
  from = getEpoch(from);
  to = getEpoch(to);
  var diff = to - from;
  var obj = {}; //get years

  var years = Math.floor(diff / year, 10);

  if (years > 0) {
    obj.years = years;
    diff -= obj.years * year;
  } //get months


  var months = Math.floor(diff / month, 10);

  if (months > 0) {
    obj.months = months;
    diff -= obj.months * month;
  } //get days


  var days = Math.floor(diff / day, 10);

  if (days > 0) {
    obj.days = days; // diff -= (obj.days * day);
  }

  return obj;
};

module.exports = delta;

},{}],108:[function(_dereq_,module,exports){
"use strict";

//assorted parsing methods for date/time templates
var months = _dereq_('./_months');

var monthName = months.reduce(function (h, str, i) {
  if (i === 0) {
    return h;
  }

  h[str.toLowerCase()] = i;
  return h;
}, {}); //parse year|month|date numbers

var ymd = function ymd(arr) {
  var obj = {};
  var units = ['year', 'month', 'date', 'hour', 'minute', 'second']; //parse each unit in sequence..

  for (var i = 0; i < units.length; i += 1) {
    //skip it
    if (!arr[i] && arr[1] !== 0) {
      continue;
    }

    var num = parseInt(arr[i], 10);

    if (isNaN(num) === false) {
      obj[units[i]] = num; //we good.
    } else if (units[i] === 'month' && monthName.hasOwnProperty(arr[i])) {
      //try for month-name, like 'january
      var month = monthName[arr[i]];
      obj[units[i]] = month;
    } else {
      //we dead. so skip this unit
      delete obj[units[i]];
    }
  } //try for timezone,too ftw


  var last = arr[arr.length - 1] || '';
  last = String(last);

  if (last.toLowerCase() === 'z') {
    obj.tz = 'UTC';
  } else if (/[+-][0-9]+:[0-9]/.test(last)) {
    obj.tz = arr[6];
  }

  return obj;
}; //zero-pad a number


var pad = function pad(num) {
  if (num < 10) {
    return '0' + num;
  }

  return String(num);
};

var toText = function toText(date) {
  //eg '1995'
  var str = String(date.year || '');

  if (date.month !== undefined && months.hasOwnProperty(date.month) === true) {
    if (date.date === undefined) {
      //January 1995
      str = "".concat(months[date.month], " ").concat(date.year);
    } else {
      //January 5, 1995
      str = "".concat(months[date.month], " ").concat(date.date, ", ").concat(date.year); //add times, if available

      if (date.hour !== undefined && date.minute !== undefined) {
        var time = "".concat(pad(date.hour), ":").concat(pad(date.minute));

        if (date.second !== undefined) {
          time = time + ':' + pad(date.second);
        }

        str = time + ', ' + str; //add timezone, if there, at the end in brackets
      }

      if (date.tz) {
        str += " (".concat(date.tz, ")");
      }
    }
  }

  return str;
};

module.exports = {
  toText: toText,
  ymd: ymd
}; // console.log(toText(ymd([2018, 3, 28])));

},{"./_months":109}],109:[function(_dereq_,module,exports){
"use strict";

module.exports = [undefined, //1-based months.. :/
'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

},{}],110:[function(_dereq_,module,exports){
"use strict";

//not all too fancy - used in {{timesince}}
var timeSince = function timeSince(str) {
  var d = new Date(str);

  if (isNaN(d.getTime())) {
    return '';
  }

  var now = new Date();
  var delta = now.getTime() - d.getTime();
  var predicate = 'ago';

  if (delta < 0) {
    predicate = 'from now';
    delta = Math.abs(delta);
  } //figure out units


  var hours = delta / 1000 / 60 / 60;
  var days = hours / 24;

  if (days < 365) {
    return parseInt(days, 10) + ' days ' + predicate;
  }

  var years = days / 365;
  return parseInt(years, 10) + ' years ' + predicate;
};

module.exports = timeSince;

},{}],111:[function(_dereq_,module,exports){
"use strict";

var misc = _dereq_('./misc');

var parsers = _dereq_('./parsers');

var parse = _dereq_('../_parsers/parse');

var timeSince = _dereq_('./_timeSince');

var format = _dereq_('./_format');

var date = parsers.date;
var natural_date = parsers.natural_date;
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; //date- templates we support

var dateTmpl = Object.assign({}, misc, {
  currentday: function currentday() {
    var d = new Date();
    return String(d.getDate());
  },
  currentdayname: function currentdayname() {
    var d = new Date();
    return days[d.getDay()];
  },
  currentmonth: function currentmonth() {
    var d = new Date();
    return months[d.getMonth()];
  },
  currentyear: function currentyear() {
    var d = new Date();
    return String(d.getFullYear());
  },
  monthyear: function monthyear() {
    var d = new Date();
    return months[d.getMonth()] + ' ' + d.getFullYear();
  },
  'monthyear-1': function monthyear1() {
    var d = new Date();
    d.setMonth(d.getMonth() - 1);
    return months[d.getMonth()] + ' ' + d.getFullYear();
  },
  'monthyear+1': function monthyear1() {
    var d = new Date();
    d.setMonth(d.getMonth() + 1);
    return months[d.getMonth()] + ' ' + d.getFullYear();
  },
  //Explictly-set dates - https://en.wikipedia.org/wiki/Template:Date
  date: function date(tmpl) {
    var order = ['date', 'fmt'];
    return parse(tmpl, order).date;
  },
  'time ago': function timeAgo(tmpl) {
    var order = ['date', 'fmt'];
    var time = parse(tmpl, order).date;
    return timeSince(time);
  },
  //https://en.wikipedia.org/wiki/Template:Birth_date_and_age
  'birth date and age': function birthDateAndAge(tmpl, r) {
    var order = ['year', 'month', 'day'];
    var obj = parse(tmpl, order); //support 'one property' version

    if (obj.year && /[a-z]/i.test(obj.year)) {
      return natural_date(tmpl, r);
    }

    r.templates.push(obj);
    obj = format.ymd([obj.year, obj.month, obj.day]);
    return format.toText(obj);
  },
  'birth year and age': function birthYearAndAge(tmpl, r) {
    var order = ['birth_year', 'birth_month'];
    var obj = parse(tmpl, order); //support 'one property' version

    if (obj.death_year && /[a-z]/i.test(obj.death_year)) {
      return natural_date(tmpl, r);
    }

    r.templates.push(obj);
    var age = new Date().getFullYear() - parseInt(obj.birth_year, 10);
    obj = format.ymd([obj.birth_year, obj.birth_month]);
    var str = format.toText(obj);

    if (age) {
      str += " (age ".concat(age, ")");
    }

    return str;
  },
  'death year and age': function deathYearAndAge(tmpl, r) {
    var order = ['death_year', 'birth_year', 'death_month'];
    var obj = parse(tmpl, order); //support 'one property' version

    if (obj.death_year && /[a-z]/i.test(obj.death_year)) {
      return natural_date(tmpl, r);
    }

    r.templates.push(obj);
    obj = format.ymd([obj.death_year, obj.death_month]);
    return format.toText(obj);
  },
  //https://en.wikipedia.org/wiki/Template:Birth_date_and_age2
  'birth date and age2': function birthDateAndAge2(tmpl, r) {
    var order = ['at_year', 'at_month', 'at_day', 'birth_year', 'birth_month', 'birth_day'];
    var obj = parse(tmpl, order);
    r.templates.push(obj);
    obj = format.ymd([obj.birth_year, obj.birth_month, obj.birth_day]);
    return format.toText(obj);
  },
  //https://en.wikipedia.org/wiki/Template:Birth_based_on_age_as_of_date
  'birth based on age as of date': function birthBasedOnAgeAsOfDate(tmpl, r) {
    var order = ['age', 'year', 'month', 'day'];
    var obj = parse(tmpl, order);
    r.templates.push(obj);
    var age = parseInt(obj.age, 10);
    var year = parseInt(obj.year, 10);
    var born = year - age;

    if (born && age) {
      return "".concat(born, " (age ").concat(obj.age, ")");
    }

    return "(age ".concat(obj.age, ")");
  },
  //https://en.wikipedia.org/wiki/Template:Death_date_and_given_age
  'death date and given age': function deathDateAndGivenAge(tmpl, r) {
    var order = ['year', 'month', 'day', 'age'];
    var obj = parse(tmpl, order);
    r.templates.push(obj);
    obj = format.ymd([obj.year, obj.month, obj.day]);
    var str = format.toText(obj);

    if (obj.age) {
      str += " (age ".concat(obj.age, ")");
    }

    return str;
  },
  //sortable dates -
  dts: function dts(tmpl) {
    //remove formatting stuff, ewww
    tmpl = tmpl.replace(/\|format=[ymd]+/i, '');
    tmpl = tmpl.replace(/\|abbr=(on|off)/i, '');
    var order = ['year', 'month', 'date', 'bc'];
    var obj = parse(tmpl, order);

    if (obj.date && obj.month && obj.year) {
      //render 'june 5 2018'
      if (/[a-z]/.test(obj.month) === true) {
        return [obj.month, obj.date, obj.year].join(' ');
      }

      return [obj.year, obj.month, obj.date].join('-');
    }

    if (obj.month && obj.year) {
      return [obj.year, obj.month].join('-');
    }

    if (obj.year) {
      if (obj.year < 0) {
        obj.year = Math.abs(obj.year) + ' BC';
      }

      return obj.year;
    }

    return '';
  },
  //date/age/time templates
  'start': date,
  'end': date,
  'birth': date,
  'death': date,
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
  'birthdeathage': parsers.two_dates,
  'dob': date,
  // 'birth date and age2': date,
  'age': parsers.age,
  'age nts': parsers.age,
  'age in years': parsers['diff-y'],
  'age in years and months': parsers['diff-ym'],
  'age in years, months and days': parsers['diff-ymd'],
  'age in years and days': parsers['diff-yd'],
  'age in days': parsers['diff-d'] // 'age in years, months, weeks and days': true,
  // 'age as of date': true,

}); //aliases

dateTmpl.localday = dateTmpl.currentday;
dateTmpl.localdayname = dateTmpl.currentdayname;
dateTmpl.localmonth = dateTmpl.currentmonth;
dateTmpl.localyear = dateTmpl.currentyear;
dateTmpl.currentmonthname = dateTmpl.currentmonth;
dateTmpl.currentmonthabbrev = dateTmpl.currentmonth;
dateTmpl['death date and age'] = dateTmpl['birth date and age'];
dateTmpl.bda = dateTmpl['birth date and age'];
dateTmpl['birth date based on age at death'] = dateTmpl['birth based on age as of date'];
module.exports = dateTmpl;

},{"../_parsers/parse":106,"./_format":108,"./_timeSince":110,"./misc":112,"./parsers":113}],112:[function(_dereq_,module,exports){
"use strict";

var format = _dereq_('./_format');

var months = _dereq_('./_months');

var parse = _dereq_('../_parsers/parse');

var misc = {
  'reign': function reign(tmpl) {
    var order = ['start', 'end'];
    var obj = parse(tmpl, order);
    return "(r. ".concat(obj.start, " \u2013 ").concat(obj.end, ")");
  },
  'circa': function circa(tmpl) {
    var obj = parse(tmpl, ['year']);
    return "c.\u2009".concat(obj.year);
  },
  //we can't do timezones, so fake this one a little bit
  //https://en.wikipedia.org/wiki/Template:Time
  'time': function time() {
    var d = new Date();
    var obj = format.ymd([d.getFullYear(), d.getMonth(), d.getDate()]);
    return format.toText(obj);
  },
  'monthname': function monthname(tmpl) {
    var obj = parse(tmpl, ['num']);
    return months[obj.num] || '';
  },
  //https://en.wikipedia.org/wiki/Template:OldStyleDate
  oldstyledate: function oldstyledate(tmpl) {
    var order = ['date', 'year'];
    var obj = parse(tmpl, order);
    var str = obj.date;

    if (obj.year) {
      str += ' ' + obj.year;
    }

    return str;
  }
};
module.exports = misc;

},{"../_parsers/parse":106,"./_format":108,"./_months":109}],113:[function(_dereq_,module,exports){
"use strict";

var strip = _dereq_('../_parsers/_strip');

var parse = _dereq_('../_parsers/parse');

var delta = _dereq_('./_delta');

var fmt = _dereq_('./_format');

var ymd = fmt.ymd;
var toText = fmt.toText; //wrap it up as a template

var template = function template(date) {
  return {
    template: 'date',
    data: date
  };
};

var getBoth = function getBoth(tmpl) {
  tmpl = strip(tmpl);
  var arr = tmpl.split('|');
  var from = ymd(arr.slice(1, 4));
  var to = arr.slice(4, 7); //assume now, if 'to' is empty

  if (to.length === 0) {
    var d = new Date();
    to = [d.getFullYear(), d.getMonth(), d.getDate()];
  }

  to = ymd(to);
  return {
    from: from,
    to: to
  };
};

var parsers = {
  //generic {{date|year|month|date}} template
  date: function date(tmpl, r) {
    var order = ['year', 'month', 'date', 'hour', 'minute', 'second', 'timezone'];
    var obj = parse(tmpl, order);
    var data = ymd([obj.year, obj.month, obj.date || obj.day]);
    obj.text = toText(data); //make the replacement string

    if (obj.timezone) {
      if (obj.timezone === 'Z') {
        obj.timezone = 'UTC';
      }

      obj.text += " (".concat(obj.timezone, ")");
    }

    if (obj.hour && obj.minute) {
      if (obj.second) {
        obj.text = "".concat(obj.hour, ":").concat(obj.minute, ":").concat(obj.second, ", ") + obj.text;
      } else {
        obj.text = "".concat(obj.hour, ":").concat(obj.minute, ", ") + obj.text;
      }
    }

    if (obj.text) {
      r.templates.push(template(obj));
    }

    return obj.text;
  },
  //support parsing of 'February 10, 1992'
  natural_date: function natural_date(tmpl, r) {
    var order = ['text'];
    var obj = parse(tmpl, order);
    var str = obj.text || ''; // - just a year

    var date = {};

    if (/^[0-9]{4}$/.test(str)) {
      date.year = parseInt(str, 10);
    } else {
      //parse the date, using the js date object (for now?)
      var txt = str.replace(/[a-z]+\/[a-z]+/i, '');
      txt = txt.replace(/[0-9]+:[0-9]+(am|pm)?/i, '');
      var d = new Date(txt);

      if (isNaN(d.getTime()) === false) {
        date.year = d.getFullYear();
        date.month = d.getMonth() + 1;
        date.date = d.getDate();
      }
    }

    r.templates.push(template(date));
    return str.trim();
  },
  //just grab the first value, and assume it's a year
  one_year: function one_year(tmpl, r) {
    var order = ['year'];
    var obj = parse(tmpl, order);
    var year = Number(obj.year);
    r.templates.push(template({
      year: year
    }));
    return String(year);
  },
  //assume 'y|m|d' | 'y|m|d' // {{BirthDeathAge|B|1976|6|6|1990|8|8}}
  two_dates: function two_dates(tmpl, r) {
    var order = ['b', 'birth_year', 'birth_month', 'birth_date', 'death_year', 'death_month', 'death_date'];
    var obj = parse(tmpl, order); //'b' means show birth-date, otherwise show death-date

    if (obj.b && obj.b.toLowerCase() === 'b') {
      var _date = ymd([obj.birth_year, obj.birth_month, obj.birth_date]);

      r.templates.push(template(_date));
      return toText(_date);
    }

    var date = ymd([obj.death_year, obj.death_month, obj.death_date]);
    r.templates.push(template(date));
    return toText(date);
  },
  'age': function age(tmpl) {
    var d = getBoth(tmpl);
    var diff = delta(d.from, d.to);
    return diff.years || 0;
  },
  'diff-y': function diffY(tmpl) {
    var d = getBoth(tmpl);
    var diff = delta(d.from, d.to);

    if (diff.years === 1) {
      return diff.years + ' year';
    }

    return (diff.years || 0) + ' years';
  },
  'diff-ym': function diffYm(tmpl) {
    var d = getBoth(tmpl);
    var diff = delta(d.from, d.to);
    var arr = [];

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

    return arr.join(', ');
  },
  'diff-ymd': function diffYmd(tmpl) {
    var d = getBoth(tmpl);
    var diff = delta(d.from, d.to);
    var arr = [];

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

    return arr.join(', ');
  },
  'diff-yd': function diffYd(tmpl) {
    var d = getBoth(tmpl);
    var diff = delta(d.from, d.to);
    var arr = [];

    if (diff.years === 1) {
      arr.push(diff.years + ' year');
    } else if (diff.years && diff.years !== 0) {
      arr.push(diff.years + ' years');
    } //ergh...


    diff.days += (diff.months || 0) * 30;

    if (diff.days === 1) {
      arr.push('1 day');
    } else if (diff.days && diff.days !== 0) {
      arr.push(diff.days + ' days');
    }

    return arr.join(', ');
  },
  'diff-d': function diffD(tmpl) {
    var d = getBoth(tmpl);
    var diff = delta(d.from, d.to);
    var arr = []; //ergh...

    diff.days += (diff.years || 0) * 365;
    diff.days += (diff.months || 0) * 30;

    if (diff.days === 1) {
      arr.push('1 day');
    } else if (diff.days && diff.days !== 0) {
      arr.push(diff.days + ' days');
    }

    return arr.join(', ');
  }
};
module.exports = parsers;

},{"../_parsers/_strip":105,"../_parsers/parse":106,"./_delta":107,"./_format":108}],114:[function(_dereq_,module,exports){
"use strict";

var parse = _dereq_('../_parsers/parse');

var templates = {
  //a convulated way to make a xml tag - https://en.wikipedia.org/wiki/Template:Tag
  tag: function tag(tmpl) {
    var obj = parse(tmpl, ['tag', 'open']);
    var ignore = {
      span: true,
      div: true,
      p: true
    }; //pair, empty, close, single

    if (!obj.open || obj.open === 'pair') {
      //just skip generating spans and things..
      if (ignore[obj.tag]) {
        return obj.content || '';
      }

      return "<".concat(obj.tag, " ").concat(obj.attribs || '', ">").concat(obj.content || '', "</").concat(obj.tag, ">");
    }

    return '';
  },
  //dumb inflector - https://en.wikipedia.org/wiki/Template:Plural
  plural: function plural(tmpl) {
    tmpl = tmpl.replace(/plural:/, 'plural|');
    var order = ['num', 'word'];
    var obj = parse(tmpl, order);
    var num = Number(obj.num);
    var word = obj.word;

    if (num !== 1) {
      if (/.y$/.test(word)) {
        word = word.replace(/y$/, 'ies');
      } else {
        word += 's';
      }
    }

    return num + ' ' + word;
  },
  // https://en.wikipedia.org/wiki/Template:First_word
  'first word': function firstWord(tmpl) {
    var obj = parse(tmpl, ['text']);
    var str = obj.text;

    if (obj.sep) {
      return str.split(obj.sep)[0];
    }

    return str.split(' ')[0];
  },
  'trunc': function trunc(tmpl) {
    var order = ['str', 'len'];
    var obj = parse(tmpl, order);
    return obj.str.substr(0, obj.len);
  },
  'str mid': function strMid(tmpl) {
    var order = ['str', 'start', 'end'];
    var obj = parse(tmpl, order);
    var start = parseInt(obj.start, 10) - 1;
    var end = parseInt(obj.end, 10);
    return obj.str.substr(start, end);
  },
  //grab the first, second or third pipe
  'p1': function p1(tmpl) {
    var order = ['one'];
    return parse(tmpl, order).one;
  },
  'p2': function p2(tmpl) {
    var order = ['one', 'two'];
    return parse(tmpl, order).two;
  },
  'p3': function p3(tmpl) {
    var order = ['one', 'two', 'three'];
    return parse(tmpl, order).three;
  },
  //formatting things - https://en.wikipedia.org/wiki/Template:Nobold
  braces: function braces(tmpl) {
    var obj = parse(tmpl, ['text']);
    var attrs = '';

    if (obj.list) {
      attrs = '|' + obj.list.join('|');
    }

    return '{{' + (obj.text || '') + attrs + '}}';
  },
  nobold: function nobold(tmpl) {
    return parse(tmpl, ['text']).text || '';
  },
  noitalic: function noitalic(tmpl) {
    return parse(tmpl, ['text']).text || '';
  },
  nocaps: function nocaps(tmpl) {
    return parse(tmpl, ['text']).text || '';
  },
  //https://en.wikipedia.org/wiki/Template:Visible_anchor
  vanchor: function vanchor(tmpl) {
    return parse(tmpl, ['text']).text || '';
  },
  //https://en.wikipedia.org/wiki/Template:Resize
  resize: function resize(tmpl) {
    return parse(tmpl, ['size', 'text']).text || '';
  },
  //https://en.wikipedia.org/wiki/Template:Ra
  ra: function ra(tmpl) {
    var obj = parse(tmpl, ['hours', 'minutes', 'seconds']);
    return [obj.hours || 0, obj.minutes || 0, obj.seconds || 0].join(':');
  },
  //https://en.wikipedia.org/wiki/Template:Deg2HMS
  deg2hms: function deg2hms(tmpl) {
    //this template should do the conversion
    var obj = parse(tmpl, ['degrees']);
    return (obj.degrees || '') + '°';
  },
  hms2deg: function hms2deg(tmpl) {
    //this template should do the conversion too
    var obj = parse(tmpl, ['hours', 'minutes', 'seconds']);
    return [obj.hours || 0, obj.minutes || 0, obj.seconds || 0].join(':');
  },
  decdeg: function decdeg(tmpl) {
    //this template should do the conversion too
    var obj = parse(tmpl, ['deg', 'min', 'sec', 'hem', 'rnd']);
    return (obj.deg || obj.degrees) + '°';
  },
  rnd: function rnd(tmpl) {
    //this template should do the conversion too
    var obj = parse(tmpl, ['decimal']);
    return obj.decimal || '';
  },
  //https://en.wikipedia.org/wiki/Template:DEC
  dec: function dec(tmpl) {
    var obj = parse(tmpl, ['degrees', 'minutes', 'seconds']);
    var str = (obj.degrees || 0) + '°';

    if (obj.minutes) {
      str += obj.minutes + "\u2032";
    }

    if (obj.seconds) {
      str += obj.seconds + '″';
    }

    return str;
  },
  //https://en.wikipedia.org/wiki/Template:Val
  val: function val(tmpl) {
    var obj = parse(tmpl, ['number', 'uncertainty']);
    var str = obj.number || ''; //prefix/suffix

    if (obj.p) {
      str = obj.p + str;
    }

    if (obj.s) {
      str = obj.s + str;
    } //add units, too


    if (obj.u || obj.ul || obj.upl) {
      str = str + ' ' + (obj.u || obj.ul || obj.upl);
    }

    return str;
  }
}; //aliases

templates['rndfrac'] = templates.rnd;
templates['rndnear'] = templates.rnd; //templates that we simply grab their insides as plaintext

var inline = ['nowrap', 'big', 'cquote', 'pull quote', 'small', 'smaller', 'midsize', 'larger', 'big', 'bigger', 'large', 'huge', 'delink'];
inline.forEach(function (k) {
  templates[k] = function (tmpl) {
    return parse(tmpl, ['text']).text || '';
  };
});
module.exports = templates;

},{"../_parsers/parse":106}],115:[function(_dereq_,module,exports){
"use strict";

module.exports = Object.assign({}, _dereq_('./format'), _dereq_('./lists'), _dereq_('./punctuation'), _dereq_('./misc'));

},{"./format":114,"./lists":116,"./misc":117,"./punctuation":118}],116:[function(_dereq_,module,exports){
"use strict";

var strip = _dereq_('../_parsers/_strip');

var parse = _dereq_('../_parsers/parse');

var tmpls = {
  //a strange, newline-based list - https://en.wikipedia.org/wiki/Template:Plainlist
  plainlist: function plainlist(tmpl) {
    tmpl = strip(tmpl); //remove the title

    var arr = tmpl.split('|');
    arr = arr.slice(1);
    tmpl = arr.join('|'); //split on newline

    arr = tmpl.split(/\n ?\* ?/);
    arr = arr.filter(function (s) {
      return s;
    });
    return arr.join('\n\n');
  },
  //show/hide: https://en.wikipedia.org/wiki/Template:Collapsible_list
  'collapsible list': function collapsibleList(tmpl, r) {
    var obj = parse(tmpl);
    r.templates.push(obj);
    var str = '';

    if (obj.title) {
      str += "'''".concat(obj.title, "'''") + '\n\n';
    }

    if (!obj.list) {
      obj.list = [];

      for (var i = 1; i < 10; i += 1) {
        if (obj[i]) {
          obj.list.push(obj[i]);
          delete obj[i];
        }
      }
    }

    obj.list = obj.list.filter(function (s) {
      return s;
    });
    str += obj.list.join('\n\n');
    return str;
  },
  // https://en.wikipedia.org/wiki/Template:Ordered_list
  'ordered list': function orderedList(tmpl, r) {
    var obj = parse(tmpl);
    r.templates.push(obj);
    obj.list = obj.list || [];
    var lines = obj.list.map(function (str, i) {
      return "".concat(i + 1, ". ").concat(str);
    });
    return lines.join('\n\n');
  },
  hlist: function hlist(tmpl) {
    var obj = parse(tmpl);
    obj.list = obj.list || [];
    return obj.list.join(' · ');
  },
  'pagelist': function pagelist(tmpl) {
    var arr = parse(tmpl).list || [];
    return arr.join(', ');
  },
  //actually rendering these links removes the text.
  //https://en.wikipedia.org/wiki/Template:Catlist
  'catlist': function catlist(tmpl) {
    var arr = parse(tmpl).list || [];
    return arr.join(', ');
  },
  //https://en.wikipedia.org/wiki/Template:Br_separated_entries
  'br separated entries': function brSeparatedEntries(tmpl) {
    var arr = parse(tmpl).list || [];
    return arr.join('\n\n');
  },
  'comma separated entries': function commaSeparatedEntries(tmpl) {
    var arr = parse(tmpl).list || [];
    return arr.join(', ');
  },
  //https://en.wikipedia.org/wiki/Template:Bare_anchored_list
  'anchored list': function anchoredList(tmpl) {
    var arr = parse(tmpl).list || [];
    arr = arr.map(function (str, i) {
      return "".concat(i + 1, ". ").concat(str);
    });
    return arr.join('\n\n');
  },
  'bulleted list': function bulletedList(tmpl) {
    var arr = parse(tmpl).list || [];
    arr = arr.filter(function (f) {
      return f;
    });
    arr = arr.map(function (str) {
      return '• ' + str;
    });
    return arr.join('\n\n');
  },
  //https://en.wikipedia.org/wiki/Template:Columns-list
  'columns-list': function columnsList(tmpl, r) {
    var arr = parse(tmpl).list || [];
    var str = arr[0] || '';
    var list = str.split(/\n/);
    list = list.filter(function (f) {
      return f;
    });
    list = list.map(function (s) {
      return s.replace(/\*/, '');
    });
    r.templates.push({
      template: 'columns-list',
      list: list
    });
    list = list.map(function (s) {
      return '• ' + s;
    });
    return list.join('\n\n');
  } // 'pagelist':(tmpl)=>{},

}; //aliases

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
module.exports = tmpls;

},{"../_parsers/_strip":105,"../_parsers/parse":106}],117:[function(_dereq_,module,exports){
"use strict";

var parse = _dereq_('../_parsers/parse');

var inline = {
  //https://en.wikipedia.org/wiki/Template:Convert#Ranges_of_values
  convert: function convert(tmpl) {
    var order = ['num', 'two', 'three', 'four'];
    var obj = parse(tmpl, order); //todo: support plural units

    if (obj.two === '-' || obj.two === 'to' || obj.two === 'and') {
      if (obj.four) {
        return "".concat(obj.num, " ").concat(obj.two, " ").concat(obj.three, " ").concat(obj.four);
      }

      return "".concat(obj.num, " ").concat(obj.two, " ").concat(obj.three);
    }

    return "".concat(obj.num, " ").concat(obj.two);
  },
  //https://en.wikipedia.org/wiki/Template:Term
  term: function term(tmpl) {
    var obj = parse(tmpl, ['term']);
    return "".concat(obj.term, ":");
  },
  defn: function defn(tmpl) {
    var obj = parse(tmpl, ['desc']);
    return obj.desc;
  },
  //https://en.wikipedia.org/wiki/Template:Linum
  lino: function lino(tmpl) {
    var obj = parse(tmpl, ['num']);
    return "".concat(obj.num);
  },
  linum: function linum(tmpl) {
    var obj = parse(tmpl, ['num', 'text']);
    return "".concat(obj.num, ". ").concat(obj.text);
  },
  //https://en.wikipedia.org/wiki/Template:Interlanguage_link
  ill: function ill(tmpl) {
    var order = ['text', 'lan1', 'text1', 'lan2', 'text2'];
    var obj = parse(tmpl, order);
    return obj.text;
  },
  //https://en.wikipedia.org/wiki/Template:Frac
  frac: function frac(tmpl) {
    var order = ['a', 'b', 'c'];
    var obj = parse(tmpl, order);

    if (obj.c) {
      return "".concat(obj.a, " ").concat(obj.b, "/").concat(obj.c);
    }

    if (obj.b) {
      return "".concat(obj.a, "/").concat(obj.b);
    }

    return "1/".concat(obj.b);
  },
  //https://en.wikipedia.org/wiki/Template:Height - {{height|ft=6|in=1}}
  height: function height(tmpl, r) {
    var obj = parse(tmpl);
    r.templates.push(obj);
    var result = [];
    var units = ['m', 'cm', 'ft', 'in']; //order matters

    units.forEach(function (unit) {
      if (obj.hasOwnProperty(unit) === true) {
        result.push(obj[unit] + unit);
      }
    });
    return result.join(' ');
  },
  'block indent': function blockIndent(tmpl) {
    var obj = parse(tmpl);

    if (obj['1']) {
      return '\n' + obj['1'] + '\n';
    }

    return '';
  },
  'quote': function quote(tmpl, r) {
    var order = ['text', 'author'];
    var obj = parse(tmpl, order);
    r.templates.push(obj); //create plaintext version

    if (obj.text) {
      var str = "\"".concat(obj.text, "\"");

      if (obj.author) {
        str += '\n\n';
        str += "    - ".concat(obj.author);
      }

      return str + '\n';
    }

    return '';
  },
  //https://en.wikipedia.org/wiki/Template:Lbs
  lbs: function lbs(tmpl) {
    var obj = parse(tmpl, ['text']);
    return "[[".concat(obj.text, " Lifeboat Station|").concat(obj.text, "]]");
  },
  //Foo-class
  lbc: function lbc(tmpl) {
    var obj = parse(tmpl, ['text']);
    return "[[".concat(obj.text, "-class lifeboat|").concat(obj.text, "-class]]");
  },
  lbb: function lbb(tmpl) {
    var obj = parse(tmpl, ['text']);
    return "[[".concat(obj.text, "-class lifeboat|").concat(obj.text, "]]");
  },
  // https://en.wikipedia.org/wiki/Template:Own
  own: function own(tmpl) {
    var obj = parse(tmpl, ['author']);
    var str = 'Own work';

    if (obj.author) {
      str += ' by ' + obj.author;
    }

    return str;
  },
  //https://en.wikipedia.org/wiki/Template:Sic
  sic: function sic(tmpl, r) {
    var obj = parse(tmpl, ['one', 'two', 'three']);
    var word = (obj.one || '') + (obj.two || ''); //support '[sic?]'

    if (obj.one === '?') {
      word = (obj.two || '') + (obj.three || '');
    }

    r.templates.push({
      template: 'sic',
      word: word
    });

    if (obj.nolink === 'y') {
      return word;
    }

    return "".concat(word, " [sic]");
  },
  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  formatnum: function formatnum() {
    var tmpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    tmpl = tmpl.replace(/:/, '|');
    var obj = parse(tmpl, ['number']);
    var str = obj.number || '';
    str = str.replace(/,/g, '');
    var num = Number(str);
    return num.toLocaleString() || '';
  },
  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  '#dateformat': function dateformat() {
    var tmpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    tmpl = tmpl.replace(/:/, '|');
    var obj = parse(tmpl, ['date', 'format']);
    return obj.date;
  },
  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  'lc': function lc() {
    var tmpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    tmpl = tmpl.replace(/:/, '|');
    var obj = parse(tmpl, ['text']);
    return (obj.text || '').toLowerCase();
  },
  'lcfirst': function lcfirst() {
    var tmpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    tmpl = tmpl.replace(/:/, '|');
    var obj = parse(tmpl, ['text']);
    var text = obj.text;

    if (!text) {
      return '';
    }

    return text[0].toLowerCase() + text.substr(1);
  },
  //https://www.mediawiki.org/wiki/Help:Magic_words#Formatting
  'uc': function uc() {
    var tmpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    tmpl = tmpl.replace(/:/, '|');
    var obj = parse(tmpl, ['text']);
    return (obj.text || '').toUpperCase();
  },
  'ucfirst': function ucfirst() {
    var tmpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    tmpl = tmpl.replace(/:/, '|');
    var obj = parse(tmpl, ['text']);
    var text = obj.text;

    if (!text) {
      return '';
    }

    return text[0].toUpperCase() + text.substr(1);
  },
  'padleft': function padleft() {
    var tmpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    tmpl = tmpl.replace(/:/, '|');
    var obj = parse(tmpl, ['text', 'num']);
    var text = obj.text || '';
    return text.padStart(obj.num, obj.str || '0');
  },
  'padright': function padright() {
    var tmpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    tmpl = tmpl.replace(/:/, '|');
    var obj = parse(tmpl, ['text', 'num']);
    var text = obj.text || '';
    return text.padEnd(obj.num, obj.str || '0');
  },
  //abbreviation/meaning
  //https://en.wikipedia.org/wiki/Template:Abbr
  'abbr': function abbr() {
    var tmpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var obj = parse(tmpl, ['abbr', 'meaning', 'ipa']);
    return obj.abbr;
  },
  //https://en.wikipedia.org/wiki/Template:Abbrlink
  'abbrlink': function abbrlink() {
    var tmpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var obj = parse(tmpl, ['abbr', 'page']);

    if (obj.page) {
      return "[[".concat(obj.page, "|").concat(obj.abbr, "]]");
    }

    return "[[".concat(obj.abbr, "]]");
  },
  //https://en.wikipedia.org/wiki/Template:Hover_title
  //technically 'h:title'
  'h': function h() {
    var tmpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var obj = parse(tmpl, ['title', 'text']);
    return obj.text;
  },
  //https://en.wikipedia.org/wiki/Template:Finedetail
  'finedetail': function finedetail() {
    var tmpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var obj = parse(tmpl, ['text', 'detail']); //technically references

    return obj.text;
  }
}; //aliases

inline['str left'] = inline.trunc;
inline['str crop'] = inline.trunc;
inline['tooltip'] = inline.abbr;
inline['abbrv'] = inline.abbr;
inline['define'] = inline.abbr;
module.exports = inline;

},{"../_parsers/parse":106}],118:[function(_dereq_,module,exports){
"use strict";

// okay, these just hurts my feelings
// https://www.mediawiki.org/wiki/Help:Magic_words#Other
var punctuation = [// https://en.wikipedia.org/wiki/Template:%C2%B7
['·', '·'], ['·', '·'], ['dot', '·'], ['middot', '·'], ['•', ' • '], //yup, oxford comma template
[',', ','], ['1/2', '1⁄2'], ['1/3', '1⁄3'], ['2/3', '2⁄3'], ['1/4', '1⁄4'], ['3/4', '3⁄4'], ['–', '–'], ['ndash', '–'], ['en dash', '–'], ['spaced ndash', ' – '], ['—', '—'], ['mdash', '—'], ['em dash', '—'], ['number sign', '#'], ['ibeam', 'I'], ['&', '&'], [';', ';'], ['ampersand', '&'], ['snds', ' – '], // these '{{^}}' things are nuts, and used as some ilicit spacing thing.
['^', ' '], ['!', '|'], ['\\', ' /'], ['`', '`'], ['=', '='], ['bracket', '['], ['[', '['], ['*', '*'], ['asterisk', '*'], ['long dash', '———'], ['clear', '\n\n'], ['h.', 'ḥ']];
var templates = {};
punctuation.forEach(function (a) {
  templates[a[0]] = function () {
    return a[1];
  };
});
module.exports = templates;

},{}],119:[function(_dereq_,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var convertDMS = _dereq_('./dms-format');

var parse = _dereq_('../_parsers/parse');

var round = function round(num) {
  if (typeof num !== 'number') {
    return num;
  }

  var places = 100000;
  return Math.round(num * places) / places;
}; //these hemispheres mean negative decimals


var negative = {
  s: true,
  w: true
};

var findLatLng = function findLatLng(arr) {
  var types = arr.map(function (s) {
    return _typeof(s);
  }).join('|'); //support {{lat|lng}}

  if (arr.length === 2 && types === 'number|number') {
    return {
      lat: arr[0],
      lon: arr[1]
    };
  } //support {{dd|N/S|dd|E/W}}


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
    };
  } //support {{dd|mm|N/S|dd|mm|E/W}}


  if (arr.length === 6) {
    return {
      lat: convertDMS(arr.slice(0, 3)),
      lon: convertDMS(arr.slice(3))
    };
  } //support {{dd|mm|ss|N/S|dd|mm|ss|E/W}}


  if (arr.length === 8) {
    return {
      lat: convertDMS(arr.slice(0, 4)),
      lon: convertDMS(arr.slice(4))
    };
  }

  return {};
};

var parseParams = function parseParams(obj) {
  obj.list = obj.list || [];
  obj.list = obj.list.map(function (str) {
    var num = Number(str);

    if (!isNaN(num)) {
      return num;
    } //these are weird


    var split = str.split(/:/);

    if (split.length > 1) {
      obj.props = obj.props || {};
      obj.props[split[0]] = split.slice(1).join(':');
      return null;
    }

    return str;
  });
  obj.list = obj.list.filter(function (s) {
    return s !== null;
  });
  return obj;
};

var parseCoor = function parseCoor(tmpl) {
  var obj = parse(tmpl);
  obj = parseParams(obj);
  var tmp = findLatLng(obj.list);
  obj.lat = round(tmp.lat);
  obj.lon = round(tmp.lon);
  obj.template = 'coord';
  delete obj.list;
  return obj;
};

module.exports = parseCoor; // {{Coor title dms|dd|mm|ss|N/S|dd|mm|ss|E/W|template parameters}}
// {{Coor title dec|latitude|longitude|template parameters}}
// {{Coor dms|dd|mm|ss|N/S|dd|mm|ss|E/W|template parameters}}
// {{Coor dm|dd|mm|N/S|dd|mm|E/W|template parameters}}
// {{Coor dec|latitude|longitude|template parameters}}
// {{coord|latitude|longitude|coordinate parameters|template parameters}}
// {{coord|dd|N/S|dd|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|N/S|dd|mm|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|ss|N/S|dd|mm|ss|E/W|coordinate parameters|template parameters}}

},{"../_parsers/parse":106,"./dms-format":120}],120:[function(_dereq_,module,exports){
"use strict";

//converts DMS (decimal-minute-second) geo format to lat/lng format.
//major thank you to https://github.com/gmaclennan/parse-dms
//and https://github.com/WSDOT-GIS/dms-js 👏
//accepts an array of descending Degree, Minute, Second values, with a hemisphere at the end
//must have N/S/E/W as last thing
function parseDms(arr) {
  var hemisphere = arr.pop();
  var degrees = Number(arr[0] || 0);
  var minutes = Number(arr[1] || 0);
  var seconds = Number(arr[2] || 0);

  if (typeof hemisphere !== 'string' || isNaN(degrees)) {
    return null;
  }

  var sign = 1;

  if (/[SW]/i.test(hemisphere)) {
    sign = -1;
  }

  var decDeg = sign * (degrees + minutes / 60 + seconds / 3600);
  return decDeg;
}

module.exports = parseDms; // console.log(parseDms([57, 18, 22, 'N']));
// console.log(parseDms([4, 27, 32, 'W']));

},{}],121:[function(_dereq_,module,exports){
"use strict";

var parseCoor = _dereq_('./coor');

var templates = {
  coord: function coord(tmpl, r) {
    var obj = parseCoor(tmpl);
    r.templates.push(obj); //display inline, by default

    if (!obj.display || obj.display.indexOf('inline') !== -1) {
      return "".concat(obj.lat || '', "\xB0N, ").concat(obj.lon || '', "\xB0W");
    }

    return '';
  }
}; // {{coord|latitude|longitude|coordinate parameters|template parameters}}
// {{coord|dd|N/S|dd|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|N/S|dd|mm|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|ss|N/S|dd|mm|ss|E/W|coordinate parameters|template parameters}}

templates['coor'] = templates.coord; // these are from the nl wiki

templates['coor title dms'] = templates.coord;
templates['coor title dec'] = templates.coord;
templates['coor dms'] = templates.coord;
templates['coor dm'] = templates.coord;
templates['coor dec'] = templates.coord;
module.exports = templates;

},{"./coor":119}],122:[function(_dereq_,module,exports){
"use strict";

var parse = _dereq_('../_parsers/parse'); //this format seems to be a pattern for these


var generic = function generic(tmpl, r) {
  var obj = parse(tmpl, ['id', 'title', 'description', 'section']);
  r.templates.push(obj);
  return '';
};

var idName = function idName(tmpl, r) {
  var obj = parse(tmpl, ['id', 'name']);
  r.templates.push(obj);
  return '';
}; //https://en.wikipedia.org/wiki/Category:External_link_templates


var externals = {
  //https://en.wikipedia.org/wiki/Template:IMDb_title
  'imdb title': generic,
  'imdb name': generic,
  'imdb episode': generic,
  'imdb event': generic,
  'afi film': generic,
  'allmovie title': generic,
  'allgame': generic,
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
  'youtube': generic,
  'goodreads author': idName,
  'goodreads book': generic,
  'twitter': idName,
  'facebook': idName,
  'instagram': idName,
  'tumblr': idName,
  'pinterest': idName,
  'espn nfl': idName,
  'espn nhl': idName,
  'espn fc': idName,
  'hockeydb': idName,
  'fifa player': idName,
  'worldcat': idName,
  'worldcat id': idName,
  'nfl player': idName,
  'ted speaker': idName,
  'playmate': idName,
  //https://en.wikipedia.org/wiki/Template:DMOZ
  dmoz: generic,
  'find a grave': function findAGrave(tmpl, r) {
    var order = ['id', 'name', 'work', 'last', 'first', 'date', 'accessdate'];
    var obj = parse(tmpl, order);
    r.templates.push(obj);
    return '';
  },
  'congbio': function congbio(tmpl, r) {
    var order = ['id', 'name', 'date'];
    var obj = parse(tmpl, order);
    r.templates.push(obj);
    return '';
  },
  'hollywood walk of fame': function hollywoodWalkOfFame(tmpl, r) {
    var order = ['name'];
    var obj = parse(tmpl, order);
    r.templates.push(obj);
    return '';
  }
}; //alias

externals.imdb = externals['imdb name'];
externals['imdb episodess'] = externals['imdb episode'];
module.exports = externals;

},{"../_parsers/parse":106}],123:[function(_dereq_,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var Infobox = _dereq_('../infobox/Infobox');

var Reference = _dereq_('../02-section/reference/Reference');

var getTemplates = _dereq_('./_getTemplates');

var parseTemplate = _dereq_('./parse');

var isCitation = new RegExp('^(cite |citation)', 'i');
var citations = {
  citation: true,
  refn: true,
  harvnb: true
}; //ensure references and infoboxes at least look valid

var isObject = function isObject(x) {
  return _typeof(x) === 'object' && x !== null && x.constructor.toString().indexOf('Array') === -1;
}; //reduce the scary recursive situations


var parseTemplates = function parseTemplates(wiki, data, options) {
  var templates = getTemplates(wiki); //first, do the nested (second level) ones

  templates.nested.forEach(function (tmpl) {
    wiki = parseTemplate(tmpl, wiki, data, options);
  }); //then, reparse wiki for the top-level ones

  templates = getTemplates(wiki); //okay if we have a 3-level-deep template, do it again (but no further)

  if (templates.nested.length > 0) {
    templates.nested.forEach(function (tmpl) {
      wiki = parseTemplate(tmpl, wiki, data, options);
    });
    templates = getTemplates(wiki); //this is getting crazy.
  } //okay, top-level


  templates.top.forEach(function (tmpl) {
    wiki = parseTemplate(tmpl, wiki, data, options);
  }); //lastly, move citations + infoboxes out of our templates list

  var clean = [];
  data.templates.forEach(function (o) {
    //it's possible that we've parsed a reference, that we missed earlier
    if (citations[o.template] === true || isCitation.test(o.template) === true) {
      data.references = data.references || [];
      data.references.push(new Reference(o));
      return;
    }

    if (o.template === 'infobox' && o.data && isObject(o.data)) {
      data.infoboxes = data.infoboxes || [];
      data.infoboxes.push(new Infobox(o));
      return;
    }

    clean.push(o);
  });
  data.templates = clean;
  return wiki;
};

module.exports = parseTemplates;

},{"../02-section/reference/Reference":18,"../infobox/Infobox":91,"./_getTemplates":97,"./parse":131}],124:[function(_dereq_,module,exports){
"use strict";

module.exports = Object.assign({}, _dereq_('./languages'), _dereq_('./pronounce'), _dereq_('./wiktionary'));

},{"./languages":125,"./pronounce":126,"./wiktionary":127}],125:[function(_dereq_,module,exports){
"use strict";

var languages = _dereq_('../../_data/languages');

var parse = _dereq_('../_parsers/parse');

var templates = {
  lang: function lang(tmpl) {
    var order = ['lang', 'text'];
    var obj = parse(tmpl, order);
    return obj.text;
  },
  //this one has a million variants
  'lang-de': function langDe(tmpl) {
    var order = ['text'];
    var obj = parse(tmpl, order);
    return obj.text;
  },
  'rtl-lang': function rtlLang(tmpl) {
    var order = ['lang', 'text'];
    var obj = parse(tmpl, order);
    return obj.text;
  },
  //german keyboard letterscn
  taste: function taste(tmpl) {
    var obj = parse(tmpl, ['key']);
    return obj.key || '';
  },
  //https://en.wikipedia.org/wiki/Template:Nihongo
  nihongo: function nihongo(tmpl, r) {
    var obj = parse(tmpl, ['english', 'kanji', 'romaji', 'extra']);
    r.templates.push(obj);
    var str = obj.english || obj.romaji || '';

    if (obj.kanji) {
      str += " (".concat(obj.kanji, ")");
    }

    return str;
  }
}; //https://en.wikipedia.org/wiki/Category:Lang-x_templates

Object.keys(languages).forEach(function (k) {
  templates['lang-' + k] = templates['lang-de'];
});
templates['nihongo2'] = templates.nihongo;
templates['nihongo3'] = templates.nihongo;
templates['nihongo-s'] = templates.nihongo;
templates['nihongo foot'] = templates.nihongo;
module.exports = templates;

},{"../../_data/languages":69,"../_parsers/parse":106}],126:[function(_dereq_,module,exports){
"use strict";

var parse = _dereq_('../_parsers/parse');

var languages = _dereq_('../../_data/languages');

var getLang = function getLang(name) {
  //grab the language from the template name - 'ipa-de'
  var lang = name.match(/ipac?-(.+)/);

  if (lang !== null) {
    if (languages.hasOwnProperty(lang[1]) === true) {
      return languages[lang[1]].english_title;
    }

    return lang[1];
  }

  return null;
}; // pronounciation info


var templates = {
  // https://en.wikipedia.org/wiki/Template:IPA
  ipa: function ipa(tmpl, r) {
    var obj = parse(tmpl, ['transcription', 'lang', 'audio']);
    obj.lang = getLang(obj.template);
    obj.template = 'ipa';
    r.templates.push(obj);
    return '';
  },
  //https://en.wikipedia.org/wiki/Template:IPAc-en
  ipac: function ipac(tmpl, r) {
    var obj = parse(tmpl);
    obj.transcription = (obj.list || []).join(',');
    delete obj.list;
    obj.lang = getLang(obj.template);
    obj.template = 'ipac';
    r.templates.push(obj);
    return '';
  }
}; // - other languages -
// Polish, {{IPAc-pl}}	{{IPAc-pl|'|sz|cz|e|ć|i|n}} → [ˈʂt͡ʂɛt͡ɕin]
// Portuguese, {{IPAc-pt}}	{{IPAc-pt|p|o|<|r|t|u|'|g|a|l|lang=pt}} and {{IPAc-pt|b|r|a|'|s|i|l|lang=br}} → [puɾtuˈɣaɫ] and [bɾaˈsiw]

Object.keys(languages).forEach(function (lang) {
  templates['ipa-' + lang] = templates.ipa;
  templates['ipac-' + lang] = templates.ipac;
});
module.exports = templates;

},{"../../_data/languages":69,"../_parsers/parse":106}],127:[function(_dereq_,module,exports){
"use strict";

var parse = _dereq_('../_parsers/parse'); // const strip = require('./_parsers/_strip');
//wiktionary... who knows. we should atleast try.


var templates = {
  //{{inflection of|avoir||3|p|pres|ind|lang=fr}}
  //https://en.wiktionary.org/wiki/Template:inflection_of
  'inflection': function inflection(tmpl, r) {
    var obj = parse(tmpl, ['lemma']);
    obj.tags = obj.list;
    delete obj.list;
    obj.type = 'form-of';
    r.templates.push(obj);
    return obj.lemma || '';
  },
  //latin verbs
  'la-verb-form': function laVerbForm(tmpl, r) {
    var obj = parse(tmpl, ['word']);
    r.templates.push(obj);
    return obj.word || '';
  },
  'feminine plural': function femininePlural(tmpl, r) {
    var obj = parse(tmpl, ['word']);
    r.templates.push(obj);
    return obj.word || '';
  },
  'male plural': function malePlural(tmpl, r) {
    var obj = parse(tmpl, ['word']);
    r.templates.push(obj);
    return obj.word || '';
  },
  'rhymes': function rhymes(tmpl, r) {
    var obj = parse(tmpl, ['word']);
    r.templates.push(obj);
    return 'Rhymes: -' + (obj.word || '');
  }
}; //https://en.wiktionary.org/wiki/Category:Form-of_templates

var conjugations = ['abbreviation', 'abessive plural', 'abessive singular', 'accusative plural', 'accusative singular', 'accusative', 'acronym', 'active participle', 'agent noun', 'alternative case form', 'alternative form', 'alternative plural', 'alternative reconstruction', 'alternative spelling', 'alternative typography', 'aphetic form', 'apocopic form', 'archaic form', 'archaic spelling', 'aspirate mutation', 'associative plural', 'associative singular', 'attributive form', 'attributive form', 'augmentative', 'benefactive plural', 'benefactive singular', 'causative plural', 'causative singular', 'causative', 'clipping', 'combining form', 'comitative plural', 'comitative singular', 'comparative plural', 'comparative singular', 'comparative', 'contraction', 'dated form', 'dated spelling', 'dative plural definite', 'dative plural indefinite', 'dative plural', 'dative singular', 'dative', 'definite', 'deliberate misspelling', 'diminutive', 'distributive plural', 'distributive singular', 'dual', 'early form', 'eclipsis', 'elative', 'ellipsis', 'equative', 'euphemistic form', 'euphemistic spelling', 'exclusive plural', 'exclusive singular', 'eye dialect', 'feminine noun', 'feminine plural past participle', 'feminine plural', 'feminine singular past participle', 'feminine singular', 'feminine', 'form', 'former name', 'frequentative', 'future participle', 'genitive plural definite', 'genitive plural indefinite', 'genitive plural', 'genitive singular definite', 'genitive singular indefinite', 'genitive singular', 'genitive', 'gerund', 'h-prothesis', 'hard mutation', 'harmonic variant', 'imperative', 'imperfective form', 'inflected form', 'inflection', 'informal form', 'informal spelling', 'initialism', 'ja-form', 'jyutping reading', 'late form', 'lenition', 'masculine plural past participle', 'masculine plural', 'medieval spelling', 'misconstruction', 'misromanization', 'misspelling', 'mixed mutation', 'monotonic form', 'mutation', 'nasal mutation', 'negative', 'neuter plural past participle', 'neuter plural', 'neuter singular past participle', 'neuter singular', 'nominalization', 'nominative plural', 'nominative singular', 'nonstandard form', 'nonstandard spelling', 'oblique plural', 'oblique singular', 'obsolete form', 'obsolete spelling', 'obsolete typography', 'official form', 'participle', 'passive participle', 'passive', 'past active participle', 'past participle', 'past passive participle', 'past tense', 'perfective form', 'plural definite', 'plural indefinite', 'plural', 'polytonic form', 'present active participle', 'present participle', 'present tense', 'pronunciation spelling', 'rare form', 'rare spelling', 'reflexive', 'second-person singular past', 'short for', 'singular definite', 'singular', 'singulative', 'soft mutation', 'spelling', 'standard form', 'standard spelling', 'substantivisation', 'superlative', 'superseded spelling', 'supine', 'syncopic form', 'synonym', 'terminative plural', 'terminative singular', 'uncommon form', 'uncommon spelling', 'verbal noun', 'vocative plural', 'vocative singular'];
conjugations.forEach(function (name) {
  templates[name + ' of'] = function (tmpl, r) {
    var obj = parse(tmpl, ['lemma']);
    obj.tags = obj.list;
    delete obj.list;
    obj.type = 'form-of';
    r.templates.push(obj);
    return obj.lemma || '';
  };
});
module.exports = templates;

},{"../_parsers/parse":106}],128:[function(_dereq_,module,exports){
"use strict";

var parse = _dereq_('../_parsers/parse'); // const parseSentence = require('../../04-sentence').oneSentence;
//simply num/denom * 100


var _percentage = function percentage(obj) {
  if (!obj.numerator && !obj.denominator) {
    return null;
  }

  var perc = Number(obj.numerator) / Number(obj.denominator);
  perc *= 100;
  var dec = Number(obj.decimals);

  if (isNaN(dec)) {
    dec = 1;
  }

  perc = perc.toFixed(dec);
  return Number(perc);
};

var templates = {
  // https://en.wikipedia.org/wiki/Template:Math
  'math': function math(tmpl, r) {
    var obj = parse(tmpl, ['formula']);
    r.templates.push(obj);
    return '\n\n' + (obj.formula || '') + '\n\n';
  },
  //fraction - https://en.wikipedia.org/wiki/Template:Sfrac
  'frac': function frac(tmpl, r) {
    var order = ['a', 'b', 'c'];
    var obj = parse(tmpl, order);
    var data = {
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
      return "".concat(data.integer, " ").concat(data.numerator, "\u2044").concat(data.denominator);
    }

    return "".concat(data.numerator, "\u2044").concat(data.denominator);
  },
  //https://en.wikipedia.org/wiki/Template:Radic
  'radic': function radic(tmpl) {
    var order = ['after', 'before'];
    var obj = parse(tmpl, order);
    return "".concat(obj.before || '', "\u221A").concat(obj.after || '');
  },
  //{{percentage | numerator | denominator | decimals to round to (zero or greater) }}
  percentage: function percentage() {
    var tmpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var obj = parse(tmpl, ['numerator', 'denominator', 'decimals']);

    var num = _percentage(obj);

    if (num === null) {
      return '';
    }

    return num + '%';
  },
  // {{Percent-done|done=N|total=N|digits=N}}
  'percent-done': function percentDone() {
    var tmpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var obj = parse(tmpl, ['done', 'total', 'digits']);

    var num = _percentage({
      numerator: obj.done,
      denominator: obj.total,
      decimals: obj.digits
    });

    if (num === null) {
      return '';
    }

    return "".concat(obj.done, " (").concat(num, "%) done");
  },
  'winning percentage': function winningPercentage() {
    var tmpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var r = arguments.length > 1 ? arguments[1] : undefined;
    var obj = parse(tmpl, ['wins', 'losses', 'ties']);
    r.templates.push(obj);
    var wins = Number(obj.wins);
    var losses = Number(obj.losses);
    var ties = Number(obj.ties) || 0;
    var games = wins + losses + ties;

    if (obj.ignore_ties === 'y') {
      ties = 0;
    }

    if (ties) {
      wins += ties / 2;
    }

    var num = _percentage({
      numerator: wins,
      denominator: games,
      decimals: 1
    });

    if (num === null) {
      return '';
    }

    return ".".concat(num * 10);
  },
  'winlosspct': function winlosspct() {
    var tmpl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var r = arguments.length > 1 ? arguments[1] : undefined;
    var obj = parse(tmpl, ['wins', 'losses']);
    r.templates.push(obj);
    var wins = Number(obj.wins);
    var losses = Number(obj.losses);

    var num = _percentage({
      numerator: wins,
      denominator: wins + losses,
      decimals: 1
    });

    if (num === null) {
      return '';
    }

    num = ".".concat(num * 10);
    return "".concat(wins || 0, " || ").concat(losses || 0, " || ").concat(num || '-');
  }
}; //aliases

templates['sfrac'] = templates.frac;
templates['sqrt'] = templates.radic;
templates['pct'] = templates.percentage;
templates['percent'] = templates.percentage;
templates['winpct'] = templates['winning percentage'];
templates['winperc'] = templates['winning percentage'];
module.exports = templates;

},{"../_parsers/parse":106}],129:[function(_dereq_,module,exports){
"use strict";

var parse = _dereq_('../_parsers/parse');

var misc = {
  'timeline': function timeline(tmpl, r) {
    var data = parse(tmpl);
    r.templates.push(data);
    return '';
  },
  'uss': function uss(tmpl, r) {
    var order = ['ship', 'id'];
    var obj = parse(tmpl, order);
    r.templates.push(obj);
    return '';
  },
  'isbn': function isbn(tmpl, r) {
    var order = ['id', 'id2', 'id3'];
    var obj = parse(tmpl, order);
    r.templates.push(obj);
    return 'ISBN: ' + (obj.id || '');
  },
  //https://en.wikipedia.org/wiki/Template:Marriage
  //this one creates a template, and an inline response
  marriage: function marriage(tmpl, r) {
    var data = parse(tmpl, ['spouse', 'from', 'to', 'end']);
    r.templates.push(data);
    var str = "".concat(data.spouse || '');

    if (data.from) {
      if (data.to) {
        str += " (m. ".concat(data.from, "-").concat(data.to, ")");
      } else {
        str += " (m. ".concat(data.from, ")");
      }
    }

    return str;
  },
  //https://en.wikipedia.org/wiki/Template:Based_on
  'based on': function basedOn(tmpl, r) {
    var obj = parse(tmpl, ['title', 'author']);
    r.templates.push(obj);
    return "".concat(obj.title, " by ").concat(obj.author || '');
  },
  //https://en.wikipedia.org/wiki/Template:Video_game_release
  'video game release': function videoGameRelease(tmpl, r) {
    var order = ['region', 'date', 'region2', 'date2', 'region3', 'date3', 'region4', 'date4'];
    var obj = parse(tmpl, order);
    var template = {
      template: 'video game release',
      releases: []
    };

    for (var i = 0; i < order.length; i += 2) {
      if (obj[order[i]]) {
        template.releases.push({
          region: obj[order[i]],
          date: obj[order[i + 1]]
        });
      }
    }

    r.templates.push(template);
    var str = template.releases.map(function (o) {
      return "".concat(o.region, ": ").concat(o.date || '');
    }).join('\n\n');
    return '\n' + str + '\n';
  },
  //barrels of oil https://en.wikipedia.org/wiki/Template:Bbl_to_t
  'bbl to t': function bblToT(tmpl, r) {
    var obj = parse(tmpl, ['barrels']);
    r.templates.push(obj);

    if (obj.barrels === '0') {
      return obj.barrels + ' barrel';
    }

    return obj.barrels + ' barrels';
  }
};
module.exports = misc;

},{"../_parsers/parse":106}],130:[function(_dereq_,module,exports){
"use strict";

var parse = _dereq_('../_parsers/parse');

var codes = {
  us$: 'US$',
  // https://en.wikipedia.org/wiki/Template:US$
  bdt: '৳',
  // https://en.wikipedia.org/wiki/Template:BDT
  a$: 'A$',
  // https://en.wikipedia.org/wiki/Template:AUD
  ca$: 'CA$',
  // https://en.wikipedia.org/wiki/Template:CAD
  cad: 'CA$',
  cny: 'CN¥',
  // https://en.wikipedia.org/wiki/Template:CNY
  hkd: 'HK$',
  // https://en.wikipedia.org/wiki/Template:HKD
  gbp: 'GB£',
  // https://en.wikipedia.org/wiki/Template:GBP
  '₹': '₹',
  // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  '¥': '¥',
  // https://en.wikipedia.org/wiki/Template:JPY
  jpy: '¥',
  yen: '¥',
  '₱': '₱',
  // https://en.wikipedia.org/wiki/Template:Philippine_peso
  pkr: '₨',
  // https://en.wikipedia.org/wiki/Template:Pakistani_Rupee
  '€': '€',
  // https://en.wikipedia.org/wiki/Template:€
  'euro': '€',
  'nz$': 'NZ$',
  'nok': 'kr',
  //https://en.wikipedia.org/wiki/Template:NOK
  'aud': 'A$',
  //https://en.wikipedia.org/wiki/Template:AUD
  'zar': 'R' //https://en.wikipedia.org/wiki/Template:ZAR

};

var parseCurrency = function parseCurrency(tmpl, r) {
  var o = parse(tmpl, ['amount', 'code']);
  r.templates.push(o);
  var code = o.template || '';

  if (code === '' || code === 'currency') {
    code = o.code;
  }

  code = (code || '').toLowerCase();
  var out = codes[code] || '';
  return "".concat(out).concat(o.amount || '');
};

var currencies = {
  //this one is generic https://en.wikipedia.org/wiki/Template:Currency
  currency: parseCurrency
}; //the others fit the same pattern..

Object.keys(codes).forEach(function (k) {
  currencies[k] = parseCurrency;
});
module.exports = currencies;

},{"../_parsers/parse":106}],131:[function(_dereq_,module,exports){
"use strict";

var ignore = _dereq_('./_ignore');

var getName = _dereq_('./_parsers/_getName');

var parse = _dereq_('./_parsers/parse');

var inf = _dereq_('./_infobox');

var templates = Object.assign({}, _dereq_('./wikipedia'), _dereq_('./identities'), _dereq_('./dates'), _dereq_('./formatting'), _dereq_('./geo'), _dereq_('./language'), _dereq_('./money'), _dereq_('./sports'), _dereq_('./science'), _dereq_('./math'), _dereq_('./politics'), _dereq_('./misc')); // console.log(Object.keys(templates).length + ' Templates!');
//this gets all the {{template}} strings and decides how to parse them

var parseTemplate = function parseTemplate(tmpl, wiki, data) {
  var name = getName(tmpl); //we explicitly ignore these templates

  if (ignore.hasOwnProperty(name) === true) {
    wiki = wiki.replace(tmpl, '');
    return wiki;
  } //match any known template forms (~1,000!)


  if (templates.hasOwnProperty(name) === true) {
    var str = templates[name](tmpl, data);
    wiki = wiki.replace(tmpl, str);
    return wiki;
  } // {{infobox settlement...}}


  if (inf.isInfobox(name) === true) {
    var _obj = parse(tmpl, data, 'raw');

    var infobox = inf.format(_obj);
    data.templates.push(infobox);
    wiki = wiki.replace(tmpl, '');
    return wiki;
  } //cite book, cite arxiv...


  if (/^cite [a-z]/.test(name) === true) {
    var _obj2 = parse(tmpl, data);

    data.templates.push(_obj2);
    wiki = wiki.replace(tmpl, '');
    return wiki;
  } //fallback parser


  var obj = parse(tmpl);

  if (obj !== null && Object.keys(obj).length > 0) {
    data.templates.push(obj);
  }

  wiki = wiki.replace(tmpl, '');
  return wiki;
};

module.exports = parseTemplate;

},{"./_ignore":98,"./_infobox":99,"./_parsers/_getName":104,"./_parsers/parse":106,"./dates":111,"./formatting":115,"./geo":121,"./identities":122,"./language":124,"./math":128,"./misc":129,"./money":130,"./politics":134,"./science":136,"./sports":139,"./wikipedia":141}],132:[function(_dereq_,module,exports){
"use strict";

var parse = _dereq_('../_parsers/parse');

var templates = {
  //https://en.wikipedia.org/wiki/Template:Election_box
  'election box begin': function electionBoxBegin(tmpl, r) {
    var data = parse(tmpl);
    r.templates.push(data);
    return '';
  },
  'election box candidate': function electionBoxCandidate(tmpl, r) {
    var data = parse(tmpl);
    r.templates.push(data);
    return '';
  },
  'election box hold with party link': function electionBoxHoldWithPartyLink(tmpl, r) {
    var data = parse(tmpl);
    r.templates.push(data);
    return '';
  },
  'election box gain with party link': function electionBoxGainWithPartyLink(tmpl, r) {
    var data = parse(tmpl);
    r.templates.push(data);
    return '';
  }
}; //aliases

templates['election box begin no change'] = templates['election box begin'];
templates['election box begin no party'] = templates['election box begin'];
templates['election box begin no party no change'] = templates['election box begin'];
templates['election box inline begin'] = templates['election box begin'];
templates['election box inline begin no change'] = templates['election box begin'];
templates['election box candidate for alliance'] = templates['election box candidate'];
templates['election box candidate minor party'] = templates['election box candidate'];
templates['election box candidate no party link no change'] = templates['election box candidate'];
templates['election box candidate with party link'] = templates['election box candidate'];
templates['election box candidate with party link coalition 1918'] = templates['election box candidate'];
templates['election box candidate with party link no change'] = templates['election box candidate'];
templates['election box inline candidate'] = templates['election box candidate'];
templates['election box inline candidate no change'] = templates['election box candidate'];
templates['election box inline candidate with party link'] = templates['election box candidate'];
templates['election box inline candidate with party link no change'] = templates['election box candidate'];
templates['election box inline incumbent'] = templates['election box candidate'];
module.exports = templates;

},{"../_parsers/parse":106}],133:[function(_dereq_,module,exports){
"use strict";

var parse = _dereq_('../_parsers/parse');

var flags = _dereq_('../../_data/flags');

var templates = {
  //https://en.wikipedia.org/wiki/Template:Flag
  // {{flag|USA}} →  USA
  flag: function flag(tmpl) {
    var order = ['flag', 'variant'];
    var obj = parse(tmpl, order);
    var name = obj.flag || '';
    obj.flag = (obj.flag || '').toLowerCase();
    var found = flags.find(function (a) {
      return obj.flag === a[1] || obj.flag === a[2];
    }) || [];
    var flag = found[0] || '';
    return "".concat(flag, " [[").concat(found[2], "|").concat(name, "]]");
  },
  // {{flagcountry|USA}} →  United States
  flagcountry: function flagcountry(tmpl) {
    var order = ['flag', 'variant'];
    var obj = parse(tmpl, order);
    obj.flag = (obj.flag || '').toLowerCase();
    var found = flags.find(function (a) {
      return obj.flag === a[1] || obj.flag === a[2];
    }) || [];
    var flag = found[0] || '';
    return "".concat(flag, " [[").concat(found[2], "]]");
  },
  // (unlinked flag-country)
  flagcu: function flagcu(tmpl) {
    var order = ['flag', 'variant'];
    var obj = parse(tmpl, order);
    obj.flag = (obj.flag || '').toLowerCase();
    var found = flags.find(function (a) {
      return obj.flag === a[1] || obj.flag === a[2];
    }) || [];
    var flag = found[0] || '';
    return "".concat(flag, " ").concat(found[2]);
  },
  //https://en.wikipedia.org/wiki/Template:Flagicon
  // {{flagicon|USA}} → United States
  flagicon: function flagicon(tmpl) {
    var order = ['flag', 'variant'];
    var obj = parse(tmpl, order);
    obj.flag = (obj.flag || '').toLowerCase();
    var found = flags.find(function (a) {
      return obj.flag === a[1] || obj.flag === a[2];
    });

    if (!found) {
      return '';
    }

    return "[[".concat(found[2], "|").concat(found[0], "]]");
  },
  //unlinked flagicon
  flagdeco: function flagdeco(tmpl) {
    var order = ['flag', 'variant'];
    var obj = parse(tmpl, order);
    obj.flag = (obj.flag || '').toLowerCase();
    var found = flags.find(function (a) {
      return obj.flag === a[1] || obj.flag === a[2];
    }) || [];
    return found[0] || '';
  },
  //same, but a soccer team
  fb: function fb(tmpl) {
    var order = ['flag', 'variant'];
    var obj = parse(tmpl, order);
    obj.flag = (obj.flag || '').toLowerCase();
    var found = flags.find(function (a) {
      return obj.flag === a[1] || obj.flag === a[2];
    });

    if (!found) {
      return '';
    }

    return "".concat(found[0], " [[").concat(found[2], " national football team|").concat(found[2], "]]");
  },
  fbicon: function fbicon(tmpl) {
    var order = ['flag', 'variant'];
    var obj = parse(tmpl, order);
    obj.flag = (obj.flag || '').toLowerCase();
    var found = flags.find(function (a) {
      return obj.flag === a[1] || obj.flag === a[2];
    });

    if (!found) {
      return '';
    }

    return " [[".concat(found[2], " national football team|").concat(found[0], "]]");
  }
}; //support {{can}}

flags.forEach(function (a) {
  templates[a[1]] = function () {
    return a[0];
  };
});
module.exports = templates;

},{"../../_data/flags":67,"../_parsers/parse":106}],134:[function(_dereq_,module,exports){
"use strict";

module.exports = Object.assign({}, _dereq_('./elections'), _dereq_('./flags'), _dereq_('./population'));

},{"./elections":132,"./flags":133,"./population":135}],135:[function(_dereq_,module,exports){
"use strict";

var parse = _dereq_('../_parsers/parse');

var templates = {
  //https://en.wikipedia.org/wiki/Template:Historical_populations
  'historical populations': function historicalPopulations(tmpl, r) {
    var data = parse(tmpl);
    data.list = data.list || [];
    var years = [];

    for (var i = 0; i < data.list.length; i += 2) {
      var num = data.list[i + 1];
      years.push({
        year: data.list[i],
        val: Number(num) || num
      });
    }

    data.data = years;
    delete data.list;
    r.templates.push(data);
    return '';
  }
};
module.exports = templates;

},{"../_parsers/parse":106}],136:[function(_dereq_,module,exports){
"use strict";

module.exports = Object.assign({}, _dereq_('./weather'), _dereq_('./misc'));

},{"./misc":137,"./weather":138}],137:[function(_dereq_,module,exports){
"use strict";

var parse = _dereq_('../_parsers/parse');

var templates = {
  //https://en.wikipedia.org/wiki/Template:Taxon_info
  'taxon info': function taxonInfo(tmpl, r) {
    var order = ['taxon', 'item'];
    var obj = parse(tmpl, order);
    r.templates.push(obj);
    return '';
  },
  //minor planet - https://en.wikipedia.org/wiki/Template:MPC
  mpc: function mpc(tmpl, r) {
    var obj = parse(tmpl, ['number', 'text']);
    r.templates.push(obj);
    return "[https://minorplanetcenter.net/db_search/show_object?object_id=P/2011+NO1 ".concat(obj.text || obj.number, "]");
  },
  //https://en.wikipedia.org/wiki/Template:Chem2
  chem2: function chem2(tmpl, r) {
    var obj = parse(tmpl, ['equation']);
    r.templates.push(obj);
    return obj.equation;
  },
  //https://en.wikipedia.org/wiki/Template:Sky
  sky: function sky(tmpl, r) {
    var obj = parse(tmpl, ['asc_hours', 'asc_minutes', 'asc_seconds', 'dec_sign', 'dec_degrees', 'dec_minutes', 'dec_seconds', 'distance']);
    var template = {
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
    return '';
  }
};
module.exports = templates;

},{"../_parsers/parse":106}],138:[function(_dereq_,module,exports){
"use strict";

var parse = _dereq_('../_parsers/parse');

var hasMonth = /^jan /i;
var isYear = /^year /i;
var monthList = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

var toNumber = function toNumber(str) {
  str = str.replace(/,/g, '');
  str = str.replace(/−/g, '-');
  var num = Number(str);

  if (isNaN(num)) {
    return str;
  }

  return num;
};

var templates = {
  // this one is a handful!
  //https://en.wikipedia.org/wiki/Template:Weather_box
  'weather box': function weatherBox(tmpl, r) {
    var obj = parse(tmpl); //collect all month-based data

    var byMonth = {};
    var properties = Object.keys(obj).filter(function (k) {
      return hasMonth.test(k);
    });
    properties = properties.map(function (k) {
      return k.replace(hasMonth, '');
    });
    properties.forEach(function (prop) {
      byMonth[prop] = [];
      monthList.forEach(function (m) {
        var key = "".concat(m, " ").concat(prop);

        if (obj.hasOwnProperty(key)) {
          var num = toNumber(obj[key]);
          delete obj[key];
          byMonth[prop].push(num);
        }
      });
    }); //add these to original

    obj.byMonth = byMonth; //collect year-based data

    var byYear = {};
    Object.keys(obj).forEach(function (k) {
      if (isYear.test(k)) {
        var prop = k.replace(isYear, '');
        byYear[prop] = obj[k];
        delete obj[k];
      }
    });
    obj.byYear = byYear;
    r.templates.push(obj);
    return '';
  },
  //The 36 parameters are: 12 monthly highs (C), 12 lows (total 24) plus an optional 12 monthly rain/precipitation
  //https://en.wikipedia.org/wiki/Template:Weather_box/concise_C
  'weather box/concise c': function weatherBoxConciseC(tmpl, r) {
    var obj = parse(tmpl);
    obj.list = obj.list.map(function (s) {
      return toNumber(s);
    });
    obj.byMonth = {
      'high c': obj.list.slice(0, 12),
      'low c': obj.list.slice(12, 24),
      'rain mm': obj.list.slice(24, 36)
    };
    delete obj.list;
    obj.template = 'weather box';
    r.templates.push(obj);
    return '';
  },
  'weather box/concise f': function weatherBoxConciseF(tmpl, r) {
    var obj = parse(tmpl);
    obj.list = obj.list.map(function (s) {
      return toNumber(s);
    });
    obj.byMonth = {
      'high f': obj.list.slice(0, 12),
      'low f': obj.list.slice(12, 24),
      'rain inch': obj.list.slice(24, 36)
    };
    delete obj.list;
    obj.template = 'weather box';
    r.templates.push(obj);
    return '';
  },
  //https://en.wikipedia.org/wiki/Template:Climate_chart
  'climate chart': function climateChart(tmpl, r) {
    var list = parse(tmpl).list || [];
    var title = list[0];
    var source = list[38];
    list = list.slice(1); //amazingly, they use '−' symbol here instead of negatives...

    list = list.map(function (str) {
      if (str && str[0] === '−') {
        str = str.replace(/−/, '-');
      }

      return str;
    });
    var months = []; //groups of three, for 12 months

    for (var i = 0; i < 36; i += 3) {
      months.push({
        low: toNumber(list[i]),
        high: toNumber(list[i + 1]),
        precip: toNumber(list[i + 2])
      });
    }

    var obj = {
      template: 'climate chart',
      data: {
        title: title,
        source: source,
        months: months
      }
    };
    r.templates.push(obj);
    return '';
  }
};
module.exports = templates;

},{"../_parsers/parse":106}],139:[function(_dereq_,module,exports){
"use strict";

var parse = _dereq_('../_parsers/parse');

var misc = {
  'baseball secondary style': function baseballSecondaryStyle(tmpl) {
    var obj = parse(tmpl, ['name']);
    return obj.name;
  },
  'mlbplayer': function mlbplayer(tmpl, r) {
    var obj = parse(tmpl, ['number', 'name', 'dl']);
    r.templates.push(obj);
    return obj.name;
  }
};
module.exports = Object.assign({}, misc, _dereq_('./soccer'));

},{"../_parsers/parse":106,"./soccer":140}],140:[function(_dereq_,module,exports){
"use strict";

var parse = _dereq_('../_parsers/parse');

var flags = _dereq_('../../_data/flags');

var sports = {
  player: function player(tmpl, r) {
    var res = parse(tmpl, ['number', 'country', 'name', 'dl']);
    r.templates.push(res);
    var str = "[[".concat(res.name, "]]");

    if (res.country) {
      var country = (res.country || '').toLowerCase();
      var flag = flags.find(function (a) {
        return country === a[1] || country === a[2];
      }) || [];

      if (flag && flag[0]) {
        str = flag[0] + '  ' + str;
      }
    }

    if (res.number) {
      str = res.number + ' ' + str;
    }

    return str;
  },
  //https://en.wikipedia.org/wiki/Template:Goal
  goal: function goal(tmpl, r) {
    var res = parse(tmpl);
    var obj = {
      template: 'goal',
      data: []
    };
    var arr = res.list || [];

    for (var i = 0; i < arr.length; i += 2) {
      obj.data.push({
        min: arr[i],
        note: arr[i + 1] || ''
      });
    }

    r.templates.push(obj); //generate a little text summary

    var summary = '⚽ ';
    summary += obj.data.map(function (o) {
      var note = o.note;

      if (note) {
        note = " (".concat(note, ")");
      }

      return o.min + '\'' + note;
    }).join(', ');
    return summary;
  },
  //yellow card
  yel: function yel(tmpl, r) {
    var obj = parse(tmpl, ['min']);
    r.templates.push(obj);

    if (obj.min) {
      return "yellow: ".concat(obj.min || '', "'"); //no yellow-card emoji
    }

    return '';
  },
  'subon': function subon(tmpl, r) {
    var obj = parse(tmpl, ['min']);
    r.templates.push(obj);

    if (obj.min) {
      return "sub on: ".concat(obj.min || '', "'"); //no yellow-card emoji
    }

    return '';
  },
  'suboff': function suboff(tmpl, r) {
    var obj = parse(tmpl, ['min']);
    r.templates.push(obj);

    if (obj.min) {
      return "sub off: ".concat(obj.min || '', "'"); //no yellow-card emoji
    }

    return '';
  },
  'pengoal': function pengoal(tmpl, r) {
    r.templates.push({
      template: 'pengoal'
    });
    return '✅';
  },
  'penmiss': function penmiss(tmpl, r) {
    r.templates.push({
      template: 'penmiss'
    });
    return '❌';
  },
  //'red' card - {{sent off|cards|min1|min2}}
  'sent off': function sentOff(tmpl, r) {
    var obj = parse(tmpl, ['cards']);
    var result = {
      template: 'sent off',
      cards: obj.cards,
      minutes: obj.list || []
    };
    r.templates.push(result);
    var mins = result.minutes.map(function (m) {
      return m + '\'';
    }).join(', ');
    return 'sent off: ' + mins;
  }
};
module.exports = sports;

},{"../../_data/flags":67,"../_parsers/parse":106}],141:[function(_dereq_,module,exports){
"use strict";

module.exports = Object.assign({}, _dereq_('./links'), _dereq_('./page'), _dereq_('./table-cell'));

},{"./links":142,"./page":143,"./table-cell":144}],142:[function(_dereq_,module,exports){
"use strict";

var parse = _dereq_('../_parsers/parse');

var templates = {
  /* mostly wiktionary*/
  etyl: function etyl(tmpl) {
    var order = ['lang', 'page'];
    return parse(tmpl, order).page || '';
  },
  mention: function mention(tmpl) {
    var order = ['lang', 'page'];
    return parse(tmpl, order).page || '';
  },
  link: function link(tmpl) {
    var order = ['lang', 'page'];
    return parse(tmpl, order).page || '';
  },
  'la-verb-form': function laVerbForm(tmpl) {
    var order = ['word'];
    return parse(tmpl, order).word || '';
  },
  'la-ipa': function laIpa(tmpl) {
    var order = ['word'];
    return parse(tmpl, order).word || '';
  },
  //https://en.wikipedia.org/wiki/Template:Sortname
  sortname: function sortname(tmpl) {
    var order = ['first', 'last', 'target', 'sort'];
    var obj = parse(tmpl, order);
    var name = "".concat(obj.first || '', " ").concat(obj.last || '');
    name = name.trim();

    if (obj.nolink) {
      return obj.target || name;
    }

    if (obj.dab) {
      name += " (".concat(obj.dab, ")");

      if (obj.target) {
        obj.target += " (".concat(obj.dab, ")");
      }
    }

    if (obj.target) {
      return "[[".concat(obj.target, "|").concat(name, "]]");
    }

    return "[[".concat(name, "]]");
  }
}; //these are insane
// https://en.wikipedia.org/wiki/Template:Tl

var links = ['lts', 't', 'tfd links', 'tiw', 'tltt', 'tetl', 'tsetl', 'ti', 'tic', 'tiw', 'tlt', 'ttl', 'twlh', 'tl2', 'tlu', 'demo', 'hatnote', 'xpd', 'para', 'elc', 'xtag', 'mli', 'mlix', '#invoke', 'url' //https://en.wikipedia.org/wiki/Template:URL
]; //keyValues

links.forEach(function (k) {
  templates[k] = function (tmpl) {
    var order = ['first', 'second'];
    var obj = parse(tmpl, order);
    return obj.second || obj.first;
  };
}); //aliases

templates.m = templates.mention;
templates['m-self'] = templates.mention;
templates.l = templates.link;
templates.ll = templates.link;
templates['l-self'] = templates.link;
module.exports = templates;

},{"../_parsers/parse":106}],143:[function(_dereq_,module,exports){
"use strict";

var parse = _dereq_('../_parsers/parse');

var Image = _dereq_('../../image/Image');

var sisterProjects = {
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
var parsers = {
  //same in every language.
  citation: function citation(tmpl, r) {
    var obj = parse(tmpl);
    r.templates.push(obj);
    return '';
  },
  //https://en.wikipedia.org/wiki/Template:Book_bar
  'book bar': function bookBar(tmpl, r) {
    var obj = parse(tmpl);
    r.templates.push(obj);
    return '';
  },
  //https://en.wikipedia.org/wiki/Template:Main
  main: function main(tmpl, r) {
    var obj = parse(tmpl);
    r.templates.push(obj);
    return '';
  },
  'wide image': function wideImage(tmpl, r) {
    var obj = parse(tmpl, ['file', 'width', 'caption']);
    r.templates.push(obj);
    return '';
  },
  //https://en.wikipedia.org/wiki/Template:Redirect
  redirect: function redirect(tmpl, r) {
    var data = parse(tmpl, ['redirect']);
    var list = data.list || [];
    var links = [];

    for (var i = 0; i < list.length; i += 2) {
      links.push({
        page: list[i + 1],
        desc: list[i]
      });
    }

    var obj = {
      template: 'redirect',
      redirect: data.redirect,
      links: links
    };
    r.templates.push(obj);
    return '';
  },
  //this one sucks - https://en.wikipedia.org/wiki/Template:GNIS
  'cite gnis': function citeGnis(tmpl, r) {
    var order = ['id', 'name', 'type'];
    var obj = parse(tmpl, order);
    obj.type = 'gnis';
    obj.template = 'citation';
    r.templates.push(obj);
    return '';
  },
  'sfn': function sfn(tmpl, r) {
    var order = ['author', 'year', 'location'];
    var obj = parse(tmpl, order);
    r.templates.push(obj);
    return '';
  },
  'audio': function audio(tmpl, r) {
    var order = ['file', 'text', 'type'];
    var obj = parse(tmpl, order);
    r.templates.push(obj);
    return '';
  },
  //https://en.wikipedia.org/wiki/Template:Portal
  'portal': function portal(tmpl, r) {
    var obj = parse(tmpl);
    r.templates.push(obj);
    return '';
  },
  'spoken wikipedia': function spokenWikipedia(tmpl, r) {
    var order = ['file', 'date'];
    var obj = parse(tmpl, order);
    obj.template = 'audio';
    r.templates.push(obj);
    return '';
  },
  //https://en.wikipedia.org/wiki/Template:Sister_project_links
  'sister project links': function sisterProjectLinks(tmpl, r) {
    var data = parse(tmpl); //rename 'wd' to 'wikidata'

    var links = {};
    Object.keys(sisterProjects).forEach(function (k) {
      if (data.hasOwnProperty(k) === true) {
        links[sisterProjects[k]] = data[k]; //.text();
      }
    });
    var obj = {
      template: 'sister project links',
      links: links
    };
    r.templates.push(obj);
    return '';
  },
  //https://en.wikipedia.org/wiki/Template:Subject_bar
  'subject bar': function subjectBar(tmpl, r) {
    var data = parse(tmpl);
    Object.keys(data).forEach(function (k) {
      //rename 'voy' to 'wikivoyage'
      if (sisterProjects.hasOwnProperty(k)) {
        data[sisterProjects[k]] = data[k];
        delete data[k];
      }
    });
    var obj = {
      template: 'subject bar',
      links: data
    };
    r.templates.push(obj);
    return '';
  },
  'short description': function shortDescription(tmpl, r) {
    var data = parse(tmpl, ['description']);

    if (data['1']) {
      console.log("~=~=~**here**~=~");
      data.description = data['1'];
      delete data['1'];
    }

    r.templates.push(data);
    return '';
  },
  'good article': function goodArticle(tmpl, r) {
    var obj = {
      template: 'Good article'
    };
    r.templates.push(obj);
    return '';
  },
  'coord missing': function coordMissing(tmpl, r) {
    var obj = parse(tmpl, ['region']);
    r.templates.push(obj);
    return '';
  },
  //amazingly, this one does not obey any known patterns
  //https://en.wikipedia.org/wiki/Template:Gallery
  'gallery': function gallery(tmpl, r) {
    var obj = parse(tmpl);
    var images = (obj.list || []).filter(function (line) {
      return /^ *File ?:/.test(line);
    });
    images = images.map(function (file) {
      var img = {
        file: file
      };
      return new Image(img).json();
    });
    obj = {
      template: 'gallery',
      images: images
    };
    r.templates.push(obj);
    return '';
  },
  //https://en.wikipedia.org/wiki/Template:See_also
  'see also': function seeAlso(tmpl, r) {
    var data = parse(tmpl);
    r.templates.push(data);
    return '';
  },
  'italic title': function italicTitle(tmpl, r) {
    r.templates.push({
      template: 'italic title'
    });
    return '';
  },
  'unreferenced': function unreferenced(tmpl, r) {
    var obj = parse(tmpl, ['date']);
    r.templates.push(obj);
    return '';
  }
}; //aliases

parsers['cite'] = parsers.citation;
parsers['sfnref'] = parsers.sfn;
parsers['harvid'] = parsers.sfn;
parsers['harvnb'] = parsers.sfn;
parsers['unreferenced section'] = parsers.unreferenced;
parsers['redir'] = parsers.redirect;
parsers['sisterlinks'] = parsers['sister project links'];
parsers['main article'] = parsers['main'];
module.exports = parsers;

},{"../../image/Image":84,"../_parsers/parse":106}],144:[function(_dereq_,module,exports){
"use strict";

//random misc for inline wikipedia templates
var parse = _dereq_('../_parsers/parse');

var titlecase = function titlecase(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}; //https://en.wikipedia.org/wiki/Template:Yes


var templates = {};
var cells = ['rh', 'rh2', 'yes', 'no', 'maybe', 'eliminated', 'lost', 'safe', 'active', 'site active', 'coming soon', 'good', 'won', 'nom', 'sho', 'longlisted', 'tba', 'success', 'operational', 'failure', 'partial', 'regional', 'maybecheck', 'partial success', 'partial failure', 'okay', 'yes-no', 'some', 'nonpartisan', 'pending', 'unofficial', 'unofficial2', 'usually', 'rarely', 'sometimes', 'any', 'varies', 'black', 'non-album single', 'unreleased', 'unknown', 'perhaps', 'depends', 'included', 'dropped', 'terminated', 'beta', 'table-experimental', 'free', 'proprietary', 'nonfree', 'needs', 'nightly', 'release-candidate', 'planned', 'scheduled', 'incorrect', 'no result', 'cmain', 'calso starring', 'crecurring', 'cguest', 'not yet', 'optional'];
cells.forEach(function (str) {
  templates[str] = function (tmpl) {
    var data = parse(tmpl, ['text']);
    return data.text || titlecase(data.template);
  };
}); //these ones have a text result

var moreCells = [['active fire', 'Active'], ['site active', 'Active'], ['site inactive', 'Inactive'], ['yes2', ''], ['no2', ''], ['ya', '✅'], ['na', '❌'], ['nom', 'Nominated'], ['sho', 'Shortlisted'], ['tba', 'TBA'], ['maybecheck', '✔️'], ['okay', 'Neutral'], ['n/a', 'N/A'], ['sdash', '—'], ['dunno', '?'], ['draw', ''], ['cnone', ''], ['nocontest', '']];
moreCells.forEach(function (a) {
  templates[a[0]] = function (tmpl) {
    var data = parse(tmpl, ['text']);
    return data.text || a[1];
  };
}); //this one's a little different

templates.won = function (tmpl) {
  var data = parse(tmpl, ['text']);
  return data.place || data.text || titlecase(data.template);
};

module.exports = templates;

},{"../_parsers/parse":106}]},{},[90])(90)
});
