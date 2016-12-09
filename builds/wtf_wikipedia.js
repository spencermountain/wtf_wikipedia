/* wtf_wikipedia v0.7.1
   github.com/spencermountain/wtf_wikipedia
   MIT
*/
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wtf_wikipedia = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

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

var Emitter = _dereq_('emitter');
var requestBase = _dereq_('./request-base');
var isObject = _dereq_('./is-object');

/**
 * Noop.
 */

function noop(){};

/**
 * Expose `request`.
 */

var request = module.exports = _dereq_('./request').bind(null, Request);

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
  throw Error("Browser-only verison of superagent could not find XHR");
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
  xml: 'application/xml',
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
   'application/json': JSON.stringify
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
  'application/json': JSON.parse
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

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
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
  return /[\/+]json\b/.test(mime);
}

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function type(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function params(str){
  return str.split(/ *; */).reduce(function(obj, str){
    var parts = str.split(/ *= */),
        key = parts.shift(),
        val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

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

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  this._setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);
  this.body = this.req.method != 'HEAD'
    ? this._parseBody(this.text ? this.text : this.xhr.response)
    : null;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
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

Response.prototype._setHeaderProperties = function(header){
  // content-type
  var ct = this.header['content-type'] || '';
  this.type = type(ct);

  // params
  var obj = params(ct);
  for (var key in obj) this[key] = obj[key];
};

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

Response.prototype._parseBody = function(str){
  var parse = request.parse[this.type];
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
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

Response.prototype._setStatusProperties = function(status){
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
    status = 204;
  }

  var type = status / 100 | 0;

  // status / class
  this.status = this.statusCode = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
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
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
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
      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
      // issue #876: return the http status code if the response parsing fails
      err.statusCode = self.xhr && self.xhr.status ? self.xhr.status : null;
      return self.callback(err);
    }

    self.emit('response', res);

    var new_err;
    try {
      if (res.status < 200 || res.status >= 300) {
        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
        new_err.original = err;
        new_err.response = res;
        new_err.status = res.status;
      }
    } catch(e) {
      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_err) {
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `requestBase`.
 */

Emitter(Request.prototype);
for (var key in requestBase) {
  Request.prototype[key] = requestBase[key];
}

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
 * Set responseType to `val`. Presently valid responseTypes are 'blob' and
 * 'arraybuffer'.
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

Request.prototype.responseType = function(val){
  this._responseType = val;
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
 * @param {String} pass
 * @param {Object} options with 'type' property 'auto' or 'basic' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass, options){
  if (!options) {
    options = {
      type: 'basic'
    }
  }

  switch (options.type) {
    case 'basic':
      var str = btoa(user + ':' + pass);
      this.set('Authorization', 'Basic ' + str);
    break;

    case 'auto':
      this.username = user;
      this.password = pass;
    break;
  }
  return this;
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
 * with optional `filename`.
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String} filename
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, filename){
  this._getFormData().append(field, file, filename || file.name);
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
  var fn = this._callback;
  this.clearTimeout();
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

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

Request.prototype._timeoutError = function(){
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */

Request.prototype._appendQueryString = function(){
  var query = this._query.join('&');
  if (query) {
    this.url += ~this.url.indexOf('?')
      ? '&' + query
      : '?' + query;
  }
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var timeout = this._timeout;
  var data = this._formData || this._data;

  // store callback
  this._callback = fn || noop;

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (0 == status) {
      if (self.timedout) return self._timeoutError();
      if (self._aborted) return;
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
  }
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

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self.timedout = true;
      self.abort();
    }, timeout);
  }

  // querystring
  this._appendQueryString();

  // initiate request
  if (this.username && this.password) {
    xhr.open(this.method, this.url, true, this.username, this.password);
  } else {
    xhr.open(this.method, this.url, true);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
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


/**
 * Expose `Request`.
 */

request.Request = Request;

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
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

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
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

request.options = function(url, data, fn){
  var req = request('OPTIONS', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

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

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
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

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
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

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

},{"./is-object":3,"./request":5,"./request-base":4,"emitter":1}],3:[function(_dereq_,module,exports){
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

},{}],4:[function(_dereq_,module,exports){
/**
 * Module of mixed-in functions shared between node and client code
 */
var isObject = _dereq_('./is-object');

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

exports.clearTimeout = function _clearTimeout(){
  this._timeout = 0;
  clearTimeout(this._timer);
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

exports.parse = function parse(fn){
  this._parser = fn;
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

exports.serialize = function serialize(fn){
  this._serializer = fn;
  return this;
};

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

exports.timeout = function timeout(ms){
  this._timeout = ms;
  return this;
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} reject
 * @return {Request}
 */

exports.then = function then(resolve, reject) {
  if (!this._fullfilledPromise) {
    var self = this;
    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
      self.end(function(err, res){
        if (err) innerReject(err); else innerResolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
}

exports.catch = function(cb) {
  return this.then(undefined, cb);
};

/**
 * Allow for extension
 */

exports.use = function use(fn) {
  fn(this);
  return this;
}


/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

exports.get = function(field){
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

exports.getHeader = exports.get;

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

exports.set = function(field, val){
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
exports.unset = function(field){
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
exports.field = function(name, val) {

  // name should be either a string or an object.
  if (null === name ||  undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (isObject(name)) {
    for (var key in name) {
      this.field(key, name[key]);
    }
    return this;
  }

  // val should be defined now
  if (null === val || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
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
exports.abort = function(){
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

exports.withCredentials = function(){
  // This is browser-only functionality. Node side is no-op.
  this._withCredentials = true;
  return this;
};

/**
 * Set the max redirects to `n`. Does noting in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

exports.redirects = function(n){
  this._maxRedirects = n;
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

exports.toJSON = function(){
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

exports._isHost = function _isHost(obj) {
  var str = {}.toString.call(obj);

  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}

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

exports.send = function(data){
  var obj = isObject(data);
  var type = this._header['content-type'];

  // merge
  if (obj && isObject(this._data)) {
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

  if (!obj || this._isHost(data)) return this;

  // default to json
  if (!type) this.type('json');
  return this;
};

},{"./is-object":3}],5:[function(_dereq_,module,exports){
// The node and browser modules expose versions of this with the
// appropriate constructor function bound as first argument
/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

function request(RequestConstructor, method, url) {
  // callback
  if ('function' == typeof url) {
    return new RequestConstructor('GET', method).end(url);
  }

  // url first
  if (2 == arguments.length) {
    return new RequestConstructor('GET', method);
  }

  return new RequestConstructor(method, url);
}

module.exports = request;

},{}],6:[function(_dereq_,module,exports){
'use strict';

// wikipedia special terms lifted and augmented from parsoid parser april 2015
// (not even close to being complete)
var i18n = {
  'files': ['файл', 'fitxer', 'soubor', 'datei', 'file', 'archivo', 'پرونده', 'tiedosto', 'mynd', 'su\'wret', 'fichier', 'bestand', 'датотека', 'dosya', 'fil'],
  'images': ['image'],
  'templates': ['шаблён', 'plantilla', 'šablona', 'vorlage', 'template', 'الگو', 'malline', 'snið', 'shablon', 'modèle', 'sjabloon', 'шаблон', 'şablon'],
  'categories': ['катэгорыя', 'categoria', 'kategorie', 'category', 'categoría', 'رده', 'luokka', 'flokkur', 'kategoriya', 'catégorie', 'categorie', 'категорија', 'kategori', 'kategoria', 'تصنيف'],
  'redirects': ['перанакіраваньне', 'redirect', 'přesměruj', 'weiterleitung', 'redirección', 'redireccion', 'تغییر_مسیر', 'تغییرمسیر', 'ohjaus', 'uudelleenohjaus', 'tilvísun', 'aýdaw', 'айдау', 'redirection', 'doorverwijzing', 'преусмери', 'преусмјери', 'yönlendi̇rme', 'yönlendi̇r', '重定向', 'redirección', 'redireccion', '重定向', 'yönlendirm?e?', 'تغییر_مسیر', 'تغییرمسیر', 'перанакіраваньне', 'yönlendirme'],
  'specials': ['спэцыяльныя', 'especial', 'speciální', 'spezial', 'special', 'ویژه', 'toiminnot', 'kerfissíða', 'arnawlı', 'spécial', 'speciaal', 'посебно', 'özel'],
  'users': ['удзельнік', 'usuari', 'uživatel', 'benutzer', 'user', 'usuario', 'کاربر', 'käyttäjä', 'notandi', 'paydalanıwshı', 'utilisateur', 'gebruiker', 'корисник', 'kullanıcı'],
  'disambigs': ['disambig', //en
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
  'infoboxes': ['infobox', 'ficha', 'канадский', 'inligtingskas', 'inligtingskas3', //af
  'لغة', 'bilgi kutusu', //tr
  'yerleşim bilgi kutusu', 'infoboks' //nn, no
  ],
  'sources': [//blacklist these headings, as they're not plain-text
  'references', 'see also', 'external links', 'further reading', 'notes et références', 'voir aussi', 'liens externes']
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = i18n;
}

},{}],7:[function(_dereq_,module,exports){
'use strict';

module.exports = {
  'aa': {
    'english_title': 'Afar',
    'direction': 'ltr',
    'local_title': 'Afar'
  },
  'ab': {
    'english_title': 'Abkhazian',
    'direction': 'ltr',
    'local_title': 'Аҧсуа'
  },
  'af': {
    'english_title': 'Afrikaans',
    'direction': 'ltr',
    'local_title': 'Afrikaans'
  },
  'ak': {
    'english_title': 'Akan',
    'direction': 'ltr',
    'local_title': 'Akana'
  },
  'als': {
    'english_title': 'Alemannic',
    'direction': 'ltr',
    'local_title': 'Alemannisch'
  },
  'am': {
    'english_title': 'Amharic',
    'direction': 'ltr',
    'local_title': 'አማርኛ'
  },
  'an': {
    'english_title': 'Aragonese',
    'direction': 'ltr',
    'local_title': 'Aragonés'
  },
  'ang': {
    'english_title': 'Anglo-Saxon',
    'direction': 'ltr',
    'local_title': 'Englisc'
  },
  'ar': {
    'english_title': 'Arabic',
    'direction': 'rtl',
    'local_title': 'العربية'
  },
  'arc': {
    'english_title': 'Aramaic',
    'direction': 'rtl',
    'local_title': 'ܣܘܪܬ'
  },
  'as': {
    'english_title': 'Assamese',
    'direction': 'ltr',
    'local_title': 'অসমীয়া'
  },
  'ast': {
    'english_title': 'Asturian',
    'direction': 'ltr',
    'local_title': 'Asturianu'
  },
  'av': {
    'english_title': 'Avar',
    'direction': 'ltr',
    'local_title': 'Авар'
  },
  'ay': {
    'english_title': 'Aymara',
    'direction': 'ltr',
    'local_title': 'Aymar'
  },
  'az': {
    'english_title': 'Azerbaijani',
    'direction': 'ltr',
    'local_title': 'Azərbaycanca'
  },
  'ba': {
    'english_title': 'Bashkir',
    'direction': 'ltr',
    'local_title': 'Башҡорт'
  },
  'bar': {
    'english_title': 'Bavarian',
    'direction': 'ltr',
    'local_title': 'Boarisch'
  },
  'bat-smg': {
    'english_title': 'Samogitian',
    'direction': 'ltr',
    'local_title': 'Žemaitėška'
  },
  'bcl': {
    'english_title': 'Bikol',
    'direction': 'ltr',
    'local_title': 'Bikol'
  },
  'be': {
    'english_title': 'Belarusian',
    'direction': 'ltr',
    'local_title': 'Беларуская'
  },
  'be-x-old': {
    'english_title': 'Belarusian',
    'direction': '(Taraškievica)',
    'local_title': 'ltr'
  },
  'bg': {
    'english_title': 'Bulgarian',
    'direction': 'ltr',
    'local_title': 'Български'
  },
  'bh': {
    'english_title': 'Bihari',
    'direction': 'ltr',
    'local_title': 'भोजपुरी'
  },
  'bi': {
    'english_title': 'Bislama',
    'direction': 'ltr',
    'local_title': 'Bislama'
  },
  'bm': {
    'english_title': 'Bambara',
    'direction': 'ltr',
    'local_title': 'Bamanankan'
  },
  'bn': {
    'english_title': 'Bengali',
    'direction': 'ltr',
    'local_title': 'বাংলা'
  },
  'bo': {
    'english_title': 'Tibetan',
    'direction': 'ltr',
    'local_title': 'བོད་ཡིག'
  },
  'bpy': {
    'english_title': 'Bishnupriya',
    'direction': 'Manipuri',
    'local_title': 'ltr'
  },
  'br': {
    'english_title': 'Breton',
    'direction': 'ltr',
    'local_title': 'Brezhoneg'
  },
  'bs': {
    'english_title': 'Bosnian',
    'direction': 'ltr',
    'local_title': 'Bosanski'
  },
  'bug': {
    'english_title': 'Buginese',
    'direction': 'ltr',
    'local_title': 'ᨅᨔ'
  },
  'bxr': {
    'english_title': 'Buriat',
    'direction': '(Russia)',
    'local_title': 'ltr'
  },
  'ca': {
    'english_title': 'Catalan',
    'direction': 'ltr',
    'local_title': 'Català'
  },
  'cdo': {
    'english_title': 'Min',
    'direction': 'Dong',
    'local_title': 'Chinese'
  },
  'ce': {
    'english_title': 'Chechen',
    'direction': 'ltr',
    'local_title': 'Нохчийн'
  },
  'ceb': {
    'english_title': 'Cebuano',
    'direction': 'ltr',
    'local_title': 'Sinugboanong'
  },
  'ch': {
    'english_title': 'Chamorro',
    'direction': 'ltr',
    'local_title': 'Chamoru'
  },
  'cho': {
    'english_title': 'Choctaw',
    'direction': 'ltr',
    'local_title': 'Choctaw'
  },
  'chr': {
    'english_title': 'Cherokee',
    'direction': 'ltr',
    'local_title': 'ᏣᎳᎩ'
  },
  'chy': {
    'english_title': 'Cheyenne',
    'direction': 'ltr',
    'local_title': 'Tsetsêhestâhese'
  },
  'co': {
    'english_title': 'Corsican',
    'direction': 'ltr',
    'local_title': 'Corsu'
  },
  'cr': {
    'english_title': 'Cree',
    'direction': 'ltr',
    'local_title': 'Nehiyaw'
  },
  'cs': {
    'english_title': 'Czech',
    'direction': 'ltr',
    'local_title': 'Česky'
  },
  'csb': {
    'english_title': 'Kashubian',
    'direction': 'ltr',
    'local_title': 'Kaszëbsczi'
  },
  'cu': {
    'english_title': 'Old',
    'direction': 'Church',
    'local_title': 'Slavonic'
  },
  'cv': {
    'english_title': 'Chuvash',
    'direction': 'ltr',
    'local_title': 'Чăваш'
  },
  'cy': {
    'english_title': 'Welsh',
    'direction': 'ltr',
    'local_title': 'Cymraeg'
  },
  'da': {
    'english_title': 'Danish',
    'direction': 'ltr',
    'local_title': 'Dansk'
  },
  'de': {
    'english_title': 'German',
    'direction': 'ltr',
    'local_title': 'Deutsch'
  },
  'diq': {
    'english_title': 'Dimli',
    'direction': 'ltr',
    'local_title': 'Zazaki'
  },
  'dsb': {
    'english_title': 'Lower',
    'direction': 'Sorbian',
    'local_title': 'ltr'
  },
  'dv': {
    'english_title': 'Divehi',
    'direction': 'rtl',
    'local_title': 'ދިވެހިބަސް'
  },
  'dz': {
    'english_title': 'Dzongkha',
    'direction': 'ltr',
    'local_title': 'ཇོང་ཁ'
  },
  'ee': {
    'english_title': 'Ewe',
    'direction': 'ltr',
    'local_title': 'Ɛʋɛ'
  },
  'far': {
    'english_title': 'Farsi',
    'direction': 'ltr',
    'local_title': 'فارسی'
  },
  'el': {
    'english_title': 'Greek',
    'direction': 'ltr',
    'local_title': 'Ελληνικά'
  },
  'en': {
    'english_title': 'English',
    'direction': 'ltr',
    'local_title': 'English'
  },
  'eo': {
    'english_title': 'Esperanto',
    'direction': 'ltr',
    'local_title': 'Esperanto'
  },
  'es': {
    'english_title': 'Spanish',
    'direction': 'ltr',
    'local_title': 'Español'
  },
  'et': {
    'english_title': 'Estonian',
    'direction': 'ltr',
    'local_title': 'Eesti'
  },
  'eu': {
    'english_title': 'Basque',
    'direction': 'ltr',
    'local_title': 'Euskara'
  },
  'ext': {
    'english_title': 'Extremaduran',
    'direction': 'ltr',
    'local_title': 'Estremeñu'
  },
  'ff': {
    'english_title': 'Peul',
    'direction': 'ltr',
    'local_title': 'Fulfulde'
  },
  'fi': {
    'english_title': 'Finnish',
    'direction': 'ltr',
    'local_title': 'Suomi'
  },
  'fiu-vro': {
    'english_title': 'Võro',
    'direction': 'ltr',
    'local_title': 'Võro'
  },
  'fj': {
    'english_title': 'Fijian',
    'direction': 'ltr',
    'local_title': 'Na'
  },
  'fo': {
    'english_title': 'Faroese',
    'direction': 'ltr',
    'local_title': 'Føroyskt'
  },
  'fr': {
    'english_title': 'French',
    'direction': 'ltr',
    'local_title': 'Français'
  },
  'frp': {
    'english_title': 'Arpitan',
    'direction': 'ltr',
    'local_title': 'Arpitan'
  },
  'fur': {
    'english_title': 'Friulian',
    'direction': 'ltr',
    'local_title': 'Furlan'
  },
  'fy': {
    'english_title': 'West',
    'direction': 'Frisian',
    'local_title': 'ltr'
  },
  'ga': {
    'english_title': 'Irish',
    'direction': 'ltr',
    'local_title': 'Gaeilge'
  },
  'gan': {
    'english_title': 'Gan',
    'direction': 'Chinese',
    'local_title': 'ltr'
  },
  'gd': {
    'english_title': 'Scottish',
    'direction': 'Gaelic',
    'local_title': 'ltr'
  },
  'gil': {
    'english_title': 'Gilbertese',
    'direction': 'ltr',
    'local_title': 'Taetae'
  },
  'gl': {
    'english_title': 'Galician',
    'direction': 'ltr',
    'local_title': 'Galego'
  },
  'gn': {
    'english_title': 'Guarani',
    'direction': 'ltr',
    'local_title': 'Avañe\'ẽ'
  },
  'got': {
    'english_title': 'Gothic',
    'direction': 'ltr',
    'local_title': 'gutisk'
  },
  'gu': {
    'english_title': 'Gujarati',
    'direction': 'ltr',
    'local_title': 'ગુજરાતી'
  },
  'gv': {
    'english_title': 'Manx',
    'direction': 'ltr',
    'local_title': 'Gaelg'
  },
  'ha': {
    'english_title': 'Hausa',
    'direction': 'rtl',
    'local_title': 'هَوُسَ'
  },
  'hak': {
    'english_title': 'Hakka',
    'direction': 'Chinese',
    'local_title': 'ltr'
  },
  'haw': {
    'english_title': 'Hawaiian',
    'direction': 'ltr',
    'local_title': 'Hawai`i'
  },
  'he': {
    'english_title': 'Hebrew',
    'direction': 'rtl',
    'local_title': 'עברית'
  },
  'hi': {
    'english_title': 'Hindi',
    'direction': 'ltr',
    'local_title': 'हिन्दी'
  },
  'ho': {
    'english_title': 'Hiri',
    'direction': 'Motu',
    'local_title': 'ltr'
  },
  'hr': {
    'english_title': 'Croatian',
    'direction': 'ltr',
    'local_title': 'Hrvatski'
  },
  'ht': {
    'english_title': 'Haitian',
    'direction': 'ltr',
    'local_title': 'Krèyol'
  },
  'hu': {
    'english_title': 'Hungarian',
    'direction': 'ltr',
    'local_title': 'Magyar'
  },
  'hy': {
    'english_title': 'Armenian',
    'direction': 'ltr',
    'local_title': 'Հայերեն'
  },
  'hz': {
    'english_title': 'Herero',
    'direction': 'ltr',
    'local_title': 'Otsiherero'
  },
  'ia': {
    'english_title': 'Interlingua',
    'direction': 'ltr',
    'local_title': 'Interlingua'
  },
  'id': {
    'english_title': 'Indonesian',
    'direction': 'ltr',
    'local_title': 'Bahasa'
  },
  'ie': {
    'english_title': 'Interlingue',
    'direction': 'ltr',
    'local_title': 'Interlingue'
  },
  'ig': {
    'english_title': 'Igbo',
    'direction': 'ltr',
    'local_title': 'Igbo'
  },
  'ii': {
    'english_title': 'Sichuan',
    'direction': 'Yi',
    'local_title': 'ltr'
  },
  'ik': {
    'english_title': 'Inupiak',
    'direction': 'ltr',
    'local_title': 'Iñupiak'
  },
  'ilo': {
    'english_title': 'Ilokano',
    'direction': 'ltr',
    'local_title': 'Ilokano'
  },
  'io': {
    'english_title': 'Ido',
    'direction': 'ltr',
    'local_title': 'Ido'
  },
  'is': {
    'english_title': 'Icelandic',
    'direction': 'ltr',
    'local_title': 'Íslenska'
  },
  'it': {
    'english_title': 'Italian',
    'direction': 'ltr',
    'local_title': 'Italiano'
  },
  'iu': {
    'english_title': 'Inuktitut',
    'direction': 'ltr',
    'local_title': 'ᐃᓄᒃᑎᑐᑦ'
  },
  'ja': {
    'english_title': 'Japanese',
    'direction': 'ltr',
    'local_title': '日本語'
  },
  'jbo': {
    'english_title': 'Lojban',
    'direction': 'ltr',
    'local_title': 'Lojban'
  },
  'jv': {
    'english_title': 'Javanese',
    'direction': 'ltr',
    'local_title': 'Basa'
  },
  'ka': {
    'english_title': 'Georgian',
    'direction': 'ltr',
    'local_title': 'ქართული'
  },
  'kg': {
    'english_title': 'Kongo',
    'direction': 'ltr',
    'local_title': 'KiKongo'
  },
  'ki': {
    'english_title': 'Kikuyu',
    'direction': 'ltr',
    'local_title': 'Gĩkũyũ'
  },
  'kj': {
    'english_title': 'Kuanyama',
    'direction': 'ltr',
    'local_title': 'Kuanyama'
  },
  'kk': {
    'english_title': 'Kazakh',
    'direction': 'ltr',
    'local_title': 'Қазақша'
  },
  'kl': {
    'english_title': 'Greenlandic',
    'direction': 'ltr',
    'local_title': 'Kalaallisut'
  },
  'km': {
    'english_title': 'Cambodian',
    'direction': 'ltr',
    'local_title': 'ភាសាខ្មែរ'
  },
  'kn': {
    'english_title': 'Kannada',
    'direction': 'ltr',
    'local_title': 'ಕನ್ನಡ'
  },
  'khw': {
    'english_title': 'Khowar',
    'direction': 'rtl',
    'local_title': 'کھوار'
  },
  'ko': {
    'english_title': 'Korean',
    'direction': 'ltr',
    'local_title': '한국어'
  },
  'kr': {
    'english_title': 'Kanuri',
    'direction': 'ltr',
    'local_title': 'Kanuri'
  },
  'ks': {
    'english_title': 'Kashmiri',
    'direction': 'rtl',
    'local_title': 'कश्मीरी'
  },
  'ksh': {
    'english_title': 'Ripuarian',
    'direction': 'ltr',
    'local_title': 'Ripoarisch'
  },
  'ku': {
    'english_title': 'Kurdish',
    'direction': 'rtl',
    'local_title': 'Kurdî'
  },
  'kv': {
    'english_title': 'Komi',
    'direction': 'ltr',
    'local_title': 'Коми'
  },
  'kw': {
    'english_title': 'Cornish',
    'direction': 'ltr',
    'local_title': 'Kernewek'
  },
  'ky': {
    'english_title': 'Kirghiz',
    'direction': 'ltr',
    'local_title': 'Kırgızca'
  },
  'la': {
    'english_title': 'Latin',
    'direction': 'ltr',
    'local_title': 'Latina'
  },
  'lad': {
    'english_title': 'Ladino',
    'direction': 'ltr',
    'local_title': 'Dzhudezmo'
  },
  'lan': {
    'english_title': 'Lango',
    'direction': 'ltr',
    'local_title': 'Leb'
  },
  'lb': {
    'english_title': 'Luxembourgish',
    'direction': 'ltr',
    'local_title': 'Lëtzebuergesch'
  },
  'lg': {
    'english_title': 'Ganda',
    'direction': 'ltr',
    'local_title': 'Luganda'
  },
  'li': {
    'english_title': 'Limburgian',
    'direction': 'ltr',
    'local_title': 'Limburgs'
  },
  'lij': {
    'english_title': 'Ligurian',
    'direction': 'ltr',
    'local_title': 'Líguru'
  },
  'lmo': {
    'english_title': 'Lombard',
    'direction': 'ltr',
    'local_title': 'Lumbaart'
  },
  'ln': {
    'english_title': 'Lingala',
    'direction': 'ltr',
    'local_title': 'Lingála'
  },
  'lo': {
    'english_title': 'Laotian',
    'direction': 'ltr',
    'local_title': 'ລາວ'
  },
  'lt': {
    'english_title': 'Lithuanian',
    'direction': 'ltr',
    'local_title': 'Lietuvių'
  },
  'lv': {
    'english_title': 'Latvian',
    'direction': 'ltr',
    'local_title': 'Latviešu'
  },
  'map-bms': {
    'english_title': 'Banyumasan',
    'direction': 'ltr',
    'local_title': 'Basa'
  },
  'mg': {
    'english_title': 'Malagasy',
    'direction': 'ltr',
    'local_title': 'Malagasy'
  },
  'man': {
    'english_title': 'Mandarin',
    'direction': 'ltr',
    'local_title': '官話'
  },
  'mh': {
    'english_title': 'Marshallese',
    'direction': 'ltr',
    'local_title': 'Kajin'
  },
  'mi': {
    'english_title': 'Maori',
    'direction': 'ltr',
    'local_title': 'Māori'
  },
  'min': {
    'english_title': 'Minangkabau',
    'direction': 'ltr',
    'local_title': 'Minangkabau'
  },
  'mk': {
    'english_title': 'Macedonian',
    'direction': 'ltr',
    'local_title': 'Македонски'
  },
  'ml': {
    'english_title': 'Malayalam',
    'direction': 'ltr',
    'local_title': 'മലയാളം'
  },
  'mn': {
    'english_title': 'Mongolian',
    'direction': 'ltr',
    'local_title': 'Монгол'
  },
  'mo': {
    'english_title': 'Moldovan',
    'direction': 'ltr',
    'local_title': 'Moldovenească'
  },
  'mr': {
    'english_title': 'Marathi',
    'direction': 'ltr',
    'local_title': 'मराठी'
  },
  'ms': {
    'english_title': 'Malay',
    'direction': 'ltr',
    'local_title': 'Bahasa'
  },
  'mt': {
    'english_title': 'Maltese',
    'direction': 'ltr',
    'local_title': 'bil-Malti'
  },
  'mus': {
    'english_title': 'Creek',
    'direction': 'ltr',
    'local_title': 'Muskogee'
  },
  'my': {
    'english_title': 'Burmese',
    'direction': 'ltr',
    'local_title': 'Myanmasa'
  },
  'na': {
    'english_title': 'Nauruan',
    'direction': 'ltr',
    'local_title': 'Dorerin'
  },
  'nah': {
    'english_title': 'Nahuatl',
    'direction': 'ltr',
    'local_title': 'Nahuatl'
  },
  'nap': {
    'english_title': 'Neapolitan',
    'direction': 'ltr',
    'local_title': 'Nnapulitano'
  },
  'nd': {
    'english_title': 'North',
    'direction': 'Ndebele',
    'local_title': 'ltr'
  },
  'nds': {
    'english_title': 'Low German',
    'direction': 'ltr',
    'local_title': 'Plattdüütsch'
  },
  'nds-nl': {
    'english_title': 'Dutch',
    'direction': 'Low',
    'local_title': 'Saxon'
  },
  'ne': {
    'english_title': 'Nepali',
    'direction': 'ltr',
    'local_title': 'नेपाली'
  },
  'new': {
    'english_title': 'Newar',
    'direction': 'ltr',
    'local_title': 'नेपालभाषा'
  },
  'ng': {
    'english_title': 'Ndonga',
    'direction': 'ltr',
    'local_title': 'Oshiwambo'
  },
  'nl': {
    'english_title': 'Dutch',
    'direction': 'ltr',
    'local_title': 'Nederlands'
  },
  'nn': {
    'english_title': 'Norwegian',
    'direction': 'Nynorsk',
    'local_title': 'ltr'
  },
  'no': {
    'english_title': 'Norwegian',
    'direction': 'ltr',
    'local_title': 'Norsk'
  },
  'nr': {
    'english_title': 'South',
    'direction': 'Ndebele',
    'local_title': 'ltr'
  },
  'nso': {
    'english_title': 'Northern',
    'direction': 'Sotho',
    'local_title': 'ltr'
  },
  'nrm': {
    'english_title': 'Norman',
    'direction': 'ltr',
    'local_title': 'Nouormand'
  },
  'nv': {
    'english_title': 'Navajo',
    'direction': 'ltr',
    'local_title': 'Diné'
  },
  'ny': {
    'english_title': 'Chichewa',
    'direction': 'ltr',
    'local_title': 'Chi-Chewa'
  },
  'oc': {
    'english_title': 'Occitan',
    'direction': 'ltr',
    'local_title': 'Occitan'
  },
  'oj': {
    'english_title': 'Ojibwa',
    'direction': 'ltr',
    'local_title': 'ᐊᓂᔑᓈᐯᒧᐎᓐ'
  },
  'om': {
    'english_title': 'Oromo',
    'direction': 'ltr',
    'local_title': 'Oromoo'
  },
  'or': {
    'english_title': 'Oriya',
    'direction': 'ltr',
    'local_title': 'ଓଡ଼ିଆ'
  },
  'os': {
    'english_title': 'Ossetian',
    'direction': 'ltr',
    'local_title': 'Иронау'
  },
  'pa': {
    'english_title': 'Panjabi',
    'direction': 'ltr',
    'local_title': 'ਪੰਜਾਬੀ'
  },
  'pag': {
    'english_title': 'Pangasinan',
    'direction': 'ltr',
    'local_title': 'Pangasinan'
  },
  'pam': {
    'english_title': 'Kapampangan',
    'direction': 'ltr',
    'local_title': 'Kapampangan'
  },
  'pap': {
    'english_title': 'Papiamentu',
    'direction': 'ltr',
    'local_title': 'Papiamentu'
  },
  'pdc': {
    'english_title': 'Pennsylvania',
    'direction': 'German',
    'local_title': 'ltr'
  },
  'pi': {
    'english_title': 'Pali',
    'direction': 'ltr',
    'local_title': 'Pāli'
  },
  'pih': {
    'english_title': 'Norfolk',
    'direction': 'ltr',
    'local_title': 'Norfuk'
  },
  'pl': {
    'english_title': 'Polish',
    'direction': 'ltr',
    'local_title': 'Polski'
  },
  'pms': {
    'english_title': 'Piedmontese',
    'direction': 'ltr',
    'local_title': 'Piemontèis'
  },
  'ps': {
    'english_title': 'Pashto',
    'direction': 'rtl',
    'local_title': 'پښتو'
  },
  'pt': {
    'english_title': 'Portuguese',
    'direction': 'ltr',
    'local_title': 'Português'
  },
  'qu': {
    'english_title': 'Quechua',
    'direction': 'ltr',
    'local_title': 'Runa'
  },
  'rm': {
    'english_title': 'Raeto',
    'direction': 'Romance',
    'local_title': 'ltr'
  },
  'rmy': {
    'english_title': 'Romani',
    'direction': 'ltr',
    'local_title': 'Romani'
  },
  'rn': {
    'english_title': 'Kirundi',
    'direction': 'ltr',
    'local_title': 'Kirundi'
  },
  'ro': {
    'english_title': 'Romanian',
    'direction': 'ltr',
    'local_title': 'Română'
  },
  'roa-rup': {
    'english_title': 'Aromanian',
    'direction': 'ltr',
    'local_title': 'Armâneashti'
  },
  'ru': {
    'english_title': 'Russian',
    'direction': 'ltr',
    'local_title': 'Русский'
  },
  'rw': {
    'english_title': 'Rwandi',
    'direction': 'ltr',
    'local_title': 'Kinyarwandi'
  },
  'sa': {
    'english_title': 'Sanskrit',
    'direction': 'ltr',
    'local_title': 'संस्कृतम्'
  },
  'sc': {
    'english_title': 'Sardinian',
    'direction': 'ltr',
    'local_title': 'Sardu'
  },
  'scn': {
    'english_title': 'Sicilian',
    'direction': 'ltr',
    'local_title': 'Sicilianu'
  },
  'sco': {
    'english_title': 'Scots',
    'direction': 'ltr',
    'local_title': 'Scots'
  },
  'sd': {
    'english_title': 'Sindhi',
    'direction': 'ltr',
    'local_title': 'सिनधि'
  },
  'se': {
    'english_title': 'Northern',
    'direction': 'Sami',
    'local_title': 'ltr'
  },
  'sg': {
    'english_title': 'Sango',
    'direction': 'ltr',
    'local_title': 'Sängö'
  },
  'sh': {
    'english_title': 'Serbo-Croatian',
    'direction': 'ltr',
    'local_title': 'Srpskohrvatski'
  },
  'si': {
    'english_title': 'Sinhalese',
    'direction': 'ltr',
    'local_title': 'සිංහල'
  },
  'simple': {
    'english_title': 'Simple',
    'direction': 'English',
    'local_title': 'ltr'
  },
  'sk': {
    'english_title': 'Slovak',
    'direction': 'ltr',
    'local_title': 'Slovenčina'
  },
  'sl': {
    'english_title': 'Slovenian',
    'direction': 'ltr',
    'local_title': 'Slovenščina'
  },
  'sm': {
    'english_title': 'Samoan',
    'direction': 'ltr',
    'local_title': 'Gagana'
  },
  'sn': {
    'english_title': 'Shona',
    'direction': 'ltr',
    'local_title': 'chiShona'
  },
  'so': {
    'english_title': 'Somalia',
    'direction': 'ltr',
    'local_title': 'Soomaaliga'
  },
  'sq': {
    'english_title': 'Albanian',
    'direction': 'ltr',
    'local_title': 'Shqip'
  },
  'sr': {
    'english_title': 'Serbian',
    'direction': 'ltr',
    'local_title': 'Српски'
  },
  'ss': {
    'english_title': 'Swati',
    'direction': 'ltr',
    'local_title': 'SiSwati'
  },
  'st': {
    'english_title': 'Southern',
    'direction': 'Sotho',
    'local_title': 'ltr'
  },
  'su': {
    'english_title': 'Sundanese',
    'direction': 'ltr',
    'local_title': 'Basa'
  },
  'sv': {
    'english_title': 'Swedish',
    'direction': 'ltr',
    'local_title': 'Svenska'
  },
  'sw': {
    'english_title': 'Swahili',
    'direction': 'ltr',
    'local_title': 'Kiswahili'
  },
  'ta': {
    'english_title': 'Tamil',
    'direction': 'ltr',
    'local_title': 'தமிழ்'
  },
  'te': {
    'english_title': 'Telugu',
    'direction': 'ltr',
    'local_title': 'తెలుగు'
  },
  'tet': {
    'english_title': 'Tetum',
    'direction': 'ltr',
    'local_title': 'Tetun'
  },
  'tg': {
    'english_title': 'Tajik',
    'direction': 'ltr',
    'local_title': 'Тоҷикӣ'
  },
  'th': {
    'english_title': 'Thai',
    'direction': 'ltr',
    'local_title': 'ไทย'
  },
  'ti': {
    'english_title': 'Tigrinya',
    'direction': 'ltr',
    'local_title': 'ትግርኛ'
  },
  'tk': {
    'english_title': 'Turkmen',
    'direction': 'ltr',
    'local_title': 'Туркмен'
  },
  'tl': {
    'english_title': 'Tagalog',
    'direction': 'ltr',
    'local_title': 'Tagalog'
  },
  'tlh': {
    'english_title': 'Klingon',
    'direction': 'ltr',
    'local_title': 'tlhIngan-Hol'
  },
  'tn': {
    'english_title': 'Tswana',
    'direction': 'ltr',
    'local_title': 'Setswana'
  },
  'to': {
    'english_title': 'Tonga',
    'direction': 'ltr',
    'local_title': 'Lea'
  },
  'tpi': {
    'english_title': 'Tok',
    'direction': 'Pisin',
    'local_title': 'ltr'
  },
  'tr': {
    'english_title': 'Turkish',
    'direction': 'ltr',
    'local_title': 'Türkçe'
  },
  'ts': {
    'english_title': 'Tsonga',
    'direction': 'ltr',
    'local_title': 'Xitsonga'
  },
  'tt': {
    'english_title': 'Tatar',
    'direction': 'ltr',
    'local_title': 'Tatarça'
  },
  'tum': {
    'english_title': 'Tumbuka',
    'direction': 'ltr',
    'local_title': 'chiTumbuka'
  },
  'tw': {
    'english_title': 'Twi',
    'direction': 'ltr',
    'local_title': 'Twi'
  },
  'ty': {
    'english_title': 'Tahitian',
    'direction': 'ltr',
    'local_title': 'Reo'
  },
  'udm': {
    'english_title': 'Udmurt',
    'direction': 'ltr',
    'local_title': 'Удмурт'
  },
  'ug': {
    'english_title': 'Uyghur',
    'direction': 'ltr',
    'local_title': 'Uyƣurqə'
  },
  'uk': {
    'english_title': 'Ukrainian',
    'direction': 'ltr',
    'local_title': 'Українська'
  },
  'ur': {
    'english_title': 'Urdu',
    'direction': 'rtl',
    'local_title': 'اردو'
  },
  'uz': {
    'english_title': 'Uzbek',
    'direction': 'ltr',
    'local_title': 'Ўзбек'
  },
  've': {
    'english_title': 'Venda',
    'direction': 'ltr',
    'local_title': 'Tshivenḓa'
  },
  'vi': {
    'english_title': 'Vietnamese',
    'direction': 'ltr',
    'local_title': 'Việtnam'
  },
  'vec': {
    'english_title': 'Venetian',
    'direction': 'ltr',
    'local_title': 'Vèneto'
  },
  'vls': {
    'english_title': 'West',
    'direction': 'Flemish',
    'local_title': 'ltr'
  },
  'vo': {
    'english_title': 'Volapük',
    'direction': 'ltr',
    'local_title': 'Volapük'
  },
  'wa': {
    'english_title': 'Walloon',
    'direction': 'ltr',
    'local_title': 'Walon'
  },
  'war': {
    'english_title': 'Waray-Waray',
    'direction': 'ltr',
    'local_title': 'Winaray'
  },
  'wo': {
    'english_title': 'Wolof',
    'direction': 'ltr',
    'local_title': 'Wollof'
  },
  'xal': {
    'english_title': 'Kalmyk',
    'direction': 'ltr',
    'local_title': 'Хальмг'
  },
  'xh': {
    'english_title': 'Xhosa',
    'direction': 'ltr',
    'local_title': 'isiXhosa'
  },
  'yi': {
    'english_title': 'Yiddish',
    'direction': 'rtl',
    'local_title': 'ייִדיש'
  },
  'yo': {
    'english_title': 'Yoruba',
    'direction': 'ltr',
    'local_title': 'Yorùbá'
  },
  'za': {
    'english_title': 'Zhuang',
    'direction': 'ltr',
    'local_title': 'Cuengh'
  },
  'zh': {
    'english_title': 'Chinese',
    'direction': 'ltr',
    'local_title': '中文'
  },
  'zh-classical': {
    'english_title': 'Classical',
    'direction': 'Chinese',
    'local_title': 'ltr'
  },
  'zh-min-nan': {
    'english_title': 'Minnan',
    'direction': 'ltr',
    'local_title': 'Bân-lâm-gú'
  },
  'zh-yue': {
    'english_title': 'Cantonese',
    'direction': 'ltr',
    'local_title': '粵語'
  },
  'zu': {
    'english_title': 'Zulu',
    'direction': 'ltr',
    'local_title': 'isiZulu'
  }
};

},{}],8:[function(_dereq_,module,exports){
'use strict';

//from https://en.wikipedia.org/w/api.php?action=sitematrix&format=json
var site_map = {
  'aawiki': 'http://aa.wikipedia.org',
  'aawiktionary': 'http://aa.wiktionary.org',
  'aawikibooks': 'http://aa.wikibooks.org',
  'abwiki': 'http://ab.wikipedia.org',
  'abwiktionary': 'http://ab.wiktionary.org',
  'acewiki': 'http://ace.wikipedia.org',
  'afwiki': 'http://af.wikipedia.org',
  'afwiktionary': 'http://af.wiktionary.org',
  'afwikibooks': 'http://af.wikibooks.org',
  'afwikiquote': 'http://af.wikiquote.org',
  'akwiki': 'http://ak.wikipedia.org',
  'akwiktionary': 'http://ak.wiktionary.org',
  'akwikibooks': 'http://ak.wikibooks.org',
  'alswiki': 'http://als.wikipedia.org',
  'alswiktionary': 'http://als.wiktionary.org',
  'alswikibooks': 'http://als.wikibooks.org',
  'alswikiquote': 'http://als.wikiquote.org',
  'amwiki': 'http://am.wikipedia.org',
  'amwiktionary': 'http://am.wiktionary.org',
  'amwikiquote': 'http://am.wikiquote.org',
  'anwiki': 'http://an.wikipedia.org',
  'anwiktionary': 'http://an.wiktionary.org',
  'angwiki': 'http://ang.wikipedia.org',
  'angwiktionary': 'http://ang.wiktionary.org',
  'angwikibooks': 'http://ang.wikibooks.org',
  'angwikiquote': 'http://ang.wikiquote.org',
  'angwikisource': 'http://ang.wikisource.org',
  'arwiki': 'http://ar.wikipedia.org',
  'arwiktionary': 'http://ar.wiktionary.org',
  'arwikibooks': 'http://ar.wikibooks.org',
  'arwikinews': 'http://ar.wikinews.org',
  'arwikiquote': 'http://ar.wikiquote.org',
  'arwikisource': 'http://ar.wikisource.org',
  'arwikiversity': 'http://ar.wikiversity.org',
  'arcwiki': 'http://arc.wikipedia.org',
  'arzwiki': 'http://arz.wikipedia.org',
  'aswiki': 'http://as.wikipedia.org',
  'aswiktionary': 'http://as.wiktionary.org',
  'aswikibooks': 'http://as.wikibooks.org',
  'aswikisource': 'http://as.wikisource.org',
  'astwiki': 'http://ast.wikipedia.org',
  'astwiktionary': 'http://ast.wiktionary.org',
  'astwikibooks': 'http://ast.wikibooks.org',
  'astwikiquote': 'http://ast.wikiquote.org',
  'avwiki': 'http://av.wikipedia.org',
  'avwiktionary': 'http://av.wiktionary.org',
  'aywiki': 'http://ay.wikipedia.org',
  'aywiktionary': 'http://ay.wiktionary.org',
  'aywikibooks': 'http://ay.wikibooks.org',
  'azwiki': 'http://az.wikipedia.org',
  'azwiktionary': 'http://az.wiktionary.org',
  'azwikibooks': 'http://az.wikibooks.org',
  'azwikiquote': 'http://az.wikiquote.org',
  'azwikisource': 'http://az.wikisource.org',
  'bawiki': 'http://ba.wikipedia.org',
  'bawikibooks': 'http://ba.wikibooks.org',
  'barwiki': 'http://bar.wikipedia.org',
  'bat_smgwiki': 'http://bat-smg.wikipedia.org',
  'bclwiki': 'http://bcl.wikipedia.org',
  'bewiki': 'http://be.wikipedia.org',
  'bewiktionary': 'http://be.wiktionary.org',
  'bewikibooks': 'http://be.wikibooks.org',
  'bewikiquote': 'http://be.wikiquote.org',
  'bewikisource': 'http://be.wikisource.org',
  'be_x_oldwiki': 'http://be-x-old.wikipedia.org',
  'bgwiki': 'http://bg.wikipedia.org',
  'bgwiktionary': 'http://bg.wiktionary.org',
  'bgwikibooks': 'http://bg.wikibooks.org',
  'bgwikinews': 'http://bg.wikinews.org',
  'bgwikiquote': 'http://bg.wikiquote.org',
  'bgwikisource': 'http://bg.wikisource.org',
  'bhwiki': 'http://bh.wikipedia.org',
  'bhwiktionary': 'http://bh.wiktionary.org',
  'biwiki': 'http://bi.wikipedia.org',
  'biwiktionary': 'http://bi.wiktionary.org',
  'biwikibooks': 'http://bi.wikibooks.org',
  'bjnwiki': 'http://bjn.wikipedia.org',
  'bmwiki': 'http://bm.wikipedia.org',
  'bmwiktionary': 'http://bm.wiktionary.org',
  'bmwikibooks': 'http://bm.wikibooks.org',
  'bmwikiquote': 'http://bm.wikiquote.org',
  'bnwiki': 'http://bn.wikipedia.org',
  'bnwiktionary': 'http://bn.wiktionary.org',
  'bnwikibooks': 'http://bn.wikibooks.org',
  'bnwikisource': 'http://bn.wikisource.org',
  'bowiki': 'http://bo.wikipedia.org',
  'bowiktionary': 'http://bo.wiktionary.org',
  'bowikibooks': 'http://bo.wikibooks.org',
  'bpywiki': 'http://bpy.wikipedia.org',
  'brwiki': 'http://br.wikipedia.org',
  'brwiktionary': 'http://br.wiktionary.org',
  'brwikiquote': 'http://br.wikiquote.org',
  'brwikisource': 'http://br.wikisource.org',
  'bswiki': 'http://bs.wikipedia.org',
  'bswiktionary': 'http://bs.wiktionary.org',
  'bswikibooks': 'http://bs.wikibooks.org',
  'bswikinews': 'http://bs.wikinews.org',
  'bswikiquote': 'http://bs.wikiquote.org',
  'bswikisource': 'http://bs.wikisource.org',
  'bugwiki': 'http://bug.wikipedia.org',
  'bxrwiki': 'http://bxr.wikipedia.org',
  'cawiki': 'http://ca.wikipedia.org',
  'cawiktionary': 'http://ca.wiktionary.org',
  'cawikibooks': 'http://ca.wikibooks.org',
  'cawikinews': 'http://ca.wikinews.org',
  'cawikiquote': 'http://ca.wikiquote.org',
  'cawikisource': 'http://ca.wikisource.org',
  'cbk_zamwiki': 'http://cbk-zam.wikipedia.org',
  'cdowiki': 'http://cdo.wikipedia.org',
  'cewiki': 'http://ce.wikipedia.org',
  'cebwiki': 'http://ceb.wikipedia.org',
  'chwiki': 'http://ch.wikipedia.org',
  'chwiktionary': 'http://ch.wiktionary.org',
  'chwikibooks': 'http://ch.wikibooks.org',
  'chowiki': 'http://cho.wikipedia.org',
  'chrwiki': 'http://chr.wikipedia.org',
  'chrwiktionary': 'http://chr.wiktionary.org',
  'chywiki': 'http://chy.wikipedia.org',
  'ckbwiki': 'http://ckb.wikipedia.org',
  'cowiki': 'http://co.wikipedia.org',
  'cowiktionary': 'http://co.wiktionary.org',
  'cowikibooks': 'http://co.wikibooks.org',
  'cowikiquote': 'http://co.wikiquote.org',
  'crwiki': 'http://cr.wikipedia.org',
  'crwiktionary': 'http://cr.wiktionary.org',
  'crwikiquote': 'http://cr.wikiquote.org',
  'crhwiki': 'http://crh.wikipedia.org',
  'cswiki': 'http://cs.wikipedia.org',
  'cswiktionary': 'http://cs.wiktionary.org',
  'cswikibooks': 'http://cs.wikibooks.org',
  'cswikinews': 'http://cs.wikinews.org',
  'cswikiquote': 'http://cs.wikiquote.org',
  'cswikisource': 'http://cs.wikisource.org',
  'cswikiversity': 'http://cs.wikiversity.org',
  'csbwiki': 'http://csb.wikipedia.org',
  'csbwiktionary': 'http://csb.wiktionary.org',
  'cuwiki': 'http://cu.wikipedia.org',
  'cvwiki': 'http://cv.wikipedia.org',
  'cvwikibooks': 'http://cv.wikibooks.org',
  'cywiki': 'http://cy.wikipedia.org',
  'cywiktionary': 'http://cy.wiktionary.org',
  'cywikibooks': 'http://cy.wikibooks.org',
  'cywikiquote': 'http://cy.wikiquote.org',
  'cywikisource': 'http://cy.wikisource.org',
  'dawiki': 'http://da.wikipedia.org',
  'dawiktionary': 'http://da.wiktionary.org',
  'dawikibooks': 'http://da.wikibooks.org',
  'dawikiquote': 'http://da.wikiquote.org',
  'dawikisource': 'http://da.wikisource.org',
  'dewiki': 'http://de.wikipedia.org',
  'dewiktionary': 'http://de.wiktionary.org',
  'dewikibooks': 'http://de.wikibooks.org',
  'dewikinews': 'http://de.wikinews.org',
  'dewikiquote': 'http://de.wikiquote.org',
  'dewikisource': 'http://de.wikisource.org',
  'dewikiversity': 'http://de.wikiversity.org',
  'dewikivoyage': 'http://de.wikivoyage.org',
  'diqwiki': 'http://diq.wikipedia.org',
  'dsbwiki': 'http://dsb.wikipedia.org',
  'dvwiki': 'http://dv.wikipedia.org',
  'dvwiktionary': 'http://dv.wiktionary.org',
  'dzwiki': 'http://dz.wikipedia.org',
  'dzwiktionary': 'http://dz.wiktionary.org',
  'eewiki': 'http://ee.wikipedia.org',
  'elwiki': 'http://el.wikipedia.org',
  'elwiktionary': 'http://el.wiktionary.org',
  'elwikibooks': 'http://el.wikibooks.org',
  'elwikinews': 'http://el.wikinews.org',
  'elwikiquote': 'http://el.wikiquote.org',
  'elwikisource': 'http://el.wikisource.org',
  'elwikiversity': 'http://el.wikiversity.org',
  'elwikivoyage': 'http://el.wikivoyage.org',
  'emlwiki': 'http://eml.wikipedia.org',
  'enwiki': 'http://en.wikipedia.org',
  'enwiktionary': 'http://en.wiktionary.org',
  'enwikibooks': 'http://en.wikibooks.org',
  'enwikinews': 'http://en.wikinews.org',
  'enwikiquote': 'http://en.wikiquote.org',
  'enwikisource': 'http://en.wikisource.org',
  'enwikiversity': 'http://en.wikiversity.org',
  'enwikivoyage': 'http://en.wikivoyage.org',
  'eowiki': 'http://eo.wikipedia.org',
  'eowiktionary': 'http://eo.wiktionary.org',
  'eowikibooks': 'http://eo.wikibooks.org',
  'eowikinews': 'http://eo.wikinews.org',
  'eowikiquote': 'http://eo.wikiquote.org',
  'eowikisource': 'http://eo.wikisource.org',
  'eswiki': 'http://es.wikipedia.org',
  'eswiktionary': 'http://es.wiktionary.org',
  'eswikibooks': 'http://es.wikibooks.org',
  'eswikinews': 'http://es.wikinews.org',
  'eswikiquote': 'http://es.wikiquote.org',
  'eswikisource': 'http://es.wikisource.org',
  'eswikiversity': 'http://es.wikiversity.org',
  'eswikivoyage': 'http://es.wikivoyage.org',
  'etwiki': 'http://et.wikipedia.org',
  'etwiktionary': 'http://et.wiktionary.org',
  'etwikibooks': 'http://et.wikibooks.org',
  'etwikiquote': 'http://et.wikiquote.org',
  'etwikisource': 'http://et.wikisource.org',
  'euwiki': 'http://eu.wikipedia.org',
  'euwiktionary': 'http://eu.wiktionary.org',
  'euwikibooks': 'http://eu.wikibooks.org',
  'euwikiquote': 'http://eu.wikiquote.org',
  'extwiki': 'http://ext.wikipedia.org',
  'fawiki': 'http://fa.wikipedia.org',
  'fawiktionary': 'http://fa.wiktionary.org',
  'fawikibooks': 'http://fa.wikibooks.org',
  'fawikinews': 'http://fa.wikinews.org',
  'fawikiquote': 'http://fa.wikiquote.org',
  'fawikisource': 'http://fa.wikisource.org',
  'fawikivoyage': 'http://fa.wikivoyage.org',
  'ffwiki': 'http://ff.wikipedia.org',
  'fiwiki': 'http://fi.wikipedia.org',
  'fiwiktionary': 'http://fi.wiktionary.org',
  'fiwikibooks': 'http://fi.wikibooks.org',
  'fiwikinews': 'http://fi.wikinews.org',
  'fiwikiquote': 'http://fi.wikiquote.org',
  'fiwikisource': 'http://fi.wikisource.org',
  'fiwikiversity': 'http://fi.wikiversity.org',
  'fiu_vrowiki': 'http://fiu-vro.wikipedia.org',
  'fjwiki': 'http://fj.wikipedia.org',
  'fjwiktionary': 'http://fj.wiktionary.org',
  'fowiki': 'http://fo.wikipedia.org',
  'fowiktionary': 'http://fo.wiktionary.org',
  'fowikisource': 'http://fo.wikisource.org',
  'frwiki': 'http://fr.wikipedia.org',
  'frwiktionary': 'http://fr.wiktionary.org',
  'frwikibooks': 'http://fr.wikibooks.org',
  'frwikinews': 'http://fr.wikinews.org',
  'frwikiquote': 'http://fr.wikiquote.org',
  'frwikisource': 'http://fr.wikisource.org',
  'frwikiversity': 'http://fr.wikiversity.org',
  'frwikivoyage': 'http://fr.wikivoyage.org',
  'frpwiki': 'http://frp.wikipedia.org',
  'frrwiki': 'http://frr.wikipedia.org',
  'furwiki': 'http://fur.wikipedia.org',
  'fywiki': 'http://fy.wikipedia.org',
  'fywiktionary': 'http://fy.wiktionary.org',
  'fywikibooks': 'http://fy.wikibooks.org',
  'gawiki': 'http://ga.wikipedia.org',
  'gawiktionary': 'http://ga.wiktionary.org',
  'gawikibooks': 'http://ga.wikibooks.org',
  'gawikiquote': 'http://ga.wikiquote.org',
  'gagwiki': 'http://gag.wikipedia.org',
  'ganwiki': 'http://gan.wikipedia.org',
  'gdwiki': 'http://gd.wikipedia.org',
  'gdwiktionary': 'http://gd.wiktionary.org',
  'glwiki': 'http://gl.wikipedia.org',
  'glwiktionary': 'http://gl.wiktionary.org',
  'glwikibooks': 'http://gl.wikibooks.org',
  'glwikiquote': 'http://gl.wikiquote.org',
  'glwikisource': 'http://gl.wikisource.org',
  'glkwiki': 'http://glk.wikipedia.org',
  'gnwiki': 'http://gn.wikipedia.org',
  'gnwiktionary': 'http://gn.wiktionary.org',
  'gnwikibooks': 'http://gn.wikibooks.org',
  'gotwiki': 'http://got.wikipedia.org',
  'gotwikibooks': 'http://got.wikibooks.org',
  'guwiki': 'http://gu.wikipedia.org',
  'guwiktionary': 'http://gu.wiktionary.org',
  'guwikibooks': 'http://gu.wikibooks.org',
  'guwikiquote': 'http://gu.wikiquote.org',
  'guwikisource': 'http://gu.wikisource.org',
  'gvwiki': 'http://gv.wikipedia.org',
  'gvwiktionary': 'http://gv.wiktionary.org',
  'hawiki': 'http://ha.wikipedia.org',
  'hawiktionary': 'http://ha.wiktionary.org',
  'hakwiki': 'http://hak.wikipedia.org',
  'hawwiki': 'http://haw.wikipedia.org',
  'hewiki': 'http://he.wikipedia.org',
  'hewiktionary': 'http://he.wiktionary.org',
  'hewikibooks': 'http://he.wikibooks.org',
  'hewikinews': 'http://he.wikinews.org',
  'hewikiquote': 'http://he.wikiquote.org',
  'hewikisource': 'http://he.wikisource.org',
  'hewikivoyage': 'http://he.wikivoyage.org',
  'hiwiki': 'http://hi.wikipedia.org',
  'hiwiktionary': 'http://hi.wiktionary.org',
  'hiwikibooks': 'http://hi.wikibooks.org',
  'hiwikiquote': 'http://hi.wikiquote.org',
  'hifwiki': 'http://hif.wikipedia.org',
  'howiki': 'http://ho.wikipedia.org',
  'hrwiki': 'http://hr.wikipedia.org',
  'hrwiktionary': 'http://hr.wiktionary.org',
  'hrwikibooks': 'http://hr.wikibooks.org',
  'hrwikiquote': 'http://hr.wikiquote.org',
  'hrwikisource': 'http://hr.wikisource.org',
  'hsbwiki': 'http://hsb.wikipedia.org',
  'hsbwiktionary': 'http://hsb.wiktionary.org',
  'htwiki': 'http://ht.wikipedia.org',
  'htwikisource': 'http://ht.wikisource.org',
  'huwiki': 'http://hu.wikipedia.org',
  'huwiktionary': 'http://hu.wiktionary.org',
  'huwikibooks': 'http://hu.wikibooks.org',
  'huwikinews': 'http://hu.wikinews.org',
  'huwikiquote': 'http://hu.wikiquote.org',
  'huwikisource': 'http://hu.wikisource.org',
  'hywiki': 'http://hy.wikipedia.org',
  'hywiktionary': 'http://hy.wiktionary.org',
  'hywikibooks': 'http://hy.wikibooks.org',
  'hywikiquote': 'http://hy.wikiquote.org',
  'hywikisource': 'http://hy.wikisource.org',
  'hzwiki': 'http://hz.wikipedia.org',
  'iawiki': 'http://ia.wikipedia.org',
  'iawiktionary': 'http://ia.wiktionary.org',
  'iawikibooks': 'http://ia.wikibooks.org',
  'idwiki': 'http://id.wikipedia.org',
  'idwiktionary': 'http://id.wiktionary.org',
  'idwikibooks': 'http://id.wikibooks.org',
  'idwikiquote': 'http://id.wikiquote.org',
  'idwikisource': 'http://id.wikisource.org',
  'iewiki': 'http://ie.wikipedia.org',
  'iewiktionary': 'http://ie.wiktionary.org',
  'iewikibooks': 'http://ie.wikibooks.org',
  'igwiki': 'http://ig.wikipedia.org',
  'iiwiki': 'http://ii.wikipedia.org',
  'ikwiki': 'http://ik.wikipedia.org',
  'ikwiktionary': 'http://ik.wiktionary.org',
  'ilowiki': 'http://ilo.wikipedia.org',
  'iowiki': 'http://io.wikipedia.org',
  'iowiktionary': 'http://io.wiktionary.org',
  'iswiki': 'http://is.wikipedia.org',
  'iswiktionary': 'http://is.wiktionary.org',
  'iswikibooks': 'http://is.wikibooks.org',
  'iswikiquote': 'http://is.wikiquote.org',
  'iswikisource': 'http://is.wikisource.org',
  'itwiki': 'http://it.wikipedia.org',
  'itwiktionary': 'http://it.wiktionary.org',
  'itwikibooks': 'http://it.wikibooks.org',
  'itwikinews': 'http://it.wikinews.org',
  'itwikiquote': 'http://it.wikiquote.org',
  'itwikisource': 'http://it.wikisource.org',
  'itwikiversity': 'http://it.wikiversity.org',
  'itwikivoyage': 'http://it.wikivoyage.org',
  'iuwiki': 'http://iu.wikipedia.org',
  'iuwiktionary': 'http://iu.wiktionary.org',
  'jawiki': 'http://ja.wikipedia.org',
  'jawiktionary': 'http://ja.wiktionary.org',
  'jawikibooks': 'http://ja.wikibooks.org',
  'jawikinews': 'http://ja.wikinews.org',
  'jawikiquote': 'http://ja.wikiquote.org',
  'jawikisource': 'http://ja.wikisource.org',
  'jawikiversity': 'http://ja.wikiversity.org',
  'jbowiki': 'http://jbo.wikipedia.org',
  'jbowiktionary': 'http://jbo.wiktionary.org',
  'jvwiki': 'http://jv.wikipedia.org',
  'jvwiktionary': 'http://jv.wiktionary.org',
  'kawiki': 'http://ka.wikipedia.org',
  'kawiktionary': 'http://ka.wiktionary.org',
  'kawikibooks': 'http://ka.wikibooks.org',
  'kawikiquote': 'http://ka.wikiquote.org',
  'kaawiki': 'http://kaa.wikipedia.org',
  'kabwiki': 'http://kab.wikipedia.org',
  'kbdwiki': 'http://kbd.wikipedia.org',
  'kgwiki': 'http://kg.wikipedia.org',
  'kiwiki': 'http://ki.wikipedia.org',
  'kjwiki': 'http://kj.wikipedia.org',
  'kkwiki': 'http://kk.wikipedia.org',
  'kkwiktionary': 'http://kk.wiktionary.org',
  'kkwikibooks': 'http://kk.wikibooks.org',
  'kkwikiquote': 'http://kk.wikiquote.org',
  'klwiki': 'http://kl.wikipedia.org',
  'klwiktionary': 'http://kl.wiktionary.org',
  'kmwiki': 'http://km.wikipedia.org',
  'kmwiktionary': 'http://km.wiktionary.org',
  'kmwikibooks': 'http://km.wikibooks.org',
  'knwiki': 'http://kn.wikipedia.org',
  'knwiktionary': 'http://kn.wiktionary.org',
  'knwikibooks': 'http://kn.wikibooks.org',
  'knwikiquote': 'http://kn.wikiquote.org',
  'knwikisource': 'http://kn.wikisource.org',
  'kowiki': 'http://ko.wikipedia.org',
  'kowiktionary': 'http://ko.wiktionary.org',
  'kowikibooks': 'http://ko.wikibooks.org',
  'kowikinews': 'http://ko.wikinews.org',
  'kowikiquote': 'http://ko.wikiquote.org',
  'kowikisource': 'http://ko.wikisource.org',
  'kowikiversity': 'http://ko.wikiversity.org',
  'koiwiki': 'http://koi.wikipedia.org',
  'krwiki': 'http://kr.wikipedia.org',
  'krwikiquote': 'http://kr.wikiquote.org',
  'krcwiki': 'http://krc.wikipedia.org',
  'kswiki': 'http://ks.wikipedia.org',
  'kswiktionary': 'http://ks.wiktionary.org',
  'kswikibooks': 'http://ks.wikibooks.org',
  'kswikiquote': 'http://ks.wikiquote.org',
  'kshwiki': 'http://ksh.wikipedia.org',
  'kuwiki': 'http://ku.wikipedia.org',
  'kuwiktionary': 'http://ku.wiktionary.org',
  'kuwikibooks': 'http://ku.wikibooks.org',
  'kuwikiquote': 'http://ku.wikiquote.org',
  'kvwiki': 'http://kv.wikipedia.org',
  'kwwiki': 'http://kw.wikipedia.org',
  'kwwiktionary': 'http://kw.wiktionary.org',
  'kwwikiquote': 'http://kw.wikiquote.org',
  'kywiki': 'http://ky.wikipedia.org',
  'kywiktionary': 'http://ky.wiktionary.org',
  'kywikibooks': 'http://ky.wikibooks.org',
  'kywikiquote': 'http://ky.wikiquote.org',
  'lawiki': 'http://la.wikipedia.org',
  'lawiktionary': 'http://la.wiktionary.org',
  'lawikibooks': 'http://la.wikibooks.org',
  'lawikiquote': 'http://la.wikiquote.org',
  'lawikisource': 'http://la.wikisource.org',
  'ladwiki': 'http://lad.wikipedia.org',
  'lbwiki': 'http://lb.wikipedia.org',
  'lbwiktionary': 'http://lb.wiktionary.org',
  'lbwikibooks': 'http://lb.wikibooks.org',
  'lbwikiquote': 'http://lb.wikiquote.org',
  'lbewiki': 'http://lbe.wikipedia.org',
  'lezwiki': 'http://lez.wikipedia.org',
  'lgwiki': 'http://lg.wikipedia.org',
  'liwiki': 'http://li.wikipedia.org',
  'liwiktionary': 'http://li.wiktionary.org',
  'liwikibooks': 'http://li.wikibooks.org',
  'liwikiquote': 'http://li.wikiquote.org',
  'liwikisource': 'http://li.wikisource.org',
  'lijwiki': 'http://lij.wikipedia.org',
  'lmowiki': 'http://lmo.wikipedia.org',
  'lnwiki': 'http://ln.wikipedia.org',
  'lnwiktionary': 'http://ln.wiktionary.org',
  'lnwikibooks': 'http://ln.wikibooks.org',
  'lowiki': 'http://lo.wikipedia.org',
  'lowiktionary': 'http://lo.wiktionary.org',
  'ltwiki': 'http://lt.wikipedia.org',
  'ltwiktionary': 'http://lt.wiktionary.org',
  'ltwikibooks': 'http://lt.wikibooks.org',
  'ltwikiquote': 'http://lt.wikiquote.org',
  'ltwikisource': 'http://lt.wikisource.org',
  'ltgwiki': 'http://ltg.wikipedia.org',
  'lvwiki': 'http://lv.wikipedia.org',
  'lvwiktionary': 'http://lv.wiktionary.org',
  'lvwikibooks': 'http://lv.wikibooks.org',
  'maiwiki': 'http://mai.wikipedia.org',
  'map_bmswiki': 'http://map-bms.wikipedia.org',
  'mdfwiki': 'http://mdf.wikipedia.org',
  'mgwiki': 'http://mg.wikipedia.org',
  'mgwiktionary': 'http://mg.wiktionary.org',
  'mgwikibooks': 'http://mg.wikibooks.org',
  'mhwiki': 'http://mh.wikipedia.org',
  'mhwiktionary': 'http://mh.wiktionary.org',
  'mhrwiki': 'http://mhr.wikipedia.org',
  'miwiki': 'http://mi.wikipedia.org',
  'miwiktionary': 'http://mi.wiktionary.org',
  'miwikibooks': 'http://mi.wikibooks.org',
  'minwiki': 'http://min.wikipedia.org',
  'mkwiki': 'http://mk.wikipedia.org',
  'mkwiktionary': 'http://mk.wiktionary.org',
  'mkwikibooks': 'http://mk.wikibooks.org',
  'mkwikisource': 'http://mk.wikisource.org',
  'mlwiki': 'http://ml.wikipedia.org',
  'mlwiktionary': 'http://ml.wiktionary.org',
  'mlwikibooks': 'http://ml.wikibooks.org',
  'mlwikiquote': 'http://ml.wikiquote.org',
  'mlwikisource': 'http://ml.wikisource.org',
  'mnwiki': 'http://mn.wikipedia.org',
  'mnwiktionary': 'http://mn.wiktionary.org',
  'mnwikibooks': 'http://mn.wikibooks.org',
  'mowiki': 'http://mo.wikipedia.org',
  'mowiktionary': 'http://mo.wiktionary.org',
  'mrwiki': 'http://mr.wikipedia.org',
  'mrwiktionary': 'http://mr.wiktionary.org',
  'mrwikibooks': 'http://mr.wikibooks.org',
  'mrwikiquote': 'http://mr.wikiquote.org',
  'mrwikisource': 'http://mr.wikisource.org',
  'mrjwiki': 'http://mrj.wikipedia.org',
  'mswiki': 'http://ms.wikipedia.org',
  'mswiktionary': 'http://ms.wiktionary.org',
  'mswikibooks': 'http://ms.wikibooks.org',
  'mtwiki': 'http://mt.wikipedia.org',
  'mtwiktionary': 'http://mt.wiktionary.org',
  'muswiki': 'http://mus.wikipedia.org',
  'mwlwiki': 'http://mwl.wikipedia.org',
  'mywiki': 'http://my.wikipedia.org',
  'mywiktionary': 'http://my.wiktionary.org',
  'mywikibooks': 'http://my.wikibooks.org',
  'myvwiki': 'http://myv.wikipedia.org',
  'mznwiki': 'http://mzn.wikipedia.org',
  'nawiki': 'http://na.wikipedia.org',
  'nawiktionary': 'http://na.wiktionary.org',
  'nawikibooks': 'http://na.wikibooks.org',
  'nawikiquote': 'http://na.wikiquote.org',
  'nahwiki': 'http://nah.wikipedia.org',
  'nahwiktionary': 'http://nah.wiktionary.org',
  'nahwikibooks': 'http://nah.wikibooks.org',
  'napwiki': 'http://nap.wikipedia.org',
  'ndswiki': 'http://nds.wikipedia.org',
  'ndswiktionary': 'http://nds.wiktionary.org',
  'ndswikibooks': 'http://nds.wikibooks.org',
  'ndswikiquote': 'http://nds.wikiquote.org',
  'nds_nlwiki': 'http://nds-nl.wikipedia.org',
  'newiki': 'http://ne.wikipedia.org',
  'newiktionary': 'http://ne.wiktionary.org',
  'newikibooks': 'http://ne.wikibooks.org',
  'newwiki': 'http://new.wikipedia.org',
  'ngwiki': 'http://ng.wikipedia.org',
  'nlwiki': 'http://nl.wikipedia.org',
  'nlwiktionary': 'http://nl.wiktionary.org',
  'nlwikibooks': 'http://nl.wikibooks.org',
  'nlwikinews': 'http://nl.wikinews.org',
  'nlwikiquote': 'http://nl.wikiquote.org',
  'nlwikisource': 'http://nl.wikisource.org',
  'nlwikivoyage': 'http://nl.wikivoyage.org',
  'nnwiki': 'http://nn.wikipedia.org',
  'nnwiktionary': 'http://nn.wiktionary.org',
  'nnwikiquote': 'http://nn.wikiquote.org',
  'nowiki': 'http://no.wikipedia.org',
  'nowiktionary': 'http://no.wiktionary.org',
  'nowikibooks': 'http://no.wikibooks.org',
  'nowikinews': 'http://no.wikinews.org',
  'nowikiquote': 'http://no.wikiquote.org',
  'nowikisource': 'http://no.wikisource.org',
  'novwiki': 'http://nov.wikipedia.org',
  'nrmwiki': 'http://nrm.wikipedia.org',
  'nsowiki': 'http://nso.wikipedia.org',
  'nvwiki': 'http://nv.wikipedia.org',
  'nywiki': 'http://ny.wikipedia.org',
  'ocwiki': 'http://oc.wikipedia.org',
  'ocwiktionary': 'http://oc.wiktionary.org',
  'ocwikibooks': 'http://oc.wikibooks.org',
  'omwiki': 'http://om.wikipedia.org',
  'omwiktionary': 'http://om.wiktionary.org',
  'orwiki': 'http://or.wikipedia.org',
  'orwiktionary': 'http://or.wiktionary.org',
  'orwikisource': 'http://or.wikisource.org',
  'oswiki': 'http://os.wikipedia.org',
  'pawiki': 'http://pa.wikipedia.org',
  'pawiktionary': 'http://pa.wiktionary.org',
  'pawikibooks': 'http://pa.wikibooks.org',
  'pagwiki': 'http://pag.wikipedia.org',
  'pamwiki': 'http://pam.wikipedia.org',
  'papwiki': 'http://pap.wikipedia.org',
  'pcdwiki': 'http://pcd.wikipedia.org',
  'pdcwiki': 'http://pdc.wikipedia.org',
  'pflwiki': 'http://pfl.wikipedia.org',
  'piwiki': 'http://pi.wikipedia.org',
  'piwiktionary': 'http://pi.wiktionary.org',
  'pihwiki': 'http://pih.wikipedia.org',
  'plwiki': 'http://pl.wikipedia.org',
  'plwiktionary': 'http://pl.wiktionary.org',
  'plwikibooks': 'http://pl.wikibooks.org',
  'plwikinews': 'http://pl.wikinews.org',
  'plwikiquote': 'http://pl.wikiquote.org',
  'plwikisource': 'http://pl.wikisource.org',
  'plwikivoyage': 'http://pl.wikivoyage.org',
  'pmswiki': 'http://pms.wikipedia.org',
  'pnbwiki': 'http://pnb.wikipedia.org',
  'pnbwiktionary': 'http://pnb.wiktionary.org',
  'pntwiki': 'http://pnt.wikipedia.org',
  'pswiki': 'http://ps.wikipedia.org',
  'pswiktionary': 'http://ps.wiktionary.org',
  'pswikibooks': 'http://ps.wikibooks.org',
  'ptwiki': 'http://pt.wikipedia.org',
  'ptwiktionary': 'http://pt.wiktionary.org',
  'ptwikibooks': 'http://pt.wikibooks.org',
  'ptwikinews': 'http://pt.wikinews.org',
  'ptwikiquote': 'http://pt.wikiquote.org',
  'ptwikisource': 'http://pt.wikisource.org',
  'ptwikiversity': 'http://pt.wikiversity.org',
  'ptwikivoyage': 'http://pt.wikivoyage.org',
  'quwiki': 'http://qu.wikipedia.org',
  'quwiktionary': 'http://qu.wiktionary.org',
  'quwikibooks': 'http://qu.wikibooks.org',
  'quwikiquote': 'http://qu.wikiquote.org',
  'rmwiki': 'http://rm.wikipedia.org',
  'rmwiktionary': 'http://rm.wiktionary.org',
  'rmwikibooks': 'http://rm.wikibooks.org',
  'rmywiki': 'http://rmy.wikipedia.org',
  'rnwiki': 'http://rn.wikipedia.org',
  'rnwiktionary': 'http://rn.wiktionary.org',
  'rowiki': 'http://ro.wikipedia.org',
  'rowiktionary': 'http://ro.wiktionary.org',
  'rowikibooks': 'http://ro.wikibooks.org',
  'rowikinews': 'http://ro.wikinews.org',
  'rowikiquote': 'http://ro.wikiquote.org',
  'rowikisource': 'http://ro.wikisource.org',
  'rowikivoyage': 'http://ro.wikivoyage.org',
  'roa_rupwiki': 'http://roa-rup.wikipedia.org',
  'roa_rupwiktionary': 'http://roa-rup.wiktionary.org',
  'roa_tarawiki': 'http://roa-tara.wikipedia.org',
  'ruwiki': 'https://ru.wikipedia.org',
  'ruwiktionary': 'https://ru.wiktionary.org',
  'ruwikibooks': 'https://ru.wikibooks.org',
  'ruwikinews': 'https://ru.wikinews.org',
  'ruwikiquote': 'https://ru.wikiquote.org',
  'ruwikisource': 'https://ru.wikisource.org',
  'ruwikiversity': 'https://ru.wikiversity.org',
  'ruwikivoyage': 'https://ru.wikivoyage.org',
  'ruewiki': 'http://rue.wikipedia.org',
  'rwwiki': 'http://rw.wikipedia.org',
  'rwwiktionary': 'http://rw.wiktionary.org',
  'sawiki': 'http://sa.wikipedia.org',
  'sawiktionary': 'http://sa.wiktionary.org',
  'sawikibooks': 'http://sa.wikibooks.org',
  'sawikiquote': 'http://sa.wikiquote.org',
  'sawikisource': 'http://sa.wikisource.org',
  'sahwiki': 'http://sah.wikipedia.org',
  'sahwikisource': 'http://sah.wikisource.org',
  'scwiki': 'http://sc.wikipedia.org',
  'scwiktionary': 'http://sc.wiktionary.org',
  'scnwiki': 'http://scn.wikipedia.org',
  'scnwiktionary': 'http://scn.wiktionary.org',
  'scowiki': 'http://sco.wikipedia.org',
  'sdwiki': 'http://sd.wikipedia.org',
  'sdwiktionary': 'http://sd.wiktionary.org',
  'sdwikinews': 'http://sd.wikinews.org',
  'sewiki': 'http://se.wikipedia.org',
  'sewikibooks': 'http://se.wikibooks.org',
  'sgwiki': 'http://sg.wikipedia.org',
  'sgwiktionary': 'http://sg.wiktionary.org',
  'shwiki': 'http://sh.wikipedia.org',
  'shwiktionary': 'http://sh.wiktionary.org',
  'siwiki': 'http://si.wikipedia.org',
  'siwiktionary': 'http://si.wiktionary.org',
  'siwikibooks': 'http://si.wikibooks.org',
  'simplewiki': 'http://simple.wikipedia.org',
  'simplewiktionary': 'http://simple.wiktionary.org',
  'simplewikibooks': 'http://simple.wikibooks.org',
  'simplewikiquote': 'http://simple.wikiquote.org',
  'skwiki': 'http://sk.wikipedia.org',
  'skwiktionary': 'http://sk.wiktionary.org',
  'skwikibooks': 'http://sk.wikibooks.org',
  'skwikiquote': 'http://sk.wikiquote.org',
  'skwikisource': 'http://sk.wikisource.org',
  'slwiki': 'http://sl.wikipedia.org',
  'slwiktionary': 'http://sl.wiktionary.org',
  'slwikibooks': 'http://sl.wikibooks.org',
  'slwikiquote': 'http://sl.wikiquote.org',
  'slwikisource': 'http://sl.wikisource.org',
  'slwikiversity': 'http://sl.wikiversity.org',
  'smwiki': 'http://sm.wikipedia.org',
  'smwiktionary': 'http://sm.wiktionary.org',
  'snwiki': 'http://sn.wikipedia.org',
  'snwiktionary': 'http://sn.wiktionary.org',
  'sowiki': 'http://so.wikipedia.org',
  'sowiktionary': 'http://so.wiktionary.org',
  'sqwiki': 'http://sq.wikipedia.org',
  'sqwiktionary': 'http://sq.wiktionary.org',
  'sqwikibooks': 'http://sq.wikibooks.org',
  'sqwikinews': 'http://sq.wikinews.org',
  'sqwikiquote': 'http://sq.wikiquote.org',
  'srwiki': 'http://sr.wikipedia.org',
  'srwiktionary': 'http://sr.wiktionary.org',
  'srwikibooks': 'http://sr.wikibooks.org',
  'srwikinews': 'http://sr.wikinews.org',
  'srwikiquote': 'http://sr.wikiquote.org',
  'srwikisource': 'http://sr.wikisource.org',
  'srnwiki': 'http://srn.wikipedia.org',
  'sswiki': 'http://ss.wikipedia.org',
  'sswiktionary': 'http://ss.wiktionary.org',
  'stwiki': 'http://st.wikipedia.org',
  'stwiktionary': 'http://st.wiktionary.org',
  'stqwiki': 'http://stq.wikipedia.org',
  'suwiki': 'http://su.wikipedia.org',
  'suwiktionary': 'http://su.wiktionary.org',
  'suwikibooks': 'http://su.wikibooks.org',
  'suwikiquote': 'http://su.wikiquote.org',
  'svwiki': 'http://sv.wikipedia.org',
  'svwiktionary': 'http://sv.wiktionary.org',
  'svwikibooks': 'http://sv.wikibooks.org',
  'svwikinews': 'http://sv.wikinews.org',
  'svwikiquote': 'http://sv.wikiquote.org',
  'svwikisource': 'http://sv.wikisource.org',
  'svwikiversity': 'http://sv.wikiversity.org',
  'svwikivoyage': 'http://sv.wikivoyage.org',
  'swwiki': 'http://sw.wikipedia.org',
  'swwiktionary': 'http://sw.wiktionary.org',
  'swwikibooks': 'http://sw.wikibooks.org',
  'szlwiki': 'http://szl.wikipedia.org',
  'tawiki': 'http://ta.wikipedia.org',
  'tawiktionary': 'http://ta.wiktionary.org',
  'tawikibooks': 'http://ta.wikibooks.org',
  'tawikinews': 'http://ta.wikinews.org',
  'tawikiquote': 'http://ta.wikiquote.org',
  'tawikisource': 'http://ta.wikisource.org',
  'tewiki': 'http://te.wikipedia.org',
  'tewiktionary': 'http://te.wiktionary.org',
  'tewikibooks': 'http://te.wikibooks.org',
  'tewikiquote': 'http://te.wikiquote.org',
  'tewikisource': 'http://te.wikisource.org',
  'tetwiki': 'http://tet.wikipedia.org',
  'tgwiki': 'http://tg.wikipedia.org',
  'tgwiktionary': 'http://tg.wiktionary.org',
  'tgwikibooks': 'http://tg.wikibooks.org',
  'thwiki': 'http://th.wikipedia.org',
  'thwiktionary': 'http://th.wiktionary.org',
  'thwikibooks': 'http://th.wikibooks.org',
  'thwikinews': 'http://th.wikinews.org',
  'thwikiquote': 'http://th.wikiquote.org',
  'thwikisource': 'http://th.wikisource.org',
  'tiwiki': 'http://ti.wikipedia.org',
  'tiwiktionary': 'http://ti.wiktionary.org',
  'tkwiki': 'http://tk.wikipedia.org',
  'tkwiktionary': 'http://tk.wiktionary.org',
  'tkwikibooks': 'http://tk.wikibooks.org',
  'tkwikiquote': 'http://tk.wikiquote.org',
  'tlwiki': 'http://tl.wikipedia.org',
  'tlwiktionary': 'http://tl.wiktionary.org',
  'tlwikibooks': 'http://tl.wikibooks.org',
  'tnwiki': 'http://tn.wikipedia.org',
  'tnwiktionary': 'http://tn.wiktionary.org',
  'towiki': 'http://to.wikipedia.org',
  'towiktionary': 'http://to.wiktionary.org',
  'tpiwiki': 'http://tpi.wikipedia.org',
  'tpiwiktionary': 'http://tpi.wiktionary.org',
  'trwiki': 'http://tr.wikipedia.org',
  'trwiktionary': 'http://tr.wiktionary.org',
  'trwikibooks': 'http://tr.wikibooks.org',
  'trwikinews': 'http://tr.wikinews.org',
  'trwikiquote': 'http://tr.wikiquote.org',
  'trwikisource': 'http://tr.wikisource.org',
  'tswiki': 'http://ts.wikipedia.org',
  'tswiktionary': 'http://ts.wiktionary.org',
  'ttwiki': 'http://tt.wikipedia.org',
  'ttwiktionary': 'http://tt.wiktionary.org',
  'ttwikibooks': 'http://tt.wikibooks.org',
  'ttwikiquote': 'http://tt.wikiquote.org',
  'tumwiki': 'http://tum.wikipedia.org',
  'twwiki': 'http://tw.wikipedia.org',
  'twwiktionary': 'http://tw.wiktionary.org',
  'tywiki': 'http://ty.wikipedia.org',
  'tyvwiki': 'http://tyv.wikipedia.org',
  'udmwiki': 'http://udm.wikipedia.org',
  'ugwiki': 'http://ug.wikipedia.org',
  'ugwiktionary': 'http://ug.wiktionary.org',
  'ugwikibooks': 'http://ug.wikibooks.org',
  'ugwikiquote': 'http://ug.wikiquote.org',
  'ukwiki': 'http://uk.wikipedia.org',
  'ukwiktionary': 'http://uk.wiktionary.org',
  'ukwikibooks': 'http://uk.wikibooks.org',
  'ukwikinews': 'http://uk.wikinews.org',
  'ukwikiquote': 'http://uk.wikiquote.org',
  'ukwikisource': 'http://uk.wikisource.org',
  'ukwikivoyage': 'http://uk.wikivoyage.org',
  'urwiki': 'http://ur.wikipedia.org',
  'urwiktionary': 'http://ur.wiktionary.org',
  'urwikibooks': 'http://ur.wikibooks.org',
  'urwikiquote': 'http://ur.wikiquote.org',
  'uzwiki': 'https://uz.wikipedia.org',
  'uzwiktionary': 'http://uz.wiktionary.org',
  'uzwikibooks': 'http://uz.wikibooks.org',
  'uzwikiquote': 'http://uz.wikiquote.org',
  'vewiki': 'http://ve.wikipedia.org',
  'vecwiki': 'http://vec.wikipedia.org',
  'vecwiktionary': 'http://vec.wiktionary.org',
  'vecwikisource': 'http://vec.wikisource.org',
  'vepwiki': 'http://vep.wikipedia.org',
  'viwiki': 'http://vi.wikipedia.org',
  'viwiktionary': 'http://vi.wiktionary.org',
  'viwikibooks': 'http://vi.wikibooks.org',
  'viwikiquote': 'http://vi.wikiquote.org',
  'viwikisource': 'http://vi.wikisource.org',
  'viwikivoyage': 'http://vi.wikivoyage.org',
  'vlswiki': 'http://vls.wikipedia.org',
  'vowiki': 'http://vo.wikipedia.org',
  'vowiktionary': 'http://vo.wiktionary.org',
  'vowikibooks': 'http://vo.wikibooks.org',
  'vowikiquote': 'http://vo.wikiquote.org',
  'wawiki': 'http://wa.wikipedia.org',
  'wawiktionary': 'http://wa.wiktionary.org',
  'wawikibooks': 'http://wa.wikibooks.org',
  'warwiki': 'http://war.wikipedia.org',
  'wowiki': 'http://wo.wikipedia.org',
  'wowiktionary': 'http://wo.wiktionary.org',
  'wowikiquote': 'http://wo.wikiquote.org',
  'wuuwiki': 'http://wuu.wikipedia.org',
  'xalwiki': 'http://xal.wikipedia.org',
  'xhwiki': 'http://xh.wikipedia.org',
  'xhwiktionary': 'http://xh.wiktionary.org',
  'xhwikibooks': 'http://xh.wikibooks.org',
  'xmfwiki': 'http://xmf.wikipedia.org',
  'yiwiki': 'http://yi.wikipedia.org',
  'yiwiktionary': 'http://yi.wiktionary.org',
  'yiwikisource': 'http://yi.wikisource.org',
  'yowiki': 'http://yo.wikipedia.org',
  'yowiktionary': 'http://yo.wiktionary.org',
  'yowikibooks': 'http://yo.wikibooks.org',
  'zawiki': 'http://za.wikipedia.org',
  'zawiktionary': 'http://za.wiktionary.org',
  'zawikibooks': 'http://za.wikibooks.org',
  'zawikiquote': 'http://za.wikiquote.org',
  'zeawiki': 'http://zea.wikipedia.org',
  'zhwiki': 'http://zh.wikipedia.org',
  'zhwiktionary': 'http://zh.wiktionary.org',
  'zhwikibooks': 'http://zh.wikibooks.org',
  'zhwikinews': 'http://zh.wikinews.org',
  'zhwikiquote': 'http://zh.wikiquote.org',
  'zhwikisource': 'http://zh.wikisource.org',
  'zhwikivoyage': 'http://zh.wikivoyage.org',
  'zh_classicalwiki': 'http://zh-classical.wikipedia.org',
  'zh_min_nanwiki': 'http://zh-min-nan.wikipedia.org',
  'zh_min_nanwiktionary': 'http://zh-min-nan.wiktionary.org',
  'zh_min_nanwikibooks': 'http://zh-min-nan.wikibooks.org',
  'zh_min_nanwikiquote': 'http://zh-min-nan.wikiquote.org',
  'zh_min_nanwikisource': 'http://zh-min-nan.wikisource.org',
  'zh_yuewiki': 'http://zh-yue.wikipedia.org',
  'zuwiki': 'http://zu.wikipedia.org',
  'zuwiktionary': 'http://zu.wiktionary.org',
  'zuwikibooks': 'http://zu.wikibooks.org'
};
if (typeof module !== 'undefined' && module.exports) {
  module.exports = site_map;
}

},{}],9:[function(_dereq_,module,exports){
'use strict';

//turns wikimedia script into json
// https://github.com/spencermountain/wtf_wikipedia
//@spencermountain
var wtf_wikipedia = function () {
  var sentence_parser = _dereq_('./lib/sentence_parser');
  var fetch = _dereq_('./lib/fetch_text');
  var make_image = _dereq_('./lib/make_image');
  var i18n = _dereq_('./data/i18n');
  var helpers = _dereq_('./lib/helpers');
  var languages = _dereq_('./data/languages');
  //parsers
  var redirects = _dereq_('./parse/parse_redirects');
  var parse_table = _dereq_('./parse/parse_table');
  var parse_line = _dereq_('./parse/parse_line');
  var parse_categories = _dereq_('./parse/parse_categories');
  var parse_disambig = _dereq_('./parse/parse_disambig');
  var parse_infobox = _dereq_('./parse/parse_infobox');
  var parse_infobox_template = _dereq_('./parse/parse_infobox_template');
  var parse_image = _dereq_('./parse/parse_image');
  var recursive_matches = _dereq_('./recursive_matches');
  var preprocess = _dereq_('./parse/cleanup_misc');
  var word_templates = _dereq_('./word_templates');

  // options
  var defaultParseOptions = {
    ignoreLists: true
  };

  //some xml elements are just junk, and demand full inglorious death by regular exp
  //other xml elements, like <em>, are plucked out afterwards
  var main = function main(wiki, options) {
    options = Object.assign({}, defaultParseOptions, options);
    var infobox = {};
    var infobox_template = '';
    var images = [];
    var tables;
    var translations = {};
    wiki = wiki || '';
    //detect if page is just redirect, and return
    if (redirects.is_redirect(wiki)) {
      return redirects.parse_redirect(wiki);
    }
    //detect if page is disambiguator page
    var template_reg = new RegExp('\\{\\{ ?(' + i18n.disambigs.join('|') + ')(\\|[a-z =]*?)? ?\\}\\}', 'i');
    if (wiki.match(template_reg)) {
      //|| wiki.match(/^.{3,25} may refer to/i)|| wiki.match(/^.{3,25} ist der Name mehrerer /i)
      return parse_disambig(wiki);
    }
    //parse templates like {{currentday}}
    wiki = word_templates(wiki);
    //kill off th3 craziness
    wiki = preprocess(wiki);
    //find tables
    tables = wiki.match(/\{\|[\s\S]{1,8000}?\|\}/g, '') || [];
    tables = tables.map(function (s) {
      return parse_table(s);
    });
    //remove tables
    wiki = wiki.replace(/\{\|[\s\S]{1,8000}?\|\}/g, '');

    //reduce the scary recursive situations
    //remove {{template {{}} }} recursions
    var matches = recursive_matches('{', '}', wiki);
    var infobox_reg = new RegExp('\{\{(' + i18n.infoboxes.join('|') + ')[: \n]', 'ig');
    matches.forEach(function (s) {
      if (s.match(infobox_reg, 'ig') && Object.keys(infobox).length === 0) {
        infobox = parse_infobox(s);
        infobox_template = parse_infobox_template(s);
      }
      if (s.match(infobox_reg)) {
        wiki = wiki.replace(s, '');
      }
      //if it's not a known template, but it's recursive, remove it
      //(because it will be misread later-on)
      if (s.match(/^\{\{/)) {
        wiki = wiki.replace(s, '');
      }
    });

    //second, remove [[file:...[[]] ]] recursions
    matches = recursive_matches('[', ']', wiki);
    matches.forEach(function (s) {
      if (s.match(new RegExp('\\[\\[(' + i18n.images.concat(i18n.files).join('|') + ')', 'i'))) {
        images.push(parse_image(s));
        wiki = wiki.replace(s, '');
      }
    });
    //third, wiktionary-style interlanguage links
    matches.forEach(function (s) {
      if (s.match(/\[\[([a-z][a-z]):(.*?)\]\]/i) !== null) {
        var lang = s.match(/\[\[([a-z][a-z]):/i)[1];
        if (lang && languages[lang]) {
          translations[lang] = s.match(/\[\[([a-z][a-z]):(.*?)\]\]/i)[2];
        }
        wiki = wiki.replace(s, '');
      }
    });

    //now that the scary recursion issues are gone, we can trust simple regex methods

    //kill the rest of templates
    wiki = wiki.replace(/\{\{.*?\}\}/g, '');

    //get list of links, categories
    var cats = parse_categories(wiki);
    //next, map each line into a parsable sentence
    // var output = {};
    var output = new Map();
    var lines = wiki.replace(/\r/g, '').split(/\n/);
    var section = 'Intro';
    var number = 1;
    lines.forEach(function (part) {
      if (!section) {
        return;
      }
      //add # numberings formatting
      if (part.match(/^ ?\#[^:,\|]{4}/i)) {
        part = part.replace(/^ ?#*/, number + ') ');
        part = part + '\n';
        number += 1;
      } else {
        number = 1;
      }
      //add bullet-points formatting
      if (part.match(/^\*+[^:,\|]{4}/)) {
        part = part + '\n';
      }
      //remove some nonsense wp lines

      if (options.ignoreLists) {
        //ignore list
        if (part.match(/^[#\*:;\|]/)) {
          return;
        }
      }

      //ignore only-punctuation
      if (!part.match(/[a-z0-9]/i)) {
        return;
      }
      //headings
      var ban_headings = new RegExp('^ ?(' + i18n.sources.join('|') + ') ?$', 'i'); //remove things like 'external links'
      if (part.match(/^={1,5}[^=]{1,200}={1,5}$/)) {
        section = part.match(/^={1,5}([^=]{2,200}?)={1,5}$/) || [];
        section = section[1] || '';
        section = section.replace(/\./g, ' '); // this is necessary for mongo, i'm sorry
        section = helpers.trim_whitespace(section);
        //ban some sections
        if (section && section.match(ban_headings)) {
          section = undefined;
        }
        return;
      }
      //still alive, add it to the section
      sentence_parser(part).forEach(function (line) {
        line = parse_line(line);
        if (line && line.text) {
          // if (!output[section]) {
          if (!output.get(section)) {
            // output[section] = [];
            output.set(section, []);
          }
          // output[section].push(line);
          output.get(section).push(line);
        }
      });
    });
    //add additional image from infobox, if applicable
    if (infobox['image'] && infobox['image'].text) {
      var img = infobox['image'].text || '';
      if (typeof img === 'string' && !img.match(new RegExp('^(' + i18n.images.concat(i18n.files).join('|') + ')', 'i'))) {
        img = 'File:' + img;
      }
      images.push(img);
    }
    //add url, etc to image
    images = images.map(make_image);
    return {
      type: 'page',
      text: output,
      categories: cats,
      images: images,
      infobox: infobox,
      infobox_template: infobox_template,
      tables: tables,
      translations: translations
    };
  };

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

  var plaintext = function plaintext(str) {
    var data = main(str) || {};
    data.text = data.text || [];
    var text = '';
    data.text.forEach(function (v) {
      text += v.map(function (a) {
        return a.text;
      }).join(' ') + '\n';
    });
    return text;
  };

  var methods = {
    from_api: from_api,
    parse: main,
    plaintext: plaintext
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = methods;
  }

  return methods;
}();

module.exports = wtf_wikipedia;

},{"./data/i18n":6,"./data/languages":7,"./lib/fetch_text":10,"./lib/helpers":12,"./lib/make_image":13,"./lib/sentence_parser":14,"./parse/cleanup_misc":15,"./parse/parse_categories":17,"./parse/parse_disambig":18,"./parse/parse_image":19,"./parse/parse_infobox":20,"./parse/parse_infobox_template":21,"./parse/parse_line":22,"./parse/parse_redirects":24,"./parse/parse_table":25,"./recursive_matches":26,"./word_templates":27}],10:[function(_dereq_,module,exports){
'use strict';

//grab the content of any article, off the api
var request = _dereq_('superagent');
var site_map = _dereq_('../data/site_map');
var redirects = _dereq_('../parse/parse_redirects');

var fetch = function fetch(page_identifier, lang_or_wikiid, cb) {
  lang_or_wikiid = lang_or_wikiid || 'en';
  var identifier_type = 'title';
  if (page_identifier.match(/^[0-9]*$/) && page_identifier.length > 3) {
    identifier_type = 'curid';
  }
  var url;
  if (site_map[lang_or_wikiid]) {
    url = site_map[lang_or_wikiid] + '/w/index.php?action=raw&' + identifier_type + '=' + page_identifier;
  } else {
    url = 'http://' + lang_or_wikiid + '.wikipedia.org/w/index.php?action=raw&' + identifier_type + '=' + page_identifier;
  }

  request.get(url).end(function (err, res) {
    if (err) {
      console.warn(err);
      cb(null);
    } else if (redirects.is_redirect(res.text)) {
      var result = redirects.parse_redirect(res.text);
      fetch(result.redirect, lang_or_wikiid, cb);
    } else {
      cb(res.text);
    }
  });
};

module.exports = fetch;

// fetch("On A Friday", 'en', function(r) { // 'afwiki'
//   console.log(JSON.stringify(r, null, 2));
// })

},{"../data/site_map":8,"../parse/parse_redirects":24,"superagent":2}],11:[function(_dereq_,module,exports){
(function (global){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
(function () {
  var Hashes;

  function utf8Encode(str) {
    var x,
        y,
        output = '',
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
          output += String.fromCharCode(0xC0 | x >>> 6 & 0x1F, 0x80 | x & 0x3F);
        } else if (x <= 0xFFFF) {
          output += String.fromCharCode(0xE0 | x >>> 12 & 0x0F, 0x80 | x >>> 6 & 0x3F, 0x80 | x & 0x3F);
        } else if (x <= 0x1FFFFF) {
          output += String.fromCharCode(0xF0 | x >>> 18 & 0x07, 0x80 | x >>> 12 & 0x3F, 0x80 | x >>> 6 & 0x3F, 0x80 | x & 0x3F);
        }
      }
    }
    return output;
  }

  function utf8Decode(str) {
    var i,
        ac,
        c1,
        c2,
        c3,
        arr = [],
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
          arr[ac] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
          i += 2;
        } else {
          c2 = str.charCodeAt(i + 1);
          c3 = str.charCodeAt(i + 2);
          arr[ac] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
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
    return msw << 16 | lsw & 0xFFFF;
  }

  /**
   * Bitwise rotate a 32-bit number to the left.
   */

  function bit_rol(num, cnt) {
    return num << cnt | num >>> 32 - cnt;
  }

  /**
   * Convert a raw string to a hex string
   */

  function rstr2hex(input, hexcase) {
    var hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef',
        output = '',
        x,
        i = 0,
        l = input.length;
    for (; i < l; i += 1) {
      x = input.charCodeAt(i);
      output += hex_tab.charAt(x >>> 4 & 0x0F) + hex_tab.charAt(x & 0x0F);
    }
    return output;
  }

  /**
   * Encode a string as utf-16
   */

  function str2rstr_utf16le(input) {
    var i,
        l = input.length,
        output = '';
    for (i = 0; i < l; i += 1) {
      output += String.fromCharCode(input.charCodeAt(i) & 0xFF, input.charCodeAt(i) >>> 8 & 0xFF);
    }
    return output;
  }

  function str2rstr_utf16be(input) {
    var i,
        l = input.length,
        output = '';
    for (i = 0; i < l; i += 1) {
      output += String.fromCharCode(input.charCodeAt(i) >>> 8 & 0xFF, input.charCodeAt(i) & 0xFF);
    }
    return output;
  }

  /**
   * Convert an array of big-endian words to a string
   */

  function binb2rstr(input) {
    var i,
        l = input.length * 32,
        output = '';
    for (i = 0; i < l; i += 8) {
      output += String.fromCharCode(input[i >> 5] >>> 24 - i % 32 & 0xFF);
    }
    return output;
  }

  /**
   * Convert an array of little-endian words to a string
   */

  function binl2rstr(input) {
    var i,
        l = input.length * 32,
        output = '';
    for (i = 0; i < l; i += 8) {
      output += String.fromCharCode(input[i >> 5] >>> i % 32 & 0xFF);
    }
    return output;
  }

  /**
   * Convert a raw string to an array of little-endian words
   * Characters >255 have their high-byte silently ignored.
   */

  function rstr2binl(input) {
    var i,
        l = input.length * 8,
        output = Array(input.length >> 2),
        lo = output.length;
    for (i = 0; i < lo; i += 1) {
      output[i] = 0;
    }
    for (i = 0; i < l; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << i % 32;
    }
    return output;
  }

  /**
   * Convert a raw string to an array of big-endian words
   * Characters >255 have their high-byte silently ignored.
   */

  function rstr2binb(input) {
    var i,
        l = input.length * 8,
        output = Array(input.length >> 2),
        lo = output.length;
    for (i = 0; i < lo; i += 1) {
      output[i] = 0;
    }
    for (i = 0; i < l; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << 24 - i % 32;
    }
    return output;
  }

  /**
   * Convert a raw string to an arbitrary string encoding
   */

  function rstr2any(input, encoding) {
    var divisor = encoding.length,
        remainders = Array(),
        i,
        q,
        x,
        ld,
        quotient,
        dividend,
        output,
        full_length;

    /* Convert to an array of 16-bit big-endian values, forming the dividend */
    dividend = Array(Math.ceil(input.length / 2));
    ld = dividend.length;
    for (i = 0; i < ld; i += 1) {
      dividend[i] = input.charCodeAt(i * 2) << 8 | input.charCodeAt(i * 2 + 1);
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
        i,
        j,
        triplet;
    b64pad = b64pad || '=';
    for (i = 0; i < len; i += 3) {
      triplet = input.charCodeAt(i) << 16 | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
      for (j = 0; j < 4; j += 1) {
        if (i * 8 + j * 6 > input.length * 8) {
          output += b64pad;
        } else {
          output += tab.charAt(triplet >>> 6 * (3 - j) & 0x3F);
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
    VERSION: '1.0.5',
    /**
     * @member Hashes
     * @class Base64
     * @constructor
     */
    Base64: function Base64() {
      // private properties
      var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
          pad = '=',
          // default pad according with the RFC standard
      url = false,
          // URL encoding support @todo
      utf8 = true; // by default enable UTF-8 support encoding

      // public method for encoding
      this.encode = function (input) {
        var i,
            j,
            triplet,
            output = '',
            len = input.length;

        pad = pad || '=';
        input = utf8 ? utf8Encode(input) : input;

        for (i = 0; i < len; i += 3) {
          triplet = input.charCodeAt(i) << 16 | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
          for (j = 0; j < 4; j += 1) {
            if (i * 8 + j * 6 > len * 8) {
              output += pad;
            } else {
              output += tab.charAt(triplet >>> 6 * (3 - j) & 0x3F);
            }
          }
        }
        return output;
      };

      // public method for decoding
      this.decode = function (input) {
        // var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var i,
            o1,
            o2,
            o3,
            h1,
            h2,
            h3,
            h4,
            bits,
            ac,
            dec = '',
            arr = [];
        if (!input) {
          return input;
        }

        i = ac = 0;
        input = input.replace(new RegExp('\\' + pad, 'gi'), ''); // use '='
        //input += '';

        do {
          // unpack four hexets into three octets using index points in b64
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
        dec = utf8 ? utf8Decode(dec) : dec;

        return dec;
      };

      // set custom pad string
      this.setPad = function (str) {
        pad = str || pad;
        return this;
      };
      // set custom tab string characters
      this.setTab = function (str) {
        tab = str || tab;
        return this;
      };
      this.setUTF8 = function (bool) {
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
    CRC32: function CRC32(str) {
      var crc = 0,
          x = 0,
          y = 0,
          table,
          i,
          iTop;
      str = utf8Encode(str);

      table = ['00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 ', '79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 ', '84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F ', '63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD ', 'A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC ', '51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 ', 'B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 ', '06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 ', 'E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 ', '12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 ', 'D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 ', '33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 ', 'CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 ', '9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E ', '7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D ', '806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 ', '60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA ', 'AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 ', '5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 ', 'B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 ', '05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 ', 'F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA ', '11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 ', 'D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F ', '30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E ', 'C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D'].join('');

      crc = crc ^ -1;
      for (i = 0, iTop = str.length; i < iTop; i += 1) {
        y = (crc ^ str.charCodeAt(i)) & 0xFF;
        x = '0x' + table.substr(y * 9, 8);
        crc = crc >>> 8 ^ x;
      }
      // always return a positive number (that's what >>> 0 does)
      return (crc ^ -1) >>> 0;
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
    MD5: function MD5(options) {
      /**
       * Private config properties. You may need to tweak these to be compatible with
       * the server-side, but the defaults work in most cases.
       * See {@link Hashes.MD5#method-setUpperCase} and {@link Hashes.SHA1#method-setUpperCase}
       */
      var hexcase = options && typeof options.uppercase === 'boolean' ? options.uppercase : false,
          // hexadecimal output case format. false - lowercase; true - uppercase
      b64pad = options && typeof options.pad === 'string' ? options.pda : '=',
          // base-64 pad character. Defaults to '=' for strict RFC compliance
      utf8 = options && typeof options.utf8 === 'boolean' ? options.utf8 : true; // enable/disable utf8 encoding

      // privileged (public) methods
      this.hex = function (s) {
        return rstr2hex(rstr(s, utf8), hexcase);
      };
      this.b64 = function (s) {
        return rstr2b64(rstr(s), b64pad);
      };
      this.any = function (s, e) {
        return rstr2any(rstr(s, utf8), e);
      };
      this.raw = function (s) {
        return rstr(s, utf8);
      };
      this.hex_hmac = function (k, d) {
        return rstr2hex(rstr_hmac(k, d), hexcase);
      };
      this.b64_hmac = function (k, d) {
        return rstr2b64(rstr_hmac(k, d), b64pad);
      };
      this.any_hmac = function (k, d, e) {
        return rstr2any(rstr_hmac(k, d), e);
      };
      /**
       * Perform a simple self-test to see if the VM is working
       * @return {String} Hexadecimal hash sample
       */
      this.vm_test = function () {
        return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
      };
      /**
       * Enable/disable uppercase hexadecimal returned string
       * @param {Boolean}
       * @return {Object} this
       */
      this.setUpperCase = function (a) {
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
      this.setPad = function (a) {
        b64pad = a || b64pad;
        return this;
      };
      /**
       * Defines a base64 pad string
       * @param {Boolean}
       * @return {Object} [this]
       */
      this.setUTF8 = function (a) {
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
        s = utf8 ? utf8Encode(s) : s;
        return binl2rstr(binl(rstr2binl(s), s.length * 8));
      }

      /**
       * Calculate the HMAC-MD5, of a key and some data (raw strings)
       */

      function rstr_hmac(key, data) {
        var bkey, ipad, opad, hash, i;

        key = utf8 ? utf8Encode(key) : key;
        data = utf8 ? utf8Encode(data) : data;
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
        var i,
            olda,
            oldb,
            oldc,
            oldd,
            a = 1732584193,
            b = -271733879,
            c = -1732584194,
            d = 271733878;

        /* append padding */
        x[len >> 5] |= 0x80 << len % 32;
        x[(len + 64 >>> 9 << 4) + 14] = len;

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
        return md5_cmn(b & c | ~b & d, a, b, x, s, t);
      }

      function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn(b & d | c & ~d, a, b, x, s, t);
      }

      function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
      }

      function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
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
    SHA1: function SHA1(options) {
      /**
       * Private config properties. You may need to tweak these to be compatible with
       * the server-side, but the defaults work in most cases.
       * See {@link Hashes.MD5#method-setUpperCase} and {@link Hashes.SHA1#method-setUpperCase}
       */
      var hexcase = options && typeof options.uppercase === 'boolean' ? options.uppercase : false,
          // hexadecimal output case format. false - lowercase; true - uppercase
      b64pad = options && typeof options.pad === 'string' ? options.pda : '=',
          // base-64 pad character. Defaults to '=' for strict RFC compliance
      utf8 = options && typeof options.utf8 === 'boolean' ? options.utf8 : true; // enable/disable utf8 encoding

      // public methods
      this.hex = function (s) {
        return rstr2hex(rstr(s, utf8), hexcase);
      };
      this.b64 = function (s) {
        return rstr2b64(rstr(s, utf8), b64pad);
      };
      this.any = function (s, e) {
        return rstr2any(rstr(s, utf8), e);
      };
      this.raw = function (s) {
        return rstr(s, utf8);
      };
      this.hex_hmac = function (k, d) {
        return rstr2hex(rstr_hmac(k, d));
      };
      this.b64_hmac = function (k, d) {
        return rstr2b64(rstr_hmac(k, d), b64pad);
      };
      this.any_hmac = function (k, d, e) {
        return rstr2any(rstr_hmac(k, d), e);
      };
      /**
       * Perform a simple self-test to see if the VM is working
       * @return {String} Hexadecimal hash sample
       * @public
       */
      this.vm_test = function () {
        return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
      };
      /**
       * @description Enable/disable uppercase hexadecimal returned string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUpperCase = function (a) {
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
      this.setPad = function (a) {
        b64pad = a || b64pad;
        return this;
      };
      /**
       * @description Defines a base64 pad string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUTF8 = function (a) {
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
        s = utf8 ? utf8Encode(s) : s;
        return binb2rstr(binb(rstr2binb(s), s.length * 8));
      }

      /**
       * Calculate the HMAC-SHA1 of a key and some data (raw strings)
       */

      function rstr_hmac(key, data) {
        var bkey, ipad, opad, i, hash;
        key = utf8 ? utf8Encode(key) : key;
        data = utf8 ? utf8Encode(data) : data;
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
        var i,
            j,
            t,
            olda,
            oldb,
            oldc,
            oldd,
            olde,
            w = Array(80),
            a = 1732584193,
            b = -271733879,
            c = -1732584194,
            d = 271733878,
            e = -1009589776;

        /* append padding */
        x[len >> 5] |= 0x80 << 24 - len % 32;
        x[(len + 64 >> 9 << 4) + 15] = len;

        for (i = 0; i < x.length; i += 16) {
          olda = a, oldb = b;
          oldc = c;
          oldd = d;
          olde = e;

          for (j = 0; j < 80; j += 1) {
            if (j < 16) {
              w[j] = x[i + j];
            } else {
              w[j] = bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
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
          return b & c | ~b & d;
        }
        if (t < 40) {
          return b ^ c ^ d;
        }
        if (t < 60) {
          return b & c | b & d | c & d;
        }
        return b ^ c ^ d;
      }

      /**
       * Determine the appropriate additive constant for the current iteration
       */

      function sha1_kt(t) {
        return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
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
    SHA256: function SHA256(options) {
      /**
       * Private properties configuration variables. You may need to tweak these to be compatible with
       * the server-side, but the defaults work in most cases.
       * @see this.setUpperCase() method
       * @see this.setPad() method
       */
      var hexcase = options && typeof options.uppercase === 'boolean' ? options.uppercase : false,
          // hexadecimal output case format. false - lowercase; true - uppercase  */
      b64pad = options && typeof options.pad === 'string' ? options.pda : '=',

      /* base-64 pad character. Default '=' for strict RFC compliance   */
      utf8 = options && typeof options.utf8 === 'boolean' ? options.utf8 : true,

      /* enable/disable utf8 encoding */
      sha256_K;

      /* privileged (public) methods */
      this.hex = function (s) {
        return rstr2hex(rstr(s, utf8));
      };
      this.b64 = function (s) {
        return rstr2b64(rstr(s, utf8), b64pad);
      };
      this.any = function (s, e) {
        return rstr2any(rstr(s, utf8), e);
      };
      this.raw = function (s) {
        return rstr(s, utf8);
      };
      this.hex_hmac = function (k, d) {
        return rstr2hex(rstr_hmac(k, d));
      };
      this.b64_hmac = function (k, d) {
        return rstr2b64(rstr_hmac(k, d), b64pad);
      };
      this.any_hmac = function (k, d, e) {
        return rstr2any(rstr_hmac(k, d), e);
      };
      /**
       * Perform a simple self-test to see if the VM is working
       * @return {String} Hexadecimal hash sample
       * @public
       */
      this.vm_test = function () {
        return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
      };
      /**
       * Enable/disable uppercase hexadecimal returned string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUpperCase = function (a) {
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
      this.setPad = function (a) {
        b64pad = a || b64pad;
        return this;
      };
      /**
       * Defines a base64 pad string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUTF8 = function (a) {
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
        s = utf8 ? utf8Encode(s) : s;
        return binb2rstr(binb(rstr2binb(s), s.length * 8));
      }

      /**
       * Calculate the HMAC-sha256 of a key and some data (raw strings)
       */

      function rstr_hmac(key, data) {
        key = utf8 ? utf8Encode(key) : key;
        data = utf8 ? utf8Encode(data) : data;
        var hash,
            i = 0,
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
        return X >>> n | X << 32 - n;
      }

      function sha256_R(X, n) {
        return X >>> n;
      }

      function sha256_Ch(x, y, z) {
        return x & y ^ ~x & z;
      }

      function sha256_Maj(x, y, z) {
        return x & y ^ x & z ^ y & z;
      }

      function sha256_Sigma0256(x) {
        return sha256_S(x, 2) ^ sha256_S(x, 13) ^ sha256_S(x, 22);
      }

      function sha256_Sigma1256(x) {
        return sha256_S(x, 6) ^ sha256_S(x, 11) ^ sha256_S(x, 25);
      }

      function sha256_Gamma0256(x) {
        return sha256_S(x, 7) ^ sha256_S(x, 18) ^ sha256_R(x, 3);
      }

      function sha256_Gamma1256(x) {
        return sha256_S(x, 17) ^ sha256_S(x, 19) ^ sha256_R(x, 10);
      }

      function sha256_Sigma0512(x) {
        return sha256_S(x, 28) ^ sha256_S(x, 34) ^ sha256_S(x, 39);
      }

      function sha256_Sigma1512(x) {
        return sha256_S(x, 14) ^ sha256_S(x, 18) ^ sha256_S(x, 41);
      }

      function sha256_Gamma0512(x) {
        return sha256_S(x, 1) ^ sha256_S(x, 8) ^ sha256_R(x, 7);
      }

      function sha256_Gamma1512(x) {
        return sha256_S(x, 19) ^ sha256_S(x, 61) ^ sha256_R(x, 6);
      }

      sha256_K = [1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993, -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987, 1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885, -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872, -1866530822, -1538233109, -1090935817, -965641998];

      function binb(m, l) {
        var HASH = [1779033703, -1150833019, 1013904242, -1521486534, 1359893119, -1694144372, 528734635, 1541459225];
        var W = new Array(64);
        var a, b, c, d, e, f, g, h;
        var i, j, T1, T2;

        /* append padding */
        m[l >> 5] |= 0x80 << 24 - l % 32;
        m[(l + 64 >> 9 << 4) + 15] = l;

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
              W[j] = safe_add(safe_add(safe_add(sha256_Gamma1256(W[j - 2]), W[j - 7]), sha256_Gamma0256(W[j - 15])), W[j - 16]);
            }

            T1 = safe_add(safe_add(safe_add(safe_add(h, sha256_Sigma1256(e)), sha256_Ch(e, f, g)), sha256_K[j]), W[j]);
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
    SHA512: function SHA512(options) {
      /**
       * Private properties configuration variables. You may need to tweak these to be compatible with
       * the server-side, but the defaults work in most cases.
       * @see this.setUpperCase() method
       * @see this.setPad() method
       */
      var hexcase = options && typeof options.uppercase === 'boolean' ? options.uppercase : false,

      /* hexadecimal output case format. false - lowercase; true - uppercase  */
      b64pad = options && typeof options.pad === 'string' ? options.pda : '=',

      /* base-64 pad character. Default '=' for strict RFC compliance   */
      utf8 = options && typeof options.utf8 === 'boolean' ? options.utf8 : true,

      /* enable/disable utf8 encoding */
      sha512_k;

      /* privileged (public) methods */
      this.hex = function (s) {
        return rstr2hex(rstr(s));
      };
      this.b64 = function (s) {
        return rstr2b64(rstr(s), b64pad);
      };
      this.any = function (s, e) {
        return rstr2any(rstr(s), e);
      };
      this.raw = function (s) {
        return rstr(s, utf8);
      };
      this.hex_hmac = function (k, d) {
        return rstr2hex(rstr_hmac(k, d));
      };
      this.b64_hmac = function (k, d) {
        return rstr2b64(rstr_hmac(k, d), b64pad);
      };
      this.any_hmac = function (k, d, e) {
        return rstr2any(rstr_hmac(k, d), e);
      };
      /**
       * Perform a simple self-test to see if the VM is working
       * @return {String} Hexadecimal hash sample
       * @public
       */
      this.vm_test = function () {
        return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
      };
      /**
       * @description Enable/disable uppercase hexadecimal returned string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUpperCase = function (a) {
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
      this.setPad = function (a) {
        b64pad = a || b64pad;
        return this;
      };
      /**
       * @description Defines a base64 pad string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUTF8 = function (a) {
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
        s = utf8 ? utf8Encode(s) : s;
        return binb2rstr(binb(rstr2binb(s), s.length * 8));
      }
      /*
       * Calculate the HMAC-SHA-512 of a key and some data (raw strings)
       */

      function rstr_hmac(key, data) {
        key = utf8 ? utf8Encode(key) : key;
        data = utf8 ? utf8Encode(data) : data;

        var hash,
            i = 0,
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
        var j,
            i,
            l,
            W = new Array(80),
            hash = new Array(16),

        //Initial hash values
        H = [new int64(0x6a09e667, -205731576), new int64(-1150833019, -2067093701), new int64(0x3c6ef372, -23791573), new int64(-1521486534, 0x5f1d36f1), new int64(0x510e527f, -1377402159), new int64(-1694144372, 0x2b3e6c1f), new int64(0x1f83d9ab, -79577749), new int64(0x5be0cd19, 0x137e2179)],
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
          sha512_k = [new int64(0x428a2f98, -685199838), new int64(0x71374491, 0x23ef65cd), new int64(-1245643825, -330482897), new int64(-373957723, -2121671748), new int64(0x3956c25b, -213338824), new int64(0x59f111f1, -1241133031), new int64(-1841331548, -1357295717), new int64(-1424204075, -630357736), new int64(-670586216, -1560083902), new int64(0x12835b01, 0x45706fbe), new int64(0x243185be, 0x4ee4b28c), new int64(0x550c7dc3, -704662302), new int64(0x72be5d74, -226784913), new int64(-2132889090, 0x3b1696b1), new int64(-1680079193, 0x25c71235), new int64(-1046744716, -815192428), new int64(-459576895, -1628353838), new int64(-272742522, 0x384f25e3), new int64(0xfc19dc6, -1953704523), new int64(0x240ca1cc, 0x77ac9c65), new int64(0x2de92c6f, 0x592b0275), new int64(0x4a7484aa, 0x6ea6e483), new int64(0x5cb0a9dc, -1119749164), new int64(0x76f988da, -2096016459), new int64(-1740746414, -295247957), new int64(-1473132947, 0x2db43210), new int64(-1341970488, -1728372417), new int64(-1084653625, -1091629340), new int64(-958395405, 0x3da88fc2), new int64(-710438585, -1828018395), new int64(0x6ca6351, -536640913), new int64(0x14292967, 0xa0e6e70), new int64(0x27b70a85, 0x46d22ffc), new int64(0x2e1b2138, 0x5c26c926), new int64(0x4d2c6dfc, 0x5ac42aed), new int64(0x53380d13, -1651133473), new int64(0x650a7354, -1951439906), new int64(0x766a0abb, 0x3c77b2a8), new int64(-2117940946, 0x47edaee6), new int64(-1838011259, 0x1482353b), new int64(-1564481375, 0x4cf10364), new int64(-1474664885, -1136513023), new int64(-1035236496, -789014639), new int64(-949202525, 0x654be30), new int64(-778901479, -688958952), new int64(-694614492, 0x5565a910), new int64(-200395387, 0x5771202a), new int64(0x106aa070, 0x32bbd1b8), new int64(0x19a4c116, -1194143544), new int64(0x1e376c08, 0x5141ab53), new int64(0x2748774c, -544281703), new int64(0x34b0bcb5, -509917016), new int64(0x391c0cb3, -976659869), new int64(0x4ed8aa4a, -482243893), new int64(0x5b9cca4f, 0x7763e373), new int64(0x682e6ff3, -692930397), new int64(0x748f82ee, 0x5defb2fc), new int64(0x78a5636f, 0x43172f60), new int64(-2067236844, -1578062990), new int64(-1933114872, 0x1a6439ec), new int64(-1866530822, 0x23631e28), new int64(-1538233109, -561857047), new int64(-1090935817, -1295615723), new int64(-965641998, -479046869), new int64(-903397682, -366583396), new int64(-779700025, 0x21c0c207), new int64(-354779690, -840897762), new int64(-176337025, -294727304), new int64(0x6f067aa, 0x72176fba), new int64(0xa637dc5, -1563912026), new int64(0x113f9804, -1090974290), new int64(0x1b710b35, 0x131c471b), new int64(0x28db77f5, 0x23047d84), new int64(0x32caab7b, 0x40c72493), new int64(0x3c9ebe0a, 0x15c9bebc), new int64(0x431d67c4, -1676669620), new int64(0x4cc5d4be, -885112138), new int64(0x597f299c, -60457430), new int64(0x5fcb6fab, 0x3ad6faec), new int64(0x6c44198c, 0x4a475817)];
        }

        for (i = 0; i < 80; i += 1) {
          W[i] = new int64(0, 0);
        }

        // append padding to the source string. The format is described in the FIPS.
        x[len >> 5] |= 0x80 << 24 - (len & 0x1f);
        x[(len + 128 >> 10 << 5) + 31] = len;
        l = x.length;
        for (i = 0; i < l; i += 32) {
          //32 dwords is the block size
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
            Ch.l = e.l & f.l ^ ~e.l & g.l;
            Ch.h = e.h & f.h ^ ~e.h & g.h;

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
            Maj.l = a.l & b.l ^ a.l & c.l ^ b.l & c.l;
            Maj.h = a.h & b.h ^ a.h & c.h ^ b.h & c.h;

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
        dst.l = x.l >>> shift | x.h << 32 - shift;
        dst.h = x.h >>> shift | x.l << 32 - shift;
      }

      //Reverses the dwords of the source and then rotates right by shift.
      //This is equivalent to rotation by 32+shift

      function int64revrrot(dst, x, shift) {
        dst.l = x.h >>> shift | x.l << 32 - shift;
        dst.h = x.l >>> shift | x.h << 32 - shift;
      }

      //Bitwise-shifts right a 64-bit number by shift
      //Won't handle shift>=32, but it's never needed in SHA512

      function int64shr(dst, x, shift) {
        dst.l = x.l >>> shift | x.h << 32 - shift;
        dst.h = x.h >>> shift;
      }

      //Adds two 64-bit numbers
      //Like the original implementation, does not rely on 32-bit operations

      function int64add(dst, x, y) {
        var w0 = (x.l & 0xffff) + (y.l & 0xffff);
        var w1 = (x.l >>> 16) + (y.l >>> 16) + (w0 >>> 16);
        var w2 = (x.h & 0xffff) + (y.h & 0xffff) + (w1 >>> 16);
        var w3 = (x.h >>> 16) + (y.h >>> 16) + (w2 >>> 16);
        dst.l = w0 & 0xffff | w1 << 16;
        dst.h = w2 & 0xffff | w3 << 16;
      }

      //Same, except with 4 addends. Works faster than adding them one by one.

      function int64add4(dst, a, b, c, d) {
        var w0 = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff) + (d.l & 0xffff);
        var w1 = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (w0 >>> 16);
        var w2 = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) + (d.h & 0xffff) + (w1 >>> 16);
        var w3 = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (w2 >>> 16);
        dst.l = w0 & 0xffff | w1 << 16;
        dst.h = w2 & 0xffff | w3 << 16;
      }

      //Same, except with 5 addends

      function int64add5(dst, a, b, c, d, e) {
        var w0 = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff) + (d.l & 0xffff) + (e.l & 0xffff),
            w1 = (a.l >>> 16) + (b.l >>> 16) + (c.l >>> 16) + (d.l >>> 16) + (e.l >>> 16) + (w0 >>> 16),
            w2 = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) + (d.h & 0xffff) + (e.h & 0xffff) + (w1 >>> 16),
            w3 = (a.h >>> 16) + (b.h >>> 16) + (c.h >>> 16) + (d.h >>> 16) + (e.h >>> 16) + (w2 >>> 16);
        dst.l = w0 & 0xffff | w1 << 16;
        dst.h = w2 & 0xffff | w3 << 16;
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
    RMD160: function RMD160(options) {
      /**
       * Private properties configuration variables. You may need to tweak these to be compatible with
       * the server-side, but the defaults work in most cases.
       * @see this.setUpperCase() method
       * @see this.setPad() method
       */
      var hexcase = options && typeof options.uppercase === 'boolean' ? options.uppercase : false,

      /* hexadecimal output case format. false - lowercase; true - uppercase  */
      b64pad = options && typeof options.pad === 'string' ? options.pda : '=',

      /* base-64 pad character. Default '=' for strict RFC compliance   */
      utf8 = options && typeof options.utf8 === 'boolean' ? options.utf8 : true,

      /* enable/disable utf8 encoding */
      rmd160_r1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13],
          rmd160_r2 = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11],
          rmd160_s1 = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6],
          rmd160_s2 = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11];

      /* privileged (public) methods */
      this.hex = function (s) {
        return rstr2hex(rstr(s, utf8));
      };
      this.b64 = function (s) {
        return rstr2b64(rstr(s, utf8), b64pad);
      };
      this.any = function (s, e) {
        return rstr2any(rstr(s, utf8), e);
      };
      this.raw = function (s) {
        return rstr(s, utf8);
      };
      this.hex_hmac = function (k, d) {
        return rstr2hex(rstr_hmac(k, d));
      };
      this.b64_hmac = function (k, d) {
        return rstr2b64(rstr_hmac(k, d), b64pad);
      };
      this.any_hmac = function (k, d, e) {
        return rstr2any(rstr_hmac(k, d), e);
      };
      /**
       * Perform a simple self-test to see if the VM is working
       * @return {String} Hexadecimal hash sample
       * @public
       */
      this.vm_test = function () {
        return hex('abc').toLowerCase() === '900150983cd24fb0d6963f7d28e17f72';
      };
      /**
       * @description Enable/disable uppercase hexadecimal returned string
       * @param {boolean}
       * @return {Object} this
       * @public
       */
      this.setUpperCase = function (a) {
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
      this.setPad = function (a) {
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
      this.setUTF8 = function (a) {
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
        s = utf8 ? utf8Encode(s) : s;
        return binl2rstr(binl(rstr2binl(s), s.length * 8));
      }

      /**
       * Calculate the HMAC-rmd160 of a key and some data (raw strings)
       */

      function rstr_hmac(key, data) {
        key = utf8 ? utf8Encode(key) : key;
        data = utf8 ? utf8Encode(data) : data;
        var i,
            hash,
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
        var i,
            output = '',
            l = input.length * 32;
        for (i = 0; i < l; i += 8) {
          output += String.fromCharCode(input[i >> 5] >>> i % 32 & 0xFF);
        }
        return output;
      }

      /**
       * Calculate the RIPE-MD160 of an array of little-endian words, and a bit length.
       */

      function binl(x, len) {
        var T,
            j,
            i,
            l,
            h0 = 0x67452301,
            h1 = 0xefcdab89,
            h2 = 0x98badcfe,
            h3 = 0x10325476,
            h4 = 0xc3d2e1f0,
            A1,
            B1,
            C1,
            D1,
            E1,
            A2,
            B2,
            C2,
            D2,
            E2;

        /* append padding */
        x[len >> 5] |= 0x80 << len % 32;
        x[(len + 64 >>> 9 << 4) + 14] = len;
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
        return 0 <= j && j <= 15 ? x ^ y ^ z : 16 <= j && j <= 31 ? x & y | ~x & z : 32 <= j && j <= 47 ? (x | ~y) ^ z : 48 <= j && j <= 63 ? x & z | y & ~z : 64 <= j && j <= 79 ? x ^ (y | ~z) : 'rmd160_f: j out of range';
      }

      function rmd160_K1(j) {
        return 0 <= j && j <= 15 ? 0x00000000 : 16 <= j && j <= 31 ? 0x5a827999 : 32 <= j && j <= 47 ? 0x6ed9eba1 : 48 <= j && j <= 63 ? 0x8f1bbcdc : 64 <= j && j <= 79 ? 0xa953fd4e : 'rmd160_K1: j out of range';
      }

      function rmd160_K2(j) {
        return 0 <= j && j <= 15 ? 0x50a28be6 : 16 <= j && j <= 31 ? 0x5c4dd124 : 32 <= j && j <= 47 ? 0x6d703ef3 : 48 <= j && j <= 63 ? 0x7a6d76e9 : 64 <= j && j <= 79 ? 0x00000000 : 'rmd160_K2: j out of range';
      }
    }
  };

  // exposes Hashes
  (function (window, undefined) {
    var freeExports = false;
    if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
      freeExports = exports;
      if (exports && (typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' && global && global === global.global) {
        window = global;
      }
    }

    if (typeof define === 'function' && _typeof(define.amd) === 'object' && define.amd) {
      // define as an anonymous module, so, through path mapping, it can be aliased
      define(function () {
        return Hashes;
      });
    } else if (freeExports) {
      // in Node.js or RingoJS v0.8.0+
      if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module && module.exports === freeExports) {
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
  })(this);
})(); // IIFE

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],12:[function(_dereq_,module,exports){
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

},{}],13:[function(_dereq_,module,exports){
'use strict';

var Hashes = _dereq_('./hashes');
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

module.exports = make_image;

// console.log(make_image('Spelterini_Blüemlisalp.jpg'));
// console.log(make_image('Charlatans.jpg'));
// make_image('File:Abingdonschool.jpg');
//1e44ecfe85c6446438da2a01a2bf9e4c

},{"./hashes":11}],14:[function(_dereq_,module,exports){
//split text into sentences, using regex
//@spencermountain MIT

//(Rule-based sentence boundary segmentation) - chop given text into its proper sentences.
// Ignore periods/questions/exclamations used in acronyms/abbreviations/numbers, etc.
// @spencermountain 2015 MIT
'use strict';

var abbreviations = ['jr', 'mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'sen', 'corp', 'calif', 'rep', 'gov', 'atty', 'supt', 'det', 'rev', 'col', 'gen', 'lt', 'cmdr', 'adm', 'capt', 'sgt', 'cpl', 'maj', 'dept', 'univ', 'assn', 'bros', 'inc', 'ltd', 'co', 'corp', 'arc', 'al', 'ave', 'blvd', 'cl', 'ct', 'cres', 'exp', 'rd', 'st', 'dist', 'mt', 'ft', 'fy', 'hwy', 'la', 'pd', 'pl', 'plz', 'tce', 'Ala', 'Ariz', 'Ark', 'Cal', 'Calif', 'Col', 'Colo', 'Conn', 'Del', 'Fed', 'Fla', 'Ga', 'Ida', 'Id', 'Ill', 'Ind', 'Ia', 'Kan', 'Kans', 'Ken', 'Ky', 'La', 'Me', 'Md', 'Mass', 'Mich', 'Minn', 'Miss', 'Mo', 'Mont', 'Neb', 'Nebr', 'Nev', 'Mex', 'Okla', 'Ok', 'Ore', 'Penna', 'Penn', 'Pa', 'Dak', 'Tenn', 'Tex', 'Ut', 'Vt', 'Va', 'Wash', 'Wis', 'Wisc', 'Wy', 'Wyo', 'USAFA', 'Alta', 'Ont', 'QuÔøΩ', 'Sask', 'Yuk', 'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'sept', 'vs', 'etc', 'esp', 'llb', 'md', 'bl', 'phd', 'ma', 'ba', 'miss', 'misses', 'mister', 'sir', 'esq', 'mstr', 'lit', 'fl', 'ex', 'eg', 'sep', 'sept', '..'];

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
      //else, only whitespace, no terms, no sentence
    }
    chunks.push(s);
  }

  //detection of non-sentence chunks
  // const abbrev_reg   = new RegExp('\\b(' + abbreviations.join('|') + ')[.!?] ?$', 'i');
  var abbrev_reg = new RegExp('(^| )(' + abbreviations.join('|') + ')[.!?] ?$', 'i');
  var acronym_reg = new RegExp('[ |\.][A-Z]\.? +?$', 'i');
  var elipses_reg = new RegExp('\\.\\.\\.* +?$');

  var isSentence = function isSentence(hmm) {
    if (hmm.match(abbrev_reg) || hmm.match(acronym_reg) || hmm.match(elipses_reg)) {
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

},{}],15:[function(_dereq_,module,exports){
"use strict";

var kill_xml = _dereq_("./kill_xml");

function cleanup_misc(wiki) {
  //the dump requires us to unescape xml
  //remove comments
  wiki = wiki.replace(/<!--[^>]{0,2000}-->/g, "");
  wiki = wiki.replace(/__(NOTOC|NOEDITSECTION|FORCETOC|TOC)__/ig, "");
  //signitures
  wiki = wiki.replace(/~~{1,3}/, "");
  //horizontal rule
  wiki = wiki.replace(/--{1,3}/, "");
  //space
  wiki = wiki.replace(/&nbsp;/g, " ");
  //kill off interwiki links
  wiki = wiki.replace(/\[\[([a-z][a-z]|simple|war|ceb|min):.{2,60}\]\]/i, "");
  //bold and italics combined
  wiki = wiki.replace(/''{4}([^']{0,200})''{4}/g, "$1");
  //bold
  wiki = wiki.replace(/''{2}([^']{0,200})''{2}/g, "$1");
  //italic
  wiki = wiki.replace(/''([^']{0,200})''/g, "$1");
  //give it the inglorious send-off it deserves..
  wiki = kill_xml(wiki);

  return wiki;
}
module.exports = cleanup_misc;
// console.log(cleanup_misc("hi [[as:Plancton]] there"));
// console.log(cleanup_misc('hello <br/> world'))
// console.log(cleanup_misc("hello <asd f> world </h2>"))

},{"./kill_xml":16}],16:[function(_dereq_,module,exports){
"use strict";

//okay, i know you're not supposed to regex html, but...
//https://en.wikipedia.org/wiki/Help:HTML_in_wikitext

var kill_xml = function kill_xml(wiki) {
  //luckily, refs can't be recursive..
  wiki = wiki.replace(/ ?<ref>[\s\S]{0,500}?<\/ref> ?/gi, " "); // <ref></ref>
  wiki = wiki.replace(/ ?<ref [^>]{0,200}?\/> ?/gi, " "); // <ref name=""/>
  wiki = wiki.replace(/ ?<ref [^>]{0,200}?>[\s\S]{0,500}?<\/ref> ?/ig, " "); // <ref name=""></ref>
  //other types of xml that we want to trash completely

  wiki = wiki.replace(/< ?(table|code|score|data|categorytree|charinsert|gallery|hiero|imagemap|inputbox|math|nowiki|poem|references|source|syntaxhighlight|timeline) ?[^>]{0,200}?>[\s\S]{0,700}< ?\/ ?(table|code|score|data|categorytree|charinsert|gallery|hiero|imagemap|inputbox|math|nowiki|poem|references|source|syntaxhighlight|timeline) ?>/gi, " "); // <table name=""><tr>hi</tr></table>

  //some xml-like fragments we can also kill
  //
  wiki = wiki.replace(/ ?< ?(ref|span|div|table|data) [a-z0-9=" ]{2,20}\/ ?> ?/g, " "); //<ref name="asd"/>
  //some formatting xml, we'll keep their insides though
  wiki = wiki.replace(/ ?<[ \/]?(p|sub|sup|span|nowiki|div|table|br|tr|td|th|pre|pre2|hr)[ \/]?> ?/g, " "); //<sub>, </sub>
  wiki = wiki.replace(/ ?<[ \/]?(abbr|bdi|bdo|blockquote|cite|del|dfn|em|i|ins|kbd|mark|q|s)[ \/]?> ?/g, " "); //<abbr>, </abbr>
  wiki = wiki.replace(/ ?<[ \/]?h[0-9][ \/]?> ?/g, " "); //<h2>, </h2>
  //a more generic + dangerous xml-tag removal
  wiki = wiki.replace(/ ?<[ \/]?[a-z0-9]{1,8}[ \/]?> ?/g, " "); //<samp>
  wiki = wiki.replace(/ ?< ?br ?\/> ?/g, " "); //<br />
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

},{}],17:[function(_dereq_,module,exports){
"use strict";

var i18n = _dereq_("../data/i18n");

function parse_categories(wiki) {
  var cats = [];
  var reg = new RegExp("\\[\\[:?(" + i18n.categories.join("|") + "):(.{2,60}?)\]\](\w{0,10})", "ig");
  var tmp = wiki.match(reg); //regular links
  if (tmp) {
    var reg2 = new RegExp("^\\[\\[:?(" + i18n.categories.join("|") + "):", "ig");
    tmp.forEach(function (c) {
      c = c.replace(reg2, "");
      c = c.replace(/\|?[ \*]?\]\]$/i, ""); //parse fancy onces..
      c = c.replace(/\|.*/, ""); //everything after the '|' is metadata
      if (c && !c.match(/[\[\]]/)) {
        cats.push(c);
      }
    });
  }
  return cats;
}
module.exports = parse_categories;

},{"../data/i18n":6}],18:[function(_dereq_,module,exports){
"use strict";

var parse_links = _dereq_("./parse_links");

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
    type: "disambiguation",
    pages: pages
  };
};
module.exports = parse_disambig;

},{"./parse_links":23}],19:[function(_dereq_,module,exports){
"use strict";

var i18n = _dereq_("../data/i18n");
//images are usually [[image:my_pic.jpg]]

function parse_image(img) {
  var reg = new RegExp("(" + i18n.images.concat(i18n.files).join("|") + "):.*?[\\|\\]]", "i");
  img = img.match(reg) || [""];
  img = img[0].replace(/[\|\]]$/, "");
  return img;
}
module.exports = parse_image;

// console.log(parse_image("[[image:my_pic.jpg]]"));

},{"../data/i18n":6}],20:[function(_dereq_,module,exports){
"use strict";

var helpers = _dereq_("../lib/helpers");
var parse_line = _dereq_("./parse_line");

function parse_infobox(str) {
    var obj = {};

    if (str) {
        //this collapsible list stuff is just a headache
        str = str.replace(/\{\{Collapsible list[^}]{10,1000}\}\}/g, "");

        var stringBuilder = [];

        var lastChar = void 0;
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

        var regex = /\n *\|([^=]*)=(.*)/g;

        var regexMatch;
        while ((regexMatch = regex.exec(str)) !== null) {

            var key = helpers.trim_whitespace(regexMatch[1] || "") || "";
            var value = helpers.trim_whitespace(regexMatch[2] || "") || "";

            //this is necessary for mongodb, im sorry
            if (key && key.match(/[\.]/)) {
                key = null;
            }

            if (key && value) {
                obj[key] = parse_line(value);
                //turn number strings into integers
                if (obj[key].text && obj[key].text.match(/^[0-9,]*$/)) {
                    obj[key].text = obj[key].text.replace(/,/g);
                    obj[key].text = parseInt(obj[key].text, 10);
                }
            }
        }
    }

    return obj;
}
module.exports = parse_infobox;

},{"../lib/helpers":12,"./parse_line":22}],21:[function(_dereq_,module,exports){
"use strict";

var i18n = _dereq_("../data/i18n");

function parse_infobox_template(str) {
  var template = '';
  if (str) {
    var infobox_template_reg = new RegExp("\{\{(?:" + i18n.infoboxes.join("|") + ")\\s*(.*)", "i");
    var matches = str.match(infobox_template_reg);
    if (matches && matches.length > 1) {
      template = matches[1];
    }
  }
  return template;
}
module.exports = parse_infobox_template;

},{"../data/i18n":6}],22:[function(_dereq_,module,exports){
"use strict";

var helpers = _dereq_("../lib/helpers");
var parse_links = _dereq_("./parse_links");
var i18n = _dereq_("../data/i18n");

//return only rendered text of wiki links
function resolve_links(line) {
  // categories, images, files
  var re = new RegExp("\\[\\[:?(" + i18n.categories.join("|") + "):[^\\]\\]]{2,80}\\]\\]", "gi");
  line = line.replace(re, "");

  // [[Common links]]
  line = line.replace(/\[\[:?([^|]{2,80}?)\]\](\w{0,5})/g, "$1$2");
  // [[File:with|Size]]
  line = line.replace(/\[\[File:?(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, "$1");
  // [[Replaced|Links]]
  line = line.replace(/\[\[:?(.{2,80}?)\|([^\]]+?)\]\](\w{0,5})/g, "$2$3");
  // External links
  line = line.replace(/\[(https?|news|ftp|mailto|gopher|irc):\/\/[^\]\| ]{4,1500}([\| ].*?)?\]/g, "$2");
  return line;
}
// console.log(resolve_links("[http://www.whistler.ca www.whistler.ca]"))

function postprocess(line) {

  //fix links
  line = resolve_links(line);
  //oops, recursive image bug
  if (line.match(/^(thumb|right|left)\|/i)) {
    return null;
  }

  line = helpers.trim_whitespace(line);

  // put new lines back in
  // line=line+"\n";

  return line;
}

function parse_line(line) {
  return {
    text: postprocess(line),
    links: parse_links(line)
  };
}

// console.log(fetch_links("it is [[Tony Hawk|Tony]]s moher in [[Toronto]]s"))
module.exports = parse_line;

},{"../data/i18n":6,"../lib/helpers":12,"./parse_links":23}],23:[function(_dereq_,module,exports){
"use strict";

var helpers = _dereq_("../lib/helpers");
//grab an array of internal links in the text
var parse_links = function parse_links(str) {
  var links = [];
  var tmp = str.match(/\[\[(.{2,80}?)\]\](\w{0,10})/g); //regular links
  if (tmp) {
    tmp.forEach(function (s) {
      var link, txt;
      if (s.match(/\|/)) {
        //replacement link [[link|text]]
        s = s.replace(/\[\[(.{2,80}?)\]\](\w{0,10})/g, "$1$2"); //remove ['s and keep suffix
        link = s.replace(/(.{2,60})\|.{0,200}/, "$1"); //replaced links
        txt = s.replace(/.{2,60}?\|/, '');
        //handle funky case of [[toronto|]]
        if (!txt && link.match(/\|$/)) {
          link = link.replace(/\|$/, '');
          txt = link;
        }
      } else {
        // standard link [[link]]
        link = s.replace(/\[\[(.{2,60}?)\]\](\w{0,10})/g, "$1"); //remove ['s
      }
      //kill off non-wikipedia namespaces
      if (link.match(/^:?(category|catégorie|Kategorie|Categoría|Categoria|Categorie|Kategoria|تصنيف|image|file|image|fichier|datei|media|special|wp|wikipedia|help|user|mediawiki|portal|talk|template|book|draft|module|topic|wiktionary|wikisource):/i)) {
        return;
      }
      //kill off just anchor links [[#history]]
      if (link.match(/^#/i)) {
        return;
      }
      //remove anchors from end [[toronto#history]]
      link = link.replace(/#[^ ]{1,100}/, '');
      link = helpers.capitalise(link);
      var obj = {
        page: link,
        src: txt
      };
      links.push(obj);
    });
  }
  links = links.filter(helpers.onlyUnique);
  if (links.length === 0) {
    return undefined;
  }
  return links;
};
module.exports = parse_links;

},{"../lib/helpers":12}],24:[function(_dereq_,module,exports){
"use strict";

var i18n = _dereq_("../data/i18n");
//pulls target link out of redirect page
var REDIRECT_REGEX = new RegExp("^ ?#(" + i18n.redirects.join("|") + ") *?\\[\\[(.{2,60}?)\\]\\]", "i");

exports.is_redirect = function (wiki) {
  return wiki.match(REDIRECT_REGEX);
};

exports.parse_redirect = function (wiki) {
  var article = (wiki.match(REDIRECT_REGEX) || [])[2] || "";
  article = article.replace(/#.*/, "");
  return {
    type: "redirect",
    redirect: article
  };
};

},{"../data/i18n":6}],25:[function(_dereq_,module,exports){
'use strict';

var helpers = _dereq_("../lib/helpers");
//turn a {|...table string into an array of arrays
var parse_table = function parse_table(wiki) {
  var table = [];
  var lines = wiki.replace(/\r/g, '').split(/\n/);
  lines.forEach(function (str) {
    //die
    if (str.match(/^\|\}/)) {
      return;
    }
    //make new row
    if (str.match(/^\|-/)) {
      table.push([]);
      return;
    }
    //this is some kind of comment
    if (str.match(/^\|\+/)) {
      return;
    }
    //juicy line
    if (str.match(/^[\!\|]/)) {
      //make a new row
      if (!table[table.length - 1]) {
        table[table.length - 1] = [];
      }
      var want = (str.match(/\|(.*)/) || [])[1] || '';
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
  return table;
};
module.exports = parse_table;

},{"../lib/helpers":12}],26:[function(_dereq_,module,exports){
'use strict';

//find all the pairs of '[[...[[..]]...]]' in the text
//used to properly root out recursive template calls, [[.. [[...]] ]]
//basically just adds open tags, and subtracts closing tags
function recursive_matches(opener, closer, text) {
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
module.exports = recursive_matches;

// console.log(recursive_matches("{", "}", "he is president. {{nowrap|{{small|(1995–present)}}}} he lives in texas"))
// console.log(recursive_matches("{", "}", "this is fun {{nowrap{{small1995–present}}}} and it works"))

},{}],27:[function(_dereq_,module,exports){
'use strict';

var languages = _dereq_('./data/languages');

// templates that need parsing and replacing for inline text
//https://en.wikipedia.org/wiki/Category:Magic_word_templates
var word_templates = function word_templates(wiki) {
  //we can be sneaky with this template, as it's often found inside other templates
  wiki = wiki.replace(/\{\{URL\|([^ ]{4,100}?)\}\}/gi, '$1');
  //this one needs to be handled manually
  wiki = wiki.replace(/\{\{convert\|([0-9]*?)\|([^\|]*?)\}\}/gi, '$1 $2');
  //date-time templates
  var d = new Date();
  wiki = wiki.replace(/\{\{(CURRENT|LOCAL)DAY(2)?\}\}/gi, d.getDate());
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  wiki = wiki.replace(/\{\{(CURRENT|LOCAL)MONTH(NAME|ABBREV)?\}\}/gi, months[d.getMonth()]);
  wiki = wiki.replace(/\{\{(CURRENT|LOCAL)YEAR\}\}/gi, d.getFullYear());
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  wiki = wiki.replace(/\{\{(CURRENT|LOCAL)DAYNAME\}\}/gi, days[d.getDay()]);
  //formatting templates
  wiki = wiki.replace(/\{\{(lc|uc|formatnum):(.*?)\}\}/gi, '$2');
  wiki = wiki.replace(/\{\{pull quote\|([\s\S]*?)(\|[\s\S]*?)?\}\}/gi, '$1');
  wiki = wiki.replace(/\{\{cquote\|([\s\S]*?)(\|[\s\S]*?)?\}\}/gi, '$1');
  if (wiki.match(/\{\{dts\|/)) {
    var date = (wiki.match(/\{\{dts\|(.*?)[\}\|]/) || [])[1] || '';
    date = new Date(date);
    if (date && date.getTime()) {
      wiki = wiki.replace(/\{\{dts\|.*?\}\}/gi, date.toDateString());
    } else {
      wiki = wiki.replace(/\{\{dts\|.*?\}\}/gi, ' ');
    }
  }
  if (wiki.match(/\{\{date\|.*?\}\}/)) {
    var date = wiki.match(/\{\{date\|(.*?)\|(.*?)\|(.*?)\}\}/) || [] || [];
    var dateString = date[1] + ' ' + date[2] + ' ' + date[3];
    wiki = wiki.replace(/\{\{date\|.*?\}\}/gi, dateString);
  }
  //common templates in wiktionary
  wiki = wiki.replace(/\{\{term\|(.*?)\|.*?\}\}/gi, '\'$1\'');
  wiki = wiki.replace(/\{\{IPA\|(.*?)\|.*?\}\}/gi, '$1');
  wiki = wiki.replace(/\{\{sense\|(.*?)\|?.*?\}\}/gi, '($1)');
  wiki = wiki.replace(/\{\{t\+?\|...?\|(.*?)(\|.*)?\}\}/gi, '\'$1\'');
  //replace languages in 'etyl' tags
  if (wiki.match(/\{\{etyl\|/)) {
    //doesn't support multiple-ones per sentence..
    var lang = wiki.match(/\{\{etyl\|(.*?)\|.*?\}\}/i)[1] || '';
    lang = lang.toLowerCase();
    if (lang && languages[lang]) {
      wiki = wiki.replace(/\{\{etyl\|(.*?)\|.*?\}\}/gi, languages[lang].english_title);
    } else {
      wiki = wiki.replace(/\{\{etyl\|(.*?)\|.*?\}\}/gi, '($1)');
    }
  }
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

},{"./data/languages":7}]},{},[9])(9)
});