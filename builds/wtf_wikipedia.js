/* wtf_wikipedia v5.1.2
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
}

},{}],2:[function(_dereq_,module,exports){
(function (global){
/**
 * jshashes - https://github.com/h2non/jshashes
 * Released under the "New BSD" license
 *
 * Algorithms specification:
 *
 * MD5 - http://www.ietf.org/rfc/rfc1321.txt
 * RIPEMD-160 - http://homes.esat.kuleuven.be/~bosselae/ripemd160.html
 * SHA1   - http://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf
 * SHA256 - http://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf
 * SHA512 - http://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf
 * HMAC - http://www.ietf.org/rfc/rfc2104.txt
 */
(function() {
  var Hashes;

  function utf8Encode(str) {
    var x, y, output = '',
      i = -1,
      l;

    if (str && str.length) {
      l = str.length;
      while ((i += 1) < l) {
        /* Decode utf-16 surrogate pairs */
        x = str.charCodeAt(i);
        y = i + 1 < l ? str.charCodeAt(i + 1) : 0;
        if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
          x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
          i += 1;
        }
        /* Encode output as utf-8 */
        if (x <= 0x7F) {
          output += String.fromCharCode(x);
        } else if (x <= 0x7FF) {
          output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F),
            0x80 | (x & 0x3F));
        } else if (x <= 0xFFFF) {
          output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
            0x80 | ((x >>> 6) & 0x3F),
            0x80 | (x & 0x3F));
        } else if (x <= 0x1FFFFF) {
          output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
            0x80 | ((x >>> 12) & 0x3F),
            0x80 | ((x >>> 6) & 0x3F),
            0x80 | (x & 0x3F));
        }
      }
    }
    return output;
  }

  function utf8Decode(str) {
    var i, ac, c1, c2, c3, arr = [],
      l;
    i = ac = c1 = c2 = c3 = 0;

    if (str && str.length) {
      l = str.length;
      str += '';

      while (i < l) {
        c1 = str.charCodeAt(i);
        ac += 1;
        if (c1 < 128) {
          arr[ac] = String.fromCharCode(c1);
          i += 1;
        } else if (c1 > 191 && c1 < 224) {
          c2 = str.charCodeAt(i + 1);
          arr[ac] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = str.charCodeAt(i + 1);
          c3 = str.charCodeAt(i + 2);
          arr[ac] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }
    }
    return arr.join('');
  }

  /**
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   */

  function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF),
      msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  /**
   * Bitwise rotate a 32-bit number to the left.
   */

  function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  /**
   * Convert a raw string to a hex string
   */

  function rstr2hex(input, hexcase) {
    var hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef',
      output = '',
      x, i = 0,
      l = input.length;
    for (; i < l; i += 1) {
      x = input.charCodeAt(i);
      output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
    }
    return output;
  }

  /**
   * Encode a string as utf-16
   */

  function str2rstr_utf16le(input) {
    var i, l = input.length,
      output = '';
    for (i = 0; i < l; i += 1) {
      output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
    }
    return output;
  }

  function str2rstr_utf16be(input) {
    var i, l = input.length,
      output = '';
    for (i = 0; i < l; i += 1) {
      output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
    }
    return output;
  }

  /**
   * Convert an array of big-endian words to a string
   */

  function binb2rstr(input) {
    var i, l = input.length * 32,
      output = '';
    for (i = 0; i < l; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (24 - i % 32)) & 0xFF);
    }
    return output;
  }

  /**
   * Convert an array of little-endian words to a string
   */

  function binl2rstr(input) {
    var i, l = input.length * 32,
      output = '';
    for (i = 0; i < l; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
    }
    return output;
  }

  /**
   * Convert a raw string to an array of little-endian words
   * Characters >255 have their high-byte silently ignored.
   */

  function rstr2binl(input) {
    var i, l = input.length * 8,
      output = Array(input.length >> 2),
      lo = output.length;
    for (i = 0; i < lo; i += 1) {
      output[i] = 0;
    }
    for (i = 0; i < l; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
    }
    return output;
  }

  /**
   * Convert a raw string to an array of big-endian words
   * Characters >255 have their high-byte silently ignored.
   */

  function rstr2binb(input) {
    var i, l = input.length * 8,
      output = Array(input.length >> 2),
      lo = output.length;
    for (i = 0; i < lo; i += 1) {
      output[i] = 0;
    }
    for (i = 0; i < l; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
    }
    return output;
  }

  /**
   * Convert a raw string to an arbitrary string encoding
   */

  function rstr2any(input, encoding) {
    var divisor = encoding.length,
      remainders = Array(),
      i, q, x, ld, quotient, dividend, output, full_length;

    /* Convert to an array of 16-bit big-endian values, forming the dividend */
    dividend = Array(Math.ceil(input.length / 2));
    ld = dividend.length;
    for (i = 0; i < ld; i += 1) {
      dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
    }

    /**
     * Repeatedly perform a long division. The binary array forms the dividend,
     * the length of the encoding is the divisor. Once computed, the quotient
     * forms the dividend for the next step. We stop when the dividend is zerHashes.
     * All remainders are stored for later use.
     */
    while (dividend.length > 0) {
      quotient = Array();
      x = 0;
      for (i = 0; i < dividend.length; i += 1) {
        x = (x << 16) + dividend[i];
        q = Math.floor(x / divisor);
        x -= q * divisor;
        if (quotient.length > 0 || q > 0) {
          quotient[quotient.length] = q;
        }
      }
      remainders[remainders.length] = x;
      dividend = quotient;
    }

    /* Convert the remainders to the output string */
    output = '';
    for (i = remainders.length - 1; i >= 0; i--) {
      output += encoding.charAt(remainders[i]);
    }

    /* Append leading zero equivalents */
    full_length = Math.ceil(input.length * 8 / (Math.log(encoding.length) / Math.log(2)));
    for (i = output.length; i < full_length; i += 1) {
      output = encoding[0] + output;
    }
    return output;
  }

  /**
   * Convert a raw string to a base-64 string
   */

  function rstr2b64(input, b64pad) {
    var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      output = '',
      len = input.length,
      i, j, triplet;
    b64pad = b64pad || '=';
    for (i = 0; i < len; i += 3) {
      triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
      for (j = 0; j < 4; j += 1) {
        if (i * 8 + j * 6 > input.length * 8) {
          output += b64pad;
        } else {
          output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
        }
      }
    }
    return output;
  }

  Hashes = {
    /**
     * @property {String} version
     * @readonly
     */
    VERSION: '1.0.6',
    /**
     * @member Hashes
     * @class Base64
     * @constructor
     */
    Base64: function() {
      // private properties
      var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        pad = '=', // default pad according with the RFC standard
        url = false, // URL encoding support @todo
        utf8 = true; // by default enable UTF-8 support encoding

      // public method for encoding
      this.encode = function(input) {
        var i, j, triplet,
          output = '',
          len = input.length;

        pad = pad || '=';
        input = (utf8) ? utf8Encode(input) : input;

        for (i = 0; i < len; i += 3) {
          triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
          for (j = 0; j < 4; j += 1) {
            if (i * 8 + j * 6 > len * 8) {
              output += pad;
            } else {
              output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
            }
          }
        }
        return output;
      };

      // public method for decoding
      this.decode = function(input) {
        // var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var i, o1, o2, o3, h1, h2, h3, h4, bits, ac,
          dec = '',
          arr = [];
        if (!input) {
          return input;
        }

        i = ac = 0;
        input = input.replace(new RegExp('\\' + pad, 'gi'), ''); // use '='
        //input += '';

        do { // unpack four hexets into three octets using index points in b64
          h1 = tab.indexOf(input.charAt(i += 1));
          h2 = tab.indexOf(input.charAt(i += 1));
          h3 = tab.indexOf(input.charAt(i += 1));
          h4 = tab.indexOf(input.charAt(i += 1));

          bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

          o1 = bits >> 16 & 0xff;
          o2 = bits >> 8 & 0xff;
          o3 = bits & 0xff;
          ac += 1;

          if (h3 === 64) {
            arr[ac] = String.fromCharCode(o1);
          } else if (h4 === 64) {
            arr[ac] = String.fromCharCode(o1, o2);
          } else {
            arr[ac] = String.fromCharCode(o1, o2, o3);
          }
        } while (i < input.length);

        dec = arr.join('');
        dec = (utf8) ? utf8Decode(dec) : dec;

        return dec;
      };

      // set custom pad string
      this.setPad = function(str) {
        pad = str || pad;
        return this;
      };
      // set custom tab string characters
      this.setTab = function(str) {
        tab = str || tab;
        return this;
      };
      this.setUTF8 = function(bool) {
        if (typeof bool === 'boolean') {
          utf8 = bool;
        }
        return this;
      };
    },

    /**
     * CRC-32 calculation
     * @member Hashes
     * @method CRC32
     * @static
     * @param {String} str Input String
     * @return {String}
     */
    CRC32: function(str) {
      var crc = 0,
        x = 0,
        y = 0,
        table, i, iTop;
      str = utf8Encode(str);

      table = [
        '00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 ',
        '79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 ',
        '84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F ',
        '63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD ',
        'A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC ',
        '51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 ',
        'B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 ',
        '06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 ',
        'E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 ',
        '12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 ',
        'D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 ',
        '33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 ',
        'CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 ',
        '9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E ',
        '7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D ',
        '806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 ',
        '60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA ',
        'AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 ',
        '5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 ',
        'B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 ',
        '05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 ',
        'F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA ',
        '11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 ',
        'D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F ',
        '30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E ',
        'C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D'
      ].join('');

      crc = crc ^ (-1);
      for (i = 0, iTop = str.length; i < iTop; i += 1) {
        y = (crc ^ str.charCodeAt(i)) & 0xFF;
        x = '0x' + table.substr(y * 9, 8);
        crc = (crc >>> 8) ^ x;
      }
      // always return a positive number (that's what >>> 0 does)
      return (crc ^ (-1)) >>> 0;
    },
    /**
     * @member Hashes
     * @class MD5
     * @constructor
     * @param {Object} [config]
     *
     * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
     * Digest Algorithm, as defined in RFC 1321.
     * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * See <http://pajhome.org.uk/crypt/md5> for more infHashes.
     */
    MD5: function(options) {
      /**
       * Private config properties. You may need to tweak these to be compatible with
       * the server-side, but the defaults work in most cases.
       * See {@link Hashes.MD5#method-setUpperCase} and {@link Hashes.SHA1#method-setUpperCase}
       */
      var hexcase = (options && typeof options.uppercase === 'boolean') ? options.uppercase : false, // hexadecimal output case format. false - lowercase; true - uppercase
        b64pad = (options && typeof options.pad === 'string') ? options.pad : '=', // base-64 pad character. Defaults to '=' for strict RFC compliance
        utf8 = (options && typeof options.utf8 === 'boolean') ? options.utf8 : true; // enable/disable utf8 encoding

      // privileged (public) methods
      this.hex = function(s) {
        return rstr2hex(rstr(s, utf8), hexcase);
      };
      this.b64 = function(s) {
        return rstr2b64(rstr(s), b64pad);
      };
      this.any = function(s, e) {
        return rstr2any(rstr(s, utf8), e);
      };
      this.raw = function(s) {
        return rstr(s, utf8);
      };
      this.hex_hmac = function(k, d) {
        return rstr2hex(rstr_hmac(k, d), hexcase);
      };
      this.b64_hmac = function(k, d) {
        return rstr2b64(rstr_hmac(k, d), b64pad);
      };
      this.any_hmac = function(k, d, e) {
        return rstr2any(rstr_hmac(k, d), e);
      };
      /**
       * Perform a simple self-test to see if the VM is working
       * @return {String} Hexadecimal hash sample
       */
      this.vm_test = function() {
        return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
      };
      /**
       * Enable/disable uppercase hexadecimal returned string
       * @param {Boolean}
       * @return {Object} this
       */
      this.setUpperCase = function(a) {
        if (typeof a === 'boolean') {
          hexcase = a;
        }
        return this;
      };
      /**
       * Defines a base64 pad string
       * @param {String} Pad
       * @return {Object} this
       */
      this.setPad = function(a) {
        b64pad = a || b64pad;
        return this;
      };
      /**
       * Defines a base64 pad string
       * @param {Boolean}
       * @return {Object} [this]
       */
      this.setUTF8 = function(a) {
        if (typeof a === 'boolean') {
          utf8 = a;
        }
        return this;
      };

      // private methods

      /**
       * Calculate the MD5 of a raw string
       */

      function rstr(s) {
        s = (utf8) ? utf8Encode(s) : s;
        return binl2rstr(binl(rstr2binl(s), s.length * 8));
      }

      /**
       * Calculate the HMAC-MD5, of a key and some data (raw strings)
       */

      function rstr_hmac(key, data) {
        var bkey, ipad, opad, hash, i;

        key = (utf8) ? utf8Encode(key) : key;
        data = (utf8) ? utf8Encode(data) : data;
        bkey = rstr2binl(key);
        if (bkey.length > 16) {
          bkey = binl(bkey, key.length * 8);
        }

        ipad = Array(16), opad = Array(16);
        for (i = 0; i < 16; i += 1) {
          ipad[i] = bkey[i] ^ 0x36363636;
          opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = binl(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binl(opad.concat(hash), 512 + 128));
      }

      /**
       * Calculate the MD5 of an array of little-endian words, and a bit length.
       */

      function binl(x, len) {
        var i, olda, oldb, oldc, oldd,
          a = 1732584193,
          b = -271733879,
          c = -1732584194,
          d = 271733878;

        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        for (i = 0; i < x.length; i += 16) {
          olda = a;
          oldb = b;
          oldc = c;
          oldd = d;

          a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
          d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
          c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
          b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
          a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
          d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
          c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
          b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
          a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
          d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
          c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
          b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
          a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
          d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
          c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
          b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

          a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
          d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
          c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
          b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
          a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
          d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
          c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
          b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
          a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
          d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
          c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
          b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
          a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
          d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
          c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
          b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

          a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
          d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
          c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
          b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
          a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
          d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
          c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
          b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
          a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
          d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
          c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
          b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
          a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
          d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
          c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
          b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

          a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
          d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
          c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
          b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
          a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
          d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
          c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
          b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
          a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
          d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
          c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
          b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
          a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
          d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
          c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
          b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

          a = safe_add(a, olda);
          b = safe_add(b, oldb);
          c = safe_add(c, oldc);
          d = safe_add(d, oldd);
        }
        return Array(a, b, c, d);
      }

      /**
       * These functions implement the four basic operations the algorithm uses.
       */

      function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
      }

      function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
      }

      function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
      }

      function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
      }

      function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
      }
    },
    /**
     * @member Hashes
     * @class Hashes.SHA1
     * @param {Object} [config]
     * @constructor
     *
     * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined in FIPS 180-1
     * Version 2.2 Copyright Paul Johnston 2000 - 2009.
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * See http://pajhome.org.uk/crypt/md5 for details.
     */
    SHA1: function(options) {
      /**
       * Private config properties. You may need to tweak these to be compatible with
       * the server-side, but the defaults work in most cases.
       * See {@link Hashes.MD5#method-setUpperCase} and {@link Hashes.SHA1#method-setUpperCase}
       */
      var hexcase = (options && typeof options.uppercase === 'boolean') ? options.uppercase : false, // hexadecimal output case format. false - lowercase; true - uppercase
        b64pad = (options && typeof options.pad === 'string') ? options.pad : '=', // base-64 pad character. Defaults to '=' for strict RFC compliance
        utf8 = (options && typeof options.utf8 === 'boolean') ? options.utf8 : true; // enable/disable utf8 encoding

      // public methods
      this.hex = function(s) {
        return rstr2hex(rstr(s, utf8), hexcase);
      };
      this.b64 = function(s) {
        return rstr2b64(rstr(s, utf8), b64pad);
      };
      this.any = function(s, e) {
        return rstr2any(rstr(s, utf8), e);
      };
      this.raw = function(s) {
        return rstr(s, utf8);
      };
      this.hex_hmac = function(k, d) {
        return rstr2hex(rstr_hmac(k, d));
      };
      this.b64_hmac = function(k, d) {
        return rstr2b64(rstr_hmac(k, d), b64pad);
      };
      this.any_hmac = function(k, d, e) {
        return rstr2any(rstr_hmac(k, d), e);
      };
      /**
       * Perform a simple self-test to see if the VM is working
       * @return {String} Hexadecimal hash sample
       * @public
       */
      this.vm_test = function() {
        return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
      };
      /**
       * @description Enable/disable uppercase hexadecimal returned string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUpperCase = function(a) {
        if (typeof a === 'boolean') {
          hexcase = a;
        }
        return this;
      };
      /**
       * @description Defines a base64 pad string
       * @param {string} Pad
       * @return {Object} this
       * @public
       */
      this.setPad = function(a) {
        b64pad = a || b64pad;
        return this;
      };
      /**
       * @description Defines a base64 pad string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUTF8 = function(a) {
        if (typeof a === 'boolean') {
          utf8 = a;
        }
        return this;
      };

      // private methods

      /**
       * Calculate the SHA-512 of a raw string
       */

      function rstr(s) {
        s = (utf8) ? utf8Encode(s) : s;
        return binb2rstr(binb(rstr2binb(s), s.length * 8));
      }

      /**
       * Calculate the HMAC-SHA1 of a key and some data (raw strings)
       */

      function rstr_hmac(key, data) {
        var bkey, ipad, opad, i, hash;
        key = (utf8) ? utf8Encode(key) : key;
        data = (utf8) ? utf8Encode(data) : data;
        bkey = rstr2binb(key);

        if (bkey.length > 16) {
          bkey = binb(bkey, key.length * 8);
        }
        ipad = Array(16), opad = Array(16);
        for (i = 0; i < 16; i += 1) {
          ipad[i] = bkey[i] ^ 0x36363636;
          opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = binb(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
        return binb2rstr(binb(opad.concat(hash), 512 + 160));
      }

      /**
       * Calculate the SHA-1 of an array of big-endian words, and a bit length
       */

      function binb(x, len) {
        var i, j, t, olda, oldb, oldc, oldd, olde,
          w = Array(80),
          a = 1732584193,
          b = -271733879,
          c = -1732584194,
          d = 271733878,
          e = -1009589776;

        /* append padding */
        x[len >> 5] |= 0x80 << (24 - len % 32);
        x[((len + 64 >> 9) << 4) + 15] = len;

        for (i = 0; i < x.length; i += 16) {
          olda = a;
          oldb = b;
          oldc = c;
          oldd = d;
          olde = e;

          for (j = 0; j < 80; j += 1) {
            if (j < 16) {
              w[j] = x[i + j];
            } else {
              w[j] = bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
              safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = bit_rol(b, 30);
            b = a;
            a = t;
          }

          a = safe_add(a, olda);
          b = safe_add(b, oldb);
          c = safe_add(c, oldc);
          d = safe_add(d, oldd);
          e = safe_add(e, olde);
        }
        return Array(a, b, c, d, e);
      }

      /**
       * Perform the appropriate triplet combination function for the current
       * iteration
       */

      function sha1_ft(t, b, c, d) {
        if (t < 20) {
          return (b & c) | ((~b) & d);
        }
        if (t < 40) {
          return b ^ c ^ d;
        }
        if (t < 60) {
          return (b & c) | (b & d) | (c & d);
        }
        return b ^ c ^ d;
      }

      /**
       * Determine the appropriate additive constant for the current iteration
       */

      function sha1_kt(t) {
        return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
          (t < 60) ? -1894007588 : -899497514;
      }
    },
    /**
     * @class Hashes.SHA256
     * @param {config}
     *
     * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined in FIPS 180-2
     * Version 2.2 Copyright Angel Marin, Paul Johnston 2000 - 2009.
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * See http://pajhome.org.uk/crypt/md5 for details.
     * Also http://anmar.eu.org/projects/jssha2/
     */
    SHA256: function(options) {
      /**
       * Private properties configuration variables. You may need to tweak these to be compatible with
       * the server-side, but the defaults work in most cases.
       * @see this.setUpperCase() method
       * @see this.setPad() method
       */
      var hexcase = (options && typeof options.uppercase === 'boolean') ? options.uppercase : false, // hexadecimal output case format. false - lowercase; true - uppercase  */
        b64pad = (options && typeof options.pad === 'string') ? options.pad : '=',
        /* base-64 pad character. Default '=' for strict RFC compliance   */
        utf8 = (options && typeof options.utf8 === 'boolean') ? options.utf8 : true,
        /* enable/disable utf8 encoding */
        sha256_K;

      /* privileged (public) methods */
      this.hex = function(s) {
        return rstr2hex(rstr(s, utf8));
      };
      this.b64 = function(s) {
        return rstr2b64(rstr(s, utf8), b64pad);
      };
      this.any = function(s, e) {
        return rstr2any(rstr(s, utf8), e);
      };
      this.raw = function(s) {
        return rstr(s, utf8);
      };
      this.hex_hmac = function(k, d) {
        return rstr2hex(rstr_hmac(k, d));
      };
      this.b64_hmac = function(k, d) {
        return rstr2b64(rstr_hmac(k, d), b64pad);
      };
      this.any_hmac = function(k, d, e) {
        return rstr2any(rstr_hmac(k, d), e);
      };
      /**
       * Perform a simple self-test to see if the VM is working
       * @return {String} Hexadecimal hash sample
       * @public
       */
      this.vm_test = function() {
        return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
      };
      /**
       * Enable/disable uppercase hexadecimal returned string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUpperCase = function(a) {
        if (typeof a === 'boolean') {
          hexcase = a;
        }
        return this;
      };
      /**
       * @description Defines a base64 pad string
       * @param {string} Pad
       * @return {Object} this
       * @public
       */
      this.setPad = function(a) {
        b64pad = a || b64pad;
        return this;
      };
      /**
       * Defines a base64 pad string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUTF8 = function(a) {
        if (typeof a === 'boolean') {
          utf8 = a;
        }
        return this;
      };

      // private methods

      /**
       * Calculate the SHA-512 of a raw string
       */

      function rstr(s, utf8) {
        s = (utf8) ? utf8Encode(s) : s;
        return binb2rstr(binb(rstr2binb(s), s.length * 8));
      }

      /**
       * Calculate the HMAC-sha256 of a key and some data (raw strings)
       */

      function rstr_hmac(key, data) {
        key = (utf8) ? utf8Encode(key) : key;
        data = (utf8) ? utf8Encode(data) : data;
        var hash, i = 0,
          bkey = rstr2binb(key),
          ipad = Array(16),
          opad = Array(16);

        if (bkey.length > 16) {
          bkey = binb(bkey, key.length * 8);
        }

        for (; i < 16; i += 1) {
          ipad[i] = bkey[i] ^ 0x36363636;
          opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        hash = binb(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
        return binb2rstr(binb(opad.concat(hash), 512 + 256));
      }

      /*
       * Main sha256 function, with its support functions
       */

      function sha256_S(X, n) {
        return (X >>> n) | (X << (32 - n));
      }

      function sha256_R(X, n) {
        return (X >>> n);
      }

      function sha256_Ch(x, y, z) {
        return ((x & y) ^ ((~x) & z));
      }

      function sha256_Maj(x, y, z) {
        return ((x & y) ^ (x & z) ^ (y & z));
      }

      function sha256_Sigma0256(x) {
        return (sha256_S(x, 2) ^ sha256_S(x, 13) ^ sha256_S(x, 22));
      }

      function sha256_Sigma1256(x) {
        return (sha256_S(x, 6) ^ sha256_S(x, 11) ^ sha256_S(x, 25));
      }

      function sha256_Gamma0256(x) {
        return (sha256_S(x, 7) ^ sha256_S(x, 18) ^ sha256_R(x, 3));
      }

      function sha256_Gamma1256(x) {
        return (sha256_S(x, 17) ^ sha256_S(x, 19) ^ sha256_R(x, 10));
      }

      function sha256_Sigma0512(x) {
        return (sha256_S(x, 28) ^ sha256_S(x, 34) ^ sha256_S(x, 39));
      }

      function sha256_Sigma1512(x) {
        return (sha256_S(x, 14) ^ sha256_S(x, 18) ^ sha256_S(x, 41));
      }

      function sha256_Gamma0512(x) {
        return (sha256_S(x, 1) ^ sha256_S(x, 8) ^ sha256_R(x, 7));
      }

      function sha256_Gamma1512(x) {
        return (sha256_S(x, 19) ^ sha256_S(x, 61) ^ sha256_R(x, 6));
      }

      sha256_K = [
        1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993, -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987,
        1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522,
        264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585,
        113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
        1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885, -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344,
        430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
        1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872, -1866530822, -1538233109, -1090935817, -965641998
      ];

      function binb(m, l) {
        var HASH = [1779033703, -1150833019, 1013904242, -1521486534,
          1359893119, -1694144372, 528734635, 1541459225
        ];
        var W = new Array(64);
        var a, b, c, d, e, f, g, h;
        var i, j, T1, T2;

        /* append padding */
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;

        for (i = 0; i < m.length; i += 16) {
          a = HASH[0];
          b = HASH[1];
          c = HASH[2];
          d = HASH[3];
          e = HASH[4];
          f = HASH[5];
          g = HASH[6];
          h = HASH[7];

          for (j = 0; j < 64; j += 1) {
            if (j < 16) {
              W[j] = m[j + i];
            } else {
              W[j] = safe_add(safe_add(safe_add(sha256_Gamma1256(W[j - 2]), W[j - 7]),
                sha256_Gamma0256(W[j - 15])), W[j - 16]);
            }

            T1 = safe_add(safe_add(safe_add(safe_add(h, sha256_Sigma1256(e)), sha256_Ch(e, f, g)),
              sha256_K[j]), W[j]);
            T2 = safe_add(sha256_Sigma0256(a), sha256_Maj(a, b, c));
            h = g;
            g = f;
            f = e;
            e = safe_add(d, T1);
            d = c;
            c = b;
            b = a;
            a = safe_add(T1, T2);
          }

          HASH[0] = safe_add(a, HASH[0]);
          HASH[1] = safe_add(b, HASH[1]);
          HASH[2] = safe_add(c, HASH[2]);
          HASH[3] = safe_add(d, HASH[3]);
          HASH[4] = safe_add(e, HASH[4]);
          HASH[5] = safe_add(f, HASH[5]);
          HASH[6] = safe_add(g, HASH[6]);
          HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
      }

    },

    /**
     * @class Hashes.SHA512
     * @param {config}
     *
     * A JavaScript implementation of the Secure Hash Algorithm, SHA-512, as defined in FIPS 180-2
     * Version 2.2 Copyright Anonymous Contributor, Paul Johnston 2000 - 2009.
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * See http://pajhome.org.uk/crypt/md5 for details.
     */
    SHA512: function(options) {
      /**
       * Private properties configuration variables. You may need to tweak these to be compatible with
       * the server-side, but the defaults work in most cases.
       * @see this.setUpperCase() method
       * @see this.setPad() method
       */
      var hexcase = (options && typeof options.uppercase === 'boolean') ? options.uppercase : false,
        /* hexadecimal output case format. false - lowercase; true - uppercase  */
        b64pad = (options && typeof options.pad === 'string') ? options.pad : '=',
        /* base-64 pad character. Default '=' for strict RFC compliance   */
        utf8 = (options && typeof options.utf8 === 'boolean') ? options.utf8 : true,
        /* enable/disable utf8 encoding */
        sha512_k;

      /* privileged (public) methods */
      this.hex = function(s) {
        return rstr2hex(rstr(s));
      };
      this.b64 = function(s) {
        return rstr2b64(rstr(s), b64pad);
      };
      this.any = function(s, e) {
        return rstr2any(rstr(s), e);
      };
      this.raw = function(s) {
        return rstr(s, utf8);
      };
      this.hex_hmac = function(k, d) {
        return rstr2hex(rstr_hmac(k, d));
      };
      this.b64_hmac = function(k, d) {
        return rstr2b64(rstr_hmac(k, d), b64pad);
      };
      this.any_hmac = function(k, d, e) {
        return rstr2any(rstr_hmac(k, d), e);
      };
      /**
       * Perform a simple self-test to see if the VM is working
       * @return {String} Hexadecimal hash sample
       * @public
       */
      this.vm_test = function() {
        return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
      };
      /**
       * @description Enable/disable uppercase hexadecimal returned string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUpperCase = function(a) {
        if (typeof a === 'boolean') {
          hexcase = a;
        }
        return this;
      };
      /**
       * @description Defines a base64 pad string
       * @param {string} Pad
       * @return {Object} this
       * @public
       */
      this.setPad = function(a) {
        b64pad = a || b64pad;
        return this;
      };
      /**
       * @description Defines a base64 pad string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUTF8 = function(a) {
        if (typeof a === 'boolean') {
          utf8 = a;
        }
        return this;
      };

      /* private methods */

      /**
       * Calculate the SHA-512 of a raw string
       */

      function rstr(s) {
        s = (utf8) ? utf8Encode(s) : s;
        return binb2rstr(binb(rstr2binb(s), s.length * 8));
      }
      /*
       * Calculate the HMAC-SHA-512 of a key and some data (raw strings)
       */

      function rstr_hmac(key, data) {
        key = (utf8) ? utf8Encode(key) : key;
        data = (utf8) ? utf8Encode(data) : data;

        var hash, i = 0,
          bkey = rstr2binb(key),
          ipad = Array(32),
          opad = Array(32);

        if (bkey.length > 32) {
          bkey = binb(bkey, key.length * 8);
        }

        for (; i < 32; i += 1) {
          ipad[i] = bkey[i] ^ 0x36363636;
          opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        hash = binb(ipad.concat(rstr2binb(data)), 1024 + data.length * 8);
        return binb2rstr(binb(opad.concat(hash), 1024 + 512));
      }

      /**
       * Calculate the SHA-512 of an array of big-endian dwords, and a bit length
       */

      function binb(x, len) {
        var j, i, l,
          W = new Array(80),
          hash = new Array(16),
          //Initial hash values
          H = [
            new int64(0x6a09e667, -205731576),
            new int64(-1150833019, -2067093701),
            new int64(0x3c6ef372, -23791573),
            new int64(-1521486534, 0x5f1d36f1),
            new int64(0x510e527f, -1377402159),
            new int64(-1694144372, 0x2b3e6c1f),
            new int64(0x1f83d9ab, -79577749),
            new int64(0x5be0cd19, 0x137e2179)
          ],
          T1 = new int64(0, 0),
          T2 = new int64(0, 0),
          a = new int64(0, 0),
          b = new int64(0, 0),
          c = new int64(0, 0),
          d = new int64(0, 0),
          e = new int64(0, 0),
          f = new int64(0, 0),
          g = new int64(0, 0),
          h = new int64(0, 0),
          //Temporary variables not specified by the document
          s0 = new int64(0, 0),
          s1 = new int64(0, 0),
          Ch = new int64(0, 0),
          Maj = new int64(0, 0),
          r1 = new int64(0, 0),
          r2 = new int64(0, 0),
          r3 = new int64(0, 0);

        if (sha512_k === undefined) {
          //SHA512 constants
          sha512_k = [
            new int64(0x428a2f98, -685199838), new int64(0x71374491, 0x23ef65cd),
            new int64(-1245643825, -330482897), new int64(-373957723, -2121671748),
            new int64(0x3956c25b, -213338824), new int64(0x59f111f1, -1241133031),
            new int64(-1841331548, -1357295717), new int64(-1424204075, -630357736),
            new int64(-670586216, -1560083902), new int64(0x12835b01, 0x45706fbe),
            new int64(0x243185be, 0x4ee4b28c), new int64(0x550c7dc3, -704662302),
            new int64(0x72be5d74, -226784913), new int64(-2132889090, 0x3b1696b1),
            new int64(-1680079193, 0x25c71235), new int64(-1046744716, -815192428),
            new int64(-459576895, -1628353838), new int64(-272742522, 0x384f25e3),
            new int64(0xfc19dc6, -1953704523), new int64(0x240ca1cc, 0x77ac9c65),
            new int64(0x2de92c6f, 0x592b0275), new int64(0x4a7484aa, 0x6ea6e483),
            new int64(0x5cb0a9dc, -1119749164), new int64(0x76f988da, -2096016459),
            new int64(-1740746414, -295247957), new int64(-1473132947, 0x2db43210),
            new int64(-1341970488, -1728372417), new int64(-1084653625, -1091629340),
            new int64(-958395405, 0x3da88fc2), new int64(-710438585, -1828018395),
            new int64(0x6ca6351, -536640913), new int64(0x14292967, 0xa0e6e70),
            new int64(0x27b70a85, 0x46d22ffc), new int64(0x2e1b2138, 0x5c26c926),
            new int64(0x4d2c6dfc, 0x5ac42aed), new int64(0x53380d13, -1651133473),
            new int64(0x650a7354, -1951439906), new int64(0x766a0abb, 0x3c77b2a8),
            new int64(-2117940946, 0x47edaee6), new int64(-1838011259, 0x1482353b),
            new int64(-1564481375, 0x4cf10364), new int64(-1474664885, -1136513023),
            new int64(-1035236496, -789014639), new int64(-949202525, 0x654be30),
            new int64(-778901479, -688958952), new int64(-694614492, 0x5565a910),
            new int64(-200395387, 0x5771202a), new int64(0x106aa070, 0x32bbd1b8),
            new int64(0x19a4c116, -1194143544), new int64(0x1e376c08, 0x5141ab53),
            new int64(0x2748774c, -544281703), new int64(0x34b0bcb5, -509917016),
            new int64(0x391c0cb3, -976659869), new int64(0x4ed8aa4a, -482243893),
            new int64(0x5b9cca4f, 0x7763e373), new int64(0x682e6ff3, -692930397),
            new int64(0x748f82ee, 0x5defb2fc), new int64(0x78a5636f, 0x43172f60),
            new int64(-2067236844, -1578062990), new int64(-1933114872, 0x1a6439ec),
            new int64(-1866530822, 0x23631e28), new int64(-1538233109, -561857047),
            new int64(-1090935817, -1295615723), new int64(-965641998, -479046869),
            new int64(-903397682, -366583396), new int64(-779700025, 0x21c0c207),
            new int64(-354779690, -840897762), new int64(-176337025, -294727304),
            new int64(0x6f067aa, 0x72176fba), new int64(0xa637dc5, -1563912026),
            new int64(0x113f9804, -1090974290), new int64(0x1b710b35, 0x131c471b),
            new int64(0x28db77f5, 0x23047d84), new int64(0x32caab7b, 0x40c72493),
            new int64(0x3c9ebe0a, 0x15c9bebc), new int64(0x431d67c4, -1676669620),
            new int64(0x4cc5d4be, -885112138), new int64(0x597f299c, -60457430),
            new int64(0x5fcb6fab, 0x3ad6faec), new int64(0x6c44198c, 0x4a475817)
          ];
        }

        for (i = 0; i < 80; i += 1) {
          W[i] = new int64(0, 0);
        }

        // append padding to the source string. The format is described in the FIPS.
        x[len >> 5] |= 0x80 << (24 - (len & 0x1f));
        x[((len + 128 >> 10) << 5) + 31] = len;
        l = x.length;
        for (i = 0; i < l; i += 32) { //32 dwords is the block size
          int64copy(a, H[0]);
          int64copy(b, H[1]);
          int64copy(c, H[2]);
          int64copy(d, H[3]);
          int64copy(e, H[4]);
          int64copy(f, H[5]);
          int64copy(g, H[6]);
          int64copy(h, H[7]);

          for (j = 0; j < 16; j += 1) {
            W[j].h = x[i + 2 * j];
            W[j].l = x[i + 2 * j + 1];
          }

          for (j = 16; j < 80; j += 1) {
            //sigma1
            int64rrot(r1, W[j - 2], 19);
            int64revrrot(r2, W[j - 2], 29);
            int64shr(r3, W[j - 2], 6);
            s1.l = r1.l ^ r2.l ^ r3.l;
            s1.h = r1.h ^ r2.h ^ r3.h;
            //sigma0
            int64rrot(r1, W[j - 15], 1);
            int64rrot(r2, W[j - 15], 8);
            int64shr(r3, W[j - 15], 7);
            s0.l = r1.l ^ r2.l ^ r3.l;
            s0.h = r1.h ^ r2.h ^ r3.h;

            int64add4(W[j], s1, W[j - 7], s0, W[j - 16]);
          }

          for (j = 0; j < 80; j += 1) {
            //Ch
            Ch.l = (e.l & f.l) ^ (~e.l & g.l);
            Ch.h = (e.h & f.h) ^ (~e.h & g.h);

            //Sigma1
            int64rrot(r1, e, 14);
            int64rrot(r2, e, 18);
            int64revrrot(r3, e, 9);
            s1.l = r1.l ^ r2.l ^ r3.l;
            s1.h = r1.h ^ r2.h ^ r3.h;

            //Sigma0
            int64rrot(r1, a, 28);
            int64revrrot(r2, a, 2);
            int64revrrot(r3, a, 7);
            s0.l = r1.l ^ r2.l ^ r3.l;
            s0.h = r1.h ^ r2.h ^ r3.h;

            //Maj
            Maj.l = (a.l & b.l) ^ (a.l & c.l) ^ (b.l & c.l);
            Maj.h = (a.h & b.h) ^ (a.h & c.h) ^ (b.h & c.h);

            int64add5(T1, h, s1, Ch, sha512_k[j], W[j]);
            int64add(T2, s0, Maj);

            int64copy(h, g);
            int64copy(g, f);
            int64copy(f, e);
            int64add(e, d, T1);
            int64copy(d, c);
            int64copy(c, b);
            int64copy(b, a);
            int64add(a, T1, T2);
          }
          int64add(H[0], H[0], a);
          int64add(H[1], H[1], b);
          int64add(H[2], H[2], c);
          int64add(H[3], H[3], d);
          int64add(H[4], H[4], e);
          int64add(H[5], H[5], f);
          int64add(H[6], H[6], g);
          int64add(H[7], H[7], h);
        }

        //represent the hash as an array of 32-bit dwords
        for (i = 0; i < 8; i += 1) {
          hash[2 * i] = H[i].h;
          hash[2 * i + 1] = H[i].l;
        }
        return hash;
      }

      //A constructor for 64-bit numbers

      function int64(h, l) {
        this.h = h;
        this.l = l;
        //this.toString = int64toString;
      }

      //Copies src into dst, assuming both are 64-bit numbers

      function int64copy(dst, src) {
        dst.h = src.h;
        dst.l = src.l;
      }

      //Right-rotates a 64-bit number by shift
      //Won't handle cases of shift>=32
      //The function revrrot() is for that

      function int64rrot(dst, x, shift) {
        dst.l = (x.l >>> shift) | (x.h << (32 - shift));
        dst.h = (x.h >>> shift) | (x.l << (32 - shift));
      }

      //Reverses the dwords of the source and then rotates right by shift.
      //This is equivalent to rotation by 32+shift

      function int64revrrot(dst, x, shift) {
        dst.l = (x.h >>> shift) | (x.l << (32 - shift));
        dst.h = (x.l >>> shift) | (x.h << (32 - shift));
      }

      //Bitwise-shifts right a 64-bit number by shift
      //Won't handle shift>=32, but it's never needed in SHA512

      function int64shr(dst, x, shift) {
        dst.l = (x.l >>> shift) | (x.h << (32 - shift));
        dst.h = (x.h >>> shift);
      }

      //Adds two 64-bit numbers
      //Like the original implementation, does not rely on 32-bit operations

      function int64add(dst, x, y) {
        var w0 = (x.l & 0xffff) + (y.l & 0xffff);
        var w1 = (x.l >>> 16) + (y.l >>> 16) + (w0 >>> 16);
        var w2 = (x.h & 0xffff) + (y.h & 0xffff) + (w1 >>> 16);
        var w3 = (x.h >>> 16) + (y.h >>> 16) + (w2 >>> 16);
        dst.l = (w0 & 0xffff) | (w1 << 16);
        dst.h = (w2 & 0xffff) | (w3 << 16);
      }

      //Same, except with 4 addends. Works faster than adding them one by one.

      function int64add4(dst, a, b, c, d) {
        var w0 = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff) + (d.l & 0xffff);
        var w1 = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (w0 >>> 16);
        var w2 = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) + (d.h & 0xffff) + (w1 >>> 16);
        var w3 = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (w2 >>> 16);
        dst.l = (w0 & 0xffff) | (w1 << 16);
        dst.h = (w2 & 0xffff) | (w3 << 16);
      }

      //Same, except with 5 addends

      function int64add5(dst, a, b, c, d, e) {
        var w0 = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff) + (d.l & 0xffff) + (e.l & 0xffff),
          w1 = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (e.l >>> 16) + (w0 >>> 16),
          w2 = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) + (d.h & 0xffff) + (e.h & 0xffff) + (w1 >>> 16),
          w3 = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (e.h >>> 16) + (w2 >>> 16);
        dst.l = (w0 & 0xffff) | (w1 << 16);
        dst.h = (w2 & 0xffff) | (w3 << 16);
      }
    },
    /**
     * @class Hashes.RMD160
     * @constructor
     * @param {Object} [config]
     *
     * A JavaScript implementation of the RIPEMD-160 Algorithm
     * Version 2.2 Copyright Jeremy Lin, Paul Johnston 2000 - 2009.
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * See http://pajhome.org.uk/crypt/md5 for details.
     * Also http://www.ocf.berkeley.edu/~jjlin/jsotp/
     */
    RMD160: function(options) {
      /**
       * Private properties configuration variables. You may need to tweak these to be compatible with
       * the server-side, but the defaults work in most cases.
       * @see this.setUpperCase() method
       * @see this.setPad() method
       */
      var hexcase = (options && typeof options.uppercase === 'boolean') ? options.uppercase : false,
        /* hexadecimal output case format. false - lowercase; true - uppercase  */
        b64pad = (options && typeof options.pad === 'string') ? options.pa : '=',
        /* base-64 pad character. Default '=' for strict RFC compliance   */
        utf8 = (options && typeof options.utf8 === 'boolean') ? options.utf8 : true,
        /* enable/disable utf8 encoding */
        rmd160_r1 = [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
          7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
          3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
          1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
          4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
        ],
        rmd160_r2 = [
          5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
          6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
          15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
          8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
          12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
        ],
        rmd160_s1 = [
          11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
          7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
          11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
          11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
          9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
        ],
        rmd160_s2 = [
          8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
          9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
          9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
          15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
          8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
        ];

      /* privileged (public) methods */
      this.hex = function(s) {
        return rstr2hex(rstr(s, utf8));
      };
      this.b64 = function(s) {
        return rstr2b64(rstr(s, utf8), b64pad);
      };
      this.any = function(s, e) {
        return rstr2any(rstr(s, utf8), e);
      };
      this.raw = function(s) {
        return rstr(s, utf8);
      };
      this.hex_hmac = function(k, d) {
        return rstr2hex(rstr_hmac(k, d));
      };
      this.b64_hmac = function(k, d) {
        return rstr2b64(rstr_hmac(k, d), b64pad);
      };
      this.any_hmac = function(k, d, e) {
        return rstr2any(rstr_hmac(k, d), e);
      };
      /**
       * Perform a simple self-test to see if the VM is working
       * @return {String} Hexadecimal hash sample
       * @public
       */
      this.vm_test = function() {
        return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
      };
      /**
       * @description Enable/disable uppercase hexadecimal returned string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUpperCase = function(a) {
        if (typeof a === 'boolean') {
          hexcase = a;
        }
        return this;
      };
      /**
       * @description Defines a base64 pad string
       * @param {string} Pad
       * @return {Object} this
       * @public
       */
      this.setPad = function(a) {
        if (typeof a !== 'undefined') {
          b64pad = a;
        }
        return this;
      };
      /**
       * @description Defines a base64 pad string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUTF8 = function(a) {
        if (typeof a === 'boolean') {
          utf8 = a;
        }
        return this;
      };

      /* private methods */

      /**
       * Calculate the rmd160 of a raw string
       */

      function rstr(s) {
        s = (utf8) ? utf8Encode(s) : s;
        return binl2rstr(binl(rstr2binl(s), s.length * 8));
      }

      /**
       * Calculate the HMAC-rmd160 of a key and some data (raw strings)
       */

      function rstr_hmac(key, data) {
        key = (utf8) ? utf8Encode(key) : key;
        data = (utf8) ? utf8Encode(data) : data;
        var i, hash,
          bkey = rstr2binl(key),
          ipad = Array(16),
          opad = Array(16);

        if (bkey.length > 16) {
          bkey = binl(bkey, key.length * 8);
        }

        for (i = 0; i < 16; i += 1) {
          ipad[i] = bkey[i] ^ 0x36363636;
          opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = binl(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binl(opad.concat(hash), 512 + 160));
      }

      /**
       * Convert an array of little-endian words to a string
       */

      function binl2rstr(input) {
        var i, output = '',
          l = input.length * 32;
        for (i = 0; i < l; i += 8) {
          output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        }
        return output;
      }

      /**
       * Calculate the RIPE-MD160 of an array of little-endian words, and a bit length.
       */

      function binl(x, len) {
        var T, j, i, l,
          h0 = 0x67452301,
          h1 = 0xefcdab89,
          h2 = 0x98badcfe,
          h3 = 0x10325476,
          h4 = 0xc3d2e1f0,
          A1, B1, C1, D1, E1,
          A2, B2, C2, D2, E2;

        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;
        l = x.length;

        for (i = 0; i < l; i += 16) {
          A1 = A2 = h0;
          B1 = B2 = h1;
          C1 = C2 = h2;
          D1 = D2 = h3;
          E1 = E2 = h4;
          for (j = 0; j <= 79; j += 1) {
            T = safe_add(A1, rmd160_f(j, B1, C1, D1));
            T = safe_add(T, x[i + rmd160_r1[j]]);
            T = safe_add(T, rmd160_K1(j));
            T = safe_add(bit_rol(T, rmd160_s1[j]), E1);
            A1 = E1;
            E1 = D1;
            D1 = bit_rol(C1, 10);
            C1 = B1;
            B1 = T;
            T = safe_add(A2, rmd160_f(79 - j, B2, C2, D2));
            T = safe_add(T, x[i + rmd160_r2[j]]);
            T = safe_add(T, rmd160_K2(j));
            T = safe_add(bit_rol(T, rmd160_s2[j]), E2);
            A2 = E2;
            E2 = D2;
            D2 = bit_rol(C2, 10);
            C2 = B2;
            B2 = T;
          }

          T = safe_add(h1, safe_add(C1, D2));
          h1 = safe_add(h2, safe_add(D1, E2));
          h2 = safe_add(h3, safe_add(E1, A2));
          h3 = safe_add(h4, safe_add(A1, B2));
          h4 = safe_add(h0, safe_add(B1, C2));
          h0 = T;
        }
        return [h0, h1, h2, h3, h4];
      }

      // specific algorithm methods

      function rmd160_f(j, x, y, z) {
        return (0 <= j && j <= 15) ? (x ^ y ^ z) :
          (16 <= j && j <= 31) ? (x & y) | (~x & z) :
          (32 <= j && j <= 47) ? (x | ~y) ^ z :
          (48 <= j && j <= 63) ? (x & z) | (y & ~z) :
          (64 <= j && j <= 79) ? x ^ (y | ~z) :
          'rmd160_f: j out of range';
      }

      function rmd160_K1(j) {
        return (0 <= j && j <= 15) ? 0x00000000 :
          (16 <= j && j <= 31) ? 0x5a827999 :
          (32 <= j && j <= 47) ? 0x6ed9eba1 :
          (48 <= j && j <= 63) ? 0x8f1bbcdc :
          (64 <= j && j <= 79) ? 0xa953fd4e :
          'rmd160_K1: j out of range';
      }

      function rmd160_K2(j) {
        return (0 <= j && j <= 15) ? 0x50a28be6 :
          (16 <= j && j <= 31) ? 0x5c4dd124 :
          (32 <= j && j <= 47) ? 0x6d703ef3 :
          (48 <= j && j <= 63) ? 0x7a6d76e9 :
          (64 <= j && j <= 79) ? 0x00000000 :
          'rmd160_K2: j out of range';
      }
    }
  };

  // exposes Hashes
  (function(window, undefined) {
    var freeExports = false;
    if (typeof exports === 'object') {
      freeExports = exports;
      if (exports && typeof global === 'object' && global && global === global.global) {
        window = global;
      }
    }

    if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
      // define as an anonymous module, so, through path mapping, it can be aliased
      define(function() {
        return Hashes;
      });
    } else if (freeExports) {
      // in Node.js or RingoJS v0.8.0+
      if (typeof module === 'object' && module && module.exports === freeExports) {
        module.exports = Hashes;
      }
      // in Narwhal or RingoJS v0.7.0-
      else {
        freeExports.Hashes = Hashes;
      }
    } else {
      // in a browser or Rhino
      window.Hashes = Hashes;
    }
  }(this));
}()); // IIFE

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(_dereq_,module,exports){
module.exports={
  "name": "wtf_wikipedia",
  "description": "parse wikiscript into json",
  "version": "5.1.2",
  "author": "Spencer Kelly <spencermountain@gmail.com> (http://spencermounta.in)",
  "repository": {
    "type": "git",
    "url": "git://github.com/spencermountain/wtf_wikipedia.git"
  },
  "main": "./src/index.js",
  "unpkg": "./builds/wtf_wikipedia.min.js",
  "scripts": {
    "start": "node ./scripts/demo.js",
    "test": "node ./scripts/test.js",
    "postpublish": "node ./scripts/coverage.js",
    "coverage": "node ./scripts/coverage.js",
    "testb": "TESTENV=prod node ./scripts/test.js",
    "watch": "amble ./scratch.js",
    "build": "node ./scripts/build.js"
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
    "cross-fetch": "2.2.2",
    "jshashes": "1.0.7"
  },
  "devDependencies": {
    "amble": "0.0.6",
    "babel-cli": "6.26.0",
    "babel-preset-env": "1.7.0",
    "babelify": "8.0.0",
    "browserify": "16.2.2",
    "codacy-coverage": "3.0.0",
    "derequire": "2.0.6",
    "nyc": "12.0.2",
    "shelljs": "0.8.2",
    "tap-dancer": "0.0.3",
    "tape": "4.9.1",
    "uglify-js": "3.4.6"
  },
  "license": "MIT"
}
},{}],4:[function(_dereq_,module,exports){
'use strict';

//these are used for the sentence-splitter
module.exports = ['jr', 'mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'sen', 'corp', 'calif', 'rep', 'gov', 'atty', 'supt', 'det', 'rev', 'col', 'gen', 'lt', 'cmdr', 'adm', 'capt', 'sgt', 'cpl', 'maj', 'dept', 'univ', 'assn', 'bros', 'inc', 'ltd', 'co', 'corp', 'arc', 'al', 'ave', 'blvd', 'cl', 'ct', 'cres', 'exp', 'rd', 'st', 'dist', 'mt', 'ft', 'fy', 'hwy', 'la', 'pd', 'pl', 'plz', 'tce', 'Ala', 'Ariz', 'Ark', 'Cal', 'Calif', 'Col', 'Colo', 'Conn', 'Del', 'Fed', 'Fla', 'Ga', 'Ida', 'Id', 'Ill', 'Ind', 'Ia', 'Kan', 'Kans', 'Ken', 'Ky', 'La', 'Me', 'Md', 'Mass', 'Mich', 'Minn', 'Miss', 'Mo', 'Mont', 'Neb', 'Nebr', 'Nev', 'Mex', 'Okla', 'Ok', 'Ore', 'Penna', 'Penn', 'Pa', 'Dak', 'Tenn', 'Tex', 'Ut', 'Vt', 'Va', 'Wash', 'Wis', 'Wisc', 'Wy', 'Wyo', 'USAFA', 'Alta', 'Ont', 'QuÔøΩ', 'Sask', 'Yuk', 'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'sept', 'vs', 'etc', 'esp', 'llb', 'md', 'bl', 'phd', 'ma', 'ba', 'miss', 'misses', 'mister', 'sir', 'esq', 'mstr', 'lit', 'fl', 'ex', 'eg', 'sep', 'sept', '..'];

},{}],5:[function(_dereq_,module,exports){
'use strict';

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
  sources: [
  //blacklist these headings, as they're not plain-text
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

},{}],6:[function(_dereq_,module,exports){
'use strict';

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
  alswiktionary: 'https://als.wiktionary.org',
  alswikibooks: 'https://als.wikibooks.org',
  alswikiquote: 'https://als.wikiquote.org',
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
  be_x_oldwiki: 'https://be-x-old.wikipedia.org',
  be_x_oldwikipedia: 'https://be-x-old.wikipedia.org',
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
  diqwiki: 'https://diq.wikipedia.org',
  diqwikipedia: 'https://diq.wikipedia.org',
  dsbwiki: 'https://dsb.wikipedia.org',
  dsbwikipedia: 'https://dsb.wikipedia.org',
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
  hifwiki: 'https://hif.wikipedia.org',
  hifwikipedia: 'https://hif.wikipedia.org',
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
  mowiki: 'https://mo.wikipedia.org',
  mowikipedia: 'https://mo.wikipedia.org',
  mowiktionary: 'https://mo.wiktionary.org',
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
  pnbwiki: 'https://pnb.wikipedia.org',
  pnbwikipedia: 'https://pnb.wikipedia.org',
  pnbwiktionary: 'https://pnb.wiktionary.org',
  pntwiki: 'https://pnt.wikipedia.org',
  pntwikipedia: 'https://pnt.wikipedia.org',
  pswiki: 'https://ps.wikipedia.org',
  pswikipedia: 'https://ps.wikipedia.org',
  pswiktionary: 'https://ps.wiktionary.org',
  pswikibooks: 'https://ps.wikibooks.org',
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
  sahwikisource: 'https://sah.wikisource.org',
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

},{}],7:[function(_dereq_,module,exports){
'use strict';

var parse = _dereq_('./index');
var sectionMap = _dereq_('./_sectionMap');
var toMarkdown = _dereq_('./toMarkdown');
var toHtml = _dereq_('./toHtml');
var toJSON = _dereq_('./toJson');
var toLatex = _dereq_('./toLatex');
var setDefaults = _dereq_('../lib/setDefaults');
var aliasList = _dereq_('../lib/aliases');

var defaults = {
  infoboxes: true,
  tables: true,
  lists: true,
  citations: true,
  images: true,
  sentences: true
};

//
var Document = function Document(wiki, options) {
  this.options = options || {};
  this.data = parse(wiki, this.options);

  // preserve wiki sources in Document to access
  Object.defineProperty(this, 'wiki', {
    enumerable: false, // hide it in console.logs
    value: wiki
  });
};

var methods = {
  title: function title() {
    if (this.options.title) {
      return this.options.title;
    }
    var guess = null;
    //guess the title of this page from first sentence bolding
    var sen = this.sentences(0);
    if (sen) {
      guess = sen.bolds(0);
    }
    return guess;
  },
  // allow reparsing after alteration of downloaded wiki source
  reparse: function reparse() {
    this.data = parse(this.wiki, this.options);
  },
  wikitext: function wikitext(str) {
    if (str) {
      this.wiki = str;
    }
    return this.wiki;
  },
  isRedirect: function isRedirect() {
    return this.data.type === 'redirect';
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
    });
    //grab a specific section, by its title
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
  sentences: function sentences(n) {
    var arr = [];
    this.sections().forEach(function (sec) {
      sec.sentences().forEach(function (s) {
        arr.push(s);
      });
    });
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr;
  },
  images: function images(clue) {
    var arr = sectionMap(this, 'images', null);
    //grab image from infobox, first
    this.infoboxes().forEach(function (info) {
      if (info.data.image) {
        arr.unshift(info.image()); //put it at the top
      }
    });
    //look for 'gallery' templates, too
    this.templates().forEach(function (obj) {
      if (obj.template === 'gallery') {
        obj.images = obj.images || [];
        obj.images.forEach(function (img) {
          return arr.push(img);
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
  lists: function lists(clue) {
    return sectionMap(this, 'lists', clue);
  },
  tables: function tables(clue) {
    return sectionMap(this, 'tables', clue);
  },
  templates: function templates(clue) {
    return sectionMap(this, 'templates', clue);
  },
  infoboxes: function infoboxes(clue) {
    return sectionMap(this, 'infoboxes', clue);
  },
  citations: function citations(clue) {
    return sectionMap(this, 'citations', clue);
  },
  coordinates: function coordinates(clue) {
    return sectionMap(this, 'coordinates', clue);
  },
  text: function text(options) {
    options = setDefaults(options, defaults);
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
};

//add singular-methods
var plurals = ['sections', 'infoboxes', 'sentences', 'citations', 'coordinates', 'tables', 'links', 'images', 'categories'];
plurals.forEach(function (fn) {
  var sing = fn.replace(/ies$/, 'y');
  sing = sing.replace(/e?s$/, '');
  methods[sing] = function (n) {
    var res = this[fn](n);
    if (res.length) {
      return res[0] || null;
    }
    return res;
  };
});

Object.keys(methods).forEach(function (k) {
  Document.prototype[k] = methods[k];
});
//add alises, too
Object.keys(aliasList).forEach(function (k) {
  Document.prototype[k] = methods[aliasList[k]];
});
//alias this one
Document.prototype.isDisambig = Document.prototype.isDisambiguation;
Document.prototype.references = Document.prototype.citations;

module.exports = Document;

},{"../lib/aliases":31,"../lib/setDefaults":35,"./_sectionMap":8,"./index":11,"./toHtml":15,"./toJson":16,"./toLatex":17,"./toMarkdown":18}],8:[function(_dereq_,module,exports){
'use strict';

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

},{}],9:[function(_dereq_,module,exports){
'use strict';

var i18n = _dereq_('../data/i18n');
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

},{"../data/i18n":5}],10:[function(_dereq_,module,exports){
'use strict';

var i18n = _dereq_('../data/i18n');
var template_reg = new RegExp('\\{\\{ ?(' + i18n.disambigs.join('|') + ')(\\|[a-z, =]*?)? ?\\}\\}', 'i');

//special disambig-templates en-wikipedia uses
var d = ' disambiguation';
var english = ['airport', 'biology' + d, 'call sign' + d, 'caselaw' + d, 'chinese title' + d, 'dab', 'dab', 'disamb', 'disambig', 'disambiguation cleanup', 'genus' + d, 'geodis', 'hndis', 'hospital' + d, 'lake index', 'letter' + d, 'letter-number combination' + d, 'mathematical' + d, 'military unit' + d, 'mountainindex', 'number' + d, 'phonetics' + d, 'place name' + d, 'place name' + d, 'portal' + d, 'road' + d, 'school' + d, 'setindex', 'ship index', 'species latin name abbreviation' + d, 'species latin name' + d, 'split dab', 'sport index', 'station' + d, 'synagogue' + d, 'taxonomic authority' + d, 'taxonomy' + d, 'wp disambig'];
var enDisambigs = new RegExp('\\{\\{ ?(' + english.join('|') + ')(\\|[a-z, =]*?)? ?\\}\\}', 'i');

var isDisambig = function isDisambig(wiki) {
  //test for {{disambiguation}} templates
  if (template_reg.test(wiki) === true) {
    return true;
  }
  //more english-centric disambiguation templates

  //{{hndis}}, etc
  if (enDisambigs.test(wiki) === true) {
    return true;
  }

  //try 'may refer to' on first line for en-wiki?
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

},{"../data/i18n":5}],11:[function(_dereq_,module,exports){
'use strict';

var redirects = _dereq_('./redirects');
var disambig = _dereq_('./disambig');
var preProcess = _dereq_('./preProcess');
var parse = {
  section: _dereq_('../section'),
  // templates: require('./templates'),
  categories: _dereq_('./categories')
};

//convert wikiscript markup lang to json
var main = function main(wiki, options) {
  options = options || {};
  wiki = wiki || '';
  var r = {
    type: 'page',
    sections: [],
    interwiki: {},
    categories: [],
    coordinates: [],
    citations: []
  };
  //detect if page is just redirect, and return
  if (redirects.isRedirect(wiki) === true) {
    r.type = 'redirect';
    wiki = redirects.parse(wiki);
  }
  //detect if page is just disambiguator page, and return
  if (disambig.isDisambig(wiki) === true) {
    r.type = 'disambiguation';
  }
  if (options.page_identifier) {
    r.page_identifier = options.page_identifier;
  }
  if (options.lang_or_wikiid) {
    r.lang_or_wikiid = options.lang_or_wikiid;
  }
  //give ourselves a little head-start
  wiki = preProcess(r, wiki, options);
  //pull-out infoboxes and stuff
  // wiki = parse.templates(r, wiki, options);
  //pull-out [[category:whatevers]]
  wiki = parse.categories(r, wiki);
  //parse all the headings, and their texts/sentences
  r.sections = parse.section(wiki, options) || [];

  return r;
};

module.exports = main;

},{"../section":40,"./categories":9,"./disambig":10,"./preProcess":12,"./redirects":14}],12:[function(_dereq_,module,exports){
'use strict';

var kill_xml = _dereq_('./kill_xml');

//this mostly-formatting stuff can be cleaned-up first, to make life easier
function preProcess(r, wiki, options) {
  //remove comments
  wiki = wiki.replace(/<!--[^>]{0,2000}-->/g, '');
  wiki = wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/gi, '');
  //signitures
  wiki = wiki.replace(/~~{1,3}/, '');
  //windows newlines
  wiki = wiki.replace(/\r/g, '');
  //horizontal rule
  wiki = wiki.replace(/--{1,3}/, '');
  //space
  wiki = wiki.replace(/&nbsp;/g, ' ');
  //kill off interwiki links
  wiki = wiki.replace(/\[\[([a-z][a-z]|simple|war|ceb|min):.{2,60}\]\]/i, '');
  // these '{{^}}' things are nuts, and used as some ilicit spacing thing.
  wiki = wiki.replace(/\{\{\^\}\}/g, '');
  //yup, oxford comma template
  wiki = wiki.replace(/\{\{\,\}\}/g, ',');
  //give it the inglorious send-off it deserves..
  wiki = kill_xml(wiki, r, options);
  //({{template}},{{template}}) leaves empty parentheses
  wiki = wiki.replace(/\([,;: ]+?\)/g, '');
  return wiki;
}
module.exports = preProcess;
// console.log(preProcess("hi [[as:Plancton]] there"));
// console.log(preProcess('hello <br/> world'))
// console.log(preProcess("hello <asd f> world </h2>"))

},{"./kill_xml":13}],13:[function(_dereq_,module,exports){
'use strict';

//okay, i know you're not supposed to regex html, but...
//https://en.wikipedia.org/wiki/Help:HTML_in_wikitext

//these are things we throw-away
//these will mess-up if they're nested, but they're not usually.
var ignore = ['table', 'code', 'score', 'data', 'categorytree', 'charinsert', 'hiero', 'imagemap', 'inputbox', 'math', 'nowiki', 'poem', 'references', 'source', 'syntaxhighlight', 'timeline'];
var openTag = '< ?(' + ignore.join('|') + ') ?[^>]{0,200}>';
var closeTag = '< ?/ ?(' + ignore.join('|') + ') ?>';
var anyChar = '\\s\\S'; //including newline
var noThanks = new RegExp(openTag + '[' + anyChar + ']+?' + closeTag, 'ig');

var kill_xml = function kill_xml(wiki) {
  //(<ref> tags are parsed in Section class) - luckily, refs can't be recursive.
  //types of html/xml that we want to trash completely.
  wiki = wiki.replace(noThanks, ' ');
  //some xml-like fragments we can also kill
  wiki = wiki.replace(/ ?< ?(span|div|table|data) [a-zA-Z0-9=" ]{2,100}\/? ?> ?/g, ' '); //<ref name="asd">
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

},{}],14:[function(_dereq_,module,exports){
'use strict';

var i18n = _dereq_('../data/i18n');
//pulls target link out of redirect page
var REDIRECT_REGEX = new RegExp('^[ \n\t]*?#(' + i18n.redirects.join('|') + ') *?(\\[\\[.{2,60}?\\]\\])', 'i');

var isRedirect = function isRedirect(wiki) {
  return REDIRECT_REGEX.test(wiki);
};

var parse = function parse(wiki) {
  var m = wiki.match(REDIRECT_REGEX);
  if (m && m[2]) {
    return m[2];
  }
  return wiki;
};

module.exports = {
  isRedirect: isRedirect,
  parse: parse
};

},{"../data/i18n":5}],15:[function(_dereq_,module,exports){
'use strict';

//turn a Doc object into a HTML string
var toHtml = function toHtml(doc, options) {
  var data = doc.data;
  var html = '';
  //add the title on the topw
  // if (options.title === true && data.title) {
  //   html += '<h1>' + data.title + '</h1>\n';
  // }
  //render infoboxes (up at the top)
  if (options.infoboxes === true && data.infoboxes) {
    html += data.infoboxes.map(function (i) {
      return i.html(options);
    }).join('\n');
  }
  //render each section
  html += data.sections.map(function (s) {
    return s.html(options);
  }).join('\n');
  return html;
};
module.exports = toHtml;

},{}],16:[function(_dereq_,module,exports){
'use strict';

var setDefaults = _dereq_('../lib/setDefaults');
var defaults = {
  title: true,
  pageID: true,
  categories: true,
  citations: true,
  coordinates: true,
  infoboxes: true,
  sections: true,

  images: false, //these are already in sections/infoboxes
  plaintext: false,
  html: false,
  markdown: false
};

//an opinionated output of the most-wanted data
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
  if (options.citations && doc.citations().length > 0) {
    data.citations = doc.citations();
  }
  if (options.coordinates && doc.coordinates().length > 0) {
    data.coordinates = doc.coordinates();
  }

  //these need their own .json() method
  if (options.infoboxes) {
    data.infoboxes = doc.infoboxes().map(function (i) {
      return i.json();
    });
  }
  if (options.images) {
    data.images = doc.images().map(function (i) {
      return i.json();
    });
  }
  if (options.sections) {
    data.sections = doc.sections().map(function (i) {
      return i.json();
    });
  }

  //these are default-off
  if (options.plaintext) {
    data.plaintext = doc.plaintext(options);
  }
  if (options.markdown) {
    data.markdown = doc.markdown(options);
  }
  if (options.html) {
    data.html = doc.html(options);
  }
  return data;
};
module.exports = toJSON;

},{"../lib/setDefaults":35}],17:[function(_dereq_,module,exports){
'use strict';

var setDefaults = _dereq_('../lib/setDefaults');

var defaults = {
  infoboxes: true,
  tables: true,
  lists: true,
  title: true,
  images: true,
  links: true,
  formatting: true,
  sentences: true
};

//
var toLatex = function toLatex(doc, options) {
  options = setDefaults(options, defaults);
  var data = doc.data;
  var out = '';
  //add the title on the top
  // if (options.title === true && data.title) {
  //   out += '\\section{' + data.title + '}\n';
  // }
  //render infoboxes (up at the top)
  if (options.infoboxes === true && data.infoboxes) {
    out += data.infoboxes.map(function (i) {
      return i.latex(options);
    }).join('\n');
  }
  //render each section
  out += doc.sections().map(function (s) {
    return s.latex(options);
  }).join('\n');
  return out;
};
module.exports = toLatex;

},{"../lib/setDefaults":35}],18:[function(_dereq_,module,exports){
'use strict';

//turn a Doc object into a markdown string
var toMarkdown = function toMarkdown(doc, options) {
  var data = doc.data;
  var md = '';
  //add the title on the top
  // if (data.title) {
  //   md += '# ' + data.title + '\n';
  // }
  //render infoboxes (up at the top)
  if (options.infoboxes === true && data.infoboxes) {
    md += doc.infoboxes().map(function (infobox) {
      return infobox.markdown(options);
    }).join('\n\n');
  }
  //render each section
  md += data.sections.map(function (s) {
    return s.markdown(options);
  }).join('\n\n');
  return md;
};
module.exports = toMarkdown;

},{}],19:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//grab the content of any article, off the api
var fetch = _dereq_('cross-fetch');
var site_map = _dereq_('./data/site_map');
var Document = _dereq_('./document/Document');
// const redirects = require('../parse/page/redirects');
var isNumber = /^[0-9]*$/;

//construct a lookup-url for the wikipedia api
var makeUrl = function makeUrl(title, lang) {
  lang = lang || 'en';
  var lookup = 'titles';
  if (isNumber.test(title) && title.length > 3) {
    lookup = 'curid';
  }
  var url = 'https://' + lang + '.wikipedia.org/w/api.php';
  if (site_map[lang]) {
    url = site_map[lang] + '/w/api.php';
  }
  //we use the 'revisions' api here, instead of the Raw api, for its CORS-rules..
  url += '?action=query&redirects=true&prop=revisions&rvprop=content&maxlag=5&format=json&origin=*';
  //support multiple titles
  if (typeof title === 'string') {
    title = [title];
  } else if (typeof title === 'number') {
    //pageids param
    lookup = 'pageids';
    title = [title];
  }
  title = title.map(encodeURIComponent);
  title = title.join('|');
  url += '&' + lookup + '=' + title;
  return url;
};

//this data-format from mediawiki api is nutso
var postProcess = function postProcess(data) {
  var pages = Object.keys(data.query.pages);
  var docs = pages.map(function (id) {
    var page = data.query.pages[id] || {};
    if (page.hasOwnProperty('missing') || page.hasOwnProperty('invalid')) {
      return null;
    }
    var text = page.revisions[0]['*'];
    var options = {
      title: page.title,
      pageID: page.pageid
    };
    try {
      return new Document(text, options);
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
  //return an array if there was more than one page given
  if (docs.length > 1) {
    return docs;
  }
  //just return the first one
  return docs[0];
};

var getData = function getData(url, options) {
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

var getPage = function getPage(title, a, b, c) {
  //allow quite! flexible params
  var options = {};
  var lang = 'en';
  var callback = null;
  if (typeof a === 'function') {
    callback = a;
  } else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object') {
    options = a;
  } else if (typeof a === 'string') {
    lang = a;
  }
  if (typeof b === 'function') {
    callback = b;
  } else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object') {
    options = b;
  }
  if (typeof c === 'function') {
    callback = c;
  }
  var url = makeUrl(title, lang);
  return new Promise(function (resolve, reject) {
    var p = getData(url, options);
    p.then(postProcess).then(function (doc) {
      //support 'err-back' format
      if (callback && typeof callback === 'function') {
        callback(null, doc);
      }
      resolve(doc);
    });
    p.catch(reject);
  });
};

module.exports = getPage;

},{"./data/site_map":6,"./document/Document":7,"cross-fetch":1}],20:[function(_dereq_,module,exports){
'use strict';

var Hashes = _dereq_('jshashes');
var fetch = _dereq_('cross-fetch');
var toMarkdown = _dereq_('./toMarkdown');
var toHtml = _dereq_('./toHtml');
var toLatex = _dereq_('./toLatex');
var server = 'https://upload.wikimedia.org/wikipedia/commons/';
var aliasList = _dereq_('../lib/aliases');

var encodeTitle = function encodeTitle(file) {
  var title = file.replace(/^(image|file?)\:/i, '');
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1);
  //spaces to underscores
  title = title.trim().replace(/ /g, '_');
  return title;
};

//the wikimedia image url is a little silly:
//https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F
var makeSrc = function makeSrc(file) {
  var title = encodeTitle(file);
  var hash = new Hashes.MD5().hex(title);
  var path = hash.substr(0, 1) + '/' + hash.substr(0, 2) + '/';
  title = encodeURIComponent(title);
  path += title;
  return path;
};

//the class for our image generation functions
var Image = function Image(file, wiki) {
  this.file = file;
  this.text = ''; //to be compatible as an infobox value
  //hush this property in console.logs..
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki
  });
};

var methods = {
  wikitext: function wikitext() {
    return this.wiki;
  },
  links: function links() {
    return [];
  },
  url: function url() {
    return server + makeSrc(this.file);
  },
  thumbnail: function thumbnail(size) {
    size = size || 300;
    var path = makeSrc(this.file);
    var title = encodeTitle(this.file);
    title = encodeURIComponent(title);
    return server + 'thumb/' + path + '/' + size + 'px-' + title;
  },
  format: function format() {
    var arr = this.file.split('.');
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
        var exists = res.status === 200;
        //support callback non-promise form
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
  json: function json() {
    return {
      file: this.file,
      url: this.url(),
      thumb: this.thumbnail()
    };
  },
  text: function text() {
    return '';
  }
};

Object.keys(methods).forEach(function (k) {
  Image.prototype[k] = methods[k];
});
//add alises, too
Object.keys(aliasList).forEach(function (k) {
  Image.prototype[k] = methods[aliasList[k]];
});
Image.prototype.src = Image.prototype.url;
Image.prototype.thumb = Image.prototype.thumbnail;
module.exports = Image;

},{"../lib/aliases":31,"./toHtml":23,"./toLatex":24,"./toMarkdown":25,"cross-fetch":1,"jshashes":2}],21:[function(_dereq_,module,exports){
'use strict';

var i18n = _dereq_('../data/i18n');
var parseImage = _dereq_('./parse-image');
var fileRegex = new RegExp('(' + i18n.images.concat(i18n.files).join('|') + '):', 'i');

var parseImages = function parseImages(matches, r, wiki) {
  matches.forEach(function (s) {
    if (fileRegex.test(s) === true) {
      r.images = r.images || [];
      var img = parseImage(s);
      if (img) {
        r.images.push(img);
      }
      wiki = wiki.replace(s, '');
    }
  });
  return wiki;
};
module.exports = parseImages;

},{"../data/i18n":5,"./parse-image":22}],22:[function(_dereq_,module,exports){
'use strict';

var Image = _dereq_('./Image');
var i18n = _dereq_('../data/i18n');
var fileNames = '(' + i18n.images.concat(i18n.files).join('|') + ')';
var file_reg = new RegExp(fileNames + ':(.+?)[\\||\\]]', 'i');

//images are usually [[image:my_pic.jpg]]
var parse_image = function parse_image(img) {
  var m = img.match(file_reg);
  if (m === null || !m[2]) {
    return null;
  }
  var file = m[1] + ':' + (m[2] || '');
  //titlecase it
  var title = file.charAt(0).toUpperCase() + file.substring(1);
  //spaces to underscores
  title = title.replace(/ /g, '_');
  if (title) {
    return new Image(file, img);
  }
  return null;
};
module.exports = parse_image;

// console.log(parse_image("[[image:my_pic.jpg]]"));

},{"../data/i18n":5,"./Image":20}],23:[function(_dereq_,module,exports){
'use strict';

var makeImage = function makeImage(image) {
  var alt = image.file.replace(/^(file|image):/i, '');
  alt = alt.replace(/\.(jpg|jpeg|png|gif|svg)/i, '');
  return '  <img src="' + image.thumbnail() + '" alt="' + alt + '"/>';
};
module.exports = makeImage;

},{}],24:[function(_dereq_,module,exports){
'use strict';

//
var toLatex = function toLatex(image) {
  var alt = image.file.replace(/^(file|image):/i, '');
  alt = alt.replace(/\.(jpg|jpeg|png|gif|svg)/i, '');
  var out = '\\begin{figure}';
  out += '\n\\includegraphics[width=\\linewidth]{' + image.thumb + '}';
  out += '\n\\caption{' + alt + '}';
  out += '\n%\\label{fig:myimage1}';
  out += '\n\\end{figure}';
  return out;
};
module.exports = toLatex;

},{}],25:[function(_dereq_,module,exports){
'use strict';

//markdown images are like this: ![alt text](href)
var doImage = function doImage(image) {
  var alt = image.file.replace(/^(file|image):/i, '');
  alt = alt.replace(/\.(jpg|jpeg|png|gif|svg)/i, '');
  return '![' + alt + '](' + image.thumbnail() + ')';
};
module.exports = doImage;

},{}],26:[function(_dereq_,module,exports){
'use strict';

var Document = _dereq_('./document/Document');
var fetch = _dereq_('./fetch');
var version = _dereq_('../package').version;

//the main 'factory' exported method
var wtf = function wtf(wiki, options) {
  return new Document(wiki, options);
};
wtf.fetch = function (title, lang, options, cb) {
  return fetch(title, lang, options, cb);
};
wtf.version = version;

module.exports = wtf;

},{"../package":3,"./document/Document":7,"./fetch":19}],27:[function(_dereq_,module,exports){
'use strict';

var toMarkdown = _dereq_('./toMarkdown');
var toHtml = _dereq_('./toHtml');
var toLatex = _dereq_('./toLatex');
var Image = _dereq_('../image/Image');
var aliasList = _dereq_('../lib/aliases');

//a formal key-value data table about a topic
var Infobox = function Infobox(obj, wiki) {
  this._type = obj.type;
  // this.data = obj.data;
  //hush these properties in console.logs..
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki
  });
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: obj.data
  });
};

var methods = {
  wikitext: function wikitext() {
    return this.wiki;
  },
  type: function type() {
    return this._type;
  },
  links: function links() {
    var _this = this;

    var links = [];
    Object.keys(this.data).forEach(function (k) {
      _this.data[k].links().forEach(function (l) {
        return links.push(l);
      });
    });
    return links;
  },
  image: function image() {
    var obj = this.get('image');
    if (!obj) {
      return null;
    }
    return new Image(obj.text());
  },
  get: function get(key) {
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
  json: function json() {
    var _this2 = this;

    return Object.keys(this.data).reduce(function (h, k) {
      if (_this2.data[k]) {
        h[k] = _this2.data[k].json();
      }
      return h;
    }, {});
  },
  keyValue: function keyValue() {
    var _this3 = this;

    return Object.keys(this.data).reduce(function (h, k) {
      if (_this3.data[k]) {
        h[k] = _this3.data[k].text();
      }
      return h;
    }, {});
  }
};
//aliases

Object.keys(methods).forEach(function (k) {
  Infobox.prototype[k] = methods[k];
});
//add alises, too
Object.keys(aliasList).forEach(function (k) {
  Infobox.prototype[k] = methods[aliasList[k]];
});
Infobox.prototype.data = Infobox.prototype.keyValue;
Infobox.prototype.template = Infobox.prototype.type;
Infobox.prototype.images = Infobox.prototype.image;
module.exports = Infobox;

},{"../image/Image":20,"../lib/aliases":31,"./toHtml":28,"./toLatex":29,"./toMarkdown":30}],28:[function(_dereq_,module,exports){
'use strict';

var dontDo = {
  image: true,
  caption: true
};
//
var infobox = function infobox(obj, options) {
  var html = '<table>\n';
  Object.keys(obj.data).forEach(function (k) {
    if (dontDo[k] === true) {
      return;
    }
    var s = obj.data[k];
    var val = s.html(options);
    html += '  <tr>\n';
    html += '    <td>' + k + '</td>\n';
    html += '    <td>' + val + '</td>\n';
    html += '  </tr>\n';
  });
  html += '</table>\n';
  return html;
};
module.exports = infobox;

},{}],29:[function(_dereq_,module,exports){
'use strict';

var dontDo = {
  image: true,
  caption: true
};

//
var infobox = function infobox(obj, options) {
  var out = '\n \\vspace*{0.3cm} % Info Box\n\n';
  out += '\\begin{tabular}{|@{\\qquad}l|p{9.5cm}@{\\qquad}|} \n';
  out += '  \\hline  %horizontal line\n';
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

},{}],30:[function(_dereq_,module,exports){
'use strict';

var pad = _dereq_('../lib/pad');

var dontDo = {
  image: true,
  caption: true
};

// render an infobox as a table with two columns, key + value
var doInfobox = function doInfobox(obj, options) {
  var md = '|' + pad('', 35) + '|' + pad('', 30) + '|\n';
  md += '|' + pad('---', 35) + '|' + pad('---', 30) + '|\n';
  Object.keys(obj.data).forEach(function (k) {
    if (dontDo[k] === true) {
      return;
    }
    var key = '**' + k + '**';
    var s = obj.data[k];
    var val = s.markdown(options);
    //markdown is more newline-sensitive than wiki
    val = val.split(/\n/g).join(', ');
    md += '|' + pad(key, 35) + '|' + pad(val, 30) + ' |\n';
  });
  return md;
};
module.exports = doInfobox;

},{"../lib/pad":33}],31:[function(_dereq_,module,exports){
'use strict';

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

},{}],32:[function(_dereq_,module,exports){
'use strict';

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

},{}],33:[function(_dereq_,module,exports){
'use strict';

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

},{}],34:[function(_dereq_,module,exports){
'use strict';

//find all the pairs of '[[...[[..]]...]]' in the text
//used to properly root out recursive template calls, [[.. [[...]] ]]
//basically just adds open tags, and subtracts closing tags
function find_recursive(opener, closer, text) {
  var out = [];
  var last = [];
  var chars = text.split('');
  var open = 0;
  for (var i = 0; i < chars.length; i++) {
    //increment open tag
    if (chars[i] === opener) {
      open += 1;
    }
    //decrement close tag
    if (chars[i] === closer) {
      open -= 1;
      if (open < 0) {
        open = 0;
      }
    }
    if (open >= 0) {
      last.push(chars[i]);
    }
    if (open === 0 && last.length > 0) {
      //first, fix botched parse
      var open_count = last.filter(function (s) {
        return s === opener;
      });
      var close_count = last.filter(function (s) {
        return s === closer;
      });
      //is it botched?
      if (open_count.length > close_count.length) {
        last.push(closer);
      }
      //looks good, keep it
      out.push(last.join(''));
      last = [];
    }
  }
  return out;
}
module.exports = find_recursive;

// console.log(find_recursive('{', '}', 'he is president. {{nowrap|{{small|(1995–present)}}}} he lives in texas'));
// console.log(find_recursive("{", "}", "this is fun {{nowrap{{small1995–present}}}} and it works"))

},{}],35:[function(_dereq_,module,exports){
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

},{}],36:[function(_dereq_,module,exports){
'use strict';

//escape a string like 'fun*2.Co' for a regExpr
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

//sometimes text-replacements can be ambiguous - words used multiple times..
var smartReplace = function smartReplace(all, text, result) {
  if (!text || !all) {
    return all;
  }

  if (typeof all === 'number') {
    all = String(all);
  }
  text = escapeRegExp(text);
  //try a word-boundary replace
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

},{}],37:[function(_dereq_,module,exports){
'use strict';

var aliasList = _dereq_('../lib/aliases');

var toHtml = function toHtml(list) {
  var html = '<ul>\n';
  list.forEach(function (o) {
    html += '  <li>' + o.text() + '</li>\n';
  });
  html += '<ul>\n';
  return html;
};

var toLatex = function toLatex(list) {
  var out = '\\begin{itemize}\n';
  list.forEach(function (o) {
    out += '  \\item ' + o.text + '\n';
  });
  out += '\\end{itemize}\n';
  return out;
};

var toMarkdown = function toMarkdown(list, options) {
  return list.map(function (s) {
    var str = s.markdown(options);
    return ' * ' + str;
  }).join('\n');
};

var toText = function toText(list, options) {
  return list.map(function (s) {
    var str = s.text(options);
    return ' * ' + str;
  }).join('\n');
};

var List = function List(data, wiki) {
  this.data = data;
  //hush this property in console.logs..
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki
  });
};

var methods = {
  wikitext: function wikitext() {
    return this.wiki;
  },
  links: function links() {
    var links = [];
    this.data.forEach(function (s) {
      links = links.concat(s.links());
    });
    return links;
  },
  html: function html() {
    return toHtml(this.data);
  },
  latex: function latex() {
    return toLatex(this.data);
  },
  markdown: function markdown() {
    return toMarkdown(this.data);
  },
  json: function json() {
    return this.data.map(function (s) {
      return s.json();
    });
  },
  text: function text() {
    return toText(this.data);
  }
};

Object.keys(methods).forEach(function (k) {
  List.prototype[k] = methods[k];
});
//add alises, too
Object.keys(aliasList).forEach(function (k) {
  List.prototype[k] = methods[aliasList[k]];
});
module.exports = List;

},{"../lib/aliases":31}],38:[function(_dereq_,module,exports){
'use strict';

var toMarkdown = _dereq_('./toMarkdown');
var toHtml = _dereq_('./toHtml');
var toJSON = _dereq_('./toJson');
var toLatex = _dereq_('./toLatex');
var Sentence = _dereq_('../sentence/Sentence');
var Infobox = _dereq_('../infobox/Infobox');
var List = _dereq_('../list/List');
var setDefaults = _dereq_('../lib/setDefaults');
var aliasList = _dereq_('../lib/aliases');

var defaults = {
  infoboxes: true,
  tables: true,
  lists: true,
  citations: true,
  images: true,
  sentences: true
};

//the stuff between headings - 'History' section for example
var Section = function Section(data, wiki) {
  this.data = data;
  this.depth = data.depth;
  this.doc = null;
  //hush these properties in console.logs..
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki
  });
  Object.defineProperty(this, 'doc', {
    enumerable: false,
    value: null
  });
};

var methods = {
  title: function title() {
    return this.data.title || '';
  },
  wikitext: function wikitext() {
    return this.wiki || '';
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
    var arr = this.data.sentences.map(function (s) {
      s = new Sentence(s);
      return s;
    });
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr || [];
  },
  links: function links(n) {
    var arr = [];
    this.infoboxes().forEach(function (templ) {
      templ.links().forEach(function (link) {
        return arr.push(link);
      });
    });
    this.sentences().forEach(function (s) {
      s.links().forEach(function (link) {
        return arr.push(link);
      });
    });
    this.tables().forEach(function (t) {
      t.links().forEach(function (link) {
        return arr.push(link);
      });
    });
    this.lists().forEach(function (list) {
      list.links().forEach(function (link) {
        return arr.push(link);
      });
    });
    if (typeof n === 'number') {
      return arr[n];
    }
    return arr;
  },
  tables: function tables(clue) {
    if (typeof clue === 'number') {
      return this.data.tables[clue];
    }
    return this.data.tables || [];
  },
  templates: function templates(clue) {
    if (typeof clue === 'number') {
      return this.data.templates[clue];
    }
    var arr = this.data.templates || [];
    if (typeof clue === 'string') {
      clue = clue.toLowerCase();
      return arr.filter(function (o) {
        return o.template === clue || o.name === clue;
      });
    }
    return arr;
  },
  infoboxes: function infoboxes(clue) {
    var arr = this.templates('infobox');
    if (typeof clue === 'number') {
      return new Infobox(arr[clue]);
    }
    return arr.map(function (obj) {
      return new Infobox(obj);
    });
  },
  coordinates: function coordinates(clue) {
    var arr = this.templates('coord');
    if (typeof clue === 'number') {
      return arr[clue];
    }
    return arr;
  },
  lists: function lists(clue) {
    if (typeof clue === 'number') {
      return new List(this.data.lists[clue]);
    }
    var lists = this.data.lists || [];
    return lists.map(function (arr) {
      return new List(arr);
    });
  },
  interwiki: function interwiki(clue) {
    if (typeof clue === 'number') {
      return this.data.interwiki[clue];
    }
    return this.data.interwiki || [];
  },
  images: function images(clue) {
    if (typeof clue === 'number') {
      return this.data.images[clue];
    }
    return this.data.images || [];
  },
  citations: function citations(clue) {
    var arr = this.templates('citation'); //.map(o => o.data);
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
    bads[this.title()] = true;
    //remove children too
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
    var children = [];
    //(immediately preceding sections with higher depth)
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
      n = n.toLowerCase();
      // children.forEach((c) => console.log(c));
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
    return this.sentences().map(function (s) {
      return s.text(options);
    }).join(' ');
  },
  latex: function latex(options) {
    return toLatex(this, options);
  },
  json: function json(options) {
    return toJSON(this, options);
  }
};
//aliases
methods.next = methods.nextSibling;
methods.last = methods.lastSibling;
methods.previousSibling = methods.lastSibling;
methods.previous = methods.lastSibling;
methods.references = methods.citations;
Object.keys(methods).forEach(function (k) {
  Section.prototype[k] = methods[k];
});
//add alises, too
Object.keys(aliasList).forEach(function (k) {
  Section.prototype[k] = methods[aliasList[k]];
});
module.exports = Section;

},{"../infobox/Infobox":27,"../lib/aliases":31,"../lib/setDefaults":35,"../list/List":37,"../sentence/Sentence":49,"./toHtml":44,"./toJson":45,"./toLatex":46,"./toMarkdown":47}],39:[function(_dereq_,module,exports){
'use strict';

var fns = _dereq_('../lib/helpers');
var parseLine = _dereq_('../sentence/').parseLine;
var heading_reg = /^(={1,5})([^=]{1,200}?)={1,5}$/;

//interpret depth, title of headings like '==See also=='
var parseHeading = function parseHeading(r, str) {
  var heading = str.match(heading_reg);
  if (!heading) {
    return {
      title: '',
      depth: 0,
      templates: []
    };
  }
  var title = heading[2] || '';
  title = parseLine(title).text;
  //amazingly, you can see inline {{templates}} in this text, too
  //... let's not think about that now.
  title = title.replace(/\{\{.+?\}\}/, '');
  title = fns.trim_whitespace(title);

  var depth = 0;
  if (heading[1]) {
    depth = heading[1].length - 2;
  }
  r.title = title;
  r.depth = depth;
  return r;
};
module.exports = parseHeading;

},{"../lib/helpers":32,"../sentence/":51}],40:[function(_dereq_,module,exports){
'use strict';

var Section = _dereq_('./Section');
var find_recursive = _dereq_('../lib/recursive_match');

//interpret ==heading== lines
var parse = {
  heading: _dereq_('./heading'),
  list: _dereq_('./list'),
  image: _dereq_('../image'),
  interwiki: _dereq_('./interwiki'),
  table: _dereq_('../table'),
  references: _dereq_('./references'),
  templates: _dereq_('../templates'),
  xmlTemplates: _dereq_('./xml-templates'),
  eachSentence: _dereq_('../sentence').eachSentence
};
var section_reg = /[\n^](={1,5}[^=]{1,200}?={1,5})/g;

var doSection = function doSection(section, wiki, options) {
  wiki = parse.xmlTemplates(section, wiki, options);
  // //parse the <ref></ref> tags
  wiki = parse.references(section, wiki, options);
  //parse-out all {{templates}}
  wiki = parse.templates(section, wiki, options);
  // //parse the tables
  wiki = parse.table(section, wiki);
  // //parse the lists
  wiki = parse.list(section, wiki);
  // //parse+remove scary '[[ [[]] ]]' stuff
  //second, remove [[file:...[[]] ]] recursions
  var matches = find_recursive('[', ']', wiki);
  wiki = parse.image(matches, section, wiki, options);
  wiki = parse.interwiki(matches, section, wiki, options);
  //do each sentence
  wiki = parse.eachSentence(section, wiki);
  // section.wiki = wiki;
  section = new Section(section, wiki);
  return section;
};

var splitSections = function splitSections(wiki, options) {
  var split = wiki.split(section_reg); //.filter(s => s);
  var sections = [];
  for (var i = 0; i < split.length; i += 2) {
    var heading = split[i - 1] || '';
    var content = split[i] || '';
    var section = {
      title: '',
      depth: null,
      templates: []
    };
    //figure-out title/depth
    section = parse.heading(section, heading);
    //parse it up
    section = doSection(section, content, options);
    sections.push(section);
  }
  return sections;
};

module.exports = splitSections;

},{"../image":21,"../lib/recursive_match":34,"../sentence":51,"../table":60,"../templates":79,"./Section":38,"./heading":39,"./interwiki":41,"./list":42,"./references":43,"./xml-templates":48}],41:[function(_dereq_,module,exports){
'use strict';

var i18n = _dereq_('../data/i18n');
//
var interwiki = function interwiki(matches, r, wiki, options) {
  //third, wiktionary-style interlanguage links
  matches.forEach(function (s) {
    if (s.match(/\[\[([a-z]+):(.*?)\]\]/i) !== null) {
      var site = (s.match(/\[\[([a-z]+):/i) || [])[1] || '';
      site = site.toLowerCase();
      if (site && i18n.dictionary[site] === undefined && !(options.namespace !== undefined && options.namespace === site)) {
        r.interwiki = r.interwiki || {};
        r.interwiki[site] = (s.match(/\[\[([a-z]+):(.*?)\]\]/i) || [])[2];
        wiki = wiki.replace(s, '');
      }
    }
  });
  return wiki;
};
module.exports = interwiki;

},{"../data/i18n":5}],42:[function(_dereq_,module,exports){
'use strict';

var list_reg = /^[#\*:;\|]+/;
var bullet_reg = /^\*+[^:,\|]{4}/;
var number_reg = /^ ?\#[^:,\|]{4}/;
var has_word = /[a-z_0-9\]\}]/i;
var parseLine = _dereq_('../sentence/').parseLine;
var Sentence = _dereq_('../sentence/Sentence');

// does it start with a bullet point or something?
var isList = function isList(line) {
  return list_reg.test(line) || bullet_reg.test(line) || number_reg.test(line);
};

//make bullets/numbers into human-readable *'s
var cleanList = function cleanList(list) {
  var number = 1;
  list = list.filter(function (l) {
    return l;
  });
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
    list[i] = parseLine(line);
    list[i] = new Sentence(list[i]);
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

var parseList = function parseList(r, wiki) {
  var lines = wiki.split(/\n/g);
  lines = lines.filter(function (l) {
    return has_word.test(l);
  });
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
  if (lists.length > 0) {
    r.lists = lists;
  }
  return theRest.join('\n');
};
module.exports = parseList;

},{"../sentence/":51,"../sentence/Sentence":49}],43:[function(_dereq_,module,exports){
'use strict';

var parseGeneric = _dereq_('../templates/parsers/generic');
var parsePipe = _dereq_('../templates/misc')['cite gnis'];
var parseLine = _dereq_('../sentence').parseLine;
var Sentence = _dereq_('../sentence/Sentence');

//structured Cite templates - <ref>{{Cite..</ref>
var hasCitation = function hasCitation(str) {
  return (/^ *?\{\{ *?(cite|citation)/i.test(str) && /\}\} *?$/.test(str) && /citation needed/i.test(str) === false
  );
};

//might as well parse it, since we're here.
var parseCitation = function parseCitation(tmpl) {
  var obj = parseGeneric(tmpl);
  if (obj) {
    return obj;
  }
  //support {{cite gnis|98734}} format
  return parsePipe(tmpl);
};

//handle unstructured ones - <ref>some text</ref>
var parseInline = function parseInline(tmpl, r) {
  var obj = parseLine(tmpl) || {};
  obj = new Sentence(obj);
  var cite = {
    template: 'citation',
    type: 'inline',
    data: {},
    inline: obj
  };
  r.templates.push(cite);
};

// parse <ref></ref> xml tags
var parseRefs = function parseRefs(r, wiki) {
  wiki = wiki.replace(/ ?<ref>([\s\S]{0,750}?)<\/ref> ?/gi, function (a, tmpl) {
    if (hasCitation(tmpl)) {
      var obj = parseCitation(tmpl);
      if (obj) {
        r.templates.push(obj);
      }
      wiki = wiki.replace(tmpl, '');
    } else {
      parseInline(tmpl, r);
    }
    return ' ';
  });
  // <ref name=""/>
  wiki = wiki.replace(/ ?<ref [^>]{0,200}?\/> ?/gi, ' ');
  // <ref name=""></ref>
  wiki = wiki.replace(/ ?<ref [^>]{0,200}?>([\s\S]{0,1000}?)<\/ref> ?/gi, function (a, tmpl) {
    if (hasCitation(tmpl)) {
      var obj = parseCitation(tmpl);
      if (obj) {
        r.templates.push(obj);
      }
      wiki = wiki.replace(tmpl, '');
    } else {
      parseInline(tmpl, r);
    }
    return ' ';
  });
  //now that we're done with xml, do a generic + dangerous xml-tag removal
  wiki = wiki.replace(/ ?<[ \/]?[a-z0-9]{1,8}[a-z0-9=" ]{2,20}[ \/]?> ?/g, ' '); //<samp name="asd">
  return wiki;
};
module.exports = parseRefs;

},{"../sentence":51,"../sentence/Sentence":49,"../templates/misc":82,"../templates/parsers/generic":87}],44:[function(_dereq_,module,exports){
'use strict';

var doSection = function doSection(section, options) {
  var html = '';
  //make the header
  if (options.title === true && section.title()) {
    var num = 1 + section.depth;
    html += '  <h' + num + '>' + section.title() + '</h' + num + '>';
    html += '\n';
  }
  //put any images under the header
  if (options.images === true) {
    var imgs = section.images();
    if (imgs.length > 0) {
      html += imgs.map(function (image) {
        return image.html(options);
      }).join('\n');
      html += '\n';
    }
  }
  //make a html table
  if (options.tables === true) {
    html += section.tables().map(function (t) {
      return t.html(options);
    }).join('\n');
  }
  // //make a html bullet-list
  if (section.lists() && options.lists === true) {
    html += section.lists().map(function (list) {
      return list.html(options);
    }).join('\n');
  }
  //finally, write the sentence text.
  if (options.sentences === true) {
    html += '  <div class="text">\n    ';
    html += section.sentences().map(function (s) {
      return s.html(options);
    }).join(' ');
    html += '\n  </div>\n';
  }
  return '<div class="section">\n' + html + '</div>\n';
};
module.exports = doSection;

},{}],45:[function(_dereq_,module,exports){
'use strict';

var setDefaults = _dereq_('../lib/setDefaults');
var defaults = {
  title: true,
  depth: true,
  sentences: true,
  links: true,
  text: true,
  formatting: true,
  dates: true,
  tables: true,
  lists: true,
  templates: true,
  images: true
};
//
var toJSON = function toJSON(s, options) {
  options = setDefaults(options, defaults);
  var data = {};
  if (options.title) {
    data.title = s.title();
  }
  if (options.depth) {
    data.depth = s.depth;
  }
  //these return objects
  if (options.sentences) {
    data.sentences = s.sentences().map(function (sen) {
      return sen.json(options);
    });
  }
  if (options.images && s.images().length > 0) {
    data.images = s.images().map(function (img) {
      return img.json(options);
    });
  }
  //more stuff
  if (options.tables && s.tables().length > 0) {
    data.tables = s.tables();
  }
  if (options.templates && s.templates().length > 0) {
    data.templates = s.templates();
  }
  if (options.lists && s.lists().length > 0) {
    data.tables = s.lists().map(function (list) {
      return list.json();
    });
  }
  return data;
};
module.exports = toJSON;

},{"../lib/setDefaults":35}],46:[function(_dereq_,module,exports){
'use strict';

//map '==' depth to 'subsection', 'subsubsection', etc
var doSection = function doSection(section, options) {
  options = options || {};
  var out = '';
  var num = 1;
  //make the header
  if (options.title === true && section.title()) {
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
  }
  //put any images under the header
  if (section.images() && options.images === true) {
    out += section.images().map(function (image) {
      return image.latex(options);
    }).join('\n');
    //out += '\n';
  }
  //make a out tablew
  if (section.tables() && options.tables === true) {
    out += section.tables().map(function (t) {
      return t.latex(options);
    }).join('\n');
  }
  // //make a out bullet-list
  if (section.lists() && options.lists === true) {
    out += section.lists().map(function (list) {
      return list.latex(options);
    }).join('\n');
  }
  //finally, write the sentence text.
  if (section.sentences() && options.sentences === true) {
    //out += '\n\n% BEGIN Paragraph\n'
    out += section.sentences().map(function (s) {
      return s.latex(options);
    }).join(' ');
    //out += '\n% END Paragraph';
    out += '\n';
  }
  // var title_tag = ' SECTION depth=' + num + ' - TITLE: ' + section.title + '\n';
  // wrap a section comment
  //out = '\n% BEGIN' + title_tag + out + '\n% END' + title_tag;
  return out;
};
module.exports = doSection;

},{}],47:[function(_dereq_,module,exports){
'use strict';

var setDefaults = _dereq_('../lib/setDefaults');

var defaults = {
  title: true,
  images: true,
  tables: true,
  lists: true,
  sentences: true
};

var doSection = function doSection(section, options) {
  options = setDefaults(options, defaults);
  var md = '';
  //make the header
  if (options.title === true && section.title()) {
    var header = '##';
    for (var i = 0; i < section.depth; i += 1) {
      header += '#';
    }
    md += header + ' ' + section.title() + '\n';
  }
  //put any images under the header
  if (options.images === true) {
    var images = section.images();
    if (images.length > 0) {
      md += images.map(function (img) {
        return img.markdown();
      }).join('\n');
      md += '\n';
    }
  }
  //make a mardown table
  if (options.tables === true) {
    var tables = section.tables();
    if (tables.length > 0) {
      md += '\n';
      md += tables.map(function (table) {
        return table.html(options);
      }).join('\n');
      md += '\n';
    }
  }
  //make a mardown bullet-list
  if (options.lists === true) {
    var lists = section.lists();
    if (lists.length > 0) {
      md += lists.map(function (list) {
        return list.markdown(options);
      }).join('\n');
      md += '\n';
    }
  }
  //finally, write the sentence text.
  if (options.sentences === true) {
    md += section.sentences().map(function (s) {
      return s.markdown(options);
    }).join(' ');
  }
  return md;
};
module.exports = doSection;

},{"../lib/setDefaults":35}],48:[function(_dereq_,module,exports){
'use strict';

var parseLine = _dereq_('../sentence/').parseLine;
var Image = _dereq_('../image/Image');
// Most templates are '{{template}}', but then, some are '<template></template>'.
// -> this is those ones.

//okay, <gallery> is a xml-tag, with newline-seperated data, somehow pivoted by '|'...
//all deities help us. truly -> https://en.wikipedia.org/wiki/Help:Gallery_tag
// - not to be confused with https://en.wikipedia.org/wiki/Template:Gallery...
var parseGallery = function parseGallery(wiki, section) {
  wiki = wiki.replace(/<gallery([^>]*?)>([\s\S]+?)<\/gallery>/g, function (_, attrs, inside) {
    var images = inside.split(/\n/g);
    images = images.filter(function (str) {
      return str && str.trim() !== '';
    });
    //parse the line, which has an image and sometimes a caption
    images = images.map(function (str) {
      var arr = str.split(/\|/);
      var img = new Image(arr[0].trim()).json();
      var caption = arr.slice(1).join('|');
      if (caption !== '') {
        img.caption = parseLine(caption);
      }
      return img;
    });
    //add it to our templates list
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

var xmlTemplates = function xmlTemplates(section, wiki) {
  wiki = parseGallery(wiki, section);
  return wiki;
};

module.exports = xmlTemplates;

},{"../image/Image":20,"../sentence/":51}],49:[function(_dereq_,module,exports){
'use strict';

var toHtml = _dereq_('./toHtml');
var toMarkdown = _dereq_('./toMarkdown');
var toJSON = _dereq_('./toJson');
var toLatex = _dereq_('./toLatex');
var aliasList = _dereq_('../lib/aliases');

//where we store the formatting, link, date information
var Sentence = function Sentence(data, wiki) {
  this.data = data;
  //hush this property in console
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki
  });
};

var methods = {
  links: function links(n) {
    var arr = this.data.links || [];
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
  text: function text() {
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
});
//add alises, too
Object.keys(aliasList).forEach(function (k) {
  Sentence.prototype[k] = methods[aliasList[k]];
});
Sentence.prototype.italic = Sentence.prototype.italics;
Sentence.prototype.bold = Sentence.prototype.bolds;
Sentence.prototype.plaintext = Sentence.prototype.text;

module.exports = Sentence;

},{"../lib/aliases":31,"./toHtml":54,"./toJson":55,"./toLatex":56,"./toMarkdown":57}],50:[function(_dereq_,module,exports){
'use strict';

//handle the bold/italics
var formatting = function formatting(obj) {
  var bolds = [];
  var italics = [];
  var wiki = obj.text || '';
  //bold and italics combined 5 's
  wiki = wiki.replace(/''{4}([^']{0,200})''{4}/g, function (a, b) {
    bolds.push(b);
    italics.push(b);
    return b;
  });
  //'''bold'''
  wiki = wiki.replace(/''{2}([^']{0,200})''{2}/g, function (a, b) {
    bolds.push(b);
    return b;
  });
  //''italic''
  wiki = wiki.replace(/''([^']{0,200})''/g, function (a, b) {
    italics.push(b);
    return b;
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
  return obj;
};
module.exports = formatting;

},{}],51:[function(_dereq_,module,exports){
'use strict';

var helpers = _dereq_('../lib/helpers');
var parseLinks = _dereq_('./links');
var parseFmt = _dereq_('./formatting');
// const templates = require('./templates');
var sentenceParser = _dereq_('./sentence-parser');
var i18n = _dereq_('../data/i18n');
var cat_reg = new RegExp('\\[\\[:?(' + i18n.categories.join('|') + '):[^\\]\\]]{2,80}\\]\\]', 'gi');

//return only rendered text of wiki links
var resolve_links = function resolve_links(line) {
  // categories, images, files
  line = line.replace(cat_reg, '');
  // [[Common links]]
  line = line.replace(/\[\[:?([^|]{1,80}?)\]\](\w{0,5})/g, '$1$2');
  // [[File:with|Size]]
  line = line.replace(/\[\[File:(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, '$1');
  // [[Replaced|Links]]
  line = line.replace(/\[\[:?(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, '$2$3');
  // External links
  line = line.replace(/\[(https?|news|ftp|mailto|gopher|irc):\/\/[^\]\| ]{4,1500}([\| ].*?)?\]/g, '$2');
  return line;
};
// console.log(resolve_links("[http://www.whistler.ca www.whistler.ca]"))

function postprocess(line) {
  //fix links
  line = resolve_links(line);
  //oops, recursive image bug
  if (line.match(/^(thumb|right|left)\|/i)) {
    return null;
  }
  //remove empty parentheses (sometimes caused by removing templates)
  line = line.replace(/\([,;: ]*\)/g, '');
  //these semi-colons in parentheses are particularly troublesome
  line = line.replace(/\( *(; ?)+/g, '(');
  //dangling punctuation
  line = helpers.trim_whitespace(line);
  line = line.replace(/ +\.$/, '.');
  return line;
}

function parseLine(line) {
  var obj = {
    text: postprocess(line)
  };
  //pull-out the [[links]]
  var links = parseLinks(line);
  if (links) {
    obj.links = links;
  }
  //pull-out the bolds and ''italics''
  obj = parseFmt(obj);
  //pull-out things like {{start date|...}}
  // obj = templates(obj);
  return obj;
}

var parseSentences = function parseSentences(r, wiki) {
  var sentences = sentenceParser(wiki);
  sentences = sentences.map(parseLine);
  r.sentences = sentences;
  return wiki;
};

module.exports = {
  eachSentence: parseSentences,
  parseLine: parseLine
};

},{"../data/i18n":5,"../lib/helpers":32,"./formatting":50,"./links":52,"./sentence-parser":53}],52:[function(_dereq_,module,exports){
'use strict';

// const helpers = require('../lib/helpers');
var ignore_links = /^:?(category|catégorie|Kategorie|Categoría|Categoria|Categorie|Kategoria|تصنيف|image|file|image|fichier|datei|media|special|wp|wikipedia|help|user|mediawiki|portal|talk|template|book|draft|module|topic|wiktionary|wikisource):/i;
var external_link = /\[(https?|news|ftp|mailto|gopher|irc)(:\/\/[^\]\| ]{4,1500})([\| ].*?)?\]/g;
var link_reg = /\[\[(.{0,80}?)\]\]([a-z']+)?(\w{0,10})/gi; //allow dangling suffixes - "[[flanders]]'s"

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
    var txt = null;
    var link = s;
    if (s.match(/\|/)) {
      //replacement link [[link|text]]
      s = s.replace(/\[\[(.{2,80}?)\]\](\w{0,10})/g, '$1$2'); //remove ['s and keep suffix
      link = s.replace(/(.{2,60})\|.{0,200}/, '$1'); //replaced links
      txt = s.replace(/.{2,60}?\|/, '');
      //handle funky case of [[toronto|]]
      if (txt === null && link.match(/\|$/)) {
        link = link.replace(/\|$/, '');
        txt = link;
      }
    }
    //kill off non-wikipedia namespaces
    if (link.match(ignore_links)) {
      return s;
    }
    //kill off just anchor links [[#history]]
    if (link.match(/^#/i)) {
      return s;
    }
    //remove anchors from end [[toronto#history]]
    link = link.replace(/#[^ ]{1,100}/, '');
    var obj = {
      page: link
    };
    if (txt !== null && txt !== obj.page) {
      obj.text = txt;
    }
    //finally, support [[link]]'s apostrophe
    if (apostrophe === '\'s') {
      obj.text = obj.text || obj.page;
      obj.text += apostrophe;
    }
    links.push(obj);
    return s;
  });
  return links;
};

//grab an array of internal links in the text
var parse_links = function parse_links(str) {
  var links = [];
  //first, parse external links
  links = external_links(links, str);
  //internal links
  links = internal_links(links, str);

  if (links.length === 0) {
    return undefined;
  }
  return links;
};
module.exports = parse_links;

},{}],53:[function(_dereq_,module,exports){
'use strict';

//split text into sentences, using regex
//@spencermountain MIT

//(Rule-based sentence boundary segmentation) - chop given text into its proper sentences.
// Ignore periods/questions/exclamations used in acronyms/abbreviations/numbers, etc.
// @spencermountain 2015 MIT
var abbreviations = _dereq_('../data/abbreviations');
var abbrev_reg = new RegExp('(^| )(' + abbreviations.join('|') + ')[.!?] ?$', 'i');
var acronym_reg = new RegExp('[ |.][A-Z].? +?$', 'i');
var elipses_reg = new RegExp('\\.\\.\\.* +?$');
var hasWord = new RegExp('[a-z][a-z]', 'i');

//turn a nested array into one array
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
  });
  //split by period, question-mark, and exclamation-mark
  splits = splits.map(function (str) {
    return str.split(/(\S.+?[.!?]"?)(?=\s+|$)/g);
  });
  return flatten(splits);
};

// if this looks like a period within a wikipedia link, return false
var isBalanced = function isBalanced(str) {
  str = str || '';
  var open = str.split(/\[\[/) || [];
  var closed = str.split(/\]\]/) || [];
  if (open.length > closed.length) {
    return false;
  }
  //make sure quotes are closed too
  var quotes = str.match(/"/g);
  if (quotes && quotes.length % 2 !== 0 && str.length < 900) {
    return false;
  }
  return true;
};

var sentence_parser = function sentence_parser(text) {
  var sentences = [];
  //first do a greedy-split..
  var chunks = [];
  //ensure it 'smells like' a sentence
  if (!text || typeof text !== 'string' || !text.match(/\w/)) {
    return sentences;
  }
  // This was the splitter regex updated to fix quoted punctuation marks.
  // let splits = text.split(/(\S.+?[.\?!])(?=\s+|$|")/g);
  // todo: look for side effects in this regex replacement:
  var splits = naiive_split(text);
  //filter-out the grap ones
  for (var i = 0; i < splits.length; i++) {
    var s = splits[i];
    if (!s || s === '') {
      continue;
    }
    //this is meaningful whitespace
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
  }

  //detection of non-sentence chunks
  var isSentence = function isSentence(hmm) {
    if (hmm.match(abbrev_reg) || hmm.match(acronym_reg) || hmm.match(elipses_reg)) {
      return false;
    }
    //too short? - no consecutive letters
    if (hasWord.test(hmm) === false) {
      return false;
    }
    if (!isBalanced(hmm)) {
      return false;
    }
    return true;
  };

  //loop through these chunks, and join the non-sentence chunks back together..
  for (var _i = 0; _i < chunks.length; _i++) {
    //should this chunk be combined with the next one?
    if (chunks[_i + 1] && !isSentence(chunks[_i])) {
      chunks[_i + 1] = chunks[_i] + (chunks[_i + 1] || ''); //.replace(/ +/g, ' ');
    } else if (chunks[_i] && chunks[_i].length > 0) {
      //this chunk is a proper sentence..
      sentences.push(chunks[_i]);
      chunks[_i] = '';
    }
  }
  //if we never got a sentence, return the given text
  if (sentences.length === 0) {
    return [text];
  }
  return sentences;
};

module.exports = sentence_parser;
// console.log(sentence_parser('Tony is nice. He lives in Japan.').length === 2);

},{"../data/abbreviations":4}],54:[function(_dereq_,module,exports){
'use strict';

var smartReplace = _dereq_('../lib/smartReplace');
var helpers = _dereq_('../lib/helpers');

// create links, bold, italic in html
var doSentence = function doSentence(sentence) {
  var text = sentence.text();
  //turn links into <a href>
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
      href = './' + href.replace(/ /g, '_');
    }
    var str = link.text || link.page;
    var tag = '<a class="' + classNames + '" href="' + href + '">' + str + '</a>';
    text = smartReplace(text, str, tag);
  });
  //support bolds
  sentence.bold().forEach(function (str) {
    var tag = '<b>' + str + '</b>';
    text = smartReplace(text, str, tag);
  });
  //do italics
  sentence.italic().forEach(function (str) {
    var tag = '<i>' + str + '</i>';
    text = smartReplace(text, str, tag);
  });

  return '<span class="sentence">' + text + '</span>';
};
module.exports = doSentence;

},{"../lib/helpers":32,"../lib/smartReplace":36}],55:[function(_dereq_,module,exports){
'use strict';

var setDefaults = _dereq_('../lib/setDefaults');
var defaults = {
  text: true,
  links: true,
  formatting: true,
  dates: true
};

var toJSON = function toJSON(s, options) {
  options = setDefaults(options, defaults);
  var data = {};
  if (options.text || options.plaintext) {
    data.text = s.plaintext();
  }
  if (options.links && s.data.links) {
    data.links = s.links();
  }
  if (options.formatting && s.data.fmt) {
    data.formatting = s.data.fmt;
  }
  if (options.dates && s.data.dates) {
    data.dates = s.data.dates;
  }
  return data;
};
module.exports = toJSON;

},{"../lib/setDefaults":35}],56:[function(_dereq_,module,exports){
'use strict';

var smartReplace = _dereq_('../lib/smartReplace');
var helpers = _dereq_('../lib/helpers');
// create links, bold, italic in html
var doSentence = function doSentence(sentence) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var text = sentence.plaintext();
  //turn links back into links
  if (sentence.links && options.links === true) {
    sentence.links().forEach(function (link) {
      var href = '';
      if (link.site) {
        //use an external link
        href = link.site;
      } else {
        //otherwise, make it a relative internal link
        href = helpers.capitalise(link.page);
        href = './' + href.replace(/ /g, '_');
      }
      var str = link.text || link.page;
      var tag = '\\href{' + href + '}{' + str + '}';
      text = smartReplace(text, str, tag);
    });
  }
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
  return text;
};
module.exports = doSentence;

},{"../lib/helpers":32,"../lib/smartReplace":36}],57:[function(_dereq_,module,exports){
'use strict';

var smartReplace = _dereq_('../lib/smartReplace');
var helpers = _dereq_('../lib/helpers');

// add `[text](href)` to the text
var doLink = function doLink(md, link) {
  var href = '';
  //if it's an external link, we good
  if (link.site) {
    href = link.site;
  } else {
    //otherwise, make it a relative internal link
    href = helpers.capitalise(link.page);
    href = './' + href.replace(/ /g, '_');
  }
  var str = link.text || link.page;
  var mdLink = '[' + str + '](' + href + ')';
  md = smartReplace(md, str, mdLink);
  return md;
};

//create links, bold, italic in markdown
var doSentence = function doSentence(sentence) {
  var md = sentence.text();
  //turn links back into links
  // if (options.links === true) {
  sentence.links().forEach(function (link) {
    md = doLink(md, link);
  });
  // }
  //turn bolds into **bold**
  sentence.bold().forEach(function (b) {
    md = smartReplace(md, b, '**' + b + '**');
  });
  //support *italics*
  sentence.italic().forEach(function (i) {
    md = smartReplace(md, i, '*' + i + '*');
  });
  return md;
};
module.exports = doSentence;

},{"../lib/helpers":32,"../lib/smartReplace":36}],58:[function(_dereq_,module,exports){
'use strict';

var toHtml = _dereq_('./toHtml');
var toMarkdown = _dereq_('./toMarkdown');
var toLatex = _dereq_('./toLatex');
var aliasList = _dereq_('../lib/aliases');

var Table = function Table(data, wiki) {
  this.data = data;
  //hush this property in console
  Object.defineProperty(this, 'wiki', {
    enumerable: false,
    value: wiki
  });
};

var methods = {
  wikitext: function wikitext() {
    return this.wiki;
  },
  links: function links() {
    var links = [];
    this.data.forEach(function (r) {
      Object.keys(r).forEach(function (k) {
        links = links.concat(r[k].links());
      });
    });
    return links;
  },
  json: function json() {
    return this.data.map(function (o) {
      var row = {};
      Object.keys(o).forEach(function (k) {
        row[k] = o[k].json();
      });
      return row;
    });
  },
  html: function html(options) {
    return toHtml(this.data, options);
  },
  markdown: function markdown(options) {
    return toMarkdown(this.data, options);
  },
  latex: function latex(options) {
    return toLatex(this.data, options);
  },
  text: function text() {
    return '';
  }
};
Object.keys(methods).forEach(function (k) {
  Table.prototype[k] = methods[k];
});
//add alises, too
Object.keys(aliasList).forEach(function (k) {
  Table.prototype[k] = methods[aliasList[k]];
});
module.exports = Table;

},{"../lib/aliases":31,"./toHtml":62,"./toLatex":63,"./toMarkdown":64}],59:[function(_dereq_,module,exports){
'use strict';

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
};

//turn newline seperated into '|-' seperated
var findRows = function findRows(lines) {
  var rows = [];
  var row = [];
  lines = cleanup(lines);
  for (var i = 0; i < lines.length; i += 1) {
    var line = lines[i];
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
      line.forEach(function (l) {
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
  return rows;
};
module.exports = findRows;

},{}],60:[function(_dereq_,module,exports){
'use strict';

var parseTable = _dereq_('./parseTable');
var Table = _dereq_('./Table');
// const table_reg = /\{\|[\s\S]+?\|\}/g; //the largest-cities table is ~70kchars.
var openReg = /^\s*{\|/;
var closeReg = /^\s*\|}/;

//tables can be recursive, so looky-here.
var findTables = function findTables(section, wiki) {
  var list = [];
  var lines = wiki.split('\n');
  var stack = [];
  for (var i = 0; i < lines.length; i += 1) {
    //start a table
    if (openReg.test(lines[i]) === true) {
      stack.push(lines[i]);
      continue;
    }
    //close a table
    if (closeReg.test(lines[i]) === true) {
      stack[stack.length - 1] += '\n' + lines[i];
      var table = stack.pop();
      list.push(table);
      continue;
    }
    //keep-going on one
    if (stack.length > 0) {
      stack[stack.length - 1] += '\n' + lines[i];
    }
  }
  //work-em together for a Table class
  var tables = [];
  list.forEach(function (str) {
    if (str) {
      //also reremove a newline at the end of the table (awkward)
      wiki = wiki.replace(str + '\n', '');
      var data = parseTable(str);
      if (data && data.length > 0) {
        tables.push(new Table(data));
      }
    }
  });
  // console.log(wiki);
  if (tables.length > 0) {
    section.tables = tables;
  }
  return wiki;
};

module.exports = findTables;

},{"./Table":58,"./parseTable":61}],61:[function(_dereq_,module,exports){
'use strict';

var parseLine = _dereq_('../sentence/').parseLine;
var Sentence = _dereq_('../sentence/Sentence');
var findRows = _dereq_('./findRows');

//additional table-cruft to remove before parseLine method
var cleanText = function cleanText(str) {
  //anything before a single-pipe is styling, so remove it
  if (str.match(/\|/)) {
    str = str.replace(/.+\| ?/, ''); //class="unsortable"|title
  }
  str = str.replace(/style=".*?"/, '');
  //'!' is used as a highlighed-column
  str = str.replace(/^!/, '');
  return str;
};

//'!' starts a header-row
var findHeaders = function findHeaders(rows) {
  var headings = [];
  var first = rows[0];
  if (first && first[0] && /^!/.test(first[0]) === true) {
    headings = first.map(function (h) {
      h = h.replace(/^\! */, '');
      h = cleanText(h);
      return h;
    });
    rows.shift();
  }
  return headings;
};

//turn a {|...table string into an array of arrays
var parseTable = function parseTable(wiki) {
  var lines = wiki.replace(/\r/g, '').split(/\n/);
  lines = lines.map(function (l) {
    return l.trim();
  });
  var rows = findRows(lines);
  var headers = findHeaders(rows);
  //index them by their header
  var table = rows.map(function (arr) {
    var row = {};
    arr.forEach(function (str, i) {
      var header = headers[i] || 'col' + (i + 1);
      var cell = parseLine(str);
      cell.text = cleanText(cell.text);
      cell = new Sentence(cell);
      row[header] = cell;
    });
    return row;
  });
  return table;
};

module.exports = parseTable;

},{"../sentence/":51,"../sentence/Sentence":49,"./findRows":59}],62:[function(_dereq_,module,exports){
'use strict';

//turn a json table into a html table
var toHtml = function toHtml(table, options) {
  var html = '<table>\n';
  //make header
  html += '  <thead>\n';
  Object.keys(table[0]).forEach(function (k) {
    if (/^col[0-9]/.test(k) !== true) {
      html += '    <td>' + k + '</td>\n';
    }
  });
  html += '  </thead>\n';
  html += '  <tbody>\n';
  //make rows
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

},{}],63:[function(_dereq_,module,exports){
'use strict';

var doTable = function doTable(table, options) {
  var out = '\n%\\vspace*{0.3cm}\n';
  out += '\n% BEGIN TABLE: only left align columns in LaTeX table with horizontal line separation between columns';
  out += '\n% Format Align Column: \'l\'=left \'r\'=right align, \'c\'=center, \'p{5cm}\'=block with column width 5cm ';
  out += '\n\\begin{tabular}{|';
  Object.keys(table[0]).forEach(function () {
    out += 'l|';
  });
  out += '} \n';
  out += '\n  \\hline  %horizontal line\n';
  //make header
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
  out += '\n  \\hline  % ----- table row -----';
  ////make rows
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

},{}],64:[function(_dereq_,module,exports){
'use strict';

var pad = _dereq_('../lib/pad');
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
};

//markdown tables are weird
var doTable = function doTable(table, options) {
  var md = '';
  if (!table || table.length === 0) {
    return md;
  }
  var keys = Object.keys(table[0]);
  //first, grab the headers
  //remove auto-generated number keys
  var headers = keys.map(function (k) {
    if (/^col[0-9]/.test(k) === true) {
      return '';
    }
    return k;
  });
  //draw the header (necessary!)
  md += makeRow(headers) + '\n';
  md += makeRow(['---', '---', '---']) + '\n';
  //do each row..
  md += table.map(function (row) {
    //each column..
    var arr = keys.map(function (k) {
      if (!row[k]) {
        return '';
      }
      return row[k].markdown(options) || '';
    });
    //make it a nice padded row
    return makeRow(arr);
  }).join('\n');
  return md + '\n';
};
module.exports = doTable;

},{"../lib/pad":33}],65:[function(_dereq_,module,exports){
'use strict';

var pipeSplit = _dereq_('./parsers/pipeSplit');

var currencyTemplateCodes = {
  us$: 'US$', // https://en.wikipedia.org/wiki/Template:US$
  bdt: '৳', // https://en.wikipedia.org/wiki/Template:BDT
  a$: 'A$', // https://en.wikipedia.org/wiki/Template:AUD
  ca$: 'CA$', // https://en.wikipedia.org/wiki/Template:CAD
  cny: 'CN¥', // https://en.wikipedia.org/wiki/Template:CNY
  hkd: 'HK$', // https://en.wikipedia.org/wiki/Template:HKD
  gbp: 'GB£', // https://en.wikipedia.org/wiki/Template:GBP
  '₹': '₹', // https://en.wikipedia.org/wiki/Template:Indian_Rupee
  '¥': '¥', // https://en.wikipedia.org/wiki/Template:JPY
  jpy: '¥',
  yen: '¥',
  '₱': '₱', // https://en.wikipedia.org/wiki/Template:Philippine_peso
  pkr: '₨' // https://en.wikipedia.org/wiki/Template:Pakistani_Rupee
};

var templateForCurrency = function templateForCurrency(currency) {
  return function (tmpl) {
    var _pipeSplit = pipeSplit(tmpl, ['value', 'year']),
        year = _pipeSplit.year,
        value = _pipeSplit.value;
    // Ignore round, about, link options


    if (year) {
      // Don't perform inflation adjustment
      return '' + currency + value + ' (' + year + ')';
    }
    if (value) {
      return '' + currency + value;
    }
    return currency;
  };
};

var currencies = Object.keys(currencyTemplateCodes).reduce(function (result, code) {
  result[code] = templateForCurrency(currencyTemplateCodes[code]);
  return result;
}, {
  // https://en.wikipedia.org/wiki/Template:Currency
  currency: function currency(tmpl) {
    // Ignore first and linked options
    var _pipeSplit2 = pipeSplit(tmpl, ['amount', 'code']),
        code = _pipeSplit2.code,
        amount = _pipeSplit2.amount;

    return '' + code + amount;
  }
});

module.exports = currencies;

},{"./parsers/pipeSplit":91}],66:[function(_dereq_,module,exports){
'use strict';

//assorted parsing methods for date/time templates
var months = [undefined, //1-based months.. :/
'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var monthName = months.reduce(function (h, str, i) {
  if (i === 0) {
    return h;
  }
  h[str.toLowerCase()] = i;
  return h;
}, {});

//parse year|month|date numbers
var ymd = function ymd(arr) {
  var obj = {};
  var units = ['year', 'month', 'date', 'hour', 'minute', 'second'];
  //parse each unit in sequence..
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
  }
  //try for timezone,too ftw
  var last = arr[arr.length - 1] || '';
  last = String(last);
  if (last.toLowerCase() === 'z') {
    obj.tz = 'UTC';
  } else if (/[+-][0-9]+:[0-9]/.test(last)) {
    obj.tz = arr[6];
  }
  return obj;
};

//zero-pad a number
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
      str = months[date.month] + ' ' + date.year;
    } else {
      //January 5, 1995
      str = months[date.month] + ' ' + date.date + ', ' + date.year;
      //add times, if available
      if (date.hour !== undefined && date.minute !== undefined) {
        var time = pad(date.hour) + ':' + pad(date.minute);
        if (date.second !== undefined) {
          time = time + ':' + pad(date.second);
        }
        str = time + ', ' + str;
        //add timezone, if there, at the end in brackets
      }
      if (date.tz) {
        str += ' (' + date.tz + ')';
      }
    }
  }
  return str;
};

module.exports = {
  toText: toText,
  ymd: ymd
};

},{}],67:[function(_dereq_,module,exports){
"use strict";

//this is allowed to be rough
var day = 1000 * 60 * 60 * 24;
var month = day * 30;
var year = day * 365;

var getEpoch = function getEpoch(obj) {
  return new Date(obj.year + "-" + (obj.month || 0) + "-" + (obj.date || 1)).getTime();
};

//very rough!
var delta = function delta(from, to) {
  from = getEpoch(from);
  to = getEpoch(to);
  var diff = to - from;
  var obj = {};
  //get years
  var years = Math.floor(diff / year, 10);
  if (years > 0) {
    obj.years = years;
    diff -= obj.years * year;
  }
  //get months
  var months = Math.floor(diff / month, 10);
  if (months > 0) {
    obj.months = months;
    diff -= obj.months * month;
  }
  //get days
  var days = Math.floor(diff / day, 10);
  if (days > 0) {
    obj.days = days;
    // diff -= (obj.days * day);
  }
  return obj;
};

module.exports = delta;

},{}],68:[function(_dereq_,module,exports){
'use strict';

var parsers = _dereq_('./parsers');
var pipeSplit = _dereq_('../parsers/pipeSplit');
var timeSince = _dereq_('./timeSince');
var date = parsers.date;
var natural_date = parsers.natural_date;

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//date- templates we support
var templates = {
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
    return pipeSplit(tmpl, order).date;
  },
  'time ago': function timeAgo(tmpl) {
    var order = ['date', 'fmt'];
    var time = pipeSplit(tmpl, order).date;
    return timeSince(time);
  },
  //sortable dates -
  dts: function dts(tmpl) {
    //remove formatting stuff, ewww
    tmpl = tmpl.replace(/\|format=[ymd]+/i, '');
    tmpl = tmpl.replace(/\|abbr=(on|off)/i, '');
    var order = ['year', 'month', 'date', 'bc'];
    var obj = pipeSplit(tmpl, order);
    var text = obj.month || '';
    if (obj.date) {
      text += ' ' + obj.date;
    }
    if (obj.year) {
      if (obj.year < 0) {
        obj.year = Math.abs(obj.year) + ' BC';
      }
      text += ' ' + obj.year;
    }
    return text;
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
  'birth date and age': date,
  'death date and age': date,
  'birth date and given age': date,
  'death date and given age': date,
  'birth year and age': parsers.one_year,
  'death year and age': parsers.one_year,

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
  'bda': date,
  // 'birth date and age2': date,

  'age': parsers.age,
  'age nts': parsers.age,
  'age in years': parsers['diff-y'],
  'age in years and months': parsers['diff-ym'],
  'age in years, months and days': parsers['diff-ymd'],
  'age in years and days': parsers['diff-yd'],
  'age in days': parsers['diff-d']
  // 'age in years, months, weeks and days': true,
  // 'age as of date': true,

};
templates.localday = templates.currentday;
templates.localdayname = templates.currentdayname;
templates.localmonth = templates.currentmonth;
templates.localyear = templates.currentyear;
templates.currentmonthname = templates.currentmonth;
templates.currentmonthabbrev = templates.currentmonth;
module.exports = templates;

},{"../parsers/pipeSplit":91,"./parsers":69,"./timeSince":70}],69:[function(_dereq_,module,exports){
'use strict';

var dates = _dereq_('./dates');
var ymd = dates.ymd;
var toText = dates.toText;
var delta = _dereq_('./delta_date');
var strip = function strip(tmpl) {
  tmpl = tmpl.replace(/^\{\{/, '');
  tmpl = tmpl.replace(/\}\}$/, '');
  return tmpl;
};

//wrap it up as a template
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
  var to = arr.slice(4, 7);
  //assume now, if 'to' is empty
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
    tmpl = strip(tmpl);
    var arr = tmpl.split('|');
    arr = arr.slice(1, 8);
    //support 'df=yes|1894|7|26'
    if (arr[0] && /^df=/.test(arr[0])) {
      arr.shift();
    }
    var date = ymd(arr);
    date.text = toText(date); //make the replacement string
    if (date.text) {
      r.templates.push(template(date));
    }
    return date.text;
  },

  //support parsing of 'February 10, 1992'
  natural_date: function natural_date(tmpl, r) {
    tmpl = strip(tmpl);
    var arr = tmpl.split('|');
    var str = arr[1] || '';
    // - just a year
    var date = {};
    if (/^[0-9]{4}$/.test(str)) {
      date.year = parseInt(str, 10);
    } else {
      //parse the date, using the js date object (for now?)
      var txt = str.replace(/[a-z]+\/[a-z]+/i);
      txt = txt.replace(/[0-9]+:[0-9]+(am|pm)?/i);
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
    tmpl = strip(tmpl);
    var arr = tmpl.split('|');
    var str = arr[1] || '';
    var year = parseInt(str, 10);
    r.templates.push(template({
      year: year
    }));
    return str.trim();
  },

  //assume 'y|m|d' | 'y|m|d'
  two_dates: function two_dates(tmpl, r) {
    tmpl = strip(tmpl);
    var arr = tmpl.split('|');
    //'b' means show birth-date, otherwise show death-date
    if (arr[1] === 'B' || arr[1] === 'b') {
      var _date = ymd(arr.slice(2, 5));
      r.templates.push(template(_date));
      return toText(_date);
    }
    var date = ymd(arr.slice(5, 8));
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
    }
    //ergh...
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
    var arr = [];
    //ergh...
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

},{"./dates":66,"./delta_date":67}],70:[function(_dereq_,module,exports){
'use strict';

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
  }
  //figure out units
  var hours = delta / 1000 / 60 / 60;
  var days = hours / 24;
  if (days < 365) {
    return parseInt(days, 10) + ' days ' + predicate;
  }
  var years = days / 365;
  return parseInt(years, 10) + ' years ' + predicate;
};
module.exports = timeSince;

},{}],71:[function(_dereq_,module,exports){
'use strict';

var pipeSplit = _dereq_('./parsers/pipeSplit');

//this format seems to be a pattern for these
var generic = function generic(tmpl) {
  var order = ['id', 'title', 'description', 'section'];
  return pipeSplit(tmpl, order);
};
var idName = function idName(tmpl) {
  var order = ['id', 'name'];
  return pipeSplit(tmpl, order);
};

//https://en.wikipedia.org/wiki/Category:External_link_templates
var externals = {

  //https://en.wikipedia.org/wiki/Template:IMDb_title
  'imdb title': generic,
  'imdb name': generic,
  'imdb episode': generic,
  'imdb event': generic,
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
  //https://en.wikipedia.org/wiki/Template:DMOZ
  dmoz: generic,
  'find a grave': function findAGrave(tmpl) {
    var order = ['id', 'name', 'work', 'last', 'first', 'date', 'accessdate'];
    return pipeSplit(tmpl, order);
  },
  'congbio': function congbio(tmpl) {
    var order = ['id', 'name', 'date'];
    return pipeSplit(tmpl, order);
  },
  'hollywood Walk of Fame': function hollywoodWalkOfFame(tmpl) {
    var order = ['name'];
    return pipeSplit(tmpl, order);
  },
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
  'playmate': idName
};
//alias
externals.imdb = externals['imdb name'];
externals['imdb episodess'] = externals['imdb episode'];
module.exports = externals;

},{"./parsers/pipeSplit":91}],72:[function(_dereq_,module,exports){
'use strict';

var getInside = _dereq_('./parsers/inside');
var pipeSplit = _dereq_('./parsers/pipeSplit');
var keyValue = _dereq_('./parsers/keyValue');

var templates = {
  //a convulated way to make a xml tag - https://en.wikipedia.org/wiki/Template:Tag
  tag: function tag(tmpl) {
    var obj = keyValue(tmpl);
    if (obj.content) {
      var order = ['tagName', 'open'];
      var tagName = pipeSplit(tmpl, order).tagName;
      //ignore ref tags and all that
      if (tagName !== 'span' && tagName !== 'div') {
        return '';
      }
      return obj.content; //.text();
    }
    return '';
  },
  plural: function plural(tmpl) {
    var order = ['num', 'word'];
    var obj = pipeSplit(tmpl, order);
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
  'first word': function firstWord(tmpl) {
    var str = getInside(tmpl).data || '';
    return str.split(' ')[0];
  },
  'trunc': function trunc(tmpl) {
    var order = ['str', 'len'];
    var obj = pipeSplit(tmpl, order);
    return obj.str.substr(0, obj.len);
  },
  'str mid': function strMid(tmpl) {
    var order = ['str', 'start', 'end'];
    var obj = pipeSplit(tmpl, order);
    var start = parseInt(obj.start, 10) - 1;
    var end = parseInt(obj.end, 10);
    return obj.str.substr(start, end);
  },
  //grab the first, second or third pipe
  'p1': function p1(tmpl) {
    var order = ['one'];
    return pipeSplit(tmpl, order).one;
  },
  'p2': function p2(tmpl) {
    var order = ['one', 'two'];
    return pipeSplit(tmpl, order).two;
  },
  'p3': function p3(tmpl) {
    var order = ['one', 'two', 'three'];
    return pipeSplit(tmpl, order).three;
  }
};

//templates that we simply grab their insides as plaintext
var inline = ['nowrap', 'big', 'cquote', 'pull quote', 'small', 'smaller', 'midsize', 'larger', 'big', 'bigger', 'large', 'huge', 'resize', 'delink'];
inline.forEach(function (k) {
  templates[k] = function (tmpl) {
    var inside = getInside(tmpl);
    return inside && inside['data'] || '';
  };
});

module.exports = templates;

},{"./parsers/inside":88,"./parsers/keyValue":89,"./parsers/pipeSplit":91}],73:[function(_dereq_,module,exports){
'use strict';

var getName = _dereq_('../parsers/_getName');
var pipeList = _dereq_('../parsers/pipeList');
var doKeyValue = _dereq_('./keyValue');

var maybeKeyValue = /\| *?[a-z].+= *?[a-z0-9]{2}/i; // {{name|foo=bar}}

//does it look like {{name|foo|bar}}
var maybePipeList = function maybePipeList(tmpl) {
  var pipes = tmpl.split('|').length;
  if (pipes > 2) {
    var equalSigns = tmpl.split('=').length;
    if (equalSigns <= 2) {
      return true;
    }
  }
  return false;
};

//somehow, we parse this template without knowing how to already
var generic = function generic(tmpl) {
  var name = getName(tmpl);
  //make sure it looks like a key-value template
  if (maybeKeyValue.test(tmpl) === true) {
    return doKeyValue(tmpl, name);
  }
  if (maybePipeList(tmpl) === true) {
    return pipeList(tmpl);
  }
  return null;
};
module.exports = generic;

},{"../parsers/_getName":83,"../parsers/pipeList":90,"./keyValue":74}],74:[function(_dereq_,module,exports){
'use strict';

var i18n = _dereq_('../../data/i18n');
var is_infobox = new RegExp('^(subst.)?(' + i18n.infoboxes.join('|') + ')[: \n]', 'i');
var is_citation = new RegExp('^(cite |citation)', 'i');
var keyValue = _dereq_('../parsers/keyValue');

var infoboxType = function infoboxType(name) {
  var reg = new RegExp('^(subst.)?(' + i18n.infoboxes.join('|') + ') *?', 'i');
  name = name.replace(reg, '');
  return name.trim();
};

//try to parse unknown template as a {{name|key=val|key2=val2}} format
var doKeyValue = function doKeyValue(tmpl, name) {
  //handle infoboxes
  if (name === 'infobox' || is_infobox.test(name)) {
    return {
      template: 'infobox',
      type: infoboxType(name),
      data: keyValue(tmpl, true)
    };
  }
  var data = keyValue(tmpl);
  //handle citation templates
  if (is_citation.test(name)) {
    var type = name.replace(/^cite +/, '').trim();
    return {
      template: 'citation',
      type: type,
      data: data
    };
  }
  //generic response
  //try to bury some annoying ones
  if (Object.keys(data).length === 1 && (data.date || data.state || data.format)) {
    return null;
  }
  return {
    template: name,
    data: data
  };
};
module.exports = doKeyValue;

},{"../../data/i18n":5,"../parsers/keyValue":89}],75:[function(_dereq_,module,exports){
'use strict';

var convertDMS = _dereq_('./dms-format');

var hemispheres = {
  n: true,
  s: true,
  w: true,
  e: true
};

var round = function round(num) {
  if (typeof num !== 'number') {
    return num;
  }
  var places = 100000;
  return Math.round(num * places) / places;
};

var parseCoord = function parseCoord(str) {
  var obj = {
    template: 'coord',
    lat: null,
    lon: null
  };
  var arr = str.split('|');
  //turn numbers into numbers, normalize N/s
  var nums = [];
  for (var i = 0; i < arr.length; i += 1) {
    var s = arr[i].trim();
    //make it a number
    var num = parseFloat(s);
    if (num || num === 0) {
      arr[i] = num;
      nums.push(num);
    } else if (s.match(/^region:/i)) {
      obj.region = s.replace(/^region:/i, '');
      continue;
    } else if (s.match(/^notes:/i)) {
      obj.notes = s.replace(/^notes:/i, '');
      continue;
    }
    //DMS-format
    if (hemispheres[s.toLowerCase()]) {
      if (obj.lat === null) {
        nums.push(s);
        obj.lat = convertDMS(nums);
        arr = arr.slice(i, arr.length);
        nums = [];
        i = 0;
      } else {
        nums.push(s);
        obj.lon = convertDMS(nums);
      }
    }
  }
  //this is an original `lat|lon` format
  if (!obj.lon && nums.length === 2) {
    obj.lat = nums[0];
    obj.lon = nums[1];
  }
  obj.lat = round(obj.lat);
  obj.lon = round(obj.lon);
  return obj;
};

module.exports = parseCoord;
// {{coord|latitude|longitude|coordinate parameters|template parameters}}
// {{coord|dd|N/S|dd|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|N/S|dd|mm|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|ss|N/S|dd|mm|ss|E/W|coordinate parameters|template parameters}}

},{"./dms-format":76}],76:[function(_dereq_,module,exports){
'use strict';

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
module.exports = parseDms;
// console.log(parseDms([57, 18, 22, 'N']));
// console.log(parseDms([4, 27, 32, 'W']));

},{}],77:[function(_dereq_,module,exports){
'use strict';

var parseCoord = _dereq_('./coord');
var strip = _dereq_('../parsers/_strip');

//
var geoTemplates = {
  coord: function coord(tmpl) {
    tmpl = strip(tmpl);
    return parseCoord(tmpl);
  }
};
module.exports = geoTemplates;

},{"../parsers/_strip":86,"./coord":75}],78:[function(_dereq_,module,exports){
'use strict';

//we explicitly ignore these, because they sometimes have resolve some data
var list = [
//https://en.wikipedia.org/wiki/category:templates_with_no_visible_output
'anchor', 'defaultsort', 'use american english', 'use australian english', 'use bangladeshi english', 'use british english', 'use british english oxford spelling', 'use canadian english', 'use dmy dates', 'use harvard referencing', 'use hong kong english', 'use indian english', 'use irish english', 'use jamaican english', 'use list-defined references', 'use mdy dates', 'use new zealand english', 'use pakistani english', 'use singapore english', 'use south african english', 'void',
//https://en.wikipedia.org/wiki/Category:Protection_templates
'pp', 'pp-move-indef', 'pp-semi-indef', 'pp-vandalism',
//https://en.wikipedia.org/wiki/Template:R
'r',
//out-of-scope still - https://en.wikipedia.org/wiki/Template:Tag
'#tag',
//https://en.wikipedia.org/wiki/Template:Navboxes
'navboxes', 'reflist', 'div col', 'flag', 'authority control',
//https://en.wikipedia.org/wiki/Template:Citation_needed
'better source', 'citation needed', 'clarify', 'cite quote', 'dead link', 'by whom', 'dubious', 'when', 'who', 'quantify', 'refimprove', 'weasel inline'];
var ignore = list.reduce(function (h, str) {
  h[str] = true;
  return h;
}, {});
module.exports = ignore;

},{}],79:[function(_dereq_,module,exports){
'use strict';

var getName = _dereq_('./parsers/_getName');
var getTemplates = _dereq_('./parsers/_getTemplates');

var dates = _dereq_('./dates');
var geo = _dereq_('./geo');
var inline = _dereq_('./inline');
var currencies = _dereq_('./currencies');
var misc = _dereq_('./misc');
var generic = _dereq_('./generic');
var links = _dereq_('./links');
var formatting = _dereq_('./formatting');
var pronounce = _dereq_('./pronounce');
var external = _dereq_('./external');
var ignore = _dereq_('./ignore');
var wiktionary = _dereq_('./wiktionary');

//put them all together
var inlineParsers = Object.assign({}, dates, inline, currencies, links, formatting, wiktionary);
var bigParsers = Object.assign({}, geo, pronounce, misc, external);

//this gets all the {{template}} strings and decides how to parse them
var doTemplate = function doTemplate(tmpl, wiki, r, options) {
  var name = getName(tmpl);

  //we explicitly ignore these templates
  if (ignore.hasOwnProperty(name) === true) {
    wiki = wiki.replace(tmpl, '');
    return wiki;
  }

  //string-replacement templates
  if (inlineParsers.hasOwnProperty(name) === true) {
    var str = inlineParsers[name](tmpl, r);
    wiki = wiki.replace(tmpl, str);
    return wiki;
  }

  //section-template parsers
  if (bigParsers.hasOwnProperty(name) === true) {
    var _obj = bigParsers[name](tmpl);
    if (_obj) {
      r.templates.push(_obj);
    }
    wiki = wiki.replace(tmpl, '');
    return wiki;
  }

  //fallback parser
  var obj = generic(tmpl, name);
  if (obj) {
    r.templates.push(obj);
    wiki = wiki.replace(tmpl, '');
    return wiki;
  }

  //bury this template, if we don't know it
  if (options.verbose_template === true) {
    console.log('  - no parser for \'' + name + '\' -');
  }
  wiki = wiki.replace(tmpl, '');

  return wiki;
};

//reduce the scary recursive situations
var allTemplates = function allTemplates(r, wiki, options) {
  var templates = getTemplates(wiki);
  //first, do the nested (second level) ones
  templates.nested.forEach(function (tmpl) {
    wiki = doTemplate(tmpl, wiki, r, options);
  });
  //then, reparse wiki for the top-level ones
  templates = getTemplates(wiki);

  //okay if we have a 3-level-deep template, do it again (but no further)
  if (templates.nested.length > 0) {
    templates.nested.forEach(function (tmpl) {
      wiki = doTemplate(tmpl, wiki, r, options);
    });
    templates = getTemplates(wiki); //this is getting crazy.
  }
  //okay, top-level
  templates.top.forEach(function (tmpl) {
    wiki = doTemplate(tmpl, wiki, r, options);
  });
  return wiki;
};

module.exports = allTemplates;

},{"./currencies":65,"./dates":68,"./external":71,"./formatting":72,"./generic":73,"./geo":77,"./ignore":78,"./inline":80,"./links":81,"./misc":82,"./parsers/_getName":83,"./parsers/_getTemplates":84,"./pronounce":92,"./wiktionary":93}],80:[function(_dereq_,module,exports){
'use strict';

var keyValue = _dereq_('./parsers/keyValue');
var pipeSplit = _dereq_('./parsers/pipeSplit');
var strip = _dereq_('./parsers/_strip');

var inline = {
  //newline-based list - https://en.wikipedia.org/wiki/Template:Plainlist
  plainlist: function plainlist(tmpl) {
    tmpl = strip(tmpl);
    //remove the title
    var arr = tmpl.split('|');
    arr = arr.slice(1);
    tmpl = arr.join('|');
    //split on newline
    arr = tmpl.split(/\n ?\* ?/);
    arr = arr.filter(function (s) {
      return s;
    });
    return arr.join(', ');
  },
  //https://en.wikipedia.org/wiki/Template:Collapsible_list
  'collapsible list': function collapsibleList(tmpl) {
    var val = strip(tmpl);
    var arr = val.split('|');
    arr = arr.map(function (s) {
      return s.trim();
    });
    arr = arr.filter(function (str) {
      return (/^title ?=/i.test(str) === false
      );
    });
    return arr.slice(1).join(', ');
  },
  //https://en.wikipedia.org/wiki/Template:Convert#Ranges_of_values
  convert: function convert(tmpl) {
    var order = ['num', 'two', 'three', 'four'];
    var obj = pipeSplit(tmpl, order);
    //todo: support plural units
    if (obj.two === '-' || obj.two === 'to' || obj.two === 'and') {
      if (obj.four) {
        return obj.num + ' ' + obj.two + ' ' + obj.three + ' ' + obj.four;
      }
      return obj.num + ' ' + obj.two + ' ' + obj.three;
    }
    return obj.num + ' ' + obj.two;
  },
  hlist: function hlist(tmpl) {
    var val = strip(tmpl).replace(/^hlist\s?\|/, '');
    var arr = val.split('|');
    arr = arr.filter(function (s) {
      return s && s.indexOf('=') === -1;
    });
    return arr.join(' · ');
  },
  //https://en.wikipedia.org/wiki/Template:Term
  term: function term(tmpl) {
    var order = ['term'];
    var obj = pipeSplit(tmpl, order);
    return obj.term + ':';
  },
  defn: function defn(tmpl) {
    var order = ['desc'];
    var obj = pipeSplit(tmpl, order);
    return obj.desc;
  },
  //https://en.wikipedia.org/wiki/Template:Interlanguage_link
  ill: function ill(tmpl) {
    var order = ['text', 'lan1', 'text1', 'lan2', 'text2'];
    var obj = pipeSplit(tmpl, order);
    return obj.text;
  },
  lang: function lang(tmpl) {
    var order = ['lang', 'text'];
    var obj = pipeSplit(tmpl, order);
    return obj.text;
  },
  //https://en.wikipedia.org/wiki/Template:Frac
  frac: function frac(tmpl) {
    var order = ['a', 'b', 'c'];
    var obj = pipeSplit(tmpl, order);
    if (obj.c) {
      return obj.a + ' ' + obj.b + '/' + obj.c;
    }
    if (obj.b) {
      return obj.a + '/' + obj.b;
    }
    return '1/' + obj.b;
  },
  //https://en.wikipedia.org/wiki/Template:OldStyleDate
  oldstyledate: function oldstyledate(tmpl) {
    var order = ['date', 'year'];
    var obj = pipeSplit(tmpl, order);
    var str = obj.date;
    if (obj.year) {
      str += ' ' + obj.year;
    }
    return str;
  },
  //https://en.wikipedia.org/wiki/Template:Height - {{height|ft=6|in=1}}
  height: function height(tmpl) {
    var obj = keyValue(tmpl);
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
    var obj = keyValue(tmpl);
    if (obj['1']) {
      return '\n' + obj['1'] + '\n';
    }
    return '';
  },
  'quote': function quote(tmpl) {
    var obj = keyValue(tmpl);
    if (obj.text) {
      var str = '"' + obj.text + '"';
      if (obj.author) {
        str += '  - ' + obj.author;
        str += '\n';
      }
      return str;
    }
    return '';
  },
  //https://en.wikipedia.org/wiki/Template:Marriage
  //this one creates a template, and an inline response
  marriage: function marriage(tmpl, r) {
    var data = pipeSplit(tmpl, ['name', 'from', 'to', 'end']);
    r.templates.push(data);
    var str = '' + (data.name || '');
    if (data.from) {
      if (data.to) {
        str += ' (m. ' + data.from + '-' + data.to + ')';
      } else {
        str += ' (m. ' + data.from + ')';
      }
    }
    return str;
  },
  //https://en.wikipedia.org/wiki/Template:Lbs
  lbs: function lbs(tmpl) {
    var obj = pipeSplit(tmpl, ['text']);
    return '[[' + obj.text + ' Lifeboat Station|' + obj.text + ']]';
  },
  //Foo-class
  lbc: function lbc(tmpl) {
    var obj = pipeSplit(tmpl, ['text']);
    return '[[' + obj.text + '-class lifeboat|' + obj.text + '-class]]';
  },
  lbb: function lbb(tmpl) {
    var obj = pipeSplit(tmpl, ['text']);
    return '[[' + obj.text + '-class lifeboat|' + obj.text + ']]';
  }
};
//aliases
inline.flatlist = inline.plainlist;

inline.ublist = inline.plainlist;
inline['unbulleted list'] = inline['collapsible list'];
inline['ubl'] = inline['collapsible list'];
inline['ordered list'] = inline['collapsible list'];

inline['str left'] = inline.trunc;
inline['str crop'] = inline.trunc;
module.exports = inline;

},{"./parsers/_strip":86,"./parsers/keyValue":89,"./parsers/pipeSplit":91}],81:[function(_dereq_,module,exports){
'use strict';

var pipeSplit = _dereq_('./parsers/pipeSplit');

var templates = {
  /* mostly wiktionary*/
  etyl: function etyl(tmpl) {
    var order = ['lang', 'page'];
    return pipeSplit(tmpl, order).page || '';
  },
  mention: function mention(tmpl) {
    var order = ['lang', 'page'];
    return pipeSplit(tmpl, order).page || '';
  },
  link: function link(tmpl) {
    var order = ['lang', 'page'];
    return pipeSplit(tmpl, order).page || '';
  },
  'la-verb-form': function laVerbForm(tmpl) {
    var order = ['word'];
    return pipeSplit(tmpl, order).word || '';
  },
  'la-ipa': function laIpa(tmpl) {
    var order = ['word'];
    return pipeSplit(tmpl, order).word || '';
  }
};

//these are insane
// https://en.wikipedia.org/wiki/Template:Tl
var links = ['lts', 't', 'tfd links', 'tiw', 'tltt', 'tetl', 'tsetl', 'ti', 'tic', 'tiw', 'tlt', 'ttl', 'twlh', 'tl2', 'tlu', 'demo', 'hatnote', 'xpd', 'para', 'elc', 'xtag', 'mli', 'mlix', '#invoke', 'url' //https://en.wikipedia.org/wiki/Template:URL
];

//keyValues
links.forEach(function (k) {
  templates[k] = function (tmpl) {
    var order = ['first', 'second'];
    var obj = pipeSplit(tmpl, order);
    return obj.second || obj.first;
  };
});
//aliases
templates.m = templates.mention;
templates['m-self'] = templates.mention;
templates.l = templates.link;
templates.ll = templates.link;
templates['l-self'] = templates.link;
module.exports = templates;

},{"./parsers/pipeSplit":91}],82:[function(_dereq_,module,exports){
'use strict';

var keyValue = _dereq_('./parsers/keyValue');
var getInside = _dereq_('./parsers/inside');
var pipeSplit = _dereq_('./parsers/pipeSplit');
var pipeList = _dereq_('./parsers/pipeList');
var Image = _dereq_('../image/Image');

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

  'book bar': pipeList,

  main: function main(tmpl) {
    var obj = getInside(tmpl);
    return {
      template: 'main',
      page: obj.data
    };
  },
  wide_image: function wide_image(tmpl) {
    var obj = getInside(tmpl);
    return {
      template: 'wide_image',
      image: obj.data
    };
  },

  //https://en.wikipedia.org/wiki/Template:Taxon_info
  'taxon info': function taxonInfo(tmpl) {
    var order = ['taxon', 'item'];
    return pipeSplit(tmpl, order);
  },
  'uss': function uss(tmpl) {
    var order = ['ship', 'id'];
    return pipeSplit(tmpl, order);
  },

  //same in every language.
  citation: function citation(tmpl) {
    var data = keyValue(tmpl);
    return {
      template: 'citation',
      data: data
    };
  },

  //https://en.wikipedia.org/wiki/Template:Redirect
  redirect: function redirect(tmpl) {
    var data = pipeList(tmpl).data;
    var links = [];
    for (var i = 1; i < data.length; i += 2) {
      links.push({
        page: data[i + 1],
        desc: data[i]
      });
    }
    return {
      template: 'redirect',
      redirect: data[0],
      links: links
    };
  },

  //this one sucks - https://en.wikipedia.org/wiki/Template:GNIS
  'cite gnis': function citeGnis(tmpl) {
    var order = ['id', 'name', 'type'];
    var obj = pipeSplit(tmpl, order);
    obj.template = 'citation';
    obj.type = 'gnis';
    return obj;
  },
  'sfn': function sfn(tmpl) {
    var order = ['author', 'year', 'location'];
    var obj = pipeSplit(tmpl, order);
    obj.template = 'citation';
    obj.type = 'sfn';
    return obj;
  },
  'audio': function audio(tmpl) {
    var order = ['file', 'text', 'type'];
    var obj = pipeSplit(tmpl, order);
    return obj;
  },
  'spoken wikipedia': function spokenWikipedia(tmpl) {
    var order = ['file', 'date'];
    var obj = pipeSplit(tmpl, order);
    obj.template = 'audio';
    return obj;
  },

  //https://en.wikipedia.org/wiki/Template:Sister_project_links
  'sister project links': function sisterProjectLinks(tmpl) {
    var data = keyValue(tmpl);
    var links = {};
    Object.keys(sisterProjects).forEach(function (k) {
      if (data.hasOwnProperty(k) === true) {
        links[sisterProjects[k]] = data[k]; //.text();
      }
    });
    return {
      template: 'sister project links',
      links: links
    };
  },

  //https://en.wikipedia.org/wiki/Template:Subject_bar
  'subject bar': function subjectBar(tmpl) {
    var data = keyValue(tmpl);
    Object.keys(data).forEach(function (k) {
      if (sisterProjects.hasOwnProperty(k)) {
        data[sisterProjects[k]] = data[k];
        delete data[k];
      }
    });
    return {
      template: 'subject bar',
      links: data
    };
  },
  'short description': function shortDescription(tmpl) {
    var data = pipeList(tmpl);
    return {
      template: data.template,
      description: data.data[0]
    };
  },
  'good article': function goodArticle() {
    return {
      template: 'Good article'
    };
  },
  //amazingly, this one does not obey any known patterns
  //https://en.wikipedia.org/wiki/Template:Gallery
  'gallery': function gallery(tmpl) {
    var obj = pipeList(tmpl);
    var images = obj.data.filter(function (line) {
      return (/^ *File ?:/.test(line)
      );
    });
    images = images.map(function (file) {
      return new Image(file).json();
    });
    return {
      template: 'gallery',
      images: images
    };
  }
};
//aliases
parsers['cite'] = parsers.citation;
parsers['sfnref'] = parsers.sfn;
parsers['harvid'] = parsers.sfn;
parsers['harvnb'] = parsers.sfn;
parsers['redir'] = parsers.redirect;
parsers['sisterlinks'] = parsers['sister project links'];

module.exports = parsers;

},{"../image/Image":20,"./parsers/inside":88,"./parsers/keyValue":89,"./parsers/pipeList":90,"./parsers/pipeSplit":91}],83:[function(_dereq_,module,exports){
'use strict';

//get the name of the template
//templates are usually '{{name|stuff}}'
var getName = function getName(tmpl) {
  var name = null;
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
    name = name.trim().toLowerCase();
  }
  return name || null;
};
// console.log(templateName('{{name|foo}}'));
// console.log(templateName('{{name here}}'));
// console.log(templateName('{{CITE book |title=the killer and the cartoons }}'));
// console.log(templateName(`{{name
// |key=val}}`));
module.exports = getName;

},{}],84:[function(_dereq_,module,exports){
'use strict';

var open = '{';
var close = '}';

var strip = function strip(str) {
  str = str.replace(/^\{\{/, '');
  str = str.replace(/\}\}$/, '');
  return str;
};

//
var findFlat = function findFlat(wiki) {
  var depth = 0;
  var list = [];
  var carry = [];
  var chars = wiki.split('');
  chars.forEach(function (c) {
    //open it
    if (c === open) {
      depth += 1;
    }
    //close it
    if (depth > 0) {
      if (c === close) {
        depth -= 1;
        if (depth === 0) {
          var tmpl = carry.join('') + c;
          carry = [];
          //last check
          if (/\{\{/.test(tmpl) && /\}\}/.test(tmpl)) {
            list.push(tmpl);
          }
          return;
        }
      }
      //require two '{{' to open it
      if (depth === 1 && c !== open && c !== close) {
        depth = 0;
        carry = [];
        return;
      }
      carry.push(c);
      return;
    }
  });
  return list;
};

//get all nested templates
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

module.exports = getTemplates;

// console.log(getTemplates('he is president. {{nowrap|he is {{age|1980}} years}} he lives in {{date}} texas'));

},{}],85:[function(_dereq_,module,exports){
'use strict';

var strip = _dereq_('./_strip');
var parseLine = _dereq_('../../sentence').parseLine;

//try to handle inline-wikitext, (like links) inside the pipe-text
var tightenUp = function tightenUp(arr) {
  return arr.map(function (str) {
    if (str && str.indexOf('[') !== -1) {
      var s = parseLine(str);
      if (s.links && s.links[0]) {
        return s.links[0].page;
      }
      return s.text;
    }
    return str;
  });
};

// this splits a text-segment by '|' characters, but does so carefully
var pipes = function pipes(tmpl) {
  tmpl = strip(tmpl);
  var arr = tmpl.split(/\|/g);
  for (var i = 0; i < arr.length; i += 1) {
    var str = arr[i];
    //stitch [[link|text]] pieces back together
    if (/\[\[[^\]]+$/.test(str) === true && /^[^\[]+\]\]/.test(arr[i + 1]) === true) {
      arr[i] += '|' + arr[i + 1];
      arr[i + 1] = null;
    }
    //stitch {{imdb|8392}} pieces back together, too
    if (/\{\{[^\}]+$/.test(str) === true && /^[^\{]+\}\}/.test(arr[i + 1]) === true) {
      arr[i] += '|' + arr[i + 1];
      arr[i + 1] = null;
    }
  }
  var name = arr[0] || '';
  arr = arr.slice(1);
  return {
    name: name.trim().toLowerCase(),
    list: tightenUp(arr)
  };
};
module.exports = pipes;

},{"../../sentence":51,"./_strip":86}],86:[function(_dereq_,module,exports){
'use strict';

//remove the top/bottom off the template
var strip = function strip(tmpl) {
  tmpl = tmpl.replace(/^\{\{/, '');
  tmpl = tmpl.replace(/\}\}$/, '');
  return tmpl;
};
module.exports = strip;

},{}],87:[function(_dereq_,module,exports){
'use strict';

var keyValue = _dereq_('./keyValue');
var getName = _dereq_('./_getName');
var maybeKeyValue = /\|.+?[a-z].+?=/; // |foo=

var knownTemplate = function knownTemplate(name) {
  if (/cite [a-z0-9]/.test(name) || name.toLowerCase().trim() === 'citation') {
    return 'citation';
  }
  return null;
};

//just go for it.
var genericTemplate = function genericTemplate(tmpl) {
  if (maybeKeyValue.test(tmpl)) {
    var name = getName(tmpl);
    if (name === null) {
      return null;
    }
    var data = keyValue(tmpl);
    if (data) {
      var obj = {
        name: name,
        data: data
      };
      var template = knownTemplate(name);
      if (template) {
        obj.template = template;
      }
      return obj;
    }
  }
  return null;
};
module.exports = genericTemplate;

},{"./_getName":83,"./keyValue":89}],88:[function(_dereq_,module,exports){
'use strict';

var strip = _dereq_('./_strip');

var grabInside = function grabInside(tmpl) {
  tmpl = strip(tmpl);
  var parts = tmpl.split('|');
  if (typeof parts[1] !== 'string') {
    return null;
  }
  //only split on the first pipe:
  parts[1] = parts.slice(1).join('|');

  var value = parts[1].trim();
  value = value.replace(/^[a-z0-9]{1,7}=/, ''); //support 'foo=value'
  return {
    template: parts[0].trim().toLowerCase(),
    data: value
  };
};
module.exports = grabInside;

},{"./_strip":86}],89:[function(_dereq_,module,exports){
'use strict';

var parseLine = _dereq_('../../sentence').parseLine;
var Sentence = _dereq_('../../sentence/Sentence');
var strip = _dereq_('./_strip');

//turn '| key = value' into an object
var keyValue = function keyValue(tmpl, isInfobox) {
  tmpl = strip(tmpl);
  var arr = tmpl.split(/\n?\|/);
  //look for broken-up links and fix them :(
  arr.forEach(function (a, i) {
    if (!arr[i + 1]) {
      return;
    }
    if (/\[\[[^\]]+$/.test(a) || /\{\{[^\}]+$/.test(a)) {
      // [[link|text]] or {{imdb|2386}}
      arr[i + 1] = arr[i] + '|' + arr[i + 1];
      arr[i] = null;
    }
  });
  arr = arr.filter(function (a) {
    return a && a.indexOf('=') !== -1;
  });
  var obj = arr.reduce(function (h, line) {
    var parts = line.split(/=/);
    if (parts.length > 2) {
      parts[1] = parts.slice(1).join('=');
    }
    var key = parts[0].toLowerCase().trim();
    var val = parts[1].trim();
    if (key !== '' && val !== '') {
      val = parseLine(val);
      if (isInfobox) {
        h[key] = new Sentence(val); //.json();
      } else {
        h[key] = val.text;
        if (val.links) {
          h._links = h._links || [];
          h._links = h._links.concat(val.links);
        }
      }
    }
    return h;
  }, {});
  return obj;
};
module.exports = keyValue;

},{"../../sentence":51,"../../sentence/Sentence":49,"./_strip":86}],90:[function(_dereq_,module,exports){
'use strict';

var keyVal = /[a-z0-9]+ *?= *?[a-z0-9]/i;
var pipes = _dereq_('./_pipes');

//generic unamed lists
// {{name|one|two|three}}
var pipeList = function pipeList(tmpl) {
  var found = pipes(tmpl);
  var obj = {
    template: found.name
  };
  var arr = found.list || [];
  arr.forEach(function (k, i) {
    if (arr[i]) {
      //support this gross 'id=234' format inside the value
      if (keyVal.test(arr[i]) === true) {
        arr[i] = arr[i].split('=')[1];
      }
      arr[i] = arr[i].trim();
    }
  });
  obj.data = arr;
  return obj;
};
module.exports = pipeList;

},{"./_pipes":85}],91:[function(_dereq_,module,exports){
'use strict';

var keyVal = /[a-z0-9]+ *?= *?[a-z0-9]/i;
var pipes = _dereq_('./_pipes');

//templates that look like this:
// {{name|one|two|three}}
var pipeSplit = function pipeSplit(tmpl, order) {
  var found = pipes(tmpl);
  var obj = {
    template: found.name
  };
  var arr = found.list || [];
  order.forEach(function (k, i) {
    if (arr[i]) {
      //support gross 'id=234' format inside the value
      var val = arr[i];
      var key = k;
      if (keyVal.test(arr[i]) === true) {
        var both = arr[i].split('=');
        val = both[1];
        if (isNaN(parseInt(both[0], 10))) {
          key = both[0].trim().toLowerCase();
        } else {
          key = order[parseInt(both[0], 10) - 1];
        }
      }
      val = val.trim();
      obj[key] = val;
    }
  });
  return obj;
};
module.exports = pipeSplit;

},{"./_pipes":85}],92:[function(_dereq_,module,exports){
'use strict';

var strip = _dereq_('./parsers/_strip');
// pronounciation info
// https://en.wikipedia.org/wiki/Template:IPA
var ipaTemplates = {
  ipa: function ipa(tmpl) {
    var arr = strip(tmpl).split('|');
    var lang = arr[0].replace(/^ipa(c-)?/i, '');
    lang = lang || null;
    return {
      template: 'ipa',
      lang: lang,
      ipa: arr.slice(1).join('')
    };
  }
};
// - other languages -
// Polish, {{IPAc-pl}}	{{IPAc-pl|'|sz|cz|e|ć|i|n}} → [ˈʂt͡ʂɛt͡ɕin]
// Portuguese, {{IPAc-pt}}	{{IPAc-pt|p|o|<|r|t|u|'|g|a|l|lang=pt}} and {{IPAc-pt|b|r|a|'|s|i|l|lang=br}} → [puɾtuˈɣaɫ] and [bɾaˈsiw]
var i18n = ['ipac-ar', 'ipac-cmn', 'ipac-en', 'ipac-es', 'ipac-fr', 'ipac-ga', 'ipac-he', 'ipac-hu', 'ipac-it', 'ipac-ja', 'ipac-ka', 'ipac-ko', 'ipac-mh', 'ipa-mg', 'ipac-mi', 'ipac-pl', 'ipac-pt', 'ipac-ro', 'ipac-yue'];
i18n.forEach(function (k) {
  return ipaTemplates[k] = ipaTemplates.ipa;
});
module.exports = ipaTemplates;

},{"./parsers/_strip":86}],93:[function(_dereq_,module,exports){
'use strict';

var pipeSplit = _dereq_('./parsers/pipeSplit');
var pipeList = _dereq_('./parsers/pipeList');
// const strip = require('./parsers/_strip');

//wiktionary... who knows. we should atleast try.
var templates = {

  'inflection': function inflection(tmpl, r) {
    var obj = pipeList(tmpl);
    r.templates.push({
      template: obj.template,
      lemma: obj.data[0],
      word: obj.data[1],
      tags: obj.data.slice(2)
    });
    return obj.data[0] || obj.data[1] || '';
  },

  //latin verbs
  'la-verb-form': function laVerbForm(tmpl, r) {
    var obj = pipeSplit(tmpl, ['word']);
    r.templates.push(obj);
    return obj.word || '';
  },
  'feminine plural': function femininePlural(tmpl, r) {
    var obj = pipeSplit(tmpl, ['word']);
    r.templates.push(obj);
    return obj.word || '';
  },
  'male plural': function malePlural(tmpl, r) {
    var obj = pipeSplit(tmpl, ['word']);
    r.templates.push(obj);
    return obj.word || '';
  },
  'rhymes': function rhymes(tmpl, r) {
    var obj = pipeSplit(tmpl, ['word']);
    r.templates.push(obj);
    return 'Rhymes: -' + (obj.word || '');
  }
};

//https://en.wiktionary.org/wiki/Category:Form-of_templates
var conjugations = ['abbreviation', 'abessive plural', 'abessive singular', 'accusative plural', 'accusative singular', 'accusative', 'acronym', 'active participle', 'agent noun', 'alternative case form', 'alternative form', 'alternative plural', 'alternative reconstruction', 'alternative spelling', 'alternative typography', 'aphetic form', 'apocopic form', 'archaic form', 'archaic spelling', 'aspirate mutation', 'associative plural', 'associative singular', 'attributive form', 'attributive form', 'augmentative', 'benefactive plural', 'benefactive singular', 'causative plural', 'causative singular', 'causative', 'clipping', 'combining form', 'comitative plural', 'comitative singular', 'comparative plural', 'comparative singular', 'comparative', 'contraction', 'dated form', 'dated spelling', 'dative plural definite', 'dative plural indefinite', 'dative plural', 'dative singular', 'dative', 'definite', 'deliberate misspelling', 'diminutive', 'distributive plural', 'distributive singular', 'dual', 'early form', 'eclipsis', 'elative', 'ellipsis', 'equative', 'euphemistic form', 'euphemistic spelling', 'exclusive plural', 'exclusive singular', 'eye dialect', 'feminine noun', 'feminine plural past participle', 'feminine plural', 'feminine singular past participle', 'feminine singular', 'feminine', 'form', 'former name', 'frequentative', 'future participle', 'genitive plural definite', 'genitive plural indefinite', 'genitive plural', 'genitive singular definite', 'genitive singular indefinite', 'genitive singular', 'genitive', 'gerund', 'h-prothesis', 'hard mutation', 'harmonic variant', 'imperative', 'imperfective form', 'inflected form', 'inflection', 'informal form', 'informal spelling', 'initialism', 'ja-form', 'jyutping reading', 'late form', 'lenition', 'masculine plural past participle', 'masculine plural', 'medieval spelling', 'misconstruction', 'misromanization', 'misspelling', 'mixed mutation', 'monotonic form', 'mutation', 'nasal mutation', 'negative', 'neuter plural past participle', 'neuter plural', 'neuter singular past participle', 'neuter singular', 'nominalization', 'nominative plural', 'nominative singular', 'nonstandard form', 'nonstandard spelling', 'oblique plural', 'oblique singular', 'obsolete form', 'obsolete spelling', 'obsolete typography', 'official form', 'participle', 'passive participle', 'passive', 'past active participle', 'past participle', 'past passive participle', 'past tense', 'perfective form', 'plural definite', 'plural indefinite', 'plural', 'polytonic form', 'present active participle', 'present participle', 'present tense', 'pronunciation spelling', 'rare form', 'rare spelling', 'reflexive', 'second-person singular past', 'short for', 'singular definite', 'singular', 'singulative', 'soft mutation', 'spelling', 'standard form', 'standard spelling', 'substantivisation', 'superlative', 'superseded spelling', 'supine', 'syncopic form', 'synonym', 'terminative plural', 'terminative singular', 'uncommon form', 'uncommon spelling', 'verbal noun', 'vocative plural', 'vocative singular'];
conjugations.forEach(function (name) {
  templates[name + ' of'] = function (tmpl, r) {
    var obj = pipeSplit(tmpl, ['word']);
    obj.type = 'form-of';
    r.templates.push(obj);
    return obj.word || '';
  };
});
module.exports = templates;

},{"./parsers/pipeList":90,"./parsers/pipeSplit":91}]},{},[26])(26)
});
