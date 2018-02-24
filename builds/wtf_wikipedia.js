/* wtf_wikipedia v2.6.1
   github.com/spencermountain/wtf_wikipedia
   MIT
*/

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wtf = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

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
  "version": "2.6.1",
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
var markdown = _dereq_('./output/markdown');
var html = _dereq_('./output/html');
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
  }
  return fetch(page_identifier, lang_or_wikiid, cb);
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
  version: version,
  custom: customize,
  parse: function parse(str, obj) {
    obj = obj || {};
    obj = Object.assign(obj, options); //grab 'custom' persistent options
    return _parse(str, obj);
  }
};

},{"../package":9,"./lib/fetch_text":16,"./output/html":19,"./output/markdown":24,"./parse":30}],15:[function(_dereq_,module,exports){
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

},{"../data/site_map":13,"../parse/page/redirects":35,"superagent":4}],17:[function(_dereq_,module,exports){
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

},{"../../parse":30,"./infobox":20,"./sentence":21,"./table":22}],20:[function(_dereq_,module,exports){
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

},{"./sentence":21}],21:[function(_dereq_,module,exports){
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

},{"../lib":23}],22:[function(_dereq_,module,exports){
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

},{"./sentence":21}],23:[function(_dereq_,module,exports){
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

},{}],24:[function(_dereq_,module,exports){
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

},{"../../parse":30,"./infobox":25,"./sentence":27,"./table":28}],25:[function(_dereq_,module,exports){
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

},{"./pad":26,"./sentence":27}],26:[function(_dereq_,module,exports){
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

},{}],27:[function(_dereq_,module,exports){
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

},{"../lib":23}],28:[function(_dereq_,module,exports){
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

},{"./pad":26,"./sentence":27}],29:[function(_dereq_,module,exports){
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

},{"../data/i18n":11}],30:[function(_dereq_,module,exports){
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

},{"./categories":29,"./infobox":32,"./page/disambig":34,"./page/redirects":35,"./postProcess":36,"./preProcess":38,"./section":44}],31:[function(_dereq_,module,exports){
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

},{}],32:[function(_dereq_,module,exports){
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

},{"../../data/i18n":11,"../../lib/recursive_match":18,"../section/sentence/templates/templates":55,"./citation":31,"./infobox":33}],33:[function(_dereq_,module,exports){
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

},{"../../data/i18n":11,"../../lib/helpers":17,"../../lib/recursive_match":18,"../section/sentence":48}],34:[function(_dereq_,module,exports){
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

},{"../../data/i18n":11,"../section/sentence/links":49}],35:[function(_dereq_,module,exports){
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

},{"../../data/i18n":11}],36:[function(_dereq_,module,exports){
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

},{"../../data/i18n":11,"../section/image/image":42}],37:[function(_dereq_,module,exports){
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

},{"../../lib/convertGeo":15}],38:[function(_dereq_,module,exports){
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

},{"./kill_xml":39,"./word_templates":40}],39:[function(_dereq_,module,exports){
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

},{"../infobox/citation":31,"../section/sentence":48}],40:[function(_dereq_,module,exports){
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

},{"../../data/languages":12,"./coordinates":37}],41:[function(_dereq_,module,exports){
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

},{"../../lib/helpers":17}],42:[function(_dereq_,module,exports){
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

},{"../../../data/i18n":11,"jshashes":2}],43:[function(_dereq_,module,exports){
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

},{"../../../data/i18n":11,"../../../lib/recursive_match":18,"./image":42}],44:[function(_dereq_,module,exports){
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

},{"./heading":41,"./image":43,"./list":45,"./section_templates":46,"./sentence":48,"./table":56}],45:[function(_dereq_,module,exports){
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

},{"./sentence/":48}],46:[function(_dereq_,module,exports){
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

},{}],47:[function(_dereq_,module,exports){
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

},{}],48:[function(_dereq_,module,exports){
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

},{"../../../data/i18n":11,"../../../lib/helpers":17,"./formatting":47,"./links":49,"./sentence-parser":50,"./templates":53}],49:[function(_dereq_,module,exports){
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

},{"../../../lib/helpers":17}],50:[function(_dereq_,module,exports){
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

},{"../../../data/abbreviations":10}],51:[function(_dereq_,module,exports){
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

},{}],52:[function(_dereq_,module,exports){
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

},{}],53:[function(_dereq_,module,exports){
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

},{"./parsers":54,"./templates":55}],54:[function(_dereq_,module,exports){
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

},{"./dates":51,"./delta_date":52}],55:[function(_dereq_,module,exports){
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

},{}],56:[function(_dereq_,module,exports){
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

},{"../../lib/helpers":17,"./sentence/":48}]},{},[14])(14)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29tcG9uZW50LWVtaXR0ZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvanNoYXNoZXMvaGFzaGVzLmpzIiwibm9kZV9tb2R1bGVzL3N1cGVyYWdlbnQvbGliL2FnZW50LWJhc2UuanMiLCJub2RlX21vZHVsZXMvc3VwZXJhZ2VudC9saWIvY2xpZW50LmpzIiwibm9kZV9tb2R1bGVzL3N1cGVyYWdlbnQvbGliL2lzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcmFnZW50L2xpYi9yZXF1ZXN0LWJhc2UuanMiLCJub2RlX21vZHVsZXMvc3VwZXJhZ2VudC9saWIvcmVzcG9uc2UtYmFzZS5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcmFnZW50L2xpYi91dGlscy5qcyIsInBhY2thZ2UuanNvbiIsInNyYy9kYXRhL2FiYnJldmlhdGlvbnMuanMiLCJzcmMvZGF0YS9pMThuLmpzIiwic3JjL2RhdGEvbGFuZ3VhZ2VzLmpzIiwic3JjL2RhdGEvc2l0ZV9tYXAuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbGliL2NvbnZlcnRHZW8uanMiLCJzcmMvbGliL2ZldGNoX3RleHQuanMiLCJzcmMvbGliL2hlbHBlcnMuanMiLCJzcmMvbGliL3JlY3Vyc2l2ZV9tYXRjaC5qcyIsInNyYy9vdXRwdXQvaHRtbC9pbmRleC5qcyIsInNyYy9vdXRwdXQvaHRtbC9pbmZvYm94LmpzIiwic3JjL291dHB1dC9odG1sL3NlbnRlbmNlLmpzIiwic3JjL291dHB1dC9odG1sL3RhYmxlLmpzIiwic3JjL291dHB1dC9saWIuanMiLCJzcmMvb3V0cHV0L21hcmtkb3duL2luZGV4LmpzIiwic3JjL291dHB1dC9tYXJrZG93bi9pbmZvYm94LmpzIiwic3JjL291dHB1dC9tYXJrZG93bi9wYWQuanMiLCJzcmMvb3V0cHV0L21hcmtkb3duL3NlbnRlbmNlLmpzIiwic3JjL291dHB1dC9tYXJrZG93bi90YWJsZS5qcyIsInNyYy9wYXJzZS9jYXRlZ29yaWVzLmpzIiwic3JjL3BhcnNlL2luZGV4LmpzIiwic3JjL3BhcnNlL2luZm9ib3gvY2l0YXRpb24uanMiLCJzcmMvcGFyc2UvaW5mb2JveC9pbmRleC5qcyIsInNyYy9wYXJzZS9pbmZvYm94L2luZm9ib3guanMiLCJzcmMvcGFyc2UvcGFnZS9kaXNhbWJpZy5qcyIsInNyYy9wYXJzZS9wYWdlL3JlZGlyZWN0cy5qcyIsInNyYy9wYXJzZS9wb3N0UHJvY2Vzcy9pbmRleC5qcyIsInNyYy9wYXJzZS9wcmVQcm9jZXNzL2Nvb3JkaW5hdGVzLmpzIiwic3JjL3BhcnNlL3ByZVByb2Nlc3MvaW5kZXguanMiLCJzcmMvcGFyc2UvcHJlUHJvY2Vzcy9raWxsX3htbC5qcyIsInNyYy9wYXJzZS9wcmVQcm9jZXNzL3dvcmRfdGVtcGxhdGVzLmpzIiwic3JjL3BhcnNlL3NlY3Rpb24vaGVhZGluZy5qcyIsInNyYy9wYXJzZS9zZWN0aW9uL2ltYWdlL2ltYWdlLmpzIiwic3JjL3BhcnNlL3NlY3Rpb24vaW1hZ2UvaW5kZXguanMiLCJzcmMvcGFyc2Uvc2VjdGlvbi9pbmRleC5qcyIsInNyYy9wYXJzZS9zZWN0aW9uL2xpc3QuanMiLCJzcmMvcGFyc2Uvc2VjdGlvbi9zZWN0aW9uX3RlbXBsYXRlcy5qcyIsInNyYy9wYXJzZS9zZWN0aW9uL3NlbnRlbmNlL2Zvcm1hdHRpbmcuanMiLCJzcmMvcGFyc2Uvc2VjdGlvbi9zZW50ZW5jZS9pbmRleC5qcyIsInNyYy9wYXJzZS9zZWN0aW9uL3NlbnRlbmNlL2xpbmtzLmpzIiwic3JjL3BhcnNlL3NlY3Rpb24vc2VudGVuY2Uvc2VudGVuY2UtcGFyc2VyLmpzIiwic3JjL3BhcnNlL3NlY3Rpb24vc2VudGVuY2UvdGVtcGxhdGVzL2RhdGVzLmpzIiwic3JjL3BhcnNlL3NlY3Rpb24vc2VudGVuY2UvdGVtcGxhdGVzL2RlbHRhX2RhdGUuanMiLCJzcmMvcGFyc2Uvc2VjdGlvbi9zZW50ZW5jZS90ZW1wbGF0ZXMvaW5kZXguanMiLCJzcmMvcGFyc2Uvc2VjdGlvbi9zZW50ZW5jZS90ZW1wbGF0ZXMvcGFyc2Vycy5qcyIsInNyYy9wYXJzZS9zZWN0aW9uL3NlbnRlbmNlL3RlbXBsYXRlcy90ZW1wbGF0ZXMuanMiLCJzcmMvcGFyc2Uvc2VjdGlvbi90YWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcnVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4NUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdHJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFEQTtBQUNBLE9BQU8sT0FBUCxHQUFpQixDQUNmLElBRGUsRUFFZixJQUZlLEVBR2YsS0FIZSxFQUlmLElBSmUsRUFLZixJQUxlLEVBTWYsTUFOZSxFQU9mLElBUGUsRUFRZixLQVJlLEVBU2YsTUFUZSxFQVVmLE9BVmUsRUFXZixLQVhlLEVBWWYsS0FaZSxFQWFmLE1BYmUsRUFjZixNQWRlLEVBZWYsS0FmZSxFQWdCZixLQWhCZSxFQWlCZixLQWpCZSxFQWtCZixLQWxCZSxFQW1CZixJQW5CZSxFQW9CZixNQXBCZSxFQXFCZixLQXJCZSxFQXNCZixNQXRCZSxFQXVCZixLQXZCZSxFQXdCZixLQXhCZSxFQXlCZixLQXpCZSxFQTBCZixNQTFCZSxFQTJCZixNQTNCZSxFQTRCZixNQTVCZSxFQTZCZixNQTdCZSxFQThCZixLQTlCZSxFQStCZixLQS9CZSxFQWdDZixJQWhDZSxFQWlDZixNQWpDZSxFQWtDZixLQWxDZSxFQW1DZixJQW5DZSxFQW9DZixLQXBDZSxFQXFDZixNQXJDZSxFQXNDZixJQXRDZSxFQXVDZixJQXZDZSxFQXdDZixNQXhDZSxFQXlDZixLQXpDZSxFQTBDZixJQTFDZSxFQTJDZixJQTNDZSxFQTRDZixNQTVDZSxFQTZDZixJQTdDZSxFQThDZixJQTlDZSxFQStDZixJQS9DZSxFQWdEZixLQWhEZSxFQWlEZixJQWpEZSxFQWtEZixJQWxEZSxFQW1EZixJQW5EZSxFQW9EZixLQXBEZSxFQXFEZixLQXJEZSxFQXNEZixLQXREZSxFQXVEZixNQXZEZSxFQXdEZixLQXhEZSxFQXlEZixLQXpEZSxFQTBEZixPQTFEZSxFQTJEZixLQTNEZSxFQTREZixNQTVEZSxFQTZEZixNQTdEZSxFQThEZixLQTlEZSxFQStEZixLQS9EZSxFQWdFZixLQWhFZSxFQWlFZixJQWpFZSxFQWtFZixLQWxFZSxFQW1FZixJQW5FZSxFQW9FZixLQXBFZSxFQXFFZixLQXJFZSxFQXNFZixJQXRFZSxFQXVFZixLQXZFZSxFQXdFZixNQXhFZSxFQXlFZixLQXpFZSxFQTBFZixJQTFFZSxFQTJFZixJQTNFZSxFQTRFZixJQTVFZSxFQTZFZixJQTdFZSxFQThFZixNQTlFZSxFQStFZixNQS9FZSxFQWdGZixNQWhGZSxFQWlGZixNQWpGZSxFQWtGZixJQWxGZSxFQW1GZixNQW5GZSxFQW9GZixLQXBGZSxFQXFGZixNQXJGZSxFQXNGZixLQXRGZSxFQXVGZixLQXZGZSxFQXdGZixNQXhGZSxFQXlGZixJQXpGZSxFQTBGZixLQTFGZSxFQTJGZixPQTNGZSxFQTRGZixNQTVGZSxFQTZGZixJQTdGZSxFQThGZixLQTlGZSxFQStGZixNQS9GZSxFQWdHZixLQWhHZSxFQWlHZixJQWpHZSxFQWtHZixJQWxHZSxFQW1HZixJQW5HZSxFQW9HZixNQXBHZSxFQXFHZixLQXJHZSxFQXNHZixNQXRHZSxFQXVHZixJQXZHZSxFQXdHZixLQXhHZSxFQXlHZixPQXpHZSxFQTBHZixNQTFH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Q0EsV0FBUyxPQUFPLEdBQVAsQ0FBVyxVQUFTLEdBQVQsRUFBYztBQUNoQyxXQUFPLFlBQVksR0FBWixDQUFQO0FBQ0QsR0FGUSxDQUFUO0FBR0EsV0FBUyxPQUFPLE1BQVAsQ0FBYyxVQUFDLENBQUQ7QUFBQSxXQUFPLEtBQUssRUFBRSxNQUFGLEdBQVcsQ0FBdkI7QUFBQSxHQUFkLENBQVQ7QUFDQSxNQUFJLE9BQU8sTUFBUCxHQUFnQixDQUFwQixFQUF1QjtBQUNyQixNQUFFLE1BQUYsR0FBVyxNQUFYO0FBQ0Q7QUFDRDtBQUNBLFNBQU8sS0FBSyxPQUFMLENBQWEsU0FBYixFQUF3QixFQUF4QixDQUFQO0FBQ0EsU0FBTyxJQUFQO0FBQ0QsQ0FaRDtBQWFBLE9BQU8sT0FBUCxHQUFpQixVQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcclxuLyoqXHJcbiAqIEV4cG9zZSBgRW1pdHRlcmAuXHJcbiAqL1xyXG5cclxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgbW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xyXG59XHJcblxyXG4vKipcclxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXHJcbiAqXHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gRW1pdHRlcihvYmopIHtcclxuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBNaXhpbiB0aGUgZW1pdHRlciBwcm9wZXJ0aWVzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXHJcbiAqIEByZXR1cm4ge09iamVjdH1cclxuICogQGFwaSBwcml2YXRlXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gbWl4aW4ob2JqKSB7XHJcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XHJcbiAgICBvYmpba2V5XSA9IEVtaXR0ZXIucHJvdG90eXBlW2tleV07XHJcbiAgfVxyXG4gIHJldHVybiBvYmo7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cclxuICogQHJldHVybiB7RW1pdHRlcn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuICAodGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gfHwgW10pXHJcbiAgICAucHVzaChmbik7XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXHJcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xyXG4gIGZ1bmN0aW9uIG9uKCkge1xyXG4gICAgdGhpcy5vZmYoZXZlbnQsIG9uKTtcclxuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgfVxyXG5cclxuICBvbi5mbiA9IGZuO1xyXG4gIHRoaXMub24oZXZlbnQsIG9uKTtcclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxyXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cclxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxyXG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxyXG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcblxyXG4gIC8vIGFsbFxyXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvLyBzcGVjaWZpYyBldmVudFxyXG4gIHZhciBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO1xyXG4gIGlmICghY2FsbGJhY2tzKSByZXR1cm4gdGhpcztcclxuXHJcbiAgLy8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xyXG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICAvLyByZW1vdmUgc3BlY2lmaWMgaGFuZGxlclxyXG4gIHZhciBjYjtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xyXG4gICAgY2IgPSBjYWxsYmFja3NbaV07XHJcbiAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xyXG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogRW1pdCBgZXZlbnRgIHdpdGggdGhlIGdpdmVuIGFyZ3MuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcGFyYW0ge01peGVkfSAuLi5cclxuICogQHJldHVybiB7RW1pdHRlcn1cclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxyXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdO1xyXG5cclxuICBpZiAoY2FsbGJhY2tzKSB7XHJcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICAgIGNhbGxiYWNrc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJldHVybiBhcnJheSBvZiBjYWxsYmFja3MgZm9yIGBldmVudGAuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcmV0dXJuIHtBcnJheX1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG4gIHJldHVybiB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIHRoaXMgZW1pdHRlciBoYXMgYGV2ZW50YCBoYW5kbGVycy5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gIHJldHVybiAhISB0aGlzLmxpc3RlbmVycyhldmVudCkubGVuZ3RoO1xyXG59O1xyXG4iLCIvKipcbiAqIGpzaGFzaGVzIC0gaHR0cHM6Ly9naXRodWIuY29tL2gybm9uL2pzaGFzaGVzXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgXCJOZXcgQlNEXCIgbGljZW5zZVxuICpcbiAqIEFsZ29yaXRobXMgc3BlY2lmaWNhdGlvbjpcbiAqXG4gKiBNRDUgLSBodHRwOi8vd3d3LmlldGYub3JnL3JmYy9yZmMxMzIxLnR4dFxuICogUklQRU1ELTE2MCAtIGh0dHA6Ly9ob21lcy5lc2F0Lmt1bGV1dmVuLmJlL35ib3NzZWxhZS9yaXBlbWQxNjAuaHRtbFxuICogU0hBMSAgIC0gaHR0cDovL2NzcmMubmlzdC5nb3YvcHVibGljYXRpb25zL2ZpcHMvZmlwczE4MC00L2ZpcHMtMTgwLTQucGRmXG4gKiBTSEEyNTYgLSBodHRwOi8vY3NyYy5uaXN0Lmdvdi9wdWJsaWNhdGlvbnMvZmlwcy9maXBzMTgwLTQvZmlwcy0xODAtNC5wZGZcbiAqIFNIQTUxMiAtIGh0dHA6Ly9jc3JjLm5pc3QuZ292L3B1YmxpY2F0aW9ucy9maXBzL2ZpcHMxODAtNC9maXBzLTE4MC00LnBkZlxuICogSE1BQyAtIGh0dHA6Ly93d3cuaWV0Zi5vcmcvcmZjL3JmYzIxMDQudHh0XG4gKi9cbihmdW5jdGlvbigpIHtcbiAgdmFyIEhhc2hlcztcblxuICBmdW5jdGlvbiB1dGY4RW5jb2RlKHN0cikge1xuICAgIHZhciB4LCB5LCBvdXRwdXQgPSAnJyxcbiAgICAgIGkgPSAtMSxcbiAgICAgIGw7XG5cbiAgICBpZiAoc3RyICYmIHN0ci5sZW5ndGgpIHtcbiAgICAgIGwgPSBzdHIubGVuZ3RoO1xuICAgICAgd2hpbGUgKChpICs9IDEpIDwgbCkge1xuICAgICAgICAvKiBEZWNvZGUgdXRmLTE2IHN1cnJvZ2F0ZSBwYWlycyAqL1xuICAgICAgICB4ID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIHkgPSBpICsgMSA8IGwgPyBzdHIuY2hhckNvZGVBdChpICsgMSkgOiAwO1xuICAgICAgICBpZiAoMHhEODAwIDw9IHggJiYgeCA8PSAweERCRkYgJiYgMHhEQzAwIDw9IHkgJiYgeSA8PSAweERGRkYpIHtcbiAgICAgICAgICB4ID0gMHgxMDAwMCArICgoeCAmIDB4MDNGRikgPDwgMTApICsgKHkgJiAweDAzRkYpO1xuICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICAvKiBFbmNvZGUgb3V0cHV0IGFzIHV0Zi04ICovXG4gICAgICAgIGlmICh4IDw9IDB4N0YpIHtcbiAgICAgICAgICBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSh4KTtcbiAgICAgICAgfSBlbHNlIGlmICh4IDw9IDB4N0ZGKSB7XG4gICAgICAgICAgb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhDMCB8ICgoeCA+Pj4gNikgJiAweDFGKSxcbiAgICAgICAgICAgIDB4ODAgfCAoeCAmIDB4M0YpKTtcbiAgICAgICAgfSBlbHNlIGlmICh4IDw9IDB4RkZGRikge1xuICAgICAgICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RTAgfCAoKHggPj4+IDEyKSAmIDB4MEYpLFxuICAgICAgICAgICAgMHg4MCB8ICgoeCA+Pj4gNikgJiAweDNGKSxcbiAgICAgICAgICAgIDB4ODAgfCAoeCAmIDB4M0YpKTtcbiAgICAgICAgfSBlbHNlIGlmICh4IDw9IDB4MUZGRkZGKSB7XG4gICAgICAgICAgb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGMCB8ICgoeCA+Pj4gMTgpICYgMHgwNyksXG4gICAgICAgICAgICAweDgwIHwgKCh4ID4+PiAxMikgJiAweDNGKSxcbiAgICAgICAgICAgIDB4ODAgfCAoKHggPj4+IDYpICYgMHgzRiksXG4gICAgICAgICAgICAweDgwIHwgKHggJiAweDNGKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHV0ZjhEZWNvZGUoc3RyKSB7XG4gICAgdmFyIGksIGFjLCBjMSwgYzIsIGMzLCBhcnIgPSBbXSxcbiAgICAgIGw7XG4gICAgaSA9IGFjID0gYzEgPSBjMiA9IGMzID0gMDtcblxuICAgIGlmIChzdHIgJiYgc3RyLmxlbmd0aCkge1xuICAgICAgbCA9IHN0ci5sZW5ndGg7XG4gICAgICBzdHIgKz0gJyc7XG5cbiAgICAgIHdoaWxlIChpIDwgbCkge1xuICAgICAgICBjMSA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBhYyArPSAxO1xuICAgICAgICBpZiAoYzEgPCAxMjgpIHtcbiAgICAgICAgICBhcnJbYWNdID0gU3RyaW5nLmZyb21DaGFyQ29kZShjMSk7XG4gICAgICAgICAgaSArPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKGMxID4gMTkxICYmIGMxIDwgMjI0KSB7XG4gICAgICAgICAgYzIgPSBzdHIuY2hhckNvZGVBdChpICsgMSk7XG4gICAgICAgICAgYXJyW2FjXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjMSAmIDMxKSA8PCA2KSB8IChjMiAmIDYzKSk7XG4gICAgICAgICAgaSArPSAyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGMyID0gc3RyLmNoYXJDb2RlQXQoaSArIDEpO1xuICAgICAgICAgIGMzID0gc3RyLmNoYXJDb2RlQXQoaSArIDIpO1xuICAgICAgICAgIGFyclthY10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYzEgJiAxNSkgPDwgMTIpIHwgKChjMiAmIDYzKSA8PCA2KSB8IChjMyAmIDYzKSk7XG4gICAgICAgICAgaSArPSAzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnIuam9pbignJyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGludGVnZXJzLCB3cmFwcGluZyBhdCAyXjMyLiBUaGlzIHVzZXMgMTYtYml0IG9wZXJhdGlvbnMgaW50ZXJuYWxseVxuICAgKiB0byB3b3JrIGFyb3VuZCBidWdzIGluIHNvbWUgSlMgaW50ZXJwcmV0ZXJzLlxuICAgKi9cblxuICBmdW5jdGlvbiBzYWZlX2FkZCh4LCB5KSB7XG4gICAgdmFyIGxzdyA9ICh4ICYgMHhGRkZGKSArICh5ICYgMHhGRkZGKSxcbiAgICAgIG1zdyA9ICh4ID4+IDE2KSArICh5ID4+IDE2KSArIChsc3cgPj4gMTYpO1xuICAgIHJldHVybiAobXN3IDw8IDE2KSB8IChsc3cgJiAweEZGRkYpO1xuICB9XG5cbiAgLyoqXG4gICAqIEJpdHdpc2Ugcm90YXRlIGEgMzItYml0IG51bWJlciB0byB0aGUgbGVmdC5cbiAgICovXG5cbiAgZnVuY3Rpb24gYml0X3JvbChudW0sIGNudCkge1xuICAgIHJldHVybiAobnVtIDw8IGNudCkgfCAobnVtID4+PiAoMzIgLSBjbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGEgcmF3IHN0cmluZyB0byBhIGhleCBzdHJpbmdcbiAgICovXG5cbiAgZnVuY3Rpb24gcnN0cjJoZXgoaW5wdXQsIGhleGNhc2UpIHtcbiAgICB2YXIgaGV4X3RhYiA9IGhleGNhc2UgPyAnMDEyMzQ1Njc4OUFCQ0RFRicgOiAnMDEyMzQ1Njc4OWFiY2RlZicsXG4gICAgICBvdXRwdXQgPSAnJyxcbiAgICAgIHgsIGkgPSAwLFxuICAgICAgbCA9IGlucHV0Lmxlbmd0aDtcbiAgICBmb3IgKDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgeCA9IGlucHV0LmNoYXJDb2RlQXQoaSk7XG4gICAgICBvdXRwdXQgKz0gaGV4X3RhYi5jaGFyQXQoKHggPj4+IDQpICYgMHgwRikgKyBoZXhfdGFiLmNoYXJBdCh4ICYgMHgwRik7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICAvKipcbiAgICogRW5jb2RlIGEgc3RyaW5nIGFzIHV0Zi0xNlxuICAgKi9cblxuICBmdW5jdGlvbiBzdHIycnN0cl91dGYxNmxlKGlucHV0KSB7XG4gICAgdmFyIGksIGwgPSBpbnB1dC5sZW5ndGgsXG4gICAgICBvdXRwdXQgPSAnJztcbiAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShpbnB1dC5jaGFyQ29kZUF0KGkpICYgMHhGRiwgKGlucHV0LmNoYXJDb2RlQXQoaSkgPj4+IDgpICYgMHhGRik7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICBmdW5jdGlvbiBzdHIycnN0cl91dGYxNmJlKGlucHV0KSB7XG4gICAgdmFyIGksIGwgPSBpbnB1dC5sZW5ndGgsXG4gICAgICBvdXRwdXQgPSAnJztcbiAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoaW5wdXQuY2hhckNvZGVBdChpKSA+Pj4gOCkgJiAweEZGLCBpbnB1dC5jaGFyQ29kZUF0KGkpICYgMHhGRik7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBhbiBhcnJheSBvZiBiaWctZW5kaWFuIHdvcmRzIHRvIGEgc3RyaW5nXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGJpbmIycnN0cihpbnB1dCkge1xuICAgIHZhciBpLCBsID0gaW5wdXQubGVuZ3RoICogMzIsXG4gICAgICBvdXRwdXQgPSAnJztcbiAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSA4KSB7XG4gICAgICBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoaW5wdXRbaSA+PiA1XSA+Pj4gKDI0IC0gaSAlIDMyKSkgJiAweEZGKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGFuIGFycmF5IG9mIGxpdHRsZS1lbmRpYW4gd29yZHMgdG8gYSBzdHJpbmdcbiAgICovXG5cbiAgZnVuY3Rpb24gYmlubDJyc3RyKGlucHV0KSB7XG4gICAgdmFyIGksIGwgPSBpbnB1dC5sZW5ndGggKiAzMixcbiAgICAgIG91dHB1dCA9ICcnO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDgpIHtcbiAgICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChpbnB1dFtpID4+IDVdID4+PiAoaSAlIDMyKSkgJiAweEZGKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGEgcmF3IHN0cmluZyB0byBhbiBhcnJheSBvZiBsaXR0bGUtZW5kaWFuIHdvcmRzXG4gICAqIENoYXJhY3RlcnMgPjI1NSBoYXZlIHRoZWlyIGhpZ2gtYnl0ZSBzaWxlbnRseSBpZ25vcmVkLlxuICAgKi9cblxuICBmdW5jdGlvbiByc3RyMmJpbmwoaW5wdXQpIHtcbiAgICB2YXIgaSwgbCA9IGlucHV0Lmxlbmd0aCAqIDgsXG4gICAgICBvdXRwdXQgPSBBcnJheShpbnB1dC5sZW5ndGggPj4gMiksXG4gICAgICBsbyA9IG91dHB1dC5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxvOyBpICs9IDEpIHtcbiAgICAgIG91dHB1dFtpXSA9IDA7XG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDgpIHtcbiAgICAgIG91dHB1dFtpID4+IDVdIHw9IChpbnB1dC5jaGFyQ29kZUF0KGkgLyA4KSAmIDB4RkYpIDw8IChpICUgMzIpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYSByYXcgc3RyaW5nIHRvIGFuIGFycmF5IG9mIGJpZy1lbmRpYW4gd29yZHNcbiAgICogQ2hhcmFjdGVycyA+MjU1IGhhdmUgdGhlaXIgaGlnaC1ieXRlIHNpbGVudGx5IGlnbm9yZWQuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJzdHIyYmluYihpbnB1dCkge1xuICAgIHZhciBpLCBsID0gaW5wdXQubGVuZ3RoICogOCxcbiAgICAgIG91dHB1dCA9IEFycmF5KGlucHV0Lmxlbmd0aCA+PiAyKSxcbiAgICAgIGxvID0gb3V0cHV0Lmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbG87IGkgKz0gMSkge1xuICAgICAgb3V0cHV0W2ldID0gMDtcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gOCkge1xuICAgICAgb3V0cHV0W2kgPj4gNV0gfD0gKGlucHV0LmNoYXJDb2RlQXQoaSAvIDgpICYgMHhGRikgPDwgKDI0IC0gaSAlIDMyKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGEgcmF3IHN0cmluZyB0byBhbiBhcmJpdHJhcnkgc3RyaW5nIGVuY29kaW5nXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJzdHIyYW55KGlucHV0LCBlbmNvZGluZykge1xuICAgIHZhciBkaXZpc29yID0gZW5jb2RpbmcubGVuZ3RoLFxuICAgICAgcmVtYWluZGVycyA9IEFycmF5KCksXG4gICAgICBpLCBxLCB4LCBsZCwgcXVvdGllbnQsIGRpdmlkZW5kLCBvdXRwdXQsIGZ1bGxfbGVuZ3RoO1xuXG4gICAgLyogQ29udmVydCB0byBhbiBhcnJheSBvZiAxNi1iaXQgYmlnLWVuZGlhbiB2YWx1ZXMsIGZvcm1pbmcgdGhlIGRpdmlkZW5kICovXG4gICAgZGl2aWRlbmQgPSBBcnJheShNYXRoLmNlaWwoaW5wdXQubGVuZ3RoIC8gMikpO1xuICAgIGxkID0gZGl2aWRlbmQubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZDsgaSArPSAxKSB7XG4gICAgICBkaXZpZGVuZFtpXSA9IChpbnB1dC5jaGFyQ29kZUF0KGkgKiAyKSA8PCA4KSB8IGlucHV0LmNoYXJDb2RlQXQoaSAqIDIgKyAxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXBlYXRlZGx5IHBlcmZvcm0gYSBsb25nIGRpdmlzaW9uLiBUaGUgYmluYXJ5IGFycmF5IGZvcm1zIHRoZSBkaXZpZGVuZCxcbiAgICAgKiB0aGUgbGVuZ3RoIG9mIHRoZSBlbmNvZGluZyBpcyB0aGUgZGl2aXNvci4gT25jZSBjb21wdXRlZCwgdGhlIHF1b3RpZW50XG4gICAgICogZm9ybXMgdGhlIGRpdmlkZW5kIGZvciB0aGUgbmV4dCBzdGVwLiBXZSBzdG9wIHdoZW4gdGhlIGRpdmlkZW5kIGlzIHplckhhc2hlcy5cbiAgICAgKiBBbGwgcmVtYWluZGVycyBhcmUgc3RvcmVkIGZvciBsYXRlciB1c2UuXG4gICAgICovXG4gICAgd2hpbGUgKGRpdmlkZW5kLmxlbmd0aCA+IDApIHtcbiAgICAgIHF1b3RpZW50ID0gQXJyYXkoKTtcbiAgICAgIHggPSAwO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGRpdmlkZW5kLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIHggPSAoeCA8PCAxNikgKyBkaXZpZGVuZFtpXTtcbiAgICAgICAgcSA9IE1hdGguZmxvb3IoeCAvIGRpdmlzb3IpO1xuICAgICAgICB4IC09IHEgKiBkaXZpc29yO1xuICAgICAgICBpZiAocXVvdGllbnQubGVuZ3RoID4gMCB8fCBxID4gMCkge1xuICAgICAgICAgIHF1b3RpZW50W3F1b3RpZW50Lmxlbmd0aF0gPSBxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZW1haW5kZXJzW3JlbWFpbmRlcnMubGVuZ3RoXSA9IHg7XG4gICAgICBkaXZpZGVuZCA9IHF1b3RpZW50O1xuICAgIH1cblxuICAgIC8qIENvbnZlcnQgdGhlIHJlbWFpbmRlcnMgdG8gdGhlIG91dHB1dCBzdHJpbmcgKi9cbiAgICBvdXRwdXQgPSAnJztcbiAgICBmb3IgKGkgPSByZW1haW5kZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBvdXRwdXQgKz0gZW5jb2RpbmcuY2hhckF0KHJlbWFpbmRlcnNbaV0pO1xuICAgIH1cblxuICAgIC8qIEFwcGVuZCBsZWFkaW5nIHplcm8gZXF1aXZhbGVudHMgKi9cbiAgICBmdWxsX2xlbmd0aCA9IE1hdGguY2VpbChpbnB1dC5sZW5ndGggKiA4IC8gKE1hdGgubG9nKGVuY29kaW5nLmxlbmd0aCkgLyBNYXRoLmxvZygyKSkpO1xuICAgIGZvciAoaSA9IG91dHB1dC5sZW5ndGg7IGkgPCBmdWxsX2xlbmd0aDsgaSArPSAxKSB7XG4gICAgICBvdXRwdXQgPSBlbmNvZGluZ1swXSArIG91dHB1dDtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGEgcmF3IHN0cmluZyB0byBhIGJhc2UtNjQgc3RyaW5nXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJzdHIyYjY0KGlucHV0LCBiNjRwYWQpIHtcbiAgICB2YXIgdGFiID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nLFxuICAgICAgb3V0cHV0ID0gJycsXG4gICAgICBsZW4gPSBpbnB1dC5sZW5ndGgsXG4gICAgICBpLCBqLCB0cmlwbGV0O1xuICAgIGI2NHBhZCA9IGI2NHBhZCB8fCAnPSc7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAzKSB7XG4gICAgICB0cmlwbGV0ID0gKGlucHV0LmNoYXJDb2RlQXQoaSkgPDwgMTYpIHwgKGkgKyAxIDwgbGVuID8gaW5wdXQuY2hhckNvZGVBdChpICsgMSkgPDwgOCA6IDApIHwgKGkgKyAyIDwgbGVuID8gaW5wdXQuY2hhckNvZGVBdChpICsgMikgOiAwKTtcbiAgICAgIGZvciAoaiA9IDA7IGogPCA0OyBqICs9IDEpIHtcbiAgICAgICAgaWYgKGkgKiA4ICsgaiAqIDYgPiBpbnB1dC5sZW5ndGggKiA4KSB7XG4gICAgICAgICAgb3V0cHV0ICs9IGI2NHBhZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXRwdXQgKz0gdGFiLmNoYXJBdCgodHJpcGxldCA+Pj4gNiAqICgzIC0gaikpICYgMHgzRik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIEhhc2hlcyA9IHtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gdmVyc2lvblxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIFZFUlNJT046ICcxLjAuNicsXG4gICAgLyoqXG4gICAgICogQG1lbWJlciBIYXNoZXNcbiAgICAgKiBAY2xhc3MgQmFzZTY0XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgQmFzZTY0OiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIHByaXZhdGUgcHJvcGVydGllc1xuICAgICAgdmFyIHRhYiA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJyxcbiAgICAgICAgcGFkID0gJz0nLCAvLyBkZWZhdWx0IHBhZCBhY2NvcmRpbmcgd2l0aCB0aGUgUkZDIHN0YW5kYXJkXG4gICAgICAgIHVybCA9IGZhbHNlLCAvLyBVUkwgZW5jb2Rpbmcgc3VwcG9ydCBAdG9kb1xuICAgICAgICB1dGY4ID0gdHJ1ZTsgLy8gYnkgZGVmYXVsdCBlbmFibGUgVVRGLTggc3VwcG9ydCBlbmNvZGluZ1xuXG4gICAgICAvLyBwdWJsaWMgbWV0aG9kIGZvciBlbmNvZGluZ1xuICAgICAgdGhpcy5lbmNvZGUgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgaSwgaiwgdHJpcGxldCxcbiAgICAgICAgICBvdXRwdXQgPSAnJyxcbiAgICAgICAgICBsZW4gPSBpbnB1dC5sZW5ndGg7XG5cbiAgICAgICAgcGFkID0gcGFkIHx8ICc9JztcbiAgICAgICAgaW5wdXQgPSAodXRmOCkgPyB1dGY4RW5jb2RlKGlucHV0KSA6IGlucHV0O1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMykge1xuICAgICAgICAgIHRyaXBsZXQgPSAoaW5wdXQuY2hhckNvZGVBdChpKSA8PCAxNikgfCAoaSArIDEgPCBsZW4gPyBpbnB1dC5jaGFyQ29kZUF0KGkgKyAxKSA8PCA4IDogMCkgfCAoaSArIDIgPCBsZW4gPyBpbnB1dC5jaGFyQ29kZUF0KGkgKyAyKSA6IDApO1xuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCA0OyBqICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChpICogOCArIGogKiA2ID4gbGVuICogOCkge1xuICAgICAgICAgICAgICBvdXRwdXQgKz0gcGFkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgb3V0cHV0ICs9IHRhYi5jaGFyQXQoKHRyaXBsZXQgPj4+IDYgKiAoMyAtIGopKSAmIDB4M0YpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgfTtcblxuICAgICAgLy8gcHVibGljIG1ldGhvZCBmb3IgZGVjb2RpbmdcbiAgICAgIHRoaXMuZGVjb2RlID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgLy8gdmFyIGI2NCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPSc7XG4gICAgICAgIHZhciBpLCBvMSwgbzIsIG8zLCBoMSwgaDIsIGgzLCBoNCwgYml0cywgYWMsXG4gICAgICAgICAgZGVjID0gJycsXG4gICAgICAgICAgYXJyID0gW107XG4gICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpID0gYWMgPSAwO1xuICAgICAgICBpbnB1dCA9IGlucHV0LnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXCcgKyBwYWQsICdnaScpLCAnJyk7IC8vIHVzZSAnPSdcbiAgICAgICAgLy9pbnB1dCArPSAnJztcblxuICAgICAgICBkbyB7IC8vIHVucGFjayBmb3VyIGhleGV0cyBpbnRvIHRocmVlIG9jdGV0cyB1c2luZyBpbmRleCBwb2ludHMgaW4gYjY0XG4gICAgICAgICAgaDEgPSB0YWIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSArPSAxKSk7XG4gICAgICAgICAgaDIgPSB0YWIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSArPSAxKSk7XG4gICAgICAgICAgaDMgPSB0YWIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSArPSAxKSk7XG4gICAgICAgICAgaDQgPSB0YWIuaW5kZXhPZihpbnB1dC5jaGFyQXQoaSArPSAxKSk7XG5cbiAgICAgICAgICBiaXRzID0gaDEgPDwgMTggfCBoMiA8PCAxMiB8IGgzIDw8IDYgfCBoNDtcblxuICAgICAgICAgIG8xID0gYml0cyA+PiAxNiAmIDB4ZmY7XG4gICAgICAgICAgbzIgPSBiaXRzID4+IDggJiAweGZmO1xuICAgICAgICAgIG8zID0gYml0cyAmIDB4ZmY7XG4gICAgICAgICAgYWMgKz0gMTtcblxuICAgICAgICAgIGlmIChoMyA9PT0gNjQpIHtcbiAgICAgICAgICAgIGFyclthY10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKG8xKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGg0ID09PSA2NCkge1xuICAgICAgICAgICAgYXJyW2FjXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUobzEsIG8yKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJyW2FjXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUobzEsIG8yLCBvMyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlIChpIDwgaW5wdXQubGVuZ3RoKTtcblxuICAgICAgICBkZWMgPSBhcnIuam9pbignJyk7XG4gICAgICAgIGRlYyA9ICh1dGY4KSA/IHV0ZjhEZWNvZGUoZGVjKSA6IGRlYztcblxuICAgICAgICByZXR1cm4gZGVjO1xuICAgICAgfTtcblxuICAgICAgLy8gc2V0IGN1c3RvbSBwYWQgc3RyaW5nXG4gICAgICB0aGlzLnNldFBhZCA9IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICBwYWQgPSBzdHIgfHwgcGFkO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgICAvLyBzZXQgY3VzdG9tIHRhYiBzdHJpbmcgY2hhcmFjdGVyc1xuICAgICAgdGhpcy5zZXRUYWIgPSBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgdGFiID0gc3RyIHx8IHRhYjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgICAgdGhpcy5zZXRVVEY4ID0gZnVuY3Rpb24oYm9vbCkge1xuICAgICAgICBpZiAodHlwZW9mIGJvb2wgPT09ICdib29sZWFuJykge1xuICAgICAgICAgIHV0ZjggPSBib29sO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ1JDLTMyIGNhbGN1bGF0aW9uXG4gICAgICogQG1lbWJlciBIYXNoZXNcbiAgICAgKiBAbWV0aG9kIENSQzMyXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgSW5wdXQgU3RyaW5nXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIENSQzMyOiBmdW5jdGlvbihzdHIpIHtcbiAgICAgIHZhciBjcmMgPSAwLFxuICAgICAgICB4ID0gMCxcbiAgICAgICAgeSA9IDAsXG4gICAgICAgIHRhYmxlLCBpLCBpVG9wO1xuICAgICAgc3RyID0gdXRmOEVuY29kZShzdHIpO1xuXG4gICAgICB0YWJsZSA9IFtcbiAgICAgICAgJzAwMDAwMDAwIDc3MDczMDk2IEVFMEU2MTJDIDk5MDk1MUJBIDA3NkRDNDE5IDcwNkFGNDhGIEU5NjNBNTM1IDlFNjQ5NUEzIDBFREI4ODMyICcsXG4gICAgICAgICc3OURDQjhBNCBFMEQ1RTkxRSA5N0QyRDk4OCAwOUI2NEMyQiA3RUIxN0NCRCBFN0I4MkQwNyA5MEJGMUQ5MSAxREI3MTA2NCA2QUIwMjBGMiBGM0I5NzE0OCAnLFxuICAgICAgICAnODRCRTQxREUgMUFEQUQ0N0QgNkREREU0RUIgRjRENEI1NTEgODNEMzg1QzcgMTM2Qzk4NTYgNjQ2QkE4QzAgRkQ2MkY5N0EgOEE2NUM5RUMgMTQwMTVDNEYgJyxcbiAgICAgICAgJzYzMDY2Q0Q5IEZBMEYzRDYzIDhEMDgwREY1IDNCNkUyMEM4IDRDNjkxMDVFIEQ1NjA0MUU0IEEyNjc3MTcyIDNDMDNFNEQxIDRCMDRENDQ3IEQyMEQ4NUZEICcsXG4gICAgICAgICdBNTBBQjU2QiAzNUI1QThGQSA0MkIyOTg2QyBEQkJCQzlENiBBQ0JDRjk0MCAzMkQ4NkNFMyA0NURGNUM3NSBEQ0Q2MERDRiBBQkQxM0Q1OSAyNkQ5MzBBQyAnLFxuICAgICAgICAnNTFERTAwM0EgQzhENzUxODAgQkZEMDYxMTYgMjFCNEY0QjUgNTZCM0M0MjMgQ0ZCQTk1OTkgQjhCREE1MEYgMjgwMkI4OUUgNUYwNTg4MDggQzYwQ0Q5QjIgJyxcbiAgICAgICAgJ0IxMEJFOTI0IDJGNkY3Qzg3IDU4Njg0QzExIEMxNjExREFCIEI2NjYyRDNEIDc2REM0MTkwIDAxREI3MTA2IDk4RDIyMEJDIEVGRDUxMDJBIDcxQjE4NTg5ICcsXG4gICAgICAgICcwNkI2QjUxRiA5RkJGRTRBNSBFOEI4RDQzMyA3ODA3QzlBMiAwRjAwRjkzNCA5NjA5QTg4RSBFMTBFOTgxOCA3RjZBMERCQiAwODZEM0QyRCA5MTY0NkM5NyAnLFxuICAgICAgICAnRTY2MzVDMDEgNkI2QjUxRjQgMUM2QzYxNjIgODU2NTMwRDggRjI2MjAwNEUgNkMwNjk1RUQgMUIwMUE1N0IgODIwOEY0QzEgRjUwRkM0NTcgNjVCMEQ5QzYgJyxcbiAgICAgICAgJzEyQjdFOTUwIDhCQkVCOEVBIEZDQjk4ODdDIDYyREQxRERGIDE1REEyRDQ5IDhDRDM3Q0YzIEZCRDQ0QzY1IDREQjI2MTU4IDNBQjU1MUNFIEEzQkMwMDc0ICcsXG4gICAgICAgICdENEJCMzBFMiA0QURGQTU0MSAzREQ4OTVENyBBNEQxQzQ2RCBEM0Q2RjRGQiA0MzY5RTk2QSAzNDZFRDlGQyBBRDY3ODg0NiBEQTYwQjhEMCA0NDA0MkQ3MyAnLFxuICAgICAgICAnMzMwMzFERTUgQUEwQTRDNUYgREQwRDdDQzkgNTAwNTcxM0MgMjcwMjQxQUEgQkUwQjEwMTAgQzkwQzIwODYgNTc2OEI1MjUgMjA2Rjg1QjMgQjk2NkQ0MDkgJyxcbiAgICAgICAgJ0NFNjFFNDlGIDVFREVGOTBFIDI5RDlDOTk4IEIwRDA5ODIyIEM3RDdBOEI0IDU5QjMzRDE3IDJFQjQwRDgxIEI3QkQ1QzNCIEMwQkE2Q0FEIEVEQjg4MzIwICcsXG4gICAgICAgICc5QUJGQjNCNiAwM0I2RTIwQyA3NEIxRDI5QSBFQUQ1NDczOSA5REQyNzdBRiAwNERCMjYxNSA3M0RDMTY4MyBFMzYzMEIxMiA5NDY0M0I4NCAwRDZENkEzRSAnLFxuICAgICAgICAnN0E2QTVBQTggRTQwRUNGMEIgOTMwOUZGOUQgMEEwMEFFMjcgN0QwNzlFQjEgRjAwRjkzNDQgODcwOEEzRDIgMUUwMUYyNjggNjkwNkMyRkUgRjc2MjU3NUQgJyxcbiAgICAgICAgJzgwNjU2N0NCIDE5NkMzNjcxIDZFNkIwNkU3IEZFRDQxQjc2IDg5RDMyQkUwIDEwREE3QTVBIDY3REQ0QUNDIEY5QjlERjZGIDhFQkVFRkY5IDE3QjdCRTQzICcsXG4gICAgICAgICc2MEIwOEVENSBENkQ2QTNFOCBBMUQxOTM3RSAzOEQ4QzJDNCA0RkRGRjI1MiBEMUJCNjdGMSBBNkJDNTc2NyAzRkI1MDZERCA0OEIyMzY0QiBEODBEMkJEQSAnLFxuICAgICAgICAnQUYwQTFCNEMgMzYwMzRBRjYgNDEwNDdBNjAgREY2MEVGQzMgQTg2N0RGNTUgMzE2RThFRUYgNDY2OUJFNzkgQ0I2MUIzOEMgQkM2NjgzMUEgMjU2RkQyQTAgJyxcbiAgICAgICAgJzUyNjhFMjM2IENDMEM3Nzk1IEJCMEI0NzAzIDIyMDIxNkI5IDU1MDUyNjJGIEM1QkEzQkJFIEIyQkQwQjI4IDJCQjQ1QTkyIDVDQjM2QTA0IEMyRDdGRkE3ICcsXG4gICAgICAgICdCNUQwQ0YzMSAyQ0Q5OUU4QiA1QkRFQUUxRCA5QjY0QzJCMCBFQzYzRjIyNiA3NTZBQTM5QyAwMjZEOTMwQSA5QzA5MDZBOSBFQjBFMzYzRiA3MjA3Njc4NSAnLFxuICAgICAgICAnMDUwMDU3MTMgOTVCRjRBODIgRTJCODdBMTQgN0JCMTJCQUUgMENCNjFCMzggOTJEMjhFOUIgRTVENUJFMEQgN0NEQ0VGQjcgMEJEQkRGMjEgODZEM0QyRDQgJyxcbiAgICAgICAgJ0YxRDRFMjQyIDY4RERCM0Y4IDFGREE4MzZFIDgxQkUxNkNEIEY2QjkyNjVCIDZGQjA3N0UxIDE4Qjc0Nzc3IDg4MDg1QUU2IEZGMEY2QTcwIDY2MDYzQkNBICcsXG4gICAgICAgICcxMTAxMEI1QyA4RjY1OUVGRiBGODYyQUU2OSA2MTZCRkZEMyAxNjZDQ0Y0NSBBMDBBRTI3OCBENzBERDJFRSA0RTA0ODM1NCAzOTAzQjNDMiBBNzY3MjY2MSAnLFxuICAgICAgICAnRDA2MDE2RjcgNDk2OTQ3NEQgM0U2RTc3REIgQUVEMTZBNEEgRDlENjVBREMgNDBERjBCNjYgMzdEODNCRjAgQTlCQ0FFNTMgREVCQjlFQzUgNDdCMkNGN0YgJyxcbiAgICAgICAgJzMwQjVGRkU5IEJEQkRGMjFDIENBQkFDMjhBIDUzQjM5MzMwIDI0QjRBM0E2IEJBRDAzNjA1IENERDcwNjkzIDU0REU1NzI5IDIzRDk2N0JGIEIzNjY3QTJFICcsXG4gICAgICAgICdDNDYxNEFCOCA1RDY4MUIwMiAyQTZGMkI5NCBCNDBCQkUzNyBDMzBDOEVBMSA1QTA1REYxQiAyRDAyRUY4RCdcbiAgICAgIF0uam9pbignJyk7XG5cbiAgICAgIGNyYyA9IGNyYyBeICgtMSk7XG4gICAgICBmb3IgKGkgPSAwLCBpVG9wID0gc3RyLmxlbmd0aDsgaSA8IGlUb3A7IGkgKz0gMSkge1xuICAgICAgICB5ID0gKGNyYyBeIHN0ci5jaGFyQ29kZUF0KGkpKSAmIDB4RkY7XG4gICAgICAgIHggPSAnMHgnICsgdGFibGUuc3Vic3RyKHkgKiA5LCA4KTtcbiAgICAgICAgY3JjID0gKGNyYyA+Pj4gOCkgXiB4O1xuICAgICAgfVxuICAgICAgLy8gYWx3YXlzIHJldHVybiBhIHBvc2l0aXZlIG51bWJlciAodGhhdCdzIHdoYXQgPj4+IDAgZG9lcylcbiAgICAgIHJldHVybiAoY3JjIF4gKC0xKSkgPj4+IDA7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIEhhc2hlc1xuICAgICAqIEBjbGFzcyBNRDVcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZ11cbiAgICAgKlxuICAgICAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgUlNBIERhdGEgU2VjdXJpdHksIEluYy4gTUQ1IE1lc3NhZ2VcbiAgICAgKiBEaWdlc3QgQWxnb3JpdGhtLCBhcyBkZWZpbmVkIGluIFJGQyAxMzIxLlxuICAgICAqIFZlcnNpb24gMi4yIENvcHlyaWdodCAoQykgUGF1bCBKb2huc3RvbiAxOTk5IC0gMjAwOVxuICAgICAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcbiAgICAgKiBTZWUgPGh0dHA6Ly9wYWpob21lLm9yZy51ay9jcnlwdC9tZDU+IGZvciBtb3JlIGluZkhhc2hlcy5cbiAgICAgKi9cbiAgICBNRDU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIC8qKlxuICAgICAgICogUHJpdmF0ZSBjb25maWcgcHJvcGVydGllcy4gWW91IG1heSBuZWVkIHRvIHR3ZWFrIHRoZXNlIHRvIGJlIGNvbXBhdGlibGUgd2l0aFxuICAgICAgICogdGhlIHNlcnZlci1zaWRlLCBidXQgdGhlIGRlZmF1bHRzIHdvcmsgaW4gbW9zdCBjYXNlcy5cbiAgICAgICAqIFNlZSB7QGxpbmsgSGFzaGVzLk1ENSNtZXRob2Qtc2V0VXBwZXJDYXNlfSBhbmQge0BsaW5rIEhhc2hlcy5TSEExI21ldGhvZC1zZXRVcHBlckNhc2V9XG4gICAgICAgKi9cbiAgICAgIHZhciBoZXhjYXNlID0gKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMudXBwZXJjYXNlID09PSAnYm9vbGVhbicpID8gb3B0aW9ucy51cHBlcmNhc2UgOiBmYWxzZSwgLy8gaGV4YWRlY2ltYWwgb3V0cHV0IGNhc2UgZm9ybWF0LiBmYWxzZSAtIGxvd2VyY2FzZTsgdHJ1ZSAtIHVwcGVyY2FzZVxuICAgICAgICBiNjRwYWQgPSAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5wYWQgPT09ICdzdHJpbmcnKSA/IG9wdGlvbnMucGFkIDogJz0nLCAvLyBiYXNlLTY0IHBhZCBjaGFyYWN0ZXIuIERlZmF1bHRzIHRvICc9JyBmb3Igc3RyaWN0IFJGQyBjb21wbGlhbmNlXG4gICAgICAgIHV0ZjggPSAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy51dGY4ID09PSAnYm9vbGVhbicpID8gb3B0aW9ucy51dGY4IDogdHJ1ZTsgLy8gZW5hYmxlL2Rpc2FibGUgdXRmOCBlbmNvZGluZ1xuXG4gICAgICAvLyBwcml2aWxlZ2VkIChwdWJsaWMpIG1ldGhvZHNcbiAgICAgIHRoaXMuaGV4ID0gZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcnN0cjJoZXgocnN0cihzLCB1dGY4KSwgaGV4Y2FzZSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5iNjQgPSBmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiByc3RyMmI2NChyc3RyKHMpLCBiNjRwYWQpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYW55ID0gZnVuY3Rpb24ocywgZSkge1xuICAgICAgICByZXR1cm4gcnN0cjJhbnkocnN0cihzLCB1dGY4KSwgZSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5yYXcgPSBmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiByc3RyKHMsIHV0ZjgpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuaGV4X2htYWMgPSBmdW5jdGlvbihrLCBkKSB7XG4gICAgICAgIHJldHVybiByc3RyMmhleChyc3RyX2htYWMoaywgZCksIGhleGNhc2UpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYjY0X2htYWMgPSBmdW5jdGlvbihrLCBkKSB7XG4gICAgICAgIHJldHVybiByc3RyMmI2NChyc3RyX2htYWMoaywgZCksIGI2NHBhZCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5hbnlfaG1hYyA9IGZ1bmN0aW9uKGssIGQsIGUpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYW55KHJzdHJfaG1hYyhrLCBkKSwgZSk7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBQZXJmb3JtIGEgc2ltcGxlIHNlbGYtdGVzdCB0byBzZWUgaWYgdGhlIFZNIGlzIHdvcmtpbmdcbiAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gSGV4YWRlY2ltYWwgaGFzaCBzYW1wbGVcbiAgICAgICAqL1xuICAgICAgdGhpcy52bV90ZXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBoZXgoJ2FiYycpLnRvTG93ZXJDYXNlKCkgPT09ICc5MDAxNTA5ODNjZDI0ZmIwZDY5NjNmN2QyOGUxN2Y3Mic7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBFbmFibGUvZGlzYWJsZSB1cHBlcmNhc2UgaGV4YWRlY2ltYWwgcmV0dXJuZWQgc3RyaW5nXG4gICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59XG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoaXNcbiAgICAgICAqL1xuICAgICAgdGhpcy5zZXRVcHBlckNhc2UgPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgaGV4Y2FzZSA9IGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBEZWZpbmVzIGEgYmFzZTY0IHBhZCBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBQYWRcbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhpc1xuICAgICAgICovXG4gICAgICB0aGlzLnNldFBhZCA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgYjY0cGFkID0gYSB8fCBiNjRwYWQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogRGVmaW5lcyBhIGJhc2U2NCBwYWQgc3RyaW5nXG4gICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59XG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFt0aGlzXVxuICAgICAgICovXG4gICAgICB0aGlzLnNldFVURjggPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgdXRmOCA9IGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuXG4gICAgICAvLyBwcml2YXRlIG1ldGhvZHNcblxuICAgICAgLyoqXG4gICAgICAgKiBDYWxjdWxhdGUgdGhlIE1ENSBvZiBhIHJhdyBzdHJpbmdcbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiByc3RyKHMpIHtcbiAgICAgICAgcyA9ICh1dGY4KSA/IHV0ZjhFbmNvZGUocykgOiBzO1xuICAgICAgICByZXR1cm4gYmlubDJyc3RyKGJpbmwocnN0cjJiaW5sKHMpLCBzLmxlbmd0aCAqIDgpKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDYWxjdWxhdGUgdGhlIEhNQUMtTUQ1LCBvZiBhIGtleSBhbmQgc29tZSBkYXRhIChyYXcgc3RyaW5ncylcbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiByc3RyX2htYWMoa2V5LCBkYXRhKSB7XG4gICAgICAgIHZhciBia2V5LCBpcGFkLCBvcGFkLCBoYXNoLCBpO1xuXG4gICAgICAgIGtleSA9ICh1dGY4KSA/IHV0ZjhFbmNvZGUoa2V5KSA6IGtleTtcbiAgICAgICAgZGF0YSA9ICh1dGY4KSA/IHV0ZjhFbmNvZGUoZGF0YSkgOiBkYXRhO1xuICAgICAgICBia2V5ID0gcnN0cjJiaW5sKGtleSk7XG4gICAgICAgIGlmIChia2V5Lmxlbmd0aCA+IDE2KSB7XG4gICAgICAgICAgYmtleSA9IGJpbmwoYmtleSwga2V5Lmxlbmd0aCAqIDgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaXBhZCA9IEFycmF5KDE2KSwgb3BhZCA9IEFycmF5KDE2KTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDE2OyBpICs9IDEpIHtcbiAgICAgICAgICBpcGFkW2ldID0gYmtleVtpXSBeIDB4MzYzNjM2MzY7XG4gICAgICAgICAgb3BhZFtpXSA9IGJrZXlbaV0gXiAweDVDNUM1QzVDO1xuICAgICAgICB9XG4gICAgICAgIGhhc2ggPSBiaW5sKGlwYWQuY29uY2F0KHJzdHIyYmlubChkYXRhKSksIDUxMiArIGRhdGEubGVuZ3RoICogOCk7XG4gICAgICAgIHJldHVybiBiaW5sMnJzdHIoYmlubChvcGFkLmNvbmNhdChoYXNoKSwgNTEyICsgMTI4KSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ2FsY3VsYXRlIHRoZSBNRDUgb2YgYW4gYXJyYXkgb2YgbGl0dGxlLWVuZGlhbiB3b3JkcywgYW5kIGEgYml0IGxlbmd0aC5cbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiBiaW5sKHgsIGxlbikge1xuICAgICAgICB2YXIgaSwgb2xkYSwgb2xkYiwgb2xkYywgb2xkZCxcbiAgICAgICAgICBhID0gMTczMjU4NDE5MyxcbiAgICAgICAgICBiID0gLTI3MTczMzg3OSxcbiAgICAgICAgICBjID0gLTE3MzI1ODQxOTQsXG4gICAgICAgICAgZCA9IDI3MTczMzg3ODtcblxuICAgICAgICAvKiBhcHBlbmQgcGFkZGluZyAqL1xuICAgICAgICB4W2xlbiA+PiA1XSB8PSAweDgwIDw8ICgobGVuKSAlIDMyKTtcbiAgICAgICAgeFsoKChsZW4gKyA2NCkgPj4+IDkpIDw8IDQpICsgMTRdID0gbGVuO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSArPSAxNikge1xuICAgICAgICAgIG9sZGEgPSBhO1xuICAgICAgICAgIG9sZGIgPSBiO1xuICAgICAgICAgIG9sZGMgPSBjO1xuICAgICAgICAgIG9sZGQgPSBkO1xuXG4gICAgICAgICAgYSA9IG1kNV9mZihhLCBiLCBjLCBkLCB4W2kgKyAwXSwgNywgLTY4MDg3NjkzNik7XG4gICAgICAgICAgZCA9IG1kNV9mZihkLCBhLCBiLCBjLCB4W2kgKyAxXSwgMTIsIC0zODk1NjQ1ODYpO1xuICAgICAgICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpICsgMl0sIDE3LCA2MDYxMDU4MTkpO1xuICAgICAgICAgIGIgPSBtZDVfZmYoYiwgYywgZCwgYSwgeFtpICsgM10sIDIyLCAtMTA0NDUyNTMzMCk7XG4gICAgICAgICAgYSA9IG1kNV9mZihhLCBiLCBjLCBkLCB4W2kgKyA0XSwgNywgLTE3NjQxODg5Nyk7XG4gICAgICAgICAgZCA9IG1kNV9mZihkLCBhLCBiLCBjLCB4W2kgKyA1XSwgMTIsIDEyMDAwODA0MjYpO1xuICAgICAgICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpICsgNl0sIDE3LCAtMTQ3MzIzMTM0MSk7XG4gICAgICAgICAgYiA9IG1kNV9mZihiLCBjLCBkLCBhLCB4W2kgKyA3XSwgMjIsIC00NTcwNTk4Myk7XG4gICAgICAgICAgYSA9IG1kNV9mZihhLCBiLCBjLCBkLCB4W2kgKyA4XSwgNywgMTc3MDAzNTQxNik7XG4gICAgICAgICAgZCA9IG1kNV9mZihkLCBhLCBiLCBjLCB4W2kgKyA5XSwgMTIsIC0xOTU4NDE0NDE3KTtcbiAgICAgICAgICBjID0gbWQ1X2ZmKGMsIGQsIGEsIGIsIHhbaSArIDEwXSwgMTcsIC00MjA2Myk7XG4gICAgICAgICAgYiA9IG1kNV9mZihiLCBjLCBkLCBhLCB4W2kgKyAxMV0sIDIyLCAtMTk5MDQwNDE2Mik7XG4gICAgICAgICAgYSA9IG1kNV9mZihhLCBiLCBjLCBkLCB4W2kgKyAxMl0sIDcsIDE4MDQ2MDM2ODIpO1xuICAgICAgICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpICsgMTNdLCAxMiwgLTQwMzQxMTAxKTtcbiAgICAgICAgICBjID0gbWQ1X2ZmKGMsIGQsIGEsIGIsIHhbaSArIDE0XSwgMTcsIC0xNTAyMDAyMjkwKTtcbiAgICAgICAgICBiID0gbWQ1X2ZmKGIsIGMsIGQsIGEsIHhbaSArIDE1XSwgMjIsIDEyMzY1MzUzMjkpO1xuXG4gICAgICAgICAgYSA9IG1kNV9nZyhhLCBiLCBjLCBkLCB4W2kgKyAxXSwgNSwgLTE2NTc5NjUxMCk7XG4gICAgICAgICAgZCA9IG1kNV9nZyhkLCBhLCBiLCBjLCB4W2kgKyA2XSwgOSwgLTEwNjk1MDE2MzIpO1xuICAgICAgICAgIGMgPSBtZDVfZ2coYywgZCwgYSwgYiwgeFtpICsgMTFdLCAxNCwgNjQzNzE3NzEzKTtcbiAgICAgICAgICBiID0gbWQ1X2dnKGIsIGMsIGQsIGEsIHhbaSArIDBdLCAyMCwgLTM3Mzg5NzMwMik7XG4gICAgICAgICAgYSA9IG1kNV9nZyhhLCBiLCBjLCBkLCB4W2kgKyA1XSwgNSwgLTcwMTU1ODY5MSk7XG4gICAgICAgICAgZCA9IG1kNV9nZyhkLCBhLCBiLCBjLCB4W2kgKyAxMF0sIDksIDM4MDE2MDgzKTtcbiAgICAgICAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSArIDE1XSwgMTQsIC02NjA0NzgzMzUpO1xuICAgICAgICAgIGIgPSBtZDVfZ2coYiwgYywgZCwgYSwgeFtpICsgNF0sIDIwLCAtNDA1NTM3ODQ4KTtcbiAgICAgICAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSArIDldLCA1LCA1Njg0NDY0MzgpO1xuICAgICAgICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpICsgMTRdLCA5LCAtMTAxOTgwMzY5MCk7XG4gICAgICAgICAgYyA9IG1kNV9nZyhjLCBkLCBhLCBiLCB4W2kgKyAzXSwgMTQsIC0xODczNjM5NjEpO1xuICAgICAgICAgIGIgPSBtZDVfZ2coYiwgYywgZCwgYSwgeFtpICsgOF0sIDIwLCAxMTYzNTMxNTAxKTtcbiAgICAgICAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSArIDEzXSwgNSwgLTE0NDQ2ODE0NjcpO1xuICAgICAgICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpICsgMl0sIDksIC01MTQwMzc4NCk7XG4gICAgICAgICAgYyA9IG1kNV9nZyhjLCBkLCBhLCBiLCB4W2kgKyA3XSwgMTQsIDE3MzUzMjg0NzMpO1xuICAgICAgICAgIGIgPSBtZDVfZ2coYiwgYywgZCwgYSwgeFtpICsgMTJdLCAyMCwgLTE5MjY2MDc3MzQpO1xuXG4gICAgICAgICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2kgKyA1XSwgNCwgLTM3ODU1OCk7XG4gICAgICAgICAgZCA9IG1kNV9oaChkLCBhLCBiLCBjLCB4W2kgKyA4XSwgMTEsIC0yMDIyNTc0NDYzKTtcbiAgICAgICAgICBjID0gbWQ1X2hoKGMsIGQsIGEsIGIsIHhbaSArIDExXSwgMTYsIDE4MzkwMzA1NjIpO1xuICAgICAgICAgIGIgPSBtZDVfaGgoYiwgYywgZCwgYSwgeFtpICsgMTRdLCAyMywgLTM1MzA5NTU2KTtcbiAgICAgICAgICBhID0gbWQ1X2hoKGEsIGIsIGMsIGQsIHhbaSArIDFdLCA0LCAtMTUzMDk5MjA2MCk7XG4gICAgICAgICAgZCA9IG1kNV9oaChkLCBhLCBiLCBjLCB4W2kgKyA0XSwgMTEsIDEyNzI4OTMzNTMpO1xuICAgICAgICAgIGMgPSBtZDVfaGgoYywgZCwgYSwgYiwgeFtpICsgN10sIDE2LCAtMTU1NDk3NjMyKTtcbiAgICAgICAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSArIDEwXSwgMjMsIC0xMDk0NzMwNjQwKTtcbiAgICAgICAgICBhID0gbWQ1X2hoKGEsIGIsIGMsIGQsIHhbaSArIDEzXSwgNCwgNjgxMjc5MTc0KTtcbiAgICAgICAgICBkID0gbWQ1X2hoKGQsIGEsIGIsIGMsIHhbaSArIDBdLCAxMSwgLTM1ODUzNzIyMik7XG4gICAgICAgICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2kgKyAzXSwgMTYsIC03MjI1MjE5NzkpO1xuICAgICAgICAgIGIgPSBtZDVfaGgoYiwgYywgZCwgYSwgeFtpICsgNl0sIDIzLCA3NjAyOTE4OSk7XG4gICAgICAgICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2kgKyA5XSwgNCwgLTY0MDM2NDQ4Nyk7XG4gICAgICAgICAgZCA9IG1kNV9oaChkLCBhLCBiLCBjLCB4W2kgKyAxMl0sIDExLCAtNDIxODE1ODM1KTtcbiAgICAgICAgICBjID0gbWQ1X2hoKGMsIGQsIGEsIGIsIHhbaSArIDE1XSwgMTYsIDUzMDc0MjUyMCk7XG4gICAgICAgICAgYiA9IG1kNV9oaChiLCBjLCBkLCBhLCB4W2kgKyAyXSwgMjMsIC05OTUzMzg2NTEpO1xuXG4gICAgICAgICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2kgKyAwXSwgNiwgLTE5ODYzMDg0NCk7XG4gICAgICAgICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2kgKyA3XSwgMTAsIDExMjY4OTE0MTUpO1xuICAgICAgICAgIGMgPSBtZDVfaWkoYywgZCwgYSwgYiwgeFtpICsgMTRdLCAxNSwgLTE0MTYzNTQ5MDUpO1xuICAgICAgICAgIGIgPSBtZDVfaWkoYiwgYywgZCwgYSwgeFtpICsgNV0sIDIxLCAtNTc0MzQwNTUpO1xuICAgICAgICAgIGEgPSBtZDVfaWkoYSwgYiwgYywgZCwgeFtpICsgMTJdLCA2LCAxNzAwNDg1NTcxKTtcbiAgICAgICAgICBkID0gbWQ1X2lpKGQsIGEsIGIsIGMsIHhbaSArIDNdLCAxMCwgLTE4OTQ5ODY2MDYpO1xuICAgICAgICAgIGMgPSBtZDVfaWkoYywgZCwgYSwgYiwgeFtpICsgMTBdLCAxNSwgLTEwNTE1MjMpO1xuICAgICAgICAgIGIgPSBtZDVfaWkoYiwgYywgZCwgYSwgeFtpICsgMV0sIDIxLCAtMjA1NDkyMjc5OSk7XG4gICAgICAgICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2kgKyA4XSwgNiwgMTg3MzMxMzM1OSk7XG4gICAgICAgICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2kgKyAxNV0sIDEwLCAtMzA2MTE3NDQpO1xuICAgICAgICAgIGMgPSBtZDVfaWkoYywgZCwgYSwgYiwgeFtpICsgNl0sIDE1LCAtMTU2MDE5ODM4MCk7XG4gICAgICAgICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2kgKyAxM10sIDIxLCAxMzA5MTUxNjQ5KTtcbiAgICAgICAgICBhID0gbWQ1X2lpKGEsIGIsIGMsIGQsIHhbaSArIDRdLCA2LCAtMTQ1NTIzMDcwKTtcbiAgICAgICAgICBkID0gbWQ1X2lpKGQsIGEsIGIsIGMsIHhbaSArIDExXSwgMTAsIC0xMTIwMjEwMzc5KTtcbiAgICAgICAgICBjID0gbWQ1X2lpKGMsIGQsIGEsIGIsIHhbaSArIDJdLCAxNSwgNzE4Nzg3MjU5KTtcbiAgICAgICAgICBiID0gbWQ1X2lpKGIsIGMsIGQsIGEsIHhbaSArIDldLCAyMSwgLTM0MzQ4NTU1MSk7XG5cbiAgICAgICAgICBhID0gc2FmZV9hZGQoYSwgb2xkYSk7XG4gICAgICAgICAgYiA9IHNhZmVfYWRkKGIsIG9sZGIpO1xuICAgICAgICAgIGMgPSBzYWZlX2FkZChjLCBvbGRjKTtcbiAgICAgICAgICBkID0gc2FmZV9hZGQoZCwgb2xkZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEFycmF5KGEsIGIsIGMsIGQpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZXNlIGZ1bmN0aW9ucyBpbXBsZW1lbnQgdGhlIGZvdXIgYmFzaWMgb3BlcmF0aW9ucyB0aGUgYWxnb3JpdGhtIHVzZXMuXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gbWQ1X2NtbihxLCBhLCBiLCB4LCBzLCB0KSB7XG4gICAgICAgIHJldHVybiBzYWZlX2FkZChiaXRfcm9sKHNhZmVfYWRkKHNhZmVfYWRkKGEsIHEpLCBzYWZlX2FkZCh4LCB0KSksIHMpLCBiKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbWQ1X2ZmKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgICAgICAgcmV0dXJuIG1kNV9jbW4oKGIgJiBjKSB8ICgofmIpICYgZCksIGEsIGIsIHgsIHMsIHQpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBtZDVfZ2coYSwgYiwgYywgZCwgeCwgcywgdCkge1xuICAgICAgICByZXR1cm4gbWQ1X2NtbigoYiAmIGQpIHwgKGMgJiAofmQpKSwgYSwgYiwgeCwgcywgdCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG1kNV9oaChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XG4gICAgICAgIHJldHVybiBtZDVfY21uKGIgXiBjIF4gZCwgYSwgYiwgeCwgcywgdCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG1kNV9paShhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XG4gICAgICAgIHJldHVybiBtZDVfY21uKGMgXiAoYiB8ICh+ZCkpLCBhLCBiLCB4LCBzLCB0KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgSGFzaGVzXG4gICAgICogQGNsYXNzIEhhc2hlcy5TSEExXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWddXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFNlY3VyZSBIYXNoIEFsZ29yaXRobSwgU0hBLTEsIGFzIGRlZmluZWQgaW4gRklQUyAxODAtMVxuICAgICAqIFZlcnNpb24gMi4yIENvcHlyaWdodCBQYXVsIEpvaG5zdG9uIDIwMDAgLSAyMDA5LlxuICAgICAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcbiAgICAgKiBTZWUgaHR0cDovL3BhamhvbWUub3JnLnVrL2NyeXB0L21kNSBmb3IgZGV0YWlscy5cbiAgICAgKi9cbiAgICBTSEExOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAvKipcbiAgICAgICAqIFByaXZhdGUgY29uZmlnIHByb3BlcnRpZXMuIFlvdSBtYXkgbmVlZCB0byB0d2VhayB0aGVzZSB0byBiZSBjb21wYXRpYmxlIHdpdGhcbiAgICAgICAqIHRoZSBzZXJ2ZXItc2lkZSwgYnV0IHRoZSBkZWZhdWx0cyB3b3JrIGluIG1vc3QgY2FzZXMuXG4gICAgICAgKiBTZWUge0BsaW5rIEhhc2hlcy5NRDUjbWV0aG9kLXNldFVwcGVyQ2FzZX0gYW5kIHtAbGluayBIYXNoZXMuU0hBMSNtZXRob2Qtc2V0VXBwZXJDYXNlfVxuICAgICAgICovXG4gICAgICB2YXIgaGV4Y2FzZSA9IChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnVwcGVyY2FzZSA9PT0gJ2Jvb2xlYW4nKSA/IG9wdGlvbnMudXBwZXJjYXNlIDogZmFsc2UsIC8vIGhleGFkZWNpbWFsIG91dHB1dCBjYXNlIGZvcm1hdC4gZmFsc2UgLSBsb3dlcmNhc2U7IHRydWUgLSB1cHBlcmNhc2VcbiAgICAgICAgYjY0cGFkID0gKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMucGFkID09PSAnc3RyaW5nJykgPyBvcHRpb25zLnBhZCA6ICc9JywgLy8gYmFzZS02NCBwYWQgY2hhcmFjdGVyLiBEZWZhdWx0cyB0byAnPScgZm9yIHN0cmljdCBSRkMgY29tcGxpYW5jZVxuICAgICAgICB1dGY4ID0gKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMudXRmOCA9PT0gJ2Jvb2xlYW4nKSA/IG9wdGlvbnMudXRmOCA6IHRydWU7IC8vIGVuYWJsZS9kaXNhYmxlIHV0ZjggZW5jb2RpbmdcblxuICAgICAgLy8gcHVibGljIG1ldGhvZHNcbiAgICAgIHRoaXMuaGV4ID0gZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcnN0cjJoZXgocnN0cihzLCB1dGY4KSwgaGV4Y2FzZSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5iNjQgPSBmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiByc3RyMmI2NChyc3RyKHMsIHV0ZjgpLCBiNjRwYWQpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYW55ID0gZnVuY3Rpb24ocywgZSkge1xuICAgICAgICByZXR1cm4gcnN0cjJhbnkocnN0cihzLCB1dGY4KSwgZSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5yYXcgPSBmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiByc3RyKHMsIHV0ZjgpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuaGV4X2htYWMgPSBmdW5jdGlvbihrLCBkKSB7XG4gICAgICAgIHJldHVybiByc3RyMmhleChyc3RyX2htYWMoaywgZCkpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYjY0X2htYWMgPSBmdW5jdGlvbihrLCBkKSB7XG4gICAgICAgIHJldHVybiByc3RyMmI2NChyc3RyX2htYWMoaywgZCksIGI2NHBhZCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5hbnlfaG1hYyA9IGZ1bmN0aW9uKGssIGQsIGUpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYW55KHJzdHJfaG1hYyhrLCBkKSwgZSk7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBQZXJmb3JtIGEgc2ltcGxlIHNlbGYtdGVzdCB0byBzZWUgaWYgdGhlIFZNIGlzIHdvcmtpbmdcbiAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gSGV4YWRlY2ltYWwgaGFzaCBzYW1wbGVcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgICAgdGhpcy52bV90ZXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBoZXgoJ2FiYycpLnRvTG93ZXJDYXNlKCkgPT09ICc5MDAxNTA5ODNjZDI0ZmIwZDY5NjNmN2QyOGUxN2Y3Mic7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBAZGVzY3JpcHRpb24gRW5hYmxlL2Rpc2FibGUgdXBwZXJjYXNlIGhleGFkZWNpbWFsIHJldHVybmVkIHN0cmluZ1xuICAgICAgICogQHBhcmFtIHtib29sZWFufVxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2V0VXBwZXJDYXNlID0gZnVuY3Rpb24oYSkge1xuICAgICAgICBpZiAodHlwZW9mIGEgPT09ICdib29sZWFuJykge1xuICAgICAgICAgIGhleGNhc2UgPSBhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogQGRlc2NyaXB0aW9uIERlZmluZXMgYSBiYXNlNjQgcGFkIHN0cmluZ1xuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IFBhZFxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2V0UGFkID0gZnVuY3Rpb24oYSkge1xuICAgICAgICBiNjRwYWQgPSBhIHx8IGI2NHBhZDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBAZGVzY3JpcHRpb24gRGVmaW5lcyBhIGJhc2U2NCBwYWQgc3RyaW5nXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59XG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoaXNcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgICAgdGhpcy5zZXRVVEY4ID0gZnVuY3Rpb24oYSkge1xuICAgICAgICBpZiAodHlwZW9mIGEgPT09ICdib29sZWFuJykge1xuICAgICAgICAgIHV0ZjggPSBhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcblxuICAgICAgLy8gcHJpdmF0ZSBtZXRob2RzXG5cbiAgICAgIC8qKlxuICAgICAgICogQ2FsY3VsYXRlIHRoZSBTSEEtNTEyIG9mIGEgcmF3IHN0cmluZ1xuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIHJzdHIocykge1xuICAgICAgICBzID0gKHV0ZjgpID8gdXRmOEVuY29kZShzKSA6IHM7XG4gICAgICAgIHJldHVybiBiaW5iMnJzdHIoYmluYihyc3RyMmJpbmIocyksIHMubGVuZ3RoICogOCkpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIENhbGN1bGF0ZSB0aGUgSE1BQy1TSEExIG9mIGEga2V5IGFuZCBzb21lIGRhdGEgKHJhdyBzdHJpbmdzKVxuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIHJzdHJfaG1hYyhrZXksIGRhdGEpIHtcbiAgICAgICAgdmFyIGJrZXksIGlwYWQsIG9wYWQsIGksIGhhc2g7XG4gICAgICAgIGtleSA9ICh1dGY4KSA/IHV0ZjhFbmNvZGUoa2V5KSA6IGtleTtcbiAgICAgICAgZGF0YSA9ICh1dGY4KSA/IHV0ZjhFbmNvZGUoZGF0YSkgOiBkYXRhO1xuICAgICAgICBia2V5ID0gcnN0cjJiaW5iKGtleSk7XG5cbiAgICAgICAgaWYgKGJrZXkubGVuZ3RoID4gMTYpIHtcbiAgICAgICAgICBia2V5ID0gYmluYihia2V5LCBrZXkubGVuZ3RoICogOCk7XG4gICAgICAgIH1cbiAgICAgICAgaXBhZCA9IEFycmF5KDE2KSwgb3BhZCA9IEFycmF5KDE2KTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDE2OyBpICs9IDEpIHtcbiAgICAgICAgICBpcGFkW2ldID0gYmtleVtpXSBeIDB4MzYzNjM2MzY7XG4gICAgICAgICAgb3BhZFtpXSA9IGJrZXlbaV0gXiAweDVDNUM1QzVDO1xuICAgICAgICB9XG4gICAgICAgIGhhc2ggPSBiaW5iKGlwYWQuY29uY2F0KHJzdHIyYmluYihkYXRhKSksIDUxMiArIGRhdGEubGVuZ3RoICogOCk7XG4gICAgICAgIHJldHVybiBiaW5iMnJzdHIoYmluYihvcGFkLmNvbmNhdChoYXNoKSwgNTEyICsgMTYwKSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ2FsY3VsYXRlIHRoZSBTSEEtMSBvZiBhbiBhcnJheSBvZiBiaWctZW5kaWFuIHdvcmRzLCBhbmQgYSBiaXQgbGVuZ3RoXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gYmluYih4LCBsZW4pIHtcbiAgICAgICAgdmFyIGksIGosIHQsIG9sZGEsIG9sZGIsIG9sZGMsIG9sZGQsIG9sZGUsXG4gICAgICAgICAgdyA9IEFycmF5KDgwKSxcbiAgICAgICAgICBhID0gMTczMjU4NDE5MyxcbiAgICAgICAgICBiID0gLTI3MTczMzg3OSxcbiAgICAgICAgICBjID0gLTE3MzI1ODQxOTQsXG4gICAgICAgICAgZCA9IDI3MTczMzg3OCxcbiAgICAgICAgICBlID0gLTEwMDk1ODk3NzY7XG5cbiAgICAgICAgLyogYXBwZW5kIHBhZGRpbmcgKi9cbiAgICAgICAgeFtsZW4gPj4gNV0gfD0gMHg4MCA8PCAoMjQgLSBsZW4gJSAzMik7XG4gICAgICAgIHhbKChsZW4gKyA2NCA+PiA5KSA8PCA0KSArIDE1XSA9IGxlbjtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkgKz0gMTYpIHtcbiAgICAgICAgICBvbGRhID0gYTtcbiAgICAgICAgICBvbGRiID0gYjtcbiAgICAgICAgICBvbGRjID0gYztcbiAgICAgICAgICBvbGRkID0gZDtcbiAgICAgICAgICBvbGRlID0gZTtcblxuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCA4MDsgaiArPSAxKSB7XG4gICAgICAgICAgICBpZiAoaiA8IDE2KSB7XG4gICAgICAgICAgICAgIHdbal0gPSB4W2kgKyBqXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHdbal0gPSBiaXRfcm9sKHdbaiAtIDNdIF4gd1tqIC0gOF0gXiB3W2ogLSAxNF0gXiB3W2ogLSAxNl0sIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdCA9IHNhZmVfYWRkKHNhZmVfYWRkKGJpdF9yb2woYSwgNSksIHNoYTFfZnQoaiwgYiwgYywgZCkpLFxuICAgICAgICAgICAgICBzYWZlX2FkZChzYWZlX2FkZChlLCB3W2pdKSwgc2hhMV9rdChqKSkpO1xuICAgICAgICAgICAgZSA9IGQ7XG4gICAgICAgICAgICBkID0gYztcbiAgICAgICAgICAgIGMgPSBiaXRfcm9sKGIsIDMwKTtcbiAgICAgICAgICAgIGIgPSBhO1xuICAgICAgICAgICAgYSA9IHQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYSA9IHNhZmVfYWRkKGEsIG9sZGEpO1xuICAgICAgICAgIGIgPSBzYWZlX2FkZChiLCBvbGRiKTtcbiAgICAgICAgICBjID0gc2FmZV9hZGQoYywgb2xkYyk7XG4gICAgICAgICAgZCA9IHNhZmVfYWRkKGQsIG9sZGQpO1xuICAgICAgICAgIGUgPSBzYWZlX2FkZChlLCBvbGRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQXJyYXkoYSwgYiwgYywgZCwgZSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogUGVyZm9ybSB0aGUgYXBwcm9wcmlhdGUgdHJpcGxldCBjb21iaW5hdGlvbiBmdW5jdGlvbiBmb3IgdGhlIGN1cnJlbnRcbiAgICAgICAqIGl0ZXJhdGlvblxuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIHNoYTFfZnQodCwgYiwgYywgZCkge1xuICAgICAgICBpZiAodCA8IDIwKSB7XG4gICAgICAgICAgcmV0dXJuIChiICYgYykgfCAoKH5iKSAmIGQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0IDwgNDApIHtcbiAgICAgICAgICByZXR1cm4gYiBeIGMgXiBkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0IDwgNjApIHtcbiAgICAgICAgICByZXR1cm4gKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiIF4gYyBeIGQ7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogRGV0ZXJtaW5lIHRoZSBhcHByb3ByaWF0ZSBhZGRpdGl2ZSBjb25zdGFudCBmb3IgdGhlIGN1cnJlbnQgaXRlcmF0aW9uXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gc2hhMV9rdCh0KSB7XG4gICAgICAgIHJldHVybiAodCA8IDIwKSA/IDE1MTg1MDAyNDkgOiAodCA8IDQwKSA/IDE4NTk3NzUzOTMgOlxuICAgICAgICAgICh0IDwgNjApID8gLTE4OTQwMDc1ODggOiAtODk5NDk3NTE0O1xuICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogQGNsYXNzIEhhc2hlcy5TSEEyNTZcbiAgICAgKiBAcGFyYW0ge2NvbmZpZ31cbiAgICAgKlxuICAgICAqIEEgSmF2YVNjcmlwdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgU2VjdXJlIEhhc2ggQWxnb3JpdGhtLCBTSEEtMjU2LCBhcyBkZWZpbmVkIGluIEZJUFMgMTgwLTJcbiAgICAgKiBWZXJzaW9uIDIuMiBDb3B5cmlnaHQgQW5nZWwgTWFyaW4sIFBhdWwgSm9obnN0b24gMjAwMCAtIDIwMDkuXG4gICAgICogT3RoZXIgY29udHJpYnV0b3JzOiBHcmVnIEhvbHQsIEFuZHJldyBLZXBlcnQsIFlkbmFyLCBMb3N0aW5ldFxuICAgICAqIFNlZSBodHRwOi8vcGFqaG9tZS5vcmcudWsvY3J5cHQvbWQ1IGZvciBkZXRhaWxzLlxuICAgICAqIEFsc28gaHR0cDovL2FubWFyLmV1Lm9yZy9wcm9qZWN0cy9qc3NoYTIvXG4gICAgICovXG4gICAgU0hBMjU2OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAvKipcbiAgICAgICAqIFByaXZhdGUgcHJvcGVydGllcyBjb25maWd1cmF0aW9uIHZhcmlhYmxlcy4gWW91IG1heSBuZWVkIHRvIHR3ZWFrIHRoZXNlIHRvIGJlIGNvbXBhdGlibGUgd2l0aFxuICAgICAgICogdGhlIHNlcnZlci1zaWRlLCBidXQgdGhlIGRlZmF1bHRzIHdvcmsgaW4gbW9zdCBjYXNlcy5cbiAgICAgICAqIEBzZWUgdGhpcy5zZXRVcHBlckNhc2UoKSBtZXRob2RcbiAgICAgICAqIEBzZWUgdGhpcy5zZXRQYWQoKSBtZXRob2RcbiAgICAgICAqL1xuICAgICAgdmFyIGhleGNhc2UgPSAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy51cHBlcmNhc2UgPT09ICdib29sZWFuJykgPyBvcHRpb25zLnVwcGVyY2FzZSA6IGZhbHNlLCAvLyBoZXhhZGVjaW1hbCBvdXRwdXQgY2FzZSBmb3JtYXQuIGZhbHNlIC0gbG93ZXJjYXNlOyB0cnVlIC0gdXBwZXJjYXNlICAqL1xuICAgICAgICBiNjRwYWQgPSAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5wYWQgPT09ICdzdHJpbmcnKSA/IG9wdGlvbnMucGFkIDogJz0nLFxuICAgICAgICAvKiBiYXNlLTY0IHBhZCBjaGFyYWN0ZXIuIERlZmF1bHQgJz0nIGZvciBzdHJpY3QgUkZDIGNvbXBsaWFuY2UgICAqL1xuICAgICAgICB1dGY4ID0gKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMudXRmOCA9PT0gJ2Jvb2xlYW4nKSA/IG9wdGlvbnMudXRmOCA6IHRydWUsXG4gICAgICAgIC8qIGVuYWJsZS9kaXNhYmxlIHV0ZjggZW5jb2RpbmcgKi9cbiAgICAgICAgc2hhMjU2X0s7XG5cbiAgICAgIC8qIHByaXZpbGVnZWQgKHB1YmxpYykgbWV0aG9kcyAqL1xuICAgICAgdGhpcy5oZXggPSBmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiByc3RyMmhleChyc3RyKHMsIHV0ZjgpKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmI2NCA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYjY0KHJzdHIocywgdXRmOCksIGI2NHBhZCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5hbnkgPSBmdW5jdGlvbihzLCBlKSB7XG4gICAgICAgIHJldHVybiByc3RyMmFueShyc3RyKHMsIHV0ZjgpLCBlKTtcbiAgICAgIH07XG4gICAgICB0aGlzLnJhdyA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIocywgdXRmOCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5oZXhfaG1hYyA9IGZ1bmN0aW9uKGssIGQpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyaGV4KHJzdHJfaG1hYyhrLCBkKSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5iNjRfaG1hYyA9IGZ1bmN0aW9uKGssIGQpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYjY0KHJzdHJfaG1hYyhrLCBkKSwgYjY0cGFkKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmFueV9obWFjID0gZnVuY3Rpb24oaywgZCwgZSkge1xuICAgICAgICByZXR1cm4gcnN0cjJhbnkocnN0cl9obWFjKGssIGQpLCBlKTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFBlcmZvcm0gYSBzaW1wbGUgc2VsZi10ZXN0IHRvIHNlZSBpZiB0aGUgVk0gaXMgd29ya2luZ1xuICAgICAgICogQHJldHVybiB7U3RyaW5nfSBIZXhhZGVjaW1hbCBoYXNoIHNhbXBsZVxuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgICB0aGlzLnZtX3Rlc3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGhleCgnYWJjJykudG9Mb3dlckNhc2UoKSA9PT0gJzkwMDE1MDk4M2NkMjRmYjBkNjk2M2Y3ZDI4ZTE3ZjcyJztcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIEVuYWJsZS9kaXNhYmxlIHVwcGVyY2FzZSBoZXhhZGVjaW1hbCByZXR1cm5lZCBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn1cbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhpc1xuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgICB0aGlzLnNldFVwcGVyQ2FzZSA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICBoZXhjYXNlID0gYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIEBkZXNjcmlwdGlvbiBEZWZpbmVzIGEgYmFzZTY0IHBhZCBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBQYWRcbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhpc1xuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgICB0aGlzLnNldFBhZCA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgYjY0cGFkID0gYSB8fCBiNjRwYWQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogRGVmaW5lcyBhIGJhc2U2NCBwYWQgc3RyaW5nXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59XG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoaXNcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgICAgdGhpcy5zZXRVVEY4ID0gZnVuY3Rpb24oYSkge1xuICAgICAgICBpZiAodHlwZW9mIGEgPT09ICdib29sZWFuJykge1xuICAgICAgICAgIHV0ZjggPSBhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcblxuICAgICAgLy8gcHJpdmF0ZSBtZXRob2RzXG5cbiAgICAgIC8qKlxuICAgICAgICogQ2FsY3VsYXRlIHRoZSBTSEEtNTEyIG9mIGEgcmF3IHN0cmluZ1xuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIHJzdHIocywgdXRmOCkge1xuICAgICAgICBzID0gKHV0ZjgpID8gdXRmOEVuY29kZShzKSA6IHM7XG4gICAgICAgIHJldHVybiBiaW5iMnJzdHIoYmluYihyc3RyMmJpbmIocyksIHMubGVuZ3RoICogOCkpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIENhbGN1bGF0ZSB0aGUgSE1BQy1zaGEyNTYgb2YgYSBrZXkgYW5kIHNvbWUgZGF0YSAocmF3IHN0cmluZ3MpXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gcnN0cl9obWFjKGtleSwgZGF0YSkge1xuICAgICAgICBrZXkgPSAodXRmOCkgPyB1dGY4RW5jb2RlKGtleSkgOiBrZXk7XG4gICAgICAgIGRhdGEgPSAodXRmOCkgPyB1dGY4RW5jb2RlKGRhdGEpIDogZGF0YTtcbiAgICAgICAgdmFyIGhhc2gsIGkgPSAwLFxuICAgICAgICAgIGJrZXkgPSByc3RyMmJpbmIoa2V5KSxcbiAgICAgICAgICBpcGFkID0gQXJyYXkoMTYpLFxuICAgICAgICAgIG9wYWQgPSBBcnJheSgxNik7XG5cbiAgICAgICAgaWYgKGJrZXkubGVuZ3RoID4gMTYpIHtcbiAgICAgICAgICBia2V5ID0gYmluYihia2V5LCBrZXkubGVuZ3RoICogOCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKDsgaSA8IDE2OyBpICs9IDEpIHtcbiAgICAgICAgICBpcGFkW2ldID0gYmtleVtpXSBeIDB4MzYzNjM2MzY7XG4gICAgICAgICAgb3BhZFtpXSA9IGJrZXlbaV0gXiAweDVDNUM1QzVDO1xuICAgICAgICB9XG5cbiAgICAgICAgaGFzaCA9IGJpbmIoaXBhZC5jb25jYXQocnN0cjJiaW5iKGRhdGEpKSwgNTEyICsgZGF0YS5sZW5ndGggKiA4KTtcbiAgICAgICAgcmV0dXJuIGJpbmIycnN0cihiaW5iKG9wYWQuY29uY2F0KGhhc2gpLCA1MTIgKyAyNTYpKTtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAqIE1haW4gc2hhMjU2IGZ1bmN0aW9uLCB3aXRoIGl0cyBzdXBwb3J0IGZ1bmN0aW9uc1xuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIHNoYTI1Nl9TKFgsIG4pIHtcbiAgICAgICAgcmV0dXJuIChYID4+PiBuKSB8IChYIDw8ICgzMiAtIG4pKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hhMjU2X1IoWCwgbikge1xuICAgICAgICByZXR1cm4gKFggPj4+IG4pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaGEyNTZfQ2goeCwgeSwgeikge1xuICAgICAgICByZXR1cm4gKCh4ICYgeSkgXiAoKH54KSAmIHopKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hhMjU2X01haih4LCB5LCB6KSB7XG4gICAgICAgIHJldHVybiAoKHggJiB5KSBeICh4ICYgeikgXiAoeSAmIHopKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hhMjU2X1NpZ21hMDI1Nih4KSB7XG4gICAgICAgIHJldHVybiAoc2hhMjU2X1MoeCwgMikgXiBzaGEyNTZfUyh4LCAxMykgXiBzaGEyNTZfUyh4LCAyMikpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaGEyNTZfU2lnbWExMjU2KHgpIHtcbiAgICAgICAgcmV0dXJuIChzaGEyNTZfUyh4LCA2KSBeIHNoYTI1Nl9TKHgsIDExKSBeIHNoYTI1Nl9TKHgsIDI1KSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNoYTI1Nl9HYW1tYTAyNTYoeCkge1xuICAgICAgICByZXR1cm4gKHNoYTI1Nl9TKHgsIDcpIF4gc2hhMjU2X1MoeCwgMTgpIF4gc2hhMjU2X1IoeCwgMykpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaGEyNTZfR2FtbWExMjU2KHgpIHtcbiAgICAgICAgcmV0dXJuIChzaGEyNTZfUyh4LCAxNykgXiBzaGEyNTZfUyh4LCAxOSkgXiBzaGEyNTZfUih4LCAxMCkpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaGEyNTZfU2lnbWEwNTEyKHgpIHtcbiAgICAgICAgcmV0dXJuIChzaGEyNTZfUyh4LCAyOCkgXiBzaGEyNTZfUyh4LCAzNCkgXiBzaGEyNTZfUyh4LCAzOSkpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaGEyNTZfU2lnbWExNTEyKHgpIHtcbiAgICAgICAgcmV0dXJuIChzaGEyNTZfUyh4LCAxNCkgXiBzaGEyNTZfUyh4LCAxOCkgXiBzaGEyNTZfUyh4LCA0MSkpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaGEyNTZfR2FtbWEwNTEyKHgpIHtcbiAgICAgICAgcmV0dXJuIChzaGEyNTZfUyh4LCAxKSBeIHNoYTI1Nl9TKHgsIDgpIF4gc2hhMjU2X1IoeCwgNykpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaGEyNTZfR2FtbWExNTEyKHgpIHtcbiAgICAgICAgcmV0dXJuIChzaGEyNTZfUyh4LCAxOSkgXiBzaGEyNTZfUyh4LCA2MSkgXiBzaGEyNTZfUih4LCA2KSk7XG4gICAgICB9XG5cbiAgICAgIHNoYTI1Nl9LID0gW1xuICAgICAgICAxMTE2MzUyNDA4LCAxODk5NDQ3NDQxLCAtMTI0NTY0MzgyNSwgLTM3Mzk1NzcyMywgOTYxOTg3MTYzLCAxNTA4OTcwOTkzLCAtMTg0MTMzMTU0OCwgLTE0MjQyMDQwNzUsIC02NzA1ODYyMTYsIDMxMDU5ODQwMSwgNjA3MjI1Mjc4LCAxNDI2ODgxOTg3LFxuICAgICAgICAxOTI1MDc4Mzg4LCAtMjEzMjg4OTA5MCwgLTE2ODAwNzkxOTMsIC0xMDQ2NzQ0NzE2LCAtNDU5NTc2ODk1LCAtMjcyNzQyNTIyLFxuICAgICAgICAyNjQzNDcwNzgsIDYwNDgwNzYyOCwgNzcwMjU1OTgzLCAxMjQ5MTUwMTIyLCAxNTU1MDgxNjkyLCAxOTk2MDY0OTg2LCAtMTc0MDc0NjQxNCwgLTE0NzMxMzI5NDcsIC0xMzQxOTcwNDg4LCAtMTA4NDY1MzYyNSwgLTk1ODM5NTQwNSwgLTcxMDQzODU4NSxcbiAgICAgICAgMTEzOTI2OTkzLCAzMzgyNDE4OTUsIDY2NjMwNzIwNSwgNzczNTI5OTEyLCAxMjk0NzU3MzcyLCAxMzk2MTgyMjkxLFxuICAgICAgICAxNjk1MTgzNzAwLCAxOTg2NjYxMDUxLCAtMjExNzk0MDk0NiwgLTE4MzgwMTEyNTksIC0xNTY0NDgxMzc1LCAtMTQ3NDY2NDg4NSwgLTEwMzUyMzY0OTYsIC05NDkyMDI1MjUsIC03Nzg5MDE0NzksIC02OTQ2MTQ0OTIsIC0yMDAzOTUzODcsIDI3NTQyMzM0NCxcbiAgICAgICAgNDMwMjI3NzM0LCA1MDY5NDg2MTYsIDY1OTA2MDU1NiwgODgzOTk3ODc3LCA5NTgxMzk1NzEsIDEzMjI4MjIyMTgsXG4gICAgICAgIDE1MzcwMDIwNjMsIDE3NDc4NzM3NzksIDE5NTU1NjIyMjIsIDIwMjQxMDQ4MTUsIC0yMDY3MjM2ODQ0LCAtMTkzMzExNDg3MiwgLTE4NjY1MzA4MjIsIC0xNTM4MjMzMTA5LCAtMTA5MDkzNTgxNywgLTk2NTY0MTk5OFxuICAgICAgXTtcblxuICAgICAgZnVuY3Rpb24gYmluYihtLCBsKSB7XG4gICAgICAgIHZhciBIQVNIID0gWzE3NzkwMzM3MDMsIC0xMTUwODMzMDE5LCAxMDEzOTA0MjQyLCAtMTUyMTQ4NjUzNCxcbiAgICAgICAgICAxMzU5ODkzMTE5LCAtMTY5NDE0NDM3MiwgNTI4NzM0NjM1LCAxNTQxNDU5MjI1XG4gICAgICAgIF07XG4gICAgICAgIHZhciBXID0gbmV3IEFycmF5KDY0KTtcbiAgICAgICAgdmFyIGEsIGIsIGMsIGQsIGUsIGYsIGcsIGg7XG4gICAgICAgIHZhciBpLCBqLCBUMSwgVDI7XG5cbiAgICAgICAgLyogYXBwZW5kIHBhZGRpbmcgKi9cbiAgICAgICAgbVtsID4+IDVdIHw9IDB4ODAgPDwgKDI0IC0gbCAlIDMyKTtcbiAgICAgICAgbVsoKGwgKyA2NCA+PiA5KSA8PCA0KSArIDE1XSA9IGw7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG0ubGVuZ3RoOyBpICs9IDE2KSB7XG4gICAgICAgICAgYSA9IEhBU0hbMF07XG4gICAgICAgICAgYiA9IEhBU0hbMV07XG4gICAgICAgICAgYyA9IEhBU0hbMl07XG4gICAgICAgICAgZCA9IEhBU0hbM107XG4gICAgICAgICAgZSA9IEhBU0hbNF07XG4gICAgICAgICAgZiA9IEhBU0hbNV07XG4gICAgICAgICAgZyA9IEhBU0hbNl07XG4gICAgICAgICAgaCA9IEhBU0hbN107XG5cbiAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgNjQ7IGogKz0gMSkge1xuICAgICAgICAgICAgaWYgKGogPCAxNikge1xuICAgICAgICAgICAgICBXW2pdID0gbVtqICsgaV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBXW2pdID0gc2FmZV9hZGQoc2FmZV9hZGQoc2FmZV9hZGQoc2hhMjU2X0dhbW1hMTI1NihXW2ogLSAyXSksIFdbaiAtIDddKSxcbiAgICAgICAgICAgICAgICBzaGEyNTZfR2FtbWEwMjU2KFdbaiAtIDE1XSkpLCBXW2ogLSAxNl0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBUMSA9IHNhZmVfYWRkKHNhZmVfYWRkKHNhZmVfYWRkKHNhZmVfYWRkKGgsIHNoYTI1Nl9TaWdtYTEyNTYoZSkpLCBzaGEyNTZfQ2goZSwgZiwgZykpLFxuICAgICAgICAgICAgICBzaGEyNTZfS1tqXSksIFdbal0pO1xuICAgICAgICAgICAgVDIgPSBzYWZlX2FkZChzaGEyNTZfU2lnbWEwMjU2KGEpLCBzaGEyNTZfTWFqKGEsIGIsIGMpKTtcbiAgICAgICAgICAgIGggPSBnO1xuICAgICAgICAgICAgZyA9IGY7XG4gICAgICAgICAgICBmID0gZTtcbiAgICAgICAgICAgIGUgPSBzYWZlX2FkZChkLCBUMSk7XG4gICAgICAgICAgICBkID0gYztcbiAgICAgICAgICAgIGMgPSBiO1xuICAgICAgICAgICAgYiA9IGE7XG4gICAgICAgICAgICBhID0gc2FmZV9hZGQoVDEsIFQyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBIQVNIWzBdID0gc2FmZV9hZGQoYSwgSEFTSFswXSk7XG4gICAgICAgICAgSEFTSFsxXSA9IHNhZmVfYWRkKGIsIEhBU0hbMV0pO1xuICAgICAgICAgIEhBU0hbMl0gPSBzYWZlX2FkZChjLCBIQVNIWzJdKTtcbiAgICAgICAgICBIQVNIWzNdID0gc2FmZV9hZGQoZCwgSEFTSFszXSk7XG4gICAgICAgICAgSEFTSFs0XSA9IHNhZmVfYWRkKGUsIEhBU0hbNF0pO1xuICAgICAgICAgIEhBU0hbNV0gPSBzYWZlX2FkZChmLCBIQVNIWzVdKTtcbiAgICAgICAgICBIQVNIWzZdID0gc2FmZV9hZGQoZywgSEFTSFs2XSk7XG4gICAgICAgICAgSEFTSFs3XSA9IHNhZmVfYWRkKGgsIEhBU0hbN10pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBIQVNIO1xuICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBIYXNoZXMuU0hBNTEyXG4gICAgICogQHBhcmFtIHtjb25maWd9XG4gICAgICpcbiAgICAgKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFNlY3VyZSBIYXNoIEFsZ29yaXRobSwgU0hBLTUxMiwgYXMgZGVmaW5lZCBpbiBGSVBTIDE4MC0yXG4gICAgICogVmVyc2lvbiAyLjIgQ29weXJpZ2h0IEFub255bW91cyBDb250cmlidXRvciwgUGF1bCBKb2huc3RvbiAyMDAwIC0gMjAwOS5cbiAgICAgKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XG4gICAgICogU2VlIGh0dHA6Ly9wYWpob21lLm9yZy51ay9jcnlwdC9tZDUgZm9yIGRldGFpbHMuXG4gICAgICovXG4gICAgU0hBNTEyOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAvKipcbiAgICAgICAqIFByaXZhdGUgcHJvcGVydGllcyBjb25maWd1cmF0aW9uIHZhcmlhYmxlcy4gWW91IG1heSBuZWVkIHRvIHR3ZWFrIHRoZXNlIHRvIGJlIGNvbXBhdGlibGUgd2l0aFxuICAgICAgICogdGhlIHNlcnZlci1zaWRlLCBidXQgdGhlIGRlZmF1bHRzIHdvcmsgaW4gbW9zdCBjYXNlcy5cbiAgICAgICAqIEBzZWUgdGhpcy5zZXRVcHBlckNhc2UoKSBtZXRob2RcbiAgICAgICAqIEBzZWUgdGhpcy5zZXRQYWQoKSBtZXRob2RcbiAgICAgICAqL1xuICAgICAgdmFyIGhleGNhc2UgPSAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy51cHBlcmNhc2UgPT09ICdib29sZWFuJykgPyBvcHRpb25zLnVwcGVyY2FzZSA6IGZhbHNlLFxuICAgICAgICAvKiBoZXhhZGVjaW1hbCBvdXRwdXQgY2FzZSBmb3JtYXQuIGZhbHNlIC0gbG93ZXJjYXNlOyB0cnVlIC0gdXBwZXJjYXNlICAqL1xuICAgICAgICBiNjRwYWQgPSAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5wYWQgPT09ICdzdHJpbmcnKSA/IG9wdGlvbnMucGFkIDogJz0nLFxuICAgICAgICAvKiBiYXNlLTY0IHBhZCBjaGFyYWN0ZXIuIERlZmF1bHQgJz0nIGZvciBzdHJpY3QgUkZDIGNvbXBsaWFuY2UgICAqL1xuICAgICAgICB1dGY4ID0gKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMudXRmOCA9PT0gJ2Jvb2xlYW4nKSA/IG9wdGlvbnMudXRmOCA6IHRydWUsXG4gICAgICAgIC8qIGVuYWJsZS9kaXNhYmxlIHV0ZjggZW5jb2RpbmcgKi9cbiAgICAgICAgc2hhNTEyX2s7XG5cbiAgICAgIC8qIHByaXZpbGVnZWQgKHB1YmxpYykgbWV0aG9kcyAqL1xuICAgICAgdGhpcy5oZXggPSBmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiByc3RyMmhleChyc3RyKHMpKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmI2NCA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYjY0KHJzdHIocyksIGI2NHBhZCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5hbnkgPSBmdW5jdGlvbihzLCBlKSB7XG4gICAgICAgIHJldHVybiByc3RyMmFueShyc3RyKHMpLCBlKTtcbiAgICAgIH07XG4gICAgICB0aGlzLnJhdyA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIocywgdXRmOCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5oZXhfaG1hYyA9IGZ1bmN0aW9uKGssIGQpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyaGV4KHJzdHJfaG1hYyhrLCBkKSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5iNjRfaG1hYyA9IGZ1bmN0aW9uKGssIGQpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYjY0KHJzdHJfaG1hYyhrLCBkKSwgYjY0cGFkKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmFueV9obWFjID0gZnVuY3Rpb24oaywgZCwgZSkge1xuICAgICAgICByZXR1cm4gcnN0cjJhbnkocnN0cl9obWFjKGssIGQpLCBlKTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFBlcmZvcm0gYSBzaW1wbGUgc2VsZi10ZXN0IHRvIHNlZSBpZiB0aGUgVk0gaXMgd29ya2luZ1xuICAgICAgICogQHJldHVybiB7U3RyaW5nfSBIZXhhZGVjaW1hbCBoYXNoIHNhbXBsZVxuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgICB0aGlzLnZtX3Rlc3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGhleCgnYWJjJykudG9Mb3dlckNhc2UoKSA9PT0gJzkwMDE1MDk4M2NkMjRmYjBkNjk2M2Y3ZDI4ZTE3ZjcyJztcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIEBkZXNjcmlwdGlvbiBFbmFibGUvZGlzYWJsZSB1cHBlcmNhc2UgaGV4YWRlY2ltYWwgcmV0dXJuZWQgc3RyaW5nXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59XG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoaXNcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgICAgdGhpcy5zZXRVcHBlckNhc2UgPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgaGV4Y2FzZSA9IGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBAZGVzY3JpcHRpb24gRGVmaW5lcyBhIGJhc2U2NCBwYWQgc3RyaW5nXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gUGFkXG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoaXNcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgICAgdGhpcy5zZXRQYWQgPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIGI2NHBhZCA9IGEgfHwgYjY0cGFkO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIEBkZXNjcmlwdGlvbiBEZWZpbmVzIGEgYmFzZTY0IHBhZCBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn1cbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhpc1xuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgICB0aGlzLnNldFVURjggPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgdXRmOCA9IGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuXG4gICAgICAvKiBwcml2YXRlIG1ldGhvZHMgKi9cblxuICAgICAgLyoqXG4gICAgICAgKiBDYWxjdWxhdGUgdGhlIFNIQS01MTIgb2YgYSByYXcgc3RyaW5nXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gcnN0cihzKSB7XG4gICAgICAgIHMgPSAodXRmOCkgPyB1dGY4RW5jb2RlKHMpIDogcztcbiAgICAgICAgcmV0dXJuIGJpbmIycnN0cihiaW5iKHJzdHIyYmluYihzKSwgcy5sZW5ndGggKiA4KSk7XG4gICAgICB9XG4gICAgICAvKlxuICAgICAgICogQ2FsY3VsYXRlIHRoZSBITUFDLVNIQS01MTIgb2YgYSBrZXkgYW5kIHNvbWUgZGF0YSAocmF3IHN0cmluZ3MpXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gcnN0cl9obWFjKGtleSwgZGF0YSkge1xuICAgICAgICBrZXkgPSAodXRmOCkgPyB1dGY4RW5jb2RlKGtleSkgOiBrZXk7XG4gICAgICAgIGRhdGEgPSAodXRmOCkgPyB1dGY4RW5jb2RlKGRhdGEpIDogZGF0YTtcblxuICAgICAgICB2YXIgaGFzaCwgaSA9IDAsXG4gICAgICAgICAgYmtleSA9IHJzdHIyYmluYihrZXkpLFxuICAgICAgICAgIGlwYWQgPSBBcnJheSgzMiksXG4gICAgICAgICAgb3BhZCA9IEFycmF5KDMyKTtcblxuICAgICAgICBpZiAoYmtleS5sZW5ndGggPiAzMikge1xuICAgICAgICAgIGJrZXkgPSBiaW5iKGJrZXksIGtleS5sZW5ndGggKiA4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoOyBpIDwgMzI7IGkgKz0gMSkge1xuICAgICAgICAgIGlwYWRbaV0gPSBia2V5W2ldIF4gMHgzNjM2MzYzNjtcbiAgICAgICAgICBvcGFkW2ldID0gYmtleVtpXSBeIDB4NUM1QzVDNUM7XG4gICAgICAgIH1cblxuICAgICAgICBoYXNoID0gYmluYihpcGFkLmNvbmNhdChyc3RyMmJpbmIoZGF0YSkpLCAxMDI0ICsgZGF0YS5sZW5ndGggKiA4KTtcbiAgICAgICAgcmV0dXJuIGJpbmIycnN0cihiaW5iKG9wYWQuY29uY2F0KGhhc2gpLCAxMDI0ICsgNTEyKSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ2FsY3VsYXRlIHRoZSBTSEEtNTEyIG9mIGFuIGFycmF5IG9mIGJpZy1lbmRpYW4gZHdvcmRzLCBhbmQgYSBiaXQgbGVuZ3RoXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gYmluYih4LCBsZW4pIHtcbiAgICAgICAgdmFyIGosIGksIGwsXG4gICAgICAgICAgVyA9IG5ldyBBcnJheSg4MCksXG4gICAgICAgICAgaGFzaCA9IG5ldyBBcnJheSgxNiksXG4gICAgICAgICAgLy9Jbml0aWFsIGhhc2ggdmFsdWVzXG4gICAgICAgICAgSCA9IFtcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDZhMDllNjY3LCAtMjA1NzMxNTc2KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtMTE1MDgzMzAxOSwgLTIwNjcwOTM3MDEpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4M2M2ZWYzNzIsIC0yMzc5MTU3MyksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTE1MjE0ODY1MzQsIDB4NWYxZDM2ZjEpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4NTEwZTUyN2YsIC0xMzc3NDAyMTU5KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtMTY5NDE0NDM3MiwgMHgyYjNlNmMxZiksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHgxZjgzZDlhYiwgLTc5NTc3NzQ5KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDViZTBjZDE5LCAweDEzN2UyMTc5KVxuICAgICAgICAgIF0sXG4gICAgICAgICAgVDEgPSBuZXcgaW50NjQoMCwgMCksXG4gICAgICAgICAgVDIgPSBuZXcgaW50NjQoMCwgMCksXG4gICAgICAgICAgYSA9IG5ldyBpbnQ2NCgwLCAwKSxcbiAgICAgICAgICBiID0gbmV3IGludDY0KDAsIDApLFxuICAgICAgICAgIGMgPSBuZXcgaW50NjQoMCwgMCksXG4gICAgICAgICAgZCA9IG5ldyBpbnQ2NCgwLCAwKSxcbiAgICAgICAgICBlID0gbmV3IGludDY0KDAsIDApLFxuICAgICAgICAgIGYgPSBuZXcgaW50NjQoMCwgMCksXG4gICAgICAgICAgZyA9IG5ldyBpbnQ2NCgwLCAwKSxcbiAgICAgICAgICBoID0gbmV3IGludDY0KDAsIDApLFxuICAgICAgICAgIC8vVGVtcG9yYXJ5IHZhcmlhYmxlcyBub3Qgc3BlY2lmaWVkIGJ5IHRoZSBkb2N1bWVudFxuICAgICAgICAgIHMwID0gbmV3IGludDY0KDAsIDApLFxuICAgICAgICAgIHMxID0gbmV3IGludDY0KDAsIDApLFxuICAgICAgICAgIENoID0gbmV3IGludDY0KDAsIDApLFxuICAgICAgICAgIE1haiA9IG5ldyBpbnQ2NCgwLCAwKSxcbiAgICAgICAgICByMSA9IG5ldyBpbnQ2NCgwLCAwKSxcbiAgICAgICAgICByMiA9IG5ldyBpbnQ2NCgwLCAwKSxcbiAgICAgICAgICByMyA9IG5ldyBpbnQ2NCgwLCAwKTtcblxuICAgICAgICBpZiAoc2hhNTEyX2sgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vU0hBNTEyIGNvbnN0YW50c1xuICAgICAgICAgIHNoYTUxMl9rID0gW1xuICAgICAgICAgICAgbmV3IGludDY0KDB4NDI4YTJmOTgsIC02ODUxOTk4MzgpLCBuZXcgaW50NjQoMHg3MTM3NDQ5MSwgMHgyM2VmNjVjZCksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTEyNDU2NDM4MjUsIC0zMzA0ODI4OTcpLCBuZXcgaW50NjQoLTM3Mzk1NzcyMywgLTIxMjE2NzE3NDgpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4Mzk1NmMyNWIsIC0yMTMzMzg4MjQpLCBuZXcgaW50NjQoMHg1OWYxMTFmMSwgLTEyNDExMzMwMzEpLFxuICAgICAgICAgICAgbmV3IGludDY0KC0xODQxMzMxNTQ4LCAtMTM1NzI5NTcxNyksIG5ldyBpbnQ2NCgtMTQyNDIwNDA3NSwgLTYzMDM1NzczNiksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTY3MDU4NjIxNiwgLTE1NjAwODM5MDIpLCBuZXcgaW50NjQoMHgxMjgzNWIwMSwgMHg0NTcwNmZiZSksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHgyNDMxODViZSwgMHg0ZWU0YjI4YyksIG5ldyBpbnQ2NCgweDU1MGM3ZGMzLCAtNzA0NjYyMzAyKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDcyYmU1ZDc0LCAtMjI2Nzg0OTEzKSwgbmV3IGludDY0KC0yMTMyODg5MDkwLCAweDNiMTY5NmIxKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtMTY4MDA3OTE5MywgMHgyNWM3MTIzNSksIG5ldyBpbnQ2NCgtMTA0Njc0NDcxNiwgLTgxNTE5MjQyOCksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTQ1OTU3Njg5NSwgLTE2MjgzNTM4MzgpLCBuZXcgaW50NjQoLTI3Mjc0MjUyMiwgMHgzODRmMjVlMyksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHhmYzE5ZGM2LCAtMTk1MzcwNDUyMyksIG5ldyBpbnQ2NCgweDI0MGNhMWNjLCAweDc3YWM5YzY1KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDJkZTkyYzZmLCAweDU5MmIwMjc1KSwgbmV3IGludDY0KDB4NGE3NDg0YWEsIDB4NmVhNmU0ODMpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4NWNiMGE5ZGMsIC0xMTE5NzQ5MTY0KSwgbmV3IGludDY0KDB4NzZmOTg4ZGEsIC0yMDk2MDE2NDU5KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtMTc0MDc0NjQxNCwgLTI5NTI0Nzk1NyksIG5ldyBpbnQ2NCgtMTQ3MzEzMjk0NywgMHgyZGI0MzIxMCksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTEzNDE5NzA0ODgsIC0xNzI4MzcyNDE3KSwgbmV3IGludDY0KC0xMDg0NjUzNjI1LCAtMTA5MTYyOTM0MCksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTk1ODM5NTQwNSwgMHgzZGE4OGZjMiksIG5ldyBpbnQ2NCgtNzEwNDM4NTg1LCAtMTgyODAxODM5NSksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHg2Y2E2MzUxLCAtNTM2NjQwOTEzKSwgbmV3IGludDY0KDB4MTQyOTI5NjcsIDB4YTBlNmU3MCksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHgyN2I3MGE4NSwgMHg0NmQyMmZmYyksIG5ldyBpbnQ2NCgweDJlMWIyMTM4LCAweDVjMjZjOTI2KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDRkMmM2ZGZjLCAweDVhYzQyYWVkKSwgbmV3IGludDY0KDB4NTMzODBkMTMsIC0xNjUxMTMzNDczKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDY1MGE3MzU0LCAtMTk1MTQzOTkwNiksIG5ldyBpbnQ2NCgweDc2NmEwYWJiLCAweDNjNzdiMmE4KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtMjExNzk0MDk0NiwgMHg0N2VkYWVlNiksIG5ldyBpbnQ2NCgtMTgzODAxMTI1OSwgMHgxNDgyMzUzYiksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTE1NjQ0ODEzNzUsIDB4NGNmMTAzNjQpLCBuZXcgaW50NjQoLTE0NzQ2NjQ4ODUsIC0xMTM2NTEzMDIzKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtMTAzNTIzNjQ5NiwgLTc4OTAxNDYzOSksIG5ldyBpbnQ2NCgtOTQ5MjAyNTI1LCAweDY1NGJlMzApLFxuICAgICAgICAgICAgbmV3IGludDY0KC03Nzg5MDE0NzksIC02ODg5NTg5NTIpLCBuZXcgaW50NjQoLTY5NDYxNDQ5MiwgMHg1NTY1YTkxMCksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTIwMDM5NTM4NywgMHg1NzcxMjAyYSksIG5ldyBpbnQ2NCgweDEwNmFhMDcwLCAweDMyYmJkMWI4KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDE5YTRjMTE2LCAtMTE5NDE0MzU0NCksIG5ldyBpbnQ2NCgweDFlMzc2YzA4LCAweDUxNDFhYjUzKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDI3NDg3NzRjLCAtNTQ0MjgxNzAzKSwgbmV3IGludDY0KDB4MzRiMGJjYjUsIC01MDk5MTcwMTYpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4MzkxYzBjYjMsIC05NzY2NTk4NjkpLCBuZXcgaW50NjQoMHg0ZWQ4YWE0YSwgLTQ4MjI0Mzg5MyksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHg1YjljY2E0ZiwgMHg3NzYzZTM3MyksIG5ldyBpbnQ2NCgweDY4MmU2ZmYzLCAtNjkyOTMwMzk3KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDc0OGY4MmVlLCAweDVkZWZiMmZjKSwgbmV3IGludDY0KDB4NzhhNTYzNmYsIDB4NDMxNzJmNjApLFxuICAgICAgICAgICAgbmV3IGludDY0KC0yMDY3MjM2ODQ0LCAtMTU3ODA2Mjk5MCksIG5ldyBpbnQ2NCgtMTkzMzExNDg3MiwgMHgxYTY0MzllYyksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTE4NjY1MzA4MjIsIDB4MjM2MzFlMjgpLCBuZXcgaW50NjQoLTE1MzgyMzMxMDksIC01NjE4NTcwNDcpLFxuICAgICAgICAgICAgbmV3IGludDY0KC0xMDkwOTM1ODE3LCAtMTI5NTYxNTcyMyksIG5ldyBpbnQ2NCgtOTY1NjQxOTk4LCAtNDc5MDQ2ODY5KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtOTAzMzk3NjgyLCAtMzY2NTgzMzk2KSwgbmV3IGludDY0KC03Nzk3MDAwMjUsIDB4MjFjMGMyMDcpLFxuICAgICAgICAgICAgbmV3IGludDY0KC0zNTQ3Nzk2OTAsIC04NDA4OTc3NjIpLCBuZXcgaW50NjQoLTE3NjMzNzAyNSwgLTI5NDcyNzMwNCksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHg2ZjA2N2FhLCAweDcyMTc2ZmJhKSwgbmV3IGludDY0KDB4YTYzN2RjNSwgLTE1NjM5MTIwMjYpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4MTEzZjk4MDQsIC0xMDkwOTc0MjkwKSwgbmV3IGludDY0KDB4MWI3MTBiMzUsIDB4MTMxYzQ3MWIpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4MjhkYjc3ZjUsIDB4MjMwNDdkODQpLCBuZXcgaW50NjQoMHgzMmNhYWI3YiwgMHg0MGM3MjQ5MyksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHgzYzllYmUwYSwgMHgxNWM5YmViYyksIG5ldyBpbnQ2NCgweDQzMWQ2N2M0LCAtMTY3NjY2OTYyMCksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHg0Y2M1ZDRiZSwgLTg4NTExMjEzOCksIG5ldyBpbnQ2NCgweDU5N2YyOTljLCAtNjA0NTc0MzApLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4NWZjYjZmYWIsIDB4M2FkNmZhZWMpLCBuZXcgaW50NjQoMHg2YzQ0MTk4YywgMHg0YTQ3NTgxNylcbiAgICAgICAgICBdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDgwOyBpICs9IDEpIHtcbiAgICAgICAgICBXW2ldID0gbmV3IGludDY0KDAsIDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYXBwZW5kIHBhZGRpbmcgdG8gdGhlIHNvdXJjZSBzdHJpbmcuIFRoZSBmb3JtYXQgaXMgZGVzY3JpYmVkIGluIHRoZSBGSVBTLlxuICAgICAgICB4W2xlbiA+PiA1XSB8PSAweDgwIDw8ICgyNCAtIChsZW4gJiAweDFmKSk7XG4gICAgICAgIHhbKChsZW4gKyAxMjggPj4gMTApIDw8IDUpICsgMzFdID0gbGVuO1xuICAgICAgICBsID0geC5sZW5ndGg7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDMyKSB7IC8vMzIgZHdvcmRzIGlzIHRoZSBibG9jayBzaXplXG4gICAgICAgICAgaW50NjRjb3B5KGEsIEhbMF0pO1xuICAgICAgICAgIGludDY0Y29weShiLCBIWzFdKTtcbiAgICAgICAgICBpbnQ2NGNvcHkoYywgSFsyXSk7XG4gICAgICAgICAgaW50NjRjb3B5KGQsIEhbM10pO1xuICAgICAgICAgIGludDY0Y29weShlLCBIWzRdKTtcbiAgICAgICAgICBpbnQ2NGNvcHkoZiwgSFs1XSk7XG4gICAgICAgICAgaW50NjRjb3B5KGcsIEhbNl0pO1xuICAgICAgICAgIGludDY0Y29weShoLCBIWzddKTtcblxuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCAxNjsgaiArPSAxKSB7XG4gICAgICAgICAgICBXW2pdLmggPSB4W2kgKyAyICogal07XG4gICAgICAgICAgICBXW2pdLmwgPSB4W2kgKyAyICogaiArIDFdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAoaiA9IDE2OyBqIDwgODA7IGogKz0gMSkge1xuICAgICAgICAgICAgLy9zaWdtYTFcbiAgICAgICAgICAgIGludDY0cnJvdChyMSwgV1tqIC0gMl0sIDE5KTtcbiAgICAgICAgICAgIGludDY0cmV2cnJvdChyMiwgV1tqIC0gMl0sIDI5KTtcbiAgICAgICAgICAgIGludDY0c2hyKHIzLCBXW2ogLSAyXSwgNik7XG4gICAgICAgICAgICBzMS5sID0gcjEubCBeIHIyLmwgXiByMy5sO1xuICAgICAgICAgICAgczEuaCA9IHIxLmggXiByMi5oIF4gcjMuaDtcbiAgICAgICAgICAgIC8vc2lnbWEwXG4gICAgICAgICAgICBpbnQ2NHJyb3QocjEsIFdbaiAtIDE1XSwgMSk7XG4gICAgICAgICAgICBpbnQ2NHJyb3QocjIsIFdbaiAtIDE1XSwgOCk7XG4gICAgICAgICAgICBpbnQ2NHNocihyMywgV1tqIC0gMTVdLCA3KTtcbiAgICAgICAgICAgIHMwLmwgPSByMS5sIF4gcjIubCBeIHIzLmw7XG4gICAgICAgICAgICBzMC5oID0gcjEuaCBeIHIyLmggXiByMy5oO1xuXG4gICAgICAgICAgICBpbnQ2NGFkZDQoV1tqXSwgczEsIFdbaiAtIDddLCBzMCwgV1tqIC0gMTZdKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgODA7IGogKz0gMSkge1xuICAgICAgICAgICAgLy9DaFxuICAgICAgICAgICAgQ2gubCA9IChlLmwgJiBmLmwpIF4gKH5lLmwgJiBnLmwpO1xuICAgICAgICAgICAgQ2guaCA9IChlLmggJiBmLmgpIF4gKH5lLmggJiBnLmgpO1xuXG4gICAgICAgICAgICAvL1NpZ21hMVxuICAgICAgICAgICAgaW50NjRycm90KHIxLCBlLCAxNCk7XG4gICAgICAgICAgICBpbnQ2NHJyb3QocjIsIGUsIDE4KTtcbiAgICAgICAgICAgIGludDY0cmV2cnJvdChyMywgZSwgOSk7XG4gICAgICAgICAgICBzMS5sID0gcjEubCBeIHIyLmwgXiByMy5sO1xuICAgICAgICAgICAgczEuaCA9IHIxLmggXiByMi5oIF4gcjMuaDtcblxuICAgICAgICAgICAgLy9TaWdtYTBcbiAgICAgICAgICAgIGludDY0cnJvdChyMSwgYSwgMjgpO1xuICAgICAgICAgICAgaW50NjRyZXZycm90KHIyLCBhLCAyKTtcbiAgICAgICAgICAgIGludDY0cmV2cnJvdChyMywgYSwgNyk7XG4gICAgICAgICAgICBzMC5sID0gcjEubCBeIHIyLmwgXiByMy5sO1xuICAgICAgICAgICAgczAuaCA9IHIxLmggXiByMi5oIF4gcjMuaDtcblxuICAgICAgICAgICAgLy9NYWpcbiAgICAgICAgICAgIE1hai5sID0gKGEubCAmIGIubCkgXiAoYS5sICYgYy5sKSBeIChiLmwgJiBjLmwpO1xuICAgICAgICAgICAgTWFqLmggPSAoYS5oICYgYi5oKSBeIChhLmggJiBjLmgpIF4gKGIuaCAmIGMuaCk7XG5cbiAgICAgICAgICAgIGludDY0YWRkNShUMSwgaCwgczEsIENoLCBzaGE1MTJfa1tqXSwgV1tqXSk7XG4gICAgICAgICAgICBpbnQ2NGFkZChUMiwgczAsIE1haik7XG5cbiAgICAgICAgICAgIGludDY0Y29weShoLCBnKTtcbiAgICAgICAgICAgIGludDY0Y29weShnLCBmKTtcbiAgICAgICAgICAgIGludDY0Y29weShmLCBlKTtcbiAgICAgICAgICAgIGludDY0YWRkKGUsIGQsIFQxKTtcbiAgICAgICAgICAgIGludDY0Y29weShkLCBjKTtcbiAgICAgICAgICAgIGludDY0Y29weShjLCBiKTtcbiAgICAgICAgICAgIGludDY0Y29weShiLCBhKTtcbiAgICAgICAgICAgIGludDY0YWRkKGEsIFQxLCBUMik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGludDY0YWRkKEhbMF0sIEhbMF0sIGEpO1xuICAgICAgICAgIGludDY0YWRkKEhbMV0sIEhbMV0sIGIpO1xuICAgICAgICAgIGludDY0YWRkKEhbMl0sIEhbMl0sIGMpO1xuICAgICAgICAgIGludDY0YWRkKEhbM10sIEhbM10sIGQpO1xuICAgICAgICAgIGludDY0YWRkKEhbNF0sIEhbNF0sIGUpO1xuICAgICAgICAgIGludDY0YWRkKEhbNV0sIEhbNV0sIGYpO1xuICAgICAgICAgIGludDY0YWRkKEhbNl0sIEhbNl0sIGcpO1xuICAgICAgICAgIGludDY0YWRkKEhbN10sIEhbN10sIGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9yZXByZXNlbnQgdGhlIGhhc2ggYXMgYW4gYXJyYXkgb2YgMzItYml0IGR3b3Jkc1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgODsgaSArPSAxKSB7XG4gICAgICAgICAgaGFzaFsyICogaV0gPSBIW2ldLmg7XG4gICAgICAgICAgaGFzaFsyICogaSArIDFdID0gSFtpXS5sO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYXNoO1xuICAgICAgfVxuXG4gICAgICAvL0EgY29uc3RydWN0b3IgZm9yIDY0LWJpdCBudW1iZXJzXG5cbiAgICAgIGZ1bmN0aW9uIGludDY0KGgsIGwpIHtcbiAgICAgICAgdGhpcy5oID0gaDtcbiAgICAgICAgdGhpcy5sID0gbDtcbiAgICAgICAgLy90aGlzLnRvU3RyaW5nID0gaW50NjR0b1N0cmluZztcbiAgICAgIH1cblxuICAgICAgLy9Db3BpZXMgc3JjIGludG8gZHN0LCBhc3N1bWluZyBib3RoIGFyZSA2NC1iaXQgbnVtYmVyc1xuXG4gICAgICBmdW5jdGlvbiBpbnQ2NGNvcHkoZHN0LCBzcmMpIHtcbiAgICAgICAgZHN0LmggPSBzcmMuaDtcbiAgICAgICAgZHN0LmwgPSBzcmMubDtcbiAgICAgIH1cblxuICAgICAgLy9SaWdodC1yb3RhdGVzIGEgNjQtYml0IG51bWJlciBieSBzaGlmdFxuICAgICAgLy9Xb24ndCBoYW5kbGUgY2FzZXMgb2Ygc2hpZnQ+PTMyXG4gICAgICAvL1RoZSBmdW5jdGlvbiByZXZycm90KCkgaXMgZm9yIHRoYXRcblxuICAgICAgZnVuY3Rpb24gaW50NjRycm90KGRzdCwgeCwgc2hpZnQpIHtcbiAgICAgICAgZHN0LmwgPSAoeC5sID4+PiBzaGlmdCkgfCAoeC5oIDw8ICgzMiAtIHNoaWZ0KSk7XG4gICAgICAgIGRzdC5oID0gKHguaCA+Pj4gc2hpZnQpIHwgKHgubCA8PCAoMzIgLSBzaGlmdCkpO1xuICAgICAgfVxuXG4gICAgICAvL1JldmVyc2VzIHRoZSBkd29yZHMgb2YgdGhlIHNvdXJjZSBhbmQgdGhlbiByb3RhdGVzIHJpZ2h0IGJ5IHNoaWZ0LlxuICAgICAgLy9UaGlzIGlzIGVxdWl2YWxlbnQgdG8gcm90YXRpb24gYnkgMzIrc2hpZnRcblxuICAgICAgZnVuY3Rpb24gaW50NjRyZXZycm90KGRzdCwgeCwgc2hpZnQpIHtcbiAgICAgICAgZHN0LmwgPSAoeC5oID4+PiBzaGlmdCkgfCAoeC5sIDw8ICgzMiAtIHNoaWZ0KSk7XG4gICAgICAgIGRzdC5oID0gKHgubCA+Pj4gc2hpZnQpIHwgKHguaCA8PCAoMzIgLSBzaGlmdCkpO1xuICAgICAgfVxuXG4gICAgICAvL0JpdHdpc2Utc2hpZnRzIHJpZ2h0IGEgNjQtYml0IG51bWJlciBieSBzaGlmdFxuICAgICAgLy9Xb24ndCBoYW5kbGUgc2hpZnQ+PTMyLCBidXQgaXQncyBuZXZlciBuZWVkZWQgaW4gU0hBNTEyXG5cbiAgICAgIGZ1bmN0aW9uIGludDY0c2hyKGRzdCwgeCwgc2hpZnQpIHtcbiAgICAgICAgZHN0LmwgPSAoeC5sID4+PiBzaGlmdCkgfCAoeC5oIDw8ICgzMiAtIHNoaWZ0KSk7XG4gICAgICAgIGRzdC5oID0gKHguaCA+Pj4gc2hpZnQpO1xuICAgICAgfVxuXG4gICAgICAvL0FkZHMgdHdvIDY0LWJpdCBudW1iZXJzXG4gICAgICAvL0xpa2UgdGhlIG9yaWdpbmFsIGltcGxlbWVudGF0aW9uLCBkb2VzIG5vdCByZWx5IG9uIDMyLWJpdCBvcGVyYXRpb25zXG5cbiAgICAgIGZ1bmN0aW9uIGludDY0YWRkKGRzdCwgeCwgeSkge1xuICAgICAgICB2YXIgdzAgPSAoeC5sICYgMHhmZmZmKSArICh5LmwgJiAweGZmZmYpO1xuICAgICAgICB2YXIgdzEgPSAoeC5sID4+PiAxNikgKyAoeS5sID4+PiAxNikgKyAodzAgPj4+IDE2KTtcbiAgICAgICAgdmFyIHcyID0gKHguaCAmIDB4ZmZmZikgKyAoeS5oICYgMHhmZmZmKSArICh3MSA+Pj4gMTYpO1xuICAgICAgICB2YXIgdzMgPSAoeC5oID4+PiAxNikgKyAoeS5oID4+PiAxNikgKyAodzIgPj4+IDE2KTtcbiAgICAgICAgZHN0LmwgPSAodzAgJiAweGZmZmYpIHwgKHcxIDw8IDE2KTtcbiAgICAgICAgZHN0LmggPSAodzIgJiAweGZmZmYpIHwgKHczIDw8IDE2KTtcbiAgICAgIH1cblxuICAgICAgLy9TYW1lLCBleGNlcHQgd2l0aCA0IGFkZGVuZHMuIFdvcmtzIGZhc3RlciB0aGFuIGFkZGluZyB0aGVtIG9uZSBieSBvbmUuXG5cbiAgICAgIGZ1bmN0aW9uIGludDY0YWRkNChkc3QsIGEsIGIsIGMsIGQpIHtcbiAgICAgICAgdmFyIHcwID0gKGEubCAmIDB4ZmZmZikgKyAoYi5sICYgMHhmZmZmKSArIChjLmwgJiAweGZmZmYpICsgKGQubCAmIDB4ZmZmZik7XG4gICAgICAgIHZhciB3MSA9IChhLmwgPj4+IDE2KSArIChiLmwgPj4+IDE2KSArIChjLmwgPj4+IDE2KSArIChkLmwgPj4+IDE2KSArICh3MCA+Pj4gMTYpO1xuICAgICAgICB2YXIgdzIgPSAoYS5oICYgMHhmZmZmKSArIChiLmggJiAweGZmZmYpICsgKGMuaCAmIDB4ZmZmZikgKyAoZC5oICYgMHhmZmZmKSArICh3MSA+Pj4gMTYpO1xuICAgICAgICB2YXIgdzMgPSAoYS5oID4+PiAxNikgKyAoYi5oID4+PiAxNikgKyAoYy5oID4+PiAxNikgKyAoZC5oID4+PiAxNikgKyAodzIgPj4+IDE2KTtcbiAgICAgICAgZHN0LmwgPSAodzAgJiAweGZmZmYpIHwgKHcxIDw8IDE2KTtcbiAgICAgICAgZHN0LmggPSAodzIgJiAweGZmZmYpIHwgKHczIDw8IDE2KTtcbiAgICAgIH1cblxuICAgICAgLy9TYW1lLCBleGNlcHQgd2l0aCA1IGFkZGVuZHNcblxuICAgICAgZnVuY3Rpb24gaW50NjRhZGQ1KGRzdCwgYSwgYiwgYywgZCwgZSkge1xuICAgICAgICB2YXIgdzAgPSAoYS5sICYgMHhmZmZmKSArIChiLmwgJiAweGZmZmYpICsgKGMubCAmIDB4ZmZmZikgKyAoZC5sICYgMHhmZmZmKSArIChlLmwgJiAweGZmZmYpLFxuICAgICAgICAgIHcxID0gKGEubCA+Pj4gMTYpICsgKGIubCA+Pj4gMTYpICsgKGMubCA+Pj4gMTYpICsgKGQubCA+Pj4gMTYpICsgKGUubCA+Pj4gMTYpICsgKHcwID4+PiAxNiksXG4gICAgICAgICAgdzIgPSAoYS5oICYgMHhmZmZmKSArIChiLmggJiAweGZmZmYpICsgKGMuaCAmIDB4ZmZmZikgKyAoZC5oICYgMHhmZmZmKSArIChlLmggJiAweGZmZmYpICsgKHcxID4+PiAxNiksXG4gICAgICAgICAgdzMgPSAoYS5oID4+PiAxNikgKyAoYi5oID4+PiAxNikgKyAoYy5oID4+PiAxNikgKyAoZC5oID4+PiAxNikgKyAoZS5oID4+PiAxNikgKyAodzIgPj4+IDE2KTtcbiAgICAgICAgZHN0LmwgPSAodzAgJiAweGZmZmYpIHwgKHcxIDw8IDE2KTtcbiAgICAgICAgZHN0LmggPSAodzIgJiAweGZmZmYpIHwgKHczIDw8IDE2KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBIYXNoZXMuUk1EMTYwXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWddXG4gICAgICpcbiAgICAgKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFJJUEVNRC0xNjAgQWxnb3JpdGhtXG4gICAgICogVmVyc2lvbiAyLjIgQ29weXJpZ2h0IEplcmVteSBMaW4sIFBhdWwgSm9obnN0b24gMjAwMCAtIDIwMDkuXG4gICAgICogT3RoZXIgY29udHJpYnV0b3JzOiBHcmVnIEhvbHQsIEFuZHJldyBLZXBlcnQsIFlkbmFyLCBMb3N0aW5ldFxuICAgICAqIFNlZSBodHRwOi8vcGFqaG9tZS5vcmcudWsvY3J5cHQvbWQ1IGZvciBkZXRhaWxzLlxuICAgICAqIEFsc28gaHR0cDovL3d3dy5vY2YuYmVya2VsZXkuZWR1L35qamxpbi9qc290cC9cbiAgICAgKi9cbiAgICBSTUQxNjA6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgIC8qKlxuICAgICAgICogUHJpdmF0ZSBwcm9wZXJ0aWVzIGNvbmZpZ3VyYXRpb24gdmFyaWFibGVzLiBZb3UgbWF5IG5lZWQgdG8gdHdlYWsgdGhlc2UgdG8gYmUgY29tcGF0aWJsZSB3aXRoXG4gICAgICAgKiB0aGUgc2VydmVyLXNpZGUsIGJ1dCB0aGUgZGVmYXVsdHMgd29yayBpbiBtb3N0IGNhc2VzLlxuICAgICAgICogQHNlZSB0aGlzLnNldFVwcGVyQ2FzZSgpIG1ldGhvZFxuICAgICAgICogQHNlZSB0aGlzLnNldFBhZCgpIG1ldGhvZFxuICAgICAgICovXG4gICAgICB2YXIgaGV4Y2FzZSA9IChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnVwcGVyY2FzZSA9PT0gJ2Jvb2xlYW4nKSA/IG9wdGlvbnMudXBwZXJjYXNlIDogZmFsc2UsXG4gICAgICAgIC8qIGhleGFkZWNpbWFsIG91dHB1dCBjYXNlIGZvcm1hdC4gZmFsc2UgLSBsb3dlcmNhc2U7IHRydWUgLSB1cHBlcmNhc2UgICovXG4gICAgICAgIGI2NHBhZCA9IChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnBhZCA9PT0gJ3N0cmluZycpID8gb3B0aW9ucy5wYSA6ICc9JyxcbiAgICAgICAgLyogYmFzZS02NCBwYWQgY2hhcmFjdGVyLiBEZWZhdWx0ICc9JyBmb3Igc3RyaWN0IFJGQyBjb21wbGlhbmNlICAgKi9cbiAgICAgICAgdXRmOCA9IChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnV0ZjggPT09ICdib29sZWFuJykgPyBvcHRpb25zLnV0ZjggOiB0cnVlLFxuICAgICAgICAvKiBlbmFibGUvZGlzYWJsZSB1dGY4IGVuY29kaW5nICovXG4gICAgICAgIHJtZDE2MF9yMSA9IFtcbiAgICAgICAgICAwLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMywgMTQsIDE1LFxuICAgICAgICAgIDcsIDQsIDEzLCAxLCAxMCwgNiwgMTUsIDMsIDEyLCAwLCA5LCA1LCAyLCAxNCwgMTEsIDgsXG4gICAgICAgICAgMywgMTAsIDE0LCA0LCA5LCAxNSwgOCwgMSwgMiwgNywgMCwgNiwgMTMsIDExLCA1LCAxMixcbiAgICAgICAgICAxLCA5LCAxMSwgMTAsIDAsIDgsIDEyLCA0LCAxMywgMywgNywgMTUsIDE0LCA1LCA2LCAyLFxuICAgICAgICAgIDQsIDAsIDUsIDksIDcsIDEyLCAyLCAxMCwgMTQsIDEsIDMsIDgsIDExLCA2LCAxNSwgMTNcbiAgICAgICAgXSxcbiAgICAgICAgcm1kMTYwX3IyID0gW1xuICAgICAgICAgIDUsIDE0LCA3LCAwLCA5LCAyLCAxMSwgNCwgMTMsIDYsIDE1LCA4LCAxLCAxMCwgMywgMTIsXG4gICAgICAgICAgNiwgMTEsIDMsIDcsIDAsIDEzLCA1LCAxMCwgMTQsIDE1LCA4LCAxMiwgNCwgOSwgMSwgMixcbiAgICAgICAgICAxNSwgNSwgMSwgMywgNywgMTQsIDYsIDksIDExLCA4LCAxMiwgMiwgMTAsIDAsIDQsIDEzLFxuICAgICAgICAgIDgsIDYsIDQsIDEsIDMsIDExLCAxNSwgMCwgNSwgMTIsIDIsIDEzLCA5LCA3LCAxMCwgMTQsXG4gICAgICAgICAgMTIsIDE1LCAxMCwgNCwgMSwgNSwgOCwgNywgNiwgMiwgMTMsIDE0LCAwLCAzLCA5LCAxMVxuICAgICAgICBdLFxuICAgICAgICBybWQxNjBfczEgPSBbXG4gICAgICAgICAgMTEsIDE0LCAxNSwgMTIsIDUsIDgsIDcsIDksIDExLCAxMywgMTQsIDE1LCA2LCA3LCA5LCA4LFxuICAgICAgICAgIDcsIDYsIDgsIDEzLCAxMSwgOSwgNywgMTUsIDcsIDEyLCAxNSwgOSwgMTEsIDcsIDEzLCAxMixcbiAgICAgICAgICAxMSwgMTMsIDYsIDcsIDE0LCA5LCAxMywgMTUsIDE0LCA4LCAxMywgNiwgNSwgMTIsIDcsIDUsXG4gICAgICAgICAgMTEsIDEyLCAxNCwgMTUsIDE0LCAxNSwgOSwgOCwgOSwgMTQsIDUsIDYsIDgsIDYsIDUsIDEyLFxuICAgICAgICAgIDksIDE1LCA1LCAxMSwgNiwgOCwgMTMsIDEyLCA1LCAxMiwgMTMsIDE0LCAxMSwgOCwgNSwgNlxuICAgICAgICBdLFxuICAgICAgICBybWQxNjBfczIgPSBbXG4gICAgICAgICAgOCwgOSwgOSwgMTEsIDEzLCAxNSwgMTUsIDUsIDcsIDcsIDgsIDExLCAxNCwgMTQsIDEyLCA2LFxuICAgICAgICAgIDksIDEzLCAxNSwgNywgMTIsIDgsIDksIDExLCA3LCA3LCAxMiwgNywgNiwgMTUsIDEzLCAxMSxcbiAgICAgICAgICA5LCA3LCAxNSwgMTEsIDgsIDYsIDYsIDE0LCAxMiwgMTMsIDUsIDE0LCAxMywgMTMsIDcsIDUsXG4gICAgICAgICAgMTUsIDUsIDgsIDExLCAxNCwgMTQsIDYsIDE0LCA2LCA5LCAxMiwgOSwgMTIsIDUsIDE1LCA4LFxuICAgICAgICAgIDgsIDUsIDEyLCA5LCAxMiwgNSwgMTQsIDYsIDgsIDEzLCA2LCA1LCAxNSwgMTMsIDExLCAxMVxuICAgICAgICBdO1xuXG4gICAgICAvKiBwcml2aWxlZ2VkIChwdWJsaWMpIG1ldGhvZHMgKi9cbiAgICAgIHRoaXMuaGV4ID0gZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcnN0cjJoZXgocnN0cihzLCB1dGY4KSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5iNjQgPSBmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiByc3RyMmI2NChyc3RyKHMsIHV0ZjgpLCBiNjRwYWQpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYW55ID0gZnVuY3Rpb24ocywgZSkge1xuICAgICAgICByZXR1cm4gcnN0cjJhbnkocnN0cihzLCB1dGY4KSwgZSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5yYXcgPSBmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiByc3RyKHMsIHV0ZjgpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuaGV4X2htYWMgPSBmdW5jdGlvbihrLCBkKSB7XG4gICAgICAgIHJldHVybiByc3RyMmhleChyc3RyX2htYWMoaywgZCkpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYjY0X2htYWMgPSBmdW5jdGlvbihrLCBkKSB7XG4gICAgICAgIHJldHVybiByc3RyMmI2NChyc3RyX2htYWMoaywgZCksIGI2NHBhZCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5hbnlfaG1hYyA9IGZ1bmN0aW9uKGssIGQsIGUpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYW55KHJzdHJfaG1hYyhrLCBkKSwgZSk7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBQZXJmb3JtIGEgc2ltcGxlIHNlbGYtdGVzdCB0byBzZWUgaWYgdGhlIFZNIGlzIHdvcmtpbmdcbiAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gSGV4YWRlY2ltYWwgaGFzaCBzYW1wbGVcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgICAgdGhpcy52bV90ZXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBoZXgoJ2FiYycpLnRvTG93ZXJDYXNlKCkgPT09ICc5MDAxNTA5ODNjZDI0ZmIwZDY5NjNmN2QyOGUxN2Y3Mic7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBAZGVzY3JpcHRpb24gRW5hYmxlL2Rpc2FibGUgdXBwZXJjYXNlIGhleGFkZWNpbWFsIHJldHVybmVkIHN0cmluZ1xuICAgICAgICogQHBhcmFtIHtib29sZWFufVxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2V0VXBwZXJDYXNlID0gZnVuY3Rpb24oYSkge1xuICAgICAgICBpZiAodHlwZW9mIGEgPT09ICdib29sZWFuJykge1xuICAgICAgICAgIGhleGNhc2UgPSBhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogQGRlc2NyaXB0aW9uIERlZmluZXMgYSBiYXNlNjQgcGFkIHN0cmluZ1xuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IFBhZFxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2V0UGFkID0gZnVuY3Rpb24oYSkge1xuICAgICAgICBpZiAodHlwZW9mIGEgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgYjY0cGFkID0gYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIEBkZXNjcmlwdGlvbiBEZWZpbmVzIGEgYmFzZTY0IHBhZCBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn1cbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhpc1xuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgICB0aGlzLnNldFVURjggPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgdXRmOCA9IGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuXG4gICAgICAvKiBwcml2YXRlIG1ldGhvZHMgKi9cblxuICAgICAgLyoqXG4gICAgICAgKiBDYWxjdWxhdGUgdGhlIHJtZDE2MCBvZiBhIHJhdyBzdHJpbmdcbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiByc3RyKHMpIHtcbiAgICAgICAgcyA9ICh1dGY4KSA/IHV0ZjhFbmNvZGUocykgOiBzO1xuICAgICAgICByZXR1cm4gYmlubDJyc3RyKGJpbmwocnN0cjJiaW5sKHMpLCBzLmxlbmd0aCAqIDgpKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDYWxjdWxhdGUgdGhlIEhNQUMtcm1kMTYwIG9mIGEga2V5IGFuZCBzb21lIGRhdGEgKHJhdyBzdHJpbmdzKVxuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIHJzdHJfaG1hYyhrZXksIGRhdGEpIHtcbiAgICAgICAga2V5ID0gKHV0ZjgpID8gdXRmOEVuY29kZShrZXkpIDoga2V5O1xuICAgICAgICBkYXRhID0gKHV0ZjgpID8gdXRmOEVuY29kZShkYXRhKSA6IGRhdGE7XG4gICAgICAgIHZhciBpLCBoYXNoLFxuICAgICAgICAgIGJrZXkgPSByc3RyMmJpbmwoa2V5KSxcbiAgICAgICAgICBpcGFkID0gQXJyYXkoMTYpLFxuICAgICAgICAgIG9wYWQgPSBBcnJheSgxNik7XG5cbiAgICAgICAgaWYgKGJrZXkubGVuZ3RoID4gMTYpIHtcbiAgICAgICAgICBia2V5ID0gYmlubChia2V5LCBrZXkubGVuZ3RoICogOCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTY7IGkgKz0gMSkge1xuICAgICAgICAgIGlwYWRbaV0gPSBia2V5W2ldIF4gMHgzNjM2MzYzNjtcbiAgICAgICAgICBvcGFkW2ldID0gYmtleVtpXSBeIDB4NUM1QzVDNUM7XG4gICAgICAgIH1cbiAgICAgICAgaGFzaCA9IGJpbmwoaXBhZC5jb25jYXQocnN0cjJiaW5sKGRhdGEpKSwgNTEyICsgZGF0YS5sZW5ndGggKiA4KTtcbiAgICAgICAgcmV0dXJuIGJpbmwycnN0cihiaW5sKG9wYWQuY29uY2F0KGhhc2gpLCA1MTIgKyAxNjApKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDb252ZXJ0IGFuIGFycmF5IG9mIGxpdHRsZS1lbmRpYW4gd29yZHMgdG8gYSBzdHJpbmdcbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiBiaW5sMnJzdHIoaW5wdXQpIHtcbiAgICAgICAgdmFyIGksIG91dHB1dCA9ICcnLFxuICAgICAgICAgIGwgPSBpbnB1dC5sZW5ndGggKiAzMjtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gOCkge1xuICAgICAgICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKChpbnB1dFtpID4+IDVdID4+PiAoaSAlIDMyKSkgJiAweEZGKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIENhbGN1bGF0ZSB0aGUgUklQRS1NRDE2MCBvZiBhbiBhcnJheSBvZiBsaXR0bGUtZW5kaWFuIHdvcmRzLCBhbmQgYSBiaXQgbGVuZ3RoLlxuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIGJpbmwoeCwgbGVuKSB7XG4gICAgICAgIHZhciBULCBqLCBpLCBsLFxuICAgICAgICAgIGgwID0gMHg2NzQ1MjMwMSxcbiAgICAgICAgICBoMSA9IDB4ZWZjZGFiODksXG4gICAgICAgICAgaDIgPSAweDk4YmFkY2ZlLFxuICAgICAgICAgIGgzID0gMHgxMDMyNTQ3NixcbiAgICAgICAgICBoNCA9IDB4YzNkMmUxZjAsXG4gICAgICAgICAgQTEsIEIxLCBDMSwgRDEsIEUxLFxuICAgICAgICAgIEEyLCBCMiwgQzIsIEQyLCBFMjtcblxuICAgICAgICAvKiBhcHBlbmQgcGFkZGluZyAqL1xuICAgICAgICB4W2xlbiA+PiA1XSB8PSAweDgwIDw8IChsZW4gJSAzMik7XG4gICAgICAgIHhbKCgobGVuICsgNjQpID4+PiA5KSA8PCA0KSArIDE0XSA9IGxlbjtcbiAgICAgICAgbCA9IHgubGVuZ3RoO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDE2KSB7XG4gICAgICAgICAgQTEgPSBBMiA9IGgwO1xuICAgICAgICAgIEIxID0gQjIgPSBoMTtcbiAgICAgICAgICBDMSA9IEMyID0gaDI7XG4gICAgICAgICAgRDEgPSBEMiA9IGgzO1xuICAgICAgICAgIEUxID0gRTIgPSBoNDtcbiAgICAgICAgICBmb3IgKGogPSAwOyBqIDw9IDc5OyBqICs9IDEpIHtcbiAgICAgICAgICAgIFQgPSBzYWZlX2FkZChBMSwgcm1kMTYwX2YoaiwgQjEsIEMxLCBEMSkpO1xuICAgICAgICAgICAgVCA9IHNhZmVfYWRkKFQsIHhbaSArIHJtZDE2MF9yMVtqXV0pO1xuICAgICAgICAgICAgVCA9IHNhZmVfYWRkKFQsIHJtZDE2MF9LMShqKSk7XG4gICAgICAgICAgICBUID0gc2FmZV9hZGQoYml0X3JvbChULCBybWQxNjBfczFbal0pLCBFMSk7XG4gICAgICAgICAgICBBMSA9IEUxO1xuICAgICAgICAgICAgRTEgPSBEMTtcbiAgICAgICAgICAgIEQxID0gYml0X3JvbChDMSwgMTApO1xuICAgICAgICAgICAgQzEgPSBCMTtcbiAgICAgICAgICAgIEIxID0gVDtcbiAgICAgICAgICAgIFQgPSBzYWZlX2FkZChBMiwgcm1kMTYwX2YoNzkgLSBqLCBCMiwgQzIsIEQyKSk7XG4gICAgICAgICAgICBUID0gc2FmZV9hZGQoVCwgeFtpICsgcm1kMTYwX3IyW2pdXSk7XG4gICAgICAgICAgICBUID0gc2FmZV9hZGQoVCwgcm1kMTYwX0syKGopKTtcbiAgICAgICAgICAgIFQgPSBzYWZlX2FkZChiaXRfcm9sKFQsIHJtZDE2MF9zMltqXSksIEUyKTtcbiAgICAgICAgICAgIEEyID0gRTI7XG4gICAgICAgICAgICBFMiA9IEQyO1xuICAgICAgICAgICAgRDIgPSBiaXRfcm9sKEMyLCAxMCk7XG4gICAgICAgICAgICBDMiA9IEIyO1xuICAgICAgICAgICAgQjIgPSBUO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIFQgPSBzYWZlX2FkZChoMSwgc2FmZV9hZGQoQzEsIEQyKSk7XG4gICAgICAgICAgaDEgPSBzYWZlX2FkZChoMiwgc2FmZV9hZGQoRDEsIEUyKSk7XG4gICAgICAgICAgaDIgPSBzYWZlX2FkZChoMywgc2FmZV9hZGQoRTEsIEEyKSk7XG4gICAgICAgICAgaDMgPSBzYWZlX2FkZChoNCwgc2FmZV9hZGQoQTEsIEIyKSk7XG4gICAgICAgICAgaDQgPSBzYWZlX2FkZChoMCwgc2FmZV9hZGQoQjEsIEMyKSk7XG4gICAgICAgICAgaDAgPSBUO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbaDAsIGgxLCBoMiwgaDMsIGg0XTtcbiAgICAgIH1cblxuICAgICAgLy8gc3BlY2lmaWMgYWxnb3JpdGhtIG1ldGhvZHNcblxuICAgICAgZnVuY3Rpb24gcm1kMTYwX2YoaiwgeCwgeSwgeikge1xuICAgICAgICByZXR1cm4gKDAgPD0gaiAmJiBqIDw9IDE1KSA/ICh4IF4geSBeIHopIDpcbiAgICAgICAgICAoMTYgPD0gaiAmJiBqIDw9IDMxKSA/ICh4ICYgeSkgfCAofnggJiB6KSA6XG4gICAgICAgICAgKDMyIDw9IGogJiYgaiA8PSA0NykgPyAoeCB8IH55KSBeIHogOlxuICAgICAgICAgICg0OCA8PSBqICYmIGogPD0gNjMpID8gKHggJiB6KSB8ICh5ICYgfnopIDpcbiAgICAgICAgICAoNjQgPD0gaiAmJiBqIDw9IDc5KSA/IHggXiAoeSB8IH56KSA6XG4gICAgICAgICAgJ3JtZDE2MF9mOiBqIG91dCBvZiByYW5nZSc7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJtZDE2MF9LMShqKSB7XG4gICAgICAgIHJldHVybiAoMCA8PSBqICYmIGogPD0gMTUpID8gMHgwMDAwMDAwMCA6XG4gICAgICAgICAgKDE2IDw9IGogJiYgaiA8PSAzMSkgPyAweDVhODI3OTk5IDpcbiAgICAgICAgICAoMzIgPD0gaiAmJiBqIDw9IDQ3KSA/IDB4NmVkOWViYTEgOlxuICAgICAgICAgICg0OCA8PSBqICYmIGogPD0gNjMpID8gMHg4ZjFiYmNkYyA6XG4gICAgICAgICAgKDY0IDw9IGogJiYgaiA8PSA3OSkgPyAweGE5NTNmZDRlIDpcbiAgICAgICAgICAncm1kMTYwX0sxOiBqIG91dCBvZiByYW5nZSc7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHJtZDE2MF9LMihqKSB7XG4gICAgICAgIHJldHVybiAoMCA8PSBqICYmIGogPD0gMTUpID8gMHg1MGEyOGJlNiA6XG4gICAgICAgICAgKDE2IDw9IGogJiYgaiA8PSAzMSkgPyAweDVjNGRkMTI0IDpcbiAgICAgICAgICAoMzIgPD0gaiAmJiBqIDw9IDQ3KSA/IDB4NmQ3MDNlZjMgOlxuICAgICAgICAgICg0OCA8PSBqICYmIGogPD0gNjMpID8gMHg3YTZkNzZlOSA6XG4gICAgICAgICAgKDY0IDw9IGogJiYgaiA8PSA3OSkgPyAweDAwMDAwMDAwIDpcbiAgICAgICAgICAncm1kMTYwX0syOiBqIG91dCBvZiByYW5nZSc7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIGV4cG9zZXMgSGFzaGVzXG4gIChmdW5jdGlvbih3aW5kb3csIHVuZGVmaW5lZCkge1xuICAgIHZhciBmcmVlRXhwb3J0cyA9IGZhbHNlO1xuICAgIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGZyZWVFeHBvcnRzID0gZXhwb3J0cztcbiAgICAgIGlmIChleHBvcnRzICYmIHR5cGVvZiBnbG9iYWwgPT09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwgPT09IGdsb2JhbC5nbG9iYWwpIHtcbiAgICAgICAgd2luZG93ID0gZ2xvYmFsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAvLyBkZWZpbmUgYXMgYW4gYW5vbnltb3VzIG1vZHVsZSwgc28sIHRocm91Z2ggcGF0aCBtYXBwaW5nLCBpdCBjYW4gYmUgYWxpYXNlZFxuICAgICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gSGFzaGVzO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChmcmVlRXhwb3J0cykge1xuICAgICAgLy8gaW4gTm9kZS5qcyBvciBSaW5nb0pTIHYwLjguMCtcbiAgICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gSGFzaGVzO1xuICAgICAgfVxuICAgICAgLy8gaW4gTmFyd2hhbCBvciBSaW5nb0pTIHYwLjcuMC1cbiAgICAgIGVsc2Uge1xuICAgICAgICBmcmVlRXhwb3J0cy5IYXNoZXMgPSBIYXNoZXM7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGluIGEgYnJvd3NlciBvciBSaGlub1xuICAgICAgd2luZG93Lkhhc2hlcyA9IEhhc2hlcztcbiAgICB9XG4gIH0odGhpcykpO1xufSgpKTsgLy8gSUlGRVxuIiwiZnVuY3Rpb24gQWdlbnQoKSB7XG4gIHRoaXMuX2RlZmF1bHRzID0gW107XG59XG5cbltcInVzZVwiLCBcIm9uXCIsIFwib25jZVwiLCBcInNldFwiLCBcInF1ZXJ5XCIsIFwidHlwZVwiLCBcImFjY2VwdFwiLCBcImF1dGhcIiwgXCJ3aXRoQ3JlZGVudGlhbHNcIiwgXCJzb3J0UXVlcnlcIiwgXCJyZXRyeVwiLCBcIm9rXCIsIFwicmVkaXJlY3RzXCIsXG4gXCJ0aW1lb3V0XCIsIFwiYnVmZmVyXCIsIFwic2VyaWFsaXplXCIsIFwicGFyc2VcIiwgXCJjYVwiLCBcImtleVwiLCBcInBmeFwiLCBcImNlcnRcIl0uZm9yRWFjaChmdW5jdGlvbihmbikge1xuICAvKiogRGVmYXVsdCBzZXR0aW5nIGZvciBhbGwgcmVxdWVzdHMgZnJvbSB0aGlzIGFnZW50ICovXG4gIEFnZW50LnByb3RvdHlwZVtmbl0gPSBmdW5jdGlvbigvKnZhcmFyZ3MqLykge1xuICAgIHRoaXMuX2RlZmF1bHRzLnB1c2goe2ZuOmZuLCBhcmd1bWVudHM6YXJndW1lbnRzfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn0pO1xuXG5BZ2VudC5wcm90b3R5cGUuX3NldERlZmF1bHRzID0gZnVuY3Rpb24ocmVxKSB7XG4gICAgdGhpcy5fZGVmYXVsdHMuZm9yRWFjaChmdW5jdGlvbihkZWYpIHtcbiAgICAgIHJlcVtkZWYuZm5dLmFwcGx5KHJlcSwgZGVmLmFyZ3VtZW50cyk7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFnZW50O1xuIiwiLyoqXG4gKiBSb290IHJlZmVyZW5jZSBmb3IgaWZyYW1lcy5cbiAqL1xuXG52YXIgcm9vdDtcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgeyAvLyBCcm93c2VyIHdpbmRvd1xuICByb290ID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHsgLy8gV2ViIFdvcmtlclxuICByb290ID0gc2VsZjtcbn0gZWxzZSB7IC8vIE90aGVyIGVudmlyb25tZW50c1xuICBjb25zb2xlLndhcm4oXCJVc2luZyBicm93c2VyLW9ubHkgdmVyc2lvbiBvZiBzdXBlcmFnZW50IGluIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuICByb290ID0gdGhpcztcbn1cblxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCdjb21wb25lbnQtZW1pdHRlcicpO1xudmFyIFJlcXVlc3RCYXNlID0gcmVxdWlyZSgnLi9yZXF1ZXN0LWJhc2UnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXMtb2JqZWN0Jyk7XG52YXIgUmVzcG9uc2VCYXNlID0gcmVxdWlyZSgnLi9yZXNwb25zZS1iYXNlJyk7XG52YXIgQWdlbnQgPSByZXF1aXJlKCcuL2FnZW50LWJhc2UnKTtcblxuLyoqXG4gKiBOb29wLlxuICovXG5cbmZ1bmN0aW9uIG5vb3AoKXt9O1xuXG4vKipcbiAqIEV4cG9zZSBgcmVxdWVzdGAuXG4gKi9cblxudmFyIHJlcXVlc3QgPSBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtZXRob2QsIHVybCkge1xuICAvLyBjYWxsYmFja1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgdXJsKSB7XG4gICAgcmV0dXJuIG5ldyBleHBvcnRzLlJlcXVlc3QoJ0dFVCcsIG1ldGhvZCkuZW5kKHVybCk7XG4gIH1cblxuICAvLyB1cmwgZmlyc3RcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHJldHVybiBuZXcgZXhwb3J0cy5SZXF1ZXN0KCdHRVQnLCBtZXRob2QpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBleHBvcnRzLlJlcXVlc3QobWV0aG9kLCB1cmwpO1xufVxuXG5leHBvcnRzLlJlcXVlc3QgPSBSZXF1ZXN0O1xuXG4vKipcbiAqIERldGVybWluZSBYSFIuXG4gKi9cblxucmVxdWVzdC5nZXRYSFIgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChyb290LlhNTEh0dHBSZXF1ZXN0XG4gICAgICAmJiAoIXJvb3QubG9jYXRpb24gfHwgJ2ZpbGU6JyAhPSByb290LmxvY2F0aW9uLnByb3RvY29sXG4gICAgICAgICAgfHwgIXJvb3QuQWN0aXZlWE9iamVjdCkpIHtcbiAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0O1xuICB9IGVsc2Uge1xuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAuNi4wJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQLjMuMCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUCcpOyB9IGNhdGNoKGUpIHt9XG4gIH1cbiAgdGhyb3cgRXJyb3IoXCJCcm93c2VyLW9ubHkgdmVyc2lvbiBvZiBzdXBlcmFnZW50IGNvdWxkIG5vdCBmaW5kIFhIUlwiKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLCBhZGRlZCB0byBzdXBwb3J0IElFLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG52YXIgdHJpbSA9ICcnLnRyaW1cbiAgPyBmdW5jdGlvbihzKSB7IHJldHVybiBzLnRyaW0oKTsgfVxuICA6IGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMucmVwbGFjZSgvKF5cXHMqfFxccyokKS9nLCAnJyk7IH07XG5cbi8qKlxuICogU2VyaWFsaXplIHRoZSBnaXZlbiBgb2JqYC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzZXJpYWxpemUob2JqKSB7XG4gIGlmICghaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgdmFyIHBhaXJzID0gW107XG4gIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICBwdXNoRW5jb2RlZEtleVZhbHVlUGFpcihwYWlycywga2V5LCBvYmpba2V5XSk7XG4gIH1cbiAgcmV0dXJuIHBhaXJzLmpvaW4oJyYnKTtcbn1cblxuLyoqXG4gKiBIZWxwcyAnc2VyaWFsaXplJyB3aXRoIHNlcmlhbGl6aW5nIGFycmF5cy5cbiAqIE11dGF0ZXMgdGhlIHBhaXJzIGFycmF5LlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHBhaXJzXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge01peGVkfSB2YWxcbiAqL1xuXG5mdW5jdGlvbiBwdXNoRW5jb2RlZEtleVZhbHVlUGFpcihwYWlycywga2V5LCB2YWwpIHtcbiAgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSkge1xuICAgICAgdmFsLmZvckVhY2goZnVuY3Rpb24odikge1xuICAgICAgICBwdXNoRW5jb2RlZEtleVZhbHVlUGFpcihwYWlycywga2V5LCB2KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QodmFsKSkge1xuICAgICAgZm9yKHZhciBzdWJrZXkgaW4gdmFsKSB7XG4gICAgICAgIHB1c2hFbmNvZGVkS2V5VmFsdWVQYWlyKHBhaXJzLCBrZXkgKyAnWycgKyBzdWJrZXkgKyAnXScsIHZhbFtzdWJrZXldKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcGFpcnMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KVxuICAgICAgICArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodmFsID09PSBudWxsKSB7XG4gICAgcGFpcnMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSk7XG4gIH1cbn1cblxuLyoqXG4gKiBFeHBvc2Ugc2VyaWFsaXphdGlvbiBtZXRob2QuXG4gKi9cblxucmVxdWVzdC5zZXJpYWxpemVPYmplY3QgPSBzZXJpYWxpemU7XG5cbi8qKlxuICAqIFBhcnNlIHRoZSBnaXZlbiB4LXd3dy1mb3JtLXVybGVuY29kZWQgYHN0cmAuXG4gICpcbiAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICogQHJldHVybiB7T2JqZWN0fVxuICAqIEBhcGkgcHJpdmF0ZVxuICAqL1xuXG5mdW5jdGlvbiBwYXJzZVN0cmluZyhzdHIpIHtcbiAgdmFyIG9iaiA9IHt9O1xuICB2YXIgcGFpcnMgPSBzdHIuc3BsaXQoJyYnKTtcbiAgdmFyIHBhaXI7XG4gIHZhciBwb3M7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHBhaXJzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgcGFpciA9IHBhaXJzW2ldO1xuICAgIHBvcyA9IHBhaXIuaW5kZXhPZignPScpO1xuICAgIGlmIChwb3MgPT0gLTEpIHtcbiAgICAgIG9ialtkZWNvZGVVUklDb21wb25lbnQocGFpcildID0gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ialtkZWNvZGVVUklDb21wb25lbnQocGFpci5zbGljZSgwLCBwb3MpKV0gPVxuICAgICAgICBkZWNvZGVVUklDb21wb25lbnQocGFpci5zbGljZShwb3MgKyAxKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBFeHBvc2UgcGFyc2VyLlxuICovXG5cbnJlcXVlc3QucGFyc2VTdHJpbmcgPSBwYXJzZVN0cmluZztcblxuLyoqXG4gKiBEZWZhdWx0IE1JTUUgdHlwZSBtYXAuXG4gKlxuICogICAgIHN1cGVyYWdlbnQudHlwZXMueG1sID0gJ2FwcGxpY2F0aW9uL3htbCc7XG4gKlxuICovXG5cbnJlcXVlc3QudHlwZXMgPSB7XG4gIGh0bWw6ICd0ZXh0L2h0bWwnLFxuICBqc29uOiAnYXBwbGljYXRpb24vanNvbicsXG4gIHhtbDogJ3RleHQveG1sJyxcbiAgdXJsZW5jb2RlZDogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICdmb3JtJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICdmb3JtLWRhdGEnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xufTtcblxuLyoqXG4gKiBEZWZhdWx0IHNlcmlhbGl6YXRpb24gbWFwLlxuICpcbiAqICAgICBzdXBlcmFnZW50LnNlcmlhbGl6ZVsnYXBwbGljYXRpb24veG1sJ10gPSBmdW5jdGlvbihvYmope1xuICogICAgICAgcmV0dXJuICdnZW5lcmF0ZWQgeG1sIGhlcmUnO1xuICogICAgIH07XG4gKlxuICovXG5cbnJlcXVlc3Quc2VyaWFsaXplID0ge1xuICAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJzogc2VyaWFsaXplLFxuICAnYXBwbGljYXRpb24vanNvbic6IEpTT04uc3RyaW5naWZ5LFxufTtcblxuLyoqXG4gICogRGVmYXVsdCBwYXJzZXJzLlxuICAqXG4gICogICAgIHN1cGVyYWdlbnQucGFyc2VbJ2FwcGxpY2F0aW9uL3htbCddID0gZnVuY3Rpb24oc3RyKXtcbiAgKiAgICAgICByZXR1cm4geyBvYmplY3QgcGFyc2VkIGZyb20gc3RyIH07XG4gICogICAgIH07XG4gICpcbiAgKi9cblxucmVxdWVzdC5wYXJzZSA9IHtcbiAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHBhcnNlU3RyaW5nLFxuICAnYXBwbGljYXRpb24vanNvbic6IEpTT04ucGFyc2UsXG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBoZWFkZXIgYHN0cmAgaW50b1xuICogYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG1hcHBlZCBmaWVsZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2VIZWFkZXIoc3RyKSB7XG4gIHZhciBsaW5lcyA9IHN0ci5zcGxpdCgvXFxyP1xcbi8pO1xuICB2YXIgZmllbGRzID0ge307XG4gIHZhciBpbmRleDtcbiAgdmFyIGxpbmU7XG4gIHZhciBmaWVsZDtcbiAgdmFyIHZhbDtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBsaW5lID0gbGluZXNbaV07XG4gICAgaW5kZXggPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7IC8vIGNvdWxkIGJlIGVtcHR5IGxpbmUsIGp1c3Qgc2tpcCBpdFxuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGZpZWxkID0gbGluZS5zbGljZSgwLCBpbmRleCkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSB0cmltKGxpbmUuc2xpY2UoaW5kZXggKyAxKSk7XG4gICAgZmllbGRzW2ZpZWxkXSA9IHZhbDtcbiAgfVxuXG4gIHJldHVybiBmaWVsZHM7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYG1pbWVgIGlzIGpzb24gb3IgaGFzICtqc29uIHN0cnVjdHVyZWQgc3ludGF4IHN1ZmZpeC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWltZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzSlNPTihtaW1lKSB7XG4gIC8vIHNob3VsZCBtYXRjaCAvanNvbiBvciAranNvblxuICAvLyBidXQgbm90IC9qc29uLXNlcVxuICByZXR1cm4gL1tcXC8rXWpzb24oJHxbXi1cXHddKS8udGVzdChtaW1lKTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBSZXNwb25zZWAgd2l0aCB0aGUgZ2l2ZW4gYHhocmAuXG4gKlxuICogIC0gc2V0IGZsYWdzICgub2ssIC5lcnJvciwgZXRjKVxuICogIC0gcGFyc2UgaGVhZGVyXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogIEFsaWFzaW5nIGBzdXBlcmFnZW50YCBhcyBgcmVxdWVzdGAgaXMgbmljZTpcbiAqXG4gKiAgICAgIHJlcXVlc3QgPSBzdXBlcmFnZW50O1xuICpcbiAqICBXZSBjYW4gdXNlIHRoZSBwcm9taXNlLWxpa2UgQVBJLCBvciBwYXNzIGNhbGxiYWNrczpcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvJykuZW5kKGZ1bmN0aW9uKHJlcyl7fSk7XG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvJywgZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgU2VuZGluZyBkYXRhIGNhbiBiZSBjaGFpbmVkOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgLmVuZChmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBPciBwYXNzZWQgdG8gYC5zZW5kKClgOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0sIGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIE9yIHBhc3NlZCB0byBgLnBvc3QoKWA6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJywgeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgLmVuZChmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqIE9yIGZ1cnRoZXIgcmVkdWNlZCB0byBhIHNpbmdsZSBjYWxsIGZvciBzaW1wbGUgY2FzZXM6XG4gKlxuICogICAgICByZXF1ZXN0XG4gKiAgICAgICAgLnBvc3QoJy91c2VyJywgeyBuYW1lOiAndGonIH0sIGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogQHBhcmFtIHtYTUxIVFRQUmVxdWVzdH0geGhyXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gUmVzcG9uc2UocmVxKSB7XG4gIHRoaXMucmVxID0gcmVxO1xuICB0aGlzLnhociA9IHRoaXMucmVxLnhocjtcbiAgLy8gcmVzcG9uc2VUZXh0IGlzIGFjY2Vzc2libGUgb25seSBpZiByZXNwb25zZVR5cGUgaXMgJycgb3IgJ3RleHQnIGFuZCBvbiBvbGRlciBicm93c2Vyc1xuICB0aGlzLnRleHQgPSAoKHRoaXMucmVxLm1ldGhvZCAhPSdIRUFEJyAmJiAodGhpcy54aHIucmVzcG9uc2VUeXBlID09PSAnJyB8fCB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JykpIHx8IHR5cGVvZiB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd1bmRlZmluZWQnKVxuICAgICA/IHRoaXMueGhyLnJlc3BvbnNlVGV4dFxuICAgICA6IG51bGw7XG4gIHRoaXMuc3RhdHVzVGV4dCA9IHRoaXMucmVxLnhoci5zdGF0dXNUZXh0O1xuICB2YXIgc3RhdHVzID0gdGhpcy54aHIuc3RhdHVzO1xuICAvLyBoYW5kbGUgSUU5IGJ1ZzogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDA0Njk3Mi9tc2llLXJldHVybnMtc3RhdHVzLWNvZGUtb2YtMTIyMy1mb3ItYWpheC1yZXF1ZXN0XG4gIGlmIChzdGF0dXMgPT09IDEyMjMpIHtcbiAgICBzdGF0dXMgPSAyMDQ7XG4gIH1cbiAgdGhpcy5fc2V0U3RhdHVzUHJvcGVydGllcyhzdGF0dXMpO1xuICB0aGlzLmhlYWRlciA9IHRoaXMuaGVhZGVycyA9IHBhcnNlSGVhZGVyKHRoaXMueGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKTtcbiAgLy8gZ2V0QWxsUmVzcG9uc2VIZWFkZXJzIHNvbWV0aW1lcyBmYWxzZWx5IHJldHVybnMgXCJcIiBmb3IgQ09SUyByZXF1ZXN0cywgYnV0XG4gIC8vIGdldFJlc3BvbnNlSGVhZGVyIHN0aWxsIHdvcmtzLiBzbyB3ZSBnZXQgY29udGVudC10eXBlIGV2ZW4gaWYgZ2V0dGluZ1xuICAvLyBvdGhlciBoZWFkZXJzIGZhaWxzLlxuICB0aGlzLmhlYWRlclsnY29udGVudC10eXBlJ10gPSB0aGlzLnhoci5nZXRSZXNwb25zZUhlYWRlcignY29udGVudC10eXBlJyk7XG4gIHRoaXMuX3NldEhlYWRlclByb3BlcnRpZXModGhpcy5oZWFkZXIpO1xuXG4gIGlmIChudWxsID09PSB0aGlzLnRleHQgJiYgcmVxLl9yZXNwb25zZVR5cGUpIHtcbiAgICB0aGlzLmJvZHkgPSB0aGlzLnhoci5yZXNwb25zZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmJvZHkgPSB0aGlzLnJlcS5tZXRob2QgIT0gJ0hFQUQnXG4gICAgICA/IHRoaXMuX3BhcnNlQm9keSh0aGlzLnRleHQgPyB0aGlzLnRleHQgOiB0aGlzLnhoci5yZXNwb25zZSlcbiAgICAgIDogbnVsbDtcbiAgfVxufVxuXG5SZXNwb25zZUJhc2UoUmVzcG9uc2UucHJvdG90eXBlKTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gYm9keSBgc3RyYC5cbiAqXG4gKiBVc2VkIGZvciBhdXRvLXBhcnNpbmcgb2YgYm9kaWVzLiBQYXJzZXJzXG4gKiBhcmUgZGVmaW5lZCBvbiB0aGUgYHN1cGVyYWdlbnQucGFyc2VgIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtNaXhlZH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS5fcGFyc2VCb2R5ID0gZnVuY3Rpb24oc3RyKSB7XG4gIHZhciBwYXJzZSA9IHJlcXVlc3QucGFyc2VbdGhpcy50eXBlXTtcbiAgaWYgKHRoaXMucmVxLl9wYXJzZXIpIHtcbiAgICByZXR1cm4gdGhpcy5yZXEuX3BhcnNlcih0aGlzLCBzdHIpO1xuICB9XG4gIGlmICghcGFyc2UgJiYgaXNKU09OKHRoaXMudHlwZSkpIHtcbiAgICBwYXJzZSA9IHJlcXVlc3QucGFyc2VbJ2FwcGxpY2F0aW9uL2pzb24nXTtcbiAgfVxuICByZXR1cm4gcGFyc2UgJiYgc3RyICYmIChzdHIubGVuZ3RoIHx8IHN0ciBpbnN0YW5jZW9mIE9iamVjdClcbiAgICA/IHBhcnNlKHN0cilcbiAgICA6IG51bGw7XG59O1xuXG4vKipcbiAqIFJldHVybiBhbiBgRXJyb3JgIHJlcHJlc2VudGF0aXZlIG9mIHRoaXMgcmVzcG9uc2UuXG4gKlxuICogQHJldHVybiB7RXJyb3J9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlc3BvbnNlLnByb3RvdHlwZS50b0Vycm9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIHJlcSA9IHRoaXMucmVxO1xuICB2YXIgbWV0aG9kID0gcmVxLm1ldGhvZDtcbiAgdmFyIHVybCA9IHJlcS51cmw7XG5cbiAgdmFyIG1zZyA9ICdjYW5ub3QgJyArIG1ldGhvZCArICcgJyArIHVybCArICcgKCcgKyB0aGlzLnN0YXR1cyArICcpJztcbiAgdmFyIGVyciA9IG5ldyBFcnJvcihtc2cpO1xuICBlcnIuc3RhdHVzID0gdGhpcy5zdGF0dXM7XG4gIGVyci5tZXRob2QgPSBtZXRob2Q7XG4gIGVyci51cmwgPSB1cmw7XG5cbiAgcmV0dXJuIGVycjtcbn07XG5cbi8qKlxuICogRXhwb3NlIGBSZXNwb25zZWAuXG4gKi9cblxucmVxdWVzdC5SZXNwb25zZSA9IFJlc3BvbnNlO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlcXVlc3RgIHdpdGggdGhlIGdpdmVuIGBtZXRob2RgIGFuZCBgdXJsYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFJlcXVlc3QobWV0aG9kLCB1cmwpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLl9xdWVyeSA9IHRoaXMuX3F1ZXJ5IHx8IFtdO1xuICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgdGhpcy51cmwgPSB1cmw7XG4gIHRoaXMuaGVhZGVyID0ge307IC8vIHByZXNlcnZlcyBoZWFkZXIgbmFtZSBjYXNlXG4gIHRoaXMuX2hlYWRlciA9IHt9OyAvLyBjb2VyY2VzIGhlYWRlciBuYW1lcyB0byBsb3dlcmNhc2VcbiAgdGhpcy5vbignZW5kJywgZnVuY3Rpb24oKXtcbiAgICB2YXIgZXJyID0gbnVsbDtcbiAgICB2YXIgcmVzID0gbnVsbDtcblxuICAgIHRyeSB7XG4gICAgICByZXMgPSBuZXcgUmVzcG9uc2Uoc2VsZik7XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBlcnIgPSBuZXcgRXJyb3IoJ1BhcnNlciBpcyB1bmFibGUgdG8gcGFyc2UgdGhlIHJlc3BvbnNlJyk7XG4gICAgICBlcnIucGFyc2UgPSB0cnVlO1xuICAgICAgZXJyLm9yaWdpbmFsID0gZTtcbiAgICAgIC8vIGlzc3VlICM2NzU6IHJldHVybiB0aGUgcmF3IHJlc3BvbnNlIGlmIHRoZSByZXNwb25zZSBwYXJzaW5nIGZhaWxzXG4gICAgICBpZiAoc2VsZi54aHIpIHtcbiAgICAgICAgLy8gaWU5IGRvZXNuJ3QgaGF2ZSAncmVzcG9uc2UnIHByb3BlcnR5XG4gICAgICAgIGVyci5yYXdSZXNwb25zZSA9IHR5cGVvZiBzZWxmLnhoci5yZXNwb25zZVR5cGUgPT0gJ3VuZGVmaW5lZCcgPyBzZWxmLnhoci5yZXNwb25zZVRleHQgOiBzZWxmLnhoci5yZXNwb25zZTtcbiAgICAgICAgLy8gaXNzdWUgIzg3NjogcmV0dXJuIHRoZSBodHRwIHN0YXR1cyBjb2RlIGlmIHRoZSByZXNwb25zZSBwYXJzaW5nIGZhaWxzXG4gICAgICAgIGVyci5zdGF0dXMgPSBzZWxmLnhoci5zdGF0dXMgPyBzZWxmLnhoci5zdGF0dXMgOiBudWxsO1xuICAgICAgICBlcnIuc3RhdHVzQ29kZSA9IGVyci5zdGF0dXM7IC8vIGJhY2t3YXJkcy1jb21wYXQgb25seVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXJyLnJhd1Jlc3BvbnNlID0gbnVsbDtcbiAgICAgICAgZXJyLnN0YXR1cyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKGVycik7XG4gICAgfVxuXG4gICAgc2VsZi5lbWl0KCdyZXNwb25zZScsIHJlcyk7XG5cbiAgICB2YXIgbmV3X2VycjtcbiAgICB0cnkge1xuICAgICAgaWYgKCFzZWxmLl9pc1Jlc3BvbnNlT0socmVzKSkge1xuICAgICAgICBuZXdfZXJyID0gbmV3IEVycm9yKHJlcy5zdGF0dXNUZXh0IHx8ICdVbnN1Y2Nlc3NmdWwgSFRUUCByZXNwb25zZScpO1xuICAgICAgfVxuICAgIH0gY2F0Y2goY3VzdG9tX2Vycikge1xuICAgICAgbmV3X2VyciA9IGN1c3RvbV9lcnI7IC8vIG9rKCkgY2FsbGJhY2sgY2FuIHRocm93XG4gICAgfVxuXG4gICAgLy8gIzEwMDAgZG9uJ3QgY2F0Y2ggZXJyb3JzIGZyb20gdGhlIGNhbGxiYWNrIHRvIGF2b2lkIGRvdWJsZSBjYWxsaW5nIGl0XG4gICAgaWYgKG5ld19lcnIpIHtcbiAgICAgIG5ld19lcnIub3JpZ2luYWwgPSBlcnI7XG4gICAgICBuZXdfZXJyLnJlc3BvbnNlID0gcmVzO1xuICAgICAgbmV3X2Vyci5zdGF0dXMgPSByZXMuc3RhdHVzO1xuICAgICAgc2VsZi5jYWxsYmFjayhuZXdfZXJyLCByZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLmNhbGxiYWNrKG51bGwsIHJlcyk7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBNaXhpbiBgRW1pdHRlcmAgYW5kIGBSZXF1ZXN0QmFzZWAuXG4gKi9cblxuRW1pdHRlcihSZXF1ZXN0LnByb3RvdHlwZSk7XG5SZXF1ZXN0QmFzZShSZXF1ZXN0LnByb3RvdHlwZSk7XG5cbi8qKlxuICogU2V0IENvbnRlbnQtVHlwZSB0byBgdHlwZWAsIG1hcHBpbmcgdmFsdWVzIGZyb20gYHJlcXVlc3QudHlwZXNgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgc3VwZXJhZ2VudC50eXBlcy54bWwgPSAnYXBwbGljYXRpb24veG1sJztcbiAqXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnLycpXG4gKiAgICAgICAgLnR5cGUoJ3htbCcpXG4gKiAgICAgICAgLnNlbmQoeG1sc3RyaW5nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxdWVzdC5wb3N0KCcvJylcbiAqICAgICAgICAudHlwZSgnYXBwbGljYXRpb24veG1sJylcbiAqICAgICAgICAuc2VuZCh4bWxzdHJpbmcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS50eXBlID0gZnVuY3Rpb24odHlwZSl7XG4gIHRoaXMuc2V0KCdDb250ZW50LVR5cGUnLCByZXF1ZXN0LnR5cGVzW3R5cGVdIHx8IHR5cGUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IEFjY2VwdCB0byBgdHlwZWAsIG1hcHBpbmcgdmFsdWVzIGZyb20gYHJlcXVlc3QudHlwZXNgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgc3VwZXJhZ2VudC50eXBlcy5qc29uID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy9hZ2VudCcpXG4gKiAgICAgICAgLmFjY2VwdCgnanNvbicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnL2FnZW50JylcbiAqICAgICAgICAuYWNjZXB0KCdhcHBsaWNhdGlvbi9qc29uJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYWNjZXB0XG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYWNjZXB0ID0gZnVuY3Rpb24odHlwZSl7XG4gIHRoaXMuc2V0KCdBY2NlcHQnLCByZXF1ZXN0LnR5cGVzW3R5cGVdIHx8IHR5cGUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IEF1dGhvcml6YXRpb24gZmllbGQgdmFsdWUgd2l0aCBgdXNlcmAgYW5kIGBwYXNzYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXNlclxuICogQHBhcmFtIHtTdHJpbmd9IFtwYXNzXSBvcHRpb25hbCBpbiBjYXNlIG9mIHVzaW5nICdiZWFyZXInIGFzIHR5cGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIHdpdGggJ3R5cGUnIHByb3BlcnR5ICdhdXRvJywgJ2Jhc2ljJyBvciAnYmVhcmVyJyAoZGVmYXVsdCAnYmFzaWMnKVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmF1dGggPSBmdW5jdGlvbih1c2VyLCBwYXNzLCBvcHRpb25zKXtcbiAgaWYgKDEgPT09IGFyZ3VtZW50cy5sZW5ndGgpIHBhc3MgPSAnJztcbiAgaWYgKHR5cGVvZiBwYXNzID09PSAnb2JqZWN0JyAmJiBwYXNzICE9PSBudWxsKSB7IC8vIHBhc3MgaXMgb3B0aW9uYWwgYW5kIGNhbiBiZSByZXBsYWNlZCB3aXRoIG9wdGlvbnNcbiAgICBvcHRpb25zID0gcGFzcztcbiAgICBwYXNzID0gJyc7XG4gIH1cbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHtcbiAgICAgIHR5cGU6ICdmdW5jdGlvbicgPT09IHR5cGVvZiBidG9hID8gJ2Jhc2ljJyA6ICdhdXRvJyxcbiAgICB9O1xuICB9XG5cbiAgdmFyIGVuY29kZXIgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGJ0b2EpIHtcbiAgICAgIHJldHVybiBidG9hKHN0cmluZyk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHVzZSBiYXNpYyBhdXRoLCBidG9hIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gIH07XG5cbiAgcmV0dXJuIHRoaXMuX2F1dGgodXNlciwgcGFzcywgb3B0aW9ucywgZW5jb2Rlcik7XG59O1xuXG4vKipcbiAqIEFkZCBxdWVyeS1zdHJpbmcgYHZhbGAuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICByZXF1ZXN0LmdldCgnL3Nob2VzJylcbiAqICAgICAucXVlcnkoJ3NpemU9MTAnKVxuICogICAgIC5xdWVyeSh7IGNvbG9yOiAnYmx1ZScgfSlcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24odmFsKXtcbiAgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiB2YWwpIHZhbCA9IHNlcmlhbGl6ZSh2YWwpO1xuICBpZiAodmFsKSB0aGlzLl9xdWVyeS5wdXNoKHZhbCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBRdWV1ZSB0aGUgZ2l2ZW4gYGZpbGVgIGFzIGFuIGF0dGFjaG1lbnQgdG8gdGhlIHNwZWNpZmllZCBgZmllbGRgLFxuICogd2l0aCBvcHRpb25hbCBgb3B0aW9uc2AgKG9yIGZpbGVuYW1lKS5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5hdHRhY2goJ2NvbnRlbnQnLCBuZXcgQmxvYihbJzxhIGlkPVwiYVwiPjxiIGlkPVwiYlwiPmhleSE8L2I+PC9hPiddLCB7IHR5cGU6IFwidGV4dC9odG1sXCJ9KSlcbiAqICAgLmVuZChjYWxsYmFjayk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqIEBwYXJhbSB7QmxvYnxGaWxlfSBmaWxlXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hdHRhY2ggPSBmdW5jdGlvbihmaWVsZCwgZmlsZSwgb3B0aW9ucyl7XG4gIGlmIChmaWxlKSB7XG4gICAgaWYgKHRoaXMuX2RhdGEpIHtcbiAgICAgIHRocm93IEVycm9yKFwic3VwZXJhZ2VudCBjYW4ndCBtaXggLnNlbmQoKSBhbmQgLmF0dGFjaCgpXCIpO1xuICAgIH1cblxuICAgIHRoaXMuX2dldEZvcm1EYXRhKCkuYXBwZW5kKGZpZWxkLCBmaWxlLCBvcHRpb25zIHx8IGZpbGUubmFtZSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5fZ2V0Rm9ybURhdGEgPSBmdW5jdGlvbigpe1xuICBpZiAoIXRoaXMuX2Zvcm1EYXRhKSB7XG4gICAgdGhpcy5fZm9ybURhdGEgPSBuZXcgcm9vdC5Gb3JtRGF0YSgpO1xuICB9XG4gIHJldHVybiB0aGlzLl9mb3JtRGF0YTtcbn07XG5cbi8qKlxuICogSW52b2tlIHRoZSBjYWxsYmFjayB3aXRoIGBlcnJgIGFuZCBgcmVzYFxuICogYW5kIGhhbmRsZSBhcml0eSBjaGVjay5cbiAqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY2FsbGJhY2sgPSBmdW5jdGlvbihlcnIsIHJlcyl7XG4gIGlmICh0aGlzLl9zaG91bGRSZXRyeShlcnIsIHJlcykpIHtcbiAgICByZXR1cm4gdGhpcy5fcmV0cnkoKTtcbiAgfVxuXG4gIHZhciBmbiA9IHRoaXMuX2NhbGxiYWNrO1xuICB0aGlzLmNsZWFyVGltZW91dCgpO1xuXG4gIGlmIChlcnIpIHtcbiAgICBpZiAodGhpcy5fbWF4UmV0cmllcykgZXJyLnJldHJpZXMgPSB0aGlzLl9yZXRyaWVzIC0gMTtcbiAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgfVxuXG4gIGZuKGVyciwgcmVzKTtcbn07XG5cbi8qKlxuICogSW52b2tlIGNhbGxiYWNrIHdpdGggeC1kb21haW4gZXJyb3IuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY3Jvc3NEb21haW5FcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1JlcXVlc3QgaGFzIGJlZW4gdGVybWluYXRlZFxcblBvc3NpYmxlIGNhdXNlczogdGhlIG5ldHdvcmsgaXMgb2ZmbGluZSwgT3JpZ2luIGlzIG5vdCBhbGxvd2VkIGJ5IEFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbiwgdGhlIHBhZ2UgaXMgYmVpbmcgdW5sb2FkZWQsIGV0Yy4nKTtcbiAgZXJyLmNyb3NzRG9tYWluID0gdHJ1ZTtcblxuICBlcnIuc3RhdHVzID0gdGhpcy5zdGF0dXM7XG4gIGVyci5tZXRob2QgPSB0aGlzLm1ldGhvZDtcbiAgZXJyLnVybCA9IHRoaXMudXJsO1xuXG4gIHRoaXMuY2FsbGJhY2soZXJyKTtcbn07XG5cbi8vIFRoaXMgb25seSB3YXJucywgYmVjYXVzZSB0aGUgcmVxdWVzdCBpcyBzdGlsbCBsaWtlbHkgdG8gd29ya1xuUmVxdWVzdC5wcm90b3R5cGUuYnVmZmVyID0gUmVxdWVzdC5wcm90b3R5cGUuY2EgPSBSZXF1ZXN0LnByb3RvdHlwZS5hZ2VudCA9IGZ1bmN0aW9uKCl7XG4gIGNvbnNvbGUud2FybihcIlRoaXMgaXMgbm90IHN1cHBvcnRlZCBpbiBicm93c2VyIHZlcnNpb24gb2Ygc3VwZXJhZ2VudFwiKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBUaGlzIHRocm93cywgYmVjYXVzZSBpdCBjYW4ndCBzZW5kL3JlY2VpdmUgZGF0YSBhcyBleHBlY3RlZFxuUmVxdWVzdC5wcm90b3R5cGUucGlwZSA9IFJlcXVlc3QucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24oKXtcbiAgdGhyb3cgRXJyb3IoXCJTdHJlYW1pbmcgaXMgbm90IHN1cHBvcnRlZCBpbiBicm93c2VyIHZlcnNpb24gb2Ygc3VwZXJhZ2VudFwiKTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYSBob3N0IG9iamVjdCxcbiAqIHdlIGRvbid0IHdhbnQgdG8gc2VyaWFsaXplIHRoZXNlIDopXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5SZXF1ZXN0LnByb3RvdHlwZS5faXNIb3N0ID0gZnVuY3Rpb24gX2lzSG9zdChvYmopIHtcbiAgLy8gTmF0aXZlIG9iamVjdHMgc3RyaW5naWZ5IHRvIFtvYmplY3QgRmlsZV0sIFtvYmplY3QgQmxvYl0sIFtvYmplY3QgRm9ybURhdGFdLCBldGMuXG4gIHJldHVybiBvYmogJiYgJ29iamVjdCcgPT09IHR5cGVvZiBvYmogJiYgIUFycmF5LmlzQXJyYXkob2JqKSAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSAhPT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59XG5cbi8qKlxuICogSW5pdGlhdGUgcmVxdWVzdCwgaW52b2tpbmcgY2FsbGJhY2sgYGZuKHJlcylgXG4gKiB3aXRoIGFuIGluc3RhbmNlb2YgYFJlc3BvbnNlYC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKGZuKXtcbiAgaWYgKHRoaXMuX2VuZENhbGxlZCkge1xuICAgIGNvbnNvbGUud2FybihcIldhcm5pbmc6IC5lbmQoKSB3YXMgY2FsbGVkIHR3aWNlLiBUaGlzIGlzIG5vdCBzdXBwb3J0ZWQgaW4gc3VwZXJhZ2VudFwiKTtcbiAgfVxuICB0aGlzLl9lbmRDYWxsZWQgPSB0cnVlO1xuXG4gIC8vIHN0b3JlIGNhbGxiYWNrXG4gIHRoaXMuX2NhbGxiYWNrID0gZm4gfHwgbm9vcDtcblxuICAvLyBxdWVyeXN0cmluZ1xuICB0aGlzLl9maW5hbGl6ZVF1ZXJ5U3RyaW5nKCk7XG5cbiAgcmV0dXJuIHRoaXMuX2VuZCgpO1xufTtcblxuUmVxdWVzdC5wcm90b3R5cGUuX2VuZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciB4aHIgPSAodGhpcy54aHIgPSByZXF1ZXN0LmdldFhIUigpKTtcbiAgdmFyIGRhdGEgPSB0aGlzLl9mb3JtRGF0YSB8fCB0aGlzLl9kYXRhO1xuXG4gIHRoaXMuX3NldFRpbWVvdXRzKCk7XG5cbiAgLy8gc3RhdGUgY2hhbmdlXG4gIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xuICAgIHZhciByZWFkeVN0YXRlID0geGhyLnJlYWR5U3RhdGU7XG4gICAgaWYgKHJlYWR5U3RhdGUgPj0gMiAmJiBzZWxmLl9yZXNwb25zZVRpbWVvdXRUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHNlbGYuX3Jlc3BvbnNlVGltZW91dFRpbWVyKTtcbiAgICB9XG4gICAgaWYgKDQgIT0gcmVhZHlTdGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEluIElFOSwgcmVhZHMgdG8gYW55IHByb3BlcnR5IChlLmcuIHN0YXR1cykgb2ZmIG9mIGFuIGFib3J0ZWQgWEhSIHdpbGxcbiAgICAvLyByZXN1bHQgaW4gdGhlIGVycm9yIFwiQ291bGQgbm90IGNvbXBsZXRlIHRoZSBvcGVyYXRpb24gZHVlIHRvIGVycm9yIGMwMGMwMjNmXCJcbiAgICB2YXIgc3RhdHVzO1xuICAgIHRyeSB7IHN0YXR1cyA9IHhoci5zdGF0dXMgfSBjYXRjaChlKSB7IHN0YXR1cyA9IDA7IH1cblxuICAgIGlmICghc3RhdHVzKSB7XG4gICAgICBpZiAoc2VsZi50aW1lZG91dCB8fCBzZWxmLl9hYm9ydGVkKSByZXR1cm47XG4gICAgICByZXR1cm4gc2VsZi5jcm9zc0RvbWFpbkVycm9yKCk7XG4gICAgfVxuICAgIHNlbGYuZW1pdCgnZW5kJyk7XG4gIH07XG5cbiAgLy8gcHJvZ3Jlc3NcbiAgdmFyIGhhbmRsZVByb2dyZXNzID0gZnVuY3Rpb24oZGlyZWN0aW9uLCBlKSB7XG4gICAgaWYgKGUudG90YWwgPiAwKSB7XG4gICAgICBlLnBlcmNlbnQgPSBlLmxvYWRlZCAvIGUudG90YWwgKiAxMDA7XG4gICAgfVxuICAgIGUuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgIHNlbGYuZW1pdCgncHJvZ3Jlc3MnLCBlKTtcbiAgfTtcbiAgaWYgKHRoaXMuaGFzTGlzdGVuZXJzKCdwcm9ncmVzcycpKSB7XG4gICAgdHJ5IHtcbiAgICAgIHhoci5vbnByb2dyZXNzID0gaGFuZGxlUHJvZ3Jlc3MuYmluZChudWxsLCAnZG93bmxvYWQnKTtcbiAgICAgIGlmICh4aHIudXBsb2FkKSB7XG4gICAgICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGhhbmRsZVByb2dyZXNzLmJpbmQobnVsbCwgJ3VwbG9hZCcpO1xuICAgICAgfVxuICAgIH0gY2F0Y2goZSkge1xuICAgICAgLy8gQWNjZXNzaW5nIHhoci51cGxvYWQgZmFpbHMgaW4gSUUgZnJvbSBhIHdlYiB3b3JrZXIsIHNvIGp1c3QgcHJldGVuZCBpdCBkb2Vzbid0IGV4aXN0LlxuICAgICAgLy8gUmVwb3J0ZWQgaGVyZTpcbiAgICAgIC8vIGh0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvODM3MjQ1L3htbGh0dHByZXF1ZXN0LXVwbG9hZC10aHJvd3MtaW52YWxpZC1hcmd1bWVudC13aGVuLXVzZWQtZnJvbS13ZWItd29ya2VyLWNvbnRleHRcbiAgICB9XG4gIH1cblxuICAvLyBpbml0aWF0ZSByZXF1ZXN0XG4gIHRyeSB7XG4gICAgaWYgKHRoaXMudXNlcm5hbWUgJiYgdGhpcy5wYXNzd29yZCkge1xuICAgICAgeGhyLm9wZW4odGhpcy5tZXRob2QsIHRoaXMudXJsLCB0cnVlLCB0aGlzLnVzZXJuYW1lLCB0aGlzLnBhc3N3b3JkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgeGhyLm9wZW4odGhpcy5tZXRob2QsIHRoaXMudXJsLCB0cnVlKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIC8vIHNlZSAjMTE0OVxuICAgIHJldHVybiB0aGlzLmNhbGxiYWNrKGVycik7XG4gIH1cblxuICAvLyBDT1JTXG4gIGlmICh0aGlzLl93aXRoQ3JlZGVudGlhbHMpIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuXG4gIC8vIGJvZHlcbiAgaWYgKCF0aGlzLl9mb3JtRGF0YSAmJiAnR0VUJyAhPSB0aGlzLm1ldGhvZCAmJiAnSEVBRCcgIT0gdGhpcy5tZXRob2QgJiYgJ3N0cmluZycgIT0gdHlwZW9mIGRhdGEgJiYgIXRoaXMuX2lzSG9zdChkYXRhKSkge1xuICAgIC8vIHNlcmlhbGl6ZSBzdHVmZlxuICAgIHZhciBjb250ZW50VHlwZSA9IHRoaXMuX2hlYWRlclsnY29udGVudC10eXBlJ107XG4gICAgdmFyIHNlcmlhbGl6ZSA9IHRoaXMuX3NlcmlhbGl6ZXIgfHwgcmVxdWVzdC5zZXJpYWxpemVbY29udGVudFR5cGUgPyBjb250ZW50VHlwZS5zcGxpdCgnOycpWzBdIDogJyddO1xuICAgIGlmICghc2VyaWFsaXplICYmIGlzSlNPTihjb250ZW50VHlwZSkpIHtcbiAgICAgIHNlcmlhbGl6ZSA9IHJlcXVlc3Quc2VyaWFsaXplWydhcHBsaWNhdGlvbi9qc29uJ107XG4gICAgfVxuICAgIGlmIChzZXJpYWxpemUpIGRhdGEgPSBzZXJpYWxpemUoZGF0YSk7XG4gIH1cblxuICAvLyBzZXQgaGVhZGVyIGZpZWxkc1xuICBmb3IgKHZhciBmaWVsZCBpbiB0aGlzLmhlYWRlcikge1xuICAgIGlmIChudWxsID09IHRoaXMuaGVhZGVyW2ZpZWxkXSkgY29udGludWU7XG5cbiAgICBpZiAodGhpcy5oZWFkZXIuaGFzT3duUHJvcGVydHkoZmllbGQpKVxuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoZmllbGQsIHRoaXMuaGVhZGVyW2ZpZWxkXSk7XG4gIH1cblxuICBpZiAodGhpcy5fcmVzcG9uc2VUeXBlKSB7XG4gICAgeGhyLnJlc3BvbnNlVHlwZSA9IHRoaXMuX3Jlc3BvbnNlVHlwZTtcbiAgfVxuXG4gIC8vIHNlbmQgc3R1ZmZcbiAgdGhpcy5lbWl0KCdyZXF1ZXN0JywgdGhpcyk7XG5cbiAgLy8gSUUxMSB4aHIuc2VuZCh1bmRlZmluZWQpIHNlbmRzICd1bmRlZmluZWQnIHN0cmluZyBhcyBQT1NUIHBheWxvYWQgKGluc3RlYWQgb2Ygbm90aGluZylcbiAgLy8gV2UgbmVlZCBudWxsIGhlcmUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgeGhyLnNlbmQodHlwZW9mIGRhdGEgIT09ICd1bmRlZmluZWQnID8gZGF0YSA6IG51bGwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbnJlcXVlc3QuYWdlbnQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBBZ2VudCgpO1xufTtcblxuW1wiR0VUXCIsIFwiUE9TVFwiLCBcIk9QVElPTlNcIiwgXCJQQVRDSFwiLCBcIlBVVFwiLCBcIkRFTEVURVwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICBBZ2VudC5wcm90b3R5cGVbbWV0aG9kLnRvTG93ZXJDYXNlKCldID0gZnVuY3Rpb24odXJsLCBmbikge1xuICAgIHZhciByZXEgPSBuZXcgcmVxdWVzdC5SZXF1ZXN0KG1ldGhvZCwgdXJsKTtcbiAgICB0aGlzLl9zZXREZWZhdWx0cyhyZXEpO1xuICAgIGlmIChmbikge1xuICAgICAgcmVxLmVuZChmbik7XG4gICAgfVxuICAgIHJldHVybiByZXE7XG4gIH07XG59KTtcblxuQWdlbnQucHJvdG90eXBlLmRlbCA9IEFnZW50LnByb3RvdHlwZVsnZGVsZXRlJ107XG5cbi8qKlxuICogR0VUIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IFtkYXRhXSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5nZXQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKSB7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdHRVQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgKGZuID0gZGF0YSksIChkYXRhID0gbnVsbCk7XG4gIGlmIChkYXRhKSByZXEucXVlcnkoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIEhFQUQgYHVybGAgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gW2RhdGFdIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LmhlYWQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKSB7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdIRUFEJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIChmbiA9IGRhdGEpLCAoZGF0YSA9IG51bGwpO1xuICBpZiAoZGF0YSkgcmVxLnF1ZXJ5KGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBPUFRJT05TIHF1ZXJ5IHRvIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IFtkYXRhXSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5vcHRpb25zID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbikge1xuICB2YXIgcmVxID0gcmVxdWVzdCgnT1BUSU9OUycsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSAoZm4gPSBkYXRhKSwgKGRhdGEgPSBudWxsKTtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBERUxFVEUgYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfSBbZGF0YV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl1cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGRlbCh1cmwsIGRhdGEsIGZuKSB7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdERUxFVEUnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgKGZuID0gZGF0YSksIChkYXRhID0gbnVsbCk7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn1cblxucmVxdWVzdFsnZGVsJ10gPSBkZWw7XG5yZXF1ZXN0WydkZWxldGUnXSA9IGRlbDtcblxuLyoqXG4gKiBQQVRDSCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR9IFtkYXRhXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wYXRjaCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pIHtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ1BBVENIJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIChmbiA9IGRhdGEpLCAoZGF0YSA9IG51bGwpO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBPU1QgYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfSBbZGF0YV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl1cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucG9zdCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pIHtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ1BPU1QnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgKGZuID0gZGF0YSksIChkYXRhID0gbnVsbCk7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogUFVUIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gW2RhdGFdIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnB1dCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pIHtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ1BVVCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSAoZm4gPSBkYXRhKSwgKGRhdGEgPSBudWxsKTtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICByZXR1cm4gbnVsbCAhPT0gb2JqICYmICdvYmplY3QnID09PSB0eXBlb2Ygb2JqO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIE1vZHVsZSBvZiBtaXhlZC1pbiBmdW5jdGlvbnMgc2hhcmVkIGJldHdlZW4gbm9kZSBhbmQgY2xpZW50IGNvZGVcbiAqL1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pcy1vYmplY3QnKTtcblxuLyoqXG4gKiBFeHBvc2UgYFJlcXVlc3RCYXNlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlcXVlc3RCYXNlO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlcXVlc3RCYXNlYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFJlcXVlc3RCYXNlKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn1cblxuLyoqXG4gKiBNaXhpbiB0aGUgcHJvdG90eXBlIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbWl4aW4ob2JqKSB7XG4gIGZvciAodmFyIGtleSBpbiBSZXF1ZXN0QmFzZS5wcm90b3R5cGUpIHtcbiAgICBvYmpba2V5XSA9IFJlcXVlc3RCYXNlLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogQ2xlYXIgcHJldmlvdXMgdGltZW91dC5cbiAqXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLmNsZWFyVGltZW91dCA9IGZ1bmN0aW9uIF9jbGVhclRpbWVvdXQoKXtcbiAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgY2xlYXJUaW1lb3V0KHRoaXMuX3Jlc3BvbnNlVGltZW91dFRpbWVyKTtcbiAgZGVsZXRlIHRoaXMuX3RpbWVyO1xuICBkZWxldGUgdGhpcy5fcmVzcG9uc2VUaW1lb3V0VGltZXI7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBPdmVycmlkZSBkZWZhdWx0IHJlc3BvbnNlIGJvZHkgcGFyc2VyXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB0byBjb252ZXJ0IGluY29taW5nIGRhdGEgaW50byByZXF1ZXN0LmJvZHlcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbiBwYXJzZShmbil7XG4gIHRoaXMuX3BhcnNlciA9IGZuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IGZvcm1hdCBvZiBiaW5hcnkgcmVzcG9uc2UgYm9keS5cbiAqIEluIGJyb3dzZXIgdmFsaWQgZm9ybWF0cyBhcmUgJ2Jsb2InIGFuZCAnYXJyYXlidWZmZXInLFxuICogd2hpY2ggcmV0dXJuIEJsb2IgYW5kIEFycmF5QnVmZmVyLCByZXNwZWN0aXZlbHkuXG4gKlxuICogSW4gTm9kZSBhbGwgdmFsdWVzIHJlc3VsdCBpbiBCdWZmZXIuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAucmVzcG9uc2VUeXBlKCdibG9iJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnJlc3BvbnNlVHlwZSA9IGZ1bmN0aW9uKHZhbCl7XG4gIHRoaXMuX3Jlc3BvbnNlVHlwZSA9IHZhbDtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIE92ZXJyaWRlIGRlZmF1bHQgcmVxdWVzdCBib2R5IHNlcmlhbGl6ZXJcbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHRvIGNvbnZlcnQgZGF0YSBzZXQgdmlhIC5zZW5kIG9yIC5hdHRhY2ggaW50byBwYXlsb2FkIHRvIHNlbmRcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuc2VyaWFsaXplID0gZnVuY3Rpb24gc2VyaWFsaXplKGZuKXtcbiAgdGhpcy5fc2VyaWFsaXplciA9IGZuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHRpbWVvdXRzLlxuICpcbiAqIC0gcmVzcG9uc2UgdGltZW91dCBpcyB0aW1lIGJldHdlZW4gc2VuZGluZyByZXF1ZXN0IGFuZCByZWNlaXZpbmcgdGhlIGZpcnN0IGJ5dGUgb2YgdGhlIHJlc3BvbnNlLiBJbmNsdWRlcyBETlMgYW5kIGNvbm5lY3Rpb24gdGltZS5cbiAqIC0gZGVhZGxpbmUgaXMgdGhlIHRpbWUgZnJvbSBzdGFydCBvZiB0aGUgcmVxdWVzdCB0byByZWNlaXZpbmcgcmVzcG9uc2UgYm9keSBpbiBmdWxsLiBJZiB0aGUgZGVhZGxpbmUgaXMgdG9vIHNob3J0IGxhcmdlIGZpbGVzIG1heSBub3QgbG9hZCBhdCBhbGwgb24gc2xvdyBjb25uZWN0aW9ucy5cbiAqXG4gKiBWYWx1ZSBvZiAwIG9yIGZhbHNlIG1lYW5zIG5vIHRpbWVvdXQuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ8T2JqZWN0fSBtcyBvciB7cmVzcG9uc2UsIGRlYWRsaW5lfVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS50aW1lb3V0ID0gZnVuY3Rpb24gdGltZW91dChvcHRpb25zKXtcbiAgaWYgKCFvcHRpb25zIHx8ICdvYmplY3QnICE9PSB0eXBlb2Ygb3B0aW9ucykge1xuICAgIHRoaXMuX3RpbWVvdXQgPSBvcHRpb25zO1xuICAgIHRoaXMuX3Jlc3BvbnNlVGltZW91dCA9IDA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBmb3IodmFyIG9wdGlvbiBpbiBvcHRpb25zKSB7XG4gICAgc3dpdGNoKG9wdGlvbikge1xuICAgICAgY2FzZSAnZGVhZGxpbmUnOlxuICAgICAgICB0aGlzLl90aW1lb3V0ID0gb3B0aW9ucy5kZWFkbGluZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZXNwb25zZSc6XG4gICAgICAgIHRoaXMuX3Jlc3BvbnNlVGltZW91dCA9IG9wdGlvbnMucmVzcG9uc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS53YXJuKFwiVW5rbm93biB0aW1lb3V0IG9wdGlvblwiLCBvcHRpb24pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IG51bWJlciBvZiByZXRyeSBhdHRlbXB0cyBvbiBlcnJvci5cbiAqXG4gKiBGYWlsZWQgcmVxdWVzdHMgd2lsbCBiZSByZXRyaWVkICdjb3VudCcgdGltZXMgaWYgdGltZW91dCBvciBlcnIuY29kZSA+PSA1MDAuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnJldHJ5ID0gZnVuY3Rpb24gcmV0cnkoY291bnQsIGZuKXtcbiAgLy8gRGVmYXVsdCB0byAxIGlmIG5vIGNvdW50IHBhc3NlZCBvciB0cnVlXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwIHx8IGNvdW50ID09PSB0cnVlKSBjb3VudCA9IDE7XG4gIGlmIChjb3VudCA8PSAwKSBjb3VudCA9IDA7XG4gIHRoaXMuX21heFJldHJpZXMgPSBjb3VudDtcbiAgdGhpcy5fcmV0cmllcyA9IDA7XG4gIHRoaXMuX3JldHJ5Q2FsbGJhY2sgPSBmbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG52YXIgRVJST1JfQ09ERVMgPSBbXG4gICdFQ09OTlJFU0VUJyxcbiAgJ0VUSU1FRE9VVCcsXG4gICdFQUREUklORk8nLFxuICAnRVNPQ0tFVFRJTUVET1VUJ1xuXTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSByZXF1ZXN0IHNob3VsZCBiZSByZXRyaWVkLlxuICogKEJvcnJvd2VkIGZyb20gc2VnbWVudGlvL3N1cGVyYWdlbnQtcmV0cnkpXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gKiBAcGFyYW0ge1Jlc3BvbnNlfSBbcmVzXVxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5fc2hvdWxkUmV0cnkgPSBmdW5jdGlvbihlcnIsIHJlcykge1xuICBpZiAoIXRoaXMuX21heFJldHJpZXMgfHwgdGhpcy5fcmV0cmllcysrID49IHRoaXMuX21heFJldHJpZXMpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHRoaXMuX3JldHJ5Q2FsbGJhY2spIHtcbiAgICB0cnkge1xuICAgICAgdmFyIG92ZXJyaWRlID0gdGhpcy5fcmV0cnlDYWxsYmFjayhlcnIsIHJlcyk7XG4gICAgICBpZiAob3ZlcnJpZGUgPT09IHRydWUpIHJldHVybiB0cnVlO1xuICAgICAgaWYgKG92ZXJyaWRlID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgLy8gdW5kZWZpbmVkIGZhbGxzIGJhY2sgdG8gZGVmYXVsdHNcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgfVxuICB9XG4gIGlmIChyZXMgJiYgcmVzLnN0YXR1cyAmJiByZXMuc3RhdHVzID49IDUwMCAmJiByZXMuc3RhdHVzICE9IDUwMSkgcmV0dXJuIHRydWU7XG4gIGlmIChlcnIpIHtcbiAgICBpZiAoZXJyLmNvZGUgJiYgfkVSUk9SX0NPREVTLmluZGV4T2YoZXJyLmNvZGUpKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBTdXBlcmFnZW50IHRpbWVvdXRcbiAgICBpZiAoZXJyLnRpbWVvdXQgJiYgZXJyLmNvZGUgPT0gJ0VDT05OQUJPUlRFRCcpIHJldHVybiB0cnVlO1xuICAgIGlmIChlcnIuY3Jvc3NEb21haW4pIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogUmV0cnkgcmVxdWVzdFxuICpcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLl9yZXRyeSA9IGZ1bmN0aW9uKCkge1xuXG4gIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG5cbiAgLy8gbm9kZVxuICBpZiAodGhpcy5yZXEpIHtcbiAgICB0aGlzLnJlcSA9IG51bGw7XG4gICAgdGhpcy5yZXEgPSB0aGlzLnJlcXVlc3QoKTtcbiAgfVxuXG4gIHRoaXMuX2Fib3J0ZWQgPSBmYWxzZTtcbiAgdGhpcy50aW1lZG91dCA9IGZhbHNlO1xuXG4gIHJldHVybiB0aGlzLl9lbmQoKTtcbn07XG5cbi8qKlxuICogUHJvbWlzZSBzdXBwb3J0XG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzb2x2ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3JlamVjdF1cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbiB0aGVuKHJlc29sdmUsIHJlamVjdCkge1xuICBpZiAoIXRoaXMuX2Z1bGxmaWxsZWRQcm9taXNlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmICh0aGlzLl9lbmRDYWxsZWQpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIldhcm5pbmc6IHN1cGVyYWdlbnQgcmVxdWVzdCB3YXMgc2VudCB0d2ljZSwgYmVjYXVzZSBib3RoIC5lbmQoKSBhbmQgLnRoZW4oKSB3ZXJlIGNhbGxlZC4gTmV2ZXIgY2FsbCAuZW5kKCkgaWYgeW91IHVzZSBwcm9taXNlc1wiKTtcbiAgICB9XG4gICAgdGhpcy5fZnVsbGZpbGxlZFByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihpbm5lclJlc29sdmUsIGlubmVyUmVqZWN0KSB7XG4gICAgICBzZWxmLmVuZChmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgICBpZiAoZXJyKSBpbm5lclJlamVjdChlcnIpO1xuICAgICAgICBlbHNlIGlubmVyUmVzb2x2ZShyZXMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuX2Z1bGxmaWxsZWRQcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbn07XG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5jYXRjaCA9IGZ1bmN0aW9uKGNiKSB7XG4gIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBjYik7XG59O1xuXG4vKipcbiAqIEFsbG93IGZvciBleHRlbnNpb25cbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gdXNlKGZuKSB7XG4gIGZuKHRoaXMpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5vayA9IGZ1bmN0aW9uKGNiKSB7XG4gIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgY2IpIHRocm93IEVycm9yKFwiQ2FsbGJhY2sgcmVxdWlyZWRcIik7XG4gIHRoaXMuX29rQ2FsbGJhY2sgPSBjYjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuX2lzUmVzcG9uc2VPSyA9IGZ1bmN0aW9uKHJlcykge1xuICBpZiAoIXJlcykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh0aGlzLl9va0NhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuX29rQ2FsbGJhY2socmVzKTtcbiAgfVxuXG4gIHJldHVybiByZXMuc3RhdHVzID49IDIwMCAmJiByZXMuc3RhdHVzIDwgMzAwO1xufTtcblxuLyoqXG4gKiBHZXQgcmVxdWVzdCBoZWFkZXIgYGZpZWxkYC5cbiAqIENhc2UtaW5zZW5zaXRpdmUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihmaWVsZCl7XG4gIHJldHVybiB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG59O1xuXG4vKipcbiAqIEdldCBjYXNlLWluc2Vuc2l0aXZlIGhlYWRlciBgZmllbGRgIHZhbHVlLlxuICogVGhpcyBpcyBhIGRlcHJlY2F0ZWQgaW50ZXJuYWwgQVBJLiBVc2UgYC5nZXQoZmllbGQpYCBpbnN0ZWFkLlxuICpcbiAqIChnZXRIZWFkZXIgaXMgbm8gbG9uZ2VyIHVzZWQgaW50ZXJuYWxseSBieSB0aGUgc3VwZXJhZ2VudCBjb2RlIGJhc2UpXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqIEBkZXByZWNhdGVkXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLmdldEhlYWRlciA9IFJlcXVlc3RCYXNlLnByb3RvdHlwZS5nZXQ7XG5cbi8qKlxuICogU2V0IGhlYWRlciBgZmllbGRgIHRvIGB2YWxgLCBvciBtdWx0aXBsZSBmaWVsZHMgd2l0aCBvbmUgb2JqZWN0LlxuICogQ2FzZS1pbnNlbnNpdGl2ZS5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC5zZXQoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJylcbiAqICAgICAgICAuc2V0KCdYLUFQSS1LZXknLCAnZm9vYmFyJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC5zZXQoeyBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJywgJ1gtQVBJLUtleSc6ICdmb29iYXInIH0pXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBmaWVsZFxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihmaWVsZCwgdmFsKXtcbiAgaWYgKGlzT2JqZWN0KGZpZWxkKSkge1xuICAgIGZvciAodmFyIGtleSBpbiBmaWVsZCkge1xuICAgICAgdGhpcy5zZXQoa2V5LCBmaWVsZFtrZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldID0gdmFsO1xuICB0aGlzLmhlYWRlcltmaWVsZF0gPSB2YWw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgaGVhZGVyIGBmaWVsZGAuXG4gKiBDYXNlLWluc2Vuc2l0aXZlLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAudW5zZXQoJ1VzZXItQWdlbnQnKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICovXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUudW5zZXQgPSBmdW5jdGlvbihmaWVsZCl7XG4gIGRlbGV0ZSB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG4gIGRlbGV0ZSB0aGlzLmhlYWRlcltmaWVsZF07XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBXcml0ZSB0aGUgZmllbGQgYG5hbWVgIGFuZCBgdmFsYCwgb3IgbXVsdGlwbGUgZmllbGRzIHdpdGggb25lIG9iamVjdFxuICogZm9yIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiIHJlcXVlc3QgYm9kaWVzLlxuICpcbiAqIGBgYCBqc1xuICogcmVxdWVzdC5wb3N0KCcvdXBsb2FkJylcbiAqICAgLmZpZWxkKCdmb28nLCAnYmFyJylcbiAqICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogcmVxdWVzdC5wb3N0KCcvdXBsb2FkJylcbiAqICAgLmZpZWxkKHsgZm9vOiAnYmFyJywgYmF6OiAncXV4JyB9KVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gbmFtZVxuICogQHBhcmFtIHtTdHJpbmd8QmxvYnxGaWxlfEJ1ZmZlcnxmcy5SZWFkU3RyZWFtfSB2YWxcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuUmVxdWVzdEJhc2UucHJvdG90eXBlLmZpZWxkID0gZnVuY3Rpb24obmFtZSwgdmFsKSB7XG4gIC8vIG5hbWUgc2hvdWxkIGJlIGVpdGhlciBhIHN0cmluZyBvciBhbiBvYmplY3QuXG4gIGlmIChudWxsID09PSBuYW1lIHx8IHVuZGVmaW5lZCA9PT0gbmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignLmZpZWxkKG5hbWUsIHZhbCkgbmFtZSBjYW4gbm90IGJlIGVtcHR5Jyk7XG4gIH1cblxuICBpZiAodGhpcy5fZGF0YSkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCIuZmllbGQoKSBjYW4ndCBiZSB1c2VkIGlmIC5zZW5kKCkgaXMgdXNlZC4gUGxlYXNlIHVzZSBvbmx5IC5zZW5kKCkgb3Igb25seSAuZmllbGQoKSAmIC5hdHRhY2goKVwiKTtcbiAgfVxuXG4gIGlmIChpc09iamVjdChuYW1lKSkge1xuICAgIGZvciAodmFyIGtleSBpbiBuYW1lKSB7XG4gICAgICB0aGlzLmZpZWxkKGtleSwgbmFtZVtrZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgZm9yICh2YXIgaSBpbiB2YWwpIHtcbiAgICAgIHRoaXMuZmllbGQobmFtZSwgdmFsW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyB2YWwgc2hvdWxkIGJlIGRlZmluZWQgbm93XG4gIGlmIChudWxsID09PSB2YWwgfHwgdW5kZWZpbmVkID09PSB2YWwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJy5maWVsZChuYW1lLCB2YWwpIHZhbCBjYW4gbm90IGJlIGVtcHR5Jyk7XG4gIH1cbiAgaWYgKCdib29sZWFuJyA9PT0gdHlwZW9mIHZhbCkge1xuICAgIHZhbCA9ICcnICsgdmFsO1xuICB9XG4gIHRoaXMuX2dldEZvcm1EYXRhKCkuYXBwZW5kKG5hbWUsIHZhbCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBYm9ydCB0aGUgcmVxdWVzdCwgYW5kIGNsZWFyIHBvdGVudGlhbCB0aW1lb3V0LlxuICpcbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuYWJvcnQgPSBmdW5jdGlvbigpe1xuICBpZiAodGhpcy5fYWJvcnRlZCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHRoaXMuX2Fib3J0ZWQgPSB0cnVlO1xuICB0aGlzLnhociAmJiB0aGlzLnhoci5hYm9ydCgpOyAvLyBicm93c2VyXG4gIHRoaXMucmVxICYmIHRoaXMucmVxLmFib3J0KCk7IC8vIG5vZGVcbiAgdGhpcy5jbGVhclRpbWVvdXQoKTtcbiAgdGhpcy5lbWl0KCdhYm9ydCcpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5fYXV0aCA9IGZ1bmN0aW9uKHVzZXIsIHBhc3MsIG9wdGlvbnMsIGJhc2U2NEVuY29kZXIpIHtcbiAgc3dpdGNoIChvcHRpb25zLnR5cGUpIHtcbiAgICBjYXNlICdiYXNpYyc6XG4gICAgICB0aGlzLnNldCgnQXV0aG9yaXphdGlvbicsICdCYXNpYyAnICsgYmFzZTY0RW5jb2Rlcih1c2VyICsgJzonICsgcGFzcykpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdhdXRvJzpcbiAgICAgIHRoaXMudXNlcm5hbWUgPSB1c2VyO1xuICAgICAgdGhpcy5wYXNzd29yZCA9IHBhc3M7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ2JlYXJlcic6IC8vIHVzYWdlIHdvdWxkIGJlIC5hdXRoKGFjY2Vzc1Rva2VuLCB7IHR5cGU6ICdiZWFyZXInIH0pXG4gICAgICB0aGlzLnNldCgnQXV0aG9yaXphdGlvbicsICdCZWFyZXIgJyArIHVzZXIpO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEVuYWJsZSB0cmFuc21pc3Npb24gb2YgY29va2llcyB3aXRoIHgtZG9tYWluIHJlcXVlc3RzLlxuICpcbiAqIE5vdGUgdGhhdCBmb3IgdGhpcyB0byB3b3JrIHRoZSBvcmlnaW4gbXVzdCBub3QgYmVcbiAqIHVzaW5nIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCIgd2l0aCBhIHdpbGRjYXJkLFxuICogYW5kIGFsc28gbXVzdCBzZXQgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFsc1wiXG4gKiB0byBcInRydWVcIi5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS53aXRoQ3JlZGVudGlhbHMgPSBmdW5jdGlvbihvbikge1xuICAvLyBUaGlzIGlzIGJyb3dzZXItb25seSBmdW5jdGlvbmFsaXR5LiBOb2RlIHNpZGUgaXMgbm8tb3AuXG4gIGlmIChvbiA9PSB1bmRlZmluZWQpIG9uID0gdHJ1ZTtcbiAgdGhpcy5fd2l0aENyZWRlbnRpYWxzID0gb247XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIG1heCByZWRpcmVjdHMgdG8gYG5gLiBEb2VzIG5vdGluZyBpbiBicm93c2VyIFhIUiBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gblxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5yZWRpcmVjdHMgPSBmdW5jdGlvbihuKXtcbiAgdGhpcy5fbWF4UmVkaXJlY3RzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIE1heGltdW0gc2l6ZSBvZiBidWZmZXJlZCByZXNwb25zZSBib2R5LCBpbiBieXRlcy4gQ291bnRzIHVuY29tcHJlc3NlZCBzaXplLlxuICogRGVmYXVsdCAyMDBNQi5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gblxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKi9cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5tYXhSZXNwb25zZVNpemUgPSBmdW5jdGlvbihuKXtcbiAgaWYgKCdudW1iZXInICE9PSB0eXBlb2Ygbikge1xuICAgIHRocm93IFR5cGVFcnJvcihcIkludmFsaWQgYXJndW1lbnRcIik7XG4gIH1cbiAgdGhpcy5fbWF4UmVzcG9uc2VTaXplID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENvbnZlcnQgdG8gYSBwbGFpbiBqYXZhc2NyaXB0IG9iamVjdCAobm90IEpTT04gc3RyaW5nKSBvZiBzY2FsYXIgcHJvcGVydGllcy5cbiAqIE5vdGUgYXMgdGhpcyBtZXRob2QgaXMgZGVzaWduZWQgdG8gcmV0dXJuIGEgdXNlZnVsIG5vbi10aGlzIHZhbHVlLFxuICogaXQgY2Fubm90IGJlIGNoYWluZWQuXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSBkZXNjcmliaW5nIG1ldGhvZCwgdXJsLCBhbmQgZGF0YSBvZiB0aGlzIHJlcXVlc3RcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIG1ldGhvZDogdGhpcy5tZXRob2QsXG4gICAgdXJsOiB0aGlzLnVybCxcbiAgICBkYXRhOiB0aGlzLl9kYXRhLFxuICAgIGhlYWRlcnM6IHRoaXMuX2hlYWRlcixcbiAgfTtcbn07XG5cbi8qKlxuICogU2VuZCBgZGF0YWAgYXMgdGhlIHJlcXVlc3QgYm9keSwgZGVmYXVsdGluZyB0aGUgYC50eXBlKClgIHRvIFwianNvblwiIHdoZW5cbiAqIGFuIG9iamVjdCBpcyBnaXZlbi5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgICAvLyBtYW51YWwganNvblxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdqc29uJylcbiAqICAgICAgICAgLnNlbmQoJ3tcIm5hbWVcIjpcInRqXCJ9JylcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBhdXRvIGpzb25cbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBtYW51YWwgeC13d3ctZm9ybS11cmxlbmNvZGVkXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2Zvcm0nKVxuICogICAgICAgICAuc2VuZCgnbmFtZT10aicpXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gYXV0byB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnZm9ybScpXG4gKiAgICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGRlZmF1bHRzIHRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICogICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCgnbmFtZT10b2JpJylcbiAqICAgICAgICAuc2VuZCgnc3BlY2llcz1mZXJyZXQnKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbihkYXRhKXtcbiAgdmFyIGlzT2JqID0gaXNPYmplY3QoZGF0YSk7XG4gIHZhciB0eXBlID0gdGhpcy5faGVhZGVyWydjb250ZW50LXR5cGUnXTtcblxuICBpZiAodGhpcy5fZm9ybURhdGEpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiLnNlbmQoKSBjYW4ndCBiZSB1c2VkIGlmIC5hdHRhY2goKSBvciAuZmllbGQoKSBpcyB1c2VkLiBQbGVhc2UgdXNlIG9ubHkgLnNlbmQoKSBvciBvbmx5IC5maWVsZCgpICYgLmF0dGFjaCgpXCIpO1xuICB9XG5cbiAgaWYgKGlzT2JqICYmICF0aGlzLl9kYXRhKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSBbXTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLl9pc0hvc3QoZGF0YSkpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSB7fTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZGF0YSAmJiB0aGlzLl9kYXRhICYmIHRoaXMuX2lzSG9zdCh0aGlzLl9kYXRhKSkge1xuICAgIHRocm93IEVycm9yKFwiQ2FuJ3QgbWVyZ2UgdGhlc2Ugc2VuZCBjYWxsc1wiKTtcbiAgfVxuXG4gIC8vIG1lcmdlXG4gIGlmIChpc09iaiAmJiBpc09iamVjdCh0aGlzLl9kYXRhKSkge1xuICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgICB0aGlzLl9kYXRhW2tleV0gPSBkYXRhW2tleV07XG4gICAgfVxuICB9IGVsc2UgaWYgKCdzdHJpbmcnID09IHR5cGVvZiBkYXRhKSB7XG4gICAgLy8gZGVmYXVsdCB0byB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAgICBpZiAoIXR5cGUpIHRoaXMudHlwZSgnZm9ybScpO1xuICAgIHR5cGUgPSB0aGlzLl9oZWFkZXJbJ2NvbnRlbnQtdHlwZSddO1xuICAgIGlmICgnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyA9PSB0eXBlKSB7XG4gICAgICB0aGlzLl9kYXRhID0gdGhpcy5fZGF0YVxuICAgICAgICA/IHRoaXMuX2RhdGEgKyAnJicgKyBkYXRhXG4gICAgICAgIDogZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZGF0YSA9ICh0aGlzLl9kYXRhIHx8ICcnKSArIGRhdGE7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICB9XG5cbiAgaWYgKCFpc09iaiB8fCB0aGlzLl9pc0hvc3QoZGF0YSkpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGRlZmF1bHQgdG8ganNvblxuICBpZiAoIXR5cGUpIHRoaXMudHlwZSgnanNvbicpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU29ydCBgcXVlcnlzdHJpbmdgIGJ5IHRoZSBzb3J0IGZ1bmN0aW9uXG4gKlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgIC8vIGRlZmF1bHQgb3JkZXJcbiAqICAgICAgIHJlcXVlc3QuZ2V0KCcvdXNlcicpXG4gKiAgICAgICAgIC5xdWVyeSgnbmFtZT1OaWNrJylcbiAqICAgICAgICAgLnF1ZXJ5KCdzZWFyY2g9TWFubnknKVxuICogICAgICAgICAuc29ydFF1ZXJ5KClcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBjdXN0b21pemVkIHNvcnQgZnVuY3Rpb25cbiAqICAgICAgIHJlcXVlc3QuZ2V0KCcvdXNlcicpXG4gKiAgICAgICAgIC5xdWVyeSgnbmFtZT1OaWNrJylcbiAqICAgICAgICAgLnF1ZXJ5KCdzZWFyY2g9TWFubnknKVxuICogICAgICAgICAuc29ydFF1ZXJ5KGZ1bmN0aW9uKGEsIGIpe1xuICogICAgICAgICAgIHJldHVybiBhLmxlbmd0aCAtIGIubGVuZ3RoO1xuICogICAgICAgICB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzb3J0XG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnNvcnRRdWVyeSA9IGZ1bmN0aW9uKHNvcnQpIHtcbiAgLy8gX3NvcnQgZGVmYXVsdCB0byB0cnVlIGJ1dCBvdGhlcndpc2UgY2FuIGJlIGEgZnVuY3Rpb24gb3IgYm9vbGVhblxuICB0aGlzLl9zb3J0ID0gdHlwZW9mIHNvcnQgPT09ICd1bmRlZmluZWQnID8gdHJ1ZSA6IHNvcnQ7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDb21wb3NlIHF1ZXJ5c3RyaW5nIHRvIGFwcGVuZCB0byByZXEudXJsXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5fZmluYWxpemVRdWVyeVN0cmluZyA9IGZ1bmN0aW9uKCl7XG4gIHZhciBxdWVyeSA9IHRoaXMuX3F1ZXJ5LmpvaW4oJyYnKTtcbiAgaWYgKHF1ZXJ5KSB7XG4gICAgdGhpcy51cmwgKz0gKHRoaXMudXJsLmluZGV4T2YoJz8nKSA+PSAwID8gJyYnIDogJz8nKSArIHF1ZXJ5O1xuICB9XG4gIHRoaXMuX3F1ZXJ5Lmxlbmd0aCA9IDA7IC8vIE1ha2VzIHRoZSBjYWxsIGlkZW1wb3RlbnRcblxuICBpZiAodGhpcy5fc29ydCkge1xuICAgIHZhciBpbmRleCA9IHRoaXMudXJsLmluZGV4T2YoJz8nKTtcbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgdmFyIHF1ZXJ5QXJyID0gdGhpcy51cmwuc3Vic3RyaW5nKGluZGV4ICsgMSkuc3BsaXQoJyYnKTtcbiAgICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgdGhpcy5fc29ydCkge1xuICAgICAgICBxdWVyeUFyci5zb3J0KHRoaXMuX3NvcnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcXVlcnlBcnIuc29ydCgpO1xuICAgICAgfVxuICAgICAgdGhpcy51cmwgPSB0aGlzLnVybC5zdWJzdHJpbmcoMCwgaW5kZXgpICsgJz8nICsgcXVlcnlBcnIuam9pbignJicpO1xuICAgIH1cbiAgfVxufTtcblxuLy8gRm9yIGJhY2t3YXJkcyBjb21wYXQgb25seVxuUmVxdWVzdEJhc2UucHJvdG90eXBlLl9hcHBlbmRRdWVyeVN0cmluZyA9IGZ1bmN0aW9uKCkge2NvbnNvbGUudHJhY2UoXCJVbnN1cHBvcnRlZFwiKTt9XG5cbi8qKlxuICogSW52b2tlIGNhbGxiYWNrIHdpdGggdGltZW91dCBlcnJvci5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuX3RpbWVvdXRFcnJvciA9IGZ1bmN0aW9uKHJlYXNvbiwgdGltZW91dCwgZXJybm8pe1xuICBpZiAodGhpcy5fYWJvcnRlZCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgZXJyID0gbmV3IEVycm9yKHJlYXNvbiArIHRpbWVvdXQgKyAnbXMgZXhjZWVkZWQnKTtcbiAgZXJyLnRpbWVvdXQgPSB0aW1lb3V0O1xuICBlcnIuY29kZSA9ICdFQ09OTkFCT1JURUQnO1xuICBlcnIuZXJybm8gPSBlcnJubztcbiAgdGhpcy50aW1lZG91dCA9IHRydWU7XG4gIHRoaXMuYWJvcnQoKTtcbiAgdGhpcy5jYWxsYmFjayhlcnIpO1xufTtcblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLl9zZXRUaW1lb3V0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgLy8gZGVhZGxpbmVcbiAgaWYgKHRoaXMuX3RpbWVvdXQgJiYgIXRoaXMuX3RpbWVyKSB7XG4gICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICBzZWxmLl90aW1lb3V0RXJyb3IoJ1RpbWVvdXQgb2YgJywgc2VsZi5fdGltZW91dCwgJ0VUSU1FJyk7XG4gICAgfSwgdGhpcy5fdGltZW91dCk7XG4gIH1cbiAgLy8gcmVzcG9uc2UgdGltZW91dFxuICBpZiAodGhpcy5fcmVzcG9uc2VUaW1lb3V0ICYmICF0aGlzLl9yZXNwb25zZVRpbWVvdXRUaW1lcikge1xuICAgIHRoaXMuX3Jlc3BvbnNlVGltZW91dFRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgc2VsZi5fdGltZW91dEVycm9yKCdSZXNwb25zZSB0aW1lb3V0IG9mICcsIHNlbGYuX3Jlc3BvbnNlVGltZW91dCwgJ0VUSU1FRE9VVCcpO1xuICAgIH0sIHRoaXMuX3Jlc3BvbnNlVGltZW91dCk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbi8qKlxuICogRXhwb3NlIGBSZXNwb25zZUJhc2VgLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gUmVzcG9uc2VCYXNlO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlc3BvbnNlQmFzZWAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBSZXNwb25zZUJhc2Uob2JqKSB7XG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xufVxuXG4vKipcbiAqIE1peGluIHRoZSBwcm90b3R5cGUgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIFJlc3BvbnNlQmFzZS5wcm90b3R5cGUpIHtcbiAgICBvYmpba2V5XSA9IFJlc3BvbnNlQmFzZS5wcm90b3R5cGVba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIEdldCBjYXNlLWluc2Vuc2l0aXZlIGBmaWVsZGAgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlc3BvbnNlQmFzZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oZmllbGQpIHtcbiAgcmV0dXJuIHRoaXMuaGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xufTtcblxuLyoqXG4gKiBTZXQgaGVhZGVyIHJlbGF0ZWQgcHJvcGVydGllczpcbiAqXG4gKiAgIC0gYC50eXBlYCB0aGUgY29udGVudCB0eXBlIHdpdGhvdXQgcGFyYW1zXG4gKlxuICogQSByZXNwb25zZSBvZiBcIkNvbnRlbnQtVHlwZTogdGV4dC9wbGFpbjsgY2hhcnNldD11dGYtOFwiXG4gKiB3aWxsIHByb3ZpZGUgeW91IHdpdGggYSBgLnR5cGVgIG9mIFwidGV4dC9wbGFpblwiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlQmFzZS5wcm90b3R5cGUuX3NldEhlYWRlclByb3BlcnRpZXMgPSBmdW5jdGlvbihoZWFkZXIpe1xuICAgIC8vIFRPRE86IG1vYXIhXG4gICAgLy8gVE9ETzogbWFrZSB0aGlzIGEgdXRpbFxuXG4gICAgLy8gY29udGVudC10eXBlXG4gICAgdmFyIGN0ID0gaGVhZGVyWydjb250ZW50LXR5cGUnXSB8fCAnJztcbiAgICB0aGlzLnR5cGUgPSB1dGlscy50eXBlKGN0KTtcblxuICAgIC8vIHBhcmFtc1xuICAgIHZhciBwYXJhbXMgPSB1dGlscy5wYXJhbXMoY3QpO1xuICAgIGZvciAodmFyIGtleSBpbiBwYXJhbXMpIHRoaXNba2V5XSA9IHBhcmFtc1trZXldO1xuXG4gICAgdGhpcy5saW5rcyA9IHt9O1xuXG4gICAgLy8gbGlua3NcbiAgICB0cnkge1xuICAgICAgICBpZiAoaGVhZGVyLmxpbmspIHtcbiAgICAgICAgICAgIHRoaXMubGlua3MgPSB1dGlscy5wYXJzZUxpbmtzKGhlYWRlci5saW5rKTtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAvLyBpZ25vcmVcbiAgICB9XG59O1xuXG4vKipcbiAqIFNldCBmbGFncyBzdWNoIGFzIGAub2tgIGJhc2VkIG9uIGBzdGF0dXNgLlxuICpcbiAqIEZvciBleGFtcGxlIGEgMnh4IHJlc3BvbnNlIHdpbGwgZ2l2ZSB5b3UgYSBgLm9rYCBvZiBfX3RydWVfX1xuICogd2hlcmVhcyA1eHggd2lsbCBiZSBfX2ZhbHNlX18gYW5kIGAuZXJyb3JgIHdpbGwgYmUgX190cnVlX18uIFRoZVxuICogYC5jbGllbnRFcnJvcmAgYW5kIGAuc2VydmVyRXJyb3JgIGFyZSBhbHNvIGF2YWlsYWJsZSB0byBiZSBtb3JlXG4gKiBzcGVjaWZpYywgYW5kIGAuc3RhdHVzVHlwZWAgaXMgdGhlIGNsYXNzIG9mIGVycm9yIHJhbmdpbmcgZnJvbSAxLi41XG4gKiBzb21ldGltZXMgdXNlZnVsIGZvciBtYXBwaW5nIHJlc3BvbmQgY29sb3JzIGV0Yy5cbiAqXG4gKiBcInN1Z2FyXCIgcHJvcGVydGllcyBhcmUgYWxzbyBkZWZpbmVkIGZvciBjb21tb24gY2FzZXMuIEN1cnJlbnRseSBwcm92aWRpbmc6XG4gKlxuICogICAtIC5ub0NvbnRlbnRcbiAqICAgLSAuYmFkUmVxdWVzdFxuICogICAtIC51bmF1dGhvcml6ZWRcbiAqICAgLSAubm90QWNjZXB0YWJsZVxuICogICAtIC5ub3RGb3VuZFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0dXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlc3BvbnNlQmFzZS5wcm90b3R5cGUuX3NldFN0YXR1c1Byb3BlcnRpZXMgPSBmdW5jdGlvbihzdGF0dXMpe1xuICAgIHZhciB0eXBlID0gc3RhdHVzIC8gMTAwIHwgMDtcblxuICAgIC8vIHN0YXR1cyAvIGNsYXNzXG4gICAgdGhpcy5zdGF0dXMgPSB0aGlzLnN0YXR1c0NvZGUgPSBzdGF0dXM7XG4gICAgdGhpcy5zdGF0dXNUeXBlID0gdHlwZTtcblxuICAgIC8vIGJhc2ljc1xuICAgIHRoaXMuaW5mbyA9IDEgPT0gdHlwZTtcbiAgICB0aGlzLm9rID0gMiA9PSB0eXBlO1xuICAgIHRoaXMucmVkaXJlY3QgPSAzID09IHR5cGU7XG4gICAgdGhpcy5jbGllbnRFcnJvciA9IDQgPT0gdHlwZTtcbiAgICB0aGlzLnNlcnZlckVycm9yID0gNSA9PSB0eXBlO1xuICAgIHRoaXMuZXJyb3IgPSAoNCA9PSB0eXBlIHx8IDUgPT0gdHlwZSlcbiAgICAgICAgPyB0aGlzLnRvRXJyb3IoKVxuICAgICAgICA6IGZhbHNlO1xuXG4gICAgLy8gc3VnYXJcbiAgICB0aGlzLmFjY2VwdGVkID0gMjAyID09IHN0YXR1cztcbiAgICB0aGlzLm5vQ29udGVudCA9IDIwNCA9PSBzdGF0dXM7XG4gICAgdGhpcy5iYWRSZXF1ZXN0ID0gNDAwID09IHN0YXR1cztcbiAgICB0aGlzLnVuYXV0aG9yaXplZCA9IDQwMSA9PSBzdGF0dXM7XG4gICAgdGhpcy5ub3RBY2NlcHRhYmxlID0gNDA2ID09IHN0YXR1cztcbiAgICB0aGlzLmZvcmJpZGRlbiA9IDQwMyA9PSBzdGF0dXM7XG4gICAgdGhpcy5ub3RGb3VuZCA9IDQwNCA9PSBzdGF0dXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFJldHVybiB0aGUgbWltZSB0eXBlIGZvciB0aGUgZ2l2ZW4gYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy50eXBlID0gZnVuY3Rpb24oc3RyKXtcbiAgcmV0dXJuIHN0ci5zcGxpdCgvICo7ICovKS5zaGlmdCgpO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gaGVhZGVyIGZpZWxkIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5wYXJhbXMgPSBmdW5jdGlvbihzdHIpe1xuICByZXR1cm4gc3RyLnNwbGl0KC8gKjsgKi8pLnJlZHVjZShmdW5jdGlvbihvYmosIHN0cil7XG4gICAgdmFyIHBhcnRzID0gc3RyLnNwbGl0KC8gKj0gKi8pO1xuICAgIHZhciBrZXkgPSBwYXJ0cy5zaGlmdCgpO1xuICAgIHZhciB2YWwgPSBwYXJ0cy5zaGlmdCgpO1xuXG4gICAgaWYgKGtleSAmJiB2YWwpIG9ialtrZXldID0gdmFsO1xuICAgIHJldHVybiBvYmo7XG4gIH0sIHt9KTtcbn07XG5cbi8qKlxuICogUGFyc2UgTGluayBoZWFkZXIgZmllbGRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMucGFyc2VMaW5rcyA9IGZ1bmN0aW9uKHN0cil7XG4gIHJldHVybiBzdHIuc3BsaXQoLyAqLCAqLykucmVkdWNlKGZ1bmN0aW9uKG9iaiwgc3RyKXtcbiAgICB2YXIgcGFydHMgPSBzdHIuc3BsaXQoLyAqOyAqLyk7XG4gICAgdmFyIHVybCA9IHBhcnRzWzBdLnNsaWNlKDEsIC0xKTtcbiAgICB2YXIgcmVsID0gcGFydHNbMV0uc3BsaXQoLyAqPSAqLylbMV0uc2xpY2UoMSwgLTEpO1xuICAgIG9ialtyZWxdID0gdXJsO1xuICAgIHJldHVybiBvYmo7XG4gIH0sIHt9KTtcbn07XG5cbi8qKlxuICogU3RyaXAgY29udGVudCByZWxhdGVkIGZpZWxkcyBmcm9tIGBoZWFkZXJgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJcbiAqIEByZXR1cm4ge09iamVjdH0gaGVhZGVyXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLmNsZWFuSGVhZGVyID0gZnVuY3Rpb24oaGVhZGVyLCBjaGFuZ2VzT3JpZ2luKXtcbiAgZGVsZXRlIGhlYWRlclsnY29udGVudC10eXBlJ107XG4gIGRlbGV0ZSBoZWFkZXJbJ2NvbnRlbnQtbGVuZ3RoJ107XG4gIGRlbGV0ZSBoZWFkZXJbJ3RyYW5zZmVyLWVuY29kaW5nJ107XG4gIGRlbGV0ZSBoZWFkZXJbJ2hvc3QnXTtcbiAgLy8gc2VjdWlydHlcbiAgaWYgKGNoYW5nZXNPcmlnaW4pIHtcbiAgICBkZWxldGUgaGVhZGVyWydhdXRob3JpemF0aW9uJ107XG4gICAgZGVsZXRlIGhlYWRlclsnY29va2llJ107XG4gIH1cbiAgcmV0dXJuIGhlYWRlcjtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwibmFtZVwiOiBcInd0Zl93aWtpcGVkaWFcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcInBhcnNlIHdpa2lzY3JpcHQgaW50byBqc29uXCIsXG4gIFwidmVyc2lvblwiOiBcIjIuNi4xXCIsXG4gIFwiYXV0aG9yXCI6IFwiU3BlbmNlciBLZWxseSA8c3BlbmNlcm1vdW50YWluQGdtYWlsLmNvbT4gKGh0dHA6Ly9zcGVuY2VybW91bnRhLmluKVwiLFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0Oi8vZ2l0aHViLmNvbS9zcGVuY2VybW91bnRhaW4vd3RmX3dpa2lwZWRpYS5naXRcIlxuICB9LFxuICBcIm1haW5cIjogXCIuL3NyYy9pbmRleC5qc1wiLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwic3RhcnRcIjogXCJub2RlIC4vc2NyaXB0cy9kZW1vLmpzXCIsXG4gICAgXCJ0ZXN0XCI6IFwibm9kZSAuL3NjcmlwdHMvdGVzdC5qc1wiLFxuICAgIFwicG9zdHB1Ymxpc2hcIjogXCJub2RlIC4vc2NyaXB0cy9jb3ZlcmFnZS5qc1wiLFxuICAgIFwiY292ZXJhZ2VcIjogXCJub2RlIC4vc2NyaXB0cy9jb3ZlcmFnZS5qc1wiLFxuICAgIFwidGVzdGJcIjogXCJURVNURU5WPXByb2Qgbm9kZSAuL3NjcmlwdHMvdGVzdC5qc1wiLFxuICAgIFwid2F0Y2hcIjogXCJhbWJsZSAuL3NjcmF0Y2guanNcIixcbiAgICBcImJ1aWxkXCI6IFwibm9kZSAuL3NjcmlwdHMvYnVpbGQuanNcIlxuICB9LFxuICBcImJpblwiOiB7XG4gICAgXCJ3aWtpcGVkaWFcIjogXCIuL2Jpbi9wYXJzZS5qc1wiLFxuICAgIFwid2lraXBlZGlhX3BsYWludGV4dFwiOiBcIi4vYmluL3BsYWludGV4dC5qc1wiXG4gIH0sXG4gIFwiZmlsZXNcIjogW1xuICAgIFwiYnVpbGRzXCIsXG4gICAgXCJzcmNcIixcbiAgICBcImJpblwiXG4gIF0sXG4gIFwia2V5d29yZHNcIjogW1xuICAgIFwid2lraXBlZGlhXCIsXG4gICAgXCJ3aWtpbWVkaWFcIixcbiAgICBcIndpa2lwZWRpYSBtYXJrdXBcIixcbiAgICBcIndpa2lzY3JpcHRcIlxuICBdLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJqc2hhc2hlc1wiOiBcIl4xLjAuNlwiLFxuICAgIFwic3VwZXJhZ2VudFwiOiBcIl4zLjguMlwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImFtYmxlXCI6IFwiMC4wLjVcIixcbiAgICBcImJhYmVsLWNsaVwiOiBcIl42LjEwLjFcIixcbiAgICBcImJhYmVsLXBsdWdpbi10cmFuc2Zvcm0tb2JqZWN0LWFzc2lnblwiOiBcIl42LjguMFwiLFxuICAgIFwiYmFiZWwtcHJlc2V0LWVzMjAxNVwiOiBcIjYuMjQuMVwiLFxuICAgIFwiYmFiZWxpZnlcIjogXCI4LjAuMFwiLFxuICAgIFwiYnJvd3NlcmlmeVwiOiBcIjE0LjQuMFwiLFxuICAgIFwiY29kYWN5LWNvdmVyYWdlXCI6IFwiXjIuMC4wXCIsXG4gICAgXCJkZXJlcXVpcmVcIjogXCJeMi4wLjNcIixcbiAgICBcImVzbGludFwiOiBcIl40LjE3LjBcIixcbiAgICBcImdhemVcIjogXCJeMS4xLjFcIixcbiAgICBcIm55Y1wiOiBcIl44LjQuMFwiLFxuICAgIFwic2hlbGxqc1wiOiBcIl4wLjguMVwiLFxuICAgIFwidGFwLW1pblwiOiBcIl4xLjIuMVwiLFxuICAgIFwidGFwLXNwZWNcIjogXCI0LjEuMVwiLFxuICAgIFwidGFwZVwiOiBcIjQuOC4wXCIsXG4gICAgXCJ1Z2xpZnktanNcIjogXCIzLjMuOVwiXG4gIH0sXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiXG59XG4iLCIvL3RoZXNlIGFyZSB1c2VkIGZvciB0aGUgc2VudGVuY2Utc3BsaXR0ZXJcbm1vZHVsZS5leHBvcnRzID0gW1xuICAnanInLFxuICAnbXInLFxuICAnbXJzJyxcbiAgJ21zJyxcbiAgJ2RyJyxcbiAgJ3Byb2YnLFxuICAnc3InLFxuICAnc2VuJyxcbiAgJ2NvcnAnLFxuICAnY2FsaWYnLFxuICAncmVwJyxcbiAgJ2dvdicsXG4gICdhdHR5JyxcbiAgJ3N1cHQnLFxuICAnZGV0JyxcbiAgJ3JldicsXG4gICdjb2wnLFxuICAnZ2VuJyxcbiAgJ2x0JyxcbiAgJ2NtZHInLFxuICAnYWRtJyxcbiAgJ2NhcHQnLFxuICAnc2d0JyxcbiAgJ2NwbCcsXG4gICdtYWonLFxuICAnZGVwdCcsXG4gICd1bml2JyxcbiAgJ2Fzc24nLFxuICAnYnJvcycsXG4gICdpbmMnLFxuICAnbHRkJyxcbiAgJ2NvJyxcbiAgJ2NvcnAnLFxuICAnYXJjJyxcbiAgJ2FsJyxcbiAgJ2F2ZScsXG4gICdibHZkJyxcbiAgJ2NsJyxcbiAgJ2N0JyxcbiAgJ2NyZXMnLFxuICAnZXhwJyxcbiAgJ3JkJyxcbiAgJ3N0JyxcbiAgJ2Rpc3QnLFxuICAnbXQnLFxuICAnZnQnLFxuICAnZnknLFxuICAnaHd5JyxcbiAgJ2xhJyxcbiAgJ3BkJyxcbiAgJ3BsJyxcbiAgJ3BseicsXG4gICd0Y2UnLFxuICAnQWxhJyxcbiAgJ0FyaXonLFxuICAnQXJrJyxcbiAgJ0NhbCcsXG4gICdDYWxpZicsXG4gICdDb2wnLFxuICAnQ29sbycsXG4gICdDb25uJyxcbiAgJ0RlbCcsXG4gICdGZWQnLFxuICAnRmxhJyxcbiAgJ0dhJyxcbiAgJ0lkYScsXG4gICdJZCcsXG4gICdJbGwnLFxuICAnSW5kJyxcbiAgJ0lhJyxcbiAgJ0thbicsXG4gICdLYW5zJyxcbiAgJ0tlbicsXG4gICdLeScsXG4gICdMYScsXG4gICdNZScsXG4gICdNZCcsXG4gICdNYXNzJyxcbiAgJ01pY2gnLFxuICAnTWlubicsXG4gICdNaXNzJyxcbiAgJ01vJyxcbiAgJ01vbnQnLFxuICAnTmViJyxcbiAgJ05lYnInLFxuICAnTmV2JyxcbiAgJ01leCcsXG4gICdPa2xhJyxcbiAgJ09rJyxcbiAgJ09yZScsXG4gICdQZW5uYScsXG4gICdQZW5uJyxcbiAgJ1BhJyxcbiAgJ0RhaycsXG4gICdUZW5uJyxcbiAgJ1RleCcsXG4gICdVdCcsXG4gICdWdCcsXG4gICdWYScsXG4gICdXYXNoJyxcbiAgJ1dpcycsXG4gICdXaXNjJyxcbiAgJ1d5JyxcbiAgJ1d5bycsXG4gICdVU0FGQScsXG4gICdBbHRhJyxcbiAgJ09udCcsXG4gICdRdcOUw7jOqScsXG4gICdTYXNrJyxcbiAgJ1l1aycsXG4gICdqYW4nLFxuICAnZmViJyxcbiAgJ21hcicsXG4gICdhcHInLFxuICAnanVuJyxcbiAgJ2p1bCcsXG4gICdhdWcnLFxuICAnc2VwJyxcbiAgJ29jdCcsXG4gICdub3YnLFxuICAnZGVjJyxcbiAgJ3NlcHQnLFxuICAndnMnLFxuICAnZXRjJyxcbiAgJ2VzcCcsXG4gICdsbGInLFxuICAnbWQnLFxuICAnYmwnLFxuICAncGhkJyxcbiAgJ21hJyxcbiAgJ2JhJyxcbiAgJ21pc3MnLFxuICAnbWlzc2VzJyxcbiAgJ21pc3RlcicsXG4gICdzaXInLFxuICAnZXNxJyxcbiAgJ21zdHInLFxuICAnbGl0JyxcbiAgJ2ZsJyxcbiAgJ2V4JyxcbiAgJ2VnJyxcbiAgJ3NlcCcsXG4gICdzZXB0JyxcbiAgJy4uJ1xuXTtcbiIsIi8vIHdpa2lwZWRpYSBzcGVjaWFsIHRlcm1zIGxpZnRlZCBhbmQgYXVnbWVudGVkIGZyb20gcGFyc29pZCBwYXJzZXIgYXByaWwgMjAxNVxuLy8gKG5vdCBldmVuIGNsb3NlIHRvIGJlaW5nIGNvbXBsZXRlKVxubGV0IGkxOG4gPSB7XG4gIGZpbGVzOiBbXG4gICAgJ9GE0LDQudC7JyxcbiAgICAnZml0eGVyJyxcbiAgICAnc291Ym9yJyxcbiAgICAnZGF0ZWknLFxuICAgICdmaWxlJyxcbiAgICAnYXJjaGl2bycsXG4gICAgJ9m+2LHZiNmG2K/ZhycsXG4gICAgJ3RpZWRvc3RvJyxcbiAgICAnbXluZCcsXG4gICAgXCJzdSd3cmV0XCIsXG4gICAgJ2ZpY2hpZXInLFxuICAgICdiZXN0YW5kJyxcbiAgICAn0LTQsNGC0L7RgtC10LrQsCcsXG4gICAgJ2Rvc3lhJyxcbiAgICAnZmlsJ1xuICBdLFxuICBpbWFnZXM6IFsnaW1hZ2UnXSxcbiAgdGVtcGxhdGVzOiBbXG4gICAgJ9GI0LDQsdC70ZHQvScsXG4gICAgJ3BsYW50aWxsYScsXG4gICAgJ8WhYWJsb25hJyxcbiAgICAndm9ybGFnZScsXG4gICAgJ3RlbXBsYXRlJyxcbiAgICAn2KfZhNqv2YgnLFxuICAgICdtYWxsaW5lJyxcbiAgICAnc25pw7AnLFxuICAgICdzaGFibG9uJyxcbiAgICAnbW9kw6hsZScsXG4gICAgJ3NqYWJsb29uJyxcbiAgICAn0YjQsNCx0LvQvtC9JyxcbiAgICAnxZ9hYmxvbidcbiAgXSxcbiAgY2F0ZWdvcmllczogW1xuICAgICfQutCw0YLRjdCz0L7RgNGL0Y8nLFxuICAgICdjYXRlZ29yaWEnLFxuICAgICdrYXRlZ29yaWUnLFxuICAgICdjYXRlZ29yeScsXG4gICAgJ2NhdGVnb3LDrWEnLFxuICAgICfYsdiv2YcnLFxuICAgICdsdW9ra2EnLFxuICAgICdmbG9ra3VyJyxcbiAgICAna2F0ZWdvcml5YScsXG4gICAgJ2NhdMOpZ29yaWUnLFxuICAgICdjYXRlZ29yaWUnLFxuICAgICfQutCw0YLQtdCz0L7RgNC40ZjQsCcsXG4gICAgJ2thdGVnb3JpJyxcbiAgICAna2F0ZWdvcmlhJyxcbiAgICAn2KrYtdmG2YrZgSdcbiAgXSxcbiAgcmVkaXJlY3RzOiBbXG4gICAgJ9C/0LXRgNCw0L3QsNC60ZbRgNCw0LLQsNC90YzQvdC1JyxcbiAgICAncmVkaXJlY3QnLFxuICAgICdwxZllc23Em3J1aicsXG4gICAgJ3dlaXRlcmxlaXR1bmcnLFxuICAgICdyZWRpcmVjY2nDs24nLFxuICAgICdyZWRpcmVjY2lvbicsXG4gICAgJ9iq2LrbjNuM2LFf2YXYs9uM2LEnLFxuICAgICfYqti624zbjNix2YXYs9uM2LEnLFxuICAgICdvaGphdXMnLFxuICAgICd1dWRlbGxlZW5vaGphdXMnLFxuICAgICd0aWx2w61zdW4nLFxuICAgICdhw71kYXcnLFxuICAgICfQsNC50LTQsNGDJyxcbiAgICAncmVkaXJlY3Rpb24nLFxuICAgICdkb29ydmVyd2lqemluZycsXG4gICAgJ9C/0YDQtdGD0YHQvNC10YDQuCcsXG4gICAgJ9C/0YDQtdGD0YHQvNGY0LXRgNC4JyxcbiAgICAnecO2bmxlbmRpzIdybWUnLFxuICAgICd5w7ZubGVuZGnMh3InLFxuICAgICfph43lrprlkJEnLFxuICAgICdyZWRpcmVjY2nDs24nLFxuICAgICdyZWRpcmVjY2lvbicsXG4gICAgJ+mHjeWumuWQkScsXG4gICAgJ3nDtm5sZW5kaXJtP2U/JyxcbiAgICAn2KrYutuM24zYsV/Zhdiz24zYsScsXG4gICAgJ9iq2LrbjNuM2LHZhdiz24zYsScsXG4gICAgJ9C/0LXRgNCw0L3QsNC60ZbRgNCw0LLQsNC90YzQvdC1JyxcbiAgICAnecO2bmxlbmRpcm1lJ1xuICBdLFxuICBzcGVjaWFsczogW1xuICAgICfRgdC/0Y3RhtGL0Y/Qu9GM0L3Ri9GPJyxcbiAgICAnZXNwZWNpYWwnLFxuICAgICdzcGVjacOhbG7DrScsXG4gICAgJ3NwZXppYWwnLFxuICAgICdzcGVjaWFsJyxcbiAgICAn2YjbjNqY2YcnLFxuICAgICd0b2ltaW5ub3QnLFxuICAgICdrZXJmaXNzw63DsGEnLFxuICAgICdhcm5hd2zEsScsXG4gICAgJ3Nww6ljaWFsJyxcbiAgICAnc3BlY2lhYWwnLFxuICAgICfQv9C+0YHQtdCx0L3QvicsXG4gICAgJ8O2emVsJ1xuICBdLFxuICB1c2VyczogW1xuICAgICfRg9C00LfQtdC70YzQvdGW0LonLFxuICAgICd1c3VhcmknLFxuICAgICd1xb5pdmF0ZWwnLFxuICAgICdiZW51dHplcicsXG4gICAgJ3VzZXInLFxuICAgICd1c3VhcmlvJyxcbiAgICAn2qnYp9ix2KjYsScsXG4gICAgJ2vDpHl0dMOkasOkJyxcbiAgICAnbm90YW5kaScsXG4gICAgJ3BheWRhbGFuxLF3c2jEsScsXG4gICAgJ3V0aWxpc2F0ZXVyJyxcbiAgICAnZ2VicnVpa2VyJyxcbiAgICAn0LrQvtGA0LjRgdC90LjQuicsXG4gICAgJ2t1bGxhbsSxY8SxJ1xuICBdLFxuICBkaXNhbWJpZ3M6IFtcbiAgICAnZGlzYW1iaWcnLCAvL2VuXG4gICAgJ2Rpc2FtYmlndWF0aW9uJywgLy9lblxuICAgICdkYWInLCAvL2VuXG4gICAgJ2Rpc2FtYicsIC8vZW5cbiAgICAnYmVncmlmZnNrbMOkcnVuZycsIC8vZGVcbiAgICAndWplZG5vem5hY3puaWVuaWUnLCAvL3BsXG4gICAgJ2Rvb3J2ZXJ3aWpzcGFnaW5hJywgLy9ubFxuICAgICfmtojmrafkuYknLCAvL3poXG4gICAgJ2Rlc2FtYmlndWFjacOzbicsIC8vZXNcbiAgICAnZHViYmVsc2lubmlnJywgLy9hZlxuICAgICdkaXNhbWJpZ3VhJywgLy9pdFxuICAgICdkZXNhbWJpZ3Vhw6fDo28nLCAvL3B0XG4gICAgJ2hvbW9ueW1pZScsIC8vZnJcbiAgICAn0L3QtdC+0LTQvdC+0LfQvdCw0YfQvdC+0YHRgtGMJywgLy9ydVxuICAgICdhbmxhbSBheXLEsW3EsScgLy90clxuICBdLFxuICBpbmZvYm94ZXM6IFtcbiAgICAnaW5mb2JveCcsXG4gICAgJ2ZpY2hhJyxcbiAgICAn0LrQsNC90LDQtNGB0LrQuNC5JyxcbiAgICAnaW5saWd0aW5nc2thcycsXG4gICAgJ2lubGlndGluZ3NrYXMzJywgLy9hZlxuICAgICfZhNi62KknLFxuICAgICdiaWxnaSBrdXR1c3UnLCAvL3RyXG4gICAgJ3llcmxlxZ9pbSBiaWxnaSBrdXR1c3UnLFxuICAgICdpbmZvYm9rcycgLy9ubiwgbm9cbiAgXSxcbiAgc291cmNlczogW1xuICAgIC8vYmxhY2tsaXN0IHRoZXNlIGhlYWRpbmdzLCBhcyB0aGV5J3JlIG5vdCBwbGFpbi10ZXh0XG4gICAgJ3JlZmVyZW5jZXMnLFxuICAgICdzZWUgYWxzbycsXG4gICAgJ2V4dGVybmFsIGxpbmtzJyxcbiAgICAnZnVydGhlciByZWFkaW5nJyxcbiAgICAnbm90ZXMgZXQgcsOpZsOpcmVuY2VzJyxcbiAgICAndm9pciBhdXNzaScsXG4gICAgJ2xpZW5zIGV4dGVybmVzJ1xuICBdXG59O1xuXG5sZXQgZGljdGlvbmFyeSA9IHt9O1xuT2JqZWN0LmtleXMoaTE4bikuZm9yRWFjaChrID0+IHtcbiAgaTE4bltrXS5mb3JFYWNoKHcgPT4ge1xuICAgIGRpY3Rpb25hcnlbd10gPSB0cnVlO1xuICB9KTtcbn0pO1xuaTE4bi5kaWN0aW9uYXJ5ID0gZGljdGlvbmFyeTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gaTE4bjtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBhYToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdBZmFyJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQWZhcidcbiAgfSxcbiAgYWI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQWJraGF6aWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn0JDSp9GB0YPQsCdcbiAgfSxcbiAgYWY6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQWZyaWthYW5zJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQWZyaWthYW5zJ1xuICB9LFxuICBhazoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdBa2FuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQWthbmEnXG4gIH0sXG4gIGFsczoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdBbGVtYW5uaWMnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdBbGVtYW5uaXNjaCdcbiAgfSxcbiAgYW06IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQW1oYXJpYycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+GKoOGIm+GIreGKmydcbiAgfSxcbiAgYW46IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQXJhZ29uZXNlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQXJhZ29uw6lzJ1xuICB9LFxuICBhbmc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQW5nbG8tU2F4b24nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdFbmdsaXNjJ1xuICB9LFxuICBhcjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdBcmFiaWMnLFxuICAgIGRpcmVjdGlvbjogJ3J0bCcsXG4gICAgbG9jYWxfdGl0bGU6ICfYp9mE2LnYsdio2YrYqSdcbiAgfSxcbiAgYXJjOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0FyYW1haWMnLFxuICAgIGRpcmVjdGlvbjogJ3J0bCcsXG4gICAgbG9jYWxfdGl0bGU6ICfco9yY3KrcrCdcbiAgfSxcbiAgYXM6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQXNzYW1lc2UnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfgpoXgprjgpq7gp4Dgpq/gprzgpr4nXG4gIH0sXG4gIGFzdDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdBc3R1cmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0FzdHVyaWFudSdcbiAgfSxcbiAgYXY6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQXZhcicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9CQ0LLQsNGAJ1xuICB9LFxuICBheToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdBeW1hcmEnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdBeW1hcidcbiAgfSxcbiAgYXo6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQXplcmJhaWphbmknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdBesmZcmJheWNhbmNhJ1xuICB9LFxuICBiYToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdCYXNoa2lyJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn0JHQsNGI0qHQvtGA0YInXG4gIH0sXG4gIGJhcjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdCYXZhcmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0JvYXJpc2NoJ1xuICB9LFxuICAnYmF0LXNtZyc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnU2Ftb2dpdGlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ8W9ZW1haXTEl8Wha2EnXG4gIH0sXG4gIGJjbDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdCaWtvbCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0Jpa29sJ1xuICB9LFxuICBiZToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdCZWxhcnVzaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn0JHQtdC70LDRgNGD0YHQutCw0Y8nXG4gIH0sXG4gICdiZS14LW9sZCc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQmVsYXJ1c2lhbicsXG4gICAgZGlyZWN0aW9uOiAnKFRhcmHFoWtpZXZpY2EpJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgYmc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQnVsZ2FyaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn0JHRitC70LPQsNGA0YHQutC4J1xuICB9LFxuICBiaDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdCaWhhcmknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfgpK3gpYvgpJzgpKrgpYHgpLDgpYAnXG4gIH0sXG4gIGJpOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0Jpc2xhbWEnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdCaXNsYW1hJ1xuICB9LFxuICBibToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdCYW1iYXJhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQmFtYW5hbmthbidcbiAgfSxcbiAgYm46IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQmVuZ2FsaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+CmrOCmvuCmguCmsuCmvidcbiAgfSxcbiAgYm86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVGliZXRhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+C9luC9vOC9keC8i+C9oeC9suC9gidcbiAgfSxcbiAgYnB5OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0Jpc2hudXByaXlhJyxcbiAgICBkaXJlY3Rpb246ICdNYW5pcHVyaScsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIGJyOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0JyZXRvbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0JyZXpob25lZydcbiAgfSxcbiAgYnM6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQm9zbmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0Jvc2Fuc2tpJ1xuICB9LFxuICBidWc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQnVnaW5lc2UnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfhqIXhqJQnXG4gIH0sXG4gIGJ4cjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdCdXJpYXQnLFxuICAgIGRpcmVjdGlvbjogJyhSdXNzaWEpJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgY2E6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQ2F0YWxhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0NhdGFsw6AnXG4gIH0sXG4gIGNkbzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdNaW4nLFxuICAgIGRpcmVjdGlvbjogJ0RvbmcnLFxuICAgIGxvY2FsX3RpdGxlOiAnQ2hpbmVzZSdcbiAgfSxcbiAgY2U6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQ2hlY2hlbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9Cd0L7RhdGH0LjQudC9J1xuICB9LFxuICBjZWI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQ2VidWFubycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1NpbnVnYm9hbm9uZydcbiAgfSxcbiAgY2g6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQ2hhbW9ycm8nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdDaGFtb3J1J1xuICB9LFxuICBjaG86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQ2hvY3RhdycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0Nob2N0YXcnXG4gIH0sXG4gIGNocjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdDaGVyb2tlZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+GPo+GOs+GOqSdcbiAgfSxcbiAgY2h5OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0NoZXllbm5lJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnVHNldHPDqmhlc3TDomhlc2UnXG4gIH0sXG4gIGNvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0NvcnNpY2FuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQ29yc3UnXG4gIH0sXG4gIGNyOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0NyZWUnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdOZWhpeWF3J1xuICB9LFxuICBjczoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdDemVjaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ8SMZXNreSdcbiAgfSxcbiAgY3NiOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0thc2h1YmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0thc3rDq2JzY3ppJ1xuICB9LFxuICBjdToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdPbGQnLFxuICAgIGRpcmVjdGlvbjogJ0NodXJjaCcsXG4gICAgbG9jYWxfdGl0bGU6ICdTbGF2b25pYydcbiAgfSxcbiAgY3Y6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQ2h1dmFzaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9CnxIPQstCw0YgnXG4gIH0sXG4gIGN5OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1dlbHNoJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQ3ltcmFlZydcbiAgfSxcbiAgZGE6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRGFuaXNoJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnRGFuc2snXG4gIH0sXG4gIGRlOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0dlcm1hbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0RldXRzY2gnXG4gIH0sXG4gIGRpcToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdEaW1saScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1phemFraSdcbiAgfSxcbiAgZHNiOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0xvd2VyJyxcbiAgICBkaXJlY3Rpb246ICdTb3JiaWFuJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgZHY6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRGl2ZWhpJyxcbiAgICBkaXJlY3Rpb246ICdydGwnLFxuICAgIGxvY2FsX3RpdGxlOiAn3oveqN6I3qzegN6o3oTept6Q3rAnXG4gIH0sXG4gIGR6OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0R6b25na2hhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4L2H4L284L2E4LyL4L2BJ1xuICB9LFxuICBlZToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdFd2UnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfGkMqLyZsnXG4gIH0sXG4gIGZhcjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdGYXJzaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9mB2KfYsdiz24wnXG4gIH0sXG4gIGVsOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0dyZWVrJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnzpXOu867zrfOvc65zrrOrCdcbiAgfSxcbiAgZW46IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRW5nbGlzaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0VuZ2xpc2gnXG4gIH0sXG4gIGVvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0VzcGVyYW50bycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0VzcGVyYW50bydcbiAgfSxcbiAgZXM6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnU3BhbmlzaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0VzcGHDsW9sJ1xuICB9LFxuICBldDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdFc3RvbmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0Vlc3RpJ1xuICB9LFxuICBldToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdCYXNxdWUnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdFdXNrYXJhJ1xuICB9LFxuICBleHQ6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRXh0cmVtYWR1cmFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnRXN0cmVtZcOxdSdcbiAgfSxcbiAgZmY6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnUGV1bCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0Z1bGZ1bGRlJ1xuICB9LFxuICBmaToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdGaW5uaXNoJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnU3VvbWknXG4gIH0sXG4gICdmaXUtdnJvJzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdWw7VybycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1bDtXJvJ1xuICB9LFxuICBmajoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdGaWppYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdOYSdcbiAgfSxcbiAgZm86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRmFyb2VzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0bDuHJveXNrdCdcbiAgfSxcbiAgZnI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRnJlbmNoJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnRnJhbsOnYWlzJ1xuICB9LFxuICBmcnA6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQXJwaXRhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0FycGl0YW4nXG4gIH0sXG4gIGZ1cjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdGcml1bGlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0Z1cmxhbidcbiAgfSxcbiAgZnk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnV2VzdCcsXG4gICAgZGlyZWN0aW9uOiAnRnJpc2lhbicsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIGdhOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0lyaXNoJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnR2FlaWxnZSdcbiAgfSxcbiAgZ2FuOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0dhbicsXG4gICAgZGlyZWN0aW9uOiAnQ2hpbmVzZScsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIGdkOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1Njb3R0aXNoJyxcbiAgICBkaXJlY3Rpb246ICdHYWVsaWMnLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICBnaWw6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnR2lsYmVydGVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1RhZXRhZSdcbiAgfSxcbiAgZ2w6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnR2FsaWNpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdHYWxlZ28nXG4gIH0sXG4gIGduOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0d1YXJhbmknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6IFwiQXZhw7FlJ+G6vVwiXG4gIH0sXG4gIGdvdDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdHb3RoaWMnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdndXRpc2snXG4gIH0sXG4gIGd1OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0d1amFyYXRpJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4KqX4KuB4Kqc4Kqw4Kq+4Kqk4KuAJ1xuICB9LFxuICBndjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdNYW54JyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnR2FlbGcnXG4gIH0sXG4gIGhhOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0hhdXNhJyxcbiAgICBkaXJlY3Rpb246ICdydGwnLFxuICAgIGxvY2FsX3RpdGxlOiAn2YfZjtmI2Y/Ys9mOJ1xuICB9LFxuICBoYWs6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnSGFra2EnLFxuICAgIGRpcmVjdGlvbjogJ0NoaW5lc2UnLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICBoYXc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnSGF3YWlpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdIYXdhaWBpJ1xuICB9LFxuICBoZToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdIZWJyZXcnLFxuICAgIGRpcmVjdGlvbjogJ3J0bCcsXG4gICAgbG9jYWxfdGl0bGU6ICfXoteR16jXmdeqJ1xuICB9LFxuICBoaToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdIaW5kaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+CkueCkv+CkqOCljeCkpuClgCdcbiAgfSxcbiAgaG86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnSGlyaScsXG4gICAgZGlyZWN0aW9uOiAnTW90dScsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIGhyOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0Nyb2F0aWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnSHJ2YXRza2knXG4gIH0sXG4gIGh0OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0hhaXRpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdLcsOoeW9sJ1xuICB9LFxuICBodToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdIdW5nYXJpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdNYWd5YXInXG4gIH0sXG4gIGh5OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0FybWVuaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn1YDVodW11aXWgNWl1bYnXG4gIH0sXG4gIGh6OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0hlcmVybycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ090c2loZXJlcm8nXG4gIH0sXG4gIGlhOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0ludGVybGluZ3VhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnSW50ZXJsaW5ndWEnXG4gIH0sXG4gIGlkOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0luZG9uZXNpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdCYWhhc2EnXG4gIH0sXG4gIGllOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0ludGVybGluZ3VlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnSW50ZXJsaW5ndWUnXG4gIH0sXG4gIGlnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0lnYm8nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdJZ2JvJ1xuICB9LFxuICBpaToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTaWNodWFuJyxcbiAgICBkaXJlY3Rpb246ICdZaScsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIGlrOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0ludXBpYWsnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdJw7F1cGlhaydcbiAgfSxcbiAgaWxvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0lsb2thbm8nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdJbG9rYW5vJ1xuICB9LFxuICBpbzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdJZG8nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdJZG8nXG4gIH0sXG4gIGlzOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0ljZWxhbmRpYycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ8ONc2xlbnNrYSdcbiAgfSxcbiAgaXQ6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnSXRhbGlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0l0YWxpYW5vJ1xuICB9LFxuICBpdToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdJbnVrdGl0dXQnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfhkIPhk4ThkoPhkY7hkZDhkaYnXG4gIH0sXG4gIGphOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0phcGFuZXNlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn5pel5pys6KqeJ1xuICB9LFxuICBqYm86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTG9qYmFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTG9qYmFuJ1xuICB9LFxuICBqdjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdKYXZhbmVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0Jhc2EnXG4gIH0sXG4gIGthOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0dlb3JnaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4YOl4YOQ4YOg4YOX4YOj4YOa4YOYJ1xuICB9LFxuICBrZzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdLb25nbycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0tpS29uZ28nXG4gIH0sXG4gIGtpOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0tpa3V5dScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0fEqWvFqXnFqSdcbiAgfSxcbiAga2o6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnS3VhbnlhbWEnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdLdWFueWFtYSdcbiAgfSxcbiAga2s6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnS2F6YWtoJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn0prQsNC30LDSm9GI0LAnXG4gIH0sXG4gIGtsOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0dyZWVubGFuZGljJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnS2FsYWFsbGlzdXQnXG4gIH0sXG4gIGttOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0NhbWJvZGlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+Gel+GetuGen+GetuGegeGfkuGemOGfguGemidcbiAgfSxcbiAga246IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnS2FubmFkYScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+CyleCyqOCzjeCyqOCyoSdcbiAgfSxcbiAga2h3OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0tob3dhcicsXG4gICAgZGlyZWN0aW9uOiAncnRsJyxcbiAgICBsb2NhbF90aXRsZTogJ9qp2r7ZiNin2LEnXG4gIH0sXG4gIGtvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0tvcmVhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+2VnOq1reyWtCdcbiAgfSxcbiAga3I6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnS2FudXJpJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnS2FudXJpJ1xuICB9LFxuICBrczoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdLYXNobWlyaScsXG4gICAgZGlyZWN0aW9uOiAncnRsJyxcbiAgICBsb2NhbF90aXRsZTogJ+CkleCktuCljeCkruClgOCksOClgCdcbiAgfSxcbiAga3NoOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1JpcHVhcmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1JpcG9hcmlzY2gnXG4gIH0sXG4gIGt1OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0t1cmRpc2gnLFxuICAgIGRpcmVjdGlvbjogJ3J0bCcsXG4gICAgbG9jYWxfdGl0bGU6ICdLdXJkw64nXG4gIH0sXG4gIGt2OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0tvbWknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfQmtC+0LzQuCdcbiAgfSxcbiAga3c6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQ29ybmlzaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0tlcm5ld2VrJ1xuICB9LFxuICBreToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdLaXJnaGl6JyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnS8SxcmfEsXpjYSdcbiAgfSxcbiAgbGE6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTGF0aW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdMYXRpbmEnXG4gIH0sXG4gIGxhZDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdMYWRpbm8nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdEemh1ZGV6bW8nXG4gIH0sXG4gIGxhbjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdMYW5nbycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0xlYidcbiAgfSxcbiAgbGI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTHV4ZW1ib3VyZ2lzaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0zDq3R6ZWJ1ZXJnZXNjaCdcbiAgfSxcbiAgbGc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnR2FuZGEnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdMdWdhbmRhJ1xuICB9LFxuICBsaToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdMaW1idXJnaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTGltYnVyZ3MnXG4gIH0sXG4gIGxpajoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdMaWd1cmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0zDrWd1cnUnXG4gIH0sXG4gIGxtbzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdMb21iYXJkJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTHVtYmFhcnQnXG4gIH0sXG4gIGxuOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0xpbmdhbGEnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdMaW5nw6FsYSdcbiAgfSxcbiAgbG86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTGFvdGlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+C6peC6suC6pydcbiAgfSxcbiAgbHQ6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTGl0aHVhbmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0xpZXR1dmnFsydcbiAgfSxcbiAgbHY6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTGF0dmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0xhdHZpZcWhdSdcbiAgfSxcbiAgJ21hcC1ibXMnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0Jhbnl1bWFzYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdCYXNhJ1xuICB9LFxuICBtZzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdNYWxhZ2FzeScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ01hbGFnYXN5J1xuICB9LFxuICBtYW46IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTWFuZGFyaW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICflrpjoqbEnXG4gIH0sXG4gIG1oOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ01hcnNoYWxsZXNlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnS2FqaW4nXG4gIH0sXG4gIG1pOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ01hb3JpJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTcSBb3JpJ1xuICB9LFxuICBtaW46IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTWluYW5na2FiYXUnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdNaW5hbmdrYWJhdSdcbiAgfSxcbiAgbWs6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTWFjZWRvbmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9Cc0LDQutC10LTQvtC90YHQutC4J1xuICB9LFxuICBtbDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdNYWxheWFsYW0nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfgtK7gtLLgtK/gtL7gtLPgtIInXG4gIH0sXG4gIG1uOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ01vbmdvbGlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9Cc0L7QvdCz0L7QuydcbiAgfSxcbiAgbW86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTW9sZG92YW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdNb2xkb3ZlbmVhc2PEgydcbiAgfSxcbiAgbXI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTWFyYXRoaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+CkruCksOCkvuCkoOClgCdcbiAgfSxcbiAgbXM6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTWFsYXknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdCYWhhc2EnXG4gIH0sXG4gIG10OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ01hbHRlc2UnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdiaWwtTWFsdGknXG4gIH0sXG4gIG11czoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdDcmVlaycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ011c2tvZ2VlJ1xuICB9LFxuICBteToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdCdXJtZXNlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTXlhbm1hc2EnXG4gIH0sXG4gIG5hOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ05hdXJ1YW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdEb3JlcmluJ1xuICB9LFxuICBuYWg6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTmFodWF0bCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ05haHVhdGwnXG4gIH0sXG4gIG5hcDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdOZWFwb2xpdGFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTm5hcHVsaXRhbm8nXG4gIH0sXG4gIG5kOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ05vcnRoJyxcbiAgICBkaXJlY3Rpb246ICdOZGViZWxlJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgbmRzOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0xvdyBHZXJtYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdQbGF0dGTDvMO8dHNjaCdcbiAgfSxcbiAgJ25kcy1ubCc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRHV0Y2gnLFxuICAgIGRpcmVjdGlvbjogJ0xvdycsXG4gICAgbG9jYWxfdGl0bGU6ICdTYXhvbidcbiAgfSxcbiAgbmU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTmVwYWxpJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4KSo4KWH4KSq4KS+4KSy4KWAJ1xuICB9LFxuICBuZXc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTmV3YXInLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfgpKjgpYfgpKrgpL7gpLLgpK3gpL7gpLfgpL4nXG4gIH0sXG4gIG5nOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ05kb25nYScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ09zaGl3YW1ibydcbiAgfSxcbiAgbmw6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRHV0Y2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdOZWRlcmxhbmRzJ1xuICB9LFxuICBubjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdOb3J3ZWdpYW4nLFxuICAgIGRpcmVjdGlvbjogJ055bm9yc2snLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICBubzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdOb3J3ZWdpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdOb3JzaydcbiAgfSxcbiAgbnI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnU291dGgnLFxuICAgIGRpcmVjdGlvbjogJ05kZWJlbGUnLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICBuc286IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTm9ydGhlcm4nLFxuICAgIGRpcmVjdGlvbjogJ1NvdGhvJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgbnJtOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ05vcm1hbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ05vdW9ybWFuZCdcbiAgfSxcbiAgbnY6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTmF2YWpvJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnRGluw6knXG4gIH0sXG4gIG55OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0NoaWNoZXdhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQ2hpLUNoZXdhJ1xuICB9LFxuICBvYzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdPY2NpdGFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnT2NjaXRhbidcbiAgfSxcbiAgb2o6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnT2ppYndhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4ZCK4ZOC4ZSR4ZOI4ZCv4ZKn4ZCO4ZOQJ1xuICB9LFxuICBvbToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdPcm9tbycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ09yb21vbydcbiAgfSxcbiAgb3I6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnT3JpeWEnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfgrJPgrKHgrLzgrL/grIYnXG4gIH0sXG4gIG9zOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ09zc2V0aWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn0JjRgNC+0L3QsNGDJ1xuICB9LFxuICBwYToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdQYW5qYWJpJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4Kiq4Kmw4Kic4Ki+4Kis4KmAJ1xuICB9LFxuICBwYWc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnUGFuZ2FzaW5hbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1Bhbmdhc2luYW4nXG4gIH0sXG4gIHBhbToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdLYXBhbXBhbmdhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0thcGFtcGFuZ2FuJ1xuICB9LFxuICBwYXA6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnUGFwaWFtZW50dScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1BhcGlhbWVudHUnXG4gIH0sXG4gIHBkYzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdQZW5uc3lsdmFuaWEnLFxuICAgIGRpcmVjdGlvbjogJ0dlcm1hbicsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIHBpOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1BhbGknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdQxIFsaSdcbiAgfSxcbiAgcGloOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ05vcmZvbGsnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdOb3JmdWsnXG4gIH0sXG4gIHBsOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1BvbGlzaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1BvbHNraSdcbiAgfSxcbiAgcG1zOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1BpZWRtb250ZXNlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnUGllbW9udMOoaXMnXG4gIH0sXG4gIHBzOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1Bhc2h0bycsXG4gICAgZGlyZWN0aW9uOiAncnRsJyxcbiAgICBsb2NhbF90aXRsZTogJ9m+2prYqtmIJ1xuICB9LFxuICBwdDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdQb3J0dWd1ZXNlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnUG9ydHVndcOqcydcbiAgfSxcbiAgcXU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnUXVlY2h1YScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1J1bmEnXG4gIH0sXG4gIHJtOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1JhZXRvJyxcbiAgICBkaXJlY3Rpb246ICdSb21hbmNlJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgcm15OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1JvbWFuaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1JvbWFuaSdcbiAgfSxcbiAgcm46IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnS2lydW5kaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0tpcnVuZGknXG4gIH0sXG4gIHJvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1JvbWFuaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnUm9tw6JuxIMnXG4gIH0sXG4gICdyb2EtcnVwJzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdBcm9tYW5pYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdBcm3Dom5lYXNodGknXG4gIH0sXG4gIHJ1OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1J1c3NpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfQoNGD0YHRgdC60LjQuSdcbiAgfSxcbiAgcnc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnUndhbmRpJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnS2lueWFyd2FuZGknXG4gIH0sXG4gIHNhOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NhbnNrcml0JyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4KS44KSC4KS44KWN4KSV4KWD4KSk4KSu4KWNJ1xuICB9LFxuICBzYzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTYXJkaW5pYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdTYXJkdSdcbiAgfSxcbiAgc2NuOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NpY2lsaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnU2ljaWxpYW51J1xuICB9LFxuICBzY286IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnU2NvdHMnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdTY290cydcbiAgfSxcbiAgc2Q6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnU2luZGhpJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4KS44KS/4KSo4KSn4KS/J1xuICB9LFxuICBzZToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdOb3J0aGVybicsXG4gICAgZGlyZWN0aW9uOiAnU2FtaScsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIHNnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NhbmdvJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnU8OkbmfDtidcbiAgfSxcbiAgc2g6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnU2VyYm8tQ3JvYXRpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdTcnBza29ocnZhdHNraSdcbiAgfSxcbiAgc2k6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnU2luaGFsZXNlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4LeD4LeS4LaC4LeE4La9J1xuICB9LFxuICBzaW1wbGU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnU2ltcGxlJyxcbiAgICBkaXJlY3Rpb246ICdFbmdsaXNoJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgc2s6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnU2xvdmFrJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnU2xvdmVuxI1pbmEnXG4gIH0sXG4gIHNsOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1Nsb3ZlbmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1Nsb3ZlbsWhxI1pbmEnXG4gIH0sXG4gIHNtOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NhbW9hbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0dhZ2FuYSdcbiAgfSxcbiAgc246IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnU2hvbmEnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdjaGlTaG9uYSdcbiAgfSxcbiAgc286IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnU29tYWxpYScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1Nvb21hYWxpZ2EnXG4gIH0sXG4gIHNxOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0FsYmFuaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnU2hxaXAnXG4gIH0sXG4gIHNyOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NlcmJpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfQodGA0L/RgdC60LgnXG4gIH0sXG4gIHNzOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1N3YXRpJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnU2lTd2F0aSdcbiAgfSxcbiAgc3Q6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnU291dGhlcm4nLFxuICAgIGRpcmVjdGlvbjogJ1NvdGhvJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgc3U6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnU3VuZGFuZXNlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQmFzYSdcbiAgfSxcbiAgc3Y6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnU3dlZGlzaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1N2ZW5za2EnXG4gIH0sXG4gIHN3OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1N3YWhpbGknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdLaXN3YWhpbGknXG4gIH0sXG4gIHRhOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1RhbWlsJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4K6k4K6u4K6/4K604K+NJ1xuICB9LFxuICB0ZToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdUZWx1Z3UnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfgsKTgsYbgsLLgsYHgsJfgsYEnXG4gIH0sXG4gIHRldDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdUZXR1bScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1RldHVuJ1xuICB9LFxuICB0Zzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdUYWppaycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9Ci0L7St9C40LrToydcbiAgfSxcbiAgdGg6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVGhhaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+C5hOC4l+C4oidcbiAgfSxcbiAgdGk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVGlncmlueWEnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfhibXhjI3hiK3hipsnXG4gIH0sXG4gIHRrOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1R1cmttZW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfQotGD0YDQutC80LXQvSdcbiAgfSxcbiAgdGw6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVGFnYWxvZycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1RhZ2Fsb2cnXG4gIH0sXG4gIHRsaDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdLbGluZ29uJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAndGxoSW5nYW4tSG9sJ1xuICB9LFxuICB0bjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdUc3dhbmEnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdTZXRzd2FuYSdcbiAgfSxcbiAgdG86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVG9uZ2EnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdMZWEnXG4gIH0sXG4gIHRwaToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdUb2snLFxuICAgIGRpcmVjdGlvbjogJ1Bpc2luJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgdHI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVHVya2lzaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1TDvHJrw6dlJ1xuICB9LFxuICB0czoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdUc29uZ2EnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdYaXRzb25nYSdcbiAgfSxcbiAgdHQ6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVGF0YXInLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdUYXRhcsOnYSdcbiAgfSxcbiAgdHVtOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1R1bWJ1a2EnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdjaGlUdW1idWthJ1xuICB9LFxuICB0dzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdUd2knLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdUd2knXG4gIH0sXG4gIHR5OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1RhaGl0aWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnUmVvJ1xuICB9LFxuICB1ZG06IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVWRtdXJ0JyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn0KPQtNC80YPRgNGCJ1xuICB9LFxuICB1Zzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdVeWdodXInLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdVecajdXJxyZknXG4gIH0sXG4gIHVrOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1VrcmFpbmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9Cj0LrRgNCw0ZfQvdGB0YzQutCwJ1xuICB9LFxuICB1cjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdVcmR1JyxcbiAgICBkaXJlY3Rpb246ICdydGwnLFxuICAgIGxvY2FsX3RpdGxlOiAn2KfYsdiv2YgnXG4gIH0sXG4gIHV6OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1V6YmVrJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn0I7Qt9Cx0LXQuidcbiAgfSxcbiAgdmU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVmVuZGEnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdUc2hpdmVu4biTYSdcbiAgfSxcbiAgdmk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVmlldG5hbWVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1Zp4buHdG5hbSdcbiAgfSxcbiAgdmVjOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1ZlbmV0aWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnVsOobmV0bydcbiAgfSxcbiAgdmxzOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1dlc3QnLFxuICAgIGRpcmVjdGlvbjogJ0ZsZW1pc2gnLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICB2bzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdWb2xhcMO8aycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1ZvbGFww7xrJ1xuICB9LFxuICB3YToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdXYWxsb29uJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnV2Fsb24nXG4gIH0sXG4gIHdhcjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdXYXJheS1XYXJheScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1dpbmFyYXknXG4gIH0sXG4gIHdvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1dvbG9mJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnV29sbG9mJ1xuICB9LFxuICB4YWw6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnS2FsbXlrJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn0KXQsNC70YzQvNCzJ1xuICB9LFxuICB4aDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdYaG9zYScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ2lzaVhob3NhJ1xuICB9LFxuICB5aToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdZaWRkaXNoJyxcbiAgICBkaXJlY3Rpb246ICdydGwnLFxuICAgIGxvY2FsX3RpdGxlOiAn15nXmda015PXmdepJ1xuICB9LFxuICB5bzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdZb3J1YmEnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdZb3LDuWLDoSdcbiAgfSxcbiAgemE6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnWmh1YW5nJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQ3VlbmdoJ1xuICB9LFxuICB6aDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdDaGluZXNlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn5Lit5paHJ1xuICB9LFxuICAnemgtY2xhc3NpY2FsJzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdDbGFzc2ljYWwnLFxuICAgIGRpcmVjdGlvbjogJ0NoaW5lc2UnLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICAnemgtbWluLW5hbic6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTWlubmFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQsOibi1sw6JtLWfDuidcbiAgfSxcbiAgJ3poLXl1ZSc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQ2FudG9uZXNlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn57K16KqeJ1xuICB9LFxuICB6dToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdadWx1JyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnaXNpWnVsdSdcbiAgfVxufTtcbiIsIi8vZnJvbSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvdy9hcGkucGhwP2FjdGlvbj1zaXRlbWF0cml4JmZvcm1hdD1qc29uXG5jb25zdCBzaXRlX21hcCA9IHtcbiAgYWF3aWtpOiAnaHR0cHM6Ly9hYS53aWtpcGVkaWEub3JnJyxcbiAgYWF3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9hYS53aWt0aW9uYXJ5Lm9yZycsXG4gIGFhd2lraWJvb2tzOiAnaHR0cHM6Ly9hYS53aWtpYm9va3Mub3JnJyxcbiAgYWJ3aWtpOiAnaHR0cHM6Ly9hYi53aWtpcGVkaWEub3JnJyxcbiAgYWJ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9hYi53aWt0aW9uYXJ5Lm9yZycsXG4gIGFjZXdpa2k6ICdodHRwczovL2FjZS53aWtpcGVkaWEub3JnJyxcbiAgYWZ3aWtpOiAnaHR0cHM6Ly9hZi53aWtpcGVkaWEub3JnJyxcbiAgYWZ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9hZi53aWt0aW9uYXJ5Lm9yZycsXG4gIGFmd2lraWJvb2tzOiAnaHR0cHM6Ly9hZi53aWtpYm9va3Mub3JnJyxcbiAgYWZ3aWtpcXVvdGU6ICdodHRwczovL2FmLndpa2lxdW90ZS5vcmcnLFxuICBha3dpa2k6ICdodHRwczovL2FrLndpa2lwZWRpYS5vcmcnLFxuICBha3dpa3Rpb25hcnk6ICdodHRwczovL2FrLndpa3Rpb25hcnkub3JnJyxcbiAgYWt3aWtpYm9va3M6ICdodHRwczovL2FrLndpa2lib29rcy5vcmcnLFxuICBhbHN3aWtpOiAnaHR0cHM6Ly9hbHMud2lraXBlZGlhLm9yZycsXG4gIGFsc3dpa3Rpb25hcnk6ICdodHRwczovL2Fscy53aWt0aW9uYXJ5Lm9yZycsXG4gIGFsc3dpa2lib29rczogJ2h0dHBzOi8vYWxzLndpa2lib29rcy5vcmcnLFxuICBhbHN3aWtpcXVvdGU6ICdodHRwczovL2Fscy53aWtpcXVvdGUub3JnJyxcbiAgYW13aWtpOiAnaHR0cHM6Ly9hbS53aWtpcGVkaWEub3JnJyxcbiAgYW13aWt0aW9uYXJ5OiAnaHR0cHM6Ly9hbS53aWt0aW9uYXJ5Lm9yZycsXG4gIGFtd2lraXF1b3RlOiAnaHR0cHM6Ly9hbS53aWtpcXVvdGUub3JnJyxcbiAgYW53aWtpOiAnaHR0cHM6Ly9hbi53aWtpcGVkaWEub3JnJyxcbiAgYW53aWt0aW9uYXJ5OiAnaHR0cHM6Ly9hbi53aWt0aW9uYXJ5Lm9yZycsXG4gIGFuZ3dpa2k6ICdodHRwczovL2FuZy53aWtpcGVkaWEub3JnJyxcbiAgYW5nd2lrdGlvbmFyeTogJ2h0dHBzOi8vYW5nLndpa3Rpb25hcnkub3JnJyxcbiAgYW5nd2lraWJvb2tzOiAnaHR0cHM6Ly9hbmcud2lraWJvb2tzLm9yZycsXG4gIGFuZ3dpa2lxdW90ZTogJ2h0dHBzOi8vYW5nLndpa2lxdW90ZS5vcmcnLFxuICBhbmd3aWtpc291cmNlOiAnaHR0cHM6Ly9hbmcud2lraXNvdXJjZS5vcmcnLFxuICBhcndpa2k6ICdodHRwczovL2FyLndpa2lwZWRpYS5vcmcnLFxuICBhcndpa3Rpb25hcnk6ICdodHRwczovL2FyLndpa3Rpb25hcnkub3JnJyxcbiAgYXJ3aWtpYm9va3M6ICdodHRwczovL2FyLndpa2lib29rcy5vcmcnLFxuICBhcndpa2luZXdzOiAnaHR0cHM6Ly9hci53aWtpbmV3cy5vcmcnLFxuICBhcndpa2lxdW90ZTogJ2h0dHBzOi8vYXIud2lraXF1b3RlLm9yZycsXG4gIGFyd2lraXNvdXJjZTogJ2h0dHBzOi8vYXIud2lraXNvdXJjZS5vcmcnLFxuICBhcndpa2l2ZXJzaXR5OiAnaHR0cHM6Ly9hci53aWtpdmVyc2l0eS5vcmcnLFxuICBhcmN3aWtpOiAnaHR0cHM6Ly9hcmMud2lraXBlZGlhLm9yZycsXG4gIGFyendpa2k6ICdodHRwczovL2Fyei53aWtpcGVkaWEub3JnJyxcbiAgYXN3aWtpOiAnaHR0cHM6Ly9hcy53aWtpcGVkaWEub3JnJyxcbiAgYXN3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9hcy53aWt0aW9uYXJ5Lm9yZycsXG4gIGFzd2lraWJvb2tzOiAnaHR0cHM6Ly9hcy53aWtpYm9va3Mub3JnJyxcbiAgYXN3aWtpc291cmNlOiAnaHR0cHM6Ly9hcy53aWtpc291cmNlLm9yZycsXG4gIGFzdHdpa2k6ICdodHRwczovL2FzdC53aWtpcGVkaWEub3JnJyxcbiAgYXN0d2lrdGlvbmFyeTogJ2h0dHBzOi8vYXN0Lndpa3Rpb25hcnkub3JnJyxcbiAgYXN0d2lraWJvb2tzOiAnaHR0cHM6Ly9hc3Qud2lraWJvb2tzLm9yZycsXG4gIGFzdHdpa2lxdW90ZTogJ2h0dHBzOi8vYXN0Lndpa2lxdW90ZS5vcmcnLFxuICBhdndpa2k6ICdodHRwczovL2F2Lndpa2lwZWRpYS5vcmcnLFxuICBhdndpa3Rpb25hcnk6ICdodHRwczovL2F2Lndpa3Rpb25hcnkub3JnJyxcbiAgYXl3aWtpOiAnaHR0cHM6Ly9heS53aWtpcGVkaWEub3JnJyxcbiAgYXl3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9heS53aWt0aW9uYXJ5Lm9yZycsXG4gIGF5d2lraWJvb2tzOiAnaHR0cHM6Ly9heS53aWtpYm9va3Mub3JnJyxcbiAgYXp3aWtpOiAnaHR0cHM6Ly9hei53aWtpcGVkaWEub3JnJyxcbiAgYXp3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9hei53aWt0aW9uYXJ5Lm9yZycsXG4gIGF6d2lraWJvb2tzOiAnaHR0cHM6Ly9hei53aWtpYm9va3Mub3JnJyxcbiAgYXp3aWtpcXVvdGU6ICdodHRwczovL2F6Lndpa2lxdW90ZS5vcmcnLFxuICBhendpa2lzb3VyY2U6ICdodHRwczovL2F6Lndpa2lzb3VyY2Uub3JnJyxcbiAgYmF3aWtpOiAnaHR0cHM6Ly9iYS53aWtpcGVkaWEub3JnJyxcbiAgYmF3aWtpYm9va3M6ICdodHRwczovL2JhLndpa2lib29rcy5vcmcnLFxuICBiYXJ3aWtpOiAnaHR0cHM6Ly9iYXIud2lraXBlZGlhLm9yZycsXG4gIGJhdF9zbWd3aWtpOiAnaHR0cHM6Ly9iYXQtc21nLndpa2lwZWRpYS5vcmcnLFxuICBiY2x3aWtpOiAnaHR0cHM6Ly9iY2wud2lraXBlZGlhLm9yZycsXG4gIGJld2lraTogJ2h0dHBzOi8vYmUud2lraXBlZGlhLm9yZycsXG4gIGJld2lrdGlvbmFyeTogJ2h0dHBzOi8vYmUud2lrdGlvbmFyeS5vcmcnLFxuICBiZXdpa2lib29rczogJ2h0dHBzOi8vYmUud2lraWJvb2tzLm9yZycsXG4gIGJld2lraXF1b3RlOiAnaHR0cHM6Ly9iZS53aWtpcXVvdGUub3JnJyxcbiAgYmV3aWtpc291cmNlOiAnaHR0cHM6Ly9iZS53aWtpc291cmNlLm9yZycsXG4gIGJlX3hfb2xkd2lraTogJ2h0dHBzOi8vYmUteC1vbGQud2lraXBlZGlhLm9yZycsXG4gIGJnd2lraTogJ2h0dHBzOi8vYmcud2lraXBlZGlhLm9yZycsXG4gIGJnd2lrdGlvbmFyeTogJ2h0dHBzOi8vYmcud2lrdGlvbmFyeS5vcmcnLFxuICBiZ3dpa2lib29rczogJ2h0dHBzOi8vYmcud2lraWJvb2tzLm9yZycsXG4gIGJnd2lraW5ld3M6ICdodHRwczovL2JnLndpa2luZXdzLm9yZycsXG4gIGJnd2lraXF1b3RlOiAnaHR0cHM6Ly9iZy53aWtpcXVvdGUub3JnJyxcbiAgYmd3aWtpc291cmNlOiAnaHR0cHM6Ly9iZy53aWtpc291cmNlLm9yZycsXG4gIGJod2lraTogJ2h0dHBzOi8vYmgud2lraXBlZGlhLm9yZycsXG4gIGJod2lrdGlvbmFyeTogJ2h0dHBzOi8vYmgud2lrdGlvbmFyeS5vcmcnLFxuICBiaXdpa2k6ICdodHRwczovL2JpLndpa2lwZWRpYS5vcmcnLFxuICBiaXdpa3Rpb25hcnk6ICdodHRwczovL2JpLndpa3Rpb25hcnkub3JnJyxcbiAgYml3aWtpYm9va3M6ICdodHRwczovL2JpLndpa2lib29rcy5vcmcnLFxuICBiam53aWtpOiAnaHR0cHM6Ly9iam4ud2lraXBlZGlhLm9yZycsXG4gIGJtd2lraTogJ2h0dHBzOi8vYm0ud2lraXBlZGlhLm9yZycsXG4gIGJtd2lrdGlvbmFyeTogJ2h0dHBzOi8vYm0ud2lrdGlvbmFyeS5vcmcnLFxuICBibXdpa2lib29rczogJ2h0dHBzOi8vYm0ud2lraWJvb2tzLm9yZycsXG4gIGJtd2lraXF1b3RlOiAnaHR0cHM6Ly9ibS53aWtpcXVvdGUub3JnJyxcbiAgYm53aWtpOiAnaHR0cHM6Ly9ibi53aWtpcGVkaWEub3JnJyxcbiAgYm53aWt0aW9uYXJ5OiAnaHR0cHM6Ly9ibi53aWt0aW9uYXJ5Lm9yZycsXG4gIGJud2lraWJvb2tzOiAnaHR0cHM6Ly9ibi53aWtpYm9va3Mub3JnJyxcbiAgYm53aWtpc291cmNlOiAnaHR0cHM6Ly9ibi53aWtpc291cmNlLm9yZycsXG4gIGJvd2lraTogJ2h0dHBzOi8vYm8ud2lraXBlZGlhLm9yZycsXG4gIGJvd2lrdGlvbmFyeTogJ2h0dHBzOi8vYm8ud2lrdGlvbmFyeS5vcmcnLFxuICBib3dpa2lib29rczogJ2h0dHBzOi8vYm8ud2lraWJvb2tzLm9yZycsXG4gIGJweXdpa2k6ICdodHRwczovL2JweS53aWtpcGVkaWEub3JnJyxcbiAgYnJ3aWtpOiAnaHR0cHM6Ly9ici53aWtpcGVkaWEub3JnJyxcbiAgYnJ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9ici53aWt0aW9uYXJ5Lm9yZycsXG4gIGJyd2lraXF1b3RlOiAnaHR0cHM6Ly9ici53aWtpcXVvdGUub3JnJyxcbiAgYnJ3aWtpc291cmNlOiAnaHR0cHM6Ly9ici53aWtpc291cmNlLm9yZycsXG4gIGJzd2lraTogJ2h0dHBzOi8vYnMud2lraXBlZGlhLm9yZycsXG4gIGJzd2lrdGlvbmFyeTogJ2h0dHBzOi8vYnMud2lrdGlvbmFyeS5vcmcnLFxuICBic3dpa2lib29rczogJ2h0dHBzOi8vYnMud2lraWJvb2tzLm9yZycsXG4gIGJzd2lraW5ld3M6ICdodHRwczovL2JzLndpa2luZXdzLm9yZycsXG4gIGJzd2lraXF1b3RlOiAnaHR0cHM6Ly9icy53aWtpcXVvdGUub3JnJyxcbiAgYnN3aWtpc291cmNlOiAnaHR0cHM6Ly9icy53aWtpc291cmNlLm9yZycsXG4gIGJ1Z3dpa2k6ICdodHRwczovL2J1Zy53aWtpcGVkaWEub3JnJyxcbiAgYnhyd2lraTogJ2h0dHBzOi8vYnhyLndpa2lwZWRpYS5vcmcnLFxuICBjYXdpa2k6ICdodHRwczovL2NhLndpa2lwZWRpYS5vcmcnLFxuICBjYXdpa3Rpb25hcnk6ICdodHRwczovL2NhLndpa3Rpb25hcnkub3JnJyxcbiAgY2F3aWtpYm9va3M6ICdodHRwczovL2NhLndpa2lib29rcy5vcmcnLFxuICBjYXdpa2luZXdzOiAnaHR0cHM6Ly9jYS53aWtpbmV3cy5vcmcnLFxuICBjYXdpa2lxdW90ZTogJ2h0dHBzOi8vY2Eud2lraXF1b3RlLm9yZycsXG4gIGNhd2lraXNvdXJjZTogJ2h0dHBzOi8vY2Eud2lraXNvdXJjZS5vcmcnLFxuICBjYmtfemFtd2lraTogJ2h0dHBzOi8vY2JrLXphbS53aWtpcGVkaWEub3JnJyxcbiAgY2Rvd2lraTogJ2h0dHBzOi8vY2RvLndpa2lwZWRpYS5vcmcnLFxuICBjZXdpa2k6ICdodHRwczovL2NlLndpa2lwZWRpYS5vcmcnLFxuICBjZWJ3aWtpOiAnaHR0cHM6Ly9jZWIud2lraXBlZGlhLm9yZycsXG4gIGNod2lraTogJ2h0dHBzOi8vY2gud2lraXBlZGlhLm9yZycsXG4gIGNod2lrdGlvbmFyeTogJ2h0dHBzOi8vY2gud2lrdGlvbmFyeS5vcmcnLFxuICBjaHdpa2lib29rczogJ2h0dHBzOi8vY2gud2lraWJvb2tzLm9yZycsXG4gIGNob3dpa2k6ICdodHRwczovL2Noby53aWtpcGVkaWEub3JnJyxcbiAgY2hyd2lraTogJ2h0dHBzOi8vY2hyLndpa2lwZWRpYS5vcmcnLFxuICBjaHJ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9jaHIud2lrdGlvbmFyeS5vcmcnLFxuICBjaHl3aWtpOiAnaHR0cHM6Ly9jaHkud2lraXBlZGlhLm9yZycsXG4gIGNrYndpa2k6ICdodHRwczovL2NrYi53aWtpcGVkaWEub3JnJyxcbiAgY293aWtpOiAnaHR0cHM6Ly9jby53aWtpcGVkaWEub3JnJyxcbiAgY293aWt0aW9uYXJ5OiAnaHR0cHM6Ly9jby53aWt0aW9uYXJ5Lm9yZycsXG4gIGNvd2lraWJvb2tzOiAnaHR0cHM6Ly9jby53aWtpYm9va3Mub3JnJyxcbiAgY293aWtpcXVvdGU6ICdodHRwczovL2NvLndpa2lxdW90ZS5vcmcnLFxuICBjcndpa2k6ICdodHRwczovL2NyLndpa2lwZWRpYS5vcmcnLFxuICBjcndpa3Rpb25hcnk6ICdodHRwczovL2NyLndpa3Rpb25hcnkub3JnJyxcbiAgY3J3aWtpcXVvdGU6ICdodHRwczovL2NyLndpa2lxdW90ZS5vcmcnLFxuICBjcmh3aWtpOiAnaHR0cHM6Ly9jcmgud2lraXBlZGlhLm9yZycsXG4gIGNzd2lraTogJ2h0dHBzOi8vY3Mud2lraXBlZGlhLm9yZycsXG4gIGNzd2lrdGlvbmFyeTogJ2h0dHBzOi8vY3Mud2lrdGlvbmFyeS5vcmcnLFxuICBjc3dpa2lib29rczogJ2h0dHBzOi8vY3Mud2lraWJvb2tzLm9yZycsXG4gIGNzd2lraW5ld3M6ICdodHRwczovL2NzLndpa2luZXdzLm9yZycsXG4gIGNzd2lraXF1b3RlOiAnaHR0cHM6Ly9jcy53aWtpcXVvdGUub3JnJyxcbiAgY3N3aWtpc291cmNlOiAnaHR0cHM6Ly9jcy53aWtpc291cmNlLm9yZycsXG4gIGNzd2lraXZlcnNpdHk6ICdodHRwczovL2NzLndpa2l2ZXJzaXR5Lm9yZycsXG4gIGNzYndpa2k6ICdodHRwczovL2NzYi53aWtpcGVkaWEub3JnJyxcbiAgY3Nid2lrdGlvbmFyeTogJ2h0dHBzOi8vY3NiLndpa3Rpb25hcnkub3JnJyxcbiAgY3V3aWtpOiAnaHR0cHM6Ly9jdS53aWtpcGVkaWEub3JnJyxcbiAgY3Z3aWtpOiAnaHR0cHM6Ly9jdi53aWtpcGVkaWEub3JnJyxcbiAgY3Z3aWtpYm9va3M6ICdodHRwczovL2N2Lndpa2lib29rcy5vcmcnLFxuICBjeXdpa2k6ICdodHRwczovL2N5Lndpa2lwZWRpYS5vcmcnLFxuICBjeXdpa3Rpb25hcnk6ICdodHRwczovL2N5Lndpa3Rpb25hcnkub3JnJyxcbiAgY3l3aWtpYm9va3M6ICdodHRwczovL2N5Lndpa2lib29rcy5vcmcnLFxuICBjeXdpa2lxdW90ZTogJ2h0dHBzOi8vY3kud2lraXF1b3RlLm9yZycsXG4gIGN5d2lraXNvdXJjZTogJ2h0dHBzOi8vY3kud2lraXNvdXJjZS5vcmcnLFxuICBkYXdpa2k6ICdodHRwczovL2RhLndpa2lwZWRpYS5vcmcnLFxuICBkYXdpa3Rpb25hcnk6ICdodHRwczovL2RhLndpa3Rpb25hcnkub3JnJyxcbiAgZGF3aWtpYm9va3M6ICdodHRwczovL2RhLndpa2lib29rcy5vcmcnLFxuICBkYXdpa2lxdW90ZTogJ2h0dHBzOi8vZGEud2lraXF1b3RlLm9yZycsXG4gIGRhd2lraXNvdXJjZTogJ2h0dHBzOi8vZGEud2lraXNvdXJjZS5vcmcnLFxuICBkZXdpa2k6ICdodHRwczovL2RlLndpa2lwZWRpYS5vcmcnLFxuICBkZXdpa3Rpb25hcnk6ICdodHRwczovL2RlLndpa3Rpb25hcnkub3JnJyxcbiAgZGV3aWtpYm9va3M6ICdodHRwczovL2RlLndpa2lib29rcy5vcmcnLFxuICBkZXdpa2luZXdzOiAnaHR0cHM6Ly9kZS53aWtpbmV3cy5vcmcnLFxuICBkZXdpa2lxdW90ZTogJ2h0dHBzOi8vZGUud2lraXF1b3RlLm9yZycsXG4gIGRld2lraXNvdXJjZTogJ2h0dHBzOi8vZGUud2lraXNvdXJjZS5vcmcnLFxuICBkZXdpa2l2ZXJzaXR5OiAnaHR0cHM6Ly9kZS53aWtpdmVyc2l0eS5vcmcnLFxuICBkZXdpa2l2b3lhZ2U6ICdodHRwczovL2RlLndpa2l2b3lhZ2Uub3JnJyxcbiAgZGlxd2lraTogJ2h0dHBzOi8vZGlxLndpa2lwZWRpYS5vcmcnLFxuICBkc2J3aWtpOiAnaHR0cHM6Ly9kc2Iud2lraXBlZGlhLm9yZycsXG4gIGR2d2lraTogJ2h0dHBzOi8vZHYud2lraXBlZGlhLm9yZycsXG4gIGR2d2lrdGlvbmFyeTogJ2h0dHBzOi8vZHYud2lrdGlvbmFyeS5vcmcnLFxuICBkendpa2k6ICdodHRwczovL2R6Lndpa2lwZWRpYS5vcmcnLFxuICBkendpa3Rpb25hcnk6ICdodHRwczovL2R6Lndpa3Rpb25hcnkub3JnJyxcbiAgZWV3aWtpOiAnaHR0cHM6Ly9lZS53aWtpcGVkaWEub3JnJyxcbiAgZWx3aWtpOiAnaHR0cHM6Ly9lbC53aWtpcGVkaWEub3JnJyxcbiAgZWx3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9lbC53aWt0aW9uYXJ5Lm9yZycsXG4gIGVsd2lraWJvb2tzOiAnaHR0cHM6Ly9lbC53aWtpYm9va3Mub3JnJyxcbiAgZWx3aWtpbmV3czogJ2h0dHBzOi8vZWwud2lraW5ld3Mub3JnJyxcbiAgZWx3aWtpcXVvdGU6ICdodHRwczovL2VsLndpa2lxdW90ZS5vcmcnLFxuICBlbHdpa2lzb3VyY2U6ICdodHRwczovL2VsLndpa2lzb3VyY2Uub3JnJyxcbiAgZWx3aWtpdmVyc2l0eTogJ2h0dHBzOi8vZWwud2lraXZlcnNpdHkub3JnJyxcbiAgZWx3aWtpdm95YWdlOiAnaHR0cHM6Ly9lbC53aWtpdm95YWdlLm9yZycsXG4gIGVtbHdpa2k6ICdodHRwczovL2VtbC53aWtpcGVkaWEub3JnJyxcbiAgZW53aWtpOiAnaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnJyxcbiAgZW53aWt0aW9uYXJ5OiAnaHR0cHM6Ly9lbi53aWt0aW9uYXJ5Lm9yZycsXG4gIGVud2lraWJvb2tzOiAnaHR0cHM6Ly9lbi53aWtpYm9va3Mub3JnJyxcbiAgZW53aWtpbmV3czogJ2h0dHBzOi8vZW4ud2lraW5ld3Mub3JnJyxcbiAgZW53aWtpcXVvdGU6ICdodHRwczovL2VuLndpa2lxdW90ZS5vcmcnLFxuICBlbndpa2lzb3VyY2U6ICdodHRwczovL2VuLndpa2lzb3VyY2Uub3JnJyxcbiAgZW53aWtpdmVyc2l0eTogJ2h0dHBzOi8vZW4ud2lraXZlcnNpdHkub3JnJyxcbiAgZW53aWtpdm95YWdlOiAnaHR0cHM6Ly9lbi53aWtpdm95YWdlLm9yZycsXG4gIGVvd2lraTogJ2h0dHBzOi8vZW8ud2lraXBlZGlhLm9yZycsXG4gIGVvd2lrdGlvbmFyeTogJ2h0dHBzOi8vZW8ud2lrdGlvbmFyeS5vcmcnLFxuICBlb3dpa2lib29rczogJ2h0dHBzOi8vZW8ud2lraWJvb2tzLm9yZycsXG4gIGVvd2lraW5ld3M6ICdodHRwczovL2VvLndpa2luZXdzLm9yZycsXG4gIGVvd2lraXF1b3RlOiAnaHR0cHM6Ly9lby53aWtpcXVvdGUub3JnJyxcbiAgZW93aWtpc291cmNlOiAnaHR0cHM6Ly9lby53aWtpc291cmNlLm9yZycsXG4gIGVzd2lraTogJ2h0dHBzOi8vZXMud2lraXBlZGlhLm9yZycsXG4gIGVzd2lrdGlvbmFyeTogJ2h0dHBzOi8vZXMud2lrdGlvbmFyeS5vcmcnLFxuICBlc3dpa2lib29rczogJ2h0dHBzOi8vZXMud2lraWJvb2tzLm9yZycsXG4gIGVzd2lraW5ld3M6ICdodHRwczovL2VzLndpa2luZXdzLm9yZycsXG4gIGVzd2lraXF1b3RlOiAnaHR0cHM6Ly9lcy53aWtpcXVvdGUub3JnJyxcbiAgZXN3aWtpc291cmNlOiAnaHR0cHM6Ly9lcy53aWtpc291cmNlLm9yZycsXG4gIGVzd2lraXZlcnNpdHk6ICdodHRwczovL2VzLndpa2l2ZXJzaXR5Lm9yZycsXG4gIGVzd2lraXZveWFnZTogJ2h0dHBzOi8vZXMud2lraXZveWFnZS5vcmcnLFxuICBldHdpa2k6ICdodHRwczovL2V0Lndpa2lwZWRpYS5vcmcnLFxuICBldHdpa3Rpb25hcnk6ICdodHRwczovL2V0Lndpa3Rpb25hcnkub3JnJyxcbiAgZXR3aWtpYm9va3M6ICdodHRwczovL2V0Lndpa2lib29rcy5vcmcnLFxuICBldHdpa2lxdW90ZTogJ2h0dHBzOi8vZXQud2lraXF1b3RlLm9yZycsXG4gIGV0d2lraXNvdXJjZTogJ2h0dHBzOi8vZXQud2lraXNvdXJjZS5vcmcnLFxuICBldXdpa2k6ICdodHRwczovL2V1Lndpa2lwZWRpYS5vcmcnLFxuICBldXdpa3Rpb25hcnk6ICdodHRwczovL2V1Lndpa3Rpb25hcnkub3JnJyxcbiAgZXV3aWtpYm9va3M6ICdodHRwczovL2V1Lndpa2lib29rcy5vcmcnLFxuICBldXdpa2lxdW90ZTogJ2h0dHBzOi8vZXUud2lraXF1b3RlLm9yZycsXG4gIGV4dHdpa2k6ICdodHRwczovL2V4dC53aWtpcGVkaWEub3JnJyxcbiAgZmF3aWtpOiAnaHR0cHM6Ly9mYS53aWtpcGVkaWEub3JnJyxcbiAgZmF3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9mYS53aWt0aW9uYXJ5Lm9yZycsXG4gIGZhd2lraWJvb2tzOiAnaHR0cHM6Ly9mYS53aWtpYm9va3Mub3JnJyxcbiAgZmF3aWtpbmV3czogJ2h0dHBzOi8vZmEud2lraW5ld3Mub3JnJyxcbiAgZmF3aWtpcXVvdGU6ICdodHRwczovL2ZhLndpa2lxdW90ZS5vcmcnLFxuICBmYXdpa2lzb3VyY2U6ICdodHRwczovL2ZhLndpa2lzb3VyY2Uub3JnJyxcbiAgZmF3aWtpdm95YWdlOiAnaHR0cHM6Ly9mYS53aWtpdm95YWdlLm9yZycsXG4gIGZmd2lraTogJ2h0dHBzOi8vZmYud2lraXBlZGlhLm9yZycsXG4gIGZpd2lraTogJ2h0dHBzOi8vZmkud2lraXBlZGlhLm9yZycsXG4gIGZpd2lrdGlvbmFyeTogJ2h0dHBzOi8vZmkud2lrdGlvbmFyeS5vcmcnLFxuICBmaXdpa2lib29rczogJ2h0dHBzOi8vZmkud2lraWJvb2tzLm9yZycsXG4gIGZpd2lraW5ld3M6ICdodHRwczovL2ZpLndpa2luZXdzLm9yZycsXG4gIGZpd2lraXF1b3RlOiAnaHR0cHM6Ly9maS53aWtpcXVvdGUub3JnJyxcbiAgZml3aWtpc291cmNlOiAnaHR0cHM6Ly9maS53aWtpc291cmNlLm9yZycsXG4gIGZpd2lraXZlcnNpdHk6ICdodHRwczovL2ZpLndpa2l2ZXJzaXR5Lm9yZycsXG4gIGZpdV92cm93aWtpOiAnaHR0cHM6Ly9maXUtdnJvLndpa2lwZWRpYS5vcmcnLFxuICBmandpa2k6ICdodHRwczovL2ZqLndpa2lwZWRpYS5vcmcnLFxuICBmandpa3Rpb25hcnk6ICdodHRwczovL2ZqLndpa3Rpb25hcnkub3JnJyxcbiAgZm93aWtpOiAnaHR0cHM6Ly9mby53aWtpcGVkaWEub3JnJyxcbiAgZm93aWt0aW9uYXJ5OiAnaHR0cHM6Ly9mby53aWt0aW9uYXJ5Lm9yZycsXG4gIGZvd2lraXNvdXJjZTogJ2h0dHBzOi8vZm8ud2lraXNvdXJjZS5vcmcnLFxuICBmcndpa2k6ICdodHRwczovL2ZyLndpa2lwZWRpYS5vcmcnLFxuICBmcndpa3Rpb25hcnk6ICdodHRwczovL2ZyLndpa3Rpb25hcnkub3JnJyxcbiAgZnJ3aWtpYm9va3M6ICdodHRwczovL2ZyLndpa2lib29rcy5vcmcnLFxuICBmcndpa2luZXdzOiAnaHR0cHM6Ly9mci53aWtpbmV3cy5vcmcnLFxuICBmcndpa2lxdW90ZTogJ2h0dHBzOi8vZnIud2lraXF1b3RlLm9yZycsXG4gIGZyd2lraXNvdXJjZTogJ2h0dHBzOi8vZnIud2lraXNvdXJjZS5vcmcnLFxuICBmcndpa2l2ZXJzaXR5OiAnaHR0cHM6Ly9mci53aWtpdmVyc2l0eS5vcmcnLFxuICBmcndpa2l2b3lhZ2U6ICdodHRwczovL2ZyLndpa2l2b3lhZ2Uub3JnJyxcbiAgZnJwd2lraTogJ2h0dHBzOi8vZnJwLndpa2lwZWRpYS5vcmcnLFxuICBmcnJ3aWtpOiAnaHR0cHM6Ly9mcnIud2lraXBlZGlhLm9yZycsXG4gIGZ1cndpa2k6ICdodHRwczovL2Z1ci53aWtpcGVkaWEub3JnJyxcbiAgZnl3aWtpOiAnaHR0cHM6Ly9meS53aWtpcGVkaWEub3JnJyxcbiAgZnl3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9meS53aWt0aW9uYXJ5Lm9yZycsXG4gIGZ5d2lraWJvb2tzOiAnaHR0cHM6Ly9meS53aWtpYm9va3Mub3JnJyxcbiAgZ2F3aWtpOiAnaHR0cHM6Ly9nYS53aWtpcGVkaWEub3JnJyxcbiAgZ2F3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9nYS53aWt0aW9uYXJ5Lm9yZycsXG4gIGdhd2lraWJvb2tzOiAnaHR0cHM6Ly9nYS53aWtpYm9va3Mub3JnJyxcbiAgZ2F3aWtpcXVvdGU6ICdodHRwczovL2dhLndpa2lxdW90ZS5vcmcnLFxuICBnYWd3aWtpOiAnaHR0cHM6Ly9nYWcud2lraXBlZGlhLm9yZycsXG4gIGdhbndpa2k6ICdodHRwczovL2dhbi53aWtpcGVkaWEub3JnJyxcbiAgZ2R3aWtpOiAnaHR0cHM6Ly9nZC53aWtpcGVkaWEub3JnJyxcbiAgZ2R3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9nZC53aWt0aW9uYXJ5Lm9yZycsXG4gIGdsd2lraTogJ2h0dHBzOi8vZ2wud2lraXBlZGlhLm9yZycsXG4gIGdsd2lrdGlvbmFyeTogJ2h0dHBzOi8vZ2wud2lrdGlvbmFyeS5vcmcnLFxuICBnbHdpa2lib29rczogJ2h0dHBzOi8vZ2wud2lraWJvb2tzLm9yZycsXG4gIGdsd2lraXF1b3RlOiAnaHR0cHM6Ly9nbC53aWtpcXVvdGUub3JnJyxcbiAgZ2x3aWtpc291cmNlOiAnaHR0cHM6Ly9nbC53aWtpc291cmNlLm9yZycsXG4gIGdsa3dpa2k6ICdodHRwczovL2dsay53aWtpcGVkaWEub3JnJyxcbiAgZ253aWtpOiAnaHR0cHM6Ly9nbi53aWtpcGVkaWEub3JnJyxcbiAgZ253aWt0aW9uYXJ5OiAnaHR0cHM6Ly9nbi53aWt0aW9uYXJ5Lm9yZycsXG4gIGdud2lraWJvb2tzOiAnaHR0cHM6Ly9nbi53aWtpYm9va3Mub3JnJyxcbiAgZ290d2lraTogJ2h0dHBzOi8vZ290Lndpa2lwZWRpYS5vcmcnLFxuICBnb3R3aWtpYm9va3M6ICdodHRwczovL2dvdC53aWtpYm9va3Mub3JnJyxcbiAgZ3V3aWtpOiAnaHR0cHM6Ly9ndS53aWtpcGVkaWEub3JnJyxcbiAgZ3V3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9ndS53aWt0aW9uYXJ5Lm9yZycsXG4gIGd1d2lraWJvb2tzOiAnaHR0cHM6Ly9ndS53aWtpYm9va3Mub3JnJyxcbiAgZ3V3aWtpcXVvdGU6ICdodHRwczovL2d1Lndpa2lxdW90ZS5vcmcnLFxuICBndXdpa2lzb3VyY2U6ICdodHRwczovL2d1Lndpa2lzb3VyY2Uub3JnJyxcbiAgZ3Z3aWtpOiAnaHR0cHM6Ly9ndi53aWtpcGVkaWEub3JnJyxcbiAgZ3Z3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9ndi53aWt0aW9uYXJ5Lm9yZycsXG4gIGhhd2lraTogJ2h0dHBzOi8vaGEud2lraXBlZGlhLm9yZycsXG4gIGhhd2lrdGlvbmFyeTogJ2h0dHBzOi8vaGEud2lrdGlvbmFyeS5vcmcnLFxuICBoYWt3aWtpOiAnaHR0cHM6Ly9oYWsud2lraXBlZGlhLm9yZycsXG4gIGhhd3dpa2k6ICdodHRwczovL2hhdy53aWtpcGVkaWEub3JnJyxcbiAgaGV3aWtpOiAnaHR0cHM6Ly9oZS53aWtpcGVkaWEub3JnJyxcbiAgaGV3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9oZS53aWt0aW9uYXJ5Lm9yZycsXG4gIGhld2lraWJvb2tzOiAnaHR0cHM6Ly9oZS53aWtpYm9va3Mub3JnJyxcbiAgaGV3aWtpbmV3czogJ2h0dHBzOi8vaGUud2lraW5ld3Mub3JnJyxcbiAgaGV3aWtpcXVvdGU6ICdodHRwczovL2hlLndpa2lxdW90ZS5vcmcnLFxuICBoZXdpa2lzb3VyY2U6ICdodHRwczovL2hlLndpa2lzb3VyY2Uub3JnJyxcbiAgaGV3aWtpdm95YWdlOiAnaHR0cHM6Ly9oZS53aWtpdm95YWdlLm9yZycsXG4gIGhpd2lraTogJ2h0dHBzOi8vaGkud2lraXBlZGlhLm9yZycsXG4gIGhpd2lrdGlvbmFyeTogJ2h0dHBzOi8vaGkud2lrdGlvbmFyeS5vcmcnLFxuICBoaXdpa2lib29rczogJ2h0dHBzOi8vaGkud2lraWJvb2tzLm9yZycsXG4gIGhpd2lraXF1b3RlOiAnaHR0cHM6Ly9oaS53aWtpcXVvdGUub3JnJyxcbiAgaGlmd2lraTogJ2h0dHBzOi8vaGlmLndpa2lwZWRpYS5vcmcnLFxuICBob3dpa2k6ICdodHRwczovL2hvLndpa2lwZWRpYS5vcmcnLFxuICBocndpa2k6ICdodHRwczovL2hyLndpa2lwZWRpYS5vcmcnLFxuICBocndpa3Rpb25hcnk6ICdodHRwczovL2hyLndpa3Rpb25hcnkub3JnJyxcbiAgaHJ3aWtpYm9va3M6ICdodHRwczovL2hyLndpa2lib29rcy5vcmcnLFxuICBocndpa2lxdW90ZTogJ2h0dHBzOi8vaHIud2lraXF1b3RlLm9yZycsXG4gIGhyd2lraXNvdXJjZTogJ2h0dHBzOi8vaHIud2lraXNvdXJjZS5vcmcnLFxuICBoc2J3aWtpOiAnaHR0cHM6Ly9oc2Iud2lraXBlZGlhLm9yZycsXG4gIGhzYndpa3Rpb25hcnk6ICdodHRwczovL2hzYi53aWt0aW9uYXJ5Lm9yZycsXG4gIGh0d2lraTogJ2h0dHBzOi8vaHQud2lraXBlZGlhLm9yZycsXG4gIGh0d2lraXNvdXJjZTogJ2h0dHBzOi8vaHQud2lraXNvdXJjZS5vcmcnLFxuICBodXdpa2k6ICdodHRwczovL2h1Lndpa2lwZWRpYS5vcmcnLFxuICBodXdpa3Rpb25hcnk6ICdodHRwczovL2h1Lndpa3Rpb25hcnkub3JnJyxcbiAgaHV3aWtpYm9va3M6ICdodHRwczovL2h1Lndpa2lib29rcy5vcmcnLFxuICBodXdpa2luZXdzOiAnaHR0cHM6Ly9odS53aWtpbmV3cy5vcmcnLFxuICBodXdpa2lxdW90ZTogJ2h0dHBzOi8vaHUud2lraXF1b3RlLm9yZycsXG4gIGh1d2lraXNvdXJjZTogJ2h0dHBzOi8vaHUud2lraXNvdXJjZS5vcmcnLFxuICBoeXdpa2k6ICdodHRwczovL2h5Lndpa2lwZWRpYS5vcmcnLFxuICBoeXdpa3Rpb25hcnk6ICdodHRwczovL2h5Lndpa3Rpb25hcnkub3JnJyxcbiAgaHl3aWtpYm9va3M6ICdodHRwczovL2h5Lndpa2lib29rcy5vcmcnLFxuICBoeXdpa2lxdW90ZTogJ2h0dHBzOi8vaHkud2lraXF1b3RlLm9yZycsXG4gIGh5d2lraXNvdXJjZTogJ2h0dHBzOi8vaHkud2lraXNvdXJjZS5vcmcnLFxuICBoendpa2k6ICdodHRwczovL2h6Lndpa2lwZWRpYS5vcmcnLFxuICBpYXdpa2k6ICdodHRwczovL2lhLndpa2lwZWRpYS5vcmcnLFxuICBpYXdpa3Rpb25hcnk6ICdodHRwczovL2lhLndpa3Rpb25hcnkub3JnJyxcbiAgaWF3aWtpYm9va3M6ICdodHRwczovL2lhLndpa2lib29rcy5vcmcnLFxuICBpZHdpa2k6ICdodHRwczovL2lkLndpa2lwZWRpYS5vcmcnLFxuICBpZHdpa3Rpb25hcnk6ICdodHRwczovL2lkLndpa3Rpb25hcnkub3JnJyxcbiAgaWR3aWtpYm9va3M6ICdodHRwczovL2lkLndpa2lib29rcy5vcmcnLFxuICBpZHdpa2lxdW90ZTogJ2h0dHBzOi8vaWQud2lraXF1b3RlLm9yZycsXG4gIGlkd2lraXNvdXJjZTogJ2h0dHBzOi8vaWQud2lraXNvdXJjZS5vcmcnLFxuICBpZXdpa2k6ICdodHRwczovL2llLndpa2lwZWRpYS5vcmcnLFxuICBpZXdpa3Rpb25hcnk6ICdodHRwczovL2llLndpa3Rpb25hcnkub3JnJyxcbiAgaWV3aWtpYm9va3M6ICdodHRwczovL2llLndpa2lib29rcy5vcmcnLFxuICBpZ3dpa2k6ICdodHRwczovL2lnLndpa2lwZWRpYS5vcmcnLFxuICBpaXdpa2k6ICdodHRwczovL2lpLndpa2lwZWRpYS5vcmcnLFxuICBpa3dpa2k6ICdodHRwczovL2lrLndpa2lwZWRpYS5vcmcnLFxuICBpa3dpa3Rpb25hcnk6ICdodHRwczovL2lrLndpa3Rpb25hcnkub3JnJyxcbiAgaWxvd2lraTogJ2h0dHBzOi8vaWxvLndpa2lwZWRpYS5vcmcnLFxuICBpb3dpa2k6ICdodHRwczovL2lvLndpa2lwZWRpYS5vcmcnLFxuICBpb3dpa3Rpb25hcnk6ICdodHRwczovL2lvLndpa3Rpb25hcnkub3JnJyxcbiAgaXN3aWtpOiAnaHR0cHM6Ly9pcy53aWtpcGVkaWEub3JnJyxcbiAgaXN3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9pcy53aWt0aW9uYXJ5Lm9yZycsXG4gIGlzd2lraWJvb2tzOiAnaHR0cHM6Ly9pcy53aWtpYm9va3Mub3JnJyxcbiAgaXN3aWtpcXVvdGU6ICdodHRwczovL2lzLndpa2lxdW90ZS5vcmcnLFxuICBpc3dpa2lzb3VyY2U6ICdodHRwczovL2lzLndpa2lzb3VyY2Uub3JnJyxcbiAgaXR3aWtpOiAnaHR0cHM6Ly9pdC53aWtpcGVkaWEub3JnJyxcbiAgaXR3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9pdC53aWt0aW9uYXJ5Lm9yZycsXG4gIGl0d2lraWJvb2tzOiAnaHR0cHM6Ly9pdC53aWtpYm9va3Mub3JnJyxcbiAgaXR3aWtpbmV3czogJ2h0dHBzOi8vaXQud2lraW5ld3Mub3JnJyxcbiAgaXR3aWtpcXVvdGU6ICdodHRwczovL2l0Lndpa2lxdW90ZS5vcmcnLFxuICBpdHdpa2lzb3VyY2U6ICdodHRwczovL2l0Lndpa2lzb3VyY2Uub3JnJyxcbiAgaXR3aWtpdmVyc2l0eTogJ2h0dHBzOi8vaXQud2lraXZlcnNpdHkub3JnJyxcbiAgaXR3aWtpdm95YWdlOiAnaHR0cHM6Ly9pdC53aWtpdm95YWdlLm9yZycsXG4gIGl1d2lraTogJ2h0dHBzOi8vaXUud2lraXBlZGlhLm9yZycsXG4gIGl1d2lrdGlvbmFyeTogJ2h0dHBzOi8vaXUud2lrdGlvbmFyeS5vcmcnLFxuICBqYXdpa2k6ICdodHRwczovL2phLndpa2lwZWRpYS5vcmcnLFxuICBqYXdpa3Rpb25hcnk6ICdodHRwczovL2phLndpa3Rpb25hcnkub3JnJyxcbiAgamF3aWtpYm9va3M6ICdodHRwczovL2phLndpa2lib29rcy5vcmcnLFxuICBqYXdpa2luZXdzOiAnaHR0cHM6Ly9qYS53aWtpbmV3cy5vcmcnLFxuICBqYXdpa2lxdW90ZTogJ2h0dHBzOi8vamEud2lraXF1b3RlLm9yZycsXG4gIGphd2lraXNvdXJjZTogJ2h0dHBzOi8vamEud2lraXNvdXJjZS5vcmcnLFxuICBqYXdpa2l2ZXJzaXR5OiAnaHR0cHM6Ly9qYS53aWtpdmVyc2l0eS5vcmcnLFxuICBqYm93aWtpOiAnaHR0cHM6Ly9qYm8ud2lraXBlZGlhLm9yZycsXG4gIGpib3dpa3Rpb25hcnk6ICdodHRwczovL2piby53aWt0aW9uYXJ5Lm9yZycsXG4gIGp2d2lraTogJ2h0dHBzOi8vanYud2lraXBlZGlhLm9yZycsXG4gIGp2d2lrdGlvbmFyeTogJ2h0dHBzOi8vanYud2lrdGlvbmFyeS5vcmcnLFxuICBrYXdpa2k6ICdodHRwczovL2thLndpa2lwZWRpYS5vcmcnLFxuICBrYXdpa3Rpb25hcnk6ICdodHRwczovL2thLndpa3Rpb25hcnkub3JnJyxcbiAga2F3aWtpYm9va3M6ICdodHRwczovL2thLndpa2lib29rcy5vcmcnLFxuICBrYXdpa2lxdW90ZTogJ2h0dHBzOi8va2Eud2lraXF1b3RlLm9yZycsXG4gIGthYXdpa2k6ICdodHRwczovL2thYS53aWtpcGVkaWEub3JnJyxcbiAga2Fid2lraTogJ2h0dHBzOi8va2FiLndpa2lwZWRpYS5vcmcnLFxuICBrYmR3aWtpOiAnaHR0cHM6Ly9rYmQud2lraXBlZGlhLm9yZycsXG4gIGtnd2lraTogJ2h0dHBzOi8va2cud2lraXBlZGlhLm9yZycsXG4gIGtpd2lraTogJ2h0dHBzOi8va2kud2lraXBlZGlhLm9yZycsXG4gIGtqd2lraTogJ2h0dHBzOi8va2oud2lraXBlZGlhLm9yZycsXG4gIGtrd2lraTogJ2h0dHBzOi8va2sud2lraXBlZGlhLm9yZycsXG4gIGtrd2lrdGlvbmFyeTogJ2h0dHBzOi8va2sud2lrdGlvbmFyeS5vcmcnLFxuICBra3dpa2lib29rczogJ2h0dHBzOi8va2sud2lraWJvb2tzLm9yZycsXG4gIGtrd2lraXF1b3RlOiAnaHR0cHM6Ly9ray53aWtpcXVvdGUub3JnJyxcbiAga2x3aWtpOiAnaHR0cHM6Ly9rbC53aWtpcGVkaWEub3JnJyxcbiAga2x3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9rbC53aWt0aW9uYXJ5Lm9yZycsXG4gIGttd2lraTogJ2h0dHBzOi8va20ud2lraXBlZGlhLm9yZycsXG4gIGttd2lrdGlvbmFyeTogJ2h0dHBzOi8va20ud2lrdGlvbmFyeS5vcmcnLFxuICBrbXdpa2lib29rczogJ2h0dHBzOi8va20ud2lraWJvb2tzLm9yZycsXG4gIGtud2lraTogJ2h0dHBzOi8va24ud2lraXBlZGlhLm9yZycsXG4gIGtud2lrdGlvbmFyeTogJ2h0dHBzOi8va24ud2lrdGlvbmFyeS5vcmcnLFxuICBrbndpa2lib29rczogJ2h0dHBzOi8va24ud2lraWJvb2tzLm9yZycsXG4gIGtud2lraXF1b3RlOiAnaHR0cHM6Ly9rbi53aWtpcXVvdGUub3JnJyxcbiAga253aWtpc291cmNlOiAnaHR0cHM6Ly9rbi53aWtpc291cmNlLm9yZycsXG4gIGtvd2lraTogJ2h0dHBzOi8va28ud2lraXBlZGlhLm9yZycsXG4gIGtvd2lrdGlvbmFyeTogJ2h0dHBzOi8va28ud2lrdGlvbmFyeS5vcmcnLFxuICBrb3dpa2lib29rczogJ2h0dHBzOi8va28ud2lraWJvb2tzLm9yZycsXG4gIGtvd2lraW5ld3M6ICdodHRwczovL2tvLndpa2luZXdzLm9yZycsXG4gIGtvd2lraXF1b3RlOiAnaHR0cHM6Ly9rby53aWtpcXVvdGUub3JnJyxcbiAga293aWtpc291cmNlOiAnaHR0cHM6Ly9rby53aWtpc291cmNlLm9yZycsXG4gIGtvd2lraXZlcnNpdHk6ICdodHRwczovL2tvLndpa2l2ZXJzaXR5Lm9yZycsXG4gIGtvaXdpa2k6ICdodHRwczovL2tvaS53aWtpcGVkaWEub3JnJyxcbiAga3J3aWtpOiAnaHR0cHM6Ly9rci53aWtpcGVkaWEub3JnJyxcbiAga3J3aWtpcXVvdGU6ICdodHRwczovL2tyLndpa2lxdW90ZS5vcmcnLFxuICBrcmN3aWtpOiAnaHR0cHM6Ly9rcmMud2lraXBlZGlhLm9yZycsXG4gIGtzd2lraTogJ2h0dHBzOi8va3Mud2lraXBlZGlhLm9yZycsXG4gIGtzd2lrdGlvbmFyeTogJ2h0dHBzOi8va3Mud2lrdGlvbmFyeS5vcmcnLFxuICBrc3dpa2lib29rczogJ2h0dHBzOi8va3Mud2lraWJvb2tzLm9yZycsXG4gIGtzd2lraXF1b3RlOiAnaHR0cHM6Ly9rcy53aWtpcXVvdGUub3JnJyxcbiAga3Nod2lraTogJ2h0dHBzOi8va3NoLndpa2lwZWRpYS5vcmcnLFxuICBrdXdpa2k6ICdodHRwczovL2t1Lndpa2lwZWRpYS5vcmcnLFxuICBrdXdpa3Rpb25hcnk6ICdodHRwczovL2t1Lndpa3Rpb25hcnkub3JnJyxcbiAga3V3aWtpYm9va3M6ICdodHRwczovL2t1Lndpa2lib29rcy5vcmcnLFxuICBrdXdpa2lxdW90ZTogJ2h0dHBzOi8va3Uud2lraXF1b3RlLm9yZycsXG4gIGt2d2lraTogJ2h0dHBzOi8va3Yud2lraXBlZGlhLm9yZycsXG4gIGt3d2lraTogJ2h0dHBzOi8va3cud2lraXBlZGlhLm9yZycsXG4gIGt3d2lrdGlvbmFyeTogJ2h0dHBzOi8va3cud2lrdGlvbmFyeS5vcmcnLFxuICBrd3dpa2lxdW90ZTogJ2h0dHBzOi8va3cud2lraXF1b3RlLm9yZycsXG4gIGt5d2lraTogJ2h0dHBzOi8va3kud2lraXBlZGlhLm9yZycsXG4gIGt5d2lrdGlvbmFyeTogJ2h0dHBzOi8va3kud2lrdGlvbmFyeS5vcmcnLFxuICBreXdpa2lib29rczogJ2h0dHBzOi8va3kud2lraWJvb2tzLm9yZycsXG4gIGt5d2lraXF1b3RlOiAnaHR0cHM6Ly9reS53aWtpcXVvdGUub3JnJyxcbiAgbGF3aWtpOiAnaHR0cHM6Ly9sYS53aWtpcGVkaWEub3JnJyxcbiAgbGF3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9sYS53aWt0aW9uYXJ5Lm9yZycsXG4gIGxhd2lraWJvb2tzOiAnaHR0cHM6Ly9sYS53aWtpYm9va3Mub3JnJyxcbiAgbGF3aWtpcXVvdGU6ICdodHRwczovL2xhLndpa2lxdW90ZS5vcmcnLFxuICBsYXdpa2lzb3VyY2U6ICdodHRwczovL2xhLndpa2lzb3VyY2Uub3JnJyxcbiAgbGFkd2lraTogJ2h0dHBzOi8vbGFkLndpa2lwZWRpYS5vcmcnLFxuICBsYndpa2k6ICdodHRwczovL2xiLndpa2lwZWRpYS5vcmcnLFxuICBsYndpa3Rpb25hcnk6ICdodHRwczovL2xiLndpa3Rpb25hcnkub3JnJyxcbiAgbGJ3aWtpYm9va3M6ICdodHRwczovL2xiLndpa2lib29rcy5vcmcnLFxuICBsYndpa2lxdW90ZTogJ2h0dHBzOi8vbGIud2lraXF1b3RlLm9yZycsXG4gIGxiZXdpa2k6ICdodHRwczovL2xiZS53aWtpcGVkaWEub3JnJyxcbiAgbGV6d2lraTogJ2h0dHBzOi8vbGV6Lndpa2lwZWRpYS5vcmcnLFxuICBsZ3dpa2k6ICdodHRwczovL2xnLndpa2lwZWRpYS5vcmcnLFxuICBsaXdpa2k6ICdodHRwczovL2xpLndpa2lwZWRpYS5vcmcnLFxuICBsaXdpa3Rpb25hcnk6ICdodHRwczovL2xpLndpa3Rpb25hcnkub3JnJyxcbiAgbGl3aWtpYm9va3M6ICdodHRwczovL2xpLndpa2lib29rcy5vcmcnLFxuICBsaXdpa2lxdW90ZTogJ2h0dHBzOi8vbGkud2lraXF1b3RlLm9yZycsXG4gIGxpd2lraXNvdXJjZTogJ2h0dHBzOi8vbGkud2lraXNvdXJjZS5vcmcnLFxuICBsaWp3aWtpOiAnaHR0cHM6Ly9saWoud2lraXBlZGlhLm9yZycsXG4gIGxtb3dpa2k6ICdodHRwczovL2xtby53aWtpcGVkaWEub3JnJyxcbiAgbG53aWtpOiAnaHR0cHM6Ly9sbi53aWtpcGVkaWEub3JnJyxcbiAgbG53aWt0aW9uYXJ5OiAnaHR0cHM6Ly9sbi53aWt0aW9uYXJ5Lm9yZycsXG4gIGxud2lraWJvb2tzOiAnaHR0cHM6Ly9sbi53aWtpYm9va3Mub3JnJyxcbiAgbG93aWtpOiAnaHR0cHM6Ly9sby53aWtpcGVkaWEub3JnJyxcbiAgbG93aWt0aW9uYXJ5OiAnaHR0cHM6Ly9sby53aWt0aW9uYXJ5Lm9yZycsXG4gIGx0d2lraTogJ2h0dHBzOi8vbHQud2lraXBlZGlhLm9yZycsXG4gIGx0d2lrdGlvbmFyeTogJ2h0dHBzOi8vbHQud2lrdGlvbmFyeS5vcmcnLFxuICBsdHdpa2lib29rczogJ2h0dHBzOi8vbHQud2lraWJvb2tzLm9yZycsXG4gIGx0d2lraXF1b3RlOiAnaHR0cHM6Ly9sdC53aWtpcXVvdGUub3JnJyxcbiAgbHR3aWtpc291cmNlOiAnaHR0cHM6Ly9sdC53aWtpc291cmNlLm9yZycsXG4gIGx0Z3dpa2k6ICdodHRwczovL2x0Zy53aWtpcGVkaWEub3JnJyxcbiAgbHZ3aWtpOiAnaHR0cHM6Ly9sdi53aWtpcGVkaWEub3JnJyxcbiAgbHZ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9sdi53aWt0aW9uYXJ5Lm9yZycsXG4gIGx2d2lraWJvb2tzOiAnaHR0cHM6Ly9sdi53aWtpYm9va3Mub3JnJyxcbiAgbWFpd2lraTogJ2h0dHBzOi8vbWFpLndpa2lwZWRpYS5vcmcnLFxuICBtYXBfYm1zd2lraTogJ2h0dHBzOi8vbWFwLWJtcy53aWtpcGVkaWEub3JnJyxcbiAgbWRmd2lraTogJ2h0dHBzOi8vbWRmLndpa2lwZWRpYS5vcmcnLFxuICBtZ3dpa2k6ICdodHRwczovL21nLndpa2lwZWRpYS5vcmcnLFxuICBtZ3dpa3Rpb25hcnk6ICdodHRwczovL21nLndpa3Rpb25hcnkub3JnJyxcbiAgbWd3aWtpYm9va3M6ICdodHRwczovL21nLndpa2lib29rcy5vcmcnLFxuICBtaHdpa2k6ICdodHRwczovL21oLndpa2lwZWRpYS5vcmcnLFxuICBtaHdpa3Rpb25hcnk6ICdodHRwczovL21oLndpa3Rpb25hcnkub3JnJyxcbiAgbWhyd2lraTogJ2h0dHBzOi8vbWhyLndpa2lwZWRpYS5vcmcnLFxuICBtaXdpa2k6ICdodHRwczovL21pLndpa2lwZWRpYS5vcmcnLFxuICBtaXdpa3Rpb25hcnk6ICdodHRwczovL21pLndpa3Rpb25hcnkub3JnJyxcbiAgbWl3aWtpYm9va3M6ICdodHRwczovL21pLndpa2lib29rcy5vcmcnLFxuICBtaW53aWtpOiAnaHR0cHM6Ly9taW4ud2lraXBlZGlhLm9yZycsXG4gIG1rd2lraTogJ2h0dHBzOi8vbWsud2lraXBlZGlhLm9yZycsXG4gIG1rd2lrdGlvbmFyeTogJ2h0dHBzOi8vbWsud2lrdGlvbmFyeS5vcmcnLFxuICBta3dpa2lib29rczogJ2h0dHBzOi8vbWsud2lraWJvb2tzLm9yZycsXG4gIG1rd2lraXNvdXJjZTogJ2h0dHBzOi8vbWsud2lraXNvdXJjZS5vcmcnLFxuICBtbHdpa2k6ICdodHRwczovL21sLndpa2lwZWRpYS5vcmcnLFxuICBtbHdpa3Rpb25hcnk6ICdodHRwczovL21sLndpa3Rpb25hcnkub3JnJyxcbiAgbWx3aWtpYm9va3M6ICdodHRwczovL21sLndpa2lib29rcy5vcmcnLFxuICBtbHdpa2lxdW90ZTogJ2h0dHBzOi8vbWwud2lraXF1b3RlLm9yZycsXG4gIG1sd2lraXNvdXJjZTogJ2h0dHBzOi8vbWwud2lraXNvdXJjZS5vcmcnLFxuICBtbndpa2k6ICdodHRwczovL21uLndpa2lwZWRpYS5vcmcnLFxuICBtbndpa3Rpb25hcnk6ICdodHRwczovL21uLndpa3Rpb25hcnkub3JnJyxcbiAgbW53aWtpYm9va3M6ICdodHRwczovL21uLndpa2lib29rcy5vcmcnLFxuICBtb3dpa2k6ICdodHRwczovL21vLndpa2lwZWRpYS5vcmcnLFxuICBtb3dpa3Rpb25hcnk6ICdodHRwczovL21vLndpa3Rpb25hcnkub3JnJyxcbiAgbXJ3aWtpOiAnaHR0cHM6Ly9tci53aWtpcGVkaWEub3JnJyxcbiAgbXJ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9tci53aWt0aW9uYXJ5Lm9yZycsXG4gIG1yd2lraWJvb2tzOiAnaHR0cHM6Ly9tci53aWtpYm9va3Mub3JnJyxcbiAgbXJ3aWtpcXVvdGU6ICdodHRwczovL21yLndpa2lxdW90ZS5vcmcnLFxuICBtcndpa2lzb3VyY2U6ICdodHRwczovL21yLndpa2lzb3VyY2Uub3JnJyxcbiAgbXJqd2lraTogJ2h0dHBzOi8vbXJqLndpa2lwZWRpYS5vcmcnLFxuICBtc3dpa2k6ICdodHRwczovL21zLndpa2lwZWRpYS5vcmcnLFxuICBtc3dpa3Rpb25hcnk6ICdodHRwczovL21zLndpa3Rpb25hcnkub3JnJyxcbiAgbXN3aWtpYm9va3M6ICdodHRwczovL21zLndpa2lib29rcy5vcmcnLFxuICBtdHdpa2k6ICdodHRwczovL210Lndpa2lwZWRpYS5vcmcnLFxuICBtdHdpa3Rpb25hcnk6ICdodHRwczovL210Lndpa3Rpb25hcnkub3JnJyxcbiAgbXVzd2lraTogJ2h0dHBzOi8vbXVzLndpa2lwZWRpYS5vcmcnLFxuICBtd2x3aWtpOiAnaHR0cHM6Ly9td2wud2lraXBlZGlhLm9yZycsXG4gIG15d2lraTogJ2h0dHBzOi8vbXkud2lraXBlZGlhLm9yZycsXG4gIG15d2lrdGlvbmFyeTogJ2h0dHBzOi8vbXkud2lrdGlvbmFyeS5vcmcnLFxuICBteXdpa2lib29rczogJ2h0dHBzOi8vbXkud2lraWJvb2tzLm9yZycsXG4gIG15dndpa2k6ICdodHRwczovL215di53aWtpcGVkaWEub3JnJyxcbiAgbXpud2lraTogJ2h0dHBzOi8vbXpuLndpa2lwZWRpYS5vcmcnLFxuICBuYXdpa2k6ICdodHRwczovL25hLndpa2lwZWRpYS5vcmcnLFxuICBuYXdpa3Rpb25hcnk6ICdodHRwczovL25hLndpa3Rpb25hcnkub3JnJyxcbiAgbmF3aWtpYm9va3M6ICdodHRwczovL25hLndpa2lib29rcy5vcmcnLFxuICBuYXdpa2lxdW90ZTogJ2h0dHBzOi8vbmEud2lraXF1b3RlLm9yZycsXG4gIG5haHdpa2k6ICdodHRwczovL25haC53aWtpcGVkaWEub3JnJyxcbiAgbmFod2lrdGlvbmFyeTogJ2h0dHBzOi8vbmFoLndpa3Rpb25hcnkub3JnJyxcbiAgbmFod2lraWJvb2tzOiAnaHR0cHM6Ly9uYWgud2lraWJvb2tzLm9yZycsXG4gIG5hcHdpa2k6ICdodHRwczovL25hcC53aWtpcGVkaWEub3JnJyxcbiAgbmRzd2lraTogJ2h0dHBzOi8vbmRzLndpa2lwZWRpYS5vcmcnLFxuICBuZHN3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9uZHMud2lrdGlvbmFyeS5vcmcnLFxuICBuZHN3aWtpYm9va3M6ICdodHRwczovL25kcy53aWtpYm9va3Mub3JnJyxcbiAgbmRzd2lraXF1b3RlOiAnaHR0cHM6Ly9uZHMud2lraXF1b3RlLm9yZycsXG4gIG5kc19ubHdpa2k6ICdodHRwczovL25kcy1ubC53aWtpcGVkaWEub3JnJyxcbiAgbmV3aWtpOiAnaHR0cHM6Ly9uZS53aWtpcGVkaWEub3JnJyxcbiAgbmV3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9uZS53aWt0aW9uYXJ5Lm9yZycsXG4gIG5ld2lraWJvb2tzOiAnaHR0cHM6Ly9uZS53aWtpYm9va3Mub3JnJyxcbiAgbmV3d2lraTogJ2h0dHBzOi8vbmV3Lndpa2lwZWRpYS5vcmcnLFxuICBuZ3dpa2k6ICdodHRwczovL25nLndpa2lwZWRpYS5vcmcnLFxuICBubHdpa2k6ICdodHRwczovL25sLndpa2lwZWRpYS5vcmcnLFxuICBubHdpa3Rpb25hcnk6ICdodHRwczovL25sLndpa3Rpb25hcnkub3JnJyxcbiAgbmx3aWtpYm9va3M6ICdodHRwczovL25sLndpa2lib29rcy5vcmcnLFxuICBubHdpa2luZXdzOiAnaHR0cHM6Ly9ubC53aWtpbmV3cy5vcmcnLFxuICBubHdpa2lxdW90ZTogJ2h0dHBzOi8vbmwud2lraXF1b3RlLm9yZycsXG4gIG5sd2lraXNvdXJjZTogJ2h0dHBzOi8vbmwud2lraXNvdXJjZS5vcmcnLFxuICBubHdpa2l2b3lhZ2U6ICdodHRwczovL25sLndpa2l2b3lhZ2Uub3JnJyxcbiAgbm53aWtpOiAnaHR0cHM6Ly9ubi53aWtpcGVkaWEub3JnJyxcbiAgbm53aWt0aW9uYXJ5OiAnaHR0cHM6Ly9ubi53aWt0aW9uYXJ5Lm9yZycsXG4gIG5ud2lraXF1b3RlOiAnaHR0cHM6Ly9ubi53aWtpcXVvdGUub3JnJyxcbiAgbm93aWtpOiAnaHR0cHM6Ly9uby53aWtpcGVkaWEub3JnJyxcbiAgbm93aWt0aW9uYXJ5OiAnaHR0cHM6Ly9uby53aWt0aW9uYXJ5Lm9yZycsXG4gIG5vd2lraWJvb2tzOiAnaHR0cHM6Ly9uby53aWtpYm9va3Mub3JnJyxcbiAgbm93aWtpbmV3czogJ2h0dHBzOi8vbm8ud2lraW5ld3Mub3JnJyxcbiAgbm93aWtpcXVvdGU6ICdodHRwczovL25vLndpa2lxdW90ZS5vcmcnLFxuICBub3dpa2lzb3VyY2U6ICdodHRwczovL25vLndpa2lzb3VyY2Uub3JnJyxcbiAgbm92d2lraTogJ2h0dHBzOi8vbm92Lndpa2lwZWRpYS5vcmcnLFxuICBucm13aWtpOiAnaHR0cHM6Ly9ucm0ud2lraXBlZGlhLm9yZycsXG4gIG5zb3dpa2k6ICdodHRwczovL25zby53aWtpcGVkaWEub3JnJyxcbiAgbnZ3aWtpOiAnaHR0cHM6Ly9udi53aWtpcGVkaWEub3JnJyxcbiAgbnl3aWtpOiAnaHR0cHM6Ly9ueS53aWtpcGVkaWEub3JnJyxcbiAgb2N3aWtpOiAnaHR0cHM6Ly9vYy53aWtpcGVkaWEub3JnJyxcbiAgb2N3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9vYy53aWt0aW9uYXJ5Lm9yZycsXG4gIG9jd2lraWJvb2tzOiAnaHR0cHM6Ly9vYy53aWtpYm9va3Mub3JnJyxcbiAgb213aWtpOiAnaHR0cHM6Ly9vbS53aWtpcGVkaWEub3JnJyxcbiAgb213aWt0aW9uYXJ5OiAnaHR0cHM6Ly9vbS53aWt0aW9uYXJ5Lm9yZycsXG4gIG9yd2lraTogJ2h0dHBzOi8vb3Iud2lraXBlZGlhLm9yZycsXG4gIG9yd2lrdGlvbmFyeTogJ2h0dHBzOi8vb3Iud2lrdGlvbmFyeS5vcmcnLFxuICBvcndpa2lzb3VyY2U6ICdodHRwczovL29yLndpa2lzb3VyY2Uub3JnJyxcbiAgb3N3aWtpOiAnaHR0cHM6Ly9vcy53aWtpcGVkaWEub3JnJyxcbiAgcGF3aWtpOiAnaHR0cHM6Ly9wYS53aWtpcGVkaWEub3JnJyxcbiAgcGF3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9wYS53aWt0aW9uYXJ5Lm9yZycsXG4gIHBhd2lraWJvb2tzOiAnaHR0cHM6Ly9wYS53aWtpYm9va3Mub3JnJyxcbiAgcGFnd2lraTogJ2h0dHBzOi8vcGFnLndpa2lwZWRpYS5vcmcnLFxuICBwYW13aWtpOiAnaHR0cHM6Ly9wYW0ud2lraXBlZGlhLm9yZycsXG4gIHBhcHdpa2k6ICdodHRwczovL3BhcC53aWtpcGVkaWEub3JnJyxcbiAgcGNkd2lraTogJ2h0dHBzOi8vcGNkLndpa2lwZWRpYS5vcmcnLFxuICBwZGN3aWtpOiAnaHR0cHM6Ly9wZGMud2lraXBlZGlhLm9yZycsXG4gIHBmbHdpa2k6ICdodHRwczovL3BmbC53aWtpcGVkaWEub3JnJyxcbiAgcGl3aWtpOiAnaHR0cHM6Ly9waS53aWtpcGVkaWEub3JnJyxcbiAgcGl3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9waS53aWt0aW9uYXJ5Lm9yZycsXG4gIHBpaHdpa2k6ICdodHRwczovL3BpaC53aWtpcGVkaWEub3JnJyxcbiAgcGx3aWtpOiAnaHR0cHM6Ly9wbC53aWtpcGVkaWEub3JnJyxcbiAgcGx3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9wbC53aWt0aW9uYXJ5Lm9yZycsXG4gIHBsd2lraWJvb2tzOiAnaHR0cHM6Ly9wbC53aWtpYm9va3Mub3JnJyxcbiAgcGx3aWtpbmV3czogJ2h0dHBzOi8vcGwud2lraW5ld3Mub3JnJyxcbiAgcGx3aWtpcXVvdGU6ICdodHRwczovL3BsLndpa2lxdW90ZS5vcmcnLFxuICBwbHdpa2lzb3VyY2U6ICdodHRwczovL3BsLndpa2lzb3VyY2Uub3JnJyxcbiAgcGx3aWtpdm95YWdlOiAnaHR0cHM6Ly9wbC53aWtpdm95YWdlLm9yZycsXG4gIHBtc3dpa2k6ICdodHRwczovL3Btcy53aWtpcGVkaWEub3JnJyxcbiAgcG5id2lraTogJ2h0dHBzOi8vcG5iLndpa2lwZWRpYS5vcmcnLFxuICBwbmJ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9wbmIud2lrdGlvbmFyeS5vcmcnLFxuICBwbnR3aWtpOiAnaHR0cHM6Ly9wbnQud2lraXBlZGlhLm9yZycsXG4gIHBzd2lraTogJ2h0dHBzOi8vcHMud2lraXBlZGlhLm9yZycsXG4gIHBzd2lrdGlvbmFyeTogJ2h0dHBzOi8vcHMud2lrdGlvbmFyeS5vcmcnLFxuICBwc3dpa2lib29rczogJ2h0dHBzOi8vcHMud2lraWJvb2tzLm9yZycsXG4gIHB0d2lraTogJ2h0dHBzOi8vcHQud2lraXBlZGlhLm9yZycsXG4gIHB0d2lrdGlvbmFyeTogJ2h0dHBzOi8vcHQud2lrdGlvbmFyeS5vcmcnLFxuICBwdHdpa2lib29rczogJ2h0dHBzOi8vcHQud2lraWJvb2tzLm9yZycsXG4gIHB0d2lraW5ld3M6ICdodHRwczovL3B0Lndpa2luZXdzLm9yZycsXG4gIHB0d2lraXF1b3RlOiAnaHR0cHM6Ly9wdC53aWtpcXVvdGUub3JnJyxcbiAgcHR3aWtpc291cmNlOiAnaHR0cHM6Ly9wdC53aWtpc291cmNlLm9yZycsXG4gIHB0d2lraXZlcnNpdHk6ICdodHRwczovL3B0Lndpa2l2ZXJzaXR5Lm9yZycsXG4gIHB0d2lraXZveWFnZTogJ2h0dHBzOi8vcHQud2lraXZveWFnZS5vcmcnLFxuICBxdXdpa2k6ICdodHRwczovL3F1Lndpa2lwZWRpYS5vcmcnLFxuICBxdXdpa3Rpb25hcnk6ICdodHRwczovL3F1Lndpa3Rpb25hcnkub3JnJyxcbiAgcXV3aWtpYm9va3M6ICdodHRwczovL3F1Lndpa2lib29rcy5vcmcnLFxuICBxdXdpa2lxdW90ZTogJ2h0dHBzOi8vcXUud2lraXF1b3RlLm9yZycsXG4gIHJtd2lraTogJ2h0dHBzOi8vcm0ud2lraXBlZGlhLm9yZycsXG4gIHJtd2lrdGlvbmFyeTogJ2h0dHBzOi8vcm0ud2lrdGlvbmFyeS5vcmcnLFxuICBybXdpa2lib29rczogJ2h0dHBzOi8vcm0ud2lraWJvb2tzLm9yZycsXG4gIHJteXdpa2k6ICdodHRwczovL3JteS53aWtpcGVkaWEub3JnJyxcbiAgcm53aWtpOiAnaHR0cHM6Ly9ybi53aWtpcGVkaWEub3JnJyxcbiAgcm53aWt0aW9uYXJ5OiAnaHR0cHM6Ly9ybi53aWt0aW9uYXJ5Lm9yZycsXG4gIHJvd2lraTogJ2h0dHBzOi8vcm8ud2lraXBlZGlhLm9yZycsXG4gIHJvd2lrdGlvbmFyeTogJ2h0dHBzOi8vcm8ud2lrdGlvbmFyeS5vcmcnLFxuICByb3dpa2lib29rczogJ2h0dHBzOi8vcm8ud2lraWJvb2tzLm9yZycsXG4gIHJvd2lraW5ld3M6ICdodHRwczovL3JvLndpa2luZXdzLm9yZycsXG4gIHJvd2lraXF1b3RlOiAnaHR0cHM6Ly9yby53aWtpcXVvdGUub3JnJyxcbiAgcm93aWtpc291cmNlOiAnaHR0cHM6Ly9yby53aWtpc291cmNlLm9yZycsXG4gIHJvd2lraXZveWFnZTogJ2h0dHBzOi8vcm8ud2lraXZveWFnZS5vcmcnLFxuICByb2FfcnVwd2lraTogJ2h0dHBzOi8vcm9hLXJ1cC53aWtpcGVkaWEub3JnJyxcbiAgcm9hX3J1cHdpa3Rpb25hcnk6ICdodHRwczovL3JvYS1ydXAud2lrdGlvbmFyeS5vcmcnLFxuICByb2FfdGFyYXdpa2k6ICdodHRwczovL3JvYS10YXJhLndpa2lwZWRpYS5vcmcnLFxuICBydXdpa2k6ICdodHRwczovL3J1Lndpa2lwZWRpYS5vcmcnLFxuICBydXdpa3Rpb25hcnk6ICdodHRwczovL3J1Lndpa3Rpb25hcnkub3JnJyxcbiAgcnV3aWtpYm9va3M6ICdodHRwczovL3J1Lndpa2lib29rcy5vcmcnLFxuICBydXdpa2luZXdzOiAnaHR0cHM6Ly9ydS53aWtpbmV3cy5vcmcnLFxuICBydXdpa2lxdW90ZTogJ2h0dHBzOi8vcnUud2lraXF1b3RlLm9yZycsXG4gIHJ1d2lraXNvdXJjZTogJ2h0dHBzOi8vcnUud2lraXNvdXJjZS5vcmcnLFxuICBydXdpa2l2ZXJzaXR5OiAnaHR0cHM6Ly9ydS53aWtpdmVyc2l0eS5vcmcnLFxuICBydXdpa2l2b3lhZ2U6ICdodHRwczovL3J1Lndpa2l2b3lhZ2Uub3JnJyxcbiAgcnVld2lraTogJ2h0dHBzOi8vcnVlLndpa2lwZWRpYS5vcmcnLFxuICByd3dpa2k6ICdodHRwczovL3J3Lndpa2lwZWRpYS5vcmcnLFxuICByd3dpa3Rpb25hcnk6ICdodHRwczovL3J3Lndpa3Rpb25hcnkub3JnJyxcbiAgc2F3aWtpOiAnaHR0cHM6Ly9zYS53aWtpcGVkaWEub3JnJyxcbiAgc2F3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zYS53aWt0aW9uYXJ5Lm9yZycsXG4gIHNhd2lraWJvb2tzOiAnaHR0cHM6Ly9zYS53aWtpYm9va3Mub3JnJyxcbiAgc2F3aWtpcXVvdGU6ICdodHRwczovL3NhLndpa2lxdW90ZS5vcmcnLFxuICBzYXdpa2lzb3VyY2U6ICdodHRwczovL3NhLndpa2lzb3VyY2Uub3JnJyxcbiAgc2Fod2lraTogJ2h0dHBzOi8vc2FoLndpa2lwZWRpYS5vcmcnLFxuICBzYWh3aWtpc291cmNlOiAnaHR0cHM6Ly9zYWgud2lraXNvdXJjZS5vcmcnLFxuICBzY3dpa2k6ICdodHRwczovL3NjLndpa2lwZWRpYS5vcmcnLFxuICBzY3dpa3Rpb25hcnk6ICdodHRwczovL3NjLndpa3Rpb25hcnkub3JnJyxcbiAgc2Nud2lraTogJ2h0dHBzOi8vc2NuLndpa2lwZWRpYS5vcmcnLFxuICBzY253aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zY24ud2lrdGlvbmFyeS5vcmcnLFxuICBzY293aWtpOiAnaHR0cHM6Ly9zY28ud2lraXBlZGlhLm9yZycsXG4gIHNkd2lraTogJ2h0dHBzOi8vc2Qud2lraXBlZGlhLm9yZycsXG4gIHNkd2lrdGlvbmFyeTogJ2h0dHBzOi8vc2Qud2lrdGlvbmFyeS5vcmcnLFxuICBzZHdpa2luZXdzOiAnaHR0cHM6Ly9zZC53aWtpbmV3cy5vcmcnLFxuICBzZXdpa2k6ICdodHRwczovL3NlLndpa2lwZWRpYS5vcmcnLFxuICBzZXdpa2lib29rczogJ2h0dHBzOi8vc2Uud2lraWJvb2tzLm9yZycsXG4gIHNnd2lraTogJ2h0dHBzOi8vc2cud2lraXBlZGlhLm9yZycsXG4gIHNnd2lrdGlvbmFyeTogJ2h0dHBzOi8vc2cud2lrdGlvbmFyeS5vcmcnLFxuICBzaHdpa2k6ICdodHRwczovL3NoLndpa2lwZWRpYS5vcmcnLFxuICBzaHdpa3Rpb25hcnk6ICdodHRwczovL3NoLndpa3Rpb25hcnkub3JnJyxcbiAgc2l3aWtpOiAnaHR0cHM6Ly9zaS53aWtpcGVkaWEub3JnJyxcbiAgc2l3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zaS53aWt0aW9uYXJ5Lm9yZycsXG4gIHNpd2lraWJvb2tzOiAnaHR0cHM6Ly9zaS53aWtpYm9va3Mub3JnJyxcbiAgc2ltcGxld2lraTogJ2h0dHBzOi8vc2ltcGxlLndpa2lwZWRpYS5vcmcnLFxuICBzaW1wbGV3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zaW1wbGUud2lrdGlvbmFyeS5vcmcnLFxuICBzaW1wbGV3aWtpYm9va3M6ICdodHRwczovL3NpbXBsZS53aWtpYm9va3Mub3JnJyxcbiAgc2ltcGxld2lraXF1b3RlOiAnaHR0cHM6Ly9zaW1wbGUud2lraXF1b3RlLm9yZycsXG4gIHNrd2lraTogJ2h0dHBzOi8vc2sud2lraXBlZGlhLm9yZycsXG4gIHNrd2lrdGlvbmFyeTogJ2h0dHBzOi8vc2sud2lrdGlvbmFyeS5vcmcnLFxuICBza3dpa2lib29rczogJ2h0dHBzOi8vc2sud2lraWJvb2tzLm9yZycsXG4gIHNrd2lraXF1b3RlOiAnaHR0cHM6Ly9zay53aWtpcXVvdGUub3JnJyxcbiAgc2t3aWtpc291cmNlOiAnaHR0cHM6Ly9zay53aWtpc291cmNlLm9yZycsXG4gIHNsd2lraTogJ2h0dHBzOi8vc2wud2lraXBlZGlhLm9yZycsXG4gIHNsd2lrdGlvbmFyeTogJ2h0dHBzOi8vc2wud2lrdGlvbmFyeS5vcmcnLFxuICBzbHdpa2lib29rczogJ2h0dHBzOi8vc2wud2lraWJvb2tzLm9yZycsXG4gIHNsd2lraXF1b3RlOiAnaHR0cHM6Ly9zbC53aWtpcXVvdGUub3JnJyxcbiAgc2x3aWtpc291cmNlOiAnaHR0cHM6Ly9zbC53aWtpc291cmNlLm9yZycsXG4gIHNsd2lraXZlcnNpdHk6ICdodHRwczovL3NsLndpa2l2ZXJzaXR5Lm9yZycsXG4gIHNtd2lraTogJ2h0dHBzOi8vc20ud2lraXBlZGlhLm9yZycsXG4gIHNtd2lrdGlvbmFyeTogJ2h0dHBzOi8vc20ud2lrdGlvbmFyeS5vcmcnLFxuICBzbndpa2k6ICdodHRwczovL3NuLndpa2lwZWRpYS5vcmcnLFxuICBzbndpa3Rpb25hcnk6ICdodHRwczovL3NuLndpa3Rpb25hcnkub3JnJyxcbiAgc293aWtpOiAnaHR0cHM6Ly9zby53aWtpcGVkaWEub3JnJyxcbiAgc293aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zby53aWt0aW9uYXJ5Lm9yZycsXG4gIHNxd2lraTogJ2h0dHBzOi8vc3Eud2lraXBlZGlhLm9yZycsXG4gIHNxd2lrdGlvbmFyeTogJ2h0dHBzOi8vc3Eud2lrdGlvbmFyeS5vcmcnLFxuICBzcXdpa2lib29rczogJ2h0dHBzOi8vc3Eud2lraWJvb2tzLm9yZycsXG4gIHNxd2lraW5ld3M6ICdodHRwczovL3NxLndpa2luZXdzLm9yZycsXG4gIHNxd2lraXF1b3RlOiAnaHR0cHM6Ly9zcS53aWtpcXVvdGUub3JnJyxcbiAgc3J3aWtpOiAnaHR0cHM6Ly9zci53aWtpcGVkaWEub3JnJyxcbiAgc3J3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zci53aWt0aW9uYXJ5Lm9yZycsXG4gIHNyd2lraWJvb2tzOiAnaHR0cHM6Ly9zci53aWtpYm9va3Mub3JnJyxcbiAgc3J3aWtpbmV3czogJ2h0dHBzOi8vc3Iud2lraW5ld3Mub3JnJyxcbiAgc3J3aWtpcXVvdGU6ICdodHRwczovL3NyLndpa2lxdW90ZS5vcmcnLFxuICBzcndpa2lzb3VyY2U6ICdodHRwczovL3NyLndpa2lzb3VyY2Uub3JnJyxcbiAgc3Jud2lraTogJ2h0dHBzOi8vc3JuLndpa2lwZWRpYS5vcmcnLFxuICBzc3dpa2k6ICdodHRwczovL3NzLndpa2lwZWRpYS5vcmcnLFxuICBzc3dpa3Rpb25hcnk6ICdodHRwczovL3NzLndpa3Rpb25hcnkub3JnJyxcbiAgc3R3aWtpOiAnaHR0cHM6Ly9zdC53aWtpcGVkaWEub3JnJyxcbiAgc3R3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zdC53aWt0aW9uYXJ5Lm9yZycsXG4gIHN0cXdpa2k6ICdodHRwczovL3N0cS53aWtpcGVkaWEub3JnJyxcbiAgc3V3aWtpOiAnaHR0cHM6Ly9zdS53aWtpcGVkaWEub3JnJyxcbiAgc3V3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zdS53aWt0aW9uYXJ5Lm9yZycsXG4gIHN1d2lraWJvb2tzOiAnaHR0cHM6Ly9zdS53aWtpYm9va3Mub3JnJyxcbiAgc3V3aWtpcXVvdGU6ICdodHRwczovL3N1Lndpa2lxdW90ZS5vcmcnLFxuICBzdndpa2k6ICdodHRwczovL3N2Lndpa2lwZWRpYS5vcmcnLFxuICBzdndpa3Rpb25hcnk6ICdodHRwczovL3N2Lndpa3Rpb25hcnkub3JnJyxcbiAgc3Z3aWtpYm9va3M6ICdodHRwczovL3N2Lndpa2lib29rcy5vcmcnLFxuICBzdndpa2luZXdzOiAnaHR0cHM6Ly9zdi53aWtpbmV3cy5vcmcnLFxuICBzdndpa2lxdW90ZTogJ2h0dHBzOi8vc3Yud2lraXF1b3RlLm9yZycsXG4gIHN2d2lraXNvdXJjZTogJ2h0dHBzOi8vc3Yud2lraXNvdXJjZS5vcmcnLFxuICBzdndpa2l2ZXJzaXR5OiAnaHR0cHM6Ly9zdi53aWtpdmVyc2l0eS5vcmcnLFxuICBzdndpa2l2b3lhZ2U6ICdodHRwczovL3N2Lndpa2l2b3lhZ2Uub3JnJyxcbiAgc3d3aWtpOiAnaHR0cHM6Ly9zdy53aWtpcGVkaWEub3JnJyxcbiAgc3d3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zdy53aWt0aW9uYXJ5Lm9yZycsXG4gIHN3d2lraWJvb2tzOiAnaHR0cHM6Ly9zdy53aWtpYm9va3Mub3JnJyxcbiAgc3psd2lraTogJ2h0dHBzOi8vc3psLndpa2lwZWRpYS5vcmcnLFxuICB0YXdpa2k6ICdodHRwczovL3RhLndpa2lwZWRpYS5vcmcnLFxuICB0YXdpa3Rpb25hcnk6ICdodHRwczovL3RhLndpa3Rpb25hcnkub3JnJyxcbiAgdGF3aWtpYm9va3M6ICdodHRwczovL3RhLndpa2lib29rcy5vcmcnLFxuICB0YXdpa2luZXdzOiAnaHR0cHM6Ly90YS53aWtpbmV3cy5vcmcnLFxuICB0YXdpa2lxdW90ZTogJ2h0dHBzOi8vdGEud2lraXF1b3RlLm9yZycsXG4gIHRhd2lraXNvdXJjZTogJ2h0dHBzOi8vdGEud2lraXNvdXJjZS5vcmcnLFxuICB0ZXdpa2k6ICdodHRwczovL3RlLndpa2lwZWRpYS5vcmcnLFxuICB0ZXdpa3Rpb25hcnk6ICdodHRwczovL3RlLndpa3Rpb25hcnkub3JnJyxcbiAgdGV3aWtpYm9va3M6ICdodHRwczovL3RlLndpa2lib29rcy5vcmcnLFxuICB0ZXdpa2lxdW90ZTogJ2h0dHBzOi8vdGUud2lraXF1b3RlLm9yZycsXG4gIHRld2lraXNvdXJjZTogJ2h0dHBzOi8vdGUud2lraXNvdXJjZS5vcmcnLFxuICB0ZXR3aWtpOiAnaHR0cHM6Ly90ZXQud2lraXBlZGlhLm9yZycsXG4gIHRnd2lraTogJ2h0dHBzOi8vdGcud2lraXBlZGlhLm9yZycsXG4gIHRnd2lrdGlvbmFyeTogJ2h0dHBzOi8vdGcud2lrdGlvbmFyeS5vcmcnLFxuICB0Z3dpa2lib29rczogJ2h0dHBzOi8vdGcud2lraWJvb2tzLm9yZycsXG4gIHRod2lraTogJ2h0dHBzOi8vdGgud2lraXBlZGlhLm9yZycsXG4gIHRod2lrdGlvbmFyeTogJ2h0dHBzOi8vdGgud2lrdGlvbmFyeS5vcmcnLFxuICB0aHdpa2lib29rczogJ2h0dHBzOi8vdGgud2lraWJvb2tzLm9yZycsXG4gIHRod2lraW5ld3M6ICdodHRwczovL3RoLndpa2luZXdzLm9yZycsXG4gIHRod2lraXF1b3RlOiAnaHR0cHM6Ly90aC53aWtpcXVvdGUub3JnJyxcbiAgdGh3aWtpc291cmNlOiAnaHR0cHM6Ly90aC53aWtpc291cmNlLm9yZycsXG4gIHRpd2lraTogJ2h0dHBzOi8vdGkud2lraXBlZGlhLm9yZycsXG4gIHRpd2lrdGlvbmFyeTogJ2h0dHBzOi8vdGkud2lrdGlvbmFyeS5vcmcnLFxuICB0a3dpa2k6ICdodHRwczovL3RrLndpa2lwZWRpYS5vcmcnLFxuICB0a3dpa3Rpb25hcnk6ICdodHRwczovL3RrLndpa3Rpb25hcnkub3JnJyxcbiAgdGt3aWtpYm9va3M6ICdodHRwczovL3RrLndpa2lib29rcy5vcmcnLFxuICB0a3dpa2lxdW90ZTogJ2h0dHBzOi8vdGsud2lraXF1b3RlLm9yZycsXG4gIHRsd2lraTogJ2h0dHBzOi8vdGwud2lraXBlZGlhLm9yZycsXG4gIHRsd2lrdGlvbmFyeTogJ2h0dHBzOi8vdGwud2lrdGlvbmFyeS5vcmcnLFxuICB0bHdpa2lib29rczogJ2h0dHBzOi8vdGwud2lraWJvb2tzLm9yZycsXG4gIHRud2lraTogJ2h0dHBzOi8vdG4ud2lraXBlZGlhLm9yZycsXG4gIHRud2lrdGlvbmFyeTogJ2h0dHBzOi8vdG4ud2lrdGlvbmFyeS5vcmcnLFxuICB0b3dpa2k6ICdodHRwczovL3RvLndpa2lwZWRpYS5vcmcnLFxuICB0b3dpa3Rpb25hcnk6ICdodHRwczovL3RvLndpa3Rpb25hcnkub3JnJyxcbiAgdHBpd2lraTogJ2h0dHBzOi8vdHBpLndpa2lwZWRpYS5vcmcnLFxuICB0cGl3aWt0aW9uYXJ5OiAnaHR0cHM6Ly90cGkud2lrdGlvbmFyeS5vcmcnLFxuICB0cndpa2k6ICdodHRwczovL3RyLndpa2lwZWRpYS5vcmcnLFxuICB0cndpa3Rpb25hcnk6ICdodHRwczovL3RyLndpa3Rpb25hcnkub3JnJyxcbiAgdHJ3aWtpYm9va3M6ICdodHRwczovL3RyLndpa2lib29rcy5vcmcnLFxuICB0cndpa2luZXdzOiAnaHR0cHM6Ly90ci53aWtpbmV3cy5vcmcnLFxuICB0cndpa2lxdW90ZTogJ2h0dHBzOi8vdHIud2lraXF1b3RlLm9yZycsXG4gIHRyd2lraXNvdXJjZTogJ2h0dHBzOi8vdHIud2lraXNvdXJjZS5vcmcnLFxuICB0c3dpa2k6ICdodHRwczovL3RzLndpa2lwZWRpYS5vcmcnLFxuICB0c3dpa3Rpb25hcnk6ICdodHRwczovL3RzLndpa3Rpb25hcnkub3JnJyxcbiAgdHR3aWtpOiAnaHR0cHM6Ly90dC53aWtpcGVkaWEub3JnJyxcbiAgdHR3aWt0aW9uYXJ5OiAnaHR0cHM6Ly90dC53aWt0aW9uYXJ5Lm9yZycsXG4gIHR0d2lraWJvb2tzOiAnaHR0cHM6Ly90dC53aWtpYm9va3Mub3JnJyxcbiAgdHR3aWtpcXVvdGU6ICdodHRwczovL3R0Lndpa2lxdW90ZS5vcmcnLFxuICB0dW13aWtpOiAnaHR0cHM6Ly90dW0ud2lraXBlZGlhLm9yZycsXG4gIHR3d2lraTogJ2h0dHBzOi8vdHcud2lraXBlZGlhLm9yZycsXG4gIHR3d2lrdGlvbmFyeTogJ2h0dHBzOi8vdHcud2lrdGlvbmFyeS5vcmcnLFxuICB0eXdpa2k6ICdodHRwczovL3R5Lndpa2lwZWRpYS5vcmcnLFxuICB0eXZ3aWtpOiAnaHR0cHM6Ly90eXYud2lraXBlZGlhLm9yZycsXG4gIHVkbXdpa2k6ICdodHRwczovL3VkbS53aWtpcGVkaWEub3JnJyxcbiAgdWd3aWtpOiAnaHR0cHM6Ly91Zy53aWtpcGVkaWEub3JnJyxcbiAgdWd3aWt0aW9uYXJ5OiAnaHR0cHM6Ly91Zy53aWt0aW9uYXJ5Lm9yZycsXG4gIHVnd2lraWJvb2tzOiAnaHR0cHM6Ly91Zy53aWtpYm9va3Mub3JnJyxcbiAgdWd3aWtpcXVvdGU6ICdodHRwczovL3VnLndpa2lxdW90ZS5vcmcnLFxuICB1a3dpa2k6ICdodHRwczovL3VrLndpa2lwZWRpYS5vcmcnLFxuICB1a3dpa3Rpb25hcnk6ICdodHRwczovL3VrLndpa3Rpb25hcnkub3JnJyxcbiAgdWt3aWtpYm9va3M6ICdodHRwczovL3VrLndpa2lib29rcy5vcmcnLFxuICB1a3dpa2luZXdzOiAnaHR0cHM6Ly91ay53aWtpbmV3cy5vcmcnLFxuICB1a3dpa2lxdW90ZTogJ2h0dHBzOi8vdWsud2lraXF1b3RlLm9yZycsXG4gIHVrd2lraXNvdXJjZTogJ2h0dHBzOi8vdWsud2lraXNvdXJjZS5vcmcnLFxuICB1a3dpa2l2b3lhZ2U6ICdodHRwczovL3VrLndpa2l2b3lhZ2Uub3JnJyxcbiAgdXJ3aWtpOiAnaHR0cHM6Ly91ci53aWtpcGVkaWEub3JnJyxcbiAgdXJ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly91ci53aWt0aW9uYXJ5Lm9yZycsXG4gIHVyd2lraWJvb2tzOiAnaHR0cHM6Ly91ci53aWtpYm9va3Mub3JnJyxcbiAgdXJ3aWtpcXVvdGU6ICdodHRwczovL3VyLndpa2lxdW90ZS5vcmcnLFxuICB1endpa2k6ICdodHRwczovL3V6Lndpa2lwZWRpYS5vcmcnLFxuICB1endpa3Rpb25hcnk6ICdodHRwczovL3V6Lndpa3Rpb25hcnkub3JnJyxcbiAgdXp3aWtpYm9va3M6ICdodHRwczovL3V6Lndpa2lib29rcy5vcmcnLFxuICB1endpa2lxdW90ZTogJ2h0dHBzOi8vdXoud2lraXF1b3RlLm9yZycsXG4gIHZld2lraTogJ2h0dHBzOi8vdmUud2lraXBlZGlhLm9yZycsXG4gIHZlY3dpa2k6ICdodHRwczovL3ZlYy53aWtpcGVkaWEub3JnJyxcbiAgdmVjd2lrdGlvbmFyeTogJ2h0dHBzOi8vdmVjLndpa3Rpb25hcnkub3JnJyxcbiAgdmVjd2lraXNvdXJjZTogJ2h0dHBzOi8vdmVjLndpa2lzb3VyY2Uub3JnJyxcbiAgdmVwd2lraTogJ2h0dHBzOi8vdmVwLndpa2lwZWRpYS5vcmcnLFxuICB2aXdpa2k6ICdodHRwczovL3ZpLndpa2lwZWRpYS5vcmcnLFxuICB2aXdpa3Rpb25hcnk6ICdodHRwczovL3ZpLndpa3Rpb25hcnkub3JnJyxcbiAgdml3aWtpYm9va3M6ICdodHRwczovL3ZpLndpa2lib29rcy5vcmcnLFxuICB2aXdpa2lxdW90ZTogJ2h0dHBzOi8vdmkud2lraXF1b3RlLm9yZycsXG4gIHZpd2lraXNvdXJjZTogJ2h0dHBzOi8vdmkud2lraXNvdXJjZS5vcmcnLFxuICB2aXdpa2l2b3lhZ2U6ICdodHRwczovL3ZpLndpa2l2b3lhZ2Uub3JnJyxcbiAgdmxzd2lraTogJ2h0dHBzOi8vdmxzLndpa2lwZWRpYS5vcmcnLFxuICB2b3dpa2k6ICdodHRwczovL3ZvLndpa2lwZWRpYS5vcmcnLFxuICB2b3dpa3Rpb25hcnk6ICdodHRwczovL3ZvLndpa3Rpb25hcnkub3JnJyxcbiAgdm93aWtpYm9va3M6ICdodHRwczovL3ZvLndpa2lib29rcy5vcmcnLFxuICB2b3dpa2lxdW90ZTogJ2h0dHBzOi8vdm8ud2lraXF1b3RlLm9yZycsXG4gIHdhd2lraTogJ2h0dHBzOi8vd2Eud2lraXBlZGlhLm9yZycsXG4gIHdhd2lrdGlvbmFyeTogJ2h0dHBzOi8vd2Eud2lrdGlvbmFyeS5vcmcnLFxuICB3YXdpa2lib29rczogJ2h0dHBzOi8vd2Eud2lraWJvb2tzLm9yZycsXG4gIHdhcndpa2k6ICdodHRwczovL3dhci53aWtpcGVkaWEub3JnJyxcbiAgd293aWtpOiAnaHR0cHM6Ly93by53aWtpcGVkaWEub3JnJyxcbiAgd293aWt0aW9uYXJ5OiAnaHR0cHM6Ly93by53aWt0aW9uYXJ5Lm9yZycsXG4gIHdvd2lraXF1b3RlOiAnaHR0cHM6Ly93by53aWtpcXVvdGUub3JnJyxcbiAgd3V1d2lraTogJ2h0dHBzOi8vd3V1Lndpa2lwZWRpYS5vcmcnLFxuICB4YWx3aWtpOiAnaHR0cHM6Ly94YWwud2lraXBlZGlhLm9yZycsXG4gIHhod2lraTogJ2h0dHBzOi8veGgud2lraXBlZGlhLm9yZycsXG4gIHhod2lrdGlvbmFyeTogJ2h0dHBzOi8veGgud2lrdGlvbmFyeS5vcmcnLFxuICB4aHdpa2lib29rczogJ2h0dHBzOi8veGgud2lraWJvb2tzLm9yZycsXG4gIHhtZndpa2k6ICdodHRwczovL3htZi53aWtpcGVkaWEub3JnJyxcbiAgeWl3aWtpOiAnaHR0cHM6Ly95aS53aWtpcGVkaWEub3JnJyxcbiAgeWl3aWt0aW9uYXJ5OiAnaHR0cHM6Ly95aS53aWt0aW9uYXJ5Lm9yZycsXG4gIHlpd2lraXNvdXJjZTogJ2h0dHBzOi8veWkud2lraXNvdXJjZS5vcmcnLFxuICB5b3dpa2k6ICdodHRwczovL3lvLndpa2lwZWRpYS5vcmcnLFxuICB5b3dpa3Rpb25hcnk6ICdodHRwczovL3lvLndpa3Rpb25hcnkub3JnJyxcbiAgeW93aWtpYm9va3M6ICdodHRwczovL3lvLndpa2lib29rcy5vcmcnLFxuICB6YXdpa2k6ICdodHRwczovL3phLndpa2lwZWRpYS5vcmcnLFxuICB6YXdpa3Rpb25hcnk6ICdodHRwczovL3phLndpa3Rpb25hcnkub3JnJyxcbiAgemF3aWtpYm9va3M6ICdodHRwczovL3phLndpa2lib29rcy5vcmcnLFxuICB6YXdpa2lxdW90ZTogJ2h0dHBzOi8vemEud2lraXF1b3RlLm9yZycsXG4gIHplYXdpa2k6ICdodHRwczovL3plYS53aWtpcGVkaWEub3JnJyxcbiAgemh3aWtpOiAnaHR0cHM6Ly96aC53aWtpcGVkaWEub3JnJyxcbiAgemh3aWt0aW9uYXJ5OiAnaHR0cHM6Ly96aC53aWt0aW9uYXJ5Lm9yZycsXG4gIHpod2lraWJvb2tzOiAnaHR0cHM6Ly96aC53aWtpYm9va3Mub3JnJyxcbiAgemh3aWtpbmV3czogJ2h0dHBzOi8vemgud2lraW5ld3Mub3JnJyxcbiAgemh3aWtpcXVvdGU6ICdodHRwczovL3poLndpa2lxdW90ZS5vcmcnLFxuICB6aHdpa2lzb3VyY2U6ICdodHRwczovL3poLndpa2lzb3VyY2Uub3JnJyxcbiAgemh3aWtpdm95YWdlOiAnaHR0cHM6Ly96aC53aWtpdm95YWdlLm9yZycsXG4gIHpoX2NsYXNzaWNhbHdpa2k6ICdodHRwczovL3poLWNsYXNzaWNhbC53aWtpcGVkaWEub3JnJyxcbiAgemhfbWluX25hbndpa2k6ICdodHRwczovL3poLW1pbi1uYW4ud2lraXBlZGlhLm9yZycsXG4gIHpoX21pbl9uYW53aWt0aW9uYXJ5OiAnaHR0cHM6Ly96aC1taW4tbmFuLndpa3Rpb25hcnkub3JnJyxcbiAgemhfbWluX25hbndpa2lib29rczogJ2h0dHBzOi8vemgtbWluLW5hbi53aWtpYm9va3Mub3JnJyxcbiAgemhfbWluX25hbndpa2lxdW90ZTogJ2h0dHBzOi8vemgtbWluLW5hbi53aWtpcXVvdGUub3JnJyxcbiAgemhfbWluX25hbndpa2lzb3VyY2U6ICdodHRwczovL3poLW1pbi1uYW4ud2lraXNvdXJjZS5vcmcnLFxuICB6aF95dWV3aWtpOiAnaHR0cHM6Ly96aC15dWUud2lraXBlZGlhLm9yZycsXG4gIHp1d2lraTogJ2h0dHBzOi8venUud2lraXBlZGlhLm9yZycsXG4gIHp1d2lrdGlvbmFyeTogJ2h0dHBzOi8venUud2lrdGlvbmFyeS5vcmcnLFxuICB6dXdpa2lib29rczogJ2h0dHBzOi8venUud2lraWJvb2tzLm9yZydcbn07XG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBzaXRlX21hcDtcbn1cbiIsIi8vdHVybnMgd2lraW1lZGlhIHNjcmlwdCBpbnRvIGpzb25cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zcGVuY2VybW91bnRhaW4vd3RmX3dpa2lwZWRpYVxuLy9Ac3BlbmNlcm1vdW50YWluXG5jb25zdCBmZXRjaCA9IHJlcXVpcmUoJy4vbGliL2ZldGNoX3RleHQnKTtcbmNvbnN0IHBhcnNlID0gcmVxdWlyZSgnLi9wYXJzZScpO1xuY29uc3QgbWFya2Rvd24gPSByZXF1aXJlKCcuL291dHB1dC9tYXJrZG93bicpO1xuY29uc3QgaHRtbCA9IHJlcXVpcmUoJy4vb3V0cHV0L2h0bWwnKTtcbmNvbnN0IHZlcnNpb24gPSByZXF1aXJlKCcuLi9wYWNrYWdlJykudmVyc2lvbjtcblxuLy91c2UgYSBnbG9iYWwgdmFyIGZvciBsYXp5IGN1c3RvbWl6YXRpb25cbmxldCBvcHRpb25zID0ge307XG5cbi8vZnJvbSBhIHBhZ2UgdGl0bGUgb3IgaWQsIGZldGNoIHRoZSB3aWtpc2NyaXB0XG5jb25zdCBmcm9tX2FwaSA9IGZ1bmN0aW9uKHBhZ2VfaWRlbnRpZmllciwgbGFuZ19vcl93aWtpaWQsIGNiKSB7XG4gIGlmICh0eXBlb2YgbGFuZ19vcl93aWtpaWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYiA9IGxhbmdfb3Jfd2lraWlkO1xuICAgIGxhbmdfb3Jfd2lraWlkID0gJ2VuJztcbiAgfVxuICBjYiA9IGNiIHx8IGZ1bmN0aW9uKCkge307XG4gIGxhbmdfb3Jfd2lraWlkID0gbGFuZ19vcl93aWtpaWQgfHwgJ2VuJztcbiAgaWYgKCFmZXRjaCkge1xuICAgIC8vbm8gaHR0cCBtZXRob2QsIG9uIHRoZSBjbGllbnQgc2lkZVxuICAgIHJldHVybiBjYihudWxsKTtcbiAgfVxuICByZXR1cm4gZmV0Y2gocGFnZV9pZGVudGlmaWVyLCBsYW5nX29yX3dpa2lpZCwgY2IpO1xufTtcblxuLy90dXJuIHdpa2ktbWFya3VwIGludG8gYSBuaWNlbHktZm9ybWF0dGVkIHRleHRcbmNvbnN0IHBsYWludGV4dCA9IGZ1bmN0aW9uKHN0ciwgb3B0aW9uc1ApIHtcbiAgb3B0aW9uc1AgPSBvcHRpb25zUCA9PT0gdW5kZWZpbmVkID8gb3B0aW9ucyA6IG9wdGlvbnNQO1xuICBsZXQgZGF0YSA9IHBhcnNlKHN0ciwgb3B0aW9uc1ApIHx8IHt9O1xuICBkYXRhLnNlY3Rpb25zID0gZGF0YS5zZWN0aW9ucyB8fCBbXTtcbiAgbGV0IGFyciA9IGRhdGEuc2VjdGlvbnMubWFwKGQgPT4ge1xuICAgIHJldHVybiBkLnNlbnRlbmNlcy5tYXAoYSA9PiBhLnRleHQpLmpvaW4oJyAnKTtcbiAgfSk7XG4gIHJldHVybiBhcnIuam9pbignXFxuXFxuJyk7XG59O1xuXG5jb25zdCBjdXN0b21pemUgPSBmdW5jdGlvbihvYmopIHtcbiAgb3B0aW9ucy5jdXN0b20gPSBvYmo7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZnJvbV9hcGk6IGZyb21fYXBpLFxuICBwbGFpbnRleHQ6IHBsYWludGV4dCxcbiAgbWFya2Rvd246IG1hcmtkb3duLFxuICBodG1sOiBodG1sLFxuICB2ZXJzaW9uOiB2ZXJzaW9uLFxuICBjdXN0b206IGN1c3RvbWl6ZSxcbiAgcGFyc2U6IChzdHIsIG9iaikgPT4ge1xuICAgIG9iaiA9IG9iaiB8fCB7fTtcbiAgICBvYmogPSBPYmplY3QuYXNzaWduKG9iaiwgb3B0aW9ucyk7IC8vZ3JhYiAnY3VzdG9tJyBwZXJzaXN0ZW50IG9wdGlvbnNcbiAgICByZXR1cm4gcGFyc2Uoc3RyLCBvYmopO1xuICB9XG59O1xuIiwiLy9jb252ZXJ0cyBETVMgKGRlY2ltYWwtbWludXRlLXNlY29uZCkgZ2VvIGZvcm1hdCB0byBsYXQvbG5nIGZvcm1hdC5cbi8vbWFqb3IgdGhhbmsgeW91IHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9nbWFjbGVubmFuL3BhcnNlLWRtc1xuLy9hbmQgaHR0cHM6Ly9naXRodWIuY29tL1dTRE9ULUdJUy9kbXMtanMg8J+Rj1xuXG4vL2FjY2VwdHMgYW4gYXJyYXkgb2YgZGVzY2VuZGluZyBEZWdyZWUsIE1pbnV0ZSwgU2Vjb25kIHZhbHVlcywgd2l0aCBhIGhlbWlzcGhlcmUgYXQgdGhlIGVuZFxuLy9tdXN0IGhhdmUgTi9TL0UvVyBhcyBsYXN0IHRoaW5nXG5mdW5jdGlvbiBwYXJzZURtcyhhcnIpIHtcbiAgbGV0IGhlbWlzcGhlcmUgPSBhcnIucG9wKCk7XG4gIHZhciBkZWdyZWVzID0gTnVtYmVyKGFyclswXSB8fCAwKTtcbiAgdmFyIG1pbnV0ZXMgPSBOdW1iZXIoYXJyWzFdIHx8IDApO1xuICB2YXIgc2Vjb25kcyA9IE51bWJlcihhcnJbMl0gfHwgMCk7XG4gIGlmICh0eXBlb2YgaGVtaXNwaGVyZSAhPT0gJ3N0cmluZycgfHwgaXNOYU4oZGVncmVlcykpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgc2lnbiA9IDE7XG4gIGlmICgvW1NXXS9pLnRlc3QoaGVtaXNwaGVyZSkpIHtcbiAgICBzaWduID0gLTE7XG4gIH1cbiAgbGV0IGRlY0RlZyA9IHNpZ24gKiAoZGVncmVlcyArIG1pbnV0ZXMgLyA2MCArIHNlY29uZHMgLyAzNjAwKTtcbiAgcmV0dXJuIGRlY0RlZztcbn1cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VEbXM7XG4vLyBjb25zb2xlLmxvZyhwYXJzZURtcyhbNTcsIDE4LCAyMiwgJ04nXSkpO1xuLy8gY29uc29sZS5sb2cocGFyc2VEbXMoWzQsIDI3LCAzMiwgJ1cnXSkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy9ncmFiIHRoZSBjb250ZW50IG9mIGFueSBhcnRpY2xlLCBvZmYgdGhlIGFwaVxuY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJ3N1cGVyYWdlbnQnKTtcbmNvbnN0IHNpdGVfbWFwID0gcmVxdWlyZSgnLi4vZGF0YS9zaXRlX21hcCcpO1xuY29uc3QgcmVkaXJlY3RzID0gcmVxdWlyZSgnLi4vcGFyc2UvcGFnZS9yZWRpcmVjdHMnKTtcblxuY29uc3QgZmV0Y2ggPSBmdW5jdGlvbihwYWdlX2lkZW50aWZpZXIsIGxhbmdfb3Jfd2lraWlkLCBjYikge1xuICBsYW5nX29yX3dpa2lpZCA9IGxhbmdfb3Jfd2lraWlkIHx8ICdlbic7XG4gIHZhciBpZGVudGlmaWVyX3R5cGUgPSAndGl0bGVzJztcbiAgaWYgKHBhZ2VfaWRlbnRpZmllci5tYXRjaCgvXlswLTldKiQvKSAmJiBwYWdlX2lkZW50aWZpZXIubGVuZ3RoID4gMykge1xuICAgIGlkZW50aWZpZXJfdHlwZSA9ICdjdXJpZCc7XG4gIH1cbiAgbGV0IHVybDtcbiAgaWYgKHNpdGVfbWFwW2xhbmdfb3Jfd2lraWlkXSkge1xuICAgIHVybCA9IHNpdGVfbWFwW2xhbmdfb3Jfd2lraWlkXSArICcvdy9hcGkucGhwJztcbiAgfSBlbHNlIHtcbiAgICB1cmwgPSAnaHR0cHM6Ly8nICsgbGFuZ19vcl93aWtpaWQgKyAnLndpa2lwZWRpYS5vcmcvdy9hcGkucGhwJztcbiAgfVxuICAvL3dlIHVzZSB0aGUgJ3JldmlzaW9ucycgYXBpIGhlcmUsIGluc3RlYWQgb2YgdGhlIFJhdyBhcGksIGZvciBpdHMgQ09SUy1ydWxlcy4uXG4gIHVybCArPSAnP2FjdGlvbj1xdWVyeSZwcm9wPXJldmlzaW9ucyZydmxpbWl0PTEmcnZwcm9wPWNvbnRlbnQmZm9ybWF0PWpzb24mb3JpZ2luPSonO1xuICB1cmwgKz0gJyYnICsgaWRlbnRpZmllcl90eXBlICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhZ2VfaWRlbnRpZmllcik7XG5cbiAgcmVxdWVzdC5nZXQodXJsKS5lbmQoZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICBpZiAoZXJyIHx8ICFyZXMuYm9keS5xdWVyeSkge1xuICAgICAgY29uc29sZS53YXJuKGVycik7XG4gICAgICBjYihudWxsKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHBhZ2VzID0gKHJlcyAmJiByZXMuYm9keSAmJiByZXMuYm9keS5xdWVyeSkgPyByZXMuYm9keS5xdWVyeS5wYWdlcyA6IHt9O1xuICAgIHZhciBpZCA9IE9iamVjdC5rZXlzKHBhZ2VzKVswXTtcbiAgICBpZiAoaWQpIHtcbiAgICAgIHZhciBwYWdlID0gcGFnZXNbaWRdO1xuICAgICAgaWYgKHBhZ2UgJiYgcGFnZS5yZXZpc2lvbnMgJiYgcGFnZS5yZXZpc2lvbnNbMF0pIHtcbiAgICAgICAgdmFyIHRleHQgPSBwYWdlLnJldmlzaW9uc1swXVsnKiddO1xuICAgICAgICBpZiAocmVkaXJlY3RzLmlzX3JlZGlyZWN0KHRleHQpKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IHJlZGlyZWN0cy5wYXJzZV9yZWRpcmVjdCh0ZXh0KTtcbiAgICAgICAgICBmZXRjaChyZXN1bHQucmVkaXJlY3QsIGxhbmdfb3Jfd2lraWlkLCBjYik7IC8vcmVjdXJzaXZlXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNiKHRleHQscGFnZV9pZGVudGlmaWVyLGxhbmdfb3Jfd2lraWlkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNiKG51bGwpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZldGNoO1xuXG4vLyBmZXRjaCgnT25fQV9GcmlkYXknLCAnZW4nLCBmdW5jdGlvbihyKSB7IC8vICdhZndpa2knXG4vLyAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHIsIG51bGwsIDIpKTtcbi8vIH0pO1xuIiwidmFyIGhlbHBlcnMgPSB7XG4gIGNhcGl0YWxpc2U6IGZ1bmN0aW9uKHN0cikge1xuICAgIGlmIChzdHIgJiYgdHlwZW9mIHN0ciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfSxcbiAgb25seVVuaXF1ZTogZnVuY3Rpb24odmFsdWUsIGluZGV4LCBzZWxmKSB7XG4gICAgcmV0dXJuIHNlbGYuaW5kZXhPZih2YWx1ZSkgPT09IGluZGV4O1xuICB9LFxuICB0cmltX3doaXRlc3BhY2U6IGZ1bmN0aW9uKHN0cikge1xuICAgIGlmIChzdHIgJiYgdHlwZW9mIHN0ciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9eXFxzXFxzKi8sICcnKTtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9cXHNcXHMqJC8sICcnKTtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8gezJ9LywgJyAnKTtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9cXHMsIC8sICcsICcpO1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBoZWxwZXJzO1xuIiwiLy9maW5kIGFsbCB0aGUgcGFpcnMgb2YgJ1tbLi4uW1suLl1dLi4uXV0nIGluIHRoZSB0ZXh0XG4vL3VzZWQgdG8gcHJvcGVybHkgcm9vdCBvdXQgcmVjdXJzaXZlIHRlbXBsYXRlIGNhbGxzLCBbWy4uIFtbLi4uXV0gXV1cbi8vYmFzaWNhbGx5IGp1c3QgYWRkcyBvcGVuIHRhZ3MsIGFuZCBzdWJ0cmFjdHMgY2xvc2luZyB0YWdzXG5mdW5jdGlvbiBmaW5kX3JlY3Vyc2l2ZShvcGVuZXIsIGNsb3NlciwgdGV4dCkge1xuICB2YXIgb3V0ID0gW107XG4gIHZhciBsYXN0ID0gW107XG4gIHZhciBjaGFycyA9IHRleHQuc3BsaXQoJycpO1xuICB2YXIgb3BlbiA9IDA7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAvL2luY3JpbWVudCBvcGVuIHRhZ1xuICAgIGlmIChjaGFyc1tpXSA9PT0gb3BlbmVyKSB7XG4gICAgICBvcGVuICs9IDE7XG4gICAgfVxuICAgIC8vZGVjcmVtZW50IGNsb3NlIHRhZ1xuICAgIGlmIChjaGFyc1tpXSA9PT0gY2xvc2VyKSB7XG4gICAgICBvcGVuIC09IDE7XG4gICAgICBpZiAob3BlbiA8IDApIHtcbiAgICAgICAgb3BlbiA9IDA7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvcGVuID49IDApIHtcbiAgICAgIGxhc3QucHVzaChjaGFyc1tpXSk7XG4gICAgfVxuICAgIGlmIChvcGVuID09PSAwICYmIGxhc3QubGVuZ3RoID4gMCkge1xuICAgICAgLy9maXJzdCwgZml4IGJvdGNoZWQgcGFyc2VcbiAgICAgIHZhciBvcGVuX2NvdW50ID0gbGFzdC5maWx0ZXIoZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcyA9PT0gb3BlbmVyO1xuICAgICAgfSk7XG4gICAgICB2YXIgY2xvc2VfY291bnQgPSBsYXN0LmZpbHRlcihmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiBzID09PSBjbG9zZXI7XG4gICAgICB9KTtcbiAgICAgIC8vaXMgaXQgYm90Y2hlZD9cbiAgICAgIGlmIChvcGVuX2NvdW50Lmxlbmd0aCA+IGNsb3NlX2NvdW50Lmxlbmd0aCkge1xuICAgICAgICBsYXN0LnB1c2goY2xvc2VyKTtcbiAgICAgIH1cbiAgICAgIC8vbG9va3MgZ29vZCwga2VlcCBpdFxuICAgICAgb3V0LnB1c2gobGFzdC5qb2luKCcnKSk7XG4gICAgICBsYXN0ID0gW107XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRfcmVjdXJzaXZlO1xuXG4vLyBjb25zb2xlLmxvZyhmaW5kX3JlY3Vyc2l2ZSgneycsICd9JywgJ2hlIGlzIHByZXNpZGVudC4ge3tub3dyYXB8e3tzbWFsbHwoMTk5NeKAk3ByZXNlbnQpfX19fSBoZSBsaXZlcyBpbiB0ZXhhcycpKTtcbi8vIGNvbnNvbGUubG9nKGZpbmRfcmVjdXJzaXZlKFwie1wiLCBcIn1cIiwgXCJ0aGlzIGlzIGZ1biB7e25vd3JhcHt7c21hbGwxOTk14oCTcHJlc2VudH19fX0gYW5kIGl0IHdvcmtzXCIpKVxuIiwiY29uc3QgcGFyc2UgPSByZXF1aXJlKCcuLi8uLi9wYXJzZScpO1xuY29uc3QgZG9JbmZvYm94ID0gcmVxdWlyZSgnLi9pbmZvYm94Jyk7XG5jb25zdCBkb1NlbnRlbmNlID0gcmVxdWlyZSgnLi9zZW50ZW5jZScpO1xuY29uc3QgZG9UYWJsZSA9IHJlcXVpcmUoJy4vdGFibGUnKTtcblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIGluZm9ib3hlczogdHJ1ZSxcbiAgdGFibGVzOiB0cnVlLFxuICBsaXN0czogdHJ1ZSxcbiAgdGl0bGU6IHRydWUsXG4gIGltYWdlczogdHJ1ZSxcbiAgbGlua3M6IHRydWUsXG4gIGZvcm1hdHRpbmc6IHRydWUsXG4gIHNlbnRlbmNlczogdHJ1ZSxcbn07XG5cbmNvbnN0IG1ha2VJbWFnZSA9IChpbWFnZSkgPT4ge1xuICBsZXQgYWx0ID0gaW1hZ2UuZmlsZS5yZXBsYWNlKC9eKGZpbGV8aW1hZ2UpOi9pLCAnJyk7XG4gIGFsdCA9IGFsdC5yZXBsYWNlKC9cXC4oanBnfGpwZWd8cG5nfGdpZnxzdmcpL2ksICcnKTtcbiAgcmV0dXJuICcgIDxpbWcgc3JjPVwiJyArIGltYWdlLnRodW1iICsgJ1wiIGFsdD1cIicgKyBhbHQgKyAnXCIvPic7XG59O1xuXG5jb25zdCBkb0xpc3QgPSAobGlzdCkgPT4ge1xuICBsZXQgaHRtbCA9ICc8dWw+XFxuJztcbiAgbGlzdC5mb3JFYWNoKChvKSA9PiB7XG4gICAgaHRtbCArPSAnICA8bGk+JyArIG8udGV4dCArICc8L2xpPlxcbic7XG4gIH0pO1xuICBodG1sICs9ICc8dWw+XFxuJztcbiAgcmV0dXJuIGh0bWw7XG59O1xuXG5jb25zdCBkb1NlY3Rpb24gPSAoc2VjdGlvbiwgb3B0aW9ucykgPT4ge1xuICBsZXQgaHRtbCA9ICcnO1xuICAvL21ha2UgdGhlIGhlYWRlclxuICBpZiAob3B0aW9ucy50aXRsZSA9PT0gdHJ1ZSAmJiBzZWN0aW9uLnRpdGxlKSB7XG4gICAgbGV0IG51bSA9IDEgKyBzZWN0aW9uLmRlcHRoO1xuICAgIGh0bWwgKz0gJyAgPGgnICsgbnVtICsgJz4nICsgc2VjdGlvbi50aXRsZSArICc8L2gnICsgbnVtICsgJz4nO1xuICAgIGh0bWwgKz0gJ1xcbic7XG4gIH1cbiAgLy9wdXQgYW55IGltYWdlcyB1bmRlciB0aGUgaGVhZGVyXG4gIGlmIChzZWN0aW9uLmltYWdlcyAmJiBvcHRpb25zLmltYWdlcyA9PT0gdHJ1ZSkge1xuICAgIGh0bWwgKz0gc2VjdGlvbi5pbWFnZXMubWFwKChpbWFnZSkgPT4gbWFrZUltYWdlKGltYWdlKSkuam9pbignXFxuJyk7XG4gICAgaHRtbCArPSAnXFxuJztcbiAgfVxuICAvL21ha2UgYSBodG1sIHRhYmxlXG4gIGlmIChzZWN0aW9uLnRhYmxlcyAmJiBvcHRpb25zLnRhYmxlcyA9PT0gdHJ1ZSkge1xuICAgIGh0bWwgKz0gc2VjdGlvbi50YWJsZXMubWFwKCh0KSA9PiBkb1RhYmxlKHQsIG9wdGlvbnMpKS5qb2luKCdcXG4nKTtcbiAgfVxuICAvLyAvL21ha2UgYSBodG1sIGJ1bGxldC1saXN0XG4gIGlmIChzZWN0aW9uLmxpc3RzICYmIG9wdGlvbnMubGlzdHMgPT09IHRydWUpIHtcbiAgICBodG1sICs9IHNlY3Rpb24ubGlzdHMubWFwKChsaXN0KSA9PiBkb0xpc3QobGlzdCwgb3B0aW9ucykpLmpvaW4oJ1xcbicpO1xuICB9XG4gIC8vZmluYWxseSwgd3JpdGUgdGhlIHNlbnRlbmNlIHRleHQuXG4gIGlmIChzZWN0aW9uLnNlbnRlbmNlcyAmJiBvcHRpb25zLnNlbnRlbmNlcyA9PT0gdHJ1ZSkge1xuICAgIGh0bWwgKz0gJyAgPHA+JyArIHNlY3Rpb24uc2VudGVuY2VzLm1hcCgocykgPT4gZG9TZW50ZW5jZShzLCBvcHRpb25zKSkuam9pbignICcpICsgJzwvcD4nO1xuICAgIGh0bWwgKz0gJ1xcbic7XG4gIH1cbiAgcmV0dXJuICc8ZGl2IGNsYXNzPVwic2VjdGlvblwiPlxcbicgKyBodG1sICsgJzwvZGl2Plxcbic7XG59O1xuLy9cbmNvbnN0IHRvSHRtbCA9IGZ1bmN0aW9uKHN0ciwgb3B0aW9ucykge1xuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgb3B0aW9ucyk7XG4gIGxldCBkYXRhID0gcGFyc2Uoc3RyLCBvcHRpb25zKTtcbiAgbGV0IGh0bWwgPSAnJztcbiAgLy9hZGQgdGhlIHRpdGxlIG9uIHRoZSB0b3BcbiAgLy8gaWYgKG9wdGlvbnMudGl0bGUgPT09IHRydWUgJiYgZGF0YS50aXRsZSkge1xuICAvLyAgIGh0bWwgKz0gJzxoMT4nICsgZGF0YS50aXRsZSArICc8L2gxPlxcbic7XG4gIC8vIH1cbiAgLy9yZW5kZXIgaW5mb2JveGVzICh1cCBhdCB0aGUgdG9wKVxuICBpZiAob3B0aW9ucy5pbmZvYm94ZXMgPT09IHRydWUgJiYgZGF0YS5pbmZvYm94ZXMpIHtcbiAgICBodG1sICs9IGRhdGEuaW5mb2JveGVzLm1hcChvID0+IGRvSW5mb2JveChvLCBvcHRpb25zKSkuam9pbignXFxuJyk7XG4gIH1cbiAgLy9yZW5kZXIgZWFjaCBzZWN0aW9uXG4gIGh0bWwgKz0gZGF0YS5zZWN0aW9ucy5tYXAocyA9PiBkb1NlY3Rpb24ocywgb3B0aW9ucykpLmpvaW4oJ1xcbicpO1xuICByZXR1cm4gaHRtbDtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHRvSHRtbDtcbiIsImNvbnN0IGRvU2VudGVuY2UgPSByZXF1aXJlKCcuL3NlbnRlbmNlJyk7XG5cbmNvbnN0IGRvbnREbyA9IHtcbiAgaW1hZ2U6IHRydWUsXG4gIGNhcHRpb246IHRydWVcbn07XG4vL1xuY29uc3QgaW5mb2JveCA9IGZ1bmN0aW9uKG9iaiwgb3B0aW9ucykge1xuICBsZXQgaHRtbCA9ICc8dGFibGU+XFxuJztcbiAgT2JqZWN0LmtleXMob2JqLmRhdGEpLmZvckVhY2goKGspID0+IHtcbiAgICBpZiAoZG9udERvW2tdID09PSB0cnVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCB2YWwgPSBkb1NlbnRlbmNlKG9iai5kYXRhW2tdLCBvcHRpb25zKTtcbiAgICBodG1sICs9ICcgIDx0cj5cXG4nO1xuICAgIGh0bWwgKz0gJyAgICA8dGQ+JyArIGsgKyAnPC90ZD5cXG4nO1xuICAgIGh0bWwgKz0gJyAgICA8dGQ+JyArIHZhbCArICc8L3RkPlxcbic7XG4gICAgaHRtbCArPSAnICA8L3RyPlxcbic7XG4gIH0pO1xuICBodG1sICs9ICc8L3RhYmxlPlxcbic7XG4gIHJldHVybiBodG1sO1xufTtcbm1vZHVsZS5leHBvcnRzID0gaW5mb2JveDtcbiIsImNvbnN0IHNtYXJ0UmVwbGFjZSA9IHJlcXVpcmUoJy4uL2xpYicpLnNtYXJ0UmVwbGFjZTtcblxuLy8gY3JlYXRlIGxpbmtzLCBib2xkLCBpdGFsaWMgaW4gaHRtbFxuY29uc3QgZG9TZW50ZW5jZSA9IGZ1bmN0aW9uKHNlbnRlbmNlLCBvcHRpb25zKSB7XG4gIGxldCB0ZXh0ID0gc2VudGVuY2UudGV4dDtcbiAgLy90dXJuIGxpbmtzIGJhY2sgaW50byBsaW5rc1xuICBpZiAoc2VudGVuY2UubGlua3MgJiYgb3B0aW9ucy5saW5rcyA9PT0gdHJ1ZSkge1xuICAgIHNlbnRlbmNlLmxpbmtzLmZvckVhY2goKGxpbmspID0+IHtcbiAgICAgIGxldCBocmVmID0gJyc7XG4gICAgICBsZXQgY2xhc3NOYW1lcyA9ICdsaW5rJztcbiAgICAgIGlmIChsaW5rLnNpdGUpIHtcbiAgICAgICAgLy91c2UgYW4gZXh0ZXJuYWwgbGlua1xuICAgICAgICBocmVmID0gbGluay5zaXRlO1xuICAgICAgICBjbGFzc05hbWVzICs9ICcgZXh0ZXJuYWwnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9vdGhlcndpc2UsIG1ha2UgaXQgYSByZWxhdGl2ZSBpbnRlcm5hbCBsaW5rXG4gICAgICAgIGhyZWYgPSBsaW5rLnBhZ2UgfHwgbGluay50ZXh0O1xuICAgICAgICBocmVmID0gJy4vJyArIGhyZWYucmVwbGFjZSgvIC9nLCAnXycpO1xuICAgICAgfVxuICAgICAgbGV0IHRhZyA9ICc8YSBjbGFzcz1cIicgKyBjbGFzc05hbWVzICsgJ1wiIGhyZWY9XCInICsgaHJlZiArICdcIj4nO1xuICAgICAgdGFnICs9IGxpbmsudGV4dCArICc8L2E+JztcbiAgICAgIHRleHQgPSBzbWFydFJlcGxhY2UodGV4dCwgbGluay50ZXh0LCB0YWcpO1xuICAgIH0pO1xuICB9XG4gIGlmIChzZW50ZW5jZS5mbXQpIHtcbiAgICBpZiAoc2VudGVuY2UuZm10LmJvbGQpIHtcbiAgICAgIHNlbnRlbmNlLmZtdC5ib2xkLmZvckVhY2goKHN0cikgPT4ge1xuICAgICAgICBsZXQgdGFnID0gJzxiPicgKyBzdHIgKyAnPC9iPic7XG4gICAgICAgIHRleHQgPSBzbWFydFJlcGxhY2UodGV4dCwgc3RyLCB0YWcpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChzZW50ZW5jZS5mbXQuaXRhbGljKSB7XG4gICAgICBzZW50ZW5jZS5mbXQuaXRhbGljLmZvckVhY2goKHN0cikgPT4ge1xuICAgICAgICBsZXQgdGFnID0gJzxpPicgKyBzdHIgKyAnPC9pPic7XG4gICAgICAgIHRleHQgPSBzbWFydFJlcGxhY2UodGV4dCwgc3RyLCB0YWcpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0ZXh0O1xufTtcbm1vZHVsZS5leHBvcnRzID0gZG9TZW50ZW5jZTtcbiIsImNvbnN0IGRvU2VudGVuY2UgPSByZXF1aXJlKCcuL3NlbnRlbmNlJyk7XG5cblxuY29uc3QgZG9UYWJsZSA9IGZ1bmN0aW9uKHRhYmxlLCBvcHRpb25zKSB7XG4gIGxldCBodG1sID0gJzx0YWJsZT5cXG4nO1xuICAvL21ha2UgaGVhZGVyXG4gIGh0bWwgKz0gJyAgPHRoZWFkPic7XG4gIE9iamVjdC5rZXlzKHRhYmxlWzBdKS5mb3JFYWNoKChrKSA9PiB7XG4gICAgaHRtbCArPSAnICAgIDx0ZD4nICsgayArICc8L3RkPlxcbic7XG4gIH0pO1xuICBodG1sICs9ICcgIDwvdGhlYWQ+JztcbiAgaHRtbCArPSAnICA8dGJvZHk+JztcbiAgLy9tYWtlIHJvd3NcbiAgdGFibGUuZm9yRWFjaCgobykgPT4ge1xuICAgIGh0bWwgKz0gJyAgPHRyPlxcbic7XG4gICAgT2JqZWN0LmtleXMobykuZm9yRWFjaCgoaykgPT4ge1xuICAgICAgbGV0IHZhbCA9IGRvU2VudGVuY2Uob1trXSwgb3B0aW9ucyk7XG4gICAgICBodG1sICs9ICcgICAgPHRkPicgKyB2YWwgKyAnPC90ZD5cXG4nO1xuICAgIH0pO1xuICAgIGh0bWwgKz0gJyAgPC90cj5cXG4nO1xuICB9KTtcbiAgaHRtbCArPSAnICA8L3Rib2R5Pic7XG4gIGh0bWwgKz0gJzwvdGFibGU+XFxuJztcbiAgcmV0dXJuIGh0bWw7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBkb1RhYmxlO1xuIiwiLy9lc2NhcGUgYSBzdHJpbmcgbGlrZSAnZnVuKjIuQ28nIGZvciBhIHJlZ0V4cHJcbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgJ1xcXFwkJicpO1xufVxuXG4vL3NvbWV0aW1lcyB0ZXh0LXJlcGxhY2VtZW50cyBjYW4gYmUgYW1iaWd1b3VzIC0gd29yZHMgdXNlZCBtdWx0aXBsZSB0aW1lcy4uXG5jb25zdCBzbWFydFJlcGxhY2UgPSBmdW5jdGlvbihhbGwsIHRleHQsIHJlc3VsdCkge1xuICBpZiAoIXRleHQgfHwgIWFsbCkge1xuICAgIC8vIGNvbnNvbGUubG9nKHRleHQpO1xuICAgIHJldHVybiBhbGw7XG4gIH1cblxuICBpZiAodHlwZW9mIGFsbCA9PT0gJ251bWJlcicpIHtcbiAgICBhbGwgPSBTdHJpbmcoYWxsKTtcbiAgfVxuICB0ZXh0ID0gZXNjYXBlUmVnRXhwKHRleHQpO1xuICAvL3RyeSBhIHdvcmQtYm91bmRhcnkgcmVwbGFjZVxuICBsZXQgcmVnID0gbmV3IFJlZ0V4cCgnXFxcXGInICsgdGV4dCArICdcXFxcYicpO1xuICBpZiAocmVnLnRlc3QoYWxsKSA9PT0gdHJ1ZSkge1xuICAgIGFsbCA9IGFsbC5yZXBsYWNlKHJlZywgcmVzdWx0KTtcbiAgfSBlbHNlIHtcbiAgICAvL290aGVyd2lzZSwgZmFsbC1iYWNrIHRvIGEgbXVjaCBtZXNzaWVyLCBkYW5nZXJvdXMgcmVwbGFjZW1lbnRcbiAgICAvLyBjb25zb2xlLndhcm4oJ21pc3NpbmcgXFwnJyArIHRleHQgKyAnXFwnJyk7XG4gICAgYWxsID0gYWxsLnJlcGxhY2UodGV4dCwgcmVzdWx0KTtcbiAgfVxuICByZXR1cm4gYWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNtYXJ0UmVwbGFjZTogc21hcnRSZXBsYWNlXG59O1xuIiwiY29uc3QgcGFyc2UgPSByZXF1aXJlKCcuLi8uLi9wYXJzZScpO1xuY29uc3QgZG9UYWJsZSA9IHJlcXVpcmUoJy4vdGFibGUnKTtcbmNvbnN0IGRvSW5mb2JveCA9IHJlcXVpcmUoJy4vaW5mb2JveCcpO1xuY29uc3QgZG9TZW50ZW5jZSA9IHJlcXVpcmUoJy4vc2VudGVuY2UnKTtcblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIGluZm9ib3hlczogdHJ1ZSxcbiAgdGFibGVzOiB0cnVlLFxuICBsaXN0czogdHJ1ZSxcbiAgdGl0bGU6IHRydWUsXG4gIGltYWdlczogdHJ1ZSxcbiAgbGlua3M6IHRydWUsXG4gIGZvcm1hdHRpbmc6IHRydWUsXG4gIHNlbnRlbmNlczogdHJ1ZSxcbn07XG5cbmNvbnN0IGRvTGlzdCA9IChsaXN0LCBvcHRpb25zKSA9PiB7XG4gIHJldHVybiBsaXN0Lm1hcCgobykgPT4ge1xuICAgIGxldCBzdHIgPSBkb1NlbnRlbmNlKG8sIG9wdGlvbnMpO1xuICAgIHJldHVybiAnICogJyArIHN0cjtcbiAgfSkuam9pbignXFxuJyk7XG59O1xuXG4vL21hcmtkb3duIGltYWdlcyBhcmUgbGlrZSB0aGlzOiAhW2FsdCB0ZXh0XShocmVmKVxuY29uc3QgZG9JbWFnZSA9IChpbWFnZSkgPT4ge1xuICBsZXQgYWx0ID0gaW1hZ2UuZmlsZS5yZXBsYWNlKC9eKGZpbGV8aW1hZ2UpOi9pLCAnJyk7XG4gIGFsdCA9IGFsdC5yZXBsYWNlKC9cXC4oanBnfGpwZWd8cG5nfGdpZnxzdmcpL2ksICcnKTtcbiAgcmV0dXJuICchWycgKyBhbHQgKyAnXSgnICsgaW1hZ2UudGh1bWIgKyAnKSc7XG59O1xuXG5jb25zdCBkb1NlY3Rpb24gPSAoc2VjdGlvbiwgb3B0aW9ucykgPT4ge1xuICBsZXQgbWQgPSAnJztcbiAgLy9tYWtlIHRoZSBoZWFkZXJcbiAgaWYgKG9wdGlvbnMudGl0bGUgPT09IHRydWUgJiYgc2VjdGlvbi50aXRsZSkge1xuICAgIGxldCBoZWFkZXIgPSAnIyMnO1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBzZWN0aW9uLmRlcHRoOyBpICs9IDEpIHtcbiAgICAgIGhlYWRlciArPSAnIyc7XG4gICAgfVxuICAgIG1kICs9IGhlYWRlciArICcgJyArIHNlY3Rpb24udGl0bGUgKyAnXFxuJztcbiAgfVxuICAvL3B1dCBhbnkgaW1hZ2VzIHVuZGVyIHRoZSBoZWFkZXJcbiAgaWYgKHNlY3Rpb24uaW1hZ2VzICYmIG9wdGlvbnMuaW1hZ2VzID09PSB0cnVlKSB7XG4gICAgbWQgKz0gc2VjdGlvbi5pbWFnZXMubWFwKChpbWcpID0+IGRvSW1hZ2UoaW1nKSkuam9pbignXFxuJyk7XG4gICAgbWQgKz0gJ1xcbic7XG4gIH1cbiAgLy9tYWtlIGEgbWFyZG93biB0YWJsZVxuICBpZiAoc2VjdGlvbi50YWJsZXMgJiYgb3B0aW9ucy50YWJsZXMgPT09IHRydWUpIHtcbiAgICBtZCArPSAnXFxuJztcbiAgICBtZCArPSBzZWN0aW9uLnRhYmxlcy5tYXAoKHRhYmxlKSA9PiBkb1RhYmxlKHRhYmxlLCBvcHRpb25zKSkuam9pbignXFxuJyk7XG4gICAgbWQgKz0gJ1xcbic7XG4gIH1cbiAgLy9tYWtlIGEgbWFyZG93biBidWxsZXQtbGlzdFxuICBpZiAoc2VjdGlvbi5saXN0cyAmJiBvcHRpb25zLmxpc3RzID09PSB0cnVlKSB7XG4gICAgbWQgKz0gc2VjdGlvbi5saXN0cy5tYXAoKGxpc3QpID0+IGRvTGlzdChsaXN0LCBvcHRpb25zKSkuam9pbignXFxuJyk7XG4gICAgbWQgKz0gJ1xcbic7XG4gIH1cbiAgLy9maW5hbGx5LCB3cml0ZSB0aGUgc2VudGVuY2UgdGV4dC5cbiAgaWYgKHNlY3Rpb24uc2VudGVuY2VzICYmIG9wdGlvbnMuc2VudGVuY2VzID09PSB0cnVlKSB7XG4gICAgbWQgKz0gc2VjdGlvbi5zZW50ZW5jZXMubWFwKChzKSA9PiBkb1NlbnRlbmNlKHMsIG9wdGlvbnMpKS5qb2luKCcgJyk7XG4gIH1cbiAgcmV0dXJuIG1kO1xufTtcblxuY29uc3QgdG9NYXJrZG93biA9IGZ1bmN0aW9uKHN0ciwgb3B0aW9ucykge1xuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgb3B0aW9ucyk7XG4gIGxldCBkYXRhID0gcGFyc2Uoc3RyLCBvcHRpb25zKTtcbiAgbGV0IG1kID0gJyc7XG4gIC8vYWRkIHRoZSB0aXRsZSBvbiB0aGUgdG9wXG4gIC8vIGlmIChkYXRhLnRpdGxlKSB7XG4gIC8vICAgbWQgKz0gJyMgJyArIGRhdGEudGl0bGUgKyAnXFxuJztcbiAgLy8gfVxuICAvL3JlbmRlciBpbmZvYm94ZXMgKHVwIGF0IHRoZSB0b3ApXG4gIGlmIChvcHRpb25zLmluZm9ib3hlcyA9PT0gdHJ1ZSAmJiBkYXRhLmluZm9ib3hlcykge1xuICAgIG1kICs9IGRhdGEuaW5mb2JveGVzLm1hcChvID0+IGRvSW5mb2JveChvLCBvcHRpb25zKSkuam9pbignXFxuJyk7XG4gIH1cbiAgLy9yZW5kZXIgZWFjaCBzZWN0aW9uXG4gIG1kICs9IGRhdGEuc2VjdGlvbnMubWFwKHMgPT4gZG9TZWN0aW9uKHMsIG9wdGlvbnMpKS5qb2luKCdcXG5cXG4nKTtcbiAgcmV0dXJuIG1kO1xufTtcbm1vZHVsZS5leHBvcnRzID0gdG9NYXJrZG93bjtcbiIsImNvbnN0IGRvU2VudGVuY2UgPSByZXF1aXJlKCcuL3NlbnRlbmNlJyk7XG5jb25zdCBwYWQgPSByZXF1aXJlKCcuL3BhZCcpO1xuXG5jb25zdCBkb250RG8gPSB7XG4gIGltYWdlOiB0cnVlLFxuICBjYXB0aW9uOiB0cnVlXG59O1xuXG4vLyByZW5kZXIgYW4gaW5mb2JveCBhcyBhIHRhYmxlIHdpdGggdHdvIGNvbHVtbnMsIGtleSArIHZhbHVlXG5jb25zdCBkb0luZm9ib3ggPSBmdW5jdGlvbihvYmosIG9wdGlvbnMpIHtcbiAgbGV0IG1kID0gJ3wnICsgcGFkKCcnKSArICd8JyArIHBhZCgnJykgKyAnfFxcbic7XG4gIG1kICs9ICd8JyArIHBhZCgnLS0tJykgKyAnfCcgKyBwYWQoJy0tLScpICsgJ3xcXG4nO1xuICBPYmplY3Qua2V5cyhvYmouZGF0YSkuZm9yRWFjaCgoaykgPT4ge1xuICAgIGlmIChkb250RG9ba10gPT09IHRydWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGtleSA9ICcqKicgKyBrICsgJyoqJztcbiAgICBsZXQgdmFsID0gZG9TZW50ZW5jZShvYmouZGF0YVtrXSwgb3B0aW9ucyk7XG4gICAgbWQgKz0gJ3wnICsgcGFkKGtleSkgKyAnfCcgKyBwYWQodmFsKSArICcgfFxcbic7XG5cbiAgfSk7XG4gIHJldHVybiBtZDtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGRvSW5mb2JveDtcbiIsImNvbnN0IGNlbGxXaWR0aCA9IDE1O1xuLy9jZW50ZXItcGFkIGVhY2ggY2VsbCwgdG8gbWFrZSB0aGUgdGFibGUgbW9yZSBsZWdpYmxlXG5jb25zdCBwYWQgPSAoc3RyKSA9PiB7XG4gIHN0ciA9IHN0ciB8fCAnJztcbiAgbGV0IGRpZmYgPSBjZWxsV2lkdGggLSBzdHIubGVuZ3RoO1xuICBkaWZmID0gcGFyc2VJbnQoZGlmZiAvIDIsIDEwKTtcbiAgZm9yKGxldCBpID0gMDsgaSA8IGRpZmY7IGkgKz0gMSkge1xuICAgIHN0ciA9ICcgJyArIHN0ciArICcgJztcbiAgfVxuICByZXR1cm4gc3RyO1xufTtcbm1vZHVsZS5leHBvcnRzID0gcGFkO1xuIiwiY29uc3Qgc21hcnRSZXBsYWNlID0gcmVxdWlyZSgnLi4vbGliJykuc21hcnRSZXBsYWNlO1xuXG4vLyBhZGQgYFt0ZXh0XShocmVmKWAgdG8gdGhlIHRleHRcbmNvbnN0IGRvTGluayA9IGZ1bmN0aW9uKG1kLCBsaW5rKSB7XG4gIGxldCBocmVmID0gJyc7XG4gIC8vaWYgaXQncyBhbiBleHRlcm5hbCBsaW5rLCB3ZSBnb29kXG4gIGlmIChsaW5rLnNpdGUpIHtcbiAgICBocmVmID0gbGluay5zaXRlO1xuICB9IGVsc2Uge1xuICAgIC8vb3RoZXJ3aXNlLCBtYWtlIGl0IGEgcmVsYXRpdmUgaW50ZXJuYWwgbGlua1xuICAgIGhyZWYgPSBsaW5rLnBhZ2UgfHwgbGluay50ZXh0O1xuICAgIGhyZWYgPSAnLi8nICsgaHJlZi5yZXBsYWNlKC8gL2csICdfJyk7XG4gIH1cbiAgbGV0IG1kTGluayA9ICdbJyArIGxpbmsudGV4dCArICddKCcgKyBocmVmICsgJyknO1xuICBtZCA9IHNtYXJ0UmVwbGFjZShtZCwgbGluay50ZXh0LCBtZExpbmspO1xuICByZXR1cm4gbWQ7XG59O1xuXG4vL2NyZWF0ZSBsaW5rcywgYm9sZCwgaXRhbGljIGluIG1hcmtkb3duXG5jb25zdCBkb1NlbnRlbmNlID0gKHNlbnRlbmNlLCBvcHRpb25zKSA9PiB7XG4gIGxldCBtZCA9IHNlbnRlbmNlLnRleHQ7XG4gIC8vdHVybiBsaW5rcyBiYWNrIGludG8gbGlua3NcbiAgaWYgKHNlbnRlbmNlLmxpbmtzICYmIG9wdGlvbnMubGlua3MgPT09IHRydWUpIHtcbiAgICBzZW50ZW5jZS5saW5rcy5mb3JFYWNoKChsaW5rKSA9PiB7XG4gICAgICBtZCA9IGRvTGluayhtZCwgbGluayk7XG4gICAgfSk7XG4gIH1cbiAgLy90dXJuIGJvbGRzIGludG8gKipib2xkKipcbiAgaWYgKHNlbnRlbmNlLmZtdCAmJiBzZW50ZW5jZS5mbXQuYm9sZCkge1xuICAgIHNlbnRlbmNlLmZtdC5ib2xkLmZvckVhY2goKGIpID0+IHtcbiAgICAgIG1kID0gc21hcnRSZXBsYWNlKG1kLCBiLCAnKionICsgYiArICcqKicpO1xuICAgIH0pO1xuICB9XG4gIC8vc3VwcG9ydCAqaXRhbGljcypcbiAgaWYgKHNlbnRlbmNlLmZtdCAmJiBzZW50ZW5jZS5mbXQuaXRhbGljKSB7XG4gICAgc2VudGVuY2UuZm10Lml0YWxpYy5mb3JFYWNoKChpKSA9PiB7XG4gICAgICBtZCA9IHNtYXJ0UmVwbGFjZShtZCwgaSwgJyonICsgaSArICcqJyk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG1kO1xufTtcbm1vZHVsZS5leHBvcnRzID0gZG9TZW50ZW5jZTtcbiIsImNvbnN0IGRvU2VudGVuY2UgPSByZXF1aXJlKCcuL3NlbnRlbmNlJyk7XG5jb25zdCBwYWQgPSByZXF1aXJlKCcuL3BhZCcpO1xuLyogdGhpcyBpcyBhIG1hcmtkb3duIHRhYmxlOlxufCBUYWJsZXMgICAgICAgIHwgQXJlICAgICAgICAgICB8IENvb2wgIHxcbnwgLS0tLS0tLS0tLS0tLSB8Oi0tLS0tLS0tLS0tLS06fCAtLS0tLTp8XG58IGNvbCAzIGlzICAgICAgfCByaWdodC1hbGlnbmVkIHwgJDE2MDAgfFxufCBjb2wgMiBpcyAgICAgIHwgY2VudGVyZWQgICAgICB8ICAgJDEyIHxcbnwgemVicmEgc3RyaXBlcyB8IGFyZSBuZWF0ICAgICAgfCAgICAkMSB8XG4qL1xuXG5jb25zdCBtYWtlUm93ID0gKGFycikgPT4ge1xuICBhcnIgPSBhcnIubWFwKHBhZCk7XG4gIHJldHVybiAnfCAnICsgYXJyLmpvaW4oJyB8ICcpICsgJyB8Jztcbn07XG5cbi8vbWFya2Rvd24gdGFibGVzIGFyZSB3ZWlyZFxuY29uc3QgZG9UYWJsZSA9ICh0YWJsZSwgb3B0aW9ucykgPT4ge1xuICBsZXQgbWQgPSAnJztcbiAgaWYgKCF0YWJsZSB8fCB0YWJsZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbWQ7XG4gIH1cbiAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyh0YWJsZVswXSk7XG4gIC8vZmlyc3QsIGdyYWIgdGhlIGhlYWRlcnNcbiAgLy9yZW1vdmUgYXV0by1nZW5lcmF0ZWQgbnVtYmVyIGtleXNcbiAgbGV0IGhlYWRlciA9IGtleXMubWFwKChrLCBpKSA9PiB7XG4gICAgaWYgKHBhcnNlSW50KGssIDEwKSA9PT0gaSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICByZXR1cm4gaztcbiAgfSk7XG4gIC8vZHJhdyB0aGUgaGVhZGVyIChuZWNlc3NhcnkhKVxuICBtZCArPSBtYWtlUm93KGhlYWRlcikgKyAnXFxuJztcbiAgbWQgKz0gbWFrZVJvdyhbJy0tLScsICctLS0nLCAnLS0tJ10pICsgJ1xcbic7XG4gIC8vZG8gZWFjaCByb3cuLlxuICBtZCArPSB0YWJsZS5tYXAoKHJvdykgPT4ge1xuICAgIC8vZWFjaCBjb2x1bW4uLlxuICAgIGxldCBhcnIgPSBrZXlzLm1hcCgoaykgPT4ge1xuICAgICAgaWYgKCFyb3dba10pIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRvU2VudGVuY2Uocm93W2tdLCBvcHRpb25zKSB8fCAnJztcbiAgICB9KTtcbiAgICAvL21ha2UgaXQgYSBuaWNlIHBhZGRlZCByb3dcbiAgICByZXR1cm4gbWFrZVJvdyhhcnIpO1xuICB9KS5qb2luKCdcXG4nKTtcbiAgcmV0dXJuIG1kICsgJ1xcbic7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBkb1RhYmxlO1xuIiwiY29uc3QgaTE4biA9IHJlcXVpcmUoJy4uL2RhdGEvaTE4bicpO1xuY29uc3QgY2F0X3JlZyA9IG5ldyBSZWdFeHAoJ1xcXFxbXFxcXFs6PygnICsgaTE4bi5jYXRlZ29yaWVzLmpvaW4oJ3wnKSArICcpOiguezIsNjB9PyldXSh3ezAsMTB9KScsICdpZycpO1xuY29uc3QgY2F0X3JlbW92ZV9yZWcgPSBuZXcgUmVnRXhwKCdeXFxcXFtcXFxcWzo/KCcgKyBpMThuLmNhdGVnb3JpZXMuam9pbignfCcpICsgJyk6JywgJ2lnJyk7XG5cbmNvbnN0IHBhcnNlX2NhdGVnb3JpZXMgPSBmdW5jdGlvbihyLCB3aWtpKSB7XG4gIHIuY2F0ZWdvcmllcyA9IFtdO1xuICBsZXQgdG1wID0gd2lraS5tYXRjaChjYXRfcmVnKTsgLy9yZWd1bGFyIGxpbmtzXG4gIGlmICh0bXApIHtcbiAgICB0bXAuZm9yRWFjaChmdW5jdGlvbihjKSB7XG4gICAgICBjID0gYy5yZXBsYWNlKGNhdF9yZW1vdmVfcmVnLCAnJyk7XG4gICAgICBjID0gYy5yZXBsYWNlKC9cXHw/WyBcXCpdP1xcXVxcXSQvaSwgJycpOyAvL3BhcnNlIGZhbmN5IG9uY2VzLi5cbiAgICAgIGMgPSBjLnJlcGxhY2UoL1xcfC4qLywgJycpOyAvL2V2ZXJ5dGhpbmcgYWZ0ZXIgdGhlICd8JyBpcyBtZXRhZGF0YVxuICAgICAgaWYgKGMgJiYgIWMubWF0Y2goL1tcXFtcXF1dLykpIHtcbiAgICAgICAgci5jYXRlZ29yaWVzLnB1c2goYyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgd2lraSA9IHdpa2kucmVwbGFjZShjYXRfcmVnLCAnJyk7XG4gIHJldHVybiB3aWtpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gcGFyc2VfY2F0ZWdvcmllcztcbiIsImNvbnN0IHJlZGlyZWN0cyA9IHJlcXVpcmUoJy4vcGFnZS9yZWRpcmVjdHMnKTtcbmNvbnN0IGRpc2FtYmlnID0gcmVxdWlyZSgnLi9wYWdlL2Rpc2FtYmlnJyk7XG5jb25zdCBwcmVQcm9jZXNzID0gcmVxdWlyZSgnLi9wcmVQcm9jZXNzJyk7XG5jb25zdCBwb3N0UHJvY2VzcyA9IHJlcXVpcmUoJy4vcG9zdFByb2Nlc3MnKTtcbmNvbnN0IHBhcnNlID0ge1xuICBzZWN0aW9uOiByZXF1aXJlKCcuL3NlY3Rpb24nKSxcbiAgaW5mb2JveDogcmVxdWlyZSgnLi9pbmZvYm94JyksXG4gIGNhdGVnb3JpZXM6IHJlcXVpcmUoJy4vY2F0ZWdvcmllcycpXG59O1xuXG4vL2NvbnZlcnQgd2lraXNjcmlwdCBtYXJrdXAgbGFuZyB0byBqc29uXG5jb25zdCBtYWluID0gZnVuY3Rpb24od2lraSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgd2lraSA9IHdpa2kgfHwgJyc7XG4gIC8vZGV0ZWN0IGlmIHBhZ2UgaXMganVzdCByZWRpcmVjdCwgYW5kIHJldHVyblxuICBpZiAocmVkaXJlY3RzLmlzX3JlZGlyZWN0KHdpa2kpKSB7XG4gICAgcmV0dXJuIHJlZGlyZWN0cy5wYXJzZV9yZWRpcmVjdCh3aWtpKTtcbiAgfVxuICAvL2RldGVjdCBpZiBwYWdlIGlzIGp1c3QgZGlzYW1iaWd1YXRvciBwYWdlLCBhbmQgcmV0dXJuXG4gIGlmIChkaXNhbWJpZy5pc19kaXNhbWJpZyh3aWtpKSkge1xuICAgIHJldHVybiBkaXNhbWJpZy5wYXJzZV9kaXNhbWJpZyh3aWtpKTtcbiAgfVxuICBsZXQgciA9IHtcbiAgICB0eXBlOiAncGFnZScsXG4gICAgc2VjdGlvbnM6IFtdLFxuICAgIGluZm9ib3hlczogW10sXG4gICAgaW50ZXJ3aWtpOiB7fSxcbiAgICBjYXRlZ29yaWVzOiBbXSxcbiAgICBpbWFnZXM6IFtdLFxuICAgIGNvb3JkaW5hdGVzOiBbXSxcbiAgICBjaXRhdGlvbnM6IFtdXG4gIH07XG4gIGlmIChvcHRpb25zLmN1c3RvbSkge1xuICAgIHIuY3VzdG9tID0ge307XG4gIH1cbiAgaWYgKG9wdGlvbnMucGFnZV9pZGVudGlmaWVyKSB7XG4gICAgci5wYWdlX2lkZW50aWZpZXIgPSBvcHRpb25zLnBhZ2VfaWRlbnRpZmllcjtcbiAgfVxuICBpZiAob3B0aW9ucy5sYW5nX29yX3dpa2lpZCkge1xuICAgIHIubGFuZ19vcl93aWtpaWQgPSBvcHRpb25zLmxhbmdfb3Jfd2lraWlkO1xuICB9XG4gIC8vZ2l2ZSBvdXJzZWx2ZXMgYSBsaXR0bGUgaGVhZC1zdGFydFxuICB3aWtpID0gcHJlUHJvY2VzcyhyLCB3aWtpLCBvcHRpb25zKTtcbiAgLy9wdWxsLW91dCBpbmZvYm94ZXMgYW5kIHN0dWZmXG4gIHdpa2kgPSBwYXJzZS5pbmZvYm94KHIsIHdpa2ksIG9wdGlvbnMpO1xuICAvL3B1bGwtb3V0IFtbY2F0ZWdvcnk6d2hhdGV2ZXJzXV1cbiAgaWYgKG9wdGlvbnMuY2F0ZWdvcmllcyAhPT0gZmFsc2UpIHtcbiAgICB3aWtpID0gcGFyc2UuY2F0ZWdvcmllcyhyLCB3aWtpKTtcbiAgfVxuICAvL3BhcnNlIGFsbCB0aGUgaGVhZGluZ3MsIGFuZCB0aGVpciB0ZXh0cy9zZW50ZW5jZXNcbiAgci5zZWN0aW9ucyA9IHBhcnNlLnNlY3Rpb24ociwgd2lraSwgb3B0aW9ucykgfHwgW107XG5cbiAgciA9IHBvc3RQcm9jZXNzKHIpO1xuXG4gIHJldHVybiByO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBtYWluO1xuIiwiLy9cbmNvbnN0IHBhcnNlQ2l0YXRpb24gPSBmdW5jdGlvbihzdHIsIHdpa2ksIHIsIG9wdGlvbnMpIHtcbiAgLy9yZW1vdmUgaXQgZnJvbSBtYWluXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2Uoc3RyLCAnJyk7XG4gIGlmIChvcHRpb25zLmNpdGF0aW9ucyA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gd2lraTtcbiAgfVxuICAvL3RyaW0gc3RhcnQge3sgYW5kXG4gIC8vdHJpbSBlbmQgfX1cbiAgc3RyID0gc3RyLnJlcGxhY2UoL15cXHtcXHsgKj8vLCAnJyk7XG4gIHN0ciA9IHN0ci5yZXBsYWNlKC8gKj9cXH1cXH0gKj8kLywgJycpO1xuICAvL3N0YXJ0IHBhcnNpbmcgY2l0YXRpb24gaW50byBqc29uXG4gIGxldCBvYmogPSB7fTtcbiAgbGV0IGxpbmVzID0gc3RyLnNwbGl0KC9cXHwvZyk7XG4gIC8vZmlyc3QgbGluZSBpcyAnY2l0ZSB3ZWInXG4gIGxldCB0eXBlID0gbGluZXNbMF0ubWF0Y2goL2NpdGUgKFthLXpfXSspL2kpIHx8IFtdO1xuICBpZiAodHlwZVsxXSkge1xuICAgIG9iai5jaXRlID0gdHlwZVsxXSB8fCBudWxsO1xuICB9XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgbGluZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBsZXQgYXJyID0gbGluZXNbaV0uc3BsaXQoLz0vKTtcbiAgICBsZXQga2V5ID0gYXJyWzBdLnRyaW0oKTtcbiAgICBsZXQgdmFsID0gYXJyXG4gICAgICAuc2xpY2UoMSwgYXJyLmxlbmd0aClcbiAgICAgIC5qb2luKCc9JylcbiAgICAgIC50cmltKCk7XG4gICAgaWYgKGtleSAmJiB2YWwpIHtcbiAgICAgIC8vdHVybiBudW1iZXJzIGludG8gbnVtYmVyc1xuICAgICAgaWYgKC9eWzAtOS5dKyQvLnRlc3QodmFsKSkge1xuICAgICAgICB2YWwgPSBwYXJzZUZsb2F0KHZhbCk7XG4gICAgICB9XG4gICAgICBvYmpba2V5XSA9IHZhbDtcbiAgICB9XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID4gMCkge1xuICAgIHIuY2l0YXRpb25zLnB1c2gob2JqKTtcbiAgfVxuICByZXR1cm4gd2lraTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlQ2l0YXRpb247XG4iLCJjb25zdCBpMThuID0gcmVxdWlyZSgnLi4vLi4vZGF0YS9pMThuJyk7XG5jb25zdCBmaW5kUmVjdXJzaXZlID0gcmVxdWlyZSgnLi4vLi4vbGliL3JlY3Vyc2l2ZV9tYXRjaCcpO1xuY29uc3QgcGFyc2VJbmZvYm94ID0gcmVxdWlyZSgnLi9pbmZvYm94Jyk7XG5jb25zdCBwYXJzZUNpdGF0aW9uID0gcmVxdWlyZSgnLi9jaXRhdGlvbicpO1xuY29uc3Qga2VlcCA9IHJlcXVpcmUoJy4uL3NlY3Rpb24vc2VudGVuY2UvdGVtcGxhdGVzL3RlbXBsYXRlcycpOyAvL2RvbnQgcmVtb3ZlIHRoZXNlIG9uZXNcbmNvbnN0IGluZm9ib3hfcmVnID0gbmV3IFJlZ0V4cCgne3soJyArIGkxOG4uaW5mb2JveGVzLmpvaW4oJ3wnKSArICcpWzogXFxuXScsICdpZycpO1xuXG4vL3JlZHVjZSB0aGUgc2NhcnkgcmVjdXJzaXZlIHNpdHVhdGlvbnNcbmNvbnN0IHBhcnNlX3JlY3Vyc2l2ZSA9IGZ1bmN0aW9uKHIsIHdpa2ksIG9wdGlvbnMpIHtcbiAgLy9yZW1vdmUge3t0ZW1wbGF0ZSB7e319IH19IHJlY3Vyc2lvbnNcbiAgci5pbmZvYm94ZXMgPSBbXTtcbiAgbGV0IG1hdGNoZXMgPSBmaW5kUmVjdXJzaXZlKCd7JywgJ30nLCB3aWtpKS5maWx0ZXIocyA9PiBzWzBdICYmIHNbMV0gJiYgc1swXSA9PT0gJ3snICYmIHNbMV0gPT09ICd7Jyk7XG4gIG1hdGNoZXMuZm9yRWFjaChmdW5jdGlvbih0bXBsKSB7XG4gICAgaWYgKHRtcGwubWF0Y2goaW5mb2JveF9yZWcsICdpZycpKSB7XG4gICAgICBpZiAob3B0aW9ucy5pbmZvYm94ZXMgIT09IGZhbHNlKSB7XG4gICAgICAgIGxldCBpbmZvYm94ID0gcGFyc2VJbmZvYm94KHRtcGwpO1xuICAgICAgICByLmluZm9ib3hlcy5wdXNoKGluZm9ib3gpO1xuICAgICAgfVxuICAgICAgd2lraSA9IHdpa2kucmVwbGFjZSh0bXBsLCAnJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8va2VlcCB0aGVzZSBvbmVzLCB3ZSdsbCBwYXJzZSB0aGVtIGxhdGVyXG4gICAgbGV0IG5hbWUgPSB0bXBsLm1hdGNoKC9eXFx7XFx7KFteOnxcXG4gXSspLyk7XG4gICAgaWYgKG5hbWUgIT09IG51bGwpIHtcbiAgICAgIG5hbWUgPSBuYW1lWzFdLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICBpZiAoL15cXHtcXHsgP2NpdGF0aW9uIG5lZWRlZC9pLnRlc3QodG1wbCkgPT09IHRydWUpIHtcbiAgICAgICAgbmFtZSA9ICdjaXRhdGlvbiBuZWVkZWQnO1xuICAgICAgfVxuICAgICAgLy9wYXJzZSB7e2NpdGUgd2ViIC4uLn19IChpdCBhcHBlYXJzIGV2ZXJ5IGxhbmd1YWdlKVxuICAgICAgaWYgKG5hbWUgPT09ICdjaXRlJyB8fCBuYW1lID09PSAnY2l0YXRpb24nKSB7XG4gICAgICAgIHdpa2kgPSBwYXJzZUNpdGF0aW9uKHRtcGwsIHdpa2ksIHIsIG9wdGlvbnMpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vc29ydGEta2VlcCBub3dyYXAgdGVtcGxhdGVcbiAgICAgIGlmIChuYW1lID09PSAnbm93cmFwJykge1xuICAgICAgICBsZXQgaW5zaWRlID0gdG1wbC5tYXRjaCgvXlxce1xce25vd3JhcCAqP1xcfCguKj8pXFx9XFx9JC8pO1xuICAgICAgICBpZiAoaW5zaWRlKSB7XG4gICAgICAgICAgd2lraSA9IHdpa2kucmVwbGFjZSh0bXBsLCBpbnNpZGVbMV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoa2VlcC5oYXNPd25Qcm9wZXJ0eShuYW1lKSA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIC8vbGV0IGV2ZXJ5Ym9keSBhZGQgYSBjdXN0b20gcGFyc2VyIGZvciB0aGlzIHRlbXBsYXRlXG4gICAgaWYgKG9wdGlvbnMuY3VzdG9tKSB7XG4gICAgICBPYmplY3Qua2V5cyhvcHRpb25zLmN1c3RvbSkuZm9yRWFjaChrID0+IHtcbiAgICAgICAgbGV0IHZhbCA9IG9wdGlvbnMuY3VzdG9tW2tdKHRtcGwsIHdpa2kpO1xuICAgICAgICBpZiAodmFsIHx8IHZhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAvL2RvbnQgc3RvcmUgYWxsIHRoZSBudWxsc1xuICAgICAgICAgIHIuY3VzdG9tW2tdID0gci5jdXN0b21ba10gfHwgW107XG4gICAgICAgICAgci5jdXN0b21ba10ucHVzaCh2YWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy9pZiBpdCdzIG5vdCBhIGtub3duIHRlbXBsYXRlLCBidXQgaXQncyByZWN1cnNpdmUsIHJlbW92ZSBpdFxuICAgIC8vKGJlY2F1c2UgaXQgd2lsbCBiZSBtaXNyZWFkIGxhdGVyLW9uKVxuICAgIHdpa2kgPSB3aWtpLnJlcGxhY2UodG1wbCwgJycpO1xuICB9KTtcbiAgLy8gLy9vaywgbm93IHRoYXQgdGhlIHNjYXJ5IHJlY3Vyc2lvbiBpc3N1ZXMgYXJlIGdvbmUsIHdlIGNhbiB0cnVzdCBzaW1wbGUgcmVnZXggbWV0aG9kcy4uXG4gIC8vIC8va2lsbCB0aGUgcmVzdCBvZiB0ZW1wbGF0ZXNcbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvXFx7XFx7ICo/KF4obWFpbnx3aWRlKSkuKj9cXH1cXH0vZywgJycpO1xuICByZXR1cm4gd2lraTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VfcmVjdXJzaXZlO1xuIiwiY29uc3QgdHJpbSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9oZWxwZXJzJykudHJpbV93aGl0ZXNwYWNlO1xuY29uc3QgcGFyc2VMaW5lID0gcmVxdWlyZSgnLi4vc2VjdGlvbi9zZW50ZW5jZScpLnBhcnNlTGluZTtcbmNvbnN0IGZpbmRSZWN1cnNpdmUgPSByZXF1aXJlKCcuLi8uLi9saWIvcmVjdXJzaXZlX21hdGNoJyk7XG5jb25zdCBpMThuID0gcmVxdWlyZSgnLi4vLi4vZGF0YS9pMThuJyk7XG5jb25zdCBpbmZvYm94X3RlbXBsYXRlX3JlZyA9IG5ldyBSZWdFeHAoJ3t7KD86JyArIGkxOG4uaW5mb2JveGVzLmpvaW4oJ3wnKSArICcpXFxcXHMqKC4qKScsICdpJyk7XG5cbmNvbnN0IGdldFRlbXBsYXRlID0gZnVuY3Rpb24oc3RyKSB7XG4gIGxldCBtID0gc3RyLm1hdGNoKGluZm9ib3hfdGVtcGxhdGVfcmVnKTtcbiAgaWYgKG0gJiYgbVsxXSkge1xuICAgIHJldHVybiBtWzFdO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuY29uc3QgcGFyc2VfaW5mb2JveCA9IGZ1bmN0aW9uKHN0cikge1xuICBpZiAoIXN0cikge1xuICAgIHJldHVybiB7fTtcbiAgfVxuICBsZXQgc3RyaW5nQnVpbGRlciA9IFtdO1xuICBsZXQgbGFzdENoYXI7XG4gIC8vdGhpcyBjb2xsYXBzaWJsZSBsaXN0IHN0dWZmIGlzIGp1c3QgYSBoZWFkYWNoZVxuICBsZXQgbGlzdFJlZyA9IC9cXHtcXHsgPyhjb2xsYXBzaWJsZXxobGlzdHx1Ymxpc3R8cGxhaW5saXN0fFVuYnVsbGV0ZWQgbGlzdHxmbGF0bGlzdCkvaTtcbiAgaWYgKGxpc3RSZWcudGVzdChzdHIpKSB7XG4gICAgbGV0IGxpc3QgPSBmaW5kUmVjdXJzaXZlKCd7JywgJ30nLCBzdHIuc3Vic3RyKDIsIHN0ci5sZW5ndGggLSAyKSkuZmlsdGVyKChmKSA9PiBsaXN0UmVnLnRlc3QoZikpO1xuICAgIHN0ciA9IHN0ci5yZXBsYWNlKGxpc3RbMF0sICcnKTtcbiAgfVxuXG4gIGNvbnN0IHRlbXBsYXRlID0gZ2V0VGVtcGxhdGUoc3RyKTsgLy9nZXQgdGhlIGluZm9ib3ggbmFtZVxuXG4gIGxldCBwYXJEZXB0aCA9IC0yOyAvLyBmaXJzdCB0d28ge3tcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHN0ci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChwYXJEZXB0aCA9PT0gMCAmJiBzdHJbaV0gPT09ICd8JyAmJiBsYXN0Q2hhciAhPT0gJ1xcbicpIHtcbiAgICAgIHN0cmluZ0J1aWxkZXIucHVzaCgnXFxuJyk7XG4gICAgfVxuICAgIGlmIChzdHJbaV0gPT09ICd7JyB8fCBzdHJbaV0gPT09ICdbJykge1xuICAgICAgcGFyRGVwdGgrKztcbiAgICB9IGVsc2UgaWYgKHN0cltpXSA9PT0gJ30nIHx8IHN0cltpXSA9PT0gJ10nKSB7XG4gICAgICBwYXJEZXB0aC0tO1xuICAgIH1cbiAgICBsYXN0Q2hhciA9IHN0cltpXTtcbiAgICBzdHJpbmdCdWlsZGVyLnB1c2gobGFzdENoYXIpO1xuICB9XG5cbiAgc3RyID0gc3RyaW5nQnVpbGRlci5qb2luKCcnKTtcbiAgLy9yZW1vdmUgdG9wK2JvdHRvbVxuICBzdHIgPSBzdHIucmVwbGFjZSgvXiAqP1xce1xcey4rW3xcXG5dLywgJycpO1xuICBzdHIgPSBzdHIucmVwbGFjZSgvXFx9XFx9ICo/JC8sICcnKTtcbiAgbGV0IGxpbmVzID0gc3RyLnNwbGl0KC9cXG5cXCo/Lyk7XG5cbiAgbGV0IG9iaiA9IHt9O1xuICBsZXQga2V5ID0gbnVsbDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBsID0gbGluZXNbaV07XG4gICAgbGV0IGtleU1hdGNoID0gbC5tYXRjaCgvXFx8ICo/KFtePV0rKT0oLispPy9pKTtcbiAgICBpZiAoa2V5TWF0Y2ggJiYga2V5TWF0Y2hbMV0pIHtcbiAgICAgIGtleSA9IHRyaW0oa2V5TWF0Y2hbMV0pO1xuICAgICAgaWYgKGtleU1hdGNoWzJdKSB7XG4gICAgICAgIG9ialtrZXldID0gdHJpbShrZXlNYXRjaFsyXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmpba2V5XSA9ICcnO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoa2V5KSB7XG4gICAgICBvYmpba2V5XSArPSBsO1xuICAgIH1cbiAgfVxuICAvL3Bvc3QtcHJvY2VzcyB2YWx1ZXNcbiAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGsgPT4ge1xuICAgIGlmICghb2JqW2tdKSB7XG4gICAgICBkZWxldGUgb2JqW2tdO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvYmpba10gPSBwYXJzZUxpbmUob2JqW2tdKTtcbiAgICBpZiAob2JqW2tdLnRleHQgJiYgb2JqW2tdLnRleHQubWF0Y2goL15bMC05LF0qJC8pKSB7XG4gICAgICBvYmpba10udGV4dCA9IG9ialtrXS50ZXh0LnJlcGxhY2UoLywvLCAnJyk7XG4gICAgICBvYmpba10udGV4dCA9IHBhcnNlSW50KG9ialtrXS50ZXh0LCAxMCk7XG4gICAgfVxuICB9KTtcbiAgLy8gLy9yZW1vdmUgdG9wK2JvdHRvbVxuICAvLyBpZihsaW5lcy5sZW5ndGg+MSAmJiBsaW5lc1swXS5tYXRjaCgpXG4gIC8vIGNvbnNvbGUubG9nKHJlZ2V4TWF0Y2gpO1xuICAvLyBjb25zb2xlLmxvZygnXFxuXFxuXFxuJyk7XG4gIC8vIHdoaWxlICgocmVnZXhNYXRjaCA9IGxpbmVfcmVnLmV4ZWMoc3RyKSkgIT09IG51bGwpIHtcbiAgLy8gICAvLyBjb25zb2xlLmxvZyhzdHIgKyAnLS0tLScpO1xuICAvLyAgIGxldCBrZXkgPSBoZWxwZXJzLnRyaW1fd2hpdGVzcGFjZShyZWdleE1hdGNoWzFdIHx8ICcnKSB8fCAnJztcbiAgLy8gICBsZXQgdmFsdWUgPSBoZWxwZXJzLnRyaW1fd2hpdGVzcGFjZShyZWdleE1hdGNoWzJdIHx8ICcnKSB8fCAnJztcbiAgLy9cbiAgLy8gICAvL3RoaXMgaXMgbmVjZXNzYXJ5IGZvciBtb25nb2RiLCBpbSBzb3JyeVxuICAvLyAgIGtleSA9IGtleS5yZXBsYWNlKC9cXC4vLCAnJyk7XG4gIC8vICAgaWYgKGtleSAmJiB2YWx1ZSkge1xuICAvLyAgICAgb2JqW2tleV0gPSBwYXJzZV9saW5lKHZhbHVlKTtcbiAgLy8gICAgIC8vdHVybiBudW1iZXIgc3RyaW5ncyBpbnRvIGludGVnZXJzXG4gIC8vICAgICBpZiAob2JqW2tleV0udGV4dCAmJiBvYmpba2V5XS50ZXh0Lm1hdGNoKC9eWzAtOSxdKiQvKSkge1xuICAvLyAgICAgICBvYmpba2V5XS50ZXh0ID0gb2JqW2tleV0udGV4dC5yZXBsYWNlKC8sLywgJycpO1xuICAvLyAgICAgICBvYmpba2V5XS50ZXh0ID0gcGFyc2VJbnQob2JqW2tleV0udGV4dCwgMTApO1xuICAvLyAgICAgfVxuICAvLyAgIH1cbiAgLy8gfVxuICByZXR1cm4ge1xuICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZSxcbiAgICBkYXRhOiBvYmpcbiAgfTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlX2luZm9ib3g7XG4iLCJjb25zdCBpMThuID0gcmVxdWlyZSgnLi4vLi4vZGF0YS9pMThuJyk7XG5jb25zdCBwYXJzZV9saW5rcyA9IHJlcXVpcmUoJy4uL3NlY3Rpb24vc2VudGVuY2UvbGlua3MnKTtcbmNvbnN0IHRlbXBsYXRlX3JlZyA9IG5ldyBSZWdFeHAoJ1xcXFx7XFxcXHsgPygnICsgaTE4bi5kaXNhbWJpZ3Muam9pbignfCcpICsgJykoXFxcXHxbYS16ID1dKj8pPyA/XFxcXH1cXFxcfScsICdpJyk7XG5cbmNvbnN0IGlzX2Rpc2FtYmlnID0gZnVuY3Rpb24od2lraSkge1xuICByZXR1cm4gdGVtcGxhdGVfcmVnLnRlc3Qod2lraSk7XG59O1xuXG4vL3JldHVybiBhIGxpc3Qgb2YgcHJvYmFibGUgcGFnZXMgZm9yIHRoaXMgZGlzYW1iaWcgcGFnZVxuY29uc3QgcGFyc2VfZGlzYW1iaWcgPSBmdW5jdGlvbih3aWtpKSB7XG4gIGxldCBwYWdlcyA9IFtdO1xuICBsZXQgbGluZXMgPSB3aWtpLnJlcGxhY2UoL1xcci9nLCAnJykuc3BsaXQoL1xcbi8pO1xuICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKHN0cikge1xuICAgIC8vaWYgdGhlcmUncyBhbiBlYXJseSBsaW5rIGluIHRoZSBsaXN0XG4gICAgaWYgKHN0ci5tYXRjaCgvXlxcKi57MCw0MH1cXFtcXFsuKlxcXVxcXS8pKSB7XG4gICAgICBsZXQgbGlua3MgPSBwYXJzZV9saW5rcyhzdHIpO1xuICAgICAgaWYgKGxpbmtzICYmIGxpbmtzWzBdICYmIGxpbmtzWzBdLnBhZ2UpIHtcbiAgICAgICAgcGFnZXMucHVzaChsaW5rc1swXS5wYWdlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdkaXNhbWJpZ3VhdGlvbicsXG4gICAgcGFnZXM6IHBhZ2VzXG4gIH07XG59O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzX2Rpc2FtYmlnOiBpc19kaXNhbWJpZyxcbiAgcGFyc2VfZGlzYW1iaWc6IHBhcnNlX2Rpc2FtYmlnXG59O1xuIiwiY29uc3QgaTE4biA9IHJlcXVpcmUoJy4uLy4uL2RhdGEvaTE4bicpO1xuLy9wdWxscyB0YXJnZXQgbGluayBvdXQgb2YgcmVkaXJlY3QgcGFnZVxuY29uc3QgUkVESVJFQ1RfUkVHRVggPSBuZXcgUmVnRXhwKCdeWyBcXG5cXHRdKj8jKCcgKyBpMThuLnJlZGlyZWN0cy5qb2luKCd8JykgKyAnKSAqP1xcXFxbXFxcXFsoLnsyLDYwfT8pXFxcXF1cXFxcXScsICdpJyk7XG5cbmNvbnN0IGlzX3JlZGlyZWN0ID0gZnVuY3Rpb24od2lraSkge1xuICByZXR1cm4gd2lraS5tYXRjaChSRURJUkVDVF9SRUdFWCk7XG59O1xuXG5jb25zdCBwYXJzZV9yZWRpcmVjdCA9IGZ1bmN0aW9uKHdpa2kpIHtcbiAgbGV0IGFydGljbGUgPSAod2lraS5tYXRjaChSRURJUkVDVF9SRUdFWCkgfHwgW10pWzJdIHx8ICcnO1xuICBhcnRpY2xlID0gYXJ0aWNsZS5yZXBsYWNlKC8jLiovLCAnJyk7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ3JlZGlyZWN0JyxcbiAgICByZWRpcmVjdDogYXJ0aWNsZVxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzX3JlZGlyZWN0OiBpc19yZWRpcmVjdCxcbiAgcGFyc2VfcmVkaXJlY3Q6IHBhcnNlX3JlZGlyZWN0XG59O1xuIiwiY29uc3QgaTE4biA9IHJlcXVpcmUoJy4uLy4uL2RhdGEvaTE4bicpO1xuY29uc3QgcGFyc2VJbWFnZSA9IHJlcXVpcmUoJy4uL3NlY3Rpb24vaW1hZ2UvaW1hZ2UnKTtcbmNvbnN0IGltZ19yZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIGkxOG4uaW1hZ2VzLmNvbmNhdChpMThuLmZpbGVzKS5qb2luKCd8JykgKyAnKScsICdpJyk7XG5cbi8vY2xlYW51cCBhZnRlciBvdXJzZWx2ZXNcbmNvbnN0IHBvc3RQcm9jZXNzID0gZnVuY3Rpb24ocikge1xuICAvLyBhZGQgaW1hZ2UgZnJvbSBpbmZvYm94LCBpZiBhcHBsaWNhYmxlXG4gIGlmIChyLmluZm9ib3hlc1swXSAmJiByLmluZm9ib3hlc1swXS5kYXRhICYmIHIuaW5mb2JveGVzWzBdLmRhdGFbJ2ltYWdlJ10gJiYgci5pbmZvYm94ZXNbMF0uZGF0YVsnaW1hZ2UnXS50ZXh0KSB7XG4gICAgbGV0IGltZyA9IHIuaW5mb2JveGVzWzBdLmRhdGFbJ2ltYWdlJ10udGV4dCB8fCAnJztcbiAgICBpZiAoaW1nICYmIHR5cGVvZiBpbWcgPT09ICdzdHJpbmcnICYmICFpbWcubWF0Y2goaW1nX3JlZ2V4KSkge1xuICAgICAgaW1nID0gJ1tbRmlsZTonICsgaW1nICsgJ11dJztcbiAgICAgIGltZyA9IHBhcnNlSW1hZ2UoaW1nKTtcbiAgICAgIHIuaW1hZ2VzLnB1c2goaW1nKTtcbiAgICB9XG4gIH1cbiAgLy9sb29wIGFyb3VuZCBhbmQgYWRkIHRoZSBvdGhlciBpbWFnZXNcbiAgci5zZWN0aW9ucy5mb3JFYWNoKHMgPT4ge1xuICAgIC8vaW1hZ2UgZnJvbSB7e3dpZGUgaW1hZ2V8Li4ufX0gdGVtcGxhdGVcbiAgICBpZiAocy50ZW1wbGF0ZXMgJiYgcy50ZW1wbGF0ZXMud2lkZV9pbWFnZSkge1xuICAgICAgbGV0IGltZyA9IHMudGVtcGxhdGVzLndpZGVfaW1hZ2VbMF07XG4gICAgICBpbWcgPSAnW1tGaWxlOicgKyBpbWcgKyAnXV0nO1xuICAgICAgaW1nID0gcGFyc2VJbWFnZShpbWcpO1xuICAgICAgci5pbWFnZXMucHVzaChpbWcpO1xuICAgIH1cbiAgICBpZiAocy5pbWFnZXMpIHtcbiAgICAgIHMuaW1hZ2VzLmZvckVhY2goaW1nID0+IHIuaW1hZ2VzLnB1c2goaW1nKSk7XG4gICAgfVxuICB9KTtcblxuICAvL3RyeSB0byBndWVzcyB0aGUgcGFnZSdzIHRpdGxlIChmcm9tIHRoZSBib2xkIGZpcnN0LWxpbmUpXG4gIGlmIChyLnNlY3Rpb25zWzBdICYmIHIuc2VjdGlvbnNbMF0uc2VudGVuY2VzWzBdKSB7XG4gICAgbGV0IHMgPSByLnNlY3Rpb25zWzBdLnNlbnRlbmNlc1swXTtcbiAgICBpZiAocy5mbXQgJiYgcy5mbXQuYm9sZCAmJiBzLmZtdC5ib2xkWzBdKSB7XG4gICAgICByLnRpdGxlID0gci50aXRsZSB8fCBzLmZtdC5ib2xkWzBdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHBvc3RQcm9jZXNzO1xuIiwiY29uc3QgY29udmVydEdlbyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9jb252ZXJ0R2VvJyk7XG4vLyB7e2Nvb3JkfGxhdGl0dWRlfGxvbmdpdHVkZXxjb29yZGluYXRlIHBhcmFtZXRlcnN8dGVtcGxhdGUgcGFyYW1ldGVyc319XG4vLyB7e2Nvb3JkfGRkfE4vU3xkZHxFL1d8Y29vcmRpbmF0ZSBwYXJhbWV0ZXJzfHRlbXBsYXRlIHBhcmFtZXRlcnN9fVxuLy8ge3tjb29yZHxkZHxtbXxOL1N8ZGR8bW18RS9XfGNvb3JkaW5hdGUgcGFyYW1ldGVyc3x0ZW1wbGF0ZSBwYXJhbWV0ZXJzfX1cbi8vIHt7Y29vcmR8ZGR8bW18c3N8Ti9TfGRkfG1tfHNzfEUvV3xjb29yZGluYXRlIHBhcmFtZXRlcnN8dGVtcGxhdGUgcGFyYW1ldGVyc319XG5cbmNvbnN0IGhlbWlzcGhlcmVzID0ge1xuICBuOiB0cnVlLFxuICBzOiB0cnVlLFxuICB3OiB0cnVlLFxuICBlOiB0cnVlLFxufTtcblxuY29uc3Qgcm91bmQgPSBmdW5jdGlvbihudW0pIHtcbiAgaWYgKHR5cGVvZiBudW0gIT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIG51bTtcbiAgfVxuICBsZXQgcGxhY2VzID0gMTAwMDAwO1xuICByZXR1cm4gTWF0aC5yb3VuZChudW0gKiBwbGFjZXMpIC8gcGxhY2VzO1xufTtcblxuY29uc3QgcGFyc2VDb29yZCA9IGZ1bmN0aW9uKHN0cikge1xuICBsZXQgb2JqID0ge1xuICAgIGxhdDogbnVsbCxcbiAgICBsb246IG51bGxcbiAgfTtcbiAgbGV0IGFyciA9IHN0ci5zcGxpdCgnfCcpO1xuICAvL3R1cm4gbnVtYmVycyBpbnRvIG51bWJlcnMsIG5vcm1hbGl6ZSBOL3NcbiAgbGV0IG51bXMgPSBbXTtcbiAgZm9yKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGxldCBzID0gYXJyW2ldLnRyaW0oKTtcbiAgICAvL21ha2UgaXQgYSBudW1iZXJcbiAgICBsZXQgbnVtID0gcGFyc2VGbG9hdChzKTtcbiAgICBpZiAobnVtIHx8IG51bSA9PT0gMCkge1xuICAgICAgYXJyW2ldID0gbnVtO1xuICAgICAgbnVtcy5wdXNoKG51bSk7XG4gICAgfSBlbHNlIGlmIChzLm1hdGNoKC9ecmVnaW9uOi9pKSkge1xuICAgICAgb2JqLnJlZ2lvbiA9IHMucmVwbGFjZSgvXnJlZ2lvbjovaSwgJycpO1xuICAgICAgY29udGludWU7XG4gICAgfSBlbHNlIGlmIChzLm1hdGNoKC9ebm90ZXM6L2kpKSB7XG4gICAgICBvYmoubm90ZXMgPSBzLnJlcGxhY2UoL15ub3RlczovaSwgJycpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIC8vRE1TLWZvcm1hdFxuICAgIGlmIChoZW1pc3BoZXJlc1tzLnRvTG93ZXJDYXNlKCldKSB7XG4gICAgICBpZiAob2JqLmxhdCAhPT0gbnVsbCkge1xuICAgICAgICBudW1zLnB1c2gocyk7XG4gICAgICAgIG9iai5sb24gPSBjb252ZXJ0R2VvKG51bXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbnVtcy5wdXNoKHMpO1xuICAgICAgICBvYmoubGF0ID0gY29udmVydEdlbyhudW1zKTtcbiAgICAgICAgYXJyID0gYXJyLnNsaWNlKGksIGFyci5sZW5ndGgpO1xuICAgICAgICBudW1zID0gW107XG4gICAgICAgIGkgPSAwO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvL3RoaXMgaXMgYW4gb3JpZ2luYWwgYGxhdHxsb25gIGZvcm1hdFxuICBpZiAoIW9iai5sb24gJiYgbnVtcy5sZW5ndGggPT09IDIpIHtcbiAgICBvYmoubGF0ID0gbnVtc1swXTtcbiAgICBvYmoubG9uID0gbnVtc1sxXTtcbiAgfVxuICBvYmoubGF0ID0gcm91bmQob2JqLmxhdCk7XG4gIG9iai5sb24gPSByb3VuZChvYmoubG9uKTtcbiAgcmV0dXJuIG9iajtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlQ29vcmQ7XG4iLCJjb25zdCBraWxsX3htbCA9IHJlcXVpcmUoJy4va2lsbF94bWwnKTtcbmNvbnN0IHdvcmRUZW1wbGF0ZXMgPSByZXF1aXJlKCcuL3dvcmRfdGVtcGxhdGVzJyk7XG5cbi8vdGhpcyBtb3N0bHktZm9ybWF0dGluZyBzdHVmZiBjYW4gYmUgY2xlYW5lZC11cCBmaXJzdCwgdG8gbWFrZSBsaWZlIGVhc2llclxuZnVuY3Rpb24gcHJlUHJvY2VzcyhyLCB3aWtpLCBvcHRpb25zKSB7XG4gIC8vcmVtb3ZlIGNvbW1lbnRzXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLzwhLS1bXj5dezAsMjAwMH0tLT4vZywgJycpO1xuICB3aWtpID0gd2lraS5yZXBsYWNlKC9fXyhOT1RPQ3xOT0VESVRTRUNUSU9OfEZPUkNFVE9DfFRPQylfXy9naSwgJycpO1xuICAvL3NpZ25pdHVyZXNcbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvfn57MSwzfS8sICcnKTtcbiAgLy93aW5kb3dzIG5ld2xpbmVzXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoL1xcci9nLCAnJyk7XG4gIC8vaG9yaXpvbnRhbCBydWxlXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLy0tezEsM30vLCAnJyk7XG4gIC8vc3BhY2VcbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvJm5ic3A7L2csICcgJyk7XG4gIC8va2lsbCBvZmYgaW50ZXJ3aWtpIGxpbmtzXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoL1xcW1xcWyhbYS16XVthLXpdfHNpbXBsZXx3YXJ8Y2VifG1pbik6LnsyLDYwfVxcXVxcXS9pLCAnJyk7XG4gIC8vIHRoZXNlICd7e159fScgdGhpbmdzIGFyZSBudXRzLCBhbmQgdXNlZCBhcyBzb21lIGlsaWNpdCBzcGFjaW5nIHRoaW5nLlxuICB3aWtpID0gd2lraS5yZXBsYWNlKC9cXHtcXHtcXF5cXH1cXH0vZywgJycpO1xuICAvL2V4cGFuZCBpbmxpbmUgdGVtcGxhdGVzIGxpa2Uge3tkYXRlfX1cbiAgd2lraSA9IHdvcmRUZW1wbGF0ZXMod2lraSwgcik7XG4gIC8vZ2l2ZSBpdCB0aGUgaW5nbG9yaW91cyBzZW5kLW9mZiBpdCBkZXNlcnZlcy4uXG4gIHdpa2kgPSBraWxsX3htbCh3aWtpLCByLCBvcHRpb25zKTtcbiAgLy8oe3t0ZW1wbGF0ZX19LHt7dGVtcGxhdGV9fSkgbGVhdmVzIGVtcHR5IHBhcmVudGhlc2VzXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoL1xcKCBcXCkvZywgJycpO1xuICByZXR1cm4gd2lraTtcbn1cbm1vZHVsZS5leHBvcnRzID0gcHJlUHJvY2Vzcztcbi8vIGNvbnNvbGUubG9nKHByZVByb2Nlc3MoXCJoaSBbW2FzOlBsYW5jdG9uXV0gdGhlcmVcIikpO1xuLy8gY29uc29sZS5sb2cocHJlUHJvY2VzcygnaGVsbG8gPGJyLz4gd29ybGQnKSlcbi8vIGNvbnNvbGUubG9nKHByZVByb2Nlc3MoXCJoZWxsbyA8YXNkIGY+IHdvcmxkIDwvaDI+XCIpKVxuIiwiY29uc3QgcGFyc2VDaXRhdGlvbiA9IHJlcXVpcmUoJy4uL2luZm9ib3gvY2l0YXRpb24nKTtcbmNvbnN0IHBhcnNlTGluZSA9IHJlcXVpcmUoJy4uL3NlY3Rpb24vc2VudGVuY2UnKS5wYXJzZUxpbmU7XG4vL29rYXksIGkga25vdyB5b3UncmUgbm90IHN1cHBvc2VkIHRvIHJlZ2V4IGh0bWwsIGJ1dC4uLlxuLy9odHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9IZWxwOkhUTUxfaW5fd2lraXRleHRcblxuY29uc3QgaGFzQ2l0YXRpb24gPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIC9eICo/XFx7XFx7ICo/KGNpdGV8Y2l0YXRpb24pL2kudGVzdChzdHIpICYmIC9cXH1cXH0gKj8kLy50ZXN0KHN0cikgJiYgL2NpdGF0aW9uIG5lZWRlZC9pLnRlc3Qoc3RyKSA9PT0gZmFsc2U7XG59O1xuLy9oYW5kbGUgdW5zdHJ1Y3R1cmVkIG9uZXMgLSA8cmVmPnNvbWUgdGV4dDwvcmVmPlxuY29uc3QgcGFyc2VJbmxpbmUgPSBmdW5jdGlvbihzdHIsIHIsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMuY2l0YXRpb25zID09PSBmYWxzZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgb2JqID0gcGFyc2VMaW5lKHN0cikgfHwge307XG4gIGxldCBjaXRlID0ge1xuICAgIGNpdGU6ICdpbmxpbmUnLFxuICAgIHRleHQ6IG9iai50ZXh0XG4gIH07XG4gIGlmIChvYmoubGlua3MgJiYgb2JqLmxpbmtzLmxlbmd0aCkge1xuICAgIGxldCBleHRlcm4gPSBvYmoubGlua3MuZmluZChmID0+IGYuc2l0ZSk7XG4gICAgaWYgKGV4dGVybikge1xuICAgICAgY2l0ZS51cmwgPSBleHRlcm4uc2l0ZTtcbiAgICB9XG4gIH1cbiAgci5jaXRhdGlvbnMucHVzaChjaXRlKTtcbn07XG5cbmNvbnN0IGtpbGxfeG1sID0gZnVuY3Rpb24od2lraSwgciwgb3B0aW9ucykge1xuICAvL2x1Y2tpbHksIHJlZnMgY2FuJ3QgYmUgcmVjdXJzaXZlLi5cbiAgLy8gPHJlZj48L3JlZj5cbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvID88cmVmPihbXFxzXFxTXXswLDc1MH0/KTxcXC9yZWY+ID8vZ2ksIGZ1bmN0aW9uKGEsIHRtcGwpIHtcbiAgICBpZiAoaGFzQ2l0YXRpb24odG1wbCkpIHtcbiAgICAgIHdpa2kgPSBwYXJzZUNpdGF0aW9uKHRtcGwsIHdpa2ksIHIsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJzZUlubGluZSh0bXBsLCByLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJztcbiAgfSk7XG4gIC8vIDxyZWYgbmFtZT1cIlwiLz5cbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvID88cmVmIFtePl17MCwyMDB9P1xcLz4gPy9naSwgJyAnKTtcbiAgLy8gPHJlZiBuYW1lPVwiXCI+PC9yZWY+XG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLyA/PHJlZiBbXj5dezAsMjAwfT8+KFtcXHNcXFNdezAsMTAwMH0/KTxcXC9yZWY+ID8vZ2ksIGZ1bmN0aW9uKGEsIHRtcGwpIHtcbiAgICBpZiAoaGFzQ2l0YXRpb24odG1wbCkpIHtcbiAgICAgIHdpa2kgPSBwYXJzZUNpdGF0aW9uKHRtcGwsIHdpa2ksIHIsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJzZUlubGluZSh0bXBsLCByLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuICcgJztcbiAgfSk7XG4gIC8vb3RoZXIgdHlwZXMgb2YgeG1sIHRoYXQgd2Ugd2FudCB0byB0cmFzaCBjb21wbGV0ZWx5XG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLzwgPyh0YWJsZXxjb2RlfHNjb3JlfGRhdGF8Y2F0ZWdvcnl0cmVlfGNoYXJpbnNlcnR8Z2FsbGVyeXxoaWVyb3xpbWFnZW1hcHxpbnB1dGJveHxtYXRofG5vd2lraXxwb2VtfHJlZmVyZW5jZXN8c291cmNlfHN5bnRheGhpZ2hsaWdodHx0aW1lbGluZSkgP1tePl17MCwyMDB9Pz5bXFxzXFxTXXswLDcwMH08ID9cXC8gPyh0YWJsZXxjb2RlfHNjb3JlfGRhdGF8Y2F0ZWdvcnl0cmVlfGNoYXJpbnNlcnR8Z2FsbGVyeXxoaWVyb3xpbWFnZW1hcHxpbnB1dGJveHxtYXRofG5vd2lraXxwb2VtfHJlZmVyZW5jZXN8c291cmNlfHN5bnRheGhpZ2hsaWdodHx0aW1lbGluZSkgPz4vZ2ksICcgJyk7IC8vIDx0YWJsZSBuYW1lPVwiXCI+PHRyPmhpPC90cj48L3RhYmxlPlxuICAvL3NvbWUgeG1sLWxpa2UgZnJhZ21lbnRzIHdlIGNhbiBhbHNvIGtpbGxcbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvID88ID8ocmVmfHNwYW58ZGl2fHRhYmxlfGRhdGEpIFthLXowLTk9XCIgXXsyLDIwfVxcLyA/PiA/L2csICcgJyk7IC8vPHJlZiBuYW1lPVwiYXNkXCIvPlxuICAvL3NvbWUgZm9ybWF0dGluZyB4bWwsIHdlJ2xsIGtlZXAgdGhlaXIgaW5zaWRlcyB0aG91Z2hcbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvID88WyBcXC9dPyhwfHN1YnxzdXB8c3Bhbnxub3dpa2l8ZGl2fHRhYmxlfGJyfHRyfHRkfHRofHByZXxwcmUyfGhyKVsgXFwvXT8+ID8vZywgJyAnKTsgLy88c3ViPiwgPC9zdWI+XG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLyA/PFsgXFwvXT8oYWJicnxiZGl8YmRvfGJsb2NrcXVvdGV8Y2l0ZXxkZWx8ZGZufGVtfGl8aW5zfGtiZHxtYXJrfHF8cylbIFxcL10/PiA/L2csICcgJyk7IC8vPGFiYnI+LCA8L2FiYnI+XG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLyA/PFsgXFwvXT9oWzAtOV1bIFxcL10/PiA/L2csICcgJyk7IC8vPGgyPiwgPC9oMj5cbiAgLy9hIG1vcmUgZ2VuZXJpYyArIGRhbmdlcm91cyB4bWwtdGFnIHJlbW92YWxcbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvID88WyBcXC9dP1thLXowLTldezEsOH1bIFxcL10/PiA/L2csICcgJyk7IC8vPHNhbXA+XG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLyA/PCA/YnIgP1xcLz4gPy9nLCAnICcpOyAvLzxiciAvPlxuICByZXR1cm4gd2lraS50cmltKCk7XG59O1xuLy8gY29uc29sZS5sb2coa2lsbF94bWwoXCJoZWxsbyA8cmVmPm5vbm8hPC9yZWY+IHdvcmxkMS4gaGVsbG8gPHJlZiBuYW1lPSdodWxsbyc+bm9ubyE8L3JlZj4gd29ybGQyLiBoZWxsbyA8cmVmIG5hbWU9J2h1bGxvJy8+d29ybGQzLiAgaGVsbG8gPHRhYmxlIG5hbWU9Jyc+PHRyPjx0ZD5oaTxyZWY+bm9ubyE8L3JlZj48L3RkPjwvdHI+PC90YWJsZT53b3JsZDQuIGhlbGxvPHJlZiBuYW1lPScnLz4gd29ybGQ1IDxyZWYgbmFtZT0nJz5ub25vPC9yZWY+LCBtYW4ufX1cIikpXG4vLyBjb25zb2xlLmxvZyhraWxsX3htbChcImhlbGxvIDx0YWJsZSBuYW1lPScnPjx0cj48dGQ+aGk8cmVmPm5vbm8hPC9yZWY+PC90ZD48L3RyPjwvdGFibGU+d29ybGQ0XCIpKVxuLy8gY29uc29sZS5sb2coa2lsbF94bWwoJ2hlbGxvPHJlZiBuYW1lPVwidGhlcm95YWxcIi8+IHdvcmxkIDxyZWY+bm9ubzwvcmVmPiwgbWFufX0nKSlcbi8vIGNvbnNvbGUubG9nKGtpbGxfeG1sKFwiaGVsbG88cmVmIG5hbWU9XFxcInRoZXJveWFsXFxcIi8+IHdvcmxkNSwgPHJlZiBuYW1lPVxcXCJcXFwiPm5vbm88L3JlZj4gbWFuXCIpKTtcbi8vIGNvbnNvbGUubG9nKGtpbGxfeG1sKFwiaGVsbG8gPGFzZCBmPiB3b3JsZCA8L2gyPlwiKSlcbi8vIGNvbnNvbGUubG9nKGtpbGxfeG1sKFwiTm9ydGggQW1lcmljYSw8cmVmIG5hbWU9XFxcImZod2FcXFwiPiBhbmQgb25lIG9mXCIpKVxuLy8gY29uc29sZS5sb2coa2lsbF94bWwoXCJOb3J0aCBBbWVyaWNhLDxiciAvPiBhbmQgb25lIG9mXCIpKVxubW9kdWxlLmV4cG9ydHMgPSBraWxsX3htbDtcbiIsImNvbnN0IGxhbmd1YWdlcyA9IHJlcXVpcmUoJy4uLy4uL2RhdGEvbGFuZ3VhZ2VzJyk7XG5jb25zdCBwYXJzZUNvb3JkID0gcmVxdWlyZSgnLi9jb29yZGluYXRlcycpO1xuXG5jb25zdCBtb250aHMgPSBbXG4gICdKYW51YXJ5JyxcbiAgJ0ZlYnJ1YXJ5JyxcbiAgJ01hcmNoJyxcbiAgJ0FwcmlsJyxcbiAgJ01heScsXG4gICdKdW5lJyxcbiAgJ0p1bHknLFxuICAnQXVndXN0JyxcbiAgJ1NlcHRlbWJlcicsXG4gICdPY3RvYmVyJyxcbiAgJ05vdmVtYmVyJyxcbiAgJ0RlY2VtYmVyJ1xuXTtcbmNvbnN0IGRheXMgPSBbJ1N1bmRheScsICdNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5J107XG4vL3RoZXNlIGFyZSBlYXN5LCBpbmxpbmUgdGVtcGxhdGVzIHdlIGNhbiBkbyB3aXRob3V0IHRvby1tdWNoIHRyb3VibGUuXG5jb25zdCBpbmxpbmUgPSAvXFx7XFx7KHVybHxjb252ZXJ0fGN1cnJlbnR8bG9jYWx8bGN8dWN8Zm9ybWF0bnVtfHB1bGx8Y3F1b3RlfGNvb3JkfHNtYWxsfHNtYWxsZXJ8bWlkc2l6ZXxsYXJnZXJ8YmlnfGJpZ2dlcnxsYXJnZXxodWdlfHJlc2l6ZXxkdHN8ZGF0ZXx0ZXJtfGlwYXxpbGx8c2Vuc2V8dHxldHlsfHNmbnJlZnxPbGRTdHlsZURhdGUpKC4qPylcXH1cXH0vZ2k7XG5cbi8vIHRlbXBsYXRlcyB0aGF0IG5lZWQgcGFyc2luZyBhbmQgcmVwbGFjaW5nIGZvciBpbmxpbmUgdGV4dFxuLy9odHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9DYXRlZ29yeTpNYWdpY193b3JkX3RlbXBsYXRlc1xuY29uc3Qgd29yZF90ZW1wbGF0ZXMgPSBmdW5jdGlvbih3aWtpLCByKSB7XG5cbiAgLy9ncmVlZHktcGFzcyBhdCBlYXNpZXIsIGlubGluZS10ZW1wbGF0ZXNcbiAgd2lraSA9IHdpa2kucmVwbGFjZShpbmxpbmUsIGZ1bmN0aW9uKHRtcGwpIHtcbiAgICAvL3dlIGNhbiBiZSBzbmVha3kgd2l0aCB0aGlzIHRlbXBsYXRlLCBhcyBpdCdzIG9mdGVuIGZvdW5kIGluc2lkZSBvdGhlciB0ZW1wbGF0ZXNcbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7VVJMXFx8KFteIF17NCwxMDB9PylcXH1cXH0vZ2ksICckMScpO1xuICAgIC8vdGhpcyBvbmUgbmVlZHMgdG8gYmUgaGFuZGxlZCBtYW51YWxseVxuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHtjb252ZXJ0XFx8KFswLTldKj8pXFx8KFteXFx8XSo/KVxcfVxcfS9naSwgJyQxICQyJyk7IC8vVE9ETzogc3VwcG9ydCBodHRwczovL2VuLnRtcGxwZWRpYS5vcmcvdG1wbC9UZW1wbGF0ZTpDb252ZXJ0I1Jhbmdlc19vZl92YWx1ZXNcbiAgICAvL2RhdGUtdGltZSB0ZW1wbGF0ZXNcbiAgICBsZXQgZCA9IG5ldyBEYXRlKCk7XG4gICAgdG1wbCA9IHRtcGwucmVwbGFjZSgvXlxce1xceyhDVVJSRU5UfExPQ0FMKURBWSgyKT9cXH1cXH0vZ2ksIGQuZ2V0RGF0ZSgpKTtcbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7KENVUlJFTlR8TE9DQUwpTU9OVEgoTkFNRXxBQkJSRVYpP1xcfVxcfS9naSwgbW9udGhzW2QuZ2V0TW9udGgoKV0pO1xuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHsoQ1VSUkVOVHxMT0NBTClZRUFSXFx9XFx9L2dpLCBkLmdldEZ1bGxZZWFyKCkpO1xuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHsoQ1VSUkVOVHxMT0NBTClEQVlOQU1FXFx9XFx9L2dpLCBkYXlzW2QuZ2V0RGF5KCldKTtcbiAgICAvL2Zvcm1hdHRpbmcgdGVtcGxhdGVzXG4gICAgdG1wbCA9IHRtcGwucmVwbGFjZSgvXlxce1xceyhsY3x1Y3xmb3JtYXRudW0pOiguKj8pXFx9XFx9L2dpLCAnJDInKTtcbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7cHVsbCBxdW90ZVxcfChbXFxzXFxTXSo/KShcXHxbXFxzXFxTXSo/KT9cXH1cXH0vZ2ksICckMScpO1xuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHtjcXVvdGVcXHwoW1xcc1xcU10qPykoXFx8W1xcc1xcU10qPyk/XFx9XFx9L2dpLCAnJDEnKTtcbiAgICAvL2ludGVybGFuZ3VhZ2UtbGlua1xuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHtpbGxcXHwoW158XSspLio/XFx9XFx9L2dpLCAnJDEnKTtcbiAgICAvL2Zvb3Rub3RlIHN5bnRheFxuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHtyZWZuXFx8KFtefF0rKS4qP1xcfVxcfS9naSwgJyQxJyk7XG4gICAgLy8ndGFnJyBlc2NhcGVkIHRoaW5nLlxuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHsjP3RhZ1xcfChbXnxdKykuKj9cXH1cXH0vZ2ksICcnKTtcbiAgICAvLyB0aGVzZSBhcmUgbnV0cyB7e09sZFN0eWxlRGF0ZX19XG4gICAgdG1wbCA9IHRtcGwucmVwbGFjZSgvXlxce1xce09sZFN0eWxlRGF0ZVxcfChbXnxdKykuKj9cXH1cXH0vZ2ksICcnKTtcbiAgICAvLydoYXJ2YXJkIHJlZmVyZW5jZXMnXG4gICAgLy97e2Nvb3JkfDQzfDQyfE58Nzl8MjR8V3xyZWdpb246Q0EtT058ZGlzcGxheT1pbmxpbmUsdGl0bGV9fVxuICAgIGxldCBjb29yZCA9IHRtcGwubWF0Y2goL15cXHtcXHtjb29yZFxcfCguKj8pXFx9XFx9L2kpO1xuICAgIGlmIChjb29yZCAhPT0gbnVsbCkge1xuICAgICAgci5jb29yZGluYXRlcy5wdXNoKHBhcnNlQ29vcmQoY29vcmRbMV0pKTtcbiAgICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoY29vcmRbMF0sICcnKTtcbiAgICB9XG4gICAgLy9mb250LXNpemVcbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7KHNtYWxsfHNtYWxsZXJ8bWlkc2l6ZXxsYXJnZXJ8YmlnfGJpZ2dlcnxsYXJnZXxodWdlfHJlc2l6ZSlcXHwoW1xcc1xcU10qPylcXH1cXH0vZ2ksICckMicpO1xuICAgIC8ve3tmb250fHNpemU9eCV8dGV4dH19XG5cbiAgICBpZiAodG1wbC5tYXRjaCgvXlxce1xce2R0c1xcfC8pKSB7XG4gICAgICBsZXQgZGF0ZSA9ICh0bXBsLm1hdGNoKC9eXFx7XFx7ZHRzXFx8KC4qPylbXFx9XFx8XS8pIHx8IFtdKVsxXSB8fCAnJztcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgIGlmIChkYXRlICYmIGRhdGUuZ2V0VGltZSgpKSB7XG4gICAgICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHtkdHNcXHwuKj9cXH1cXH0vZ2ksIGRhdGUudG9EYXRlU3RyaW5nKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG1wbCA9IHRtcGwucmVwbGFjZSgvXlxce1xce2R0c1xcfC4qP1xcfVxcfS9naSwgJyAnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRtcGwubWF0Y2goL15cXHtcXHtkYXRlXFx8Lio/XFx9XFx9LykpIHtcbiAgICAgIGxldCBkYXRlID0gdG1wbC5tYXRjaCgvXlxce1xce2RhdGVcXHwoLio/KVxcfCguKj8pXFx8KC4qPylcXH1cXH0vKSB8fCBbXSB8fCBbXTtcbiAgICAgIGxldCBkYXRlU3RyaW5nID0gZGF0ZVsxXSArICcgJyArIGRhdGVbMl0gKyAnICcgKyBkYXRlWzNdO1xuICAgICAgdG1wbCA9IHRtcGwucmVwbGFjZSgvXlxce1xce2RhdGVcXHwuKj9cXH1cXH0vZ2ksIGRhdGVTdHJpbmcpO1xuICAgIH1cbiAgICAvL2NvbW1vbiB0ZW1wbGF0ZXMgaW4gd2lrdGlvbmFyeVxuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHt0ZXJtXFx8KC4qPylcXHwuKj9cXH1cXH0vZ2ksICdcXCckMVxcJycpO1xuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHtJUEEoYy1lbik/XFx8KC4qPylcXHwoLio/KVxcfVxcfSw/L2dpLCAnJyk7XG4gICAgdG1wbCA9IHRtcGwucmVwbGFjZSgvXlxce1xce3NlbnNlXFx8KC4qPylcXHw/Lio/XFx9XFx9L2dpLCAnKCQxKScpO1xuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL3ZcXHtcXHt0XFwrP1xcfC4uLj9cXHwoLio/KShcXHwuKik/XFx9XFx9L2dpLCAnXFwnJDFcXCcnKTtcbiAgICAvL3JlcGxhY2UgbGFuZ3VhZ2VzIGluICdldHlsJyB0YWdzXG4gICAgaWYgKHRtcGwubWF0Y2goL15cXHtcXHtldHlsXFx8LykpIHtcbiAgICAgIC8vZG9lc24ndCBzdXBwb3J0IG11bHRpcGxlLW9uZXMgcGVyIHNlbnRlbmNlLi5cbiAgICAgIHZhciBsYW5nID0gKHRtcGwubWF0Y2goL15cXHtcXHtldHlsXFx8KC4qPylcXHwuKj9cXH1cXH0vaSkgfHwgW10pWzFdIHx8ICcnO1xuICAgICAgbGFuZyA9IGxhbmcudG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmIChsYW5nICYmIGxhbmd1YWdlc1tsYW5nXSkge1xuICAgICAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7ZXR5bFxcfCguKj8pXFx8Lio/XFx9XFx9L2dpLCBsYW5ndWFnZXNbbGFuZ10uZW5nbGlzaF90aXRsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7ZXR5bFxcfCguKj8pXFx8Lio/XFx9XFx9L2dpLCAnKCQxKScpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG1wbDtcbiAgfSk7XG4gIC8vZmxhdGxpc3QgLT4gY29tbWFzICAtLSBobGlzdD9cbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvXFx7XFx7KGZsYXRsaXN0fGhsaXN0KSA/XFx8KFtefV0rKVxcfVxcfS9naSwgZnVuY3Rpb24oYSwgYiwgYykge1xuICAgIGxldCBhcnIgPSBjLnNwbGl0KC9cXHMrWyogXSs/ID8vZyk7XG4gICAgYXJyID0gYXJyLmZpbHRlcihsaW5lID0+IGxpbmUpO1xuICAgIHJldHVybiBhcnIuam9pbignLCAnKTtcbiAgfSk7XG4gIC8vcGxhaW5saXN0IC0+IG5ld2xpbmVzXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoL1xce1xceyhwbGFpbmxpc3R8dWJsaXN0fHVuYnVsbGV0ZWQgbGlzdCkgP1xcfChbXn1dKylcXH1cXH0vZ2ksIGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAgICBsZXQgYXJyID0gYy5zcGxpdCgvXFxzK1sqIF0rPyA/L2cpO1xuICAgIGFyciA9IGFyci5maWx0ZXIobGluZSA9PiBsaW5lKTtcbiAgICByZXR1cm4gYXJyLmpvaW4oJywgJyk7XG4gIH0pO1xuICAvLyB0bXBsID0gdG1wbC5yZXBsYWNlKC9cXHtcXHtmbGF0bGlzdFxcfChbXFxzXFxTXSo/KShcXHxbXFxzXFxTXSo/KT9cXH1cXH0vZ2ksICckMScpO1xuICByZXR1cm4gd2lraTtcbn07XG4vLyBjb25zb2xlLmxvZyh3b3JkX3RlbXBsYXRlcyhcImhlbGxvIHt7Q1VSUkVOVERBWX19IHdvcmxkXCIpKVxuLy8gY29uc29sZS5sb2cod29yZF90ZW1wbGF0ZXMoXCJoZWxsbyB7e0NVUlJFTlRNT05USH19IHdvcmxkXCIpKVxuLy8gY29uc29sZS5sb2cod29yZF90ZW1wbGF0ZXMoXCJoZWxsbyB7e0NVUlJFTlRZRUFSfX0gd29ybGRcIikpXG4vLyBjb25zb2xlLmxvZyh3b3JkX3RlbXBsYXRlcyhcImhlbGxvIHt7TE9DQUxEQVlOQU1FfX0gd29ybGRcIikpXG4vLyBjb25zb2xlLmxvZyh3b3JkX3RlbXBsYXRlcyhcImhlbGxvIHt7bGM6ODh9fSB3b3JsZFwiKSlcbi8vIGNvbnNvbGUubG9nKHdvcmRfdGVtcGxhdGVzKFwiaGVsbG8ge3twdWxsIHF1b3RlfExpZmUgaXMgbGlrZVxcbnxhdXRob3I9W1thc2RmXV19fSB3b3JsZFwiKSlcbi8vIGNvbnNvbGUubG9nKHdvcmRfdGVtcGxhdGVzKFwiaGkge3tldHlsfGxhfC19fSB0aGVyZVwiKSlcbi8vIGNvbnNvbGUubG9nKHdvcmRfdGVtcGxhdGVzKFwie3tldHlsfGxhfC19fSBjb2duYXRlIHdpdGgge3tldHlsfGlzfC19fSB7e3Rlcm18aHVnZ2F8fHRvIGNvbWZvcnR8bGFuZz1pc319LFwiKSlcblxubW9kdWxlLmV4cG9ydHMgPSB3b3JkX3RlbXBsYXRlcztcbiIsImNvbnN0IGZucyA9IHJlcXVpcmUoJy4uLy4uL2xpYi9oZWxwZXJzJyk7XG5jb25zdCBoZWFkaW5nX3JlZyA9IC9eKD17MSw1fSkoW149XXsxLDIwMH0/KT17MSw1fSQvO1xuXG4vL2ludGVycHJldCBkZXB0aCwgdGl0bGUgb2YgaGVhZGluZ3MgbGlrZSAnPT1TZWUgYWxzbz09J1xuY29uc3QgcGFyc2VIZWFkaW5nID0gZnVuY3Rpb24ociwgc3RyKSB7XG4gIGxldCBoZWFkaW5nID0gc3RyLm1hdGNoKGhlYWRpbmdfcmVnKTtcbiAgaWYgKCFoZWFkaW5nKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpdGxlOiAnJyxcbiAgICAgIGRlcHRoOiAwXG4gICAgfTtcbiAgfVxuICBsZXQgdGl0bGUgPSBoZWFkaW5nWzJdIHx8ICcnO1xuICB0aXRsZSA9IGZucy50cmltX3doaXRlc3BhY2UodGl0bGUpO1xuICBsZXQgZGVwdGggPSAxO1xuICBpZiAoaGVhZGluZ1sxXSkge1xuICAgIGRlcHRoID0gaGVhZGluZ1sxXS5sZW5ndGggLSAxO1xuICB9XG4gIHIudGl0bGUgPSB0aXRsZTtcbiAgci5kZXB0aCA9IGRlcHRoO1xuICByZXR1cm4gcjtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlSGVhZGluZztcbiIsImNvbnN0IEhhc2hlcyA9IHJlcXVpcmUoJ2pzaGFzaGVzJyk7XG5jb25zdCBpMThuID0gcmVxdWlyZSgnLi4vLi4vLi4vZGF0YS9pMThuJyk7XG5jb25zdCBmaWxlX3JlZyA9IG5ldyBSZWdFeHAoJygnICsgaTE4bi5pbWFnZXMuY29uY2F0KGkxOG4uZmlsZXMpLmpvaW4oJ3wnKSArICcpOi4qP1tcXFxcfFxcXFxdXScsICdpJyk7XG5cbi8vdGhlIHdpa2ltZWRpYSBpbWFnZSB1cmwgaXMgYSBsaXR0bGUgc2lsbHk6XG4vL2h0dHBzOi8vY29tbW9ucy53aWtpbWVkaWEub3JnL3dpa2kvQ29tbW9uczpGQVEjV2hhdF9hcmVfdGhlX3N0cmFuZ2VseV9uYW1lZF9jb21wb25lbnRzX2luX2ZpbGVfcGF0aHMuM0ZcbmNvbnN0IG1ha2VfaW1hZ2UgPSBmdW5jdGlvbihmaWxlKSB7XG4gIGxldCB0aXRsZSA9IGZpbGUucmVwbGFjZSgvXihpbWFnZXxmaWxlPylcXDovaSwgJycpO1xuICAvL3RpdGxlY2FzZSBpdFxuICB0aXRsZSA9IHRpdGxlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGl0bGUuc3Vic3RyaW5nKDEpO1xuICAvL3NwYWNlcyB0byB1bmRlcnNjb3Jlc1xuICB0aXRsZSA9IHRpdGxlLnJlcGxhY2UoLyAvZywgJ18nKTtcblxuICBsZXQgaGFzaCA9IG5ldyBIYXNoZXMuTUQ1KCkuaGV4KHRpdGxlKTtcbiAgbGV0IHBhdGggPSBoYXNoLnN1YnN0cigwLCAxKSArICcvJyArIGhhc2guc3Vic3RyKDAsIDIpICsgJy8nO1xuICB0aXRsZSA9IGVuY29kZVVSSUNvbXBvbmVudCh0aXRsZSk7XG4gIHBhdGggKz0gdGl0bGU7XG4gIGxldCBzZXJ2ZXIgPSAnaHR0cHM6Ly91cGxvYWQud2lraW1lZGlhLm9yZy93aWtpcGVkaWEvY29tbW9ucy8nO1xuICBsZXQgdGh1bWIgPSAnLzMwMHB4LScgKyB0aXRsZTtcbiAgcmV0dXJuIHtcbiAgICB1cmw6IHNlcnZlciArIHBhdGgsXG4gICAgZmlsZTogZmlsZSxcbiAgICB0aHVtYjogc2VydmVyICsgJ3RodW1iLycgKyBwYXRoICsgdGh1bWJcbiAgfTtcbn07XG5cbi8vaW1hZ2VzIGFyZSB1c3VhbGx5IFtbaW1hZ2U6bXlfcGljLmpwZ11dXG5jb25zdCBwYXJzZV9pbWFnZSA9IGZ1bmN0aW9uKGltZykge1xuICBpbWcgPSBpbWcubWF0Y2goZmlsZV9yZWcpIHx8IFsnJ107XG4gIGltZyA9IGltZ1swXS5yZXBsYWNlKC9bXFx8XFxdXSQvLCAnJyk7XG4gIC8vYWRkIHVybCwgZXRjIHRvIGltYWdlXG4gIGltZyA9IG1ha2VfaW1hZ2UoaW1nKTtcbiAgcmV0dXJuIGltZztcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlX2ltYWdlO1xuXG4vLyBjb25zb2xlLmxvZyhwYXJzZV9pbWFnZShcIltbaW1hZ2U6bXlfcGljLmpwZ11dXCIpKTtcbiIsImNvbnN0IGkxOG4gPSByZXF1aXJlKCcuLi8uLi8uLi9kYXRhL2kxOG4nKTtcbmNvbnN0IGZpbmRfcmVjdXJzaXZlID0gcmVxdWlyZSgnLi4vLi4vLi4vbGliL3JlY3Vyc2l2ZV9tYXRjaCcpO1xuY29uc3QgcGFyc2VfaW1hZ2UgPSByZXF1aXJlKCcuL2ltYWdlJyk7XG5jb25zdCBmaWxlUmVnZXggPSBuZXcgUmVnRXhwKCcoJyArIGkxOG4uaW1hZ2VzLmNvbmNhdChpMThuLmZpbGVzKS5qb2luKCd8JykgKyAnKTouKj9bXFxcXHxcXFxcXV0nLCAnaScpO1xuXG5jb25zdCBwYXJzZUltYWdlcyA9IGZ1bmN0aW9uKHIsIHdpa2ksIG9wdGlvbnMpIHtcbiAgLy9zZWNvbmQsIHJlbW92ZSBbW2ZpbGU6Li4uW1tdXSBdXSByZWN1cnNpb25zXG4gIGxldCBtYXRjaGVzID0gZmluZF9yZWN1cnNpdmUoJ1snLCAnXScsIHdpa2kpO1xuICBtYXRjaGVzLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgIGlmIChzLm1hdGNoKGZpbGVSZWdleCkpIHtcbiAgICAgIHIuaW1hZ2VzID0gci5pbWFnZXMgfHwgW107XG4gICAgICBpZiAob3B0aW9ucy5pbWFnZXMgIT09IGZhbHNlKSB7XG4gICAgICAgIHIuaW1hZ2VzLnB1c2gocGFyc2VfaW1hZ2UocykpO1xuICAgICAgfVxuICAgICAgd2lraSA9IHdpa2kucmVwbGFjZShzLCAnJyk7XG4gICAgfVxuICB9KTtcblxuICAvL3RoaXJkLCB3aWt0aW9uYXJ5LXN0eWxlIGludGVybGFuZ3VhZ2UgbGlua3NcbiAgbWF0Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICBpZiAocy5tYXRjaCgvXFxbXFxbKFthLXpdKyk6KC4qPylcXF1cXF0vaSkgIT09IG51bGwpIHtcbiAgICAgIGxldCBzaXRlID0gKHMubWF0Y2goL1xcW1xcWyhbYS16XSspOi9pKSB8fCBbXSlbMV0gfHwgJyc7XG4gICAgICBzaXRlID0gc2l0ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgaWYgKHNpdGUgJiYgaTE4bi5kaWN0aW9uYXJ5W3NpdGVdID09PSB1bmRlZmluZWQgJiYgIShvcHRpb25zLm5hbWVzcGFjZSAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMubmFtZXNwYWNlID09PSBzaXRlKSkge1xuICAgICAgICByLmludGVyd2lraSA9IHIuaW50ZXJ3aWtpIHx8IHt9O1xuICAgICAgICByLmludGVyd2lraVtzaXRlXSA9IChzLm1hdGNoKC9cXFtcXFsoW2Etel0rKTooLio/KVxcXVxcXS9pKSB8fCBbXSlbMl07XG4gICAgICAgIHdpa2kgPSB3aWtpLnJlcGxhY2UocywgJycpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiB3aWtpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gcGFyc2VJbWFnZXM7XG4iLCIvL2ludGVycHJldCA9PWhlYWRpbmc9PSBsaW5lc1xuY29uc3QgcGFyc2UgPSB7XG4gIGhlYWRpbmc6IHJlcXVpcmUoJy4vaGVhZGluZycpLFxuICBsaXN0OiByZXF1aXJlKCcuL2xpc3QnKSxcbiAgaW1hZ2U6IHJlcXVpcmUoJy4vaW1hZ2UnKSxcbiAgdGFibGU6IHJlcXVpcmUoJy4vdGFibGUnKSxcbiAgdGVtcGxhdGVzOiByZXF1aXJlKCcuL3NlY3Rpb25fdGVtcGxhdGVzJyksXG4gIGVhY2hTZW50ZW5jZTogcmVxdWlyZSgnLi9zZW50ZW5jZScpLmVhY2hTZW50ZW5jZVxufTtcbmNvbnN0IHNlY3Rpb25fcmVnID0gL1tcXG5eXSg9ezEsNX1bXj1dezEsMjAwfT89ezEsNX0pL2c7XG5cbmNvbnN0IHBhcnNlU2VjdGlvbiA9IGZ1bmN0aW9uKHNlY3Rpb24sIHdpa2ksIHIsIG9wdGlvbnMpIHtcbiAgLy8gLy9wYXJzZSB0aGUgdGFibGVzXG4gIHdpa2kgPSBwYXJzZS50YWJsZShzZWN0aW9uLCB3aWtpKTtcbiAgLy8gLy9wYXJzZSB0aGUgbGlzdHNcbiAgd2lraSA9IHBhcnNlLmxpc3Qoc2VjdGlvbiwgd2lraSk7XG4gIC8vc3Vwb3BydGVkIHRoaW5ncyBsaWtlIHt7bWFpbn19XG4gIHdpa2kgPSBwYXJzZS50ZW1wbGF0ZXMoc2VjdGlvbiwgd2lraSk7XG4gIC8vIC8vcGFyc2UrcmVtb3ZlIHNjYXJ5ICdbWyBbW11dIF1dJyBzdHVmZlxuICB3aWtpID0gcGFyc2UuaW1hZ2Uoc2VjdGlvbiwgd2lraSwgb3B0aW9ucyk7XG4gIC8vZG8gZWFjaCBzZW50ZW5jZVxuICB3aWtpID0gcGFyc2UuZWFjaFNlbnRlbmNlKHNlY3Rpb24sIHdpa2kpO1xuICAvLyBzZWN0aW9uLndpa2kgPSB3aWtpO1xuICByZXR1cm4gc2VjdGlvbjtcbn07XG5cbmNvbnN0IG1ha2VTZWN0aW9ucyA9IGZ1bmN0aW9uKHIsIHdpa2ksIG9wdGlvbnMpIHtcbiAgbGV0IHNwbGl0ID0gd2lraS5zcGxpdChzZWN0aW9uX3JlZyk7IC8vLmZpbHRlcihzID0+IHMpO1xuICBsZXQgc2VjdGlvbnMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdC5sZW5ndGg7IGkgKz0gMikge1xuICAgIGxldCB0aXRsZSA9IHNwbGl0W2kgLSAxXSB8fCAnJztcbiAgICBsZXQgdHh0ID0gc3BsaXRbaV0gfHwgJyc7XG4gICAgbGV0IHNlY3Rpb24gPSB7XG4gICAgICB0aXRsZTogJycsXG4gICAgICBkZXB0aDogbnVsbFxuICAgIH07XG4gICAgc2VjdGlvbiA9IHBhcnNlLmhlYWRpbmcoc2VjdGlvbiwgdGl0bGUpO1xuICAgIHNlY3Rpb24gPSBwYXJzZVNlY3Rpb24oc2VjdGlvbiwgdHh0LCByLCBvcHRpb25zKTtcbiAgICBzZWN0aW9ucy5wdXNoKHNlY3Rpb24pO1xuICB9XG4gIHJldHVybiBzZWN0aW9ucztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWFrZVNlY3Rpb25zO1xuIiwiY29uc3QgbGlzdF9yZWcgPSAvXlsjXFwqOjtcXHxdKy87XG5jb25zdCBidWxsZXRfcmVnID0gL15cXCorW146LFxcfF17NH0vO1xuY29uc3QgbnVtYmVyX3JlZyA9IC9eID9cXCNbXjosXFx8XXs0fS87XG5jb25zdCBoYXNfd29yZCA9IC9bYS16XS9pO1xuY29uc3QgcGFyc2VMaW5lID0gcmVxdWlyZSgnLi9zZW50ZW5jZS8nKS5wYXJzZUxpbmU7XG5cbi8vIGRvZXMgaXQgc3RhcnQgd2l0aCBhIGJ1bGxldCBwb2ludCBvciBzb21ldGhpbmc/XG5jb25zdCBpc0xpc3QgPSBmdW5jdGlvbihsaW5lKSB7XG4gIHJldHVybiBsaXN0X3JlZy50ZXN0KGxpbmUpIHx8IGJ1bGxldF9yZWcudGVzdChsaW5lKSB8fCBudW1iZXJfcmVnLnRlc3QobGluZSk7XG59O1xuXG4vL21ha2UgYnVsbGV0cy9udW1iZXJzIGludG8gaHVtYW4tcmVhZGFibGUgKidzXG5jb25zdCBjbGVhbkxpc3QgPSBmdW5jdGlvbihsaXN0KSB7XG4gIGxldCBudW1iZXIgPSAxO1xuICBsaXN0ID0gbGlzdC5maWx0ZXIobCA9PiBsKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGxpbmUgPSBsaXN0W2ldO1xuICAgIC8vYWRkICMgbnVtYmVyaW5ncyBmb3JtYXR0aW5nXG4gICAgaWYgKGxpbmUubWF0Y2gobnVtYmVyX3JlZykpIHtcbiAgICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoL14gPyMqLywgbnVtYmVyICsgJykgJyk7XG4gICAgICBsaW5lID0gbGluZSArICdcXG4nO1xuICAgICAgbnVtYmVyICs9IDE7XG4gICAgfSBlbHNlIGlmIChsaW5lLm1hdGNoKGxpc3RfcmVnKSkge1xuICAgICAgbnVtYmVyID0gMTtcbiAgICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UobGlzdF9yZWcsICcnKTtcbiAgICB9XG4gICAgbGlzdFtpXSA9IHBhcnNlTGluZShsaW5lKTtcbiAgfVxuICByZXR1cm4gbGlzdDtcbn07XG5cbmNvbnN0IGdyYWJMaXN0ID0gZnVuY3Rpb24obGluZXMsIGkpIHtcbiAgbGV0IHN1YiA9IFtdO1xuICBmb3IgKGxldCBvID0gaTsgbyA8IGxpbmVzLmxlbmd0aDsgbysrKSB7XG4gICAgaWYgKGlzTGlzdChsaW5lc1tvXSkpIHtcbiAgICAgIHN1Yi5wdXNoKGxpbmVzW29dKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHN1YiA9IHN1Yi5maWx0ZXIoYSA9PiBhICYmIGhhc193b3JkLnRlc3QoYSkpO1xuICBzdWIgPSBjbGVhbkxpc3Qoc3ViKTtcbiAgcmV0dXJuIHN1Yjtcbn07XG5cbmNvbnN0IHBhcnNlTGlzdCA9IGZ1bmN0aW9uKHIsIHdpa2kpIHtcbiAgbGV0IGxpbmVzID0gd2lraS5zcGxpdCgvXFxuL2cpO1xuICBsaW5lcyA9IGxpbmVzLmZpbHRlcihsID0+IGhhc193b3JkLnRlc3QobCkpO1xuICBsZXQgbGlzdHMgPSBbXTtcbiAgbGV0IHRoZVJlc3QgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChpc0xpc3QobGluZXNbaV0pICYmIGxpbmVzW2kgKyAxXSAmJiBpc0xpc3QobGluZXNbaSArIDFdKSkge1xuICAgICAgbGV0IHN1YiA9IGdyYWJMaXN0KGxpbmVzLCBpKTtcbiAgICAgIGlmIChzdWIubGVuZ3RoID4gMCkge1xuICAgICAgICBsaXN0cy5wdXNoKHN1Yik7XG4gICAgICAgIGkgKz0gc3ViLmxlbmd0aDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhlUmVzdC5wdXNoKGxpbmVzW2ldKTtcbiAgICB9XG4gIH1cbiAgaWYgKGxpc3RzLmxlbmd0aCA+IDApIHtcbiAgICByLmxpc3RzID0gbGlzdHM7XG4gIH1cbiAgcmV0dXJuIHRoZVJlc3Quam9pbignXFxuJyk7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBwYXJzZUxpc3Q7XG4iLCIvLyBjb25zdCBwYXJzZUNvb3JkID0gcmVxdWlyZSgnLi9jb29yZGluYXRlcycpO1xuY29uc3QgcmVncyA9IHtcbiAgbWFpbjogL1xce1xce21haW4oIGFydGljbGUpP1xcfCguKj8pXFx9XFx9L2ksXG4gIHdpZGVfaW1hZ2U6IC9cXHtcXHt3aWRlIGltYWdlXFx8KC4qPylcXH1cXH0vaVxufTtcblxuLy90aGVzZSB0ZW1wbGF0ZXMgYXBwbHkgb25seSB0byB0aGlzIHNlY3Rpb24sYW5kIHdlIHdvbnQgZmluZCB0aGVtLCBzYXksIGluc2lkZSBhIGluZm9ib3hcbmNvbnN0IHBhcnNlVGVtcGxhdGVzID0gZnVuY3Rpb24oc2VjdGlvbiwgd2lraSkge1xuICBsZXQgdGVtcGxhdGVzID0ge307XG5cbiAgLy97e21haW58dG9yb250b319XG4gIGxldCBtYWluID0gd2lraS5tYXRjaChyZWdzLm1haW4pO1xuICBpZiAobWFpbikge1xuICAgIHRlbXBsYXRlcy5tYWluID0gbWFpblsyXS5zcGxpdCgnfCcpO1xuICAgIHdpa2kgPSB3aWtpLnJlcGxhY2UocmVncy5tYWluLCAnJyk7XG4gIH1cbiAgLy97e3dpZGUgaW1hZ2V8ZmlsZTpjb29sLmpwZ319XG4gIGxldCB3aWRlID0gd2lraS5tYXRjaChyZWdzLndpZGVfaW1hZ2UpO1xuICBpZiAod2lkZSkge1xuICAgIHRlbXBsYXRlcy53aWRlX2ltYWdlID0gd2lkZVsxXS5zcGxpdCgnfCcpO1xuICAgIHdpa2kgPSB3aWtpLnJlcGxhY2UocmVncy53aWRlX2ltYWdlLCAnJyk7XG4gIH1cbiAgaWYgKE9iamVjdC5rZXlzKHRlbXBsYXRlcykubGVuZ3RoID4gMCkge1xuICAgIHNlY3Rpb24udGVtcGxhdGVzID0gdGVtcGxhdGVzO1xuICB9XG4gIHJldHVybiB3aWtpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gcGFyc2VUZW1wbGF0ZXM7XG4iLCJcbi8vXG5jb25zdCBmb3JtYXR0aW5nID0gZnVuY3Rpb24ob2JqKSB7XG4gIGxldCBib2xkcyA9IFtdO1xuICBsZXQgaXRhbGljcyA9IFtdO1xuICBsZXQgd2lraSA9IG9iai50ZXh0IHx8ICcnO1xuICAvL2JvbGQgYW5kIGl0YWxpY3MgY29tYmluZWQgNSAnc1xuICB3aWtpID0gd2lraS5yZXBsYWNlKC8nJ3s0fShbXiddezAsMjAwfSknJ3s0fS9nLCAoYSwgYikgPT4ge1xuICAgIGJvbGRzLnB1c2goYik7XG4gICAgaXRhbGljcy5wdXNoKGIpO1xuICAgIHJldHVybiBiO1xuICB9KTtcbiAgLy8nJydib2xkJycnXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLycnezJ9KFteJ117MCwyMDB9KScnezJ9L2csIChhLCBiKSA9PiB7XG4gICAgYm9sZHMucHVzaChiKTtcbiAgICByZXR1cm4gYjtcbiAgfSk7XG4gIC8vJydpdGFsaWMnJ1xuICB3aWtpID0gd2lraS5yZXBsYWNlKC8nJyhbXiddezAsMjAwfSknJy9nLCAoYSwgYikgPT4ge1xuICAgIGl0YWxpY3MucHVzaChiKTtcbiAgICByZXR1cm4gYjtcbiAgfSk7XG5cbiAgLy9wYWNrIGl0IGFsbCB1cC4uXG4gIG9iai50ZXh0ID0gd2lraTtcbiAgaWYgKGJvbGRzLmxlbmd0aCA+IDApIHtcbiAgICBvYmouZm10ID0gb2JqLmZtdCB8fCB7fTtcbiAgICBvYmouZm10LmJvbGQgPSBib2xkcztcbiAgfVxuICBpZiAoaXRhbGljcy5sZW5ndGggPiAwKSB7XG4gICAgb2JqLmZtdCA9IG9iai5mbXQgfHwge307XG4gICAgb2JqLmZtdC5pdGFsaWMgPSBpdGFsaWNzO1xuICB9XG4gIHJldHVybiBvYmo7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBmb3JtYXR0aW5nO1xuIiwiY29uc3QgaGVscGVycyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYi9oZWxwZXJzJyk7XG5jb25zdCBwYXJzZUxpbmtzID0gcmVxdWlyZSgnLi9saW5rcycpO1xuY29uc3QgcGFyc2VGbXQgPSByZXF1aXJlKCcuL2Zvcm1hdHRpbmcnKTtcbmNvbnN0IHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzJyk7XG5jb25zdCBzZW50ZW5jZVBhcnNlciA9IHJlcXVpcmUoJy4vc2VudGVuY2UtcGFyc2VyJyk7XG5jb25zdCBpMThuID0gcmVxdWlyZSgnLi4vLi4vLi4vZGF0YS9pMThuJyk7XG5jb25zdCBjYXRfcmVnID0gbmV3IFJlZ0V4cCgnXFxcXFtcXFxcWzo/KCcgKyBpMThuLmNhdGVnb3JpZXMuam9pbignfCcpICsgJyk6W15cXFxcXVxcXFxdXXsyLDgwfVxcXFxdXFxcXF0nLCAnZ2knKTtcblxuLy9yZXR1cm4gb25seSByZW5kZXJlZCB0ZXh0IG9mIHdpa2kgbGlua3NcbmNvbnN0IHJlc29sdmVfbGlua3MgPSBmdW5jdGlvbihsaW5lKSB7XG4gIC8vIGNhdGVnb3JpZXMsIGltYWdlcywgZmlsZXNcbiAgbGluZSA9IGxpbmUucmVwbGFjZShjYXRfcmVnLCAnJyk7XG4gIC8vIFtbQ29tbW9uIGxpbmtzXV1cbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFxbXFxbOj8oW158XXsxLDgwfT8pXFxdXFxdKFxcd3swLDV9KS9nLCAnJDEkMicpO1xuICAvLyBbW0ZpbGU6d2l0aHxTaXplXV1cbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFxbXFxbRmlsZTo/KC57Miw4MH0/KVxcfChbXlxcXV0rPylcXF1cXF0oXFx3ezAsNX0pL2csICckMScpO1xuICAvLyBbW1JlcGxhY2VkfExpbmtzXV1cbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFxbXFxbOj8oLnsyLDgwfT8pXFx8KFteXFxdXSs/KVxcXVxcXShcXHd7MCw1fSkvZywgJyQyJDMnKTtcbiAgLy8gRXh0ZXJuYWwgbGlua3NcbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFxbKGh0dHBzP3xuZXdzfGZ0cHxtYWlsdG98Z29waGVyfGlyYyk6XFwvXFwvW15cXF1cXHwgXXs0LDE1MDB9KFtcXHwgXS4qPyk/XFxdL2csICckMicpO1xuICByZXR1cm4gbGluZTtcbn07XG4vLyBjb25zb2xlLmxvZyhyZXNvbHZlX2xpbmtzKFwiW2h0dHA6Ly93d3cud2hpc3RsZXIuY2Egd3d3LndoaXN0bGVyLmNhXVwiKSlcblxuZnVuY3Rpb24gcG9zdHByb2Nlc3MobGluZSkge1xuICAvL2ZpeCBsaW5rc1xuICBsaW5lID0gcmVzb2x2ZV9saW5rcyhsaW5lKTtcbiAgLy9vb3BzLCByZWN1cnNpdmUgaW1hZ2UgYnVnXG4gIGlmIChsaW5lLm1hdGNoKC9eKHRodW1ifHJpZ2h0fGxlZnQpXFx8L2kpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgbGluZSA9IGhlbHBlcnMudHJpbV93aGl0ZXNwYWNlKGxpbmUpO1xuICByZXR1cm4gbGluZTtcbn1cblxuZnVuY3Rpb24gcGFyc2VMaW5lKGxpbmUpIHtcbiAgbGV0IG9iaiA9IHtcbiAgICB0ZXh0OiBwb3N0cHJvY2VzcyhsaW5lKVxuICB9O1xuICAvL3B1bGwtb3V0IHRoZSBbW2xpbmtzXV1cbiAgbGV0IGxpbmtzID0gcGFyc2VMaW5rcyhsaW5lKTtcbiAgaWYgKGxpbmtzKSB7XG4gICAgb2JqLmxpbmtzID0gbGlua3M7XG4gIH1cbiAgLy9wdWxsLW91dCB0aGUgYm9sZHMgYW5kICcnaXRhbGljcycnXG4gIG9iaiA9IHBhcnNlRm10KG9iaik7XG4gIC8vcHVsbC1vdXQgdGhpbmdzIGxpa2Uge3tzdGFydCBkYXRlfC4uLn19XG4gIG9iaiA9IHRlbXBsYXRlcyhvYmopO1xuICByZXR1cm4gb2JqO1xufVxuXG5jb25zdCBwYXJzZVNlbnRlbmNlcyA9IGZ1bmN0aW9uKHIsIHdpa2kpIHtcbiAgbGV0IHNlbnRlbmNlcyA9IHNlbnRlbmNlUGFyc2VyKHdpa2kpO1xuICBzZW50ZW5jZXMgPSBzZW50ZW5jZXMubWFwKHBhcnNlTGluZSk7XG4gIHIuc2VudGVuY2VzID0gc2VudGVuY2VzO1xuICByZXR1cm4gcjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBlYWNoU2VudGVuY2U6IHBhcnNlU2VudGVuY2VzLFxuICBwYXJzZUxpbmU6IHBhcnNlTGluZVxufTtcbiIsImNvbnN0IGhlbHBlcnMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWIvaGVscGVycycpO1xuY29uc3QgaWdub3JlX2xpbmtzID0gL146PyhjYXRlZ29yeXxjYXTDqWdvcmllfEthdGVnb3JpZXxDYXRlZ29yw61hfENhdGVnb3JpYXxDYXRlZ29yaWV8S2F0ZWdvcmlhfNiq2LXZhtmK2YF8aW1hZ2V8ZmlsZXxpbWFnZXxmaWNoaWVyfGRhdGVpfG1lZGlhfHNwZWNpYWx8d3B8d2lraXBlZGlhfGhlbHB8dXNlcnxtZWRpYXdpa2l8cG9ydGFsfHRhbGt8dGVtcGxhdGV8Ym9va3xkcmFmdHxtb2R1bGV8dG9waWN8d2lrdGlvbmFyeXx3aWtpc291cmNlKTovaTtcbmNvbnN0IGV4dGVybmFsX2xpbmsgPSAvXFxbKGh0dHBzP3xuZXdzfGZ0cHxtYWlsdG98Z29waGVyfGlyYykoOlxcL1xcL1teXFxdXFx8IF17NCwxNTAwfSkoW1xcfCBdLio/KT9cXF0vZztcbmNvbnN0IGxpbmtfcmVnID0gL1xcW1xcWyguezAsODB9PylcXF1cXF0oW2EteiddKyk/KFxcd3swLDEwfSkvZ2k7IC8vYWxsb3cgZGFuZ2xpbmcgc3VmZml4ZXMgLSBcIltbZmxhbmRlcnNdXSdzXCJcblxuY29uc3QgZXh0ZXJuYWxfbGlua3MgPSBmdW5jdGlvbihsaW5rcywgc3RyKSB7XG4gIHN0ci5yZXBsYWNlKGV4dGVybmFsX2xpbmssIGZ1bmN0aW9uKGFsbCwgcHJvdG9jb2wsIGxpbmssIHRleHQpIHtcbiAgICB0ZXh0ID0gdGV4dCB8fCAnJztcbiAgICBsaW5rcy5wdXNoKHtcbiAgICAgIHR5cGU6ICdleHRlcm5hbCcsXG4gICAgICBzaXRlOiBwcm90b2NvbCArIGxpbmssXG4gICAgICB0ZXh0OiB0ZXh0LnRyaW0oKVxuICAgIH0pO1xuICAgIHJldHVybiB0ZXh0O1xuICB9KTtcbiAgcmV0dXJuIGxpbmtzO1xufTtcblxuY29uc3QgaW50ZXJuYWxfbGlua3MgPSBmdW5jdGlvbihsaW5rcywgc3RyKSB7XG4gIC8vcmVndWxhciBsaW5rc1xuICBzdHIucmVwbGFjZShsaW5rX3JlZywgZnVuY3Rpb24oXywgcywgYXBvc3Ryb3BoZSkge1xuICAgIHZhciB0eHQgPSAnJztcbiAgICB2YXIgbGluayA9IHM7XG4gICAgaWYgKHMubWF0Y2goL1xcfC8pKSB7XG4gICAgICAvL3JlcGxhY2VtZW50IGxpbmsgW1tsaW5rfHRleHRdXVxuICAgICAgcyA9IHMucmVwbGFjZSgvXFxbXFxbKC57Miw4MH0/KVxcXVxcXShcXHd7MCwxMH0pL2csICckMSQyJyk7IC8vcmVtb3ZlIFsncyBhbmQga2VlcCBzdWZmaXhcbiAgICAgIGxpbmsgPSBzLnJlcGxhY2UoLyguezIsNjB9KVxcfC57MCwyMDB9LywgJyQxJyk7IC8vcmVwbGFjZWQgbGlua3NcbiAgICAgIHR4dCA9IHMucmVwbGFjZSgvLnsyLDYwfT9cXHwvLCAnJyk7XG4gICAgICAvL2hhbmRsZSBmdW5reSBjYXNlIG9mIFtbdG9yb250b3xdXVxuICAgICAgaWYgKCF0eHQgJiYgbGluay5tYXRjaCgvXFx8JC8pKSB7XG4gICAgICAgIGxpbmsgPSBsaW5rLnJlcGxhY2UoL1xcfCQvLCAnJyk7XG4gICAgICAgIHR4dCA9IGxpbms7XG4gICAgICB9XG4gICAgfVxuICAgIC8va2lsbCBvZmYgbm9uLXdpa2lwZWRpYSBuYW1lc3BhY2VzXG4gICAgaWYgKGxpbmsubWF0Y2goaWdub3JlX2xpbmtzKSkge1xuICAgICAgcmV0dXJuIHM7XG4gICAgfVxuICAgIC8va2lsbCBvZmYganVzdCBhbmNob3IgbGlua3MgW1sjaGlzdG9yeV1dXG4gICAgaWYgKGxpbmsubWF0Y2goL14jL2kpKSB7XG4gICAgICByZXR1cm4gcztcbiAgICB9XG4gICAgLy9yZW1vdmUgYW5jaG9ycyBmcm9tIGVuZCBbW3Rvcm9udG8jaGlzdG9yeV1dXG4gICAgbGluayA9IGxpbmsucmVwbGFjZSgvI1teIF17MSwxMDB9LywgJycpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBwYWdlOiBoZWxwZXJzLmNhcGl0YWxpc2UobGluayksXG4gICAgICB0ZXh0OiB0eHQgfHwgbGlua1xuICAgIH07XG4gICAgLy9maW5hbGx5LCBzdXBwb3J0IFtbbGlua11dJ3MgYXBvc3Ryb3BoZVxuICAgIGlmIChhcG9zdHJvcGhlKSB7XG4gICAgICBvYmoudGV4dCArPSBhcG9zdHJvcGhlO1xuICAgIH1cbiAgICBsaW5rcy5wdXNoKG9iaik7XG4gICAgcmV0dXJuIHM7XG4gIH0pO1xuICByZXR1cm4gbGlua3M7XG59O1xuXG4vL2dyYWIgYW4gYXJyYXkgb2YgaW50ZXJuYWwgbGlua3MgaW4gdGhlIHRleHRcbmNvbnN0IHBhcnNlX2xpbmtzID0gZnVuY3Rpb24oc3RyKSB7XG4gIGxldCBsaW5rcyA9IFtdO1xuICAvL2ZpcnN0LCBwYXJzZSBleHRlcm5hbCBsaW5rc1xuICBsaW5rcyA9IGV4dGVybmFsX2xpbmtzKGxpbmtzLCBzdHIpO1xuICAvL2ludGVybmFsIGxpbmtzXG4gIGxpbmtzID0gaW50ZXJuYWxfbGlua3MobGlua3MsIHN0cik7XG5cbiAgaWYgKGxpbmtzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgcmV0dXJuIGxpbmtzO1xufTtcbm1vZHVsZS5leHBvcnRzID0gcGFyc2VfbGlua3M7XG4iLCIvL3NwbGl0IHRleHQgaW50byBzZW50ZW5jZXMsIHVzaW5nIHJlZ2V4XG4vL0BzcGVuY2VybW91bnRhaW4gTUlUXG5cbi8vKFJ1bGUtYmFzZWQgc2VudGVuY2UgYm91bmRhcnkgc2VnbWVudGF0aW9uKSAtIGNob3AgZ2l2ZW4gdGV4dCBpbnRvIGl0cyBwcm9wZXIgc2VudGVuY2VzLlxuLy8gSWdub3JlIHBlcmlvZHMvcXVlc3Rpb25zL2V4Y2xhbWF0aW9ucyB1c2VkIGluIGFjcm9ueW1zL2FiYnJldmlhdGlvbnMvbnVtYmVycywgZXRjLlxuLy8gQHNwZW5jZXJtb3VudGFpbiAyMDE1IE1JVFxuJ3VzZSBzdHJpY3QnO1xuY29uc3QgYWJicmV2aWF0aW9ucyA9IHJlcXVpcmUoJy4uLy4uLy4uL2RhdGEvYWJicmV2aWF0aW9ucycpO1xuY29uc3QgYWJicmV2X3JlZyA9IG5ldyBSZWdFeHAoJyhefCApKCcgKyBhYmJyZXZpYXRpb25zLmpvaW4oJ3wnKSArICcpWy4hP10gPyQnLCAnaScpO1xuY29uc3QgYWNyb255bV9yZWcgPSBuZXcgUmVnRXhwKCdbIHwuXVtBLVpdLj8gKz8kJywgJ2knKTtcbmNvbnN0IGVsaXBzZXNfcmVnID0gbmV3IFJlZ0V4cCgnXFxcXC5cXFxcLlxcXFwuKiArPyQnKTtcbmNvbnN0IGhhc1dvcmQgPSBuZXcgUmVnRXhwKCdbYS16XVthLXpdJywgJ2knKTtcblxuLy90dXJuIGEgbmVzdGVkIGFycmF5IGludG8gb25lIGFycmF5XG5jb25zdCBmbGF0dGVuID0gZnVuY3Rpb24oYXJyKSB7XG4gIGxldCBhbGwgPSBbXTtcbiAgYXJyLmZvckVhY2goZnVuY3Rpb24oYSkge1xuICAgIGFsbCA9IGFsbC5jb25jYXQoYSk7XG4gIH0pO1xuICByZXR1cm4gYWxsO1xufTtcblxuY29uc3QgbmFpaXZlX3NwbGl0ID0gZnVuY3Rpb24odGV4dCkge1xuICAvL2ZpcnN0LCBzcGxpdCBieSBuZXdsaW5lXG4gIGxldCBzcGxpdHMgPSB0ZXh0LnNwbGl0KC8oXFxuKykvKTtcbiAgc3BsaXRzID0gc3BsaXRzLmZpbHRlcihzID0+IHMubWF0Y2goL1xcUy8pKTtcbiAgLy9zcGxpdCBieSBwZXJpb2QsIHF1ZXN0aW9uLW1hcmssIGFuZCBleGNsYW1hdGlvbi1tYXJrXG4gIHNwbGl0cyA9IHNwbGl0cy5tYXAoZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zcGxpdCgvKFxcUy4rP1suIT9dKSg/PVxccyt8JCkvZyk7XG4gIH0pO1xuICByZXR1cm4gZmxhdHRlbihzcGxpdHMpO1xufTtcblxuLy8gaWYgdGhpcyBsb29rcyBsaWtlIGEgcGVyaW9kIHdpdGhpbiBhIHdpa2lwZWRpYSBsaW5rLCByZXR1cm4gZmFsc2VcbmNvbnN0IGlzQmFsYW5jZWQgPSBmdW5jdGlvbihzdHIpIHtcbiAgc3RyID0gc3RyIHx8ICcnO1xuICBjb25zdCBvcGVuID0gc3RyLnNwbGl0KC9cXFtcXFsvKSB8fCBbXTtcbiAgY29uc3QgY2xvc2VkID0gc3RyLnNwbGl0KC9cXF1cXF0vKSB8fCBbXTtcbiAgaWYgKG9wZW4ubGVuZ3RoID4gY2xvc2VkLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvL21ha2Ugc3VyZSBxdW90ZXMgYXJlIGNsb3NlZCB0b29cbiAgY29uc3QgcXVvdGVzID0gc3RyLm1hdGNoKC9cIi9nKTtcbiAgaWYgKHF1b3RlcyAmJiBxdW90ZXMubGVuZ3RoICUgMiAhPT0gMCAmJiBzdHIubGVuZ3RoIDwgOTAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuY29uc3Qgc2VudGVuY2VfcGFyc2VyID0gZnVuY3Rpb24odGV4dCkge1xuICBsZXQgc2VudGVuY2VzID0gW107XG4gIC8vZmlyc3QgZG8gYSBncmVlZHktc3BsaXQuLlxuICBsZXQgY2h1bmtzID0gW107XG4gIC8vZW5zdXJlIGl0ICdzbWVsbHMgbGlrZScgYSBzZW50ZW5jZVxuICBpZiAoIXRleHQgfHwgdHlwZW9mIHRleHQgIT09ICdzdHJpbmcnIHx8ICF0ZXh0Lm1hdGNoKC9cXHcvKSkge1xuICAgIHJldHVybiBzZW50ZW5jZXM7XG4gIH1cbiAgLy8gVGhpcyB3YXMgdGhlIHNwbGl0dGVyIHJlZ2V4IHVwZGF0ZWQgdG8gZml4IHF1b3RlZCBwdW5jdHVhdGlvbiBtYXJrcy5cbiAgLy8gbGV0IHNwbGl0cyA9IHRleHQuc3BsaXQoLyhcXFMuKz9bLlxcPyFdKSg/PVxccyt8JHxcIikvZyk7XG4gIC8vIHRvZG86IGxvb2sgZm9yIHNpZGUgZWZmZWN0cyBpbiB0aGlzIHJlZ2V4IHJlcGxhY2VtZW50OlxuICBsZXQgc3BsaXRzID0gbmFpaXZlX3NwbGl0KHRleHQpO1xuICAvL2ZpbHRlci1vdXQgdGhlIGdyYXAgb25lc1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0cy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBzID0gc3BsaXRzW2ldO1xuICAgIGlmICghcyB8fCBzID09PSAnJykge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIC8vdGhpcyBpcyBtZWFuaW5nZnVsIHdoaXRlc3BhY2VcbiAgICBpZiAoIXMubWF0Y2goL1xcUy8pKSB7XG4gICAgICAvL2FkZCBpdCB0byB0aGUgbGFzdCBvbmVcbiAgICAgIGlmIChjaHVua3NbY2h1bmtzLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgIGNodW5rc1tjaHVua3MubGVuZ3RoIC0gMV0gKz0gcztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2UgaWYgKHNwbGl0c1tpICsgMV0pIHtcbiAgICAgICAgLy9hZGQgaXQgdG8gdGhlIG5leHQgb25lXG4gICAgICAgIHNwbGl0c1tpICsgMV0gPSBzICsgc3BsaXRzW2kgKyAxXTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICAgIGNodW5rcy5wdXNoKHMpO1xuICB9XG5cbiAgLy9kZXRlY3Rpb24gb2Ygbm9uLXNlbnRlbmNlIGNodW5rc1xuICBjb25zdCBpc1NlbnRlbmNlID0gZnVuY3Rpb24oaG1tKSB7XG4gICAgaWYgKGhtbS5tYXRjaChhYmJyZXZfcmVnKSB8fCBobW0ubWF0Y2goYWNyb255bV9yZWcpIHx8IGhtbS5tYXRjaChlbGlwc2VzX3JlZykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy90b28gc2hvcnQ/IC0gbm8gY29uc2VjdXRpdmUgbGV0dGVyc1xuICAgIGlmIChoYXNXb3JkLnRlc3QoaG1tKSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFpc0JhbGFuY2VkKGhtbSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy9sb29wIHRocm91Z2ggdGhlc2UgY2h1bmtzLCBhbmQgam9pbiB0aGUgbm9uLXNlbnRlbmNlIGNodW5rcyBiYWNrIHRvZ2V0aGVyLi5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaHVua3MubGVuZ3RoOyBpKyspIHtcbiAgICAvL3Nob3VsZCB0aGlzIGNodW5rIGJlIGNvbWJpbmVkIHdpdGggdGhlIG5leHQgb25lP1xuICAgIGlmIChjaHVua3NbaSArIDFdICYmICFpc1NlbnRlbmNlKGNodW5rc1tpXSkpIHtcbiAgICAgIGNodW5rc1tpICsgMV0gPSBjaHVua3NbaV0gKyAoY2h1bmtzW2kgKyAxXSB8fCAnJyk7IC8vLnJlcGxhY2UoLyArL2csICcgJyk7XG4gICAgfSBlbHNlIGlmIChjaHVua3NbaV0gJiYgY2h1bmtzW2ldLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vdGhpcyBjaHVuayBpcyBhIHByb3BlciBzZW50ZW5jZS4uXG4gICAgICBzZW50ZW5jZXMucHVzaChjaHVua3NbaV0pO1xuICAgICAgY2h1bmtzW2ldID0gJyc7XG4gICAgfVxuICB9XG4gIC8vaWYgd2UgbmV2ZXIgZ290IGEgc2VudGVuY2UsIHJldHVybiB0aGUgZ2l2ZW4gdGV4dFxuICBpZiAoc2VudGVuY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBbdGV4dF07XG4gIH1cbiAgcmV0dXJuIHNlbnRlbmNlcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gc2VudGVuY2VfcGFyc2VyO1xuLy8gY29uc29sZS5sb2coc2VudGVuY2VfcGFyc2VyKCdUb255IGlzIG5pY2UuIEhlIGxpdmVzIGluIEphcGFuLicpLmxlbmd0aCA9PT0gMik7XG4iLCIvL2Fzc29ydGVkIHBhcnNpbmcgbWV0aG9kcyBmb3IgZGF0ZS90aW1lIHRlbXBsYXRlc1xuY29uc3QgbW9udGhzID0gW1xuICB1bmRlZmluZWQsIC8vMS1iYXNlZCBtb250aHMuLiA6L1xuICAnSmFudWFyeScsXG4gICdGZWJydWFyeScsXG4gICdNYXJjaCcsXG4gICdBcHJpbCcsXG4gICdNYXknLFxuICAnSnVuZScsXG4gICdKdWx5JyxcbiAgJ0F1Z3VzdCcsXG4gICdTZXB0ZW1iZXInLFxuICAnT2N0b2JlcicsXG4gICdOb3ZlbWJlcicsXG4gICdEZWNlbWJlcicsXG5dO1xuXG4vL3BhcnNlIHllYXJ8bW9udGh8ZGF0ZSBudW1iZXJzXG5jb25zdCB5bWQgPSBmdW5jdGlvbihhcnIpIHtcbiAgbGV0IG9iaiA9IHt9O1xuICBsZXQgdW5pdHMgPSBbJ3llYXInLCAnbW9udGgnLCAnZGF0ZScsICdob3VyJywgJ21pbnV0ZScsICdzZWNvbmQnXTtcbiAgZm9yKGxldCBpID0gMDsgaSA8IHVuaXRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKCFhcnJbaV0gJiYgYXJyWzFdICE9PSAwKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgb2JqW3VuaXRzW2ldXSA9IHBhcnNlSW50KGFycltpXSwgMTApO1xuICAgIGlmIChpc05hTihvYmpbdW5pdHNbaV1dKSkge1xuICAgICAgZGVsZXRlIG9ialt1bml0c1tpXV07XG4gICAgfVxuICB9XG4gIC8vdHJ5IGZvciB0aW1lem9uZSx0b28gZnR3XG4gIGxldCBsYXN0ID0gYXJyW2Fyci5sZW5ndGggLSAxXSB8fCAnJztcbiAgbGFzdCA9IFN0cmluZyhsYXN0KTtcbiAgaWYgKGxhc3QudG9Mb3dlckNhc2UoKSA9PT0gJ3onKSB7XG4gICAgb2JqLnR6ID0gJ1VUQyc7XG4gIH0gZWxzZSBpZiAoL1srLV1bMC05XSs6WzAtOV0vLnRlc3QobGFzdCkpIHtcbiAgICBvYmoudHogPSBhcnJbNl07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn07XG5cbi8vemVyby1wYWQgYSBudW1iZXJcbmNvbnN0IHBhZCA9IGZ1bmN0aW9uKG51bSkge1xuICBpZiAobnVtIDwgMTApIHtcbiAgICByZXR1cm4gJzAnICsgbnVtO1xuICB9XG4gIHJldHVybiBTdHJpbmcobnVtKTtcbn07XG5cbmNvbnN0IHRvVGV4dCA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgLy9lZyAnMTk5NSdcbiAgbGV0IHN0ciA9IFN0cmluZyhkYXRlLnllYXIpIHx8ICcnO1xuICBpZiAoZGF0ZS5tb250aCAhPT0gdW5kZWZpbmVkICYmIG1vbnRocy5oYXNPd25Qcm9wZXJ0eShkYXRlLm1vbnRoKSA9PT0gdHJ1ZSkge1xuICAgIGlmIChkYXRlLmRhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy9KYW51YXJ5IDE5OTVcbiAgICAgIHN0ciA9IGAke21vbnRoc1tkYXRlLm1vbnRoXX0gJHtkYXRlLnllYXJ9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9KYW51YXJ5IDUsIDE5OTVcbiAgICAgIHN0ciA9IGAke21vbnRoc1tkYXRlLm1vbnRoXX0gJHtkYXRlLmRhdGV9LCAke2RhdGUueWVhcn1gO1xuICAgICAgLy9hZGQgdGltZXMsIGlmIGF2YWlsYWJsZVxuICAgICAgaWYgKGRhdGUuaG91ciAhPT0gdW5kZWZpbmVkICYmIGRhdGUubWludXRlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IHRpbWUgPSBgJHtwYWQoZGF0ZS5ob3VyKX06JHtwYWQoZGF0ZS5taW51dGUpfWA7XG4gICAgICAgIGlmIChkYXRlLnNlY29uZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGltZSA9IHRpbWUgKyAnOicgKyBwYWQoZGF0ZS5zZWNvbmQpO1xuICAgICAgICB9XG4gICAgICAgIHN0ciA9IHRpbWUgKyAnLCAnICsgc3RyO1xuICAgICAgLy9hZGQgdGltZXpvbmUsIGlmIHRoZXJlLCBhdCB0aGUgZW5kIGluIGJyYWNrZXRzXG4gICAgICB9XG4gICAgICBpZiAoZGF0ZS50eikge1xuICAgICAgICBzdHIgKz0gYCAoJHtkYXRlLnR6fSlgO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHRvVGV4dDogdG9UZXh0LFxuICB5bWQ6IHltZCxcbn07XG4iLCIvL3RoaXMgaXMgYWxsb3dlZCB0byBiZSByb3VnaFxuY29uc3QgZGF5ID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbmNvbnN0IG1vbnRoID0gZGF5ICogMzA7XG5jb25zdCB5ZWFyID0gZGF5ICogMzY1O1xuXG5jb25zdCBnZXRFcG9jaCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gbmV3IERhdGUoYCR7b2JqLnllYXJ9LSR7b2JqLm1vbnRoIHx8IDB9LSR7b2JqLmRhdGUgfHwgMX1gKS5nZXRUaW1lKCk7XG59O1xuXG4vL3Zlcnkgcm91Z2ghXG5jb25zdCBkZWx0YSA9IGZ1bmN0aW9uKGZyb20sIHRvKSB7XG4gIGZyb20gPSBnZXRFcG9jaChmcm9tKTtcbiAgdG8gPSBnZXRFcG9jaCh0byk7XG4gIGxldCBkaWZmID0gdG8gLSBmcm9tO1xuICBsZXQgb2JqID0ge307XG4gIC8vZ2V0IHllYXJzXG4gIGxldCB5ZWFycyA9IE1hdGguZmxvb3IoZGlmZiAvIHllYXIsIDEwKTtcbiAgaWYgKHllYXJzID4gMCkge1xuICAgIG9iai55ZWFycyA9IHllYXJzO1xuICAgIGRpZmYgLT0gKG9iai55ZWFycyAqIHllYXIpO1xuICB9XG4gIC8vZ2V0IG1vbnRoc1xuICBsZXQgbW9udGhzID0gTWF0aC5mbG9vcihkaWZmIC8gbW9udGgsIDEwKTtcbiAgaWYgKG1vbnRocyA+IDApIHtcbiAgICBvYmoubW9udGhzID0gbW9udGhzO1xuICAgIGRpZmYgLT0gKG9iai5tb250aHMgKiBtb250aCk7XG4gIH1cbiAgLy9nZXQgZGF5c1xuICBsZXQgZGF5cyA9IE1hdGguZmxvb3IoZGlmZiAvIGRheSwgMTApO1xuICBpZiAoZGF5cyA+IDApIHtcbiAgICBvYmouZGF5cyA9IGRheXM7XG4gIC8vIGRpZmYgLT0gKG9iai5kYXlzICogZGF5KTtcbiAgfVxuICByZXR1cm4gb2JqO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWx0YTtcbiIsImNvbnN0IHBhcnNlcnMgPSByZXF1aXJlKCcuL3BhcnNlcnMnKTtcbmNvbnN0IHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzJyk7XG5cbi8vZ2V0IGlkZW50aXR5IG9mIHRlbXBsYXRlIC0gVGVtcGxhdGU6Rm9vXG5jb25zdCBnZXROYW1lID0gZnVuY3Rpb24odG1wbCkge1xuICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7LywgJycpO1xuICB0bXBsID0gdG1wbC5yZXBsYWNlKC9cXH1cXH0kLywgJycpO1xuICBsZXQgbmFtZSA9IHRtcGwuc3BsaXQoL1xcfC8pWzBdIHx8ICcnO1xuICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcbiAgLy8gbmFtZSA9IG5hbWUucmVwbGFjZSgvLS9nLCAnICcpO1xuICByZXR1cm4gbmFtZTtcbn07XG5cbi8vcnVuIGVhY2ggcmVtYWluaW5nIHt7dGVtcGxhdGV9fSB0aHJvdWdoIG91ciBwYXJzZXJzXG5jb25zdCBwYXJzZVRlbXBsYXRlcyA9IGZ1bmN0aW9uKG9iaikge1xuICBsZXQgbGlzdCA9IG9iai50ZXh0Lm1hdGNoKC9cXHtcXHsoW159XSspXFx9XFx9L2cpIHx8IFtdO1xuICBsaXN0ID0gbGlzdC5tYXAoKHRtcGwpID0+IHtcbiAgICBsZXQgbmFtZSA9IGdldE5hbWUodG1wbCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICByYXc6IHRtcGxcbiAgICB9O1xuICB9KTtcbiAgLy90cnkgcGFyc2luZyBlYWNoIHRlbXBsYXRlXG4gIGxpc3QuZm9yRWFjaCgodCkgPT4ge1xuICAgIC8vcmVtb3ZlIHRoZSB7eydzICYgfX0nc1xuICAgIHQudG1wbCA9IHQucmF3LnJlcGxhY2UoL15cXHtcXHsvLCAnJyk7XG4gICAgdC50bXBsID0gdC50bXBsLnJlcGxhY2UoL1xcfVxcfSQvLCAnJyk7XG4gICAgaWYgKHBhcnNlcnMuaGFzT3duUHJvcGVydHkodGVtcGxhdGVzW3QubmFtZV0pID09PSB0cnVlKSB7XG4gICAgICBsZXQgcGFyc2VyID0gdGVtcGxhdGVzW3QubmFtZV07XG4gICAgICBsZXQgcmVzdWx0ID0gcGFyc2Vyc1twYXJzZXJdKHQudG1wbCwgb2JqKTtcbiAgICAgIG9iai50ZXh0ID0gb2JqLnRleHQucmVwbGFjZSh0LnJhdywgcmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9vdGhlcndpc2UsIGp1c3QgcmVtb3ZlIGl0IGZyb20gdGhlIHRleHRcbiAgICAgIG9iai50ZXh0ID0gb2JqLnRleHQucmVwbGFjZSh0LnJhdywgJycpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmo7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBwYXJzZVRlbXBsYXRlcztcbiIsImNvbnN0IGRhdGVzID0gcmVxdWlyZSgnLi9kYXRlcycpO1xuY29uc3QgeW1kID0gZGF0ZXMueW1kO1xuY29uc3QgdG9UZXh0ID0gZGF0ZXMudG9UZXh0O1xuY29uc3QgZGVsdGEgPSByZXF1aXJlKCcuL2RlbHRhX2RhdGUnKTtcblxuY29uc3QgZ2V0Qm90aCA9IGZ1bmN0aW9uKHRtcGwpIHtcbiAgbGV0IGFyciA9IHRtcGwuc3BsaXQoJ3wnKTtcbiAgbGV0IGZyb20gPSB5bWQoYXJyLnNsaWNlKDEsIDQpKTtcbiAgbGV0IHRvID0gYXJyLnNsaWNlKDQsIDcpO1xuICAvL2Fzc3VtZSBub3csIGlmICd0bycgaXMgZW1wdHlcbiAgaWYgKHRvLmxlbmd0aCA9PT0gMCkge1xuICAgIGxldCBkID0gbmV3IERhdGUoKTtcbiAgICB0byA9IFtkLmdldEZ1bGxZZWFyKCksIGQuZ2V0TW9udGgoKSwgZC5nZXREYXRlKCldO1xuICB9XG4gIHRvID0geW1kKHRvKTtcbiAgcmV0dXJuIHtcbiAgICBmcm9tOiBmcm9tLFxuICAgIHRvOiB0b1xuICB9O1xufTtcblxuY29uc3QgcGFyc2VycyA9IHtcblxuICAvL2dlbmVyaWMge3tkYXRlfHllYXJ8bW9udGh8ZGF0ZX19IHRlbXBsYXRlXG4gIGRhdGU6ICh0bXBsLCBvYmopID0+IHtcbiAgICBsZXQgYXJyID0gdG1wbC5zcGxpdCgnfCcpO1xuICAgIGFyciA9IGFyci5zbGljZSgxLCA4KTtcbiAgICAvL3N1cHBvcnQgJ2RmPXllc3wxODk0fDd8MjYnXG4gICAgaWYgKGFyclswXSAmJiAvXmRmPS8udGVzdChhcnJbMF0pKSB7XG4gICAgICBhcnIuc2hpZnQoKTtcbiAgICB9XG4gICAgbGV0IGRhdGUgPSB5bWQoYXJyKTtcbiAgICBkYXRlLnRleHQgPSB0b1RleHQoZGF0ZSk7IC8vbWFrZSB0aGUgcmVwbGFjZW1lbnQgc3RyaW5nXG4gICAgb2JqLmRhdGVzID0gb2JqLmRhdGVzIHx8IFtdO1xuICAgIG9iai5kYXRlcy5wdXNoKGRhdGUpO1xuICAgIHJldHVybiBkYXRlLnRleHQ7XG4gIH0sXG5cbiAgLy9zdXBwb3J0IHBhcnNpbmcgb2YgJ0ZlYnJ1YXJ5IDEwLCAxOTkyJ1xuICBuYXR1cmFsX2RhdGU6ICh0bXBsLCBvYmopID0+IHtcbiAgICBsZXQgYXJyID0gdG1wbC5zcGxpdCgnfCcpO1xuICAgIGxldCBzdHIgPSBhcnJbMV0gfHwgJyc7XG4gICAgLy8gLSBqdXN0IGEgeWVhclxuICAgIGxldCBkYXRlID0ge307XG4gICAgaWYgKC9eWzAtOV17NH0kLy50ZXN0KGFyclsxXSkpIHtcbiAgICAgIGRhdGUueWVhciA9IHBhcnNlSW50KGFyclsxXSwgMTApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL3BhcnNlIHRoZSBkYXRlLCB1c2luZyB0aGUganMgZGF0ZSBvYmplY3QgKGZvciBub3c/KVxuICAgICAgbGV0IHR4dCA9IGFyclsxXS5yZXBsYWNlKC9bYS16XStcXC9bYS16XSsvaSk7XG4gICAgICB0eHQgPSB0eHQucmVwbGFjZSgvWzAtOV0rOlswLTldKyhhbXxwbSk/L2kpO1xuICAgICAgbGV0IGQgPSBuZXcgRGF0ZSh0eHQpO1xuICAgICAgaWYgKGlzTmFOKGQuZ2V0VGltZSgpKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgZGF0ZS55ZWFyID0gZC5nZXRGdWxsWWVhcigpO1xuICAgICAgICBkYXRlLm1vbnRoID0gZC5nZXRNb250aCgpICsgMTtcbiAgICAgICAgZGF0ZS5kYXRlID0gZC5nZXREYXRlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIG9iai5kYXRlcyA9IG9iai5kYXRlcyB8fCBbXTtcbiAgICBvYmouZGF0ZXMucHVzaChkYXRlKTtcbiAgICByZXR1cm4gc3RyLnRyaW0oKTtcbiAgfSxcblxuICAvL2p1c3QgZ3JhYiB0aGUgZmlyc3QgdmFsdWUsIGFuZCBhc3N1bWUgaXQncyBhIHllYXJcbiAgb25lX3llYXI6ICh0bXBsLCBvYmopID0+IHtcbiAgICBsZXQgYXJyID0gdG1wbC5zcGxpdCgnfCcpO1xuICAgIGxldCBzdHIgPSBhcnJbMV0gfHwgJyc7XG4gICAgbGV0IHllYXIgPSBwYXJzZUludChzdHIsIDEwKTtcbiAgICBvYmouZGF0ZXMgPSBvYmouZGF0ZXMgfHwgW107XG4gICAgb2JqLmRhdGVzLnB1c2goe1xuICAgICAgeWVhcjogeWVhclxuICAgIH0pO1xuICAgIHJldHVybiBzdHIudHJpbSgpO1xuICB9LFxuXG4gIC8vYXNzdW1lICd5fG18ZCcgfCAneXxtfGQnXG4gIHR3b19kYXRlczogKHRtcGwsIG9iaikgPT4ge1xuICAgIGxldCBhcnIgPSB0bXBsLnNwbGl0KCd8Jyk7XG4gICAgLy8nYicgbWVhbnMgc2hvdyBiaXJ0aC1kYXRlLCBvdGhlcndpc2Ugc2hvdyBkZWF0aC1kYXRlXG4gICAgaWYgKGFyclsxXSA9PT0gJ0InIHx8IGFyclsxXSA9PT0gJ2InKSB7XG4gICAgICBsZXQgZGF0ZSA9IHltZChhcnIuc2xpY2UoMiwgNSkpO1xuICAgICAgb2JqLmRhdGVzID0gb2JqLmRhdGVzIHx8IFtdO1xuICAgICAgb2JqLmRhdGVzLnB1c2goZGF0ZSk7XG4gICAgICByZXR1cm4gdG9UZXh0KGRhdGUpO1xuICAgIH1cbiAgICBsZXQgZGF0ZSA9IHltZChhcnIuc2xpY2UoNSwgOCkpO1xuICAgIG9iai5kYXRlcyA9IG9iai5kYXRlcyB8fCBbXTtcbiAgICBvYmouZGF0ZXMucHVzaChkYXRlKTtcbiAgICByZXR1cm4gdG9UZXh0KGRhdGUpO1xuICB9LFxuXG4gICdhZ2UnOiAodG1wbCkgPT4ge1xuICAgIGxldCBkID0gZ2V0Qm90aCh0bXBsKTtcbiAgICBsZXQgZGlmZiA9IGRlbHRhKGQuZnJvbSwgZC50byk7XG4gICAgcmV0dXJuIGRpZmYueWVhcnMgfHwgMDtcbiAgfSxcblxuICAnZGlmZi15JzogKHRtcGwpID0+IHtcbiAgICBsZXQgZCA9IGdldEJvdGgodG1wbCk7XG4gICAgbGV0IGRpZmYgPSBkZWx0YShkLmZyb20sIGQudG8pO1xuICAgIGlmIChkaWZmLnllYXJzID09PSAxKSB7XG4gICAgICByZXR1cm4gZGlmZi55ZWFycyArICcgeWVhcic7XG4gICAgfVxuICAgIHJldHVybiAoZGlmZi55ZWFycyB8fCAwKSArICcgeWVhcnMnO1xuICB9LFxuICAnZGlmZi15bSc6ICh0bXBsKSA9PiB7XG4gICAgbGV0IGQgPSBnZXRCb3RoKHRtcGwpO1xuICAgIGxldCBkaWZmID0gZGVsdGEoZC5mcm9tLCBkLnRvKTtcbiAgICBsZXQgYXJyID0gW107XG4gICAgaWYgKGRpZmYueWVhcnMgPT09IDEpIHtcbiAgICAgIGFyci5wdXNoKGRpZmYueWVhcnMgKyAnIHllYXInKTtcbiAgICB9IGVsc2UgaWYgKGRpZmYueWVhcnMgJiYgZGlmZi55ZWFycyAhPT0gMCkge1xuICAgICAgYXJyLnB1c2goZGlmZi55ZWFycyArICcgeWVhcnMnKTtcbiAgICB9XG4gICAgaWYgKGRpZmYubW9udGhzID09PSAxKSB7XG4gICAgICBhcnIucHVzaCgnMSBtb250aCcpO1xuICAgIH0gZWxzZSBpZiAoZGlmZi5tb250aHMgJiYgZGlmZi5tb250aHMgIT09IDApIHtcbiAgICAgIGFyci5wdXNoKGRpZmYubW9udGhzICsgJyBtb250aHMnKTtcbiAgICB9XG4gICAgcmV0dXJuIGFyci5qb2luKCcsICcpO1xuICB9LFxuICAnZGlmZi15bWQnOiAodG1wbCkgPT4ge1xuICAgIGxldCBkID0gZ2V0Qm90aCh0bXBsKTtcbiAgICBsZXQgZGlmZiA9IGRlbHRhKGQuZnJvbSwgZC50byk7XG4gICAgbGV0IGFyciA9IFtdO1xuICAgIGlmIChkaWZmLnllYXJzID09PSAxKSB7XG4gICAgICBhcnIucHVzaChkaWZmLnllYXJzICsgJyB5ZWFyJyk7XG4gICAgfSBlbHNlIGlmIChkaWZmLnllYXJzICYmIGRpZmYueWVhcnMgIT09IDApIHtcbiAgICAgIGFyci5wdXNoKGRpZmYueWVhcnMgKyAnIHllYXJzJyk7XG4gICAgfVxuICAgIGlmIChkaWZmLm1vbnRocyA9PT0gMSkge1xuICAgICAgYXJyLnB1c2goJzEgbW9udGgnKTtcbiAgICB9IGVsc2UgaWYgKGRpZmYubW9udGhzICYmIGRpZmYubW9udGhzICE9PSAwKSB7XG4gICAgICBhcnIucHVzaChkaWZmLm1vbnRocyArICcgbW9udGhzJyk7XG4gICAgfVxuICAgIGlmIChkaWZmLmRheXMgPT09IDEpIHtcbiAgICAgIGFyci5wdXNoKCcxIGRheScpO1xuICAgIH0gZWxzZSBpZiAoZGlmZi5kYXlzICYmIGRpZmYuZGF5cyAhPT0gMCkge1xuICAgICAgYXJyLnB1c2goZGlmZi5kYXlzICsgJyBkYXlzJyk7XG4gICAgfVxuICAgIHJldHVybiBhcnIuam9pbignLCAnKTtcbiAgfSxcbiAgJ2RpZmYteWQnOiAodG1wbCkgPT4ge1xuICAgIGxldCBkID0gZ2V0Qm90aCh0bXBsKTtcbiAgICBsZXQgZGlmZiA9IGRlbHRhKGQuZnJvbSwgZC50byk7XG4gICAgbGV0IGFyciA9IFtdO1xuICAgIGlmIChkaWZmLnllYXJzID09PSAxKSB7XG4gICAgICBhcnIucHVzaChkaWZmLnllYXJzICsgJyB5ZWFyJyk7XG4gICAgfSBlbHNlIGlmIChkaWZmLnllYXJzICYmIGRpZmYueWVhcnMgIT09IDApIHtcbiAgICAgIGFyci5wdXNoKGRpZmYueWVhcnMgKyAnIHllYXJzJyk7XG4gICAgfVxuICAgIC8vZXJnaC4uLlxuICAgIGRpZmYuZGF5cyArPSAoZGlmZi5tb250aHMgfHwgMCkgKiAzMDtcbiAgICBpZiAoZGlmZi5kYXlzID09PSAxKSB7XG4gICAgICBhcnIucHVzaCgnMSBkYXknKTtcbiAgICB9IGVsc2UgaWYgKGRpZmYuZGF5cyAmJiBkaWZmLmRheXMgIT09IDApIHtcbiAgICAgIGFyci5wdXNoKGRpZmYuZGF5cyArICcgZGF5cycpO1xuICAgIH1cbiAgICByZXR1cm4gYXJyLmpvaW4oJywgJyk7XG4gIH0sXG4gICdkaWZmLWQnOiAodG1wbCkgPT4ge1xuICAgIGxldCBkID0gZ2V0Qm90aCh0bXBsKTtcbiAgICBsZXQgZGlmZiA9IGRlbHRhKGQuZnJvbSwgZC50byk7XG4gICAgbGV0IGFyciA9IFtdO1xuICAgIC8vZXJnaC4uLlxuICAgIGRpZmYuZGF5cyArPSAoZGlmZi55ZWFycyB8fCAwKSAqIDM2NTtcbiAgICBkaWZmLmRheXMgKz0gKGRpZmYubW9udGhzIHx8IDApICogMzA7XG4gICAgaWYgKGRpZmYuZGF5cyA9PT0gMSkge1xuICAgICAgYXJyLnB1c2goJzEgZGF5Jyk7XG4gICAgfSBlbHNlIGlmIChkaWZmLmRheXMgJiYgZGlmZi5kYXlzICE9PSAwKSB7XG4gICAgICBhcnIucHVzaChkaWZmLmRheXMgKyAnIGRheXMnKTtcbiAgICB9XG4gICAgcmV0dXJuIGFyci5qb2luKCcsICcpO1xuICB9LFxuXG59O1xubW9kdWxlLmV4cG9ydHMgPSBwYXJzZXJzO1xuIiwiLy90ZW1wbGF0ZXMgd2Ugc3VwcG9ydFxuY29uc3Qga2VlcCA9IHtcbiAgJ21haW4nOiB0cnVlLFxuICAnbWFpbiBhcnRpY2xlJzogdHJ1ZSxcbiAgJ3dpZGUgaW1hZ2UnOiB0cnVlLFxuICAnY29vcmQnOiB0cnVlLFxuXG4gIC8vZGF0ZS9hZ2UvdGltZSB0ZW1wbGF0ZXNcbiAgJ3N0YXJ0JzogJ2RhdGUnLFxuICAnZW5kJzogJ2RhdGUnLFxuICAnYmlydGgnOiAnZGF0ZScsXG4gICdkZWF0aCc6ICdkYXRlJyxcbiAgJ3N0YXJ0IGRhdGUnOiAnZGF0ZScsXG4gICdlbmQgZGF0ZSc6ICdkYXRlJyxcbiAgJ2JpcnRoIGRhdGUnOiAnZGF0ZScsXG4gICdkZWF0aCBkYXRlJzogJ2RhdGUnLFxuICAnc3RhcnQgZGF0ZSBhbmQgYWdlJzogJ2RhdGUnLFxuICAnZW5kIGRhdGUgYW5kIGFnZSc6ICdkYXRlJyxcbiAgJ2JpcnRoIGRhdGUgYW5kIGFnZSc6ICdkYXRlJyxcbiAgJ2RlYXRoIGRhdGUgYW5kIGFnZSc6ICdkYXRlJyxcbiAgJ2JpcnRoIGRhdGUgYW5kIGdpdmVuIGFnZSc6ICdkYXRlJyxcbiAgJ2RlYXRoIGRhdGUgYW5kIGdpdmVuIGFnZSc6ICdkYXRlJyxcbiAgJ2JpcnRoIHllYXIgYW5kIGFnZSc6ICdvbmVfeWVhcicsXG4gICdkZWF0aCB5ZWFyIGFuZCBhZ2UnOiAnb25lX3llYXInLFxuXG4gIC8vdGhpcyBpcyBpbnNhbmUgKGh5cGhlbiBvbmVzIGFyZSBkaWZmZXJlbnQpXG4gICdzdGFydC1kYXRlJzogJ25hdHVyYWxfZGF0ZScsXG4gICdlbmQtZGF0ZSc6ICduYXR1cmFsX2RhdGUnLFxuICAnYmlydGgtZGF0ZSc6ICduYXR1cmFsX2RhdGUnLFxuICAnZGVhdGgtZGF0ZSc6ICduYXR1cmFsX2RhdGUnLFxuICAnYmlydGgtZGF0ZSBhbmQgYWdlJzogJ25hdHVyYWxfZGF0ZScsXG4gICdiaXJ0aC1kYXRlIGFuZCBnaXZlbiBhZ2UnOiAnbmF0dXJhbF9kYXRlJyxcbiAgJ2RlYXRoLWRhdGUgYW5kIGFnZSc6ICduYXR1cmFsX2RhdGUnLFxuICAnZGVhdGgtZGF0ZSBhbmQgZ2l2ZW4gYWdlJzogJ25hdHVyYWxfZGF0ZScsXG5cbiAgJ2JpcnRoZGVhdGhhZ2UnOiAndHdvX2RhdGVzJyxcbiAgJ2RvYic6ICdkYXRlJyxcbiAgJ2JkYSc6ICdkYXRlJyxcbiAgLy8gJ2JpcnRoIGRhdGUgYW5kIGFnZTInOiAnZGF0ZScsXG5cbiAgJ2FnZSc6ICdhZ2UnLFxuICAnYWdlIG50cyc6ICdhZ2UnLFxuICAnYWdlIGluIHllYXJzJzogJ2RpZmYteScsXG4gICdhZ2UgaW4geWVhcnMgYW5kIG1vbnRocyc6ICdkaWZmLXltJyxcbiAgJ2FnZSBpbiB5ZWFycywgbW9udGhzIGFuZCBkYXlzJzogJ2RpZmYteW1kJyxcbiAgJ2FnZSBpbiB5ZWFycyBhbmQgZGF5cyc6ICdkaWZmLXlkJyxcbiAgJ2FnZSBpbiBkYXlzJzogJ2RpZmYtZCcsXG4gIC8vICdhZ2UgaW4geWVhcnMsIG1vbnRocywgd2Vla3MgYW5kIGRheXMnOiB0cnVlLFxuICAvLyAnYWdlIGFzIG9mIGRhdGUnOiB0cnVlLFxuXG5cbn07XG5tb2R1bGUuZXhwb3J0cyA9IGtlZXA7XG4iLCJjb25zdCBoZWxwZXJzID0gcmVxdWlyZSgnLi4vLi4vbGliL2hlbHBlcnMnKTtcbmNvbnN0IHBhcnNlTGluZSA9IHJlcXVpcmUoJy4vc2VudGVuY2UvJykucGFyc2VMaW5lO1xuXG5jb25zdCB0YWJsZV9yZWcgPSAvXFx7XFx8W1xcc1xcU10rP1xcfFxcfS9nOyAvL3RoZSBsYXJnZXN0LWNpdGllcyB0YWJsZSBpcyB+NzBrY2hhcnMuXG5cbmNvbnN0IHBhcnNlSGVhZGluZyA9IGZ1bmN0aW9uKHN0cikge1xuICBzdHIgPSBwYXJzZUxpbmUoc3RyKS50ZXh0IHx8ICcnO1xuICBpZiAoc3RyLm1hdGNoKC9cXHwvKSkge1xuICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8uK1xcfCA/LywgJycpOyAvL2NsYXNzPVwidW5zb3J0YWJsZVwifHRpdGxlXG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cbi8vdHVybiBhIHt8Li4udGFibGUgc3RyaW5nIGludG8gYW4gYXJyYXkgb2YgYXJyYXlzXG5jb25zdCBwYXJzZV90YWJsZSA9IGZ1bmN0aW9uKHdpa2kpIHtcbiAgbGV0IGhlYWRpbmdzID0gW107XG4gIGxldCBsaW5lcyA9IHdpa2kucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdCgvXFxuLyk7XG5cbiAgLy9maW5kIGhlYWRpbmdzIGZpcnN0XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgc3RyID0gbGluZXNbaV07XG4gICAgLy9oZWFkZXJcbiAgICBpZiAoc3RyLm1hdGNoKC9eXFwhLykpIHtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9eXFwhICsvLCAnJyk7XG4gICAgICAvL2hhbmRsZSBpbmxpbmUgJyEhJyBmb3JtYXRcbiAgICAgIGlmIChzdHIubWF0Y2goLyBcXCFcXCEgLykpIHtcbiAgICAgICAgbGV0IGhlYWRzID0gc3RyLnNwbGl0KC8gXFwhXFwhIC8pO1xuICAgICAgICBoZWFkaW5ncyA9IGhlYWRzLm1hcChwYXJzZUhlYWRpbmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9oYW5kbGUgaGVhZGluZy1wZXItbGluZVxuICAgICAgICBzdHIgPSBwYXJzZUhlYWRpbmcoc3RyKTtcbiAgICAgICAgaWYgKCFzdHIpIHtcbiAgICAgICAgICBzdHIgPSAnY29sLScgKyBoZWFkaW5ncy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgaGVhZGluZ3MucHVzaChzdHIpO1xuICAgICAgICBsaW5lc1tpXSA9IG51bGw7IC8vcmVtb3ZlIGl0XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChoZWFkaW5ncy5sZW5ndGggPiAwICYmIHN0ci5tYXRjaCgvXnwtLykpIHtcbiAgICAgIGxpbmVzID0gbGluZXMuc2xpY2UoaSwgbGluZXMubGVuZ3RoKTtcbiAgICAgIGJyZWFrOyAvL2RvbmUgaGVyZVxuICAgIH0gZWxzZSBpZiAoc3RyLm1hdGNoKC9eXFx8IC8pKSB7XG4gICAgICBsaW5lcyA9IGxpbmVzLnNsaWNlKGksIGxpbmVzLmxlbmd0aCk7XG4gICAgICBicmVhazsgLy9kb25lIGhlcmVcbiAgICB9XG4gIH1cbiAgbGluZXMgPSBsaW5lcy5maWx0ZXIobCA9PiBsKTtcblxuICAvLyBjb25zb2xlLmxvZyhsaW5lcyk7XG4gIGxldCB0YWJsZSA9IFtbXV07XG4gIGxpbmVzLmZvckVhY2goZnVuY3Rpb24oc3RyKSB7XG4gICAgLy9lbmQgb2YgdGFibGUsIGVuZCBoZXJlXG4gICAgaWYgKHN0ci5tYXRjaCgvXlxcfFxcfS8pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vdGhpcyBpcyBzb21lIGtpbmQgb2YgY29tbWVudC9zdW1tYXJ5XG4gICAgaWYgKHN0ci5tYXRjaCgvXlxcfFxcKy8pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vbWFrZSBuZXcgcm93XG4gICAgaWYgKHN0ci5tYXRjaCgvXlxcfC0vKSkge1xuICAgICAgaWYgKHRhYmxlWzBdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIGhhbmRsZSB3ZWlyZCAnISAnIHJvdy1oZWFkZXIgc3ludGF4XG4gICAgaWYgKHN0ci5tYXRjaCgvXlxcIS8pKSB7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXlxcISArLywgJycpO1xuICAgICAgc3RyID0gcGFyc2VIZWFkaW5nKHN0cik7XG4gICAgICBzdHIgPSBoZWxwZXJzLnRyaW1fd2hpdGVzcGFjZShzdHIpO1xuICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChzdHIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvL2p1aWN5IGxpbmVcbiAgICBpZiAoc3RyLm1hdGNoKC9eXFx8LykpIHtcbiAgICAgIGxldCB3YW50ID0gKHN0ci5tYXRjaCgvXFx8KC4qKS8pIHx8IFtdKVsxXSB8fCAnJztcbiAgICAgIC8vaGFuZGxlIHdlaXJkICdyb3dzcGFuPVwiMlwiIHwnIHN5bnRheFxuICAgICAgaWYgKHdhbnQubWF0Y2goLy4gXFx8IC8pKSB7XG4gICAgICAgIC8vdGhpcyBuZWVkcyBhZGRpdGlvbmFsIGNsZWFudXBcbiAgICAgICAgd2FudCA9IHBhcnNlSGVhZGluZyh3YW50KTtcbiAgICAgIH1cbiAgICAgIHdhbnQgPSBoZWxwZXJzLnRyaW1fd2hpdGVzcGFjZSh3YW50KSB8fCAnJztcbiAgICAgIC8vaGFuZGxlIHRoZSB8fCBzaG9ydGhhbmQuLlxuICAgICAgaWYgKHdhbnQubWF0Y2goL1shXFx8XXsyfS8pKSB7XG4gICAgICAgIHdhbnQuc3BsaXQoL1shXFx8XXsyfS9nKS5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICBzID0gaGVscGVycy50cmltX3doaXRlc3BhY2Uocyk7XG4gICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChzKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHdhbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIC8vcmVtb3ZlIHRvcCBvbmUsIGlmIGl0J3MgZW1wdHlcbiAgaWYgKHRhYmxlWzBdICYmIE9iamVjdC5rZXlzKHRhYmxlWzBdKS5sZW5ndGggPT09IDApIHtcbiAgICB0YWJsZS5zaGlmdCgpO1xuICB9XG4gIC8vaW5kZXggdGhlbSBieSB0aGVpciBoZWFkZXJcbiAgdGFibGUgPSB0YWJsZS5tYXAoYXJyID0+IHtcbiAgICBsZXQgb2JqID0ge307XG4gICAgYXJyLmZvckVhY2goKGEsIGkpID0+IHtcbiAgICAgIGxldCBoZWFkID0gaGVhZGluZ3NbaV0gfHwgJ2NvbC0nICsgaTtcbiAgICAgIG9ialtoZWFkXSA9IHBhcnNlTGluZShhKTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9KTtcbiAgcmV0dXJuIHRhYmxlO1xufTtcblxuY29uc3QgZmluZFRhYmxlcyA9IGZ1bmN0aW9uKHIsIHdpa2kpIHtcbiAgbGV0IHRhYmxlcyA9IHdpa2kubWF0Y2godGFibGVfcmVnLCAnJykgfHwgW107XG4gIHRhYmxlcyA9IHRhYmxlcy5tYXAoZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHBhcnNlX3RhYmxlKHN0cik7XG4gIH0pO1xuICB0YWJsZXMgPSB0YWJsZXMuZmlsdGVyKCh0KSA9PiB0ICYmIHQubGVuZ3RoID4gMCk7XG4gIGlmICh0YWJsZXMubGVuZ3RoID4gMCkge1xuICAgIHIudGFibGVzID0gdGFibGVzO1xuICB9XG4gIC8vcmVtb3ZlIHRhYmxlc1xuICB3aWtpID0gd2lraS5yZXBsYWNlKHRhYmxlX3JlZywgJycpO1xuICByZXR1cm4gd2lraTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRUYWJsZXM7XG4iXX0=
