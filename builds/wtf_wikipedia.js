/* wtf_wikipedia v2.6.2
   github.com/spencermountain/wtf_wikipedia
   MIT
*/

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wtf = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(_dereq_,module,exports){

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

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
function Agent() {
  this._defaults = [];
}

["use", "on", "once", "set", "query", "type", "accept", "auth", "withCredentials", "sortQuery", "retry", "ok", "redirects",
 "timeout", "buffer", "serialize", "parse", "ca", "key", "pfx", "cert"].forEach(function(fn) {
  /** Default setting for all requests from this agent */
  Agent.prototype[fn] = function(/*varargs*/) {
    this._defaults.push({fn:fn, arguments:arguments});
    return this;
  }
});

Agent.prototype._setDefaults = function(req) {
    this._defaults.forEach(function(def) {
      req[def.fn].apply(req, def.arguments);
    });
};

module.exports = Agent;

},{}],4:[function(_dereq_,module,exports){
/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') { // Browser window
  root = window;
} else if (typeof self !== 'undefined') { // Web Worker
  root = self;
} else { // Other environments
  console.warn("Using browser-only version of superagent in non-browser environment");
  root = this;
}

var Emitter = _dereq_('component-emitter');
var RequestBase = _dereq_('./request-base');
var isObject = _dereq_('./is-object');
var ResponseBase = _dereq_('./response-base');
var Agent = _dereq_('./agent-base');

/**
 * Noop.
 */

function noop(){};

/**
 * Expose `request`.
 */

var request = exports = module.exports = function(method, url) {
  // callback
  if ('function' == typeof url) {
    return new exports.Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new exports.Request('GET', method);
  }

  return new exports.Request(method, url);
}

exports.Request = Request;

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  throw Error("Browser-only version of superagent could not find XHR");
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    pushEncodedKeyValuePair(pairs, key, obj[key]);
  }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (val != null) {
    if (Array.isArray(val)) {
      val.forEach(function(v) {
        pushEncodedKeyValuePair(pairs, key, v);
      });
    } else if (isObject(val)) {
      for(var subkey in val) {
        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
      }
    } else {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(val));
    }
  } else if (val === null) {
    pairs.push(encodeURIComponent(key));
  }
}

/**
 * Expose serialization method.
 */

request.serializeObject = serialize;

/**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var pair;
  var pos;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos == -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] =
        decodeURIComponent(pair.slice(pos + 1));
    }
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'text/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

request.serialize = {
  'application/x-www-form-urlencoded': serialize,
  'application/json': JSON.stringify,
};

/**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse,
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    if (index === -1) { // could be empty line, just skip it
      continue;
    }
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  // should match /json or +json
  // but not /json-seq
  return /[\/+]json($|[^-\w])/.test(mime);
}

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req) {
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  var status = this.xhr.status;
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
    status = 204;
  }
  this._setStatusProperties(status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);

  if (null === this.text && req._responseType) {
    this.body = this.xhr.response;
  } else {
    this.body = this.req.method != 'HEAD'
      ? this._parseBody(this.text ? this.text : this.xhr.response)
      : null;
  }
}

ResponseBase(Response.prototype);

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function(str) {
  var parse = request.parse[this.type];
  if (this.req._parser) {
    return this.req._parser(this, str);
  }
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      if (self.xhr) {
        // ie9 doesn't have 'response' property
        err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
        // issue #876: return the http status code if the response parsing fails
        err.status = self.xhr.status ? self.xhr.status : null;
        err.statusCode = err.status; // backwards-compat only
      } else {
        err.rawResponse = null;
        err.status = null;
      }

      return self.callback(err);
    }

    self.emit('response', res);

    var new_err;
    try {
      if (!self._isResponseOK(res)) {
        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
      }
    } catch(custom_err) {
      new_err = custom_err; // ok() callback can throw
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_err) {
      new_err.original = err;
      new_err.response = res;
      new_err.status = res.status;
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `RequestBase`.
 */

Emitter(Request.prototype);
RequestBase(Request.prototype);

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} [pass] optional in case of using 'bearer' as type
 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass, options){
  if (1 === arguments.length) pass = '';
  if (typeof pass === 'object' && pass !== null) { // pass is optional and can be replaced with options
    options = pass;
    pass = '';
  }
  if (!options) {
    options = {
      type: 'function' === typeof btoa ? 'basic' : 'auto',
    };
  }

  var encoder = function(string) {
    if ('function' === typeof btoa) {
      return btoa(string);
    }
    throw new Error('Cannot use basic auth, btoa is not a function');
  };

  return this._auth(user, pass, options, encoder);
};

/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, options){
  if (file) {
    if (this._data) {
      throw Error("superagent can't mix .send() and .attach()");
    }

    this._getFormData().append(field, file, options || file.name);
  }
  return this;
};

Request.prototype._getFormData = function(){
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  if (this._shouldRetry(err, res)) {
    return this._retry();
  }

  var fn = this._callback;
  this.clearTimeout();

  if (err) {
    if (this._maxRetries) err.retries = this._retries - 1;
    this.emit('error', err);
  }

  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

// This only warns, because the request is still likely to work
Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function(){
  console.warn("This is not supported in browser version of superagent");
  return this;
};

// This throws, because it can't send/receive data as expected
Request.prototype.pipe = Request.prototype.write = function(){
  throw Error("Streaming is not supported in browser version of superagent");
};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
Request.prototype._isHost = function _isHost(obj) {
  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
  return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
}

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  if (this._endCalled) {
    console.warn("Warning: .end() was called twice. This is not supported in superagent");
  }
  this._endCalled = true;

  // store callback
  this._callback = fn || noop;

  // querystring
  this._finalizeQueryString();

  return this._end();
};

Request.prototype._end = function() {
  var self = this;
  var xhr = (this.xhr = request.getXHR());
  var data = this._formData || this._data;

  this._setTimeouts();

  // state change
  xhr.onreadystatechange = function(){
    var readyState = xhr.readyState;
    if (readyState >= 2 && self._responseTimeoutTimer) {
      clearTimeout(self._responseTimeoutTimer);
    }
    if (4 != readyState) {
      return;
    }

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (!status) {
      if (self.timedout || self._aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = direction;
    self.emit('progress', e);
  };
  if (this.hasListeners('progress')) {
    try {
      xhr.onprogress = handleProgress.bind(null, 'download');
      if (xhr.upload) {
        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
      }
    } catch(e) {
      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }

  // initiate request
  try {
    if (this.username && this.password) {
      xhr.open(this.method, this.url, true, this.username, this.password);
    } else {
      xhr.open(this.method, this.url, true);
    }
  } catch (err) {
    // see #1149
    return this.callback(err);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) {
      serialize = request.serialize['application/json'];
    }
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;

    if (this.header.hasOwnProperty(field))
      xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};

request.agent = function() {
  return new Agent();
};

["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"].forEach(function(method) {
  Agent.prototype[method.toLowerCase()] = function(url, fn) {
    var req = new request.Request(method, url);
    this._setDefaults(req);
    if (fn) {
      req.end(fn);
    }
    return req;
  };
});

Agent.prototype.del = Agent.prototype['delete'];

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn) {
  var req = request('GET', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn) {
  var req = request('HEAD', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.options = function(url, data, fn) {
  var req = request('OPTIONS', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, data, fn) {
  var req = request('DELETE', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
}

request['del'] = del;
request['delete'] = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn) {
  var req = request('PATCH', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn) {
  var req = request('POST', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn) {
  var req = request('PUT', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

},{"./agent-base":3,"./is-object":5,"./request-base":6,"./response-base":7,"component-emitter":1}],5:[function(_dereq_,module,exports){
'use strict';

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return null !== obj && 'object' === typeof obj;
}

module.exports = isObject;

},{}],6:[function(_dereq_,module,exports){
'use strict';

/**
 * Module of mixed-in functions shared between node and client code
 */
var isObject = _dereq_('./is-object');

/**
 * Expose `RequestBase`.
 */

module.exports = RequestBase;

/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in RequestBase.prototype) {
    obj[key] = RequestBase.prototype[key];
  }
  return obj;
}

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.clearTimeout = function _clearTimeout(){
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.parse = function parse(fn){
  this._parser = fn;
  return this;
};

/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.responseType = function(val){
  this._responseType = val;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.serialize = function serialize(fn){
  this._serializer = fn;
  return this;
};

/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, deadline}
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.timeout = function timeout(options){
  if (!options || 'object' !== typeof options) {
    this._timeout = options;
    this._responseTimeout = 0;
    return this;
  }

  for(var option in options) {
    switch(option) {
      case 'deadline':
        this._timeout = options.deadline;
        break;
      case 'response':
        this._responseTimeout = options.response;
        break;
      default:
        console.warn("Unknown timeout option", option);
    }
  }
  return this;
};

/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @param {Function} [fn]
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.retry = function retry(count, fn){
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  this._retryCallback = fn;
  return this;
};

var ERROR_CODES = [
  'ECONNRESET',
  'ETIMEDOUT',
  'EADDRINFO',
  'ESOCKETTIMEDOUT'
];

/**
 * Determine if a request should be retried.
 * (Borrowed from segmentio/superagent-retry)
 *
 * @param {Error} err
 * @param {Response} [res]
 * @returns {Boolean}
 */
RequestBase.prototype._shouldRetry = function(err, res) {
  if (!this._maxRetries || this._retries++ >= this._maxRetries) {
    return false;
  }
  if (this._retryCallback) {
    try {
      var override = this._retryCallback(err, res);
      if (override === true) return true;
      if (override === false) return false;
      // undefined falls back to defaults
    } catch(e) {
      console.error(e);
    }
  }
  if (res && res.status && res.status >= 500 && res.status != 501) return true;
  if (err) {
    if (err.code && ~ERROR_CODES.indexOf(err.code)) return true;
    // Superagent timeout
    if (err.timeout && err.code == 'ECONNABORTED') return true;
    if (err.crossDomain) return true;
  }
  return false;
};

/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */

RequestBase.prototype._retry = function() {

  this.clearTimeout();

  // node
  if (this.req) {
    this.req = null;
    this.req = this.request();
  }

  this._aborted = false;
  this.timedout = false;

  return this._end();
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */

RequestBase.prototype.then = function then(resolve, reject) {
  if (!this._fullfilledPromise) {
    var self = this;
    if (this._endCalled) {
      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
    }
    this._fullfilledPromise = new Promise(function(innerResolve, innerReject) {
      self.end(function(err, res) {
        if (err) innerReject(err);
        else innerResolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
};

RequestBase.prototype.catch = function(cb) {
  return this.then(undefined, cb);
};

/**
 * Allow for extension
 */

RequestBase.prototype.use = function use(fn) {
  fn(this);
  return this;
};

RequestBase.prototype.ok = function(cb) {
  if ('function' !== typeof cb) throw Error("Callback required");
  this._okCallback = cb;
  return this;
};

RequestBase.prototype._isResponseOK = function(res) {
  if (!res) {
    return false;
  }

  if (this._okCallback) {
    return this._okCallback(res);
  }

  return res.status >= 200 && res.status < 300;
};

/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

RequestBase.prototype.get = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

RequestBase.prototype.getHeader = RequestBase.prototype.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 */
RequestBase.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name
 * @param {String|Blob|File|Buffer|fs.ReadStream} val
 * @return {Request} for chaining
 * @api public
 */
RequestBase.prototype.field = function(name, val) {
  // name should be either a string or an object.
  if (null === name || undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (this._data) {
    console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObject(name)) {
    for (var key in name) {
      this.field(key, name[key]);
    }
    return this;
  }

  if (Array.isArray(val)) {
    for (var i in val) {
      this.field(name, val[i]);
    }
    return this;
  }

  // val should be defined now
  if (null === val || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }
  if ('boolean' === typeof val) {
    val = '' + val;
  }
  this._getFormData().append(name, val);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */
RequestBase.prototype.abort = function(){
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  this.xhr && this.xhr.abort(); // browser
  this.req && this.req.abort(); // node
  this.clearTimeout();
  this.emit('abort');
  return this;
};

RequestBase.prototype._auth = function(user, pass, options, base64Encoder) {
  switch (options.type) {
    case 'basic':
      this.set('Authorization', 'Basic ' + base64Encoder(user + ':' + pass));
      break;

    case 'auto':
      this.username = user;
      this.password = pass;
      break;

    case 'bearer': // usage would be .auth(accessToken, { type: 'bearer' })
      this.set('Authorization', 'Bearer ' + user);
      break;
  }
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

RequestBase.prototype.withCredentials = function(on) {
  // This is browser-only functionality. Node side is no-op.
  if (on == undefined) on = true;
  this._withCredentials = on;
  return this;
};

/**
 * Set the max redirects to `n`. Does noting in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.redirects = function(n){
  this._maxRedirects = n;
  return this;
};

/**
 * Maximum size of buffered response body, in bytes. Counts uncompressed size.
 * Default 200MB.
 *
 * @param {Number} n
 * @return {Request} for chaining
 */
RequestBase.prototype.maxResponseSize = function(n){
  if ('number' !== typeof n) {
    throw TypeError("Invalid argument");
  }
  this._maxResponseSize = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

RequestBase.prototype.toJSON = function() {
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header,
  };
};

/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.send = function(data){
  var isObj = isObject(data);
  var type = this._header['content-type'];

  if (this._formData) {
    console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObj && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw Error("Can't merge these send calls");
  }

  // merge
  if (isObj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!isObj || this._isHost(data)) {
    return this;
  }

  // default to json
  if (!type) this.type('json');
  return this;
};

/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.sortQuery = function(sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */
RequestBase.prototype._finalizeQueryString = function(){
  var query = this._query.join('&');
  if (query) {
    this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
  }
  this._query.length = 0; // Makes the call idempotent

  if (this._sort) {
    var index = this.url.indexOf('?');
    if (index >= 0) {
      var queryArr = this.url.substring(index + 1).split('&');
      if ('function' === typeof this._sort) {
        queryArr.sort(this._sort);
      } else {
        queryArr.sort();
      }
      this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
    }
  }
};

// For backwards compat only
RequestBase.prototype._appendQueryString = function() {console.trace("Unsupported");}

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

RequestBase.prototype._timeoutError = function(reason, timeout, errno){
  if (this._aborted) {
    return;
  }
  var err = new Error(reason + timeout + 'ms exceeded');
  err.timeout = timeout;
  err.code = 'ECONNABORTED';
  err.errno = errno;
  this.timedout = true;
  this.abort();
  this.callback(err);
};

RequestBase.prototype._setTimeouts = function() {
  var self = this;

  // deadline
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
    }, this._timeout);
  }
  // response timeout
  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function(){
      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
    }, this._responseTimeout);
  }
};

},{"./is-object":5}],7:[function(_dereq_,module,exports){
'use strict';

/**
 * Module dependencies.
 */

var utils = _dereq_('./utils');

/**
 * Expose `ResponseBase`.
 */

module.exports = ResponseBase;

/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in ResponseBase.prototype) {
    obj[key] = ResponseBase.prototype[key];
  }
  return obj;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

ResponseBase.prototype.get = function(field) {
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

ResponseBase.prototype._setHeaderProperties = function(header){
    // TODO: moar!
    // TODO: make this a util

    // content-type
    var ct = header['content-type'] || '';
    this.type = utils.type(ct);

    // params
    var params = utils.params(ct);
    for (var key in params) this[key] = params[key];

    this.links = {};

    // links
    try {
        if (header.link) {
            this.links = utils.parseLinks(header.link);
        }
    } catch (err) {
        // ignore
    }
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

ResponseBase.prototype._setStatusProperties = function(status){
    var type = status / 100 | 0;

    // status / class
    this.status = this.statusCode = status;
    this.statusType = type;

    // basics
    this.info = 1 == type;
    this.ok = 2 == type;
    this.redirect = 3 == type;
    this.clientError = 4 == type;
    this.serverError = 5 == type;
    this.error = (4 == type || 5 == type)
        ? this.toError()
        : false;

    // sugar
    this.accepted = 202 == status;
    this.noContent = 204 == status;
    this.badRequest = 400 == status;
    this.unauthorized = 401 == status;
    this.notAcceptable = 406 == status;
    this.forbidden = 403 == status;
    this.notFound = 404 == status;
};

},{"./utils":8}],8:[function(_dereq_,module,exports){
'use strict';

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.type = function(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.params = function(str){
  return str.split(/ *; */).reduce(function(obj, str){
    var parts = str.split(/ *= */);
    var key = parts.shift();
    var val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseLinks = function(str){
  return str.split(/ *, */).reduce(function(obj, str){
    var parts = str.split(/ *; */);
    var url = parts[0].slice(1, -1);
    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
    obj[rel] = url;
    return obj;
  }, {});
};

/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */

exports.cleanHeader = function(header, changesOrigin){
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header['host'];
  // secuirty
  if (changesOrigin) {
    delete header['authorization'];
    delete header['cookie'];
  }
  return header;
};

},{}],9:[function(_dereq_,module,exports){
module.exports={
  "name": "wtf_wikipedia",
  "description": "parse wikiscript into json",
  "version": "2.6.2",
  "author": "Spencer Kelly <spencermountain@gmail.com> (http://spencermounta.in)",
  "repository": {
    "type": "git",
    "url": "git://github.com/spencermountain/wtf_wikipedia.git"
  },
  "main": "./src/index.js",
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
    "wikipedia": "./bin/parse.js",
    "wikipedia_plaintext": "./bin/plaintext.js"
  },
  "files": [
    "builds",
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
    "jshashes": "^1.0.6",
    "superagent": "^3.8.2"
  },
  "devDependencies": {
    "amble": "0.0.5",
    "babel-cli": "^6.10.1",
    "babel-plugin-transform-object-assign": "^6.8.0",
    "babel-preset-es2015": "6.24.1",
    "babelify": "8.0.0",
    "browserify": "14.4.0",
    "codacy-coverage": "^2.0.0",
    "derequire": "^2.0.3",
    "doctoc": "^1.3.0",
    "eslint": "^4.17.0",
    "gaze": "^1.1.1",
    "nyc": "^8.4.0",
    "shelljs": "^0.8.1",
    "tap-min": "^1.2.1",
    "tap-spec": "4.1.1",
    "tape": "4.8.0",
    "uglify-js": "3.3.9"
  },
  "license": "MIT"
}

},{}],10:[function(_dereq_,module,exports){
'use strict';

//these are used for the sentence-splitter
module.exports = ['jr', 'mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'sen', 'corp', 'calif', 'rep', 'gov', 'atty', 'supt', 'det', 'rev', 'col', 'gen', 'lt', 'cmdr', 'adm', 'capt', 'sgt', 'cpl', 'maj', 'dept', 'univ', 'assn', 'bros', 'inc', 'ltd', 'co', 'corp', 'arc', 'al', 'ave', 'blvd', 'cl', 'ct', 'cres', 'exp', 'rd', 'st', 'dist', 'mt', 'ft', 'fy', 'hwy', 'la', 'pd', 'pl', 'plz', 'tce', 'Ala', 'Ariz', 'Ark', 'Cal', 'Calif', 'Col', 'Colo', 'Conn', 'Del', 'Fed', 'Fla', 'Ga', 'Ida', 'Id', 'Ill', 'Ind', 'Ia', 'Kan', 'Kans', 'Ken', 'Ky', 'La', 'Me', 'Md', 'Mass', 'Mich', 'Minn', 'Miss', 'Mo', 'Mont', 'Neb', 'Nebr', 'Nev', 'Mex', 'Okla', 'Ok', 'Ore', 'Penna', 'Penn', 'Pa', 'Dak', 'Tenn', 'Tex', 'Ut', 'Vt', 'Va', 'Wash', 'Wis', 'Wisc', 'Wy', 'Wyo', 'USAFA', 'Alta', 'Ont', 'QuÔøΩ', 'Sask', 'Yuk', 'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'sept', 'vs', 'etc', 'esp', 'llb', 'md', 'bl', 'phd', 'ma', 'ba', 'miss', 'misses', 'mister', 'sir', 'esq', 'mstr', 'lit', 'fl', 'ex', 'eg', 'sep', 'sept', '..'];

},{}],11:[function(_dereq_,module,exports){
'use strict';

// wikipedia special terms lifted and augmented from parsoid parser april 2015
// (not even close to being complete)
var i18n = {
  files: ['файл', 'fitxer', 'soubor', 'datei', 'file', 'archivo', 'پرونده', 'tiedosto', 'mynd', "su'wret", 'fichier', 'bestand', 'датотека', 'dosya', 'fil'],
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

},{}],12:[function(_dereq_,module,exports){
'use strict';

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

},{}],13:[function(_dereq_,module,exports){
'use strict';

//from https://en.wikipedia.org/w/api.php?action=sitematrix&format=json
var site_map = {
  aawiki: 'https://aa.wikipedia.org',
  aawiktionary: 'https://aa.wiktionary.org',
  aawikibooks: 'https://aa.wikibooks.org',
  abwiki: 'https://ab.wikipedia.org',
  abwiktionary: 'https://ab.wiktionary.org',
  acewiki: 'https://ace.wikipedia.org',
  afwiki: 'https://af.wikipedia.org',
  afwiktionary: 'https://af.wiktionary.org',
  afwikibooks: 'https://af.wikibooks.org',
  afwikiquote: 'https://af.wikiquote.org',
  akwiki: 'https://ak.wikipedia.org',
  akwiktionary: 'https://ak.wiktionary.org',
  akwikibooks: 'https://ak.wikibooks.org',
  alswiki: 'https://als.wikipedia.org',
  alswiktionary: 'https://als.wiktionary.org',
  alswikibooks: 'https://als.wikibooks.org',
  alswikiquote: 'https://als.wikiquote.org',
  amwiki: 'https://am.wikipedia.org',
  amwiktionary: 'https://am.wiktionary.org',
  amwikiquote: 'https://am.wikiquote.org',
  anwiki: 'https://an.wikipedia.org',
  anwiktionary: 'https://an.wiktionary.org',
  angwiki: 'https://ang.wikipedia.org',
  angwiktionary: 'https://ang.wiktionary.org',
  angwikibooks: 'https://ang.wikibooks.org',
  angwikiquote: 'https://ang.wikiquote.org',
  angwikisource: 'https://ang.wikisource.org',
  arwiki: 'https://ar.wikipedia.org',
  arwiktionary: 'https://ar.wiktionary.org',
  arwikibooks: 'https://ar.wikibooks.org',
  arwikinews: 'https://ar.wikinews.org',
  arwikiquote: 'https://ar.wikiquote.org',
  arwikisource: 'https://ar.wikisource.org',
  arwikiversity: 'https://ar.wikiversity.org',
  arcwiki: 'https://arc.wikipedia.org',
  arzwiki: 'https://arz.wikipedia.org',
  aswiki: 'https://as.wikipedia.org',
  aswiktionary: 'https://as.wiktionary.org',
  aswikibooks: 'https://as.wikibooks.org',
  aswikisource: 'https://as.wikisource.org',
  astwiki: 'https://ast.wikipedia.org',
  astwiktionary: 'https://ast.wiktionary.org',
  astwikibooks: 'https://ast.wikibooks.org',
  astwikiquote: 'https://ast.wikiquote.org',
  avwiki: 'https://av.wikipedia.org',
  avwiktionary: 'https://av.wiktionary.org',
  aywiki: 'https://ay.wikipedia.org',
  aywiktionary: 'https://ay.wiktionary.org',
  aywikibooks: 'https://ay.wikibooks.org',
  azwiki: 'https://az.wikipedia.org',
  azwiktionary: 'https://az.wiktionary.org',
  azwikibooks: 'https://az.wikibooks.org',
  azwikiquote: 'https://az.wikiquote.org',
  azwikisource: 'https://az.wikisource.org',
  bawiki: 'https://ba.wikipedia.org',
  bawikibooks: 'https://ba.wikibooks.org',
  barwiki: 'https://bar.wikipedia.org',
  bat_smgwiki: 'https://bat-smg.wikipedia.org',
  bclwiki: 'https://bcl.wikipedia.org',
  bewiki: 'https://be.wikipedia.org',
  bewiktionary: 'https://be.wiktionary.org',
  bewikibooks: 'https://be.wikibooks.org',
  bewikiquote: 'https://be.wikiquote.org',
  bewikisource: 'https://be.wikisource.org',
  be_x_oldwiki: 'https://be-x-old.wikipedia.org',
  bgwiki: 'https://bg.wikipedia.org',
  bgwiktionary: 'https://bg.wiktionary.org',
  bgwikibooks: 'https://bg.wikibooks.org',
  bgwikinews: 'https://bg.wikinews.org',
  bgwikiquote: 'https://bg.wikiquote.org',
  bgwikisource: 'https://bg.wikisource.org',
  bhwiki: 'https://bh.wikipedia.org',
  bhwiktionary: 'https://bh.wiktionary.org',
  biwiki: 'https://bi.wikipedia.org',
  biwiktionary: 'https://bi.wiktionary.org',
  biwikibooks: 'https://bi.wikibooks.org',
  bjnwiki: 'https://bjn.wikipedia.org',
  bmwiki: 'https://bm.wikipedia.org',
  bmwiktionary: 'https://bm.wiktionary.org',
  bmwikibooks: 'https://bm.wikibooks.org',
  bmwikiquote: 'https://bm.wikiquote.org',
  bnwiki: 'https://bn.wikipedia.org',
  bnwiktionary: 'https://bn.wiktionary.org',
  bnwikibooks: 'https://bn.wikibooks.org',
  bnwikisource: 'https://bn.wikisource.org',
  bowiki: 'https://bo.wikipedia.org',
  bowiktionary: 'https://bo.wiktionary.org',
  bowikibooks: 'https://bo.wikibooks.org',
  bpywiki: 'https://bpy.wikipedia.org',
  brwiki: 'https://br.wikipedia.org',
  brwiktionary: 'https://br.wiktionary.org',
  brwikiquote: 'https://br.wikiquote.org',
  brwikisource: 'https://br.wikisource.org',
  bswiki: 'https://bs.wikipedia.org',
  bswiktionary: 'https://bs.wiktionary.org',
  bswikibooks: 'https://bs.wikibooks.org',
  bswikinews: 'https://bs.wikinews.org',
  bswikiquote: 'https://bs.wikiquote.org',
  bswikisource: 'https://bs.wikisource.org',
  bugwiki: 'https://bug.wikipedia.org',
  bxrwiki: 'https://bxr.wikipedia.org',
  cawiki: 'https://ca.wikipedia.org',
  cawiktionary: 'https://ca.wiktionary.org',
  cawikibooks: 'https://ca.wikibooks.org',
  cawikinews: 'https://ca.wikinews.org',
  cawikiquote: 'https://ca.wikiquote.org',
  cawikisource: 'https://ca.wikisource.org',
  cbk_zamwiki: 'https://cbk-zam.wikipedia.org',
  cdowiki: 'https://cdo.wikipedia.org',
  cewiki: 'https://ce.wikipedia.org',
  cebwiki: 'https://ceb.wikipedia.org',
  chwiki: 'https://ch.wikipedia.org',
  chwiktionary: 'https://ch.wiktionary.org',
  chwikibooks: 'https://ch.wikibooks.org',
  chowiki: 'https://cho.wikipedia.org',
  chrwiki: 'https://chr.wikipedia.org',
  chrwiktionary: 'https://chr.wiktionary.org',
  chywiki: 'https://chy.wikipedia.org',
  ckbwiki: 'https://ckb.wikipedia.org',
  cowiki: 'https://co.wikipedia.org',
  cowiktionary: 'https://co.wiktionary.org',
  cowikibooks: 'https://co.wikibooks.org',
  cowikiquote: 'https://co.wikiquote.org',
  crwiki: 'https://cr.wikipedia.org',
  crwiktionary: 'https://cr.wiktionary.org',
  crwikiquote: 'https://cr.wikiquote.org',
  crhwiki: 'https://crh.wikipedia.org',
  cswiki: 'https://cs.wikipedia.org',
  cswiktionary: 'https://cs.wiktionary.org',
  cswikibooks: 'https://cs.wikibooks.org',
  cswikinews: 'https://cs.wikinews.org',
  cswikiquote: 'https://cs.wikiquote.org',
  cswikisource: 'https://cs.wikisource.org',
  cswikiversity: 'https://cs.wikiversity.org',
  csbwiki: 'https://csb.wikipedia.org',
  csbwiktionary: 'https://csb.wiktionary.org',
  cuwiki: 'https://cu.wikipedia.org',
  cvwiki: 'https://cv.wikipedia.org',
  cvwikibooks: 'https://cv.wikibooks.org',
  cywiki: 'https://cy.wikipedia.org',
  cywiktionary: 'https://cy.wiktionary.org',
  cywikibooks: 'https://cy.wikibooks.org',
  cywikiquote: 'https://cy.wikiquote.org',
  cywikisource: 'https://cy.wikisource.org',
  dawiki: 'https://da.wikipedia.org',
  dawiktionary: 'https://da.wiktionary.org',
  dawikibooks: 'https://da.wikibooks.org',
  dawikiquote: 'https://da.wikiquote.org',
  dawikisource: 'https://da.wikisource.org',
  dewiki: 'https://de.wikipedia.org',
  dewiktionary: 'https://de.wiktionary.org',
  dewikibooks: 'https://de.wikibooks.org',
  dewikinews: 'https://de.wikinews.org',
  dewikiquote: 'https://de.wikiquote.org',
  dewikisource: 'https://de.wikisource.org',
  dewikiversity: 'https://de.wikiversity.org',
  dewikivoyage: 'https://de.wikivoyage.org',
  diqwiki: 'https://diq.wikipedia.org',
  dsbwiki: 'https://dsb.wikipedia.org',
  dvwiki: 'https://dv.wikipedia.org',
  dvwiktionary: 'https://dv.wiktionary.org',
  dzwiki: 'https://dz.wikipedia.org',
  dzwiktionary: 'https://dz.wiktionary.org',
  eewiki: 'https://ee.wikipedia.org',
  elwiki: 'https://el.wikipedia.org',
  elwiktionary: 'https://el.wiktionary.org',
  elwikibooks: 'https://el.wikibooks.org',
  elwikinews: 'https://el.wikinews.org',
  elwikiquote: 'https://el.wikiquote.org',
  elwikisource: 'https://el.wikisource.org',
  elwikiversity: 'https://el.wikiversity.org',
  elwikivoyage: 'https://el.wikivoyage.org',
  emlwiki: 'https://eml.wikipedia.org',
  enwiki: 'https://en.wikipedia.org',
  enwiktionary: 'https://en.wiktionary.org',
  enwikibooks: 'https://en.wikibooks.org',
  enwikinews: 'https://en.wikinews.org',
  enwikiquote: 'https://en.wikiquote.org',
  enwikisource: 'https://en.wikisource.org',
  enwikiversity: 'https://en.wikiversity.org',
  enwikivoyage: 'https://en.wikivoyage.org',
  eowiki: 'https://eo.wikipedia.org',
  eowiktionary: 'https://eo.wiktionary.org',
  eowikibooks: 'https://eo.wikibooks.org',
  eowikinews: 'https://eo.wikinews.org',
  eowikiquote: 'https://eo.wikiquote.org',
  eowikisource: 'https://eo.wikisource.org',
  eswiki: 'https://es.wikipedia.org',
  eswiktionary: 'https://es.wiktionary.org',
  eswikibooks: 'https://es.wikibooks.org',
  eswikinews: 'https://es.wikinews.org',
  eswikiquote: 'https://es.wikiquote.org',
  eswikisource: 'https://es.wikisource.org',
  eswikiversity: 'https://es.wikiversity.org',
  eswikivoyage: 'https://es.wikivoyage.org',
  etwiki: 'https://et.wikipedia.org',
  etwiktionary: 'https://et.wiktionary.org',
  etwikibooks: 'https://et.wikibooks.org',
  etwikiquote: 'https://et.wikiquote.org',
  etwikisource: 'https://et.wikisource.org',
  euwiki: 'https://eu.wikipedia.org',
  euwiktionary: 'https://eu.wiktionary.org',
  euwikibooks: 'https://eu.wikibooks.org',
  euwikiquote: 'https://eu.wikiquote.org',
  extwiki: 'https://ext.wikipedia.org',
  fawiki: 'https://fa.wikipedia.org',
  fawiktionary: 'https://fa.wiktionary.org',
  fawikibooks: 'https://fa.wikibooks.org',
  fawikinews: 'https://fa.wikinews.org',
  fawikiquote: 'https://fa.wikiquote.org',
  fawikisource: 'https://fa.wikisource.org',
  fawikivoyage: 'https://fa.wikivoyage.org',
  ffwiki: 'https://ff.wikipedia.org',
  fiwiki: 'https://fi.wikipedia.org',
  fiwiktionary: 'https://fi.wiktionary.org',
  fiwikibooks: 'https://fi.wikibooks.org',
  fiwikinews: 'https://fi.wikinews.org',
  fiwikiquote: 'https://fi.wikiquote.org',
  fiwikisource: 'https://fi.wikisource.org',
  fiwikiversity: 'https://fi.wikiversity.org',
  fiu_vrowiki: 'https://fiu-vro.wikipedia.org',
  fjwiki: 'https://fj.wikipedia.org',
  fjwiktionary: 'https://fj.wiktionary.org',
  fowiki: 'https://fo.wikipedia.org',
  fowiktionary: 'https://fo.wiktionary.org',
  fowikisource: 'https://fo.wikisource.org',
  frwiki: 'https://fr.wikipedia.org',
  frwiktionary: 'https://fr.wiktionary.org',
  frwikibooks: 'https://fr.wikibooks.org',
  frwikinews: 'https://fr.wikinews.org',
  frwikiquote: 'https://fr.wikiquote.org',
  frwikisource: 'https://fr.wikisource.org',
  frwikiversity: 'https://fr.wikiversity.org',
  frwikivoyage: 'https://fr.wikivoyage.org',
  frpwiki: 'https://frp.wikipedia.org',
  frrwiki: 'https://frr.wikipedia.org',
  furwiki: 'https://fur.wikipedia.org',
  fywiki: 'https://fy.wikipedia.org',
  fywiktionary: 'https://fy.wiktionary.org',
  fywikibooks: 'https://fy.wikibooks.org',
  gawiki: 'https://ga.wikipedia.org',
  gawiktionary: 'https://ga.wiktionary.org',
  gawikibooks: 'https://ga.wikibooks.org',
  gawikiquote: 'https://ga.wikiquote.org',
  gagwiki: 'https://gag.wikipedia.org',
  ganwiki: 'https://gan.wikipedia.org',
  gdwiki: 'https://gd.wikipedia.org',
  gdwiktionary: 'https://gd.wiktionary.org',
  glwiki: 'https://gl.wikipedia.org',
  glwiktionary: 'https://gl.wiktionary.org',
  glwikibooks: 'https://gl.wikibooks.org',
  glwikiquote: 'https://gl.wikiquote.org',
  glwikisource: 'https://gl.wikisource.org',
  glkwiki: 'https://glk.wikipedia.org',
  gnwiki: 'https://gn.wikipedia.org',
  gnwiktionary: 'https://gn.wiktionary.org',
  gnwikibooks: 'https://gn.wikibooks.org',
  gotwiki: 'https://got.wikipedia.org',
  gotwikibooks: 'https://got.wikibooks.org',
  guwiki: 'https://gu.wikipedia.org',
  guwiktionary: 'https://gu.wiktionary.org',
  guwikibooks: 'https://gu.wikibooks.org',
  guwikiquote: 'https://gu.wikiquote.org',
  guwikisource: 'https://gu.wikisource.org',
  gvwiki: 'https://gv.wikipedia.org',
  gvwiktionary: 'https://gv.wiktionary.org',
  hawiki: 'https://ha.wikipedia.org',
  hawiktionary: 'https://ha.wiktionary.org',
  hakwiki: 'https://hak.wikipedia.org',
  hawwiki: 'https://haw.wikipedia.org',
  hewiki: 'https://he.wikipedia.org',
  hewiktionary: 'https://he.wiktionary.org',
  hewikibooks: 'https://he.wikibooks.org',
  hewikinews: 'https://he.wikinews.org',
  hewikiquote: 'https://he.wikiquote.org',
  hewikisource: 'https://he.wikisource.org',
  hewikivoyage: 'https://he.wikivoyage.org',
  hiwiki: 'https://hi.wikipedia.org',
  hiwiktionary: 'https://hi.wiktionary.org',
  hiwikibooks: 'https://hi.wikibooks.org',
  hiwikiquote: 'https://hi.wikiquote.org',
  hifwiki: 'https://hif.wikipedia.org',
  howiki: 'https://ho.wikipedia.org',
  hrwiki: 'https://hr.wikipedia.org',
  hrwiktionary: 'https://hr.wiktionary.org',
  hrwikibooks: 'https://hr.wikibooks.org',
  hrwikiquote: 'https://hr.wikiquote.org',
  hrwikisource: 'https://hr.wikisource.org',
  hsbwiki: 'https://hsb.wikipedia.org',
  hsbwiktionary: 'https://hsb.wiktionary.org',
  htwiki: 'https://ht.wikipedia.org',
  htwikisource: 'https://ht.wikisource.org',
  huwiki: 'https://hu.wikipedia.org',
  huwiktionary: 'https://hu.wiktionary.org',
  huwikibooks: 'https://hu.wikibooks.org',
  huwikinews: 'https://hu.wikinews.org',
  huwikiquote: 'https://hu.wikiquote.org',
  huwikisource: 'https://hu.wikisource.org',
  hywiki: 'https://hy.wikipedia.org',
  hywiktionary: 'https://hy.wiktionary.org',
  hywikibooks: 'https://hy.wikibooks.org',
  hywikiquote: 'https://hy.wikiquote.org',
  hywikisource: 'https://hy.wikisource.org',
  hzwiki: 'https://hz.wikipedia.org',
  iawiki: 'https://ia.wikipedia.org',
  iawiktionary: 'https://ia.wiktionary.org',
  iawikibooks: 'https://ia.wikibooks.org',
  idwiki: 'https://id.wikipedia.org',
  idwiktionary: 'https://id.wiktionary.org',
  idwikibooks: 'https://id.wikibooks.org',
  idwikiquote: 'https://id.wikiquote.org',
  idwikisource: 'https://id.wikisource.org',
  iewiki: 'https://ie.wikipedia.org',
  iewiktionary: 'https://ie.wiktionary.org',
  iewikibooks: 'https://ie.wikibooks.org',
  igwiki: 'https://ig.wikipedia.org',
  iiwiki: 'https://ii.wikipedia.org',
  ikwiki: 'https://ik.wikipedia.org',
  ikwiktionary: 'https://ik.wiktionary.org',
  ilowiki: 'https://ilo.wikipedia.org',
  iowiki: 'https://io.wikipedia.org',
  iowiktionary: 'https://io.wiktionary.org',
  iswiki: 'https://is.wikipedia.org',
  iswiktionary: 'https://is.wiktionary.org',
  iswikibooks: 'https://is.wikibooks.org',
  iswikiquote: 'https://is.wikiquote.org',
  iswikisource: 'https://is.wikisource.org',
  itwiki: 'https://it.wikipedia.org',
  itwiktionary: 'https://it.wiktionary.org',
  itwikibooks: 'https://it.wikibooks.org',
  itwikinews: 'https://it.wikinews.org',
  itwikiquote: 'https://it.wikiquote.org',
  itwikisource: 'https://it.wikisource.org',
  itwikiversity: 'https://it.wikiversity.org',
  itwikivoyage: 'https://it.wikivoyage.org',
  iuwiki: 'https://iu.wikipedia.org',
  iuwiktionary: 'https://iu.wiktionary.org',
  jawiki: 'https://ja.wikipedia.org',
  jawiktionary: 'https://ja.wiktionary.org',
  jawikibooks: 'https://ja.wikibooks.org',
  jawikinews: 'https://ja.wikinews.org',
  jawikiquote: 'https://ja.wikiquote.org',
  jawikisource: 'https://ja.wikisource.org',
  jawikiversity: 'https://ja.wikiversity.org',
  jbowiki: 'https://jbo.wikipedia.org',
  jbowiktionary: 'https://jbo.wiktionary.org',
  jvwiki: 'https://jv.wikipedia.org',
  jvwiktionary: 'https://jv.wiktionary.org',
  kawiki: 'https://ka.wikipedia.org',
  kawiktionary: 'https://ka.wiktionary.org',
  kawikibooks: 'https://ka.wikibooks.org',
  kawikiquote: 'https://ka.wikiquote.org',
  kaawiki: 'https://kaa.wikipedia.org',
  kabwiki: 'https://kab.wikipedia.org',
  kbdwiki: 'https://kbd.wikipedia.org',
  kgwiki: 'https://kg.wikipedia.org',
  kiwiki: 'https://ki.wikipedia.org',
  kjwiki: 'https://kj.wikipedia.org',
  kkwiki: 'https://kk.wikipedia.org',
  kkwiktionary: 'https://kk.wiktionary.org',
  kkwikibooks: 'https://kk.wikibooks.org',
  kkwikiquote: 'https://kk.wikiquote.org',
  klwiki: 'https://kl.wikipedia.org',
  klwiktionary: 'https://kl.wiktionary.org',
  kmwiki: 'https://km.wikipedia.org',
  kmwiktionary: 'https://km.wiktionary.org',
  kmwikibooks: 'https://km.wikibooks.org',
  knwiki: 'https://kn.wikipedia.org',
  knwiktionary: 'https://kn.wiktionary.org',
  knwikibooks: 'https://kn.wikibooks.org',
  knwikiquote: 'https://kn.wikiquote.org',
  knwikisource: 'https://kn.wikisource.org',
  kowiki: 'https://ko.wikipedia.org',
  kowiktionary: 'https://ko.wiktionary.org',
  kowikibooks: 'https://ko.wikibooks.org',
  kowikinews: 'https://ko.wikinews.org',
  kowikiquote: 'https://ko.wikiquote.org',
  kowikisource: 'https://ko.wikisource.org',
  kowikiversity: 'https://ko.wikiversity.org',
  koiwiki: 'https://koi.wikipedia.org',
  krwiki: 'https://kr.wikipedia.org',
  krwikiquote: 'https://kr.wikiquote.org',
  krcwiki: 'https://krc.wikipedia.org',
  kswiki: 'https://ks.wikipedia.org',
  kswiktionary: 'https://ks.wiktionary.org',
  kswikibooks: 'https://ks.wikibooks.org',
  kswikiquote: 'https://ks.wikiquote.org',
  kshwiki: 'https://ksh.wikipedia.org',
  kuwiki: 'https://ku.wikipedia.org',
  kuwiktionary: 'https://ku.wiktionary.org',
  kuwikibooks: 'https://ku.wikibooks.org',
  kuwikiquote: 'https://ku.wikiquote.org',
  kvwiki: 'https://kv.wikipedia.org',
  kwwiki: 'https://kw.wikipedia.org',
  kwwiktionary: 'https://kw.wiktionary.org',
  kwwikiquote: 'https://kw.wikiquote.org',
  kywiki: 'https://ky.wikipedia.org',
  kywiktionary: 'https://ky.wiktionary.org',
  kywikibooks: 'https://ky.wikibooks.org',
  kywikiquote: 'https://ky.wikiquote.org',
  lawiki: 'https://la.wikipedia.org',
  lawiktionary: 'https://la.wiktionary.org',
  lawikibooks: 'https://la.wikibooks.org',
  lawikiquote: 'https://la.wikiquote.org',
  lawikisource: 'https://la.wikisource.org',
  ladwiki: 'https://lad.wikipedia.org',
  lbwiki: 'https://lb.wikipedia.org',
  lbwiktionary: 'https://lb.wiktionary.org',
  lbwikibooks: 'https://lb.wikibooks.org',
  lbwikiquote: 'https://lb.wikiquote.org',
  lbewiki: 'https://lbe.wikipedia.org',
  lezwiki: 'https://lez.wikipedia.org',
  lgwiki: 'https://lg.wikipedia.org',
  liwiki: 'https://li.wikipedia.org',
  liwiktionary: 'https://li.wiktionary.org',
  liwikibooks: 'https://li.wikibooks.org',
  liwikiquote: 'https://li.wikiquote.org',
  liwikisource: 'https://li.wikisource.org',
  lijwiki: 'https://lij.wikipedia.org',
  lmowiki: 'https://lmo.wikipedia.org',
  lnwiki: 'https://ln.wikipedia.org',
  lnwiktionary: 'https://ln.wiktionary.org',
  lnwikibooks: 'https://ln.wikibooks.org',
  lowiki: 'https://lo.wikipedia.org',
  lowiktionary: 'https://lo.wiktionary.org',
  ltwiki: 'https://lt.wikipedia.org',
  ltwiktionary: 'https://lt.wiktionary.org',
  ltwikibooks: 'https://lt.wikibooks.org',
  ltwikiquote: 'https://lt.wikiquote.org',
  ltwikisource: 'https://lt.wikisource.org',
  ltgwiki: 'https://ltg.wikipedia.org',
  lvwiki: 'https://lv.wikipedia.org',
  lvwiktionary: 'https://lv.wiktionary.org',
  lvwikibooks: 'https://lv.wikibooks.org',
  maiwiki: 'https://mai.wikipedia.org',
  map_bmswiki: 'https://map-bms.wikipedia.org',
  mdfwiki: 'https://mdf.wikipedia.org',
  mgwiki: 'https://mg.wikipedia.org',
  mgwiktionary: 'https://mg.wiktionary.org',
  mgwikibooks: 'https://mg.wikibooks.org',
  mhwiki: 'https://mh.wikipedia.org',
  mhwiktionary: 'https://mh.wiktionary.org',
  mhrwiki: 'https://mhr.wikipedia.org',
  miwiki: 'https://mi.wikipedia.org',
  miwiktionary: 'https://mi.wiktionary.org',
  miwikibooks: 'https://mi.wikibooks.org',
  minwiki: 'https://min.wikipedia.org',
  mkwiki: 'https://mk.wikipedia.org',
  mkwiktionary: 'https://mk.wiktionary.org',
  mkwikibooks: 'https://mk.wikibooks.org',
  mkwikisource: 'https://mk.wikisource.org',
  mlwiki: 'https://ml.wikipedia.org',
  mlwiktionary: 'https://ml.wiktionary.org',
  mlwikibooks: 'https://ml.wikibooks.org',
  mlwikiquote: 'https://ml.wikiquote.org',
  mlwikisource: 'https://ml.wikisource.org',
  mnwiki: 'https://mn.wikipedia.org',
  mnwiktionary: 'https://mn.wiktionary.org',
  mnwikibooks: 'https://mn.wikibooks.org',
  mowiki: 'https://mo.wikipedia.org',
  mowiktionary: 'https://mo.wiktionary.org',
  mrwiki: 'https://mr.wikipedia.org',
  mrwiktionary: 'https://mr.wiktionary.org',
  mrwikibooks: 'https://mr.wikibooks.org',
  mrwikiquote: 'https://mr.wikiquote.org',
  mrwikisource: 'https://mr.wikisource.org',
  mrjwiki: 'https://mrj.wikipedia.org',
  mswiki: 'https://ms.wikipedia.org',
  mswiktionary: 'https://ms.wiktionary.org',
  mswikibooks: 'https://ms.wikibooks.org',
  mtwiki: 'https://mt.wikipedia.org',
  mtwiktionary: 'https://mt.wiktionary.org',
  muswiki: 'https://mus.wikipedia.org',
  mwlwiki: 'https://mwl.wikipedia.org',
  mywiki: 'https://my.wikipedia.org',
  mywiktionary: 'https://my.wiktionary.org',
  mywikibooks: 'https://my.wikibooks.org',
  myvwiki: 'https://myv.wikipedia.org',
  mznwiki: 'https://mzn.wikipedia.org',
  nawiki: 'https://na.wikipedia.org',
  nawiktionary: 'https://na.wiktionary.org',
  nawikibooks: 'https://na.wikibooks.org',
  nawikiquote: 'https://na.wikiquote.org',
  nahwiki: 'https://nah.wikipedia.org',
  nahwiktionary: 'https://nah.wiktionary.org',
  nahwikibooks: 'https://nah.wikibooks.org',
  napwiki: 'https://nap.wikipedia.org',
  ndswiki: 'https://nds.wikipedia.org',
  ndswiktionary: 'https://nds.wiktionary.org',
  ndswikibooks: 'https://nds.wikibooks.org',
  ndswikiquote: 'https://nds.wikiquote.org',
  nds_nlwiki: 'https://nds-nl.wikipedia.org',
  newiki: 'https://ne.wikipedia.org',
  newiktionary: 'https://ne.wiktionary.org',
  newikibooks: 'https://ne.wikibooks.org',
  newwiki: 'https://new.wikipedia.org',
  ngwiki: 'https://ng.wikipedia.org',
  nlwiki: 'https://nl.wikipedia.org',
  nlwiktionary: 'https://nl.wiktionary.org',
  nlwikibooks: 'https://nl.wikibooks.org',
  nlwikinews: 'https://nl.wikinews.org',
  nlwikiquote: 'https://nl.wikiquote.org',
  nlwikisource: 'https://nl.wikisource.org',
  nlwikivoyage: 'https://nl.wikivoyage.org',
  nnwiki: 'https://nn.wikipedia.org',
  nnwiktionary: 'https://nn.wiktionary.org',
  nnwikiquote: 'https://nn.wikiquote.org',
  nowiki: 'https://no.wikipedia.org',
  nowiktionary: 'https://no.wiktionary.org',
  nowikibooks: 'https://no.wikibooks.org',
  nowikinews: 'https://no.wikinews.org',
  nowikiquote: 'https://no.wikiquote.org',
  nowikisource: 'https://no.wikisource.org',
  novwiki: 'https://nov.wikipedia.org',
  nrmwiki: 'https://nrm.wikipedia.org',
  nsowiki: 'https://nso.wikipedia.org',
  nvwiki: 'https://nv.wikipedia.org',
  nywiki: 'https://ny.wikipedia.org',
  ocwiki: 'https://oc.wikipedia.org',
  ocwiktionary: 'https://oc.wiktionary.org',
  ocwikibooks: 'https://oc.wikibooks.org',
  omwiki: 'https://om.wikipedia.org',
  omwiktionary: 'https://om.wiktionary.org',
  orwiki: 'https://or.wikipedia.org',
  orwiktionary: 'https://or.wiktionary.org',
  orwikisource: 'https://or.wikisource.org',
  oswiki: 'https://os.wikipedia.org',
  pawiki: 'https://pa.wikipedia.org',
  pawiktionary: 'https://pa.wiktionary.org',
  pawikibooks: 'https://pa.wikibooks.org',
  pagwiki: 'https://pag.wikipedia.org',
  pamwiki: 'https://pam.wikipedia.org',
  papwiki: 'https://pap.wikipedia.org',
  pcdwiki: 'https://pcd.wikipedia.org',
  pdcwiki: 'https://pdc.wikipedia.org',
  pflwiki: 'https://pfl.wikipedia.org',
  piwiki: 'https://pi.wikipedia.org',
  piwiktionary: 'https://pi.wiktionary.org',
  pihwiki: 'https://pih.wikipedia.org',
  plwiki: 'https://pl.wikipedia.org',
  plwiktionary: 'https://pl.wiktionary.org',
  plwikibooks: 'https://pl.wikibooks.org',
  plwikinews: 'https://pl.wikinews.org',
  plwikiquote: 'https://pl.wikiquote.org',
  plwikisource: 'https://pl.wikisource.org',
  plwikivoyage: 'https://pl.wikivoyage.org',
  pmswiki: 'https://pms.wikipedia.org',
  pnbwiki: 'https://pnb.wikipedia.org',
  pnbwiktionary: 'https://pnb.wiktionary.org',
  pntwiki: 'https://pnt.wikipedia.org',
  pswiki: 'https://ps.wikipedia.org',
  pswiktionary: 'https://ps.wiktionary.org',
  pswikibooks: 'https://ps.wikibooks.org',
  ptwiki: 'https://pt.wikipedia.org',
  ptwiktionary: 'https://pt.wiktionary.org',
  ptwikibooks: 'https://pt.wikibooks.org',
  ptwikinews: 'https://pt.wikinews.org',
  ptwikiquote: 'https://pt.wikiquote.org',
  ptwikisource: 'https://pt.wikisource.org',
  ptwikiversity: 'https://pt.wikiversity.org',
  ptwikivoyage: 'https://pt.wikivoyage.org',
  quwiki: 'https://qu.wikipedia.org',
  quwiktionary: 'https://qu.wiktionary.org',
  quwikibooks: 'https://qu.wikibooks.org',
  quwikiquote: 'https://qu.wikiquote.org',
  rmwiki: 'https://rm.wikipedia.org',
  rmwiktionary: 'https://rm.wiktionary.org',
  rmwikibooks: 'https://rm.wikibooks.org',
  rmywiki: 'https://rmy.wikipedia.org',
  rnwiki: 'https://rn.wikipedia.org',
  rnwiktionary: 'https://rn.wiktionary.org',
  rowiki: 'https://ro.wikipedia.org',
  rowiktionary: 'https://ro.wiktionary.org',
  rowikibooks: 'https://ro.wikibooks.org',
  rowikinews: 'https://ro.wikinews.org',
  rowikiquote: 'https://ro.wikiquote.org',
  rowikisource: 'https://ro.wikisource.org',
  rowikivoyage: 'https://ro.wikivoyage.org',
  roa_rupwiki: 'https://roa-rup.wikipedia.org',
  roa_rupwiktionary: 'https://roa-rup.wiktionary.org',
  roa_tarawiki: 'https://roa-tara.wikipedia.org',
  ruwiki: 'https://ru.wikipedia.org',
  ruwiktionary: 'https://ru.wiktionary.org',
  ruwikibooks: 'https://ru.wikibooks.org',
  ruwikinews: 'https://ru.wikinews.org',
  ruwikiquote: 'https://ru.wikiquote.org',
  ruwikisource: 'https://ru.wikisource.org',
  ruwikiversity: 'https://ru.wikiversity.org',
  ruwikivoyage: 'https://ru.wikivoyage.org',
  ruewiki: 'https://rue.wikipedia.org',
  rwwiki: 'https://rw.wikipedia.org',
  rwwiktionary: 'https://rw.wiktionary.org',
  sawiki: 'https://sa.wikipedia.org',
  sawiktionary: 'https://sa.wiktionary.org',
  sawikibooks: 'https://sa.wikibooks.org',
  sawikiquote: 'https://sa.wikiquote.org',
  sawikisource: 'https://sa.wikisource.org',
  sahwiki: 'https://sah.wikipedia.org',
  sahwikisource: 'https://sah.wikisource.org',
  scwiki: 'https://sc.wikipedia.org',
  scwiktionary: 'https://sc.wiktionary.org',
  scnwiki: 'https://scn.wikipedia.org',
  scnwiktionary: 'https://scn.wiktionary.org',
  scowiki: 'https://sco.wikipedia.org',
  sdwiki: 'https://sd.wikipedia.org',
  sdwiktionary: 'https://sd.wiktionary.org',
  sdwikinews: 'https://sd.wikinews.org',
  sewiki: 'https://se.wikipedia.org',
  sewikibooks: 'https://se.wikibooks.org',
  sgwiki: 'https://sg.wikipedia.org',
  sgwiktionary: 'https://sg.wiktionary.org',
  shwiki: 'https://sh.wikipedia.org',
  shwiktionary: 'https://sh.wiktionary.org',
  siwiki: 'https://si.wikipedia.org',
  siwiktionary: 'https://si.wiktionary.org',
  siwikibooks: 'https://si.wikibooks.org',
  simplewiki: 'https://simple.wikipedia.org',
  simplewiktionary: 'https://simple.wiktionary.org',
  simplewikibooks: 'https://simple.wikibooks.org',
  simplewikiquote: 'https://simple.wikiquote.org',
  skwiki: 'https://sk.wikipedia.org',
  skwiktionary: 'https://sk.wiktionary.org',
  skwikibooks: 'https://sk.wikibooks.org',
  skwikiquote: 'https://sk.wikiquote.org',
  skwikisource: 'https://sk.wikisource.org',
  slwiki: 'https://sl.wikipedia.org',
  slwiktionary: 'https://sl.wiktionary.org',
  slwikibooks: 'https://sl.wikibooks.org',
  slwikiquote: 'https://sl.wikiquote.org',
  slwikisource: 'https://sl.wikisource.org',
  slwikiversity: 'https://sl.wikiversity.org',
  smwiki: 'https://sm.wikipedia.org',
  smwiktionary: 'https://sm.wiktionary.org',
  snwiki: 'https://sn.wikipedia.org',
  snwiktionary: 'https://sn.wiktionary.org',
  sowiki: 'https://so.wikipedia.org',
  sowiktionary: 'https://so.wiktionary.org',
  sqwiki: 'https://sq.wikipedia.org',
  sqwiktionary: 'https://sq.wiktionary.org',
  sqwikibooks: 'https://sq.wikibooks.org',
  sqwikinews: 'https://sq.wikinews.org',
  sqwikiquote: 'https://sq.wikiquote.org',
  srwiki: 'https://sr.wikipedia.org',
  srwiktionary: 'https://sr.wiktionary.org',
  srwikibooks: 'https://sr.wikibooks.org',
  srwikinews: 'https://sr.wikinews.org',
  srwikiquote: 'https://sr.wikiquote.org',
  srwikisource: 'https://sr.wikisource.org',
  srnwiki: 'https://srn.wikipedia.org',
  sswiki: 'https://ss.wikipedia.org',
  sswiktionary: 'https://ss.wiktionary.org',
  stwiki: 'https://st.wikipedia.org',
  stwiktionary: 'https://st.wiktionary.org',
  stqwiki: 'https://stq.wikipedia.org',
  suwiki: 'https://su.wikipedia.org',
  suwiktionary: 'https://su.wiktionary.org',
  suwikibooks: 'https://su.wikibooks.org',
  suwikiquote: 'https://su.wikiquote.org',
  svwiki: 'https://sv.wikipedia.org',
  svwiktionary: 'https://sv.wiktionary.org',
  svwikibooks: 'https://sv.wikibooks.org',
  svwikinews: 'https://sv.wikinews.org',
  svwikiquote: 'https://sv.wikiquote.org',
  svwikisource: 'https://sv.wikisource.org',
  svwikiversity: 'https://sv.wikiversity.org',
  svwikivoyage: 'https://sv.wikivoyage.org',
  swwiki: 'https://sw.wikipedia.org',
  swwiktionary: 'https://sw.wiktionary.org',
  swwikibooks: 'https://sw.wikibooks.org',
  szlwiki: 'https://szl.wikipedia.org',
  tawiki: 'https://ta.wikipedia.org',
  tawiktionary: 'https://ta.wiktionary.org',
  tawikibooks: 'https://ta.wikibooks.org',
  tawikinews: 'https://ta.wikinews.org',
  tawikiquote: 'https://ta.wikiquote.org',
  tawikisource: 'https://ta.wikisource.org',
  tewiki: 'https://te.wikipedia.org',
  tewiktionary: 'https://te.wiktionary.org',
  tewikibooks: 'https://te.wikibooks.org',
  tewikiquote: 'https://te.wikiquote.org',
  tewikisource: 'https://te.wikisource.org',
  tetwiki: 'https://tet.wikipedia.org',
  tgwiki: 'https://tg.wikipedia.org',
  tgwiktionary: 'https://tg.wiktionary.org',
  tgwikibooks: 'https://tg.wikibooks.org',
  thwiki: 'https://th.wikipedia.org',
  thwiktionary: 'https://th.wiktionary.org',
  thwikibooks: 'https://th.wikibooks.org',
  thwikinews: 'https://th.wikinews.org',
  thwikiquote: 'https://th.wikiquote.org',
  thwikisource: 'https://th.wikisource.org',
  tiwiki: 'https://ti.wikipedia.org',
  tiwiktionary: 'https://ti.wiktionary.org',
  tkwiki: 'https://tk.wikipedia.org',
  tkwiktionary: 'https://tk.wiktionary.org',
  tkwikibooks: 'https://tk.wikibooks.org',
  tkwikiquote: 'https://tk.wikiquote.org',
  tlwiki: 'https://tl.wikipedia.org',
  tlwiktionary: 'https://tl.wiktionary.org',
  tlwikibooks: 'https://tl.wikibooks.org',
  tnwiki: 'https://tn.wikipedia.org',
  tnwiktionary: 'https://tn.wiktionary.org',
  towiki: 'https://to.wikipedia.org',
  towiktionary: 'https://to.wiktionary.org',
  tpiwiki: 'https://tpi.wikipedia.org',
  tpiwiktionary: 'https://tpi.wiktionary.org',
  trwiki: 'https://tr.wikipedia.org',
  trwiktionary: 'https://tr.wiktionary.org',
  trwikibooks: 'https://tr.wikibooks.org',
  trwikinews: 'https://tr.wikinews.org',
  trwikiquote: 'https://tr.wikiquote.org',
  trwikisource: 'https://tr.wikisource.org',
  tswiki: 'https://ts.wikipedia.org',
  tswiktionary: 'https://ts.wiktionary.org',
  ttwiki: 'https://tt.wikipedia.org',
  ttwiktionary: 'https://tt.wiktionary.org',
  ttwikibooks: 'https://tt.wikibooks.org',
  ttwikiquote: 'https://tt.wikiquote.org',
  tumwiki: 'https://tum.wikipedia.org',
  twwiki: 'https://tw.wikipedia.org',
  twwiktionary: 'https://tw.wiktionary.org',
  tywiki: 'https://ty.wikipedia.org',
  tyvwiki: 'https://tyv.wikipedia.org',
  udmwiki: 'https://udm.wikipedia.org',
  ugwiki: 'https://ug.wikipedia.org',
  ugwiktionary: 'https://ug.wiktionary.org',
  ugwikibooks: 'https://ug.wikibooks.org',
  ugwikiquote: 'https://ug.wikiquote.org',
  ukwiki: 'https://uk.wikipedia.org',
  ukwiktionary: 'https://uk.wiktionary.org',
  ukwikibooks: 'https://uk.wikibooks.org',
  ukwikinews: 'https://uk.wikinews.org',
  ukwikiquote: 'https://uk.wikiquote.org',
  ukwikisource: 'https://uk.wikisource.org',
  ukwikivoyage: 'https://uk.wikivoyage.org',
  urwiki: 'https://ur.wikipedia.org',
  urwiktionary: 'https://ur.wiktionary.org',
  urwikibooks: 'https://ur.wikibooks.org',
  urwikiquote: 'https://ur.wikiquote.org',
  uzwiki: 'https://uz.wikipedia.org',
  uzwiktionary: 'https://uz.wiktionary.org',
  uzwikibooks: 'https://uz.wikibooks.org',
  uzwikiquote: 'https://uz.wikiquote.org',
  vewiki: 'https://ve.wikipedia.org',
  vecwiki: 'https://vec.wikipedia.org',
  vecwiktionary: 'https://vec.wiktionary.org',
  vecwikisource: 'https://vec.wikisource.org',
  vepwiki: 'https://vep.wikipedia.org',
  viwiki: 'https://vi.wikipedia.org',
  viwiktionary: 'https://vi.wiktionary.org',
  viwikibooks: 'https://vi.wikibooks.org',
  viwikiquote: 'https://vi.wikiquote.org',
  viwikisource: 'https://vi.wikisource.org',
  viwikivoyage: 'https://vi.wikivoyage.org',
  vlswiki: 'https://vls.wikipedia.org',
  vowiki: 'https://vo.wikipedia.org',
  vowiktionary: 'https://vo.wiktionary.org',
  vowikibooks: 'https://vo.wikibooks.org',
  vowikiquote: 'https://vo.wikiquote.org',
  wawiki: 'https://wa.wikipedia.org',
  wawiktionary: 'https://wa.wiktionary.org',
  wawikibooks: 'https://wa.wikibooks.org',
  warwiki: 'https://war.wikipedia.org',
  wowiki: 'https://wo.wikipedia.org',
  wowiktionary: 'https://wo.wiktionary.org',
  wowikiquote: 'https://wo.wikiquote.org',
  wuuwiki: 'https://wuu.wikipedia.org',
  xalwiki: 'https://xal.wikipedia.org',
  xhwiki: 'https://xh.wikipedia.org',
  xhwiktionary: 'https://xh.wiktionary.org',
  xhwikibooks: 'https://xh.wikibooks.org',
  xmfwiki: 'https://xmf.wikipedia.org',
  yiwiki: 'https://yi.wikipedia.org',
  yiwiktionary: 'https://yi.wiktionary.org',
  yiwikisource: 'https://yi.wikisource.org',
  yowiki: 'https://yo.wikipedia.org',
  yowiktionary: 'https://yo.wiktionary.org',
  yowikibooks: 'https://yo.wikibooks.org',
  zawiki: 'https://za.wikipedia.org',
  zawiktionary: 'https://za.wiktionary.org',
  zawikibooks: 'https://za.wikibooks.org',
  zawikiquote: 'https://za.wikiquote.org',
  zeawiki: 'https://zea.wikipedia.org',
  zhwiki: 'https://zh.wikipedia.org',
  zhwiktionary: 'https://zh.wiktionary.org',
  zhwikibooks: 'https://zh.wikibooks.org',
  zhwikinews: 'https://zh.wikinews.org',
  zhwikiquote: 'https://zh.wikiquote.org',
  zhwikisource: 'https://zh.wikisource.org',
  zhwikivoyage: 'https://zh.wikivoyage.org',
  zh_classicalwiki: 'https://zh-classical.wikipedia.org',
  zh_min_nanwiki: 'https://zh-min-nan.wikipedia.org',
  zh_min_nanwiktionary: 'https://zh-min-nan.wiktionary.org',
  zh_min_nanwikibooks: 'https://zh-min-nan.wikibooks.org',
  zh_min_nanwikiquote: 'https://zh-min-nan.wikiquote.org',
  zh_min_nanwikisource: 'https://zh-min-nan.wikisource.org',
  zh_yuewiki: 'https://zh-yue.wikipedia.org',
  zuwiki: 'https://zu.wikipedia.org',
  zuwiktionary: 'https://zu.wiktionary.org',
  zuwikibooks: 'https://zu.wikibooks.org'
};
if (typeof module !== 'undefined' && module.exports) {
  module.exports = site_map;
}

},{}],14:[function(_dereq_,module,exports){
'use strict';

//turns wikimedia script into json
// https://github.com/spencermountain/wtf_wikipedia
//@spencermountain
var fetch = _dereq_('./lib/fetch_text');
var _parse = _dereq_('./parse');
var latex = _dereq_('./output/latex');
var markdown = _dereq_('./output/markdown');
var html = _dereq_('./output/html');
var WikiConvert = _dereq_('./lib/wikiconvert');
var wikiconvert = new WikiConvert();
if (wikiconvert) {
  console.log("wikiconvert exists");
  if (wikiconvert.replaceWikiLinks) {
    console.log("wikiconvert.replaceWikiLink() exists");
  } else {
    console.log("wikiconvert does NOT exists");
  }
} else {
  console.log("wikiconvert.replaceWikiLink() does NOT exists");
}
var version = _dereq_('../package').version;

//use a global var for lazy customization
var options = {};

//from a page title or id, fetch the wikiscript
var from_api = function from_api(page_identifier, lang_or_wikiid, cb) {
  if (typeof lang_or_wikiid === 'function') {
    cb = lang_or_wikiid;
    lang_or_wikiid = 'en';
  }
  cb = cb || function () {};
  lang_or_wikiid = lang_or_wikiid || 'en';
  if (!fetch) {
    //no http method, on the client side
    return cb(null);
  };
  var markup = fetch(page_identifier, lang_or_wikiid, cb);
  var vLanguage = lang_or_wikiid.substr(0, 2);
  var vDomain = "wikipedia";
  if (lang_or_wikiid.length > 2) {
    vDomain = lang_or_wikiid.substr(2, lang_or_wikiid.length);
    if (vDomain == "wiki") {
      vDomain == "wikipedia";
    };
  };
  var vDocJSON = {};
  //wikiconvert.init("en","wikiverstiy",vDocJSON);
  console.log("Language=" + vLanguage + " Domain=" + vDomain);
  //console.log(markup);
  return markup;
};

//turn wiki-markup into a nicely-formatted text
var plaintext = function plaintext(str, optionsP) {
  optionsP = optionsP === undefined ? options : optionsP;
  var data = _parse(str, optionsP) || {};
  data.sections = data.sections || [];
  var arr = data.sections.map(function (d) {
    return d.sentences.map(function (a) {
      return a.text;
    }).join(' ');
  });
  return arr.join('\n\n');
};

var customize = function customize(obj) {
  options.custom = obj;
};

module.exports = {
  from_api: from_api,
  plaintext: plaintext,
  markdown: markdown,
  html: html,
  latex: latex,
  version: version,
  custom: customize,
  wikiconvert: wikiconvert,
  parse: function parse(str, obj) {
    obj = obj || {};
    obj = Object.assign(obj, options); //grab 'custom' persistent options
    return _parse(str, obj);
  }
};

},{"../package":9,"./lib/fetch_text":16,"./lib/wikiconvert":19,"./output/html":20,"./output/latex":24,"./output/markdown":29,"./parse":35}],15:[function(_dereq_,module,exports){
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

},{}],16:[function(_dereq_,module,exports){
'use strict';
//grab the content of any article, off the api

var request = _dereq_('superagent');
var site_map = _dereq_('../data/site_map');
var redirects = _dereq_('../parse/page/redirects');

var fetch = function fetch(page_identifier, lang_or_wikiid, cb) {
  lang_or_wikiid = lang_or_wikiid || 'en';
  var identifier_type = 'titles';
  if (page_identifier.match(/^[0-9]*$/) && page_identifier.length > 3) {
    identifier_type = 'curid';
  }
  var url = void 0;
  if (site_map[lang_or_wikiid]) {
    url = site_map[lang_or_wikiid] + '/w/api.php';
  } else {
    url = 'https://' + lang_or_wikiid + '.wikipedia.org/w/api.php';
  }
  //we use the 'revisions' api here, instead of the Raw api, for its CORS-rules..
  url += '?action=query&prop=revisions&rvlimit=1&rvprop=content&format=json&origin=*';
  url += '&' + identifier_type + '=' + encodeURIComponent(page_identifier);

  request.get(url).end(function (err, res) {
    if (err || !res.body.query) {
      console.warn(err);
      cb(null);
      return;
    }
    var pages = res && res.body && res.body.query ? res.body.query.pages : {};
    var id = Object.keys(pages)[0];
    if (id) {
      var page = pages[id];
      if (page && page.revisions && page.revisions[0]) {
        var text = page.revisions[0]['*'];
        if (redirects.is_redirect(text)) {
          var result = redirects.parse_redirect(text);
          fetch(result.redirect, lang_or_wikiid, cb); //recursive
          return;
        }
        cb(text, page_identifier, lang_or_wikiid);
      } else {
        cb(null);
      }
    }
  });
};

module.exports = fetch;

// fetch('On_A_Friday', 'en', function(r) { // 'afwiki'
//   console.log(JSON.stringify(r, null, 2));
// });

},{"../data/site_map":13,"../parse/page/redirects":40,"superagent":4}],17:[function(_dereq_,module,exports){
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

},{}],18:[function(_dereq_,module,exports){
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
    //incriment open tag
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

},{}],19:[function(_dereq_,module,exports){
"use strict";

//#################################################################
//# Javascript Class: WikiConvert()
//#       SuperClass:
//#   Class Filename: wikiconvert.js
//#
//# Author of Class:      Engelbert Niehaus
//# email:                niehaus@uni-landau.de
//# created               21.1.2018
//# last modifications    2018/01/21 17:17:18
//# GNU Public License V3 - OpenSource
//#
//# created with JavaScript Class Creator JSCC
//#     https://niebert.github.io/JavascriptClassGenerator
//#################################################################

/*
This Library was created with JavascriptClassCreator
https://niebert.github.io/JavascriptClassCreator
The library is based on  wiki2HTML library of Elia Contini
publised under GPL.
Parses wiki markup and generates HTML 5 showing a preview.
   Copyright (C) 2010-2013 Elia Contini
    This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   any later version.
    This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
   along with this program. If not, see http://www.gnu.org/licenses/.
*/

//---------------------------------------------------------------------
//---Store File in Subdirectory /js and import this Class in HTML-File with
// SCRIPT-Tag:  LANGUAGE="JavaScript" SRC="js/wikiconvert.js"
//---------------------------------------------------------------------
//---Constructor of Class WikiConvert()
// Call the constructor for creating an instance of class WikiConvert
// by the following command in HTML-file that imports this class
// var vMyInstance = new WikiConvert();
//---------------------------------------------------------------------
//----Attributes-------------------------------------------------------
//---------------------------------------------------------------------
// If you want to access the attributes of WikiConvert, use
// the attribute name with a leading "this." in the definition of method of WikiConvert, e.g.
// this.aName = "Hello World";
//---------------------------------------------------------------------
//----Methods----------------------------------------------------------
//---------------------------------------------------------------------
// (1) If you want to assign definitions of methods for single instance of the class 'WikiConvert'
// they are defined with
//    this.my_method = function (pPar1,pPar2)
// this approach allows to overwrite the method definition of single instances dynamically.
//---------------------------------------------------------------------
// (2) A prototype definition of methods for 'WikiConvert' will be set by
// use the method's name and extend it with 'WikiConvert'.
//    WikiConvert.prototype.my_method = function (pPar1,pPar2)
// This approach consumes less memory for instances.
//---------------------------------------------------------------------

// no superclass defined


function WikiConvert() {
	// no superclass defined

	//---------------------------------------------------------------------
	//---Attributes of Class "WikiConvert()"
	//---------------------------------------------------------------------
	//---PUBLIC: aProjectDir (String): the attribute 'aProjectDir' stores in 'String' the relative path in the PanDoc root directory
	this.aWikiTitle = "Swarm intelligence";
	//---PUBLIC: aProjectDir (String): the attribute 'aProjectDir' stores in 'String' the relative path in the PanDoc root directory
	this.aProjectDir = "demo/my_article";
	//---PUBLIC: aRemoteMedia (Boolean): the attribute 'aRemoteMedia' stores in 'Boolean' variable if the MediaLinks are stored in the local file system of referenced to remote Media Server
	this.aRemoteMedia = false;
	//---PUBLIC: aLanguage ID (String): defines the Language of the MediaWiki
	this.aLanguage = "en";
	//---PUBLIC: aDomain(String): defines the MediaWiki product of Wiki Foundation "wikiversity", "wikipedia", ..
	this.aDomain = "wikiversity";
	//---PUBLIC: aTOC stored the TOC Table of Contents parsed from the section structure of the Wiki/HMTL file
	this.aTOC = [];
	this.aInsertTOC = true; // will be inserted in sections
	//---PUBLIC: aServer is set with the init(pLanguage,pDomain) together with aLanguage and aDomain
	this.aServer = "https://en.wikiversity.org/wiki/";
	//---PUBLIC: aMediaPath is used for downloading the embedded image resp. the referencing the images in the HTML
	this.aMediaPath = "https://en.wikiversity.org/wiki/Special:Redirect/file/";
	//---PUBLIC: aDocJSON is a Hash that collects the data while parsing the vWikiCode generated by wtf_wikipedia.js set by init()-call
	this.aDocJSON = {};
	// depricated replaced by aDocJSON
	this.aParseJSON = {};
	//---PUBLIC: aDefaultImageWidth is used if width of the image in not defined
	this.aDefaultImageWidth = 300;

	this.aMap = {};
	this.aMap["w"] = "wikipedia";
	this.aMap["wikipedia"] = "wikipedia";
	this.aMap["Wikipedia"] = "wikipedia";
	this.aMap["v"] = "wikiversity";
	this.aMap["wikiversity"] = "wikiversity";
	this.aMap["Wikiversity"] = "wikiversity";
	this.aMap["b"] = "wikibooks";
	this.aMap["wikibooks"] = "wikibooks";
	this.aMap["Wikibooks"] = "wikibooks";

	this.aFilePrefix = {};
	this.aFilePrefix["File"] = "File";
	this.aFilePrefix["file"] = "File";
	this.aFilePrefix["Datei"] = "File";
	this.aFilePrefix["Image"] = "File";

	this.aMediaArray = [];
	//this.aTplEngine = new TemplateEngine();


	//---------------------------------------------------------------------
	//---Methods of Class "WikiConvert()"
	//---------------------------------------------------------------------
	//----PUBLIC Method: WikiConvert.init(pLanguage,pDomain,pDocJSON)
	// init a converter with the language "en" and a domain "wikiversity" or "wikipedia"
	//----PUBLIC Method: WikiConvert.initArticle(pWikiTitle:String)
	// init the WikiConverter with a specific article Wiki Page Identifier
	//----PUBLIC Method: WikiConvert.convert(pWikiCode:String):String-----
	// convert(pWikiCode)  Return: String
	//	converts the MediaWiki code in argument and returns a corrected string
	//  that correct local image and wiki links into remote links and remotely embedded images
	//----PUBLIC Method: WikiConvert.clean_source(pWikiCode:String):String-----
	// clean_source(pWikiCode)  Return: String
	//	clean_source(pWikiCode) normalizes line breaks in order to have a common base string for all browsers.
	//	clean_source() uses the MediaWiki source code `pWikiCode` from the parameter of the function and returns a HTML string
	//	after removing all CRs.
	//----PUBLIC Method: WikiConvert.sections(pWikiCode:String):String-----
	// sections(pWikiCode)  Return: String
	//	Convert all sections in Wiki source code
	//----PUBLIC Method: WikiConvert.horizontalRule(pWikiCode:String):String-----
	// horizontalRule(pWikiCode)  Return: String
	//	Convert the  horizontal rules in Wiki source code
	//----PUBLIC Method: WikiConvert.inlineElement(pWikiCode:String):String-----
	// inlineElement(pWikiCode)  Return: String
	//	Convert for inline elements of the Wiki source code
	//----PUBLIC Method: WikiConvert.replaceImages(pWikiCode:String):String-----
	// replaceImages(pWikiCode)  Return: String
	//	Convert for inline elements of the Wiki source code
	//----PUBLIC Method: WikiConvert.math2jax(pWikiCode:String,pFormat:String):String-----
	// math2jax(pWikiCode,pFormat)  Return: String
	//	Convert the MATH-tag to a MathJax compatible HTML enviroment dependent of the pFormat of the parameter of math2jax.
	//	pFormat = 'reveal' 'html' are possible formats
	//----PUBLIC Method: WikiConvert.convertWiki2Local(pContent:String,:Hash):String-----
	// convertWiki2Local(pContent)  Return: String
	//	convertWiki2Local() replaces the MediaWiki internal links to links that work in a local HTML file. The parsed vMediaWiki Links
	//----PUBLIC Method: WikiConvert.parseWiki4Media(pWikiCode:String):Array-----
	// parseWiki4Media(pWikiCode)  Return: Array
	//	parseWiki4Media() the pWikiCode and extract the Media and File links.
	//----PUBLIC Method: WikiConvert.createMediaParseJSON(vMediaArray:Array)-----
	// createMediaParseJSON(vMediaArray)
	//	createMediaParseJSON(vMediaArray:Array) creates in this.aParseJSON["media"]={} a Hash
	//	that maps the local file path 'image/my_image.png' to the replace path
	//	this.aParseJSON["media"]["image/my_image.png"] = "https://commons.wikimedia.org/wiki/my_image.png"
	//----PUBLIC Method: WikiConvert.checkParseJSON(pHashID:String)-----
	// checkParseJSON(pHashID)
	//	checkParseJSON() checks if the File Link definitions exists in the pWikiHash["media"]
	//----PUBLIC Method: WikiConvert.getMediaSubDir(pMediaLink:String)-----
	// getMediaSubDir(pMediaLink)
	//	getMediaSubDir(pMediaLink) return for a pMediaLink the appropriate subdirectory.
	//----PUBLIC Method: WikiConvert.convertWikiMedia2File(pMediaLink:String):String-----
	// convertWikiMedia2File(pMediaLink)  Return: String
	//	convertWikiMedia2File(pMediaLink) converts the pMediaLink into an URL and returns the media link.
	//	removes blanks at the tail and replaces blanks with and underscore "_"
	//	and non-alpha-numerical characters with an underscore, so that finally the filename works fine on all file systems
	//----PUBLIC Method: WikiConvert.convertWikiMedia2URL(pMediaLink:String):String-----
	// convertWikiMedia2URL(pMediaLink)  Return: String
	//	convertWikiMedia2URL(pMediaLink) removes blanks at the tail and replaces blanks with and underscore "_"
	//----PUBLIC Method: WikiConvert.downloadWikiMedia(pMediaArray:Array)-----
	// downloadWikiMedia(pMediaArray)
	//	downloadWikiMedia(pMediaArray:Array) download the images to level-fs
	//	that can be exported as ZIP-file with archiver NPM module
	//----PUBLIC Method: WikiConvert.downloadMediaFile(pMediaLink:String)-----
	// downloadMediaFile(pMediaLink)
	//	downloadMediaFile(pMediaFile) from WikiMedia Commons to the local filesystem emulated with level-fs
	//----PUBLIC Method: WikiConvert.convertMediaLink4Wiki(pContent:String,pMediaArray:Array):String-----
	// convertMediaLink4Wiki(pContent,pMediaArray)  Return: String
	//	convertMediaLink4Wiki(pContent,pMediaWiki) convert the link
	//	- [[File:MyFile.png....   with
	//	- [File:https://commons.wikimedia.org/.../MyFile.png
	//----PUBLIC Method: WikiConvert.replaceString(pString:String,pSearch:String,pReplace:String):String-----
	// replaceString(pString,pSearch,pReplace)  Return: String
	//	replaceString(pString,pSearch,pReplace) replaces globally pSearch by pReplace and returns the modified string
	//----PUBLIC Method: WikiConvert.convertWiki2Online(pContent:String):String-----
	// convertWiki2Online(pContent)  Return: String
	//	convertWiki2Online(pContent) converts the Links and Media in way so that media and links
	//	are referenced to online resource to the server
	//----PUBLIC Method: WikiConvert.replaceWikiLinks(pWikiCode:String:Hash):String-----
	// replaceWikiLinks(pWikiCode)  Return: String
	//	Comment for replaceWikiLinks
	//----PUBLIC Method: WikiConvert.getWikiLinks(pWikiCode:String):String-----
	// getWikiLinks(pWikiCode)  Return: String
	//	getWikiLinks(pWikiCode) extract Double-Bracket [[...]] link in pWikiCode
	//----PUBLIC Method: WikiConvert.convertMediaLink4WikiOnline(pContent:String,pMediaArray:Array):String-----
	// convertMediaLink4WikiOnline(pContent,pMediaArray)  Return: String
	//	convertMediaLink4WikiOnline(pWikiCode,pMediaArray) converts Media Links to WikiMedia Commons
	//	to a remote link for local files

	//#################################################################
	//# PUBLIC Method: init()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pLanguage:String
	//#    pWikiID:String
	//# Comment:
	//#    parses the MediaWiki code in argument and returns a HTML string
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################


	WikiConvert.prototype.init = function (pLanguage, pDomain, pDocJSON) {
		this.aLanguage = pLanguage;
		this.aDomain = pDomain; // e.g. "wikiversity"
		this.aServer = "https://" + this.aLanguage + "." + this.aDomain + ".org/wiki/";
		this.aMediaPath = "https://" + this.aLanguage + "." + this.aDomain + ".org/wiki/Special:Redirect/file/";
		this.aDocJSON = pDocJSON || {};
		if (this.aDocJSON.hasOwnProperty("lang_or_wikiid")) {
			delete this.aDocJSON["lang_or_wikiid"];
		};
		this.aDocJSON["language"] = pLanguage;
		this.aDocJSON["domain"] = pDomain;
	};
	//----End of Method init Definition

	//#################################################################
	//# PUBLIC Method: initArticle()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pWikiCode:String
	//#    pWikiTitle:String
	//# Comment:
	//#    parses the MediaWiki code in argument and returns a HTML string
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################


	this.initArticle = function (pWikiTitle) {
		pWikiTitle = pWikiTitle || "Title undefined in convert()";
		var html = '<p>function wiki2html(pWikiCode): an error occurs</p>';
		this.aWikiTitle = pWikiTitle.replace(/_/g, " ");
		// set Title in DocJSON
		if (this.aDocJSON && this.aDocJSON.sections && this.aDocJSON.sections.length > 0) {
			// set Title in first section of aDocJSON
			this.aDocJSON.sections[0]["title"] = this.replaceString(this.aWikiTitle, "_", " ");
			// set Downloaded URL in aDocJSON
			this.aDocJSON["url"] = this.aServer + this.aWikiTitle;
			// set Download Time in aDocJSON
			var now = new Date();
			this.aDocJSON["date"] = now.toJSON();
		};
	};
	//----End of Method init Definition


	//#################################################################
	//# PUBLIC Method: convert()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pWikiCode:String
	//#    pWikiTitle:String
	//# Comment:
	//#    converts the MediaWiki code in argument and returns a HTML string
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.convert = function (pWikiCode, pWikiTitle) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: convert(pWikiCode:String):String");
		// alert("js/wikiconvert.js - Call: convert(pWikiCode:String):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.convert(pWikiCode);
		//-------------------------------------------------------

		// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/regexp
		this.initArticle(pWikiTitle);
		if (this.aRemoteMedia == true) {
			// remote Media links
			//pWikiCode = this.convertWiki2Online(pWikiCode);
		} else {
				// local media links - requires download of Media files for display
				//pWikiCode = this.convertWiki2Local(pWikiCode);
				// ZIP/archive downloaded files TODO
			};
		// saveJSON("wikidata.json",vParseJSON); // TODO
		pWikiCode = this.math2jax(pWikiCode);
		pWikiCode = this.math2reveal(pWikiCode);
		pWikiCode = this.replaceWikiLinks(pWikiCode);
		//pWikiCode = this.convertWiki2Local(pWikiCode);
		pWikiCode = this.replaceImages(pWikiCode);
		return pWikiCode || "";
	};
	//----End of Method convert Definition

	//#################################################################
	//# PUBLIC Method: clean_unsupported_wiki()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pWikiCode:String
	//# Comment:
	//#    clean_unsupported_wiki(pWikiCode) removes double bracket {{...}} Wiki commands.
	//#    clean_unsupported_wiki() uses the MediaWiki source code `pWikiCode` from the parameter of the function and returns a HTML string
	//#    after removing all {{...}} commands still left in Wiki Code.
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.clean_unsupported_wiki = function (pWikiCode) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: clean_unsupported_wiki(pWikiCode:String):String");
		// alert("js/wikiconvert.js - Call: clean_unsupported_wiki(pWikiCode:String):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.clean_unsupported_wiki(pWikiCode);
		//-------------------------------------------------------
		pWikiCode = pWikiCode.replace(/\{\{[^}]\}\}/g, '');
		return pWikiCode;
	};
	//----End of Method clean_unsupported_wiki Definition


	//#################################################################
	//# PUBLIC Method: clean_source()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pWikiCode:String
	//# Comment:
	//#    clean_source(pWikiCode) normalizes line breaks in order to have a common base string for all browsers.
	//#    clean_source() uses the MediaWiki source code `pWikiCode` from the parameter of the function and returns a HTML string
	//#    after removing all CRs.
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.clean_source = function (pWikiCode) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: clean_source(pWikiCode:String):String");
		// alert("js/wikiconvert.js - Call: clean_source(pWikiCode:String):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.clean_source(pWikiCode);
		//-------------------------------------------------------
		pWikiCode = this.replaceString(pWikiCode, "[[Image:", "[[File:");
		pWikiCode = this.replaceString(pWikiCode, "[[Datei:", "[[File:");
		pWikiCode = this.replaceString(pWikiCode, "|thumbnail|", "|thumb|");
		pWikiCode = this.replaceString(pWikiCode, "|thumbnail]]", "|thumb| ]]");
		pWikiCode = this.replaceString(pWikiCode, "|mini|", "|thumb|");
		pWikiCode = this.replaceString(pWikiCode, "|mini]]", "|thumb| ]]");
		//pWikiCode = pWikiCode.replace(/[|](thumbnail|mini)(\]|\|)/g,"|thumb$2");
		pWikiCode = pWikiCode.replace(/\r/g, '');
		return pWikiCode;
	};
	//----End of Method clean_source Definition


	//#################################################################
	//# PUBLIC Method: post_process()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pWikiCode:String
	//# Comment:
	//#    post_process(pWikiCode) normalizes line breaks in order to have a common base string for all browsers.
	//#    post_process() uses the MediaWiki source code `pWikiCode` from the parameter of the function and returns a HTML string
	//#    after removing all CRs.
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.post_process = function (pWikiCode) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: post_process(pWikiCode:String):String");
		// alert("js/wikiconvert.js - Call: post_process(pWikiCode:String):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.post_process(pWikiCode);
		//-------------------------------------------------------
		pWikiCode = this.replaceString(pWikiCode, "___IMG_OPEN___", "[[");
		pWikiCode = this.replaceString(pWikiCode, "___IMG_CLOSE___", "]]");
		//pWikiCode = pWikiCode.replace(/[|](thumbnail|mini)(\]|\|)/g,"|thumb$2");
		pWikiCode = pWikiCode.replace(/\r/g, '');
		return pWikiCode;
	};
	//----End of Method post_process Definition

	//#################################################################
	//# PUBLIC Method: removeCategories()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pWikiCode:String
	//# Comment:
	//#    removeCategories(pWikiCode) normalizes line breaks in order to have a common base string for all browsers.
	//#    removeCategories() uses the MediaWiki source code `pWikiCode` from the parameter of the function and returns a HTML string
	//#    after removing all CRs.
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.removeCategories = function (pWikiCode) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: removeCategories(pWikiCode:String):String");
		// alert("js/wikiconvert.js - Call: removeCategories(pWikiCode:String):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.removeCategories(pWikiCode);
		//-------------------------------------------------------
		//var vCatRegEx = /\[\[Category:(.[^\]]*)\]\]/g;
		//while(tokens = vCatRegEx.exec(pWikiCode)) {
		//}
		pWikiCode = pWikiCode.replace(/\[\[Category:(.[^\]]*)\]\]/g, '');

		return pWikiCode;
	};
	//----End of Method removeCategories Definition


	//#################################################################
	//# PUBLIC Method: replaceImages()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pWikiCode:String
	//# Comment:
	//#    Convert for inline elements of the Wiki source code
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.replaceImages = function (pWikiCode) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: replaceImages(pWikiCode:String):String");
		// alert("js/wikiconvert.js - Call: replaceImages(pWikiCode:String):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.replaceImages(pWikiCode);
		//-------------------------------------------------------

		//var image = /\[\[File:(.[^\]|]*)([|]thumb|frame|mini)?([|]alt=.[^\]|]*)?([|].[^\]|]*)?\]\]/g;
		var image = /\[\[File:(.[^\]]*)\]\]/g;
		var vTitle = "";
		var vAltText = "";
		var vClass = "image";
		var vURL = "";
		var vCaption = "";
		while (tokens = image.exec(pWikiCode)) {
			vTitle = "";
			vAltText = "";
			//[[File:my Image.png|thumb|alt=Alternative Text|<a href="test.html">Test Comment</a> Image Comment]]
			//tokens[0]=my Image.png|thumb|alt=Alternative Text|<a href="test.html">Test Comment</a> Image Comment
			var vLinkSplit = tokens[0].split("|");
			vURL = this.getWikiMediaURL(vLinkSplit[0]);
			if (vLinkSplit.length == 1) {
				pWikiCode = pWikiCode.replace(tokens[0], '___IMG_OPEN___File:' + vURL + '___IMG_CLOS___');
			} else {
				if (vLinkSplit.length == 2) {
					vCaption = this.checkCaption(vLinkSplit[1]);
					pWikiCode = pWikiCode.replace(tokens[0], '___IMG_OPEN___File:' + vURL + '|' + vCaption + '___IMG_CLOSE___');
				} else {
					var vMediaParam = "";
					vCaption = this.checkCaption(vLinkSplit[vLinkSplit.length - 1]);
					for (var i = 1; i < vLinkSplit.length - 1; i++) {
						vMediaParam += "|" + vLinkSplit[i];
					};
					pWikiCode = pWikiCode.replace(tokens[0], '___IMG_OPEN___File:' + vURL + vMediaParam + '|' + vCaption + '___IMG_CLOSE___');
				}
			}; // else if vLineSplit.length
		}; // While tokens
		return pWikiCode;
	};
	//----End of Method replaceImages Definition


	//#################################################################
	//# PUBLIC Method: checkCaption()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pCaption:String
	//# Comment:
	//#    Correct a caption removes ]] at end
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.checkCaption = function (pCaption) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: checkCaption(pCaption:String):String");
		// alert("js/wikiconvert.js - Call: checkCaption(pCaption:String):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.checkCaption(pCaption);
		//-------------------------------------------------------
		if (pCaption) {
			pCaption = pCaption.replace(/[\]]+$/g, "");
		};
		console.log("Caption Figure: '" + pCaption + "' ");
		return pCaption;
	};
	//----End of Method checkCaption Definition


	//#################################################################
	//# PUBLIC Method: math2jax()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pWikiCode:String
	//#    pFormat:String
	//# Comment:
	//#    Convert the MATH-tag to a MathJax compatible HTML enviroment dependent of the pFormat of the parameter of math2jax.
	//#    pFormat = 'reveal' 'html' are possible formats
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.math2jax = function (pWikiCode, pFormat) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: math2jax(pWikiCode:String,pFormat:String):String");
		// alert("js/wikiconvert.js - Call: math2jax(pWikiCode:String,pFormat:String):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.math2jax(pWikiCode,pFormat);
		//-------------------------------------------------------
		pWikiCode = pWikiCode.replace(/\\R /g, "\\mathbb R ");
		pWikiCode = pWikiCode.replace(/\\R\^/g, "\\mathbb R^");
		pWikiCode = pWikiCode.replace(/\\R</g, "\\mathbb R<");
		pWikiCode = pWikiCode.replace(/\\R\s/g, "\\mathbb R ");
		//pWikiCode =this.replaceString(pWikiCode,'\\','\mathbb R \\');
		return pWikiCode;
	};
	//----End of Method math2jax Definition


	//#################################################################
	//# PUBLIC Method: mathsymbols()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pWikiCode:String
	//#    pFormat:String
	//# Comment:
	//#    Convert math symbols for proper handling in MathJax
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.mathsymbols = function (pWikiCode) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: mathsymbols(pWikiCode:String):String");
		// alert("js/wikiconvert.js - Call:  mathsymbols(pWikiCode:String):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    pWikiCode = vMyInstance.mathsymbols(pWikiCode);
		//-------------------------------------------------------
		pWikiCode = pWikiCode.replace(/\\R /g, "\\mathbb R ");
		pWikiCode = pWikiCode.replace(/\\R\^/g, "\\mathbb R^");
		pWikiCode = pWikiCode.replace(/\\R</g, "\\mathbb R<");
		pWikiCode = pWikiCode.replace(/\\R\s/g, "\\mathbb R ");
		//pWikiCode =this.replaceString(pWikiCode,'\\','\mathbb R \\');
		return pWikiCode;
	};
	//----End of Method math2jax Definition


	//#################################################################
	//# PUBLIC Method: math2reveal()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pWikiCode:String
	//# Comment:
	//#    Convert math symbols for proper handling in MathJax
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.math2reveal = function (pWikiCode) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: math2reveal(pWikiCode:String):String");
		// alert("js/wikiconvert.js - Call:  math2reveal(pWikiCode:String):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    pWikiCode = vMyInstance.math2reveal(pWikiCode);
		//-------------------------------------------------------
		//pWikiCode = pWikiCode.replace(/\\R /g,"\\mathbb R ");
		//pWikiCode =this.replaceString(pWikiCode,'\\','\mathbb R \\');
		return pWikiCode;
	};
	//----End of Method math2reveal() Definition


	//#################################################################
	//# PUBLIC Method: convertWiki2Local()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pContent:String
	//# Comment:
	//#    convertWiki2Local() replaces the MediaWiki internal links to links that work in a local HTML file. The parsed vMediaWiki Links
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.convertWiki2Local = function (pContent) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: convertWiki2Local(pContent:String):String");
		// alert("js/wikiconvert.js - Call: convertWiki2Local(pContent:String):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.convertWiki2Local(pContent);
		//-------------------------------------------------------

		pContent = this.replaceWikiLinks(pContent);
		var vMediaArray = this.parseWiki4Media(pContent);
		this.createMediaParseJSON(vMediaArray);
		this.downloadWikiMedia(vMediaArray);
		pContent = this.convertMediaLink4Wiki(pContent, vMediaArray);
		return pContent;
	};
	//----End of Method convertWiki2Local Definition


	//#################################################################
	//# PUBLIC Method: parseWiki4Media()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pWikiCode:String
	//# Comment:
	//#    parseWiki4Media() the pWikiCode and extract the Media and File links.
	//# Return: Array
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.parseWiki4Media = function (pWikiCode) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: parseWiki4Media(pWikiCode:String):Array");
		// alert("js/wikiconvert.js - Call: parseWiki4Media(pWikiCode:String):Array");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.parseWiki4Media(pWikiCode);
		//-------------------------------------------------------
		// the following code is performed in clean_source()
		//pWikiCode = this.replaceString(pWikiCode,"[[Image:","[[File:");
		//pWikiCode = this.replaceString(pWikiCode,"[[Datei:","[[File:");
		var vMediaArray = [];
		// (1) find the image specs "my_image.png|330px|thumb|My Caption" in "[[File:my_image.png|330px|thumb|My Caption]]"
		//var vSearch = /\[(File|Datei|Image):([^\|]*)/;
		// (2) find just the filename "my_image.png" in "[[File:my_image.png|330px|thumb|My Caption]]"
		var vSearch = /\[(?:File|Image|Datei):([^\|\]]+)/g;
		// \[            # "["
		// (?:            # non-capturing group
		//  File|Image|Datei        #   "File" or "Image" or "Datei"
		// )              # end non-capturing group
		//:             # ":"
		//(              # group 1
		//  [^\|\]]+      #   any character except "|" or "]" at least once
		// )              # end group 1 - this will be the image's name
		var vResult;
		var vCount = 0;
		while (vResult = vSearch.exec(pWikiCode)) {
			vCount++;
			vMediaArray.push(vResult[1]);
			console.log("Media " + vCount + ": '" + vResult[1] + "' found");
		};
		return vMediaArray;
	};
	//----End of Method parseWiki4Media Definition


	//#################################################################
	//# PUBLIC Method: createMediaParseJSON()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    vMediaArray:Array
	//# Comment:
	//#    createMediaParseJSON(vMediaArray:Array) creates in this.aParseJSON["media"]={} a Hash
	//#    that maps the local file path 'image/my_image.png' to the replace path
	//#    this.aParseJSON["media"]["image/my_image.png"] = "https://commons.wikimedia.org/wiki/my_image.png"
	//#
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.createMediaParseJSON = function (pMediaArray) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: createMediaParseJSON(vMediaArray:Array)");
		// alert("js/wikiconvert.js - Call: createMediaParseJSON(vMediaArray:Array)");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.createMediaParseJSON(vMediaArray);
		//-------------------------------------------------------

		var vMediaFile = "";
		var vSubDir = "";
		var vLocalID = "";
		var vID = "";
		this.checkParseJSON("media");
		this.aParseJSON["media"] = {};
		for (var i = 0; i < pMediaArray.length; i++) {
			vID = this.convertWikiMedia2ID(pMediaArray[i]);
			//this.aParseJSON[vMediaArray[i]] = vLocalID;
			this.aParseJSON["media"][vID] = this.getImageProps(pMediaArray[i]);
			// Hash contains all properties of the image
			//	"title": "Title of "+vMediaFile,
			//	"file": vMediaFile,
			//	"subdir": vSubDir + "/",
			//	"mediastring": pMediaArray[i],
			//	"url": "url-undefined",
			//	"align":"left"
		};
	};
	//----End of Method createMediaParseJSON Definition


	//#################################################################
	//# PUBLIC Method: checkParseJSON()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pHashID:String
	//# Comment:
	//#    checkParseJSON() checks if the File Link definitions exists in the pWikiHash["media"]
	//#
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.checkParseJSON = function (pHashID) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: checkParseJSON(pHashID:String)");
		// alert("js/wikiconvert.js - Call: checkParseJSON(pHashID:String)");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.checkParseJSON(pHashID);
		//-------------------------------------------------------
		if (this.aParseJSON[pHashID]) {
			console.log("ParseJSON['" + pHashID + "']  exists!");
		} else {
			this.aParseJSON[pHashID] = {};
		};
	};
	//----End of Method checkParseJSON Definition


	//#################################################################
	//# PUBLIC Method: getMediaSubDir()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pMediaLink:String
	//# Comment:
	//#    getMediaSubDir(pMediaLink) return for a pMediaLink the appropriate subdirectory.
	//#
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.getMediaSubDir = function (pMediaLink) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: getMediaSubDir(pMediaLink:String)");
		// alert("js/wikiconvert.js - Call: getMediaSubDir(pMediaLink:String)");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.getMediaSubDir(pMediaLink);
		//-------------------------------------------------------
		var vMediaFile = "";
		var vSubDir = "";
		if (pMediaLink) {
			vSubDir = this.getMediaSubDir(pMediaLink);
			vMediaFile = this.convertWikiMedia2File(pMediaLink);
			vSubDir = vSubDir + "/" + vMediaFile;
		};
		return vSubDir;
	};
	//----End of Method getMediaSubDir Definition

	//#################################################################
	//# PUBLIC Method: correct_filename()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pFilename:String
	//# Return: String
	//# Comment:
	//#    convert filename to local filename
	//#
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################
	this.correct_filename = function (pFileName) {
		pFileName = pFileName.replace(/[^\/\\A-Za-z0-9\.]/g, "_");
		pFileName = pFileName.replace(/[_]+/g, "_");
		return pFileName;
	};

	//#################################################################
	//# PUBLIC Method: getMediaSubDir()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pFilename:String
	//# Return: String
	//# Comment:
	//#    get Subdirectory according to file extension
	//#
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################
	this.getMediaSubDir = function (pFileName) {
		if (pFileName) {
			this.correct_filename(pFileName);
		};
		return pFileName;
	};

	//#################################################################
	//# PUBLIC Method: convertWikiMedia2File()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pMediaLink:String
	//# Comment:
	//#    convertWikiMedia2File(pMediaLink) converts the pMediaLink into an URL and returns the media link.
	//#    removes blanks at the tail and replaces blanks with and underscore "_"
	//#    and non-alpha-numerical characters with an underscore, so that finally the filename works fine on all file systems
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.convertWikiMedia2File = function (pMediaLink) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: convertWikiMedia2File(pMediaLink:String):String");
		// alert("js/wikiconvert.js - Call: convertWikiMedia2File(pMediaLink:String):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.convertWikiMedia2File(pMediaLink);
		//-------------------------------------------------------
		var vMediaFile = "";

		var vPathSplit = pMediaLink.split("/");
		if (vPathSplit.length > 0) {
			vMediaFile = vPathSplit[vPathSplit.length - 1];
			//vMediaFile = this.correct_filename(vMediaFile);
		} else {
			console.log("ERROR: pMediaLink='" + pMediaLink + "' is not defined");
		};
		return vMediaFile;
	};
	//----End of Method convertWikiMedia2File Definition


	//#################################################################
	//# PUBLIC Method: convertWikiMedia2URL()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pMediaLink:String
	//# Comment:
	//#    convertWikiMedia2URL(pMediaLink) removes blanks at the tail and replaces blanks with and underscore "_"
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.convertWikiMedia2URL = function (pMediaLink) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: convertWikiMedia2URL(pMediaLink:String):String");
		// alert("js/wikiconvert.js - Call: convertWikiMedia2URL(pMediaLink:String):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.convertWikiMedia2URL(pMediaLink);
		//-------------------------------------------------------

		pMediaLink = pMediaLink.replace(/[ \t]+$/, "");
		pMediaLink = pMediaLink.replace(/ /g, "_");
		//console.log("MediaLink: '"+pMediaLink+"'");
		return pMediaLink;
	};
	//----End of Method convertWikiMedia2URL Definition

	//#################################################################
	//# PUBLIC Method: convertWikiMedia2ID()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pMediaLink:String
	//# Comment:
	//#    convertWikiMedia2ID(pMediaLink) removes blanks at the tail and replaces blanks with and underscore "_"
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.convertWikiMedia2ID = function (pMediaLink) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: convertWikiMedia2ID(pMediaLink:String):String");
		// alert("js/wikiconvert.js - Call: convertWikiMedia2ID(pMediaLink:String):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.convertWikiMedia2ID(pMediaLink);
		//-------------------------------------------------------

		pMediaLink = this.convertWikiMedia2URL(pMediaLink);
		pMediaLink = pMediaLink.replace(/[^A-Za-z0-9_]/g, "_");
		pMediaLink = pMediaLink.replace(/[_]+/g, "_");
		//console.log("MediaLink: '"+pMediaLink+"'");
		return pMediaLink;
	};
	//----End of Method convertWikiMedia2ID Definition

	//#################################################################
	//# PUBLIC Method: downloadWikiMedia()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pMediaArray:Array
	//# Comment:
	//#    downloadWikiMedia(pMediaArray:Array) download the images to level-fs
	//#    that can be exported as ZIP-file with archiver NPM module
	//#
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.downloadWikiMedia = function (pMediaArray) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: downloadWikiMedia(pMediaArray:Array)");
		// alert("js/wikiconvert.js - Call: downloadWikiMedia(pMediaArray:Array)");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.downloadWikiMedia(pMediaArray);
		//-------------------------------------------------------

		for (var i = 0; i < pMediaArray.length; i++) {
			this.downloadMediaFile(pMediaArray[i]);
		};
	};
	//----End of Method downloadWikiMedia Definition


	//#################################################################
	//# PUBLIC Method: downloadMediaFile()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pMediaLink:String
	//# Comment:
	//#    downloadMediaFile(pMediaFile) from WikiMedia Commons to the local filesystem emulated with level-fs
	//#
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.downloadMediaFile = function (pMediaLink) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: downloadMediaFile(pMediaLink:String)");
		// alert("js/wikiconvert.js - Call: downloadMediaFile(pMediaLink:String)");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.downloadMediaFile(pMediaLink);
		//-------------------------------------------------------
		var vSubDir = this.getMediaSubDir(pMediaLink);
		// convertWikiMedia2File "http://www,srv.org/img/my_image.png" to  "my_image.png"
		var vMediaFile = this.convertWikiMedia2File(pMediaLink);
		// add a subdirectory according to file type
		// e.g."my_image.png" to "img/my_image.png"
		// or  "my_music.mp3" to "audio/my_music.mp3"
		// or  "my_video.webm" to "video/my_video.webm"
		var vLocalLink = vSubDir + "/" + vMediaFile;
		var vWGET_CMD = "wget -O " + this.aProjectDir + "/" + vLocalLink + " " + pMediaLink;
		console.log("CALL WGET: " + vWGET_CMD + " (e.g. in NodeJS)");
		//
		console.log("Download Media File '" + pMediaLink + "' to folder '" + this.aProjectDir + "' not implemented yet");
	};
	//----End of Method downloadMediaFile Definition


	//#################################################################
	//# PUBLIC Method: convertMediaLink4Wiki()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pContent:String
	//#    pMediaArray:Array
	//# Comment:
	//#    convertMediaLink4Wiki(pContent,pMediaWiki) convert the link
	//#    - [[File:MyFile.png....   with
	//#    - [File:https://commons.wikimedia.org/.../MyFile.png
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.convertMediaLink4Wiki = function (pWikiCode, pMediaArray) {
		//----Debugging------------------------------------------
		console.log("js/wikiconvert.js - Call: convertMediaLink4Wiki(pWikiCode:String,pMediaArray:Array):String");
		// alert("js/wikiconvert.js - Call: convertMediaLink4Wiki(pContent:String,pMediaArray:Array):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.convertMediaLink4Wiki(pContent,pMediaArray);
		//-------------------------------------------------------

		var vReplaceLink;
		var vMediaFile;
		var vSubDir;
		var vLinkHTML;

		pWikiCode = pWikiCode.replace(/\[(File|Image|Datei):/gi, "[File:");

		for (var i = 0; i < pMediaArray.length; i++) {
			vSubDir = this.getMediaSubDir(pMediaArray[i]);
			// convertWikiMedia2File "http://www,srv.org/img/my_image.png" to  "my_image.png"
			vMediaFile = this.convertWikiMedia2File(pMediaArray[i]);
			// add a subdirectory according to file type
			// e.g."my_image.png" to "img/my_image.png"
			// or  "my_music.mp3" to "audio/my_music.mp3"
			// or  "my_video.webm" to "video/my_video.webm"
			vReplaceLink = vSubDir + "/" + vMediaFile;

			pWikiCode = this.replaceString(pWikiCode, "File:" + pMediaArray[i], "File:" + vReplaceLink);
		};
		return pWikiCode;
	};
	//----End of Method convertMediaLink4Wiki Definition


	//#################################################################
	//# PUBLIC Method: replaceString()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pString:String
	//#    pSearch:String
	//#    pReplace:String
	//# Comment:
	//#    replaceString(pString,pSearch,pReplace) replaces globally pSearch by pReplace and returns the modified string
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.replaceString = function (pString, pSearch, pReplace) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: replaceString(pString:String,pSearch:String,pReplace:String):String");
		// alert("js/wikiconvert.js - Call: replaceString(pString:String,pSearch:String,pReplace:String):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.replaceString(pString,pSearch,pReplace);
		//-------------------------------------------------------

		//alert("cstring.js - replaceString() "+pString);
		if (!pString) {
			alert("replaceString()-Call - pString not defined!");
		} else if (pString != '') {
			//alert("cstring.js - replaceString() "+pString);
			var vHelpString = '';
			var vN = pString.indexOf(pSearch);
			var vReturnString = '';
			while (vN >= 0) {
				if (vN > 0) vReturnString += pString.substring(0, vN);
				vReturnString += pReplace;
				if (vN + pSearch.length < pString.length) {
					pString = pString.substring(vN + pSearch.length, pString.length);
				} else {
					pString = '';
				};
				vN = pString.indexOf(pSearch);
			};
			return vReturnString + pString;
		};
	};
	//----End of Method replaceString Definition


	//#################################################################
	//# PUBLIC Method: convertWiki2Online()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pContent:String
	//# Comment:
	//#    convertWiki2Online(pContent) converts the Links and Media in way so that media and links
	//#    are referenced to online resource to the server
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.convertWiki2Online = function (pContent) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: convertWiki2Online(pContent:String):String");
		// alert("js/wikiconvert.js - Call: convertWiki2Online(pContent:String):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.convertWiki2Online(pContent);
		//-------------------------------------------------------

		var vMediaArray = this.parseWiki4Media(pContent);
		// this.downloadWikiMedia(vMediaArray);
		pContent = this.convertMediaLink4WikiOnline(pContent, vMediaArray);
		pContent = this.replaceWikiLinks(pContent);
		return pContent;
	};
	//----End of Method convertWiki2Online Definition


	//#################################################################
	//# PUBLIC Method: replaceWikiLinks()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pWikiCode:String
	//# Comment:
	//#    Comment for replaceWikiLinks
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.replaceWikiLinks = function (pWikiCode) {
		//----Debugging------------------------------------------
		console.log("js/wikiconvert.js - Call: replaceWikiLinks(pWikiCode:String):String");
		// alert("js/wikiconvert.js - Call: replaceWikiLinks(pWikiCode:String):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.replaceWikiLinks(pWikiCode);
		//-------------------------------------------------------

		var vLinkArray = this.getWikiLinks(pWikiCode);
		var vURL, Title, vLink, vLocalLink;
		var vPipePos = 0;
		var vColonPos = 0;
		this.aMediaArray = [];
		this.checkParseJSON("links");
		var vCount = 0;
		for (var i = 0; i < vLinkArray.length; i++) {
			vLink = vLinkArray[i];
			vPipePos = vLink.indexOf("|");
			if (vPipePos > 0) {
				//Wiki-Link 1: '/Birds/|Swarm of Birds' found
				//Wiki-Link 2: 'Water|Water Learning Resource' found
				//Wiki-Link 3: 'w:Water|Water Wikipedia' found
				//Wiki-Link 4: 'v:Water|Water Wikiversity' found
				vURL = vLink.substr(0, vPipePos);
				vTitle = vLink.substr(vPipePos + 1, vLink.length);
			} else {
				//Wiki-Link 1: 'Swarm Intelligence' found
				//Wiki-Link 2: 'Water' found
				//Wiki-Link 3: '/Birds/' found
				vURL = vLink;
				vTitle = vLink.replace(/\//g, "");
			};
			//Wiki-Link 1: 'w:Water|Water Wikipedia' found
			//Wiki-Link 4: 'Wikiversity:Water|Water Wikiversity' found
			vColonPos = vURL.indexOf(":");
			if (vColonPos > 0) {
				//for Wikipedia:Water vLinkSplit[0]= "Wikipedia" -> is a not interwikilink
				// link contains colon ":"
				var vColonPrefix = vURL.substr(0, vColonPos);
				//vColonPrefix w,v,Wikipedia,wikiversity Interwiki Link
				if (vColonPrefix.toLowerCase() == "category") {
					// [[Category:Risk management]]
					console.log("Category with Local Wiki Link '" + vURL + "' found");
					vURL = this.getWikiDisplayURL(vURL);
					vLocalLink = "[" + vURL + " " + vTitle + "]";
					//pWikiCode = this.replaceString(pWikiCode,"[["+vLink+"]]",vLocalLink);
					// for reverse replacement to online Wikipedia or Wikiversity store replacement in ParseJSON
					this.aParseJSON["links"][vLocalLink] = "[" + vLink + "]";
				} else if (this.aFilePrefix.hasOwnProperty(vColonPrefix)) {
					console.log("URL: '" + vURL + "' is an image, do not replace by URL text reference.");
					this.aMediaArray.push(vURL);
				} else if (this.aMap.hasOwnProperty(vColonPrefix)) {
					// do something for interwiki links
					console.log("Inter Wiki Link '" + vURL + "' found");
					vURL = this.getWikiDisplayURL(vURL);
					vLocalLink = "[" + vURL + " " + vTitle + "]";
					pWikiCode = this.replaceString(pWikiCode, "[[" + vLink + "]]", vLocalLink);
					// for reverse replacement to online Wikipedia or Wikiversity store replacement in ParseJSON
					this.aParseJSON["links"][vLocalLink] = "[" + vLink + "]";
				}
			} else {
				console.log("Local Wiki Link '" + vURL + "' found");
				vURL = this.getWikiDisplayURL(vURL);
				vLocalLink = "[" + vURL + " " + vTitle + "]";
				pWikiCode = this.replaceString(pWikiCode, "[[" + vLink + "]]", vLocalLink);
				// for reverse replacement to online Wikipedia or Wikiversity store replacement in ParseJSON
				this.aParseJSON["links"][vLocalLink] = "[" + vLink + "]";
			};
		};
		// Replace External Links: [http://www.example.com Example Server]
		// var external_links = /\[(https:\/\/|http:\/\/)([a-zA-Z0-9].[^\s]*) ([a-zA-Z0-9].[^\]]*)\]/g;
		// pWikiCode = pWikiCode.replace(external_links, '<a href="$1$2" target="_blank">$3</a>');

		return pWikiCode;
	};
	//----End of Method replaceWikiLinks Definition

	//#################################################################
	//# PUBLIC Method: getWikiDisplayURL()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pWikiCode:String
	//# Comment:
	//#    expand a local link to the full Wiki Display URL
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.getWikiDisplayURL = function (pLink) {
		var vLanguage = this.aLanguage;
		var vServer = this.aLanguage + "." + this.aDomain + ".org";
		console.log("getWikiDisplayURL('" + pLink + "') vServer='" + vServer + "'");
		var vMap = this.aMap;
		pLink = pLink || "undefined link";
		pLink = this.replaceString(pLink, " ", "_");
		var vLinkArr = pLink.split(":");
		// pLink = "Wikipedia:Water"
		var vArticle = pLink;
		// vArticle = "Water"
		if (vLinkArr.length == 2) {
			// Wikipedia:Swarm_intelligence
			// w:Swarm_intelligence
			// /Slime_mold/
			// Category:Risk Management
			if (vLinkArr[0].toLowerCase() == "category") {
				// Category:Risk Management
				vArticle = pLink || "undefined_wiki_link";
			} else {
				// w:Swarm_intelligence
				vServer = vLanguage + "." + vMap[vLinkArr[0]] + ".org";
				vArticle = vLinkArr[1] || "undefined_wiki_link";
			};
		} else if (vLinkArr.length == 3) {
			// w:en:Swarm_intelligence
			// [[Wikipedia:Category:Risk Management]]
			var vLinkLanguage = this.aLanguage;
			var vLinkDomain = this.aDomain;
			if (vLinkArr[1].toLowerCase() == "category") {
				// [[Wikipedia:Category:Risk Management]]
				vArticle = vLinkArr[1] + ":" + vLinkArr[2] || "undefined_category";
				// vArticle = "Category:Risk Management"
			} else {
				vArticle = vLinkArr[2] || "undefined_wiki_link";
				// w:en:Swarm_intelligence
				vLinkLanguage = vLinkArr[1]; // vLinkArr[1] = "en"
				vLinkDomain = vMap[vLinkArr[0]]; // map "w" to "wikipedia"
			};
			vServer = vLinkLanguage + "." + vLinkDomain + ".org";
		} else if (vArticle.indexOf("/") == 0) {
			// Link: "/Slime mold/"
			vArticle = this.aWikiTitle + vArticle;
			// Link: "Swarm intelligence/Slime mold/ "
			vArticle = vArticle.replace(/[\/\s]+$/i, "");
			// Link: "Swarm intelligence/Slime mold"
		};
		vArticle = this.replaceString(vArticle, " ", "_");
		// Link: "Swarm_intelligence/Slime_mold"
		return "https://" + vServer + "/wiki/" + vArticle;
	};

	//#################################################################
	//# PUBLIC Method: getWikiMediaURL()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pFileName:String
	//# Comment:
	//#
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################
	this.getWikiMediaURL = function (pFileName) {
		pFileName = pFileName.replace(/^\[\[(File|Image|Datei):/gi, "");
		pFileName = pFileName.replace(/[\]]+$/gi, "");
		pFileName = pFileName.replace(/\s/g, "_");
		return this.aMediaPath + pFileName;
	};

	//#################################################################
	//# PUBLIC Method: getWikiDisplayURL()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pFilename:String
	//# Comment:
	//#
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.getMediaFileType = function (pFileName) {
		var vType = "none";
		if (/\.(jpe?g|png|gif|bmp)$/i.test(pFileName)) {
			vType = "img";
		};
		if (/\.(svg)$/i.test(pFileName)) {
			vType = "svg";
		};
		if (/\.(mp4|webm|mov|avi|mpe?g|ogv)$/i.test(pFileName)) {
			vType = "video";
		};
		if (/\.(mp3|wav|ogg|mid)$/i.test(pFileName)) {
			vType = "audio";
		};
		return vType;
	};

	//#################################################################
	//# PUBLIC Method: getWikiLinks()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pWikiCode:String
	//# Comment:
	//#    getWikiLinks(pWikiCode) extract Double-Bracket [[...]] link in pWikiCode
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.getWikiLinks = function (pWikiCode) {
		//----Debugging------------------------------------------
		// console.log("js/wikiconvert.js - Call: getWikiLinks(pWikiCode:String):String");
		// alert("js/wikiconvert.js - Call: getWikiLinks(pWikiCode:String):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.getWikiLinks(pWikiCode);
		//-------------------------------------------------------

		// Wiki Links are open with ""
		var vLinkArray = [];
		//var vSearch = /\[(File|Datei|Image):([^\|]*)/;
		var vSearch = /\[\[([^\[\]]+)\]\]/g;
		// \[\[         # "[["
		//(             # group 1
		//  [^\[\]]+    #   any character except "[" and "]" ":" at least once
		// )            # end group 1 - this will be the image's name
		// \]\]         # "]]"
		var vResult;
		var vCount = 0;
		var vLink = "";
		var vLinkSplit;
		var vType = "";
		while (vResult = vSearch.exec(pWikiCode)) {
			vCount++;
			vLinkSplit = vResult[1].split(":");
			if (vLinkSplit.length == 1) {
				// link contains no colon ":"
				vLinkArray.push(vResult[1]);
			} else if (this.aMap.hasOwnProperty(vLinkSplit[0])) {
				//for Wikipedia:Water vLinkSplit[0]= "Wikipedia" -> is a wikilink
				vLinkArray.push(vResult[1]);
				console.log("Wiki-Link ('" + vLinkSplit[0] + "') " + vCount + ": '" + vResult[1] + "' found");
			} else if (vLinkSplit[0].toLowerCase() == "category") {
				//for Wikipedia:Water vLinkSplit[0]= "Wikipedia" -> is a wikilink
				vLinkArray.push(vResult[1]);
				console.log("Wiki-Category-Link ('" + vLinkSplit[0] + "') " + vCount + ": '" + vResult[1] + "' found");
			} else {
				console.log("Wiki-File " + vCount + ": '" + vResult[1] + "' found");
				//for File:Water.png vLinkSplit[0]= "File" not an own property of aMap -> not a Link
			};
		};
		return vLinkArray;
	};
	//----End of Method getWikiLinks Definition


	//#################################################################
	//# PUBLIC Method: convertMediaLink4WikiOnline()
	//#    used in Class: WikiConvert
	//# Parameter:
	//#    pContent:String
	//#    pMediaArray:Array
	//# Comment:
	//#    convertMediaLink4WikiOnline(pWikiCode,pMediaArray) converts Media Links to WikiMedia Commons
	//#    to a remote link for local files
	//# Return: String
	//# created with JSCC  2017/03/05 18:13:28
	//# last modifications 2018/01/21 17:17:18
	//#################################################################

	this.convertMediaLink4WikiOnline = function (pWikiCode, pMediaArray) {
		//----Debugging------------------------------------------
		console.log("js/wikiconvert.js - Call: convertMediaLink4WikiOnline(pContent:String,pMediaArray:Array):String");
		// alert("js/wikiconvert.js - Call: convertMediaLink4WikiOnline(pContent:String,pMediaArray:Array):String");
		//----Create Object/Instance of WikiConvert----
		//    var vMyInstance = new WikiConvert();
		//    vMyInstance.convertMediaLink4WikiOnline(pContent,pMediaArray);
		//-------------------------------------------------------

		var vReplaceLink;
		var vMediaFile;
		var vPathArray;

		// "File:" "Image:" "Datei:" will be replaced "File:" by clean_source()
		//pWikiCode = pWikiCode.replace(/\[\[(File|Image|Datei):/gi,"[[File:");

		//var vSearch = /\[(File|Datei|Image):([^\|]*)/;
		var vSearch = /(\[\[File:[^\]]+\]\])/g;
		// (              # begin capturing group
		// \[\[           # "[["
		//  File:         #   "File:"
		//  [^\]]+        #   any character except  "]" at least once
		// \]\]           # "]]"
		// )              # end capturing group
		var vResult;
		var vCount = 0;
		var vReplaceArray = [];
		while (vResult = vSearch.exec(pWikiCode)) {
			vCount++;
			console.log("Media " + vCount + ": '" + vResult[1] + "' replace into IMG-tag");
			vReplaceArray.push(vResult[1]);
		};
		if (vReplaceArray.length == pMediaArray.length) {
			for (var i = 0; i < pMediaArray.length; i++) {
				//vPathArray = (pMediaArray[i]).split("/");
				//vMediaFile = vPathArray[vPathArray.length-1];
				vMediaFile = pMediaArray[i];
				var vFileSplit = vMediaFile.split("|");
				vMediaFile = vFileSplit[0];
				var vWidth = this.aDefaultImageWidth;
				var vCenterImage = false;
				for (var i = 1; i < vFileSplit.length; i++) {
					if (vFileSplit[i].match(/^[0-9]+px$/)) {
						//vFileSplit[i] = "350px"
						vWidth = vFileSplit[i].replace(/[^0-9]/g, "");
						//vFileSplit[i] = "350"
					} else if (vFileSplit[i] == "center") {
						vCenterImage = true;
					};
				};
				var vCaption = "";
				if (vFileSplit.length > 1) {
					//[[File:My File.png|center|400px|My Caption "Title"]]
					vCaption = this.checkCaption(vFileSplit[vFileSplit.length - 1]);
					// vCaption ="My Caption \"Title\""
					vCaption = this.replaceString(vCaption, "\"", "'");
					// vCaption ="My Caption 'Title'
				};
				// ReplaceLink created as image-tag
				vReplaceLink = "<img src=\"" + this.getWikiMediaURL(vMediaFile) + "\" width=\"" + vWidth + "\" ";
				if (vCaption != "") {
					vReplaceLink += " alt=\"" + vCaption + "\" title=\"" + vCaption + "\"";
				};
				if (vCenterImage == true) {
					vReplaceLink += " align=\"middle\" ";
				};
				vReplaceLink += ">";
				// add figcaption if aAddFigCaption as attribute is true
				if (this.aAddFigCaption == true) {
					vCaption = this.checkCaption(vCaption);
					vReplaceLink += "\n<figcaption>" + vCaption + "</figcaption>";
				};
				// wrap image into <figure>-tag
				vReplaceLink = "<figure>\n   " + vReplaceLink + "</figure>";
				//pWikiCode = this.replaceString(pWikiCode,vReplaceArray[i],vReplaceLink);
			};
		} else {
			console.log("ERROR: Replace Link for MediaLinks do not have the same length");
		};
		return pWikiCode;
	};
	//----End of Method convertMediaLink4WikiOnline Definition

	this.getImageProps = function (pMediaLink) {
		var vImgProps = {
			"title": "",
			"file": "",
			"url": "",
			"mediastring": pMediaLink,
			"subdir": "images/",
			"width": this.aDefaultImageWidth,
			"align": "left",
			"thumb": true,
			"frame": false
		};

		var vFileSplit = pMediaLink.split("|");
		vMediaFile = vFileSplit[0];
		var vWidth = this.aDefaultImageWidth;
		var vCenterImage = false;
		for (var i = 1; i < vFileSplit.length; i++) {
			if (vFileSplit[i].match(/^[0-9]+px$/)) {
				//vFileSplit[i] = "350px"
				vImgProps["width"] = vFileSplit[i].replace(/[^0-9]/g, "");
				//vFileSplit[i] = "350"
			} else if (vFileSplit[i] == "center") {
				vImgProps["align"] = "center";
			} else if (vFileSplit[i] == "left") {
				vImgProps["align"] = "left";
			} else if (vFileSplit[i] == "right") {
				vImgProps["align"] = "right";
			} else if (vFileSplit[i] == "thumb" && vFileSplit[i] == "thumbnail" && vFileSplit[i] == "mini") {
				vImgProps["thumb"] = true;
			};
		};
		// Determine Caption of Image/Figure
		if (vFileSplit.length > 1) {
			//[[File:My File.png|center|400px|My Caption "Title"]]
			vImgProps["title"] = vFileSplit[vFileSplit.length - 1];
			// Caption ="My Caption \"Title\""
			vImgProps["title"] = this.replaceString(vImgProps["caption"], "\"", "'");
			// Caption ="My Caption 'Title' ""
		};
		// Determine Media URL from WikiMedia Commons with this.aDocJSON["images"] Array
		console.log("IMAGE PROPS: Find '" + pMediaLink + "'");
		//getImageIndexDocJSON()
		return vImgProps;
	};
}
//-------------------------------------------------------------------------
//---END Constructor of Class "WikiConvert()"
//-------------------------------------------------------------------------

//-------------------------------------------
//---End Definition of Class-----------------
// JS Class: WikiConvert
//-------------------------------------------
module.exports = WikiConvert;

},{}],20:[function(_dereq_,module,exports){
'use strict';

var parse = _dereq_('../../parse');
var doInfobox = _dereq_('./infobox');
var doSentence = _dereq_('./sentence');
var doTable = _dereq_('./table');

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

var makeImage = function makeImage(image) {
  var alt = image.file.replace(/^(file|image):/i, '');
  alt = alt.replace(/\.(jpg|jpeg|png|gif|svg)/i, '');
  return '  <img src="' + image.thumb + '" alt="' + alt + '"/>';
};

var doList = function doList(list) {
  var html = '<ul>\n';
  list.forEach(function (o) {
    html += '  <li>' + o.text + '</li>\n';
  });
  html += '<ul>\n';
  return html;
};

var doSection = function doSection(section, options) {
  var html = '';
  //make the header
  if (options.title === true && section.title) {
    var num = 1 + section.depth;
    html += '  <h' + num + '>' + section.title + '</h' + num + '>';
    html += '\n';
  }
  //put any images under the header
  if (section.images && options.images === true) {
    html += section.images.map(function (image) {
      return makeImage(image);
    }).join('\n');
    html += '\n';
  }
  //make a html table
  if (section.tables && options.tables === true) {
    html += section.tables.map(function (t) {
      return doTable(t, options);
    }).join('\n');
  }
  // //make a html bullet-list
  if (section.lists && options.lists === true) {
    html += section.lists.map(function (list) {
      return doList(list, options);
    }).join('\n');
  }
  //finally, write the sentence text.
  if (section.sentences && options.sentences === true) {
    html += '  <p>' + section.sentences.map(function (s) {
      return doSentence(s, options);
    }).join(' ') + '</p>';
    html += '\n';
  }
  return '<div class="section">\n' + html + '</div>\n';
};
//
var toHtml = function toHtml(str, options) {
  options = Object.assign(defaults, options);
  var data = parse(str, options);
  var html = '';
  //add the title on the top
  // if (options.title === true && data.title) {
  //   html += '<h1>' + data.title + '</h1>\n';
  // }
  //render infoboxes (up at the top)
  if (options.infoboxes === true && data.infoboxes) {
    html += data.infoboxes.map(function (o) {
      return doInfobox(o, options);
    }).join('\n');
  }
  //render each section
  html += data.sections.map(function (s) {
    return doSection(s, options);
  }).join('\n');
  return html;
};
module.exports = toHtml;

},{"../../parse":35,"./infobox":21,"./sentence":22,"./table":23}],21:[function(_dereq_,module,exports){
'use strict';

var doSentence = _dereq_('./sentence');

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
    var val = doSentence(obj.data[k], options);
    html += '  <tr>\n';
    html += '    <td>' + k + '</td>\n';
    html += '    <td>' + val + '</td>\n';
    html += '  </tr>\n';
  });
  html += '</table>\n';
  return html;
};
module.exports = infobox;

},{"./sentence":22}],22:[function(_dereq_,module,exports){
'use strict';

var smartReplace = _dereq_('../lib').smartReplace;

// create links, bold, italic in html
var doSentence = function doSentence(sentence, options) {
  var text = sentence.text;
  //turn links back into links
  if (sentence.links && options.links === true) {
    sentence.links.forEach(function (link) {
      var href = '';
      var classNames = 'link';
      if (link.site) {
        //use an external link
        href = link.site;
        classNames += ' external';
      } else {
        //otherwise, make it a relative internal link
        href = link.page || link.text;
        href = './' + href.replace(/ /g, '_');
      }
      var tag = '<a class="' + classNames + '" href="' + href + '">';
      tag += link.text + '</a>';
      text = smartReplace(text, link.text, tag);
    });
  }
  if (sentence.fmt) {
    if (sentence.fmt.bold) {
      sentence.fmt.bold.forEach(function (str) {
        var tag = '<b>' + str + '</b>';
        text = smartReplace(text, str, tag);
      });
    }
    if (sentence.fmt.italic) {
      sentence.fmt.italic.forEach(function (str) {
        var tag = '<i>' + str + '</i>';
        text = smartReplace(text, str, tag);
      });
    }
  }
  return text;
};
module.exports = doSentence;

},{"../lib":28}],23:[function(_dereq_,module,exports){
'use strict';

var doSentence = _dereq_('./sentence');

var doTable = function doTable(table, options) {
  var html = '<table>\n';
  //make header
  html += '  <thead>';
  Object.keys(table[0]).forEach(function (k) {
    html += '    <td>' + k + '</td>\n';
  });
  html += '  </thead>';
  html += '  <tbody>';
  //make rows
  table.forEach(function (o) {
    html += '  <tr>\n';
    Object.keys(o).forEach(function (k) {
      var val = doSentence(o[k], options);
      html += '    <td>' + val + '</td>\n';
    });
    html += '  </tr>\n';
  });
  html += '  </tbody>';
  html += '</table>\n';
  return html;
};
module.exports = doTable;

},{"./sentence":22}],24:[function(_dereq_,module,exports){
'use strict';

var parse = _dereq_('../../parse');
var doInfobox = _dereq_('./infobox');
var doSentence = _dereq_('./sentence');
var doTable = _dereq_('./table');

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

var makeImage = function makeImage(image) {
  var alt = image.file.replace(/^(file|image):/i, '');
  alt = alt.replace(/\.(jpg|jpeg|png|gif|svg)/i, '');
  var out = '\\begin{figure}';
  out += '\n\\includegraphics[width=\\linewidth]{' + image.thumb + '}';
  out += '\n\\caption{' + alt + '}';
  out += '\n%\\label{fig:myimage1}';
  out += '\n\\end{figure}';
  return out;
};

var doList = function doList(list) {
  var out = '\\begin{itemize}\n';
  list.forEach(function (o) {
    out += '  \\item ' + o.text + '\n';
  });
  out += '\\end{itemize}\n';
  return out;
};

var doSection = function doSection(section, options) {
  var out = '';
  var num = 1;
  //make the header
  if (options.title === true && section.title) {
    num = 1 + section.depth;
    var vOpen = "\n";
    var vClose = "}";
    switch (num) {
      case 1:
        vOpen += "\\chapter{";
        break;
      case 2:
        vOpen += "\\section{";
        break;
      case 3:
        vOpen += "\\subsection{";
        break;
      case 4:
        vOpen += "\\subsubsection{";
        break;
      case 5:
        vOpen += "\\paragraph{";
        vClose = "} \\\\ \n";
        break;
      case 6:
        vOpen += "\\subparagraph{";
        vClose = "} \\\\ \n";
        break;
      default:
        vOpen += "\n% section with depth=" + num + " undefined - use subparagraph instead\n\\subparagraph{";
        vClose = "} \\\\ \n";
    }
    out += vOpen + section.title + vClose;
    out += '\n';
  }
  //put any images under the header
  if (section.images && options.images === true) {
    out += section.images.map(function (image) {
      return makeImage(image);
    }).join('\n');
    //out += '\n';
  }
  //make a out table
  if (section.tables && options.tables === true) {
    out += section.tables.map(function (t) {
      return doTable(t, options);
    }).join('\n');
  }
  // //make a out bullet-list
  if (section.lists && options.lists === true) {
    out += section.lists.map(function (list) {
      return doList(list, options);
    }).join('\n');
  }
  //finally, write the sentence text.
  if (section.sentences && options.sentences === true) {
    //out += '\n\n% BEGIN Paragraph\n'
    out += section.sentences.map(function (s) {
      return doSentence(s, options);
    }).join(' ');
    //out += '\n% END Paragraph';
    out += '\n';
  };
  var title_tag = ' SECTION depth=' + num + " - TITLE: " + section.title + "\n";
  // wrap a section comment
  //out = '\n% BEGIN' + title_tag + out + '\n% END' + title_tag;
  return out;
};
//
var toLatex = function toLatex(str, options) {
  options = Object.assign(defaults, options);
  var data = parse(str, options);
  var out = '';
  //add the title on the top
  // if (options.title === true && data.title) {
  //   out += '\\section{' + data.title + '}\n';
  // }
  //render infoboxes (up at the top)
  if (options.infoboxes === true && data.infoboxes) {
    out += data.infoboxes.map(function (o) {
      return doInfobox(o, options);
    }).join('\n');
  }
  //render each section
  out += data.sections.map(function (s) {
    return doSection(s, options);
  }).join('\n');
  return out;
};
module.exports = toLatex;

},{"../../parse":35,"./infobox":25,"./sentence":26,"./table":27}],25:[function(_dereq_,module,exports){
'use strict';

var doSentence = _dereq_('./sentence');

var dontDo = {
  image: true,
  caption: true
};
//
var infobox = function infobox(obj, options) {
  var out = '\n\\vspace*{0.3cm}\n\n';
  out += '\\begin{tabular}{|@{\\qquad}l|p{9.5cm}@{\\qquad}|} \n';
  out += '  \\hline  %horizontal line\n';

  Object.keys(obj.data).forEach(function (k) {
    if (dontDo[k] === true) {
      return;
    }
    var val = doSentence(obj.data[k], options);
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

},{"./sentence":26}],26:[function(_dereq_,module,exports){
'use strict';

var smartReplace = _dereq_('../lib').smartReplace;

// create links, bold, italic in html
var doSentence = function doSentence(sentence, options) {
  var text = sentence.text;
  //turn links back into links
  if (sentence.links && options.links === true) {
    sentence.links.forEach(function (link) {
      var href = '';
      var classNames = 'link';
      if (link.site) {
        //use an external link
        href = link.site;
        classNames += ' external';
      } else {
        //otherwise, make it a relative internal link
        href = link.page || link.text;
        href = './' + href.replace(/ /g, '_');
      }
      var tag = '\\href{' + href + '}{' + link.text + '}';
      text = smartReplace(text, link.text, tag);
    });
  }
  if (sentence.fmt) {
    if (sentence.fmt.bold) {
      sentence.fmt.bold.forEach(function (str) {
        var tag = '\\textbf{' + str + '}';
        text = smartReplace(text, str, tag);
      });
    }
    if (sentence.fmt.italic) {
      sentence.fmt.italic.forEach(function (str) {
        var tag = '\\textit' + str + '}';
        text = smartReplace(text, str, tag);
      });
    }
  }
  return text;
};
module.exports = doSentence;

},{"../lib":28}],27:[function(_dereq_,module,exports){
'use strict';

var doSentence = _dereq_('./sentence');

var doTable = function doTable(table, options) {
  var out = '\n\\vspace*{0.3cm}\n\n';
  out += '% BEGIN TABLE: only left align columns in LaTeX table with horizontal line separation between columns';
  out += "% Format Align Column: 'l'=left 'r'=right align, 'c'=center, 'p{5cm}'=block with column width 5cm ";
  out += '\\begin{tabular}{|';
  Object.keys(table[0]).forEach(function (k) {
    out += 'l|';
  });
  '} \n';
  out += '  \\hline  %horizontal line\n';
  //make header
  out += '  % BEGIN: Table Header';
  var vSep = " ";
  Object.keys(table[0]).forEach(function (k) {
    out += '    ' + vSep + +"\\textbf{" + k + +"} " + '\n';
    vSep = " & ";
  });
  out += '\\\\ \n';
  out += '  % END: Table Header\n';
  out += '  % BEGIN: Table Body';
  out += '  \\hline  % ----- table row -----\n';
  ////make rows
  table.forEach(function (o) {
    vSep = " ";
    out += '  % ----- table row -----\n';
    Object.keys(o).forEach(function (k) {
      var val = doSentence(o[k], options);
      out += '    ' + vSep + val + '\n';
      vSep = " & ";
    });
    out += '  \\\\ \n'; // newline in latex table = two backslash \\
    out += '  \\hline  %horizontal line\n';
  });
  out += '    % END: Table Body\n';
  out += '} % END TABLE\n';
  out += '\n\\vspace*{0.3cm}\n\n';
  return out;
};
module.exports = doTable;

},{"./sentence":26}],28:[function(_dereq_,module,exports){
'use strict';

//escape a string like 'fun*2.Co' for a regExpr
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

//sometimes text-replacements can be ambiguous - words used multiple times..
var smartReplace = function smartReplace(all, text, result) {
  if (!text || !all) {
    // console.log(text);
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

module.exports = {
  smartReplace: smartReplace
};

},{}],29:[function(_dereq_,module,exports){
'use strict';

var parse = _dereq_('../../parse');
var doTable = _dereq_('./table');
var doInfobox = _dereq_('./infobox');
var doSentence = _dereq_('./sentence');

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

var doList = function doList(list, options) {
  return list.map(function (o) {
    var str = doSentence(o, options);
    return ' * ' + str;
  }).join('\n');
};

//markdown images are like this: ![alt text](href)
var doImage = function doImage(image) {
  var alt = image.file.replace(/^(file|image):/i, '');
  alt = alt.replace(/\.(jpg|jpeg|png|gif|svg)/i, '');
  return '![' + alt + '](' + image.thumb + ')';
};

var doSection = function doSection(section, options) {
  var md = '';
  //make the header
  if (options.title === true && section.title) {
    var header = '##';
    for (var i = 0; i < section.depth; i += 1) {
      header += '#';
    }
    md += header + ' ' + section.title + '\n';
  }
  //put any images under the header
  if (section.images && options.images === true) {
    md += section.images.map(function (img) {
      return doImage(img);
    }).join('\n');
    md += '\n';
  }
  //make a mardown table
  if (section.tables && options.tables === true) {
    md += '\n';
    md += section.tables.map(function (table) {
      return doTable(table, options);
    }).join('\n');
    md += '\n';
  }
  //make a mardown bullet-list
  if (section.lists && options.lists === true) {
    md += section.lists.map(function (list) {
      return doList(list, options);
    }).join('\n');
    md += '\n';
  }
  //finally, write the sentence text.
  if (section.sentences && options.sentences === true) {
    md += section.sentences.map(function (s) {
      return doSentence(s, options);
    }).join(' ');
  }
  return md;
};

var toMarkdown = function toMarkdown(str, options) {
  options = Object.assign(defaults, options);
  var data = parse(str, options);
  var md = '';
  //add the title on the top
  // if (data.title) {
  //   md += '# ' + data.title + '\n';
  // }
  //render infoboxes (up at the top)
  if (options.infoboxes === true && data.infoboxes) {
    md += data.infoboxes.map(function (o) {
      return doInfobox(o, options);
    }).join('\n');
  }
  //render each section
  md += data.sections.map(function (s) {
    return doSection(s, options);
  }).join('\n\n');
  return md;
};
module.exports = toMarkdown;

},{"../../parse":35,"./infobox":30,"./sentence":32,"./table":33}],30:[function(_dereq_,module,exports){
'use strict';

var doSentence = _dereq_('./sentence');
var pad = _dereq_('./pad');

var dontDo = {
  image: true,
  caption: true
};

// render an infobox as a table with two columns, key + value
var doInfobox = function doInfobox(obj, options) {
  var md = '|' + pad('') + '|' + pad('') + '|\n';
  md += '|' + pad('---') + '|' + pad('---') + '|\n';
  Object.keys(obj.data).forEach(function (k) {
    if (dontDo[k] === true) {
      return;
    }
    var key = '**' + k + '**';
    var val = doSentence(obj.data[k], options);
    md += '|' + pad(key) + '|' + pad(val) + ' |\n';
  });
  return md;
};
module.exports = doInfobox;

},{"./pad":31,"./sentence":32}],31:[function(_dereq_,module,exports){
'use strict';

var cellWidth = 15;
//center-pad each cell, to make the table more legible
var pad = function pad(str) {
  str = str || '';
  var diff = cellWidth - str.length;
  diff = parseInt(diff / 2, 10);
  for (var i = 0; i < diff; i += 1) {
    str = ' ' + str + ' ';
  }
  return str;
};
module.exports = pad;

},{}],32:[function(_dereq_,module,exports){
'use strict';

var smartReplace = _dereq_('../lib').smartReplace;

// add `[text](href)` to the text
var doLink = function doLink(md, link) {
  var href = '';
  //if it's an external link, we good
  if (link.site) {
    href = link.site;
  } else {
    //otherwise, make it a relative internal link
    href = link.page || link.text;
    href = './' + href.replace(/ /g, '_');
  }
  var mdLink = '[' + link.text + '](' + href + ')';
  md = smartReplace(md, link.text, mdLink);
  return md;
};

//create links, bold, italic in markdown
var doSentence = function doSentence(sentence, options) {
  var md = sentence.text;
  //turn links back into links
  if (sentence.links && options.links === true) {
    sentence.links.forEach(function (link) {
      md = doLink(md, link);
    });
  }
  //turn bolds into **bold**
  if (sentence.fmt && sentence.fmt.bold) {
    sentence.fmt.bold.forEach(function (b) {
      md = smartReplace(md, b, '**' + b + '**');
    });
  }
  //support *italics*
  if (sentence.fmt && sentence.fmt.italic) {
    sentence.fmt.italic.forEach(function (i) {
      md = smartReplace(md, i, '*' + i + '*');
    });
  }
  return md;
};
module.exports = doSentence;

},{"../lib":28}],33:[function(_dereq_,module,exports){
'use strict';

var doSentence = _dereq_('./sentence');
var pad = _dereq_('./pad');
/* this is a markdown table:
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
*/

var makeRow = function makeRow(arr) {
  arr = arr.map(pad);
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
  var header = keys.map(function (k, i) {
    if (parseInt(k, 10) === i) {
      return '';
    }
    return k;
  });
  //draw the header (necessary!)
  md += makeRow(header) + '\n';
  md += makeRow(['---', '---', '---']) + '\n';
  //do each row..
  md += table.map(function (row) {
    //each column..
    var arr = keys.map(function (k) {
      if (!row[k]) {
        return '';
      }
      return doSentence(row[k], options) || '';
    });
    //make it a nice padded row
    return makeRow(arr);
  }).join('\n');
  return md + '\n';
};
module.exports = doTable;

},{"./pad":31,"./sentence":32}],34:[function(_dereq_,module,exports){
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

},{"../data/i18n":11}],35:[function(_dereq_,module,exports){
'use strict';

var redirects = _dereq_('./page/redirects');
var disambig = _dereq_('./page/disambig');
var preProcess = _dereq_('./preProcess');
var postProcess = _dereq_('./postProcess');
var parse = {
  section: _dereq_('./section'),
  infobox: _dereq_('./infobox'),
  categories: _dereq_('./categories')
};

//convert wikiscript markup lang to json
var main = function main(wiki, options) {
  options = options || {};
  wiki = wiki || '';
  //detect if page is just redirect, and return
  if (redirects.is_redirect(wiki)) {
    return redirects.parse_redirect(wiki);
  }
  //detect if page is just disambiguator page, and return
  if (disambig.is_disambig(wiki)) {
    return disambig.parse_disambig(wiki);
  }
  var r = {
    type: 'page',
    sections: [],
    infoboxes: [],
    interwiki: {},
    categories: [],
    images: [],
    coordinates: [],
    citations: []
  };
  if (options.custom) {
    r.custom = {};
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
  wiki = parse.infobox(r, wiki, options);
  //pull-out [[category:whatevers]]
  if (options.categories !== false) {
    wiki = parse.categories(r, wiki);
  }
  //parse all the headings, and their texts/sentences
  r.sections = parse.section(r, wiki, options) || [];

  r = postProcess(r);

  return r;
};

module.exports = main;

},{"./categories":34,"./infobox":37,"./page/disambig":39,"./page/redirects":40,"./postProcess":41,"./preProcess":43,"./section":49}],36:[function(_dereq_,module,exports){
'use strict';

//
var parseCitation = function parseCitation(str, wiki, r, options) {
  //remove it from main
  wiki = wiki.replace(str, '');
  if (options.citations === false) {
    return wiki;
  }
  //trim start {{ and
  //trim end }}
  str = str.replace(/^\{\{ *?/, '');
  str = str.replace(/ *?\}\} *?$/, '');
  //start parsing citation into json
  var obj = {};
  var lines = str.split(/\|/g);
  //first line is 'cite web'
  var type = lines[0].match(/cite ([a-z_]+)/i) || [];
  if (type[1]) {
    obj.cite = type[1] || null;
  }
  for (var i = 1; i < lines.length; i += 1) {
    var arr = lines[i].split(/=/);
    var key = arr[0].trim();
    var val = arr.slice(1, arr.length).join('=').trim();
    if (key && val) {
      //turn numbers into numbers
      if (/^[0-9.]+$/.test(val)) {
        val = parseFloat(val);
      }
      obj[key] = val;
    }
  }
  if (Object.keys(obj).length > 0) {
    r.citations.push(obj);
  }
  return wiki;
};
module.exports = parseCitation;

},{}],37:[function(_dereq_,module,exports){
'use strict';

var i18n = _dereq_('../../data/i18n');
var findRecursive = _dereq_('../../lib/recursive_match');
var parseInfobox = _dereq_('./infobox');
var parseCitation = _dereq_('./citation');
var keep = _dereq_('../section/sentence/templates/templates'); //dont remove these ones
var infobox_reg = new RegExp('{{(' + i18n.infoboxes.join('|') + ')[: \n]', 'ig');

//reduce the scary recursive situations
var parse_recursive = function parse_recursive(r, wiki, options) {
  //remove {{template {{}} }} recursions
  r.infoboxes = [];
  var matches = findRecursive('{', '}', wiki).filter(function (s) {
    return s[0] && s[1] && s[0] === '{' && s[1] === '{';
  });
  matches.forEach(function (tmpl) {
    if (tmpl.match(infobox_reg, 'ig')) {
      if (options.infoboxes !== false) {
        var infobox = parseInfobox(tmpl);
        r.infoboxes.push(infobox);
      }
      wiki = wiki.replace(tmpl, '');
      return;
    }
    //keep these ones, we'll parse them later
    var name = tmpl.match(/^\{\{([^:|\n ]+)/);
    if (name !== null) {
      name = name[1].trim().toLowerCase();

      if (/^\{\{ ?citation needed/i.test(tmpl) === true) {
        name = 'citation needed';
      }
      //parse {{cite web ...}} (it appears every language)
      if (name === 'cite' || name === 'citation') {
        wiki = parseCitation(tmpl, wiki, r, options);
        return;
      }

      //sorta-keep nowrap template
      if (name === 'nowrap') {
        var inside = tmpl.match(/^\{\{nowrap *?\|(.*?)\}\}$/);
        if (inside) {
          wiki = wiki.replace(tmpl, inside[1]);
        }
      }
      if (keep.hasOwnProperty(name) === true) {
        return;
      }
    }
    //let everybody add a custom parser for this template
    if (options.custom) {
      Object.keys(options.custom).forEach(function (k) {
        var val = options.custom[k](tmpl, wiki);
        if (val || val === false) {
          //dont store all the nulls
          r.custom[k] = r.custom[k] || [];
          r.custom[k].push(val);
        }
      });
    }
    //if it's not a known template, but it's recursive, remove it
    //(because it will be misread later-on)
    wiki = wiki.replace(tmpl, '');
  });
  // //ok, now that the scary recursion issues are gone, we can trust simple regex methods..
  // //kill the rest of templates
  wiki = wiki.replace(/\{\{ *?(^(main|wide)).*?\}\}/g, '');
  return wiki;
};

module.exports = parse_recursive;

},{"../../data/i18n":11,"../../lib/recursive_match":18,"../section/sentence/templates/templates":60,"./citation":36,"./infobox":38}],38:[function(_dereq_,module,exports){
'use strict';

var trim = _dereq_('../../lib/helpers').trim_whitespace;
var parseLine = _dereq_('../section/sentence').parseLine;
var findRecursive = _dereq_('../../lib/recursive_match');
var i18n = _dereq_('../../data/i18n');
var infobox_template_reg = new RegExp('{{(?:' + i18n.infoboxes.join('|') + ')\\s*(.*)', 'i');

var getTemplate = function getTemplate(str) {
  var m = str.match(infobox_template_reg);
  if (m && m[1]) {
    return m[1];
  }
  return null;
};

var parse_infobox = function parse_infobox(str) {
  if (!str) {
    return {};
  }
  var stringBuilder = [];
  var lastChar = void 0;
  //this collapsible list stuff is just a headache
  var listReg = /\{\{ ?(collapsible|hlist|ublist|plainlist|Unbulleted list|flatlist)/i;
  if (listReg.test(str)) {
    var list = findRecursive('{', '}', str.substr(2, str.length - 2)).filter(function (f) {
      return listReg.test(f);
    });
    str = str.replace(list[0], '');
  }

  var template = getTemplate(str); //get the infobox name

  var parDepth = -2; // first two {{
  for (var i = 0, len = str.length; i < len; i++) {
    if (parDepth === 0 && str[i] === '|' && lastChar !== '\n') {
      stringBuilder.push('\n');
    }
    if (str[i] === '{' || str[i] === '[') {
      parDepth++;
    } else if (str[i] === '}' || str[i] === ']') {
      parDepth--;
    }
    lastChar = str[i];
    stringBuilder.push(lastChar);
  }

  str = stringBuilder.join('');
  //remove top+bottom
  str = str.replace(/^ *?\{\{.+[|\n]/, '');
  str = str.replace(/\}\} *?$/, '');
  var lines = str.split(/\n\*?/);

  var obj = {};
  var key = null;
  for (var _i = 0; _i < lines.length; _i++) {
    var l = lines[_i];
    var keyMatch = l.match(/\| *?([^=]+)=(.+)?/i);
    if (keyMatch && keyMatch[1]) {
      key = trim(keyMatch[1]);
      if (keyMatch[2]) {
        obj[key] = trim(keyMatch[2]);
      } else {
        obj[key] = '';
      }
    } else if (key) {
      obj[key] += l;
    }
  }
  //post-process values
  Object.keys(obj).forEach(function (k) {
    if (!obj[k]) {
      delete obj[k];
      return;
    }
    obj[k] = parseLine(obj[k]);
    if (obj[k].text && obj[k].text.match(/^[0-9,]*$/)) {
      obj[k].text = obj[k].text.replace(/,/, '');
      obj[k].text = parseInt(obj[k].text, 10);
    }
  });
  // //remove top+bottom
  // if(lines.length>1 && lines[0].match()
  // console.log(regexMatch);
  // console.log('\n\n\n');
  // while ((regexMatch = line_reg.exec(str)) !== null) {
  //   // console.log(str + '----');
  //   let key = helpers.trim_whitespace(regexMatch[1] || '') || '';
  //   let value = helpers.trim_whitespace(regexMatch[2] || '') || '';
  //
  //   //this is necessary for mongodb, im sorry
  //   key = key.replace(/\./, '');
  //   if (key && value) {
  //     obj[key] = parse_line(value);
  //     //turn number strings into integers
  //     if (obj[key].text && obj[key].text.match(/^[0-9,]*$/)) {
  //       obj[key].text = obj[key].text.replace(/,/, '');
  //       obj[key].text = parseInt(obj[key].text, 10);
  //     }
  //   }
  // }
  return {
    template: template,
    data: obj
  };
};
module.exports = parse_infobox;

},{"../../data/i18n":11,"../../lib/helpers":17,"../../lib/recursive_match":18,"../section/sentence":53}],39:[function(_dereq_,module,exports){
'use strict';

var i18n = _dereq_('../../data/i18n');
var parse_links = _dereq_('../section/sentence/links');
var template_reg = new RegExp('\\{\\{ ?(' + i18n.disambigs.join('|') + ')(\\|[a-z =]*?)? ?\\}\\}', 'i');

var is_disambig = function is_disambig(wiki) {
  return template_reg.test(wiki);
};

//return a list of probable pages for this disambig page
var parse_disambig = function parse_disambig(wiki) {
  var pages = [];
  var lines = wiki.replace(/\r/g, '').split(/\n/);
  lines.forEach(function (str) {
    //if there's an early link in the list
    if (str.match(/^\*.{0,40}\[\[.*\]\]/)) {
      var links = parse_links(str);
      if (links && links[0] && links[0].page) {
        pages.push(links[0].page);
      }
    }
  });
  return {
    type: 'disambiguation',
    pages: pages
  };
};
module.exports = {
  is_disambig: is_disambig,
  parse_disambig: parse_disambig
};

},{"../../data/i18n":11,"../section/sentence/links":54}],40:[function(_dereq_,module,exports){
'use strict';

var i18n = _dereq_('../../data/i18n');
//pulls target link out of redirect page
var REDIRECT_REGEX = new RegExp('^[ \n\t]*?#(' + i18n.redirects.join('|') + ') *?\\[\\[(.{2,60}?)\\]\\]', 'i');

var is_redirect = function is_redirect(wiki) {
  return wiki.match(REDIRECT_REGEX);
};

var parse_redirect = function parse_redirect(wiki) {
  var article = (wiki.match(REDIRECT_REGEX) || [])[2] || '';
  article = article.replace(/#.*/, '');
  return {
    type: 'redirect',
    redirect: article
  };
};

module.exports = {
  is_redirect: is_redirect,
  parse_redirect: parse_redirect
};

},{"../../data/i18n":11}],41:[function(_dereq_,module,exports){
'use strict';

var i18n = _dereq_('../../data/i18n');
var parseImage = _dereq_('../section/image/image');
var img_regex = new RegExp('^(' + i18n.images.concat(i18n.files).join('|') + ')', 'i');

//cleanup after ourselves
var postProcess = function postProcess(r) {
  // add image from infobox, if applicable
  if (r.infoboxes[0] && r.infoboxes[0].data && r.infoboxes[0].data['image'] && r.infoboxes[0].data['image'].text) {
    var img = r.infoboxes[0].data['image'].text || '';
    if (img && typeof img === 'string' && !img.match(img_regex)) {
      img = '[[File:' + img + ']]';
      img = parseImage(img);
      r.images.push(img);
    }
  }
  //loop around and add the other images
  r.sections.forEach(function (s) {
    //image from {{wide image|...}} template
    if (s.templates && s.templates.wide_image) {
      var _img = s.templates.wide_image[0];
      _img = '[[File:' + _img + ']]';
      _img = parseImage(_img);
      r.images.push(_img);
    }
    if (s.images) {
      s.images.forEach(function (img) {
        return r.images.push(img);
      });
    }
  });

  //try to guess the page's title (from the bold first-line)
  if (r.sections[0] && r.sections[0].sentences[0]) {
    var s = r.sections[0].sentences[0];
    if (s.fmt && s.fmt.bold && s.fmt.bold[0]) {
      r.title = r.title || s.fmt.bold[0];
    }
  }
  return r;
};
module.exports = postProcess;

},{"../../data/i18n":11,"../section/image/image":47}],42:[function(_dereq_,module,exports){
'use strict';

var convertGeo = _dereq_('../../lib/convertGeo');
// {{coord|latitude|longitude|coordinate parameters|template parameters}}
// {{coord|dd|N/S|dd|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|N/S|dd|mm|E/W|coordinate parameters|template parameters}}
// {{coord|dd|mm|ss|N/S|dd|mm|ss|E/W|coordinate parameters|template parameters}}

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
      if (obj.lat !== null) {
        nums.push(s);
        obj.lon = convertGeo(nums);
      } else {
        nums.push(s);
        obj.lat = convertGeo(nums);
        arr = arr.slice(i, arr.length);
        nums = [];
        i = 0;
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

},{"../../lib/convertGeo":15}],43:[function(_dereq_,module,exports){
'use strict';

var kill_xml = _dereq_('./kill_xml');
var wordTemplates = _dereq_('./word_templates');

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
  //expand inline templates like {{date}}
  wiki = wordTemplates(wiki, r);
  //give it the inglorious send-off it deserves..
  wiki = kill_xml(wiki, r, options);
  //({{template}},{{template}}) leaves empty parentheses
  wiki = wiki.replace(/\( \)/g, '');
  return wiki;
}
module.exports = preProcess;
// console.log(preProcess("hi [[as:Plancton]] there"));
// console.log(preProcess('hello <br/> world'))
// console.log(preProcess("hello <asd f> world </h2>"))

},{"./kill_xml":44,"./word_templates":45}],44:[function(_dereq_,module,exports){
'use strict';

var parseCitation = _dereq_('../infobox/citation');
var parseLine = _dereq_('../section/sentence').parseLine;
//okay, i know you're not supposed to regex html, but...
//https://en.wikipedia.org/wiki/Help:HTML_in_wikitext

var hasCitation = function hasCitation(str) {
  return (/^ *?\{\{ *?(cite|citation)/i.test(str) && /\}\} *?$/.test(str) && /citation needed/i.test(str) === false
  );
};
//handle unstructured ones - <ref>some text</ref>
var parseInline = function parseInline(str, r, options) {
  if (options.citations === false) {
    return;
  }
  var obj = parseLine(str) || {};
  var cite = {
    cite: 'inline',
    text: obj.text
  };
  if (obj.links && obj.links.length) {
    var extern = obj.links.find(function (f) {
      return f.site;
    });
    if (extern) {
      cite.url = extern.site;
    }
  }
  r.citations.push(cite);
};

var kill_xml = function kill_xml(wiki, r, options) {
  //luckily, refs can't be recursive..
  // <ref></ref>
  wiki = wiki.replace(/ ?<ref>([\s\S]{0,750}?)<\/ref> ?/gi, function (a, tmpl) {
    if (hasCitation(tmpl)) {
      wiki = parseCitation(tmpl, wiki, r, options);
    } else {
      parseInline(tmpl, r, options);
    }
    return ' ';
  });
  // <ref name=""/>
  wiki = wiki.replace(/ ?<ref [^>]{0,200}?\/> ?/gi, ' ');
  // <ref name=""></ref>
  wiki = wiki.replace(/ ?<ref [^>]{0,200}?>([\s\S]{0,1000}?)<\/ref> ?/gi, function (a, tmpl) {
    if (hasCitation(tmpl)) {
      wiki = parseCitation(tmpl, wiki, r, options);
    } else {
      parseInline(tmpl, r, options);
    }
    return ' ';
  });
  //other types of xml that we want to trash completely
  wiki = wiki.replace(/< ?(table|code|score|data|categorytree|charinsert|gallery|hiero|imagemap|inputbox|math|nowiki|poem|references|source|syntaxhighlight|timeline) ?[^>]{0,200}?>[\s\S]{0,700}< ?\/ ?(table|code|score|data|categorytree|charinsert|gallery|hiero|imagemap|inputbox|math|nowiki|poem|references|source|syntaxhighlight|timeline) ?>/gi, ' '); // <table name=""><tr>hi</tr></table>
  //some xml-like fragments we can also kill
  wiki = wiki.replace(/ ?< ?(ref|span|div|table|data) [a-z0-9=" ]{2,20}\/ ?> ?/g, ' '); //<ref name="asd"/>
  //some formatting xml, we'll keep their insides though
  wiki = wiki.replace(/ ?<[ \/]?(p|sub|sup|span|nowiki|div|table|br|tr|td|th|pre|pre2|hr)[ \/]?> ?/g, ' '); //<sub>, </sub>
  wiki = wiki.replace(/ ?<[ \/]?(abbr|bdi|bdo|blockquote|cite|del|dfn|em|i|ins|kbd|mark|q|s)[ \/]?> ?/g, ' '); //<abbr>, </abbr>
  wiki = wiki.replace(/ ?<[ \/]?h[0-9][ \/]?> ?/g, ' '); //<h2>, </h2>
  //a more generic + dangerous xml-tag removal
  wiki = wiki.replace(/ ?<[ \/]?[a-z0-9]{1,8}[ \/]?> ?/g, ' '); //<samp>
  wiki = wiki.replace(/ ?< ?br ?\/> ?/g, ' '); //<br />
  return wiki.trim();
};
// console.log(kill_xml("hello <ref>nono!</ref> world1. hello <ref name='hullo'>nono!</ref> world2. hello <ref name='hullo'/>world3.  hello <table name=''><tr><td>hi<ref>nono!</ref></td></tr></table>world4. hello<ref name=''/> world5 <ref name=''>nono</ref>, man.}}"))
// console.log(kill_xml("hello <table name=''><tr><td>hi<ref>nono!</ref></td></tr></table>world4"))
// console.log(kill_xml('hello<ref name="theroyal"/> world <ref>nono</ref>, man}}'))
// console.log(kill_xml("hello<ref name=\"theroyal\"/> world5, <ref name=\"\">nono</ref> man"));
// console.log(kill_xml("hello <asd f> world </h2>"))
// console.log(kill_xml("North America,<ref name=\"fhwa\"> and one of"))
// console.log(kill_xml("North America,<br /> and one of"))
module.exports = kill_xml;

},{"../infobox/citation":36,"../section/sentence":53}],45:[function(_dereq_,module,exports){
'use strict';

var languages = _dereq_('../../data/languages');
var parseCoord = _dereq_('./coordinates');

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//these are easy, inline templates we can do without too-much trouble.
var inline = /\{\{(url|convert|current|local|lc|uc|formatnum|pull|cquote|coord|small|smaller|midsize|larger|big|bigger|large|huge|resize|dts|date|term|ipa|ill|sense|t|etyl|sfnref|OldStyleDate)(.*?)\}\}/gi;

// templates that need parsing and replacing for inline text
//https://en.wikipedia.org/wiki/Category:Magic_word_templates
var word_templates = function word_templates(wiki, r) {

  //greedy-pass at easier, inline-templates
  wiki = wiki.replace(inline, function (tmpl) {
    //we can be sneaky with this template, as it's often found inside other templates
    tmpl = tmpl.replace(/^\{\{URL\|([^ ]{4,100}?)\}\}/gi, '$1');
    //this one needs to be handled manually
    tmpl = tmpl.replace(/^\{\{convert\|([0-9]*?)\|([^\|]*?)\}\}/gi, '$1 $2'); //TODO: support https://en.tmplpedia.org/tmpl/Template:Convert#Ranges_of_values
    //date-time templates
    var d = new Date();
    tmpl = tmpl.replace(/^\{\{(CURRENT|LOCAL)DAY(2)?\}\}/gi, d.getDate());
    tmpl = tmpl.replace(/^\{\{(CURRENT|LOCAL)MONTH(NAME|ABBREV)?\}\}/gi, months[d.getMonth()]);
    tmpl = tmpl.replace(/^\{\{(CURRENT|LOCAL)YEAR\}\}/gi, d.getFullYear());
    tmpl = tmpl.replace(/^\{\{(CURRENT|LOCAL)DAYNAME\}\}/gi, days[d.getDay()]);
    //formatting templates
    tmpl = tmpl.replace(/^\{\{(lc|uc|formatnum):(.*?)\}\}/gi, '$2');
    tmpl = tmpl.replace(/^\{\{pull quote\|([\s\S]*?)(\|[\s\S]*?)?\}\}/gi, '$1');
    tmpl = tmpl.replace(/^\{\{cquote\|([\s\S]*?)(\|[\s\S]*?)?\}\}/gi, '$1');
    //interlanguage-link
    tmpl = tmpl.replace(/^\{\{ill\|([^|]+).*?\}\}/gi, '$1');
    //footnote syntax
    tmpl = tmpl.replace(/^\{\{refn\|([^|]+).*?\}\}/gi, '$1');
    //'tag' escaped thing.
    tmpl = tmpl.replace(/^\{\{#?tag\|([^|]+).*?\}\}/gi, '');
    // these are nuts {{OldStyleDate}}
    tmpl = tmpl.replace(/^\{\{OldStyleDate\|([^|]+).*?\}\}/gi, '');
    //'harvard references'
    //{{coord|43|42|N|79|24|W|region:CA-ON|display=inline,title}}
    var coord = tmpl.match(/^\{\{coord\|(.*?)\}\}/i);
    if (coord !== null) {
      r.coordinates.push(parseCoord(coord[1]));
      tmpl = tmpl.replace(coord[0], '');
    }
    //font-size
    tmpl = tmpl.replace(/^\{\{(small|smaller|midsize|larger|big|bigger|large|huge|resize)\|([\s\S]*?)\}\}/gi, '$2');
    //{{font|size=x%|text}}

    if (tmpl.match(/^\{\{dts\|/)) {
      var date = (tmpl.match(/^\{\{dts\|(.*?)[\}\|]/) || [])[1] || '';
      date = new Date(date);
      if (date && date.getTime()) {
        tmpl = tmpl.replace(/^\{\{dts\|.*?\}\}/gi, date.toDateString());
      } else {
        tmpl = tmpl.replace(/^\{\{dts\|.*?\}\}/gi, ' ');
      }
    }
    if (tmpl.match(/^\{\{date\|.*?\}\}/)) {
      var _date = tmpl.match(/^\{\{date\|(.*?)\|(.*?)\|(.*?)\}\}/) || [] || [];
      var dateString = _date[1] + ' ' + _date[2] + ' ' + _date[3];
      tmpl = tmpl.replace(/^\{\{date\|.*?\}\}/gi, dateString);
    }
    //common templates in wiktionary
    tmpl = tmpl.replace(/^\{\{term\|(.*?)\|.*?\}\}/gi, '\'$1\'');
    tmpl = tmpl.replace(/^\{\{IPA(c-en)?\|(.*?)\|(.*?)\}\},?/gi, '');
    tmpl = tmpl.replace(/^\{\{sense\|(.*?)\|?.*?\}\}/gi, '($1)');
    tmpl = tmpl.replace(/v\{\{t\+?\|...?\|(.*?)(\|.*)?\}\}/gi, '\'$1\'');
    //replace languages in 'etyl' tags
    if (tmpl.match(/^\{\{etyl\|/)) {
      //doesn't support multiple-ones per sentence..
      var lang = (tmpl.match(/^\{\{etyl\|(.*?)\|.*?\}\}/i) || [])[1] || '';
      lang = lang.toLowerCase();
      if (lang && languages[lang]) {
        tmpl = tmpl.replace(/^\{\{etyl\|(.*?)\|.*?\}\}/gi, languages[lang].english_title);
      } else {
        tmpl = tmpl.replace(/^\{\{etyl\|(.*?)\|.*?\}\}/gi, '($1)');
      }
    }
    return tmpl;
  });
  //flatlist -> commas  -- hlist?
  wiki = wiki.replace(/\{\{(flatlist|hlist) ?\|([^}]+)\}\}/gi, function (a, b, c) {
    var arr = c.split(/\s+[* ]+? ?/g);
    arr = arr.filter(function (line) {
      return line;
    });
    return arr.join(', ');
  });
  //plainlist -> newlines
  wiki = wiki.replace(/\{\{(plainlist|ublist|unbulleted list) ?\|([^}]+)\}\}/gi, function (a, b, c) {
    var arr = c.split(/\s+[* ]+? ?/g);
    arr = arr.filter(function (line) {
      return line;
    });
    return arr.join(', ');
  });
  // tmpl = tmpl.replace(/\{\{flatlist\|([\s\S]*?)(\|[\s\S]*?)?\}\}/gi, '$1');
  return wiki;
};
// console.log(word_templates("hello {{CURRENTDAY}} world"))
// console.log(word_templates("hello {{CURRENTMONTH}} world"))
// console.log(word_templates("hello {{CURRENTYEAR}} world"))
// console.log(word_templates("hello {{LOCALDAYNAME}} world"))
// console.log(word_templates("hello {{lc:88}} world"))
// console.log(word_templates("hello {{pull quote|Life is like\n|author=[[asdf]]}} world"))
// console.log(word_templates("hi {{etyl|la|-}} there"))
// console.log(word_templates("{{etyl|la|-}} cognate with {{etyl|is|-}} {{term|hugga||to comfort|lang=is}},"))

module.exports = word_templates;

},{"../../data/languages":12,"./coordinates":42}],46:[function(_dereq_,module,exports){
'use strict';

var fns = _dereq_('../../lib/helpers');
var heading_reg = /^(={1,5})([^=]{1,200}?)={1,5}$/;

//interpret depth, title of headings like '==See also=='
var parseHeading = function parseHeading(r, str) {
  var heading = str.match(heading_reg);
  if (!heading) {
    return {
      title: '',
      depth: 0
    };
  }
  var title = heading[2] || '';
  title = fns.trim_whitespace(title);
  var depth = 1;
  if (heading[1]) {
    depth = heading[1].length - 1;
  }
  r.title = title;
  r.depth = depth;
  return r;
};
module.exports = parseHeading;

},{"../../lib/helpers":17}],47:[function(_dereq_,module,exports){
'use strict';

var Hashes = _dereq_('jshashes');
var i18n = _dereq_('../../../data/i18n');
var file_reg = new RegExp('(' + i18n.images.concat(i18n.files).join('|') + '):.*?[\\|\\]]', 'i');

//the wikimedia image url is a little silly:
//https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F
var make_image = function make_image(file) {
  var title = file.replace(/^(image|file?)\:/i, '');
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1);
  //spaces to underscores
  title = title.replace(/ /g, '_');

  var hash = new Hashes.MD5().hex(title);
  var path = hash.substr(0, 1) + '/' + hash.substr(0, 2) + '/';
  title = encodeURIComponent(title);
  path += title;
  var server = 'https://upload.wikimedia.org/wikipedia/commons/';
  var thumb = '/300px-' + title;
  return {
    url: server + path,
    file: file,
    thumb: server + 'thumb/' + path + thumb
  };
};

//images are usually [[image:my_pic.jpg]]
var parse_image = function parse_image(img) {
  img = img.match(file_reg) || [''];
  img = img[0].replace(/[\|\]]$/, '');
  //add url, etc to image
  img = make_image(img);
  return img;
};
module.exports = parse_image;

// console.log(parse_image("[[image:my_pic.jpg]]"));

},{"../../../data/i18n":11,"jshashes":2}],48:[function(_dereq_,module,exports){
'use strict';

var i18n = _dereq_('../../../data/i18n');
var find_recursive = _dereq_('../../../lib/recursive_match');
var parse_image = _dereq_('./image');
var fileRegex = new RegExp('(' + i18n.images.concat(i18n.files).join('|') + '):.*?[\\|\\]]', 'i');

var parseImages = function parseImages(r, wiki, options) {
  //second, remove [[file:...[[]] ]] recursions
  var matches = find_recursive('[', ']', wiki);
  matches.forEach(function (s) {
    if (s.match(fileRegex)) {
      r.images = r.images || [];
      if (options.images !== false) {
        r.images.push(parse_image(s));
      }
      wiki = wiki.replace(s, '');
    }
  });

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
module.exports = parseImages;

},{"../../../data/i18n":11,"../../../lib/recursive_match":18,"./image":47}],49:[function(_dereq_,module,exports){
'use strict';

//interpret ==heading== lines
var parse = {
  heading: _dereq_('./heading'),
  list: _dereq_('./list'),
  image: _dereq_('./image'),
  table: _dereq_('./table'),
  templates: _dereq_('./section_templates'),
  eachSentence: _dereq_('./sentence').eachSentence
};
var section_reg = /[\n^](={1,5}[^=]{1,200}?={1,5})/g;

var parseSection = function parseSection(section, wiki, r, options) {
  // //parse the tables
  wiki = parse.table(section, wiki);
  // //parse the lists
  wiki = parse.list(section, wiki);
  //supoprted things like {{main}}
  wiki = parse.templates(section, wiki);
  // //parse+remove scary '[[ [[]] ]]' stuff
  wiki = parse.image(section, wiki, options);
  //do each sentence
  wiki = parse.eachSentence(section, wiki);
  // section.wiki = wiki;
  return section;
};

var makeSections = function makeSections(r, wiki, options) {
  var split = wiki.split(section_reg); //.filter(s => s);
  var sections = [];
  for (var i = 0; i < split.length; i += 2) {
    var title = split[i - 1] || '';
    var txt = split[i] || '';
    var section = {
      title: '',
      depth: null
    };
    section = parse.heading(section, title);
    section = parseSection(section, txt, r, options);
    sections.push(section);
  }
  return sections;
};

module.exports = makeSections;

},{"./heading":46,"./image":48,"./list":50,"./section_templates":51,"./sentence":53,"./table":61}],50:[function(_dereq_,module,exports){
'use strict';

var list_reg = /^[#\*:;\|]+/;
var bullet_reg = /^\*+[^:,\|]{4}/;
var number_reg = /^ ?\#[^:,\|]{4}/;
var has_word = /[a-z]/i;
var parseLine = _dereq_('./sentence/').parseLine;

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
        i += sub.length;
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

},{"./sentence/":53}],51:[function(_dereq_,module,exports){
'use strict';

// const parseCoord = require('./coordinates');
var regs = {
  main: /\{\{main( article)?\|(.*?)\}\}/i,
  wide_image: /\{\{wide image\|(.*?)\}\}/i
};

//these templates apply only to this section,and we wont find them, say, inside a infobox
var parseTemplates = function parseTemplates(section, wiki) {
  var templates = {};

  //{{main|toronto}}
  var main = wiki.match(regs.main);
  if (main) {
    templates.main = main[2].split('|');
    wiki = wiki.replace(regs.main, '');
  }
  //{{wide image|file:cool.jpg}}
  var wide = wiki.match(regs.wide_image);
  if (wide) {
    templates.wide_image = wide[1].split('|');
    wiki = wiki.replace(regs.wide_image, '');
  }
  if (Object.keys(templates).length > 0) {
    section.templates = templates;
  }
  return wiki;
};
module.exports = parseTemplates;

},{}],52:[function(_dereq_,module,exports){
'use strict';

//
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

},{}],53:[function(_dereq_,module,exports){
'use strict';

var helpers = _dereq_('../../../lib/helpers');
var parseLinks = _dereq_('./links');
var parseFmt = _dereq_('./formatting');
var templates = _dereq_('./templates');
var sentenceParser = _dereq_('./sentence-parser');
var i18n = _dereq_('../../../data/i18n');
var cat_reg = new RegExp('\\[\\[:?(' + i18n.categories.join('|') + '):[^\\]\\]]{2,80}\\]\\]', 'gi');

//return only rendered text of wiki links
var resolve_links = function resolve_links(line) {
  // categories, images, files
  line = line.replace(cat_reg, '');
  // [[Common links]]
  line = line.replace(/\[\[:?([^|]{1,80}?)\]\](\w{0,5})/g, '$1$2');
  // [[File:with|Size]]
  line = line.replace(/\[\[File:?(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, '$1');
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
  line = helpers.trim_whitespace(line);
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
  obj = templates(obj);
  return obj;
}

var parseSentences = function parseSentences(r, wiki) {
  var sentences = sentenceParser(wiki);
  sentences = sentences.map(parseLine);
  r.sentences = sentences;
  return r;
};

module.exports = {
  eachSentence: parseSentences,
  parseLine: parseLine
};

},{"../../../data/i18n":11,"../../../lib/helpers":17,"./formatting":52,"./links":54,"./sentence-parser":55,"./templates":58}],54:[function(_dereq_,module,exports){
'use strict';

var helpers = _dereq_('../../../lib/helpers');
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
    var txt = '';
    var link = s;
    if (s.match(/\|/)) {
      //replacement link [[link|text]]
      s = s.replace(/\[\[(.{2,80}?)\]\](\w{0,10})/g, '$1$2'); //remove ['s and keep suffix
      link = s.replace(/(.{2,60})\|.{0,200}/, '$1'); //replaced links
      txt = s.replace(/.{2,60}?\|/, '');
      //handle funky case of [[toronto|]]
      if (!txt && link.match(/\|$/)) {
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
      page: helpers.capitalise(link),
      text: txt || link
    };
    //finally, support [[link]]'s apostrophe
    if (apostrophe) {
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

},{"../../../lib/helpers":17}],55:[function(_dereq_,module,exports){
//split text into sentences, using regex
//@spencermountain MIT

//(Rule-based sentence boundary segmentation) - chop given text into its proper sentences.
// Ignore periods/questions/exclamations used in acronyms/abbreviations/numbers, etc.
// @spencermountain 2015 MIT
'use strict';

var abbreviations = _dereq_('../../../data/abbreviations');
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
    return str.split(/(\S.+?[.!?])(?=\s+|$)/g);
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

},{"../../../data/abbreviations":10}],56:[function(_dereq_,module,exports){
'use strict';

//assorted parsing methods for date/time templates
var months = [undefined, //1-based months.. :/
'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//parse year|month|date numbers
var ymd = function ymd(arr) {
  var obj = {};
  var units = ['year', 'month', 'date', 'hour', 'minute', 'second'];
  for (var i = 0; i < units.length; i += 1) {
    if (!arr[i] && arr[1] !== 0) {
      continue;
    }
    obj[units[i]] = parseInt(arr[i], 10);
    if (isNaN(obj[units[i]])) {
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
  var str = String(date.year) || '';
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

},{}],57:[function(_dereq_,module,exports){
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

},{}],58:[function(_dereq_,module,exports){
'use strict';

var parsers = _dereq_('./parsers');
var templates = _dereq_('./templates');

//get identity of template - Template:Foo
var getName = function getName(tmpl) {
  tmpl = tmpl.replace(/^\{\{/, '');
  tmpl = tmpl.replace(/\}\}$/, '');
  var name = tmpl.split(/\|/)[0] || '';
  name = name.toLowerCase().trim();
  // name = name.replace(/-/g, ' ');
  return name;
};

//run each remaining {{template}} through our parsers
var parseTemplates = function parseTemplates(obj) {
  var list = obj.text.match(/\{\{([^}]+)\}\}/g) || [];
  list = list.map(function (tmpl) {
    var name = getName(tmpl);
    return {
      name: name,
      raw: tmpl
    };
  });
  //try parsing each template
  list.forEach(function (t) {
    //remove the {{'s & }}'s
    t.tmpl = t.raw.replace(/^\{\{/, '');
    t.tmpl = t.tmpl.replace(/\}\}$/, '');
    if (parsers.hasOwnProperty(templates[t.name]) === true) {
      var parser = templates[t.name];
      var result = parsers[parser](t.tmpl, obj);
      obj.text = obj.text.replace(t.raw, result);
    } else {
      //otherwise, just remove it from the text
      obj.text = obj.text.replace(t.raw, '');
    }
  });
  return obj;
};
module.exports = parseTemplates;

},{"./parsers":59,"./templates":60}],59:[function(_dereq_,module,exports){
'use strict';

var dates = _dereq_('./dates');
var ymd = dates.ymd;
var toText = dates.toText;
var delta = _dereq_('./delta_date');

var getBoth = function getBoth(tmpl) {
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
  date: function date(tmpl, obj) {
    var arr = tmpl.split('|');
    arr = arr.slice(1, 8);
    //support 'df=yes|1894|7|26'
    if (arr[0] && /^df=/.test(arr[0])) {
      arr.shift();
    }
    var date = ymd(arr);
    date.text = toText(date); //make the replacement string
    obj.dates = obj.dates || [];
    obj.dates.push(date);
    return date.text;
  },

  //support parsing of 'February 10, 1992'
  natural_date: function natural_date(tmpl, obj) {
    var arr = tmpl.split('|');
    var str = arr[1] || '';
    // - just a year
    var date = {};
    if (/^[0-9]{4}$/.test(arr[1])) {
      date.year = parseInt(arr[1], 10);
    } else {
      //parse the date, using the js date object (for now?)
      var txt = arr[1].replace(/[a-z]+\/[a-z]+/i);
      txt = txt.replace(/[0-9]+:[0-9]+(am|pm)?/i);
      var d = new Date(txt);
      if (isNaN(d.getTime()) === false) {
        date.year = d.getFullYear();
        date.month = d.getMonth() + 1;
        date.date = d.getDate();
      }
    }
    obj.dates = obj.dates || [];
    obj.dates.push(date);
    return str.trim();
  },

  //just grab the first value, and assume it's a year
  one_year: function one_year(tmpl, obj) {
    var arr = tmpl.split('|');
    var str = arr[1] || '';
    var year = parseInt(str, 10);
    obj.dates = obj.dates || [];
    obj.dates.push({
      year: year
    });
    return str.trim();
  },

  //assume 'y|m|d' | 'y|m|d'
  two_dates: function two_dates(tmpl, obj) {
    var arr = tmpl.split('|');
    //'b' means show birth-date, otherwise show death-date
    if (arr[1] === 'B' || arr[1] === 'b') {
      var _date = ymd(arr.slice(2, 5));
      obj.dates = obj.dates || [];
      obj.dates.push(_date);
      return toText(_date);
    }
    var date = ymd(arr.slice(5, 8));
    obj.dates = obj.dates || [];
    obj.dates.push(date);
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

},{"./dates":56,"./delta_date":57}],60:[function(_dereq_,module,exports){
'use strict';

//templates we support
var keep = {
  'main': true,
  'main article': true,
  'wide image': true,
  'coord': true,

  //date/age/time templates
  'start': 'date',
  'end': 'date',
  'birth': 'date',
  'death': 'date',
  'start date': 'date',
  'end date': 'date',
  'birth date': 'date',
  'death date': 'date',
  'start date and age': 'date',
  'end date and age': 'date',
  'birth date and age': 'date',
  'death date and age': 'date',
  'birth date and given age': 'date',
  'death date and given age': 'date',
  'birth year and age': 'one_year',
  'death year and age': 'one_year',

  //this is insane (hyphen ones are different)
  'start-date': 'natural_date',
  'end-date': 'natural_date',
  'birth-date': 'natural_date',
  'death-date': 'natural_date',
  'birth-date and age': 'natural_date',
  'birth-date and given age': 'natural_date',
  'death-date and age': 'natural_date',
  'death-date and given age': 'natural_date',

  'birthdeathage': 'two_dates',
  'dob': 'date',
  'bda': 'date',
  // 'birth date and age2': 'date',

  'age': 'age',
  'age nts': 'age',
  'age in years': 'diff-y',
  'age in years and months': 'diff-ym',
  'age in years, months and days': 'diff-ymd',
  'age in years and days': 'diff-yd',
  'age in days': 'diff-d'
  // 'age in years, months, weeks and days': true,
  // 'age as of date': true,


};
module.exports = keep;

},{}],61:[function(_dereq_,module,exports){
'use strict';

var helpers = _dereq_('../../lib/helpers');
var parseLine = _dereq_('./sentence/').parseLine;

var table_reg = /\{\|[\s\S]+?\|\}/g; //the largest-cities table is ~70kchars.

var parseHeading = function parseHeading(str) {
  str = parseLine(str).text || '';
  if (str.match(/\|/)) {
    str = str.replace(/.+\| ?/, ''); //class="unsortable"|title
  }
  return str;
};

//turn a {|...table string into an array of arrays
var parse_table = function parse_table(wiki) {
  var headings = [];
  var lines = wiki.replace(/\r/g, '').split(/\n/);

  //find headings first
  for (var i = 0; i < lines.length; i++) {
    var str = lines[i];
    //header
    if (str.match(/^\!/)) {
      str = str.replace(/^\! +/, '');
      //handle inline '!!' format
      if (str.match(/ \!\! /)) {
        var heads = str.split(/ \!\! /);
        headings = heads.map(parseHeading);
      } else {
        //handle heading-per-line
        str = parseHeading(str);
        if (!str) {
          str = 'col-' + headings.length;
        }
        headings.push(str);
        lines[i] = null; //remove it
      }
    } else if (headings.length > 0 && str.match(/^|-/)) {
      lines = lines.slice(i, lines.length);
      break; //done here
    } else if (str.match(/^\| /)) {
      lines = lines.slice(i, lines.length);
      break; //done here
    }
  }
  lines = lines.filter(function (l) {
    return l;
  });

  // console.log(lines);
  var table = [[]];
  lines.forEach(function (str) {
    //end of table, end here
    if (str.match(/^\|\}/)) {
      return;
    }
    //this is some kind of comment/summary
    if (str.match(/^\|\+/)) {
      return;
    }
    //make new row
    if (str.match(/^\|-/)) {
      if (table[0].length > 0) {
        table.push([]);
      }
      return;
    }
    // handle weird '! ' row-header syntax
    if (str.match(/^\!/)) {
      str = str.replace(/^\! +/, '');
      str = parseHeading(str);
      str = helpers.trim_whitespace(str);
      table[table.length - 1].push(str);
      return;
    }
    //juicy line
    if (str.match(/^\|/)) {
      var want = (str.match(/\|(.*)/) || [])[1] || '';
      //handle weird 'rowspan="2" |' syntax
      if (want.match(/. \| /)) {
        //this needs additional cleanup
        want = parseHeading(want);
      }
      want = helpers.trim_whitespace(want) || '';
      //handle the || shorthand..
      if (want.match(/[!\|]{2}/)) {
        want.split(/[!\|]{2}/g).forEach(function (s) {
          s = helpers.trim_whitespace(s);
          table[table.length - 1].push(s);
        });
      } else {
        table[table.length - 1].push(want);
      }
    }
  });
  //remove top one, if it's empty
  if (table[0] && Object.keys(table[0]).length === 0) {
    table.shift();
  }
  //index them by their header
  table = table.map(function (arr) {
    var obj = {};
    arr.forEach(function (a, i) {
      var head = headings[i] || 'col-' + i;
      obj[head] = parseLine(a);
    });
    return obj;
  });
  return table;
};

var findTables = function findTables(r, wiki) {
  var tables = wiki.match(table_reg, '') || [];
  tables = tables.map(function (str) {
    return parse_table(str);
  });
  tables = tables.filter(function (t) {
    return t && t.length > 0;
  });
  if (tables.length > 0) {
    r.tables = tables;
  }
  //remove tables
  wiki = wiki.replace(table_reg, '');
  return wiki;
};
module.exports = findTables;

},{"../../lib/helpers":17,"./sentence/":53}]},{},[14])(14)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29tcG9uZW50LWVtaXR0ZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvanNoYXNoZXMvaGFzaGVzLmpzIiwibm9kZV9tb2R1bGVzL3N1cGVyYWdlbnQvbGliL2FnZW50LWJhc2UuanMiLCJub2RlX21vZHVsZXMvc3VwZXJhZ2VudC9saWIvY2xpZW50LmpzIiwibm9kZV9tb2R1bGVzL3N1cGVyYWdlbnQvbGliL2lzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcmFnZW50L2xpYi9yZXF1ZXN0LWJhc2UuanMiLCJub2RlX21vZHVsZXMvc3VwZXJhZ2VudC9saWIvcmVzcG9uc2UtYmFzZS5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcmFnZW50L2xpYi91dGlscy5qcyIsInBhY2thZ2UuanNvbiIsInNyYy9kYXRhL2FiYnJldmlhdGlvbnMuanMiLCJzcmMvZGF0YS9pMThuLmpzIiwic3JjL2RhdGEvbGFuZ3VhZ2VzLmpzIiwic3JjL2RhdGEvc2l0ZV9tYXAuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbGliL2NvbnZlcnRHZW8uanMiLCJzcmMvbGliL2ZldGNoX3RleHQuanMiLCJzcmMvbGliL2hlbHBlcnMuanMiLCJzcmMvbGliL3JlY3Vyc2l2ZV9tYXRjaC5qcyIsInNyYy9saWIvd2lraWNvbnZlcnQuanMiLCJzcmMvb3V0cHV0L2h0bWwvaW5kZXguanMiLCJzcmMvb3V0cHV0L2h0bWwvaW5mb2JveC5qcyIsInNyYy9vdXRwdXQvaHRtbC9zZW50ZW5jZS5qcyIsInNyYy9vdXRwdXQvaHRtbC90YWJsZS5qcyIsInNyYy9vdXRwdXQvbGF0ZXgvaW5kZXguanMiLCJzcmMvb3V0cHV0L2xhdGV4L2luZm9ib3guanMiLCJzcmMvb3V0cHV0L2xhdGV4L3NlbnRlbmNlLmpzIiwic3JjL291dHB1dC9sYXRleC90YWJsZS5qcyIsInNyYy9vdXRwdXQvbGliLmpzIiwic3JjL291dHB1dC9tYXJrZG93bi9pbmRleC5qcyIsInNyYy9vdXRwdXQvbWFya2Rvd24vaW5mb2JveC5qcyIsInNyYy9vdXRwdXQvbWFya2Rvd24vcGFkLmpzIiwic3JjL291dHB1dC9tYXJrZG93bi9zZW50ZW5jZS5qcyIsInNyYy9vdXRwdXQvbWFya2Rvd24vdGFibGUuanMiLCJzcmMvcGFyc2UvY2F0ZWdvcmllcy5qcyIsInNyYy9wYXJzZS9pbmRleC5qcyIsInNyYy9wYXJzZS9pbmZvYm94L2NpdGF0aW9uLmpzIiwic3JjL3BhcnNlL2luZm9ib3gvaW5kZXguanMiLCJzcmMvcGFyc2UvaW5mb2JveC9pbmZvYm94LmpzIiwic3JjL3BhcnNlL3BhZ2UvZGlzYW1iaWcuanMiLCJzcmMvcGFyc2UvcGFnZS9yZWRpcmVjdHMuanMiLCJzcmMvcGFyc2UvcG9zdFByb2Nlc3MvaW5kZXguanMiLCJzcmMvcGFyc2UvcHJlUHJvY2Vzcy9jb29yZGluYXRlcy5qcyIsInNyYy9wYXJzZS9wcmVQcm9jZXNzL2luZGV4LmpzIiwic3JjL3BhcnNlL3ByZVByb2Nlc3Mva2lsbF94bWwuanMiLCJzcmMvcGFyc2UvcHJlUHJvY2Vzcy93b3JkX3RlbXBsYXRlcy5qcyIsInNyYy9wYXJzZS9zZWN0aW9uL2hlYWRpbmcuanMiLCJzcmMvcGFyc2Uvc2VjdGlvbi9pbWFnZS9pbWFnZS5qcyIsInNyYy9wYXJzZS9zZWN0aW9uL2ltYWdlL2luZGV4LmpzIiwic3JjL3BhcnNlL3NlY3Rpb24vaW5kZXguanMiLCJzcmMvcGFyc2Uvc2VjdGlvbi9saXN0LmpzIiwic3JjL3BhcnNlL3NlY3Rpb24vc2VjdGlvbl90ZW1wbGF0ZXMuanMiLCJzcmMvcGFyc2Uvc2VjdGlvbi9zZW50ZW5jZS9mb3JtYXR0aW5nLmpzIiwic3JjL3BhcnNlL3NlY3Rpb24vc2VudGVuY2UvaW5kZXguanMiLCJzcmMvcGFyc2Uvc2VjdGlvbi9zZW50ZW5jZS9saW5rcy5qcyIsInNyYy9wYXJzZS9zZWN0aW9uL3NlbnRlbmNlL3NlbnRlbmNlLXBhcnNlci5qcyIsInNyYy9wYXJzZS9zZWN0aW9uL3NlbnRlbmNlL3RlbXBsYXRlcy9kYXRlcy5qcyIsInNyYy9wYXJzZS9zZWN0aW9uL3NlbnRlbmNlL3RlbXBsYXRlcy9kZWx0YV9kYXRlLmpzIiwic3JjL3BhcnNlL3NlY3Rpb24vc2VudGVuY2UvdGVtcGxhdGVzL2luZGV4LmpzIiwic3JjL3BhcnNlL3NlY3Rpb24vc2VudGVuY2UvdGVtcGxhdGVzL3BhcnNlcnMuanMiLCJzcmMvcGFyc2Uvc2VjdGlvbi9zZW50ZW5jZS90ZW1wbGF0ZXMvdGVtcGxhdGVzLmpzIiwic3JjL3BhcnNlL3NlY3Rpb24vdGFibGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3J1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeDVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzNEQTtBQUNBLE9BQU8sT0FBUCxHQUFpQixDQUNmLElBRGUsRUFFZixJQUZlLEVBR2YsS0FIZSxFQUlmLElBSmUsRUFLZixJQUxlLEVBTWYsTUFOZSxFQU9mLElBUGUsRUFRZixLQVJlLEVBU2YsTUFUZSxFQVVmLE9BVmUsRUFXZixLQVhlLEVBWWYsS0FaZSxFQWFmLE1BYmUsRUFjZixNQWRlLEVBZWYsS0FmZSxFQWdCZixLQWhCZSxFQWlCZixLQWpCZSxFQWtCZixLQWxCZSxFQW1CZixJQW5CZSxFQW9CZixNQXBCZSxFQXFCZixLQXJCZSxFQXNCZixNQXRCZSxFQXVCZixLQXZCZSxFQXdCZixLQXhCZSxFQXlCZixLQXpCZSxFQTBCZixNQTFCZSxFQTJCZixNQTNCZSxFQTRCZixNQTVCZSxFQTZCZixNQTdCZSxFQThCZixLQTlCZSxFQStCZixLQS9CZSxFQWdDZixJQWhDZSxFQWlDZixNQWpDZSxFQWtDZixLQWxDZSxFQW1DZixJQW5DZSxFQW9DZixLQXBDZSxFQXFDZixNQXJDZSxFQXNDZixJQXRDZSxFQXVDZixJQXZDZSxFQXdDZixNQXhDZSxFQXlDZixLQXpDZSxFQTBDZixJQTFDZSxFQTJDZixJQTNDZSxFQTRDZixNQTVDZSxFQTZDZixJQTdDZSxFQThDZixJQTlDZSxFQStDZixJQS9DZSxFQWdEZixLQWhEZSxFQWlEZixJQWpEZSxFQWtEZixJQWxEZSxFQW1EZixJQW5EZSxFQW9EZixLQXBEZSxFQXFEZixLQXJEZSxFQXNEZixLQXREZSxFQXVEZixNQXZEZSxFQXdEZixLQXhEZSxFQXlEZixLQXpEZSxFQTBEZixPQTFEZSxFQTJEZixLQTNEZSxFQTREZixNQTVEZSxFQTZEZixNQTdEZSxFQThEZixLQTlEZSxFQStEZixLQS9EZSxFQWdFZixLQWhFZSxFQWlFZixJQWpFZSxFQWtFZixLQWxFZSxFQW1FZixJQW5FZSxFQW9FZixLQXBFZSxFQXFFZixLQXJFZSxFQXNFZixJQXRFZSxFQXVFZixLQXZFZSxFQXdFZixNQXhFZSxFQXlFZixLQXpFZSxFQTBFZixJQTFFZSxFQTJFZixJQTNFZSxFQTRFZixJQTVFZSxFQTZFZixJQTdFZSxFQThFZixNQTlFZSxFQStFZixNQS9FZSxFQWdGZixNQWhGZSxFQWlGZixNQWpGZSxFQWtGZixJQWxGZSxFQW1GZixNQW5GZSxFQW9GZixLQXBGZSxFQXFGZixNQXJGZSxFQXNGZixLQXRGZSxFQXVGZixLQXZGZSxFQXdGZixNQXhGZSxFQXlGZixJQXpGZSxFQTBGZixLQTFGZSxFQTJGZixPQTNGZSxFQTRGZixNQTVGZSxFQTZGZixJQTdGZSxFQThGZixL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Q0EsVUFBSSxJQUFKLElBQVksVUFBVSxDQUFWLENBQVo7QUFDRCxLQUhEO0FBSUEsV0FBTyxHQUFQO0FBQ0QsR0FQTyxDQUFSO0FBUUEsU0FBTyxLQUFQO0FBQ0QsQ0E3RkQ7O0FBK0ZBLElBQU0sYUFBYSxTQUFiLFVBQWEsQ0FBUyxDQUFULEVBQVksSUFBWixFQUFrQjtBQUNuQyxNQUFJLFNBQVMsS0FBSyxLQUFMLENBQVcsU0FBWCxFQUFzQixFQUF0QixLQUE2QixFQUExQztBQUNBLFdBQVMsT0FBTyxHQUFQLENBQVcsVUFBUyxHQUFULEVBQWM7QUFDaEMsV0FBTyxZQUFZLEdBQVosQ0FBUDtBQUNELEdBRlEsQ0FBVDtBQUdBLFdBQVMsT0FBTyxNQUFQLENBQWMsVUFBQyxDQUFEO0FBQUEsV0FBTyxLQUFLLEVBQUUsTUFBRixHQUFXLENBQXZCO0FBQUEsR0FBZCxDQUFUO0FBQ0EsTUFBSSxPQUFPLE1BQVAsR0FBZ0IsQ0FBcEIsRUFBdUI7QUFDckIsTUFBRSxNQUFGLEdBQVcsTUFBWDtBQUNEO0FBQ0Q7QUFDQSxTQUFPLEtBQUssT0FBTCxDQUFhLFNBQWIsRUFBd0IsRUFBeEIsQ0FBUDtBQUNBLFNBQU8sSUFBUDtBQUNELENBWkQ7QUFhQSxPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsIlxyXG4vKipcclxuICogRXhwb3NlIGBFbWl0dGVyYC5cclxuICovXHJcblxyXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICBtb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cclxuICpcclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xyXG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcclxuICogQHJldHVybiB7T2JqZWN0fVxyXG4gKiBAYXBpIHByaXZhdGVcclxuICovXHJcblxyXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcclxuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcclxuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcclxuICB9XHJcbiAgcmV0dXJuIG9iajtcclxufVxyXG5cclxuLyoqXHJcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cclxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG4gICh0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSB8fCBbXSlcclxuICAgIC5wdXNoKGZuKTtcclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcclxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgZnVuY3Rpb24gb24oKSB7XHJcbiAgICB0aGlzLm9mZihldmVudCwgb24pO1xyXG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICB9XHJcblxyXG4gIG9uLmZuID0gZm47XHJcbiAgdGhpcy5vbihldmVudCwgb24pO1xyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXHJcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cclxuICogQHJldHVybiB7RW1pdHRlcn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxyXG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuXHJcbiAgLy8gYWxsXHJcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHNwZWNpZmljIGV2ZW50XHJcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XHJcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xyXG5cclxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXHJcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXHJcbiAgdmFyIGNiO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjYiA9IGNhbGxiYWNrc1tpXTtcclxuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XHJcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXHJcbiAgICAsIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XHJcblxyXG4gIGlmIChjYWxsYmFja3MpIHtcclxuICAgIGNhbGxiYWNrcyA9IGNhbGxiYWNrcy5zbGljZSgwKTtcclxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmV0dXJuIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgYGV2ZW50YC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEByZXR1cm4ge0FycmF5fVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcbiAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gfHwgW107XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgcmV0dXJuICEhIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5sZW5ndGg7XHJcbn07XHJcbiIsIi8qKlxuICoganNoYXNoZXMgLSBodHRwczovL2dpdGh1Yi5jb20vaDJub24vanNoYXNoZXNcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBcIk5ldyBCU0RcIiBsaWNlbnNlXG4gKlxuICogQWxnb3JpdGhtcyBzcGVjaWZpY2F0aW9uOlxuICpcbiAqIE1ENSAtIGh0dHA6Ly93d3cuaWV0Zi5vcmcvcmZjL3JmYzEzMjEudHh0XG4gKiBSSVBFTUQtMTYwIC0gaHR0cDovL2hvbWVzLmVzYXQua3VsZXV2ZW4uYmUvfmJvc3NlbGFlL3JpcGVtZDE2MC5odG1sXG4gKiBTSEExICAgLSBodHRwOi8vY3NyYy5uaXN0Lmdvdi9wdWJsaWNhdGlvbnMvZmlwcy9maXBzMTgwLTQvZmlwcy0xODAtNC5wZGZcbiAqIFNIQTI1NiAtIGh0dHA6Ly9jc3JjLm5pc3QuZ292L3B1YmxpY2F0aW9ucy9maXBzL2ZpcHMxODAtNC9maXBzLTE4MC00LnBkZlxuICogU0hBNTEyIC0gaHR0cDovL2NzcmMubmlzdC5nb3YvcHVibGljYXRpb25zL2ZpcHMvZmlwczE4MC00L2ZpcHMtMTgwLTQucGRmXG4gKiBITUFDIC0gaHR0cDovL3d3dy5pZXRmLm9yZy9yZmMvcmZjMjEwNC50eHRcbiAqL1xuKGZ1bmN0aW9uKCkge1xuICB2YXIgSGFzaGVzO1xuXG4gIGZ1bmN0aW9uIHV0ZjhFbmNvZGUoc3RyKSB7XG4gICAgdmFyIHgsIHksIG91dHB1dCA9ICcnLFxuICAgICAgaSA9IC0xLFxuICAgICAgbDtcblxuICAgIGlmIChzdHIgJiYgc3RyLmxlbmd0aCkge1xuICAgICAgbCA9IHN0ci5sZW5ndGg7XG4gICAgICB3aGlsZSAoKGkgKz0gMSkgPCBsKSB7XG4gICAgICAgIC8qIERlY29kZSB1dGYtMTYgc3Vycm9nYXRlIHBhaXJzICovXG4gICAgICAgIHggPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgeSA9IGkgKyAxIDwgbCA/IHN0ci5jaGFyQ29kZUF0KGkgKyAxKSA6IDA7XG4gICAgICAgIGlmICgweEQ4MDAgPD0geCAmJiB4IDw9IDB4REJGRiAmJiAweERDMDAgPD0geSAmJiB5IDw9IDB4REZGRikge1xuICAgICAgICAgIHggPSAweDEwMDAwICsgKCh4ICYgMHgwM0ZGKSA8PCAxMCkgKyAoeSAmIDB4MDNGRik7XG4gICAgICAgICAgaSArPSAxO1xuICAgICAgICB9XG4gICAgICAgIC8qIEVuY29kZSBvdXRwdXQgYXMgdXRmLTggKi9cbiAgICAgICAgaWYgKHggPD0gMHg3Rikge1xuICAgICAgICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHgpO1xuICAgICAgICB9IGVsc2UgaWYgKHggPD0gMHg3RkYpIHtcbiAgICAgICAgICBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgweEMwIHwgKCh4ID4+PiA2KSAmIDB4MUYpLFxuICAgICAgICAgICAgMHg4MCB8ICh4ICYgMHgzRikpO1xuICAgICAgICB9IGVsc2UgaWYgKHggPD0gMHhGRkZGKSB7XG4gICAgICAgICAgb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhFMCB8ICgoeCA+Pj4gMTIpICYgMHgwRiksXG4gICAgICAgICAgICAweDgwIHwgKCh4ID4+PiA2KSAmIDB4M0YpLFxuICAgICAgICAgICAgMHg4MCB8ICh4ICYgMHgzRikpO1xuICAgICAgICB9IGVsc2UgaWYgKHggPD0gMHgxRkZGRkYpIHtcbiAgICAgICAgICBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgweEYwIHwgKCh4ID4+PiAxOCkgJiAweDA3KSxcbiAgICAgICAgICAgIDB4ODAgfCAoKHggPj4+IDEyKSAmIDB4M0YpLFxuICAgICAgICAgICAgMHg4MCB8ICgoeCA+Pj4gNikgJiAweDNGKSxcbiAgICAgICAgICAgIDB4ODAgfCAoeCAmIDB4M0YpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgZnVuY3Rpb24gdXRmOERlY29kZShzdHIpIHtcbiAgICB2YXIgaSwgYWMsIGMxLCBjMiwgYzMsIGFyciA9IFtdLFxuICAgICAgbDtcbiAgICBpID0gYWMgPSBjMSA9IGMyID0gYzMgPSAwO1xuXG4gICAgaWYgKHN0ciAmJiBzdHIubGVuZ3RoKSB7XG4gICAgICBsID0gc3RyLmxlbmd0aDtcbiAgICAgIHN0ciArPSAnJztcblxuICAgICAgd2hpbGUgKGkgPCBsKSB7XG4gICAgICAgIGMxID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGFjICs9IDE7XG4gICAgICAgIGlmIChjMSA8IDEyOCkge1xuICAgICAgICAgIGFyclthY10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMxKTtcbiAgICAgICAgICBpICs9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoYzEgPiAxOTEgJiYgYzEgPCAyMjQpIHtcbiAgICAgICAgICBjMiA9IHN0ci5jaGFyQ29kZUF0KGkgKyAxKTtcbiAgICAgICAgICBhcnJbYWNdID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMxICYgMzEpIDw8IDYpIHwgKGMyICYgNjMpKTtcbiAgICAgICAgICBpICs9IDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYzIgPSBzdHIuY2hhckNvZGVBdChpICsgMSk7XG4gICAgICAgICAgYzMgPSBzdHIuY2hhckNvZGVBdChpICsgMik7XG4gICAgICAgICAgYXJyW2FjXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjMSAmIDE1KSA8PCAxMikgfCAoKGMyICYgNjMpIDw8IDYpIHwgKGMzICYgNjMpKTtcbiAgICAgICAgICBpICs9IDM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFyci5qb2luKCcnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgaW50ZWdlcnMsIHdyYXBwaW5nIGF0IDJeMzIuIFRoaXMgdXNlcyAxNi1iaXQgb3BlcmF0aW9ucyBpbnRlcm5hbGx5XG4gICAqIHRvIHdvcmsgYXJvdW5kIGJ1Z3MgaW4gc29tZSBKUyBpbnRlcnByZXRlcnMuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHNhZmVfYWRkKHgsIHkpIHtcbiAgICB2YXIgbHN3ID0gKHggJiAweEZGRkYpICsgKHkgJiAweEZGRkYpLFxuICAgICAgbXN3ID0gKHggPj4gMTYpICsgKHkgPj4gMTYpICsgKGxzdyA+PiAxNik7XG4gICAgcmV0dXJuIChtc3cgPDwgMTYpIHwgKGxzdyAmIDB4RkZGRik7XG4gIH1cblxuICAvKipcbiAgICogQml0d2lzZSByb3RhdGUgYSAzMi1iaXQgbnVtYmVyIHRvIHRoZSBsZWZ0LlxuICAgKi9cblxuICBmdW5jdGlvbiBiaXRfcm9sKG51bSwgY250KSB7XG4gICAgcmV0dXJuIChudW0gPDwgY250KSB8IChudW0gPj4+ICgzMiAtIGNudCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYSByYXcgc3RyaW5nIHRvIGEgaGV4IHN0cmluZ1xuICAgKi9cblxuICBmdW5jdGlvbiByc3RyMmhleChpbnB1dCwgaGV4Y2FzZSkge1xuICAgIHZhciBoZXhfdGFiID0gaGV4Y2FzZSA/ICcwMTIzNDU2Nzg5QUJDREVGJyA6ICcwMTIzNDU2Nzg5YWJjZGVmJyxcbiAgICAgIG91dHB1dCA9ICcnLFxuICAgICAgeCwgaSA9IDAsXG4gICAgICBsID0gaW5wdXQubGVuZ3RoO1xuICAgIGZvciAoOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICB4ID0gaW5wdXQuY2hhckNvZGVBdChpKTtcbiAgICAgIG91dHB1dCArPSBoZXhfdGFiLmNoYXJBdCgoeCA+Pj4gNCkgJiAweDBGKSArIGhleF90YWIuY2hhckF0KHggJiAweDBGKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbmNvZGUgYSBzdHJpbmcgYXMgdXRmLTE2XG4gICAqL1xuXG4gIGZ1bmN0aW9uIHN0cjJyc3RyX3V0ZjE2bGUoaW5wdXQpIHtcbiAgICB2YXIgaSwgbCA9IGlucHV0Lmxlbmd0aCxcbiAgICAgIG91dHB1dCA9ICcnO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGlucHV0LmNoYXJDb2RlQXQoaSkgJiAweEZGLCAoaW5wdXQuY2hhckNvZGVBdChpKSA+Pj4gOCkgJiAweEZGKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0cjJyc3RyX3V0ZjE2YmUoaW5wdXQpIHtcbiAgICB2YXIgaSwgbCA9IGlucHV0Lmxlbmd0aCxcbiAgICAgIG91dHB1dCA9ICcnO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChpbnB1dC5jaGFyQ29kZUF0KGkpID4+PiA4KSAmIDB4RkYsIGlucHV0LmNoYXJDb2RlQXQoaSkgJiAweEZGKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGFuIGFycmF5IG9mIGJpZy1lbmRpYW4gd29yZHMgdG8gYSBzdHJpbmdcbiAgICovXG5cbiAgZnVuY3Rpb24gYmluYjJyc3RyKGlucHV0KSB7XG4gICAgdmFyIGksIGwgPSBpbnB1dC5sZW5ndGggKiAzMixcbiAgICAgIG91dHB1dCA9ICcnO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDgpIHtcbiAgICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChpbnB1dFtpID4+IDVdID4+PiAoMjQgLSBpICUgMzIpKSAmIDB4RkYpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYW4gYXJyYXkgb2YgbGl0dGxlLWVuZGlhbiB3b3JkcyB0byBhIHN0cmluZ1xuICAgKi9cblxuICBmdW5jdGlvbiBiaW5sMnJzdHIoaW5wdXQpIHtcbiAgICB2YXIgaSwgbCA9IGlucHV0Lmxlbmd0aCAqIDMyLFxuICAgICAgb3V0cHV0ID0gJyc7XG4gICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gOCkge1xuICAgICAgb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGlucHV0W2kgPj4gNV0gPj4+IChpICUgMzIpKSAmIDB4RkYpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYSByYXcgc3RyaW5nIHRvIGFuIGFycmF5IG9mIGxpdHRsZS1lbmRpYW4gd29yZHNcbiAgICogQ2hhcmFjdGVycyA+MjU1IGhhdmUgdGhlaXIgaGlnaC1ieXRlIHNpbGVudGx5IGlnbm9yZWQuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJzdHIyYmlubChpbnB1dCkge1xuICAgIHZhciBpLCBsID0gaW5wdXQubGVuZ3RoICogOCxcbiAgICAgIG91dHB1dCA9IEFycmF5KGlucHV0Lmxlbmd0aCA+PiAyKSxcbiAgICAgIGxvID0gb3V0cHV0Lmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbG87IGkgKz0gMSkge1xuICAgICAgb3V0cHV0W2ldID0gMDtcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gOCkge1xuICAgICAgb3V0cHV0W2kgPj4gNV0gfD0gKGlucHV0LmNoYXJDb2RlQXQoaSAvIDgpICYgMHhGRikgPDwgKGkgJSAzMik7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBhIHJhdyBzdHJpbmcgdG8gYW4gYXJyYXkgb2YgYmlnLWVuZGlhbiB3b3Jkc1xuICAgKiBDaGFyYWN0ZXJzID4yNTUgaGF2ZSB0aGVpciBoaWdoLWJ5dGUgc2lsZW50bHkgaWdub3JlZC5cbiAgICovXG5cbiAgZnVuY3Rpb24gcnN0cjJiaW5iKGlucHV0KSB7XG4gICAgdmFyIGksIGwgPSBpbnB1dC5sZW5ndGggKiA4LFxuICAgICAgb3V0cHV0ID0gQXJyYXkoaW5wdXQubGVuZ3RoID4+IDIpLFxuICAgICAgbG8gPSBvdXRwdXQubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsbzsgaSArPSAxKSB7XG4gICAgICBvdXRwdXRbaV0gPSAwO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSA4KSB7XG4gICAgICBvdXRwdXRbaSA+PiA1XSB8PSAoaW5wdXQuY2hhckNvZGVBdChpIC8gOCkgJiAweEZGKSA8PCAoMjQgLSBpICUgMzIpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYSByYXcgc3RyaW5nIHRvIGFuIGFyYml0cmFyeSBzdHJpbmcgZW5jb2RpbmdcbiAgICovXG5cbiAgZnVuY3Rpb24gcnN0cjJhbnkoaW5wdXQsIGVuY29kaW5nKSB7XG4gICAgdmFyIGRpdmlzb3IgPSBlbmNvZGluZy5sZW5ndGgsXG4gICAgICByZW1haW5kZXJzID0gQXJyYXkoKSxcbiAgICAgIGksIHEsIHgsIGxkLCBxdW90aWVudCwgZGl2aWRlbmQsIG91dHB1dCwgZnVsbF9sZW5ndGg7XG5cbiAgICAvKiBDb252ZXJ0IHRvIGFuIGFycmF5IG9mIDE2LWJpdCBiaWctZW5kaWFuIHZhbHVlcywgZm9ybWluZyB0aGUgZGl2aWRlbmQgKi9cbiAgICBkaXZpZGVuZCA9IEFycmF5KE1hdGguY2VpbChpbnB1dC5sZW5ndGggLyAyKSk7XG4gICAgbGQgPSBkaXZpZGVuZC5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxkOyBpICs9IDEpIHtcbiAgICAgIGRpdmlkZW5kW2ldID0gKGlucHV0LmNoYXJDb2RlQXQoaSAqIDIpIDw8IDgpIHwgaW5wdXQuY2hhckNvZGVBdChpICogMiArIDEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlcGVhdGVkbHkgcGVyZm9ybSBhIGxvbmcgZGl2aXNpb24uIFRoZSBiaW5hcnkgYXJyYXkgZm9ybXMgdGhlIGRpdmlkZW5kLFxuICAgICAqIHRoZSBsZW5ndGggb2YgdGhlIGVuY29kaW5nIGlzIHRoZSBkaXZpc29yLiBPbmNlIGNvbXB1dGVkLCB0aGUgcXVvdGllbnRcbiAgICAgKiBmb3JtcyB0aGUgZGl2aWRlbmQgZm9yIHRoZSBuZXh0IHN0ZXAuIFdlIHN0b3Agd2hlbiB0aGUgZGl2aWRlbmQgaXMgemVySGFzaGVzLlxuICAgICAqIEFsbCByZW1haW5kZXJzIGFyZSBzdG9yZWQgZm9yIGxhdGVyIHVzZS5cbiAgICAgKi9cbiAgICB3aGlsZSAoZGl2aWRlbmQubGVuZ3RoID4gMCkge1xuICAgICAgcXVvdGllbnQgPSBBcnJheSgpO1xuICAgICAgeCA9IDA7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZGl2aWRlbmQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgeCA9ICh4IDw8IDE2KSArIGRpdmlkZW5kW2ldO1xuICAgICAgICBxID0gTWF0aC5mbG9vcih4IC8gZGl2aXNvcik7XG4gICAgICAgIHggLT0gcSAqIGRpdmlzb3I7XG4gICAgICAgIGlmIChxdW90aWVudC5sZW5ndGggPiAwIHx8IHEgPiAwKSB7XG4gICAgICAgICAgcXVvdGllbnRbcXVvdGllbnQubGVuZ3RoXSA9IHE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlbWFpbmRlcnNbcmVtYWluZGVycy5sZW5ndGhdID0geDtcbiAgICAgIGRpdmlkZW5kID0gcXVvdGllbnQ7XG4gICAgfVxuXG4gICAgLyogQ29udmVydCB0aGUgcmVtYWluZGVycyB0byB0aGUgb3V0cHV0IHN0cmluZyAqL1xuICAgIG91dHB1dCA9ICcnO1xuICAgIGZvciAoaSA9IHJlbWFpbmRlcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIG91dHB1dCArPSBlbmNvZGluZy5jaGFyQXQocmVtYWluZGVyc1tpXSk7XG4gICAgfVxuXG4gICAgLyogQXBwZW5kIGxlYWRpbmcgemVybyBlcXVpdmFsZW50cyAqL1xuICAgIGZ1bGxfbGVuZ3RoID0gTWF0aC5jZWlsKGlucHV0Lmxlbmd0aCAqIDggLyAoTWF0aC5sb2coZW5jb2RpbmcubGVuZ3RoKSAvIE1hdGgubG9nKDIpKSk7XG4gICAgZm9yIChpID0gb3V0cHV0Lmxlbmd0aDsgaSA8IGZ1bGxfbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIG91dHB1dCA9IGVuY29kaW5nWzBdICsgb3V0cHV0O1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYSByYXcgc3RyaW5nIHRvIGEgYmFzZS02NCBzdHJpbmdcbiAgICovXG5cbiAgZnVuY3Rpb24gcnN0cjJiNjQoaW5wdXQsIGI2NHBhZCkge1xuICAgIHZhciB0YWIgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLycsXG4gICAgICBvdXRwdXQgPSAnJyxcbiAgICAgIGxlbiA9IGlucHV0Lmxlbmd0aCxcbiAgICAgIGksIGosIHRyaXBsZXQ7XG4gICAgYjY0cGFkID0gYjY0cGFkIHx8ICc9JztcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDMpIHtcbiAgICAgIHRyaXBsZXQgPSAoaW5wdXQuY2hhckNvZGVBdChpKSA8PCAxNikgfCAoaSArIDEgPCBsZW4gPyBpbnB1dC5jaGFyQ29kZUF0KGkgKyAxKSA8PCA4IDogMCkgfCAoaSArIDIgPCBsZW4gPyBpbnB1dC5jaGFyQ29kZUF0KGkgKyAyKSA6IDApO1xuICAgICAgZm9yIChqID0gMDsgaiA8IDQ7IGogKz0gMSkge1xuICAgICAgICBpZiAoaSAqIDggKyBqICogNiA+IGlucHV0Lmxlbmd0aCAqIDgpIHtcbiAgICAgICAgICBvdXRwdXQgKz0gYjY0cGFkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dHB1dCArPSB0YWIuY2hhckF0KCh0cmlwbGV0ID4+PiA2ICogKDMgLSBqKSkgJiAweDNGKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgSGFzaGVzID0ge1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB2ZXJzaW9uXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgVkVSU0lPTjogJzEuMC42JyxcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIEhhc2hlc1xuICAgICAqIEBjbGFzcyBCYXNlNjRcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBCYXNlNjQ6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gcHJpdmF0ZSBwcm9wZXJ0aWVzXG4gICAgICB2YXIgdGFiID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nLFxuICAgICAgICBwYWQgPSAnPScsIC8vIGRlZmF1bHQgcGFkIGFjY29yZGluZyB3aXRoIHRoZSBSRkMgc3RhbmRhcmRcbiAgICAgICAgdXJsID0gZmFsc2UsIC8vIFVSTCBlbmNvZGluZyBzdXBwb3J0IEB0b2RvXG4gICAgICAgIHV0ZjggPSB0cnVlOyAvLyBieSBkZWZhdWx0IGVuYWJsZSBVVEYtOCBzdXBwb3J0IGVuY29kaW5nXG5cbiAgICAgIC8vIHB1YmxpYyBtZXRob2QgZm9yIGVuY29kaW5nXG4gICAgICB0aGlzLmVuY29kZSA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBpLCBqLCB0cmlwbGV0LFxuICAgICAgICAgIG91dHB1dCA9ICcnLFxuICAgICAgICAgIGxlbiA9IGlucHV0Lmxlbmd0aDtcblxuICAgICAgICBwYWQgPSBwYWQgfHwgJz0nO1xuICAgICAgICBpbnB1dCA9ICh1dGY4KSA/IHV0ZjhFbmNvZGUoaW5wdXQpIDogaW5wdXQ7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAzKSB7XG4gICAgICAgICAgdHJpcGxldCA9IChpbnB1dC5jaGFyQ29kZUF0KGkpIDw8IDE2KSB8IChpICsgMSA8IGxlbiA/IGlucHV0LmNoYXJDb2RlQXQoaSArIDEpIDw8IDggOiAwKSB8IChpICsgMiA8IGxlbiA/IGlucHV0LmNoYXJDb2RlQXQoaSArIDIpIDogMCk7XG4gICAgICAgICAgZm9yIChqID0gMDsgaiA8IDQ7IGogKz0gMSkge1xuICAgICAgICAgICAgaWYgKGkgKiA4ICsgaiAqIDYgPiBsZW4gKiA4KSB7XG4gICAgICAgICAgICAgIG91dHB1dCArPSBwYWQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBvdXRwdXQgKz0gdGFiLmNoYXJBdCgodHJpcGxldCA+Pj4gNiAqICgzIC0gaikpICYgMHgzRik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICB9O1xuXG4gICAgICAvLyBwdWJsaWMgbWV0aG9kIGZvciBkZWNvZGluZ1xuICAgICAgdGhpcy5kZWNvZGUgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICAvLyB2YXIgYjY0ID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89JztcbiAgICAgICAgdmFyIGksIG8xLCBvMiwgbzMsIGgxLCBoMiwgaDMsIGg0LCBiaXRzLCBhYyxcbiAgICAgICAgICBkZWMgPSAnJyxcbiAgICAgICAgICBhcnIgPSBbXTtcbiAgICAgICAgaWYgKCFpbnB1dCkge1xuICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGkgPSBhYyA9IDA7XG4gICAgICAgIGlucHV0ID0gaW5wdXQucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcJyArIHBhZCwgJ2dpJyksICcnKTsgLy8gdXNlICc9J1xuICAgICAgICAvL2lucHV0ICs9ICcnO1xuXG4gICAgICAgIGRvIHsgLy8gdW5wYWNrIGZvdXIgaGV4ZXRzIGludG8gdGhyZWUgb2N0ZXRzIHVzaW5nIGluZGV4IHBvaW50cyBpbiBiNjRcbiAgICAgICAgICBoMSA9IHRhYi5pbmRleE9mKGlucHV0LmNoYXJBdChpICs9IDEpKTtcbiAgICAgICAgICBoMiA9IHRhYi5pbmRleE9mKGlucHV0LmNoYXJBdChpICs9IDEpKTtcbiAgICAgICAgICBoMyA9IHRhYi5pbmRleE9mKGlucHV0LmNoYXJBdChpICs9IDEpKTtcbiAgICAgICAgICBoNCA9IHRhYi5pbmRleE9mKGlucHV0LmNoYXJBdChpICs9IDEpKTtcblxuICAgICAgICAgIGJpdHMgPSBoMSA8PCAxOCB8IGgyIDw8IDEyIHwgaDMgPDwgNiB8IGg0O1xuXG4gICAgICAgICAgbzEgPSBiaXRzID4+IDE2ICYgMHhmZjtcbiAgICAgICAgICBvMiA9IGJpdHMgPj4gOCAmIDB4ZmY7XG4gICAgICAgICAgbzMgPSBiaXRzICYgMHhmZjtcbiAgICAgICAgICBhYyArPSAxO1xuXG4gICAgICAgICAgaWYgKGgzID09PSA2NCkge1xuICAgICAgICAgICAgYXJyW2FjXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUobzEpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaDQgPT09IDY0KSB7XG4gICAgICAgICAgICBhcnJbYWNdID0gU3RyaW5nLmZyb21DaGFyQ29kZShvMSwgbzIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcnJbYWNdID0gU3RyaW5nLmZyb21DaGFyQ29kZShvMSwgbzIsIG8zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKGkgPCBpbnB1dC5sZW5ndGgpO1xuXG4gICAgICAgIGRlYyA9IGFyci5qb2luKCcnKTtcbiAgICAgICAgZGVjID0gKHV0ZjgpID8gdXRmOERlY29kZShkZWMpIDogZGVjO1xuXG4gICAgICAgIHJldHVybiBkZWM7XG4gICAgICB9O1xuXG4gICAgICAvLyBzZXQgY3VzdG9tIHBhZCBzdHJpbmdcbiAgICAgIHRoaXMuc2V0UGFkID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgIHBhZCA9IHN0ciB8fCBwYWQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICAgIC8vIHNldCBjdXN0b20gdGFiIHN0cmluZyBjaGFyYWN0ZXJzXG4gICAgICB0aGlzLnNldFRhYiA9IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICB0YWIgPSBzdHIgfHwgdGFiO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgICB0aGlzLnNldFVURjggPSBmdW5jdGlvbihib29sKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYm9vbCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgdXRmOCA9IGJvb2w7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDUkMtMzIgY2FsY3VsYXRpb25cbiAgICAgKiBAbWVtYmVyIEhhc2hlc1xuICAgICAqIEBtZXRob2QgQ1JDMzJcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBJbnB1dCBTdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgQ1JDMzI6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgdmFyIGNyYyA9IDAsXG4gICAgICAgIHggPSAwLFxuICAgICAgICB5ID0gMCxcbiAgICAgICAgdGFibGUsIGksIGlUb3A7XG4gICAgICBzdHIgPSB1dGY4RW5jb2RlKHN0cik7XG5cbiAgICAgIHRhYmxlID0gW1xuICAgICAgICAnMDAwMDAwMDAgNzcwNzMwOTYgRUUwRTYxMkMgOTkwOTUxQkEgMDc2REM0MTkgNzA2QUY0OEYgRTk2M0E1MzUgOUU2NDk1QTMgMEVEQjg4MzIgJyxcbiAgICAgICAgJzc5RENCOEE0IEUwRDVFOTFFIDk3RDJEOTg4IDA5QjY0QzJCIDdFQjE3Q0JEIEU3QjgyRDA3IDkwQkYxRDkxIDFEQjcxMDY0IDZBQjAyMEYyIEYzQjk3MTQ4ICcsXG4gICAgICAgICc4NEJFNDFERSAxQURBRDQ3RCA2RERERTRFQiBGNEQ0QjU1MSA4M0QzODVDNyAxMzZDOTg1NiA2NDZCQThDMCBGRDYyRjk3QSA4QTY1QzlFQyAxNDAxNUM0RiAnLFxuICAgICAgICAnNjMwNjZDRDkgRkEwRjNENjMgOEQwODBERjUgM0I2RTIwQzggNEM2OTEwNUUgRDU2MDQxRTQgQTI2NzcxNzIgM0MwM0U0RDEgNEIwNEQ0NDcgRDIwRDg1RkQgJyxcbiAgICAgICAgJ0E1MEFCNTZCIDM1QjVBOEZBIDQyQjI5ODZDIERCQkJDOUQ2IEFDQkNGOTQwIDMyRDg2Q0UzIDQ1REY1Qzc1IERDRDYwRENGIEFCRDEzRDU5IDI2RDkzMEFDICcsXG4gICAgICAgICc1MURFMDAzQSBDOEQ3NTE4MCBCRkQwNjExNiAyMUI0RjRCNSA1NkIzQzQyMyBDRkJBOTU5OSBCOEJEQTUwRiAyODAyQjg5RSA1RjA1ODgwOCBDNjBDRDlCMiAnLFxuICAgICAgICAnQjEwQkU5MjQgMkY2RjdDODcgNTg2ODRDMTEgQzE2MTFEQUIgQjY2NjJEM0QgNzZEQzQxOTAgMDFEQjcxMDYgOThEMjIwQkMgRUZENTEwMkEgNzFCMTg1ODkgJyxcbiAgICAgICAgJzA2QjZCNTFGIDlGQkZFNEE1IEU4QjhENDMzIDc4MDdDOUEyIDBGMDBGOTM0IDk2MDlBODhFIEUxMEU5ODE4IDdGNkEwREJCIDA4NkQzRDJEIDkxNjQ2Qzk3ICcsXG4gICAgICAgICdFNjYzNUMwMSA2QjZCNTFGNCAxQzZDNjE2MiA4NTY1MzBEOCBGMjYyMDA0RSA2QzA2OTVFRCAxQjAxQTU3QiA4MjA4RjRDMSBGNTBGQzQ1NyA2NUIwRDlDNiAnLFxuICAgICAgICAnMTJCN0U5NTAgOEJCRUI4RUEgRkNCOTg4N0MgNjJERDFEREYgMTVEQTJENDkgOENEMzdDRjMgRkJENDRDNjUgNERCMjYxNTggM0FCNTUxQ0UgQTNCQzAwNzQgJyxcbiAgICAgICAgJ0Q0QkIzMEUyIDRBREZBNTQxIDNERDg5NUQ3IEE0RDFDNDZEIEQzRDZGNEZCIDQzNjlFOTZBIDM0NkVEOUZDIEFENjc4ODQ2IERBNjBCOEQwIDQ0MDQyRDczICcsXG4gICAgICAgICczMzAzMURFNSBBQTBBNEM1RiBERDBEN0NDOSA1MDA1NzEzQyAyNzAyNDFBQSBCRTBCMTAxMCBDOTBDMjA4NiA1NzY4QjUyNSAyMDZGODVCMyBCOTY2RDQwOSAnLFxuICAgICAgICAnQ0U2MUU0OUYgNUVERUY5MEUgMjlEOUM5OTggQjBEMDk4MjIgQzdEN0E4QjQgNTlCMzNEMTcgMkVCNDBEODEgQjdCRDVDM0IgQzBCQTZDQUQgRURCODgzMjAgJyxcbiAgICAgICAgJzlBQkZCM0I2IDAzQjZFMjBDIDc0QjFEMjlBIEVBRDU0NzM5IDlERDI3N0FGIDA0REIyNjE1IDczREMxNjgzIEUzNjMwQjEyIDk0NjQzQjg0IDBENkQ2QTNFICcsXG4gICAgICAgICc3QTZBNUFBOCBFNDBFQ0YwQiA5MzA5RkY5RCAwQTAwQUUyNyA3RDA3OUVCMSBGMDBGOTM0NCA4NzA4QTNEMiAxRTAxRjI2OCA2OTA2QzJGRSBGNzYyNTc1RCAnLFxuICAgICAgICAnODA2NTY3Q0IgMTk2QzM2NzEgNkU2QjA2RTcgRkVENDFCNzYgODlEMzJCRTAgMTBEQTdBNUEgNjdERDRBQ0MgRjlCOURGNkYgOEVCRUVGRjkgMTdCN0JFNDMgJyxcbiAgICAgICAgJzYwQjA4RUQ1IEQ2RDZBM0U4IEExRDE5MzdFIDM4RDhDMkM0IDRGREZGMjUyIEQxQkI2N0YxIEE2QkM1NzY3IDNGQjUwNkREIDQ4QjIzNjRCIEQ4MEQyQkRBICcsXG4gICAgICAgICdBRjBBMUI0QyAzNjAzNEFGNiA0MTA0N0E2MCBERjYwRUZDMyBBODY3REY1NSAzMTZFOEVFRiA0NjY5QkU3OSBDQjYxQjM4QyBCQzY2ODMxQSAyNTZGRDJBMCAnLFxuICAgICAgICAnNTI2OEUyMzYgQ0MwQzc3OTUgQkIwQjQ3MDMgMjIwMjE2QjkgNTUwNTI2MkYgQzVCQTNCQkUgQjJCRDBCMjggMkJCNDVBOTIgNUNCMzZBMDQgQzJEN0ZGQTcgJyxcbiAgICAgICAgJ0I1RDBDRjMxIDJDRDk5RThCIDVCREVBRTFEIDlCNjRDMkIwIEVDNjNGMjI2IDc1NkFBMzlDIDAyNkQ5MzBBIDlDMDkwNkE5IEVCMEUzNjNGIDcyMDc2Nzg1ICcsXG4gICAgICAgICcwNTAwNTcxMyA5NUJGNEE4MiBFMkI4N0ExNCA3QkIxMkJBRSAwQ0I2MUIzOCA5MkQyOEU5QiBFNUQ1QkUwRCA3Q0RDRUZCNyAwQkRCREYyMSA4NkQzRDJENCAnLFxuICAgICAgICAnRjFENEUyNDIgNjhEREIzRjggMUZEQTgzNkUgODFCRTE2Q0QgRjZCOTI2NUIgNkZCMDc3RTEgMThCNzQ3NzcgODgwODVBRTYgRkYwRjZBNzAgNjYwNjNCQ0EgJyxcbiAgICAgICAgJzExMDEwQjVDIDhGNjU5RUZGIEY4NjJBRTY5IDYxNkJGRkQzIDE2NkNDRjQ1IEEwMEFFMjc4IEQ3MEREMkVFIDRFMDQ4MzU0IDM5MDNCM0MyIEE3NjcyNjYxICcsXG4gICAgICAgICdEMDYwMTZGNyA0OTY5NDc0RCAzRTZFNzdEQiBBRUQxNkE0QSBEOUQ2NUFEQyA0MERGMEI2NiAzN0Q4M0JGMCBBOUJDQUU1MyBERUJCOUVDNSA0N0IyQ0Y3RiAnLFxuICAgICAgICAnMzBCNUZGRTkgQkRCREYyMUMgQ0FCQUMyOEEgNTNCMzkzMzAgMjRCNEEzQTYgQkFEMDM2MDUgQ0RENzA2OTMgNTRERTU3MjkgMjNEOTY3QkYgQjM2NjdBMkUgJyxcbiAgICAgICAgJ0M0NjE0QUI4IDVENjgxQjAyIDJBNkYyQjk0IEI0MEJCRTM3IEMzMEM4RUExIDVBMDVERjFCIDJEMDJFRjhEJ1xuICAgICAgXS5qb2luKCcnKTtcblxuICAgICAgY3JjID0gY3JjIF4gKC0xKTtcbiAgICAgIGZvciAoaSA9IDAsIGlUb3AgPSBzdHIubGVuZ3RoOyBpIDwgaVRvcDsgaSArPSAxKSB7XG4gICAgICAgIHkgPSAoY3JjIF4gc3RyLmNoYXJDb2RlQXQoaSkpICYgMHhGRjtcbiAgICAgICAgeCA9ICcweCcgKyB0YWJsZS5zdWJzdHIoeSAqIDksIDgpO1xuICAgICAgICBjcmMgPSAoY3JjID4+PiA4KSBeIHg7XG4gICAgICB9XG4gICAgICAvLyBhbHdheXMgcmV0dXJuIGEgcG9zaXRpdmUgbnVtYmVyICh0aGF0J3Mgd2hhdCA+Pj4gMCBkb2VzKVxuICAgICAgcmV0dXJuIChjcmMgXiAoLTEpKSA+Pj4gMDtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgSGFzaGVzXG4gICAgICogQGNsYXNzIE1ENVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnXVxuICAgICAqXG4gICAgICogQSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBSU0EgRGF0YSBTZWN1cml0eSwgSW5jLiBNRDUgTWVzc2FnZVxuICAgICAqIERpZ2VzdCBBbGdvcml0aG0sIGFzIGRlZmluZWQgaW4gUkZDIDEzMjEuXG4gICAgICogVmVyc2lvbiAyLjIgQ29weXJpZ2h0IChDKSBQYXVsIEpvaG5zdG9uIDE5OTkgLSAyMDA5XG4gICAgICogT3RoZXIgY29udHJpYnV0b3JzOiBHcmVnIEhvbHQsIEFuZHJldyBLZXBlcnQsIFlkbmFyLCBMb3N0aW5ldFxuICAgICAqIFNlZSA8aHR0cDovL3BhamhvbWUub3JnLnVrL2NyeXB0L21kNT4gZm9yIG1vcmUgaW5mSGFzaGVzLlxuICAgICAqL1xuICAgIE1ENTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgLyoqXG4gICAgICAgKiBQcml2YXRlIGNvbmZpZyBwcm9wZXJ0aWVzLiBZb3UgbWF5IG5lZWQgdG8gdHdlYWsgdGhlc2UgdG8gYmUgY29tcGF0aWJsZSB3aXRoXG4gICAgICAgKiB0aGUgc2VydmVyLXNpZGUsIGJ1dCB0aGUgZGVmYXVsdHMgd29yayBpbiBtb3N0IGNhc2VzLlxuICAgICAgICogU2VlIHtAbGluayBIYXNoZXMuTUQ1I21ldGhvZC1zZXRVcHBlckNhc2V9IGFuZCB7QGxpbmsgSGFzaGVzLlNIQTEjbWV0aG9kLXNldFVwcGVyQ2FzZX1cbiAgICAgICAqL1xuICAgICAgdmFyIGhleGNhc2UgPSAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy51cHBlcmNhc2UgPT09ICdib29sZWFuJykgPyBvcHRpb25zLnVwcGVyY2FzZSA6IGZhbHNlLCAvLyBoZXhhZGVjaW1hbCBvdXRwdXQgY2FzZSBmb3JtYXQuIGZhbHNlIC0gbG93ZXJjYXNlOyB0cnVlIC0gdXBwZXJjYXNlXG4gICAgICAgIGI2NHBhZCA9IChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnBhZCA9PT0gJ3N0cmluZycpID8gb3B0aW9ucy5wYWQgOiAnPScsIC8vIGJhc2UtNjQgcGFkIGNoYXJhY3Rlci4gRGVmYXVsdHMgdG8gJz0nIGZvciBzdHJpY3QgUkZDIGNvbXBsaWFuY2VcbiAgICAgICAgdXRmOCA9IChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnV0ZjggPT09ICdib29sZWFuJykgPyBvcHRpb25zLnV0ZjggOiB0cnVlOyAvLyBlbmFibGUvZGlzYWJsZSB1dGY4IGVuY29kaW5nXG5cbiAgICAgIC8vIHByaXZpbGVnZWQgKHB1YmxpYykgbWV0aG9kc1xuICAgICAgdGhpcy5oZXggPSBmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiByc3RyMmhleChyc3RyKHMsIHV0ZjgpLCBoZXhjYXNlKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmI2NCA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYjY0KHJzdHIocyksIGI2NHBhZCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5hbnkgPSBmdW5jdGlvbihzLCBlKSB7XG4gICAgICAgIHJldHVybiByc3RyMmFueShyc3RyKHMsIHV0ZjgpLCBlKTtcbiAgICAgIH07XG4gICAgICB0aGlzLnJhdyA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIocywgdXRmOCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5oZXhfaG1hYyA9IGZ1bmN0aW9uKGssIGQpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyaGV4KHJzdHJfaG1hYyhrLCBkKSwgaGV4Y2FzZSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5iNjRfaG1hYyA9IGZ1bmN0aW9uKGssIGQpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYjY0KHJzdHJfaG1hYyhrLCBkKSwgYjY0cGFkKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmFueV9obWFjID0gZnVuY3Rpb24oaywgZCwgZSkge1xuICAgICAgICByZXR1cm4gcnN0cjJhbnkocnN0cl9obWFjKGssIGQpLCBlKTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFBlcmZvcm0gYSBzaW1wbGUgc2VsZi10ZXN0IHRvIHNlZSBpZiB0aGUgVk0gaXMgd29ya2luZ1xuICAgICAgICogQHJldHVybiB7U3RyaW5nfSBIZXhhZGVjaW1hbCBoYXNoIHNhbXBsZVxuICAgICAgICovXG4gICAgICB0aGlzLnZtX3Rlc3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGhleCgnYWJjJykudG9Mb3dlckNhc2UoKSA9PT0gJzkwMDE1MDk4M2NkMjRmYjBkNjk2M2Y3ZDI4ZTE3ZjcyJztcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIEVuYWJsZS9kaXNhYmxlIHVwcGVyY2FzZSBoZXhhZGVjaW1hbCByZXR1cm5lZCBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn1cbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhpc1xuICAgICAgICovXG4gICAgICB0aGlzLnNldFVwcGVyQ2FzZSA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICBoZXhjYXNlID0gYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIERlZmluZXMgYSBiYXNlNjQgcGFkIHN0cmluZ1xuICAgICAgICogQHBhcmFtIHtTdHJpbmd9IFBhZFxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2V0UGFkID0gZnVuY3Rpb24oYSkge1xuICAgICAgICBiNjRwYWQgPSBhIHx8IGI2NHBhZDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBEZWZpbmVzIGEgYmFzZTY0IHBhZCBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn1cbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gW3RoaXNdXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2V0VVRGOCA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICB1dGY4ID0gYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG5cbiAgICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgICAvKipcbiAgICAgICAqIENhbGN1bGF0ZSB0aGUgTUQ1IG9mIGEgcmF3IHN0cmluZ1xuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIHJzdHIocykge1xuICAgICAgICBzID0gKHV0ZjgpID8gdXRmOEVuY29kZShzKSA6IHM7XG4gICAgICAgIHJldHVybiBiaW5sMnJzdHIoYmlubChyc3RyMmJpbmwocyksIHMubGVuZ3RoICogOCkpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIENhbGN1bGF0ZSB0aGUgSE1BQy1NRDUsIG9mIGEga2V5IGFuZCBzb21lIGRhdGEgKHJhdyBzdHJpbmdzKVxuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIHJzdHJfaG1hYyhrZXksIGRhdGEpIHtcbiAgICAgICAgdmFyIGJrZXksIGlwYWQsIG9wYWQsIGhhc2gsIGk7XG5cbiAgICAgICAga2V5ID0gKHV0ZjgpID8gdXRmOEVuY29kZShrZXkpIDoga2V5O1xuICAgICAgICBkYXRhID0gKHV0ZjgpID8gdXRmOEVuY29kZShkYXRhKSA6IGRhdGE7XG4gICAgICAgIGJrZXkgPSByc3RyMmJpbmwoa2V5KTtcbiAgICAgICAgaWYgKGJrZXkubGVuZ3RoID4gMTYpIHtcbiAgICAgICAgICBia2V5ID0gYmlubChia2V5LCBrZXkubGVuZ3RoICogOCk7XG4gICAgICAgIH1cblxuICAgICAgICBpcGFkID0gQXJyYXkoMTYpLCBvcGFkID0gQXJyYXkoMTYpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTY7IGkgKz0gMSkge1xuICAgICAgICAgIGlwYWRbaV0gPSBia2V5W2ldIF4gMHgzNjM2MzYzNjtcbiAgICAgICAgICBvcGFkW2ldID0gYmtleVtpXSBeIDB4NUM1QzVDNUM7XG4gICAgICAgIH1cbiAgICAgICAgaGFzaCA9IGJpbmwoaXBhZC5jb25jYXQocnN0cjJiaW5sKGRhdGEpKSwgNTEyICsgZGF0YS5sZW5ndGggKiA4KTtcbiAgICAgICAgcmV0dXJuIGJpbmwycnN0cihiaW5sKG9wYWQuY29uY2F0KGhhc2gpLCA1MTIgKyAxMjgpKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDYWxjdWxhdGUgdGhlIE1ENSBvZiBhbiBhcnJheSBvZiBsaXR0bGUtZW5kaWFuIHdvcmRzLCBhbmQgYSBiaXQgbGVuZ3RoLlxuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIGJpbmwoeCwgbGVuKSB7XG4gICAgICAgIHZhciBpLCBvbGRhLCBvbGRiLCBvbGRjLCBvbGRkLFxuICAgICAgICAgIGEgPSAxNzMyNTg0MTkzLFxuICAgICAgICAgIGIgPSAtMjcxNzMzODc5LFxuICAgICAgICAgIGMgPSAtMTczMjU4NDE5NCxcbiAgICAgICAgICBkID0gMjcxNzMzODc4O1xuXG4gICAgICAgIC8qIGFwcGVuZCBwYWRkaW5nICovXG4gICAgICAgIHhbbGVuID4+IDVdIHw9IDB4ODAgPDwgKChsZW4pICUgMzIpO1xuICAgICAgICB4WygoKGxlbiArIDY0KSA+Pj4gOSkgPDwgNCkgKyAxNF0gPSBsZW47XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHgubGVuZ3RoOyBpICs9IDE2KSB7XG4gICAgICAgICAgb2xkYSA9IGE7XG4gICAgICAgICAgb2xkYiA9IGI7XG4gICAgICAgICAgb2xkYyA9IGM7XG4gICAgICAgICAgb2xkZCA9IGQ7XG5cbiAgICAgICAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSArIDBdLCA3LCAtNjgwODc2OTM2KTtcbiAgICAgICAgICBkID0gbWQ1X2ZmKGQsIGEsIGIsIGMsIHhbaSArIDFdLCAxMiwgLTM4OTU2NDU4Nik7XG4gICAgICAgICAgYyA9IG1kNV9mZihjLCBkLCBhLCBiLCB4W2kgKyAyXSwgMTcsIDYwNjEwNTgxOSk7XG4gICAgICAgICAgYiA9IG1kNV9mZihiLCBjLCBkLCBhLCB4W2kgKyAzXSwgMjIsIC0xMDQ0NTI1MzMwKTtcbiAgICAgICAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSArIDRdLCA3LCAtMTc2NDE4ODk3KTtcbiAgICAgICAgICBkID0gbWQ1X2ZmKGQsIGEsIGIsIGMsIHhbaSArIDVdLCAxMiwgMTIwMDA4MDQyNik7XG4gICAgICAgICAgYyA9IG1kNV9mZihjLCBkLCBhLCBiLCB4W2kgKyA2XSwgMTcsIC0xNDczMjMxMzQxKTtcbiAgICAgICAgICBiID0gbWQ1X2ZmKGIsIGMsIGQsIGEsIHhbaSArIDddLCAyMiwgLTQ1NzA1OTgzKTtcbiAgICAgICAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSArIDhdLCA3LCAxNzcwMDM1NDE2KTtcbiAgICAgICAgICBkID0gbWQ1X2ZmKGQsIGEsIGIsIGMsIHhbaSArIDldLCAxMiwgLTE5NTg0MTQ0MTcpO1xuICAgICAgICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpICsgMTBdLCAxNywgLTQyMDYzKTtcbiAgICAgICAgICBiID0gbWQ1X2ZmKGIsIGMsIGQsIGEsIHhbaSArIDExXSwgMjIsIC0xOTkwNDA0MTYyKTtcbiAgICAgICAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSArIDEyXSwgNywgMTgwNDYwMzY4Mik7XG4gICAgICAgICAgZCA9IG1kNV9mZihkLCBhLCBiLCBjLCB4W2kgKyAxM10sIDEyLCAtNDAzNDExMDEpO1xuICAgICAgICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpICsgMTRdLCAxNywgLTE1MDIwMDIyOTApO1xuICAgICAgICAgIGIgPSBtZDVfZmYoYiwgYywgZCwgYSwgeFtpICsgMTVdLCAyMiwgMTIzNjUzNTMyOSk7XG5cbiAgICAgICAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSArIDFdLCA1LCAtMTY1Nzk2NTEwKTtcbiAgICAgICAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSArIDZdLCA5LCAtMTA2OTUwMTYzMik7XG4gICAgICAgICAgYyA9IG1kNV9nZyhjLCBkLCBhLCBiLCB4W2kgKyAxMV0sIDE0LCA2NDM3MTc3MTMpO1xuICAgICAgICAgIGIgPSBtZDVfZ2coYiwgYywgZCwgYSwgeFtpICsgMF0sIDIwLCAtMzczODk3MzAyKTtcbiAgICAgICAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSArIDVdLCA1LCAtNzAxNTU4NjkxKTtcbiAgICAgICAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSArIDEwXSwgOSwgMzgwMTYwODMpO1xuICAgICAgICAgIGMgPSBtZDVfZ2coYywgZCwgYSwgYiwgeFtpICsgMTVdLCAxNCwgLTY2MDQ3ODMzNSk7XG4gICAgICAgICAgYiA9IG1kNV9nZyhiLCBjLCBkLCBhLCB4W2kgKyA0XSwgMjAsIC00MDU1Mzc4NDgpO1xuICAgICAgICAgIGEgPSBtZDVfZ2coYSwgYiwgYywgZCwgeFtpICsgOV0sIDUsIDU2ODQ0NjQzOCk7XG4gICAgICAgICAgZCA9IG1kNV9nZyhkLCBhLCBiLCBjLCB4W2kgKyAxNF0sIDksIC0xMDE5ODAzNjkwKTtcbiAgICAgICAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSArIDNdLCAxNCwgLTE4NzM2Mzk2MSk7XG4gICAgICAgICAgYiA9IG1kNV9nZyhiLCBjLCBkLCBhLCB4W2kgKyA4XSwgMjAsIDExNjM1MzE1MDEpO1xuICAgICAgICAgIGEgPSBtZDVfZ2coYSwgYiwgYywgZCwgeFtpICsgMTNdLCA1LCAtMTQ0NDY4MTQ2Nyk7XG4gICAgICAgICAgZCA9IG1kNV9nZyhkLCBhLCBiLCBjLCB4W2kgKyAyXSwgOSwgLTUxNDAzNzg0KTtcbiAgICAgICAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSArIDddLCAxNCwgMTczNTMyODQ3Myk7XG4gICAgICAgICAgYiA9IG1kNV9nZyhiLCBjLCBkLCBhLCB4W2kgKyAxMl0sIDIwLCAtMTkyNjYwNzczNCk7XG5cbiAgICAgICAgICBhID0gbWQ1X2hoKGEsIGIsIGMsIGQsIHhbaSArIDVdLCA0LCAtMzc4NTU4KTtcbiAgICAgICAgICBkID0gbWQ1X2hoKGQsIGEsIGIsIGMsIHhbaSArIDhdLCAxMSwgLTIwMjI1NzQ0NjMpO1xuICAgICAgICAgIGMgPSBtZDVfaGgoYywgZCwgYSwgYiwgeFtpICsgMTFdLCAxNiwgMTgzOTAzMDU2Mik7XG4gICAgICAgICAgYiA9IG1kNV9oaChiLCBjLCBkLCBhLCB4W2kgKyAxNF0sIDIzLCAtMzUzMDk1NTYpO1xuICAgICAgICAgIGEgPSBtZDVfaGgoYSwgYiwgYywgZCwgeFtpICsgMV0sIDQsIC0xNTMwOTkyMDYwKTtcbiAgICAgICAgICBkID0gbWQ1X2hoKGQsIGEsIGIsIGMsIHhbaSArIDRdLCAxMSwgMTI3Mjg5MzM1Myk7XG4gICAgICAgICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2kgKyA3XSwgMTYsIC0xNTU0OTc2MzIpO1xuICAgICAgICAgIGIgPSBtZDVfaGgoYiwgYywgZCwgYSwgeFtpICsgMTBdLCAyMywgLTEwOTQ3MzA2NDApO1xuICAgICAgICAgIGEgPSBtZDVfaGgoYSwgYiwgYywgZCwgeFtpICsgMTNdLCA0LCA2ODEyNzkxNzQpO1xuICAgICAgICAgIGQgPSBtZDVfaGgoZCwgYSwgYiwgYywgeFtpICsgMF0sIDExLCAtMzU4NTM3MjIyKTtcbiAgICAgICAgICBjID0gbWQ1X2hoKGMsIGQsIGEsIGIsIHhbaSArIDNdLCAxNiwgLTcyMjUyMTk3OSk7XG4gICAgICAgICAgYiA9IG1kNV9oaChiLCBjLCBkLCBhLCB4W2kgKyA2XSwgMjMsIDc2MDI5MTg5KTtcbiAgICAgICAgICBhID0gbWQ1X2hoKGEsIGIsIGMsIGQsIHhbaSArIDldLCA0LCAtNjQwMzY0NDg3KTtcbiAgICAgICAgICBkID0gbWQ1X2hoKGQsIGEsIGIsIGMsIHhbaSArIDEyXSwgMTEsIC00MjE4MTU4MzUpO1xuICAgICAgICAgIGMgPSBtZDVfaGgoYywgZCwgYSwgYiwgeFtpICsgMTVdLCAxNiwgNTMwNzQyNTIwKTtcbiAgICAgICAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSArIDJdLCAyMywgLTk5NTMzODY1MSk7XG5cbiAgICAgICAgICBhID0gbWQ1X2lpKGEsIGIsIGMsIGQsIHhbaSArIDBdLCA2LCAtMTk4NjMwODQ0KTtcbiAgICAgICAgICBkID0gbWQ1X2lpKGQsIGEsIGIsIGMsIHhbaSArIDddLCAxMCwgMTEyNjg5MTQxNSk7XG4gICAgICAgICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2kgKyAxNF0sIDE1LCAtMTQxNjM1NDkwNSk7XG4gICAgICAgICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2kgKyA1XSwgMjEsIC01NzQzNDA1NSk7XG4gICAgICAgICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2kgKyAxMl0sIDYsIDE3MDA0ODU1NzEpO1xuICAgICAgICAgIGQgPSBtZDVfaWkoZCwgYSwgYiwgYywgeFtpICsgM10sIDEwLCAtMTg5NDk4NjYwNik7XG4gICAgICAgICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2kgKyAxMF0sIDE1LCAtMTA1MTUyMyk7XG4gICAgICAgICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2kgKyAxXSwgMjEsIC0yMDU0OTIyNzk5KTtcbiAgICAgICAgICBhID0gbWQ1X2lpKGEsIGIsIGMsIGQsIHhbaSArIDhdLCA2LCAxODczMzEzMzU5KTtcbiAgICAgICAgICBkID0gbWQ1X2lpKGQsIGEsIGIsIGMsIHhbaSArIDE1XSwgMTAsIC0zMDYxMTc0NCk7XG4gICAgICAgICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2kgKyA2XSwgMTUsIC0xNTYwMTk4MzgwKTtcbiAgICAgICAgICBiID0gbWQ1X2lpKGIsIGMsIGQsIGEsIHhbaSArIDEzXSwgMjEsIDEzMDkxNTE2NDkpO1xuICAgICAgICAgIGEgPSBtZDVfaWkoYSwgYiwgYywgZCwgeFtpICsgNF0sIDYsIC0xNDU1MjMwNzApO1xuICAgICAgICAgIGQgPSBtZDVfaWkoZCwgYSwgYiwgYywgeFtpICsgMTFdLCAxMCwgLTExMjAyMTAzNzkpO1xuICAgICAgICAgIGMgPSBtZDVfaWkoYywgZCwgYSwgYiwgeFtpICsgMl0sIDE1LCA3MTg3ODcyNTkpO1xuICAgICAgICAgIGIgPSBtZDVfaWkoYiwgYywgZCwgYSwgeFtpICsgOV0sIDIxLCAtMzQzNDg1NTUxKTtcblxuICAgICAgICAgIGEgPSBzYWZlX2FkZChhLCBvbGRhKTtcbiAgICAgICAgICBiID0gc2FmZV9hZGQoYiwgb2xkYik7XG4gICAgICAgICAgYyA9IHNhZmVfYWRkKGMsIG9sZGMpO1xuICAgICAgICAgIGQgPSBzYWZlX2FkZChkLCBvbGRkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQXJyYXkoYSwgYiwgYywgZCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlc2UgZnVuY3Rpb25zIGltcGxlbWVudCB0aGUgZm91ciBiYXNpYyBvcGVyYXRpb25zIHRoZSBhbGdvcml0aG0gdXNlcy5cbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiBtZDVfY21uKHEsIGEsIGIsIHgsIHMsIHQpIHtcbiAgICAgICAgcmV0dXJuIHNhZmVfYWRkKGJpdF9yb2woc2FmZV9hZGQoc2FmZV9hZGQoYSwgcSksIHNhZmVfYWRkKHgsIHQpKSwgcyksIGIpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBtZDVfZmYoYSwgYiwgYywgZCwgeCwgcywgdCkge1xuICAgICAgICByZXR1cm4gbWQ1X2NtbigoYiAmIGMpIHwgKCh+YikgJiBkKSwgYSwgYiwgeCwgcywgdCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG1kNV9nZyhhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XG4gICAgICAgIHJldHVybiBtZDVfY21uKChiICYgZCkgfCAoYyAmICh+ZCkpLCBhLCBiLCB4LCBzLCB0KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbWQ1X2hoKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgICAgICAgcmV0dXJuIG1kNV9jbW4oYiBeIGMgXiBkLCBhLCBiLCB4LCBzLCB0KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbWQ1X2lpKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgICAgICAgcmV0dXJuIG1kNV9jbW4oYyBeIChiIHwgKH5kKSksIGEsIGIsIHgsIHMsIHQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogQG1lbWJlciBIYXNoZXNcbiAgICAgKiBAY2xhc3MgSGFzaGVzLlNIQTFcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZ11cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgU2VjdXJlIEhhc2ggQWxnb3JpdGhtLCBTSEEtMSwgYXMgZGVmaW5lZCBpbiBGSVBTIDE4MC0xXG4gICAgICogVmVyc2lvbiAyLjIgQ29weXJpZ2h0IFBhdWwgSm9obnN0b24gMjAwMCAtIDIwMDkuXG4gICAgICogT3RoZXIgY29udHJpYnV0b3JzOiBHcmVnIEhvbHQsIEFuZHJldyBLZXBlcnQsIFlkbmFyLCBMb3N0aW5ldFxuICAgICAqIFNlZSBodHRwOi8vcGFqaG9tZS5vcmcudWsvY3J5cHQvbWQ1IGZvciBkZXRhaWxzLlxuICAgICAqL1xuICAgIFNIQTE6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIC8qKlxuICAgICAgICogUHJpdmF0ZSBjb25maWcgcHJvcGVydGllcy4gWW91IG1heSBuZWVkIHRvIHR3ZWFrIHRoZXNlIHRvIGJlIGNvbXBhdGlibGUgd2l0aFxuICAgICAgICogdGhlIHNlcnZlci1zaWRlLCBidXQgdGhlIGRlZmF1bHRzIHdvcmsgaW4gbW9zdCBjYXNlcy5cbiAgICAgICAqIFNlZSB7QGxpbmsgSGFzaGVzLk1ENSNtZXRob2Qtc2V0VXBwZXJDYXNlfSBhbmQge0BsaW5rIEhhc2hlcy5TSEExI21ldGhvZC1zZXRVcHBlckNhc2V9XG4gICAgICAgKi9cbiAgICAgIHZhciBoZXhjYXNlID0gKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMudXBwZXJjYXNlID09PSAnYm9vbGVhbicpID8gb3B0aW9ucy51cHBlcmNhc2UgOiBmYWxzZSwgLy8gaGV4YWRlY2ltYWwgb3V0cHV0IGNhc2UgZm9ybWF0LiBmYWxzZSAtIGxvd2VyY2FzZTsgdHJ1ZSAtIHVwcGVyY2FzZVxuICAgICAgICBiNjRwYWQgPSAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5wYWQgPT09ICdzdHJpbmcnKSA/IG9wdGlvbnMucGFkIDogJz0nLCAvLyBiYXNlLTY0IHBhZCBjaGFyYWN0ZXIuIERlZmF1bHRzIHRvICc9JyBmb3Igc3RyaWN0IFJGQyBjb21wbGlhbmNlXG4gICAgICAgIHV0ZjggPSAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy51dGY4ID09PSAnYm9vbGVhbicpID8gb3B0aW9ucy51dGY4IDogdHJ1ZTsgLy8gZW5hYmxlL2Rpc2FibGUgdXRmOCBlbmNvZGluZ1xuXG4gICAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgICAgdGhpcy5oZXggPSBmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiByc3RyMmhleChyc3RyKHMsIHV0ZjgpLCBoZXhjYXNlKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmI2NCA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYjY0KHJzdHIocywgdXRmOCksIGI2NHBhZCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5hbnkgPSBmdW5jdGlvbihzLCBlKSB7XG4gICAgICAgIHJldHVybiByc3RyMmFueShyc3RyKHMsIHV0ZjgpLCBlKTtcbiAgICAgIH07XG4gICAgICB0aGlzLnJhdyA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIocywgdXRmOCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5oZXhfaG1hYyA9IGZ1bmN0aW9uKGssIGQpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyaGV4KHJzdHJfaG1hYyhrLCBkKSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5iNjRfaG1hYyA9IGZ1bmN0aW9uKGssIGQpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYjY0KHJzdHJfaG1hYyhrLCBkKSwgYjY0cGFkKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmFueV9obWFjID0gZnVuY3Rpb24oaywgZCwgZSkge1xuICAgICAgICByZXR1cm4gcnN0cjJhbnkocnN0cl9obWFjKGssIGQpLCBlKTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFBlcmZvcm0gYSBzaW1wbGUgc2VsZi10ZXN0IHRvIHNlZSBpZiB0aGUgVk0gaXMgd29ya2luZ1xuICAgICAgICogQHJldHVybiB7U3RyaW5nfSBIZXhhZGVjaW1hbCBoYXNoIHNhbXBsZVxuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgICB0aGlzLnZtX3Rlc3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGhleCgnYWJjJykudG9Mb3dlckNhc2UoKSA9PT0gJzkwMDE1MDk4M2NkMjRmYjBkNjk2M2Y3ZDI4ZTE3ZjcyJztcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIEBkZXNjcmlwdGlvbiBFbmFibGUvZGlzYWJsZSB1cHBlcmNhc2UgaGV4YWRlY2ltYWwgcmV0dXJuZWQgc3RyaW5nXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59XG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoaXNcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgICAgdGhpcy5zZXRVcHBlckNhc2UgPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgaGV4Y2FzZSA9IGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBAZGVzY3JpcHRpb24gRGVmaW5lcyBhIGJhc2U2NCBwYWQgc3RyaW5nXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gUGFkXG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoaXNcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgICAgdGhpcy5zZXRQYWQgPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIGI2NHBhZCA9IGEgfHwgYjY0cGFkO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIEBkZXNjcmlwdGlvbiBEZWZpbmVzIGEgYmFzZTY0IHBhZCBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn1cbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhpc1xuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgICB0aGlzLnNldFVURjggPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgdXRmOCA9IGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuXG4gICAgICAvLyBwcml2YXRlIG1ldGhvZHNcblxuICAgICAgLyoqXG4gICAgICAgKiBDYWxjdWxhdGUgdGhlIFNIQS01MTIgb2YgYSByYXcgc3RyaW5nXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gcnN0cihzKSB7XG4gICAgICAgIHMgPSAodXRmOCkgPyB1dGY4RW5jb2RlKHMpIDogcztcbiAgICAgICAgcmV0dXJuIGJpbmIycnN0cihiaW5iKHJzdHIyYmluYihzKSwgcy5sZW5ndGggKiA4KSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ2FsY3VsYXRlIHRoZSBITUFDLVNIQTEgb2YgYSBrZXkgYW5kIHNvbWUgZGF0YSAocmF3IHN0cmluZ3MpXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gcnN0cl9obWFjKGtleSwgZGF0YSkge1xuICAgICAgICB2YXIgYmtleSwgaXBhZCwgb3BhZCwgaSwgaGFzaDtcbiAgICAgICAga2V5ID0gKHV0ZjgpID8gdXRmOEVuY29kZShrZXkpIDoga2V5O1xuICAgICAgICBkYXRhID0gKHV0ZjgpID8gdXRmOEVuY29kZShkYXRhKSA6IGRhdGE7XG4gICAgICAgIGJrZXkgPSByc3RyMmJpbmIoa2V5KTtcblxuICAgICAgICBpZiAoYmtleS5sZW5ndGggPiAxNikge1xuICAgICAgICAgIGJrZXkgPSBiaW5iKGJrZXksIGtleS5sZW5ndGggKiA4KTtcbiAgICAgICAgfVxuICAgICAgICBpcGFkID0gQXJyYXkoMTYpLCBvcGFkID0gQXJyYXkoMTYpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTY7IGkgKz0gMSkge1xuICAgICAgICAgIGlwYWRbaV0gPSBia2V5W2ldIF4gMHgzNjM2MzYzNjtcbiAgICAgICAgICBvcGFkW2ldID0gYmtleVtpXSBeIDB4NUM1QzVDNUM7XG4gICAgICAgIH1cbiAgICAgICAgaGFzaCA9IGJpbmIoaXBhZC5jb25jYXQocnN0cjJiaW5iKGRhdGEpKSwgNTEyICsgZGF0YS5sZW5ndGggKiA4KTtcbiAgICAgICAgcmV0dXJuIGJpbmIycnN0cihiaW5iKG9wYWQuY29uY2F0KGhhc2gpLCA1MTIgKyAxNjApKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDYWxjdWxhdGUgdGhlIFNIQS0xIG9mIGFuIGFycmF5IG9mIGJpZy1lbmRpYW4gd29yZHMsIGFuZCBhIGJpdCBsZW5ndGhcbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiBiaW5iKHgsIGxlbikge1xuICAgICAgICB2YXIgaSwgaiwgdCwgb2xkYSwgb2xkYiwgb2xkYywgb2xkZCwgb2xkZSxcbiAgICAgICAgICB3ID0gQXJyYXkoODApLFxuICAgICAgICAgIGEgPSAxNzMyNTg0MTkzLFxuICAgICAgICAgIGIgPSAtMjcxNzMzODc5LFxuICAgICAgICAgIGMgPSAtMTczMjU4NDE5NCxcbiAgICAgICAgICBkID0gMjcxNzMzODc4LFxuICAgICAgICAgIGUgPSAtMTAwOTU4OTc3NjtcblxuICAgICAgICAvKiBhcHBlbmQgcGFkZGluZyAqL1xuICAgICAgICB4W2xlbiA+PiA1XSB8PSAweDgwIDw8ICgyNCAtIGxlbiAlIDMyKTtcbiAgICAgICAgeFsoKGxlbiArIDY0ID4+IDkpIDw8IDQpICsgMTVdID0gbGVuO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSArPSAxNikge1xuICAgICAgICAgIG9sZGEgPSBhO1xuICAgICAgICAgIG9sZGIgPSBiO1xuICAgICAgICAgIG9sZGMgPSBjO1xuICAgICAgICAgIG9sZGQgPSBkO1xuICAgICAgICAgIG9sZGUgPSBlO1xuXG4gICAgICAgICAgZm9yIChqID0gMDsgaiA8IDgwOyBqICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChqIDwgMTYpIHtcbiAgICAgICAgICAgICAgd1tqXSA9IHhbaSArIGpdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgd1tqXSA9IGJpdF9yb2wod1tqIC0gM10gXiB3W2ogLSA4XSBeIHdbaiAtIDE0XSBeIHdbaiAtIDE2XSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ID0gc2FmZV9hZGQoc2FmZV9hZGQoYml0X3JvbChhLCA1KSwgc2hhMV9mdChqLCBiLCBjLCBkKSksXG4gICAgICAgICAgICAgIHNhZmVfYWRkKHNhZmVfYWRkKGUsIHdbal0pLCBzaGExX2t0KGopKSk7XG4gICAgICAgICAgICBlID0gZDtcbiAgICAgICAgICAgIGQgPSBjO1xuICAgICAgICAgICAgYyA9IGJpdF9yb2woYiwgMzApO1xuICAgICAgICAgICAgYiA9IGE7XG4gICAgICAgICAgICBhID0gdDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhID0gc2FmZV9hZGQoYSwgb2xkYSk7XG4gICAgICAgICAgYiA9IHNhZmVfYWRkKGIsIG9sZGIpO1xuICAgICAgICAgIGMgPSBzYWZlX2FkZChjLCBvbGRjKTtcbiAgICAgICAgICBkID0gc2FmZV9hZGQoZCwgb2xkZCk7XG4gICAgICAgICAgZSA9IHNhZmVfYWRkKGUsIG9sZGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBBcnJheShhLCBiLCBjLCBkLCBlKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBQZXJmb3JtIHRoZSBhcHByb3ByaWF0ZSB0cmlwbGV0IGNvbWJpbmF0aW9uIGZ1bmN0aW9uIGZvciB0aGUgY3VycmVudFxuICAgICAgICogaXRlcmF0aW9uXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gc2hhMV9mdCh0LCBiLCBjLCBkKSB7XG4gICAgICAgIGlmICh0IDwgMjApIHtcbiAgICAgICAgICByZXR1cm4gKGIgJiBjKSB8ICgofmIpICYgZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHQgPCA0MCkge1xuICAgICAgICAgIHJldHVybiBiIF4gYyBeIGQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHQgPCA2MCkge1xuICAgICAgICAgIHJldHVybiAoYiAmIGMpIHwgKGIgJiBkKSB8IChjICYgZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGIgXiBjIF4gZDtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBEZXRlcm1pbmUgdGhlIGFwcHJvcHJpYXRlIGFkZGl0aXZlIGNvbnN0YW50IGZvciB0aGUgY3VycmVudCBpdGVyYXRpb25cbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiBzaGExX2t0KHQpIHtcbiAgICAgICAgcmV0dXJuICh0IDwgMjApID8gMTUxODUwMDI0OSA6ICh0IDwgNDApID8gMTg1OTc3NTM5MyA6XG4gICAgICAgICAgKHQgPCA2MCkgPyAtMTg5NDAwNzU4OCA6IC04OTk0OTc1MTQ7XG4gICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBAY2xhc3MgSGFzaGVzLlNIQTI1NlxuICAgICAqIEBwYXJhbSB7Y29uZmlnfVxuICAgICAqXG4gICAgICogQSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBTZWN1cmUgSGFzaCBBbGdvcml0aG0sIFNIQS0yNTYsIGFzIGRlZmluZWQgaW4gRklQUyAxODAtMlxuICAgICAqIFZlcnNpb24gMi4yIENvcHlyaWdodCBBbmdlbCBNYXJpbiwgUGF1bCBKb2huc3RvbiAyMDAwIC0gMjAwOS5cbiAgICAgKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XG4gICAgICogU2VlIGh0dHA6Ly9wYWpob21lLm9yZy51ay9jcnlwdC9tZDUgZm9yIGRldGFpbHMuXG4gICAgICogQWxzbyBodHRwOi8vYW5tYXIuZXUub3JnL3Byb2plY3RzL2pzc2hhMi9cbiAgICAgKi9cbiAgICBTSEEyNTY6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIC8qKlxuICAgICAgICogUHJpdmF0ZSBwcm9wZXJ0aWVzIGNvbmZpZ3VyYXRpb24gdmFyaWFibGVzLiBZb3UgbWF5IG5lZWQgdG8gdHdlYWsgdGhlc2UgdG8gYmUgY29tcGF0aWJsZSB3aXRoXG4gICAgICAgKiB0aGUgc2VydmVyLXNpZGUsIGJ1dCB0aGUgZGVmYXVsdHMgd29yayBpbiBtb3N0IGNhc2VzLlxuICAgICAgICogQHNlZSB0aGlzLnNldFVwcGVyQ2FzZSgpIG1ldGhvZFxuICAgICAgICogQHNlZSB0aGlzLnNldFBhZCgpIG1ldGhvZFxuICAgICAgICovXG4gICAgICB2YXIgaGV4Y2FzZSA9IChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnVwcGVyY2FzZSA9PT0gJ2Jvb2xlYW4nKSA/IG9wdGlvbnMudXBwZXJjYXNlIDogZmFsc2UsIC8vIGhleGFkZWNpbWFsIG91dHB1dCBjYXNlIGZvcm1hdC4gZmFsc2UgLSBsb3dlcmNhc2U7IHRydWUgLSB1cHBlcmNhc2UgICovXG4gICAgICAgIGI2NHBhZCA9IChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnBhZCA9PT0gJ3N0cmluZycpID8gb3B0aW9ucy5wYWQgOiAnPScsXG4gICAgICAgIC8qIGJhc2UtNjQgcGFkIGNoYXJhY3Rlci4gRGVmYXVsdCAnPScgZm9yIHN0cmljdCBSRkMgY29tcGxpYW5jZSAgICovXG4gICAgICAgIHV0ZjggPSAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy51dGY4ID09PSAnYm9vbGVhbicpID8gb3B0aW9ucy51dGY4IDogdHJ1ZSxcbiAgICAgICAgLyogZW5hYmxlL2Rpc2FibGUgdXRmOCBlbmNvZGluZyAqL1xuICAgICAgICBzaGEyNTZfSztcblxuICAgICAgLyogcHJpdmlsZWdlZCAocHVibGljKSBtZXRob2RzICovXG4gICAgICB0aGlzLmhleCA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyaGV4KHJzdHIocywgdXRmOCkpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYjY0ID0gZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcnN0cjJiNjQocnN0cihzLCB1dGY4KSwgYjY0cGFkKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmFueSA9IGZ1bmN0aW9uKHMsIGUpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYW55KHJzdHIocywgdXRmOCksIGUpO1xuICAgICAgfTtcbiAgICAgIHRoaXMucmF3ID0gZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcnN0cihzLCB1dGY4KTtcbiAgICAgIH07XG4gICAgICB0aGlzLmhleF9obWFjID0gZnVuY3Rpb24oaywgZCkge1xuICAgICAgICByZXR1cm4gcnN0cjJoZXgocnN0cl9obWFjKGssIGQpKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmI2NF9obWFjID0gZnVuY3Rpb24oaywgZCkge1xuICAgICAgICByZXR1cm4gcnN0cjJiNjQocnN0cl9obWFjKGssIGQpLCBiNjRwYWQpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYW55X2htYWMgPSBmdW5jdGlvbihrLCBkLCBlKSB7XG4gICAgICAgIHJldHVybiByc3RyMmFueShyc3RyX2htYWMoaywgZCksIGUpO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogUGVyZm9ybSBhIHNpbXBsZSBzZWxmLXRlc3QgdG8gc2VlIGlmIHRoZSBWTSBpcyB3b3JraW5nXG4gICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IEhleGFkZWNpbWFsIGhhc2ggc2FtcGxlXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICAgIHRoaXMudm1fdGVzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gaGV4KCdhYmMnKS50b0xvd2VyQ2FzZSgpID09PSAnOTAwMTUwOTgzY2QyNGZiMGQ2OTYzZjdkMjhlMTdmNzInO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogRW5hYmxlL2Rpc2FibGUgdXBwZXJjYXNlIGhleGFkZWNpbWFsIHJldHVybmVkIHN0cmluZ1xuICAgICAgICogQHBhcmFtIHtib29sZWFufVxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2V0VXBwZXJDYXNlID0gZnVuY3Rpb24oYSkge1xuICAgICAgICBpZiAodHlwZW9mIGEgPT09ICdib29sZWFuJykge1xuICAgICAgICAgIGhleGNhc2UgPSBhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogQGRlc2NyaXB0aW9uIERlZmluZXMgYSBiYXNlNjQgcGFkIHN0cmluZ1xuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IFBhZFxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2V0UGFkID0gZnVuY3Rpb24oYSkge1xuICAgICAgICBiNjRwYWQgPSBhIHx8IGI2NHBhZDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBEZWZpbmVzIGEgYmFzZTY0IHBhZCBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn1cbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhpc1xuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgICB0aGlzLnNldFVURjggPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgdXRmOCA9IGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuXG4gICAgICAvLyBwcml2YXRlIG1ldGhvZHNcblxuICAgICAgLyoqXG4gICAgICAgKiBDYWxjdWxhdGUgdGhlIFNIQS01MTIgb2YgYSByYXcgc3RyaW5nXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gcnN0cihzLCB1dGY4KSB7XG4gICAgICAgIHMgPSAodXRmOCkgPyB1dGY4RW5jb2RlKHMpIDogcztcbiAgICAgICAgcmV0dXJuIGJpbmIycnN0cihiaW5iKHJzdHIyYmluYihzKSwgcy5sZW5ndGggKiA4KSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ2FsY3VsYXRlIHRoZSBITUFDLXNoYTI1NiBvZiBhIGtleSBhbmQgc29tZSBkYXRhIChyYXcgc3RyaW5ncylcbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiByc3RyX2htYWMoa2V5LCBkYXRhKSB7XG4gICAgICAgIGtleSA9ICh1dGY4KSA/IHV0ZjhFbmNvZGUoa2V5KSA6IGtleTtcbiAgICAgICAgZGF0YSA9ICh1dGY4KSA/IHV0ZjhFbmNvZGUoZGF0YSkgOiBkYXRhO1xuICAgICAgICB2YXIgaGFzaCwgaSA9IDAsXG4gICAgICAgICAgYmtleSA9IHJzdHIyYmluYihrZXkpLFxuICAgICAgICAgIGlwYWQgPSBBcnJheSgxNiksXG4gICAgICAgICAgb3BhZCA9IEFycmF5KDE2KTtcblxuICAgICAgICBpZiAoYmtleS5sZW5ndGggPiAxNikge1xuICAgICAgICAgIGJrZXkgPSBiaW5iKGJrZXksIGtleS5sZW5ndGggKiA4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoOyBpIDwgMTY7IGkgKz0gMSkge1xuICAgICAgICAgIGlwYWRbaV0gPSBia2V5W2ldIF4gMHgzNjM2MzYzNjtcbiAgICAgICAgICBvcGFkW2ldID0gYmtleVtpXSBeIDB4NUM1QzVDNUM7XG4gICAgICAgIH1cblxuICAgICAgICBoYXNoID0gYmluYihpcGFkLmNvbmNhdChyc3RyMmJpbmIoZGF0YSkpLCA1MTIgKyBkYXRhLmxlbmd0aCAqIDgpO1xuICAgICAgICByZXR1cm4gYmluYjJyc3RyKGJpbmIob3BhZC5jb25jYXQoaGFzaCksIDUxMiArIDI1NikpO1xuICAgICAgfVxuXG4gICAgICAvKlxuICAgICAgICogTWFpbiBzaGEyNTYgZnVuY3Rpb24sIHdpdGggaXRzIHN1cHBvcnQgZnVuY3Rpb25zXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gc2hhMjU2X1MoWCwgbikge1xuICAgICAgICByZXR1cm4gKFggPj4+IG4pIHwgKFggPDwgKDMyIC0gbikpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaGEyNTZfUihYLCBuKSB7XG4gICAgICAgIHJldHVybiAoWCA+Pj4gbik7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNoYTI1Nl9DaCh4LCB5LCB6KSB7XG4gICAgICAgIHJldHVybiAoKHggJiB5KSBeICgofngpICYgeikpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaGEyNTZfTWFqKHgsIHksIHopIHtcbiAgICAgICAgcmV0dXJuICgoeCAmIHkpIF4gKHggJiB6KSBeICh5ICYgeikpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaGEyNTZfU2lnbWEwMjU2KHgpIHtcbiAgICAgICAgcmV0dXJuIChzaGEyNTZfUyh4LCAyKSBeIHNoYTI1Nl9TKHgsIDEzKSBeIHNoYTI1Nl9TKHgsIDIyKSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNoYTI1Nl9TaWdtYTEyNTYoeCkge1xuICAgICAgICByZXR1cm4gKHNoYTI1Nl9TKHgsIDYpIF4gc2hhMjU2X1MoeCwgMTEpIF4gc2hhMjU2X1MoeCwgMjUpKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hhMjU2X0dhbW1hMDI1Nih4KSB7XG4gICAgICAgIHJldHVybiAoc2hhMjU2X1MoeCwgNykgXiBzaGEyNTZfUyh4LCAxOCkgXiBzaGEyNTZfUih4LCAzKSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNoYTI1Nl9HYW1tYTEyNTYoeCkge1xuICAgICAgICByZXR1cm4gKHNoYTI1Nl9TKHgsIDE3KSBeIHNoYTI1Nl9TKHgsIDE5KSBeIHNoYTI1Nl9SKHgsIDEwKSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNoYTI1Nl9TaWdtYTA1MTIoeCkge1xuICAgICAgICByZXR1cm4gKHNoYTI1Nl9TKHgsIDI4KSBeIHNoYTI1Nl9TKHgsIDM0KSBeIHNoYTI1Nl9TKHgsIDM5KSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNoYTI1Nl9TaWdtYTE1MTIoeCkge1xuICAgICAgICByZXR1cm4gKHNoYTI1Nl9TKHgsIDE0KSBeIHNoYTI1Nl9TKHgsIDE4KSBeIHNoYTI1Nl9TKHgsIDQxKSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNoYTI1Nl9HYW1tYTA1MTIoeCkge1xuICAgICAgICByZXR1cm4gKHNoYTI1Nl9TKHgsIDEpIF4gc2hhMjU2X1MoeCwgOCkgXiBzaGEyNTZfUih4LCA3KSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNoYTI1Nl9HYW1tYTE1MTIoeCkge1xuICAgICAgICByZXR1cm4gKHNoYTI1Nl9TKHgsIDE5KSBeIHNoYTI1Nl9TKHgsIDYxKSBeIHNoYTI1Nl9SKHgsIDYpKTtcbiAgICAgIH1cblxuICAgICAgc2hhMjU2X0sgPSBbXG4gICAgICAgIDExMTYzNTI0MDgsIDE4OTk0NDc0NDEsIC0xMjQ1NjQzODI1LCAtMzczOTU3NzIzLCA5NjE5ODcxNjMsIDE1MDg5NzA5OTMsIC0xODQxMzMxNTQ4LCAtMTQyNDIwNDA3NSwgLTY3MDU4NjIxNiwgMzEwNTk4NDAxLCA2MDcyMjUyNzgsIDE0MjY4ODE5ODcsXG4gICAgICAgIDE5MjUwNzgzODgsIC0yMTMyODg5MDkwLCAtMTY4MDA3OTE5MywgLTEwNDY3NDQ3MTYsIC00NTk1NzY4OTUsIC0yNzI3NDI1MjIsXG4gICAgICAgIDI2NDM0NzA3OCwgNjA0ODA3NjI4LCA3NzAyNTU5ODMsIDEyNDkxNTAxMjIsIDE1NTUwODE2OTIsIDE5OTYwNjQ5ODYsIC0xNzQwNzQ2NDE0LCAtMTQ3MzEzMjk0NywgLTEzNDE5NzA0ODgsIC0xMDg0NjUzNjI1LCAtOTU4Mzk1NDA1LCAtNzEwNDM4NTg1LFxuICAgICAgICAxMTM5MjY5OTMsIDMzODI0MTg5NSwgNjY2MzA3MjA1LCA3NzM1Mjk5MTIsIDEyOTQ3NTczNzIsIDEzOTYxODIyOTEsXG4gICAgICAgIDE2OTUxODM3MDAsIDE5ODY2NjEwNTEsIC0yMTE3OTQwOTQ2LCAtMTgzODAxMTI1OSwgLTE1NjQ0ODEzNzUsIC0xNDc0NjY0ODg1LCAtMTAzNTIzNjQ5NiwgLTk0OTIwMjUyNSwgLTc3ODkwMTQ3OSwgLTY5NDYxNDQ5MiwgLTIwMDM5NTM4NywgMjc1NDIzMzQ0LFxuICAgICAgICA0MzAyMjc3MzQsIDUwNjk0ODYxNiwgNjU5MDYwNTU2LCA4ODM5OTc4NzcsIDk1ODEzOTU3MSwgMTMyMjgyMjIxOCxcbiAgICAgICAgMTUzNzAwMjA2MywgMTc0Nzg3Mzc3OSwgMTk1NTU2MjIyMiwgMjAyNDEwNDgxNSwgLTIwNjcyMzY4NDQsIC0xOTMzMTE0ODcyLCAtMTg2NjUzMDgyMiwgLTE1MzgyMzMxMDksIC0xMDkwOTM1ODE3LCAtOTY1NjQxOTk4XG4gICAgICBdO1xuXG4gICAgICBmdW5jdGlvbiBiaW5iKG0sIGwpIHtcbiAgICAgICAgdmFyIEhBU0ggPSBbMTc3OTAzMzcwMywgLTExNTA4MzMwMTksIDEwMTM5MDQyNDIsIC0xNTIxNDg2NTM0LFxuICAgICAgICAgIDEzNTk4OTMxMTksIC0xNjk0MTQ0MzcyLCA1Mjg3MzQ2MzUsIDE1NDE0NTkyMjVcbiAgICAgICAgXTtcbiAgICAgICAgdmFyIFcgPSBuZXcgQXJyYXkoNjQpO1xuICAgICAgICB2YXIgYSwgYiwgYywgZCwgZSwgZiwgZywgaDtcbiAgICAgICAgdmFyIGksIGosIFQxLCBUMjtcblxuICAgICAgICAvKiBhcHBlbmQgcGFkZGluZyAqL1xuICAgICAgICBtW2wgPj4gNV0gfD0gMHg4MCA8PCAoMjQgLSBsICUgMzIpO1xuICAgICAgICBtWygobCArIDY0ID4+IDkpIDw8IDQpICsgMTVdID0gbDtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbS5sZW5ndGg7IGkgKz0gMTYpIHtcbiAgICAgICAgICBhID0gSEFTSFswXTtcbiAgICAgICAgICBiID0gSEFTSFsxXTtcbiAgICAgICAgICBjID0gSEFTSFsyXTtcbiAgICAgICAgICBkID0gSEFTSFszXTtcbiAgICAgICAgICBlID0gSEFTSFs0XTtcbiAgICAgICAgICBmID0gSEFTSFs1XTtcbiAgICAgICAgICBnID0gSEFTSFs2XTtcbiAgICAgICAgICBoID0gSEFTSFs3XTtcblxuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCA2NDsgaiArPSAxKSB7XG4gICAgICAgICAgICBpZiAoaiA8IDE2KSB7XG4gICAgICAgICAgICAgIFdbal0gPSBtW2ogKyBpXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIFdbal0gPSBzYWZlX2FkZChzYWZlX2FkZChzYWZlX2FkZChzaGEyNTZfR2FtbWExMjU2KFdbaiAtIDJdKSwgV1tqIC0gN10pLFxuICAgICAgICAgICAgICAgIHNoYTI1Nl9HYW1tYTAyNTYoV1tqIC0gMTVdKSksIFdbaiAtIDE2XSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFQxID0gc2FmZV9hZGQoc2FmZV9hZGQoc2FmZV9hZGQoc2FmZV9hZGQoaCwgc2hhMjU2X1NpZ21hMTI1NihlKSksIHNoYTI1Nl9DaChlLCBmLCBnKSksXG4gICAgICAgICAgICAgIHNoYTI1Nl9LW2pdKSwgV1tqXSk7XG4gICAgICAgICAgICBUMiA9IHNhZmVfYWRkKHNoYTI1Nl9TaWdtYTAyNTYoYSksIHNoYTI1Nl9NYWooYSwgYiwgYykpO1xuICAgICAgICAgICAgaCA9IGc7XG4gICAgICAgICAgICBnID0gZjtcbiAgICAgICAgICAgIGYgPSBlO1xuICAgICAgICAgICAgZSA9IHNhZmVfYWRkKGQsIFQxKTtcbiAgICAgICAgICAgIGQgPSBjO1xuICAgICAgICAgICAgYyA9IGI7XG4gICAgICAgICAgICBiID0gYTtcbiAgICAgICAgICAgIGEgPSBzYWZlX2FkZChUMSwgVDIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIEhBU0hbMF0gPSBzYWZlX2FkZChhLCBIQVNIWzBdKTtcbiAgICAgICAgICBIQVNIWzFdID0gc2FmZV9hZGQoYiwgSEFTSFsxXSk7XG4gICAgICAgICAgSEFTSFsyXSA9IHNhZmVfYWRkKGMsIEhBU0hbMl0pO1xuICAgICAgICAgIEhBU0hbM10gPSBzYWZlX2FkZChkLCBIQVNIWzNdKTtcbiAgICAgICAgICBIQVNIWzRdID0gc2FmZV9hZGQoZSwgSEFTSFs0XSk7XG4gICAgICAgICAgSEFTSFs1XSA9IHNhZmVfYWRkKGYsIEhBU0hbNV0pO1xuICAgICAgICAgIEhBU0hbNl0gPSBzYWZlX2FkZChnLCBIQVNIWzZdKTtcbiAgICAgICAgICBIQVNIWzddID0gc2FmZV9hZGQoaCwgSEFTSFs3XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEhBU0g7XG4gICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIEhhc2hlcy5TSEE1MTJcbiAgICAgKiBAcGFyYW0ge2NvbmZpZ31cbiAgICAgKlxuICAgICAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgU2VjdXJlIEhhc2ggQWxnb3JpdGhtLCBTSEEtNTEyLCBhcyBkZWZpbmVkIGluIEZJUFMgMTgwLTJcbiAgICAgKiBWZXJzaW9uIDIuMiBDb3B5cmlnaHQgQW5vbnltb3VzIENvbnRyaWJ1dG9yLCBQYXVsIEpvaG5zdG9uIDIwMDAgLSAyMDA5LlxuICAgICAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcbiAgICAgKiBTZWUgaHR0cDovL3BhamhvbWUub3JnLnVrL2NyeXB0L21kNSBmb3IgZGV0YWlscy5cbiAgICAgKi9cbiAgICBTSEE1MTI6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIC8qKlxuICAgICAgICogUHJpdmF0ZSBwcm9wZXJ0aWVzIGNvbmZpZ3VyYXRpb24gdmFyaWFibGVzLiBZb3UgbWF5IG5lZWQgdG8gdHdlYWsgdGhlc2UgdG8gYmUgY29tcGF0aWJsZSB3aXRoXG4gICAgICAgKiB0aGUgc2VydmVyLXNpZGUsIGJ1dCB0aGUgZGVmYXVsdHMgd29yayBpbiBtb3N0IGNhc2VzLlxuICAgICAgICogQHNlZSB0aGlzLnNldFVwcGVyQ2FzZSgpIG1ldGhvZFxuICAgICAgICogQHNlZSB0aGlzLnNldFBhZCgpIG1ldGhvZFxuICAgICAgICovXG4gICAgICB2YXIgaGV4Y2FzZSA9IChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnVwcGVyY2FzZSA9PT0gJ2Jvb2xlYW4nKSA/IG9wdGlvbnMudXBwZXJjYXNlIDogZmFsc2UsXG4gICAgICAgIC8qIGhleGFkZWNpbWFsIG91dHB1dCBjYXNlIGZvcm1hdC4gZmFsc2UgLSBsb3dlcmNhc2U7IHRydWUgLSB1cHBlcmNhc2UgICovXG4gICAgICAgIGI2NHBhZCA9IChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnBhZCA9PT0gJ3N0cmluZycpID8gb3B0aW9ucy5wYWQgOiAnPScsXG4gICAgICAgIC8qIGJhc2UtNjQgcGFkIGNoYXJhY3Rlci4gRGVmYXVsdCAnPScgZm9yIHN0cmljdCBSRkMgY29tcGxpYW5jZSAgICovXG4gICAgICAgIHV0ZjggPSAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy51dGY4ID09PSAnYm9vbGVhbicpID8gb3B0aW9ucy51dGY4IDogdHJ1ZSxcbiAgICAgICAgLyogZW5hYmxlL2Rpc2FibGUgdXRmOCBlbmNvZGluZyAqL1xuICAgICAgICBzaGE1MTJfaztcblxuICAgICAgLyogcHJpdmlsZWdlZCAocHVibGljKSBtZXRob2RzICovXG4gICAgICB0aGlzLmhleCA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyaGV4KHJzdHIocykpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYjY0ID0gZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcnN0cjJiNjQocnN0cihzKSwgYjY0cGFkKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmFueSA9IGZ1bmN0aW9uKHMsIGUpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYW55KHJzdHIocyksIGUpO1xuICAgICAgfTtcbiAgICAgIHRoaXMucmF3ID0gZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcnN0cihzLCB1dGY4KTtcbiAgICAgIH07XG4gICAgICB0aGlzLmhleF9obWFjID0gZnVuY3Rpb24oaywgZCkge1xuICAgICAgICByZXR1cm4gcnN0cjJoZXgocnN0cl9obWFjKGssIGQpKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmI2NF9obWFjID0gZnVuY3Rpb24oaywgZCkge1xuICAgICAgICByZXR1cm4gcnN0cjJiNjQocnN0cl9obWFjKGssIGQpLCBiNjRwYWQpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYW55X2htYWMgPSBmdW5jdGlvbihrLCBkLCBlKSB7XG4gICAgICAgIHJldHVybiByc3RyMmFueShyc3RyX2htYWMoaywgZCksIGUpO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogUGVyZm9ybSBhIHNpbXBsZSBzZWxmLXRlc3QgdG8gc2VlIGlmIHRoZSBWTSBpcyB3b3JraW5nXG4gICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IEhleGFkZWNpbWFsIGhhc2ggc2FtcGxlXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICAgIHRoaXMudm1fdGVzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gaGV4KCdhYmMnKS50b0xvd2VyQ2FzZSgpID09PSAnOTAwMTUwOTgzY2QyNGZiMGQ2OTYzZjdkMjhlMTdmNzInO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogQGRlc2NyaXB0aW9uIEVuYWJsZS9kaXNhYmxlIHVwcGVyY2FzZSBoZXhhZGVjaW1hbCByZXR1cm5lZCBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn1cbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhpc1xuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgICB0aGlzLnNldFVwcGVyQ2FzZSA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICBoZXhjYXNlID0gYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIEBkZXNjcmlwdGlvbiBEZWZpbmVzIGEgYmFzZTY0IHBhZCBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBQYWRcbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhpc1xuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgICB0aGlzLnNldFBhZCA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgYjY0cGFkID0gYSB8fCBiNjRwYWQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogQGRlc2NyaXB0aW9uIERlZmluZXMgYSBiYXNlNjQgcGFkIHN0cmluZ1xuICAgICAgICogQHBhcmFtIHtib29sZWFufVxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2V0VVRGOCA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICB1dGY4ID0gYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG5cbiAgICAgIC8qIHByaXZhdGUgbWV0aG9kcyAqL1xuXG4gICAgICAvKipcbiAgICAgICAqIENhbGN1bGF0ZSB0aGUgU0hBLTUxMiBvZiBhIHJhdyBzdHJpbmdcbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiByc3RyKHMpIHtcbiAgICAgICAgcyA9ICh1dGY4KSA/IHV0ZjhFbmNvZGUocykgOiBzO1xuICAgICAgICByZXR1cm4gYmluYjJyc3RyKGJpbmIocnN0cjJiaW5iKHMpLCBzLmxlbmd0aCAqIDgpKTtcbiAgICAgIH1cbiAgICAgIC8qXG4gICAgICAgKiBDYWxjdWxhdGUgdGhlIEhNQUMtU0hBLTUxMiBvZiBhIGtleSBhbmQgc29tZSBkYXRhIChyYXcgc3RyaW5ncylcbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiByc3RyX2htYWMoa2V5LCBkYXRhKSB7XG4gICAgICAgIGtleSA9ICh1dGY4KSA/IHV0ZjhFbmNvZGUoa2V5KSA6IGtleTtcbiAgICAgICAgZGF0YSA9ICh1dGY4KSA/IHV0ZjhFbmNvZGUoZGF0YSkgOiBkYXRhO1xuXG4gICAgICAgIHZhciBoYXNoLCBpID0gMCxcbiAgICAgICAgICBia2V5ID0gcnN0cjJiaW5iKGtleSksXG4gICAgICAgICAgaXBhZCA9IEFycmF5KDMyKSxcbiAgICAgICAgICBvcGFkID0gQXJyYXkoMzIpO1xuXG4gICAgICAgIGlmIChia2V5Lmxlbmd0aCA+IDMyKSB7XG4gICAgICAgICAgYmtleSA9IGJpbmIoYmtleSwga2V5Lmxlbmd0aCAqIDgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICg7IGkgPCAzMjsgaSArPSAxKSB7XG4gICAgICAgICAgaXBhZFtpXSA9IGJrZXlbaV0gXiAweDM2MzYzNjM2O1xuICAgICAgICAgIG9wYWRbaV0gPSBia2V5W2ldIF4gMHg1QzVDNUM1QztcbiAgICAgICAgfVxuXG4gICAgICAgIGhhc2ggPSBiaW5iKGlwYWQuY29uY2F0KHJzdHIyYmluYihkYXRhKSksIDEwMjQgKyBkYXRhLmxlbmd0aCAqIDgpO1xuICAgICAgICByZXR1cm4gYmluYjJyc3RyKGJpbmIob3BhZC5jb25jYXQoaGFzaCksIDEwMjQgKyA1MTIpKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDYWxjdWxhdGUgdGhlIFNIQS01MTIgb2YgYW4gYXJyYXkgb2YgYmlnLWVuZGlhbiBkd29yZHMsIGFuZCBhIGJpdCBsZW5ndGhcbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiBiaW5iKHgsIGxlbikge1xuICAgICAgICB2YXIgaiwgaSwgbCxcbiAgICAgICAgICBXID0gbmV3IEFycmF5KDgwKSxcbiAgICAgICAgICBoYXNoID0gbmV3IEFycmF5KDE2KSxcbiAgICAgICAgICAvL0luaXRpYWwgaGFzaCB2YWx1ZXNcbiAgICAgICAgICBIID0gW1xuICAgICAgICAgICAgbmV3IGludDY0KDB4NmEwOWU2NjcsIC0yMDU3MzE1NzYpLFxuICAgICAgICAgICAgbmV3IGludDY0KC0xMTUwODMzMDE5LCAtMjA2NzA5MzcwMSksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHgzYzZlZjM3MiwgLTIzNzkxNTczKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtMTUyMTQ4NjUzNCwgMHg1ZjFkMzZmMSksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHg1MTBlNTI3ZiwgLTEzNzc0MDIxNTkpLFxuICAgICAgICAgICAgbmV3IGludDY0KC0xNjk0MTQ0MzcyLCAweDJiM2U2YzFmKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDFmODNkOWFiLCAtNzk1Nzc3NDkpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4NWJlMGNkMTksIDB4MTM3ZTIxNzkpXG4gICAgICAgICAgXSxcbiAgICAgICAgICBUMSA9IG5ldyBpbnQ2NCgwLCAwKSxcbiAgICAgICAgICBUMiA9IG5ldyBpbnQ2NCgwLCAwKSxcbiAgICAgICAgICBhID0gbmV3IGludDY0KDAsIDApLFxuICAgICAgICAgIGIgPSBuZXcgaW50NjQoMCwgMCksXG4gICAgICAgICAgYyA9IG5ldyBpbnQ2NCgwLCAwKSxcbiAgICAgICAgICBkID0gbmV3IGludDY0KDAsIDApLFxuICAgICAgICAgIGUgPSBuZXcgaW50NjQoMCwgMCksXG4gICAgICAgICAgZiA9IG5ldyBpbnQ2NCgwLCAwKSxcbiAgICAgICAgICBnID0gbmV3IGludDY0KDAsIDApLFxuICAgICAgICAgIGggPSBuZXcgaW50NjQoMCwgMCksXG4gICAgICAgICAgLy9UZW1wb3JhcnkgdmFyaWFibGVzIG5vdCBzcGVjaWZpZWQgYnkgdGhlIGRvY3VtZW50XG4gICAgICAgICAgczAgPSBuZXcgaW50NjQoMCwgMCksXG4gICAgICAgICAgczEgPSBuZXcgaW50NjQoMCwgMCksXG4gICAgICAgICAgQ2ggPSBuZXcgaW50NjQoMCwgMCksXG4gICAgICAgICAgTWFqID0gbmV3IGludDY0KDAsIDApLFxuICAgICAgICAgIHIxID0gbmV3IGludDY0KDAsIDApLFxuICAgICAgICAgIHIyID0gbmV3IGludDY0KDAsIDApLFxuICAgICAgICAgIHIzID0gbmV3IGludDY0KDAsIDApO1xuXG4gICAgICAgIGlmIChzaGE1MTJfayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgLy9TSEE1MTIgY29uc3RhbnRzXG4gICAgICAgICAgc2hhNTEyX2sgPSBbXG4gICAgICAgICAgICBuZXcgaW50NjQoMHg0MjhhMmY5OCwgLTY4NTE5OTgzOCksIG5ldyBpbnQ2NCgweDcxMzc0NDkxLCAweDIzZWY2NWNkKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtMTI0NTY0MzgyNSwgLTMzMDQ4Mjg5NyksIG5ldyBpbnQ2NCgtMzczOTU3NzIzLCAtMjEyMTY3MTc0OCksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHgzOTU2YzI1YiwgLTIxMzMzODgyNCksIG5ldyBpbnQ2NCgweDU5ZjExMWYxLCAtMTI0MTEzMzAzMSksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTE4NDEzMzE1NDgsIC0xMzU3Mjk1NzE3KSwgbmV3IGludDY0KC0xNDI0MjA0MDc1LCAtNjMwMzU3NzM2KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtNjcwNTg2MjE2LCAtMTU2MDA4MzkwMiksIG5ldyBpbnQ2NCgweDEyODM1YjAxLCAweDQ1NzA2ZmJlKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDI0MzE4NWJlLCAweDRlZTRiMjhjKSwgbmV3IGludDY0KDB4NTUwYzdkYzMsIC03MDQ2NjIzMDIpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4NzJiZTVkNzQsIC0yMjY3ODQ5MTMpLCBuZXcgaW50NjQoLTIxMzI4ODkwOTAsIDB4M2IxNjk2YjEpLFxuICAgICAgICAgICAgbmV3IGludDY0KC0xNjgwMDc5MTkzLCAweDI1YzcxMjM1KSwgbmV3IGludDY0KC0xMDQ2NzQ0NzE2LCAtODE1MTkyNDI4KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtNDU5NTc2ODk1LCAtMTYyODM1MzgzOCksIG5ldyBpbnQ2NCgtMjcyNzQyNTIyLCAweDM4NGYyNWUzKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweGZjMTlkYzYsIC0xOTUzNzA0NTIzKSwgbmV3IGludDY0KDB4MjQwY2ExY2MsIDB4NzdhYzljNjUpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4MmRlOTJjNmYsIDB4NTkyYjAyNzUpLCBuZXcgaW50NjQoMHg0YTc0ODRhYSwgMHg2ZWE2ZTQ4MyksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHg1Y2IwYTlkYywgLTExMTk3NDkxNjQpLCBuZXcgaW50NjQoMHg3NmY5ODhkYSwgLTIwOTYwMTY0NTkpLFxuICAgICAgICAgICAgbmV3IGludDY0KC0xNzQwNzQ2NDE0LCAtMjk1MjQ3OTU3KSwgbmV3IGludDY0KC0xNDczMTMyOTQ3LCAweDJkYjQzMjEwKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtMTM0MTk3MDQ4OCwgLTE3MjgzNzI0MTcpLCBuZXcgaW50NjQoLTEwODQ2NTM2MjUsIC0xMDkxNjI5MzQwKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtOTU4Mzk1NDA1LCAweDNkYTg4ZmMyKSwgbmV3IGludDY0KC03MTA0Mzg1ODUsIC0xODI4MDE4Mzk1KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDZjYTYzNTEsIC01MzY2NDA5MTMpLCBuZXcgaW50NjQoMHgxNDI5Mjk2NywgMHhhMGU2ZTcwKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDI3YjcwYTg1LCAweDQ2ZDIyZmZjKSwgbmV3IGludDY0KDB4MmUxYjIxMzgsIDB4NWMyNmM5MjYpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4NGQyYzZkZmMsIDB4NWFjNDJhZWQpLCBuZXcgaW50NjQoMHg1MzM4MGQxMywgLTE2NTExMzM0NzMpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4NjUwYTczNTQsIC0xOTUxNDM5OTA2KSwgbmV3IGludDY0KDB4NzY2YTBhYmIsIDB4M2M3N2IyYTgpLFxuICAgICAgICAgICAgbmV3IGludDY0KC0yMTE3OTQwOTQ2LCAweDQ3ZWRhZWU2KSwgbmV3IGludDY0KC0xODM4MDExMjU5LCAweDE0ODIzNTNiKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtMTU2NDQ4MTM3NSwgMHg0Y2YxMDM2NCksIG5ldyBpbnQ2NCgtMTQ3NDY2NDg4NSwgLTExMzY1MTMwMjMpLFxuICAgICAgICAgICAgbmV3IGludDY0KC0xMDM1MjM2NDk2LCAtNzg5MDE0NjM5KSwgbmV3IGludDY0KC05NDkyMDI1MjUsIDB4NjU0YmUzMCksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTc3ODkwMTQ3OSwgLTY4ODk1ODk1MiksIG5ldyBpbnQ2NCgtNjk0NjE0NDkyLCAweDU1NjVhOTEwKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtMjAwMzk1Mzg3LCAweDU3NzEyMDJhKSwgbmV3IGludDY0KDB4MTA2YWEwNzAsIDB4MzJiYmQxYjgpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4MTlhNGMxMTYsIC0xMTk0MTQzNTQ0KSwgbmV3IGludDY0KDB4MWUzNzZjMDgsIDB4NTE0MWFiNTMpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4Mjc0ODc3NGMsIC01NDQyODE3MDMpLCBuZXcgaW50NjQoMHgzNGIwYmNiNSwgLTUwOTkxNzAxNiksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHgzOTFjMGNiMywgLTk3NjY1OTg2OSksIG5ldyBpbnQ2NCgweDRlZDhhYTRhLCAtNDgyMjQzODkzKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDViOWNjYTRmLCAweDc3NjNlMzczKSwgbmV3IGludDY0KDB4NjgyZTZmZjMsIC02OTI5MzAzOTcpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4NzQ4ZjgyZWUsIDB4NWRlZmIyZmMpLCBuZXcgaW50NjQoMHg3OGE1NjM2ZiwgMHg0MzE3MmY2MCksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTIwNjcyMzY4NDQsIC0xNTc4MDYyOTkwKSwgbmV3IGludDY0KC0xOTMzMTE0ODcyLCAweDFhNjQzOWVjKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtMTg2NjUzMDgyMiwgMHgyMzYzMWUyOCksIG5ldyBpbnQ2NCgtMTUzODIzMzEwOSwgLTU2MTg1NzA0NyksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTEwOTA5MzU4MTcsIC0xMjk1NjE1NzIzKSwgbmV3IGludDY0KC05NjU2NDE5OTgsIC00NzkwNDY4NjkpLFxuICAgICAgICAgICAgbmV3IGludDY0KC05MDMzOTc2ODIsIC0zNjY1ODMzOTYpLCBuZXcgaW50NjQoLTc3OTcwMDAyNSwgMHgyMWMwYzIwNyksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTM1NDc3OTY5MCwgLTg0MDg5Nzc2MiksIG5ldyBpbnQ2NCgtMTc2MzM3MDI1LCAtMjk0NzI3MzA0KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDZmMDY3YWEsIDB4NzIxNzZmYmEpLCBuZXcgaW50NjQoMHhhNjM3ZGM1LCAtMTU2MzkxMjAyNiksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHgxMTNmOTgwNCwgLTEwOTA5NzQyOTApLCBuZXcgaW50NjQoMHgxYjcxMGIzNSwgMHgxMzFjNDcxYiksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHgyOGRiNzdmNSwgMHgyMzA0N2Q4NCksIG5ldyBpbnQ2NCgweDMyY2FhYjdiLCAweDQwYzcyNDkzKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDNjOWViZTBhLCAweDE1YzliZWJjKSwgbmV3IGludDY0KDB4NDMxZDY3YzQsIC0xNjc2NjY5NjIwKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDRjYzVkNGJlLCAtODg1MTEyMTM4KSwgbmV3IGludDY0KDB4NTk3ZjI5OWMsIC02MDQ1NzQzMCksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHg1ZmNiNmZhYiwgMHgzYWQ2ZmFlYyksIG5ldyBpbnQ2NCgweDZjNDQxOThjLCAweDRhNDc1ODE3KVxuICAgICAgICAgIF07XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgODA7IGkgKz0gMSkge1xuICAgICAgICAgIFdbaV0gPSBuZXcgaW50NjQoMCwgMCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhcHBlbmQgcGFkZGluZyB0byB0aGUgc291cmNlIHN0cmluZy4gVGhlIGZvcm1hdCBpcyBkZXNjcmliZWQgaW4gdGhlIEZJUFMuXG4gICAgICAgIHhbbGVuID4+IDVdIHw9IDB4ODAgPDwgKDI0IC0gKGxlbiAmIDB4MWYpKTtcbiAgICAgICAgeFsoKGxlbiArIDEyOCA+PiAxMCkgPDwgNSkgKyAzMV0gPSBsZW47XG4gICAgICAgIGwgPSB4Lmxlbmd0aDtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMzIpIHsgLy8zMiBkd29yZHMgaXMgdGhlIGJsb2NrIHNpemVcbiAgICAgICAgICBpbnQ2NGNvcHkoYSwgSFswXSk7XG4gICAgICAgICAgaW50NjRjb3B5KGIsIEhbMV0pO1xuICAgICAgICAgIGludDY0Y29weShjLCBIWzJdKTtcbiAgICAgICAgICBpbnQ2NGNvcHkoZCwgSFszXSk7XG4gICAgICAgICAgaW50NjRjb3B5KGUsIEhbNF0pO1xuICAgICAgICAgIGludDY0Y29weShmLCBIWzVdKTtcbiAgICAgICAgICBpbnQ2NGNvcHkoZywgSFs2XSk7XG4gICAgICAgICAgaW50NjRjb3B5KGgsIEhbN10pO1xuXG4gICAgICAgICAgZm9yIChqID0gMDsgaiA8IDE2OyBqICs9IDEpIHtcbiAgICAgICAgICAgIFdbal0uaCA9IHhbaSArIDIgKiBqXTtcbiAgICAgICAgICAgIFdbal0ubCA9IHhbaSArIDIgKiBqICsgMV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yIChqID0gMTY7IGogPCA4MDsgaiArPSAxKSB7XG4gICAgICAgICAgICAvL3NpZ21hMVxuICAgICAgICAgICAgaW50NjRycm90KHIxLCBXW2ogLSAyXSwgMTkpO1xuICAgICAgICAgICAgaW50NjRyZXZycm90KHIyLCBXW2ogLSAyXSwgMjkpO1xuICAgICAgICAgICAgaW50NjRzaHIocjMsIFdbaiAtIDJdLCA2KTtcbiAgICAgICAgICAgIHMxLmwgPSByMS5sIF4gcjIubCBeIHIzLmw7XG4gICAgICAgICAgICBzMS5oID0gcjEuaCBeIHIyLmggXiByMy5oO1xuICAgICAgICAgICAgLy9zaWdtYTBcbiAgICAgICAgICAgIGludDY0cnJvdChyMSwgV1tqIC0gMTVdLCAxKTtcbiAgICAgICAgICAgIGludDY0cnJvdChyMiwgV1tqIC0gMTVdLCA4KTtcbiAgICAgICAgICAgIGludDY0c2hyKHIzLCBXW2ogLSAxNV0sIDcpO1xuICAgICAgICAgICAgczAubCA9IHIxLmwgXiByMi5sIF4gcjMubDtcbiAgICAgICAgICAgIHMwLmggPSByMS5oIF4gcjIuaCBeIHIzLmg7XG5cbiAgICAgICAgICAgIGludDY0YWRkNChXW2pdLCBzMSwgV1tqIC0gN10sIHMwLCBXW2ogLSAxNl0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCA4MDsgaiArPSAxKSB7XG4gICAgICAgICAgICAvL0NoXG4gICAgICAgICAgICBDaC5sID0gKGUubCAmIGYubCkgXiAofmUubCAmIGcubCk7XG4gICAgICAgICAgICBDaC5oID0gKGUuaCAmIGYuaCkgXiAofmUuaCAmIGcuaCk7XG5cbiAgICAgICAgICAgIC8vU2lnbWExXG4gICAgICAgICAgICBpbnQ2NHJyb3QocjEsIGUsIDE0KTtcbiAgICAgICAgICAgIGludDY0cnJvdChyMiwgZSwgMTgpO1xuICAgICAgICAgICAgaW50NjRyZXZycm90KHIzLCBlLCA5KTtcbiAgICAgICAgICAgIHMxLmwgPSByMS5sIF4gcjIubCBeIHIzLmw7XG4gICAgICAgICAgICBzMS5oID0gcjEuaCBeIHIyLmggXiByMy5oO1xuXG4gICAgICAgICAgICAvL1NpZ21hMFxuICAgICAgICAgICAgaW50NjRycm90KHIxLCBhLCAyOCk7XG4gICAgICAgICAgICBpbnQ2NHJldnJyb3QocjIsIGEsIDIpO1xuICAgICAgICAgICAgaW50NjRyZXZycm90KHIzLCBhLCA3KTtcbiAgICAgICAgICAgIHMwLmwgPSByMS5sIF4gcjIubCBeIHIzLmw7XG4gICAgICAgICAgICBzMC5oID0gcjEuaCBeIHIyLmggXiByMy5oO1xuXG4gICAgICAgICAgICAvL01halxuICAgICAgICAgICAgTWFqLmwgPSAoYS5sICYgYi5sKSBeIChhLmwgJiBjLmwpIF4gKGIubCAmIGMubCk7XG4gICAgICAgICAgICBNYWouaCA9IChhLmggJiBiLmgpIF4gKGEuaCAmIGMuaCkgXiAoYi5oICYgYy5oKTtcblxuICAgICAgICAgICAgaW50NjRhZGQ1KFQxLCBoLCBzMSwgQ2gsIHNoYTUxMl9rW2pdLCBXW2pdKTtcbiAgICAgICAgICAgIGludDY0YWRkKFQyLCBzMCwgTWFqKTtcblxuICAgICAgICAgICAgaW50NjRjb3B5KGgsIGcpO1xuICAgICAgICAgICAgaW50NjRjb3B5KGcsIGYpO1xuICAgICAgICAgICAgaW50NjRjb3B5KGYsIGUpO1xuICAgICAgICAgICAgaW50NjRhZGQoZSwgZCwgVDEpO1xuICAgICAgICAgICAgaW50NjRjb3B5KGQsIGMpO1xuICAgICAgICAgICAgaW50NjRjb3B5KGMsIGIpO1xuICAgICAgICAgICAgaW50NjRjb3B5KGIsIGEpO1xuICAgICAgICAgICAgaW50NjRhZGQoYSwgVDEsIFQyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW50NjRhZGQoSFswXSwgSFswXSwgYSk7XG4gICAgICAgICAgaW50NjRhZGQoSFsxXSwgSFsxXSwgYik7XG4gICAgICAgICAgaW50NjRhZGQoSFsyXSwgSFsyXSwgYyk7XG4gICAgICAgICAgaW50NjRhZGQoSFszXSwgSFszXSwgZCk7XG4gICAgICAgICAgaW50NjRhZGQoSFs0XSwgSFs0XSwgZSk7XG4gICAgICAgICAgaW50NjRhZGQoSFs1XSwgSFs1XSwgZik7XG4gICAgICAgICAgaW50NjRhZGQoSFs2XSwgSFs2XSwgZyk7XG4gICAgICAgICAgaW50NjRhZGQoSFs3XSwgSFs3XSwgaCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL3JlcHJlc2VudCB0aGUgaGFzaCBhcyBhbiBhcnJheSBvZiAzMi1iaXQgZHdvcmRzXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCA4OyBpICs9IDEpIHtcbiAgICAgICAgICBoYXNoWzIgKiBpXSA9IEhbaV0uaDtcbiAgICAgICAgICBoYXNoWzIgKiBpICsgMV0gPSBIW2ldLmw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhc2g7XG4gICAgICB9XG5cbiAgICAgIC8vQSBjb25zdHJ1Y3RvciBmb3IgNjQtYml0IG51bWJlcnNcblxuICAgICAgZnVuY3Rpb24gaW50NjQoaCwgbCkge1xuICAgICAgICB0aGlzLmggPSBoO1xuICAgICAgICB0aGlzLmwgPSBsO1xuICAgICAgICAvL3RoaXMudG9TdHJpbmcgPSBpbnQ2NHRvU3RyaW5nO1xuICAgICAgfVxuXG4gICAgICAvL0NvcGllcyBzcmMgaW50byBkc3QsIGFzc3VtaW5nIGJvdGggYXJlIDY0LWJpdCBudW1iZXJzXG5cbiAgICAgIGZ1bmN0aW9uIGludDY0Y29weShkc3QsIHNyYykge1xuICAgICAgICBkc3QuaCA9IHNyYy5oO1xuICAgICAgICBkc3QubCA9IHNyYy5sO1xuICAgICAgfVxuXG4gICAgICAvL1JpZ2h0LXJvdGF0ZXMgYSA2NC1iaXQgbnVtYmVyIGJ5IHNoaWZ0XG4gICAgICAvL1dvbid0IGhhbmRsZSBjYXNlcyBvZiBzaGlmdD49MzJcbiAgICAgIC8vVGhlIGZ1bmN0aW9uIHJldnJyb3QoKSBpcyBmb3IgdGhhdFxuXG4gICAgICBmdW5jdGlvbiBpbnQ2NHJyb3QoZHN0LCB4LCBzaGlmdCkge1xuICAgICAgICBkc3QubCA9ICh4LmwgPj4+IHNoaWZ0KSB8ICh4LmggPDwgKDMyIC0gc2hpZnQpKTtcbiAgICAgICAgZHN0LmggPSAoeC5oID4+PiBzaGlmdCkgfCAoeC5sIDw8ICgzMiAtIHNoaWZ0KSk7XG4gICAgICB9XG5cbiAgICAgIC8vUmV2ZXJzZXMgdGhlIGR3b3JkcyBvZiB0aGUgc291cmNlIGFuZCB0aGVuIHJvdGF0ZXMgcmlnaHQgYnkgc2hpZnQuXG4gICAgICAvL1RoaXMgaXMgZXF1aXZhbGVudCB0byByb3RhdGlvbiBieSAzMitzaGlmdFxuXG4gICAgICBmdW5jdGlvbiBpbnQ2NHJldnJyb3QoZHN0LCB4LCBzaGlmdCkge1xuICAgICAgICBkc3QubCA9ICh4LmggPj4+IHNoaWZ0KSB8ICh4LmwgPDwgKDMyIC0gc2hpZnQpKTtcbiAgICAgICAgZHN0LmggPSAoeC5sID4+PiBzaGlmdCkgfCAoeC5oIDw8ICgzMiAtIHNoaWZ0KSk7XG4gICAgICB9XG5cbiAgICAgIC8vQml0d2lzZS1zaGlmdHMgcmlnaHQgYSA2NC1iaXQgbnVtYmVyIGJ5IHNoaWZ0XG4gICAgICAvL1dvbid0IGhhbmRsZSBzaGlmdD49MzIsIGJ1dCBpdCdzIG5ldmVyIG5lZWRlZCBpbiBTSEE1MTJcblxuICAgICAgZnVuY3Rpb24gaW50NjRzaHIoZHN0LCB4LCBzaGlmdCkge1xuICAgICAgICBkc3QubCA9ICh4LmwgPj4+IHNoaWZ0KSB8ICh4LmggPDwgKDMyIC0gc2hpZnQpKTtcbiAgICAgICAgZHN0LmggPSAoeC5oID4+PiBzaGlmdCk7XG4gICAgICB9XG5cbiAgICAgIC8vQWRkcyB0d28gNjQtYml0IG51bWJlcnNcbiAgICAgIC8vTGlrZSB0aGUgb3JpZ2luYWwgaW1wbGVtZW50YXRpb24sIGRvZXMgbm90IHJlbHkgb24gMzItYml0IG9wZXJhdGlvbnNcblxuICAgICAgZnVuY3Rpb24gaW50NjRhZGQoZHN0LCB4LCB5KSB7XG4gICAgICAgIHZhciB3MCA9ICh4LmwgJiAweGZmZmYpICsgKHkubCAmIDB4ZmZmZik7XG4gICAgICAgIHZhciB3MSA9ICh4LmwgPj4+IDE2KSArICh5LmwgPj4+IDE2KSArICh3MCA+Pj4gMTYpO1xuICAgICAgICB2YXIgdzIgPSAoeC5oICYgMHhmZmZmKSArICh5LmggJiAweGZmZmYpICsgKHcxID4+PiAxNik7XG4gICAgICAgIHZhciB3MyA9ICh4LmggPj4+IDE2KSArICh5LmggPj4+IDE2KSArICh3MiA+Pj4gMTYpO1xuICAgICAgICBkc3QubCA9ICh3MCAmIDB4ZmZmZikgfCAodzEgPDwgMTYpO1xuICAgICAgICBkc3QuaCA9ICh3MiAmIDB4ZmZmZikgfCAodzMgPDwgMTYpO1xuICAgICAgfVxuXG4gICAgICAvL1NhbWUsIGV4Y2VwdCB3aXRoIDQgYWRkZW5kcy4gV29ya3MgZmFzdGVyIHRoYW4gYWRkaW5nIHRoZW0gb25lIGJ5IG9uZS5cblxuICAgICAgZnVuY3Rpb24gaW50NjRhZGQ0KGRzdCwgYSwgYiwgYywgZCkge1xuICAgICAgICB2YXIgdzAgPSAoYS5sICYgMHhmZmZmKSArIChiLmwgJiAweGZmZmYpICsgKGMubCAmIDB4ZmZmZikgKyAoZC5sICYgMHhmZmZmKTtcbiAgICAgICAgdmFyIHcxID0gKGEubCA+Pj4gMTYpICsgKGIubCA+Pj4gMTYpICsgKGMubCA+Pj4gMTYpICsgKGQubCA+Pj4gMTYpICsgKHcwID4+PiAxNik7XG4gICAgICAgIHZhciB3MiA9IChhLmggJiAweGZmZmYpICsgKGIuaCAmIDB4ZmZmZikgKyAoYy5oICYgMHhmZmZmKSArIChkLmggJiAweGZmZmYpICsgKHcxID4+PiAxNik7XG4gICAgICAgIHZhciB3MyA9IChhLmggPj4+IDE2KSArIChiLmggPj4+IDE2KSArIChjLmggPj4+IDE2KSArIChkLmggPj4+IDE2KSArICh3MiA+Pj4gMTYpO1xuICAgICAgICBkc3QubCA9ICh3MCAmIDB4ZmZmZikgfCAodzEgPDwgMTYpO1xuICAgICAgICBkc3QuaCA9ICh3MiAmIDB4ZmZmZikgfCAodzMgPDwgMTYpO1xuICAgICAgfVxuXG4gICAgICAvL1NhbWUsIGV4Y2VwdCB3aXRoIDUgYWRkZW5kc1xuXG4gICAgICBmdW5jdGlvbiBpbnQ2NGFkZDUoZHN0LCBhLCBiLCBjLCBkLCBlKSB7XG4gICAgICAgIHZhciB3MCA9IChhLmwgJiAweGZmZmYpICsgKGIubCAmIDB4ZmZmZikgKyAoYy5sICYgMHhmZmZmKSArIChkLmwgJiAweGZmZmYpICsgKGUubCAmIDB4ZmZmZiksXG4gICAgICAgICAgdzEgPSAoYS5sID4+PiAxNikgKyAoYi5sID4+PiAxNikgKyAoYy5sID4+PiAxNikgKyAoZC5sID4+PiAxNikgKyAoZS5sID4+PiAxNikgKyAodzAgPj4+IDE2KSxcbiAgICAgICAgICB3MiA9IChhLmggJiAweGZmZmYpICsgKGIuaCAmIDB4ZmZmZikgKyAoYy5oICYgMHhmZmZmKSArIChkLmggJiAweGZmZmYpICsgKGUuaCAmIDB4ZmZmZikgKyAodzEgPj4+IDE2KSxcbiAgICAgICAgICB3MyA9IChhLmggPj4+IDE2KSArIChiLmggPj4+IDE2KSArIChjLmggPj4+IDE2KSArIChkLmggPj4+IDE2KSArIChlLmggPj4+IDE2KSArICh3MiA+Pj4gMTYpO1xuICAgICAgICBkc3QubCA9ICh3MCAmIDB4ZmZmZikgfCAodzEgPDwgMTYpO1xuICAgICAgICBkc3QuaCA9ICh3MiAmIDB4ZmZmZikgfCAodzMgPDwgMTYpO1xuICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogQGNsYXNzIEhhc2hlcy5STUQxNjBcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZ11cbiAgICAgKlxuICAgICAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgUklQRU1ELTE2MCBBbGdvcml0aG1cbiAgICAgKiBWZXJzaW9uIDIuMiBDb3B5cmlnaHQgSmVyZW15IExpbiwgUGF1bCBKb2huc3RvbiAyMDAwIC0gMjAwOS5cbiAgICAgKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XG4gICAgICogU2VlIGh0dHA6Ly9wYWpob21lLm9yZy51ay9jcnlwdC9tZDUgZm9yIGRldGFpbHMuXG4gICAgICogQWxzbyBodHRwOi8vd3d3Lm9jZi5iZXJrZWxleS5lZHUvfmpqbGluL2pzb3RwL1xuICAgICAqL1xuICAgIFJNRDE2MDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgLyoqXG4gICAgICAgKiBQcml2YXRlIHByb3BlcnRpZXMgY29uZmlndXJhdGlvbiB2YXJpYWJsZXMuIFlvdSBtYXkgbmVlZCB0byB0d2VhayB0aGVzZSB0byBiZSBjb21wYXRpYmxlIHdpdGhcbiAgICAgICAqIHRoZSBzZXJ2ZXItc2lkZSwgYnV0IHRoZSBkZWZhdWx0cyB3b3JrIGluIG1vc3QgY2FzZXMuXG4gICAgICAgKiBAc2VlIHRoaXMuc2V0VXBwZXJDYXNlKCkgbWV0aG9kXG4gICAgICAgKiBAc2VlIHRoaXMuc2V0UGFkKCkgbWV0aG9kXG4gICAgICAgKi9cbiAgICAgIHZhciBoZXhjYXNlID0gKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMudXBwZXJjYXNlID09PSAnYm9vbGVhbicpID8gb3B0aW9ucy51cHBlcmNhc2UgOiBmYWxzZSxcbiAgICAgICAgLyogaGV4YWRlY2ltYWwgb3V0cHV0IGNhc2UgZm9ybWF0LiBmYWxzZSAtIGxvd2VyY2FzZTsgdHJ1ZSAtIHVwcGVyY2FzZSAgKi9cbiAgICAgICAgYjY0cGFkID0gKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMucGFkID09PSAnc3RyaW5nJykgPyBvcHRpb25zLnBhIDogJz0nLFxuICAgICAgICAvKiBiYXNlLTY0IHBhZCBjaGFyYWN0ZXIuIERlZmF1bHQgJz0nIGZvciBzdHJpY3QgUkZDIGNvbXBsaWFuY2UgICAqL1xuICAgICAgICB1dGY4ID0gKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMudXRmOCA9PT0gJ2Jvb2xlYW4nKSA/IG9wdGlvbnMudXRmOCA6IHRydWUsXG4gICAgICAgIC8qIGVuYWJsZS9kaXNhYmxlIHV0ZjggZW5jb2RpbmcgKi9cbiAgICAgICAgcm1kMTYwX3IxID0gW1xuICAgICAgICAgIDAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsXG4gICAgICAgICAgNywgNCwgMTMsIDEsIDEwLCA2LCAxNSwgMywgMTIsIDAsIDksIDUsIDIsIDE0LCAxMSwgOCxcbiAgICAgICAgICAzLCAxMCwgMTQsIDQsIDksIDE1LCA4LCAxLCAyLCA3LCAwLCA2LCAxMywgMTEsIDUsIDEyLFxuICAgICAgICAgIDEsIDksIDExLCAxMCwgMCwgOCwgMTIsIDQsIDEzLCAzLCA3LCAxNSwgMTQsIDUsIDYsIDIsXG4gICAgICAgICAgNCwgMCwgNSwgOSwgNywgMTIsIDIsIDEwLCAxNCwgMSwgMywgOCwgMTEsIDYsIDE1LCAxM1xuICAgICAgICBdLFxuICAgICAgICBybWQxNjBfcjIgPSBbXG4gICAgICAgICAgNSwgMTQsIDcsIDAsIDksIDIsIDExLCA0LCAxMywgNiwgMTUsIDgsIDEsIDEwLCAzLCAxMixcbiAgICAgICAgICA2LCAxMSwgMywgNywgMCwgMTMsIDUsIDEwLCAxNCwgMTUsIDgsIDEyLCA0LCA5LCAxLCAyLFxuICAgICAgICAgIDE1LCA1LCAxLCAzLCA3LCAxNCwgNiwgOSwgMTEsIDgsIDEyLCAyLCAxMCwgMCwgNCwgMTMsXG4gICAgICAgICAgOCwgNiwgNCwgMSwgMywgMTEsIDE1LCAwLCA1LCAxMiwgMiwgMTMsIDksIDcsIDEwLCAxNCxcbiAgICAgICAgICAxMiwgMTUsIDEwLCA0LCAxLCA1LCA4LCA3LCA2LCAyLCAxMywgMTQsIDAsIDMsIDksIDExXG4gICAgICAgIF0sXG4gICAgICAgIHJtZDE2MF9zMSA9IFtcbiAgICAgICAgICAxMSwgMTQsIDE1LCAxMiwgNSwgOCwgNywgOSwgMTEsIDEzLCAxNCwgMTUsIDYsIDcsIDksIDgsXG4gICAgICAgICAgNywgNiwgOCwgMTMsIDExLCA5LCA3LCAxNSwgNywgMTIsIDE1LCA5LCAxMSwgNywgMTMsIDEyLFxuICAgICAgICAgIDExLCAxMywgNiwgNywgMTQsIDksIDEzLCAxNSwgMTQsIDgsIDEzLCA2LCA1LCAxMiwgNywgNSxcbiAgICAgICAgICAxMSwgMTIsIDE0LCAxNSwgMTQsIDE1LCA5LCA4LCA5LCAxNCwgNSwgNiwgOCwgNiwgNSwgMTIsXG4gICAgICAgICAgOSwgMTUsIDUsIDExLCA2LCA4LCAxMywgMTIsIDUsIDEyLCAxMywgMTQsIDExLCA4LCA1LCA2XG4gICAgICAgIF0sXG4gICAgICAgIHJtZDE2MF9zMiA9IFtcbiAgICAgICAgICA4LCA5LCA5LCAxMSwgMTMsIDE1LCAxNSwgNSwgNywgNywgOCwgMTEsIDE0LCAxNCwgMTIsIDYsXG4gICAgICAgICAgOSwgMTMsIDE1LCA3LCAxMiwgOCwgOSwgMTEsIDcsIDcsIDEyLCA3LCA2LCAxNSwgMTMsIDExLFxuICAgICAgICAgIDksIDcsIDE1LCAxMSwgOCwgNiwgNiwgMTQsIDEyLCAxMywgNSwgMTQsIDEzLCAxMywgNywgNSxcbiAgICAgICAgICAxNSwgNSwgOCwgMTEsIDE0LCAxNCwgNiwgMTQsIDYsIDksIDEyLCA5LCAxMiwgNSwgMTUsIDgsXG4gICAgICAgICAgOCwgNSwgMTIsIDksIDEyLCA1LCAxNCwgNiwgOCwgMTMsIDYsIDUsIDE1LCAxMywgMTEsIDExXG4gICAgICAgIF07XG5cbiAgICAgIC8qIHByaXZpbGVnZWQgKHB1YmxpYykgbWV0aG9kcyAqL1xuICAgICAgdGhpcy5oZXggPSBmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiByc3RyMmhleChyc3RyKHMsIHV0ZjgpKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmI2NCA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYjY0KHJzdHIocywgdXRmOCksIGI2NHBhZCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5hbnkgPSBmdW5jdGlvbihzLCBlKSB7XG4gICAgICAgIHJldHVybiByc3RyMmFueShyc3RyKHMsIHV0ZjgpLCBlKTtcbiAgICAgIH07XG4gICAgICB0aGlzLnJhdyA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIocywgdXRmOCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5oZXhfaG1hYyA9IGZ1bmN0aW9uKGssIGQpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyaGV4KHJzdHJfaG1hYyhrLCBkKSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5iNjRfaG1hYyA9IGZ1bmN0aW9uKGssIGQpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYjY0KHJzdHJfaG1hYyhrLCBkKSwgYjY0cGFkKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmFueV9obWFjID0gZnVuY3Rpb24oaywgZCwgZSkge1xuICAgICAgICByZXR1cm4gcnN0cjJhbnkocnN0cl9obWFjKGssIGQpLCBlKTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFBlcmZvcm0gYSBzaW1wbGUgc2VsZi10ZXN0IHRvIHNlZSBpZiB0aGUgVk0gaXMgd29ya2luZ1xuICAgICAgICogQHJldHVybiB7U3RyaW5nfSBIZXhhZGVjaW1hbCBoYXNoIHNhbXBsZVxuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgICB0aGlzLnZtX3Rlc3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGhleCgnYWJjJykudG9Mb3dlckNhc2UoKSA9PT0gJzkwMDE1MDk4M2NkMjRmYjBkNjk2M2Y3ZDI4ZTE3ZjcyJztcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIEBkZXNjcmlwdGlvbiBFbmFibGUvZGlzYWJsZSB1cHBlcmNhc2UgaGV4YWRlY2ltYWwgcmV0dXJuZWQgc3RyaW5nXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59XG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoaXNcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgICAgdGhpcy5zZXRVcHBlckNhc2UgPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgaGV4Y2FzZSA9IGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBAZGVzY3JpcHRpb24gRGVmaW5lcyBhIGJhc2U2NCBwYWQgc3RyaW5nXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gUGFkXG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoaXNcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgICAgdGhpcy5zZXRQYWQgPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICBiNjRwYWQgPSBhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogQGRlc2NyaXB0aW9uIERlZmluZXMgYSBiYXNlNjQgcGFkIHN0cmluZ1xuICAgICAgICogQHBhcmFtIHtib29sZWFufVxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2V0VVRGOCA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICB1dGY4ID0gYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG5cbiAgICAgIC8qIHByaXZhdGUgbWV0aG9kcyAqL1xuXG4gICAgICAvKipcbiAgICAgICAqIENhbGN1bGF0ZSB0aGUgcm1kMTYwIG9mIGEgcmF3IHN0cmluZ1xuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIHJzdHIocykge1xuICAgICAgICBzID0gKHV0ZjgpID8gdXRmOEVuY29kZShzKSA6IHM7XG4gICAgICAgIHJldHVybiBiaW5sMnJzdHIoYmlubChyc3RyMmJpbmwocyksIHMubGVuZ3RoICogOCkpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIENhbGN1bGF0ZSB0aGUgSE1BQy1ybWQxNjAgb2YgYSBrZXkgYW5kIHNvbWUgZGF0YSAocmF3IHN0cmluZ3MpXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gcnN0cl9obWFjKGtleSwgZGF0YSkge1xuICAgICAgICBrZXkgPSAodXRmOCkgPyB1dGY4RW5jb2RlKGtleSkgOiBrZXk7XG4gICAgICAgIGRhdGEgPSAodXRmOCkgPyB1dGY4RW5jb2RlKGRhdGEpIDogZGF0YTtcbiAgICAgICAgdmFyIGksIGhhc2gsXG4gICAgICAgICAgYmtleSA9IHJzdHIyYmlubChrZXkpLFxuICAgICAgICAgIGlwYWQgPSBBcnJheSgxNiksXG4gICAgICAgICAgb3BhZCA9IEFycmF5KDE2KTtcblxuICAgICAgICBpZiAoYmtleS5sZW5ndGggPiAxNikge1xuICAgICAgICAgIGJrZXkgPSBiaW5sKGJrZXksIGtleS5sZW5ndGggKiA4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxNjsgaSArPSAxKSB7XG4gICAgICAgICAgaXBhZFtpXSA9IGJrZXlbaV0gXiAweDM2MzYzNjM2O1xuICAgICAgICAgIG9wYWRbaV0gPSBia2V5W2ldIF4gMHg1QzVDNUM1QztcbiAgICAgICAgfVxuICAgICAgICBoYXNoID0gYmlubChpcGFkLmNvbmNhdChyc3RyMmJpbmwoZGF0YSkpLCA1MTIgKyBkYXRhLmxlbmd0aCAqIDgpO1xuICAgICAgICByZXR1cm4gYmlubDJyc3RyKGJpbmwob3BhZC5jb25jYXQoaGFzaCksIDUxMiArIDE2MCkpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIENvbnZlcnQgYW4gYXJyYXkgb2YgbGl0dGxlLWVuZGlhbiB3b3JkcyB0byBhIHN0cmluZ1xuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIGJpbmwycnN0cihpbnB1dCkge1xuICAgICAgICB2YXIgaSwgb3V0cHV0ID0gJycsXG4gICAgICAgICAgbCA9IGlucHV0Lmxlbmd0aCAqIDMyO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSA4KSB7XG4gICAgICAgICAgb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGlucHV0W2kgPj4gNV0gPj4+IChpICUgMzIpKSAmIDB4RkYpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ2FsY3VsYXRlIHRoZSBSSVBFLU1EMTYwIG9mIGFuIGFycmF5IG9mIGxpdHRsZS1lbmRpYW4gd29yZHMsIGFuZCBhIGJpdCBsZW5ndGguXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gYmlubCh4LCBsZW4pIHtcbiAgICAgICAgdmFyIFQsIGosIGksIGwsXG4gICAgICAgICAgaDAgPSAweDY3NDUyMzAxLFxuICAgICAgICAgIGgxID0gMHhlZmNkYWI4OSxcbiAgICAgICAgICBoMiA9IDB4OThiYWRjZmUsXG4gICAgICAgICAgaDMgPSAweDEwMzI1NDc2LFxuICAgICAgICAgIGg0ID0gMHhjM2QyZTFmMCxcbiAgICAgICAgICBBMSwgQjEsIEMxLCBEMSwgRTEsXG4gICAgICAgICAgQTIsIEIyLCBDMiwgRDIsIEUyO1xuXG4gICAgICAgIC8qIGFwcGVuZCBwYWRkaW5nICovXG4gICAgICAgIHhbbGVuID4+IDVdIHw9IDB4ODAgPDwgKGxlbiAlIDMyKTtcbiAgICAgICAgeFsoKChsZW4gKyA2NCkgPj4+IDkpIDw8IDQpICsgMTRdID0gbGVuO1xuICAgICAgICBsID0geC5sZW5ndGg7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMTYpIHtcbiAgICAgICAgICBBMSA9IEEyID0gaDA7XG4gICAgICAgICAgQjEgPSBCMiA9IGgxO1xuICAgICAgICAgIEMxID0gQzIgPSBoMjtcbiAgICAgICAgICBEMSA9IEQyID0gaDM7XG4gICAgICAgICAgRTEgPSBFMiA9IGg0O1xuICAgICAgICAgIGZvciAoaiA9IDA7IGogPD0gNzk7IGogKz0gMSkge1xuICAgICAgICAgICAgVCA9IHNhZmVfYWRkKEExLCBybWQxNjBfZihqLCBCMSwgQzEsIEQxKSk7XG4gICAgICAgICAgICBUID0gc2FmZV9hZGQoVCwgeFtpICsgcm1kMTYwX3IxW2pdXSk7XG4gICAgICAgICAgICBUID0gc2FmZV9hZGQoVCwgcm1kMTYwX0sxKGopKTtcbiAgICAgICAgICAgIFQgPSBzYWZlX2FkZChiaXRfcm9sKFQsIHJtZDE2MF9zMVtqXSksIEUxKTtcbiAgICAgICAgICAgIEExID0gRTE7XG4gICAgICAgICAgICBFMSA9IEQxO1xuICAgICAgICAgICAgRDEgPSBiaXRfcm9sKEMxLCAxMCk7XG4gICAgICAgICAgICBDMSA9IEIxO1xuICAgICAgICAgICAgQjEgPSBUO1xuICAgICAgICAgICAgVCA9IHNhZmVfYWRkKEEyLCBybWQxNjBfZig3OSAtIGosIEIyLCBDMiwgRDIpKTtcbiAgICAgICAgICAgIFQgPSBzYWZlX2FkZChULCB4W2kgKyBybWQxNjBfcjJbal1dKTtcbiAgICAgICAgICAgIFQgPSBzYWZlX2FkZChULCBybWQxNjBfSzIoaikpO1xuICAgICAgICAgICAgVCA9IHNhZmVfYWRkKGJpdF9yb2woVCwgcm1kMTYwX3MyW2pdKSwgRTIpO1xuICAgICAgICAgICAgQTIgPSBFMjtcbiAgICAgICAgICAgIEUyID0gRDI7XG4gICAgICAgICAgICBEMiA9IGJpdF9yb2woQzIsIDEwKTtcbiAgICAgICAgICAgIEMyID0gQjI7XG4gICAgICAgICAgICBCMiA9IFQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgVCA9IHNhZmVfYWRkKGgxLCBzYWZlX2FkZChDMSwgRDIpKTtcbiAgICAgICAgICBoMSA9IHNhZmVfYWRkKGgyLCBzYWZlX2FkZChEMSwgRTIpKTtcbiAgICAgICAgICBoMiA9IHNhZmVfYWRkKGgzLCBzYWZlX2FkZChFMSwgQTIpKTtcbiAgICAgICAgICBoMyA9IHNhZmVfYWRkKGg0LCBzYWZlX2FkZChBMSwgQjIpKTtcbiAgICAgICAgICBoNCA9IHNhZmVfYWRkKGgwLCBzYWZlX2FkZChCMSwgQzIpKTtcbiAgICAgICAgICBoMCA9IFQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtoMCwgaDEsIGgyLCBoMywgaDRdO1xuICAgICAgfVxuXG4gICAgICAvLyBzcGVjaWZpYyBhbGdvcml0aG0gbWV0aG9kc1xuXG4gICAgICBmdW5jdGlvbiBybWQxNjBfZihqLCB4LCB5LCB6KSB7XG4gICAgICAgIHJldHVybiAoMCA8PSBqICYmIGogPD0gMTUpID8gKHggXiB5IF4geikgOlxuICAgICAgICAgICgxNiA8PSBqICYmIGogPD0gMzEpID8gKHggJiB5KSB8ICh+eCAmIHopIDpcbiAgICAgICAgICAoMzIgPD0gaiAmJiBqIDw9IDQ3KSA/ICh4IHwgfnkpIF4geiA6XG4gICAgICAgICAgKDQ4IDw9IGogJiYgaiA8PSA2MykgPyAoeCAmIHopIHwgKHkgJiB+eikgOlxuICAgICAgICAgICg2NCA8PSBqICYmIGogPD0gNzkpID8geCBeICh5IHwgfnopIDpcbiAgICAgICAgICAncm1kMTYwX2Y6IGogb3V0IG9mIHJhbmdlJztcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcm1kMTYwX0sxKGopIHtcbiAgICAgICAgcmV0dXJuICgwIDw9IGogJiYgaiA8PSAxNSkgPyAweDAwMDAwMDAwIDpcbiAgICAgICAgICAoMTYgPD0gaiAmJiBqIDw9IDMxKSA/IDB4NWE4Mjc5OTkgOlxuICAgICAgICAgICgzMiA8PSBqICYmIGogPD0gNDcpID8gMHg2ZWQ5ZWJhMSA6XG4gICAgICAgICAgKDQ4IDw9IGogJiYgaiA8PSA2MykgPyAweDhmMWJiY2RjIDpcbiAgICAgICAgICAoNjQgPD0gaiAmJiBqIDw9IDc5KSA/IDB4YTk1M2ZkNGUgOlxuICAgICAgICAgICdybWQxNjBfSzE6IGogb3V0IG9mIHJhbmdlJztcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcm1kMTYwX0syKGopIHtcbiAgICAgICAgcmV0dXJuICgwIDw9IGogJiYgaiA8PSAxNSkgPyAweDUwYTI4YmU2IDpcbiAgICAgICAgICAoMTYgPD0gaiAmJiBqIDw9IDMxKSA/IDB4NWM0ZGQxMjQgOlxuICAgICAgICAgICgzMiA8PSBqICYmIGogPD0gNDcpID8gMHg2ZDcwM2VmMyA6XG4gICAgICAgICAgKDQ4IDw9IGogJiYgaiA8PSA2MykgPyAweDdhNmQ3NmU5IDpcbiAgICAgICAgICAoNjQgPD0gaiAmJiBqIDw9IDc5KSA/IDB4MDAwMDAwMDAgOlxuICAgICAgICAgICdybWQxNjBfSzI6IGogb3V0IG9mIHJhbmdlJztcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gZXhwb3NlcyBIYXNoZXNcbiAgKGZ1bmN0aW9uKHdpbmRvdywgdW5kZWZpbmVkKSB7XG4gICAgdmFyIGZyZWVFeHBvcnRzID0gZmFsc2U7XG4gICAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgZnJlZUV4cG9ydHMgPSBleHBvcnRzO1xuICAgICAgaWYgKGV4cG9ydHMgJiYgdHlwZW9mIGdsb2JhbCA9PT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbCA9PT0gZ2xvYmFsLmdsb2JhbCkge1xuICAgICAgICB3aW5kb3cgPSBnbG9iYWw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcbiAgICAgIC8vIGRlZmluZSBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLCBzbywgdGhyb3VnaCBwYXRoIG1hcHBpbmcsIGl0IGNhbiBiZSBhbGlhc2VkXG4gICAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBIYXNoZXM7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGZyZWVFeHBvcnRzKSB7XG4gICAgICAvLyBpbiBOb2RlLmpzIG9yIFJpbmdvSlMgdjAuOC4wK1xuICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZSAmJiBtb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBIYXNoZXM7XG4gICAgICB9XG4gICAgICAvLyBpbiBOYXJ3aGFsIG9yIFJpbmdvSlMgdjAuNy4wLVxuICAgICAgZWxzZSB7XG4gICAgICAgIGZyZWVFeHBvcnRzLkhhc2hlcyA9IEhhc2hlcztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaW4gYSBicm93c2VyIG9yIFJoaW5vXG4gICAgICB3aW5kb3cuSGFzaGVzID0gSGFzaGVzO1xuICAgIH1cbiAgfSh0aGlzKSk7XG59KCkpOyAvLyBJSUZFXG4iLCJmdW5jdGlvbiBBZ2VudCgpIHtcbiAgdGhpcy5fZGVmYXVsdHMgPSBbXTtcbn1cblxuW1widXNlXCIsIFwib25cIiwgXCJvbmNlXCIsIFwic2V0XCIsIFwicXVlcnlcIiwgXCJ0eXBlXCIsIFwiYWNjZXB0XCIsIFwiYXV0aFwiLCBcIndpdGhDcmVkZW50aWFsc1wiLCBcInNvcnRRdWVyeVwiLCBcInJldHJ5XCIsIFwib2tcIiwgXCJyZWRpcmVjdHNcIixcbiBcInRpbWVvdXRcIiwgXCJidWZmZXJcIiwgXCJzZXJpYWxpemVcIiwgXCJwYXJzZVwiLCBcImNhXCIsIFwia2V5XCIsIFwicGZ4XCIsIFwiY2VydFwiXS5mb3JFYWNoKGZ1bmN0aW9uKGZuKSB7XG4gIC8qKiBEZWZhdWx0IHNldHRpbmcgZm9yIGFsbCByZXF1ZXN0cyBmcm9tIHRoaXMgYWdlbnQgKi9cbiAgQWdlbnQucHJvdG90eXBlW2ZuXSA9IGZ1bmN0aW9uKC8qdmFyYXJncyovKSB7XG4gICAgdGhpcy5fZGVmYXVsdHMucHVzaCh7Zm46Zm4sIGFyZ3VtZW50czphcmd1bWVudHN9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufSk7XG5cbkFnZW50LnByb3RvdHlwZS5fc2V0RGVmYXVsdHMgPSBmdW5jdGlvbihyZXEpIHtcbiAgICB0aGlzLl9kZWZhdWx0cy5mb3JFYWNoKGZ1bmN0aW9uKGRlZikge1xuICAgICAgcmVxW2RlZi5mbl0uYXBwbHkocmVxLCBkZWYuYXJndW1lbnRzKTtcbiAgICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQWdlbnQ7XG4iLCIvKipcbiAqIFJvb3QgcmVmZXJlbmNlIGZvciBpZnJhbWVzLlxuICovXG5cbnZhciByb290O1xuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7IC8vIEJyb3dzZXIgd2luZG93XG4gIHJvb3QgPSB3aW5kb3c7XG59IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykgeyAvLyBXZWIgV29ya2VyXG4gIHJvb3QgPSBzZWxmO1xufSBlbHNlIHsgLy8gT3RoZXIgZW52aXJvbm1lbnRzXG4gIGNvbnNvbGUud2FybihcIlVzaW5nIGJyb3dzZXItb25seSB2ZXJzaW9uIG9mIHN1cGVyYWdlbnQgaW4gbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XG4gIHJvb3QgPSB0aGlzO1xufVxuXG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJ2NvbXBvbmVudC1lbWl0dGVyJyk7XG52YXIgUmVxdWVzdEJhc2UgPSByZXF1aXJlKCcuL3JlcXVlc3QtYmFzZScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pcy1vYmplY3QnKTtcbnZhciBSZXNwb25zZUJhc2UgPSByZXF1aXJlKCcuL3Jlc3BvbnNlLWJhc2UnKTtcbnZhciBBZ2VudCA9IHJlcXVpcmUoJy4vYWdlbnQtYmFzZScpO1xuXG4vKipcbiAqIE5vb3AuXG4gKi9cblxuZnVuY3Rpb24gbm9vcCgpe307XG5cbi8qKlxuICogRXhwb3NlIGByZXF1ZXN0YC5cbiAqL1xuXG52YXIgcmVxdWVzdCA9IGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1ldGhvZCwgdXJsKSB7XG4gIC8vIGNhbGxiYWNrXG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiB1cmwpIHtcbiAgICByZXR1cm4gbmV3IGV4cG9ydHMuUmVxdWVzdCgnR0VUJywgbWV0aG9kKS5lbmQodXJsKTtcbiAgfVxuXG4gIC8vIHVybCBmaXJzdFxuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBleHBvcnRzLlJlcXVlc3QoJ0dFVCcsIG1ldGhvZCk7XG4gIH1cblxuICByZXR1cm4gbmV3IGV4cG9ydHMuUmVxdWVzdChtZXRob2QsIHVybCk7XG59XG5cbmV4cG9ydHMuUmVxdWVzdCA9IFJlcXVlc3Q7XG5cbi8qKlxuICogRGV0ZXJtaW5lIFhIUi5cbiAqL1xuXG5yZXF1ZXN0LmdldFhIUiA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHJvb3QuWE1MSHR0cFJlcXVlc3RcbiAgICAgICYmICghcm9vdC5sb2NhdGlvbiB8fCAnZmlsZTonICE9IHJvb3QubG9jYXRpb24ucHJvdG9jb2xcbiAgICAgICAgICB8fCAhcm9vdC5BY3RpdmVYT2JqZWN0KSkge1xuICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3Q7XG4gIH0gZWxzZSB7XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUC42LjAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAuMy4wJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQJyk7IH0gY2F0Y2goZSkge31cbiAgfVxuICB0aHJvdyBFcnJvcihcIkJyb3dzZXItb25seSB2ZXJzaW9uIG9mIHN1cGVyYWdlbnQgY291bGQgbm90IGZpbmQgWEhSXCIpO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UsIGFkZGVkIHRvIHN1cHBvcnQgSUUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbnZhciB0cmltID0gJycudHJpbVxuICA/IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMudHJpbSgpOyB9XG4gIDogZnVuY3Rpb24ocykgeyByZXR1cm4gcy5yZXBsYWNlKC8oXlxccyp8XFxzKiQpL2csICcnKTsgfTtcblxuLyoqXG4gKiBTZXJpYWxpemUgdGhlIGdpdmVuIGBvYmpgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZShvYmopIHtcbiAgaWYgKCFpc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICB2YXIgcGFpcnMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIHB1c2hFbmNvZGVkS2V5VmFsdWVQYWlyKHBhaXJzLCBrZXksIG9ialtrZXldKTtcbiAgfVxuICByZXR1cm4gcGFpcnMuam9pbignJicpO1xufVxuXG4vKipcbiAqIEhlbHBzICdzZXJpYWxpemUnIHdpdGggc2VyaWFsaXppbmcgYXJyYXlzLlxuICogTXV0YXRlcyB0aGUgcGFpcnMgYXJyYXkuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcGFpcnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICovXG5cbmZ1bmN0aW9uIHB1c2hFbmNvZGVkS2V5VmFsdWVQYWlyKHBhaXJzLCBrZXksIHZhbCkge1xuICBpZiAodmFsICE9IG51bGwpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICB2YWwuZm9yRWFjaChmdW5jdGlvbih2KSB7XG4gICAgICAgIHB1c2hFbmNvZGVkS2V5VmFsdWVQYWlyKHBhaXJzLCBrZXksIHYpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChpc09iamVjdCh2YWwpKSB7XG4gICAgICBmb3IodmFyIHN1YmtleSBpbiB2YWwpIHtcbiAgICAgICAgcHVzaEVuY29kZWRLZXlWYWx1ZVBhaXIocGFpcnMsIGtleSArICdbJyArIHN1YmtleSArICddJywgdmFsW3N1YmtleV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwYWlycy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpXG4gICAgICAgICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbCkpO1xuICAgIH1cbiAgfSBlbHNlIGlmICh2YWwgPT09IG51bGwpIHtcbiAgICBwYWlycy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpKTtcbiAgfVxufVxuXG4vKipcbiAqIEV4cG9zZSBzZXJpYWxpemF0aW9uIG1ldGhvZC5cbiAqL1xuXG5yZXF1ZXN0LnNlcmlhbGl6ZU9iamVjdCA9IHNlcmlhbGl6ZTtcblxuLyoqXG4gICogUGFyc2UgdGhlIGdpdmVuIHgtd3d3LWZvcm0tdXJsZW5jb2RlZCBgc3RyYC5cbiAgKlxuICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICogQGFwaSBwcml2YXRlXG4gICovXG5cbmZ1bmN0aW9uIHBhcnNlU3RyaW5nKHN0cikge1xuICB2YXIgb2JqID0ge307XG4gIHZhciBwYWlycyA9IHN0ci5zcGxpdCgnJicpO1xuICB2YXIgcGFpcjtcbiAgdmFyIHBvcztcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gcGFpcnMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBwYWlyID0gcGFpcnNbaV07XG4gICAgcG9zID0gcGFpci5pbmRleE9mKCc9Jyk7XG4gICAgaWYgKHBvcyA9PSAtMSkge1xuICAgICAgb2JqW2RlY29kZVVSSUNvbXBvbmVudChwYWlyKV0gPSAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqW2RlY29kZVVSSUNvbXBvbmVudChwYWlyLnNsaWNlKDAsIHBvcykpXSA9XG4gICAgICAgIGRlY29kZVVSSUNvbXBvbmVudChwYWlyLnNsaWNlKHBvcyArIDEpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIEV4cG9zZSBwYXJzZXIuXG4gKi9cblxucmVxdWVzdC5wYXJzZVN0cmluZyA9IHBhcnNlU3RyaW5nO1xuXG4vKipcbiAqIERlZmF1bHQgTUlNRSB0eXBlIG1hcC5cbiAqXG4gKiAgICAgc3VwZXJhZ2VudC50eXBlcy54bWwgPSAnYXBwbGljYXRpb24veG1sJztcbiAqXG4gKi9cblxucmVxdWVzdC50eXBlcyA9IHtcbiAgaHRtbDogJ3RleHQvaHRtbCcsXG4gIGpzb246ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgeG1sOiAndGV4dC94bWwnLFxuICB1cmxlbmNvZGVkOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0nOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0tZGF0YSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG4vKipcbiAqIERlZmF1bHQgc2VyaWFsaXphdGlvbiBtYXAuXG4gKlxuICogICAgIHN1cGVyYWdlbnQuc2VyaWFsaXplWydhcHBsaWNhdGlvbi94bWwnXSA9IGZ1bmN0aW9uKG9iail7XG4gKiAgICAgICByZXR1cm4gJ2dlbmVyYXRlZCB4bWwgaGVyZSc7XG4gKiAgICAgfTtcbiAqXG4gKi9cblxucmVxdWVzdC5zZXJpYWxpemUgPSB7XG4gICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnOiBzZXJpYWxpemUsXG4gICdhcHBsaWNhdGlvbi9qc29uJzogSlNPTi5zdHJpbmdpZnksXG59O1xuXG4vKipcbiAgKiBEZWZhdWx0IHBhcnNlcnMuXG4gICpcbiAgKiAgICAgc3VwZXJhZ2VudC5wYXJzZVsnYXBwbGljYXRpb24veG1sJ10gPSBmdW5jdGlvbihzdHIpe1xuICAqICAgICAgIHJldHVybiB7IG9iamVjdCBwYXJzZWQgZnJvbSBzdHIgfTtcbiAgKiAgICAgfTtcbiAgKlxuICAqL1xuXG5yZXF1ZXN0LnBhcnNlID0ge1xuICAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJzogcGFyc2VTdHJpbmcsXG4gICdhcHBsaWNhdGlvbi9qc29uJzogSlNPTi5wYXJzZSxcbn07XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGhlYWRlciBgc3RyYCBpbnRvXG4gKiBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgbWFwcGVkIGZpZWxkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZUhlYWRlcihzdHIpIHtcbiAgdmFyIGxpbmVzID0gc3RyLnNwbGl0KC9cXHI/XFxuLyk7XG4gIHZhciBmaWVsZHMgPSB7fTtcbiAgdmFyIGluZGV4O1xuICB2YXIgbGluZTtcbiAgdmFyIGZpZWxkO1xuICB2YXIgdmFsO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGxpbmUgPSBsaW5lc1tpXTtcbiAgICBpbmRleCA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHsgLy8gY291bGQgYmUgZW1wdHkgbGluZSwganVzdCBza2lwIGl0XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgZmllbGQgPSBsaW5lLnNsaWNlKDAsIGluZGV4KS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhbCA9IHRyaW0obGluZS5zbGljZShpbmRleCArIDEpKTtcbiAgICBmaWVsZHNbZmllbGRdID0gdmFsO1xuICB9XG5cbiAgcmV0dXJuIGZpZWxkcztcbn1cblxuLyoqXG4gKiBDaGVjayBpZiBgbWltZWAgaXMganNvbiBvciBoYXMgK2pzb24gc3RydWN0dXJlZCBzeW50YXggc3VmZml4LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtaW1lXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNKU09OKG1pbWUpIHtcbiAgLy8gc2hvdWxkIG1hdGNoIC9qc29uIG9yICtqc29uXG4gIC8vIGJ1dCBub3QgL2pzb24tc2VxXG4gIHJldHVybiAvW1xcLytdanNvbigkfFteLVxcd10pLy50ZXN0KG1pbWUpO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlc3BvbnNlYCB3aXRoIHRoZSBnaXZlbiBgeGhyYC5cbiAqXG4gKiAgLSBzZXQgZmxhZ3MgKC5vaywgLmVycm9yLCBldGMpXG4gKiAgLSBwYXJzZSBoZWFkZXJcbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgQWxpYXNpbmcgYHN1cGVyYWdlbnRgIGFzIGByZXF1ZXN0YCBpcyBuaWNlOlxuICpcbiAqICAgICAgcmVxdWVzdCA9IHN1cGVyYWdlbnQ7XG4gKlxuICogIFdlIGNhbiB1c2UgdGhlIHByb21pc2UtbGlrZSBBUEksIG9yIHBhc3MgY2FsbGJhY2tzOlxuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nKS5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqICAgICAgcmVxdWVzdC5nZXQoJy8nLCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBTZW5kaW5nIGRhdGEgY2FuIGJlIGNoYWluZWQ6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIE9yIHBhc3NlZCB0byBgLnNlbmQoKWA6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgT3IgcGFzc2VkIHRvIGAucG9zdCgpYDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogT3IgZnVydGhlciByZWR1Y2VkIHRvIGEgc2luZ2xlIGNhbGwgZm9yIHNpbXBsZSBjYXNlczpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInLCB7IG5hbWU6ICd0aicgfSwgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiBAcGFyYW0ge1hNTEhUVFBSZXF1ZXN0fSB4aHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBSZXNwb25zZShyZXEpIHtcbiAgdGhpcy5yZXEgPSByZXE7XG4gIHRoaXMueGhyID0gdGhpcy5yZXEueGhyO1xuICAvLyByZXNwb25zZVRleHQgaXMgYWNjZXNzaWJsZSBvbmx5IGlmIHJlc3BvbnNlVHlwZSBpcyAnJyBvciAndGV4dCcgYW5kIG9uIG9sZGVyIGJyb3dzZXJzXG4gIHRoaXMudGV4dCA9ICgodGhpcy5yZXEubWV0aG9kICE9J0hFQUQnICYmICh0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICcnIHx8IHRoaXMueGhyLnJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnKSkgfHwgdHlwZW9mIHRoaXMueGhyLnJlc3BvbnNlVHlwZSA9PT0gJ3VuZGVmaW5lZCcpXG4gICAgID8gdGhpcy54aHIucmVzcG9uc2VUZXh0XG4gICAgIDogbnVsbDtcbiAgdGhpcy5zdGF0dXNUZXh0ID0gdGhpcy5yZXEueGhyLnN0YXR1c1RleHQ7XG4gIHZhciBzdGF0dXMgPSB0aGlzLnhoci5zdGF0dXM7XG4gIC8vIGhhbmRsZSBJRTkgYnVnOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwMDQ2OTcyL21zaWUtcmV0dXJucy1zdGF0dXMtY29kZS1vZi0xMjIzLWZvci1hamF4LXJlcXVlc3RcbiAgaWYgKHN0YXR1cyA9PT0gMTIyMykge1xuICAgIHN0YXR1cyA9IDIwNDtcbiAgfVxuICB0aGlzLl9zZXRTdGF0dXNQcm9wZXJ0aWVzKHN0YXR1cyk7XG4gIHRoaXMuaGVhZGVyID0gdGhpcy5oZWFkZXJzID0gcGFyc2VIZWFkZXIodGhpcy54aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuICAvLyBnZXRBbGxSZXNwb25zZUhlYWRlcnMgc29tZXRpbWVzIGZhbHNlbHkgcmV0dXJucyBcIlwiIGZvciBDT1JTIHJlcXVlc3RzLCBidXRcbiAgLy8gZ2V0UmVzcG9uc2VIZWFkZXIgc3RpbGwgd29ya3MuIHNvIHdlIGdldCBjb250ZW50LXR5cGUgZXZlbiBpZiBnZXR0aW5nXG4gIC8vIG90aGVyIGhlYWRlcnMgZmFpbHMuXG4gIHRoaXMuaGVhZGVyWydjb250ZW50LXR5cGUnXSA9IHRoaXMueGhyLmdldFJlc3BvbnNlSGVhZGVyKCdjb250ZW50LXR5cGUnKTtcbiAgdGhpcy5fc2V0SGVhZGVyUHJvcGVydGllcyh0aGlzLmhlYWRlcik7XG5cbiAgaWYgKG51bGwgPT09IHRoaXMudGV4dCAmJiByZXEuX3Jlc3BvbnNlVHlwZSkge1xuICAgIHRoaXMuYm9keSA9IHRoaXMueGhyLnJlc3BvbnNlO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuYm9keSA9IHRoaXMucmVxLm1ldGhvZCAhPSAnSEVBRCdcbiAgICAgID8gdGhpcy5fcGFyc2VCb2R5KHRoaXMudGV4dCA/IHRoaXMudGV4dCA6IHRoaXMueGhyLnJlc3BvbnNlKVxuICAgICAgOiBudWxsO1xuICB9XG59XG5cblJlc3BvbnNlQmFzZShSZXNwb25zZS5wcm90b3R5cGUpO1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBib2R5IGBzdHJgLlxuICpcbiAqIFVzZWQgZm9yIGF1dG8tcGFyc2luZyBvZiBib2RpZXMuIFBhcnNlcnNcbiAqIGFyZSBkZWZpbmVkIG9uIHRoZSBgc3VwZXJhZ2VudC5wYXJzZWAgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLl9wYXJzZUJvZHkgPSBmdW5jdGlvbihzdHIpIHtcbiAgdmFyIHBhcnNlID0gcmVxdWVzdC5wYXJzZVt0aGlzLnR5cGVdO1xuICBpZiAodGhpcy5yZXEuX3BhcnNlcikge1xuICAgIHJldHVybiB0aGlzLnJlcS5fcGFyc2VyKHRoaXMsIHN0cik7XG4gIH1cbiAgaWYgKCFwYXJzZSAmJiBpc0pTT04odGhpcy50eXBlKSkge1xuICAgIHBhcnNlID0gcmVxdWVzdC5wYXJzZVsnYXBwbGljYXRpb24vanNvbiddO1xuICB9XG4gIHJldHVybiBwYXJzZSAmJiBzdHIgJiYgKHN0ci5sZW5ndGggfHwgc3RyIGluc3RhbmNlb2YgT2JqZWN0KVxuICAgID8gcGFyc2Uoc3RyKVxuICAgIDogbnVsbDtcbn07XG5cbi8qKlxuICogUmV0dXJuIGFuIGBFcnJvcmAgcmVwcmVzZW50YXRpdmUgb2YgdGhpcyByZXNwb25zZS5cbiAqXG4gKiBAcmV0dXJuIHtFcnJvcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLnRvRXJyb3IgPSBmdW5jdGlvbigpe1xuICB2YXIgcmVxID0gdGhpcy5yZXE7XG4gIHZhciBtZXRob2QgPSByZXEubWV0aG9kO1xuICB2YXIgdXJsID0gcmVxLnVybDtcblxuICB2YXIgbXNnID0gJ2Nhbm5vdCAnICsgbWV0aG9kICsgJyAnICsgdXJsICsgJyAoJyArIHRoaXMuc3RhdHVzICsgJyknO1xuICB2YXIgZXJyID0gbmV3IEVycm9yKG1zZyk7XG4gIGVyci5zdGF0dXMgPSB0aGlzLnN0YXR1cztcbiAgZXJyLm1ldGhvZCA9IG1ldGhvZDtcbiAgZXJyLnVybCA9IHVybDtcblxuICByZXR1cm4gZXJyO1xufTtcblxuLyoqXG4gKiBFeHBvc2UgYFJlc3BvbnNlYC5cbiAqL1xuXG5yZXF1ZXN0LlJlc3BvbnNlID0gUmVzcG9uc2U7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgUmVxdWVzdGAgd2l0aCB0aGUgZ2l2ZW4gYG1ldGhvZGAgYW5kIGB1cmxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gUmVxdWVzdChtZXRob2QsIHVybCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX3F1ZXJ5ID0gdGhpcy5fcXVlcnkgfHwgW107XG4gIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICB0aGlzLnVybCA9IHVybDtcbiAgdGhpcy5oZWFkZXIgPSB7fTsgLy8gcHJlc2VydmVzIGhlYWRlciBuYW1lIGNhc2VcbiAgdGhpcy5faGVhZGVyID0ge307IC8vIGNvZXJjZXMgaGVhZGVyIG5hbWVzIHRvIGxvd2VyY2FzZVxuICB0aGlzLm9uKCdlbmQnLCBmdW5jdGlvbigpe1xuICAgIHZhciBlcnIgPSBudWxsO1xuICAgIHZhciByZXMgPSBudWxsO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJlcyA9IG5ldyBSZXNwb25zZShzZWxmKTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGVyciA9IG5ldyBFcnJvcignUGFyc2VyIGlzIHVuYWJsZSB0byBwYXJzZSB0aGUgcmVzcG9uc2UnKTtcbiAgICAgIGVyci5wYXJzZSA9IHRydWU7XG4gICAgICBlcnIub3JpZ2luYWwgPSBlO1xuICAgICAgLy8gaXNzdWUgIzY3NTogcmV0dXJuIHRoZSByYXcgcmVzcG9uc2UgaWYgdGhlIHJlc3BvbnNlIHBhcnNpbmcgZmFpbHNcbiAgICAgIGlmIChzZWxmLnhocikge1xuICAgICAgICAvLyBpZTkgZG9lc24ndCBoYXZlICdyZXNwb25zZScgcHJvcGVydHlcbiAgICAgICAgZXJyLnJhd1Jlc3BvbnNlID0gdHlwZW9mIHNlbGYueGhyLnJlc3BvbnNlVHlwZSA9PSAndW5kZWZpbmVkJyA/IHNlbGYueGhyLnJlc3BvbnNlVGV4dCA6IHNlbGYueGhyLnJlc3BvbnNlO1xuICAgICAgICAvLyBpc3N1ZSAjODc2OiByZXR1cm4gdGhlIGh0dHAgc3RhdHVzIGNvZGUgaWYgdGhlIHJlc3BvbnNlIHBhcnNpbmcgZmFpbHNcbiAgICAgICAgZXJyLnN0YXR1cyA9IHNlbGYueGhyLnN0YXR1cyA/IHNlbGYueGhyLnN0YXR1cyA6IG51bGw7XG4gICAgICAgIGVyci5zdGF0dXNDb2RlID0gZXJyLnN0YXR1czsgLy8gYmFja3dhcmRzLWNvbXBhdCBvbmx5XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcnIucmF3UmVzcG9uc2UgPSBudWxsO1xuICAgICAgICBlcnIuc3RhdHVzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNlbGYuY2FsbGJhY2soZXJyKTtcbiAgICB9XG5cbiAgICBzZWxmLmVtaXQoJ3Jlc3BvbnNlJywgcmVzKTtcblxuICAgIHZhciBuZXdfZXJyO1xuICAgIHRyeSB7XG4gICAgICBpZiAoIXNlbGYuX2lzUmVzcG9uc2VPSyhyZXMpKSB7XG4gICAgICAgIG5ld19lcnIgPSBuZXcgRXJyb3IocmVzLnN0YXR1c1RleHQgfHwgJ1Vuc3VjY2Vzc2Z1bCBIVFRQIHJlc3BvbnNlJyk7XG4gICAgICB9XG4gICAgfSBjYXRjaChjdXN0b21fZXJyKSB7XG4gICAgICBuZXdfZXJyID0gY3VzdG9tX2VycjsgLy8gb2soKSBjYWxsYmFjayBjYW4gdGhyb3dcbiAgICB9XG5cbiAgICAvLyAjMTAwMCBkb24ndCBjYXRjaCBlcnJvcnMgZnJvbSB0aGUgY2FsbGJhY2sgdG8gYXZvaWQgZG91YmxlIGNhbGxpbmcgaXRcbiAgICBpZiAobmV3X2Vycikge1xuICAgICAgbmV3X2Vyci5vcmlnaW5hbCA9IGVycjtcbiAgICAgIG5ld19lcnIucmVzcG9uc2UgPSByZXM7XG4gICAgICBuZXdfZXJyLnN0YXR1cyA9IHJlcy5zdGF0dXM7XG4gICAgICBzZWxmLmNhbGxiYWNrKG5ld19lcnIsIHJlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuY2FsbGJhY2sobnVsbCwgcmVzKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIE1peGluIGBFbWl0dGVyYCBhbmQgYFJlcXVlc3RCYXNlYC5cbiAqL1xuXG5FbWl0dGVyKFJlcXVlc3QucHJvdG90eXBlKTtcblJlcXVlc3RCYXNlKFJlcXVlc3QucHJvdG90eXBlKTtcblxuLyoqXG4gKiBTZXQgQ29udGVudC1UeXBlIHRvIGB0eXBlYCwgbWFwcGluZyB2YWx1ZXMgZnJvbSBgcmVxdWVzdC50eXBlc2AuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICBzdXBlcmFnZW50LnR5cGVzLnhtbCA9ICdhcHBsaWNhdGlvbi94bWwnO1xuICpcbiAqICAgICAgcmVxdWVzdC5wb3N0KCcvJylcbiAqICAgICAgICAudHlwZSgneG1sJylcbiAqICAgICAgICAuc2VuZCh4bWxzdHJpbmcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXF1ZXN0LnBvc3QoJy8nKVxuICogICAgICAgIC50eXBlKCdhcHBsaWNhdGlvbi94bWwnKVxuICogICAgICAgIC5zZW5kKHhtbHN0cmluZylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnR5cGUgPSBmdW5jdGlvbih0eXBlKXtcbiAgdGhpcy5zZXQoJ0NvbnRlbnQtVHlwZScsIHJlcXVlc3QudHlwZXNbdHlwZV0gfHwgdHlwZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgQWNjZXB0IHRvIGB0eXBlYCwgbWFwcGluZyB2YWx1ZXMgZnJvbSBgcmVxdWVzdC50eXBlc2AuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICBzdXBlcmFnZW50LnR5cGVzLmpzb24gPSAnYXBwbGljYXRpb24vanNvbic7XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnL2FnZW50JylcbiAqICAgICAgICAuYWNjZXB0KCdqc29uJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvYWdlbnQnKVxuICogICAgICAgIC5hY2NlcHQoJ2FwcGxpY2F0aW9uL2pzb24nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhY2NlcHRcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hY2NlcHQgPSBmdW5jdGlvbih0eXBlKXtcbiAgdGhpcy5zZXQoJ0FjY2VwdCcsIHJlcXVlc3QudHlwZXNbdHlwZV0gfHwgdHlwZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgQXV0aG9yaXphdGlvbiBmaWVsZCB2YWx1ZSB3aXRoIGB1c2VyYCBhbmQgYHBhc3NgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1c2VyXG4gKiBAcGFyYW0ge1N0cmluZ30gW3Bhc3NdIG9wdGlvbmFsIGluIGNhc2Ugb2YgdXNpbmcgJ2JlYXJlcicgYXMgdHlwZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgd2l0aCAndHlwZScgcHJvcGVydHkgJ2F1dG8nLCAnYmFzaWMnIG9yICdiZWFyZXInIChkZWZhdWx0ICdiYXNpYycpXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYXV0aCA9IGZ1bmN0aW9uKHVzZXIsIHBhc3MsIG9wdGlvbnMpe1xuICBpZiAoMSA9PT0gYXJndW1lbnRzLmxlbmd0aCkgcGFzcyA9ICcnO1xuICBpZiAodHlwZW9mIHBhc3MgPT09ICdvYmplY3QnICYmIHBhc3MgIT09IG51bGwpIHsgLy8gcGFzcyBpcyBvcHRpb25hbCBhbmQgY2FuIGJlIHJlcGxhY2VkIHdpdGggb3B0aW9uc1xuICAgIG9wdGlvbnMgPSBwYXNzO1xuICAgIHBhc3MgPSAnJztcbiAgfVxuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge1xuICAgICAgdHlwZTogJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGJ0b2EgPyAnYmFzaWMnIDogJ2F1dG8nLFxuICAgIH07XG4gIH1cblxuICB2YXIgZW5jb2RlciA9IGZ1bmN0aW9uKHN0cmluZykge1xuICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgYnRvYSkge1xuICAgICAgcmV0dXJuIGJ0b2Eoc3RyaW5nKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXNlIGJhc2ljIGF1dGgsIGJ0b2EgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgfTtcblxuICByZXR1cm4gdGhpcy5fYXV0aCh1c2VyLCBwYXNzLCBvcHRpb25zLCBlbmNvZGVyKTtcbn07XG5cbi8qKlxuICogQWRkIHF1ZXJ5LXN0cmluZyBgdmFsYC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgIHJlcXVlc3QuZ2V0KCcvc2hvZXMnKVxuICogICAgIC5xdWVyeSgnc2l6ZT0xMCcpXG4gKiAgICAgLnF1ZXJ5KHsgY29sb3I6ICdibHVlJyB9KVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbih2YWwpe1xuICBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIHZhbCkgdmFsID0gc2VyaWFsaXplKHZhbCk7XG4gIGlmICh2YWwpIHRoaXMuX3F1ZXJ5LnB1c2godmFsKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFF1ZXVlIHRoZSBnaXZlbiBgZmlsZWAgYXMgYW4gYXR0YWNobWVudCB0byB0aGUgc3BlY2lmaWVkIGBmaWVsZGAsXG4gKiB3aXRoIG9wdGlvbmFsIGBvcHRpb25zYCAob3IgZmlsZW5hbWUpLlxuICpcbiAqIGBgYCBqc1xuICogcmVxdWVzdC5wb3N0KCcvdXBsb2FkJylcbiAqICAgLmF0dGFjaCgnY29udGVudCcsIG5ldyBCbG9iKFsnPGEgaWQ9XCJhXCI+PGIgaWQ9XCJiXCI+aGV5ITwvYj48L2E+J10sIHsgdHlwZTogXCJ0ZXh0L2h0bWxcIn0pKVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHBhcmFtIHtCbG9ifEZpbGV9IGZpbGVcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmF0dGFjaCA9IGZ1bmN0aW9uKGZpZWxkLCBmaWxlLCBvcHRpb25zKXtcbiAgaWYgKGZpbGUpIHtcbiAgICBpZiAodGhpcy5fZGF0YSkge1xuICAgICAgdGhyb3cgRXJyb3IoXCJzdXBlcmFnZW50IGNhbid0IG1peCAuc2VuZCgpIGFuZCAuYXR0YWNoKClcIik7XG4gICAgfVxuXG4gICAgdGhpcy5fZ2V0Rm9ybURhdGEoKS5hcHBlbmQoZmllbGQsIGZpbGUsIG9wdGlvbnMgfHwgZmlsZS5uYW1lKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblJlcXVlc3QucHJvdG90eXBlLl9nZXRGb3JtRGF0YSA9IGZ1bmN0aW9uKCl7XG4gIGlmICghdGhpcy5fZm9ybURhdGEpIHtcbiAgICB0aGlzLl9mb3JtRGF0YSA9IG5ldyByb290LkZvcm1EYXRhKCk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuX2Zvcm1EYXRhO1xufTtcblxuLyoqXG4gKiBJbnZva2UgdGhlIGNhbGxiYWNrIHdpdGggYGVycmAgYW5kIGByZXNgXG4gKiBhbmQgaGFuZGxlIGFyaXR5IGNoZWNrLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtSZXNwb25zZX0gcmVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jYWxsYmFjayA9IGZ1bmN0aW9uKGVyciwgcmVzKXtcbiAgaWYgKHRoaXMuX3Nob3VsZFJldHJ5KGVyciwgcmVzKSkge1xuICAgIHJldHVybiB0aGlzLl9yZXRyeSgpO1xuICB9XG5cbiAgdmFyIGZuID0gdGhpcy5fY2FsbGJhY2s7XG4gIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG5cbiAgaWYgKGVycikge1xuICAgIGlmICh0aGlzLl9tYXhSZXRyaWVzKSBlcnIucmV0cmllcyA9IHRoaXMuX3JldHJpZXMgLSAxO1xuICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpO1xuICB9XG5cbiAgZm4oZXJyLCByZXMpO1xufTtcblxuLyoqXG4gKiBJbnZva2UgY2FsbGJhY2sgd2l0aCB4LWRvbWFpbiBlcnJvci5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jcm9zc0RvbWFpbkVycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIGVyciA9IG5ldyBFcnJvcignUmVxdWVzdCBoYXMgYmVlbiB0ZXJtaW5hdGVkXFxuUG9zc2libGUgY2F1c2VzOiB0aGUgbmV0d29yayBpcyBvZmZsaW5lLCBPcmlnaW4gaXMgbm90IGFsbG93ZWQgYnkgQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luLCB0aGUgcGFnZSBpcyBiZWluZyB1bmxvYWRlZCwgZXRjLicpO1xuICBlcnIuY3Jvc3NEb21haW4gPSB0cnVlO1xuXG4gIGVyci5zdGF0dXMgPSB0aGlzLnN0YXR1cztcbiAgZXJyLm1ldGhvZCA9IHRoaXMubWV0aG9kO1xuICBlcnIudXJsID0gdGhpcy51cmw7XG5cbiAgdGhpcy5jYWxsYmFjayhlcnIpO1xufTtcblxuLy8gVGhpcyBvbmx5IHdhcm5zLCBiZWNhdXNlIHRoZSByZXF1ZXN0IGlzIHN0aWxsIGxpa2VseSB0byB3b3JrXG5SZXF1ZXN0LnByb3RvdHlwZS5idWZmZXIgPSBSZXF1ZXN0LnByb3RvdHlwZS5jYSA9IFJlcXVlc3QucHJvdG90eXBlLmFnZW50ID0gZnVuY3Rpb24oKXtcbiAgY29uc29sZS53YXJuKFwiVGhpcyBpcyBub3Qgc3VwcG9ydGVkIGluIGJyb3dzZXIgdmVyc2lvbiBvZiBzdXBlcmFnZW50XCIpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIFRoaXMgdGhyb3dzLCBiZWNhdXNlIGl0IGNhbid0IHNlbmQvcmVjZWl2ZSBkYXRhIGFzIGV4cGVjdGVkXG5SZXF1ZXN0LnByb3RvdHlwZS5waXBlID0gUmVxdWVzdC5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbigpe1xuICB0aHJvdyBFcnJvcihcIlN0cmVhbWluZyBpcyBub3Qgc3VwcG9ydGVkIGluIGJyb3dzZXIgdmVyc2lvbiBvZiBzdXBlcmFnZW50XCIpO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhIGhvc3Qgb2JqZWN0LFxuICogd2UgZG9uJ3Qgd2FudCB0byBzZXJpYWxpemUgdGhlc2UgOilcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblJlcXVlc3QucHJvdG90eXBlLl9pc0hvc3QgPSBmdW5jdGlvbiBfaXNIb3N0KG9iaikge1xuICAvLyBOYXRpdmUgb2JqZWN0cyBzdHJpbmdpZnkgdG8gW29iamVjdCBGaWxlXSwgW29iamVjdCBCbG9iXSwgW29iamVjdCBGb3JtRGF0YV0sIGV0Yy5cbiAgcmV0dXJuIG9iaiAmJiAnb2JqZWN0JyA9PT0gdHlwZW9mIG9iaiAmJiAhQXJyYXkuaXNBcnJheShvYmopICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopICE9PSAnW29iamVjdCBPYmplY3RdJztcbn1cblxuLyoqXG4gKiBJbml0aWF0ZSByZXF1ZXN0LCBpbnZva2luZyBjYWxsYmFjayBgZm4ocmVzKWBcbiAqIHdpdGggYW4gaW5zdGFuY2VvZiBgUmVzcG9uc2VgLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oZm4pe1xuICBpZiAodGhpcy5fZW5kQ2FsbGVkKSB7XG4gICAgY29uc29sZS53YXJuKFwiV2FybmluZzogLmVuZCgpIHdhcyBjYWxsZWQgdHdpY2UuIFRoaXMgaXMgbm90IHN1cHBvcnRlZCBpbiBzdXBlcmFnZW50XCIpO1xuICB9XG4gIHRoaXMuX2VuZENhbGxlZCA9IHRydWU7XG5cbiAgLy8gc3RvcmUgY2FsbGJhY2tcbiAgdGhpcy5fY2FsbGJhY2sgPSBmbiB8fCBub29wO1xuXG4gIC8vIHF1ZXJ5c3RyaW5nXG4gIHRoaXMuX2ZpbmFsaXplUXVlcnlTdHJpbmcoKTtcblxuICByZXR1cm4gdGhpcy5fZW5kKCk7XG59O1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5fZW5kID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIHhociA9ICh0aGlzLnhociA9IHJlcXVlc3QuZ2V0WEhSKCkpO1xuICB2YXIgZGF0YSA9IHRoaXMuX2Zvcm1EYXRhIHx8IHRoaXMuX2RhdGE7XG5cbiAgdGhpcy5fc2V0VGltZW91dHMoKTtcblxuICAvLyBzdGF0ZSBjaGFuZ2VcbiAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHJlYWR5U3RhdGUgPSB4aHIucmVhZHlTdGF0ZTtcbiAgICBpZiAocmVhZHlTdGF0ZSA+PSAyICYmIHNlbGYuX3Jlc3BvbnNlVGltZW91dFRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQoc2VsZi5fcmVzcG9uc2VUaW1lb3V0VGltZXIpO1xuICAgIH1cbiAgICBpZiAoNCAhPSByZWFkeVN0YXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSW4gSUU5LCByZWFkcyB0byBhbnkgcHJvcGVydHkgKGUuZy4gc3RhdHVzKSBvZmYgb2YgYW4gYWJvcnRlZCBYSFIgd2lsbFxuICAgIC8vIHJlc3VsdCBpbiB0aGUgZXJyb3IgXCJDb3VsZCBub3QgY29tcGxldGUgdGhlIG9wZXJhdGlvbiBkdWUgdG8gZXJyb3IgYzAwYzAyM2ZcIlxuICAgIHZhciBzdGF0dXM7XG4gICAgdHJ5IHsgc3RhdHVzID0geGhyLnN0YXR1cyB9IGNhdGNoKGUpIHsgc3RhdHVzID0gMDsgfVxuXG4gICAgaWYgKCFzdGF0dXMpIHtcbiAgICAgIGlmIChzZWxmLnRpbWVkb3V0IHx8IHNlbGYuX2Fib3J0ZWQpIHJldHVybjtcbiAgICAgIHJldHVybiBzZWxmLmNyb3NzRG9tYWluRXJyb3IoKTtcbiAgICB9XG4gICAgc2VsZi5lbWl0KCdlbmQnKTtcbiAgfTtcblxuICAvLyBwcm9ncmVzc1xuICB2YXIgaGFuZGxlUHJvZ3Jlc3MgPSBmdW5jdGlvbihkaXJlY3Rpb24sIGUpIHtcbiAgICBpZiAoZS50b3RhbCA+IDApIHtcbiAgICAgIGUucGVyY2VudCA9IGUubG9hZGVkIC8gZS50b3RhbCAqIDEwMDtcbiAgICB9XG4gICAgZS5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgc2VsZi5lbWl0KCdwcm9ncmVzcycsIGUpO1xuICB9O1xuICBpZiAodGhpcy5oYXNMaXN0ZW5lcnMoJ3Byb2dyZXNzJykpIHtcbiAgICB0cnkge1xuICAgICAgeGhyLm9ucHJvZ3Jlc3MgPSBoYW5kbGVQcm9ncmVzcy5iaW5kKG51bGwsICdkb3dubG9hZCcpO1xuICAgICAgaWYgKHhoci51cGxvYWQpIHtcbiAgICAgICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gaGFuZGxlUHJvZ3Jlc3MuYmluZChudWxsLCAndXBsb2FkJyk7XG4gICAgICB9XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICAvLyBBY2Nlc3NpbmcgeGhyLnVwbG9hZCBmYWlscyBpbiBJRSBmcm9tIGEgd2ViIHdvcmtlciwgc28ganVzdCBwcmV0ZW5kIGl0IGRvZXNuJ3QgZXhpc3QuXG4gICAgICAvLyBSZXBvcnRlZCBoZXJlOlxuICAgICAgLy8gaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy84MzcyNDUveG1saHR0cHJlcXVlc3QtdXBsb2FkLXRocm93cy1pbnZhbGlkLWFyZ3VtZW50LXdoZW4tdXNlZC1mcm9tLXdlYi13b3JrZXItY29udGV4dFxuICAgIH1cbiAgfVxuXG4gIC8vIGluaXRpYXRlIHJlcXVlc3RcbiAgdHJ5IHtcbiAgICBpZiAodGhpcy51c2VybmFtZSAmJiB0aGlzLnBhc3N3b3JkKSB7XG4gICAgICB4aHIub3Blbih0aGlzLm1ldGhvZCwgdGhpcy51cmwsIHRydWUsIHRoaXMudXNlcm5hbWUsIHRoaXMucGFzc3dvcmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB4aHIub3Blbih0aGlzLm1ldGhvZCwgdGhpcy51cmwsIHRydWUpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgLy8gc2VlICMxMTQ5XG4gICAgcmV0dXJuIHRoaXMuY2FsbGJhY2soZXJyKTtcbiAgfVxuXG4gIC8vIENPUlNcbiAgaWYgKHRoaXMuX3dpdGhDcmVkZW50aWFscykgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG5cbiAgLy8gYm9keVxuICBpZiAoIXRoaXMuX2Zvcm1EYXRhICYmICdHRVQnICE9IHRoaXMubWV0aG9kICYmICdIRUFEJyAhPSB0aGlzLm1ldGhvZCAmJiAnc3RyaW5nJyAhPSB0eXBlb2YgZGF0YSAmJiAhdGhpcy5faXNIb3N0KGRhdGEpKSB7XG4gICAgLy8gc2VyaWFsaXplIHN0dWZmXG4gICAgdmFyIGNvbnRlbnRUeXBlID0gdGhpcy5faGVhZGVyWydjb250ZW50LXR5cGUnXTtcbiAgICB2YXIgc2VyaWFsaXplID0gdGhpcy5fc2VyaWFsaXplciB8fCByZXF1ZXN0LnNlcmlhbGl6ZVtjb250ZW50VHlwZSA/IGNvbnRlbnRUeXBlLnNwbGl0KCc7JylbMF0gOiAnJ107XG4gICAgaWYgKCFzZXJpYWxpemUgJiYgaXNKU09OKGNvbnRlbnRUeXBlKSkge1xuICAgICAgc2VyaWFsaXplID0gcmVxdWVzdC5zZXJpYWxpemVbJ2FwcGxpY2F0aW9uL2pzb24nXTtcbiAgICB9XG4gICAgaWYgKHNlcmlhbGl6ZSkgZGF0YSA9IHNlcmlhbGl6ZShkYXRhKTtcbiAgfVxuXG4gIC8vIHNldCBoZWFkZXIgZmllbGRzXG4gIGZvciAodmFyIGZpZWxkIGluIHRoaXMuaGVhZGVyKSB7XG4gICAgaWYgKG51bGwgPT0gdGhpcy5oZWFkZXJbZmllbGRdKSBjb250aW51ZTtcblxuICAgIGlmICh0aGlzLmhlYWRlci5oYXNPd25Qcm9wZXJ0eShmaWVsZCkpXG4gICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihmaWVsZCwgdGhpcy5oZWFkZXJbZmllbGRdKTtcbiAgfVxuXG4gIGlmICh0aGlzLl9yZXNwb25zZVR5cGUpIHtcbiAgICB4aHIucmVzcG9uc2VUeXBlID0gdGhpcy5fcmVzcG9uc2VUeXBlO1xuICB9XG5cbiAgLy8gc2VuZCBzdHVmZlxuICB0aGlzLmVtaXQoJ3JlcXVlc3QnLCB0aGlzKTtcblxuICAvLyBJRTExIHhoci5zZW5kKHVuZGVmaW5lZCkgc2VuZHMgJ3VuZGVmaW5lZCcgc3RyaW5nIGFzIFBPU1QgcGF5bG9hZCAoaW5zdGVhZCBvZiBub3RoaW5nKVxuICAvLyBXZSBuZWVkIG51bGwgaGVyZSBpZiBkYXRhIGlzIHVuZGVmaW5lZFxuICB4aHIuc2VuZCh0eXBlb2YgZGF0YSAhPT0gJ3VuZGVmaW5lZCcgPyBkYXRhIDogbnVsbCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxucmVxdWVzdC5hZ2VudCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IEFnZW50KCk7XG59O1xuXG5bXCJHRVRcIiwgXCJQT1NUXCIsIFwiT1BUSU9OU1wiLCBcIlBBVENIXCIsIFwiUFVUXCIsIFwiREVMRVRFXCJdLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gIEFnZW50LnByb3RvdHlwZVttZXRob2QudG9Mb3dlckNhc2UoKV0gPSBmdW5jdGlvbih1cmwsIGZuKSB7XG4gICAgdmFyIHJlcSA9IG5ldyByZXF1ZXN0LlJlcXVlc3QobWV0aG9kLCB1cmwpO1xuICAgIHRoaXMuX3NldERlZmF1bHRzKHJlcSk7XG4gICAgaWYgKGZuKSB7XG4gICAgICByZXEuZW5kKGZuKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcTtcbiAgfTtcbn0pO1xuXG5BZ2VudC5wcm90b3R5cGUuZGVsID0gQWdlbnQucHJvdG90eXBlWydkZWxldGUnXTtcblxuLyoqXG4gKiBHRVQgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gW2RhdGFdIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LmdldCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pIHtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0dFVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSAoZm4gPSBkYXRhKSwgKGRhdGEgPSBudWxsKTtcbiAgaWYgKGRhdGEpIHJlcS5xdWVyeShkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogSEVBRCBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBbZGF0YV0gb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl1cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QuaGVhZCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pIHtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0hFQUQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgKGZuID0gZGF0YSksIChkYXRhID0gbnVsbCk7XG4gIGlmIChkYXRhKSByZXEucXVlcnkoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIE9QVElPTlMgcXVlcnkgdG8gYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gW2RhdGFdIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0Lm9wdGlvbnMgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKSB7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdPUFRJT05TJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIChmbiA9IGRhdGEpLCAoZGF0YSA9IG51bGwpO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIERFTEVURSBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR9IFtkYXRhXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZGVsKHVybCwgZGF0YSwgZm4pIHtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ0RFTEVURScsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSAoZm4gPSBkYXRhKSwgKGRhdGEgPSBudWxsKTtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufVxuXG5yZXF1ZXN0WydkZWwnXSA9IGRlbDtcbnJlcXVlc3RbJ2RlbGV0ZSddID0gZGVsO1xuXG4vKipcbiAqIFBBVENIIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZH0gW2RhdGFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnBhdGNoID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbikge1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUEFUQ0gnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgKGZuID0gZGF0YSksIChkYXRhID0gbnVsbCk7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogUE9TVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR9IFtkYXRhXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wb3N0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbikge1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUE9TVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSAoZm4gPSBkYXRhKSwgKGRhdGEgPSBudWxsKTtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBQVVQgYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBbZGF0YV0gb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl1cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucHV0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbikge1xuICB2YXIgcmVxID0gcmVxdWVzdCgnUFVUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIChmbiA9IGRhdGEpLCAoZGF0YSA9IG51bGwpO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gIHJldHVybiBudWxsICE9PSBvYmogJiYgJ29iamVjdCcgPT09IHR5cGVvZiBvYmo7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTW9kdWxlIG9mIG1peGVkLWluIGZ1bmN0aW9ucyBzaGFyZWQgYmV0d2VlbiBub2RlIGFuZCBjbGllbnQgY29kZVxuICovXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzLW9iamVjdCcpO1xuXG4vKipcbiAqIEV4cG9zZSBgUmVxdWVzdEJhc2VgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gUmVxdWVzdEJhc2U7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgUmVxdWVzdEJhc2VgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gUmVxdWVzdEJhc2Uob2JqKSB7XG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufVxuXG4vKipcbiAqIE1peGluIHRoZSBwcm90b3R5cGUgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIFJlcXVlc3RCYXNlLnByb3RvdHlwZSkge1xuICAgIG9ialtrZXldID0gUmVxdWVzdEJhc2UucHJvdG90eXBlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBDbGVhciBwcmV2aW91cyB0aW1lb3V0LlxuICpcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuY2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24gX2NsZWFyVGltZW91dCgpe1xuICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xuICBjbGVhclRpbWVvdXQodGhpcy5fcmVzcG9uc2VUaW1lb3V0VGltZXIpO1xuICBkZWxldGUgdGhpcy5fdGltZXI7XG4gIGRlbGV0ZSB0aGlzLl9yZXNwb25zZVRpbWVvdXRUaW1lcjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIE92ZXJyaWRlIGRlZmF1bHQgcmVzcG9uc2UgYm9keSBwYXJzZXJcbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHRvIGNvbnZlcnQgaW5jb21pbmcgZGF0YSBpbnRvIHJlcXVlc3QuYm9keVxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uIHBhcnNlKGZuKXtcbiAgdGhpcy5fcGFyc2VyID0gZm47XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgZm9ybWF0IG9mIGJpbmFyeSByZXNwb25zZSBib2R5LlxuICogSW4gYnJvd3NlciB2YWxpZCBmb3JtYXRzIGFyZSAnYmxvYicgYW5kICdhcnJheWJ1ZmZlcicsXG4gKiB3aGljaCByZXR1cm4gQmxvYiBhbmQgQXJyYXlCdWZmZXIsIHJlc3BlY3RpdmVseS5cbiAqXG4gKiBJbiBOb2RlIGFsbCB2YWx1ZXMgcmVzdWx0IGluIEJ1ZmZlci5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC5yZXNwb25zZVR5cGUoJ2Jsb2InKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUucmVzcG9uc2VUeXBlID0gZnVuY3Rpb24odmFsKXtcbiAgdGhpcy5fcmVzcG9uc2VUeXBlID0gdmFsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogT3ZlcnJpZGUgZGVmYXVsdCByZXF1ZXN0IGJvZHkgc2VyaWFsaXplclxuICpcbiAqIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgdG8gY29udmVydCBkYXRhIHNldCB2aWEgLnNlbmQgb3IgLmF0dGFjaCBpbnRvIHBheWxvYWQgdG8gc2VuZFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbiBzZXJpYWxpemUoZm4pe1xuICB0aGlzLl9zZXJpYWxpemVyID0gZm47XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgdGltZW91dHMuXG4gKlxuICogLSByZXNwb25zZSB0aW1lb3V0IGlzIHRpbWUgYmV0d2VlbiBzZW5kaW5nIHJlcXVlc3QgYW5kIHJlY2VpdmluZyB0aGUgZmlyc3QgYnl0ZSBvZiB0aGUgcmVzcG9uc2UuIEluY2x1ZGVzIEROUyBhbmQgY29ubmVjdGlvbiB0aW1lLlxuICogLSBkZWFkbGluZSBpcyB0aGUgdGltZSBmcm9tIHN0YXJ0IG9mIHRoZSByZXF1ZXN0IHRvIHJlY2VpdmluZyByZXNwb25zZSBib2R5IGluIGZ1bGwuIElmIHRoZSBkZWFkbGluZSBpcyB0b28gc2hvcnQgbGFyZ2UgZmlsZXMgbWF5IG5vdCBsb2FkIGF0IGFsbCBvbiBzbG93IGNvbm5lY3Rpb25zLlxuICpcbiAqIFZhbHVlIG9mIDAgb3IgZmFsc2UgbWVhbnMgbm8gdGltZW91dC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcnxPYmplY3R9IG1zIG9yIHtyZXNwb25zZSwgZGVhZGxpbmV9XG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnRpbWVvdXQgPSBmdW5jdGlvbiB0aW1lb3V0KG9wdGlvbnMpe1xuICBpZiAoIW9wdGlvbnMgfHwgJ29iamVjdCcgIT09IHR5cGVvZiBvcHRpb25zKSB7XG4gICAgdGhpcy5fdGltZW91dCA9IG9wdGlvbnM7XG4gICAgdGhpcy5fcmVzcG9uc2VUaW1lb3V0ID0gMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZvcih2YXIgb3B0aW9uIGluIG9wdGlvbnMpIHtcbiAgICBzd2l0Y2gob3B0aW9uKSB7XG4gICAgICBjYXNlICdkZWFkbGluZSc6XG4gICAgICAgIHRoaXMuX3RpbWVvdXQgPSBvcHRpb25zLmRlYWRsaW5lO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jlc3BvbnNlJzpcbiAgICAgICAgdGhpcy5fcmVzcG9uc2VUaW1lb3V0ID0gb3B0aW9ucy5yZXNwb25zZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLndhcm4oXCJVbmtub3duIHRpbWVvdXQgb3B0aW9uXCIsIG9wdGlvbik7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgbnVtYmVyIG9mIHJldHJ5IGF0dGVtcHRzIG9uIGVycm9yLlxuICpcbiAqIEZhaWxlZCByZXF1ZXN0cyB3aWxsIGJlIHJldHJpZWQgJ2NvdW50JyB0aW1lcyBpZiB0aW1lb3V0IG9yIGVyci5jb2RlID49IDUwMC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gY291bnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl1cbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUucmV0cnkgPSBmdW5jdGlvbiByZXRyeShjb3VudCwgZm4pe1xuICAvLyBEZWZhdWx0IHRvIDEgaWYgbm8gY291bnQgcGFzc2VkIG9yIHRydWVcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDAgfHwgY291bnQgPT09IHRydWUpIGNvdW50ID0gMTtcbiAgaWYgKGNvdW50IDw9IDApIGNvdW50ID0gMDtcbiAgdGhpcy5fbWF4UmV0cmllcyA9IGNvdW50O1xuICB0aGlzLl9yZXRyaWVzID0gMDtcbiAgdGhpcy5fcmV0cnlDYWxsYmFjayA9IGZuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbnZhciBFUlJPUl9DT0RFUyA9IFtcbiAgJ0VDT05OUkVTRVQnLFxuICAnRVRJTUVET1VUJyxcbiAgJ0VBRERSSU5GTycsXG4gICdFU09DS0VUVElNRURPVVQnXG5dO1xuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHJlcXVlc3Qgc2hvdWxkIGJlIHJldHJpZWQuXG4gKiAoQm9ycm93ZWQgZnJvbSBzZWdtZW50aW8vc3VwZXJhZ2VudC1yZXRyeSlcbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7UmVzcG9uc2V9IFtyZXNdXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqL1xuUmVxdWVzdEJhc2UucHJvdG90eXBlLl9zaG91bGRSZXRyeSA9IGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gIGlmICghdGhpcy5fbWF4UmV0cmllcyB8fCB0aGlzLl9yZXRyaWVzKysgPj0gdGhpcy5fbWF4UmV0cmllcykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodGhpcy5fcmV0cnlDYWxsYmFjaykge1xuICAgIHRyeSB7XG4gICAgICB2YXIgb3ZlcnJpZGUgPSB0aGlzLl9yZXRyeUNhbGxiYWNrKGVyciwgcmVzKTtcbiAgICAgIGlmIChvdmVycmlkZSA9PT0gdHJ1ZSkgcmV0dXJuIHRydWU7XG4gICAgICBpZiAob3ZlcnJpZGUgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgICAvLyB1bmRlZmluZWQgZmFsbHMgYmFjayB0byBkZWZhdWx0c1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG4gIH1cbiAgaWYgKHJlcyAmJiByZXMuc3RhdHVzICYmIHJlcy5zdGF0dXMgPj0gNTAwICYmIHJlcy5zdGF0dXMgIT0gNTAxKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKGVycikge1xuICAgIGlmIChlcnIuY29kZSAmJiB+RVJST1JfQ09ERVMuaW5kZXhPZihlcnIuY29kZSkpIHJldHVybiB0cnVlO1xuICAgIC8vIFN1cGVyYWdlbnQgdGltZW91dFxuICAgIGlmIChlcnIudGltZW91dCAmJiBlcnIuY29kZSA9PSAnRUNPTk5BQk9SVEVEJykgcmV0dXJuIHRydWU7XG4gICAgaWYgKGVyci5jcm9zc0RvbWFpbikgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZXRyeSByZXF1ZXN0XG4gKlxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuX3JldHJ5ID0gZnVuY3Rpb24oKSB7XG5cbiAgdGhpcy5jbGVhclRpbWVvdXQoKTtcblxuICAvLyBub2RlXG4gIGlmICh0aGlzLnJlcSkge1xuICAgIHRoaXMucmVxID0gbnVsbDtcbiAgICB0aGlzLnJlcSA9IHRoaXMucmVxdWVzdCgpO1xuICB9XG5cbiAgdGhpcy5fYWJvcnRlZCA9IGZhbHNlO1xuICB0aGlzLnRpbWVkb3V0ID0gZmFsc2U7XG5cbiAgcmV0dXJuIHRoaXMuX2VuZCgpO1xufTtcblxuLyoqXG4gKiBQcm9taXNlIHN1cHBvcnRcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmVqZWN0XVxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uIHRoZW4ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gIGlmICghdGhpcy5fZnVsbGZpbGxlZFByb21pc2UpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHRoaXMuX2VuZENhbGxlZCkge1xuICAgICAgY29uc29sZS53YXJuKFwiV2FybmluZzogc3VwZXJhZ2VudCByZXF1ZXN0IHdhcyBzZW50IHR3aWNlLCBiZWNhdXNlIGJvdGggLmVuZCgpIGFuZCAudGhlbigpIHdlcmUgY2FsbGVkLiBOZXZlciBjYWxsIC5lbmQoKSBpZiB5b3UgdXNlIHByb21pc2VzXCIpO1xuICAgIH1cbiAgICB0aGlzLl9mdWxsZmlsbGVkUHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKGlubmVyUmVzb2x2ZSwgaW5uZXJSZWplY3QpIHtcbiAgICAgIHNlbGYuZW5kKGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgICAgIGlmIChlcnIpIGlubmVyUmVqZWN0KGVycik7XG4gICAgICAgIGVsc2UgaW5uZXJSZXNvbHZlKHJlcyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gdGhpcy5fZnVsbGZpbGxlZFByb21pc2UudGhlbihyZXNvbHZlLCByZWplY3QpO1xufTtcblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLmNhdGNoID0gZnVuY3Rpb24oY2IpIHtcbiAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIGNiKTtcbn07XG5cbi8qKlxuICogQWxsb3cgZm9yIGV4dGVuc2lvblxuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UoZm4pIHtcbiAgZm4odGhpcyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLm9rID0gZnVuY3Rpb24oY2IpIHtcbiAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBjYikgdGhyb3cgRXJyb3IoXCJDYWxsYmFjayByZXF1aXJlZFwiKTtcbiAgdGhpcy5fb2tDYWxsYmFjayA9IGNiO1xuICByZXR1cm4gdGhpcztcbn07XG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5faXNSZXNwb25zZU9LID0gZnVuY3Rpb24ocmVzKSB7XG4gIGlmICghcmVzKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHRoaXMuX29rQ2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5fb2tDYWxsYmFjayhyZXMpO1xuICB9XG5cbiAgcmV0dXJuIHJlcy5zdGF0dXMgPj0gMjAwICYmIHJlcy5zdGF0dXMgPCAzMDA7XG59O1xuXG4vKipcbiAqIEdldCByZXF1ZXN0IGhlYWRlciBgZmllbGRgLlxuICogQ2FzZS1pbnNlbnNpdGl2ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgcmV0dXJuIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbn07XG5cbi8qKlxuICogR2V0IGNhc2UtaW5zZW5zaXRpdmUgaGVhZGVyIGBmaWVsZGAgdmFsdWUuXG4gKiBUaGlzIGlzIGEgZGVwcmVjYXRlZCBpbnRlcm5hbCBBUEkuIFVzZSBgLmdldChmaWVsZClgIGluc3RlYWQuXG4gKlxuICogKGdldEhlYWRlciBpcyBubyBsb25nZXIgdXNlZCBpbnRlcm5hbGx5IGJ5IHRoZSBzdXBlcmFnZW50IGNvZGUgYmFzZSlcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICogQGRlcHJlY2F0ZWRcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuZ2V0SGVhZGVyID0gUmVxdWVzdEJhc2UucHJvdG90eXBlLmdldDtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIGBmaWVsZGAgdG8gYHZhbGAsIG9yIG11bHRpcGxlIGZpZWxkcyB3aXRoIG9uZSBvYmplY3QuXG4gKiBDYXNlLWluc2Vuc2l0aXZlLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnNldCgnQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKVxuICogICAgICAgIC5zZXQoJ1gtQVBJLUtleScsICdmb29iYXInKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnNldCh7IEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLCAnWC1BUEktS2V5JzogJ2Zvb2JhcicgfSlcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGZpZWxkXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGZpZWxkLCB2YWwpe1xuICBpZiAoaXNPYmplY3QoZmllbGQpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGZpZWxkKSB7XG4gICAgICB0aGlzLnNldChrZXksIGZpZWxkW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV0gPSB2YWw7XG4gIHRoaXMuaGVhZGVyW2ZpZWxkXSA9IHZhbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBoZWFkZXIgYGZpZWxkYC5cbiAqIENhc2UtaW5zZW5zaXRpdmUuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC51bnNldCgnVXNlci1BZ2VudCcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKi9cblJlcXVlc3RCYXNlLnByb3RvdHlwZS51bnNldCA9IGZ1bmN0aW9uKGZpZWxkKXtcbiAgZGVsZXRlIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbiAgZGVsZXRlIHRoaXMuaGVhZGVyW2ZpZWxkXTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFdyaXRlIHRoZSBmaWVsZCBgbmFtZWAgYW5kIGB2YWxgLCBvciBtdWx0aXBsZSBmaWVsZHMgd2l0aCBvbmUgb2JqZWN0XG4gKiBmb3IgXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIgcmVxdWVzdCBib2RpZXMuXG4gKlxuICogYGBgIGpzXG4gKiByZXF1ZXN0LnBvc3QoJy91cGxvYWQnKVxuICogICAuZmllbGQoJ2ZvbycsICdiYXInKVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiByZXF1ZXN0LnBvc3QoJy91cGxvYWQnKVxuICogICAuZmllbGQoeyBmb286ICdiYXInLCBiYXo6ICdxdXgnIH0pXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ3xCbG9ifEZpbGV8QnVmZmVyfGZzLlJlYWRTdHJlYW19IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuZmllbGQgPSBmdW5jdGlvbihuYW1lLCB2YWwpIHtcbiAgLy8gbmFtZSBzaG91bGQgYmUgZWl0aGVyIGEgc3RyaW5nIG9yIGFuIG9iamVjdC5cbiAgaWYgKG51bGwgPT09IG5hbWUgfHwgdW5kZWZpbmVkID09PSBuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCcuZmllbGQobmFtZSwgdmFsKSBuYW1lIGNhbiBub3QgYmUgZW1wdHknKTtcbiAgfVxuXG4gIGlmICh0aGlzLl9kYXRhKSB7XG4gICAgY29uc29sZS5lcnJvcihcIi5maWVsZCgpIGNhbid0IGJlIHVzZWQgaWYgLnNlbmQoKSBpcyB1c2VkLiBQbGVhc2UgdXNlIG9ubHkgLnNlbmQoKSBvciBvbmx5IC5maWVsZCgpICYgLmF0dGFjaCgpXCIpO1xuICB9XG5cbiAgaWYgKGlzT2JqZWN0KG5hbWUpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG5hbWUpIHtcbiAgICAgIHRoaXMuZmllbGQoa2V5LCBuYW1lW2tleV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICBmb3IgKHZhciBpIGluIHZhbCkge1xuICAgICAgdGhpcy5maWVsZChuYW1lLCB2YWxbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHZhbCBzaG91bGQgYmUgZGVmaW5lZCBub3dcbiAgaWYgKG51bGwgPT09IHZhbCB8fCB1bmRlZmluZWQgPT09IHZhbCkge1xuICAgIHRocm93IG5ldyBFcnJvcignLmZpZWxkKG5hbWUsIHZhbCkgdmFsIGNhbiBub3QgYmUgZW1wdHknKTtcbiAgfVxuICBpZiAoJ2Jvb2xlYW4nID09PSB0eXBlb2YgdmFsKSB7XG4gICAgdmFsID0gJycgKyB2YWw7XG4gIH1cbiAgdGhpcy5fZ2V0Rm9ybURhdGEoKS5hcHBlbmQobmFtZSwgdmFsKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFib3J0IHRoZSByZXF1ZXN0LCBhbmQgY2xlYXIgcG90ZW50aWFsIHRpbWVvdXQuXG4gKlxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uKCl7XG4gIGlmICh0aGlzLl9hYm9ydGVkKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgdGhpcy5fYWJvcnRlZCA9IHRydWU7XG4gIHRoaXMueGhyICYmIHRoaXMueGhyLmFib3J0KCk7IC8vIGJyb3dzZXJcbiAgdGhpcy5yZXEgJiYgdGhpcy5yZXEuYWJvcnQoKTsgLy8gbm9kZVxuICB0aGlzLmNsZWFyVGltZW91dCgpO1xuICB0aGlzLmVtaXQoJ2Fib3J0Jyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLl9hdXRoID0gZnVuY3Rpb24odXNlciwgcGFzcywgb3B0aW9ucywgYmFzZTY0RW5jb2Rlcikge1xuICBzd2l0Y2ggKG9wdGlvbnMudHlwZSkge1xuICAgIGNhc2UgJ2Jhc2ljJzpcbiAgICAgIHRoaXMuc2V0KCdBdXRob3JpemF0aW9uJywgJ0Jhc2ljICcgKyBiYXNlNjRFbmNvZGVyKHVzZXIgKyAnOicgKyBwYXNzKSk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2F1dG8nOlxuICAgICAgdGhpcy51c2VybmFtZSA9IHVzZXI7XG4gICAgICB0aGlzLnBhc3N3b3JkID0gcGFzcztcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnYmVhcmVyJzogLy8gdXNhZ2Ugd291bGQgYmUgLmF1dGgoYWNjZXNzVG9rZW4sIHsgdHlwZTogJ2JlYXJlcicgfSlcbiAgICAgIHRoaXMuc2V0KCdBdXRob3JpemF0aW9uJywgJ0JlYXJlciAnICsgdXNlcik7XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRW5hYmxlIHRyYW5zbWlzc2lvbiBvZiBjb29raWVzIHdpdGggeC1kb21haW4gcmVxdWVzdHMuXG4gKlxuICogTm90ZSB0aGF0IGZvciB0aGlzIHRvIHdvcmsgdGhlIG9yaWdpbiBtdXN0IG5vdCBiZVxuICogdXNpbmcgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIiB3aXRoIGEgd2lsZGNhcmQsXG4gKiBhbmQgYWxzbyBtdXN0IHNldCBcIkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzXCJcbiAqIHRvIFwidHJ1ZVwiLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLndpdGhDcmVkZW50aWFscyA9IGZ1bmN0aW9uKG9uKSB7XG4gIC8vIFRoaXMgaXMgYnJvd3Nlci1vbmx5IGZ1bmN0aW9uYWxpdHkuIE5vZGUgc2lkZSBpcyBuby1vcC5cbiAgaWYgKG9uID09IHVuZGVmaW5lZCkgb24gPSB0cnVlO1xuICB0aGlzLl93aXRoQ3JlZGVudGlhbHMgPSBvbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgbWF4IHJlZGlyZWN0cyB0byBgbmAuIERvZXMgbm90aW5nIGluIGJyb3dzZXIgWEhSIGltcGxlbWVudGF0aW9uLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnJlZGlyZWN0cyA9IGZ1bmN0aW9uKG4pe1xuICB0aGlzLl9tYXhSZWRpcmVjdHMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogTWF4aW11bSBzaXplIG9mIGJ1ZmZlcmVkIHJlc3BvbnNlIGJvZHksIGluIGJ5dGVzLiBDb3VudHMgdW5jb21wcmVzc2VkIHNpemUuXG4gKiBEZWZhdWx0IDIwME1CLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqL1xuUmVxdWVzdEJhc2UucHJvdG90eXBlLm1heFJlc3BvbnNlU2l6ZSA9IGZ1bmN0aW9uKG4pe1xuICBpZiAoJ251bWJlcicgIT09IHR5cGVvZiBuKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFwiSW52YWxpZCBhcmd1bWVudFwiKTtcbiAgfVxuICB0aGlzLl9tYXhSZXNwb25zZVNpemUgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ29udmVydCB0byBhIHBsYWluIGphdmFzY3JpcHQgb2JqZWN0IChub3QgSlNPTiBzdHJpbmcpIG9mIHNjYWxhciBwcm9wZXJ0aWVzLlxuICogTm90ZSBhcyB0aGlzIG1ldGhvZCBpcyBkZXNpZ25lZCB0byByZXR1cm4gYSB1c2VmdWwgbm9uLXRoaXMgdmFsdWUsXG4gKiBpdCBjYW5ub3QgYmUgY2hhaW5lZC5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IGRlc2NyaWJpbmcgbWV0aG9kLCB1cmwsIGFuZCBkYXRhIG9mIHRoaXMgcmVxdWVzdFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgbWV0aG9kOiB0aGlzLm1ldGhvZCxcbiAgICB1cmw6IHRoaXMudXJsLFxuICAgIGRhdGE6IHRoaXMuX2RhdGEsXG4gICAgaGVhZGVyczogdGhpcy5faGVhZGVyLFxuICB9O1xufTtcblxuLyoqXG4gKiBTZW5kIGBkYXRhYCBhcyB0aGUgcmVxdWVzdCBib2R5LCBkZWZhdWx0aW5nIHRoZSBgLnR5cGUoKWAgdG8gXCJqc29uXCIgd2hlblxuICogYW4gb2JqZWN0IGlzIGdpdmVuLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgIC8vIG1hbnVhbCBqc29uXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2pzb24nKVxuICogICAgICAgICAuc2VuZCgne1wibmFtZVwiOlwidGpcIn0nKVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGF1dG8ganNvblxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIG1hbnVhbCB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnZm9ybScpXG4gKiAgICAgICAgIC5zZW5kKCduYW1lPXRqJylcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBhdXRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdmb3JtJylcbiAqICAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gZGVmYXVsdHMgdG8geC13d3ctZm9ybS11cmxlbmNvZGVkXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgIC5zZW5kKCduYW1lPXRvYmknKVxuICogICAgICAgIC5zZW5kKCdzcGVjaWVzPWZlcnJldCcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IGRhdGFcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKGRhdGEpe1xuICB2YXIgaXNPYmogPSBpc09iamVjdChkYXRhKTtcbiAgdmFyIHR5cGUgPSB0aGlzLl9oZWFkZXJbJ2NvbnRlbnQtdHlwZSddO1xuXG4gIGlmICh0aGlzLl9mb3JtRGF0YSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCIuc2VuZCgpIGNhbid0IGJlIHVzZWQgaWYgLmF0dGFjaCgpIG9yIC5maWVsZCgpIGlzIHVzZWQuIFBsZWFzZSB1c2Ugb25seSAuc2VuZCgpIG9yIG9ubHkgLmZpZWxkKCkgJiAuYXR0YWNoKClcIik7XG4gIH1cblxuICBpZiAoaXNPYmogJiYgIXRoaXMuX2RhdGEpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgdGhpcy5fZGF0YSA9IFtdO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuX2lzSG9zdChkYXRhKSkge1xuICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuICAgIH1cbiAgfSBlbHNlIGlmIChkYXRhICYmIHRoaXMuX2RhdGEgJiYgdGhpcy5faXNIb3N0KHRoaXMuX2RhdGEpKSB7XG4gICAgdGhyb3cgRXJyb3IoXCJDYW4ndCBtZXJnZSB0aGVzZSBzZW5kIGNhbGxzXCIpO1xuICB9XG5cbiAgLy8gbWVyZ2VcbiAgaWYgKGlzT2JqICYmIGlzT2JqZWN0KHRoaXMuX2RhdGEpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcbiAgICAgIHRoaXMuX2RhdGFba2V5XSA9IGRhdGFba2V5XTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIGRhdGEpIHtcbiAgICAvLyBkZWZhdWx0IHRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICAgIGlmICghdHlwZSkgdGhpcy50eXBlKCdmb3JtJyk7XG4gICAgdHlwZSA9IHRoaXMuX2hlYWRlclsnY29udGVudC10eXBlJ107XG4gICAgaWYgKCdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnID09IHR5cGUpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSB0aGlzLl9kYXRhXG4gICAgICAgID8gdGhpcy5fZGF0YSArICcmJyArIGRhdGFcbiAgICAgICAgOiBkYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kYXRhID0gKHRoaXMuX2RhdGEgfHwgJycpICsgZGF0YTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gIH1cblxuICBpZiAoIWlzT2JqIHx8IHRoaXMuX2lzSG9zdChkYXRhKSkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZGVmYXVsdCB0byBqc29uXG4gIGlmICghdHlwZSkgdGhpcy50eXBlKCdqc29uJyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTb3J0IGBxdWVyeXN0cmluZ2AgYnkgdGhlIHNvcnQgZnVuY3Rpb25cbiAqXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICAgLy8gZGVmYXVsdCBvcmRlclxuICogICAgICAgcmVxdWVzdC5nZXQoJy91c2VyJylcbiAqICAgICAgICAgLnF1ZXJ5KCduYW1lPU5pY2snKVxuICogICAgICAgICAucXVlcnkoJ3NlYXJjaD1NYW5ueScpXG4gKiAgICAgICAgIC5zb3J0UXVlcnkoKVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGN1c3RvbWl6ZWQgc29ydCBmdW5jdGlvblxuICogICAgICAgcmVxdWVzdC5nZXQoJy91c2VyJylcbiAqICAgICAgICAgLnF1ZXJ5KCduYW1lPU5pY2snKVxuICogICAgICAgICAucXVlcnkoJ3NlYXJjaD1NYW5ueScpXG4gKiAgICAgICAgIC5zb3J0UXVlcnkoZnVuY3Rpb24oYSwgYil7XG4gKiAgICAgICAgICAgcmV0dXJuIGEubGVuZ3RoIC0gYi5sZW5ndGg7XG4gKiAgICAgICAgIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHNvcnRcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuc29ydFF1ZXJ5ID0gZnVuY3Rpb24oc29ydCkge1xuICAvLyBfc29ydCBkZWZhdWx0IHRvIHRydWUgYnV0IG90aGVyd2lzZSBjYW4gYmUgYSBmdW5jdGlvbiBvciBib29sZWFuXG4gIHRoaXMuX3NvcnQgPSB0eXBlb2Ygc29ydCA9PT0gJ3VuZGVmaW5lZCcgPyB0cnVlIDogc29ydDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENvbXBvc2UgcXVlcnlzdHJpbmcgdG8gYXBwZW5kIHRvIHJlcS51cmxcbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuUmVxdWVzdEJhc2UucHJvdG90eXBlLl9maW5hbGl6ZVF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24oKXtcbiAgdmFyIHF1ZXJ5ID0gdGhpcy5fcXVlcnkuam9pbignJicpO1xuICBpZiAocXVlcnkpIHtcbiAgICB0aGlzLnVybCArPSAodGhpcy51cmwuaW5kZXhPZignPycpID49IDAgPyAnJicgOiAnPycpICsgcXVlcnk7XG4gIH1cbiAgdGhpcy5fcXVlcnkubGVuZ3RoID0gMDsgLy8gTWFrZXMgdGhlIGNhbGwgaWRlbXBvdGVudFxuXG4gIGlmICh0aGlzLl9zb3J0KSB7XG4gICAgdmFyIGluZGV4ID0gdGhpcy51cmwuaW5kZXhPZignPycpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICB2YXIgcXVlcnlBcnIgPSB0aGlzLnVybC5zdWJzdHJpbmcoaW5kZXggKyAxKS5zcGxpdCgnJicpO1xuICAgICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiB0aGlzLl9zb3J0KSB7XG4gICAgICAgIHF1ZXJ5QXJyLnNvcnQodGhpcy5fc29ydCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBxdWVyeUFyci5zb3J0KCk7XG4gICAgICB9XG4gICAgICB0aGlzLnVybCA9IHRoaXMudXJsLnN1YnN0cmluZygwLCBpbmRleCkgKyAnPycgKyBxdWVyeUFyci5qb2luKCcmJyk7XG4gICAgfVxuICB9XG59O1xuXG4vLyBGb3IgYmFja3dhcmRzIGNvbXBhdCBvbmx5XG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuX2FwcGVuZFF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24oKSB7Y29uc29sZS50cmFjZShcIlVuc3VwcG9ydGVkXCIpO31cblxuLyoqXG4gKiBJbnZva2UgY2FsbGJhY2sgd2l0aCB0aW1lb3V0IGVycm9yLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5fdGltZW91dEVycm9yID0gZnVuY3Rpb24ocmVhc29uLCB0aW1lb3V0LCBlcnJubyl7XG4gIGlmICh0aGlzLl9hYm9ydGVkKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IocmVhc29uICsgdGltZW91dCArICdtcyBleGNlZWRlZCcpO1xuICBlcnIudGltZW91dCA9IHRpbWVvdXQ7XG4gIGVyci5jb2RlID0gJ0VDT05OQUJPUlRFRCc7XG4gIGVyci5lcnJubyA9IGVycm5vO1xuICB0aGlzLnRpbWVkb3V0ID0gdHJ1ZTtcbiAgdGhpcy5hYm9ydCgpO1xuICB0aGlzLmNhbGxiYWNrKGVycik7XG59O1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuX3NldFRpbWVvdXRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICAvLyBkZWFkbGluZVxuICBpZiAodGhpcy5fdGltZW91dCAmJiAhdGhpcy5fdGltZXIpIHtcbiAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHNlbGYuX3RpbWVvdXRFcnJvcignVGltZW91dCBvZiAnLCBzZWxmLl90aW1lb3V0LCAnRVRJTUUnKTtcbiAgICB9LCB0aGlzLl90aW1lb3V0KTtcbiAgfVxuICAvLyByZXNwb25zZSB0aW1lb3V0XG4gIGlmICh0aGlzLl9yZXNwb25zZVRpbWVvdXQgJiYgIXRoaXMuX3Jlc3BvbnNlVGltZW91dFRpbWVyKSB7XG4gICAgdGhpcy5fcmVzcG9uc2VUaW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICBzZWxmLl90aW1lb3V0RXJyb3IoJ1Jlc3BvbnNlIHRpbWVvdXQgb2YgJywgc2VsZi5fcmVzcG9uc2VUaW1lb3V0LCAnRVRJTUVET1VUJyk7XG4gICAgfSwgdGhpcy5fcmVzcG9uc2VUaW1lb3V0KTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuLyoqXG4gKiBFeHBvc2UgYFJlc3BvbnNlQmFzZWAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBSZXNwb25zZUJhc2U7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgUmVzcG9uc2VCYXNlYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFJlc3BvbnNlQmFzZShvYmopIHtcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XG59XG5cbi8qKlxuICogTWl4aW4gdGhlIHByb3RvdHlwZSBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gUmVzcG9uc2VCYXNlLnByb3RvdHlwZSkge1xuICAgIG9ialtrZXldID0gUmVzcG9uc2VCYXNlLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogR2V0IGNhc2UtaW5zZW5zaXRpdmUgYGZpZWxkYCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVzcG9uc2VCYXNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihmaWVsZCkge1xuICByZXR1cm4gdGhpcy5oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG59O1xuXG4vKipcbiAqIFNldCBoZWFkZXIgcmVsYXRlZCBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBgLnR5cGVgIHRoZSBjb250ZW50IHR5cGUgd2l0aG91dCBwYXJhbXNcbiAqXG4gKiBBIHJlc3BvbnNlIG9mIFwiQ29udGVudC1UeXBlOiB0ZXh0L3BsYWluOyBjaGFyc2V0PXV0Zi04XCJcbiAqIHdpbGwgcHJvdmlkZSB5b3Ugd2l0aCBhIGAudHlwZWAgb2YgXCJ0ZXh0L3BsYWluXCIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGhlYWRlclxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2VCYXNlLnByb3RvdHlwZS5fc2V0SGVhZGVyUHJvcGVydGllcyA9IGZ1bmN0aW9uKGhlYWRlcil7XG4gICAgLy8gVE9ETzogbW9hciFcbiAgICAvLyBUT0RPOiBtYWtlIHRoaXMgYSB1dGlsXG5cbiAgICAvLyBjb250ZW50LXR5cGVcbiAgICB2YXIgY3QgPSBoZWFkZXJbJ2NvbnRlbnQtdHlwZSddIHx8ICcnO1xuICAgIHRoaXMudHlwZSA9IHV0aWxzLnR5cGUoY3QpO1xuXG4gICAgLy8gcGFyYW1zXG4gICAgdmFyIHBhcmFtcyA9IHV0aWxzLnBhcmFtcyhjdCk7XG4gICAgZm9yICh2YXIga2V5IGluIHBhcmFtcykgdGhpc1trZXldID0gcGFyYW1zW2tleV07XG5cbiAgICB0aGlzLmxpbmtzID0ge307XG5cbiAgICAvLyBsaW5rc1xuICAgIHRyeSB7XG4gICAgICAgIGlmIChoZWFkZXIubGluaykge1xuICAgICAgICAgICAgdGhpcy5saW5rcyA9IHV0aWxzLnBhcnNlTGlua3MoaGVhZGVyLmxpbmspO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIC8vIGlnbm9yZVxuICAgIH1cbn07XG5cbi8qKlxuICogU2V0IGZsYWdzIHN1Y2ggYXMgYC5va2AgYmFzZWQgb24gYHN0YXR1c2AuXG4gKlxuICogRm9yIGV4YW1wbGUgYSAyeHggcmVzcG9uc2Ugd2lsbCBnaXZlIHlvdSBhIGAub2tgIG9mIF9fdHJ1ZV9fXG4gKiB3aGVyZWFzIDV4eCB3aWxsIGJlIF9fZmFsc2VfXyBhbmQgYC5lcnJvcmAgd2lsbCBiZSBfX3RydWVfXy4gVGhlXG4gKiBgLmNsaWVudEVycm9yYCBhbmQgYC5zZXJ2ZXJFcnJvcmAgYXJlIGFsc28gYXZhaWxhYmxlIHRvIGJlIG1vcmVcbiAqIHNwZWNpZmljLCBhbmQgYC5zdGF0dXNUeXBlYCBpcyB0aGUgY2xhc3Mgb2YgZXJyb3IgcmFuZ2luZyBmcm9tIDEuLjVcbiAqIHNvbWV0aW1lcyB1c2VmdWwgZm9yIG1hcHBpbmcgcmVzcG9uZCBjb2xvcnMgZXRjLlxuICpcbiAqIFwic3VnYXJcIiBwcm9wZXJ0aWVzIGFyZSBhbHNvIGRlZmluZWQgZm9yIGNvbW1vbiBjYXNlcy4gQ3VycmVudGx5IHByb3ZpZGluZzpcbiAqXG4gKiAgIC0gLm5vQ29udGVudFxuICogICAtIC5iYWRSZXF1ZXN0XG4gKiAgIC0gLnVuYXV0aG9yaXplZFxuICogICAtIC5ub3RBY2NlcHRhYmxlXG4gKiAgIC0gLm5vdEZvdW5kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2VCYXNlLnByb3RvdHlwZS5fc2V0U3RhdHVzUHJvcGVydGllcyA9IGZ1bmN0aW9uKHN0YXR1cyl7XG4gICAgdmFyIHR5cGUgPSBzdGF0dXMgLyAxMDAgfCAwO1xuXG4gICAgLy8gc3RhdHVzIC8gY2xhc3NcbiAgICB0aGlzLnN0YXR1cyA9IHRoaXMuc3RhdHVzQ29kZSA9IHN0YXR1cztcbiAgICB0aGlzLnN0YXR1c1R5cGUgPSB0eXBlO1xuXG4gICAgLy8gYmFzaWNzXG4gICAgdGhpcy5pbmZvID0gMSA9PSB0eXBlO1xuICAgIHRoaXMub2sgPSAyID09IHR5cGU7XG4gICAgdGhpcy5yZWRpcmVjdCA9IDMgPT0gdHlwZTtcbiAgICB0aGlzLmNsaWVudEVycm9yID0gNCA9PSB0eXBlO1xuICAgIHRoaXMuc2VydmVyRXJyb3IgPSA1ID09IHR5cGU7XG4gICAgdGhpcy5lcnJvciA9ICg0ID09IHR5cGUgfHwgNSA9PSB0eXBlKVxuICAgICAgICA/IHRoaXMudG9FcnJvcigpXG4gICAgICAgIDogZmFsc2U7XG5cbiAgICAvLyBzdWdhclxuICAgIHRoaXMuYWNjZXB0ZWQgPSAyMDIgPT0gc3RhdHVzO1xuICAgIHRoaXMubm9Db250ZW50ID0gMjA0ID09IHN0YXR1cztcbiAgICB0aGlzLmJhZFJlcXVlc3QgPSA0MDAgPT0gc3RhdHVzO1xuICAgIHRoaXMudW5hdXRob3JpemVkID0gNDAxID09IHN0YXR1cztcbiAgICB0aGlzLm5vdEFjY2VwdGFibGUgPSA0MDYgPT0gc3RhdHVzO1xuICAgIHRoaXMuZm9yYmlkZGVuID0gNDAzID09IHN0YXR1cztcbiAgICB0aGlzLm5vdEZvdW5kID0gNDA0ID09IHN0YXR1cztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogUmV0dXJuIHRoZSBtaW1lIHR5cGUgZm9yIHRoZSBnaXZlbiBgc3RyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLnR5cGUgPSBmdW5jdGlvbihzdHIpe1xuICByZXR1cm4gc3RyLnNwbGl0KC8gKjsgKi8pLnNoaWZ0KCk7XG59O1xuXG4vKipcbiAqIFJldHVybiBoZWFkZXIgZmllbGQgcGFyYW1ldGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLnBhcmFtcyA9IGZ1bmN0aW9uKHN0cil7XG4gIHJldHVybiBzdHIuc3BsaXQoLyAqOyAqLykucmVkdWNlKGZ1bmN0aW9uKG9iaiwgc3RyKXtcbiAgICB2YXIgcGFydHMgPSBzdHIuc3BsaXQoLyAqPSAqLyk7XG4gICAgdmFyIGtleSA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgdmFyIHZhbCA9IHBhcnRzLnNoaWZ0KCk7XG5cbiAgICBpZiAoa2V5ICYmIHZhbCkgb2JqW2tleV0gPSB2YWw7XG4gICAgcmV0dXJuIG9iajtcbiAgfSwge30pO1xufTtcblxuLyoqXG4gKiBQYXJzZSBMaW5rIGhlYWRlciBmaWVsZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5wYXJzZUxpbmtzID0gZnVuY3Rpb24oc3RyKXtcbiAgcmV0dXJuIHN0ci5zcGxpdCgvICosICovKS5yZWR1Y2UoZnVuY3Rpb24ob2JqLCBzdHIpe1xuICAgIHZhciBwYXJ0cyA9IHN0ci5zcGxpdCgvICo7ICovKTtcbiAgICB2YXIgdXJsID0gcGFydHNbMF0uc2xpY2UoMSwgLTEpO1xuICAgIHZhciByZWwgPSBwYXJ0c1sxXS5zcGxpdCgvICo9ICovKVsxXS5zbGljZSgxLCAtMSk7XG4gICAgb2JqW3JlbF0gPSB1cmw7XG4gICAgcmV0dXJuIG9iajtcbiAgfSwge30pO1xufTtcblxuLyoqXG4gKiBTdHJpcCBjb250ZW50IHJlbGF0ZWQgZmllbGRzIGZyb20gYGhlYWRlcmAuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGhlYWRlclxuICogQHJldHVybiB7T2JqZWN0fSBoZWFkZXJcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMuY2xlYW5IZWFkZXIgPSBmdW5jdGlvbihoZWFkZXIsIGNoYW5nZXNPcmlnaW4pe1xuICBkZWxldGUgaGVhZGVyWydjb250ZW50LXR5cGUnXTtcbiAgZGVsZXRlIGhlYWRlclsnY29udGVudC1sZW5ndGgnXTtcbiAgZGVsZXRlIGhlYWRlclsndHJhbnNmZXItZW5jb2RpbmcnXTtcbiAgZGVsZXRlIGhlYWRlclsnaG9zdCddO1xuICAvLyBzZWN1aXJ0eVxuICBpZiAoY2hhbmdlc09yaWdpbikge1xuICAgIGRlbGV0ZSBoZWFkZXJbJ2F1dGhvcml6YXRpb24nXTtcbiAgICBkZWxldGUgaGVhZGVyWydjb29raWUnXTtcbiAgfVxuICByZXR1cm4gaGVhZGVyO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzPXtcbiAgXCJuYW1lXCI6IFwid3RmX3dpa2lwZWRpYVwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwicGFyc2Ugd2lraXNjcmlwdCBpbnRvIGpzb25cIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMi42LjJcIixcbiAgXCJhdXRob3JcIjogXCJTcGVuY2VyIEtlbGx5IDxzcGVuY2VybW91bnRhaW5AZ21haWwuY29tPiAoaHR0cDovL3NwZW5jZXJtb3VudGEuaW4pXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQ6Ly9naXRodWIuY29tL3NwZW5jZXJtb3VudGFpbi93dGZfd2lraXBlZGlhLmdpdFwiXG4gIH0sXG4gIFwibWFpblwiOiBcIi4vc3JjL2luZGV4LmpzXCIsXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJzdGFydFwiOiBcIm5vZGUgLi9zY3JpcHRzL2RlbW8uanNcIixcbiAgICBcInRlc3RcIjogXCJub2RlIC4vc2NyaXB0cy90ZXN0LmpzXCIsXG4gICAgXCJwb3N0cHVibGlzaFwiOiBcIm5vZGUgLi9zY3JpcHRzL2NvdmVyYWdlLmpzXCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcIm5vZGUgLi9zY3JpcHRzL2NvdmVyYWdlLmpzXCIsXG4gICAgXCJ0ZXN0YlwiOiBcIlRFU1RFTlY9cHJvZCBub2RlIC4vc2NyaXB0cy90ZXN0LmpzXCIsXG4gICAgXCJ3YXRjaFwiOiBcImFtYmxlIC4vc2NyYXRjaC5qc1wiLFxuICAgIFwiYnVpbGRcIjogXCJub2RlIC4vc2NyaXB0cy9idWlsZC5qc1wiXG4gIH0sXG4gIFwiYmluXCI6IHtcbiAgICBcIndpa2lwZWRpYVwiOiBcIi4vYmluL3BhcnNlLmpzXCIsXG4gICAgXCJ3aWtpcGVkaWFfcGxhaW50ZXh0XCI6IFwiLi9iaW4vcGxhaW50ZXh0LmpzXCJcbiAgfSxcbiAgXCJmaWxlc1wiOiBbXG4gICAgXCJidWlsZHNcIixcbiAgICBcInNyY1wiLFxuICAgIFwiYmluXCJcbiAgXSxcbiAgXCJrZXl3b3Jkc1wiOiBbXG4gICAgXCJ3aWtpcGVkaWFcIixcbiAgICBcIndpa2ltZWRpYVwiLFxuICAgIFwid2lraXBlZGlhIG1hcmt1cFwiLFxuICAgIFwid2lraXNjcmlwdFwiXG4gIF0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImpzaGFzaGVzXCI6IFwiXjEuMC42XCIsXG4gICAgXCJzdXBlcmFnZW50XCI6IFwiXjMuOC4yXCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiYW1ibGVcIjogXCIwLjAuNVwiLFxuICAgIFwiYmFiZWwtY2xpXCI6IFwiXjYuMTAuMVwiLFxuICAgIFwiYmFiZWwtcGx1Z2luLXRyYW5zZm9ybS1vYmplY3QtYXNzaWduXCI6IFwiXjYuOC4wXCIsXG4gICAgXCJiYWJlbC1wcmVzZXQtZXMyMDE1XCI6IFwiNi4yNC4xXCIsXG4gICAgXCJiYWJlbGlmeVwiOiBcIjguMC4wXCIsXG4gICAgXCJicm93c2VyaWZ5XCI6IFwiMTQuNC4wXCIsXG4gICAgXCJjb2RhY3ktY292ZXJhZ2VcIjogXCJeMi4wLjBcIixcbiAgICBcImRlcmVxdWlyZVwiOiBcIl4yLjAuM1wiLFxuICAgIFwiZG9jdG9jXCI6IFwiXjEuMy4wXCIsXG4gICAgXCJlc2xpbnRcIjogXCJeNC4xNy4wXCIsXG4gICAgXCJnYXplXCI6IFwiXjEuMS4xXCIsXG4gICAgXCJueWNcIjogXCJeOC40LjBcIixcbiAgICBcInNoZWxsanNcIjogXCJeMC44LjFcIixcbiAgICBcInRhcC1taW5cIjogXCJeMS4yLjFcIixcbiAgICBcInRhcC1zcGVjXCI6IFwiNC4xLjFcIixcbiAgICBcInRhcGVcIjogXCI0LjguMFwiLFxuICAgIFwidWdsaWZ5LWpzXCI6IFwiMy4zLjlcIlxuICB9LFxuICBcImxpY2Vuc2VcIjogXCJNSVRcIlxufVxuIiwiLy90aGVzZSBhcmUgdXNlZCBmb3IgdGhlIHNlbnRlbmNlLXNwbGl0dGVyXG5tb2R1bGUuZXhwb3J0cyA9IFtcbiAgJ2pyJyxcbiAgJ21yJyxcbiAgJ21ycycsXG4gICdtcycsXG4gICdkcicsXG4gICdwcm9mJyxcbiAgJ3NyJyxcbiAgJ3NlbicsXG4gICdjb3JwJyxcbiAgJ2NhbGlmJyxcbiAgJ3JlcCcsXG4gICdnb3YnLFxuICAnYXR0eScsXG4gICdzdXB0JyxcbiAgJ2RldCcsXG4gICdyZXYnLFxuICAnY29sJyxcbiAgJ2dlbicsXG4gICdsdCcsXG4gICdjbWRyJyxcbiAgJ2FkbScsXG4gICdjYXB0JyxcbiAgJ3NndCcsXG4gICdjcGwnLFxuICAnbWFqJyxcbiAgJ2RlcHQnLFxuICAndW5pdicsXG4gICdhc3NuJyxcbiAgJ2Jyb3MnLFxuICAnaW5jJyxcbiAgJ2x0ZCcsXG4gICdjbycsXG4gICdjb3JwJyxcbiAgJ2FyYycsXG4gICdhbCcsXG4gICdhdmUnLFxuICAnYmx2ZCcsXG4gICdjbCcsXG4gICdjdCcsXG4gICdjcmVzJyxcbiAgJ2V4cCcsXG4gICdyZCcsXG4gICdzdCcsXG4gICdkaXN0JyxcbiAgJ210JyxcbiAgJ2Z0JyxcbiAgJ2Z5JyxcbiAgJ2h3eScsXG4gICdsYScsXG4gICdwZCcsXG4gICdwbCcsXG4gICdwbHonLFxuICAndGNlJyxcbiAgJ0FsYScsXG4gICdBcml6JyxcbiAgJ0FyaycsXG4gICdDYWwnLFxuICAnQ2FsaWYnLFxuICAnQ29sJyxcbiAgJ0NvbG8nLFxuICAnQ29ubicsXG4gICdEZWwnLFxuICAnRmVkJyxcbiAgJ0ZsYScsXG4gICdHYScsXG4gICdJZGEnLFxuICAnSWQnLFxuICAnSWxsJyxcbiAgJ0luZCcsXG4gICdJYScsXG4gICdLYW4nLFxuICAnS2FucycsXG4gICdLZW4nLFxuICAnS3knLFxuICAnTGEnLFxuICAnTWUnLFxuICAnTWQnLFxuICAnTWFzcycsXG4gICdNaWNoJyxcbiAgJ01pbm4nLFxuICAnTWlzcycsXG4gICdNbycsXG4gICdNb250JyxcbiAgJ05lYicsXG4gICdOZWJyJyxcbiAgJ05ldicsXG4gICdNZXgnLFxuICAnT2tsYScsXG4gICdPaycsXG4gICdPcmUnLFxuICAnUGVubmEnLFxuICAnUGVubicsXG4gICdQYScsXG4gICdEYWsnLFxuICAnVGVubicsXG4gICdUZXgnLFxuICAnVXQnLFxuICAnVnQnLFxuICAnVmEnLFxuICAnV2FzaCcsXG4gICdXaXMnLFxuICAnV2lzYycsXG4gICdXeScsXG4gICdXeW8nLFxuICAnVVNBRkEnLFxuICAnQWx0YScsXG4gICdPbnQnLFxuICAnUXXDlMO4zqknLFxuICAnU2FzaycsXG4gICdZdWsnLFxuICAnamFuJyxcbiAgJ2ZlYicsXG4gICdtYXInLFxuICAnYXByJyxcbiAgJ2p1bicsXG4gICdqdWwnLFxuICAnYXVnJyxcbiAgJ3NlcCcsXG4gICdvY3QnLFxuICAnbm92JyxcbiAgJ2RlYycsXG4gICdzZXB0JyxcbiAgJ3ZzJyxcbiAgJ2V0YycsXG4gICdlc3AnLFxuICAnbGxiJyxcbiAgJ21kJyxcbiAgJ2JsJyxcbiAgJ3BoZCcsXG4gICdtYScsXG4gICdiYScsXG4gICdtaXNzJyxcbiAgJ21pc3NlcycsXG4gICdtaXN0ZXInLFxuICAnc2lyJyxcbiAgJ2VzcScsXG4gICdtc3RyJyxcbiAgJ2xpdCcsXG4gICdmbCcsXG4gICdleCcsXG4gICdlZycsXG4gICdzZXAnLFxuICAnc2VwdCcsXG4gICcuLidcbl07XG4iLCIvLyB3aWtpcGVkaWEgc3BlY2lhbCB0ZXJtcyBsaWZ0ZWQgYW5kIGF1Z21lbnRlZCBmcm9tIHBhcnNvaWQgcGFyc2VyIGFwcmlsIDIwMTVcbi8vIChub3QgZXZlbiBjbG9zZSB0byBiZWluZyBjb21wbGV0ZSlcbmxldCBpMThuID0ge1xuICBmaWxlczogW1xuICAgICfRhNCw0LnQuycsXG4gICAgJ2ZpdHhlcicsXG4gICAgJ3NvdWJvcicsXG4gICAgJ2RhdGVpJyxcbiAgICAnZmlsZScsXG4gICAgJ2FyY2hpdm8nLFxuICAgICfZvtix2YjZhtiv2YcnLFxuICAgICd0aWVkb3N0bycsXG4gICAgJ215bmQnLFxuICAgIFwic3Und3JldFwiLFxuICAgICdmaWNoaWVyJyxcbiAgICAnYmVzdGFuZCcsXG4gICAgJ9C00LDRgtC+0YLQtdC60LAnLFxuICAgICdkb3N5YScsXG4gICAgJ2ZpbCdcbiAgXSxcbiAgaW1hZ2VzOiBbJ2ltYWdlJ10sXG4gIHRlbXBsYXRlczogW1xuICAgICfRiNCw0LHQu9GR0L0nLFxuICAgICdwbGFudGlsbGEnLFxuICAgICfFoWFibG9uYScsXG4gICAgJ3ZvcmxhZ2UnLFxuICAgICd0ZW1wbGF0ZScsXG4gICAgJ9in2YTar9mIJyxcbiAgICAnbWFsbGluZScsXG4gICAgJ3NuacOwJyxcbiAgICAnc2hhYmxvbicsXG4gICAgJ21vZMOobGUnLFxuICAgICdzamFibG9vbicsXG4gICAgJ9GI0LDQsdC70L7QvScsXG4gICAgJ8WfYWJsb24nXG4gIF0sXG4gIGNhdGVnb3JpZXM6IFtcbiAgICAn0LrQsNGC0Y3Qs9C+0YDRi9GPJyxcbiAgICAnY2F0ZWdvcmlhJyxcbiAgICAna2F0ZWdvcmllJyxcbiAgICAnY2F0ZWdvcnknLFxuICAgICdjYXRlZ29yw61hJyxcbiAgICAn2LHYr9mHJyxcbiAgICAnbHVva2thJyxcbiAgICAnZmxva2t1cicsXG4gICAgJ2thdGVnb3JpeWEnLFxuICAgICdjYXTDqWdvcmllJyxcbiAgICAnY2F0ZWdvcmllJyxcbiAgICAn0LrQsNGC0LXQs9C+0YDQuNGY0LAnLFxuICAgICdrYXRlZ29yaScsXG4gICAgJ2thdGVnb3JpYScsXG4gICAgJ9iq2LXZhtmK2YEnXG4gIF0sXG4gIHJlZGlyZWN0czogW1xuICAgICfQv9C10YDQsNC90LDQutGW0YDQsNCy0LDQvdGM0L3QtScsXG4gICAgJ3JlZGlyZWN0JyxcbiAgICAncMWZZXNtxJtydWonLFxuICAgICd3ZWl0ZXJsZWl0dW5nJyxcbiAgICAncmVkaXJlY2Npw7NuJyxcbiAgICAncmVkaXJlY2Npb24nLFxuICAgICfYqti624zbjNixX9mF2LPbjNixJyxcbiAgICAn2KrYutuM24zYsdmF2LPbjNixJyxcbiAgICAnb2hqYXVzJyxcbiAgICAndXVkZWxsZWVub2hqYXVzJyxcbiAgICAndGlsdsOtc3VuJyxcbiAgICAnYcO9ZGF3JyxcbiAgICAn0LDQudC00LDRgycsXG4gICAgJ3JlZGlyZWN0aW9uJyxcbiAgICAnZG9vcnZlcndpanppbmcnLFxuICAgICfQv9GA0LXRg9GB0LzQtdGA0LgnLFxuICAgICfQv9GA0LXRg9GB0LzRmNC10YDQuCcsXG4gICAgJ3nDtm5sZW5kacyHcm1lJyxcbiAgICAnecO2bmxlbmRpzIdyJyxcbiAgICAn6YeN5a6a5ZCRJyxcbiAgICAncmVkaXJlY2Npw7NuJyxcbiAgICAncmVkaXJlY2Npb24nLFxuICAgICfph43lrprlkJEnLFxuICAgICd5w7ZubGVuZGlybT9lPycsXG4gICAgJ9iq2LrbjNuM2LFf2YXYs9uM2LEnLFxuICAgICfYqti624zbjNix2YXYs9uM2LEnLFxuICAgICfQv9C10YDQsNC90LDQutGW0YDQsNCy0LDQvdGM0L3QtScsXG4gICAgJ3nDtm5sZW5kaXJtZSdcbiAgXSxcbiAgc3BlY2lhbHM6IFtcbiAgICAn0YHQv9GN0YbRi9GP0LvRjNC90YvRjycsXG4gICAgJ2VzcGVjaWFsJyxcbiAgICAnc3BlY2nDoWxuw60nLFxuICAgICdzcGV6aWFsJyxcbiAgICAnc3BlY2lhbCcsXG4gICAgJ9mI24zamNmHJyxcbiAgICAndG9pbWlubm90JyxcbiAgICAna2VyZmlzc8Otw7BhJyxcbiAgICAnYXJuYXdsxLEnLFxuICAgICdzcMOpY2lhbCcsXG4gICAgJ3NwZWNpYWFsJyxcbiAgICAn0L/QvtGB0LXQsdC90L4nLFxuICAgICfDtnplbCdcbiAgXSxcbiAgdXNlcnM6IFtcbiAgICAn0YPQtNC30LXQu9GM0L3RltC6JyxcbiAgICAndXN1YXJpJyxcbiAgICAndcW+aXZhdGVsJyxcbiAgICAnYmVudXR6ZXInLFxuICAgICd1c2VyJyxcbiAgICAndXN1YXJpbycsXG4gICAgJ9qp2KfYsdio2LEnLFxuICAgICdrw6R5dHTDpGrDpCcsXG4gICAgJ25vdGFuZGknLFxuICAgICdwYXlkYWxhbsSxd3NoxLEnLFxuICAgICd1dGlsaXNhdGV1cicsXG4gICAgJ2dlYnJ1aWtlcicsXG4gICAgJ9C60L7RgNC40YHQvdC40LonLFxuICAgICdrdWxsYW7EsWPEsSdcbiAgXSxcbiAgZGlzYW1iaWdzOiBbXG4gICAgJ2Rpc2FtYmlnJywgLy9lblxuICAgICdkaXNhbWJpZ3VhdGlvbicsIC8vZW5cbiAgICAnZGFiJywgLy9lblxuICAgICdkaXNhbWInLCAvL2VuXG4gICAgJ2JlZ3JpZmZza2zDpHJ1bmcnLCAvL2RlXG4gICAgJ3VqZWRub3puYWN6bmllbmllJywgLy9wbFxuICAgICdkb29ydmVyd2lqc3BhZ2luYScsIC8vbmxcbiAgICAn5raI5q2n5LmJJywgLy96aFxuICAgICdkZXNhbWJpZ3VhY2nDs24nLCAvL2VzXG4gICAgJ2R1YmJlbHNpbm5pZycsIC8vYWZcbiAgICAnZGlzYW1iaWd1YScsIC8vaXRcbiAgICAnZGVzYW1iaWd1YcOnw6NvJywgLy9wdFxuICAgICdob21vbnltaWUnLCAvL2ZyXG4gICAgJ9C90LXQvtC00L3QvtC30L3QsNGH0L3QvtGB0YLRjCcsIC8vcnVcbiAgICAnYW5sYW0gYXlyxLFtxLEnIC8vdHJcbiAgXSxcbiAgaW5mb2JveGVzOiBbXG4gICAgJ2luZm9ib3gnLFxuICAgICdmaWNoYScsXG4gICAgJ9C60LDQvdCw0LTRgdC60LjQuScsXG4gICAgJ2lubGlndGluZ3NrYXMnLFxuICAgICdpbmxpZ3Rpbmdza2FzMycsIC8vYWZcbiAgICAn2YTYutipJyxcbiAgICAnYmlsZ2kga3V0dXN1JywgLy90clxuICAgICd5ZXJsZcWfaW0gYmlsZ2kga3V0dXN1JyxcbiAgICAnaW5mb2Jva3MnIC8vbm4sIG5vXG4gIF0sXG4gIHNvdXJjZXM6IFtcbiAgICAvL2JsYWNrbGlzdCB0aGVzZSBoZWFkaW5ncywgYXMgdGhleSdyZSBub3QgcGxhaW4tdGV4dFxuICAgICdyZWZlcmVuY2VzJyxcbiAgICAnc2VlIGFsc28nLFxuICAgICdleHRlcm5hbCBsaW5rcycsXG4gICAgJ2Z1cnRoZXIgcmVhZGluZycsXG4gICAgJ25vdGVzIGV0IHLDqWbDqXJlbmNlcycsXG4gICAgJ3ZvaXIgYXVzc2knLFxuICAgICdsaWVucyBleHRlcm5lcydcbiAgXVxufTtcblxubGV0IGRpY3Rpb25hcnkgPSB7fTtcbk9iamVjdC5rZXlzKGkxOG4pLmZvckVhY2goayA9PiB7XG4gIGkxOG5ba10uZm9yRWFjaCh3ID0+IHtcbiAgICBkaWN0aW9uYXJ5W3ddID0gdHJ1ZTtcbiAgfSk7XG59KTtcbmkxOG4uZGljdGlvbmFyeSA9IGRpY3Rpb25hcnk7XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICBtb2R1bGUuZXhwb3J0cyA9IGkxOG47XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWE6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQWZhcicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0FmYXInXG4gIH0sXG4gIGFiOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0Fia2hhemlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9CQ0qfRgdGD0LAnXG4gIH0sXG4gIGFmOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0FmcmlrYWFucycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0FmcmlrYWFucydcbiAgfSxcbiAgYWs6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQWthbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0FrYW5hJ1xuICB9LFxuICBhbHM6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQWxlbWFubmljJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQWxlbWFubmlzY2gnXG4gIH0sXG4gIGFtOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0FtaGFyaWMnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfhiqDhiJvhiK3hipsnXG4gIH0sXG4gIGFuOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0FyYWdvbmVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0FyYWdvbsOpcydcbiAgfSxcbiAgYW5nOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0FuZ2xvLVNheG9uJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnRW5nbGlzYydcbiAgfSxcbiAgYXI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQXJhYmljJyxcbiAgICBkaXJlY3Rpb246ICdydGwnLFxuICAgIGxvY2FsX3RpdGxlOiAn2KfZhNi52LHYqNmK2KknXG4gIH0sXG4gIGFyYzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdBcmFtYWljJyxcbiAgICBkaXJlY3Rpb246ICdydGwnLFxuICAgIGxvY2FsX3RpdGxlOiAn3KPcmNyq3KwnXG4gIH0sXG4gIGFzOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0Fzc2FtZXNlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4KaF4Ka44Kau4KeA4Kav4Ka84Ka+J1xuICB9LFxuICBhc3Q6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQXN0dXJpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdBc3R1cmlhbnUnXG4gIH0sXG4gIGF2OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0F2YXInLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfQkNCy0LDRgCdcbiAgfSxcbiAgYXk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQXltYXJhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQXltYXInXG4gIH0sXG4gIGF6OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0F6ZXJiYWlqYW5pJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQXrJmXJiYXljYW5jYSdcbiAgfSxcbiAgYmE6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQmFzaGtpcicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9CR0LDRiNKh0L7RgNGCJ1xuICB9LFxuICBiYXI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQmF2YXJpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdCb2FyaXNjaCdcbiAgfSxcbiAgJ2JhdC1zbWcnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NhbW9naXRpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfFvWVtYWl0xJfFoWthJ1xuICB9LFxuICBiY2w6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQmlrb2wnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdCaWtvbCdcbiAgfSxcbiAgYmU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQmVsYXJ1c2lhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9CR0LXQu9Cw0YDRg9GB0LrQsNGPJ1xuICB9LFxuICAnYmUteC1vbGQnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0JlbGFydXNpYW4nLFxuICAgIGRpcmVjdGlvbjogJyhUYXJhxaFraWV2aWNhKScsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIGJnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0J1bGdhcmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9CR0YrQu9Cz0LDRgNGB0LrQuCdcbiAgfSxcbiAgYmg6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQmloYXJpJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4KSt4KWL4KSc4KSq4KWB4KSw4KWAJ1xuICB9LFxuICBiaToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdCaXNsYW1hJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQmlzbGFtYSdcbiAgfSxcbiAgYm06IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQmFtYmFyYScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0JhbWFuYW5rYW4nXG4gIH0sXG4gIGJuOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0JlbmdhbGknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfgpqzgpr7gpoLgprLgpr4nXG4gIH0sXG4gIGJvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1RpYmV0YW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfgvZbgvbzgvZHgvIvgvaHgvbLgvYInXG4gIH0sXG4gIGJweToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdCaXNobnVwcml5YScsXG4gICAgZGlyZWN0aW9uOiAnTWFuaXB1cmknLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICBicjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdCcmV0b24nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdCcmV6aG9uZWcnXG4gIH0sXG4gIGJzOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0Jvc25pYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdCb3NhbnNraSdcbiAgfSxcbiAgYnVnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0J1Z2luZXNlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4aiF4aiUJ1xuICB9LFxuICBieHI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQnVyaWF0JyxcbiAgICBkaXJlY3Rpb246ICcoUnVzc2lhKScsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIGNhOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0NhdGFsYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdDYXRhbMOgJ1xuICB9LFxuICBjZG86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTWluJyxcbiAgICBkaXJlY3Rpb246ICdEb25nJyxcbiAgICBsb2NhbF90aXRsZTogJ0NoaW5lc2UnXG4gIH0sXG4gIGNlOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0NoZWNoZW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfQndC+0YXRh9C40LnQvSdcbiAgfSxcbiAgY2ViOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0NlYnVhbm8nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdTaW51Z2JvYW5vbmcnXG4gIH0sXG4gIGNoOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0NoYW1vcnJvJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQ2hhbW9ydSdcbiAgfSxcbiAgY2hvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0Nob2N0YXcnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdDaG9jdGF3J1xuICB9LFxuICBjaHI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQ2hlcm9rZWUnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfhj6PhjrPhjqknXG4gIH0sXG4gIGNoeToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdDaGV5ZW5uZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1RzZXRzw6poZXN0w6JoZXNlJ1xuICB9LFxuICBjbzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdDb3JzaWNhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0NvcnN1J1xuICB9LFxuICBjcjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdDcmVlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTmVoaXlhdydcbiAgfSxcbiAgY3M6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQ3plY2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfEjGVza3knXG4gIH0sXG4gIGNzYjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdLYXNodWJpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdLYXN6w6tic2N6aSdcbiAgfSxcbiAgY3U6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnT2xkJyxcbiAgICBkaXJlY3Rpb246ICdDaHVyY2gnLFxuICAgIGxvY2FsX3RpdGxlOiAnU2xhdm9uaWMnXG4gIH0sXG4gIGN2OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0NodXZhc2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfQp8SD0LLQsNGIJ1xuICB9LFxuICBjeToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdXZWxzaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0N5bXJhZWcnXG4gIH0sXG4gIGRhOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0RhbmlzaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0RhbnNrJ1xuICB9LFxuICBkZToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdHZXJtYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdEZXV0c2NoJ1xuICB9LFxuICBkaXE6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRGltbGknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdaYXpha2knXG4gIH0sXG4gIGRzYjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdMb3dlcicsXG4gICAgZGlyZWN0aW9uOiAnU29yYmlhbicsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIGR2OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0RpdmVoaScsXG4gICAgZGlyZWN0aW9uOiAncnRsJyxcbiAgICBsb2NhbF90aXRsZTogJ96L3qjeiN6s3oDeqN6E3qbekN6wJ1xuICB9LFxuICBkejoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdEem9uZ2toYScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+C9h+C9vOC9hOC8i+C9gSdcbiAgfSxcbiAgZWU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRXdlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnxpDKi8mbJ1xuICB9LFxuICBmYXI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRmFyc2knLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfZgdin2LHYs9uMJ1xuICB9LFxuICBlbDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdHcmVlaycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ86VzrvOu863zr3Ouc66zqwnXG4gIH0sXG4gIGVuOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0VuZ2xpc2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdFbmdsaXNoJ1xuICB9LFxuICBlbzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdFc3BlcmFudG8nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdFc3BlcmFudG8nXG4gIH0sXG4gIGVzOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NwYW5pc2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdFc3Bhw7FvbCdcbiAgfSxcbiAgZXQ6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRXN0b25pYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdFZXN0aSdcbiAgfSxcbiAgZXU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQmFzcXVlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnRXVza2FyYSdcbiAgfSxcbiAgZXh0OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0V4dHJlbWFkdXJhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0VzdHJlbWXDsXUnXG4gIH0sXG4gIGZmOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1BldWwnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdGdWxmdWxkZSdcbiAgfSxcbiAgZmk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRmlubmlzaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1N1b21pJ1xuICB9LFxuICAnZml1LXZybyc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVsO1cm8nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdWw7VybydcbiAgfSxcbiAgZmo6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRmlqaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTmEnXG4gIH0sXG4gIGZvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0Zhcm9lc2UnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdGw7hyb3lza3QnXG4gIH0sXG4gIGZyOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0ZyZW5jaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0ZyYW7Dp2FpcydcbiAgfSxcbiAgZnJwOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0FycGl0YW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdBcnBpdGFuJ1xuICB9LFxuICBmdXI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRnJpdWxpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdGdXJsYW4nXG4gIH0sXG4gIGZ5OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1dlc3QnLFxuICAgIGRpcmVjdGlvbjogJ0ZyaXNpYW4nLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICBnYToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdJcmlzaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0dhZWlsZ2UnXG4gIH0sXG4gIGdhbjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdHYW4nLFxuICAgIGRpcmVjdGlvbjogJ0NoaW5lc2UnLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICBnZDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTY290dGlzaCcsXG4gICAgZGlyZWN0aW9uOiAnR2FlbGljJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgZ2lsOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0dpbGJlcnRlc2UnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdUYWV0YWUnXG4gIH0sXG4gIGdsOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0dhbGljaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnR2FsZWdvJ1xuICB9LFxuICBnbjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdHdWFyYW5pJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiBcIkF2YcOxZSfhur1cIlxuICB9LFxuICBnb3Q6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnR290aGljJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnZ3V0aXNrJ1xuICB9LFxuICBndToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdHdWphcmF0aScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+Cql+CrgeCqnOCqsOCqvuCqpOCrgCdcbiAgfSxcbiAgZ3Y6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTWFueCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0dhZWxnJ1xuICB9LFxuICBoYToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdIYXVzYScsXG4gICAgZGlyZWN0aW9uOiAncnRsJyxcbiAgICBsb2NhbF90aXRsZTogJ9mH2Y7ZiNmP2LPZjidcbiAgfSxcbiAgaGFrOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0hha2thJyxcbiAgICBkaXJlY3Rpb246ICdDaGluZXNlJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgaGF3OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0hhd2FpaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnSGF3YWlgaSdcbiAgfSxcbiAgaGU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnSGVicmV3JyxcbiAgICBkaXJlY3Rpb246ICdydGwnLFxuICAgIGxvY2FsX3RpdGxlOiAn16LXkdeo15nXqidcbiAgfSxcbiAgaGk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnSGluZGknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfgpLngpL/gpKjgpY3gpKbgpYAnXG4gIH0sXG4gIGhvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0hpcmknLFxuICAgIGRpcmVjdGlvbjogJ01vdHUnLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICBocjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdDcm9hdGlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0hydmF0c2tpJ1xuICB9LFxuICBodDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdIYWl0aWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnS3LDqHlvbCdcbiAgfSxcbiAgaHU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnSHVuZ2FyaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTWFneWFyJ1xuICB9LFxuICBoeToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdBcm1lbmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9WA1aHVtdWl1oDVpdW2J1xuICB9LFxuICBoejoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdIZXJlcm8nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdPdHNpaGVyZXJvJ1xuICB9LFxuICBpYToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdJbnRlcmxpbmd1YScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0ludGVybGluZ3VhJ1xuICB9LFxuICBpZDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdJbmRvbmVzaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQmFoYXNhJ1xuICB9LFxuICBpZToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdJbnRlcmxpbmd1ZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0ludGVybGluZ3VlJ1xuICB9LFxuICBpZzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdJZ2JvJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnSWdibydcbiAgfSxcbiAgaWk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnU2ljaHVhbicsXG4gICAgZGlyZWN0aW9uOiAnWWknLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICBpazoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdJbnVwaWFrJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnScOxdXBpYWsnXG4gIH0sXG4gIGlsbzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdJbG9rYW5vJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnSWxva2FubydcbiAgfSxcbiAgaW86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnSWRvJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnSWRvJ1xuICB9LFxuICBpczoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdJY2VsYW5kaWMnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfDjXNsZW5za2EnXG4gIH0sXG4gIGl0OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0l0YWxpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdJdGFsaWFubydcbiAgfSxcbiAgaXU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnSW51a3RpdHV0JyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4ZCD4ZOE4ZKD4ZGO4ZGQ4ZGmJ1xuICB9LFxuICBqYToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdKYXBhbmVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+aXpeacrOiqnidcbiAgfSxcbiAgamJvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0xvamJhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0xvamJhbidcbiAgfSxcbiAganY6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnSmF2YW5lc2UnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdCYXNhJ1xuICB9LFxuICBrYToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdHZW9yZ2lhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+GDpeGDkOGDoOGDl+GDo+GDmuGDmCdcbiAgfSxcbiAga2c6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnS29uZ28nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdLaUtvbmdvJ1xuICB9LFxuICBraToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdLaWt1eXUnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdHxKlrxal5xaknXG4gIH0sXG4gIGtqOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0t1YW55YW1hJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnS3VhbnlhbWEnXG4gIH0sXG4gIGtrOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0themFraCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9Ka0LDQt9Cw0pvRiNCwJ1xuICB9LFxuICBrbDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdHcmVlbmxhbmRpYycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0thbGFhbGxpc3V0J1xuICB9LFxuICBrbToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdDYW1ib2RpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfhnpfhnrbhnp/hnrbhnoHhn5Lhnpjhn4LhnponXG4gIH0sXG4gIGtuOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0thbm5hZGEnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfgspXgsqjgs43gsqjgsqEnXG4gIH0sXG4gIGtodzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdLaG93YXInLFxuICAgIGRpcmVjdGlvbjogJ3J0bCcsXG4gICAgbG9jYWxfdGl0bGU6ICfaqdq+2YjYp9ixJ1xuICB9LFxuICBrbzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdLb3JlYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICftlZzqta3slrQnXG4gIH0sXG4gIGtyOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0thbnVyaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0thbnVyaSdcbiAgfSxcbiAga3M6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnS2FzaG1pcmknLFxuICAgIGRpcmVjdGlvbjogJ3J0bCcsXG4gICAgbG9jYWxfdGl0bGU6ICfgpJXgpLbgpY3gpK7gpYDgpLDgpYAnXG4gIH0sXG4gIGtzaDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdSaXB1YXJpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdSaXBvYXJpc2NoJ1xuICB9LFxuICBrdToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdLdXJkaXNoJyxcbiAgICBkaXJlY3Rpb246ICdydGwnLFxuICAgIGxvY2FsX3RpdGxlOiAnS3VyZMOuJ1xuICB9LFxuICBrdjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdLb21pJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn0JrQvtC80LgnXG4gIH0sXG4gIGt3OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0Nvcm5pc2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdLZXJuZXdlaydcbiAgfSxcbiAga3k6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnS2lyZ2hpeicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0vEsXJnxLF6Y2EnXG4gIH0sXG4gIGxhOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0xhdGluJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTGF0aW5hJ1xuICB9LFxuICBsYWQ6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTGFkaW5vJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnRHpodWRlem1vJ1xuICB9LFxuICBsYW46IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTGFuZ28nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdMZWInXG4gIH0sXG4gIGxiOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0x1eGVtYm91cmdpc2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdMw6t0emVidWVyZ2VzY2gnXG4gIH0sXG4gIGxnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0dhbmRhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTHVnYW5kYSdcbiAgfSxcbiAgbGk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTGltYnVyZ2lhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0xpbWJ1cmdzJ1xuICB9LFxuICBsaWo6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTGlndXJpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdMw61ndXJ1J1xuICB9LFxuICBsbW86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTG9tYmFyZCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0x1bWJhYXJ0J1xuICB9LFxuICBsbjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdMaW5nYWxhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTGluZ8OhbGEnXG4gIH0sXG4gIGxvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0xhb3RpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfguqXgurLguqcnXG4gIH0sXG4gIGx0OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0xpdGh1YW5pYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdMaWV0dXZpxbMnXG4gIH0sXG4gIGx2OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0xhdHZpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdMYXR2aWXFoXUnXG4gIH0sXG4gICdtYXAtYm1zJzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdCYW55dW1hc2FuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQmFzYSdcbiAgfSxcbiAgbWc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTWFsYWdhc3knLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdNYWxhZ2FzeSdcbiAgfSxcbiAgbWFuOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ01hbmRhcmluJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn5a6Y6KmxJ1xuICB9LFxuICBtaDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdNYXJzaGFsbGVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0thamluJ1xuICB9LFxuICBtaToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdNYW9yaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ03EgW9yaSdcbiAgfSxcbiAgbWluOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ01pbmFuZ2thYmF1JyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTWluYW5na2FiYXUnXG4gIH0sXG4gIG1rOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ01hY2Vkb25pYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfQnNCw0LrQtdC00L7QvdGB0LrQuCdcbiAgfSxcbiAgbWw6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTWFsYXlhbGFtJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4LSu4LSy4LSv4LS+4LSz4LSCJ1xuICB9LFxuICBtbjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdNb25nb2xpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfQnNC+0L3Qs9C+0LsnXG4gIH0sXG4gIG1vOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ01vbGRvdmFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTW9sZG92ZW5lYXNjxIMnXG4gIH0sXG4gIG1yOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ01hcmF0aGknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfgpK7gpLDgpL7gpKDgpYAnXG4gIH0sXG4gIG1zOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ01hbGF5JyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQmFoYXNhJ1xuICB9LFxuICBtdDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdNYWx0ZXNlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnYmlsLU1hbHRpJ1xuICB9LFxuICBtdXM6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQ3JlZWsnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdNdXNrb2dlZSdcbiAgfSxcbiAgbXk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQnVybWVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ015YW5tYXNhJ1xuICB9LFxuICBuYToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdOYXVydWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnRG9yZXJpbidcbiAgfSxcbiAgbmFoOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ05haHVhdGwnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdOYWh1YXRsJ1xuICB9LFxuICBuYXA6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTmVhcG9saXRhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ05uYXB1bGl0YW5vJ1xuICB9LFxuICBuZDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdOb3J0aCcsXG4gICAgZGlyZWN0aW9uOiAnTmRlYmVsZScsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIG5kczoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdMb3cgR2VybWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnUGxhdHRkw7zDvHRzY2gnXG4gIH0sXG4gICduZHMtbmwnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0R1dGNoJyxcbiAgICBkaXJlY3Rpb246ICdMb3cnLFxuICAgIGxvY2FsX3RpdGxlOiAnU2F4b24nXG4gIH0sXG4gIG5lOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ05lcGFsaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+CkqOClh+CkquCkvuCksuClgCdcbiAgfSxcbiAgbmV3OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ05ld2FyJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4KSo4KWH4KSq4KS+4KSy4KSt4KS+4KS34KS+J1xuICB9LFxuICBuZzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdOZG9uZ2EnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdPc2hpd2FtYm8nXG4gIH0sXG4gIG5sOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0R1dGNoJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTmVkZXJsYW5kcydcbiAgfSxcbiAgbm46IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTm9yd2VnaWFuJyxcbiAgICBkaXJlY3Rpb246ICdOeW5vcnNrJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgbm86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTm9yd2VnaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTm9yc2snXG4gIH0sXG4gIG5yOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NvdXRoJyxcbiAgICBkaXJlY3Rpb246ICdOZGViZWxlJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgbnNvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ05vcnRoZXJuJyxcbiAgICBkaXJlY3Rpb246ICdTb3RobycsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIG5ybToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdOb3JtYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdOb3Vvcm1hbmQnXG4gIH0sXG4gIG52OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ05hdmFqbycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0RpbsOpJ1xuICB9LFxuICBueToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdDaGljaGV3YScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0NoaS1DaGV3YSdcbiAgfSxcbiAgb2M6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnT2NjaXRhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ09jY2l0YW4nXG4gIH0sXG4gIG9qOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ09qaWJ3YScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+GQiuGTguGUkeGTiOGQr+GSp+GQjuGTkCdcbiAgfSxcbiAgb206IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnT3JvbW8nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdPcm9tb28nXG4gIH0sXG4gIG9yOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ09yaXlhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4KyT4Kyh4Ky84Ky/4KyGJ1xuICB9LFxuICBvczoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdPc3NldGlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9CY0YDQvtC90LDRgydcbiAgfSxcbiAgcGE6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnUGFuamFiaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+CoquCpsOConOCovuCorOCpgCdcbiAgfSxcbiAgcGFnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1Bhbmdhc2luYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdQYW5nYXNpbmFuJ1xuICB9LFxuICBwYW06IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnS2FwYW1wYW5nYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdLYXBhbXBhbmdhbidcbiAgfSxcbiAgcGFwOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1BhcGlhbWVudHUnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdQYXBpYW1lbnR1J1xuICB9LFxuICBwZGM6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnUGVubnN5bHZhbmlhJyxcbiAgICBkaXJlY3Rpb246ICdHZXJtYW4nLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICBwaToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdQYWxpJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnUMSBbGknXG4gIH0sXG4gIHBpaDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdOb3Jmb2xrJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTm9yZnVrJ1xuICB9LFxuICBwbDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdQb2xpc2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdQb2xza2knXG4gIH0sXG4gIHBtczoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdQaWVkbW9udGVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1BpZW1vbnTDqGlzJ1xuICB9LFxuICBwczoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdQYXNodG8nLFxuICAgIGRpcmVjdGlvbjogJ3J0bCcsXG4gICAgbG9jYWxfdGl0bGU6ICfZvtqa2KrZiCdcbiAgfSxcbiAgcHQ6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnUG9ydHVndWVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1BvcnR1Z3XDqnMnXG4gIH0sXG4gIHF1OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1F1ZWNodWEnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdSdW5hJ1xuICB9LFxuICBybToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdSYWV0bycsXG4gICAgZGlyZWN0aW9uOiAnUm9tYW5jZScsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIHJteToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdSb21hbmknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdSb21hbmknXG4gIH0sXG4gIHJuOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0tpcnVuZGknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdLaXJ1bmRpJ1xuICB9LFxuICBybzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdSb21hbmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1JvbcOibsSDJ1xuICB9LFxuICAncm9hLXJ1cCc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQXJvbWFuaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQXJtw6JuZWFzaHRpJ1xuICB9LFxuICBydToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdSdXNzaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn0KDRg9GB0YHQutC40LknXG4gIH0sXG4gIHJ3OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1J3YW5kaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0tpbnlhcndhbmRpJ1xuICB9LFxuICBzYToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTYW5za3JpdCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+CkuOCkguCkuOCljeCkleClg+CkpOCkruCljSdcbiAgfSxcbiAgc2M6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnU2FyZGluaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnU2FyZHUnXG4gIH0sXG4gIHNjbjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTaWNpbGlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1NpY2lsaWFudSdcbiAgfSxcbiAgc2NvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1Njb3RzJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnU2NvdHMnXG4gIH0sXG4gIHNkOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NpbmRoaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+CkuOCkv+CkqOCkp+CkvydcbiAgfSxcbiAgc2U6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTm9ydGhlcm4nLFxuICAgIGRpcmVjdGlvbjogJ1NhbWknLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICBzZzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTYW5nbycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1PDpG5nw7YnXG4gIH0sXG4gIHNoOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NlcmJvLUNyb2F0aWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnU3Jwc2tvaHJ2YXRza2knXG4gIH0sXG4gIHNpOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NpbmhhbGVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+C3g+C3kuC2guC3hOC2vSdcbiAgfSxcbiAgc2ltcGxlOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NpbXBsZScsXG4gICAgZGlyZWN0aW9uOiAnRW5nbGlzaCcsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIHNrOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1Nsb3ZhaycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1Nsb3ZlbsSNaW5hJ1xuICB9LFxuICBzbDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTbG92ZW5pYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdTbG92ZW7FocSNaW5hJ1xuICB9LFxuICBzbToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTYW1vYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdHYWdhbmEnXG4gIH0sXG4gIHNuOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1Nob25hJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnY2hpU2hvbmEnXG4gIH0sXG4gIHNvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NvbWFsaWEnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdTb29tYWFsaWdhJ1xuICB9LFxuICBzcToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdBbGJhbmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1NocWlwJ1xuICB9LFxuICBzcjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTZXJiaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn0KHRgNC/0YHQutC4J1xuICB9LFxuICBzczoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTd2F0aScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1NpU3dhdGknXG4gIH0sXG4gIHN0OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NvdXRoZXJuJyxcbiAgICBkaXJlY3Rpb246ICdTb3RobycsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIHN1OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1N1bmRhbmVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0Jhc2EnXG4gIH0sXG4gIHN2OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1N3ZWRpc2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdTdmVuc2thJ1xuICB9LFxuICBzdzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTd2FoaWxpJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnS2lzd2FoaWxpJ1xuICB9LFxuICB0YToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdUYW1pbCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+CupOCuruCuv+CutOCvjSdcbiAgfSxcbiAgdGU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVGVsdWd1JyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4LCk4LGG4LCy4LGB4LCX4LGBJ1xuICB9LFxuICB0ZXQ6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVGV0dW0nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdUZXR1bidcbiAgfSxcbiAgdGc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVGFqaWsnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfQotC+0rfQuNC606MnXG4gIH0sXG4gIHRoOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1RoYWknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfguYTguJfguKInXG4gIH0sXG4gIHRpOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1RpZ3JpbnlhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4Ym14YyN4Yit4YqbJ1xuICB9LFxuICB0azoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdUdXJrbWVuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn0KLRg9GA0LrQvNC10L0nXG4gIH0sXG4gIHRsOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1RhZ2Fsb2cnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdUYWdhbG9nJ1xuICB9LFxuICB0bGg6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnS2xpbmdvbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ3RsaEluZ2FuLUhvbCdcbiAgfSxcbiAgdG46IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVHN3YW5hJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnU2V0c3dhbmEnXG4gIH0sXG4gIHRvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1RvbmdhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTGVhJ1xuICB9LFxuICB0cGk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVG9rJyxcbiAgICBkaXJlY3Rpb246ICdQaXNpbicsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIHRyOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1R1cmtpc2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdUw7xya8OnZSdcbiAgfSxcbiAgdHM6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVHNvbmdhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnWGl0c29uZ2EnXG4gIH0sXG4gIHR0OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1RhdGFyJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnVGF0YXLDp2EnXG4gIH0sXG4gIHR1bToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdUdW1idWthJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnY2hpVHVtYnVrYSdcbiAgfSxcbiAgdHc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVHdpJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnVHdpJ1xuICB9LFxuICB0eToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdUYWhpdGlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1JlbydcbiAgfSxcbiAgdWRtOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1VkbXVydCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9Cj0LTQvNGD0YDRgidcbiAgfSxcbiAgdWc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVXlnaHVyJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnVXnGo3VyccmZJ1xuICB9LFxuICB1azoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdVa3JhaW5pYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfQo9C60YDQsNGX0L3RgdGM0LrQsCdcbiAgfSxcbiAgdXI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVXJkdScsXG4gICAgZGlyZWN0aW9uOiAncnRsJyxcbiAgICBsb2NhbF90aXRsZTogJ9in2LHYr9mIJ1xuICB9LFxuICB1ejoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdVemJlaycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9CO0LfQsdC10LonXG4gIH0sXG4gIHZlOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1ZlbmRhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnVHNoaXZlbuG4k2EnXG4gIH0sXG4gIHZpOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1ZpZXRuYW1lc2UnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdWaeG7h3RuYW0nXG4gIH0sXG4gIHZlYzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdWZW5ldGlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1bDqG5ldG8nXG4gIH0sXG4gIHZsczoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdXZXN0JyxcbiAgICBkaXJlY3Rpb246ICdGbGVtaXNoJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgdm86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVm9sYXDDvGsnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdWb2xhcMO8aydcbiAgfSxcbiAgd2E6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnV2FsbG9vbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1dhbG9uJ1xuICB9LFxuICB3YXI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnV2FyYXktV2FyYXknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdXaW5hcmF5J1xuICB9LFxuICB3bzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdXb2xvZicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1dvbGxvZidcbiAgfSxcbiAgeGFsOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0thbG15aycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9Cl0LDQu9GM0LzQsydcbiAgfSxcbiAgeGg6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnWGhvc2EnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdpc2lYaG9zYSdcbiAgfSxcbiAgeWk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnWWlkZGlzaCcsXG4gICAgZGlyZWN0aW9uOiAncnRsJyxcbiAgICBsb2NhbF90aXRsZTogJ9eZ15nWtNeT15nXqSdcbiAgfSxcbiAgeW86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnWW9ydWJhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnWW9yw7liw6EnXG4gIH0sXG4gIHphOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1podWFuZycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0N1ZW5naCdcbiAgfSxcbiAgemg6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQ2hpbmVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+S4reaWhydcbiAgfSxcbiAgJ3poLWNsYXNzaWNhbCc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQ2xhc3NpY2FsJyxcbiAgICBkaXJlY3Rpb246ICdDaGluZXNlJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgJ3poLW1pbi1uYW4nOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ01pbm5hbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0LDom4tbMOibS1nw7onXG4gIH0sXG4gICd6aC15dWUnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0NhbnRvbmVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+eyteiqnidcbiAgfSxcbiAgenU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnWnVsdScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ2lzaVp1bHUnXG4gIH1cbn07XG4iLCIvL2Zyb20gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3cvYXBpLnBocD9hY3Rpb249c2l0ZW1hdHJpeCZmb3JtYXQ9anNvblxuY29uc3Qgc2l0ZV9tYXAgPSB7XG4gIGFhd2lraTogJ2h0dHBzOi8vYWEud2lraXBlZGlhLm9yZycsXG4gIGFhd2lrdGlvbmFyeTogJ2h0dHBzOi8vYWEud2lrdGlvbmFyeS5vcmcnLFxuICBhYXdpa2lib29rczogJ2h0dHBzOi8vYWEud2lraWJvb2tzLm9yZycsXG4gIGFid2lraTogJ2h0dHBzOi8vYWIud2lraXBlZGlhLm9yZycsXG4gIGFid2lrdGlvbmFyeTogJ2h0dHBzOi8vYWIud2lrdGlvbmFyeS5vcmcnLFxuICBhY2V3aWtpOiAnaHR0cHM6Ly9hY2Uud2lraXBlZGlhLm9yZycsXG4gIGFmd2lraTogJ2h0dHBzOi8vYWYud2lraXBlZGlhLm9yZycsXG4gIGFmd2lrdGlvbmFyeTogJ2h0dHBzOi8vYWYud2lrdGlvbmFyeS5vcmcnLFxuICBhZndpa2lib29rczogJ2h0dHBzOi8vYWYud2lraWJvb2tzLm9yZycsXG4gIGFmd2lraXF1b3RlOiAnaHR0cHM6Ly9hZi53aWtpcXVvdGUub3JnJyxcbiAgYWt3aWtpOiAnaHR0cHM6Ly9hay53aWtpcGVkaWEub3JnJyxcbiAgYWt3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9hay53aWt0aW9uYXJ5Lm9yZycsXG4gIGFrd2lraWJvb2tzOiAnaHR0cHM6Ly9hay53aWtpYm9va3Mub3JnJyxcbiAgYWxzd2lraTogJ2h0dHBzOi8vYWxzLndpa2lwZWRpYS5vcmcnLFxuICBhbHN3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9hbHMud2lrdGlvbmFyeS5vcmcnLFxuICBhbHN3aWtpYm9va3M6ICdodHRwczovL2Fscy53aWtpYm9va3Mub3JnJyxcbiAgYWxzd2lraXF1b3RlOiAnaHR0cHM6Ly9hbHMud2lraXF1b3RlLm9yZycsXG4gIGFtd2lraTogJ2h0dHBzOi8vYW0ud2lraXBlZGlhLm9yZycsXG4gIGFtd2lrdGlvbmFyeTogJ2h0dHBzOi8vYW0ud2lrdGlvbmFyeS5vcmcnLFxuICBhbXdpa2lxdW90ZTogJ2h0dHBzOi8vYW0ud2lraXF1b3RlLm9yZycsXG4gIGFud2lraTogJ2h0dHBzOi8vYW4ud2lraXBlZGlhLm9yZycsXG4gIGFud2lrdGlvbmFyeTogJ2h0dHBzOi8vYW4ud2lrdGlvbmFyeS5vcmcnLFxuICBhbmd3aWtpOiAnaHR0cHM6Ly9hbmcud2lraXBlZGlhLm9yZycsXG4gIGFuZ3dpa3Rpb25hcnk6ICdodHRwczovL2FuZy53aWt0aW9uYXJ5Lm9yZycsXG4gIGFuZ3dpa2lib29rczogJ2h0dHBzOi8vYW5nLndpa2lib29rcy5vcmcnLFxuICBhbmd3aWtpcXVvdGU6ICdodHRwczovL2FuZy53aWtpcXVvdGUub3JnJyxcbiAgYW5nd2lraXNvdXJjZTogJ2h0dHBzOi8vYW5nLndpa2lzb3VyY2Uub3JnJyxcbiAgYXJ3aWtpOiAnaHR0cHM6Ly9hci53aWtpcGVkaWEub3JnJyxcbiAgYXJ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9hci53aWt0aW9uYXJ5Lm9yZycsXG4gIGFyd2lraWJvb2tzOiAnaHR0cHM6Ly9hci53aWtpYm9va3Mub3JnJyxcbiAgYXJ3aWtpbmV3czogJ2h0dHBzOi8vYXIud2lraW5ld3Mub3JnJyxcbiAgYXJ3aWtpcXVvdGU6ICdodHRwczovL2FyLndpa2lxdW90ZS5vcmcnLFxuICBhcndpa2lzb3VyY2U6ICdodHRwczovL2FyLndpa2lzb3VyY2Uub3JnJyxcbiAgYXJ3aWtpdmVyc2l0eTogJ2h0dHBzOi8vYXIud2lraXZlcnNpdHkub3JnJyxcbiAgYXJjd2lraTogJ2h0dHBzOi8vYXJjLndpa2lwZWRpYS5vcmcnLFxuICBhcnp3aWtpOiAnaHR0cHM6Ly9hcnoud2lraXBlZGlhLm9yZycsXG4gIGFzd2lraTogJ2h0dHBzOi8vYXMud2lraXBlZGlhLm9yZycsXG4gIGFzd2lrdGlvbmFyeTogJ2h0dHBzOi8vYXMud2lrdGlvbmFyeS5vcmcnLFxuICBhc3dpa2lib29rczogJ2h0dHBzOi8vYXMud2lraWJvb2tzLm9yZycsXG4gIGFzd2lraXNvdXJjZTogJ2h0dHBzOi8vYXMud2lraXNvdXJjZS5vcmcnLFxuICBhc3R3aWtpOiAnaHR0cHM6Ly9hc3Qud2lraXBlZGlhLm9yZycsXG4gIGFzdHdpa3Rpb25hcnk6ICdodHRwczovL2FzdC53aWt0aW9uYXJ5Lm9yZycsXG4gIGFzdHdpa2lib29rczogJ2h0dHBzOi8vYXN0Lndpa2lib29rcy5vcmcnLFxuICBhc3R3aWtpcXVvdGU6ICdodHRwczovL2FzdC53aWtpcXVvdGUub3JnJyxcbiAgYXZ3aWtpOiAnaHR0cHM6Ly9hdi53aWtpcGVkaWEub3JnJyxcbiAgYXZ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9hdi53aWt0aW9uYXJ5Lm9yZycsXG4gIGF5d2lraTogJ2h0dHBzOi8vYXkud2lraXBlZGlhLm9yZycsXG4gIGF5d2lrdGlvbmFyeTogJ2h0dHBzOi8vYXkud2lrdGlvbmFyeS5vcmcnLFxuICBheXdpa2lib29rczogJ2h0dHBzOi8vYXkud2lraWJvb2tzLm9yZycsXG4gIGF6d2lraTogJ2h0dHBzOi8vYXoud2lraXBlZGlhLm9yZycsXG4gIGF6d2lrdGlvbmFyeTogJ2h0dHBzOi8vYXoud2lrdGlvbmFyeS5vcmcnLFxuICBhendpa2lib29rczogJ2h0dHBzOi8vYXoud2lraWJvb2tzLm9yZycsXG4gIGF6d2lraXF1b3RlOiAnaHR0cHM6Ly9hei53aWtpcXVvdGUub3JnJyxcbiAgYXp3aWtpc291cmNlOiAnaHR0cHM6Ly9hei53aWtpc291cmNlLm9yZycsXG4gIGJhd2lraTogJ2h0dHBzOi8vYmEud2lraXBlZGlhLm9yZycsXG4gIGJhd2lraWJvb2tzOiAnaHR0cHM6Ly9iYS53aWtpYm9va3Mub3JnJyxcbiAgYmFyd2lraTogJ2h0dHBzOi8vYmFyLndpa2lwZWRpYS5vcmcnLFxuICBiYXRfc21nd2lraTogJ2h0dHBzOi8vYmF0LXNtZy53aWtpcGVkaWEub3JnJyxcbiAgYmNsd2lraTogJ2h0dHBzOi8vYmNsLndpa2lwZWRpYS5vcmcnLFxuICBiZXdpa2k6ICdodHRwczovL2JlLndpa2lwZWRpYS5vcmcnLFxuICBiZXdpa3Rpb25hcnk6ICdodHRwczovL2JlLndpa3Rpb25hcnkub3JnJyxcbiAgYmV3aWtpYm9va3M6ICdodHRwczovL2JlLndpa2lib29rcy5vcmcnLFxuICBiZXdpa2lxdW90ZTogJ2h0dHBzOi8vYmUud2lraXF1b3RlLm9yZycsXG4gIGJld2lraXNvdXJjZTogJ2h0dHBzOi8vYmUud2lraXNvdXJjZS5vcmcnLFxuICBiZV94X29sZHdpa2k6ICdodHRwczovL2JlLXgtb2xkLndpa2lwZWRpYS5vcmcnLFxuICBiZ3dpa2k6ICdodHRwczovL2JnLndpa2lwZWRpYS5vcmcnLFxuICBiZ3dpa3Rpb25hcnk6ICdodHRwczovL2JnLndpa3Rpb25hcnkub3JnJyxcbiAgYmd3aWtpYm9va3M6ICdodHRwczovL2JnLndpa2lib29rcy5vcmcnLFxuICBiZ3dpa2luZXdzOiAnaHR0cHM6Ly9iZy53aWtpbmV3cy5vcmcnLFxuICBiZ3dpa2lxdW90ZTogJ2h0dHBzOi8vYmcud2lraXF1b3RlLm9yZycsXG4gIGJnd2lraXNvdXJjZTogJ2h0dHBzOi8vYmcud2lraXNvdXJjZS5vcmcnLFxuICBiaHdpa2k6ICdodHRwczovL2JoLndpa2lwZWRpYS5vcmcnLFxuICBiaHdpa3Rpb25hcnk6ICdodHRwczovL2JoLndpa3Rpb25hcnkub3JnJyxcbiAgYml3aWtpOiAnaHR0cHM6Ly9iaS53aWtpcGVkaWEub3JnJyxcbiAgYml3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9iaS53aWt0aW9uYXJ5Lm9yZycsXG4gIGJpd2lraWJvb2tzOiAnaHR0cHM6Ly9iaS53aWtpYm9va3Mub3JnJyxcbiAgYmpud2lraTogJ2h0dHBzOi8vYmpuLndpa2lwZWRpYS5vcmcnLFxuICBibXdpa2k6ICdodHRwczovL2JtLndpa2lwZWRpYS5vcmcnLFxuICBibXdpa3Rpb25hcnk6ICdodHRwczovL2JtLndpa3Rpb25hcnkub3JnJyxcbiAgYm13aWtpYm9va3M6ICdodHRwczovL2JtLndpa2lib29rcy5vcmcnLFxuICBibXdpa2lxdW90ZTogJ2h0dHBzOi8vYm0ud2lraXF1b3RlLm9yZycsXG4gIGJud2lraTogJ2h0dHBzOi8vYm4ud2lraXBlZGlhLm9yZycsXG4gIGJud2lrdGlvbmFyeTogJ2h0dHBzOi8vYm4ud2lrdGlvbmFyeS5vcmcnLFxuICBibndpa2lib29rczogJ2h0dHBzOi8vYm4ud2lraWJvb2tzLm9yZycsXG4gIGJud2lraXNvdXJjZTogJ2h0dHBzOi8vYm4ud2lraXNvdXJjZS5vcmcnLFxuICBib3dpa2k6ICdodHRwczovL2JvLndpa2lwZWRpYS5vcmcnLFxuICBib3dpa3Rpb25hcnk6ICdodHRwczovL2JvLndpa3Rpb25hcnkub3JnJyxcbiAgYm93aWtpYm9va3M6ICdodHRwczovL2JvLndpa2lib29rcy5vcmcnLFxuICBicHl3aWtpOiAnaHR0cHM6Ly9icHkud2lraXBlZGlhLm9yZycsXG4gIGJyd2lraTogJ2h0dHBzOi8vYnIud2lraXBlZGlhLm9yZycsXG4gIGJyd2lrdGlvbmFyeTogJ2h0dHBzOi8vYnIud2lrdGlvbmFyeS5vcmcnLFxuICBicndpa2lxdW90ZTogJ2h0dHBzOi8vYnIud2lraXF1b3RlLm9yZycsXG4gIGJyd2lraXNvdXJjZTogJ2h0dHBzOi8vYnIud2lraXNvdXJjZS5vcmcnLFxuICBic3dpa2k6ICdodHRwczovL2JzLndpa2lwZWRpYS5vcmcnLFxuICBic3dpa3Rpb25hcnk6ICdodHRwczovL2JzLndpa3Rpb25hcnkub3JnJyxcbiAgYnN3aWtpYm9va3M6ICdodHRwczovL2JzLndpa2lib29rcy5vcmcnLFxuICBic3dpa2luZXdzOiAnaHR0cHM6Ly9icy53aWtpbmV3cy5vcmcnLFxuICBic3dpa2lxdW90ZTogJ2h0dHBzOi8vYnMud2lraXF1b3RlLm9yZycsXG4gIGJzd2lraXNvdXJjZTogJ2h0dHBzOi8vYnMud2lraXNvdXJjZS5vcmcnLFxuICBidWd3aWtpOiAnaHR0cHM6Ly9idWcud2lraXBlZGlhLm9yZycsXG4gIGJ4cndpa2k6ICdodHRwczovL2J4ci53aWtpcGVkaWEub3JnJyxcbiAgY2F3aWtpOiAnaHR0cHM6Ly9jYS53aWtpcGVkaWEub3JnJyxcbiAgY2F3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9jYS53aWt0aW9uYXJ5Lm9yZycsXG4gIGNhd2lraWJvb2tzOiAnaHR0cHM6Ly9jYS53aWtpYm9va3Mub3JnJyxcbiAgY2F3aWtpbmV3czogJ2h0dHBzOi8vY2Eud2lraW5ld3Mub3JnJyxcbiAgY2F3aWtpcXVvdGU6ICdodHRwczovL2NhLndpa2lxdW90ZS5vcmcnLFxuICBjYXdpa2lzb3VyY2U6ICdodHRwczovL2NhLndpa2lzb3VyY2Uub3JnJyxcbiAgY2JrX3phbXdpa2k6ICdodHRwczovL2Niay16YW0ud2lraXBlZGlhLm9yZycsXG4gIGNkb3dpa2k6ICdodHRwczovL2Nkby53aWtpcGVkaWEub3JnJyxcbiAgY2V3aWtpOiAnaHR0cHM6Ly9jZS53aWtpcGVkaWEub3JnJyxcbiAgY2Vid2lraTogJ2h0dHBzOi8vY2ViLndpa2lwZWRpYS5vcmcnLFxuICBjaHdpa2k6ICdodHRwczovL2NoLndpa2lwZWRpYS5vcmcnLFxuICBjaHdpa3Rpb25hcnk6ICdodHRwczovL2NoLndpa3Rpb25hcnkub3JnJyxcbiAgY2h3aWtpYm9va3M6ICdodHRwczovL2NoLndpa2lib29rcy5vcmcnLFxuICBjaG93aWtpOiAnaHR0cHM6Ly9jaG8ud2lraXBlZGlhLm9yZycsXG4gIGNocndpa2k6ICdodHRwczovL2Noci53aWtpcGVkaWEub3JnJyxcbiAgY2hyd2lrdGlvbmFyeTogJ2h0dHBzOi8vY2hyLndpa3Rpb25hcnkub3JnJyxcbiAgY2h5d2lraTogJ2h0dHBzOi8vY2h5Lndpa2lwZWRpYS5vcmcnLFxuICBja2J3aWtpOiAnaHR0cHM6Ly9ja2Iud2lraXBlZGlhLm9yZycsXG4gIGNvd2lraTogJ2h0dHBzOi8vY28ud2lraXBlZGlhLm9yZycsXG4gIGNvd2lrdGlvbmFyeTogJ2h0dHBzOi8vY28ud2lrdGlvbmFyeS5vcmcnLFxuICBjb3dpa2lib29rczogJ2h0dHBzOi8vY28ud2lraWJvb2tzLm9yZycsXG4gIGNvd2lraXF1b3RlOiAnaHR0cHM6Ly9jby53aWtpcXVvdGUub3JnJyxcbiAgY3J3aWtpOiAnaHR0cHM6Ly9jci53aWtpcGVkaWEub3JnJyxcbiAgY3J3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9jci53aWt0aW9uYXJ5Lm9yZycsXG4gIGNyd2lraXF1b3RlOiAnaHR0cHM6Ly9jci53aWtpcXVvdGUub3JnJyxcbiAgY3Jod2lraTogJ2h0dHBzOi8vY3JoLndpa2lwZWRpYS5vcmcnLFxuICBjc3dpa2k6ICdodHRwczovL2NzLndpa2lwZWRpYS5vcmcnLFxuICBjc3dpa3Rpb25hcnk6ICdodHRwczovL2NzLndpa3Rpb25hcnkub3JnJyxcbiAgY3N3aWtpYm9va3M6ICdodHRwczovL2NzLndpa2lib29rcy5vcmcnLFxuICBjc3dpa2luZXdzOiAnaHR0cHM6Ly9jcy53aWtpbmV3cy5vcmcnLFxuICBjc3dpa2lxdW90ZTogJ2h0dHBzOi8vY3Mud2lraXF1b3RlLm9yZycsXG4gIGNzd2lraXNvdXJjZTogJ2h0dHBzOi8vY3Mud2lraXNvdXJjZS5vcmcnLFxuICBjc3dpa2l2ZXJzaXR5OiAnaHR0cHM6Ly9jcy53aWtpdmVyc2l0eS5vcmcnLFxuICBjc2J3aWtpOiAnaHR0cHM6Ly9jc2Iud2lraXBlZGlhLm9yZycsXG4gIGNzYndpa3Rpb25hcnk6ICdodHRwczovL2NzYi53aWt0aW9uYXJ5Lm9yZycsXG4gIGN1d2lraTogJ2h0dHBzOi8vY3Uud2lraXBlZGlhLm9yZycsXG4gIGN2d2lraTogJ2h0dHBzOi8vY3Yud2lraXBlZGlhLm9yZycsXG4gIGN2d2lraWJvb2tzOiAnaHR0cHM6Ly9jdi53aWtpYm9va3Mub3JnJyxcbiAgY3l3aWtpOiAnaHR0cHM6Ly9jeS53aWtpcGVkaWEub3JnJyxcbiAgY3l3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9jeS53aWt0aW9uYXJ5Lm9yZycsXG4gIGN5d2lraWJvb2tzOiAnaHR0cHM6Ly9jeS53aWtpYm9va3Mub3JnJyxcbiAgY3l3aWtpcXVvdGU6ICdodHRwczovL2N5Lndpa2lxdW90ZS5vcmcnLFxuICBjeXdpa2lzb3VyY2U6ICdodHRwczovL2N5Lndpa2lzb3VyY2Uub3JnJyxcbiAgZGF3aWtpOiAnaHR0cHM6Ly9kYS53aWtpcGVkaWEub3JnJyxcbiAgZGF3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9kYS53aWt0aW9uYXJ5Lm9yZycsXG4gIGRhd2lraWJvb2tzOiAnaHR0cHM6Ly9kYS53aWtpYm9va3Mub3JnJyxcbiAgZGF3aWtpcXVvdGU6ICdodHRwczovL2RhLndpa2lxdW90ZS5vcmcnLFxuICBkYXdpa2lzb3VyY2U6ICdodHRwczovL2RhLndpa2lzb3VyY2Uub3JnJyxcbiAgZGV3aWtpOiAnaHR0cHM6Ly9kZS53aWtpcGVkaWEub3JnJyxcbiAgZGV3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9kZS53aWt0aW9uYXJ5Lm9yZycsXG4gIGRld2lraWJvb2tzOiAnaHR0cHM6Ly9kZS53aWtpYm9va3Mub3JnJyxcbiAgZGV3aWtpbmV3czogJ2h0dHBzOi8vZGUud2lraW5ld3Mub3JnJyxcbiAgZGV3aWtpcXVvdGU6ICdodHRwczovL2RlLndpa2lxdW90ZS5vcmcnLFxuICBkZXdpa2lzb3VyY2U6ICdodHRwczovL2RlLndpa2lzb3VyY2Uub3JnJyxcbiAgZGV3aWtpdmVyc2l0eTogJ2h0dHBzOi8vZGUud2lraXZlcnNpdHkub3JnJyxcbiAgZGV3aWtpdm95YWdlOiAnaHR0cHM6Ly9kZS53aWtpdm95YWdlLm9yZycsXG4gIGRpcXdpa2k6ICdodHRwczovL2RpcS53aWtpcGVkaWEub3JnJyxcbiAgZHNid2lraTogJ2h0dHBzOi8vZHNiLndpa2lwZWRpYS5vcmcnLFxuICBkdndpa2k6ICdodHRwczovL2R2Lndpa2lwZWRpYS5vcmcnLFxuICBkdndpa3Rpb25hcnk6ICdodHRwczovL2R2Lndpa3Rpb25hcnkub3JnJyxcbiAgZHp3aWtpOiAnaHR0cHM6Ly9kei53aWtpcGVkaWEub3JnJyxcbiAgZHp3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9kei53aWt0aW9uYXJ5Lm9yZycsXG4gIGVld2lraTogJ2h0dHBzOi8vZWUud2lraXBlZGlhLm9yZycsXG4gIGVsd2lraTogJ2h0dHBzOi8vZWwud2lraXBlZGlhLm9yZycsXG4gIGVsd2lrdGlvbmFyeTogJ2h0dHBzOi8vZWwud2lrdGlvbmFyeS5vcmcnLFxuICBlbHdpa2lib29rczogJ2h0dHBzOi8vZWwud2lraWJvb2tzLm9yZycsXG4gIGVsd2lraW5ld3M6ICdodHRwczovL2VsLndpa2luZXdzLm9yZycsXG4gIGVsd2lraXF1b3RlOiAnaHR0cHM6Ly9lbC53aWtpcXVvdGUub3JnJyxcbiAgZWx3aWtpc291cmNlOiAnaHR0cHM6Ly9lbC53aWtpc291cmNlLm9yZycsXG4gIGVsd2lraXZlcnNpdHk6ICdodHRwczovL2VsLndpa2l2ZXJzaXR5Lm9yZycsXG4gIGVsd2lraXZveWFnZTogJ2h0dHBzOi8vZWwud2lraXZveWFnZS5vcmcnLFxuICBlbWx3aWtpOiAnaHR0cHM6Ly9lbWwud2lraXBlZGlhLm9yZycsXG4gIGVud2lraTogJ2h0dHBzOi8vZW4ud2lraXBlZGlhLm9yZycsXG4gIGVud2lrdGlvbmFyeTogJ2h0dHBzOi8vZW4ud2lrdGlvbmFyeS5vcmcnLFxuICBlbndpa2lib29rczogJ2h0dHBzOi8vZW4ud2lraWJvb2tzLm9yZycsXG4gIGVud2lraW5ld3M6ICdodHRwczovL2VuLndpa2luZXdzLm9yZycsXG4gIGVud2lraXF1b3RlOiAnaHR0cHM6Ly9lbi53aWtpcXVvdGUub3JnJyxcbiAgZW53aWtpc291cmNlOiAnaHR0cHM6Ly9lbi53aWtpc291cmNlLm9yZycsXG4gIGVud2lraXZlcnNpdHk6ICdodHRwczovL2VuLndpa2l2ZXJzaXR5Lm9yZycsXG4gIGVud2lraXZveWFnZTogJ2h0dHBzOi8vZW4ud2lraXZveWFnZS5vcmcnLFxuICBlb3dpa2k6ICdodHRwczovL2VvLndpa2lwZWRpYS5vcmcnLFxuICBlb3dpa3Rpb25hcnk6ICdodHRwczovL2VvLndpa3Rpb25hcnkub3JnJyxcbiAgZW93aWtpYm9va3M6ICdodHRwczovL2VvLndpa2lib29rcy5vcmcnLFxuICBlb3dpa2luZXdzOiAnaHR0cHM6Ly9lby53aWtpbmV3cy5vcmcnLFxuICBlb3dpa2lxdW90ZTogJ2h0dHBzOi8vZW8ud2lraXF1b3RlLm9yZycsXG4gIGVvd2lraXNvdXJjZTogJ2h0dHBzOi8vZW8ud2lraXNvdXJjZS5vcmcnLFxuICBlc3dpa2k6ICdodHRwczovL2VzLndpa2lwZWRpYS5vcmcnLFxuICBlc3dpa3Rpb25hcnk6ICdodHRwczovL2VzLndpa3Rpb25hcnkub3JnJyxcbiAgZXN3aWtpYm9va3M6ICdodHRwczovL2VzLndpa2lib29rcy5vcmcnLFxuICBlc3dpa2luZXdzOiAnaHR0cHM6Ly9lcy53aWtpbmV3cy5vcmcnLFxuICBlc3dpa2lxdW90ZTogJ2h0dHBzOi8vZXMud2lraXF1b3RlLm9yZycsXG4gIGVzd2lraXNvdXJjZTogJ2h0dHBzOi8vZXMud2lraXNvdXJjZS5vcmcnLFxuICBlc3dpa2l2ZXJzaXR5OiAnaHR0cHM6Ly9lcy53aWtpdmVyc2l0eS5vcmcnLFxuICBlc3dpa2l2b3lhZ2U6ICdodHRwczovL2VzLndpa2l2b3lhZ2Uub3JnJyxcbiAgZXR3aWtpOiAnaHR0cHM6Ly9ldC53aWtpcGVkaWEub3JnJyxcbiAgZXR3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9ldC53aWt0aW9uYXJ5Lm9yZycsXG4gIGV0d2lraWJvb2tzOiAnaHR0cHM6Ly9ldC53aWtpYm9va3Mub3JnJyxcbiAgZXR3aWtpcXVvdGU6ICdodHRwczovL2V0Lndpa2lxdW90ZS5vcmcnLFxuICBldHdpa2lzb3VyY2U6ICdodHRwczovL2V0Lndpa2lzb3VyY2Uub3JnJyxcbiAgZXV3aWtpOiAnaHR0cHM6Ly9ldS53aWtpcGVkaWEub3JnJyxcbiAgZXV3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9ldS53aWt0aW9uYXJ5Lm9yZycsXG4gIGV1d2lraWJvb2tzOiAnaHR0cHM6Ly9ldS53aWtpYm9va3Mub3JnJyxcbiAgZXV3aWtpcXVvdGU6ICdodHRwczovL2V1Lndpa2lxdW90ZS5vcmcnLFxuICBleHR3aWtpOiAnaHR0cHM6Ly9leHQud2lraXBlZGlhLm9yZycsXG4gIGZhd2lraTogJ2h0dHBzOi8vZmEud2lraXBlZGlhLm9yZycsXG4gIGZhd2lrdGlvbmFyeTogJ2h0dHBzOi8vZmEud2lrdGlvbmFyeS5vcmcnLFxuICBmYXdpa2lib29rczogJ2h0dHBzOi8vZmEud2lraWJvb2tzLm9yZycsXG4gIGZhd2lraW5ld3M6ICdodHRwczovL2ZhLndpa2luZXdzLm9yZycsXG4gIGZhd2lraXF1b3RlOiAnaHR0cHM6Ly9mYS53aWtpcXVvdGUub3JnJyxcbiAgZmF3aWtpc291cmNlOiAnaHR0cHM6Ly9mYS53aWtpc291cmNlLm9yZycsXG4gIGZhd2lraXZveWFnZTogJ2h0dHBzOi8vZmEud2lraXZveWFnZS5vcmcnLFxuICBmZndpa2k6ICdodHRwczovL2ZmLndpa2lwZWRpYS5vcmcnLFxuICBmaXdpa2k6ICdodHRwczovL2ZpLndpa2lwZWRpYS5vcmcnLFxuICBmaXdpa3Rpb25hcnk6ICdodHRwczovL2ZpLndpa3Rpb25hcnkub3JnJyxcbiAgZml3aWtpYm9va3M6ICdodHRwczovL2ZpLndpa2lib29rcy5vcmcnLFxuICBmaXdpa2luZXdzOiAnaHR0cHM6Ly9maS53aWtpbmV3cy5vcmcnLFxuICBmaXdpa2lxdW90ZTogJ2h0dHBzOi8vZmkud2lraXF1b3RlLm9yZycsXG4gIGZpd2lraXNvdXJjZTogJ2h0dHBzOi8vZmkud2lraXNvdXJjZS5vcmcnLFxuICBmaXdpa2l2ZXJzaXR5OiAnaHR0cHM6Ly9maS53aWtpdmVyc2l0eS5vcmcnLFxuICBmaXVfdnJvd2lraTogJ2h0dHBzOi8vZml1LXZyby53aWtpcGVkaWEub3JnJyxcbiAgZmp3aWtpOiAnaHR0cHM6Ly9mai53aWtpcGVkaWEub3JnJyxcbiAgZmp3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9mai53aWt0aW9uYXJ5Lm9yZycsXG4gIGZvd2lraTogJ2h0dHBzOi8vZm8ud2lraXBlZGlhLm9yZycsXG4gIGZvd2lrdGlvbmFyeTogJ2h0dHBzOi8vZm8ud2lrdGlvbmFyeS5vcmcnLFxuICBmb3dpa2lzb3VyY2U6ICdodHRwczovL2ZvLndpa2lzb3VyY2Uub3JnJyxcbiAgZnJ3aWtpOiAnaHR0cHM6Ly9mci53aWtpcGVkaWEub3JnJyxcbiAgZnJ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9mci53aWt0aW9uYXJ5Lm9yZycsXG4gIGZyd2lraWJvb2tzOiAnaHR0cHM6Ly9mci53aWtpYm9va3Mub3JnJyxcbiAgZnJ3aWtpbmV3czogJ2h0dHBzOi8vZnIud2lraW5ld3Mub3JnJyxcbiAgZnJ3aWtpcXVvdGU6ICdodHRwczovL2ZyLndpa2lxdW90ZS5vcmcnLFxuICBmcndpa2lzb3VyY2U6ICdodHRwczovL2ZyLndpa2lzb3VyY2Uub3JnJyxcbiAgZnJ3aWtpdmVyc2l0eTogJ2h0dHBzOi8vZnIud2lraXZlcnNpdHkub3JnJyxcbiAgZnJ3aWtpdm95YWdlOiAnaHR0cHM6Ly9mci53aWtpdm95YWdlLm9yZycsXG4gIGZycHdpa2k6ICdodHRwczovL2ZycC53aWtpcGVkaWEub3JnJyxcbiAgZnJyd2lraTogJ2h0dHBzOi8vZnJyLndpa2lwZWRpYS5vcmcnLFxuICBmdXJ3aWtpOiAnaHR0cHM6Ly9mdXIud2lraXBlZGlhLm9yZycsXG4gIGZ5d2lraTogJ2h0dHBzOi8vZnkud2lraXBlZGlhLm9yZycsXG4gIGZ5d2lrdGlvbmFyeTogJ2h0dHBzOi8vZnkud2lrdGlvbmFyeS5vcmcnLFxuICBmeXdpa2lib29rczogJ2h0dHBzOi8vZnkud2lraWJvb2tzLm9yZycsXG4gIGdhd2lraTogJ2h0dHBzOi8vZ2Eud2lraXBlZGlhLm9yZycsXG4gIGdhd2lrdGlvbmFyeTogJ2h0dHBzOi8vZ2Eud2lrdGlvbmFyeS5vcmcnLFxuICBnYXdpa2lib29rczogJ2h0dHBzOi8vZ2Eud2lraWJvb2tzLm9yZycsXG4gIGdhd2lraXF1b3RlOiAnaHR0cHM6Ly9nYS53aWtpcXVvdGUub3JnJyxcbiAgZ2Fnd2lraTogJ2h0dHBzOi8vZ2FnLndpa2lwZWRpYS5vcmcnLFxuICBnYW53aWtpOiAnaHR0cHM6Ly9nYW4ud2lraXBlZGlhLm9yZycsXG4gIGdkd2lraTogJ2h0dHBzOi8vZ2Qud2lraXBlZGlhLm9yZycsXG4gIGdkd2lrdGlvbmFyeTogJ2h0dHBzOi8vZ2Qud2lrdGlvbmFyeS5vcmcnLFxuICBnbHdpa2k6ICdodHRwczovL2dsLndpa2lwZWRpYS5vcmcnLFxuICBnbHdpa3Rpb25hcnk6ICdodHRwczovL2dsLndpa3Rpb25hcnkub3JnJyxcbiAgZ2x3aWtpYm9va3M6ICdodHRwczovL2dsLndpa2lib29rcy5vcmcnLFxuICBnbHdpa2lxdW90ZTogJ2h0dHBzOi8vZ2wud2lraXF1b3RlLm9yZycsXG4gIGdsd2lraXNvdXJjZTogJ2h0dHBzOi8vZ2wud2lraXNvdXJjZS5vcmcnLFxuICBnbGt3aWtpOiAnaHR0cHM6Ly9nbGsud2lraXBlZGlhLm9yZycsXG4gIGdud2lraTogJ2h0dHBzOi8vZ24ud2lraXBlZGlhLm9yZycsXG4gIGdud2lrdGlvbmFyeTogJ2h0dHBzOi8vZ24ud2lrdGlvbmFyeS5vcmcnLFxuICBnbndpa2lib29rczogJ2h0dHBzOi8vZ24ud2lraWJvb2tzLm9yZycsXG4gIGdvdHdpa2k6ICdodHRwczovL2dvdC53aWtpcGVkaWEub3JnJyxcbiAgZ290d2lraWJvb2tzOiAnaHR0cHM6Ly9nb3Qud2lraWJvb2tzLm9yZycsXG4gIGd1d2lraTogJ2h0dHBzOi8vZ3Uud2lraXBlZGlhLm9yZycsXG4gIGd1d2lrdGlvbmFyeTogJ2h0dHBzOi8vZ3Uud2lrdGlvbmFyeS5vcmcnLFxuICBndXdpa2lib29rczogJ2h0dHBzOi8vZ3Uud2lraWJvb2tzLm9yZycsXG4gIGd1d2lraXF1b3RlOiAnaHR0cHM6Ly9ndS53aWtpcXVvdGUub3JnJyxcbiAgZ3V3aWtpc291cmNlOiAnaHR0cHM6Ly9ndS53aWtpc291cmNlLm9yZycsXG4gIGd2d2lraTogJ2h0dHBzOi8vZ3Yud2lraXBlZGlhLm9yZycsXG4gIGd2d2lrdGlvbmFyeTogJ2h0dHBzOi8vZ3Yud2lrdGlvbmFyeS5vcmcnLFxuICBoYXdpa2k6ICdodHRwczovL2hhLndpa2lwZWRpYS5vcmcnLFxuICBoYXdpa3Rpb25hcnk6ICdodHRwczovL2hhLndpa3Rpb25hcnkub3JnJyxcbiAgaGFrd2lraTogJ2h0dHBzOi8vaGFrLndpa2lwZWRpYS5vcmcnLFxuICBoYXd3aWtpOiAnaHR0cHM6Ly9oYXcud2lraXBlZGlhLm9yZycsXG4gIGhld2lraTogJ2h0dHBzOi8vaGUud2lraXBlZGlhLm9yZycsXG4gIGhld2lrdGlvbmFyeTogJ2h0dHBzOi8vaGUud2lrdGlvbmFyeS5vcmcnLFxuICBoZXdpa2lib29rczogJ2h0dHBzOi8vaGUud2lraWJvb2tzLm9yZycsXG4gIGhld2lraW5ld3M6ICdodHRwczovL2hlLndpa2luZXdzLm9yZycsXG4gIGhld2lraXF1b3RlOiAnaHR0cHM6Ly9oZS53aWtpcXVvdGUub3JnJyxcbiAgaGV3aWtpc291cmNlOiAnaHR0cHM6Ly9oZS53aWtpc291cmNlLm9yZycsXG4gIGhld2lraXZveWFnZTogJ2h0dHBzOi8vaGUud2lraXZveWFnZS5vcmcnLFxuICBoaXdpa2k6ICdodHRwczovL2hpLndpa2lwZWRpYS5vcmcnLFxuICBoaXdpa3Rpb25hcnk6ICdodHRwczovL2hpLndpa3Rpb25hcnkub3JnJyxcbiAgaGl3aWtpYm9va3M6ICdodHRwczovL2hpLndpa2lib29rcy5vcmcnLFxuICBoaXdpa2lxdW90ZTogJ2h0dHBzOi8vaGkud2lraXF1b3RlLm9yZycsXG4gIGhpZndpa2k6ICdodHRwczovL2hpZi53aWtpcGVkaWEub3JnJyxcbiAgaG93aWtpOiAnaHR0cHM6Ly9oby53aWtpcGVkaWEub3JnJyxcbiAgaHJ3aWtpOiAnaHR0cHM6Ly9oci53aWtpcGVkaWEub3JnJyxcbiAgaHJ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9oci53aWt0aW9uYXJ5Lm9yZycsXG4gIGhyd2lraWJvb2tzOiAnaHR0cHM6Ly9oci53aWtpYm9va3Mub3JnJyxcbiAgaHJ3aWtpcXVvdGU6ICdodHRwczovL2hyLndpa2lxdW90ZS5vcmcnLFxuICBocndpa2lzb3VyY2U6ICdodHRwczovL2hyLndpa2lzb3VyY2Uub3JnJyxcbiAgaHNid2lraTogJ2h0dHBzOi8vaHNiLndpa2lwZWRpYS5vcmcnLFxuICBoc2J3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9oc2Iud2lrdGlvbmFyeS5vcmcnLFxuICBodHdpa2k6ICdodHRwczovL2h0Lndpa2lwZWRpYS5vcmcnLFxuICBodHdpa2lzb3VyY2U6ICdodHRwczovL2h0Lndpa2lzb3VyY2Uub3JnJyxcbiAgaHV3aWtpOiAnaHR0cHM6Ly9odS53aWtpcGVkaWEub3JnJyxcbiAgaHV3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9odS53aWt0aW9uYXJ5Lm9yZycsXG4gIGh1d2lraWJvb2tzOiAnaHR0cHM6Ly9odS53aWtpYm9va3Mub3JnJyxcbiAgaHV3aWtpbmV3czogJ2h0dHBzOi8vaHUud2lraW5ld3Mub3JnJyxcbiAgaHV3aWtpcXVvdGU6ICdodHRwczovL2h1Lndpa2lxdW90ZS5vcmcnLFxuICBodXdpa2lzb3VyY2U6ICdodHRwczovL2h1Lndpa2lzb3VyY2Uub3JnJyxcbiAgaHl3aWtpOiAnaHR0cHM6Ly9oeS53aWtpcGVkaWEub3JnJyxcbiAgaHl3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9oeS53aWt0aW9uYXJ5Lm9yZycsXG4gIGh5d2lraWJvb2tzOiAnaHR0cHM6Ly9oeS53aWtpYm9va3Mub3JnJyxcbiAgaHl3aWtpcXVvdGU6ICdodHRwczovL2h5Lndpa2lxdW90ZS5vcmcnLFxuICBoeXdpa2lzb3VyY2U6ICdodHRwczovL2h5Lndpa2lzb3VyY2Uub3JnJyxcbiAgaHp3aWtpOiAnaHR0cHM6Ly9oei53aWtpcGVkaWEub3JnJyxcbiAgaWF3aWtpOiAnaHR0cHM6Ly9pYS53aWtpcGVkaWEub3JnJyxcbiAgaWF3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9pYS53aWt0aW9uYXJ5Lm9yZycsXG4gIGlhd2lraWJvb2tzOiAnaHR0cHM6Ly9pYS53aWtpYm9va3Mub3JnJyxcbiAgaWR3aWtpOiAnaHR0cHM6Ly9pZC53aWtpcGVkaWEub3JnJyxcbiAgaWR3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9pZC53aWt0aW9uYXJ5Lm9yZycsXG4gIGlkd2lraWJvb2tzOiAnaHR0cHM6Ly9pZC53aWtpYm9va3Mub3JnJyxcbiAgaWR3aWtpcXVvdGU6ICdodHRwczovL2lkLndpa2lxdW90ZS5vcmcnLFxuICBpZHdpa2lzb3VyY2U6ICdodHRwczovL2lkLndpa2lzb3VyY2Uub3JnJyxcbiAgaWV3aWtpOiAnaHR0cHM6Ly9pZS53aWtpcGVkaWEub3JnJyxcbiAgaWV3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9pZS53aWt0aW9uYXJ5Lm9yZycsXG4gIGlld2lraWJvb2tzOiAnaHR0cHM6Ly9pZS53aWtpYm9va3Mub3JnJyxcbiAgaWd3aWtpOiAnaHR0cHM6Ly9pZy53aWtpcGVkaWEub3JnJyxcbiAgaWl3aWtpOiAnaHR0cHM6Ly9paS53aWtpcGVkaWEub3JnJyxcbiAgaWt3aWtpOiAnaHR0cHM6Ly9pay53aWtpcGVkaWEub3JnJyxcbiAgaWt3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9pay53aWt0aW9uYXJ5Lm9yZycsXG4gIGlsb3dpa2k6ICdodHRwczovL2lsby53aWtpcGVkaWEub3JnJyxcbiAgaW93aWtpOiAnaHR0cHM6Ly9pby53aWtpcGVkaWEub3JnJyxcbiAgaW93aWt0aW9uYXJ5OiAnaHR0cHM6Ly9pby53aWt0aW9uYXJ5Lm9yZycsXG4gIGlzd2lraTogJ2h0dHBzOi8vaXMud2lraXBlZGlhLm9yZycsXG4gIGlzd2lrdGlvbmFyeTogJ2h0dHBzOi8vaXMud2lrdGlvbmFyeS5vcmcnLFxuICBpc3dpa2lib29rczogJ2h0dHBzOi8vaXMud2lraWJvb2tzLm9yZycsXG4gIGlzd2lraXF1b3RlOiAnaHR0cHM6Ly9pcy53aWtpcXVvdGUub3JnJyxcbiAgaXN3aWtpc291cmNlOiAnaHR0cHM6Ly9pcy53aWtpc291cmNlLm9yZycsXG4gIGl0d2lraTogJ2h0dHBzOi8vaXQud2lraXBlZGlhLm9yZycsXG4gIGl0d2lrdGlvbmFyeTogJ2h0dHBzOi8vaXQud2lrdGlvbmFyeS5vcmcnLFxuICBpdHdpa2lib29rczogJ2h0dHBzOi8vaXQud2lraWJvb2tzLm9yZycsXG4gIGl0d2lraW5ld3M6ICdodHRwczovL2l0Lndpa2luZXdzLm9yZycsXG4gIGl0d2lraXF1b3RlOiAnaHR0cHM6Ly9pdC53aWtpcXVvdGUub3JnJyxcbiAgaXR3aWtpc291cmNlOiAnaHR0cHM6Ly9pdC53aWtpc291cmNlLm9yZycsXG4gIGl0d2lraXZlcnNpdHk6ICdodHRwczovL2l0Lndpa2l2ZXJzaXR5Lm9yZycsXG4gIGl0d2lraXZveWFnZTogJ2h0dHBzOi8vaXQud2lraXZveWFnZS5vcmcnLFxuICBpdXdpa2k6ICdodHRwczovL2l1Lndpa2lwZWRpYS5vcmcnLFxuICBpdXdpa3Rpb25hcnk6ICdodHRwczovL2l1Lndpa3Rpb25hcnkub3JnJyxcbiAgamF3aWtpOiAnaHR0cHM6Ly9qYS53aWtpcGVkaWEub3JnJyxcbiAgamF3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9qYS53aWt0aW9uYXJ5Lm9yZycsXG4gIGphd2lraWJvb2tzOiAnaHR0cHM6Ly9qYS53aWtpYm9va3Mub3JnJyxcbiAgamF3aWtpbmV3czogJ2h0dHBzOi8vamEud2lraW5ld3Mub3JnJyxcbiAgamF3aWtpcXVvdGU6ICdodHRwczovL2phLndpa2lxdW90ZS5vcmcnLFxuICBqYXdpa2lzb3VyY2U6ICdodHRwczovL2phLndpa2lzb3VyY2Uub3JnJyxcbiAgamF3aWtpdmVyc2l0eTogJ2h0dHBzOi8vamEud2lraXZlcnNpdHkub3JnJyxcbiAgamJvd2lraTogJ2h0dHBzOi8vamJvLndpa2lwZWRpYS5vcmcnLFxuICBqYm93aWt0aW9uYXJ5OiAnaHR0cHM6Ly9qYm8ud2lrdGlvbmFyeS5vcmcnLFxuICBqdndpa2k6ICdodHRwczovL2p2Lndpa2lwZWRpYS5vcmcnLFxuICBqdndpa3Rpb25hcnk6ICdodHRwczovL2p2Lndpa3Rpb25hcnkub3JnJyxcbiAga2F3aWtpOiAnaHR0cHM6Ly9rYS53aWtpcGVkaWEub3JnJyxcbiAga2F3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9rYS53aWt0aW9uYXJ5Lm9yZycsXG4gIGthd2lraWJvb2tzOiAnaHR0cHM6Ly9rYS53aWtpYm9va3Mub3JnJyxcbiAga2F3aWtpcXVvdGU6ICdodHRwczovL2thLndpa2lxdW90ZS5vcmcnLFxuICBrYWF3aWtpOiAnaHR0cHM6Ly9rYWEud2lraXBlZGlhLm9yZycsXG4gIGthYndpa2k6ICdodHRwczovL2thYi53aWtpcGVkaWEub3JnJyxcbiAga2Jkd2lraTogJ2h0dHBzOi8va2JkLndpa2lwZWRpYS5vcmcnLFxuICBrZ3dpa2k6ICdodHRwczovL2tnLndpa2lwZWRpYS5vcmcnLFxuICBraXdpa2k6ICdodHRwczovL2tpLndpa2lwZWRpYS5vcmcnLFxuICBrandpa2k6ICdodHRwczovL2tqLndpa2lwZWRpYS5vcmcnLFxuICBra3dpa2k6ICdodHRwczovL2trLndpa2lwZWRpYS5vcmcnLFxuICBra3dpa3Rpb25hcnk6ICdodHRwczovL2trLndpa3Rpb25hcnkub3JnJyxcbiAga2t3aWtpYm9va3M6ICdodHRwczovL2trLndpa2lib29rcy5vcmcnLFxuICBra3dpa2lxdW90ZTogJ2h0dHBzOi8va2sud2lraXF1b3RlLm9yZycsXG4gIGtsd2lraTogJ2h0dHBzOi8va2wud2lraXBlZGlhLm9yZycsXG4gIGtsd2lrdGlvbmFyeTogJ2h0dHBzOi8va2wud2lrdGlvbmFyeS5vcmcnLFxuICBrbXdpa2k6ICdodHRwczovL2ttLndpa2lwZWRpYS5vcmcnLFxuICBrbXdpa3Rpb25hcnk6ICdodHRwczovL2ttLndpa3Rpb25hcnkub3JnJyxcbiAga213aWtpYm9va3M6ICdodHRwczovL2ttLndpa2lib29rcy5vcmcnLFxuICBrbndpa2k6ICdodHRwczovL2tuLndpa2lwZWRpYS5vcmcnLFxuICBrbndpa3Rpb25hcnk6ICdodHRwczovL2tuLndpa3Rpb25hcnkub3JnJyxcbiAga253aWtpYm9va3M6ICdodHRwczovL2tuLndpa2lib29rcy5vcmcnLFxuICBrbndpa2lxdW90ZTogJ2h0dHBzOi8va24ud2lraXF1b3RlLm9yZycsXG4gIGtud2lraXNvdXJjZTogJ2h0dHBzOi8va24ud2lraXNvdXJjZS5vcmcnLFxuICBrb3dpa2k6ICdodHRwczovL2tvLndpa2lwZWRpYS5vcmcnLFxuICBrb3dpa3Rpb25hcnk6ICdodHRwczovL2tvLndpa3Rpb25hcnkub3JnJyxcbiAga293aWtpYm9va3M6ICdodHRwczovL2tvLndpa2lib29rcy5vcmcnLFxuICBrb3dpa2luZXdzOiAnaHR0cHM6Ly9rby53aWtpbmV3cy5vcmcnLFxuICBrb3dpa2lxdW90ZTogJ2h0dHBzOi8va28ud2lraXF1b3RlLm9yZycsXG4gIGtvd2lraXNvdXJjZTogJ2h0dHBzOi8va28ud2lraXNvdXJjZS5vcmcnLFxuICBrb3dpa2l2ZXJzaXR5OiAnaHR0cHM6Ly9rby53aWtpdmVyc2l0eS5vcmcnLFxuICBrb2l3aWtpOiAnaHR0cHM6Ly9rb2kud2lraXBlZGlhLm9yZycsXG4gIGtyd2lraTogJ2h0dHBzOi8va3Iud2lraXBlZGlhLm9yZycsXG4gIGtyd2lraXF1b3RlOiAnaHR0cHM6Ly9rci53aWtpcXVvdGUub3JnJyxcbiAga3Jjd2lraTogJ2h0dHBzOi8va3JjLndpa2lwZWRpYS5vcmcnLFxuICBrc3dpa2k6ICdodHRwczovL2tzLndpa2lwZWRpYS5vcmcnLFxuICBrc3dpa3Rpb25hcnk6ICdodHRwczovL2tzLndpa3Rpb25hcnkub3JnJyxcbiAga3N3aWtpYm9va3M6ICdodHRwczovL2tzLndpa2lib29rcy5vcmcnLFxuICBrc3dpa2lxdW90ZTogJ2h0dHBzOi8va3Mud2lraXF1b3RlLm9yZycsXG4gIGtzaHdpa2k6ICdodHRwczovL2tzaC53aWtpcGVkaWEub3JnJyxcbiAga3V3aWtpOiAnaHR0cHM6Ly9rdS53aWtpcGVkaWEub3JnJyxcbiAga3V3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9rdS53aWt0aW9uYXJ5Lm9yZycsXG4gIGt1d2lraWJvb2tzOiAnaHR0cHM6Ly9rdS53aWtpYm9va3Mub3JnJyxcbiAga3V3aWtpcXVvdGU6ICdodHRwczovL2t1Lndpa2lxdW90ZS5vcmcnLFxuICBrdndpa2k6ICdodHRwczovL2t2Lndpa2lwZWRpYS5vcmcnLFxuICBrd3dpa2k6ICdodHRwczovL2t3Lndpa2lwZWRpYS5vcmcnLFxuICBrd3dpa3Rpb25hcnk6ICdodHRwczovL2t3Lndpa3Rpb25hcnkub3JnJyxcbiAga3d3aWtpcXVvdGU6ICdodHRwczovL2t3Lndpa2lxdW90ZS5vcmcnLFxuICBreXdpa2k6ICdodHRwczovL2t5Lndpa2lwZWRpYS5vcmcnLFxuICBreXdpa3Rpb25hcnk6ICdodHRwczovL2t5Lndpa3Rpb25hcnkub3JnJyxcbiAga3l3aWtpYm9va3M6ICdodHRwczovL2t5Lndpa2lib29rcy5vcmcnLFxuICBreXdpa2lxdW90ZTogJ2h0dHBzOi8va3kud2lraXF1b3RlLm9yZycsXG4gIGxhd2lraTogJ2h0dHBzOi8vbGEud2lraXBlZGlhLm9yZycsXG4gIGxhd2lrdGlvbmFyeTogJ2h0dHBzOi8vbGEud2lrdGlvbmFyeS5vcmcnLFxuICBsYXdpa2lib29rczogJ2h0dHBzOi8vbGEud2lraWJvb2tzLm9yZycsXG4gIGxhd2lraXF1b3RlOiAnaHR0cHM6Ly9sYS53aWtpcXVvdGUub3JnJyxcbiAgbGF3aWtpc291cmNlOiAnaHR0cHM6Ly9sYS53aWtpc291cmNlLm9yZycsXG4gIGxhZHdpa2k6ICdodHRwczovL2xhZC53aWtpcGVkaWEub3JnJyxcbiAgbGJ3aWtpOiAnaHR0cHM6Ly9sYi53aWtpcGVkaWEub3JnJyxcbiAgbGJ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9sYi53aWt0aW9uYXJ5Lm9yZycsXG4gIGxid2lraWJvb2tzOiAnaHR0cHM6Ly9sYi53aWtpYm9va3Mub3JnJyxcbiAgbGJ3aWtpcXVvdGU6ICdodHRwczovL2xiLndpa2lxdW90ZS5vcmcnLFxuICBsYmV3aWtpOiAnaHR0cHM6Ly9sYmUud2lraXBlZGlhLm9yZycsXG4gIGxlendpa2k6ICdodHRwczovL2xlei53aWtpcGVkaWEub3JnJyxcbiAgbGd3aWtpOiAnaHR0cHM6Ly9sZy53aWtpcGVkaWEub3JnJyxcbiAgbGl3aWtpOiAnaHR0cHM6Ly9saS53aWtpcGVkaWEub3JnJyxcbiAgbGl3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9saS53aWt0aW9uYXJ5Lm9yZycsXG4gIGxpd2lraWJvb2tzOiAnaHR0cHM6Ly9saS53aWtpYm9va3Mub3JnJyxcbiAgbGl3aWtpcXVvdGU6ICdodHRwczovL2xpLndpa2lxdW90ZS5vcmcnLFxuICBsaXdpa2lzb3VyY2U6ICdodHRwczovL2xpLndpa2lzb3VyY2Uub3JnJyxcbiAgbGlqd2lraTogJ2h0dHBzOi8vbGlqLndpa2lwZWRpYS5vcmcnLFxuICBsbW93aWtpOiAnaHR0cHM6Ly9sbW8ud2lraXBlZGlhLm9yZycsXG4gIGxud2lraTogJ2h0dHBzOi8vbG4ud2lraXBlZGlhLm9yZycsXG4gIGxud2lrdGlvbmFyeTogJ2h0dHBzOi8vbG4ud2lrdGlvbmFyeS5vcmcnLFxuICBsbndpa2lib29rczogJ2h0dHBzOi8vbG4ud2lraWJvb2tzLm9yZycsXG4gIGxvd2lraTogJ2h0dHBzOi8vbG8ud2lraXBlZGlhLm9yZycsXG4gIGxvd2lrdGlvbmFyeTogJ2h0dHBzOi8vbG8ud2lrdGlvbmFyeS5vcmcnLFxuICBsdHdpa2k6ICdodHRwczovL2x0Lndpa2lwZWRpYS5vcmcnLFxuICBsdHdpa3Rpb25hcnk6ICdodHRwczovL2x0Lndpa3Rpb25hcnkub3JnJyxcbiAgbHR3aWtpYm9va3M6ICdodHRwczovL2x0Lndpa2lib29rcy5vcmcnLFxuICBsdHdpa2lxdW90ZTogJ2h0dHBzOi8vbHQud2lraXF1b3RlLm9yZycsXG4gIGx0d2lraXNvdXJjZTogJ2h0dHBzOi8vbHQud2lraXNvdXJjZS5vcmcnLFxuICBsdGd3aWtpOiAnaHR0cHM6Ly9sdGcud2lraXBlZGlhLm9yZycsXG4gIGx2d2lraTogJ2h0dHBzOi8vbHYud2lraXBlZGlhLm9yZycsXG4gIGx2d2lrdGlvbmFyeTogJ2h0dHBzOi8vbHYud2lrdGlvbmFyeS5vcmcnLFxuICBsdndpa2lib29rczogJ2h0dHBzOi8vbHYud2lraWJvb2tzLm9yZycsXG4gIG1haXdpa2k6ICdodHRwczovL21haS53aWtpcGVkaWEub3JnJyxcbiAgbWFwX2Jtc3dpa2k6ICdodHRwczovL21hcC1ibXMud2lraXBlZGlhLm9yZycsXG4gIG1kZndpa2k6ICdodHRwczovL21kZi53aWtpcGVkaWEub3JnJyxcbiAgbWd3aWtpOiAnaHR0cHM6Ly9tZy53aWtpcGVkaWEub3JnJyxcbiAgbWd3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9tZy53aWt0aW9uYXJ5Lm9yZycsXG4gIG1nd2lraWJvb2tzOiAnaHR0cHM6Ly9tZy53aWtpYm9va3Mub3JnJyxcbiAgbWh3aWtpOiAnaHR0cHM6Ly9taC53aWtpcGVkaWEub3JnJyxcbiAgbWh3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9taC53aWt0aW9uYXJ5Lm9yZycsXG4gIG1ocndpa2k6ICdodHRwczovL21oci53aWtpcGVkaWEub3JnJyxcbiAgbWl3aWtpOiAnaHR0cHM6Ly9taS53aWtpcGVkaWEub3JnJyxcbiAgbWl3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9taS53aWt0aW9uYXJ5Lm9yZycsXG4gIG1pd2lraWJvb2tzOiAnaHR0cHM6Ly9taS53aWtpYm9va3Mub3JnJyxcbiAgbWlud2lraTogJ2h0dHBzOi8vbWluLndpa2lwZWRpYS5vcmcnLFxuICBta3dpa2k6ICdodHRwczovL21rLndpa2lwZWRpYS5vcmcnLFxuICBta3dpa3Rpb25hcnk6ICdodHRwczovL21rLndpa3Rpb25hcnkub3JnJyxcbiAgbWt3aWtpYm9va3M6ICdodHRwczovL21rLndpa2lib29rcy5vcmcnLFxuICBta3dpa2lzb3VyY2U6ICdodHRwczovL21rLndpa2lzb3VyY2Uub3JnJyxcbiAgbWx3aWtpOiAnaHR0cHM6Ly9tbC53aWtpcGVkaWEub3JnJyxcbiAgbWx3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9tbC53aWt0aW9uYXJ5Lm9yZycsXG4gIG1sd2lraWJvb2tzOiAnaHR0cHM6Ly9tbC53aWtpYm9va3Mub3JnJyxcbiAgbWx3aWtpcXVvdGU6ICdodHRwczovL21sLndpa2lxdW90ZS5vcmcnLFxuICBtbHdpa2lzb3VyY2U6ICdodHRwczovL21sLndpa2lzb3VyY2Uub3JnJyxcbiAgbW53aWtpOiAnaHR0cHM6Ly9tbi53aWtpcGVkaWEub3JnJyxcbiAgbW53aWt0aW9uYXJ5OiAnaHR0cHM6Ly9tbi53aWt0aW9uYXJ5Lm9yZycsXG4gIG1ud2lraWJvb2tzOiAnaHR0cHM6Ly9tbi53aWtpYm9va3Mub3JnJyxcbiAgbW93aWtpOiAnaHR0cHM6Ly9tby53aWtpcGVkaWEub3JnJyxcbiAgbW93aWt0aW9uYXJ5OiAnaHR0cHM6Ly9tby53aWt0aW9uYXJ5Lm9yZycsXG4gIG1yd2lraTogJ2h0dHBzOi8vbXIud2lraXBlZGlhLm9yZycsXG4gIG1yd2lrdGlvbmFyeTogJ2h0dHBzOi8vbXIud2lrdGlvbmFyeS5vcmcnLFxuICBtcndpa2lib29rczogJ2h0dHBzOi8vbXIud2lraWJvb2tzLm9yZycsXG4gIG1yd2lraXF1b3RlOiAnaHR0cHM6Ly9tci53aWtpcXVvdGUub3JnJyxcbiAgbXJ3aWtpc291cmNlOiAnaHR0cHM6Ly9tci53aWtpc291cmNlLm9yZycsXG4gIG1yandpa2k6ICdodHRwczovL21yai53aWtpcGVkaWEub3JnJyxcbiAgbXN3aWtpOiAnaHR0cHM6Ly9tcy53aWtpcGVkaWEub3JnJyxcbiAgbXN3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9tcy53aWt0aW9uYXJ5Lm9yZycsXG4gIG1zd2lraWJvb2tzOiAnaHR0cHM6Ly9tcy53aWtpYm9va3Mub3JnJyxcbiAgbXR3aWtpOiAnaHR0cHM6Ly9tdC53aWtpcGVkaWEub3JnJyxcbiAgbXR3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9tdC53aWt0aW9uYXJ5Lm9yZycsXG4gIG11c3dpa2k6ICdodHRwczovL211cy53aWtpcGVkaWEub3JnJyxcbiAgbXdsd2lraTogJ2h0dHBzOi8vbXdsLndpa2lwZWRpYS5vcmcnLFxuICBteXdpa2k6ICdodHRwczovL215Lndpa2lwZWRpYS5vcmcnLFxuICBteXdpa3Rpb25hcnk6ICdodHRwczovL215Lndpa3Rpb25hcnkub3JnJyxcbiAgbXl3aWtpYm9va3M6ICdodHRwczovL215Lndpa2lib29rcy5vcmcnLFxuICBteXZ3aWtpOiAnaHR0cHM6Ly9teXYud2lraXBlZGlhLm9yZycsXG4gIG16bndpa2k6ICdodHRwczovL216bi53aWtpcGVkaWEub3JnJyxcbiAgbmF3aWtpOiAnaHR0cHM6Ly9uYS53aWtpcGVkaWEub3JnJyxcbiAgbmF3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9uYS53aWt0aW9uYXJ5Lm9yZycsXG4gIG5hd2lraWJvb2tzOiAnaHR0cHM6Ly9uYS53aWtpYm9va3Mub3JnJyxcbiAgbmF3aWtpcXVvdGU6ICdodHRwczovL25hLndpa2lxdW90ZS5vcmcnLFxuICBuYWh3aWtpOiAnaHR0cHM6Ly9uYWgud2lraXBlZGlhLm9yZycsXG4gIG5haHdpa3Rpb25hcnk6ICdodHRwczovL25haC53aWt0aW9uYXJ5Lm9yZycsXG4gIG5haHdpa2lib29rczogJ2h0dHBzOi8vbmFoLndpa2lib29rcy5vcmcnLFxuICBuYXB3aWtpOiAnaHR0cHM6Ly9uYXAud2lraXBlZGlhLm9yZycsXG4gIG5kc3dpa2k6ICdodHRwczovL25kcy53aWtpcGVkaWEub3JnJyxcbiAgbmRzd2lrdGlvbmFyeTogJ2h0dHBzOi8vbmRzLndpa3Rpb25hcnkub3JnJyxcbiAgbmRzd2lraWJvb2tzOiAnaHR0cHM6Ly9uZHMud2lraWJvb2tzLm9yZycsXG4gIG5kc3dpa2lxdW90ZTogJ2h0dHBzOi8vbmRzLndpa2lxdW90ZS5vcmcnLFxuICBuZHNfbmx3aWtpOiAnaHR0cHM6Ly9uZHMtbmwud2lraXBlZGlhLm9yZycsXG4gIG5ld2lraTogJ2h0dHBzOi8vbmUud2lraXBlZGlhLm9yZycsXG4gIG5ld2lrdGlvbmFyeTogJ2h0dHBzOi8vbmUud2lrdGlvbmFyeS5vcmcnLFxuICBuZXdpa2lib29rczogJ2h0dHBzOi8vbmUud2lraWJvb2tzLm9yZycsXG4gIG5ld3dpa2k6ICdodHRwczovL25ldy53aWtpcGVkaWEub3JnJyxcbiAgbmd3aWtpOiAnaHR0cHM6Ly9uZy53aWtpcGVkaWEub3JnJyxcbiAgbmx3aWtpOiAnaHR0cHM6Ly9ubC53aWtpcGVkaWEub3JnJyxcbiAgbmx3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9ubC53aWt0aW9uYXJ5Lm9yZycsXG4gIG5sd2lraWJvb2tzOiAnaHR0cHM6Ly9ubC53aWtpYm9va3Mub3JnJyxcbiAgbmx3aWtpbmV3czogJ2h0dHBzOi8vbmwud2lraW5ld3Mub3JnJyxcbiAgbmx3aWtpcXVvdGU6ICdodHRwczovL25sLndpa2lxdW90ZS5vcmcnLFxuICBubHdpa2lzb3VyY2U6ICdodHRwczovL25sLndpa2lzb3VyY2Uub3JnJyxcbiAgbmx3aWtpdm95YWdlOiAnaHR0cHM6Ly9ubC53aWtpdm95YWdlLm9yZycsXG4gIG5ud2lraTogJ2h0dHBzOi8vbm4ud2lraXBlZGlhLm9yZycsXG4gIG5ud2lrdGlvbmFyeTogJ2h0dHBzOi8vbm4ud2lrdGlvbmFyeS5vcmcnLFxuICBubndpa2lxdW90ZTogJ2h0dHBzOi8vbm4ud2lraXF1b3RlLm9yZycsXG4gIG5vd2lraTogJ2h0dHBzOi8vbm8ud2lraXBlZGlhLm9yZycsXG4gIG5vd2lrdGlvbmFyeTogJ2h0dHBzOi8vbm8ud2lrdGlvbmFyeS5vcmcnLFxuICBub3dpa2lib29rczogJ2h0dHBzOi8vbm8ud2lraWJvb2tzLm9yZycsXG4gIG5vd2lraW5ld3M6ICdodHRwczovL25vLndpa2luZXdzLm9yZycsXG4gIG5vd2lraXF1b3RlOiAnaHR0cHM6Ly9uby53aWtpcXVvdGUub3JnJyxcbiAgbm93aWtpc291cmNlOiAnaHR0cHM6Ly9uby53aWtpc291cmNlLm9yZycsXG4gIG5vdndpa2k6ICdodHRwczovL25vdi53aWtpcGVkaWEub3JnJyxcbiAgbnJtd2lraTogJ2h0dHBzOi8vbnJtLndpa2lwZWRpYS5vcmcnLFxuICBuc293aWtpOiAnaHR0cHM6Ly9uc28ud2lraXBlZGlhLm9yZycsXG4gIG52d2lraTogJ2h0dHBzOi8vbnYud2lraXBlZGlhLm9yZycsXG4gIG55d2lraTogJ2h0dHBzOi8vbnkud2lraXBlZGlhLm9yZycsXG4gIG9jd2lraTogJ2h0dHBzOi8vb2Mud2lraXBlZGlhLm9yZycsXG4gIG9jd2lrdGlvbmFyeTogJ2h0dHBzOi8vb2Mud2lrdGlvbmFyeS5vcmcnLFxuICBvY3dpa2lib29rczogJ2h0dHBzOi8vb2Mud2lraWJvb2tzLm9yZycsXG4gIG9td2lraTogJ2h0dHBzOi8vb20ud2lraXBlZGlhLm9yZycsXG4gIG9td2lrdGlvbmFyeTogJ2h0dHBzOi8vb20ud2lrdGlvbmFyeS5vcmcnLFxuICBvcndpa2k6ICdodHRwczovL29yLndpa2lwZWRpYS5vcmcnLFxuICBvcndpa3Rpb25hcnk6ICdodHRwczovL29yLndpa3Rpb25hcnkub3JnJyxcbiAgb3J3aWtpc291cmNlOiAnaHR0cHM6Ly9vci53aWtpc291cmNlLm9yZycsXG4gIG9zd2lraTogJ2h0dHBzOi8vb3Mud2lraXBlZGlhLm9yZycsXG4gIHBhd2lraTogJ2h0dHBzOi8vcGEud2lraXBlZGlhLm9yZycsXG4gIHBhd2lrdGlvbmFyeTogJ2h0dHBzOi8vcGEud2lrdGlvbmFyeS5vcmcnLFxuICBwYXdpa2lib29rczogJ2h0dHBzOi8vcGEud2lraWJvb2tzLm9yZycsXG4gIHBhZ3dpa2k6ICdodHRwczovL3BhZy53aWtpcGVkaWEub3JnJyxcbiAgcGFtd2lraTogJ2h0dHBzOi8vcGFtLndpa2lwZWRpYS5vcmcnLFxuICBwYXB3aWtpOiAnaHR0cHM6Ly9wYXAud2lraXBlZGlhLm9yZycsXG4gIHBjZHdpa2k6ICdodHRwczovL3BjZC53aWtpcGVkaWEub3JnJyxcbiAgcGRjd2lraTogJ2h0dHBzOi8vcGRjLndpa2lwZWRpYS5vcmcnLFxuICBwZmx3aWtpOiAnaHR0cHM6Ly9wZmwud2lraXBlZGlhLm9yZycsXG4gIHBpd2lraTogJ2h0dHBzOi8vcGkud2lraXBlZGlhLm9yZycsXG4gIHBpd2lrdGlvbmFyeTogJ2h0dHBzOi8vcGkud2lrdGlvbmFyeS5vcmcnLFxuICBwaWh3aWtpOiAnaHR0cHM6Ly9waWgud2lraXBlZGlhLm9yZycsXG4gIHBsd2lraTogJ2h0dHBzOi8vcGwud2lraXBlZGlhLm9yZycsXG4gIHBsd2lrdGlvbmFyeTogJ2h0dHBzOi8vcGwud2lrdGlvbmFyeS5vcmcnLFxuICBwbHdpa2lib29rczogJ2h0dHBzOi8vcGwud2lraWJvb2tzLm9yZycsXG4gIHBsd2lraW5ld3M6ICdodHRwczovL3BsLndpa2luZXdzLm9yZycsXG4gIHBsd2lraXF1b3RlOiAnaHR0cHM6Ly9wbC53aWtpcXVvdGUub3JnJyxcbiAgcGx3aWtpc291cmNlOiAnaHR0cHM6Ly9wbC53aWtpc291cmNlLm9yZycsXG4gIHBsd2lraXZveWFnZTogJ2h0dHBzOi8vcGwud2lraXZveWFnZS5vcmcnLFxuICBwbXN3aWtpOiAnaHR0cHM6Ly9wbXMud2lraXBlZGlhLm9yZycsXG4gIHBuYndpa2k6ICdodHRwczovL3BuYi53aWtpcGVkaWEub3JnJyxcbiAgcG5id2lrdGlvbmFyeTogJ2h0dHBzOi8vcG5iLndpa3Rpb25hcnkub3JnJyxcbiAgcG50d2lraTogJ2h0dHBzOi8vcG50Lndpa2lwZWRpYS5vcmcnLFxuICBwc3dpa2k6ICdodHRwczovL3BzLndpa2lwZWRpYS5vcmcnLFxuICBwc3dpa3Rpb25hcnk6ICdodHRwczovL3BzLndpa3Rpb25hcnkub3JnJyxcbiAgcHN3aWtpYm9va3M6ICdodHRwczovL3BzLndpa2lib29rcy5vcmcnLFxuICBwdHdpa2k6ICdodHRwczovL3B0Lndpa2lwZWRpYS5vcmcnLFxuICBwdHdpa3Rpb25hcnk6ICdodHRwczovL3B0Lndpa3Rpb25hcnkub3JnJyxcbiAgcHR3aWtpYm9va3M6ICdodHRwczovL3B0Lndpa2lib29rcy5vcmcnLFxuICBwdHdpa2luZXdzOiAnaHR0cHM6Ly9wdC53aWtpbmV3cy5vcmcnLFxuICBwdHdpa2lxdW90ZTogJ2h0dHBzOi8vcHQud2lraXF1b3RlLm9yZycsXG4gIHB0d2lraXNvdXJjZTogJ2h0dHBzOi8vcHQud2lraXNvdXJjZS5vcmcnLFxuICBwdHdpa2l2ZXJzaXR5OiAnaHR0cHM6Ly9wdC53aWtpdmVyc2l0eS5vcmcnLFxuICBwdHdpa2l2b3lhZ2U6ICdodHRwczovL3B0Lndpa2l2b3lhZ2Uub3JnJyxcbiAgcXV3aWtpOiAnaHR0cHM6Ly9xdS53aWtpcGVkaWEub3JnJyxcbiAgcXV3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9xdS53aWt0aW9uYXJ5Lm9yZycsXG4gIHF1d2lraWJvb2tzOiAnaHR0cHM6Ly9xdS53aWtpYm9va3Mub3JnJyxcbiAgcXV3aWtpcXVvdGU6ICdodHRwczovL3F1Lndpa2lxdW90ZS5vcmcnLFxuICBybXdpa2k6ICdodHRwczovL3JtLndpa2lwZWRpYS5vcmcnLFxuICBybXdpa3Rpb25hcnk6ICdodHRwczovL3JtLndpa3Rpb25hcnkub3JnJyxcbiAgcm13aWtpYm9va3M6ICdodHRwczovL3JtLndpa2lib29rcy5vcmcnLFxuICBybXl3aWtpOiAnaHR0cHM6Ly9ybXkud2lraXBlZGlhLm9yZycsXG4gIHJud2lraTogJ2h0dHBzOi8vcm4ud2lraXBlZGlhLm9yZycsXG4gIHJud2lrdGlvbmFyeTogJ2h0dHBzOi8vcm4ud2lrdGlvbmFyeS5vcmcnLFxuICByb3dpa2k6ICdodHRwczovL3JvLndpa2lwZWRpYS5vcmcnLFxuICByb3dpa3Rpb25hcnk6ICdodHRwczovL3JvLndpa3Rpb25hcnkub3JnJyxcbiAgcm93aWtpYm9va3M6ICdodHRwczovL3JvLndpa2lib29rcy5vcmcnLFxuICByb3dpa2luZXdzOiAnaHR0cHM6Ly9yby53aWtpbmV3cy5vcmcnLFxuICByb3dpa2lxdW90ZTogJ2h0dHBzOi8vcm8ud2lraXF1b3RlLm9yZycsXG4gIHJvd2lraXNvdXJjZTogJ2h0dHBzOi8vcm8ud2lraXNvdXJjZS5vcmcnLFxuICByb3dpa2l2b3lhZ2U6ICdodHRwczovL3JvLndpa2l2b3lhZ2Uub3JnJyxcbiAgcm9hX3J1cHdpa2k6ICdodHRwczovL3JvYS1ydXAud2lraXBlZGlhLm9yZycsXG4gIHJvYV9ydXB3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9yb2EtcnVwLndpa3Rpb25hcnkub3JnJyxcbiAgcm9hX3RhcmF3aWtpOiAnaHR0cHM6Ly9yb2EtdGFyYS53aWtpcGVkaWEub3JnJyxcbiAgcnV3aWtpOiAnaHR0cHM6Ly9ydS53aWtpcGVkaWEub3JnJyxcbiAgcnV3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9ydS53aWt0aW9uYXJ5Lm9yZycsXG4gIHJ1d2lraWJvb2tzOiAnaHR0cHM6Ly9ydS53aWtpYm9va3Mub3JnJyxcbiAgcnV3aWtpbmV3czogJ2h0dHBzOi8vcnUud2lraW5ld3Mub3JnJyxcbiAgcnV3aWtpcXVvdGU6ICdodHRwczovL3J1Lndpa2lxdW90ZS5vcmcnLFxuICBydXdpa2lzb3VyY2U6ICdodHRwczovL3J1Lndpa2lzb3VyY2Uub3JnJyxcbiAgcnV3aWtpdmVyc2l0eTogJ2h0dHBzOi8vcnUud2lraXZlcnNpdHkub3JnJyxcbiAgcnV3aWtpdm95YWdlOiAnaHR0cHM6Ly9ydS53aWtpdm95YWdlLm9yZycsXG4gIHJ1ZXdpa2k6ICdodHRwczovL3J1ZS53aWtpcGVkaWEub3JnJyxcbiAgcnd3aWtpOiAnaHR0cHM6Ly9ydy53aWtpcGVkaWEub3JnJyxcbiAgcnd3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9ydy53aWt0aW9uYXJ5Lm9yZycsXG4gIHNhd2lraTogJ2h0dHBzOi8vc2Eud2lraXBlZGlhLm9yZycsXG4gIHNhd2lrdGlvbmFyeTogJ2h0dHBzOi8vc2Eud2lrdGlvbmFyeS5vcmcnLFxuICBzYXdpa2lib29rczogJ2h0dHBzOi8vc2Eud2lraWJvb2tzLm9yZycsXG4gIHNhd2lraXF1b3RlOiAnaHR0cHM6Ly9zYS53aWtpcXVvdGUub3JnJyxcbiAgc2F3aWtpc291cmNlOiAnaHR0cHM6Ly9zYS53aWtpc291cmNlLm9yZycsXG4gIHNhaHdpa2k6ICdodHRwczovL3NhaC53aWtpcGVkaWEub3JnJyxcbiAgc2Fod2lraXNvdXJjZTogJ2h0dHBzOi8vc2FoLndpa2lzb3VyY2Uub3JnJyxcbiAgc2N3aWtpOiAnaHR0cHM6Ly9zYy53aWtpcGVkaWEub3JnJyxcbiAgc2N3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zYy53aWt0aW9uYXJ5Lm9yZycsXG4gIHNjbndpa2k6ICdodHRwczovL3Njbi53aWtpcGVkaWEub3JnJyxcbiAgc2Nud2lrdGlvbmFyeTogJ2h0dHBzOi8vc2NuLndpa3Rpb25hcnkub3JnJyxcbiAgc2Nvd2lraTogJ2h0dHBzOi8vc2NvLndpa2lwZWRpYS5vcmcnLFxuICBzZHdpa2k6ICdodHRwczovL3NkLndpa2lwZWRpYS5vcmcnLFxuICBzZHdpa3Rpb25hcnk6ICdodHRwczovL3NkLndpa3Rpb25hcnkub3JnJyxcbiAgc2R3aWtpbmV3czogJ2h0dHBzOi8vc2Qud2lraW5ld3Mub3JnJyxcbiAgc2V3aWtpOiAnaHR0cHM6Ly9zZS53aWtpcGVkaWEub3JnJyxcbiAgc2V3aWtpYm9va3M6ICdodHRwczovL3NlLndpa2lib29rcy5vcmcnLFxuICBzZ3dpa2k6ICdodHRwczovL3NnLndpa2lwZWRpYS5vcmcnLFxuICBzZ3dpa3Rpb25hcnk6ICdodHRwczovL3NnLndpa3Rpb25hcnkub3JnJyxcbiAgc2h3aWtpOiAnaHR0cHM6Ly9zaC53aWtpcGVkaWEub3JnJyxcbiAgc2h3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zaC53aWt0aW9uYXJ5Lm9yZycsXG4gIHNpd2lraTogJ2h0dHBzOi8vc2kud2lraXBlZGlhLm9yZycsXG4gIHNpd2lrdGlvbmFyeTogJ2h0dHBzOi8vc2kud2lrdGlvbmFyeS5vcmcnLFxuICBzaXdpa2lib29rczogJ2h0dHBzOi8vc2kud2lraWJvb2tzLm9yZycsXG4gIHNpbXBsZXdpa2k6ICdodHRwczovL3NpbXBsZS53aWtpcGVkaWEub3JnJyxcbiAgc2ltcGxld2lrdGlvbmFyeTogJ2h0dHBzOi8vc2ltcGxlLndpa3Rpb25hcnkub3JnJyxcbiAgc2ltcGxld2lraWJvb2tzOiAnaHR0cHM6Ly9zaW1wbGUud2lraWJvb2tzLm9yZycsXG4gIHNpbXBsZXdpa2lxdW90ZTogJ2h0dHBzOi8vc2ltcGxlLndpa2lxdW90ZS5vcmcnLFxuICBza3dpa2k6ICdodHRwczovL3NrLndpa2lwZWRpYS5vcmcnLFxuICBza3dpa3Rpb25hcnk6ICdodHRwczovL3NrLndpa3Rpb25hcnkub3JnJyxcbiAgc2t3aWtpYm9va3M6ICdodHRwczovL3NrLndpa2lib29rcy5vcmcnLFxuICBza3dpa2lxdW90ZTogJ2h0dHBzOi8vc2sud2lraXF1b3RlLm9yZycsXG4gIHNrd2lraXNvdXJjZTogJ2h0dHBzOi8vc2sud2lraXNvdXJjZS5vcmcnLFxuICBzbHdpa2k6ICdodHRwczovL3NsLndpa2lwZWRpYS5vcmcnLFxuICBzbHdpa3Rpb25hcnk6ICdodHRwczovL3NsLndpa3Rpb25hcnkub3JnJyxcbiAgc2x3aWtpYm9va3M6ICdodHRwczovL3NsLndpa2lib29rcy5vcmcnLFxuICBzbHdpa2lxdW90ZTogJ2h0dHBzOi8vc2wud2lraXF1b3RlLm9yZycsXG4gIHNsd2lraXNvdXJjZTogJ2h0dHBzOi8vc2wud2lraXNvdXJjZS5vcmcnLFxuICBzbHdpa2l2ZXJzaXR5OiAnaHR0cHM6Ly9zbC53aWtpdmVyc2l0eS5vcmcnLFxuICBzbXdpa2k6ICdodHRwczovL3NtLndpa2lwZWRpYS5vcmcnLFxuICBzbXdpa3Rpb25hcnk6ICdodHRwczovL3NtLndpa3Rpb25hcnkub3JnJyxcbiAgc253aWtpOiAnaHR0cHM6Ly9zbi53aWtpcGVkaWEub3JnJyxcbiAgc253aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zbi53aWt0aW9uYXJ5Lm9yZycsXG4gIHNvd2lraTogJ2h0dHBzOi8vc28ud2lraXBlZGlhLm9yZycsXG4gIHNvd2lrdGlvbmFyeTogJ2h0dHBzOi8vc28ud2lrdGlvbmFyeS5vcmcnLFxuICBzcXdpa2k6ICdodHRwczovL3NxLndpa2lwZWRpYS5vcmcnLFxuICBzcXdpa3Rpb25hcnk6ICdodHRwczovL3NxLndpa3Rpb25hcnkub3JnJyxcbiAgc3F3aWtpYm9va3M6ICdodHRwczovL3NxLndpa2lib29rcy5vcmcnLFxuICBzcXdpa2luZXdzOiAnaHR0cHM6Ly9zcS53aWtpbmV3cy5vcmcnLFxuICBzcXdpa2lxdW90ZTogJ2h0dHBzOi8vc3Eud2lraXF1b3RlLm9yZycsXG4gIHNyd2lraTogJ2h0dHBzOi8vc3Iud2lraXBlZGlhLm9yZycsXG4gIHNyd2lrdGlvbmFyeTogJ2h0dHBzOi8vc3Iud2lrdGlvbmFyeS5vcmcnLFxuICBzcndpa2lib29rczogJ2h0dHBzOi8vc3Iud2lraWJvb2tzLm9yZycsXG4gIHNyd2lraW5ld3M6ICdodHRwczovL3NyLndpa2luZXdzLm9yZycsXG4gIHNyd2lraXF1b3RlOiAnaHR0cHM6Ly9zci53aWtpcXVvdGUub3JnJyxcbiAgc3J3aWtpc291cmNlOiAnaHR0cHM6Ly9zci53aWtpc291cmNlLm9yZycsXG4gIHNybndpa2k6ICdodHRwczovL3Nybi53aWtpcGVkaWEub3JnJyxcbiAgc3N3aWtpOiAnaHR0cHM6Ly9zcy53aWtpcGVkaWEub3JnJyxcbiAgc3N3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zcy53aWt0aW9uYXJ5Lm9yZycsXG4gIHN0d2lraTogJ2h0dHBzOi8vc3Qud2lraXBlZGlhLm9yZycsXG4gIHN0d2lrdGlvbmFyeTogJ2h0dHBzOi8vc3Qud2lrdGlvbmFyeS5vcmcnLFxuICBzdHF3aWtpOiAnaHR0cHM6Ly9zdHEud2lraXBlZGlhLm9yZycsXG4gIHN1d2lraTogJ2h0dHBzOi8vc3Uud2lraXBlZGlhLm9yZycsXG4gIHN1d2lrdGlvbmFyeTogJ2h0dHBzOi8vc3Uud2lrdGlvbmFyeS5vcmcnLFxuICBzdXdpa2lib29rczogJ2h0dHBzOi8vc3Uud2lraWJvb2tzLm9yZycsXG4gIHN1d2lraXF1b3RlOiAnaHR0cHM6Ly9zdS53aWtpcXVvdGUub3JnJyxcbiAgc3Z3aWtpOiAnaHR0cHM6Ly9zdi53aWtpcGVkaWEub3JnJyxcbiAgc3Z3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zdi53aWt0aW9uYXJ5Lm9yZycsXG4gIHN2d2lraWJvb2tzOiAnaHR0cHM6Ly9zdi53aWtpYm9va3Mub3JnJyxcbiAgc3Z3aWtpbmV3czogJ2h0dHBzOi8vc3Yud2lraW5ld3Mub3JnJyxcbiAgc3Z3aWtpcXVvdGU6ICdodHRwczovL3N2Lndpa2lxdW90ZS5vcmcnLFxuICBzdndpa2lzb3VyY2U6ICdodHRwczovL3N2Lndpa2lzb3VyY2Uub3JnJyxcbiAgc3Z3aWtpdmVyc2l0eTogJ2h0dHBzOi8vc3Yud2lraXZlcnNpdHkub3JnJyxcbiAgc3Z3aWtpdm95YWdlOiAnaHR0cHM6Ly9zdi53aWtpdm95YWdlLm9yZycsXG4gIHN3d2lraTogJ2h0dHBzOi8vc3cud2lraXBlZGlhLm9yZycsXG4gIHN3d2lrdGlvbmFyeTogJ2h0dHBzOi8vc3cud2lrdGlvbmFyeS5vcmcnLFxuICBzd3dpa2lib29rczogJ2h0dHBzOi8vc3cud2lraWJvb2tzLm9yZycsXG4gIHN6bHdpa2k6ICdodHRwczovL3N6bC53aWtpcGVkaWEub3JnJyxcbiAgdGF3aWtpOiAnaHR0cHM6Ly90YS53aWtpcGVkaWEub3JnJyxcbiAgdGF3aWt0aW9uYXJ5OiAnaHR0cHM6Ly90YS53aWt0aW9uYXJ5Lm9yZycsXG4gIHRhd2lraWJvb2tzOiAnaHR0cHM6Ly90YS53aWtpYm9va3Mub3JnJyxcbiAgdGF3aWtpbmV3czogJ2h0dHBzOi8vdGEud2lraW5ld3Mub3JnJyxcbiAgdGF3aWtpcXVvdGU6ICdodHRwczovL3RhLndpa2lxdW90ZS5vcmcnLFxuICB0YXdpa2lzb3VyY2U6ICdodHRwczovL3RhLndpa2lzb3VyY2Uub3JnJyxcbiAgdGV3aWtpOiAnaHR0cHM6Ly90ZS53aWtpcGVkaWEub3JnJyxcbiAgdGV3aWt0aW9uYXJ5OiAnaHR0cHM6Ly90ZS53aWt0aW9uYXJ5Lm9yZycsXG4gIHRld2lraWJvb2tzOiAnaHR0cHM6Ly90ZS53aWtpYm9va3Mub3JnJyxcbiAgdGV3aWtpcXVvdGU6ICdodHRwczovL3RlLndpa2lxdW90ZS5vcmcnLFxuICB0ZXdpa2lzb3VyY2U6ICdodHRwczovL3RlLndpa2lzb3VyY2Uub3JnJyxcbiAgdGV0d2lraTogJ2h0dHBzOi8vdGV0Lndpa2lwZWRpYS5vcmcnLFxuICB0Z3dpa2k6ICdodHRwczovL3RnLndpa2lwZWRpYS5vcmcnLFxuICB0Z3dpa3Rpb25hcnk6ICdodHRwczovL3RnLndpa3Rpb25hcnkub3JnJyxcbiAgdGd3aWtpYm9va3M6ICdodHRwczovL3RnLndpa2lib29rcy5vcmcnLFxuICB0aHdpa2k6ICdodHRwczovL3RoLndpa2lwZWRpYS5vcmcnLFxuICB0aHdpa3Rpb25hcnk6ICdodHRwczovL3RoLndpa3Rpb25hcnkub3JnJyxcbiAgdGh3aWtpYm9va3M6ICdodHRwczovL3RoLndpa2lib29rcy5vcmcnLFxuICB0aHdpa2luZXdzOiAnaHR0cHM6Ly90aC53aWtpbmV3cy5vcmcnLFxuICB0aHdpa2lxdW90ZTogJ2h0dHBzOi8vdGgud2lraXF1b3RlLm9yZycsXG4gIHRod2lraXNvdXJjZTogJ2h0dHBzOi8vdGgud2lraXNvdXJjZS5vcmcnLFxuICB0aXdpa2k6ICdodHRwczovL3RpLndpa2lwZWRpYS5vcmcnLFxuICB0aXdpa3Rpb25hcnk6ICdodHRwczovL3RpLndpa3Rpb25hcnkub3JnJyxcbiAgdGt3aWtpOiAnaHR0cHM6Ly90ay53aWtpcGVkaWEub3JnJyxcbiAgdGt3aWt0aW9uYXJ5OiAnaHR0cHM6Ly90ay53aWt0aW9uYXJ5Lm9yZycsXG4gIHRrd2lraWJvb2tzOiAnaHR0cHM6Ly90ay53aWtpYm9va3Mub3JnJyxcbiAgdGt3aWtpcXVvdGU6ICdodHRwczovL3RrLndpa2lxdW90ZS5vcmcnLFxuICB0bHdpa2k6ICdodHRwczovL3RsLndpa2lwZWRpYS5vcmcnLFxuICB0bHdpa3Rpb25hcnk6ICdodHRwczovL3RsLndpa3Rpb25hcnkub3JnJyxcbiAgdGx3aWtpYm9va3M6ICdodHRwczovL3RsLndpa2lib29rcy5vcmcnLFxuICB0bndpa2k6ICdodHRwczovL3RuLndpa2lwZWRpYS5vcmcnLFxuICB0bndpa3Rpb25hcnk6ICdodHRwczovL3RuLndpa3Rpb25hcnkub3JnJyxcbiAgdG93aWtpOiAnaHR0cHM6Ly90by53aWtpcGVkaWEub3JnJyxcbiAgdG93aWt0aW9uYXJ5OiAnaHR0cHM6Ly90by53aWt0aW9uYXJ5Lm9yZycsXG4gIHRwaXdpa2k6ICdodHRwczovL3RwaS53aWtpcGVkaWEub3JnJyxcbiAgdHBpd2lrdGlvbmFyeTogJ2h0dHBzOi8vdHBpLndpa3Rpb25hcnkub3JnJyxcbiAgdHJ3aWtpOiAnaHR0cHM6Ly90ci53aWtpcGVkaWEub3JnJyxcbiAgdHJ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly90ci53aWt0aW9uYXJ5Lm9yZycsXG4gIHRyd2lraWJvb2tzOiAnaHR0cHM6Ly90ci53aWtpYm9va3Mub3JnJyxcbiAgdHJ3aWtpbmV3czogJ2h0dHBzOi8vdHIud2lraW5ld3Mub3JnJyxcbiAgdHJ3aWtpcXVvdGU6ICdodHRwczovL3RyLndpa2lxdW90ZS5vcmcnLFxuICB0cndpa2lzb3VyY2U6ICdodHRwczovL3RyLndpa2lzb3VyY2Uub3JnJyxcbiAgdHN3aWtpOiAnaHR0cHM6Ly90cy53aWtpcGVkaWEub3JnJyxcbiAgdHN3aWt0aW9uYXJ5OiAnaHR0cHM6Ly90cy53aWt0aW9uYXJ5Lm9yZycsXG4gIHR0d2lraTogJ2h0dHBzOi8vdHQud2lraXBlZGlhLm9yZycsXG4gIHR0d2lrdGlvbmFyeTogJ2h0dHBzOi8vdHQud2lrdGlvbmFyeS5vcmcnLFxuICB0dHdpa2lib29rczogJ2h0dHBzOi8vdHQud2lraWJvb2tzLm9yZycsXG4gIHR0d2lraXF1b3RlOiAnaHR0cHM6Ly90dC53aWtpcXVvdGUub3JnJyxcbiAgdHVtd2lraTogJ2h0dHBzOi8vdHVtLndpa2lwZWRpYS5vcmcnLFxuICB0d3dpa2k6ICdodHRwczovL3R3Lndpa2lwZWRpYS5vcmcnLFxuICB0d3dpa3Rpb25hcnk6ICdodHRwczovL3R3Lndpa3Rpb25hcnkub3JnJyxcbiAgdHl3aWtpOiAnaHR0cHM6Ly90eS53aWtpcGVkaWEub3JnJyxcbiAgdHl2d2lraTogJ2h0dHBzOi8vdHl2Lndpa2lwZWRpYS5vcmcnLFxuICB1ZG13aWtpOiAnaHR0cHM6Ly91ZG0ud2lraXBlZGlhLm9yZycsXG4gIHVnd2lraTogJ2h0dHBzOi8vdWcud2lraXBlZGlhLm9yZycsXG4gIHVnd2lrdGlvbmFyeTogJ2h0dHBzOi8vdWcud2lrdGlvbmFyeS5vcmcnLFxuICB1Z3dpa2lib29rczogJ2h0dHBzOi8vdWcud2lraWJvb2tzLm9yZycsXG4gIHVnd2lraXF1b3RlOiAnaHR0cHM6Ly91Zy53aWtpcXVvdGUub3JnJyxcbiAgdWt3aWtpOiAnaHR0cHM6Ly91ay53aWtpcGVkaWEub3JnJyxcbiAgdWt3aWt0aW9uYXJ5OiAnaHR0cHM6Ly91ay53aWt0aW9uYXJ5Lm9yZycsXG4gIHVrd2lraWJvb2tzOiAnaHR0cHM6Ly91ay53aWtpYm9va3Mub3JnJyxcbiAgdWt3aWtpbmV3czogJ2h0dHBzOi8vdWsud2lraW5ld3Mub3JnJyxcbiAgdWt3aWtpcXVvdGU6ICdodHRwczovL3VrLndpa2lxdW90ZS5vcmcnLFxuICB1a3dpa2lzb3VyY2U6ICdodHRwczovL3VrLndpa2lzb3VyY2Uub3JnJyxcbiAgdWt3aWtpdm95YWdlOiAnaHR0cHM6Ly91ay53aWtpdm95YWdlLm9yZycsXG4gIHVyd2lraTogJ2h0dHBzOi8vdXIud2lraXBlZGlhLm9yZycsXG4gIHVyd2lrdGlvbmFyeTogJ2h0dHBzOi8vdXIud2lrdGlvbmFyeS5vcmcnLFxuICB1cndpa2lib29rczogJ2h0dHBzOi8vdXIud2lraWJvb2tzLm9yZycsXG4gIHVyd2lraXF1b3RlOiAnaHR0cHM6Ly91ci53aWtpcXVvdGUub3JnJyxcbiAgdXp3aWtpOiAnaHR0cHM6Ly91ei53aWtpcGVkaWEub3JnJyxcbiAgdXp3aWt0aW9uYXJ5OiAnaHR0cHM6Ly91ei53aWt0aW9uYXJ5Lm9yZycsXG4gIHV6d2lraWJvb2tzOiAnaHR0cHM6Ly91ei53aWtpYm9va3Mub3JnJyxcbiAgdXp3aWtpcXVvdGU6ICdodHRwczovL3V6Lndpa2lxdW90ZS5vcmcnLFxuICB2ZXdpa2k6ICdodHRwczovL3ZlLndpa2lwZWRpYS5vcmcnLFxuICB2ZWN3aWtpOiAnaHR0cHM6Ly92ZWMud2lraXBlZGlhLm9yZycsXG4gIHZlY3dpa3Rpb25hcnk6ICdodHRwczovL3ZlYy53aWt0aW9uYXJ5Lm9yZycsXG4gIHZlY3dpa2lzb3VyY2U6ICdodHRwczovL3ZlYy53aWtpc291cmNlLm9yZycsXG4gIHZlcHdpa2k6ICdodHRwczovL3ZlcC53aWtpcGVkaWEub3JnJyxcbiAgdml3aWtpOiAnaHR0cHM6Ly92aS53aWtpcGVkaWEub3JnJyxcbiAgdml3aWt0aW9uYXJ5OiAnaHR0cHM6Ly92aS53aWt0aW9uYXJ5Lm9yZycsXG4gIHZpd2lraWJvb2tzOiAnaHR0cHM6Ly92aS53aWtpYm9va3Mub3JnJyxcbiAgdml3aWtpcXVvdGU6ICdodHRwczovL3ZpLndpa2lxdW90ZS5vcmcnLFxuICB2aXdpa2lzb3VyY2U6ICdodHRwczovL3ZpLndpa2lzb3VyY2Uub3JnJyxcbiAgdml3aWtpdm95YWdlOiAnaHR0cHM6Ly92aS53aWtpdm95YWdlLm9yZycsXG4gIHZsc3dpa2k6ICdodHRwczovL3Zscy53aWtpcGVkaWEub3JnJyxcbiAgdm93aWtpOiAnaHR0cHM6Ly92by53aWtpcGVkaWEub3JnJyxcbiAgdm93aWt0aW9uYXJ5OiAnaHR0cHM6Ly92by53aWt0aW9uYXJ5Lm9yZycsXG4gIHZvd2lraWJvb2tzOiAnaHR0cHM6Ly92by53aWtpYm9va3Mub3JnJyxcbiAgdm93aWtpcXVvdGU6ICdodHRwczovL3ZvLndpa2lxdW90ZS5vcmcnLFxuICB3YXdpa2k6ICdodHRwczovL3dhLndpa2lwZWRpYS5vcmcnLFxuICB3YXdpa3Rpb25hcnk6ICdodHRwczovL3dhLndpa3Rpb25hcnkub3JnJyxcbiAgd2F3aWtpYm9va3M6ICdodHRwczovL3dhLndpa2lib29rcy5vcmcnLFxuICB3YXJ3aWtpOiAnaHR0cHM6Ly93YXIud2lraXBlZGlhLm9yZycsXG4gIHdvd2lraTogJ2h0dHBzOi8vd28ud2lraXBlZGlhLm9yZycsXG4gIHdvd2lrdGlvbmFyeTogJ2h0dHBzOi8vd28ud2lrdGlvbmFyeS5vcmcnLFxuICB3b3dpa2lxdW90ZTogJ2h0dHBzOi8vd28ud2lraXF1b3RlLm9yZycsXG4gIHd1dXdpa2k6ICdodHRwczovL3d1dS53aWtpcGVkaWEub3JnJyxcbiAgeGFsd2lraTogJ2h0dHBzOi8veGFsLndpa2lwZWRpYS5vcmcnLFxuICB4aHdpa2k6ICdodHRwczovL3hoLndpa2lwZWRpYS5vcmcnLFxuICB4aHdpa3Rpb25hcnk6ICdodHRwczovL3hoLndpa3Rpb25hcnkub3JnJyxcbiAgeGh3aWtpYm9va3M6ICdodHRwczovL3hoLndpa2lib29rcy5vcmcnLFxuICB4bWZ3aWtpOiAnaHR0cHM6Ly94bWYud2lraXBlZGlhLm9yZycsXG4gIHlpd2lraTogJ2h0dHBzOi8veWkud2lraXBlZGlhLm9yZycsXG4gIHlpd2lrdGlvbmFyeTogJ2h0dHBzOi8veWkud2lrdGlvbmFyeS5vcmcnLFxuICB5aXdpa2lzb3VyY2U6ICdodHRwczovL3lpLndpa2lzb3VyY2Uub3JnJyxcbiAgeW93aWtpOiAnaHR0cHM6Ly95by53aWtpcGVkaWEub3JnJyxcbiAgeW93aWt0aW9uYXJ5OiAnaHR0cHM6Ly95by53aWt0aW9uYXJ5Lm9yZycsXG4gIHlvd2lraWJvb2tzOiAnaHR0cHM6Ly95by53aWtpYm9va3Mub3JnJyxcbiAgemF3aWtpOiAnaHR0cHM6Ly96YS53aWtpcGVkaWEub3JnJyxcbiAgemF3aWt0aW9uYXJ5OiAnaHR0cHM6Ly96YS53aWt0aW9uYXJ5Lm9yZycsXG4gIHphd2lraWJvb2tzOiAnaHR0cHM6Ly96YS53aWtpYm9va3Mub3JnJyxcbiAgemF3aWtpcXVvdGU6ICdodHRwczovL3phLndpa2lxdW90ZS5vcmcnLFxuICB6ZWF3aWtpOiAnaHR0cHM6Ly96ZWEud2lraXBlZGlhLm9yZycsXG4gIHpod2lraTogJ2h0dHBzOi8vemgud2lraXBlZGlhLm9yZycsXG4gIHpod2lrdGlvbmFyeTogJ2h0dHBzOi8vemgud2lrdGlvbmFyeS5vcmcnLFxuICB6aHdpa2lib29rczogJ2h0dHBzOi8vemgud2lraWJvb2tzLm9yZycsXG4gIHpod2lraW5ld3M6ICdodHRwczovL3poLndpa2luZXdzLm9yZycsXG4gIHpod2lraXF1b3RlOiAnaHR0cHM6Ly96aC53aWtpcXVvdGUub3JnJyxcbiAgemh3aWtpc291cmNlOiAnaHR0cHM6Ly96aC53aWtpc291cmNlLm9yZycsXG4gIHpod2lraXZveWFnZTogJ2h0dHBzOi8vemgud2lraXZveWFnZS5vcmcnLFxuICB6aF9jbGFzc2ljYWx3aWtpOiAnaHR0cHM6Ly96aC1jbGFzc2ljYWwud2lraXBlZGlhLm9yZycsXG4gIHpoX21pbl9uYW53aWtpOiAnaHR0cHM6Ly96aC1taW4tbmFuLndpa2lwZWRpYS5vcmcnLFxuICB6aF9taW5fbmFud2lrdGlvbmFyeTogJ2h0dHBzOi8vemgtbWluLW5hbi53aWt0aW9uYXJ5Lm9yZycsXG4gIHpoX21pbl9uYW53aWtpYm9va3M6ICdodHRwczovL3poLW1pbi1uYW4ud2lraWJvb2tzLm9yZycsXG4gIHpoX21pbl9uYW53aWtpcXVvdGU6ICdodHRwczovL3poLW1pbi1uYW4ud2lraXF1b3RlLm9yZycsXG4gIHpoX21pbl9uYW53aWtpc291cmNlOiAnaHR0cHM6Ly96aC1taW4tbmFuLndpa2lzb3VyY2Uub3JnJyxcbiAgemhfeXVld2lraTogJ2h0dHBzOi8vemgteXVlLndpa2lwZWRpYS5vcmcnLFxuICB6dXdpa2k6ICdodHRwczovL3p1Lndpa2lwZWRpYS5vcmcnLFxuICB6dXdpa3Rpb25hcnk6ICdodHRwczovL3p1Lndpa3Rpb25hcnkub3JnJyxcbiAgenV3aWtpYm9va3M6ICdodHRwczovL3p1Lndpa2lib29rcy5vcmcnXG59O1xuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gc2l0ZV9tYXA7XG59XG4iLCIvL3R1cm5zIHdpa2ltZWRpYSBzY3JpcHQgaW50byBqc29uXG4vLyBodHRwczovL2dpdGh1Yi5jb20vc3BlbmNlcm1vdW50YWluL3d0Zl93aWtpcGVkaWFcbi8vQHNwZW5jZXJtb3VudGFpblxuY29uc3QgZmV0Y2ggPSByZXF1aXJlKCcuL2xpYi9mZXRjaF90ZXh0Jyk7XG5jb25zdCBwYXJzZSA9IHJlcXVpcmUoJy4vcGFyc2UnKTtcbmNvbnN0IGxhdGV4ICAgID0gcmVxdWlyZSgnLi9vdXRwdXQvbGF0ZXgnKTtcbmNvbnN0IG1hcmtkb3duID0gcmVxdWlyZSgnLi9vdXRwdXQvbWFya2Rvd24nKTtcbmNvbnN0IGh0bWwgICAgID0gcmVxdWlyZSgnLi9vdXRwdXQvaHRtbCcpO1xudmFyIFdpa2lDb252ZXJ0ID0gcmVxdWlyZSgnLi9saWIvd2lraWNvbnZlcnQnKTtcbnZhciB3aWtpY29udmVydCA9IG5ldyBXaWtpQ29udmVydCgpO1xuaWYgKHdpa2ljb252ZXJ0KSB7XG4gIGNvbnNvbGUubG9nKFwid2lraWNvbnZlcnQgZXhpc3RzXCIpO1xuICBpZiAod2lraWNvbnZlcnQucmVwbGFjZVdpa2lMaW5rcykge1xuICAgIGNvbnNvbGUubG9nKFwid2lraWNvbnZlcnQucmVwbGFjZVdpa2lMaW5rKCkgZXhpc3RzXCIpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKFwid2lraWNvbnZlcnQgZG9lcyBOT1QgZXhpc3RzXCIpO1xuICB9XG59IGVsc2Uge1xuICBjb25zb2xlLmxvZyhcIndpa2ljb252ZXJ0LnJlcGxhY2VXaWtpTGluaygpIGRvZXMgTk9UIGV4aXN0c1wiKTtcbn1cbmNvbnN0IHZlcnNpb24gPSByZXF1aXJlKCcuLi9wYWNrYWdlJykudmVyc2lvbjtcblxuLy91c2UgYSBnbG9iYWwgdmFyIGZvciBsYXp5IGN1c3RvbWl6YXRpb25cbmxldCBvcHRpb25zID0ge307XG5cbi8vZnJvbSBhIHBhZ2UgdGl0bGUgb3IgaWQsIGZldGNoIHRoZSB3aWtpc2NyaXB0XG5jb25zdCBmcm9tX2FwaSA9IGZ1bmN0aW9uKHBhZ2VfaWRlbnRpZmllciwgbGFuZ19vcl93aWtpaWQsIGNiKSB7XG4gIGlmICh0eXBlb2YgbGFuZ19vcl93aWtpaWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYiA9IGxhbmdfb3Jfd2lraWlkO1xuICAgIGxhbmdfb3Jfd2lraWlkID0gJ2VuJztcbiAgfVxuICBjYiA9IGNiIHx8IGZ1bmN0aW9uKCkge307XG4gIGxhbmdfb3Jfd2lraWlkID0gbGFuZ19vcl93aWtpaWQgfHwgJ2VuJztcbiAgaWYgKCFmZXRjaCkge1xuICAgIC8vbm8gaHR0cCBtZXRob2QsIG9uIHRoZSBjbGllbnQgc2lkZVxuICAgIHJldHVybiBjYihudWxsKTtcbiAgfTtcbiAgdmFyIG1hcmt1cCA9IGZldGNoKHBhZ2VfaWRlbnRpZmllciwgbGFuZ19vcl93aWtpaWQsIGNiKTtcbiAgdmFyIHZMYW5ndWFnZSA9IGxhbmdfb3Jfd2lraWlkLnN1YnN0cigwLDIpO1xuICB2YXIgdkRvbWFpbiA9IFwid2lraXBlZGlhXCI7XG4gIGlmIChsYW5nX29yX3dpa2lpZC5sZW5ndGggPiAyKSB7XG4gICAgdkRvbWFpbiA9IGxhbmdfb3Jfd2lraWlkLnN1YnN0cigyLGxhbmdfb3Jfd2lraWlkLmxlbmd0aCk7XG4gICAgaWYgKHZEb21haW4gPT0gXCJ3aWtpXCIpICB7XG4gICAgICB2RG9tYWluID09IFwid2lraXBlZGlhXCI7XG4gICAgfTtcbiAgfTtcbiAgdmFyIHZEb2NKU09OID0ge307XG4gIC8vd2lraWNvbnZlcnQuaW5pdChcImVuXCIsXCJ3aWtpdmVyc3RpeVwiLHZEb2NKU09OKTtcbiAgY29uc29sZS5sb2coXCJMYW5ndWFnZT1cIit2TGFuZ3VhZ2UrXCIgRG9tYWluPVwiK3ZEb21haW4pO1xuICAvL2NvbnNvbGUubG9nKG1hcmt1cCk7XG4gIHJldHVybiBtYXJrdXA7XG59O1xuXG4vL3R1cm4gd2lraS1tYXJrdXAgaW50byBhIG5pY2VseS1mb3JtYXR0ZWQgdGV4dFxuY29uc3QgcGxhaW50ZXh0ID0gZnVuY3Rpb24oc3RyLCBvcHRpb25zUCkge1xuICBvcHRpb25zUCA9IG9wdGlvbnNQID09PSB1bmRlZmluZWQgPyBvcHRpb25zIDogb3B0aW9uc1A7XG4gIGxldCBkYXRhID0gcGFyc2Uoc3RyLCBvcHRpb25zUCkgfHwge307XG4gIGRhdGEuc2VjdGlvbnMgPSBkYXRhLnNlY3Rpb25zIHx8IFtdO1xuICBsZXQgYXJyID0gZGF0YS5zZWN0aW9ucy5tYXAoZCA9PiB7XG4gICAgcmV0dXJuIGQuc2VudGVuY2VzLm1hcChhID0+IGEudGV4dCkuam9pbignICcpO1xuICB9KTtcbiAgcmV0dXJuIGFyci5qb2luKCdcXG5cXG4nKTtcbn07XG5cbmNvbnN0IGN1c3RvbWl6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICBvcHRpb25zLmN1c3RvbSA9IG9iajtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBmcm9tX2FwaTogZnJvbV9hcGksXG4gIHBsYWludGV4dDogcGxhaW50ZXh0LFxuICBtYXJrZG93bjogbWFya2Rvd24sXG4gIGh0bWw6IGh0bWwsXG4gIGxhdGV4OiBsYXRleCxcbiAgdmVyc2lvbjogdmVyc2lvbixcbiAgY3VzdG9tOiBjdXN0b21pemUsXG4gIHdpa2ljb252ZXJ0OiB3aWtpY29udmVydCxcbiAgcGFyc2U6IChzdHIsIG9iaikgPT4ge1xuICAgIG9iaiA9IG9iaiB8fCB7fTtcbiAgICBvYmogPSBPYmplY3QuYXNzaWduKG9iaiwgb3B0aW9ucyk7IC8vZ3JhYiAnY3VzdG9tJyBwZXJzaXN0ZW50IG9wdGlvbnNcbiAgICByZXR1cm4gcGFyc2Uoc3RyLCBvYmopO1xuICB9XG59O1xuIiwiLy9jb252ZXJ0cyBETVMgKGRlY2ltYWwtbWludXRlLXNlY29uZCkgZ2VvIGZvcm1hdCB0byBsYXQvbG5nIGZvcm1hdC5cbi8vbWFqb3IgdGhhbmsgeW91IHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9nbWFjbGVubmFuL3BhcnNlLWRtc1xuLy9hbmQgaHR0cHM6Ly9naXRodWIuY29tL1dTRE9ULUdJUy9kbXMtanMg8J+Rj1xuXG4vL2FjY2VwdHMgYW4gYXJyYXkgb2YgZGVzY2VuZGluZyBEZWdyZWUsIE1pbnV0ZSwgU2Vjb25kIHZhbHVlcywgd2l0aCBhIGhlbWlzcGhlcmUgYXQgdGhlIGVuZFxuLy9tdXN0IGhhdmUgTi9TL0UvVyBhcyBsYXN0IHRoaW5nXG5mdW5jdGlvbiBwYXJzZURtcyhhcnIpIHtcbiAgbGV0IGhlbWlzcGhlcmUgPSBhcnIucG9wKCk7XG4gIHZhciBkZWdyZWVzID0gTnVtYmVyKGFyclswXSB8fCAwKTtcbiAgdmFyIG1pbnV0ZXMgPSBOdW1iZXIoYXJyWzFdIHx8IDApO1xuICB2YXIgc2Vjb25kcyA9IE51bWJlcihhcnJbMl0gfHwgMCk7XG4gIGlmICh0eXBlb2YgaGVtaXNwaGVyZSAhPT0gJ3N0cmluZycgfHwgaXNOYU4oZGVncmVlcykpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgc2lnbiA9IDE7XG4gIGlmICgvW1NXXS9pLnRlc3QoaGVtaXNwaGVyZSkpIHtcbiAgICBzaWduID0gLTE7XG4gIH1cbiAgbGV0IGRlY0RlZyA9IHNpZ24gKiAoZGVncmVlcyArIG1pbnV0ZXMgLyA2MCArIHNlY29uZHMgLyAzNjAwKTtcbiAgcmV0dXJuIGRlY0RlZztcbn1cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VEbXM7XG4vLyBjb25zb2xlLmxvZyhwYXJzZURtcyhbNTcsIDE4LCAyMiwgJ04nXSkpO1xuLy8gY29uc29sZS5sb2cocGFyc2VEbXMoWzQsIDI3LCAzMiwgJ1cnXSkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy9ncmFiIHRoZSBjb250ZW50IG9mIGFueSBhcnRpY2xlLCBvZmYgdGhlIGFwaVxuY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKTtcbmNvbnN0IHNpdGVfbWFwID0gcmVxdWlyZSgnLi4vZGF0YS9zaXRlX21hcCcpO1xuY29uc3QgcmVkaXJlY3RzID0gcmVxdWlyZSgnLi4vcGFyc2UvcGFnZS9yZWRpcmVjdHMnKTtcblxuY29uc3QgZmV0Y2ggPSBmdW5jdGlvbihwYWdlX2lkZW50aWZpZXIsIGxhbmdfb3Jfd2lraWlkLCBjYikge1xuICBsYW5nX29yX3dpa2lpZCA9IGxhbmdfb3Jfd2lraWlkIHx8ICdlbic7XG4gIHZhciBpZGVudGlmaWVyX3R5cGUgPSAndGl0bGVzJztcbiAgaWYgKHBhZ2VfaWRlbnRpZmllci5tYXRjaCgvXlswLTldKiQvKSAmJiBwYWdlX2lkZW50aWZpZXIubGVuZ3RoID4gMykge1xuICAgIGlkZW50aWZpZXJfdHlwZSA9ICdjdXJpZCc7XG4gIH1cbiAgbGV0IHVybDtcbiAgaWYgKHNpdGVfbWFwW2xhbmdfb3Jfd2lraWlkXSkge1xuICAgIHVybCA9IHNpdGVfbWFwW2xhbmdfb3Jfd2lraWlkXSArICcvdy9hcGkucGhwJztcbiAgfSBlbHNlIHtcbiAgICB1cmwgPSAnaHR0cHM6Ly8nICsgbGFuZ19vcl93aWtpaWQgKyAnLndpa2lwZWRpYS5vcmcvdy9hcGkucGhwJztcbiAgfVxuICAvL3dlIHVzZSB0aGUgJ3JldmlzaW9ucycgYXBpIGhlcmUsIGluc3RlYWQgb2YgdGhlIFJhdyBhcGksIGZvciBpdHMgQ09SUy1ydWxlcy4uXG4gIHVybCArPSAnP2FjdGlvbj1xdWVyeSZwcm9wPXJldmlzaW9ucyZydmxpbWl0PTEmcnZwcm9wPWNvbnRlbnQmZm9ybWF0PWpzb24mb3JpZ2luPSonO1xuICB1cmwgKz0gJyYnICsgaWRlbnRpZmllcl90eXBlICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhZ2VfaWRlbnRpZmllcik7XG5cbiAgcmVxdWVzdC5nZXQodXJsKS5lbmQoZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICBpZiAoZXJyIHx8ICFyZXMuYm9keS5xdWVyeSkge1xuICAgICAgY29uc29sZS53YXJuKGVycik7XG4gICAgICBjYihudWxsKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHBhZ2VzID0gKHJlcyAmJiByZXMuYm9keSAmJiByZXMuYm9keS5xdWVyeSkgPyByZXMuYm9keS5xdWVyeS5wYWdlcyA6IHt9O1xuICAgIHZhciBpZCA9IE9iamVjdC5rZXlzKHBhZ2VzKVswXTtcbiAgICBpZiAoaWQpIHtcbiAgICAgIHZhciBwYWdlID0gcGFnZXNbaWRdO1xuICAgICAgaWYgKHBhZ2UgJiYgcGFnZS5yZXZpc2lvbnMgJiYgcGFnZS5yZXZpc2lvbnNbMF0pIHtcbiAgICAgICAgdmFyIHRleHQgPSBwYWdlLnJldmlzaW9uc1swXVsnKiddO1xuICAgICAgICBpZiAocmVkaXJlY3RzLmlzX3JlZGlyZWN0KHRleHQpKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IHJlZGlyZWN0cy5wYXJzZV9yZWRpcmVjdCh0ZXh0KTtcbiAgICAgICAgICBmZXRjaChyZXN1bHQucmVkaXJlY3QsIGxhbmdfb3Jfd2lraWlkLCBjYik7IC8vcmVjdXJzaXZlXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNiKHRleHQscGFnZV9pZGVudGlmaWVyLGxhbmdfb3Jfd2lraWlkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNiKG51bGwpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZldGNoO1xuXG4vLyBmZXRjaCgnT25fQV9GcmlkYXknLCAnZW4nLCBmdW5jdGlvbihyKSB7IC8vICdhZndpa2knXG4vLyAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHIsIG51bGwsIDIpKTtcbi8vIH0pO1xuIiwidmFyIGhlbHBlcnMgPSB7XG4gIGNhcGl0YWxpc2U6IGZ1bmN0aW9uKHN0cikge1xuICAgIGlmIChzdHIgJiYgdHlwZW9mIHN0ciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfSxcbiAgb25seVVuaXF1ZTogZnVuY3Rpb24odmFsdWUsIGluZGV4LCBzZWxmKSB7XG4gICAgcmV0dXJuIHNlbGYuaW5kZXhPZih2YWx1ZSkgPT09IGluZGV4O1xuICB9LFxuICB0cmltX3doaXRlc3BhY2U6IGZ1bmN0aW9uKHN0cikge1xuICAgIGlmIChzdHIgJiYgdHlwZW9mIHN0ciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9eXFxzXFxzKi8sICcnKTtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9cXHNcXHMqJC8sICcnKTtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8gezJ9LywgJyAnKTtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9cXHMsIC8sICcsICcpO1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBoZWxwZXJzO1xuIiwiLy9maW5kIGFsbCB0aGUgcGFpcnMgb2YgJ1tbLi4uW1suLl1dLi4uXV0nIGluIHRoZSB0ZXh0XG4vL3VzZWQgdG8gcHJvcGVybHkgcm9vdCBvdXQgcmVjdXJzaXZlIHRlbXBsYXRlIGNhbGxzLCBbWy4uIFtbLi4uXV0gXV1cbi8vYmFzaWNhbGx5IGp1c3QgYWRkcyBvcGVuIHRhZ3MsIGFuZCBzdWJ0cmFjdHMgY2xvc2luZyB0YWdzXG5mdW5jdGlvbiBmaW5kX3JlY3Vyc2l2ZShvcGVuZXIsIGNsb3NlciwgdGV4dCkge1xuICB2YXIgb3V0ID0gW107XG4gIHZhciBsYXN0ID0gW107XG4gIHZhciBjaGFycyA9IHRleHQuc3BsaXQoJycpO1xuICB2YXIgb3BlbiA9IDA7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAvL2luY3JpbWVudCBvcGVuIHRhZ1xuICAgIGlmIChjaGFyc1tpXSA9PT0gb3BlbmVyKSB7XG4gICAgICBvcGVuICs9IDE7XG4gICAgfVxuICAgIC8vZGVjcmVtZW50IGNsb3NlIHRhZ1xuICAgIGlmIChjaGFyc1tpXSA9PT0gY2xvc2VyKSB7XG4gICAgICBvcGVuIC09IDE7XG4gICAgICBpZiAob3BlbiA8IDApIHtcbiAgICAgICAgb3BlbiA9IDA7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvcGVuID49IDApIHtcbiAgICAgIGxhc3QucHVzaChjaGFyc1tpXSk7XG4gICAgfVxuICAgIGlmIChvcGVuID09PSAwICYmIGxhc3QubGVuZ3RoID4gMCkge1xuICAgICAgLy9maXJzdCwgZml4IGJvdGNoZWQgcGFyc2VcbiAgICAgIHZhciBvcGVuX2NvdW50ID0gbGFzdC5maWx0ZXIoZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcyA9PT0gb3BlbmVyO1xuICAgICAgfSk7XG4gICAgICB2YXIgY2xvc2VfY291bnQgPSBsYXN0LmZpbHRlcihmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiBzID09PSBjbG9zZXI7XG4gICAgICB9KTtcbiAgICAgIC8vaXMgaXQgYm90Y2hlZD9cbiAgICAgIGlmIChvcGVuX2NvdW50Lmxlbmd0aCA+IGNsb3NlX2NvdW50Lmxlbmd0aCkge1xuICAgICAgICBsYXN0LnB1c2goY2xvc2VyKTtcbiAgICAgIH1cbiAgICAgIC8vbG9va3MgZ29vZCwga2VlcCBpdFxuICAgICAgb3V0LnB1c2gobGFzdC5qb2luKCcnKSk7XG4gICAgICBsYXN0ID0gW107XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRfcmVjdXJzaXZlO1xuXG4vLyBjb25zb2xlLmxvZyhmaW5kX3JlY3Vyc2l2ZSgneycsICd9JywgJ2hlIGlzIHByZXNpZGVudC4ge3tub3dyYXB8e3tzbWFsbHwoMTk5NeKAk3ByZXNlbnQpfX19fSBoZSBsaXZlcyBpbiB0ZXhhcycpKTtcbi8vIGNvbnNvbGUubG9nKGZpbmRfcmVjdXJzaXZlKFwie1wiLCBcIn1cIiwgXCJ0aGlzIGlzIGZ1biB7e25vd3JhcHt7c21hbGwxOTk14oCTcHJlc2VudH19fX0gYW5kIGl0IHdvcmtzXCIpKVxuIiwiLy8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuLy8jIEphdmFzY3JpcHQgQ2xhc3M6IFdpa2lDb252ZXJ0KClcbi8vIyAgICAgICBTdXBlckNsYXNzOlxuLy8jICAgQ2xhc3MgRmlsZW5hbWU6IHdpa2ljb252ZXJ0LmpzXG4vLyNcbi8vIyBBdXRob3Igb2YgQ2xhc3M6ICAgICAgRW5nZWxiZXJ0IE5pZWhhdXNcbi8vIyBlbWFpbDogICAgICAgICAgICAgICAgbmllaGF1c0B1bmktbGFuZGF1LmRlXG4vLyMgY3JlYXRlZCAgICAgICAgICAgICAgIDIxLjEuMjAxOFxuLy8jIGxhc3QgbW9kaWZpY2F0aW9ucyAgICAyMDE4LzAxLzIxIDE3OjE3OjE4XG4vLyMgR05VIFB1YmxpYyBMaWNlbnNlIFYzIC0gT3BlblNvdXJjZVxuLy8jXG4vLyMgY3JlYXRlZCB3aXRoIEphdmFTY3JpcHQgQ2xhc3MgQ3JlYXRvciBKU0NDXG4vLyMgICAgIGh0dHBzOi8vbmllYmVydC5naXRodWIuaW8vSmF2YXNjcmlwdENsYXNzR2VuZXJhdG9yXG4vLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgXHQvKlxuICBcdFRoaXMgTGlicmFyeSB3YXMgY3JlYXRlZCB3aXRoIEphdmFzY3JpcHRDbGFzc0NyZWF0b3JcbiAgXHRodHRwczovL25pZWJlcnQuZ2l0aHViLmlvL0phdmFzY3JpcHRDbGFzc0NyZWF0b3JcbiAgXHRUaGUgbGlicmFyeSBpcyBiYXNlZCBvbiAgd2lraTJIVE1MIGxpYnJhcnkgb2YgRWxpYSBDb250aW5pXG4gIFx0cHVibGlzZWQgdW5kZXIgR1BMLlxuICBcdFBhcnNlcyB3aWtpIG1hcmt1cCBhbmQgZ2VuZXJhdGVzIEhUTUwgNSBzaG93aW5nIGEgcHJldmlldy5cbiAgICAgIENvcHlyaWdodCAoQykgMjAxMC0yMDEzIEVsaWEgQ29udGluaVxuXG4gICAgICBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICAgICAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAgICAgIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gICAgICBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuICAgICAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gICAgICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICAgICAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICAgICAgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICAgICAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgICAgIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiBJZiBub3QsIHNlZSBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvLlxuICAgKi9cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vLS0tU3RvcmUgRmlsZSBpbiBTdWJkaXJlY3RvcnkgL2pzIGFuZCBpbXBvcnQgdGhpcyBDbGFzcyBpbiBIVE1MLUZpbGUgd2l0aFxuLy8gU0NSSVBULVRhZzogIExBTkdVQUdFPVwiSmF2YVNjcmlwdFwiIFNSQz1cImpzL3dpa2ljb252ZXJ0LmpzXCJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLy0tLUNvbnN0cnVjdG9yIG9mIENsYXNzIFdpa2lDb252ZXJ0KClcbi8vIENhbGwgdGhlIGNvbnN0cnVjdG9yIGZvciBjcmVhdGluZyBhbiBpbnN0YW5jZSBvZiBjbGFzcyBXaWtpQ29udmVydFxuLy8gYnkgdGhlIGZvbGxvd2luZyBjb21tYW5kIGluIEhUTUwtZmlsZSB0aGF0IGltcG9ydHMgdGhpcyBjbGFzc1xuLy8gdmFyIHZNeUluc3RhbmNlID0gbmV3IFdpa2lDb252ZXJ0KCk7XG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8tLS0tQXR0cmlidXRlcy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJZiB5b3Ugd2FudCB0byBhY2Nlc3MgdGhlIGF0dHJpYnV0ZXMgb2YgV2lraUNvbnZlcnQsIHVzZVxuLy8gdGhlIGF0dHJpYnV0ZSBuYW1lIHdpdGggYSBsZWFkaW5nIFwidGhpcy5cIiBpbiB0aGUgZGVmaW5pdGlvbiBvZiBtZXRob2Qgb2YgV2lraUNvbnZlcnQsIGUuZy5cbi8vIHRoaXMuYU5hbWUgPSBcIkhlbGxvIFdvcmxkXCI7XG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8tLS0tTWV0aG9kcy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAoMSkgSWYgeW91IHdhbnQgdG8gYXNzaWduIGRlZmluaXRpb25zIG9mIG1ldGhvZHMgZm9yIHNpbmdsZSBpbnN0YW5jZSBvZiB0aGUgY2xhc3MgJ1dpa2lDb252ZXJ0J1xuLy8gdGhleSBhcmUgZGVmaW5lZCB3aXRoXG4vLyAgICB0aGlzLm15X21ldGhvZCA9IGZ1bmN0aW9uIChwUGFyMSxwUGFyMilcbi8vIHRoaXMgYXBwcm9hY2ggYWxsb3dzIHRvIG92ZXJ3cml0ZSB0aGUgbWV0aG9kIGRlZmluaXRpb24gb2Ygc2luZ2xlIGluc3RhbmNlcyBkeW5hbWljYWxseS5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyAoMikgQSBwcm90b3R5cGUgZGVmaW5pdGlvbiBvZiBtZXRob2RzIGZvciAnV2lraUNvbnZlcnQnIHdpbGwgYmUgc2V0IGJ5XG4vLyB1c2UgdGhlIG1ldGhvZCdzIG5hbWUgYW5kIGV4dGVuZCBpdCB3aXRoICdXaWtpQ29udmVydCcuXG4vLyAgICBXaWtpQ29udmVydC5wcm90b3R5cGUubXlfbWV0aG9kID0gZnVuY3Rpb24gKHBQYXIxLHBQYXIyKVxuLy8gVGhpcyBhcHByb2FjaCBjb25zdW1lcyBsZXNzIG1lbW9yeSBmb3IgaW5zdGFuY2VzLlxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHQvLyBubyBzdXBlcmNsYXNzIGRlZmluZWRcblxuXG5mdW5jdGlvbiBXaWtpQ29udmVydCAoKSB7XG5cdC8vIG5vIHN1cGVyY2xhc3MgZGVmaW5lZFxuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vLS0tQXR0cmlidXRlcyBvZiBDbGFzcyBcIldpa2lDb252ZXJ0KClcIlxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLy0tLVBVQkxJQzogYVByb2plY3REaXIgKFN0cmluZyk6IHRoZSBhdHRyaWJ1dGUgJ2FQcm9qZWN0RGlyJyBzdG9yZXMgaW4gJ1N0cmluZycgdGhlIHJlbGF0aXZlIHBhdGggaW4gdGhlIFBhbkRvYyByb290IGRpcmVjdG9yeVxuXHR0aGlzLmFXaWtpVGl0bGUgPSBcIlN3YXJtIGludGVsbGlnZW5jZVwiO1xuXHQvLy0tLVBVQkxJQzogYVByb2plY3REaXIgKFN0cmluZyk6IHRoZSBhdHRyaWJ1dGUgJ2FQcm9qZWN0RGlyJyBzdG9yZXMgaW4gJ1N0cmluZycgdGhlIHJlbGF0aXZlIHBhdGggaW4gdGhlIFBhbkRvYyByb290IGRpcmVjdG9yeVxuXHR0aGlzLmFQcm9qZWN0RGlyID0gXCJkZW1vL215X2FydGljbGVcIjtcblx0Ly8tLS1QVUJMSUM6IGFSZW1vdGVNZWRpYSAoQm9vbGVhbik6IHRoZSBhdHRyaWJ1dGUgJ2FSZW1vdGVNZWRpYScgc3RvcmVzIGluICdCb29sZWFuJyB2YXJpYWJsZSBpZiB0aGUgTWVkaWFMaW5rcyBhcmUgc3RvcmVkIGluIHRoZSBsb2NhbCBmaWxlIHN5c3RlbSBvZiByZWZlcmVuY2VkIHRvIHJlbW90ZSBNZWRpYSBTZXJ2ZXJcblx0dGhpcy5hUmVtb3RlTWVkaWEgPSBmYWxzZTtcblx0Ly8tLS1QVUJMSUM6IGFMYW5ndWFnZSBJRCAoU3RyaW5nKTogZGVmaW5lcyB0aGUgTGFuZ3VhZ2Ugb2YgdGhlIE1lZGlhV2lraVxuXHR0aGlzLmFMYW5ndWFnZSA9IFwiZW5cIjtcblx0Ly8tLS1QVUJMSUM6IGFEb21haW4oU3RyaW5nKTogZGVmaW5lcyB0aGUgTWVkaWFXaWtpIHByb2R1Y3Qgb2YgV2lraSBGb3VuZGF0aW9uIFwid2lraXZlcnNpdHlcIiwgXCJ3aWtpcGVkaWFcIiwgLi5cblx0dGhpcy5hRG9tYWluID0gXCJ3aWtpdmVyc2l0eVwiO1xuXHQvLy0tLVBVQkxJQzogYVRPQyBzdG9yZWQgdGhlIFRPQyBUYWJsZSBvZiBDb250ZW50cyBwYXJzZWQgZnJvbSB0aGUgc2VjdGlvbiBzdHJ1Y3R1cmUgb2YgdGhlIFdpa2kvSE1UTCBmaWxlXG5cdHRoaXMuYVRPQyA9IFtdO1xuXHR0aGlzLmFJbnNlcnRUT0MgPSB0cnVlOyAvLyB3aWxsIGJlIGluc2VydGVkIGluIHNlY3Rpb25zXG5cdC8vLS0tUFVCTElDOiBhU2VydmVyIGlzIHNldCB3aXRoIHRoZSBpbml0KHBMYW5ndWFnZSxwRG9tYWluKSB0b2dldGhlciB3aXRoIGFMYW5ndWFnZSBhbmQgYURvbWFpblxuXHR0aGlzLmFTZXJ2ZXIgPSBcImh0dHBzOi8vZW4ud2lraXZlcnNpdHkub3JnL3dpa2kvXCI7XG5cdC8vLS0tUFVCTElDOiBhTWVkaWFQYXRoIGlzIHVzZWQgZm9yIGRvd25sb2FkaW5nIHRoZSBlbWJlZGRlZCBpbWFnZSByZXNwLiB0aGUgcmVmZXJlbmNpbmcgdGhlIGltYWdlcyBpbiB0aGUgSFRNTFxuXHR0aGlzLmFNZWRpYVBhdGggPSBcImh0dHBzOi8vZW4ud2lraXZlcnNpdHkub3JnL3dpa2kvU3BlY2lhbDpSZWRpcmVjdC9maWxlL1wiO1xuXHQvLy0tLVBVQkxJQzogYURvY0pTT04gaXMgYSBIYXNoIHRoYXQgY29sbGVjdHMgdGhlIGRhdGEgd2hpbGUgcGFyc2luZyB0aGUgdldpa2lDb2RlIGdlbmVyYXRlZCBieSB3dGZfd2lraXBlZGlhLmpzIHNldCBieSBpbml0KCktY2FsbFxuXHR0aGlzLmFEb2NKU09OID0ge307XG5cdC8vIGRlcHJpY2F0ZWQgcmVwbGFjZWQgYnkgYURvY0pTT05cblx0dGhpcy5hUGFyc2VKU09OID0ge307XG5cdC8vLS0tUFVCTElDOiBhRGVmYXVsdEltYWdlV2lkdGggaXMgdXNlZCBpZiB3aWR0aCBvZiB0aGUgaW1hZ2UgaW4gbm90IGRlZmluZWRcblx0dGhpcy5hRGVmYXVsdEltYWdlV2lkdGggPSAzMDA7XG5cblx0dGhpcy5hTWFwID0ge307XG5cdHRoaXMuYU1hcFtcIndcIl0gPSBcIndpa2lwZWRpYVwiO1xuXHR0aGlzLmFNYXBbXCJ3aWtpcGVkaWFcIl0gPSBcIndpa2lwZWRpYVwiO1xuXHR0aGlzLmFNYXBbXCJXaWtpcGVkaWFcIl0gPSBcIndpa2lwZWRpYVwiO1xuXHR0aGlzLmFNYXBbXCJ2XCJdID0gXCJ3aWtpdmVyc2l0eVwiO1xuXHR0aGlzLmFNYXBbXCJ3aWtpdmVyc2l0eVwiXSA9IFwid2lraXZlcnNpdHlcIjtcblx0dGhpcy5hTWFwW1wiV2lraXZlcnNpdHlcIl0gPSBcIndpa2l2ZXJzaXR5XCI7XG5cdHRoaXMuYU1hcFtcImJcIl0gPSBcIndpa2lib29rc1wiO1xuXHR0aGlzLmFNYXBbXCJ3aWtpYm9va3NcIl0gPSBcIndpa2lib29rc1wiO1xuXHR0aGlzLmFNYXBbXCJXaWtpYm9va3NcIl0gPSBcIndpa2lib29rc1wiO1xuXG5cdHRoaXMuYUZpbGVQcmVmaXggPSB7fTtcblx0dGhpcy5hRmlsZVByZWZpeFtcIkZpbGVcIl0gPSBcIkZpbGVcIjtcblx0dGhpcy5hRmlsZVByZWZpeFtcImZpbGVcIl0gPSBcIkZpbGVcIjtcblx0dGhpcy5hRmlsZVByZWZpeFtcIkRhdGVpXCJdID0gXCJGaWxlXCI7XG5cdHRoaXMuYUZpbGVQcmVmaXhbXCJJbWFnZVwiXSA9IFwiRmlsZVwiO1xuXG5cdHRoaXMuYU1lZGlhQXJyYXkgPSBbXTtcblx0Ly90aGlzLmFUcGxFbmdpbmUgPSBuZXcgVGVtcGxhdGVFbmdpbmUoKTtcblxuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vLS0tTWV0aG9kcyBvZiBDbGFzcyBcIldpa2lDb252ZXJ0KClcIlxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQvLy0tLS1QVUJMSUMgTWV0aG9kOiBXaWtpQ29udmVydC5pbml0KHBMYW5ndWFnZSxwRG9tYWluLHBEb2NKU09OKVxuXHQvLyBpbml0IGEgY29udmVydGVyIHdpdGggdGhlIGxhbmd1YWdlIFwiZW5cIiBhbmQgYSBkb21haW4gXCJ3aWtpdmVyc2l0eVwiIG9yIFwid2lraXBlZGlhXCJcblx0Ly8tLS0tUFVCTElDIE1ldGhvZDogV2lraUNvbnZlcnQuaW5pdEFydGljbGUocFdpa2lUaXRsZTpTdHJpbmcpXG5cdC8vIGluaXQgdGhlIFdpa2lDb252ZXJ0ZXIgd2l0aCBhIHNwZWNpZmljIGFydGljbGUgV2lraSBQYWdlIElkZW50aWZpZXJcblx0Ly8tLS0tUFVCTElDIE1ldGhvZDogV2lraUNvbnZlcnQuY29udmVydChwV2lraUNvZGU6U3RyaW5nKTpTdHJpbmctLS0tLVxuXHQvLyBjb252ZXJ0KHBXaWtpQ29kZSkgIFJldHVybjogU3RyaW5nXG5cdC8vXHRjb252ZXJ0cyB0aGUgTWVkaWFXaWtpIGNvZGUgaW4gYXJndW1lbnQgYW5kIHJldHVybnMgYSBjb3JyZWN0ZWQgc3RyaW5nXG5cdC8vICB0aGF0IGNvcnJlY3QgbG9jYWwgaW1hZ2UgYW5kIHdpa2kgbGlua3MgaW50byByZW1vdGUgbGlua3MgYW5kIHJlbW90ZWx5IGVtYmVkZGVkIGltYWdlc1xuXHQvLy0tLS1QVUJMSUMgTWV0aG9kOiBXaWtpQ29udmVydC5jbGVhbl9zb3VyY2UocFdpa2lDb2RlOlN0cmluZyk6U3RyaW5nLS0tLS1cblx0Ly8gY2xlYW5fc291cmNlKHBXaWtpQ29kZSkgIFJldHVybjogU3RyaW5nXG5cdC8vXHRjbGVhbl9zb3VyY2UocFdpa2lDb2RlKSBub3JtYWxpemVzIGxpbmUgYnJlYWtzIGluIG9yZGVyIHRvIGhhdmUgYSBjb21tb24gYmFzZSBzdHJpbmcgZm9yIGFsbCBicm93c2Vycy5cblx0Ly9cdGNsZWFuX3NvdXJjZSgpIHVzZXMgdGhlIE1lZGlhV2lraSBzb3VyY2UgY29kZSBgcFdpa2lDb2RlYCBmcm9tIHRoZSBwYXJhbWV0ZXIgb2YgdGhlIGZ1bmN0aW9uIGFuZCByZXR1cm5zIGEgSFRNTCBzdHJpbmdcblx0Ly9cdGFmdGVyIHJlbW92aW5nIGFsbCBDUnMuXG5cdC8vLS0tLVBVQkxJQyBNZXRob2Q6IFdpa2lDb252ZXJ0LnNlY3Rpb25zKHBXaWtpQ29kZTpTdHJpbmcpOlN0cmluZy0tLS0tXG5cdC8vIHNlY3Rpb25zKHBXaWtpQ29kZSkgIFJldHVybjogU3RyaW5nXG5cdC8vXHRDb252ZXJ0IGFsbCBzZWN0aW9ucyBpbiBXaWtpIHNvdXJjZSBjb2RlXG5cdC8vLS0tLVBVQkxJQyBNZXRob2Q6IFdpa2lDb252ZXJ0Lmhvcml6b250YWxSdWxlKHBXaWtpQ29kZTpTdHJpbmcpOlN0cmluZy0tLS0tXG5cdC8vIGhvcml6b250YWxSdWxlKHBXaWtpQ29kZSkgIFJldHVybjogU3RyaW5nXG5cdC8vXHRDb252ZXJ0IHRoZSAgaG9yaXpvbnRhbCBydWxlcyBpbiBXaWtpIHNvdXJjZSBjb2RlXG5cdC8vLS0tLVBVQkxJQyBNZXRob2Q6IFdpa2lDb252ZXJ0LmlubGluZUVsZW1lbnQocFdpa2lDb2RlOlN0cmluZyk6U3RyaW5nLS0tLS1cblx0Ly8gaW5saW5lRWxlbWVudChwV2lraUNvZGUpICBSZXR1cm46IFN0cmluZ1xuXHQvL1x0Q29udmVydCBmb3IgaW5saW5lIGVsZW1lbnRzIG9mIHRoZSBXaWtpIHNvdXJjZSBjb2RlXG5cdC8vLS0tLVBVQkxJQyBNZXRob2Q6IFdpa2lDb252ZXJ0LnJlcGxhY2VJbWFnZXMocFdpa2lDb2RlOlN0cmluZyk6U3RyaW5nLS0tLS1cblx0Ly8gcmVwbGFjZUltYWdlcyhwV2lraUNvZGUpICBSZXR1cm46IFN0cmluZ1xuXHQvL1x0Q29udmVydCBmb3IgaW5saW5lIGVsZW1lbnRzIG9mIHRoZSBXaWtpIHNvdXJjZSBjb2RlXG5cdC8vLS0tLVBVQkxJQyBNZXRob2Q6IFdpa2lDb252ZXJ0Lm1hdGgyamF4KHBXaWtpQ29kZTpTdHJpbmcscEZvcm1hdDpTdHJpbmcpOlN0cmluZy0tLS0tXG5cdC8vIG1hdGgyamF4KHBXaWtpQ29kZSxwRm9ybWF0KSAgUmV0dXJuOiBTdHJpbmdcblx0Ly9cdENvbnZlcnQgdGhlIE1BVEgtdGFnIHRvIGEgTWF0aEpheCBjb21wYXRpYmxlIEhUTUwgZW52aXJvbWVudCBkZXBlbmRlbnQgb2YgdGhlIHBGb3JtYXQgb2YgdGhlIHBhcmFtZXRlciBvZiBtYXRoMmpheC5cblx0Ly9cdHBGb3JtYXQgPSAncmV2ZWFsJyAnaHRtbCcgYXJlIHBvc3NpYmxlIGZvcm1hdHNcblx0Ly8tLS0tUFVCTElDIE1ldGhvZDogV2lraUNvbnZlcnQuY29udmVydFdpa2kyTG9jYWwocENvbnRlbnQ6U3RyaW5nLDpIYXNoKTpTdHJpbmctLS0tLVxuXHQvLyBjb252ZXJ0V2lraTJMb2NhbChwQ29udGVudCkgIFJldHVybjogU3RyaW5nXG5cdC8vXHRjb252ZXJ0V2lraTJMb2NhbCgpIHJlcGxhY2VzIHRoZSBNZWRpYVdpa2kgaW50ZXJuYWwgbGlua3MgdG8gbGlua3MgdGhhdCB3b3JrIGluIGEgbG9jYWwgSFRNTCBmaWxlLiBUaGUgcGFyc2VkIHZNZWRpYVdpa2kgTGlua3Ncblx0Ly8tLS0tUFVCTElDIE1ldGhvZDogV2lraUNvbnZlcnQucGFyc2VXaWtpNE1lZGlhKHBXaWtpQ29kZTpTdHJpbmcpOkFycmF5LS0tLS1cblx0Ly8gcGFyc2VXaWtpNE1lZGlhKHBXaWtpQ29kZSkgIFJldHVybjogQXJyYXlcblx0Ly9cdHBhcnNlV2lraTRNZWRpYSgpIHRoZSBwV2lraUNvZGUgYW5kIGV4dHJhY3QgdGhlIE1lZGlhIGFuZCBGaWxlIGxpbmtzLlxuXHQvLy0tLS1QVUJMSUMgTWV0aG9kOiBXaWtpQ29udmVydC5jcmVhdGVNZWRpYVBhcnNlSlNPTih2TWVkaWFBcnJheTpBcnJheSktLS0tLVxuXHQvLyBjcmVhdGVNZWRpYVBhcnNlSlNPTih2TWVkaWFBcnJheSlcblx0Ly9cdGNyZWF0ZU1lZGlhUGFyc2VKU09OKHZNZWRpYUFycmF5OkFycmF5KSBjcmVhdGVzIGluIHRoaXMuYVBhcnNlSlNPTltcIm1lZGlhXCJdPXt9IGEgSGFzaFxuXHQvL1x0dGhhdCBtYXBzIHRoZSBsb2NhbCBmaWxlIHBhdGggJ2ltYWdlL215X2ltYWdlLnBuZycgdG8gdGhlIHJlcGxhY2UgcGF0aFxuXHQvL1x0dGhpcy5hUGFyc2VKU09OW1wibWVkaWFcIl1bXCJpbWFnZS9teV9pbWFnZS5wbmdcIl0gPSBcImh0dHBzOi8vY29tbW9ucy53aWtpbWVkaWEub3JnL3dpa2kvbXlfaW1hZ2UucG5nXCJcblx0Ly8tLS0tUFVCTElDIE1ldGhvZDogV2lraUNvbnZlcnQuY2hlY2tQYXJzZUpTT04ocEhhc2hJRDpTdHJpbmcpLS0tLS1cblx0Ly8gY2hlY2tQYXJzZUpTT04ocEhhc2hJRClcblx0Ly9cdGNoZWNrUGFyc2VKU09OKCkgY2hlY2tzIGlmIHRoZSBGaWxlIExpbmsgZGVmaW5pdGlvbnMgZXhpc3RzIGluIHRoZSBwV2lraUhhc2hbXCJtZWRpYVwiXVxuXHQvLy0tLS1QVUJMSUMgTWV0aG9kOiBXaWtpQ29udmVydC5nZXRNZWRpYVN1YkRpcihwTWVkaWFMaW5rOlN0cmluZyktLS0tLVxuXHQvLyBnZXRNZWRpYVN1YkRpcihwTWVkaWFMaW5rKVxuXHQvL1x0Z2V0TWVkaWFTdWJEaXIocE1lZGlhTGluaykgcmV0dXJuIGZvciBhIHBNZWRpYUxpbmsgdGhlIGFwcHJvcHJpYXRlIHN1YmRpcmVjdG9yeS5cblx0Ly8tLS0tUFVCTElDIE1ldGhvZDogV2lraUNvbnZlcnQuY29udmVydFdpa2lNZWRpYTJGaWxlKHBNZWRpYUxpbms6U3RyaW5nKTpTdHJpbmctLS0tLVxuXHQvLyBjb252ZXJ0V2lraU1lZGlhMkZpbGUocE1lZGlhTGluaykgIFJldHVybjogU3RyaW5nXG5cdC8vXHRjb252ZXJ0V2lraU1lZGlhMkZpbGUocE1lZGlhTGluaykgY29udmVydHMgdGhlIHBNZWRpYUxpbmsgaW50byBhbiBVUkwgYW5kIHJldHVybnMgdGhlIG1lZGlhIGxpbmsuXG5cdC8vXHRyZW1vdmVzIGJsYW5rcyBhdCB0aGUgdGFpbCBhbmQgcmVwbGFjZXMgYmxhbmtzIHdpdGggYW5kIHVuZGVyc2NvcmUgXCJfXCJcblx0Ly9cdGFuZCBub24tYWxwaGEtbnVtZXJpY2FsIGNoYXJhY3RlcnMgd2l0aCBhbiB1bmRlcnNjb3JlLCBzbyB0aGF0IGZpbmFsbHkgdGhlIGZpbGVuYW1lIHdvcmtzIGZpbmUgb24gYWxsIGZpbGUgc3lzdGVtc1xuXHQvLy0tLS1QVUJMSUMgTWV0aG9kOiBXaWtpQ29udmVydC5jb252ZXJ0V2lraU1lZGlhMlVSTChwTWVkaWFMaW5rOlN0cmluZyk6U3RyaW5nLS0tLS1cblx0Ly8gY29udmVydFdpa2lNZWRpYTJVUkwocE1lZGlhTGluaykgIFJldHVybjogU3RyaW5nXG5cdC8vXHRjb252ZXJ0V2lraU1lZGlhMlVSTChwTWVkaWFMaW5rKSByZW1vdmVzIGJsYW5rcyBhdCB0aGUgdGFpbCBhbmQgcmVwbGFjZXMgYmxhbmtzIHdpdGggYW5kIHVuZGVyc2NvcmUgXCJfXCJcblx0Ly8tLS0tUFVCTElDIE1ldGhvZDogV2lraUNvbnZlcnQuZG93bmxvYWRXaWtpTWVkaWEocE1lZGlhQXJyYXk6QXJyYXkpLS0tLS1cblx0Ly8gZG93bmxvYWRXaWtpTWVkaWEocE1lZGlhQXJyYXkpXG5cdC8vXHRkb3dubG9hZFdpa2lNZWRpYShwTWVkaWFBcnJheTpBcnJheSkgZG93bmxvYWQgdGhlIGltYWdlcyB0byBsZXZlbC1mc1xuXHQvL1x0dGhhdCBjYW4gYmUgZXhwb3J0ZWQgYXMgWklQLWZpbGUgd2l0aCBhcmNoaXZlciBOUE0gbW9kdWxlXG5cdC8vLS0tLVBVQkxJQyBNZXRob2Q6IFdpa2lDb252ZXJ0LmRvd25sb2FkTWVkaWFGaWxlKHBNZWRpYUxpbms6U3RyaW5nKS0tLS0tXG5cdC8vIGRvd25sb2FkTWVkaWFGaWxlKHBNZWRpYUxpbmspXG5cdC8vXHRkb3dubG9hZE1lZGlhRmlsZShwTWVkaWFGaWxlKSBmcm9tIFdpa2lNZWRpYSBDb21tb25zIHRvIHRoZSBsb2NhbCBmaWxlc3lzdGVtIGVtdWxhdGVkIHdpdGggbGV2ZWwtZnNcblx0Ly8tLS0tUFVCTElDIE1ldGhvZDogV2lraUNvbnZlcnQuY29udmVydE1lZGlhTGluazRXaWtpKHBDb250ZW50OlN0cmluZyxwTWVkaWFBcnJheTpBcnJheSk6U3RyaW5nLS0tLS1cblx0Ly8gY29udmVydE1lZGlhTGluazRXaWtpKHBDb250ZW50LHBNZWRpYUFycmF5KSAgUmV0dXJuOiBTdHJpbmdcblx0Ly9cdGNvbnZlcnRNZWRpYUxpbms0V2lraShwQ29udGVudCxwTWVkaWFXaWtpKSBjb252ZXJ0IHRoZSBsaW5rXG5cdC8vXHQtIFtbRmlsZTpNeUZpbGUucG5nLi4uLiAgIHdpdGhcblx0Ly9cdC0gW0ZpbGU6aHR0cHM6Ly9jb21tb25zLndpa2ltZWRpYS5vcmcvLi4uL015RmlsZS5wbmdcblx0Ly8tLS0tUFVCTElDIE1ldGhvZDogV2lraUNvbnZlcnQucmVwbGFjZVN0cmluZyhwU3RyaW5nOlN0cmluZyxwU2VhcmNoOlN0cmluZyxwUmVwbGFjZTpTdHJpbmcpOlN0cmluZy0tLS0tXG5cdC8vIHJlcGxhY2VTdHJpbmcocFN0cmluZyxwU2VhcmNoLHBSZXBsYWNlKSAgUmV0dXJuOiBTdHJpbmdcblx0Ly9cdHJlcGxhY2VTdHJpbmcocFN0cmluZyxwU2VhcmNoLHBSZXBsYWNlKSByZXBsYWNlcyBnbG9iYWxseSBwU2VhcmNoIGJ5IHBSZXBsYWNlIGFuZCByZXR1cm5zIHRoZSBtb2RpZmllZCBzdHJpbmdcblx0Ly8tLS0tUFVCTElDIE1ldGhvZDogV2lraUNvbnZlcnQuY29udmVydFdpa2kyT25saW5lKHBDb250ZW50OlN0cmluZyk6U3RyaW5nLS0tLS1cblx0Ly8gY29udmVydFdpa2kyT25saW5lKHBDb250ZW50KSAgUmV0dXJuOiBTdHJpbmdcblx0Ly9cdGNvbnZlcnRXaWtpMk9ubGluZShwQ29udGVudCkgY29udmVydHMgdGhlIExpbmtzIGFuZCBNZWRpYSBpbiB3YXkgc28gdGhhdCBtZWRpYSBhbmQgbGlua3Ncblx0Ly9cdGFyZSByZWZlcmVuY2VkIHRvIG9ubGluZSByZXNvdXJjZSB0byB0aGUgc2VydmVyXG5cdC8vLS0tLVBVQkxJQyBNZXRob2Q6IFdpa2lDb252ZXJ0LnJlcGxhY2VXaWtpTGlua3MocFdpa2lDb2RlOlN0cmluZzpIYXNoKTpTdHJpbmctLS0tLVxuXHQvLyByZXBsYWNlV2lraUxpbmtzKHBXaWtpQ29kZSkgIFJldHVybjogU3RyaW5nXG5cdC8vXHRDb21tZW50IGZvciByZXBsYWNlV2lraUxpbmtzXG5cdC8vLS0tLVBVQkxJQyBNZXRob2Q6IFdpa2lDb252ZXJ0LmdldFdpa2lMaW5rcyhwV2lraUNvZGU6U3RyaW5nKTpTdHJpbmctLS0tLVxuXHQvLyBnZXRXaWtpTGlua3MocFdpa2lDb2RlKSAgUmV0dXJuOiBTdHJpbmdcblx0Ly9cdGdldFdpa2lMaW5rcyhwV2lraUNvZGUpIGV4dHJhY3QgRG91YmxlLUJyYWNrZXQgW1suLi5dXSBsaW5rIGluIHBXaWtpQ29kZVxuXHQvLy0tLS1QVUJMSUMgTWV0aG9kOiBXaWtpQ29udmVydC5jb252ZXJ0TWVkaWFMaW5rNFdpa2lPbmxpbmUocENvbnRlbnQ6U3RyaW5nLHBNZWRpYUFycmF5OkFycmF5KTpTdHJpbmctLS0tLVxuXHQvLyBjb252ZXJ0TWVkaWFMaW5rNFdpa2lPbmxpbmUocENvbnRlbnQscE1lZGlhQXJyYXkpICBSZXR1cm46IFN0cmluZ1xuXHQvL1x0Y29udmVydE1lZGlhTGluazRXaWtpT25saW5lKHBXaWtpQ29kZSxwTWVkaWFBcnJheSkgY29udmVydHMgTWVkaWEgTGlua3MgdG8gV2lraU1lZGlhIENvbW1vbnNcblx0Ly9cdHRvIGEgcmVtb3RlIGxpbmsgZm9yIGxvY2FsIGZpbGVzXG5cblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQvLyMgUFVCTElDIE1ldGhvZDogaW5pdCgpXG5cdC8vIyAgICB1c2VkIGluIENsYXNzOiBXaWtpQ29udmVydFxuXHQvLyMgUGFyYW1ldGVyOlxuXHQvLyMgICAgcExhbmd1YWdlOlN0cmluZ1xuXHQvLyMgICAgcFdpa2lJRDpTdHJpbmdcblx0Ly8jIENvbW1lbnQ6XG5cdC8vIyAgICBwYXJzZXMgdGhlIE1lZGlhV2lraSBjb2RlIGluIGFyZ3VtZW50IGFuZCByZXR1cm5zIGEgSFRNTCBzdHJpbmdcblx0Ly8jIFJldHVybjogU3RyaW5nXG5cdC8vIyBjcmVhdGVkIHdpdGggSlNDQyAgMjAxNy8wMy8wNSAxODoxMzoyOFxuXHQvLyMgbGFzdCBtb2RpZmljYXRpb25zIDIwMTgvMDEvMjEgMTc6MTc6MThcblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5cblx0V2lraUNvbnZlcnQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAocExhbmd1YWdlLHBEb21haW4scERvY0pTT04pIHtcblx0XHR0aGlzLmFMYW5ndWFnZSA9IHBMYW5ndWFnZTtcblx0XHR0aGlzLmFEb21haW4gPSBwRG9tYWluOyAvLyBlLmcuIFwid2lraXZlcnNpdHlcIlxuXHRcdHRoaXMuYVNlcnZlciA9IFwiaHR0cHM6Ly9cIit0aGlzLmFMYW5ndWFnZStcIi5cIit0aGlzLmFEb21haW4rXCIub3JnL3dpa2kvXCI7XG5cdFx0dGhpcy5hTWVkaWFQYXRoID0gXCJodHRwczovL1wiK3RoaXMuYUxhbmd1YWdlK1wiLlwiK3RoaXMuYURvbWFpbitcIi5vcmcvd2lraS9TcGVjaWFsOlJlZGlyZWN0L2ZpbGUvXCI7XG5cdFx0dGhpcy5hRG9jSlNPTiA9IHBEb2NKU09OIHx8IHt9O1xuXHRcdGlmICh0aGlzLmFEb2NKU09OLmhhc093blByb3BlcnR5KFwibGFuZ19vcl93aWtpaWRcIikpIHtcblx0XHRcdFx0ZGVsZXRlIHRoaXMuYURvY0pTT05bXCJsYW5nX29yX3dpa2lpZFwiXTtcblx0XHR9O1xuXHRcdHRoaXMuYURvY0pTT05bXCJsYW5ndWFnZVwiXSA9IHBMYW5ndWFnZTtcblx0XHR0aGlzLmFEb2NKU09OW1wiZG9tYWluXCJdID0gcERvbWFpbjtcblx0fTtcblx0Ly8tLS0tRW5kIG9mIE1ldGhvZCBpbml0IERlZmluaXRpb25cblxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdC8vIyBQVUJMSUMgTWV0aG9kOiBpbml0QXJ0aWNsZSgpXG5cdC8vIyAgICB1c2VkIGluIENsYXNzOiBXaWtpQ29udmVydFxuXHQvLyMgUGFyYW1ldGVyOlxuXHQvLyMgICAgcFdpa2lDb2RlOlN0cmluZ1xuXHQvLyMgICAgcFdpa2lUaXRsZTpTdHJpbmdcblx0Ly8jIENvbW1lbnQ6XG5cdC8vIyAgICBwYXJzZXMgdGhlIE1lZGlhV2lraSBjb2RlIGluIGFyZ3VtZW50IGFuZCByZXR1cm5zIGEgSFRNTCBzdHJpbmdcblx0Ly8jIFJldHVybjogU3RyaW5nXG5cdC8vIyBjcmVhdGVkIHdpdGggSlNDQyAgMjAxNy8wMy8wNSAxODoxMzoyOFxuXHQvLyMgbGFzdCBtb2RpZmljYXRpb25zIDIwMTgvMDEvMjEgMTc6MTc6MThcblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5cblx0dGhpcy5pbml0QXJ0aWNsZSA9IGZ1bmN0aW9uIChwV2lraVRpdGxlKSB7XG5cdFx0cFdpa2lUaXRsZSA9IHBXaWtpVGl0bGUgfHwgXCJUaXRsZSB1bmRlZmluZWQgaW4gY29udmVydCgpXCI7XG5cdFx0dmFyIGh0bWwgPSAnPHA+ZnVuY3Rpb24gd2lraTJodG1sKHBXaWtpQ29kZSk6IGFuIGVycm9yIG9jY3VyczwvcD4nO1xuXHRcdHRoaXMuYVdpa2lUaXRsZSA9IHBXaWtpVGl0bGUucmVwbGFjZSgvXy9nLFwiIFwiKTtcblx0XHQvLyBzZXQgVGl0bGUgaW4gRG9jSlNPTlxuXHRcdGlmICgodGhpcy5hRG9jSlNPTikgJiYgKHRoaXMuYURvY0pTT04uc2VjdGlvbnMpICYmICh0aGlzLmFEb2NKU09OLnNlY3Rpb25zLmxlbmd0aCA+MCkpIHtcblx0XHRcdC8vIHNldCBUaXRsZSBpbiBmaXJzdCBzZWN0aW9uIG9mIGFEb2NKU09OXG5cdFx0XHR0aGlzLmFEb2NKU09OLnNlY3Rpb25zWzBdW1widGl0bGVcIl0gPSB0aGlzLnJlcGxhY2VTdHJpbmcodGhpcy5hV2lraVRpdGxlLFwiX1wiLFwiIFwiKTtcblx0XHRcdC8vIHNldCBEb3dubG9hZGVkIFVSTCBpbiBhRG9jSlNPTlxuXHRcdFx0dGhpcy5hRG9jSlNPTltcInVybFwiXSA9IHRoaXMuYVNlcnZlcit0aGlzLmFXaWtpVGl0bGU7XG5cdFx0XHQvLyBzZXQgRG93bmxvYWQgVGltZSBpbiBhRG9jSlNPTlxuXHRcdFx0dmFyIG5vdyA9IG5ldyBEYXRlKCk7XG5cdFx0XHR0aGlzLmFEb2NKU09OW1wiZGF0ZVwiXSA9IG5vdy50b0pTT04oKTtcblx0XHR9O1xuXHR9O1xuXHQvLy0tLS1FbmQgb2YgTWV0aG9kIGluaXQgRGVmaW5pdGlvblxuXG5cblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQvLyMgUFVCTElDIE1ldGhvZDogY29udmVydCgpXG5cdC8vIyAgICB1c2VkIGluIENsYXNzOiBXaWtpQ29udmVydFxuXHQvLyMgUGFyYW1ldGVyOlxuXHQvLyMgICAgcFdpa2lDb2RlOlN0cmluZ1xuXHQvLyMgICAgcFdpa2lUaXRsZTpTdHJpbmdcblx0Ly8jIENvbW1lbnQ6XG5cdC8vIyAgICBjb252ZXJ0cyB0aGUgTWVkaWFXaWtpIGNvZGUgaW4gYXJndW1lbnQgYW5kIHJldHVybnMgYSBIVE1MIHN0cmluZ1xuXHQvLyMgUmV0dXJuOiBTdHJpbmdcblx0Ly8jIGNyZWF0ZWQgd2l0aCBKU0NDICAyMDE3LzAzLzA1IDE4OjEzOjI4XG5cdC8vIyBsYXN0IG1vZGlmaWNhdGlvbnMgMjAxOC8wMS8yMSAxNzoxNzoxOFxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cblx0dGhpcy5jb252ZXJ0ID0gZnVuY3Rpb24gKHBXaWtpQ29kZSxwV2lraVRpdGxlKSB7XG5cdCAgLy8tLS0tRGVidWdnaW5nLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdCAgLy8gY29uc29sZS5sb2coXCJqcy93aWtpY29udmVydC5qcyAtIENhbGw6IGNvbnZlcnQocFdpa2lDb2RlOlN0cmluZyk6U3RyaW5nXCIpO1xuXHQgIC8vIGFsZXJ0KFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBjb252ZXJ0KHBXaWtpQ29kZTpTdHJpbmcpOlN0cmluZ1wiKTtcblx0ICAvLy0tLS1DcmVhdGUgT2JqZWN0L0luc3RhbmNlIG9mIFdpa2lDb252ZXJ0LS0tLVxuXHQgIC8vICAgIHZhciB2TXlJbnN0YW5jZSA9IG5ldyBXaWtpQ29udmVydCgpO1xuXHQgIC8vICAgIHZNeUluc3RhbmNlLmNvbnZlcnQocFdpa2lDb2RlKTtcblx0ICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHQgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL3JlZ2V4cFxuXHRcdFx0XHR0aGlzLmluaXRBcnRpY2xlKHBXaWtpVGl0bGUpO1xuXHRcdFx0XHRpZiAodGhpcy5hUmVtb3RlTWVkaWEgPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdC8vIHJlbW90ZSBNZWRpYSBsaW5rc1xuXHRcdFx0XHRcdC8vcFdpa2lDb2RlID0gdGhpcy5jb252ZXJ0V2lraTJPbmxpbmUocFdpa2lDb2RlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBsb2NhbCBtZWRpYSBsaW5rcyAtIHJlcXVpcmVzIGRvd25sb2FkIG9mIE1lZGlhIGZpbGVzIGZvciBkaXNwbGF5XG5cdFx0XHRcdFx0Ly9wV2lraUNvZGUgPSB0aGlzLmNvbnZlcnRXaWtpMkxvY2FsKHBXaWtpQ29kZSk7XG5cdFx0XHRcdFx0Ly8gWklQL2FyY2hpdmUgZG93bmxvYWRlZCBmaWxlcyBUT0RPXG5cdFx0XHRcdH07XG5cdFx0XHRcdC8vIHNhdmVKU09OKFwid2lraWRhdGEuanNvblwiLHZQYXJzZUpTT04pOyAvLyBUT0RPXG5cdFx0XHRcdHBXaWtpQ29kZSA9IHRoaXMubWF0aDJqYXgocFdpa2lDb2RlKTtcblx0XHRcdFx0cFdpa2lDb2RlID0gdGhpcy5tYXRoMnJldmVhbChwV2lraUNvZGUpO1xuXHRcdFx0XHRwV2lraUNvZGUgPSB0aGlzLnJlcGxhY2VXaWtpTGlua3MocFdpa2lDb2RlKTtcblx0XHRcdFx0Ly9wV2lraUNvZGUgPSB0aGlzLmNvbnZlcnRXaWtpMkxvY2FsKHBXaWtpQ29kZSk7XG5cdFx0XHRcdHBXaWtpQ29kZSA9IHRoaXMucmVwbGFjZUltYWdlcyhwV2lraUNvZGUpO1xuXHRcdFx0XHRyZXR1cm4gcFdpa2lDb2RlIHx8IFwiXCI7XG5cblx0fTtcblx0Ly8tLS0tRW5kIG9mIE1ldGhvZCBjb252ZXJ0IERlZmluaXRpb25cblxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdC8vIyBQVUJMSUMgTWV0aG9kOiBjbGVhbl91bnN1cHBvcnRlZF93aWtpKClcblx0Ly8jICAgIHVzZWQgaW4gQ2xhc3M6IFdpa2lDb252ZXJ0XG5cdC8vIyBQYXJhbWV0ZXI6XG5cdC8vIyAgICBwV2lraUNvZGU6U3RyaW5nXG5cdC8vIyBDb21tZW50OlxuXHQvLyMgICAgY2xlYW5fdW5zdXBwb3J0ZWRfd2lraShwV2lraUNvZGUpIHJlbW92ZXMgZG91YmxlIGJyYWNrZXQge3suLi59fSBXaWtpIGNvbW1hbmRzLlxuXHQvLyMgICAgY2xlYW5fdW5zdXBwb3J0ZWRfd2lraSgpIHVzZXMgdGhlIE1lZGlhV2lraSBzb3VyY2UgY29kZSBgcFdpa2lDb2RlYCBmcm9tIHRoZSBwYXJhbWV0ZXIgb2YgdGhlIGZ1bmN0aW9uIGFuZCByZXR1cm5zIGEgSFRNTCBzdHJpbmdcblx0Ly8jICAgIGFmdGVyIHJlbW92aW5nIGFsbCB7ey4uLn19IGNvbW1hbmRzIHN0aWxsIGxlZnQgaW4gV2lraSBDb2RlLlxuXHQvLyMgUmV0dXJuOiBTdHJpbmdcblx0Ly8jIGNyZWF0ZWQgd2l0aCBKU0NDICAyMDE3LzAzLzA1IDE4OjEzOjI4XG5cdC8vIyBsYXN0IG1vZGlmaWNhdGlvbnMgMjAxOC8wMS8yMSAxNzoxNzoxOFxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cblx0dGhpcy5jbGVhbl91bnN1cHBvcnRlZF93aWtpID0gZnVuY3Rpb24gKHBXaWtpQ29kZSkge1xuXHQgIC8vLS0tLURlYnVnZ2luZy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQgIC8vIGNvbnNvbGUubG9nKFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBjbGVhbl91bnN1cHBvcnRlZF93aWtpKHBXaWtpQ29kZTpTdHJpbmcpOlN0cmluZ1wiKTtcblx0ICAvLyBhbGVydChcImpzL3dpa2ljb252ZXJ0LmpzIC0gQ2FsbDogY2xlYW5fdW5zdXBwb3J0ZWRfd2lraShwV2lraUNvZGU6U3RyaW5nKTpTdHJpbmdcIik7XG5cdCAgLy8tLS0tQ3JlYXRlIE9iamVjdC9JbnN0YW5jZSBvZiBXaWtpQ29udmVydC0tLS1cblx0ICAvLyAgICB2YXIgdk15SW5zdGFuY2UgPSBuZXcgV2lraUNvbnZlcnQoKTtcblx0ICAvLyAgICB2TXlJbnN0YW5jZS5jbGVhbl91bnN1cHBvcnRlZF93aWtpKHBXaWtpQ29kZSk7XG5cdCAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0cFdpa2lDb2RlID0gcFdpa2lDb2RlLnJlcGxhY2UoL1xce1xce1tefV1cXH1cXH0vZywgJycpO1xuXHQgIHJldHVybiBwV2lraUNvZGU7XG5cblx0fTtcblx0Ly8tLS0tRW5kIG9mIE1ldGhvZCBjbGVhbl91bnN1cHBvcnRlZF93aWtpIERlZmluaXRpb25cblxuXG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0Ly8jIFBVQkxJQyBNZXRob2Q6IGNsZWFuX3NvdXJjZSgpXG5cdC8vIyAgICB1c2VkIGluIENsYXNzOiBXaWtpQ29udmVydFxuXHQvLyMgUGFyYW1ldGVyOlxuXHQvLyMgICAgcFdpa2lDb2RlOlN0cmluZ1xuXHQvLyMgQ29tbWVudDpcblx0Ly8jICAgIGNsZWFuX3NvdXJjZShwV2lraUNvZGUpIG5vcm1hbGl6ZXMgbGluZSBicmVha3MgaW4gb3JkZXIgdG8gaGF2ZSBhIGNvbW1vbiBiYXNlIHN0cmluZyBmb3IgYWxsIGJyb3dzZXJzLlxuXHQvLyMgICAgY2xlYW5fc291cmNlKCkgdXNlcyB0aGUgTWVkaWFXaWtpIHNvdXJjZSBjb2RlIGBwV2lraUNvZGVgIGZyb20gdGhlIHBhcmFtZXRlciBvZiB0aGUgZnVuY3Rpb24gYW5kIHJldHVybnMgYSBIVE1MIHN0cmluZ1xuXHQvLyMgICAgYWZ0ZXIgcmVtb3ZpbmcgYWxsIENScy5cblx0Ly8jIFJldHVybjogU3RyaW5nXG5cdC8vIyBjcmVhdGVkIHdpdGggSlNDQyAgMjAxNy8wMy8wNSAxODoxMzoyOFxuXHQvLyMgbGFzdCBtb2RpZmljYXRpb25zIDIwMTgvMDEvMjEgMTc6MTc6MThcblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5cdHRoaXMuY2xlYW5fc291cmNlID0gZnVuY3Rpb24gKHBXaWtpQ29kZSkge1xuXHQgIC8vLS0tLURlYnVnZ2luZy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQgIC8vIGNvbnNvbGUubG9nKFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBjbGVhbl9zb3VyY2UocFdpa2lDb2RlOlN0cmluZyk6U3RyaW5nXCIpO1xuXHQgIC8vIGFsZXJ0KFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBjbGVhbl9zb3VyY2UocFdpa2lDb2RlOlN0cmluZyk6U3RyaW5nXCIpO1xuXHQgIC8vLS0tLUNyZWF0ZSBPYmplY3QvSW5zdGFuY2Ugb2YgV2lraUNvbnZlcnQtLS0tXG5cdCAgLy8gICAgdmFyIHZNeUluc3RhbmNlID0gbmV3IFdpa2lDb252ZXJ0KCk7XG5cdCAgLy8gICAgdk15SW5zdGFuY2UuY2xlYW5fc291cmNlKHBXaWtpQ29kZSk7XG5cdCAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0cFdpa2lDb2RlID0gdGhpcy5yZXBsYWNlU3RyaW5nKHBXaWtpQ29kZSxcIltbSW1hZ2U6XCIsXCJbW0ZpbGU6XCIpO1xuXHRcdHBXaWtpQ29kZSA9IHRoaXMucmVwbGFjZVN0cmluZyhwV2lraUNvZGUsXCJbW0RhdGVpOlwiLFwiW1tGaWxlOlwiKTtcblx0XHRwV2lraUNvZGUgPSB0aGlzLnJlcGxhY2VTdHJpbmcocFdpa2lDb2RlLFwifHRodW1ibmFpbHxcIixcInx0aHVtYnxcIik7XG5cdFx0cFdpa2lDb2RlID0gdGhpcy5yZXBsYWNlU3RyaW5nKHBXaWtpQ29kZSxcInx0aHVtYm5haWxdXVwiLFwifHRodW1ifCBdXVwiKTtcblx0XHRwV2lraUNvZGUgPSB0aGlzLnJlcGxhY2VTdHJpbmcocFdpa2lDb2RlLFwifG1pbml8XCIsXCJ8dGh1bWJ8XCIpO1xuXHRcdHBXaWtpQ29kZSA9IHRoaXMucmVwbGFjZVN0cmluZyhwV2lraUNvZGUsXCJ8bWluaV1dXCIsXCJ8dGh1bWJ8IF1dXCIpO1xuXHRcdC8vcFdpa2lDb2RlID0gcFdpa2lDb2RlLnJlcGxhY2UoL1t8XSh0aHVtYm5haWx8bWluaSkoXFxdfFxcfCkvZyxcInx0aHVtYiQyXCIpO1xuXHQgIHBXaWtpQ29kZSA9IHBXaWtpQ29kZS5yZXBsYWNlKC9cXHIvZywgJycpO1xuXHQgIHJldHVybiBwV2lraUNvZGU7XG5cblx0fTtcblx0Ly8tLS0tRW5kIG9mIE1ldGhvZCBjbGVhbl9zb3VyY2UgRGVmaW5pdGlvblxuXG5cblx0XHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdFx0Ly8jIFBVQkxJQyBNZXRob2Q6IHBvc3RfcHJvY2VzcygpXG5cdFx0Ly8jICAgIHVzZWQgaW4gQ2xhc3M6IFdpa2lDb252ZXJ0XG5cdFx0Ly8jIFBhcmFtZXRlcjpcblx0XHQvLyMgICAgcFdpa2lDb2RlOlN0cmluZ1xuXHRcdC8vIyBDb21tZW50OlxuXHRcdC8vIyAgICBwb3N0X3Byb2Nlc3MocFdpa2lDb2RlKSBub3JtYWxpemVzIGxpbmUgYnJlYWtzIGluIG9yZGVyIHRvIGhhdmUgYSBjb21tb24gYmFzZSBzdHJpbmcgZm9yIGFsbCBicm93c2Vycy5cblx0XHQvLyMgICAgcG9zdF9wcm9jZXNzKCkgdXNlcyB0aGUgTWVkaWFXaWtpIHNvdXJjZSBjb2RlIGBwV2lraUNvZGVgIGZyb20gdGhlIHBhcmFtZXRlciBvZiB0aGUgZnVuY3Rpb24gYW5kIHJldHVybnMgYSBIVE1MIHN0cmluZ1xuXHRcdC8vIyAgICBhZnRlciByZW1vdmluZyBhbGwgQ1JzLlxuXHRcdC8vIyBSZXR1cm46IFN0cmluZ1xuXHRcdC8vIyBjcmVhdGVkIHdpdGggSlNDQyAgMjAxNy8wMy8wNSAxODoxMzoyOFxuXHRcdC8vIyBsYXN0IG1vZGlmaWNhdGlvbnMgMjAxOC8wMS8yMSAxNzoxNzoxOFxuXHRcdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuXHRcdHRoaXMucG9zdF9wcm9jZXNzID0gZnVuY3Rpb24gKHBXaWtpQ29kZSkge1xuXHRcdCAgLy8tLS0tRGVidWdnaW5nLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0ICAvLyBjb25zb2xlLmxvZyhcImpzL3dpa2ljb252ZXJ0LmpzIC0gQ2FsbDogcG9zdF9wcm9jZXNzKHBXaWtpQ29kZTpTdHJpbmcpOlN0cmluZ1wiKTtcblx0XHQgIC8vIGFsZXJ0KFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBwb3N0X3Byb2Nlc3MocFdpa2lDb2RlOlN0cmluZyk6U3RyaW5nXCIpO1xuXHRcdCAgLy8tLS0tQ3JlYXRlIE9iamVjdC9JbnN0YW5jZSBvZiBXaWtpQ29udmVydC0tLS1cblx0XHQgIC8vICAgIHZhciB2TXlJbnN0YW5jZSA9IG5ldyBXaWtpQ29udmVydCgpO1xuXHRcdCAgLy8gICAgdk15SW5zdGFuY2UucG9zdF9wcm9jZXNzKHBXaWtpQ29kZSk7XG5cdFx0ICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdHBXaWtpQ29kZSA9IHRoaXMucmVwbGFjZVN0cmluZyhwV2lraUNvZGUsXCJfX19JTUdfT1BFTl9fX1wiLFwiW1tcIik7XG5cdFx0XHRwV2lraUNvZGUgPSB0aGlzLnJlcGxhY2VTdHJpbmcocFdpa2lDb2RlLFwiX19fSU1HX0NMT1NFX19fXCIsXCJdXVwiKTtcblx0XHRcdC8vcFdpa2lDb2RlID0gcFdpa2lDb2RlLnJlcGxhY2UoL1t8XSh0aHVtYm5haWx8bWluaSkoXFxdfFxcfCkvZyxcInx0aHVtYiQyXCIpO1xuXHRcdCAgcFdpa2lDb2RlID0gcFdpa2lDb2RlLnJlcGxhY2UoL1xcci9nLCAnJyk7XG5cdFx0ICByZXR1cm4gcFdpa2lDb2RlO1xuXG5cdFx0fTtcblx0XHQvLy0tLS1FbmQgb2YgTWV0aG9kIHBvc3RfcHJvY2VzcyBEZWZpbml0aW9uXG5cblx0XHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdFx0Ly8jIFBVQkxJQyBNZXRob2Q6IHJlbW92ZUNhdGVnb3JpZXMoKVxuXHRcdC8vIyAgICB1c2VkIGluIENsYXNzOiBXaWtpQ29udmVydFxuXHRcdC8vIyBQYXJhbWV0ZXI6XG5cdFx0Ly8jICAgIHBXaWtpQ29kZTpTdHJpbmdcblx0XHQvLyMgQ29tbWVudDpcblx0XHQvLyMgICAgcmVtb3ZlQ2F0ZWdvcmllcyhwV2lraUNvZGUpIG5vcm1hbGl6ZXMgbGluZSBicmVha3MgaW4gb3JkZXIgdG8gaGF2ZSBhIGNvbW1vbiBiYXNlIHN0cmluZyBmb3IgYWxsIGJyb3dzZXJzLlxuXHRcdC8vIyAgICByZW1vdmVDYXRlZ29yaWVzKCkgdXNlcyB0aGUgTWVkaWFXaWtpIHNvdXJjZSBjb2RlIGBwV2lraUNvZGVgIGZyb20gdGhlIHBhcmFtZXRlciBvZiB0aGUgZnVuY3Rpb24gYW5kIHJldHVybnMgYSBIVE1MIHN0cmluZ1xuXHRcdC8vIyAgICBhZnRlciByZW1vdmluZyBhbGwgQ1JzLlxuXHRcdC8vIyBSZXR1cm46IFN0cmluZ1xuXHRcdC8vIyBjcmVhdGVkIHdpdGggSlNDQyAgMjAxNy8wMy8wNSAxODoxMzoyOFxuXHRcdC8vIyBsYXN0IG1vZGlmaWNhdGlvbnMgMjAxOC8wMS8yMSAxNzoxNzoxOFxuXHRcdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuXHRcdHRoaXMucmVtb3ZlQ2F0ZWdvcmllcyA9IGZ1bmN0aW9uIChwV2lraUNvZGUpIHtcblx0XHRcdC8vLS0tLURlYnVnZ2luZy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFx0Ly8gY29uc29sZS5sb2coXCJqcy93aWtpY29udmVydC5qcyAtIENhbGw6IHJlbW92ZUNhdGVnb3JpZXMocFdpa2lDb2RlOlN0cmluZyk6U3RyaW5nXCIpO1xuXHRcdFx0Ly8gYWxlcnQoXCJqcy93aWtpY29udmVydC5qcyAtIENhbGw6IHJlbW92ZUNhdGVnb3JpZXMocFdpa2lDb2RlOlN0cmluZyk6U3RyaW5nXCIpO1xuXHRcdFx0Ly8tLS0tQ3JlYXRlIE9iamVjdC9JbnN0YW5jZSBvZiBXaWtpQ29udmVydC0tLS1cblx0XHRcdC8vICAgIHZhciB2TXlJbnN0YW5jZSA9IG5ldyBXaWtpQ29udmVydCgpO1xuXHRcdFx0Ly8gICAgdk15SW5zdGFuY2UucmVtb3ZlQ2F0ZWdvcmllcyhwV2lraUNvZGUpO1xuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XHQvL3ZhciB2Q2F0UmVnRXggPSAvXFxbXFxbQ2F0ZWdvcnk6KC5bXlxcXV0qKVxcXVxcXS9nO1xuXHRcdFx0Ly93aGlsZSh0b2tlbnMgPSB2Q2F0UmVnRXguZXhlYyhwV2lraUNvZGUpKSB7XG5cdFx0XHQvL31cblx0XHRcdHBXaWtpQ29kZSA9IHBXaWtpQ29kZS5yZXBsYWNlKC9cXFtcXFtDYXRlZ29yeTooLlteXFxdXSopXFxdXFxdL2csICcnKTtcblxuXHRcdFx0cmV0dXJuIHBXaWtpQ29kZTtcblxuXHRcdH07XG5cdFx0Ly8tLS0tRW5kIG9mIE1ldGhvZCByZW1vdmVDYXRlZ29yaWVzIERlZmluaXRpb25cblxuXG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0Ly8jIFBVQkxJQyBNZXRob2Q6IHJlcGxhY2VJbWFnZXMoKVxuXHQvLyMgICAgdXNlZCBpbiBDbGFzczogV2lraUNvbnZlcnRcblx0Ly8jIFBhcmFtZXRlcjpcblx0Ly8jICAgIHBXaWtpQ29kZTpTdHJpbmdcblx0Ly8jIENvbW1lbnQ6XG5cdC8vIyAgICBDb252ZXJ0IGZvciBpbmxpbmUgZWxlbWVudHMgb2YgdGhlIFdpa2kgc291cmNlIGNvZGVcblx0Ly8jIFJldHVybjogU3RyaW5nXG5cdC8vIyBjcmVhdGVkIHdpdGggSlNDQyAgMjAxNy8wMy8wNSAxODoxMzoyOFxuXHQvLyMgbGFzdCBtb2RpZmljYXRpb25zIDIwMTgvMDEvMjEgMTc6MTc6MThcblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5cdHRoaXMucmVwbGFjZUltYWdlcyA9IGZ1bmN0aW9uIChwV2lraUNvZGUpIHtcblx0ICAvLy0tLS1EZWJ1Z2dpbmctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0ICAvLyBjb25zb2xlLmxvZyhcImpzL3dpa2ljb252ZXJ0LmpzIC0gQ2FsbDogcmVwbGFjZUltYWdlcyhwV2lraUNvZGU6U3RyaW5nKTpTdHJpbmdcIik7XG5cdCAgLy8gYWxlcnQoXCJqcy93aWtpY29udmVydC5qcyAtIENhbGw6IHJlcGxhY2VJbWFnZXMocFdpa2lDb2RlOlN0cmluZyk6U3RyaW5nXCIpO1xuXHQgIC8vLS0tLUNyZWF0ZSBPYmplY3QvSW5zdGFuY2Ugb2YgV2lraUNvbnZlcnQtLS0tXG5cdCAgLy8gICAgdmFyIHZNeUluc3RhbmNlID0gbmV3IFdpa2lDb252ZXJ0KCk7XG5cdCAgLy8gICAgdk15SW5zdGFuY2UucmVwbGFjZUltYWdlcyhwV2lraUNvZGUpO1xuXHQgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0Ly92YXIgaW1hZ2UgPSAvXFxbXFxbRmlsZTooLlteXFxdfF0qKShbfF10aHVtYnxmcmFtZXxtaW5pKT8oW3xdYWx0PS5bXlxcXXxdKik/KFt8XS5bXlxcXXxdKik/XFxdXFxdL2c7XG5cdFx0dmFyIGltYWdlID0gL1xcW1xcW0ZpbGU6KC5bXlxcXV0qKVxcXVxcXS9nO1xuXHRcdHZhciB2VGl0bGUgPSBcIlwiO1xuXHRcdHZhciB2QWx0VGV4dCA9IFwiXCI7XG5cdFx0dmFyIHZDbGFzcyA9IFwiaW1hZ2VcIjtcblx0XHR2YXIgdlVSTCA9IFwiXCI7XG5cdFx0dmFyIHZDYXB0aW9uID0gXCJcIjtcblx0ICB3aGlsZSh0b2tlbnMgPSBpbWFnZS5leGVjKHBXaWtpQ29kZSkpIHtcblx0XHRcdHZUaXRsZSA9IFwiXCI7XG5cdFx0XHR2QWx0VGV4dCA9IFwiXCI7XG5cdFx0XHQvL1tbRmlsZTpteSBJbWFnZS5wbmd8dGh1bWJ8YWx0PUFsdGVybmF0aXZlIFRleHR8PGEgaHJlZj1cInRlc3QuaHRtbFwiPlRlc3QgQ29tbWVudDwvYT4gSW1hZ2UgQ29tbWVudF1dXG5cdFx0XHQvL3Rva2Vuc1swXT1teSBJbWFnZS5wbmd8dGh1bWJ8YWx0PUFsdGVybmF0aXZlIFRleHR8PGEgaHJlZj1cInRlc3QuaHRtbFwiPlRlc3QgQ29tbWVudDwvYT4gSW1hZ2UgQ29tbWVudFxuXHRcdFx0dmFyIHZMaW5rU3BsaXQgPSAodG9rZW5zWzBdKS5zcGxpdChcInxcIik7XG5cdFx0XHR2VVJMID0gdGhpcy5nZXRXaWtpTWVkaWFVUkwodkxpbmtTcGxpdFswXSk7XG5cdFx0XHRpZiAodkxpbmtTcGxpdC5sZW5ndGggPT0gMSkge1xuXHRcdFx0XHRwV2lraUNvZGUgPSBwV2lraUNvZGUucmVwbGFjZSh0b2tlbnNbMF0sICdfX19JTUdfT1BFTl9fX0ZpbGU6JyArIHZVUkwgKyAnX19fSU1HX0NMT1NfX18nKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICh2TGlua1NwbGl0Lmxlbmd0aCA9PSAyKSB7XG5cdFx0XHRcdFx0dkNhcHRpb24gPSB0aGlzLmNoZWNrQ2FwdGlvbih2TGlua1NwbGl0WzFdKTtcblx0XHRcdFx0XHRwV2lraUNvZGUgPSBwV2lraUNvZGUucmVwbGFjZSh0b2tlbnNbMF0sICdfX19JTUdfT1BFTl9fX0ZpbGU6JyArIHZVUkwgKyAnfCcgKyB2Q2FwdGlvbiArICdfX19JTUdfQ0xPU0VfX18nKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YXIgdk1lZGlhUGFyYW0gPSBcIlwiO1xuXHRcdFx0XHRcdHZDYXB0aW9uID0gdGhpcy5jaGVja0NhcHRpb24odkxpbmtTcGxpdFt2TGlua1NwbGl0Lmxlbmd0aC0xXSk7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDE7IGkgPCAodkxpbmtTcGxpdC5sZW5ndGgtMSk7IGkrKykge1xuXHRcdFx0XHRcdFx0dk1lZGlhUGFyYW0gKz0gXCJ8XCIrdkxpbmtTcGxpdFtpXTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHBXaWtpQ29kZSA9IHBXaWtpQ29kZS5yZXBsYWNlKHRva2Vuc1swXSwgJ19fX0lNR19PUEVOX19fRmlsZTonICsgdlVSTCArIHZNZWRpYVBhcmFtICsgJ3wnICsgdkNhcHRpb24gKyAnX19fSU1HX0NMT1NFX19fJyk7XG5cdFx0XHRcdH1cblx0XHRcdH07IC8vIGVsc2UgaWYgdkxpbmVTcGxpdC5sZW5ndGhcblx0XHR9OyAvLyBXaGlsZSB0b2tlbnNcblx0ICByZXR1cm4gcFdpa2lDb2RlO1xuXG5cdH07XG5cdC8vLS0tLUVuZCBvZiBNZXRob2QgcmVwbGFjZUltYWdlcyBEZWZpbml0aW9uXG5cblxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdC8vIyBQVUJMSUMgTWV0aG9kOiBjaGVja0NhcHRpb24oKVxuXHQvLyMgICAgdXNlZCBpbiBDbGFzczogV2lraUNvbnZlcnRcblx0Ly8jIFBhcmFtZXRlcjpcblx0Ly8jICAgIHBDYXB0aW9uOlN0cmluZ1xuXHQvLyMgQ29tbWVudDpcblx0Ly8jICAgIENvcnJlY3QgYSBjYXB0aW9uIHJlbW92ZXMgXV3CoGF0IGVuZFxuXHQvLyMgUmV0dXJuOiBTdHJpbmdcblx0Ly8jIGNyZWF0ZWQgd2l0aCBKU0NDICAyMDE3LzAzLzA1IDE4OjEzOjI4XG5cdC8vIyBsYXN0IG1vZGlmaWNhdGlvbnMgMjAxOC8wMS8yMSAxNzoxNzoxOFxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cblx0dGhpcy5jaGVja0NhcHRpb24gPSBmdW5jdGlvbiAocENhcHRpb24pIHtcblx0ICAvLy0tLS1EZWJ1Z2dpbmctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0ICAvLyBjb25zb2xlLmxvZyhcImpzL3dpa2ljb252ZXJ0LmpzIC0gQ2FsbDogY2hlY2tDYXB0aW9uKHBDYXB0aW9uOlN0cmluZyk6U3RyaW5nXCIpO1xuXHQgIC8vIGFsZXJ0KFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBjaGVja0NhcHRpb24ocENhcHRpb246U3RyaW5nKTpTdHJpbmdcIik7XG5cdCAgLy8tLS0tQ3JlYXRlIE9iamVjdC9JbnN0YW5jZSBvZiBXaWtpQ29udmVydC0tLS1cblx0ICAvLyAgICB2YXIgdk15SW5zdGFuY2UgPSBuZXcgV2lraUNvbnZlcnQoKTtcblx0ICAvLyAgICB2TXlJbnN0YW5jZS5jaGVja0NhcHRpb24ocENhcHRpb24pO1xuXHQgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdGlmIChwQ2FwdGlvbikge1xuXHRcdFx0cENhcHRpb24gPSBwQ2FwdGlvbi5yZXBsYWNlKC9bXFxdXSskL2csXCJcIik7XG5cdFx0fTtcblx0XHRjb25zb2xlLmxvZyhcIkNhcHRpb24gRmlndXJlOiAnXCIrcENhcHRpb24rXCInIFwiKTtcblx0ICByZXR1cm4gcENhcHRpb247XG5cblx0fTtcblx0Ly8tLS0tRW5kIG9mIE1ldGhvZCBjaGVja0NhcHRpb24gRGVmaW5pdGlvblxuXG5cblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQvLyMgUFVCTElDIE1ldGhvZDogbWF0aDJqYXgoKVxuXHQvLyMgICAgdXNlZCBpbiBDbGFzczogV2lraUNvbnZlcnRcblx0Ly8jIFBhcmFtZXRlcjpcblx0Ly8jICAgIHBXaWtpQ29kZTpTdHJpbmdcblx0Ly8jICAgIHBGb3JtYXQ6U3RyaW5nXG5cdC8vIyBDb21tZW50OlxuXHQvLyMgICAgQ29udmVydCB0aGUgTUFUSC10YWcgdG8gYSBNYXRoSmF4IGNvbXBhdGlibGUgSFRNTCBlbnZpcm9tZW50IGRlcGVuZGVudCBvZiB0aGUgcEZvcm1hdCBvZiB0aGUgcGFyYW1ldGVyIG9mIG1hdGgyamF4LlxuXHQvLyMgICAgcEZvcm1hdCA9ICdyZXZlYWwnICdodG1sJyBhcmUgcG9zc2libGUgZm9ybWF0c1xuXHQvLyMgUmV0dXJuOiBTdHJpbmdcblx0Ly8jIGNyZWF0ZWQgd2l0aCBKU0NDICAyMDE3LzAzLzA1IDE4OjEzOjI4XG5cdC8vIyBsYXN0IG1vZGlmaWNhdGlvbnMgMjAxOC8wMS8yMSAxNzoxNzoxOFxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cblx0dGhpcy5tYXRoMmpheCA9IGZ1bmN0aW9uIChwV2lraUNvZGUscEZvcm1hdCkge1xuXHQgIC8vLS0tLURlYnVnZ2luZy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQgIC8vIGNvbnNvbGUubG9nKFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBtYXRoMmpheChwV2lraUNvZGU6U3RyaW5nLHBGb3JtYXQ6U3RyaW5nKTpTdHJpbmdcIik7XG5cdCAgLy8gYWxlcnQoXCJqcy93aWtpY29udmVydC5qcyAtIENhbGw6IG1hdGgyamF4KHBXaWtpQ29kZTpTdHJpbmcscEZvcm1hdDpTdHJpbmcpOlN0cmluZ1wiKTtcblx0ICAvLy0tLS1DcmVhdGUgT2JqZWN0L0luc3RhbmNlIG9mIFdpa2lDb252ZXJ0LS0tLVxuXHQgIC8vICAgIHZhciB2TXlJbnN0YW5jZSA9IG5ldyBXaWtpQ29udmVydCgpO1xuXHQgIC8vICAgIHZNeUluc3RhbmNlLm1hdGgyamF4KHBXaWtpQ29kZSxwRm9ybWF0KTtcblx0ICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRwV2lraUNvZGUgPSBwV2lraUNvZGUucmVwbGFjZSgvXFxcXFIgL2csXCJcXFxcbWF0aGJiIFIgXCIpO1xuXHRcdHBXaWtpQ29kZSA9IHBXaWtpQ29kZS5yZXBsYWNlKC9cXFxcUlxcXi9nLFwiXFxcXG1hdGhiYiBSXlwiKTtcblx0XHRwV2lraUNvZGUgPSBwV2lraUNvZGUucmVwbGFjZSgvXFxcXFI8L2csXCJcXFxcbWF0aGJiIFI8XCIpO1xuXHRcdHBXaWtpQ29kZSA9IHBXaWtpQ29kZS5yZXBsYWNlKC9cXFxcUlxccy9nLFwiXFxcXG1hdGhiYiBSIFwiKTtcblx0XHQvL3BXaWtpQ29kZSA9dGhpcy5yZXBsYWNlU3RyaW5nKHBXaWtpQ29kZSwnXFxcXCcsJ1xcbWF0aGJiIFIgXFxcXCcpO1xuXHRcdHJldHVybiBwV2lraUNvZGU7XG5cblx0fTtcblx0Ly8tLS0tRW5kIG9mIE1ldGhvZCBtYXRoMmpheCBEZWZpbml0aW9uXG5cblxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdC8vIyBQVUJMSUMgTWV0aG9kOiBtYXRoc3ltYm9scygpXG5cdC8vIyAgICB1c2VkIGluIENsYXNzOiBXaWtpQ29udmVydFxuXHQvLyMgUGFyYW1ldGVyOlxuXHQvLyMgICAgcFdpa2lDb2RlOlN0cmluZ1xuXHQvLyMgICAgcEZvcm1hdDpTdHJpbmdcblx0Ly8jIENvbW1lbnQ6XG5cdC8vIyAgICBDb252ZXJ0IG1hdGggc3ltYm9scyBmb3IgcHJvcGVyIGhhbmRsaW5nIGluIE1hdGhKYXhcblx0Ly8jIFJldHVybjogU3RyaW5nXG5cdC8vIyBjcmVhdGVkIHdpdGggSlNDQyAgMjAxNy8wMy8wNSAxODoxMzoyOFxuXHQvLyMgbGFzdCBtb2RpZmljYXRpb25zIDIwMTgvMDEvMjEgMTc6MTc6MThcblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5cdHRoaXMubWF0aHN5bWJvbHMgPSBmdW5jdGlvbiAocFdpa2lDb2RlKSB7XG5cdCAgLy8tLS0tRGVidWdnaW5nLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdCAgLy8gY29uc29sZS5sb2coXCJqcy93aWtpY29udmVydC5qcyAtIENhbGw6IG1hdGhzeW1ib2xzKHBXaWtpQ29kZTpTdHJpbmcpOlN0cmluZ1wiKTtcblx0ICAvLyBhbGVydChcImpzL3dpa2ljb252ZXJ0LmpzIC0gQ2FsbDogIG1hdGhzeW1ib2xzKHBXaWtpQ29kZTpTdHJpbmcpOlN0cmluZ1wiKTtcblx0ICAvLy0tLS1DcmVhdGUgT2JqZWN0L0luc3RhbmNlIG9mIFdpa2lDb252ZXJ0LS0tLVxuXHQgIC8vICAgIHZhciB2TXlJbnN0YW5jZSA9IG5ldyBXaWtpQ29udmVydCgpO1xuXHQgIC8vICAgIHBXaWtpQ29kZSA9IHZNeUluc3RhbmNlLm1hdGhzeW1ib2xzKHBXaWtpQ29kZSk7XG5cdCAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0cFdpa2lDb2RlID0gcFdpa2lDb2RlLnJlcGxhY2UoL1xcXFxSIC9nLFwiXFxcXG1hdGhiYiBSIFwiKTtcblx0XHRwV2lraUNvZGUgPSBwV2lraUNvZGUucmVwbGFjZSgvXFxcXFJcXF4vZyxcIlxcXFxtYXRoYmIgUl5cIik7XG5cdFx0cFdpa2lDb2RlID0gcFdpa2lDb2RlLnJlcGxhY2UoL1xcXFxSPC9nLFwiXFxcXG1hdGhiYiBSPFwiKTtcblx0XHRwV2lraUNvZGUgPSBwV2lraUNvZGUucmVwbGFjZSgvXFxcXFJcXHMvZyxcIlxcXFxtYXRoYmIgUiBcIik7XG5cdFx0Ly9wV2lraUNvZGUgPXRoaXMucmVwbGFjZVN0cmluZyhwV2lraUNvZGUsJ1xcXFwnLCdcXG1hdGhiYiBSIFxcXFwnKTtcblx0XHRyZXR1cm4gcFdpa2lDb2RlO1xuXG5cdH07XG5cdC8vLS0tLUVuZCBvZiBNZXRob2QgbWF0aDJqYXggRGVmaW5pdGlvblxuXG5cblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQvLyMgUFVCTElDIE1ldGhvZDogbWF0aDJyZXZlYWwoKVxuXHQvLyMgICAgdXNlZCBpbiBDbGFzczogV2lraUNvbnZlcnRcblx0Ly8jIFBhcmFtZXRlcjpcblx0Ly8jICAgIHBXaWtpQ29kZTpTdHJpbmdcblx0Ly8jIENvbW1lbnQ6XG5cdC8vIyAgICBDb252ZXJ0IG1hdGggc3ltYm9scyBmb3IgcHJvcGVyIGhhbmRsaW5nIGluIE1hdGhKYXhcblx0Ly8jIFJldHVybjogU3RyaW5nXG5cdC8vIyBjcmVhdGVkIHdpdGggSlNDQyAgMjAxNy8wMy8wNSAxODoxMzoyOFxuXHQvLyMgbGFzdCBtb2RpZmljYXRpb25zIDIwMTgvMDEvMjEgMTc6MTc6MThcblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5cdHRoaXMubWF0aDJyZXZlYWwgPSBmdW5jdGlvbiAocFdpa2lDb2RlKSB7XG5cdCAgLy8tLS0tRGVidWdnaW5nLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdCAgLy8gY29uc29sZS5sb2coXCJqcy93aWtpY29udmVydC5qcyAtIENhbGw6IG1hdGgycmV2ZWFsKHBXaWtpQ29kZTpTdHJpbmcpOlN0cmluZ1wiKTtcblx0ICAvLyBhbGVydChcImpzL3dpa2ljb252ZXJ0LmpzIC0gQ2FsbDogIG1hdGgycmV2ZWFsKHBXaWtpQ29kZTpTdHJpbmcpOlN0cmluZ1wiKTtcblx0ICAvLy0tLS1DcmVhdGUgT2JqZWN0L0luc3RhbmNlIG9mIFdpa2lDb252ZXJ0LS0tLVxuXHQgIC8vICAgIHZhciB2TXlJbnN0YW5jZSA9IG5ldyBXaWtpQ29udmVydCgpO1xuXHQgIC8vICAgIHBXaWtpQ29kZSA9IHZNeUluc3RhbmNlLm1hdGgycmV2ZWFsKHBXaWtpQ29kZSk7XG5cdCAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0Ly9wV2lraUNvZGUgPSBwV2lraUNvZGUucmVwbGFjZSgvXFxcXFIgL2csXCJcXFxcbWF0aGJiIFIgXCIpO1xuXHRcdC8vcFdpa2lDb2RlID10aGlzLnJlcGxhY2VTdHJpbmcocFdpa2lDb2RlLCdcXFxcJywnXFxtYXRoYmIgUiBcXFxcJyk7XG5cdFx0cmV0dXJuIHBXaWtpQ29kZTtcblxuXHR9O1xuXHQvLy0tLS1FbmQgb2YgTWV0aG9kIG1hdGgycmV2ZWFsKCkgRGVmaW5pdGlvblxuXG5cblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQvLyMgUFVCTElDIE1ldGhvZDogY29udmVydFdpa2kyTG9jYWwoKVxuXHQvLyMgICAgdXNlZCBpbiBDbGFzczogV2lraUNvbnZlcnRcblx0Ly8jIFBhcmFtZXRlcjpcblx0Ly8jICAgIHBDb250ZW50OlN0cmluZ1xuXHQvLyMgQ29tbWVudDpcblx0Ly8jICAgIGNvbnZlcnRXaWtpMkxvY2FsKCkgcmVwbGFjZXMgdGhlIE1lZGlhV2lraSBpbnRlcm5hbCBsaW5rcyB0byBsaW5rcyB0aGF0IHdvcmsgaW4gYSBsb2NhbCBIVE1MIGZpbGUuIFRoZSBwYXJzZWQgdk1lZGlhV2lraSBMaW5rc1xuXHQvLyMgUmV0dXJuOiBTdHJpbmdcblx0Ly8jIGNyZWF0ZWQgd2l0aCBKU0NDICAyMDE3LzAzLzA1IDE4OjEzOjI4XG5cdC8vIyBsYXN0IG1vZGlmaWNhdGlvbnMgMjAxOC8wMS8yMSAxNzoxNzoxOFxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cblx0dGhpcy5jb252ZXJ0V2lraTJMb2NhbCA9IGZ1bmN0aW9uIChwQ29udGVudCkge1xuXHQgIC8vLS0tLURlYnVnZ2luZy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQgIC8vIGNvbnNvbGUubG9nKFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBjb252ZXJ0V2lraTJMb2NhbChwQ29udGVudDpTdHJpbmcpOlN0cmluZ1wiKTtcblx0ICAvLyBhbGVydChcImpzL3dpa2ljb252ZXJ0LmpzIC0gQ2FsbDogY29udmVydFdpa2kyTG9jYWwocENvbnRlbnQ6U3RyaW5nKTpTdHJpbmdcIik7XG5cdCAgLy8tLS0tQ3JlYXRlIE9iamVjdC9JbnN0YW5jZSBvZiBXaWtpQ29udmVydC0tLS1cblx0ICAvLyAgICB2YXIgdk15SW5zdGFuY2UgPSBuZXcgV2lraUNvbnZlcnQoKTtcblx0ICAvLyAgICB2TXlJbnN0YW5jZS5jb252ZXJ0V2lraTJMb2NhbChwQ29udGVudCk7XG5cdCAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0XHRcdHBDb250ZW50ID0gdGhpcy5yZXBsYWNlV2lraUxpbmtzKHBDb250ZW50KTtcblx0XHRcdHZhciB2TWVkaWFBcnJheSA9IHRoaXMucGFyc2VXaWtpNE1lZGlhKHBDb250ZW50KTtcblx0XHRcdHRoaXMuY3JlYXRlTWVkaWFQYXJzZUpTT04odk1lZGlhQXJyYXkpO1xuXHQgICAgdGhpcy5kb3dubG9hZFdpa2lNZWRpYSh2TWVkaWFBcnJheSk7XG5cdCAgICBwQ29udGVudCA9IHRoaXMuY29udmVydE1lZGlhTGluazRXaWtpKHBDb250ZW50LHZNZWRpYUFycmF5KTtcblx0ICAgIHJldHVybiBwQ29udGVudDtcblxuXHR9O1xuXHQvLy0tLS1FbmQgb2YgTWV0aG9kIGNvbnZlcnRXaWtpMkxvY2FsIERlZmluaXRpb25cblxuXG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0Ly8jIFBVQkxJQyBNZXRob2Q6IHBhcnNlV2lraTRNZWRpYSgpXG5cdC8vIyAgICB1c2VkIGluIENsYXNzOiBXaWtpQ29udmVydFxuXHQvLyMgUGFyYW1ldGVyOlxuXHQvLyMgICAgcFdpa2lDb2RlOlN0cmluZ1xuXHQvLyMgQ29tbWVudDpcblx0Ly8jICAgIHBhcnNlV2lraTRNZWRpYSgpIHRoZSBwV2lraUNvZGUgYW5kIGV4dHJhY3QgdGhlIE1lZGlhIGFuZCBGaWxlIGxpbmtzLlxuXHQvLyMgUmV0dXJuOiBBcnJheVxuXHQvLyMgY3JlYXRlZCB3aXRoIEpTQ0MgIDIwMTcvMDMvMDUgMTg6MTM6Mjhcblx0Ly8jIGxhc3QgbW9kaWZpY2F0aW9ucyAyMDE4LzAxLzIxIDE3OjE3OjE4XG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuXHR0aGlzLnBhcnNlV2lraTRNZWRpYSA9IGZ1bmN0aW9uIChwV2lraUNvZGUpIHtcblx0ICAvLy0tLS1EZWJ1Z2dpbmctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0ICAvLyBjb25zb2xlLmxvZyhcImpzL3dpa2ljb252ZXJ0LmpzIC0gQ2FsbDogcGFyc2VXaWtpNE1lZGlhKHBXaWtpQ29kZTpTdHJpbmcpOkFycmF5XCIpO1xuXHQgIC8vIGFsZXJ0KFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBwYXJzZVdpa2k0TWVkaWEocFdpa2lDb2RlOlN0cmluZyk6QXJyYXlcIik7XG5cdCAgLy8tLS0tQ3JlYXRlIE9iamVjdC9JbnN0YW5jZSBvZiBXaWtpQ29udmVydC0tLS1cblx0ICAvLyAgICB2YXIgdk15SW5zdGFuY2UgPSBuZXcgV2lraUNvbnZlcnQoKTtcblx0ICAvLyAgICB2TXlJbnN0YW5jZS5wYXJzZVdpa2k0TWVkaWEocFdpa2lDb2RlKTtcblx0ICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdC8vIHRoZSBmb2xsb3dpbmcgY29kZSBpcyBwZXJmb3JtZWQgaW4gY2xlYW5fc291cmNlKClcblx0XHRcdC8vcFdpa2lDb2RlID0gdGhpcy5yZXBsYWNlU3RyaW5nKHBXaWtpQ29kZSxcIltbSW1hZ2U6XCIsXCJbW0ZpbGU6XCIpO1xuXHRcdFx0Ly9wV2lraUNvZGUgPSB0aGlzLnJlcGxhY2VTdHJpbmcocFdpa2lDb2RlLFwiW1tEYXRlaTpcIixcIltbRmlsZTpcIik7XG5cdFx0XHR2YXIgdk1lZGlhQXJyYXkgPSBbXTtcblx0XHRcdC8vICgxKSBmaW5kIHRoZSBpbWFnZSBzcGVjcyBcIm15X2ltYWdlLnBuZ3wzMzBweHx0aHVtYnxNeSBDYXB0aW9uXCIgaW4gXCJbW0ZpbGU6bXlfaW1hZ2UucG5nfDMzMHB4fHRodW1ifE15IENhcHRpb25dXVwiXG5cdCAgICAvL3ZhciB2U2VhcmNoID0gL1xcWyhGaWxlfERhdGVpfEltYWdlKTooW15cXHxdKikvO1xuXHRcdFx0Ly8gKDIpIGZpbmQganVzdCB0aGUgZmlsZW5hbWUgXCJteV9pbWFnZS5wbmdcIiBpbiBcIltbRmlsZTpteV9pbWFnZS5wbmd8MzMwcHh8dGh1bWJ8TXkgQ2FwdGlvbl1dXCJcblx0XHQgICAgdmFyIHZTZWFyY2ggPSAvXFxbKD86RmlsZXxJbWFnZXxEYXRlaSk6KFteXFx8XFxdXSspL2c7XG5cdFx0ICAgIC8vIFxcWyAgICAgICAgICAgICMgXCJbXCJcblx0XHQgICAgLy8gKD86ICAgICAgICAgICAgIyBub24tY2FwdHVyaW5nIGdyb3VwXG5cdFx0ICAgIC8vICBGaWxlfEltYWdlfERhdGVpICAgICAgICAjICAgXCJGaWxlXCIgb3IgXCJJbWFnZVwiIG9yIFwiRGF0ZWlcIlxuXHRcdCAgICAvLyApICAgICAgICAgICAgICAjIGVuZCBub24tY2FwdHVyaW5nIGdyb3VwXG5cdFx0ICAgIC8vOiAgICAgICAgICAgICAjIFwiOlwiXG5cdFx0ICAgIC8vKCAgICAgICAgICAgICAgIyBncm91cCAxXG5cdFx0ICAgIC8vICBbXlxcfFxcXV0rICAgICAgIyAgIGFueSBjaGFyYWN0ZXIgZXhjZXB0IFwifFwiIG9yIFwiXVwiIGF0IGxlYXN0IG9uY2Vcblx0XHQgICAgLy8gKSAgICAgICAgICAgICAgIyBlbmQgZ3JvdXAgMSAtIHRoaXMgd2lsbCBiZSB0aGUgaW1hZ2UncyBuYW1lXG5cdFx0ICAgIHZhciB2UmVzdWx0O1xuXHRcdCAgICB2YXIgdkNvdW50ID0wO1xuXHRcdCAgICB3aGlsZSAodlJlc3VsdCA9IHZTZWFyY2guZXhlYyhwV2lraUNvZGUpKSB7XG5cdFx0ICAgICAgdkNvdW50Kys7XG5cdCAgICAgIHZNZWRpYUFycmF5LnB1c2godlJlc3VsdFsxXSk7XG5cdCAgICAgIGNvbnNvbGUubG9nKFwiTWVkaWEgXCIrdkNvdW50K1wiOiAnXCIgKyB2UmVzdWx0WzFdICsgXCInIGZvdW5kXCIpO1xuXHQgICAgfTtcblx0ICAgIHJldHVybiB2TWVkaWFBcnJheTtcblxuXHR9O1xuXHQvLy0tLS1FbmQgb2YgTWV0aG9kIHBhcnNlV2lraTRNZWRpYSBEZWZpbml0aW9uXG5cblxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdC8vIyBQVUJMSUMgTWV0aG9kOiBjcmVhdGVNZWRpYVBhcnNlSlNPTigpXG5cdC8vIyAgICB1c2VkIGluIENsYXNzOiBXaWtpQ29udmVydFxuXHQvLyMgUGFyYW1ldGVyOlxuXHQvLyMgICAgdk1lZGlhQXJyYXk6QXJyYXlcblx0Ly8jIENvbW1lbnQ6XG5cdC8vIyAgICBjcmVhdGVNZWRpYVBhcnNlSlNPTih2TWVkaWFBcnJheTpBcnJheSkgY3JlYXRlcyBpbiB0aGlzLmFQYXJzZUpTT05bXCJtZWRpYVwiXT17fSBhIEhhc2hcblx0Ly8jICAgIHRoYXQgbWFwcyB0aGUgbG9jYWwgZmlsZSBwYXRoICdpbWFnZS9teV9pbWFnZS5wbmcnIHRvIHRoZSByZXBsYWNlIHBhdGhcblx0Ly8jICAgIHRoaXMuYVBhcnNlSlNPTltcIm1lZGlhXCJdW1wiaW1hZ2UvbXlfaW1hZ2UucG5nXCJdID0gXCJodHRwczovL2NvbW1vbnMud2lraW1lZGlhLm9yZy93aWtpL215X2ltYWdlLnBuZ1wiXG5cdC8vI1xuXHQvLyMgY3JlYXRlZCB3aXRoIEpTQ0MgIDIwMTcvMDMvMDUgMTg6MTM6Mjhcblx0Ly8jIGxhc3QgbW9kaWZpY2F0aW9ucyAyMDE4LzAxLzIxIDE3OjE3OjE4XG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuXHR0aGlzLmNyZWF0ZU1lZGlhUGFyc2VKU09OID0gZnVuY3Rpb24gKHBNZWRpYUFycmF5KSB7XG5cdCAgLy8tLS0tRGVidWdnaW5nLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdCAgLy8gY29uc29sZS5sb2coXCJqcy93aWtpY29udmVydC5qcyAtIENhbGw6IGNyZWF0ZU1lZGlhUGFyc2VKU09OKHZNZWRpYUFycmF5OkFycmF5KVwiKTtcblx0ICAvLyBhbGVydChcImpzL3dpa2ljb252ZXJ0LmpzIC0gQ2FsbDogY3JlYXRlTWVkaWFQYXJzZUpTT04odk1lZGlhQXJyYXk6QXJyYXkpXCIpO1xuXHQgIC8vLS0tLUNyZWF0ZSBPYmplY3QvSW5zdGFuY2Ugb2YgV2lraUNvbnZlcnQtLS0tXG5cdCAgLy8gICAgdmFyIHZNeUluc3RhbmNlID0gbmV3IFdpa2lDb252ZXJ0KCk7XG5cdCAgLy8gICAgdk15SW5zdGFuY2UuY3JlYXRlTWVkaWFQYXJzZUpTT04odk1lZGlhQXJyYXkpO1xuXHQgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdCAgICB2YXIgdk1lZGlhRmlsZSA9IFwiXCI7XG5cdCAgICB2YXIgdlN1YkRpciA9IFwiXCI7XG5cdCAgICB2YXIgdkxvY2FsSUQgPSBcIlwiO1xuXHRcdFx0dmFyIHZJRCA9IFwiXCI7XG5cdFx0XHR0aGlzLmNoZWNrUGFyc2VKU09OKFwibWVkaWFcIik7XG5cdFx0XHR0aGlzLmFQYXJzZUpTT05bXCJtZWRpYVwiXSA9IHt9O1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwTWVkaWFBcnJheS5sZW5ndGg7IGkrKykge1xuXHQgICAgICB2SUQgPSB0aGlzLmNvbnZlcnRXaWtpTWVkaWEySUQocE1lZGlhQXJyYXlbaV0pO1xuXHQgICAgICAvL3RoaXMuYVBhcnNlSlNPTlt2TWVkaWFBcnJheVtpXV0gPSB2TG9jYWxJRDtcblx0ICAgICAgdGhpcy5hUGFyc2VKU09OW1wibWVkaWFcIl1bdklEXSA9IHRoaXMuZ2V0SW1hZ2VQcm9wcyhwTWVkaWFBcnJheVtpXSk7XG5cdFx0XHRcdC8vIEhhc2ggY29udGFpbnMgYWxsIHByb3BlcnRpZXMgb2YgdGhlIGltYWdlXG5cdFx0XHRcdC8vXHRcInRpdGxlXCI6IFwiVGl0bGUgb2YgXCIrdk1lZGlhRmlsZSxcblx0XHRcdFx0Ly9cdFwiZmlsZVwiOiB2TWVkaWFGaWxlLFxuXHRcdFx0XHQvL1x0XCJzdWJkaXJcIjogdlN1YkRpciArIFwiL1wiLFxuXHRcdFx0XHQvL1x0XCJtZWRpYXN0cmluZ1wiOiBwTWVkaWFBcnJheVtpXSxcblx0XHRcdFx0Ly9cdFwidXJsXCI6IFwidXJsLXVuZGVmaW5lZFwiLFxuXHRcdFx0XHQvL1x0XCJhbGlnblwiOlwibGVmdFwiXG5cdFx0ICB9O1xuXG5cdH07XG5cdC8vLS0tLUVuZCBvZiBNZXRob2QgY3JlYXRlTWVkaWFQYXJzZUpTT04gRGVmaW5pdGlvblxuXG5cblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQvLyMgUFVCTElDIE1ldGhvZDogY2hlY2tQYXJzZUpTT04oKVxuXHQvLyMgICAgdXNlZCBpbiBDbGFzczogV2lraUNvbnZlcnRcblx0Ly8jIFBhcmFtZXRlcjpcblx0Ly8jICAgIHBIYXNoSUQ6U3RyaW5nXG5cdC8vIyBDb21tZW50OlxuXHQvLyMgICAgY2hlY2tQYXJzZUpTT04oKSBjaGVja3MgaWYgdGhlIEZpbGUgTGluayBkZWZpbml0aW9ucyBleGlzdHMgaW4gdGhlIHBXaWtpSGFzaFtcIm1lZGlhXCJdXG5cdC8vI1xuXHQvLyMgY3JlYXRlZCB3aXRoIEpTQ0MgIDIwMTcvMDMvMDUgMTg6MTM6Mjhcblx0Ly8jIGxhc3QgbW9kaWZpY2F0aW9ucyAyMDE4LzAxLzIxIDE3OjE3OjE4XG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuXHR0aGlzLmNoZWNrUGFyc2VKU09OID0gZnVuY3Rpb24gKHBIYXNoSUQpIHtcblx0ICAvLy0tLS1EZWJ1Z2dpbmctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0ICAvLyBjb25zb2xlLmxvZyhcImpzL3dpa2ljb252ZXJ0LmpzIC0gQ2FsbDogY2hlY2tQYXJzZUpTT04ocEhhc2hJRDpTdHJpbmcpXCIpO1xuXHQgIC8vIGFsZXJ0KFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBjaGVja1BhcnNlSlNPTihwSGFzaElEOlN0cmluZylcIik7XG5cdCAgLy8tLS0tQ3JlYXRlIE9iamVjdC9JbnN0YW5jZSBvZiBXaWtpQ29udmVydC0tLS1cblx0ICAvLyAgICB2YXIgdk15SW5zdGFuY2UgPSBuZXcgV2lraUNvbnZlcnQoKTtcblx0ICAvLyAgICB2TXlJbnN0YW5jZS5jaGVja1BhcnNlSlNPTihwSGFzaElEKTtcblx0ICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRpZiAodGhpcy5hUGFyc2VKU09OW3BIYXNoSURdKSB7XG5cdCAgICBjb25zb2xlLmxvZyhcIlBhcnNlSlNPTlsnXCIrcEhhc2hJRCtcIiddICBleGlzdHMhXCIpO1xuXHQgIH0gZWxzZSB7XG5cdCAgICB0aGlzLmFQYXJzZUpTT05bcEhhc2hJRF0gPSB7fTtcblx0ICB9O1xuXHR9O1xuXHQvLy0tLS1FbmQgb2YgTWV0aG9kIGNoZWNrUGFyc2VKU09OIERlZmluaXRpb25cblxuXG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0Ly8jIFBVQkxJQyBNZXRob2Q6IGdldE1lZGlhU3ViRGlyKClcblx0Ly8jICAgIHVzZWQgaW4gQ2xhc3M6IFdpa2lDb252ZXJ0XG5cdC8vIyBQYXJhbWV0ZXI6XG5cdC8vIyAgICBwTWVkaWFMaW5rOlN0cmluZ1xuXHQvLyMgQ29tbWVudDpcblx0Ly8jICAgIGdldE1lZGlhU3ViRGlyKHBNZWRpYUxpbmspIHJldHVybiBmb3IgYSBwTWVkaWFMaW5rIHRoZSBhcHByb3ByaWF0ZSBzdWJkaXJlY3RvcnkuXG5cdC8vI1xuXHQvLyMgY3JlYXRlZCB3aXRoIEpTQ0MgIDIwMTcvMDMvMDUgMTg6MTM6Mjhcblx0Ly8jIGxhc3QgbW9kaWZpY2F0aW9ucyAyMDE4LzAxLzIxIDE3OjE3OjE4XG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuXHR0aGlzLmdldE1lZGlhU3ViRGlyID0gZnVuY3Rpb24gKHBNZWRpYUxpbmspIHtcblx0ICAvLy0tLS1EZWJ1Z2dpbmctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0ICAvLyBjb25zb2xlLmxvZyhcImpzL3dpa2ljb252ZXJ0LmpzIC0gQ2FsbDogZ2V0TWVkaWFTdWJEaXIocE1lZGlhTGluazpTdHJpbmcpXCIpO1xuXHQgIC8vIGFsZXJ0KFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBnZXRNZWRpYVN1YkRpcihwTWVkaWFMaW5rOlN0cmluZylcIik7XG5cdCAgLy8tLS0tQ3JlYXRlIE9iamVjdC9JbnN0YW5jZSBvZiBXaWtpQ29udmVydC0tLS1cblx0ICAvLyAgICB2YXIgdk15SW5zdGFuY2UgPSBuZXcgV2lraUNvbnZlcnQoKTtcblx0ICAvLyAgICB2TXlJbnN0YW5jZS5nZXRNZWRpYVN1YkRpcihwTWVkaWFMaW5rKTtcblx0ICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdHZhciB2TWVkaWFGaWxlID0gXCJcIjtcblx0ICAgIHZhciB2U3ViRGlyID0gXCJcIjtcblx0ICAgIGlmIChwTWVkaWFMaW5rKSB7XG5cdCAgICAgIHZTdWJEaXIgPSB0aGlzLmdldE1lZGlhU3ViRGlyKHBNZWRpYUxpbmspO1xuXHQgICAgICB2TWVkaWFGaWxlID0gdGhpcy5jb252ZXJ0V2lraU1lZGlhMkZpbGUocE1lZGlhTGluayk7XG5cdCAgICAgIHZTdWJEaXIgID0gdlN1YkRpciArIFwiL1wiICsgdk1lZGlhRmlsZVxuXHQgICAgfTtcblx0XHRcdHJldHVybiB2U3ViRGlyO1xuXHR9O1xuXHQvLy0tLS1FbmQgb2YgTWV0aG9kIGdldE1lZGlhU3ViRGlyIERlZmluaXRpb25cblxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdC8vIyBQVUJMSUMgTWV0aG9kOiBjb3JyZWN0X2ZpbGVuYW1lKClcblx0Ly8jICAgIHVzZWQgaW4gQ2xhc3M6IFdpa2lDb252ZXJ0XG5cdC8vIyBQYXJhbWV0ZXI6XG5cdC8vIyAgICBwRmlsZW5hbWU6U3RyaW5nXG5cdC8vIyBSZXR1cm46IFN0cmluZ1xuXHQvLyMgQ29tbWVudDpcblx0Ly8jICAgIGNvbnZlcnQgZmlsZW5hbWUgdG8gbG9jYWwgZmlsZW5hbWVcblx0Ly8jXG5cdC8vIyBjcmVhdGVkIHdpdGggSlNDQyAgMjAxNy8wMy8wNSAxODoxMzoyOFxuXHQvLyMgbGFzdCBtb2RpZmljYXRpb25zIDIwMTgvMDEvMjEgMTc6MTc6MThcblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHR0aGlzLmNvcnJlY3RfZmlsZW5hbWUgPSBmdW5jdGlvbiAocEZpbGVOYW1lKSB7XG5cdFx0cEZpbGVOYW1lID0gcEZpbGVOYW1lLnJlcGxhY2UoL1teXFwvXFxcXEEtWmEtejAtOVxcLl0vZyxcIl9cIik7XG5cdFx0cEZpbGVOYW1lID0gcEZpbGVOYW1lLnJlcGxhY2UoL1tfXSsvZyxcIl9cIik7XG5cdFx0cmV0dXJuIHBGaWxlTmFtZVxuXHR9XG5cblxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdC8vIyBQVUJMSUMgTWV0aG9kOiBnZXRNZWRpYVN1YkRpcigpXG5cdC8vIyAgICB1c2VkIGluIENsYXNzOiBXaWtpQ29udmVydFxuXHQvLyMgUGFyYW1ldGVyOlxuXHQvLyMgICAgcEZpbGVuYW1lOlN0cmluZ1xuXHQvLyMgUmV0dXJuOiBTdHJpbmdcblx0Ly8jIENvbW1lbnQ6XG5cdC8vIyAgICBnZXQgU3ViZGlyZWN0b3J5IGFjY29yZGluZyB0byBmaWxlIGV4dGVuc2lvblxuXHQvLyNcblx0Ly8jIGNyZWF0ZWQgd2l0aCBKU0NDICAyMDE3LzAzLzA1IDE4OjEzOjI4XG5cdC8vIyBsYXN0IG1vZGlmaWNhdGlvbnMgMjAxOC8wMS8yMSAxNzoxNzoxOFxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdHRoaXMuZ2V0TWVkaWFTdWJEaXIgPSBmdW5jdGlvbiAocEZpbGVOYW1lKSB7XG5cdFx0aWYgKHBGaWxlTmFtZSkge1xuXHRcdFx0dGhpcy5jb3JyZWN0X2ZpbGVuYW1lKHBGaWxlTmFtZSlcblx0XHR9O1xuXHRcdHJldHVybiBwRmlsZU5hbWU7XG5cdH1cblxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdC8vIyBQVUJMSUMgTWV0aG9kOiBjb252ZXJ0V2lraU1lZGlhMkZpbGUoKVxuXHQvLyMgICAgdXNlZCBpbiBDbGFzczogV2lraUNvbnZlcnRcblx0Ly8jIFBhcmFtZXRlcjpcblx0Ly8jICAgIHBNZWRpYUxpbms6U3RyaW5nXG5cdC8vIyBDb21tZW50OlxuXHQvLyMgICAgY29udmVydFdpa2lNZWRpYTJGaWxlKHBNZWRpYUxpbmspIGNvbnZlcnRzIHRoZSBwTWVkaWFMaW5rIGludG8gYW4gVVJMIGFuZCByZXR1cm5zIHRoZSBtZWRpYSBsaW5rLlxuXHQvLyMgICAgcmVtb3ZlcyBibGFua3MgYXQgdGhlIHRhaWwgYW5kIHJlcGxhY2VzIGJsYW5rcyB3aXRoIGFuZCB1bmRlcnNjb3JlIFwiX1wiXG5cdC8vIyAgICBhbmQgbm9uLWFscGhhLW51bWVyaWNhbCBjaGFyYWN0ZXJzIHdpdGggYW4gdW5kZXJzY29yZSwgc28gdGhhdCBmaW5hbGx5IHRoZSBmaWxlbmFtZSB3b3JrcyBmaW5lIG9uIGFsbCBmaWxlIHN5c3RlbXNcblx0Ly8jIFJldHVybjogU3RyaW5nXG5cdC8vIyBjcmVhdGVkIHdpdGggSlNDQyAgMjAxNy8wMy8wNSAxODoxMzoyOFxuXHQvLyMgbGFzdCBtb2RpZmljYXRpb25zIDIwMTgvMDEvMjEgMTc6MTc6MThcblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5cdHRoaXMuY29udmVydFdpa2lNZWRpYTJGaWxlID0gZnVuY3Rpb24gKHBNZWRpYUxpbmspIHtcblx0ICAvLy0tLS1EZWJ1Z2dpbmctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0ICAvLyBjb25zb2xlLmxvZyhcImpzL3dpa2ljb252ZXJ0LmpzIC0gQ2FsbDogY29udmVydFdpa2lNZWRpYTJGaWxlKHBNZWRpYUxpbms6U3RyaW5nKTpTdHJpbmdcIik7XG5cdCAgLy8gYWxlcnQoXCJqcy93aWtpY29udmVydC5qcyAtIENhbGw6IGNvbnZlcnRXaWtpTWVkaWEyRmlsZShwTWVkaWFMaW5rOlN0cmluZyk6U3RyaW5nXCIpO1xuXHQgIC8vLS0tLUNyZWF0ZSBPYmplY3QvSW5zdGFuY2Ugb2YgV2lraUNvbnZlcnQtLS0tXG5cdCAgLy8gICAgdmFyIHZNeUluc3RhbmNlID0gbmV3IFdpa2lDb252ZXJ0KCk7XG5cdCAgLy8gICAgdk15SW5zdGFuY2UuY29udmVydFdpa2lNZWRpYTJGaWxlKHBNZWRpYUxpbmspO1xuXHQgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdHZhciB2TWVkaWFGaWxlID0gXCJcIjtcblxuXHRcdHZhciB2UGF0aFNwbGl0ID0gcE1lZGlhTGluay5zcGxpdChcIi9cIik7XG5cdFx0aWYgKHZQYXRoU3BsaXQubGVuZ3RoID4wKSB7XG5cdFx0XHR2TWVkaWFGaWxlID0gdlBhdGhTcGxpdFt2UGF0aFNwbGl0Lmxlbmd0aC0xXTtcblx0XHRcdC8vdk1lZGlhRmlsZSA9IHRoaXMuY29ycmVjdF9maWxlbmFtZSh2TWVkaWFGaWxlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc29sZS5sb2coXCJFUlJPUjogcE1lZGlhTGluaz0nXCIrcE1lZGlhTGluaytcIicgaXMgbm90IGRlZmluZWRcIik7XG5cdFx0fTtcblx0ICByZXR1cm4gdk1lZGlhRmlsZTtcblxuXHR9O1xuXHQvLy0tLS1FbmQgb2YgTWV0aG9kIGNvbnZlcnRXaWtpTWVkaWEyRmlsZSBEZWZpbml0aW9uXG5cblxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdC8vIyBQVUJMSUMgTWV0aG9kOiBjb252ZXJ0V2lraU1lZGlhMlVSTCgpXG5cdC8vIyAgICB1c2VkIGluIENsYXNzOiBXaWtpQ29udmVydFxuXHQvLyMgUGFyYW1ldGVyOlxuXHQvLyMgICAgcE1lZGlhTGluazpTdHJpbmdcblx0Ly8jIENvbW1lbnQ6XG5cdC8vIyAgICBjb252ZXJ0V2lraU1lZGlhMlVSTChwTWVkaWFMaW5rKSByZW1vdmVzIGJsYW5rcyBhdCB0aGUgdGFpbCBhbmQgcmVwbGFjZXMgYmxhbmtzIHdpdGggYW5kIHVuZGVyc2NvcmUgXCJfXCJcblx0Ly8jIFJldHVybjogU3RyaW5nXG5cdC8vIyBjcmVhdGVkIHdpdGggSlNDQyAgMjAxNy8wMy8wNSAxODoxMzoyOFxuXHQvLyMgbGFzdCBtb2RpZmljYXRpb25zIDIwMTgvMDEvMjEgMTc6MTc6MThcblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5cdHRoaXMuY29udmVydFdpa2lNZWRpYTJVUkwgPSBmdW5jdGlvbiAocE1lZGlhTGluaykge1xuXHQgIC8vLS0tLURlYnVnZ2luZy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQgIC8vIGNvbnNvbGUubG9nKFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBjb252ZXJ0V2lraU1lZGlhMlVSTChwTWVkaWFMaW5rOlN0cmluZyk6U3RyaW5nXCIpO1xuXHQgIC8vIGFsZXJ0KFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBjb252ZXJ0V2lraU1lZGlhMlVSTChwTWVkaWFMaW5rOlN0cmluZyk6U3RyaW5nXCIpO1xuXHQgIC8vLS0tLUNyZWF0ZSBPYmplY3QvSW5zdGFuY2Ugb2YgV2lraUNvbnZlcnQtLS0tXG5cdCAgLy8gICAgdmFyIHZNeUluc3RhbmNlID0gbmV3IFdpa2lDb252ZXJ0KCk7XG5cdCAgLy8gICAgdk15SW5zdGFuY2UuY29udmVydFdpa2lNZWRpYTJVUkwocE1lZGlhTGluayk7XG5cdCAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0ICAgIHBNZWRpYUxpbmsgPSBwTWVkaWFMaW5rLnJlcGxhY2UoL1sgXFx0XSskLyxcIlwiKTtcblx0ICAgIHBNZWRpYUxpbmsgPSBwTWVkaWFMaW5rLnJlcGxhY2UoLyAvZyxcIl9cIik7XG5cdCAgICAvL2NvbnNvbGUubG9nKFwiTWVkaWFMaW5rOiAnXCIrcE1lZGlhTGluaytcIidcIik7XG5cdCAgICByZXR1cm4gcE1lZGlhTGluaztcblxuXHR9O1xuXHQvLy0tLS1FbmQgb2YgTWV0aG9kIGNvbnZlcnRXaWtpTWVkaWEyVVJMIERlZmluaXRpb25cblxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdC8vIyBQVUJMSUMgTWV0aG9kOiBjb252ZXJ0V2lraU1lZGlhMklEKClcblx0Ly8jICAgIHVzZWQgaW4gQ2xhc3M6IFdpa2lDb252ZXJ0XG5cdC8vIyBQYXJhbWV0ZXI6XG5cdC8vIyAgICBwTWVkaWFMaW5rOlN0cmluZ1xuXHQvLyMgQ29tbWVudDpcblx0Ly8jICAgIGNvbnZlcnRXaWtpTWVkaWEySUQocE1lZGlhTGluaykgcmVtb3ZlcyBibGFua3MgYXQgdGhlIHRhaWwgYW5kIHJlcGxhY2VzIGJsYW5rcyB3aXRoIGFuZCB1bmRlcnNjb3JlIFwiX1wiXG5cdC8vIyBSZXR1cm46IFN0cmluZ1xuXHQvLyMgY3JlYXRlZCB3aXRoIEpTQ0MgIDIwMTcvMDMvMDUgMTg6MTM6Mjhcblx0Ly8jIGxhc3QgbW9kaWZpY2F0aW9ucyAyMDE4LzAxLzIxIDE3OjE3OjE4XG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuXHR0aGlzLmNvbnZlcnRXaWtpTWVkaWEySUQgPSBmdW5jdGlvbiAocE1lZGlhTGluaykge1xuXHQgIC8vLS0tLURlYnVnZ2luZy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQgIC8vIGNvbnNvbGUubG9nKFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBjb252ZXJ0V2lraU1lZGlhMklEKHBNZWRpYUxpbms6U3RyaW5nKTpTdHJpbmdcIik7XG5cdCAgLy8gYWxlcnQoXCJqcy93aWtpY29udmVydC5qcyAtIENhbGw6IGNvbnZlcnRXaWtpTWVkaWEySUQocE1lZGlhTGluazpTdHJpbmcpOlN0cmluZ1wiKTtcblx0ICAvLy0tLS1DcmVhdGUgT2JqZWN0L0luc3RhbmNlIG9mIFdpa2lDb252ZXJ0LS0tLVxuXHQgIC8vICAgIHZhciB2TXlJbnN0YW5jZSA9IG5ldyBXaWtpQ29udmVydCgpO1xuXHQgIC8vICAgIHZNeUluc3RhbmNlLmNvbnZlcnRXaWtpTWVkaWEySUQocE1lZGlhTGluayk7XG5cdCAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0ICAgIHBNZWRpYUxpbmsgPSB0aGlzLmNvbnZlcnRXaWtpTWVkaWEyVVJMKHBNZWRpYUxpbmspO1xuXHQgICAgcE1lZGlhTGluayA9IHBNZWRpYUxpbmsucmVwbGFjZSgvW15BLVphLXowLTlfXS9nLFwiX1wiKTtcblx0XHRcdHBNZWRpYUxpbmsgPSBwTWVkaWFMaW5rLnJlcGxhY2UoL1tfXSsvZyxcIl9cIik7XG5cdCAgICAvL2NvbnNvbGUubG9nKFwiTWVkaWFMaW5rOiAnXCIrcE1lZGlhTGluaytcIidcIik7XG5cdCAgICByZXR1cm4gcE1lZGlhTGluaztcblxuXHR9O1xuXHQvLy0tLS1FbmQgb2YgTWV0aG9kIGNvbnZlcnRXaWtpTWVkaWEySUQgRGVmaW5pdGlvblxuXG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0Ly8jIFBVQkxJQyBNZXRob2Q6IGRvd25sb2FkV2lraU1lZGlhKClcblx0Ly8jICAgIHVzZWQgaW4gQ2xhc3M6IFdpa2lDb252ZXJ0XG5cdC8vIyBQYXJhbWV0ZXI6XG5cdC8vIyAgICBwTWVkaWFBcnJheTpBcnJheVxuXHQvLyMgQ29tbWVudDpcblx0Ly8jICAgIGRvd25sb2FkV2lraU1lZGlhKHBNZWRpYUFycmF5OkFycmF5KSBkb3dubG9hZCB0aGUgaW1hZ2VzIHRvIGxldmVsLWZzXG5cdC8vIyAgICB0aGF0IGNhbiBiZSBleHBvcnRlZCBhcyBaSVAtZmlsZSB3aXRoIGFyY2hpdmVyIE5QTSBtb2R1bGVcblx0Ly8jXG5cdC8vIyBjcmVhdGVkIHdpdGggSlNDQyAgMjAxNy8wMy8wNSAxODoxMzoyOFxuXHQvLyMgbGFzdCBtb2RpZmljYXRpb25zIDIwMTgvMDEvMjEgMTc6MTc6MThcblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5cdHRoaXMuZG93bmxvYWRXaWtpTWVkaWEgPSBmdW5jdGlvbiAocE1lZGlhQXJyYXkpIHtcblx0ICAvLy0tLS1EZWJ1Z2dpbmctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0ICAvLyBjb25zb2xlLmxvZyhcImpzL3dpa2ljb252ZXJ0LmpzIC0gQ2FsbDogZG93bmxvYWRXaWtpTWVkaWEocE1lZGlhQXJyYXk6QXJyYXkpXCIpO1xuXHQgIC8vIGFsZXJ0KFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBkb3dubG9hZFdpa2lNZWRpYShwTWVkaWFBcnJheTpBcnJheSlcIik7XG5cdCAgLy8tLS0tQ3JlYXRlIE9iamVjdC9JbnN0YW5jZSBvZiBXaWtpQ29udmVydC0tLS1cblx0ICAvLyAgICB2YXIgdk15SW5zdGFuY2UgPSBuZXcgV2lraUNvbnZlcnQoKTtcblx0ICAvLyAgICB2TXlJbnN0YW5jZS5kb3dubG9hZFdpa2lNZWRpYShwTWVkaWFBcnJheSk7XG5cdCAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0ICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcE1lZGlhQXJyYXkubGVuZ3RoOyBpKyspIHtcblx0ICAgICAgdGhpcy5kb3dubG9hZE1lZGlhRmlsZShwTWVkaWFBcnJheVtpXSk7XG5cdCAgICB9O1xuXG5cdH07XG5cdC8vLS0tLUVuZCBvZiBNZXRob2QgZG93bmxvYWRXaWtpTWVkaWEgRGVmaW5pdGlvblxuXG5cblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQvLyMgUFVCTElDIE1ldGhvZDogZG93bmxvYWRNZWRpYUZpbGUoKVxuXHQvLyMgICAgdXNlZCBpbiBDbGFzczogV2lraUNvbnZlcnRcblx0Ly8jIFBhcmFtZXRlcjpcblx0Ly8jICAgIHBNZWRpYUxpbms6U3RyaW5nXG5cdC8vIyBDb21tZW50OlxuXHQvLyMgICAgZG93bmxvYWRNZWRpYUZpbGUocE1lZGlhRmlsZSkgZnJvbSBXaWtpTWVkaWEgQ29tbW9ucyB0byB0aGUgbG9jYWwgZmlsZXN5c3RlbSBlbXVsYXRlZCB3aXRoIGxldmVsLWZzXG5cdC8vI1xuXHQvLyMgY3JlYXRlZCB3aXRoIEpTQ0MgIDIwMTcvMDMvMDUgMTg6MTM6Mjhcblx0Ly8jIGxhc3QgbW9kaWZpY2F0aW9ucyAyMDE4LzAxLzIxIDE3OjE3OjE4XG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuXHR0aGlzLmRvd25sb2FkTWVkaWFGaWxlID0gZnVuY3Rpb24gKHBNZWRpYUxpbmspIHtcblx0ICAvLy0tLS1EZWJ1Z2dpbmctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0ICAvLyBjb25zb2xlLmxvZyhcImpzL3dpa2ljb252ZXJ0LmpzIC0gQ2FsbDogZG93bmxvYWRNZWRpYUZpbGUocE1lZGlhTGluazpTdHJpbmcpXCIpO1xuXHQgIC8vIGFsZXJ0KFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBkb3dubG9hZE1lZGlhRmlsZShwTWVkaWFMaW5rOlN0cmluZylcIik7XG5cdCAgLy8tLS0tQ3JlYXRlIE9iamVjdC9JbnN0YW5jZSBvZiBXaWtpQ29udmVydC0tLS1cblx0ICAvLyAgICB2YXIgdk15SW5zdGFuY2UgPSBuZXcgV2lraUNvbnZlcnQoKTtcblx0ICAvLyAgICB2TXlJbnN0YW5jZS5kb3dubG9hZE1lZGlhRmlsZShwTWVkaWFMaW5rKTtcblx0ICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHR2YXIgdlN1YkRpciA9IHRoaXMuZ2V0TWVkaWFTdWJEaXIocE1lZGlhTGluayk7XG5cdFx0Ly8gY29udmVydFdpa2lNZWRpYTJGaWxlIFwiaHR0cDovL3d3dyxzcnYub3JnL2ltZy9teV9pbWFnZS5wbmdcIiB0byAgXCJteV9pbWFnZS5wbmdcIlxuXHRcdHZhciB2TWVkaWFGaWxlID0gdGhpcy5jb252ZXJ0V2lraU1lZGlhMkZpbGUocE1lZGlhTGluayk7XG5cdFx0Ly8gYWRkIGEgc3ViZGlyZWN0b3J5IGFjY29yZGluZyB0byBmaWxlIHR5cGVcblx0XHQvLyBlLmcuXCJteV9pbWFnZS5wbmdcIiB0byBcImltZy9teV9pbWFnZS5wbmdcIlxuXHRcdC8vIG9yICBcIm15X211c2ljLm1wM1wiIHRvIFwiYXVkaW8vbXlfbXVzaWMubXAzXCJcblx0XHQvLyBvciAgXCJteV92aWRlby53ZWJtXCIgdG8gXCJ2aWRlby9teV92aWRlby53ZWJtXCJcblx0XHR2YXIgdkxvY2FsTGluayA9IHZTdWJEaXIgKyBcIi9cIiArIHZNZWRpYUZpbGU7XG5cdFx0dmFyIHZXR0VUX0NNRCA9IFwid2dldCAtTyBcIiArIHRoaXMuYVByb2plY3REaXIgKyBcIi9cIiArIHZMb2NhbExpbmsgKyBcIiBcIisgcE1lZGlhTGluaztcblx0XHRjb25zb2xlLmxvZyhcIkNBTEwgV0dFVDogXCIrdldHRVRfQ01EK1wiIChlLmcuIGluIE5vZGVKUylcIik7XG5cdFx0Ly9cblx0ICBjb25zb2xlLmxvZyhcIkRvd25sb2FkIE1lZGlhIEZpbGUgJ1wiK3BNZWRpYUxpbmsrXCInIHRvIGZvbGRlciAnXCIrdGhpcy5hUHJvamVjdERpcitcIicgbm90IGltcGxlbWVudGVkIHlldFwiKTtcblxuXHR9O1xuXHQvLy0tLS1FbmQgb2YgTWV0aG9kIGRvd25sb2FkTWVkaWFGaWxlIERlZmluaXRpb25cblxuXG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0Ly8jIFBVQkxJQyBNZXRob2Q6IGNvbnZlcnRNZWRpYUxpbms0V2lraSgpXG5cdC8vIyAgICB1c2VkIGluIENsYXNzOiBXaWtpQ29udmVydFxuXHQvLyMgUGFyYW1ldGVyOlxuXHQvLyMgICAgcENvbnRlbnQ6U3RyaW5nXG5cdC8vIyAgICBwTWVkaWFBcnJheTpBcnJheVxuXHQvLyMgQ29tbWVudDpcblx0Ly8jICAgIGNvbnZlcnRNZWRpYUxpbms0V2lraShwQ29udGVudCxwTWVkaWFXaWtpKSBjb252ZXJ0IHRoZSBsaW5rXG5cdC8vIyAgICAtIFtbRmlsZTpNeUZpbGUucG5nLi4uLiAgIHdpdGhcblx0Ly8jICAgIC0gW0ZpbGU6aHR0cHM6Ly9jb21tb25zLndpa2ltZWRpYS5vcmcvLi4uL015RmlsZS5wbmdcblx0Ly8jIFJldHVybjogU3RyaW5nXG5cdC8vIyBjcmVhdGVkIHdpdGggSlNDQyAgMjAxNy8wMy8wNSAxODoxMzoyOFxuXHQvLyMgbGFzdCBtb2RpZmljYXRpb25zIDIwMTgvMDEvMjEgMTc6MTc6MThcblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5cdHRoaXMuY29udmVydE1lZGlhTGluazRXaWtpID0gZnVuY3Rpb24gKHBXaWtpQ29kZSxwTWVkaWFBcnJheSkge1xuXHQgIC8vLS0tLURlYnVnZ2luZy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQgIGNvbnNvbGUubG9nKFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBjb252ZXJ0TWVkaWFMaW5rNFdpa2kocFdpa2lDb2RlOlN0cmluZyxwTWVkaWFBcnJheTpBcnJheSk6U3RyaW5nXCIpO1xuXHQgIC8vIGFsZXJ0KFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBjb252ZXJ0TWVkaWFMaW5rNFdpa2kocENvbnRlbnQ6U3RyaW5nLHBNZWRpYUFycmF5OkFycmF5KTpTdHJpbmdcIik7XG5cdCAgLy8tLS0tQ3JlYXRlIE9iamVjdC9JbnN0YW5jZSBvZiBXaWtpQ29udmVydC0tLS1cblx0ICAvLyAgICB2YXIgdk15SW5zdGFuY2UgPSBuZXcgV2lraUNvbnZlcnQoKTtcblx0ICAvLyAgICB2TXlJbnN0YW5jZS5jb252ZXJ0TWVkaWFMaW5rNFdpa2kocENvbnRlbnQscE1lZGlhQXJyYXkpO1xuXHQgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdCAgICB2YXIgdlJlcGxhY2VMaW5rO1xuXHQgICAgdmFyIHZNZWRpYUZpbGU7XG5cdCAgICB2YXIgdlN1YkRpcjtcblx0XHRcdHZhciB2TGlua0hUTUw7XG5cblx0ICAgIHBXaWtpQ29kZSA9IHBXaWtpQ29kZS5yZXBsYWNlKC9cXFsoRmlsZXxJbWFnZXxEYXRlaSk6L2dpLFwiW0ZpbGU6XCIpO1xuXG5cdCAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBNZWRpYUFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgIHZTdWJEaXIgPSB0aGlzLmdldE1lZGlhU3ViRGlyKHBNZWRpYUFycmF5W2ldKTtcblx0XHRcdFx0Ly8gY29udmVydFdpa2lNZWRpYTJGaWxlIFwiaHR0cDovL3d3dyxzcnYub3JnL2ltZy9teV9pbWFnZS5wbmdcIiB0byAgXCJteV9pbWFnZS5wbmdcIlxuXHQgICAgICB2TWVkaWFGaWxlID0gdGhpcy5jb252ZXJ0V2lraU1lZGlhMkZpbGUocE1lZGlhQXJyYXlbaV0pO1xuXHRcdFx0XHQvLyBhZGQgYSBzdWJkaXJlY3RvcnkgYWNjb3JkaW5nIHRvIGZpbGUgdHlwZVxuXHRcdFx0XHQvLyBlLmcuXCJteV9pbWFnZS5wbmdcIiB0byBcImltZy9teV9pbWFnZS5wbmdcIlxuXHRcdFx0XHQvLyBvciAgXCJteV9tdXNpYy5tcDNcIiB0byBcImF1ZGlvL215X211c2ljLm1wM1wiXG5cdFx0XHRcdC8vIG9yICBcIm15X3ZpZGVvLndlYm1cIiB0byBcInZpZGVvL215X3ZpZGVvLndlYm1cIlxuXHQgICAgICB2UmVwbGFjZUxpbmsgPSB2U3ViRGlyICsgXCIvXCIgKyB2TWVkaWFGaWxlO1xuXG5cdFx0XHRcdHBXaWtpQ29kZSA9IHRoaXMucmVwbGFjZVN0cmluZyhwV2lraUNvZGUsXCJGaWxlOlwiK3BNZWRpYUFycmF5W2ldLFwiRmlsZTpcIit2UmVwbGFjZUxpbmspO1xuXHQgICAgfTtcblx0ICAgIHJldHVybiBwV2lraUNvZGU7XG5cblx0fTtcblx0Ly8tLS0tRW5kIG9mIE1ldGhvZCBjb252ZXJ0TWVkaWFMaW5rNFdpa2kgRGVmaW5pdGlvblxuXG5cblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQvLyMgUFVCTElDIE1ldGhvZDogcmVwbGFjZVN0cmluZygpXG5cdC8vIyAgICB1c2VkIGluIENsYXNzOiBXaWtpQ29udmVydFxuXHQvLyMgUGFyYW1ldGVyOlxuXHQvLyMgICAgcFN0cmluZzpTdHJpbmdcblx0Ly8jICAgIHBTZWFyY2g6U3RyaW5nXG5cdC8vIyAgICBwUmVwbGFjZTpTdHJpbmdcblx0Ly8jIENvbW1lbnQ6XG5cdC8vIyAgICByZXBsYWNlU3RyaW5nKHBTdHJpbmcscFNlYXJjaCxwUmVwbGFjZSkgcmVwbGFjZXMgZ2xvYmFsbHkgcFNlYXJjaCBieSBwUmVwbGFjZSBhbmQgcmV0dXJucyB0aGUgbW9kaWZpZWQgc3RyaW5nXG5cdC8vIyBSZXR1cm46IFN0cmluZ1xuXHQvLyMgY3JlYXRlZCB3aXRoIEpTQ0MgIDIwMTcvMDMvMDUgMTg6MTM6Mjhcblx0Ly8jIGxhc3QgbW9kaWZpY2F0aW9ucyAyMDE4LzAxLzIxIDE3OjE3OjE4XG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuXHR0aGlzLnJlcGxhY2VTdHJpbmcgPSBmdW5jdGlvbiAocFN0cmluZyxwU2VhcmNoLHBSZXBsYWNlKSB7XG5cdCAgLy8tLS0tRGVidWdnaW5nLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdCAgLy8gY29uc29sZS5sb2coXCJqcy93aWtpY29udmVydC5qcyAtIENhbGw6IHJlcGxhY2VTdHJpbmcocFN0cmluZzpTdHJpbmcscFNlYXJjaDpTdHJpbmcscFJlcGxhY2U6U3RyaW5nKTpTdHJpbmdcIik7XG5cdCAgLy8gYWxlcnQoXCJqcy93aWtpY29udmVydC5qcyAtIENhbGw6IHJlcGxhY2VTdHJpbmcocFN0cmluZzpTdHJpbmcscFNlYXJjaDpTdHJpbmcscFJlcGxhY2U6U3RyaW5nKTpTdHJpbmdcIik7XG5cdCAgLy8tLS0tQ3JlYXRlIE9iamVjdC9JbnN0YW5jZSBvZiBXaWtpQ29udmVydC0tLS1cblx0ICAvLyAgICB2YXIgdk15SW5zdGFuY2UgPSBuZXcgV2lraUNvbnZlcnQoKTtcblx0ICAvLyAgICB2TXlJbnN0YW5jZS5yZXBsYWNlU3RyaW5nKHBTdHJpbmcscFNlYXJjaCxwUmVwbGFjZSk7XG5cdCAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0ICBcdC8vYWxlcnQoXCJjc3RyaW5nLmpzIC0gcmVwbGFjZVN0cmluZygpIFwiK3BTdHJpbmcpO1xuXHQgIFx0aWYgKCFwU3RyaW5nKSB7XG5cdCAgXHRcdGFsZXJ0KFwicmVwbGFjZVN0cmluZygpLUNhbGwgLSBwU3RyaW5nIG5vdCBkZWZpbmVkIVwiKTtcblx0ICBcdH0gZWxzZSBpZiAocFN0cmluZyAhPSAnJykge1xuXHRcdFx0XHQvL2FsZXJ0KFwiY3N0cmluZy5qcyAtIHJlcGxhY2VTdHJpbmcoKSBcIitwU3RyaW5nKTtcblx0XHRcdFx0dmFyIHZIZWxwU3RyaW5nID0gJyc7XG5cdFx0XHRcdHZhciB2TiA9IHBTdHJpbmcuaW5kZXhPZihwU2VhcmNoKTtcblx0XHRcdFx0dmFyIHZSZXR1cm5TdHJpbmcgPSAnJztcblx0XHRcdFx0d2hpbGUgKHZOID49IDApIHtcblx0XHRcdFx0XHRpZiAodk4gPiAwKVxuXHRcdFx0XHRcdFx0dlJldHVyblN0cmluZyArPSBwU3RyaW5nLnN1YnN0cmluZygwLCB2Tik7XG5cdFx0XHRcdFx0XHR2UmV0dXJuU3RyaW5nICs9IHBSZXBsYWNlO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHZOICsgcFNlYXJjaC5sZW5ndGggPCBwU3RyaW5nLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRwU3RyaW5nID0gcFN0cmluZy5zdWJzdHJpbmcodk4rcFNlYXJjaC5sZW5ndGgsIHBTdHJpbmcubGVuZ3RoKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRwU3RyaW5nID0gJydcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHZOID0gcFN0cmluZy5pbmRleE9mKHBTZWFyY2gpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXR1cm4gdlJldHVyblN0cmluZyArIHBTdHJpbmc7XG5cdFx0XHR9O1xuXHR9O1xuXHQvLy0tLS1FbmQgb2YgTWV0aG9kIHJlcGxhY2VTdHJpbmcgRGVmaW5pdGlvblxuXG5cblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQvLyMgUFVCTElDIE1ldGhvZDogY29udmVydFdpa2kyT25saW5lKClcblx0Ly8jICAgIHVzZWQgaW4gQ2xhc3M6IFdpa2lDb252ZXJ0XG5cdC8vIyBQYXJhbWV0ZXI6XG5cdC8vIyAgICBwQ29udGVudDpTdHJpbmdcblx0Ly8jIENvbW1lbnQ6XG5cdC8vIyAgICBjb252ZXJ0V2lraTJPbmxpbmUocENvbnRlbnQpIGNvbnZlcnRzIHRoZSBMaW5rcyBhbmQgTWVkaWEgaW4gd2F5IHNvIHRoYXQgbWVkaWEgYW5kIGxpbmtzXG5cdC8vIyAgICBhcmUgcmVmZXJlbmNlZCB0byBvbmxpbmUgcmVzb3VyY2UgdG8gdGhlIHNlcnZlclxuXHQvLyMgUmV0dXJuOiBTdHJpbmdcblx0Ly8jIGNyZWF0ZWQgd2l0aCBKU0NDICAyMDE3LzAzLzA1IDE4OjEzOjI4XG5cdC8vIyBsYXN0IG1vZGlmaWNhdGlvbnMgMjAxOC8wMS8yMSAxNzoxNzoxOFxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cblx0dGhpcy5jb252ZXJ0V2lraTJPbmxpbmUgPSBmdW5jdGlvbiAocENvbnRlbnQpIHtcblx0ICAvLy0tLS1EZWJ1Z2dpbmctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0ICAvLyBjb25zb2xlLmxvZyhcImpzL3dpa2ljb252ZXJ0LmpzIC0gQ2FsbDogY29udmVydFdpa2kyT25saW5lKHBDb250ZW50OlN0cmluZyk6U3RyaW5nXCIpO1xuXHQgIC8vIGFsZXJ0KFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiBjb252ZXJ0V2lraTJPbmxpbmUocENvbnRlbnQ6U3RyaW5nKTpTdHJpbmdcIik7XG5cdCAgLy8tLS0tQ3JlYXRlIE9iamVjdC9JbnN0YW5jZSBvZiBXaWtpQ29udmVydC0tLS1cblx0ICAvLyAgICB2YXIgdk15SW5zdGFuY2UgPSBuZXcgV2lraUNvbnZlcnQoKTtcblx0ICAvLyAgICB2TXlJbnN0YW5jZS5jb252ZXJ0V2lraTJPbmxpbmUocENvbnRlbnQpO1xuXHQgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdCAgICB2YXIgdk1lZGlhQXJyYXkgPSB0aGlzLnBhcnNlV2lraTRNZWRpYShwQ29udGVudCk7XG5cdCAgICAvLyB0aGlzLmRvd25sb2FkV2lraU1lZGlhKHZNZWRpYUFycmF5KTtcblx0ICAgIHBDb250ZW50ID0gdGhpcy5jb252ZXJ0TWVkaWFMaW5rNFdpa2lPbmxpbmUocENvbnRlbnQsdk1lZGlhQXJyYXkpO1xuXHQgICAgcENvbnRlbnQgPSB0aGlzLnJlcGxhY2VXaWtpTGlua3MocENvbnRlbnQpO1xuXHQgICAgcmV0dXJuIHBDb250ZW50O1xuXG5cdH07XG5cdC8vLS0tLUVuZCBvZiBNZXRob2QgY29udmVydFdpa2kyT25saW5lIERlZmluaXRpb25cblxuXG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0Ly8jIFBVQkxJQyBNZXRob2Q6IHJlcGxhY2VXaWtpTGlua3MoKVxuXHQvLyMgICAgdXNlZCBpbiBDbGFzczogV2lraUNvbnZlcnRcblx0Ly8jIFBhcmFtZXRlcjpcblx0Ly8jICAgIHBXaWtpQ29kZTpTdHJpbmdcblx0Ly8jIENvbW1lbnQ6XG5cdC8vIyAgICBDb21tZW50IGZvciByZXBsYWNlV2lraUxpbmtzXG5cdC8vIyBSZXR1cm46IFN0cmluZ1xuXHQvLyMgY3JlYXRlZCB3aXRoIEpTQ0MgIDIwMTcvMDMvMDUgMTg6MTM6Mjhcblx0Ly8jIGxhc3QgbW9kaWZpY2F0aW9ucyAyMDE4LzAxLzIxIDE3OjE3OjE4XG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuXHR0aGlzLnJlcGxhY2VXaWtpTGlua3MgPSBmdW5jdGlvbiAocFdpa2lDb2RlKSB7XG5cdCAgLy8tLS0tRGVidWdnaW5nLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdCAgY29uc29sZS5sb2coXCJqcy93aWtpY29udmVydC5qcyAtIENhbGw6IHJlcGxhY2VXaWtpTGlua3MocFdpa2lDb2RlOlN0cmluZyk6U3RyaW5nXCIpO1xuXHQgIC8vIGFsZXJ0KFwianMvd2lraWNvbnZlcnQuanMgLSBDYWxsOiByZXBsYWNlV2lraUxpbmtzKHBXaWtpQ29kZTpTdHJpbmcpOlN0cmluZ1wiKTtcblx0ICAvLy0tLS1DcmVhdGUgT2JqZWN0L0luc3RhbmNlIG9mIFdpa2lDb252ZXJ0LS0tLVxuXHQgIC8vICAgIHZhciB2TXlJbnN0YW5jZSA9IG5ldyBXaWtpQ29udmVydCgpO1xuXHQgIC8vICAgIHZNeUluc3RhbmNlLnJlcGxhY2VXaWtpTGlua3MocFdpa2lDb2RlKTtcblx0ICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHQgICAgdmFyIHZMaW5rQXJyYXkgPSB0aGlzLmdldFdpa2lMaW5rcyhwV2lraUNvZGUpO1xuXHQgICAgdmFyIHZVUkwsVGl0bGUsdkxpbmssdkxvY2FsTGluaztcblx0ICAgIHZhciB2UGlwZVBvcyA9IDA7XG5cdFx0XHR2YXIgdkNvbG9uUG9zID0gMDtcblx0XHRcdHRoaXMuYU1lZGlhQXJyYXkgPSBbXTtcblx0ICAgIHRoaXMuY2hlY2tQYXJzZUpTT04oXCJsaW5rc1wiKTtcblx0XHRcdHZhciB2Q291bnQgPSAwO1xuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2TGlua0FycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdCAgICAgIHZMaW5rID0gdkxpbmtBcnJheVtpXTtcblx0ICAgICAgdlBpcGVQb3MgPSB2TGluay5pbmRleE9mKFwifFwiKTtcblx0XHRcdFx0aWYgKHZQaXBlUG9zPjApIHtcblx0XHRcdFx0XHQvL1dpa2ktTGluayAxOiAnL0JpcmRzL3xTd2FybSBvZiBCaXJkcycgZm91bmRcblx0XHRcdFx0XHQvL1dpa2ktTGluayAyOiAnV2F0ZXJ8V2F0ZXIgTGVhcm5pbmcgUmVzb3VyY2UnIGZvdW5kXG5cdFx0XHRcdFx0Ly9XaWtpLUxpbmsgMzogJ3c6V2F0ZXJ8V2F0ZXIgV2lraXBlZGlhJyBmb3VuZFxuXHRcdFx0XHRcdC8vV2lraS1MaW5rIDQ6ICd2OldhdGVyfFdhdGVyIFdpa2l2ZXJzaXR5JyBmb3VuZFxuXHRcdFx0XHRcdHZVUkwgPSB2TGluay5zdWJzdHIoMCx2UGlwZVBvcyk7XG5cdFx0XHRcdFx0dlRpdGxlID0gdkxpbmsuc3Vic3RyKHZQaXBlUG9zKzEsdkxpbmsubGVuZ3RoKTtcblx0ICAgICAgfSBlbHNlIHtcblx0XHRcdFx0XHQvL1dpa2ktTGluayAxOiAnU3dhcm0gSW50ZWxsaWdlbmNlJyBmb3VuZFxuXHRcdFx0XHRcdC8vV2lraS1MaW5rIDI6ICdXYXRlcicgZm91bmRcblx0XHRcdFx0XHQvL1dpa2ktTGluayAzOiAnL0JpcmRzLycgZm91bmRcblx0XHRcdFx0ICB2VVJMID0gdkxpbms7XG5cdCAgICAgICAgdlRpdGxlID0gdkxpbmsucmVwbGFjZSgvXFwvL2csXCJcIik7XG5cdCAgICAgIH07XG5cdFx0XHRcdC8vV2lraS1MaW5rIDE6ICd3OldhdGVyfFdhdGVyIFdpa2lwZWRpYScgZm91bmRcblx0XHRcdFx0Ly9XaWtpLUxpbmsgNDogJ1dpa2l2ZXJzaXR5OldhdGVyfFdhdGVyIFdpa2l2ZXJzaXR5JyBmb3VuZFxuXHRcdFx0XHR2Q29sb25Qb3MgPSB2VVJMLmluZGV4T2YoXCI6XCIpO1xuXHRcdFx0XHRpZiAodkNvbG9uUG9zID4gMCkge1xuXHRcdFx0XHRcdC8vZm9yIFdpa2lwZWRpYTpXYXRlciB2TGlua1NwbGl0WzBdPSBcIldpa2lwZWRpYVwiIC0+IGlzIGEgbm90IGludGVyd2lraWxpbmtcblx0XHRcdFx0XHQvLyBsaW5rIGNvbnRhaW5zIGNvbG9uIFwiOlwiXG5cdFx0XHRcdFx0dmFyIHZDb2xvblByZWZpeCA9IHZVUkwuc3Vic3RyKDAsdkNvbG9uUG9zKTtcblx0XHRcdFx0XHQvL3ZDb2xvblByZWZpeCB3LHYsV2lraXBlZGlhLHdpa2l2ZXJzaXR5IEludGVyd2lraSBMaW5rXG5cdFx0XHRcdFx0aWYgKHZDb2xvblByZWZpeC50b0xvd2VyQ2FzZSgpID09IFwiY2F0ZWdvcnlcIikge1xuXHRcdFx0XHRcdFx0Ly8gW1tDYXRlZ29yeTpSaXNrIG1hbmFnZW1lbnRdXVxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJDYXRlZ29yeSB3aXRoIExvY2FsIFdpa2kgTGluayAnXCIrdlVSTCtcIicgZm91bmRcIik7XG5cdFx0XHRcdFx0XHR2VVJMID0gdGhpcy5nZXRXaWtpRGlzcGxheVVSTCh2VVJMKTtcblx0XHRcdFx0XHRcdHZMb2NhbExpbmsgPSBcIltcIit2VVJMK1wiIFwiK3ZUaXRsZStcIl1cIjtcblx0XHRcdCAgICAgIC8vcFdpa2lDb2RlID0gdGhpcy5yZXBsYWNlU3RyaW5nKHBXaWtpQ29kZSxcIltbXCIrdkxpbmsrXCJdXVwiLHZMb2NhbExpbmspO1xuXHRcdFx0XHRcdCAgLy8gZm9yIHJldmVyc2UgcmVwbGFjZW1lbnQgdG8gb25saW5lIFdpa2lwZWRpYSBvciBXaWtpdmVyc2l0eSBzdG9yZSByZXBsYWNlbWVudCBpbiBQYXJzZUpTT05cblx0XHRcdFx0XHQgIHRoaXMuYVBhcnNlSlNPTltcImxpbmtzXCJdW3ZMb2NhbExpbmtdID0gXCJbXCIrdkxpbmsrXCJdXCI7XG5cdFx0XHRcdCBcdH0gZWxzZSBpZiAodGhpcy5hRmlsZVByZWZpeC5oYXNPd25Qcm9wZXJ0eSh2Q29sb25QcmVmaXgpKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlVSTDogJ1wiK3ZVUkwrXCInIGlzIGFuIGltYWdlLCBkbyBub3QgcmVwbGFjZSBieSBVUkwgdGV4dCByZWZlcmVuY2UuXCIpO1xuXHRcdFx0XHRcdFx0dGhpcy5hTWVkaWFBcnJheS5wdXNoKHZVUkwpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5hTWFwLmhhc093blByb3BlcnR5KHZDb2xvblByZWZpeCkpIHtcblx0XHRcdFx0XHRcdC8vIGRvIHNvbWV0aGluZyBmb3IgaW50ZXJ3aWtpIGxpbmtzXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkludGVyIFdpa2kgTGluayAnXCIrdlVSTCtcIicgZm91bmRcIik7XG5cdFx0XHRcdFx0XHR2VVJMID0gdGhpcy5nZXRXaWtpRGlzcGxheVVSTCh2VVJMKTtcblx0XHRcdFx0XHRcdHZMb2NhbExpbmsgPSBcIltcIit2VVJMK1wiIFwiK3ZUaXRsZStcIl1cIjtcblx0XHRcdCAgICAgIHBXaWtpQ29kZSA9IHRoaXMucmVwbGFjZVN0cmluZyhwV2lraUNvZGUsXCJbW1wiK3ZMaW5rK1wiXV1cIix2TG9jYWxMaW5rKTtcblx0XHRcdCAgICAgIC8vIGZvciByZXZlcnNlIHJlcGxhY2VtZW50IHRvIG9ubGluZSBXaWtpcGVkaWEgb3IgV2lraXZlcnNpdHkgc3RvcmUgcmVwbGFjZW1lbnQgaW4gUGFyc2VKU09OXG5cdFx0XHQgICAgICB0aGlzLmFQYXJzZUpTT05bXCJsaW5rc1wiXVt2TG9jYWxMaW5rXSA9IFwiW1wiK3ZMaW5rK1wiXVwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkxvY2FsIFdpa2kgTGluayAnXCIrdlVSTCtcIicgZm91bmRcIik7XG5cdFx0XHRcdFx0dlVSTCA9IHRoaXMuZ2V0V2lraURpc3BsYXlVUkwodlVSTCk7XG5cdFx0ICAgICAgdkxvY2FsTGluayA9IFwiW1wiK3ZVUkwrXCIgXCIrdlRpdGxlK1wiXVwiO1xuXHRcdCAgICAgIHBXaWtpQ29kZSA9IHRoaXMucmVwbGFjZVN0cmluZyhwV2lraUNvZGUsXCJbW1wiK3ZMaW5rK1wiXV1cIix2TG9jYWxMaW5rKTtcblx0XHQgICAgICAvLyBmb3IgcmV2ZXJzZSByZXBsYWNlbWVudCB0byBvbmxpbmUgV2lraXBlZGlhIG9yIFdpa2l2ZXJzaXR5IHN0b3JlIHJlcGxhY2VtZW50IGluIFBhcnNlSlNPTlxuXHRcdCAgICAgIHRoaXMuYVBhcnNlSlNPTltcImxpbmtzXCJdW3ZMb2NhbExpbmtdID0gXCJbXCIrdkxpbmsrXCJdXCI7XG5cdFx0XHRcdH07XG5cdFx0ICB9O1xuXHRcdFx0Ly8gUmVwbGFjZSBFeHRlcm5hbCBMaW5rczogW2h0dHA6Ly93d3cuZXhhbXBsZS5jb20gRXhhbXBsZSBTZXJ2ZXJdXG5cdFx0XHQvLyB2YXIgZXh0ZXJuYWxfbGlua3MgPSAvXFxbKGh0dHBzOlxcL1xcL3xodHRwOlxcL1xcLykoW2EtekEtWjAtOV0uW15cXHNdKikgKFthLXpBLVowLTldLlteXFxdXSopXFxdL2c7XG5cdFx0XHQvLyBwV2lraUNvZGUgPSBwV2lraUNvZGUucmVwbGFjZShleHRlcm5hbF9saW5rcywgJzxhIGhyZWY9XCIkMSQyXCIgdGFyZ2V0PVwiX2JsYW5rXCI+JDM8L2E+Jyk7XG5cblx0ICAgIHJldHVybiBwV2lraUNvZGU7XG5cdH07XG5cdC8vLS0tLUVuZCBvZiBNZXRob2QgcmVwbGFjZVdpa2lMaW5rcyBEZWZpbml0aW9uXG5cblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQvLyMgUFVCTElDIE1ldGhvZDogZ2V0V2lraURpc3BsYXlVUkwoKVxuXHQvLyMgICAgdXNlZCBpbiBDbGFzczogV2lraUNvbnZlcnRcblx0Ly8jIFBhcmFtZXRlcjpcblx0Ly8jICAgIHBXaWtpQ29kZTpTdHJpbmdcblx0Ly8jIENvbW1lbnQ6XG5cdC8vIyAgICBleHBhbmQgYSBsb2NhbCBsaW5rIHRvIHRoZSBmdWxsIFdpa2kgRGlzcGxheSBVUkxcblx0Ly8jIFJldHVybjogU3RyaW5nXG5cdC8vIyBjcmVhdGVkIHdpdGggSlNDQyAgMjAxNy8wMy8wNSAxODoxMzoyOFxuXHQvLyMgbGFzdCBtb2RpZmljYXRpb25zIDIwMTgvMDEvMjEgMTc6MTc6MThcblx0Ly8jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5cdHRoaXMuZ2V0V2lraURpc3BsYXlVUkw9IGZ1bmN0aW9uIChwTGluaykge1xuXHRcdHZhciB2TGFuZ3VhZ2UgPSB0aGlzLmFMYW5ndWFnZTtcblx0XHR2YXIgdlNlcnZlciAgPSB0aGlzLmFMYW5ndWFnZStcIi5cIit0aGlzLmFEb21haW4rXCIub3JnXCI7XG5cdFx0Y29uc29sZS5sb2coXCJnZXRXaWtpRGlzcGxheVVSTCgnXCIrcExpbmsrXCInKSB2U2VydmVyPSdcIit2U2VydmVyK1wiJ1wiKTtcblx0XHR2YXIgdk1hcCA9IHRoaXMuYU1hcDtcblx0XHRwTGluayA9IHBMaW5rIHx8IFwidW5kZWZpbmVkIGxpbmtcIjtcblx0XHRwTGluayA9IHRoaXMucmVwbGFjZVN0cmluZyhwTGluayxcIiBcIixcIl9cIik7XG5cdFx0dmFyIHZMaW5rQXJyID0gcExpbmsuc3BsaXQoXCI6XCIpO1xuXHRcdC8vIHBMaW5rID0gXCJXaWtpcGVkaWE6V2F0ZXJcIlxuXHRcdHZhciB2QXJ0aWNsZSA9IHBMaW5rO1xuXHRcdC8vIHZBcnRpY2xlID0gXCJXYXRlclwiXG5cdFx0aWYgKHZMaW5rQXJyLmxlbmd0aCA9PSAyKSB7XG5cdFx0XHQvLyBXaWtpcGVkaWE6U3dhcm1faW50ZWxsaWdlbmNlXG5cdFx0XHQvLyB3OlN3YXJtX2ludGVsbGlnZW5jZVxuXHRcdFx0Ly8gL1NsaW1lX21vbGQvXG5cdFx0XHQvLyBDYXRlZ29yeTpSaXNrIE1hbmFnZW1lbnRcblx0XHRcdGlmICgodkxpbmtBcnJbMF0pLnRvTG93ZXJDYXNlKCkgPT0gXCJjYXRlZ29yeVwiKSB7XG5cdFx0XHRcdC8vIENhdGVnb3J5OlJpc2sgTWFuYWdlbWVudFxuXHRcdFx0XHR2QXJ0aWNsZSA9IHBMaW5rIHx8IFwidW5kZWZpbmVkX3dpa2lfbGlua1wiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gdzpTd2FybV9pbnRlbGxpZ2VuY2Vcblx0XHRcdFx0dlNlcnZlciA9IHZMYW5ndWFnZSArIFwiLlwiICsgdk1hcFt2TGlua0FyclswXV0rXCIub3JnXCI7XG5cdFx0XHRcdHZBcnRpY2xlID0gdkxpbmtBcnJbMV0gfHwgXCJ1bmRlZmluZWRfd2lraV9saW5rXCI7XG5cdFx0XHR9O1xuXG5cdFx0fSBlbHNlIGlmICh2TGlua0Fyci5sZW5ndGggPT0gMykge1xuXHRcdFx0Ly8gdzplbjpTd2FybV9pbnRlbGxpZ2VuY2Vcblx0XHRcdC8vIFtbV2lraXBlZGlhOkNhdGVnb3J5OlJpc2sgTWFuYWdlbWVudF1dXG5cdFx0XHR2YXIgdkxpbmtMYW5ndWFnZSA9IHRoaXMuYUxhbmd1YWdlO1xuXHRcdFx0dmFyIHZMaW5rRG9tYWluID0gdGhpcy5hRG9tYWluO1xuXHRcdFx0aWYgKCh2TGlua0FyclsxXSkudG9Mb3dlckNhc2UoKSA9PSBcImNhdGVnb3J5XCIpIHtcblx0XHRcdFx0Ly8gW1tXaWtpcGVkaWE6Q2F0ZWdvcnk6UmlzayBNYW5hZ2VtZW50XV1cblx0XHRcdFx0dkFydGljbGUgPSB2TGlua0FyclsxXStcIjpcIit2TGlua0FyclsyXSB8fCBcInVuZGVmaW5lZF9jYXRlZ29yeVwiO1xuXHRcdFx0XHQvLyB2QXJ0aWNsZSA9IFwiQ2F0ZWdvcnk6UmlzayBNYW5hZ2VtZW50XCJcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZBcnRpY2xlID0gdkxpbmtBcnJbMl0gfHwgXCJ1bmRlZmluZWRfd2lraV9saW5rXCI7XG5cdFx0XHRcdC8vIHc6ZW46U3dhcm1faW50ZWxsaWdlbmNlXG5cdFx0XHRcdHZMaW5rTGFuZ3VhZ2UgPSB2TGlua0FyclsxXTsgICAgIC8vIHZMaW5rQXJyWzFdID0gXCJlblwiXG5cdFx0XHRcdHZMaW5rRG9tYWluID0gdk1hcFt2TGlua0FyclswXV07IC8vIG1hcCBcIndcIiB0byBcIndpa2lwZWRpYVwiXG5cdFx0XHR9O1xuXHRcdFx0dlNlcnZlciA9IHZMaW5rTGFuZ3VhZ2UgKyBcIi5cIiArIHZMaW5rRG9tYWluICtcIi5vcmdcIjtcblx0XHR9IGVsc2UgaWYgKHZBcnRpY2xlLmluZGV4T2YoXCIvXCIpPT0wKSB7XG5cdFx0XHQvLyBMaW5rOiBcIi9TbGltZSBtb2xkL1wiXG5cdFx0XHR2QXJ0aWNsZSA9IHRoaXMuYVdpa2lUaXRsZSt2QXJ0aWNsZTtcblx0XHRcdC8vIExpbms6IFwiU3dhcm0gaW50ZWxsaWdlbmNlL1NsaW1lIG1vbGQvIFwiXG5cdFx0XHR2QXJ0aWNsZSA9IHZBcnRpY2xlLnJlcGxhY2UoL1tcXC9cXHNdKyQvaSxcIlwiKTtcblx0XHRcdC8vIExpbms6IFwiU3dhcm0gaW50ZWxsaWdlbmNlL1NsaW1lIG1vbGRcIlxuXHRcdH07XG5cdFx0dkFydGljbGUgPSB0aGlzLnJlcGxhY2VTdHJpbmcodkFydGljbGUsXCIgXCIsXCJfXCIpO1xuXHRcdC8vIExpbms6IFwiU3dhcm1faW50ZWxsaWdlbmNlL1NsaW1lX21vbGRcIlxuXHRcdHJldHVybiBcImh0dHBzOi8vXCIrdlNlcnZlcitcIi93aWtpL1wiK3ZBcnRpY2xlO1xuXHR9O1xuXG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0Ly8jIFBVQkxJQyBNZXRob2Q6IGdldFdpa2lNZWRpYVVSTCgpXG5cdC8vIyAgICB1c2VkIGluIENsYXNzOiBXaWtpQ29udmVydFxuXHQvLyMgUGFyYW1ldGVyOlxuXHQvLyMgICAgcEZpbGVOYW1lOlN0cmluZ1xuXHQvLyMgQ29tbWVudDpcblx0Ly8jXG5cdC8vIyBSZXR1cm46IFN0cmluZ1xuXHQvLyMgY3JlYXRlZCB3aXRoIEpTQ0MgIDIwMTcvMDMvMDUgMTg6MTM6Mjhcblx0Ly8jIGxhc3QgbW9kaWZpY2F0aW9ucyAyMDE4LzAxLzIxIDE3OjE3OjE4XG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0dGhpcy5nZXRXaWtpTWVkaWFVUkwgPSBmdW5jdGlvbihwRmlsZU5hbWUpIHtcblx0XHRwRmlsZU5hbWUgPSBwRmlsZU5hbWUucmVwbGFjZSgvXlxcW1xcWyhGaWxlfEltYWdlfERhdGVpKTovZ2ksXCJcIik7XG5cdFx0cEZpbGVOYW1lID0gcEZpbGVOYW1lLnJlcGxhY2UoL1tcXF1dKyQvZ2ksXCJcIik7XG5cdFx0cEZpbGVOYW1lID0gcEZpbGVOYW1lLnJlcGxhY2UoL1xccy9nLFwiX1wiKTtcblx0XHRyZXR1cm4gdGhpcy5hTWVkaWFQYXRoK3BGaWxlTmFtZTtcblx0fTtcblxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdC8vIyBQVUJMSUMgTWV0aG9kOiBnZXRXaWtpRGlzcGxheVVSTCgpXG5cdC8vIyAgICB1c2VkIGluIENsYXNzOiBXaWtpQ29udmVydFxuXHQvLyMgUGFyYW1ldGVyOlxuXHQvLyMgICAgcEZpbGVuYW1lOlN0cmluZ1xuXHQvLyMgQ29tbWVudDpcblx0Ly8jXG5cdC8vIyBSZXR1cm46IFN0cmluZ1xuXHQvLyMgY3JlYXRlZCB3aXRoIEpTQ0MgIDIwMTcvMDMvMDUgMTg6MTM6Mjhcblx0Ly8jIGxhc3QgbW9kaWZpY2F0aW9ucyAyMDE4LzAxLzIxIDE3OjE3OjE4XG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuXHR0aGlzLmdldE1lZGlhRmlsZVR5cGUgPSBmdW5jdGlvbiAocEZpbGVOYW1lKSB7XG5cdFx0dmFyIHZUeXBlID0gXCJub25lXCI7XG5cdFx0aWYgKCAvXFwuKGpwZT9nfHBuZ3xnaWZ8Ym1wKSQvaS50ZXN0KHBGaWxlTmFtZSkgKSB7XG5cdFx0XHR2VHlwZSA9IFwiaW1nXCI7XG5cdFx0fTtcblx0XHRpZiAoIC9cXC4oc3ZnKSQvaS50ZXN0KHBGaWxlTmFtZSkgKSB7XG5cdFx0XHR2VHlwZSA9IFwic3ZnXCI7XG5cdFx0fTtcblx0XHRpZiAoIC9cXC4obXA0fHdlYm18bW92fGF2aXxtcGU/Z3xvZ3YpJC9pLnRlc3QocEZpbGVOYW1lKSApIHtcblx0XHRcdHZUeXBlID0gXCJ2aWRlb1wiO1xuXHRcdH07XG5cdFx0aWYgKCAvXFwuKG1wM3x3YXZ8b2dnfG1pZCkkL2kudGVzdChwRmlsZU5hbWUpICkge1xuXHRcdFx0dlR5cGUgPSBcImF1ZGlvXCI7XG5cdFx0fTtcblx0XHRyZXR1cm4gdlR5cGVcblx0fVxuXG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0Ly8jIFBVQkxJQyBNZXRob2Q6IGdldFdpa2lMaW5rcygpXG5cdC8vIyAgICB1c2VkIGluIENsYXNzOiBXaWtpQ29udmVydFxuXHQvLyMgUGFyYW1ldGVyOlxuXHQvLyMgICAgcFdpa2lDb2RlOlN0cmluZ1xuXHQvLyMgQ29tbWVudDpcblx0Ly8jICAgIGdldFdpa2lMaW5rcyhwV2lraUNvZGUpIGV4dHJhY3QgRG91YmxlLUJyYWNrZXQgW1suLi5dXSBsaW5rIGluIHBXaWtpQ29kZVxuXHQvLyMgUmV0dXJuOiBTdHJpbmdcblx0Ly8jIGNyZWF0ZWQgd2l0aCBKU0NDICAyMDE3LzAzLzA1IDE4OjEzOjI4XG5cdC8vIyBsYXN0IG1vZGlmaWNhdGlvbnMgMjAxOC8wMS8yMSAxNzoxNzoxOFxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cblx0dGhpcy5nZXRXaWtpTGlua3MgPSBmdW5jdGlvbiAocFdpa2lDb2RlKSB7XG5cdCAgLy8tLS0tRGVidWdnaW5nLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdCAgLy8gY29uc29sZS5sb2coXCJqcy93aWtpY29udmVydC5qcyAtIENhbGw6IGdldFdpa2lMaW5rcyhwV2lraUNvZGU6U3RyaW5nKTpTdHJpbmdcIik7XG5cdCAgLy8gYWxlcnQoXCJqcy93aWtpY29udmVydC5qcyAtIENhbGw6IGdldFdpa2lMaW5rcyhwV2lraUNvZGU6U3RyaW5nKTpTdHJpbmdcIik7XG5cdCAgLy8tLS0tQ3JlYXRlIE9iamVjdC9JbnN0YW5jZSBvZiBXaWtpQ29udmVydC0tLS1cblx0ICAvLyAgICB2YXIgdk15SW5zdGFuY2UgPSBuZXcgV2lraUNvbnZlcnQoKTtcblx0ICAvLyAgICB2TXlJbnN0YW5jZS5nZXRXaWtpTGlua3MocFdpa2lDb2RlKTtcblx0ICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHQgICAgLy8gV2lraSBMaW5rcyBhcmUgb3BlbiB3aXRoIFwiXCJcblx0ICAgIHZhciB2TGlua0FycmF5ID0gW107XG5cdCAgICAvL3ZhciB2U2VhcmNoID0gL1xcWyhGaWxlfERhdGVpfEltYWdlKTooW15cXHxdKikvO1xuXHQgICAgdmFyIHZTZWFyY2ggPSAvXFxbXFxbKFteXFxbXFxdXSspXFxdXFxdL2c7XG5cdCAgICAvLyBcXFtcXFsgICAgICAgICAjIFwiW1tcIlxuXHQgICAgLy8oICAgICAgICAgICAgICMgZ3JvdXAgMVxuXHQgICAgLy8gIFteXFxbXFxdXSsgICAgIyAgIGFueSBjaGFyYWN0ZXIgZXhjZXB0IFwiW1wiIGFuZCBcIl1cIiBcIjpcIiBhdCBsZWFzdCBvbmNlXG5cdCAgICAvLyApICAgICAgICAgICAgIyBlbmQgZ3JvdXAgMSAtIHRoaXMgd2lsbCBiZSB0aGUgaW1hZ2UncyBuYW1lXG5cdCAgICAvLyBcXF1cXF0gICAgICAgICAjIFwiXV1cIlxuXHQgICAgdmFyIHZSZXN1bHQ7XG5cdCAgICB2YXIgdkNvdW50ID0wO1xuXHRcdFx0dmFyIHZMaW5rID0gXCJcIjtcblx0XHRcdHZhciB2TGlua1NwbGl0O1xuXHRcdFx0dmFyIHZUeXBlID0gXCJcIjtcblx0XHRcdHdoaWxlICh2UmVzdWx0ID0gdlNlYXJjaC5leGVjKHBXaWtpQ29kZSkpIHtcblx0ICAgICAgdkNvdW50Kys7XG5cdFx0XHRcdHZMaW5rU3BsaXQgPSB2UmVzdWx0WzFdLnNwbGl0KFwiOlwiKTtcblx0XHRcdFx0aWYgKHZMaW5rU3BsaXQubGVuZ3RoID09IDEpIHtcblx0XHRcdFx0XHQvLyBsaW5rIGNvbnRhaW5zIG5vIGNvbG9uIFwiOlwiXG5cdFx0XHRcdFx0dkxpbmtBcnJheS5wdXNoKHZSZXN1bHRbMV0pO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuYU1hcC5oYXNPd25Qcm9wZXJ0eSh2TGlua1NwbGl0WzBdKSkge1xuXHRcdFx0XHRcdC8vZm9yIFdpa2lwZWRpYTpXYXRlciB2TGlua1NwbGl0WzBdPSBcIldpa2lwZWRpYVwiIC0+IGlzIGEgd2lraWxpbmtcblx0XHRcdFx0XHR2TGlua0FycmF5LnB1c2godlJlc3VsdFsxXSk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJXaWtpLUxpbmsgKCdcIit2TGlua1NwbGl0WzBdK1wiJykgXCIrdkNvdW50K1wiOiAnXCIgKyB2UmVzdWx0WzFdICsgXCInIGZvdW5kXCIpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCh2TGlua1NwbGl0WzBdKS50b0xvd2VyQ2FzZSgpID09IFwiY2F0ZWdvcnlcIikge1xuXHRcdFx0XHRcdC8vZm9yIFdpa2lwZWRpYTpXYXRlciB2TGlua1NwbGl0WzBdPSBcIldpa2lwZWRpYVwiIC0+IGlzIGEgd2lraWxpbmtcblx0XHRcdFx0XHR2TGlua0FycmF5LnB1c2godlJlc3VsdFsxXSk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJXaWtpLUNhdGVnb3J5LUxpbmsgKCdcIit2TGlua1NwbGl0WzBdK1wiJykgXCIrdkNvdW50K1wiOiAnXCIgKyB2UmVzdWx0WzFdICsgXCInIGZvdW5kXCIpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiV2lraS1GaWxlIFwiK3ZDb3VudCtcIjogJ1wiICsgdlJlc3VsdFsxXSArIFwiJyBmb3VuZFwiKTtcblx0XHRcdFx0XHQvL2ZvciBGaWxlOldhdGVyLnBuZyB2TGlua1NwbGl0WzBdPSBcIkZpbGVcIiBub3QgYW4gb3duIHByb3BlcnR5IG9mIGFNYXAgLT4gbm90IGEgTGlua1xuXHRcdFx0XHR9O1xuXHQgICAgfTtcblx0ICAgIHJldHVybiB2TGlua0FycmF5O1xuXG5cdH07XG5cdC8vLS0tLUVuZCBvZiBNZXRob2QgZ2V0V2lraUxpbmtzIERlZmluaXRpb25cblxuXG5cdC8vIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0Ly8jIFBVQkxJQyBNZXRob2Q6IGNvbnZlcnRNZWRpYUxpbms0V2lraU9ubGluZSgpXG5cdC8vIyAgICB1c2VkIGluIENsYXNzOiBXaWtpQ29udmVydFxuXHQvLyMgUGFyYW1ldGVyOlxuXHQvLyMgICAgcENvbnRlbnQ6U3RyaW5nXG5cdC8vIyAgICBwTWVkaWFBcnJheTpBcnJheVxuXHQvLyMgQ29tbWVudDpcblx0Ly8jICAgIGNvbnZlcnRNZWRpYUxpbms0V2lraU9ubGluZShwV2lraUNvZGUscE1lZGlhQXJyYXkpIGNvbnZlcnRzIE1lZGlhIExpbmtzIHRvIFdpa2lNZWRpYSBDb21tb25zXG5cdC8vIyAgICB0byBhIHJlbW90ZSBsaW5rIGZvciBsb2NhbCBmaWxlc1xuXHQvLyMgUmV0dXJuOiBTdHJpbmdcblx0Ly8jIGNyZWF0ZWQgd2l0aCBKU0NDICAyMDE3LzAzLzA1IDE4OjEzOjI4XG5cdC8vIyBsYXN0IG1vZGlmaWNhdGlvbnMgMjAxOC8wMS8yMSAxNzoxNzoxOFxuXHQvLyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cblx0dGhpcy5jb252ZXJ0TWVkaWFMaW5rNFdpa2lPbmxpbmUgPSBmdW5jdGlvbiAocFdpa2lDb2RlLHBNZWRpYUFycmF5KSB7XG5cdCAgLy8tLS0tRGVidWdnaW5nLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdCAgY29uc29sZS5sb2coXCJqcy93aWtpY29udmVydC5qcyAtIENhbGw6IGNvbnZlcnRNZWRpYUxpbms0V2lraU9ubGluZShwQ29udGVudDpTdHJpbmcscE1lZGlhQXJyYXk6QXJyYXkpOlN0cmluZ1wiKTtcblx0ICAvLyBhbGVydChcImpzL3dpa2ljb252ZXJ0LmpzIC0gQ2FsbDogY29udmVydE1lZGlhTGluazRXaWtpT25saW5lKHBDb250ZW50OlN0cmluZyxwTWVkaWFBcnJheTpBcnJheSk6U3RyaW5nXCIpO1xuXHQgIC8vLS0tLUNyZWF0ZSBPYmplY3QvSW5zdGFuY2Ugb2YgV2lraUNvbnZlcnQtLS0tXG5cdCAgLy8gICAgdmFyIHZNeUluc3RhbmNlID0gbmV3IFdpa2lDb252ZXJ0KCk7XG5cdCAgLy8gICAgdk15SW5zdGFuY2UuY29udmVydE1lZGlhTGluazRXaWtpT25saW5lKHBDb250ZW50LHBNZWRpYUFycmF5KTtcblx0ICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHQgICAgdmFyIHZSZXBsYWNlTGluaztcblx0ICAgIHZhciB2TWVkaWFGaWxlO1xuXHQgICAgdmFyIHZQYXRoQXJyYXk7XG5cblx0XHRcdC8vIFwiRmlsZTpcIiBcIkltYWdlOlwiIFwiRGF0ZWk6XCIgd2lsbCBiZSByZXBsYWNlZCBcIkZpbGU6XCIgYnkgY2xlYW5fc291cmNlKClcblx0XHRcdC8vcFdpa2lDb2RlID0gcFdpa2lDb2RlLnJlcGxhY2UoL1xcW1xcWyhGaWxlfEltYWdlfERhdGVpKTovZ2ksXCJbW0ZpbGU6XCIpO1xuXG5cdFx0XHQvL3ZhciB2U2VhcmNoID0gL1xcWyhGaWxlfERhdGVpfEltYWdlKTooW15cXHxdKikvO1xuXHQgICAgdmFyIHZTZWFyY2ggPSAvKFxcW1xcW0ZpbGU6W15cXF1dK1xcXVxcXSkvZztcblx0XHRcdC8vICggICAgICAgICAgICAgICMgYmVnaW4gY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAvLyBcXFtcXFsgICAgICAgICAgICMgXCJbW1wiXG5cdCAgICAvLyAgRmlsZTogICAgICAgICAjICAgXCJGaWxlOlwiXG5cdFx0XHQvLyAgW15cXF1dKyAgICAgICAgIyAgIGFueSBjaGFyYWN0ZXIgZXhjZXB0ICBcIl1cIiBhdCBsZWFzdCBvbmNlXG5cdFx0XHQvLyBcXF1cXF0gICAgICAgICAgICMgXCJdXVwiXG5cdCAgICAvLyApICAgICAgICAgICAgICAjIGVuZCBjYXB0dXJpbmcgZ3JvdXBcblx0ICAgIHZhciB2UmVzdWx0O1xuXHQgICAgdmFyIHZDb3VudCA9MDtcblx0XHRcdHZhciB2UmVwbGFjZUFycmF5ID0gW107XG5cdCAgICB3aGlsZSAodlJlc3VsdCA9IHZTZWFyY2guZXhlYyhwV2lraUNvZGUpKSB7XG5cdCAgICAgIHZDb3VudCsrO1xuXHQgICAgICBjb25zb2xlLmxvZyhcIk1lZGlhIFwiK3ZDb3VudCtcIjogJ1wiICsgdlJlc3VsdFsxXSArIFwiJyByZXBsYWNlIGludG8gSU1HLXRhZ1wiKTtcblx0XHRcdFx0dlJlcGxhY2VBcnJheS5wdXNoKHZSZXN1bHRbMV0pO1xuXHQgICAgfTtcblx0XHRcdGlmICh2UmVwbGFjZUFycmF5Lmxlbmd0aCA9PSBwTWVkaWFBcnJheS5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwTWVkaWFBcnJheS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdC8vdlBhdGhBcnJheSA9IChwTWVkaWFBcnJheVtpXSkuc3BsaXQoXCIvXCIpO1xuXHRcdFx0XHRcdC8vdk1lZGlhRmlsZSA9IHZQYXRoQXJyYXlbdlBhdGhBcnJheS5sZW5ndGgtMV07XG5cdFx0XHRcdFx0dk1lZGlhRmlsZSA9IHBNZWRpYUFycmF5W2ldO1xuXHRcdFx0XHRcdHZhciB2RmlsZVNwbGl0ID0gdk1lZGlhRmlsZS5zcGxpdChcInxcIik7XG5cdFx0XHRcdFx0dk1lZGlhRmlsZSA9IHZGaWxlU3BsaXRbMF07XG5cdFx0XHRcdFx0dmFyIHZXaWR0aCA9IHRoaXMuYURlZmF1bHRJbWFnZVdpZHRoO1xuXHRcdFx0XHRcdHZhciB2Q2VudGVySW1hZ2UgPSBmYWxzZTtcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMTsgaSA8IHZGaWxlU3BsaXQubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmICgodkZpbGVTcGxpdFtpXSkubWF0Y2goL15bMC05XStweCQvKSkge1xuXHRcdFx0XHRcdFx0XHQvL3ZGaWxlU3BsaXRbaV0gPSBcIjM1MHB4XCJcblx0XHRcdFx0XHRcdFx0dldpZHRoID0gKHZGaWxlU3BsaXRbaV0pLnJlcGxhY2UoL1teMC05XS9nLFwiXCIpO1xuXHRcdFx0XHRcdFx0XHQvL3ZGaWxlU3BsaXRbaV0gPSBcIjM1MFwiXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHZGaWxlU3BsaXRbaV0gPT0gXCJjZW50ZXJcIikge1xuXHRcdFx0XHRcdFx0XHR2Q2VudGVySW1hZ2UgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHZhciB2Q2FwdGlvbiA9IFwiXCI7XG5cdFx0XHRcdFx0aWYgKHZGaWxlU3BsaXQubGVuZ3RoID4xKSB7XG5cdFx0XHRcdFx0XHQvL1tbRmlsZTpNeSBGaWxlLnBuZ3xjZW50ZXJ8NDAwcHh8TXkgQ2FwdGlvbiBcIlRpdGxlXCJdXVxuXHRcdFx0XHRcdFx0dkNhcHRpb24gPSB0aGlzLmNoZWNrQ2FwdGlvbih2RmlsZVNwbGl0W3ZGaWxlU3BsaXQubGVuZ3RoLTFdKTtcblx0XHRcdFx0XHRcdC8vIHZDYXB0aW9uID1cIk15IENhcHRpb24gXFxcIlRpdGxlXFxcIlwiXG5cdFx0XHRcdFx0XHR2Q2FwdGlvbiA9IHRoaXMucmVwbGFjZVN0cmluZyh2Q2FwdGlvbixcIlxcXCJcIixcIidcIik7XG5cdFx0XHRcdFx0XHQvLyB2Q2FwdGlvbiA9XCJNeSBDYXB0aW9uICdUaXRsZSdcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdC8vIFJlcGxhY2VMaW5rIGNyZWF0ZWQgYXMgaW1hZ2UtdGFnXG5cdFx0XHRcdFx0dlJlcGxhY2VMaW5rID0gXCI8aW1nIHNyYz1cXFwiXCIrdGhpcy5nZXRXaWtpTWVkaWFVUkwodk1lZGlhRmlsZSkgKyBcIlxcXCIgd2lkdGg9XFxcIlwiK3ZXaWR0aCtcIlxcXCIgXCI7XG5cdFx0XHRcdFx0aWYgKHZDYXB0aW9uICE9IFwiXCIpIHtcblx0XHRcdFx0XHRcdHZSZXBsYWNlTGluayArPSBcIiBhbHQ9XFxcIlwiK3ZDYXB0aW9uK1wiXFxcIiB0aXRsZT1cXFwiXCIrdkNhcHRpb24rXCJcXFwiXCI7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRpZiAodkNlbnRlckltYWdlID09IHRydWUpIHtcblx0XHRcdFx0XHRcdHZSZXBsYWNlTGluayArPSBcIiBhbGlnbj1cXFwibWlkZGxlXFxcIiBcIjtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHZSZXBsYWNlTGluayArPSBcIj5cIjtcblx0XHRcdFx0XHQvLyBhZGQgZmlnY2FwdGlvbiBpZiBhQWRkRmlnQ2FwdGlvbiBhcyBhdHRyaWJ1dGUgaXMgdHJ1ZVxuXHRcdFx0XHRcdGlmICh0aGlzLmFBZGRGaWdDYXB0aW9uID09IHRydWUpIHtcblx0XHRcdFx0XHRcdHZDYXB0aW9uID0gdGhpcy5jaGVja0NhcHRpb24odkNhcHRpb24pO1xuXHRcdFx0XHRcdFx0dlJlcGxhY2VMaW5rICs9IFwiXFxuPGZpZ2NhcHRpb24+XCIrdkNhcHRpb24rXCI8L2ZpZ2NhcHRpb24+XCI7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHQvLyB3cmFwIGltYWdlIGludG8gPGZpZ3VyZT4tdGFnXG5cdFx0XHRcdFx0dlJlcGxhY2VMaW5rID0gXCI8ZmlndXJlPlxcbiAgIFwiK3ZSZXBsYWNlTGluaytcIjwvZmlndXJlPlwiO1xuXHRcdFx0XHRcdC8vcFdpa2lDb2RlID0gdGhpcy5yZXBsYWNlU3RyaW5nKHBXaWtpQ29kZSx2UmVwbGFjZUFycmF5W2ldLHZSZXBsYWNlTGluayk7XG5cdFx0XHRcdH07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkVSUk9SOiBSZXBsYWNlIExpbmsgZm9yIE1lZGlhTGlua3MgZG8gbm90IGhhdmUgdGhlIHNhbWUgbGVuZ3RoXCIpO1xuXHRcdFx0fTtcblx0XHQgIHJldHVybiBwV2lraUNvZGU7XG5cblx0fTtcblx0Ly8tLS0tRW5kIG9mIE1ldGhvZCBjb252ZXJ0TWVkaWFMaW5rNFdpa2lPbmxpbmUgRGVmaW5pdGlvblxuXG5cdHRoaXMuZ2V0SW1hZ2VQcm9wcyA9IGZ1bmN0aW9uIChwTWVkaWFMaW5rKSB7XG5cdFx0dmFyIHZJbWdQcm9wcyA9IHtcblx0XHRcdFwidGl0bGVcIjogXCJcIixcblx0XHRcdFwiZmlsZVwiOiBcIlwiLFxuXHRcdFx0XCJ1cmxcIjogXCJcIixcblx0XHRcdFwibWVkaWFzdHJpbmdcIjogcE1lZGlhTGluayxcblx0XHRcdFwic3ViZGlyXCI6IFwiaW1hZ2VzL1wiLFxuXHRcdFx0XCJ3aWR0aFwiOnRoaXMuYURlZmF1bHRJbWFnZVdpZHRoLFxuXHRcdFx0XCJhbGlnblwiOlwibGVmdFwiLFxuXHRcdFx0XCJ0aHVtYlwiOnRydWUsXG5cdFx0XHRcImZyYW1lXCI6ZmFsc2Vcblx0XHR9O1xuXG5cdFx0dmFyIHZGaWxlU3BsaXQgPSBwTWVkaWFMaW5rLnNwbGl0KFwifFwiKTtcblx0XHR2TWVkaWFGaWxlID0gdkZpbGVTcGxpdFswXTtcblx0XHR2YXIgdldpZHRoID0gdGhpcy5hRGVmYXVsdEltYWdlV2lkdGg7XG5cdFx0dmFyIHZDZW50ZXJJbWFnZSA9IGZhbHNlO1xuXHRcdGZvciAodmFyIGkgPSAxOyBpIDwgdkZpbGVTcGxpdC5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKCh2RmlsZVNwbGl0W2ldKS5tYXRjaCgvXlswLTldK3B4JC8pKSB7XG5cdFx0XHRcdC8vdkZpbGVTcGxpdFtpXSA9IFwiMzUwcHhcIlxuXHRcdFx0XHR2SW1nUHJvcHNbXCJ3aWR0aFwiXSA9ICh2RmlsZVNwbGl0W2ldKS5yZXBsYWNlKC9bXjAtOV0vZyxcIlwiKTtcblx0XHRcdFx0Ly92RmlsZVNwbGl0W2ldID0gXCIzNTBcIlxuXHRcdFx0fSBlbHNlIGlmICh2RmlsZVNwbGl0W2ldID09IFwiY2VudGVyXCIpIHtcblx0XHRcdFx0dkltZ1Byb3BzW1wiYWxpZ25cIl0gPSBcImNlbnRlclwiO1xuXHRcdFx0fSBlbHNlIGlmICh2RmlsZVNwbGl0W2ldID09IFwibGVmdFwiKSB7XG5cdFx0XHRcdHZJbWdQcm9wc1tcImFsaWduXCJdID0gXCJsZWZ0XCI7XG5cdFx0XHR9IGVsc2UgaWYgKHZGaWxlU3BsaXRbaV0gPT0gXCJyaWdodFwiKSB7XG5cdFx0XHRcdHZJbWdQcm9wc1tcImFsaWduXCJdID0gXCJyaWdodFwiO1xuXHRcdFx0fSBlbHNlIGlmICgodkZpbGVTcGxpdFtpXSA9PSBcInRodW1iXCIpICYmICh2RmlsZVNwbGl0W2ldID09IFwidGh1bWJuYWlsXCIpICYmICh2RmlsZVNwbGl0W2ldID09IFwibWluaVwiKSkge1xuXHRcdFx0XHR2SW1nUHJvcHNbXCJ0aHVtYlwiXSA9IHRydWU7XG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0Ly8gRGV0ZXJtaW5lIENhcHRpb24gb2YgSW1hZ2UvRmlndXJlXG5cdFx0aWYgKHZGaWxlU3BsaXQubGVuZ3RoID4xKSB7XG5cdFx0XHQvL1tbRmlsZTpNeSBGaWxlLnBuZ3xjZW50ZXJ8NDAwcHh8TXkgQ2FwdGlvbiBcIlRpdGxlXCJdXVxuXHRcdFx0dkltZ1Byb3BzW1widGl0bGVcIl0gPSB2RmlsZVNwbGl0W3ZGaWxlU3BsaXQubGVuZ3RoLTFdO1xuXHRcdFx0Ly8gQ2FwdGlvbiA9XCJNeSBDYXB0aW9uIFxcXCJUaXRsZVxcXCJcIlxuXHRcdFx0dkltZ1Byb3BzW1widGl0bGVcIl0gPSB0aGlzLnJlcGxhY2VTdHJpbmcodkltZ1Byb3BzW1wiY2FwdGlvblwiXSxcIlxcXCJcIixcIidcIik7XG5cdFx0XHQvLyBDYXB0aW9uID1cIk15IENhcHRpb24gJ1RpdGxlJyBcIlwiXG5cdFx0fTtcblx0XHQvLyBEZXRlcm1pbmUgTWVkaWEgVVJMIGZyb20gV2lraU1lZGlhIENvbW1vbnMgd2l0aCB0aGlzLmFEb2NKU09OW1wiaW1hZ2VzXCJdIEFycmF5XG5cdFx0Y29uc29sZS5sb2coXCJJTUFHRSBQUk9QUzogRmluZCAnXCIrcE1lZGlhTGluaytcIidcIik7XG5cdFx0Ly9nZXRJbWFnZUluZGV4RG9jSlNPTigpXG5cdFx0cmV0dXJuIHZJbWdQcm9wcztcblx0fVxuXG59XG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vLS0tRU5EIENvbnN0cnVjdG9yIG9mIENsYXNzIFwiV2lraUNvbnZlcnQoKVwiXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLy0tLUVuZCBEZWZpbml0aW9uIG9mIENsYXNzLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEpTIENsYXNzOiBXaWtpQ29udmVydFxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IFdpa2lDb252ZXJ0O1xuIiwiY29uc3QgcGFyc2UgPSByZXF1aXJlKCcuLi8uLi9wYXJzZScpO1xuY29uc3QgZG9JbmZvYm94ID0gcmVxdWlyZSgnLi9pbmZvYm94Jyk7XG5jb25zdCBkb1NlbnRlbmNlID0gcmVxdWlyZSgnLi9zZW50ZW5jZScpO1xuY29uc3QgZG9UYWJsZSA9IHJlcXVpcmUoJy4vdGFibGUnKTtcblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIGluZm9ib3hlczogdHJ1ZSxcbiAgdGFibGVzOiB0cnVlLFxuICBsaXN0czogdHJ1ZSxcbiAgdGl0bGU6IHRydWUsXG4gIGltYWdlczogdHJ1ZSxcbiAgbGlua3M6IHRydWUsXG4gIGZvcm1hdHRpbmc6IHRydWUsXG4gIHNlbnRlbmNlczogdHJ1ZSxcbn07XG5cbmNvbnN0IG1ha2VJbWFnZSA9IChpbWFnZSkgPT4ge1xuICBsZXQgYWx0ID0gaW1hZ2UuZmlsZS5yZXBsYWNlKC9eKGZpbGV8aW1hZ2UpOi9pLCAnJyk7XG4gIGFsdCA9IGFsdC5yZXBsYWNlKC9cXC4oanBnfGpwZWd8cG5nfGdpZnxzdmcpL2ksICcnKTtcbiAgcmV0dXJuICcgIDxpbWcgc3JjPVwiJyArIGltYWdlLnRodW1iICsgJ1wiIGFsdD1cIicgKyBhbHQgKyAnXCIvPic7XG59O1xuXG5jb25zdCBkb0xpc3QgPSAobGlzdCkgPT4ge1xuICBsZXQgaHRtbCA9ICc8dWw+XFxuJztcbiAgbGlzdC5mb3JFYWNoKChvKSA9PiB7XG4gICAgaHRtbCArPSAnICA8bGk+JyArIG8udGV4dCArICc8L2xpPlxcbic7XG4gIH0pO1xuICBodG1sICs9ICc8dWw+XFxuJztcbiAgcmV0dXJuIGh0bWw7XG59O1xuXG5jb25zdCBkb1NlY3Rpb24gPSAoc2VjdGlvbiwgb3B0aW9ucykgPT4ge1xuICBsZXQgaHRtbCA9ICcnO1xuICAvL21ha2UgdGhlIGhlYWRlclxuICBpZiAob3B0aW9ucy50aXRsZSA9PT0gdHJ1ZSAmJiBzZWN0aW9uLnRpdGxlKSB7XG4gICAgbGV0IG51bSA9IDEgKyBzZWN0aW9uLmRlcHRoO1xuICAgIGh0bWwgKz0gJyAgPGgnICsgbnVtICsgJz4nICsgc2VjdGlvbi50aXRsZSArICc8L2gnICsgbnVtICsgJz4nO1xuICAgIGh0bWwgKz0gJ1xcbic7XG4gIH1cbiAgLy9wdXQgYW55IGltYWdlcyB1bmRlciB0aGUgaGVhZGVyXG4gIGlmIChzZWN0aW9uLmltYWdlcyAmJiBvcHRpb25zLmltYWdlcyA9PT0gdHJ1ZSkge1xuICAgIGh0bWwgKz0gc2VjdGlvbi5pbWFnZXMubWFwKChpbWFnZSkgPT4gbWFrZUltYWdlKGltYWdlKSkuam9pbignXFxuJyk7XG4gICAgaHRtbCArPSAnXFxuJztcbiAgfVxuICAvL21ha2UgYSBodG1sIHRhYmxlXG4gIGlmIChzZWN0aW9uLnRhYmxlcyAmJiBvcHRpb25zLnRhYmxlcyA9PT0gdHJ1ZSkge1xuICAgIGh0bWwgKz0gc2VjdGlvbi50YWJsZXMubWFwKCh0KSA9PiBkb1RhYmxlKHQsIG9wdGlvbnMpKS5qb2luKCdcXG4nKTtcbiAgfVxuICAvLyAvL21ha2UgYSBodG1sIGJ1bGxldC1saXN0XG4gIGlmIChzZWN0aW9uLmxpc3RzICYmIG9wdGlvbnMubGlzdHMgPT09IHRydWUpIHtcbiAgICBodG1sICs9IHNlY3Rpb24ubGlzdHMubWFwKChsaXN0KSA9PiBkb0xpc3QobGlzdCwgb3B0aW9ucykpLmpvaW4oJ1xcbicpO1xuICB9XG4gIC8vZmluYWxseSwgd3JpdGUgdGhlIHNlbnRlbmNlIHRleHQuXG4gIGlmIChzZWN0aW9uLnNlbnRlbmNlcyAmJiBvcHRpb25zLnNlbnRlbmNlcyA9PT0gdHJ1ZSkge1xuICAgIGh0bWwgKz0gJyAgPHA+JyArIHNlY3Rpb24uc2VudGVuY2VzLm1hcCgocykgPT4gZG9TZW50ZW5jZShzLCBvcHRpb25zKSkuam9pbignICcpICsgJzwvcD4nO1xuICAgIGh0bWwgKz0gJ1xcbic7XG4gIH1cbiAgcmV0dXJuICc8ZGl2IGNsYXNzPVwic2VjdGlvblwiPlxcbicgKyBodG1sICsgJzwvZGl2Plxcbic7XG59O1xuLy9cbmNvbnN0IHRvSHRtbCA9IGZ1bmN0aW9uKHN0ciwgb3B0aW9ucykge1xuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgb3B0aW9ucyk7XG4gIGxldCBkYXRhID0gcGFyc2Uoc3RyLCBvcHRpb25zKTtcbiAgbGV0IGh0bWwgPSAnJztcbiAgLy9hZGQgdGhlIHRpdGxlIG9uIHRoZSB0b3BcbiAgLy8gaWYgKG9wdGlvbnMudGl0bGUgPT09IHRydWUgJiYgZGF0YS50aXRsZSkge1xuICAvLyAgIGh0bWwgKz0gJzxoMT4nICsgZGF0YS50aXRsZSArICc8L2gxPlxcbic7XG4gIC8vIH1cbiAgLy9yZW5kZXIgaW5mb2JveGVzICh1cCBhdCB0aGUgdG9wKVxuICBpZiAob3B0aW9ucy5pbmZvYm94ZXMgPT09IHRydWUgJiYgZGF0YS5pbmZvYm94ZXMpIHtcbiAgICBodG1sICs9IGRhdGEuaW5mb2JveGVzLm1hcChvID0+IGRvSW5mb2JveChvLCBvcHRpb25zKSkuam9pbignXFxuJyk7XG4gIH1cbiAgLy9yZW5kZXIgZWFjaCBzZWN0aW9uXG4gIGh0bWwgKz0gZGF0YS5zZWN0aW9ucy5tYXAocyA9PiBkb1NlY3Rpb24ocywgb3B0aW9ucykpLmpvaW4oJ1xcbicpO1xuICByZXR1cm4gaHRtbDtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHRvSHRtbDtcbiIsImNvbnN0IGRvU2VudGVuY2UgPSByZXF1aXJlKCcuL3NlbnRlbmNlJyk7XG5cbmNvbnN0IGRvbnREbyA9IHtcbiAgaW1hZ2U6IHRydWUsXG4gIGNhcHRpb246IHRydWVcbn07XG4vL1xuY29uc3QgaW5mb2JveCA9IGZ1bmN0aW9uKG9iaiwgb3B0aW9ucykge1xuICBsZXQgaHRtbCA9ICc8dGFibGU+XFxuJztcbiAgT2JqZWN0LmtleXMob2JqLmRhdGEpLmZvckVhY2goKGspID0+IHtcbiAgICBpZiAoZG9udERvW2tdID09PSB0cnVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCB2YWwgPSBkb1NlbnRlbmNlKG9iai5kYXRhW2tdLCBvcHRpb25zKTtcbiAgICBodG1sICs9ICcgIDx0cj5cXG4nO1xuICAgIGh0bWwgKz0gJyAgICA8dGQ+JyArIGsgKyAnPC90ZD5cXG4nO1xuICAgIGh0bWwgKz0gJyAgICA8dGQ+JyArIHZhbCArICc8L3RkPlxcbic7XG4gICAgaHRtbCArPSAnICA8L3RyPlxcbic7XG4gIH0pO1xuICBodG1sICs9ICc8L3RhYmxlPlxcbic7XG4gIHJldHVybiBodG1sO1xufTtcbm1vZHVsZS5leHBvcnRzID0gaW5mb2JveDtcbiIsImNvbnN0IHNtYXJ0UmVwbGFjZSA9IHJlcXVpcmUoJy4uL2xpYicpLnNtYXJ0UmVwbGFjZTtcblxuLy8gY3JlYXRlIGxpbmtzLCBib2xkLCBpdGFsaWMgaW4gaHRtbFxuY29uc3QgZG9TZW50ZW5jZSA9IGZ1bmN0aW9uKHNlbnRlbmNlLCBvcHRpb25zKSB7XG4gIGxldCB0ZXh0ID0gc2VudGVuY2UudGV4dDtcbiAgLy90dXJuIGxpbmtzIGJhY2sgaW50byBsaW5rc1xuICBpZiAoc2VudGVuY2UubGlua3MgJiYgb3B0aW9ucy5saW5rcyA9PT0gdHJ1ZSkge1xuICAgIHNlbnRlbmNlLmxpbmtzLmZvckVhY2goKGxpbmspID0+IHtcbiAgICAgIGxldCBocmVmID0gJyc7XG4gICAgICBsZXQgY2xhc3NOYW1lcyA9ICdsaW5rJztcbiAgICAgIGlmIChsaW5rLnNpdGUpIHtcbiAgICAgICAgLy91c2UgYW4gZXh0ZXJuYWwgbGlua1xuICAgICAgICBocmVmID0gbGluay5zaXRlO1xuICAgICAgICBjbGFzc05hbWVzICs9ICcgZXh0ZXJuYWwnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9vdGhlcndpc2UsIG1ha2UgaXQgYSByZWxhdGl2ZSBpbnRlcm5hbCBsaW5rXG4gICAgICAgIGhyZWYgPSBsaW5rLnBhZ2UgfHwgbGluay50ZXh0O1xuICAgICAgICBocmVmID0gJy4vJyArIGhyZWYucmVwbGFjZSgvIC9nLCAnXycpO1xuICAgICAgfVxuICAgICAgbGV0IHRhZyA9ICc8YSBjbGFzcz1cIicgKyBjbGFzc05hbWVzICsgJ1wiIGhyZWY9XCInICsgaHJlZiArICdcIj4nO1xuICAgICAgdGFnICs9IGxpbmsudGV4dCArICc8L2E+JztcbiAgICAgIHRleHQgPSBzbWFydFJlcGxhY2UodGV4dCwgbGluay50ZXh0LCB0YWcpO1xuICAgIH0pO1xuICB9XG4gIGlmIChzZW50ZW5jZS5mbXQpIHtcbiAgICBpZiAoc2VudGVuY2UuZm10LmJvbGQpIHtcbiAgICAgIHNlbnRlbmNlLmZtdC5ib2xkLmZvckVhY2goKHN0cikgPT4ge1xuICAgICAgICBsZXQgdGFnID0gJzxiPicgKyBzdHIgKyAnPC9iPic7XG4gICAgICAgIHRleHQgPSBzbWFydFJlcGxhY2UodGV4dCwgc3RyLCB0YWcpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChzZW50ZW5jZS5mbXQuaXRhbGljKSB7XG4gICAgICBzZW50ZW5jZS5mbXQuaXRhbGljLmZvckVhY2goKHN0cikgPT4ge1xuICAgICAgICBsZXQgdGFnID0gJzxpPicgKyBzdHIgKyAnPC9pPic7XG4gICAgICAgIHRleHQgPSBzbWFydFJlcGxhY2UodGV4dCwgc3RyLCB0YWcpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0ZXh0O1xufTtcbm1vZHVsZS5leHBvcnRzID0gZG9TZW50ZW5jZTtcbiIsImNvbnN0IGRvU2VudGVuY2UgPSByZXF1aXJlKCcuL3NlbnRlbmNlJyk7XG5cblxuY29uc3QgZG9UYWJsZSA9IGZ1bmN0aW9uKHRhYmxlLCBvcHRpb25zKSB7XG4gIGxldCBodG1sID0gJzx0YWJsZT5cXG4nO1xuICAvL21ha2UgaGVhZGVyXG4gIGh0bWwgKz0gJyAgPHRoZWFkPic7XG4gIE9iamVjdC5rZXlzKHRhYmxlWzBdKS5mb3JFYWNoKChrKSA9PiB7XG4gICAgaHRtbCArPSAnICAgIDx0ZD4nICsgayArICc8L3RkPlxcbic7XG4gIH0pO1xuICBodG1sICs9ICcgIDwvdGhlYWQ+JztcbiAgaHRtbCArPSAnICA8dGJvZHk+JztcbiAgLy9tYWtlIHJvd3NcbiAgdGFibGUuZm9yRWFjaCgobykgPT4ge1xuICAgIGh0bWwgKz0gJyAgPHRyPlxcbic7XG4gICAgT2JqZWN0LmtleXMobykuZm9yRWFjaCgoaykgPT4ge1xuICAgICAgbGV0IHZhbCA9IGRvU2VudGVuY2Uob1trXSwgb3B0aW9ucyk7XG4gICAgICBodG1sICs9ICcgICAgPHRkPicgKyB2YWwgKyAnPC90ZD5cXG4nO1xuICAgIH0pO1xuICAgIGh0bWwgKz0gJyAgPC90cj5cXG4nO1xuICB9KTtcbiAgaHRtbCArPSAnICA8L3Rib2R5Pic7XG4gIGh0bWwgKz0gJzwvdGFibGU+XFxuJztcbiAgcmV0dXJuIGh0bWw7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBkb1RhYmxlO1xuIiwiY29uc3QgcGFyc2UgPSByZXF1aXJlKCcuLi8uLi9wYXJzZScpO1xuY29uc3QgZG9JbmZvYm94ID0gcmVxdWlyZSgnLi9pbmZvYm94Jyk7XG5jb25zdCBkb1NlbnRlbmNlID0gcmVxdWlyZSgnLi9zZW50ZW5jZScpO1xuY29uc3QgZG9UYWJsZSA9IHJlcXVpcmUoJy4vdGFibGUnKTtcblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIGluZm9ib3hlczogdHJ1ZSxcbiAgdGFibGVzOiB0cnVlLFxuICBsaXN0czogdHJ1ZSxcbiAgdGl0bGU6IHRydWUsXG4gIGltYWdlczogdHJ1ZSxcbiAgbGlua3M6IHRydWUsXG4gIGZvcm1hdHRpbmc6IHRydWUsXG4gIHNlbnRlbmNlczogdHJ1ZSxcbn07XG5cbmNvbnN0IG1ha2VJbWFnZSA9IChpbWFnZSkgPT4ge1xuICBsZXQgYWx0ID0gaW1hZ2UuZmlsZS5yZXBsYWNlKC9eKGZpbGV8aW1hZ2UpOi9pLCAnJyk7XG4gIGFsdCA9IGFsdC5yZXBsYWNlKC9cXC4oanBnfGpwZWd8cG5nfGdpZnxzdmcpL2ksICcnKTtcbiAgdmFyIG91dCA9ICdcXFxcYmVnaW57ZmlndXJlfSc7XG4gIG91dCArPSAnXFxuXFxcXGluY2x1ZGVncmFwaGljc1t3aWR0aD1cXFxcbGluZXdpZHRoXXsnICsgaW1hZ2UudGh1bWIgKyAnfSc7XG4gIG91dCArPSAnXFxuXFxcXGNhcHRpb257JyArIGFsdCArICd9JztcbiAgb3V0ICs9ICdcXG4lXFxcXGxhYmVse2ZpZzpteWltYWdlMX0nO1xuICBvdXQgKz0gJ1xcblxcXFxlbmR7ZmlndXJlfSc7XG4gIHJldHVybiBvdXQ7XG59O1xuXG5jb25zdCBkb0xpc3QgPSAobGlzdCkgPT4ge1xuICBsZXQgb3V0ID0gJ1xcXFxiZWdpbntpdGVtaXplfVxcbic7XG4gIGxpc3QuZm9yRWFjaCgobykgPT4ge1xuICAgIG91dCArPSAnICBcXFxcaXRlbSAnICsgby50ZXh0ICsgJ1xcbic7XG4gIH0pO1xuICBvdXQgKz0gJ1xcXFxlbmR7aXRlbWl6ZX1cXG4nO1xuICByZXR1cm4gb3V0O1xufTtcblxuY29uc3QgZG9TZWN0aW9uID0gKHNlY3Rpb24sIG9wdGlvbnMpID0+IHtcbiAgbGV0IG91dCA9ICcnO1xuICBsZXQgbnVtID0gMVxuICAvL21ha2UgdGhlIGhlYWRlclxuICBpZiAob3B0aW9ucy50aXRsZSA9PT0gdHJ1ZSAmJiBzZWN0aW9uLnRpdGxlKSB7XG4gICAgbnVtID0gMSArIHNlY3Rpb24uZGVwdGg7XG4gICAgdmFyIHZPcGVuID0gXCJcXG5cIjtcbiAgICB2YXIgdkNsb3NlID0gXCJ9XCI7XG4gICAgc3dpdGNoIChudW0pIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdk9wZW4gKz0gXCJcXFxcY2hhcHRlcntcIjtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICB2T3BlbiArPSBcIlxcXFxzZWN0aW9ue1wiO1xuICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIHZPcGVuICs9IFwiXFxcXHN1YnNlY3Rpb257XCI7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgdk9wZW4gKz0gXCJcXFxcc3Vic3Vic2VjdGlvbntcIjtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA1OlxuICAgICAgICB2T3BlbiArPSBcIlxcXFxwYXJhZ3JhcGh7XCI7XG4gICAgICAgIHZDbG9zZSA9IFwifSBcXFxcXFxcXCBcXG5cIjtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA2OlxuICAgICAgICB2T3BlbiArPSBcIlxcXFxzdWJwYXJhZ3JhcGh7XCI7XG4gICAgICAgIHZDbG9zZSA9IFwifSBcXFxcXFxcXCBcXG5cIjtcbiAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdk9wZW4gKz0gXCJcXG4lIHNlY3Rpb24gd2l0aCBkZXB0aD1cIitudW0rXCIgdW5kZWZpbmVkIC0gdXNlIHN1YnBhcmFncmFwaCBpbnN0ZWFkXFxuXFxcXHN1YnBhcmFncmFwaHtcIjtcbiAgICAgICAgdkNsb3NlID0gXCJ9IFxcXFxcXFxcIFxcblwiO1xuICAgIH1cbiAgICBvdXQgKz0gdk9wZW4gKyBzZWN0aW9uLnRpdGxlICsgdkNsb3NlO1xuICAgIG91dCArPSAnXFxuJztcbiAgfVxuICAvL3B1dCBhbnkgaW1hZ2VzIHVuZGVyIHRoZSBoZWFkZXJcbiAgaWYgKHNlY3Rpb24uaW1hZ2VzICYmIG9wdGlvbnMuaW1hZ2VzID09PSB0cnVlKSB7XG4gICAgb3V0ICs9IHNlY3Rpb24uaW1hZ2VzLm1hcCgoaW1hZ2UpID0+IG1ha2VJbWFnZShpbWFnZSkpLmpvaW4oJ1xcbicpO1xuICAgIC8vb3V0ICs9ICdcXG4nO1xuICB9XG4gIC8vbWFrZSBhIG91dCB0YWJsZVxuICBpZiAoc2VjdGlvbi50YWJsZXMgJiYgb3B0aW9ucy50YWJsZXMgPT09IHRydWUpIHtcbiAgICBvdXQgKz0gc2VjdGlvbi50YWJsZXMubWFwKCh0KSA9PiBkb1RhYmxlKHQsIG9wdGlvbnMpKS5qb2luKCdcXG4nKTtcbiAgfVxuICAvLyAvL21ha2UgYSBvdXQgYnVsbGV0LWxpc3RcbiAgaWYgKHNlY3Rpb24ubGlzdHMgJiYgb3B0aW9ucy5saXN0cyA9PT0gdHJ1ZSkge1xuICAgIG91dCArPSBzZWN0aW9uLmxpc3RzLm1hcCgobGlzdCkgPT4gZG9MaXN0KGxpc3QsIG9wdGlvbnMpKS5qb2luKCdcXG4nKTtcbiAgfVxuICAvL2ZpbmFsbHksIHdyaXRlIHRoZSBzZW50ZW5jZSB0ZXh0LlxuICBpZiAoc2VjdGlvbi5zZW50ZW5jZXMgJiYgb3B0aW9ucy5zZW50ZW5jZXMgPT09IHRydWUpIHtcbiAgICAvL291dCArPSAnXFxuXFxuJSBCRUdJTiBQYXJhZ3JhcGhcXG4nXG4gICAgb3V0ICs9ICBzZWN0aW9uLnNlbnRlbmNlcy5tYXAoKHMpID0+IGRvU2VudGVuY2Uocywgb3B0aW9ucykpLmpvaW4oJyAnKVxuICAgIC8vb3V0ICs9ICdcXG4lIEVORCBQYXJhZ3JhcGgnO1xuICAgIG91dCArPSAnXFxuJztcbiAgfTtcbiAgdmFyIHRpdGxlX3RhZyA9ICcgU0VDVElPTiBkZXB0aD0nK251bSArXCIgLSBUSVRMRTogXCIgKyBzZWN0aW9uLnRpdGxlICsgXCJcXG5cIjtcbiAgLy8gd3JhcCBhIHNlY3Rpb24gY29tbWVudFxuICAvL291dCA9ICdcXG4lIEJFR0lOJyArIHRpdGxlX3RhZyArIG91dCArICdcXG4lIEVORCcgKyB0aXRsZV90YWc7XG4gIHJldHVybiBvdXQ7XG59O1xuLy9cbmNvbnN0IHRvTGF0ZXggPSBmdW5jdGlvbihzdHIsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIG9wdGlvbnMpO1xuICBsZXQgZGF0YSA9IHBhcnNlKHN0ciwgb3B0aW9ucyk7XG4gIGxldCBvdXQgPSAnJztcbiAgLy9hZGQgdGhlIHRpdGxlIG9uIHRoZSB0b3BcbiAgLy8gaWYgKG9wdGlvbnMudGl0bGUgPT09IHRydWUgJiYgZGF0YS50aXRsZSkge1xuICAvLyAgIG91dCArPSAnXFxcXHNlY3Rpb257JyArIGRhdGEudGl0bGUgKyAnfVxcbic7XG4gIC8vIH1cbiAgLy9yZW5kZXIgaW5mb2JveGVzICh1cCBhdCB0aGUgdG9wKVxuICBpZiAob3B0aW9ucy5pbmZvYm94ZXMgPT09IHRydWUgJiYgZGF0YS5pbmZvYm94ZXMpIHtcbiAgICBvdXQgKz0gZGF0YS5pbmZvYm94ZXMubWFwKG8gPT4gZG9JbmZvYm94KG8sIG9wdGlvbnMpKS5qb2luKCdcXG4nKTtcbiAgfVxuICAvL3JlbmRlciBlYWNoIHNlY3Rpb25cbiAgb3V0ICs9IGRhdGEuc2VjdGlvbnMubWFwKHMgPT4gZG9TZWN0aW9uKHMsIG9wdGlvbnMpKS5qb2luKCdcXG4nKTtcbiAgcmV0dXJuIG91dCA7XG59O1xubW9kdWxlLmV4cG9ydHMgPSB0b0xhdGV4O1xuIiwiY29uc3QgZG9TZW50ZW5jZSA9IHJlcXVpcmUoJy4vc2VudGVuY2UnKTtcblxuY29uc3QgZG9udERvID0ge1xuICBpbWFnZTogdHJ1ZSxcbiAgY2FwdGlvbjogdHJ1ZVxufTtcbi8vXG5jb25zdCBpbmZvYm94ID0gZnVuY3Rpb24ob2JqLCBvcHRpb25zKSB7XG4gIGxldCBvdXQgID0gJ1xcblxcXFx2c3BhY2UqezAuM2NtfVxcblxcbic7XG4gIG91dCAgKz0gJ1xcXFxiZWdpbnt0YWJ1bGFyfXt8QHtcXFxccXF1YWR9bHxwezkuNWNtfUB7XFxcXHFxdWFkfXx9IFxcbic7XG4gIG91dCAgKz0gJyAgXFxcXGhsaW5lICAlaG9yaXpvbnRhbCBsaW5lXFxuJztcblxuICBPYmplY3Qua2V5cyhvYmouZGF0YSkuZm9yRWFjaCgoaykgPT4ge1xuICAgIGlmIChkb250RG9ba10gPT09IHRydWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHZhbCA9IGRvU2VudGVuY2Uob2JqLmRhdGFba10sIG9wdGlvbnMpO1xuICAgIG91dCAgKz0gJyAgJSAtLS0tLS0tLS0tIFxcbic7XG4gICAgb3V0ICArPSAnICAgICAgJyArIGsgKyAnICYgXFxuJztcbiAgICBvdXQgICs9ICcgICAgICAnICsgdmFsICsgJ1xcXFxcXFxcIFxcbic7XG4gICAgb3V0ICArPSAnICBcXFxcaGxpbmUgICVob3Jpem9udGFsIGxpbmVcXG4nO1xuICB9KTtcbiAgb3V0ICArPSAnXFxcXGVuZHt0YWJ1bGFyfSBcXG4nO1xuICBvdXQgICs9ICdcXG5cXFxcdnNwYWNlKnswLjNjbX1cXG5cXG4nO1xuICByZXR1cm4gb3V0IDtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGluZm9ib3g7XG4iLCJjb25zdCBzbWFydFJlcGxhY2UgPSByZXF1aXJlKCcuLi9saWInKS5zbWFydFJlcGxhY2U7XG5cbi8vIGNyZWF0ZSBsaW5rcywgYm9sZCwgaXRhbGljIGluIGh0bWxcbmNvbnN0IGRvU2VudGVuY2UgPSBmdW5jdGlvbihzZW50ZW5jZSwgb3B0aW9ucykge1xuICBsZXQgdGV4dCA9IHNlbnRlbmNlLnRleHQ7XG4gIC8vdHVybiBsaW5rcyBiYWNrIGludG8gbGlua3NcbiAgaWYgKHNlbnRlbmNlLmxpbmtzICYmIG9wdGlvbnMubGlua3MgPT09IHRydWUpIHtcbiAgICBzZW50ZW5jZS5saW5rcy5mb3JFYWNoKChsaW5rKSA9PiB7XG4gICAgICBsZXQgaHJlZiA9ICcnO1xuICAgICAgbGV0IGNsYXNzTmFtZXMgPSAnbGluayc7XG4gICAgICBpZiAobGluay5zaXRlKSB7XG4gICAgICAgIC8vdXNlIGFuIGV4dGVybmFsIGxpbmtcbiAgICAgICAgaHJlZiA9IGxpbmsuc2l0ZTtcbiAgICAgICAgY2xhc3NOYW1lcyArPSAnIGV4dGVybmFsJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vb3RoZXJ3aXNlLCBtYWtlIGl0IGEgcmVsYXRpdmUgaW50ZXJuYWwgbGlua1xuICAgICAgICBocmVmID0gbGluay5wYWdlIHx8IGxpbmsudGV4dDtcbiAgICAgICAgaHJlZiA9ICcuLycgKyBocmVmLnJlcGxhY2UoLyAvZywgJ18nKTtcbiAgICAgIH1cbiAgICAgIGxldCB0YWcgPSAnXFxcXGhyZWZ7JyArIGhyZWYgKyAnfXsnICsgbGluay50ZXh0ICsgJ30nO1xuICAgICAgdGV4dCA9IHNtYXJ0UmVwbGFjZSh0ZXh0LCBsaW5rLnRleHQsIHRhZyk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKHNlbnRlbmNlLmZtdCkge1xuICAgIGlmIChzZW50ZW5jZS5mbXQuYm9sZCkge1xuICAgICAgc2VudGVuY2UuZm10LmJvbGQuZm9yRWFjaCgoc3RyKSA9PiB7XG4gICAgICAgIGxldCB0YWcgPSAnXFxcXHRleHRiZnsnICsgc3RyICsgJ30nO1xuICAgICAgICB0ZXh0ID0gc21hcnRSZXBsYWNlKHRleHQsIHN0ciwgdGFnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoc2VudGVuY2UuZm10Lml0YWxpYykge1xuICAgICAgc2VudGVuY2UuZm10Lml0YWxpYy5mb3JFYWNoKChzdHIpID0+IHtcbiAgICAgICAgbGV0IHRhZyA9ICdcXFxcdGV4dGl0JyArIHN0ciArICd9JztcbiAgICAgICAgdGV4dCA9IHNtYXJ0UmVwbGFjZSh0ZXh0LCBzdHIsIHRhZyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRleHQ7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBkb1NlbnRlbmNlO1xuIiwiY29uc3QgZG9TZW50ZW5jZSA9IHJlcXVpcmUoJy4vc2VudGVuY2UnKTtcblxuXG5jb25zdCBkb1RhYmxlID0gZnVuY3Rpb24odGFibGUsIG9wdGlvbnMpIHtcbiAgbGV0IG91dCAgPSAnXFxuXFxcXHZzcGFjZSp7MC4zY219XFxuXFxuJztcbiAgb3V0ICArPSAnJSBCRUdJTiBUQUJMRTogb25seSBsZWZ0IGFsaWduIGNvbHVtbnMgaW4gTGFUZVggdGFibGUgd2l0aCBob3Jpem9udGFsIGxpbmUgc2VwYXJhdGlvbiBiZXR3ZWVuIGNvbHVtbnMnXG4gIG91dCAgKz0gXCIlIEZvcm1hdCBBbGlnbiBDb2x1bW46ICdsJz1sZWZ0ICdyJz1yaWdodCBhbGlnbiwgJ2MnPWNlbnRlciwgJ3B7NWNtfSc9YmxvY2sgd2l0aCBjb2x1bW4gd2lkdGggNWNtIFwiO1xuICBvdXQgICs9ICdcXFxcYmVnaW57dGFidWxhcn17fCdcbiAgT2JqZWN0LmtleXModGFibGVbMF0pLmZvckVhY2goKGspID0+IHtcbiAgICBvdXQgICs9ICdsfCc7XG4gIH0pO1xuICAnfSBcXG4nO1xuICBvdXQgICs9ICcgIFxcXFxobGluZSAgJWhvcml6b250YWwgbGluZVxcbic7XG4vL21ha2UgaGVhZGVyXG4gIG91dCAgKz0gJyAgJSBCRUdJTjogVGFibGUgSGVhZGVyJztcbiAgdmFyIHZTZXAgPSBcIiBcIjtcbiAgT2JqZWN0LmtleXModGFibGVbMF0pLmZvckVhY2goKGspID0+IHtcbiAgICBvdXQgICs9ICcgICAgJyArIHZTZXAgKyArXCJcXFxcdGV4dGJme1wiICsgayArICtcIn0gXCIrICdcXG4nO1xuICAgIHZTZXAgPSBcIiAmIFwiO1xuICB9KTtcbiAgb3V0ICArPSAnXFxcXFxcXFwgXFxuJ1xuICBvdXQgICs9ICcgICUgRU5EOiBUYWJsZSBIZWFkZXJcXG4nO1xuICBvdXQgICs9ICcgICUgQkVHSU46IFRhYmxlIEJvZHknO1xuICBvdXQgICs9ICcgIFxcXFxobGluZSAgJSAtLS0tLSB0YWJsZSByb3cgLS0tLS1cXG4nO1xuLy8vL21ha2Ugcm93c1xuICB0YWJsZS5mb3JFYWNoKChvKSA9PiB7XG4gICAgdlNlcCA9IFwiIFwiO1xuICAgIG91dCAgKz0gJyAgJSAtLS0tLSB0YWJsZSByb3cgLS0tLS1cXG4nO1xuICAgIE9iamVjdC5rZXlzKG8pLmZvckVhY2goKGspID0+IHtcbiAgICAgIGxldCB2YWwgPSBkb1NlbnRlbmNlKG9ba10sIG9wdGlvbnMpO1xuICAgICAgb3V0ICArPSAnICAgICcgKyB2U2VwICsgdmFsICsgJ1xcbic7XG4gICAgICB2U2VwID0gXCIgJiBcIjtcbiAgICB9KTtcbiAgICBvdXQgICs9ICcgIFxcXFxcXFxcIFxcbic7IC8vIG5ld2xpbmUgaW4gbGF0ZXggdGFibGUgPSB0d28gYmFja3NsYXNoIFxcXFxcbiAgICBvdXQgICs9ICcgIFxcXFxobGluZSAgJWhvcml6b250YWwgbGluZVxcbic7XG4gIH0pO1xuICBvdXQgICs9ICcgICAgJSBFTkQ6IFRhYmxlIEJvZHlcXG4nO1xuICBvdXQgICs9ICd9ICUgRU5EIFRBQkxFXFxuJztcbiAgb3V0ICArPSAnXFxuXFxcXHZzcGFjZSp7MC4zY219XFxuXFxuJztcbiAgcmV0dXJuIG91dCA7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBkb1RhYmxlO1xuIiwiLy9lc2NhcGUgYSBzdHJpbmcgbGlrZSAnZnVuKjIuQ28nIGZvciBhIHJlZ0V4cHJcbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgJ1xcXFwkJicpO1xufVxuXG4vL3NvbWV0aW1lcyB0ZXh0LXJlcGxhY2VtZW50cyBjYW4gYmUgYW1iaWd1b3VzIC0gd29yZHMgdXNlZCBtdWx0aXBsZSB0aW1lcy4uXG5jb25zdCBzbWFydFJlcGxhY2UgPSBmdW5jdGlvbihhbGwsIHRleHQsIHJlc3VsdCkge1xuICBpZiAoIXRleHQgfHwgIWFsbCkge1xuICAgIC8vIGNvbnNvbGUubG9nKHRleHQpO1xuICAgIHJldHVybiBhbGw7XG4gIH1cblxuICBpZiAodHlwZW9mIGFsbCA9PT0gJ251bWJlcicpIHtcbiAgICBhbGwgPSBTdHJpbmcoYWxsKTtcbiAgfVxuICB0ZXh0ID0gZXNjYXBlUmVnRXhwKHRleHQpO1xuICAvL3RyeSBhIHdvcmQtYm91bmRhcnkgcmVwbGFjZVxuICBsZXQgcmVnID0gbmV3IFJlZ0V4cCgnXFxcXGInICsgdGV4dCArICdcXFxcYicpO1xuICBpZiAocmVnLnRlc3QoYWxsKSA9PT0gdHJ1ZSkge1xuICAgIGFsbCA9IGFsbC5yZXBsYWNlKHJlZywgcmVzdWx0KTtcbiAgfSBlbHNlIHtcbiAgICAvL290aGVyd2lzZSwgZmFsbC1iYWNrIHRvIGEgbXVjaCBtZXNzaWVyLCBkYW5nZXJvdXMgcmVwbGFjZW1lbnRcbiAgICAvLyBjb25zb2xlLndhcm4oJ21pc3NpbmcgXFwnJyArIHRleHQgKyAnXFwnJyk7XG4gICAgYWxsID0gYWxsLnJlcGxhY2UodGV4dCwgcmVzdWx0KTtcbiAgfVxuICByZXR1cm4gYWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNtYXJ0UmVwbGFjZTogc21hcnRSZXBsYWNlXG59O1xuIiwiY29uc3QgcGFyc2UgPSByZXF1aXJlKCcuLi8uLi9wYXJzZScpO1xuY29uc3QgZG9UYWJsZSA9IHJlcXVpcmUoJy4vdGFibGUnKTtcbmNvbnN0IGRvSW5mb2JveCA9IHJlcXVpcmUoJy4vaW5mb2JveCcpO1xuY29uc3QgZG9TZW50ZW5jZSA9IHJlcXVpcmUoJy4vc2VudGVuY2UnKTtcblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIGluZm9ib3hlczogdHJ1ZSxcbiAgdGFibGVzOiB0cnVlLFxuICBsaXN0czogdHJ1ZSxcbiAgdGl0bGU6IHRydWUsXG4gIGltYWdlczogdHJ1ZSxcbiAgbGlua3M6IHRydWUsXG4gIGZvcm1hdHRpbmc6IHRydWUsXG4gIHNlbnRlbmNlczogdHJ1ZSxcbn07XG5cbmNvbnN0IGRvTGlzdCA9IChsaXN0LCBvcHRpb25zKSA9PiB7XG4gIHJldHVybiBsaXN0Lm1hcCgobykgPT4ge1xuICAgIGxldCBzdHIgPSBkb1NlbnRlbmNlKG8sIG9wdGlvbnMpO1xuICAgIHJldHVybiAnICogJyArIHN0cjtcbiAgfSkuam9pbignXFxuJyk7XG59O1xuXG4vL21hcmtkb3duIGltYWdlcyBhcmUgbGlrZSB0aGlzOiAhW2FsdCB0ZXh0XShocmVmKVxuY29uc3QgZG9JbWFnZSA9IChpbWFnZSkgPT4ge1xuICBsZXQgYWx0ID0gaW1hZ2UuZmlsZS5yZXBsYWNlKC9eKGZpbGV8aW1hZ2UpOi9pLCAnJyk7XG4gIGFsdCA9IGFsdC5yZXBsYWNlKC9cXC4oanBnfGpwZWd8cG5nfGdpZnxzdmcpL2ksICcnKTtcbiAgcmV0dXJuICchWycgKyBhbHQgKyAnXSgnICsgaW1hZ2UudGh1bWIgKyAnKSc7XG59O1xuXG5jb25zdCBkb1NlY3Rpb24gPSAoc2VjdGlvbiwgb3B0aW9ucykgPT4ge1xuICBsZXQgbWQgPSAnJztcbiAgLy9tYWtlIHRoZSBoZWFkZXJcbiAgaWYgKG9wdGlvbnMudGl0bGUgPT09IHRydWUgJiYgc2VjdGlvbi50aXRsZSkge1xuICAgIGxldCBoZWFkZXIgPSAnIyMnO1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBzZWN0aW9uLmRlcHRoOyBpICs9IDEpIHtcbiAgICAgIGhlYWRlciArPSAnIyc7XG4gICAgfVxuICAgIG1kICs9IGhlYWRlciArICcgJyArIHNlY3Rpb24udGl0bGUgKyAnXFxuJztcbiAgfVxuICAvL3B1dCBhbnkgaW1hZ2VzIHVuZGVyIHRoZSBoZWFkZXJcbiAgaWYgKHNlY3Rpb24uaW1hZ2VzICYmIG9wdGlvbnMuaW1hZ2VzID09PSB0cnVlKSB7XG4gICAgbWQgKz0gc2VjdGlvbi5pbWFnZXMubWFwKChpbWcpID0+IGRvSW1hZ2UoaW1nKSkuam9pbignXFxuJyk7XG4gICAgbWQgKz0gJ1xcbic7XG4gIH1cbiAgLy9tYWtlIGEgbWFyZG93biB0YWJsZVxuICBpZiAoc2VjdGlvbi50YWJsZXMgJiYgb3B0aW9ucy50YWJsZXMgPT09IHRydWUpIHtcbiAgICBtZCArPSAnXFxuJztcbiAgICBtZCArPSBzZWN0aW9uLnRhYmxlcy5tYXAoKHRhYmxlKSA9PiBkb1RhYmxlKHRhYmxlLCBvcHRpb25zKSkuam9pbignXFxuJyk7XG4gICAgbWQgKz0gJ1xcbic7XG4gIH1cbiAgLy9tYWtlIGEgbWFyZG93biBidWxsZXQtbGlzdFxuICBpZiAoc2VjdGlvbi5saXN0cyAmJiBvcHRpb25zLmxpc3RzID09PSB0cnVlKSB7XG4gICAgbWQgKz0gc2VjdGlvbi5saXN0cy5tYXAoKGxpc3QpID0+IGRvTGlzdChsaXN0LCBvcHRpb25zKSkuam9pbignXFxuJyk7XG4gICAgbWQgKz0gJ1xcbic7XG4gIH1cbiAgLy9maW5hbGx5LCB3cml0ZSB0aGUgc2VudGVuY2UgdGV4dC5cbiAgaWYgKHNlY3Rpb24uc2VudGVuY2VzICYmIG9wdGlvbnMuc2VudGVuY2VzID09PSB0cnVlKSB7XG4gICAgbWQgKz0gc2VjdGlvbi5zZW50ZW5jZXMubWFwKChzKSA9PiBkb1NlbnRlbmNlKHMsIG9wdGlvbnMpKS5qb2luKCcgJyk7XG4gIH1cbiAgcmV0dXJuIG1kO1xufTtcblxuY29uc3QgdG9NYXJrZG93biA9IGZ1bmN0aW9uKHN0ciwgb3B0aW9ucykge1xuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgb3B0aW9ucyk7XG4gIGxldCBkYXRhID0gcGFyc2Uoc3RyLCBvcHRpb25zKTtcbiAgbGV0IG1kID0gJyc7XG4gIC8vYWRkIHRoZSB0aXRsZSBvbiB0aGUgdG9wXG4gIC8vIGlmIChkYXRhLnRpdGxlKSB7XG4gIC8vICAgbWQgKz0gJyMgJyArIGRhdGEudGl0bGUgKyAnXFxuJztcbiAgLy8gfVxuICAvL3JlbmRlciBpbmZvYm94ZXMgKHVwIGF0IHRoZSB0b3ApXG4gIGlmIChvcHRpb25zLmluZm9ib3hlcyA9PT0gdHJ1ZSAmJiBkYXRhLmluZm9ib3hlcykge1xuICAgIG1kICs9IGRhdGEuaW5mb2JveGVzLm1hcChvID0+IGRvSW5mb2JveChvLCBvcHRpb25zKSkuam9pbignXFxuJyk7XG4gIH1cbiAgLy9yZW5kZXIgZWFjaCBzZWN0aW9uXG4gIG1kICs9IGRhdGEuc2VjdGlvbnMubWFwKHMgPT4gZG9TZWN0aW9uKHMsIG9wdGlvbnMpKS5qb2luKCdcXG5cXG4nKTtcbiAgcmV0dXJuIG1kO1xufTtcbm1vZHVsZS5leHBvcnRzID0gdG9NYXJrZG93bjtcbiIsImNvbnN0IGRvU2VudGVuY2UgPSByZXF1aXJlKCcuL3NlbnRlbmNlJyk7XG5jb25zdCBwYWQgPSByZXF1aXJlKCcuL3BhZCcpO1xuXG5jb25zdCBkb250RG8gPSB7XG4gIGltYWdlOiB0cnVlLFxuICBjYXB0aW9uOiB0cnVlXG59O1xuXG4vLyByZW5kZXIgYW4gaW5mb2JveCBhcyBhIHRhYmxlIHdpdGggdHdvIGNvbHVtbnMsIGtleSArIHZhbHVlXG5jb25zdCBkb0luZm9ib3ggPSBmdW5jdGlvbihvYmosIG9wdGlvbnMpIHtcbiAgbGV0IG1kID0gJ3wnICsgcGFkKCcnKSArICd8JyArIHBhZCgnJykgKyAnfFxcbic7XG4gIG1kICs9ICd8JyArIHBhZCgnLS0tJykgKyAnfCcgKyBwYWQoJy0tLScpICsgJ3xcXG4nO1xuICBPYmplY3Qua2V5cyhvYmouZGF0YSkuZm9yRWFjaCgoaykgPT4ge1xuICAgIGlmIChkb250RG9ba10gPT09IHRydWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGtleSA9ICcqKicgKyBrICsgJyoqJztcbiAgICBsZXQgdmFsID0gZG9TZW50ZW5jZShvYmouZGF0YVtrXSwgb3B0aW9ucyk7XG4gICAgbWQgKz0gJ3wnICsgcGFkKGtleSkgKyAnfCcgKyBwYWQodmFsKSArICcgfFxcbic7XG5cbiAgfSk7XG4gIHJldHVybiBtZDtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGRvSW5mb2JveDtcbiIsImNvbnN0IGNlbGxXaWR0aCA9IDE1O1xuLy9jZW50ZXItcGFkIGVhY2ggY2VsbCwgdG8gbWFrZSB0aGUgdGFibGUgbW9yZSBsZWdpYmxlXG5jb25zdCBwYWQgPSAoc3RyKSA9PiB7XG4gIHN0ciA9IHN0ciB8fCAnJztcbiAgbGV0IGRpZmYgPSBjZWxsV2lkdGggLSBzdHIubGVuZ3RoO1xuICBkaWZmID0gcGFyc2VJbnQoZGlmZiAvIDIsIDEwKTtcbiAgZm9yKGxldCBpID0gMDsgaSA8IGRpZmY7IGkgKz0gMSkge1xuICAgIHN0ciA9ICcgJyArIHN0ciArICcgJztcbiAgfVxuICByZXR1cm4gc3RyO1xufTtcbm1vZHVsZS5leHBvcnRzID0gcGFkO1xuIiwiY29uc3Qgc21hcnRSZXBsYWNlID0gcmVxdWlyZSgnLi4vbGliJykuc21hcnRSZXBsYWNlO1xuXG4vLyBhZGQgYFt0ZXh0XShocmVmKWAgdG8gdGhlIHRleHRcbmNvbnN0IGRvTGluayA9IGZ1bmN0aW9uKG1kLCBsaW5rKSB7XG4gIGxldCBocmVmID0gJyc7XG4gIC8vaWYgaXQncyBhbiBleHRlcm5hbCBsaW5rLCB3ZSBnb29kXG4gIGlmIChsaW5rLnNpdGUpIHtcbiAgICBocmVmID0gbGluay5zaXRlO1xuICB9IGVsc2Uge1xuICAgIC8vb3RoZXJ3aXNlLCBtYWtlIGl0IGEgcmVsYXRpdmUgaW50ZXJuYWwgbGlua1xuICAgIGhyZWYgPSBsaW5rLnBhZ2UgfHwgbGluay50ZXh0O1xuICAgIGhyZWYgPSAnLi8nICsgaHJlZi5yZXBsYWNlKC8gL2csICdfJyk7XG4gIH1cbiAgbGV0IG1kTGluayA9ICdbJyArIGxpbmsudGV4dCArICddKCcgKyBocmVmICsgJyknO1xuICBtZCA9IHNtYXJ0UmVwbGFjZShtZCwgbGluay50ZXh0LCBtZExpbmspO1xuICByZXR1cm4gbWQ7XG59O1xuXG4vL2NyZWF0ZSBsaW5rcywgYm9sZCwgaXRhbGljIGluIG1hcmtkb3duXG5jb25zdCBkb1NlbnRlbmNlID0gKHNlbnRlbmNlLCBvcHRpb25zKSA9PiB7XG4gIGxldCBtZCA9IHNlbnRlbmNlLnRleHQ7XG4gIC8vdHVybiBsaW5rcyBiYWNrIGludG8gbGlua3NcbiAgaWYgKHNlbnRlbmNlLmxpbmtzICYmIG9wdGlvbnMubGlua3MgPT09IHRydWUpIHtcbiAgICBzZW50ZW5jZS5saW5rcy5mb3JFYWNoKChsaW5rKSA9PiB7XG4gICAgICBtZCA9IGRvTGluayhtZCwgbGluayk7XG4gICAgfSk7XG4gIH1cbiAgLy90dXJuIGJvbGRzIGludG8gKipib2xkKipcbiAgaWYgKHNlbnRlbmNlLmZtdCAmJiBzZW50ZW5jZS5mbXQuYm9sZCkge1xuICAgIHNlbnRlbmNlLmZtdC5ib2xkLmZvckVhY2goKGIpID0+IHtcbiAgICAgIG1kID0gc21hcnRSZXBsYWNlKG1kLCBiLCAnKionICsgYiArICcqKicpO1xuICAgIH0pO1xuICB9XG4gIC8vc3VwcG9ydCAqaXRhbGljcypcbiAgaWYgKHNlbnRlbmNlLmZtdCAmJiBzZW50ZW5jZS5mbXQuaXRhbGljKSB7XG4gICAgc2VudGVuY2UuZm10Lml0YWxpYy5mb3JFYWNoKChpKSA9PiB7XG4gICAgICBtZCA9IHNtYXJ0UmVwbGFjZShtZCwgaSwgJyonICsgaSArICcqJyk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG1kO1xufTtcbm1vZHVsZS5leHBvcnRzID0gZG9TZW50ZW5jZTtcbiIsImNvbnN0IGRvU2VudGVuY2UgPSByZXF1aXJlKCcuL3NlbnRlbmNlJyk7XG5jb25zdCBwYWQgPSByZXF1aXJlKCcuL3BhZCcpO1xuLyogdGhpcyBpcyBhIG1hcmtkb3duIHRhYmxlOlxufCBUYWJsZXMgICAgICAgIHwgQXJlICAgICAgICAgICB8IENvb2wgIHxcbnwgLS0tLS0tLS0tLS0tLSB8Oi0tLS0tLS0tLS0tLS06fCAtLS0tLTp8XG58IGNvbCAzIGlzICAgICAgfCByaWdodC1hbGlnbmVkIHwgJDE2MDAgfFxufCBjb2wgMiBpcyAgICAgIHwgY2VudGVyZWQgICAgICB8ICAgJDEyIHxcbnwgemVicmEgc3RyaXBlcyB8IGFyZSBuZWF0ICAgICAgfCAgICAkMSB8XG4qL1xuXG5jb25zdCBtYWtlUm93ID0gKGFycikgPT4ge1xuICBhcnIgPSBhcnIubWFwKHBhZCk7XG4gIHJldHVybiAnfCAnICsgYXJyLmpvaW4oJyB8ICcpICsgJyB8Jztcbn07XG5cbi8vbWFya2Rvd24gdGFibGVzIGFyZSB3ZWlyZFxuY29uc3QgZG9UYWJsZSA9ICh0YWJsZSwgb3B0aW9ucykgPT4ge1xuICBsZXQgbWQgPSAnJztcbiAgaWYgKCF0YWJsZSB8fCB0YWJsZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbWQ7XG4gIH1cbiAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyh0YWJsZVswXSk7XG4gIC8vZmlyc3QsIGdyYWIgdGhlIGhlYWRlcnNcbiAgLy9yZW1vdmUgYXV0by1nZW5lcmF0ZWQgbnVtYmVyIGtleXNcbiAgbGV0IGhlYWRlciA9IGtleXMubWFwKChrLCBpKSA9PiB7XG4gICAgaWYgKHBhcnNlSW50KGssIDEwKSA9PT0gaSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gaztcbiAgfSk7XG4gIC8vZHJhdyB0aGUgaGVhZGVyIChuZWNlc3NhcnkhKVxuICBtZCArPSBtYWtlUm93KGhlYWRlcikgKyAnXFxuJztcbiAgbWQgKz0gbWFrZVJvdyhbJy0tLScsICctLS0nLCAnLS0tJ10pICsgJ1xcbic7XG4gIC8vZG8gZWFjaCByb3cuLlxuICBtZCArPSB0YWJsZS5tYXAoKHJvdykgPT4ge1xuICAgIC8vZWFjaCBjb2x1bW4uLlxuICAgIGxldCBhcnIgPSBrZXlzLm1hcCgoaykgPT4ge1xuICAgICAgaWYgKCFyb3dba10pIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRvU2VudGVuY2Uocm93W2tdLCBvcHRpb25zKSB8fCAnJztcbiAgICB9KTtcbiAgICAvL21ha2UgaXQgYSBuaWNlIHBhZGRlZCByb3dcbiAgICByZXR1cm4gbWFrZVJvdyhhcnIpO1xuICB9KS5qb2luKCdcXG4nKTtcbiAgcmV0dXJuIG1kICsgJ1xcbic7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBkb1RhYmxlO1xuIiwiY29uc3QgaTE4biA9IHJlcXVpcmUoJy4uL2RhdGEvaTE4bicpO1xuY29uc3QgY2F0X3JlZyA9IG5ldyBSZWdFeHAoJ1xcXFxbXFxcXFs6PygnICsgaTE4bi5jYXRlZ29yaWVzLmpvaW4oJ3wnKSArICcpOiguezIsNjB9PyldXSh3ezAsMTB9KScsICdpZycpO1xuY29uc3QgY2F0X3JlbW92ZV9yZWcgPSBuZXcgUmVnRXhwKCdeXFxcXFtcXFxcWzo/KCcgKyBpMThuLmNhdGVnb3JpZXMuam9pbignfCcpICsgJyk6JywgJ2lnJyk7XG5cbmNvbnN0IHBhcnNlX2NhdGVnb3JpZXMgPSBmdW5jdGlvbihyLCB3aWtpKSB7XG4gIHIuY2F0ZWdvcmllcyA9IFtdO1xuICBsZXQgdG1wID0gd2lraS5tYXRjaChjYXRfcmVnKTsgLy9yZWd1bGFyIGxpbmtzXG4gIGlmICh0bXApIHtcbiAgICB0bXAuZm9yRWFjaChmdW5jdGlvbihjKSB7XG4gICAgICBjID0gYy5yZXBsYWNlKGNhdF9yZW1vdmVfcmVnLCAnJyk7XG4gICAgICBjID0gYy5yZXBsYWNlKC9cXHw/WyBcXCpdP1xcXVxcXSQvaSwgJycpOyAvL3BhcnNlIGZhbmN5IG9uY2VzLi5cbiAgICAgIGMgPSBjLnJlcGxhY2UoL1xcfC4qLywgJycpOyAvL2V2ZXJ5dGhpbmcgYWZ0ZXIgdGhlICd8JyBpcyBtZXRhZGF0YVxuICAgICAgaWYgKGMgJiYgIWMubWF0Y2goL1tcXFtcXF1dLykpIHtcbiAgICAgICAgci5jYXRlZ29yaWVzLnB1c2goYyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgd2lraSA9IHdpa2kucmVwbGFjZShjYXRfcmVnLCAnJyk7XG4gIHJldHVybiB3aWtpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gcGFyc2VfY2F0ZWdvcmllcztcbiIsImNvbnN0IHJlZGlyZWN0cyA9IHJlcXVpcmUoJy4vcGFnZS9yZWRpcmVjdHMnKTtcbmNvbnN0IGRpc2FtYmlnID0gcmVxdWlyZSgnLi9wYWdlL2Rpc2FtYmlnJyk7XG5jb25zdCBwcmVQcm9jZXNzID0gcmVxdWlyZSgnLi9wcmVQcm9jZXNzJyk7XG5jb25zdCBwb3N0UHJvY2VzcyA9IHJlcXVpcmUoJy4vcG9zdFByb2Nlc3MnKTtcbmNvbnN0IHBhcnNlID0ge1xuICBzZWN0aW9uOiByZXF1aXJlKCcuL3NlY3Rpb24nKSxcbiAgaW5mb2JveDogcmVxdWlyZSgnLi9pbmZvYm94JyksXG4gIGNhdGVnb3JpZXM6IHJlcXVpcmUoJy4vY2F0ZWdvcmllcycpXG59O1xuXG4vL2NvbnZlcnQgd2lraXNjcmlwdCBtYXJrdXAgbGFuZyB0byBqc29uXG5jb25zdCBtYWluID0gZnVuY3Rpb24od2lraSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgd2lraSA9IHdpa2kgfHwgJyc7XG4gIC8vZGV0ZWN0IGlmIHBhZ2UgaXMganVzdCByZWRpcmVjdCwgYW5kIHJldHVyblxuICBpZiAocmVkaXJlY3RzLmlzX3JlZGlyZWN0KHdpa2kpKSB7XG4gICAgcmV0dXJuIHJlZGlyZWN0cy5wYXJzZV9yZWRpcmVjdCh3aWtpKTtcbiAgfVxuICAvL2RldGVjdCBpZiBwYWdlIGlzIGp1c3QgZGlzYW1iaWd1YXRvciBwYWdlLCBhbmQgcmV0dXJuXG4gIGlmIChkaXNhbWJpZy5pc19kaXNhbWJpZyh3aWtpKSkge1xuICAgIHJldHVybiBkaXNhbWJpZy5wYXJzZV9kaXNhbWJpZyh3aWtpKTtcbiAgfVxuICBsZXQgciA9IHtcbiAgICB0eXBlOiAncGFnZScsXG4gICAgc2VjdGlvbnM6IFtdLFxuICAgIGluZm9ib3hlczogW10sXG4gICAgaW50ZXJ3aWtpOiB7fSxcbiAgICBjYXRlZ29yaWVzOiBbXSxcbiAgICBpbWFnZXM6IFtdLFxuICAgIGNvb3JkaW5hdGVzOiBbXSxcbiAgICBjaXRhdGlvbnM6IFtdXG4gIH07XG4gIGlmIChvcHRpb25zLmN1c3RvbSkge1xuICAgIHIuY3VzdG9tID0ge307XG4gIH1cbiAgaWYgKG9wdGlvbnMucGFnZV9pZGVudGlmaWVyKSB7XG4gICAgci5wYWdlX2lkZW50aWZpZXIgPSBvcHRpb25zLnBhZ2VfaWRlbnRpZmllcjtcbiAgfVxuICBpZiAob3B0aW9ucy5sYW5nX29yX3dpa2lpZCkge1xuICAgIHIubGFuZ19vcl93aWtpaWQgPSBvcHRpb25zLmxhbmdfb3Jfd2lraWlkO1xuICB9XG4gIC8vZ2l2ZSBvdXJzZWx2ZXMgYSBsaXR0bGUgaGVhZC1zdGFydFxuICB3aWtpID0gcHJlUHJvY2VzcyhyLCB3aWtpLCBvcHRpb25zKTtcbiAgLy9wdWxsLW91dCBpbmZvYm94ZXMgYW5kIHN0dWZmXG4gIHdpa2kgPSBwYXJzZS5pbmZvYm94KHIsIHdpa2ksIG9wdGlvbnMpO1xuICAvL3B1bGwtb3V0IFtbY2F0ZWdvcnk6d2hhdGV2ZXJzXV1cbiAgaWYgKG9wdGlvbnMuY2F0ZWdvcmllcyAhPT0gZmFsc2UpIHtcbiAgICB3aWtpID0gcGFyc2UuY2F0ZWdvcmllcyhyLCB3aWtpKTtcbiAgfVxuICAvL3BhcnNlIGFsbCB0aGUgaGVhZGluZ3MsIGFuZCB0aGVpciB0ZXh0cy9zZW50ZW5jZXNcbiAgci5zZWN0aW9ucyA9IHBhcnNlLnNlY3Rpb24ociwgd2lraSwgb3B0aW9ucykgfHwgW107XG5cbiAgciA9IHBvc3RQcm9jZXNzKHIpO1xuXG4gIHJldHVybiByO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBtYWluO1xuIiwiLy9cbmNvbnN0IHBhcnNlQ2l0YXRpb24gPSBmdW5jdGlvbihzdHIsIHdpa2ksIHIsIG9wdGlvbnMpIHtcbiAgLy9yZW1vdmUgaXQgZnJvbSBtYWluXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2Uoc3RyLCAnJyk7XG4gIGlmIChvcHRpb25zLmNpdGF0aW9ucyA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gd2lraTtcbiAgfVxuICAvL3RyaW0gc3RhcnQge3sgYW5kXG4gIC8vdHJpbSBlbmQgfX1cbiAgc3RyID0gc3RyLnJlcGxhY2UoL15cXHtcXHsgKj8vLCAnJyk7XG4gIHN0ciA9IHN0ci5yZXBsYWNlKC8gKj9cXH1cXH0gKj8kLywgJycpO1xuICAvL3N0YXJ0IHBhcnNpbmcgY2l0YXRpb24gaW50byBqc29uXG4gIGxldCBvYmogPSB7fTtcbiAgbGV0IGxpbmVzID0gc3RyLnNwbGl0KC9cXHwvZyk7XG4gIC8vZmlyc3QgbGluZSBpcyAnY2l0ZSB3ZWInXG4gIGxldCB0eXBlID0gbGluZXNbMF0ubWF0Y2goL2NpdGUgKFthLXpfXSspL2kpIHx8IFtdO1xuICBpZiAodHlwZVsxXSkge1xuICAgIG9iai5jaXRlID0gdHlwZVsxXSB8fCBudWxsO1xuICB9XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgbGluZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBsZXQgYXJyID0gbGluZXNbaV0uc3BsaXQoLz0vKTtcbiAgICBsZXQga2V5ID0gYXJyWzBdLnRyaW0oKTtcbiAgICBsZXQgdmFsID0gYXJyXG4gICAgICAuc2xpY2UoMSwgYXJyLmxlbmd0aClcbiAgICAgIC5qb2luKCc9JylcbiAgICAgIC50cmltKCk7XG4gICAgaWYgKGtleSAmJiB2YWwpIHtcbiAgICAgIC8vdHVybiBudW1iZXJzIGludG8gbnVtYmVyc1xuICAgICAgaWYgKC9eWzAtOS5dKyQvLnRlc3QodmFsKSkge1xuICAgICAgICB2YWwgPSBwYXJzZUZsb2F0KHZhbCk7XG4gICAgICB9XG4gICAgICBvYmpba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID4gMCkge1xuICAgIHIuY2l0YXRpb25zLnB1c2gob2JqKTtcbiAgfVxuICByZXR1cm4gd2lraTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlQ2l0YXRpb247XG4iLCJjb25zdCBpMThuID0gcmVxdWlyZSgnLi4vLi4vZGF0YS9pMThuJyk7XG5jb25zdCBmaW5kUmVjdXJzaXZlID0gcmVxdWlyZSgnLi4vLi4vbGliL3JlY3Vyc2l2ZV9tYXRjaCcpO1xuY29uc3QgcGFyc2VJbmZvYm94ID0gcmVxdWlyZSgnLi9pbmZvYm94Jyk7XG5jb25zdCBwYXJzZUNpdGF0aW9uID0gcmVxdWlyZSgnLi9jaXRhdGlvbicpO1xuY29uc3Qga2VlcCA9IHJlcXVpcmUoJy4uL3NlY3Rpb24vc2VudGVuY2UvdGVtcGxhdGVzL3RlbXBsYXRlcycpOyAvL2RvbnQgcmVtb3ZlIHRoZXNlIG9uZXNcbmNvbnN0IGluZm9ib3hfcmVnID0gbmV3IFJlZ0V4cCgne3soJyArIGkxOG4uaW5mb2JveGVzLmpvaW4oJ3wnKSArICcpWzogXFxuXScsICdpZycpO1xuXG4vL3JlZHVjZSB0aGUgc2NhcnkgcmVjdXJzaXZlIHNpdHVhdGlvbnNcbmNvbnN0IHBhcnNlX3JlY3Vyc2l2ZSA9IGZ1bmN0aW9uKHIsIHdpa2ksIG9wdGlvbnMpIHtcbiAgLy9yZW1vdmUge3t0ZW1wbGF0ZSB7e319IH19IHJlY3Vyc2lvbnNcbiAgci5pbmZvYm94ZXMgPSBbXTtcbiAgbGV0IG1hdGNoZXMgPSBmaW5kUmVjdXJzaXZlKCd7JywgJ30nLCB3aWtpKS5maWx0ZXIocyA9PiBzWzBdICYmIHNbMV0gJiYgc1swXSA9PT0gJ3snICYmIHNbMV0gPT09ICd7Jyk7XG4gIG1hdGNoZXMuZm9yRWFjaChmdW5jdGlvbih0bXBsKSB7XG4gICAgaWYgKHRtcGwubWF0Y2goaW5mb2JveF9yZWcsICdpZycpKSB7XG4gICAgICBpZiAob3B0aW9ucy5pbmZvYm94ZXMgIT09IGZhbHNlKSB7XG4gICAgICAgIGxldCBpbmZvYm94ID0gcGFyc2VJbmZvYm94KHRtcGwpO1xuICAgICAgICByLmluZm9ib3hlcy5wdXNoKGluZm9ib3gpO1xuICAgICAgfVxuICAgICAgd2lraSA9IHdpa2kucmVwbGFjZSh0bXBsLCAnJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8va2VlcCB0aGVzZSBvbmVzLCB3ZSdsbCBwYXJzZSB0aGVtIGxhdGVyXG4gICAgbGV0IG5hbWUgPSB0bXBsLm1hdGNoKC9eXFx7XFx7KFteOnxcXG4gXSspLyk7XG4gICAgaWYgKG5hbWUgIT09IG51bGwpIHtcbiAgICAgIG5hbWUgPSBuYW1lWzFdLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICBpZiAoL15cXHtcXHsgP2NpdGF0aW9uIG5lZWRlZC9pLnRlc3QodG1wbCkgPT09IHRydWUpIHtcbiAgICAgICAgbmFtZSA9ICdjaXRhdGlvbiBuZWVkZWQnO1xuICAgICAgfVxuICAgICAgLy9wYXJzZSB7e2NpdGUgd2ViIC4uLn19IChpdCBhcHBlYXJzIGV2ZXJ5IGxhbmd1YWdlKVxuICAgICAgaWYgKG5hbWUgPT09ICdjaXRlJyB8fCBuYW1lID09PSAnY2l0YXRpb24nKSB7XG4gICAgICAgIHdpa2kgPSBwYXJzZUNpdGF0aW9uKHRtcGwsIHdpa2ksIHIsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vc29ydGEta2VlcCBub3dyYXAgdGVtcGxhdGVcbiAgICAgIGlmIChuYW1lID09PSAnbm93cmFwJykge1xuICAgICAgICBsZXQgaW5zaWRlID0gdG1wbC5tYXRjaCgvXlxce1xce25vd3JhcCAqP1xcfCguKj8pXFx9XFx9JC8pO1xuICAgICAgICBpZiAoaW5zaWRlKSB7XG4gICAgICAgICAgd2lraSA9IHdpa2kucmVwbGFjZSh0bXBsLCBpbnNpZGVbMV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoa2VlcC5oYXNPd25Qcm9wZXJ0eShuYW1lKSA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIC8vbGV0IGV2ZXJ5Ym9keSBhZGQgYSBjdXN0b20gcGFyc2VyIGZvciB0aGlzIHRlbXBsYXRlXG4gICAgaWYgKG9wdGlvbnMuY3VzdG9tKSB7XG4gICAgICBPYmplY3Qua2V5cyhvcHRpb25zLmN1c3RvbSkuZm9yRWFjaChrID0+IHtcbiAgICAgICAgbGV0IHZhbCA9IG9wdGlvbnMuY3VzdG9tW2tdKHRtcGwsIHdpa2kpO1xuICAgICAgICBpZiAodmFsIHx8IHZhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAvL2RvbnQgc3RvcmUgYWxsIHRoZSBudWxsc1xuICAgICAgICAgIHIuY3VzdG9tW2tdID0gci5jdXN0b21ba10gfHwgW107XG4gICAgICAgICAgci5jdXN0b21ba10ucHVzaCh2YWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy9pZiBpdCdzIG5vdCBhIGtub3duIHRlbXBsYXRlLCBidXQgaXQncyByZWN1cnNpdmUsIHJlbW92ZSBpdFxuICAgIC8vKGJlY2F1c2UgaXQgd2lsbCBiZSBtaXNyZWFkIGxhdGVyLW9uKVxuICAgIHdpa2kgPSB3aWtpLnJlcGxhY2UodG1wbCwgJycpO1xuICB9KTtcbiAgLy8gLy9vaywgbm93IHRoYXQgdGhlIHNjYXJ5IHJlY3Vyc2lvbiBpc3N1ZXMgYXJlIGdvbmUsIHdlIGNhbiB0cnVzdCBzaW1wbGUgcmVnZXggbWV0aG9kcy4uXG4gIC8vIC8va2lsbCB0aGUgcmVzdCBvZiB0ZW1wbGF0ZXNcbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvXFx7XFx7ICo/KF4obWFpbnx3aWRlKSkuKj9cXH1cXH0vZywgJycpO1xuICByZXR1cm4gd2lraTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VfcmVjdXJzaXZlO1xuIiwiY29uc3QgdHJpbSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9oZWxwZXJzJykudHJpbV93aGl0ZXNwYWNlO1xuY29uc3QgcGFyc2VMaW5lID0gcmVxdWlyZSgnLi4vc2VjdGlvbi9zZW50ZW5jZScpLnBhcnNlTGluZTtcbmNvbnN0IGZpbmRSZWN1cnNpdmUgPSByZXF1aXJlKCcuLi8uLi9saWIvcmVjdXJzaXZlX21hdGNoJyk7XG5jb25zdCBpMThuID0gcmVxdWlyZSgnLi4vLi4vZGF0YS9pMThuJyk7XG5jb25zdCBpbmZvYm94X3RlbXBsYXRlX3JlZyA9IG5ldyBSZWdFeHAoJ3t7KD86JyArIGkxOG4uaW5mb2JveGVzLmpvaW4oJ3wnKSArICcpXFxcXHMqKC4qKScsICdpJyk7XG5cbmNvbnN0IGdldFRlbXBsYXRlID0gZnVuY3Rpb24oc3RyKSB7XG4gIGxldCBtID0gc3RyLm1hdGNoKGluZm9ib3hfdGVtcGxhdGVfcmVnKTtcbiAgaWYgKG0gJiYgbVsxXSkge1xuICAgIHJldHVybiBtWzFdO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuY29uc3QgcGFyc2VfaW5mb2JveCA9IGZ1bmN0aW9uKHN0cikge1xuICBpZiAoIXN0cikge1xuICAgIHJldHVybiB7fTtcbiAgfVxuICBsZXQgc3RyaW5nQnVpbGRlciA9IFtdO1xuICBsZXQgbGFzdENoYXI7XG4gIC8vdGhpcyBjb2xsYXBzaWJsZSBsaXN0IHN0dWZmIGlzIGp1c3QgYSBoZWFkYWNoZVxuICBsZXQgbGlzdFJlZyA9IC9cXHtcXHsgPyhjb2xsYXBzaWJsZXxobGlzdHx1Ymxpc3R8cGxhaW5saXN0fFVuYnVsbGV0ZWQgbGlzdHxmbGF0bGlzdCkvaTtcbiAgaWYgKGxpc3RSZWcudGVzdChzdHIpKSB7XG4gICAgbGV0IGxpc3QgPSBmaW5kUmVjdXJzaXZlKCd7JywgJ30nLCBzdHIuc3Vic3RyKDIsIHN0ci5sZW5ndGggLSAyKSkuZmlsdGVyKChmKSA9PiBsaXN0UmVnLnRlc3QoZikpO1xuICAgIHN0ciA9IHN0ci5yZXBsYWNlKGxpc3RbMF0sICcnKTtcbiAgfVxuXG4gIGNvbnN0IHRlbXBsYXRlID0gZ2V0VGVtcGxhdGUoc3RyKTsgLy9nZXQgdGhlIGluZm9ib3ggbmFtZVxuXG4gIGxldCBwYXJEZXB0aCA9IC0yOyAvLyBmaXJzdCB0d28ge3tcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHN0ci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChwYXJEZXB0aCA9PT0gMCAmJiBzdHJbaV0gPT09ICd8JyAmJiBsYXN0Q2hhciAhPT0gJ1xcbicpIHtcbiAgICAgIHN0cmluZ0J1aWxkZXIucHVzaCgnXFxuJyk7XG4gICAgfVxuICAgIGlmIChzdHJbaV0gPT09ICd7JyB8fCBzdHJbaV0gPT09ICdbJykge1xuICAgICAgcGFyRGVwdGgrKztcbiAgICB9IGVsc2UgaWYgKHN0cltpXSA9PT0gJ30nIHx8IHN0cltpXSA9PT0gJ10nKSB7XG4gICAgICBwYXJEZXB0aC0tO1xuICAgIH1cbiAgICBsYXN0Q2hhciA9IHN0cltpXTtcbiAgICBzdHJpbmdCdWlsZGVyLnB1c2gobGFzdENoYXIpO1xuICB9XG5cbiAgc3RyID0gc3RyaW5nQnVpbGRlci5qb2luKCcnKTtcbiAgLy9yZW1vdmUgdG9wK2JvdHRvbVxuICBzdHIgPSBzdHIucmVwbGFjZSgvXiAqP1xce1xcey4rW3xcXG5dLywgJycpO1xuICBzdHIgPSBzdHIucmVwbGFjZSgvXFx9XFx9ICo/JC8sICcnKTtcbiAgbGV0IGxpbmVzID0gc3RyLnNwbGl0KC9cXG5cXCo/Lyk7XG5cbiAgbGV0IG9iaiA9IHt9O1xuICBsZXQga2V5ID0gbnVsbDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBsID0gbGluZXNbaV07XG4gICAgbGV0IGtleU1hdGNoID0gbC5tYXRjaCgvXFx8ICo/KFtePV0rKT0oLispPy9pKTtcbiAgICBpZiAoa2V5TWF0Y2ggJiYga2V5TWF0Y2hbMV0pIHtcbiAgICAgIGtleSA9IHRyaW0oa2V5TWF0Y2hbMV0pO1xuICAgICAgaWYgKGtleU1hdGNoWzJdKSB7XG4gICAgICAgIG9ialtrZXldID0gdHJpbShrZXlNYXRjaFsyXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmpba2V5XSA9ICcnO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoa2V5KSB7XG4gICAgICBvYmpba2V5XSArPSBsO1xuICAgIH1cbiAgfVxuICAvL3Bvc3QtcHJvY2VzcyB2YWx1ZXNcbiAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGsgPT4ge1xuICAgIGlmICghb2JqW2tdKSB7XG4gICAgICBkZWxldGUgb2JqW2tdO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvYmpba10gPSBwYXJzZUxpbmUob2JqW2tdKTtcbiAgICBpZiAob2JqW2tdLnRleHQgJiYgb2JqW2tdLnRleHQubWF0Y2goL15bMC05LF0qJC8pKSB7XG4gICAgICBvYmpba10udGV4dCA9IG9ialtrXS50ZXh0LnJlcGxhY2UoLywvLCAnJyk7XG4gICAgICBvYmpba10udGV4dCA9IHBhcnNlSW50KG9ialtrXS50ZXh0LCAxMCk7XG4gICAgfVxuICB9KTtcbiAgLy8gLy9yZW1vdmUgdG9wK2JvdHRvbVxuICAvLyBpZihsaW5lcy5sZW5ndGg+MSAmJiBsaW5lc1swXS5tYXRjaCgpXG4gIC8vIGNvbnNvbGUubG9nKHJlZ2V4TWF0Y2gpO1xuICAvLyBjb25zb2xlLmxvZygnXFxuXFxuXFxuJyk7XG4gIC8vIHdoaWxlICgocmVnZXhNYXRjaCA9IGxpbmVfcmVnLmV4ZWMoc3RyKSkgIT09IG51bGwpIHtcbiAgLy8gICAvLyBjb25zb2xlLmxvZyhzdHIgKyAnLS0tLScpO1xuICAvLyAgIGxldCBrZXkgPSBoZWxwZXJzLnRyaW1fd2hpdGVzcGFjZShyZWdleE1hdGNoWzFdIHx8ICcnKSB8fCAnJztcbiAgLy8gICBsZXQgdmFsdWUgPSBoZWxwZXJzLnRyaW1fd2hpdGVzcGFjZShyZWdleE1hdGNoWzJdIHx8ICcnKSB8fCAnJztcbiAgLy9cbiAgLy8gICAvL3RoaXMgaXMgbmVjZXNzYXJ5IGZvciBtb25nb2RiLCBpbSBzb3JyeVxuICAvLyAgIGtleSA9IGtleS5yZXBsYWNlKC9cXC4vLCAnJyk7XG4gIC8vICAgaWYgKGtleSAmJiB2YWx1ZSkge1xuICAvLyAgICAgb2JqW2tleV0gPSBwYXJzZV9saW5lKHZhbHVlKTtcbiAgLy8gICAgIC8vdHVybiBudW1iZXIgc3RyaW5ncyBpbnRvIGludGVnZXJzXG4gIC8vICAgICBpZiAob2JqW2tleV0udGV4dCAmJiBvYmpba2V5XS50ZXh0Lm1hdGNoKC9eWzAtOSxdKiQvKSkge1xuICAvLyAgICAgICBvYmpba2V5XS50ZXh0ID0gb2JqW2tleV0udGV4dC5yZXBsYWNlKC8sLywgJycpO1xuICAvLyAgICAgICBvYmpba2V5XS50ZXh0ID0gcGFyc2VJbnQob2JqW2tleV0udGV4dCwgMTApO1xuICAvLyAgICAgfVxuICAvLyAgIH1cbiAgLy8gfVxuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgICBkYXRhOiBvYmpcbiAgfTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlX2luZm9ib3g7XG4iLCJjb25zdCBpMThuID0gcmVxdWlyZSgnLi4vLi4vZGF0YS9pMThuJyk7XG5jb25zdCBwYXJzZV9saW5rcyA9IHJlcXVpcmUoJy4uL3NlY3Rpb24vc2VudGVuY2UvbGlua3MnKTtcbmNvbnN0IHRlbXBsYXRlX3JlZyA9IG5ldyBSZWdFeHAoJ1xcXFx7XFxcXHsgPygnICsgaTE4bi5kaXNhbWJpZ3Muam9pbignfCcpICsgJykoXFxcXHxbYS16ID1dKj8pPyA/XFxcXH1cXFxcfScsICdpJyk7XG5cbmNvbnN0IGlzX2Rpc2FtYmlnID0gZnVuY3Rpb24od2lraSkge1xuICByZXR1cm4gdGVtcGxhdGVfcmVnLnRlc3Qod2lraSk7XG59O1xuXG4vL3JldHVybiBhIGxpc3Qgb2YgcHJvYmFibGUgcGFnZXMgZm9yIHRoaXMgZGlzYW1iaWcgcGFnZVxuY29uc3QgcGFyc2VfZGlzYW1iaWcgPSBmdW5jdGlvbih3aWtpKSB7XG4gIGxldCBwYWdlcyA9IFtdO1xuICBsZXQgbGluZXMgPSB3aWtpLnJlcGxhY2UoL1xcci9nLCAnJykuc3BsaXQoL1xcbi8pO1xuICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKHN0cikge1xuICAgIC8vaWYgdGhlcmUncyBhbiBlYXJseSBsaW5rIGluIHRoZSBsaXN0XG4gICAgaWYgKHN0ci5tYXRjaCgvXlxcKi57MCw0MH1cXFtcXFsuKlxcXVxcXS8pKSB7XG4gICAgICBsZXQgbGlua3MgPSBwYXJzZV9saW5rcyhzdHIpO1xuICAgICAgaWYgKGxpbmtzICYmIGxpbmtzWzBdICYmIGxpbmtzWzBdLnBhZ2UpIHtcbiAgICAgICAgcGFnZXMucHVzaChsaW5rc1swXS5wYWdlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdkaXNhbWJpZ3VhdGlvbicsXG4gICAgcGFnZXM6IHBhZ2VzXG4gIH07XG59O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzX2Rpc2FtYmlnOiBpc19kaXNhbWJpZyxcbiAgcGFyc2VfZGlzYW1iaWc6IHBhcnNlX2Rpc2FtYmlnXG59O1xuIiwiY29uc3QgaTE4biA9IHJlcXVpcmUoJy4uLy4uL2RhdGEvaTE4bicpO1xuLy9wdWxscyB0YXJnZXQgbGluayBvdXQgb2YgcmVkaXJlY3QgcGFnZVxuY29uc3QgUkVESVJFQ1RfUkVHRVggPSBuZXcgUmVnRXhwKCdeWyBcXG5cXHRdKj8jKCcgKyBpMThuLnJlZGlyZWN0cy5qb2luKCd8JykgKyAnKSAqP1xcXFxbXFxcXFsoLnsyLDYwfT8pXFxcXF1cXFxcXScsICdpJyk7XG5cbmNvbnN0IGlzX3JlZGlyZWN0ID0gZnVuY3Rpb24od2lraSkge1xuICByZXR1cm4gd2lraS5tYXRjaChSRURJUkVDVF9SRUdFWCk7XG59O1xuXG5jb25zdCBwYXJzZV9yZWRpcmVjdCA9IGZ1bmN0aW9uKHdpa2kpIHtcbiAgbGV0IGFydGljbGUgPSAod2lraS5tYXRjaChSRURJUkVDVF9SRUdFWCkgfHwgW10pWzJdIHx8ICcnO1xuICBhcnRpY2xlID0gYXJ0aWNsZS5yZXBsYWNlKC8jLiovLCAnJyk7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ3JlZGlyZWN0JyxcbiAgICByZWRpcmVjdDogYXJ0aWNsZVxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzX3JlZGlyZWN0OiBpc19yZWRpcmVjdCxcbiAgcGFyc2VfcmVkaXJlY3Q6IHBhcnNlX3JlZGlyZWN0XG59O1xuIiwiY29uc3QgaTE4biA9IHJlcXVpcmUoJy4uLy4uL2RhdGEvaTE4bicpO1xuY29uc3QgcGFyc2VJbWFnZSA9IHJlcXVpcmUoJy4uL3NlY3Rpb24vaW1hZ2UvaW1hZ2UnKTtcbmNvbnN0IGltZ19yZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIGkxOG4uaW1hZ2VzLmNvbmNhdChpMThuLmZpbGVzKS5qb2luKCd8JykgKyAnKScsICdpJyk7XG5cbi8vY2xlYW51cCBhZnRlciBvdXJzZWx2ZXNcbmNvbnN0IHBvc3RQcm9jZXNzID0gZnVuY3Rpb24ocikge1xuICAvLyBhZGQgaW1hZ2UgZnJvbSBpbmZvYm94LCBpZiBhcHBsaWNhYmxlXG4gIGlmIChyLmluZm9ib3hlc1swXSAmJiByLmluZm9ib3hlc1swXS5kYXRhICYmIHIuaW5mb2JveGVzWzBdLmRhdGFbJ2ltYWdlJ10gJiYgci5pbmZvYm94ZXNbMF0uZGF0YVsnaW1hZ2UnXS50ZXh0KSB7XG4gICAgbGV0IGltZyA9IHIuaW5mb2JveGVzWzBdLmRhdGFbJ2ltYWdlJ10udGV4dCB8fCAnJztcbiAgICBpZiAoaW1nICYmIHR5cGVvZiBpbWcgPT09ICdzdHJpbmcnICYmICFpbWcubWF0Y2goaW1nX3JlZ2V4KSkge1xuICAgICAgaW1nID0gJ1tbRmlsZTonICsgaW1nICsgJ11dJztcbiAgICAgIGltZyA9IHBhcnNlSW1hZ2UoaW1nKTtcbiAgICAgIHIuaW1hZ2VzLnB1c2goaW1nKTtcbiAgICB9XG4gIH1cbiAgLy9sb29wIGFyb3VuZCBhbmQgYWRkIHRoZSBvdGhlciBpbWFnZXNcbiAgci5zZWN0aW9ucy5mb3JFYWNoKHMgPT4ge1xuICAgIC8vaW1hZ2UgZnJvbSB7e3dpZGUgaW1hZ2V8Li4ufX0gdGVtcGxhdGVcbiAgICBpZiAocy50ZW1wbGF0ZXMgJiYgcy50ZW1wbGF0ZXMud2lkZV9pbWFnZSkge1xuICAgICAgbGV0IGltZyA9IHMudGVtcGxhdGVzLndpZGVfaW1hZ2VbMF07XG4gICAgICBpbWcgPSAnW1tGaWxlOicgKyBpbWcgKyAnXV0nO1xuICAgICAgaW1nID0gcGFyc2VJbWFnZShpbWcpO1xuICAgICAgci5pbWFnZXMucHVzaChpbWcpO1xuICAgIH1cbiAgICBpZiAocy5pbWFnZXMpIHtcbiAgICAgIHMuaW1hZ2VzLmZvckVhY2goaW1nID0+IHIuaW1hZ2VzLnB1c2goaW1nKSk7XG4gICAgfVxuICB9KTtcblxuICAvL3RyeSB0byBndWVzcyB0aGUgcGFnZSdzIHRpdGxlIChmcm9tIHRoZSBib2xkIGZpcnN0LWxpbmUpXG4gIGlmIChyLnNlY3Rpb25zWzBdICYmIHIuc2VjdGlvbnNbMF0uc2VudGVuY2VzWzBdKSB7XG4gICAgbGV0IHMgPSByLnNlY3Rpb25zWzBdLnNlbnRlbmNlc1swXTtcbiAgICBpZiAocy5mbXQgJiYgcy5mbXQuYm9sZCAmJiBzLmZtdC5ib2xkWzBdKSB7XG4gICAgICByLnRpdGxlID0gci50aXRsZSB8fCBzLmZtdC5ib2xkWzBdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHBvc3RQcm9jZXNzO1xuIiwiY29uc3QgY29udmVydEdlbyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9jb252ZXJ0R2VvJyk7XG4vLyB7e2Nvb3JkfGxhdGl0dWRlfGxvbmdpdHVkZXxjb29yZGluYXRlIHBhcmFtZXRlcnN8dGVtcGxhdGUgcGFyYW1ldGVyc319XG4vLyB7e2Nvb3JkfGRkfE4vU3xkZHxFL1d8Y29vcmRpbmF0ZSBwYXJhbWV0ZXJzfHRlbXBsYXRlIHBhcmFtZXRlcnN9fVxuLy8ge3tjb29yZHxkZHxtbXxOL1N8ZGR8bW18RS9XfGNvb3JkaW5hdGUgcGFyYW1ldGVyc3x0ZW1wbGF0ZSBwYXJhbWV0ZXJzfX1cbi8vIHt7Y29vcmR8ZGR8bW18c3N8Ti9TfGRkfG1tfHNzfEUvV3xjb29yZGluYXRlIHBhcmFtZXRlcnN8dGVtcGxhdGUgcGFyYW1ldGVyc319XG5cbmNvbnN0IGhlbWlzcGhlcmVzID0ge1xuICBuOiB0cnVlLFxuICBzOiB0cnVlLFxuICB3OiB0cnVlLFxuICBlOiB0cnVlLFxufTtcblxuY29uc3Qgcm91bmQgPSBmdW5jdGlvbihudW0pIHtcbiAgaWYgKHR5cGVvZiBudW0gIT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIG51bTtcbiAgfVxuICBsZXQgcGxhY2VzID0gMTAwMDAwO1xuICByZXR1cm4gTWF0aC5yb3VuZChudW0gKiBwbGFjZXMpIC8gcGxhY2VzO1xufTtcblxuY29uc3QgcGFyc2VDb29yZCA9IGZ1bmN0aW9uKHN0cikge1xuICBsZXQgb2JqID0ge1xuICAgIGxhdDogbnVsbCxcbiAgICBsb246IG51bGxcbiAgfTtcbiAgbGV0IGFyciA9IHN0ci5zcGxpdCgnfCcpO1xuICAvL3R1cm4gbnVtYmVycyBpbnRvIG51bWJlcnMsIG5vcm1hbGl6ZSBOL3NcbiAgbGV0IG51bXMgPSBbXTtcbiAgZm9yKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGxldCBzID0gYXJyW2ldLnRyaW0oKTtcbiAgICAvL21ha2UgaXQgYSBudW1iZXJcbiAgICBsZXQgbnVtID0gcGFyc2VGbG9hdChzKTtcbiAgICBpZiAobnVtIHx8IG51bSA9PT0gMCkge1xuICAgICAgYXJyW2ldID0gbnVtO1xuICAgICAgbnVtcy5wdXNoKG51bSk7XG4gICAgfSBlbHNlIGlmIChzLm1hdGNoKC9ecmVnaW9uOi9pKSkge1xuICAgICAgb2JqLnJlZ2lvbiA9IHMucmVwbGFjZSgvXnJlZ2lvbjovaSwgJycpO1xuICAgICAgY29udGludWU7XG4gICAgfSBlbHNlIGlmIChzLm1hdGNoKC9ebm90ZXM6L2kpKSB7XG4gICAgICBvYmoubm90ZXMgPSBzLnJlcGxhY2UoL15ub3RlczovaSwgJycpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIC8vRE1TLWZvcm1hdFxuICAgIGlmIChoZW1pc3BoZXJlc1tzLnRvTG93ZXJDYXNlKCldKSB7XG4gICAgICBpZiAob2JqLmxhdCAhPT0gbnVsbCkge1xuICAgICAgICBudW1zLnB1c2gocyk7XG4gICAgICAgIG9iai5sb24gPSBjb252ZXJ0R2VvKG51bXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbnVtcy5wdXNoKHMpO1xuICAgICAgICBvYmoubGF0ID0gY29udmVydEdlbyhudW1zKTtcbiAgICAgICAgYXJyID0gYXJyLnNsaWNlKGksIGFyci5sZW5ndGgpO1xuICAgICAgICBudW1zID0gW107XG4gICAgICAgIGkgPSAwO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvL3RoaXMgaXMgYW4gb3JpZ2luYWwgYGxhdHxsb25gIGZvcm1hdFxuICBpZiAoIW9iai5sb24gJiYgbnVtcy5sZW5ndGggPT09IDIpIHtcbiAgICBvYmoubGF0ID0gbnVtc1swXTtcbiAgICBvYmoubG9uID0gbnVtc1sxXTtcbiAgfVxuICBvYmoubGF0ID0gcm91bmQob2JqLmxhdCk7XG4gIG9iai5sb24gPSByb3VuZChvYmoubG9uKTtcbiAgcmV0dXJuIG9iajtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlQ29vcmQ7XG4iLCJjb25zdCBraWxsX3htbCA9IHJlcXVpcmUoJy4va2lsbF94bWwnKTtcbmNvbnN0IHdvcmRUZW1wbGF0ZXMgPSByZXF1aXJlKCcuL3dvcmRfdGVtcGxhdGVzJyk7XG5cbi8vdGhpcyBtb3N0bHktZm9ybWF0dGluZyBzdHVmZiBjYW4gYmUgY2xlYW5lZC11cCBmaXJzdCwgdG8gbWFrZSBsaWZlIGVhc2llclxuZnVuY3Rpb24gcHJlUHJvY2VzcyhyLCB3aWtpLCBvcHRpb25zKSB7XG4gIC8vcmVtb3ZlIGNvbW1lbnRzXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLzwhLS1bXj5dezAsMjAwMH0tLT4vZywgJycpO1xuICB3aWtpID0gd2lraS5yZXBsYWNlKC9fXyhOT1RPQ3xOT0VESVRTRUNUSU9OfEZPUkNFVE9DfFRPQylfXy9naSwgJycpO1xuICAvL3NpZ25pdHVyZXNcbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvfn57MSwzfS8sICcnKTtcbiAgLy93aW5kb3dzIG5ld2xpbmVzXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoL1xcci9nLCAnJyk7XG4gIC8vaG9yaXpvbnRhbCBydWxlXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLy0tezEsM30vLCAnJyk7XG4gIC8vc3BhY2VcbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvJm5ic3A7L2csICcgJyk7XG4gIC8va2lsbCBvZmYgaW50ZXJ3aWtpIGxpbmtzXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoL1xcW1xcWyhbYS16XVthLXpdfHNpbXBsZXx3YXJ8Y2VifG1pbik6LnsyLDYwfVxcXVxcXS9pLCAnJyk7XG4gIC8vIHRoZXNlICd7e159fScgdGhpbmdzIGFyZSBudXRzLCBhbmQgdXNlZCBhcyBzb21lIGlsaWNpdCBzcGFjaW5nIHRoaW5nLlxuICB3aWtpID0gd2lraS5yZXBsYWNlKC9cXHtcXHtcXF5cXH1cXH0vZywgJycpO1xuICAvL2V4cGFuZCBpbmxpbmUgdGVtcGxhdGVzIGxpa2Uge3tkYXRlfX1cbiAgd2lraSA9IHdvcmRUZW1wbGF0ZXMod2lraSwgcik7XG4gIC8vZ2l2ZSBpdCB0aGUgaW5nbG9yaW91cyBzZW5kLW9mZiBpdCBkZXNlcnZlcy4uXG4gIHdpa2kgPSBraWxsX3htbCh3aWtpLCByLCBvcHRpb25zKTtcbiAgLy8oe3t0ZW1wbGF0ZX19LHt7dGVtcGxhdGV9fSkgbGVhdmVzIGVtcHR5IHBhcmVudGhlc2VzXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoL1xcKCBcXCkvZywgJycpO1xuICByZXR1cm4gd2lraTtcbn1cbm1vZHVsZS5leHBvcnRzID0gcHJlUHJvY2Vzcztcbi8vIGNvbnNvbGUubG9nKHByZVByb2Nlc3MoXCJoaSBbW2FzOlBsYW5jdG9uXV0gdGhlcmVcIikpO1xuLy8gY29uc29sZS5sb2cocHJlUHJvY2VzcygnaGVsbG8gPGJyLz4gd29ybGQnKSlcbi8vIGNvbnNvbGUubG9nKHByZVByb2Nlc3MoXCJoZWxsbyA8YXNkIGY+IHdvcmxkIDwvaDI+XCIpKVxuIiwiY29uc3QgcGFyc2VDaXRhdGlvbiA9IHJlcXVpcmUoJy4uL2luZm9ib3gvY2l0YXRpb24nKTtcbmNvbnN0IHBhcnNlTGluZSA9IHJlcXVpcmUoJy4uL3NlY3Rpb24vc2VudGVuY2UnKS5wYXJzZUxpbmU7XG4vL29rYXksIGkga25vdyB5b3UncmUgbm90IHN1cHBvc2VkIHRvIHJlZ2V4IGh0bWwsIGJ1dC4uLlxuLy9odHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9IZWxwOkhUTUxfaW5fd2lraXRleHRcblxuY29uc3QgaGFzQ2l0YXRpb24gPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIC9eICo/XFx7XFx7ICo/KGNpdGV8Y2l0YXRpb24pL2kudGVzdChzdHIpICYmIC9cXH1cXH0gKj8kLy50ZXN0KHN0cikgJiYgL2NpdGF0aW9uIG5lZWRlZC9pLnRlc3Qoc3RyKSA9PT0gZmFsc2U7XG59O1xuLy9oYW5kbGUgdW5zdHJ1Y3R1cmVkIG9uZXMgLSA8cmVmPnNvbWUgdGV4dDwvcmVmPlxuY29uc3QgcGFyc2VJbmxpbmUgPSBmdW5jdGlvbihzdHIsIHIsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMuY2l0YXRpb25zID09PSBmYWxzZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgb2JqID0gcGFyc2VMaW5lKHN0cikgfHwge307XG4gIGxldCBjaXRlID0ge1xuICAgIGNpdGU6ICdpbmxpbmUnLFxuICAgIHRleHQ6IG9iai50ZXh0XG4gIH07XG4gIGlmIChvYmoubGlua3MgJiYgb2JqLmxpbmtzLmxlbmd0aCkge1xuICAgIGxldCBleHRlcm4gPSBvYmoubGlua3MuZmluZChmID0+IGYuc2l0ZSk7XG4gICAgaWYgKGV4dGVybikge1xuICAgICAgY2l0ZS51cmwgPSBleHRlcm4uc2l0ZTtcbiAgICB9XG4gIH1cbiAgci5jaXRhdGlvbnMucHVzaChjaXRlKTtcbn07XG5cbmNvbnN0IGtpbGxfeG1sID0gZnVuY3Rpb24od2lraSwgciwgb3B0aW9ucykge1xuICAvL2x1Y2tpbHksIHJlZnMgY2FuJ3QgYmUgcmVjdXJzaXZlLi5cbiAgLy8gPHJlZj48L3JlZj5cbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvID88cmVmPihbXFxzXFxTXXswLDc1MH0/KTxcXC9yZWY+ID8vZ2ksIGZ1bmN0aW9uKGEsIHRtcGwpIHtcbiAgICBpZiAoaGFzQ2l0YXRpb24odG1wbCkpIHtcbiAgICAgIHdpa2kgPSBwYXJzZUNpdGF0aW9uKHRtcGwsIHdpa2ksIHIsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJzZUlubGluZSh0bXBsLCByLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJztcbiAgfSk7XG4gIC8vIDxyZWYgbmFtZT1cIlwiLz5cbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvID88cmVmIFtePl17MCwyMDB9P1xcLz4gPy9naSwgJyAnKTtcbiAgLy8gPHJlZiBuYW1lPVwiXCI+PC9yZWY+XG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLyA/PHJlZiBbXj5dezAsMjAwfT8+KFtcXHNcXFNdezAsMTAwMH0/KTxcXC9yZWY+ID8vZ2ksIGZ1bmN0aW9uKGEsIHRtcGwpIHtcbiAgICBpZiAoaGFzQ2l0YXRpb24odG1wbCkpIHtcbiAgICAgIHdpa2kgPSBwYXJzZUNpdGF0aW9uKHRtcGwsIHdpa2ksIHIsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJzZUlubGluZSh0bXBsLCByLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJztcbiAgfSk7XG4gIC8vb3RoZXIgdHlwZXMgb2YgeG1sIHRoYXQgd2Ugd2FudCB0byB0cmFzaCBjb21wbGV0ZWx5XG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLzwgPyh0YWJsZXxjb2RlfHNjb3JlfGRhdGF8Y2F0ZWdvcnl0cmVlfGNoYXJpbnNlcnR8Z2FsbGVyeXxoaWVyb3xpbWFnZW1hcHxpbnB1dGJveHxtYXRofG5vd2lraXxwb2VtfHJlZmVyZW5jZXN8c291cmNlfHN5bnRheGhpZ2hsaWdodHx0aW1lbGluZSkgP1tePl17MCwyMDB9Pz5bXFxzXFxTXXswLDcwMH08ID9cXC8gPyh0YWJsZXxjb2RlfHNjb3JlfGRhdGF8Y2F0ZWdvcnl0cmVlfGNoYXJpbnNlcnR8Z2FsbGVyeXxoaWVyb3xpbWFnZW1hcHxpbnB1dGJveHxtYXRofG5vd2lraXxwb2VtfHJlZmVyZW5jZXN8c291cmNlfHN5bnRheGhpZ2hsaWdodHx0aW1lbGluZSkgPz4vZ2ksICcgJyk7IC8vIDx0YWJsZSBuYW1lPVwiXCI+PHRyPmhpPC90cj48L3RhYmxlPlxuICAvL3NvbWUgeG1sLWxpa2UgZnJhZ21lbnRzIHdlIGNhbiBhbHNvIGtpbGxcbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvID88ID8ocmVmfHNwYW58ZGl2fHRhYmxlfGRhdGEpIFthLXowLTk9XCIgXXsyLDIwfVxcLyA/PiA/L2csICcgJyk7IC8vPHJlZiBuYW1lPVwiYXNkXCIvPlxuICAvL3NvbWUgZm9ybWF0dGluZyB4bWwsIHdlJ2xsIGtlZXAgdGhlaXIgaW5zaWRlcyB0aG91Z2hcbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvID88WyBcXC9dPyhwfHN1YnxzdXB8c3Bhbnxub3dpa2l8ZGl2fHRhYmxlfGJyfHRyfHRkfHRofHByZXxwcmUyfGhyKVsgXFwvXT8+ID8vZywgJyAnKTsgLy88c3ViPiwgPC9zdWI+XG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLyA/PFsgXFwvXT8oYWJicnxiZGl8YmRvfGJsb2NrcXVvdGV8Y2l0ZXxkZWx8ZGZufGVtfGl8aW5zfGtiZHxtYXJrfHF8cylbIFxcL10/PiA/L2csICcgJyk7IC8vPGFiYnI+LCA8L2FiYnI+XG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLyA/PFsgXFwvXT9oWzAtOV1bIFxcL10/PiA/L2csICcgJyk7IC8vPGgyPiwgPC9oMj5cbiAgLy9hIG1vcmUgZ2VuZXJpYyArIGRhbmdlcm91cyB4bWwtdGFnIHJlbW92YWxcbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvID88WyBcXC9dP1thLXowLTldezEsOH1bIFxcL10/PiA/L2csICcgJyk7IC8vPHNhbXA+XG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLyA/PCA/YnIgP1xcLz4gPy9nLCAnICcpOyAvLzxiciAvPlxuICByZXR1cm4gd2lraS50cmltKCk7XG59O1xuLy8gY29uc29sZS5sb2coa2lsbF94bWwoXCJoZWxsbyA8cmVmPm5vbm8hPC9yZWY+IHdvcmxkMS4gaGVsbG8gPHJlZiBuYW1lPSdodWxsbyc+bm9ubyE8L3JlZj4gd29ybGQyLiBoZWxsbyA8cmVmIG5hbWU9J2h1bGxvJy8+d29ybGQzLiAgaGVsbG8gPHRhYmxlIG5hbWU9Jyc+PHRyPjx0ZD5oaTxyZWY+bm9ubyE8L3JlZj48L3RkPjwvdHI+PC90YWJsZT53b3JsZDQuIGhlbGxvPHJlZiBuYW1lPScnLz4gd29ybGQ1IDxyZWYgbmFtZT0nJz5ub25vPC9yZWY+LCBtYW4ufX1cIikpXG4vLyBjb25zb2xlLmxvZyhraWxsX3htbChcImhlbGxvIDx0YWJsZSBuYW1lPScnPjx0cj48dGQ+aGk8cmVmPm5vbm8hPC9yZWY+PC90ZD48L3RyPjwvdGFibGU+d29ybGQ0XCIpKVxuLy8gY29uc29sZS5sb2coa2lsbF94bWwoJ2hlbGxvPHJlZiBuYW1lPVwidGhlcm95YWxcIi8+IHdvcmxkIDxyZWY+bm9ubzwvcmVmPiwgbWFufX0nKSlcbi8vIGNvbnNvbGUubG9nKGtpbGxfeG1sKFwiaGVsbG88cmVmIG5hbWU9XFxcInRoZXJveWFsXFxcIi8+IHdvcmxkNSwgPHJlZiBuYW1lPVxcXCJcXFwiPm5vbm88L3JlZj4gbWFuXCIpKTtcbi8vIGNvbnNvbGUubG9nKGtpbGxfeG1sKFwiaGVsbG8gPGFzZCBmPiB3b3JsZCA8L2gyPlwiKSlcbi8vIGNvbnNvbGUubG9nKGtpbGxfeG1sKFwiTm9ydGggQW1lcmljYSw8cmVmIG5hbWU9XFxcImZod2FcXFwiPiBhbmQgb25lIG9mXCIpKVxuLy8gY29uc29sZS5sb2coa2lsbF94bWwoXCJOb3J0aCBBbWVyaWNhLDxiciAvPiBhbmQgb25lIG9mXCIpKVxubW9kdWxlLmV4cG9ydHMgPSBraWxsX3htbDtcbiIsImNvbnN0IGxhbmd1YWdlcyA9IHJlcXVpcmUoJy4uLy4uL2RhdGEvbGFuZ3VhZ2VzJyk7XG5jb25zdCBwYXJzZUNvb3JkID0gcmVxdWlyZSgnLi9jb29yZGluYXRlcycpO1xuXG5jb25zdCBtb250aHMgPSBbXG4gICdKYW51YXJ5JyxcbiAgJ0ZlYnJ1YXJ5JyxcbiAgJ01hcmNoJyxcbiAgJ0FwcmlsJyxcbiAgJ01heScsXG4gICdKdW5lJyxcbiAgJ0p1bHknLFxuICAnQXVndXN0JyxcbiAgJ1NlcHRlbWJlcicsXG4gICdPY3RvYmVyJyxcbiAgJ05vdmVtYmVyJyxcbiAgJ0RlY2VtYmVyJ1xuXTtcbmNvbnN0IGRheXMgPSBbJ1N1bmRheScsICdNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5J107XG4vL3RoZXNlIGFyZSBlYXN5LCBpbmxpbmUgdGVtcGxhdGVzIHdlIGNhbiBkbyB3aXRob3V0IHRvby1tdWNoIHRyb3VibGUuXG5jb25zdCBpbmxpbmUgPSAvXFx7XFx7KHVybHxjb252ZXJ0fGN1cnJlbnR8bG9jYWx8bGN8dWN8Zm9ybWF0bnVtfHB1bGx8Y3F1b3RlfGNvb3JkfHNtYWxsfHNtYWxsZXJ8bWlkc2l6ZXxsYXJnZXJ8YmlnfGJpZ2dlcnxsYXJnZXxodWdlfHJlc2l6ZXxkdHN8ZGF0ZXx0ZXJtfGlwYXxpbGx8c2Vuc2V8dHxldHlsfHNmbnJlZnxPbGRTdHlsZURhdGUpKC4qPylcXH1cXH0vZ2k7XG5cbi8vIHRlbXBsYXRlcyB0aGF0IG5lZWQgcGFyc2luZyBhbmQgcmVwbGFjaW5nIGZvciBpbmxpbmUgdGV4dFxuLy9odHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9DYXRlZ29yeTpNYWdpY193b3JkX3RlbXBsYXRlc1xuY29uc3Qgd29yZF90ZW1wbGF0ZXMgPSBmdW5jdGlvbih3aWtpLCByKSB7XG5cbiAgLy9ncmVlZHktcGFzcyBhdCBlYXNpZXIsIGlubGluZS10ZW1wbGF0ZXNcbiAgd2lraSA9IHdpa2kucmVwbGFjZShpbmxpbmUsIGZ1bmN0aW9uKHRtcGwpIHtcbiAgICAvL3dlIGNhbiBiZSBzbmVha3kgd2l0aCB0aGlzIHRlbXBsYXRlLCBhcyBpdCdzIG9mdGVuIGZvdW5kIGluc2lkZSBvdGhlciB0ZW1wbGF0ZXNcbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7VVJMXFx8KFteIF17NCwxMDB9PylcXH1cXH0vZ2ksICckMScpO1xuICAgIC8vdGhpcyBvbmUgbmVlZHMgdG8gYmUgaGFuZGxlZCBtYW51YWxseVxuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHtjb252ZXJ0XFx8KFswLTldKj8pXFx8KFteXFx8XSo/KVxcfVxcfS9naSwgJyQxICQyJyk7IC8vVE9ETzogc3VwcG9ydCBodHRwczovL2VuLnRtcGxwZWRpYS5vcmcvdG1wbC9UZW1wbGF0ZTpDb252ZXJ0I1Jhbmdlc19vZl92YWx1ZXNcbiAgICAvL2RhdGUtdGltZSB0ZW1wbGF0ZXNcbiAgICBsZXQgZCA9IG5ldyBEYXRlKCk7XG4gICAgdG1wbCA9IHRtcGwucmVwbGFjZSgvXlxce1xceyhDVVJSRU5UfExPQ0FMKURBWSgyKT9cXH1cXH0vZ2ksIGQuZ2V0RGF0ZSgpKTtcbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7KENVUlJFTlR8TE9DQUwpTU9OVEgoTkFNRXxBQkJSRVYpP1xcfVxcfS9naSwgbW9udGhzW2QuZ2V0TW9udGgoKV0pO1xuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHsoQ1VSUkVOVHxMT0NBTClZRUFSXFx9XFx9L2dpLCBkLmdldEZ1bGxZZWFyKCkpO1xuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHsoQ1VSUkVOVHxMT0NBTClEQVlOQU1FXFx9XFx9L2dpLCBkYXlzW2QuZ2V0RGF5KCldKTtcbiAgICAvL2Zvcm1hdHRpbmcgdGVtcGxhdGVzXG4gICAgdG1wbCA9IHRtcGwucmVwbGFjZSgvXlxce1xceyhsY3x1Y3xmb3JtYXRudW0pOiguKj8pXFx9XFx9L2dpLCAnJDInKTtcbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7cHVsbCBxdW90ZVxcfChbXFxzXFxTXSo/KShcXHxbXFxzXFxTXSo/KT9cXH1cXH0vZ2ksICckMScpO1xuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHtjcXVvdGVcXHwoW1xcc1xcU10qPykoXFx8W1xcc1xcU10qPyk/XFx9XFx9L2dpLCAnJDEnKTtcbiAgICAvL2ludGVybGFuZ3VhZ2UtbGlua1xuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHtpbGxcXHwoW158XSspLio/XFx9XFx9L2dpLCAnJDEnKTtcbiAgICAvL2Zvb3Rub3RlIHN5bnRheFxuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHtyZWZuXFx8KFtefF0rKS4qP1xcfVxcfS9naSwgJyQxJyk7XG4gICAgLy8ndGFnJyBlc2NhcGVkIHRoaW5nLlxuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHsjP3RhZ1xcfChbXnxdKykuKj9cXH1cXH0vZ2ksICcnKTtcbiAgICAvLyB0aGVzZSBhcmUgbnV0cyB7e09sZFN0eWxlRGF0ZX19XG4gICAgdG1wbCA9IHRtcGwucmVwbGFjZSgvXlxce1xce09sZFN0eWxlRGF0ZVxcfChbXnxdKykuKj9cXH1cXH0vZ2ksICcnKTtcbiAgICAvLydoYXJ2YXJkIHJlZmVyZW5jZXMnXG4gICAgLy97e2Nvb3JkfDQzfDQyfE58Nzl8MjR8V3xyZWdpb246Q0EtT058ZGlzcGxheT1pbmxpbmUsdGl0bGV9fVxuICAgIGxldCBjb29yZCA9IHRtcGwubWF0Y2goL15cXHtcXHtjb29yZFxcfCguKj8pXFx9XFx9L2kpO1xuICAgIGlmIChjb29yZCAhPT0gbnVsbCkge1xuICAgICAgci5jb29yZGluYXRlcy5wdXNoKHBhcnNlQ29vcmQoY29vcmRbMV0pKTtcbiAgICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoY29vcmRbMF0sICcnKTtcbiAgICB9XG4gICAgLy9mb250LXNpemVcbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7KHNtYWxsfHNtYWxsZXJ8bWlkc2l6ZXxsYXJnZXJ8YmlnfGJpZ2dlcnxsYXJnZXxodWdlfHJlc2l6ZSlcXHwoW1xcc1xcU10qPylcXH1cXH0vZ2ksICckMicpO1xuICAgIC8ve3tmb250fHNpemU9eCV8dGV4dH19XG5cbiAgICBpZiAodG1wbC5tYXRjaCgvXlxce1xce2R0c1xcfC8pKSB7XG4gICAgICBsZXQgZGF0ZSA9ICh0bXBsLm1hdGNoKC9eXFx7XFx7ZHRzXFx8KC4qPylbXFx9XFx8XS8pIHx8IFtdKVsxXSB8fCAnJztcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgIGlmIChkYXRlICYmIGRhdGUuZ2V0VGltZSgpKSB7XG4gICAgICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHtkdHNcXHwuKj9cXH1cXH0vZ2ksIGRhdGUudG9EYXRlU3RyaW5nKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG1wbCA9IHRtcGwucmVwbGFjZSgvXlxce1xce2R0c1xcfC4qP1xcfVxcfS9naSwgJyAnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRtcGwubWF0Y2goL15cXHtcXHtkYXRlXFx8Lio/XFx9XFx9LykpIHtcbiAgICAgIGxldCBkYXRlID0gdG1wbC5tYXRjaCgvXlxce1xce2RhdGVcXHwoLio/KVxcfCguKj8pXFx8KC4qPylcXH1cXH0vKSB8fCBbXSB8fCBbXTtcbiAgICAgIGxldCBkYXRlU3RyaW5nID0gZGF0ZVsxXSArICcgJyArIGRhdGVbMl0gKyAnICcgKyBkYXRlWzNdO1xuICAgICAgdG1wbCA9IHRtcGwucmVwbGFjZSgvXlxce1xce2RhdGVcXHwuKj9cXH1cXH0vZ2ksIGRhdGVTdHJpbmcpO1xuICAgIH1cbiAgICAvL2NvbW1vbiB0ZW1wbGF0ZXMgaW4gd2lrdGlvbmFyeVxuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHt0ZXJtXFx8KC4qPylcXHwuKj9cXH1cXH0vZ2ksICdcXCckMVxcJycpO1xuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHtJUEEoYy1lbik/XFx8KC4qPylcXHwoLio/KVxcfVxcfSw/L2dpLCAnJyk7XG4gICAgdG1wbCA9IHRtcGwucmVwbGFjZSgvXlxce1xce3NlbnNlXFx8KC4qPylcXHw/Lio/XFx9XFx9L2dpLCAnKCQxKScpO1xuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL3ZcXHtcXHt0XFwrP1xcfC4uLj9cXHwoLio/KShcXHwuKik/XFx9XFx9L2dpLCAnXFwnJDFcXCcnKTtcbiAgICAvL3JlcGxhY2UgbGFuZ3VhZ2VzIGluICdldHlsJyB0YWdzXG4gICAgaWYgKHRtcGwubWF0Y2goL15cXHtcXHtldHlsXFx8LykpIHtcbiAgICAgIC8vZG9lc24ndCBzdXBwb3J0IG11bHRpcGxlLW9uZXMgcGVyIHNlbnRlbmNlLi5cbiAgICAgIHZhciBsYW5nID0gKHRtcGwubWF0Y2goL15cXHtcXHtldHlsXFx8KC4qPylcXHwuKj9cXH1cXH0vaSkgfHwgW10pWzFdIHx8ICcnO1xuICAgICAgbGFuZyA9IGxhbmcudG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmIChsYW5nICYmIGxhbmd1YWdlc1tsYW5nXSkge1xuICAgICAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7ZXR5bFxcfCguKj8pXFx8Lio/XFx9XFx9L2dpLCBsYW5ndWFnZXNbbGFuZ10uZW5nbGlzaF90aXRsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7ZXR5bFxcfCguKj8pXFx8Lio/XFx9XFx9L2dpLCAnKCQxKScpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG1wbDtcbiAgfSk7XG4gIC8vZmxhdGxpc3QgLT4gY29tbWFzICAtLSBobGlzdD9cbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvXFx7XFx7KGZsYXRsaXN0fGhsaXN0KSA/XFx8KFtefV0rKVxcfVxcfS9naSwgZnVuY3Rpb24oYSwgYiwgYykge1xuICAgIGxldCBhcnIgPSBjLnNwbGl0KC9cXHMrWyogXSs/ID8vZyk7XG4gICAgYXJyID0gYXJyLmZpbHRlcihsaW5lID0+IGxpbmUpO1xuICAgIHJldHVybiBhcnIuam9pbignLCAnKTtcbiAgfSk7XG4gIC8vcGxhaW5saXN0IC0+IG5ld2xpbmVzXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoL1xce1xceyhwbGFpbmxpc3R8dWJsaXN0fHVuYnVsbGV0ZWQgbGlzdCkgP1xcfChbXn1dKylcXH1cXH0vZ2ksIGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAgICBsZXQgYXJyID0gYy5zcGxpdCgvXFxzK1sqIF0rPyA/L2cpO1xuICAgIGFyciA9IGFyci5maWx0ZXIobGluZSA9PiBsaW5lKTtcbiAgICByZXR1cm4gYXJyLmpvaW4oJywgJyk7XG4gIH0pO1xuICAvLyB0bXBsID0gdG1wbC5yZXBsYWNlKC9cXHtcXHtmbGF0bGlzdFxcfChbXFxzXFxTXSo/KShcXHxbXFxzXFxTXSo/KT9cXH1cXH0vZ2ksICckMScpO1xuICByZXR1cm4gd2lraTtcbn07XG4vLyBjb25zb2xlLmxvZyh3b3JkX3RlbXBsYXRlcyhcImhlbGxvIHt7Q1VSUkVOVERBWX19IHdvcmxkXCIpKVxuLy8gY29uc29sZS5sb2cod29yZF90ZW1wbGF0ZXMoXCJoZWxsbyB7e0NVUlJFTlRNT05USH19IHdvcmxkXCIpKVxuLy8gY29uc29sZS5sb2cod29yZF90ZW1wbGF0ZXMoXCJoZWxsbyB7e0NVUlJFTlRZRUFSfX0gd29ybGRcIikpXG4vLyBjb25zb2xlLmxvZyh3b3JkX3RlbXBsYXRlcyhcImhlbGxvIHt7TE9DQUxEQVlOQU1FfX0gd29ybGRcIikpXG4vLyBjb25zb2xlLmxvZyh3b3JkX3RlbXBsYXRlcyhcImhlbGxvIHt7bGM6ODh9fSB3b3JsZFwiKSlcbi8vIGNvbnNvbGUubG9nKHdvcmRfdGVtcGxhdGVzKFwiaGVsbG8ge3twdWxsIHF1b3RlfExpZmUgaXMgbGlrZVxcbnxhdXRob3I9W1thc2RmXV19fSB3b3JsZFwiKSlcbi8vIGNvbnNvbGUubG9nKHdvcmRfdGVtcGxhdGVzKFwiaGkge3tldHlsfGxhfC19fSB0aGVyZVwiKSlcbi8vIGNvbnNvbGUubG9nKHdvcmRfdGVtcGxhdGVzKFwie3tldHlsfGxhfC19fSBjb2duYXRlIHdpdGgge3tldHlsfGlzfC19fSB7e3Rlcm18aHVnZ2F8fHRvIGNvbWZvcnR8bGFuZz1pc319LFwiKSlcblxubW9kdWxlLmV4cG9ydHMgPSB3b3JkX3RlbXBsYXRlcztcbiIsImNvbnN0IGZucyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9oZWxwZXJzJyk7XG5jb25zdCBoZWFkaW5nX3JlZyA9IC9eKD17MSw1fSkoW149XXsxLDIwMH0/KT17MSw1fSQvO1xuXG4vL2ludGVycHJldCBkZXB0aCwgdGl0bGUgb2YgaGVhZGluZ3MgbGlrZSAnPT1TZWUgYWxzbz09J1xuY29uc3QgcGFyc2VIZWFkaW5nID0gZnVuY3Rpb24ociwgc3RyKSB7XG4gIGxldCBoZWFkaW5nID0gc3RyLm1hdGNoKGhlYWRpbmdfcmVnKTtcbiAgaWYgKCFoZWFkaW5nKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpdGxlOiAnJyxcbiAgICAgIGRlcHRoOiAwXG4gICAgfTtcbiAgfVxuICBsZXQgdGl0bGUgPSBoZWFkaW5nWzJdIHx8ICcnO1xuICB0aXRsZSA9IGZucy50cmltX3doaXRlc3BhY2UodGl0bGUpO1xuICBsZXQgZGVwdGggPSAxO1xuICBpZiAoaGVhZGluZ1sxXSkge1xuICAgIGRlcHRoID0gaGVhZGluZ1sxXS5sZW5ndGggLSAxO1xuICB9XG4gIHIudGl0bGUgPSB0aXRsZTtcbiAgci5kZXB0aCA9IGRlcHRoO1xuICByZXR1cm4gcjtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlSGVhZGluZztcbiIsImNvbnN0IEhhc2hlcyA9IHJlcXVpcmUoJ2pzaGFzaGVzJyk7XG5jb25zdCBpMThuID0gcmVxdWlyZSgnLi4vLi4vLi4vZGF0YS9pMThuJyk7XG5jb25zdCBmaWxlX3JlZyA9IG5ldyBSZWdFeHAoJygnICsgaTE4bi5pbWFnZXMuY29uY2F0KGkxOG4uZmlsZXMpLmpvaW4oJ3wnKSArICcpOi4qP1tcXFxcfFxcXFxdXScsICdpJyk7XG5cbi8vdGhlIHdpa2ltZWRpYSBpbWFnZSB1cmwgaXMgYSBsaXR0bGUgc2lsbHk6XG4vL2h0dHBzOi8vY29tbW9ucy53aWtpbWVkaWEub3JnL3dpa2kvQ29tbW9uczpGQVEjV2hhdF9hcmVfdGhlX3N0cmFuZ2VseV9uYW1lZF9jb21wb25lbnRzX2luX2ZpbGVfcGF0aHMuM0ZcbmNvbnN0IG1ha2VfaW1hZ2UgPSBmdW5jdGlvbihmaWxlKSB7XG4gIGxldCB0aXRsZSA9IGZpbGUucmVwbGFjZSgvXihpbWFnZXxmaWxlPylcXDovaSwgJycpO1xuICAvL3RpdGxlY2FzZSBpdFxuICB0aXRsZSA9IHRpdGxlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGl0bGUuc3Vic3RyaW5nKDEpO1xuICAvL3NwYWNlcyB0byB1bmRlcnNjb3Jlc1xuICB0aXRsZSA9IHRpdGxlLnJlcGxhY2UoLyAvZywgJ18nKTtcblxuICBsZXQgaGFzaCA9IG5ldyBIYXNoZXMuTUQ1KCkuaGV4KHRpdGxlKTtcbiAgbGV0IHBhdGggPSBoYXNoLnN1YnN0cigwLCAxKSArICcvJyArIGhhc2guc3Vic3RyKDAsIDIpICsgJy8nO1xuICB0aXRsZSA9IGVuY29kZVVSSUNvbXBvbmVudCh0aXRsZSk7XG4gIHBhdGggKz0gdGl0bGU7XG4gIGxldCBzZXJ2ZXIgPSAnaHR0cHM6Ly91cGxvYWQud2lraW1lZGlhLm9yZy93aWtpcGVkaWEvY29tbW9ucy8nO1xuICBsZXQgdGh1bWIgPSAnLzMwMHB4LScgKyB0aXRsZTtcbiAgcmV0dXJuIHtcbiAgICB1cmw6IHNlcnZlciArIHBhdGgsXG4gICAgZmlsZTogZmlsZSxcbiAgICB0aHVtYjogc2VydmVyICsgJ3RodW1iLycgKyBwYXRoICsgdGh1bWJcbiAgfTtcbn07XG5cbi8vaW1hZ2VzIGFyZSB1c3VhbGx5IFtbaW1hZ2U6bXlfcGljLmpwZ11dXG5jb25zdCBwYXJzZV9pbWFnZSA9IGZ1bmN0aW9uKGltZykge1xuICBpbWcgPSBpbWcubWF0Y2goZmlsZV9yZWcpIHx8IFsnJ107XG4gIGltZyA9IGltZ1swXS5yZXBsYWNlKC9bXFx8XFxdXSQvLCAnJyk7XG4gIC8vYWRkIHVybCwgZXRjIHRvIGltYWdlXG4gIGltZyA9IG1ha2VfaW1hZ2UoaW1nKTtcbiAgcmV0dXJuIGltZztcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlX2ltYWdlO1xuXG4vLyBjb25zb2xlLmxvZyhwYXJzZV9pbWFnZShcIltbaW1hZ2U6bXlfcGljLmpwZ11dXCIpKTtcbiIsImNvbnN0IGkxOG4gPSByZXF1aXJlKCcuLi8uLi8uLi9kYXRhL2kxOG4nKTtcbmNvbnN0IGZpbmRfcmVjdXJzaXZlID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliL3JlY3Vyc2l2ZV9tYXRjaCcpO1xuY29uc3QgcGFyc2VfaW1hZ2UgPSByZXF1aXJlKCcuL2ltYWdlJyk7XG5jb25zdCBmaWxlUmVnZXggPSBuZXcgUmVnRXhwKCcoJyArIGkxOG4uaW1hZ2VzLmNvbmNhdChpMThuLmZpbGVzKS5qb2luKCd8JykgKyAnKTouKj9bXFxcXHxcXFxcXV0nLCAnaScpO1xuXG5jb25zdCBwYXJzZUltYWdlcyA9IGZ1bmN0aW9uKHIsIHdpa2ksIG9wdGlvbnMpIHtcbiAgLy9zZWNvbmQsIHJlbW92ZSBbW2ZpbGU6Li4uW1tdXSBdXSByZWN1cnNpb25zXG4gIGxldCBtYXRjaGVzID0gZmluZF9yZWN1cnNpdmUoJ1snLCAnXScsIHdpa2kpO1xuICBtYXRjaGVzLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgIGlmIChzLm1hdGNoKGZpbGVSZWdleCkpIHtcbiAgICAgIHIuaW1hZ2VzID0gci5pbWFnZXMgfHwgW107XG4gICAgICBpZiAob3B0aW9ucy5pbWFnZXMgIT09IGZhbHNlKSB7XG4gICAgICAgIHIuaW1hZ2VzLnB1c2gocGFyc2VfaW1hZ2UocykpO1xuICAgICAgfVxuICAgICAgd2lraSA9IHdpa2kucmVwbGFjZShzLCAnJyk7XG4gICAgfVxuICB9KTtcblxuICAvL3RoaXJkLCB3aWt0aW9uYXJ5LXN0eWxlIGludGVybGFuZ3VhZ2UgbGlua3NcbiAgbWF0Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICBpZiAocy5tYXRjaCgvXFxbXFxbKFthLXpdKyk6KC4qPylcXF1cXF0vaSkgIT09IG51bGwpIHtcbiAgICAgIGxldCBzaXRlID0gKHMubWF0Y2goL1xcW1xcWyhbYS16XSspOi9pKSB8fCBbXSlbMV0gfHwgJyc7XG4gICAgICBzaXRlID0gc2l0ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgaWYgKHNpdGUgJiYgaTE4bi5kaWN0aW9uYXJ5W3NpdGVdID09PSB1bmRlZmluZWQgJiYgIShvcHRpb25zLm5hbWVzcGFjZSAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMubmFtZXNwYWNlID09PSBzaXRlKSkge1xuICAgICAgICByLmludGVyd2lraSA9IHIuaW50ZXJ3aWtpIHx8IHt9O1xuICAgICAgICByLmludGVyd2lraVtzaXRlXSA9IChzLm1hdGNoKC9cXFtcXFsoW2Etel0rKTooLio/KVxcXVxcXS9pKSB8fCBbXSlbMl07XG4gICAgICAgIHdpa2kgPSB3aWtpLnJlcGxhY2UocywgJycpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiB3aWtpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gcGFyc2VJbWFnZXM7XG4iLCIvL2ludGVycHJldCA9PWhlYWRpbmc9PSBsaW5lc1xuY29uc3QgcGFyc2UgPSB7XG4gIGhlYWRpbmc6IHJlcXVpcmUoJy4vaGVhZGluZycpLFxuICBsaXN0OiByZXF1aXJlKCcuL2xpc3QnKSxcbiAgaW1hZ2U6IHJlcXVpcmUoJy4vaW1hZ2UnKSxcbiAgdGFibGU6IHJlcXVpcmUoJy4vdGFibGUnKSxcbiAgdGVtcGxhdGVzOiByZXF1aXJlKCcuL3NlY3Rpb25fdGVtcGxhdGVzJyksXG4gIGVhY2hTZW50ZW5jZTogcmVxdWlyZSgnLi9zZW50ZW5jZScpLmVhY2hTZW50ZW5jZVxufTtcbmNvbnN0IHNlY3Rpb25fcmVnID0gL1tcXG5eXSg9ezEsNX1bXj1dezEsMjAwfT89ezEsNX0pL2c7XG5cbmNvbnN0IHBhcnNlU2VjdGlvbiA9IGZ1bmN0aW9uKHNlY3Rpb24sIHdpa2ksIHIsIG9wdGlvbnMpIHtcbiAgLy8gLy9wYXJzZSB0aGUgdGFibGVzXG4gIHdpa2kgPSBwYXJzZS50YWJsZShzZWN0aW9uLCB3aWtpKTtcbiAgLy8gLy9wYXJzZSB0aGUgbGlzdHNcbiAgd2lraSA9IHBhcnNlLmxpc3Qoc2VjdGlvbiwgd2lraSk7XG4gIC8vc3Vwb3BydGVkIHRoaW5ncyBsaWtlIHt7bWFpbn19XG4gIHdpa2kgPSBwYXJzZS50ZW1wbGF0ZXMoc2VjdGlvbiwgd2lraSk7XG4gIC8vIC8vcGFyc2UrcmVtb3ZlIHNjYXJ5ICdbWyBbW11dIF1dJyBzdHVmZlxuICB3aWtpID0gcGFyc2UuaW1hZ2Uoc2VjdGlvbiwgd2lraSwgb3B0aW9ucyk7XG4gIC8vZG8gZWFjaCBzZW50ZW5jZVxuICB3aWtpID0gcGFyc2UuZWFjaFNlbnRlbmNlKHNlY3Rpb24sIHdpa2kpO1xuICAvLyBzZWN0aW9uLndpa2kgPSB3aWtpO1xuICByZXR1cm4gc2VjdGlvbjtcbn07XG5cbmNvbnN0IG1ha2VTZWN0aW9ucyA9IGZ1bmN0aW9uKHIsIHdpa2ksIG9wdGlvbnMpIHtcbiAgbGV0IHNwbGl0ID0gd2lraS5zcGxpdChzZWN0aW9uX3JlZyk7IC8vLmZpbHRlcihzID0+IHMpO1xuICBsZXQgc2VjdGlvbnMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdC5sZW5ndGg7IGkgKz0gMikge1xuICAgIGxldCB0aXRsZSA9IHNwbGl0W2kgLSAxXSB8fCAnJztcbiAgICBsZXQgdHh0ID0gc3BsaXRbaV0gfHwgJyc7XG4gICAgbGV0IHNlY3Rpb24gPSB7XG4gICAgICB0aXRsZTogJycsXG4gICAgICBkZXB0aDogbnVsbFxuICAgIH07XG4gICAgc2VjdGlvbiA9IHBhcnNlLmhlYWRpbmcoc2VjdGlvbiwgdGl0bGUpO1xuICAgIHNlY3Rpb24gPSBwYXJzZVNlY3Rpb24oc2VjdGlvbiwgdHh0LCByLCBvcHRpb25zKTtcbiAgICBzZWN0aW9ucy5wdXNoKHNlY3Rpb24pO1xuICB9XG4gIHJldHVybiBzZWN0aW9ucztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWFrZVNlY3Rpb25zO1xuIiwiY29uc3QgbGlzdF9yZWcgPSAvXlsjXFwqOjtcXHxdKy87XG5jb25zdCBidWxsZXRfcmVnID0gL15cXCorW146LFxcfF17NH0vO1xuY29uc3QgbnVtYmVyX3JlZyA9IC9eID9cXCNbXjosXFx8XXs0fS87XG5jb25zdCBoYXNfd29yZCA9IC9bYS16XS9pO1xuY29uc3QgcGFyc2VMaW5lID0gcmVxdWlyZSgnLi9zZW50ZW5jZS8nKS5wYXJzZUxpbmU7XG5cbi8vIGRvZXMgaXQgc3RhcnQgd2l0aCBhIGJ1bGxldCBwb2ludCBvciBzb21ldGhpbmc/XG5jb25zdCBpc0xpc3QgPSBmdW5jdGlvbihsaW5lKSB7XG4gIHJldHVybiBsaXN0X3JlZy50ZXN0KGxpbmUpIHx8IGJ1bGxldF9yZWcudGVzdChsaW5lKSB8fCBudW1iZXJfcmVnLnRlc3QobGluZSk7XG59O1xuXG4vL21ha2UgYnVsbGV0cy9udW1iZXJzIGludG8gaHVtYW4tcmVhZGFibGUgKidzXG5jb25zdCBjbGVhbkxpc3QgPSBmdW5jdGlvbihsaXN0KSB7XG4gIGxldCBudW1iZXIgPSAxO1xuICBsaXN0ID0gbGlzdC5maWx0ZXIobCA9PiBsKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGxpbmUgPSBsaXN0W2ldO1xuICAgIC8vYWRkICMgbnVtYmVyaW5ncyBmb3JtYXR0aW5nXG4gICAgaWYgKGxpbmUubWF0Y2gobnVtYmVyX3JlZykpIHtcbiAgICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoL14gPyMqLywgbnVtYmVyICsgJykgJyk7XG4gICAgICBsaW5lID0gbGluZSArICdcXG4nO1xuICAgICAgbnVtYmVyICs9IDE7XG4gICAgfSBlbHNlIGlmIChsaW5lLm1hdGNoKGxpc3RfcmVnKSkge1xuICAgICAgbnVtYmVyID0gMTtcbiAgICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UobGlzdF9yZWcsICcnKTtcbiAgICB9XG4gICAgbGlzdFtpXSA9IHBhcnNlTGluZShsaW5lKTtcbiAgfVxuICByZXR1cm4gbGlzdDtcbn07XG5cbmNvbnN0IGdyYWJMaXN0ID0gZnVuY3Rpb24obGluZXMsIGkpIHtcbiAgbGV0IHN1YiA9IFtdO1xuICBmb3IgKGxldCBvID0gaTsgbyA8IGxpbmVzLmxlbmd0aDsgbysrKSB7XG4gICAgaWYgKGlzTGlzdChsaW5lc1tvXSkpIHtcbiAgICAgIHN1Yi5wdXNoKGxpbmVzW29dKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHN1YiA9IHN1Yi5maWx0ZXIoYSA9PiBhICYmIGhhc193b3JkLnRlc3QoYSkpO1xuICBzdWIgPSBjbGVhbkxpc3Qoc3ViKTtcbiAgcmV0dXJuIHN1Yjtcbn07XG5cbmNvbnN0IHBhcnNlTGlzdCA9IGZ1bmN0aW9uKHIsIHdpa2kpIHtcbiAgbGV0IGxpbmVzID0gd2lraS5zcGxpdCgvXFxuL2cpO1xuICBsaW5lcyA9IGxpbmVzLmZpbHRlcihsID0+IGhhc193b3JkLnRlc3QobCkpO1xuICBsZXQgbGlzdHMgPSBbXTtcbiAgbGV0IHRoZVJlc3QgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpc0xpc3QobGluZXNbaV0pICYmIGxpbmVzW2kgKyAxXSAmJiBpc0xpc3QobGluZXNbaSArIDFdKSkge1xuICAgICAgbGV0IHN1YiA9IGdyYWJMaXN0KGxpbmVzLCBpKTtcbiAgICAgIGlmIChzdWIubGVuZ3RoID4gMCkge1xuICAgICAgICBsaXN0cy5wdXNoKHN1Yik7XG4gICAgICAgIGkgKz0gc3ViLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhlUmVzdC5wdXNoKGxpbmVzW2ldKTtcbiAgICB9XG4gIH1cbiAgaWYgKGxpc3RzLmxlbmd0aCA+IDApIHtcbiAgICByLmxpc3RzID0gbGlzdHM7XG4gIH1cbiAgcmV0dXJuIHRoZVJlc3Quam9pbignXFxuJyk7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBwYXJzZUxpc3Q7XG4iLCIvLyBjb25zdCBwYXJzZUNvb3JkID0gcmVxdWlyZSgnLi9jb29yZGluYXRlcycpO1xuY29uc3QgcmVncyA9IHtcbiAgbWFpbjogL1xce1xce21haW4oIGFydGljbGUpP1xcfCguKj8pXFx9XFx9L2ksXG4gIHdpZGVfaW1hZ2U6IC9cXHtcXHt3aWRlIGltYWdlXFx8KC4qPylcXH1cXH0vaVxufTtcblxuLy90aGVzZSB0ZW1wbGF0ZXMgYXBwbHkgb25seSB0byB0aGlzIHNlY3Rpb24sYW5kIHdlIHdvbnQgZmluZCB0aGVtLCBzYXksIGluc2lkZSBhIGluZm9ib3hcbmNvbnN0IHBhcnNlVGVtcGxhdGVzID0gZnVuY3Rpb24oc2VjdGlvbiwgd2lraSkge1xuICBsZXQgdGVtcGxhdGVzID0ge307XG5cbiAgLy97e21haW58dG9yb250b319XG4gIGxldCBtYWluID0gd2lraS5tYXRjaChyZWdzLm1haW4pO1xuICBpZiAobWFpbikge1xuICAgIHRlbXBsYXRlcy5tYWluID0gbWFpblsyXS5zcGxpdCgnfCcpO1xuICAgIHdpa2kgPSB3aWtpLnJlcGxhY2UocmVncy5tYWluLCAnJyk7XG4gIH1cbiAgLy97e3dpZGUgaW1hZ2V8ZmlsZTpjb29sLmpwZ319XG4gIGxldCB3aWRlID0gd2lraS5tYXRjaChyZWdzLndpZGVfaW1hZ2UpO1xuICBpZiAod2lkZSkge1xuICAgIHRlbXBsYXRlcy53aWRlX2ltYWdlID0gd2lkZVsxXS5zcGxpdCgnfCcpO1xuICAgIHdpa2kgPSB3aWtpLnJlcGxhY2UocmVncy53aWRlX2ltYWdlLCAnJyk7XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKHRlbXBsYXRlcykubGVuZ3RoID4gMCkge1xuICAgIHNlY3Rpb24udGVtcGxhdGVzID0gdGVtcGxhdGVzO1xuICB9XG4gIHJldHVybiB3aWtpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gcGFyc2VUZW1wbGF0ZXM7XG4iLCJcbi8vXG5jb25zdCBmb3JtYXR0aW5nID0gZnVuY3Rpb24ob2JqKSB7XG4gIGxldCBib2xkcyA9IFtdO1xuICBsZXQgaXRhbGljcyA9IFtdO1xuICBsZXQgd2lraSA9IG9iai50ZXh0IHx8ICcnO1xuICAvL2JvbGQgYW5kIGl0YWxpY3MgY29tYmluZWQgNSAnc1xuICB3aWtpID0gd2lraS5yZXBsYWNlKC8nJ3s0fShbXiddezAsMjAwfSknJ3s0fS9nLCAoYSwgYikgPT4ge1xuICAgIGJvbGRzLnB1c2goYik7XG4gICAgaXRhbGljcy5wdXNoKGIpO1xuICAgIHJldHVybiBiO1xuICB9KTtcbiAgLy8nJydib2xkJycnXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLycnezJ9KFteJ117MCwyMDB9KScnezJ9L2csIChhLCBiKSA9PiB7XG4gICAgYm9sZHMucHVzaChiKTtcbiAgICByZXR1cm4gYjtcbiAgfSk7XG4gIC8vJydpdGFsaWMnJ1xuICB3aWtpID0gd2lraS5yZXBsYWNlKC8nJyhbXiddezAsMjAwfSknJy9nLCAoYSwgYikgPT4ge1xuICAgIGl0YWxpY3MucHVzaChiKTtcbiAgICByZXR1cm4gYjtcbiAgfSk7XG5cbiAgLy9wYWNrIGl0IGFsbCB1cC4uXG4gIG9iai50ZXh0ID0gd2lraTtcbiAgaWYgKGJvbGRzLmxlbmd0aCA+IDApIHtcbiAgICBvYmouZm10ID0gb2JqLmZtdCB8fCB7fTtcbiAgICBvYmouZm10LmJvbGQgPSBib2xkcztcbiAgfVxuICBpZiAoaXRhbGljcy5sZW5ndGggPiAwKSB7XG4gICAgb2JqLmZtdCA9IG9iai5mbXQgfHwge307XG4gICAgb2JqLmZtdC5pdGFsaWMgPSBpdGFsaWNzO1xuICB9XG4gIHJldHVybiBvYmo7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBmb3JtYXR0aW5nO1xuIiwiY29uc3QgaGVscGVycyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYi9oZWxwZXJzJyk7XG5jb25zdCBwYXJzZUxpbmtzID0gcmVxdWlyZSgnLi9saW5rcycpO1xuY29uc3QgcGFyc2VGbXQgPSByZXF1aXJlKCcuL2Zvcm1hdHRpbmcnKTtcbmNvbnN0IHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzJyk7XG5jb25zdCBzZW50ZW5jZVBhcnNlciA9IHJlcXVpcmUoJy4vc2VudGVuY2UtcGFyc2VyJyk7XG5jb25zdCBpMThuID0gcmVxdWlyZSgnLi4vLi4vLi4vZGF0YS9pMThuJyk7XG5jb25zdCBjYXRfcmVnID0gbmV3IFJlZ0V4cCgnXFxcXFtcXFxcWzo/KCcgKyBpMThuLmNhdGVnb3JpZXMuam9pbignfCcpICsgJyk6W15cXFxcXVxcXFxdXXsyLDgwfVxcXFxdXFxcXF0nLCAnZ2knKTtcblxuLy9yZXR1cm4gb25seSByZW5kZXJlZCB0ZXh0IG9mIHdpa2kgbGlua3NcbmNvbnN0IHJlc29sdmVfbGlua3MgPSBmdW5jdGlvbihsaW5lKSB7XG4gIC8vIGNhdGVnb3JpZXMsIGltYWdlcywgZmlsZXNcbiAgbGluZSA9IGxpbmUucmVwbGFjZShjYXRfcmVnLCAnJyk7XG4gIC8vIFtbQ29tbW9uIGxpbmtzXV1cbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFxbXFxbOj8oW158XXsxLDgwfT8pXFxdXFxdKFxcd3swLDV9KS9nLCAnJDEkMicpO1xuICAvLyBbW0ZpbGU6d2l0aHxTaXplXV1cbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFxbXFxbRmlsZTo/KC57Miw4MH0/KVxcfChbXlxcXV0rPylcXF1cXF0oXFx3ezAsNX0pL2csICckMScpO1xuICAvLyBbW1JlcGxhY2VkfExpbmtzXV1cbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFxbXFxbOj8oLnsyLDgwfT8pXFx8KFteXFxdXSs/KVxcXVxcXShcXHd7MCw1fSkvZywgJyQyJDMnKTtcbiAgLy8gRXh0ZXJuYWwgbGlua3NcbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFxbKGh0dHBzP3xuZXdzfGZ0cHxtYWlsdG98Z29waGVyfGlyYyk6XFwvXFwvW15cXF1cXHwgXXs0LDE1MDB9KFtcXHwgXS4qPyk/XFxdL2csICckMicpO1xuICByZXR1cm4gbGluZTtcbn07XG4vLyBjb25zb2xlLmxvZyhyZXNvbHZlX2xpbmtzKFwiW2h0dHA6Ly93d3cud2hpc3RsZXIuY2Egd3d3LndoaXN0bGVyLmNhXVwiKSlcblxuZnVuY3Rpb24gcG9zdHByb2Nlc3MobGluZSkge1xuICAvL2ZpeCBsaW5rc1xuICBsaW5lID0gcmVzb2x2ZV9saW5rcyhsaW5lKTtcbiAgLy9vb3BzLCByZWN1cnNpdmUgaW1hZ2UgYnVnXG4gIGlmIChsaW5lLm1hdGNoKC9eKHRodW1ifHJpZ2h0fGxlZnQpXFx8L2kpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgbGluZSA9IGhlbHBlcnMudHJpbV93aGl0ZXNwYWNlKGxpbmUpO1xuICByZXR1cm4gbGluZTtcbn1cblxuZnVuY3Rpb24gcGFyc2VMaW5lKGxpbmUpIHtcbiAgbGV0IG9iaiA9IHtcbiAgICB0ZXh0OiBwb3N0cHJvY2VzcyhsaW5lKVxuICB9O1xuICAvL3B1bGwtb3V0IHRoZSBbW2xpbmtzXV1cbiAgbGV0IGxpbmtzID0gcGFyc2VMaW5rcyhsaW5lKTtcbiAgaWYgKGxpbmtzKSB7XG4gICAgb2JqLmxpbmtzID0gbGlua3M7XG4gIH1cbiAgLy9wdWxsLW91dCB0aGUgYm9sZHMgYW5kICcnaXRhbGljcycnXG4gIG9iaiA9IHBhcnNlRm10KG9iaik7XG4gIC8vcHVsbC1vdXQgdGhpbmdzIGxpa2Uge3tzdGFydCBkYXRlfC4uLn19XG4gIG9iaiA9IHRlbXBsYXRlcyhvYmopO1xuICByZXR1cm4gb2JqO1xufVxuXG5jb25zdCBwYXJzZVNlbnRlbmNlcyA9IGZ1bmN0aW9uKHIsIHdpa2kpIHtcbiAgbGV0IHNlbnRlbmNlcyA9IHNlbnRlbmNlUGFyc2VyKHdpa2kpO1xuICBzZW50ZW5jZXMgPSBzZW50ZW5jZXMubWFwKHBhcnNlTGluZSk7XG4gIHIuc2VudGVuY2VzID0gc2VudGVuY2VzO1xuICByZXR1cm4gcjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBlYWNoU2VudGVuY2U6IHBhcnNlU2VudGVuY2VzLFxuICBwYXJzZUxpbmU6IHBhcnNlTGluZVxufTtcbiIsImNvbnN0IGhlbHBlcnMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWIvaGVscGVycycpO1xuY29uc3QgaWdub3JlX2xpbmtzID0gL146PyhjYXRlZ29yeXxjYXTDqWdvcmllfEthdGVnb3JpZXxDYXRlZ29yw61hfENhdGVnb3JpYXxDYXRlZ29yaWV8S2F0ZWdvcmlhfNiq2LXZhtmK2YF8aW1hZ2V8ZmlsZXxpbWFnZXxmaWNoaWVyfGRhdGVpfG1lZGlhfHNwZWNpYWx8d3B8d2lraXBlZGlhfGhlbHB8dXNlcnxtZWRpYXdpa2l8cG9ydGFsfHRhbGt8dGVtcGxhdGV8Ym9va3xkcmFmdHxtb2R1bGV8dG9waWN8d2lrdGlvbmFyeXx3aWtpc291cmNlKTovaTtcbmNvbnN0IGV4dGVybmFsX2xpbmsgPSAvXFxbKGh0dHBzP3xuZXdzfGZ0cHxtYWlsdG98Z29waGVyfGlyYykoOlxcL1xcL1teXFxdXFx8IF17NCwxNTAwfSkoW1xcfCBdLio/KT9cXF0vZztcbmNvbnN0IGxpbmtfcmVnID0gL1xcW1xcWyguezAsODB9PylcXF1cXF0oW2EteiddKyk/KFxcd3swLDEwfSkvZ2k7IC8vYWxsb3cgZGFuZ2xpbmcgc3VmZml4ZXMgLSBcIltbZmxhbmRlcnNdXSdzXCJcblxuY29uc3QgZXh0ZXJuYWxfbGlua3MgPSBmdW5jdGlvbihsaW5rcywgc3RyKSB7XG4gIHN0ci5yZXBsYWNlKGV4dGVybmFsX2xpbmssIGZ1bmN0aW9uKGFsbCwgcHJvdG9jb2wsIGxpbmssIHRleHQpIHtcbiAgICB0ZXh0ID0gdGV4dCB8fCAnJztcbiAgICBsaW5rcy5wdXNoKHtcbiAgICAgIHR5cGU6ICdleHRlcm5hbCcsXG4gICAgICBzaXRlOiBwcm90b2NvbCArIGxpbmssXG4gICAgICB0ZXh0OiB0ZXh0LnRyaW0oKVxuICAgIH0pO1xuICAgIHJldHVybiB0ZXh0O1xuICB9KTtcbiAgcmV0dXJuIGxpbmtzO1xufTtcblxuY29uc3QgaW50ZXJuYWxfbGlua3MgPSBmdW5jdGlvbihsaW5rcywgc3RyKSB7XG4gIC8vcmVndWxhciBsaW5rc1xuICBzdHIucmVwbGFjZShsaW5rX3JlZywgZnVuY3Rpb24oXywgcywgYXBvc3Ryb3BoZSkge1xuICAgIHZhciB0eHQgPSAnJztcbiAgICB2YXIgbGluayA9IHM7XG4gICAgaWYgKHMubWF0Y2goL1xcfC8pKSB7XG4gICAgICAvL3JlcGxhY2VtZW50IGxpbmsgW1tsaW5rfHRleHRdXVxuICAgICAgcyA9IHMucmVwbGFjZSgvXFxbXFxbKC57Miw4MH0/KVxcXVxcXShcXHd7MCwxMH0pL2csICckMSQyJyk7IC8vcmVtb3ZlIFsncyBhbmQga2VlcCBzdWZmaXhcbiAgICAgIGxpbmsgPSBzLnJlcGxhY2UoLyguezIsNjB9KVxcfC57MCwyMDB9LywgJyQxJyk7IC8vcmVwbGFjZWQgbGlua3NcbiAgICAgIHR4dCA9IHMucmVwbGFjZSgvLnsyLDYwfT9cXHwvLCAnJyk7XG4gICAgICAvL2hhbmRsZSBmdW5reSBjYXNlIG9mIFtbdG9yb250b3xdXVxuICAgICAgaWYgKCF0eHQgJiYgbGluay5tYXRjaCgvXFx8JC8pKSB7XG4gICAgICAgIGxpbmsgPSBsaW5rLnJlcGxhY2UoL1xcfCQvLCAnJyk7XG4gICAgICAgIHR4dCA9IGxpbms7XG4gICAgICB9XG4gICAgfVxuICAgIC8va2lsbCBvZmYgbm9uLXdpa2lwZWRpYSBuYW1lc3BhY2VzXG4gICAgaWYgKGxpbmsubWF0Y2goaWdub3JlX2xpbmtzKSkge1xuICAgICAgcmV0dXJuIHM7XG4gICAgfVxuICAgIC8va2lsbCBvZmYganVzdCBhbmNob3IgbGlua3MgW1sjaGlzdG9yeV1dXG4gICAgaWYgKGxpbmsubWF0Y2goL14jL2kpKSB7XG4gICAgICByZXR1cm4gcztcbiAgICB9XG4gICAgLy9yZW1vdmUgYW5jaG9ycyBmcm9tIGVuZCBbW3Rvcm9udG8jaGlzdG9yeV1dXG4gICAgbGluayA9IGxpbmsucmVwbGFjZSgvI1teIF17MSwxMDB9LywgJycpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBwYWdlOiBoZWxwZXJzLmNhcGl0YWxpc2UobGluayksXG4gICAgICB0ZXh0OiB0eHQgfHwgbGlua1xuICAgIH07XG4gICAgLy9maW5hbGx5LCBzdXBwb3J0IFtbbGlua11dJ3MgYXBvc3Ryb3BoZVxuICAgIGlmIChhcG9zdHJvcGhlKSB7XG4gICAgICBvYmoudGV4dCArPSBhcG9zdHJvcGhlO1xuICAgIH1cbiAgICBsaW5rcy5wdXNoKG9iaik7XG4gICAgcmV0dXJuIHM7XG4gIH0pO1xuICByZXR1cm4gbGlua3M7XG59O1xuXG4vL2dyYWIgYW4gYXJyYXkgb2YgaW50ZXJuYWwgbGlua3MgaW4gdGhlIHRleHRcbmNvbnN0IHBhcnNlX2xpbmtzID0gZnVuY3Rpb24oc3RyKSB7XG4gIGxldCBsaW5rcyA9IFtdO1xuICAvL2ZpcnN0LCBwYXJzZSBleHRlcm5hbCBsaW5rc1xuICBsaW5rcyA9IGV4dGVybmFsX2xpbmtzKGxpbmtzLCBzdHIpO1xuICAvL2ludGVybmFsIGxpbmtzXG4gIGxpbmtzID0gaW50ZXJuYWxfbGlua3MobGlua3MsIHN0cik7XG5cbiAgaWYgKGxpbmtzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIGxpbmtzO1xufTtcbm1vZHVsZS5leHBvcnRzID0gcGFyc2VfbGlua3M7XG4iLCIvL3NwbGl0IHRleHQgaW50byBzZW50ZW5jZXMsIHVzaW5nIHJlZ2V4XG4vL0BzcGVuY2VybW91bnRhaW4gTUlUXG5cbi8vKFJ1bGUtYmFzZWQgc2VudGVuY2UgYm91bmRhcnkgc2VnbWVudGF0aW9uKSAtIGNob3AgZ2l2ZW4gdGV4dCBpbnRvIGl0cyBwcm9wZXIgc2VudGVuY2VzLlxuLy8gSWdub3JlIHBlcmlvZHMvcXVlc3Rpb25zL2V4Y2xhbWF0aW9ucyB1c2VkIGluIGFjcm9ueW1zL2FiYnJldmlhdGlvbnMvbnVtYmVycywgZXRjLlxuLy8gQHNwZW5jZXJtb3VudGFpbiAyMDE1IE1JVFxuJ3VzZSBzdHJpY3QnO1xuY29uc3QgYWJicmV2aWF0aW9ucyA9IHJlcXVpcmUoJy4uLy4uLy4uL2RhdGEvYWJicmV2aWF0aW9ucycpO1xuY29uc3QgYWJicmV2X3JlZyA9IG5ldyBSZWdFeHAoJyhefCApKCcgKyBhYmJyZXZpYXRpb25zLmpvaW4oJ3wnKSArICcpWy4hP10gPyQnLCAnaScpO1xuY29uc3QgYWNyb255bV9yZWcgPSBuZXcgUmVnRXhwKCdbIHwuXVtBLVpdLj8gKz8kJywgJ2knKTtcbmNvbnN0IGVsaXBzZXNfcmVnID0gbmV3IFJlZ0V4cCgnXFxcXC5cXFxcLlxcXFwuKiArPyQnKTtcbmNvbnN0IGhhc1dvcmQgPSBuZXcgUmVnRXhwKCdbYS16XVthLXpdJywgJ2knKTtcblxuLy90dXJuIGEgbmVzdGVkIGFycmF5IGludG8gb25lIGFycmF5XG5jb25zdCBmbGF0dGVuID0gZnVuY3Rpb24oYXJyKSB7XG4gIGxldCBhbGwgPSBbXTtcbiAgYXJyLmZvckVhY2goZnVuY3Rpb24oYSkge1xuICAgIGFsbCA9IGFsbC5jb25jYXQoYSk7XG4gIH0pO1xuICByZXR1cm4gYWxsO1xufTtcblxuY29uc3QgbmFpaXZlX3NwbGl0ID0gZnVuY3Rpb24odGV4dCkge1xuICAvL2ZpcnN0LCBzcGxpdCBieSBuZXdsaW5lXG4gIGxldCBzcGxpdHMgPSB0ZXh0LnNwbGl0KC8oXFxuKykvKTtcbiAgc3BsaXRzID0gc3BsaXRzLmZpbHRlcihzID0+IHMubWF0Y2goL1xcUy8pKTtcbiAgLy9zcGxpdCBieSBwZXJpb2QsIHF1ZXN0aW9uLW1hcmssIGFuZCBleGNsYW1hdGlvbi1tYXJrXG4gIHNwbGl0cyA9IHNwbGl0cy5tYXAoZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zcGxpdCgvKFxcUy4rP1suIT9dKSg/PVxccyt8JCkvZyk7XG4gIH0pO1xuICByZXR1cm4gZmxhdHRlbihzcGxpdHMpO1xufTtcblxuLy8gaWYgdGhpcyBsb29rcyBsaWtlIGEgcGVyaW9kIHdpdGhpbiBhIHdpa2lwZWRpYSBsaW5rLCByZXR1cm4gZmFsc2VcbmNvbnN0IGlzQmFsYW5jZWQgPSBmdW5jdGlvbihzdHIpIHtcbiAgc3RyID0gc3RyIHx8ICcnO1xuICBjb25zdCBvcGVuID0gc3RyLnNwbGl0KC9cXFtcXFsvKSB8fCBbXTtcbiAgY29uc3QgY2xvc2VkID0gc3RyLnNwbGl0KC9cXF1cXF0vKSB8fCBbXTtcbiAgaWYgKG9wZW4ubGVuZ3RoID4gY2xvc2VkLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvL21ha2Ugc3VyZSBxdW90ZXMgYXJlIGNsb3NlZCB0b29cbiAgY29uc3QgcXVvdGVzID0gc3RyLm1hdGNoKC9cIi9nKTtcbiAgaWYgKHF1b3RlcyAmJiBxdW90ZXMubGVuZ3RoICUgMiAhPT0gMCAmJiBzdHIubGVuZ3RoIDwgOTAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuY29uc3Qgc2VudGVuY2VfcGFyc2VyID0gZnVuY3Rpb24odGV4dCkge1xuICBsZXQgc2VudGVuY2VzID0gW107XG4gIC8vZmlyc3QgZG8gYSBncmVlZHktc3BsaXQuLlxuICBsZXQgY2h1bmtzID0gW107XG4gIC8vZW5zdXJlIGl0ICdzbWVsbHMgbGlrZScgYSBzZW50ZW5jZVxuICBpZiAoIXRleHQgfHwgdHlwZW9mIHRleHQgIT09ICdzdHJpbmcnIHx8ICF0ZXh0Lm1hdGNoKC9cXHcvKSkge1xuICAgIHJldHVybiBzZW50ZW5jZXM7XG4gIH1cbiAgLy8gVGhpcyB3YXMgdGhlIHNwbGl0dGVyIHJlZ2V4IHVwZGF0ZWQgdG8gZml4IHF1b3RlZCBwdW5jdHVhdGlvbiBtYXJrcy5cbiAgLy8gbGV0IHNwbGl0cyA9IHRleHQuc3BsaXQoLyhcXFMuKz9bLlxcPyFdKSg/PVxccyt8JHxcIikvZyk7XG4gIC8vIHRvZG86IGxvb2sgZm9yIHNpZGUgZWZmZWN0cyBpbiB0aGlzIHJlZ2V4IHJlcGxhY2VtZW50OlxuICBsZXQgc3BsaXRzID0gbmFpaXZlX3NwbGl0KHRleHQpO1xuICAvL2ZpbHRlci1vdXQgdGhlIGdyYXAgb25lc1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0cy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBzID0gc3BsaXRzW2ldO1xuICAgIGlmICghcyB8fCBzID09PSAnJykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIC8vdGhpcyBpcyBtZWFuaW5nZnVsIHdoaXRlc3BhY2VcbiAgICBpZiAoIXMubWF0Y2goL1xcUy8pKSB7XG4gICAgICAvL2FkZCBpdCB0byB0aGUgbGFzdCBvbmVcbiAgICAgIGlmIChjaHVua3NbY2h1bmtzLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgIGNodW5rc1tjaHVua3MubGVuZ3RoIC0gMV0gKz0gcztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2UgaWYgKHNwbGl0c1tpICsgMV0pIHtcbiAgICAgICAgLy9hZGQgaXQgdG8gdGhlIG5leHQgb25lXG4gICAgICAgIHNwbGl0c1tpICsgMV0gPSBzICsgc3BsaXRzW2kgKyAxXTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICAgIGNodW5rcy5wdXNoKHMpO1xuICB9XG5cbiAgLy9kZXRlY3Rpb24gb2Ygbm9uLXNlbnRlbmNlIGNodW5rc1xuICBjb25zdCBpc1NlbnRlbmNlID0gZnVuY3Rpb24oaG1tKSB7XG4gICAgaWYgKGhtbS5tYXRjaChhYmJyZXZfcmVnKSB8fCBobW0ubWF0Y2goYWNyb255bV9yZWcpIHx8IGhtbS5tYXRjaChlbGlwc2VzX3JlZykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy90b28gc2hvcnQ/IC0gbm8gY29uc2VjdXRpdmUgbGV0dGVyc1xuICAgIGlmIChoYXNXb3JkLnRlc3QoaG1tKSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFpc0JhbGFuY2VkKGhtbSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy9sb29wIHRocm91Z2ggdGhlc2UgY2h1bmtzLCBhbmQgam9pbiB0aGUgbm9uLXNlbnRlbmNlIGNodW5rcyBiYWNrIHRvZ2V0aGVyLi5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaHVua3MubGVuZ3RoOyBpKyspIHtcbiAgICAvL3Nob3VsZCB0aGlzIGNodW5rIGJlIGNvbWJpbmVkIHdpdGggdGhlIG5leHQgb25lP1xuICAgIGlmIChjaHVua3NbaSArIDFdICYmICFpc1NlbnRlbmNlKGNodW5rc1tpXSkpIHtcbiAgICAgIGNodW5rc1tpICsgMV0gPSBjaHVua3NbaV0gKyAoY2h1bmtzW2kgKyAxXSB8fCAnJyk7IC8vLnJlcGxhY2UoLyArL2csICcgJyk7XG4gICAgfSBlbHNlIGlmIChjaHVua3NbaV0gJiYgY2h1bmtzW2ldLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vdGhpcyBjaHVuayBpcyBhIHByb3BlciBzZW50ZW5jZS4uXG4gICAgICBzZW50ZW5jZXMucHVzaChjaHVua3NbaV0pO1xuICAgICAgY2h1bmtzW2ldID0gJyc7XG4gICAgfVxuICB9XG4gIC8vaWYgd2UgbmV2ZXIgZ290IGEgc2VudGVuY2UsIHJldHVybiB0aGUgZ2l2ZW4gdGV4dFxuICBpZiAoc2VudGVuY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBbdGV4dF07XG4gIH1cbiAgcmV0dXJuIHNlbnRlbmNlcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gc2VudGVuY2VfcGFyc2VyO1xuLy8gY29uc29sZS5sb2coc2VudGVuY2VfcGFyc2VyKCdUb255IGlzIG5pY2UuIEhlIGxpdmVzIGluIEphcGFuLicpLmxlbmd0aCA9PT0gMik7XG4iLCIvL2Fzc29ydGVkIHBhcnNpbmcgbWV0aG9kcyBmb3IgZGF0ZS90aW1lIHRlbXBsYXRlc1xuY29uc3QgbW9udGhzID0gW1xuICB1bmRlZmluZWQsIC8vMS1iYXNlZCBtb250aHMuLiA6L1xuICAnSmFudWFyeScsXG4gICdGZWJydWFyeScsXG4gICdNYXJjaCcsXG4gICdBcHJpbCcsXG4gICdNYXknLFxuICAnSnVuZScsXG4gICdKdWx5JyxcbiAgJ0F1Z3VzdCcsXG4gICdTZXB0ZW1iZXInLFxuICAnT2N0b2JlcicsXG4gICdOb3ZlbWJlcicsXG4gICdEZWNlbWJlcicsXG5dO1xuXG4vL3BhcnNlIHllYXJ8bW9udGh8ZGF0ZSBudW1iZXJzXG5jb25zdCB5bWQgPSBmdW5jdGlvbihhcnIpIHtcbiAgbGV0IG9iaiA9IHt9O1xuICBsZXQgdW5pdHMgPSBbJ3llYXInLCAnbW9udGgnLCAnZGF0ZScsICdob3VyJywgJ21pbnV0ZScsICdzZWNvbmQnXTtcbiAgZm9yKGxldCBpID0gMDsgaSA8IHVuaXRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKCFhcnJbaV0gJiYgYXJyWzFdICE9PSAwKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgb2JqW3VuaXRzW2ldXSA9IHBhcnNlSW50KGFycltpXSwgMTApO1xuICAgIGlmIChpc05hTihvYmpbdW5pdHNbaV1dKSkge1xuICAgICAgZGVsZXRlIG9ialt1bml0c1tpXV07XG4gICAgfVxuICB9XG4gIC8vdHJ5IGZvciB0aW1lem9uZSx0b28gZnR3XG4gIGxldCBsYXN0ID0gYXJyW2Fyci5sZW5ndGggLSAxXSB8fCAnJztcbiAgbGFzdCA9IFN0cmluZyhsYXN0KTtcbiAgaWYgKGxhc3QudG9Mb3dlckNhc2UoKSA9PT0gJ3onKSB7XG4gICAgb2JqLnR6ID0gJ1VUQyc7XG4gIH0gZWxzZSBpZiAoL1srLV1bMC05XSs6WzAtOV0vLnRlc3QobGFzdCkpIHtcbiAgICBvYmoudHogPSBhcnJbNl07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn07XG5cbi8vemVyby1wYWQgYSBudW1iZXJcbmNvbnN0IHBhZCA9IGZ1bmN0aW9uKG51bSkge1xuICBpZiAobnVtIDwgMTApIHtcbiAgICByZXR1cm4gJzAnICsgbnVtO1xuICB9XG4gIHJldHVybiBTdHJpbmcobnVtKTtcbn07XG5cbmNvbnN0IHRvVGV4dCA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgLy9lZyAnMTk5NSdcbiAgbGV0IHN0ciA9IFN0cmluZyhkYXRlLnllYXIpIHx8ICcnO1xuICBpZiAoZGF0ZS5tb250aCAhPT0gdW5kZWZpbmVkICYmIG1vbnRocy5oYXNPd25Qcm9wZXJ0eShkYXRlLm1vbnRoKSA9PT0gdHJ1ZSkge1xuICAgIGlmIChkYXRlLmRhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy9KYW51YXJ5IDE5OTVcbiAgICAgIHN0ciA9IGAke21vbnRoc1tkYXRlLm1vbnRoXX0gJHtkYXRlLnllYXJ9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9KYW51YXJ5IDUsIDE5OTVcbiAgICAgIHN0ciA9IGAke21vbnRoc1tkYXRlLm1vbnRoXX0gJHtkYXRlLmRhdGV9LCAke2RhdGUueWVhcn1gO1xuICAgICAgLy9hZGQgdGltZXMsIGlmIGF2YWlsYWJsZVxuICAgICAgaWYgKGRhdGUuaG91ciAhPT0gdW5kZWZpbmVkICYmIGRhdGUubWludXRlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IHRpbWUgPSBgJHtwYWQoZGF0ZS5ob3VyKX06JHtwYWQoZGF0ZS5taW51dGUpfWA7XG4gICAgICAgIGlmIChkYXRlLnNlY29uZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGltZSA9IHRpbWUgKyAnOicgKyBwYWQoZGF0ZS5zZWNvbmQpO1xuICAgICAgICB9XG4gICAgICAgIHN0ciA9IHRpbWUgKyAnLCAnICsgc3RyO1xuICAgICAgLy9hZGQgdGltZXpvbmUsIGlmIHRoZXJlLCBhdCB0aGUgZW5kIGluIGJyYWNrZXRzXG4gICAgICB9XG4gICAgICBpZiAoZGF0ZS50eikge1xuICAgICAgICBzdHIgKz0gYCAoJHtkYXRlLnR6fSlgO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHRvVGV4dDogdG9UZXh0LFxuICB5bWQ6IHltZCxcbn07XG4iLCIvL3RoaXMgaXMgYWxsb3dlZCB0byBiZSByb3VnaFxuY29uc3QgZGF5ID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbmNvbnN0IG1vbnRoID0gZGF5ICogMzA7XG5jb25zdCB5ZWFyID0gZGF5ICogMzY1O1xuXG5jb25zdCBnZXRFcG9jaCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gbmV3IERhdGUoYCR7b2JqLnllYXJ9LSR7b2JqLm1vbnRoIHx8IDB9LSR7b2JqLmRhdGUgfHwgMX1gKS5nZXRUaW1lKCk7XG59O1xuXG4vL3Zlcnkgcm91Z2ghXG5jb25zdCBkZWx0YSA9IGZ1bmN0aW9uKGZyb20sIHRvKSB7XG4gIGZyb20gPSBnZXRFcG9jaChmcm9tKTtcbiAgdG8gPSBnZXRFcG9jaCh0byk7XG4gIGxldCBkaWZmID0gdG8gLSBmcm9tO1xuICBsZXQgb2JqID0ge307XG4gIC8vZ2V0IHllYXJzXG4gIGxldCB5ZWFycyA9IE1hdGguZmxvb3IoZGlmZiAvIHllYXIsIDEwKTtcbiAgaWYgKHllYXJzID4gMCkge1xuICAgIG9iai55ZWFycyA9IHllYXJzO1xuICAgIGRpZmYgLT0gKG9iai55ZWFycyAqIHllYXIpO1xuICB9XG4gIC8vZ2V0IG1vbnRoc1xuICBsZXQgbW9udGhzID0gTWF0aC5mbG9vcihkaWZmIC8gbW9udGgsIDEwKTtcbiAgaWYgKG1vbnRocyA+IDApIHtcbiAgICBvYmoubW9udGhzID0gbW9udGhzO1xuICAgIGRpZmYgLT0gKG9iai5tb250aHMgKiBtb250aCk7XG4gIH1cbiAgLy9nZXQgZGF5c1xuICBsZXQgZGF5cyA9IE1hdGguZmxvb3IoZGlmZiAvIGRheSwgMTApO1xuICBpZiAoZGF5cyA+IDApIHtcbiAgICBvYmouZGF5cyA9IGRheXM7XG4gIC8vIGRpZmYgLT0gKG9iai5kYXlzICogZGF5KTtcbiAgfVxuICByZXR1cm4gb2JqO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWx0YTtcbiIsImNvbnN0IHBhcnNlcnMgPSByZXF1aXJlKCcuL3BhcnNlcnMnKTtcbmNvbnN0IHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzJyk7XG5cbi8vZ2V0IGlkZW50aXR5IG9mIHRlbXBsYXRlIC0gVGVtcGxhdGU6Rm9vXG5jb25zdCBnZXROYW1lID0gZnVuY3Rpb24odG1wbCkge1xuICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7LywgJycpO1xuICB0bXBsID0gdG1wbC5yZXBsYWNlKC9cXH1cXH0kLywgJycpO1xuICBsZXQgbmFtZSA9IHRtcGwuc3BsaXQoL1xcfC8pWzBdIHx8ICcnO1xuICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcbiAgLy8gbmFtZSA9IG5hbWUucmVwbGFjZSgvLS9nLCAnICcpO1xuICByZXR1cm4gbmFtZTtcbn07XG5cbi8vcnVuIGVhY2ggcmVtYWluaW5nIHt7dGVtcGxhdGV9fSB0aHJvdWdoIG91ciBwYXJzZXJzXG5jb25zdCBwYXJzZVRlbXBsYXRlcyA9IGZ1bmN0aW9uKG9iaikge1xuICBsZXQgbGlzdCA9IG9iai50ZXh0Lm1hdGNoKC9cXHtcXHsoW159XSspXFx9XFx9L2cpIHx8IFtdO1xuICBsaXN0ID0gbGlzdC5tYXAoKHRtcGwpID0+IHtcbiAgICBsZXQgbmFtZSA9IGdldE5hbWUodG1wbCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICByYXc6IHRtcGxcbiAgICB9O1xuICB9KTtcbiAgLy90cnkgcGFyc2luZyBlYWNoIHRlbXBsYXRlXG4gIGxpc3QuZm9yRWFjaCgodCkgPT4ge1xuICAgIC8vcmVtb3ZlIHRoZSB7eydzICYgfX0nc1xuICAgIHQudG1wbCA9IHQucmF3LnJlcGxhY2UoL15cXHtcXHsvLCAnJyk7XG4gICAgdC50bXBsID0gdC50bXBsLnJlcGxhY2UoL1xcfVxcfSQvLCAnJyk7XG4gICAgaWYgKHBhcnNlcnMuaGFzT3duUHJvcGVydHkodGVtcGxhdGVzW3QubmFtZV0pID09PSB0cnVlKSB7XG4gICAgICBsZXQgcGFyc2VyID0gdGVtcGxhdGVzW3QubmFtZV07XG4gICAgICBsZXQgcmVzdWx0ID0gcGFyc2Vyc1twYXJzZXJdKHQudG1wbCwgb2JqKTtcbiAgICAgIG9iai50ZXh0ID0gb2JqLnRleHQucmVwbGFjZSh0LnJhdywgcmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9vdGhlcndpc2UsIGp1c3QgcmVtb3ZlIGl0IGZyb20gdGhlIHRleHRcbiAgICAgIG9iai50ZXh0ID0gb2JqLnRleHQucmVwbGFjZSh0LnJhdywgJycpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmo7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBwYXJzZVRlbXBsYXRlcztcbiIsImNvbnN0IGRhdGVzID0gcmVxdWlyZSgnLi9kYXRlcycpO1xuY29uc3QgeW1kID0gZGF0ZXMueW1kO1xuY29uc3QgdG9UZXh0ID0gZGF0ZXMudG9UZXh0O1xuY29uc3QgZGVsdGEgPSByZXF1aXJlKCcuL2RlbHRhX2RhdGUnKTtcblxuY29uc3QgZ2V0Qm90aCA9IGZ1bmN0aW9uKHRtcGwpIHtcbiAgbGV0IGFyciA9IHRtcGwuc3BsaXQoJ3wnKTtcbiAgbGV0IGZyb20gPSB5bWQoYXJyLnNsaWNlKDEsIDQpKTtcbiAgbGV0IHRvID0gYXJyLnNsaWNlKDQsIDcpO1xuICAvL2Fzc3VtZSBub3csIGlmICd0bycgaXMgZW1wdHlcbiAgaWYgKHRvLmxlbmd0aCA9PT0gMCkge1xuICAgIGxldCBkID0gbmV3IERhdGUoKTtcbiAgICB0byA9IFtkLmdldEZ1bGxZZWFyKCksIGQuZ2V0TW9udGgoKSwgZC5nZXREYXRlKCldO1xuICB9XG4gIHRvID0geW1kKHRvKTtcbiAgcmV0dXJuIHtcbiAgICBmcm9tOiBmcm9tLFxuICAgIHRvOiB0b1xuICB9O1xufTtcblxuY29uc3QgcGFyc2VycyA9IHtcblxuICAvL2dlbmVyaWMge3tkYXRlfHllYXJ8bW9udGh8ZGF0ZX19IHRlbXBsYXRlXG4gIGRhdGU6ICh0bXBsLCBvYmopID0+IHtcbiAgICBsZXQgYXJyID0gdG1wbC5zcGxpdCgnfCcpO1xuICAgIGFyciA9IGFyci5zbGljZSgxLCA4KTtcbiAgICAvL3N1cHBvcnQgJ2RmPXllc3wxODk0fDd8MjYnXG4gICAgaWYgKGFyclswXSAmJiAvXmRmPS8udGVzdChhcnJbMF0pKSB7XG4gICAgICBhcnIuc2hpZnQoKTtcbiAgICB9XG4gICAgbGV0IGRhdGUgPSB5bWQoYXJyKTtcbiAgICBkYXRlLnRleHQgPSB0b1RleHQoZGF0ZSk7IC8vbWFrZSB0aGUgcmVwbGFjZW1lbnQgc3RyaW5nXG4gICAgb2JqLmRhdGVzID0gb2JqLmRhdGVzIHx8IFtdO1xuICAgIG9iai5kYXRlcy5wdXNoKGRhdGUpO1xuICAgIHJldHVybiBkYXRlLnRleHQ7XG4gIH0sXG5cbiAgLy9zdXBwb3J0IHBhcnNpbmcgb2YgJ0ZlYnJ1YXJ5IDEwLCAxOTkyJ1xuICBuYXR1cmFsX2RhdGU6ICh0bXBsLCBvYmopID0+IHtcbiAgICBsZXQgYXJyID0gdG1wbC5zcGxpdCgnfCcpO1xuICAgIGxldCBzdHIgPSBhcnJbMV0gfHwgJyc7XG4gICAgLy8gLSBqdXN0IGEgeWVhclxuICAgIGxldCBkYXRlID0ge307XG4gICAgaWYgKC9eWzAtOV17NH0kLy50ZXN0KGFyclsxXSkpIHtcbiAgICAgIGRhdGUueWVhciA9IHBhcnNlSW50KGFyclsxXSwgMTApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL3BhcnNlIHRoZSBkYXRlLCB1c2luZyB0aGUganMgZGF0ZSBvYmplY3QgKGZvciBub3c/KVxuICAgICAgbGV0IHR4dCA9IGFyclsxXS5yZXBsYWNlKC9bYS16XStcXC9bYS16XSsvaSk7XG4gICAgICB0eHQgPSB0eHQucmVwbGFjZSgvWzAtOV0rOlswLTldKyhhbXxwbSk/L2kpO1xuICAgICAgbGV0IGQgPSBuZXcgRGF0ZSh0eHQpO1xuICAgICAgaWYgKGlzTmFOKGQuZ2V0VGltZSgpKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgZGF0ZS55ZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBkYXRlLm1vbnRoID0gZC5nZXRNb250aCgpICsgMTtcbiAgICAgICAgZGF0ZS5kYXRlID0gZC5nZXREYXRlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIG9iai5kYXRlcyA9IG9iai5kYXRlcyB8fCBbXTtcbiAgICBvYmouZGF0ZXMucHVzaChkYXRlKTtcbiAgICByZXR1cm4gc3RyLnRyaW0oKTtcbiAgfSxcblxuICAvL2p1c3QgZ3JhYiB0aGUgZmlyc3QgdmFsdWUsIGFuZCBhc3N1bWUgaXQncyBhIHllYXJcbiAgb25lX3llYXI6ICh0bXBsLCBvYmopID0+IHtcbiAgICBsZXQgYXJyID0gdG1wbC5zcGxpdCgnfCcpO1xuICAgIGxldCBzdHIgPSBhcnJbMV0gfHwgJyc7XG4gICAgbGV0IHllYXIgPSBwYXJzZUludChzdHIsIDEwKTtcbiAgICBvYmouZGF0ZXMgPSBvYmouZGF0ZXMgfHwgW107XG4gICAgb2JqLmRhdGVzLnB1c2goe1xuICAgICAgeWVhcjogeWVhclxuICAgIH0pO1xuICAgIHJldHVybiBzdHIudHJpbSgpO1xuICB9LFxuXG4gIC8vYXNzdW1lICd5fG18ZCcgfCAneXxtfGQnXG4gIHR3b19kYXRlczogKHRtcGwsIG9iaikgPT4ge1xuICAgIGxldCBhcnIgPSB0bXBsLnNwbGl0KCd8Jyk7XG4gICAgLy8nYicgbWVhbnMgc2hvdyBiaXJ0aC1kYXRlLCBvdGhlcndpc2Ugc2hvdyBkZWF0aC1kYXRlXG4gICAgaWYgKGFyclsxXSA9PT0gJ0InIHx8IGFyclsxXSA9PT0gJ2InKSB7XG4gICAgICBsZXQgZGF0ZSA9IHltZChhcnIuc2xpY2UoMiwgNSkpO1xuICAgICAgb2JqLmRhdGVzID0gb2JqLmRhdGVzIHx8IFtdO1xuICAgICAgb2JqLmRhdGVzLnB1c2goZGF0ZSk7XG4gICAgICByZXR1cm4gdG9UZXh0KGRhdGUpO1xuICAgIH1cbiAgICBsZXQgZGF0ZSA9IHltZChhcnIuc2xpY2UoNSwgOCkpO1xuICAgIG9iai5kYXRlcyA9IG9iai5kYXRlcyB8fCBbXTtcbiAgICBvYmouZGF0ZXMucHVzaChkYXRlKTtcbiAgICByZXR1cm4gdG9UZXh0KGRhdGUpO1xuICB9LFxuXG4gICdhZ2UnOiAodG1wbCkgPT4ge1xuICAgIGxldCBkID0gZ2V0Qm90aCh0bXBsKTtcbiAgICBsZXQgZGlmZiA9IGRlbHRhKGQuZnJvbSwgZC50byk7XG4gICAgcmV0dXJuIGRpZmYueWVhcnMgfHwgMDtcbiAgfSxcblxuICAnZGlmZi15JzogKHRtcGwpID0+IHtcbiAgICBsZXQgZCA9IGdldEJvdGgodG1wbCk7XG4gICAgbGV0IGRpZmYgPSBkZWx0YShkLmZyb20sIGQudG8pO1xuICAgIGlmIChkaWZmLnllYXJzID09PSAxKSB7XG4gICAgICByZXR1cm4gZGlmZi55ZWFycyArICcgeWVhcic7XG4gICAgfVxuICAgIHJldHVybiAoZGlmZi55ZWFycyB8fCAwKSArICcgeWVhcnMnO1xuICB9LFxuICAnZGlmZi15bSc6ICh0bXBsKSA9PiB7XG4gICAgbGV0IGQgPSBnZXRCb3RoKHRtcGwpO1xuICAgIGxldCBkaWZmID0gZGVsdGEoZC5mcm9tLCBkLnRvKTtcbiAgICBsZXQgYXJyID0gW107XG4gICAgaWYgKGRpZmYueWVhcnMgPT09IDEpIHtcbiAgICAgIGFyci5wdXNoKGRpZmYueWVhcnMgKyAnIHllYXInKTtcbiAgICB9IGVsc2UgaWYgKGRpZmYueWVhcnMgJiYgZGlmZi55ZWFycyAhPT0gMCkge1xuICAgICAgYXJyLnB1c2goZGlmZi55ZWFycyArICcgeWVhcnMnKTtcbiAgICB9XG4gICAgaWYgKGRpZmYubW9udGhzID09PSAxKSB7XG4gICAgICBhcnIucHVzaCgnMSBtb250aCcpO1xuICAgIH0gZWxzZSBpZiAoZGlmZi5tb250aHMgJiYgZGlmZi5tb250aHMgIT09IDApIHtcbiAgICAgIGFyci5wdXNoKGRpZmYubW9udGhzICsgJyBtb250aHMnKTtcbiAgICB9XG4gICAgcmV0dXJuIGFyci5qb2luKCcsICcpO1xuICB9LFxuICAnZGlmZi15bWQnOiAodG1wbCkgPT4ge1xuICAgIGxldCBkID0gZ2V0Qm90aCh0bXBsKTtcbiAgICBsZXQgZGlmZiA9IGRlbHRhKGQuZnJvbSwgZC50byk7XG4gICAgbGV0IGFyciA9IFtdO1xuICAgIGlmIChkaWZmLnllYXJzID09PSAxKSB7XG4gICAgICBhcnIucHVzaChkaWZmLnllYXJzICsgJyB5ZWFyJyk7XG4gICAgfSBlbHNlIGlmIChkaWZmLnllYXJzICYmIGRpZmYueWVhcnMgIT09IDApIHtcbiAgICAgIGFyci5wdXNoKGRpZmYueWVhcnMgKyAnIHllYXJzJyk7XG4gICAgfVxuICAgIGlmIChkaWZmLm1vbnRocyA9PT0gMSkge1xuICAgICAgYXJyLnB1c2goJzEgbW9udGgnKTtcbiAgICB9IGVsc2UgaWYgKGRpZmYubW9udGhzICYmIGRpZmYubW9udGhzICE9PSAwKSB7XG4gICAgICBhcnIucHVzaChkaWZmLm1vbnRocyArICcgbW9udGhzJyk7XG4gICAgfVxuICAgIGlmIChkaWZmLmRheXMgPT09IDEpIHtcbiAgICAgIGFyci5wdXNoKCcxIGRheScpO1xuICAgIH0gZWxzZSBpZiAoZGlmZi5kYXlzICYmIGRpZmYuZGF5cyAhPT0gMCkge1xuICAgICAgYXJyLnB1c2goZGlmZi5kYXlzICsgJyBkYXlzJyk7XG4gICAgfVxuICAgIHJldHVybiBhcnIuam9pbignLCAnKTtcbiAgfSxcbiAgJ2RpZmYteWQnOiAodG1wbCkgPT4ge1xuICAgIGxldCBkID0gZ2V0Qm90aCh0bXBsKTtcbiAgICBsZXQgZGlmZiA9IGRlbHRhKGQuZnJvbSwgZC50byk7XG4gICAgbGV0IGFyciA9IFtdO1xuICAgIGlmIChkaWZmLnllYXJzID09PSAxKSB7XG4gICAgICBhcnIucHVzaChkaWZmLnllYXJzICsgJyB5ZWFyJyk7XG4gICAgfSBlbHNlIGlmIChkaWZmLnllYXJzICYmIGRpZmYueWVhcnMgIT09IDApIHtcbiAgICAgIGFyci5wdXNoKGRpZmYueWVhcnMgKyAnIHllYXJzJyk7XG4gICAgfVxuICAgIC8vZXJnaC4uLlxuICAgIGRpZmYuZGF5cyArPSAoZGlmZi5tb250aHMgfHwgMCkgKiAzMDtcbiAgICBpZiAoZGlmZi5kYXlzID09PSAxKSB7XG4gICAgICBhcnIucHVzaCgnMSBkYXknKTtcbiAgICB9IGVsc2UgaWYgKGRpZmYuZGF5cyAmJiBkaWZmLmRheXMgIT09IDApIHtcbiAgICAgIGFyci5wdXNoKGRpZmYuZGF5cyArICcgZGF5cycpO1xuICAgIH1cbiAgICByZXR1cm4gYXJyLmpvaW4oJywgJyk7XG4gIH0sXG4gICdkaWZmLWQnOiAodG1wbCkgPT4ge1xuICAgIGxldCBkID0gZ2V0Qm90aCh0bXBsKTtcbiAgICBsZXQgZGlmZiA9IGRlbHRhKGQuZnJvbSwgZC50byk7XG4gICAgbGV0IGFyciA9IFtdO1xuICAgIC8vZXJnaC4uLlxuICAgIGRpZmYuZGF5cyArPSAoZGlmZi55ZWFycyB8fCAwKSAqIDM2NTtcbiAgICBkaWZmLmRheXMgKz0gKGRpZmYubW9udGhzIHx8IDApICogMzA7XG4gICAgaWYgKGRpZmYuZGF5cyA9PT0gMSkge1xuICAgICAgYXJyLnB1c2goJzEgZGF5Jyk7XG4gICAgfSBlbHNlIGlmIChkaWZmLmRheXMgJiYgZGlmZi5kYXlzICE9PSAwKSB7XG4gICAgICBhcnIucHVzaChkaWZmLmRheXMgKyAnIGRheXMnKTtcbiAgICB9XG4gICAgcmV0dXJuIGFyci5qb2luKCcsICcpO1xuICB9LFxuXG59O1xubW9kdWxlLmV4cG9ydHMgPSBwYXJzZXJzO1xuIiwiLy90ZW1wbGF0ZXMgd2Ugc3VwcG9ydFxuY29uc3Qga2VlcCA9IHtcbiAgJ21haW4nOiB0cnVlLFxuICAnbWFpbiBhcnRpY2xlJzogdHJ1ZSxcbiAgJ3dpZGUgaW1hZ2UnOiB0cnVlLFxuICAnY29vcmQnOiB0cnVlLFxuXG4gIC8vZGF0ZS9hZ2UvdGltZSB0ZW1wbGF0ZXNcbiAgJ3N0YXJ0JzogJ2RhdGUnLFxuICAnZW5kJzogJ2RhdGUnLFxuICAnYmlydGgnOiAnZGF0ZScsXG4gICdkZWF0aCc6ICdkYXRlJyxcbiAgJ3N0YXJ0IGRhdGUnOiAnZGF0ZScsXG4gICdlbmQgZGF0ZSc6ICdkYXRlJyxcbiAgJ2JpcnRoIGRhdGUnOiAnZGF0ZScsXG4gICdkZWF0aCBkYXRlJzogJ2RhdGUnLFxuICAnc3RhcnQgZGF0ZSBhbmQgYWdlJzogJ2RhdGUnLFxuICAnZW5kIGRhdGUgYW5kIGFnZSc6ICdkYXRlJyxcbiAgJ2JpcnRoIGRhdGUgYW5kIGFnZSc6ICdkYXRlJyxcbiAgJ2RlYXRoIGRhdGUgYW5kIGFnZSc6ICdkYXRlJyxcbiAgJ2JpcnRoIGRhdGUgYW5kIGdpdmVuIGFnZSc6ICdkYXRlJyxcbiAgJ2RlYXRoIGRhdGUgYW5kIGdpdmVuIGFnZSc6ICdkYXRlJyxcbiAgJ2JpcnRoIHllYXIgYW5kIGFnZSc6ICdvbmVfeWVhcicsXG4gICdkZWF0aCB5ZWFyIGFuZCBhZ2UnOiAnb25lX3llYXInLFxuXG4gIC8vdGhpcyBpcyBpbnNhbmUgKGh5cGhlbiBvbmVzIGFyZSBkaWZmZXJlbnQpXG4gICdzdGFydC1kYXRlJzogJ25hdHVyYWxfZGF0ZScsXG4gICdlbmQtZGF0ZSc6ICduYXR1cmFsX2RhdGUnLFxuICAnYmlydGgtZGF0ZSc6ICduYXR1cmFsX2RhdGUnLFxuICAnZGVhdGgtZGF0ZSc6ICduYXR1cmFsX2RhdGUnLFxuICAnYmlydGgtZGF0ZSBhbmQgYWdlJzogJ25hdHVyYWxfZGF0ZScsXG4gICdiaXJ0aC1kYXRlIGFuZCBnaXZlbiBhZ2UnOiAnbmF0dXJhbF9kYXRlJyxcbiAgJ2RlYXRoLWRhdGUgYW5kIGFnZSc6ICduYXR1cmFsX2RhdGUnLFxuICAnZGVhdGgtZGF0ZSBhbmQgZ2l2ZW4gYWdlJzogJ25hdHVyYWxfZGF0ZScsXG5cbiAgJ2JpcnRoZGVhdGhhZ2UnOiAndHdvX2RhdGVzJyxcbiAgJ2RvYic6ICdkYXRlJyxcbiAgJ2JkYSc6ICdkYXRlJyxcbiAgLy8gJ2JpcnRoIGRhdGUgYW5kIGFnZTInOiAnZGF0ZScsXG5cbiAgJ2FnZSc6ICdhZ2UnLFxuICAnYWdlIG50cyc6ICdhZ2UnLFxuICAnYWdlIGluIHllYXJzJzogJ2RpZmYteScsXG4gICdhZ2UgaW4geWVhcnMgYW5kIG1vbnRocyc6ICdkaWZmLXltJyxcbiAgJ2FnZSBpbiB5ZWFycywgbW9udGhzIGFuZCBkYXlzJzogJ2RpZmYteW1kJyxcbiAgJ2FnZSBpbiB5ZWFycyBhbmQgZGF5cyc6ICdkaWZmLXlkJyxcbiAgJ2FnZSBpbiBkYXlzJzogJ2RpZmYtZCcsXG4gIC8vICdhZ2UgaW4geWVhcnMsIG1vbnRocywgd2Vla3MgYW5kIGRheXMnOiB0cnVlLFxuICAvLyAnYWdlIGFzIG9mIGRhdGUnOiB0cnVlLFxuXG5cbn07XG5tb2R1bGUuZXhwb3J0cyA9IGtlZXA7XG4iLCJjb25zdCBoZWxwZXJzID0gcmVxdWlyZSgnLi4vLi4vbGliL2hlbHBlcnMnKTtcbmNvbnN0IHBhcnNlTGluZSA9IHJlcXVpcmUoJy4vc2VudGVuY2UvJykucGFyc2VMaW5lO1xuXG5jb25zdCB0YWJsZV9yZWcgPSAvXFx7XFx8W1xcc1xcU10rP1xcfFxcfS9nOyAvL3RoZSBsYXJnZXN0LWNpdGllcyB0YWJsZSBpcyB+NzBrY2hhcnMuXG5cbmNvbnN0IHBhcnNlSGVhZGluZyA9IGZ1bmN0aW9uKHN0cikge1xuICBzdHIgPSBwYXJzZUxpbmUoc3RyKS50ZXh0IHx8ICcnO1xuICBpZiAoc3RyLm1hdGNoKC9cXHwvKSkge1xuICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8uK1xcfCA/LywgJycpOyAvL2NsYXNzPVwidW5zb3J0YWJsZVwifHRpdGxlXG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cbi8vdHVybiBhIHt8Li4udGFibGUgc3RyaW5nIGludG8gYW4gYXJyYXkgb2YgYXJyYXlzXG5jb25zdCBwYXJzZV90YWJsZSA9IGZ1bmN0aW9uKHdpa2kpIHtcbiAgbGV0IGhlYWRpbmdzID0gW107XG4gIGxldCBsaW5lcyA9IHdpa2kucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdCgvXFxuLyk7XG5cbiAgLy9maW5kIGhlYWRpbmdzIGZpcnN0XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgc3RyID0gbGluZXNbaV07XG4gICAgLy9oZWFkZXJcbiAgICBpZiAoc3RyLm1hdGNoKC9eXFwhLykpIHtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9eXFwhICsvLCAnJyk7XG4gICAgICAvL2hhbmRsZSBpbmxpbmUgJyEhJyBmb3JtYXRcbiAgICAgIGlmIChzdHIubWF0Y2goLyBcXCFcXCEgLykpIHtcbiAgICAgICAgbGV0IGhlYWRzID0gc3RyLnNwbGl0KC8gXFwhXFwhIC8pO1xuICAgICAgICBoZWFkaW5ncyA9IGhlYWRzLm1hcChwYXJzZUhlYWRpbmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9oYW5kbGUgaGVhZGluZy1wZXItbGluZVxuICAgICAgICBzdHIgPSBwYXJzZUhlYWRpbmcoc3RyKTtcbiAgICAgICAgaWYgKCFzdHIpIHtcbiAgICAgICAgICBzdHIgPSAnY29sLScgKyBoZWFkaW5ncy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgaGVhZGluZ3MucHVzaChzdHIpO1xuICAgICAgICBsaW5lc1tpXSA9IG51bGw7IC8vcmVtb3ZlIGl0XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChoZWFkaW5ncy5sZW5ndGggPiAwICYmIHN0ci5tYXRjaCgvXnwtLykpIHtcbiAgICAgIGxpbmVzID0gbGluZXMuc2xpY2UoaSwgbGluZXMubGVuZ3RoKTtcbiAgICAgIGJyZWFrOyAvL2RvbmUgaGVyZVxuICAgIH0gZWxzZSBpZiAoc3RyLm1hdGNoKC9eXFx8IC8pKSB7XG4gICAgICBsaW5lcyA9IGxpbmVzLnNsaWNlKGksIGxpbmVzLmxlbmd0aCk7XG4gICAgICBicmVhazsgLy9kb25lIGhlcmVcbiAgICB9XG4gIH1cbiAgbGluZXMgPSBsaW5lcy5maWx0ZXIobCA9PiBsKTtcblxuICAvLyBjb25zb2xlLmxvZyhsaW5lcyk7XG4gIGxldCB0YWJsZSA9IFtbXV07XG4gIGxpbmVzLmZvckVhY2goZnVuY3Rpb24oc3RyKSB7XG4gICAgLy9lbmQgb2YgdGFibGUsIGVuZCBoZXJlXG4gICAgaWYgKHN0ci5tYXRjaCgvXlxcfFxcfS8pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vdGhpcyBpcyBzb21lIGtpbmQgb2YgY29tbWVudC9zdW1tYXJ5XG4gICAgaWYgKHN0ci5tYXRjaCgvXlxcfFxcKy8pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vbWFrZSBuZXcgcm93XG4gICAgaWYgKHN0ci5tYXRjaCgvXlxcfC0vKSkge1xuICAgICAgaWYgKHRhYmxlWzBdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIGhhbmRsZSB3ZWlyZCAnISAnIHJvdy1oZWFkZXIgc3ludGF4XG4gICAgaWYgKHN0ci5tYXRjaCgvXlxcIS8pKSB7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXlxcISArLywgJycpO1xuICAgICAgc3RyID0gcGFyc2VIZWFkaW5nKHN0cik7XG4gICAgICBzdHIgPSBoZWxwZXJzLnRyaW1fd2hpdGVzcGFjZShzdHIpO1xuICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChzdHIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvL2p1aWN5IGxpbmVcbiAgICBpZiAoc3RyLm1hdGNoKC9eXFx8LykpIHtcbiAgICAgIGxldCB3YW50ID0gKHN0ci5tYXRjaCgvXFx8KC4qKS8pIHx8IFtdKVsxXSB8fCAnJztcbiAgICAgIC8vaGFuZGxlIHdlaXJkICdyb3dzcGFuPVwiMlwiIHwnIHN5bnRheFxuICAgICAgaWYgKHdhbnQubWF0Y2goLy4gXFx8IC8pKSB7XG4gICAgICAgIC8vdGhpcyBuZWVkcyBhZGRpdGlvbmFsIGNsZWFudXBcbiAgICAgICAgd2FudCA9IHBhcnNlSGVhZGluZyh3YW50KTtcbiAgICAgIH1cbiAgICAgIHdhbnQgPSBoZWxwZXJzLnRyaW1fd2hpdGVzcGFjZSh3YW50KSB8fCAnJztcbiAgICAgIC8vaGFuZGxlIHRoZSB8fCBzaG9ydGhhbmQuLlxuICAgICAgaWYgKHdhbnQubWF0Y2goL1shXFx8XXsyfS8pKSB7XG4gICAgICAgIHdhbnQuc3BsaXQoL1shXFx8XXsyfS9nKS5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICBzID0gaGVscGVycy50cmltX3doaXRlc3BhY2Uocyk7XG4gICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChzKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHdhbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIC8vcmVtb3ZlIHRvcCBvbmUsIGlmIGl0J3MgZW1wdHlcbiAgaWYgKHRhYmxlWzBdICYmIE9iamVjdC5rZXlzKHRhYmxlWzBdKS5sZW5ndGggPT09IDApIHtcbiAgICB0YWJsZS5zaGlmdCgpO1xuICB9XG4gIC8vaW5kZXggdGhlbSBieSB0aGVpciBoZWFkZXJcbiAgdGFibGUgPSB0YWJsZS5tYXAoYXJyID0+IHtcbiAgICBsZXQgb2JqID0ge307XG4gICAgYXJyLmZvckVhY2goKGEsIGkpID0+IHtcbiAgICAgIGxldCBoZWFkID0gaGVhZGluZ3NbaV0gfHwgJ2NvbC0nICsgaTtcbiAgICAgIG9ialtoZWFkXSA9IHBhcnNlTGluZShhKTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9KTtcbiAgcmV0dXJuIHRhYmxlO1xufTtcblxuY29uc3QgZmluZFRhYmxlcyA9IGZ1bmN0aW9uKHIsIHdpa2kpIHtcbiAgbGV0IHRhYmxlcyA9IHdpa2kubWF0Y2godGFibGVfcmVnLCAnJykgfHwgW107XG4gIHRhYmxlcyA9IHRhYmxlcy5tYXAoZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHBhcnNlX3RhYmxlKHN0cik7XG4gIH0pO1xuICB0YWJsZXMgPSB0YWJsZXMuZmlsdGVyKCh0KSA9PiB0ICYmIHQubGVuZ3RoID4gMCk7XG4gIGlmICh0YWJsZXMubGVuZ3RoID4gMCkge1xuICAgIHIudGFibGVzID0gdGFibGVzO1xuICB9XG4gIC8vcmVtb3ZlIHRhYmxlc1xuICB3aWtpID0gd2lraS5yZXBsYWNlKHRhYmxlX3JlZywgJycpO1xuICByZXR1cm4gd2lraTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRUYWJsZXM7XG4iXX0=
