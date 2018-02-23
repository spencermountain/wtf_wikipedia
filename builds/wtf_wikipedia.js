/* wtf_wikipedia v2.5.0
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
  "version": "2.5.0",
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

},{"../package":9,"./lib/fetch_text":16,"./output/html":19,"./output/markdown":21,"./parse":27}],15:[function(_dereq_,module,exports){
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

},{"../data/site_map":13,"../parse/page/redirects":32,"superagent":4}],17:[function(_dereq_,module,exports){
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
var doSentence = _dereq_('./sentence').doSentence;
// const doInfobox = require('../doInfobox');

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
  if (section.tables && options.tables === true) {}
  //make a html bullet-list
  if (section.lists && options.lists === true) {}
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
  if (options.title === true && data.title) {
    html += '<h1>' + data.title + '</h1>\n';
  }
  //render infoboxes (up at the top)
  // if (options.infoboxes === true && data.infoboxes) {
  //   md += data.infoboxes.map(o => doInfobox(o, options)).join('\n');
  // }
  //render each section
  html += data.sections.map(function (s) {
    return doSection(s, options);
  }).join('\n');
  return html;
};
module.exports = toHtml;

},{"../../parse":27,"./sentence":20}],20:[function(_dereq_,module,exports){
'use strict';

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
        link += ' external';
      } else {
        //otherwise, make it a relative internal link
        href = link.page || link.text;
        href = './' + href.replace(/ /g, '_');
      }
      text = text.replace(link.text, '<a class="' + classNames + '" href="' + href + '">' + link.text + '</a>');
    });
  }
  return text;
};
module.exports = doSentence;

},{}],21:[function(_dereq_,module,exports){
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

},{"../../parse":27,"./infobox":22,"./sentence":24,"./table":25}],22:[function(_dereq_,module,exports){
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

},{"./pad":23,"./sentence":24}],23:[function(_dereq_,module,exports){
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

},{}],24:[function(_dereq_,module,exports){
'use strict';

//escape a string like 'fun*2.Co' for a regExpr
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

//sometimes text-replacements can be ambiguous - words used multiple times..
var bestReplace = function bestReplace(md, text, result) {
  text = escapeRegExp(text);
  //try a word-boundary replace
  var reg = new RegExp('\\b' + text + '\\b');
  if (reg.test(md) === true) {
    md = md.replace(reg, result);
  } else {
    //otherwise, fall-back to a much messier, dangerous replacement
    // console.warn('missing \'' + text + '\'');
    md = md.replace(text, result);
  }
  return md;
};

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
  md = bestReplace(md, link.text, mdLink);
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
  if (sentence.fmt.bold) {
    sentence.fmt.bold.forEach(function (b) {
      md = bestReplace(md, b, '**' + b + '**');
    });
  }
  //support *italics*
  if (sentence.fmt.italic) {
    sentence.fmt.italic.forEach(function (i) {
      md = bestReplace(md, i, '*' + i + '*');
    });
  }
  return md;
};
module.exports = doSentence;

},{}],25:[function(_dereq_,module,exports){
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

},{"./pad":23,"./sentence":24}],26:[function(_dereq_,module,exports){
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

},{"../data/i18n":11}],27:[function(_dereq_,module,exports){
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

},{"./categories":26,"./infobox":29,"./page/disambig":31,"./page/redirects":32,"./postProcess":33,"./preProcess":35,"./section":41}],28:[function(_dereq_,module,exports){
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

},{}],29:[function(_dereq_,module,exports){
'use strict';

var i18n = _dereq_('../../data/i18n');
var findRecursive = _dereq_('../../lib/recursive_match');
var parseInfobox = _dereq_('./infobox');
var parseCitation = _dereq_('./citation');

var infobox_reg = new RegExp('{{(' + i18n.infoboxes.join('|') + ')[: \n]', 'ig');
//dont remove these ones
var keep = _dereq_('../section/sentence/templates/list');

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
      name = name.replace(/-/g, ' ');
      //
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

},{"../../data/i18n":11,"../../lib/recursive_match":18,"../section/sentence/templates/list":48,"./citation":28,"./infobox":30}],30:[function(_dereq_,module,exports){
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

},{"../../data/i18n":11,"../../lib/helpers":17,"../../lib/recursive_match":18,"../section/sentence":44}],31:[function(_dereq_,module,exports){
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

},{"../../data/i18n":11,"../section/sentence/links":45}],32:[function(_dereq_,module,exports){
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

},{"../../data/i18n":11}],33:[function(_dereq_,module,exports){
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

},{"../../data/i18n":11,"../section/image/image":39}],34:[function(_dereq_,module,exports){
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

},{"../../lib/convertGeo":15}],35:[function(_dereq_,module,exports){
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

},{"./kill_xml":36,"./word_templates":37}],36:[function(_dereq_,module,exports){
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

},{"../infobox/citation":28,"../section/sentence":44}],37:[function(_dereq_,module,exports){
'use strict';

var languages = _dereq_('../../data/languages');
var parseCoord = _dereq_('./coordinates');

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//these are easy, inline templates we can do without too-much trouble.
var inline = /\{\{(url|convert|current|local|lc|uc|formatnum|pull|cquote|coord|small|smaller|midsize|larger|big|bigger|large|huge|resize|dts|date|term|ipa|ill|sense|t|etyl|sfnref)(.*?)\}\}/gi;

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

},{"../../data/languages":12,"./coordinates":34}],38:[function(_dereq_,module,exports){
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

},{"../../lib/helpers":17}],39:[function(_dereq_,module,exports){
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

},{"../../../data/i18n":11,"jshashes":2}],40:[function(_dereq_,module,exports){
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

},{"../../../data/i18n":11,"../../../lib/recursive_match":18,"./image":39}],41:[function(_dereq_,module,exports){
'use strict';

//interpret ==heading== lines
var parse = {
  heading: _dereq_('./heading'),
  list: _dereq_('./list'),
  image: _dereq_('./image'),
  table: _dereq_('./table'),
  // templates: require('./section_templates'),
  eachSentence: _dereq_('./sentence').eachSentence
};
var section_reg = /[\n^](={1,5}[^=]{1,200}?={1,5})/g;

var parseSection = function parseSection(section, wiki, r, options) {
  // //parse the tables
  wiki = parse.table(section, wiki);
  // //parse the lists
  wiki = parse.list(section, wiki);
  // //parse+remove scary '[[ [[]] ]]' stuff
  wiki = parse.image(section, wiki, options);
  //do each sentence
  wiki = parse.eachSentence(section, wiki);
  //supoprted things like {{main}}
  // wiki = parse.templates(section, wiki, r);
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

},{"./heading":38,"./image":40,"./list":42,"./sentence":44,"./table":49}],42:[function(_dereq_,module,exports){
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

},{"./sentence/":44}],43:[function(_dereq_,module,exports){
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
  obj.fmt = {};
  if (bolds.length > 0) {
    obj.fmt.bold = bolds;
  }
  if (italics.length > 0) {
    obj.fmt.italic = italics;
  }
  return obj;
};
module.exports = formatting;

},{}],44:[function(_dereq_,module,exports){
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
  line = line.replace(/\[\[:?([^|]{2,80}?)\]\](\w{0,5})/g, '$1$2');
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

},{"../../../data/i18n":11,"../../../lib/helpers":17,"./formatting":43,"./links":45,"./sentence-parser":46,"./templates":47}],45:[function(_dereq_,module,exports){
'use strict';

var helpers = _dereq_('../../../lib/helpers');
var ignore_links = /^:?(category|catégorie|Kategorie|Categoría|Categoria|Categorie|Kategoria|تصنيف|image|file|image|fichier|datei|media|special|wp|wikipedia|help|user|mediawiki|portal|talk|template|book|draft|module|topic|wiktionary|wikisource):/i;
var external_link = /\[(https?|news|ftp|mailto|gopher|irc)(:\/\/[^\]\| ]{4,1500})([\| ].*?)?\]/g;
var link_reg = /\[\[(.{2,80}?)\]\]([a-z']+)?(\w{0,10})/gi; //allow dangling suffixes - "[[flanders]]'s"

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
    var link, txt;
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
    } else {
      // standard link [[link]]
      link = s.replace(/\[\[(.{2,60}?)\]\](\w{0,10})/g, '$1'); //remove ['s
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

},{"../../../lib/helpers":17}],46:[function(_dereq_,module,exports){
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

},{"../../../data/abbreviations":10}],47:[function(_dereq_,module,exports){
'use strict';

var parsers = {
  main: function main(tmpl) {
    return '';
  },
  'birth date': function birthDate(tmpl) {
    tmpl = tmpl.replace(/^\{\{/, '');
    tmpl = tmpl.replace(/\}\}$/, '');
    var arr = tmpl.split('|');
    var str = '';
    if (arr[1]) {
      //year
      str += arr[1];
      if (arr[2]) {
        //month
        str += '-' + arr[2];
      }
      if (arr[3]) {
        //date
        str += '-' + arr[3];
      }
    }
    return str;
  }
};

//get identity of template - Template:Foo
var getName = function getName(tmpl) {
  tmpl = tmpl.replace(/^\{\{/, '');
  tmpl = tmpl.replace(/\}\}$/, '');
  var name = tmpl.split(/\|/)[0] || '';
  name = name.toLowerCase().trim();
  return name;
};

var parseTemplates = function parseTemplates(obj) {
  var templates = obj.text.match(/\{\{([^}]+)\}\}/g) || [];
  templates = templates.map(function (tmpl) {
    return {
      name: getName(tmpl),
      tmpl: tmpl
    };
  });
  //try parsing each template
  templates.forEach(function (t) {
    if (parsers.hasOwnProperty(t.name) === true) {
      var result = parsers[t.name](t.tmpl);
      console.log(result);
      obj.text = obj.text.replace(t.tmpl, result);
    } else {
      //remove it from the text
      obj.text = obj.text.replace(t.tmpl, '');
    }
  });
  return obj;
};
module.exports = parseTemplates;

},{}],48:[function(_dereq_,module,exports){
'use strict';

//templates we support
var keep = {
  main: true,
  'main article': true,
  'wide image': true,
  coord: true,
  //date/age/time templates
  'birth date': true,
  'death date': true,
  'birth date and age': true,
  'birth date and age2': true,
  'birth date and given age': true,
  'death date and age': true,
  'death date and given age': true,
  'death year and age': true,
  'start date': true,
  'end date': true,
  'start date and age': true,
  birthdeathage: true,
  dob: true,
  bda: true,
  'age': true,
  'age nts': true,
  'age in years, months and days': true,
  'age in years and months': true,
  'age in years and days': true,
  'age in years, months, weeks and days': true,
  'age in days': true,
  'age as of date': true,

  'birth': true,
  'death': true,
  'start': true,
  'end': true
};
module.exports = keep;

},{}],49:[function(_dereq_,module,exports){
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
  if (tables.length > 0) {
    r.tables = tables;
  }
  //remove tables
  wiki = wiki.replace(table_reg, '');
  return wiki;
};
module.exports = findTables;

},{"../../lib/helpers":17,"./sentence/":44}]},{},[14])(14)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29tcG9uZW50LWVtaXR0ZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvanNoYXNoZXMvaGFzaGVzLmpzIiwibm9kZV9tb2R1bGVzL3N1cGVyYWdlbnQvbGliL2FnZW50LWJhc2UuanMiLCJub2RlX21vZHVsZXMvc3VwZXJhZ2VudC9saWIvY2xpZW50LmpzIiwibm9kZV9tb2R1bGVzL3N1cGVyYWdlbnQvbGliL2lzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcmFnZW50L2xpYi9yZXF1ZXN0LWJhc2UuanMiLCJub2RlX21vZHVsZXMvc3VwZXJhZ2VudC9saWIvcmVzcG9uc2UtYmFzZS5qcyIsIm5vZGVfbW9kdWxlcy9zdXBlcmFnZW50L2xpYi91dGlscy5qcyIsInBhY2thZ2UuanNvbiIsInNyYy9kYXRhL2FiYnJldmlhdGlvbnMuanMiLCJzcmMvZGF0YS9pMThuLmpzIiwic3JjL2RhdGEvbGFuZ3VhZ2VzLmpzIiwic3JjL2RhdGEvc2l0ZV9tYXAuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvbGliL2NvbnZlcnRHZW8uanMiLCJzcmMvbGliL2ZldGNoX3RleHQuanMiLCJzcmMvbGliL2hlbHBlcnMuanMiLCJzcmMvbGliL3JlY3Vyc2l2ZV9tYXRjaC5qcyIsInNyYy9vdXRwdXQvaHRtbC9pbmRleC5qcyIsInNyYy9vdXRwdXQvaHRtbC9zZW50ZW5jZS5qcyIsInNyYy9vdXRwdXQvbWFya2Rvd24vaW5kZXguanMiLCJzcmMvb3V0cHV0L21hcmtkb3duL2luZm9ib3guanMiLCJzcmMvb3V0cHV0L21hcmtkb3duL3BhZC5qcyIsInNyYy9vdXRwdXQvbWFya2Rvd24vc2VudGVuY2UuanMiLCJzcmMvb3V0cHV0L21hcmtkb3duL3RhYmxlLmpzIiwic3JjL3BhcnNlL2NhdGVnb3JpZXMuanMiLCJzcmMvcGFyc2UvaW5kZXguanMiLCJzcmMvcGFyc2UvaW5mb2JveC9jaXRhdGlvbi5qcyIsInNyYy9wYXJzZS9pbmZvYm94L2luZGV4LmpzIiwic3JjL3BhcnNlL2luZm9ib3gvaW5mb2JveC5qcyIsInNyYy9wYXJzZS9wYWdlL2Rpc2FtYmlnLmpzIiwic3JjL3BhcnNlL3BhZ2UvcmVkaXJlY3RzLmpzIiwic3JjL3BhcnNlL3Bvc3RQcm9jZXNzL2luZGV4LmpzIiwic3JjL3BhcnNlL3ByZVByb2Nlc3MvY29vcmRpbmF0ZXMuanMiLCJzcmMvcGFyc2UvcHJlUHJvY2Vzcy9pbmRleC5qcyIsInNyYy9wYXJzZS9wcmVQcm9jZXNzL2tpbGxfeG1sLmpzIiwic3JjL3BhcnNlL3ByZVByb2Nlc3Mvd29yZF90ZW1wbGF0ZXMuanMiLCJzcmMvcGFyc2Uvc2VjdGlvbi9oZWFkaW5nLmpzIiwic3JjL3BhcnNlL3NlY3Rpb24vaW1hZ2UvaW1hZ2UuanMiLCJzcmMvcGFyc2Uvc2VjdGlvbi9pbWFnZS9pbmRleC5qcyIsInNyYy9wYXJzZS9zZWN0aW9uL2luZGV4LmpzIiwic3JjL3BhcnNlL3NlY3Rpb24vbGlzdC5qcyIsInNyYy9wYXJzZS9zZWN0aW9uL3NlbnRlbmNlL2Zvcm1hdHRpbmcuanMiLCJzcmMvcGFyc2Uvc2VjdGlvbi9zZW50ZW5jZS9pbmRleC5qcyIsInNyYy9wYXJzZS9zZWN0aW9uL3NlbnRlbmNlL2xpbmtzLmpzIiwic3JjL3BhcnNlL3NlY3Rpb24vc2VudGVuY2Uvc2VudGVuY2UtcGFyc2VyLmpzIiwic3JjL3BhcnNlL3NlY3Rpb24vc2VudGVuY2UvdGVtcGxhdGVzL2luZGV4LmpzIiwic3JjL3BhcnNlL3NlY3Rpb24vc2VudGVuY2UvdGVtcGxhdGVzL2xpc3QuanMiLCJzcmMvcGFyc2Uvc2VjdGlvbi90YWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcnVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4NUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdHJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFEQTtBQUNBLE9BQU8sT0FBUCxHQUFpQixDQUNmLElBRGUsRUFFZixJQUZlLEVBR2YsS0FIZSxFQUlmLElBSmUsRUFLZixJQUxlLEVBTWYsTUFOZSxFQU9mLElBUGUsRUFRZixLQVJlLEVBU2YsTUFUZSxFQVVmLE9BVmUsRUFXZixLQVhlLEVBWWYsS0FaZSxFQWFmLE1BYmUsRUFjZixNQWRlLEVBZWYsS0FmZSxFQWdCZixLQWhCZSxFQWlCZixLQWpCZSxFQWtCZixLQWxCZSxFQW1CZixJQW5CZSxFQW9CZixNQXBCZSxFQXFCZixLQXJCZSxFQXNCZixNQXRCZSxFQXVCZixLQXZCZSxFQXdCZixLQXhCZSxFQXlCZixLQXpCZSxFQTBCZixNQTFCZSxFQTJCZixNQTNCZSxFQTRCZixNQTVCZSxFQTZCZixNQTdCZSxFQThCZixLQTlCZSxFQStCZixLQS9CZSxFQWdDZixJQWhDZSxFQWlDZixNQWpDZSxFQWtDZixLQWxDZSxFQW1DZixJQW5DZSxFQW9DZixLQXBDZSxFQXFDZixNQXJDZSxFQXNDZixJQXRDZSxFQXVDZixJQXZDZSxFQXdDZixNQXhDZSxFQXlDZixLQXpDZSxFQTBDZixJQTFDZSxFQTJDZixJQTNDZSxFQTRDZixNQTVDZSxFQTZDZixJQTdDZSxFQThDZixJQTlDZSxFQStDZixJQS9DZSxFQWdEZixLQWhEZSxFQWlEZixJQWpEZSxFQWtEZixJQWxEZSxFQW1EZixJQW5EZSxFQW9EZixLQXBEZSxFQXFEZixLQXJEZSxFQXNEZixLQXREZSxFQXVEZixNQXZEZSxFQXdEZixLQXhEZSxFQXlEZixLQXpEZSxFQTBEZixPQTFEZSxFQTJEZixLQTNEZSxFQTREZixNQTVEZSxFQTZEZixNQTdEZSxFQThEZixLQTlEZSxFQStEZixLQS9EZSxFQWdFZixLQWhFZSxFQWlFZixJQWpFZSxFQWtFZixLQWxFZSxFQW1FZixJQW5FZSxFQW9FZixLQXBFZSxFQXFFZixLQXJFZSxFQXNFZixJQXRFZSxFQXVFZixLQXZFZSxFQXdFZixNQXhFZSxFQXlFZixLQXpFZSxFQTBFZixJQTFFZSxFQTJFZixJQTNFZSxFQTRFZixJQTVFZSxFQTZFZixJQTdFZSxFQThFZixNQTlFZSxFQStFZixNQS9FZSxFQWdGZixNQWhGZSxFQWlGZixNQWpGZSxFQWtGZixJQWxGZSxFQW1GZixNQW5GZSxFQW9GZixLQXBGZSxFQXFGZixNQXJGZSxFQXNGZixLQXRGZSxFQXVGZixLQXZGZSxFQXdGZixNQXhGZSxFQXlGZixJQXpGZSxFQTBGZixLQTFGZSxFQTJGZixPQTNGZSxFQTRGZixNQTVGZSxFQTZGZixJQTdGZSxFQThGZixLQTlGZSxFQStGZixNQS9GZSxFQWdHZixLQWhHZSxFQWlHZixJQWpHZSxFQWtHZixJQWxHZSxFQW1HZixJQW5HZSxFQW9HZixNQXBHZSxFQXFHZixLQXJHZSxFQXNHZixNQXRHZSxFQXVHZixJQXZHZSxFQXdHZixLQXhHZSxFQXlHZixPQXpHZSxFQTBHZixNQTFHZSxFQTJHZixLQTNHZSxFQTRHZixPQTVHZSxFQTZHZixNQTdHZSxFQThHZixLQTlHZSxFQStHZixLQS9HZSxFQWdIZixLQWhIZSxFQWlIZixLQWpIZSxFQWtIZixLQWxIZSxFQW1IZixLQW5IZSxFQW9IZixLQXBIZSxFQXFIZixLQXJIZSxFQXNIZixLQXRIZSxFQXVIZixLQXZIZSxFQXdIZixLQXhIZSxFQXlIZixLQXpIZSxFQTBIZixNQTFIZSxFQTJIZixJQTNIZSxFQTRIZixLQTVIZSxFQTZIZixLQTdIZSxFQThIZixLQTlIZSxFQStIZixJQS9IZSxFQWdJZixJQWhJZSxFQWlJZixLQWpJZSxFQWtJZixJQWxJZSxFQW1JZixJQW5JZSxFQW9JZixNQXBJZSxFQXFJZixRQXJJZSxFQXNJZixRQXRJZSxFQXVJZixLQXZJZSxFQXdJZixLQXhJZSxFQXlJZixNQXpJZSxFQTBJZixLQTFJZSxFQTJJZixJQTNJZSxFQTRJZixJQTVJZSxFQTZJZixJQTdJZSxFQThJZixLQTlJZSxFQStJZixNQS9JZSxFQWdKZixJQWhKZSxDQUFqQjs7Ozs7QUNEQTtBQUNBO0FBQ0EsSUFBSSxPQUFPO0FBQ1QsU0FBTyxDQUNMLE1BREssRUFFTCxRQUZLLEVBR0wsUUFISyxFQUlMLE9BSkssRUFLTCxNQUxLLEVBTUwsU0FOSyxFQU9MLFFBUEssRUFRTCxVQVJLLEVBU0wsTUFUSyxFQVVMLFNBVkssRUFXTCxTQVhLLEVBWUwsU0FaSyxFQWFMLFVBYkssRUFjTCxPQWRLLEVBZUwsS0FmSyxDQURFO0FBa0JULFVBQVEsQ0FBQyxPQUFELENBbEJDO0FBbUJULGFBQVcsQ0FDVCxRQURTLEVBRVQsV0FGUyxFQUdULFNBSFMsRUFJVCxTQUpTLEVBS1QsVUFMUyxFQU1ULE1BTlMsRUFPVCxTQVBTLEVBUVQsTUFSUyxFQVNULFNBVFMsRUFVVCxRQVZTLEVBV1QsVUFYUyxFQVlULFFBWlMsRUFhVCxRQWJTLENBbkJGO0FBa0NULGNBQVksQ0FDVixXQURVLEVBRVYsV0FGVSxFQUdWLFdBSFUsRUFJVixVQUpVLEVBS1YsV0FMVSxFQU1WLEtBTlUsRUFPVixRQVBVLEVBUVYsU0FSVSxFQVNWLFlBVFUsRUFVVixXQVZVLEVBV1YsV0FYVSxFQVlWLFlBWlUsRUFhVixVQWJVLEVBY1YsV0FkVSxFQWVWLE9BZlUsQ0FsQ0g7QUFtRFQsYUFBVyxDQUNULGtCQURTLEVBRVQsVUFGUyxFQUdULFdBSFMsRUFJVCxlQUpTLEVBS1QsYUFMUyxFQU1ULGFBTlMsRUFPVCxZQVBTLEVBUVQsV0FSUyxFQVNULFFBVFMsRUFVVCxpQkFWUyxFQVdULFVBWFMsRUFZVCxPQVpTLEVBYVQsT0FiUyxFQWNULGFBZFMsRUFlVCxnQkFmUyxFQWdCVCxXQWhCUyxFQWlCVCxZQWpCUyxFQWtCVCxjQWxCUyxFQW1CVCxZQW5CUyxFQW9CVCxLQXBCUyxFQXFCVCxhQXJCUyxFQXNCVCxhQXRCUyxFQXVCVCxLQXZCUyxFQXdCVCxlQXhCUyxFQXlCVCxZQXpCUyxFQTBCVCxXQTFCUyxFQTJCVCxrQkEzQlMsRUE0QlQsYUE1QlMsQ0FuREY7QUFpRlQsWUFBVSxDQUNSLGFBRFEsRUFFUixVQUZRLEVBR1IsV0FIUSxFQUlSLFNBSlEsRUFLUixTQUxRLEVBTVIsTUFOUSxFQU9SLFdBUFEsRUFRUixZQVJRLEVBU1IsU0FUUSxFQVVSLFNBVlEsRUFXUixVQVhRLEVBWVIsU0FaUSxFQWFSLE1BYlEsQ0FqRkQ7QUFnR1QsU0FBTyxDQUNMLFdBREssRUFFTCxRQUZLLEVBR0wsVUFISyxFQUlMLFVBSkssRUFLTCxNQUxLLEVBTUwsU0FOSyxFQU9MLE9BUEssRUFRTCxVQVJLLEVBU0wsU0FUSyxFQVVMLGVBVkssRUFXTCxhQVhLLEVBWUwsV0FaSyxFQWFMLFVBYkssRUFjTCxXQWRLLENBaEdFO0FBZ0hULGFBQVcsQ0FDVCxVQURTLEVBQ0c7QUFDWixrQkFGUyxFQUVTO0FBQ2xCLE9BSFMsRUFHRjtBQUNQLFVBSlMsRUFJQztBQUNWLG1CQUxTLEVBS1U7QUFDbkIscUJBTlMsRUFNWTtBQUNyQixxQkFQUyxFQU9ZO0FBQ3JCLE9BUlMsRUFRRjtBQUNQLGtCQVRTLEVBU1M7QUFDbEIsZ0JBVlMsRUFVTztBQUNoQixjQVhTLEVBV0s7QUFDZCxpQkFaUyxFQVlRO0FBQ2pCLGFBYlMsRUFhSTtBQUNiLG1CQWRTLEVBY1U7QUFDbkIsZ0JBZlMsQ0FlTTtBQWZOLEdBaEhGO0FBaUlULGFBQVcsQ0FDVCxTQURTLEVBRVQsT0FGUyxFQUdULFdBSFMsRUFJVCxlQUpTLEVBS1QsZ0JBTFMsRUFLUztBQUNsQixPQU5TLEVBT1QsY0FQUyxFQU9PO0FBQ2hCLHlCQVJTLEVBU1QsVUFUUyxDQVNFO0FBVEYsR0FqSUY7QUE0SVQsV0FBUztBQUNQO0FBQ0EsY0FGTyxFQUdQLFVBSE8sRUFJUCxnQkFKTyxFQUtQLGlCQUxPLEVBTVAscUJBTk8sRUFPUCxZQVBPLEVBUVAsZ0JBUk87QUE1SUEsQ0FBWDs7QUF3SkEsSUFBSSxhQUFhLEVBQWpCO0FBQ0EsT0FBTyxJQUFQLENBQVksSUFBWixFQUFrQixPQUFsQixDQUEwQixhQUFLO0FBQzdCLE9BQUssQ0FBTCxFQUFRLE9BQVIsQ0FBZ0IsYUFBSztBQUNuQixlQUFXLENBQVgsSUFBZ0IsSUFBaEI7QUFDRCxHQUZEO0FBR0QsQ0FKRDtBQUtBLEtBQUssVUFBTCxHQUFrQixVQUFsQjs7QUFFQSxJQUFJLE9BQU8sTUFBUCxLQUFrQixXQUFsQixJQUFpQyxPQUFPLE9BQTVDLEVBQXFEO0FBQ25ELFNBQU8sT0FBUCxHQUFpQixJQUFqQjtBQUNEOzs7OztBQ3BLRCxPQUFPLE9BQVAsR0FBaUI7QUFDZixNQUFJO0FBQ0YsbUJBQWUsTUFEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0FEVztBQU1mLE1BQUk7QUFDRixtQkFBZSxXQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQU5XO0FBV2YsTUFBSTtBQUNGLG1CQUFlLFdBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBWFc7QUFnQmYsTUFBSTtBQUNGLG1CQUFlLE1BRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBaEJXO0FBcUJmLE9BQUs7QUFDSCxtQkFBZSxXQURaO0FBRUgsZUFBVyxLQUZSO0FBR0gsaUJBQWE7QUFIVixHQXJCVTtBQTBCZixNQUFJO0FBQ0YsbUJBQWUsU0FEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0ExQlc7QUErQmYsTUFBSTtBQUNGLG1CQUFlLFdBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBL0JXO0FBb0NmLE9BQUs7QUFDSCxtQkFBZSxhQURaO0FBRUgsZUFBVyxLQUZSO0FBR0gsaUJBQWE7QUFIVixHQXBDVTtBQXlDZixNQUFJO0FBQ0YsbUJBQWUsUUFEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0F6Q1c7QUE4Q2YsT0FBSztBQUNILG1CQUFlLFNBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBOUNVO0FBbURmLE1BQUk7QUFDRixtQkFBZSxVQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQW5EVztBQXdEZixPQUFLO0FBQ0gsbUJBQWUsVUFEWjtBQUVILGVBQVcsS0FGUjtBQUdILGlCQUFhO0FBSFYsR0F4RFU7QUE2RGYsTUFBSTtBQUNGLG1CQUFlLE1BRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBN0RXO0FBa0VmLE1BQUk7QUFDRixtQkFBZSxRQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQWxFVztBQXVFZixNQUFJO0FBQ0YsbUJBQWUsYUFEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0F2RVc7QUE0RWYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBNUVXO0FBaUZmLE9BQUs7QUFDSCxtQkFBZSxVQURaO0FBRUgsZUFBVyxLQUZSO0FBR0gsaUJBQWE7QUFIVixHQWpGVTtBQXNGZixhQUFXO0FBQ1QsbUJBQWUsWUFETjtBQUVULGVBQVcsS0FGRjtBQUdULGlCQUFhO0FBSEosR0F0Rkk7QUEyRmYsT0FBSztBQUNILG1CQUFlLE9BRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBM0ZVO0FBZ0dmLE1BQUk7QUFDRixtQkFBZSxZQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQWhHVztBQXFHZixjQUFZO0FBQ1YsbUJBQWUsWUFETDtBQUVWLGVBQVcsZ0JBRkQ7QUFHVixpQkFBYTtBQUhILEdBckdHO0FBMEdmLE1BQUk7QUFDRixtQkFBZSxXQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTFHVztBQStHZixNQUFJO0FBQ0YsbUJBQWUsUUFEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0EvR1c7QUFvSGYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBcEhXO0FBeUhmLE1BQUk7QUFDRixtQkFBZSxTQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXpIVztBQThIZixNQUFJO0FBQ0YsbUJBQWUsU0FEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0E5SFc7QUFtSWYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBbklXO0FBd0lmLE9BQUs7QUFDSCxtQkFBZSxhQURaO0FBRUgsZUFBVyxVQUZSO0FBR0gsaUJBQWE7QUFIVixHQXhJVTtBQTZJZixNQUFJO0FBQ0YsbUJBQWUsUUFEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0E3SVc7QUFrSmYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBbEpXO0FBdUpmLE9BQUs7QUFDSCxtQkFBZSxVQURaO0FBRUgsZUFBVyxLQUZSO0FBR0gsaUJBQWE7QUFIVixHQXZKVTtBQTRKZixPQUFLO0FBQ0gsbUJBQWUsUUFEWjtBQUVILGVBQVcsVUFGUjtBQUdILGlCQUFhO0FBSFYsR0E1SlU7QUFpS2YsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBaktXO0FBc0tmLE9BQUs7QUFDSCxtQkFBZSxLQURaO0FBRUgsZUFBVyxNQUZSO0FBR0gsaUJBQWE7QUFIVixHQXRLVTtBQTJLZixNQUFJO0FBQ0YsbUJBQWUsU0FEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0EzS1c7QUFnTGYsT0FBSztBQUNILG1CQUFlLFNBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBaExVO0FBcUxmLE1BQUk7QUFDRixtQkFBZSxVQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXJMVztBQTBMZixPQUFLO0FBQ0gsbUJBQWUsU0FEWjtBQUVILGVBQVcsS0FGUjtBQUdILGlCQUFhO0FBSFYsR0ExTFU7QUErTGYsT0FBSztBQUNILG1CQUFlLFVBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBL0xVO0FBb01mLE9BQUs7QUFDSCxtQkFBZSxVQURaO0FBRUgsZUFBVyxLQUZSO0FBR0gsaUJBQWE7QUFIVixHQXBNVTtBQXlNZixNQUFJO0FBQ0YsbUJBQWUsVUFEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0F6TVc7QUE4TWYsTUFBSTtBQUNGLG1CQUFlLE1BRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBOU1XO0FBbU5mLE1BQUk7QUFDRixtQkFBZSxPQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQW5OVztBQXdOZixPQUFLO0FBQ0gsbUJBQWUsV0FEWjtBQUVILGVBQVcsS0FGUjtBQUdILGlCQUFhO0FBSFYsR0F4TlU7QUE2TmYsTUFBSTtBQUNGLG1CQUFlLEtBRGI7QUFFRixlQUFXLFFBRlQ7QUFHRixpQkFBYTtBQUhYLEdBN05XO0FBa09mLE1BQUk7QUFDRixtQkFBZSxTQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQWxPVztBQXVPZixNQUFJO0FBQ0YsbUJBQWUsT0FEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0F2T1c7QUE0T2YsTUFBSTtBQUNGLG1CQUFlLFFBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBNU9XO0FBaVBmLE1BQUk7QUFDRixtQkFBZSxRQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQWpQVztBQXNQZixPQUFLO0FBQ0gsbUJBQWUsT0FEWjtBQUVILGVBQVcsS0FGUjtBQUdILGlCQUFhO0FBSFYsR0F0UFU7QUEyUGYsT0FBSztBQUNILG1CQUFlLE9BRFo7QUFFSCxlQUFXLFNBRlI7QUFHSCxpQkFBYTtBQUhWLEdBM1BVO0FBZ1FmLE1BQUk7QUFDRixtQkFBZSxRQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQWhRVztBQXFRZixNQUFJO0FBQ0YsbUJBQWUsVUFEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0FyUVc7QUEwUWYsTUFBSTtBQUNGLG1CQUFlLEtBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBMVFXO0FBK1FmLE9BQUs7QUFDSCxtQkFBZSxPQURaO0FBRUgsZUFBVyxLQUZSO0FBR0gsaUJBQWE7QUFIVixHQS9RVTtBQW9SZixNQUFJO0FBQ0YsbUJBQWUsT0FEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0FwUlc7QUF5UmYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBelJXO0FBOFJmLE1BQUk7QUFDRixtQkFBZSxXQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTlSVztBQW1TZixNQUFJO0FBQ0YsbUJBQWUsU0FEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0FuU1c7QUF3U2YsTUFBSTtBQUNGLG1CQUFlLFVBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBeFNXO0FBNlNmLE1BQUk7QUFDRixtQkFBZSxRQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTdTVztBQWtUZixPQUFLO0FBQ0gsbUJBQWUsY0FEWjtBQUVILGVBQVcsS0FGUjtBQUdILGlCQUFhO0FBSFYsR0FsVFU7QUF1VGYsTUFBSTtBQUNGLG1CQUFlLE1BRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBdlRXO0FBNFRmLE1BQUk7QUFDRixtQkFBZSxTQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTVUVztBQWlVZixhQUFXO0FBQ1QsbUJBQWUsTUFETjtBQUVULGVBQVcsS0FGRjtBQUdULGlCQUFhO0FBSEosR0FqVUk7QUFzVWYsTUFBSTtBQUNGLG1CQUFlLFFBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBdFVXO0FBMlVmLE1BQUk7QUFDRixtQkFBZSxTQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTNVVztBQWdWZixNQUFJO0FBQ0YsbUJBQWUsUUFEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0FoVlc7QUFxVmYsT0FBSztBQUNILG1CQUFlLFNBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBclZVO0FBMFZmLE9BQUs7QUFDSCxtQkFBZSxVQURaO0FBRUgsZUFBVyxLQUZSO0FBR0gsaUJBQWE7QUFIVixHQTFWVTtBQStWZixNQUFJO0FBQ0YsbUJBQWUsTUFEYjtBQUVGLGVBQVcsU0FGVDtBQUdGLGlCQUFhO0FBSFgsR0EvVlc7QUFvV2YsTUFBSTtBQUNGLG1CQUFlLE9BRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBcFdXO0FBeVdmLE9BQUs7QUFDSCxtQkFBZSxLQURaO0FBRUgsZUFBVyxTQUZSO0FBR0gsaUJBQWE7QUFIVixHQXpXVTtBQThXZixNQUFJO0FBQ0YsbUJBQWUsVUFEYjtBQUVGLGVBQVcsUUFGVDtBQUdGLGlCQUFhO0FBSFgsR0E5V1c7QUFtWGYsT0FBSztBQUNILG1CQUFlLFlBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBblhVO0FBd1hmLE1BQUk7QUFDRixtQkFBZSxVQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXhYVztBQTZYZixNQUFJO0FBQ0YsbUJBQWUsU0FEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0E3WFc7QUFrWWYsT0FBSztBQUNILG1CQUFlLFFBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBbFlVO0FBdVlmLE1BQUk7QUFDRixtQkFBZSxVQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXZZVztBQTRZZixNQUFJO0FBQ0YsbUJBQWUsTUFEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0E1WVc7QUFpWmYsTUFBSTtBQUNGLG1CQUFlLE9BRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBalpXO0FBc1pmLE9BQUs7QUFDSCxtQkFBZSxPQURaO0FBRUgsZUFBVyxTQUZSO0FBR0gsaUJBQWE7QUFIVixHQXRaVTtBQTJaZixPQUFLO0FBQ0gsbUJBQWUsVUFEWjtBQUVILGVBQVcsS0FGUjtBQUdILGlCQUFhO0FBSFYsR0EzWlU7QUFnYWYsTUFBSTtBQUNGLG1CQUFlLFFBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBaGFXO0FBcWFmLE1BQUk7QUFDRixtQkFBZSxPQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXJhVztBQTBhZixNQUFJO0FBQ0YsbUJBQWUsTUFEYjtBQUVGLGVBQVcsTUFGVDtBQUdGLGlCQUFhO0FBSFgsR0ExYVc7QUErYWYsTUFBSTtBQUNGLG1CQUFlLFVBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBL2FXO0FBb2JmLE1BQUk7QUFDRixtQkFBZSxTQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXBiVztBQXliZixNQUFJO0FBQ0YsbUJBQWUsV0FEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0F6Ylc7QUE4YmYsTUFBSTtBQUNGLG1CQUFlLFVBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBOWJXO0FBbWNmLE1BQUk7QUFDRixtQkFBZSxRQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQW5jVztBQXdjZixNQUFJO0FBQ0YsbUJBQWUsYUFEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0F4Y1c7QUE2Y2YsTUFBSTtBQUNGLG1CQUFlLFlBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBN2NXO0FBa2RmLE1BQUk7QUFDRixtQkFBZSxhQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQWxkVztBQXVkZixNQUFJO0FBQ0YsbUJBQWUsTUFEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0F2ZFc7QUE0ZGYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLElBRlQ7QUFHRixpQkFBYTtBQUhYLEdBNWRXO0FBaWVmLE1BQUk7QUFDRixtQkFBZSxTQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQWplVztBQXNlZixPQUFLO0FBQ0gsbUJBQWUsU0FEWjtBQUVILGVBQVcsS0FGUjtBQUdILGlCQUFhO0FBSFYsR0F0ZVU7QUEyZWYsTUFBSTtBQUNGLG1CQUFlLEtBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBM2VXO0FBZ2ZmLE1BQUk7QUFDRixtQkFBZSxXQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQWhmVztBQXFmZixNQUFJO0FBQ0YsbUJBQWUsU0FEYjtBQUVGLGVBQVcsS0FGVDtBQUdGLGlCQUFhO0FBSFgsR0FyZlc7QUEwZmYsTUFBSTtBQUNGLG1CQUFlLFdBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBMWZXO0FBK2ZmLE1BQUk7QUFDRixtQkFBZSxVQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQS9mVztBQW9nQmYsT0FBSztBQUNILG1CQUFlLFFBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBcGdCVTtBQXlnQmYsTUFBSTtBQUNGLG1CQUFlLFVBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBemdCVztBQThnQmYsTUFBSTtBQUNGLG1CQUFlLFVBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBOWdCVztBQW1oQmYsTUFBSTtBQUNGLG1CQUFlLE9BRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBbmhCVztBQXdoQmYsTUFBSTtBQUNGLG1CQUFlLFFBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBeGhCVztBQTZoQmYsTUFBSTtBQUNGLG1CQUFlLFVBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBN2hCVztBQWtpQmYsTUFBSTtBQUNGLG1CQUFlLFFBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBbGlCVztBQXVpQmYsTUFBSTtBQUNGLG1CQUFlLGFBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBdmlCVztBQTRpQmYsTUFBSTtBQUNGLG1CQUFlLFdBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBNWlCVztBQWlqQmYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBampCVztBQXNqQmYsT0FBSztBQUNILG1CQUFlLFFBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBdGpCVTtBQTJqQmYsTUFBSTtBQUNGLG1CQUFlLFFBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBM2pCVztBQWdrQmYsTUFBSTtBQUNGLG1CQUFlLFFBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBaGtCVztBQXFrQmYsTUFBSTtBQUNGLG1CQUFlLFVBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBcmtCVztBQTBrQmYsT0FBSztBQUNILG1CQUFlLFdBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBMWtCVTtBQStrQmYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBL2tCVztBQW9sQmYsTUFBSTtBQUNGLG1CQUFlLE1BRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBcGxCVztBQXlsQmYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBemxCVztBQThsQmYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBOWxCVztBQW1tQmYsTUFBSTtBQUNGLG1CQUFlLE9BRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBbm1CVztBQXdtQmYsT0FBSztBQUNILG1CQUFlLFFBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBeG1CVTtBQTZtQmYsT0FBSztBQUNILG1CQUFlLE9BRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBN21CVTtBQWtuQmYsTUFBSTtBQUNGLG1CQUFlLGVBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBbG5CVztBQXVuQmYsTUFBSTtBQUNGLG1CQUFlLE9BRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBdm5CVztBQTRuQmYsTUFBSTtBQUNGLG1CQUFlLFlBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBNW5CVztBQWlvQmYsT0FBSztBQUNILG1CQUFlLFVBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBam9CVTtBQXNvQmYsT0FBSztBQUNILG1CQUFlLFNBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBdG9CVTtBQTJvQmYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBM29CVztBQWdwQmYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBaHBCVztBQXFwQmYsTUFBSTtBQUNGLG1CQUFlLFlBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBcnBCVztBQTBwQmYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBMXBCVztBQStwQmYsYUFBVztBQUNULG1CQUFlLFlBRE47QUFFVCxlQUFXLEtBRkY7QUFHVCxpQkFBYTtBQUhKLEdBL3BCSTtBQW9xQmYsTUFBSTtBQUNGLG1CQUFlLFVBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBcHFCVztBQXlxQmYsT0FBSztBQUNILG1CQUFlLFVBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBenFCVTtBQThxQmYsTUFBSTtBQUNGLG1CQUFlLGFBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBOXFCVztBQW1yQmYsTUFBSTtBQUNGLG1CQUFlLE9BRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBbnJCVztBQXdyQmYsT0FBSztBQUNILG1CQUFlLGFBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBeHJCVTtBQTZyQmYsTUFBSTtBQUNGLG1CQUFlLFlBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBN3JCVztBQWtzQmYsTUFBSTtBQUNGLG1CQUFlLFdBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBbHNCVztBQXVzQmYsTUFBSTtBQUNGLG1CQUFlLFdBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBdnNCVztBQTRzQmYsTUFBSTtBQUNGLG1CQUFlLFVBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBNXNCVztBQWl0QmYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBanRCVztBQXN0QmYsTUFBSTtBQUNGLG1CQUFlLE9BRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBdHRCVztBQTJ0QmYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBM3RCVztBQWd1QmYsT0FBSztBQUNILG1CQUFlLE9BRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBaHVCVTtBQXF1QmYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBcnVCVztBQTB1QmYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBMXVCVztBQSt1QmYsT0FBSztBQUNILG1CQUFlLFNBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBL3VCVTtBQW92QmYsT0FBSztBQUNILG1CQUFlLFlBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBcHZCVTtBQXl2QmYsTUFBSTtBQUNGLG1CQUFlLE9BRGI7QUFFRixlQUFXLFNBRlQ7QUFHRixpQkFBYTtBQUhYLEdBenZCVztBQTh2QmYsT0FBSztBQUNILG1CQUFlLFlBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBOXZCVTtBQW13QmYsWUFBVTtBQUNSLG1CQUFlLE9BRFA7QUFFUixlQUFXLEtBRkg7QUFHUixpQkFBYTtBQUhMLEdBbndCSztBQXd3QmYsTUFBSTtBQUNGLG1CQUFlLFFBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBeHdCVztBQTZ3QmYsT0FBSztBQUNILG1CQUFlLE9BRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBN3dCVTtBQWt4QmYsTUFBSTtBQUNGLG1CQUFlLFFBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBbHhCVztBQXV4QmYsTUFBSTtBQUNGLG1CQUFlLE9BRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBdnhCVztBQTR4QmYsTUFBSTtBQUNGLG1CQUFlLFdBRGI7QUFFRixlQUFXLFNBRlQ7QUFHRixpQkFBYTtBQUhYLEdBNXhCVztBQWl5QmYsTUFBSTtBQUNGLG1CQUFlLFdBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBanlCVztBQXN5QmYsTUFBSTtBQUNGLG1CQUFlLE9BRGI7QUFFRixlQUFXLFNBRlQ7QUFHRixpQkFBYTtBQUhYLEdBdHlCVztBQTJ5QmYsT0FBSztBQUNILG1CQUFlLFVBRFo7QUFFSCxlQUFXLE9BRlI7QUFHSCxpQkFBYTtBQUhWLEdBM3lCVTtBQWd6QmYsT0FBSztBQUNILG1CQUFlLFFBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBaHpCVTtBQXF6QmYsTUFBSTtBQUNGLG1CQUFlLFFBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBcnpCVztBQTB6QmYsTUFBSTtBQUNGLG1CQUFlLFVBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBMXpCVztBQSt6QmYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBL3pCVztBQW8wQmYsTUFBSTtBQUNGLG1CQUFlLFFBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBcDBCVztBQXkwQmYsTUFBSTtBQUNGLG1CQUFlLE9BRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBejBCVztBQTgwQmYsTUFBSTtBQUNGLG1CQUFlLE9BRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBOTBCVztBQW0xQmYsTUFBSTtBQUNGLG1CQUFlLFVBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBbjFCVztBQXcxQmYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBeDFCVztBQTYxQmYsT0FBSztBQUNILG1CQUFlLFlBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBNzFCVTtBQWsyQmYsT0FBSztBQUNILG1CQUFlLGFBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBbDJCVTtBQXUyQmYsT0FBSztBQUNILG1CQUFlLFlBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBdjJCVTtBQTQyQmYsT0FBSztBQUNILG1CQUFlLGNBRFo7QUFFSCxlQUFXLFFBRlI7QUFHSCxpQkFBYTtBQUhWLEdBNTJCVTtBQWkzQmYsTUFBSTtBQUNGLG1CQUFlLE1BRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBajNCVztBQXMzQmYsT0FBSztBQUNILG1CQUFlLFNBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBdDNCVTtBQTIzQmYsTUFBSTtBQUNGLG1CQUFlLFFBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBMzNCVztBQWc0QmYsT0FBSztBQUNILG1CQUFlLGFBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBaDRCVTtBQXE0QmYsTUFBSTtBQUNGLG1CQUFlLFFBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBcjRCVztBQTA0QmYsTUFBSTtBQUNGLG1CQUFlLFlBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBMTRCVztBQSs0QmYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBLzRCVztBQW81QmYsTUFBSTtBQUNGLG1CQUFlLE9BRGI7QUFFRixlQUFXLFNBRlQ7QUFHRixpQkFBYTtBQUhYLEdBcDVCVztBQXk1QmYsT0FBSztBQUNILG1CQUFlLFFBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBejVCVTtBQTg1QmYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBOTVCVztBQW02QmYsTUFBSTtBQUNGLG1CQUFlLFVBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBbjZCVztBQXc2QmYsYUFBVztBQUNULG1CQUFlLFdBRE47QUFFVCxlQUFXLEtBRkY7QUFHVCxpQkFBYTtBQUhKLEdBeDZCSTtBQTY2QmYsTUFBSTtBQUNGLG1CQUFlLFNBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBNzZCVztBQWs3QmYsTUFBSTtBQUNGLG1CQUFlLFFBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBbDdCVztBQXU3QmYsTUFBSTtBQUNGLG1CQUFlLFVBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBdjdCVztBQTQ3QmYsTUFBSTtBQUNGLG1CQUFlLFdBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBNTdCVztBQWk4QmYsT0FBSztBQUNILG1CQUFlLFVBRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBajhCVTtBQXM4QmYsT0FBSztBQUNILG1CQUFlLE9BRFo7QUFFSCxlQUFXLEtBRlI7QUFHSCxpQkFBYTtBQUhWLEdBdDhCVTtBQTI4QmYsTUFBSTtBQUNGLG1CQUFlLFFBRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBMzhCVztBQWc5QmYsTUFBSTtBQUNGLG1CQUFlLFVBRGI7QUFFRixlQUFXLE1BRlQ7QUFHRixpQkFBYTtBQUhYLEdBaDlCVztBQXE5QmYsTUFBSTtBQUNGLG1CQUFlLE9BRGI7QUFFRixlQUFXLEtBRlQ7QUFHRixpQkFBYTtBQUhYLEdBcjlCVztBQTA5QmYsTUFBSTtBQUNGLG1CQUFlLGdCQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTE5Qlc7QUErOUJmLE1BQUk7QUFDRixtQkFBZSxXQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQS85Qlc7QUFvK0JmLFVBQVE7QUFDTixtQkFBZSxRQURUO0FBRU4sZUFBVyxTQUZMO0FBR04saUJBQWE7QUFIUCxHQXArQk87QUF5K0JmLE1BQUk7QUFDRixtQkFBZSxRQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXorQlc7QUE4K0JmLE1BQUk7QUFDRixtQkFBZSxXQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTkrQlc7QUFtL0JmLE1BQUk7QUFDRixtQkFBZSxRQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQW4vQlc7QUF3L0JmLE1BQUk7QUFDRixtQkFBZSxPQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXgvQlc7QUE2L0JmLE1BQUk7QUFDRixtQkFBZSxTQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTcvQlc7QUFrZ0NmLE1BQUk7QUFDRixtQkFBZSxVQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQWxnQ1c7QUF1Z0NmLE1BQUk7QUFDRixtQkFBZSxTQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXZnQ1c7QUE0Z0NmLE1BQUk7QUFDRixtQkFBZSxPQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTVnQ1c7QUFpaENmLE1BQUk7QUFDRixtQkFBZSxVQURiO0FBRUYsZUFBVyxPQUZUO0FBR0YsaUJBQWE7QUFIWCxHQWpoQ1c7QUFzaENmLE1BQUk7QUFDRixtQkFBZSxXQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXRoQ1c7QUEyaENmLE1BQUk7QUFDRixtQkFBZSxTQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTNoQ1c7QUFnaUNmLE1BQUk7QUFDRixtQkFBZSxTQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQWhpQ1c7QUFxaUNmLE1BQUk7QUFDRixtQkFBZSxPQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXJpQ1c7QUEwaUNmLE1BQUk7QUFDRixtQkFBZSxRQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTFpQ1c7QUEraUNmLE9BQUs7QUFDSCxtQkFBZSxPQURaO0FBRUgsZUFBVyxLQUZSO0FBR0gsaUJBQWE7QUFIVixHQS9pQ1U7QUFvakNmLE1BQUk7QUFDRixtQkFBZSxPQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXBqQ1c7QUF5akNmLE1BQUk7QUFDRixtQkFBZSxNQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXpqQ1c7QUE4akNmLE1BQUk7QUFDRixtQkFBZSxVQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTlqQ1c7QUFta0NmLE1BQUk7QUFDRixtQkFBZSxTQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQW5rQ1c7QUF3a0NmLE1BQUk7QUFDRixtQkFBZSxTQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXhrQ1c7QUE2a0NmLE9BQUs7QUFDSCxtQkFBZSxTQURaO0FBRUgsZUFBVyxLQUZSO0FBR0gsaUJBQWE7QUFIVixHQTdrQ1U7QUFrbENmLE1BQUk7QUFDRixtQkFBZSxRQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQWxsQ1c7QUF1bENmLE1BQUk7QUFDRixtQkFBZSxPQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXZsQ1c7QUE0bENmLE9BQUs7QUFDSCxtQkFBZSxLQURaO0FBRUgsZUFBVyxPQUZSO0FBR0gsaUJBQWE7QUFIVixHQTVsQ1U7QUFpbUNmLE1BQUk7QUFDRixtQkFBZSxTQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQWptQ1c7QUFzbUNmLE1BQUk7QUFDRixtQkFBZSxRQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXRtQ1c7QUEybUNmLE1BQUk7QUFDRixtQkFBZSxPQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTNtQ1c7QUFnbkNmLE9BQUs7QUFDSCxtQkFBZSxTQURaO0FBRUgsZUFBVyxLQUZSO0FBR0gsaUJBQWE7QUFIVixHQWhuQ1U7QUFxbkNmLE1BQUk7QUFDRixtQkFBZSxLQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXJuQ1c7QUEwbkNmLE1BQUk7QUFDRixtQkFBZSxVQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTFuQ1c7QUErbkNmLE9BQUs7QUFDSCxtQkFBZSxRQURaO0FBRUgsZUFBVyxLQUZSO0FBR0gsaUJBQWE7QUFIVixHQS9uQ1U7QUFvb0NmLE1BQUk7QUFDRixtQkFBZSxRQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXBvQ1c7QUF5b0NmLE1BQUk7QUFDRixtQkFBZSxXQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXpvQ1c7QUE4b0NmLE1BQUk7QUFDRixtQkFBZSxNQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTlvQ1c7QUFtcENmLE1BQUk7QUFDRixtQkFBZSxPQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQW5wQ1c7QUF3cENmLE1BQUk7QUFDRixtQkFBZSxPQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXhwQ1c7QUE2cENmLE1BQUk7QUFDRixtQkFBZSxZQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTdwQ1c7QUFrcUNmLE9BQUs7QUFDSCxtQkFBZSxVQURaO0FBRUgsZUFBVyxLQUZSO0FBR0gsaUJBQWE7QUFIVixHQWxxQ1U7QUF1cUNmLE9BQUs7QUFDSCxtQkFBZSxNQURaO0FBRUgsZUFBVyxTQUZSO0FBR0gsaUJBQWE7QUFIVixHQXZxQ1U7QUE0cUNmLE1BQUk7QUFDRixtQkFBZSxTQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTVxQ1c7QUFpckNmLE1BQUk7QUFDRixtQkFBZSxTQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQWpyQ1c7QUFzckNmLE9BQUs7QUFDSCxtQkFBZSxhQURaO0FBRUgsZUFBVyxLQUZSO0FBR0gsaUJBQWE7QUFIVixHQXRyQ1U7QUEyckNmLE1BQUk7QUFDRixtQkFBZSxPQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTNyQ1c7QUFnc0NmLE9BQUs7QUFDSCxtQkFBZSxRQURaO0FBRUgsZUFBVyxLQUZSO0FBR0gsaUJBQWE7QUFIVixHQWhzQ1U7QUFxc0NmLE1BQUk7QUFDRixtQkFBZSxPQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXJzQ1c7QUEwc0NmLE1BQUk7QUFDRixtQkFBZSxTQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQTFzQ1c7QUErc0NmLE1BQUk7QUFDRixtQkFBZSxRQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQS9zQ1c7QUFvdENmLE1BQUk7QUFDRixtQkFBZSxRQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXB0Q1c7QUF5dENmLE1BQUk7QUFDRixtQkFBZSxTQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWCxHQXp0Q1c7QUE4dENmLGtCQUFnQjtBQUNkLG1CQUFlLFdBREQ7QUFFZCxlQUFXLFNBRkc7QUFHZCxpQkFBYTtBQUhDLEdBOXRDRDtBQW11Q2YsZ0JBQWM7QUFDWixtQkFBZSxRQURIO0FBRVosZUFBVyxLQUZDO0FBR1osaUJBQWE7QUFIRCxHQW51Q0M7QUF3dUNmLFlBQVU7QUFDUixtQkFBZSxXQURQO0FBRVIsZUFBVyxLQUZIO0FBR1IsaUJBQWE7QUFITCxHQXh1Q0s7QUE2dUNmLE1BQUk7QUFDRixtQkFBZSxNQURiO0FBRUYsZUFBVyxLQUZUO0FBR0YsaUJBQWE7QUFIWDtBQTd1Q1csQ0FBakI7Ozs7O0FDQUE7QUFDQSxJQUFNLFdBQVc7QUFDZixVQUFRLDBCQURPO0FBRWYsZ0JBQWMsMkJBRkM7QUFHZixlQUFhLDBCQUhFO0FBSWYsVUFBUSwwQkFKTztBQUtmLGdCQUFjLDJCQUxDO0FBTWYsV0FBUywyQkFOTTtBQU9mLFVBQVEsMEJBUE87QUFRZixnQkFBYywyQkFSQztBQVNmLGVBQWEsMEJBVEU7QUFVZixlQUFhLDBCQVZFO0FBV2YsVUFBUSwwQkFYTztBQVlmLGdCQUFjLDJCQVpDO0FBYWYsZUFBYSwwQkFiRTtBQWNmLFdBQVMsMkJBZE07QUFlZixpQkFBZSw0QkFmQTtBQWdCZixnQkFBYywyQkFoQkM7QUFpQmYsZ0JBQWMsMkJBakJDO0FBa0JmLFVBQVEsMEJBbEJPO0FBbUJmLGdCQUFjLDJCQW5CQztBQW9CZixlQUFhLDBCQXBCRTtBQXFCZixVQUFRLDBCQXJCTztBQXNCZixnQkFBYywyQkF0QkM7QUF1QmYsV0FBUywyQkF2Qk07QUF3QmYsaUJBQWUsNEJBeEJBO0FBeUJmLGdCQUFjLDJCQXpCQztBQTBCZixnQkFBYywyQkExQkM7QUEyQmYsaUJBQWUsNEJBM0JBO0FBNEJmLFVBQVEsMEJBNUJPO0FBNkJmLGdCQUFjLDJCQTdCQztBQThCZixlQUFhLDBCQTlCRTtBQStCZixjQUFZLHlCQS9CRztBQWdDZixlQUFhLDBCQWhDRTtBQWlDZixnQkFBYywyQkFqQ0M7QUFrQ2YsaUJBQWUsNEJBbENBO0FBbUNmLFdBQVMsMkJBbkNNO0FBb0NmLFdBQVMsMkJBcENNO0FBcUNmLFVBQVEsMEJBckNPO0FBc0NmLGdCQUFjLDJCQXRDQztBQXVDZixlQUFhLDBCQXZDRTtBQXdDZixnQkFBYywyQkF4Q0M7QUF5Q2YsV0FBUywyQkF6Q007QUEwQ2YsaUJBQWUsNEJBMUNBO0FBMkNmLGdCQUFjLDJCQTNDQztBQTRDZixnQkFBYywyQkE1Q0M7QUE2Q2YsVUFBUSwwQkE3Q087QUE4Q2YsZ0JBQWMsMkJBOUNDO0FBK0NmLFVBQVEsMEJBL0NPO0FBZ0RmLGdCQUFjLDJCQWhEQztBQWlEZixlQUFhLDBCQWpERTtBQWtEZixVQUFRLDBCQWxETztBQW1EZixnQkFBYywyQkFuREM7QUFvRGYsZUFBYSwwQkFwREU7QUFxRGYsZUFBYSwwQkFyREU7QUFzRGYsZ0JBQWMsMkJBdERDO0FBdURmLFVBQVEsMEJBdkRPO0FBd0RmLGVBQWEsMEJBeERFO0FBeURmLFdBQVMsMkJBekRNO0FBMERmLGVBQWEsK0JBMURFO0FBMkRmLFdBQVMsMkJBM0RNO0FBNERmLFVBQVEsMEJBNURPO0FBNkRmLGdCQUFjLDJCQTdEQztBQThEZixlQUFhLDBCQTlERTtBQStEZixlQUFhLDBCQS9ERTtBQWdFZixnQkFBYywyQkFoRUM7QUFpRWYsZ0JBQWMsZ0NBakVDO0FBa0VmLFVBQVEsMEJBbEVPO0FBbUVmLGdCQUFjLDJCQW5FQztBQW9FZixlQUFhLDBCQXBFRTtBQXFFZixjQUFZLHlCQXJFRztBQXNFZixlQUFhLDBCQXRFRTtBQXVFZixnQkFBYywyQkF2RUM7QUF3RWYsVUFBUSwwQkF4RU87QUF5RWYsZ0JBQWMsMkJBekVDO0FBMEVmLFVBQVEsMEJBMUVPO0FBMkVmLGdCQUFjLDJCQTNFQztBQTRFZixlQUFhLDBCQTVFRTtBQTZFZixXQUFTLDJCQTdFTTtBQThFZixVQUFRLDBCQTlFTztBQStFZixnQkFBYywyQkEvRUM7QUFnRmYsZUFBYSwwQkFoRkU7QUFpRmYsZUFBYSwwQkFqRkU7QUFrRmYsVUFBUSwwQkFsRk87QUFtRmYsZ0JBQWMsMkJBbkZDO0FBb0ZmLGVBQWEsMEJBcEZFO0FBcUZmLGdCQUFjLDJCQXJGQztBQXNGZixVQUFRLDBCQXRGTztBQXVGZixnQkFBYywyQkF2RkM7QUF3RmYsZUFBYSwwQkF4RkU7QUF5RmYsV0FBUywyQkF6Rk07QUEwRmYsVUFBUSwwQkExRk87QUEyRmYsZ0JBQWMsMkJBM0ZDO0FBNEZmLGVBQWEsMEJBNUZFO0FBNkZmLGdCQUFjLDJCQTdGQztBQThGZixVQUFRLDBCQTlGTztBQStGZixnQkFBYywyQkEvRkM7QUFnR2YsZUFBYSwwQkFoR0U7QUFpR2YsY0FBWSx5QkFqR0c7QUFrR2YsZUFBYSwwQkFsR0U7QUFtR2YsZ0JBQWMsMkJBbkdDO0FBb0dmLFdBQVMsMkJBcEdNO0FBcUdmLFdBQVMsMkJBckdNO0FBc0dmLFVBQVEsMEJBdEdPO0FBdUdmLGdCQUFjLDJCQXZHQztBQXdHZixlQUFhLDBCQXhHRTtBQXlHZixjQUFZLHlCQXpHRztBQTBHZixlQUFhLDBCQTFHRTtBQTJHZixnQkFBYywyQkEzR0M7QUE0R2YsZUFBYSwrQkE1R0U7QUE2R2YsV0FBUywyQkE3R007QUE4R2YsVUFBUSwwQkE5R087QUErR2YsV0FBUywyQkEvR007QUFnSGYsVUFBUSwwQkFoSE87QUFpSGYsZ0JBQWMsMkJBakhDO0FBa0hmLGVBQWEsMEJBbEhFO0FBbUhmLFdBQVMsMkJBbkhNO0FBb0hmLFdBQVMsMkJBcEhNO0FBcUhmLGlCQUFlLDRCQXJIQTtBQXNIZixXQUFTLDJCQXRITTtBQXVIZixXQUFTLDJCQXZITTtBQXdIZixVQUFRLDBCQXhITztBQXlIZixnQkFBYywyQkF6SEM7QUEwSGYsZUFBYSwwQkExSEU7QUEySGYsZUFBYSwwQkEzSEU7QUE0SGYsVUFBUSwwQkE1SE87QUE2SGYsZ0JBQWMsMkJBN0hDO0FBOEhmLGVBQWEsMEJBOUhFO0FBK0hmLFdBQVMsMkJBL0hNO0FBZ0lmLFVBQVEsMEJBaElPO0FBaUlmLGdCQUFjLDJCQWpJQztBQWtJZixlQUFhLDBCQWxJRTtBQW1JZixjQUFZLHlCQW5JRztBQW9JZixlQUFhLDBCQXBJRTtBQXFJZixnQkFBYywyQkFySUM7QUFzSWYsaUJBQWUsNEJBdElBO0FBdUlmLFdBQVMsMkJBdklNO0FBd0lmLGlCQUFlLDRCQXhJQTtBQXlJZixVQUFRLDBCQXpJTztBQTBJZixVQUFRLDBCQTFJTztBQTJJZixlQUFhLDBCQTNJRTtBQTRJZixVQUFRLDBCQTVJTztBQTZJZixnQkFBYywyQkE3SUM7QUE4SWYsZUFBYSwwQkE5SUU7QUErSWYsZUFBYSwwQkEvSUU7QUFnSmYsZ0JBQWMsMkJBaEpDO0FBaUpmLFVBQVEsMEJBakpPO0FBa0pmLGdCQUFjLDJCQWxKQztBQW1KZixlQUFhLDBCQW5KRTtBQW9KZixlQUFhLDBCQXBKRTtBQXFKZixnQkFBYywyQkFySkM7QUFzSmYsVUFBUSwwQkF0Sk87QUF1SmYsZ0JBQWMsMkJBdkpDO0FBd0pmLGVBQWEsMEJBeEpFO0FBeUpmLGNBQVkseUJBekpHO0FBMEpmLGVBQWEsMEJBMUpFO0FBMkpmLGdCQUFjLDJCQTNKQztBQTRKZixpQkFBZSw0QkE1SkE7QUE2SmYsZ0JBQWMsMkJBN0pDO0FBOEpmLFdBQVMsMkJBOUpNO0FBK0pmLFdBQVMsMkJBL0pNO0FBZ0tmLFVBQVEsMEJBaEtPO0FBaUtmLGdCQUFjLDJCQWpLQztBQWtLZixVQUFRLDBCQWxLTztBQW1LZixnQkFBYywyQkFuS0M7QUFvS2YsVUFBUSwwQkFwS087QUFxS2YsVUFBUSwwQkFyS087QUFzS2YsZ0JBQWMsMkJBdEtDO0FBdUtmLGVBQWEsMEJBdktFO0FBd0tmLGNBQVkseUJBeEtHO0FBeUtmLGVBQWEsMEJBektFO0FBMEtmLGdCQUFjLDJCQTFLQztBQTJLZixpQkFBZSw0QkEzS0E7QUE0S2YsZ0JBQWMsMkJBNUtDO0FBNktmLFdBQVMsMkJBN0tNO0FBOEtmLFVBQVEsMEJBOUtPO0FBK0tmLGdCQUFjLDJCQS9LQztBQWdMZixlQUFhLDBCQWhMRTtBQWlMZixjQUFZLHlCQWpMRztBQWtMZixlQUFhLDBCQWxMRTtBQW1MZixnQkFBYywyQkFuTEM7QUFvTGYsaUJBQWUsNEJBcExBO0FBcUxmLGdCQUFjLDJCQXJMQztBQXNMZixVQUFRLDBCQXRMTztBQXVMZixnQkFBYywyQkF2TEM7QUF3TGYsZUFBYSwwQkF4TEU7QUF5TGYsY0FBWSx5QkF6TEc7QUEwTGYsZUFBYSwwQkExTEU7QUEyTGYsZ0JBQWMsMkJBM0xDO0FBNExmLFVBQVEsMEJBNUxPO0FBNkxmLGdCQUFjLDJCQTdMQztBQThMZixlQUFhLDBCQTlMRTtBQStMZixjQUFZLHlCQS9MRztBQWdNZixlQUFhLDBCQWhNRTtBQWlNZixnQkFBYywyQkFqTUM7QUFrTWYsaUJBQWUsNEJBbE1BO0FBbU1mLGdCQUFjLDJCQW5NQztBQW9NZixVQUFRLDBCQXBNTztBQXFNZixnQkFBYywyQkFyTUM7QUFzTWYsZUFBYSwwQkF0TUU7QUF1TWYsZUFBYSwwQkF2TUU7QUF3TWYsZ0JBQWMsMkJBeE1DO0FBeU1mLFVBQVEsMEJBek1PO0FBME1mLGdCQUFjLDJCQTFNQztBQTJNZixlQUFhLDBCQTNNRTtBQTRNZixlQUFhLDBCQTVNRTtBQTZNZixXQUFTLDJCQTdNTTtBQThNZixVQUFRLDBCQTlNTztBQStNZixnQkFBYywyQkEvTUM7QUFnTmYsZUFBYSwwQkFoTkU7QUFpTmYsY0FBWSx5QkFqTkc7QUFrTmYsZUFBYSwwQkFsTkU7QUFtTmYsZ0JBQWMsMkJBbk5DO0FBb05mLGdCQUFjLDJCQXBOQztBQXFOZixVQUFRLDBCQXJOTztBQXNOZixVQUFRLDBCQXROTztBQXVOZixnQkFBYywyQkF2TkM7QUF3TmYsZUFBYSwwQkF4TkU7QUF5TmYsY0FBWSx5QkF6Tkc7QUEwTmYsZUFBYSwwQkExTkU7QUEyTmYsZ0JBQWMsMkJBM05DO0FBNE5mLGlCQUFlLDRCQTVOQTtBQTZOZixlQUFhLCtCQTdORTtBQThOZixVQUFRLDBCQTlOTztBQStOZixnQkFBYywyQkEvTkM7QUFnT2YsVUFBUSwwQkFoT087QUFpT2YsZ0JBQWMsMkJBak9DO0FBa09mLGdCQUFjLDJCQWxPQztBQW1PZixVQUFRLDBCQW5PTztBQW9PZixnQkFBYywyQkFwT0M7QUFxT2YsZUFBYSwwQkFyT0U7QUFzT2YsY0FBWSx5QkF0T0c7QUF1T2YsZUFBYSwwQkF2T0U7QUF3T2YsZ0JBQWMsMkJBeE9DO0FBeU9mLGlCQUFlLDRCQXpPQTtBQTBPZixnQkFBYywyQkExT0M7QUEyT2YsV0FBUywyQkEzT007QUE0T2YsV0FBUywyQkE1T007QUE2T2YsV0FBUywyQkE3T007QUE4T2YsVUFBUSwwQkE5T087QUErT2YsZ0JBQWMsMkJBL09DO0FBZ1BmLGVBQWEsMEJBaFBFO0FBaVBmLFVBQVEsMEJBalBPO0FBa1BmLGdCQUFjLDJCQWxQQztBQW1QZixlQUFhLDBCQW5QRTtBQW9QZixlQUFhLDBCQXBQRTtBQXFQZixXQUFTLDJCQXJQTTtBQXNQZixXQUFTLDJCQXRQTTtBQXVQZixVQUFRLDBCQXZQTztBQXdQZixnQkFBYywyQkF4UEM7QUF5UGYsVUFBUSwwQkF6UE87QUEwUGYsZ0JBQWMsMkJBMVBDO0FBMlBmLGVBQWEsMEJBM1BFO0FBNFBmLGVBQWEsMEJBNVBFO0FBNlBmLGdCQUFjLDJCQTdQQztBQThQZixXQUFTLDJCQTlQTTtBQStQZixVQUFRLDBCQS9QTztBQWdRZixnQkFBYywyQkFoUUM7QUFpUWYsZUFBYSwwQkFqUUU7QUFrUWYsV0FBUywyQkFsUU07QUFtUWYsZ0JBQWMsMkJBblFDO0FBb1FmLFVBQVEsMEJBcFFPO0FBcVFmLGdCQUFjLDJCQXJRQztBQXNRZixlQUFhLDBCQXRRRTtBQXVRZixlQUFhLDBCQXZRRTtBQXdRZixnQkFBYywyQkF4UUM7QUF5UWYsVUFBUSwwQkF6UU87QUEwUWYsZ0JBQWMsMkJBMVFDO0FBMlFmLFVBQVEsMEJBM1FPO0FBNFFmLGdCQUFjLDJCQTVRQztBQTZRZixXQUFTLDJCQTdRTTtBQThRZixXQUFTLDJCQTlRTTtBQStRZixVQUFRLDBCQS9RTztBQWdSZixnQkFBYywyQkFoUkM7QUFpUmYsZUFBYSwwQkFqUkU7QUFrUmYsY0FBWSx5QkFsUkc7QUFtUmYsZUFBYSwwQkFuUkU7QUFvUmYsZ0JBQWMsMkJBcFJDO0FBcVJmLGdCQUFjLDJCQXJSQztBQXNSZixVQUFRLDBCQXRSTztBQXVSZixnQkFBYywyQkF2UkM7QUF3UmYsZUFBYSwwQkF4UkU7QUF5UmYsZUFBYSwwQkF6UkU7QUEwUmYsV0FBUywyQkExUk07QUEyUmYsVUFBUSwwQkEzUk87QUE0UmYsVUFBUSwwQkE1Uk87QUE2UmYsZ0JBQWMsMkJBN1JDO0FBOFJmLGVBQWEsMEJBOVJFO0FBK1JmLGVBQWEsMEJBL1JFO0FBZ1NmLGdCQUFjLDJCQWhTQztBQWlTZixXQUFTLDJCQWpTTTtBQWtTZixpQkFBZSw0QkFsU0E7QUFtU2YsVUFBUSwwQkFuU087QUFvU2YsZ0JBQWMsMkJBcFNDO0FBcVNmLFVBQVEsMEJBclNPO0FBc1NmLGdCQUFjLDJCQXRTQztBQXVTZixlQUFhLDBCQXZTRTtBQXdTZixjQUFZLHlCQXhTRztBQXlTZixlQUFhLDBCQXpTRTtBQTBTZixnQkFBYywyQkExU0M7QUEyU2YsVUFBUSwwQkEzU087QUE0U2YsZ0JBQWMsMkJBNVNDO0FBNlNmLGVBQWEsMEJBN1NFO0FBOFNmLGVBQWEsMEJBOVNFO0FBK1NmLGdCQUFjLDJCQS9TQztBQWdUZixVQUFRLDBCQWhUTztBQWlUZixVQUFRLDBCQWpUTztBQWtUZixnQkFBYywyQkFsVEM7QUFtVGYsZUFBYSwwQkFuVEU7QUFvVGYsVUFBUSwwQkFwVE87QUFxVGYsZ0JBQWMsMkJBclRDO0FBc1RmLGVBQWEsMEJBdFRFO0FBdVRmLGVBQWEsMEJBdlRFO0FBd1RmLGdCQUFjLDJCQXhUQztBQXlUZixVQUFRLDBCQXpUTztBQTBUZixnQkFBYywyQkExVEM7QUEyVGYsZUFBYSwwQkEzVEU7QUE0VGYsVUFBUSwwQkE1VE87QUE2VGYsVUFBUSwwQkE3VE87QUE4VGYsVUFBUSwwQkE5VE87QUErVGYsZ0JBQWMsMkJBL1RDO0FBZ1VmLFdBQVMsMkJBaFVNO0FBaVVmLFVBQVEsMEJBalVPO0FBa1VmLGdCQUFjLDJCQWxVQztBQW1VZixVQUFRLDBCQW5VTztBQW9VZixnQkFBYywyQkFwVUM7QUFxVWYsZUFBYSwwQkFyVUU7QUFzVWYsZUFBYSwwQkF0VUU7QUF1VWYsZ0JBQWMsMkJBdlVDO0FBd1VmLFVBQVEsMEJBeFVPO0FBeVVmLGdCQUFjLDJCQXpVQztBQTBVZixlQUFhLDBCQTFVRTtBQTJVZixjQUFZLHlCQTNVRztBQTRVZixlQUFhLDBCQTVVRTtBQTZVZixnQkFBYywyQkE3VUM7QUE4VWYsaUJBQWUsNEJBOVVBO0FBK1VmLGdCQUFjLDJCQS9VQztBQWdWZixVQUFRLDBCQWhWTztBQWlWZixnQkFBYywyQkFqVkM7QUFrVmYsVUFBUSwwQkFsVk87QUFtVmYsZ0JBQWMsMkJBblZDO0FBb1ZmLGVBQWEsMEJBcFZFO0FBcVZmLGNBQVkseUJBclZHO0FBc1ZmLGVBQWEsMEJBdFZFO0FBdVZmLGdCQUFjLDJCQXZWQztBQXdWZixpQkFBZSw0QkF4VkE7QUF5VmYsV0FBUywyQkF6Vk07QUEwVmYsaUJBQWUsNEJBMVZBO0FBMlZmLFVBQVEsMEJBM1ZPO0FBNFZmLGdCQUFjLDJCQTVWQztBQTZWZixVQUFRLDBCQTdWTztBQThWZixnQkFBYywyQkE5VkM7QUErVmYsZUFBYSwwQkEvVkU7QUFnV2YsZUFBYSwwQkFoV0U7QUFpV2YsV0FBUywyQkFqV007QUFrV2YsV0FBUywyQkFsV007QUFtV2YsV0FBUywyQkFuV007QUFvV2YsVUFBUSwwQkFwV087QUFxV2YsVUFBUSwwQkFyV087QUFzV2YsVUFBUSwwQkF0V087QUF1V2YsVUFBUSwwQkF2V087QUF3V2YsZ0JBQWMsMkJBeFdDO0FBeVdmLGVBQWEsMEJBeldFO0FBMFdmLGVBQWEsMEJBMVdFO0FBMldmLFVBQVEsMEJBM1dPO0FBNFdmLGdCQUFjLDJCQTVXQztBQTZXZixVQUFRLDBCQTdXTztBQThXZixnQkFBYywyQkE5V0M7QUErV2YsZUFBYSwwQkEvV0U7QUFnWGYsVUFBUSwwQkFoWE87QUFpWGYsZ0JBQWMsMkJBalhDO0FBa1hmLGVBQWEsMEJBbFhFO0FBbVhmLGVBQWEsMEJBblhFO0FBb1hmLGdCQUFjLDJCQXBYQztBQXFYZixVQUFRLDBCQXJYTztBQXNYZixnQkFBYywyQkF0WEM7QUF1WGYsZUFBYSwwQkF2WEU7QUF3WGYsY0FBWSx5QkF4WEc7QUF5WGYsZUFBYSwwQkF6WEU7QUEwWGYsZ0JBQWMsMkJBMVhDO0FBMlhmLGlCQUFlLDRCQTNYQTtBQTRYZixXQUFTLDJCQTVYTTtBQTZYZixVQUFRLDBCQTdYTztBQThYZixlQUFhLDBCQTlYRTtBQStYZixXQUFTLDJCQS9YTTtBQWdZZixVQUFRLDBCQWhZTztBQWlZZixnQkFBYywyQkFqWUM7QUFrWWYsZUFBYSwwQkFsWUU7QUFtWWYsZUFBYSwwQkFuWUU7QUFvWWYsV0FBUywyQkFwWU07QUFxWWYsVUFBUSwwQkFyWU87QUFzWWYsZ0JBQWMsMkJBdFlDO0FBdVlmLGVBQWEsMEJBdllFO0FBd1lmLGVBQWEsMEJBeFlFO0FBeVlmLFVBQVEsMEJBellPO0FBMFlmLFVBQVEsMEJBMVlPO0FBMllmLGdCQUFjLDJCQTNZQztBQTRZZixlQUFhLDBCQTVZRTtBQTZZZixVQUFRLDBCQTdZTztBQThZZixnQkFBYywyQkE5WUM7QUErWWYsZUFBYSwwQkEvWUU7QUFnWmYsZUFBYSwwQkFoWkU7QUFpWmYsVUFBUSwwQkFqWk87QUFrWmYsZ0JBQWMsMkJBbFpDO0FBbVpmLGVBQWEsMEJBblpFO0FBb1pmLGVBQWEsMEJBcFpFO0FBcVpmLGdCQUFjLDJCQXJaQztBQXNaZixXQUFTLDJCQXRaTTtBQXVaZixVQUFRLDBCQXZaTztBQXdaZixnQkFBYywyQkF4WkM7QUF5WmYsZUFBYSwwQkF6WkU7QUEwWmYsZUFBYSwwQkExWkU7QUEyWmYsV0FBUywyQkEzWk07QUE0WmYsV0FBUywyQkE1Wk07QUE2WmYsVUFBUSwwQkE3Wk87QUE4WmYsVUFBUSwwQkE5Wk87QUErWmYsZ0JBQWMsMkJBL1pDO0FBZ2FmLGVBQWEsMEJBaGFFO0FBaWFmLGVBQWEsMEJBamFFO0FBa2FmLGdCQUFjLDJCQWxhQztBQW1hZixXQUFTLDJCQW5hTTtBQW9hZixXQUFTLDJCQXBhTTtBQXFhZixVQUFRLDBCQXJhTztBQXNhZixnQkFBYywyQkF0YUM7QUF1YWYsZUFBYSwwQkF2YUU7QUF3YWYsVUFBUSwwQkF4YU87QUF5YWYsZ0JBQWMsMkJBemFDO0FBMGFmLFVBQVEsMEJBMWFPO0FBMmFmLGdCQUFjLDJCQTNhQztBQTRhZixlQUFhLDBCQTVhRTtBQTZhZixlQUFhLDBCQTdhRTtBQThhZixnQkFBYywyQkE5YUM7QUErYWYsV0FBUywyQkEvYU07QUFnYmYsVUFBUSwwQkFoYk87QUFpYmYsZ0JBQWMsMkJBamJDO0FBa2JmLGVBQWEsMEJBbGJFO0FBbWJmLFdBQVMsMkJBbmJNO0FBb2JmLGVBQWEsK0JBcGJFO0FBcWJmLFdBQVMsMkJBcmJNO0FBc2JmLFVBQVEsMEJBdGJPO0FBdWJmLGdCQUFjLDJCQXZiQztBQXdiZixlQUFhLDBCQXhiRTtBQXliZixVQUFRLDBCQXpiTztBQTBiZixnQkFBYywyQkExYkM7QUEyYmYsV0FBUywyQkEzYk07QUE0YmYsVUFBUSwwQkE1Yk87QUE2YmYsZ0JBQWMsMkJBN2JDO0FBOGJmLGVBQWEsMEJBOWJFO0FBK2JmLFdBQVMsMkJBL2JNO0FBZ2NmLFVBQVEsMEJBaGNPO0FBaWNmLGdCQUFjLDJCQWpjQztBQWtjZixlQUFhLDBCQWxjRTtBQW1jZixnQkFBYywyQkFuY0M7QUFvY2YsVUFBUSwwQkFwY087QUFxY2YsZ0JBQWMsMkJBcmNDO0FBc2NmLGVBQWEsMEJBdGNFO0FBdWNmLGVBQWEsMEJBdmNFO0FBd2NmLGdCQUFjLDJCQXhjQztBQXljZixVQUFRLDBCQXpjTztBQTBjZixnQkFBYywyQkExY0M7QUEyY2YsZUFBYSwwQkEzY0U7QUE0Y2YsVUFBUSwwQkE1Y087QUE2Y2YsZ0JBQWMsMkJBN2NDO0FBOGNmLFVBQVEsMEJBOWNPO0FBK2NmLGdCQUFjLDJCQS9jQztBQWdkZixlQUFhLDBCQWhkRTtBQWlkZixlQUFhLDBCQWpkRTtBQWtkZixnQkFBYywyQkFsZEM7QUFtZGYsV0FBUywyQkFuZE07QUFvZGYsVUFBUSwwQkFwZE87QUFxZGYsZ0JBQWMsMkJBcmRDO0FBc2RmLGVBQWEsMEJBdGRFO0FBdWRmLFVBQVEsMEJBdmRPO0FBd2RmLGdCQUFjLDJCQXhkQztBQXlkZixXQUFTLDJCQXpkTTtBQTBkZixXQUFTLDJCQTFkTTtBQTJkZixVQUFRLDBCQTNkTztBQTRkZixnQkFBYywyQkE1ZEM7QUE2ZGYsZUFBYSwwQkE3ZEU7QUE4ZGYsV0FBUywyQkE5ZE07QUErZGYsV0FBUywyQkEvZE07QUFnZWYsVUFBUSwwQkFoZU87QUFpZWYsZ0JBQWMsMkJBamVDO0FBa2VmLGVBQWEsMEJBbGVFO0FBbWVmLGVBQWEsMEJBbmVFO0FBb2VmLFdBQVMsMkJBcGVNO0FBcWVmLGlCQUFlLDRCQXJlQTtBQXNlZixnQkFBYywyQkF0ZUM7QUF1ZWYsV0FBUywyQkF2ZU07QUF3ZWYsV0FBUywyQkF4ZU07QUF5ZWYsaUJBQWUsNEJBemVBO0FBMGVmLGdCQUFjLDJCQTFlQztBQTJlZixnQkFBYywyQkEzZUM7QUE0ZWYsY0FBWSw4QkE1ZUc7QUE2ZWYsVUFBUSwwQkE3ZU87QUE4ZWYsZ0JBQWMsMkJBOWVDO0FBK2VmLGVBQWEsMEJBL2VFO0FBZ2ZmLFdBQVMsMkJBaGZNO0FBaWZmLFVBQVEsMEJBamZPO0FBa2ZmLFVBQVEsMEJBbGZPO0FBbWZmLGdCQUFjLDJCQW5mQztBQW9mZixlQUFhLDBCQXBmRTtBQXFmZixjQUFZLHlCQXJmRztBQXNmZixlQUFhLDBCQXRmRTtBQXVmZixnQkFBYywyQkF2ZkM7QUF3ZmYsZ0JBQWMsMkJBeGZDO0FBeWZmLFVBQVEsMEJBemZPO0FBMGZmLGdCQUFjLDJCQTFmQztBQTJmZixlQUFhLDBCQTNmRTtBQTRmZixVQUFRLDBCQTVmTztBQTZmZixnQkFBYywyQkE3ZkM7QUE4ZmYsZUFBYSwwQkE5ZkU7QUErZmYsY0FBWSx5QkEvZkc7QUFnZ0JmLGVBQWEsMEJBaGdCRTtBQWlnQmYsZ0JBQWMsMkJBamdCQztBQWtnQmYsV0FBUywyQkFsZ0JNO0FBbWdCZixXQUFTLDJCQW5nQk07QUFvZ0JmLFdBQVMsMkJBcGdCTTtBQXFnQmYsVUFBUSwwQkFyZ0JPO0FBc2dCZixVQUFRLDBCQXRnQk87QUF1Z0JmLFVBQVEsMEJBdmdCTztBQXdnQmYsZ0JBQWMsMkJBeGdCQztBQXlnQmYsZUFBYSwwQkF6Z0JFO0FBMGdCZixVQUFRLDBCQTFnQk87QUEyZ0JmLGdCQUFjLDJCQTNnQkM7QUE0Z0JmLFVBQVEsMEJBNWdCTztBQTZnQmYsZ0JBQWMsMkJBN2dCQztBQThnQmYsZ0JBQWMsMkJBOWdCQztBQStnQmYsVUFBUSwwQkEvZ0JPO0FBZ2hCZixVQUFRLDBCQWhoQk87QUFpaEJmLGdCQUFjLDJCQWpoQkM7QUFraEJmLGVBQWEsMEJBbGhCRTtBQW1oQmYsV0FBUywyQkFuaEJNO0FBb2hCZixXQUFTLDJCQXBoQk07QUFxaEJmLFdBQVMsMkJBcmhCTTtBQXNoQmYsV0FBUywyQkF0aEJNO0FBdWhCZixXQUFTLDJCQXZoQk07QUF3aEJmLFdBQVMsMkJBeGhCTTtBQXloQmYsVUFBUSwwQkF6aEJPO0FBMGhCZixnQkFBYywyQkExaEJDO0FBMmhCZixXQUFTLDJCQTNoQk07QUE0aEJmLFVBQVEsMEJBNWhCTztBQTZoQmYsZ0JBQWMsMkJBN2hCQztBQThoQmYsZUFBYSwwQkE5aEJFO0FBK2hCZixjQUFZLHlCQS9oQkc7QUFnaUJmLGVBQWEsMEJBaGlCRTtBQWlpQmYsZ0JBQWMsMkJBamlCQztBQWtpQmYsZ0JBQWMsMkJBbGlCQztBQW1pQmYsV0FBUywyQkFuaUJNO0FBb2lCZixXQUFTLDJCQXBpQk07QUFxaUJmLGlCQUFlLDRCQXJpQkE7QUFzaUJmLFdBQVMsMkJBdGlCTTtBQXVpQmYsVUFBUSwwQkF2aUJPO0FBd2lCZixnQkFBYywyQkF4aUJDO0FBeWlCZixlQUFhLDBCQXppQkU7QUEwaUJmLFVBQVEsMEJBMWlCTztBQTJpQmYsZ0JBQWMsMkJBM2lCQztBQTRpQmYsZUFBYSwwQkE1aUJFO0FBNmlCZixjQUFZLHlCQTdpQkc7QUE4aUJmLGVBQWEsMEJBOWlCRTtBQStpQmYsZ0JBQWMsMkJBL2lCQztBQWdqQmYsaUJBQWUsNEJBaGpCQTtBQWlqQmYsZ0JBQWMsMkJBampCQztBQWtqQmYsVUFBUSwwQkFsakJPO0FBbWpCZixnQkFBYywyQkFuakJDO0FBb2pCZixlQUFhLDBCQXBqQkU7QUFxakJmLGVBQWEsMEJBcmpCRTtBQXNqQmYsVUFBUSwwQkF0akJPO0FBdWpCZixnQkFBYywyQkF2akJDO0FBd2pCZixlQUFhLDBCQXhqQkU7QUF5akJmLFdBQVMsMkJBempCTTtBQTBqQmYsVUFBUSwwQkExakJPO0FBMmpCZixnQkFBYywyQkEzakJDO0FBNGpCZixVQUFRLDBCQTVqQk87QUE2akJmLGdCQUFjLDJCQTdqQkM7QUE4akJmLGVBQWEsMEJBOWpCRTtBQStqQmYsY0FBWSx5QkEvakJHO0FBZ2tCZixlQUFhLDBCQWhrQkU7QUFpa0JmLGdCQUFjLDJCQWprQkM7QUFra0JmLGdCQUFjLDJCQWxrQkM7QUFta0JmLGVBQWEsK0JBbmtCRTtBQW9rQmYscUJBQW1CLGdDQXBrQko7QUFxa0JmLGdCQUFjLGdDQXJrQkM7QUFza0JmLFVBQVEsMEJBdGtCTztBQXVrQmYsZ0JBQWMsMkJBdmtCQztBQXdrQmYsZUFBYSwwQkF4a0JFO0FBeWtCZixjQUFZLHlCQXprQkc7QUEwa0JmLGVBQWEsMEJBMWtCRTtBQTJrQmYsZ0JBQWMsMkJBM2tCQztBQTRrQmYsaUJBQWUsNEJBNWtCQTtBQTZrQmYsZ0JBQWMsMkJBN2tCQztBQThrQmYsV0FBUywyQkE5a0JNO0FBK2tCZixVQUFRLDBCQS9rQk87QUFnbEJmLGdCQUFjLDJCQWhsQkM7QUFpbEJmLFVBQVEsMEJBamxCTztBQWtsQmYsZ0JBQWMsMkJBbGxCQztBQW1sQmYsZUFBYSwwQkFubEJFO0FBb2xCZixlQUFhLDBCQXBsQkU7QUFxbEJmLGdCQUFjLDJCQXJsQkM7QUFzbEJmLFdBQVMsMkJBdGxCTTtBQXVsQmYsaUJBQWUsNEJBdmxCQTtBQXdsQmYsVUFBUSwwQkF4bEJPO0FBeWxCZixnQkFBYywyQkF6bEJDO0FBMGxCZixXQUFTLDJCQTFsQk07QUEybEJmLGlCQUFlLDRCQTNsQkE7QUE0bEJmLFdBQVMsMkJBNWxCTTtBQTZsQmYsVUFBUSwwQkE3bEJPO0FBOGxCZixnQkFBYywyQkE5bEJDO0FBK2xCZixjQUFZLHlCQS9sQkc7QUFnbUJmLFVBQVEsMEJBaG1CTztBQWltQmYsZUFBYSwwQkFqbUJFO0FBa21CZixVQUFRLDBCQWxtQk87QUFtbUJmLGdCQUFjLDJCQW5tQkM7QUFvbUJmLFVBQVEsMEJBcG1CTztBQXFtQmYsZ0JBQWMsMkJBcm1CQztBQXNtQmYsVUFBUSwwQkF0bUJPO0FBdW1CZixnQkFBYywyQkF2bUJDO0FBd21CZixlQUFhLDBCQXhtQkU7QUF5bUJmLGNBQVksOEJBem1CRztBQTBtQmYsb0JBQWtCLCtCQTFtQkg7QUEybUJmLG1CQUFpQiw4QkEzbUJGO0FBNG1CZixtQkFBaUIsOEJBNW1CRjtBQTZtQmYsVUFBUSwwQkE3bUJPO0FBOG1CZixnQkFBYywyQkE5bUJDO0FBK21CZixlQUFhLDBCQS9tQkU7QUFnbkJmLGVBQWEsMEJBaG5CRTtBQWluQmYsZ0JBQWMsMkJBam5CQztBQWtuQmYsVUFBUSwwQkFsbkJPO0FBbW5CZixnQkFBYywyQkFubkJDO0FBb25CZixlQUFhLDBCQXBuQkU7QUFxbkJmLGVBQWEsMEJBcm5CRTtBQXNuQmYsZ0JBQWMsMkJBdG5CQztBQXVuQmYsaUJBQWUsNEJBdm5CQTtBQXduQmYsVUFBUSwwQkF4bkJPO0FBeW5CZixnQkFBYywyQkF6bkJDO0FBMG5CZixVQUFRLDBCQTFuQk87QUEybkJmLGdCQUFjLDJCQTNuQkM7QUE0bkJmLFVBQVEsMEJBNW5CTztBQTZuQmYsZ0JBQWMsMkJBN25CQztBQThuQmYsVUFBUSwwQkE5bkJPO0FBK25CZixnQkFBYywyQkEvbkJDO0FBZ29CZixlQUFhLDBCQWhvQkU7QUFpb0JmLGNBQVkseUJBam9CRztBQWtvQmYsZUFBYSwwQkFsb0JFO0FBbW9CZixVQUFRLDBCQW5vQk87QUFvb0JmLGdCQUFjLDJCQXBvQkM7QUFxb0JmLGVBQWEsMEJBcm9CRTtBQXNvQmYsY0FBWSx5QkF0b0JHO0FBdW9CZixlQUFhLDBCQXZvQkU7QUF3b0JmLGdCQUFjLDJCQXhvQkM7QUF5b0JmLFdBQVMsMkJBem9CTTtBQTBvQmYsVUFBUSwwQkExb0JPO0FBMm9CZixnQkFBYywyQkEzb0JDO0FBNG9CZixVQUFRLDBCQTVvQk87QUE2b0JmLGdCQUFjLDJCQTdvQkM7QUE4b0JmLFdBQVMsMkJBOW9CTTtBQStvQmYsVUFBUSwwQkEvb0JPO0FBZ3BCZixnQkFBYywyQkFocEJDO0FBaXBCZixlQUFhLDBCQWpwQkU7QUFrcEJmLGVBQWEsMEJBbHBCRTtBQW1wQmYsVUFBUSwwQkFucEJPO0FBb3BCZixnQkFBYywyQkFwcEJDO0FBcXBCZixlQUFhLDBCQXJwQkU7QUFzcEJmLGNBQVkseUJBdHBCRztBQXVwQmYsZUFBYSwwQkF2cEJFO0FBd3BCZixnQkFBYywyQkF4cEJDO0FBeXBCZixpQkFBZSw0QkF6cEJBO0FBMHBCZixnQkFBYywyQkExcEJDO0FBMnBCZixVQUFRLDBCQTNwQk87QUE0cEJmLGdCQUFjLDJCQTVwQkM7QUE2cEJmLGVBQWEsMEJBN3BCRTtBQThwQmYsV0FBUywyQkE5cEJNO0FBK3BCZixVQUFRLDBCQS9wQk87QUFncUJmLGdCQUFjLDJCQWhxQkM7QUFpcUJmLGVBQWEsMEJBanFCRTtBQWtxQmYsY0FBWSx5QkFscUJHO0FBbXFCZixlQUFhLDBCQW5xQkU7QUFvcUJmLGdCQUFjLDJCQXBxQkM7QUFxcUJmLFVBQVEsMEJBcnFCTztBQXNxQmYsZ0JBQWMsMkJBdHFCQztBQXVxQmYsZUFBYSwwQkF2cUJFO0FBd3FCZixlQUFhLDBCQXhxQkU7QUF5cUJmLGdCQUFjLDJCQXpxQkM7QUEwcUJmLFdBQVMsMkJBMXFCTTtBQTJxQmYsVUFBUSwwQkEzcUJPO0FBNHFCZixnQkFBYywyQkE1cUJDO0FBNnFCZixlQUFhLDBCQTdxQkU7QUE4cUJmLFVBQVEsMEJBOXFCTztBQStxQmYsZ0JBQWMsMkJBL3FCQztBQWdyQmYsZUFBYSwwQkFockJFO0FBaXJCZixjQUFZLHlCQWpyQkc7QUFrckJmLGVBQWEsMEJBbHJCRTtBQW1yQmYsZ0JBQWMsMkJBbnJCQztBQW9yQmYsVUFBUSwwQkFwckJPO0FBcXJCZixnQkFBYywyQkFyckJDO0FBc3JCZixVQUFRLDBCQXRyQk87QUF1ckJmLGdCQUFjLDJCQXZyQkM7QUF3ckJmLGVBQWEsMEJBeHJCRTtBQXlyQmYsZUFBYSwwQkF6ckJFO0FBMHJCZixVQUFRLDBCQTFyQk87QUEyckJmLGdCQUFjLDJCQTNyQkM7QUE0ckJmLGVBQWEsMEJBNXJCRTtBQTZyQmYsVUFBUSwwQkE3ckJPO0FBOHJCZixnQkFBYywyQkE5ckJDO0FBK3JCZixVQUFRLDBCQS9yQk87QUFnc0JmLGdCQUFjLDJCQWhzQkM7QUFpc0JmLFdBQVMsMkJBanNCTTtBQWtzQmYsaUJBQWUsNEJBbHNCQTtBQW1zQmYsVUFBUSwwQkFuc0JPO0FBb3NCZixnQkFBYywyQkFwc0JDO0FBcXNCZixlQUFhLDBCQXJzQkU7QUFzc0JmLGNBQVkseUJBdHNCRztBQXVzQmYsZUFBYSwwQkF2c0JFO0FBd3NCZixnQkFBYywyQkF4c0JDO0FBeXNCZixVQUFRLDBCQXpzQk87QUEwc0JmLGdCQUFjLDJCQTFzQkM7QUEyc0JmLFVBQVEsMEJBM3NCTztBQTRzQmYsZ0JBQWMsMkJBNXNCQztBQTZzQmYsZUFBYSwwQkE3c0JFO0FBOHNCZixlQUFhLDBCQTlzQkU7QUErc0JmLFdBQVMsMkJBL3NCTTtBQWd0QmYsVUFBUSwwQkFodEJPO0FBaXRCZixnQkFBYywyQkFqdEJDO0FBa3RCZixVQUFRLDBCQWx0Qk87QUFtdEJmLFdBQVMsMkJBbnRCTTtBQW90QmYsV0FBUywyQkFwdEJNO0FBcXRCZixVQUFRLDBCQXJ0Qk87QUFzdEJmLGdCQUFjLDJCQXR0QkM7QUF1dEJmLGVBQWEsMEJBdnRCRTtBQXd0QmYsZUFBYSwwQkF4dEJFO0FBeXRCZixVQUFRLDBCQXp0Qk87QUEwdEJmLGdCQUFjLDJCQTF0QkM7QUEydEJmLGVBQWEsMEJBM3RCRTtBQTR0QmYsY0FBWSx5QkE1dEJHO0FBNnRCZixlQUFhLDBCQTd0QkU7QUE4dEJmLGdCQUFjLDJCQTl0QkM7QUErdEJmLGdCQUFjLDJCQS90QkM7QUFndUJmLFVBQVEsMEJBaHVCTztBQWl1QmYsZ0JBQWMsMkJBanVCQztBQWt1QmYsZUFBYSwwQkFsdUJFO0FBbXVCZixlQUFhLDBCQW51QkU7QUFvdUJmLFVBQVEsMEJBcHVCTztBQXF1QmYsZ0JBQWMsMkJBcnVCQztBQXN1QmYsZUFBYSwwQkF0dUJFO0FBdXVCZixlQUFhLDBCQXZ1QkU7QUF3dUJmLFVBQVEsMEJBeHVCTztBQXl1QmYsV0FBUywyQkF6dUJNO0FBMHVCZixpQkFBZSw0QkExdUJBO0FBMnVCZixpQkFBZSw0QkEzdUJBO0FBNHVCZixXQUFTLDJCQTV1Qk07QUE2dUJmLFVBQVEsMEJBN3VCTztBQTh1QmYsZ0JBQWMsMkJBOXVCQztBQSt1QmYsZUFBYSwwQkEvdUJFO0FBZ3ZCZixlQUFhLDBCQWh2QkU7QUFpdkJmLGdCQUFjLDJCQWp2QkM7QUFrdkJmLGdCQUFjLDJCQWx2QkM7QUFtdkJmLFdBQVMsMkJBbnZCTTtBQW92QmYsVUFBUSwwQkFwdkJPO0FBcXZCZixnQkFBYywyQkFydkJDO0FBc3ZCZixlQUFhLDBCQXR2QkU7QUF1dkJmLGVBQWEsMEJBdnZCRTtBQXd2QmYsVUFBUSwwQkF4dkJPO0FBeXZCZixnQkFBYywyQkF6dkJDO0FBMHZCZixlQUFhLDBCQTF2QkU7QUEydkJmLFdBQVMsMkJBM3ZCTTtBQTR2QmYsVUFBUSwwQkE1dkJPO0FBNnZCZixnQkFBYywyQkE3dkJDO0FBOHZCZixlQUFhLDBCQTl2QkU7QUErdkJmLFdBQVMsMkJBL3ZCTTtBQWd3QmYsV0FBUywyQkFod0JNO0FBaXdCZixVQUFRLDBCQWp3Qk87QUFrd0JmLGdCQUFjLDJCQWx3QkM7QUFtd0JmLGVBQWEsMEJBbndCRTtBQW93QmYsV0FBUywyQkFwd0JNO0FBcXdCZixVQUFRLDBCQXJ3Qk87QUFzd0JmLGdCQUFjLDJCQXR3QkM7QUF1d0JmLGdCQUFjLDJCQXZ3QkM7QUF3d0JmLFVBQVEsMEJBeHdCTztBQXl3QmYsZ0JBQWMsMkJBendCQztBQTB3QmYsZUFBYSwwQkExd0JFO0FBMndCZixVQUFRLDBCQTN3Qk87QUE0d0JmLGdCQUFjLDJCQTV3QkM7QUE2d0JmLGVBQWEsMEJBN3dCRTtBQTh3QmYsZUFBYSwwQkE5d0JFO0FBK3dCZixXQUFTLDJCQS93Qk07QUFneEJmLFVBQVEsMEJBaHhCTztBQWl4QmYsZ0JBQWMsMkJBanhCQztBQWt4QmYsZUFBYSwwQkFseEJFO0FBbXhCZixjQUFZLHlCQW54Qkc7QUFveEJmLGVBQWEsMEJBcHhCRTtBQXF4QmYsZ0JBQWMsMkJBcnhCQztBQXN4QmYsZ0JBQWMsMkJBdHhCQztBQXV4QmYsb0JBQWtCLG9DQXZ4Qkg7QUF3eEJmLGtCQUFnQixrQ0F4eEJEO0FBeXhCZix3QkFBc0IsbUNBenhCUDtBQTB4QmYsdUJBQXFCLGtDQTF4Qk47QUEyeEJmLHVCQUFxQixrQ0EzeEJOO0FBNHhCZix3QkFBc0IsbUNBNXhCUDtBQTZ4QmYsY0FBWSw4QkE3eEJHO0FBOHhCZixVQUFRLDBCQTl4Qk87QUEreEJmLGdCQUFjLDJCQS94QkM7QUFneUJmLGVBQWE7QUFoeUJFLENBQWpCO0FBa3lCQSxJQUFJLE9BQU8sTUFBUCxLQUFrQixXQUFsQixJQUFpQyxPQUFPLE9BQTVDLEVBQXFEO0FBQ25ELFNBQU8sT0FBUCxHQUFpQixRQUFqQjtBQUNEOzs7OztBQ3J5QkQ7QUFDQTtBQUNBO0FBQ0EsSUFBTSxRQUFRLFFBQVEsa0JBQVIsQ0FBZDtBQUNBLElBQU0sU0FBUSxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQU0sV0FBVyxRQUFRLG1CQUFSLENBQWpCO0FBQ0EsSUFBTSxPQUFPLFFBQVEsZUFBUixDQUFiO0FBQ0EsSUFBTSxVQUFVLFFBQVEsWUFBUixFQUFzQixPQUF0Qzs7QUFFQTtBQUNBLElBQUksVUFBVSxFQUFkOztBQUVBO0FBQ0EsSUFBTSxXQUFXLFNBQVgsUUFBVyxDQUFTLGVBQVQsRUFBMEIsY0FBMUIsRUFBMEMsRUFBMUMsRUFBOEM7QUFDN0QsTUFBSSxPQUFPLGNBQVAsS0FBMEIsVUFBOUIsRUFBMEM7QUFDeEMsU0FBSyxjQUFMO0FBQ0EscUJBQWlCLElBQWpCO0FBQ0Q7QUFDRCxPQUFLLE1BQU0sWUFBVyxDQUFFLENBQXhCO0FBQ0EsbUJBQWlCLGtCQUFrQixJQUFuQztBQUNBLE1BQUksQ0FBQyxLQUFMLEVBQVk7QUFDVjtBQUNBLFdBQU8sR0FBRyxJQUFILENBQVA7QUFDRDtBQUNELFNBQU8sTUFBTSxlQUFOLEVBQXVCLGNBQXZCLEVBQXVDLEVBQXZDLENBQVA7QUFDRCxDQVpEOztBQWNBO0FBQ0EsSUFBTSxZQUFZLFNBQVosU0FBWSxDQUFTLEdBQVQsRUFBYyxRQUFkLEVBQXdCO0FBQ3hDLGFBQVcsYUFBYSxTQUFiLEdBQXlCLE9BQXpCLEdBQW1DLFFBQTlDO0FBQ0EsTUFBSSxPQUFPLE9BQU0sR0FBTixFQUFXLFFBQVgsS0FBd0IsRUFBbkM7QUFDQSxPQUFLLFFBQUwsR0FBZ0IsS0FBSyxRQUFMLElBQWlCLEVBQWpDO0FBQ0EsTUFBSSxNQUFNLEtBQUssUUFBTCxDQUFjLEdBQWQsQ0FBa0IsYUFBSztBQUMvQixXQUFPLEVBQUUsU0FBRixDQUFZLEdBQVosQ0FBZ0I7QUFBQSxhQUFLLEVBQUUsSUFBUDtBQUFBLEtBQWhCLEVBQTZCLElBQTdCLENBQWtDLEdBQWxDLENBQVA7QUFDRCxHQUZTLENBQVY7QUFHQSxTQUFPLElBQUksSUFBSixDQUFTLE1BQVQsQ0FBUDtBQUNELENBUkQ7O0FBVUEsSUFBTSxZQUFZLFNBQVosU0FBWSxDQUFTLEdBQVQsRUFBYztBQUM5QixVQUFRLE1BQVIsR0FBaUIsR0FBakI7QUFDRCxDQUZEOztBQUlBLE9BQU8sT0FBUCxHQUFpQjtBQUNmLFlBQVUsUUFESztBQUVmLGFBQVcsU0FGSTtBQUdmLFlBQVUsUUFISztBQUlmLFFBQU0sSUFKUztBQUtmLFdBQVMsT0FMTTtBQU1mLFVBQVEsU0FOTztBQU9mLFNBQU8sZUFBQyxHQUFELEVBQU0sR0FBTixFQUFjO0FBQ25CLFVBQU0sT0FBTyxFQUFiO0FBQ0EsVUFBTSxPQUFPLE1BQVAsQ0FBYyxHQUFkLEVBQW1CLE9BQW5CLENBQU4sQ0FGbUIsQ0FFZ0I7QUFDbkMsV0FBTyxPQUFNLEdBQU4sRUFBVyxHQUFYLENBQVA7QUFDRDtBQVhjLENBQWpCOzs7OztBQzFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVMsUUFBVCxDQUFrQixHQUFsQixFQUF1QjtBQUNyQixNQUFJLGFBQWEsSUFBSSxHQUFKLEVBQWpCO0FBQ0EsTUFBSSxVQUFVLE9BQU8sSUFBSSxDQUFKLEtBQVUsQ0FBakIsQ0FBZDtBQUNBLE1BQUksVUFBVSxPQUFPLElBQUksQ0FBSixLQUFVLENBQWpCLENBQWQ7QUFDQSxNQUFJLFVBQVUsT0FBTyxJQUFJLENBQUosS0FBVSxDQUFqQixDQUFkO0FBQ0EsTUFBSSxPQUFPLFVBQVAsS0FBc0IsUUFBdEIsSUFBa0MsTUFBTSxPQUFOLENBQXRDLEVBQXNEO0FBQ3BELFdBQU8sSUFBUDtBQUNEO0FBQ0QsTUFBSSxPQUFPLENBQVg7QUFDQSxNQUFJLFFBQVEsSUFBUixDQUFhLFVBQWIsQ0FBSixFQUE4QjtBQUM1QixXQUFPLENBQUMsQ0FBUjtBQUNEO0FBQ0QsTUFBSSxTQUFTLFFBQVEsVUFBVSxVQUFVLEVBQXBCLEdBQXlCLFVBQVUsSUFBM0MsQ0FBYjtBQUNBLFNBQU8sTUFBUDtBQUNEO0FBQ0QsT0FBTyxPQUFQLEdBQWlCLFFBQWpCO0FBQ0E7QUFDQTs7O0FDdkJBO0FBQ0E7O0FBQ0EsSUFBTSxVQUFVLFFBQVEsWUFBUixDQUFoQjtBQUNBLElBQU0sV0FBVyxRQUFRLGtCQUFSLENBQWpCO0FBQ0EsSUFBTSxZQUFZLFFBQVEseUJBQVIsQ0FBbEI7O0FBRUEsSUFBTSxRQUFRLFNBQVIsS0FBUSxDQUFTLGVBQVQsRUFBMEIsY0FBMUIsRUFBMEMsRUFBMUMsRUFBOEM7QUFDMUQsbUJBQWlCLGtCQUFrQixJQUFuQztBQUNBLE1BQUksa0JBQWtCLFFBQXRCO0FBQ0EsTUFBSSxnQkFBZ0IsS0FBaEIsQ0FBc0IsVUFBdEIsS0FBcUMsZ0JBQWdCLE1BQWhCLEdBQXlCLENBQWxFLEVBQXFFO0FBQ25FLHNCQUFrQixPQUFsQjtBQUNEO0FBQ0QsTUFBSSxZQUFKO0FBQ0EsTUFBSSxTQUFTLGNBQVQsQ0FBSixFQUE4QjtBQUM1QixVQUFNLFNBQVMsY0FBVCxJQUEyQixZQUFqQztBQUNELEdBRkQsTUFFTztBQUNMLFVBQU0sYUFBYSxjQUFiLEdBQThCLDBCQUFwQztBQUNEO0FBQ0Q7QUFDQSxTQUFPLDRFQUFQO0FBQ0EsU0FBTyxNQUFNLGVBQU4sR0FBd0IsR0FBeEIsR0FBOEIsbUJBQW1CLGVBQW5CLENBQXJDOztBQUVBLFVBQVEsR0FBUixDQUFZLEdBQVosRUFBaUIsR0FBakIsQ0FBcUIsVUFBUyxHQUFULEVBQWMsR0FBZCxFQUFtQjtBQUN0QyxRQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUosQ0FBUyxLQUFyQixFQUE0QjtBQUMxQixjQUFRLElBQVIsQ0FBYSxHQUFiO0FBQ0EsU0FBRyxJQUFIO0FBQ0E7QUFDRDtBQUNELFFBQUksUUFBUyxPQUFPLElBQUksSUFBWCxJQUFtQixJQUFJLElBQUosQ0FBUyxLQUE3QixHQUFzQyxJQUFJLElBQUosQ0FBUyxLQUFULENBQWUsS0FBckQsR0FBNkQsRUFBekU7QUFDQSxRQUFJLEtBQUssT0FBTyxJQUFQLENBQVksS0FBWixFQUFtQixDQUFuQixDQUFUO0FBQ0EsUUFBSSxFQUFKLEVBQVE7QUFDTixVQUFJLE9BQU8sTUFBTSxFQUFOLENBQVg7QUFDQSxVQUFJLFFBQVEsS0FBSyxTQUFiLElBQTBCLEtBQUssU0FBTCxDQUFlLENBQWYsQ0FBOUIsRUFBaUQ7QUFDL0MsWUFBSSxPQUFPLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsR0FBbEIsQ0FBWDtBQUNBLFlBQUksVUFBVSxXQUFWLENBQXNCLElBQXRCLENBQUosRUFBaUM7QUFDL0IsY0FBSSxTQUFTLFVBQVUsY0FBVixDQUF5QixJQUF6QixDQUFiO0FBQ0EsZ0JBQU0sT0FBTyxRQUFiLEVBQXVCLGNBQXZCLEVBQXVDLEVBQXZDLEVBRitCLENBRWE7QUFDNUM7QUFDRDtBQUNELFdBQUcsSUFBSCxFQUFRLGVBQVIsRUFBd0IsY0FBeEI7QUFDRCxPQVJELE1BUU87QUFDTCxXQUFHLElBQUg7QUFDRDtBQUNGO0FBQ0YsR0F0QkQ7QUF1QkQsQ0F2Q0Q7O0FBeUNBLE9BQU8sT0FBUCxHQUFpQixLQUFqQjs7QUFFQTtBQUNBO0FBQ0E7Ozs7O0FDbkRBLElBQUksVUFBVTtBQUNaLGNBQVksb0JBQVMsR0FBVCxFQUFjO0FBQ3hCLFFBQUksT0FBTyxPQUFPLEdBQVAsS0FBZSxRQUExQixFQUFvQztBQUNsQyxhQUFPLElBQUksTUFBSixDQUFXLENBQVgsRUFBYyxXQUFkLEtBQThCLElBQUksS0FBSixDQUFVLENBQVYsQ0FBckM7QUFDRDtBQUNELFdBQU8sRUFBUDtBQUNELEdBTlc7QUFPWixjQUFZLG9CQUFTLEtBQVQsRUFBZ0IsS0FBaEIsRUFBdUIsSUFBdkIsRUFBNkI7QUFDdkMsV0FBTyxLQUFLLE9BQUwsQ0FBYSxLQUFiLE1BQXdCLEtBQS9CO0FBQ0QsR0FUVztBQVVaLG1CQUFpQix5QkFBUyxHQUFULEVBQWM7QUFDN0IsUUFBSSxPQUFPLE9BQU8sR0FBUCxLQUFlLFFBQTFCLEVBQW9DO0FBQ2xDLFlBQU0sSUFBSSxPQUFKLENBQVksUUFBWixFQUFzQixFQUF0QixDQUFOO0FBQ0EsWUFBTSxJQUFJLE9BQUosQ0FBWSxRQUFaLEVBQXNCLEVBQXRCLENBQU47QUFDQSxZQUFNLElBQUksT0FBSixDQUFZLE1BQVosRUFBb0IsR0FBcEIsQ0FBTjtBQUNBLFlBQU0sSUFBSSxPQUFKLENBQVksTUFBWixFQUFvQixJQUFwQixDQUFOO0FBQ0EsYUFBTyxHQUFQO0FBQ0Q7QUFDRCxXQUFPLEVBQVA7QUFDRDtBQW5CVyxDQUFkO0FBcUJBLE9BQU8sT0FBUCxHQUFpQixPQUFqQjs7Ozs7QUNyQkE7QUFDQTtBQUNBO0FBQ0EsU0FBUyxjQUFULENBQXdCLE1BQXhCLEVBQWdDLE1BQWhDLEVBQXdDLElBQXhDLEVBQThDO0FBQzVDLE1BQUksTUFBTSxFQUFWO0FBQ0EsTUFBSSxPQUFPLEVBQVg7QUFDQSxNQUFJLFFBQVEsS0FBSyxLQUFMLENBQVcsRUFBWCxDQUFaO0FBQ0EsTUFBSSxPQUFPLENBQVg7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUNyQztBQUNBLFFBQUksTUFBTSxDQUFOLE1BQWEsTUFBakIsRUFBeUI7QUFDdkIsY0FBUSxDQUFSO0FBQ0Q7QUFDRDtBQUNBLFFBQUksTUFBTSxDQUFOLE1BQWEsTUFBakIsRUFBeUI7QUFDdkIsY0FBUSxDQUFSO0FBQ0EsVUFBSSxPQUFPLENBQVgsRUFBYztBQUNaLGVBQU8sQ0FBUDtBQUNEO0FBQ0Y7QUFDRCxRQUFJLFFBQVEsQ0FBWixFQUFlO0FBQ2IsV0FBSyxJQUFMLENBQVUsTUFBTSxDQUFOLENBQVY7QUFDRDtBQUNELFFBQUksU0FBUyxDQUFULElBQWMsS0FBSyxNQUFMLEdBQWMsQ0FBaEMsRUFBbUM7QUFDakM7QUFDQSxVQUFJLGFBQWEsS0FBSyxNQUFMLENBQVksVUFBUyxDQUFULEVBQVk7QUFDdkMsZUFBTyxNQUFNLE1BQWI7QUFDRCxPQUZnQixDQUFqQjtBQUdBLFVBQUksY0FBYyxLQUFLLE1BQUwsQ0FBWSxVQUFTLENBQVQsRUFBWTtBQUN4QyxlQUFPLE1BQU0sTUFBYjtBQUNELE9BRmlCLENBQWxCO0FBR0E7QUFDQSxVQUFJLFdBQVcsTUFBWCxHQUFvQixZQUFZLE1BQXBDLEVBQTRDO0FBQzFDLGFBQUssSUFBTCxDQUFVLE1BQVY7QUFDRDtBQUNEO0FBQ0EsVUFBSSxJQUFKLENBQVMsS0FBSyxJQUFMLENBQVUsRUFBVixDQUFUO0FBQ0EsYUFBTyxFQUFQO0FBQ0Q7QUFDRjtBQUNELFNBQU8sR0FBUDtBQUNEO0FBQ0QsT0FBTyxPQUFQLEdBQWlCLGNBQWpCOztBQUVBO0FBQ0E7Ozs7O0FDN0NBLElBQU0sUUFBUSxRQUFRLGFBQVIsQ0FBZDtBQUNBLElBQU0sYUFBYSxRQUFRLFlBQVIsRUFBc0IsVUFBekM7QUFDQTs7QUFFQSxJQUFNLFdBQVc7QUFDZixhQUFXLElBREk7QUFFZixVQUFRLElBRk87QUFHZixTQUFPLElBSFE7QUFJZixTQUFPLElBSlE7QUFLZixVQUFRLElBTE87QUFNZixTQUFPLElBTlE7QUFPZixjQUFZLElBUEc7QUFRZixhQUFXO0FBUkksQ0FBakI7O0FBV0EsSUFBTSxZQUFZLFNBQVosU0FBWSxDQUFDLEtBQUQsRUFBVztBQUMzQixNQUFJLE1BQU0sTUFBTSxJQUFOLENBQVcsT0FBWCxDQUFtQixpQkFBbkIsRUFBc0MsRUFBdEMsQ0FBVjtBQUNBLFFBQU0sSUFBSSxPQUFKLENBQVksMkJBQVosRUFBeUMsRUFBekMsQ0FBTjtBQUNBLFNBQU8saUJBQWlCLE1BQU0sS0FBdkIsR0FBK0IsU0FBL0IsR0FBMkMsR0FBM0MsR0FBaUQsS0FBeEQ7QUFDRCxDQUpEOztBQU1BLElBQU0sWUFBWSxTQUFaLFNBQVksQ0FBQyxPQUFELEVBQVUsT0FBVixFQUFzQjtBQUN0QyxNQUFJLE9BQU8sRUFBWDtBQUNBO0FBQ0EsTUFBSSxRQUFRLEtBQVIsS0FBa0IsSUFBbEIsSUFBMEIsUUFBUSxLQUF0QyxFQUE2QztBQUMzQyxRQUFJLE1BQU0sSUFBSSxRQUFRLEtBQXRCO0FBQ0EsWUFBUSxTQUFTLEdBQVQsR0FBZSxHQUFmLEdBQXFCLFFBQVEsS0FBN0IsR0FBcUMsS0FBckMsR0FBNkMsR0FBN0MsR0FBbUQsR0FBM0Q7QUFDQSxZQUFRLElBQVI7QUFDRDtBQUNEO0FBQ0EsTUFBSSxRQUFRLE1BQVIsSUFBa0IsUUFBUSxNQUFSLEtBQW1CLElBQXpDLEVBQStDO0FBQzdDLFlBQVEsUUFBUSxNQUFSLENBQWUsR0FBZixDQUFtQixVQUFDLEtBQUQ7QUFBQSxhQUFXLFVBQVUsS0FBVixDQUFYO0FBQUEsS0FBbkIsRUFBZ0QsSUFBaEQsQ0FBcUQsSUFBckQsQ0FBUjtBQUNBLFlBQVEsSUFBUjtBQUNEO0FBQ0Q7QUFDQSxNQUFJLFFBQVEsTUFBUixJQUFrQixRQUFRLE1BQVIsS0FBbUIsSUFBekMsRUFBK0MsQ0FDOUM7QUFDRDtBQUNBLE1BQUksUUFBUSxLQUFSLElBQWlCLFFBQVEsS0FBUixLQUFrQixJQUF2QyxFQUE2QyxDQUM1QztBQUNEO0FBQ0EsTUFBSSxRQUFRLFNBQVIsSUFBcUIsUUFBUSxTQUFSLEtBQXNCLElBQS9DLEVBQXFEO0FBQ25ELFlBQVEsVUFBVSxRQUFRLFNBQVIsQ0FBa0IsR0FBbEIsQ0FBc0IsVUFBQyxDQUFEO0FBQUEsYUFBTyxXQUFXLENBQVgsRUFBYyxPQUFkLENBQVA7QUFBQSxLQUF0QixFQUFxRCxJQUFyRCxDQUEwRCxHQUExRCxDQUFWLEdBQTJFLE1BQW5GO0FBQ0EsWUFBUSxJQUFSO0FBQ0Q7QUFDRCxTQUFPLDRCQUE0QixJQUE1QixHQUFtQyxVQUExQztBQUNELENBekJEO0FBMEJBO0FBQ0EsSUFBTSxTQUFTLFNBQVQsTUFBUyxDQUFTLEdBQVQsRUFBYyxPQUFkLEVBQXVCO0FBQ3BDLFlBQVUsT0FBTyxNQUFQLENBQWMsUUFBZCxFQUF3QixPQUF4QixDQUFWO0FBQ0EsTUFBSSxPQUFPLE1BQU0sR0FBTixFQUFXLE9BQVgsQ0FBWDtBQUNBLE1BQUksT0FBTyxFQUFYO0FBQ0E7QUFDQSxNQUFJLFFBQVEsS0FBUixLQUFrQixJQUFsQixJQUEwQixLQUFLLEtBQW5DLEVBQTBDO0FBQ3hDLFlBQVEsU0FBUyxLQUFLLEtBQWQsR0FBc0IsU0FBOUI7QUFDRDtBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFRLEtBQUssUUFBTCxDQUFjLEdBQWQsQ0FBa0I7QUFBQSxXQUFLLFVBQVUsQ0FBVixFQUFhLE9BQWIsQ0FBTDtBQUFBLEdBQWxCLEVBQThDLElBQTlDLENBQW1ELElBQW5ELENBQVI7QUFDQSxTQUFPLElBQVA7QUFDRCxDQWZEO0FBZ0JBLE9BQU8sT0FBUCxHQUFpQixNQUFqQjs7Ozs7QUMvREE7QUFDQSxJQUFNLGFBQWEsU0FBYixVQUFhLENBQVMsUUFBVCxFQUFtQixPQUFuQixFQUE0QjtBQUM3QyxNQUFJLE9BQU8sU0FBUyxJQUFwQjtBQUNBO0FBQ0EsTUFBSSxTQUFTLEtBQVQsSUFBa0IsUUFBUSxLQUFSLEtBQWtCLElBQXhDLEVBQThDO0FBQzVDLGFBQVMsS0FBVCxDQUFlLE9BQWYsQ0FBdUIsVUFBQyxJQUFELEVBQVU7QUFDL0IsVUFBSSxPQUFPLEVBQVg7QUFDQSxVQUFJLGFBQWEsTUFBakI7QUFDQSxVQUFJLEtBQUssSUFBVCxFQUFlO0FBQ2I7QUFDQSxlQUFPLEtBQUssSUFBWjtBQUNBLGdCQUFRLFdBQVI7QUFDRCxPQUpELE1BSU87QUFDTDtBQUNBLGVBQU8sS0FBSyxJQUFMLElBQWEsS0FBSyxJQUF6QjtBQUNBLGVBQU8sT0FBTyxLQUFLLE9BQUwsQ0FBYSxJQUFiLEVBQW1CLEdBQW5CLENBQWQ7QUFDRDtBQUNELGFBQU8sS0FBSyxPQUFMLENBQWEsS0FBSyxJQUFsQixFQUF3QixlQUFlLFVBQWYsR0FBNEIsVUFBNUIsR0FBeUMsSUFBekMsR0FBZ0QsSUFBaEQsR0FBdUQsS0FBSyxJQUE1RCxHQUFtRSxNQUEzRixDQUFQO0FBQ0QsS0FiRDtBQWNEO0FBQ0QsU0FBTyxJQUFQO0FBQ0QsQ0FwQkQ7QUFxQkEsT0FBTyxPQUFQLEdBQWlCLFVBQWpCOzs7OztBQ3ZCQSxJQUFNLFFBQVEsUUFBUSxhQUFSLENBQWQ7QUFDQSxJQUFNLFVBQVUsUUFBUSxTQUFSLENBQWhCO0FBQ0EsSUFBTSxZQUFZLFFBQVEsV0FBUixDQUFsQjtBQUNBLElBQU0sYUFBYSxRQUFRLFlBQVIsQ0FBbkI7O0FBRUEsSUFBTSxXQUFXO0FBQ2YsYUFBVyxJQURJO0FBRWYsVUFBUSxJQUZPO0FBR2YsU0FBTyxJQUhRO0FBSWYsU0FBTyxJQUpRO0FBS2YsVUFBUSxJQUxPO0FBTWYsU0FBTyxJQU5RO0FBT2YsY0FBWSxJQVBHO0FBUWYsYUFBVztBQVJJLENBQWpCOztBQVdBLElBQU0sU0FBUyxTQUFULE1BQVMsQ0FBQyxJQUFELEVBQU8sT0FBUCxFQUFtQjtBQUNoQyxTQUFPLEtBQUssR0FBTCxDQUFTLFVBQUMsQ0FBRCxFQUFPO0FBQ3JCLFFBQUksTUFBTSxXQUFXLENBQVgsRUFBYyxPQUFkLENBQVY7QUFDQSxXQUFPLFFBQVEsR0FBZjtBQUNELEdBSE0sRUFHSixJQUhJLENBR0MsSUFIRCxDQUFQO0FBSUQsQ0FMRDs7QUFPQTtBQUNBLElBQU0sVUFBVSxTQUFWLE9BQVUsQ0FBQyxLQUFELEVBQVc7QUFDekIsTUFBSSxNQUFNLE1BQU0sSUFBTixDQUFXLE9BQVgsQ0FBbUIsaUJBQW5CLEVBQXNDLEVBQXRDLENBQVY7QUFDQSxRQUFNLElBQUksT0FBSixDQUFZLDJCQUFaLEVBQXlDLEVBQXpDLENBQU47QUFDQSxTQUFPLE9BQU8sR0FBUCxHQUFhLElBQWIsR0FBb0IsTUFBTSxLQUExQixHQUFrQyxHQUF6QztBQUNELENBSkQ7O0FBTUEsSUFBTSxZQUFZLFNBQVosU0FBWSxDQUFDLE9BQUQsRUFBVSxPQUFWLEVBQXNCO0FBQ3RDLE1BQUksS0FBSyxFQUFUO0FBQ0E7QUFDQSxNQUFJLFFBQVEsS0FBUixLQUFrQixJQUFsQixJQUEwQixRQUFRLEtBQXRDLEVBQTZDO0FBQzNDLFFBQUksU0FBUyxJQUFiO0FBQ0EsU0FBSSxJQUFJLElBQUksQ0FBWixFQUFlLElBQUksUUFBUSxLQUEzQixFQUFrQyxLQUFLLENBQXZDLEVBQTBDO0FBQ3hDLGdCQUFVLEdBQVY7QUFDRDtBQUNELFVBQU0sU0FBUyxHQUFULEdBQWUsUUFBUSxLQUF2QixHQUErQixJQUFyQztBQUNEO0FBQ0Q7QUFDQSxNQUFJLFFBQVEsTUFBUixJQUFrQixRQUFRLE1BQVIsS0FBbUIsSUFBekMsRUFBK0M7QUFDN0MsVUFBTSxRQUFRLE1BQVIsQ0FBZSxHQUFmLENBQW1CLFVBQUMsR0FBRDtBQUFBLGFBQVMsUUFBUSxHQUFSLENBQVQ7QUFBQSxLQUFuQixFQUEwQyxJQUExQyxDQUErQyxJQUEvQyxDQUFOO0FBQ0EsVUFBTSxJQUFOO0FBQ0Q7QUFDRDtBQUNBLE1BQUksUUFBUSxNQUFSLElBQWtCLFFBQVEsTUFBUixLQUFtQixJQUF6QyxFQUErQztBQUM3QyxVQUFNLElBQU47QUFDQSxVQUFNLFFBQVEsTUFBUixDQUFlLEdBQWYsQ0FBbUIsVUFBQyxLQUFEO0FBQUEsYUFBVyxRQUFRLEtBQVIsRUFBZSxPQUFmLENBQVg7QUFBQSxLQUFuQixFQUF1RCxJQUF2RCxDQUE0RCxJQUE1RCxDQUFOO0FBQ0EsVUFBTSxJQUFOO0FBQ0Q7QUFDRDtBQUNBLE1BQUksUUFBUSxLQUFSLElBQWlCLFFBQVEsS0FBUixLQUFrQixJQUF2QyxFQUE2QztBQUMzQyxVQUFNLFFBQVEsS0FBUixDQUFjLEdBQWQsQ0FBa0IsVUFBQyxJQUFEO0FBQUEsYUFBVSxPQUFPLElBQVAsRUFBYSxPQUFiLENBQVY7QUFBQSxLQUFsQixFQUFtRCxJQUFuRCxDQUF3RCxJQUF4RCxDQUFOO0FBQ0EsVUFBTSxJQUFOO0FBQ0Q7QUFDRDtBQUNBLE1BQUksUUFBUSxTQUFSLElBQXFCLFFBQVEsU0FBUixLQUFzQixJQUEvQyxFQUFxRDtBQUNuRCxVQUFNLFFBQVEsU0FBUixDQUFrQixHQUFsQixDQUFzQixVQUFDLENBQUQ7QUFBQSxhQUFPLFdBQVcsQ0FBWCxFQUFjLE9BQWQsQ0FBUDtBQUFBLEtBQXRCLEVBQXFELElBQXJELENBQTBELEdBQTFELENBQU47QUFDRDtBQUNELFNBQU8sRUFBUDtBQUNELENBL0JEOztBQWlDQSxJQUFNLGFBQWEsU0FBYixVQUFhLENBQVMsR0FBVCxFQUFjLE9BQWQsRUFBdUI7QUFDeEMsWUFBVSxPQUFPLE1BQVAsQ0FBYyxRQUFkLEVBQXdCLE9BQXhCLENBQVY7QUFDQSxNQUFJLE9BQU8sTUFBTSxHQUFOLEVBQVcsT0FBWCxDQUFYO0FBQ0EsTUFBSSxLQUFLLEVBQVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSSxRQUFRLFNBQVIsS0FBc0IsSUFBdEIsSUFBOEIsS0FBSyxTQUF2QyxFQUFrRDtBQUNoRCxVQUFNLEtBQUssU0FBTCxDQUFlLEdBQWYsQ0FBbUI7QUFBQSxhQUFLLFVBQVUsQ0FBVixFQUFhLE9BQWIsQ0FBTDtBQUFBLEtBQW5CLEVBQStDLElBQS9DLENBQW9ELElBQXBELENBQU47QUFDRDtBQUNEO0FBQ0EsUUFBTSxLQUFLLFFBQUwsQ0FBYyxHQUFkLENBQWtCO0FBQUEsV0FBSyxVQUFVLENBQVYsRUFBYSxPQUFiLENBQUw7QUFBQSxHQUFsQixFQUE4QyxJQUE5QyxDQUFtRCxNQUFuRCxDQUFOO0FBQ0EsU0FBTyxFQUFQO0FBQ0QsQ0FmRDtBQWdCQSxPQUFPLE9BQVAsR0FBaUIsVUFBakI7Ozs7O0FDL0VBLElBQU0sYUFBYSxRQUFRLFlBQVIsQ0FBbkI7QUFDQSxJQUFNLE1BQU0sUUFBUSxPQUFSLENBQVo7O0FBRUEsSUFBTSxTQUFTO0FBQ2IsU0FBTyxJQURNO0FBRWIsV0FBUztBQUZJLENBQWY7O0FBS0E7QUFDQSxJQUFNLFlBQVksU0FBWixTQUFZLENBQVMsR0FBVCxFQUFjLE9BQWQsRUFBdUI7QUFDdkMsTUFBSSxLQUFLLE1BQU0sSUFBSSxFQUFKLENBQU4sR0FBZ0IsR0FBaEIsR0FBc0IsSUFBSSxFQUFKLENBQXRCLEdBQWdDLEtBQXpDO0FBQ0EsUUFBTSxNQUFNLElBQUksS0FBSixDQUFOLEdBQW1CLEdBQW5CLEdBQXlCLElBQUksS0FBSixDQUF6QixHQUFzQyxLQUE1QztBQUNBLFNBQU8sSUFBUCxDQUFZLElBQUksSUFBaEIsRUFBc0IsT0FBdEIsQ0FBOEIsVUFBQyxDQUFELEVBQU87QUFDbkMsUUFBSSxPQUFPLENBQVAsTUFBYyxJQUFsQixFQUF3QjtBQUN0QjtBQUNEO0FBQ0QsUUFBSSxNQUFNLE9BQU8sQ0FBUCxHQUFXLElBQXJCO0FBQ0EsUUFBSSxNQUFNLFdBQVcsSUFBSSxJQUFKLENBQVMsQ0FBVCxDQUFYLEVBQXdCLE9BQXhCLENBQVY7QUFDQSxVQUFNLE1BQU0sSUFBSSxHQUFKLENBQU4sR0FBaUIsR0FBakIsR0FBdUIsSUFBSSxHQUFKLENBQXZCLEdBQWtDLE1BQXhDO0FBRUQsR0FSRDtBQVNBLFNBQU8sRUFBUDtBQUNELENBYkQ7QUFjQSxPQUFPLE9BQVAsR0FBaUIsU0FBakI7Ozs7O0FDdkJBLElBQU0sWUFBWSxFQUFsQjtBQUNBO0FBQ0EsSUFBTSxNQUFNLFNBQU4sR0FBTSxDQUFDLEdBQUQsRUFBUztBQUNuQixRQUFNLE9BQU8sRUFBYjtBQUNBLE1BQUksT0FBTyxZQUFZLElBQUksTUFBM0I7QUFDQSxTQUFPLFNBQVMsT0FBTyxDQUFoQixFQUFtQixFQUFuQixDQUFQO0FBQ0EsT0FBSSxJQUFJLElBQUksQ0FBWixFQUFlLElBQUksSUFBbkIsRUFBeUIsS0FBSyxDQUE5QixFQUFpQztBQUMvQixVQUFNLE1BQU0sR0FBTixHQUFZLEdBQWxCO0FBQ0Q7QUFDRCxTQUFPLEdBQVA7QUFDRCxDQVJEO0FBU0EsT0FBTyxPQUFQLEdBQWlCLEdBQWpCOzs7OztBQ1hBO0FBQ0EsU0FBUyxZQUFULENBQXNCLEdBQXRCLEVBQTJCO0FBQ3pCLFNBQU8sSUFBSSxPQUFKLENBQVkscUNBQVosRUFBbUQsTUFBbkQsQ0FBUDtBQUNEOztBQUVEO0FBQ0EsSUFBTSxjQUFjLFNBQWQsV0FBYyxDQUFTLEVBQVQsRUFBYSxJQUFiLEVBQW1CLE1BQW5CLEVBQTJCO0FBQzdDLFNBQU8sYUFBYSxJQUFiLENBQVA7QUFDQTtBQUNBLE1BQUksTUFBTSxJQUFJLE1BQUosQ0FBVyxRQUFRLElBQVIsR0FBZSxLQUExQixDQUFWO0FBQ0EsTUFBSSxJQUFJLElBQUosQ0FBUyxFQUFULE1BQWlCLElBQXJCLEVBQTJCO0FBQ3pCLFNBQUssR0FBRyxPQUFILENBQVcsR0FBWCxFQUFnQixNQUFoQixDQUFMO0FBQ0QsR0FGRCxNQUVPO0FBQ0w7QUFDQTtBQUNBLFNBQUssR0FBRyxPQUFILENBQVcsSUFBWCxFQUFpQixNQUFqQixDQUFMO0FBQ0Q7QUFDRCxTQUFPLEVBQVA7QUFDRCxDQVpEOztBQWNBO0FBQ0EsSUFBTSxTQUFTLFNBQVQsTUFBUyxDQUFTLEVBQVQsRUFBYSxJQUFiLEVBQW1CO0FBQ2hDLE1BQUksT0FBTyxFQUFYO0FBQ0E7QUFDQSxNQUFJLEtBQUssSUFBVCxFQUFlO0FBQ2IsV0FBTyxLQUFLLElBQVo7QUFDRCxHQUZELE1BRU87QUFDTDtBQUNBLFdBQU8sS0FBSyxJQUFMLElBQWEsS0FBSyxJQUF6QjtBQUNBLFdBQU8sT0FBTyxLQUFLLE9BQUwsQ0FBYSxJQUFiLEVBQW1CLEdBQW5CLENBQWQ7QUFDRDtBQUNELE1BQUksU0FBUyxNQUFNLEtBQUssSUFBWCxHQUFrQixJQUFsQixHQUF5QixJQUF6QixHQUFnQyxHQUE3QztBQUNBLE9BQUssWUFBWSxFQUFaLEVBQWdCLEtBQUssSUFBckIsRUFBMkIsTUFBM0IsQ0FBTDtBQUNBLFNBQU8sRUFBUDtBQUNELENBYkQ7O0FBZUE7QUFDQSxJQUFNLGFBQWEsU0FBYixVQUFhLENBQUMsUUFBRCxFQUFXLE9BQVgsRUFBdUI7QUFDeEMsTUFBSSxLQUFLLFNBQVMsSUFBbEI7QUFDQTtBQUNBLE1BQUksU0FBUyxLQUFULElBQWtCLFFBQVEsS0FBUixLQUFrQixJQUF4QyxFQUE4QztBQUM1QyxhQUFTLEtBQVQsQ0FBZSxPQUFmLENBQXVCLFVBQUMsSUFBRCxFQUFVO0FBQy9CLFdBQUssT0FBTyxFQUFQLEVBQVcsSUFBWCxDQUFMO0FBQ0QsS0FGRDtBQUdEO0FBQ0Q7QUFDQSxNQUFJLFNBQVMsR0FBVCxDQUFhLElBQWpCLEVBQXVCO0FBQ3JCLGFBQVMsR0FBVCxDQUFhLElBQWIsQ0FBa0IsT0FBbEIsQ0FBMEIsVUFBQyxDQUFELEVBQU87QUFDL0IsV0FBSyxZQUFZLEVBQVosRUFBZ0IsQ0FBaEIsRUFBbUIsT0FBTyxDQUFQLEdBQVcsSUFBOUIsQ0FBTDtBQUNELEtBRkQ7QUFHRDtBQUNEO0FBQ0EsTUFBSSxTQUFTLEdBQVQsQ0FBYSxNQUFqQixFQUF5QjtBQUN2QixhQUFTLEdBQVQsQ0FBYSxNQUFiLENBQW9CLE9BQXBCLENBQTRCLFVBQUMsQ0FBRCxFQUFPO0FBQ2pDLFdBQUssWUFBWSxFQUFaLEVBQWdCLENBQWhCLEVBQW1CLE1BQU0sQ0FBTixHQUFVLEdBQTdCLENBQUw7QUFDRCxLQUZEO0FBR0Q7QUFDRCxTQUFPLEVBQVA7QUFDRCxDQXJCRDtBQXNCQSxPQUFPLE9BQVAsR0FBaUIsVUFBakI7Ozs7O0FDM0RBLElBQU0sYUFBYSxRQUFRLFlBQVIsQ0FBbkI7QUFDQSxJQUFNLE1BQU0sUUFBUSxPQUFSLENBQVo7QUFDQTs7Ozs7Ozs7QUFRQSxJQUFNLFVBQVUsU0FBVixPQUFVLENBQUMsR0FBRCxFQUFTO0FBQ3ZCLFFBQU0sSUFBSSxHQUFKLENBQVEsR0FBUixDQUFOO0FBQ0EsU0FBTyxPQUFPLElBQUksSUFBSixDQUFTLEtBQVQsQ0FBUCxHQUF5QixJQUFoQztBQUNELENBSEQ7O0FBS0E7QUFDQSxJQUFNLFVBQVUsU0FBVixPQUFVLENBQUMsS0FBRCxFQUFRLE9BQVIsRUFBb0I7QUFDbEMsTUFBSSxLQUFLLEVBQVQ7QUFDQSxNQUFJLENBQUMsS0FBRCxJQUFVLE1BQU0sTUFBTixLQUFpQixDQUEvQixFQUFrQztBQUNoQyxXQUFPLEVBQVA7QUFDRDtBQUNELE1BQUksT0FBTyxPQUFPLElBQVAsQ0FBWSxNQUFNLENBQU4sQ0FBWixDQUFYO0FBQ0E7QUFDQTtBQUNBLE1BQUksU0FBUyxLQUFLLEdBQUwsQ0FBUyxVQUFDLENBQUQsRUFBSSxDQUFKLEVBQVU7QUFDOUIsUUFBSSxTQUFTLENBQVQsRUFBWSxFQUFaLE1BQW9CLENBQXhCLEVBQTJCO0FBQ3pCLGFBQU8sRUFBUDtBQUNEO0FBQ0QsV0FBTyxDQUFQO0FBQ0QsR0FMWSxDQUFiO0FBTUE7QUFDQSxRQUFNLFFBQVEsTUFBUixJQUFrQixJQUF4QjtBQUNBLFFBQU0sUUFBUSxDQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsS0FBZixDQUFSLElBQWlDLElBQXZDO0FBQ0E7QUFDQSxRQUFNLE1BQU0sR0FBTixDQUFVLFVBQUMsR0FBRCxFQUFTO0FBQ3ZCO0FBQ0EsUUFBSSxNQUFNLEtBQUssR0FBTCxDQUFTLFVBQUMsQ0FBRCxFQUFPO0FBQ3hCLFVBQUksQ0FBQyxJQUFJLENBQUosQ0FBTCxFQUFhO0FBQ1gsZUFBTyxFQUFQO0FBQ0Q7QUFDRCxhQUFPLFdBQVcsSUFBSSxDQUFKLENBQVgsRUFBbUIsT0FBbkIsS0FBK0IsRUFBdEM7QUFDRCxLQUxTLENBQVY7QUFNQTtBQUNBLFdBQU8sUUFBUSxHQUFSLENBQVA7QUFDRCxHQVZLLEVBVUgsSUFWRyxDQVVFLElBVkYsQ0FBTjtBQVdBLFNBQU8sS0FBSyxJQUFaO0FBQ0QsQ0E5QkQ7QUErQkEsT0FBTyxPQUFQLEdBQWlCLE9BQWpCOzs7OztBQy9DQSxJQUFNLE9BQU8sUUFBUSxjQUFSLENBQWI7QUFDQSxJQUFNLFVBQVUsSUFBSSxNQUFKLENBQVcsY0FBYyxLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBZCxHQUEwQyx5QkFBckQsRUFBZ0YsSUFBaEYsQ0FBaEI7QUFDQSxJQUFNLGlCQUFpQixJQUFJLE1BQUosQ0FBVyxlQUFlLEtBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixHQUFyQixDQUFmLEdBQTJDLElBQXRELEVBQTRELElBQTVELENBQXZCOztBQUVBLElBQU0sbUJBQW1CLFNBQW5CLGdCQUFtQixDQUFTLENBQVQsRUFBWSxJQUFaLEVBQWtCO0FBQ3pDLElBQUUsVUFBRixHQUFlLEVBQWY7QUFDQSxNQUFJLE1BQU0sS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFWLENBRnlDLENBRVY7QUFDL0IsTUFBSSxHQUFKLEVBQVM7QUFDUCxRQUFJLE9BQUosQ0FBWSxVQUFTLENBQVQsRUFBWTtBQUN0QixVQUFJLEVBQUUsT0FBRixDQUFVLGNBQVYsRUFBMEIsRUFBMUIsQ0FBSjtBQUNBLFVBQUksRUFBRSxPQUFGLENBQVUsaUJBQVYsRUFBNkIsRUFBN0IsQ0FBSixDQUZzQixDQUVnQjtBQUN0QyxVQUFJLEVBQUUsT0FBRixDQUFVLE1BQVYsRUFBa0IsRUFBbEIsQ0FBSixDQUhzQixDQUdLO0FBQzNCLFVBQUksS0FBSyxDQUFDLEVBQUUsS0FBRixDQUFRLFFBQVIsQ0FBVixFQUE2QjtBQUMzQixVQUFFLFVBQUYsQ0FBYSxJQUFiLENBQWtCLENBQWxCO0FBQ0Q7QUFDRixLQVBEO0FBUUQ7QUFDRCxTQUFPLEtBQUssT0FBTCxDQUFhLE9BQWIsRUFBc0IsRUFBdEIsQ0FBUDtBQUNBLFNBQU8sSUFBUDtBQUNELENBZkQ7QUFnQkEsT0FBTyxPQUFQLEdBQWlCLGdCQUFqQjs7Ozs7QUNwQkEsSUFBTSxZQUFZLFFBQVEsa0JBQVIsQ0FBbEI7QUFDQSxJQUFNLFdBQVcsUUFBUSxpQkFBUixDQUFqQjtBQUNBLElBQU0sYUFBYSxRQUFRLGNBQVIsQ0FBbkI7QUFDQSxJQUFNLGNBQWMsUUFBUSxlQUFSLENBQXBCO0FBQ0EsSUFBTSxRQUFRO0FBQ1osV0FBUyxRQUFRLFdBQVIsQ0FERztBQUVaLFdBQVMsUUFBUSxXQUFSLENBRkc7QUFHWixjQUFZLFFBQVEsY0FBUjtBQUhBLENBQWQ7O0FBTUE7QUFDQSxJQUFNLE9BQU8sU0FBUCxJQUFPLENBQVMsSUFBVCxFQUFlLE9BQWYsRUFBd0I7QUFDbkMsWUFBVSxXQUFXLEVBQXJCO0FBQ0EsU0FBTyxRQUFRLEVBQWY7QUFDQTtBQUNBLE1BQUksVUFBVSxXQUFWLENBQXNCLElBQXRCLENBQUosRUFBaUM7QUFDL0IsV0FBTyxVQUFVLGNBQVYsQ0FBeUIsSUFBekIsQ0FBUDtBQUNEO0FBQ0Q7QUFDQSxNQUFJLFNBQVMsV0FBVCxDQUFxQixJQUFyQixDQUFKLEVBQWdDO0FBQzlCLFdBQU8sU0FBUyxjQUFULENBQXdCLElBQXhCLENBQVA7QUFDRDtBQUNELE1BQUksSUFBSTtBQUNOLFVBQU0sTUFEQTtBQUVOLGNBQVUsRUFGSjtBQUdOLGVBQVcsRUFITDtBQUlOLGVBQVcsRUFKTDtBQUtOLGdCQUFZLEVBTE47QUFNTixZQUFRLEVBTkY7QUFPTixpQkFBYSxFQVBQO0FBUU4sZUFBVztBQVJMLEdBQVI7QUFVQSxNQUFJLFFBQVEsTUFBWixFQUFvQjtBQUNsQixNQUFFLE1BQUYsR0FBVyxFQUFYO0FBQ0Q7QUFDRCxNQUFJLFFBQVEsZUFBWixFQUE2QjtBQUMzQixNQUFFLGVBQUYsR0FBb0IsUUFBUSxlQUE1QjtBQUNEO0FBQ0QsTUFBSSxRQUFRLGNBQVosRUFBNEI7QUFDMUIsTUFBRSxjQUFGLEdBQW1CLFFBQVEsY0FBM0I7QUFDRDtBQUNEO0FBQ0EsU0FBTyxXQUFXLENBQVgsRUFBYyxJQUFkLEVBQW9CLE9BQXBCLENBQVA7QUFDQTtBQUNBLFNBQU8sTUFBTSxPQUFOLENBQWMsQ0FBZCxFQUFpQixJQUFqQixFQUF1QixPQUF2QixDQUFQO0FBQ0E7QUFDQSxNQUFJLFFBQVEsVUFBUixLQUF1QixLQUEzQixFQUFrQztBQUNoQyxXQUFPLE1BQU0sVUFBTixDQUFpQixDQUFqQixFQUFvQixJQUFwQixDQUFQO0FBQ0Q7QUFDRDtBQUNBLElBQUUsUUFBRixHQUFhLE1BQU0sT0FBTixDQUFjLENBQWQsRUFBaUIsSUFBakIsRUFBdUIsT0FBdkIsS0FBbUMsRUFBaEQ7O0FBRUEsTUFBSSxZQUFZLENBQVosQ0FBSjs7QUFFQSxTQUFPLENBQVA7QUFDRCxDQTVDRDs7QUE4Q0EsT0FBTyxPQUFQLEdBQWlCLElBQWpCOzs7OztBQ3pEQTtBQUNBLElBQU0sZ0JBQWdCLFNBQWhCLGFBQWdCLENBQVMsR0FBVCxFQUFjLElBQWQsRUFBb0IsQ0FBcEIsRUFBdUIsT0FBdkIsRUFBZ0M7QUFDcEQ7QUFDQSxTQUFPLEtBQUssT0FBTCxDQUFhLEdBQWIsRUFBa0IsRUFBbEIsQ0FBUDtBQUNBLE1BQUksUUFBUSxTQUFSLEtBQXNCLEtBQTFCLEVBQWlDO0FBQy9CLFdBQU8sSUFBUDtBQUNEO0FBQ0Q7QUFDQTtBQUNBLFFBQU0sSUFBSSxPQUFKLENBQVksVUFBWixFQUF3QixFQUF4QixDQUFOO0FBQ0EsUUFBTSxJQUFJLE9BQUosQ0FBWSxhQUFaLEVBQTJCLEVBQTNCLENBQU47QUFDQTtBQUNBLE1BQUksTUFBTSxFQUFWO0FBQ0EsTUFBSSxRQUFRLElBQUksS0FBSixDQUFVLEtBQVYsQ0FBWjtBQUNBO0FBQ0EsTUFBSSxPQUFPLE1BQU0sQ0FBTixFQUFTLEtBQVQsQ0FBZSxpQkFBZixLQUFxQyxFQUFoRDtBQUNBLE1BQUksS0FBSyxDQUFMLENBQUosRUFBYTtBQUNYLFFBQUksSUFBSixHQUFXLEtBQUssQ0FBTCxLQUFXLElBQXRCO0FBQ0Q7QUFDRCxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxLQUFLLENBQXZDLEVBQTBDO0FBQ3hDLFFBQUksTUFBTSxNQUFNLENBQU4sRUFBUyxLQUFULENBQWUsR0FBZixDQUFWO0FBQ0EsUUFBSSxNQUFNLElBQUksQ0FBSixFQUFPLElBQVAsRUFBVjtBQUNBLFFBQUksTUFBTSxJQUNQLEtBRE8sQ0FDRCxDQURDLEVBQ0UsSUFBSSxNQUROLEVBRVAsSUFGTyxDQUVGLEdBRkUsRUFHUCxJQUhPLEVBQVY7QUFJQSxRQUFJLE9BQU8sR0FBWCxFQUFnQjtBQUNkO0FBQ0EsVUFBSSxZQUFZLElBQVosQ0FBaUIsR0FBakIsQ0FBSixFQUEyQjtBQUN6QixjQUFNLFdBQVcsR0FBWCxDQUFOO0FBQ0Q7QUFDRCxVQUFJLEdBQUosSUFBVyxHQUFYO0FBQ0Q7QUFDRjtBQUNELE1BQUksT0FBTyxJQUFQLENBQVksR0FBWixFQUFpQixNQUFqQixHQUEwQixDQUE5QixFQUFpQztBQUMvQixNQUFFLFNBQUYsQ0FBWSxJQUFaLENBQWlCLEdBQWpCO0FBQ0Q7QUFDRCxTQUFPLElBQVA7QUFDRCxDQXJDRDtBQXNDQSxPQUFPLE9BQVAsR0FBaUIsYUFBakI7Ozs7O0FDdkNBLElBQU0sT0FBTyxRQUFRLGlCQUFSLENBQWI7QUFDQSxJQUFNLGdCQUFnQixRQUFRLDJCQUFSLENBQXRCO0FBQ0EsSUFBTSxlQUFlLFFBQVEsV0FBUixDQUFyQjtBQUNBLElBQU0sZ0JBQWdCLFFBQVEsWUFBUixDQUF0Qjs7QUFFQSxJQUFNLGNBQWMsSUFBSSxNQUFKLENBQVcsUUFBUSxLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLEdBQXBCLENBQVIsR0FBbUMsU0FBOUMsRUFBeUQsSUFBekQsQ0FBcEI7QUFDQTtBQUNBLElBQU0sT0FBTyxRQUFRLG9DQUFSLENBQWI7O0FBRUE7QUFDQSxJQUFNLGtCQUFrQixTQUFsQixlQUFrQixDQUFTLENBQVQsRUFBWSxJQUFaLEVBQWtCLE9BQWxCLEVBQTJCO0FBQ2pEO0FBQ0EsSUFBRSxTQUFGLEdBQWMsRUFBZDtBQUNBLE1BQUksVUFBVSxjQUFjLEdBQWQsRUFBbUIsR0FBbkIsRUFBd0IsSUFBeEIsRUFBOEIsTUFBOUIsQ0FBcUM7QUFBQSxXQUFLLEVBQUUsQ0FBRixLQUFRLEVBQUUsQ0FBRixDQUFSLElBQWdCLEVBQUUsQ0FBRixNQUFTLEdBQXpCLElBQWdDLEVBQUUsQ0FBRixNQUFTLEdBQTlDO0FBQUEsR0FBckMsQ0FBZDtBQUNBLFVBQVEsT0FBUixDQUFnQixVQUFTLElBQVQsRUFBZTtBQUM3QixRQUFJLEtBQUssS0FBTCxDQUFXLFdBQVgsRUFBd0IsSUFBeEIsQ0FBSixFQUFtQztBQUNqQyxVQUFJLFFBQVEsU0FBUixLQUFzQixLQUExQixFQUFpQztBQUMvQixZQUFJLFVBQVUsYUFBYSxJQUFiLENBQWQ7QUFDQSxVQUFFLFNBQUYsQ0FBWSxJQUFaLENBQWlCLE9BQWpCO0FBQ0Q7QUFDRCxhQUFPLEtBQUssT0FBTCxDQUFhLElBQWIsRUFBbUIsRUFBbkIsQ0FBUDtBQUNBO0FBQ0Q7QUFDRDtBQUNBLFFBQUksT0FBTyxLQUFLLEtBQUwsQ0FBVyxrQkFBWCxDQUFYO0FBQ0EsUUFBSSxTQUFTLElBQWIsRUFBbUI7QUFDakIsYUFBTyxLQUFLLENBQUwsRUFBUSxJQUFSLEdBQWUsV0FBZixFQUFQO0FBQ0EsYUFBTyxLQUFLLE9BQUwsQ0FBYSxJQUFiLEVBQW1CLEdBQW5CLENBQVA7QUFDQTtBQUNBLFVBQUksMEJBQTBCLElBQTFCLENBQStCLElBQS9CLE1BQXlDLElBQTdDLEVBQW1EO0FBQ2pELGVBQU8saUJBQVA7QUFDRDtBQUNEO0FBQ0EsVUFBSSxTQUFTLE1BQVQsSUFBbUIsU0FBUyxVQUFoQyxFQUE0QztBQUMxQyxlQUFPLGNBQWMsSUFBZCxFQUFvQixJQUFwQixFQUEwQixDQUExQixFQUE2QixPQUE3QixDQUFQO0FBQ0E7QUFDRDs7QUFFRDtBQUNBLFVBQUksU0FBUyxRQUFiLEVBQXVCO0FBQ3JCLFlBQUksU0FBUyxLQUFLLEtBQUwsQ0FBVyw0QkFBWCxDQUFiO0FBQ0EsWUFBSSxNQUFKLEVBQVk7QUFDVixpQkFBTyxLQUFLLE9BQUwsQ0FBYSxJQUFiLEVBQW1CLE9BQU8sQ0FBUCxDQUFuQixDQUFQO0FBQ0Q7QUFDRjtBQUNELFVBQUksS0FBSyxjQUFMLENBQW9CLElBQXBCLE1BQThCLElBQWxDLEVBQXdDO0FBQ3RDO0FBQ0Q7QUFDRjtBQUNEO0FBQ0EsUUFBSSxRQUFRLE1BQVosRUFBb0I7QUFDbEIsYUFBTyxJQUFQLENBQVksUUFBUSxNQUFwQixFQUE0QixPQUE1QixDQUFvQyxhQUFLO0FBQ3ZDLFlBQUksTUFBTSxRQUFRLE1BQVIsQ0FBZSxDQUFmLEVBQWtCLElBQWxCLEVBQXdCLElBQXhCLENBQVY7QUFDQSxZQUFJLE9BQU8sUUFBUSxLQUFuQixFQUEwQjtBQUN4QjtBQUNBLFlBQUUsTUFBRixDQUFTLENBQVQsSUFBYyxFQUFFLE1BQUYsQ0FBUyxDQUFULEtBQWUsRUFBN0I7QUFDQSxZQUFFLE1BQUYsQ0FBUyxDQUFULEVBQVksSUFBWixDQUFpQixHQUFqQjtBQUNEO0FBQ0YsT0FQRDtBQVFEO0FBQ0Q7QUFDQTtBQUNBLFdBQU8sS0FBSyxPQUFMLENBQWEsSUFBYixFQUFtQixFQUFuQixDQUFQO0FBQ0QsR0FqREQ7QUFrREE7QUFDQTtBQUNBLFNBQU8sS0FBSyxPQUFMLENBQWEsK0JBQWIsRUFBOEMsRUFBOUMsQ0FBUDtBQUNBLFNBQU8sSUFBUDtBQUNELENBMUREOztBQTREQSxPQUFPLE9BQVAsR0FBaUIsZUFBakI7Ozs7O0FDdEVBLElBQU0sT0FBTyxRQUFRLG1CQUFSLEVBQTZCLGVBQTFDO0FBQ0EsSUFBTSxZQUFZLFFBQVEscUJBQVIsRUFBK0IsU0FBakQ7QUFDQSxJQUFNLGdCQUFnQixRQUFRLDJCQUFSLENBQXRCO0FBQ0EsSUFBTSxPQUFPLFFBQVEsaUJBQVIsQ0FBYjtBQUNBLElBQU0sdUJBQXVCLElBQUksTUFBSixDQUFXLFVBQVUsS0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixHQUFwQixDQUFWLEdBQXFDLFdBQWhELEVBQTZELEdBQTdELENBQTdCOztBQUVBLElBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBUyxHQUFULEVBQWM7QUFDaEMsTUFBSSxJQUFJLElBQUksS0FBSixDQUFVLG9CQUFWLENBQVI7QUFDQSxNQUFJLEtBQUssRUFBRSxDQUFGLENBQVQsRUFBZTtBQUNiLFdBQU8sRUFBRSxDQUFGLENBQVA7QUFDRDtBQUNELFNBQU8sSUFBUDtBQUNELENBTkQ7O0FBUUEsSUFBTSxnQkFBZ0IsU0FBaEIsYUFBZ0IsQ0FBUyxHQUFULEVBQWM7QUFDbEMsTUFBSSxDQUFDLEdBQUwsRUFBVTtBQUNSLFdBQU8sRUFBUDtBQUNEO0FBQ0QsTUFBSSxnQkFBZ0IsRUFBcEI7QUFDQSxNQUFJLGlCQUFKO0FBQ0E7QUFDQSxNQUFJLFVBQVUsc0VBQWQ7QUFDQSxNQUFJLFFBQVEsSUFBUixDQUFhLEdBQWIsQ0FBSixFQUF1QjtBQUNyQixRQUFJLE9BQU8sY0FBYyxHQUFkLEVBQW1CLEdBQW5CLEVBQXdCLElBQUksTUFBSixDQUFXLENBQVgsRUFBYyxJQUFJLE1BQUosR0FBYSxDQUEzQixDQUF4QixFQUF1RCxNQUF2RCxDQUE4RCxVQUFDLENBQUQ7QUFBQSxhQUFPLFFBQVEsSUFBUixDQUFhLENBQWIsQ0FBUDtBQUFBLEtBQTlELENBQVg7QUFDQSxVQUFNLElBQUksT0FBSixDQUFZLEtBQUssQ0FBTCxDQUFaLEVBQXFCLEVBQXJCLENBQU47QUFDRDs7QUFFRCxNQUFNLFdBQVcsWUFBWSxHQUFaLENBQWpCLENBYmtDLENBYUM7O0FBRW5DLE1BQUksV0FBVyxDQUFDLENBQWhCLENBZmtDLENBZWY7QUFDbkIsT0FBSyxJQUFJLElBQUksQ0FBUixFQUFXLE1BQU0sSUFBSSxNQUExQixFQUFrQyxJQUFJLEdBQXRDLEVBQTJDLEdBQTNDLEVBQWdEO0FBQzlDLFFBQUksYUFBYSxDQUFiLElBQWtCLElBQUksQ0FBSixNQUFXLEdBQTdCLElBQW9DLGFBQWEsSUFBckQsRUFBMkQ7QUFDekQsb0JBQWMsSUFBZCxDQUFtQixJQUFuQjtBQUNEO0FBQ0QsUUFBSSxJQUFJLENBQUosTUFBVyxHQUFYLElBQWtCLElBQUksQ0FBSixNQUFXLEdBQWpDLEVBQXNDO0FBQ3BDO0FBQ0QsS0FGRCxNQUVPLElBQUksSUFBSSxDQUFKLE1BQVcsR0FBWCxJQUFrQixJQUFJLENBQUosTUFBVyxHQUFqQyxFQUFzQztBQUMzQztBQUNEO0FBQ0QsZUFBVyxJQUFJLENBQUosQ0FBWDtBQUNBLGtCQUFjLElBQWQsQ0FBbUIsUUFBbkI7QUFDRDs7QUFFRCxRQUFNLGNBQWMsSUFBZCxDQUFtQixFQUFuQixDQUFOO0FBQ0E7QUFDQSxRQUFNLElBQUksT0FBSixDQUFZLGlCQUFaLEVBQStCLEVBQS9CLENBQU47QUFDQSxRQUFNLElBQUksT0FBSixDQUFZLFVBQVosRUFBd0IsRUFBeEIsQ0FBTjtBQUNBLE1BQUksUUFBUSxJQUFJLEtBQUosQ0FBVSxPQUFWLENBQVo7O0FBRUEsTUFBSSxNQUFNLEVBQVY7QUFDQSxNQUFJLE1BQU0sSUFBVjtBQUNBLE9BQUssSUFBSSxLQUFJLENBQWIsRUFBZ0IsS0FBSSxNQUFNLE1BQTFCLEVBQWtDLElBQWxDLEVBQXVDO0FBQ3JDLFFBQUksSUFBSSxNQUFNLEVBQU4sQ0FBUjtBQUNBLFFBQUksV0FBVyxFQUFFLEtBQUYsQ0FBUSxxQkFBUixDQUFmO0FBQ0EsUUFBSSxZQUFZLFNBQVMsQ0FBVCxDQUFoQixFQUE2QjtBQUMzQixZQUFNLEtBQUssU0FBUyxDQUFULENBQUwsQ0FBTjtBQUNBLFVBQUksU0FBUyxDQUFULENBQUosRUFBaUI7QUFDZixZQUFJLEdBQUosSUFBVyxLQUFLLFNBQVMsQ0FBVCxDQUFMLENBQVg7QUFDRCxPQUZELE1BRU87QUFDTCxZQUFJLEdBQUosSUFBVyxFQUFYO0FBQ0Q7QUFDRixLQVBELE1BT08sSUFBSSxHQUFKLEVBQVM7QUFDZCxVQUFJLEdBQUosS0FBWSxDQUFaO0FBQ0Q7QUFDRjtBQUNEO0FBQ0EsU0FBTyxJQUFQLENBQVksR0FBWixFQUFpQixPQUFqQixDQUF5QixhQUFLO0FBQzVCLFFBQUksQ0FBQyxJQUFJLENBQUosQ0FBTCxFQUFhO0FBQ1gsYUFBTyxJQUFJLENBQUosQ0FBUDtBQUNBO0FBQ0Q7QUFDRCxRQUFJLENBQUosSUFBUyxVQUFVLElBQUksQ0FBSixDQUFWLENBQVQ7QUFDQSxRQUFJLElBQUksQ0FBSixFQUFPLElBQVAsSUFBZSxJQUFJLENBQUosRUFBTyxJQUFQLENBQVksS0FBWixDQUFrQixXQUFsQixDQUFuQixFQUFtRDtBQUNqRCxVQUFJLENBQUosRUFBTyxJQUFQLEdBQWMsSUFBSSxDQUFKLEVBQU8sSUFBUCxDQUFZLE9BQVosQ0FBb0IsR0FBcEIsRUFBeUIsRUFBekIsQ0FBZDtBQUNBLFVBQUksQ0FBSixFQUFPLElBQVAsR0FBYyxTQUFTLElBQUksQ0FBSixFQUFPLElBQWhCLEVBQXNCLEVBQXRCLENBQWQ7QUFDRDtBQUNGLEdBVkQ7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBTztBQUNMLGNBQVUsUUFETDtBQUVMLFVBQU07QUFGRCxHQUFQO0FBSUQsQ0F2RkQ7QUF3RkEsT0FBTyxPQUFQLEdBQWlCLGFBQWpCOzs7OztBQ3RHQSxJQUFNLE9BQU8sUUFBUSxpQkFBUixDQUFiO0FBQ0EsSUFBTSxjQUFjLFFBQVEsMkJBQVIsQ0FBcEI7QUFDQSxJQUFNLGVBQWUsSUFBSSxNQUFKLENBQVcsY0FBYyxLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLEdBQXBCLENBQWQsR0FBeUMsMEJBQXBELEVBQWdGLEdBQWhGLENBQXJCOztBQUVBLElBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBUyxJQUFULEVBQWU7QUFDakMsU0FBTyxhQUFhLElBQWIsQ0FBa0IsSUFBbEIsQ0FBUDtBQUNELENBRkQ7O0FBSUE7QUFDQSxJQUFNLGlCQUFpQixTQUFqQixjQUFpQixDQUFTLElBQVQsRUFBZTtBQUNwQyxNQUFJLFFBQVEsRUFBWjtBQUNBLE1BQUksUUFBUSxLQUFLLE9BQUwsQ0FBYSxLQUFiLEVBQW9CLEVBQXBCLEVBQXdCLEtBQXhCLENBQThCLElBQTlCLENBQVo7QUFDQSxRQUFNLE9BQU4sQ0FBYyxVQUFTLEdBQVQsRUFBYztBQUMxQjtBQUNBLFFBQUksSUFBSSxLQUFKLENBQVUsc0JBQVYsQ0FBSixFQUF1QztBQUNyQyxVQUFJLFFBQVEsWUFBWSxHQUFaLENBQVo7QUFDQSxVQUFJLFNBQVMsTUFBTSxDQUFOLENBQVQsSUFBcUIsTUFBTSxDQUFOLEVBQVMsSUFBbEMsRUFBd0M7QUFDdEMsY0FBTSxJQUFOLENBQVcsTUFBTSxDQUFOLEVBQVMsSUFBcEI7QUFDRDtBQUNGO0FBQ0YsR0FSRDtBQVNBLFNBQU87QUFDTCxVQUFNLGdCQUREO0FBRUwsV0FBTztBQUZGLEdBQVA7QUFJRCxDQWhCRDtBQWlCQSxPQUFPLE9BQVAsR0FBaUI7QUFDZixlQUFhLFdBREU7QUFFZixrQkFBZ0I7QUFGRCxDQUFqQjs7Ozs7QUMxQkEsSUFBTSxPQUFPLFFBQVEsaUJBQVIsQ0FBYjtBQUNBO0FBQ0EsSUFBTSxpQkFBaUIsSUFBSSxNQUFKLENBQVcsaUJBQWlCLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsR0FBcEIsQ0FBakIsR0FBNEMsNEJBQXZELEVBQXFGLEdBQXJGLENBQXZCOztBQUVBLElBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBUyxJQUFULEVBQWU7QUFDakMsU0FBTyxLQUFLLEtBQUwsQ0FBVyxjQUFYLENBQVA7QUFDRCxDQUZEOztBQUlBLElBQU0saUJBQWlCLFNBQWpCLGNBQWlCLENBQVMsSUFBVCxFQUFlO0FBQ3BDLE1BQUksVUFBVSxDQUFDLEtBQUssS0FBTCxDQUFXLGNBQVgsS0FBOEIsRUFBL0IsRUFBbUMsQ0FBbkMsS0FBeUMsRUFBdkQ7QUFDQSxZQUFVLFFBQVEsT0FBUixDQUFnQixLQUFoQixFQUF1QixFQUF2QixDQUFWO0FBQ0EsU0FBTztBQUNMLFVBQU0sVUFERDtBQUVMLGNBQVU7QUFGTCxHQUFQO0FBSUQsQ0FQRDs7QUFTQSxPQUFPLE9BQVAsR0FBaUI7QUFDZixlQUFhLFdBREU7QUFFZixrQkFBZ0I7QUFGRCxDQUFqQjs7Ozs7QUNqQkEsSUFBTSxPQUFPLFFBQVEsaUJBQVIsQ0FBYjtBQUNBLElBQU0sYUFBYSxRQUFRLHdCQUFSLENBQW5CO0FBQ0EsSUFBTSxZQUFZLElBQUksTUFBSixDQUFXLE9BQU8sS0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixLQUFLLEtBQXhCLEVBQStCLElBQS9CLENBQW9DLEdBQXBDLENBQVAsR0FBa0QsR0FBN0QsRUFBa0UsR0FBbEUsQ0FBbEI7O0FBRUE7QUFDQSxJQUFNLGNBQWMsU0FBZCxXQUFjLENBQVMsQ0FBVCxFQUFZO0FBQzlCO0FBQ0EsTUFBSSxFQUFFLFNBQUYsQ0FBWSxDQUFaLEtBQWtCLEVBQUUsU0FBRixDQUFZLENBQVosRUFBZSxJQUFqQyxJQUF5QyxFQUFFLFNBQUYsQ0FBWSxDQUFaLEVBQWUsSUFBZixDQUFvQixPQUFwQixDQUF6QyxJQUF5RSxFQUFFLFNBQUYsQ0FBWSxDQUFaLEVBQWUsSUFBZixDQUFvQixPQUFwQixFQUE2QixJQUExRyxFQUFnSDtBQUM5RyxRQUFJLE1BQU0sRUFBRSxTQUFGLENBQVksQ0FBWixFQUFlLElBQWYsQ0FBb0IsT0FBcEIsRUFBNkIsSUFBN0IsSUFBcUMsRUFBL0M7QUFDQSxRQUFJLE9BQU8sT0FBTyxHQUFQLEtBQWUsUUFBdEIsSUFBa0MsQ0FBQyxJQUFJLEtBQUosQ0FBVSxTQUFWLENBQXZDLEVBQTZEO0FBQzNELFlBQU0sWUFBWSxHQUFaLEdBQWtCLElBQXhCO0FBQ0EsWUFBTSxXQUFXLEdBQVgsQ0FBTjtBQUNBLFFBQUUsTUFBRixDQUFTLElBQVQsQ0FBYyxHQUFkO0FBQ0Q7QUFDRjtBQUNEO0FBQ0EsSUFBRSxRQUFGLENBQVcsT0FBWCxDQUFtQixhQUFLO0FBQ3RCO0FBQ0EsUUFBSSxFQUFFLFNBQUYsSUFBZSxFQUFFLFNBQUYsQ0FBWSxVQUEvQixFQUEyQztBQUN6QyxVQUFJLE9BQU0sRUFBRSxTQUFGLENBQVksVUFBWixDQUF1QixDQUF2QixDQUFWO0FBQ0EsYUFBTSxZQUFZLElBQVosR0FBa0IsSUFBeEI7QUFDQSxhQUFNLFdBQVcsSUFBWCxDQUFOO0FBQ0EsUUFBRSxNQUFGLENBQVMsSUFBVCxDQUFjLElBQWQ7QUFDRDtBQUNELFFBQUksRUFBRSxNQUFOLEVBQWM7QUFDWixRQUFFLE1BQUYsQ0FBUyxPQUFULENBQWlCO0FBQUEsZUFBTyxFQUFFLE1BQUYsQ0FBUyxJQUFULENBQWMsR0FBZCxDQUFQO0FBQUEsT0FBakI7QUFDRDtBQUNGLEdBWEQ7O0FBYUE7QUFDQSxNQUFJLEVBQUUsUUFBRixDQUFXLENBQVgsS0FBaUIsRUFBRSxRQUFGLENBQVcsQ0FBWCxFQUFjLFNBQWQsQ0FBd0IsQ0FBeEIsQ0FBckIsRUFBaUQ7QUFDL0MsUUFBSSxJQUFJLEVBQUUsUUFBRixDQUFXLENBQVgsRUFBYyxTQUFkLENBQXdCLENBQXhCLENBQVI7QUFDQSxRQUFJLEVBQUUsR0FBRixJQUFTLEVBQUUsR0FBRixDQUFNLElBQWYsSUFBdUIsRUFBRSxHQUFGLENBQU0sSUFBTixDQUFXLENBQVgsQ0FBM0IsRUFBMEM7QUFDeEMsUUFBRSxLQUFGLEdBQVUsRUFBRSxLQUFGLElBQVcsRUFBRSxHQUFGLENBQU0sSUFBTixDQUFXLENBQVgsQ0FBckI7QUFDRDtBQUNGO0FBQ0QsU0FBTyxDQUFQO0FBQ0QsQ0FoQ0Q7QUFpQ0EsT0FBTyxPQUFQLEdBQWlCLFdBQWpCOzs7OztBQ3RDQSxJQUFNLGFBQWEsUUFBUSxzQkFBUixDQUFuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQU0sY0FBYztBQUNsQixLQUFHLElBRGU7QUFFbEIsS0FBRyxJQUZlO0FBR2xCLEtBQUcsSUFIZTtBQUlsQixLQUFHO0FBSmUsQ0FBcEI7O0FBT0EsSUFBTSxRQUFRLFNBQVIsS0FBUSxDQUFTLEdBQVQsRUFBYztBQUMxQixNQUFJLE9BQU8sR0FBUCxLQUFlLFFBQW5CLEVBQTZCO0FBQzNCLFdBQU8sR0FBUDtBQUNEO0FBQ0QsTUFBSSxTQUFTLE1BQWI7QUFDQSxTQUFPLEtBQUssS0FBTCxDQUFXLE1BQU0sTUFBakIsSUFBMkIsTUFBbEM7QUFDRCxDQU5EOztBQVFBLElBQU0sYUFBYSxTQUFiLFVBQWEsQ0FBUyxHQUFULEVBQWM7QUFDL0IsTUFBSSxNQUFNO0FBQ1IsU0FBSyxJQURHO0FBRVIsU0FBSztBQUZHLEdBQVY7QUFJQSxNQUFJLE1BQU0sSUFBSSxLQUFKLENBQVUsR0FBVixDQUFWO0FBQ0E7QUFDQSxNQUFJLE9BQU8sRUFBWDtBQUNBLE9BQUksSUFBSSxJQUFJLENBQVosRUFBZSxJQUFJLElBQUksTUFBdkIsRUFBK0IsS0FBSyxDQUFwQyxFQUF1QztBQUNyQyxRQUFJLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBUCxFQUFSO0FBQ0E7QUFDQSxRQUFJLE1BQU0sV0FBVyxDQUFYLENBQVY7QUFDQSxRQUFJLE9BQU8sUUFBUSxDQUFuQixFQUFzQjtBQUNwQixVQUFJLENBQUosSUFBUyxHQUFUO0FBQ0EsV0FBSyxJQUFMLENBQVUsR0FBVjtBQUNELEtBSEQsTUFHTyxJQUFJLEVBQUUsS0FBRixDQUFRLFdBQVIsQ0FBSixFQUEwQjtBQUMvQixVQUFJLE1BQUosR0FBYSxFQUFFLE9BQUYsQ0FBVSxXQUFWLEVBQXVCLEVBQXZCLENBQWI7QUFDQTtBQUNELEtBSE0sTUFHQSxJQUFJLEVBQUUsS0FBRixDQUFRLFVBQVIsQ0FBSixFQUF5QjtBQUM5QixVQUFJLEtBQUosR0FBWSxFQUFFLE9BQUYsQ0FBVSxVQUFWLEVBQXNCLEVBQXRCLENBQVo7QUFDQTtBQUNEO0FBQ0Q7QUFDQSxRQUFJLFlBQVksRUFBRSxXQUFGLEVBQVosQ0FBSixFQUFrQztBQUNoQyxVQUFJLElBQUksR0FBSixLQUFZLElBQWhCLEVBQXNCO0FBQ3BCLGFBQUssSUFBTCxDQUFVLENBQVY7QUFDQSxZQUFJLEdBQUosR0FBVSxXQUFXLElBQVgsQ0FBVjtBQUNELE9BSEQsTUFHTztBQUNMLGFBQUssSUFBTCxDQUFVLENBQVY7QUFDQSxZQUFJLEdBQUosR0FBVSxXQUFXLElBQVgsQ0FBVjtBQUNBLGNBQU0sSUFBSSxLQUFKLENBQVUsQ0FBVixFQUFhLElBQUksTUFBakIsQ0FBTjtBQUNBLGVBQU8sRUFBUDtBQUNBLFlBQUksQ0FBSjtBQUNEO0FBQ0Y7QUFDRjtBQUNEO0FBQ0EsTUFBSSxDQUFDLElBQUksR0FBTCxJQUFZLEtBQUssTUFBTCxLQUFnQixDQUFoQyxFQUFtQztBQUNqQyxRQUFJLEdBQUosR0FBVSxLQUFLLENBQUwsQ0FBVjtBQUNBLFFBQUksR0FBSixHQUFVLEtBQUssQ0FBTCxDQUFWO0FBQ0Q7QUFDRCxNQUFJLEdBQUosR0FBVSxNQUFNLElBQUksR0FBVixDQUFWO0FBQ0EsTUFBSSxHQUFKLEdBQVUsTUFBTSxJQUFJLEdBQVYsQ0FBVjtBQUNBLFNBQU8sR0FBUDtBQUNELENBNUNEO0FBNkNBLE9BQU8sT0FBUCxHQUFpQixVQUFqQjs7Ozs7QUNsRUEsSUFBTSxXQUFXLFFBQVEsWUFBUixDQUFqQjtBQUNBLElBQU0sZ0JBQWdCLFFBQVEsa0JBQVIsQ0FBdEI7O0FBRUE7QUFDQSxTQUFTLFVBQVQsQ0FBb0IsQ0FBcEIsRUFBdUIsSUFBdkIsRUFBNkIsT0FBN0IsRUFBc0M7QUFDcEM7QUFDQSxTQUFPLEtBQUssT0FBTCxDQUFhLHNCQUFiLEVBQXFDLEVBQXJDLENBQVA7QUFDQSxTQUFPLEtBQUssT0FBTCxDQUFhLDBDQUFiLEVBQXlELEVBQXpELENBQVA7QUFDQTtBQUNBLFNBQU8sS0FBSyxPQUFMLENBQWEsU0FBYixFQUF3QixFQUF4QixDQUFQO0FBQ0E7QUFDQSxTQUFPLEtBQUssT0FBTCxDQUFhLEtBQWIsRUFBb0IsRUFBcEIsQ0FBUDtBQUNBO0FBQ0EsU0FBTyxLQUFLLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLEVBQXhCLENBQVA7QUFDQTtBQUNBLFNBQU8sS0FBSyxPQUFMLENBQWEsU0FBYixFQUF3QixHQUF4QixDQUFQO0FBQ0E7QUFDQSxTQUFPLEtBQUssT0FBTCxDQUFhLGtEQUFiLEVBQWlFLEVBQWpFLENBQVA7QUFDQTtBQUNBLFNBQU8sY0FBYyxJQUFkLEVBQW9CLENBQXBCLENBQVA7QUFDQTtBQUNBLFNBQU8sU0FBUyxJQUFULEVBQWUsQ0FBZixFQUFrQixPQUFsQixDQUFQO0FBQ0E7QUFDQSxTQUFPLEtBQUssT0FBTCxDQUFhLFFBQWIsRUFBdUIsRUFBdkIsQ0FBUDtBQUNBLFNBQU8sSUFBUDtBQUNEO0FBQ0QsT0FBTyxPQUFQLEdBQWlCLFVBQWpCO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzdCQSxJQUFNLGdCQUFnQixRQUFRLHFCQUFSLENBQXRCO0FBQ0EsSUFBTSxZQUFZLFFBQVEscUJBQVIsRUFBK0IsU0FBakQ7QUFDQTtBQUNBOztBQUVBLElBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBUyxHQUFULEVBQWM7QUFDaEMsU0FBTywrQkFBOEIsSUFBOUIsQ0FBbUMsR0FBbkMsS0FBMkMsV0FBVyxJQUFYLENBQWdCLEdBQWhCLENBQTNDLElBQW1FLG1CQUFtQixJQUFuQixDQUF3QixHQUF4QixNQUFpQztBQUEzRztBQUNELENBRkQ7QUFHQTtBQUNBLElBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBUyxHQUFULEVBQWMsQ0FBZCxFQUFpQixPQUFqQixFQUEwQjtBQUM1QyxNQUFJLFFBQVEsU0FBUixLQUFzQixLQUExQixFQUFpQztBQUMvQjtBQUNEO0FBQ0QsTUFBSSxNQUFNLFVBQVUsR0FBVixLQUFrQixFQUE1QjtBQUNBLE1BQUksT0FBTztBQUNULFVBQU0sUUFERztBQUVULFVBQU0sSUFBSTtBQUZELEdBQVg7QUFJQSxNQUFJLElBQUksS0FBSixJQUFhLElBQUksS0FBSixDQUFVLE1BQTNCLEVBQW1DO0FBQ2pDLFFBQUksU0FBUyxJQUFJLEtBQUosQ0FBVSxJQUFWLENBQWU7QUFBQSxhQUFLLEVBQUUsSUFBUDtBQUFBLEtBQWYsQ0FBYjtBQUNBLFFBQUksTUFBSixFQUFZO0FBQ1YsV0FBSyxHQUFMLEdBQVcsT0FBTyxJQUFsQjtBQUNEO0FBQ0Y7QUFDRCxJQUFFLFNBQUYsQ0FBWSxJQUFaLENBQWlCLElBQWpCO0FBQ0QsQ0FoQkQ7O0FBa0JBLElBQU0sV0FBVyxTQUFYLFFBQVcsQ0FBUyxJQUFULEVBQWUsQ0FBZixFQUFrQixPQUFsQixFQUEyQjtBQUMxQztBQUNBO0FBQ0EsU0FBTyxLQUFLLE9BQUwsQ0FBYSxvQ0FBYixFQUFtRCxVQUFTLENBQVQsRUFBWSxJQUFaLEVBQWtCO0FBQzFFLFFBQUksWUFBWSxJQUFaLENBQUosRUFBdUI7QUFDckIsYUFBTyxjQUFjLElBQWQsRUFBb0IsSUFBcEIsRUFBMEIsQ0FBMUIsRUFBNkIsT0FBN0IsQ0FBUDtBQUNELEtBRkQsTUFFTztBQUNMLGtCQUFZLElBQVosRUFBa0IsQ0FBbEIsRUFBcUIsT0FBckI7QUFDRDtBQUNELFdBQU8sR0FBUDtBQUNELEdBUE0sQ0FBUDtBQVFBO0FBQ0EsU0FBTyxLQUFLLE9BQUwsQ0FBYSw0QkFBYixFQUEyQyxHQUEzQyxDQUFQO0FBQ0E7QUFDQSxTQUFPLEtBQUssT0FBTCxDQUFhLGtEQUFiLEVBQWlFLFVBQVMsQ0FBVCxFQUFZLElBQVosRUFBa0I7QUFDeEYsUUFBSSxZQUFZLElBQVosQ0FBSixFQUF1QjtBQUNyQixhQUFPLGNBQWMsSUFBZCxFQUFvQixJQUFwQixFQUEwQixDQUExQixFQUE2QixPQUE3QixDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsa0JBQVksSUFBWixFQUFrQixDQUFsQixFQUFxQixPQUFyQjtBQUNEO0FBQ0QsV0FBTyxHQUFQO0FBQ0QsR0FQTSxDQUFQO0FBUUE7QUFDQSxTQUFPLEtBQUssT0FBTCxDQUFhLG1VQUFiLEVBQWtWLEdBQWxWLENBQVAsQ0F2QjBDLENBdUJxVDtBQUMvVjtBQUNBLFNBQU8sS0FBSyxPQUFMLENBQWEsMERBQWIsRUFBeUUsR0FBekUsQ0FBUCxDQXpCMEMsQ0F5QjRDO0FBQ3RGO0FBQ0EsU0FBTyxLQUFLLE9BQUwsQ0FBYSw4RUFBYixFQUE2RixHQUE3RixDQUFQLENBM0IwQyxDQTJCZ0U7QUFDMUcsU0FBTyxLQUFLLE9BQUwsQ0FBYSxpRkFBYixFQUFnRyxHQUFoRyxDQUFQLENBNUIwQyxDQTRCbUU7QUFDN0csU0FBTyxLQUFLLE9BQUwsQ0FBYSwyQkFBYixFQUEwQyxHQUExQyxDQUFQLENBN0IwQyxDQTZCYTtBQUN2RDtBQUNBLFNBQU8sS0FBSyxPQUFMLENBQWEsa0NBQWIsRUFBaUQsR0FBakQsQ0FBUCxDQS9CMEMsQ0ErQm9CO0FBQzlELFNBQU8sS0FBSyxPQUFMLENBQWEsaUJBQWIsRUFBZ0MsR0FBaEMsQ0FBUCxDQWhDMEMsQ0FnQ0c7QUFDN0MsU0FBTyxLQUFLLElBQUwsRUFBUDtBQUNELENBbENEO0FBbUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxPQUFQLEdBQWlCLFFBQWpCOzs7OztBQ3JFQSxJQUFNLFlBQVksUUFBUSxzQkFBUixDQUFsQjtBQUNBLElBQU0sYUFBYSxRQUFRLGVBQVIsQ0FBbkI7O0FBRUEsSUFBTSxTQUFTLENBQ2IsU0FEYSxFQUViLFVBRmEsRUFHYixPQUhhLEVBSWIsT0FKYSxFQUtiLEtBTGEsRUFNYixNQU5hLEVBT2IsTUFQYSxFQVFiLFFBUmEsRUFTYixXQVRhLEVBVWIsU0FWYSxFQVdiLFVBWGEsRUFZYixVQVphLENBQWY7QUFjQSxJQUFNLE9BQU8sQ0FBQyxRQUFELEVBQVcsUUFBWCxFQUFxQixTQUFyQixFQUFnQyxXQUFoQyxFQUE2QyxVQUE3QyxFQUF5RCxRQUF6RCxFQUFtRSxVQUFuRSxDQUFiO0FBQ0E7QUFDQSxJQUFNLFNBQVMsa0xBQWY7O0FBRUE7QUFDQTtBQUNBLElBQU0saUJBQWlCLFNBQWpCLGNBQWlCLENBQVMsSUFBVCxFQUFlLENBQWYsRUFBa0I7QUFDdkM7QUFDQSxTQUFPLEtBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsVUFBUyxJQUFULEVBQWU7QUFDekM7QUFDQSxXQUFPLEtBQUssT0FBTCxDQUFhLGdDQUFiLEVBQStDLElBQS9DLENBQVA7QUFDQTtBQUNBLFdBQU8sS0FBSyxPQUFMLENBQWEsMENBQWIsRUFBeUQsT0FBekQsQ0FBUCxDQUp5QyxDQUlpQztBQUMxRTtBQUNBLFFBQUksSUFBSSxJQUFJLElBQUosRUFBUjtBQUNBLFdBQU8sS0FBSyxPQUFMLENBQWEsbUNBQWIsRUFBa0QsRUFBRSxPQUFGLEVBQWxELENBQVA7QUFDQSxXQUFPLEtBQUssT0FBTCxDQUFhLCtDQUFiLEVBQThELE9BQU8sRUFBRSxRQUFGLEVBQVAsQ0FBOUQsQ0FBUDtBQUNBLFdBQU8sS0FBSyxPQUFMLENBQWEsZ0NBQWIsRUFBK0MsRUFBRSxXQUFGLEVBQS9DLENBQVA7QUFDQSxXQUFPLEtBQUssT0FBTCxDQUFhLG1DQUFiLEVBQWtELEtBQUssRUFBRSxNQUFGLEVBQUwsQ0FBbEQsQ0FBUDtBQUNBO0FBQ0EsV0FBTyxLQUFLLE9BQUwsQ0FBYSxvQ0FBYixFQUFtRCxJQUFuRCxDQUFQO0FBQ0EsV0FBTyxLQUFLLE9BQUwsQ0FBYSxnREFBYixFQUErRCxJQUEvRCxDQUFQO0FBQ0EsV0FBTyxLQUFLLE9BQUwsQ0FBYSw0Q0FBYixFQUEyRCxJQUEzRCxDQUFQO0FBQ0E7QUFDQSxXQUFPLEtBQUssT0FBTCxDQUFhLDRCQUFiLEVBQTJDLElBQTNDLENBQVA7QUFDQTtBQUNBLFdBQU8sS0FBSyxPQUFMLENBQWEsNkJBQWIsRUFBNEMsSUFBNUMsQ0FBUDtBQUNBO0FBQ0EsV0FBTyxLQUFLLE9BQUwsQ0FBYSw4QkFBYixFQUE2QyxFQUE3QyxDQUFQO0FBQ0E7QUFDQTtBQUNBLFFBQUksUUFBUSxLQUFLLEtBQUwsQ0FBVyx3QkFBWCxDQUFaO0FBQ0EsUUFBSSxVQUFVLElBQWQsRUFBb0I7QUFDbEIsUUFBRSxXQUFGLENBQWMsSUFBZCxDQUFtQixXQUFXLE1BQU0sQ0FBTixDQUFYLENBQW5CO0FBQ0EsYUFBTyxLQUFLLE9BQUwsQ0FBYSxNQUFNLENBQU4sQ0FBYixFQUF1QixFQUF2QixDQUFQO0FBQ0Q7QUFDRDtBQUNBLFdBQU8sS0FBSyxPQUFMLENBQWEsb0ZBQWIsRUFBbUcsSUFBbkcsQ0FBUDtBQUNBOztBQUVBLFFBQUksS0FBSyxLQUFMLENBQVcsWUFBWCxDQUFKLEVBQThCO0FBQzVCLFVBQUksT0FBTyxDQUFDLEtBQUssS0FBTCxDQUFXLHVCQUFYLEtBQXVDLEVBQXhDLEVBQTRDLENBQTVDLEtBQWtELEVBQTdEO0FBQ0EsYUFBTyxJQUFJLElBQUosQ0FBUyxJQUFULENBQVA7QUFDQSxVQUFJLFFBQVEsS0FBSyxPQUFMLEVBQVosRUFBNEI7QUFDMUIsZUFBTyxLQUFLLE9BQUwsQ0FBYSxxQkFBYixFQUFvQyxLQUFLLFlBQUwsRUFBcEMsQ0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU8sS0FBSyxPQUFMLENBQWEscUJBQWIsRUFBb0MsR0FBcEMsQ0FBUDtBQUNEO0FBQ0Y7QUFDRCxRQUFJLEtBQUssS0FBTCxDQUFXLG9CQUFYLENBQUosRUFBc0M7QUFDcEMsVUFBSSxRQUFPLEtBQUssS0FBTCxDQUFXLG9DQUFYLEtBQW9ELEVBQXBELElBQTBELEVBQXJFO0FBQ0EsVUFBSSxhQUFhLE1BQUssQ0FBTCxJQUFVLEdBQVYsR0FBZ0IsTUFBSyxDQUFMLENBQWhCLEdBQTBCLEdBQTFCLEdBQWdDLE1BQUssQ0FBTCxDQUFqRDtBQUNBLGFBQU8sS0FBSyxPQUFMLENBQWEsc0JBQWIsRUFBcUMsVUFBckMsQ0FBUDtBQUNEO0FBQ0Q7QUFDQSxXQUFPLEtBQUssT0FBTCxDQUFhLDZCQUFiLEVBQTRDLFFBQTVDLENBQVA7QUFDQSxXQUFPLEtBQUssT0FBTCxDQUFhLHVDQUFiLEVBQXNELEVBQXRELENBQVA7QUFDQSxXQUFPLEtBQUssT0FBTCxDQUFhLCtCQUFiLEVBQThDLE1BQTlDLENBQVA7QUFDQSxXQUFPLEtBQUssT0FBTCxDQUFhLHFDQUFiLEVBQW9ELFFBQXBELENBQVA7QUFDQTtBQUNBLFFBQUksS0FBSyxLQUFMLENBQVcsYUFBWCxDQUFKLEVBQStCO0FBQzdCO0FBQ0EsVUFBSSxPQUFPLENBQUMsS0FBSyxLQUFMLENBQVcsNEJBQVgsS0FBNEMsRUFBN0MsRUFBaUQsQ0FBakQsS0FBdUQsRUFBbEU7QUFDQSxhQUFPLEtBQUssV0FBTCxFQUFQO0FBQ0EsVUFBSSxRQUFRLFVBQVUsSUFBVixDQUFaLEVBQTZCO0FBQzNCLGVBQU8sS0FBSyxPQUFMLENBQWEsNkJBQWIsRUFBNEMsVUFBVSxJQUFWLEVBQWdCLGFBQTVELENBQVA7QUFDRCxPQUZELE1BRU87QUFDTCxlQUFPLEtBQUssT0FBTCxDQUFhLDZCQUFiLEVBQTRDLE1BQTVDLENBQVA7QUFDRDtBQUNGO0FBQ0QsV0FBTyxJQUFQO0FBQ0QsR0EvRE0sQ0FBUDtBQWdFQTtBQUNBLFNBQU8sS0FBSyxPQUFMLENBQWEsdUNBQWIsRUFBc0QsVUFBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsRUFBa0I7QUFDN0UsUUFBSSxNQUFNLEVBQUUsS0FBRixDQUFRLGNBQVIsQ0FBVjtBQUNBLFVBQU0sSUFBSSxNQUFKLENBQVc7QUFBQSxhQUFRLElBQVI7QUFBQSxLQUFYLENBQU47QUFDQSxXQUFPLElBQUksSUFBSixDQUFTLElBQVQsQ0FBUDtBQUNELEdBSk0sQ0FBUDtBQUtBO0FBQ0EsU0FBTyxLQUFLLE9BQUwsQ0FBYSx5REFBYixFQUF3RSxVQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixFQUFrQjtBQUMvRixRQUFJLE1BQU0sRUFBRSxLQUFGLENBQVEsY0FBUixDQUFWO0FBQ0EsVUFBTSxJQUFJLE1BQUosQ0FBVztBQUFBLGFBQVEsSUFBUjtBQUFBLEtBQVgsQ0FBTjtBQUNBLFdBQU8sSUFBSSxJQUFKLENBQVMsSUFBVCxDQUFQO0FBQ0QsR0FKTSxDQUFQO0FBS0E7QUFDQSxTQUFPLElBQVA7QUFDRCxDQWhGRDtBQWlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE9BQU8sT0FBUCxHQUFpQixjQUFqQjs7Ozs7QUNqSEEsSUFBTSxNQUFNLFFBQVEsbUJBQVIsQ0FBWjtBQUNBLElBQU0sY0FBYyxnQ0FBcEI7O0FBRUE7QUFDQSxJQUFNLGVBQWUsU0FBZixZQUFlLENBQVMsQ0FBVCxFQUFZLEdBQVosRUFBaUI7QUFDcEMsTUFBSSxVQUFVLElBQUksS0FBSixDQUFVLFdBQVYsQ0FBZDtBQUNBLE1BQUksQ0FBQyxPQUFMLEVBQWM7QUFDWixXQUFPO0FBQ0wsYUFBTyxFQURGO0FBRUwsYUFBTztBQUZGLEtBQVA7QUFJRDtBQUNELE1BQUksUUFBUSxRQUFRLENBQVIsS0FBYyxFQUExQjtBQUNBLFVBQVEsSUFBSSxlQUFKLENBQW9CLEtBQXBCLENBQVI7QUFDQSxNQUFJLFFBQVEsQ0FBWjtBQUNBLE1BQUksUUFBUSxDQUFSLENBQUosRUFBZ0I7QUFDZCxZQUFRLFFBQVEsQ0FBUixFQUFXLE1BQVgsR0FBb0IsQ0FBNUI7QUFDRDtBQUNELElBQUUsS0FBRixHQUFVLEtBQVY7QUFDQSxJQUFFLEtBQUYsR0FBVSxLQUFWO0FBQ0EsU0FBTyxDQUFQO0FBQ0QsQ0FqQkQ7QUFrQkEsT0FBTyxPQUFQLEdBQWlCLFlBQWpCOzs7OztBQ3RCQSxJQUFNLFNBQVMsUUFBUSxVQUFSLENBQWY7QUFDQSxJQUFNLE9BQU8sUUFBUSxvQkFBUixDQUFiO0FBQ0EsSUFBTSxXQUFXLElBQUksTUFBSixDQUFXLE1BQU0sS0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixLQUFLLEtBQXhCLEVBQStCLElBQS9CLENBQW9DLEdBQXBDLENBQU4sR0FBaUQsZUFBNUQsRUFBNkUsR0FBN0UsQ0FBakI7O0FBRUE7QUFDQTtBQUNBLElBQU0sYUFBYSxTQUFiLFVBQWEsQ0FBUyxJQUFULEVBQWU7QUFDaEMsTUFBSSxRQUFRLEtBQUssT0FBTCxDQUFhLG1CQUFiLEVBQWtDLEVBQWxDLENBQVo7QUFDQTtBQUNBLFVBQVEsTUFBTSxNQUFOLENBQWEsQ0FBYixFQUFnQixXQUFoQixLQUFnQyxNQUFNLFNBQU4sQ0FBZ0IsQ0FBaEIsQ0FBeEM7QUFDQTtBQUNBLFVBQVEsTUFBTSxPQUFOLENBQWMsSUFBZCxFQUFvQixHQUFwQixDQUFSOztBQUVBLE1BQUksT0FBTyxJQUFJLE9BQU8sR0FBWCxHQUFpQixHQUFqQixDQUFxQixLQUFyQixDQUFYO0FBQ0EsTUFBSSxPQUFPLEtBQUssTUFBTCxDQUFZLENBQVosRUFBZSxDQUFmLElBQW9CLEdBQXBCLEdBQTBCLEtBQUssTUFBTCxDQUFZLENBQVosRUFBZSxDQUFmLENBQTFCLEdBQThDLEdBQXpEO0FBQ0EsVUFBUSxtQkFBbUIsS0FBbkIsQ0FBUjtBQUNBLFVBQVEsS0FBUjtBQUNBLE1BQUksU0FBUyxpREFBYjtBQUNBLE1BQUksUUFBUSxZQUFZLEtBQXhCO0FBQ0EsU0FBTztBQUNMLFNBQUssU0FBUyxJQURUO0FBRUwsVUFBTSxJQUZEO0FBR0wsV0FBTyxTQUFTLFFBQVQsR0FBb0IsSUFBcEIsR0FBMkI7QUFIN0IsR0FBUDtBQUtELENBbEJEOztBQW9CQTtBQUNBLElBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBUyxHQUFULEVBQWM7QUFDaEMsUUFBTSxJQUFJLEtBQUosQ0FBVSxRQUFWLEtBQXVCLENBQUMsRUFBRCxDQUE3QjtBQUNBLFFBQU0sSUFBSSxDQUFKLEVBQU8sT0FBUCxDQUFlLFNBQWYsRUFBMEIsRUFBMUIsQ0FBTjtBQUNBO0FBQ0EsUUFBTSxXQUFXLEdBQVgsQ0FBTjtBQUNBLFNBQU8sR0FBUDtBQUNELENBTkQ7QUFPQSxPQUFPLE9BQVAsR0FBaUIsV0FBakI7O0FBRUE7Ozs7O0FDcENBLElBQU0sT0FBTyxRQUFRLG9CQUFSLENBQWI7QUFDQSxJQUFNLGlCQUFpQixRQUFRLDhCQUFSLENBQXZCO0FBQ0EsSUFBTSxjQUFjLFFBQVEsU0FBUixDQUFwQjtBQUNBLElBQU0sWUFBWSxJQUFJLE1BQUosQ0FBVyxNQUFNLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsS0FBSyxLQUF4QixFQUErQixJQUEvQixDQUFvQyxHQUFwQyxDQUFOLEdBQWlELGVBQTVELEVBQTZFLEdBQTdFLENBQWxCOztBQUVBLElBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBUyxDQUFULEVBQVksSUFBWixFQUFrQixPQUFsQixFQUEyQjtBQUM3QztBQUNBLE1BQUksVUFBVSxlQUFlLEdBQWYsRUFBb0IsR0FBcEIsRUFBeUIsSUFBekIsQ0FBZDtBQUNBLFVBQVEsT0FBUixDQUFnQixVQUFTLENBQVQsRUFBWTtBQUMxQixRQUFJLEVBQUUsS0FBRixDQUFRLFNBQVIsQ0FBSixFQUF3QjtBQUN0QixRQUFFLE1BQUYsR0FBVyxFQUFFLE1BQUYsSUFBWSxFQUF2QjtBQUNBLFVBQUksUUFBUSxNQUFSLEtBQW1CLEtBQXZCLEVBQThCO0FBQzVCLFVBQUUsTUFBRixDQUFTLElBQVQsQ0FBYyxZQUFZLENBQVosQ0FBZDtBQUNEO0FBQ0QsYUFBTyxLQUFLLE9BQUwsQ0FBYSxDQUFiLEVBQWdCLEVBQWhCLENBQVA7QUFDRDtBQUNGLEdBUkQ7O0FBVUE7QUFDQSxVQUFRLE9BQVIsQ0FBZ0IsVUFBUyxDQUFULEVBQVk7QUFDMUIsUUFBSSxFQUFFLEtBQUYsQ0FBUSx5QkFBUixNQUF1QyxJQUEzQyxFQUFpRDtBQUMvQyxVQUFJLE9BQU8sQ0FBQyxFQUFFLEtBQUYsQ0FBUSxnQkFBUixLQUE2QixFQUE5QixFQUFrQyxDQUFsQyxLQUF3QyxFQUFuRDtBQUNBLGFBQU8sS0FBSyxXQUFMLEVBQVA7QUFDQSxVQUFJLFFBQVEsS0FBSyxVQUFMLENBQWdCLElBQWhCLE1BQTBCLFNBQWxDLElBQStDLEVBQUUsUUFBUSxTQUFSLEtBQXNCLFNBQXRCLElBQW1DLFFBQVEsU0FBUixLQUFzQixJQUEzRCxDQUFuRCxFQUFxSDtBQUNuSCxVQUFFLFNBQUYsR0FBYyxFQUFFLFNBQUYsSUFBZSxFQUE3QjtBQUNBLFVBQUUsU0FBRixDQUFZLElBQVosSUFBb0IsQ0FBQyxFQUFFLEtBQUYsQ0FBUSx5QkFBUixLQUFzQyxFQUF2QyxFQUEyQyxDQUEzQyxDQUFwQjtBQUNBLGVBQU8sS0FBSyxPQUFMLENBQWEsQ0FBYixFQUFnQixFQUFoQixDQUFQO0FBQ0Q7QUFDRjtBQUNGLEdBVkQ7QUFXQSxTQUFPLElBQVA7QUFDRCxDQTFCRDtBQTJCQSxPQUFPLE9BQVAsR0FBaUIsV0FBakI7Ozs7O0FDaENBO0FBQ0EsSUFBTSxRQUFRO0FBQ1osV0FBUyxRQUFRLFdBQVIsQ0FERztBQUVaLFFBQU0sUUFBUSxRQUFSLENBRk07QUFHWixTQUFPLFFBQVEsU0FBUixDQUhLO0FBSVosU0FBTyxRQUFRLFNBQVIsQ0FKSztBQUtaO0FBQ0EsZ0JBQWMsUUFBUSxZQUFSLEVBQXNCO0FBTnhCLENBQWQ7QUFRQSxJQUFNLGNBQWMsa0NBQXBCOztBQUVBLElBQU0sZUFBZSxTQUFmLFlBQWUsQ0FBUyxPQUFULEVBQWtCLElBQWxCLEVBQXdCLENBQXhCLEVBQTJCLE9BQTNCLEVBQW9DO0FBQ3ZEO0FBQ0EsU0FBTyxNQUFNLEtBQU4sQ0FBWSxPQUFaLEVBQXFCLElBQXJCLENBQVA7QUFDQTtBQUNBLFNBQU8sTUFBTSxJQUFOLENBQVcsT0FBWCxFQUFvQixJQUFwQixDQUFQO0FBQ0E7QUFDQSxTQUFPLE1BQU0sS0FBTixDQUFZLE9BQVosRUFBcUIsSUFBckIsRUFBMkIsT0FBM0IsQ0FBUDtBQUNBO0FBQ0EsU0FBTyxNQUFNLFlBQU4sQ0FBbUIsT0FBbkIsRUFBNEIsSUFBNUIsQ0FBUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQU8sT0FBUDtBQUNELENBYkQ7O0FBZUEsSUFBTSxlQUFlLFNBQWYsWUFBZSxDQUFTLENBQVQsRUFBWSxJQUFaLEVBQWtCLE9BQWxCLEVBQTJCO0FBQzlDLE1BQUksUUFBUSxLQUFLLEtBQUwsQ0FBVyxXQUFYLENBQVosQ0FEOEMsQ0FDVDtBQUNyQyxNQUFJLFdBQVcsRUFBZjtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEtBQUssQ0FBdkMsRUFBMEM7QUFDeEMsUUFBSSxRQUFRLE1BQU0sSUFBSSxDQUFWLEtBQWdCLEVBQTVCO0FBQ0EsUUFBSSxNQUFNLE1BQU0sQ0FBTixLQUFZLEVBQXRCO0FBQ0EsUUFBSSxVQUFVO0FBQ1osYUFBTyxFQURLO0FBRVosYUFBTztBQUZLLEtBQWQ7QUFJQSxjQUFVLE1BQU0sT0FBTixDQUFjLE9BQWQsRUFBdUIsS0FBdkIsQ0FBVjtBQUNBLGNBQVUsYUFBYSxPQUFiLEVBQXNCLEdBQXRCLEVBQTJCLENBQTNCLEVBQThCLE9BQTlCLENBQVY7QUFDQSxhQUFTLElBQVQsQ0FBYyxPQUFkO0FBQ0Q7QUFDRCxTQUFPLFFBQVA7QUFDRCxDQWZEOztBQWlCQSxPQUFPLE9BQVAsR0FBaUIsWUFBakI7Ozs7O0FDM0NBLElBQU0sV0FBVyxhQUFqQjtBQUNBLElBQU0sYUFBYSxnQkFBbkI7QUFDQSxJQUFNLGFBQWEsaUJBQW5CO0FBQ0EsSUFBTSxXQUFXLFFBQWpCO0FBQ0EsSUFBTSxZQUFZLFFBQVEsYUFBUixFQUF1QixTQUF6Qzs7QUFFQTtBQUNBLElBQU0sU0FBUyxTQUFULE1BQVMsQ0FBUyxJQUFULEVBQWU7QUFDNUIsU0FBTyxTQUFTLElBQVQsQ0FBYyxJQUFkLEtBQXVCLFdBQVcsSUFBWCxDQUFnQixJQUFoQixDQUF2QixJQUFnRCxXQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBdkQ7QUFDRCxDQUZEOztBQUlBO0FBQ0EsSUFBTSxZQUFZLFNBQVosU0FBWSxDQUFTLElBQVQsRUFBZTtBQUMvQixNQUFJLFNBQVMsQ0FBYjtBQUNBLFNBQU8sS0FBSyxNQUFMLENBQVk7QUFBQSxXQUFLLENBQUw7QUFBQSxHQUFaLENBQVA7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxNQUF6QixFQUFpQyxHQUFqQyxFQUFzQztBQUNwQyxRQUFJLE9BQU8sS0FBSyxDQUFMLENBQVg7QUFDQTtBQUNBLFFBQUksS0FBSyxLQUFMLENBQVcsVUFBWCxDQUFKLEVBQTRCO0FBQzFCLGFBQU8sS0FBSyxPQUFMLENBQWEsT0FBYixFQUFzQixTQUFTLElBQS9CLENBQVA7QUFDQSxhQUFPLE9BQU8sSUFBZDtBQUNBLGdCQUFVLENBQVY7QUFDRCxLQUpELE1BSU8sSUFBSSxLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQUosRUFBMEI7QUFDL0IsZUFBUyxDQUFUO0FBQ0EsYUFBTyxLQUFLLE9BQUwsQ0FBYSxRQUFiLEVBQXVCLEVBQXZCLENBQVA7QUFDRDtBQUNELFNBQUssQ0FBTCxJQUFVLFVBQVUsSUFBVixDQUFWO0FBQ0Q7QUFDRCxTQUFPLElBQVA7QUFDRCxDQWpCRDs7QUFtQkEsSUFBTSxXQUFXLFNBQVgsUUFBVyxDQUFTLEtBQVQsRUFBZ0IsQ0FBaEIsRUFBbUI7QUFDbEMsTUFBSSxNQUFNLEVBQVY7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUNyQyxRQUFJLE9BQU8sTUFBTSxDQUFOLENBQVAsQ0FBSixFQUFzQjtBQUNwQixVQUFJLElBQUosQ0FBUyxNQUFNLENBQU4sQ0FBVDtBQUNELEtBRkQsTUFFTztBQUNMO0FBQ0Q7QUFDRjtBQUNELFFBQU0sSUFBSSxNQUFKLENBQVc7QUFBQSxXQUFLLEtBQUssU0FBUyxJQUFULENBQWMsQ0FBZCxDQUFWO0FBQUEsR0FBWCxDQUFOO0FBQ0EsUUFBTSxVQUFVLEdBQVYsQ0FBTjtBQUNBLFNBQU8sR0FBUDtBQUNELENBWkQ7O0FBY0EsSUFBTSxZQUFZLFNBQVosU0FBWSxDQUFTLENBQVQsRUFBWSxJQUFaLEVBQWtCO0FBQ2xDLE1BQUksUUFBUSxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQVo7QUFDQSxVQUFRLE1BQU0sTUFBTixDQUFhO0FBQUEsV0FBSyxTQUFTLElBQVQsQ0FBYyxDQUFkLENBQUw7QUFBQSxHQUFiLENBQVI7QUFDQSxNQUFJLFFBQVEsRUFBWjtBQUNBLE1BQUksVUFBVSxFQUFkO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsR0FBbEMsRUFBdUM7QUFDckMsUUFBSSxPQUFPLE1BQU0sQ0FBTixDQUFQLEtBQW9CLE1BQU0sSUFBSSxDQUFWLENBQXBCLElBQW9DLE9BQU8sTUFBTSxJQUFJLENBQVYsQ0FBUCxDQUF4QyxFQUE4RDtBQUM1RCxVQUFJLE1BQU0sU0FBUyxLQUFULEVBQWdCLENBQWhCLENBQVY7QUFDQSxVQUFJLElBQUksTUFBSixHQUFhLENBQWpCLEVBQW9CO0FBQ2xCLGNBQU0sSUFBTixDQUFXLEdBQVg7QUFDQSxhQUFLLElBQUksTUFBVDtBQUNEO0FBQ0YsS0FORCxNQU1PO0FBQ0wsY0FBUSxJQUFSLENBQWEsTUFBTSxDQUFOLENBQWI7QUFDRDtBQUNGO0FBQ0QsTUFBSSxNQUFNLE1BQU4sR0FBZSxDQUFuQixFQUFzQjtBQUNwQixNQUFFLEtBQUYsR0FBVSxLQUFWO0FBQ0Q7QUFDRCxTQUFPLFFBQVEsSUFBUixDQUFhLElBQWIsQ0FBUDtBQUNELENBcEJEO0FBcUJBLE9BQU8sT0FBUCxHQUFpQixTQUFqQjs7Ozs7QUNqRUE7QUFDQSxJQUFNLGFBQWEsU0FBYixVQUFhLENBQVMsR0FBVCxFQUFjO0FBQy9CLE1BQUksUUFBUSxFQUFaO0FBQ0EsTUFBSSxVQUFVLEVBQWQ7QUFDQSxNQUFJLE9BQU8sSUFBSSxJQUFKLElBQVksRUFBdkI7QUFDQTtBQUNBLFNBQU8sS0FBSyxPQUFMLENBQWEsMEJBQWIsRUFBeUMsVUFBQyxDQUFELEVBQUksQ0FBSixFQUFVO0FBQ3hELFVBQU0sSUFBTixDQUFXLENBQVg7QUFDQSxZQUFRLElBQVIsQ0FBYSxDQUFiO0FBQ0EsV0FBTyxDQUFQO0FBQ0QsR0FKTSxDQUFQO0FBS0E7QUFDQSxTQUFPLEtBQUssT0FBTCxDQUFhLDBCQUFiLEVBQXlDLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBVTtBQUN4RCxVQUFNLElBQU4sQ0FBVyxDQUFYO0FBQ0EsV0FBTyxDQUFQO0FBQ0QsR0FITSxDQUFQO0FBSUE7QUFDQSxTQUFPLEtBQUssT0FBTCxDQUFhLG9CQUFiLEVBQW1DLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBVTtBQUNsRCxZQUFRLElBQVIsQ0FBYSxDQUFiO0FBQ0EsV0FBTyxDQUFQO0FBQ0QsR0FITSxDQUFQOztBQUtBO0FBQ0EsTUFBSSxJQUFKLEdBQVcsSUFBWDtBQUNBLE1BQUksR0FBSixHQUFVLEVBQVY7QUFDQSxNQUFJLE1BQU0sTUFBTixHQUFlLENBQW5CLEVBQXNCO0FBQ3BCLFFBQUksR0FBSixDQUFRLElBQVIsR0FBZSxLQUFmO0FBQ0Q7QUFDRCxNQUFJLFFBQVEsTUFBUixHQUFpQixDQUFyQixFQUF3QjtBQUN0QixRQUFJLEdBQUosQ0FBUSxNQUFSLEdBQWlCLE9BQWpCO0FBQ0Q7QUFDRCxTQUFPLEdBQVA7QUFDRCxDQS9CRDtBQWdDQSxPQUFPLE9BQVAsR0FBaUIsVUFBakI7Ozs7O0FDbENBLElBQU0sVUFBVSxRQUFRLHNCQUFSLENBQWhCO0FBQ0EsSUFBTSxhQUFhLFFBQVEsU0FBUixDQUFuQjtBQUNBLElBQU0sV0FBVyxRQUFRLGNBQVIsQ0FBakI7QUFDQSxJQUFNLFlBQVksUUFBUSxhQUFSLENBQWxCO0FBQ0EsSUFBTSxpQkFBaUIsUUFBUSxtQkFBUixDQUF2QjtBQUNBLElBQU0sT0FBTyxRQUFRLG9CQUFSLENBQWI7QUFDQSxJQUFNLFVBQVUsSUFBSSxNQUFKLENBQVcsY0FBYyxLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsR0FBckIsQ0FBZCxHQUEwQyx5QkFBckQsRUFBZ0YsSUFBaEYsQ0FBaEI7O0FBRUE7QUFDQSxJQUFNLGdCQUFnQixTQUFoQixhQUFnQixDQUFTLElBQVQsRUFBZTtBQUNuQztBQUNBLFNBQU8sS0FBSyxPQUFMLENBQWEsT0FBYixFQUFzQixFQUF0QixDQUFQO0FBQ0E7QUFDQSxTQUFPLEtBQUssT0FBTCxDQUFhLG1DQUFiLEVBQWtELE1BQWxELENBQVA7QUFDQTtBQUNBLFNBQU8sS0FBSyxPQUFMLENBQWEsK0NBQWIsRUFBOEQsSUFBOUQsQ0FBUDtBQUNBO0FBQ0EsU0FBTyxLQUFLLE9BQUwsQ0FBYSwyQ0FBYixFQUEwRCxNQUExRCxDQUFQO0FBQ0E7QUFDQSxTQUFPLEtBQUssT0FBTCxDQUFhLDBFQUFiLEVBQXlGLElBQXpGLENBQVA7QUFDQSxTQUFPLElBQVA7QUFDRCxDQVpEO0FBYUE7O0FBRUEsU0FBUyxXQUFULENBQXFCLElBQXJCLEVBQTJCO0FBQ3pCO0FBQ0EsU0FBTyxjQUFjLElBQWQsQ0FBUDtBQUNBO0FBQ0EsTUFBSSxLQUFLLEtBQUwsQ0FBVyx3QkFBWCxDQUFKLEVBQTBDO0FBQ3hDLFdBQU8sSUFBUDtBQUNEO0FBQ0QsU0FBTyxRQUFRLGVBQVIsQ0FBd0IsSUFBeEIsQ0FBUDtBQUNBLFNBQU8sSUFBUDtBQUNEOztBQUVELFNBQVMsU0FBVCxDQUFtQixJQUFuQixFQUF5QjtBQUN2QixNQUFJLE1BQU07QUFDUixVQUFNLFlBQVksSUFBWjtBQURFLEdBQVY7QUFHQTtBQUNBLE1BQUksUUFBUSxXQUFXLElBQVgsQ0FBWjtBQUNBLE1BQUksS0FBSixFQUFXO0FBQ1QsUUFBSSxLQUFKLEdBQVksS0FBWjtBQUNEO0FBQ0Q7QUFDQSxRQUFNLFNBQVMsR0FBVCxDQUFOO0FBQ0E7QUFDQSxRQUFNLFVBQVUsR0FBVixDQUFOO0FBQ0EsU0FBTyxHQUFQO0FBQ0Q7O0FBRUQsSUFBTSxpQkFBaUIsU0FBakIsY0FBaUIsQ0FBUyxDQUFULEVBQVksSUFBWixFQUFrQjtBQUN2QyxNQUFJLFlBQVksZUFBZSxJQUFmLENBQWhCO0FBQ0EsY0FBWSxVQUFVLEdBQVYsQ0FBYyxTQUFkLENBQVo7QUFDQSxJQUFFLFNBQUYsR0FBYyxTQUFkO0FBQ0EsU0FBTyxDQUFQO0FBQ0QsQ0FMRDs7QUFPQSxPQUFPLE9BQVAsR0FBaUI7QUFDZixnQkFBYyxjQURDO0FBRWYsYUFBVztBQUZJLENBQWpCOzs7OztBQzFEQSxJQUFNLFVBQVUsUUFBUSxzQkFBUixDQUFoQjtBQUNBLElBQU0sZUFBZSxvT0FBckI7QUFDQSxJQUFNLGdCQUFnQiw0RUFBdEI7QUFDQSxJQUFNLFdBQVcsMENBQWpCLEMsQ0FBNkQ7O0FBRTdELElBQU0saUJBQWlCLFNBQWpCLGNBQWlCLENBQVMsS0FBVCxFQUFnQixHQUFoQixFQUFxQjtBQUMxQyxNQUFJLE9BQUosQ0FBWSxhQUFaLEVBQTJCLFVBQVMsR0FBVCxFQUFjLFFBQWQsRUFBd0IsSUFBeEIsRUFBOEIsSUFBOUIsRUFBb0M7QUFDN0QsV0FBTyxRQUFRLEVBQWY7QUFDQSxVQUFNLElBQU4sQ0FBVztBQUNULFlBQU0sVUFERztBQUVULFlBQU0sV0FBVyxJQUZSO0FBR1QsWUFBTSxLQUFLLElBQUw7QUFIRyxLQUFYO0FBS0EsV0FBTyxJQUFQO0FBQ0QsR0FSRDtBQVNBLFNBQU8sS0FBUDtBQUNELENBWEQ7O0FBYUEsSUFBTSxpQkFBaUIsU0FBakIsY0FBaUIsQ0FBUyxLQUFULEVBQWdCLEdBQWhCLEVBQXFCO0FBQzFDO0FBQ0EsTUFBSSxPQUFKLENBQVksUUFBWixFQUFzQixVQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsVUFBZixFQUEyQjtBQUMvQyxRQUFJLElBQUosRUFDRSxHQURGO0FBRUEsUUFBSSxFQUFFLEtBQUYsQ0FBUSxJQUFSLENBQUosRUFBbUI7QUFDakI7QUFDQSxVQUFJLEVBQUUsT0FBRixDQUFVLCtCQUFWLEVBQTJDLE1BQTNDLENBQUosQ0FGaUIsQ0FFdUM7QUFDeEQsYUFBTyxFQUFFLE9BQUYsQ0FBVSxxQkFBVixFQUFpQyxJQUFqQyxDQUFQLENBSGlCLENBRzhCO0FBQy9DLFlBQU0sRUFBRSxPQUFGLENBQVUsWUFBVixFQUF3QixFQUF4QixDQUFOO0FBQ0E7QUFDQSxVQUFJLENBQUMsR0FBRCxJQUFRLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBWixFQUErQjtBQUM3QixlQUFPLEtBQUssT0FBTCxDQUFhLEtBQWIsRUFBb0IsRUFBcEIsQ0FBUDtBQUNBLGNBQU0sSUFBTjtBQUNEO0FBQ0YsS0FWRCxNQVVPO0FBQ0w7QUFDQSxhQUFPLEVBQUUsT0FBRixDQUFVLCtCQUFWLEVBQTJDLElBQTNDLENBQVAsQ0FGSyxDQUVvRDtBQUMxRDtBQUNEO0FBQ0EsUUFBSSxLQUFLLEtBQUwsQ0FBVyxZQUFYLENBQUosRUFBOEI7QUFDNUIsYUFBTyxDQUFQO0FBQ0Q7QUFDRDtBQUNBLFFBQUksS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFKLEVBQXVCO0FBQ3JCLGFBQU8sQ0FBUDtBQUNEO0FBQ0Q7QUFDQSxXQUFPLEtBQUssT0FBTCxDQUFhLGNBQWIsRUFBNkIsRUFBN0IsQ0FBUDtBQUNBLFFBQUksTUFBTTtBQUNSLFlBQU0sUUFBUSxVQUFSLENBQW1CLElBQW5CLENBREU7QUFFUixZQUFNLE9BQU87QUFGTCxLQUFWO0FBSUE7QUFDQSxRQUFJLFVBQUosRUFBZ0I7QUFDZCxVQUFJLElBQUosSUFBWSxVQUFaO0FBQ0Q7QUFDRCxVQUFNLElBQU4sQ0FBVyxHQUFYO0FBQ0EsV0FBTyxDQUFQO0FBQ0QsR0FyQ0Q7QUFzQ0EsU0FBTyxLQUFQO0FBQ0QsQ0F6Q0Q7O0FBMkNBO0FBQ0EsSUFBTSxjQUFjLFNBQWQsV0FBYyxDQUFTLEdBQVQsRUFBYztBQUNoQyxNQUFJLFFBQVEsRUFBWjtBQUNBO0FBQ0EsVUFBUSxlQUFlLEtBQWYsRUFBc0IsR0FBdEIsQ0FBUjtBQUNBO0FBQ0EsVUFBUSxlQUFlLEtBQWYsRUFBc0IsR0FBdEIsQ0FBUjs7QUFFQSxNQUFJLE1BQU0sTUFBTixLQUFpQixDQUFyQixFQUF3QjtBQUN0QixXQUFPLFNBQVA7QUFDRDtBQUNELFNBQU8sS0FBUDtBQUNELENBWEQ7QUFZQSxPQUFPLE9BQVAsR0FBaUIsV0FBakI7OztBQzFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUNBLElBQU0sZ0JBQWdCLFFBQVEsNkJBQVIsQ0FBdEI7QUFDQSxJQUFNLGFBQWEsSUFBSSxNQUFKLENBQVcsV0FBVyxjQUFjLElBQWQsQ0FBbUIsR0FBbkIsQ0FBWCxHQUFxQyxXQUFoRCxFQUE2RCxHQUE3RCxDQUFuQjtBQUNBLElBQU0sY0FBYyxJQUFJLE1BQUosQ0FBVyxrQkFBWCxFQUErQixHQUEvQixDQUFwQjtBQUNBLElBQU0sY0FBYyxJQUFJLE1BQUosQ0FBVyxnQkFBWCxDQUFwQjtBQUNBLElBQU0sVUFBVSxJQUFJLE1BQUosQ0FBVyxZQUFYLEVBQXlCLEdBQXpCLENBQWhCOztBQUVBO0FBQ0EsSUFBTSxVQUFVLFNBQVYsT0FBVSxDQUFTLEdBQVQsRUFBYztBQUM1QixNQUFJLE1BQU0sRUFBVjtBQUNBLE1BQUksT0FBSixDQUFZLFVBQVMsQ0FBVCxFQUFZO0FBQ3RCLFVBQU0sSUFBSSxNQUFKLENBQVcsQ0FBWCxDQUFOO0FBQ0QsR0FGRDtBQUdBLFNBQU8sR0FBUDtBQUNELENBTkQ7O0FBUUEsSUFBTSxlQUFlLFNBQWYsWUFBZSxDQUFTLElBQVQsRUFBZTtBQUNsQztBQUNBLE1BQUksU0FBUyxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQWI7QUFDQSxXQUFTLE9BQU8sTUFBUCxDQUFjO0FBQUEsV0FBSyxFQUFFLEtBQUYsQ0FBUSxJQUFSLENBQUw7QUFBQSxHQUFkLENBQVQ7QUFDQTtBQUNBLFdBQVMsT0FBTyxHQUFQLENBQVcsVUFBUyxHQUFULEVBQWM7QUFDaEMsV0FBTyxJQUFJLEtBQUosQ0FBVSx3QkFBVixDQUFQO0FBQ0QsR0FGUSxDQUFUO0FBR0EsU0FBTyxRQUFRLE1BQVIsQ0FBUDtBQUNELENBVEQ7O0FBV0E7QUFDQSxJQUFNLGFBQWEsU0FBYixVQUFhLENBQVMsR0FBVCxFQUFjO0FBQy9CLFFBQU0sT0FBTyxFQUFiO0FBQ0EsTUFBTSxPQUFPLElBQUksS0FBSixDQUFVLE1BQVYsS0FBcUIsRUFBbEM7QUFDQSxNQUFNLFNBQVMsSUFBSSxLQUFKLENBQVUsTUFBVixLQUFxQixFQUFwQztBQUNBLE1BQUksS0FBSyxNQUFMLEdBQWMsT0FBTyxNQUF6QixFQUFpQztBQUMvQixXQUFPLEtBQVA7QUFDRDtBQUNEO0FBQ0EsTUFBTSxTQUFTLElBQUksS0FBSixDQUFVLElBQVYsQ0FBZjtBQUNBLE1BQUksVUFBVSxPQUFPLE1BQVAsR0FBZ0IsQ0FBaEIsS0FBc0IsQ0FBaEMsSUFBcUMsSUFBSSxNQUFKLEdBQWEsR0FBdEQsRUFBMkQ7QUFDekQsV0FBTyxLQUFQO0FBQ0Q7QUFDRCxTQUFPLElBQVA7QUFDRCxDQWJEOztBQWVBLElBQU0sa0JBQWtCLFNBQWxCLGVBQWtCLENBQVMsSUFBVCxFQUFlO0FBQ3JDLE1BQUksWUFBWSxFQUFoQjtBQUNBO0FBQ0EsTUFBSSxTQUFTLEVBQWI7QUFDQTtBQUNBLE1BQUksQ0FBQyxJQUFELElBQVMsT0FBTyxJQUFQLEtBQWdCLFFBQXpCLElBQXFDLENBQUMsS0FBSyxLQUFMLENBQVcsSUFBWCxDQUExQyxFQUE0RDtBQUMxRCxXQUFPLFNBQVA7QUFDRDtBQUNEO0FBQ0E7QUFDQTtBQUNBLE1BQUksU0FBUyxhQUFhLElBQWIsQ0FBYjtBQUNBO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE9BQU8sTUFBM0IsRUFBbUMsR0FBbkMsRUFBd0M7QUFDdEMsUUFBSSxJQUFJLE9BQU8sQ0FBUCxDQUFSO0FBQ0EsUUFBSSxDQUFDLENBQUQsSUFBTSxNQUFNLEVBQWhCLEVBQW9CO0FBQ2xCO0FBQ0Q7QUFDRDtBQUNBLFFBQUksQ0FBQyxFQUFFLEtBQUYsQ0FBUSxJQUFSLENBQUwsRUFBb0I7QUFDbEI7QUFDQSxVQUFJLE9BQU8sT0FBTyxNQUFQLEdBQWdCLENBQXZCLENBQUosRUFBK0I7QUFDN0IsZUFBTyxPQUFPLE1BQVAsR0FBZ0IsQ0FBdkIsS0FBNkIsQ0FBN0I7QUFDQTtBQUNELE9BSEQsTUFHTyxJQUFJLE9BQU8sSUFBSSxDQUFYLENBQUosRUFBbUI7QUFDeEI7QUFDQSxlQUFPLElBQUksQ0FBWCxJQUFnQixJQUFJLE9BQU8sSUFBSSxDQUFYLENBQXBCO0FBQ0E7QUFDRDtBQUNGO0FBQ0QsV0FBTyxJQUFQLENBQVksQ0FBWjtBQUNEOztBQUVEO0FBQ0EsTUFBTSxhQUFhLFNBQWIsVUFBYSxDQUFTLEdBQVQsRUFBYztBQUMvQixRQUFJLElBQUksS0FBSixDQUFVLFVBQVYsS0FBeUIsSUFBSSxLQUFKLENBQVUsV0FBVixDQUF6QixJQUFtRCxJQUFJLEtBQUosQ0FBVSxXQUFWLENBQXZELEVBQStFO0FBQzdFLGFBQU8sS0FBUDtBQUNEO0FBQ0Q7QUFDQSxRQUFJLFFBQVEsSUFBUixDQUFhLEdBQWIsTUFBc0IsS0FBMUIsRUFBaUM7QUFDL0IsYUFBTyxLQUFQO0FBQ0Q7QUFDRCxRQUFJLENBQUMsV0FBVyxHQUFYLENBQUwsRUFBc0I7QUFDcEIsYUFBTyxLQUFQO0FBQ0Q7QUFDRCxXQUFPLElBQVA7QUFDRCxHQVpEOztBQWNBO0FBQ0EsT0FBSyxJQUFJLEtBQUksQ0FBYixFQUFnQixLQUFJLE9BQU8sTUFBM0IsRUFBbUMsSUFBbkMsRUFBd0M7QUFDdEM7QUFDQSxRQUFJLE9BQU8sS0FBSSxDQUFYLEtBQWlCLENBQUMsV0FBVyxPQUFPLEVBQVAsQ0FBWCxDQUF0QixFQUE2QztBQUMzQyxhQUFPLEtBQUksQ0FBWCxJQUFnQixPQUFPLEVBQVAsS0FBYSxPQUFPLEtBQUksQ0FBWCxLQUFpQixFQUE5QixDQUFoQixDQUQyQyxDQUNRO0FBQ3BELEtBRkQsTUFFTyxJQUFJLE9BQU8sRUFBUCxLQUFhLE9BQU8sRUFBUCxFQUFVLE1BQVYsR0FBbUIsQ0FBcEMsRUFBdUM7QUFDNUM7QUFDQSxnQkFBVSxJQUFWLENBQWUsT0FBTyxFQUFQLENBQWY7QUFDQSxhQUFPLEVBQVAsSUFBWSxFQUFaO0FBQ0Q7QUFDRjtBQUNEO0FBQ0EsTUFBSSxVQUFVLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDMUIsV0FBTyxDQUFDLElBQUQsQ0FBUDtBQUNEO0FBQ0QsU0FBTyxTQUFQO0FBQ0QsQ0FoRUQ7O0FBa0VBLE9BQU8sT0FBUCxHQUFpQixlQUFqQjtBQUNBOzs7OztBQ3BIQSxJQUFNLFVBQVU7QUFDZCxRQUFNLGNBQUMsSUFBRCxFQUFVO0FBQ2QsV0FBTyxFQUFQO0FBQ0QsR0FIYTtBQUlkLGdCQUFjLG1CQUFDLElBQUQsRUFBVTtBQUN0QixXQUFPLEtBQUssT0FBTCxDQUFhLE9BQWIsRUFBc0IsRUFBdEIsQ0FBUDtBQUNBLFdBQU8sS0FBSyxPQUFMLENBQWEsT0FBYixFQUFzQixFQUF0QixDQUFQO0FBQ0EsUUFBSSxNQUFNLEtBQUssS0FBTCxDQUFXLEdBQVgsQ0FBVjtBQUNBLFFBQUksTUFBTSxFQUFWO0FBQ0EsUUFBSSxJQUFJLENBQUosQ0FBSixFQUFZO0FBQUU7QUFDWixhQUFPLElBQUksQ0FBSixDQUFQO0FBQ0EsVUFBSSxJQUFJLENBQUosQ0FBSixFQUFZO0FBQUU7QUFDWixlQUFPLE1BQU0sSUFBSSxDQUFKLENBQWI7QUFDRDtBQUNELFVBQUksSUFBSSxDQUFKLENBQUosRUFBWTtBQUFFO0FBQ1osZUFBTyxNQUFNLElBQUksQ0FBSixDQUFiO0FBQ0Q7QUFDRjtBQUNELFdBQU8sR0FBUDtBQUNEO0FBbkJhLENBQWhCOztBQXNCQTtBQUNBLElBQU0sVUFBVSxTQUFWLE9BQVUsQ0FBUyxJQUFULEVBQWU7QUFDN0IsU0FBTyxLQUFLLE9BQUwsQ0FBYSxPQUFiLEVBQXNCLEVBQXRCLENBQVA7QUFDQSxTQUFPLEtBQUssT0FBTCxDQUFhLE9BQWIsRUFBc0IsRUFBdEIsQ0FBUDtBQUNBLE1BQUksT0FBTyxLQUFLLEtBQUwsQ0FBVyxJQUFYLEVBQWlCLENBQWpCLEtBQXVCLEVBQWxDO0FBQ0EsU0FBTyxLQUFLLFdBQUwsR0FBbUIsSUFBbkIsRUFBUDtBQUNBLFNBQU8sSUFBUDtBQUNELENBTkQ7O0FBUUEsSUFBTSxpQkFBaUIsU0FBakIsY0FBaUIsQ0FBUyxHQUFULEVBQWM7QUFDbkMsTUFBSSxZQUFZLElBQUksSUFBSixDQUFTLEtBQVQsQ0FBZSxrQkFBZixLQUFzQyxFQUF0RDtBQUNBLGNBQVksVUFBVSxHQUFWLENBQWMsVUFBQyxJQUFELEVBQVU7QUFDbEMsV0FBTztBQUNMLFlBQU0sUUFBUSxJQUFSLENBREQ7QUFFTCxZQUFNO0FBRkQsS0FBUDtBQUlELEdBTFcsQ0FBWjtBQU1BO0FBQ0EsWUFBVSxPQUFWLENBQWtCLFVBQUMsQ0FBRCxFQUFPO0FBQ3ZCLFFBQUksUUFBUSxjQUFSLENBQXVCLEVBQUUsSUFBekIsTUFBbUMsSUFBdkMsRUFBNkM7QUFDM0MsVUFBSSxTQUFTLFFBQVEsRUFBRSxJQUFWLEVBQWdCLEVBQUUsSUFBbEIsQ0FBYjtBQUNBLGNBQVEsR0FBUixDQUFZLE1BQVo7QUFDQSxVQUFJLElBQUosR0FBVyxJQUFJLElBQUosQ0FBUyxPQUFULENBQWlCLEVBQUUsSUFBbkIsRUFBeUIsTUFBekIsQ0FBWDtBQUNELEtBSkQsTUFJTztBQUNMO0FBQ0EsVUFBSSxJQUFKLEdBQVcsSUFBSSxJQUFKLENBQVMsT0FBVCxDQUFpQixFQUFFLElBQW5CLEVBQXlCLEVBQXpCLENBQVg7QUFDRDtBQUNGLEdBVEQ7QUFVQSxTQUFPLEdBQVA7QUFDRCxDQXBCRDtBQXFCQSxPQUFPLE9BQVAsR0FBaUIsY0FBakI7Ozs7O0FDcERBO0FBQ0EsSUFBTSxPQUFPO0FBQ1gsUUFBTSxJQURLO0FBRVgsa0JBQWdCLElBRkw7QUFHWCxnQkFBYyxJQUhIO0FBSVgsU0FBTyxJQUpJO0FBS1g7QUFDQSxnQkFBYyxJQU5IO0FBT1gsZ0JBQWMsSUFQSDtBQVFYLHdCQUFzQixJQVJYO0FBU1gseUJBQXVCLElBVFo7QUFVWCw4QkFBNEIsSUFWakI7QUFXWCx3QkFBc0IsSUFYWDtBQVlYLDhCQUE0QixJQVpqQjtBQWFYLHdCQUFzQixJQWJYO0FBY1gsZ0JBQWMsSUFkSDtBQWVYLGNBQVksSUFmRDtBQWdCWCx3QkFBc0IsSUFoQlg7QUFpQlgsaUJBQWUsSUFqQko7QUFrQlgsT0FBSyxJQWxCTTtBQW1CWCxPQUFLLElBbkJNO0FBb0JYLFNBQU8sSUFwQkk7QUFxQlgsYUFBVyxJQXJCQTtBQXNCWCxtQ0FBaUMsSUF0QnRCO0FBdUJYLDZCQUEyQixJQXZCaEI7QUF3QlgsMkJBQXlCLElBeEJkO0FBeUJYLDBDQUF3QyxJQXpCN0I7QUEwQlgsaUJBQWUsSUExQko7QUEyQlgsb0JBQWtCLElBM0JQOztBQThCWCxXQUFTLElBOUJFO0FBK0JYLFdBQVMsSUEvQkU7QUFnQ1gsV0FBUyxJQWhDRTtBQWlDWCxTQUFPO0FBakNJLENBQWI7QUFtQ0EsT0FBTyxPQUFQLEdBQWlCLElBQWpCOzs7OztBQ3BDQSxJQUFNLFVBQVUsUUFBUSxtQkFBUixDQUFoQjtBQUNBLElBQU0sWUFBWSxRQUFRLGFBQVIsRUFBdUIsU0FBekM7O0FBRUEsSUFBTSxZQUFZLG1CQUFsQixDLENBQXVDOztBQUV2QyxJQUFNLGVBQWUsU0FBZixZQUFlLENBQVMsR0FBVCxFQUFjO0FBQ2pDLFFBQU0sVUFBVSxHQUFWLEVBQWUsSUFBZixJQUF1QixFQUE3QjtBQUNBLE1BQUksSUFBSSxLQUFKLENBQVUsSUFBVixDQUFKLEVBQXFCO0FBQ25CLFVBQU0sSUFBSSxPQUFKLENBQVksUUFBWixFQUFzQixFQUF0QixDQUFOLENBRG1CLENBQ2M7QUFDbEM7QUFDRCxTQUFPLEdBQVA7QUFDRCxDQU5EOztBQVFBO0FBQ0EsSUFBTSxjQUFjLFNBQWQsV0FBYyxDQUFTLElBQVQsRUFBZTtBQUNqQyxNQUFJLFdBQVcsRUFBZjtBQUNBLE1BQUksUUFBUSxLQUFLLE9BQUwsQ0FBYSxLQUFiLEVBQW9CLEVBQXBCLEVBQXdCLEtBQXhCLENBQThCLElBQTlCLENBQVo7O0FBRUE7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksTUFBTSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUNyQyxRQUFJLE1BQU0sTUFBTSxDQUFOLENBQVY7QUFDQTtBQUNBLFFBQUksSUFBSSxLQUFKLENBQVUsS0FBVixDQUFKLEVBQXNCO0FBQ3BCLFlBQU0sSUFBSSxPQUFKLENBQVksT0FBWixFQUFxQixFQUFyQixDQUFOO0FBQ0E7QUFDQSxVQUFJLElBQUksS0FBSixDQUFVLFFBQVYsQ0FBSixFQUF5QjtBQUN2QixZQUFJLFFBQVEsSUFBSSxLQUFKLENBQVUsUUFBVixDQUFaO0FBQ0EsbUJBQVcsTUFBTSxHQUFOLENBQVUsWUFBVixDQUFYO0FBQ0QsT0FIRCxNQUdPO0FBQ0w7QUFDQSxjQUFNLGFBQWEsR0FBYixDQUFOO0FBQ0EsWUFBSSxDQUFDLEdBQUwsRUFBVTtBQUNSLGdCQUFNLFNBQVMsU0FBUyxNQUF4QjtBQUNEO0FBQ0QsaUJBQVMsSUFBVCxDQUFjLEdBQWQ7QUFDQSxjQUFNLENBQU4sSUFBVyxJQUFYLENBUEssQ0FPWTtBQUNsQjtBQUNGLEtBZkQsTUFlTyxJQUFJLFNBQVMsTUFBVCxHQUFrQixDQUFsQixJQUF1QixJQUFJLEtBQUosQ0FBVSxLQUFWLENBQTNCLEVBQTZDO0FBQ2xELGNBQVEsTUFBTSxLQUFOLENBQVksQ0FBWixFQUFlLE1BQU0sTUFBckIsQ0FBUjtBQUNBLFlBRmtELENBRTNDO0FBQ1IsS0FITSxNQUdBLElBQUksSUFBSSxLQUFKLENBQVUsTUFBVixDQUFKLEVBQXVCO0FBQzVCLGNBQVEsTUFBTSxLQUFOLENBQVksQ0FBWixFQUFlLE1BQU0sTUFBckIsQ0FBUjtBQUNBLFlBRjRCLENBRXJCO0FBQ1I7QUFDRjtBQUNELFVBQVEsTUFBTSxNQUFOLENBQWE7QUFBQSxXQUFLLENBQUw7QUFBQSxHQUFiLENBQVI7O0FBRUE7QUFDQSxNQUFJLFFBQVEsQ0FBQyxFQUFELENBQVo7QUFDQSxRQUFNLE9BQU4sQ0FBYyxVQUFTLEdBQVQsRUFBYztBQUMxQjtBQUNBLFFBQUksSUFBSSxLQUFKLENBQVUsT0FBVixDQUFKLEVBQXdCO0FBQ3RCO0FBQ0Q7QUFDRDtBQUNBLFFBQUksSUFBSSxLQUFKLENBQVUsT0FBVixDQUFKLEVBQXdCO0FBQ3RCO0FBQ0Q7QUFDRDtBQUNBLFFBQUksSUFBSSxLQUFKLENBQVUsTUFBVixDQUFKLEVBQXVCO0FBQ3JCLFVBQUksTUFBTSxDQUFOLEVBQVMsTUFBVCxHQUFrQixDQUF0QixFQUF5QjtBQUN2QixjQUFNLElBQU4sQ0FBVyxFQUFYO0FBQ0Q7QUFDRDtBQUNEO0FBQ0Q7QUFDQSxRQUFJLElBQUksS0FBSixDQUFVLEtBQVYsQ0FBSixFQUFzQjtBQUNwQixZQUFNLElBQUksT0FBSixDQUFZLE9BQVosRUFBcUIsRUFBckIsQ0FBTjtBQUNBLFlBQU0sYUFBYSxHQUFiLENBQU47QUFDQSxZQUFNLFFBQVEsZUFBUixDQUF3QixHQUF4QixDQUFOO0FBQ0EsWUFBTSxNQUFNLE1BQU4sR0FBZSxDQUFyQixFQUF3QixJQUF4QixDQUE2QixHQUE3QjtBQUNBO0FBQ0Q7QUFDRDtBQUNBLFFBQUksSUFBSSxLQUFKLENBQVUsS0FBVixDQUFKLEVBQXNCO0FBQ3BCLFVBQUksT0FBTyxDQUFDLElBQUksS0FBSixDQUFVLFFBQVYsS0FBdUIsRUFBeEIsRUFBNEIsQ0FBNUIsS0FBa0MsRUFBN0M7QUFDQTtBQUNBLFVBQUksS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFKLEVBQXlCO0FBQ3ZCO0FBQ0EsZUFBTyxhQUFhLElBQWIsQ0FBUDtBQUNEO0FBQ0QsYUFBTyxRQUFRLGVBQVIsQ0FBd0IsSUFBeEIsS0FBaUMsRUFBeEM7QUFDQTtBQUNBLFVBQUksS0FBSyxLQUFMLENBQVcsVUFBWCxDQUFKLEVBQTRCO0FBQzFCLGFBQUssS0FBTCxDQUFXLFdBQVgsRUFBd0IsT0FBeEIsQ0FBZ0MsVUFBUyxDQUFULEVBQVk7QUFDMUMsY0FBSSxRQUFRLGVBQVIsQ0FBd0IsQ0FBeEIsQ0FBSjtBQUNBLGdCQUFNLE1BQU0sTUFBTixHQUFlLENBQXJCLEVBQXdCLElBQXhCLENBQTZCLENBQTdCO0FBQ0QsU0FIRDtBQUlELE9BTEQsTUFLTztBQUNMLGNBQU0sTUFBTSxNQUFOLEdBQWUsQ0FBckIsRUFBd0IsSUFBeEIsQ0FBNkIsSUFBN0I7QUFDRDtBQUNGO0FBQ0YsR0EzQ0Q7QUE0Q0E7QUFDQSxNQUFJLE1BQU0sQ0FBTixLQUFZLE9BQU8sSUFBUCxDQUFZLE1BQU0sQ0FBTixDQUFaLEVBQXNCLE1BQXRCLEtBQWlDLENBQWpELEVBQW9EO0FBQ2xELFVBQU0sS0FBTjtBQUNEO0FBQ0Q7QUFDQSxVQUFRLE1BQU0sR0FBTixDQUFVLGVBQU87QUFDdkIsUUFBSSxNQUFNLEVBQVY7QUFDQSxRQUFJLE9BQUosQ0FBWSxVQUFDLENBQUQsRUFBSSxDQUFKLEVBQVU7QUFDcEIsVUFBSSxPQUFPLFNBQVMsQ0FBVCxLQUFlLFNBQVMsQ0FBbkM7QUFDQSxVQUFJLElBQUosSUFBWSxVQUFVLENBQVYsQ0FBWjtBQUNELEtBSEQ7QUFJQSxXQUFPLEdBQVA7QUFDRCxHQVBPLENBQVI7QUFRQSxTQUFPLEtBQVA7QUFDRCxDQTdGRDs7QUErRkEsSUFBTSxhQUFhLFNBQWIsVUFBYSxDQUFTLENBQVQsRUFBWSxJQUFaLEVBQWtCO0FBQ25DLE1BQUksU0FBUyxLQUFLLEtBQUwsQ0FBVyxTQUFYLEVBQXNCLEVBQXRCLEtBQTZCLEVBQTFDO0FBQ0EsV0FBUyxPQUFPLEdBQVAsQ0FBVyxVQUFTLEdBQVQsRUFBYztBQUNoQyxXQUFPLFlBQVksR0FBWixDQUFQO0FBQ0QsR0FGUSxDQUFUO0FBR0EsTUFBSSxPQUFPLE1BQVAsR0FBZ0IsQ0FBcEIsRUFBdUI7QUFDckIsTUFBRSxNQUFGLEdBQVcsTUFBWDtBQUNEO0FBQ0Q7QUFDQSxTQUFPLEtBQUssT0FBTCxDQUFhLFNBQWIsRUFBd0IsRUFBeEIsQ0FBUDtBQUNBLFNBQU8sSUFBUDtBQUNELENBWEQ7QUFZQSxPQUFPLE9BQVAsR0FBaUIsVUFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXHJcbi8qKlxyXG4gKiBFeHBvc2UgYEVtaXR0ZXJgLlxyXG4gKi9cclxuXHJcbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xyXG4gIG1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxyXG4gKlxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIEVtaXR0ZXIob2JqKSB7XHJcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XHJcbn07XHJcblxyXG4vKipcclxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IG9ialxyXG4gKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAqIEBhcGkgcHJpdmF0ZVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIG1peGluKG9iaikge1xyXG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xyXG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xyXG4gIH1cclxuICByZXR1cm4gb2JqO1xyXG59XHJcblxyXG4vKipcclxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUub24gPVxyXG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcbiAgKHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdKVxyXG4gICAgLnB1c2goZm4pO1xyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxyXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cclxuICogQHJldHVybiB7RW1pdHRlcn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcclxuICBmdW5jdGlvbiBvbigpIHtcclxuICAgIHRoaXMub2ZmKGV2ZW50LCBvbik7XHJcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gIH1cclxuXHJcbiAgb24uZm4gPSBmbjtcclxuICB0aGlzLm9uKGV2ZW50LCBvbik7XHJcbiAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4vKipcclxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcclxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cclxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cclxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG5cclxuICAvLyBhbGxcclxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICB0aGlzLl9jYWxsYmFja3MgPSB7fTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gc3BlY2lmaWMgZXZlbnRcclxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcclxuICBpZiAoIWNhbGxiYWNrcykgcmV0dXJuIHRoaXM7XHJcblxyXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcclxuICBpZiAoMSA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcclxuICB2YXIgY2I7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcclxuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEVtaXQgYGV2ZW50YCB3aXRoIHRoZSBnaXZlbiBhcmdzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtNaXhlZH0gLi4uXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XHJcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcclxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcclxuXHJcbiAgaWYgKGNhbGxiYWNrcykge1xyXG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHJldHVybiB7QXJyYXl9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSB8fCBbXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcclxufTtcclxuIiwiLyoqXG4gKiBqc2hhc2hlcyAtIGh0dHBzOi8vZ2l0aHViLmNvbS9oMm5vbi9qc2hhc2hlc1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIFwiTmV3IEJTRFwiIGxpY2Vuc2VcbiAqXG4gKiBBbGdvcml0aG1zIHNwZWNpZmljYXRpb246XG4gKlxuICogTUQ1IC0gaHR0cDovL3d3dy5pZXRmLm9yZy9yZmMvcmZjMTMyMS50eHRcbiAqIFJJUEVNRC0xNjAgLSBodHRwOi8vaG9tZXMuZXNhdC5rdWxldXZlbi5iZS9+Ym9zc2VsYWUvcmlwZW1kMTYwLmh0bWxcbiAqIFNIQTEgICAtIGh0dHA6Ly9jc3JjLm5pc3QuZ292L3B1YmxpY2F0aW9ucy9maXBzL2ZpcHMxODAtNC9maXBzLTE4MC00LnBkZlxuICogU0hBMjU2IC0gaHR0cDovL2NzcmMubmlzdC5nb3YvcHVibGljYXRpb25zL2ZpcHMvZmlwczE4MC00L2ZpcHMtMTgwLTQucGRmXG4gKiBTSEE1MTIgLSBodHRwOi8vY3NyYy5uaXN0Lmdvdi9wdWJsaWNhdGlvbnMvZmlwcy9maXBzMTgwLTQvZmlwcy0xODAtNC5wZGZcbiAqIEhNQUMgLSBodHRwOi8vd3d3LmlldGYub3JnL3JmYy9yZmMyMTA0LnR4dFxuICovXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBIYXNoZXM7XG5cbiAgZnVuY3Rpb24gdXRmOEVuY29kZShzdHIpIHtcbiAgICB2YXIgeCwgeSwgb3V0cHV0ID0gJycsXG4gICAgICBpID0gLTEsXG4gICAgICBsO1xuXG4gICAgaWYgKHN0ciAmJiBzdHIubGVuZ3RoKSB7XG4gICAgICBsID0gc3RyLmxlbmd0aDtcbiAgICAgIHdoaWxlICgoaSArPSAxKSA8IGwpIHtcbiAgICAgICAgLyogRGVjb2RlIHV0Zi0xNiBzdXJyb2dhdGUgcGFpcnMgKi9cbiAgICAgICAgeCA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgICAgICB5ID0gaSArIDEgPCBsID8gc3RyLmNoYXJDb2RlQXQoaSArIDEpIDogMDtcbiAgICAgICAgaWYgKDB4RDgwMCA8PSB4ICYmIHggPD0gMHhEQkZGICYmIDB4REMwMCA8PSB5ICYmIHkgPD0gMHhERkZGKSB7XG4gICAgICAgICAgeCA9IDB4MTAwMDAgKyAoKHggJiAweDAzRkYpIDw8IDEwKSArICh5ICYgMHgwM0ZGKTtcbiAgICAgICAgICBpICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgLyogRW5jb2RlIG91dHB1dCBhcyB1dGYtOCAqL1xuICAgICAgICBpZiAoeCA8PSAweDdGKSB7XG4gICAgICAgICAgb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoeCk7XG4gICAgICAgIH0gZWxzZSBpZiAoeCA8PSAweDdGRikge1xuICAgICAgICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4QzAgfCAoKHggPj4+IDYpICYgMHgxRiksXG4gICAgICAgICAgICAweDgwIHwgKHggJiAweDNGKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoeCA8PSAweEZGRkYpIHtcbiAgICAgICAgICBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgweEUwIHwgKCh4ID4+PiAxMikgJiAweDBGKSxcbiAgICAgICAgICAgIDB4ODAgfCAoKHggPj4+IDYpICYgMHgzRiksXG4gICAgICAgICAgICAweDgwIHwgKHggJiAweDNGKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoeCA8PSAweDFGRkZGRikge1xuICAgICAgICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RjAgfCAoKHggPj4+IDE4KSAmIDB4MDcpLFxuICAgICAgICAgICAgMHg4MCB8ICgoeCA+Pj4gMTIpICYgMHgzRiksXG4gICAgICAgICAgICAweDgwIHwgKCh4ID4+PiA2KSAmIDB4M0YpLFxuICAgICAgICAgICAgMHg4MCB8ICh4ICYgMHgzRikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICBmdW5jdGlvbiB1dGY4RGVjb2RlKHN0cikge1xuICAgIHZhciBpLCBhYywgYzEsIGMyLCBjMywgYXJyID0gW10sXG4gICAgICBsO1xuICAgIGkgPSBhYyA9IGMxID0gYzIgPSBjMyA9IDA7XG5cbiAgICBpZiAoc3RyICYmIHN0ci5sZW5ndGgpIHtcbiAgICAgIGwgPSBzdHIubGVuZ3RoO1xuICAgICAgc3RyICs9ICcnO1xuXG4gICAgICB3aGlsZSAoaSA8IGwpIHtcbiAgICAgICAgYzEgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgYWMgKz0gMTtcbiAgICAgICAgaWYgKGMxIDwgMTI4KSB7XG4gICAgICAgICAgYXJyW2FjXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYzEpO1xuICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgfSBlbHNlIGlmIChjMSA+IDE5MSAmJiBjMSA8IDIyNCkge1xuICAgICAgICAgIGMyID0gc3RyLmNoYXJDb2RlQXQoaSArIDEpO1xuICAgICAgICAgIGFyclthY10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYzEgJiAzMSkgPDwgNikgfCAoYzIgJiA2MykpO1xuICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjMiA9IHN0ci5jaGFyQ29kZUF0KGkgKyAxKTtcbiAgICAgICAgICBjMyA9IHN0ci5jaGFyQ29kZUF0KGkgKyAyKTtcbiAgICAgICAgICBhcnJbYWNdID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMxICYgMTUpIDw8IDEyKSB8ICgoYzIgJiA2MykgPDwgNikgfCAoYzMgJiA2MykpO1xuICAgICAgICAgIGkgKz0gMztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyLmpvaW4oJycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBpbnRlZ2Vycywgd3JhcHBpbmcgYXQgMl4zMi4gVGhpcyB1c2VzIDE2LWJpdCBvcGVyYXRpb25zIGludGVybmFsbHlcbiAgICogdG8gd29yayBhcm91bmQgYnVncyBpbiBzb21lIEpTIGludGVycHJldGVycy5cbiAgICovXG5cbiAgZnVuY3Rpb24gc2FmZV9hZGQoeCwgeSkge1xuICAgIHZhciBsc3cgPSAoeCAmIDB4RkZGRikgKyAoeSAmIDB4RkZGRiksXG4gICAgICBtc3cgPSAoeCA+PiAxNikgKyAoeSA+PiAxNikgKyAobHN3ID4+IDE2KTtcbiAgICByZXR1cm4gKG1zdyA8PCAxNikgfCAobHN3ICYgMHhGRkZGKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCaXR3aXNlIHJvdGF0ZSBhIDMyLWJpdCBudW1iZXIgdG8gdGhlIGxlZnQuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGJpdF9yb2wobnVtLCBjbnQpIHtcbiAgICByZXR1cm4gKG51bSA8PCBjbnQpIHwgKG51bSA+Pj4gKDMyIC0gY250KSk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBhIHJhdyBzdHJpbmcgdG8gYSBoZXggc3RyaW5nXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJzdHIyaGV4KGlucHV0LCBoZXhjYXNlKSB7XG4gICAgdmFyIGhleF90YWIgPSBoZXhjYXNlID8gJzAxMjM0NTY3ODlBQkNERUYnIDogJzAxMjM0NTY3ODlhYmNkZWYnLFxuICAgICAgb3V0cHV0ID0gJycsXG4gICAgICB4LCBpID0gMCxcbiAgICAgIGwgPSBpbnB1dC5sZW5ndGg7XG4gICAgZm9yICg7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgIHggPSBpbnB1dC5jaGFyQ29kZUF0KGkpO1xuICAgICAgb3V0cHV0ICs9IGhleF90YWIuY2hhckF0KCh4ID4+PiA0KSAmIDB4MEYpICsgaGV4X3RhYi5jaGFyQXQoeCAmIDB4MEYpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgLyoqXG4gICAqIEVuY29kZSBhIHN0cmluZyBhcyB1dGYtMTZcbiAgICovXG5cbiAgZnVuY3Rpb24gc3RyMnJzdHJfdXRmMTZsZShpbnB1dCkge1xuICAgIHZhciBpLCBsID0gaW5wdXQubGVuZ3RoLFxuICAgICAgb3V0cHV0ID0gJyc7XG4gICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoaW5wdXQuY2hhckNvZGVBdChpKSAmIDB4RkYsIChpbnB1dC5jaGFyQ29kZUF0KGkpID4+PiA4KSAmIDB4RkYpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgZnVuY3Rpb24gc3RyMnJzdHJfdXRmMTZiZShpbnB1dCkge1xuICAgIHZhciBpLCBsID0gaW5wdXQubGVuZ3RoLFxuICAgICAgb3V0cHV0ID0gJyc7XG4gICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGlucHV0LmNoYXJDb2RlQXQoaSkgPj4+IDgpICYgMHhGRiwgaW5wdXQuY2hhckNvZGVBdChpKSAmIDB4RkYpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYW4gYXJyYXkgb2YgYmlnLWVuZGlhbiB3b3JkcyB0byBhIHN0cmluZ1xuICAgKi9cblxuICBmdW5jdGlvbiBiaW5iMnJzdHIoaW5wdXQpIHtcbiAgICB2YXIgaSwgbCA9IGlucHV0Lmxlbmd0aCAqIDMyLFxuICAgICAgb3V0cHV0ID0gJyc7XG4gICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gOCkge1xuICAgICAgb3V0cHV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKGlucHV0W2kgPj4gNV0gPj4+ICgyNCAtIGkgJSAzMikpICYgMHhGRik7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBhbiBhcnJheSBvZiBsaXR0bGUtZW5kaWFuIHdvcmRzIHRvIGEgc3RyaW5nXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGJpbmwycnN0cihpbnB1dCkge1xuICAgIHZhciBpLCBsID0gaW5wdXQubGVuZ3RoICogMzIsXG4gICAgICBvdXRwdXQgPSAnJztcbiAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSA4KSB7XG4gICAgICBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoaW5wdXRbaSA+PiA1XSA+Pj4gKGkgJSAzMikpICYgMHhGRik7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBhIHJhdyBzdHJpbmcgdG8gYW4gYXJyYXkgb2YgbGl0dGxlLWVuZGlhbiB3b3Jkc1xuICAgKiBDaGFyYWN0ZXJzID4yNTUgaGF2ZSB0aGVpciBoaWdoLWJ5dGUgc2lsZW50bHkgaWdub3JlZC5cbiAgICovXG5cbiAgZnVuY3Rpb24gcnN0cjJiaW5sKGlucHV0KSB7XG4gICAgdmFyIGksIGwgPSBpbnB1dC5sZW5ndGggKiA4LFxuICAgICAgb3V0cHV0ID0gQXJyYXkoaW5wdXQubGVuZ3RoID4+IDIpLFxuICAgICAgbG8gPSBvdXRwdXQubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsbzsgaSArPSAxKSB7XG4gICAgICBvdXRwdXRbaV0gPSAwO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSA4KSB7XG4gICAgICBvdXRwdXRbaSA+PiA1XSB8PSAoaW5wdXQuY2hhckNvZGVBdChpIC8gOCkgJiAweEZGKSA8PCAoaSAlIDMyKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGEgcmF3IHN0cmluZyB0byBhbiBhcnJheSBvZiBiaWctZW5kaWFuIHdvcmRzXG4gICAqIENoYXJhY3RlcnMgPjI1NSBoYXZlIHRoZWlyIGhpZ2gtYnl0ZSBzaWxlbnRseSBpZ25vcmVkLlxuICAgKi9cblxuICBmdW5jdGlvbiByc3RyMmJpbmIoaW5wdXQpIHtcbiAgICB2YXIgaSwgbCA9IGlucHV0Lmxlbmd0aCAqIDgsXG4gICAgICBvdXRwdXQgPSBBcnJheShpbnB1dC5sZW5ndGggPj4gMiksXG4gICAgICBsbyA9IG91dHB1dC5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxvOyBpICs9IDEpIHtcbiAgICAgIG91dHB1dFtpXSA9IDA7XG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDgpIHtcbiAgICAgIG91dHB1dFtpID4+IDVdIHw9IChpbnB1dC5jaGFyQ29kZUF0KGkgLyA4KSAmIDB4RkYpIDw8ICgyNCAtIGkgJSAzMik7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBhIHJhdyBzdHJpbmcgdG8gYW4gYXJiaXRyYXJ5IHN0cmluZyBlbmNvZGluZ1xuICAgKi9cblxuICBmdW5jdGlvbiByc3RyMmFueShpbnB1dCwgZW5jb2RpbmcpIHtcbiAgICB2YXIgZGl2aXNvciA9IGVuY29kaW5nLmxlbmd0aCxcbiAgICAgIHJlbWFpbmRlcnMgPSBBcnJheSgpLFxuICAgICAgaSwgcSwgeCwgbGQsIHF1b3RpZW50LCBkaXZpZGVuZCwgb3V0cHV0LCBmdWxsX2xlbmd0aDtcblxuICAgIC8qIENvbnZlcnQgdG8gYW4gYXJyYXkgb2YgMTYtYml0IGJpZy1lbmRpYW4gdmFsdWVzLCBmb3JtaW5nIHRoZSBkaXZpZGVuZCAqL1xuICAgIGRpdmlkZW5kID0gQXJyYXkoTWF0aC5jZWlsKGlucHV0Lmxlbmd0aCAvIDIpKTtcbiAgICBsZCA9IGRpdmlkZW5kLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGQ7IGkgKz0gMSkge1xuICAgICAgZGl2aWRlbmRbaV0gPSAoaW5wdXQuY2hhckNvZGVBdChpICogMikgPDwgOCkgfCBpbnB1dC5jaGFyQ29kZUF0KGkgKiAyICsgMSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVwZWF0ZWRseSBwZXJmb3JtIGEgbG9uZyBkaXZpc2lvbi4gVGhlIGJpbmFyeSBhcnJheSBmb3JtcyB0aGUgZGl2aWRlbmQsXG4gICAgICogdGhlIGxlbmd0aCBvZiB0aGUgZW5jb2RpbmcgaXMgdGhlIGRpdmlzb3IuIE9uY2UgY29tcHV0ZWQsIHRoZSBxdW90aWVudFxuICAgICAqIGZvcm1zIHRoZSBkaXZpZGVuZCBmb3IgdGhlIG5leHQgc3RlcC4gV2Ugc3RvcCB3aGVuIHRoZSBkaXZpZGVuZCBpcyB6ZXJIYXNoZXMuXG4gICAgICogQWxsIHJlbWFpbmRlcnMgYXJlIHN0b3JlZCBmb3IgbGF0ZXIgdXNlLlxuICAgICAqL1xuICAgIHdoaWxlIChkaXZpZGVuZC5sZW5ndGggPiAwKSB7XG4gICAgICBxdW90aWVudCA9IEFycmF5KCk7XG4gICAgICB4ID0gMDtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBkaXZpZGVuZC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICB4ID0gKHggPDwgMTYpICsgZGl2aWRlbmRbaV07XG4gICAgICAgIHEgPSBNYXRoLmZsb29yKHggLyBkaXZpc29yKTtcbiAgICAgICAgeCAtPSBxICogZGl2aXNvcjtcbiAgICAgICAgaWYgKHF1b3RpZW50Lmxlbmd0aCA+IDAgfHwgcSA+IDApIHtcbiAgICAgICAgICBxdW90aWVudFtxdW90aWVudC5sZW5ndGhdID0gcTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmVtYWluZGVyc1tyZW1haW5kZXJzLmxlbmd0aF0gPSB4O1xuICAgICAgZGl2aWRlbmQgPSBxdW90aWVudDtcbiAgICB9XG5cbiAgICAvKiBDb252ZXJ0IHRoZSByZW1haW5kZXJzIHRvIHRoZSBvdXRwdXQgc3RyaW5nICovXG4gICAgb3V0cHV0ID0gJyc7XG4gICAgZm9yIChpID0gcmVtYWluZGVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgb3V0cHV0ICs9IGVuY29kaW5nLmNoYXJBdChyZW1haW5kZXJzW2ldKTtcbiAgICB9XG5cbiAgICAvKiBBcHBlbmQgbGVhZGluZyB6ZXJvIGVxdWl2YWxlbnRzICovXG4gICAgZnVsbF9sZW5ndGggPSBNYXRoLmNlaWwoaW5wdXQubGVuZ3RoICogOCAvIChNYXRoLmxvZyhlbmNvZGluZy5sZW5ndGgpIC8gTWF0aC5sb2coMikpKTtcbiAgICBmb3IgKGkgPSBvdXRwdXQubGVuZ3RoOyBpIDwgZnVsbF9sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgb3V0cHV0ID0gZW5jb2RpbmdbMF0gKyBvdXRwdXQ7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBhIHJhdyBzdHJpbmcgdG8gYSBiYXNlLTY0IHN0cmluZ1xuICAgKi9cblxuICBmdW5jdGlvbiByc3RyMmI2NChpbnB1dCwgYjY0cGFkKSB7XG4gICAgdmFyIHRhYiA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJyxcbiAgICAgIG91dHB1dCA9ICcnLFxuICAgICAgbGVuID0gaW5wdXQubGVuZ3RoLFxuICAgICAgaSwgaiwgdHJpcGxldDtcbiAgICBiNjRwYWQgPSBiNjRwYWQgfHwgJz0nO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMykge1xuICAgICAgdHJpcGxldCA9IChpbnB1dC5jaGFyQ29kZUF0KGkpIDw8IDE2KSB8IChpICsgMSA8IGxlbiA/IGlucHV0LmNoYXJDb2RlQXQoaSArIDEpIDw8IDggOiAwKSB8IChpICsgMiA8IGxlbiA/IGlucHV0LmNoYXJDb2RlQXQoaSArIDIpIDogMCk7XG4gICAgICBmb3IgKGogPSAwOyBqIDwgNDsgaiArPSAxKSB7XG4gICAgICAgIGlmIChpICogOCArIGogKiA2ID4gaW5wdXQubGVuZ3RoICogOCkge1xuICAgICAgICAgIG91dHB1dCArPSBiNjRwYWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0cHV0ICs9IHRhYi5jaGFyQXQoKHRyaXBsZXQgPj4+IDYgKiAoMyAtIGopKSAmIDB4M0YpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH1cblxuICBIYXNoZXMgPSB7XG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHZlcnNpb25cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBWRVJTSU9OOiAnMS4wLjYnLFxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgSGFzaGVzXG4gICAgICogQGNsYXNzIEJhc2U2NFxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIEJhc2U2NDogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBwcml2YXRlIHByb3BlcnRpZXNcbiAgICAgIHZhciB0YWIgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLycsXG4gICAgICAgIHBhZCA9ICc9JywgLy8gZGVmYXVsdCBwYWQgYWNjb3JkaW5nIHdpdGggdGhlIFJGQyBzdGFuZGFyZFxuICAgICAgICB1cmwgPSBmYWxzZSwgLy8gVVJMIGVuY29kaW5nIHN1cHBvcnQgQHRvZG9cbiAgICAgICAgdXRmOCA9IHRydWU7IC8vIGJ5IGRlZmF1bHQgZW5hYmxlIFVURi04IHN1cHBvcnQgZW5jb2RpbmdcblxuICAgICAgLy8gcHVibGljIG1ldGhvZCBmb3IgZW5jb2RpbmdcbiAgICAgIHRoaXMuZW5jb2RlID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIGksIGosIHRyaXBsZXQsXG4gICAgICAgICAgb3V0cHV0ID0gJycsXG4gICAgICAgICAgbGVuID0gaW5wdXQubGVuZ3RoO1xuXG4gICAgICAgIHBhZCA9IHBhZCB8fCAnPSc7XG4gICAgICAgIGlucHV0ID0gKHV0ZjgpID8gdXRmOEVuY29kZShpbnB1dCkgOiBpbnB1dDtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDMpIHtcbiAgICAgICAgICB0cmlwbGV0ID0gKGlucHV0LmNoYXJDb2RlQXQoaSkgPDwgMTYpIHwgKGkgKyAxIDwgbGVuID8gaW5wdXQuY2hhckNvZGVBdChpICsgMSkgPDwgOCA6IDApIHwgKGkgKyAyIDwgbGVuID8gaW5wdXQuY2hhckNvZGVBdChpICsgMikgOiAwKTtcbiAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgNDsgaiArPSAxKSB7XG4gICAgICAgICAgICBpZiAoaSAqIDggKyBqICogNiA+IGxlbiAqIDgpIHtcbiAgICAgICAgICAgICAgb3V0cHV0ICs9IHBhZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG91dHB1dCArPSB0YWIuY2hhckF0KCh0cmlwbGV0ID4+PiA2ICogKDMgLSBqKSkgJiAweDNGKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgIH07XG5cbiAgICAgIC8vIHB1YmxpYyBtZXRob2QgZm9yIGRlY29kaW5nXG4gICAgICB0aGlzLmRlY29kZSA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIC8vIHZhciBiNjQgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nO1xuICAgICAgICB2YXIgaSwgbzEsIG8yLCBvMywgaDEsIGgyLCBoMywgaDQsIGJpdHMsIGFjLFxuICAgICAgICAgIGRlYyA9ICcnLFxuICAgICAgICAgIGFyciA9IFtdO1xuICAgICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgaSA9IGFjID0gMDtcbiAgICAgICAgaW5wdXQgPSBpbnB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFwnICsgcGFkLCAnZ2knKSwgJycpOyAvLyB1c2UgJz0nXG4gICAgICAgIC8vaW5wdXQgKz0gJyc7XG5cbiAgICAgICAgZG8geyAvLyB1bnBhY2sgZm91ciBoZXhldHMgaW50byB0aHJlZSBvY3RldHMgdXNpbmcgaW5kZXggcG9pbnRzIGluIGI2NFxuICAgICAgICAgIGgxID0gdGFiLmluZGV4T2YoaW5wdXQuY2hhckF0KGkgKz0gMSkpO1xuICAgICAgICAgIGgyID0gdGFiLmluZGV4T2YoaW5wdXQuY2hhckF0KGkgKz0gMSkpO1xuICAgICAgICAgIGgzID0gdGFiLmluZGV4T2YoaW5wdXQuY2hhckF0KGkgKz0gMSkpO1xuICAgICAgICAgIGg0ID0gdGFiLmluZGV4T2YoaW5wdXQuY2hhckF0KGkgKz0gMSkpO1xuXG4gICAgICAgICAgYml0cyA9IGgxIDw8IDE4IHwgaDIgPDwgMTIgfCBoMyA8PCA2IHwgaDQ7XG5cbiAgICAgICAgICBvMSA9IGJpdHMgPj4gMTYgJiAweGZmO1xuICAgICAgICAgIG8yID0gYml0cyA+PiA4ICYgMHhmZjtcbiAgICAgICAgICBvMyA9IGJpdHMgJiAweGZmO1xuICAgICAgICAgIGFjICs9IDE7XG5cbiAgICAgICAgICBpZiAoaDMgPT09IDY0KSB7XG4gICAgICAgICAgICBhcnJbYWNdID0gU3RyaW5nLmZyb21DaGFyQ29kZShvMSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChoNCA9PT0gNjQpIHtcbiAgICAgICAgICAgIGFyclthY10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKG8xLCBvMik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyclthY10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKG8xLCBvMiwgbzMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAoaSA8IGlucHV0Lmxlbmd0aCk7XG5cbiAgICAgICAgZGVjID0gYXJyLmpvaW4oJycpO1xuICAgICAgICBkZWMgPSAodXRmOCkgPyB1dGY4RGVjb2RlKGRlYykgOiBkZWM7XG5cbiAgICAgICAgcmV0dXJuIGRlYztcbiAgICAgIH07XG5cbiAgICAgIC8vIHNldCBjdXN0b20gcGFkIHN0cmluZ1xuICAgICAgdGhpcy5zZXRQYWQgPSBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgcGFkID0gc3RyIHx8IHBhZDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgICAgLy8gc2V0IGN1c3RvbSB0YWIgc3RyaW5nIGNoYXJhY3RlcnNcbiAgICAgIHRoaXMuc2V0VGFiID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgIHRhYiA9IHN0ciB8fCB0YWI7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICAgIHRoaXMuc2V0VVRGOCA9IGZ1bmN0aW9uKGJvb2wpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBib29sID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICB1dGY4ID0gYm9vbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENSQy0zMiBjYWxjdWxhdGlvblxuICAgICAqIEBtZW1iZXIgSGFzaGVzXG4gICAgICogQG1ldGhvZCBDUkMzMlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIElucHV0IFN0cmluZ1xuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKi9cbiAgICBDUkMzMjogZnVuY3Rpb24oc3RyKSB7XG4gICAgICB2YXIgY3JjID0gMCxcbiAgICAgICAgeCA9IDAsXG4gICAgICAgIHkgPSAwLFxuICAgICAgICB0YWJsZSwgaSwgaVRvcDtcbiAgICAgIHN0ciA9IHV0ZjhFbmNvZGUoc3RyKTtcblxuICAgICAgdGFibGUgPSBbXG4gICAgICAgICcwMDAwMDAwMCA3NzA3MzA5NiBFRTBFNjEyQyA5OTA5NTFCQSAwNzZEQzQxOSA3MDZBRjQ4RiBFOTYzQTUzNSA5RTY0OTVBMyAwRURCODgzMiAnLFxuICAgICAgICAnNzlEQ0I4QTQgRTBENUU5MUUgOTdEMkQ5ODggMDlCNjRDMkIgN0VCMTdDQkQgRTdCODJEMDcgOTBCRjFEOTEgMURCNzEwNjQgNkFCMDIwRjIgRjNCOTcxNDggJyxcbiAgICAgICAgJzg0QkU0MURFIDFBREFENDdEIDZERERFNEVCIEY0RDRCNTUxIDgzRDM4NUM3IDEzNkM5ODU2IDY0NkJBOEMwIEZENjJGOTdBIDhBNjVDOUVDIDE0MDE1QzRGICcsXG4gICAgICAgICc2MzA2NkNEOSBGQTBGM0Q2MyA4RDA4MERGNSAzQjZFMjBDOCA0QzY5MTA1RSBENTYwNDFFNCBBMjY3NzE3MiAzQzAzRTREMSA0QjA0RDQ0NyBEMjBEODVGRCAnLFxuICAgICAgICAnQTUwQUI1NkIgMzVCNUE4RkEgNDJCMjk4NkMgREJCQkM5RDYgQUNCQ0Y5NDAgMzJEODZDRTMgNDVERjVDNzUgRENENjBEQ0YgQUJEMTNENTkgMjZEOTMwQUMgJyxcbiAgICAgICAgJzUxREUwMDNBIEM4RDc1MTgwIEJGRDA2MTE2IDIxQjRGNEI1IDU2QjNDNDIzIENGQkE5NTk5IEI4QkRBNTBGIDI4MDJCODlFIDVGMDU4ODA4IEM2MENEOUIyICcsXG4gICAgICAgICdCMTBCRTkyNCAyRjZGN0M4NyA1ODY4NEMxMSBDMTYxMURBQiBCNjY2MkQzRCA3NkRDNDE5MCAwMURCNzEwNiA5OEQyMjBCQyBFRkQ1MTAyQSA3MUIxODU4OSAnLFxuICAgICAgICAnMDZCNkI1MUYgOUZCRkU0QTUgRThCOEQ0MzMgNzgwN0M5QTIgMEYwMEY5MzQgOTYwOUE4OEUgRTEwRTk4MTggN0Y2QTBEQkIgMDg2RDNEMkQgOTE2NDZDOTcgJyxcbiAgICAgICAgJ0U2NjM1QzAxIDZCNkI1MUY0IDFDNkM2MTYyIDg1NjUzMEQ4IEYyNjIwMDRFIDZDMDY5NUVEIDFCMDFBNTdCIDgyMDhGNEMxIEY1MEZDNDU3IDY1QjBEOUM2ICcsXG4gICAgICAgICcxMkI3RTk1MCA4QkJFQjhFQSBGQ0I5ODg3QyA2MkREMURERiAxNURBMkQ0OSA4Q0QzN0NGMyBGQkQ0NEM2NSA0REIyNjE1OCAzQUI1NTFDRSBBM0JDMDA3NCAnLFxuICAgICAgICAnRDRCQjMwRTIgNEFERkE1NDEgM0REODk1RDcgQTREMUM0NkQgRDNENkY0RkIgNDM2OUU5NkEgMzQ2RUQ5RkMgQUQ2Nzg4NDYgREE2MEI4RDAgNDQwNDJENzMgJyxcbiAgICAgICAgJzMzMDMxREU1IEFBMEE0QzVGIEREMEQ3Q0M5IDUwMDU3MTNDIDI3MDI0MUFBIEJFMEIxMDEwIEM5MEMyMDg2IDU3NjhCNTI1IDIwNkY4NUIzIEI5NjZENDA5ICcsXG4gICAgICAgICdDRTYxRTQ5RiA1RURFRjkwRSAyOUQ5Qzk5OCBCMEQwOTgyMiBDN0Q3QThCNCA1OUIzM0QxNyAyRUI0MEQ4MSBCN0JENUMzQiBDMEJBNkNBRCBFREI4ODMyMCAnLFxuICAgICAgICAnOUFCRkIzQjYgMDNCNkUyMEMgNzRCMUQyOUEgRUFENTQ3MzkgOUREMjc3QUYgMDREQjI2MTUgNzNEQzE2ODMgRTM2MzBCMTIgOTQ2NDNCODQgMEQ2RDZBM0UgJyxcbiAgICAgICAgJzdBNkE1QUE4IEU0MEVDRjBCIDkzMDlGRjlEIDBBMDBBRTI3IDdEMDc5RUIxIEYwMEY5MzQ0IDg3MDhBM0QyIDFFMDFGMjY4IDY5MDZDMkZFIEY3NjI1NzVEICcsXG4gICAgICAgICc4MDY1NjdDQiAxOTZDMzY3MSA2RTZCMDZFNyBGRUQ0MUI3NiA4OUQzMkJFMCAxMERBN0E1QSA2N0RENEFDQyBGOUI5REY2RiA4RUJFRUZGOSAxN0I3QkU0MyAnLFxuICAgICAgICAnNjBCMDhFRDUgRDZENkEzRTggQTFEMTkzN0UgMzhEOEMyQzQgNEZERkYyNTIgRDFCQjY3RjEgQTZCQzU3NjcgM0ZCNTA2REQgNDhCMjM2NEIgRDgwRDJCREEgJyxcbiAgICAgICAgJ0FGMEExQjRDIDM2MDM0QUY2IDQxMDQ3QTYwIERGNjBFRkMzIEE4NjdERjU1IDMxNkU4RUVGIDQ2NjlCRTc5IENCNjFCMzhDIEJDNjY4MzFBIDI1NkZEMkEwICcsXG4gICAgICAgICc1MjY4RTIzNiBDQzBDNzc5NSBCQjBCNDcwMyAyMjAyMTZCOSA1NTA1MjYyRiBDNUJBM0JCRSBCMkJEMEIyOCAyQkI0NUE5MiA1Q0IzNkEwNCBDMkQ3RkZBNyAnLFxuICAgICAgICAnQjVEMENGMzEgMkNEOTlFOEIgNUJERUFFMUQgOUI2NEMyQjAgRUM2M0YyMjYgNzU2QUEzOUMgMDI2RDkzMEEgOUMwOTA2QTkgRUIwRTM2M0YgNzIwNzY3ODUgJyxcbiAgICAgICAgJzA1MDA1NzEzIDk1QkY0QTgyIEUyQjg3QTE0IDdCQjEyQkFFIDBDQjYxQjM4IDkyRDI4RTlCIEU1RDVCRTBEIDdDRENFRkI3IDBCREJERjIxIDg2RDNEMkQ0ICcsXG4gICAgICAgICdGMUQ0RTI0MiA2OEREQjNGOCAxRkRBODM2RSA4MUJFMTZDRCBGNkI5MjY1QiA2RkIwNzdFMSAxOEI3NDc3NyA4ODA4NUFFNiBGRjBGNkE3MCA2NjA2M0JDQSAnLFxuICAgICAgICAnMTEwMTBCNUMgOEY2NTlFRkYgRjg2MkFFNjkgNjE2QkZGRDMgMTY2Q0NGNDUgQTAwQUUyNzggRDcwREQyRUUgNEUwNDgzNTQgMzkwM0IzQzIgQTc2NzI2NjEgJyxcbiAgICAgICAgJ0QwNjAxNkY3IDQ5Njk0NzREIDNFNkU3N0RCIEFFRDE2QTRBIEQ5RDY1QURDIDQwREYwQjY2IDM3RDgzQkYwIEE5QkNBRTUzIERFQkI5RUM1IDQ3QjJDRjdGICcsXG4gICAgICAgICczMEI1RkZFOSBCREJERjIxQyBDQUJBQzI4QSA1M0IzOTMzMCAyNEI0QTNBNiBCQUQwMzYwNSBDREQ3MDY5MyA1NERFNTcyOSAyM0Q5NjdCRiBCMzY2N0EyRSAnLFxuICAgICAgICAnQzQ2MTRBQjggNUQ2ODFCMDIgMkE2RjJCOTQgQjQwQkJFMzcgQzMwQzhFQTEgNUEwNURGMUIgMkQwMkVGOEQnXG4gICAgICBdLmpvaW4oJycpO1xuXG4gICAgICBjcmMgPSBjcmMgXiAoLTEpO1xuICAgICAgZm9yIChpID0gMCwgaVRvcCA9IHN0ci5sZW5ndGg7IGkgPCBpVG9wOyBpICs9IDEpIHtcbiAgICAgICAgeSA9IChjcmMgXiBzdHIuY2hhckNvZGVBdChpKSkgJiAweEZGO1xuICAgICAgICB4ID0gJzB4JyArIHRhYmxlLnN1YnN0cih5ICogOSwgOCk7XG4gICAgICAgIGNyYyA9IChjcmMgPj4+IDgpIF4geDtcbiAgICAgIH1cbiAgICAgIC8vIGFsd2F5cyByZXR1cm4gYSBwb3NpdGl2ZSBudW1iZXIgKHRoYXQncyB3aGF0ID4+PiAwIGRvZXMpXG4gICAgICByZXR1cm4gKGNyYyBeICgtMSkpID4+PiAwO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogQG1lbWJlciBIYXNoZXNcbiAgICAgKiBAY2xhc3MgTUQ1XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWddXG4gICAgICpcbiAgICAgKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFJTQSBEYXRhIFNlY3VyaXR5LCBJbmMuIE1ENSBNZXNzYWdlXG4gICAgICogRGlnZXN0IEFsZ29yaXRobSwgYXMgZGVmaW5lZCBpbiBSRkMgMTMyMS5cbiAgICAgKiBWZXJzaW9uIDIuMiBDb3B5cmlnaHQgKEMpIFBhdWwgSm9obnN0b24gMTk5OSAtIDIwMDlcbiAgICAgKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XG4gICAgICogU2VlIDxodHRwOi8vcGFqaG9tZS5vcmcudWsvY3J5cHQvbWQ1PiBmb3IgbW9yZSBpbmZIYXNoZXMuXG4gICAgICovXG4gICAgTUQ1OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAvKipcbiAgICAgICAqIFByaXZhdGUgY29uZmlnIHByb3BlcnRpZXMuIFlvdSBtYXkgbmVlZCB0byB0d2VhayB0aGVzZSB0byBiZSBjb21wYXRpYmxlIHdpdGhcbiAgICAgICAqIHRoZSBzZXJ2ZXItc2lkZSwgYnV0IHRoZSBkZWZhdWx0cyB3b3JrIGluIG1vc3QgY2FzZXMuXG4gICAgICAgKiBTZWUge0BsaW5rIEhhc2hlcy5NRDUjbWV0aG9kLXNldFVwcGVyQ2FzZX0gYW5kIHtAbGluayBIYXNoZXMuU0hBMSNtZXRob2Qtc2V0VXBwZXJDYXNlfVxuICAgICAgICovXG4gICAgICB2YXIgaGV4Y2FzZSA9IChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnVwcGVyY2FzZSA9PT0gJ2Jvb2xlYW4nKSA/IG9wdGlvbnMudXBwZXJjYXNlIDogZmFsc2UsIC8vIGhleGFkZWNpbWFsIG91dHB1dCBjYXNlIGZvcm1hdC4gZmFsc2UgLSBsb3dlcmNhc2U7IHRydWUgLSB1cHBlcmNhc2VcbiAgICAgICAgYjY0cGFkID0gKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMucGFkID09PSAnc3RyaW5nJykgPyBvcHRpb25zLnBhZCA6ICc9JywgLy8gYmFzZS02NCBwYWQgY2hhcmFjdGVyLiBEZWZhdWx0cyB0byAnPScgZm9yIHN0cmljdCBSRkMgY29tcGxpYW5jZVxuICAgICAgICB1dGY4ID0gKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMudXRmOCA9PT0gJ2Jvb2xlYW4nKSA/IG9wdGlvbnMudXRmOCA6IHRydWU7IC8vIGVuYWJsZS9kaXNhYmxlIHV0ZjggZW5jb2RpbmdcblxuICAgICAgLy8gcHJpdmlsZWdlZCAocHVibGljKSBtZXRob2RzXG4gICAgICB0aGlzLmhleCA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyaGV4KHJzdHIocywgdXRmOCksIGhleGNhc2UpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYjY0ID0gZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcnN0cjJiNjQocnN0cihzKSwgYjY0cGFkKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmFueSA9IGZ1bmN0aW9uKHMsIGUpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYW55KHJzdHIocywgdXRmOCksIGUpO1xuICAgICAgfTtcbiAgICAgIHRoaXMucmF3ID0gZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcnN0cihzLCB1dGY4KTtcbiAgICAgIH07XG4gICAgICB0aGlzLmhleF9obWFjID0gZnVuY3Rpb24oaywgZCkge1xuICAgICAgICByZXR1cm4gcnN0cjJoZXgocnN0cl9obWFjKGssIGQpLCBoZXhjYXNlKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmI2NF9obWFjID0gZnVuY3Rpb24oaywgZCkge1xuICAgICAgICByZXR1cm4gcnN0cjJiNjQocnN0cl9obWFjKGssIGQpLCBiNjRwYWQpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYW55X2htYWMgPSBmdW5jdGlvbihrLCBkLCBlKSB7XG4gICAgICAgIHJldHVybiByc3RyMmFueShyc3RyX2htYWMoaywgZCksIGUpO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogUGVyZm9ybSBhIHNpbXBsZSBzZWxmLXRlc3QgdG8gc2VlIGlmIHRoZSBWTSBpcyB3b3JraW5nXG4gICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IEhleGFkZWNpbWFsIGhhc2ggc2FtcGxlXG4gICAgICAgKi9cbiAgICAgIHRoaXMudm1fdGVzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gaGV4KCdhYmMnKS50b0xvd2VyQ2FzZSgpID09PSAnOTAwMTUwOTgzY2QyNGZiMGQ2OTYzZjdkMjhlMTdmNzInO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogRW5hYmxlL2Rpc2FibGUgdXBwZXJjYXNlIGhleGFkZWNpbWFsIHJldHVybmVkIHN0cmluZ1xuICAgICAgICogQHBhcmFtIHtCb29sZWFufVxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2V0VXBwZXJDYXNlID0gZnVuY3Rpb24oYSkge1xuICAgICAgICBpZiAodHlwZW9mIGEgPT09ICdib29sZWFuJykge1xuICAgICAgICAgIGhleGNhc2UgPSBhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogRGVmaW5lcyBhIGJhc2U2NCBwYWQgc3RyaW5nXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ30gUGFkXG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoaXNcbiAgICAgICAqL1xuICAgICAgdGhpcy5zZXRQYWQgPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIGI2NHBhZCA9IGEgfHwgYjY0cGFkO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIERlZmluZXMgYSBiYXNlNjQgcGFkIHN0cmluZ1xuICAgICAgICogQHBhcmFtIHtCb29sZWFufVxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSBbdGhpc11cbiAgICAgICAqL1xuICAgICAgdGhpcy5zZXRVVEY4ID0gZnVuY3Rpb24oYSkge1xuICAgICAgICBpZiAodHlwZW9mIGEgPT09ICdib29sZWFuJykge1xuICAgICAgICAgIHV0ZjggPSBhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcblxuICAgICAgLy8gcHJpdmF0ZSBtZXRob2RzXG5cbiAgICAgIC8qKlxuICAgICAgICogQ2FsY3VsYXRlIHRoZSBNRDUgb2YgYSByYXcgc3RyaW5nXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gcnN0cihzKSB7XG4gICAgICAgIHMgPSAodXRmOCkgPyB1dGY4RW5jb2RlKHMpIDogcztcbiAgICAgICAgcmV0dXJuIGJpbmwycnN0cihiaW5sKHJzdHIyYmlubChzKSwgcy5sZW5ndGggKiA4KSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ2FsY3VsYXRlIHRoZSBITUFDLU1ENSwgb2YgYSBrZXkgYW5kIHNvbWUgZGF0YSAocmF3IHN0cmluZ3MpXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gcnN0cl9obWFjKGtleSwgZGF0YSkge1xuICAgICAgICB2YXIgYmtleSwgaXBhZCwgb3BhZCwgaGFzaCwgaTtcblxuICAgICAgICBrZXkgPSAodXRmOCkgPyB1dGY4RW5jb2RlKGtleSkgOiBrZXk7XG4gICAgICAgIGRhdGEgPSAodXRmOCkgPyB1dGY4RW5jb2RlKGRhdGEpIDogZGF0YTtcbiAgICAgICAgYmtleSA9IHJzdHIyYmlubChrZXkpO1xuICAgICAgICBpZiAoYmtleS5sZW5ndGggPiAxNikge1xuICAgICAgICAgIGJrZXkgPSBiaW5sKGJrZXksIGtleS5sZW5ndGggKiA4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlwYWQgPSBBcnJheSgxNiksIG9wYWQgPSBBcnJheSgxNik7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxNjsgaSArPSAxKSB7XG4gICAgICAgICAgaXBhZFtpXSA9IGJrZXlbaV0gXiAweDM2MzYzNjM2O1xuICAgICAgICAgIG9wYWRbaV0gPSBia2V5W2ldIF4gMHg1QzVDNUM1QztcbiAgICAgICAgfVxuICAgICAgICBoYXNoID0gYmlubChpcGFkLmNvbmNhdChyc3RyMmJpbmwoZGF0YSkpLCA1MTIgKyBkYXRhLmxlbmd0aCAqIDgpO1xuICAgICAgICByZXR1cm4gYmlubDJyc3RyKGJpbmwob3BhZC5jb25jYXQoaGFzaCksIDUxMiArIDEyOCkpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIENhbGN1bGF0ZSB0aGUgTUQ1IG9mIGFuIGFycmF5IG9mIGxpdHRsZS1lbmRpYW4gd29yZHMsIGFuZCBhIGJpdCBsZW5ndGguXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gYmlubCh4LCBsZW4pIHtcbiAgICAgICAgdmFyIGksIG9sZGEsIG9sZGIsIG9sZGMsIG9sZGQsXG4gICAgICAgICAgYSA9IDE3MzI1ODQxOTMsXG4gICAgICAgICAgYiA9IC0yNzE3MzM4NzksXG4gICAgICAgICAgYyA9IC0xNzMyNTg0MTk0LFxuICAgICAgICAgIGQgPSAyNzE3MzM4Nzg7XG5cbiAgICAgICAgLyogYXBwZW5kIHBhZGRpbmcgKi9cbiAgICAgICAgeFtsZW4gPj4gNV0gfD0gMHg4MCA8PCAoKGxlbikgJSAzMik7XG4gICAgICAgIHhbKCgobGVuICsgNjQpID4+PiA5KSA8PCA0KSArIDE0XSA9IGxlbjtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgeC5sZW5ndGg7IGkgKz0gMTYpIHtcbiAgICAgICAgICBvbGRhID0gYTtcbiAgICAgICAgICBvbGRiID0gYjtcbiAgICAgICAgICBvbGRjID0gYztcbiAgICAgICAgICBvbGRkID0gZDtcblxuICAgICAgICAgIGEgPSBtZDVfZmYoYSwgYiwgYywgZCwgeFtpICsgMF0sIDcsIC02ODA4NzY5MzYpO1xuICAgICAgICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpICsgMV0sIDEyLCAtMzg5NTY0NTg2KTtcbiAgICAgICAgICBjID0gbWQ1X2ZmKGMsIGQsIGEsIGIsIHhbaSArIDJdLCAxNywgNjA2MTA1ODE5KTtcbiAgICAgICAgICBiID0gbWQ1X2ZmKGIsIGMsIGQsIGEsIHhbaSArIDNdLCAyMiwgLTEwNDQ1MjUzMzApO1xuICAgICAgICAgIGEgPSBtZDVfZmYoYSwgYiwgYywgZCwgeFtpICsgNF0sIDcsIC0xNzY0MTg4OTcpO1xuICAgICAgICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpICsgNV0sIDEyLCAxMjAwMDgwNDI2KTtcbiAgICAgICAgICBjID0gbWQ1X2ZmKGMsIGQsIGEsIGIsIHhbaSArIDZdLCAxNywgLTE0NzMyMzEzNDEpO1xuICAgICAgICAgIGIgPSBtZDVfZmYoYiwgYywgZCwgYSwgeFtpICsgN10sIDIyLCAtNDU3MDU5ODMpO1xuICAgICAgICAgIGEgPSBtZDVfZmYoYSwgYiwgYywgZCwgeFtpICsgOF0sIDcsIDE3NzAwMzU0MTYpO1xuICAgICAgICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpICsgOV0sIDEyLCAtMTk1ODQxNDQxNyk7XG4gICAgICAgICAgYyA9IG1kNV9mZihjLCBkLCBhLCBiLCB4W2kgKyAxMF0sIDE3LCAtNDIwNjMpO1xuICAgICAgICAgIGIgPSBtZDVfZmYoYiwgYywgZCwgYSwgeFtpICsgMTFdLCAyMiwgLTE5OTA0MDQxNjIpO1xuICAgICAgICAgIGEgPSBtZDVfZmYoYSwgYiwgYywgZCwgeFtpICsgMTJdLCA3LCAxODA0NjAzNjgyKTtcbiAgICAgICAgICBkID0gbWQ1X2ZmKGQsIGEsIGIsIGMsIHhbaSArIDEzXSwgMTIsIC00MDM0MTEwMSk7XG4gICAgICAgICAgYyA9IG1kNV9mZihjLCBkLCBhLCBiLCB4W2kgKyAxNF0sIDE3LCAtMTUwMjAwMjI5MCk7XG4gICAgICAgICAgYiA9IG1kNV9mZihiLCBjLCBkLCBhLCB4W2kgKyAxNV0sIDIyLCAxMjM2NTM1MzI5KTtcblxuICAgICAgICAgIGEgPSBtZDVfZ2coYSwgYiwgYywgZCwgeFtpICsgMV0sIDUsIC0xNjU3OTY1MTApO1xuICAgICAgICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpICsgNl0sIDksIC0xMDY5NTAxNjMyKTtcbiAgICAgICAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSArIDExXSwgMTQsIDY0MzcxNzcxMyk7XG4gICAgICAgICAgYiA9IG1kNV9nZyhiLCBjLCBkLCBhLCB4W2kgKyAwXSwgMjAsIC0zNzM4OTczMDIpO1xuICAgICAgICAgIGEgPSBtZDVfZ2coYSwgYiwgYywgZCwgeFtpICsgNV0sIDUsIC03MDE1NTg2OTEpO1xuICAgICAgICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpICsgMTBdLCA5LCAzODAxNjA4Myk7XG4gICAgICAgICAgYyA9IG1kNV9nZyhjLCBkLCBhLCBiLCB4W2kgKyAxNV0sIDE0LCAtNjYwNDc4MzM1KTtcbiAgICAgICAgICBiID0gbWQ1X2dnKGIsIGMsIGQsIGEsIHhbaSArIDRdLCAyMCwgLTQwNTUzNzg0OCk7XG4gICAgICAgICAgYSA9IG1kNV9nZyhhLCBiLCBjLCBkLCB4W2kgKyA5XSwgNSwgNTY4NDQ2NDM4KTtcbiAgICAgICAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSArIDE0XSwgOSwgLTEwMTk4MDM2OTApO1xuICAgICAgICAgIGMgPSBtZDVfZ2coYywgZCwgYSwgYiwgeFtpICsgM10sIDE0LCAtMTg3MzYzOTYxKTtcbiAgICAgICAgICBiID0gbWQ1X2dnKGIsIGMsIGQsIGEsIHhbaSArIDhdLCAyMCwgMTE2MzUzMTUwMSk7XG4gICAgICAgICAgYSA9IG1kNV9nZyhhLCBiLCBjLCBkLCB4W2kgKyAxM10sIDUsIC0xNDQ0NjgxNDY3KTtcbiAgICAgICAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSArIDJdLCA5LCAtNTE0MDM3ODQpO1xuICAgICAgICAgIGMgPSBtZDVfZ2coYywgZCwgYSwgYiwgeFtpICsgN10sIDE0LCAxNzM1MzI4NDczKTtcbiAgICAgICAgICBiID0gbWQ1X2dnKGIsIGMsIGQsIGEsIHhbaSArIDEyXSwgMjAsIC0xOTI2NjA3NzM0KTtcblxuICAgICAgICAgIGEgPSBtZDVfaGgoYSwgYiwgYywgZCwgeFtpICsgNV0sIDQsIC0zNzg1NTgpO1xuICAgICAgICAgIGQgPSBtZDVfaGgoZCwgYSwgYiwgYywgeFtpICsgOF0sIDExLCAtMjAyMjU3NDQ2Myk7XG4gICAgICAgICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2kgKyAxMV0sIDE2LCAxODM5MDMwNTYyKTtcbiAgICAgICAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSArIDE0XSwgMjMsIC0zNTMwOTU1Nik7XG4gICAgICAgICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2kgKyAxXSwgNCwgLTE1MzA5OTIwNjApO1xuICAgICAgICAgIGQgPSBtZDVfaGgoZCwgYSwgYiwgYywgeFtpICsgNF0sIDExLCAxMjcyODkzMzUzKTtcbiAgICAgICAgICBjID0gbWQ1X2hoKGMsIGQsIGEsIGIsIHhbaSArIDddLCAxNiwgLTE1NTQ5NzYzMik7XG4gICAgICAgICAgYiA9IG1kNV9oaChiLCBjLCBkLCBhLCB4W2kgKyAxMF0sIDIzLCAtMTA5NDczMDY0MCk7XG4gICAgICAgICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2kgKyAxM10sIDQsIDY4MTI3OTE3NCk7XG4gICAgICAgICAgZCA9IG1kNV9oaChkLCBhLCBiLCBjLCB4W2kgKyAwXSwgMTEsIC0zNTg1MzcyMjIpO1xuICAgICAgICAgIGMgPSBtZDVfaGgoYywgZCwgYSwgYiwgeFtpICsgM10sIDE2LCAtNzIyNTIxOTc5KTtcbiAgICAgICAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSArIDZdLCAyMywgNzYwMjkxODkpO1xuICAgICAgICAgIGEgPSBtZDVfaGgoYSwgYiwgYywgZCwgeFtpICsgOV0sIDQsIC02NDAzNjQ0ODcpO1xuICAgICAgICAgIGQgPSBtZDVfaGgoZCwgYSwgYiwgYywgeFtpICsgMTJdLCAxMSwgLTQyMTgxNTgzNSk7XG4gICAgICAgICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2kgKyAxNV0sIDE2LCA1MzA3NDI1MjApO1xuICAgICAgICAgIGIgPSBtZDVfaGgoYiwgYywgZCwgYSwgeFtpICsgMl0sIDIzLCAtOTk1MzM4NjUxKTtcblxuICAgICAgICAgIGEgPSBtZDVfaWkoYSwgYiwgYywgZCwgeFtpICsgMF0sIDYsIC0xOTg2MzA4NDQpO1xuICAgICAgICAgIGQgPSBtZDVfaWkoZCwgYSwgYiwgYywgeFtpICsgN10sIDEwLCAxMTI2ODkxNDE1KTtcbiAgICAgICAgICBjID0gbWQ1X2lpKGMsIGQsIGEsIGIsIHhbaSArIDE0XSwgMTUsIC0xNDE2MzU0OTA1KTtcbiAgICAgICAgICBiID0gbWQ1X2lpKGIsIGMsIGQsIGEsIHhbaSArIDVdLCAyMSwgLTU3NDM0MDU1KTtcbiAgICAgICAgICBhID0gbWQ1X2lpKGEsIGIsIGMsIGQsIHhbaSArIDEyXSwgNiwgMTcwMDQ4NTU3MSk7XG4gICAgICAgICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2kgKyAzXSwgMTAsIC0xODk0OTg2NjA2KTtcbiAgICAgICAgICBjID0gbWQ1X2lpKGMsIGQsIGEsIGIsIHhbaSArIDEwXSwgMTUsIC0xMDUxNTIzKTtcbiAgICAgICAgICBiID0gbWQ1X2lpKGIsIGMsIGQsIGEsIHhbaSArIDFdLCAyMSwgLTIwNTQ5MjI3OTkpO1xuICAgICAgICAgIGEgPSBtZDVfaWkoYSwgYiwgYywgZCwgeFtpICsgOF0sIDYsIDE4NzMzMTMzNTkpO1xuICAgICAgICAgIGQgPSBtZDVfaWkoZCwgYSwgYiwgYywgeFtpICsgMTVdLCAxMCwgLTMwNjExNzQ0KTtcbiAgICAgICAgICBjID0gbWQ1X2lpKGMsIGQsIGEsIGIsIHhbaSArIDZdLCAxNSwgLTE1NjAxOTgzODApO1xuICAgICAgICAgIGIgPSBtZDVfaWkoYiwgYywgZCwgYSwgeFtpICsgMTNdLCAyMSwgMTMwOTE1MTY0OSk7XG4gICAgICAgICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2kgKyA0XSwgNiwgLTE0NTUyMzA3MCk7XG4gICAgICAgICAgZCA9IG1kNV9paShkLCBhLCBiLCBjLCB4W2kgKyAxMV0sIDEwLCAtMTEyMDIxMDM3OSk7XG4gICAgICAgICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2kgKyAyXSwgMTUsIDcxODc4NzI1OSk7XG4gICAgICAgICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2kgKyA5XSwgMjEsIC0zNDM0ODU1NTEpO1xuXG4gICAgICAgICAgYSA9IHNhZmVfYWRkKGEsIG9sZGEpO1xuICAgICAgICAgIGIgPSBzYWZlX2FkZChiLCBvbGRiKTtcbiAgICAgICAgICBjID0gc2FmZV9hZGQoYywgb2xkYyk7XG4gICAgICAgICAgZCA9IHNhZmVfYWRkKGQsIG9sZGQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBBcnJheShhLCBiLCBjLCBkKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBUaGVzZSBmdW5jdGlvbnMgaW1wbGVtZW50IHRoZSBmb3VyIGJhc2ljIG9wZXJhdGlvbnMgdGhlIGFsZ29yaXRobSB1c2VzLlxuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIG1kNV9jbW4ocSwgYSwgYiwgeCwgcywgdCkge1xuICAgICAgICByZXR1cm4gc2FmZV9hZGQoYml0X3JvbChzYWZlX2FkZChzYWZlX2FkZChhLCBxKSwgc2FmZV9hZGQoeCwgdCkpLCBzKSwgYik7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG1kNV9mZihhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XG4gICAgICAgIHJldHVybiBtZDVfY21uKChiICYgYykgfCAoKH5iKSAmIGQpLCBhLCBiLCB4LCBzLCB0KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbWQ1X2dnKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgICAgICAgcmV0dXJuIG1kNV9jbW4oKGIgJiBkKSB8IChjICYgKH5kKSksIGEsIGIsIHgsIHMsIHQpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBtZDVfaGgoYSwgYiwgYywgZCwgeCwgcywgdCkge1xuICAgICAgICByZXR1cm4gbWQ1X2NtbihiIF4gYyBeIGQsIGEsIGIsIHgsIHMsIHQpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBtZDVfaWkoYSwgYiwgYywgZCwgeCwgcywgdCkge1xuICAgICAgICByZXR1cm4gbWQ1X2NtbihjIF4gKGIgfCAofmQpKSwgYSwgYiwgeCwgcywgdCk7XG4gICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIEhhc2hlc1xuICAgICAqIEBjbGFzcyBIYXNoZXMuU0hBMVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnXVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBTZWN1cmUgSGFzaCBBbGdvcml0aG0sIFNIQS0xLCBhcyBkZWZpbmVkIGluIEZJUFMgMTgwLTFcbiAgICAgKiBWZXJzaW9uIDIuMiBDb3B5cmlnaHQgUGF1bCBKb2huc3RvbiAyMDAwIC0gMjAwOS5cbiAgICAgKiBPdGhlciBjb250cmlidXRvcnM6IEdyZWcgSG9sdCwgQW5kcmV3IEtlcGVydCwgWWRuYXIsIExvc3RpbmV0XG4gICAgICogU2VlIGh0dHA6Ly9wYWpob21lLm9yZy51ay9jcnlwdC9tZDUgZm9yIGRldGFpbHMuXG4gICAgICovXG4gICAgU0hBMTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgLyoqXG4gICAgICAgKiBQcml2YXRlIGNvbmZpZyBwcm9wZXJ0aWVzLiBZb3UgbWF5IG5lZWQgdG8gdHdlYWsgdGhlc2UgdG8gYmUgY29tcGF0aWJsZSB3aXRoXG4gICAgICAgKiB0aGUgc2VydmVyLXNpZGUsIGJ1dCB0aGUgZGVmYXVsdHMgd29yayBpbiBtb3N0IGNhc2VzLlxuICAgICAgICogU2VlIHtAbGluayBIYXNoZXMuTUQ1I21ldGhvZC1zZXRVcHBlckNhc2V9IGFuZCB7QGxpbmsgSGFzaGVzLlNIQTEjbWV0aG9kLXNldFVwcGVyQ2FzZX1cbiAgICAgICAqL1xuICAgICAgdmFyIGhleGNhc2UgPSAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy51cHBlcmNhc2UgPT09ICdib29sZWFuJykgPyBvcHRpb25zLnVwcGVyY2FzZSA6IGZhbHNlLCAvLyBoZXhhZGVjaW1hbCBvdXRwdXQgY2FzZSBmb3JtYXQuIGZhbHNlIC0gbG93ZXJjYXNlOyB0cnVlIC0gdXBwZXJjYXNlXG4gICAgICAgIGI2NHBhZCA9IChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnBhZCA9PT0gJ3N0cmluZycpID8gb3B0aW9ucy5wYWQgOiAnPScsIC8vIGJhc2UtNjQgcGFkIGNoYXJhY3Rlci4gRGVmYXVsdHMgdG8gJz0nIGZvciBzdHJpY3QgUkZDIGNvbXBsaWFuY2VcbiAgICAgICAgdXRmOCA9IChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnV0ZjggPT09ICdib29sZWFuJykgPyBvcHRpb25zLnV0ZjggOiB0cnVlOyAvLyBlbmFibGUvZGlzYWJsZSB1dGY4IGVuY29kaW5nXG5cbiAgICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgICB0aGlzLmhleCA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyaGV4KHJzdHIocywgdXRmOCksIGhleGNhc2UpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYjY0ID0gZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcnN0cjJiNjQocnN0cihzLCB1dGY4KSwgYjY0cGFkKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmFueSA9IGZ1bmN0aW9uKHMsIGUpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYW55KHJzdHIocywgdXRmOCksIGUpO1xuICAgICAgfTtcbiAgICAgIHRoaXMucmF3ID0gZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcnN0cihzLCB1dGY4KTtcbiAgICAgIH07XG4gICAgICB0aGlzLmhleF9obWFjID0gZnVuY3Rpb24oaywgZCkge1xuICAgICAgICByZXR1cm4gcnN0cjJoZXgocnN0cl9obWFjKGssIGQpKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmI2NF9obWFjID0gZnVuY3Rpb24oaywgZCkge1xuICAgICAgICByZXR1cm4gcnN0cjJiNjQocnN0cl9obWFjKGssIGQpLCBiNjRwYWQpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYW55X2htYWMgPSBmdW5jdGlvbihrLCBkLCBlKSB7XG4gICAgICAgIHJldHVybiByc3RyMmFueShyc3RyX2htYWMoaywgZCksIGUpO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogUGVyZm9ybSBhIHNpbXBsZSBzZWxmLXRlc3QgdG8gc2VlIGlmIHRoZSBWTSBpcyB3b3JraW5nXG4gICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IEhleGFkZWNpbWFsIGhhc2ggc2FtcGxlXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICAgIHRoaXMudm1fdGVzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gaGV4KCdhYmMnKS50b0xvd2VyQ2FzZSgpID09PSAnOTAwMTUwOTgzY2QyNGZiMGQ2OTYzZjdkMjhlMTdmNzInO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogQGRlc2NyaXB0aW9uIEVuYWJsZS9kaXNhYmxlIHVwcGVyY2FzZSBoZXhhZGVjaW1hbCByZXR1cm5lZCBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn1cbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhpc1xuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgICB0aGlzLnNldFVwcGVyQ2FzZSA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICBoZXhjYXNlID0gYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIEBkZXNjcmlwdGlvbiBEZWZpbmVzIGEgYmFzZTY0IHBhZCBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBQYWRcbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhpc1xuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgICB0aGlzLnNldFBhZCA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgYjY0cGFkID0gYSB8fCBiNjRwYWQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogQGRlc2NyaXB0aW9uIERlZmluZXMgYSBiYXNlNjQgcGFkIHN0cmluZ1xuICAgICAgICogQHBhcmFtIHtib29sZWFufVxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2V0VVRGOCA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICB1dGY4ID0gYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG5cbiAgICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgICAvKipcbiAgICAgICAqIENhbGN1bGF0ZSB0aGUgU0hBLTUxMiBvZiBhIHJhdyBzdHJpbmdcbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiByc3RyKHMpIHtcbiAgICAgICAgcyA9ICh1dGY4KSA/IHV0ZjhFbmNvZGUocykgOiBzO1xuICAgICAgICByZXR1cm4gYmluYjJyc3RyKGJpbmIocnN0cjJiaW5iKHMpLCBzLmxlbmd0aCAqIDgpKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDYWxjdWxhdGUgdGhlIEhNQUMtU0hBMSBvZiBhIGtleSBhbmQgc29tZSBkYXRhIChyYXcgc3RyaW5ncylcbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiByc3RyX2htYWMoa2V5LCBkYXRhKSB7XG4gICAgICAgIHZhciBia2V5LCBpcGFkLCBvcGFkLCBpLCBoYXNoO1xuICAgICAgICBrZXkgPSAodXRmOCkgPyB1dGY4RW5jb2RlKGtleSkgOiBrZXk7XG4gICAgICAgIGRhdGEgPSAodXRmOCkgPyB1dGY4RW5jb2RlKGRhdGEpIDogZGF0YTtcbiAgICAgICAgYmtleSA9IHJzdHIyYmluYihrZXkpO1xuXG4gICAgICAgIGlmIChia2V5Lmxlbmd0aCA+IDE2KSB7XG4gICAgICAgICAgYmtleSA9IGJpbmIoYmtleSwga2V5Lmxlbmd0aCAqIDgpO1xuICAgICAgICB9XG4gICAgICAgIGlwYWQgPSBBcnJheSgxNiksIG9wYWQgPSBBcnJheSgxNik7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxNjsgaSArPSAxKSB7XG4gICAgICAgICAgaXBhZFtpXSA9IGJrZXlbaV0gXiAweDM2MzYzNjM2O1xuICAgICAgICAgIG9wYWRbaV0gPSBia2V5W2ldIF4gMHg1QzVDNUM1QztcbiAgICAgICAgfVxuICAgICAgICBoYXNoID0gYmluYihpcGFkLmNvbmNhdChyc3RyMmJpbmIoZGF0YSkpLCA1MTIgKyBkYXRhLmxlbmd0aCAqIDgpO1xuICAgICAgICByZXR1cm4gYmluYjJyc3RyKGJpbmIob3BhZC5jb25jYXQoaGFzaCksIDUxMiArIDE2MCkpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIENhbGN1bGF0ZSB0aGUgU0hBLTEgb2YgYW4gYXJyYXkgb2YgYmlnLWVuZGlhbiB3b3JkcywgYW5kIGEgYml0IGxlbmd0aFxuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIGJpbmIoeCwgbGVuKSB7XG4gICAgICAgIHZhciBpLCBqLCB0LCBvbGRhLCBvbGRiLCBvbGRjLCBvbGRkLCBvbGRlLFxuICAgICAgICAgIHcgPSBBcnJheSg4MCksXG4gICAgICAgICAgYSA9IDE3MzI1ODQxOTMsXG4gICAgICAgICAgYiA9IC0yNzE3MzM4NzksXG4gICAgICAgICAgYyA9IC0xNzMyNTg0MTk0LFxuICAgICAgICAgIGQgPSAyNzE3MzM4NzgsXG4gICAgICAgICAgZSA9IC0xMDA5NTg5Nzc2O1xuXG4gICAgICAgIC8qIGFwcGVuZCBwYWRkaW5nICovXG4gICAgICAgIHhbbGVuID4+IDVdIHw9IDB4ODAgPDwgKDI0IC0gbGVuICUgMzIpO1xuICAgICAgICB4WygobGVuICsgNjQgPj4gOSkgPDwgNCkgKyAxNV0gPSBsZW47XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHgubGVuZ3RoOyBpICs9IDE2KSB7XG4gICAgICAgICAgb2xkYSA9IGE7XG4gICAgICAgICAgb2xkYiA9IGI7XG4gICAgICAgICAgb2xkYyA9IGM7XG4gICAgICAgICAgb2xkZCA9IGQ7XG4gICAgICAgICAgb2xkZSA9IGU7XG5cbiAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgODA7IGogKz0gMSkge1xuICAgICAgICAgICAgaWYgKGogPCAxNikge1xuICAgICAgICAgICAgICB3W2pdID0geFtpICsgal07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB3W2pdID0gYml0X3JvbCh3W2ogLSAzXSBeIHdbaiAtIDhdIF4gd1tqIC0gMTRdIF4gd1tqIC0gMTZdLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHQgPSBzYWZlX2FkZChzYWZlX2FkZChiaXRfcm9sKGEsIDUpLCBzaGExX2Z0KGosIGIsIGMsIGQpKSxcbiAgICAgICAgICAgICAgc2FmZV9hZGQoc2FmZV9hZGQoZSwgd1tqXSksIHNoYTFfa3QoaikpKTtcbiAgICAgICAgICAgIGUgPSBkO1xuICAgICAgICAgICAgZCA9IGM7XG4gICAgICAgICAgICBjID0gYml0X3JvbChiLCAzMCk7XG4gICAgICAgICAgICBiID0gYTtcbiAgICAgICAgICAgIGEgPSB0O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGEgPSBzYWZlX2FkZChhLCBvbGRhKTtcbiAgICAgICAgICBiID0gc2FmZV9hZGQoYiwgb2xkYik7XG4gICAgICAgICAgYyA9IHNhZmVfYWRkKGMsIG9sZGMpO1xuICAgICAgICAgIGQgPSBzYWZlX2FkZChkLCBvbGRkKTtcbiAgICAgICAgICBlID0gc2FmZV9hZGQoZSwgb2xkZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEFycmF5KGEsIGIsIGMsIGQsIGUpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIFBlcmZvcm0gdGhlIGFwcHJvcHJpYXRlIHRyaXBsZXQgY29tYmluYXRpb24gZnVuY3Rpb24gZm9yIHRoZSBjdXJyZW50XG4gICAgICAgKiBpdGVyYXRpb25cbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiBzaGExX2Z0KHQsIGIsIGMsIGQpIHtcbiAgICAgICAgaWYgKHQgPCAyMCkge1xuICAgICAgICAgIHJldHVybiAoYiAmIGMpIHwgKCh+YikgJiBkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodCA8IDQwKSB7XG4gICAgICAgICAgcmV0dXJuIGIgXiBjIF4gZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodCA8IDYwKSB7XG4gICAgICAgICAgcmV0dXJuIChiICYgYykgfCAoYiAmIGQpIHwgKGMgJiBkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYiBeIGMgXiBkO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIERldGVybWluZSB0aGUgYXBwcm9wcmlhdGUgYWRkaXRpdmUgY29uc3RhbnQgZm9yIHRoZSBjdXJyZW50IGl0ZXJhdGlvblxuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIHNoYTFfa3QodCkge1xuICAgICAgICByZXR1cm4gKHQgPCAyMCkgPyAxNTE4NTAwMjQ5IDogKHQgPCA0MCkgPyAxODU5Nzc1MzkzIDpcbiAgICAgICAgICAodCA8IDYwKSA/IC0xODk0MDA3NTg4IDogLTg5OTQ5NzUxNDtcbiAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEBjbGFzcyBIYXNoZXMuU0hBMjU2XG4gICAgICogQHBhcmFtIHtjb25maWd9XG4gICAgICpcbiAgICAgKiBBIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2YgdGhlIFNlY3VyZSBIYXNoIEFsZ29yaXRobSwgU0hBLTI1NiwgYXMgZGVmaW5lZCBpbiBGSVBTIDE4MC0yXG4gICAgICogVmVyc2lvbiAyLjIgQ29weXJpZ2h0IEFuZ2VsIE1hcmluLCBQYXVsIEpvaG5zdG9uIDIwMDAgLSAyMDA5LlxuICAgICAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcbiAgICAgKiBTZWUgaHR0cDovL3BhamhvbWUub3JnLnVrL2NyeXB0L21kNSBmb3IgZGV0YWlscy5cbiAgICAgKiBBbHNvIGh0dHA6Ly9hbm1hci5ldS5vcmcvcHJvamVjdHMvanNzaGEyL1xuICAgICAqL1xuICAgIFNIQTI1NjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgLyoqXG4gICAgICAgKiBQcml2YXRlIHByb3BlcnRpZXMgY29uZmlndXJhdGlvbiB2YXJpYWJsZXMuIFlvdSBtYXkgbmVlZCB0byB0d2VhayB0aGVzZSB0byBiZSBjb21wYXRpYmxlIHdpdGhcbiAgICAgICAqIHRoZSBzZXJ2ZXItc2lkZSwgYnV0IHRoZSBkZWZhdWx0cyB3b3JrIGluIG1vc3QgY2FzZXMuXG4gICAgICAgKiBAc2VlIHRoaXMuc2V0VXBwZXJDYXNlKCkgbWV0aG9kXG4gICAgICAgKiBAc2VlIHRoaXMuc2V0UGFkKCkgbWV0aG9kXG4gICAgICAgKi9cbiAgICAgIHZhciBoZXhjYXNlID0gKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMudXBwZXJjYXNlID09PSAnYm9vbGVhbicpID8gb3B0aW9ucy51cHBlcmNhc2UgOiBmYWxzZSwgLy8gaGV4YWRlY2ltYWwgb3V0cHV0IGNhc2UgZm9ybWF0LiBmYWxzZSAtIGxvd2VyY2FzZTsgdHJ1ZSAtIHVwcGVyY2FzZSAgKi9cbiAgICAgICAgYjY0cGFkID0gKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMucGFkID09PSAnc3RyaW5nJykgPyBvcHRpb25zLnBhZCA6ICc9JyxcbiAgICAgICAgLyogYmFzZS02NCBwYWQgY2hhcmFjdGVyLiBEZWZhdWx0ICc9JyBmb3Igc3RyaWN0IFJGQyBjb21wbGlhbmNlICAgKi9cbiAgICAgICAgdXRmOCA9IChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnV0ZjggPT09ICdib29sZWFuJykgPyBvcHRpb25zLnV0ZjggOiB0cnVlLFxuICAgICAgICAvKiBlbmFibGUvZGlzYWJsZSB1dGY4IGVuY29kaW5nICovXG4gICAgICAgIHNoYTI1Nl9LO1xuXG4gICAgICAvKiBwcml2aWxlZ2VkIChwdWJsaWMpIG1ldGhvZHMgKi9cbiAgICAgIHRoaXMuaGV4ID0gZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcnN0cjJoZXgocnN0cihzLCB1dGY4KSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5iNjQgPSBmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiByc3RyMmI2NChyc3RyKHMsIHV0ZjgpLCBiNjRwYWQpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYW55ID0gZnVuY3Rpb24ocywgZSkge1xuICAgICAgICByZXR1cm4gcnN0cjJhbnkocnN0cihzLCB1dGY4KSwgZSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5yYXcgPSBmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiByc3RyKHMsIHV0ZjgpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuaGV4X2htYWMgPSBmdW5jdGlvbihrLCBkKSB7XG4gICAgICAgIHJldHVybiByc3RyMmhleChyc3RyX2htYWMoaywgZCkpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYjY0X2htYWMgPSBmdW5jdGlvbihrLCBkKSB7XG4gICAgICAgIHJldHVybiByc3RyMmI2NChyc3RyX2htYWMoaywgZCksIGI2NHBhZCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5hbnlfaG1hYyA9IGZ1bmN0aW9uKGssIGQsIGUpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYW55KHJzdHJfaG1hYyhrLCBkKSwgZSk7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBQZXJmb3JtIGEgc2ltcGxlIHNlbGYtdGVzdCB0byBzZWUgaWYgdGhlIFZNIGlzIHdvcmtpbmdcbiAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gSGV4YWRlY2ltYWwgaGFzaCBzYW1wbGVcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgICAgdGhpcy52bV90ZXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBoZXgoJ2FiYycpLnRvTG93ZXJDYXNlKCkgPT09ICc5MDAxNTA5ODNjZDI0ZmIwZDY5NjNmN2QyOGUxN2Y3Mic7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBFbmFibGUvZGlzYWJsZSB1cHBlcmNhc2UgaGV4YWRlY2ltYWwgcmV0dXJuZWQgc3RyaW5nXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59XG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoaXNcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgICAgdGhpcy5zZXRVcHBlckNhc2UgPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgaGV4Y2FzZSA9IGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBAZGVzY3JpcHRpb24gRGVmaW5lcyBhIGJhc2U2NCBwYWQgc3RyaW5nXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gUGFkXG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoaXNcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgICAgdGhpcy5zZXRQYWQgPSBmdW5jdGlvbihhKSB7XG4gICAgICAgIGI2NHBhZCA9IGEgfHwgYjY0cGFkO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIERlZmluZXMgYSBiYXNlNjQgcGFkIHN0cmluZ1xuICAgICAgICogQHBhcmFtIHtib29sZWFufVxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2V0VVRGOCA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICB1dGY4ID0gYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG5cbiAgICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgICAvKipcbiAgICAgICAqIENhbGN1bGF0ZSB0aGUgU0hBLTUxMiBvZiBhIHJhdyBzdHJpbmdcbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiByc3RyKHMsIHV0ZjgpIHtcbiAgICAgICAgcyA9ICh1dGY4KSA/IHV0ZjhFbmNvZGUocykgOiBzO1xuICAgICAgICByZXR1cm4gYmluYjJyc3RyKGJpbmIocnN0cjJiaW5iKHMpLCBzLmxlbmd0aCAqIDgpKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDYWxjdWxhdGUgdGhlIEhNQUMtc2hhMjU2IG9mIGEga2V5IGFuZCBzb21lIGRhdGEgKHJhdyBzdHJpbmdzKVxuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIHJzdHJfaG1hYyhrZXksIGRhdGEpIHtcbiAgICAgICAga2V5ID0gKHV0ZjgpID8gdXRmOEVuY29kZShrZXkpIDoga2V5O1xuICAgICAgICBkYXRhID0gKHV0ZjgpID8gdXRmOEVuY29kZShkYXRhKSA6IGRhdGE7XG4gICAgICAgIHZhciBoYXNoLCBpID0gMCxcbiAgICAgICAgICBia2V5ID0gcnN0cjJiaW5iKGtleSksXG4gICAgICAgICAgaXBhZCA9IEFycmF5KDE2KSxcbiAgICAgICAgICBvcGFkID0gQXJyYXkoMTYpO1xuXG4gICAgICAgIGlmIChia2V5Lmxlbmd0aCA+IDE2KSB7XG4gICAgICAgICAgYmtleSA9IGJpbmIoYmtleSwga2V5Lmxlbmd0aCAqIDgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICg7IGkgPCAxNjsgaSArPSAxKSB7XG4gICAgICAgICAgaXBhZFtpXSA9IGJrZXlbaV0gXiAweDM2MzYzNjM2O1xuICAgICAgICAgIG9wYWRbaV0gPSBia2V5W2ldIF4gMHg1QzVDNUM1QztcbiAgICAgICAgfVxuXG4gICAgICAgIGhhc2ggPSBiaW5iKGlwYWQuY29uY2F0KHJzdHIyYmluYihkYXRhKSksIDUxMiArIGRhdGEubGVuZ3RoICogOCk7XG4gICAgICAgIHJldHVybiBiaW5iMnJzdHIoYmluYihvcGFkLmNvbmNhdChoYXNoKSwgNTEyICsgMjU2KSk7XG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICAgKiBNYWluIHNoYTI1NiBmdW5jdGlvbiwgd2l0aCBpdHMgc3VwcG9ydCBmdW5jdGlvbnNcbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiBzaGEyNTZfUyhYLCBuKSB7XG4gICAgICAgIHJldHVybiAoWCA+Pj4gbikgfCAoWCA8PCAoMzIgLSBuKSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNoYTI1Nl9SKFgsIG4pIHtcbiAgICAgICAgcmV0dXJuIChYID4+PiBuKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hhMjU2X0NoKHgsIHksIHopIHtcbiAgICAgICAgcmV0dXJuICgoeCAmIHkpIF4gKCh+eCkgJiB6KSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNoYTI1Nl9NYWooeCwgeSwgeikge1xuICAgICAgICByZXR1cm4gKCh4ICYgeSkgXiAoeCAmIHopIF4gKHkgJiB6KSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHNoYTI1Nl9TaWdtYTAyNTYoeCkge1xuICAgICAgICByZXR1cm4gKHNoYTI1Nl9TKHgsIDIpIF4gc2hhMjU2X1MoeCwgMTMpIF4gc2hhMjU2X1MoeCwgMjIpKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hhMjU2X1NpZ21hMTI1Nih4KSB7XG4gICAgICAgIHJldHVybiAoc2hhMjU2X1MoeCwgNikgXiBzaGEyNTZfUyh4LCAxMSkgXiBzaGEyNTZfUyh4LCAyNSkpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzaGEyNTZfR2FtbWEwMjU2KHgpIHtcbiAgICAgICAgcmV0dXJuIChzaGEyNTZfUyh4LCA3KSBeIHNoYTI1Nl9TKHgsIDE4KSBeIHNoYTI1Nl9SKHgsIDMpKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hhMjU2X0dhbW1hMTI1Nih4KSB7XG4gICAgICAgIHJldHVybiAoc2hhMjU2X1MoeCwgMTcpIF4gc2hhMjU2X1MoeCwgMTkpIF4gc2hhMjU2X1IoeCwgMTApKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hhMjU2X1NpZ21hMDUxMih4KSB7XG4gICAgICAgIHJldHVybiAoc2hhMjU2X1MoeCwgMjgpIF4gc2hhMjU2X1MoeCwgMzQpIF4gc2hhMjU2X1MoeCwgMzkpKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hhMjU2X1NpZ21hMTUxMih4KSB7XG4gICAgICAgIHJldHVybiAoc2hhMjU2X1MoeCwgMTQpIF4gc2hhMjU2X1MoeCwgMTgpIF4gc2hhMjU2X1MoeCwgNDEpKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hhMjU2X0dhbW1hMDUxMih4KSB7XG4gICAgICAgIHJldHVybiAoc2hhMjU2X1MoeCwgMSkgXiBzaGEyNTZfUyh4LCA4KSBeIHNoYTI1Nl9SKHgsIDcpKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2hhMjU2X0dhbW1hMTUxMih4KSB7XG4gICAgICAgIHJldHVybiAoc2hhMjU2X1MoeCwgMTkpIF4gc2hhMjU2X1MoeCwgNjEpIF4gc2hhMjU2X1IoeCwgNikpO1xuICAgICAgfVxuXG4gICAgICBzaGEyNTZfSyA9IFtcbiAgICAgICAgMTExNjM1MjQwOCwgMTg5OTQ0NzQ0MSwgLTEyNDU2NDM4MjUsIC0zNzM5NTc3MjMsIDk2MTk4NzE2MywgMTUwODk3MDk5MywgLTE4NDEzMzE1NDgsIC0xNDI0MjA0MDc1LCAtNjcwNTg2MjE2LCAzMTA1OTg0MDEsIDYwNzIyNTI3OCwgMTQyNjg4MTk4NyxcbiAgICAgICAgMTkyNTA3ODM4OCwgLTIxMzI4ODkwOTAsIC0xNjgwMDc5MTkzLCAtMTA0Njc0NDcxNiwgLTQ1OTU3Njg5NSwgLTI3Mjc0MjUyMixcbiAgICAgICAgMjY0MzQ3MDc4LCA2MDQ4MDc2MjgsIDc3MDI1NTk4MywgMTI0OTE1MDEyMiwgMTU1NTA4MTY5MiwgMTk5NjA2NDk4NiwgLTE3NDA3NDY0MTQsIC0xNDczMTMyOTQ3LCAtMTM0MTk3MDQ4OCwgLTEwODQ2NTM2MjUsIC05NTgzOTU0MDUsIC03MTA0Mzg1ODUsXG4gICAgICAgIDExMzkyNjk5MywgMzM4MjQxODk1LCA2NjYzMDcyMDUsIDc3MzUyOTkxMiwgMTI5NDc1NzM3MiwgMTM5NjE4MjI5MSxcbiAgICAgICAgMTY5NTE4MzcwMCwgMTk4NjY2MTA1MSwgLTIxMTc5NDA5NDYsIC0xODM4MDExMjU5LCAtMTU2NDQ4MTM3NSwgLTE0NzQ2NjQ4ODUsIC0xMDM1MjM2NDk2LCAtOTQ5MjAyNTI1LCAtNzc4OTAxNDc5LCAtNjk0NjE0NDkyLCAtMjAwMzk1Mzg3LCAyNzU0MjMzNDQsXG4gICAgICAgIDQzMDIyNzczNCwgNTA2OTQ4NjE2LCA2NTkwNjA1NTYsIDg4Mzk5Nzg3NywgOTU4MTM5NTcxLCAxMzIyODIyMjE4LFxuICAgICAgICAxNTM3MDAyMDYzLCAxNzQ3ODczNzc5LCAxOTU1NTYyMjIyLCAyMDI0MTA0ODE1LCAtMjA2NzIzNjg0NCwgLTE5MzMxMTQ4NzIsIC0xODY2NTMwODIyLCAtMTUzODIzMzEwOSwgLTEwOTA5MzU4MTcsIC05NjU2NDE5OThcbiAgICAgIF07XG5cbiAgICAgIGZ1bmN0aW9uIGJpbmIobSwgbCkge1xuICAgICAgICB2YXIgSEFTSCA9IFsxNzc5MDMzNzAzLCAtMTE1MDgzMzAxOSwgMTAxMzkwNDI0MiwgLTE1MjE0ODY1MzQsXG4gICAgICAgICAgMTM1OTg5MzExOSwgLTE2OTQxNDQzNzIsIDUyODczNDYzNSwgMTU0MTQ1OTIyNVxuICAgICAgICBdO1xuICAgICAgICB2YXIgVyA9IG5ldyBBcnJheSg2NCk7XG4gICAgICAgIHZhciBhLCBiLCBjLCBkLCBlLCBmLCBnLCBoO1xuICAgICAgICB2YXIgaSwgaiwgVDEsIFQyO1xuXG4gICAgICAgIC8qIGFwcGVuZCBwYWRkaW5nICovXG4gICAgICAgIG1bbCA+PiA1XSB8PSAweDgwIDw8ICgyNCAtIGwgJSAzMik7XG4gICAgICAgIG1bKChsICsgNjQgPj4gOSkgPDwgNCkgKyAxNV0gPSBsO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSArPSAxNikge1xuICAgICAgICAgIGEgPSBIQVNIWzBdO1xuICAgICAgICAgIGIgPSBIQVNIWzFdO1xuICAgICAgICAgIGMgPSBIQVNIWzJdO1xuICAgICAgICAgIGQgPSBIQVNIWzNdO1xuICAgICAgICAgIGUgPSBIQVNIWzRdO1xuICAgICAgICAgIGYgPSBIQVNIWzVdO1xuICAgICAgICAgIGcgPSBIQVNIWzZdO1xuICAgICAgICAgIGggPSBIQVNIWzddO1xuXG4gICAgICAgICAgZm9yIChqID0gMDsgaiA8IDY0OyBqICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChqIDwgMTYpIHtcbiAgICAgICAgICAgICAgV1tqXSA9IG1baiArIGldO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgV1tqXSA9IHNhZmVfYWRkKHNhZmVfYWRkKHNhZmVfYWRkKHNoYTI1Nl9HYW1tYTEyNTYoV1tqIC0gMl0pLCBXW2ogLSA3XSksXG4gICAgICAgICAgICAgICAgc2hhMjU2X0dhbW1hMDI1NihXW2ogLSAxNV0pKSwgV1tqIC0gMTZdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVDEgPSBzYWZlX2FkZChzYWZlX2FkZChzYWZlX2FkZChzYWZlX2FkZChoLCBzaGEyNTZfU2lnbWExMjU2KGUpKSwgc2hhMjU2X0NoKGUsIGYsIGcpKSxcbiAgICAgICAgICAgICAgc2hhMjU2X0tbal0pLCBXW2pdKTtcbiAgICAgICAgICAgIFQyID0gc2FmZV9hZGQoc2hhMjU2X1NpZ21hMDI1NihhKSwgc2hhMjU2X01haihhLCBiLCBjKSk7XG4gICAgICAgICAgICBoID0gZztcbiAgICAgICAgICAgIGcgPSBmO1xuICAgICAgICAgICAgZiA9IGU7XG4gICAgICAgICAgICBlID0gc2FmZV9hZGQoZCwgVDEpO1xuICAgICAgICAgICAgZCA9IGM7XG4gICAgICAgICAgICBjID0gYjtcbiAgICAgICAgICAgIGIgPSBhO1xuICAgICAgICAgICAgYSA9IHNhZmVfYWRkKFQxLCBUMik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgSEFTSFswXSA9IHNhZmVfYWRkKGEsIEhBU0hbMF0pO1xuICAgICAgICAgIEhBU0hbMV0gPSBzYWZlX2FkZChiLCBIQVNIWzFdKTtcbiAgICAgICAgICBIQVNIWzJdID0gc2FmZV9hZGQoYywgSEFTSFsyXSk7XG4gICAgICAgICAgSEFTSFszXSA9IHNhZmVfYWRkKGQsIEhBU0hbM10pO1xuICAgICAgICAgIEhBU0hbNF0gPSBzYWZlX2FkZChlLCBIQVNIWzRdKTtcbiAgICAgICAgICBIQVNIWzVdID0gc2FmZV9hZGQoZiwgSEFTSFs1XSk7XG4gICAgICAgICAgSEFTSFs2XSA9IHNhZmVfYWRkKGcsIEhBU0hbNl0pO1xuICAgICAgICAgIEhBU0hbN10gPSBzYWZlX2FkZChoLCBIQVNIWzddKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSEFTSDtcbiAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgSGFzaGVzLlNIQTUxMlxuICAgICAqIEBwYXJhbSB7Y29uZmlnfVxuICAgICAqXG4gICAgICogQSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBTZWN1cmUgSGFzaCBBbGdvcml0aG0sIFNIQS01MTIsIGFzIGRlZmluZWQgaW4gRklQUyAxODAtMlxuICAgICAqIFZlcnNpb24gMi4yIENvcHlyaWdodCBBbm9ueW1vdXMgQ29udHJpYnV0b3IsIFBhdWwgSm9obnN0b24gMjAwMCAtIDIwMDkuXG4gICAgICogT3RoZXIgY29udHJpYnV0b3JzOiBHcmVnIEhvbHQsIEFuZHJldyBLZXBlcnQsIFlkbmFyLCBMb3N0aW5ldFxuICAgICAqIFNlZSBodHRwOi8vcGFqaG9tZS5vcmcudWsvY3J5cHQvbWQ1IGZvciBkZXRhaWxzLlxuICAgICAqL1xuICAgIFNIQTUxMjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgLyoqXG4gICAgICAgKiBQcml2YXRlIHByb3BlcnRpZXMgY29uZmlndXJhdGlvbiB2YXJpYWJsZXMuIFlvdSBtYXkgbmVlZCB0byB0d2VhayB0aGVzZSB0byBiZSBjb21wYXRpYmxlIHdpdGhcbiAgICAgICAqIHRoZSBzZXJ2ZXItc2lkZSwgYnV0IHRoZSBkZWZhdWx0cyB3b3JrIGluIG1vc3QgY2FzZXMuXG4gICAgICAgKiBAc2VlIHRoaXMuc2V0VXBwZXJDYXNlKCkgbWV0aG9kXG4gICAgICAgKiBAc2VlIHRoaXMuc2V0UGFkKCkgbWV0aG9kXG4gICAgICAgKi9cbiAgICAgIHZhciBoZXhjYXNlID0gKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMudXBwZXJjYXNlID09PSAnYm9vbGVhbicpID8gb3B0aW9ucy51cHBlcmNhc2UgOiBmYWxzZSxcbiAgICAgICAgLyogaGV4YWRlY2ltYWwgb3V0cHV0IGNhc2UgZm9ybWF0LiBmYWxzZSAtIGxvd2VyY2FzZTsgdHJ1ZSAtIHVwcGVyY2FzZSAgKi9cbiAgICAgICAgYjY0cGFkID0gKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMucGFkID09PSAnc3RyaW5nJykgPyBvcHRpb25zLnBhZCA6ICc9JyxcbiAgICAgICAgLyogYmFzZS02NCBwYWQgY2hhcmFjdGVyLiBEZWZhdWx0ICc9JyBmb3Igc3RyaWN0IFJGQyBjb21wbGlhbmNlICAgKi9cbiAgICAgICAgdXRmOCA9IChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnV0ZjggPT09ICdib29sZWFuJykgPyBvcHRpb25zLnV0ZjggOiB0cnVlLFxuICAgICAgICAvKiBlbmFibGUvZGlzYWJsZSB1dGY4IGVuY29kaW5nICovXG4gICAgICAgIHNoYTUxMl9rO1xuXG4gICAgICAvKiBwcml2aWxlZ2VkIChwdWJsaWMpIG1ldGhvZHMgKi9cbiAgICAgIHRoaXMuaGV4ID0gZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcnN0cjJoZXgocnN0cihzKSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5iNjQgPSBmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiByc3RyMmI2NChyc3RyKHMpLCBiNjRwYWQpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYW55ID0gZnVuY3Rpb24ocywgZSkge1xuICAgICAgICByZXR1cm4gcnN0cjJhbnkocnN0cihzKSwgZSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5yYXcgPSBmdW5jdGlvbihzKSB7XG4gICAgICAgIHJldHVybiByc3RyKHMsIHV0ZjgpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuaGV4X2htYWMgPSBmdW5jdGlvbihrLCBkKSB7XG4gICAgICAgIHJldHVybiByc3RyMmhleChyc3RyX2htYWMoaywgZCkpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYjY0X2htYWMgPSBmdW5jdGlvbihrLCBkKSB7XG4gICAgICAgIHJldHVybiByc3RyMmI2NChyc3RyX2htYWMoaywgZCksIGI2NHBhZCk7XG4gICAgICB9O1xuICAgICAgdGhpcy5hbnlfaG1hYyA9IGZ1bmN0aW9uKGssIGQsIGUpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYW55KHJzdHJfaG1hYyhrLCBkKSwgZSk7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBQZXJmb3JtIGEgc2ltcGxlIHNlbGYtdGVzdCB0byBzZWUgaWYgdGhlIFZNIGlzIHdvcmtpbmdcbiAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gSGV4YWRlY2ltYWwgaGFzaCBzYW1wbGVcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgICAgdGhpcy52bV90ZXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBoZXgoJ2FiYycpLnRvTG93ZXJDYXNlKCkgPT09ICc5MDAxNTA5ODNjZDI0ZmIwZDY5NjNmN2QyOGUxN2Y3Mic7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBAZGVzY3JpcHRpb24gRW5hYmxlL2Rpc2FibGUgdXBwZXJjYXNlIGhleGFkZWNpbWFsIHJldHVybmVkIHN0cmluZ1xuICAgICAgICogQHBhcmFtIHtib29sZWFufVxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2V0VXBwZXJDYXNlID0gZnVuY3Rpb24oYSkge1xuICAgICAgICBpZiAodHlwZW9mIGEgPT09ICdib29sZWFuJykge1xuICAgICAgICAgIGhleGNhc2UgPSBhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogQGRlc2NyaXB0aW9uIERlZmluZXMgYSBiYXNlNjQgcGFkIHN0cmluZ1xuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IFBhZFxuICAgICAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc2V0UGFkID0gZnVuY3Rpb24oYSkge1xuICAgICAgICBiNjRwYWQgPSBhIHx8IGI2NHBhZDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBAZGVzY3JpcHRpb24gRGVmaW5lcyBhIGJhc2U2NCBwYWQgc3RyaW5nXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59XG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoaXNcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgICAgdGhpcy5zZXRVVEY4ID0gZnVuY3Rpb24oYSkge1xuICAgICAgICBpZiAodHlwZW9mIGEgPT09ICdib29sZWFuJykge1xuICAgICAgICAgIHV0ZjggPSBhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcblxuICAgICAgLyogcHJpdmF0ZSBtZXRob2RzICovXG5cbiAgICAgIC8qKlxuICAgICAgICogQ2FsY3VsYXRlIHRoZSBTSEEtNTEyIG9mIGEgcmF3IHN0cmluZ1xuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIHJzdHIocykge1xuICAgICAgICBzID0gKHV0ZjgpID8gdXRmOEVuY29kZShzKSA6IHM7XG4gICAgICAgIHJldHVybiBiaW5iMnJzdHIoYmluYihyc3RyMmJpbmIocyksIHMubGVuZ3RoICogOCkpO1xuICAgICAgfVxuICAgICAgLypcbiAgICAgICAqIENhbGN1bGF0ZSB0aGUgSE1BQy1TSEEtNTEyIG9mIGEga2V5IGFuZCBzb21lIGRhdGEgKHJhdyBzdHJpbmdzKVxuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIHJzdHJfaG1hYyhrZXksIGRhdGEpIHtcbiAgICAgICAga2V5ID0gKHV0ZjgpID8gdXRmOEVuY29kZShrZXkpIDoga2V5O1xuICAgICAgICBkYXRhID0gKHV0ZjgpID8gdXRmOEVuY29kZShkYXRhKSA6IGRhdGE7XG5cbiAgICAgICAgdmFyIGhhc2gsIGkgPSAwLFxuICAgICAgICAgIGJrZXkgPSByc3RyMmJpbmIoa2V5KSxcbiAgICAgICAgICBpcGFkID0gQXJyYXkoMzIpLFxuICAgICAgICAgIG9wYWQgPSBBcnJheSgzMik7XG5cbiAgICAgICAgaWYgKGJrZXkubGVuZ3RoID4gMzIpIHtcbiAgICAgICAgICBia2V5ID0gYmluYihia2V5LCBrZXkubGVuZ3RoICogOCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKDsgaSA8IDMyOyBpICs9IDEpIHtcbiAgICAgICAgICBpcGFkW2ldID0gYmtleVtpXSBeIDB4MzYzNjM2MzY7XG4gICAgICAgICAgb3BhZFtpXSA9IGJrZXlbaV0gXiAweDVDNUM1QzVDO1xuICAgICAgICB9XG5cbiAgICAgICAgaGFzaCA9IGJpbmIoaXBhZC5jb25jYXQocnN0cjJiaW5iKGRhdGEpKSwgMTAyNCArIGRhdGEubGVuZ3RoICogOCk7XG4gICAgICAgIHJldHVybiBiaW5iMnJzdHIoYmluYihvcGFkLmNvbmNhdChoYXNoKSwgMTAyNCArIDUxMikpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIENhbGN1bGF0ZSB0aGUgU0hBLTUxMiBvZiBhbiBhcnJheSBvZiBiaWctZW5kaWFuIGR3b3JkcywgYW5kIGEgYml0IGxlbmd0aFxuICAgICAgICovXG5cbiAgICAgIGZ1bmN0aW9uIGJpbmIoeCwgbGVuKSB7XG4gICAgICAgIHZhciBqLCBpLCBsLFxuICAgICAgICAgIFcgPSBuZXcgQXJyYXkoODApLFxuICAgICAgICAgIGhhc2ggPSBuZXcgQXJyYXkoMTYpLFxuICAgICAgICAgIC8vSW5pdGlhbCBoYXNoIHZhbHVlc1xuICAgICAgICAgIEggPSBbXG4gICAgICAgICAgICBuZXcgaW50NjQoMHg2YTA5ZTY2NywgLTIwNTczMTU3NiksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTExNTA4MzMwMTksIC0yMDY3MDkzNzAxKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDNjNmVmMzcyLCAtMjM3OTE1NzMpLFxuICAgICAgICAgICAgbmV3IGludDY0KC0xNTIxNDg2NTM0LCAweDVmMWQzNmYxKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDUxMGU1MjdmLCAtMTM3NzQwMjE1OSksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTE2OTQxNDQzNzIsIDB4MmIzZTZjMWYpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4MWY4M2Q5YWIsIC03OTU3Nzc0OSksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHg1YmUwY2QxOSwgMHgxMzdlMjE3OSlcbiAgICAgICAgICBdLFxuICAgICAgICAgIFQxID0gbmV3IGludDY0KDAsIDApLFxuICAgICAgICAgIFQyID0gbmV3IGludDY0KDAsIDApLFxuICAgICAgICAgIGEgPSBuZXcgaW50NjQoMCwgMCksXG4gICAgICAgICAgYiA9IG5ldyBpbnQ2NCgwLCAwKSxcbiAgICAgICAgICBjID0gbmV3IGludDY0KDAsIDApLFxuICAgICAgICAgIGQgPSBuZXcgaW50NjQoMCwgMCksXG4gICAgICAgICAgZSA9IG5ldyBpbnQ2NCgwLCAwKSxcbiAgICAgICAgICBmID0gbmV3IGludDY0KDAsIDApLFxuICAgICAgICAgIGcgPSBuZXcgaW50NjQoMCwgMCksXG4gICAgICAgICAgaCA9IG5ldyBpbnQ2NCgwLCAwKSxcbiAgICAgICAgICAvL1RlbXBvcmFyeSB2YXJpYWJsZXMgbm90IHNwZWNpZmllZCBieSB0aGUgZG9jdW1lbnRcbiAgICAgICAgICBzMCA9IG5ldyBpbnQ2NCgwLCAwKSxcbiAgICAgICAgICBzMSA9IG5ldyBpbnQ2NCgwLCAwKSxcbiAgICAgICAgICBDaCA9IG5ldyBpbnQ2NCgwLCAwKSxcbiAgICAgICAgICBNYWogPSBuZXcgaW50NjQoMCwgMCksXG4gICAgICAgICAgcjEgPSBuZXcgaW50NjQoMCwgMCksXG4gICAgICAgICAgcjIgPSBuZXcgaW50NjQoMCwgMCksXG4gICAgICAgICAgcjMgPSBuZXcgaW50NjQoMCwgMCk7XG5cbiAgICAgICAgaWYgKHNoYTUxMl9rID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvL1NIQTUxMiBjb25zdGFudHNcbiAgICAgICAgICBzaGE1MTJfayA9IFtcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDQyOGEyZjk4LCAtNjg1MTk5ODM4KSwgbmV3IGludDY0KDB4NzEzNzQ0OTEsIDB4MjNlZjY1Y2QpLFxuICAgICAgICAgICAgbmV3IGludDY0KC0xMjQ1NjQzODI1LCAtMzMwNDgyODk3KSwgbmV3IGludDY0KC0zNzM5NTc3MjMsIC0yMTIxNjcxNzQ4KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDM5NTZjMjViLCAtMjEzMzM4ODI0KSwgbmV3IGludDY0KDB4NTlmMTExZjEsIC0xMjQxMTMzMDMxKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtMTg0MTMzMTU0OCwgLTEzNTcyOTU3MTcpLCBuZXcgaW50NjQoLTE0MjQyMDQwNzUsIC02MzAzNTc3MzYpLFxuICAgICAgICAgICAgbmV3IGludDY0KC02NzA1ODYyMTYsIC0xNTYwMDgzOTAyKSwgbmV3IGludDY0KDB4MTI4MzViMDEsIDB4NDU3MDZmYmUpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4MjQzMTg1YmUsIDB4NGVlNGIyOGMpLCBuZXcgaW50NjQoMHg1NTBjN2RjMywgLTcwNDY2MjMwMiksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHg3MmJlNWQ3NCwgLTIyNjc4NDkxMyksIG5ldyBpbnQ2NCgtMjEzMjg4OTA5MCwgMHgzYjE2OTZiMSksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTE2ODAwNzkxOTMsIDB4MjVjNzEyMzUpLCBuZXcgaW50NjQoLTEwNDY3NDQ3MTYsIC04MTUxOTI0MjgpLFxuICAgICAgICAgICAgbmV3IGludDY0KC00NTk1NzY4OTUsIC0xNjI4MzUzODM4KSwgbmV3IGludDY0KC0yNzI3NDI1MjIsIDB4Mzg0ZjI1ZTMpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4ZmMxOWRjNiwgLTE5NTM3MDQ1MjMpLCBuZXcgaW50NjQoMHgyNDBjYTFjYywgMHg3N2FjOWM2NSksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHgyZGU5MmM2ZiwgMHg1OTJiMDI3NSksIG5ldyBpbnQ2NCgweDRhNzQ4NGFhLCAweDZlYTZlNDgzKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDVjYjBhOWRjLCAtMTExOTc0OTE2NCksIG5ldyBpbnQ2NCgweDc2Zjk4OGRhLCAtMjA5NjAxNjQ1OSksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTE3NDA3NDY0MTQsIC0yOTUyNDc5NTcpLCBuZXcgaW50NjQoLTE0NzMxMzI5NDcsIDB4MmRiNDMyMTApLFxuICAgICAgICAgICAgbmV3IGludDY0KC0xMzQxOTcwNDg4LCAtMTcyODM3MjQxNyksIG5ldyBpbnQ2NCgtMTA4NDY1MzYyNSwgLTEwOTE2MjkzNDApLFxuICAgICAgICAgICAgbmV3IGludDY0KC05NTgzOTU0MDUsIDB4M2RhODhmYzIpLCBuZXcgaW50NjQoLTcxMDQzODU4NSwgLTE4MjgwMTgzOTUpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4NmNhNjM1MSwgLTUzNjY0MDkxMyksIG5ldyBpbnQ2NCgweDE0MjkyOTY3LCAweGEwZTZlNzApLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4MjdiNzBhODUsIDB4NDZkMjJmZmMpLCBuZXcgaW50NjQoMHgyZTFiMjEzOCwgMHg1YzI2YzkyNiksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHg0ZDJjNmRmYywgMHg1YWM0MmFlZCksIG5ldyBpbnQ2NCgweDUzMzgwZDEzLCAtMTY1MTEzMzQ3MyksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHg2NTBhNzM1NCwgLTE5NTE0Mzk5MDYpLCBuZXcgaW50NjQoMHg3NjZhMGFiYiwgMHgzYzc3YjJhOCksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTIxMTc5NDA5NDYsIDB4NDdlZGFlZTYpLCBuZXcgaW50NjQoLTE4MzgwMTEyNTksIDB4MTQ4MjM1M2IpLFxuICAgICAgICAgICAgbmV3IGludDY0KC0xNTY0NDgxMzc1LCAweDRjZjEwMzY0KSwgbmV3IGludDY0KC0xNDc0NjY0ODg1LCAtMTEzNjUxMzAyMyksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTEwMzUyMzY0OTYsIC03ODkwMTQ2MzkpLCBuZXcgaW50NjQoLTk0OTIwMjUyNSwgMHg2NTRiZTMwKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtNzc4OTAxNDc5LCAtNjg4OTU4OTUyKSwgbmV3IGludDY0KC02OTQ2MTQ0OTIsIDB4NTU2NWE5MTApLFxuICAgICAgICAgICAgbmV3IGludDY0KC0yMDAzOTUzODcsIDB4NTc3MTIwMmEpLCBuZXcgaW50NjQoMHgxMDZhYTA3MCwgMHgzMmJiZDFiOCksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHgxOWE0YzExNiwgLTExOTQxNDM1NDQpLCBuZXcgaW50NjQoMHgxZTM3NmMwOCwgMHg1MTQxYWI1MyksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHgyNzQ4Nzc0YywgLTU0NDI4MTcwMyksIG5ldyBpbnQ2NCgweDM0YjBiY2I1LCAtNTA5OTE3MDE2KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDM5MWMwY2IzLCAtOTc2NjU5ODY5KSwgbmV3IGludDY0KDB4NGVkOGFhNGEsIC00ODIyNDM4OTMpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4NWI5Y2NhNGYsIDB4Nzc2M2UzNzMpLCBuZXcgaW50NjQoMHg2ODJlNmZmMywgLTY5MjkzMDM5NyksXG4gICAgICAgICAgICBuZXcgaW50NjQoMHg3NDhmODJlZSwgMHg1ZGVmYjJmYyksIG5ldyBpbnQ2NCgweDc4YTU2MzZmLCAweDQzMTcyZjYwKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtMjA2NzIzNjg0NCwgLTE1NzgwNjI5OTApLCBuZXcgaW50NjQoLTE5MzMxMTQ4NzIsIDB4MWE2NDM5ZWMpLFxuICAgICAgICAgICAgbmV3IGludDY0KC0xODY2NTMwODIyLCAweDIzNjMxZTI4KSwgbmV3IGludDY0KC0xNTM4MjMzMTA5LCAtNTYxODU3MDQ3KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtMTA5MDkzNTgxNywgLTEyOTU2MTU3MjMpLCBuZXcgaW50NjQoLTk2NTY0MTk5OCwgLTQ3OTA0Njg2OSksXG4gICAgICAgICAgICBuZXcgaW50NjQoLTkwMzM5NzY4MiwgLTM2NjU4MzM5NiksIG5ldyBpbnQ2NCgtNzc5NzAwMDI1LCAweDIxYzBjMjA3KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgtMzU0Nzc5NjkwLCAtODQwODk3NzYyKSwgbmV3IGludDY0KC0xNzYzMzcwMjUsIC0yOTQ3MjczMDQpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4NmYwNjdhYSwgMHg3MjE3NmZiYSksIG5ldyBpbnQ2NCgweGE2MzdkYzUsIC0xNTYzOTEyMDI2KSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDExM2Y5ODA0LCAtMTA5MDk3NDI5MCksIG5ldyBpbnQ2NCgweDFiNzEwYjM1LCAweDEzMWM0NzFiKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDI4ZGI3N2Y1LCAweDIzMDQ3ZDg0KSwgbmV3IGludDY0KDB4MzJjYWFiN2IsIDB4NDBjNzI0OTMpLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4M2M5ZWJlMGEsIDB4MTVjOWJlYmMpLCBuZXcgaW50NjQoMHg0MzFkNjdjNCwgLTE2NzY2Njk2MjApLFxuICAgICAgICAgICAgbmV3IGludDY0KDB4NGNjNWQ0YmUsIC04ODUxMTIxMzgpLCBuZXcgaW50NjQoMHg1OTdmMjk5YywgLTYwNDU3NDMwKSxcbiAgICAgICAgICAgIG5ldyBpbnQ2NCgweDVmY2I2ZmFiLCAweDNhZDZmYWVjKSwgbmV3IGludDY0KDB4NmM0NDE5OGMsIDB4NGE0NzU4MTcpXG4gICAgICAgICAgXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCA4MDsgaSArPSAxKSB7XG4gICAgICAgICAgV1tpXSA9IG5ldyBpbnQ2NCgwLCAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFwcGVuZCBwYWRkaW5nIHRvIHRoZSBzb3VyY2Ugc3RyaW5nLiBUaGUgZm9ybWF0IGlzIGRlc2NyaWJlZCBpbiB0aGUgRklQUy5cbiAgICAgICAgeFtsZW4gPj4gNV0gfD0gMHg4MCA8PCAoMjQgLSAobGVuICYgMHgxZikpO1xuICAgICAgICB4WygobGVuICsgMTI4ID4+IDEwKSA8PCA1KSArIDMxXSA9IGxlbjtcbiAgICAgICAgbCA9IHgubGVuZ3RoO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAzMikgeyAvLzMyIGR3b3JkcyBpcyB0aGUgYmxvY2sgc2l6ZVxuICAgICAgICAgIGludDY0Y29weShhLCBIWzBdKTtcbiAgICAgICAgICBpbnQ2NGNvcHkoYiwgSFsxXSk7XG4gICAgICAgICAgaW50NjRjb3B5KGMsIEhbMl0pO1xuICAgICAgICAgIGludDY0Y29weShkLCBIWzNdKTtcbiAgICAgICAgICBpbnQ2NGNvcHkoZSwgSFs0XSk7XG4gICAgICAgICAgaW50NjRjb3B5KGYsIEhbNV0pO1xuICAgICAgICAgIGludDY0Y29weShnLCBIWzZdKTtcbiAgICAgICAgICBpbnQ2NGNvcHkoaCwgSFs3XSk7XG5cbiAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgMTY7IGogKz0gMSkge1xuICAgICAgICAgICAgV1tqXS5oID0geFtpICsgMiAqIGpdO1xuICAgICAgICAgICAgV1tqXS5sID0geFtpICsgMiAqIGogKyAxXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGogPSAxNjsgaiA8IDgwOyBqICs9IDEpIHtcbiAgICAgICAgICAgIC8vc2lnbWExXG4gICAgICAgICAgICBpbnQ2NHJyb3QocjEsIFdbaiAtIDJdLCAxOSk7XG4gICAgICAgICAgICBpbnQ2NHJldnJyb3QocjIsIFdbaiAtIDJdLCAyOSk7XG4gICAgICAgICAgICBpbnQ2NHNocihyMywgV1tqIC0gMl0sIDYpO1xuICAgICAgICAgICAgczEubCA9IHIxLmwgXiByMi5sIF4gcjMubDtcbiAgICAgICAgICAgIHMxLmggPSByMS5oIF4gcjIuaCBeIHIzLmg7XG4gICAgICAgICAgICAvL3NpZ21hMFxuICAgICAgICAgICAgaW50NjRycm90KHIxLCBXW2ogLSAxNV0sIDEpO1xuICAgICAgICAgICAgaW50NjRycm90KHIyLCBXW2ogLSAxNV0sIDgpO1xuICAgICAgICAgICAgaW50NjRzaHIocjMsIFdbaiAtIDE1XSwgNyk7XG4gICAgICAgICAgICBzMC5sID0gcjEubCBeIHIyLmwgXiByMy5sO1xuICAgICAgICAgICAgczAuaCA9IHIxLmggXiByMi5oIF4gcjMuaDtcblxuICAgICAgICAgICAgaW50NjRhZGQ0KFdbal0sIHMxLCBXW2ogLSA3XSwgczAsIFdbaiAtIDE2XSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yIChqID0gMDsgaiA8IDgwOyBqICs9IDEpIHtcbiAgICAgICAgICAgIC8vQ2hcbiAgICAgICAgICAgIENoLmwgPSAoZS5sICYgZi5sKSBeICh+ZS5sICYgZy5sKTtcbiAgICAgICAgICAgIENoLmggPSAoZS5oICYgZi5oKSBeICh+ZS5oICYgZy5oKTtcblxuICAgICAgICAgICAgLy9TaWdtYTFcbiAgICAgICAgICAgIGludDY0cnJvdChyMSwgZSwgMTQpO1xuICAgICAgICAgICAgaW50NjRycm90KHIyLCBlLCAxOCk7XG4gICAgICAgICAgICBpbnQ2NHJldnJyb3QocjMsIGUsIDkpO1xuICAgICAgICAgICAgczEubCA9IHIxLmwgXiByMi5sIF4gcjMubDtcbiAgICAgICAgICAgIHMxLmggPSByMS5oIF4gcjIuaCBeIHIzLmg7XG5cbiAgICAgICAgICAgIC8vU2lnbWEwXG4gICAgICAgICAgICBpbnQ2NHJyb3QocjEsIGEsIDI4KTtcbiAgICAgICAgICAgIGludDY0cmV2cnJvdChyMiwgYSwgMik7XG4gICAgICAgICAgICBpbnQ2NHJldnJyb3QocjMsIGEsIDcpO1xuICAgICAgICAgICAgczAubCA9IHIxLmwgXiByMi5sIF4gcjMubDtcbiAgICAgICAgICAgIHMwLmggPSByMS5oIF4gcjIuaCBeIHIzLmg7XG5cbiAgICAgICAgICAgIC8vTWFqXG4gICAgICAgICAgICBNYWoubCA9IChhLmwgJiBiLmwpIF4gKGEubCAmIGMubCkgXiAoYi5sICYgYy5sKTtcbiAgICAgICAgICAgIE1hai5oID0gKGEuaCAmIGIuaCkgXiAoYS5oICYgYy5oKSBeIChiLmggJiBjLmgpO1xuXG4gICAgICAgICAgICBpbnQ2NGFkZDUoVDEsIGgsIHMxLCBDaCwgc2hhNTEyX2tbal0sIFdbal0pO1xuICAgICAgICAgICAgaW50NjRhZGQoVDIsIHMwLCBNYWopO1xuXG4gICAgICAgICAgICBpbnQ2NGNvcHkoaCwgZyk7XG4gICAgICAgICAgICBpbnQ2NGNvcHkoZywgZik7XG4gICAgICAgICAgICBpbnQ2NGNvcHkoZiwgZSk7XG4gICAgICAgICAgICBpbnQ2NGFkZChlLCBkLCBUMSk7XG4gICAgICAgICAgICBpbnQ2NGNvcHkoZCwgYyk7XG4gICAgICAgICAgICBpbnQ2NGNvcHkoYywgYik7XG4gICAgICAgICAgICBpbnQ2NGNvcHkoYiwgYSk7XG4gICAgICAgICAgICBpbnQ2NGFkZChhLCBUMSwgVDIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbnQ2NGFkZChIWzBdLCBIWzBdLCBhKTtcbiAgICAgICAgICBpbnQ2NGFkZChIWzFdLCBIWzFdLCBiKTtcbiAgICAgICAgICBpbnQ2NGFkZChIWzJdLCBIWzJdLCBjKTtcbiAgICAgICAgICBpbnQ2NGFkZChIWzNdLCBIWzNdLCBkKTtcbiAgICAgICAgICBpbnQ2NGFkZChIWzRdLCBIWzRdLCBlKTtcbiAgICAgICAgICBpbnQ2NGFkZChIWzVdLCBIWzVdLCBmKTtcbiAgICAgICAgICBpbnQ2NGFkZChIWzZdLCBIWzZdLCBnKTtcbiAgICAgICAgICBpbnQ2NGFkZChIWzddLCBIWzddLCBoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vcmVwcmVzZW50IHRoZSBoYXNoIGFzIGFuIGFycmF5IG9mIDMyLWJpdCBkd29yZHNcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDg7IGkgKz0gMSkge1xuICAgICAgICAgIGhhc2hbMiAqIGldID0gSFtpXS5oO1xuICAgICAgICAgIGhhc2hbMiAqIGkgKyAxXSA9IEhbaV0ubDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzaDtcbiAgICAgIH1cblxuICAgICAgLy9BIGNvbnN0cnVjdG9yIGZvciA2NC1iaXQgbnVtYmVyc1xuXG4gICAgICBmdW5jdGlvbiBpbnQ2NChoLCBsKSB7XG4gICAgICAgIHRoaXMuaCA9IGg7XG4gICAgICAgIHRoaXMubCA9IGw7XG4gICAgICAgIC8vdGhpcy50b1N0cmluZyA9IGludDY0dG9TdHJpbmc7XG4gICAgICB9XG5cbiAgICAgIC8vQ29waWVzIHNyYyBpbnRvIGRzdCwgYXNzdW1pbmcgYm90aCBhcmUgNjQtYml0IG51bWJlcnNcblxuICAgICAgZnVuY3Rpb24gaW50NjRjb3B5KGRzdCwgc3JjKSB7XG4gICAgICAgIGRzdC5oID0gc3JjLmg7XG4gICAgICAgIGRzdC5sID0gc3JjLmw7XG4gICAgICB9XG5cbiAgICAgIC8vUmlnaHQtcm90YXRlcyBhIDY0LWJpdCBudW1iZXIgYnkgc2hpZnRcbiAgICAgIC8vV29uJ3QgaGFuZGxlIGNhc2VzIG9mIHNoaWZ0Pj0zMlxuICAgICAgLy9UaGUgZnVuY3Rpb24gcmV2cnJvdCgpIGlzIGZvciB0aGF0XG5cbiAgICAgIGZ1bmN0aW9uIGludDY0cnJvdChkc3QsIHgsIHNoaWZ0KSB7XG4gICAgICAgIGRzdC5sID0gKHgubCA+Pj4gc2hpZnQpIHwgKHguaCA8PCAoMzIgLSBzaGlmdCkpO1xuICAgICAgICBkc3QuaCA9ICh4LmggPj4+IHNoaWZ0KSB8ICh4LmwgPDwgKDMyIC0gc2hpZnQpKTtcbiAgICAgIH1cblxuICAgICAgLy9SZXZlcnNlcyB0aGUgZHdvcmRzIG9mIHRoZSBzb3VyY2UgYW5kIHRoZW4gcm90YXRlcyByaWdodCBieSBzaGlmdC5cbiAgICAgIC8vVGhpcyBpcyBlcXVpdmFsZW50IHRvIHJvdGF0aW9uIGJ5IDMyK3NoaWZ0XG5cbiAgICAgIGZ1bmN0aW9uIGludDY0cmV2cnJvdChkc3QsIHgsIHNoaWZ0KSB7XG4gICAgICAgIGRzdC5sID0gKHguaCA+Pj4gc2hpZnQpIHwgKHgubCA8PCAoMzIgLSBzaGlmdCkpO1xuICAgICAgICBkc3QuaCA9ICh4LmwgPj4+IHNoaWZ0KSB8ICh4LmggPDwgKDMyIC0gc2hpZnQpKTtcbiAgICAgIH1cblxuICAgICAgLy9CaXR3aXNlLXNoaWZ0cyByaWdodCBhIDY0LWJpdCBudW1iZXIgYnkgc2hpZnRcbiAgICAgIC8vV29uJ3QgaGFuZGxlIHNoaWZ0Pj0zMiwgYnV0IGl0J3MgbmV2ZXIgbmVlZGVkIGluIFNIQTUxMlxuXG4gICAgICBmdW5jdGlvbiBpbnQ2NHNocihkc3QsIHgsIHNoaWZ0KSB7XG4gICAgICAgIGRzdC5sID0gKHgubCA+Pj4gc2hpZnQpIHwgKHguaCA8PCAoMzIgLSBzaGlmdCkpO1xuICAgICAgICBkc3QuaCA9ICh4LmggPj4+IHNoaWZ0KTtcbiAgICAgIH1cblxuICAgICAgLy9BZGRzIHR3byA2NC1iaXQgbnVtYmVyc1xuICAgICAgLy9MaWtlIHRoZSBvcmlnaW5hbCBpbXBsZW1lbnRhdGlvbiwgZG9lcyBub3QgcmVseSBvbiAzMi1iaXQgb3BlcmF0aW9uc1xuXG4gICAgICBmdW5jdGlvbiBpbnQ2NGFkZChkc3QsIHgsIHkpIHtcbiAgICAgICAgdmFyIHcwID0gKHgubCAmIDB4ZmZmZikgKyAoeS5sICYgMHhmZmZmKTtcbiAgICAgICAgdmFyIHcxID0gKHgubCA+Pj4gMTYpICsgKHkubCA+Pj4gMTYpICsgKHcwID4+PiAxNik7XG4gICAgICAgIHZhciB3MiA9ICh4LmggJiAweGZmZmYpICsgKHkuaCAmIDB4ZmZmZikgKyAodzEgPj4+IDE2KTtcbiAgICAgICAgdmFyIHczID0gKHguaCA+Pj4gMTYpICsgKHkuaCA+Pj4gMTYpICsgKHcyID4+PiAxNik7XG4gICAgICAgIGRzdC5sID0gKHcwICYgMHhmZmZmKSB8ICh3MSA8PCAxNik7XG4gICAgICAgIGRzdC5oID0gKHcyICYgMHhmZmZmKSB8ICh3MyA8PCAxNik7XG4gICAgICB9XG5cbiAgICAgIC8vU2FtZSwgZXhjZXB0IHdpdGggNCBhZGRlbmRzLiBXb3JrcyBmYXN0ZXIgdGhhbiBhZGRpbmcgdGhlbSBvbmUgYnkgb25lLlxuXG4gICAgICBmdW5jdGlvbiBpbnQ2NGFkZDQoZHN0LCBhLCBiLCBjLCBkKSB7XG4gICAgICAgIHZhciB3MCA9IChhLmwgJiAweGZmZmYpICsgKGIubCAmIDB4ZmZmZikgKyAoYy5sICYgMHhmZmZmKSArIChkLmwgJiAweGZmZmYpO1xuICAgICAgICB2YXIgdzEgPSAoYS5sID4+PiAxNikgKyAoYi5sID4+PiAxNikgKyAoYy5sID4+PiAxNikgKyAoZC5sID4+PiAxNikgKyAodzAgPj4+IDE2KTtcbiAgICAgICAgdmFyIHcyID0gKGEuaCAmIDB4ZmZmZikgKyAoYi5oICYgMHhmZmZmKSArIChjLmggJiAweGZmZmYpICsgKGQuaCAmIDB4ZmZmZikgKyAodzEgPj4+IDE2KTtcbiAgICAgICAgdmFyIHczID0gKGEuaCA+Pj4gMTYpICsgKGIuaCA+Pj4gMTYpICsgKGMuaCA+Pj4gMTYpICsgKGQuaCA+Pj4gMTYpICsgKHcyID4+PiAxNik7XG4gICAgICAgIGRzdC5sID0gKHcwICYgMHhmZmZmKSB8ICh3MSA8PCAxNik7XG4gICAgICAgIGRzdC5oID0gKHcyICYgMHhmZmZmKSB8ICh3MyA8PCAxNik7XG4gICAgICB9XG5cbiAgICAgIC8vU2FtZSwgZXhjZXB0IHdpdGggNSBhZGRlbmRzXG5cbiAgICAgIGZ1bmN0aW9uIGludDY0YWRkNShkc3QsIGEsIGIsIGMsIGQsIGUpIHtcbiAgICAgICAgdmFyIHcwID0gKGEubCAmIDB4ZmZmZikgKyAoYi5sICYgMHhmZmZmKSArIChjLmwgJiAweGZmZmYpICsgKGQubCAmIDB4ZmZmZikgKyAoZS5sICYgMHhmZmZmKSxcbiAgICAgICAgICB3MSA9IChhLmwgPj4+IDE2KSArIChiLmwgPj4+IDE2KSArIChjLmwgPj4+IDE2KSArIChkLmwgPj4+IDE2KSArIChlLmwgPj4+IDE2KSArICh3MCA+Pj4gMTYpLFxuICAgICAgICAgIHcyID0gKGEuaCAmIDB4ZmZmZikgKyAoYi5oICYgMHhmZmZmKSArIChjLmggJiAweGZmZmYpICsgKGQuaCAmIDB4ZmZmZikgKyAoZS5oICYgMHhmZmZmKSArICh3MSA+Pj4gMTYpLFxuICAgICAgICAgIHczID0gKGEuaCA+Pj4gMTYpICsgKGIuaCA+Pj4gMTYpICsgKGMuaCA+Pj4gMTYpICsgKGQuaCA+Pj4gMTYpICsgKGUuaCA+Pj4gMTYpICsgKHcyID4+PiAxNik7XG4gICAgICAgIGRzdC5sID0gKHcwICYgMHhmZmZmKSB8ICh3MSA8PCAxNik7XG4gICAgICAgIGRzdC5oID0gKHcyICYgMHhmZmZmKSB8ICh3MyA8PCAxNik7XG4gICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBAY2xhc3MgSGFzaGVzLlJNRDE2MFxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnXVxuICAgICAqXG4gICAgICogQSBKYXZhU2NyaXB0IGltcGxlbWVudGF0aW9uIG9mIHRoZSBSSVBFTUQtMTYwIEFsZ29yaXRobVxuICAgICAqIFZlcnNpb24gMi4yIENvcHlyaWdodCBKZXJlbXkgTGluLCBQYXVsIEpvaG5zdG9uIDIwMDAgLSAyMDA5LlxuICAgICAqIE90aGVyIGNvbnRyaWJ1dG9yczogR3JlZyBIb2x0LCBBbmRyZXcgS2VwZXJ0LCBZZG5hciwgTG9zdGluZXRcbiAgICAgKiBTZWUgaHR0cDovL3BhamhvbWUub3JnLnVrL2NyeXB0L21kNSBmb3IgZGV0YWlscy5cbiAgICAgKiBBbHNvIGh0dHA6Ly93d3cub2NmLmJlcmtlbGV5LmVkdS9+ampsaW4vanNvdHAvXG4gICAgICovXG4gICAgUk1EMTYwOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAvKipcbiAgICAgICAqIFByaXZhdGUgcHJvcGVydGllcyBjb25maWd1cmF0aW9uIHZhcmlhYmxlcy4gWW91IG1heSBuZWVkIHRvIHR3ZWFrIHRoZXNlIHRvIGJlIGNvbXBhdGlibGUgd2l0aFxuICAgICAgICogdGhlIHNlcnZlci1zaWRlLCBidXQgdGhlIGRlZmF1bHRzIHdvcmsgaW4gbW9zdCBjYXNlcy5cbiAgICAgICAqIEBzZWUgdGhpcy5zZXRVcHBlckNhc2UoKSBtZXRob2RcbiAgICAgICAqIEBzZWUgdGhpcy5zZXRQYWQoKSBtZXRob2RcbiAgICAgICAqL1xuICAgICAgdmFyIGhleGNhc2UgPSAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy51cHBlcmNhc2UgPT09ICdib29sZWFuJykgPyBvcHRpb25zLnVwcGVyY2FzZSA6IGZhbHNlLFxuICAgICAgICAvKiBoZXhhZGVjaW1hbCBvdXRwdXQgY2FzZSBmb3JtYXQuIGZhbHNlIC0gbG93ZXJjYXNlOyB0cnVlIC0gdXBwZXJjYXNlICAqL1xuICAgICAgICBiNjRwYWQgPSAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5wYWQgPT09ICdzdHJpbmcnKSA/IG9wdGlvbnMucGEgOiAnPScsXG4gICAgICAgIC8qIGJhc2UtNjQgcGFkIGNoYXJhY3Rlci4gRGVmYXVsdCAnPScgZm9yIHN0cmljdCBSRkMgY29tcGxpYW5jZSAgICovXG4gICAgICAgIHV0ZjggPSAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy51dGY4ID09PSAnYm9vbGVhbicpID8gb3B0aW9ucy51dGY4IDogdHJ1ZSxcbiAgICAgICAgLyogZW5hYmxlL2Rpc2FibGUgdXRmOCBlbmNvZGluZyAqL1xuICAgICAgICBybWQxNjBfcjEgPSBbXG4gICAgICAgICAgMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSxcbiAgICAgICAgICA3LCA0LCAxMywgMSwgMTAsIDYsIDE1LCAzLCAxMiwgMCwgOSwgNSwgMiwgMTQsIDExLCA4LFxuICAgICAgICAgIDMsIDEwLCAxNCwgNCwgOSwgMTUsIDgsIDEsIDIsIDcsIDAsIDYsIDEzLCAxMSwgNSwgMTIsXG4gICAgICAgICAgMSwgOSwgMTEsIDEwLCAwLCA4LCAxMiwgNCwgMTMsIDMsIDcsIDE1LCAxNCwgNSwgNiwgMixcbiAgICAgICAgICA0LCAwLCA1LCA5LCA3LCAxMiwgMiwgMTAsIDE0LCAxLCAzLCA4LCAxMSwgNiwgMTUsIDEzXG4gICAgICAgIF0sXG4gICAgICAgIHJtZDE2MF9yMiA9IFtcbiAgICAgICAgICA1LCAxNCwgNywgMCwgOSwgMiwgMTEsIDQsIDEzLCA2LCAxNSwgOCwgMSwgMTAsIDMsIDEyLFxuICAgICAgICAgIDYsIDExLCAzLCA3LCAwLCAxMywgNSwgMTAsIDE0LCAxNSwgOCwgMTIsIDQsIDksIDEsIDIsXG4gICAgICAgICAgMTUsIDUsIDEsIDMsIDcsIDE0LCA2LCA5LCAxMSwgOCwgMTIsIDIsIDEwLCAwLCA0LCAxMyxcbiAgICAgICAgICA4LCA2LCA0LCAxLCAzLCAxMSwgMTUsIDAsIDUsIDEyLCAyLCAxMywgOSwgNywgMTAsIDE0LFxuICAgICAgICAgIDEyLCAxNSwgMTAsIDQsIDEsIDUsIDgsIDcsIDYsIDIsIDEzLCAxNCwgMCwgMywgOSwgMTFcbiAgICAgICAgXSxcbiAgICAgICAgcm1kMTYwX3MxID0gW1xuICAgICAgICAgIDExLCAxNCwgMTUsIDEyLCA1LCA4LCA3LCA5LCAxMSwgMTMsIDE0LCAxNSwgNiwgNywgOSwgOCxcbiAgICAgICAgICA3LCA2LCA4LCAxMywgMTEsIDksIDcsIDE1LCA3LCAxMiwgMTUsIDksIDExLCA3LCAxMywgMTIsXG4gICAgICAgICAgMTEsIDEzLCA2LCA3LCAxNCwgOSwgMTMsIDE1LCAxNCwgOCwgMTMsIDYsIDUsIDEyLCA3LCA1LFxuICAgICAgICAgIDExLCAxMiwgMTQsIDE1LCAxNCwgMTUsIDksIDgsIDksIDE0LCA1LCA2LCA4LCA2LCA1LCAxMixcbiAgICAgICAgICA5LCAxNSwgNSwgMTEsIDYsIDgsIDEzLCAxMiwgNSwgMTIsIDEzLCAxNCwgMTEsIDgsIDUsIDZcbiAgICAgICAgXSxcbiAgICAgICAgcm1kMTYwX3MyID0gW1xuICAgICAgICAgIDgsIDksIDksIDExLCAxMywgMTUsIDE1LCA1LCA3LCA3LCA4LCAxMSwgMTQsIDE0LCAxMiwgNixcbiAgICAgICAgICA5LCAxMywgMTUsIDcsIDEyLCA4LCA5LCAxMSwgNywgNywgMTIsIDcsIDYsIDE1LCAxMywgMTEsXG4gICAgICAgICAgOSwgNywgMTUsIDExLCA4LCA2LCA2LCAxNCwgMTIsIDEzLCA1LCAxNCwgMTMsIDEzLCA3LCA1LFxuICAgICAgICAgIDE1LCA1LCA4LCAxMSwgMTQsIDE0LCA2LCAxNCwgNiwgOSwgMTIsIDksIDEyLCA1LCAxNSwgOCxcbiAgICAgICAgICA4LCA1LCAxMiwgOSwgMTIsIDUsIDE0LCA2LCA4LCAxMywgNiwgNSwgMTUsIDEzLCAxMSwgMTFcbiAgICAgICAgXTtcblxuICAgICAgLyogcHJpdmlsZWdlZCAocHVibGljKSBtZXRob2RzICovXG4gICAgICB0aGlzLmhleCA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyaGV4KHJzdHIocywgdXRmOCkpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYjY0ID0gZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcnN0cjJiNjQocnN0cihzLCB1dGY4KSwgYjY0cGFkKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmFueSA9IGZ1bmN0aW9uKHMsIGUpIHtcbiAgICAgICAgcmV0dXJuIHJzdHIyYW55KHJzdHIocywgdXRmOCksIGUpO1xuICAgICAgfTtcbiAgICAgIHRoaXMucmF3ID0gZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcnN0cihzLCB1dGY4KTtcbiAgICAgIH07XG4gICAgICB0aGlzLmhleF9obWFjID0gZnVuY3Rpb24oaywgZCkge1xuICAgICAgICByZXR1cm4gcnN0cjJoZXgocnN0cl9obWFjKGssIGQpKTtcbiAgICAgIH07XG4gICAgICB0aGlzLmI2NF9obWFjID0gZnVuY3Rpb24oaywgZCkge1xuICAgICAgICByZXR1cm4gcnN0cjJiNjQocnN0cl9obWFjKGssIGQpLCBiNjRwYWQpO1xuICAgICAgfTtcbiAgICAgIHRoaXMuYW55X2htYWMgPSBmdW5jdGlvbihrLCBkLCBlKSB7XG4gICAgICAgIHJldHVybiByc3RyMmFueShyc3RyX2htYWMoaywgZCksIGUpO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogUGVyZm9ybSBhIHNpbXBsZSBzZWxmLXRlc3QgdG8gc2VlIGlmIHRoZSBWTSBpcyB3b3JraW5nXG4gICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IEhleGFkZWNpbWFsIGhhc2ggc2FtcGxlXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICAgIHRoaXMudm1fdGVzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gaGV4KCdhYmMnKS50b0xvd2VyQ2FzZSgpID09PSAnOTAwMTUwOTgzY2QyNGZiMGQ2OTYzZjdkMjhlMTdmNzInO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogQGRlc2NyaXB0aW9uIEVuYWJsZS9kaXNhYmxlIHVwcGVyY2FzZSBoZXhhZGVjaW1hbCByZXR1cm5lZCBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn1cbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhpc1xuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgICB0aGlzLnNldFVwcGVyQ2FzZSA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICBoZXhjYXNlID0gYTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIEBkZXNjcmlwdGlvbiBEZWZpbmVzIGEgYmFzZTY0IHBhZCBzdHJpbmdcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBQYWRcbiAgICAgICAqIEByZXR1cm4ge09iamVjdH0gdGhpc1xuICAgICAgICogQHB1YmxpY1xuICAgICAgICovXG4gICAgICB0aGlzLnNldFBhZCA9IGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGI2NHBhZCA9IGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBAZGVzY3JpcHRpb24gRGVmaW5lcyBhIGJhc2U2NCBwYWQgc3RyaW5nXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59XG4gICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoaXNcbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgICAgdGhpcy5zZXRVVEY4ID0gZnVuY3Rpb24oYSkge1xuICAgICAgICBpZiAodHlwZW9mIGEgPT09ICdib29sZWFuJykge1xuICAgICAgICAgIHV0ZjggPSBhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcblxuICAgICAgLyogcHJpdmF0ZSBtZXRob2RzICovXG5cbiAgICAgIC8qKlxuICAgICAgICogQ2FsY3VsYXRlIHRoZSBybWQxNjAgb2YgYSByYXcgc3RyaW5nXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gcnN0cihzKSB7XG4gICAgICAgIHMgPSAodXRmOCkgPyB1dGY4RW5jb2RlKHMpIDogcztcbiAgICAgICAgcmV0dXJuIGJpbmwycnN0cihiaW5sKHJzdHIyYmlubChzKSwgcy5sZW5ndGggKiA4KSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ2FsY3VsYXRlIHRoZSBITUFDLXJtZDE2MCBvZiBhIGtleSBhbmQgc29tZSBkYXRhIChyYXcgc3RyaW5ncylcbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiByc3RyX2htYWMoa2V5LCBkYXRhKSB7XG4gICAgICAgIGtleSA9ICh1dGY4KSA/IHV0ZjhFbmNvZGUoa2V5KSA6IGtleTtcbiAgICAgICAgZGF0YSA9ICh1dGY4KSA/IHV0ZjhFbmNvZGUoZGF0YSkgOiBkYXRhO1xuICAgICAgICB2YXIgaSwgaGFzaCxcbiAgICAgICAgICBia2V5ID0gcnN0cjJiaW5sKGtleSksXG4gICAgICAgICAgaXBhZCA9IEFycmF5KDE2KSxcbiAgICAgICAgICBvcGFkID0gQXJyYXkoMTYpO1xuXG4gICAgICAgIGlmIChia2V5Lmxlbmd0aCA+IDE2KSB7XG4gICAgICAgICAgYmtleSA9IGJpbmwoYmtleSwga2V5Lmxlbmd0aCAqIDgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDE2OyBpICs9IDEpIHtcbiAgICAgICAgICBpcGFkW2ldID0gYmtleVtpXSBeIDB4MzYzNjM2MzY7XG4gICAgICAgICAgb3BhZFtpXSA9IGJrZXlbaV0gXiAweDVDNUM1QzVDO1xuICAgICAgICB9XG4gICAgICAgIGhhc2ggPSBiaW5sKGlwYWQuY29uY2F0KHJzdHIyYmlubChkYXRhKSksIDUxMiArIGRhdGEubGVuZ3RoICogOCk7XG4gICAgICAgIHJldHVybiBiaW5sMnJzdHIoYmlubChvcGFkLmNvbmNhdChoYXNoKSwgNTEyICsgMTYwKSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ29udmVydCBhbiBhcnJheSBvZiBsaXR0bGUtZW5kaWFuIHdvcmRzIHRvIGEgc3RyaW5nXG4gICAgICAgKi9cblxuICAgICAgZnVuY3Rpb24gYmlubDJyc3RyKGlucHV0KSB7XG4gICAgICAgIHZhciBpLCBvdXRwdXQgPSAnJyxcbiAgICAgICAgICBsID0gaW5wdXQubGVuZ3RoICogMzI7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpICs9IDgpIHtcbiAgICAgICAgICBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoaW5wdXRbaSA+PiA1XSA+Pj4gKGkgJSAzMikpICYgMHhGRik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDYWxjdWxhdGUgdGhlIFJJUEUtTUQxNjAgb2YgYW4gYXJyYXkgb2YgbGl0dGxlLWVuZGlhbiB3b3JkcywgYW5kIGEgYml0IGxlbmd0aC5cbiAgICAgICAqL1xuXG4gICAgICBmdW5jdGlvbiBiaW5sKHgsIGxlbikge1xuICAgICAgICB2YXIgVCwgaiwgaSwgbCxcbiAgICAgICAgICBoMCA9IDB4Njc0NTIzMDEsXG4gICAgICAgICAgaDEgPSAweGVmY2RhYjg5LFxuICAgICAgICAgIGgyID0gMHg5OGJhZGNmZSxcbiAgICAgICAgICBoMyA9IDB4MTAzMjU0NzYsXG4gICAgICAgICAgaDQgPSAweGMzZDJlMWYwLFxuICAgICAgICAgIEExLCBCMSwgQzEsIEQxLCBFMSxcbiAgICAgICAgICBBMiwgQjIsIEMyLCBEMiwgRTI7XG5cbiAgICAgICAgLyogYXBwZW5kIHBhZGRpbmcgKi9cbiAgICAgICAgeFtsZW4gPj4gNV0gfD0gMHg4MCA8PCAobGVuICUgMzIpO1xuICAgICAgICB4WygoKGxlbiArIDY0KSA+Pj4gOSkgPDwgNCkgKyAxNF0gPSBsZW47XG4gICAgICAgIGwgPSB4Lmxlbmd0aDtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxNikge1xuICAgICAgICAgIEExID0gQTIgPSBoMDtcbiAgICAgICAgICBCMSA9IEIyID0gaDE7XG4gICAgICAgICAgQzEgPSBDMiA9IGgyO1xuICAgICAgICAgIEQxID0gRDIgPSBoMztcbiAgICAgICAgICBFMSA9IEUyID0gaDQ7XG4gICAgICAgICAgZm9yIChqID0gMDsgaiA8PSA3OTsgaiArPSAxKSB7XG4gICAgICAgICAgICBUID0gc2FmZV9hZGQoQTEsIHJtZDE2MF9mKGosIEIxLCBDMSwgRDEpKTtcbiAgICAgICAgICAgIFQgPSBzYWZlX2FkZChULCB4W2kgKyBybWQxNjBfcjFbal1dKTtcbiAgICAgICAgICAgIFQgPSBzYWZlX2FkZChULCBybWQxNjBfSzEoaikpO1xuICAgICAgICAgICAgVCA9IHNhZmVfYWRkKGJpdF9yb2woVCwgcm1kMTYwX3MxW2pdKSwgRTEpO1xuICAgICAgICAgICAgQTEgPSBFMTtcbiAgICAgICAgICAgIEUxID0gRDE7XG4gICAgICAgICAgICBEMSA9IGJpdF9yb2woQzEsIDEwKTtcbiAgICAgICAgICAgIEMxID0gQjE7XG4gICAgICAgICAgICBCMSA9IFQ7XG4gICAgICAgICAgICBUID0gc2FmZV9hZGQoQTIsIHJtZDE2MF9mKDc5IC0gaiwgQjIsIEMyLCBEMikpO1xuICAgICAgICAgICAgVCA9IHNhZmVfYWRkKFQsIHhbaSArIHJtZDE2MF9yMltqXV0pO1xuICAgICAgICAgICAgVCA9IHNhZmVfYWRkKFQsIHJtZDE2MF9LMihqKSk7XG4gICAgICAgICAgICBUID0gc2FmZV9hZGQoYml0X3JvbChULCBybWQxNjBfczJbal0pLCBFMik7XG4gICAgICAgICAgICBBMiA9IEUyO1xuICAgICAgICAgICAgRTIgPSBEMjtcbiAgICAgICAgICAgIEQyID0gYml0X3JvbChDMiwgMTApO1xuICAgICAgICAgICAgQzIgPSBCMjtcbiAgICAgICAgICAgIEIyID0gVDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBUID0gc2FmZV9hZGQoaDEsIHNhZmVfYWRkKEMxLCBEMikpO1xuICAgICAgICAgIGgxID0gc2FmZV9hZGQoaDIsIHNhZmVfYWRkKEQxLCBFMikpO1xuICAgICAgICAgIGgyID0gc2FmZV9hZGQoaDMsIHNhZmVfYWRkKEUxLCBBMikpO1xuICAgICAgICAgIGgzID0gc2FmZV9hZGQoaDQsIHNhZmVfYWRkKEExLCBCMikpO1xuICAgICAgICAgIGg0ID0gc2FmZV9hZGQoaDAsIHNhZmVfYWRkKEIxLCBDMikpO1xuICAgICAgICAgIGgwID0gVDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW2gwLCBoMSwgaDIsIGgzLCBoNF07XG4gICAgICB9XG5cbiAgICAgIC8vIHNwZWNpZmljIGFsZ29yaXRobSBtZXRob2RzXG5cbiAgICAgIGZ1bmN0aW9uIHJtZDE2MF9mKGosIHgsIHksIHopIHtcbiAgICAgICAgcmV0dXJuICgwIDw9IGogJiYgaiA8PSAxNSkgPyAoeCBeIHkgXiB6KSA6XG4gICAgICAgICAgKDE2IDw9IGogJiYgaiA8PSAzMSkgPyAoeCAmIHkpIHwgKH54ICYgeikgOlxuICAgICAgICAgICgzMiA8PSBqICYmIGogPD0gNDcpID8gKHggfCB+eSkgXiB6IDpcbiAgICAgICAgICAoNDggPD0gaiAmJiBqIDw9IDYzKSA/ICh4ICYgeikgfCAoeSAmIH56KSA6XG4gICAgICAgICAgKDY0IDw9IGogJiYgaiA8PSA3OSkgPyB4IF4gKHkgfCB+eikgOlxuICAgICAgICAgICdybWQxNjBfZjogaiBvdXQgb2YgcmFuZ2UnO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBybWQxNjBfSzEoaikge1xuICAgICAgICByZXR1cm4gKDAgPD0gaiAmJiBqIDw9IDE1KSA/IDB4MDAwMDAwMDAgOlxuICAgICAgICAgICgxNiA8PSBqICYmIGogPD0gMzEpID8gMHg1YTgyNzk5OSA6XG4gICAgICAgICAgKDMyIDw9IGogJiYgaiA8PSA0NykgPyAweDZlZDllYmExIDpcbiAgICAgICAgICAoNDggPD0gaiAmJiBqIDw9IDYzKSA/IDB4OGYxYmJjZGMgOlxuICAgICAgICAgICg2NCA8PSBqICYmIGogPD0gNzkpID8gMHhhOTUzZmQ0ZSA6XG4gICAgICAgICAgJ3JtZDE2MF9LMTogaiBvdXQgb2YgcmFuZ2UnO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBybWQxNjBfSzIoaikge1xuICAgICAgICByZXR1cm4gKDAgPD0gaiAmJiBqIDw9IDE1KSA/IDB4NTBhMjhiZTYgOlxuICAgICAgICAgICgxNiA8PSBqICYmIGogPD0gMzEpID8gMHg1YzRkZDEyNCA6XG4gICAgICAgICAgKDMyIDw9IGogJiYgaiA8PSA0NykgPyAweDZkNzAzZWYzIDpcbiAgICAgICAgICAoNDggPD0gaiAmJiBqIDw9IDYzKSA/IDB4N2E2ZDc2ZTkgOlxuICAgICAgICAgICg2NCA8PSBqICYmIGogPD0gNzkpID8gMHgwMDAwMDAwMCA6XG4gICAgICAgICAgJ3JtZDE2MF9LMjogaiBvdXQgb2YgcmFuZ2UnO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyBleHBvc2VzIEhhc2hlc1xuICAoZnVuY3Rpb24od2luZG93LCB1bmRlZmluZWQpIHtcbiAgICB2YXIgZnJlZUV4cG9ydHMgPSBmYWxzZTtcbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICBmcmVlRXhwb3J0cyA9IGV4cG9ydHM7XG4gICAgICBpZiAoZXhwb3J0cyAmJiB0eXBlb2YgZ2xvYmFsID09PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsID09PSBnbG9iYWwuZ2xvYmFsKSB7XG4gICAgICAgIHdpbmRvdyA9IGdsb2JhbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgLy8gZGVmaW5lIGFzIGFuIGFub255bW91cyBtb2R1bGUsIHNvLCB0aHJvdWdoIHBhdGggbWFwcGluZywgaXQgY2FuIGJlIGFsaWFzZWRcbiAgICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIEhhc2hlcztcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZnJlZUV4cG9ydHMpIHtcbiAgICAgIC8vIGluIE5vZGUuanMgb3IgUmluZ29KUyB2MC44LjArXG4gICAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlICYmIG1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IEhhc2hlcztcbiAgICAgIH1cbiAgICAgIC8vIGluIE5hcndoYWwgb3IgUmluZ29KUyB2MC43LjAtXG4gICAgICBlbHNlIHtcbiAgICAgICAgZnJlZUV4cG9ydHMuSGFzaGVzID0gSGFzaGVzO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpbiBhIGJyb3dzZXIgb3IgUmhpbm9cbiAgICAgIHdpbmRvdy5IYXNoZXMgPSBIYXNoZXM7XG4gICAgfVxuICB9KHRoaXMpKTtcbn0oKSk7IC8vIElJRkVcbiIsImZ1bmN0aW9uIEFnZW50KCkge1xuICB0aGlzLl9kZWZhdWx0cyA9IFtdO1xufVxuXG5bXCJ1c2VcIiwgXCJvblwiLCBcIm9uY2VcIiwgXCJzZXRcIiwgXCJxdWVyeVwiLCBcInR5cGVcIiwgXCJhY2NlcHRcIiwgXCJhdXRoXCIsIFwid2l0aENyZWRlbnRpYWxzXCIsIFwic29ydFF1ZXJ5XCIsIFwicmV0cnlcIiwgXCJva1wiLCBcInJlZGlyZWN0c1wiLFxuIFwidGltZW91dFwiLCBcImJ1ZmZlclwiLCBcInNlcmlhbGl6ZVwiLCBcInBhcnNlXCIsIFwiY2FcIiwgXCJrZXlcIiwgXCJwZnhcIiwgXCJjZXJ0XCJdLmZvckVhY2goZnVuY3Rpb24oZm4pIHtcbiAgLyoqIERlZmF1bHQgc2V0dGluZyBmb3IgYWxsIHJlcXVlc3RzIGZyb20gdGhpcyBhZ2VudCAqL1xuICBBZ2VudC5wcm90b3R5cGVbZm5dID0gZnVuY3Rpb24oLyp2YXJhcmdzKi8pIHtcbiAgICB0aGlzLl9kZWZhdWx0cy5wdXNoKHtmbjpmbiwgYXJndW1lbnRzOmFyZ3VtZW50c30pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59KTtcblxuQWdlbnQucHJvdG90eXBlLl9zZXREZWZhdWx0cyA9IGZ1bmN0aW9uKHJlcSkge1xuICAgIHRoaXMuX2RlZmF1bHRzLmZvckVhY2goZnVuY3Rpb24oZGVmKSB7XG4gICAgICByZXFbZGVmLmZuXS5hcHBseShyZXEsIGRlZi5hcmd1bWVudHMpO1xuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBZ2VudDtcbiIsIi8qKlxuICogUm9vdCByZWZlcmVuY2UgZm9yIGlmcmFtZXMuXG4gKi9cblxudmFyIHJvb3Q7XG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHsgLy8gQnJvd3NlciB3aW5kb3dcbiAgcm9vdCA9IHdpbmRvdztcbn0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7IC8vIFdlYiBXb3JrZXJcbiAgcm9vdCA9IHNlbGY7XG59IGVsc2UgeyAvLyBPdGhlciBlbnZpcm9ubWVudHNcbiAgY29uc29sZS53YXJuKFwiVXNpbmcgYnJvd3Nlci1vbmx5IHZlcnNpb24gb2Ygc3VwZXJhZ2VudCBpbiBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcbiAgcm9vdCA9IHRoaXM7XG59XG5cbnZhciBFbWl0dGVyID0gcmVxdWlyZSgnY29tcG9uZW50LWVtaXR0ZXInKTtcbnZhciBSZXF1ZXN0QmFzZSA9IHJlcXVpcmUoJy4vcmVxdWVzdC1iYXNlJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzLW9iamVjdCcpO1xudmFyIFJlc3BvbnNlQmFzZSA9IHJlcXVpcmUoJy4vcmVzcG9uc2UtYmFzZScpO1xudmFyIEFnZW50ID0gcmVxdWlyZSgnLi9hZ2VudC1iYXNlJyk7XG5cbi8qKlxuICogTm9vcC5cbiAqL1xuXG5mdW5jdGlvbiBub29wKCl7fTtcblxuLyoqXG4gKiBFeHBvc2UgYHJlcXVlc3RgLlxuICovXG5cbnZhciByZXF1ZXN0ID0gZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obWV0aG9kLCB1cmwpIHtcbiAgLy8gY2FsbGJhY2tcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIHVybCkge1xuICAgIHJldHVybiBuZXcgZXhwb3J0cy5SZXF1ZXN0KCdHRVQnLCBtZXRob2QpLmVuZCh1cmwpO1xuICB9XG5cbiAgLy8gdXJsIGZpcnN0XG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gbmV3IGV4cG9ydHMuUmVxdWVzdCgnR0VUJywgbWV0aG9kKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgZXhwb3J0cy5SZXF1ZXN0KG1ldGhvZCwgdXJsKTtcbn1cblxuZXhwb3J0cy5SZXF1ZXN0ID0gUmVxdWVzdDtcblxuLyoqXG4gKiBEZXRlcm1pbmUgWEhSLlxuICovXG5cbnJlcXVlc3QuZ2V0WEhSID0gZnVuY3Rpb24gKCkge1xuICBpZiAocm9vdC5YTUxIdHRwUmVxdWVzdFxuICAgICAgJiYgKCFyb290LmxvY2F0aW9uIHx8ICdmaWxlOicgIT0gcm9vdC5sb2NhdGlvbi5wcm90b2NvbFxuICAgICAgICAgIHx8ICFyb290LkFjdGl2ZVhPYmplY3QpKSB7XG4gICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdDtcbiAgfSBlbHNlIHtcbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7IH0gY2F0Y2goZSkge31cbiAgICB0cnkgeyByZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQLjYuMCcpOyB9IGNhdGNoKGUpIHt9XG4gICAgdHJ5IHsgcmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUC4zLjAnKTsgfSBjYXRjaChlKSB7fVxuICAgIHRyeSB7IHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAnKTsgfSBjYXRjaChlKSB7fVxuICB9XG4gIHRocm93IEVycm9yKFwiQnJvd3Nlci1vbmx5IHZlcnNpb24gb2Ygc3VwZXJhZ2VudCBjb3VsZCBub3QgZmluZCBYSFJcIik7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZSwgYWRkZWQgdG8gc3VwcG9ydCBJRS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxudmFyIHRyaW0gPSAnJy50cmltXG4gID8gZnVuY3Rpb24ocykgeyByZXR1cm4gcy50cmltKCk7IH1cbiAgOiBmdW5jdGlvbihzKSB7IHJldHVybiBzLnJlcGxhY2UoLyheXFxzKnxcXHMqJCkvZywgJycpOyB9O1xuXG4vKipcbiAqIFNlcmlhbGl6ZSB0aGUgZ2l2ZW4gYG9iamAuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2VyaWFsaXplKG9iaikge1xuICBpZiAoIWlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gIHZhciBwYWlycyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgcHVzaEVuY29kZWRLZXlWYWx1ZVBhaXIocGFpcnMsIGtleSwgb2JqW2tleV0pO1xuICB9XG4gIHJldHVybiBwYWlycy5qb2luKCcmJyk7XG59XG5cbi8qKlxuICogSGVscHMgJ3NlcmlhbGl6ZScgd2l0aCBzZXJpYWxpemluZyBhcnJheXMuXG4gKiBNdXRhdGVzIHRoZSBwYWlycyBhcnJheS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwYWlyc1xuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gKi9cblxuZnVuY3Rpb24gcHVzaEVuY29kZWRLZXlWYWx1ZVBhaXIocGFpcnMsIGtleSwgdmFsKSB7XG4gIGlmICh2YWwgIT0gbnVsbCkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICAgIHZhbC5mb3JFYWNoKGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgcHVzaEVuY29kZWRLZXlWYWx1ZVBhaXIocGFpcnMsIGtleSwgdik7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHZhbCkpIHtcbiAgICAgIGZvcih2YXIgc3Via2V5IGluIHZhbCkge1xuICAgICAgICBwdXNoRW5jb2RlZEtleVZhbHVlUGFpcihwYWlycywga2V5ICsgJ1snICsgc3Via2V5ICsgJ10nLCB2YWxbc3Via2V5XSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhaXJzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSlcbiAgICAgICAgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsKSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKHZhbCA9PT0gbnVsbCkge1xuICAgIHBhaXJzLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkpO1xuICB9XG59XG5cbi8qKlxuICogRXhwb3NlIHNlcmlhbGl6YXRpb24gbWV0aG9kLlxuICovXG5cbnJlcXVlc3Quc2VyaWFsaXplT2JqZWN0ID0gc2VyaWFsaXplO1xuXG4vKipcbiAgKiBQYXJzZSB0aGUgZ2l2ZW4geC13d3ctZm9ybS11cmxlbmNvZGVkIGBzdHJgLlxuICAqXG4gICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAqIEByZXR1cm4ge09iamVjdH1cbiAgKiBAYXBpIHByaXZhdGVcbiAgKi9cblxuZnVuY3Rpb24gcGFyc2VTdHJpbmcoc3RyKSB7XG4gIHZhciBvYmogPSB7fTtcbiAgdmFyIHBhaXJzID0gc3RyLnNwbGl0KCcmJyk7XG4gIHZhciBwYWlyO1xuICB2YXIgcG9zO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBwYWlycy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIHBhaXIgPSBwYWlyc1tpXTtcbiAgICBwb3MgPSBwYWlyLmluZGV4T2YoJz0nKTtcbiAgICBpZiAocG9zID09IC0xKSB7XG4gICAgICBvYmpbZGVjb2RlVVJJQ29tcG9uZW50KHBhaXIpXSA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmpbZGVjb2RlVVJJQ29tcG9uZW50KHBhaXIuc2xpY2UoMCwgcG9zKSldID1cbiAgICAgICAgZGVjb2RlVVJJQ29tcG9uZW50KHBhaXIuc2xpY2UocG9zICsgMSkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogRXhwb3NlIHBhcnNlci5cbiAqL1xuXG5yZXF1ZXN0LnBhcnNlU3RyaW5nID0gcGFyc2VTdHJpbmc7XG5cbi8qKlxuICogRGVmYXVsdCBNSU1FIHR5cGUgbWFwLlxuICpcbiAqICAgICBzdXBlcmFnZW50LnR5cGVzLnhtbCA9ICdhcHBsaWNhdGlvbi94bWwnO1xuICpcbiAqL1xuXG5yZXF1ZXN0LnR5cGVzID0ge1xuICBodG1sOiAndGV4dC9odG1sJyxcbiAganNvbjogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICB4bWw6ICd0ZXh0L3htbCcsXG4gIHVybGVuY29kZWQ6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAnZm9ybSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAnZm9ybS1kYXRhJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbn07XG5cbi8qKlxuICogRGVmYXVsdCBzZXJpYWxpemF0aW9uIG1hcC5cbiAqXG4gKiAgICAgc3VwZXJhZ2VudC5zZXJpYWxpemVbJ2FwcGxpY2F0aW9uL3htbCddID0gZnVuY3Rpb24ob2JqKXtcbiAqICAgICAgIHJldHVybiAnZ2VuZXJhdGVkIHhtbCBoZXJlJztcbiAqICAgICB9O1xuICpcbiAqL1xuXG5yZXF1ZXN0LnNlcmlhbGl6ZSA9IHtcbiAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCc6IHNlcmlhbGl6ZSxcbiAgJ2FwcGxpY2F0aW9uL2pzb24nOiBKU09OLnN0cmluZ2lmeSxcbn07XG5cbi8qKlxuICAqIERlZmF1bHQgcGFyc2Vycy5cbiAgKlxuICAqICAgICBzdXBlcmFnZW50LnBhcnNlWydhcHBsaWNhdGlvbi94bWwnXSA9IGZ1bmN0aW9uKHN0cil7XG4gICogICAgICAgcmV0dXJuIHsgb2JqZWN0IHBhcnNlZCBmcm9tIHN0ciB9O1xuICAqICAgICB9O1xuICAqXG4gICovXG5cbnJlcXVlc3QucGFyc2UgPSB7XG4gICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnOiBwYXJzZVN0cmluZyxcbiAgJ2FwcGxpY2F0aW9uL2pzb24nOiBKU09OLnBhcnNlLFxufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gaGVhZGVyIGBzdHJgIGludG9cbiAqIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBtYXBwZWQgZmllbGRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlSGVhZGVyKHN0cikge1xuICB2YXIgbGluZXMgPSBzdHIuc3BsaXQoL1xccj9cXG4vKTtcbiAgdmFyIGZpZWxkcyA9IHt9O1xuICB2YXIgaW5kZXg7XG4gIHZhciBsaW5lO1xuICB2YXIgZmllbGQ7XG4gIHZhciB2YWw7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgbGluZSA9IGxpbmVzW2ldO1xuICAgIGluZGV4ID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAgaWYgKGluZGV4ID09PSAtMSkgeyAvLyBjb3VsZCBiZSBlbXB0eSBsaW5lLCBqdXN0IHNraXAgaXRcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBmaWVsZCA9IGxpbmUuc2xpY2UoMCwgaW5kZXgpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsID0gdHJpbShsaW5lLnNsaWNlKGluZGV4ICsgMSkpO1xuICAgIGZpZWxkc1tmaWVsZF0gPSB2YWw7XG4gIH1cblxuICByZXR1cm4gZmllbGRzO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIGBtaW1lYCBpcyBqc29uIG9yIGhhcyAranNvbiBzdHJ1Y3R1cmVkIHN5bnRheCBzdWZmaXguXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1pbWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBpc0pTT04obWltZSkge1xuICAvLyBzaG91bGQgbWF0Y2ggL2pzb24gb3IgK2pzb25cbiAgLy8gYnV0IG5vdCAvanNvbi1zZXFcbiAgcmV0dXJuIC9bXFwvK11qc29uKCR8W14tXFx3XSkvLnRlc3QobWltZSk7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgUmVzcG9uc2VgIHdpdGggdGhlIGdpdmVuIGB4aHJgLlxuICpcbiAqICAtIHNldCBmbGFncyAoLm9rLCAuZXJyb3IsIGV0YylcbiAqICAtIHBhcnNlIGhlYWRlclxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICBBbGlhc2luZyBgc3VwZXJhZ2VudGAgYXMgYHJlcXVlc3RgIGlzIG5pY2U6XG4gKlxuICogICAgICByZXF1ZXN0ID0gc3VwZXJhZ2VudDtcbiAqXG4gKiAgV2UgY2FuIHVzZSB0aGUgcHJvbWlzZS1saWtlIEFQSSwgb3IgcGFzcyBjYWxsYmFja3M6XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnLycpLmVuZChmdW5jdGlvbihyZXMpe30pO1xuICogICAgICByZXF1ZXN0LmdldCgnLycsIGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIFNlbmRpbmcgZGF0YSBjYW4gYmUgY2hhaW5lZDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInKVxuICogICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgIC5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgT3IgcGFzc2VkIHRvIGAuc2VuZCgpYDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInKVxuICogICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9LCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBPciBwYXNzZWQgdG8gYC5wb3N0KClgOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicsIHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgIC5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiBPciBmdXJ0aGVyIHJlZHVjZWQgdG8gYSBzaW5nbGUgY2FsbCBmb3Igc2ltcGxlIGNhc2VzOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicsIHsgbmFtZTogJ3RqJyB9LCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqIEBwYXJhbSB7WE1MSFRUUFJlcXVlc3R9IHhoclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIFJlc3BvbnNlKHJlcSkge1xuICB0aGlzLnJlcSA9IHJlcTtcbiAgdGhpcy54aHIgPSB0aGlzLnJlcS54aHI7XG4gIC8vIHJlc3BvbnNlVGV4dCBpcyBhY2Nlc3NpYmxlIG9ubHkgaWYgcmVzcG9uc2VUeXBlIGlzICcnIG9yICd0ZXh0JyBhbmQgb24gb2xkZXIgYnJvd3NlcnNcbiAgdGhpcy50ZXh0ID0gKCh0aGlzLnJlcS5tZXRob2QgIT0nSEVBRCcgJiYgKHRoaXMueGhyLnJlc3BvbnNlVHlwZSA9PT0gJycgfHwgdGhpcy54aHIucmVzcG9uc2VUeXBlID09PSAndGV4dCcpKSB8fCB0eXBlb2YgdGhpcy54aHIucmVzcG9uc2VUeXBlID09PSAndW5kZWZpbmVkJylcbiAgICAgPyB0aGlzLnhoci5yZXNwb25zZVRleHRcbiAgICAgOiBudWxsO1xuICB0aGlzLnN0YXR1c1RleHQgPSB0aGlzLnJlcS54aHIuc3RhdHVzVGV4dDtcbiAgdmFyIHN0YXR1cyA9IHRoaXMueGhyLnN0YXR1cztcbiAgLy8gaGFuZGxlIElFOSBidWc6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTAwNDY5NzIvbXNpZS1yZXR1cm5zLXN0YXR1cy1jb2RlLW9mLTEyMjMtZm9yLWFqYXgtcmVxdWVzdFxuICBpZiAoc3RhdHVzID09PSAxMjIzKSB7XG4gICAgc3RhdHVzID0gMjA0O1xuICB9XG4gIHRoaXMuX3NldFN0YXR1c1Byb3BlcnRpZXMoc3RhdHVzKTtcbiAgdGhpcy5oZWFkZXIgPSB0aGlzLmhlYWRlcnMgPSBwYXJzZUhlYWRlcih0aGlzLnhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG4gIC8vIGdldEFsbFJlc3BvbnNlSGVhZGVycyBzb21ldGltZXMgZmFsc2VseSByZXR1cm5zIFwiXCIgZm9yIENPUlMgcmVxdWVzdHMsIGJ1dFxuICAvLyBnZXRSZXNwb25zZUhlYWRlciBzdGlsbCB3b3Jrcy4gc28gd2UgZ2V0IGNvbnRlbnQtdHlwZSBldmVuIGlmIGdldHRpbmdcbiAgLy8gb3RoZXIgaGVhZGVycyBmYWlscy5cbiAgdGhpcy5oZWFkZXJbJ2NvbnRlbnQtdHlwZSddID0gdGhpcy54aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpO1xuICB0aGlzLl9zZXRIZWFkZXJQcm9wZXJ0aWVzKHRoaXMuaGVhZGVyKTtcblxuICBpZiAobnVsbCA9PT0gdGhpcy50ZXh0ICYmIHJlcS5fcmVzcG9uc2VUeXBlKSB7XG4gICAgdGhpcy5ib2R5ID0gdGhpcy54aHIucmVzcG9uc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5ib2R5ID0gdGhpcy5yZXEubWV0aG9kICE9ICdIRUFEJ1xuICAgICAgPyB0aGlzLl9wYXJzZUJvZHkodGhpcy50ZXh0ID8gdGhpcy50ZXh0IDogdGhpcy54aHIucmVzcG9uc2UpXG4gICAgICA6IG51bGw7XG4gIH1cbn1cblxuUmVzcG9uc2VCYXNlKFJlc3BvbnNlLnByb3RvdHlwZSk7XG5cbi8qKlxuICogUGFyc2UgdGhlIGdpdmVuIGJvZHkgYHN0cmAuXG4gKlxuICogVXNlZCBmb3IgYXV0by1wYXJzaW5nIG9mIGJvZGllcy4gUGFyc2Vyc1xuICogYXJlIGRlZmluZWQgb24gdGhlIGBzdXBlcmFnZW50LnBhcnNlYCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TWl4ZWR9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUuX3BhcnNlQm9keSA9IGZ1bmN0aW9uKHN0cikge1xuICB2YXIgcGFyc2UgPSByZXF1ZXN0LnBhcnNlW3RoaXMudHlwZV07XG4gIGlmICh0aGlzLnJlcS5fcGFyc2VyKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxLl9wYXJzZXIodGhpcywgc3RyKTtcbiAgfVxuICBpZiAoIXBhcnNlICYmIGlzSlNPTih0aGlzLnR5cGUpKSB7XG4gICAgcGFyc2UgPSByZXF1ZXN0LnBhcnNlWydhcHBsaWNhdGlvbi9qc29uJ107XG4gIH1cbiAgcmV0dXJuIHBhcnNlICYmIHN0ciAmJiAoc3RyLmxlbmd0aCB8fCBzdHIgaW5zdGFuY2VvZiBPYmplY3QpXG4gICAgPyBwYXJzZShzdHIpXG4gICAgOiBudWxsO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYW4gYEVycm9yYCByZXByZXNlbnRhdGl2ZSBvZiB0aGlzIHJlc3BvbnNlLlxuICpcbiAqIEByZXR1cm4ge0Vycm9yfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXNwb25zZS5wcm90b3R5cGUudG9FcnJvciA9IGZ1bmN0aW9uKCl7XG4gIHZhciByZXEgPSB0aGlzLnJlcTtcbiAgdmFyIG1ldGhvZCA9IHJlcS5tZXRob2Q7XG4gIHZhciB1cmwgPSByZXEudXJsO1xuXG4gIHZhciBtc2cgPSAnY2Fubm90ICcgKyBtZXRob2QgKyAnICcgKyB1cmwgKyAnICgnICsgdGhpcy5zdGF0dXMgKyAnKSc7XG4gIHZhciBlcnIgPSBuZXcgRXJyb3IobXNnKTtcbiAgZXJyLnN0YXR1cyA9IHRoaXMuc3RhdHVzO1xuICBlcnIubWV0aG9kID0gbWV0aG9kO1xuICBlcnIudXJsID0gdXJsO1xuXG4gIHJldHVybiBlcnI7XG59O1xuXG4vKipcbiAqIEV4cG9zZSBgUmVzcG9uc2VgLlxuICovXG5cbnJlcXVlc3QuUmVzcG9uc2UgPSBSZXNwb25zZTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBSZXF1ZXN0YCB3aXRoIHRoZSBnaXZlbiBgbWV0aG9kYCBhbmQgYHVybGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBSZXF1ZXN0KG1ldGhvZCwgdXJsKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5fcXVlcnkgPSB0aGlzLl9xdWVyeSB8fCBbXTtcbiAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gIHRoaXMudXJsID0gdXJsO1xuICB0aGlzLmhlYWRlciA9IHt9OyAvLyBwcmVzZXJ2ZXMgaGVhZGVyIG5hbWUgY2FzZVxuICB0aGlzLl9oZWFkZXIgPSB7fTsgLy8gY29lcmNlcyBoZWFkZXIgbmFtZXMgdG8gbG93ZXJjYXNlXG4gIHRoaXMub24oJ2VuZCcsIGZ1bmN0aW9uKCl7XG4gICAgdmFyIGVyciA9IG51bGw7XG4gICAgdmFyIHJlcyA9IG51bGw7XG5cbiAgICB0cnkge1xuICAgICAgcmVzID0gbmV3IFJlc3BvbnNlKHNlbGYpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgZXJyID0gbmV3IEVycm9yKCdQYXJzZXIgaXMgdW5hYmxlIHRvIHBhcnNlIHRoZSByZXNwb25zZScpO1xuICAgICAgZXJyLnBhcnNlID0gdHJ1ZTtcbiAgICAgIGVyci5vcmlnaW5hbCA9IGU7XG4gICAgICAvLyBpc3N1ZSAjNjc1OiByZXR1cm4gdGhlIHJhdyByZXNwb25zZSBpZiB0aGUgcmVzcG9uc2UgcGFyc2luZyBmYWlsc1xuICAgICAgaWYgKHNlbGYueGhyKSB7XG4gICAgICAgIC8vIGllOSBkb2Vzbid0IGhhdmUgJ3Jlc3BvbnNlJyBwcm9wZXJ0eVxuICAgICAgICBlcnIucmF3UmVzcG9uc2UgPSB0eXBlb2Ygc2VsZi54aHIucmVzcG9uc2VUeXBlID09ICd1bmRlZmluZWQnID8gc2VsZi54aHIucmVzcG9uc2VUZXh0IDogc2VsZi54aHIucmVzcG9uc2U7XG4gICAgICAgIC8vIGlzc3VlICM4NzY6IHJldHVybiB0aGUgaHR0cCBzdGF0dXMgY29kZSBpZiB0aGUgcmVzcG9uc2UgcGFyc2luZyBmYWlsc1xuICAgICAgICBlcnIuc3RhdHVzID0gc2VsZi54aHIuc3RhdHVzID8gc2VsZi54aHIuc3RhdHVzIDogbnVsbDtcbiAgICAgICAgZXJyLnN0YXR1c0NvZGUgPSBlcnIuc3RhdHVzOyAvLyBiYWNrd2FyZHMtY29tcGF0IG9ubHlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVyci5yYXdSZXNwb25zZSA9IG51bGw7XG4gICAgICAgIGVyci5zdGF0dXMgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2VsZi5jYWxsYmFjayhlcnIpO1xuICAgIH1cblxuICAgIHNlbGYuZW1pdCgncmVzcG9uc2UnLCByZXMpO1xuXG4gICAgdmFyIG5ld19lcnI7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghc2VsZi5faXNSZXNwb25zZU9LKHJlcykpIHtcbiAgICAgICAgbmV3X2VyciA9IG5ldyBFcnJvcihyZXMuc3RhdHVzVGV4dCB8fCAnVW5zdWNjZXNzZnVsIEhUVFAgcmVzcG9uc2UnKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoKGN1c3RvbV9lcnIpIHtcbiAgICAgIG5ld19lcnIgPSBjdXN0b21fZXJyOyAvLyBvaygpIGNhbGxiYWNrIGNhbiB0aHJvd1xuICAgIH1cblxuICAgIC8vICMxMDAwIGRvbid0IGNhdGNoIGVycm9ycyBmcm9tIHRoZSBjYWxsYmFjayB0byBhdm9pZCBkb3VibGUgY2FsbGluZyBpdFxuICAgIGlmIChuZXdfZXJyKSB7XG4gICAgICBuZXdfZXJyLm9yaWdpbmFsID0gZXJyO1xuICAgICAgbmV3X2Vyci5yZXNwb25zZSA9IHJlcztcbiAgICAgIG5ld19lcnIuc3RhdHVzID0gcmVzLnN0YXR1cztcbiAgICAgIHNlbGYuY2FsbGJhY2sobmV3X2VyciwgcmVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5jYWxsYmFjayhudWxsLCByZXMpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogTWl4aW4gYEVtaXR0ZXJgIGFuZCBgUmVxdWVzdEJhc2VgLlxuICovXG5cbkVtaXR0ZXIoUmVxdWVzdC5wcm90b3R5cGUpO1xuUmVxdWVzdEJhc2UoUmVxdWVzdC5wcm90b3R5cGUpO1xuXG4vKipcbiAqIFNldCBDb250ZW50LVR5cGUgdG8gYHR5cGVgLCBtYXBwaW5nIHZhbHVlcyBmcm9tIGByZXF1ZXN0LnR5cGVzYC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHN1cGVyYWdlbnQudHlwZXMueG1sID0gJ2FwcGxpY2F0aW9uL3htbCc7XG4gKlxuICogICAgICByZXF1ZXN0LnBvc3QoJy8nKVxuICogICAgICAgIC50eXBlKCd4bWwnKVxuICogICAgICAgIC5zZW5kKHhtbHN0cmluZylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnLycpXG4gKiAgICAgICAgLnR5cGUoJ2FwcGxpY2F0aW9uL3htbCcpXG4gKiAgICAgICAgLnNlbmQoeG1sc3RyaW5nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUudHlwZSA9IGZ1bmN0aW9uKHR5cGUpe1xuICB0aGlzLnNldCgnQ29udGVudC1UeXBlJywgcmVxdWVzdC50eXBlc1t0eXBlXSB8fCB0eXBlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBBY2NlcHQgdG8gYHR5cGVgLCBtYXBwaW5nIHZhbHVlcyBmcm9tIGByZXF1ZXN0LnR5cGVzYC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHN1cGVyYWdlbnQudHlwZXMuanNvbiA9ICdhcHBsaWNhdGlvbi9qc29uJztcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvYWdlbnQnKVxuICogICAgICAgIC5hY2NlcHQoJ2pzb24nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxdWVzdC5nZXQoJy9hZ2VudCcpXG4gKiAgICAgICAgLmFjY2VwdCgnYXBwbGljYXRpb24vanNvbicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFjY2VwdFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmFjY2VwdCA9IGZ1bmN0aW9uKHR5cGUpe1xuICB0aGlzLnNldCgnQWNjZXB0JywgcmVxdWVzdC50eXBlc1t0eXBlXSB8fCB0eXBlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBBdXRob3JpemF0aW9uIGZpZWxkIHZhbHVlIHdpdGggYHVzZXJgIGFuZCBgcGFzc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVzZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbcGFzc10gb3B0aW9uYWwgaW4gY2FzZSBvZiB1c2luZyAnYmVhcmVyJyBhcyB0eXBlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyB3aXRoICd0eXBlJyBwcm9wZXJ0eSAnYXV0bycsICdiYXNpYycgb3IgJ2JlYXJlcicgKGRlZmF1bHQgJ2Jhc2ljJylcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hdXRoID0gZnVuY3Rpb24odXNlciwgcGFzcywgb3B0aW9ucyl7XG4gIGlmICgxID09PSBhcmd1bWVudHMubGVuZ3RoKSBwYXNzID0gJyc7XG4gIGlmICh0eXBlb2YgcGFzcyA9PT0gJ29iamVjdCcgJiYgcGFzcyAhPT0gbnVsbCkgeyAvLyBwYXNzIGlzIG9wdGlvbmFsIGFuZCBjYW4gYmUgcmVwbGFjZWQgd2l0aCBvcHRpb25zXG4gICAgb3B0aW9ucyA9IHBhc3M7XG4gICAgcGFzcyA9ICcnO1xuICB9XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7XG4gICAgICB0eXBlOiAnZnVuY3Rpb24nID09PSB0eXBlb2YgYnRvYSA/ICdiYXNpYycgOiAnYXV0bycsXG4gICAgfTtcbiAgfVxuXG4gIHZhciBlbmNvZGVyID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBidG9hKSB7XG4gICAgICByZXR1cm4gYnRvYShzdHJpbmcpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1c2UgYmFzaWMgYXV0aCwgYnRvYSBpcyBub3QgYSBmdW5jdGlvbicpO1xuICB9O1xuXG4gIHJldHVybiB0aGlzLl9hdXRoKHVzZXIsIHBhc3MsIG9wdGlvbnMsIGVuY29kZXIpO1xufTtcblxuLyoqXG4gKiBBZGQgcXVlcnktc3RyaW5nIGB2YWxgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgcmVxdWVzdC5nZXQoJy9zaG9lcycpXG4gKiAgICAgLnF1ZXJ5KCdzaXplPTEwJylcbiAqICAgICAucXVlcnkoeyBjb2xvcjogJ2JsdWUnIH0pXG4gKlxuICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSB2YWxcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uKHZhbCl7XG4gIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgdmFsKSB2YWwgPSBzZXJpYWxpemUodmFsKTtcbiAgaWYgKHZhbCkgdGhpcy5fcXVlcnkucHVzaCh2YWwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUXVldWUgdGhlIGdpdmVuIGBmaWxlYCBhcyBhbiBhdHRhY2htZW50IHRvIHRoZSBzcGVjaWZpZWQgYGZpZWxkYCxcbiAqIHdpdGggb3B0aW9uYWwgYG9wdGlvbnNgIChvciBmaWxlbmFtZSkuXG4gKlxuICogYGBgIGpzXG4gKiByZXF1ZXN0LnBvc3QoJy91cGxvYWQnKVxuICogICAuYXR0YWNoKCdjb250ZW50JywgbmV3IEJsb2IoWyc8YSBpZD1cImFcIj48YiBpZD1cImJcIj5oZXkhPC9iPjwvYT4nXSwgeyB0eXBlOiBcInRleHQvaHRtbFwifSkpXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcGFyYW0ge0Jsb2J8RmlsZX0gZmlsZVxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuYXR0YWNoID0gZnVuY3Rpb24oZmllbGQsIGZpbGUsIG9wdGlvbnMpe1xuICBpZiAoZmlsZSkge1xuICAgIGlmICh0aGlzLl9kYXRhKSB7XG4gICAgICB0aHJvdyBFcnJvcihcInN1cGVyYWdlbnQgY2FuJ3QgbWl4IC5zZW5kKCkgYW5kIC5hdHRhY2goKVwiKTtcbiAgICB9XG5cbiAgICB0aGlzLl9nZXRGb3JtRGF0YSgpLmFwcGVuZChmaWVsZCwgZmlsZSwgb3B0aW9ucyB8fCBmaWxlLm5hbWUpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuUmVxdWVzdC5wcm90b3R5cGUuX2dldEZvcm1EYXRhID0gZnVuY3Rpb24oKXtcbiAgaWYgKCF0aGlzLl9mb3JtRGF0YSkge1xuICAgIHRoaXMuX2Zvcm1EYXRhID0gbmV3IHJvb3QuRm9ybURhdGEoKTtcbiAgfVxuICByZXR1cm4gdGhpcy5fZm9ybURhdGE7XG59O1xuXG4vKipcbiAqIEludm9rZSB0aGUgY2FsbGJhY2sgd2l0aCBgZXJyYCBhbmQgYHJlc2BcbiAqIGFuZCBoYW5kbGUgYXJpdHkgY2hlY2suXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gKiBAcGFyYW0ge1Jlc3BvbnNlfSByZXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmNhbGxiYWNrID0gZnVuY3Rpb24oZXJyLCByZXMpe1xuICBpZiAodGhpcy5fc2hvdWxkUmV0cnkoZXJyLCByZXMpKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JldHJ5KCk7XG4gIH1cblxuICB2YXIgZm4gPSB0aGlzLl9jYWxsYmFjaztcbiAgdGhpcy5jbGVhclRpbWVvdXQoKTtcblxuICBpZiAoZXJyKSB7XG4gICAgaWYgKHRoaXMuX21heFJldHJpZXMpIGVyci5yZXRyaWVzID0gdGhpcy5fcmV0cmllcyAtIDE7XG4gICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycik7XG4gIH1cblxuICBmbihlcnIsIHJlcyk7XG59O1xuXG4vKipcbiAqIEludm9rZSBjYWxsYmFjayB3aXRoIHgtZG9tYWluIGVycm9yLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmNyb3NzRG9tYWluRXJyb3IgPSBmdW5jdGlvbigpe1xuICB2YXIgZXJyID0gbmV3IEVycm9yKCdSZXF1ZXN0IGhhcyBiZWVuIHRlcm1pbmF0ZWRcXG5Qb3NzaWJsZSBjYXVzZXM6IHRoZSBuZXR3b3JrIGlzIG9mZmxpbmUsIE9yaWdpbiBpcyBub3QgYWxsb3dlZCBieSBBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4sIHRoZSBwYWdlIGlzIGJlaW5nIHVubG9hZGVkLCBldGMuJyk7XG4gIGVyci5jcm9zc0RvbWFpbiA9IHRydWU7XG5cbiAgZXJyLnN0YXR1cyA9IHRoaXMuc3RhdHVzO1xuICBlcnIubWV0aG9kID0gdGhpcy5tZXRob2Q7XG4gIGVyci51cmwgPSB0aGlzLnVybDtcblxuICB0aGlzLmNhbGxiYWNrKGVycik7XG59O1xuXG4vLyBUaGlzIG9ubHkgd2FybnMsIGJlY2F1c2UgdGhlIHJlcXVlc3QgaXMgc3RpbGwgbGlrZWx5IHRvIHdvcmtcblJlcXVlc3QucHJvdG90eXBlLmJ1ZmZlciA9IFJlcXVlc3QucHJvdG90eXBlLmNhID0gUmVxdWVzdC5wcm90b3R5cGUuYWdlbnQgPSBmdW5jdGlvbigpe1xuICBjb25zb2xlLndhcm4oXCJUaGlzIGlzIG5vdCBzdXBwb3J0ZWQgaW4gYnJvd3NlciB2ZXJzaW9uIG9mIHN1cGVyYWdlbnRcIik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gVGhpcyB0aHJvd3MsIGJlY2F1c2UgaXQgY2FuJ3Qgc2VuZC9yZWNlaXZlIGRhdGEgYXMgZXhwZWN0ZWRcblJlcXVlc3QucHJvdG90eXBlLnBpcGUgPSBSZXF1ZXN0LnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKCl7XG4gIHRocm93IEVycm9yKFwiU3RyZWFtaW5nIGlzIG5vdCBzdXBwb3J0ZWQgaW4gYnJvd3NlciB2ZXJzaW9uIG9mIHN1cGVyYWdlbnRcIik7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGBvYmpgIGlzIGEgaG9zdCBvYmplY3QsXG4gKiB3ZSBkb24ndCB3YW50IHRvIHNlcmlhbGl6ZSB0aGVzZSA6KVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuUmVxdWVzdC5wcm90b3R5cGUuX2lzSG9zdCA9IGZ1bmN0aW9uIF9pc0hvc3Qob2JqKSB7XG4gIC8vIE5hdGl2ZSBvYmplY3RzIHN0cmluZ2lmeSB0byBbb2JqZWN0IEZpbGVdLCBbb2JqZWN0IEJsb2JdLCBbb2JqZWN0IEZvcm1EYXRhXSwgZXRjLlxuICByZXR1cm4gb2JqICYmICdvYmplY3QnID09PSB0eXBlb2Ygb2JqICYmICFBcnJheS5pc0FycmF5KG9iaikgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgIT09ICdbb2JqZWN0IE9iamVjdF0nO1xufVxuXG4vKipcbiAqIEluaXRpYXRlIHJlcXVlc3QsIGludm9raW5nIGNhbGxiYWNrIGBmbihyZXMpYFxuICogd2l0aCBhbiBpbnN0YW5jZW9mIGBSZXNwb25zZWAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihmbil7XG4gIGlmICh0aGlzLl9lbmRDYWxsZWQpIHtcbiAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiAuZW5kKCkgd2FzIGNhbGxlZCB0d2ljZS4gVGhpcyBpcyBub3Qgc3VwcG9ydGVkIGluIHN1cGVyYWdlbnRcIik7XG4gIH1cbiAgdGhpcy5fZW5kQ2FsbGVkID0gdHJ1ZTtcblxuICAvLyBzdG9yZSBjYWxsYmFja1xuICB0aGlzLl9jYWxsYmFjayA9IGZuIHx8IG5vb3A7XG5cbiAgLy8gcXVlcnlzdHJpbmdcbiAgdGhpcy5fZmluYWxpemVRdWVyeVN0cmluZygpO1xuXG4gIHJldHVybiB0aGlzLl9lbmQoKTtcbn07XG5cblJlcXVlc3QucHJvdG90eXBlLl9lbmQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgeGhyID0gKHRoaXMueGhyID0gcmVxdWVzdC5nZXRYSFIoKSk7XG4gIHZhciBkYXRhID0gdGhpcy5fZm9ybURhdGEgfHwgdGhpcy5fZGF0YTtcblxuICB0aGlzLl9zZXRUaW1lb3V0cygpO1xuXG4gIC8vIHN0YXRlIGNoYW5nZVxuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgcmVhZHlTdGF0ZSA9IHhoci5yZWFkeVN0YXRlO1xuICAgIGlmIChyZWFkeVN0YXRlID49IDIgJiYgc2VsZi5fcmVzcG9uc2VUaW1lb3V0VGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dChzZWxmLl9yZXNwb25zZVRpbWVvdXRUaW1lcik7XG4gICAgfVxuICAgIGlmICg0ICE9IHJlYWR5U3RhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJbiBJRTksIHJlYWRzIHRvIGFueSBwcm9wZXJ0eSAoZS5nLiBzdGF0dXMpIG9mZiBvZiBhbiBhYm9ydGVkIFhIUiB3aWxsXG4gICAgLy8gcmVzdWx0IGluIHRoZSBlcnJvciBcIkNvdWxkIG5vdCBjb21wbGV0ZSB0aGUgb3BlcmF0aW9uIGR1ZSB0byBlcnJvciBjMDBjMDIzZlwiXG4gICAgdmFyIHN0YXR1cztcbiAgICB0cnkgeyBzdGF0dXMgPSB4aHIuc3RhdHVzIH0gY2F0Y2goZSkgeyBzdGF0dXMgPSAwOyB9XG5cbiAgICBpZiAoIXN0YXR1cykge1xuICAgICAgaWYgKHNlbGYudGltZWRvdXQgfHwgc2VsZi5fYWJvcnRlZCkgcmV0dXJuO1xuICAgICAgcmV0dXJuIHNlbGYuY3Jvc3NEb21haW5FcnJvcigpO1xuICAgIH1cbiAgICBzZWxmLmVtaXQoJ2VuZCcpO1xuICB9O1xuXG4gIC8vIHByb2dyZXNzXG4gIHZhciBoYW5kbGVQcm9ncmVzcyA9IGZ1bmN0aW9uKGRpcmVjdGlvbiwgZSkge1xuICAgIGlmIChlLnRvdGFsID4gMCkge1xuICAgICAgZS5wZXJjZW50ID0gZS5sb2FkZWQgLyBlLnRvdGFsICogMTAwO1xuICAgIH1cbiAgICBlLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICBzZWxmLmVtaXQoJ3Byb2dyZXNzJywgZSk7XG4gIH07XG4gIGlmICh0aGlzLmhhc0xpc3RlbmVycygncHJvZ3Jlc3MnKSkge1xuICAgIHRyeSB7XG4gICAgICB4aHIub25wcm9ncmVzcyA9IGhhbmRsZVByb2dyZXNzLmJpbmQobnVsbCwgJ2Rvd25sb2FkJyk7XG4gICAgICBpZiAoeGhyLnVwbG9hZCkge1xuICAgICAgICB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBoYW5kbGVQcm9ncmVzcy5iaW5kKG51bGwsICd1cGxvYWQnKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIC8vIEFjY2Vzc2luZyB4aHIudXBsb2FkIGZhaWxzIGluIElFIGZyb20gYSB3ZWIgd29ya2VyLCBzbyBqdXN0IHByZXRlbmQgaXQgZG9lc24ndCBleGlzdC5cbiAgICAgIC8vIFJlcG9ydGVkIGhlcmU6XG4gICAgICAvLyBodHRwczovL2Nvbm5lY3QubWljcm9zb2Z0LmNvbS9JRS9mZWVkYmFjay9kZXRhaWxzLzgzNzI0NS94bWxodHRwcmVxdWVzdC11cGxvYWQtdGhyb3dzLWludmFsaWQtYXJndW1lbnQtd2hlbi11c2VkLWZyb20td2ViLXdvcmtlci1jb250ZXh0XG4gICAgfVxuICB9XG5cbiAgLy8gaW5pdGlhdGUgcmVxdWVzdFxuICB0cnkge1xuICAgIGlmICh0aGlzLnVzZXJuYW1lICYmIHRoaXMucGFzc3dvcmQpIHtcbiAgICAgIHhoci5vcGVuKHRoaXMubWV0aG9kLCB0aGlzLnVybCwgdHJ1ZSwgdGhpcy51c2VybmFtZSwgdGhpcy5wYXNzd29yZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHhoci5vcGVuKHRoaXMubWV0aG9kLCB0aGlzLnVybCwgdHJ1ZSk7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICAvLyBzZWUgIzExNDlcbiAgICByZXR1cm4gdGhpcy5jYWxsYmFjayhlcnIpO1xuICB9XG5cbiAgLy8gQ09SU1xuICBpZiAodGhpcy5fd2l0aENyZWRlbnRpYWxzKSB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcblxuICAvLyBib2R5XG4gIGlmICghdGhpcy5fZm9ybURhdGEgJiYgJ0dFVCcgIT0gdGhpcy5tZXRob2QgJiYgJ0hFQUQnICE9IHRoaXMubWV0aG9kICYmICdzdHJpbmcnICE9IHR5cGVvZiBkYXRhICYmICF0aGlzLl9pc0hvc3QoZGF0YSkpIHtcbiAgICAvLyBzZXJpYWxpemUgc3R1ZmZcbiAgICB2YXIgY29udGVudFR5cGUgPSB0aGlzLl9oZWFkZXJbJ2NvbnRlbnQtdHlwZSddO1xuICAgIHZhciBzZXJpYWxpemUgPSB0aGlzLl9zZXJpYWxpemVyIHx8IHJlcXVlc3Quc2VyaWFsaXplW2NvbnRlbnRUeXBlID8gY29udGVudFR5cGUuc3BsaXQoJzsnKVswXSA6ICcnXTtcbiAgICBpZiAoIXNlcmlhbGl6ZSAmJiBpc0pTT04oY29udGVudFR5cGUpKSB7XG4gICAgICBzZXJpYWxpemUgPSByZXF1ZXN0LnNlcmlhbGl6ZVsnYXBwbGljYXRpb24vanNvbiddO1xuICAgIH1cbiAgICBpZiAoc2VyaWFsaXplKSBkYXRhID0gc2VyaWFsaXplKGRhdGEpO1xuICB9XG5cbiAgLy8gc2V0IGhlYWRlciBmaWVsZHNcbiAgZm9yICh2YXIgZmllbGQgaW4gdGhpcy5oZWFkZXIpIHtcbiAgICBpZiAobnVsbCA9PSB0aGlzLmhlYWRlcltmaWVsZF0pIGNvbnRpbnVlO1xuXG4gICAgaWYgKHRoaXMuaGVhZGVyLmhhc093blByb3BlcnR5KGZpZWxkKSlcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGZpZWxkLCB0aGlzLmhlYWRlcltmaWVsZF0pO1xuICB9XG5cbiAgaWYgKHRoaXMuX3Jlc3BvbnNlVHlwZSkge1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSB0aGlzLl9yZXNwb25zZVR5cGU7XG4gIH1cblxuICAvLyBzZW5kIHN0dWZmXG4gIHRoaXMuZW1pdCgncmVxdWVzdCcsIHRoaXMpO1xuXG4gIC8vIElFMTEgeGhyLnNlbmQodW5kZWZpbmVkKSBzZW5kcyAndW5kZWZpbmVkJyBzdHJpbmcgYXMgUE9TVCBwYXlsb2FkIChpbnN0ZWFkIG9mIG5vdGhpbmcpXG4gIC8vIFdlIG5lZWQgbnVsbCBoZXJlIGlmIGRhdGEgaXMgdW5kZWZpbmVkXG4gIHhoci5zZW5kKHR5cGVvZiBkYXRhICE9PSAndW5kZWZpbmVkJyA/IGRhdGEgOiBudWxsKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5yZXF1ZXN0LmFnZW50ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgQWdlbnQoKTtcbn07XG5cbltcIkdFVFwiLCBcIlBPU1RcIiwgXCJPUFRJT05TXCIsIFwiUEFUQ0hcIiwgXCJQVVRcIiwgXCJERUxFVEVcIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgQWdlbnQucHJvdG90eXBlW21ldGhvZC50b0xvd2VyQ2FzZSgpXSA9IGZ1bmN0aW9uKHVybCwgZm4pIHtcbiAgICB2YXIgcmVxID0gbmV3IHJlcXVlc3QuUmVxdWVzdChtZXRob2QsIHVybCk7XG4gICAgdGhpcy5fc2V0RGVmYXVsdHMocmVxKTtcbiAgICBpZiAoZm4pIHtcbiAgICAgIHJlcS5lbmQoZm4pO1xuICAgIH1cbiAgICByZXR1cm4gcmVxO1xuICB9O1xufSk7XG5cbkFnZW50LnByb3RvdHlwZS5kZWwgPSBBZ2VudC5wcm90b3R5cGVbJ2RlbGV0ZSddO1xuXG4vKipcbiAqIEdFVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBbZGF0YV0gb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl1cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QuZ2V0ID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbikge1xuICB2YXIgcmVxID0gcmVxdWVzdCgnR0VUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIChmbiA9IGRhdGEpLCAoZGF0YSA9IG51bGwpO1xuICBpZiAoZGF0YSkgcmVxLnF1ZXJ5KGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBIRUFEIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IFtkYXRhXSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5oZWFkID0gZnVuY3Rpb24odXJsLCBkYXRhLCBmbikge1xuICB2YXIgcmVxID0gcmVxdWVzdCgnSEVBRCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSAoZm4gPSBkYXRhKSwgKGRhdGEgPSBudWxsKTtcbiAgaWYgKGRhdGEpIHJlcS5xdWVyeShkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogT1BUSU9OUyBxdWVyeSB0byBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBbZGF0YV0gb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl1cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3Qub3B0aW9ucyA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgZm4pIHtcbiAgdmFyIHJlcSA9IHJlcXVlc3QoJ09QVElPTlMnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgKGZuID0gZGF0YSksIChkYXRhID0gbnVsbCk7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG5cbi8qKlxuICogREVMRVRFIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZH0gW2RhdGFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkZWwodXJsLCBkYXRhLCBmbikge1xuICB2YXIgcmVxID0gcmVxdWVzdCgnREVMRVRFJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIChmbiA9IGRhdGEpLCAoZGF0YSA9IG51bGwpO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59XG5cbnJlcXVlc3RbJ2RlbCddID0gZGVsO1xucmVxdWVzdFsnZGVsZXRlJ10gPSBkZWw7XG5cbi8qKlxuICogUEFUQ0ggYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfSBbZGF0YV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl1cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucGF0Y2ggPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKSB7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQQVRDSCcsIHVybCk7XG4gIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBkYXRhKSAoZm4gPSBkYXRhKSwgKGRhdGEgPSBudWxsKTtcbiAgaWYgKGRhdGEpIHJlcS5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcS5lbmQoZm4pO1xuICByZXR1cm4gcmVxO1xufTtcblxuLyoqXG4gKiBQT1NUIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZH0gW2RhdGFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnBvc3QgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKSB7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQT1NUJywgdXJsKTtcbiAgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIGRhdGEpIChmbiA9IGRhdGEpLCAoZGF0YSA9IG51bGwpO1xuICBpZiAoZGF0YSkgcmVxLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxLmVuZChmbik7XG4gIHJldHVybiByZXE7XG59O1xuXG4vKipcbiAqIFBVVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IFtkYXRhXSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wdXQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGZuKSB7XG4gIHZhciByZXEgPSByZXF1ZXN0KCdQVVQnLCB1cmwpO1xuICBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZGF0YSkgKGZuID0gZGF0YSksIChkYXRhID0gbnVsbCk7XG4gIGlmIChkYXRhKSByZXEuc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXEuZW5kKGZuKTtcbiAgcmV0dXJuIHJlcTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgcmV0dXJuIG51bGwgIT09IG9iaiAmJiAnb2JqZWN0JyA9PT0gdHlwZW9mIG9iajtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBNb2R1bGUgb2YgbWl4ZWQtaW4gZnVuY3Rpb25zIHNoYXJlZCBiZXR3ZWVuIG5vZGUgYW5kIGNsaWVudCBjb2RlXG4gKi9cbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXMtb2JqZWN0Jyk7XG5cbi8qKlxuICogRXhwb3NlIGBSZXF1ZXN0QmFzZWAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBSZXF1ZXN0QmFzZTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBSZXF1ZXN0QmFzZWAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBSZXF1ZXN0QmFzZShvYmopIHtcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XG59XG5cbi8qKlxuICogTWl4aW4gdGhlIHByb3RvdHlwZSBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG1peGluKG9iaikge1xuICBmb3IgKHZhciBrZXkgaW4gUmVxdWVzdEJhc2UucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBSZXF1ZXN0QmFzZS5wcm90b3R5cGVba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIENsZWFyIHByZXZpb3VzIHRpbWVvdXQuXG4gKlxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5jbGVhclRpbWVvdXQgPSBmdW5jdGlvbiBfY2xlYXJUaW1lb3V0KCl7XG4gIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gIGNsZWFyVGltZW91dCh0aGlzLl9yZXNwb25zZVRpbWVvdXRUaW1lcik7XG4gIGRlbGV0ZSB0aGlzLl90aW1lcjtcbiAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlVGltZW91dFRpbWVyO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogT3ZlcnJpZGUgZGVmYXVsdCByZXNwb25zZSBib2R5IHBhcnNlclxuICpcbiAqIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgdG8gY29udmVydCBpbmNvbWluZyBkYXRhIGludG8gcmVxdWVzdC5ib2R5XG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gcGFyc2UoZm4pe1xuICB0aGlzLl9wYXJzZXIgPSBmbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBmb3JtYXQgb2YgYmluYXJ5IHJlc3BvbnNlIGJvZHkuXG4gKiBJbiBicm93c2VyIHZhbGlkIGZvcm1hdHMgYXJlICdibG9iJyBhbmQgJ2FycmF5YnVmZmVyJyxcbiAqIHdoaWNoIHJldHVybiBCbG9iIGFuZCBBcnJheUJ1ZmZlciwgcmVzcGVjdGl2ZWx5LlxuICpcbiAqIEluIE5vZGUgYWxsIHZhbHVlcyByZXN1bHQgaW4gQnVmZmVyLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnJlc3BvbnNlVHlwZSgnYmxvYicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5yZXNwb25zZVR5cGUgPSBmdW5jdGlvbih2YWwpe1xuICB0aGlzLl9yZXNwb25zZVR5cGUgPSB2YWw7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBPdmVycmlkZSBkZWZhdWx0IHJlcXVlc3QgYm9keSBzZXJpYWxpemVyXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB0byBjb252ZXJ0IGRhdGEgc2V0IHZpYSAuc2VuZCBvciAuYXR0YWNoIGludG8gcGF5bG9hZCB0byBzZW5kXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uIHNlcmlhbGl6ZShmbil7XG4gIHRoaXMuX3NlcmlhbGl6ZXIgPSBmbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCB0aW1lb3V0cy5cbiAqXG4gKiAtIHJlc3BvbnNlIHRpbWVvdXQgaXMgdGltZSBiZXR3ZWVuIHNlbmRpbmcgcmVxdWVzdCBhbmQgcmVjZWl2aW5nIHRoZSBmaXJzdCBieXRlIG9mIHRoZSByZXNwb25zZS4gSW5jbHVkZXMgRE5TIGFuZCBjb25uZWN0aW9uIHRpbWUuXG4gKiAtIGRlYWRsaW5lIGlzIHRoZSB0aW1lIGZyb20gc3RhcnQgb2YgdGhlIHJlcXVlc3QgdG8gcmVjZWl2aW5nIHJlc3BvbnNlIGJvZHkgaW4gZnVsbC4gSWYgdGhlIGRlYWRsaW5lIGlzIHRvbyBzaG9ydCBsYXJnZSBmaWxlcyBtYXkgbm90IGxvYWQgYXQgYWxsIG9uIHNsb3cgY29ubmVjdGlvbnMuXG4gKlxuICogVmFsdWUgb2YgMCBvciBmYWxzZSBtZWFucyBubyB0aW1lb3V0LlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfE9iamVjdH0gbXMgb3Ige3Jlc3BvbnNlLCBkZWFkbGluZX1cbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUudGltZW91dCA9IGZ1bmN0aW9uIHRpbWVvdXQob3B0aW9ucyl7XG4gIGlmICghb3B0aW9ucyB8fCAnb2JqZWN0JyAhPT0gdHlwZW9mIG9wdGlvbnMpIHtcbiAgICB0aGlzLl90aW1lb3V0ID0gb3B0aW9ucztcbiAgICB0aGlzLl9yZXNwb25zZVRpbWVvdXQgPSAwO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZm9yKHZhciBvcHRpb24gaW4gb3B0aW9ucykge1xuICAgIHN3aXRjaChvcHRpb24pIHtcbiAgICAgIGNhc2UgJ2RlYWRsaW5lJzpcbiAgICAgICAgdGhpcy5fdGltZW91dCA9IG9wdGlvbnMuZGVhZGxpbmU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVzcG9uc2UnOlxuICAgICAgICB0aGlzLl9yZXNwb25zZVRpbWVvdXQgPSBvcHRpb25zLnJlc3BvbnNlO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnNvbGUud2FybihcIlVua25vd24gdGltZW91dCBvcHRpb25cIiwgb3B0aW9uKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBudW1iZXIgb2YgcmV0cnkgYXR0ZW1wdHMgb24gZXJyb3IuXG4gKlxuICogRmFpbGVkIHJlcXVlc3RzIHdpbGwgYmUgcmV0cmllZCAnY291bnQnIHRpbWVzIGlmIHRpbWVvdXQgb3IgZXJyLmNvZGUgPj0gNTAwLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBjb3VudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5yZXRyeSA9IGZ1bmN0aW9uIHJldHJ5KGNvdW50LCBmbil7XG4gIC8vIERlZmF1bHQgdG8gMSBpZiBubyBjb3VudCBwYXNzZWQgb3IgdHJ1ZVxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCB8fCBjb3VudCA9PT0gdHJ1ZSkgY291bnQgPSAxO1xuICBpZiAoY291bnQgPD0gMCkgY291bnQgPSAwO1xuICB0aGlzLl9tYXhSZXRyaWVzID0gY291bnQ7XG4gIHRoaXMuX3JldHJpZXMgPSAwO1xuICB0aGlzLl9yZXRyeUNhbGxiYWNrID0gZm47XG4gIHJldHVybiB0aGlzO1xufTtcblxudmFyIEVSUk9SX0NPREVTID0gW1xuICAnRUNPTk5SRVNFVCcsXG4gICdFVElNRURPVVQnLFxuICAnRUFERFJJTkZPJyxcbiAgJ0VTT0NLRVRUSU1FRE9VVCdcbl07XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgcmVxdWVzdCBzaG91bGQgYmUgcmV0cmllZC5cbiAqIChCb3Jyb3dlZCBmcm9tIHNlZ21lbnRpby9zdXBlcmFnZW50LXJldHJ5KVxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtSZXNwb25zZX0gW3Jlc11cbiAqIEByZXR1cm5zIHtCb29sZWFufVxuICovXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuX3Nob3VsZFJldHJ5ID0gZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgaWYgKCF0aGlzLl9tYXhSZXRyaWVzIHx8IHRoaXMuX3JldHJpZXMrKyA+PSB0aGlzLl9tYXhSZXRyaWVzKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh0aGlzLl9yZXRyeUNhbGxiYWNrKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBvdmVycmlkZSA9IHRoaXMuX3JldHJ5Q2FsbGJhY2soZXJyLCByZXMpO1xuICAgICAgaWYgKG92ZXJyaWRlID09PSB0cnVlKSByZXR1cm4gdHJ1ZTtcbiAgICAgIGlmIChvdmVycmlkZSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICAgIC8vIHVuZGVmaW5lZCBmYWxscyBiYWNrIHRvIGRlZmF1bHRzXG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgIH1cbiAgfVxuICBpZiAocmVzICYmIHJlcy5zdGF0dXMgJiYgcmVzLnN0YXR1cyA+PSA1MDAgJiYgcmVzLnN0YXR1cyAhPSA1MDEpIHJldHVybiB0cnVlO1xuICBpZiAoZXJyKSB7XG4gICAgaWYgKGVyci5jb2RlICYmIH5FUlJPUl9DT0RFUy5pbmRleE9mKGVyci5jb2RlKSkgcmV0dXJuIHRydWU7XG4gICAgLy8gU3VwZXJhZ2VudCB0aW1lb3V0XG4gICAgaWYgKGVyci50aW1lb3V0ICYmIGVyci5jb2RlID09ICdFQ09OTkFCT1JURUQnKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoZXJyLmNyb3NzRG9tYWluKSByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKipcbiAqIFJldHJ5IHJlcXVlc3RcbiAqXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5fcmV0cnkgPSBmdW5jdGlvbigpIHtcblxuICB0aGlzLmNsZWFyVGltZW91dCgpO1xuXG4gIC8vIG5vZGVcbiAgaWYgKHRoaXMucmVxKSB7XG4gICAgdGhpcy5yZXEgPSBudWxsO1xuICAgIHRoaXMucmVxID0gdGhpcy5yZXF1ZXN0KCk7XG4gIH1cblxuICB0aGlzLl9hYm9ydGVkID0gZmFsc2U7XG4gIHRoaXMudGltZWRvdXQgPSBmYWxzZTtcblxuICByZXR1cm4gdGhpcy5fZW5kKCk7XG59O1xuXG4vKipcbiAqIFByb21pc2Ugc3VwcG9ydFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtyZWplY3RdXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24gdGhlbihyZXNvbHZlLCByZWplY3QpIHtcbiAgaWYgKCF0aGlzLl9mdWxsZmlsbGVkUHJvbWlzZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAodGhpcy5fZW5kQ2FsbGVkKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBzdXBlcmFnZW50IHJlcXVlc3Qgd2FzIHNlbnQgdHdpY2UsIGJlY2F1c2UgYm90aCAuZW5kKCkgYW5kIC50aGVuKCkgd2VyZSBjYWxsZWQuIE5ldmVyIGNhbGwgLmVuZCgpIGlmIHlvdSB1c2UgcHJvbWlzZXNcIik7XG4gICAgfVxuICAgIHRoaXMuX2Z1bGxmaWxsZWRQcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24oaW5uZXJSZXNvbHZlLCBpbm5lclJlamVjdCkge1xuICAgICAgc2VsZi5lbmQoZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgICAgaWYgKGVycikgaW5uZXJSZWplY3QoZXJyKTtcbiAgICAgICAgZWxzZSBpbm5lclJlc29sdmUocmVzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiB0aGlzLl9mdWxsZmlsbGVkUHJvbWlzZS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG59O1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuY2F0Y2ggPSBmdW5jdGlvbihjYikge1xuICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgY2IpO1xufTtcblxuLyoqXG4gKiBBbGxvdyBmb3IgZXh0ZW5zaW9uXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShmbikge1xuICBmbih0aGlzKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUub2sgPSBmdW5jdGlvbihjYikge1xuICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGNiKSB0aHJvdyBFcnJvcihcIkNhbGxiYWNrIHJlcXVpcmVkXCIpO1xuICB0aGlzLl9va0NhbGxiYWNrID0gY2I7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLl9pc1Jlc3BvbnNlT0sgPSBmdW5jdGlvbihyZXMpIHtcbiAgaWYgKCFyZXMpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAodGhpcy5fb2tDYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLl9va0NhbGxiYWNrKHJlcyk7XG4gIH1cblxuICByZXR1cm4gcmVzLnN0YXR1cyA+PSAyMDAgJiYgcmVzLnN0YXR1cyA8IDMwMDtcbn07XG5cbi8qKlxuICogR2V0IHJlcXVlc3QgaGVhZGVyIGBmaWVsZGAuXG4gKiBDYXNlLWluc2Vuc2l0aXZlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oZmllbGQpe1xuICByZXR1cm4gdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xufTtcblxuLyoqXG4gKiBHZXQgY2FzZS1pbnNlbnNpdGl2ZSBoZWFkZXIgYGZpZWxkYCB2YWx1ZS5cbiAqIFRoaXMgaXMgYSBkZXByZWNhdGVkIGludGVybmFsIEFQSS4gVXNlIGAuZ2V0KGZpZWxkKWAgaW5zdGVhZC5cbiAqXG4gKiAoZ2V0SGVhZGVyIGlzIG5vIGxvbmdlciB1c2VkIGludGVybmFsbHkgYnkgdGhlIHN1cGVyYWdlbnQgY29kZSBiYXNlKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKiBAZGVwcmVjYXRlZFxuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5nZXRIZWFkZXIgPSBSZXF1ZXN0QmFzZS5wcm90b3R5cGUuZ2V0O1xuXG4vKipcbiAqIFNldCBoZWFkZXIgYGZpZWxkYCB0byBgdmFsYCwgb3IgbXVsdGlwbGUgZmllbGRzIHdpdGggb25lIG9iamVjdC5cbiAqIENhc2UtaW5zZW5zaXRpdmUuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAuc2V0KCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbicpXG4gKiAgICAgICAgLnNldCgnWC1BUEktS2V5JywgJ2Zvb2JhcicpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogICAgICByZXEuZ2V0KCcvJylcbiAqICAgICAgICAuc2V0KHsgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsICdYLUFQSS1LZXknOiAnZm9vYmFyJyB9KVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZmllbGRcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oZmllbGQsIHZhbCl7XG4gIGlmIChpc09iamVjdChmaWVsZCkpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gZmllbGQpIHtcbiAgICAgIHRoaXMuc2V0KGtleSwgZmllbGRba2V5XSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXSA9IHZhbDtcbiAgdGhpcy5oZWFkZXJbZmllbGRdID0gdmFsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGhlYWRlciBgZmllbGRgLlxuICogQ2FzZS1pbnNlbnNpdGl2ZS5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqICAgICAgcmVxLmdldCgnLycpXG4gKiAgICAgICAgLnVuc2V0KCdVc2VyLUFnZW50JylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmllbGRcbiAqL1xuUmVxdWVzdEJhc2UucHJvdG90eXBlLnVuc2V0ID0gZnVuY3Rpb24oZmllbGQpe1xuICBkZWxldGUgdGhpcy5faGVhZGVyW2ZpZWxkLnRvTG93ZXJDYXNlKCldO1xuICBkZWxldGUgdGhpcy5oZWFkZXJbZmllbGRdO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogV3JpdGUgdGhlIGZpZWxkIGBuYW1lYCBhbmQgYHZhbGAsIG9yIG11bHRpcGxlIGZpZWxkcyB3aXRoIG9uZSBvYmplY3RcbiAqIGZvciBcIm11bHRpcGFydC9mb3JtLWRhdGFcIiByZXF1ZXN0IGJvZGllcy5cbiAqXG4gKiBgYGAganNcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5maWVsZCgnZm9vJywgJ2JhcicpXG4gKiAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIHJlcXVlc3QucG9zdCgnL3VwbG9hZCcpXG4gKiAgIC5maWVsZCh7IGZvbzogJ2JhcicsIGJhejogJ3F1eCcgfSlcbiAqICAgLmVuZChjYWxsYmFjayk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R9IG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfEJsb2J8RmlsZXxCdWZmZXJ8ZnMuUmVhZFN0cmVhbX0gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5maWVsZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbCkge1xuICAvLyBuYW1lIHNob3VsZCBiZSBlaXRoZXIgYSBzdHJpbmcgb3IgYW4gb2JqZWN0LlxuICBpZiAobnVsbCA9PT0gbmFtZSB8fCB1bmRlZmluZWQgPT09IG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJy5maWVsZChuYW1lLCB2YWwpIG5hbWUgY2FuIG5vdCBiZSBlbXB0eScpO1xuICB9XG5cbiAgaWYgKHRoaXMuX2RhdGEpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiLmZpZWxkKCkgY2FuJ3QgYmUgdXNlZCBpZiAuc2VuZCgpIGlzIHVzZWQuIFBsZWFzZSB1c2Ugb25seSAuc2VuZCgpIG9yIG9ubHkgLmZpZWxkKCkgJiAuYXR0YWNoKClcIik7XG4gIH1cblxuICBpZiAoaXNPYmplY3QobmFtZSkpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gbmFtZSkge1xuICAgICAgdGhpcy5maWVsZChrZXksIG5hbWVba2V5XSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSkge1xuICAgIGZvciAodmFyIGkgaW4gdmFsKSB7XG4gICAgICB0aGlzLmZpZWxkKG5hbWUsIHZhbFtpXSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gdmFsIHNob3VsZCBiZSBkZWZpbmVkIG5vd1xuICBpZiAobnVsbCA9PT0gdmFsIHx8IHVuZGVmaW5lZCA9PT0gdmFsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCcuZmllbGQobmFtZSwgdmFsKSB2YWwgY2FuIG5vdCBiZSBlbXB0eScpO1xuICB9XG4gIGlmICgnYm9vbGVhbicgPT09IHR5cGVvZiB2YWwpIHtcbiAgICB2YWwgPSAnJyArIHZhbDtcbiAgfVxuICB0aGlzLl9nZXRGb3JtRGF0YSgpLmFwcGVuZChuYW1lLCB2YWwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWJvcnQgdGhlIHJlcXVlc3QsIGFuZCBjbGVhciBwb3RlbnRpYWwgdGltZW91dC5cbiAqXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuUmVxdWVzdEJhc2UucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24oKXtcbiAgaWYgKHRoaXMuX2Fib3J0ZWQpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICB0aGlzLl9hYm9ydGVkID0gdHJ1ZTtcbiAgdGhpcy54aHIgJiYgdGhpcy54aHIuYWJvcnQoKTsgLy8gYnJvd3NlclxuICB0aGlzLnJlcSAmJiB0aGlzLnJlcS5hYm9ydCgpOyAvLyBub2RlXG4gIHRoaXMuY2xlYXJUaW1lb3V0KCk7XG4gIHRoaXMuZW1pdCgnYWJvcnQnKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuX2F1dGggPSBmdW5jdGlvbih1c2VyLCBwYXNzLCBvcHRpb25zLCBiYXNlNjRFbmNvZGVyKSB7XG4gIHN3aXRjaCAob3B0aW9ucy50eXBlKSB7XG4gICAgY2FzZSAnYmFzaWMnOlxuICAgICAgdGhpcy5zZXQoJ0F1dGhvcml6YXRpb24nLCAnQmFzaWMgJyArIGJhc2U2NEVuY29kZXIodXNlciArICc6JyArIHBhc3MpKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnYXV0byc6XG4gICAgICB0aGlzLnVzZXJuYW1lID0gdXNlcjtcbiAgICAgIHRoaXMucGFzc3dvcmQgPSBwYXNzO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdiZWFyZXInOiAvLyB1c2FnZSB3b3VsZCBiZSAuYXV0aChhY2Nlc3NUb2tlbiwgeyB0eXBlOiAnYmVhcmVyJyB9KVxuICAgICAgdGhpcy5zZXQoJ0F1dGhvcml6YXRpb24nLCAnQmVhcmVyICcgKyB1c2VyKTtcbiAgICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbmFibGUgdHJhbnNtaXNzaW9uIG9mIGNvb2tpZXMgd2l0aCB4LWRvbWFpbiByZXF1ZXN0cy5cbiAqXG4gKiBOb3RlIHRoYXQgZm9yIHRoaXMgdG8gd29yayB0aGUgb3JpZ2luIG11c3Qgbm90IGJlXG4gKiB1c2luZyBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiIHdpdGggYSB3aWxkY2FyZCxcbiAqIGFuZCBhbHNvIG11c3Qgc2V0IFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHNcIlxuICogdG8gXCJ0cnVlXCIuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUud2l0aENyZWRlbnRpYWxzID0gZnVuY3Rpb24ob24pIHtcbiAgLy8gVGhpcyBpcyBicm93c2VyLW9ubHkgZnVuY3Rpb25hbGl0eS4gTm9kZSBzaWRlIGlzIG5vLW9wLlxuICBpZiAob24gPT0gdW5kZWZpbmVkKSBvbiA9IHRydWU7XG4gIHRoaXMuX3dpdGhDcmVkZW50aWFscyA9IG9uO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHRoZSBtYXggcmVkaXJlY3RzIHRvIGBuYC4gRG9lcyBub3RpbmcgaW4gYnJvd3NlciBYSFIgaW1wbGVtZW50YXRpb24uXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUucmVkaXJlY3RzID0gZnVuY3Rpb24obil7XG4gIHRoaXMuX21heFJlZGlyZWN0cyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBNYXhpbXVtIHNpemUgb2YgYnVmZmVyZWQgcmVzcG9uc2UgYm9keSwgaW4gYnl0ZXMuIENvdW50cyB1bmNvbXByZXNzZWQgc2l6ZS5cbiAqIERlZmF1bHQgMjAwTUIuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICovXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUubWF4UmVzcG9uc2VTaXplID0gZnVuY3Rpb24obil7XG4gIGlmICgnbnVtYmVyJyAhPT0gdHlwZW9mIG4pIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoXCJJbnZhbGlkIGFyZ3VtZW50XCIpO1xuICB9XG4gIHRoaXMuX21heFJlc3BvbnNlU2l6ZSA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBDb252ZXJ0IHRvIGEgcGxhaW4gamF2YXNjcmlwdCBvYmplY3QgKG5vdCBKU09OIHN0cmluZykgb2Ygc2NhbGFyIHByb3BlcnRpZXMuXG4gKiBOb3RlIGFzIHRoaXMgbWV0aG9kIGlzIGRlc2lnbmVkIHRvIHJldHVybiBhIHVzZWZ1bCBub24tdGhpcyB2YWx1ZSxcbiAqIGl0IGNhbm5vdCBiZSBjaGFpbmVkLlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gZGVzY3JpYmluZyBtZXRob2QsIHVybCwgYW5kIGRhdGEgb2YgdGhpcyByZXF1ZXN0XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICBtZXRob2Q6IHRoaXMubWV0aG9kLFxuICAgIHVybDogdGhpcy51cmwsXG4gICAgZGF0YTogdGhpcy5fZGF0YSxcbiAgICBoZWFkZXJzOiB0aGlzLl9oZWFkZXIsXG4gIH07XG59O1xuXG4vKipcbiAqIFNlbmQgYGRhdGFgIGFzIHRoZSByZXF1ZXN0IGJvZHksIGRlZmF1bHRpbmcgdGhlIGAudHlwZSgpYCB0byBcImpzb25cIiB3aGVuXG4gKiBhbiBvYmplY3QgaXMgZ2l2ZW4uXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICAgLy8gbWFudWFsIGpzb25cbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnanNvbicpXG4gKiAgICAgICAgIC5zZW5kKCd7XCJuYW1lXCI6XCJ0alwifScpXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gYXV0byBqc29uXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnNlbmQoeyBuYW1lOiAndGonIH0pXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gbWFudWFsIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdmb3JtJylcbiAqICAgICAgICAgLnNlbmQoJ25hbWU9dGonKVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGF1dG8geC13d3ctZm9ybS11cmxlbmNvZGVkXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2Zvcm0nKVxuICogICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBkZWZhdWx0cyB0byB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAqICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgLnNlbmQoJ25hbWU9dG9iaScpXG4gKiAgICAgICAgLnNlbmQoJ3NwZWNpZXM9ZmVycmV0JylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gZGF0YVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24oZGF0YSl7XG4gIHZhciBpc09iaiA9IGlzT2JqZWN0KGRhdGEpO1xuICB2YXIgdHlwZSA9IHRoaXMuX2hlYWRlclsnY29udGVudC10eXBlJ107XG5cbiAgaWYgKHRoaXMuX2Zvcm1EYXRhKSB7XG4gICAgY29uc29sZS5lcnJvcihcIi5zZW5kKCkgY2FuJ3QgYmUgdXNlZCBpZiAuYXR0YWNoKCkgb3IgLmZpZWxkKCkgaXMgdXNlZC4gUGxlYXNlIHVzZSBvbmx5IC5zZW5kKCkgb3Igb25seSAuZmllbGQoKSAmIC5hdHRhY2goKVwiKTtcbiAgfVxuXG4gIGlmIChpc09iaiAmJiAhdGhpcy5fZGF0YSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICB0aGlzLl9kYXRhID0gW107XG4gICAgfSBlbHNlIGlmICghdGhpcy5faXNIb3N0KGRhdGEpKSB7XG4gICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgfVxuICB9IGVsc2UgaWYgKGRhdGEgJiYgdGhpcy5fZGF0YSAmJiB0aGlzLl9pc0hvc3QodGhpcy5fZGF0YSkpIHtcbiAgICB0aHJvdyBFcnJvcihcIkNhbid0IG1lcmdlIHRoZXNlIHNlbmQgY2FsbHNcIik7XG4gIH1cblxuICAvLyBtZXJnZVxuICBpZiAoaXNPYmogJiYgaXNPYmplY3QodGhpcy5fZGF0YSkpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xuICAgICAgdGhpcy5fZGF0YVtrZXldID0gZGF0YVtrZXldO1xuICAgIH1cbiAgfSBlbHNlIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgZGF0YSkge1xuICAgIC8vIGRlZmF1bHQgdG8geC13d3ctZm9ybS11cmxlbmNvZGVkXG4gICAgaWYgKCF0eXBlKSB0aGlzLnR5cGUoJ2Zvcm0nKTtcbiAgICB0eXBlID0gdGhpcy5faGVhZGVyWydjb250ZW50LXR5cGUnXTtcbiAgICBpZiAoJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgPT0gdHlwZSkge1xuICAgICAgdGhpcy5fZGF0YSA9IHRoaXMuX2RhdGFcbiAgICAgICAgPyB0aGlzLl9kYXRhICsgJyYnICsgZGF0YVxuICAgICAgICA6IGRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RhdGEgPSAodGhpcy5fZGF0YSB8fCAnJykgKyBkYXRhO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9kYXRhID0gZGF0YTtcbiAgfVxuXG4gIGlmICghaXNPYmogfHwgdGhpcy5faXNIb3N0KGRhdGEpKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBkZWZhdWx0IHRvIGpzb25cbiAgaWYgKCF0eXBlKSB0aGlzLnR5cGUoJ2pzb24nKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNvcnQgYHF1ZXJ5c3RyaW5nYCBieSB0aGUgc29ydCBmdW5jdGlvblxuICpcbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgICAvLyBkZWZhdWx0IG9yZGVyXG4gKiAgICAgICByZXF1ZXN0LmdldCgnL3VzZXInKVxuICogICAgICAgICAucXVlcnkoJ25hbWU9TmljaycpXG4gKiAgICAgICAgIC5xdWVyeSgnc2VhcmNoPU1hbm55JylcbiAqICAgICAgICAgLnNvcnRRdWVyeSgpXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gY3VzdG9taXplZCBzb3J0IGZ1bmN0aW9uXG4gKiAgICAgICByZXF1ZXN0LmdldCgnL3VzZXInKVxuICogICAgICAgICAucXVlcnkoJ25hbWU9TmljaycpXG4gKiAgICAgICAgIC5xdWVyeSgnc2VhcmNoPU1hbm55JylcbiAqICAgICAgICAgLnNvcnRRdWVyeShmdW5jdGlvbihhLCBiKXtcbiAqICAgICAgICAgICByZXR1cm4gYS5sZW5ndGggLSBiLmxlbmd0aDtcbiAqICAgICAgICAgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc29ydFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5zb3J0UXVlcnkgPSBmdW5jdGlvbihzb3J0KSB7XG4gIC8vIF9zb3J0IGRlZmF1bHQgdG8gdHJ1ZSBidXQgb3RoZXJ3aXNlIGNhbiBiZSBhIGZ1bmN0aW9uIG9yIGJvb2xlYW5cbiAgdGhpcy5fc29ydCA9IHR5cGVvZiBzb3J0ID09PSAndW5kZWZpbmVkJyA/IHRydWUgOiBzb3J0O1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ29tcG9zZSBxdWVyeXN0cmluZyB0byBhcHBlbmQgdG8gcmVxLnVybFxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuX2ZpbmFsaXplUXVlcnlTdHJpbmcgPSBmdW5jdGlvbigpe1xuICB2YXIgcXVlcnkgPSB0aGlzLl9xdWVyeS5qb2luKCcmJyk7XG4gIGlmIChxdWVyeSkge1xuICAgIHRoaXMudXJsICs9ICh0aGlzLnVybC5pbmRleE9mKCc/JykgPj0gMCA/ICcmJyA6ICc/JykgKyBxdWVyeTtcbiAgfVxuICB0aGlzLl9xdWVyeS5sZW5ndGggPSAwOyAvLyBNYWtlcyB0aGUgY2FsbCBpZGVtcG90ZW50XG5cbiAgaWYgKHRoaXMuX3NvcnQpIHtcbiAgICB2YXIgaW5kZXggPSB0aGlzLnVybC5pbmRleE9mKCc/Jyk7XG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHZhciBxdWVyeUFyciA9IHRoaXMudXJsLnN1YnN0cmluZyhpbmRleCArIDEpLnNwbGl0KCcmJyk7XG4gICAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIHRoaXMuX3NvcnQpIHtcbiAgICAgICAgcXVlcnlBcnIuc29ydCh0aGlzLl9zb3J0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXJ5QXJyLnNvcnQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudXJsID0gdGhpcy51cmwuc3Vic3RyaW5nKDAsIGluZGV4KSArICc/JyArIHF1ZXJ5QXJyLmpvaW4oJyYnKTtcbiAgICB9XG4gIH1cbn07XG5cbi8vIEZvciBiYWNrd2FyZHMgY29tcGF0IG9ubHlcblJlcXVlc3RCYXNlLnByb3RvdHlwZS5fYXBwZW5kUXVlcnlTdHJpbmcgPSBmdW5jdGlvbigpIHtjb25zb2xlLnRyYWNlKFwiVW5zdXBwb3J0ZWRcIik7fVxuXG4vKipcbiAqIEludm9rZSBjYWxsYmFjayB3aXRoIHRpbWVvdXQgZXJyb3IuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLl90aW1lb3V0RXJyb3IgPSBmdW5jdGlvbihyZWFzb24sIHRpbWVvdXQsIGVycm5vKXtcbiAgaWYgKHRoaXMuX2Fib3J0ZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGVyciA9IG5ldyBFcnJvcihyZWFzb24gKyB0aW1lb3V0ICsgJ21zIGV4Y2VlZGVkJyk7XG4gIGVyci50aW1lb3V0ID0gdGltZW91dDtcbiAgZXJyLmNvZGUgPSAnRUNPTk5BQk9SVEVEJztcbiAgZXJyLmVycm5vID0gZXJybm87XG4gIHRoaXMudGltZWRvdXQgPSB0cnVlO1xuICB0aGlzLmFib3J0KCk7XG4gIHRoaXMuY2FsbGJhY2soZXJyKTtcbn07XG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5fc2V0VGltZW91dHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIC8vIGRlYWRsaW5lXG4gIGlmICh0aGlzLl90aW1lb3V0ICYmICF0aGlzLl90aW1lcikge1xuICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgc2VsZi5fdGltZW91dEVycm9yKCdUaW1lb3V0IG9mICcsIHNlbGYuX3RpbWVvdXQsICdFVElNRScpO1xuICAgIH0sIHRoaXMuX3RpbWVvdXQpO1xuICB9XG4gIC8vIHJlc3BvbnNlIHRpbWVvdXRcbiAgaWYgKHRoaXMuX3Jlc3BvbnNlVGltZW91dCAmJiAhdGhpcy5fcmVzcG9uc2VUaW1lb3V0VGltZXIpIHtcbiAgICB0aGlzLl9yZXNwb25zZVRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHNlbGYuX3RpbWVvdXRFcnJvcignUmVzcG9uc2UgdGltZW91dCBvZiAnLCBzZWxmLl9yZXNwb25zZVRpbWVvdXQsICdFVElNRURPVVQnKTtcbiAgICB9LCB0aGlzLl9yZXNwb25zZVRpbWVvdXQpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG4vKipcbiAqIEV4cG9zZSBgUmVzcG9uc2VCYXNlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc3BvbnNlQmFzZTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBSZXNwb25zZUJhc2VgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gUmVzcG9uc2VCYXNlKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn1cblxuLyoqXG4gKiBNaXhpbiB0aGUgcHJvdG90eXBlIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbWl4aW4ob2JqKSB7XG4gIGZvciAodmFyIGtleSBpbiBSZXNwb25zZUJhc2UucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBSZXNwb25zZUJhc2UucHJvdG90eXBlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBHZXQgY2FzZS1pbnNlbnNpdGl2ZSBgZmllbGRgIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXNwb25zZUJhc2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGZpZWxkKSB7XG4gIHJldHVybiB0aGlzLmhlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXTtcbn07XG5cbi8qKlxuICogU2V0IGhlYWRlciByZWxhdGVkIHByb3BlcnRpZXM6XG4gKlxuICogICAtIGAudHlwZWAgdGhlIGNvbnRlbnQgdHlwZSB3aXRob3V0IHBhcmFtc1xuICpcbiAqIEEgcmVzcG9uc2Ugb2YgXCJDb250ZW50LVR5cGU6IHRleHQvcGxhaW47IGNoYXJzZXQ9dXRmLThcIlxuICogd2lsbCBwcm92aWRlIHlvdSB3aXRoIGEgYC50eXBlYCBvZiBcInRleHQvcGxhaW5cIi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZUJhc2UucHJvdG90eXBlLl9zZXRIZWFkZXJQcm9wZXJ0aWVzID0gZnVuY3Rpb24oaGVhZGVyKXtcbiAgICAvLyBUT0RPOiBtb2FyIVxuICAgIC8vIFRPRE86IG1ha2UgdGhpcyBhIHV0aWxcblxuICAgIC8vIGNvbnRlbnQtdHlwZVxuICAgIHZhciBjdCA9IGhlYWRlclsnY29udGVudC10eXBlJ10gfHwgJyc7XG4gICAgdGhpcy50eXBlID0gdXRpbHMudHlwZShjdCk7XG5cbiAgICAvLyBwYXJhbXNcbiAgICB2YXIgcGFyYW1zID0gdXRpbHMucGFyYW1zKGN0KTtcbiAgICBmb3IgKHZhciBrZXkgaW4gcGFyYW1zKSB0aGlzW2tleV0gPSBwYXJhbXNba2V5XTtcblxuICAgIHRoaXMubGlua3MgPSB7fTtcblxuICAgIC8vIGxpbmtzXG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKGhlYWRlci5saW5rKSB7XG4gICAgICAgICAgICB0aGlzLmxpbmtzID0gdXRpbHMucGFyc2VMaW5rcyhoZWFkZXIubGluayk7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgLy8gaWdub3JlXG4gICAgfVxufTtcblxuLyoqXG4gKiBTZXQgZmxhZ3Mgc3VjaCBhcyBgLm9rYCBiYXNlZCBvbiBgc3RhdHVzYC5cbiAqXG4gKiBGb3IgZXhhbXBsZSBhIDJ4eCByZXNwb25zZSB3aWxsIGdpdmUgeW91IGEgYC5va2Agb2YgX190cnVlX19cbiAqIHdoZXJlYXMgNXh4IHdpbGwgYmUgX19mYWxzZV9fIGFuZCBgLmVycm9yYCB3aWxsIGJlIF9fdHJ1ZV9fLiBUaGVcbiAqIGAuY2xpZW50RXJyb3JgIGFuZCBgLnNlcnZlckVycm9yYCBhcmUgYWxzbyBhdmFpbGFibGUgdG8gYmUgbW9yZVxuICogc3BlY2lmaWMsIGFuZCBgLnN0YXR1c1R5cGVgIGlzIHRoZSBjbGFzcyBvZiBlcnJvciByYW5naW5nIGZyb20gMS4uNVxuICogc29tZXRpbWVzIHVzZWZ1bCBmb3IgbWFwcGluZyByZXNwb25kIGNvbG9ycyBldGMuXG4gKlxuICogXCJzdWdhclwiIHByb3BlcnRpZXMgYXJlIGFsc28gZGVmaW5lZCBmb3IgY29tbW9uIGNhc2VzLiBDdXJyZW50bHkgcHJvdmlkaW5nOlxuICpcbiAqICAgLSAubm9Db250ZW50XG4gKiAgIC0gLmJhZFJlcXVlc3RcbiAqICAgLSAudW5hdXRob3JpemVkXG4gKiAgIC0gLm5vdEFjY2VwdGFibGVcbiAqICAgLSAubm90Rm91bmRcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gc3RhdHVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXNwb25zZUJhc2UucHJvdG90eXBlLl9zZXRTdGF0dXNQcm9wZXJ0aWVzID0gZnVuY3Rpb24oc3RhdHVzKXtcbiAgICB2YXIgdHlwZSA9IHN0YXR1cyAvIDEwMCB8IDA7XG5cbiAgICAvLyBzdGF0dXMgLyBjbGFzc1xuICAgIHRoaXMuc3RhdHVzID0gdGhpcy5zdGF0dXNDb2RlID0gc3RhdHVzO1xuICAgIHRoaXMuc3RhdHVzVHlwZSA9IHR5cGU7XG5cbiAgICAvLyBiYXNpY3NcbiAgICB0aGlzLmluZm8gPSAxID09IHR5cGU7XG4gICAgdGhpcy5vayA9IDIgPT0gdHlwZTtcbiAgICB0aGlzLnJlZGlyZWN0ID0gMyA9PSB0eXBlO1xuICAgIHRoaXMuY2xpZW50RXJyb3IgPSA0ID09IHR5cGU7XG4gICAgdGhpcy5zZXJ2ZXJFcnJvciA9IDUgPT0gdHlwZTtcbiAgICB0aGlzLmVycm9yID0gKDQgPT0gdHlwZSB8fCA1ID09IHR5cGUpXG4gICAgICAgID8gdGhpcy50b0Vycm9yKClcbiAgICAgICAgOiBmYWxzZTtcblxuICAgIC8vIHN1Z2FyXG4gICAgdGhpcy5hY2NlcHRlZCA9IDIwMiA9PSBzdGF0dXM7XG4gICAgdGhpcy5ub0NvbnRlbnQgPSAyMDQgPT0gc3RhdHVzO1xuICAgIHRoaXMuYmFkUmVxdWVzdCA9IDQwMCA9PSBzdGF0dXM7XG4gICAgdGhpcy51bmF1dGhvcml6ZWQgPSA0MDEgPT0gc3RhdHVzO1xuICAgIHRoaXMubm90QWNjZXB0YWJsZSA9IDQwNiA9PSBzdGF0dXM7XG4gICAgdGhpcy5mb3JiaWRkZW4gPSA0MDMgPT0gc3RhdHVzO1xuICAgIHRoaXMubm90Rm91bmQgPSA0MDQgPT0gc3RhdHVzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBSZXR1cm4gdGhlIG1pbWUgdHlwZSBmb3IgdGhlIGdpdmVuIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMudHlwZSA9IGZ1bmN0aW9uKHN0cil7XG4gIHJldHVybiBzdHIuc3BsaXQoLyAqOyAqLykuc2hpZnQoKTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGhlYWRlciBmaWVsZCBwYXJhbWV0ZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMucGFyYW1zID0gZnVuY3Rpb24oc3RyKXtcbiAgcmV0dXJuIHN0ci5zcGxpdCgvICo7ICovKS5yZWR1Y2UoZnVuY3Rpb24ob2JqLCBzdHIpe1xuICAgIHZhciBwYXJ0cyA9IHN0ci5zcGxpdCgvICo9ICovKTtcbiAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKTtcbiAgICB2YXIgdmFsID0gcGFydHMuc2hpZnQoKTtcblxuICAgIGlmIChrZXkgJiYgdmFsKSBvYmpba2V5XSA9IHZhbDtcbiAgICByZXR1cm4gb2JqO1xuICB9LCB7fSk7XG59O1xuXG4vKipcbiAqIFBhcnNlIExpbmsgaGVhZGVyIGZpZWxkcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLnBhcnNlTGlua3MgPSBmdW5jdGlvbihzdHIpe1xuICByZXR1cm4gc3RyLnNwbGl0KC8gKiwgKi8pLnJlZHVjZShmdW5jdGlvbihvYmosIHN0cil7XG4gICAgdmFyIHBhcnRzID0gc3RyLnNwbGl0KC8gKjsgKi8pO1xuICAgIHZhciB1cmwgPSBwYXJ0c1swXS5zbGljZSgxLCAtMSk7XG4gICAgdmFyIHJlbCA9IHBhcnRzWzFdLnNwbGl0KC8gKj0gKi8pWzFdLnNsaWNlKDEsIC0xKTtcbiAgICBvYmpbcmVsXSA9IHVybDtcbiAgICByZXR1cm4gb2JqO1xuICB9LCB7fSk7XG59O1xuXG4vKipcbiAqIFN0cmlwIGNvbnRlbnQgcmVsYXRlZCBmaWVsZHMgZnJvbSBgaGVhZGVyYC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaGVhZGVyXG4gKiBAcmV0dXJuIHtPYmplY3R9IGhlYWRlclxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZXhwb3J0cy5jbGVhbkhlYWRlciA9IGZ1bmN0aW9uKGhlYWRlciwgY2hhbmdlc09yaWdpbil7XG4gIGRlbGV0ZSBoZWFkZXJbJ2NvbnRlbnQtdHlwZSddO1xuICBkZWxldGUgaGVhZGVyWydjb250ZW50LWxlbmd0aCddO1xuICBkZWxldGUgaGVhZGVyWyd0cmFuc2Zlci1lbmNvZGluZyddO1xuICBkZWxldGUgaGVhZGVyWydob3N0J107XG4gIC8vIHNlY3VpcnR5XG4gIGlmIChjaGFuZ2VzT3JpZ2luKSB7XG4gICAgZGVsZXRlIGhlYWRlclsnYXV0aG9yaXphdGlvbiddO1xuICAgIGRlbGV0ZSBoZWFkZXJbJ2Nvb2tpZSddO1xuICB9XG4gIHJldHVybiBoZWFkZXI7XG59O1xuIiwibW9kdWxlLmV4cG9ydHM9e1xuICBcIm5hbWVcIjogXCJ3dGZfd2lraXBlZGlhXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJwYXJzZSB3aWtpc2NyaXB0IGludG8ganNvblwiLFxuICBcInZlcnNpb25cIjogXCIyLjUuMFwiLFxuICBcImF1dGhvclwiOiBcIlNwZW5jZXIgS2VsbHkgPHNwZW5jZXJtb3VudGFpbkBnbWFpbC5jb20+IChodHRwOi8vc3BlbmNlcm1vdW50YS5pbilcIixcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdDovL2dpdGh1Yi5jb20vc3BlbmNlcm1vdW50YWluL3d0Zl93aWtpcGVkaWEuZ2l0XCJcbiAgfSxcbiAgXCJtYWluXCI6IFwiLi9zcmMvaW5kZXguanNcIixcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcInN0YXJ0XCI6IFwibm9kZSAuL3NjcmlwdHMvZGVtby5qc1wiLFxuICAgIFwidGVzdFwiOiBcIm5vZGUgLi9zY3JpcHRzL3Rlc3QuanNcIixcbiAgICBcInBvc3RwdWJsaXNoXCI6IFwibm9kZSAuL3NjcmlwdHMvY292ZXJhZ2UuanNcIixcbiAgICBcImNvdmVyYWdlXCI6IFwibm9kZSAuL3NjcmlwdHMvY292ZXJhZ2UuanNcIixcbiAgICBcInRlc3RiXCI6IFwiVEVTVEVOVj1wcm9kIG5vZGUgLi9zY3JpcHRzL3Rlc3QuanNcIixcbiAgICBcIndhdGNoXCI6IFwiYW1ibGUgLi9zY3JhdGNoLmpzXCIsXG4gICAgXCJidWlsZFwiOiBcIm5vZGUgLi9zY3JpcHRzL2J1aWxkLmpzXCJcbiAgfSxcbiAgXCJiaW5cIjoge1xuICAgIFwid2lraXBlZGlhXCI6IFwiLi9iaW4vcGFyc2UuanNcIixcbiAgICBcIndpa2lwZWRpYV9wbGFpbnRleHRcIjogXCIuL2Jpbi9wbGFpbnRleHQuanNcIlxuICB9LFxuICBcImZpbGVzXCI6IFtcbiAgICBcImJ1aWxkc1wiLFxuICAgIFwic3JjXCIsXG4gICAgXCJiaW5cIlxuICBdLFxuICBcImtleXdvcmRzXCI6IFtcbiAgICBcIndpa2lwZWRpYVwiLFxuICAgIFwid2lraW1lZGlhXCIsXG4gICAgXCJ3aWtpcGVkaWEgbWFya3VwXCIsXG4gICAgXCJ3aWtpc2NyaXB0XCJcbiAgXSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwianNoYXNoZXNcIjogXCJeMS4wLjZcIixcbiAgICBcInN1cGVyYWdlbnRcIjogXCJeMy44LjJcIlxuICB9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJhbWJsZVwiOiBcIjAuMC41XCIsXG4gICAgXCJiYWJlbC1jbGlcIjogXCJeNi4xMC4xXCIsXG4gICAgXCJiYWJlbC1wbHVnaW4tdHJhbnNmb3JtLW9iamVjdC1hc3NpZ25cIjogXCJeNi44LjBcIixcbiAgICBcImJhYmVsLXByZXNldC1lczIwMTVcIjogXCI2LjI0LjFcIixcbiAgICBcImJhYmVsaWZ5XCI6IFwiOC4wLjBcIixcbiAgICBcImJyb3dzZXJpZnlcIjogXCIxNC40LjBcIixcbiAgICBcImNvZGFjeS1jb3ZlcmFnZVwiOiBcIl4yLjAuMFwiLFxuICAgIFwiZGVyZXF1aXJlXCI6IFwiXjIuMC4zXCIsXG4gICAgXCJlc2xpbnRcIjogXCJeNC4xNy4wXCIsXG4gICAgXCJnYXplXCI6IFwiXjEuMS4xXCIsXG4gICAgXCJueWNcIjogXCJeOC40LjBcIixcbiAgICBcInNoZWxsanNcIjogXCJeMC44LjFcIixcbiAgICBcInRhcC1taW5cIjogXCJeMS4yLjFcIixcbiAgICBcInRhcC1zcGVjXCI6IFwiNC4xLjFcIixcbiAgICBcInRhcGVcIjogXCI0LjguMFwiLFxuICAgIFwidWdsaWZ5LWpzXCI6IFwiMy4zLjlcIlxuICB9LFxuICBcImxpY2Vuc2VcIjogXCJNSVRcIlxufVxuIiwiLy90aGVzZSBhcmUgdXNlZCBmb3IgdGhlIHNlbnRlbmNlLXNwbGl0dGVyXG5tb2R1bGUuZXhwb3J0cyA9IFtcbiAgJ2pyJyxcbiAgJ21yJyxcbiAgJ21ycycsXG4gICdtcycsXG4gICdkcicsXG4gICdwcm9mJyxcbiAgJ3NyJyxcbiAgJ3NlbicsXG4gICdjb3JwJyxcbiAgJ2NhbGlmJyxcbiAgJ3JlcCcsXG4gICdnb3YnLFxuICAnYXR0eScsXG4gICdzdXB0JyxcbiAgJ2RldCcsXG4gICdyZXYnLFxuICAnY29sJyxcbiAgJ2dlbicsXG4gICdsdCcsXG4gICdjbWRyJyxcbiAgJ2FkbScsXG4gICdjYXB0JyxcbiAgJ3NndCcsXG4gICdjcGwnLFxuICAnbWFqJyxcbiAgJ2RlcHQnLFxuICAndW5pdicsXG4gICdhc3NuJyxcbiAgJ2Jyb3MnLFxuICAnaW5jJyxcbiAgJ2x0ZCcsXG4gICdjbycsXG4gICdjb3JwJyxcbiAgJ2FyYycsXG4gICdhbCcsXG4gICdhdmUnLFxuICAnYmx2ZCcsXG4gICdjbCcsXG4gICdjdCcsXG4gICdjcmVzJyxcbiAgJ2V4cCcsXG4gICdyZCcsXG4gICdzdCcsXG4gICdkaXN0JyxcbiAgJ210JyxcbiAgJ2Z0JyxcbiAgJ2Z5JyxcbiAgJ2h3eScsXG4gICdsYScsXG4gICdwZCcsXG4gICdwbCcsXG4gICdwbHonLFxuICAndGNlJyxcbiAgJ0FsYScsXG4gICdBcml6JyxcbiAgJ0FyaycsXG4gICdDYWwnLFxuICAnQ2FsaWYnLFxuICAnQ29sJyxcbiAgJ0NvbG8nLFxuICAnQ29ubicsXG4gICdEZWwnLFxuICAnRmVkJyxcbiAgJ0ZsYScsXG4gICdHYScsXG4gICdJZGEnLFxuICAnSWQnLFxuICAnSWxsJyxcbiAgJ0luZCcsXG4gICdJYScsXG4gICdLYW4nLFxuICAnS2FucycsXG4gICdLZW4nLFxuICAnS3knLFxuICAnTGEnLFxuICAnTWUnLFxuICAnTWQnLFxuICAnTWFzcycsXG4gICdNaWNoJyxcbiAgJ01pbm4nLFxuICAnTWlzcycsXG4gICdNbycsXG4gICdNb250JyxcbiAgJ05lYicsXG4gICdOZWJyJyxcbiAgJ05ldicsXG4gICdNZXgnLFxuICAnT2tsYScsXG4gICdPaycsXG4gICdPcmUnLFxuICAnUGVubmEnLFxuICAnUGVubicsXG4gICdQYScsXG4gICdEYWsnLFxuICAnVGVubicsXG4gICdUZXgnLFxuICAnVXQnLFxuICAnVnQnLFxuICAnVmEnLFxuICAnV2FzaCcsXG4gICdXaXMnLFxuICAnV2lzYycsXG4gICdXeScsXG4gICdXeW8nLFxuICAnVVNBRkEnLFxuICAnQWx0YScsXG4gICdPbnQnLFxuICAnUXXDlMO4zqknLFxuICAnU2FzaycsXG4gICdZdWsnLFxuICAnamFuJyxcbiAgJ2ZlYicsXG4gICdtYXInLFxuICAnYXByJyxcbiAgJ2p1bicsXG4gICdqdWwnLFxuICAnYXVnJyxcbiAgJ3NlcCcsXG4gICdvY3QnLFxuICAnbm92JyxcbiAgJ2RlYycsXG4gICdzZXB0JyxcbiAgJ3ZzJyxcbiAgJ2V0YycsXG4gICdlc3AnLFxuICAnbGxiJyxcbiAgJ21kJyxcbiAgJ2JsJyxcbiAgJ3BoZCcsXG4gICdtYScsXG4gICdiYScsXG4gICdtaXNzJyxcbiAgJ21pc3NlcycsXG4gICdtaXN0ZXInLFxuICAnc2lyJyxcbiAgJ2VzcScsXG4gICdtc3RyJyxcbiAgJ2xpdCcsXG4gICdmbCcsXG4gICdleCcsXG4gICdlZycsXG4gICdzZXAnLFxuICAnc2VwdCcsXG4gICcuLidcbl07XG4iLCIvLyB3aWtpcGVkaWEgc3BlY2lhbCB0ZXJtcyBsaWZ0ZWQgYW5kIGF1Z21lbnRlZCBmcm9tIHBhcnNvaWQgcGFyc2VyIGFwcmlsIDIwMTVcbi8vIChub3QgZXZlbiBjbG9zZSB0byBiZWluZyBjb21wbGV0ZSlcbmxldCBpMThuID0ge1xuICBmaWxlczogW1xuICAgICfRhNCw0LnQuycsXG4gICAgJ2ZpdHhlcicsXG4gICAgJ3NvdWJvcicsXG4gICAgJ2RhdGVpJyxcbiAgICAnZmlsZScsXG4gICAgJ2FyY2hpdm8nLFxuICAgICfZvtix2YjZhtiv2YcnLFxuICAgICd0aWVkb3N0bycsXG4gICAgJ215bmQnLFxuICAgIFwic3Und3JldFwiLFxuICAgICdmaWNoaWVyJyxcbiAgICAnYmVzdGFuZCcsXG4gICAgJ9C00LDRgtC+0YLQtdC60LAnLFxuICAgICdkb3N5YScsXG4gICAgJ2ZpbCdcbiAgXSxcbiAgaW1hZ2VzOiBbJ2ltYWdlJ10sXG4gIHRlbXBsYXRlczogW1xuICAgICfRiNCw0LHQu9GR0L0nLFxuICAgICdwbGFudGlsbGEnLFxuICAgICfFoWFibG9uYScsXG4gICAgJ3ZvcmxhZ2UnLFxuICAgICd0ZW1wbGF0ZScsXG4gICAgJ9in2YTar9mIJyxcbiAgICAnbWFsbGluZScsXG4gICAgJ3NuacOwJyxcbiAgICAnc2hhYmxvbicsXG4gICAgJ21vZMOobGUnLFxuICAgICdzamFibG9vbicsXG4gICAgJ9GI0LDQsdC70L7QvScsXG4gICAgJ8WfYWJsb24nXG4gIF0sXG4gIGNhdGVnb3JpZXM6IFtcbiAgICAn0LrQsNGC0Y3Qs9C+0YDRi9GPJyxcbiAgICAnY2F0ZWdvcmlhJyxcbiAgICAna2F0ZWdvcmllJyxcbiAgICAnY2F0ZWdvcnknLFxuICAgICdjYXRlZ29yw61hJyxcbiAgICAn2LHYr9mHJyxcbiAgICAnbHVva2thJyxcbiAgICAnZmxva2t1cicsXG4gICAgJ2thdGVnb3JpeWEnLFxuICAgICdjYXTDqWdvcmllJyxcbiAgICAnY2F0ZWdvcmllJyxcbiAgICAn0LrQsNGC0LXQs9C+0YDQuNGY0LAnLFxuICAgICdrYXRlZ29yaScsXG4gICAgJ2thdGVnb3JpYScsXG4gICAgJ9iq2LXZhtmK2YEnXG4gIF0sXG4gIHJlZGlyZWN0czogW1xuICAgICfQv9C10YDQsNC90LDQutGW0YDQsNCy0LDQvdGM0L3QtScsXG4gICAgJ3JlZGlyZWN0JyxcbiAgICAncMWZZXNtxJtydWonLFxuICAgICd3ZWl0ZXJsZWl0dW5nJyxcbiAgICAncmVkaXJlY2Npw7NuJyxcbiAgICAncmVkaXJlY2Npb24nLFxuICAgICfYqti624zbjNixX9mF2LPbjNixJyxcbiAgICAn2KrYutuM24zYsdmF2LPbjNixJyxcbiAgICAnb2hqYXVzJyxcbiAgICAndXVkZWxsZWVub2hqYXVzJyxcbiAgICAndGlsdsOtc3VuJyxcbiAgICAnYcO9ZGF3JyxcbiAgICAn0LDQudC00LDRgycsXG4gICAgJ3JlZGlyZWN0aW9uJyxcbiAgICAnZG9vcnZlcndpanppbmcnLFxuICAgICfQv9GA0LXRg9GB0LzQtdGA0LgnLFxuICAgICfQv9GA0LXRg9GB0LzRmNC10YDQuCcsXG4gICAgJ3nDtm5sZW5kacyHcm1lJyxcbiAgICAnecO2bmxlbmRpzIdyJyxcbiAgICAn6YeN5a6a5ZCRJyxcbiAgICAncmVkaXJlY2Npw7NuJyxcbiAgICAncmVkaXJlY2Npb24nLFxuICAgICfph43lrprlkJEnLFxuICAgICd5w7ZubGVuZGlybT9lPycsXG4gICAgJ9iq2LrbjNuM2LFf2YXYs9uM2LEnLFxuICAgICfYqti624zbjNix2YXYs9uM2LEnLFxuICAgICfQv9C10YDQsNC90LDQutGW0YDQsNCy0LDQvdGM0L3QtScsXG4gICAgJ3nDtm5sZW5kaXJtZSdcbiAgXSxcbiAgc3BlY2lhbHM6IFtcbiAgICAn0YHQv9GN0YbRi9GP0LvRjNC90YvRjycsXG4gICAgJ2VzcGVjaWFsJyxcbiAgICAnc3BlY2nDoWxuw60nLFxuICAgICdzcGV6aWFsJyxcbiAgICAnc3BlY2lhbCcsXG4gICAgJ9mI24zamNmHJyxcbiAgICAndG9pbWlubm90JyxcbiAgICAna2VyZmlzc8Otw7BhJyxcbiAgICAnYXJuYXdsxLEnLFxuICAgICdzcMOpY2lhbCcsXG4gICAgJ3NwZWNpYWFsJyxcbiAgICAn0L/QvtGB0LXQsdC90L4nLFxuICAgICfDtnplbCdcbiAgXSxcbiAgdXNlcnM6IFtcbiAgICAn0YPQtNC30LXQu9GM0L3RltC6JyxcbiAgICAndXN1YXJpJyxcbiAgICAndcW+aXZhdGVsJyxcbiAgICAnYmVudXR6ZXInLFxuICAgICd1c2VyJyxcbiAgICAndXN1YXJpbycsXG4gICAgJ9qp2KfYsdio2LEnLFxuICAgICdrw6R5dHTDpGrDpCcsXG4gICAgJ25vdGFuZGknLFxuICAgICdwYXlkYWxhbsSxd3NoxLEnLFxuICAgICd1dGlsaXNhdGV1cicsXG4gICAgJ2dlYnJ1aWtlcicsXG4gICAgJ9C60L7RgNC40YHQvdC40LonLFxuICAgICdrdWxsYW7EsWPEsSdcbiAgXSxcbiAgZGlzYW1iaWdzOiBbXG4gICAgJ2Rpc2FtYmlnJywgLy9lblxuICAgICdkaXNhbWJpZ3VhdGlvbicsIC8vZW5cbiAgICAnZGFiJywgLy9lblxuICAgICdkaXNhbWInLCAvL2VuXG4gICAgJ2JlZ3JpZmZza2zDpHJ1bmcnLCAvL2RlXG4gICAgJ3VqZWRub3puYWN6bmllbmllJywgLy9wbFxuICAgICdkb29ydmVyd2lqc3BhZ2luYScsIC8vbmxcbiAgICAn5raI5q2n5LmJJywgLy96aFxuICAgICdkZXNhbWJpZ3VhY2nDs24nLCAvL2VzXG4gICAgJ2R1YmJlbHNpbm5pZycsIC8vYWZcbiAgICAnZGlzYW1iaWd1YScsIC8vaXRcbiAgICAnZGVzYW1iaWd1YcOnw6NvJywgLy9wdFxuICAgICdob21vbnltaWUnLCAvL2ZyXG4gICAgJ9C90LXQvtC00L3QvtC30L3QsNGH0L3QvtGB0YLRjCcsIC8vcnVcbiAgICAnYW5sYW0gYXlyxLFtxLEnIC8vdHJcbiAgXSxcbiAgaW5mb2JveGVzOiBbXG4gICAgJ2luZm9ib3gnLFxuICAgICdmaWNoYScsXG4gICAgJ9C60LDQvdCw0LTRgdC60LjQuScsXG4gICAgJ2lubGlndGluZ3NrYXMnLFxuICAgICdpbmxpZ3Rpbmdza2FzMycsIC8vYWZcbiAgICAn2YTYutipJyxcbiAgICAnYmlsZ2kga3V0dXN1JywgLy90clxuICAgICd5ZXJsZcWfaW0gYmlsZ2kga3V0dXN1JyxcbiAgICAnaW5mb2Jva3MnIC8vbm4sIG5vXG4gIF0sXG4gIHNvdXJjZXM6IFtcbiAgICAvL2JsYWNrbGlzdCB0aGVzZSBoZWFkaW5ncywgYXMgdGhleSdyZSBub3QgcGxhaW4tdGV4dFxuICAgICdyZWZlcmVuY2VzJyxcbiAgICAnc2VlIGFsc28nLFxuICAgICdleHRlcm5hbCBsaW5rcycsXG4gICAgJ2Z1cnRoZXIgcmVhZGluZycsXG4gICAgJ25vdGVzIGV0IHLDqWbDqXJlbmNlcycsXG4gICAgJ3ZvaXIgYXVzc2knLFxuICAgICdsaWVucyBleHRlcm5lcydcbiAgXVxufTtcblxubGV0IGRpY3Rpb25hcnkgPSB7fTtcbk9iamVjdC5rZXlzKGkxOG4pLmZvckVhY2goayA9PiB7XG4gIGkxOG5ba10uZm9yRWFjaCh3ID0+IHtcbiAgICBkaWN0aW9uYXJ5W3ddID0gdHJ1ZTtcbiAgfSk7XG59KTtcbmkxOG4uZGljdGlvbmFyeSA9IGRpY3Rpb25hcnk7XG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICBtb2R1bGUuZXhwb3J0cyA9IGkxOG47XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWE6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQWZhcicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0FmYXInXG4gIH0sXG4gIGFiOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0Fia2hhemlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9CQ0qfRgdGD0LAnXG4gIH0sXG4gIGFmOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0FmcmlrYWFucycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0FmcmlrYWFucydcbiAgfSxcbiAgYWs6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQWthbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0FrYW5hJ1xuICB9LFxuICBhbHM6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQWxlbWFubmljJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQWxlbWFubmlzY2gnXG4gIH0sXG4gIGFtOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0FtaGFyaWMnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfhiqDhiJvhiK3hipsnXG4gIH0sXG4gIGFuOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0FyYWdvbmVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0FyYWdvbsOpcydcbiAgfSxcbiAgYW5nOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0FuZ2xvLVNheG9uJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnRW5nbGlzYydcbiAgfSxcbiAgYXI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQXJhYmljJyxcbiAgICBkaXJlY3Rpb246ICdydGwnLFxuICAgIGxvY2FsX3RpdGxlOiAn2KfZhNi52LHYqNmK2KknXG4gIH0sXG4gIGFyYzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdBcmFtYWljJyxcbiAgICBkaXJlY3Rpb246ICdydGwnLFxuICAgIGxvY2FsX3RpdGxlOiAn3KPcmNyq3KwnXG4gIH0sXG4gIGFzOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0Fzc2FtZXNlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4KaF4Ka44Kau4KeA4Kav4Ka84Ka+J1xuICB9LFxuICBhc3Q6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQXN0dXJpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdBc3R1cmlhbnUnXG4gIH0sXG4gIGF2OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0F2YXInLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfQkNCy0LDRgCdcbiAgfSxcbiAgYXk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQXltYXJhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQXltYXInXG4gIH0sXG4gIGF6OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0F6ZXJiYWlqYW5pJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQXrJmXJiYXljYW5jYSdcbiAgfSxcbiAgYmE6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQmFzaGtpcicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9CR0LDRiNKh0L7RgNGCJ1xuICB9LFxuICBiYXI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQmF2YXJpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdCb2FyaXNjaCdcbiAgfSxcbiAgJ2JhdC1zbWcnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NhbW9naXRpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfFvWVtYWl0xJfFoWthJ1xuICB9LFxuICBiY2w6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQmlrb2wnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdCaWtvbCdcbiAgfSxcbiAgYmU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQmVsYXJ1c2lhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9CR0LXQu9Cw0YDRg9GB0LrQsNGPJ1xuICB9LFxuICAnYmUteC1vbGQnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0JlbGFydXNpYW4nLFxuICAgIGRpcmVjdGlvbjogJyhUYXJhxaFraWV2aWNhKScsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIGJnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0J1bGdhcmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9CR0YrQu9Cz0LDRgNGB0LrQuCdcbiAgfSxcbiAgYmg6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQmloYXJpJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4KSt4KWL4KSc4KSq4KWB4KSw4KWAJ1xuICB9LFxuICBiaToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdCaXNsYW1hJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQmlzbGFtYSdcbiAgfSxcbiAgYm06IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQmFtYmFyYScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0JhbWFuYW5rYW4nXG4gIH0sXG4gIGJuOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0JlbmdhbGknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfgpqzgpr7gpoLgprLgpr4nXG4gIH0sXG4gIGJvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1RpYmV0YW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfgvZbgvbzgvZHgvIvgvaHgvbLgvYInXG4gIH0sXG4gIGJweToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdCaXNobnVwcml5YScsXG4gICAgZGlyZWN0aW9uOiAnTWFuaXB1cmknLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICBicjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdCcmV0b24nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdCcmV6aG9uZWcnXG4gIH0sXG4gIGJzOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0Jvc25pYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdCb3NhbnNraSdcbiAgfSxcbiAgYnVnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0J1Z2luZXNlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4aiF4aiUJ1xuICB9LFxuICBieHI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQnVyaWF0JyxcbiAgICBkaXJlY3Rpb246ICcoUnVzc2lhKScsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIGNhOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0NhdGFsYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdDYXRhbMOgJ1xuICB9LFxuICBjZG86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTWluJyxcbiAgICBkaXJlY3Rpb246ICdEb25nJyxcbiAgICBsb2NhbF90aXRsZTogJ0NoaW5lc2UnXG4gIH0sXG4gIGNlOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0NoZWNoZW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfQndC+0YXRh9C40LnQvSdcbiAgfSxcbiAgY2ViOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0NlYnVhbm8nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdTaW51Z2JvYW5vbmcnXG4gIH0sXG4gIGNoOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0NoYW1vcnJvJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQ2hhbW9ydSdcbiAgfSxcbiAgY2hvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0Nob2N0YXcnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdDaG9jdGF3J1xuICB9LFxuICBjaHI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQ2hlcm9rZWUnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfhj6PhjrPhjqknXG4gIH0sXG4gIGNoeToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdDaGV5ZW5uZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1RzZXRzw6poZXN0w6JoZXNlJ1xuICB9LFxuICBjbzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdDb3JzaWNhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0NvcnN1J1xuICB9LFxuICBjcjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdDcmVlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTmVoaXlhdydcbiAgfSxcbiAgY3M6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQ3plY2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfEjGVza3knXG4gIH0sXG4gIGNzYjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdLYXNodWJpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdLYXN6w6tic2N6aSdcbiAgfSxcbiAgY3U6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnT2xkJyxcbiAgICBkaXJlY3Rpb246ICdDaHVyY2gnLFxuICAgIGxvY2FsX3RpdGxlOiAnU2xhdm9uaWMnXG4gIH0sXG4gIGN2OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0NodXZhc2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfQp8SD0LLQsNGIJ1xuICB9LFxuICBjeToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdXZWxzaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0N5bXJhZWcnXG4gIH0sXG4gIGRhOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0RhbmlzaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0RhbnNrJ1xuICB9LFxuICBkZToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdHZXJtYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdEZXV0c2NoJ1xuICB9LFxuICBkaXE6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRGltbGknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdaYXpha2knXG4gIH0sXG4gIGRzYjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdMb3dlcicsXG4gICAgZGlyZWN0aW9uOiAnU29yYmlhbicsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIGR2OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0RpdmVoaScsXG4gICAgZGlyZWN0aW9uOiAncnRsJyxcbiAgICBsb2NhbF90aXRsZTogJ96L3qjeiN6s3oDeqN6E3qbekN6wJ1xuICB9LFxuICBkejoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdEem9uZ2toYScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+C9h+C9vOC9hOC8i+C9gSdcbiAgfSxcbiAgZWU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRXdlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnxpDKi8mbJ1xuICB9LFxuICBmYXI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRmFyc2knLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfZgdin2LHYs9uMJ1xuICB9LFxuICBlbDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdHcmVlaycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ86VzrvOu863zr3Ouc66zqwnXG4gIH0sXG4gIGVuOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0VuZ2xpc2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdFbmdsaXNoJ1xuICB9LFxuICBlbzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdFc3BlcmFudG8nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdFc3BlcmFudG8nXG4gIH0sXG4gIGVzOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NwYW5pc2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdFc3Bhw7FvbCdcbiAgfSxcbiAgZXQ6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRXN0b25pYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdFZXN0aSdcbiAgfSxcbiAgZXU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQmFzcXVlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnRXVza2FyYSdcbiAgfSxcbiAgZXh0OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0V4dHJlbWFkdXJhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0VzdHJlbWXDsXUnXG4gIH0sXG4gIGZmOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1BldWwnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdGdWxmdWxkZSdcbiAgfSxcbiAgZmk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRmlubmlzaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1N1b21pJ1xuICB9LFxuICAnZml1LXZybyc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVsO1cm8nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdWw7VybydcbiAgfSxcbiAgZmo6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRmlqaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTmEnXG4gIH0sXG4gIGZvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0Zhcm9lc2UnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdGw7hyb3lza3QnXG4gIH0sXG4gIGZyOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0ZyZW5jaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0ZyYW7Dp2FpcydcbiAgfSxcbiAgZnJwOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0FycGl0YW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdBcnBpdGFuJ1xuICB9LFxuICBmdXI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnRnJpdWxpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdGdXJsYW4nXG4gIH0sXG4gIGZ5OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1dlc3QnLFxuICAgIGRpcmVjdGlvbjogJ0ZyaXNpYW4nLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICBnYToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdJcmlzaCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0dhZWlsZ2UnXG4gIH0sXG4gIGdhbjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdHYW4nLFxuICAgIGRpcmVjdGlvbjogJ0NoaW5lc2UnLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICBnZDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTY290dGlzaCcsXG4gICAgZGlyZWN0aW9uOiAnR2FlbGljJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgZ2lsOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0dpbGJlcnRlc2UnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdUYWV0YWUnXG4gIH0sXG4gIGdsOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0dhbGljaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnR2FsZWdvJ1xuICB9LFxuICBnbjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdHdWFyYW5pJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiBcIkF2YcOxZSfhur1cIlxuICB9LFxuICBnb3Q6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnR290aGljJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnZ3V0aXNrJ1xuICB9LFxuICBndToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdHdWphcmF0aScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+Cql+CrgeCqnOCqsOCqvuCqpOCrgCdcbiAgfSxcbiAgZ3Y6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTWFueCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0dhZWxnJ1xuICB9LFxuICBoYToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdIYXVzYScsXG4gICAgZGlyZWN0aW9uOiAncnRsJyxcbiAgICBsb2NhbF90aXRsZTogJ9mH2Y7ZiNmP2LPZjidcbiAgfSxcbiAgaGFrOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0hha2thJyxcbiAgICBkaXJlY3Rpb246ICdDaGluZXNlJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgaGF3OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0hhd2FpaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnSGF3YWlgaSdcbiAgfSxcbiAgaGU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnSGVicmV3JyxcbiAgICBkaXJlY3Rpb246ICdydGwnLFxuICAgIGxvY2FsX3RpdGxlOiAn16LXkdeo15nXqidcbiAgfSxcbiAgaGk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnSGluZGknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfgpLngpL/gpKjgpY3gpKbgpYAnXG4gIH0sXG4gIGhvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0hpcmknLFxuICAgIGRpcmVjdGlvbjogJ01vdHUnLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICBocjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdDcm9hdGlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0hydmF0c2tpJ1xuICB9LFxuICBodDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdIYWl0aWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnS3LDqHlvbCdcbiAgfSxcbiAgaHU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnSHVuZ2FyaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTWFneWFyJ1xuICB9LFxuICBoeToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdBcm1lbmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9WA1aHVtdWl1oDVpdW2J1xuICB9LFxuICBoejoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdIZXJlcm8nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdPdHNpaGVyZXJvJ1xuICB9LFxuICBpYToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdJbnRlcmxpbmd1YScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0ludGVybGluZ3VhJ1xuICB9LFxuICBpZDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdJbmRvbmVzaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQmFoYXNhJ1xuICB9LFxuICBpZToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdJbnRlcmxpbmd1ZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0ludGVybGluZ3VlJ1xuICB9LFxuICBpZzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdJZ2JvJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnSWdibydcbiAgfSxcbiAgaWk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnU2ljaHVhbicsXG4gICAgZGlyZWN0aW9uOiAnWWknLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICBpazoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdJbnVwaWFrJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnScOxdXBpYWsnXG4gIH0sXG4gIGlsbzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdJbG9rYW5vJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnSWxva2FubydcbiAgfSxcbiAgaW86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnSWRvJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnSWRvJ1xuICB9LFxuICBpczoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdJY2VsYW5kaWMnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfDjXNsZW5za2EnXG4gIH0sXG4gIGl0OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0l0YWxpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdJdGFsaWFubydcbiAgfSxcbiAgaXU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnSW51a3RpdHV0JyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4ZCD4ZOE4ZKD4ZGO4ZGQ4ZGmJ1xuICB9LFxuICBqYToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdKYXBhbmVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+aXpeacrOiqnidcbiAgfSxcbiAgamJvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0xvamJhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0xvamJhbidcbiAgfSxcbiAganY6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnSmF2YW5lc2UnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdCYXNhJ1xuICB9LFxuICBrYToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdHZW9yZ2lhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+GDpeGDkOGDoOGDl+GDo+GDmuGDmCdcbiAgfSxcbiAga2c6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnS29uZ28nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdLaUtvbmdvJ1xuICB9LFxuICBraToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdLaWt1eXUnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdHxKlrxal5xaknXG4gIH0sXG4gIGtqOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0t1YW55YW1hJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnS3VhbnlhbWEnXG4gIH0sXG4gIGtrOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0themFraCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9Ka0LDQt9Cw0pvRiNCwJ1xuICB9LFxuICBrbDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdHcmVlbmxhbmRpYycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0thbGFhbGxpc3V0J1xuICB9LFxuICBrbToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdDYW1ib2RpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfhnpfhnrbhnp/hnrbhnoHhn5Lhnpjhn4LhnponXG4gIH0sXG4gIGtuOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0thbm5hZGEnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfgspXgsqjgs43gsqjgsqEnXG4gIH0sXG4gIGtodzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdLaG93YXInLFxuICAgIGRpcmVjdGlvbjogJ3J0bCcsXG4gICAgbG9jYWxfdGl0bGU6ICfaqdq+2YjYp9ixJ1xuICB9LFxuICBrbzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdLb3JlYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICftlZzqta3slrQnXG4gIH0sXG4gIGtyOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0thbnVyaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0thbnVyaSdcbiAgfSxcbiAga3M6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnS2FzaG1pcmknLFxuICAgIGRpcmVjdGlvbjogJ3J0bCcsXG4gICAgbG9jYWxfdGl0bGU6ICfgpJXgpLbgpY3gpK7gpYDgpLDgpYAnXG4gIH0sXG4gIGtzaDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdSaXB1YXJpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdSaXBvYXJpc2NoJ1xuICB9LFxuICBrdToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdLdXJkaXNoJyxcbiAgICBkaXJlY3Rpb246ICdydGwnLFxuICAgIGxvY2FsX3RpdGxlOiAnS3VyZMOuJ1xuICB9LFxuICBrdjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdLb21pJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn0JrQvtC80LgnXG4gIH0sXG4gIGt3OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0Nvcm5pc2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdLZXJuZXdlaydcbiAgfSxcbiAga3k6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnS2lyZ2hpeicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0vEsXJnxLF6Y2EnXG4gIH0sXG4gIGxhOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0xhdGluJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTGF0aW5hJ1xuICB9LFxuICBsYWQ6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTGFkaW5vJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnRHpodWRlem1vJ1xuICB9LFxuICBsYW46IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTGFuZ28nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdMZWInXG4gIH0sXG4gIGxiOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0x1eGVtYm91cmdpc2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdMw6t0emVidWVyZ2VzY2gnXG4gIH0sXG4gIGxnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0dhbmRhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTHVnYW5kYSdcbiAgfSxcbiAgbGk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTGltYnVyZ2lhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0xpbWJ1cmdzJ1xuICB9LFxuICBsaWo6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTGlndXJpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdMw61ndXJ1J1xuICB9LFxuICBsbW86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTG9tYmFyZCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0x1bWJhYXJ0J1xuICB9LFxuICBsbjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdMaW5nYWxhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTGluZ8OhbGEnXG4gIH0sXG4gIGxvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0xhb3RpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfguqXgurLguqcnXG4gIH0sXG4gIGx0OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0xpdGh1YW5pYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdMaWV0dXZpxbMnXG4gIH0sXG4gIGx2OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0xhdHZpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdMYXR2aWXFoXUnXG4gIH0sXG4gICdtYXAtYm1zJzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdCYW55dW1hc2FuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQmFzYSdcbiAgfSxcbiAgbWc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTWFsYWdhc3knLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdNYWxhZ2FzeSdcbiAgfSxcbiAgbWFuOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ01hbmRhcmluJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn5a6Y6KmxJ1xuICB9LFxuICBtaDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdNYXJzaGFsbGVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0thamluJ1xuICB9LFxuICBtaToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdNYW9yaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ03EgW9yaSdcbiAgfSxcbiAgbWluOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ01pbmFuZ2thYmF1JyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTWluYW5na2FiYXUnXG4gIH0sXG4gIG1rOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ01hY2Vkb25pYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfQnNCw0LrQtdC00L7QvdGB0LrQuCdcbiAgfSxcbiAgbWw6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTWFsYXlhbGFtJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4LSu4LSy4LSv4LS+4LSz4LSCJ1xuICB9LFxuICBtbjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdNb25nb2xpYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfQnNC+0L3Qs9C+0LsnXG4gIH0sXG4gIG1vOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ01vbGRvdmFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTW9sZG92ZW5lYXNjxIMnXG4gIH0sXG4gIG1yOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ01hcmF0aGknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfgpK7gpLDgpL7gpKDgpYAnXG4gIH0sXG4gIG1zOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ01hbGF5JyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQmFoYXNhJ1xuICB9LFxuICBtdDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdNYWx0ZXNlJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnYmlsLU1hbHRpJ1xuICB9LFxuICBtdXM6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQ3JlZWsnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdNdXNrb2dlZSdcbiAgfSxcbiAgbXk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQnVybWVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ015YW5tYXNhJ1xuICB9LFxuICBuYToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdOYXVydWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnRG9yZXJpbidcbiAgfSxcbiAgbmFoOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ05haHVhdGwnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdOYWh1YXRsJ1xuICB9LFxuICBuYXA6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTmVhcG9saXRhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ05uYXB1bGl0YW5vJ1xuICB9LFxuICBuZDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdOb3J0aCcsXG4gICAgZGlyZWN0aW9uOiAnTmRlYmVsZScsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIG5kczoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdMb3cgR2VybWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnUGxhdHRkw7zDvHRzY2gnXG4gIH0sXG4gICduZHMtbmwnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0R1dGNoJyxcbiAgICBkaXJlY3Rpb246ICdMb3cnLFxuICAgIGxvY2FsX3RpdGxlOiAnU2F4b24nXG4gIH0sXG4gIG5lOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ05lcGFsaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+CkqOClh+CkquCkvuCksuClgCdcbiAgfSxcbiAgbmV3OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ05ld2FyJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4KSo4KWH4KSq4KS+4KSy4KSt4KS+4KS34KS+J1xuICB9LFxuICBuZzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdOZG9uZ2EnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdPc2hpd2FtYm8nXG4gIH0sXG4gIG5sOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0R1dGNoJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTmVkZXJsYW5kcydcbiAgfSxcbiAgbm46IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTm9yd2VnaWFuJyxcbiAgICBkaXJlY3Rpb246ICdOeW5vcnNrJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgbm86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTm9yd2VnaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTm9yc2snXG4gIH0sXG4gIG5yOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NvdXRoJyxcbiAgICBkaXJlY3Rpb246ICdOZGViZWxlJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgbnNvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ05vcnRoZXJuJyxcbiAgICBkaXJlY3Rpb246ICdTb3RobycsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIG5ybToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdOb3JtYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdOb3Vvcm1hbmQnXG4gIH0sXG4gIG52OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ05hdmFqbycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0RpbsOpJ1xuICB9LFxuICBueToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdDaGljaGV3YScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0NoaS1DaGV3YSdcbiAgfSxcbiAgb2M6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnT2NjaXRhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ09jY2l0YW4nXG4gIH0sXG4gIG9qOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ09qaWJ3YScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+GQiuGTguGUkeGTiOGQr+GSp+GQjuGTkCdcbiAgfSxcbiAgb206IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnT3JvbW8nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdPcm9tb28nXG4gIH0sXG4gIG9yOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ09yaXlhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4KyT4Kyh4Ky84Ky/4KyGJ1xuICB9LFxuICBvczoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdPc3NldGlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9CY0YDQvtC90LDRgydcbiAgfSxcbiAgcGE6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnUGFuamFiaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+CoquCpsOConOCovuCorOCpgCdcbiAgfSxcbiAgcGFnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1Bhbmdhc2luYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdQYW5nYXNpbmFuJ1xuICB9LFxuICBwYW06IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnS2FwYW1wYW5nYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdLYXBhbXBhbmdhbidcbiAgfSxcbiAgcGFwOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1BhcGlhbWVudHUnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdQYXBpYW1lbnR1J1xuICB9LFxuICBwZGM6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnUGVubnN5bHZhbmlhJyxcbiAgICBkaXJlY3Rpb246ICdHZXJtYW4nLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICBwaToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdQYWxpJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnUMSBbGknXG4gIH0sXG4gIHBpaDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdOb3Jmb2xrJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTm9yZnVrJ1xuICB9LFxuICBwbDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdQb2xpc2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdQb2xza2knXG4gIH0sXG4gIHBtczoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdQaWVkbW9udGVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1BpZW1vbnTDqGlzJ1xuICB9LFxuICBwczoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdQYXNodG8nLFxuICAgIGRpcmVjdGlvbjogJ3J0bCcsXG4gICAgbG9jYWxfdGl0bGU6ICfZvtqa2KrZiCdcbiAgfSxcbiAgcHQ6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnUG9ydHVndWVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1BvcnR1Z3XDqnMnXG4gIH0sXG4gIHF1OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1F1ZWNodWEnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdSdW5hJ1xuICB9LFxuICBybToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdSYWV0bycsXG4gICAgZGlyZWN0aW9uOiAnUm9tYW5jZScsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIHJteToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdSb21hbmknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdSb21hbmknXG4gIH0sXG4gIHJuOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0tpcnVuZGknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdLaXJ1bmRpJ1xuICB9LFxuICBybzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdSb21hbmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1JvbcOibsSDJ1xuICB9LFxuICAncm9hLXJ1cCc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQXJvbWFuaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnQXJtw6JuZWFzaHRpJ1xuICB9LFxuICBydToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdSdXNzaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn0KDRg9GB0YHQutC40LknXG4gIH0sXG4gIHJ3OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1J3YW5kaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0tpbnlhcndhbmRpJ1xuICB9LFxuICBzYToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTYW5za3JpdCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+CkuOCkguCkuOCljeCkleClg+CkpOCkruCljSdcbiAgfSxcbiAgc2M6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnU2FyZGluaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnU2FyZHUnXG4gIH0sXG4gIHNjbjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTaWNpbGlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1NpY2lsaWFudSdcbiAgfSxcbiAgc2NvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1Njb3RzJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnU2NvdHMnXG4gIH0sXG4gIHNkOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NpbmRoaScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+CkuOCkv+CkqOCkp+CkvydcbiAgfSxcbiAgc2U6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnTm9ydGhlcm4nLFxuICAgIGRpcmVjdGlvbjogJ1NhbWknLFxuICAgIGxvY2FsX3RpdGxlOiAnbHRyJ1xuICB9LFxuICBzZzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTYW5nbycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1PDpG5nw7YnXG4gIH0sXG4gIHNoOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NlcmJvLUNyb2F0aWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnU3Jwc2tvaHJ2YXRza2knXG4gIH0sXG4gIHNpOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NpbmhhbGVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+C3g+C3kuC2guC3hOC2vSdcbiAgfSxcbiAgc2ltcGxlOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NpbXBsZScsXG4gICAgZGlyZWN0aW9uOiAnRW5nbGlzaCcsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIHNrOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1Nsb3ZhaycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1Nsb3ZlbsSNaW5hJ1xuICB9LFxuICBzbDoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTbG92ZW5pYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdTbG92ZW7FocSNaW5hJ1xuICB9LFxuICBzbToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTYW1vYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdHYWdhbmEnXG4gIH0sXG4gIHNuOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1Nob25hJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnY2hpU2hvbmEnXG4gIH0sXG4gIHNvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NvbWFsaWEnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdTb29tYWFsaWdhJ1xuICB9LFxuICBzcToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdBbGJhbmlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1NocWlwJ1xuICB9LFxuICBzcjoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTZXJiaWFuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn0KHRgNC/0YHQutC4J1xuICB9LFxuICBzczoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTd2F0aScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1NpU3dhdGknXG4gIH0sXG4gIHN0OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1NvdXRoZXJuJyxcbiAgICBkaXJlY3Rpb246ICdTb3RobycsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIHN1OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1N1bmRhbmVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0Jhc2EnXG4gIH0sXG4gIHN2OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1N3ZWRpc2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdTdmVuc2thJ1xuICB9LFxuICBzdzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdTd2FoaWxpJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnS2lzd2FoaWxpJ1xuICB9LFxuICB0YToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdUYW1pbCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+CupOCuruCuv+CutOCvjSdcbiAgfSxcbiAgdGU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVGVsdWd1JyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4LCk4LGG4LCy4LGB4LCX4LGBJ1xuICB9LFxuICB0ZXQ6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVGV0dW0nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdUZXR1bidcbiAgfSxcbiAgdGc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVGFqaWsnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfQotC+0rfQuNC606MnXG4gIH0sXG4gIHRoOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1RoYWknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfguYTguJfguKInXG4gIH0sXG4gIHRpOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1RpZ3JpbnlhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn4Ym14YyN4Yit4YqbJ1xuICB9LFxuICB0azoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdUdXJrbWVuJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAn0KLRg9GA0LrQvNC10L0nXG4gIH0sXG4gIHRsOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1RhZ2Fsb2cnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdUYWdhbG9nJ1xuICB9LFxuICB0bGg6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnS2xpbmdvbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ3RsaEluZ2FuLUhvbCdcbiAgfSxcbiAgdG46IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVHN3YW5hJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnU2V0c3dhbmEnXG4gIH0sXG4gIHRvOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1RvbmdhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnTGVhJ1xuICB9LFxuICB0cGk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVG9rJyxcbiAgICBkaXJlY3Rpb246ICdQaXNpbicsXG4gICAgbG9jYWxfdGl0bGU6ICdsdHInXG4gIH0sXG4gIHRyOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1R1cmtpc2gnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdUw7xya8OnZSdcbiAgfSxcbiAgdHM6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVHNvbmdhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnWGl0c29uZ2EnXG4gIH0sXG4gIHR0OiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1RhdGFyJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnVGF0YXLDp2EnXG4gIH0sXG4gIHR1bToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdUdW1idWthJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnY2hpVHVtYnVrYSdcbiAgfSxcbiAgdHc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVHdpJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnVHdpJ1xuICB9LFxuICB0eToge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdUYWhpdGlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1JlbydcbiAgfSxcbiAgdWRtOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1VkbXVydCcsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9Cj0LTQvNGD0YDRgidcbiAgfSxcbiAgdWc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVXlnaHVyJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnVXnGo3VyccmZJ1xuICB9LFxuICB1azoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdVa3JhaW5pYW4nLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICfQo9C60YDQsNGX0L3RgdGM0LrQsCdcbiAgfSxcbiAgdXI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVXJkdScsXG4gICAgZGlyZWN0aW9uOiAncnRsJyxcbiAgICBsb2NhbF90aXRsZTogJ9in2LHYr9mIJ1xuICB9LFxuICB1ejoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdVemJlaycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9CO0LfQsdC10LonXG4gIH0sXG4gIHZlOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1ZlbmRhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnVHNoaXZlbuG4k2EnXG4gIH0sXG4gIHZpOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1ZpZXRuYW1lc2UnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdWaeG7h3RuYW0nXG4gIH0sXG4gIHZlYzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdWZW5ldGlhbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1bDqG5ldG8nXG4gIH0sXG4gIHZsczoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdXZXN0JyxcbiAgICBkaXJlY3Rpb246ICdGbGVtaXNoJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgdm86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnVm9sYXDDvGsnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdWb2xhcMO8aydcbiAgfSxcbiAgd2E6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnV2FsbG9vbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1dhbG9uJ1xuICB9LFxuICB3YXI6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnV2FyYXktV2FyYXknLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdXaW5hcmF5J1xuICB9LFxuICB3bzoge1xuICAgIGVuZ2xpc2hfdGl0bGU6ICdXb2xvZicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ1dvbGxvZidcbiAgfSxcbiAgeGFsOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0thbG15aycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ9Cl0LDQu9GM0LzQsydcbiAgfSxcbiAgeGg6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnWGhvc2EnLFxuICAgIGRpcmVjdGlvbjogJ2x0cicsXG4gICAgbG9jYWxfdGl0bGU6ICdpc2lYaG9zYSdcbiAgfSxcbiAgeWk6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnWWlkZGlzaCcsXG4gICAgZGlyZWN0aW9uOiAncnRsJyxcbiAgICBsb2NhbF90aXRsZTogJ9eZ15nWtNeT15nXqSdcbiAgfSxcbiAgeW86IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnWW9ydWJhJyxcbiAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgIGxvY2FsX3RpdGxlOiAnWW9yw7liw6EnXG4gIH0sXG4gIHphOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ1podWFuZycsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0N1ZW5naCdcbiAgfSxcbiAgemg6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQ2hpbmVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+S4reaWhydcbiAgfSxcbiAgJ3poLWNsYXNzaWNhbCc6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnQ2xhc3NpY2FsJyxcbiAgICBkaXJlY3Rpb246ICdDaGluZXNlJyxcbiAgICBsb2NhbF90aXRsZTogJ2x0cidcbiAgfSxcbiAgJ3poLW1pbi1uYW4nOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ01pbm5hbicsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ0LDom4tbMOibS1nw7onXG4gIH0sXG4gICd6aC15dWUnOiB7XG4gICAgZW5nbGlzaF90aXRsZTogJ0NhbnRvbmVzZScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ+eyteiqnidcbiAgfSxcbiAgenU6IHtcbiAgICBlbmdsaXNoX3RpdGxlOiAnWnVsdScsXG4gICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICBsb2NhbF90aXRsZTogJ2lzaVp1bHUnXG4gIH1cbn07XG4iLCIvL2Zyb20gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3cvYXBpLnBocD9hY3Rpb249c2l0ZW1hdHJpeCZmb3JtYXQ9anNvblxuY29uc3Qgc2l0ZV9tYXAgPSB7XG4gIGFhd2lraTogJ2h0dHBzOi8vYWEud2lraXBlZGlhLm9yZycsXG4gIGFhd2lrdGlvbmFyeTogJ2h0dHBzOi8vYWEud2lrdGlvbmFyeS5vcmcnLFxuICBhYXdpa2lib29rczogJ2h0dHBzOi8vYWEud2lraWJvb2tzLm9yZycsXG4gIGFid2lraTogJ2h0dHBzOi8vYWIud2lraXBlZGlhLm9yZycsXG4gIGFid2lrdGlvbmFyeTogJ2h0dHBzOi8vYWIud2lrdGlvbmFyeS5vcmcnLFxuICBhY2V3aWtpOiAnaHR0cHM6Ly9hY2Uud2lraXBlZGlhLm9yZycsXG4gIGFmd2lraTogJ2h0dHBzOi8vYWYud2lraXBlZGlhLm9yZycsXG4gIGFmd2lrdGlvbmFyeTogJ2h0dHBzOi8vYWYud2lrdGlvbmFyeS5vcmcnLFxuICBhZndpa2lib29rczogJ2h0dHBzOi8vYWYud2lraWJvb2tzLm9yZycsXG4gIGFmd2lraXF1b3RlOiAnaHR0cHM6Ly9hZi53aWtpcXVvdGUub3JnJyxcbiAgYWt3aWtpOiAnaHR0cHM6Ly9hay53aWtpcGVkaWEub3JnJyxcbiAgYWt3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9hay53aWt0aW9uYXJ5Lm9yZycsXG4gIGFrd2lraWJvb2tzOiAnaHR0cHM6Ly9hay53aWtpYm9va3Mub3JnJyxcbiAgYWxzd2lraTogJ2h0dHBzOi8vYWxzLndpa2lwZWRpYS5vcmcnLFxuICBhbHN3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9hbHMud2lrdGlvbmFyeS5vcmcnLFxuICBhbHN3aWtpYm9va3M6ICdodHRwczovL2Fscy53aWtpYm9va3Mub3JnJyxcbiAgYWxzd2lraXF1b3RlOiAnaHR0cHM6Ly9hbHMud2lraXF1b3RlLm9yZycsXG4gIGFtd2lraTogJ2h0dHBzOi8vYW0ud2lraXBlZGlhLm9yZycsXG4gIGFtd2lrdGlvbmFyeTogJ2h0dHBzOi8vYW0ud2lrdGlvbmFyeS5vcmcnLFxuICBhbXdpa2lxdW90ZTogJ2h0dHBzOi8vYW0ud2lraXF1b3RlLm9yZycsXG4gIGFud2lraTogJ2h0dHBzOi8vYW4ud2lraXBlZGlhLm9yZycsXG4gIGFud2lrdGlvbmFyeTogJ2h0dHBzOi8vYW4ud2lrdGlvbmFyeS5vcmcnLFxuICBhbmd3aWtpOiAnaHR0cHM6Ly9hbmcud2lraXBlZGlhLm9yZycsXG4gIGFuZ3dpa3Rpb25hcnk6ICdodHRwczovL2FuZy53aWt0aW9uYXJ5Lm9yZycsXG4gIGFuZ3dpa2lib29rczogJ2h0dHBzOi8vYW5nLndpa2lib29rcy5vcmcnLFxuICBhbmd3aWtpcXVvdGU6ICdodHRwczovL2FuZy53aWtpcXVvdGUub3JnJyxcbiAgYW5nd2lraXNvdXJjZTogJ2h0dHBzOi8vYW5nLndpa2lzb3VyY2Uub3JnJyxcbiAgYXJ3aWtpOiAnaHR0cHM6Ly9hci53aWtpcGVkaWEub3JnJyxcbiAgYXJ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9hci53aWt0aW9uYXJ5Lm9yZycsXG4gIGFyd2lraWJvb2tzOiAnaHR0cHM6Ly9hci53aWtpYm9va3Mub3JnJyxcbiAgYXJ3aWtpbmV3czogJ2h0dHBzOi8vYXIud2lraW5ld3Mub3JnJyxcbiAgYXJ3aWtpcXVvdGU6ICdodHRwczovL2FyLndpa2lxdW90ZS5vcmcnLFxuICBhcndpa2lzb3VyY2U6ICdodHRwczovL2FyLndpa2lzb3VyY2Uub3JnJyxcbiAgYXJ3aWtpdmVyc2l0eTogJ2h0dHBzOi8vYXIud2lraXZlcnNpdHkub3JnJyxcbiAgYXJjd2lraTogJ2h0dHBzOi8vYXJjLndpa2lwZWRpYS5vcmcnLFxuICBhcnp3aWtpOiAnaHR0cHM6Ly9hcnoud2lraXBlZGlhLm9yZycsXG4gIGFzd2lraTogJ2h0dHBzOi8vYXMud2lraXBlZGlhLm9yZycsXG4gIGFzd2lrdGlvbmFyeTogJ2h0dHBzOi8vYXMud2lrdGlvbmFyeS5vcmcnLFxuICBhc3dpa2lib29rczogJ2h0dHBzOi8vYXMud2lraWJvb2tzLm9yZycsXG4gIGFzd2lraXNvdXJjZTogJ2h0dHBzOi8vYXMud2lraXNvdXJjZS5vcmcnLFxuICBhc3R3aWtpOiAnaHR0cHM6Ly9hc3Qud2lraXBlZGlhLm9yZycsXG4gIGFzdHdpa3Rpb25hcnk6ICdodHRwczovL2FzdC53aWt0aW9uYXJ5Lm9yZycsXG4gIGFzdHdpa2lib29rczogJ2h0dHBzOi8vYXN0Lndpa2lib29rcy5vcmcnLFxuICBhc3R3aWtpcXVvdGU6ICdodHRwczovL2FzdC53aWtpcXVvdGUub3JnJyxcbiAgYXZ3aWtpOiAnaHR0cHM6Ly9hdi53aWtpcGVkaWEub3JnJyxcbiAgYXZ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9hdi53aWt0aW9uYXJ5Lm9yZycsXG4gIGF5d2lraTogJ2h0dHBzOi8vYXkud2lraXBlZGlhLm9yZycsXG4gIGF5d2lrdGlvbmFyeTogJ2h0dHBzOi8vYXkud2lrdGlvbmFyeS5vcmcnLFxuICBheXdpa2lib29rczogJ2h0dHBzOi8vYXkud2lraWJvb2tzLm9yZycsXG4gIGF6d2lraTogJ2h0dHBzOi8vYXoud2lraXBlZGlhLm9yZycsXG4gIGF6d2lrdGlvbmFyeTogJ2h0dHBzOi8vYXoud2lrdGlvbmFyeS5vcmcnLFxuICBhendpa2lib29rczogJ2h0dHBzOi8vYXoud2lraWJvb2tzLm9yZycsXG4gIGF6d2lraXF1b3RlOiAnaHR0cHM6Ly9hei53aWtpcXVvdGUub3JnJyxcbiAgYXp3aWtpc291cmNlOiAnaHR0cHM6Ly9hei53aWtpc291cmNlLm9yZycsXG4gIGJhd2lraTogJ2h0dHBzOi8vYmEud2lraXBlZGlhLm9yZycsXG4gIGJhd2lraWJvb2tzOiAnaHR0cHM6Ly9iYS53aWtpYm9va3Mub3JnJyxcbiAgYmFyd2lraTogJ2h0dHBzOi8vYmFyLndpa2lwZWRpYS5vcmcnLFxuICBiYXRfc21nd2lraTogJ2h0dHBzOi8vYmF0LXNtZy53aWtpcGVkaWEub3JnJyxcbiAgYmNsd2lraTogJ2h0dHBzOi8vYmNsLndpa2lwZWRpYS5vcmcnLFxuICBiZXdpa2k6ICdodHRwczovL2JlLndpa2lwZWRpYS5vcmcnLFxuICBiZXdpa3Rpb25hcnk6ICdodHRwczovL2JlLndpa3Rpb25hcnkub3JnJyxcbiAgYmV3aWtpYm9va3M6ICdodHRwczovL2JlLndpa2lib29rcy5vcmcnLFxuICBiZXdpa2lxdW90ZTogJ2h0dHBzOi8vYmUud2lraXF1b3RlLm9yZycsXG4gIGJld2lraXNvdXJjZTogJ2h0dHBzOi8vYmUud2lraXNvdXJjZS5vcmcnLFxuICBiZV94X29sZHdpa2k6ICdodHRwczovL2JlLXgtb2xkLndpa2lwZWRpYS5vcmcnLFxuICBiZ3dpa2k6ICdodHRwczovL2JnLndpa2lwZWRpYS5vcmcnLFxuICBiZ3dpa3Rpb25hcnk6ICdodHRwczovL2JnLndpa3Rpb25hcnkub3JnJyxcbiAgYmd3aWtpYm9va3M6ICdodHRwczovL2JnLndpa2lib29rcy5vcmcnLFxuICBiZ3dpa2luZXdzOiAnaHR0cHM6Ly9iZy53aWtpbmV3cy5vcmcnLFxuICBiZ3dpa2lxdW90ZTogJ2h0dHBzOi8vYmcud2lraXF1b3RlLm9yZycsXG4gIGJnd2lraXNvdXJjZTogJ2h0dHBzOi8vYmcud2lraXNvdXJjZS5vcmcnLFxuICBiaHdpa2k6ICdodHRwczovL2JoLndpa2lwZWRpYS5vcmcnLFxuICBiaHdpa3Rpb25hcnk6ICdodHRwczovL2JoLndpa3Rpb25hcnkub3JnJyxcbiAgYml3aWtpOiAnaHR0cHM6Ly9iaS53aWtpcGVkaWEub3JnJyxcbiAgYml3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9iaS53aWt0aW9uYXJ5Lm9yZycsXG4gIGJpd2lraWJvb2tzOiAnaHR0cHM6Ly9iaS53aWtpYm9va3Mub3JnJyxcbiAgYmpud2lraTogJ2h0dHBzOi8vYmpuLndpa2lwZWRpYS5vcmcnLFxuICBibXdpa2k6ICdodHRwczovL2JtLndpa2lwZWRpYS5vcmcnLFxuICBibXdpa3Rpb25hcnk6ICdodHRwczovL2JtLndpa3Rpb25hcnkub3JnJyxcbiAgYm13aWtpYm9va3M6ICdodHRwczovL2JtLndpa2lib29rcy5vcmcnLFxuICBibXdpa2lxdW90ZTogJ2h0dHBzOi8vYm0ud2lraXF1b3RlLm9yZycsXG4gIGJud2lraTogJ2h0dHBzOi8vYm4ud2lraXBlZGlhLm9yZycsXG4gIGJud2lrdGlvbmFyeTogJ2h0dHBzOi8vYm4ud2lrdGlvbmFyeS5vcmcnLFxuICBibndpa2lib29rczogJ2h0dHBzOi8vYm4ud2lraWJvb2tzLm9yZycsXG4gIGJud2lraXNvdXJjZTogJ2h0dHBzOi8vYm4ud2lraXNvdXJjZS5vcmcnLFxuICBib3dpa2k6ICdodHRwczovL2JvLndpa2lwZWRpYS5vcmcnLFxuICBib3dpa3Rpb25hcnk6ICdodHRwczovL2JvLndpa3Rpb25hcnkub3JnJyxcbiAgYm93aWtpYm9va3M6ICdodHRwczovL2JvLndpa2lib29rcy5vcmcnLFxuICBicHl3aWtpOiAnaHR0cHM6Ly9icHkud2lraXBlZGlhLm9yZycsXG4gIGJyd2lraTogJ2h0dHBzOi8vYnIud2lraXBlZGlhLm9yZycsXG4gIGJyd2lrdGlvbmFyeTogJ2h0dHBzOi8vYnIud2lrdGlvbmFyeS5vcmcnLFxuICBicndpa2lxdW90ZTogJ2h0dHBzOi8vYnIud2lraXF1b3RlLm9yZycsXG4gIGJyd2lraXNvdXJjZTogJ2h0dHBzOi8vYnIud2lraXNvdXJjZS5vcmcnLFxuICBic3dpa2k6ICdodHRwczovL2JzLndpa2lwZWRpYS5vcmcnLFxuICBic3dpa3Rpb25hcnk6ICdodHRwczovL2JzLndpa3Rpb25hcnkub3JnJyxcbiAgYnN3aWtpYm9va3M6ICdodHRwczovL2JzLndpa2lib29rcy5vcmcnLFxuICBic3dpa2luZXdzOiAnaHR0cHM6Ly9icy53aWtpbmV3cy5vcmcnLFxuICBic3dpa2lxdW90ZTogJ2h0dHBzOi8vYnMud2lraXF1b3RlLm9yZycsXG4gIGJzd2lraXNvdXJjZTogJ2h0dHBzOi8vYnMud2lraXNvdXJjZS5vcmcnLFxuICBidWd3aWtpOiAnaHR0cHM6Ly9idWcud2lraXBlZGlhLm9yZycsXG4gIGJ4cndpa2k6ICdodHRwczovL2J4ci53aWtpcGVkaWEub3JnJyxcbiAgY2F3aWtpOiAnaHR0cHM6Ly9jYS53aWtpcGVkaWEub3JnJyxcbiAgY2F3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9jYS53aWt0aW9uYXJ5Lm9yZycsXG4gIGNhd2lraWJvb2tzOiAnaHR0cHM6Ly9jYS53aWtpYm9va3Mub3JnJyxcbiAgY2F3aWtpbmV3czogJ2h0dHBzOi8vY2Eud2lraW5ld3Mub3JnJyxcbiAgY2F3aWtpcXVvdGU6ICdodHRwczovL2NhLndpa2lxdW90ZS5vcmcnLFxuICBjYXdpa2lzb3VyY2U6ICdodHRwczovL2NhLndpa2lzb3VyY2Uub3JnJyxcbiAgY2JrX3phbXdpa2k6ICdodHRwczovL2Niay16YW0ud2lraXBlZGlhLm9yZycsXG4gIGNkb3dpa2k6ICdodHRwczovL2Nkby53aWtpcGVkaWEub3JnJyxcbiAgY2V3aWtpOiAnaHR0cHM6Ly9jZS53aWtpcGVkaWEub3JnJyxcbiAgY2Vid2lraTogJ2h0dHBzOi8vY2ViLndpa2lwZWRpYS5vcmcnLFxuICBjaHdpa2k6ICdodHRwczovL2NoLndpa2lwZWRpYS5vcmcnLFxuICBjaHdpa3Rpb25hcnk6ICdodHRwczovL2NoLndpa3Rpb25hcnkub3JnJyxcbiAgY2h3aWtpYm9va3M6ICdodHRwczovL2NoLndpa2lib29rcy5vcmcnLFxuICBjaG93aWtpOiAnaHR0cHM6Ly9jaG8ud2lraXBlZGlhLm9yZycsXG4gIGNocndpa2k6ICdodHRwczovL2Noci53aWtpcGVkaWEub3JnJyxcbiAgY2hyd2lrdGlvbmFyeTogJ2h0dHBzOi8vY2hyLndpa3Rpb25hcnkub3JnJyxcbiAgY2h5d2lraTogJ2h0dHBzOi8vY2h5Lndpa2lwZWRpYS5vcmcnLFxuICBja2J3aWtpOiAnaHR0cHM6Ly9ja2Iud2lraXBlZGlhLm9yZycsXG4gIGNvd2lraTogJ2h0dHBzOi8vY28ud2lraXBlZGlhLm9yZycsXG4gIGNvd2lrdGlvbmFyeTogJ2h0dHBzOi8vY28ud2lrdGlvbmFyeS5vcmcnLFxuICBjb3dpa2lib29rczogJ2h0dHBzOi8vY28ud2lraWJvb2tzLm9yZycsXG4gIGNvd2lraXF1b3RlOiAnaHR0cHM6Ly9jby53aWtpcXVvdGUub3JnJyxcbiAgY3J3aWtpOiAnaHR0cHM6Ly9jci53aWtpcGVkaWEub3JnJyxcbiAgY3J3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9jci53aWt0aW9uYXJ5Lm9yZycsXG4gIGNyd2lraXF1b3RlOiAnaHR0cHM6Ly9jci53aWtpcXVvdGUub3JnJyxcbiAgY3Jod2lraTogJ2h0dHBzOi8vY3JoLndpa2lwZWRpYS5vcmcnLFxuICBjc3dpa2k6ICdodHRwczovL2NzLndpa2lwZWRpYS5vcmcnLFxuICBjc3dpa3Rpb25hcnk6ICdodHRwczovL2NzLndpa3Rpb25hcnkub3JnJyxcbiAgY3N3aWtpYm9va3M6ICdodHRwczovL2NzLndpa2lib29rcy5vcmcnLFxuICBjc3dpa2luZXdzOiAnaHR0cHM6Ly9jcy53aWtpbmV3cy5vcmcnLFxuICBjc3dpa2lxdW90ZTogJ2h0dHBzOi8vY3Mud2lraXF1b3RlLm9yZycsXG4gIGNzd2lraXNvdXJjZTogJ2h0dHBzOi8vY3Mud2lraXNvdXJjZS5vcmcnLFxuICBjc3dpa2l2ZXJzaXR5OiAnaHR0cHM6Ly9jcy53aWtpdmVyc2l0eS5vcmcnLFxuICBjc2J3aWtpOiAnaHR0cHM6Ly9jc2Iud2lraXBlZGlhLm9yZycsXG4gIGNzYndpa3Rpb25hcnk6ICdodHRwczovL2NzYi53aWt0aW9uYXJ5Lm9yZycsXG4gIGN1d2lraTogJ2h0dHBzOi8vY3Uud2lraXBlZGlhLm9yZycsXG4gIGN2d2lraTogJ2h0dHBzOi8vY3Yud2lraXBlZGlhLm9yZycsXG4gIGN2d2lraWJvb2tzOiAnaHR0cHM6Ly9jdi53aWtpYm9va3Mub3JnJyxcbiAgY3l3aWtpOiAnaHR0cHM6Ly9jeS53aWtpcGVkaWEub3JnJyxcbiAgY3l3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9jeS53aWt0aW9uYXJ5Lm9yZycsXG4gIGN5d2lraWJvb2tzOiAnaHR0cHM6Ly9jeS53aWtpYm9va3Mub3JnJyxcbiAgY3l3aWtpcXVvdGU6ICdodHRwczovL2N5Lndpa2lxdW90ZS5vcmcnLFxuICBjeXdpa2lzb3VyY2U6ICdodHRwczovL2N5Lndpa2lzb3VyY2Uub3JnJyxcbiAgZGF3aWtpOiAnaHR0cHM6Ly9kYS53aWtpcGVkaWEub3JnJyxcbiAgZGF3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9kYS53aWt0aW9uYXJ5Lm9yZycsXG4gIGRhd2lraWJvb2tzOiAnaHR0cHM6Ly9kYS53aWtpYm9va3Mub3JnJyxcbiAgZGF3aWtpcXVvdGU6ICdodHRwczovL2RhLndpa2lxdW90ZS5vcmcnLFxuICBkYXdpa2lzb3VyY2U6ICdodHRwczovL2RhLndpa2lzb3VyY2Uub3JnJyxcbiAgZGV3aWtpOiAnaHR0cHM6Ly9kZS53aWtpcGVkaWEub3JnJyxcbiAgZGV3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9kZS53aWt0aW9uYXJ5Lm9yZycsXG4gIGRld2lraWJvb2tzOiAnaHR0cHM6Ly9kZS53aWtpYm9va3Mub3JnJyxcbiAgZGV3aWtpbmV3czogJ2h0dHBzOi8vZGUud2lraW5ld3Mub3JnJyxcbiAgZGV3aWtpcXVvdGU6ICdodHRwczovL2RlLndpa2lxdW90ZS5vcmcnLFxuICBkZXdpa2lzb3VyY2U6ICdodHRwczovL2RlLndpa2lzb3VyY2Uub3JnJyxcbiAgZGV3aWtpdmVyc2l0eTogJ2h0dHBzOi8vZGUud2lraXZlcnNpdHkub3JnJyxcbiAgZGV3aWtpdm95YWdlOiAnaHR0cHM6Ly9kZS53aWtpdm95YWdlLm9yZycsXG4gIGRpcXdpa2k6ICdodHRwczovL2RpcS53aWtpcGVkaWEub3JnJyxcbiAgZHNid2lraTogJ2h0dHBzOi8vZHNiLndpa2lwZWRpYS5vcmcnLFxuICBkdndpa2k6ICdodHRwczovL2R2Lndpa2lwZWRpYS5vcmcnLFxuICBkdndpa3Rpb25hcnk6ICdodHRwczovL2R2Lndpa3Rpb25hcnkub3JnJyxcbiAgZHp3aWtpOiAnaHR0cHM6Ly9kei53aWtpcGVkaWEub3JnJyxcbiAgZHp3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9kei53aWt0aW9uYXJ5Lm9yZycsXG4gIGVld2lraTogJ2h0dHBzOi8vZWUud2lraXBlZGlhLm9yZycsXG4gIGVsd2lraTogJ2h0dHBzOi8vZWwud2lraXBlZGlhLm9yZycsXG4gIGVsd2lrdGlvbmFyeTogJ2h0dHBzOi8vZWwud2lrdGlvbmFyeS5vcmcnLFxuICBlbHdpa2lib29rczogJ2h0dHBzOi8vZWwud2lraWJvb2tzLm9yZycsXG4gIGVsd2lraW5ld3M6ICdodHRwczovL2VsLndpa2luZXdzLm9yZycsXG4gIGVsd2lraXF1b3RlOiAnaHR0cHM6Ly9lbC53aWtpcXVvdGUub3JnJyxcbiAgZWx3aWtpc291cmNlOiAnaHR0cHM6Ly9lbC53aWtpc291cmNlLm9yZycsXG4gIGVsd2lraXZlcnNpdHk6ICdodHRwczovL2VsLndpa2l2ZXJzaXR5Lm9yZycsXG4gIGVsd2lraXZveWFnZTogJ2h0dHBzOi8vZWwud2lraXZveWFnZS5vcmcnLFxuICBlbWx3aWtpOiAnaHR0cHM6Ly9lbWwud2lraXBlZGlhLm9yZycsXG4gIGVud2lraTogJ2h0dHBzOi8vZW4ud2lraXBlZGlhLm9yZycsXG4gIGVud2lrdGlvbmFyeTogJ2h0dHBzOi8vZW4ud2lrdGlvbmFyeS5vcmcnLFxuICBlbndpa2lib29rczogJ2h0dHBzOi8vZW4ud2lraWJvb2tzLm9yZycsXG4gIGVud2lraW5ld3M6ICdodHRwczovL2VuLndpa2luZXdzLm9yZycsXG4gIGVud2lraXF1b3RlOiAnaHR0cHM6Ly9lbi53aWtpcXVvdGUub3JnJyxcbiAgZW53aWtpc291cmNlOiAnaHR0cHM6Ly9lbi53aWtpc291cmNlLm9yZycsXG4gIGVud2lraXZlcnNpdHk6ICdodHRwczovL2VuLndpa2l2ZXJzaXR5Lm9yZycsXG4gIGVud2lraXZveWFnZTogJ2h0dHBzOi8vZW4ud2lraXZveWFnZS5vcmcnLFxuICBlb3dpa2k6ICdodHRwczovL2VvLndpa2lwZWRpYS5vcmcnLFxuICBlb3dpa3Rpb25hcnk6ICdodHRwczovL2VvLndpa3Rpb25hcnkub3JnJyxcbiAgZW93aWtpYm9va3M6ICdodHRwczovL2VvLndpa2lib29rcy5vcmcnLFxuICBlb3dpa2luZXdzOiAnaHR0cHM6Ly9lby53aWtpbmV3cy5vcmcnLFxuICBlb3dpa2lxdW90ZTogJ2h0dHBzOi8vZW8ud2lraXF1b3RlLm9yZycsXG4gIGVvd2lraXNvdXJjZTogJ2h0dHBzOi8vZW8ud2lraXNvdXJjZS5vcmcnLFxuICBlc3dpa2k6ICdodHRwczovL2VzLndpa2lwZWRpYS5vcmcnLFxuICBlc3dpa3Rpb25hcnk6ICdodHRwczovL2VzLndpa3Rpb25hcnkub3JnJyxcbiAgZXN3aWtpYm9va3M6ICdodHRwczovL2VzLndpa2lib29rcy5vcmcnLFxuICBlc3dpa2luZXdzOiAnaHR0cHM6Ly9lcy53aWtpbmV3cy5vcmcnLFxuICBlc3dpa2lxdW90ZTogJ2h0dHBzOi8vZXMud2lraXF1b3RlLm9yZycsXG4gIGVzd2lraXNvdXJjZTogJ2h0dHBzOi8vZXMud2lraXNvdXJjZS5vcmcnLFxuICBlc3dpa2l2ZXJzaXR5OiAnaHR0cHM6Ly9lcy53aWtpdmVyc2l0eS5vcmcnLFxuICBlc3dpa2l2b3lhZ2U6ICdodHRwczovL2VzLndpa2l2b3lhZ2Uub3JnJyxcbiAgZXR3aWtpOiAnaHR0cHM6Ly9ldC53aWtpcGVkaWEub3JnJyxcbiAgZXR3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9ldC53aWt0aW9uYXJ5Lm9yZycsXG4gIGV0d2lraWJvb2tzOiAnaHR0cHM6Ly9ldC53aWtpYm9va3Mub3JnJyxcbiAgZXR3aWtpcXVvdGU6ICdodHRwczovL2V0Lndpa2lxdW90ZS5vcmcnLFxuICBldHdpa2lzb3VyY2U6ICdodHRwczovL2V0Lndpa2lzb3VyY2Uub3JnJyxcbiAgZXV3aWtpOiAnaHR0cHM6Ly9ldS53aWtpcGVkaWEub3JnJyxcbiAgZXV3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9ldS53aWt0aW9uYXJ5Lm9yZycsXG4gIGV1d2lraWJvb2tzOiAnaHR0cHM6Ly9ldS53aWtpYm9va3Mub3JnJyxcbiAgZXV3aWtpcXVvdGU6ICdodHRwczovL2V1Lndpa2lxdW90ZS5vcmcnLFxuICBleHR3aWtpOiAnaHR0cHM6Ly9leHQud2lraXBlZGlhLm9yZycsXG4gIGZhd2lraTogJ2h0dHBzOi8vZmEud2lraXBlZGlhLm9yZycsXG4gIGZhd2lrdGlvbmFyeTogJ2h0dHBzOi8vZmEud2lrdGlvbmFyeS5vcmcnLFxuICBmYXdpa2lib29rczogJ2h0dHBzOi8vZmEud2lraWJvb2tzLm9yZycsXG4gIGZhd2lraW5ld3M6ICdodHRwczovL2ZhLndpa2luZXdzLm9yZycsXG4gIGZhd2lraXF1b3RlOiAnaHR0cHM6Ly9mYS53aWtpcXVvdGUub3JnJyxcbiAgZmF3aWtpc291cmNlOiAnaHR0cHM6Ly9mYS53aWtpc291cmNlLm9yZycsXG4gIGZhd2lraXZveWFnZTogJ2h0dHBzOi8vZmEud2lraXZveWFnZS5vcmcnLFxuICBmZndpa2k6ICdodHRwczovL2ZmLndpa2lwZWRpYS5vcmcnLFxuICBmaXdpa2k6ICdodHRwczovL2ZpLndpa2lwZWRpYS5vcmcnLFxuICBmaXdpa3Rpb25hcnk6ICdodHRwczovL2ZpLndpa3Rpb25hcnkub3JnJyxcbiAgZml3aWtpYm9va3M6ICdodHRwczovL2ZpLndpa2lib29rcy5vcmcnLFxuICBmaXdpa2luZXdzOiAnaHR0cHM6Ly9maS53aWtpbmV3cy5vcmcnLFxuICBmaXdpa2lxdW90ZTogJ2h0dHBzOi8vZmkud2lraXF1b3RlLm9yZycsXG4gIGZpd2lraXNvdXJjZTogJ2h0dHBzOi8vZmkud2lraXNvdXJjZS5vcmcnLFxuICBmaXdpa2l2ZXJzaXR5OiAnaHR0cHM6Ly9maS53aWtpdmVyc2l0eS5vcmcnLFxuICBmaXVfdnJvd2lraTogJ2h0dHBzOi8vZml1LXZyby53aWtpcGVkaWEub3JnJyxcbiAgZmp3aWtpOiAnaHR0cHM6Ly9mai53aWtpcGVkaWEub3JnJyxcbiAgZmp3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9mai53aWt0aW9uYXJ5Lm9yZycsXG4gIGZvd2lraTogJ2h0dHBzOi8vZm8ud2lraXBlZGlhLm9yZycsXG4gIGZvd2lrdGlvbmFyeTogJ2h0dHBzOi8vZm8ud2lrdGlvbmFyeS5vcmcnLFxuICBmb3dpa2lzb3VyY2U6ICdodHRwczovL2ZvLndpa2lzb3VyY2Uub3JnJyxcbiAgZnJ3aWtpOiAnaHR0cHM6Ly9mci53aWtpcGVkaWEub3JnJyxcbiAgZnJ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9mci53aWt0aW9uYXJ5Lm9yZycsXG4gIGZyd2lraWJvb2tzOiAnaHR0cHM6Ly9mci53aWtpYm9va3Mub3JnJyxcbiAgZnJ3aWtpbmV3czogJ2h0dHBzOi8vZnIud2lraW5ld3Mub3JnJyxcbiAgZnJ3aWtpcXVvdGU6ICdodHRwczovL2ZyLndpa2lxdW90ZS5vcmcnLFxuICBmcndpa2lzb3VyY2U6ICdodHRwczovL2ZyLndpa2lzb3VyY2Uub3JnJyxcbiAgZnJ3aWtpdmVyc2l0eTogJ2h0dHBzOi8vZnIud2lraXZlcnNpdHkub3JnJyxcbiAgZnJ3aWtpdm95YWdlOiAnaHR0cHM6Ly9mci53aWtpdm95YWdlLm9yZycsXG4gIGZycHdpa2k6ICdodHRwczovL2ZycC53aWtpcGVkaWEub3JnJyxcbiAgZnJyd2lraTogJ2h0dHBzOi8vZnJyLndpa2lwZWRpYS5vcmcnLFxuICBmdXJ3aWtpOiAnaHR0cHM6Ly9mdXIud2lraXBlZGlhLm9yZycsXG4gIGZ5d2lraTogJ2h0dHBzOi8vZnkud2lraXBlZGlhLm9yZycsXG4gIGZ5d2lrdGlvbmFyeTogJ2h0dHBzOi8vZnkud2lrdGlvbmFyeS5vcmcnLFxuICBmeXdpa2lib29rczogJ2h0dHBzOi8vZnkud2lraWJvb2tzLm9yZycsXG4gIGdhd2lraTogJ2h0dHBzOi8vZ2Eud2lraXBlZGlhLm9yZycsXG4gIGdhd2lrdGlvbmFyeTogJ2h0dHBzOi8vZ2Eud2lrdGlvbmFyeS5vcmcnLFxuICBnYXdpa2lib29rczogJ2h0dHBzOi8vZ2Eud2lraWJvb2tzLm9yZycsXG4gIGdhd2lraXF1b3RlOiAnaHR0cHM6Ly9nYS53aWtpcXVvdGUub3JnJyxcbiAgZ2Fnd2lraTogJ2h0dHBzOi8vZ2FnLndpa2lwZWRpYS5vcmcnLFxuICBnYW53aWtpOiAnaHR0cHM6Ly9nYW4ud2lraXBlZGlhLm9yZycsXG4gIGdkd2lraTogJ2h0dHBzOi8vZ2Qud2lraXBlZGlhLm9yZycsXG4gIGdkd2lrdGlvbmFyeTogJ2h0dHBzOi8vZ2Qud2lrdGlvbmFyeS5vcmcnLFxuICBnbHdpa2k6ICdodHRwczovL2dsLndpa2lwZWRpYS5vcmcnLFxuICBnbHdpa3Rpb25hcnk6ICdodHRwczovL2dsLndpa3Rpb25hcnkub3JnJyxcbiAgZ2x3aWtpYm9va3M6ICdodHRwczovL2dsLndpa2lib29rcy5vcmcnLFxuICBnbHdpa2lxdW90ZTogJ2h0dHBzOi8vZ2wud2lraXF1b3RlLm9yZycsXG4gIGdsd2lraXNvdXJjZTogJ2h0dHBzOi8vZ2wud2lraXNvdXJjZS5vcmcnLFxuICBnbGt3aWtpOiAnaHR0cHM6Ly9nbGsud2lraXBlZGlhLm9yZycsXG4gIGdud2lraTogJ2h0dHBzOi8vZ24ud2lraXBlZGlhLm9yZycsXG4gIGdud2lrdGlvbmFyeTogJ2h0dHBzOi8vZ24ud2lrdGlvbmFyeS5vcmcnLFxuICBnbndpa2lib29rczogJ2h0dHBzOi8vZ24ud2lraWJvb2tzLm9yZycsXG4gIGdvdHdpa2k6ICdodHRwczovL2dvdC53aWtpcGVkaWEub3JnJyxcbiAgZ290d2lraWJvb2tzOiAnaHR0cHM6Ly9nb3Qud2lraWJvb2tzLm9yZycsXG4gIGd1d2lraTogJ2h0dHBzOi8vZ3Uud2lraXBlZGlhLm9yZycsXG4gIGd1d2lrdGlvbmFyeTogJ2h0dHBzOi8vZ3Uud2lrdGlvbmFyeS5vcmcnLFxuICBndXdpa2lib29rczogJ2h0dHBzOi8vZ3Uud2lraWJvb2tzLm9yZycsXG4gIGd1d2lraXF1b3RlOiAnaHR0cHM6Ly9ndS53aWtpcXVvdGUub3JnJyxcbiAgZ3V3aWtpc291cmNlOiAnaHR0cHM6Ly9ndS53aWtpc291cmNlLm9yZycsXG4gIGd2d2lraTogJ2h0dHBzOi8vZ3Yud2lraXBlZGlhLm9yZycsXG4gIGd2d2lrdGlvbmFyeTogJ2h0dHBzOi8vZ3Yud2lrdGlvbmFyeS5vcmcnLFxuICBoYXdpa2k6ICdodHRwczovL2hhLndpa2lwZWRpYS5vcmcnLFxuICBoYXdpa3Rpb25hcnk6ICdodHRwczovL2hhLndpa3Rpb25hcnkub3JnJyxcbiAgaGFrd2lraTogJ2h0dHBzOi8vaGFrLndpa2lwZWRpYS5vcmcnLFxuICBoYXd3aWtpOiAnaHR0cHM6Ly9oYXcud2lraXBlZGlhLm9yZycsXG4gIGhld2lraTogJ2h0dHBzOi8vaGUud2lraXBlZGlhLm9yZycsXG4gIGhld2lrdGlvbmFyeTogJ2h0dHBzOi8vaGUud2lrdGlvbmFyeS5vcmcnLFxuICBoZXdpa2lib29rczogJ2h0dHBzOi8vaGUud2lraWJvb2tzLm9yZycsXG4gIGhld2lraW5ld3M6ICdodHRwczovL2hlLndpa2luZXdzLm9yZycsXG4gIGhld2lraXF1b3RlOiAnaHR0cHM6Ly9oZS53aWtpcXVvdGUub3JnJyxcbiAgaGV3aWtpc291cmNlOiAnaHR0cHM6Ly9oZS53aWtpc291cmNlLm9yZycsXG4gIGhld2lraXZveWFnZTogJ2h0dHBzOi8vaGUud2lraXZveWFnZS5vcmcnLFxuICBoaXdpa2k6ICdodHRwczovL2hpLndpa2lwZWRpYS5vcmcnLFxuICBoaXdpa3Rpb25hcnk6ICdodHRwczovL2hpLndpa3Rpb25hcnkub3JnJyxcbiAgaGl3aWtpYm9va3M6ICdodHRwczovL2hpLndpa2lib29rcy5vcmcnLFxuICBoaXdpa2lxdW90ZTogJ2h0dHBzOi8vaGkud2lraXF1b3RlLm9yZycsXG4gIGhpZndpa2k6ICdodHRwczovL2hpZi53aWtpcGVkaWEub3JnJyxcbiAgaG93aWtpOiAnaHR0cHM6Ly9oby53aWtpcGVkaWEub3JnJyxcbiAgaHJ3aWtpOiAnaHR0cHM6Ly9oci53aWtpcGVkaWEub3JnJyxcbiAgaHJ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9oci53aWt0aW9uYXJ5Lm9yZycsXG4gIGhyd2lraWJvb2tzOiAnaHR0cHM6Ly9oci53aWtpYm9va3Mub3JnJyxcbiAgaHJ3aWtpcXVvdGU6ICdodHRwczovL2hyLndpa2lxdW90ZS5vcmcnLFxuICBocndpa2lzb3VyY2U6ICdodHRwczovL2hyLndpa2lzb3VyY2Uub3JnJyxcbiAgaHNid2lraTogJ2h0dHBzOi8vaHNiLndpa2lwZWRpYS5vcmcnLFxuICBoc2J3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9oc2Iud2lrdGlvbmFyeS5vcmcnLFxuICBodHdpa2k6ICdodHRwczovL2h0Lndpa2lwZWRpYS5vcmcnLFxuICBodHdpa2lzb3VyY2U6ICdodHRwczovL2h0Lndpa2lzb3VyY2Uub3JnJyxcbiAgaHV3aWtpOiAnaHR0cHM6Ly9odS53aWtpcGVkaWEub3JnJyxcbiAgaHV3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9odS53aWt0aW9uYXJ5Lm9yZycsXG4gIGh1d2lraWJvb2tzOiAnaHR0cHM6Ly9odS53aWtpYm9va3Mub3JnJyxcbiAgaHV3aWtpbmV3czogJ2h0dHBzOi8vaHUud2lraW5ld3Mub3JnJyxcbiAgaHV3aWtpcXVvdGU6ICdodHRwczovL2h1Lndpa2lxdW90ZS5vcmcnLFxuICBodXdpa2lzb3VyY2U6ICdodHRwczovL2h1Lndpa2lzb3VyY2Uub3JnJyxcbiAgaHl3aWtpOiAnaHR0cHM6Ly9oeS53aWtpcGVkaWEub3JnJyxcbiAgaHl3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9oeS53aWt0aW9uYXJ5Lm9yZycsXG4gIGh5d2lraWJvb2tzOiAnaHR0cHM6Ly9oeS53aWtpYm9va3Mub3JnJyxcbiAgaHl3aWtpcXVvdGU6ICdodHRwczovL2h5Lndpa2lxdW90ZS5vcmcnLFxuICBoeXdpa2lzb3VyY2U6ICdodHRwczovL2h5Lndpa2lzb3VyY2Uub3JnJyxcbiAgaHp3aWtpOiAnaHR0cHM6Ly9oei53aWtpcGVkaWEub3JnJyxcbiAgaWF3aWtpOiAnaHR0cHM6Ly9pYS53aWtpcGVkaWEub3JnJyxcbiAgaWF3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9pYS53aWt0aW9uYXJ5Lm9yZycsXG4gIGlhd2lraWJvb2tzOiAnaHR0cHM6Ly9pYS53aWtpYm9va3Mub3JnJyxcbiAgaWR3aWtpOiAnaHR0cHM6Ly9pZC53aWtpcGVkaWEub3JnJyxcbiAgaWR3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9pZC53aWt0aW9uYXJ5Lm9yZycsXG4gIGlkd2lraWJvb2tzOiAnaHR0cHM6Ly9pZC53aWtpYm9va3Mub3JnJyxcbiAgaWR3aWtpcXVvdGU6ICdodHRwczovL2lkLndpa2lxdW90ZS5vcmcnLFxuICBpZHdpa2lzb3VyY2U6ICdodHRwczovL2lkLndpa2lzb3VyY2Uub3JnJyxcbiAgaWV3aWtpOiAnaHR0cHM6Ly9pZS53aWtpcGVkaWEub3JnJyxcbiAgaWV3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9pZS53aWt0aW9uYXJ5Lm9yZycsXG4gIGlld2lraWJvb2tzOiAnaHR0cHM6Ly9pZS53aWtpYm9va3Mub3JnJyxcbiAgaWd3aWtpOiAnaHR0cHM6Ly9pZy53aWtpcGVkaWEub3JnJyxcbiAgaWl3aWtpOiAnaHR0cHM6Ly9paS53aWtpcGVkaWEub3JnJyxcbiAgaWt3aWtpOiAnaHR0cHM6Ly9pay53aWtpcGVkaWEub3JnJyxcbiAgaWt3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9pay53aWt0aW9uYXJ5Lm9yZycsXG4gIGlsb3dpa2k6ICdodHRwczovL2lsby53aWtpcGVkaWEub3JnJyxcbiAgaW93aWtpOiAnaHR0cHM6Ly9pby53aWtpcGVkaWEub3JnJyxcbiAgaW93aWt0aW9uYXJ5OiAnaHR0cHM6Ly9pby53aWt0aW9uYXJ5Lm9yZycsXG4gIGlzd2lraTogJ2h0dHBzOi8vaXMud2lraXBlZGlhLm9yZycsXG4gIGlzd2lrdGlvbmFyeTogJ2h0dHBzOi8vaXMud2lrdGlvbmFyeS5vcmcnLFxuICBpc3dpa2lib29rczogJ2h0dHBzOi8vaXMud2lraWJvb2tzLm9yZycsXG4gIGlzd2lraXF1b3RlOiAnaHR0cHM6Ly9pcy53aWtpcXVvdGUub3JnJyxcbiAgaXN3aWtpc291cmNlOiAnaHR0cHM6Ly9pcy53aWtpc291cmNlLm9yZycsXG4gIGl0d2lraTogJ2h0dHBzOi8vaXQud2lraXBlZGlhLm9yZycsXG4gIGl0d2lrdGlvbmFyeTogJ2h0dHBzOi8vaXQud2lrdGlvbmFyeS5vcmcnLFxuICBpdHdpa2lib29rczogJ2h0dHBzOi8vaXQud2lraWJvb2tzLm9yZycsXG4gIGl0d2lraW5ld3M6ICdodHRwczovL2l0Lndpa2luZXdzLm9yZycsXG4gIGl0d2lraXF1b3RlOiAnaHR0cHM6Ly9pdC53aWtpcXVvdGUub3JnJyxcbiAgaXR3aWtpc291cmNlOiAnaHR0cHM6Ly9pdC53aWtpc291cmNlLm9yZycsXG4gIGl0d2lraXZlcnNpdHk6ICdodHRwczovL2l0Lndpa2l2ZXJzaXR5Lm9yZycsXG4gIGl0d2lraXZveWFnZTogJ2h0dHBzOi8vaXQud2lraXZveWFnZS5vcmcnLFxuICBpdXdpa2k6ICdodHRwczovL2l1Lndpa2lwZWRpYS5vcmcnLFxuICBpdXdpa3Rpb25hcnk6ICdodHRwczovL2l1Lndpa3Rpb25hcnkub3JnJyxcbiAgamF3aWtpOiAnaHR0cHM6Ly9qYS53aWtpcGVkaWEub3JnJyxcbiAgamF3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9qYS53aWt0aW9uYXJ5Lm9yZycsXG4gIGphd2lraWJvb2tzOiAnaHR0cHM6Ly9qYS53aWtpYm9va3Mub3JnJyxcbiAgamF3aWtpbmV3czogJ2h0dHBzOi8vamEud2lraW5ld3Mub3JnJyxcbiAgamF3aWtpcXVvdGU6ICdodHRwczovL2phLndpa2lxdW90ZS5vcmcnLFxuICBqYXdpa2lzb3VyY2U6ICdodHRwczovL2phLndpa2lzb3VyY2Uub3JnJyxcbiAgamF3aWtpdmVyc2l0eTogJ2h0dHBzOi8vamEud2lraXZlcnNpdHkub3JnJyxcbiAgamJvd2lraTogJ2h0dHBzOi8vamJvLndpa2lwZWRpYS5vcmcnLFxuICBqYm93aWt0aW9uYXJ5OiAnaHR0cHM6Ly9qYm8ud2lrdGlvbmFyeS5vcmcnLFxuICBqdndpa2k6ICdodHRwczovL2p2Lndpa2lwZWRpYS5vcmcnLFxuICBqdndpa3Rpb25hcnk6ICdodHRwczovL2p2Lndpa3Rpb25hcnkub3JnJyxcbiAga2F3aWtpOiAnaHR0cHM6Ly9rYS53aWtpcGVkaWEub3JnJyxcbiAga2F3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9rYS53aWt0aW9uYXJ5Lm9yZycsXG4gIGthd2lraWJvb2tzOiAnaHR0cHM6Ly9rYS53aWtpYm9va3Mub3JnJyxcbiAga2F3aWtpcXVvdGU6ICdodHRwczovL2thLndpa2lxdW90ZS5vcmcnLFxuICBrYWF3aWtpOiAnaHR0cHM6Ly9rYWEud2lraXBlZGlhLm9yZycsXG4gIGthYndpa2k6ICdodHRwczovL2thYi53aWtpcGVkaWEub3JnJyxcbiAga2Jkd2lraTogJ2h0dHBzOi8va2JkLndpa2lwZWRpYS5vcmcnLFxuICBrZ3dpa2k6ICdodHRwczovL2tnLndpa2lwZWRpYS5vcmcnLFxuICBraXdpa2k6ICdodHRwczovL2tpLndpa2lwZWRpYS5vcmcnLFxuICBrandpa2k6ICdodHRwczovL2tqLndpa2lwZWRpYS5vcmcnLFxuICBra3dpa2k6ICdodHRwczovL2trLndpa2lwZWRpYS5vcmcnLFxuICBra3dpa3Rpb25hcnk6ICdodHRwczovL2trLndpa3Rpb25hcnkub3JnJyxcbiAga2t3aWtpYm9va3M6ICdodHRwczovL2trLndpa2lib29rcy5vcmcnLFxuICBra3dpa2lxdW90ZTogJ2h0dHBzOi8va2sud2lraXF1b3RlLm9yZycsXG4gIGtsd2lraTogJ2h0dHBzOi8va2wud2lraXBlZGlhLm9yZycsXG4gIGtsd2lrdGlvbmFyeTogJ2h0dHBzOi8va2wud2lrdGlvbmFyeS5vcmcnLFxuICBrbXdpa2k6ICdodHRwczovL2ttLndpa2lwZWRpYS5vcmcnLFxuICBrbXdpa3Rpb25hcnk6ICdodHRwczovL2ttLndpa3Rpb25hcnkub3JnJyxcbiAga213aWtpYm9va3M6ICdodHRwczovL2ttLndpa2lib29rcy5vcmcnLFxuICBrbndpa2k6ICdodHRwczovL2tuLndpa2lwZWRpYS5vcmcnLFxuICBrbndpa3Rpb25hcnk6ICdodHRwczovL2tuLndpa3Rpb25hcnkub3JnJyxcbiAga253aWtpYm9va3M6ICdodHRwczovL2tuLndpa2lib29rcy5vcmcnLFxuICBrbndpa2lxdW90ZTogJ2h0dHBzOi8va24ud2lraXF1b3RlLm9yZycsXG4gIGtud2lraXNvdXJjZTogJ2h0dHBzOi8va24ud2lraXNvdXJjZS5vcmcnLFxuICBrb3dpa2k6ICdodHRwczovL2tvLndpa2lwZWRpYS5vcmcnLFxuICBrb3dpa3Rpb25hcnk6ICdodHRwczovL2tvLndpa3Rpb25hcnkub3JnJyxcbiAga293aWtpYm9va3M6ICdodHRwczovL2tvLndpa2lib29rcy5vcmcnLFxuICBrb3dpa2luZXdzOiAnaHR0cHM6Ly9rby53aWtpbmV3cy5vcmcnLFxuICBrb3dpa2lxdW90ZTogJ2h0dHBzOi8va28ud2lraXF1b3RlLm9yZycsXG4gIGtvd2lraXNvdXJjZTogJ2h0dHBzOi8va28ud2lraXNvdXJjZS5vcmcnLFxuICBrb3dpa2l2ZXJzaXR5OiAnaHR0cHM6Ly9rby53aWtpdmVyc2l0eS5vcmcnLFxuICBrb2l3aWtpOiAnaHR0cHM6Ly9rb2kud2lraXBlZGlhLm9yZycsXG4gIGtyd2lraTogJ2h0dHBzOi8va3Iud2lraXBlZGlhLm9yZycsXG4gIGtyd2lraXF1b3RlOiAnaHR0cHM6Ly9rci53aWtpcXVvdGUub3JnJyxcbiAga3Jjd2lraTogJ2h0dHBzOi8va3JjLndpa2lwZWRpYS5vcmcnLFxuICBrc3dpa2k6ICdodHRwczovL2tzLndpa2lwZWRpYS5vcmcnLFxuICBrc3dpa3Rpb25hcnk6ICdodHRwczovL2tzLndpa3Rpb25hcnkub3JnJyxcbiAga3N3aWtpYm9va3M6ICdodHRwczovL2tzLndpa2lib29rcy5vcmcnLFxuICBrc3dpa2lxdW90ZTogJ2h0dHBzOi8va3Mud2lraXF1b3RlLm9yZycsXG4gIGtzaHdpa2k6ICdodHRwczovL2tzaC53aWtpcGVkaWEub3JnJyxcbiAga3V3aWtpOiAnaHR0cHM6Ly9rdS53aWtpcGVkaWEub3JnJyxcbiAga3V3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9rdS53aWt0aW9uYXJ5Lm9yZycsXG4gIGt1d2lraWJvb2tzOiAnaHR0cHM6Ly9rdS53aWtpYm9va3Mub3JnJyxcbiAga3V3aWtpcXVvdGU6ICdodHRwczovL2t1Lndpa2lxdW90ZS5vcmcnLFxuICBrdndpa2k6ICdodHRwczovL2t2Lndpa2lwZWRpYS5vcmcnLFxuICBrd3dpa2k6ICdodHRwczovL2t3Lndpa2lwZWRpYS5vcmcnLFxuICBrd3dpa3Rpb25hcnk6ICdodHRwczovL2t3Lndpa3Rpb25hcnkub3JnJyxcbiAga3d3aWtpcXVvdGU6ICdodHRwczovL2t3Lndpa2lxdW90ZS5vcmcnLFxuICBreXdpa2k6ICdodHRwczovL2t5Lndpa2lwZWRpYS5vcmcnLFxuICBreXdpa3Rpb25hcnk6ICdodHRwczovL2t5Lndpa3Rpb25hcnkub3JnJyxcbiAga3l3aWtpYm9va3M6ICdodHRwczovL2t5Lndpa2lib29rcy5vcmcnLFxuICBreXdpa2lxdW90ZTogJ2h0dHBzOi8va3kud2lraXF1b3RlLm9yZycsXG4gIGxhd2lraTogJ2h0dHBzOi8vbGEud2lraXBlZGlhLm9yZycsXG4gIGxhd2lrdGlvbmFyeTogJ2h0dHBzOi8vbGEud2lrdGlvbmFyeS5vcmcnLFxuICBsYXdpa2lib29rczogJ2h0dHBzOi8vbGEud2lraWJvb2tzLm9yZycsXG4gIGxhd2lraXF1b3RlOiAnaHR0cHM6Ly9sYS53aWtpcXVvdGUub3JnJyxcbiAgbGF3aWtpc291cmNlOiAnaHR0cHM6Ly9sYS53aWtpc291cmNlLm9yZycsXG4gIGxhZHdpa2k6ICdodHRwczovL2xhZC53aWtpcGVkaWEub3JnJyxcbiAgbGJ3aWtpOiAnaHR0cHM6Ly9sYi53aWtpcGVkaWEub3JnJyxcbiAgbGJ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9sYi53aWt0aW9uYXJ5Lm9yZycsXG4gIGxid2lraWJvb2tzOiAnaHR0cHM6Ly9sYi53aWtpYm9va3Mub3JnJyxcbiAgbGJ3aWtpcXVvdGU6ICdodHRwczovL2xiLndpa2lxdW90ZS5vcmcnLFxuICBsYmV3aWtpOiAnaHR0cHM6Ly9sYmUud2lraXBlZGlhLm9yZycsXG4gIGxlendpa2k6ICdodHRwczovL2xlei53aWtpcGVkaWEub3JnJyxcbiAgbGd3aWtpOiAnaHR0cHM6Ly9sZy53aWtpcGVkaWEub3JnJyxcbiAgbGl3aWtpOiAnaHR0cHM6Ly9saS53aWtpcGVkaWEub3JnJyxcbiAgbGl3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9saS53aWt0aW9uYXJ5Lm9yZycsXG4gIGxpd2lraWJvb2tzOiAnaHR0cHM6Ly9saS53aWtpYm9va3Mub3JnJyxcbiAgbGl3aWtpcXVvdGU6ICdodHRwczovL2xpLndpa2lxdW90ZS5vcmcnLFxuICBsaXdpa2lzb3VyY2U6ICdodHRwczovL2xpLndpa2lzb3VyY2Uub3JnJyxcbiAgbGlqd2lraTogJ2h0dHBzOi8vbGlqLndpa2lwZWRpYS5vcmcnLFxuICBsbW93aWtpOiAnaHR0cHM6Ly9sbW8ud2lraXBlZGlhLm9yZycsXG4gIGxud2lraTogJ2h0dHBzOi8vbG4ud2lraXBlZGlhLm9yZycsXG4gIGxud2lrdGlvbmFyeTogJ2h0dHBzOi8vbG4ud2lrdGlvbmFyeS5vcmcnLFxuICBsbndpa2lib29rczogJ2h0dHBzOi8vbG4ud2lraWJvb2tzLm9yZycsXG4gIGxvd2lraTogJ2h0dHBzOi8vbG8ud2lraXBlZGlhLm9yZycsXG4gIGxvd2lrdGlvbmFyeTogJ2h0dHBzOi8vbG8ud2lrdGlvbmFyeS5vcmcnLFxuICBsdHdpa2k6ICdodHRwczovL2x0Lndpa2lwZWRpYS5vcmcnLFxuICBsdHdpa3Rpb25hcnk6ICdodHRwczovL2x0Lndpa3Rpb25hcnkub3JnJyxcbiAgbHR3aWtpYm9va3M6ICdodHRwczovL2x0Lndpa2lib29rcy5vcmcnLFxuICBsdHdpa2lxdW90ZTogJ2h0dHBzOi8vbHQud2lraXF1b3RlLm9yZycsXG4gIGx0d2lraXNvdXJjZTogJ2h0dHBzOi8vbHQud2lraXNvdXJjZS5vcmcnLFxuICBsdGd3aWtpOiAnaHR0cHM6Ly9sdGcud2lraXBlZGlhLm9yZycsXG4gIGx2d2lraTogJ2h0dHBzOi8vbHYud2lraXBlZGlhLm9yZycsXG4gIGx2d2lrdGlvbmFyeTogJ2h0dHBzOi8vbHYud2lrdGlvbmFyeS5vcmcnLFxuICBsdndpa2lib29rczogJ2h0dHBzOi8vbHYud2lraWJvb2tzLm9yZycsXG4gIG1haXdpa2k6ICdodHRwczovL21haS53aWtpcGVkaWEub3JnJyxcbiAgbWFwX2Jtc3dpa2k6ICdodHRwczovL21hcC1ibXMud2lraXBlZGlhLm9yZycsXG4gIG1kZndpa2k6ICdodHRwczovL21kZi53aWtpcGVkaWEub3JnJyxcbiAgbWd3aWtpOiAnaHR0cHM6Ly9tZy53aWtpcGVkaWEub3JnJyxcbiAgbWd3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9tZy53aWt0aW9uYXJ5Lm9yZycsXG4gIG1nd2lraWJvb2tzOiAnaHR0cHM6Ly9tZy53aWtpYm9va3Mub3JnJyxcbiAgbWh3aWtpOiAnaHR0cHM6Ly9taC53aWtpcGVkaWEub3JnJyxcbiAgbWh3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9taC53aWt0aW9uYXJ5Lm9yZycsXG4gIG1ocndpa2k6ICdodHRwczovL21oci53aWtpcGVkaWEub3JnJyxcbiAgbWl3aWtpOiAnaHR0cHM6Ly9taS53aWtpcGVkaWEub3JnJyxcbiAgbWl3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9taS53aWt0aW9uYXJ5Lm9yZycsXG4gIG1pd2lraWJvb2tzOiAnaHR0cHM6Ly9taS53aWtpYm9va3Mub3JnJyxcbiAgbWlud2lraTogJ2h0dHBzOi8vbWluLndpa2lwZWRpYS5vcmcnLFxuICBta3dpa2k6ICdodHRwczovL21rLndpa2lwZWRpYS5vcmcnLFxuICBta3dpa3Rpb25hcnk6ICdodHRwczovL21rLndpa3Rpb25hcnkub3JnJyxcbiAgbWt3aWtpYm9va3M6ICdodHRwczovL21rLndpa2lib29rcy5vcmcnLFxuICBta3dpa2lzb3VyY2U6ICdodHRwczovL21rLndpa2lzb3VyY2Uub3JnJyxcbiAgbWx3aWtpOiAnaHR0cHM6Ly9tbC53aWtpcGVkaWEub3JnJyxcbiAgbWx3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9tbC53aWt0aW9uYXJ5Lm9yZycsXG4gIG1sd2lraWJvb2tzOiAnaHR0cHM6Ly9tbC53aWtpYm9va3Mub3JnJyxcbiAgbWx3aWtpcXVvdGU6ICdodHRwczovL21sLndpa2lxdW90ZS5vcmcnLFxuICBtbHdpa2lzb3VyY2U6ICdodHRwczovL21sLndpa2lzb3VyY2Uub3JnJyxcbiAgbW53aWtpOiAnaHR0cHM6Ly9tbi53aWtpcGVkaWEub3JnJyxcbiAgbW53aWt0aW9uYXJ5OiAnaHR0cHM6Ly9tbi53aWt0aW9uYXJ5Lm9yZycsXG4gIG1ud2lraWJvb2tzOiAnaHR0cHM6Ly9tbi53aWtpYm9va3Mub3JnJyxcbiAgbW93aWtpOiAnaHR0cHM6Ly9tby53aWtpcGVkaWEub3JnJyxcbiAgbW93aWt0aW9uYXJ5OiAnaHR0cHM6Ly9tby53aWt0aW9uYXJ5Lm9yZycsXG4gIG1yd2lraTogJ2h0dHBzOi8vbXIud2lraXBlZGlhLm9yZycsXG4gIG1yd2lrdGlvbmFyeTogJ2h0dHBzOi8vbXIud2lrdGlvbmFyeS5vcmcnLFxuICBtcndpa2lib29rczogJ2h0dHBzOi8vbXIud2lraWJvb2tzLm9yZycsXG4gIG1yd2lraXF1b3RlOiAnaHR0cHM6Ly9tci53aWtpcXVvdGUub3JnJyxcbiAgbXJ3aWtpc291cmNlOiAnaHR0cHM6Ly9tci53aWtpc291cmNlLm9yZycsXG4gIG1yandpa2k6ICdodHRwczovL21yai53aWtpcGVkaWEub3JnJyxcbiAgbXN3aWtpOiAnaHR0cHM6Ly9tcy53aWtpcGVkaWEub3JnJyxcbiAgbXN3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9tcy53aWt0aW9uYXJ5Lm9yZycsXG4gIG1zd2lraWJvb2tzOiAnaHR0cHM6Ly9tcy53aWtpYm9va3Mub3JnJyxcbiAgbXR3aWtpOiAnaHR0cHM6Ly9tdC53aWtpcGVkaWEub3JnJyxcbiAgbXR3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9tdC53aWt0aW9uYXJ5Lm9yZycsXG4gIG11c3dpa2k6ICdodHRwczovL211cy53aWtpcGVkaWEub3JnJyxcbiAgbXdsd2lraTogJ2h0dHBzOi8vbXdsLndpa2lwZWRpYS5vcmcnLFxuICBteXdpa2k6ICdodHRwczovL215Lndpa2lwZWRpYS5vcmcnLFxuICBteXdpa3Rpb25hcnk6ICdodHRwczovL215Lndpa3Rpb25hcnkub3JnJyxcbiAgbXl3aWtpYm9va3M6ICdodHRwczovL215Lndpa2lib29rcy5vcmcnLFxuICBteXZ3aWtpOiAnaHR0cHM6Ly9teXYud2lraXBlZGlhLm9yZycsXG4gIG16bndpa2k6ICdodHRwczovL216bi53aWtpcGVkaWEub3JnJyxcbiAgbmF3aWtpOiAnaHR0cHM6Ly9uYS53aWtpcGVkaWEub3JnJyxcbiAgbmF3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9uYS53aWt0aW9uYXJ5Lm9yZycsXG4gIG5hd2lraWJvb2tzOiAnaHR0cHM6Ly9uYS53aWtpYm9va3Mub3JnJyxcbiAgbmF3aWtpcXVvdGU6ICdodHRwczovL25hLndpa2lxdW90ZS5vcmcnLFxuICBuYWh3aWtpOiAnaHR0cHM6Ly9uYWgud2lraXBlZGlhLm9yZycsXG4gIG5haHdpa3Rpb25hcnk6ICdodHRwczovL25haC53aWt0aW9uYXJ5Lm9yZycsXG4gIG5haHdpa2lib29rczogJ2h0dHBzOi8vbmFoLndpa2lib29rcy5vcmcnLFxuICBuYXB3aWtpOiAnaHR0cHM6Ly9uYXAud2lraXBlZGlhLm9yZycsXG4gIG5kc3dpa2k6ICdodHRwczovL25kcy53aWtpcGVkaWEub3JnJyxcbiAgbmRzd2lrdGlvbmFyeTogJ2h0dHBzOi8vbmRzLndpa3Rpb25hcnkub3JnJyxcbiAgbmRzd2lraWJvb2tzOiAnaHR0cHM6Ly9uZHMud2lraWJvb2tzLm9yZycsXG4gIG5kc3dpa2lxdW90ZTogJ2h0dHBzOi8vbmRzLndpa2lxdW90ZS5vcmcnLFxuICBuZHNfbmx3aWtpOiAnaHR0cHM6Ly9uZHMtbmwud2lraXBlZGlhLm9yZycsXG4gIG5ld2lraTogJ2h0dHBzOi8vbmUud2lraXBlZGlhLm9yZycsXG4gIG5ld2lrdGlvbmFyeTogJ2h0dHBzOi8vbmUud2lrdGlvbmFyeS5vcmcnLFxuICBuZXdpa2lib29rczogJ2h0dHBzOi8vbmUud2lraWJvb2tzLm9yZycsXG4gIG5ld3dpa2k6ICdodHRwczovL25ldy53aWtpcGVkaWEub3JnJyxcbiAgbmd3aWtpOiAnaHR0cHM6Ly9uZy53aWtpcGVkaWEub3JnJyxcbiAgbmx3aWtpOiAnaHR0cHM6Ly9ubC53aWtpcGVkaWEub3JnJyxcbiAgbmx3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9ubC53aWt0aW9uYXJ5Lm9yZycsXG4gIG5sd2lraWJvb2tzOiAnaHR0cHM6Ly9ubC53aWtpYm9va3Mub3JnJyxcbiAgbmx3aWtpbmV3czogJ2h0dHBzOi8vbmwud2lraW5ld3Mub3JnJyxcbiAgbmx3aWtpcXVvdGU6ICdodHRwczovL25sLndpa2lxdW90ZS5vcmcnLFxuICBubHdpa2lzb3VyY2U6ICdodHRwczovL25sLndpa2lzb3VyY2Uub3JnJyxcbiAgbmx3aWtpdm95YWdlOiAnaHR0cHM6Ly9ubC53aWtpdm95YWdlLm9yZycsXG4gIG5ud2lraTogJ2h0dHBzOi8vbm4ud2lraXBlZGlhLm9yZycsXG4gIG5ud2lrdGlvbmFyeTogJ2h0dHBzOi8vbm4ud2lrdGlvbmFyeS5vcmcnLFxuICBubndpa2lxdW90ZTogJ2h0dHBzOi8vbm4ud2lraXF1b3RlLm9yZycsXG4gIG5vd2lraTogJ2h0dHBzOi8vbm8ud2lraXBlZGlhLm9yZycsXG4gIG5vd2lrdGlvbmFyeTogJ2h0dHBzOi8vbm8ud2lrdGlvbmFyeS5vcmcnLFxuICBub3dpa2lib29rczogJ2h0dHBzOi8vbm8ud2lraWJvb2tzLm9yZycsXG4gIG5vd2lraW5ld3M6ICdodHRwczovL25vLndpa2luZXdzLm9yZycsXG4gIG5vd2lraXF1b3RlOiAnaHR0cHM6Ly9uby53aWtpcXVvdGUub3JnJyxcbiAgbm93aWtpc291cmNlOiAnaHR0cHM6Ly9uby53aWtpc291cmNlLm9yZycsXG4gIG5vdndpa2k6ICdodHRwczovL25vdi53aWtpcGVkaWEub3JnJyxcbiAgbnJtd2lraTogJ2h0dHBzOi8vbnJtLndpa2lwZWRpYS5vcmcnLFxuICBuc293aWtpOiAnaHR0cHM6Ly9uc28ud2lraXBlZGlhLm9yZycsXG4gIG52d2lraTogJ2h0dHBzOi8vbnYud2lraXBlZGlhLm9yZycsXG4gIG55d2lraTogJ2h0dHBzOi8vbnkud2lraXBlZGlhLm9yZycsXG4gIG9jd2lraTogJ2h0dHBzOi8vb2Mud2lraXBlZGlhLm9yZycsXG4gIG9jd2lrdGlvbmFyeTogJ2h0dHBzOi8vb2Mud2lrdGlvbmFyeS5vcmcnLFxuICBvY3dpa2lib29rczogJ2h0dHBzOi8vb2Mud2lraWJvb2tzLm9yZycsXG4gIG9td2lraTogJ2h0dHBzOi8vb20ud2lraXBlZGlhLm9yZycsXG4gIG9td2lrdGlvbmFyeTogJ2h0dHBzOi8vb20ud2lrdGlvbmFyeS5vcmcnLFxuICBvcndpa2k6ICdodHRwczovL29yLndpa2lwZWRpYS5vcmcnLFxuICBvcndpa3Rpb25hcnk6ICdodHRwczovL29yLndpa3Rpb25hcnkub3JnJyxcbiAgb3J3aWtpc291cmNlOiAnaHR0cHM6Ly9vci53aWtpc291cmNlLm9yZycsXG4gIG9zd2lraTogJ2h0dHBzOi8vb3Mud2lraXBlZGlhLm9yZycsXG4gIHBhd2lraTogJ2h0dHBzOi8vcGEud2lraXBlZGlhLm9yZycsXG4gIHBhd2lrdGlvbmFyeTogJ2h0dHBzOi8vcGEud2lrdGlvbmFyeS5vcmcnLFxuICBwYXdpa2lib29rczogJ2h0dHBzOi8vcGEud2lraWJvb2tzLm9yZycsXG4gIHBhZ3dpa2k6ICdodHRwczovL3BhZy53aWtpcGVkaWEub3JnJyxcbiAgcGFtd2lraTogJ2h0dHBzOi8vcGFtLndpa2lwZWRpYS5vcmcnLFxuICBwYXB3aWtpOiAnaHR0cHM6Ly9wYXAud2lraXBlZGlhLm9yZycsXG4gIHBjZHdpa2k6ICdodHRwczovL3BjZC53aWtpcGVkaWEub3JnJyxcbiAgcGRjd2lraTogJ2h0dHBzOi8vcGRjLndpa2lwZWRpYS5vcmcnLFxuICBwZmx3aWtpOiAnaHR0cHM6Ly9wZmwud2lraXBlZGlhLm9yZycsXG4gIHBpd2lraTogJ2h0dHBzOi8vcGkud2lraXBlZGlhLm9yZycsXG4gIHBpd2lrdGlvbmFyeTogJ2h0dHBzOi8vcGkud2lrdGlvbmFyeS5vcmcnLFxuICBwaWh3aWtpOiAnaHR0cHM6Ly9waWgud2lraXBlZGlhLm9yZycsXG4gIHBsd2lraTogJ2h0dHBzOi8vcGwud2lraXBlZGlhLm9yZycsXG4gIHBsd2lrdGlvbmFyeTogJ2h0dHBzOi8vcGwud2lrdGlvbmFyeS5vcmcnLFxuICBwbHdpa2lib29rczogJ2h0dHBzOi8vcGwud2lraWJvb2tzLm9yZycsXG4gIHBsd2lraW5ld3M6ICdodHRwczovL3BsLndpa2luZXdzLm9yZycsXG4gIHBsd2lraXF1b3RlOiAnaHR0cHM6Ly9wbC53aWtpcXVvdGUub3JnJyxcbiAgcGx3aWtpc291cmNlOiAnaHR0cHM6Ly9wbC53aWtpc291cmNlLm9yZycsXG4gIHBsd2lraXZveWFnZTogJ2h0dHBzOi8vcGwud2lraXZveWFnZS5vcmcnLFxuICBwbXN3aWtpOiAnaHR0cHM6Ly9wbXMud2lraXBlZGlhLm9yZycsXG4gIHBuYndpa2k6ICdodHRwczovL3BuYi53aWtpcGVkaWEub3JnJyxcbiAgcG5id2lrdGlvbmFyeTogJ2h0dHBzOi8vcG5iLndpa3Rpb25hcnkub3JnJyxcbiAgcG50d2lraTogJ2h0dHBzOi8vcG50Lndpa2lwZWRpYS5vcmcnLFxuICBwc3dpa2k6ICdodHRwczovL3BzLndpa2lwZWRpYS5vcmcnLFxuICBwc3dpa3Rpb25hcnk6ICdodHRwczovL3BzLndpa3Rpb25hcnkub3JnJyxcbiAgcHN3aWtpYm9va3M6ICdodHRwczovL3BzLndpa2lib29rcy5vcmcnLFxuICBwdHdpa2k6ICdodHRwczovL3B0Lndpa2lwZWRpYS5vcmcnLFxuICBwdHdpa3Rpb25hcnk6ICdodHRwczovL3B0Lndpa3Rpb25hcnkub3JnJyxcbiAgcHR3aWtpYm9va3M6ICdodHRwczovL3B0Lndpa2lib29rcy5vcmcnLFxuICBwdHdpa2luZXdzOiAnaHR0cHM6Ly9wdC53aWtpbmV3cy5vcmcnLFxuICBwdHdpa2lxdW90ZTogJ2h0dHBzOi8vcHQud2lraXF1b3RlLm9yZycsXG4gIHB0d2lraXNvdXJjZTogJ2h0dHBzOi8vcHQud2lraXNvdXJjZS5vcmcnLFxuICBwdHdpa2l2ZXJzaXR5OiAnaHR0cHM6Ly9wdC53aWtpdmVyc2l0eS5vcmcnLFxuICBwdHdpa2l2b3lhZ2U6ICdodHRwczovL3B0Lndpa2l2b3lhZ2Uub3JnJyxcbiAgcXV3aWtpOiAnaHR0cHM6Ly9xdS53aWtpcGVkaWEub3JnJyxcbiAgcXV3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9xdS53aWt0aW9uYXJ5Lm9yZycsXG4gIHF1d2lraWJvb2tzOiAnaHR0cHM6Ly9xdS53aWtpYm9va3Mub3JnJyxcbiAgcXV3aWtpcXVvdGU6ICdodHRwczovL3F1Lndpa2lxdW90ZS5vcmcnLFxuICBybXdpa2k6ICdodHRwczovL3JtLndpa2lwZWRpYS5vcmcnLFxuICBybXdpa3Rpb25hcnk6ICdodHRwczovL3JtLndpa3Rpb25hcnkub3JnJyxcbiAgcm13aWtpYm9va3M6ICdodHRwczovL3JtLndpa2lib29rcy5vcmcnLFxuICBybXl3aWtpOiAnaHR0cHM6Ly9ybXkud2lraXBlZGlhLm9yZycsXG4gIHJud2lraTogJ2h0dHBzOi8vcm4ud2lraXBlZGlhLm9yZycsXG4gIHJud2lrdGlvbmFyeTogJ2h0dHBzOi8vcm4ud2lrdGlvbmFyeS5vcmcnLFxuICByb3dpa2k6ICdodHRwczovL3JvLndpa2lwZWRpYS5vcmcnLFxuICByb3dpa3Rpb25hcnk6ICdodHRwczovL3JvLndpa3Rpb25hcnkub3JnJyxcbiAgcm93aWtpYm9va3M6ICdodHRwczovL3JvLndpa2lib29rcy5vcmcnLFxuICByb3dpa2luZXdzOiAnaHR0cHM6Ly9yby53aWtpbmV3cy5vcmcnLFxuICByb3dpa2lxdW90ZTogJ2h0dHBzOi8vcm8ud2lraXF1b3RlLm9yZycsXG4gIHJvd2lraXNvdXJjZTogJ2h0dHBzOi8vcm8ud2lraXNvdXJjZS5vcmcnLFxuICByb3dpa2l2b3lhZ2U6ICdodHRwczovL3JvLndpa2l2b3lhZ2Uub3JnJyxcbiAgcm9hX3J1cHdpa2k6ICdodHRwczovL3JvYS1ydXAud2lraXBlZGlhLm9yZycsXG4gIHJvYV9ydXB3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9yb2EtcnVwLndpa3Rpb25hcnkub3JnJyxcbiAgcm9hX3RhcmF3aWtpOiAnaHR0cHM6Ly9yb2EtdGFyYS53aWtpcGVkaWEub3JnJyxcbiAgcnV3aWtpOiAnaHR0cHM6Ly9ydS53aWtpcGVkaWEub3JnJyxcbiAgcnV3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9ydS53aWt0aW9uYXJ5Lm9yZycsXG4gIHJ1d2lraWJvb2tzOiAnaHR0cHM6Ly9ydS53aWtpYm9va3Mub3JnJyxcbiAgcnV3aWtpbmV3czogJ2h0dHBzOi8vcnUud2lraW5ld3Mub3JnJyxcbiAgcnV3aWtpcXVvdGU6ICdodHRwczovL3J1Lndpa2lxdW90ZS5vcmcnLFxuICBydXdpa2lzb3VyY2U6ICdodHRwczovL3J1Lndpa2lzb3VyY2Uub3JnJyxcbiAgcnV3aWtpdmVyc2l0eTogJ2h0dHBzOi8vcnUud2lraXZlcnNpdHkub3JnJyxcbiAgcnV3aWtpdm95YWdlOiAnaHR0cHM6Ly9ydS53aWtpdm95YWdlLm9yZycsXG4gIHJ1ZXdpa2k6ICdodHRwczovL3J1ZS53aWtpcGVkaWEub3JnJyxcbiAgcnd3aWtpOiAnaHR0cHM6Ly9ydy53aWtpcGVkaWEub3JnJyxcbiAgcnd3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9ydy53aWt0aW9uYXJ5Lm9yZycsXG4gIHNhd2lraTogJ2h0dHBzOi8vc2Eud2lraXBlZGlhLm9yZycsXG4gIHNhd2lrdGlvbmFyeTogJ2h0dHBzOi8vc2Eud2lrdGlvbmFyeS5vcmcnLFxuICBzYXdpa2lib29rczogJ2h0dHBzOi8vc2Eud2lraWJvb2tzLm9yZycsXG4gIHNhd2lraXF1b3RlOiAnaHR0cHM6Ly9zYS53aWtpcXVvdGUub3JnJyxcbiAgc2F3aWtpc291cmNlOiAnaHR0cHM6Ly9zYS53aWtpc291cmNlLm9yZycsXG4gIHNhaHdpa2k6ICdodHRwczovL3NhaC53aWtpcGVkaWEub3JnJyxcbiAgc2Fod2lraXNvdXJjZTogJ2h0dHBzOi8vc2FoLndpa2lzb3VyY2Uub3JnJyxcbiAgc2N3aWtpOiAnaHR0cHM6Ly9zYy53aWtpcGVkaWEub3JnJyxcbiAgc2N3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zYy53aWt0aW9uYXJ5Lm9yZycsXG4gIHNjbndpa2k6ICdodHRwczovL3Njbi53aWtpcGVkaWEub3JnJyxcbiAgc2Nud2lrdGlvbmFyeTogJ2h0dHBzOi8vc2NuLndpa3Rpb25hcnkub3JnJyxcbiAgc2Nvd2lraTogJ2h0dHBzOi8vc2NvLndpa2lwZWRpYS5vcmcnLFxuICBzZHdpa2k6ICdodHRwczovL3NkLndpa2lwZWRpYS5vcmcnLFxuICBzZHdpa3Rpb25hcnk6ICdodHRwczovL3NkLndpa3Rpb25hcnkub3JnJyxcbiAgc2R3aWtpbmV3czogJ2h0dHBzOi8vc2Qud2lraW5ld3Mub3JnJyxcbiAgc2V3aWtpOiAnaHR0cHM6Ly9zZS53aWtpcGVkaWEub3JnJyxcbiAgc2V3aWtpYm9va3M6ICdodHRwczovL3NlLndpa2lib29rcy5vcmcnLFxuICBzZ3dpa2k6ICdodHRwczovL3NnLndpa2lwZWRpYS5vcmcnLFxuICBzZ3dpa3Rpb25hcnk6ICdodHRwczovL3NnLndpa3Rpb25hcnkub3JnJyxcbiAgc2h3aWtpOiAnaHR0cHM6Ly9zaC53aWtpcGVkaWEub3JnJyxcbiAgc2h3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zaC53aWt0aW9uYXJ5Lm9yZycsXG4gIHNpd2lraTogJ2h0dHBzOi8vc2kud2lraXBlZGlhLm9yZycsXG4gIHNpd2lrdGlvbmFyeTogJ2h0dHBzOi8vc2kud2lrdGlvbmFyeS5vcmcnLFxuICBzaXdpa2lib29rczogJ2h0dHBzOi8vc2kud2lraWJvb2tzLm9yZycsXG4gIHNpbXBsZXdpa2k6ICdodHRwczovL3NpbXBsZS53aWtpcGVkaWEub3JnJyxcbiAgc2ltcGxld2lrdGlvbmFyeTogJ2h0dHBzOi8vc2ltcGxlLndpa3Rpb25hcnkub3JnJyxcbiAgc2ltcGxld2lraWJvb2tzOiAnaHR0cHM6Ly9zaW1wbGUud2lraWJvb2tzLm9yZycsXG4gIHNpbXBsZXdpa2lxdW90ZTogJ2h0dHBzOi8vc2ltcGxlLndpa2lxdW90ZS5vcmcnLFxuICBza3dpa2k6ICdodHRwczovL3NrLndpa2lwZWRpYS5vcmcnLFxuICBza3dpa3Rpb25hcnk6ICdodHRwczovL3NrLndpa3Rpb25hcnkub3JnJyxcbiAgc2t3aWtpYm9va3M6ICdodHRwczovL3NrLndpa2lib29rcy5vcmcnLFxuICBza3dpa2lxdW90ZTogJ2h0dHBzOi8vc2sud2lraXF1b3RlLm9yZycsXG4gIHNrd2lraXNvdXJjZTogJ2h0dHBzOi8vc2sud2lraXNvdXJjZS5vcmcnLFxuICBzbHdpa2k6ICdodHRwczovL3NsLndpa2lwZWRpYS5vcmcnLFxuICBzbHdpa3Rpb25hcnk6ICdodHRwczovL3NsLndpa3Rpb25hcnkub3JnJyxcbiAgc2x3aWtpYm9va3M6ICdodHRwczovL3NsLndpa2lib29rcy5vcmcnLFxuICBzbHdpa2lxdW90ZTogJ2h0dHBzOi8vc2wud2lraXF1b3RlLm9yZycsXG4gIHNsd2lraXNvdXJjZTogJ2h0dHBzOi8vc2wud2lraXNvdXJjZS5vcmcnLFxuICBzbHdpa2l2ZXJzaXR5OiAnaHR0cHM6Ly9zbC53aWtpdmVyc2l0eS5vcmcnLFxuICBzbXdpa2k6ICdodHRwczovL3NtLndpa2lwZWRpYS5vcmcnLFxuICBzbXdpa3Rpb25hcnk6ICdodHRwczovL3NtLndpa3Rpb25hcnkub3JnJyxcbiAgc253aWtpOiAnaHR0cHM6Ly9zbi53aWtpcGVkaWEub3JnJyxcbiAgc253aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zbi53aWt0aW9uYXJ5Lm9yZycsXG4gIHNvd2lraTogJ2h0dHBzOi8vc28ud2lraXBlZGlhLm9yZycsXG4gIHNvd2lrdGlvbmFyeTogJ2h0dHBzOi8vc28ud2lrdGlvbmFyeS5vcmcnLFxuICBzcXdpa2k6ICdodHRwczovL3NxLndpa2lwZWRpYS5vcmcnLFxuICBzcXdpa3Rpb25hcnk6ICdodHRwczovL3NxLndpa3Rpb25hcnkub3JnJyxcbiAgc3F3aWtpYm9va3M6ICdodHRwczovL3NxLndpa2lib29rcy5vcmcnLFxuICBzcXdpa2luZXdzOiAnaHR0cHM6Ly9zcS53aWtpbmV3cy5vcmcnLFxuICBzcXdpa2lxdW90ZTogJ2h0dHBzOi8vc3Eud2lraXF1b3RlLm9yZycsXG4gIHNyd2lraTogJ2h0dHBzOi8vc3Iud2lraXBlZGlhLm9yZycsXG4gIHNyd2lrdGlvbmFyeTogJ2h0dHBzOi8vc3Iud2lrdGlvbmFyeS5vcmcnLFxuICBzcndpa2lib29rczogJ2h0dHBzOi8vc3Iud2lraWJvb2tzLm9yZycsXG4gIHNyd2lraW5ld3M6ICdodHRwczovL3NyLndpa2luZXdzLm9yZycsXG4gIHNyd2lraXF1b3RlOiAnaHR0cHM6Ly9zci53aWtpcXVvdGUub3JnJyxcbiAgc3J3aWtpc291cmNlOiAnaHR0cHM6Ly9zci53aWtpc291cmNlLm9yZycsXG4gIHNybndpa2k6ICdodHRwczovL3Nybi53aWtpcGVkaWEub3JnJyxcbiAgc3N3aWtpOiAnaHR0cHM6Ly9zcy53aWtpcGVkaWEub3JnJyxcbiAgc3N3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zcy53aWt0aW9uYXJ5Lm9yZycsXG4gIHN0d2lraTogJ2h0dHBzOi8vc3Qud2lraXBlZGlhLm9yZycsXG4gIHN0d2lrdGlvbmFyeTogJ2h0dHBzOi8vc3Qud2lrdGlvbmFyeS5vcmcnLFxuICBzdHF3aWtpOiAnaHR0cHM6Ly9zdHEud2lraXBlZGlhLm9yZycsXG4gIHN1d2lraTogJ2h0dHBzOi8vc3Uud2lraXBlZGlhLm9yZycsXG4gIHN1d2lrdGlvbmFyeTogJ2h0dHBzOi8vc3Uud2lrdGlvbmFyeS5vcmcnLFxuICBzdXdpa2lib29rczogJ2h0dHBzOi8vc3Uud2lraWJvb2tzLm9yZycsXG4gIHN1d2lraXF1b3RlOiAnaHR0cHM6Ly9zdS53aWtpcXVvdGUub3JnJyxcbiAgc3Z3aWtpOiAnaHR0cHM6Ly9zdi53aWtpcGVkaWEub3JnJyxcbiAgc3Z3aWt0aW9uYXJ5OiAnaHR0cHM6Ly9zdi53aWt0aW9uYXJ5Lm9yZycsXG4gIHN2d2lraWJvb2tzOiAnaHR0cHM6Ly9zdi53aWtpYm9va3Mub3JnJyxcbiAgc3Z3aWtpbmV3czogJ2h0dHBzOi8vc3Yud2lraW5ld3Mub3JnJyxcbiAgc3Z3aWtpcXVvdGU6ICdodHRwczovL3N2Lndpa2lxdW90ZS5vcmcnLFxuICBzdndpa2lzb3VyY2U6ICdodHRwczovL3N2Lndpa2lzb3VyY2Uub3JnJyxcbiAgc3Z3aWtpdmVyc2l0eTogJ2h0dHBzOi8vc3Yud2lraXZlcnNpdHkub3JnJyxcbiAgc3Z3aWtpdm95YWdlOiAnaHR0cHM6Ly9zdi53aWtpdm95YWdlLm9yZycsXG4gIHN3d2lraTogJ2h0dHBzOi8vc3cud2lraXBlZGlhLm9yZycsXG4gIHN3d2lrdGlvbmFyeTogJ2h0dHBzOi8vc3cud2lrdGlvbmFyeS5vcmcnLFxuICBzd3dpa2lib29rczogJ2h0dHBzOi8vc3cud2lraWJvb2tzLm9yZycsXG4gIHN6bHdpa2k6ICdodHRwczovL3N6bC53aWtpcGVkaWEub3JnJyxcbiAgdGF3aWtpOiAnaHR0cHM6Ly90YS53aWtpcGVkaWEub3JnJyxcbiAgdGF3aWt0aW9uYXJ5OiAnaHR0cHM6Ly90YS53aWt0aW9uYXJ5Lm9yZycsXG4gIHRhd2lraWJvb2tzOiAnaHR0cHM6Ly90YS53aWtpYm9va3Mub3JnJyxcbiAgdGF3aWtpbmV3czogJ2h0dHBzOi8vdGEud2lraW5ld3Mub3JnJyxcbiAgdGF3aWtpcXVvdGU6ICdodHRwczovL3RhLndpa2lxdW90ZS5vcmcnLFxuICB0YXdpa2lzb3VyY2U6ICdodHRwczovL3RhLndpa2lzb3VyY2Uub3JnJyxcbiAgdGV3aWtpOiAnaHR0cHM6Ly90ZS53aWtpcGVkaWEub3JnJyxcbiAgdGV3aWt0aW9uYXJ5OiAnaHR0cHM6Ly90ZS53aWt0aW9uYXJ5Lm9yZycsXG4gIHRld2lraWJvb2tzOiAnaHR0cHM6Ly90ZS53aWtpYm9va3Mub3JnJyxcbiAgdGV3aWtpcXVvdGU6ICdodHRwczovL3RlLndpa2lxdW90ZS5vcmcnLFxuICB0ZXdpa2lzb3VyY2U6ICdodHRwczovL3RlLndpa2lzb3VyY2Uub3JnJyxcbiAgdGV0d2lraTogJ2h0dHBzOi8vdGV0Lndpa2lwZWRpYS5vcmcnLFxuICB0Z3dpa2k6ICdodHRwczovL3RnLndpa2lwZWRpYS5vcmcnLFxuICB0Z3dpa3Rpb25hcnk6ICdodHRwczovL3RnLndpa3Rpb25hcnkub3JnJyxcbiAgdGd3aWtpYm9va3M6ICdodHRwczovL3RnLndpa2lib29rcy5vcmcnLFxuICB0aHdpa2k6ICdodHRwczovL3RoLndpa2lwZWRpYS5vcmcnLFxuICB0aHdpa3Rpb25hcnk6ICdodHRwczovL3RoLndpa3Rpb25hcnkub3JnJyxcbiAgdGh3aWtpYm9va3M6ICdodHRwczovL3RoLndpa2lib29rcy5vcmcnLFxuICB0aHdpa2luZXdzOiAnaHR0cHM6Ly90aC53aWtpbmV3cy5vcmcnLFxuICB0aHdpa2lxdW90ZTogJ2h0dHBzOi8vdGgud2lraXF1b3RlLm9yZycsXG4gIHRod2lraXNvdXJjZTogJ2h0dHBzOi8vdGgud2lraXNvdXJjZS5vcmcnLFxuICB0aXdpa2k6ICdodHRwczovL3RpLndpa2lwZWRpYS5vcmcnLFxuICB0aXdpa3Rpb25hcnk6ICdodHRwczovL3RpLndpa3Rpb25hcnkub3JnJyxcbiAgdGt3aWtpOiAnaHR0cHM6Ly90ay53aWtpcGVkaWEub3JnJyxcbiAgdGt3aWt0aW9uYXJ5OiAnaHR0cHM6Ly90ay53aWt0aW9uYXJ5Lm9yZycsXG4gIHRrd2lraWJvb2tzOiAnaHR0cHM6Ly90ay53aWtpYm9va3Mub3JnJyxcbiAgdGt3aWtpcXVvdGU6ICdodHRwczovL3RrLndpa2lxdW90ZS5vcmcnLFxuICB0bHdpa2k6ICdodHRwczovL3RsLndpa2lwZWRpYS5vcmcnLFxuICB0bHdpa3Rpb25hcnk6ICdodHRwczovL3RsLndpa3Rpb25hcnkub3JnJyxcbiAgdGx3aWtpYm9va3M6ICdodHRwczovL3RsLndpa2lib29rcy5vcmcnLFxuICB0bndpa2k6ICdodHRwczovL3RuLndpa2lwZWRpYS5vcmcnLFxuICB0bndpa3Rpb25hcnk6ICdodHRwczovL3RuLndpa3Rpb25hcnkub3JnJyxcbiAgdG93aWtpOiAnaHR0cHM6Ly90by53aWtpcGVkaWEub3JnJyxcbiAgdG93aWt0aW9uYXJ5OiAnaHR0cHM6Ly90by53aWt0aW9uYXJ5Lm9yZycsXG4gIHRwaXdpa2k6ICdodHRwczovL3RwaS53aWtpcGVkaWEub3JnJyxcbiAgdHBpd2lrdGlvbmFyeTogJ2h0dHBzOi8vdHBpLndpa3Rpb25hcnkub3JnJyxcbiAgdHJ3aWtpOiAnaHR0cHM6Ly90ci53aWtpcGVkaWEub3JnJyxcbiAgdHJ3aWt0aW9uYXJ5OiAnaHR0cHM6Ly90ci53aWt0aW9uYXJ5Lm9yZycsXG4gIHRyd2lraWJvb2tzOiAnaHR0cHM6Ly90ci53aWtpYm9va3Mub3JnJyxcbiAgdHJ3aWtpbmV3czogJ2h0dHBzOi8vdHIud2lraW5ld3Mub3JnJyxcbiAgdHJ3aWtpcXVvdGU6ICdodHRwczovL3RyLndpa2lxdW90ZS5vcmcnLFxuICB0cndpa2lzb3VyY2U6ICdodHRwczovL3RyLndpa2lzb3VyY2Uub3JnJyxcbiAgdHN3aWtpOiAnaHR0cHM6Ly90cy53aWtpcGVkaWEub3JnJyxcbiAgdHN3aWt0aW9uYXJ5OiAnaHR0cHM6Ly90cy53aWt0aW9uYXJ5Lm9yZycsXG4gIHR0d2lraTogJ2h0dHBzOi8vdHQud2lraXBlZGlhLm9yZycsXG4gIHR0d2lrdGlvbmFyeTogJ2h0dHBzOi8vdHQud2lrdGlvbmFyeS5vcmcnLFxuICB0dHdpa2lib29rczogJ2h0dHBzOi8vdHQud2lraWJvb2tzLm9yZycsXG4gIHR0d2lraXF1b3RlOiAnaHR0cHM6Ly90dC53aWtpcXVvdGUub3JnJyxcbiAgdHVtd2lraTogJ2h0dHBzOi8vdHVtLndpa2lwZWRpYS5vcmcnLFxuICB0d3dpa2k6ICdodHRwczovL3R3Lndpa2lwZWRpYS5vcmcnLFxuICB0d3dpa3Rpb25hcnk6ICdodHRwczovL3R3Lndpa3Rpb25hcnkub3JnJyxcbiAgdHl3aWtpOiAnaHR0cHM6Ly90eS53aWtpcGVkaWEub3JnJyxcbiAgdHl2d2lraTogJ2h0dHBzOi8vdHl2Lndpa2lwZWRpYS5vcmcnLFxuICB1ZG13aWtpOiAnaHR0cHM6Ly91ZG0ud2lraXBlZGlhLm9yZycsXG4gIHVnd2lraTogJ2h0dHBzOi8vdWcud2lraXBlZGlhLm9yZycsXG4gIHVnd2lrdGlvbmFyeTogJ2h0dHBzOi8vdWcud2lrdGlvbmFyeS5vcmcnLFxuICB1Z3dpa2lib29rczogJ2h0dHBzOi8vdWcud2lraWJvb2tzLm9yZycsXG4gIHVnd2lraXF1b3RlOiAnaHR0cHM6Ly91Zy53aWtpcXVvdGUub3JnJyxcbiAgdWt3aWtpOiAnaHR0cHM6Ly91ay53aWtpcGVkaWEub3JnJyxcbiAgdWt3aWt0aW9uYXJ5OiAnaHR0cHM6Ly91ay53aWt0aW9uYXJ5Lm9yZycsXG4gIHVrd2lraWJvb2tzOiAnaHR0cHM6Ly91ay53aWtpYm9va3Mub3JnJyxcbiAgdWt3aWtpbmV3czogJ2h0dHBzOi8vdWsud2lraW5ld3Mub3JnJyxcbiAgdWt3aWtpcXVvdGU6ICdodHRwczovL3VrLndpa2lxdW90ZS5vcmcnLFxuICB1a3dpa2lzb3VyY2U6ICdodHRwczovL3VrLndpa2lzb3VyY2Uub3JnJyxcbiAgdWt3aWtpdm95YWdlOiAnaHR0cHM6Ly91ay53aWtpdm95YWdlLm9yZycsXG4gIHVyd2lraTogJ2h0dHBzOi8vdXIud2lraXBlZGlhLm9yZycsXG4gIHVyd2lrdGlvbmFyeTogJ2h0dHBzOi8vdXIud2lrdGlvbmFyeS5vcmcnLFxuICB1cndpa2lib29rczogJ2h0dHBzOi8vdXIud2lraWJvb2tzLm9yZycsXG4gIHVyd2lraXF1b3RlOiAnaHR0cHM6Ly91ci53aWtpcXVvdGUub3JnJyxcbiAgdXp3aWtpOiAnaHR0cHM6Ly91ei53aWtpcGVkaWEub3JnJyxcbiAgdXp3aWt0aW9uYXJ5OiAnaHR0cHM6Ly91ei53aWt0aW9uYXJ5Lm9yZycsXG4gIHV6d2lraWJvb2tzOiAnaHR0cHM6Ly91ei53aWtpYm9va3Mub3JnJyxcbiAgdXp3aWtpcXVvdGU6ICdodHRwczovL3V6Lndpa2lxdW90ZS5vcmcnLFxuICB2ZXdpa2k6ICdodHRwczovL3ZlLndpa2lwZWRpYS5vcmcnLFxuICB2ZWN3aWtpOiAnaHR0cHM6Ly92ZWMud2lraXBlZGlhLm9yZycsXG4gIHZlY3dpa3Rpb25hcnk6ICdodHRwczovL3ZlYy53aWt0aW9uYXJ5Lm9yZycsXG4gIHZlY3dpa2lzb3VyY2U6ICdodHRwczovL3ZlYy53aWtpc291cmNlLm9yZycsXG4gIHZlcHdpa2k6ICdodHRwczovL3ZlcC53aWtpcGVkaWEub3JnJyxcbiAgdml3aWtpOiAnaHR0cHM6Ly92aS53aWtpcGVkaWEub3JnJyxcbiAgdml3aWt0aW9uYXJ5OiAnaHR0cHM6Ly92aS53aWt0aW9uYXJ5Lm9yZycsXG4gIHZpd2lraWJvb2tzOiAnaHR0cHM6Ly92aS53aWtpYm9va3Mub3JnJyxcbiAgdml3aWtpcXVvdGU6ICdodHRwczovL3ZpLndpa2lxdW90ZS5vcmcnLFxuICB2aXdpa2lzb3VyY2U6ICdodHRwczovL3ZpLndpa2lzb3VyY2Uub3JnJyxcbiAgdml3aWtpdm95YWdlOiAnaHR0cHM6Ly92aS53aWtpdm95YWdlLm9yZycsXG4gIHZsc3dpa2k6ICdodHRwczovL3Zscy53aWtpcGVkaWEub3JnJyxcbiAgdm93aWtpOiAnaHR0cHM6Ly92by53aWtpcGVkaWEub3JnJyxcbiAgdm93aWt0aW9uYXJ5OiAnaHR0cHM6Ly92by53aWt0aW9uYXJ5Lm9yZycsXG4gIHZvd2lraWJvb2tzOiAnaHR0cHM6Ly92by53aWtpYm9va3Mub3JnJyxcbiAgdm93aWtpcXVvdGU6ICdodHRwczovL3ZvLndpa2lxdW90ZS5vcmcnLFxuICB3YXdpa2k6ICdodHRwczovL3dhLndpa2lwZWRpYS5vcmcnLFxuICB3YXdpa3Rpb25hcnk6ICdodHRwczovL3dhLndpa3Rpb25hcnkub3JnJyxcbiAgd2F3aWtpYm9va3M6ICdodHRwczovL3dhLndpa2lib29rcy5vcmcnLFxuICB3YXJ3aWtpOiAnaHR0cHM6Ly93YXIud2lraXBlZGlhLm9yZycsXG4gIHdvd2lraTogJ2h0dHBzOi8vd28ud2lraXBlZGlhLm9yZycsXG4gIHdvd2lrdGlvbmFyeTogJ2h0dHBzOi8vd28ud2lrdGlvbmFyeS5vcmcnLFxuICB3b3dpa2lxdW90ZTogJ2h0dHBzOi8vd28ud2lraXF1b3RlLm9yZycsXG4gIHd1dXdpa2k6ICdodHRwczovL3d1dS53aWtpcGVkaWEub3JnJyxcbiAgeGFsd2lraTogJ2h0dHBzOi8veGFsLndpa2lwZWRpYS5vcmcnLFxuICB4aHdpa2k6ICdodHRwczovL3hoLndpa2lwZWRpYS5vcmcnLFxuICB4aHdpa3Rpb25hcnk6ICdodHRwczovL3hoLndpa3Rpb25hcnkub3JnJyxcbiAgeGh3aWtpYm9va3M6ICdodHRwczovL3hoLndpa2lib29rcy5vcmcnLFxuICB4bWZ3aWtpOiAnaHR0cHM6Ly94bWYud2lraXBlZGlhLm9yZycsXG4gIHlpd2lraTogJ2h0dHBzOi8veWkud2lraXBlZGlhLm9yZycsXG4gIHlpd2lrdGlvbmFyeTogJ2h0dHBzOi8veWkud2lrdGlvbmFyeS5vcmcnLFxuICB5aXdpa2lzb3VyY2U6ICdodHRwczovL3lpLndpa2lzb3VyY2Uub3JnJyxcbiAgeW93aWtpOiAnaHR0cHM6Ly95by53aWtpcGVkaWEub3JnJyxcbiAgeW93aWt0aW9uYXJ5OiAnaHR0cHM6Ly95by53aWt0aW9uYXJ5Lm9yZycsXG4gIHlvd2lraWJvb2tzOiAnaHR0cHM6Ly95by53aWtpYm9va3Mub3JnJyxcbiAgemF3aWtpOiAnaHR0cHM6Ly96YS53aWtpcGVkaWEub3JnJyxcbiAgemF3aWt0aW9uYXJ5OiAnaHR0cHM6Ly96YS53aWt0aW9uYXJ5Lm9yZycsXG4gIHphd2lraWJvb2tzOiAnaHR0cHM6Ly96YS53aWtpYm9va3Mub3JnJyxcbiAgemF3aWtpcXVvdGU6ICdodHRwczovL3phLndpa2lxdW90ZS5vcmcnLFxuICB6ZWF3aWtpOiAnaHR0cHM6Ly96ZWEud2lraXBlZGlhLm9yZycsXG4gIHpod2lraTogJ2h0dHBzOi8vemgud2lraXBlZGlhLm9yZycsXG4gIHpod2lrdGlvbmFyeTogJ2h0dHBzOi8vemgud2lrdGlvbmFyeS5vcmcnLFxuICB6aHdpa2lib29rczogJ2h0dHBzOi8vemgud2lraWJvb2tzLm9yZycsXG4gIHpod2lraW5ld3M6ICdodHRwczovL3poLndpa2luZXdzLm9yZycsXG4gIHpod2lraXF1b3RlOiAnaHR0cHM6Ly96aC53aWtpcXVvdGUub3JnJyxcbiAgemh3aWtpc291cmNlOiAnaHR0cHM6Ly96aC53aWtpc291cmNlLm9yZycsXG4gIHpod2lraXZveWFnZTogJ2h0dHBzOi8vemgud2lraXZveWFnZS5vcmcnLFxuICB6aF9jbGFzc2ljYWx3aWtpOiAnaHR0cHM6Ly96aC1jbGFzc2ljYWwud2lraXBlZGlhLm9yZycsXG4gIHpoX21pbl9uYW53aWtpOiAnaHR0cHM6Ly96aC1taW4tbmFuLndpa2lwZWRpYS5vcmcnLFxuICB6aF9taW5fbmFud2lrdGlvbmFyeTogJ2h0dHBzOi8vemgtbWluLW5hbi53aWt0aW9uYXJ5Lm9yZycsXG4gIHpoX21pbl9uYW53aWtpYm9va3M6ICdodHRwczovL3poLW1pbi1uYW4ud2lraWJvb2tzLm9yZycsXG4gIHpoX21pbl9uYW53aWtpcXVvdGU6ICdodHRwczovL3poLW1pbi1uYW4ud2lraXF1b3RlLm9yZycsXG4gIHpoX21pbl9uYW53aWtpc291cmNlOiAnaHR0cHM6Ly96aC1taW4tbmFuLndpa2lzb3VyY2Uub3JnJyxcbiAgemhfeXVld2lraTogJ2h0dHBzOi8vemgteXVlLndpa2lwZWRpYS5vcmcnLFxuICB6dXdpa2k6ICdodHRwczovL3p1Lndpa2lwZWRpYS5vcmcnLFxuICB6dXdpa3Rpb25hcnk6ICdodHRwczovL3p1Lndpa3Rpb25hcnkub3JnJyxcbiAgenV3aWtpYm9va3M6ICdodHRwczovL3p1Lndpa2lib29rcy5vcmcnXG59O1xuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gc2l0ZV9tYXA7XG59XG4iLCIvL3R1cm5zIHdpa2ltZWRpYSBzY3JpcHQgaW50byBqc29uXG4vLyBodHRwczovL2dpdGh1Yi5jb20vc3BlbmNlcm1vdW50YWluL3d0Zl93aWtpcGVkaWFcbi8vQHNwZW5jZXJtb3VudGFpblxuY29uc3QgZmV0Y2ggPSByZXF1aXJlKCcuL2xpYi9mZXRjaF90ZXh0Jyk7XG5jb25zdCBwYXJzZSA9IHJlcXVpcmUoJy4vcGFyc2UnKTtcbmNvbnN0IG1hcmtkb3duID0gcmVxdWlyZSgnLi9vdXRwdXQvbWFya2Rvd24nKTtcbmNvbnN0IGh0bWwgPSByZXF1aXJlKCcuL291dHB1dC9odG1sJyk7XG5jb25zdCB2ZXJzaW9uID0gcmVxdWlyZSgnLi4vcGFja2FnZScpLnZlcnNpb247XG5cbi8vdXNlIGEgZ2xvYmFsIHZhciBmb3IgbGF6eSBjdXN0b21pemF0aW9uXG5sZXQgb3B0aW9ucyA9IHt9O1xuXG4vL2Zyb20gYSBwYWdlIHRpdGxlIG9yIGlkLCBmZXRjaCB0aGUgd2lraXNjcmlwdFxuY29uc3QgZnJvbV9hcGkgPSBmdW5jdGlvbihwYWdlX2lkZW50aWZpZXIsIGxhbmdfb3Jfd2lraWlkLCBjYikge1xuICBpZiAodHlwZW9mIGxhbmdfb3Jfd2lraWlkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2IgPSBsYW5nX29yX3dpa2lpZDtcbiAgICBsYW5nX29yX3dpa2lpZCA9ICdlbic7XG4gIH1cbiAgY2IgPSBjYiB8fCBmdW5jdGlvbigpIHt9O1xuICBsYW5nX29yX3dpa2lpZCA9IGxhbmdfb3Jfd2lraWlkIHx8ICdlbic7XG4gIGlmICghZmV0Y2gpIHtcbiAgICAvL25vIGh0dHAgbWV0aG9kLCBvbiB0aGUgY2xpZW50IHNpZGVcbiAgICByZXR1cm4gY2IobnVsbCk7XG4gIH1cbiAgcmV0dXJuIGZldGNoKHBhZ2VfaWRlbnRpZmllciwgbGFuZ19vcl93aWtpaWQsIGNiKTtcbn07XG5cbi8vdHVybiB3aWtpLW1hcmt1cCBpbnRvIGEgbmljZWx5LWZvcm1hdHRlZCB0ZXh0XG5jb25zdCBwbGFpbnRleHQgPSBmdW5jdGlvbihzdHIsIG9wdGlvbnNQKSB7XG4gIG9wdGlvbnNQID0gb3B0aW9uc1AgPT09IHVuZGVmaW5lZCA/IG9wdGlvbnMgOiBvcHRpb25zUDtcbiAgbGV0IGRhdGEgPSBwYXJzZShzdHIsIG9wdGlvbnNQKSB8fCB7fTtcbiAgZGF0YS5zZWN0aW9ucyA9IGRhdGEuc2VjdGlvbnMgfHwgW107XG4gIGxldCBhcnIgPSBkYXRhLnNlY3Rpb25zLm1hcChkID0+IHtcbiAgICByZXR1cm4gZC5zZW50ZW5jZXMubWFwKGEgPT4gYS50ZXh0KS5qb2luKCcgJyk7XG4gIH0pO1xuICByZXR1cm4gYXJyLmpvaW4oJ1xcblxcbicpO1xufTtcblxuY29uc3QgY3VzdG9taXplID0gZnVuY3Rpb24ob2JqKSB7XG4gIG9wdGlvbnMuY3VzdG9tID0gb2JqO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGZyb21fYXBpOiBmcm9tX2FwaSxcbiAgcGxhaW50ZXh0OiBwbGFpbnRleHQsXG4gIG1hcmtkb3duOiBtYXJrZG93bixcbiAgaHRtbDogaHRtbCxcbiAgdmVyc2lvbjogdmVyc2lvbixcbiAgY3VzdG9tOiBjdXN0b21pemUsXG4gIHBhcnNlOiAoc3RyLCBvYmopID0+IHtcbiAgICBvYmogPSBvYmogfHwge307XG4gICAgb2JqID0gT2JqZWN0LmFzc2lnbihvYmosIG9wdGlvbnMpOyAvL2dyYWIgJ2N1c3RvbScgcGVyc2lzdGVudCBvcHRpb25zXG4gICAgcmV0dXJuIHBhcnNlKHN0ciwgb2JqKTtcbiAgfVxufTtcbiIsIi8vY29udmVydHMgRE1TIChkZWNpbWFsLW1pbnV0ZS1zZWNvbmQpIGdlbyBmb3JtYXQgdG8gbGF0L2xuZyBmb3JtYXQuXG4vL21ham9yIHRoYW5rIHlvdSB0byBodHRwczovL2dpdGh1Yi5jb20vZ21hY2xlbm5hbi9wYXJzZS1kbXNcbi8vYW5kIGh0dHBzOi8vZ2l0aHViLmNvbS9XU0RPVC1HSVMvZG1zLWpzIPCfkY9cblxuLy9hY2NlcHRzIGFuIGFycmF5IG9mIGRlc2NlbmRpbmcgRGVncmVlLCBNaW51dGUsIFNlY29uZCB2YWx1ZXMsIHdpdGggYSBoZW1pc3BoZXJlIGF0IHRoZSBlbmRcbi8vbXVzdCBoYXZlIE4vUy9FL1cgYXMgbGFzdCB0aGluZ1xuZnVuY3Rpb24gcGFyc2VEbXMoYXJyKSB7XG4gIGxldCBoZW1pc3BoZXJlID0gYXJyLnBvcCgpO1xuICB2YXIgZGVncmVlcyA9IE51bWJlcihhcnJbMF0gfHwgMCk7XG4gIHZhciBtaW51dGVzID0gTnVtYmVyKGFyclsxXSB8fCAwKTtcbiAgdmFyIHNlY29uZHMgPSBOdW1iZXIoYXJyWzJdIHx8IDApO1xuICBpZiAodHlwZW9mIGhlbWlzcGhlcmUgIT09ICdzdHJpbmcnIHx8IGlzTmFOKGRlZ3JlZXMpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIHNpZ24gPSAxO1xuICBpZiAoL1tTV10vaS50ZXN0KGhlbWlzcGhlcmUpKSB7XG4gICAgc2lnbiA9IC0xO1xuICB9XG4gIGxldCBkZWNEZWcgPSBzaWduICogKGRlZ3JlZXMgKyBtaW51dGVzIC8gNjAgKyBzZWNvbmRzIC8gMzYwMCk7XG4gIHJldHVybiBkZWNEZWc7XG59XG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlRG1zO1xuLy8gY29uc29sZS5sb2cocGFyc2VEbXMoWzU3LCAxOCwgMjIsICdOJ10pKTtcbi8vIGNvbnNvbGUubG9nKHBhcnNlRG1zKFs0LCAyNywgMzIsICdXJ10pKTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vZ3JhYiB0aGUgY29udGVudCBvZiBhbnkgYXJ0aWNsZSwgb2ZmIHRoZSBhcGlcbmNvbnN0IHJlcXVlc3QgPSByZXF1aXJlKCdzdXBlcmFnZW50Jyk7XG5jb25zdCBzaXRlX21hcCA9IHJlcXVpcmUoJy4uL2RhdGEvc2l0ZV9tYXAnKTtcbmNvbnN0IHJlZGlyZWN0cyA9IHJlcXVpcmUoJy4uL3BhcnNlL3BhZ2UvcmVkaXJlY3RzJyk7XG5cbmNvbnN0IGZldGNoID0gZnVuY3Rpb24ocGFnZV9pZGVudGlmaWVyLCBsYW5nX29yX3dpa2lpZCwgY2IpIHtcbiAgbGFuZ19vcl93aWtpaWQgPSBsYW5nX29yX3dpa2lpZCB8fCAnZW4nO1xuICB2YXIgaWRlbnRpZmllcl90eXBlID0gJ3RpdGxlcyc7XG4gIGlmIChwYWdlX2lkZW50aWZpZXIubWF0Y2goL15bMC05XSokLykgJiYgcGFnZV9pZGVudGlmaWVyLmxlbmd0aCA+IDMpIHtcbiAgICBpZGVudGlmaWVyX3R5cGUgPSAnY3VyaWQnO1xuICB9XG4gIGxldCB1cmw7XG4gIGlmIChzaXRlX21hcFtsYW5nX29yX3dpa2lpZF0pIHtcbiAgICB1cmwgPSBzaXRlX21hcFtsYW5nX29yX3dpa2lpZF0gKyAnL3cvYXBpLnBocCc7XG4gIH0gZWxzZSB7XG4gICAgdXJsID0gJ2h0dHBzOi8vJyArIGxhbmdfb3Jfd2lraWlkICsgJy53aWtpcGVkaWEub3JnL3cvYXBpLnBocCc7XG4gIH1cbiAgLy93ZSB1c2UgdGhlICdyZXZpc2lvbnMnIGFwaSBoZXJlLCBpbnN0ZWFkIG9mIHRoZSBSYXcgYXBpLCBmb3IgaXRzIENPUlMtcnVsZXMuLlxuICB1cmwgKz0gJz9hY3Rpb249cXVlcnkmcHJvcD1yZXZpc2lvbnMmcnZsaW1pdD0xJnJ2cHJvcD1jb250ZW50JmZvcm1hdD1qc29uJm9yaWdpbj0qJztcbiAgdXJsICs9ICcmJyArIGlkZW50aWZpZXJfdHlwZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChwYWdlX2lkZW50aWZpZXIpO1xuXG4gIHJlcXVlc3QuZ2V0KHVybCkuZW5kKGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgaWYgKGVyciB8fCAhcmVzLmJvZHkucXVlcnkpIHtcbiAgICAgIGNvbnNvbGUud2FybihlcnIpO1xuICAgICAgY2IobnVsbCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBwYWdlcyA9IChyZXMgJiYgcmVzLmJvZHkgJiYgcmVzLmJvZHkucXVlcnkpID8gcmVzLmJvZHkucXVlcnkucGFnZXMgOiB7fTtcbiAgICB2YXIgaWQgPSBPYmplY3Qua2V5cyhwYWdlcylbMF07XG4gICAgaWYgKGlkKSB7XG4gICAgICB2YXIgcGFnZSA9IHBhZ2VzW2lkXTtcbiAgICAgIGlmIChwYWdlICYmIHBhZ2UucmV2aXNpb25zICYmIHBhZ2UucmV2aXNpb25zWzBdKSB7XG4gICAgICAgIHZhciB0ZXh0ID0gcGFnZS5yZXZpc2lvbnNbMF1bJyonXTtcbiAgICAgICAgaWYgKHJlZGlyZWN0cy5pc19yZWRpcmVjdCh0ZXh0KSkge1xuICAgICAgICAgIHZhciByZXN1bHQgPSByZWRpcmVjdHMucGFyc2VfcmVkaXJlY3QodGV4dCk7XG4gICAgICAgICAgZmV0Y2gocmVzdWx0LnJlZGlyZWN0LCBsYW5nX29yX3dpa2lpZCwgY2IpOyAvL3JlY3Vyc2l2ZVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjYih0ZXh0LHBhZ2VfaWRlbnRpZmllcixsYW5nX29yX3dpa2lpZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYihudWxsKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmZXRjaDtcblxuLy8gZmV0Y2goJ09uX0FfRnJpZGF5JywgJ2VuJywgZnVuY3Rpb24ocikgeyAvLyAnYWZ3aWtpJ1xuLy8gICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyLCBudWxsLCAyKSk7XG4vLyB9KTtcbiIsInZhciBoZWxwZXJzID0ge1xuICBjYXBpdGFsaXNlOiBmdW5jdGlvbihzdHIpIHtcbiAgICBpZiAoc3RyICYmIHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH0sXG4gIG9ubHlVbmlxdWU6IGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgc2VsZikge1xuICAgIHJldHVybiBzZWxmLmluZGV4T2YodmFsdWUpID09PSBpbmRleDtcbiAgfSxcbiAgdHJpbV93aGl0ZXNwYWNlOiBmdW5jdGlvbihzdHIpIHtcbiAgICBpZiAoc3RyICYmIHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnKSB7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXlxcc1xccyovLCAnJyk7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXFxzXFxzKiQvLCAnJyk7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSgvIHsyfS8sICcgJyk7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXFxzLCAvLCAnLCAnKTtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gaGVscGVycztcbiIsIi8vZmluZCBhbGwgdGhlIHBhaXJzIG9mICdbWy4uLltbLi5dXS4uLl1dJyBpbiB0aGUgdGV4dFxuLy91c2VkIHRvIHByb3Blcmx5IHJvb3Qgb3V0IHJlY3Vyc2l2ZSB0ZW1wbGF0ZSBjYWxscywgW1suLiBbWy4uLl1dIF1dXG4vL2Jhc2ljYWxseSBqdXN0IGFkZHMgb3BlbiB0YWdzLCBhbmQgc3VidHJhY3RzIGNsb3NpbmcgdGFnc1xuZnVuY3Rpb24gZmluZF9yZWN1cnNpdmUob3BlbmVyLCBjbG9zZXIsIHRleHQpIHtcbiAgdmFyIG91dCA9IFtdO1xuICB2YXIgbGFzdCA9IFtdO1xuICB2YXIgY2hhcnMgPSB0ZXh0LnNwbGl0KCcnKTtcbiAgdmFyIG9wZW4gPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgLy9pbmNyaW1lbnQgb3BlbiB0YWdcbiAgICBpZiAoY2hhcnNbaV0gPT09IG9wZW5lcikge1xuICAgICAgb3BlbiArPSAxO1xuICAgIH1cbiAgICAvL2RlY3JlbWVudCBjbG9zZSB0YWdcbiAgICBpZiAoY2hhcnNbaV0gPT09IGNsb3Nlcikge1xuICAgICAgb3BlbiAtPSAxO1xuICAgICAgaWYgKG9wZW4gPCAwKSB7XG4gICAgICAgIG9wZW4gPSAwO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob3BlbiA+PSAwKSB7XG4gICAgICBsYXN0LnB1c2goY2hhcnNbaV0pO1xuICAgIH1cbiAgICBpZiAob3BlbiA9PT0gMCAmJiBsYXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgIC8vZmlyc3QsIGZpeCBib3RjaGVkIHBhcnNlXG4gICAgICB2YXIgb3Blbl9jb3VudCA9IGxhc3QuZmlsdGVyKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIHMgPT09IG9wZW5lcjtcbiAgICAgIH0pO1xuICAgICAgdmFyIGNsb3NlX2NvdW50ID0gbGFzdC5maWx0ZXIoZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcyA9PT0gY2xvc2VyO1xuICAgICAgfSk7XG4gICAgICAvL2lzIGl0IGJvdGNoZWQ/XG4gICAgICBpZiAob3Blbl9jb3VudC5sZW5ndGggPiBjbG9zZV9jb3VudC5sZW5ndGgpIHtcbiAgICAgICAgbGFzdC5wdXNoKGNsb3Nlcik7XG4gICAgICB9XG4gICAgICAvL2xvb2tzIGdvb2QsIGtlZXAgaXRcbiAgICAgIG91dC5wdXNoKGxhc3Quam9pbignJykpO1xuICAgICAgbGFzdCA9IFtdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxubW9kdWxlLmV4cG9ydHMgPSBmaW5kX3JlY3Vyc2l2ZTtcblxuLy8gY29uc29sZS5sb2coZmluZF9yZWN1cnNpdmUoJ3snLCAnfScsICdoZSBpcyBwcmVzaWRlbnQuIHt7bm93cmFwfHt7c21hbGx8KDE5OTXigJNwcmVzZW50KX19fX0gaGUgbGl2ZXMgaW4gdGV4YXMnKSk7XG4vLyBjb25zb2xlLmxvZyhmaW5kX3JlY3Vyc2l2ZShcIntcIiwgXCJ9XCIsIFwidGhpcyBpcyBmdW4ge3tub3dyYXB7e3NtYWxsMTk5NeKAk3ByZXNlbnR9fX19IGFuZCBpdCB3b3Jrc1wiKSlcbiIsImNvbnN0IHBhcnNlID0gcmVxdWlyZSgnLi4vLi4vcGFyc2UnKTtcbmNvbnN0IGRvU2VudGVuY2UgPSByZXF1aXJlKCcuL3NlbnRlbmNlJykuZG9TZW50ZW5jZTtcbi8vIGNvbnN0IGRvSW5mb2JveCA9IHJlcXVpcmUoJy4uL2RvSW5mb2JveCcpO1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgaW5mb2JveGVzOiB0cnVlLFxuICB0YWJsZXM6IHRydWUsXG4gIGxpc3RzOiB0cnVlLFxuICB0aXRsZTogdHJ1ZSxcbiAgaW1hZ2VzOiB0cnVlLFxuICBsaW5rczogdHJ1ZSxcbiAgZm9ybWF0dGluZzogdHJ1ZSxcbiAgc2VudGVuY2VzOiB0cnVlLFxufTtcblxuY29uc3QgbWFrZUltYWdlID0gKGltYWdlKSA9PiB7XG4gIGxldCBhbHQgPSBpbWFnZS5maWxlLnJlcGxhY2UoL14oZmlsZXxpbWFnZSk6L2ksICcnKTtcbiAgYWx0ID0gYWx0LnJlcGxhY2UoL1xcLihqcGd8anBlZ3xwbmd8Z2lmfHN2ZykvaSwgJycpO1xuICByZXR1cm4gJyAgPGltZyBzcmM9XCInICsgaW1hZ2UudGh1bWIgKyAnXCIgYWx0PVwiJyArIGFsdCArICdcIi8+Jztcbn07XG5cbmNvbnN0IGRvU2VjdGlvbiA9IChzZWN0aW9uLCBvcHRpb25zKSA9PiB7XG4gIGxldCBodG1sID0gJyc7XG4gIC8vbWFrZSB0aGUgaGVhZGVyXG4gIGlmIChvcHRpb25zLnRpdGxlID09PSB0cnVlICYmIHNlY3Rpb24udGl0bGUpIHtcbiAgICBsZXQgbnVtID0gMSArIHNlY3Rpb24uZGVwdGg7XG4gICAgaHRtbCArPSAnICA8aCcgKyBudW0gKyAnPicgKyBzZWN0aW9uLnRpdGxlICsgJzwvaCcgKyBudW0gKyAnPic7XG4gICAgaHRtbCArPSAnXFxuJztcbiAgfVxuICAvL3B1dCBhbnkgaW1hZ2VzIHVuZGVyIHRoZSBoZWFkZXJcbiAgaWYgKHNlY3Rpb24uaW1hZ2VzICYmIG9wdGlvbnMuaW1hZ2VzID09PSB0cnVlKSB7XG4gICAgaHRtbCArPSBzZWN0aW9uLmltYWdlcy5tYXAoKGltYWdlKSA9PiBtYWtlSW1hZ2UoaW1hZ2UpKS5qb2luKCdcXG4nKTtcbiAgICBodG1sICs9ICdcXG4nO1xuICB9XG4gIC8vbWFrZSBhIGh0bWwgdGFibGVcbiAgaWYgKHNlY3Rpb24udGFibGVzICYmIG9wdGlvbnMudGFibGVzID09PSB0cnVlKSB7XG4gIH1cbiAgLy9tYWtlIGEgaHRtbCBidWxsZXQtbGlzdFxuICBpZiAoc2VjdGlvbi5saXN0cyAmJiBvcHRpb25zLmxpc3RzID09PSB0cnVlKSB7XG4gIH1cbiAgLy9maW5hbGx5LCB3cml0ZSB0aGUgc2VudGVuY2UgdGV4dC5cbiAgaWYgKHNlY3Rpb24uc2VudGVuY2VzICYmIG9wdGlvbnMuc2VudGVuY2VzID09PSB0cnVlKSB7XG4gICAgaHRtbCArPSAnICA8cD4nICsgc2VjdGlvbi5zZW50ZW5jZXMubWFwKChzKSA9PiBkb1NlbnRlbmNlKHMsIG9wdGlvbnMpKS5qb2luKCcgJykgKyAnPC9wPic7XG4gICAgaHRtbCArPSAnXFxuJztcbiAgfVxuICByZXR1cm4gJzxkaXYgY2xhc3M9XCJzZWN0aW9uXCI+XFxuJyArIGh0bWwgKyAnPC9kaXY+XFxuJztcbn07XG4vL1xuY29uc3QgdG9IdG1sID0gZnVuY3Rpb24oc3RyLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgbGV0IGRhdGEgPSBwYXJzZShzdHIsIG9wdGlvbnMpO1xuICBsZXQgaHRtbCA9ICcnO1xuICAvL2FkZCB0aGUgdGl0bGUgb24gdGhlIHRvcFxuICBpZiAob3B0aW9ucy50aXRsZSA9PT0gdHJ1ZSAmJiBkYXRhLnRpdGxlKSB7XG4gICAgaHRtbCArPSAnPGgxPicgKyBkYXRhLnRpdGxlICsgJzwvaDE+XFxuJztcbiAgfVxuICAvL3JlbmRlciBpbmZvYm94ZXMgKHVwIGF0IHRoZSB0b3ApXG4gIC8vIGlmIChvcHRpb25zLmluZm9ib3hlcyA9PT0gdHJ1ZSAmJiBkYXRhLmluZm9ib3hlcykge1xuICAvLyAgIG1kICs9IGRhdGEuaW5mb2JveGVzLm1hcChvID0+IGRvSW5mb2JveChvLCBvcHRpb25zKSkuam9pbignXFxuJyk7XG4gIC8vIH1cbiAgLy9yZW5kZXIgZWFjaCBzZWN0aW9uXG4gIGh0bWwgKz0gZGF0YS5zZWN0aW9ucy5tYXAocyA9PiBkb1NlY3Rpb24ocywgb3B0aW9ucykpLmpvaW4oJ1xcbicpO1xuICByZXR1cm4gaHRtbDtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHRvSHRtbDtcbiIsIlxuLy8gY3JlYXRlIGxpbmtzLCBib2xkLCBpdGFsaWMgaW4gaHRtbFxuY29uc3QgZG9TZW50ZW5jZSA9IGZ1bmN0aW9uKHNlbnRlbmNlLCBvcHRpb25zKSB7XG4gIGxldCB0ZXh0ID0gc2VudGVuY2UudGV4dDtcbiAgLy90dXJuIGxpbmtzIGJhY2sgaW50byBsaW5rc1xuICBpZiAoc2VudGVuY2UubGlua3MgJiYgb3B0aW9ucy5saW5rcyA9PT0gdHJ1ZSkge1xuICAgIHNlbnRlbmNlLmxpbmtzLmZvckVhY2goKGxpbmspID0+IHtcbiAgICAgIGxldCBocmVmID0gJyc7XG4gICAgICBsZXQgY2xhc3NOYW1lcyA9ICdsaW5rJztcbiAgICAgIGlmIChsaW5rLnNpdGUpIHtcbiAgICAgICAgLy91c2UgYW4gZXh0ZXJuYWwgbGlua1xuICAgICAgICBocmVmID0gbGluay5zaXRlO1xuICAgICAgICBsaW5rICs9ICcgZXh0ZXJuYWwnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9vdGhlcndpc2UsIG1ha2UgaXQgYSByZWxhdGl2ZSBpbnRlcm5hbCBsaW5rXG4gICAgICAgIGhyZWYgPSBsaW5rLnBhZ2UgfHwgbGluay50ZXh0O1xuICAgICAgICBocmVmID0gJy4vJyArIGhyZWYucmVwbGFjZSgvIC9nLCAnXycpO1xuICAgICAgfVxuICAgICAgdGV4dCA9IHRleHQucmVwbGFjZShsaW5rLnRleHQsICc8YSBjbGFzcz1cIicgKyBjbGFzc05hbWVzICsgJ1wiIGhyZWY9XCInICsgaHJlZiArICdcIj4nICsgbGluay50ZXh0ICsgJzwvYT4nKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gdGV4dDtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGRvU2VudGVuY2U7XG4iLCJjb25zdCBwYXJzZSA9IHJlcXVpcmUoJy4uLy4uL3BhcnNlJyk7XG5jb25zdCBkb1RhYmxlID0gcmVxdWlyZSgnLi90YWJsZScpO1xuY29uc3QgZG9JbmZvYm94ID0gcmVxdWlyZSgnLi9pbmZvYm94Jyk7XG5jb25zdCBkb1NlbnRlbmNlID0gcmVxdWlyZSgnLi9zZW50ZW5jZScpO1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgaW5mb2JveGVzOiB0cnVlLFxuICB0YWJsZXM6IHRydWUsXG4gIGxpc3RzOiB0cnVlLFxuICB0aXRsZTogdHJ1ZSxcbiAgaW1hZ2VzOiB0cnVlLFxuICBsaW5rczogdHJ1ZSxcbiAgZm9ybWF0dGluZzogdHJ1ZSxcbiAgc2VudGVuY2VzOiB0cnVlLFxufTtcblxuY29uc3QgZG9MaXN0ID0gKGxpc3QsIG9wdGlvbnMpID0+IHtcbiAgcmV0dXJuIGxpc3QubWFwKChvKSA9PiB7XG4gICAgbGV0IHN0ciA9IGRvU2VudGVuY2Uobywgb3B0aW9ucyk7XG4gICAgcmV0dXJuICcgKiAnICsgc3RyO1xuICB9KS5qb2luKCdcXG4nKTtcbn07XG5cbi8vbWFya2Rvd24gaW1hZ2VzIGFyZSBsaWtlIHRoaXM6ICFbYWx0IHRleHRdKGhyZWYpXG5jb25zdCBkb0ltYWdlID0gKGltYWdlKSA9PiB7XG4gIGxldCBhbHQgPSBpbWFnZS5maWxlLnJlcGxhY2UoL14oZmlsZXxpbWFnZSk6L2ksICcnKTtcbiAgYWx0ID0gYWx0LnJlcGxhY2UoL1xcLihqcGd8anBlZ3xwbmd8Z2lmfHN2ZykvaSwgJycpO1xuICByZXR1cm4gJyFbJyArIGFsdCArICddKCcgKyBpbWFnZS50aHVtYiArICcpJztcbn07XG5cbmNvbnN0IGRvU2VjdGlvbiA9IChzZWN0aW9uLCBvcHRpb25zKSA9PiB7XG4gIGxldCBtZCA9ICcnO1xuICAvL21ha2UgdGhlIGhlYWRlclxuICBpZiAob3B0aW9ucy50aXRsZSA9PT0gdHJ1ZSAmJiBzZWN0aW9uLnRpdGxlKSB7XG4gICAgbGV0IGhlYWRlciA9ICcjIyc7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHNlY3Rpb24uZGVwdGg7IGkgKz0gMSkge1xuICAgICAgaGVhZGVyICs9ICcjJztcbiAgICB9XG4gICAgbWQgKz0gaGVhZGVyICsgJyAnICsgc2VjdGlvbi50aXRsZSArICdcXG4nO1xuICB9XG4gIC8vcHV0IGFueSBpbWFnZXMgdW5kZXIgdGhlIGhlYWRlclxuICBpZiAoc2VjdGlvbi5pbWFnZXMgJiYgb3B0aW9ucy5pbWFnZXMgPT09IHRydWUpIHtcbiAgICBtZCArPSBzZWN0aW9uLmltYWdlcy5tYXAoKGltZykgPT4gZG9JbWFnZShpbWcpKS5qb2luKCdcXG4nKTtcbiAgICBtZCArPSAnXFxuJztcbiAgfVxuICAvL21ha2UgYSBtYXJkb3duIHRhYmxlXG4gIGlmIChzZWN0aW9uLnRhYmxlcyAmJiBvcHRpb25zLnRhYmxlcyA9PT0gdHJ1ZSkge1xuICAgIG1kICs9ICdcXG4nO1xuICAgIG1kICs9IHNlY3Rpb24udGFibGVzLm1hcCgodGFibGUpID0+IGRvVGFibGUodGFibGUsIG9wdGlvbnMpKS5qb2luKCdcXG4nKTtcbiAgICBtZCArPSAnXFxuJztcbiAgfVxuICAvL21ha2UgYSBtYXJkb3duIGJ1bGxldC1saXN0XG4gIGlmIChzZWN0aW9uLmxpc3RzICYmIG9wdGlvbnMubGlzdHMgPT09IHRydWUpIHtcbiAgICBtZCArPSBzZWN0aW9uLmxpc3RzLm1hcCgobGlzdCkgPT4gZG9MaXN0KGxpc3QsIG9wdGlvbnMpKS5qb2luKCdcXG4nKTtcbiAgICBtZCArPSAnXFxuJztcbiAgfVxuICAvL2ZpbmFsbHksIHdyaXRlIHRoZSBzZW50ZW5jZSB0ZXh0LlxuICBpZiAoc2VjdGlvbi5zZW50ZW5jZXMgJiYgb3B0aW9ucy5zZW50ZW5jZXMgPT09IHRydWUpIHtcbiAgICBtZCArPSBzZWN0aW9uLnNlbnRlbmNlcy5tYXAoKHMpID0+IGRvU2VudGVuY2Uocywgb3B0aW9ucykpLmpvaW4oJyAnKTtcbiAgfVxuICByZXR1cm4gbWQ7XG59O1xuXG5jb25zdCB0b01hcmtkb3duID0gZnVuY3Rpb24oc3RyLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgbGV0IGRhdGEgPSBwYXJzZShzdHIsIG9wdGlvbnMpO1xuICBsZXQgbWQgPSAnJztcbiAgLy9hZGQgdGhlIHRpdGxlIG9uIHRoZSB0b3BcbiAgLy8gaWYgKGRhdGEudGl0bGUpIHtcbiAgLy8gICBtZCArPSAnIyAnICsgZGF0YS50aXRsZSArICdcXG4nO1xuICAvLyB9XG4gIC8vcmVuZGVyIGluZm9ib3hlcyAodXAgYXQgdGhlIHRvcClcbiAgaWYgKG9wdGlvbnMuaW5mb2JveGVzID09PSB0cnVlICYmIGRhdGEuaW5mb2JveGVzKSB7XG4gICAgbWQgKz0gZGF0YS5pbmZvYm94ZXMubWFwKG8gPT4gZG9JbmZvYm94KG8sIG9wdGlvbnMpKS5qb2luKCdcXG4nKTtcbiAgfVxuICAvL3JlbmRlciBlYWNoIHNlY3Rpb25cbiAgbWQgKz0gZGF0YS5zZWN0aW9ucy5tYXAocyA9PiBkb1NlY3Rpb24ocywgb3B0aW9ucykpLmpvaW4oJ1xcblxcbicpO1xuICByZXR1cm4gbWQ7XG59O1xubW9kdWxlLmV4cG9ydHMgPSB0b01hcmtkb3duO1xuIiwiY29uc3QgZG9TZW50ZW5jZSA9IHJlcXVpcmUoJy4vc2VudGVuY2UnKTtcbmNvbnN0IHBhZCA9IHJlcXVpcmUoJy4vcGFkJyk7XG5cbmNvbnN0IGRvbnREbyA9IHtcbiAgaW1hZ2U6IHRydWUsXG4gIGNhcHRpb246IHRydWVcbn07XG5cbi8vIHJlbmRlciBhbiBpbmZvYm94IGFzIGEgdGFibGUgd2l0aCB0d28gY29sdW1ucywga2V5ICsgdmFsdWVcbmNvbnN0IGRvSW5mb2JveCA9IGZ1bmN0aW9uKG9iaiwgb3B0aW9ucykge1xuICBsZXQgbWQgPSAnfCcgKyBwYWQoJycpICsgJ3wnICsgcGFkKCcnKSArICd8XFxuJztcbiAgbWQgKz0gJ3wnICsgcGFkKCctLS0nKSArICd8JyArIHBhZCgnLS0tJykgKyAnfFxcbic7XG4gIE9iamVjdC5rZXlzKG9iai5kYXRhKS5mb3JFYWNoKChrKSA9PiB7XG4gICAgaWYgKGRvbnREb1trXSA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQga2V5ID0gJyoqJyArIGsgKyAnKionO1xuICAgIGxldCB2YWwgPSBkb1NlbnRlbmNlKG9iai5kYXRhW2tdLCBvcHRpb25zKTtcbiAgICBtZCArPSAnfCcgKyBwYWQoa2V5KSArICd8JyArIHBhZCh2YWwpICsgJyB8XFxuJztcblxuICB9KTtcbiAgcmV0dXJuIG1kO1xufTtcbm1vZHVsZS5leHBvcnRzID0gZG9JbmZvYm94O1xuIiwiY29uc3QgY2VsbFdpZHRoID0gMTU7XG4vL2NlbnRlci1wYWQgZWFjaCBjZWxsLCB0byBtYWtlIHRoZSB0YWJsZSBtb3JlIGxlZ2libGVcbmNvbnN0IHBhZCA9IChzdHIpID0+IHtcbiAgc3RyID0gc3RyIHx8ICcnO1xuICBsZXQgZGlmZiA9IGNlbGxXaWR0aCAtIHN0ci5sZW5ndGg7XG4gIGRpZmYgPSBwYXJzZUludChkaWZmIC8gMiwgMTApO1xuICBmb3IobGV0IGkgPSAwOyBpIDwgZGlmZjsgaSArPSAxKSB7XG4gICAgc3RyID0gJyAnICsgc3RyICsgJyAnO1xuICB9XG4gIHJldHVybiBzdHI7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBwYWQ7XG4iLCIvL2VzY2FwZSBhIHN0cmluZyBsaWtlICdmdW4qMi5DbycgZm9yIGEgcmVnRXhwclxuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCAnXFxcXCQmJyk7XG59XG5cbi8vc29tZXRpbWVzIHRleHQtcmVwbGFjZW1lbnRzIGNhbiBiZSBhbWJpZ3VvdXMgLSB3b3JkcyB1c2VkIG11bHRpcGxlIHRpbWVzLi5cbmNvbnN0IGJlc3RSZXBsYWNlID0gZnVuY3Rpb24obWQsIHRleHQsIHJlc3VsdCkge1xuICB0ZXh0ID0gZXNjYXBlUmVnRXhwKHRleHQpO1xuICAvL3RyeSBhIHdvcmQtYm91bmRhcnkgcmVwbGFjZVxuICBsZXQgcmVnID0gbmV3IFJlZ0V4cCgnXFxcXGInICsgdGV4dCArICdcXFxcYicpO1xuICBpZiAocmVnLnRlc3QobWQpID09PSB0cnVlKSB7XG4gICAgbWQgPSBtZC5yZXBsYWNlKHJlZywgcmVzdWx0KTtcbiAgfSBlbHNlIHtcbiAgICAvL290aGVyd2lzZSwgZmFsbC1iYWNrIHRvIGEgbXVjaCBtZXNzaWVyLCBkYW5nZXJvdXMgcmVwbGFjZW1lbnRcbiAgICAvLyBjb25zb2xlLndhcm4oJ21pc3NpbmcgXFwnJyArIHRleHQgKyAnXFwnJyk7XG4gICAgbWQgPSBtZC5yZXBsYWNlKHRleHQsIHJlc3VsdCk7XG4gIH1cbiAgcmV0dXJuIG1kO1xufTtcblxuLy8gYWRkIGBbdGV4dF0oaHJlZilgIHRvIHRoZSB0ZXh0XG5jb25zdCBkb0xpbmsgPSBmdW5jdGlvbihtZCwgbGluaykge1xuICBsZXQgaHJlZiA9ICcnO1xuICAvL2lmIGl0J3MgYW4gZXh0ZXJuYWwgbGluaywgd2UgZ29vZFxuICBpZiAobGluay5zaXRlKSB7XG4gICAgaHJlZiA9IGxpbmsuc2l0ZTtcbiAgfSBlbHNlIHtcbiAgICAvL290aGVyd2lzZSwgbWFrZSBpdCBhIHJlbGF0aXZlIGludGVybmFsIGxpbmtcbiAgICBocmVmID0gbGluay5wYWdlIHx8IGxpbmsudGV4dDtcbiAgICBocmVmID0gJy4vJyArIGhyZWYucmVwbGFjZSgvIC9nLCAnXycpO1xuICB9XG4gIGxldCBtZExpbmsgPSAnWycgKyBsaW5rLnRleHQgKyAnXSgnICsgaHJlZiArICcpJztcbiAgbWQgPSBiZXN0UmVwbGFjZShtZCwgbGluay50ZXh0LCBtZExpbmspO1xuICByZXR1cm4gbWQ7XG59O1xuXG4vL2NyZWF0ZSBsaW5rcywgYm9sZCwgaXRhbGljIGluIG1hcmtkb3duXG5jb25zdCBkb1NlbnRlbmNlID0gKHNlbnRlbmNlLCBvcHRpb25zKSA9PiB7XG4gIGxldCBtZCA9IHNlbnRlbmNlLnRleHQ7XG4gIC8vdHVybiBsaW5rcyBiYWNrIGludG8gbGlua3NcbiAgaWYgKHNlbnRlbmNlLmxpbmtzICYmIG9wdGlvbnMubGlua3MgPT09IHRydWUpIHtcbiAgICBzZW50ZW5jZS5saW5rcy5mb3JFYWNoKChsaW5rKSA9PiB7XG4gICAgICBtZCA9IGRvTGluayhtZCwgbGluayk7XG4gICAgfSk7XG4gIH1cbiAgLy90dXJuIGJvbGRzIGludG8gKipib2xkKipcbiAgaWYgKHNlbnRlbmNlLmZtdC5ib2xkKSB7XG4gICAgc2VudGVuY2UuZm10LmJvbGQuZm9yRWFjaCgoYikgPT4ge1xuICAgICAgbWQgPSBiZXN0UmVwbGFjZShtZCwgYiwgJyoqJyArIGIgKyAnKionKTtcbiAgICB9KTtcbiAgfVxuICAvL3N1cHBvcnQgKml0YWxpY3MqXG4gIGlmIChzZW50ZW5jZS5mbXQuaXRhbGljKSB7XG4gICAgc2VudGVuY2UuZm10Lml0YWxpYy5mb3JFYWNoKChpKSA9PiB7XG4gICAgICBtZCA9IGJlc3RSZXBsYWNlKG1kLCBpLCAnKicgKyBpICsgJyonKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gbWQ7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBkb1NlbnRlbmNlO1xuIiwiY29uc3QgZG9TZW50ZW5jZSA9IHJlcXVpcmUoJy4vc2VudGVuY2UnKTtcbmNvbnN0IHBhZCA9IHJlcXVpcmUoJy4vcGFkJyk7XG4vKiB0aGlzIGlzIGEgbWFya2Rvd24gdGFibGU6XG58IFRhYmxlcyAgICAgICAgfCBBcmUgICAgICAgICAgIHwgQ29vbCAgfFxufCAtLS0tLS0tLS0tLS0tIHw6LS0tLS0tLS0tLS0tLTp8IC0tLS0tOnxcbnwgY29sIDMgaXMgICAgICB8IHJpZ2h0LWFsaWduZWQgfCAkMTYwMCB8XG58IGNvbCAyIGlzICAgICAgfCBjZW50ZXJlZCAgICAgIHwgICAkMTIgfFxufCB6ZWJyYSBzdHJpcGVzIHwgYXJlIG5lYXQgICAgICB8ICAgICQxIHxcbiovXG5cbmNvbnN0IG1ha2VSb3cgPSAoYXJyKSA9PiB7XG4gIGFyciA9IGFyci5tYXAocGFkKTtcbiAgcmV0dXJuICd8ICcgKyBhcnIuam9pbignIHwgJykgKyAnIHwnO1xufTtcblxuLy9tYXJrZG93biB0YWJsZXMgYXJlIHdlaXJkXG5jb25zdCBkb1RhYmxlID0gKHRhYmxlLCBvcHRpb25zKSA9PiB7XG4gIGxldCBtZCA9ICcnO1xuICBpZiAoIXRhYmxlIHx8IHRhYmxlLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBtZDtcbiAgfVxuICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKHRhYmxlWzBdKTtcbiAgLy9maXJzdCwgZ3JhYiB0aGUgaGVhZGVyc1xuICAvL3JlbW92ZSBhdXRvLWdlbmVyYXRlZCBudW1iZXIga2V5c1xuICBsZXQgaGVhZGVyID0ga2V5cy5tYXAoKGssIGkpID0+IHtcbiAgICBpZiAocGFyc2VJbnQoaywgMTApID09PSBpKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiBrO1xuICB9KTtcbiAgLy9kcmF3IHRoZSBoZWFkZXIgKG5lY2Vzc2FyeSEpXG4gIG1kICs9IG1ha2VSb3coaGVhZGVyKSArICdcXG4nO1xuICBtZCArPSBtYWtlUm93KFsnLS0tJywgJy0tLScsICctLS0nXSkgKyAnXFxuJztcbiAgLy9kbyBlYWNoIHJvdy4uXG4gIG1kICs9IHRhYmxlLm1hcCgocm93KSA9PiB7XG4gICAgLy9lYWNoIGNvbHVtbi4uXG4gICAgbGV0IGFyciA9IGtleXMubWFwKChrKSA9PiB7XG4gICAgICBpZiAoIXJvd1trXSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgICByZXR1cm4gZG9TZW50ZW5jZShyb3dba10sIG9wdGlvbnMpIHx8ICcnO1xuICAgIH0pO1xuICAgIC8vbWFrZSBpdCBhIG5pY2UgcGFkZGVkIHJvd1xuICAgIHJldHVybiBtYWtlUm93KGFycik7XG4gIH0pLmpvaW4oJ1xcbicpO1xuICByZXR1cm4gbWQgKyAnXFxuJztcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGRvVGFibGU7XG4iLCJjb25zdCBpMThuID0gcmVxdWlyZSgnLi4vZGF0YS9pMThuJyk7XG5jb25zdCBjYXRfcmVnID0gbmV3IFJlZ0V4cCgnXFxcXFtcXFxcWzo/KCcgKyBpMThuLmNhdGVnb3JpZXMuam9pbignfCcpICsgJyk6KC57Miw2MH0/KV1dKHd7MCwxMH0pJywgJ2lnJyk7XG5jb25zdCBjYXRfcmVtb3ZlX3JlZyA9IG5ldyBSZWdFeHAoJ15cXFxcW1xcXFxbOj8oJyArIGkxOG4uY2F0ZWdvcmllcy5qb2luKCd8JykgKyAnKTonLCAnaWcnKTtcblxuY29uc3QgcGFyc2VfY2F0ZWdvcmllcyA9IGZ1bmN0aW9uKHIsIHdpa2kpIHtcbiAgci5jYXRlZ29yaWVzID0gW107XG4gIGxldCB0bXAgPSB3aWtpLm1hdGNoKGNhdF9yZWcpOyAvL3JlZ3VsYXIgbGlua3NcbiAgaWYgKHRtcCkge1xuICAgIHRtcC5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcbiAgICAgIGMgPSBjLnJlcGxhY2UoY2F0X3JlbW92ZV9yZWcsICcnKTtcbiAgICAgIGMgPSBjLnJlcGxhY2UoL1xcfD9bIFxcKl0/XFxdXFxdJC9pLCAnJyk7IC8vcGFyc2UgZmFuY3kgb25jZXMuLlxuICAgICAgYyA9IGMucmVwbGFjZSgvXFx8LiovLCAnJyk7IC8vZXZlcnl0aGluZyBhZnRlciB0aGUgJ3wnIGlzIG1ldGFkYXRhXG4gICAgICBpZiAoYyAmJiAhYy5tYXRjaCgvW1xcW1xcXV0vKSkge1xuICAgICAgICByLmNhdGVnb3JpZXMucHVzaChjKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICB3aWtpID0gd2lraS5yZXBsYWNlKGNhdF9yZWcsICcnKTtcbiAgcmV0dXJuIHdpa2k7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBwYXJzZV9jYXRlZ29yaWVzO1xuIiwiY29uc3QgcmVkaXJlY3RzID0gcmVxdWlyZSgnLi9wYWdlL3JlZGlyZWN0cycpO1xuY29uc3QgZGlzYW1iaWcgPSByZXF1aXJlKCcuL3BhZ2UvZGlzYW1iaWcnKTtcbmNvbnN0IHByZVByb2Nlc3MgPSByZXF1aXJlKCcuL3ByZVByb2Nlc3MnKTtcbmNvbnN0IHBvc3RQcm9jZXNzID0gcmVxdWlyZSgnLi9wb3N0UHJvY2VzcycpO1xuY29uc3QgcGFyc2UgPSB7XG4gIHNlY3Rpb246IHJlcXVpcmUoJy4vc2VjdGlvbicpLFxuICBpbmZvYm94OiByZXF1aXJlKCcuL2luZm9ib3gnKSxcbiAgY2F0ZWdvcmllczogcmVxdWlyZSgnLi9jYXRlZ29yaWVzJylcbn07XG5cbi8vY29udmVydCB3aWtpc2NyaXB0IG1hcmt1cCBsYW5nIHRvIGpzb25cbmNvbnN0IG1haW4gPSBmdW5jdGlvbih3aWtpLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB3aWtpID0gd2lraSB8fCAnJztcbiAgLy9kZXRlY3QgaWYgcGFnZSBpcyBqdXN0IHJlZGlyZWN0LCBhbmQgcmV0dXJuXG4gIGlmIChyZWRpcmVjdHMuaXNfcmVkaXJlY3Qod2lraSkpIHtcbiAgICByZXR1cm4gcmVkaXJlY3RzLnBhcnNlX3JlZGlyZWN0KHdpa2kpO1xuICB9XG4gIC8vZGV0ZWN0IGlmIHBhZ2UgaXMganVzdCBkaXNhbWJpZ3VhdG9yIHBhZ2UsIGFuZCByZXR1cm5cbiAgaWYgKGRpc2FtYmlnLmlzX2Rpc2FtYmlnKHdpa2kpKSB7XG4gICAgcmV0dXJuIGRpc2FtYmlnLnBhcnNlX2Rpc2FtYmlnKHdpa2kpO1xuICB9XG4gIGxldCByID0ge1xuICAgIHR5cGU6ICdwYWdlJyxcbiAgICBzZWN0aW9uczogW10sXG4gICAgaW5mb2JveGVzOiBbXSxcbiAgICBpbnRlcndpa2k6IHt9LFxuICAgIGNhdGVnb3JpZXM6IFtdLFxuICAgIGltYWdlczogW10sXG4gICAgY29vcmRpbmF0ZXM6IFtdLFxuICAgIGNpdGF0aW9uczogW11cbiAgfTtcbiAgaWYgKG9wdGlvbnMuY3VzdG9tKSB7XG4gICAgci5jdXN0b20gPSB7fTtcbiAgfVxuICBpZiAob3B0aW9ucy5wYWdlX2lkZW50aWZpZXIpIHtcbiAgICByLnBhZ2VfaWRlbnRpZmllciA9IG9wdGlvbnMucGFnZV9pZGVudGlmaWVyO1xuICB9XG4gIGlmIChvcHRpb25zLmxhbmdfb3Jfd2lraWlkKSB7XG4gICAgci5sYW5nX29yX3dpa2lpZCA9IG9wdGlvbnMubGFuZ19vcl93aWtpaWQ7XG4gIH1cbiAgLy9naXZlIG91cnNlbHZlcyBhIGxpdHRsZSBoZWFkLXN0YXJ0XG4gIHdpa2kgPSBwcmVQcm9jZXNzKHIsIHdpa2ksIG9wdGlvbnMpO1xuICAvL3B1bGwtb3V0IGluZm9ib3hlcyBhbmQgc3R1ZmZcbiAgd2lraSA9IHBhcnNlLmluZm9ib3gociwgd2lraSwgb3B0aW9ucyk7XG4gIC8vcHVsbC1vdXQgW1tjYXRlZ29yeTp3aGF0ZXZlcnNdXVxuICBpZiAob3B0aW9ucy5jYXRlZ29yaWVzICE9PSBmYWxzZSkge1xuICAgIHdpa2kgPSBwYXJzZS5jYXRlZ29yaWVzKHIsIHdpa2kpO1xuICB9XG4gIC8vcGFyc2UgYWxsIHRoZSBoZWFkaW5ncywgYW5kIHRoZWlyIHRleHRzL3NlbnRlbmNlc1xuICByLnNlY3Rpb25zID0gcGFyc2Uuc2VjdGlvbihyLCB3aWtpLCBvcHRpb25zKSB8fCBbXTtcblxuICByID0gcG9zdFByb2Nlc3Mocik7XG5cbiAgcmV0dXJuIHI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1haW47XG4iLCIvL1xuY29uc3QgcGFyc2VDaXRhdGlvbiA9IGZ1bmN0aW9uKHN0ciwgd2lraSwgciwgb3B0aW9ucykge1xuICAvL3JlbW92ZSBpdCBmcm9tIG1haW5cbiAgd2lraSA9IHdpa2kucmVwbGFjZShzdHIsICcnKTtcbiAgaWYgKG9wdGlvbnMuY2l0YXRpb25zID09PSBmYWxzZSkge1xuICAgIHJldHVybiB3aWtpO1xuICB9XG4gIC8vdHJpbSBzdGFydCB7eyBhbmRcbiAgLy90cmltIGVuZCB9fVxuICBzdHIgPSBzdHIucmVwbGFjZSgvXlxce1xceyAqPy8sICcnKTtcbiAgc3RyID0gc3RyLnJlcGxhY2UoLyAqP1xcfVxcfSAqPyQvLCAnJyk7XG4gIC8vc3RhcnQgcGFyc2luZyBjaXRhdGlvbiBpbnRvIGpzb25cbiAgbGV0IG9iaiA9IHt9O1xuICBsZXQgbGluZXMgPSBzdHIuc3BsaXQoL1xcfC9nKTtcbiAgLy9maXJzdCBsaW5lIGlzICdjaXRlIHdlYidcbiAgbGV0IHR5cGUgPSBsaW5lc1swXS5tYXRjaCgvY2l0ZSAoW2Etel9dKykvaSkgfHwgW107XG4gIGlmICh0eXBlWzFdKSB7XG4gICAgb2JqLmNpdGUgPSB0eXBlWzFdIHx8IG51bGw7XG4gIH1cbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBsaW5lcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGxldCBhcnIgPSBsaW5lc1tpXS5zcGxpdCgvPS8pO1xuICAgIGxldCBrZXkgPSBhcnJbMF0udHJpbSgpO1xuICAgIGxldCB2YWwgPSBhcnJcbiAgICAgIC5zbGljZSgxLCBhcnIubGVuZ3RoKVxuICAgICAgLmpvaW4oJz0nKVxuICAgICAgLnRyaW0oKTtcbiAgICBpZiAoa2V5ICYmIHZhbCkge1xuICAgICAgLy90dXJuIG51bWJlcnMgaW50byBudW1iZXJzXG4gICAgICBpZiAoL15bMC05Ll0rJC8udGVzdCh2YWwpKSB7XG4gICAgICAgIHZhbCA9IHBhcnNlRmxvYXQodmFsKTtcbiAgICAgIH1cbiAgICAgIG9ialtrZXldID0gdmFsO1xuICAgIH1cbiAgfVxuICBpZiAoT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPiAwKSB7XG4gICAgci5jaXRhdGlvbnMucHVzaChvYmopO1xuICB9XG4gIHJldHVybiB3aWtpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gcGFyc2VDaXRhdGlvbjtcbiIsImNvbnN0IGkxOG4gPSByZXF1aXJlKCcuLi8uLi9kYXRhL2kxOG4nKTtcbmNvbnN0IGZpbmRSZWN1cnNpdmUgPSByZXF1aXJlKCcuLi8uLi9saWIvcmVjdXJzaXZlX21hdGNoJyk7XG5jb25zdCBwYXJzZUluZm9ib3ggPSByZXF1aXJlKCcuL2luZm9ib3gnKTtcbmNvbnN0IHBhcnNlQ2l0YXRpb24gPSByZXF1aXJlKCcuL2NpdGF0aW9uJyk7XG5cbmNvbnN0IGluZm9ib3hfcmVnID0gbmV3IFJlZ0V4cCgne3soJyArIGkxOG4uaW5mb2JveGVzLmpvaW4oJ3wnKSArICcpWzogXFxuXScsICdpZycpO1xuLy9kb250IHJlbW92ZSB0aGVzZSBvbmVzXG5jb25zdCBrZWVwID0gcmVxdWlyZSgnLi4vc2VjdGlvbi9zZW50ZW5jZS90ZW1wbGF0ZXMvbGlzdCcpO1xuXG4vL3JlZHVjZSB0aGUgc2NhcnkgcmVjdXJzaXZlIHNpdHVhdGlvbnNcbmNvbnN0IHBhcnNlX3JlY3Vyc2l2ZSA9IGZ1bmN0aW9uKHIsIHdpa2ksIG9wdGlvbnMpIHtcbiAgLy9yZW1vdmUge3t0ZW1wbGF0ZSB7e319IH19IHJlY3Vyc2lvbnNcbiAgci5pbmZvYm94ZXMgPSBbXTtcbiAgbGV0IG1hdGNoZXMgPSBmaW5kUmVjdXJzaXZlKCd7JywgJ30nLCB3aWtpKS5maWx0ZXIocyA9PiBzWzBdICYmIHNbMV0gJiYgc1swXSA9PT0gJ3snICYmIHNbMV0gPT09ICd7Jyk7XG4gIG1hdGNoZXMuZm9yRWFjaChmdW5jdGlvbih0bXBsKSB7XG4gICAgaWYgKHRtcGwubWF0Y2goaW5mb2JveF9yZWcsICdpZycpKSB7XG4gICAgICBpZiAob3B0aW9ucy5pbmZvYm94ZXMgIT09IGZhbHNlKSB7XG4gICAgICAgIGxldCBpbmZvYm94ID0gcGFyc2VJbmZvYm94KHRtcGwpO1xuICAgICAgICByLmluZm9ib3hlcy5wdXNoKGluZm9ib3gpO1xuICAgICAgfVxuICAgICAgd2lraSA9IHdpa2kucmVwbGFjZSh0bXBsLCAnJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8va2VlcCB0aGVzZSBvbmVzLCB3ZSdsbCBwYXJzZSB0aGVtIGxhdGVyXG4gICAgbGV0IG5hbWUgPSB0bXBsLm1hdGNoKC9eXFx7XFx7KFteOnxcXG4gXSspLyk7XG4gICAgaWYgKG5hbWUgIT09IG51bGwpIHtcbiAgICAgIG5hbWUgPSBuYW1lWzFdLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvLS9nLCAnICcpO1xuICAgICAgLy9cbiAgICAgIGlmICgvXlxce1xceyA/Y2l0YXRpb24gbmVlZGVkL2kudGVzdCh0bXBsKSA9PT0gdHJ1ZSkge1xuICAgICAgICBuYW1lID0gJ2NpdGF0aW9uIG5lZWRlZCc7XG4gICAgICB9XG4gICAgICAvL3BhcnNlIHt7Y2l0ZSB3ZWIgLi4ufX0gKGl0IGFwcGVhcnMgZXZlcnkgbGFuZ3VhZ2UpXG4gICAgICBpZiAobmFtZSA9PT0gJ2NpdGUnIHx8IG5hbWUgPT09ICdjaXRhdGlvbicpIHtcbiAgICAgICAgd2lraSA9IHBhcnNlQ2l0YXRpb24odG1wbCwgd2lraSwgciwgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy9zb3J0YS1rZWVwIG5vd3JhcCB0ZW1wbGF0ZVxuICAgICAgaWYgKG5hbWUgPT09ICdub3dyYXAnKSB7XG4gICAgICAgIGxldCBpbnNpZGUgPSB0bXBsLm1hdGNoKC9eXFx7XFx7bm93cmFwICo/XFx8KC4qPylcXH1cXH0kLyk7XG4gICAgICAgIGlmIChpbnNpZGUpIHtcbiAgICAgICAgICB3aWtpID0gd2lraS5yZXBsYWNlKHRtcGwsIGluc2lkZVsxXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChrZWVwLmhhc093blByb3BlcnR5KG5hbWUpID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgLy9sZXQgZXZlcnlib2R5IGFkZCBhIGN1c3RvbSBwYXJzZXIgZm9yIHRoaXMgdGVtcGxhdGVcbiAgICBpZiAob3B0aW9ucy5jdXN0b20pIHtcbiAgICAgIE9iamVjdC5rZXlzKG9wdGlvbnMuY3VzdG9tKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgICBsZXQgdmFsID0gb3B0aW9ucy5jdXN0b21ba10odG1wbCwgd2lraSk7XG4gICAgICAgIGlmICh2YWwgfHwgdmFsID09PSBmYWxzZSkge1xuICAgICAgICAgIC8vZG9udCBzdG9yZSBhbGwgdGhlIG51bGxzXG4gICAgICAgICAgci5jdXN0b21ba10gPSByLmN1c3RvbVtrXSB8fCBbXTtcbiAgICAgICAgICByLmN1c3RvbVtrXS5wdXNoKHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICAvL2lmIGl0J3Mgbm90IGEga25vd24gdGVtcGxhdGUsIGJ1dCBpdCdzIHJlY3Vyc2l2ZSwgcmVtb3ZlIGl0XG4gICAgLy8oYmVjYXVzZSBpdCB3aWxsIGJlIG1pc3JlYWQgbGF0ZXItb24pXG4gICAgd2lraSA9IHdpa2kucmVwbGFjZSh0bXBsLCAnJyk7XG4gIH0pO1xuICAvLyAvL29rLCBub3cgdGhhdCB0aGUgc2NhcnkgcmVjdXJzaW9uIGlzc3VlcyBhcmUgZ29uZSwgd2UgY2FuIHRydXN0IHNpbXBsZSByZWdleCBtZXRob2RzLi5cbiAgLy8gLy9raWxsIHRoZSByZXN0IG9mIHRlbXBsYXRlc1xuICB3aWtpID0gd2lraS5yZXBsYWNlKC9cXHtcXHsgKj8oXihtYWlufHdpZGUpKS4qP1xcfVxcfS9nLCAnJyk7XG4gIHJldHVybiB3aWtpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZV9yZWN1cnNpdmU7XG4iLCJjb25zdCB0cmltID0gcmVxdWlyZSgnLi4vLi4vbGliL2hlbHBlcnMnKS50cmltX3doaXRlc3BhY2U7XG5jb25zdCBwYXJzZUxpbmUgPSByZXF1aXJlKCcuLi9zZWN0aW9uL3NlbnRlbmNlJykucGFyc2VMaW5lO1xuY29uc3QgZmluZFJlY3Vyc2l2ZSA9IHJlcXVpcmUoJy4uLy4uL2xpYi9yZWN1cnNpdmVfbWF0Y2gnKTtcbmNvbnN0IGkxOG4gPSByZXF1aXJlKCcuLi8uLi9kYXRhL2kxOG4nKTtcbmNvbnN0IGluZm9ib3hfdGVtcGxhdGVfcmVnID0gbmV3IFJlZ0V4cCgne3soPzonICsgaTE4bi5pbmZvYm94ZXMuam9pbignfCcpICsgJylcXFxccyooLiopJywgJ2knKTtcblxuY29uc3QgZ2V0VGVtcGxhdGUgPSBmdW5jdGlvbihzdHIpIHtcbiAgbGV0IG0gPSBzdHIubWF0Y2goaW5mb2JveF90ZW1wbGF0ZV9yZWcpO1xuICBpZiAobSAmJiBtWzFdKSB7XG4gICAgcmV0dXJuIG1bMV07XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5jb25zdCBwYXJzZV9pbmZvYm94ID0gZnVuY3Rpb24oc3RyKSB7XG4gIGlmICghc3RyKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG4gIGxldCBzdHJpbmdCdWlsZGVyID0gW107XG4gIGxldCBsYXN0Q2hhcjtcbiAgLy90aGlzIGNvbGxhcHNpYmxlIGxpc3Qgc3R1ZmYgaXMganVzdCBhIGhlYWRhY2hlXG4gIGxldCBsaXN0UmVnID0gL1xce1xceyA/KGNvbGxhcHNpYmxlfGhsaXN0fHVibGlzdHxwbGFpbmxpc3R8VW5idWxsZXRlZCBsaXN0fGZsYXRsaXN0KS9pO1xuICBpZiAobGlzdFJlZy50ZXN0KHN0cikpIHtcbiAgICBsZXQgbGlzdCA9IGZpbmRSZWN1cnNpdmUoJ3snLCAnfScsIHN0ci5zdWJzdHIoMiwgc3RyLmxlbmd0aCAtIDIpKS5maWx0ZXIoKGYpID0+IGxpc3RSZWcudGVzdChmKSk7XG4gICAgc3RyID0gc3RyLnJlcGxhY2UobGlzdFswXSwgJycpO1xuICB9XG5cbiAgY29uc3QgdGVtcGxhdGUgPSBnZXRUZW1wbGF0ZShzdHIpOyAvL2dldCB0aGUgaW5mb2JveCBuYW1lXG5cbiAgbGV0IHBhckRlcHRoID0gLTI7IC8vIGZpcnN0IHR3byB7e1xuICBmb3IgKGxldCBpID0gMCwgbGVuID0gc3RyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKHBhckRlcHRoID09PSAwICYmIHN0cltpXSA9PT0gJ3wnICYmIGxhc3RDaGFyICE9PSAnXFxuJykge1xuICAgICAgc3RyaW5nQnVpbGRlci5wdXNoKCdcXG4nKTtcbiAgICB9XG4gICAgaWYgKHN0cltpXSA9PT0gJ3snIHx8IHN0cltpXSA9PT0gJ1snKSB7XG4gICAgICBwYXJEZXB0aCsrO1xuICAgIH0gZWxzZSBpZiAoc3RyW2ldID09PSAnfScgfHwgc3RyW2ldID09PSAnXScpIHtcbiAgICAgIHBhckRlcHRoLS07XG4gICAgfVxuICAgIGxhc3RDaGFyID0gc3RyW2ldO1xuICAgIHN0cmluZ0J1aWxkZXIucHVzaChsYXN0Q2hhcik7XG4gIH1cblxuICBzdHIgPSBzdHJpbmdCdWlsZGVyLmpvaW4oJycpO1xuICAvL3JlbW92ZSB0b3ArYm90dG9tXG4gIHN0ciA9IHN0ci5yZXBsYWNlKC9eICo/XFx7XFx7LitbfFxcbl0vLCAnJyk7XG4gIHN0ciA9IHN0ci5yZXBsYWNlKC9cXH1cXH0gKj8kLywgJycpO1xuICBsZXQgbGluZXMgPSBzdHIuc3BsaXQoL1xcblxcKj8vKTtcblxuICBsZXQgb2JqID0ge307XG4gIGxldCBrZXkgPSBudWxsO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGwgPSBsaW5lc1tpXTtcbiAgICBsZXQga2V5TWF0Y2ggPSBsLm1hdGNoKC9cXHwgKj8oW149XSspPSguKyk/L2kpO1xuICAgIGlmIChrZXlNYXRjaCAmJiBrZXlNYXRjaFsxXSkge1xuICAgICAga2V5ID0gdHJpbShrZXlNYXRjaFsxXSk7XG4gICAgICBpZiAoa2V5TWF0Y2hbMl0pIHtcbiAgICAgICAgb2JqW2tleV0gPSB0cmltKGtleU1hdGNoWzJdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9ialtrZXldID0gJyc7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChrZXkpIHtcbiAgICAgIG9ialtrZXldICs9IGw7XG4gICAgfVxuICB9XG4gIC8vcG9zdC1wcm9jZXNzIHZhbHVlc1xuICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goayA9PiB7XG4gICAgaWYgKCFvYmpba10pIHtcbiAgICAgIGRlbGV0ZSBvYmpba107XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG9ialtrXSA9IHBhcnNlTGluZShvYmpba10pO1xuICAgIGlmIChvYmpba10udGV4dCAmJiBvYmpba10udGV4dC5tYXRjaCgvXlswLTksXSokLykpIHtcbiAgICAgIG9ialtrXS50ZXh0ID0gb2JqW2tdLnRleHQucmVwbGFjZSgvLC8sICcnKTtcbiAgICAgIG9ialtrXS50ZXh0ID0gcGFyc2VJbnQob2JqW2tdLnRleHQsIDEwKTtcbiAgICB9XG4gIH0pO1xuICAvLyAvL3JlbW92ZSB0b3ArYm90dG9tXG4gIC8vIGlmKGxpbmVzLmxlbmd0aD4xICYmIGxpbmVzWzBdLm1hdGNoKClcbiAgLy8gY29uc29sZS5sb2cocmVnZXhNYXRjaCk7XG4gIC8vIGNvbnNvbGUubG9nKCdcXG5cXG5cXG4nKTtcbiAgLy8gd2hpbGUgKChyZWdleE1hdGNoID0gbGluZV9yZWcuZXhlYyhzdHIpKSAhPT0gbnVsbCkge1xuICAvLyAgIC8vIGNvbnNvbGUubG9nKHN0ciArICctLS0tJyk7XG4gIC8vICAgbGV0IGtleSA9IGhlbHBlcnMudHJpbV93aGl0ZXNwYWNlKHJlZ2V4TWF0Y2hbMV0gfHwgJycpIHx8ICcnO1xuICAvLyAgIGxldCB2YWx1ZSA9IGhlbHBlcnMudHJpbV93aGl0ZXNwYWNlKHJlZ2V4TWF0Y2hbMl0gfHwgJycpIHx8ICcnO1xuICAvL1xuICAvLyAgIC8vdGhpcyBpcyBuZWNlc3NhcnkgZm9yIG1vbmdvZGIsIGltIHNvcnJ5XG4gIC8vICAga2V5ID0ga2V5LnJlcGxhY2UoL1xcLi8sICcnKTtcbiAgLy8gICBpZiAoa2V5ICYmIHZhbHVlKSB7XG4gIC8vICAgICBvYmpba2V5XSA9IHBhcnNlX2xpbmUodmFsdWUpO1xuICAvLyAgICAgLy90dXJuIG51bWJlciBzdHJpbmdzIGludG8gaW50ZWdlcnNcbiAgLy8gICAgIGlmIChvYmpba2V5XS50ZXh0ICYmIG9ialtrZXldLnRleHQubWF0Y2goL15bMC05LF0qJC8pKSB7XG4gIC8vICAgICAgIG9ialtrZXldLnRleHQgPSBvYmpba2V5XS50ZXh0LnJlcGxhY2UoLywvLCAnJyk7XG4gIC8vICAgICAgIG9ialtrZXldLnRleHQgPSBwYXJzZUludChvYmpba2V5XS50ZXh0LCAxMCk7XG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyB9XG4gIHJldHVybiB7XG4gICAgdGVtcGxhdGU6IHRlbXBsYXRlLFxuICAgIGRhdGE6IG9ialxuICB9O1xufTtcbm1vZHVsZS5leHBvcnRzID0gcGFyc2VfaW5mb2JveDtcbiIsImNvbnN0IGkxOG4gPSByZXF1aXJlKCcuLi8uLi9kYXRhL2kxOG4nKTtcbmNvbnN0IHBhcnNlX2xpbmtzID0gcmVxdWlyZSgnLi4vc2VjdGlvbi9zZW50ZW5jZS9saW5rcycpO1xuY29uc3QgdGVtcGxhdGVfcmVnID0gbmV3IFJlZ0V4cCgnXFxcXHtcXFxceyA/KCcgKyBpMThuLmRpc2FtYmlncy5qb2luKCd8JykgKyAnKShcXFxcfFthLXogPV0qPyk/ID9cXFxcfVxcXFx9JywgJ2knKTtcblxuY29uc3QgaXNfZGlzYW1iaWcgPSBmdW5jdGlvbih3aWtpKSB7XG4gIHJldHVybiB0ZW1wbGF0ZV9yZWcudGVzdCh3aWtpKTtcbn07XG5cbi8vcmV0dXJuIGEgbGlzdCBvZiBwcm9iYWJsZSBwYWdlcyBmb3IgdGhpcyBkaXNhbWJpZyBwYWdlXG5jb25zdCBwYXJzZV9kaXNhbWJpZyA9IGZ1bmN0aW9uKHdpa2kpIHtcbiAgbGV0IHBhZ2VzID0gW107XG4gIGxldCBsaW5lcyA9IHdpa2kucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdCgvXFxuLyk7XG4gIGxpbmVzLmZvckVhY2goZnVuY3Rpb24oc3RyKSB7XG4gICAgLy9pZiB0aGVyZSdzIGFuIGVhcmx5IGxpbmsgaW4gdGhlIGxpc3RcbiAgICBpZiAoc3RyLm1hdGNoKC9eXFwqLnswLDQwfVxcW1xcWy4qXFxdXFxdLykpIHtcbiAgICAgIGxldCBsaW5rcyA9IHBhcnNlX2xpbmtzKHN0cik7XG4gICAgICBpZiAobGlua3MgJiYgbGlua3NbMF0gJiYgbGlua3NbMF0ucGFnZSkge1xuICAgICAgICBwYWdlcy5wdXNoKGxpbmtzWzBdLnBhZ2UpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ2Rpc2FtYmlndWF0aW9uJyxcbiAgICBwYWdlczogcGFnZXNcbiAgfTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNfZGlzYW1iaWc6IGlzX2Rpc2FtYmlnLFxuICBwYXJzZV9kaXNhbWJpZzogcGFyc2VfZGlzYW1iaWdcbn07XG4iLCJjb25zdCBpMThuID0gcmVxdWlyZSgnLi4vLi4vZGF0YS9pMThuJyk7XG4vL3B1bGxzIHRhcmdldCBsaW5rIG91dCBvZiByZWRpcmVjdCBwYWdlXG5jb25zdCBSRURJUkVDVF9SRUdFWCA9IG5ldyBSZWdFeHAoJ15bIFxcblxcdF0qPyMoJyArIGkxOG4ucmVkaXJlY3RzLmpvaW4oJ3wnKSArICcpICo/XFxcXFtcXFxcWyguezIsNjB9PylcXFxcXVxcXFxdJywgJ2knKTtcblxuY29uc3QgaXNfcmVkaXJlY3QgPSBmdW5jdGlvbih3aWtpKSB7XG4gIHJldHVybiB3aWtpLm1hdGNoKFJFRElSRUNUX1JFR0VYKTtcbn07XG5cbmNvbnN0IHBhcnNlX3JlZGlyZWN0ID0gZnVuY3Rpb24od2lraSkge1xuICBsZXQgYXJ0aWNsZSA9ICh3aWtpLm1hdGNoKFJFRElSRUNUX1JFR0VYKSB8fCBbXSlbMl0gfHwgJyc7XG4gIGFydGljbGUgPSBhcnRpY2xlLnJlcGxhY2UoLyMuKi8sICcnKTtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAncmVkaXJlY3QnLFxuICAgIHJlZGlyZWN0OiBhcnRpY2xlXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNfcmVkaXJlY3Q6IGlzX3JlZGlyZWN0LFxuICBwYXJzZV9yZWRpcmVjdDogcGFyc2VfcmVkaXJlY3Rcbn07XG4iLCJjb25zdCBpMThuID0gcmVxdWlyZSgnLi4vLi4vZGF0YS9pMThuJyk7XG5jb25zdCBwYXJzZUltYWdlID0gcmVxdWlyZSgnLi4vc2VjdGlvbi9pbWFnZS9pbWFnZScpO1xuY29uc3QgaW1nX3JlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgaTE4bi5pbWFnZXMuY29uY2F0KGkxOG4uZmlsZXMpLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcblxuLy9jbGVhbnVwIGFmdGVyIG91cnNlbHZlc1xuY29uc3QgcG9zdFByb2Nlc3MgPSBmdW5jdGlvbihyKSB7XG4gIC8vIGFkZCBpbWFnZSBmcm9tIGluZm9ib3gsIGlmIGFwcGxpY2FibGVcbiAgaWYgKHIuaW5mb2JveGVzWzBdICYmIHIuaW5mb2JveGVzWzBdLmRhdGEgJiYgci5pbmZvYm94ZXNbMF0uZGF0YVsnaW1hZ2UnXSAmJiByLmluZm9ib3hlc1swXS5kYXRhWydpbWFnZSddLnRleHQpIHtcbiAgICBsZXQgaW1nID0gci5pbmZvYm94ZXNbMF0uZGF0YVsnaW1hZ2UnXS50ZXh0IHx8ICcnO1xuICAgIGlmIChpbWcgJiYgdHlwZW9mIGltZyA9PT0gJ3N0cmluZycgJiYgIWltZy5tYXRjaChpbWdfcmVnZXgpKSB7XG4gICAgICBpbWcgPSAnW1tGaWxlOicgKyBpbWcgKyAnXV0nO1xuICAgICAgaW1nID0gcGFyc2VJbWFnZShpbWcpO1xuICAgICAgci5pbWFnZXMucHVzaChpbWcpO1xuICAgIH1cbiAgfVxuICAvL2xvb3AgYXJvdW5kIGFuZCBhZGQgdGhlIG90aGVyIGltYWdlc1xuICByLnNlY3Rpb25zLmZvckVhY2gocyA9PiB7XG4gICAgLy9pbWFnZSBmcm9tIHt7d2lkZSBpbWFnZXwuLi59fSB0ZW1wbGF0ZVxuICAgIGlmIChzLnRlbXBsYXRlcyAmJiBzLnRlbXBsYXRlcy53aWRlX2ltYWdlKSB7XG4gICAgICBsZXQgaW1nID0gcy50ZW1wbGF0ZXMud2lkZV9pbWFnZVswXTtcbiAgICAgIGltZyA9ICdbW0ZpbGU6JyArIGltZyArICddXSc7XG4gICAgICBpbWcgPSBwYXJzZUltYWdlKGltZyk7XG4gICAgICByLmltYWdlcy5wdXNoKGltZyk7XG4gICAgfVxuICAgIGlmIChzLmltYWdlcykge1xuICAgICAgcy5pbWFnZXMuZm9yRWFjaChpbWcgPT4gci5pbWFnZXMucHVzaChpbWcpKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vdHJ5IHRvIGd1ZXNzIHRoZSBwYWdlJ3MgdGl0bGUgKGZyb20gdGhlIGJvbGQgZmlyc3QtbGluZSlcbiAgaWYgKHIuc2VjdGlvbnNbMF0gJiYgci5zZWN0aW9uc1swXS5zZW50ZW5jZXNbMF0pIHtcbiAgICBsZXQgcyA9IHIuc2VjdGlvbnNbMF0uc2VudGVuY2VzWzBdO1xuICAgIGlmIChzLmZtdCAmJiBzLmZtdC5ib2xkICYmIHMuZm10LmJvbGRbMF0pIHtcbiAgICAgIHIudGl0bGUgPSByLnRpdGxlIHx8IHMuZm10LmJvbGRbMF07XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufTtcbm1vZHVsZS5leHBvcnRzID0gcG9zdFByb2Nlc3M7XG4iLCJjb25zdCBjb252ZXJ0R2VvID0gcmVxdWlyZSgnLi4vLi4vbGliL2NvbnZlcnRHZW8nKTtcbi8vIHt7Y29vcmR8bGF0aXR1ZGV8bG9uZ2l0dWRlfGNvb3JkaW5hdGUgcGFyYW1ldGVyc3x0ZW1wbGF0ZSBwYXJhbWV0ZXJzfX1cbi8vIHt7Y29vcmR8ZGR8Ti9TfGRkfEUvV3xjb29yZGluYXRlIHBhcmFtZXRlcnN8dGVtcGxhdGUgcGFyYW1ldGVyc319XG4vLyB7e2Nvb3JkfGRkfG1tfE4vU3xkZHxtbXxFL1d8Y29vcmRpbmF0ZSBwYXJhbWV0ZXJzfHRlbXBsYXRlIHBhcmFtZXRlcnN9fVxuLy8ge3tjb29yZHxkZHxtbXxzc3xOL1N8ZGR8bW18c3N8RS9XfGNvb3JkaW5hdGUgcGFyYW1ldGVyc3x0ZW1wbGF0ZSBwYXJhbWV0ZXJzfX1cblxuY29uc3QgaGVtaXNwaGVyZXMgPSB7XG4gIG46IHRydWUsXG4gIHM6IHRydWUsXG4gIHc6IHRydWUsXG4gIGU6IHRydWUsXG59O1xuXG5jb25zdCByb3VuZCA9IGZ1bmN0aW9uKG51bSkge1xuICBpZiAodHlwZW9mIG51bSAhPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gbnVtO1xuICB9XG4gIGxldCBwbGFjZXMgPSAxMDAwMDA7XG4gIHJldHVybiBNYXRoLnJvdW5kKG51bSAqIHBsYWNlcykgLyBwbGFjZXM7XG59O1xuXG5jb25zdCBwYXJzZUNvb3JkID0gZnVuY3Rpb24oc3RyKSB7XG4gIGxldCBvYmogPSB7XG4gICAgbGF0OiBudWxsLFxuICAgIGxvbjogbnVsbFxuICB9O1xuICBsZXQgYXJyID0gc3RyLnNwbGl0KCd8Jyk7XG4gIC8vdHVybiBudW1iZXJzIGludG8gbnVtYmVycywgbm9ybWFsaXplIE4vc1xuICBsZXQgbnVtcyA9IFtdO1xuICBmb3IobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgbGV0IHMgPSBhcnJbaV0udHJpbSgpO1xuICAgIC8vbWFrZSBpdCBhIG51bWJlclxuICAgIGxldCBudW0gPSBwYXJzZUZsb2F0KHMpO1xuICAgIGlmIChudW0gfHwgbnVtID09PSAwKSB7XG4gICAgICBhcnJbaV0gPSBudW07XG4gICAgICBudW1zLnB1c2gobnVtKTtcbiAgICB9IGVsc2UgaWYgKHMubWF0Y2goL15yZWdpb246L2kpKSB7XG4gICAgICBvYmoucmVnaW9uID0gcy5yZXBsYWNlKC9ecmVnaW9uOi9pLCAnJyk7XG4gICAgICBjb250aW51ZTtcbiAgICB9IGVsc2UgaWYgKHMubWF0Y2goL15ub3RlczovaSkpIHtcbiAgICAgIG9iai5ub3RlcyA9IHMucmVwbGFjZSgvXm5vdGVzOi9pLCAnJyk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLy9ETVMtZm9ybWF0XG4gICAgaWYgKGhlbWlzcGhlcmVzW3MudG9Mb3dlckNhc2UoKV0pIHtcbiAgICAgIGlmIChvYmoubGF0ICE9PSBudWxsKSB7XG4gICAgICAgIG51bXMucHVzaChzKTtcbiAgICAgICAgb2JqLmxvbiA9IGNvbnZlcnRHZW8obnVtcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBudW1zLnB1c2gocyk7XG4gICAgICAgIG9iai5sYXQgPSBjb252ZXJ0R2VvKG51bXMpO1xuICAgICAgICBhcnIgPSBhcnIuc2xpY2UoaSwgYXJyLmxlbmd0aCk7XG4gICAgICAgIG51bXMgPSBbXTtcbiAgICAgICAgaSA9IDA7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vdGhpcyBpcyBhbiBvcmlnaW5hbCBgbGF0fGxvbmAgZm9ybWF0XG4gIGlmICghb2JqLmxvbiAmJiBudW1zLmxlbmd0aCA9PT0gMikge1xuICAgIG9iai5sYXQgPSBudW1zWzBdO1xuICAgIG9iai5sb24gPSBudW1zWzFdO1xuICB9XG4gIG9iai5sYXQgPSByb3VuZChvYmoubGF0KTtcbiAgb2JqLmxvbiA9IHJvdW5kKG9iai5sb24pO1xuICByZXR1cm4gb2JqO1xufTtcbm1vZHVsZS5leHBvcnRzID0gcGFyc2VDb29yZDtcbiIsImNvbnN0IGtpbGxfeG1sID0gcmVxdWlyZSgnLi9raWxsX3htbCcpO1xuY29uc3Qgd29yZFRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vd29yZF90ZW1wbGF0ZXMnKTtcblxuLy90aGlzIG1vc3RseS1mb3JtYXR0aW5nIHN0dWZmIGNhbiBiZSBjbGVhbmVkLXVwIGZpcnN0LCB0byBtYWtlIGxpZmUgZWFzaWVyXG5mdW5jdGlvbiBwcmVQcm9jZXNzKHIsIHdpa2ksIG9wdGlvbnMpIHtcbiAgLy9yZW1vdmUgY29tbWVudHNcbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvPCEtLVtePl17MCwyMDAwfS0tPi9nLCAnJyk7XG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoL19fKE5PVE9DfE5PRURJVFNFQ1RJT058Rk9SQ0VUT0N8VE9DKV9fL2dpLCAnJyk7XG4gIC8vc2lnbml0dXJlc1xuICB3aWtpID0gd2lraS5yZXBsYWNlKC9+fnsxLDN9LywgJycpO1xuICAvL3dpbmRvd3MgbmV3bGluZXNcbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvXFxyL2csICcnKTtcbiAgLy9ob3Jpem9udGFsIHJ1bGVcbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvLS17MSwzfS8sICcnKTtcbiAgLy9zcGFjZVxuICB3aWtpID0gd2lraS5yZXBsYWNlKC8mbmJzcDsvZywgJyAnKTtcbiAgLy9raWxsIG9mZiBpbnRlcndpa2kgbGlua3NcbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvXFxbXFxbKFthLXpdW2Etel18c2ltcGxlfHdhcnxjZWJ8bWluKTouezIsNjB9XFxdXFxdL2ksICcnKTtcbiAgLy9leHBhbmQgaW5saW5lIHRlbXBsYXRlcyBsaWtlIHt7ZGF0ZX19XG4gIHdpa2kgPSB3b3JkVGVtcGxhdGVzKHdpa2ksIHIpO1xuICAvL2dpdmUgaXQgdGhlIGluZ2xvcmlvdXMgc2VuZC1vZmYgaXQgZGVzZXJ2ZXMuLlxuICB3aWtpID0ga2lsbF94bWwod2lraSwgciwgb3B0aW9ucyk7XG4gIC8vKHt7dGVtcGxhdGV9fSx7e3RlbXBsYXRlfX0pIGxlYXZlcyBlbXB0eSBwYXJlbnRoZXNlc1xuICB3aWtpID0gd2lraS5yZXBsYWNlKC9cXCggXFwpL2csICcnKTtcbiAgcmV0dXJuIHdpa2k7XG59XG5tb2R1bGUuZXhwb3J0cyA9IHByZVByb2Nlc3M7XG4vLyBjb25zb2xlLmxvZyhwcmVQcm9jZXNzKFwiaGkgW1thczpQbGFuY3Rvbl1dIHRoZXJlXCIpKTtcbi8vIGNvbnNvbGUubG9nKHByZVByb2Nlc3MoJ2hlbGxvIDxici8+IHdvcmxkJykpXG4vLyBjb25zb2xlLmxvZyhwcmVQcm9jZXNzKFwiaGVsbG8gPGFzZCBmPiB3b3JsZCA8L2gyPlwiKSlcbiIsImNvbnN0IHBhcnNlQ2l0YXRpb24gPSByZXF1aXJlKCcuLi9pbmZvYm94L2NpdGF0aW9uJyk7XG5jb25zdCBwYXJzZUxpbmUgPSByZXF1aXJlKCcuLi9zZWN0aW9uL3NlbnRlbmNlJykucGFyc2VMaW5lO1xuLy9va2F5LCBpIGtub3cgeW91J3JlIG5vdCBzdXBwb3NlZCB0byByZWdleCBodG1sLCBidXQuLi5cbi8vaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSGVscDpIVE1MX2luX3dpa2l0ZXh0XG5cbmNvbnN0IGhhc0NpdGF0aW9uID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiAvXiAqP1xce1xceyAqPyhjaXRlfGNpdGF0aW9uKS9pLnRlc3Qoc3RyKSAmJiAvXFx9XFx9ICo/JC8udGVzdChzdHIpICYmIC9jaXRhdGlvbiBuZWVkZWQvaS50ZXN0KHN0cikgPT09IGZhbHNlO1xufTtcbi8vaGFuZGxlIHVuc3RydWN0dXJlZCBvbmVzIC0gPHJlZj5zb21lIHRleHQ8L3JlZj5cbmNvbnN0IHBhcnNlSW5saW5lID0gZnVuY3Rpb24oc3RyLCByLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLmNpdGF0aW9ucyA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IG9iaiA9IHBhcnNlTGluZShzdHIpIHx8IHt9O1xuICBsZXQgY2l0ZSA9IHtcbiAgICBjaXRlOiAnaW5saW5lJyxcbiAgICB0ZXh0OiBvYmoudGV4dFxuICB9O1xuICBpZiAob2JqLmxpbmtzICYmIG9iai5saW5rcy5sZW5ndGgpIHtcbiAgICBsZXQgZXh0ZXJuID0gb2JqLmxpbmtzLmZpbmQoZiA9PiBmLnNpdGUpO1xuICAgIGlmIChleHRlcm4pIHtcbiAgICAgIGNpdGUudXJsID0gZXh0ZXJuLnNpdGU7XG4gICAgfVxuICB9XG4gIHIuY2l0YXRpb25zLnB1c2goY2l0ZSk7XG59O1xuXG5jb25zdCBraWxsX3htbCA9IGZ1bmN0aW9uKHdpa2ksIHIsIG9wdGlvbnMpIHtcbiAgLy9sdWNraWx5LCByZWZzIGNhbid0IGJlIHJlY3Vyc2l2ZS4uXG4gIC8vIDxyZWY+PC9yZWY+XG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLyA/PHJlZj4oW1xcc1xcU117MCw3NTB9Pyk8XFwvcmVmPiA/L2dpLCBmdW5jdGlvbihhLCB0bXBsKSB7XG4gICAgaWYgKGhhc0NpdGF0aW9uKHRtcGwpKSB7XG4gICAgICB3aWtpID0gcGFyc2VDaXRhdGlvbih0bXBsLCB3aWtpLCByLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyc2VJbmxpbmUodG1wbCwgciwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHJldHVybiAnICc7XG4gIH0pO1xuICAvLyA8cmVmIG5hbWU9XCJcIi8+XG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLyA/PHJlZiBbXj5dezAsMjAwfT9cXC8+ID8vZ2ksICcgJyk7XG4gIC8vIDxyZWYgbmFtZT1cIlwiPjwvcmVmPlxuICB3aWtpID0gd2lraS5yZXBsYWNlKC8gPzxyZWYgW14+XXswLDIwMH0/PihbXFxzXFxTXXswLDEwMDB9Pyk8XFwvcmVmPiA/L2dpLCBmdW5jdGlvbihhLCB0bXBsKSB7XG4gICAgaWYgKGhhc0NpdGF0aW9uKHRtcGwpKSB7XG4gICAgICB3aWtpID0gcGFyc2VDaXRhdGlvbih0bXBsLCB3aWtpLCByLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyc2VJbmxpbmUodG1wbCwgciwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHJldHVybiAnICc7XG4gIH0pO1xuICAvL290aGVyIHR5cGVzIG9mIHhtbCB0aGF0IHdlIHdhbnQgdG8gdHJhc2ggY29tcGxldGVseVxuICB3aWtpID0gd2lraS5yZXBsYWNlKC88ID8odGFibGV8Y29kZXxzY29yZXxkYXRhfGNhdGVnb3J5dHJlZXxjaGFyaW5zZXJ0fGdhbGxlcnl8aGllcm98aW1hZ2VtYXB8aW5wdXRib3h8bWF0aHxub3dpa2l8cG9lbXxyZWZlcmVuY2VzfHNvdXJjZXxzeW50YXhoaWdobGlnaHR8dGltZWxpbmUpID9bXj5dezAsMjAwfT8+W1xcc1xcU117MCw3MDB9PCA/XFwvID8odGFibGV8Y29kZXxzY29yZXxkYXRhfGNhdGVnb3J5dHJlZXxjaGFyaW5zZXJ0fGdhbGxlcnl8aGllcm98aW1hZ2VtYXB8aW5wdXRib3h8bWF0aHxub3dpa2l8cG9lbXxyZWZlcmVuY2VzfHNvdXJjZXxzeW50YXhoaWdobGlnaHR8dGltZWxpbmUpID8+L2dpLCAnICcpOyAvLyA8dGFibGUgbmFtZT1cIlwiPjx0cj5oaTwvdHI+PC90YWJsZT5cbiAgLy9zb21lIHhtbC1saWtlIGZyYWdtZW50cyB3ZSBjYW4gYWxzbyBraWxsXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLyA/PCA/KHJlZnxzcGFufGRpdnx0YWJsZXxkYXRhKSBbYS16MC05PVwiIF17MiwyMH1cXC8gPz4gPy9nLCAnICcpOyAvLzxyZWYgbmFtZT1cImFzZFwiLz5cbiAgLy9zb21lIGZvcm1hdHRpbmcgeG1sLCB3ZSdsbCBrZWVwIHRoZWlyIGluc2lkZXMgdGhvdWdoXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLyA/PFsgXFwvXT8ocHxzdWJ8c3VwfHNwYW58bm93aWtpfGRpdnx0YWJsZXxicnx0cnx0ZHx0aHxwcmV8cHJlMnxocilbIFxcL10/PiA/L2csICcgJyk7IC8vPHN1Yj4sIDwvc3ViPlxuICB3aWtpID0gd2lraS5yZXBsYWNlKC8gPzxbIFxcL10/KGFiYnJ8YmRpfGJkb3xibG9ja3F1b3RlfGNpdGV8ZGVsfGRmbnxlbXxpfGluc3xrYmR8bWFya3xxfHMpWyBcXC9dPz4gPy9nLCAnICcpOyAvLzxhYmJyPiwgPC9hYmJyPlxuICB3aWtpID0gd2lraS5yZXBsYWNlKC8gPzxbIFxcL10/aFswLTldWyBcXC9dPz4gPy9nLCAnICcpOyAvLzxoMj4sIDwvaDI+XG4gIC8vYSBtb3JlIGdlbmVyaWMgKyBkYW5nZXJvdXMgeG1sLXRhZyByZW1vdmFsXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoLyA/PFsgXFwvXT9bYS16MC05XXsxLDh9WyBcXC9dPz4gPy9nLCAnICcpOyAvLzxzYW1wPlxuICB3aWtpID0gd2lraS5yZXBsYWNlKC8gPzwgP2JyID9cXC8+ID8vZywgJyAnKTsgLy88YnIgLz5cbiAgcmV0dXJuIHdpa2kudHJpbSgpO1xufTtcbi8vIGNvbnNvbGUubG9nKGtpbGxfeG1sKFwiaGVsbG8gPHJlZj5ub25vITwvcmVmPiB3b3JsZDEuIGhlbGxvIDxyZWYgbmFtZT0naHVsbG8nPm5vbm8hPC9yZWY+IHdvcmxkMi4gaGVsbG8gPHJlZiBuYW1lPSdodWxsbycvPndvcmxkMy4gIGhlbGxvIDx0YWJsZSBuYW1lPScnPjx0cj48dGQ+aGk8cmVmPm5vbm8hPC9yZWY+PC90ZD48L3RyPjwvdGFibGU+d29ybGQ0LiBoZWxsbzxyZWYgbmFtZT0nJy8+IHdvcmxkNSA8cmVmIG5hbWU9Jyc+bm9ubzwvcmVmPiwgbWFuLn19XCIpKVxuLy8gY29uc29sZS5sb2coa2lsbF94bWwoXCJoZWxsbyA8dGFibGUgbmFtZT0nJz48dHI+PHRkPmhpPHJlZj5ub25vITwvcmVmPjwvdGQ+PC90cj48L3RhYmxlPndvcmxkNFwiKSlcbi8vIGNvbnNvbGUubG9nKGtpbGxfeG1sKCdoZWxsbzxyZWYgbmFtZT1cInRoZXJveWFsXCIvPiB3b3JsZCA8cmVmPm5vbm88L3JlZj4sIG1hbn19JykpXG4vLyBjb25zb2xlLmxvZyhraWxsX3htbChcImhlbGxvPHJlZiBuYW1lPVxcXCJ0aGVyb3lhbFxcXCIvPiB3b3JsZDUsIDxyZWYgbmFtZT1cXFwiXFxcIj5ub25vPC9yZWY+IG1hblwiKSk7XG4vLyBjb25zb2xlLmxvZyhraWxsX3htbChcImhlbGxvIDxhc2QgZj4gd29ybGQgPC9oMj5cIikpXG4vLyBjb25zb2xlLmxvZyhraWxsX3htbChcIk5vcnRoIEFtZXJpY2EsPHJlZiBuYW1lPVxcXCJmaHdhXFxcIj4gYW5kIG9uZSBvZlwiKSlcbi8vIGNvbnNvbGUubG9nKGtpbGxfeG1sKFwiTm9ydGggQW1lcmljYSw8YnIgLz4gYW5kIG9uZSBvZlwiKSlcbm1vZHVsZS5leHBvcnRzID0ga2lsbF94bWw7XG4iLCJjb25zdCBsYW5ndWFnZXMgPSByZXF1aXJlKCcuLi8uLi9kYXRhL2xhbmd1YWdlcycpO1xuY29uc3QgcGFyc2VDb29yZCA9IHJlcXVpcmUoJy4vY29vcmRpbmF0ZXMnKTtcblxuY29uc3QgbW9udGhzID0gW1xuICAnSmFudWFyeScsXG4gICdGZWJydWFyeScsXG4gICdNYXJjaCcsXG4gICdBcHJpbCcsXG4gICdNYXknLFxuICAnSnVuZScsXG4gICdKdWx5JyxcbiAgJ0F1Z3VzdCcsXG4gICdTZXB0ZW1iZXInLFxuICAnT2N0b2JlcicsXG4gICdOb3ZlbWJlcicsXG4gICdEZWNlbWJlcidcbl07XG5jb25zdCBkYXlzID0gWydTdW5kYXknLCAnTW9uZGF5JywgJ1R1ZXNkYXknLCAnV2VkbmVzZGF5JywgJ1RodXJzZGF5JywgJ0ZyaWRheScsICdTYXR1cmRheSddO1xuLy90aGVzZSBhcmUgZWFzeSwgaW5saW5lIHRlbXBsYXRlcyB3ZSBjYW4gZG8gd2l0aG91dCB0b28tbXVjaCB0cm91YmxlLlxuY29uc3QgaW5saW5lID0gL1xce1xceyh1cmx8Y29udmVydHxjdXJyZW50fGxvY2FsfGxjfHVjfGZvcm1hdG51bXxwdWxsfGNxdW90ZXxjb29yZHxzbWFsbHxzbWFsbGVyfG1pZHNpemV8bGFyZ2VyfGJpZ3xiaWdnZXJ8bGFyZ2V8aHVnZXxyZXNpemV8ZHRzfGRhdGV8dGVybXxpcGF8aWxsfHNlbnNlfHR8ZXR5bHxzZm5yZWYpKC4qPylcXH1cXH0vZ2k7XG5cbi8vIHRlbXBsYXRlcyB0aGF0IG5lZWQgcGFyc2luZyBhbmQgcmVwbGFjaW5nIGZvciBpbmxpbmUgdGV4dFxuLy9odHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9DYXRlZ29yeTpNYWdpY193b3JkX3RlbXBsYXRlc1xuY29uc3Qgd29yZF90ZW1wbGF0ZXMgPSBmdW5jdGlvbih3aWtpLCByKSB7XG4gIC8vZ3JlZWR5LXBhc3MgYXQgZWFzaWVyLCBpbmxpbmUtdGVtcGxhdGVzXG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoaW5saW5lLCBmdW5jdGlvbih0bXBsKSB7XG4gICAgLy93ZSBjYW4gYmUgc25lYWt5IHdpdGggdGhpcyB0ZW1wbGF0ZSwgYXMgaXQncyBvZnRlbiBmb3VuZCBpbnNpZGUgb3RoZXIgdGVtcGxhdGVzXG4gICAgdG1wbCA9IHRtcGwucmVwbGFjZSgvXlxce1xce1VSTFxcfChbXiBdezQsMTAwfT8pXFx9XFx9L2dpLCAnJDEnKTtcbiAgICAvL3RoaXMgb25lIG5lZWRzIHRvIGJlIGhhbmRsZWQgbWFudWFsbHlcbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7Y29udmVydFxcfChbMC05XSo/KVxcfChbXlxcfF0qPylcXH1cXH0vZ2ksICckMSAkMicpOyAvL1RPRE86IHN1cHBvcnQgaHR0cHM6Ly9lbi50bXBscGVkaWEub3JnL3RtcGwvVGVtcGxhdGU6Q29udmVydCNSYW5nZXNfb2ZfdmFsdWVzXG4gICAgLy9kYXRlLXRpbWUgdGVtcGxhdGVzXG4gICAgbGV0IGQgPSBuZXcgRGF0ZSgpO1xuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHsoQ1VSUkVOVHxMT0NBTClEQVkoMik/XFx9XFx9L2dpLCBkLmdldERhdGUoKSk7XG4gICAgdG1wbCA9IHRtcGwucmVwbGFjZSgvXlxce1xceyhDVVJSRU5UfExPQ0FMKU1PTlRIKE5BTUV8QUJCUkVWKT9cXH1cXH0vZ2ksIG1vbnRoc1tkLmdldE1vbnRoKCldKTtcbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7KENVUlJFTlR8TE9DQUwpWUVBUlxcfVxcfS9naSwgZC5nZXRGdWxsWWVhcigpKTtcbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7KENVUlJFTlR8TE9DQUwpREFZTkFNRVxcfVxcfS9naSwgZGF5c1tkLmdldERheSgpXSk7XG4gICAgLy9mb3JtYXR0aW5nIHRlbXBsYXRlc1xuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHsobGN8dWN8Zm9ybWF0bnVtKTooLio/KVxcfVxcfS9naSwgJyQyJyk7XG4gICAgdG1wbCA9IHRtcGwucmVwbGFjZSgvXlxce1xce3B1bGwgcXVvdGVcXHwoW1xcc1xcU10qPykoXFx8W1xcc1xcU10qPyk/XFx9XFx9L2dpLCAnJDEnKTtcbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7Y3F1b3RlXFx8KFtcXHNcXFNdKj8pKFxcfFtcXHNcXFNdKj8pP1xcfVxcfS9naSwgJyQxJyk7XG4gICAgLy9pbnRlcmxhbmd1YWdlLWxpbmtcbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7aWxsXFx8KFtefF0rKS4qP1xcfVxcfS9naSwgJyQxJyk7XG4gICAgLy9mb290bm90ZSBzeW50YXhcbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7cmVmblxcfChbXnxdKykuKj9cXH1cXH0vZ2ksICckMScpO1xuICAgIC8vJ3RhZycgZXNjYXBlZCB0aGluZy5cbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7Iz90YWdcXHwoW158XSspLio/XFx9XFx9L2dpLCAnJyk7XG4gICAgLy8naGFydmFyZCByZWZlcmVuY2VzJ1xuICAgIC8ve3tjb29yZHw0M3w0MnxOfDc5fDI0fFd8cmVnaW9uOkNBLU9OfGRpc3BsYXk9aW5saW5lLHRpdGxlfX1cbiAgICBsZXQgY29vcmQgPSB0bXBsLm1hdGNoKC9eXFx7XFx7Y29vcmRcXHwoLio/KVxcfVxcfS9pKTtcbiAgICBpZiAoY29vcmQgIT09IG51bGwpIHtcbiAgICAgIHIuY29vcmRpbmF0ZXMucHVzaChwYXJzZUNvb3JkKGNvb3JkWzFdKSk7XG4gICAgICB0bXBsID0gdG1wbC5yZXBsYWNlKGNvb3JkWzBdLCAnJyk7XG4gICAgfVxuICAgIC8vZm9udC1zaXplXG4gICAgdG1wbCA9IHRtcGwucmVwbGFjZSgvXlxce1xceyhzbWFsbHxzbWFsbGVyfG1pZHNpemV8bGFyZ2VyfGJpZ3xiaWdnZXJ8bGFyZ2V8aHVnZXxyZXNpemUpXFx8KFtcXHNcXFNdKj8pXFx9XFx9L2dpLCAnJDInKTtcbiAgICAvL3t7Zm9udHxzaXplPXglfHRleHR9fVxuXG4gICAgaWYgKHRtcGwubWF0Y2goL15cXHtcXHtkdHNcXHwvKSkge1xuICAgICAgbGV0IGRhdGUgPSAodG1wbC5tYXRjaCgvXlxce1xce2R0c1xcfCguKj8pW1xcfVxcfF0vKSB8fCBbXSlbMV0gfHwgJyc7XG4gICAgICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICBpZiAoZGF0ZSAmJiBkYXRlLmdldFRpbWUoKSkge1xuICAgICAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7ZHRzXFx8Lio/XFx9XFx9L2dpLCBkYXRlLnRvRGF0ZVN0cmluZygpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHtkdHNcXHwuKj9cXH1cXH0vZ2ksICcgJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0bXBsLm1hdGNoKC9eXFx7XFx7ZGF0ZVxcfC4qP1xcfVxcfS8pKSB7XG4gICAgICBsZXQgZGF0ZSA9IHRtcGwubWF0Y2goL15cXHtcXHtkYXRlXFx8KC4qPylcXHwoLio/KVxcfCguKj8pXFx9XFx9LykgfHwgW10gfHwgW107XG4gICAgICBsZXQgZGF0ZVN0cmluZyA9IGRhdGVbMV0gKyAnICcgKyBkYXRlWzJdICsgJyAnICsgZGF0ZVszXTtcbiAgICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHtkYXRlXFx8Lio/XFx9XFx9L2dpLCBkYXRlU3RyaW5nKTtcbiAgICB9XG4gICAgLy9jb21tb24gdGVtcGxhdGVzIGluIHdpa3Rpb25hcnlcbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7dGVybVxcfCguKj8pXFx8Lio/XFx9XFx9L2dpLCAnXFwnJDFcXCcnKTtcbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7SVBBKGMtZW4pP1xcfCguKj8pXFx8KC4qPylcXH1cXH0sPy9naSwgJycpO1xuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL15cXHtcXHtzZW5zZVxcfCguKj8pXFx8Py4qP1xcfVxcfS9naSwgJygkMSknKTtcbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC92XFx7XFx7dFxcKz9cXHwuLi4/XFx8KC4qPykoXFx8LiopP1xcfVxcfS9naSwgJ1xcJyQxXFwnJyk7XG4gICAgLy9yZXBsYWNlIGxhbmd1YWdlcyBpbiAnZXR5bCcgdGFnc1xuICAgIGlmICh0bXBsLm1hdGNoKC9eXFx7XFx7ZXR5bFxcfC8pKSB7XG4gICAgICAvL2RvZXNuJ3Qgc3VwcG9ydCBtdWx0aXBsZS1vbmVzIHBlciBzZW50ZW5jZS4uXG4gICAgICB2YXIgbGFuZyA9ICh0bXBsLm1hdGNoKC9eXFx7XFx7ZXR5bFxcfCguKj8pXFx8Lio/XFx9XFx9L2kpIHx8IFtdKVsxXSB8fCAnJztcbiAgICAgIGxhbmcgPSBsYW5nLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAobGFuZyAmJiBsYW5ndWFnZXNbbGFuZ10pIHtcbiAgICAgICAgdG1wbCA9IHRtcGwucmVwbGFjZSgvXlxce1xce2V0eWxcXHwoLio/KVxcfC4qP1xcfVxcfS9naSwgbGFuZ3VhZ2VzW2xhbmddLmVuZ2xpc2hfdGl0bGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG1wbCA9IHRtcGwucmVwbGFjZSgvXlxce1xce2V0eWxcXHwoLio/KVxcfC4qP1xcfVxcfS9naSwgJygkMSknKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRtcGw7XG4gIH0pO1xuICAvL2ZsYXRsaXN0IC0+IGNvbW1hcyAgLS0gaGxpc3Q/XG4gIHdpa2kgPSB3aWtpLnJlcGxhY2UoL1xce1xceyhmbGF0bGlzdHxobGlzdCkgP1xcfChbXn1dKylcXH1cXH0vZ2ksIGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAgICBsZXQgYXJyID0gYy5zcGxpdCgvXFxzK1sqIF0rPyA/L2cpO1xuICAgIGFyciA9IGFyci5maWx0ZXIobGluZSA9PiBsaW5lKTtcbiAgICByZXR1cm4gYXJyLmpvaW4oJywgJyk7XG4gIH0pO1xuICAvL3BsYWlubGlzdCAtPiBuZXdsaW5lc1xuICB3aWtpID0gd2lraS5yZXBsYWNlKC9cXHtcXHsocGxhaW5saXN0fHVibGlzdHx1bmJ1bGxldGVkIGxpc3QpID9cXHwoW159XSspXFx9XFx9L2dpLCBmdW5jdGlvbihhLCBiLCBjKSB7XG4gICAgbGV0IGFyciA9IGMuc3BsaXQoL1xccytbKiBdKz8gPy9nKTtcbiAgICBhcnIgPSBhcnIuZmlsdGVyKGxpbmUgPT4gbGluZSk7XG4gICAgcmV0dXJuIGFyci5qb2luKCcsICcpO1xuICB9KTtcbiAgLy8gdG1wbCA9IHRtcGwucmVwbGFjZSgvXFx7XFx7ZmxhdGxpc3RcXHwoW1xcc1xcU10qPykoXFx8W1xcc1xcU10qPyk/XFx9XFx9L2dpLCAnJDEnKTtcbiAgcmV0dXJuIHdpa2k7XG59O1xuLy8gY29uc29sZS5sb2cod29yZF90ZW1wbGF0ZXMoXCJoZWxsbyB7e0NVUlJFTlREQVl9fSB3b3JsZFwiKSlcbi8vIGNvbnNvbGUubG9nKHdvcmRfdGVtcGxhdGVzKFwiaGVsbG8ge3tDVVJSRU5UTU9OVEh9fSB3b3JsZFwiKSlcbi8vIGNvbnNvbGUubG9nKHdvcmRfdGVtcGxhdGVzKFwiaGVsbG8ge3tDVVJSRU5UWUVBUn19IHdvcmxkXCIpKVxuLy8gY29uc29sZS5sb2cod29yZF90ZW1wbGF0ZXMoXCJoZWxsbyB7e0xPQ0FMREFZTkFNRX19IHdvcmxkXCIpKVxuLy8gY29uc29sZS5sb2cod29yZF90ZW1wbGF0ZXMoXCJoZWxsbyB7e2xjOjg4fX0gd29ybGRcIikpXG4vLyBjb25zb2xlLmxvZyh3b3JkX3RlbXBsYXRlcyhcImhlbGxvIHt7cHVsbCBxdW90ZXxMaWZlIGlzIGxpa2VcXG58YXV0aG9yPVtbYXNkZl1dfX0gd29ybGRcIikpXG4vLyBjb25zb2xlLmxvZyh3b3JkX3RlbXBsYXRlcyhcImhpIHt7ZXR5bHxsYXwtfX0gdGhlcmVcIikpXG4vLyBjb25zb2xlLmxvZyh3b3JkX3RlbXBsYXRlcyhcInt7ZXR5bHxsYXwtfX0gY29nbmF0ZSB3aXRoIHt7ZXR5bHxpc3wtfX0ge3t0ZXJtfGh1Z2dhfHx0byBjb21mb3J0fGxhbmc9aXN9fSxcIikpXG5cbm1vZHVsZS5leHBvcnRzID0gd29yZF90ZW1wbGF0ZXM7XG4iLCJjb25zdCBmbnMgPSByZXF1aXJlKCcuLi8uLi9saWIvaGVscGVycycpO1xuY29uc3QgaGVhZGluZ19yZWcgPSAvXig9ezEsNX0pKFtePV17MSwyMDB9Pyk9ezEsNX0kLztcblxuLy9pbnRlcnByZXQgZGVwdGgsIHRpdGxlIG9mIGhlYWRpbmdzIGxpa2UgJz09U2VlIGFsc289PSdcbmNvbnN0IHBhcnNlSGVhZGluZyA9IGZ1bmN0aW9uKHIsIHN0cikge1xuICBsZXQgaGVhZGluZyA9IHN0ci5tYXRjaChoZWFkaW5nX3JlZyk7XG4gIGlmICghaGVhZGluZykge1xuICAgIHJldHVybiB7XG4gICAgICB0aXRsZTogJycsXG4gICAgICBkZXB0aDogMFxuICAgIH07XG4gIH1cbiAgbGV0IHRpdGxlID0gaGVhZGluZ1syXSB8fCAnJztcbiAgdGl0bGUgPSBmbnMudHJpbV93aGl0ZXNwYWNlKHRpdGxlKTtcbiAgbGV0IGRlcHRoID0gMTtcbiAgaWYgKGhlYWRpbmdbMV0pIHtcbiAgICBkZXB0aCA9IGhlYWRpbmdbMV0ubGVuZ3RoIC0gMTtcbiAgfVxuICByLnRpdGxlID0gdGl0bGU7XG4gIHIuZGVwdGggPSBkZXB0aDtcbiAgcmV0dXJuIHI7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBwYXJzZUhlYWRpbmc7XG4iLCJjb25zdCBIYXNoZXMgPSByZXF1aXJlKCdqc2hhc2hlcycpO1xuY29uc3QgaTE4biA9IHJlcXVpcmUoJy4uLy4uLy4uL2RhdGEvaTE4bicpO1xuY29uc3QgZmlsZV9yZWcgPSBuZXcgUmVnRXhwKCcoJyArIGkxOG4uaW1hZ2VzLmNvbmNhdChpMThuLmZpbGVzKS5qb2luKCd8JykgKyAnKTouKj9bXFxcXHxcXFxcXV0nLCAnaScpO1xuXG4vL3RoZSB3aWtpbWVkaWEgaW1hZ2UgdXJsIGlzIGEgbGl0dGxlIHNpbGx5OlxuLy9odHRwczovL2NvbW1vbnMud2lraW1lZGlhLm9yZy93aWtpL0NvbW1vbnM6RkFRI1doYXRfYXJlX3RoZV9zdHJhbmdlbHlfbmFtZWRfY29tcG9uZW50c19pbl9maWxlX3BhdGhzLjNGXG5jb25zdCBtYWtlX2ltYWdlID0gZnVuY3Rpb24oZmlsZSkge1xuICBsZXQgdGl0bGUgPSBmaWxlLnJlcGxhY2UoL14oaW1hZ2V8ZmlsZT8pXFw6L2ksICcnKTtcbiAgLy90aXRsZWNhc2UgaXRcbiAgdGl0bGUgPSB0aXRsZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRpdGxlLnN1YnN0cmluZygxKTtcbiAgLy9zcGFjZXMgdG8gdW5kZXJzY29yZXNcbiAgdGl0bGUgPSB0aXRsZS5yZXBsYWNlKC8gL2csICdfJyk7XG5cbiAgbGV0IGhhc2ggPSBuZXcgSGFzaGVzLk1ENSgpLmhleCh0aXRsZSk7XG4gIGxldCBwYXRoID0gaGFzaC5zdWJzdHIoMCwgMSkgKyAnLycgKyBoYXNoLnN1YnN0cigwLCAyKSArICcvJztcbiAgdGl0bGUgPSBlbmNvZGVVUklDb21wb25lbnQodGl0bGUpO1xuICBwYXRoICs9IHRpdGxlO1xuICBsZXQgc2VydmVyID0gJ2h0dHBzOi8vdXBsb2FkLndpa2ltZWRpYS5vcmcvd2lraXBlZGlhL2NvbW1vbnMvJztcbiAgbGV0IHRodW1iID0gJy8zMDBweC0nICsgdGl0bGU7XG4gIHJldHVybiB7XG4gICAgdXJsOiBzZXJ2ZXIgKyBwYXRoLFxuICAgIGZpbGU6IGZpbGUsXG4gICAgdGh1bWI6IHNlcnZlciArICd0aHVtYi8nICsgcGF0aCArIHRodW1iXG4gIH07XG59O1xuXG4vL2ltYWdlcyBhcmUgdXN1YWxseSBbW2ltYWdlOm15X3BpYy5qcGddXVxuY29uc3QgcGFyc2VfaW1hZ2UgPSBmdW5jdGlvbihpbWcpIHtcbiAgaW1nID0gaW1nLm1hdGNoKGZpbGVfcmVnKSB8fCBbJyddO1xuICBpbWcgPSBpbWdbMF0ucmVwbGFjZSgvW1xcfFxcXV0kLywgJycpO1xuICAvL2FkZCB1cmwsIGV0YyB0byBpbWFnZVxuICBpbWcgPSBtYWtlX2ltYWdlKGltZyk7XG4gIHJldHVybiBpbWc7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBwYXJzZV9pbWFnZTtcblxuLy8gY29uc29sZS5sb2cocGFyc2VfaW1hZ2UoXCJbW2ltYWdlOm15X3BpYy5qcGddXVwiKSk7XG4iLCJjb25zdCBpMThuID0gcmVxdWlyZSgnLi4vLi4vLi4vZGF0YS9pMThuJyk7XG5jb25zdCBmaW5kX3JlY3Vyc2l2ZSA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYi9yZWN1cnNpdmVfbWF0Y2gnKTtcbmNvbnN0IHBhcnNlX2ltYWdlID0gcmVxdWlyZSgnLi9pbWFnZScpO1xuY29uc3QgZmlsZVJlZ2V4ID0gbmV3IFJlZ0V4cCgnKCcgKyBpMThuLmltYWdlcy5jb25jYXQoaTE4bi5maWxlcykuam9pbignfCcpICsgJyk6Lio/W1xcXFx8XFxcXF1dJywgJ2knKTtcblxuY29uc3QgcGFyc2VJbWFnZXMgPSBmdW5jdGlvbihyLCB3aWtpLCBvcHRpb25zKSB7XG4gIC8vc2Vjb25kLCByZW1vdmUgW1tmaWxlOi4uLltbXV0gXV0gcmVjdXJzaW9uc1xuICBsZXQgbWF0Y2hlcyA9IGZpbmRfcmVjdXJzaXZlKCdbJywgJ10nLCB3aWtpKTtcbiAgbWF0Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICBpZiAocy5tYXRjaChmaWxlUmVnZXgpKSB7XG4gICAgICByLmltYWdlcyA9IHIuaW1hZ2VzIHx8IFtdO1xuICAgICAgaWYgKG9wdGlvbnMuaW1hZ2VzICE9PSBmYWxzZSkge1xuICAgICAgICByLmltYWdlcy5wdXNoKHBhcnNlX2ltYWdlKHMpKTtcbiAgICAgIH1cbiAgICAgIHdpa2kgPSB3aWtpLnJlcGxhY2UocywgJycpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy90aGlyZCwgd2lrdGlvbmFyeS1zdHlsZSBpbnRlcmxhbmd1YWdlIGxpbmtzXG4gIG1hdGNoZXMuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgaWYgKHMubWF0Y2goL1xcW1xcWyhbYS16XSspOiguKj8pXFxdXFxdL2kpICE9PSBudWxsKSB7XG4gICAgICBsZXQgc2l0ZSA9IChzLm1hdGNoKC9cXFtcXFsoW2Etel0rKTovaSkgfHwgW10pWzFdIHx8ICcnO1xuICAgICAgc2l0ZSA9IHNpdGUudG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmIChzaXRlICYmIGkxOG4uZGljdGlvbmFyeVtzaXRlXSA9PT0gdW5kZWZpbmVkICYmICEob3B0aW9ucy5uYW1lc3BhY2UgIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLm5hbWVzcGFjZSA9PT0gc2l0ZSkpIHtcbiAgICAgICAgci5pbnRlcndpa2kgPSByLmludGVyd2lraSB8fCB7fTtcbiAgICAgICAgci5pbnRlcndpa2lbc2l0ZV0gPSAocy5tYXRjaCgvXFxbXFxbKFthLXpdKyk6KC4qPylcXF1cXF0vaSkgfHwgW10pWzJdO1xuICAgICAgICB3aWtpID0gd2lraS5yZXBsYWNlKHMsICcnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gd2lraTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlSW1hZ2VzO1xuIiwiLy9pbnRlcnByZXQgPT1oZWFkaW5nPT0gbGluZXNcbmNvbnN0IHBhcnNlID0ge1xuICBoZWFkaW5nOiByZXF1aXJlKCcuL2hlYWRpbmcnKSxcbiAgbGlzdDogcmVxdWlyZSgnLi9saXN0JyksXG4gIGltYWdlOiByZXF1aXJlKCcuL2ltYWdlJyksXG4gIHRhYmxlOiByZXF1aXJlKCcuL3RhYmxlJyksXG4gIC8vIHRlbXBsYXRlczogcmVxdWlyZSgnLi9zZWN0aW9uX3RlbXBsYXRlcycpLFxuICBlYWNoU2VudGVuY2U6IHJlcXVpcmUoJy4vc2VudGVuY2UnKS5lYWNoU2VudGVuY2Vcbn07XG5jb25zdCBzZWN0aW9uX3JlZyA9IC9bXFxuXl0oPXsxLDV9W149XXsxLDIwMH0/PXsxLDV9KS9nO1xuXG5jb25zdCBwYXJzZVNlY3Rpb24gPSBmdW5jdGlvbihzZWN0aW9uLCB3aWtpLCByLCBvcHRpb25zKSB7XG4gIC8vIC8vcGFyc2UgdGhlIHRhYmxlc1xuICB3aWtpID0gcGFyc2UudGFibGUoc2VjdGlvbiwgd2lraSk7XG4gIC8vIC8vcGFyc2UgdGhlIGxpc3RzXG4gIHdpa2kgPSBwYXJzZS5saXN0KHNlY3Rpb24sIHdpa2kpO1xuICAvLyAvL3BhcnNlK3JlbW92ZSBzY2FyeSAnW1sgW1tdXSBdXScgc3R1ZmZcbiAgd2lraSA9IHBhcnNlLmltYWdlKHNlY3Rpb24sIHdpa2ksIG9wdGlvbnMpO1xuICAvL2RvIGVhY2ggc2VudGVuY2VcbiAgd2lraSA9IHBhcnNlLmVhY2hTZW50ZW5jZShzZWN0aW9uLCB3aWtpKTtcbiAgLy9zdXBvcHJ0ZWQgdGhpbmdzIGxpa2Uge3ttYWlufX1cbiAgLy8gd2lraSA9IHBhcnNlLnRlbXBsYXRlcyhzZWN0aW9uLCB3aWtpLCByKTtcbiAgLy8gc2VjdGlvbi53aWtpID0gd2lraTtcbiAgcmV0dXJuIHNlY3Rpb247XG59O1xuXG5jb25zdCBtYWtlU2VjdGlvbnMgPSBmdW5jdGlvbihyLCB3aWtpLCBvcHRpb25zKSB7XG4gIGxldCBzcGxpdCA9IHdpa2kuc3BsaXQoc2VjdGlvbl9yZWcpOyAvLy5maWx0ZXIocyA9PiBzKTtcbiAgbGV0IHNlY3Rpb25zID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3BsaXQubGVuZ3RoOyBpICs9IDIpIHtcbiAgICBsZXQgdGl0bGUgPSBzcGxpdFtpIC0gMV0gfHwgJyc7XG4gICAgbGV0IHR4dCA9IHNwbGl0W2ldIHx8ICcnO1xuICAgIGxldCBzZWN0aW9uID0ge1xuICAgICAgdGl0bGU6ICcnLFxuICAgICAgZGVwdGg6IG51bGxcbiAgICB9O1xuICAgIHNlY3Rpb24gPSBwYXJzZS5oZWFkaW5nKHNlY3Rpb24sIHRpdGxlKTtcbiAgICBzZWN0aW9uID0gcGFyc2VTZWN0aW9uKHNlY3Rpb24sIHR4dCwgciwgb3B0aW9ucyk7XG4gICAgc2VjdGlvbnMucHVzaChzZWN0aW9uKTtcbiAgfVxuICByZXR1cm4gc2VjdGlvbnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2VTZWN0aW9ucztcbiIsImNvbnN0IGxpc3RfcmVnID0gL15bI1xcKjo7XFx8XSsvO1xuY29uc3QgYnVsbGV0X3JlZyA9IC9eXFwqK1teOixcXHxdezR9LztcbmNvbnN0IG51bWJlcl9yZWcgPSAvXiA/XFwjW146LFxcfF17NH0vO1xuY29uc3QgaGFzX3dvcmQgPSAvW2Etel0vaTtcbmNvbnN0IHBhcnNlTGluZSA9IHJlcXVpcmUoJy4vc2VudGVuY2UvJykucGFyc2VMaW5lO1xuXG4vLyBkb2VzIGl0IHN0YXJ0IHdpdGggYSBidWxsZXQgcG9pbnQgb3Igc29tZXRoaW5nP1xuY29uc3QgaXNMaXN0ID0gZnVuY3Rpb24obGluZSkge1xuICByZXR1cm4gbGlzdF9yZWcudGVzdChsaW5lKSB8fCBidWxsZXRfcmVnLnRlc3QobGluZSkgfHwgbnVtYmVyX3JlZy50ZXN0KGxpbmUpO1xufTtcblxuLy9tYWtlIGJ1bGxldHMvbnVtYmVycyBpbnRvIGh1bWFuLXJlYWRhYmxlIConc1xuY29uc3QgY2xlYW5MaXN0ID0gZnVuY3Rpb24obGlzdCkge1xuICBsZXQgbnVtYmVyID0gMTtcbiAgbGlzdCA9IGxpc3QuZmlsdGVyKGwgPT4gbCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBsaW5lID0gbGlzdFtpXTtcbiAgICAvL2FkZCAjIG51bWJlcmluZ3MgZm9ybWF0dGluZ1xuICAgIGlmIChsaW5lLm1hdGNoKG51bWJlcl9yZWcpKSB7XG4gICAgICBsaW5lID0gbGluZS5yZXBsYWNlKC9eID8jKi8sIG51bWJlciArICcpICcpO1xuICAgICAgbGluZSA9IGxpbmUgKyAnXFxuJztcbiAgICAgIG51bWJlciArPSAxO1xuICAgIH0gZWxzZSBpZiAobGluZS5tYXRjaChsaXN0X3JlZykpIHtcbiAgICAgIG51bWJlciA9IDE7XG4gICAgICBsaW5lID0gbGluZS5yZXBsYWNlKGxpc3RfcmVnLCAnJyk7XG4gICAgfVxuICAgIGxpc3RbaV0gPSBwYXJzZUxpbmUobGluZSk7XG4gIH1cbiAgcmV0dXJuIGxpc3Q7XG59O1xuXG5jb25zdCBncmFiTGlzdCA9IGZ1bmN0aW9uKGxpbmVzLCBpKSB7XG4gIGxldCBzdWIgPSBbXTtcbiAgZm9yIChsZXQgbyA9IGk7IG8gPCBsaW5lcy5sZW5ndGg7IG8rKykge1xuICAgIGlmIChpc0xpc3QobGluZXNbb10pKSB7XG4gICAgICBzdWIucHVzaChsaW5lc1tvXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBzdWIgPSBzdWIuZmlsdGVyKGEgPT4gYSAmJiBoYXNfd29yZC50ZXN0KGEpKTtcbiAgc3ViID0gY2xlYW5MaXN0KHN1Yik7XG4gIHJldHVybiBzdWI7XG59O1xuXG5jb25zdCBwYXJzZUxpc3QgPSBmdW5jdGlvbihyLCB3aWtpKSB7XG4gIGxldCBsaW5lcyA9IHdpa2kuc3BsaXQoL1xcbi9nKTtcbiAgbGluZXMgPSBsaW5lcy5maWx0ZXIobCA9PiBoYXNfd29yZC50ZXN0KGwpKTtcbiAgbGV0IGxpc3RzID0gW107XG4gIGxldCB0aGVSZXN0ID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoaXNMaXN0KGxpbmVzW2ldKSAmJiBsaW5lc1tpICsgMV0gJiYgaXNMaXN0KGxpbmVzW2kgKyAxXSkpIHtcbiAgICAgIGxldCBzdWIgPSBncmFiTGlzdChsaW5lcywgaSk7XG4gICAgICBpZiAoc3ViLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGlzdHMucHVzaChzdWIpO1xuICAgICAgICBpICs9IHN1Yi5sZW5ndGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoZVJlc3QucHVzaChsaW5lc1tpXSk7XG4gICAgfVxuICB9XG4gIGlmIChsaXN0cy5sZW5ndGggPiAwKSB7XG4gICAgci5saXN0cyA9IGxpc3RzO1xuICB9XG4gIHJldHVybiB0aGVSZXN0LmpvaW4oJ1xcbicpO1xufTtcbm1vZHVsZS5leHBvcnRzID0gcGFyc2VMaXN0O1xuIiwiXG4vL1xuY29uc3QgZm9ybWF0dGluZyA9IGZ1bmN0aW9uKG9iaikge1xuICBsZXQgYm9sZHMgPSBbXTtcbiAgbGV0IGl0YWxpY3MgPSBbXTtcbiAgbGV0IHdpa2kgPSBvYmoudGV4dCB8fCAnJztcbiAgLy9ib2xkIGFuZCBpdGFsaWNzIGNvbWJpbmVkIDUgJ3NcbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvJyd7NH0oW14nXXswLDIwMH0pJyd7NH0vZywgKGEsIGIpID0+IHtcbiAgICBib2xkcy5wdXNoKGIpO1xuICAgIGl0YWxpY3MucHVzaChiKTtcbiAgICByZXR1cm4gYjtcbiAgfSk7XG4gIC8vJycnYm9sZCcnJ1xuICB3aWtpID0gd2lraS5yZXBsYWNlKC8nJ3syfShbXiddezAsMjAwfSknJ3syfS9nLCAoYSwgYikgPT4ge1xuICAgIGJvbGRzLnB1c2goYik7XG4gICAgcmV0dXJuIGI7XG4gIH0pO1xuICAvLycnaXRhbGljJydcbiAgd2lraSA9IHdpa2kucmVwbGFjZSgvJycoW14nXXswLDIwMH0pJycvZywgKGEsIGIpID0+IHtcbiAgICBpdGFsaWNzLnB1c2goYik7XG4gICAgcmV0dXJuIGI7XG4gIH0pO1xuXG4gIC8vcGFjayBpdCBhbGwgdXAuLlxuICBvYmoudGV4dCA9IHdpa2k7XG4gIG9iai5mbXQgPSB7fTtcbiAgaWYgKGJvbGRzLmxlbmd0aCA+IDApIHtcbiAgICBvYmouZm10LmJvbGQgPSBib2xkcztcbiAgfVxuICBpZiAoaXRhbGljcy5sZW5ndGggPiAwKSB7XG4gICAgb2JqLmZtdC5pdGFsaWMgPSBpdGFsaWNzO1xuICB9XG4gIHJldHVybiBvYmo7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBmb3JtYXR0aW5nO1xuIiwiY29uc3QgaGVscGVycyA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYi9oZWxwZXJzJyk7XG5jb25zdCBwYXJzZUxpbmtzID0gcmVxdWlyZSgnLi9saW5rcycpO1xuY29uc3QgcGFyc2VGbXQgPSByZXF1aXJlKCcuL2Zvcm1hdHRpbmcnKTtcbmNvbnN0IHRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzJyk7XG5jb25zdCBzZW50ZW5jZVBhcnNlciA9IHJlcXVpcmUoJy4vc2VudGVuY2UtcGFyc2VyJyk7XG5jb25zdCBpMThuID0gcmVxdWlyZSgnLi4vLi4vLi4vZGF0YS9pMThuJyk7XG5jb25zdCBjYXRfcmVnID0gbmV3IFJlZ0V4cCgnXFxcXFtcXFxcWzo/KCcgKyBpMThuLmNhdGVnb3JpZXMuam9pbignfCcpICsgJyk6W15cXFxcXVxcXFxdXXsyLDgwfVxcXFxdXFxcXF0nLCAnZ2knKTtcblxuLy9yZXR1cm4gb25seSByZW5kZXJlZCB0ZXh0IG9mIHdpa2kgbGlua3NcbmNvbnN0IHJlc29sdmVfbGlua3MgPSBmdW5jdGlvbihsaW5lKSB7XG4gIC8vIGNhdGVnb3JpZXMsIGltYWdlcywgZmlsZXNcbiAgbGluZSA9IGxpbmUucmVwbGFjZShjYXRfcmVnLCAnJyk7XG4gIC8vIFtbQ29tbW9uIGxpbmtzXV1cbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFxbXFxbOj8oW158XXsyLDgwfT8pXFxdXFxdKFxcd3swLDV9KS9nLCAnJDEkMicpO1xuICAvLyBbW0ZpbGU6d2l0aHxTaXplXV1cbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFxbXFxbRmlsZTo/KC57Miw4MH0/KVxcfChbXlxcXV0rPylcXF1cXF0oXFx3ezAsNX0pL2csICckMScpO1xuICAvLyBbW1JlcGxhY2VkfExpbmtzXV1cbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFxbXFxbOj8oLnsyLDgwfT8pXFx8KFteXFxdXSs/KVxcXVxcXShcXHd7MCw1fSkvZywgJyQyJDMnKTtcbiAgLy8gRXh0ZXJuYWwgbGlua3NcbiAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFxbKGh0dHBzP3xuZXdzfGZ0cHxtYWlsdG98Z29waGVyfGlyYyk6XFwvXFwvW15cXF1cXHwgXXs0LDE1MDB9KFtcXHwgXS4qPyk/XFxdL2csICckMicpO1xuICByZXR1cm4gbGluZTtcbn07XG4vLyBjb25zb2xlLmxvZyhyZXNvbHZlX2xpbmtzKFwiW2h0dHA6Ly93d3cud2hpc3RsZXIuY2Egd3d3LndoaXN0bGVyLmNhXVwiKSlcblxuZnVuY3Rpb24gcG9zdHByb2Nlc3MobGluZSkge1xuICAvL2ZpeCBsaW5rc1xuICBsaW5lID0gcmVzb2x2ZV9saW5rcyhsaW5lKTtcbiAgLy9vb3BzLCByZWN1cnNpdmUgaW1hZ2UgYnVnXG4gIGlmIChsaW5lLm1hdGNoKC9eKHRodW1ifHJpZ2h0fGxlZnQpXFx8L2kpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgbGluZSA9IGhlbHBlcnMudHJpbV93aGl0ZXNwYWNlKGxpbmUpO1xuICByZXR1cm4gbGluZTtcbn1cblxuZnVuY3Rpb24gcGFyc2VMaW5lKGxpbmUpIHtcbiAgbGV0IG9iaiA9IHtcbiAgICB0ZXh0OiBwb3N0cHJvY2VzcyhsaW5lKVxuICB9O1xuICAvL3B1bGwtb3V0IHRoZSBbW2xpbmtzXV1cbiAgbGV0IGxpbmtzID0gcGFyc2VMaW5rcyhsaW5lKTtcbiAgaWYgKGxpbmtzKSB7XG4gICAgb2JqLmxpbmtzID0gbGlua3M7XG4gIH1cbiAgLy9wdWxsLW91dCB0aGUgYm9sZHMgYW5kICcnaXRhbGljcycnXG4gIG9iaiA9IHBhcnNlRm10KG9iaik7XG4gIC8vcHVsbC1vdXQgdGhpbmdzIGxpa2Uge3tzdGFydCBkYXRlfC4uLn19XG4gIG9iaiA9IHRlbXBsYXRlcyhvYmopO1xuICByZXR1cm4gb2JqO1xufVxuXG5jb25zdCBwYXJzZVNlbnRlbmNlcyA9IGZ1bmN0aW9uKHIsIHdpa2kpIHtcbiAgbGV0IHNlbnRlbmNlcyA9IHNlbnRlbmNlUGFyc2VyKHdpa2kpO1xuICBzZW50ZW5jZXMgPSBzZW50ZW5jZXMubWFwKHBhcnNlTGluZSk7XG4gIHIuc2VudGVuY2VzID0gc2VudGVuY2VzO1xuICByZXR1cm4gcjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBlYWNoU2VudGVuY2U6IHBhcnNlU2VudGVuY2VzLFxuICBwYXJzZUxpbmU6IHBhcnNlTGluZVxufTtcbiIsImNvbnN0IGhlbHBlcnMgPSByZXF1aXJlKCcuLi8uLi8uLi9saWIvaGVscGVycycpO1xuY29uc3QgaWdub3JlX2xpbmtzID0gL146PyhjYXRlZ29yeXxjYXTDqWdvcmllfEthdGVnb3JpZXxDYXRlZ29yw61hfENhdGVnb3JpYXxDYXRlZ29yaWV8S2F0ZWdvcmlhfNiq2LXZhtmK2YF8aW1hZ2V8ZmlsZXxpbWFnZXxmaWNoaWVyfGRhdGVpfG1lZGlhfHNwZWNpYWx8d3B8d2lraXBlZGlhfGhlbHB8dXNlcnxtZWRpYXdpa2l8cG9ydGFsfHRhbGt8dGVtcGxhdGV8Ym9va3xkcmFmdHxtb2R1bGV8dG9waWN8d2lrdGlvbmFyeXx3aWtpc291cmNlKTovaTtcbmNvbnN0IGV4dGVybmFsX2xpbmsgPSAvXFxbKGh0dHBzP3xuZXdzfGZ0cHxtYWlsdG98Z29waGVyfGlyYykoOlxcL1xcL1teXFxdXFx8IF17NCwxNTAwfSkoW1xcfCBdLio/KT9cXF0vZztcbmNvbnN0IGxpbmtfcmVnID0gL1xcW1xcWyguezIsODB9PylcXF1cXF0oW2EteiddKyk/KFxcd3swLDEwfSkvZ2k7IC8vYWxsb3cgZGFuZ2xpbmcgc3VmZml4ZXMgLSBcIltbZmxhbmRlcnNdXSdzXCJcblxuY29uc3QgZXh0ZXJuYWxfbGlua3MgPSBmdW5jdGlvbihsaW5rcywgc3RyKSB7XG4gIHN0ci5yZXBsYWNlKGV4dGVybmFsX2xpbmssIGZ1bmN0aW9uKGFsbCwgcHJvdG9jb2wsIGxpbmssIHRleHQpIHtcbiAgICB0ZXh0ID0gdGV4dCB8fCAnJztcbiAgICBsaW5rcy5wdXNoKHtcbiAgICAgIHR5cGU6ICdleHRlcm5hbCcsXG4gICAgICBzaXRlOiBwcm90b2NvbCArIGxpbmssXG4gICAgICB0ZXh0OiB0ZXh0LnRyaW0oKVxuICAgIH0pO1xuICAgIHJldHVybiB0ZXh0O1xuICB9KTtcbiAgcmV0dXJuIGxpbmtzO1xufTtcblxuY29uc3QgaW50ZXJuYWxfbGlua3MgPSBmdW5jdGlvbihsaW5rcywgc3RyKSB7XG4gIC8vcmVndWxhciBsaW5rc1xuICBzdHIucmVwbGFjZShsaW5rX3JlZywgZnVuY3Rpb24oXywgcywgYXBvc3Ryb3BoZSkge1xuICAgIHZhciBsaW5rLFxuICAgICAgdHh0O1xuICAgIGlmIChzLm1hdGNoKC9cXHwvKSkge1xuICAgICAgLy9yZXBsYWNlbWVudCBsaW5rIFtbbGlua3x0ZXh0XV1cbiAgICAgIHMgPSBzLnJlcGxhY2UoL1xcW1xcWyguezIsODB9PylcXF1cXF0oXFx3ezAsMTB9KS9nLCAnJDEkMicpOyAvL3JlbW92ZSBbJ3MgYW5kIGtlZXAgc3VmZml4XG4gICAgICBsaW5rID0gcy5yZXBsYWNlKC8oLnsyLDYwfSlcXHwuezAsMjAwfS8sICckMScpOyAvL3JlcGxhY2VkIGxpbmtzXG4gICAgICB0eHQgPSBzLnJlcGxhY2UoLy57Miw2MH0/XFx8LywgJycpO1xuICAgICAgLy9oYW5kbGUgZnVua3kgY2FzZSBvZiBbW3Rvcm9udG98XV1cbiAgICAgIGlmICghdHh0ICYmIGxpbmsubWF0Y2goL1xcfCQvKSkge1xuICAgICAgICBsaW5rID0gbGluay5yZXBsYWNlKC9cXHwkLywgJycpO1xuICAgICAgICB0eHQgPSBsaW5rO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzdGFuZGFyZCBsaW5rIFtbbGlua11dXG4gICAgICBsaW5rID0gcy5yZXBsYWNlKC9cXFtcXFsoLnsyLDYwfT8pXFxdXFxdKFxcd3swLDEwfSkvZywgJyQxJyk7IC8vcmVtb3ZlIFsnc1xuICAgIH1cbiAgICAvL2tpbGwgb2ZmIG5vbi13aWtpcGVkaWEgbmFtZXNwYWNlc1xuICAgIGlmIChsaW5rLm1hdGNoKGlnbm9yZV9saW5rcykpIHtcbiAgICAgIHJldHVybiBzO1xuICAgIH1cbiAgICAvL2tpbGwgb2ZmIGp1c3QgYW5jaG9yIGxpbmtzIFtbI2hpc3RvcnldXVxuICAgIGlmIChsaW5rLm1hdGNoKC9eIy9pKSkge1xuICAgICAgcmV0dXJuIHM7XG4gICAgfVxuICAgIC8vcmVtb3ZlIGFuY2hvcnMgZnJvbSBlbmQgW1t0b3JvbnRvI2hpc3RvcnldXVxuICAgIGxpbmsgPSBsaW5rLnJlcGxhY2UoLyNbXiBdezEsMTAwfS8sICcnKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgcGFnZTogaGVscGVycy5jYXBpdGFsaXNlKGxpbmspLFxuICAgICAgdGV4dDogdHh0IHx8IGxpbmtcbiAgICB9O1xuICAgIC8vZmluYWxseSwgc3VwcG9ydCBbW2xpbmtdXSdzIGFwb3N0cm9waGVcbiAgICBpZiAoYXBvc3Ryb3BoZSkge1xuICAgICAgb2JqLnRleHQgKz0gYXBvc3Ryb3BoZTtcbiAgICB9XG4gICAgbGlua3MucHVzaChvYmopO1xuICAgIHJldHVybiBzO1xuICB9KTtcbiAgcmV0dXJuIGxpbmtzO1xufTtcblxuLy9ncmFiIGFuIGFycmF5IG9mIGludGVybmFsIGxpbmtzIGluIHRoZSB0ZXh0XG5jb25zdCBwYXJzZV9saW5rcyA9IGZ1bmN0aW9uKHN0cikge1xuICBsZXQgbGlua3MgPSBbXTtcbiAgLy9maXJzdCwgcGFyc2UgZXh0ZXJuYWwgbGlua3NcbiAgbGlua3MgPSBleHRlcm5hbF9saW5rcyhsaW5rcywgc3RyKTtcbiAgLy9pbnRlcm5hbCBsaW5rc1xuICBsaW5rcyA9IGludGVybmFsX2xpbmtzKGxpbmtzLCBzdHIpO1xuXG4gIGlmIChsaW5rcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHJldHVybiBsaW5rcztcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlX2xpbmtzO1xuIiwiLy9zcGxpdCB0ZXh0IGludG8gc2VudGVuY2VzLCB1c2luZyByZWdleFxuLy9Ac3BlbmNlcm1vdW50YWluIE1JVFxuXG4vLyhSdWxlLWJhc2VkIHNlbnRlbmNlIGJvdW5kYXJ5IHNlZ21lbnRhdGlvbikgLSBjaG9wIGdpdmVuIHRleHQgaW50byBpdHMgcHJvcGVyIHNlbnRlbmNlcy5cbi8vIElnbm9yZSBwZXJpb2RzL3F1ZXN0aW9ucy9leGNsYW1hdGlvbnMgdXNlZCBpbiBhY3Jvbnltcy9hYmJyZXZpYXRpb25zL251bWJlcnMsIGV0Yy5cbi8vIEBzcGVuY2VybW91bnRhaW4gMjAxNSBNSVRcbid1c2Ugc3RyaWN0JztcbmNvbnN0IGFiYnJldmlhdGlvbnMgPSByZXF1aXJlKCcuLi8uLi8uLi9kYXRhL2FiYnJldmlhdGlvbnMnKTtcbmNvbnN0IGFiYnJldl9yZWcgPSBuZXcgUmVnRXhwKCcoXnwgKSgnICsgYWJicmV2aWF0aW9ucy5qb2luKCd8JykgKyAnKVsuIT9dID8kJywgJ2knKTtcbmNvbnN0IGFjcm9ueW1fcmVnID0gbmV3IFJlZ0V4cCgnWyB8Ll1bQS1aXS4/ICs/JCcsICdpJyk7XG5jb25zdCBlbGlwc2VzX3JlZyA9IG5ldyBSZWdFeHAoJ1xcXFwuXFxcXC5cXFxcLiogKz8kJyk7XG5jb25zdCBoYXNXb3JkID0gbmV3IFJlZ0V4cCgnW2Etel1bYS16XScsICdpJyk7XG5cbi8vdHVybiBhIG5lc3RlZCBhcnJheSBpbnRvIG9uZSBhcnJheVxuY29uc3QgZmxhdHRlbiA9IGZ1bmN0aW9uKGFycikge1xuICBsZXQgYWxsID0gW107XG4gIGFyci5mb3JFYWNoKGZ1bmN0aW9uKGEpIHtcbiAgICBhbGwgPSBhbGwuY29uY2F0KGEpO1xuICB9KTtcbiAgcmV0dXJuIGFsbDtcbn07XG5cbmNvbnN0IG5haWl2ZV9zcGxpdCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgLy9maXJzdCwgc3BsaXQgYnkgbmV3bGluZVxuICBsZXQgc3BsaXRzID0gdGV4dC5zcGxpdCgvKFxcbispLyk7XG4gIHNwbGl0cyA9IHNwbGl0cy5maWx0ZXIocyA9PiBzLm1hdGNoKC9cXFMvKSk7XG4gIC8vc3BsaXQgYnkgcGVyaW9kLCBxdWVzdGlvbi1tYXJrLCBhbmQgZXhjbGFtYXRpb24tbWFya1xuICBzcGxpdHMgPSBzcGxpdHMubWFwKGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBzdHIuc3BsaXQoLyhcXFMuKz9bLiE/XSkoPz1cXHMrfCQpL2cpO1xuICB9KTtcbiAgcmV0dXJuIGZsYXR0ZW4oc3BsaXRzKTtcbn07XG5cbi8vIGlmIHRoaXMgbG9va3MgbGlrZSBhIHBlcmlvZCB3aXRoaW4gYSB3aWtpcGVkaWEgbGluaywgcmV0dXJuIGZhbHNlXG5jb25zdCBpc0JhbGFuY2VkID0gZnVuY3Rpb24oc3RyKSB7XG4gIHN0ciA9IHN0ciB8fCAnJztcbiAgY29uc3Qgb3BlbiA9IHN0ci5zcGxpdCgvXFxbXFxbLykgfHwgW107XG4gIGNvbnN0IGNsb3NlZCA9IHN0ci5zcGxpdCgvXFxdXFxdLykgfHwgW107XG4gIGlmIChvcGVuLmxlbmd0aCA+IGNsb3NlZC5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy9tYWtlIHN1cmUgcXVvdGVzIGFyZSBjbG9zZWQgdG9vXG4gIGNvbnN0IHF1b3RlcyA9IHN0ci5tYXRjaCgvXCIvZyk7XG4gIGlmIChxdW90ZXMgJiYgcXVvdGVzLmxlbmd0aCAlIDIgIT09IDAgJiYgc3RyLmxlbmd0aCA8IDkwMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmNvbnN0IHNlbnRlbmNlX3BhcnNlciA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgbGV0IHNlbnRlbmNlcyA9IFtdO1xuICAvL2ZpcnN0IGRvIGEgZ3JlZWR5LXNwbGl0Li5cbiAgbGV0IGNodW5rcyA9IFtdO1xuICAvL2Vuc3VyZSBpdCAnc21lbGxzIGxpa2UnIGEgc2VudGVuY2VcbiAgaWYgKCF0ZXh0IHx8IHR5cGVvZiB0ZXh0ICE9PSAnc3RyaW5nJyB8fCAhdGV4dC5tYXRjaCgvXFx3LykpIHtcbiAgICByZXR1cm4gc2VudGVuY2VzO1xuICB9XG4gIC8vIFRoaXMgd2FzIHRoZSBzcGxpdHRlciByZWdleCB1cGRhdGVkIHRvIGZpeCBxdW90ZWQgcHVuY3R1YXRpb24gbWFya3MuXG4gIC8vIGxldCBzcGxpdHMgPSB0ZXh0LnNwbGl0KC8oXFxTLis/Wy5cXD8hXSkoPz1cXHMrfCR8XCIpL2cpO1xuICAvLyB0b2RvOiBsb29rIGZvciBzaWRlIGVmZmVjdHMgaW4gdGhpcyByZWdleCByZXBsYWNlbWVudDpcbiAgbGV0IHNwbGl0cyA9IG5haWl2ZV9zcGxpdCh0ZXh0KTtcbiAgLy9maWx0ZXItb3V0IHRoZSBncmFwIG9uZXNcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdHMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgcyA9IHNwbGl0c1tpXTtcbiAgICBpZiAoIXMgfHwgcyA9PT0gJycpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICAvL3RoaXMgaXMgbWVhbmluZ2Z1bCB3aGl0ZXNwYWNlXG4gICAgaWYgKCFzLm1hdGNoKC9cXFMvKSkge1xuICAgICAgLy9hZGQgaXQgdG8gdGhlIGxhc3Qgb25lXG4gICAgICBpZiAoY2h1bmtzW2NodW5rcy5sZW5ndGggLSAxXSkge1xuICAgICAgICBjaHVua3NbY2h1bmtzLmxlbmd0aCAtIDFdICs9IHM7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIGlmIChzcGxpdHNbaSArIDFdKSB7XG4gICAgICAgIC8vYWRkIGl0IHRvIHRoZSBuZXh0IG9uZVxuICAgICAgICBzcGxpdHNbaSArIDFdID0gcyArIHNwbGl0c1tpICsgMV07XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBjaHVua3MucHVzaChzKTtcbiAgfVxuXG4gIC8vZGV0ZWN0aW9uIG9mIG5vbi1zZW50ZW5jZSBjaHVua3NcbiAgY29uc3QgaXNTZW50ZW5jZSA9IGZ1bmN0aW9uKGhtbSkge1xuICAgIGlmIChobW0ubWF0Y2goYWJicmV2X3JlZykgfHwgaG1tLm1hdGNoKGFjcm9ueW1fcmVnKSB8fCBobW0ubWF0Y2goZWxpcHNlc19yZWcpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vdG9vIHNob3J0PyAtIG5vIGNvbnNlY3V0aXZlIGxldHRlcnNcbiAgICBpZiAoaGFzV29yZC50ZXN0KGhtbSkgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghaXNCYWxhbmNlZChobW0pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vbG9vcCB0aHJvdWdoIHRoZXNlIGNodW5rcywgYW5kIGpvaW4gdGhlIG5vbi1zZW50ZW5jZSBjaHVua3MgYmFjayB0b2dldGhlci4uXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2h1bmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgLy9zaG91bGQgdGhpcyBjaHVuayBiZSBjb21iaW5lZCB3aXRoIHRoZSBuZXh0IG9uZT9cbiAgICBpZiAoY2h1bmtzW2kgKyAxXSAmJiAhaXNTZW50ZW5jZShjaHVua3NbaV0pKSB7XG4gICAgICBjaHVua3NbaSArIDFdID0gY2h1bmtzW2ldICsgKGNodW5rc1tpICsgMV0gfHwgJycpOyAvLy5yZXBsYWNlKC8gKy9nLCAnICcpO1xuICAgIH0gZWxzZSBpZiAoY2h1bmtzW2ldICYmIGNodW5rc1tpXS5sZW5ndGggPiAwKSB7XG4gICAgICAvL3RoaXMgY2h1bmsgaXMgYSBwcm9wZXIgc2VudGVuY2UuLlxuICAgICAgc2VudGVuY2VzLnB1c2goY2h1bmtzW2ldKTtcbiAgICAgIGNodW5rc1tpXSA9ICcnO1xuICAgIH1cbiAgfVxuICAvL2lmIHdlIG5ldmVyIGdvdCBhIHNlbnRlbmNlLCByZXR1cm4gdGhlIGdpdmVuIHRleHRcbiAgaWYgKHNlbnRlbmNlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gW3RleHRdO1xuICB9XG4gIHJldHVybiBzZW50ZW5jZXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNlbnRlbmNlX3BhcnNlcjtcbi8vIGNvbnNvbGUubG9nKHNlbnRlbmNlX3BhcnNlcignVG9ueSBpcyBuaWNlLiBIZSBsaXZlcyBpbiBKYXBhbi4nKS5sZW5ndGggPT09IDIpO1xuIiwiY29uc3QgcGFyc2VycyA9IHtcbiAgbWFpbjogKHRtcGwpID0+IHtcbiAgICByZXR1cm4gJyc7XG4gIH0sXG4gICdiaXJ0aCBkYXRlJzogKHRtcGwpID0+IHtcbiAgICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7LywgJycpO1xuICAgIHRtcGwgPSB0bXBsLnJlcGxhY2UoL1xcfVxcfSQvLCAnJyk7XG4gICAgbGV0IGFyciA9IHRtcGwuc3BsaXQoJ3wnKTtcbiAgICBsZXQgc3RyID0gJyc7XG4gICAgaWYgKGFyclsxXSkgeyAvL3llYXJcbiAgICAgIHN0ciArPSBhcnJbMV07XG4gICAgICBpZiAoYXJyWzJdKSB7IC8vbW9udGhcbiAgICAgICAgc3RyICs9ICctJyArIGFyclsyXTtcbiAgICAgIH1cbiAgICAgIGlmIChhcnJbM10pIHsgLy9kYXRlXG4gICAgICAgIHN0ciArPSAnLScgKyBhcnJbM107XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG4gIH1cbn07XG5cbi8vZ2V0IGlkZW50aXR5IG9mIHRlbXBsYXRlIC0gVGVtcGxhdGU6Rm9vXG5jb25zdCBnZXROYW1lID0gZnVuY3Rpb24odG1wbCkge1xuICB0bXBsID0gdG1wbC5yZXBsYWNlKC9eXFx7XFx7LywgJycpO1xuICB0bXBsID0gdG1wbC5yZXBsYWNlKC9cXH1cXH0kLywgJycpO1xuICBsZXQgbmFtZSA9IHRtcGwuc3BsaXQoL1xcfC8pWzBdIHx8ICcnO1xuICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcbiAgcmV0dXJuIG5hbWU7XG59O1xuXG5jb25zdCBwYXJzZVRlbXBsYXRlcyA9IGZ1bmN0aW9uKG9iaikge1xuICBsZXQgdGVtcGxhdGVzID0gb2JqLnRleHQubWF0Y2goL1xce1xceyhbXn1dKylcXH1cXH0vZykgfHwgW107XG4gIHRlbXBsYXRlcyA9IHRlbXBsYXRlcy5tYXAoKHRtcGwpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogZ2V0TmFtZSh0bXBsKSxcbiAgICAgIHRtcGw6IHRtcGxcbiAgICB9O1xuICB9KTtcbiAgLy90cnkgcGFyc2luZyBlYWNoIHRlbXBsYXRlXG4gIHRlbXBsYXRlcy5mb3JFYWNoKCh0KSA9PiB7XG4gICAgaWYgKHBhcnNlcnMuaGFzT3duUHJvcGVydHkodC5uYW1lKSA9PT0gdHJ1ZSkge1xuICAgICAgbGV0IHJlc3VsdCA9IHBhcnNlcnNbdC5uYW1lXSh0LnRtcGwpO1xuICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgIG9iai50ZXh0ID0gb2JqLnRleHQucmVwbGFjZSh0LnRtcGwsIHJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vcmVtb3ZlIGl0IGZyb20gdGhlIHRleHRcbiAgICAgIG9iai50ZXh0ID0gb2JqLnRleHQucmVwbGFjZSh0LnRtcGwsICcnKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufTtcbm1vZHVsZS5leHBvcnRzID0gcGFyc2VUZW1wbGF0ZXM7XG4iLCIvL3RlbXBsYXRlcyB3ZSBzdXBwb3J0XG5jb25zdCBrZWVwID0ge1xuICBtYWluOiB0cnVlLFxuICAnbWFpbiBhcnRpY2xlJzogdHJ1ZSxcbiAgJ3dpZGUgaW1hZ2UnOiB0cnVlLFxuICBjb29yZDogdHJ1ZSxcbiAgLy9kYXRlL2FnZS90aW1lIHRlbXBsYXRlc1xuICAnYmlydGggZGF0ZSc6IHRydWUsXG4gICdkZWF0aCBkYXRlJzogdHJ1ZSxcbiAgJ2JpcnRoIGRhdGUgYW5kIGFnZSc6IHRydWUsXG4gICdiaXJ0aCBkYXRlIGFuZCBhZ2UyJzogdHJ1ZSxcbiAgJ2JpcnRoIGRhdGUgYW5kIGdpdmVuIGFnZSc6IHRydWUsXG4gICdkZWF0aCBkYXRlIGFuZCBhZ2UnOiB0cnVlLFxuICAnZGVhdGggZGF0ZSBhbmQgZ2l2ZW4gYWdlJzogdHJ1ZSxcbiAgJ2RlYXRoIHllYXIgYW5kIGFnZSc6IHRydWUsXG4gICdzdGFydCBkYXRlJzogdHJ1ZSxcbiAgJ2VuZCBkYXRlJzogdHJ1ZSxcbiAgJ3N0YXJ0IGRhdGUgYW5kIGFnZSc6IHRydWUsXG4gIGJpcnRoZGVhdGhhZ2U6IHRydWUsXG4gIGRvYjogdHJ1ZSxcbiAgYmRhOiB0cnVlLFxuICAnYWdlJzogdHJ1ZSxcbiAgJ2FnZSBudHMnOiB0cnVlLFxuICAnYWdlIGluIHllYXJzLCBtb250aHMgYW5kIGRheXMnOiB0cnVlLFxuICAnYWdlIGluIHllYXJzIGFuZCBtb250aHMnOiB0cnVlLFxuICAnYWdlIGluIHllYXJzIGFuZCBkYXlzJzogdHJ1ZSxcbiAgJ2FnZSBpbiB5ZWFycywgbW9udGhzLCB3ZWVrcyBhbmQgZGF5cyc6IHRydWUsXG4gICdhZ2UgaW4gZGF5cyc6IHRydWUsXG4gICdhZ2UgYXMgb2YgZGF0ZSc6IHRydWUsXG5cblxuICAnYmlydGgnOiB0cnVlLFxuICAnZGVhdGgnOiB0cnVlLFxuICAnc3RhcnQnOiB0cnVlLFxuICAnZW5kJzogdHJ1ZSxcbn07XG5tb2R1bGUuZXhwb3J0cyA9IGtlZXA7XG4iLCJjb25zdCBoZWxwZXJzID0gcmVxdWlyZSgnLi4vLi4vbGliL2hlbHBlcnMnKTtcbmNvbnN0IHBhcnNlTGluZSA9IHJlcXVpcmUoJy4vc2VudGVuY2UvJykucGFyc2VMaW5lO1xuXG5jb25zdCB0YWJsZV9yZWcgPSAvXFx7XFx8W1xcc1xcU10rP1xcfFxcfS9nOyAvL3RoZSBsYXJnZXN0LWNpdGllcyB0YWJsZSBpcyB+NzBrY2hhcnMuXG5cbmNvbnN0IHBhcnNlSGVhZGluZyA9IGZ1bmN0aW9uKHN0cikge1xuICBzdHIgPSBwYXJzZUxpbmUoc3RyKS50ZXh0IHx8ICcnO1xuICBpZiAoc3RyLm1hdGNoKC9cXHwvKSkge1xuICAgIHN0ciA9IHN0ci5yZXBsYWNlKC8uK1xcfCA/LywgJycpOyAvL2NsYXNzPVwidW5zb3J0YWJsZVwifHRpdGxlXG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cbi8vdHVybiBhIHt8Li4udGFibGUgc3RyaW5nIGludG8gYW4gYXJyYXkgb2YgYXJyYXlzXG5jb25zdCBwYXJzZV90YWJsZSA9IGZ1bmN0aW9uKHdpa2kpIHtcbiAgbGV0IGhlYWRpbmdzID0gW107XG4gIGxldCBsaW5lcyA9IHdpa2kucmVwbGFjZSgvXFxyL2csICcnKS5zcGxpdCgvXFxuLyk7XG5cbiAgLy9maW5kIGhlYWRpbmdzIGZpcnN0XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgc3RyID0gbGluZXNbaV07XG4gICAgLy9oZWFkZXJcbiAgICBpZiAoc3RyLm1hdGNoKC9eXFwhLykpIHtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKC9eXFwhICsvLCAnJyk7XG4gICAgICAvL2hhbmRsZSBpbmxpbmUgJyEhJyBmb3JtYXRcbiAgICAgIGlmIChzdHIubWF0Y2goLyBcXCFcXCEgLykpIHtcbiAgICAgICAgbGV0IGhlYWRzID0gc3RyLnNwbGl0KC8gXFwhXFwhIC8pO1xuICAgICAgICBoZWFkaW5ncyA9IGhlYWRzLm1hcChwYXJzZUhlYWRpbmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9oYW5kbGUgaGVhZGluZy1wZXItbGluZVxuICAgICAgICBzdHIgPSBwYXJzZUhlYWRpbmcoc3RyKTtcbiAgICAgICAgaWYgKCFzdHIpIHtcbiAgICAgICAgICBzdHIgPSAnY29sLScgKyBoZWFkaW5ncy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgaGVhZGluZ3MucHVzaChzdHIpO1xuICAgICAgICBsaW5lc1tpXSA9IG51bGw7IC8vcmVtb3ZlIGl0XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChoZWFkaW5ncy5sZW5ndGggPiAwICYmIHN0ci5tYXRjaCgvXnwtLykpIHtcbiAgICAgIGxpbmVzID0gbGluZXMuc2xpY2UoaSwgbGluZXMubGVuZ3RoKTtcbiAgICAgIGJyZWFrOyAvL2RvbmUgaGVyZVxuICAgIH0gZWxzZSBpZiAoc3RyLm1hdGNoKC9eXFx8IC8pKSB7XG4gICAgICBsaW5lcyA9IGxpbmVzLnNsaWNlKGksIGxpbmVzLmxlbmd0aCk7XG4gICAgICBicmVhazsgLy9kb25lIGhlcmVcbiAgICB9XG4gIH1cbiAgbGluZXMgPSBsaW5lcy5maWx0ZXIobCA9PiBsKTtcblxuICAvLyBjb25zb2xlLmxvZyhsaW5lcyk7XG4gIGxldCB0YWJsZSA9IFtbXV07XG4gIGxpbmVzLmZvckVhY2goZnVuY3Rpb24oc3RyKSB7XG4gICAgLy9lbmQgb2YgdGFibGUsIGVuZCBoZXJlXG4gICAgaWYgKHN0ci5tYXRjaCgvXlxcfFxcfS8pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vdGhpcyBpcyBzb21lIGtpbmQgb2YgY29tbWVudC9zdW1tYXJ5XG4gICAgaWYgKHN0ci5tYXRjaCgvXlxcfFxcKy8pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vbWFrZSBuZXcgcm93XG4gICAgaWYgKHN0ci5tYXRjaCgvXlxcfC0vKSkge1xuICAgICAgaWYgKHRhYmxlWzBdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGFibGUucHVzaChbXSk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIGhhbmRsZSB3ZWlyZCAnISAnIHJvdy1oZWFkZXIgc3ludGF4XG4gICAgaWYgKHN0ci5tYXRjaCgvXlxcIS8pKSB7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXlxcISArLywgJycpO1xuICAgICAgc3RyID0gcGFyc2VIZWFkaW5nKHN0cik7XG4gICAgICBzdHIgPSBoZWxwZXJzLnRyaW1fd2hpdGVzcGFjZShzdHIpO1xuICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChzdHIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvL2p1aWN5IGxpbmVcbiAgICBpZiAoc3RyLm1hdGNoKC9eXFx8LykpIHtcbiAgICAgIGxldCB3YW50ID0gKHN0ci5tYXRjaCgvXFx8KC4qKS8pIHx8IFtdKVsxXSB8fCAnJztcbiAgICAgIC8vaGFuZGxlIHdlaXJkICdyb3dzcGFuPVwiMlwiIHwnIHN5bnRheFxuICAgICAgaWYgKHdhbnQubWF0Y2goLy4gXFx8IC8pKSB7XG4gICAgICAgIC8vdGhpcyBuZWVkcyBhZGRpdGlvbmFsIGNsZWFudXBcbiAgICAgICAgd2FudCA9IHBhcnNlSGVhZGluZyh3YW50KTtcbiAgICAgIH1cbiAgICAgIHdhbnQgPSBoZWxwZXJzLnRyaW1fd2hpdGVzcGFjZSh3YW50KSB8fCAnJztcbiAgICAgIC8vaGFuZGxlIHRoZSB8fCBzaG9ydGhhbmQuLlxuICAgICAgaWYgKHdhbnQubWF0Y2goL1shXFx8XXsyfS8pKSB7XG4gICAgICAgIHdhbnQuc3BsaXQoL1shXFx8XXsyfS9nKS5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICBzID0gaGVscGVycy50cmltX3doaXRlc3BhY2Uocyk7XG4gICAgICAgICAgdGFibGVbdGFibGUubGVuZ3RoIC0gMV0ucHVzaChzKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YWJsZVt0YWJsZS5sZW5ndGggLSAxXS5wdXNoKHdhbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIC8vcmVtb3ZlIHRvcCBvbmUsIGlmIGl0J3MgZW1wdHlcbiAgaWYgKHRhYmxlWzBdICYmIE9iamVjdC5rZXlzKHRhYmxlWzBdKS5sZW5ndGggPT09IDApIHtcbiAgICB0YWJsZS5zaGlmdCgpO1xuICB9XG4gIC8vaW5kZXggdGhlbSBieSB0aGVpciBoZWFkZXJcbiAgdGFibGUgPSB0YWJsZS5tYXAoYXJyID0+IHtcbiAgICBsZXQgb2JqID0ge307XG4gICAgYXJyLmZvckVhY2goKGEsIGkpID0+IHtcbiAgICAgIGxldCBoZWFkID0gaGVhZGluZ3NbaV0gfHwgJ2NvbC0nICsgaTtcbiAgICAgIG9ialtoZWFkXSA9IHBhcnNlTGluZShhKTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9KTtcbiAgcmV0dXJuIHRhYmxlO1xufTtcblxuY29uc3QgZmluZFRhYmxlcyA9IGZ1bmN0aW9uKHIsIHdpa2kpIHtcbiAgbGV0IHRhYmxlcyA9IHdpa2kubWF0Y2godGFibGVfcmVnLCAnJykgfHwgW107XG4gIHRhYmxlcyA9IHRhYmxlcy5tYXAoZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHBhcnNlX3RhYmxlKHN0cik7XG4gIH0pO1xuICBpZiAodGFibGVzLmxlbmd0aCA+IDApIHtcbiAgICByLnRhYmxlcyA9IHRhYmxlcztcbiAgfVxuICAvL3JlbW92ZSB0YWJsZXNcbiAgd2lraSA9IHdpa2kucmVwbGFjZSh0YWJsZV9yZWcsICcnKTtcbiAgcmV0dXJuIHdpa2k7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBmaW5kVGFibGVzO1xuIl19
