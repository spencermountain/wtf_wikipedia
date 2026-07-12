/* wtf-plugin-image 1.1.1  MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.wtfImage = factory());
})(this, (function () { 'use strict';

  function safeAdd(x, y) {
    let lsw = (x & 65535) + (y & 65535);
    let msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return msw << 16 | lsw & 65535;
  }
  function bitRotateLeft(num, cnt) {
    return num << cnt | num >>> 32 - cnt;
  }
  function md5cmn(q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a, b, c, d, x, s, t) {
    return md5cmn(b & c | ~b & d, a, b, x, s, t);
  }
  function md5gg(a, b, c, d, x, s, t) {
    return md5cmn(b & d | c & ~d, a, b, x, s, t);
  }
  function md5hh(a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  function binlMD5(x, len) {
    x[len >> 5] |= 128 << len % 32;
    x[(len + 64 >>> 9 << 4) + 14] = len;
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
    return [a, b, c, d];
  }
  function binl2rstr(input) {
    let i;
    let output = "";
    let length32 = input.length * 32;
    for (i = 0; i < length32; i += 8) {
      output += String.fromCharCode(input[i >> 5] >>> i % 32 & 255);
    }
    return output;
  }
  function rstr2binl(input) {
    let i;
    let output = [];
    output[(input.length >> 2) - 1] = void 0;
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0;
    }
    let length8 = input.length * 8;
    for (i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 255) << i % 32;
    }
    return output;
  }
  function rstrMD5(s) {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
  }
  function rstr2hex(input) {
    let hexTab = "0123456789abcdef";
    let output = "";
    let x;
    let i;
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i);
      output += hexTab.charAt(x >>> 4 & 15) + hexTab.charAt(x & 15);
    }
    return output;
  }
  function str2rstrUTF8(input) {
    return unescape(encodeURIComponent(input));
  }
  function rawMD5(s) {
    return rstrMD5(str2rstrUTF8(s));
  }
  function hexMD5(s) {
    return rstr2hex(rawMD5(s));
  }
  function md5(string, key, raw) {
    {
      {
        return hexMD5(string);
      }
    }
  }

  const server = "https://upload.wikimedia.org/wikipedia/commons/";
  const encodeTitle = function(file) {
    let title = file.replace(/^(image|file?):/i, "");
    title = title.trim();
    title = title.charAt(0).toUpperCase() + title.substring(1);
    title = title.replace(/ /g, "_");
    return title;
  };
  const commonsURL = function() {
    let file = this.data.file;
    let title = encodeTitle(file);
    let hash = md5(title);
    let path = hash.substr(0, 1) + "/" + hash.substr(0, 2) + "/";
    title = encodeURIComponent(title);
    path += title;
    return server + path;
  };

  const imgExists = function(callback) {
    const userAgent = this.data["_userAgent"];
    return fetch(this.url(), {
      method: "HEAD",
      headers: {
        "Api-User-Agent": userAgent,
        "User-Agent": userAgent
      }
    }).then((resp) => {
      let status = String(resp.status) || "";
      let bool = /^[23]/.test(status);
      if (callback) {
        callback(null, bool);
      }
      return bool;
    }).catch((e) => {
      console.error(e);
      if (callback) {
        callback(e, null);
      }
      return null;
    });
  };

  const mainImage = function() {
    let box = this.infobox();
    if (box) {
      let img = box.image();
      if (img) {
        return img;
      }
    }
    let s = this.section();
    let imgs = s.images();
    if (imgs.length === 1) {
      return imgs[0];
    }
    return null;
  };

  function isArray(x) {
    return Object.prototype.toString.call(x) === "[object Array]";
  }

  const isInterWiki = /(wikibooks|wikidata|wikimedia|wikinews|wikipedia|wikiquote|wikisource|wikispecies|wikiversity|wikivoyage|wiktionary|foundation|meta)\.org/;
  const defaults = {
    action: "query",
    prop: "revisions|pageprops",
    // we use the 'revisions' api here, instead of the Raw api, for its CORS-rules..
    rvprop: "content|ids|timestamp",
    maxlag: 5,
    rvslots: "main",
    origin: "*",
    format: "json",
    redirects: "true"
  };
  const toQueryString = function(obj) {
    return Object.entries(obj).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
  };
  const cleanTitle = (page) => {
    return page.replace(/ /g, "_").trim();
  };
  const makeUrl = function(options, parameters = defaults) {
    let params = Object.assign({}, parameters);
    let apiPath = "";
    if (options.domain) {
      let path = isInterWiki.test(options.domain) ? "w/api.php" : options.path;
      apiPath = `https://${options.domain}/${path}?`;
    } else if (options.lang && options.wiki) {
      apiPath = `https://${options.lang}.${options.wiki}.org/w/api.php?`;
    } else {
      return "";
    }
    if (!options.follow_redirects) {
      delete params.redirects;
    }
    if (options.origin) {
      params.origin = options.origin;
    }
    let title = options.title;
    if (typeof title === "number") {
      params.pageids = title;
    } else if (typeof title === "string") {
      params.titles = cleanTitle(title);
    } else if (title !== void 0 && isArray(title) && typeof title[0] === "number") {
      params.pageids = title.filter((t) => t).join("|");
    } else if (title !== void 0 && isArray(title) === true && typeof title[0] === "string") {
      params.titles = title.filter((t) => t).map(cleanTitle).join("|");
    } else {
      return "";
    }
    return `${apiPath}${toQueryString(params)}`;
  };

  const makeHeaders = function(options) {
    let agent = options.userAgent || options["User-Agent"] || options["Api-User-Agent"] || "User of the wtf_wikipedia library";
    let origin;
    if (options.noOrigin) {
      origin = "";
    } else {
      origin = options.origin || options.Origin || "*";
    }
    return {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Api-User-Agent": agent,
        "User-Agent": agent,
        Origin: origin,
        "Accept-Encoding": "gzip"
      },
      redirect: "follow"
    };
  };

  const parseImage = function(fetchedImage) {
    if (fetchedImage.hasOwnProperty("missing")) {
      return {};
    }
    const metaData = fetchedImage.imageinfo[0].extmetadata;
    const url = fetchedImage.imageinfo[0].url;
    return {
      // add the data for the properties that exists
      ...metaData && {
        licenseRes: {
          license: metaData.LicenseShortName && metaData.LicenseShortName.value || "",
          artist: metaData.Artist && metaData.Artist.value || "",
          credit: metaData.Credit && metaData.Credit.value || "",
          attributionRequired: metaData.AttributionRequired && metaData.AttributionRequired.value || ""
        }
      },
      ...url && { existsRes: true }
    };
  };
  const parseFetched = function(titles, fetched, isDoc) {
    if (isDoc) {
      const fetchedValues = Object.values(fetched.query.pages);
      const newMethodsRes = [];
      titles = titles.map((i) => {
        i = i.replace(/_/g, " ");
        i = i.replace(/^.*?:/, "");
        i = i[0].toUpperCase() + i.substring(1);
        return i;
      });
      const regFileName = /^.*?:(.*)/;
      for (const t of titles) {
        for (const f of fetchedValues) {
          if (f.title.match(regFileName)[1] === t) {
            newMethodsRes.push(parseImage(f));
            break;
          }
        }
      }
      return newMethodsRes;
    }
    return parseImage(Object.values(fetched.query.pages)[0]);
  };

  const methodsProps = {
    // the accepted methdos and the iiprop (imageinfo prop (URL parameter)) needed for each method
    license: "extmetadata",
    exists: "url"
  };
  class InvalidMethod extends Error {
    constructor(invalidMethod) {
      super();
      const validMethods = Object.keys(methodsProps).join(", ");
      this.message = `'${invalidMethod}' cannot be passed to the 'images' method; valid values are:
${validMethods}`;
      this.name = this.constructor.name;
    }
  }
  function fetchImages(methods = "", images = []) {
    const isDoc = images.length ? true : false;
    let titles;
    let iiprop;
    const userAgent = isDoc ? this["_userAgent"] : this.data["_userAgent"];
    const mpEntries = Object.entries(methodsProps);
    if (isDoc) {
      titles = images.map((i) => i.file());
      if (Array.isArray(methods)) {
        iiprop = [];
        for (const m of methods) {
          for (const mp of mpEntries.entries()) {
            if (m.toLowerCase() === mp[1][0]) {
              iiprop.push(mp[1][1]);
              break;
            }
            if (mp[0] === mpEntries.length - 1) {
              throw new InvalidMethod(m);
            }
          }
        }
        iiprop = iiprop.join("|");
      } else if (typeof methods === "string") {
        for (const mp of mpEntries) {
          if (methods.toLowerCase() === mp[0]) {
            iiprop = mp[1];
            break;
          }
        }
        if (!iiprop) {
          throw new InvalidMethod(methods);
        }
      }
    } else {
      titles = this.file();
      for (const mp of mpEntries) {
        if (methods.toLowerCase() === mp[0]) {
          iiprop = mp[1];
          break;
        }
      }
      if (!iiprop) {
        throw new InvalidMethod(methods);
      }
    }
    const options = {
      title: titles,
      domain: "commons.wikimedia.org",
      userAgent
    };
    const params = {
      action: "query",
      prop: "imageinfo",
      iiprop,
      maxlag: 5,
      format: "json",
      origin: "*"
    };
    const url = makeUrl(options, params);
    const headers = makeHeaders(options);
    return fetch(url, headers).then((res) => res.json()).then((res) => {
      if (!isDoc) {
        this.data.pluginData = {
          ...this.data.pluginData,
          ...parseFetched(titles, res, isDoc)
        };
        return null;
      } else {
        return parseFetched(titles, res, isDoc);
      }
    }).catch((e) => {
      console.error(e);
    });
  }

  const images = function(oldMethod) {
    const newMethod = function(clue) {
      const addUserAgent = function(imgs) {
        return imgs.map((i) => {
          i.data["_userAgent"] = this["_userAgent"];
          return i;
        });
      };
      let imagesArr;
      if (typeof clue === "number") {
        imagesArr = oldMethod.call(this, clue);
        imagesArr = addUserAgent.call(this, imagesArr);
        return imagesArr;
      } else if (typeof clue === "object") {
        if (clue.batch) {
          imagesArr = oldMethod.call(this);
          imagesArr = addUserAgent.call(this, imagesArr);
          return fetchImages.call(this, clue.batch, imagesArr).then((methodsRes) => {
            let methodsRedefined = false;
            imagesArr = imagesArr.map((image, ind) => {
              image.data.pluginData = {
                ...image.data.pluginData,
                ...methodsRes[ind]
              };
              if (!methodsRedefined) {
                if (Object.keys(methodsRes[ind]).length > 0) {
                  methodsRedefined = true;
                  const imageProto = Object.getPrototypeOf(image);
                  Object.keys(image.data.pluginData).forEach((k) => {
                    const methodName = k.slice(0, -3);
                    imageProto[methodName] = function() {
                      return Promise.resolve(this.data.pluginData[k] || null);
                    };
                  });
                }
              }
              return image;
            });
            return imagesArr;
          });
        }
      }
      imagesArr = oldMethod.call(this);
      imagesArr = addUserAgent.call(this, imagesArr);
      return imagesArr;
    };
    return newMethod;
  };

  const license = async function() {
    await fetchImages.call(this, "license");
    return this.data.pluginData.licenseRes || null;
  };

  const addMethod = function(models) {
    models.Doc.prototype.mainImage = mainImage;
    models.Image.prototype.commonsURL = commonsURL;
    models.Image.prototype.exists = imgExists;
    models.Image.prototype.license = license;
    const oldImages = models.Doc.prototype.images;
    models.Doc.prototype.images = images(oldImages);
  };

  return addMethod;

}));
