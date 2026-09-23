/*! wtf-plugin-summary 1.0.0 MIT */
const methods$o = {
  one: {},
  two: {},
  three: {},
  four: {},
};

const model$6 = {
  one: {},
  two: {},
  three: {},
};
const compute$b = {};
const hooks = [];

var tmpWrld = { methods: methods$o, model: model$6, compute: compute$b, hooks };

const isArray$b = input => Object.prototype.toString.call(input) === '[object Array]';

const fns$5 = {
  /** add metadata to term objects */
  compute: function (input) {
    const { world } = this;
    const compute = world.compute;
    // do one method
    if (typeof input === 'string' && compute.hasOwnProperty(input)) {
      compute[input](this);
    }
    // allow a list of methods
    else if (isArray$b(input)) {
      input.forEach(name => {
        if (world.compute.hasOwnProperty(name)) {
          compute[name](this);
        } else {
          console.warn('no compute:', input); // eslint-disable-line
        }
      });
    }
    // allow a custom compute function
    else if (typeof input === 'function') {
      input(this);
    } else {
      console.warn('no compute:', input); // eslint-disable-line
    }
    return this
  },
};

// wrappers for loops in javascript arrays

const forEach = function (cb) {
  const ptrs = this.fullPointer;
  ptrs.forEach((ptr, i) => {
    const view = this.update([ptr]);
    cb(view, i);
  });
  return this
};

const map = function (cb, empty) {
  const ptrs = this.fullPointer;
  const res = ptrs.map((ptr, i) => {
    const view = this.update([ptr]);
    const out = cb(view, i);
    // if we returned nothing, return a view
    if (out === undefined) {
      return this.none()
    }
    return out
  });
  if (res.length === 0) {
    return empty || this.update([])
  }
  // return an array of values, or View objects?
  // user can return either from their callback
  if (res[0] !== undefined) {
    // array of strings
    if (typeof res[0] === 'string') {
      return res
    }
    // array of objects
    if (typeof res[0] === 'object' && (res[0] === null || !res[0].isView)) {
      return res
    }
  }
  // return a View object
  let all = [];
  res.forEach(ptr => {
    all = all.concat(ptr.fullPointer);
  });
  return this.toView(all)
};

const filter = function (cb) {
  let ptrs = this.fullPointer;
  ptrs = ptrs.filter((ptr, i) => {
    const view = this.update([ptr]);
    return cb(view, i)
  });
  const res = this.update(ptrs);
  return res
};

const find$6 = function (cb) {
  const ptrs = this.fullPointer;
  const found = ptrs.find((ptr, i) => {
    const view = this.update([ptr]);
    return cb(view, i)
  });
  return this.update([found])
};

const some = function (cb) {
  const ptrs = this.fullPointer;
  return ptrs.some((ptr, i) => {
    const view = this.update([ptr]);
    return cb(view, i)
  })
};

const random = function (n = 1) {
  let ptrs = this.fullPointer;
  let r = Math.floor(Math.random() * ptrs.length);
  //prevent it from going over the end
  if (r + n > this.length) {
    r = this.length - n;
    r = r < 0 ? 0 : r;
  }
  ptrs = ptrs.slice(r, r + n);
  return this.update(ptrs)
};
var loops = { forEach, map, filter, find: find$6, some, random };

const utils = {
  /** */
  termList: function () {
    return this.methods.one.termList(this.docs)
  },
  /** return individual terms*/
  terms: function (n) {
    const m = this.match('.');
    // this is a bit faster than .match('.') 
    // let ptrs = []
    // this.docs.forEach((terms) => {
    //   terms.forEach((term) => {
    //     let [y, x] = term.index || []
    //     ptrs.push([y, x, x + 1])
    //   })
    // })
    // let m = this.update(ptrs)
    return typeof n === 'number' ? m.eq(n) : m
  },

  /** */
  groups: function (group) {
    if (group || group === 0) {
      return this.update(this._groups[group] || [])
    }
    // return an object of Views
    const res = {};
    Object.keys(this._groups).forEach(k => {
      res[k] = this.update(this._groups[k]);
    });
    // this._groups = null
    return res
  },
  /** */
  eq: function (n) {
    let ptr = this.pointer;
    if (!ptr) {
      ptr = this.docs.map((_doc, i) => [i]);
    }
    if (ptr[n]) {
      return this.update([ptr[n]])
    }
    return this.none()
  },
  /** */
  first: function () {
    return this.eq(0)
  },
  /** */
  last: function () {
    const n = this.fullPointer.length - 1;
    return this.eq(n)
  },

  /** grab term[0] for every match */
  firstTerms: function () {
    return this.match('^.')
  },

  /** grab the last term for every match  */
  lastTerms: function () {
    return this.match('.$')
  },

  /** */
  slice: function (min, max) {
    let pntrs = this.pointer || this.docs.map((_o, n) => [n]);
    pntrs = pntrs.slice(min, max);
    return this.update(pntrs)
  },

  /** return a view of the entire document */
  all: function () {
    return this.update().toView()
  },
  /**  */
  fullSentences: function () {
    const ptrs = this.fullPointer.map(a => [a[0]]); //lazy!
    return this.update(ptrs).toView()
  },
  /** return a view of no parts of the document */
  none: function () {
    return this.update([])
  },

  /** are these two views looking at the same words? */
  isDoc: function (b) {
    if (!b || !b.isView) {
      return false
    }
    const aPtr = this.fullPointer;
    const bPtr = b.fullPointer;
    if (!aPtr.length === bPtr.length) {
      return false
    }
    // ensure pointers are the same
    return aPtr.every((ptr, i) => {
      if (!bPtr[i]) {
        return false
      }
      // ensure [n, start, end] are all the same
      return ptr[0] === bPtr[i][0] && ptr[1] === bPtr[i][1] && ptr[2] === bPtr[i][2]
    })
  },

  /** how many seperate terms does the document have? */
  wordCount: function () {
    return this.docs.reduce((count, terms) => {
      count += terms.filter(t => t.text !== '').length;
      return count
    }, 0)
  },

  // is the pointer the full sentence?
  isFull: function () {
    const ptrs = this.pointer;
    if (!ptrs) {
      return true
    }
    // must start at beginning
    if (ptrs.length === 0 || ptrs[0][0] !== 0) {
      return false
    }
    let wantTerms = 0;
    let haveTerms = 0;
    this.document.forEach(terms => wantTerms += terms.length);
    this.docs.forEach(terms => haveTerms += terms.length);
    return wantTerms === haveTerms
    // for (let i = 0; i < ptrs.length; i += 1) {
    //   let [n, start, end] = ptrs[i]
    //   // it's not the start
    //   if (n !== i || start !== 0) {
    //     return false
    //   }
    //   // it's too short
    //   if (document[n].length > end) {
    //     return false
    //   }
    // }
    // return true
  },

  // return the nth elem of a doc
  getNth: function (n) {
    if (typeof n === 'number') {
      return this.eq(n)
    } else if (typeof n === 'string') {
      return this.if(n)
    }
    return this
  }

};
utils.group = utils.groups;
utils.fullSentence = utils.fullSentences;
utils.sentence = utils.fullSentences;
utils.lastTerm = utils.lastTerms;
utils.firstTerm = utils.firstTerms;

const methods$n = Object.assign({}, utils, fns$5, loops);

// aliases
methods$n.get = methods$n.eq;

class View {
  constructor(document, pointer, groups = {}) {
    // invisible props
    const props = [
      ['document', document],
      ['world', tmpWrld],
      ['_groups', groups],
      ['_cache', null],
      ['viewType', 'View'],
    ];
    props.forEach(a => {
      Object.defineProperty(this, a[0], {
        value: a[1],
        writable: true,
      });
    });
    this.ptrs = pointer;
  }
  /* getters:  */
  get docs() {
    let docs = this.document;
    if (this.ptrs) {
      docs = tmpWrld.methods.one.getDoc(this.ptrs, this.document);
    }
    return docs
  }
  get pointer() {
    return this.ptrs
  }
  get methods() {
    return this.world.methods
  }
  get model() {
    return this.world.model
  }
  get hooks() {
    return this.world.hooks
  }
  get isView() {
    return true //this comes in handy sometimes
  }
  // is the view not-empty?
  get found() {
    return this.docs.length > 0
  }
  // how many matches we have
  get length() {
    return this.docs.length
  }
  // return a more-hackable pointer
  get fullPointer() {
    const { docs, ptrs, document } = this;
    // compute a proper pointer, from docs
    const pointers = ptrs || docs.map((_d, n) => [n]);
    // do we need to repair it, first?
    return pointers.map(a => {
      // eslint-disable-next-line prefer-const
      let [n, start, end, id, endId] = a;
      start = start || 0;
      end = end || (document[n] || []).length;
      //add frozen id, for good-measure
      if (document[n] && document[n][start]) {
        id = id || document[n][start].id;
        if (document[n][end - 1]) {
          endId = endId || document[n][end - 1].id;
        }
      }
      return [n, start, end, id, endId]
    })
  }
  // create a new View, from this one
  update(pointer) {
    const m = new View(this.document, pointer);
    // send the cache down, too?
    if (this._cache && pointer && pointer.length > 0) {
      // only keep cache if it's a full-sentence
      const cache = [];
      pointer.forEach((ptr, i) => {
        const [n, start, end] = ptr;
        if (ptr.length === 1) {
          cache[i] = this._cache[n];
        } else if (start === 0 && this.document[n].length === end) {
          cache[i] = this._cache[n];
        }
      });
      if (cache.length > 0) {
        m._cache = cache;
      }
    }
    m.world = this.world;
    return m
  }
  // create a new View, from this one
  toView(pointer) {
    return new View(this.document, pointer || this.pointer)
  }
  fromText(input) {
    const { methods } = this;
    //assume ./01-tokenize is installed
    const document = methods.one.tokenize.fromString(input, this.world);
    const doc = new View(document);
    doc.world = this.world;
    doc.compute(['normal', 'freeze', 'lexicon']);
    if (this.world.compute.preTagger) {
      doc.compute('preTagger');
    }
    doc.compute('unfreeze');
    return doc
  }
  clone() {
    // clone the whole document
    let document = this.document.slice(0); //node 17: structuredClone(document);
    document = document.map(terms => {
      return terms.map(term => {
        term = Object.assign({}, term);
        term.tags = new Set(term.tags);
        return term
      })
    });
    // clone only sub-document ?
    const m = this.update(this.pointer);
    m.document = document;
    m._cache = this._cache; //clone this too?
    return m
  }
}
Object.assign(View.prototype, methods$n);

var version = '14.15.1';

const isObject$6 = function (item) {
  return item && typeof item === 'object' && !Array.isArray(item)
};

const isArray$a = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
};

// recursive merge of objects
function mergeDeep(model, plugin) {
  if (isObject$6(plugin)) {
    for (const key in plugin) {
      if (isObject$6(plugin[key])) {
        if (!model[key]) Object.assign(model, { [key]: {} });
        mergeDeep(model[key], plugin[key]); //recursion
      } else {
        Object.assign(model, { [key]: plugin[key] });
      }
    }
  }
  return model
}
// const merged = mergeDeep({ a: 1 }, { b: { c: { d: { e: 12345 } } } })
// console.dir(merged, { depth: 5 })

// vroom
function mergeQuick(model, plugin) {
  for (const key in plugin) {
    model[key] = model[key] || {};
    Object.assign(model[key], plugin[key]);
  }
  return model
}

const addIrregulars = function (model, conj) {
  const m = model.two.models || {};
  Object.keys(conj).forEach(k => {
    // verb forms
    if (conj[k].pastTense) {
      if (m.toPast) {
        m.toPast.ex[k] = conj[k].pastTense;
      }
      if (m.fromPast) {
        m.fromPast.ex[conj[k].pastTense] = k;
      }
    }
    if (conj[k].presentTense) {
      if (m.toPresent) {
        m.toPresent.ex[k] = conj[k].presentTense;
      }
      if (m.fromPresent) {
        m.fromPresent.ex[conj[k].presentTense] = k;
      }
    }
    if (conj[k].gerund) {
      if (m.toGerund) {
        m.toGerund.ex[k] = conj[k].gerund;
      }
      if (m.fromGerund) {
        m.fromGerund.ex[conj[k].gerund] = k;
      }
    }
    // adjective forms
    if (conj[k].comparative) {
      if (m.toComparative) {
        m.toComparative.ex[k] = conj[k].comparative;
      }
      if (m.fromComparative) {
        m.fromComparative.ex[conj[k].comparative] = k;
      }
    }
    if (conj[k].superlative) {
      if (m.toSuperlative) {
        m.toSuperlative.ex[k] = conj[k].superlative;
      }
      if (m.fromSuperlative) {
        m.fromSuperlative.ex[conj[k].superlative] = k;
      }
    }
  });
};

const extend = function (plugin, world, View, nlp) {
  // support array of plugins
  if (isArray$a(plugin)) {
    plugin.forEach(p => extend(p, world, View, nlp));
    return
  }
  const { methods, model, compute, hooks } = world;
  if (plugin.methods) {
    mergeQuick(methods, plugin.methods);
  }
  if (plugin.model) {
    mergeDeep(model, plugin.model);
  }
  if (plugin.irregulars) {
    addIrregulars(model, plugin.irregulars);
  }
  // shallow-merge compute
  if (plugin.compute) {
    Object.assign(compute, plugin.compute);
  }
  // append new hooks
  if (hooks) {
    world.hooks = hooks.concat(plugin.hooks || []);
  }
  // assign new class methods
  if (plugin.api) {
    plugin.api(View);
  }
  if (plugin.lib) {
    Object.keys(plugin.lib).forEach(k => (nlp[k] = plugin.lib[k]));
  }
  if (plugin.tags) {
    nlp.addTags(plugin.tags);
  }
  if (plugin.words) {
    nlp.addWords(plugin.words);
  }
  if (plugin.frozen) {
    nlp.addWords(plugin.frozen, true);
  }
  if (plugin.mutate) {
    plugin.mutate(world, nlp);
  }
};

/** log the decision-making to console */
const verbose = function (set) {
  const env = typeof process === 'undefined' || !process.env ? self.env || {} : process.env; //use window, in browser
  env.DEBUG_TAGS = set === 'tagger' || set === true ? true : '';
  env.DEBUG_MATCH = set === 'match' || set === true ? true : '';
  env.DEBUG_CHUNKS = set === 'chunker' || set === true ? true : '';
  return this
};

const isObject$5 = val => {
  return Object.prototype.toString.call(val) === '[object Object]'
};

const isArray$9 = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
};

// internal Term objects are slightly different
const fromJson = function (json) {
  return json.map(o => {
    return o.terms.map(term => {
      if (isArray$9(term.tags)) {
        term.tags = new Set(term.tags);
      }
      return term
    })
  })
};

// interpret an array-of-arrays
const preTokenized = function (arr) {
  return arr.map((a) => {
    return a.map(str => {
      return {
        text: str,
        normal: str,//cleanup
        pre: '',
        post: ' ',
        tags: new Set()
      }
    })
  })
};

const inputs = function (input, View, world) {
  const { methods } = world;
  const doc = new View([]);
  doc.world = world;
  // support a number
  if (typeof input === 'number') {
    input = String(input);
  }
  // return empty doc
  if (!input) {
    return doc
  }
  // parse a string
  if (typeof input === 'string') {
    const document = methods.one.tokenize.fromString(input, world);
    return new View(document)
  }
  // handle compromise View
  if (isObject$5(input) && input.isView) {
    return new View(input.document, input.ptrs)
  }
  // handle json input
  if (isArray$9(input)) {
    // pre-tokenized array-of-arrays 
    if (isArray$9(input[0])) {
      const document = preTokenized(input);
      return new View(document)
    }
    // handle json output
    const document = fromJson(input);
    return new View(document)
  }
  return doc
};

const world = Object.assign({}, tmpWrld);

const nlp = function (input, lex) {
  if (lex) {
    nlp.addWords(lex);
  }
  const doc = inputs(input, View, world);
  if (input) {
    doc.compute(world.hooks);
  }
  return doc
};
Object.defineProperty(nlp, '_world', {
  value: world,
  writable: true,
});

/** don't run the POS-tagger */
nlp.tokenize = function (input, lex) {
  const { compute } = this._world;
  // add user-given words to lexicon
  if (lex) {
    nlp.addWords(lex);
  }
  // run the tokenizer
  const doc = inputs(input, View, world);
  // give contractions a shot, at least
  if (compute.contractions) {
    doc.compute(['alias', 'normal', 'machine', 'contractions']); //run it if we've got it
  }
  return doc
};

/** extend compromise functionality */
nlp.plugin = function (plugin) {
  extend(plugin, this._world, View, this);
  return this
};
nlp.extend = nlp.plugin;


/** reach-into compromise internals */
nlp.world = function () {
  return this._world
};
nlp.model = function () {
  return this._world.model
};
nlp.methods = function () {
  return this._world.methods
};
nlp.hooks = function () {
  return this._world.hooks
};

/** log the decision-making to console */
nlp.verbose = verbose;
/** current library release version */
nlp.version = version;

const createCache = function (document) {
  const cache = document.map(terms => {
    const items = new Set();
    terms.forEach(term => {
      // add words
      if (term.normal !== '') {
        items.add(term.normal);
      }
      // cache switch-status - '%Noun|Verb%'
      if (term.switch) {
        items.add(`%${term.switch}%`);
      }
      // cache implicit words, too
      if (term.implicit) {
        items.add(term.implicit);
      }
      if (term.machine) {
        items.add(term.machine);
      }
      if (term.root) {
        items.add(term.root);
      }
      // cache slashes words, etc
      if (term.alias) {
        term.alias.forEach(str => items.add(str));
      }
      const tags = Array.from(term.tags);
      for (let t = 0; t < tags.length; t += 1) {
        items.add('#' + tags[t]);
      }
    });
    return items
  });
  return cache
};

var methods$m = {
  one: {
    cacheDoc: createCache,
  },
};

const methods$l = {
  /** */
  cache: function () {
    this._cache = this.methods.one.cacheDoc(this.document);
    return this
  },
  /** */
  uncache: function () {
    this._cache = null;
    return this
  },
};
const addAPI$3 = function (View) {
  Object.assign(View.prototype, methods$l);
};

var compute$a = {
  cache: function (view) {
    view._cache = view.methods.one.cacheDoc(view.document);
  }
};

var cache$1 = {
  api: addAPI$3,
  compute: compute$a,
  methods: methods$m,
};

var caseFns = {
  /** */
  toLowerCase: function () {
    this.termList().forEach(t => {
      t.text = t.text.toLowerCase();
    });
    return this
  },
  /** */
  toUpperCase: function () {
    this.termList().forEach(t => {
      t.text = t.text.toUpperCase();
    });
    return this
  },
  /** */
  toTitleCase: function () {
    this.termList().forEach(t => {
      t.text = t.text.replace(/^ *[a-z\u00C0-\u00FF]/, x => x.toUpperCase()); //support unicode?
    });
    return this
  },
  /** */
  toCamelCase: function () {
    this.docs.forEach(terms => {
      terms.forEach((t, i) => {
        if (i !== 0) {
          t.text = t.text.replace(/^ *[a-z\u00C0-\u00FF]/, x => x.toUpperCase()); //support unicode?
        }
        if (i !== terms.length - 1) {
          t.post = '';
        }
      });
    });
    return this
  },
};

// case logic
const isTitleCase$4 = (str) => /^\p{Lu}[\p{Ll}'’]/u.test(str) || /^\p{Lu}$/u.test(str);
const toTitleCase$2 = (str) => str.replace(/^\p{Ll}/u, x => x.toUpperCase());
const toLowerCase$1 = (str) => str.replace(/^\p{Lu}/u, x => x.toLowerCase());

// splice an array into an array
const spliceArr = (parent, index, child) => {
  // tag them as dirty
  child.forEach(term => term.dirty = true);
  if (parent) {
    const args = [index, 0].concat(child);
    Array.prototype.splice.apply(parent, args);
  }
  return parent
};

// add a space at end, if required
const endSpace = function (terms) {
  const hasSpace = / $/;
  const hasDash = /[-–—]/;
  const lastTerm = terms[terms.length - 1];
  if (lastTerm && !hasSpace.test(lastTerm.post) && !hasDash.test(lastTerm.post)) {
    lastTerm.post += ' ';
  }
};

// sentence-ending punctuation should move in append
const movePunct = (source, end, needle) => {
  const juicy = /[-.?!,;:)–—'"]/g;
  const wasLast = source[end - 1];
  if (!wasLast) {
    return
  }
  const post = wasLast.post;
  if (juicy.test(post)) {
    const punct = post.match(juicy).join(''); //not perfect
    const last = needle[needle.length - 1];
    last.post = punct + last.post;
    // remove it, from source
    wasLast.post = wasLast.post.replace(juicy, '');
  }
};


const moveTitleCase = function (home, start, needle) {
  const from = home[start];
  // should we bother?
  if (start !== 0 || !isTitleCase$4(from.text)) {
    return
  }
  // titlecase new first term
  needle[0].text = toTitleCase$2(needle[0].text);
  // should we un-titlecase the old word?
  const old = home[start];
  if (old.tags.has('ProperNoun') || old.tags.has('Acronym')) {
    return
  }
  if (isTitleCase$4(old.text) && old.text.length > 1) {
    old.text = toLowerCase$1(old.text);
  }
};

// put these words before the others
const cleanPrepend = function (home, ptr, needle, document) {
  const [n, start, end] = ptr;
  // introduce spaces appropriately
  if (start === 0) {
    // at start - need space in insert
    endSpace(needle);
  } else if (end === document[n].length) {
    // at end - need space in home
    endSpace(needle);
  } else {
    // in middle - need space in home and insert
    endSpace(needle);
    endSpace([home[ptr[1]]]);
  }
  moveTitleCase(home, start, needle);
  // movePunct(home, end, needle)
  spliceArr(home, start, needle);
};

const cleanAppend = function (home, ptr, needle, document) {
  const [n, , end] = ptr;
  const total = (document[n] || []).length;
  if (end < total) {
    // are we in the middle?
    // add trailing space on self
    movePunct(home, end, needle);
    endSpace(needle);
  } else if (total === end) {
    // are we at the end?
    // add a space to predecessor
    endSpace(home);
    // very end, move period
    movePunct(home, end, needle);
    // is there another sentence after?
    if (document[n + 1]) {
      needle[needle.length - 1].post += ' ';
    }
  }
  spliceArr(home, ptr[2], needle);
  // set new endId
  ptr[4] = needle[needle.length - 1].id;
};

/*
unique & ordered term ids, based on time & term index

Base 36 (numbers+ascii)
  3 digit 4,600
  2 digit 1,200
  1 digit 36

  TTT|NNN|II|R

TTT -> 46 terms since load
NNN -> 46 thousand sentences (>1 inf-jest)
II  -> 1,200 words in a sentence (nuts)
R   -> 1-36 random number 

novels: 
  avg 80,000 words
    15 words per sentence
  5,000 sentences

Infinite Jest:
  36,247 sentences
  https://en.wikipedia.org/wiki/List_of_longest_novels

collisions are more-likely after
    46 seconds have passed,
  and 
    after 46-thousand sentences

*/
let index$1 = 0;

const pad3 = (str) => {
  str = str.length < 3 ? '0' + str : str;
  return str.length < 3 ? '0' + str : str
};

const toId = function (term) {
  let [n, i] = term.index || [0, 0];
  index$1 += 1;

  //don't overflow index
  index$1 = index$1 > 46655 ? 0 : index$1;
  //don't overflow sentences
  n = n > 46655 ? 0 : n;
  // //don't overflow terms
  i = i > 1294 ? 0 : i;

  // 3 digits for time
  let id = pad3(index$1.toString(36));
  // 3 digit  for sentence index (46k)
  id += pad3(n.toString(36));

  // 1 digit for term index (36)
  let tx = i.toString(36);
  tx = tx.length < 2 ? '0' + tx : tx; //pad2
  id += tx;

  // 1 digit random number
  const r = parseInt(Math.random() * 36, 10);
  id += (r).toString(36);

  return term.normal + '|' + id.toUpperCase()
};

// setInterval(() => console.log(toId(4, 12)), 100)

// are we inserting inside a contraction?
// expand it first
const expand$3 = function (m) {
  if (m.has('@hasContraction') && typeof m.contractions === 'function') {
    //&& m.after('^.').has('@hasContraction')
    const more = m.grow('@hasContraction');
    more.contractions().expand();
  }
};

const isArray$8 = arr => Object.prototype.toString.call(arr) === '[object Array]';

// set new ids for each terms
const addIds$2 = function (terms) {
  terms = terms.map(term => {
    term.id = toId(term);
    return term
  });
  return terms
};

const getTerms = function (input, world) {
  const { methods } = world;
  // create our terms from a string
  if (typeof input === 'string') {
    return methods.one.tokenize.fromString(input, world)[0] //assume one sentence
  }
  //allow a view object
  if (typeof input === 'object' && input.isView) {
    return input.clone().docs[0] || [] //assume one sentence
  }
  //allow an array of terms, too
  if (isArray$8(input)) {
    return isArray$8(input[0]) ? input[0] : input
  }
  return []
};

const insert = function (input, view, prepend) {
  const { document, world } = view;
  view.uncache();
  // insert words at end of each doc
  const ptrs = view.fullPointer;
  const selfPtrs = view.fullPointer;
  view.forEach((m, i) => {
    const ptr = m.fullPointer[0];
    const [n] = ptr;
    // add-in the words
    const home = document[n];
    let terms = getTerms(input, world);
    // are we inserting nothing?
    if (terms.length === 0) {
      return
    }
    terms = addIds$2(terms);
    if (prepend) {
      expand$3(view.update([ptr]).firstTerm());
      cleanPrepend(home, ptr, terms, document);
    } else {
      expand$3(view.update([ptr]).lastTerm());
      cleanAppend(home, ptr, terms, document);
    }
    // harden the pointer
    if (document[n] && document[n][ptr[1]]) {
      ptr[3] = document[n][ptr[1]].id;
    }
    // change self backwards by len
    selfPtrs[i] = ptr;
    // extend the pointer
    ptr[2] += terms.length;
    ptrs[i] = ptr;
  });
  const doc = view.toView(ptrs);
  // shift our self pointer, if necessary
  view.ptrs = selfPtrs;
  // try to tag them, too
  doc.compute(['id', 'index', 'freeze', 'lexicon']);
  if (doc.world.compute.preTagger) {
    doc.compute('preTagger');
  }
  doc.compute('unfreeze');
  return doc
};

const fns$4 = {
  insertAfter: function (input) {
    return insert(input, this, false)
  },
  insertBefore: function (input) {
    return insert(input, this, true)
  },
};
fns$4.append = fns$4.insertAfter;
fns$4.prepend = fns$4.insertBefore;
fns$4.insert = fns$4.insertAfter;

const dollarStub = /\$[0-9a-z]+/g;
const fns$3 = {};

// case logic
const isTitleCase$3 = (str) => /^\p{Lu}[\p{Ll}'’]/u.test(str) || /^\p{Lu}$/u.test(str);
const toTitleCase$1 = (str) => str.replace(/^\p{Ll}/u, x => x.toUpperCase());
const toLowerCase = (str) => str.replace(/^\p{Lu}/u, x => x.toLowerCase());

// doc.replace('foo', (m)=>{})
const replaceByFn = function (main, fn, keep) {
  main.forEach(m => {
    const out = fn(m);
    m.replaceWith(out, keep);
  });
  return main
};

// support 'foo $0' replacements
const subDollarSign = function (input, main) {
  if (typeof input !== 'string') {
    return input
  }
  const groups = main.groups();
  input = input.replace(dollarStub, a => {
    const num = a.replace(/\$/, '');
    if (groups.hasOwnProperty(num)) {
      return groups[num].text()
    }
    return a
  });
  return input
};

fns$3.replaceWith = function (input, keep = {}) {
  let ptrs = this.fullPointer;
  const main = this;
  this.uncache();
  if (typeof input === 'function') {
    return replaceByFn(main, input, keep)
  }
  const terms = main.docs[0];
  if (!terms) return main
  const isOriginalPossessive = keep.possessives && terms[terms.length - 1].tags.has('Possessive');
  const isOriginalTitleCase = keep.case && isTitleCase$3(terms[0].text);
  // support 'foo $0' replacements
  input = subDollarSign(input, main);

  const original = this.update(ptrs);
  // soften-up pointer
  ptrs = ptrs.map(ptr => ptr.slice(0, 3));
  // original.freeze()
  const oldTags = (original.docs[0] || []).map(term => Array.from(term.tags));
  const originalPre = original.docs[0][0].pre;
  const originalPost = original.docs[0][original.docs[0].length - 1].post;
  // slide this in
  if (typeof input === 'string') {
    input = this.fromText(input).compute('id');
  }
  main.insertAfter(input);
  // are we replacing part of a contraction?
  if (original.has('@hasContraction') && main.contractions) {
    const more = main.grow('@hasContraction+');
    more.contractions().expand();
  }
  // delete the original terms
  main.delete(original); //science.

  // keep "John's"
  if (isOriginalPossessive) {
    const tmp = main.docs[0];
    const term = tmp[tmp.length - 1];
    if (!term.tags.has('Possessive')) {
      term.text += "'s";
      term.normal += "'s";
      term.tags.add('Possessive');
    }
  }

  // try to keep some pre-punctuation
  if (originalPre && main.docs[0]) {
    main.docs[0][0].pre = originalPre;
  }
  // try to keep any post-punctuation
  if (originalPost && main.docs[0]) {
    const lastOne = main.docs[0][main.docs[0].length - 1];
    if (!lastOne.post.trim()) {
      lastOne.post = originalPost;
    }
  }

  // what should we return?
  const m = main.toView(ptrs).compute(['index', 'freeze', 'lexicon']);
  if (m.world.compute.preTagger) {
    m.compute('preTagger');
  }
  m.compute('unfreeze');
  // replace any old tags
  if (keep.tags) {
    m.terms().forEach((term, i) => {
      term.tagSafe(oldTags[i]);
    });
  }

  if (!m.docs[0] || !m.docs[0][0]) return m

  // try to co-erce case, too
  if (keep.case) {
    const transformCase = isOriginalTitleCase ? toTitleCase$1 : toLowerCase;
    m.docs[0][0].text = transformCase(m.docs[0][0].text);
  }

  // console.log(input.docs[0])
  // let regs = input.docs[0].map(t => {
  //   return { id: t.id, optional: true }
  // })
  // m.after('(a|hoy)').debug()
  // m.growRight('(a|hoy)').debug()
  // console.log(m)
  return m
};

fns$3.replace = function (match, input, keep) {
  if (match && !input) {
    return this.replaceWith(match, keep)
  }
  const m = this.match(match);
  if (!m.found) {
    return this
  }
  this.soften();
  return m.replaceWith(input, keep)
};

// transfer sentence-ending punctuation
const repairPunct = function (terms, len) {
  const last = terms.length - 1;
  const from = terms[last];
  const to = terms[last - len];
  if (to && from) {
    to.post += from.post; //this isn't perfect.
    to.post = to.post.replace(/ +([.?!,;:])/, '$1');
    // don't allow any silly punctuation outcomes like ',!'
    to.post = to.post.replace(/[,;:]+([.?!])/, '$1');
  }
};

// remove terms from document json
const pluckOut = function (document, nots) {
  nots.forEach(ptr => {
    const [n, start, end] = ptr;
    const len = end - start;
    if (!document[n]) {
      return // weird!
    }
    if (end === document[n].length && end > 1) {
      repairPunct(document[n], len);
    }
    document[n].splice(start, len); // replaces len terms at index start
  });
  // remove any now-empty sentences
  // (foreach + splice = 'mutable filter')
  for (let i = document.length - 1; i >= 0; i -= 1) {
    if (document[i].length === 0) {
      document.splice(i, 1);
      // remove any trailing whitespace before our removed sentence
      if (i === document.length && document[i - 1]) {
        const terms = document[i - 1];
        const lastTerm = terms[terms.length - 1];
        if (lastTerm) {
          lastTerm.post = lastTerm.post.trimEnd();
        }
      }
      // repair any downstream indexes
      // for (let k = i; k < document.length; k += 1) {
      //   document[k].forEach(term => term.index[0] -= 1)
      // }
    }
  }
  return document
};

const fixPointers$1 = function (ptrs, gonePtrs) {
  ptrs = ptrs.map(ptr => {
    const [n] = ptr;
    if (!gonePtrs[n]) {
      return ptr
    }
    gonePtrs[n].forEach(no => {
      const len = no[2] - no[1];
      // does it effect our pointer?
      if (ptr[1] <= no[1] && ptr[2] >= no[2]) {
        ptr[2] -= len;
      }
    });
    return ptr
  });

  // decrement any pointers after a now-empty pointer
  ptrs.forEach((ptr, i) => {
    // is the pointer now empty?
    if (ptr[1] === 0 && ptr[2] == 0) {
      // go down subsequent pointers
      for (let n = i + 1; n < ptrs.length; n += 1) {
        ptrs[n][0] -= 1;
        if (ptrs[n][0] < 0) {
          ptrs[n][0] = 0;
        }
      }
    }
  });
  // remove any now-empty pointers
  ptrs = ptrs.filter(ptr => ptr[2] - ptr[1] > 0);

  // remove old hard-pointers
  ptrs = ptrs.map((ptr) => {
    ptr[3] = null;
    ptr[4] = null;
    return ptr
  });
  return ptrs
};

const methods$k = {
  /** */
  remove: function (reg) {
    const { indexN } = this.methods.one.pointer;
    this.uncache();
    // two modes:
    //  - a. remove self, from full parent
    let self = this.all();
    let not = this;
    //  - b. remove a match, from self
    if (reg) {
      self = this;
      not = this.match(reg);
    }
    const isFull = !self.ptrs;
    // is it part of a contraction?
    if (not.has('@hasContraction') && not.contractions) {
      const more = not.grow('@hasContraction');
      more.contractions().expand();
    }

    let ptrs = self.fullPointer;
    const nots = not.fullPointer.reverse();
    // remove them from the actual document)
    const document = pluckOut(this.document, nots);
    // repair our pointers
    const gonePtrs = indexN(nots);
    ptrs = fixPointers$1(ptrs, gonePtrs);
    // clean up our original inputs
    self.ptrs = ptrs;
    self.document = document;
    self.compute('index');
    // if we started zoomed-out, try to end zoomed-out
    if (isFull) {
      self.ptrs = undefined;
    }
    if (!reg) {
      this.ptrs = [];
      return self.none()
    }
    const res = self.toView(ptrs); //return new document
    return res
  },
};

// aliases
methods$k.delete = methods$k.remove;

const methods$j = {
  /** add this punctuation or whitespace before each match: */
  pre: function (str, concat) {
    if (str === undefined && this.found) {
      return this.docs[0][0].pre
    }
    this.docs.forEach(terms => {
      const term = terms[0];
      if (concat === true) {
        term.pre += str;
      } else {
        term.pre = str;
      }
    });
    return this
  },

  /** add this punctuation or whitespace after each match: */
  post: function (str, concat) {
    if (str === undefined) {
      const last = this.docs[this.docs.length - 1];
      return last[last.length - 1].post
    }
    this.docs.forEach(terms => {
      const term = terms[terms.length - 1];
      if (concat === true) {
        term.post += str;
      } else {
        term.post = str;
      }
    });
    return this
  },

  /** remove whitespace from start/end */
  trim: function () {
    if (!this.found) {
      return this
    }
    const docs = this.docs;
    const start = docs[0][0];
    start.pre = start.pre.trimStart();
    const last = docs[docs.length - 1];
    const end = last[last.length - 1];
    end.post = end.post.trimEnd();
    return this
  },

  /** connect words with hyphen, and remove whitespace */
  hyphenate: function () {
    this.docs.forEach(terms => {
      //remove whitespace
      terms.forEach((t, i) => {
        if (i !== 0) {
          t.pre = '';
        }
        if (terms[i + 1]) {
          t.post = '-';
        }
      });
    });
    return this
  },

  /** remove hyphens between words, and set whitespace */
  dehyphenate: function () {
    const hasHyphen = /[-–—]/;
    this.docs.forEach(terms => {
      //remove whitespace
      terms.forEach(t => {
        if (hasHyphen.test(t.post)) {
          t.post = ' ';
        }
      });
    });
    return this
  },

  /** add quotations around these matches */
  toQuotations: function (start, end) {
    start = start || `"`;
    end = end || `"`;
    this.docs.forEach(terms => {
      terms[0].pre = start + terms[0].pre;
      const last = terms[terms.length - 1];
      last.post = end + last.post;
    });
    return this
  },

  /** add brackets around these matches */
  toParentheses: function (start, end) {
    start = start || `(`;
    end = end || `)`;
    this.docs.forEach(terms => {
      terms[0].pre = start + terms[0].pre;
      const last = terms[terms.length - 1];
      last.post = end + last.post;
    });
    return this
  },
};

// aliases
methods$j.deHyphenate = methods$j.dehyphenate;
methods$j.toQuotation = methods$j.toQuotations;

/** alphabetical order */
const alpha = (a, b) => {
  if (a.normal < b.normal) {
    return -1
  }
  if (a.normal > b.normal) {
    return 1
  }
  return 0
};

/** count the # of characters of each match */
const length = (a, b) => {
  const left = a.normal.trim().length;
  const right = b.normal.trim().length;
  if (left < right) {
    return 1
  }
  if (left > right) {
    return -1
  }
  return 0
};

/** count the # of terms in each match */
const wordCount$1 = (a, b) => {
  if (a.words < b.words) {
    return 1
  }
  if (a.words > b.words) {
    return -1
  }
  return 0
};

/** count the # of terms in each match */
const sequential = (a, b) => {
  if (a[0] < b[0]) {
    return 1
  }
  if (a[0] > b[0]) {
    return -1
  }
  return a[1] > b[1] ? 1 : -1
};

/** sort by # of duplicates in the document*/
const byFreq = function (arr) {
  const counts = {};
  arr.forEach(o => {
    counts[o.normal] = counts[o.normal] || 0;
    counts[o.normal] += 1;
  });
  // sort by freq
  arr.sort((a, b) => {
    const left = counts[a.normal];
    const right = counts[b.normal];
    if (left < right) {
      return 1
    }
    if (left > right) {
      return -1
    }
    return 0
  });
  return arr
};

var methods$i = { alpha, length, wordCount: wordCount$1, sequential, byFreq };

// aliases
const seqNames = new Set(['index', 'sequence', 'seq', 'sequential', 'chron', 'chronological']);
const freqNames = new Set(['freq', 'frequency', 'topk', 'repeats']);
const alphaNames = new Set(['alpha', 'alphabetical']);

// support function as parameter
const customSort = function (view, fn) {
  let ptrs = view.fullPointer;
  ptrs = ptrs.sort((a, b) => {
    a = view.update([a]);
    b = view.update([b]);
    return fn(a, b)
  });
  view.ptrs = ptrs; //mutate original
  return view
};

/** re-arrange the order of the matches (in place) */
const sort = function (input) {
  const { docs, pointer } = this;
  this.uncache();
  if (typeof input === 'function') {
    return customSort(this, input)
  }
  input = input || 'alpha';
  const ptrs = pointer || docs.map((_d, n) => [n]);
  let arr = docs.map((terms, n) => {
    return {
      index: n,
      words: terms.length,
      normal: terms.map(t => t.machine || t.normal || '').join(' '),
      pointer: ptrs[n],
    }
  });
  // 'chronological' sorting
  if (seqNames.has(input)) {
    input = 'sequential';
  }
  // alphabetical sorting
  if (alphaNames.has(input)) {
    input = 'alpha';
  }
  // sort by frequency
  if (freqNames.has(input)) {
    arr = methods$i.byFreq(arr);
    return this.update(arr.map(o => o.pointer))
  }
  // apply sort method on each phrase
  if (typeof methods$i[input] === 'function') {
    arr = arr.sort(methods$i[input]);
    return this.update(arr.map(o => o.pointer))
  }
  return this
};

/** reverse the order of the matches, but not the words or index */
const reverse$1 = function () {
  let ptrs = this.pointer || this.docs.map((_d, n) => [n]);
  ptrs = [].concat(ptrs);
  ptrs = ptrs.reverse();
  if (this._cache) {
    this._cache = this._cache.reverse();
  }
  return this.update(ptrs)
};

/** remove any duplicate matches */
const unique = function () {
  const already = new Set();
  const res = this.filter(m => {
    const txt = m.text('machine');
    if (already.has(txt)) {
      return false
    }
    already.add(txt);
    return true
  });
  // this.ptrs = res.ptrs //mutate original?
  return res//.compute('index')
};

var sort$1 = { unique, reverse: reverse$1, sort };

const isArray$7 = (arr) => Object.prototype.toString.call(arr) === '[object Array]';

// append a new document, somehow
const combineDocs = function (homeDocs, inputDocs) {
  if (homeDocs.length > 0) {
    // add a space
    const end = homeDocs[homeDocs.length - 1];
    const last = end[end.length - 1];
    if (/ /.test(last.post) === false) {
      last.post += ' ';
    }
  }
  homeDocs = homeDocs.concat(inputDocs);
  return homeDocs
};

const combineViews = function (home, input) {
  // is it a view from the same document?
  if (home.document === input.document) {
    const ptrs = home.fullPointer.concat(input.fullPointer);
    return home.toView(ptrs).compute('index')
  }
  // update n of new pointer, to end of our pointer
  const ptrs = input.fullPointer;
  ptrs.forEach(a => {
    a[0] += home.document.length;
  });
  home.document = combineDocs(home.document, input.docs);
  return home.all()
};

var concat = {
  // add string as new match/sentence
  concat: function (input) {
    // parse and splice-in new terms
    if (typeof input === 'string') {
      const more = this.fromText(input);
      // easy concat
      if (!this.found || !this.ptrs) {
        this.document = this.document.concat(more.document);
      } else {
        // if we are in the middle, this is actually a splice operation
        const ptrs = this.fullPointer;
        const at = ptrs[ptrs.length - 1][0];
        this.document.splice(at, 0, ...more.document);
      }
      // put the docs
      return this.all().compute('index')
    }
    // plop some view objects together
    if (typeof input === 'object' && input.isView) {
      return combineViews(this, input)
    }
    // assume it's an array of terms
    if (isArray$7(input)) {
      const docs = combineDocs(this.document, input);
      this.document = docs;
      return this.all()
    }
    return this
  },
};

// add indexes to pointers
const harden = function () {
  this.ptrs = this.fullPointer;
  return this
};
// remove indexes from pointers
const soften = function () {
  let ptr = this.ptrs;
  if (!ptr || ptr.length < 1) {
    return this
  }
  ptr = ptr.map(a => a.slice(0, 3));
  this.ptrs = ptr;
  return this
};
var harden$1 = { harden, soften };

const methods$h = Object.assign({}, caseFns, fns$4, fns$3, methods$k, methods$j, sort$1, concat, harden$1);

const addAPI$2 = function (View) {
  Object.assign(View.prototype, methods$h);
};

const compute$9 = {
  id: function (view) {
    const docs = view.docs;
    for (let n = 0; n < docs.length; n += 1) {
      for (let i = 0; i < docs[n].length; i += 1) {
        const term = docs[n][i];
        term.id = term.id || toId(term);
      }
    }
  }
};

var change = {
  api: addAPI$2,
  compute: compute$9,
};

var contractions$1 = [
  // simple mappings
  { word: '@', out: ['at'] },
  { word: 'arent', out: ['are', 'not'] },
  { word: 'alot', out: ['a', 'lot'] },
  { word: 'brb', out: ['be', 'right', 'back'] },
  { word: 'cannot', out: ['can', 'not'] },
  { word: 'dun', out: ['do', 'not'] },
  { word: "can't", out: ['can', 'not'] },
  { word: "shan't", out: ['should', 'not'] },
  { word: "won't", out: ['will', 'not'] },
  { word: "that's", out: ['that', 'is'] },
  { word: "what's", out: ['what', 'is'] },
  { word: "let's", out: ['let', 'us'] },
  // { word: "there's", out: ['there', 'is'] },
  { word: 'dunno', out: ['do', 'not', 'know'] },
  { word: 'gonna', out: ['going', 'to'] },
  { word: 'gotta', out: ['have', 'got', 'to'] }, //hmm
  { word: 'gimme', out: ['give', 'me'] },
  { word: 'outta', out: ['out', 'of'] },
  { word: 'tryna', out: ['trying', 'to'] },
  { word: 'gtg', out: ['got', 'to', 'go'] },
  { word: 'im', out: ['i', 'am'] },
  { word: 'imma', out: ['I', 'will'] },
  { word: 'imo', out: ['in', 'my', 'opinion'] },
  { word: 'irl', out: ['in', 'real', 'life'] },
  { word: 'ive', out: ['i', 'have'] },
  { word: 'rn', out: ['right', 'now'] },
  { word: 'tbh', out: ['to', 'be', 'honest'] },
  { word: 'wanna', out: ['want', 'to'] },
  { word: `c'mere`, out: ['come', 'here'] },
  { word: `c'mon`, out: ['come', 'on'] },
  // shoulda, coulda
  { word: 'shoulda', out: ['should', 'have'] },
  { word: 'coulda', out: ['coulda', 'have'] },
  { word: 'woulda', out: ['woulda', 'have'] },
  { word: 'musta', out: ['must', 'have'] },

  { word: "tis", out: ['it', 'is'] },
  { word: "twas", out: ['it', 'was'] },
  { word: `y'know`, out: ['you', 'know'] },
  { word: "ne'er", out: ['never'] },
  { word: "o'er", out: ['over'] },
  // contraction-part mappings
  { after: 'll', out: ['will'] },
  { after: 've', out: ['have'] },
  { after: 're', out: ['are'] },
  { after: 'm', out: ['am'] },
  // french contractions
  { before: 'c', out: ['ce'] },
  { before: 'm', out: ['me'] },
  { before: 'n', out: ['ne'] },
  { before: 'qu', out: ['que'] },
  { before: 's', out: ['se'] },
  { before: 't', out: ['tu'] }, // t'aime

  // missing apostrophes
  { word: 'shouldnt', out: ['should', 'not'] },
  { word: 'couldnt', out: ['could', 'not'] },
  { word: 'wouldnt', out: ['would', 'not'] },
  { word: 'hasnt', out: ['has', 'not'] },
  { word: 'wasnt', out: ['was', 'not'] },
  { word: 'isnt', out: ['is', 'not'] },
  { word: 'cant', out: ['can', 'not'] },
  { word: 'dont', out: ['do', 'not'] },
  { word: 'wont', out: ['will', 'not'] },
  // apostrophe d
  { word: 'howd', out: ['how', 'did'] },
  { word: 'whatd', out: ['what', 'did'] },
  { word: 'whend', out: ['when', 'did'] },
  { word: 'whered', out: ['where', 'did'] },
];

// number suffixes that are not units
const t$1 = true;
var numberSuffixes = {
  'st': t$1,
  'nd': t$1,
  'rd': t$1,
  'th': t$1,
  'am': t$1,
  'pm': t$1,
  'max': t$1,
  '°': t$1,
  's': t$1, // 1990s
  'e': t$1, // 18e - french/spanish ordinal
  'er': t$1, //french 1er
  'ère': t$1, //''
  'ème': t$1, //french 2ème
};

var model$5 = {
  one: {
    contractions: contractions$1,
    numberSuffixes
  }
};

// put n new words where 1 word was
const insertContraction$1 = function (document, point, words) {
  const [n, w] = point;
  if (!words || words.length === 0) {
    return
  }
  words = words.map((word, i) => {
    word.implicit = word.text;
    word.machine = word.text;
    word.pre = '';
    word.post = '';
    word.text = '';
    word.normal = '';
    word.index = [n, w + i];
    return word
  });
  if (words[0]) {
    // move whitespace over
    words[0].pre = document[n][w].pre;
    words[words.length - 1].post = document[n][w].post;
    // add the text/normal to the first term
    words[0].text = document[n][w].text;
    words[0].normal = document[n][w].normal; // move tags too?
  }
  // do the splice
  document[n].splice(w, 1, ...words);
};

const hasContraction$3 = /'/;
//look for a past-tense verb
// const hasPastTense = (terms, i) => {
//   let after = terms.slice(i + 1, i + 3)
//   return after.some(t => t.tags.has('PastTense'))
// }
// he'd walked -> had
// how'd -> did
// he'd go -> would

const alwaysDid = new Set([
  'what',
  'how',
  'when',
  'where',
  'why',
]);

// after-words
const useWould = new Set([
  'be',
  'go',
  'start',
  'think',
  'need',
]);

const useHad = new Set([
  'been',
  'gone'
]);
// they'd gone
// they'd go


// he'd been
//    he had been
//    he would been

const _apostropheD$1 = function (terms, i) {
  const before = terms[i].normal.split(hasContraction$3)[0];

  // what'd, how'd
  if (alwaysDid.has(before)) {
    return [before, 'did']
  }
  if (terms[i + 1]) {
    // they'd gone
    if (useHad.has(terms[i + 1].normal)) {
      return [before, 'had']
    }
    // they'd go
    if (useWould.has(terms[i + 1].normal)) {
      return [before, 'would']
    }
  }
  return null
  //   if (hasPastTense(terms, i) === true) {
  //     return [before, 'had']
  //   }
  //   // had/would/did
  //   return [before, 'would']
};

//ain't -> are/is not
const apostropheT$1 = function (terms, i) {
  if (terms[i].normal === "ain't" || terms[i].normal === 'aint') {
    return null //do this in ./two/
  }
  const before = terms[i].normal.replace(/n't/, '');
  return [before, 'not']
};

const hasContraction$2 = /'/;
const isFeminine = /(e|é|aison|sion|tion)$/;
const isMasculine = /(age|isme|acle|ege|oire)$/;
// l'amour
const preL = (terms, i) => {
  // le/la
  const after = terms[i].normal.split(hasContraction$2)[1];
  // quick french gender disambig (rough)
  if (after && after.endsWith('e')) {
    return ['la', after]
  }
  return ['le', after]
};

// d'amerique
const preD = (terms, i) => {
  const after = terms[i].normal.split(hasContraction$2)[1];
  // quick guess for noun-agreement (rough)
  if (after && isFeminine.test(after) && !isMasculine.test(after)) {
    return ['du', after]
  } else if (after && after.endsWith('s')) {
    return ['des', after]
  }
  return ['de', after]
};

// j'aime
const preJ = (terms, i) => {
  const after = terms[i].normal.split(hasContraction$2)[1];
  return ['je', after]
};

var french = {
  preJ,
  preL,
  preD,
};

const isRange = /^([0-9.]{1,4}[a-z]{0,2}) ?[-–—] ?([0-9]{1,4}[a-z]{0,2})$/i;
const timeRange = /^([0-9]{1,2}(:[0-9][0-9])?(am|pm)?) ?[-–—] ?([0-9]{1,2}(:[0-9][0-9])?(am|pm)?)$/i;
const phoneNum = /^[0-9]{3}-[0-9]{4}$/;

const numberRange = function (terms, i) {
  const term = terms[i];
  let parts = term.text.match(isRange);
  if (parts !== null) {
    // 123-1234 is a phone number, not a number-range
    if (term.tags.has('PhoneNumber') === true || phoneNum.test(term.text)) {
      return null
    }
    return [parts[1], 'to', parts[2]]
  } else {
    parts = term.text.match(timeRange);
    if (parts !== null) {
      return [parts[1], 'to', parts[4]]
    }
  }
  return null
};

const numUnit = /^([+-]?[0-9][.,0-9]*)([a-z°²³µ/]+)$/; //(must be lowercase)

const numberUnit = function (terms, i, world) {
  const notUnit = world.model.one.numberSuffixes || {};
  const term = terms[i];
  const parts = term.text.match(numUnit);
  if (parts !== null) {
    // is it a recognized unit, like 'km'?
    const unit = parts[2].toLowerCase().trim();
    // don't split '3rd'
    if (notUnit.hasOwnProperty(unit)) {
      return null
    }
    return [parts[1], unit] //split it
  }
  return null
};

const byApostrophe$1 = /'/;
const numDash = /^[0-9][^-–—]*[-–—].*?[0-9]/;

// run tagger on our new implicit terms
const reTag$1 = function (terms, view, start, len) {
  const tmp = view.update();
  tmp.document = [terms];
  // offer to re-tag neighbours, too
  let end = start + len;
  if (start > 0) {
    start -= 1;
  }
  if (terms[end]) {
    end += 1;
  }
  tmp.ptrs = [[0, start, end]];
};

const byEnd$1 = {
  // ain't
  t: (terms, i) => apostropheT$1(terms, i),
  // how'd
  d: (terms, i) => _apostropheD$1(terms, i),
};

const byStart = {
  // j'aime
  j: (terms, i) => french.preJ(terms, i),
  // l'amour
  l: (terms, i) => french.preL(terms, i),
  // d'amerique
  d: (terms, i) => french.preD(terms, i),
};

// pull-apart known contractions from model
const knownOnes = function (list, term, before, after) {
  for (let i = 0; i < list.length; i += 1) {
    const o = list[i];
    // look for word-word match (cannot-> [can, not])
    if (o.word === term.normal) {
      return o.out
    }
    // look for after-match ('re -> [_, are])
    else if (after !== null && after === o.after) {
      return [before].concat(o.out)
    }
    // look for before-match (l' -> [le, _])
    else if (before !== null && before === o.before && after && after.length > 2) {
      return o.out.concat(after)
      // return [o.out, after] //typeof o.out === 'string' ? [o.out, after] : o.out(terms, i)
    }
  }
  return null
};

const toDocs$1 = function (words, view) {
  const doc = view.fromText(words.join(' '));
  doc.compute(['id', 'alias']);
  return doc.docs[0]
};

// there's is usually [there, is]
// but can be 'there has' for 'there has (..) been'
const thereHas = function (terms, i) {
  for (let k = i + 1; k < 5; k += 1) {
    if (!terms[k]) {
      break
    }
    if (terms[k].normal === 'been') {
      return ['there', 'has']
    }
  }
  return ['there', 'is']
};

//really easy ones
const contractions = view => {
  const { world, document } = view;
  const { model, methods } = world;
  const list = model.one.contractions || [];
  // let units = new Set(model.one.units || [])
  // each sentence
  document.forEach((terms, n) => {
    // loop through terms backwards
    for (let i = terms.length - 1; i >= 0; i -= 1) {
      let before = null;
      let after = null;
      if (byApostrophe$1.test(terms[i].normal) === true) {
        const res = terms[i].normal.split(byApostrophe$1);
        before = res[0];
        after = res[1];
      }
      // any known-ones, like 'dunno'?
      let words = knownOnes(list, terms[i], before, after);
      // ['foo', 's']
      if (!words && byEnd$1.hasOwnProperty(after)) {
        words = byEnd$1[after](terms, i, world);
      }
      // ['j', 'aime']
      if (!words && byStart.hasOwnProperty(before)) {
        words = byStart[before](terms, i);
      }
      // 'there is' vs 'there has'
      if (before === 'there' && after === 's') {
        words = thereHas(terms, i);
      }
      // actually insert the new terms
      if (words) {
        words = toDocs$1(words, view);
        insertContraction$1(document, [n, i], words);
        reTag$1(document[n], view, i, words.length);
        continue
      }
      // '44-2' has special care
      if (numDash.test(terms[i].normal)) {
        words = numberRange(terms, i);
        if (words) {
          words = toDocs$1(words, view);
          insertContraction$1(document, [n, i], words);
          methods.one.setTag(words, 'NumberRange', world); //add custom tag
          // is it a time-range, like '5-9pm'
          if (words[2] && words[2].tags.has('Time')) {
            methods.one.setTag([words[0]], 'Time', world, null, 'time-range');
          }
          reTag$1(document[n], view, i, words.length);
        }
        continue
      }
      // split-apart '4km'
      words = numberUnit(terms, i, world);
      if (words) {
        words = toDocs$1(words, view);
        insertContraction$1(document, [n, i], words);
        methods.one.setTag([words[1]], 'Unit', world, null, 'contraction-unit');
      }
    }
  });
};

var compute$8 = { contractions };

const plugin$4 = {
  model: model$5,
  compute: compute$8,
  hooks: ['contractions'],
};

const freeze$1 = function (view) {
  const world = view.world;
  const { model, methods } = view.world;
  const setTag = methods.one.setTag;
  const { frozenLex } = model.one;
  const multi = model.one._multiCache || {};

  view.docs.forEach(terms => {
    for (let i = 0; i < terms.length; i += 1) {
      // basic lexicon lookup
      const t = terms[i];
      const word = t.machine || t.normal;

      // test a multi-word
      if (multi[word] !== undefined && terms[i + 1]) {
        const end = i + multi[word] - 1;
        for (let k = end; k > i; k -= 1) {
          const words = terms.slice(i, k + 1);
          const str = words.map(term => term.machine || term.normal).join(' ');
          // lookup frozen lexicon
          if (frozenLex.hasOwnProperty(str) === true) {
            setTag(words, frozenLex[str], world, false, '1-frozen-multi-lexicon');
            words.forEach(term => (term.frozen = true));
            continue
          }
        }
      }
      // test single word
      if (frozenLex[word] !== undefined && frozenLex.hasOwnProperty(word)) {
        setTag([t], frozenLex[word], world, false, '1-freeze-lexicon');
        t.frozen = true;
        continue
      }
    }
  });
};

const unfreeze = function (view) {
  view.docs.forEach(ts => {
    ts.forEach(term => {
      delete term.frozen;
    });
  });
  return view
};
var compute$7 = { frozen: freeze$1, freeze: freeze$1, unfreeze };

/* eslint-disable no-console */
const blue = str => '\x1b[34m' + str + '\x1b[0m';
const dim = str => '\x1b[3m\x1b[2m' + str + '\x1b[0m';

const debug$2 = function (view) {
  view.docs.forEach(terms => {
    console.log(blue('\n  ┌─────────'));
    terms.forEach(t => {
      let str = `  ${dim('│')}  `;
      const txt = t.implicit || t.text || '-';
      if (t.frozen === true) {
        str += `${blue(txt)} ❄️`;
      } else {
        str += dim(txt);
      }
      console.log(str);
    });
  });
};

var freeze = {
  // add .compute('freeze')
  compute: compute$7,

  mutate: world => {
    const methods = world.methods.one;
    // add @isFrozen method
    methods.termMethods.isFrozen = term => term.frozen === true;
    // adds `.debug('frozen')`
    methods.debug.freeze = debug$2;
    methods.debug.frozen = debug$2;
  },

  api: function (View) {
    // set all terms to reject any desctructive tags
    View.prototype.freeze = function () {
      this.docs.forEach(ts => {
        ts.forEach(term => {
          term.frozen = true;
        });
      });
      return this
    };
    // reset all terms to allow  any desctructive tags
    View.prototype.unfreeze = function () {
      this.compute('unfreeze');
    };
    // return all frozen terms
    View.prototype.isFrozen = function () {
      return this.match('@isFrozen+')
    };
  },
  // run it in init
  hooks: ['freeze'],
};

// scan-ahead to match multiple-word terms - 'jack rabbit'
const multiWord = function (terms, start_i, world) {
  const { model, methods } = world;
  const setTag = methods.one.setTag;
  const multi = model.one._multiCache || {};
  const { lexicon } = model.one || {};
  const t = terms[start_i];
  const word = t.machine || t.normal;

  // found a word to scan-ahead on
  if (multi[word] !== undefined && terms[start_i + 1]) {
    const end = start_i + multi[word] - 1;
    for (let i = end; i > start_i; i -= 1) {
      const words = terms.slice(start_i, i + 1);
      if (words.length <= 1) {
        return false
      }
      const str = words.map(term => term.machine || term.normal).join(' ');
      // lookup regular lexicon
      if (lexicon.hasOwnProperty(str) === true) {
        const tag = lexicon[str];
        setTag(words, tag, world, false, '1-multi-lexicon');
        // special case for phrasal-verbs - 2nd word is a #Particle
        if (tag && tag.length === 2 && (tag[0] === 'PhrasalVerb' || tag[1] === 'PhrasalVerb')) {
          setTag([words[1]], 'Particle', world, false, '1-phrasal-particle');
        }
        return true
      }
    }
    return false
  }
  return null
};

const prefix$3 = /^(under|over|mis|re|un|dis|semi|pre|post)-?/;
// anti|non|extra|inter|intra|over
const allowPrefix = new Set(['Verb', 'Infinitive', 'PastTense', 'Gerund', 'PresentTense', 'Adjective', 'Participle']);

// tag any words in our lexicon
const checkLexicon = function (terms, i, world) {
  const { model, methods } = world;
  // const fastTag = methods.one.fastTag
  const setTag = methods.one.setTag;
  const { lexicon } = model.one;

  // basic lexicon lookup
  const t = terms[i];
  const word = t.machine || t.normal;
  // normal lexicon lookup
  if (lexicon[word] !== undefined && lexicon.hasOwnProperty(word)) {
    setTag([t], lexicon[word], world, false, '1-lexicon');
    return true
  }
  // lookup aliases in the lexicon
  if (t.alias) {
    const found = t.alias.find(str => lexicon.hasOwnProperty(str));
    if (found) {
      setTag([t], lexicon[found], world, false, '1-lexicon-alias');
      return true
    }
  }
  // prefixing for verbs/adjectives
  if (prefix$3.test(word) === true) {
    const stem = word.replace(prefix$3, '');
    if (lexicon.hasOwnProperty(stem) && stem.length > 3) {
      // only allow prefixes for verbs/adjectives
      if (allowPrefix.has(lexicon[stem])) {
        // console.log('->', word, stem, lexicon[stem])
        setTag([t], lexicon[stem], world, false, '1-lexicon-prefix');
        return true
      }
    }
  }
  return null
};

// tag any words in our lexicon - even if it hasn't been filled-up yet
// rest of pre-tagger is in ./two/preTagger
const lexicon$3 = function (view) {
  const world = view.world;
  // loop through our terms
  view.docs.forEach(terms => {
    for (let i = 0; i < terms.length; i += 1) {
      if (terms[i].tags.size === 0) {
        let found = null;
        found = found || multiWord(terms, i, world);
        // lookup known words
        found = found || checkLexicon(terms, i, world);
      }
    }
  });
};

var compute$6 = {
  lexicon: lexicon$3,
};

// derive clever things from our lexicon key-value pairs
const expand$2 = function (words) {
  // const { methods, model } = world
  const lex = {};
  // console.log('start:', Object.keys(lex).length)
  const _multi = {};
  // go through each word in this key-value obj:
  Object.keys(words).forEach(word => {
    const tag = words[word];
    // normalize lexicon a little bit
    word = word.toLowerCase().trim();
    word = word.replace(/'s\b/, '');
    // cache multi-word terms
    const split = word.split(/ /);
    if (split.length > 1) {
      // prefer longer ones
      if (_multi[split[0]] === undefined || split.length > _multi[split[0]]) {
        _multi[split[0]] = split.length;
      }
    }
    lex[word] = lex[word] || tag;
  });
  // cleanup
  delete lex[''];
  delete lex[null];
  delete lex[' '];
  return { lex, _multi }
};

var methods$g = {
  one: {
    expandLexicon: expand$2,
  }
};

/** insert new words/phrases into the lexicon */
const addWords = function (words, isFrozen = false) {
  const world = this.world();
  const { methods, model } = world;
  if (!words) {
    return
  }
  // normalize tag vals
  Object.keys(words).forEach(k => {
    if (typeof words[k] === 'string' && words[k].startsWith('#')) {
      words[k] = words[k].replace(/^#/, '');
    }
  });
  // these words go into a seperate lexicon
  if (isFrozen === true) {
    const { lex, _multi } = methods.one.expandLexicon(words, world);
    Object.assign(model.one._multiCache, _multi);
    Object.assign(model.one.frozenLex, lex);
    return
  }
  // add some words to our lexicon
  if (methods.two.expandLexicon) {
    // do fancy ./two version
    const { lex, _multi } = methods.two.expandLexicon(words, world);
    Object.assign(model.one.lexicon, lex);
    Object.assign(model.one._multiCache, _multi);
  }
  // do basic ./one version
  const { lex, _multi } = methods.one.expandLexicon(words, world);
  Object.assign(model.one.lexicon, lex);
  Object.assign(model.one._multiCache, _multi);
};

var lib$5 = { addWords };

const model$4 = {
  one: {
    lexicon: {}, //setup blank lexicon
    _multiCache: {},
    frozenLex: {}, //2nd lexicon
  },
};

var lexicon$2 = {
  model: model$4,
  methods: methods$g,
  compute: compute$6,
  lib: lib$5,
  hooks: ['lexicon'],
};

// edited by Spencer Kelly
// credit to https://github.com/BrunoRB/ahocorasick by Bruno Roberto Búrigo.

const tokenize$1 = function (phrase, world) {
  const { methods, model } = world;
  const terms = methods.one.tokenize.splitTerms(phrase, model).map(t => methods.one.tokenize.splitWhitespace(t, model));
  return terms.map(term => term.text.toLowerCase())
};

// turn an array or object into a compressed aho-corasick structure
const buildTrie = function (phrases, world) {

  // const tokenize=methods.one.
  const goNext = [{}];
  const endAs = [null];
  const failTo = [0];

  const xs = [];
  let n = 0;
  phrases.forEach(function (phrase) {
    let curr = 0;
    // let wordsB = phrase.split(/ /g).filter(w => w)
    const words = tokenize$1(phrase, world);
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (goNext[curr] && goNext[curr].hasOwnProperty(word)) {
        curr = goNext[curr][word];
      } else {
        n++;
        goNext[curr][word] = n;
        goNext[n] = {};
        curr = n;
        endAs[n] = null;
      }
    }
    endAs[curr] = [words.length];
  });
  // f(s) = 0 for all states of depth 1 (the ones from which the 0 state can transition to)
  for (const word in goNext[0]) {
    n = goNext[0][word];
    failTo[n] = 0;
    xs.push(n);
  }

  while (xs.length) {
    const r = xs.shift();
    // for each symbol a such that g(r, a) = s
    const keys = Object.keys(goNext[r]);
    for (let i = 0; i < keys.length; i += 1) {
      const word = keys[i];
      const s = goNext[r][word];
      xs.push(s);
      // set state = f(r)
      n = failTo[r];
      while (n > 0 && !goNext[n].hasOwnProperty(word)) {
        n = failTo[n];
      }
      if (goNext.hasOwnProperty(n)) {
        const fs = goNext[n][word];
        failTo[s] = fs;
        if (endAs[fs]) {
          endAs[s] = endAs[s] || [];
          endAs[s] = endAs[s].concat(endAs[fs]);
        }
      } else {
        failTo[s] = 0;
      }
    }
  }
  return { goNext, endAs, failTo }
};

// console.log(buildTrie(['smart and cool', 'smart and nice']))

// follow our trie structure
const scanWords = function (terms, trie, opts) {
  let n = 0;
  const results = [];
  for (let i = 0; i < terms.length; i++) {
    const word = terms[i][opts.form] || terms[i].normal;
    // main match-logic loop:
    while (n > 0 && (trie.goNext[n] === undefined || !trie.goNext[n].hasOwnProperty(word))) {
      n = trie.failTo[n] || 0; // (usually back to 0)
    }
    // did we fail?
    if (!trie.goNext[n].hasOwnProperty(word)) {
      continue
    }
    n = trie.goNext[n][word];
    if (trie.endAs[n]) {
      const arr = trie.endAs[n];
      for (let o = 0; o < arr.length; o++) {
        const len = arr[o];
        const term = terms[i - len + 1];
        const [no, start] = term.index;
        results.push([no, start, start + len, term.id]);
      }
    }
  }
  return results
};

const cacheMiss = function (words, cache) {
  for (let i = 0; i < words.length; i += 1) {
    if (cache.has(words[i]) === true) {
      return false
    }
  }
  return true
};

const scan = function (view, trie, opts) {
  let results = [];
  opts.form = opts.form || 'normal';
  const docs = view.docs;
  if (!trie.goNext || !trie.goNext[0]) {
    console.error('Compromise invalid lookup trie');//eslint-disable-line
    return view.none()
  }
  const firstWords = Object.keys(trie.goNext[0]);
  // do each phrase
  for (let i = 0; i < docs.length; i++) {
    // can we skip the phrase, all together?
    if (view._cache && view._cache[i] && cacheMiss(firstWords, view._cache[i]) === true) {
      continue
    }
    const terms = docs[i];
    const found = scanWords(terms, trie, opts);
    if (found.length > 0) {
      results = results.concat(found);
    }
  }
  return view.update(results)
};

const isObject$4 = val => {
  return Object.prototype.toString.call(val) === '[object Object]'
};

function api$m (View) {

  /** find all matches in this document */
  View.prototype.lookup = function (input, opts = {}) {
    if (!input) {
      return this.none()
    }
    if (typeof input === 'string') {
      input = [input];
    }
    const trie = isObject$4(input) ? input : buildTrie(input, this.world);
    let res = scan(this, trie, opts);
    res = res.settle();
    return res
  };
}

// chop-off tail of redundant vals at end of array
const truncate = (list, val) => {
  for (let i = list.length - 1; i >= 0; i -= 1) {
    if (list[i] !== val) {
      list = list.slice(0, i + 1);
      return list
    }
  }
  return list
};

// prune trie a bit
const compress = function (trie) {
  trie.goNext = trie.goNext.map(o => {
    if (Object.keys(o).length === 0) {
      return undefined
    }
    return o
  });
  // chop-off tail of undefined vals in goNext array
  trie.goNext = truncate(trie.goNext, undefined);
  // chop-off tail of zeros in failTo array
  trie.failTo = truncate(trie.failTo, 0);
  // chop-off tail of nulls in endAs array
  trie.endAs = truncate(trie.endAs, null);
  return trie
};

/** pre-compile a list of matches to lookup */
const lib$4 = {
  /** turn an array or object into a compressed trie*/
  buildTrie: function (input) {
    const trie = buildTrie(input, this.world());
    return compress(trie)
  }
};
// add alias
lib$4.compile = lib$4.buildTrie;

var lookup = {
  api: api$m,
  lib: lib$4
};

const relPointer = function (ptrs, parent) {
  if (!parent) {
    return ptrs
  }
  ptrs.forEach(ptr => {
    const n = ptr[0];
    if (parent[n]) {
      ptr[0] = parent[n][0]; //n
      ptr[1] += parent[n][1]; //start
      ptr[2] += parent[n][1]; //end
    }
  });
  return ptrs
};

// make match-result relative to whole document
const fixPointers = function (res, parent) {
  let { ptrs } = res;
  const { byGroup } = res;
  ptrs = relPointer(ptrs, parent);
  Object.keys(byGroup).forEach(k => {
    byGroup[k] = relPointer(byGroup[k], parent);
  });
  return { ptrs, byGroup }
};

// turn any matchable input intp a list of matches
const parseRegs = function (regs, opts, world) {
  const one = world.methods.one;
  if (typeof regs === 'number') {
    regs = String(regs);
  }
  // support param as string
  if (typeof regs === 'string') {
    regs = one.killUnicode(regs, world);
    regs = one.parseMatch(regs, opts, world);
  }
  return regs
};

const isObject$3 = val => {
  return Object.prototype.toString.call(val) === '[object Object]'
};

// did they pass-in a compromise object?
const isView = val => val && isObject$3(val) && val.isView === true;

const isNet = val => val && isObject$3(val) && val.isNet === true;

const match$1 = function (regs, group, opts) {
  const one = this.methods.one;
  // support param as view object
  if (isView(regs)) {
    return this.intersection(regs)
  }
  // support a compiled set of matches
  if (isNet(regs)) {
    return this.sweep(regs, { tagger: false }).view.settle()
  }
  regs = parseRegs(regs, opts, this.world);
  const todo = { regs, group };
  const res = one.match(this.docs, todo, this._cache);
  const { ptrs, byGroup } = fixPointers(res, this.fullPointer);
  const view = this.toView(ptrs);
  view._groups = byGroup;
  return view
};

const matchOne = function (regs, group, opts) {
  const one = this.methods.one;
  // support at view as a param
  if (isView(regs)) {
    return this.intersection(regs).eq(0)
  }
  // support a compiled set of matches
  if (isNet(regs)) {
    return this.sweep(regs, { tagger: false, matchOne: true }).view
  }
  regs = parseRegs(regs, opts, this.world);
  const todo = { regs, group, justOne: true };
  const res = one.match(this.docs, todo, this._cache);
  const { ptrs, byGroup } = fixPointers(res, this.fullPointer);
  const view = this.toView(ptrs);
  view._groups = byGroup;
  return view
};

const has = function (regs, group, opts) {
  const one = this.methods.one;
  // support view as input
  if (isView(regs)) {
    const ptrs = this.intersection(regs).fullPointer;
    return ptrs.length > 0
  }
  // support a compiled set of matches
  if (isNet(regs)) {
    return this.sweep(regs, { tagger: false }).view.found
  }
  regs = parseRegs(regs, opts, this.world);
  const todo = { regs, group, justOne: true };
  const ptrs = one.match(this.docs, todo, this._cache).ptrs;
  return ptrs.length > 0
};

// 'if'
const ifFn = function (regs, group, opts) {
  const one = this.methods.one;
  // support view as input
  if (isView(regs)) {
    return this.filter(m => m.intersection(regs).found)
  }
  // support a compiled set of matches
  if (isNet(regs)) {
    const m = this.sweep(regs, { tagger: false }).view.settle();
    return this.if(m) //recurse with result
  }
  regs = parseRegs(regs, opts, this.world);
  const todo = { regs, group, justOne: true };
  let ptrs = this.fullPointer;
  const cache = this._cache || [];
  ptrs = ptrs.filter((ptr, i) => {
    const m = this.update([ptr]);
    const res = one.match(m.docs, todo, cache[i]).ptrs;
    return res.length > 0
  });
  const view = this.update(ptrs);
  // try and reconstruct the cache
  if (this._cache) {
    view._cache = ptrs.map(ptr => cache[ptr[0]]);
  }
  return view
};

const ifNo = function (regs, group, opts) {
  const { methods } = this;
  const one = methods.one;
  // support a view object as input
  if (isView(regs)) {
    return this.filter(m => !m.intersection(regs).found)
  }
  // support a compiled set of matches
  if (isNet(regs)) {
    const m = this.sweep(regs, { tagger: false }).view.settle();
    return this.ifNo(m)
  }
  // otherwise parse the match string
  regs = parseRegs(regs, opts, this.world);
  const cache = this._cache || [];
  const view = this.filter((m, i) => {
    const todo = { regs, group, justOne: true };
    const ptrs = one.match(m.docs, todo, cache[i]).ptrs;
    return ptrs.length === 0
  });
  // try to reconstruct the cache
  if (this._cache) {
    view._cache = view.ptrs.map(ptr => cache[ptr[0]]);
  }
  return view
};

var match$2 = { matchOne, match: match$1, has, if: ifFn, ifNo };

const before = function (regs, group, opts) {
  const { indexN } = this.methods.one.pointer;
  const pre = [];
  const byN = indexN(this.fullPointer);
  Object.keys(byN).forEach(k => {
    // check only the earliest match in the sentence
    const first = byN[k].sort((a, b) => (a[1] > b[1] ? 1 : -1))[0];
    if (first[1] > 0) {
      pre.push([first[0], 0, first[1]]);
    }
  });
  const preWords = this.toView(pre);
  if (!regs) {
    return preWords
  }
  return preWords.match(regs, group, opts)
};

const after = function (regs, group, opts) {
  const { indexN } = this.methods.one.pointer;
  const post = [];
  const byN = indexN(this.fullPointer);
  const document = this.document;
  Object.keys(byN).forEach(k => {
    // check only the latest match in the sentence
    const last = byN[k].sort((a, b) => (a[1] > b[1] ? -1 : 1))[0];
    const [n, , end] = last;
    if (end < document[n].length) {
      post.push([n, end, document[n].length]);
    }
  });
  const postWords = this.toView(post);
  if (!regs) {
    return postWords
  }
  return postWords.match(regs, group, opts)
};

const growLeft = function (regs, group, opts) {
  if (typeof regs === 'string') {
    regs = this.world.methods.one.parseMatch(regs, opts, this.world);
  }
  regs[regs.length - 1].end = true; // ensure matches are beside us ←
  const ptrs = this.fullPointer;
  this.forEach((m, n) => {
    const more = m.before(regs, group);
    if (more.found) {
      const terms = more.terms();
      ptrs[n][1] -= terms.length;
      ptrs[n][3] = terms.docs[0][0].id;
    }
  });
  return this.update(ptrs)
};

const growRight = function (regs, group, opts) {
  if (typeof regs === 'string') {
    regs = this.world.methods.one.parseMatch(regs, opts, this.world);
  }
  regs[0].start = true; // ensure matches are beside us →
  const ptrs = this.fullPointer;
  this.forEach((m, n) => {
    const more = m.after(regs, group);
    if (more.found) {
      const terms = more.terms();
      ptrs[n][2] += terms.length;
      ptrs[n][4] = null; //remove end-id
    }
  });
  return this.update(ptrs)
};

const grow = function (regs, group, opts) {
  return this.growRight(regs, group, opts).growLeft(regs, group, opts)
};

var lookaround = { before, after, growLeft, growRight, grow };

const combine = function (left, right) {
  return [left[0], left[1], right[2]]
};

const isArray$6 = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
};

const getDoc$2 = (reg, view, group) => {
  if (typeof reg === 'string' || isArray$6(reg)) {
    return view.match(reg, group)
  }
  if (!reg) {
    return view.none()
  }
  return reg
};

const addIds$1 = function (ptr, view) {
  const [n, start, end] = ptr;
  if (view.document[n] && view.document[n][start]) {
    ptr[3] = ptr[3] || view.document[n][start].id;
    if (view.document[n][end - 1]) {
      ptr[4] = ptr[4] || view.document[n][end - 1].id;
    }
  }
  return ptr
};

const methods$f = {};
// [before], [match], [after]
methods$f.splitOn = function (m, group) {
  const { splitAll } = this.methods.one.pointer;
  const splits = getDoc$2(m, this, group).fullPointer;
  const all = splitAll(this.fullPointer, splits);
  let res = [];
  all.forEach(o => {
    res.push(o.passthrough);
    res.push(o.before);
    res.push(o.match);
    res.push(o.after);
  });
  res = res.filter(p => p);
  res = res.map(p => addIds$1(p, this));
  return this.update(res)
};

// [before], [match after]
methods$f.splitBefore = function (m, group) {
  const { splitAll } = this.methods.one.pointer;
  const splits = getDoc$2(m, this, group).fullPointer;
  const all = splitAll(this.fullPointer, splits);
  // repair matches to favor [match, after]
  // - instead of [before, match]
  for (let i = 0; i < all.length; i += 1) {
    // move a before to a preceding after
    if (!all[i].after && all[i + 1] && all[i + 1].before) {
      // ensure it's from the same original sentence
      if (all[i].match && all[i].match[0] === all[i + 1].before[0]) {
        all[i].after = all[i + 1].before;
        delete all[i + 1].before;
      }
    }
  }

  let res = [];
  all.forEach(o => {
    res.push(o.passthrough);
    res.push(o.before);
    // a, [x, b]
    if (o.match && o.after) {
      res.push(combine(o.match, o.after));
    } else {
      // a, [x], b
      res.push(o.match);
    }
  });
  res = res.filter(p => p);
  res = res.map(p => addIds$1(p, this));
  return this.update(res)
};

// [before match], [after]
methods$f.splitAfter = function (m, group) {
  const { splitAll } = this.methods.one.pointer;
  const splits = getDoc$2(m, this, group).fullPointer;
  const all = splitAll(this.fullPointer, splits);
  let res = [];
  all.forEach(o => {
    res.push(o.passthrough);
    if (o.before && o.match) {
      res.push(combine(o.before, o.match));
    } else {
      res.push(o.before);
      res.push(o.match);
    }
    res.push(o.after);
  });
  res = res.filter(p => p);
  res = res.map(p => addIds$1(p, this));
  return this.update(res)
};
methods$f.split = methods$f.splitAfter;

// check if two pointers are perfectly consecutive
const isNeighbour = function (ptrL, ptrR) {
  // validate
  if (!ptrL || !ptrR) {
    return false
  }
  // same sentence
  if (ptrL[0] !== ptrR[0]) {
    return false
  }
  // ensure R starts where L ends
  return ptrL[2] === ptrR[1]
};

// join two neighbouring words, if they both match
const mergeIf = function (doc, lMatch, rMatch) {
  const world = doc.world;
  const parseMatch = world.methods.one.parseMatch;
  lMatch = lMatch || '.$'; //defaults
  rMatch = rMatch || '^.';
  const leftMatch = parseMatch(lMatch, {}, world);
  const rightMatch = parseMatch(rMatch, {}, world);
  // ensure end-requirement to left-match, start-requiremnts to right match
  leftMatch[leftMatch.length - 1].end = true;
  rightMatch[0].start = true;
  // let's get going.
  const ptrs = doc.fullPointer;
  const res = [ptrs[0]];
  for (let i = 1; i < ptrs.length; i += 1) {
    const ptrL = res[res.length - 1];
    const ptrR = ptrs[i];
    const left = doc.update([ptrL]);
    const right = doc.update([ptrR]);
    // should we marge left+right?
    if (isNeighbour(ptrL, ptrR) && left.has(leftMatch) && right.has(rightMatch)) {
      // merge right ptr into existing result
      res[res.length - 1] = [ptrL[0], ptrL[1], ptrR[2], ptrL[3], ptrR[4]];
    } else {
      res.push(ptrR);
    }
  }
  // return new pointers
  return doc.update(res)
};

const methods$e = {
  //  merge only if conditions are met
  joinIf: function (lMatch, rMatch) {
    return mergeIf(this, lMatch, rMatch)
  },
  // merge all neighbouring matches
  join: function () {
    return mergeIf(this)
  },
};

const methods$d = Object.assign({}, match$2, lookaround, methods$f, methods$e);
// aliases
methods$d.lookBehind = methods$d.before;
methods$d.lookBefore = methods$d.before;

methods$d.lookAhead = methods$d.after;
methods$d.lookAfter = methods$d.after;

methods$d.notIf = methods$d.ifNo;
const matchAPI = function (View) {
  Object.assign(View.prototype, methods$d);
};

// match  'foo /yes/' and not 'foo/no/bar'
const bySlashes = /(?:^|\s)([![^]*(?:<[^<]*>)?\/.*?[^\\/]\/[?\]+*$~]*)(?:\s|$)/;
// match '(yes) but not foo(no)bar'
const byParentheses = /([!~[^]*(?:<[^<]*>)?\([^)]+[^\\)]\)[?\]+*$~]*)(?:\s|$)/;
// okay
const byWord$1 = / /g;

const isBlock = str => {
  return /^[![^]*(<[^<]*>)?\(/.test(str) && /\)[?\]+*$~]*$/.test(str)
};
const isReg = str => {
  return /^[![^]*(<[^<]*>)?\//.test(str) && /\/[?\]+*$~]*$/.test(str)
};

const cleanUp$2 = function (arr) {
  arr = arr.map(str => str.trim());
  arr = arr.filter(str => str);
  return arr
};

const parseBlocks = function (txt) {
  // parse by /regex/ first
  const arr = txt.split(bySlashes);
  let res = [];
  // parse by (blocks), next
  arr.forEach(str => {
    if (isReg(str)) {
      res.push(str);
      return
    }
    res = res.concat(str.split(byParentheses));
  });
  res = cleanUp$2(res);
  // split by spaces, now
  let final = [];
  res.forEach(str => {
    if (isBlock(str)) {
      final.push(str);
    } else if (isReg(str)) {
      final.push(str);
    } else {
      final = final.concat(str.split(byWord$1));
    }
  });
  final = cleanUp$2(final);
  return final
};

const hasMinMax = /\{([0-9]+)?(, *[0-9]*)?\}/;
const andSign = /&&/;
// const hasDash = /\p{Letter}[-–—]\p{Letter}/u
const captureName = new RegExp(/^<\s*(\S+)\s*>/);
/* break-down a match expression into this:
{
  word:'',
  tag:'',
  regex:'',

  start:false,
  end:false,
  negative:false,
  anything:false,
  greedy:false,
  optional:false,

  named:'',
  choices:[],
}
*/
const titleCase$2 = str => str.charAt(0).toUpperCase() + str.substring(1);
const end = (str) => str.charAt(str.length - 1);
const start = (str) => str.charAt(0);
const stripStart = (str) => str.substring(1);
const stripEnd = (str) => str.substring(0, str.length - 1);

const stripBoth = function (str) {
  str = stripStart(str);
  str = stripEnd(str);
  return str
};
//
const parseToken = function (w, opts) {
  const obj = {};
  //collect any flags (do it twice)
  for (let i = 0; i < 2; i += 1) {
    //end-flag
    if (end(w) === '$') {
      obj.end = true;
      w = stripEnd(w);
    }
    //front-flag
    if (start(w) === '^') {
      obj.start = true;
      w = stripStart(w);
    }
    if (end(w) === '?') {
      obj.optional = true;
      w = stripEnd(w);
    }
    //capture group (this one can span multiple-terms)
    if (start(w) === '[' || end(w) === ']') {
      obj.group = null;
      if (start(w) === '[') {
        obj.groupStart = true;
      }
      if (end(w) === ']') {
        obj.groupEnd = true;
      }
      w = w.replace(/^\[/, '');
      w = w.replace(/\]$/, '');
      // Use capture group name
      if (start(w) === '<') {
        const res = captureName.exec(w);
        if (res.length >= 2) {
          obj.group = res[1];
          w = w.replace(res[0], '');
        }
      }
    }
    //back-flags
    if (end(w) === '+') {
      obj.greedy = true;
      w = stripEnd(w);
    }
    if (w !== '*' && end(w) === '*' && w !== '\\*') {
      obj.greedy = true;
      w = stripEnd(w);
    }
    if (start(w) === '!') {
      obj.negative = true;
      // obj.optional = true
      w = stripStart(w);
    }
    //soft-match
    if (start(w) === '~' && end(w) === '~' && w.length > 2) {
      w = stripBoth(w);
      obj.fuzzy = true;
      obj.min = opts.fuzzy || 0.85;
      if (/\(/.test(w) === false) {
        obj.word = w;
        return obj
      }
    }

    //regex
    if (start(w) === '/' && end(w) === '/') {
      w = stripBoth(w);
      if (opts.caseSensitive) {
        obj.use = 'text';
      }
      obj.regex = new RegExp(w); //potential vuln - security/detect-non-literal-regexp
      return obj
    }

    // support foo{1,9}
    if (hasMinMax.test(w) === true) {
      w = w.replace(hasMinMax, (_a, b, c) => {
        if (c === undefined) {
          // '{3}'	Exactly three times
          obj.min = Number(b);
          obj.max = Number(b);
        } else {
          c = c.replace(/, */, '');
          if (b === undefined) {
            // '{,9}' implied zero min
            obj.min = 0;
            obj.max = Number(c);
          } else {
            // '{2,4}' Two to four times
            obj.min = Number(b);
            // '{3,}' Three or more times
            obj.max = Number(c || 999);
          }
        }
        // use same method as '+'
        obj.greedy = true;
        // 0 as min means the same as '?'
        if (!obj.min) {
          obj.optional = true;
        }
        return ''
      });
    }

    //wrapped-flags
    if (start(w) === '(' && end(w) === ')') {
      // support (one && two)
      if (andSign.test(w)) {
        obj.choices = w.split(andSign);
        obj.operator = 'and';
      } else {
        obj.choices = w.split('|');
        obj.operator = 'or';
      }
      //remove '(' and ')'
      obj.choices[0] = stripStart(obj.choices[0]);
      const last = obj.choices.length - 1;
      obj.choices[last] = stripEnd(obj.choices[last]);
      // clean up the results
      obj.choices = obj.choices.map(s => s.trim());
      obj.choices = obj.choices.filter(s => s);
      //recursion alert!
      obj.choices = obj.choices.map(str => {
        return str.split(/ /g).map(s => parseToken(s, opts))
      });
      w = '';
    }

    //root/sense overloaded
    if (start(w) === '{' && end(w) === '}') {
      w = stripBoth(w);
      // obj.sense = w
      obj.root = w;
      if (/\//.test(w)) {
        const split = obj.root.split(/\//);
        obj.root = split[0];
        obj.pos = split[1];
        if (obj.pos === 'adj') {
          obj.pos = 'Adjective';
        }
        // titlecase
        obj.pos = obj.pos.charAt(0).toUpperCase() + obj.pos.substr(1).toLowerCase();
        // add sense-number too
        if (split[2] !== undefined) {
          obj.sense = split[2];
        }
      }
      return obj
    }
    //chunks
    if (start(w) === '<' && end(w) === '>') {
      w = stripBoth(w);
      obj.chunk = titleCase$2(w);
      obj.greedy = true;
      return obj
    }
    if (start(w) === '%' && end(w) === '%') {
      w = stripBoth(w);
      obj.switch = w;
      return obj
    }
  }
  //do the actual token content
  if (start(w) === '#') {
    obj.tag = stripStart(w);
    obj.tag = titleCase$2(obj.tag);
    return obj
  }
  //dynamic function on a term object
  if (start(w) === '@') {
    obj.method = stripStart(w);
    return obj
  }
  if (w === '.') {
    obj.anything = true;
    return obj
  }
  //support alone-astrix
  if (w === '*') {
    obj.anything = true;
    obj.greedy = true;
    obj.optional = true;
    return obj
  }
  if (w) {
    //somehow handle encoded-chars?
    w = w.replace('\\*', '*');
    w = w.replace('\\.', '.');
    if (opts.caseSensitive) {
      obj.use = 'text';
    } else {
      w = w.toLowerCase();
    }
    obj.word = w;
  }
  return obj
};

const hasDash$2 = /[a-z0-9][-–—][a-z]/i;

// match 're-do' -> ['re','do']
const splitHyphens$1 = function (regs, world) {
  const prefixes = world.model.one.prefixes;
  for (let i = regs.length - 1; i >= 0; i -= 1) {
    const reg = regs[i];
    if (reg.word && hasDash$2.test(reg.word)) {
      let words = reg.word.split(/[-–—]/g);
      // don't split 're-cycle', etc
      if (prefixes.hasOwnProperty(words[0])) {
        continue
      }
      words = words.filter(w => w).reverse();
      regs.splice(i, 1);
      words.forEach(w => {
        const obj = Object.assign({}, reg);
        obj.word = w;
        regs.splice(i, 0, obj);
      });
    }
  }
  return regs
};

// add all conjugations of this verb
const addVerbs = function (token, world) {
  const { all } = world.methods.two.transform.verb || {};
  const str = token.root;
  if (!all) {
    return []
  }
  return all(str, world.model)
};

// add all inflections of this noun
const addNoun = function (token, world) {
  const { all } = world.methods.two.transform.noun || {};
  if (!all) {
    return [token.root]
  }
  return all(token.root, world.model)
};

// add all inflections of this adjective
const addAdjective = function (token, world) {
  const { all } = world.methods.two.transform.adjective || {};
  if (!all) {
    return [token.root]
  }
  return all(token.root, world.model)
};

// turn '{walk}' into 'walking', 'walked', etc
const inflectRoot = function (regs, world) {
  // do we have compromise/two?
  regs = regs.map(token => {
    // a reg to convert '{foo}'
    if (token.root) {
      // check if compromise/two is loaded
      if (world.methods.two && world.methods.two.transform) {
        let choices = [];
        // have explicitly set from POS - '{sweet/adjective}'
        if (token.pos) {
          if (token.pos === 'Verb') {
            choices = choices.concat(addVerbs(token, world));
          } else if (token.pos === 'Noun') {
            choices = choices.concat(addNoun(token, world));
          } else if (token.pos === 'Adjective') {
            choices = choices.concat(addAdjective(token, world));
          }
        } else {
          // do verb/noun/adj by default
          choices = choices.concat(addVerbs(token, world));
          choices = choices.concat(addNoun(token, world));
          choices = choices.concat(addAdjective(token, world));
        }
        choices = choices.filter(str => str);
        if (choices.length > 0) {
          token.operator = 'or';
          token.fastOr = new Set(choices);
        }
      } else {
        // if no compromise/two, drop down into 'machine' lookup
        token.machine = token.root;
        delete token.id;
        delete token.root;
      }
    }
    return token
  });

  return regs
};

// name any [unnamed] capture-groups with a number
const nameGroups = function (regs) {
  let index = 0;
  let inGroup = null;
  //'fill in' capture groups between start-end
  for (let i = 0; i < regs.length; i++) {
    const token = regs[i];
    if (token.groupStart === true) {
      inGroup = token.group;
      if (inGroup === null) {
        inGroup = String(index);
        index += 1;
      }
    }
    if (inGroup !== null) {
      token.group = inGroup;
    }
    if (token.groupEnd === true) {
      inGroup = null;
    }
  }
  return regs
};

// optimize an 'or' lookup, when the (a|b|c) list is simple or multi-word
const doFastOrMode = function (tokens) {
  return tokens.map(token => {
    if (token.choices !== undefined) {
      // make sure it's an OR
      if (token.operator !== 'or') {
        return token
      }
      if (token.fuzzy === true) {
        return token
      }
      // are they all straight-up words? then optimize them.
      const shouldPack = token.choices.every(block => {
        if (block.length !== 1) {
          return false
        }
        const reg = block[0];
        // ~fuzzy~ words need more care
        if (reg.fuzzy === true) {
          return false
        }
        // ^ and $ get lost in fastOr
        if (reg.start || reg.end) {
          return false
        }
        if (reg.word !== undefined && reg.negative !== true && reg.optional !== true && reg.method !== true) {
          return true //reg is simple-enough
        }
        return false
      });
      if (shouldPack === true) {
        token.fastOr = new Set();
        token.choices.forEach(block => {
          token.fastOr.add(block[0].word);
        });
        delete token.choices;
      }
    }
    return token
  })
};

// support ~(a|b|c)~
const fuzzyOr = function (regs) {
  return regs.map(reg => {
    if (reg.fuzzy && reg.choices) {
      // pass fuzzy-data to each OR choice
      reg.choices.forEach(r => {
        if (r.length === 1 && r[0].word) {
          r[0].fuzzy = true;
          r[0].min = reg.min;
        }
      });
    }
    return reg
  })
};

const postProcess = function (regs) {
  // ensure all capture groups names are filled between start and end
  regs = nameGroups(regs);
  // convert 'choices' format to 'fastOr' format
  regs = doFastOrMode(regs);
  // support ~(foo|bar)~
  regs = fuzzyOr(regs);
  return regs
};

/** parse a match-syntax string into json */
const syntax = function (input, opts, world) {
  // fail-fast
  if (input === null || input === undefined || input === '') {
    return []
  }
  opts = opts || {};
  if (typeof input === 'number') {
    input = String(input); //go for it?
  }
  let tokens = parseBlocks(input);
  //turn them into objects
  tokens = tokens.map(str => parseToken(str, opts));
  // '~re-do~'
  tokens = splitHyphens$1(tokens, world);
  // '{walk}'
  tokens = inflectRoot(tokens, world);
  //clean up anything weird
  tokens = postProcess(tokens);
  // console.log(tokens)
  return tokens
};

const anyIntersection = function (setA, setB) {
  for (const elem of setB) {
    if (setA.has(elem)) {
      return true
    }
  }
  return false
};
// check words/tags against our cache
const failFast = function (regs, cache) {
  for (let i = 0; i < regs.length; i += 1) {
    const reg = regs[i];
    if (reg.optional === true || reg.negative === true || reg.fuzzy === true) {
      continue
    }
    // is the word missing from the cache?
    if (reg.word !== undefined && cache.has(reg.word) === false) {
      return true
    }
    // is the tag missing?
    if (reg.tag !== undefined && cache.has('#' + reg.tag) === false) {
      return true
    }
    // perform a speedup for fast-or
    if (reg.fastOr && anyIntersection(reg.fastOr, cache) === false) {
      return false
    }
  }
  return false
};

// fuzzy-match (damerau-levenshtein)
// Based on  tad-lispy /node-damerau-levenshtein
// https://github.com/tad-lispy/node-damerau-levenshtein/blob/master/index.js
// count steps (insertions, deletions, substitutions, or transpositions)
const editDistance = function (strA, strB) {
  const aLength = strA.length,
    bLength = strB.length;
  // fail-fast
  if (aLength === 0) {
    return bLength
  }
  if (bLength === 0) {
    return aLength
  }
  // If the limit is not defined it will be calculate from this and that args.
  const limit = (bLength > aLength ? bLength : aLength) + 1;
  if (Math.abs(aLength - bLength) > (limit || 100)) {
    return limit || 100
  }
  // init the array
  const matrix = [];
  for (let i = 0; i < limit; i++) {
    matrix[i] = [i];
    matrix[i].length = limit;
  }
  for (let i = 0; i < limit; i++) {
    matrix[0][i] = i;
  }
  // Calculate matrix.
  let j, a_index, b_index, cost, min, t;
  for (let i = 1; i <= aLength; ++i) {
    a_index = strA[i - 1];
    for (j = 1; j <= bLength; ++j) {
      // Check the jagged distance total so far
      if (i === j && matrix[i][j] > 4) {
        return aLength
      }
      b_index = strB[j - 1];
      cost = a_index === b_index ? 0 : 1; // Step 5
      // Calculate the minimum (much faster than Math.min(...)).
      min = matrix[i - 1][j] + 1; // Deletion.
      if ((t = matrix[i][j - 1] + 1) < min) min = t; // Insertion.
      if ((t = matrix[i - 1][j - 1] + cost) < min) min = t; // Substitution.
      // Update matrix.
      const shouldUpdate =
        i > 1 && j > 1 && a_index === strB[j - 2] && strA[i - 2] === b_index && (t = matrix[i - 2][j - 2] + cost) < min;
      if (shouldUpdate) {
        matrix[i][j] = t;
      } else {
        matrix[i][j] = min;
      }
    }
  }
  // return number of steps
  return matrix[aLength][bLength]
};
// score similarity by from 0-1 (steps/length)
const fuzzyMatch = function (strA, strB, minLength = 3) {
  if (strA === strB) {
    return 1
  }
  //don't even bother on tiny strings
  if (strA.length < minLength || strB.length < minLength) {
    return 0
  }
  const steps = editDistance(strA, strB);
  const length = Math.max(strA.length, strB.length);
  const relative = length === 0 ? 0 : steps / length;
  const similarity = 1 - relative;
  return similarity
};

// these methods are called with '@hasComma' in the match syntax
// various unicode quotation-mark formats
const startQuote =
  /([\u0022\uFF02\u0027\u201C\u2018\u201F\u201B\u201E\u2E42\u201A\u00AB\u2039\u2035\u2036\u2037\u301D\u0060\u301F])/;

const endQuote = /([\u0022\uFF02\u0027\u201D\u2019\u00BB\u203A\u2032\u2033\u2034\u301E\u00B4])/;

const hasHyphen$1 = /^[-–—]$/;
const hasDash$1 = / [-–—]{1,3} /;

/** search the term's 'post' punctuation  */
const hasPost = (term, punct) => term.post.indexOf(punct) !== -1;
/** search the term's 'pre' punctuation  */
// const hasPre = (term, punct) => term.pre.indexOf(punct) !== -1

const methods$c = {
  /** does it have a quotation symbol?  */
  hasQuote: term => startQuote.test(term.pre) || endQuote.test(term.post),
  /** does it have a comma?  */
  hasComma: term => hasPost(term, ','),
  /** does it end in a period? */
  hasPeriod: term => hasPost(term, '.') === true && hasPost(term, '...') === false,
  /** does it end in an exclamation */
  hasExclamation: term => hasPost(term, '!'),
  /** does it end with a question mark? */
  hasQuestionMark: term => hasPost(term, '?') || hasPost(term, '¿'),
  /** is there a ... at the end? */
  hasEllipses: term => hasPost(term, '..') || hasPost(term, '…'),
  /** is there a semicolon after term word? */
  hasSemicolon: term => hasPost(term, ';'),
  /** is there a colon after term word? */
  hasColon: term => hasPost(term, ':'),
  /** is there a slash '/' in term word? */
  hasSlash: term => /\//.test(term.text),
  /** a hyphen connects two words like-term */
  hasHyphen: term => hasHyphen$1.test(term.post) || hasHyphen$1.test(term.pre),
  /** a dash separates words - like that */
  hasDash: term => hasDash$1.test(term.post) || hasDash$1.test(term.pre),
  /** is it multiple words combinded */
  hasContraction: term => Boolean(term.implicit),
  /** is it an acronym */
  isAcronym: term => term.tags.has('Acronym'),
  /** does it have any tags */
  isKnown: term => term.tags.size > 0,
  /** uppercase first letter, then a lowercase */
  isTitleCase: term => /^\p{Lu}[a-z'\u00C0-\u00FF]/u.test(term.text),
  /** uppercase all letters */
  isUpperCase: term => /^\p{Lu}+$/u.test(term.text),
};
// aliases
methods$c.hasQuotation = methods$c.hasQuote;

//declare it up here
let wrapMatch = function () { };
/** ignore optional/greedy logic, straight-up term match*/
const doesMatch$1 = function (term, reg, index, length) {
  // support '.'
  if (reg.anything === true) {
    return true
  }
  // support '^' (in parentheses)
  if (reg.start === true && index !== 0) {
    return false
  }
  // support '$' (in parentheses)
  if (reg.end === true && index !== length - 1) {
    return false
  }
  // match an id
  if (reg.id !== undefined && reg.id === term.id) {
    return true
  }
  //support a text match
  if (reg.word !== undefined) {
    // check case-sensitivity, etc
    if (reg.use) {
      return reg.word === term[reg.use]
    }
    //match contractions, machine-form
    if (term.machine !== null && term.machine === reg.word) {
      return true
    }
    // term aliases for slashes and things
    if (term.alias !== undefined && term.alias.hasOwnProperty(reg.word)) {
      return true
    }
    // support ~ fuzzy match
    if (reg.fuzzy === true) {
      if (reg.word === term.root) {
        return true
      }
      const score = fuzzyMatch(reg.word, term.normal);
      if (score >= reg.min) {
        return true
      }
    }
    // match slashes and things
    if (term.alias && term.alias.some(str => str === reg.word)) {
      return true
    }
    //match either .normal or .text
    return reg.word === term.text || reg.word === term.normal
  }
  //support #Tag
  if (reg.tag !== undefined) {
    return term.tags.has(reg.tag) === true
  }
  //support @method
  if (reg.method !== undefined) {
    if (typeof methods$c[reg.method] === 'function' && methods$c[reg.method](term) === true) {
      return true
    }
    return false
  }
  //support whitespace/punctuation
  if (reg.pre !== undefined) {
    return term.pre && term.pre.includes(reg.pre)
  }
  if (reg.post !== undefined) {
    return term.post && term.post.includes(reg.post)
  }
  //support /reg/
  if (reg.regex !== undefined) {
    let str = term.normal;
    if (reg.use) {
      str = term[reg.use];
    }
    return reg.regex.test(str)
  }
  //support <chunk>
  if (reg.chunk !== undefined) {
    return term.chunk === reg.chunk
  }
  //support %Noun|Verb%
  if (reg.switch !== undefined) {
    return term.switch === reg.switch
  }
  //support {machine}
  if (reg.machine !== undefined) {
    return term.normal === reg.machine || term.machine === reg.machine || term.root === reg.machine
  }
  //support {word/sense}
  if (reg.sense !== undefined) {
    return term.sense === reg.sense
  }
  // support optimized (one|two)
  if (reg.fastOr !== undefined) {
    // {work/verb} must be a verb
    if (reg.pos && !term.tags.has(reg.pos)) {
      return null
    }
    const str = term.root || term.implicit || term.machine || term.normal;
    return reg.fastOr.has(str) || reg.fastOr.has(term.text)
  }
  //support slower (one|two)
  if (reg.choices !== undefined) {
    // try to support && operator
    if (reg.operator === 'and') {
      // must match them all
      return reg.choices.every(r => wrapMatch(term, r, index, length))
    }
    // or must match one
    return reg.choices.some(r => wrapMatch(term, r, index, length))
  }
  return false
};
// wrap result for !negative match logic
wrapMatch = function (t, reg, index, length) {
  const result = doesMatch$1(t, reg, index, length);
  if (reg.negative === true) {
    return !result
  }
  return result
};

// for greedy checking, we no longer care about the reg.start
// value, and leaving it can cause failures for anchored greedy
// matches.  ditto for end-greedy matches: we need an earlier non-
// ending match to succceed until we get to the actual end.
const getGreedy = function (state, endReg) {
  const reg = Object.assign({}, state.regs[state.r], { start: false, end: false });
  const start = state.t;
  for (; state.t < state.terms.length; state.t += 1) {
    //stop for next-reg match
    if (endReg && wrapMatch(state.terms[state.t], endReg, state.start_i + state.t, state.phrase_length)) {
      return state.t
    }
    const count = state.t - start + 1;
    // is it max-length now?
    if (reg.max !== undefined && count === reg.max) {
      return state.t
    }
    //stop here
    if (wrapMatch(state.terms[state.t], reg, state.start_i + state.t, state.phrase_length) === false) {
      // is it too short?
      if (reg.min !== undefined && count < reg.min) {
        return null
      }
      return state.t
    }
  }
  return state.t
};

const greedyTo = function (state, nextReg) {
  let t = state.t;
  //if there's no next one, just go off the end!
  if (!nextReg) {
    return state.terms.length
  }
  //otherwise, we're looking for the next one
  for (; t < state.terms.length; t += 1) {
    if (wrapMatch(state.terms[t], nextReg, state.start_i + t, state.phrase_length) === true) {
      // console.log(`greedyTo ${state.terms[t].normal}`)
      return t
    }
  }
  //guess it doesn't exist, then.
  return null
};

const isEndGreedy = function (reg, state) {
  if (reg.end === true && reg.greedy === true) {
    if (state.start_i + state.t < state.phrase_length - 1) {
      const tmpReg = Object.assign({}, reg, { end: false });
      if (wrapMatch(state.terms[state.t], tmpReg, state.start_i + state.t, state.phrase_length) === true) {
        // console.log(`endGreedy ${state.terms[state.t].normal}`)
        return true
      }
    }
  }
  return false
};

const getGroup$1 = function (state, term_index) {
  if (state.groups[state.inGroup]) {
    return state.groups[state.inGroup]
  }
  state.groups[state.inGroup] = {
    start: term_index,
    length: 0,
  };
  return state.groups[state.inGroup]
};

//support 'unspecific greedy' .* properly
// its logic is 'greedy until', where it's looking for the next token
// '.+ foo' means we check for 'foo', indefinetly
const doAstrix = function (state) {
  const { regs } = state;
  const reg = regs[state.r];

  const skipto = greedyTo(state, regs[state.r + 1]);
  //maybe we couldn't find it
  if (skipto === null || skipto === 0) {
    return null
  }
  // ensure it's long enough
  if (reg.min !== undefined && skipto - state.t < reg.min) {
    return null
  }
  // reduce it back, if it's too long
  if (reg.max !== undefined && skipto - state.t > reg.max) {
    state.t = state.t + reg.max;
    return true
  }
  // set the group result
  if (state.hasGroup === true) {
    const g = getGroup$1(state, state.t);
    g.length = skipto - state.t;
  }
  state.t = skipto;
  // log(`✓ |greedy|`)
  return true
};

const isArray$5 = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
};

const doOrBlock = function (state, skipN = 0) {
  const block = state.regs[state.r];
  let wasFound = false;
  // do each multiword sequence
  for (let c = 0; c < block.choices.length; c += 1) {
    // try to match this list of tokens
    const regs = block.choices[c];
    if (!isArray$5(regs)) {
      return false
    }
    wasFound = regs.every((cr, w_index) => {
      let extra = 0;
      const t = state.t + w_index + skipN + extra;
      if (state.terms[t] === undefined) {
        return false
      }
      const foundBlock = wrapMatch(state.terms[t], cr, t + state.start_i, state.phrase_length);
      // this can be greedy - '(foo+ bar)'
      if (foundBlock === true && cr.greedy === true) {
        for (let i = 1; i < state.terms.length; i += 1) {
          const term = state.terms[t + i];
          if (term) {
            const keepGoing = wrapMatch(term, cr, state.start_i + i, state.phrase_length);
            if (keepGoing === true) {
              extra += 1;
            } else {
              break
            }
          }
        }
      }
      skipN += extra;
      return foundBlock
    });
    if (wasFound) {
      skipN += regs.length;
      break
    }
  }
  // we found a match -  is it greedy though?
  if (wasFound && block.greedy === true) {
    return doOrBlock(state, skipN) // try it again!
  }
  return skipN
};

const doAndBlock = function (state) {
  let longest = 0;
  // all blocks must match, and we return the greediest match
  const reg = state.regs[state.r];
  const allDidMatch = reg.choices.every(block => {
    //  for multi-word blocks, all must match
    const allWords = block.every((cr, w_index) => {
      const tryTerm = state.t + w_index;
      if (state.terms[tryTerm] === undefined) {
        return false
      }
      return wrapMatch(state.terms[tryTerm], cr, tryTerm, state.phrase_length)
    });
    if (allWords === true && block.length > longest) {
      longest = block.length;
    }
    return allWords
  });
  if (allDidMatch === true) {
    // console.log(`doAndBlock ${state.terms[state.t].normal}`)
    return longest
  }
  return false
};

const orBlock = function (state) {
  const { regs } = state;
  const reg = regs[state.r];
  const skipNum = doOrBlock(state);
  // did we find a match?
  if (skipNum) {
    // handle 'not' logic
    if (reg.negative === true) {
      return null // die
    }
    // tuck in as named-group
    if (state.hasGroup === true) {
      const g = getGroup$1(state, state.t);
      g.length += skipNum;
    }
    // ensure we're at the end
    if (reg.end === true) {
      const end = state.phrase_length;
      if (state.t + state.start_i + skipNum !== end) {
        return null
      }
    }
    state.t += skipNum;
    // log(`✓ |found-or|`)
    return true
  } else if (!reg.optional) {
    return null //die
  }
  return true
};

// '(foo && #Noun)' - require all matches on the term
const andBlock = function (state) {
  const { regs } = state;
  const reg = regs[state.r];

  const skipNum = doAndBlock(state);
  if (skipNum) {
    // handle 'not' logic
    if (reg.negative === true) {
      return null // die
    }
    if (state.hasGroup === true) {
      const g = getGroup$1(state, state.t);
      g.length += skipNum;
    }
    // ensure we're at the end
    if (reg.end === true) {
      const end = state.phrase_length - 1;
      if (state.t + state.start_i !== end) {
        return null
      }
    }
    state.t += skipNum;
    // log(`✓ |found-and|`)
    return true
  } else if (!reg.optional) {
    return null //die
  }
  return true
};

const negGreedy = function (state, reg, nextReg) {
  let skip = 0;
  for (let t = state.t; t < state.terms.length; t += 1) {
    let found = wrapMatch(state.terms[t], reg, state.start_i + state.t, state.phrase_length);
    // we don't want a match, here
    if (found) {
      break//stop going
    }
    // are we doing 'greedy-to'?
    // - "!foo+ after"  should stop at 'after'
    if (nextReg) {
      found = wrapMatch(state.terms[t], nextReg, state.start_i + state.t, state.phrase_length);
      if (found) {
        break
      }
    }
    skip += 1;
    // is it max-length now?
    if (reg.max !== undefined && skip === reg.max) {
      break
    }
  }
  if (skip === 0) {
    return false //dead
  }
  // did we satisfy min for !foo{min,max}
  if (reg.min && reg.min > skip) {
    return false//dead
  }
  state.t += skip;
  // state.r += 1
  return true
};

// '!foo' should match anything that isn't 'foo'
// if it matches, return false
const doNegative = function (state) {
  const { regs } = state;
  const reg = regs[state.r];

  // match *anything* but this term
  const tmpReg = Object.assign({}, reg);
  tmpReg.negative = false; // try removing it

  // found it? if so, we die here
  const found = wrapMatch(state.terms[state.t], tmpReg, state.start_i + state.t, state.phrase_length);
  if (found) {
    return false//bye
  }
  // should we skip the term too?
  if (reg.optional) {
    // "before after" - "before !foo? after"
    // does the next reg match the this term?
    const nextReg = regs[state.r + 1];
    if (nextReg) {
      const fNext = wrapMatch(state.terms[state.t], nextReg, state.start_i + state.t, state.phrase_length);
      if (fNext) {
        state.r += 1;
      } else if (nextReg.optional && regs[state.r + 2]) {
        // ugh. ok,
        // support "!foo? extra? need"
        // but don't scan ahead more than that.
        const fNext2 = wrapMatch(state.terms[state.t], regs[state.r + 2], state.start_i + state.t, state.phrase_length);
        if (fNext2) {
          state.r += 2;
        }
      }
    }
  }
  // negative greedy - !foo+  - super hard!
  if (reg.greedy) {
    return negGreedy(state, tmpReg, regs[state.r + 1])
  }
  state.t += 1;
  return true
};

// 'foo? foo' matches are tricky.
const foundOptional = function (state) {
  const { regs } = state;
  const reg = regs[state.r];
  const term = state.terms[state.t];
  // does the next reg match it too?
  const nextRegMatched = wrapMatch(term, regs[state.r + 1], state.start_i + state.t, state.phrase_length);
  if (reg.negative || nextRegMatched) {
    // but does the next reg match the next term??
    // only skip if it doesn't
    const nextTerm = state.terms[state.t + 1];
    if (!nextTerm || !wrapMatch(nextTerm, regs[state.r + 1], state.start_i + state.t, state.phrase_length)) {
      state.r += 1;
    }
  }
};

// keep 'foo+' or 'foo*' going..
const greedyMatch = function (state) {
  const { regs, phrase_length } = state;
  const reg = regs[state.r];
  state.t = getGreedy(state, regs[state.r + 1]);
  if (state.t === null) {
    return null //greedy was too short
  }
  // foo{2,4} - has a greed-minimum
  if (reg.min && reg.min > state.t) {
    return null //greedy was too short
  }
  // 'foo+$' - if also an end-anchor, ensure we really reached the end
  if (reg.end === true && state.start_i + state.t !== phrase_length) {
    return null //greedy didn't reach the end
  }
  return true
};

// for: ['we', 'have']
// a match for "we have" should work as normal
// but matching "we've" should skip over implict terms
const contractionSkip = function (state) {
  const term = state.terms[state.t];
  const reg = state.regs[state.r];
  // did we match the first part of a contraction?
  if (term.implicit && state.terms[state.t + 1]) {
    const nextTerm = state.terms[state.t + 1];
    // ensure next word is implicit
    if (!nextTerm.implicit) {
      return
    }
    // we matched "we've" - skip-over [we, have]
    if (reg.word === term.normal) {
      state.t += 1;
    }
    // also skip for @hasContraction
    if (reg.method === 'hasContraction') {
      state.t += 1;
    }
  }
};

// '[foo]' should also be logged as a group
const setGroup = function (state, startAt) {
  const reg = state.regs[state.r];
  // Get or create capture group
  const g = getGroup$1(state, startAt);
  // Update group - add greedy or increment length
  if (state.t > 1 && reg.greedy) {
    g.length += state.t - startAt;
  } else {
    g.length++;
  }
};

// when a reg matches a term
const simpleMatch = function (state) {
  const { regs } = state;
  const reg = regs[state.r];
  const term = state.terms[state.t];
  const startAt = state.t;
  // if it's a negative optional match... :0
  if (reg.optional && regs[state.r + 1] && reg.negative) {
    return true
  }
  // okay, it was a match, but if it's optional too,
  // we should check the next reg too, to skip it?
  if (reg.optional && regs[state.r + 1]) {
    foundOptional(state);
  }
  // Contraction skip:
  // did we match the first part of a contraction?
  if (term.implicit && state.terms[state.t + 1]) {
    contractionSkip(state);
  }
  //advance to the next term!
  state.t += 1;
  //check any ending '$' flags
  //if this isn't the last term, refuse the match
  if (reg.end === true && state.t !== state.terms.length && reg.greedy !== true) {
    return null //die
  }
  // keep 'foo+' going...
  if (reg.greedy === true) {
    const alive = greedyMatch(state);
    if (!alive) {
      return null
    }
  }
  // log '[foo]' as a group
  if (state.hasGroup === true) {
    setGroup(state, startAt);
  }
  return true
};

// i formally apologize for how complicated this is.

/** 
 * try a sequence of match tokens ('regs') 
 * on a sequence of terms, 
 * starting at this certain term.
 */
const tryHere = function (terms, regs, start_i, phrase_length) {
  // console.log(`\n\n:start: '${terms[0].text}':`)
  if (terms.length === 0 || regs.length === 0) {
    return null
  }
  // all the variables that matter
  const state = {
    t: 0,
    terms: terms,
    r: 0,
    regs: regs,
    groups: {},
    start_i: start_i,
    phrase_length: phrase_length,
    inGroup: null,
  };

  // we must satisfy every token in 'regs'
  // if we get to the end, we have a match.
  for (; state.r < regs.length; state.r += 1) {
    const reg = regs[state.r];
    // Check if this reg has a named capture group
    state.hasGroup = Boolean(reg.group);
    // Reuse previous capture group if same
    if (state.hasGroup === true) {
      state.inGroup = reg.group;
    } else {
      state.inGroup = null;
    }
    //have we run-out of terms?
    if (!state.terms[state.t]) {
      //are all remaining regs optional or negative?
      const alive = regs.slice(state.r).some(remain => !remain.optional);
      if (alive === false) {
        break //done!
      }
      return null // die
    }
    // support 'unspecific greedy' .* properly
    if (reg.anything === true && reg.greedy === true) {
      const alive = doAstrix(state);
      if (!alive) {
        return null
      }
      continue
    }
    // slow-OR - multi-word OR (a|b|foo bar)
    if (reg.choices !== undefined && reg.operator === 'or') {
      const alive = orBlock(state);
      if (!alive) {
        return null
      }
      continue
    }
    // slow-AND - multi-word AND (#Noun && foo) blocks
    if (reg.choices !== undefined && reg.operator === 'and') {
      const alive = andBlock(state);
      if (!alive) {
        return null
      }
      continue
    }
    // support '.' as any-single
    if (reg.anything === true) {
      // '!.' negative anything should insta-fail
      if (reg.negative && reg.anything) {
        return null
      }
      const alive = simpleMatch(state);
      if (!alive) {
        return null
      }
      continue
    }
    // support 'foo*$' until the end
    if (isEndGreedy(reg, state) === true) {
      const alive = simpleMatch(state);
      if (!alive) {
        return null
      }
      continue
    }
    // ok, it doesn't match - but maybe it wasn't *supposed* to?
    if (reg.negative) {
      // we want *anything* but this term
      const alive = doNegative(state);
      if (!alive) {
        return null
      }
      continue
    }
    // ok, finally test the term-reg
    const hasMatch = wrapMatch(state.terms[state.t], reg, state.start_i + state.t, state.phrase_length);
    if (hasMatch === true) {
      const alive = simpleMatch(state);
      if (!alive) {
        return null
      }
      continue
    }
    //ok who cares, keep going
    if (reg.optional === true) {
      continue
    }

    // finally, we die
    return null
  }
  //return our results, as pointers
  const pntr = [null, start_i, state.t + start_i];
  if (pntr[1] === pntr[2]) {
    return null //found 0 terms
  }
  const groups = {};
  Object.keys(state.groups).forEach(k => {
    const o = state.groups[k];
    const start = start_i + o.start;
    groups[k] = [null, start, start + o.length];
  });
  return { pointer: pntr, groups: groups }
};

// support returning a subset of a match
// like 'foo [bar] baz' -> bar
const getGroup = function (res, group) {
  const ptrs = [];
  const byGroup = {};
  if (res.length === 0) {
    return { ptrs, byGroup }
  }
  if (typeof group === 'number') {
    group = String(group);
  }
  if (group) {
    res.forEach(r => {
      if (r.groups[group]) {
        ptrs.push(r.groups[group]);
      }
    });
  } else {
    res.forEach(r => {
      ptrs.push(r.pointer);
      Object.keys(r.groups).forEach(k => {
        byGroup[k] = byGroup[k] || [];
        byGroup[k].push(r.groups[k]);
      });
    });
  }
  return { ptrs, byGroup }
};

const notIf$1 = function (results, not, docs) {
  results = results.filter(res => {
    const [n, start, end] = res.pointer;
    const terms = docs[n].slice(start, end);
    for (let i = 0; i < terms.length; i += 1) {
      const slice = terms.slice(i);
      const found = tryHere(slice, not, i, terms.length);
      if (found !== null) {
        return false
      }
    }
    return true
  });
  return results
};

// make proper pointers
const addSentence = function (res, n) {
  res.pointer[0] = n;
  Object.keys(res.groups).forEach(k => {
    res.groups[k][0] = n;
  });
  return res
};

const handleStart = function (terms, regs, n) {
  let res = tryHere(terms, regs, 0, terms.length);
  if (res) {
    res = addSentence(res, n);
    return res //getGroup([res], group)
  }
  return null
};

// ok, here we go.
const runMatch$1 = function (docs, todo, cache) {
  cache = cache || [];
  const { regs, group, justOne } = todo;
  let results = [];
  if (!regs || regs.length === 0) {
    return { ptrs: [], byGroup: {} }
  }

  const minLength = regs.filter(r => r.optional !== true && r.negative !== true).length;
  docs: for (let n = 0; n < docs.length; n += 1) {
    const terms = docs[n];
    // let index = terms[0].index || []
    // can we skip this sentence?
    if (cache[n] && failFast(regs, cache[n])) {
      continue
    }
    // ^start regs only run once, per phrase
    if (regs[0].start === true) {
      const foundStart = handleStart(terms, regs, n);
      if (foundStart) {
        results.push(foundStart);
      }
      continue
    }
    //ok, try starting the match now from every term
    for (let i = 0; i < terms.length; i += 1) {
      const slice = terms.slice(i);
      // ensure it's long-enough
      if (slice.length < minLength) {
        break
      }
      let res = tryHere(slice, regs, i, terms.length);
      // did we find a result?
      if (res) {
        // res = addSentence(res, index[0])
        res = addSentence(res, n);
        results.push(res);
        // should we stop here?
        if (justOne === true) {
          break docs
        }
        // skip ahead, over these results
        const end = res.pointer[2];
        if (Math.abs(end - 1) > i) {
          i = Math.abs(end - 1);
        }
      }
    }
  }
  // ensure any end-results ($) match until the last term
  if (regs[regs.length - 1].end === true) {
    results = results.filter(res => {
      const n = res.pointer[0];
      return docs[n].length === res.pointer[2]
    });
  }
  if (todo.notIf) {
    results = notIf$1(results, todo.notIf, docs);
  }
  // grab the requested group
  results = getGroup(results, group);
  // add ids to pointers
  results.ptrs.forEach(ptr => {
    const [n, start, end] = ptr;
    ptr[3] = docs[n][start].id;//start-id
    ptr[4] = docs[n][end - 1].id;//end-id
  });
  return results
};

const methods$b = {
  one: {
    termMethods: methods$c,
    parseMatch: syntax,
    match: runMatch$1,
  },
};

var lib$3 = {
  /** pre-parse any match statements */
  parseMatch: function (str, opts) {
    const world = this.world();
    const killUnicode = world.methods.one.killUnicode;
    if (killUnicode) {
      str = killUnicode(str, world);
    }
    return world.methods.one.parseMatch(str, opts, world)
  }
};

var match = {
  api: matchAPI,
  methods: methods$b,
  lib: lib$3,
};

const isClass = /^\../;
const isId = /^#./;

const escapeXml = str => {
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  str = str.replace(/"/g, '&quot;');
  str = str.replace(/'/g, '&apos;');
  return str
};

// interpret .class, #id, tagName
const toTag = function (k) {
  let start = '';
  let end = '</span>';
  k = escapeXml(k);
  if (isClass.test(k)) {
    start = `<span class="${k.replace(/^\./, '')}"`;
  } else if (isId.test(k)) {
    start = `<span id="${k.replace(/^#/, '')}"`;
  } else {
    start = `<${k}`;
    end = `</${k}>`;
  }
  start += '>';
  return { start, end }
};

const getIndex = function (doc, obj) {
  const starts = {};
  const ends = {};
  Object.keys(obj).forEach(k => {
    let res = obj[k];
    const tag = toTag(k);
    if (typeof res === 'string') {
      res = doc.match(res);
    }
    res.docs.forEach(terms => {
      // don't highlight implicit terms
      if (terms.every(t => t.implicit)) {
        return
      }
      const a = terms[0].id;
      starts[a] = starts[a] || [];
      starts[a].push(tag.start);
      const b = terms[terms.length - 1].id;
      ends[b] = ends[b] || [];
      ends[b].push(tag.end);
    });
  });
  return { starts, ends }
};

const html = function (obj) {
  // index ids to highlight
  const { starts, ends } = getIndex(this, obj);
  // create the text output
  let out = '';
  this.docs.forEach(terms => {
    for (let i = 0; i < terms.length; i += 1) {
      const t = terms[i];
      // do a span tag
      if (starts.hasOwnProperty(t.id)) {
        out += starts[t.id].join('');
      }
      out += t.pre || '';
      out += t.text || '';
      if (ends.hasOwnProperty(t.id)) {
        out += ends[t.id].join('');
      }
      out += t.post || '';
    }
  });
  return out
};
var html$1 = { html };

const trimEnd = /[,:;)\]*.?~!\u0022\uFF02\u201D\u2019\u00BB\u203A\u2032\u2033\u2034\u301E\u00B4—-]+$/;
const trimStart =
  /^[(['"*~\uFF02\u201C\u2018\u201F\u201B\u201E\u2E42\u201A\u00AB\u2039\u2035\u2036\u2037\u301D\u0060\u301F]+/;

const punctToKill = /[,:;)('"\u201D\]]/;
const isHyphen = /^[-–—]$/;
const hasSpace = / /;

const textFromTerms = function (terms, opts, keepSpace = true) {
  let txt = '';
  terms.forEach(t => {
    let pre = t.pre || '';
    let post = t.post || '';
    if (opts.punctuation === 'some') {
      pre = pre.replace(trimStart, '');
      // replace a hyphen with a space
      if (isHyphen.test(post)) {
        post = ' ';
      }
      post = post.replace(punctToKill, '');
      // cleanup exclamations
      post = post.replace(/\?!+/, '?');
      post = post.replace(/!+/, '!');
      post = post.replace(/\?+/, '?');
      // kill elipses
      post = post.replace(/\.{2,}/, '');
      // kill abbreviation periods
      if (t.tags.has('Abbreviation')) {
        post = post.replace(/\./, '');
      }
    }
    if (opts.whitespace === 'some') {
      pre = pre.replace(/\s/, ''); //remove pre-whitespace
      post = post.replace(/\s+/, ' '); //replace post-whitespace with a space
    }
    if (!opts.keepPunct) {
      pre = pre.replace(trimStart, '');
      if (post === '-') {
        post = ' ';
      } else {
        post = post.replace(trimEnd, '');
      }
    }
    // grab the correct word format
    let word = t[opts.form || 'text'] || t.normal || '';
    if (opts.form === 'implicit') {
      word = t.implicit || t.text;
    }
    if (opts.form === 'root' && t.implicit) {
      word = t.root || t.implicit || t.normal;
    }
    // add an implicit space, for contractions
    if ((opts.form === 'machine' || opts.form === 'implicit' || opts.form === 'root') && t.implicit) {
      if (!post || !hasSpace.test(post)) {
        post += ' ';
      }
    }
    txt += pre + word + post;
  });
  if (keepSpace === false) {
    txt = txt.trim();
  }
  if (opts.lowerCase === true) {
    txt = txt.toLowerCase();
  }
  return txt
};

const textFromDoc = function (docs, opts) {
  let text = '';
  if (!docs || !docs[0] || !docs[0][0]) {
    return text
  }
  for (let i = 0; i < docs.length; i += 1) {
    // middle
    text += textFromTerms(docs[i], opts, true);
  }
  if (!opts.keepSpace) {
    text = text.trim();
  }
  if (opts.keepEndPunct === false) {
    // don't remove ':)' etc
    if (!docs[0][0].tags.has('Emoticon')) {
      text = text.replace(trimStart, '');
    }
    // remove ending periods
    const last = docs[docs.length - 1];
    if (!last[last.length - 1].tags.has('Emoticon')) {
      text = text.replace(trimEnd, '');
    }
    // kill end quotations
    if (text.endsWith(`'`) && !text.endsWith(`s'`)) {
      text = text.replace(/'/, '');
    }
  }
  if (opts.cleanWhitespace === true) {
    text = text.trim();
  }
  return text
};

const fmts = {
  text: {
    form: 'text',
  },
  normal: {
    whitespace: 'some',
    punctuation: 'some',
    case: 'some',
    unicode: 'some',
    form: 'normal',
  },
  machine: {
    keepSpace: false,
    whitespace: 'some',
    punctuation: 'some',
    case: 'none',
    unicode: 'some',
    form: 'machine',
  },
  root: {
    keepSpace: false,
    whitespace: 'some',
    punctuation: 'some',
    case: 'some',
    unicode: 'some',
    form: 'root',
  },
  implicit: {
    form: 'implicit',
  }
};
fmts.clean = fmts.normal;
fmts.reduced = fmts.root;

/* eslint-disable no-bitwise */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-multi-assign */

// https://github.com/jbt/tiny-hashes/
const k = [];
let i$1 = 0;
for (; i$1 < 64; ) {
  k[i$1] = 0 | (Math.sin(++i$1 % Math.PI) * 4294967296);
}

const md5 = function (s) {
  let b,
    c,
    d,
    j = decodeURI(encodeURI(s)) + '\x80',
    a = j.length;

  const h = [(b = 0x67452301), (c = 0xefcdab89), ~b, ~c],
    words = [];

  s = (--a / 4 + 2) | 15;

  words[--s] = a * 8;

  for (; ~a; ) {
    words[a >> 2] |= j.charCodeAt(a) << (8 * a--);
  }

  for (i$1 = j = 0; i$1 < s; i$1 += 16) {
    a = h;

    for (
      ;
      j < 64;
      a = [
        (d = a[3]),
        b +
          (((d =
            a[0] +
            [(b & c) | (~b & d), (d & b) | (~d & c), b ^ c ^ d, c ^ (b | ~d)][(a = j >> 4)] +
            k[j] +
            ~~words[i$1 | ([j, 5 * j + 1, 3 * j + 5, 7 * j][a] & 15)]) <<
            (a = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21][4 * a + (j++ % 4)])) |
            (d >>> -a)),
        b,
        c,
      ]
    ) {
      b = a[1] | 0;
      c = a[2];
    }
    for (j = 4; j; ) h[--j] += a[j];
  }

  for (s = ''; j < 32; ) {
    s += ((h[j >> 3] >> ((1 ^ j++) * 4)) & 15).toString(16);
  }

  return s
};
// console.log(md5('food-safety'))

const defaults$3 = {
  text: true,
  terms: true,
};

const opts = { case: 'none', unicode: 'some', form: 'machine', punctuation: 'some' };

const merge = function (a, b) {
  return Object.assign({}, a, b)
};

const fns$2 = {
  text: terms => textFromTerms(terms, { keepPunct: true }, false),
  normal: terms => textFromTerms(terms, merge(fmts.normal, { keepPunct: true }), false),
  implicit: terms => textFromTerms(terms, merge(fmts.implicit, { keepPunct: true }), false),

  machine: terms => textFromTerms(terms, opts, false),
  root: terms => textFromTerms(terms, merge(opts, { form: 'root' }), false),

  hash: terms => md5(textFromTerms(terms, { keepPunct: true }, false)),

  offset: terms => {
    const len = fns$2.text(terms).length;
    return {
      index: terms[0].offset.index,
      start: terms[0].offset.start,
      length: len,
    }
  },
  terms: terms => {
    return terms.map(t => {
      const term = Object.assign({}, t);
      term.tags = Array.from(t.tags);
      return term
    })
  },
  confidence: (_terms, view, i) => view.eq(i).confidence(),
  syllables: (_terms, view, i) => view.eq(i).syllables(),
  sentence: (_terms, view, i) => view.eq(i).fullSentence().text(),
  dirty: terms => terms.some(t => t.dirty === true),
};
fns$2.sentences = fns$2.sentence;
fns$2.clean = fns$2.normal;
fns$2.reduced = fns$2.root;

const toJSON$2 = function (view, option) {
  option = option || {};
  if (typeof option === 'string') {
    option = {};
  }
  option = Object.assign({}, defaults$3, option);
  // run any necessary upfront steps
  if (option.offset) {
    view.compute('offset');
  }
  return view.docs.map((terms, i) => {
    const res = {};
    Object.keys(option).forEach(k => {
      if (option[k] && fns$2[k]) {
        res[k] = fns$2[k](terms, view, i);
      }
    });
    return res
  })
};

const methods$a = {
  /** return data */
  json: function (n) {
    const res = toJSON$2(this, n);
    if (typeof n === 'number') {
      return res[n]
    }
    return res
  },
};
methods$a.data = methods$a.json;

const isClientSide = () => typeof window !== 'undefined' && window.document;

//output some helpful stuff to the console
const debug$1 = function (fmt) {
  const debugMethods = this.methods.one.debug || {};
  // see if method name exists
  if (fmt && debugMethods.hasOwnProperty(fmt)) {
    debugMethods[fmt](this);
    return this
  }
  // log default client-side view
  if (isClientSide()) {
    debugMethods.clientSide(this);
    return this
  }
  // else, show regular server-side tags view
  debugMethods.tags(this);
  return this
};

const toText$3 = function (term) {
  const pre = term.pre || '';
  const post = term.post || '';
  return pre + term.text + post
};

const findStarts = function (doc, obj) {
  const starts = {};
  Object.keys(obj).forEach(reg => {
    const m = doc.match(reg);
    m.fullPointer.forEach(a => {
      starts[a[3]] = { fn: obj[reg], end: a[2] };
    });
  });
  return starts
};

const wrap = function (doc, obj) {
  // index ids to highlight
  const starts = findStarts(doc, obj);
  let text = '';
  doc.docs.forEach((terms, n) => {
    for (let i = 0; i < terms.length; i += 1) {
      const t = terms[i];
      // do a span tag
      if (starts.hasOwnProperty(t.id)) {
        const { fn, end } = starts[t.id];
        const m = doc.update([[n, i, end]]);
        text += terms[i].pre || '';
        text += fn(m);
        i = end - 1;
        text += terms[i].post || '';
      } else {
        text += toText$3(t);
      }
    }
  });
  return text
};

const isObject$2 = val => {
  return Object.prototype.toString.call(val) === '[object Object]'
};

// sort by frequency
const topk = function (arr) {
  const obj = {};
  arr.forEach(a => {
    obj[a] = obj[a] || 0;
    obj[a] += 1;
  });
  const res = Object.keys(obj).map(k => {
    return { normal: k, count: obj[k] }
  });
  return res.sort((a, b) => (a.count > b.count ? -1 : 0))
};

/** some named output formats */
const out = function (method) {
  // support custom outputs
  if (isObject$2(method)) {
    return wrap(this, method)
  }
  // text out formats
  if (method === 'text') {
    return this.text()
  }
  if (method === 'normal') {
    return this.text('normal')
  }
  if (method === 'root') {
    return this.text('root')
  }
  if (method === 'machine' || method === 'reduced') {
    return this.text('machine')
  }
  if (method === 'hash' || method === 'md5') {
    return md5(this.text())
  }

  // json data formats
  if (method === 'json') {
    return this.json()
  }
  if (method === 'offset' || method === 'offsets') {
    this.compute('offset');
    return this.json({ offset: true })
  }
  if (method === 'array') {
    const arr = this.docs.map(terms => {
      return terms
        .reduce((str, t) => {
          return str + t.pre + t.text + t.post
        }, '')
        .trim()
    });
    return arr.filter(str => str)
  }
  // return terms sorted by frequency
  if (method === 'freq' || method === 'frequency' || method === 'topk') {
    return topk(this.json({ normal: true }).map(o => o.normal))
  }

  // some handy ad-hoc outputs
  if (method === 'terms') {
    let list = [];
    this.docs.forEach(terms => {
      let words = terms.map(t => t.text);
      words = words.filter(t => t);
      list = list.concat(words);
    });
    return list
  }
  if (method === 'tags') {
    return this.docs.map(terms => {
      return terms.reduce((h, t) => {
        h[t.implicit || t.normal] = Array.from(t.tags);
        return h
      }, {})
    })
  }
  if (method === 'debug') {
    return this.debug() //allow
  }
  return this.text()
};

const methods$9 = {
  /** */
  debug: debug$1,
  /** */
  out,
  /** */
  wrap: function (obj) {
    return wrap(this, obj)
  },
};

const isObject$1 = val => {
  return Object.prototype.toString.call(val) === '[object Object]'
};

var text = {
  /** */
  text: function (fmt) {
    let opts = {};
    if (fmt && typeof fmt === 'string' && fmts.hasOwnProperty(fmt)) {
      opts = Object.assign({}, fmts[fmt]);
    } else if (fmt && isObject$1(fmt)) {
      opts = Object.assign({}, fmt); //todo: fixme
    }
    // is it a full document?
    if (opts.keepSpace === undefined && !this.isFull()) {
      //
      opts.keepSpace = false;
    }
    if (opts.keepEndPunct === undefined && this.pointer) {
      const ptr = this.pointer[0];
      if (ptr && ptr[1]) {
        opts.keepEndPunct = false;
      } else {
        opts.keepEndPunct = true;
      }
    }
    // set defaults
    if (opts.keepPunct === undefined) {
      opts.keepPunct = true;
    }
    if (opts.keepSpace === undefined) {
      opts.keepSpace = true;
    }
    return textFromDoc(this.docs, opts)
  },
};

const methods$8 = Object.assign({}, methods$9, text, methods$a, html$1);

const addAPI$1 = function (View) {
  Object.assign(View.prototype, methods$8);
};

/* eslint-disable no-console */
const logClientSide = function (view) {
  console.log('%c -=-=- ', 'background-color:#6699cc;');
  view.forEach(m => {
    console.groupCollapsed(m.text());
    const terms = m.docs[0];
    const out = terms.map(t => {
      let text = t.text || '-';
      if (t.implicit) {
        text = '[' + t.implicit + ']';
      }
      const tags = '[' + Array.from(t.tags).join(', ') + ']';
      return { text, tags }
    });
    console.table(out, ['text', 'tags']);
    console.groupEnd();
  });
};

// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
const reset = '\x1b[0m';

//cheaper than requiring chalk
const cli = {
  green: str => '\x1b[32m' + str + reset,
  red: str => '\x1b[31m' + str + reset,
  blue: str => '\x1b[34m' + str + reset,
  magenta: str => '\x1b[35m' + str + reset,
  cyan: str => '\x1b[36m' + str + reset,
  yellow: str => '\x1b[33m' + str + reset,
  black: str => '\x1b[30m' + str + reset,
  dim: str => '\x1b[2m' + str + reset,
  i: str => '\x1b[3m' + str + reset,
};

/* eslint-disable no-console */

const tagString = function (tags, model) {
  if (model.one.tagSet) {
    tags = tags.map(tag => {
      if (!model.one.tagSet.hasOwnProperty(tag)) {
        return tag
      }
      const c = model.one.tagSet[tag].color || 'blue';
      return cli[c](tag)
    });
  }
  return tags.join(', ')
};

const showTags = function (view) {
  const { docs, model } = view;
  if (docs.length === 0) {
    console.log(cli.blue('\n     ──────'));
  }
  docs.forEach(terms => {
    console.log(cli.blue('\n  ┌─────────'));
    terms.forEach(t => {
      const tags = [...(t.tags || [])];
      let text = t.text || '-';
      if (t.sense) {
        text = `{${t.normal}/${t.sense}}`;
      }
      if (t.implicit) {
        text = '[' + t.implicit + ']';
      }
      text = cli.yellow(text);
      let word = "'" + text + "'";
      if (t.reference) {
        const str = view.update([t.reference]).text('normal');
        word += ` - ${cli.dim(cli.i('[' + str + ']'))}`;
      }
      word = word.padEnd(18);
      const str = cli.blue('  │ ') + cli.i(word) + '  - ' + tagString(tags, model);
      console.log(str);
    });
  });
  console.log('\n');
};

/* eslint-disable no-console */

const showChunks = function (view) {
  const { docs } = view;
  console.log('');
  docs.forEach(terms => {
    const out = [];
    terms.forEach(term => {
      if (term.chunk === 'Noun') {
        out.push(cli.blue(term.implicit || term.normal));
      } else if (term.chunk === 'Verb') {
        out.push(cli.green(term.implicit || term.normal));
      } else if (term.chunk === 'Adjective') {
        out.push(cli.yellow(term.implicit || term.normal));
      } else if (term.chunk === 'Pivot') {
        out.push(cli.red(term.implicit || term.normal));
      } else {
        out.push(term.implicit || term.normal);
      }
    });
    console.log(out.join(' '), '\n');
  });
  console.log('\n');
};

/* eslint-disable no-console */

const split$1 = (txt, offset, index) => {
  const buff = index * 9; //there are 9 new chars addded to each highlight
  const start = offset.start + buff;
  const end = start + offset.length;
  const pre = txt.substring(0, start);
  const mid = txt.substring(start, end);
  const post = txt.substring(end, txt.length);
  return [pre, mid, post]
};

const spliceIn = function (txt, offset, index) {
  const parts = split$1(txt, offset, index);
  return `${parts[0]}${cli.blue(parts[1])}${parts[2]}`
};

const showHighlight = function (doc) {
  if (!doc.found) {
    return
  }
  const bySentence = {};
  doc.fullPointer.forEach(ptr => {
    bySentence[ptr[0]] = bySentence[ptr[0]] || [];
    bySentence[ptr[0]].push(ptr);
  });
  Object.keys(bySentence).forEach(k => {
    const full = doc.update([[Number(k)]]);
    let txt = full.text();
    const matches = doc.update(bySentence[k]);
    const json = matches.json({ offset: true });
    json.forEach((obj, i) => {
      txt = spliceIn(txt, obj.offset, i);
    });
    console.log(txt);
  });
  console.log('\n');
};

const debug = {
  tags: showTags,
  clientSide: logClientSide,
  chunks: showChunks,
  highlight: showHighlight,
};

var output = {
  api: addAPI$1,
  methods: {
    one: {
      hash: md5,
      debug,
    },
  },
};

// do the pointers intersect?
const doesOverlap = function (a, b) {
  if (a[0] !== b[0]) {
    return false
  }
  const [, startA, endA] = a;
  const [, startB, endB] = b;
  // [a,a,a,-,-,-,]
  // [-,-,b,b,b,-,]
  if (startA <= startB && endA > startB) {
    return true
  }
  // [-,-,-,a,a,-,]
  // [-,-,b,b,b,-,]
  if (startB <= startA && endB > startA) {
    return true
  }
  return false
};

// get widest min/max
const getExtent = function (ptrs) {
  let min = ptrs[0][1];
  let max = ptrs[0][2];
  ptrs.forEach(ptr => {
    if (ptr[1] < min) {
      min = ptr[1];
    }
    if (ptr[2] > max) {
      max = ptr[2];
    }
  });
  return [ptrs[0][0], min, max]
};

// collect pointers by sentence number
const indexN = function (ptrs) {
  const byN = {};
  ptrs.forEach(ref => {
    byN[ref[0]] = byN[ref[0]] || [];
    byN[ref[0]].push(ref);
  });
  return byN
};

// remove exact duplicates
const uniquePtrs = function (arr) {
  const obj = {};
  for (let i = 0; i < arr.length; i += 1) {
    obj[arr[i].join(',')] = arr[i];
  }
  return Object.values(obj)
};

// a before b
// console.log(doesOverlap([0, 0, 4], [0, 2, 5]))
// // b before a
// console.log(doesOverlap([0, 3, 4], [0, 1, 5]))
// // disjoint
// console.log(doesOverlap([0, 0, 3], [0, 4, 5]))
// neighbours
// console.log(doesOverlap([0, 1, 3], [0, 3, 5]))
// console.log(doesOverlap([0, 3, 5], [0, 1, 3]))

// console.log(
//   getExtent([
//     [0, 3, 4],
//     [0, 4, 5],
//     [0, 1, 2],
//   ])
// )

// split a pointer, by match pointer
const pivotBy = function (full, m) {
  const [n, start] = full;
  const mStart = m[1];
  const mEnd = m[2];
  const res = {};
  // is there space before the match?
  if (start < mStart) {
    const end = mStart < full[2] ? mStart : full[2]; // find closest end-point
    res.before = [n, start, end]; //before segment
  }
  res.match = m;
  // is there space after the match?
  if (full[2] > mEnd) {
    res.after = [n, mEnd, full[2]]; //after segment
  }
  return res
};

const doesMatch = function (full, m) {
  return full[1] <= m[1] && m[2] <= full[2]
};

const splitAll = function (full, m) {
  const byN = indexN(m);
  const res = [];
  full.forEach(ptr => {
    const [n] = ptr;
    let matches = byN[n] || [];
    matches = matches.filter(p => doesMatch(ptr, p));
    if (matches.length === 0) {
      res.push({ passthrough: ptr });
      return
    }
    // ensure matches are in-order
    matches = matches.sort((a, b) => a[1] - b[1]);
    // start splitting our left-to-right
    let carry = ptr;
    matches.forEach((p, i) => {
      const found = pivotBy(carry, p);
      // last one
      if (!matches[i + 1]) {
        res.push(found);
      } else {
        res.push({ before: found.before, match: found.match });
        if (found.after) {
          carry = found.after;
        }
      }
    });
  });
  return res
};

const max$1 = 20;

// sweep-around looking for our start term uuid
const blindSweep = function (id, doc, n) {
  for (let i = 0; i < max$1; i += 1) {
    // look up a sentence
    if (doc[n - i]) {
      const index = doc[n - i].findIndex(term => term.id === id);
      if (index !== -1) {
        return [n - i, index]
      }
    }
    // look down a sentence
    if (doc[n + i]) {
      const index = doc[n + i].findIndex(term => term.id === id);
      if (index !== -1) {
        return [n + i, index]
      }
    }
  }
  return null
};

const repairEnding = function (ptr, document) {
  const [n, start, , , endId] = ptr;
  const terms = document[n];
  // look for end-id
  const newEnd = terms.findIndex(t => t.id === endId);
  if (newEnd === -1) {
    // if end-term wasn't found, so go all the way to the end
    ptr[2] = document[n].length;
    ptr[4] = terms.length ? terms[terms.length - 1].id : null;
  } else {
    ptr[2] = newEnd; // repair ending pointer
  }
  return document[n].slice(start, ptr[2] + 1)
};

/** return a subset of the document, from a pointer */
const getDoc$1 = function (ptrs, document) {
  let doc = [];
  ptrs.forEach((ptr, i) => {
    if (!ptr) {
      return
    }
    // eslint-disable-next-line prefer-const
    let [n, start, end, id, endId] = ptr; //parsePointer(ptr)
    let terms = document[n] || [];
    if (start === undefined) {
      start = 0;
    }
    if (end === undefined) {
      end = terms.length;
    }
    if (id && (!terms[start] || terms[start].id !== id)) {
      // console.log('  repairing pointer...')
      const wild = blindSweep(id, document, n);
      if (wild !== null) {
        const len = end - start;
        terms = document[wild[0]].slice(wild[1], wild[1] + len);
        // actually change the pointer
        const startId = terms[0] ? terms[0].id : null;
        ptrs[i] = [wild[0], wild[1], wild[1] + len, startId];
      }
    } else {
      terms = terms.slice(start, end);
    }
    if (terms.length === 0) {
      return
    }
    if (start === end) {
      return
    }
    // test end-id, if it exists
    if (endId && terms[terms.length - 1].id !== endId) {
      terms = repairEnding(ptr, document);
    }
    // otherwise, looks good!
    doc.push(terms);
  });
  doc = doc.filter(a => a.length > 0);
  return doc
};

// flat list of terms from nested document
const termList = function (docs) {
  const arr = [];
  for (let i = 0; i < docs.length; i += 1) {
    for (let t = 0; t < docs[i].length; t += 1) {
      arr.push(docs[i][t]);
    }
  }
  return arr
};

var methods$7 = {
  one: {
    termList,
    getDoc: getDoc$1,
    pointer: {
      indexN,
      splitAll,
    }
  },
};

// a union is a + b, minus duplicates
const getUnion = function (a, b) {
  const both = a.concat(b);
  const byN = indexN(both);
  let res = [];
  both.forEach(ptr => {
    const [n] = ptr;
    if (byN[n].length === 1) {
      // we're alone on this sentence, so we're good
      res.push(ptr);
      return
    }
    // there may be overlaps
    const hmm = byN[n].filter(m => doesOverlap(ptr, m));
    hmm.push(ptr);
    const range = getExtent(hmm);
    res.push(range);
  });
  res = uniquePtrs(res);
  return res
};

// two disjoint
// console.log(getUnion([[1, 3, 4]], [[0, 1, 2]]))
// two disjoint
// console.log(getUnion([[0, 3, 4]], [[0, 1, 2]]))
// overlap-plus
// console.log(getUnion([[0, 1, 4]], [[0, 2, 6]]))
// overlap
// console.log(getUnion([[0, 1, 4]], [[0, 2, 3]]))
// neighbours
// console.log(getUnion([[0, 1, 3]], [[0, 3, 5]]))

const subtract = function (refs, not) {
  const res = [];
  const found = splitAll(refs, not);
  found.forEach(o => {
    if (o.passthrough) {
      res.push(o.passthrough);
    }
    if (o.before) {
      res.push(o.before);
    }
    if (o.after) {
      res.push(o.after);
    }
  });
  return res
};

// console.log(subtract([[0, 0, 2]], [[0, 0, 1]]))
// console.log(subtract([[0, 0, 2]], [[0, 1, 2]]))

// [a,a,a,a,-,-,]
// [-,-,b,b,b,-,]
// [-,-,x,x,-,-,]
const intersection = function (a, b) {
  // find the latest-start
  const start = a[1] < b[1] ? b[1] : a[1];
  // find the earliest-end
  const end = a[2] > b[2] ? b[2] : a[2];
  // does it form a valid pointer?
  if (start < end) {
    return [a[0], start, end]
  }
  return null
};

const getIntersection = function (a, b) {
  const byN = indexN(b);
  const res = [];
  a.forEach(ptr => {
    let hmm = byN[ptr[0]] || [];
    hmm = hmm.filter(p => doesOverlap(ptr, p));
    // no sentence-pairs, so no intersection
    if (hmm.length === 0) {
      return
    }
    hmm.forEach(h => {
      const overlap = intersection(ptr, h);
      if (overlap) {
        res.push(overlap);
      }
    });
  });
  return res
};

// console.log(getIntersection([[0, 1, 3]], [[0, 2, 4]]))

const isArray$4 = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
};

const getDoc = (m, view) => {
  if (typeof m === 'string' || isArray$4(m)) {
    return view.match(m)
  }
  if (!m) {
    return view.none()
  }
  // support pre-parsed reg object
  return m
};

// 'harden' our json pointers, again
const addIds = function (ptrs, docs) {
  return ptrs.map(ptr => {
    const [n, start] = ptr;
    if (docs[n] && docs[n][start]) {
      ptr[3] = docs[n][start].id;
    }
    return ptr
  })
};

const methods$6 = {};

// all parts, minus duplicates
methods$6.union = function (m) {
  m = getDoc(m, this);
  let ptrs = getUnion(this.fullPointer, m.fullPointer);
  ptrs = addIds(ptrs, this.document);
  return this.toView(ptrs)
};
methods$6.and = methods$6.union;

// only parts they both have
methods$6.intersection = function (m) {
  m = getDoc(m, this);
  let ptrs = getIntersection(this.fullPointer, m.fullPointer);
  ptrs = addIds(ptrs, this.document);
  return this.toView(ptrs)
};

// only parts of a that b does not have
methods$6.not = function (m) {
  m = getDoc(m, this);
  let ptrs = subtract(this.fullPointer, m.fullPointer);
  ptrs = addIds(ptrs, this.document);
  return this.toView(ptrs)
};
methods$6.difference = methods$6.not;

// get opposite of a match
methods$6.complement = function () {
  const doc = this.all();
  let ptrs = subtract(doc.fullPointer, this.fullPointer);
  ptrs = addIds(ptrs, this.document);
  return this.toView(ptrs)
};

// remove overlaps
methods$6.settle = function () {
  let ptrs = this.fullPointer;
  ptrs.forEach(ptr => {
    ptrs = getUnion(ptrs, [ptr]);
  });
  ptrs = addIds(ptrs, this.document);
  return this.update(ptrs)
};

const addAPI = function (View) {
  // add set/intersection/union
  Object.assign(View.prototype, methods$6);
};

var pointers = {
  methods: methods$7,
  api: addAPI,
};

var lib$2 = {
  // compile a list of matches into a match-net
  buildNet: function (matches) {
    const methods = this.methods();
    const net = methods.one.buildNet(matches, this.world());
    net.isNet = true;
    return net
  }
};

const api$l = function (View) {

  /** speedy match a sequence of matches */
  View.prototype.sweep = function (net, opts = {}) {
    const { world, docs } = this;
    const { methods } = world;
    let found = methods.one.bulkMatch(docs, net, this.methods, opts);

    // apply any changes
    if (opts.tagger !== false) {
      methods.one.bulkTagger(found, docs, this.world);
    }
    // fix the pointers
    // collect all found results into a View
    found = found.map(o => {
      const ptr = o.pointer;
      const term = docs[ptr[0]][ptr[1]];
      const len = ptr[2] - ptr[1];
      if (term.index) {
        o.pointer = [
          term.index[0],
          term.index[1],
          ptr[1] + len
        ];
      }
      return o
    });
    const ptrs = found.map(o => o.pointer);
    // cleanup results a bit
    found = found.map(obj => {
      obj.view = this.update([obj.pointer]);
      delete obj.regs;
      delete obj.needs;
      delete obj.pointer;
      delete obj._expanded;
      return obj
    });
    return {
      view: this.update(ptrs),
      found
    }
  };

};

// extract the clear needs for an individual match token
const getTokenNeeds = function (reg) {
  // negatives can't be cached
  if (reg.optional === true || reg.negative === true) {
    return null
  }
  if (reg.tag) {
    return '#' + reg.tag
  }
  if (reg.word) {
    return reg.word
  }
  if (reg.switch) {
    return `%${reg.switch}%`
  }
  return null
};

const getNeeds = function (regs) {
  const needs = [];
  regs.forEach(reg => {
    needs.push(getTokenNeeds(reg));
    // support AND (foo && tag)
    if (reg.operator === 'and' && reg.choices) {
      reg.choices.forEach(oneSide => {
        oneSide.forEach(r => {
          needs.push(getTokenNeeds(r));
        });
      });
    }
  });
  return needs.filter(str => str)
};

const getWants = function (regs) {
  const wants = [];
  let count = 0;
  regs.forEach(reg => {
    if (reg.operator === 'or' && !reg.optional && !reg.negative) {
      // add fast-or terms
      if (reg.fastOr) {
        Array.from(reg.fastOr).forEach(w => {
          wants.push(w);
        });
      }
      // add slow-or
      if (reg.choices) {
        reg.choices.forEach(rs => {
          rs.forEach(r => {
            const n = getTokenNeeds(r);
            if (n) {
              wants.push(n);
            }
          });
        });
      }
      count += 1;
    }
  });
  return { wants, count }
};

const parse$5 = function (matches, world) {
  const parseMatch = world.methods.one.parseMatch;
  matches.forEach(obj => {
    obj.regs = parseMatch(obj.match, {}, world);
    // wrap these ifNo properties into an array
    if (typeof obj.ifNo === 'string') {
      obj.ifNo = [obj.ifNo];
    }
    if (obj.notIf) {
      obj.notIf = parseMatch(obj.notIf, {}, world);
    }
    // cache any requirements up-front 
    obj.needs = getNeeds(obj.regs);
    const { wants, count } = getWants(obj.regs);
    obj.wants = wants;
    obj.minWant = count;
    // get rid of tiny sentences
    obj.minWords = obj.regs.filter(o => !o.optional).length;
  });
  return matches
};

// do some indexing on the list of matches
const buildNet = function (matches, world) {
  // turn match-syntax into json
  matches = parse$5(matches, world);

  // collect by wants and needs
  const hooks = {};
  matches.forEach(obj => {
    // add needs
    obj.needs.forEach(str => {
      hooks[str] = Array.isArray(hooks[str]) ? hooks[str] : [];
      hooks[str].push(obj);
    });
    // add wants
    obj.wants.forEach(str => {
      hooks[str] = Array.isArray(hooks[str]) ? hooks[str] : [];
      hooks[str].push(obj);
    });
  });
  // remove duplicates
  Object.keys(hooks).forEach(k => {
    const already = {};
    hooks[k] = hooks[k].filter(obj => {
      if (typeof already[obj.match] === 'boolean') {
        return false
      }
      already[obj.match] = true;
      return true
    });
  });

  // keep all un-cacheable matches (those with no needs) 
  const always = matches.filter(o => o.needs.length === 0 && o.wants.length === 0);
  return {
    hooks,
    always
  }
};

// for each cached-sentence, find a list of possible matches
const getHooks = function (docCaches, hooks) {
  return docCaches.map((set, i) => {
    let maybe = [];
    Object.keys(hooks).forEach(k => {
      if (docCaches[i].has(k)) {
        maybe = maybe.concat(hooks[k]);
      }
    });
    // remove duplicates
    const already = {};
    maybe = maybe.filter(m => {
      if (typeof already[m.match] === 'boolean') {
        return false
      }
      already[m.match] = true;
      return true
    });
    return maybe
  })
};

// filter-down list of maybe-matches
const localTrim = function (maybeList, docCache) {
  return maybeList.map((list, n) => {
    const haves = docCache[n];
    // ensure all stated-needs of the match are met
    list = list.filter(obj => {
      return obj.needs.every(need => haves.has(need))
    });
    // ensure nothing matches in our 'ifNo' property
    list = list.filter(obj => {
      if (obj.ifNo !== undefined && obj.ifNo.some(no => haves.has(no)) === true) {
        return false
      }
      return true
    });
    // ensure atleast one(?) of the wants is found
    list = list.filter(obj => {
      if (obj.wants.length === 0) {
        return true
      }
      // ensure there's one cache-hit
      const found = obj.wants.filter(str => haves.has(str)).length;
      return found >= obj.minWant
    });
    return list
  })
};

// finally,
// actually run these match-statements on the terms
const runMatch = function (maybeList, document, docCache, methods, opts) {
  const results = [];
  for (let n = 0; n < maybeList.length; n += 1) {
    for (let i = 0; i < maybeList[n].length; i += 1) {
      const m = maybeList[n][i];
      // ok, actually do the work.
      const res = methods.one.match([document[n]], m);
      // found something.
      if (res.ptrs.length > 0) {
        res.ptrs.forEach(ptr => {
          ptr[0] = n; // fix the sentence pointer
          // check ifNo
          // if (m.ifNo !== undefined) {
          //   let terms = document[n].slice(ptr[1], ptr[2])
          //   for (let k = 0; k < m.ifNo.length; k += 1) {
          //     const no = m.ifNo[k]
          //     // quick-check cache
          //     if (docCache[n].has(no)) {
          //       if (no.startsWith('#')) {
          //         let tag = no.replace(/^#/, '')
          //         if (terms.find(t => t.tags.has(tag))) {
          //           console.log('+' + tag)
          //           return
          //         }
          //       } else if (terms.find(t => t.normal === no || t.tags.has(no))) {
          //         console.log('+' + no)
          //         return
          //       }
          //     }
          //   }
          // }
          const todo = Object.assign({}, m, { pointer: ptr });
          if (m.unTag !== undefined) {
            todo.unTag = m.unTag;
          }
          results.push(todo);
        });
        //ok cool, can we stop early?
        if (opts.matchOne === true) {
          return [results[0]]
        }
      }
    }
  }
  return results
};

const tooSmall = function (maybeList, document) {
  return maybeList.map((arr, i) => {
    const termCount = document[i].length;
    arr = arr.filter(o => {
      return termCount >= o.minWords
    });
    return arr
  })
};

const sweep$1 = function (document, net, methods, opts = {}) {
  // find suitable matches to attempt, on each sentence
  const docCache = methods.one.cacheDoc(document);
  // collect possible matches for this document
  let maybeList = getHooks(docCache, net.hooks);
  // ensure all defined needs are met for each match
  maybeList = localTrim(maybeList, docCache);
  // add unchacheable matches to each sentence's todo-list
  if (net.always.length > 0) {
    maybeList = maybeList.map(arr => arr.concat(net.always));
  }
  // if we don't have enough words
  maybeList = tooSmall(maybeList, document);

  // now actually run the matches
  const results = runMatch(maybeList, document, docCache, methods, opts);
  // console.dir(results, { depth: 5 })
  return results
};

// is this tag consistent with the tags they already have?
const canBe$1 = function (terms, tag, model) {
  const tagSet = model.one.tagSet;
  if (!tagSet.hasOwnProperty(tag)) {
    return true
  }
  const not = tagSet[tag].not || [];
  for (let i = 0; i < terms.length; i += 1) {
    const term = terms[i];
    for (let k = 0; k < not.length; k += 1) {
      if (term.tags.has(not[k]) === true) {
        return false //found a tag conflict - bail!
      }
    }
  }
  return true
};

const tagger$1 = function (list, document, world) {
  const { model, methods } = world;
  const { getDoc, setTag, unTag } = methods.one;
  const looksPlural = methods.two.looksPlural;
  if (list.length === 0) {
    return list
  }
  // some logging for debugging
  const env = typeof process === 'undefined' || !process.env ? self.env || {} : process.env;
  if (env.DEBUG_TAGS) {
    console.log(`\n\n  \x1b[32m→ ${list.length} post-tagger:\x1b[0m`); //eslint-disable-line
  }
  return list.map(todo => {
    if (!todo.tag && !todo.chunk && !todo.unTag) {
      return
    }
    const reason = todo.reason || todo.match;
    const terms = getDoc([todo.pointer], document)[0];
    // handle 'safe' tag
    if (todo.safe === true) {
      // check for conflicting tags
      if (canBe$1(terms, todo.tag, model) === false) {
        return
      }
      // dont tag half of a hyphenated word
      if (terms[terms.length - 1].post === '-') {
        return
      }
    }
    if (todo.tag !== undefined) {
      setTag(terms, todo.tag, world, todo.safe, `[post] '${reason}'`);
      // quick and dirty plural tagger 😕
      if (todo.tag === 'Noun' && looksPlural) {
        const term = terms[terms.length - 1];
        if (looksPlural(term.text)) {
          setTag([term], 'Plural', world, todo.safe, 'quick-plural');
        } else {
          setTag([term], 'Singular', world, todo.safe, 'quick-singular');
        }
      }
      // allow freezing this match, too
      if (todo.freeze === true) {
        terms.forEach(term => (term.frozen = true));
      }
    }
    if (todo.unTag !== undefined) {
      unTag(terms, todo.unTag, world, todo.safe, reason);
    }
    // allow setting chunks, too
    if (todo.chunk) {
      terms.forEach(t => (t.chunk = todo.chunk));
    }
  })
};

var methods$5 = {
  buildNet,
  bulkMatch: sweep$1,
  bulkTagger: tagger$1
};

var sweep = {
  lib: lib$2,
  api: api$l,
  methods: {
    one: methods$5,
  }
};

const isMulti = / /;

const addChunk = function (term, tag) {
  if (tag === 'Noun') {
    term.chunk = tag;
  }
  if (tag === 'Verb') {
    term.chunk = tag;
  }
};

const tagTerm = function (term, tag, tagSet, isSafe) {
  // does it already have this tag?
  if (term.tags.has(tag) === true) {
    return null
  }
  // allow this shorthand in multiple-tag strings
  if (tag === '.') {
    return null
  }
  // don't overwrite any tags, if term is frozen
  if (term.frozen === true) {
    isSafe = true;
  }
  // for known tags, do logical dependencies first
  const known = tagSet[tag];
  if (known) {
    // first, we remove any conflicting tags
    if (known.not && known.not.length > 0) {
      for (let o = 0; o < known.not.length; o += 1) {
        // if we're in tagSafe, skip this term.
        if (isSafe === true && term.tags.has(known.not[o])) {
          return null
        }
        term.tags.delete(known.not[o]);
      }
    }
    // add parent tags
    if (known.parents && known.parents.length > 0) {
      for (let o = 0; o < known.parents.length; o += 1) {
        term.tags.add(known.parents[o]);
        addChunk(term, known.parents[o]);
      }
    }
  }
  // finally, add our tag
  term.tags.add(tag);
  // now it's dirty?
  term.dirty = true;
  // add a chunk too, if it's easy
  addChunk(term, tag);
  return true
};

// support '#Noun . #Adjective' syntax
const multiTag = function (terms, tagString, tagSet, isSafe) {
  const tags = tagString.split(isMulti);
  terms.forEach((term, i) => {
    let tag = tags[i];
    if (tag) {
      tag = tag.replace(/^#/, '');
      tagTerm(term, tag, tagSet, isSafe);
    }
  });
};

const isArray$3 = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
};

// verbose-mode tagger debuging
const log$1 = (terms, tag, reason = '') => {
  const yellow = str => '\x1b[33m\x1b[3m' + str + '\x1b[0m';
  const i = str => '\x1b[3m' + str + '\x1b[0m';
  const word = terms
    .map(t => {
      return t.text || '[' + t.implicit + ']'
    })
    .join(' ');
  if (typeof tag !== 'string' && tag.length > 2) {
    tag = tag.slice(0, 2).join(', #') + ' +'; //truncate the list of tags
  }
  tag = typeof tag !== 'string' ? tag.join(', #') : tag;
  console.log(` ${yellow(word).padEnd(24)} \x1b[32m→\x1b[0m #${tag.padEnd(22)}  ${i(reason)}`); // eslint-disable-line
};

// add a tag to all these terms
const setTag = function (terms, tag, world = {}, isSafe, reason) {
  const tagSet = world.model.one.tagSet || {};
  if (!tag) {
    return
  }
  // some logging for debugging
  const env = typeof process === 'undefined' || !process.env ? self.env || {} : process.env;
  if (env && env.DEBUG_TAGS) {
    log$1(terms, tag, reason);
  }
  if (isArray$3(tag) === true) {
    tag.forEach(tg => setTag(terms, tg, world, isSafe));
    return
  }
  if (typeof tag !== 'string') {
    console.warn(`compromise: Invalid tag '${tag}'`); // eslint-disable-line
    return
  }
  tag = tag.trim();
  // support '#Noun . #Adjective' syntax
  if (isMulti.test(tag)) {
    multiTag(terms, tag, tagSet, isSafe);
    return
  }
  tag = tag.replace(/^#/, '');
  // let set = false
  for (let i = 0; i < terms.length; i += 1) {
    tagTerm(terms[i], tag, tagSet, isSafe);
  }
};

// remove this tag, and its children, from these terms
const unTag = function (terms, tag, tagSet) {
  tag = tag.trim().replace(/^#/, '');
  for (let i = 0; i < terms.length; i += 1) {
    const term = terms[i];
    // don't untag anything if term is frozen
    if (term.frozen === true) {
      continue
    }
    // support clearing all tags, with '*'
    if (tag === '*') {
      term.tags.clear();
      continue
    }
    // for known tags, do logical dependencies first
    const known = tagSet[tag];
    // removing #Verb should also remove #PastTense
    if (known && known.children.length > 0) {
      for (let o = 0; o < known.children.length; o += 1) {
        term.tags.delete(known.children[o]);
      }
    }
    term.tags.delete(tag);
  }
};

// quick check if this tag will require any untagging
const canBe = function (term, tag, tagSet) {
  if (!tagSet.hasOwnProperty(tag)) {
    return true // everything can be an unknown tag
  }
  const not = tagSet[tag].not || [];
  for (let i = 0; i < not.length; i += 1) {
    if (term.tags.has(not[i])) {
      return false
    }
  }
  return true
};

const e=function(e){return e.children=e.children||[],e._cache=e._cache||{},e.props=e.props||{},e._cache.parents=e._cache.parents||[],e._cache.children=e._cache.children||[],e},t=/^ *(#|\/\/)/,n$1=function(t){let n=t.trim().split(/->/),r=[];n.forEach((t=>{r=r.concat(function(t){if(!(t=t.trim()))return null;if(/^\[/.test(t)&&/\]$/.test(t)){let n=(t=(t=t.replace(/^\[/,"")).replace(/\]$/,"")).split(/,/);return n=n.map((e=>e.trim())).filter((e=>e)),n=n.map((t=>e({id:t}))),n}return [e({id:t})]}(t));})),r=r.filter((e=>e));let i=r[0];for(let e=1;e<r.length;e+=1)i.children.push(r[e]),i=r[e];return r[0]},r=(e,t)=>{let n=[],r=[e];for(;r.length>0;){let e=r.pop();n.push(e),e.children&&e.children.forEach((n=>{t&&t(e,n),r.push(n);}));}return n},i=e=>"[object Array]"===Object.prototype.toString.call(e),c=e=>(e=e||"").trim(),s$1=function(c=[]){return "string"==typeof c?function(r){let i=r.split(/\r?\n/),c=[];i.forEach((e=>{if(!e.trim()||t.test(e))return;let r=(e=>{const t=/^( {2}|\t)/;let n=0;for(;t.test(e);)e=e.replace(t,""),n+=1;return n})(e);c.push({indent:r,node:n$1(e)});}));let s=function(e){let t={children:[]};return e.forEach(((n,r)=>{0===n.indent?t.children=t.children.concat(n.node):e[r-1]&&function(e,t){let n=e[t].indent;for(;t>=0;t-=1)if(e[t].indent<n)return e[t];return e[0]}(e,r).node.children.push(n.node);})),t}(c);return s=e(s),s}(c):i(c)?function(t){let n={};t.forEach((e=>{n[e.id]=e;}));let r=e({});return t.forEach((t=>{if((t=e(t)).parent)if(n.hasOwnProperty(t.parent)){let e=n[t.parent];delete t.parent,e.children.push(t);}else console.warn(`[Grad] - missing node '${t.parent}'`);else r.children.push(t);})),r}(c):(r(s=c).forEach(e),s);var s;},h=e=>"[31m"+e+"[0m",o=e=>"[2m"+e+"[0m",l=function(e,t){let n="-> ";t&&(n=o("→ "));let i="";return r(e).forEach(((e,r)=>{let c=e.id||"";if(t&&(c=h(c)),0===r&&!e.id)return;let s=e._cache.parents.length;i+="    ".repeat(s)+n+c+"\n";})),i},a=function(e){let t=r(e);t.forEach((e=>{delete(e=Object.assign({},e)).children;}));let n=t[0];return n&&!n.id&&0===Object.keys(n.props).length&&t.shift(),t},p$3={text:l,txt:l,array:a,flat:a},d=function(e,t){return "nested"===t||"json"===t?e:"debug"===t?(console.log(l(e,true)),null):p$3.hasOwnProperty(t)?p$3[t](e):e},u=e=>{r(e,((e,t)=>{e.id&&(e._cache.parents=e._cache.parents||[],t._cache.parents=e._cache.parents.concat([e.id]));}));},f$1=(e,t)=>(Object.keys(t).forEach((n=>{if(t[n]instanceof Set){let r=e[n]||new Set;e[n]=new Set([...r,...t[n]]);}else {if((e=>e&&"object"==typeof e&&!Array.isArray(e))(t[n])){let r=e[n]||{};e[n]=Object.assign({},t[n],r);}else i(t[n])?e[n]=t[n].concat(e[n]||[]):void 0===e[n]&&(e[n]=t[n]);}})),e),j=/\//;let g$2 = class g{constructor(e={}){Object.defineProperty(this,"json",{enumerable:false,value:e,writable:true});}get children(){return this.json.children}get id(){return this.json.id}get found(){return this.json.id||this.json.children.length>0}props(e={}){let t=this.json.props||{};return "string"==typeof e&&(t[e]=true),this.json.props=Object.assign(t,e),this}get(t){if(t=c(t),!j.test(t)){let e=this.json.children.find((e=>e.id===t));return new g(e)}let n=((e,t)=>{let n=(e=>"string"!=typeof e?e:(e=e.replace(/^\//,"")).split(/\//))(t=t||"");for(let t=0;t<n.length;t+=1){let r=e.children.find((e=>e.id===n[t]));if(!r)return null;e=r;}return e})(this.json,t)||e({});return new g(n)}add(t,n={}){if(i(t))return t.forEach((e=>this.add(c(e),n))),this;t=c(t);let r=e({id:t,props:n});return this.json.children.push(r),new g(r)}remove(e){return e=c(e),this.json.children=this.json.children.filter((t=>t.id!==e)),this}nodes(){return r(this.json).map((e=>(delete(e=Object.assign({},e)).children,e)))}cache(){return (e=>{let t=r(e,((e,t)=>{e.id&&(e._cache.parents=e._cache.parents||[],e._cache.children=e._cache.children||[],t._cache.parents=e._cache.parents.concat([e.id]));})),n={};t.forEach((e=>{e.id&&(n[e.id]=e);})),t.forEach((e=>{e._cache.parents.forEach((t=>{n.hasOwnProperty(t)&&n[t]._cache.children.push(e.id);}));})),e._cache.children=Object.keys(n);})(this.json),this}list(){return r(this.json)}fillDown(){var e;return e=this.json,r(e,((e,t)=>{t.props=f$1(t.props,e.props);})),this}depth(){u(this.json);let e=r(this.json),t=e.length>1?1:0;return e.forEach((e=>{if(0===e._cache.parents.length)return;let n=e._cache.parents.length+1;n>t&&(t=n);})),t}out(e){return u(this.json),d(this.json,e)}debug(){return u(this.json),d(this.json,"debug"),this}};const _=function(e){let t=s$1(e);return new g$2(t)};_.prototype.plugin=function(e){e(this);};

// i just made these up
const colors = {
  Noun: 'blue',
  Verb: 'green',
  Negative: 'green',
  Date: 'red',
  Value: 'red',
  Adjective: 'magenta',
  Preposition: 'cyan',
  Conjunction: 'cyan',
  Determiner: 'cyan',
  Hyphenated: 'cyan',
  Adverb: 'cyan',
};

const getColor = function (node) {
  if (colors.hasOwnProperty(node.id)) {
    return colors[node.id]
  }
  if (colors.hasOwnProperty(node.is)) {
    return colors[node.is]
  }
  const found = node._cache.parents.find(c => colors[c]);
  return colors[found]
};

// convert tags to our final format
const fmt = function (nodes) {
  const res = {};
  nodes.forEach(node => {
    const { not, also, is, novel } = node.props;
    let parents = node._cache.parents;
    if (also) {
      parents = parents.concat(also);
    }
    res[node.id] = {
      is,
      not,
      novel,
      also,
      parents,
      children: node._cache.children,
      color: getColor(node)
    };
  });
  // lastly, add all children of all nots
  Object.keys(res).forEach(k => {
    const nots = new Set(res[k].not);
    res[k].not.forEach(not => {
      if (res[not]) {
        res[not].children.forEach(tag => nots.add(tag));
      }
    });
    res[k].not = Array.from(nots);
  });
  return res
};

const toArr = function (input) {
  if (!input) {
    return []
  }
  if (typeof input === 'string') {
    return [input]
  }
  return input
};

const addImplied = function (tags, already) {
  Object.keys(tags).forEach(k => {
    // support deprecated fmts
    if (tags[k].isA) {
      tags[k].is = tags[k].isA;
    }
    if (tags[k].notA) {
      tags[k].not = tags[k].notA;
    }
    // add any implicit 'is' tags
    if (tags[k].is && typeof tags[k].is === 'string') {
      if (!already.hasOwnProperty(tags[k].is) && !tags.hasOwnProperty(tags[k].is)) {
        tags[tags[k].is] = {};
      }
    }
    // add any implicit 'not' tags
    if (tags[k].not && typeof tags[k].not === 'string' && !tags.hasOwnProperty(tags[k].not)) {
      if (!already.hasOwnProperty(tags[k].not) && !tags.hasOwnProperty(tags[k].not)) {
        tags[tags[k].not] = {};
      }
    }
  });
  return tags
};


const validate = function (tags, already) {

  tags = addImplied(tags, already);

  // property validation
  Object.keys(tags).forEach(k => {
    tags[k].children = toArr(tags[k].children);
    tags[k].not = toArr(tags[k].not);
  });
  // not links are bi-directional
  // add any incoming not tags
  Object.keys(tags).forEach(k => {
    const nots = tags[k].not || [];
    nots.forEach(no => {
      if (tags[no] && tags[no].not) {
        tags[no].not.push(k);
      }
    });
  });
  return tags
};

// 'fill-down' parent logic inference
const compute$5 = function (allTags) {
  // setup graph-lib format
  const flatList = Object.keys(allTags).map(k => {
    const o = allTags[k];
    const props = { not: new Set(o.not), also: o.also, is: o.is, novel: o.novel };
    return { id: k, parent: o.is, props, children: [] }
  });
  const graph = _(flatList).cache().fillDown();
  return graph.out('array')
};

const fromUser = function (tags) {
  Object.keys(tags).forEach(k => {
    tags[k] = Object.assign({}, tags[k]);
    tags[k].novel = true;
  });
  return tags
};

const addTags$1 = function (tags, already) {
  // are these tags internal ones, or user-generated?
  if (Object.keys(already).length > 0) {
    tags = fromUser(tags);
  }
  tags = validate(tags, already);

  const allTags = Object.assign({}, already, tags);
  // do some basic setting-up
  // 'fill-down' parent logic
  const nodes = compute$5(allTags);
  // convert it to our final format
  const res = fmt(nodes);
  return res
};

var methods$4 = {
  one: {
    setTag,
    unTag,
    addTags: addTags$1,
    canBe,
  },
};

/* eslint no-console: 0 */
const isArray$2 = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
};
const fns$1 = {
  /** add a given tag, to all these terms */
  tag: function (input, reason = '', isSafe) {
    if (!this.found || !input) {
      return this
    }
    const terms = this.termList();
    if (terms.length === 0) {
      return this
    }
    const { methods, verbose, world } = this;
    // logger
    if (verbose === true) {
      console.log(' +  ', input, reason || '');
    }
    if (isArray$2(input)) {
      input.forEach(tag => methods.one.setTag(terms, tag, world, isSafe, reason));
    } else {
      methods.one.setTag(terms, input, world, isSafe, reason);
    }
    // uncache
    this.uncache();
    return this
  },

  /** add a given tag, only if it is consistent */
  tagSafe: function (input, reason = '') {
    return this.tag(input, reason, true)
  },

  /** remove a given tag from all these terms */
  unTag: function (input, reason) {
    if (!this.found || !input) {
      return this
    }
    const terms = this.termList();
    if (terms.length === 0) {
      return this
    }
    const { methods, verbose, model } = this;
    // logger
    if (verbose === true) {
      console.log(' -  ', input, reason || '');
    }
    const tagSet = model.one.tagSet;
    if (isArray$2(input)) {
      input.forEach(tag => methods.one.unTag(terms, tag, tagSet));
    } else {
      methods.one.unTag(terms, input, tagSet);
    }
    // uncache
    this.uncache();
    return this
  },

  /** return only the terms that can be this tag  */
  canBe: function (tag) {
    tag = tag.replace(/^#/, '');
    const tagSet = this.model.one.tagSet;
    const canBe = this.methods.one.canBe;
    const nope = [];
    this.document.forEach((terms, n) => {
      terms.forEach((term, i) => {
        if (!canBe(term, tag, tagSet)) {
          nope.push([n, i, i + 1]);
        }
      });
    });
    const noDoc = this.update(nope);
    return this.difference(noDoc)
  },
};

const tagAPI = function (View) {
  Object.assign(View.prototype, fns$1);
};

// wire-up more pos-tags to our model
const addTags = function (tags) {
  const { model, methods } = this.world();
  const tagSet = model.one.tagSet;
  const fn = methods.one.addTags;
  const res = fn(tags, tagSet);
  model.one.tagSet = res;
  return this
};

var lib$1 = { addTags };

const boringTags = new Set(['Auxiliary', 'Possessive']);

const sortByKids = function (tags, tagSet) {
  tags = tags.sort((a, b) => {
    // (unknown tags are interesting)
    if (boringTags.has(a) || !tagSet.hasOwnProperty(b)) {
      return 1
    }
    if (boringTags.has(b) || !tagSet.hasOwnProperty(a)) {
      return -1
    }
    let kids = tagSet[a].children || [];
    const aKids = kids.length;
    kids = tagSet[b].children || [];
    const bKids = kids.length;
    return aKids - bKids
  });
  return tags
};

const tagRank = function (view) {
  const { document, world } = view;
  const tagSet = world.model.one.tagSet;
  document.forEach(terms => {
    terms.forEach(term => {
      const tags = Array.from(term.tags);
      term.tagRank = sortByKids(tags, tagSet);
    });
  });
};

var tag = {
  model: {
    one: { tagSet: {} }
  },
  compute: {
    tagRank
  },
  methods: methods$4,
  api: tagAPI,
  lib: lib$1
};

// split by periods, question marks, unicode ⁇, etc
const initSplit = /([.!?\u203D\u2E18\u203C\u2047-\u2049\u3002]+\s)/g;
// merge these back into prev sentence
const splitsOnly = /^[.!?\u203D\u2E18\u203C\u2047-\u2049\u3002]+\s$/;
const newLine = /((?:\r?\n|\r)+)/; // Match different new-line formats

// Start with a regex:
const basicSplit = function (text) {
  const all = [];
  //first, split by newline
  const lines = text.split(newLine);
  for (let i = 0; i < lines.length; i++) {
    //split by period, question-mark, and exclamation-mark
    const arr = lines[i].split(initSplit);
    for (let o = 0; o < arr.length; o++) {
      // merge 'foo' + '.'
      if (arr[o + 1] && splitsOnly.test(arr[o + 1]) === true) {
        arr[o] += arr[o + 1];
        arr[o + 1] = '';
      }
      if (arr[o] !== '') {
        all.push(arr[o]);
      }
    }
  }
  return all
};

const hasLetter$1 = /[a-z0-9\u00C0-\u00FF\u00a9\u00ae\u2000-\u3300\ud000-\udfff]/i;
const hasSomething$1 = /\S/;

const notEmpty = function (splits) {
  const chunks = [];
  for (let i = 0; i < splits.length; i++) {
    const s = splits[i];
    if (s === undefined || s === '') {
      continue
    }
    //this is meaningful whitespace
    if (hasSomething$1.test(s) === false || hasLetter$1.test(s) === false) {
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
    //else, only whitespace, no terms, no sentence
    chunks.push(s);
  }
  return chunks
};

const hasNewline = function (c) {
  return Boolean(c.match(/\n$/))
};

//loop through these chunks, and join the non-sentence chunks back together..
const smartMerge = function (chunks, world) {
  const isSentence = world.methods.one.tokenize.isSentence;
  const abbrevs = world.model.one.abbreviations || new Set();

  const sentences = [];
  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i];
    //should this chunk be combined with the next one?
    if (chunks[i + 1] && !isSentence(c, abbrevs) && !hasNewline(c)) {
      chunks[i + 1] = c + (chunks[i + 1] || '');
    } else if (c && c.length > 0) {
      //this chunk is a proper sentence..
      sentences.push(c);
      chunks[i] = '';
    }
  }
  return sentences
};

/* eslint-disable regexp/no-dupe-characters-character-class */

// merge embedded quotes into 1 sentence
// like - 'he said "no!" and left.'
const MAX_QUOTE = 280;// ¯\_(ツ)_/¯

// don't support single-quotes for multi-sentences
const pairs$1 = {
  '\u0022': '\u0022', // 'StraightDoubleQuotes'
  '\uFF02': '\uFF02', // 'StraightDoubleQuotesWide'
  // '\u0027': '\u0027', // 'StraightSingleQuotes'
  '\u201C': '\u201D', // 'CommaDoubleQuotes'
  // '\u2018': '\u2019', // 'CommaSingleQuotes'
  '\u201F': '\u201D', // 'CurlyDoubleQuotesReversed'
  // '\u201B': '\u2019', // 'CurlySingleQuotesReversed'
  '\u201E': '\u201D', // 'LowCurlyDoubleQuotes'
  '\u2E42': '\u201D', // 'LowCurlyDoubleQuotesReversed'
  '\u201A': '\u2019', // 'LowCurlySingleQuotes'
  '\u00AB': '\u00BB', // 'AngleDoubleQuotes'
  '\u2039': '\u203A', // 'AngleSingleQuotes'
  '\u2035': '\u2032', // 'PrimeSingleQuotes'
  '\u2036': '\u2033', // 'PrimeDoubleQuotes'
  '\u2037': '\u2034', // 'PrimeTripleQuotes'
  '\u301D': '\u301E', // 'PrimeDoubleQuotes'
  // '\u0060': '\u00B4', // 'PrimeSingleQuotes'
  '\u301F': '\u301E', // 'LowPrimeDoubleQuotesReversed'
};
const openQuote = RegExp('[' + Object.keys(pairs$1).join('') + ']', 'g');
const closeQuote = RegExp('[' + Object.values(pairs$1).join('') + ']', 'g');

const closesQuote = function (str) {
  if (!str) {
    return false
  }
  const m = str.match(closeQuote);
  if (m !== null && m.length === 1) {
    return true
  }
  return false
};

// allow micro-sentences when inside a quotation, like:
// the doc said "no sir. i will not beg" and walked away.
const quoteMerge = function (splits) {
  const arr = [];
  for (let i = 0; i < splits.length; i += 1) {
    const split = splits[i];
    // do we have an open-quote and not a closed one?
    const m = split.match(openQuote);
    if (m !== null && m.length === 1) {

      // look at the next sentence for a closing quote,
      if (closesQuote(splits[i + 1]) && splits[i + 1].length < MAX_QUOTE) {
        splits[i] += splits[i + 1];// merge them
        arr.push(splits[i]);
        splits[i + 1] = '';
        i += 1;
        continue
      }
      // look at n+2 for a closing quote,
      if (closesQuote(splits[i + 2])) {
        const toAdd = splits[i + 1] + splits[i + 2];// merge them all
        //make sure it's not too-long
        if (toAdd.length < MAX_QUOTE) {
          splits[i] += toAdd;
          arr.push(splits[i]);
          splits[i + 1] = '';
          splits[i + 2] = '';
          i += 2;
          continue
        }
      }
    }
    arr.push(splits[i]);
  }
  return arr
};

const MAX_LEN = 250;// ¯\_(ツ)_/¯

// support unicode variants?
// https://stackoverflow.com/questions/13535172/list-of-all-unicodes-open-close-brackets
const hasOpen$2 = /\(/g;
const hasClosed$2 = /\)/g;
const mergeParens = function (splits) {
  const arr = [];
  for (let i = 0; i < splits.length; i += 1) {
    const split = splits[i];
    const m = split.match(hasOpen$2);
    if (m !== null && m.length === 1) {
      // look at next sentence, for closing parenthesis
      if (splits[i + 1] && splits[i + 1].length < MAX_LEN) {
        const m2 = splits[i + 1].match(hasClosed$2);
        if (m2 !== null && m.length === 1 && !hasOpen$2.test(splits[i + 1])) {
          // merge in 2nd sentence
          splits[i] += splits[i + 1];
          arr.push(splits[i]);
          splits[i + 1] = '';
          i += 1;
          continue
        }
      }
    }
    arr.push(splits[i]);
  }
  return arr
};

//(Rule-based sentence boundary segmentation) - chop given text into its proper sentences.
// Ignore periods/questions/exclamations used in acronyms/abbreviations/numbers, etc.
//regs-
const hasSomething = /\S/;
const startWhitespace = /^\s+/;

const splitSentences = function (text, world) {
  text = text || '';
  text = String(text);
  // Ensure it 'smells like' a sentence
  if (!text || typeof text !== 'string' || hasSomething.test(text) === false) {
    return []
  }
  // cleanup unicode-spaces
  text = text.replace('\xa0', ' ');
  // First do a greedy-split..
  const splits = basicSplit(text);
  // Filter-out the crap ones
  let sentences = notEmpty(splits);
  //detection of non-sentence chunks:
  sentences = smartMerge(sentences, world);
  // allow 'he said "no sir." and left.'
  sentences = quoteMerge(sentences);
  // allow 'i thought (no way!) and left.'
  sentences = mergeParens(sentences);
  //if we never got a sentence, return the given text
  if (sentences.length === 0) {
    return [text]
  }
  //move whitespace to the ends of sentences, when possible
  //['hello',' world'] -> ['hello ','world']
  for (let i = 1; i < sentences.length; i += 1) {
    const ws = sentences[i].match(startWhitespace);
    if (ws !== null) {
      sentences[i - 1] += ws[0];
      sentences[i] = sentences[i].replace(startWhitespace, '');
    }
  }
  return sentences
};

const hasHyphen = function (str, model) {
  const parts = str.split(/[-–—]/);
  if (parts.length <= 1) {
    return false
  }
  const { prefixes, suffixes } = model.one;

  // l-theanine, x-ray
  if (parts[0].length === 1 && /[a-z]/i.test(parts[0])) {
    return false
  }
  //dont split 're-do'
  if (prefixes.hasOwnProperty(parts[0])) {
    return false
  }
  //dont split 'flower-like'
  parts[1] = parts[1].trim().replace(/[.?!]$/, '');
  if (suffixes.hasOwnProperty(parts[1])) {
    return false
  }
  //letter-number 'aug-20'
  const reg = /^([a-z\u00C0-\u00FF`"'/]+)[-–—]([a-z0-9\u00C0-\u00FF].*)/i;
  if (reg.test(str) === true) {
    return true
  }
  //number-letter '20-aug'
  const reg2 = /^[('"]?([0-9]{1,4})[-–—]([a-z\u00C0-\u00FF`"'/-]+[)'"]?$)/i;
  if (reg2.test(str) === true) {
    return true
  }
  return false
};

const splitHyphens = function (word) {
  const arr = [];
  //support multiple-hyphenated-terms
  const hyphens = word.split(/[-–—]/);
  let whichDash = '-';
  const found = word.match(/[-–—]/);
  if (found && found[0]) {
    whichDash = found;
  }
  for (let o = 0; o < hyphens.length; o++) {
    if (o === hyphens.length - 1) {
      arr.push(hyphens[o]);
    } else {
      arr.push(hyphens[o] + whichDash);
    }
  }
  return arr
};

// combine '2 - 5' like '2-5' is
// 2-4: 2, 4
const combineRanges = function (arr) {
  const startRange = /^[0-9]{1,4}(:[0-9][0-9])?([a-z]{1,2})? ?[-–—] ?$/;
  const endRange = /^[0-9]{1,4}([a-z]{1,2})? ?$/;
  for (let i = 0; i < arr.length - 1; i += 1) {
    if (arr[i + 1] && startRange.test(arr[i]) && endRange.test(arr[i + 1])) {
      arr[i] = arr[i] + arr[i + 1];
      arr[i + 1] = null;
    }
  }
  return arr
};

const isSlash = /\p{L} ?\/ ?\p{L}+$/u;

// 'he / she' should be one word
const combineSlashes = function (arr) {
  for (let i = 1; i < arr.length - 1; i++) {
    if (isSlash.test(arr[i])) {
      arr[i - 1] += arr[i] + arr[i + 1];
      arr[i] = null;
      arr[i + 1] = null;
    }
  }
  return arr
};

const wordlike = /\S/;
const isBoundary = /^[!?.]+$/;
const naiiveSplit = /(\S+)/;

let notWord = [
  '.',
  '?',
  '!',
  ':',
  ';',
  '-',
  '–',
  '—',
  '--',
  '...',
  '(',
  ')',
  '[',
  ']',
  '"',
  "'",
  '`',
  '«',
  '»',
  '*',
  '•',
];
notWord = notWord.reduce((h, c) => {
  h[c] = true;
  return h
}, {});

const isArray$1 = function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
};

//turn a string into an array of strings (naiive for now, lumped later)
const splitWords = function (str, model) {
  let result = [];
  let arr = [];
  //start with a naiive split
  str = str || '';
  if (typeof str === 'number') {
    str = String(str);
  }
  if (isArray$1(str)) {
    return str
  }
  const words = str.split(naiiveSplit);
  for (let i = 0; i < words.length; i++) {
    //split 'one-two'
    if (hasHyphen(words[i], model) === true) {
      arr = arr.concat(splitHyphens(words[i]));
      continue
    }
    arr.push(words[i]);
  }
  //greedy merge whitespace+arr to the right
  let carry = '';
  for (let i = 0; i < arr.length; i++) {
    const word = arr[i];
    //if it's more than a whitespace
    if (wordlike.test(word) === true && notWord.hasOwnProperty(word) === false && isBoundary.test(word) === false) {
      //put whitespace on end of previous term, if possible
      if (result.length > 0) {
        result[result.length - 1] += carry;
        result.push(word);
      } else {
        //otherwise, but whitespace before
        result.push(carry + word);
      }
      carry = '';
    } else {
      carry += word;
    }
  }
  //handle last one
  if (carry) {
    if (result.length === 0) {
      result[0] = '';
    }
    result[result.length - 1] += carry; //put it on the end
  }
  // combine 'one / two'
  result = combineSlashes(result);
  result = combineRanges(result);
  // remove empty results
  result = result.filter(s => s);
  return result
};

//all punctuation marks, from https://en.wikipedia.org/wiki/Punctuation

//we have slightly different rules for start/end - like #hashtags.
const isLetter = /\p{Letter}/u;
const isNumber = /[\p{Number}\p{Currency_Symbol}]/u;
const hasAcronym = /^[a-z]\.([a-z]\.)+/i;
const chillin = /[sn]['’]$/;

const normalizePunctuation = function (str, model) {
  // quick lookup for allowed pre/post punctuation
  const { prePunctuation, postPunctuation, emoticons } = model.one;
  let original = str;
  let pre = '';
  let post = '';
  const chars = Array.from(str);

  // punctuation-only words, like '<3'
  if (emoticons.hasOwnProperty(str.trim())) {
    return { str: str.trim(), pre, post: ' ' } //not great
  }

  // pop any punctuation off of the start
  let len = chars.length;
  for (let i = 0; i < len; i += 1) {
    const c = chars[0];
    // keep any declared chars
    if (prePunctuation[c] === true) {
      continue//keep it
    }
    // keep '+' or '-' only before a number
    if ((c === '+' || c === '-') && isNumber.test(chars[1])) {
      break//done
    }
    // '97 - year short-form
    if (c === "'" && c.length === 3 && isNumber.test(chars[1])) {
      break//done
    }
    // start of word
    if (isLetter.test(c) || isNumber.test(c)) {
      break //done
    }
    // punctuation
    pre += chars.shift();//keep going
  }

  // pop any punctuation off of the end
  len = chars.length;
  for (let i = 0; i < len; i += 1) {
    const c = chars[chars.length - 1];
    // keep any declared chars
    if (postPunctuation[c] === true) {
      continue//keep it
    }
    // start of word
    if (isLetter.test(c) || isNumber.test(c)) {
      break //done
    }
    // F.B.I.
    if (c === '.' && hasAcronym.test(original) === true) {
      continue//keep it
    }
    //  keep s-apostrophe - "flanders'" or "chillin'"
    if (c === "'" && chillin.test(original) === true) {
      continue//keep it
    }
    // punctuation
    post = chars.pop() + post;//keep going
  }
  str = chars.join('');
  //we went too far..
  if (str === '') {
    // do a very mild parse, and hope for the best.
    original = original.replace(/ *$/, after => {
      post = after || '';
      return ''
    });
    str = original;
    pre = '';
  }
  return { str, pre, post }
};

const parseTerm = (txt, model) => {
  // cleanup any punctuation as whitespace
  const { str, pre, post } = normalizePunctuation(txt, model);
  const parsed = {
    text: str,
    pre: pre,
    post: post,
    tags: new Set(),
  };
  return parsed
};

// 'Björk' to 'Bjork'.
const killUnicode = function (str, world) {
  const unicode = world.model.one.unicode || {};
  str = str || '';
  const chars = str.split('');
  chars.forEach((s, i) => {
    if (unicode[s]) {
      chars[i] = unicode[s];
    }
  });
  return chars.join('')
};

/** some basic operations on a string to reduce noise */
const clean = function (str) {
  str = str || '';
  str = str.toLowerCase();
  str = str.trim();
  const original = str;
  //punctuation
  str = str.replace(/[,;.!?]+$/, '');
  //coerce Unicode ellipses
  str = str.replace(/\u2026/g, '...');
  //en-dash
  str = str.replace(/\u2013/g, '-');
  //strip leading & trailing grammatical punctuation
  if (/^[:;]/.test(str) === false) {
    str = str.replace(/\.{3,}$/g, '');
    str = str.replace(/[",.!:;?)]+$/g, '');
    str = str.replace(/^['"(]+/g, '');
  }
  // remove zero-width characters
  str = str.replace(/[\u200B-\u200D\uFEFF]/g, '');
  //do this again..
  str = str.trim();
  //oh shucks,
  if (str === '') {
    str = original;
  }
  //no-commas in numbers
  str = str.replace(/([0-9]),([0-9])/g, '$1$2');
  return str
};

// do acronyms need to be ASCII?  ... kind of?
const periodAcronym$1 = /([A-Z]\.)+[A-Z]?,?$/;
const oneLetterAcronym$1 = /^[A-Z]\.,?$/;
const noPeriodAcronym$1 = /[A-Z]{2,}('s|,)?$/;
const lowerCaseAcronym$1 = /([a-z]\.)+[a-z]\.?$/;

const isAcronym$2 = function (str) {
  //like N.D.A
  if (periodAcronym$1.test(str) === true) {
    return true
  }
  //like c.e.o
  if (lowerCaseAcronym$1.test(str) === true) {
    return true
  }
  //like 'F.'
  if (oneLetterAcronym$1.test(str) === true) {
    return true
  }
  //like NDA
  if (noPeriodAcronym$1.test(str) === true) {
    return true
  }
  return false
};

const doAcronym = function (str) {
  if (isAcronym$2(str)) {
    str = str.replace(/\./g, '');
  }
  return str
};

const normalize$1 = function (term, world) {
  const killUnicode = world.methods.one.killUnicode;
  // console.log(world.methods.one)
  let str = term.text || '';
  str = clean(str);
  //(very) rough ASCII transliteration -  bjŏrk -> bjork
  str = killUnicode(str, world);
  str = doAcronym(str);
  term.normal = str;
};

// turn a string input into a 'document' json format
const parse$4 = function (input, world) {
  const { methods, model } = world;
  const { splitSentences, splitTerms, splitWhitespace } = methods.one.tokenize;
  input = input || '';
  // split into sentences
  const sentences = splitSentences(input, world);
  // split into word objects
  input = sentences.map((txt) => {
    let terms = splitTerms(txt, model);
    // split into [pre-text-post]
    terms = terms.map(t => splitWhitespace(t, model));
    // add normalized term format, always
    terms.forEach((t) => {
      normalize$1(t, world);
    });
    return terms
  });
  return input
};

const isAcronym$1 = /[ .][A-Z]\.? *$/i; //asci - 'n.s.a.'
const hasEllipse = /(?:\u2026|\.{2,}) *$/; // '...'
const hasLetter = /\p{L}/u;
const hasPeriod$1 = /\. *$/;
const leadInit = /^[A-Z]\. $/; // "W. Kensington"

/** does this look like a sentence? */
const isSentence = function (str, abbrevs) {
  // must have a letter
  if (hasLetter.test(str) === false) {
    return false
  }
  // check for 'F.B.I.'
  if (isAcronym$1.test(str) === true) {
    return false
  }
  // check for leading initial - "W. Kensington"
  if (str.length === 3 && leadInit.test(str)) {
    return false
  }
  //check for '...'
  if (hasEllipse.test(str) === true) {
    return false
  }
  const txt = str.replace(/[.!?\u203D\u2E18\u203C\u2047-\u2049] *$/, '');
  const words = txt.split(' ');
  const lastWord = words[words.length - 1].toLowerCase();
  // check for 'Mr.' (and not mr?)
  if (abbrevs.hasOwnProperty(lastWord) === true && hasPeriod$1.test(str) === true) {
    return false
  }
  // //check for jeopardy!
  // if (blacklist.hasOwnProperty(lastWord)) {
  //   return false
  // }
  return true
};

var methods$3 = {
  one: {
    killUnicode,
    tokenize: {
      splitSentences,
      isSentence,
      splitTerms: splitWords,
      splitWhitespace: parseTerm,
      fromString: parse$4,
    },
  },
};

const aliases$1 = {
  '&': 'and',
  '@': 'at',
  '%': 'percent',
  'plz': 'please',
  'bein': 'being',
};

var misc$6 = [
  'approx',
  'apt',
  'bc',
  'cyn',
  'eg',
  'esp',
  'est',
  'etc',
  'ex',
  'exp',
  'prob', //probably
  'pron', // Pronunciation
  'gal', //gallon
  'min',
  'pseud',
  'fig', //figure
  'jd',
  'lat', //latitude
  'lng', //longitude
  'vol', //volume
  'fm', //not am
  'def', //definition
  'misc',
  'plz', //please
  'ea', //each
  'ps',
  'sec', //second
  'pt',
  'pref', //preface
  'pl', //plural
  'pp', //pages
  'qt', //quarter
  'fr', //french
  'sq',
  'nee', //given name at birth
  'ss', //ship, or sections
  'tel',
  'temp',
  'vet',
  'ver', //version
  'fem', //feminine
  'masc', //masculine
  'eng', //engineering/english
  'adj', //adjective
  'vb', //verb
  'rb', //adverb
  'inf', //infinitive
  'situ', // in situ
  'vivo',
  'vitro',
  'wr', //world record
];

var honorifics$1 = [
  'adj',
  'adm',
  'adv',
  'asst',
  'atty',
  'bldg',
  'brig',
  'capt',
  'cmdr',
  'comdr',
  'cpl',
  'det',
  'dr',
  'esq',
  'gen',
  'gov',
  'hon',
  'jr',
  'llb',
  'lt',
  'maj',
  'messrs',
  'mlle',
  'mme',
  'mr',
  'mrs',
  'ms',
  'mstr',
  'phd',
  'prof',
  'pvt',
  'rep',
  'reps',
  'res',
  'rev',
  'sen',
  'sens',
  'sfc',
  'sgt',
  'sir',
  'sr',
  'supt',
  'surg'
  //miss
  //misses
];

var months = ['jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec'];

var nouns$3 = [
  'ad',
  'al',
  'arc',
  'ba',
  'bl',
  'ca',
  'cca',
  'col',
  'corp',
  'ft',
  'fy',
  'ie',
  'lit',
  'ma',
  'md',
  'pd',
  'tce',
];

var organizations = ['dept', 'univ', 'assn', 'bros', 'inc', 'ltd', 'co'];

var places$2 = [
  'rd',
  'st',
  'dist',
  'mt',
  'ave',
  'blvd',
  'cl',
  // 'ct',
  'cres',
  'hwy',
  //states
  'ariz',
  'cal',
  'calif',
  'colo',
  'conn',
  'fla',
  'fl',
  'ga',
  'ida',
  'ia',
  'kan',
  'kans',

  'minn',
  'neb',
  'nebr',
  'okla',
  'penna',
  'penn',
  'pa',
  'dak',
  'tenn',
  'tex',
  'ut',
  'vt',
  'va',
  'wis',
  'wisc',
  'wy',
  'wyo',
  'usafa',
  'alta',
  'ont',
  'que',
  'sask',
];

// units that are abbreviations too
var units = [
  'dl',
  'ml',
  'gal',
  // 'ft', //ambiguous
  'qt',
  'pt',
  'tbl',
  'tsp',
  'tbsp',
  'km',
  'dm', //decimeter
  'cm',
  'mm',
  'mi',
  'td',
  'hr', //hour
  'hrs', //hour
  'kg',
  'hg',
  'dg', //decigram
  'cg', //centigram
  'mg', //milligram
  'µg', //microgram
  'lb', //pound
  'oz', //ounce
  'sq ft',
  'hz', //hertz
  'mps', //meters per second
  'mph',
  'kmph', //kilometers per hour
  'kb', //kilobyte
  'mb', //megabyte
  // 'gb', //ambig
  'tb', //terabyte
  'lx', //lux
  'lm', //lumen
  // 'pa', //ambig
  'fl oz', //
  'yb',
];

// add our abbreviation list to our lexicon
const list$2 = [
  [misc$6],
  [units, 'Unit'],
  [nouns$3, 'Noun'],
  [honorifics$1, 'Honorific'],
  [months, 'Month'],
  [organizations, 'Organization'],
  [places$2, 'Place'],
];
// create key-val for sentence-tokenizer
const abbreviations = {};
// add them to a future lexicon
const lexicon$1 = {};

list$2.forEach(a => {
  a[0].forEach(w => {
    // sentence abbrevs
    abbreviations[w] = true;
    // future-lexicon
    lexicon$1[w] = 'Abbreviation';
    if (a[1] !== undefined) {
      lexicon$1[w] = [lexicon$1[w], a[1]];
    }
  });
});

// dashed prefixes that are not independent words
//  'mid-century', 'pre-history'
var prefixes$1 = [
  'anti',
  'bi',
  'co',
  'contra',
  'de',
  'extra',
  'infra',
  'inter',
  'intra',
  'macro',
  'micro',
  'mis',
  'mono',
  'multi',
  'peri',
  'pre',
  'pro',
  'proto',
  'pseudo',
  're',
  'sub',
  'supra',
  'trans',
  'tri',
  'un',
  'out', //out-lived
  'ex',//ex-wife

  // 'counter',
  // 'mid',
  // 'out',
  // 'non',
  // 'over',
  // 'post',
  // 'semi',
  // 'super', //'super-cool'
  // 'ultra', //'ulta-cool'
  // 'under',
  // 'whole',
].reduce((h, str) => {
  h[str] = true;
  return h
}, {});

// dashed suffixes that are not independent words
//  'flower-like', 'president-elect'
var suffixes$4 = {
  'like': true,
  'ish': true,
  'less': true,
  'able': true,
  'elect': true,
  'type': true,
  'designate': true,
  // 'fold':true,
};

//a hugely-ignorant, and widely subjective transliteration of latin, cryllic, greek unicode characters to english ascii.
//approximate visual (not semantic or phonetic) relationship between unicode and ascii characters
//http://en.wikipedia.org/wiki/List_of_Unicode_characters
//https://docs.google.com/spreadsheet/ccc?key=0Ah46z755j7cVdFRDM1A2YVpwa1ZYWlpJM2pQZ003M0E
const compact = {
  '!': '¡',
  '?': '¿Ɂ',
  '"': '“”"❝❞',
  "'": '‘‛❛❜’',
  '-': '—–',
  a: 'ªÀÁÂÃÄÅàáâãäåĀāĂăĄąǍǎǞǟǠǡǺǻȀȁȂȃȦȧȺΆΑΔΛάαλАаѦѧӐӑӒӓƛæ',
  b: 'ßþƀƁƂƃƄƅɃΒβϐϦБВЪЬвъьѢѣҌҍ',
  c: '¢©ÇçĆćĈĉĊċČčƆƇƈȻȼͻͼϲϹϽϾСсєҀҁҪҫ',
  d: 'ÐĎďĐđƉƊȡƋƌ',
  e: 'ÈÉÊËèéêëĒēĔĕĖėĘęĚěƐȄȅȆȇȨȩɆɇΈΕΞΣέεξϵЀЁЕеѐёҼҽҾҿӖӗễ',
  f: 'ƑƒϜϝӺӻҒғſ',
  g: 'ĜĝĞğĠġĢģƓǤǥǦǧǴǵ',
  h: 'ĤĥĦħƕǶȞȟΉΗЂЊЋНнђћҢңҤҥҺһӉӊ',
  I: 'ÌÍÎÏ',
  i: 'ìíîïĨĩĪīĬĭĮįİıƖƗȈȉȊȋΊΐΪίιϊІЇіїi̇',
  j: 'ĴĵǰȷɈɉϳЈј',
  k: 'ĶķĸƘƙǨǩΚκЌЖКжкќҚқҜҝҞҟҠҡ',
  l: 'ĹĺĻļĽľĿŀŁłƚƪǀǏǐȴȽΙӀӏ',
  m: 'ΜϺϻМмӍӎ',
  n: 'ÑñŃńŅņŇňŉŊŋƝƞǸǹȠȵΝΠήηϞЍИЙЛПийлпѝҊҋӅӆӢӣӤӥπ',
  o: 'ÒÓÔÕÖØðòóôõöøŌōŎŏŐőƟƠơǑǒǪǫǬǭǾǿȌȍȎȏȪȫȬȭȮȯȰȱΌΘΟθοσόϕϘϙϬϴОФоѲѳӦӧӨөӪӫ',
  p: 'ƤΡρϷϸϼРрҎҏÞ',
  q: 'Ɋɋ',
  r: 'ŔŕŖŗŘřƦȐȑȒȓɌɍЃГЯгяѓҐґ',
  s: 'ŚśŜŝŞşŠšƧƨȘșȿЅѕ',
  t: 'ŢţŤťŦŧƫƬƭƮȚțȶȾΓΤτϮТт',
  u: 'ÙÚÛÜùúûüŨũŪūŬŭŮůŰűŲųƯưƱƲǓǔǕǖǗǘǙǚǛǜȔȕȖȗɄΰυϋύ',
  v: 'νѴѵѶѷ',
  w: 'ŴŵƜωώϖϢϣШЩшщѡѿ',
  x: '×ΧχϗϰХхҲҳӼӽӾӿ',
  y: 'ÝýÿŶŷŸƳƴȲȳɎɏΎΥΫγψϒϓϔЎУучўѰѱҮүҰұӮӯӰӱӲӳ',
  z: 'ŹźŻżŽžƵƶȤȥɀΖ',
};
//decompress data into two hashes
const unicode = {};
Object.keys(compact).forEach(function (k) {
  compact[k].split('').forEach(function (s) {
    unicode[s] = k;
  });
});

// https://util.unicode.org/UnicodeJsps/list-unicodeset.jsp?a=%5Cp%7Bpunctuation%7D

// punctuation to keep at start of word
const prePunctuation = {
  '#': true, //#hastag
  '@': true, //@atmention
  '_': true,//underscore
  '°': true,
  // '+': true,//+4
  // '\\-',//-4  (escape)
  // '.',//.4
  // zero-width chars
  '\u200B': true,
  '\u200C': true,
  '\u200D': true,
  '\uFEFF': true
};

// punctuation to keep at end of word
const postPunctuation = {
  '%': true,//88%
  '_': true,//underscore
  '°': true,//degrees, italian ordinal
  // '\'',// sometimes
  // zero-width chars
  '\u200B': true,
  '\u200C': true,
  '\u200D': true,
  '\uFEFF': true
};

const emoticons$1 = {
  '<3': true,
  '</3': true,
  '<\\3': true,
  ':^P': true,
  ':^p': true,
  ':^O': true,
  ':^3': true,
};

var model$3 = {
  one: {
    aliases: aliases$1,
    abbreviations,
    prefixes: prefixes$1,
    suffixes: suffixes$4,
    prePunctuation,
    postPunctuation,
    lexicon: lexicon$1, //give this one forward
    unicode,
    emoticons: emoticons$1
  },
};

const hasSlash$1 = /\//;
const hasDomain = /[a-z]\.[a-z]/i;
const isMath = /[0-9]/;
// const hasSlash = /[a-z\u00C0-\u00FF] ?\/ ?[a-z\u00C0-\u00FF]/
// const hasApostrophe = /['’]s$/

const addAliases = function (term, world) {
  const str = term.normal || term.text || term.machine;
  const aliases = world.model.one.aliases;
  // lookup known aliases like '&'
  if (aliases.hasOwnProperty(str)) {
    term.alias = term.alias || [];
    term.alias.push(aliases[str]);
  }
  // support slashes as aliases
  if (hasSlash$1.test(str) && !hasDomain.test(str) && !isMath.test(str)) {
    const arr = str.split(hasSlash$1);
    // don't split urls and things
    if (arr.length <= 3) {
      arr.forEach(word => {
        word = word.trim();
        if (word !== '') {
          term.alias = term.alias || [];
          term.alias.push(word);
        }
      });
    }
  }
  // aliases for apostrophe-s
  // if (hasApostrophe.test(str)) {
  //   let main = str.replace(hasApostrophe, '').trim()
  //   term.alias = term.alias || []
  //   term.alias.push(main)
  // }
  return term
};

const hasDash = /^\p{Letter}+-\p{Letter}+$/u;
// 'machine' is a normalized form that looses human-readability
const doMachine = function (term) {
  let str = term.implicit || term.normal || term.text;
  // remove apostrophes
  str = str.replace(/['’]s$/, '');
  str = str.replace(/s['’]$/, 's');
  //lookin'->looking (make it easier for conjugation)
  str = str.replace(/([aeiou][ktrp])in'$/, '$1ing');
  //turn re-enactment to reenactment
  if (hasDash.test(str)) {
    str = str.replace(/-/g, '');
  }
  //#tags, @mentions
  str = str.replace(/^[#@]/, '');
  if (str !== term.normal) {
    term.machine = str;
  }
};

// sort words by frequency
const freq = function (view) {
  const docs = view.docs;
  const counts = {};
  for (let i = 0; i < docs.length; i += 1) {
    for (let t = 0; t < docs[i].length; t += 1) {
      const term = docs[i][t];
      const word = term.machine || term.normal;
      counts[word] = counts[word] || 0;
      counts[word] += 1;
    }
  }
  // add counts on each term
  for (let i = 0; i < docs.length; i += 1) {
    for (let t = 0; t < docs[i].length; t += 1) {
      const term = docs[i][t];
      const word = term.machine || term.normal;
      term.freq = counts[word];
    }
  }
};

// get all character startings in doc
const offset = function (view) {
  let elapsed = 0;
  let index = 0;
  const docs = view.document; //start from the actual-top
  for (let i = 0; i < docs.length; i += 1) {
    for (let t = 0; t < docs[i].length; t += 1) {
      const term = docs[i][t];
      term.offset = {
        index: index,
        start: elapsed + term.pre.length,
        length: term.text.length,
      };
      elapsed += term.pre.length + term.text.length + term.post.length;
      index += 1;
    }
  }
};

// cheat- add the document's pointer to the terms
const index = function (view) {
  // console.log('reindex')
  const document = view.document;
  for (let n = 0; n < document.length; n += 1) {
    for (let i = 0; i < document[n].length; i += 1) {
      document[n][i].index = [n, i];
    }
  }
  // let ptrs = b.fullPointer
  // console.log(ptrs)
  // for (let i = 0; i < docs.length; i += 1) {
  //   const [n, start] = ptrs[i]
  //   for (let t = 0; t < docs[i].length; t += 1) {
  //     let term = docs[i][t]
  //     term.index = [n, start + t]
  //   }
  // }
};

const wordCount = function (view) {
  let n = 0;
  const docs = view.docs;
  for (let i = 0; i < docs.length; i += 1) {
    for (let t = 0; t < docs[i].length; t += 1) {
      if (docs[i][t].normal === '') {
        continue //skip implicit words
      }
      n += 1;
      docs[i][t].wordCount = n;
    }
  }
};

// cheat-method for a quick loop
const termLoop$1 = function (view, fn) {
  const docs = view.docs;
  for (let i = 0; i < docs.length; i += 1) {
    for (let t = 0; t < docs[i].length; t += 1) {
      fn(docs[i][t], view.world);
    }
  }
};

const methods$2 = {
  alias: (view) => termLoop$1(view, addAliases),
  machine: (view) => termLoop$1(view, doMachine),
  normal: (view) => termLoop$1(view, normalize$1),
  freq,
  offset,
  index,
  wordCount,
};

var tokenize = {
  compute: methods$2,
  methods: methods$3,
  model: model$3,
  hooks: ['alias', 'machine', 'index', 'id'],
};

// const plugin = function (world) {
//   let { methods, model, parsers } = world
//   Object.assign({}, methods, _methods)
//   Object.assign(model, _model)
//   methods.one.tokenize.fromString = tokenize
//   parsers.push('normal')
//   parsers.push('alias')
//   parsers.push('machine')
//   // extend View class
//   // addMethods(View)
// }
// export default plugin

// lookup last word in the type-ahead prefixes
const typeahead$1 = function (view) {
  const prefixes = view.model.one.typeahead;
  const docs = view.docs;
  if (docs.length === 0 || Object.keys(prefixes).length === 0) {
    return
  }
  const lastPhrase = docs[docs.length - 1] || [];
  const lastTerm = lastPhrase[lastPhrase.length - 1];
  // if we've already put whitespace, end.
  if (lastTerm.post) {
    return
  }
  // if we found something
  if (prefixes.hasOwnProperty(lastTerm.normal)) {
    const found = prefixes[lastTerm.normal];
    // add full-word as an implicit result
    lastTerm.implicit = found;
    lastTerm.machine = found;
    lastTerm.typeahead = true;
    // tag it, as our assumed term
    if (view.compute.preTagger) {
      view.last().unTag('*').compute(['lexicon', 'preTagger']);
    }
  }
};

var compute$4 = { typeahead: typeahead$1 };

// assume any discovered prefixes
const autoFill = function () {
  const docs = this.docs;
  if (docs.length === 0) {
    return this
  }
  const lastPhrase = docs[docs.length - 1] || [];
  const term = lastPhrase[lastPhrase.length - 1];
  if (term.typeahead === true && term.machine) {
    term.text = term.machine;
    term.normal = term.machine;
  }
  return this
};

const api$k = function (View) {
  View.prototype.autoFill = autoFill;
};

// generate all the possible prefixes up-front
const getPrefixes = function (arr, opts, world) {
  let index = {};
  const collisions = [];
  const existing = world.prefixes || {};
  arr.forEach((str) => {
    str = str.toLowerCase().trim();
    let max = str.length;
    if (opts.max && max > opts.max) {
      max = opts.max;
    }
    for (let size = opts.min; size < max; size += 1) {
      const prefix = str.substring(0, size);
      // ensure prefix is not a word
      if (opts.safe && world.model.one.lexicon.hasOwnProperty(prefix)) {
        continue
      }
      // does it already exist?
      if (existing.hasOwnProperty(prefix) === true) {
        collisions.push(prefix);
        continue
      }
      if (index.hasOwnProperty(prefix) === true) {
        collisions.push(prefix);
        continue
      }
      index[prefix] = str;
    }
  });
  // merge with existing prefixes
  index = Object.assign({}, existing, index);
  // remove ambiguous-prefixes
  collisions.forEach((str) => {
    delete index[str];
  });
  return index
};

const isObject = val => {
  return Object.prototype.toString.call(val) === '[object Object]'
};

const defaults$2 = {
  safe: true,
  min: 3,
};

const prepare = function (words = [], opts = {}) {
  const model = this.model();
  opts = Object.assign({}, defaults$2, opts);
  if (isObject(words)) {
    Object.assign(model.one.lexicon, words);
    words = Object.keys(words);
  }
  const prefixes = getPrefixes(words, opts, this.world());
  // manually combine these with any existing prefixes
  Object.keys(prefixes).forEach(str => {
    // explode any overlaps
    if (model.one.typeahead.hasOwnProperty(str)) {
      delete model.one.typeahead[str];
      return
    }
    model.one.typeahead[str] = prefixes[str];
  });
  return this
};

var lib = {
  typeahead: prepare
};

const model$2 = {
  one: {
    typeahead: {} //set a blank key-val
  }
};
var typeahead = {
  model: model$2,
  api: api$k,
  lib,
  compute: compute$4,
  hooks: ['typeahead']
};

// order here matters
nlp.extend(change); //0kb
nlp.extend(output); //0kb
nlp.extend(match); //10kb
nlp.extend(pointers); //2kb
nlp.extend(tag); //2kb
nlp.plugin(plugin$4); //~6kb
nlp.extend(tokenize); //7kb
nlp.extend(freeze); //
nlp.plugin(cache$1); //~1kb
nlp.extend(lookup); //7kb
nlp.extend(typeahead); //1kb
nlp.extend(lexicon$2); //1kb
nlp.extend(sweep); //1kb

//nouns with irregular plural/singular forms
//used in nouns.toPlural(), and also in the lexicon.

var irregularPlurals = {
  // -a
  addendum: 'addenda',
  corpus: 'corpora',
  criterion: 'criteria',
  curriculum: 'curricula',
  genus: 'genera',
  memorandum: 'memoranda',
  opus: 'opera',
  ovum: 'ova',
  phenomenon: 'phenomena',
  referendum: 'referenda',

  // -ae
  alga: 'algae',
  alumna: 'alumnae',
  antenna: 'antennae',
  formula: 'formulae',
  larva: 'larvae',
  nebula: 'nebulae',
  vertebra: 'vertebrae',

  // -is
  analysis: 'analyses',
  axis: 'axes',
  diagnosis: 'diagnoses',
  parenthesis: 'parentheses',
  prognosis: 'prognoses',
  synopsis: 'synopses',
  thesis: 'theses',
  neurosis: 'neuroses',
  // -x
  appendix: 'appendices',
  index: 'indices',
  matrix: 'matrices',
  ox: 'oxen',
  sex: 'sexes',

  // -i
  alumnus: 'alumni',
  bacillus: 'bacilli',
  cactus: 'cacti',
  fungus: 'fungi',
  hippopotamus: 'hippopotami',
  libretto: 'libretti',
  modulus: 'moduli',
  nucleus: 'nuclei',
  octopus: 'octopi',
  radius: 'radii',
  stimulus: 'stimuli',
  syllabus: 'syllabi',

  // -ie
  cookie: 'cookies',
  calorie: 'calories',
  auntie: 'aunties',
  movie: 'movies',
  pie: 'pies',
  rookie: 'rookies',
  tie: 'ties',
  zombie: 'zombies',

  // -f
  leaf: 'leaves',
  loaf: 'loaves',
  thief: 'thieves',

  // ee-
  foot: 'feet',
  goose: 'geese',
  tooth: 'teeth',

  // -eaux
  beau: 'beaux',
  chateau: 'chateaux',
  tableau: 'tableaux',

  // -ses
  bus: 'buses',
  gas: 'gases',
  circus: 'circuses',
  crisis: 'crises',
  virus: 'viruses',
  database: 'databases',
  excuse: 'excuses',
  abuse: 'abuses',

  avocado: 'avocados',
  barracks: 'barracks',
  child: 'children',
  clothes: 'clothes',
  echo: 'echoes',
  embargo: 'embargoes',
  epoch: 'epochs',
  deer: 'deer',
  halo: 'halos',
  man: 'men',
  woman: 'women',
  mosquito: 'mosquitoes',
  mouse: 'mice',
  person: 'people',
  quiz: 'quizzes',
  rodeo: 'rodeos',
  shoe: 'shoes',
  sombrero: 'sombreros',
  stomach: 'stomachs',
  tornado: 'tornados',
  tuxedo: 'tuxedos',
  volcano: 'volcanoes',

};

// generated in ./lib/lexicon
var lexData = {
  "Comparative": "true¦bett1f0;arth0ew0in0;er",
  "Superlative": "true¦earlier",
  "PresentTense": "true¦bests,sounds",
  "Condition": "true¦lest,unless",
  "PastTense": "true¦began,came,d4had,kneel3l2m0sa4we1;ea0sg2;nt;eap0i0;ed;id",
  "Participle": "true¦0:09;a06b01cZdXeat0fSgQhPoJprov0rHs7t6u4w1;ak0ithdra02o2r1;i02uY;k0v0;nd1pr04;ergoJoJ;ak0hHo3;e9h7lain,o6p5t4un3w1;o1um;rn;g,k;ol0reS;iQok0;ught,wn;ak0o1runk;ne,wn;en,wn;ewriNi1uJ;dd0s0;ut3ver1;do4se0t1;ak0h2;do2g1;roG;ne;ast0i7;iv0o1;ne,tt0;all0loBor1;bi3g2s1;ak0e0;iv0o9;dd0;ove,r1;a5eamt,iv0;hos0lu1;ng;e4i3lo2ui1;lt;wn;tt0;at0en,gun;r2w1;ak0ok0;is0;en",
  "Gerund": "true¦accord0be0doin,go0result0stain0;ing",
  "Expression": "true¦a0Yb0Uc0Sd0Oe0Mfarew0Lg0FhZjeez,lWmVnToOpLsJtIuFvEw7y0;a5e3i1u0;ck,p;k04p0;ee,pee;a0p,s;!h;!a,h,y;a5h2o1t0;af,f;rd up,w;atsoever,e1o0;a,ops;e,w;hoo,t;ery w06oi0L;gh,h0;! 0h,m;huh,oh;here nPsk,ut tut;h0ic;eesh,hh,it,oo;ff,h1l0ow,sst;ease,s,z;ew,ooey;h1i,mg,o0uch,w,y;h,o,ps;! 0h;hTmy go0wT;d,sh;a7evertheless,o0;!pe;eh,mm;ah,eh,m1ol0;!s;ao,fao;aCeBi9o2u0;h,mph,rra0zzC;h,y;l1o0;r6y9;la,y0;! 0;c1moCsmok0;es;ow;!p hip hoor0;ay;ck,e,llo,y;ha1i,lleluj0;ah;!ha;ah,ee4o1r0;eat scott,r;l1od0sh; grief,bye;ly;! whiz;ell;e0h,t cetera,ureka,ww,xcuse me;k,p;'oh,a0rat,uh;m0ng;mit,n0;!it;mon,o0;ngratulations,wabunga;a2oo1r0tw,ye;avo,r;!ya;h,m; 1h0ka,las,men,rgh,ye;!a,em,h,oy;la",
  "Negative": "true¦n0;ever,o0;n,t",
  "QuestionWord": "true¦how3wh0;at,e1ich,o0y;!m,se;n,re; come,'s",
  "Reflexive": "true¦h4it5my5o1the0your2;ir1m1;ne3ur0;sel0;f,ves;er0im0;self",
  "Plural": "true¦dick0gre0ones,records;ens",
  "Unit|Noun": "true¦cEfDgChBinchAk9lb,m6newt5oz,p4qt,t1y0;ardEd;able1b0ea1sp;!l,sp;spo1;a,t,x;on9;!b,g,i1l,m,p0;h,s;!les;!b,elvin,g,m;!es;g,z;al,b;eet,oot,t;m,up0;!s",
  "Value": "true¦a few",
  "Imperative": "true¦bewa0come he0;re",
  "Plural|Verb": "true¦leaves",
  "Demonym": "true¦0:15;1:12;a0Vb0Oc0Dd0Ce08f07g04h02iYjVkTlPmLnIomHpEqatari,rCs7t5u4v3welAz2;am0Gimbabwe0;enezuel0ietnam0I;gAkrai1;aiwTex0hai,rinida0Ju2;ni0Prkmen;a5cotti4e3ingapoOlovak,oma0Spaniard,udRw2y0W;ede,iss;negal0Cr09;sh;mo0uT;o5us0Jw2;and0;a2eru0Fhilippi0Nortugu07uerto r0S;kist3lesti1na2raguay0;ma1;ani;ami00i2orweP;caragu0geri2;an,en;a3ex0Lo2;ngo0Drocc0;cedo1la2;gasy,y07;a4eb9i2;b2thua1;e0Cy0;o,t01;azakh,eny0o2uwaiI;re0;a2orda1;ma0Ap2;anO;celandic,nd4r2sraeli,ta01vo05;a2iB;ni0qi;i0oneU;aiAin2ondur0unO;di;amEe2hanai0reek,uatemal0;or2rm0;gi0;ilipino,ren8;cuadoVgyp4mira3ngli2sto1thiopi0urope0;shm0;ti;ti0;aPominUut3;a9h6o4roat3ub0ze2;ch;!i0;lom2ngol5;bi0;a6i2;le0n2;ese;lifor1m2na3;bo2eroo1;di0;angladeshi,el6o4r3ul2;gaE;azi9it;li2s1;vi0;aru2gi0;si0;fAl7merBngol0r5si0us2;sie,tr2;a2i0;li0;genti2me1;ne;ba1ge2;ri0;ni0;gh0r2;ic0;an",
  "Organization": "true¦0:4Q;a3Tb3Bc2Od2He2Df27g1Zh1Ti1Pj1Nk1Ll1Gm12n0Po0Mp0Cqu0Br02sTtHuCv9w3xiaomi,y1;amaha,m1Bou1w1B;gov,tu3C;a4e2iki1orld trade organizati33;leaRped0O;lls fargo,st1;fie2Hinghou2R;l1rner br3U;gree3Jl street journ2Im1E;an halOeriz2Xisa,o1;dafo2Yl1;kswagMvo;b4kip,n2ps,s1;a tod3Aps;es3Mi1;lev3Fted natio3C;er,s; mobi32aco beRd bOe9gi frida3Lh3im horto3Amz,o1witt3D;shi49y1;ota,s r 05;e 1in lizzy;b3carpen3Jdaily ma3Dguess w2holli0s1w2;mashing pumpki35uprem0;ho;ea1lack eyed pe3Xyr0Q;ch bo3Dtl0;l2n3Qs1xas instrumen1U;co,la m1F;efoni0Kus;a8cientology,e5ieme2Ymirnoff,np,o3pice gir6quare0Ata1ubaru;rbuc1to34;ks;ny,undgard1;en;a2x pisto1;ls;g1Wrs;few2Minsbur31lesfor03msu2E;adiohead,b8e4o1yana3C;man empi1Xyal 1;b1dutch she4;ank;a3d 1max,vl20;bu1c2Ahot chili peppe2Ylobst2N;ll;ders dige1Ll madrid;c,s;ant3Aizn2Q;a8bs,e5fiz2Ihilip4i3r1;emier 1udenti1D;leagTo2K;nk floyd,zza hut; morrBs;psi2tro1uge0E;br33chi0Tn33;!co;lant2Un1yp16; 2ason27da2P;ld navy,pec,range juli2xf1;am;us;aAb9e6fl,h5i4o1sa,vid3wa;k2tre dame,vart1;is;ia;ke,ntendo,ss0QvZ;l,s;c,st1Otflix,w1; 1sweek;kids on the block,york0D;a,c;nd22s2t1;ional aca2Po,we0U;a,c02d0S;aDcdonalCe9i6lb,o3tv,y1;spa1;ce;b1Tnsanto,ody blu0t1;ley cr1or0T;ue;c2t1;as,subisO;helin,rosoft;dica2rcedes benz,talli1;ca;id,re;ds;cs milk,tt19z24;a3e1g,ittle caesa1P; ore09novo,x1;is,mark,us; 1bour party;pres0Dz boy;atv,fc,kk,lm,m1od1O;art;iffy lu0Roy divisi0Jpmorgan1sa;! cha09;bm,hop,k3n1tv;g,te1;l,rpol;ea;a5ewlett pack1Vi3o1sbc,yundai;me dep1n1P;ot;tac1zbollah;hi;lliburt08sbro;eneral 6hq,ithub,l5mb,o2reen d0Ou1;cci,ns n ros0;ldman sachs,o1;dye1g0H;ar;axo smith kli04encoW;electr0Nm1;oto0Z;a5bi,c barcelo4da,edex,i2leetwood m03o1rito l0G;rd,xcY;at,fa,nancial1restoZ; tim0;na;cebook,nnie mae;b0Asa,u3xxon1; m1m1;ob0J;!rosceptics;aiml0De5isney,o4u1;nkin donu2po0Zran dur1;an;ts;j,w jon0;a,f lepp12ll,peche mode,r spieg02stiny's chi1;ld;aJbc,hFiDloudflaCnn,o3r1;aigsli5eedence clearwater reviv1ossra09;al;c7inba6l4m1o0Est09;ca2p1;aq;st;dplSg1;ate;se;a c1o chanQ;ola;re;a,sco1tigroup;! systems;ev2i1;ck fil a,na daily;r1y;on;d2pital o1rls jr;ne;bury,ill1;ac;aEbc,eBf9l5mw,ni,o1p,rexiteeU;ei3mbardiIston 1;glo1pizza;be;ng;o2ue c1;roV;ckbuster video,omingda1;le; g1g1;oodriL;cht2e ge0rkshire hathaw1;ay;el;cardi,idu,nana republ3s1xt5y5;f,kin robbi1;ns;ic;bYcTdidSerosmith,iRlKmEnheuser busDol,ppleAr6s4u3v2y1;er;is,on;di,todesk;hland o1sociated E;il;b3g2m1;co;os;ys; compu1be0;te1;rs;ch;c,d,erican3t1;!r1;ak; ex1;pre1;ss; 5catel2ta1;ir;! lu1;ce1;nt;jazeera,qae1;da;g,rbnb;as;/dc,a3er,tivision1;! blizz1;ard;demy of scienc0;es;ba",
  "Possessive": "true¦its,my,our0thy;!s",
  "Noun|Verb": "true¦0:9W;1:AA;2:96;3:A3;4:9R;5:A2;6:9K;7:8N;8:7L;9:A8;A:93;B:8D;C:8X;a9Ob8Qc7Id6Re6Gf5Sg5Hh55i4Xj4Uk4Rl4Em40n3Vo3Sp2Squ2Rr21s0Jt02u00vVwGyFzD;ip,oD;ne,om;awn,e6Fie68;aOeMhJiHoErD;ap,e9Oink2;nd0rDuC;kDry,sh5Hth;!shop;ck,nDpe,re,sh;!d,g;e86iD;p,sD;k,p0t2;aDed,lco8W;r,th0;it,lk,rEsDt4ve,x;h,te;!ehou1ra9;aGen5FiFoD;iDmAte,w;ce,d;be,ew,sA;cuum,l4B;pDr7;da5gra6Elo6A;aReQhrPiOoMrGuEwiDy5Z;n,st;nDrn;e,n7O;aGeFiEoDu6;t,ub2;bu5ck4Jgg0m,p;at,k,nd;ck,de,in,nsDp,v7J;f0i8R;ll,ne,p,r4Yss,t94uD;ch,r;ck,de,e,le,me,p,re;e5Wow,u6;ar,e,ll,mp0st,xt;g,lDng2rg7Ps5x;k,ly;a0Sc0Ne0Kh0Fi0Dk0Cl0Am08n06o05pXquaBtKuFwD;ea88iD;ng,pe,t4;bGit,m,ppErD;fa3ge,pri1v2U;lDo6S;e6Py;!je8;aMeLiKoHrEuDy2;dy,ff,mb2;a85eEiDo5Pugg2;ke,ng;am,ss,t4;ckEop,p,rD;e,m;ing,pi2;ck,nk,t4;er,m,p;ck,ff,ge,in,ke,lEmp,nd,p2rDte,y;!e,t;k,l;aJeIiHlGoFrDur,y;ay,e56inDu3;g,k2;ns8Bt;a5Qit;ll,n,r87te;ed,ll;m,n,rk;b,uC;aDee1Tow;ke,p;a5Je4FiDo53;le,rk;eep,iDou4;ce,p,t;ateboa7Ii;de,gnDl2Vnk,p,ze;!al;aGeFiEoDuff2;ck,p,re,w;ft,p,v0;d,i3Ylt0;ck,de,pe,re,ve;aEed,nDrv1It;se,t2N;l,r4t;aGhedu2oBrD;aEeDibb2o3Z;en,w;pe,t4;le,n,r2M;cDfegua72il,mp2;k,rifi3;aZeHhy6LiGoEuD;b,in,le,n,s5X;a6ck,ll,oDpe,u5;f,t;de,ng,ot,p,s1W;aTcSdo,el,fQgPje8lOmMnLo17pJque6sFturn,vDwa6V;eDi27;al,r1;er74oFpe8tEuD;lt,me;!a55;l71rt;air,eaDly,o53;l,t;dezvo2Zt;aDedy;ke,rk;ea1i4G;a6Iist0r5N;act6Yer1Vo71uD;nd,se;a38o6F;ch,s6G;c1Dge,iEke,lly,nDp1Wt1W;ge,k,t;n,se;es6Biv0;a04e00hYiXlToNrEsy4uD;mp,n4rcha1sh;aKeIiHoDu4O;be,ceFdu3fi2grDje8mi1p,te6;amDe6W;!me;ed,ss;ce,de,nt;sDy;er6Cs;cti3i1;iHlFoEp,re,sDuCw0;e,i5Yt;l,p;iDl;ce,sh;nt,s5V;aEce,e32uD;g,mp,n7;ce,nDy;!t;ck,le,n17pe,tNvot;a1oD;ne,tograph;ak,eFnErDt;fu55mA;!c32;!l,r;ckJiInHrFsEtDu1y;ch,e9;s,te;k,tD;!y;!ic;nt,r,se;!a7;bje8ff0il,oErDutli3Qver4B;bAd0ie9;ze;a4ReFoDur1;d,tD;e,i3;ed,gle8tD;!work;aMeKiIoEuD;rd0;ck,d3Rld,nEp,uDve;nt,th;it5EkD;ey;lk,n4Brr5CsDx;s,ta2B;asuBn4UrDss;ge,it;il,nFp,rk3WsEtD;ch,t0;h,k,t0;da5n0oeuvB;aLeJiHoEuD;mp,st;aEbby,ck,g,oDve;k,t;d,n;cDe,ft,mAnIst;en1k;aDc0Pe4vK;ch,d,k,p,se;bFcEnd,p,t4uD;gh,n4;e,k;el,o2U;eEiDno4E;ck,d,ll,ss;el,y;aEo1OuD;i3mp;m,zz;mpJnEr46ssD;ue;c1Rdex,fluGha2k,se2HteDvoi3;nt,rD;e6fa3viD;ew;en3;a8le2A;aJeHiGoEuD;g,nt;l3Ano2Dok,pDr1u1;!e;ghli1Fke,nt,re,t;aDd7lp;d,t;ck,mGndFrEsh,tDu9;ch,e;bo3Xm,ne4Eve6;!le;!m0;aMear,ift,lKossJrFuD;arDe4Alp,n;antee,d;aFiEoDumb2;uCwth;ll,nd,p;de,sp;ip;aBoDue;ss,w;g,in,me,ng,s,te,ze;aZeWiRlNoJrFuD;ck,el,nDss,zz;c38d;aEoDy;st,wn;cDgme,me,nchi1;tuB;cFg,il,ld,rD;ce,e29mDwa31;!at;us;aFe0Vip,oDy;at,ck,od,wD;!er;g,ke,me,re,sh,vo1E;eGgFlEnDre,sh,t,x;an3i0Q;e,m,t0;ht,uB;ld;aEeDn3;d,l;r,tuB;ce,il,ll,rm,vo2W;cho,d7ffe8nMsKxFyeD;!baD;ll;cGerci1hFpDtra8;eriDo0W;en3me9;au6ibA;el,han7u1;caDtima5;pe;count0d,vy;a01eSiMoJrEuDye;b,el,mp,pli2X;aGeFiEoD;ne,p;ft,ll,nk,p,ve;am,ss;ft,g,in;cEd7ubt,wnloD;ad;k,u0E;ge6p,sFt4vD;e,iDor3;de;char7gui1h,liEpD;at4lay,u5;ke;al,bKcJfeIlGmaCposAsEtaD;il;e07iD;gn,re;ay,ega5iD;ght;at,ct;li04rea1;a5ut;b,ma7n3rDte;e,t;a0Eent0Dh06irc2l03oKrFuD;be,e,rDt;b,e,l,ve;aGeFoEuDy;sh;p,ss,wd;dAep;ck,ft,sh;at,de,in,lTmMnFordina5py,re,st,uDv0;gh,nDp2rt;s01t;ceHdu8fli8glomeIsFtDveN;a8rD;a6ol;e9tru8;ct;ntDrn;ra5;bHfoGmFpD;leDouCromi1;me9;aCe9it,u5;rt;at,iD;ne;lap1oD;r,ur;aEiDoud,ub;ck,p;im,w;aEeDip;at,ck,er;iGllen7nErD;ge,m,t;ge,nD;el;n,r;er,re;ke,ll,mp,noe,pGrXsFtEuDve;se,ti0I;alog,ch;h,t;!tuB;re;a03eZiXlToPrHuEyD;pa11;bb2ck2dgEff0mp,rDst,zz;den,n;et;anJeHiFoadEuD;i1sh;ca6;be,d7;ge;aDed;ch,k;ch,d;aFg,mb,nEoDrd0tt2x,ycott;k,st,t;d,e;rd,st;aFeCiDoYur;nk,tz;nd;me;as,d,ke,nd,opsy,tD;!ch,e;aFef,lt,nDt;d,efA;it;r,t;ck,il,lan3nIrFsEtt2;le;e,h;!gDk;aDe;in;!d,g,k;bu1c05dZge,iYlVnTppQrLsIttGucEwaD;rd;tiD;on;aDempt;ck;k,sD;i6ocia5;st;chFmD;!oD;ur;!iD;ve;eEroa4;ch;al;chDg0sw0;or;aEt0;er;rm;d,m,r;dreHvD;an3oD;ca5;te;ce;ss;cDe,he,t;eFoD;rd,u9;nt;nt,ss;se",
  "Actor": "true¦0:7B;1:7G;2:6A;3:7F;4:7O;5:7K;a6Nb62c4Ud4Be41f3Sg3Bh30i2Uj2Qkin2Pl2Km26n1Zo1Sp0Vqu0Tr0JsQtJuHvEw8yo6;gi,ut6;h,ub0;aAe9i8o7r6;estl0it0;m2rk0;fe,nn0t2Bza2H;atherm2ld0;ge earn0it0nder0rri1;eter7i6oyF;ll5Qp,s3Z;an,ina2U;n6s0;c6Uder03;aoisea23e9herapi5iktok0o8r6ut1yco6S;a6endseLo43;d0mp,nscri0Bvel0;ddl0u1G;a0Qchn7en6na4st0;ag0;i3Oo0D;aiXcUeRhPiMki0mu26oJpGquaFtBu7wee6;p0theart;lt2per7r6;f0ge6Iviv1;h6inten0Ist5Ivis1;ero,um2;a8ep7r6;ang0eam0;bro2Nc2Ofa2Nmo2Nsi20;ff0tesm2;tt0;ec7ir2Do6;kesp59u0M;ia5Jt3;l7me6An,rcere6ul;r,ss;di0oi5;n7s6;sy,t0;g0n0;am2ephe1Iow6;girl,m2r2Q;cretInior cit3Fr6;gea4v6;a4it1;hol4Xi7reen6ulpt1;wr2C;e01on;l1nt;aEe9o8u6;l0nn6;er up,ingE;g40le mod3Zof0;a4Zc8fug2Ppo32searQv6;ere4Uolution6;ary;e6luYru22;ptio3T;bbi,dic5Vpp0;arter6e2Z;back;aYeWhSiRlOoKr8sycho7u6;nk,p31;logi5;aGeDiBo6;d9fess1g7ph47s6;pe2Ktitu51;en6ramm0;it1y;igy,uc0;est4Nme mini0Unce6s3E;!ss;a7si6;de4;ch0;ctiti39nk0P;dca0Oet,li6pula50rnst42;c2Itic6;al scie6i2;nti5;a6umb0;nn0y6;er,ma4Lwright;lgrim,one0;a8iloso7otogra7ra6ysi1V;se;ph0;ntom,rmaci5;r6ssi1T;form0s4O;i3El,nel3Yr8st1tr6wn;i6on;arWot;ent4Wi42tn0;ccupa4ffBp8r7ut6;ca5l0B;ac4Iganiz0ig2Fph2;er3t6;i1Jomet6;ri5;ic0spring;aBe9ie4Xo7u6;n,rser3J;b6mad,vi4V;le2Vo4D;i6mesis,phew;ce,ghb1;nny,rr3t1X;aEeDiAo7u6yst1Y;m8si16;der3gul,m7n6th0;arDk;!my;ni7s6;f02s0Jt0;on,st0;chan1Qnt1rcha4;gi9k0n8rtyr,t6y1;e,riar6;ch;ag0iac;ci2stra3I;a7e2Aieutena4o6;rd,s0v0;bor0d7ndlo6ss,urea3Fwy0ym2;rd;!y;!s28;e8o7u6;ggl0;gg0urna2U;st0;c3Hdol,llu3Ummigra4n6; l9c1Qfa4habi42nov3s7ve6;nt1stig3;pe0Nt6;a1Fig3ru0M;aw;airFeBistoAo8u6ygie1K;man6sba2H;!ita8;bo,st6usekN;age,e3P;ri2;ir,r6;m7o6;!ine;it;dress0sty2C;aLeIhostGirl26ladi3oCrand7u6;e5ru;c9daug0Jfa8m7pa6s2Y;!re4;a,o6;th0;hi1B;al7d6lf0;!de3A;ie,k6te26;eep0;!wr6;it0;isha,n6;i6tl04;us;mbl0rden0;aDella,iAo7r6;eela2Nie1P;e,re6ster pare4;be1Hm2r6st0;unn0;an2ZgZlmm17nanci0r6tt0;e6st la2H; marsh2OfigXm2;rm0th0;conoEdDlectriCm8n7x6;amin0cellency,i2A;emy,trepreneur,vironmenta1J;c8p6;er1loye6;e,r;ee;ci2;it1;mi5;aKeBi8ork,ri7u6we02;de,tche2H;ft0v0;ct3eti7plom2Hre6va;ct1;ci2ti2;aDcor3fencCi0InAput9s7tectLvel6;op0;ce1Ge6ign0;rt0;ee,y;iz6;en;em2;c1Ml0;d8nc0redev7ug6;ht0;il;!dy;a06e04fo,hXitizenWlToBr9u6;r3stomer6;! representat6;ive;e3it6;ic;lJmGnAord9rpor1Nu7w6;boy,ork0;n6ri0;ciTte1Q;in3;fidantAgressSs9t6;e0Kr6;ibut1o6;ll0;tab13ul1O;!e;edi2m6pos0rade;a0EeQissi6;on0;leag8on7um6;ni5;el;ue;e6own;an0r6;ic,k;!s;a9e7i6um;ld;erle6f;ad0;ir7nce6plFract0;ll1;m2wI;lebri6o;ty;dBptAr6shi0;e7pe6;nt0;r,t6;ak0;ain;et;aMeLiJlogg0oErBu6;dd0Fild0rgl9siness6;m2p7w6;om2;ers05;ar;i7o6;!k0th0;cklay0de,gadi0;hemi2oge8y6;!frie6;nd;ym2;an;cyc6sR;li5;atbox0ings;by,nk0r6;b0on7te6;nd0;!e07;c04dWge4nQpLrHsFtAu7yatull6;ah;nt7t6;h1oG;!ie;h8t6;e6orney;nda4;ie5le6;te;sis00tron6;aut,om0;chbis8isto7tis6;an,t;crU;hop;ost9p6;ari6rentiS;ti6;on;le;a9cest1im3nou8y6;bo6;dy;nc0;ly5rc6;hi5;mi8v6;entur0is1;er;ni7r6;al;str3;at1;or;counBquaintanArob9t6;ivi5or,re6;ss;st;at;ce;ta4;nt",
  "Adj|Noun": "true¦0:16;a1Db17c0Ud0Re0Mf0Dg0Ah08i06ju05l02mWnUoSpNrIsBt7u4v1watershed;a1ision0Z;gabo4nilla,ria1;b0Vnt;ndergr1pstairs;adua14ou1;nd;a3e1oken,ri0;en,r1;min0rori13;boo,n;age,e5ilv0Flack,o3quat,ta2u1well;bordina0Xper5;b0Lndard;ciali0Yl1vereign;e,ve16;cret,n1ri0;ior;a4e2ou1ubbiL;nd,tiY;ar,bBl0Wnt0p1side11;resent0Vublican;ci0Qsh;a4eriodic0last0Zotenti0r1;emi2incip0o1;!fession0;er,um;rall4st,tie0U;ff1pposi0Hv0;ens0Oi0C;agg01ov1uts;el;a5e3iniatJo1;bi01der07r1;al,t0;di1tr0N;an,um;le,riG;attOi2u1;sh;ber0ght,qC;stice,veniT;de0mpressioYn1;cumbe0Edividu0no0Dsta0Eterim;alf,o1umdrum;bby,melF;en2old,ra1;ph0Bve;er0ious;a7e5i4l3u1;git03t1;ure;uid;ne;llow,m1;aFiL;ir,t,vo1;riOuriO;l3p00x1;c1ecutUpeV;ess;d1iK;er;ar2e1;mographUrivO;k,l2;hiGlassSo2rude,unn1;ing;m5n1operK;creCstitueOte2vertab1;le;mpor1nt;ary;ic,m2p1;anion,lex;er2u1;ni8;ci0;al;e5lank,o4r1;i2u1;te;ef;ttom,urgeois;st;cadem9d6l2ntarct9r1;ab,ct8;e3tern1;at1;ive;rt;oles1ult;ce1;nt;ic",
  "Adj|Past": "true¦0:4Q;1:4C;2:4H;3:4E;a44b3Tc36d2Je29f20g1Wh1Si1Jj1Gkno1Fl1Am15n12o0Xp0Mqu0Kr08sLtEuAv9w4yellow0;a7ea6o4rinkl0;r4u3Y;n,ri0;k31th3;rp0sh0tZ;ari0e1O;n5p4s0;d1li1Rset;cov3derstood,i4;fi0t0;a8e3Rhr7i6ouTr4urn0wi4C;a4imm0ou2G;ck0in0pp0;ed,r0;eat2Qi37;m0nn0r4;get0ni2T;aOcKeIhGimFm0Hoak0pDt7u4;bsid3Ogge44s4;pe4ta2Y;ct0nd0;a8e7i2Eok0r5u4;ff0mp0nn0;ength2Hip4;ed,p0;am0reotyp0;in0t0;eci4ik0oH;al3Efi0;pRul1;a4ock0ut;d0r0;a4c1Jle2t31;l0s3Ut0;a6or5r4;at4e25;ch0;r0tt3;t4ut0;is2Mur1;aEe5o4;tt0;cAdJf2Bg9je2l8m0Knew0p7qu6s4;eTpe2t4;or0ri2;e3Dir0;e1lac0;at0e2Q;i0Rul1;eiv0o4ycl0;mme2Lrd0v3;in0lli0ti2A;a4ot0;li28;aCer30iBlAo9r5u4;mp0zzl0;e6i2Oo4;ce2Fd4lo1Anou30pos0te2v0;uc0;fe1CocCp0Iss0;i2Kli1L;ann0e2CuS;ck0erc0ss0;ck0i2Hr4st0;allLk0;bse7c6pp13rgan2Dver4;lo4whelm0;ok0;cupi0;rv0;aJe5o4;t0uri1A;ed0gle2;a6e5ix0o4ut0ys1N;di1Nt15u26;as0Clt0;n4rk0;ag0ufact0A;e6i5o4;ad0ck0st,v0;cens0m04st0;ft,v4;el0;tt0wn;a5o15u4;dg0s1B;gg0;llumSmpAn4sol1;br0cre1Ldebt0f8jZspir0t5v4;it0olv0;e4ox0Y;gr1n4re23;d0si15;e2l1o1Wuri1;li0o01r4;ov0;a6e1o4um03;ok0r4;ri0Z;mm3rm0;i6r5u4;a1Bid0;a0Ui0Rown;ft0;aAe9i8l6oc0Ir4;a4i0oz0Y;ctHg19m0;avo0Ju4;st3;ni08tt0x0;ar0;d0il0sc4;in1;dCl1mBn9quipp0s8x4;agger1c6p4te0T;a0Se4os0;ct0rie1D;it0;cap0tabliZ;cha0XgFha1As4;ur0;a0Zbarra0N;i0Buc1;aMeDi5r4;a01i0;gni08miniSre2s4;a9c6grun0Ft4;o4re0Hu17;rt0;iplWou4;nt0r4;ag0;bl0;cBdRf9l8p7ra6t5v4;elop0ot0;ail0ermQ;ng0;re07;ay0ight0;e4in0o0M;rr0;ay0enTor1;m5t0z4;ed,zl0;ag0p4;en0;aPeLhIlHo9r6u4;lt4r0stom03;iv1;a5owd0u4;sh0;ck0mp0;d0loAm7n4ok0v3;centr1f5s4troC;id3olid1;us0;b5pl4;ic1;in0;r0ur0;assi9os0utt3;ar5i4;ll0;g0m0;lebr1n6r4;ti4;fi0;tralJ;g0lcul1;aDewild3iCl9o7r5urn4;ed,t;ok4uis0;en;il0r0t4und;tl0;e5i4;nd0;ss0;as0;ffl0k0laMs0tt3;bPcNdKfIg0lFmaz0nDppBrm0ss9u5wa4;rd0;g5thor4;iz0;me4;nt0;o6u4;m0r0;li0re4;ci1;im1ticip1;at0;a5leg0t3;er0;rm0;fe2;ct0;ju5o7va4;nc0;st0;ce4knowledg0;pt0;and5so4;rb0;on0;ed",
  "Singular": "true¦0:5J;1:5H;2:4W;3:4S;4:52;5:57;6:5L;7:56;8:5B;a52b4Lc3Nd35e2Xf2Og2Jh28in24j23k22l1Um1Ln1Ho1Bp0Rqu0Qr0FsZtMuHvCw9x r58yo yo;a9ha3Po3Q;f3i4Rt0Gy9;! arou39;arCeAideo ga2Qo9;cabu4Jl5C;gOr9t;di4Zt1Y;iety,ni4P;nBp30rAs 9;do43s5E;bani1in0;coordinat3Ader9;estima1to24we41; rex,aKeJhHiFoErBuAv9;! show;m2On2rntLto1D;agedy,ib9o4E;e,u9;n0ta46;ni1p2rq3L;c,er,m9;etF;ing9ree26;!y;am,mp3F;ct2le6x return;aNcMeKhor4QiJkHoGpin off,tDuBy9;ll9ner7st4T;ab2X;b9i1n28per bowl,rro1X;st3Ltot0;atAipe2Go1Lrate7udent9;! lo0I;i39u1;ft ser4Lmeo1I;elet5i9;ll,r3V;b38gn2Tte;ab2Jc9min3B;t,urity gua2N;e6ho2Y;bbatic0la3Jndwi0Qpi5;av5eDhetor2iAo9;de6om,w;tAv9;erb2C;e,u0;bDcBf9publ2r10spi1;er9orm3;e6r0;i9ord label;p2Ht0;a1u46;estion mark,ot2F;aPeMhoLiIlGoErAu9yram1F;ddi3HpErpo1Js3J;eBo9;bl3Zs9;pe3Jta1;dic1Rmi1Fp1Qroga8ss relea1F;p9rt0;py;a9ebisci1;q2Dte;cn2eAg9;!gy;!r;ne call,tocoK;anut,dAr9t0yo1;cen3Jsp3K;al,est0;nop4rAt9;e,hog5;adi11i2V;atme0bj3FcBpia1rde0thers,utspok5ve9wn3;n,r9;ti0Pview;cuAe9;an;pi3;arBitAot9umb3;a2Fhi2R;e,ra1;cot2ra8;aFeCiAo9ur0;nopo4p18rni2Nsq1Rti36uld;c,li11n0As9tt5;chief,si34;dAnu,t9;al,i3;al,ic;gna1mm0nd15rsupi0te9yf4;ri0;aDegCiBu9;ddi1n9;ch;me,p09; Be0M;bor14y9; 9er;up;eyno1itt5;el4ourn0;cBdices,itia8ni25sAtel0Lvert9;eb1J;e28titu1;en8i2T;aIeEighDoAu9;man right,s22;me9rmoFsp1Ftb0K;! r9;un; scho0YriY;a9i1N;d9v5; start,pho9;ne;ndful,sh brown,v5ze;aBelat0Ilaci3r9ul4yp1S;an9enadi3id;a1Cd slam,ny;df4r9;l2ni1I;aGeti1HiFlu1oCrAun9;er0;ee market,i9onti3;ga1;l4ur9;so9;me;ePref4;br2mi4;conoFffi7gg,lecto0Rmbas1EnCpidem2s1Zth2venBxAyel9;id;ampZempl0Nte6;i19t;er7terp9;ri9;se;my;eLiEoBr9ump tru0U;agonf4i9;er,ve thru;cAg7i4or,ssi3wn9;side;to0EumenE;aEgniDnn3sAvide9;nd;conte6incen8p9tri11;osi9;ti0C;ta0H;le0X;athBcAf9ni0terre6;ault 05err0;al,im0;!b9;ed;aWeThMiLlJoDr9;edit caBuc9;ib9;le;rd;efficDke,lCmmuniqLnsApi3rr0t0Xus9yo1;in;erv9uI;ato02;ic,lQ;ie6;er7i9oth;e6n2;ty,vil wM;aDeqCick5ocoBr9;istmas car9ysanthemum;ol;la1;ue;ndeli3racteri9;st2;iAllEr9;e0tifica1;liZ;hi3nFpErCt9ucus;erpi9hedr0;ll9;ar;!bohyd9ri3;ra1;it0;aAe,nib0t9;on;l,ry;aMeLiop2leJoHrDu9;nny,r9tterf4;g9i0;la9;ry;eakAi9;ck;fa9throB;st;dy,ro9wl;ugh;mi9;sh;an,l4;nkiArri3;er;ng;cSdMlInFppeti1rDsBtt2utop9;sy;ic;ce6pe9;ct;r9sen0;ay;ecAoma4tiA;ly;do1;i5l9;er7y;gy;en; hominDjAvan9;tage;ec8;ti9;ve;em;cCeAqui9;tt0;ta1;te;iAru0;al;de6;nt",
  "Person|Noun": "true¦a0Eb07c03dWeUfQgOhLjHkiGlFmCnBolive,p7r4s3trini06v1wa0;ng,rd,tts;an,enus,iol0;a,et;ky,onPumm09;ay,e1o0uby;bin,d,se;ed,x;a2e1o0;l,tt04;aLnJ;dYge,tR;at,orm;a0eloW;t0x,ya;!s;a9eo,iH;ng,tP;a2e1o0;lGy;an,w3;de,smi4y;a0erb,iOolBuntR;ll,z0;el;ail,e0iLuy;ne;a1ern,i0lo;elds,nn;ith,n0;ny;a0dEmir,ula,ve;rl;a4e3i1j,ol0;ly;ck,x0;ie;an,ja;i0wn;sy;am,h0liff,rystal;a0in,ristian;mbers,ri0;ty;a4e3i2o,r0ud;an0ook;dy;ll;nedict,rg;k0nks;er;l0rt;fredo,ma",
  "Actor|Verb": "true¦aCb8c5doctor,engineAfool,g3host,judge,m2nerd,p1recruit,scout,ushAvolunteAwi0;mp,tneA;arent,ilot;an,ime;eek,oof,r0uide;adu8oom;ha1o0;ach,nscript,ok;mpion,uffeur;o2u0;lly,tch0;er;ss;ddi1ffili0rchite1;ate;ct",
  "MaleName": "true¦0:H6;1:FZ;2:DS;3:GQ;4:CZ;5:FV;6:GM;7:FP;8:GW;9:ET;A:C2;B:GD;aF8bE1cCQdBMeASfA1g8Yh88i7Uj6Sk6Bl5Mm48n3So3Ip33qu31r26s1Et0Ru0Ov0CwTxSyHzC;aCor0;cChC1karia,nAT;!hDkC;!aF6;!ar7CeF5;aJevgenBSoEuC;en,rFVsCu3FvEF;if,uf;nDs6OusC;ouf,s6N;aCg;s,tC;an,h0;hli,nCrosE1ss09;is,nC;!iBU;avi2ho5;aPeNiDoCyaEL;jcieBJlfgang,odrFutR;lFnC;f8TsC;lCt1;ow;bGey,frEhe4QlC;aE5iCy;am,e,s;ed8iC;d,ed;eAur;i,ndeD2rn2sC;!l9t1;lDyC;l1ne;lDtC;!er;aCHy;aKernDAiFladDoC;jteB0lodymyr;!iC;mFQsDB;cFha0ktBZnceDrgCOvC;a0ek;!nC;t,zo;!e4StBV;lCnC7sily;!entC;in9J;ghE2lCm70nax,ri,sm0;riCyss87;ch,k;aWeRhNiLoGrEuDyC;!l2roEDs1;n6r6E;avD0eCist0oy,um0;ntCRvBKy;bFdAWmCny;!asDmCoharu;aFFie,y;!z;iA6y;mCt4;!my,othy;adEeoDia0SomC;!as;!dor91;!de4;dFrC;enBKrC;anBJeCy;ll,nBI;!dy;dgh,ha,iCnn2req,tsu5V;cDAka;aYcotWeThPiMlobod0oKpenc2tEurDvenAEyCzym1;ed,lvest2;aj,e9V;anFeDuC;!aA;fan17phEQvCwaA;e77ie;!islaCl9;v,w;lom1rBuC;leymaDHta;dDgmu9UlCm1yabonga;as,v8B;!dhart8Yn9;aEeClo75;lCrm0;d1t1;h9Jne,qu1Jun,wn,yne;aDbastiEDk2Yl5Mpp,rgCth,ymoCU;e1Dio;m4n;!tC;!ie,y;eDPlFmEnCq67tosCMul;dCj2UtiA5;e01ro;!iATkeB6mC4u5;!ik,vato9K;aZeUheC8iRoGuDyC;an,ou;b99dDf4peAssC;!elEG;ol00y;an,bLc7MdJel,geIh0lHmGnEry,sDyC;!ce;ar7Ocoe,s;!aCnBU;ld,n;an,eo;a7Ef;l7Jr;e3Eg2n9olfo,riC;go;bBNeDH;cCl9;ar87c86h54kCo;!ey,ie,y;cFeA3gDid,ubByCza;an8Ln06;g85iC;naC6s;ep;ch8Kfa5hHin2je8HlGmFndEoHpha5sDul,wi36yC;an,mo8O;h9Im4;alDSol3O;iD0on;f,ph;ul;e9CinC;cy,t1;aOeLhilJiFrCyoG;aDeC;m,st1;ka85v2O;eDoC;tr;r8GtC;er,ro;!ipCl6H;!p6U;dCLrcy,tC;ar,e9JrC;!o7;b9Udra8So9UscAHtri62ulCv8I;!ie,o7;ctav6Ji2lImHndrBRrGsDtCum6wB;is,to;aDc6k6m0vCwaBE;al79;ma;i,vR;ar,er;aDeksandr,ivC;er,i2;f,v;aNeLguyBiFoCu3O;aDel,j4l0ma0rC;beAm0;h,m;cFels,g5i9EkDlC;es,s;!au,h96l78olaC;!i,y;hCkCol76;ol75;al,d,il,ls1vC;ilAF;hom,tC;e,hC;anCy;!a5i5;aYeViLoGuDyC;l4Nr1;hamDr84staC;fa,p6E;ed,mG;di10e,hamEis4JntDritz,sCussa;es,he;e,y;ad,ed,mC;ad,ed;cGgu5hai,kFlEnDtchC;!e8O;a9Pik;house,o7t1;ae73eC3ha8Iolaj;ah,hDkC;!ey,y;aDeC;al,l;el,l;hDlv3rC;le,ri8Ev4T;di,met;ay0c00gn4hWjd,ks2NlTmadZnSrKsXtDuric7VxC;imilBKwe8B;eHhEi69tCus,y69;!eo,hCia7;ew,i67;eDiC;as,eu,s;us,w;j,o;cHiGkFlEqu8Qsha83tCv3;iCy;!m,n;in,on;el,o7us;a6Yo7us;!elCin,o7us;!l8o;frAEi5Zny,u5;achDcoCik;lm;ai,y;amDdi,e5VmC;oud;adCm6W;ou;aulCi9P;ay;aWeOiMloyd,oJuDyC;le,nd1;cFdEiDkCth2uk;a7e;gi,s,z;ov7Cv6Hw6H;!as,iC;a6Een;g0nn52renDuCvA4we7D;!iS;!zo;am,n4oC;n5r;a9Yevi,la5KnHoFst2thaEvC;eCi;nte;bo;nCpo8V;!a82el,id;!nC;aAy;mEnd1rDsz73urenCwr6K;ce,t;ry,s;ar,beAont;aOeIhalHiFla4onr63rDu5SylC;e,s;istCzysztof;i0oph2;er0ngsl9p,rC;ilA9k,ollos;ed,id;en0iGnDrmCv4Z;it;!dDnCt1;e2Ny;ri4Z;r,th;cp2j4mEna8BrDsp6them,uC;ri;im,l;al,il;a03eXiVoFuC;an,lCst3;en,iC;an,en,o,us;aQeOhKkub4AnIrGsDzC;ef;eDhCi9Wue;!ua;!f,ph;dCge;i,on;!aCny;h,s,th6J;anDnC;!ath6Hie,n72;!nC;!es;!l,sCy;ph;o,qu3;an,mC;!i,m6V;d,ffFns,rCs4;a7JemDmai7QoCry;me,ni1H;i9Dy;!e73rC;ey,y;cKdBkImHrEsDvi2yC;dBs1;on,p2;ed,oDrCv67;e6Qod;d,s61;al,es5Wis1;a,e,oCub;b,v;ob,qu13;aTbNchiMgLke53lija,nuKonut,rIsEtCv0;ai,suC;ki;aDha0i8XmaCsac;el,il;ac,iaC;h,s;a,vinCw3;!g;k,nngu6X;nac1Xor;ka;ai,rahC;im;aReLoIuCyd6;beAgGmFsC;eyDsC;a3e3;in,n;ber5W;h,o;m2raDsse3wC;a5Pie;c49t1K;a0Qct3XiGnDrC;beAman08;dr7VrC;iCy2N;!k,q1R;n0Tt3S;bKlJmza,nIo,rEsDyC;a5KdB;an,s0;lEo67r2IuCv9;hi5Hki,tC;a,o;an,ey;k,s;!im;ib;a08e00iUlenToQrMuCyorgy;iHnFsC;!taC;f,vC;!e,o;n6tC;er,h2;do,lC;herDlC;auCerQ;me;aEegCov2;!g,orC;!io,y;dy,h7C;dfr9nza3XrDttfC;ri6C;an,d47;!n;acoGlEno,oCuseppe;rgiCvan6O;!o,s;be6Ies,lC;es;mo;oFrC;aDha4HrCt;it,y;ld,rd8;ffErgC;!e7iCy;!os;!r9;bElBrCv3;eCla1Nr4Hth,y;th;e,rC;e3YielC;!i4;aXeSiQlOorrest,rCyod2E;aHedFiC;edDtC;s,z;ri18;!d42eri11riC;ck,k;nCs2;cEkC;ie,lC;in,yn;esLisC;!co,z3M;etch2oC;ri0yd;d5lConn;ip;deriFliEng,rC;dinaCg4nan0B;nd8;pe,x;co;bCdi,hd;iEriC;ce,zC;io;an,en,o;benez2dZfrYit0lTmMnJo3rFsteb0th0ugenEvCymBzra;an,eCge4D;ns,re3K;!e;gi,iDnCrol,v3w3;est8ie,st;cCk;!h,k;o0DriCzo;co,qC;ue;aHerGiDmC;aGe3A;lCrh0;!iC;a10o,s;s1y;nu5;beAd1iEliDm2t1viCwood;n,s;ot28s;!as,j5Hot,sC;ha;a3en;!dGg6mFoDua2QwC;a2Pin;arC;do;oZuZ;ie;a04eTiOmitrNoFrag0uEwDylC;an,l0;ay3Hig4D;a3Gdl9nc0st3;minFnDri0ugCvydGy2S;!lF;!a36nCov0;e1Eie,y;go,iDykC;as;cCk;!k;i,y;armuFetDll1mitri7neCon,rk;sh;er,m6riC;ch;id;andLepak,j0lbeAmetri4nIon,rGsEvDwCxt2;ay30ey;en,in;hawn,moC;nd;ek,riC;ck;is,nC;is,y;rt;re;an,le,mKnIrEvC;e,iC;!d;en,iEne0PrCyl;eCin,yl;l45n;n,o,us;!iCny;el,lo;iCon;an,en,on;a0Fe0Ch03iar0lRoJrFuDyrC;il,us;rtC;!is;aEistC;iaCob12;no;ig;dy,lInErC;ey,neliCy;s,us;nEor,rDstaC;nt3;ad;or;by,e,in,l3t1;aHeEiCyde;fCnt,ve;fo0Xt1;menDt4;us;s,t;rFuDyC;!t1;dCs;e,io;enC;ce;aHeGrisC;!toC;phCs;!eC;!r;st2t;d,rCs;b5leC;s,y;cDdrCs6;ic;il;lHmFrC;ey,lDroCy;ll;!o7t1;er1iC;lo;!eb,v3;a09eZiVjorn,laUoSrEuCyr1;ddy,rtKst2;er;aKeFiEuDyC;an,ce,on;ce,no;an,ce;nDtC;!t;dDtC;!on;an,on;dFnC;dDisC;lav;en,on;!foOl9y;bby,gd0rCyd;is;i0Lke;bElDshC;al;al,lL;ek;nIrCshoi;at,nEtC;!raC;m,nd;aDhaCie;rd;rd8;!iDjam3nCs1;ie,y;to;kaMlazs,nHrC;n9rDtC;!holomew;eCy;tt;ey;dCeD;ar,iC;le;ar1Nb1Dd16fon15gust3hm12i0Zja0Yl0Bm07nTputsiSrGsaFugustEveDyCziz;a0kh0;ry;o,us;hi;aMchiKiJjun,mHnEon,tCy0;em,hCie,ur8;ur;aDoC;!ld;ud,v;aCin;an,nd8;!el,ki;baCe;ld;ta;aq;aMdHgel8tCw6;hoFoC;iDnC;!i8y;ne;ny;er7rCy;eDzC;ej;!as,i,j,s,w;!s;s,tolC;iCy;!y;ar,iEmaCos;nu5r;el;ne,r,t;aVbSdBeJfHiGl01onFphonsEt1vC;aPin;on;e,o;so,zo;!sR;!onZrC;ed;c,jaHksFssaHxC;!andC;er,rC;e,os,u;andCei;ar,er,r;ndC;ro;en;eDrecC;ht;rt8;dd3in,n,sC;taC;ir;ni;dDm6;ar;an,en;ad,eC;d,t;in;so;aGi,olErDvC;ik;ian8;f8ph;!o;mCn;!a;dGeFraDuC;!bakr,lfazl;hCm;am;!l;allFel,oulaye,ulC;!lDrahm0;an;ah,o;ah;av,on",
  "Uncountable": "true¦0:2E;1:2L;2:33;a2Ub2Lc29d22e1Rf1Ng1Eh16i11j0Yk0Wl0Rm0Hn0Do0Cp03rZsLt9uran2Jv7w3you gu0E;a5his17i4oo3;d,l;ldlife,ne;rm8t1;apor,ernacul29i3;neg28ol1Otae;eDhBiAo8r4un3yranny;a,gst1B;aff2Oea1Ko4ue nor3;th;o08u3;bleshoot2Ose1Tt;night,othpas1Vwn3;foEsfoE;me off,n;er3und1;e,mod2S;a,nnis;aDcCeBhAi9ki8o7p6t4u3weepstak0;g1Unshi2Hshi;ati08e3;am,el;ace2Keci0;ap,cc1meth2C;n,ttl0;lk;eep,ingl0or1C;lf,na1Gri0;ene1Kisso1C;d0Wfe2l4nd,t3;i0Iurn;m1Ut;abi0e4ic3;e,ke15;c3i01laxa11search;ogni10rea10;a9e8hys7luto,o5re3ut2;amble,mis0s3ten20;en1Zs0L;l3rk;i28l0EyH; 16i28;a24tr0F;nt3ti0M;i0s;bstetri24vercrowd1Qxyg09;a5e4owada3utella;ys;ptu1Ows;il poliZtional securi2;aAe8o5u3;m3s1H;ps;n3o1K;ey,o3;gamy;a3cha0Elancholy,rchandi1Htallurgy;sl0t;chine3g1Aj1Hrs,thema1Q; learn1Cry;aught1e6i5ogi4u3;ck,g12;c,s1M;ce,ghtn18nguis1LteratWv1;ath1isVss;ara0EindergartPn3;icke0Aowled0Y;e3upit1;a3llyfiGwel0G;ns;ce,gnor6mp5n3;forma00ter3;net,sta07;atiSort3rov;an18;a7e6isto09o3ung1;ckey,mework,ne4o3rseradi8spitali2use arrest;ky;s2y;adquarteXre;ir,libut,ppiHs3;hi3te;sh;ene8l6o5r3um,ymnas11;a3eZ;niUss;lf,re;ut3yce0F;en; 3ti0W;edit0Hpo3;ol;aNicFlour,o4urnit3;ure;od,rgive3uri1wl;ness;arCcono0LducaBlectr9n7quip8thi0Pvery6x3;ist4per3;ti0B;en0J;body,o08th07;joy3tertain3;ment;ici2o3;ni0H;tiS;nings,th;emi02i6o4raugh3ynas2;ts;pe,wnstai3;rs;abet0ce,s3;honZrepu3;te;aDelciChAivi07l8o3urrency;al,ld w6mmenta5n3ral,ttIuscoB;fusiHt 3;ed;ry;ar;assi01oth0;es;aos,e3;eMwK;us;d,rO;a8i6lood,owlHread5u3;ntGtt1;er;!th;lliarJs3;on;g3ss;ga3;ge;cKdviJeroGirFmBn6ppeal court,r4spi3thleL;rin;ithmet3sen3;ic;i6y3;o4th3;ing;ne;se;en5n3;es2;ty;ds;craft;bi8d3nau7;yna3;mi6;ce;id,ous3;ti3;cs",
  "Infinitive": "true¦0:9G;1:9T;2:AD;3:90;4:9Z;5:84;6:AH;7:A9;8:92;9:A0;A:AG;B:AI;C:9V;D:8R;E:8O;F:97;G:6H;H:7D;a94b8Hc7Jd68e4Zf4Mg4Gh4Ai3Qj3Nk3Kl3Bm34nou48o2Vp2Equ2Dr1Es0CtZuTvRwI;aOeNiLors5rI;eJiI;ng,te;ak,st3;d5e8TthI;draw,er;a2d,ep;i2ke,nIrn;d1t;aIie;liADniAry;nJpI;ho8Llift;cov1dJear8Hfound8DlIplug,rav82tie,ve94;eaAo3X;erIo;cut,go,staAFvalA3w2G;aSeQhNoMrIu73;aIe72;ffi3Smp3nsI;aBfo7CpI;i8oD;pp3ugh5;aJiJrIwaD;eat5i2;nk;aImA0;ch,se;ck3ilor,keImp1r8L;! paD;a0Ic0He0Fh0Bi0Al08mugg3n07o05p02qu01tUuLwI;aJeeIim;p,t5;ll7Wy;bNccMffLggeCmmKppJrI;mouFpa6Zvi2;o0re6Y;ari0on;er,i4;e7Numb;li9KmJsiIveD;de,st;er9it;aMe8MiKrI;ang3eIi2;ng27w;fIng;f5le;b,gg1rI;t3ve;a4AiA;a4UeJit,l7DoI;il,of;ak,nd;lIot7Kw;icEve;atGeak,i0O;aIi6;m,y;ft,ng,t;aKi6CoJriIun;nk,v6Q;ot,rt5;ke,rp5tt1;eIll,nd,que8Gv1w;!k,m;aven9ul8W;dd5tis1Iy;a0FeKiJoI;am,t,ut;d,p5;a0Ab08c06d05f01group,hea00iZjoi4lXmWnVpTq3MsOtMup,vI;amp,eJiIo3B;sEve;l,rI;e,t;i8rI;ie2ofE;eLiKpo8PtIurfa4;o24rI;aHiBuctu8;de,gn,st;mb3nt;el,hra0lIreseF;a4e71;d1ew,o07;aHe3Fo2;a7eFiIo6Jy;e2nq41ve;mbur0nf38;r0t;inKleBocus,rJuI;el,rbiA;aBeA;an4e;aBu4;ei2k8Bla43oIyc3;gni39nci3up,v1;oot,uI;ff;ct,d,liIp;se,ze;tt3viA;aAenGit,o7;aWerUinpoiFlumm1LoTrLuI;b47ke,niArIt;poDsuI;aFe;eMoI;cKd,fe4XhibEmo7noJpo0sp1tru6vI;e,i6o5L;un4;la3Nu8;aGclu6dJf1occupy,sup0JvI;a6BeF;etermi4TiB;aGllu7rtr5Ksse4Q;cei2fo4NiAmea7plex,sIva6;eve8iCua6;mp1rItrol,ve;a6It6E;bOccuNmEpMutLverIwe;l07sJtu6Yu0wI;helm;ee,h1F;gr5Cnu2Cpa4;era7i4Ipo0;py,r;ey,seItaH;r2ss;aMe0ViJoIultiply;leCu6Pw;micJnIspla4;ce,g3us;!k;iIke,na9;m,ntaH;aPeLiIo0u3N;ke,ng1quIv5;eIi6S;fy;aKnIss5;d,gI;th5;rn,ve;ng2Gu1N;eep,idnJnI;e4Cow;ap;oHuI;gg3xtaI;po0;gno8mVnIrk;cTdRfQgeChPitia7ju8q1CsNtKun6EvI;a6eIo11;nt,rt,st;erJimi6BoxiPrI;odu4u6;aBn,pr03ru6C;iCpi8tIu8;all,il,ruB;abEibE;eCo3Eu0;iIul9;ca7;i7lu6;b5Xmer0pI;aLer4Uin9ly,oJrI;e3Ais6Bo2;rt,se,veI;riA;le,rt;aLeKiIoiCuD;de,jaInd1;ck;ar,iT;mp1ng,pp5raIve;ng5Mss;ath1et,iMle27oLrI;aJeIow;et;b,pp3ze;!ve5A;gg3ve;aTer45i5RlSorMrJuI;lf4Cndrai0r48;eJiIolic;ght5;e0Qsh5;b3XeLfeEgJsI;a3Dee;eIi2;!t;clo0go,shIwa4Z;ad3F;att1ee,i36;lt1st5;a0OdEl0Mm0FnXquip,rWsVtGvTxI;aRcPeDhOiNpJtIu6;ing0Yol;eKi8lIo0un9;aHoI;it,re;ct,di7l;st,t;a3oDu3B;e30lI;a10u6;lt,mi28;alua7oI;ke,l2;chew,pou0tab19;a0u4U;aYcVdTfSgQhan4joy,lPqOrNsuMtKvI;e0YisI;a9i50;er,i4rI;aHenGuC;e,re;iGol0F;ui8;ar9iC;a9eIra2ulf;nd1;or4;ang1oIu8;r0w;irc3lo0ou0ErJuI;mb1;oaGy4D;b3ct;bKer9pI;hasiIow1;ze;aKody,rI;a4oiI;d1l;lm,rk;ap0eBuI;ci40de;rIt;ma0Rn;a0Re04iKo,rIwind3;aw,ed9oI;wn;agno0e,ff1g,mi2Kne,sLvI;eIul9;rIst;ge,t;aWbVcQlod9mant3pNru3TsMtI;iIoDu37;lJngI;uiA;!l;ol2ua6;eJlIo0ro2;a4ea0;n0r0;a2Xe36lKoIu0S;uIv1;ra9;aIo0;im;a3Kur0;b3rm;af5b01cVduBep5fUliTmQnOpMrLsiCtaGvI;eIol2;lop;ch;a20i2;aDiBloIoD;re,y;oIy;te,un4;eJoI;liA;an;mEv1;a4i0Ao06raud,y;ei2iMla8oKrI;ee,yI;!pt;de,mIup3;missi34po0;de,ma7ph1;aJrief,uI;g,nk;rk;mp5rk5uF;a0Dea0h0Ai09l08oKrIurta1G;a2ea7ipp3uI;mb3;ales4e04habEinci6ll03m00nIrro6;cXdUfQju8no7qu1sLtKvI;eIin4;ne,r9y;aHin2Bribu7;er2iLoli2Epi8tJuI;lt,me;itu7raH;in;d1st;eKiJoIroFu0;rm;de,gu8rm;ss;eJoI;ne;mn,n0;eIlu6ur;al,i2;buCe,men4pI;eIi3ly;l,te;eBi6u6;r4xiC;ean0iT;rcumveFte;eJirp,oI;o0p;riAw;ncIre5t1ulk;el;a02eSi6lQoPrKuI;iXrIy;st,y;aLeaKiJoad5;en;ng;stfeLtX;ke;il,l11mba0WrrMth1;eIow;ed;!coQfrie1LgPhMliLqueaKstJtrIwild1;ay;ow;th;e2tt3;a2eJoI;ld;ad;!in,ui3;me;bysEckfi8ff3tI;he;b15c0Rd0Iff0Ggree,l0Cm09n03ppZrXsQttOuMvJwaE;it;eDoI;id;rt;gIto0X;meF;aIeCraB;ch,in;pi8sJtoI;niA;aKeIi04u8;mb3rt,ss;le;il;re;g0Hi0ou0rI;an9i2;eaKly,oiFrI;ai0o2;nt;r,se;aMi0GnJtI;icipa7;eJoIul;un4y;al;ly0;aJu0;se;lga08ze;iKlI;e9oIu6;t,w;gn;ix,oI;rd;a03jNmiKoJsoI;rb;pt,rn;niIt;st1;er;ouJuC;st;rn;cLhie2knowled9quiItiva7;es4re;ce;ge;eQliOoKrJusI;e,tom;ue;mIst;moJpI;any,liA;da7;ma7;te;pt;andPduBet,i6oKsI;coKol2;ve;liArt,uI;nd;sh;de;ct;on",
  "Person": "true¦0:1Q;a29b1Zc1Md1Ee18f15g13h0Ri0Qj0Nk0Jl0Gm09n06o05p00rPsItCusain bolt,v9w4xzibit,y1;anni,oko on2uji,v1;an,es;en,o;a3ednesday adams,i2o1;lfram,o0Q;ll ferrell,z khalifa;lt disn1Qr1;hol,r0G;a2i1oltai06;n dies0Zrginia wo17;lentino rossi,n goG;a4h3i2ripp,u1yra banks;lZpac shakur;ger woods,mba07;eresa may,or;kashi,t1ylor;um,ya1B;a5carlett johanss0h4i3lobodan milosevic,no2ocr1Lpider1uperm0Fwami; m0Em0E;op dogg,w whi1H;egfried,nbad;akespeaTerlock holm1Sia labeouf;ddam hussa16nt1;a cla11ig9;aAe6i5o3u1za;mi,n dmc,paul,sh limbau1;gh;bin hood,d stew16nald1thko;in0Mo;han0Yngo starr,valdo;ese witherspo0i1mbrandt;ll2nh1;old;ey,y;chmaninoff,ffi,iJshid,y roma1H;a4e3i2la16o1uff daddy;cahont0Ie;lar,p19;le,rZ;lm17ris hilt0;leg,prah winfr0Sra;a2e1iles cra1Bostradam0J; yo,l5tt06wmQ;pole0s;a5e4i2o1ubar03;by,lie5net,rriss0N;randa ju1tt romn0M;ly;rl0GssiaB;cklemo1rkov,s0ta hari,ya angelou;re;ady gaga,e1ibera0Pu;bron jam0Xch wale1e;sa;anye west,e3i1obe bryant;d cudi,efer suther1;la0P;ats,sha;a2effers0fk,k rowling,rr tolki1;en;ck the ripp0Mwaharlal nehru,y z;liTnez,ron m7;a7e5i3u1;lk hog5mphrey1sa01;! bog05;l1tl0H;de; m1dwig,nry 4;an;ile selassFlle ber4m3rrison1;! 1;ford;id,mo09;ry;ast0iannis,o1;odwPtye;ergus0lorence nightinga08r1;an1ederic chopN;s,z;ff5m2nya,ustaXzeki1;el;eril lagasse,i1;le zatop1nem;ek;ie;a6e4i2octor w1rake;ho;ck w1ego maradoC;olf;g1mi lovaOnzel washingt0;as;l1nHrth vadR;ai lNt0;a8h5lint0o1thulhu;n1olio;an,fuci1;us;on;aucKop2ristian baMy1;na;in;millo,ptain beefhe4r1;dinal wols2son1;! palmF;ey;art;a8e5hatt,i3oHro1;ck,n1;te;ll g1ng crosby;atB;ck,nazir bhut2rtil,yon1;ce;to;nksy,rack ob1;ama;l 6r3shton kutch2vril lavig8yn ra1;nd;er;chimed2istot1;le;es;capo2paci1;no;ne",
  "Adjective": "true¦0:AI;1:BS;2:BI;3:BA;4:A8;5:84;6:AV;7:AN;8:AF;9:7H;A:BQ;B:AY;C:BC;D:BH;E:9Y;aA2b9Ec8Fd7We79f6Ng6Eh61i4Xj4Wk4Tl4Im41n3Po36p2Oquart7Pr2Ds1Dt14uSvOwFye29;aMeKhIiHoF;man5oFrth7G;dADzy;despreB1n w97s86;acked1UoleF;!sa6;ather1PeFll o70ste1D;!k5;nt1Ist6Ate4;aHeGiFola5T;bBUce versa,gi3Lle;ng67rsa5R;ca1gBSluAV;lt0PnLpHrGsFttermoBL;ef9Ku3;b96ge1; Hb32pGsFtiAH;ca6ide d4R;er,i85;f52to da2;a0Fbeco0Hc0Bd04e02f01gu1XheaBGiXkn4OmUnTopp06pRrNsJtHus0wF;aFiel3K;nt0rra0P;app0eXoF;ld,uS;eHi37o5ApGuF;perv06spec39;e1ok9O;en,ttl0;eFu5;cogn06gul2RlGqu84sF;erv0olv0;at0en33;aFrecede0E;id,rallel0;am0otic0;aFet;rri0tF;ch0;nFq26vers3;sur0terFv7U;eFrupt0;st0;air,inish0orese98;mploy0n7Ov97xpF;ect0lain0;eHisFocume01ue;clFput0;os0;cid0rF;!a8Scov9ha8Jlyi8nea8Gprivileg0sMwF;aFei9I;t9y;hGircumcFonvin2U;is0;aFeck0;lleng0rt0;b20ppea85ssuGttend0uthorF;iz0;mi8;i4Ara;aLeIhoHip 25oGrF;anspare1encha1i2;geth9leADp notch,rpB;rny,ugh6H;ena8DmpGrFs6U;r49tia4;eCo8P;leFst4M;nt0;a0Dc09e07h06i04ki03l01mug,nobbi4XoVpRqueami4XtKuFymb94;bHccinAi generis,pFr5;erFre7N;! dup9b,vi70;du0li7Lp6IsFurb7J;eq9Atanda9X;aKeJi16o2QrGubboFy4Q;rn;aightFin5GungS; fFfF;or7V;adfa9Pri6;lwa6Ftu82;arHeGir6NlendBot Fry;on;c3Qe1S;k5se; call0lImb9phistic16rHuFviV;ndFth1B;proof;dBry;dFub6; o2A;e60ipF;pe4shod;ll0n d7R;g2HnF;ceEg6ist9;am3Se9;co1Zem5lfFn6Are7; suf4Xi43;aGholFient3A;ar5;rlFt4A;et;cr0me,tisfac7F;aOeIheumatoBiGoF;bu8Ztt7Gy3;ghtFv3; 1Sf6X;cJdu8PlInown0pro69sGtF;ard0;is47oF;lu2na1;e1Suc45;alcit8Xe1ondi2;bBci3mpa1;aSePicayu7laOoNrGuF;bl7Tnjabi;eKiIoF;b7VfGmi49pFxi2M;er,ort81;a7uD;maFor,sti7va2;!ry;ciDexis0Ima2CpaB;in55puli8G;cBid;ac2Ynt 3IrFti2;ma40tFv7W;!i3Z;i2YrFss7R;anoBtF; 5XiF;al,s5V;bSffQkPld OnMrLth9utKverF;!aIbMdHhGni75seas,t,wF;ei74rou74;a63e7A;ue;ll;do1Ger,si6A;d3Qg2Aotu5Z; bFbFe on o7g3Uli7;oa80;fashion0school;!ay; gua7XbFha5Uli7;eat;eHligGsF;ce7er0So1C;at0;diFse;a1e1;aOeNiMoGuF;anc0de; moEnHrthFt6V;!eFwe7L;a7Krn;chaGdescri7Iprof30sF;top;la1;ght5;arby,cessa4ighbor5wlyw0xt;k0usiaFv3;ti8;aQeNiLoHuF;dIltiF;facet0p6;deHlGnFot,rbBst;ochro4Xth5;dy;rn,st;ddle ag0nF;dbloZi,or;ag9diocEga,naGrFtropolit4Q;e,ry;ci8;cIgenta,inHj0Fkeshift,mmGnFri4Oscu61ver18;da5Dy;ali4Lo4U;!stream;abEho;aOeLiIoFumberi8;ngFuti1R;stan3RtF;erm,i4H;ghtGteraF;l,ry,te;heart0wei5O;ft JgFss9th3;al,eFi0M;nda4;nguBps0te5;apGind5noF;wi8;ut;ad0itte4uniW;ce co0Hgno6Mll0Cm04nHpso 2UrF;a2releF;va1; ZaYcoWdReQfOgrNhibi4Ri05nMoLsHtFvalu5M;aAeF;nDrdepe2K;a7iGolFuboI;ub6ve1;de,gF;nifica1;rdi5N;a2er;own;eriIiLluenVrF;ar0eq5H;pt,rt;eHiGoFul1O;or;e,reA;fiFpe26termi5E;ni2;mpFnsideCrreA;le2;ccuCdeq5Ene,ppr4J;fFsitu,vitro;ro1;mJpF;arHeGl15oFrop9;li2r11;n2LrfeA;ti3;aGeFi18;d4BnD;tuE;egGiF;c0YteC;al,iF;tiF;ma2;ld;aOelNiLoFuma7;a4meInHrrGsFur5;ti6;if4E;e58o3U; ma3GsF;ick;ghfalut2HspF;an49;li00pf33;i4llow0ndGrdFtM; 05coEworki8;sy,y;aLener44iga3Blob3oKrGuF;il1Nng ho;aFea1Fizzl0;cGtF;ef2Vis;ef2U;ld3Aod;iFuc2D;nf2R;aVeSiQlOoJrF;aGeFil5ug3;q43tf2O;gFnt3S;i6ra1;lk13oHrF; keeps,eFge0Vm9tu41;g0Ei2Ds3R;liF;sh;ag4Mowe4uF;e1or45;e4nF;al,i2;d Gmini7rF;ti6ve1;up;bl0lDmIr Fst pac0ux;oGreacF;hi8;ff;ed,ili0R;aXfVlTmQnOqu3rMthere3veryday,xF;aApIquisi2traHuF;be48lF;ta1;!va2L;edRlF;icF;it;eAstF;whi6; Famor0ough,tiE;rou2sui2;erGiF;ne1;ge1;dFe2Aoq34;er5;ficF;ie1;g9sF;t,ygF;oi8;er;aWeMiHoGrFue;ea4owY;ci6mina1ne,r31ti8ubQ;dact2Jfficult,m,sGverF;ge1se;creGePjoi1paCtF;a1inA;et,te; Nadp0WceMfiLgeneCliJmuEpeIreliAsGvoF;id,ut;pFtitu2ul1L;eCoF;nde1;ca2ghF;tf13;a1ni2;as0;facto;i5ngero0I;ar0Ce09h07i06l05oOrIuF;rmudgeon5stoma4teF;sy;ly;aIeHu1EystalF; cleFli7;ar;epy;fFv17z0;ty;erUgTloSmPnGrpoCunterclVveFy;rt;cLdJgr21jIsHtrF;aFi2;dic0Yry;eq1Yta1;oi1ug3;escenFuN;di8;a1QeFiD;it0;atoDmensuCpF;ass1SulF;so4;ni3ss3;e1niza1;ci1J;ockwiD;rcumspeAvil;eFintzy;e4wy;leGrtaF;in;ba2;diac,ef00;a00ePiLliJoGrFuck nak0;and new,isk,on22;gGldface,naF; fi05fi05;us;nd,tF;he;gGpartisFzarE;an;tiF;me;autifOhiNlLnHsFyoN;iWtselF;li8;eGiFt;gn;aFfi03;th;at0oF;v0w;nd;ul;ckwards,rF;e,rT; priori,b13c0Zd0Tf0Ng0Ihe0Hl09mp6nt06pZrTsQttracti0MuLvIwF;aGkF;wa1B;ke,re;ant garGeraF;ge;de;diIsteEtF;heFoimmu7;nt07;re;to4;hGlFtu2;eep;en;bitIchiv3roHtF;ifiFsy;ci3;ga1;ra4;ry;pFt;aHetizi8rF;oprF;ia2;llFre1;ed,i8;ng;iquFsy;at0e;ed;cohKiJkaHl,oGriFterX;ght;ne,of;li7;ne;ke,ve;olF;ic;ad;ain07gressiIi6rF;eeF;ab6;le;ve;fGraB;id;ectGlF;ue1;ioF;na2; JaIeGvF;erD;pt,qF;ua2;ma1;hoc,infinitum;cuCquiGtu3u2;al;esce1;ra2;erSjeAlPoNrKsGuF;nda1;e1olu2trF;aAuD;se;te;eaGuF;pt;st;aFve;rd;aFe;ze;ct;ra1;nt",
  "Pronoun": "true¦elle,h3i2me,she,th0us,we,you;e0ou;e,m,y;!l,t;e,im",
  "Preposition": "true¦aPbMcLdKexcept,fIinGmid,notwithstandiWoDpXqua,sCt7u4v2w0;/o,hereSith0;! whHin,oW;ersus,i0;a,s a vis;n1p0;!on;like,til;h1ill,oward0;!s;an,ereby,r0;ough0u;!oM;ans,ince,o that,uch G;f1n0ut;!to;!f;! 0to;effect,part;or,r0;om;espite,own,u3;hez,irca;ar1e0oBy;sides,tween;ri7;bo8cross,ft7lo6m4propos,round,s1t0;!op;! 0;a whole,long 0;as;id0ong0;!st;ng;er;ut",
  "SportsTeam": "true¦0:18;1:1E;2:1D;3:14;a1Db15c0Sd0Kfc dallas,g0Ihouston 0Hindiana0Gjacksonville jagua0k0El0Am01new UoRpKqueens parkJreal salt lake,sBt6utah jazz,vancouver whitecaps,w4yW;ashington 4h10;natio1Mredski2wizar0W;ampa bay 7e6o4;ronto 4ttenham hotspur;blue ja0Mrapto0;nnessee tita2xasD;buccanee0ra0K;a8eattle 6porting kansas0Wt4; louis 4oke0V;c1Drams;marine0s4;eah13ounH;cramento Rn 4;antonio spu0diego 4francisco gJjose earthquak1;char08paB; ran07;a9h6ittsburgh 5ortland t4;imbe0rail blaze0;pirat1steele0;il4oenix su2;adelphia 4li1;eagl1philNunE;dr1;akland 4klahoma city thunder,rlando magic;athle0Lrai4;de0;england 8orleans 7york 4;g5je3knYme3red bul0Xy4;anke1;ian3;pelica2sain3;patrio3revolut4;ion;anchEeAi4ontreal impact;ami 8lwaukee b7nnesota 4;t5vi4;kings;imberwolv1wi2;rewe0uc0J;dolphi2heat,marli2;mphis grizz4ts;li1;a6eic5os angeles 4;clippe0dodFlaB;esterV; galaxy,ke0;ansas city 4nF;chiefs,roya0D; pace0polis col3;astr05dynamo,rocke3texa2;olden state warrio0reen bay pac4;ke0;allas 8e4i04od6;nver 6troit 4;lio2pisto2ti4;ge0;broncYnugge3;cowbo5maver4;icZ;ys;arEelLhAincinnati 8leveland 6ol4;orado r4umbus crew sc;api7ocki1;brow2cavalie0guar4in4;dia2;bengaVre4;ds;arlotte horAicago 4;b5cubs,fire,wh4;iteB;ea0ulQ;diff4olina panthe0; city;altimore Alackburn rove0oston 6rooklyn 4uffalo bilN;ne3;ts;cel5red4; sox;tics;rs;oriol1rave2;rizona Ast8tlanta 4;brav1falco2h4;awA;ns;es;on villa,r4;os;c6di4;amondbac4;ks;ardi4;na4;ls",
  "Unit": "true¦a07b04cXdWexVfTgRhePinYjoule0BkMlJmDnan08oCp9quart0Bsq ft,t7volts,w6y2ze3°1µ0;g,s;c,f,n;dVear1o0;ttR; 0s 0;old;att,b;erNon0;!ne02;ascals,e1i0;cXnt00;rcent,tJ;hms,unceY;/s,e4i0m²,²,³;/h,cro2l0;e0liK;!²;grLsR;gCtJ;it1u0;menQx;erPreP;b5elvins,ilo1m0notO;/h,ph,²;!byGgrEmCs;ct0rtzL;aJogrC;allonJb0ig3rB;ps;a0emtEl oz,t4;hrenheit,radG;aby9;eci3m1;aratDe1m0oulombD;²,³;lsius,nti0;gr2lit1m0;et0;er8;am7;b1y0;te5;l,ps;c2tt0;os0;econd1;re0;!s",
  "Noun|Gerund": "true¦0:3O;1:3M;2:3N;3:3D;4:32;5:2V;6:3E;7:3K;8:36;9:3J;A:3B;a3Pb37c2Jd27e23f1Vg1Sh1Mi1Ij1Gk1Dl18m13n11o0Wp0Pques0Sr0EsTtNunderMvKwFyDzB;eroi0oB;ni0o3P;aw2eB;ar2l3;aEed4hispe5i5oCrB;ap8est3i1;n0ErB;ki0r31;i1r2s9tc9;isualizi0oB;lunt1Vti0;stan4ta6;aFeDhin6iCraBy8;c6di0i2vel1M;mi0p8;aBs1;c9si0;l6n2s1;aUcReQhOiMkatKl2Wmo6nowJpeItFuCwB;ea5im37;b35f0FrB;fi0vB;e2Mi2J;aAoryt1KrCuB;d2KfS;etc9ugg3;l3n4;bCi0;ebBi0;oar4;gnBnAt1;a3i0;ip8oB;p8rte2u1;a1r27t1;hCo5reBulp1;a2Qe2;edu3oo3;i3yi0;aKeEi4oCuB;li0n2;oBwi0;fi0;aFcEhear7laxi0nDpor1sB;pon4tructB;r2Iu5;de5;or4yc3;di0so2;p8ti0;aFeacek20laEoCrBublis9;a1Teten4in1oces7;iso2siB;tio2;n2yi0;ckaAin1rB;ki0t1O;fEpeDrganiCvB;erco24ula1;si0zi0;ni0ra1;fe5;avi0QeBur7;gotia1twor6;aDeCi2oB;de3nito5;a2dita1e1ssaA;int0XnBrke1;ifUufactu5;aEeaDiBodAyi0;cen7f1mi1stB;e2i0;r2si0;n4ug9;iCnB;ea4it1;c6l3;ogAuB;dAgg3stif12;ci0llust0VmDnBro2;nova1sp0NterBven1;ac1vie02;agi2plo4;aDea1iCoBun1;l4w3;ki0ri0;nd3rB;roWvB;es1;aCene0Lli4rBui4;ee1ie0N;rde2the5;aHeGiDlCorBros1un4;e0Pmat1;ir1oo4;gh1lCnBs9;anZdi0;i0li0;e3nX;r0Zscina1;a1du01nCxB;erci7plo5;chan1di0ginB;ee5;aLeHiGoub1rCum8wB;el3;aDeCiB;bb3n6vi0;a0Qs7;wi0;rTscoDvi0;ba1coZlBvelo8;eCiB;ve5;ga1;nGti0;aVelebUhSlPoDrBur3yc3;aBos7yi0;f1w3;aLdi0lJmFnBo6pi0ve5;dDsCvinB;ci0;trBul1;uc1;muniDpB;lBo7;ai2;ca1;lBo5;ec1;c9ti0;ap8eaCimToBubT;ni0t9;ni0ri0;aBee5;n1t1;ra1;m8rCs1te5;ri0;vi0;aPeNitMlLoGrDuB;dge1il4llBr8;yi0;an4eat9oadB;cas1;di0;a1mEokB;i0kB;ee8;pi0;bi0;es7oa1;c9i0;gin2lonAt1;gi0;bysit1c6ki0tt3;li0;ki0;bando2cGdverti7gi0pproac9rgDssuCtB;trac1;mi0;ui0;hi0;si0;coun1ti0;ti0;ni0;ng",
  "PhrasalVerb": "true¦0:92;1:96;2:8H;3:8V;4:8A;5:83;6:85;7:98;8:90;9:8G;A:8X;B:8R;C:8U;D:8S;E:70;F:97;G:8Y;H:81;I:7H;J:79;a9Fb7Uc6Rd6Le6Jf5Ig50h4Biron0j47k40l3Em31n2Yo2Wp2Cquiet Hr1Xs0KtZuXvacuu6QwNyammerBzK;ero Dip LonK;e0k0;by,ov9up;aQeMhLiKor0Mrit19;mp0n3Fpe0r5s5;ackAeel Di0S;aLiKn33;gh 3Wrd0;n Dr K;do1in,oJ;it 79k5lk Lrm 69sh Kt83v60;aw3do1o7up;aw3in,oC;rgeBsK;e 2herE;a00eYhViRoQrMuKypP;ckErn K;do1in,oJup;aLiKot0y 30;ckl7Zp F;ck HdK;e 5Y;n7Wp 3Es5K;ck MdLe Kghten 6me0p o0Rre0;aw3ba4do1in,up;e Iy 2;by,oG;ink Lrow K;aw3ba4in,up;ba4ov9up;aKe 77ll62;m 2r 5M;ckBke Llk K;ov9shit,u47;aKba4do1in,leave,o4Dup;ba4ft9pa69w3;a0Vc0Te0Mh0Ii0Fl09m08n07o06p01quar5GtQuOwK;earMiK;ngLtch K;aw3ba4o8K; by;cKi6Bm 2ss0;k 64;aReQiPoNrKud35;aigh2Det75iK;ke 7Sng K;al6Yup;p Krm2F;by,in,oG;c3Ln3Lr 2tc4O;p F;c3Jmp0nd LrKveAy 2O;e Ht 2L;ba4do1up;ar3GeNiMlLrKurB;ead0ingBuc5;a49it 6H;c5ll o3Cn 2;ak Fe1Xll0;a3Bber 2rt0und like;ap 5Vow Duggl5;ash 6Noke0;eep NiKow 6;cLp K;o6Dup;e 68;in,oK;ff,v9;de19gn 4NnKt 6Gz5;gKkE; al6Ale0;aMoKu5W;ot Kut0w 7M;aw3ba4f48oC;c2WdeEk6EveA;e Pll1Nnd Orv5tK; Ktl5J;do1foLin,o7upK;!on;ot,r5Z;aw3ba4do1in,o33up;oCto;al66out0rK;ap65ew 6J;ilAv5;aXeUiSoOuK;b 5Yle0n Kstl5;aLba4do1inKo2Ith4Nu5P;!to;c2Xr8w3;ll Mot LpeAuK;g3Ind17;a2Wf3Po7;ar8in,o7up;ng 68p oKs5;ff,p18;aKelAinEnt0;c6Hd K;o4Dup;c27t0;aZeYiWlToQrOsyc35uK;ll Mn5Kt K;aKba4do1in,oJto47up;pa4Dw3;a3Jdo1in,o21to45up;attleBess KiNop 2;ah2Fon;iLp Kr4Zu1Gwer 6N;do1in,o6Nup;nt0;aLuK;gEmp 6;ce u20y 6D;ck Kg0le 4An 6p5B;oJup;el 5NncilE;c53ir 39n0ss MtLy K;ba4oG; Hc2R;aw3ba4in,oJ;pKw4Y;e4Xt D;aLerd0oK;dAt53;il Hrrow H;aTeQiPoLuK;ddl5ll I;c1FnkeyMp 6uthAve K;aKdo1in,o4Lup;l4Nw3; wi4K;ss0x 2;asur5e3SlLss K;a21up;t 6;ke Ln 6rKs2Ax0;k 6ryA;do,fun,oCsure,up;a02eViQoLuK;ck0st I;aNc4Fg MoKse0;k Kse4D;aft9ba4do1forw37in56o0Zu46;in,oJ;d 6;e NghtMnLsKve 00;ten F;e 2k 2; 2e46;ar8do1in;aMt LvelK; oC;do1go,in,o7up;nEve K;in,oK;pKut;en;c5p 2sh LtchBughAy K;do1o59;in4Po7;eMick Lnock K;do1oCup;oCup;eLy K;in,up;l Ip K;aw3ba4do1f04in,oJto,up;aMoLuK;ic5mpE;ke3St H;c43zz 2;a01eWiToPuK;nLrrKsh 6;y 2;keLt K;ar8do1;r H;lKneErse3K;d Ke 2;ba4dKfast,o0Cup;ear,o1;de Lt K;ba4on,up;aw3o7;aKlp0;d Ml Ir Kt 2;fKof;rom;f11in,o03uW;cPm 2nLsh0ve Kz2P;at,it,to;d Lg KkerP;do1in,o2Tup;do1in,oK;ut,v9;k 2;aZeTive Rloss IoMrLunK; f0S;ab hold,in43ow 2U; Kof 2I;aMb1Mit,oLr8th1IuK;nd9;ff,n,v9;bo7ft9hQw3;aw3bKdo1in,oJrise,up,w3;a4ir2H;ar 6ek0t K;aLb1Fdo1in,oKr8up;ff,n,ut,v9;cLhKl2Fr8t,w3;ead;ross;d aKng 2;bo7;a0Ee07iYlUoQrMuK;ck Ke2N;ar8up;eLighten KownBy 2;aw3oG;eKshe27; 2z5;g 2lMol Krk I;aKwi20;bo7r8;d 6low 2;aLeKip0;sh0;g 6ke0mKrKtten H;e F;gRlPnNrLsKzzle0;h F;e Km 2;aw3ba4up;d0isK;h 2;e Kl 1T;aw3fPin,o7;ht ba4ure0;ePnLsK;s 2;cMd K;fKoG;or;e D;d04l 2;cNll Krm0t1G;aLbKdo1in,o09sho0Eth08victim;a4ehi2O;pa0C;e K;do1oGup;at Kdge0nd 12y5;in,o7up;aOi1HoNrK;aLess 6op KuN;aw3b03in,oC;gBwB; Ile0ubl1B;m 2;a0Ah05l02oOrLut K;aw3ba4do1oCup;ackBeep LoKy0;ss Dwd0;by,do1in,o0Uup;me NoLuntK; o2A;k 6l K;do1oG;aRbQforOin,oNtKu0O;hLoKrue;geth9;rough;ff,ut,v9;th,wK;ard;a4y;paKr8w3;rt;eaLose K;in,oCup;n 6r F;aNeLiK;ll0pE;ck Der Kw F;on,up;t 2;lRncel0rOsMtch LveE; in;o1Nup;h Dt K;doubt,oG;ry LvK;e 08;aw3oJ;l Km H;aLba4do1oJup;ff,n,ut;r8w3;a0Ve0MiteAl0Fo04rQuK;bblNckl05il0Dlk 6ndl05rLsKtMy FzzA;t 00;n 0HsK;t D;e I;ov9;anWeaUiLush K;oGup;ghQng K;aNba4do1forMin,oLuK;nd9p;n,ut;th;bo7lKr8w3;ong;teK;n 2;k K;do1in,o7up;ch0;arTg 6iRn5oPrNssMttlLunce Kx D;aw3ba4;e 6; ar8;e H;do1;k Dt 2;e 2;l 6;do1up;d 2;aPeed0oKurt0;cMw K;aw3ba4do1o7up;ck;k K;in,oC;ck0nk0stA; oQaNef 2lt0nd K;do1ov9up;er;up;r Lt K;do1in,oCup;do1o7;ff,nK;to;ck Pil0nMrgLsK;h D;ainBe D;g DkB; on;in,o7;aw3do1in,oCup;ff,ut;ay;ct FdQir0sk MuctionA; oG;ff;ar8o7;ouK;nd; o7;d K;do1oKup;ff,n;wn;o7up;ut",
  "ProperNoun": "true¦aIbDc8dalhousHe7f5gosford,h4iron maiden,kirby,landsdowne,m2nis,r1s0wembF;herwood,paldiB;iel,othwe1;cgi0ercedes,issy;ll;intBudsB;airview,lorence,ra0;mpt9nco;lmo,uro;a1h0;arlt6es5risti;rl0talina;et4i0;ng;arb3e0;et1nt0rke0;ley;on;ie;bid,jax",
  "Person|Place": "true¦a8d6h4jordan,k3orlando,s1vi0;ctor9rgin9;a0ydney;lvador,mara,ntia4;ent,obe;amil0ous0;ton;arw2ie0;go;lexandr1ust0;in;ia",
  "LastName": "true¦0:BR;1:BF;2:B5;3:BH;4:AX;5:9Y;6:B6;7:BK;8:B0;9:AV;A:AL;B:8Q;C:8G;D:7K;E:BM;F:AH;aBDb9Zc8Wd88e81f7Kg6Wh64i60j5Lk4Vl4Dm39n2Wo2Op25quispe,r1Ls0Pt0Ev03wTxSyKzG;aIhGimmerm6A;aGou,u;ng,o;khar5ytsE;aKeun9BiHoGun;koya32shiBU;!lG;diGmaz;rim,z;maGng;da,g52mo83sGzaC;aChiBV;iao,u;aLeJiHoGright,u;jcA5lff,ng;lGmm0nkl0sniewsC;kiB1liams33s3;bGiss,lt0;b,er,st0;a6Vgn0lHtG;anabe,s3;k0sh,tG;e2Non;aLeKiHoGukD;gt,lk5roby5;dHllalGnogr3Kr1Css0val3S;ba,ob1W;al,ov4;lasHsel8W;lJn dIrgBEsHzG;qu7;ilyEqu7siljE;en b6Aijk,yk;enzueAIverde;aPeix1VhKi2j8ka43oJrIsui,uG;om5UrG;c2n0un1;an,emblA7ynisC;dorAMlst3Km4rrAth;atch0i8UoG;mHrG;are84laci79;ps3sG;en,on;hirDkah9Mnaka,te,varA;a06ch01eYhUiRmOoMtIuHvGzabo;en9Jobod3N;ar7bot4lliv2zuC;aIeHoG;i7Bj4AyanAB;ele,in2FpheBvens25;l8rm0;kol5lovy5re7Tsa,to,uG;ng,sa;iGy72;rn5tG;!h;l71mHnGrbu;at9cla9Egh;moBo7M;aIeGimizu;hu,vchG;en8Luk;la,r1G;gu9infe5YmGoh,pulveA7rra5P;jGyG;on5;evi6iltz,miHneid0roed0uGwarz;be3Elz;dHtG;!t,z;!t;ar4Th8ito,ka4OlJnGr4saCto,unde19v4;ch7dHtGz;a5Le,os;b53e16;as,ihDm4Po0Y;aVeSiPoJuHyG;a6oo,u;bio,iz,sG;so,u;bKc8Fdrigue67ge10j9YmJosevelt,sItHux,wG;e,li6;a9Ch;enb4Usi;a54e4L;erts15i93;bei4JcHes,vGzzo;as,e9;ci,hards12;ag2es,iHut0yG;es,nol5N;s,t0;dImHnGsmu97v6C;tan1;ir7os;ic,u;aUeOhMiJoHrGut8;asad,if6Zochazk27;lishc2GpGrti72u10we76;e3Aov51;cHe45nG;as,to;as70hl0;aGillips;k,m,n6I;a3Hde3Wete0Bna,rJtG;ersHrovGters54;!a,ic;!en,on;eGic,kiBss3;i9ra,tz,z;h86k,padopoulIrk0tHvG;ic,l4N;el,te39;os;bMconn2Ag2TlJnei6PrHsbor6XweBzG;dem7Rturk;ella4DtGwe6N;ega,iz;iGof7Hs8I;vGyn1R;ei9;aSri1;aPeNiJoGune50ym2;rHvGwak;ak4Qik5otn66;odahl,r4S;cholsZeHkolGls4Jx3;ic,ov84;ls1miG;!n1;ils3mG;co4Xec;gy,kaGray2sh,var38;jiGmu9shiG;ma;a07c04eZiWoMuHyeG;rs;lJnIrGssoli6S;atGp03r7C;i,ov4;oz,te58;d0l0;h2lOnNo0RrHsGza1A;er,s;aKeJiIoz5risHtG;e56on;!on;!n7K;au,i9no,t5J;!lA;r1Btgome59;i3El0;cracFhhail5kkeHlG;l0os64;ls1;hmeJiIj30lHn3Krci0ssiGyer2N;!er;n0Po;er,j0;dDti;cartHlG;aughl8e2;hy;dQe7Egnu68i0jer3TkPmNnMrItHyG;er,r;ei,ic,su21thews;iHkDquAroqu8tinG;ez,s;a5Xc,nG;!o;ci5Vn;a5UmG;ad5;ar5e6Kin1;rig77s1;aVeOiLoJuHyG;!nch;k4nGo;d,gu;mbarGpe3Fvr4we;di;!nGu,yana2B;coln,dG;b21holm,strom;bedEfeKhIitn0kaHn8rGw35;oy;!j;m11tG;in1on1;bvGvG;re;iGmmy,ng,rs2Qu,voie,ws3;ne,t1F;aZeYh2iWlUnez50oNrJuHvar2woG;k,n;cerGmar68znets5;a,o34;aHem0isGyeziu;h23t3O;m0sni4Fus3KvG;ch4O;bay57ch,rh0Usk16vaIwalGzl5;czGsC;yk;cIlG;!cGen4K;huk;!ev4ic,s;e8uiveG;rt;eff0kGl4mu9nnun1;ucF;ll0nnedy;hn,llKminsCne,pIrHstra3Qto,ur,yGzl5;a,s0;j0Rls22;l2oG;or;oe;aPenOha6im14oHuG;ng,r4;e32hInHrge32u6vG;anD;es,ss3;anHnsG;en,on,t3;nesGs1R;en,s1;kiBnings,s1;cJkob4EnGrv0E;kDsG;en,sG;en0Ion;ks3obs2A;brahimDglesi5Nke5Fl0Qno07oneIshikHto,vanoG;u,v54;awa;scu;aVeOiNjaltal8oIrist50uG;!aGb0ghAynh;m2ng;a6dz4fIjgaa3Hk,lHpUrGwe,x3X;ak1Gvat;mAt;er,fm3WmG;ann;ggiBtchcock;iJmingw4BnHrGss;nand7re9;deGriks1;rs3;kkiHnG;on1;la,n1;dz4g1lvoQmOns0ZqNrMsJuIwHyG;asFes;kiB;g1ng;anHhiG;mo14;i,ov0J;di6p0r10t;ue;alaG;in1;rs1;aVeorgUheorghe,iSjonRoLrJuGw3;errGnnar3Co,staf3Ctierr7zm2;a,eG;ro;ayli6ee2Lg4iffithGub0;!s;lIme0UnHodGrbachE;e,m2;calvAzale0S;dGubE;bGs0E;erg;aj,i;bs3l,mGordaO;en7;iev3U;gnMlJmaIndFo,rGsFuthi0;cGdn0za;ia;ge;eaHlG;agh0i,o;no;e,on;aVerQiLjeldsted,lKoIrHuG;chs,entAji41ll0;eem2iedm2;ntaGrt8urni0wl0;na;emi6orA;lipIsHtzgeraG;ld;ch0h0;ovG;!ic;hatDnanIrG;arGei9;a,i;deY;ov4;b0rre1D;dKinsJriksIsGvaB;cob3GpGtra3D;inoza,osiQ;en,s3;te8;er,is3warG;ds;aXePiNjurhuMoKrisco15uHvorakG;!oT;arte,boHmitru,nn,rGt3C;and,ic;is;g2he0Omingu7nErd1ItG;to;us;aGcki2Hmitr2Ossanayake,x3;s,z; JbnaIlHmirGrvisFvi,w2;!ov4;gado,ic;th;bo0groot,jo6lHsilGvriA;va;a cruz,e3uG;ca;hl,mcevsCnIt2WviG;dGes,s;ov,s3;ielsGku22;!en;ki;a0Be06hRiobQlarkPoIrGunningh1H;awfo0RivGuz;elli;h1lKntJoIrGs2Nx;byn,reG;a,ia;ke,p0;i,rer2K;em2liB;ns;!e;anu;aOeMiu,oIristGu6we;eGiaG;ns1;i,ng,p9uHwGy;!dH;dGng;huJ;!n,onGu6;!g;kJnIpm2ttHudhGv7;ry;erjee,o14;!d,g;ma,raboG;rty;bJl0Cng4rG;eghetHnG;a,y;ti;an,ota1C;cerAlder3mpbeLrIstGvadi0B;iGro;llo;doHl0Er,t0uGvalho;so;so,zo;ll;a0Fe01hYiXlUoNrKuIyG;rLtyG;qi;chan2rG;ke,ns;ank5iem,oGyant;oks,wG;ne;gdan5nIruya,su,uchaHyKziG;c,n5;rd;darGik;enG;ko;ov;aGond15;nco,zG;ev4;ancFshw16;a08oGuiy2;umGwmG;ik;ckRethov1gu,ktPnNrG;gJisInG;ascoGds1;ni;ha;er,mG;anG;!n;gtGit7nP;ss3;asF;hi;er,hG;am;b4ch,ez,hRiley,kk0ldw8nMrIshHtAu0;es;ir;bInHtlGua;ett;es,i0;ieYosa;dGik;a9yoG;padhyG;ay;ra;k,ng;ic;bb0Acos09d07g04kht05lZnPrLsl2tJyG;aHd8;in;la;chis3kiG;ns3;aImstro6sl2;an;ng;ujo,ya;dJgelHsaG;ri;ovG;!a;ersJov,reG;aGjEws;ss1;en;en,on,s3;on;eksejEiyEmeiIvG;ar7es;ez;da;ev;arwHuilG;ar;al;ams,l0;er;ta;as",
  "Ordinal": "true¦eBf7nin5s3t0zeroE;enDhir1we0;lfCn7;d,t3;e0ixt8;cond,vent7;et0th;e6ie7;i2o0;r0urt3;tie4;ft1rst;ight0lev1;e0h,ie1;en0;th",
  "Cardinal": "true¦bEeBf5mEnine7one,s4t0zero;en,h2rDw0;e0o;lve,n5;irt6ousands,ree;even2ix2;i3o0;r1ur0;!t2;ty;ft0ve;e2y;ight0lev1;!e0y;en;illions",
  "Multiple": "true¦b3hundred,m3qu2se1t0;housand,r2;pt1xt1;adr0int0;illion",
  "City": "true¦0:74;1:61;2:6G;3:6J;4:5S;a68b53c4Id48e44f3Wg3Hh39i31j2Wk2Fl23m1Mn1Co19p0Wq0Ur0Os05tRuQvLwDxiBy9z5;a7h5i4Muri4O;a5e5ongsh0;ng3H;greb,nzib5G;ang2e5okoha3Sunfu;katerin3Hrev0;a5n0Q;m5Hn;arsBeAi6roclBu5;h0xi,zh5P;c7n5;d5nipeg,terth4;hoek,s1L;hi5Zkl3A;l63xford;aw;a8e6i5ladivost5Molgogr6L;en3lni6S;ni22r5;o3saill4N;lenc4Wncouv3Sr3ughn;lan bat1Crumqi,trecht;aFbilisi,eEheDiBo9r7u5;l21n63r5;in,ku;i5ondh62;es51poli;kyo,m2Zron1Pulo5;n,uS;an5jua3l2Tmisoa6Bra3;j4Tshui; hag62ssaloni2H;gucigal26hr0l av1U;briz,i6llinn,mpe56ng5rtu,shk2R;i3Esh0;an,chu1n0p2Eyu0;aEeDh8kopje,owe1Gt7u5;ra5zh4X;ba0Ht;aten is55ockholm,rasbou67uttga2V;an8e6i5;jiazhua1llo1m5Xy0;f50n5;ya1zh4H;gh3Kt4Q;att45o1Vv44;cramen16int ClBn5o paulo,ppo3Rrajevo; 7aa,t5;a 5o domin3E;a3fe,m1M;antonio,die3Cfrancisco,j5ped3Nsalvad0J;o5u0;se;em,t lake ci5Fz25;lou58peters24;a9e8i6o5;me,t59;ga,o5yadh;! de janei3F;cife,ims,nn3Jykjavik;b4Sip4lei2Inc2Pwalpindi;ingdao,u5;ez2i0Q;aFeEhDiCo9r7u6yong5;ya1;eb59ya1;a5etor3M;g52to;rt5zn0; 5la4Co;au prin0Melizabe24sa03;ls3Prae5Atts26;iladelph3Gnom pe1Aoenix;ki1tah tik3E;dua,lerYnaji,r4Ot5;na,r32;ak44des0Km1Mr6s5ttawa;a3Vlo;an,d06;a7ew5ing2Fovosibir1Jyc; 5cast36;del24orlea44taip14;g8iro4Wn5pl2Wshv33v0;ch6ji1t5;es,o1;a1o1;a6o5p4;ya;no,sa0W;aEeCi9o6u5;mb2Ani26sc3Y;gadishu,nt6s5;c13ul;evideo,pelli1Rre2Z;ami,l6n14s5;kolc,sissauga;an,waukee;cca,d5lbour2Mmph41ndo1Cssi3;an,ell2Xi3;cau,drAkass2Sl9n8r5shh4A;aca6ib5rakesh,se2L;or;i1Sy;a4EchFdal0Zi47;mo;id;aDeAi8o6u5vSy2;anMckn0Odhia3;n5s angel26;d2g bea1N;brev2Be3Lma5nz,sb2verpo28;!ss27; ma39i5;c5pzig;est16; p6g5ho2Wn0Cusan24;os;az,la33;aHharFiClaipeBo9rak0Du7y5;iv,o5;to;ala lump4n5;mi1sh0;hi0Hlka2Xpavog4si5wlo2;ce;da;ev,n5rkuk;gst2sha5;sa;k5toum;iv;bHdu3llakuric0Qmpa3Fn6ohsiu1ra5un1Iwaguc0Q;c0Pj;d5o,p4;ah1Ty;a7e6i5ohannesV;l1Vn0;dd36rusalem;ip4k5;ar2H;bad0mph1OnArkutUs7taXz5;mir,tapala5;pa;fah0l6tanb5;ul;am2Zi2H;che2d5;ianap2Mo20;aAe7o5yder2W; chi mi5ms,nolulu;nh;f6lsin5rakli2;ki;ei;ifa,lifax,mCn5rb1Dva3;g8nov01oi;aFdanEenDhCiPlasgBo9raz,u5;a5jr23;dal6ng5yaquil;zh1J;aja2Oupe;ld coa1Bthen5;bu2S;ow;ent;e0Uoa;sk;lw7n5za;dhi5gt1E;nag0U;ay;aisal29es,o8r6ukuya5;ma;ankfu5esno;rt;rt5sh0; wor6ale5;za;th;d5indhov0Pl paso;in5mont2;bur5;gh;aBe8ha0Xisp4o7resd0Lu5;b5esseldorf,nkirk,rb0shanbe;ai,l0I;ha,nggu0rtmu13;hradSl6nv5troit;er;hi;donghIe6k09l5masc1Zr es sala1KugavpiY;i0lU;gu,je2;aJebu,hAleve0Vo5raio02uriti1Q;lo7n6penhag0Ar5;do1Ok;akKst0V;gUm5;bo;aBen8i6ongqi1ristchur5;ch;ang m7ca5ttago1;go;g6n5;ai;du,zho1;ng5ttogr14;ch8sha,zh07;gliari,i9lga8mayenJn6pe town,r5tanO;acCdiff;ber1Ac5;un;ry;ro;aWeNhKirmingh0WoJr9u5;chareTdapeTenos air7r5s0tu0;g5sa;as;es;a9is6usse5;ls;ba6t5;ol;ne;sil8tisla7zzav5;il5;le;va;ia;goZst2;op6ubaneshw5;ar;al;iCl9ng8r5;g6l5n;in;en;aluru,hazi;fa6grade,o horizon5;te;st;ji1rut;ghd0BkFn9ot8r7s6yan n4;ur;el,r07;celo3i,ranquil09;ou;du1g6ja lu5;ka;alo6k5;ok;re;ng;ers5u;field;a05b02cc01ddis aba00gartaZhmedXizawl,lSmPnHqa00rEsBt7uck5;la5;nd;he7l5;an5;ta;ns;h5unci2;dod,gab5;at;li5;ngt2;on;a8c5kaOtwerp;hora6o3;na;ge;h7p5;ol5;is;eim;aravati,m0s5;terd5;am; 7buquerq6eppo,giers,ma5;ty;ue;basrah al qadim5mawsil al jadid5;ah;ab5;ad;la;ba;ra;idj0u dha5;bi;an;lbo6rh5;us;rg",
  "Region": "true¦0:2O;1:2L;2:2U;3:2F;a2Sb2Fc21d1Wes1Vf1Tg1Oh1Ki1Fj1Bk16l13m0Sn09o07pYqVrSsJtEuBverAw6y4zacatec2W;akut0o0Fu4;cat1k09;a5est 4isconsin,yomi1O;bengal,virgin0;rwick3shington4;! dc;acruz,mont;dmurt0t4;ah,tar4; 2Pa12;a6e5laxca1Vripu21u4;scaEva;langa2nnessee,x2J;bas10m4smQtar29;aulip2Hil nadu;a9elang07i7o5taf16u4ylh1J;ff02rr09s1E;me1Gno1Uuth 4;cZdY;ber0c4kkim,naloa;hu1ily;n5rawak,skatchew1xo4;ny; luis potosi,ta catari2;a4hodeA;j4ngp0C;asth1shahi;ingh29u4;e4intana roo;bec,en6retaro;aAe6rince edward4unjab; i4;sl0G;i,n5r4;ak,nambu0F;a0Rnsylv4;an0;ha0Pra4;!na;axa0Zdisha,h4klaho21ntar4reg7ss0Dx0I;io;aLeEo6u4;evo le4nav0X;on;r4tt18va scot0;f9mandy,th4; 4ampton3;c6d5yo4;rk3;ako1O;aroli2;olk;bras1Nva0Dw4; 6foundland4;! and labrad4;or;brunswick,hamp3jers5mexiTyork4;! state;ey;galPyarit;aAeghala0Mi6o4;nta2r4;dov0elos;ch6dlanDn5ss4zor11;issippi,ouri;as geraPneso18;ig1oac1;dhy12harasht0Gine,lac07ni5r4ssachusetts;anhao,i el,ylG;p4toba;ur;anca3e4incoln3ouisI;e4iR;ds;a6e5h4omi;aka06ul2;dah,lant1ntucky,ra01;bardino,lmyk0ns0Qr4;achay,el0nata0X;alis6har4iangxi;kh4;and;co;daho,llino7n4owa;d5gush4;et0;ia2;is;a6ert5i4un1;dalFm0D;ford3;mp3rya2waii;ansu,eorg0lou7oa,u4;an4izhou,jarat;ajuato,gdo4;ng;cester3;lori4uji1;da;sex;ageUe7o5uran4;go;rs4;et;lawaMrby3;aFeaEh9o4rim08umbr0;ahui7l6nnectic5rsi4ventry;ca;ut;i03orado;la;e5hattisgarh,i4uvash0;apRhuahua;chn5rke4;ss0;ya;ra;lGm4;bridge3peche;a9ihar,r8u4;ck4ryat0;ingham3;shi4;re;emen,itish columb0;h0ja cal8lk7s4v7;hkorto4que;st1;an;ar0;iforn0;ia;dygHguascalientes,lBndhr9r5ss4;am;izo2kans5un4;achal 7;as;na;a 4;pradesh;a6ber5t4;ai;ta;ba5s4;ka;ma;ea",
  "Place": "true¦0:4T;1:4V;2:44;3:4B;4:3I;a4Eb3Gc2Td2Ge26f25g1Vh1Ji1Fk1Cl14m0Vn0No0Jp08r04sTtNuLvJw7y5;a5o0Syz;kut1Bngtze;aDeChitBi9o5upatki,ycom2P;ki26o5;d5l1B;b3Ps5;i4to3Y;c0SllowbroCn5;c2Qgh2;by,chur1P;ed0ntw3Gs22;ke6r3St5;erf1f1; is0Gf3V;auxha3Mirgin is0Jost5;ok;laanbaatar,pto5xb3E;n,wn;a9eotihuac43h7ive49o6ru2Nsarskoe selo,u5;l2Dzigo47;nto,rquay,tt2J;am3e 5orn3E;bronx,hamptons;hiti,j mah0Iu1N;aEcotts bluff,eCfo,herbroQoApring9t7u5yd2F;dbu1Wn5;der03set3B;aff1ock2Nr5;atf1oud;hi37w24;ho,uth5; 1Iam1Zwo3E;a5i2O;f2Tt0;int lawrence riv3Pkhal2D;ayleigh,ed7i5oc1Z;chmo1Eo gran4ver5;be1Dfr09si4; s39cliffe,hi2Y;aCe9h8i5ompeii,utn2;c6ne5tcai2T; 2Pc0G;keri13t0;l,x;k,lh2mbr6n5r2J;n1Hzance;oke;cif38pahanaumokuak30r5;k5then0;si4w1K;ak7r6x5;f1l2X;ange county,d,f1inoco;mTw1G;e8i1Uo5;r5tt2N;th5wi0E; 0Sam19;uschwanste1Pw5; eng6a5h2market,po36;rk;la0P;a8co,e6i5uc;dt1Yll0Z;adow5ko0H;lands;chu picchu,gad2Ridsto1Ql8n7ple6r5;kh2; g1Cw11;hatt2Osf2B;ibu,t0ve1Z;a8e7gw,hr,in5owlOynd02;coln memori5dl2C;al;asi4w3;kefr7mbe1On5s,x;ca2Ig5si05;f1l27t0;ont;azan kreml14e6itchen2Gosrae,rasnoyar5ul;sk;ns0Hs1U;ax,cn,lf1n6ps5st;wiN;d5glew0Lverness;ian27ochina;aDeBi6kg,nd,ov5unti2H;d,enweep;gh6llc5;reL;bu03l5;and5;!s;r5yw0C;ef1tf1;libu24mp6r5stings;f1lem,row;stead,t0;aDodavari,r5uelph;avenAe5imsS;at 8en5; 6f1Fwi5;ch;acr3vall1H;brita0Flak3;hur5;st;ng3y villa0W;airhavHco,ra;aAgli9nf17ppi8u7ver6x5;et1Lf1;glad3t0;rope,st0;ng;nt0;rls1Ls5;t 5;e5si4;nd;aCe9fw,ig8o7ryd6u5xb;mfri3nstab00rh2tt0;en;nca18rcKv19wnt0B;by;n6r5vonpo1D;ry;!h2;nu8r5;l6t5;f1moor;ingt0;be;aLdg,eIgk,hClBo5royd0;l6m5rnwa0B;pt0;c7lingw6osse5;um;ood;he0S;earwat0St;a8el6i5uuk;chen itza,mney ro07natSricahua;m0Zt5;enh2;mor5rlottetPth2;ro;dar 5ntervilA;breaks,faZg5;rove;ld9m8r5versh2;lis6rizo pla5;in;le;bLpbellf1;weQ;aZcn,eNingl01kk,lackLolt0r5uckV;aGiAo5;ckt0ok5wns cany0;lyn,s5;i4to5;ne;de;dge6gh5;am,t0;n6t5;own;or5;th;ceb6m5;lNpt0;rid5;ge;bu5pool,wa8;rn;aconsfEdf1lBr9verly7x5;hi5;ll; hi5;lls;wi5;ck; air,l5;ingh2;am;ie5;ld;ltimore,rnsl6tters5;ea;ey;bLct0driadic,frica,ginJlGmFn9rc8s7tl6yleOzor3;es;!ant8;hcroft,ia; de triomphe,t6;adyr,ca8dov9tarct5;ic5; oce5;an;st5;er;ericas,s;be6dersh5hambra,list0;ot;rt0;cou5;rt;bot7i5;ngd0;on;sf1;ord",
  "Country": "true¦0:38;1:2L;2:3B;a2Xb2Ec22d1Ye1Sf1Mg1Ch1Ai14j12k0Zl0Um0Gn05om2pZqat1KrXsKtCu7v5wal4yemTz3;a25imbabwe;es,lis and futu2Y;a3enezue32ietnam;nuatu,tican city;gTk6nited 4ruXs3zbeE; 2Ca,sr;arab emirat0Kkingdom,states3;! of am2Y;!raiV;a8haCimor les0Co7rinidad 5u3;nis0rk3valu;ey,me2Zs and caic1V;and t3t3;oba1L;go,kel10nga;iw2ji3nz2T;ki2V;aDcotl1eCi9lov8o6pa2Dri lanka,u5w3yr0;az3edAitzerl1;il1;d2riname;lomon1Xmal0uth 3;afr2KkMsud2;ak0en0;erra leoFn3;gapo1Yt maart3;en;negLrb0ychellZ;int 3moa,n marino,udi arab0;hele26luc0mart21;epublic of ir0Eom2Euss0w3;an27;a4eIhilippinUitcairn1Mo3uerto riN;l1rtugF;ki2Dl4nama,pua new0Vra3;gu7;au,esti3;ne;aBe9i7or3;folk1Ith4w3;ay; k3ern mariana1D;or0O;caragua,ger3ue;!ia;p3ther1Aw zeal1;al;mib0u3;ru;a7exi6icro0Bo3yanm06;ldova,n3roc5zambA;a4gol0t3;enegro,serrat;co;cAdagasc01l7r5urit4yot3;te;an0i16;shall0Xtin3;ique;a4div3i,ta;es;wi,ys0;ao,ed02;a6e5i3uxembourg;b3echtenste12thu1G;er0ya;ban0Isotho;os,tv0;azakh1Fe4iriba04o3uwait,yrgyz1F;rXsovo;eling0Knya;a3erG;ma16p2;c7nd6r4s3taly,vory coast;le of m2rael;a3el1;n,q;ia,oJ;el1;aiTon3ungary;dur0Ng kong;aBermany,ha0QibraltAre8u3;a6ern5inea3ya0P;! biss3;au;sey;deloupe,m,tema0Q;e3na0N;ce,nl1;ar;bUmb0;a7i6r3;ance,ench 3;guia0Epoly3;nes0;ji,nl1;lklandUroeU;ast tim7cu6gypt,l salv6ngl1quatorial4ritr5st3thiop0;on0; guin3;ea;ad3;or;enmark,jibou5ominica4r con3;go;!n C;ti;aBentral african Ah8o5roat0u4yprRzech3; 9ia;ba,racao;c4lo3morQngo brazzaville,okGsta r04te de ivoiL;mb0;osE;i3ristmasG;le,na;republic;m3naUpe verde,ymanA;bod0ero3;on;aGeDhut2o9r5u3;lgar0r3;kina faso,ma,undi;azil,itish 3unei;virgin3; is3;lands;liv0nai5snia and herzegoviHtswaHuvet3; isl1;and;re;l3n8rmuG;ar3gium,ize;us;h4ngladesh,rbad3;os;am4ra3;in;as;fghaGlDmBn6r4ustr3zerbaij2;al0ia;genti3men0uba;na;dorra,g5t3;arct7igua and barbu3;da;o3uil3;la;er3;ica;b3ger0;an0;ia;ni3;st2;an",
  "FirstName": "true¦aTblair,cQdOfrancoZgabMhinaLilya,jHkClBm6ni4quinn,re3s0;h0umit,yd;ay,e0iloh;a,lby;g9ne;co,ko0;!s;a1el0ina,org6;!okuhF;ds,naia,r1tt0xiB;i,y;ion,lo;ashawn,eif,uca;a3e1ir0rM;an;lsFn0rry;dall,yat5;i,sD;a0essIie,ude;i1m0;ie,mG;me;ta;rie0y;le;arcy,ev0;an,on;as1h0;arl8eyenne;ey,sidy;drien,kira,l4nd1ubr0vi;ey;i,r0;a,e0;a,y;ex2f1o0;is;ie;ei,is",
  "WeekDay": "true¦fri2mon2s1t0wednesd3;hurs1ues1;aturd1und1;!d0;ay0;!s",
  "Month": "true¦dec0february,july,nov0octo1sept0;em0;ber",
  "Date": "true¦ago,on4som4t1week0yesterd5; end,ends;mr1o0;d2morrow;!w;ed0;ay",
  "Duration": "true¦centurAd8h7m5q4se3w1y0;ear8r8;eek0k7;!end,s;ason,c5;tr,uarter;i0onth3;llisecond2nute2;our1r1;ay0ecade0;!s;ies,y",
  "FemaleName": "true¦0:J7;1:JB;2:IJ;3:IK;4:J1;5:IO;6:JS;7:JO;8:HB;9:JK;A:H4;B:I2;C:IT;D:JH;E:IX;F:BA;G:I4;aGTbFLcDRdD0eBMfB4gADh9Ti9Gj8Dk7Cl5Wm48n3Lo3Hp33qu32r29s15t0Eu0Cv02wVxiTyOzH;aLeIineb,oHsof3;e3Sf3la,ra;h2iKlIna,ynH;ab,ep;da,ma;da,h2iHra;nab;aKeJi0FolB7uIvH;et8onDP;i0na;le0sen3;el,gm3Hn,rGLs8W;aoHme0nyi;m5XyAD;aMendDZhiDGiH;dele9lJnH;if48niHo0;e,f47;a,helmi0lHma;a,ow;ka0nB;aNeKiHusa5;ck84kIl8oleAviH;anFenJ4;ky,toriBK;da,lA8rHs0;a,nHoniH9;a,iFR;leHnesH9;nILrH;i1y;g9rHs6xHA;su5te;aYeUhRiNoLrIuHy2;i,la;acJ3iHu0J;c3na,sH;hFta;nHr0F;iFya;aJffaEOnHs6;a,gtiH;ng;!nFSra;aIeHomasi0;a,l9Oo8Ares1;l3ndolwethu;g9Fo88rIssH;!a,ie;eHi,ri7;sa,za;bOlMmKnIrHs6tia0wa0;a60yn;iHya;a,ka,s6;arFe2iHm77ra;!ka;a,iH;a,t6;at6it6;a0Ecarlett,e0AhWiSkye,neza0oQri,tNuIyH;bIGlvi1;ha,mayIJniAsIzH;an3Net8ie,y;anHi7;!a,e,nH;aCe;aIeH;fan4l5Dphan6E;cI5r5;b3fiAAm0LnHphi1;d2ia,ja,ya;er2lJmon1nIobh8QtH;a,i;dy;lETv3;aMeIirHo0risFDy5;a,lDM;ba,e0i5lJrH;iHr6Jyl;!d8Ifa;ia,lDZ;hd,iMki2nJrIu0w0yH;la,ma,na;i,le9on,ron,yn;aIda,ia,nHon;a,on;!ya;k6mH;!aa;lJrItaye82vH;da,inj;e0ife;en1i0ma;anA9bLd5Oh1SiBkKlJmInd2rHs6vannaC;aCi0;ant6i2;lDOma,ome;ee0in8Tu2;in1ri0;a05eZhXiUoHuthDM;bScRghQl8LnPsJwIxH;anB3ie,y;an,e0;aIeHie,lD;ann7ll1marDGtA;!lHnn1;iHyn;e,nH;a,dF;da,i,na;ayy8G;hel67io;bDRerAyn;a,cIkHmas,nFta,ya;ki,o;h8Xki;ea,iannGMoH;da,n1P;an0bJemFgi0iInHta,y0;a8Bee;han86na;a,eH;cHkaC;a,ca;bi0chIe,i0mo0nHquETy0;di,ia;aERelHiB;!e,le;een4ia0;aPeOhMiLoJrHute6A;iHudenCV;scil3LyamvaB;lHrt3;i0ly;a,paluk;ilome0oebe,ylH;is,lis;ggy,nelope,r5t2;ige,m0VnKo5rvaDMtIulH;a,et8in1;ricHt4T;a,e,ia;do2i07;ctav3dIfD3is6ksa0lHphD3umC5yunbileg;a,ga,iv3;eHvAF;l3t8;aWeUiMoIurHy5;!ay,ul;a,eJor,rIuH;f,r;aCeEma;ll1mi;aNcLhariBQkKlaJna,sHta,vi;anHha;ur;!y;a,iDZki;hoGk9YolH;a,e4P;!mh;hir,lHna,risDEsreE;!a,iDDlBV;asuMdLh3i6Dl5nKomi7rgEVtH;aHhal4;lHs6;i1ya;cy,et8;e9iF0ya;nngu2X;a0Ackenz4e02iMoJrignayani,uriDJyH;a,rH;a,iOlNna,tG;bi0i2llBJnH;a,iH;ca,ka,qD9;a,cUdo4ZkaTlOmi,nMrItzi,yH;ar;aJiIlH;anET;am;!l,nB;dy,eHh,n4;nhGrva;aKdJe0iCUlH;iHy;cent,e;red;!gros;!e5;ae5hH;ae5el3Z;ag5DgNi,lKrH;edi7AiIjem,on,yH;em,l;em,sCG;an4iHliCF;nHsCJ;a,da;!an,han;b09cASd07e,g05ha,i04ja,l02n00rLsoum5YtKuIv84xBKyHz4;bell,ra,soBB;d7rH;a,eE;h8Gild1t4;a,cUgQiKjor4l7Un4s6tJwa,yH;!aHbe6Xja9lAE;m,nBL;a,ha,in1;!aJbCGeIja,lDna,sHt63;!a,ol,sa;!l1D;!h,mInH;!a,e,n1;!awit,i;arJeIie,oHr48ueri8;!t;!ry;et46i3B;el4Xi7Cy;dHon,ue5;akranAy;ak,en,iHlo3S;a,ka,nB;a,re,s4te;daHg4;!l3E;alDd4elHge,isDJon0;ei9in1yn;el,le;a0Ne0CiXoQuLyH;d3la,nH;!a,dIe2OnHsCT;!a,e2N;a,sCR;aD4cJel0Pis1lIna,pHz;e,iA;a,u,wa;iHy;a0Se,ja,l2NnB;is,l1UrItt1LuHvel4;el5is1;aKeIi7na,rH;aADi7;lHn1tA;ei;!in1;aTbb9HdSepa,lNnKsJvIzH;!a,be5Ret8z4;!ia;a,et8;!a,dH;a,sHy;ay,ey,i,y;a,iJja,lH;iHy;aA8e;!aH;!nF;ia,ya;!nH;!a,ne;aPda,e0iNjYla,nMoKsJtHx93y5;iHt4;c3t3;e2PlCO;la,nHra;a,ie,o2;a,or1;a,gh,laH;!ni;!h,nH;a,d2e,n5V;cOdon9DiNkes6mi9Gna,rMtJurIvHxmi,y5;ern1in3;a,e5Aie,yn;as6iIoH;nya,ya;fa,s6;a,isA9;a,la;ey,ie,y;a04eZhXiOlASoNrJyH;lHra;a,ee,ie;istHy6I;a,en,iIyH;!na;!e,n5F;nul,ri,urtnB8;aOerNlB7mJrHzzy;a,stH;en,in;!berlImernH;aq;eHi,y;e,y;a,stE;!na,ra;aHei2ongordzol;dij1w5;el7UiKjsi,lJnIrH;a,i,ri;d2na,za;ey,i,lBLs4y;ra,s6;biAcARdiat7MeBAiSlQmPnyakuma1DrNss6NtKviAyH;!e,lH;a,eH;e,i8T;!a6HeIhHi4TlDri0y;ar8Her8Hie,leErBAy;!lyn8Ori0;a,en,iHl5Xoli0yn;!ma,nFs95;a5il1;ei8Mi,lH;e,ie;a,tl6O;a0AeZiWoOuH;anMdLlHst88;es,iH;a8NeHs8X;!n9tH;!a,te;e5Mi3My;a,iA;!anNcelDdMelGhan7VleLni,sIva0yH;a,ce;eHie;fHlDph7Y;a,in1;en,n1;i7y;!a,e,n45;lHng;!i1DlH;!i1C;anNle0nKrJsH;i8JsH;!e,i8I;i,ri;!a,elGif2CnH;a,et8iHy;!e,f2A;a,eJiInH;a,eIiH;e,n1;!t8;cMda,mi,nIque4YsminFvie2y9zH;min7;a7eIiH;ce,e,n1s;!lHs82t0F;e,le;inIk6HlDquelH;in1yn;da,ta;da,lRmPnOo0rNsIvaHwo0zaro;!a0lu,na;aJiIlaHob89;!n9R;do2;belHdo2;!a,e,l3B;a7Ben1i0ma;di2es,gr72ji;a9elBogH;en1;a,e9iHo0se;a0na;aSeOiJoHus7Kyacin2C;da,ll4rten24snH;a,i9U;lImaH;ri;aIdHlaI;a,egard;ry;ath1BiJlInrietArmi9sH;sa,t1A;en2Uga,mi;di;bi2Fil8MlNnMrJsItHwa,yl8M;i5Tt4;n60ti;iHmo51ri53;etH;!te;aCnaC;a,ey,l4;a02eWiRlPoNrKunJwH;enHyne1R;!dolD;ay,el;acieIetHiselB;a,chE;!la;ld1CogooH;sh;adys,enHor3yn2K;a,da,na;aKgi,lIna,ov8EselHta;a,e,le;da,liH;an;!n0;mLnJorgIrH;ald5Si,m3Etrud7;et8i4X;a,eHna;s29vieve;ma;bIle,mHrnet,yG;al5Si5;iIrielH;a,l1;!ja;aTeQiPlorOoz3rH;anJeIiH;da,eB;da,ja;!cH;esIiHoi0P;n1s66;!ca;a,enc3;en,o0;lIn0rnH;anB;ec3ic3;jr,nArKtHy7;emIiHma,oumaA;ha,ma,n;eh;ah,iBrah,za0;cr4Rd0Re0Qi0Pk0Ol07mXn54rUsOtNuMvHwa;aKelIiH;!e,ta;inFyn;!a;!ngel4V;geni1ni47;h5Yien9ta;mLperanKtH;eIhHrel5;er;l31r7;za;a,eralB;iHma,ne4Lyn;cHka,n;a,ka;aPeNiKmH;aHe21ie,y;!li9nuH;elG;lHn1;e7iHy;a,e,ja;lHrald;da,y;!nue5;aWeUiNlMma,no2oKsJvH;a,iH;na,ra;a,ie;iHuiH;se;a,en,ie,y;a0c3da,e,f,nMsJzaH;!betHveA;e,h;aHe,ka;!beH;th;!a,or;anor,nH;!a,i;!in1na;ate1Rta;leEs6;vi;eIiHna,wi0;e,th;l,n;aYeMh3iLjeneKoH;lor5Vminiq4Ln3FrHtt4;a,eEis,la,othHthy;ea,y;ba;an09naCon9ya;anQbPde,eOiMlJmetr3nHsir5M;a,iH;ce,se;a,iIla,orHphi9;es,is;a,l6F;dHrdH;re;!d5Ena;!b2ForaCraC;a,d2nH;!a,e;hl3i0l0GmNnLphn1rIvi1WyH;le,na;a,by,cIia,lH;a,en1;ey,ie;a,et8iH;!ca,el1Aka,z;arHia;is;a0Re0Nh04i02lUoJristIynH;di,th3;al,i0;lPnMrIurH;tn1D;aJd2OiHn2Ori9;!nH;a,e,n1;!l4;cepci5Cn4sH;tanHuelo;ce,za;eHleE;en,t8;aJeoIotH;il54;!pat2;ir7rJudH;et8iH;a,ne;a,e,iH;ce,sZ;a2er2ndH;i,y;aReNloe,rH;isJyH;stH;al;sy,tH;a1Sen,iHy;an1e,n1;deJlseIrH;!i7yl;a,y;li9;nMrH;isKlImH;ai9;a,eHot8;n1t8;!sa;d2elGtH;al,elG;cIlH;es8i47;el3ilH;e,ia,y;itlYlXmilWndVrMsKtHy5;aIeIhHri0;er1IleErDy;ri0;a38sH;a37ie;a,iOlLmeJolIrH;ie,ol;!e,in1yn;lHn;!a,la;a,eIie,otHy;a,ta;ne,y;na,s1X;a0Ii0I;a,e,l1;isAl4;in,yn;a0Ke02iZlXoUrH;andi7eRiJoIyH;an0nn;nwDoke;an3HdgMgiLtH;n31tH;!aInH;ey,i,y;ny;d,t8;etH;!t7;an0e,nH;da,na;bbi7glarIlo07nH;iAn4;ka;ancHythe;a,he;an1Clja0nHsm3M;iAtH;ou;aWcVlinUniArPssOtJulaCvH;!erlH;ey,y;hJsy,tH;e,iHy7;e,na;!anH;ie,y;!ie;nItHyl;ha,ie;adIiH;ce;et8i9;ay,da;ca,ky;!triH;ce,z;rbJyaH;rmH;aa;a2o2ra;a2Ub2Od25g21i1Sj5l18m0Zn0Boi,r06sWtVuPvOwa,yIzH;ra,u0;aKes6gJlIn,seH;!l;in;un;!nH;a,na;a,i2K;drLguJrIsteH;ja;el3;stH;in1;a,ey,i,y;aahua,he0;hIi2Gja,miAs2DtrH;id;aMlIraqHt21;at;eIi7yH;!n;e,iHy;gh;!nH;ti;iJleIo6piA;ta;en,n1t8;aHelG;!n1J;a01dje5eZgViTjRnKohito,toHya;inet8nH;el5ia;te;!aKeIiHmJ;e,ka;!mHtt7;ar4;!belIliHmU;sa;!l1;a,eliH;ca;ka,sHta;a,sa;elHie;a,iH;a,ca,n1qH;ue;!tH;a,te;!bImHstasiMya;ar3;el;aLberKeliJiHy;e,l3naH;!ta;a,ja;!ly;hGiIl3nB;da;a,ra;le;aWba,ePiMlKthJyH;a,c3sH;a,on,sa;ea;iHys0N;e,s0M;a,cIn1sHza;a,e,ha,on,sa;e,ia,ja;c3is6jaKksaKna,sJxH;aHia;!nd2;ia,saH;nd2;ra;ia;i0nIyH;ah,na;a,is,naCoud;la;c6da,leEmNnLsH;haClH;inHyY;g,n;!h;a,o,slH;ey;ee;en;at6g4nIusH;ti0;es;ie;aWdiTelMrH;eJiH;anMenH;a,e,ne;an0;na;!aLeKiIyH;nn;a,n1;a,e;!ne;!iH;de;e,lDsH;on;yn;!lH;i9yn;ne;aKbIiHrL;!e,gaK;ey,i7y;!e;gaH;il;dKliyJradhIs6;ha;ya;ah;a,ya",
  "Honorific": "true¦director1field marsh2lieutenant1rear0sergeant major,vice0; admir1; gener0;al",
  "Adj|Gerund": "true¦0:3F;1:3H;2:31;3:2X;4:35;5:33;6:3C;7:2Z;8:36;9:29;a33b2Tc2Bd1Te1If19g12h0Zi0Rl0Nm0Gnu0Fo0Ap04rYsKtEuBvAw1Ayiel3;ar6e08;nBpA;l1Rs0B;fol3n1Zsett2;aEeDhrBi4ouc7rAwis0;e0Bif2oub2us0yi1;ea1SiA;l2vi1;l2mp0rr1J;nt1Vxi1;aMcreec7enten2NhLkyrocke0lo0Vmi2oJpHtDuBweA;e0Ul2;pp2ArA;gi1pri5roun3;aBea8iAri2Hun9;mula0r4;gge4rA;t2vi1;ark2eAraw2;e3llb2F;aAot7;ki1ri1;i9oc29;dYtisf6;aEeBive0oAus7;a4l2;assu4defi9fres7ig9juve07mai9s0vAwar3;ea2italiAol1G;si1zi1;gi1ll6mb2vi1;a6eDier23lun1VrAun2C;eBoA;mi5vo1Z;ce3s5vai2;n3rpleA;xi1;ffCpWutBverAwi1;arc7lap04p0Pri3whel8;goi1l6st1J;en3sA;et0;m2Jrtu4;aEeDiCoBuAyst0L;mb2;t1Jvi1;s5tiga0;an1Rl0n3smeri26;dAtu4;de9;aCeaBiAo0U;fesa0Tvi1;di1ni1;c1Fg19s0;llumiGmFnArri0R;cDfurHsCtBviA;go23ti1;e1Oimi21oxica0rig0V;pi4ul0;orpo20r0K;po5;na0;eaBorr02umilA;ia0;li1rtwar8;lFrA;atiDipCoBuelA;i1li1;undbrea10wi1;pi1;f6ng;a4ea8;a3etc7it0lEoCrBulfA;il2;ee1FighXust1L;rAun3;ebo3thco8;aCoA;a0wA;e4i1;mi1tte4;lectrJmHnExA;aCci0hBis0pA;an3lo3;aOila1B;c0spe1A;ab2coura0CdBergi13ga0Clive9ric7s02tA;hral2i0J;ea4u4;barras5er09pA;owe4;if6;aQeIiBrA;if0;sAzz6;aEgDhearCsen0tA;rAur11;ac0es5;te9;us0;ppoin0r8;biliGcDfi9gra3ligh0mBpres5sAvasG;erE;an3ea9orA;ali0L;a6eiBli9rA;ea5;vi1;ta0;maPri1s7un0zz2;aPhMlo5oAripp2ut0;mGnArrespon3;cer9fDspi4tA;inBrA;as0ibu0ol2;ui1;lic0u5;ni1;fDmCpA;eAromi5;l2ti1;an3;or0;aAil2;llenAnAr8;gi1;l8ptAri1;iva0;aff2eGin3lFoDrBuA;d3st2;eathtaAui5;ki1;gg2i2o8ri1unA;ci1;in3;co8wiA;lAtc7;de4;bsorVcOgonMlJmHnno6ppea2rFsA;pi4su4toA;nBun3;di1;is7;hi1;res0;li1;aFu5;si1;ar8lu4;ri1;mi1;iAzi1;zi1;cAhi1;eleDomA;moBpan6;yi1;da0;ra0;ti1;bi1;ng",
  "Comparable": "true¦0:3C;1:3Q;2:3F;a3Tb3Cc33d2Te2Mf2Ag1Wh1Li1Fj1Ek1Bl13m0Xn0So0Rp0Iqu0Gr07sHtCug0vAw4y3za0Q;el10ouN;ary,e6hi5i3ry;ck0Cde,l3n1ry,se;d,y;ny,te;a3i3R;k,ry;a3erda2ulgar;gue,in,st;a6en2Xhi5i4ouZr3;anqu2Cen1ue;dy,g36me0ny;ck,rs28;ll,me,rt,wd3I;aRcaPeOhMiLkin0BlImGoEpDt6u4w3;eet,ift;b3dd0Wperfi21rre28;sta26t21;a8e7iff,r4u3;pUr1;a4ict,o3;ng;ig2Vn0N;a1ep,rn;le,rk,te0;e1Si2Vright0;ci1Yft,l3on,re;emn,id;a3el0;ll,rt;e4i3y;g2Mm0Z;ek,nd2T;ck24l0mp1L;a3iRrill,y;dy,l01rp;ve0Jxy;n1Jr3;ce,y;d,fe,int0l1Hv0V;a8e6i5o3ude;mantic,o19sy,u3;gh;pe,t1P;a3d,mo0A;dy,l;gg4iFndom,p3re,w;id;ed;ai2i3;ck,et;hoAi1Fl9o8r5u3;ny,r3;e,p11;egna2ic4o3;fouSud;ey,k0;liXor;ain,easa2;ny;dd,i0ld,ranL;aive,e5i4o3u14;b0Sisy,rm0Ysy;bb0ce,mb0R;a3r1w;r,t;ad,e5ild,o4u3;nda12te;ist,o1;a4ek,l3;low;s0ty;a8e7i6o3ucky;f0Jn4o15u3ve0w10y0N;d,sy;e0g;ke0l,mp,tt0Eve0;e1Qwd;me,r3te;ge;e4i3;nd;en;ol0ui19;cy,ll,n3;secu6t3;e3ima4;llege2rmedia3;te;re;aAe7i6o5u3;ge,m3ng1C;bYid;me0t;gh,l0;a3fXsita2;dy,rWv3;en0y;nd13ppy,r3;d3sh;!y;aFenEhCiBlAoofy,r3;a8e6i5o3ue0Z;o3ss;vy;m,s0;at,e3y;dy,n;nd,y;ad,ib,ooD;a2d1;a3o3;st0;tDuiS;u1y;aCeebBi9l8o6r5u3;ll,n3r0N;!ny;aCesh,iend0;a3nd,rmD;my;at,ir7;erce,nan3;ci9;le;r,ul3;ty;a6erie,sse4v3xtre0B;il;nti3;al;r4s3;tern,y;ly,th0;appZe9i5ru4u3;mb;nk;r5vi4z3;zy;ne;e,ty;a3ep,n9;d3f,r;!ly;agey,h8l7o5r4u3;dd0r0te;isp,uel;ar3ld,mmon,st0ward0zy;se;evKou1;e3il0;ap,e3;sy;aHiFlCoAr5u3;ff,r0sy;ly;a6i3oad;g4llia2;nt;ht;sh,ve;ld,un3;cy;a4o3ue;nd,o1;ck,nd;g,tt3;er;d,ld,w1;dy;bsu6ng5we3;so3;me;ry;rd",
  "Adverb": "true¦a08b05d00eYfSheQinPjustOkinda,likewiZmMnJoEpCquite,r9s5t2u0very,well;ltima01p0; to,wards5;h1iny bit,o0wiO;o,t6;en,us;eldom,o0uch;!me1rt0; of;how,times,w0C;a1e0;alS;ndomRth05;ar excellenEer0oint blank; Lhaps;f3n0utright;ce0ly;! 0;ag05moX; courGten;ewJo0; longWt 0;onHwithstand9;aybe,eanwhiNore0;!ovT;! aboX;deed,steY;lla,n0;ce;or3u0;ck1l9rther0;!moK;ing; 0evK;exampCgood,suH;n mas0vI;se;e0irect2; 2fini0;te0;ly;juAtrop;ackward,y 0;far,no0; means,w; GbroFd nauseam,gEl7ny5part,s4t 2w0;ay,hi0;le;be7l0mo7wor7;arge,ea6; soon,i4;mo0way;re;l 3mo2ongsi1ready,so,togeth0ways;er;de;st;b1t0;hat;ut;ain;ad;lot,posteriori",
  "Conjunction": "true¦aXbTcReNhowMiEjust00noBo9p8supposing,t5wh0yet;e1il0o3;e,st;n1re0thN; if,by,vM;evL;h0il,o;erefOo0;!uU;lus,rovided th9;r0therwiM;! not; mattEr,w0;! 0;since,th4w7;f4n0; 0asmuch;as mIcaForder t0;h0o;at;! 0;only,t0w0;hen;!ev3;ith2ven0;! 0;if,tB;er;o0uz;s,z;e0ut,y the time;cau1f0;ore;se;lt3nd,s 0;far1if,m0soon1t2;uch0; as;hou0;gh",
  "Currency": "true¦$,aud,bQcOdJeurIfHgbp,hkd,iGjpy,kElDp8r7s3usd,x2y1z0¢,£,¥,ден,лв,руб,฿,₡,₨,€,₭,﷼;lotyQł;en,uanP;af,of;h0t5;e0il5;k0q0;elK;oubleJp,upeeJ;e2ound st0;er0;lingG;n0soF;ceEnies;empi7i7;n,r0wanzaCyatC;!onaBw;ls,nr;ori7ranc9;!os;en3i2kk,o0;b0ll2;ra5;me4n0rham4;ar3;e0ny;nt1;aht,itcoin0;!s",
  "Determiner": "true¦aBboth,d9e6few,le5mu8neiDplenty,s4th2various,wh0;at0ich0;evC;a0e4is,ose;!t;everal,ome;!ast,s;a1l0very;!se;ch;e0u;!s;!n0;!o0y;th0;er",
  "Adj|Present": "true¦a07b04cVdQeNfJhollIidRlEmCnarrIoBp9qua8r7s3t2uttFw0;aKet,ro0;ng,u08;endChin;e2hort,l1mooth,our,pa9tray,u0;re,speU;i2ow;cu6da02leSpaN;eplica01i02;ck;aHerfePr0;eseUime,omV;bscu1pen,wn;atu0e3odeH;re;a2e1ive,ow0;er;an;st,y;ow;a2i1oul,r0;ee,inge;rm;iIke,ncy,st;l1mpty,x0;emHpress;abo4ic7;amp,e2i1oub0ry,ull;le;ffu9re6;fu8libe0;raE;alm,l5o0;mpleCn3ol,rr1unterfe0;it;e0u7;ct;juga8sum7;ea1o0;se;n,r;ankru1lu0;nt;pt;li2pproxi0rticula1;ma0;te;ght",
  "Person|Adj": "true¦b3du2earnest,frank,mi2r0san1woo1;an0ich,u1;dy;sty;ella,rown",
  "Modal": "true¦c5lets,m4ought3sh1w0;ill,o5;a0o4;ll,nt;! to,a;ight,ust;an,o0;uld",
  "Verb": "true¦born,cannot,gonna,has,keep tabs,msg",
  "Person|Verb": "true¦b8ch7dr6foster,gra5ja9lan4ma2ni9ollie,p1rob,s0wade;kip,pike,t5ue;at,eg,ier2;ck,r0;k,shal;ce;ce,nt;ew;ase,u1;iff,l1ob,u0;ck;aze,ossom",
  "Person|Date": "true¦a2j0sep;an0une;!uary;p0ugust,v0;ril"
};

const BASE = 36;
const seq = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const cache = seq.split('').reduce(function (h, c, i) {
  h[c] = i;
  return h
}, {});

// 0, 1, 2, ..., A, B, C, ..., 00, 01, ... AA, AB, AC, ..., AAA, AAB, ...
const toAlphaCode = function (n) {
  if (seq[n] !== undefined) {
    return seq[n]
  }
  let places = 1;
  let range = BASE;
  let s = '';
  for (; n >= range; n -= range, places++, range *= BASE) {}
  while (places--) {
    const d = n % BASE;
    s = String.fromCharCode((d < 10 ? 48 : 55) + d) + s;
    n = (n - d) / BASE;
  }
  return s
};

const fromAlphaCode = function (s) {
  if (cache[s] !== undefined) {
    return cache[s]
  }
  let n = 0;
  let places = 1;
  let range = BASE;
  let pow = 1;
  for (; places < s.length; n += range, places++, range *= BASE) {}
  for (let i = s.length - 1; i >= 0; i--, pow *= BASE) {
    let d = s.charCodeAt(i) - 48;
    if (d > 10) {
      d -= 7;
    }
    n += d * pow;
  }
  return n
};

var encoding = {
  toAlphaCode,
  fromAlphaCode
};

const symbols = function (t) {
  //... process these lines
  const reSymbol = new RegExp('([0-9A-Z]+):([0-9A-Z]+)');
  for (let i = 0; i < t.nodes.length; i++) {
    const m = reSymbol.exec(t.nodes[i]);
    if (!m) {
      t.symCount = i;
      break
    }
    t.syms[encoding.fromAlphaCode(m[1])] = encoding.fromAlphaCode(m[2]);
  }
  //remove from main node list
  t.nodes = t.nodes.slice(t.symCount, t.nodes.length);
};

// References are either absolute (symbol) or relative (1 - based)
const indexFromRef = function (trie, ref, index) {
  const dnode = encoding.fromAlphaCode(ref);
  if (dnode < trie.symCount) {
    return trie.syms[dnode]
  }
  return index + dnode + 1 - trie.symCount
};

const toArray$2 = function (trie) {
  const all = [];
  const crawl = (index, pref) => {
    let node = trie.nodes[index];
    if (node[0] === '!') {
      all.push(pref);
      node = node.slice(1); //ok, we tried. remove it.
    }
    const matches = node.split(/([A-Z0-9,]+)/g);
    for (let i = 0; i < matches.length; i += 2) {
      const str = matches[i];
      const ref = matches[i + 1];
      if (!str) {
        continue
      }
      const have = pref + str;
      //branch's end
      if (ref === ',' || ref === undefined) {
        all.push(have);
        continue
      }
      const newIndex = indexFromRef(trie, ref, index);
      crawl(newIndex, have);
    }
  };
  crawl(0, '');
  return all
};

//PackedTrie - Trie traversal of the Trie packed-string representation.
const unpack$1 = function (str) {
  const trie = {
    nodes: str.split(';'),
    syms: [],
    symCount: 0
  };
  //process symbols, if they have them
  if (str.match(':')) {
    symbols(trie);
  }
  return toArray$2(trie)
};

const unpack = function (str) {
  if (!str) {
    return {}
  }
  //turn the weird string into a key-value object again
  const obj = str.split('|').reduce((h, s) => {
    const arr = s.split('¦');
    h[arr[0]] = arr[1];
    return h
  }, {});
  const all = {};
  Object.keys(obj).forEach(function (cat) {
    const arr = unpack$1(obj[cat]);
    //special case, for botched-boolean
    if (cat === 'true') {
      cat = true;
    }
    for (let i = 0; i < arr.length; i++) {
      const k = arr[i];
      if (all.hasOwnProperty(k) === true) {
        if (Array.isArray(all[k]) === false) {
          all[k] = [all[k], cat];
        } else {
          all[k].push(cat);
        }
      } else {
        all[k] = cat;
      }
    }
  });
  return all
};

const prp = ['Possessive', 'Pronoun'];
//words that can't be compressed, for whatever reason
const misc$5 = {
  // numbers
  '20th century fox': 'Organization',
  '7 eleven': 'Organization',
  'motel 6': 'Organization',
  g8: 'Organization',
  vh1: 'Organization',
  '76ers': 'SportsTeam',
  '49ers': 'SportsTeam',

  q1: 'Date',
  q2: 'Date',
  q3: 'Date',
  q4: 'Date',

  km2: 'Unit',
  m2: 'Unit',
  dm2: 'Unit',
  cm2: 'Unit',
  mm2: 'Unit',
  mile2: 'Unit',
  in2: 'Unit',
  yd2: 'Unit',
  ft2: 'Unit',
  m3: 'Unit',
  dm3: 'Unit',
  cm3: 'Unit',
  in3: 'Unit',
  ft3: 'Unit',
  yd3: 'Unit',

  // ampersands
  'at&t': 'Organization',
  'black & decker': 'Organization',
  'h & m': 'Organization',
  'johnson & johnson': 'Organization',
  'procter & gamble': 'Organization',
  "ben & jerry's": 'Organization',
  '&': 'Conjunction',

  //pronouns
  i: ['Pronoun', 'Singular'],
  he: ['Pronoun', 'Singular'],
  she: ['Pronoun', 'Singular'],
  it: ['Pronoun', 'Singular'],
  they: ['Pronoun', 'Plural'],
  we: ['Pronoun', 'Plural'],
  was: ['Copula', 'PastTense'],
  is: ['Copula', 'PresentTense'],
  are: ['Copula', 'PresentTense'],
  am: ['Copula', 'PresentTense'],
  were: ['Copula', 'PastTense'],

  // possessive pronouns
  her: prp,
  his: prp,
  hers: prp,
  their: prp,
  theirs: prp,
  themselves: prp,
  your: prp,
  our: prp,
  ours: prp,
  my: prp,
  its: prp,

  // misc
  vs: ['Conjunction', 'Abbreviation'],
  if: ['Condition', 'Preposition'],
  closer: 'Comparative',
  closest: 'Superlative',
  much: 'Adverb',
  may: 'Modal',

  // irregular conjugations with two forms
  babysat: 'PastTense',
  blew: 'PastTense',
  drank: 'PastTense',
  drove: 'PastTense',
  forgave: 'PastTense',
  skiied: 'PastTense',
  spilt: 'PastTense',
  stung: 'PastTense',
  swam: 'PastTense',
  swung: 'PastTense',
  guaranteed: 'PastTense',
  shrunk: 'PastTense',

  // support 'near', 'nears', 'nearing'
  nears: 'PresentTense',
  nearing: 'Gerund',
  neared: 'PastTense',

  no: ['Negative', 'Expression'],

  // '-': 'Preposition', //june - july

  // there: 'There'
};

var frozenLex = {
  '20th century fox': 'Organization',
  '7 eleven': 'Organization',
  'motel 6': 'Organization',
  'excuse me': 'Expression',
  'financial times': 'Organization',
  'guns n roses': 'Organization',
  'la z boy': 'Organization',
  'labour party': 'Organization',
  'new kids on the block': 'Organization',
  'new york times': 'Organization',
  'the guess who': 'Organization',
  'thin lizzy': 'Organization',

  'prime minister': 'Actor',
  'free market': 'Singular',
  'lay up': 'Singular',
  'living room': 'Singular',
  'living rooms': 'Plural',
  'spin off': 'Singular',
  'appeal court': 'Uncountable',
  'cold war': 'Uncountable',
  'gene pool': 'Uncountable',
  'machine learning': 'Uncountable',
  'nail polish': 'Uncountable',
  'time off': 'Uncountable',
  'take part': 'Infinitive',

  'bill gates': 'Person',
  'doctor who': 'Person',
  'dr who': 'Person',
  'he man': 'Person',
  'iron man': 'Person',
  'kid cudi': 'Person',
  'run dmc': 'Person',
  'rush limbaugh': 'Person',
  'snow white': 'Person',
  'tiger woods': 'Person',

  'brand new': 'Adjective',
  'en route': 'Adjective',
  'left wing': 'Adjective',
  'off guard': 'Adjective',
  'on board': 'Adjective',
  'part time': 'Adjective',
  'right wing': 'Adjective',
  'so called': 'Adjective',
  'spot on': 'Adjective',
  'straight forward': 'Adjective',
  'super duper': 'Adjective',
  'tip top': 'Adjective',
  'top notch': 'Adjective',
  'up to date': 'Adjective',
  'win win': 'Adjective',

  'brooklyn nets': 'SportsTeam',
  'chicago bears': 'SportsTeam',
  'houston astros': 'SportsTeam',
  'houston dynamo': 'SportsTeam',
  'houston rockets': 'SportsTeam',
  'houston texans': 'SportsTeam',
  'minnesota twins': 'SportsTeam',
  'orlando magic': 'SportsTeam',
  'san antonio spurs': 'SportsTeam',
  'san diego chargers': 'SportsTeam',
  'san diego padres': 'SportsTeam',

  'iron maiden': 'ProperNoun',
  'isle of man': 'Country',
  'united states': 'Country',
  'united states of america': 'Country',
  'prince edward island': 'Region',
  'cedar breaks': 'Place',
  'cedar falls': 'Place',

  'point blank': 'Adverb',
  'tiny bit': 'Adverb',
  'by the time': 'Conjunction',
  'no matter': 'Conjunction',

  'civil wars': 'Plural',
  'credit cards': 'Plural',
  'default rates': 'Plural',
  'free markets': 'Plural',
  'head starts': 'Plural',
  'home runs': 'Plural',
  'lay ups': 'Plural',
  'phone calls': 'Plural',
  'press releases': 'Plural',
  'record labels': 'Plural',
  'soft serves': 'Plural',
  'student loans': 'Plural',
  'tax returns': 'Plural',
  'tv shows': 'Plural',
  'video games': 'Plural',

  'took part': 'PastTense',
  'takes part': 'PresentTense',
  'taking part': 'Gerund',
  'taken part': 'Participle',

  'light bulb': 'Noun',
  'rush hour': 'Noun',
  'fluid ounce': 'Unit',
  'the rolling stones': 'Organization',
};

//just some of the most common emoticons
//faster than
//http://stackoverflow.com/questions/28077049/regex-matching-emoticons
var emoticons = [
  ':(',
  ':)',
  ':P',
  ':p',
  ':O',
  ';(',
  ';)',
  ';P',
  ';p',
  ';O',
  ':3',
  ':|',
  ':/',
  ':\\',
  ':$',
  ':*',
  ':@',
  ':-(',
  ':-)',
  ':-P',
  ':-p',
  ':-O',
  ':-3',
  ':-|',
  ':-/',
  ':-\\',
  ':-$',
  ':-*',
  ':-@',
  ':^(',
  ':^)',
  ':^P',
  ':^p',
  ':^O',
  ':^3',
  ':^|',
  ':^/',
  ':^\\',
  ':^$',
  ':^*',
  ':^@',
  '):',
  '(:',
  '$:',
  '*:',
  ')-:',
  '(-:',
  '$-:',
  '*-:',
  ')^:',
  '(^:',
  '$^:',
  '*^:',
  '<3',
  '</3',
  '<\\3',
  '=('
];

/** patterns for turning 'bus' to 'buses'*/
const suffixes$3 = {
  a: [
    [/(antenn|formul|nebul|vertebr|vit)a$/i, '$1ae'],
    [/ia$/i, 'ia'],
  ],
  e: [
    [/(kn|l|w)ife$/i, '$1ives'],
    [/(hive)$/i, '$1s'],
    [/([m|l])ouse$/i, '$1ice'],
    [/([m|l])ice$/i, '$1ice'],
  ],
  f: [
    [/^(dwar|handkerchie|hoo|scar|whar)f$/i, '$1ves'],
    [/^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)f$/i, '$1ves'],
  ],
  i: [[/(octop|vir)i$/i, '$1i']],
  m: [[/([ti])um$/i, '$1a']],
  n: [[/^(oxen)$/i, '$1']],
  o: [[/(al|ad|at|er|et|ed)o$/i, '$1oes']],
  s: [
    [/(ax|test)is$/i, '$1es'],
    [/(alias|status)$/i, '$1es'],
    [/sis$/i, 'ses'],
    [/(bu)s$/i, '$1ses'],
    [/(sis)$/i, 'ses'],
    [/^(?!talis|.*hu)(.*)man$/i, '$1men'],
    [/(octop|vir|radi|nucle|fung|cact|stimul)us$/i, '$1i'],
  ],
  x: [
    [/(matr|vert|ind|cort)(ix|ex)$/i, '$1ices'],
    [/^(ox)$/i, '$1en'],
  ],
  y: [[/([^aeiouy]|qu)y$/i, '$1ies']],
  z: [[/(quiz)$/i, '$1zes']],
};

const addE = /([xsz]|ch|sh)$/;

const trySuffix = function (str) {
  const c = str[str.length - 1];
  if (suffixes$3.hasOwnProperty(c) === true) {
    for (let i = 0; i < suffixes$3[c].length; i += 1) {
      const reg = suffixes$3[c][i][0];
      if (reg.test(str) === true) {
        return str.replace(reg, suffixes$3[c][i][1])
      }
    }
  }
  return null
};
/** Turn a singular noun into a plural
 * assume the given string is singular
 */
const pluralize = function (str = '', model) {
  const { irregularPlurals, uncountable } = model.two;
  // is it a word without a plural form?
  if (uncountable.hasOwnProperty(str)) {
    return str
  }
  // check irregulars list
  if (irregularPlurals.hasOwnProperty(str)) {
    return irregularPlurals[str]
  }
  //we have some rules to try-out
  const plural = trySuffix(str);
  if (plural !== null) {
    return plural
  }
  //like 'church'
  if (addE.test(str)) {
    return str + 'es'
  }
  // ¯\_(ツ)_/¯
  return str + 's'
};

// unpack our lexicon of words
// (found in ./lexicon/)

// more clever things are done on the data later
//  - once the plugin is applied
const hasSwitch = /\|/;
const lexicon = misc$5;
const switches = {};

const tmpModel$1 = { two: { irregularPlurals, uncountable: {} } };

Object.keys(lexData).forEach(tag => {
  const wordsObj = unpack(lexData[tag]);
  // POS tag, or something fancier?
  if (!hasSwitch.test(tag)) {
    // set them as simple word key-value lookup
    Object.keys(wordsObj).forEach(w => {
      lexicon[w] = tag;
    });
    return
  }
  // add them as seperate key-val object
  Object.keys(wordsObj).forEach(w => {
    switches[w] = tag;
    // pluralize Noun|Verb switches
    if (tag === 'Noun|Verb') {
      const plural = pluralize(w, tmpModel$1);
      switches[plural] = 'Plural|Verb';
    }
  });
});
// add ':)'
emoticons.forEach(str => (lexicon[str] = 'Emoticon'));

// misc cleanup
delete lexicon[''];
delete lexicon[null];
delete lexicon[' '];

const n = 'Singular';
var noun$1 = {
  beforeTags: {
    Determiner: n, //the date
    Possessive: n, //his date
    Acronym: n, //u.s. state
    // ProperNoun:n,
    Noun: n, //nasa funding
    Adjective: n, //whole bottles
    // Verb:true, //save storm victims
    PresentTense: n, //loves hiking
    Gerund: n, //uplifting victims
    PastTense: n, //saved storm victims
    Infinitive: n, //profess love
    Date: n, //9pm show
    Ordinal: n, //first date
    Demonym: n, //dutch map
  },
  afterTags: {
    Value: n, //date nine  -?
    Modal: n, //date would
    Copula: n, //fear is
    PresentTense: n, //babysitting sucks
    PastTense: n, //babysitting sucked
    // Noun:n, //talking therapy, planning process
    Demonym: n, //american touch
    Actor: n, //dance therapist
  },
  // ownTags: { ProperNoun: n },
  beforeWords: {
    the: n, //the brands
    with: n, //with cakes
    without: n, //
    // was:n, //was time  -- was working
    // is:n, //
    of: n, //of power
    for: n, //for rats
    any: n, //any rats
    all: n, //all tips
    on: n, //on time
    // thing-ish verbs
    cut: n, //cut spending
    cuts: n, //cut spending
    increase: n, // increase funding
    decrease: n, //
    raise: n, //
    drop: n, //
    // give: n,//give parents
    save: n, //
    saved: n, //
    saves: n, //
    make: n, //
    makes: n, //
    made: n, //
    minus: n, //minus laughing
    plus: n, //
    than: n, //more than age
    another: n, //
    versus: n, //
    neither: n, //
    about: n, //about claims
    // strong adjectives
    favorite: n, //
    best: n, //
    daily: n, //
    weekly: n, //
    linear: n, //
    binary: n, //
    mobile: n, //
    lexical: n, //
    technical: n, //
    computer: n, //
    scientific: n, //
    security: n, //
    government: n, //
    popular: n, //
    formal: n,
    no: n, //no worries
    more: n, //more details
    one: n, //one flood
    let: n, //let fear
    her: n, //her boots
    his: n, //
    their: n, //
    our: n, //
    us: n, //served us drinks
    sheer: n,

    monthly: n,
    yearly: n,
    current: n,
    previous: n,
    upcoming: n,
    last: n,
    next: n,
    main: n,
    initial: n,
    final: n,
    beginning: n,
    end: n,
    top: n,
    bottom: n,
    future: n,
    past: n,
    major: n,
    minor: n,
    side: n,
    central: n,
    peripheral: n,
    public: n,
    private: n,
  },
  afterWords: {
    of: n, //date of birth (preposition)
    system: n,
    aid: n,
    method: n,
    utility: n,
    tool: n,
    reform: n,
    therapy: n,
    philosophy: n,
    room: n,
    authority: n,
    says: n,
    said: n,
    wants: n,
    wanted: n,
    is: n,
    did: n,
    do: n,
    can: n, //parents can
    wise: n, //service-wise
    // they: n,//snakes they
  },
};

const v = 'Infinitive';

var verb = {
  beforeTags: {
    Modal: v, //would date
    Adverb: v, //quickly date
    Negative: v, //not date
    Plural: v, //characters drink
    // ProperNoun: vb,//google thought
  },
  afterTags: {
    Determiner: v, //flash the
    Adverb: v, //date quickly
    Possessive: v, //date his
    Reflexive: v, //resolve yourself
    // Noun:true, //date spencer
    Preposition: v, //date around, dump onto, grumble about
    // Conjunction: v, // dip to, dip through
    Cardinal: v, //cut 3 squares
    Comparative: v, //feel greater
    Superlative: v, //feel greatest
  },
  beforeWords: {
    i: v, //i date
    we: v, //we date
    you: v, //you date
    they: v, //they date
    to: v, //to date
    please: v, //please check
    will: v, //will check
    have: v,
    had: v,
    would: v,
    could: v,
    should: v,
    do: v,
    did: v,
    does: v,
    can: v,
    must: v,
    us: v,
    me: v,
    let: v,
    even: v,
    when: v,
    help: v, //help combat
    // them: v,
    he: v,
    she: v,
    it: v,
    being: v,
    // prefixes
    bi: v,
    co: v,
    contra: v,
    de: v,
    inter: v,
    intra: v,
    mis: v,
    pre: v,
    out: v,
    counter: v,
    nobody: v,
    somebody: v,
    anybody: v,
    everybody: v,
    // un: v,
    // over: v,
    // under: v,
  },
  afterWords: {
    the: v, //echo the
    me: v, //date me
    you: v, //date you
    him: v, //loves him
    us: v, //cost us
    her: v, //
    his: v, //
    them: v, //
    they: v, //
    it: v, //hope it
    himself: v,
    herself: v,
    itself: v,
    myself: v,
    ourselves: v,
    themselves: v,
    something: v,
    anything: v,

    a: v, //covers a
    an: v, //covers an
    // from: v, //ranges from
    up: v, //serves up
    down: v, //serves up
    by: v,
    // in: v, //bob in
    out: v,
    // on: v,
    off: v,
    under: v,
    what: v, //look what
    // when: v,//starts when
    // for:true, //settled for
    all: v, //shiver all night
    // conjunctions
    to: v, //dip to
    because: v, //
    although: v, //
    // after: v,
    // before: v,//
    how: v, //
    otherwise: v, //
    together: v, //fit together
    though: v, //
    into: v, //
    yet: v, //
    more: v, //kill more
    here: v, // look here
    there: v, //
    away: v, //float away
  },
};

// 'the pilot' vs 'pilot the plane'
const clue$7 = {
  beforeTags: Object.assign({}, verb.beforeTags, noun$1.beforeTags, {
  }),
  afterTags: Object.assign({}, verb.afterTags, noun$1.afterTags, {}),
  beforeWords: Object.assign({}, verb.beforeWords, noun$1.beforeWords, {}),
  afterWords: Object.assign({}, verb.afterWords, noun$1.afterWords, {}),
};

const jj$2 = 'Adjective';

var adj$1 = {
  beforeTags: {
    Determiner: jj$2, //the detailed
    // Copula: jj, //is detailed
    Possessive: jj$2, //spencer's detailed
    Hyphenated: jj$2, //rapidly-changing
  },

  afterTags: {
    // Noun: jj, //detailed plan, overwhelming evidence
    Adjective: jj$2, //intoxicated little
  },

  beforeWords: {
    seem: jj$2, //seem prepared
    seemed: jj$2,
    seems: jj$2,
    feel: jj$2, //feel prepared
    feels: jj$2,
    felt: jj$2,
    stay: jj$2,
    appear: jj$2,
    appears: jj$2,
    appeared: jj$2,
    also: jj$2,
    over: jj$2, //over cooked
    under: jj$2,
    too: jj$2, //too insulting
    it: jj$2, //find it insulting
    but: jj$2, //nothing but frustrating
    still: jj$2, //still scared
    // adverbs that are adjective-ish
    really: jj$2, //really damaged
    quite: jj$2,
    well: jj$2,
    very: jj$2,
    truly: jj$2,
    how: jj$2, //how slow
    deeply: jj$2,
    hella: jj$2,
    // always: jj,
    // never: jj,
    profoundly: jj$2,
    extremely: jj$2,
    so: jj$2,
    badly: jj$2,
    mostly: jj$2,
    totally: jj$2,
    awfully: jj$2,
    rather: jj$2,
    nothing: jj$2, //nothing secret,
    something: jj$2, //something wrong
    anything: jj$2,
    not: jj$2, //not swell
    me: jj$2, //called me swell
    is: jj$2,

    face: jj$2, //faces shocking revelations
    faces: jj$2,
    faced: jj$2,

    look: jj$2,
    looks: jj$2,
    looked: jj$2,

    reveal: jj$2,
    reveals: jj$2,
    revealed: jj$2,

    sound: jj$2,
    sounded: jj$2,
    sounds: jj$2,
    remains: jj$2,
    remained: jj$2,
    prove: jj$2, //would prove shocking
    proves: jj$2,
    proved: jj$2,

    becomes: jj$2,
    stays: jj$2,
    tastes: jj$2,
    taste: jj$2,
    smells: jj$2,
    smell: jj$2,
    gets: jj$2, //gets shocking snowfall
    grows: jj$2,
    as: jj$2,
    rings: jj$2,
    radiates: jj$2,
    conveys: jj$2,
    convey: jj$2,
    conveyed: jj$2,
    of: jj$2,
    // 'smacks of': jj,
    // 'reeks of': jj,
  },
  afterWords: {
    too: jj$2, //insulting too
    also: jj$2, //insulting too
    or: jj$2, //insulting or
    enough: jj$2, //cool enough
    as: jj$2, //as shocking as
    //about: jj, //cool about
  },
};

const g$1 = 'Gerund';

// Adj|Gerund
// Noun|Gerund

var gerund = {
  beforeTags: {
    // Verb: g, // loves shocking
    Adverb: g$1, //quickly shocking
    Preposition: g$1, //by insulting
    Conjunction: g$1, //to insulting
  },
  afterTags: {
    Adverb: g$1, //shocking quickly
    Possessive: g$1, //shocking spencer's
    Person: g$1, //telling spencer
    Pronoun: g$1, //shocking him
    Determiner: g$1, //shocking the
    Copula: g$1, //shocking is
    Preposition: g$1, //dashing by, swimming in
    Conjunction: g$1, //insulting to
    Comparative: g$1, //growing shorter
  },
  beforeWords: {
    been: g$1,
    keep: g$1,//keep going
    continue: g$1,//
    stop: g$1,//
    am: g$1,//am watching
    be: g$1,//be timing
    me: g$1,//got me thinking
    // action-words
    began: g$1,
    start: g$1,
    starts: g$1,
    started: g$1,
    stops: g$1,
    stopped: g$1,
    help: g$1,
    helps: g$1,
    avoid: g$1,
    avoids: g$1,
    love: g$1,//love painting
    loves: g$1,
    loved: g$1,
    hate: g$1,
    hates: g$1,
    hated: g$1,
    // was:g,//was working
    // is:g,
    // be:g,
  },
  afterWords: {
    you: g$1, //telling you
    me: g$1, //
    her: g$1, //
    him: g$1, //
    his: g$1, //
    them: g$1, //
    their: g$1, // fighting their
    it: g$1, //dumping it
    this: g$1, //running this
    there: g$1, // swimming there
    on: g$1, // landing on
    about: g$1, // talking about
    for: g$1, // paying for
    up: g$1, //speeding up
    down: g$1, //
  },
};

const g = 'Gerund';
const jj$1 = 'Adjective';

// rallying the troops
// her rallying cry
const clue$6 = {
  beforeTags: Object.assign({}, adj$1.beforeTags, gerund.beforeTags, {
    // Copula: jj,
    Imperative: g, //recommend living in
    Infinitive: jj$1, //say charming things
    // PresentTense: g,
    Plural: g, //kids cutting
  }),

  afterTags: Object.assign({}, adj$1.afterTags, gerund.afterTags, {
    Noun: jj$1, //shocking ignorance
    // Plural: jj, //shocking lies
  }),

  beforeWords: Object.assign({}, adj$1.beforeWords, gerund.beforeWords, {
    is: jj$1,
    are: g, //is overflowing: JJ, are overflowing : VB ??
    was: jj$1,
    of: jj$1, //of varying
    suggest: g,
    suggests: g,
    suggested: g,

    recommend: g,
    recommends: g,
    recommended: g,

    imagine: g,
    imagines: g,
    imagined: g,

    consider: g,
    considered: g,
    considering: g,

    resist: g,
    resists: g,
    resisted: g,

    avoid: g,
    avoided: g,
    avoiding: g,

    except: jj$1,
    accept: jj$1,
    assess: g,
    explore: g,
    fear: g,
    fears: g,
    appreciate: g,
    question: g,
    help: g,
    embrace: g,
    with: jj$1, //filled with daring
  }),

  afterWords: Object.assign({}, adj$1.afterWords, gerund.afterWords, {
    to: g,
    not: g, //trying not to car
    the: g, //sweeping the country
  }),
};

// the commercial market
// watching the commercial

const misc$4 = {
  beforeTags: {
    Determiner: undefined, //the premier university
    Cardinal: 'Noun',//1950 convertable
    PhrasalVerb: 'Adjective'//starts out fine
  },
  afterTags: {
    // Pronoun: 'Noun'//as an adult i
  }
};
const clue$5 = {
  beforeTags: Object.assign({}, adj$1.beforeTags, noun$1.beforeTags, misc$4.beforeTags),
  afterTags: Object.assign({}, adj$1.afterTags, noun$1.afterTags, misc$4.afterTags),
  beforeWords: Object.assign({}, adj$1.beforeWords, noun$1.beforeWords, {
    // are representative
    are: 'Adjective', is: 'Adjective', was: 'Adjective', be: 'Adjective',
    // phrasals
    off: 'Adjective',//start off fine
    out: 'Adjective',//comes out fine
  }),
  afterWords: Object.assign({}, adj$1.afterWords, noun$1.afterWords),
};

// the boiled egg
// boiled the water
const past$1 = 'PastTense';
const jj = 'Adjective';

const adjPast = {
  beforeTags: {
    Adverb: past$1, //quickly detailed
    Pronoun: past$1, //he detailed
    ProperNoun: past$1, //toronto closed
    Auxiliary: past$1,
    Noun: past$1, //eye closed  -- i guess.
  },
  afterTags: {
    Possessive: past$1, //hooked him
    Pronoun: past$1, //hooked me
    Determiner: past$1, //hooked the
    Adverb: past$1, //cooked perfectly
    Comparative: past$1, //closed higher
    Date: past$1, // alleged thursday
    Gerund: past$1, //left dancing
  },
  beforeWords: {
    be: past$1, //be hooked vs be embarrassed
    who: past$1, //who lost
    get: jj, //get charged
    had: past$1,
    has: past$1,
    have: past$1,
    been: past$1,
    it: past$1, //it intoxicated him
    as: past$1, //as requested
    for: jj, //for discounted items
    more: jj, //more broken promises
    always: jj,
  },
  afterWords: {
    by: past$1, //damaged by
    back: past$1, //charged back
    out: past$1, //charged out
    in: past$1, //crowded in
    up: past$1, //heated up
    down: past$1, //hammered down
    before: past$1, //
    after: past$1, //
    for: past$1, //settled for
    the: past$1, //settled the
    with: past$1, //obsessed with
    as: past$1, //known as
    on: past$1, //focused on
    at: past$1, //recorded at
    between: past$1, //settled between
    to: past$1, //dedicated to
    into: past$1, //pumped into
    us: past$1, //charged us
    them: past$1, //charged us
    his: past$1, //shared his
    her: past$1, //
    their: past$1, //
    our: past$1, //
    me: past$1, //
    about: jj,
  },
};

var adjPast$1 = {
  beforeTags: Object.assign({}, adj$1.beforeTags, adjPast.beforeTags),
  afterTags: Object.assign({}, adj$1.afterTags, adjPast.afterTags),
  beforeWords: Object.assign({}, adj$1.beforeWords, adjPast.beforeWords),
  afterWords: Object.assign({}, adj$1.afterWords, adjPast.afterWords),
};

// 'would mean' vs 'is mean'
const misc$3 = {
  afterTags: {
    Noun: 'Adjective',//ruling party
    Conjunction: undefined //clean and excellent
  }
};
const clue$4 = {
  beforeTags: Object.assign({}, adj$1.beforeTags, verb.beforeTags, {
    // always clean
    Adverb: undefined, Negative: undefined
  }),
  afterTags: Object.assign({}, adj$1.afterTags, verb.afterTags, misc$3.afterTags),
  beforeWords: Object.assign({}, adj$1.beforeWords, verb.beforeWords, {
    // have seperate contracts
    have: undefined, had: undefined, not: undefined,
    //went wrong, got wrong
    went: 'Adjective', goes: 'Adjective', got: 'Adjective',
    // be sure
    be: 'Adjective'
  }),
  afterWords: Object.assign({}, adj$1.afterWords, verb.afterWords, {
    to: undefined,//slick to the touch
    as: 'Adjective',//pale as
  }),
};

// 'operating the crane', or 'operating room'
const misc$2 = {
  beforeTags: {
    Copula: 'Gerund',
    PastTense: 'Gerund',
    PresentTense: 'Gerund',
    Infinitive: 'Gerund',
  },
  afterTags: {
    Value: 'Gerund', //maintaining 500
  },
  beforeWords: {
    are: 'Gerund',
    were: 'Gerund',
    be: 'Gerund',
    no: 'Gerund',
    without: 'Gerund',
    //are you playing
    you: 'Gerund',
    we: 'Gerund',
    they: 'Gerund',
    he: 'Gerund',
    she: 'Gerund',
    //stop us playing
    us: 'Gerund',
    them: 'Gerund',
  },
  afterWords: {
    // offering the
    the: 'Gerund',
    this: 'Gerund',
    that: 'Gerund',
    //got me thinking
    me: 'Gerund',
    us: 'Gerund',
    them: 'Gerund',
  },
};
const clue$3 = {
  beforeTags: Object.assign({}, gerund.beforeTags, noun$1.beforeTags, misc$2.beforeTags),
  afterTags: Object.assign({}, gerund.afterTags, noun$1.afterTags, misc$2.afterTags),
  beforeWords: Object.assign({}, gerund.beforeWords, noun$1.beforeWords, misc$2.beforeWords),
  afterWords: Object.assign({}, gerund.afterWords, noun$1.afterWords, misc$2.afterWords),
};

const nn$1 = 'Singular';
const vb$1 = 'Infinitive';
// 'boot the ball'   -  'the red boot'
// 'boots the ball'  -   'the red boots'
const clue$2 = {
  beforeTags: Object.assign({}, verb.beforeTags, noun$1.beforeTags, {
    // Noun: undefined
    Adjective: nn$1,//great name
    Particle: nn$1//brought under control
  }),
  afterTags: Object.assign({}, verb.afterTags, noun$1.afterTags, {
    ProperNoun: vb$1, Gerund: vb$1, Adjective: vb$1,
    Copula: nn$1,
  }),
  beforeWords: Object.assign({}, verb.beforeWords, noun$1.beforeWords, {
    // is time
    is: nn$1, was: nn$1,
    //balance of power
    of: nn$1,
    have: null //have cash
  }),
  afterWords: Object.assign({}, verb.afterWords, noun$1.afterWords, {
    // for: vb,//work for
    instead: vb$1,
    // that: nn,//subject that was
    // for: vb,//work for
    about: vb$1,//talk about
    his: vb$1,//shot his
    her: vb$1,//
    to: null,
    by: null,
    in: null
  }),
};

const p$2 = 'Person';

var person$1 = {
  beforeTags: {
    Honorific: p$2,
    Person: p$2,
    // Preposition: p, //with sue
  },
  afterTags: {
    Person: p$2,
    ProperNoun: p$2,
    Verb: p$2, //bob could
    // Modal:true, //bob could
    // Copula:true, //bob is
    // PresentTense:true, //bob seems
  },
  beforeWords: {
    hi: p$2,
    hey: p$2,
    yo: p$2,
    dear: p$2,
    hello: p$2,
  },
  afterWords: {
    // person-usually verbs
    said: p$2,
    says: p$2,
    told: p$2,
    tells: p$2,
    feels: p$2,
    felt: p$2,
    seems: p$2,
    thinks: p$2,
    thought: p$2,
    spends: p$2,
    spendt: p$2,
    plays: p$2,
    played: p$2,
    sing: p$2,
    sang: p$2,
    learn: p$2,
    learned: p$2,
    wants: p$2,
    wanted: p$2
    // and:true, //sue and jeff
  },
};

// 'april o'neil'  -  'april 1st'

const m$1 = 'Month';
const p$1 = 'Person';
const month = {
  beforeTags: {
    Date: m$1,
    Value: m$1,
  },
  afterTags: {
    Date: m$1,
    Value: m$1,
  },
  beforeWords: {
    by: m$1,
    in: m$1,
    on: m$1,
    during: m$1,
    after: m$1,
    before: m$1,
    between: m$1,
    until: m$1,
    til: m$1,
    sometime: m$1,
    of: m$1, //5th of april
    this: m$1, //this april
    next: m$1,
    last: m$1,
    previous: m$1,
    following: m$1,
    with: p$1,
    // for: p,
  },
  afterWords: {
    sometime: m$1,
    in: m$1,
    of: m$1,
    until: m$1,
    the: m$1, //june the 4th
  },
};
var personDate = {
  beforeTags: Object.assign({}, person$1.beforeTags, month.beforeTags),
  afterTags: Object.assign({}, person$1.afterTags, month.afterTags),
  beforeWords: Object.assign({}, person$1.beforeWords, month.beforeWords),
  afterWords: Object.assign({}, person$1.afterWords, month.afterWords),
};

// 'babling brook' vs 'brook sheilds'

const clue$1 = {
  beforeTags: Object.assign({}, noun$1.beforeTags, person$1.beforeTags),
  afterTags: Object.assign({}, noun$1.afterTags, person$1.afterTags),
  beforeWords: Object.assign({}, noun$1.beforeWords, person$1.beforeWords, { i: 'Infinitive', we: 'Infinitive' }),
  afterWords: Object.assign({}, noun$1.afterWords, person$1.afterWords),
};

// 'rob the store'   -  'rob lowe'
// can be a noun too - 'losing hope'
const clues$3 = {
  beforeTags: Object.assign({}, noun$1.beforeTags, person$1.beforeTags, verb.beforeTags),
  afterTags: Object.assign({}, noun$1.afterTags, person$1.afterTags, verb.afterTags),
  beforeWords: Object.assign({}, noun$1.beforeWords, person$1.beforeWords, verb.beforeWords),
  afterWords: Object.assign({}, noun$1.afterWords, person$1.afterWords, verb.afterWords),
};

const p = 'Place';

// 'paris hilton' vs 'paris france'
const place = {
  beforeTags: {
    Place: p
  },
  afterTags: {
    Place: p,
    Abbreviation: p
  },
  beforeWords: {
    in: p,
    by: p,
    near: p,
    from: p,
    to: p,
  },
  afterWords: {
    in: p,
    by: p,
    near: p,
    from: p,
    to: p,
    government: p,
    council: p,
    region: p,
    city: p,
  },
};

const clue = {
  beforeTags: Object.assign({}, place.beforeTags, person$1.beforeTags),
  afterTags: Object.assign({}, place.afterTags, person$1.afterTags),
  beforeWords: Object.assign({}, place.beforeWords, person$1.beforeWords),
  afterWords: Object.assign({}, place.afterWords, person$1.afterWords),
};

// 'rusty nail'   -  'rusty smith'
const clues$2 = {
  beforeTags: Object.assign({}, person$1.beforeTags, adj$1.beforeTags),
  afterTags: Object.assign({}, person$1.afterTags, adj$1.afterTags),
  beforeWords: Object.assign({}, person$1.beforeWords, adj$1.beforeWords),
  afterWords: Object.assign({}, person$1.afterWords, adj$1.afterWords),
};

// '5 oz'   -  'dr oz'
const un = 'Unit';
const clues$1 = {
  beforeTags: { Value: un },
  afterTags: {},
  beforeWords: {
    per: un,
    every: un,
    each: un,
    square: un, //square km
    cubic: un,
    sq: un,
    metric: un //metric ton
  },
  afterWords: {
    per: un,
    squared: un,
    cubed: un,
    long: un //foot long
  },
};

const clues = {
  'Actor|Verb': clue$7,
  'Adj|Gerund': clue$6,
  'Adj|Noun': clue$5,
  'Adj|Past': adjPast$1,
  'Adj|Present': clue$4,
  'Noun|Verb': clue$2,
  'Noun|Gerund': clue$3,
  'Person|Noun': clue$1,
  'Person|Date': personDate,
  'Person|Verb': clues$3,
  'Person|Place': clue,
  'Person|Adj': clues$2,
  'Unit|Noun': clues$1,
};

const copy = (obj, more) => {
  const res = Object.keys(obj).reduce((h, k) => {
    h[k] = obj[k] === 'Infinitive' ? 'PresentTense' : 'Plural';
    return h
  }, {});
  return Object.assign(res, more)
};

// make a copy of this one
clues['Plural|Verb'] = {
  beforeWords: copy(clues['Noun|Verb'].beforeWords, {
    had: 'Plural', //had tears
    have: 'Plural',
  }),
  afterWords: copy(clues['Noun|Verb'].afterWords, {
    his: 'PresentTense', her: 'PresentTense', its: 'PresentTense',
    in: null, to: null,
    is: 'PresentTense', //the way it works is
    by: 'PresentTense', //it works by
  }),
  beforeTags: copy(clues['Noun|Verb'].beforeTags, {
    Conjunction: 'PresentTense', //and changes
    Noun: undefined, //the century demands
    ProperNoun: 'PresentTense'//john plays
  }),
  afterTags: copy(clues['Noun|Verb'].afterTags, {
    Gerund: 'Plural',//ice caps disappearing
    Noun: 'PresentTense', //changes gears
    Value: 'PresentTense' //changes seven gears
  }),
};

//just a foolish lookup of known suffixes
const Adj$2 = 'Adjective';
const Inf$1 = 'Infinitive';
const Pres$1 = 'PresentTense';
const Sing$1 = 'Singular';
const Past$1 = 'PastTense';
const Avb = 'Adverb';
const Plrl = 'Plural';
const Actor$1 = 'Actor';
const Vb = 'Verb';
const Noun$2 = 'Noun';
const Prop = 'ProperNoun';
const Last$1 = 'LastName';
const Modal = 'Modal';
const Place = 'Place';
const Prt = 'Participle';

var suffixPatterns = [
  null,
  null,
  {
    //2-letter
    ea: Sing$1,
    ia: Noun$2,
    ic: Adj$2,
    ly: Avb,
    "'n": Vb,
    "'t": Vb,
  },
  {
    //3-letter
    oed: Past$1,
    ued: Past$1,
    xed: Past$1,
    ' so': Avb,
    "'ll": Modal,
    "'re": 'Copula',
    azy: Adj$2,
    eer: Noun$2,
    end: Vb,
    ped: Past$1,
    ffy: Adj$2,
    ify: Inf$1,
    ing: 'Gerund',
    ize: Inf$1,
    ibe: Inf$1,
    lar: Adj$2,
    mum: Adj$2,
    nes: Pres$1,
    nny: Adj$2,
    // oid: Adj,
    ous: Adj$2,
    que: Adj$2,
    ger: Noun$2,
    ber: Noun$2,
    rol: Sing$1,
    sis: Sing$1,
    ogy: Sing$1,
    oid: Sing$1,
    ian: Sing$1,
    zes: Pres$1,
    eld: Past$1,
    ken: Prt, //awoken
    ven: Prt, //woven
    ten: Prt, //brighten
    ect: Inf$1,
    ict: Inf$1,
    // ide: Inf,
    ign: Inf$1,
    oze: Inf$1,
    ful: Adj$2,
    bal: Adj$2,
    ton: Noun$2,
    pur: Place,
  },
  {
    //4-letter
    amed: Past$1,
    aped: Past$1,
    ched: Past$1,
    lked: Past$1,
    rked: Past$1,
    reed: Past$1,
    nded: Past$1,
    mned: Adj$2,
    cted: Past$1,
    dged: Past$1,
    ield: Sing$1,
    akis: Last$1,
    cede: Inf$1,
    chuk: Last$1,
    czyk: Last$1,
    ects: Pres$1,
    iend: Sing$1,
    ends: Vb,
    enko: Last$1,
    ette: Sing$1,
    iary: Sing$1,
    wner: Sing$1, //owner
    fies: Pres$1,
    fore: Avb,
    gate: Inf$1,
    gone: Adj$2,
    ices: Plrl,
    ints: Plrl,
    ruct: Inf$1,
    ines: Plrl,
    ions: Plrl,
    ners: Plrl,
    pers: Plrl,
    lers: Plrl,
    less: Adj$2,
    llen: Adj$2,
    made: Adj$2,
    nsen: Last$1,
    oses: Pres$1,
    ould: Modal,
    some: Adj$2,
    sson: Last$1,
    ians: Plrl,
    // tage: Inf,
    tion: Sing$1,
    tage: Noun$2,
    ique: Sing$1,
    tive: Adj$2,
    tors: Noun$2,
    vice: Sing$1,
    lier: Sing$1,
    fier: Sing$1,
    wned: Past$1,
    gent: Sing$1,
    tist: Actor$1,
    pist: Actor$1,
    rist: Actor$1,
    mist: Actor$1,
    yist: Actor$1,
    vist: Actor$1,
    ists: Actor$1,
    lite: Sing$1,
    site: Sing$1,
    rite: Sing$1,
    mite: Sing$1,
    bite: Sing$1,
    mate: Sing$1,
    date: Sing$1,
    ndal: Sing$1,
    vent: Sing$1,
    uist: Actor$1,
    gist: Actor$1,
    note: Sing$1,
    cide: Sing$1, //homicide
    ence: Sing$1, //absence
    wide: Adj$2, //nationwide
    // side: Adj,//alongside
    vide: Inf$1, //provide
    ract: Inf$1,
    duce: Inf$1,
    pose: Inf$1,
    eive: Inf$1,
    lyze: Inf$1,
    lyse: Inf$1,
    iant: Adj$2,
    nary: Adj$2,
    ghty: Adj$2,
    uent: Adj$2,
    erer: Actor$1, //caterer
    bury: Place,
    dorf: Noun$2,
    esty: Noun$2,
    wych: Place,
    dale: Place,
    folk: Place,
    vale: Place,
    abad: Place,
    sham: Place,
    wick: Place,
    view: Place,
  },
  {
    //5-letter
    elist: Actor$1,
    holic: Sing$1,
    phite: Sing$1,
    tized: Past$1,
    urned: Past$1,
    eased: Past$1,
    ances: Plrl,
    bound: Adj$2,
    ettes: Plrl,
    fully: Avb,
    ishes: Pres$1,
    ities: Plrl,
    marek: Last$1,
    nssen: Last$1,
    ology: Noun$2,
    osome: Sing$1,
    tment: Sing$1,
    ports: Plrl,
    rough: Adj$2,
    tches: Pres$1,
    tieth: 'Ordinal',
    tures: Plrl,
    wards: Avb,
    where: Avb,
    archy: Noun$2,
    pathy: Noun$2,
    opoly: Noun$2,
    embly: Noun$2,
    phate: Noun$2,
    ndent: Sing$1,
    scent: Sing$1,
    onist: Actor$1,
    anist: Actor$1,
    alist: Actor$1,
    olist: Actor$1,
    icist: Actor$1,
    ounce: Inf$1,
    iable: Adj$2,
    borne: Adj$2,
    gnant: Adj$2,
    inant: Adj$2,
    igent: Adj$2,
    atory: Adj$2,
    // ctory: Adj,
    rient: Sing$1,
    dient: Sing$1,
    maker: Actor$1,
    burgh: Place,
    mouth: Place,
    ceter: Place,
    ville: Place,
    hurst: Place,
    stead: Place,
    endon: Place,
    brook: Place,
    shire: Place,
    worth: Noun$2,
    field: Prop,
    ridge: Place,
  },
  {
    //6-letter
    auskas: Last$1,
    parent: Sing$1,
    cedent: Sing$1,
    ionary: Sing$1,
    cklist: Sing$1,
    brooke: Place,
    keeper: Actor$1,
    logist: Actor$1,
    teenth: 'Value',
    worker: Actor$1,
    master: Actor$1,
    writer: Actor$1,
    brough: Place,
    cester: Place,
    ington: Place,
    cliffe: Place,
    ingham: Place,
  },
  {
    //7-letter
    chester: Place,
    logists: Actor$1,
    opoulos: Last$1,
    borough: Place,
    sdottir: Last$1, //swedish female
  },
];

//prefixes give very-little away, in general.
// more-often for scientific terms, etc.
const Adj$1 = 'Adjective';
const Noun$1 = 'Noun';
const Verb$1 = 'Verb';

var prefixPatterns = [
  null,
  null,
  {
    // 2-letter
  },
  {
    // 3-letter
    neo: Noun$1,
    bio: Noun$1,
    // pre: Noun,
    'de-': Verb$1,
    're-': Verb$1,
    'un-': Verb$1,
    'ex-': Noun$1,
  },
  {
    // 4-letter
    anti: Noun$1,
    auto: Noun$1,
    faux: Adj$1,
    hexa: Noun$1,
    kilo: Noun$1,
    mono: Noun$1,
    nano: Noun$1,
    octa: Noun$1,
    poly: Noun$1,
    semi: Adj$1,
    tele: Noun$1,
    'pro-': Adj$1,
    'mis-': Verb$1,
    'dis-': Verb$1,
    'pre-': Adj$1, //hmm
  },
  {
    // 5-letter
    anglo: Noun$1,
    centi: Noun$1,
    ethno: Noun$1,
    ferro: Noun$1,
    grand: Noun$1,
    hepta: Noun$1,
    hydro: Noun$1,
    intro: Noun$1,
    macro: Noun$1,
    micro: Noun$1,
    milli: Noun$1,
    nitro: Noun$1,
    penta: Noun$1,
    quasi: Adj$1,
    radio: Noun$1,
    tetra: Noun$1,
    'omni-': Adj$1,
    'post-': Adj$1,
  },
  {
    // 6-letter
    pseudo: Adj$1,
    'extra-': Adj$1,
    'hyper-': Adj$1,
    'inter-': Adj$1,
    'intra-': Adj$1,
    'deca-': Adj$1,
    // 'trans-': Noun,
  },
  {
    // 7-letter
    electro: Noun$1,
  },
];

//regex suffix patterns and their most common parts of speech,
//built using wordnet, by spencer kelly.
//this mapping shrinks-down the uglified build
const Adj = 'Adjective';
const Inf = 'Infinitive';
const Pres = 'PresentTense';
const Sing = 'Singular';
const Past = 'PastTense';
const Adverb = 'Adverb';
const Exp = 'Expression';
const Actor = 'Actor';
const Verb = 'Verb';
const Noun = 'Noun';
const Last = 'LastName';

var endsWith = {
  a: [
    [/.[aeiou]na$/, Noun, 'tuna'],
    [/.[oau][wvl]ska$/, Last],
    [/.[^aeiou]ica$/, Sing, 'harmonica'],
    [/^([hyj]a+)+$/, Exp, 'haha'], //hahah
  ],
  c: [[/.[^aeiou]ic$/, Adj]],
  d: [
    //==-ed==
    //double-consonant
    [/[aeiou](pp|ll|ss|ff|gg|tt|rr|bb|nn|mm)ed$/, Past, 'popped'],
    //double-vowel
    [/.[aeo]{2}[bdgmnprvz]ed$/, Past, 'rammed'],
    //-hed
    [/.[aeiou][sg]hed$/, Past, 'gushed'],
    //-rd
    [/.[aeiou]red$/, Past, 'hired'],
    [/.[aeiou]r?ried$/, Past, 'hurried'],
    // ard
    [/[^aeiou]ard$/, Sing, 'steward'],
    // id
    [/[aeiou][^aeiou]id$/, Adj, ''],
    [/.[vrl]id$/, Adj, 'livid'],

    // ===== -ed ======
    //-led
    [/..led$/, Past, 'hurled'],
    //-sed
    [/.[iao]sed$/, Past, ''],
    [/[aeiou]n?[cs]ed$/, Past, ''],
    //-med
    [/[aeiou][rl]?[mnf]ed$/, Past, ''],
    //-ked
    [/[aeiou][ns]?c?ked$/, Past, 'bunked'],
    //-gned
    [/[aeiou]gned$/, Past],
    //-ged
    [/[aeiou][nl]?ged$/, Past],
    //-ted
    [/.[tdbwxyz]ed$/, Past],
    [/[^aeiou][aeiou][tvx]ed$/, Past],
    //-ied
    [/.[cdflmnprstv]ied$/, Past, 'emptied'],
  ],
  e: [
    [/.[lnr]ize$/, Inf, 'antagonize'],
    [/.[^aeiou]ise$/, Inf, 'antagonise'],
    [/.[aeiou]te$/, Inf, 'bite'],
    [/.[^aeiou][ai]ble$/, Adj, 'fixable'],
    [/.[^aeiou]eable$/, Adj, 'maleable'],
    [/.[ts]ive$/, Adj, 'festive'],
    [/[a-z]-like$/, Adj, 'woman-like'],
  ],
  h: [
    [/.[^aeiouf]ish$/, Adj, 'cornish'],
    [/.v[iy]ch$/, Last, '..ovich'],
    [/^ug?h+$/, Exp, 'ughh'],
    [/^uh[ -]?oh$/, Exp, 'uhoh'],
    [/[a-z]-ish$/, Adj, 'cartoon-ish'],
  ],
  i: [[/.[oau][wvl]ski$/, Last, 'polish-male']],
  k: [
    [/^(k){2}$/, Exp, 'kkkk'], //kkkk
  ],
  l: [
    [/.[gl]ial$/, Adj, 'familial'],
    [/.[^aeiou]ful$/, Adj, 'fitful'],
    [/.[nrtumcd]al$/, Adj, 'natal'],
    [/.[^aeiou][ei]al$/, Adj, 'familial'],
  ],
  m: [
    [/.[^aeiou]ium$/, Sing, 'magnesium'],
    [/[^aeiou]ism$/, Sing, 'schism'],
    [/^[hu]m+$/, Exp, 'hmm'],
    [/^\d+ ?[ap]m$/, 'Date', '3am'],
  ],
  n: [
    [/.[lsrnpb]ian$/, Adj, 'republican'],
    [/[^aeiou]ician$/, Actor, 'musician'],
    [/[aeiou][ktrp]in'$/, 'Gerund', "cookin'"], // 'cookin', 'hootin'
  ],
  o: [
    [/^no+$/, Exp, 'noooo'],
    [/^(yo)+$/, Exp, 'yoo'],
    [/^wo{2,}[pt]?$/, Exp, 'woop'], //woo
  ],
  r: [
    [/.[bdfklmst]ler$/, 'Noun'],
    [/[aeiou][pns]er$/, Sing],
    [/[^i]fer$/, Inf],
    [/.[^aeiou][ao]pher$/, Actor],
    [/.[lk]er$/, 'Noun'],
    [/.ier$/, 'Comparative'],
  ],
  t: [
    [/.[di]est$/, 'Superlative'],
    [/.[icldtgrv]ent$/, Adj],
    [/[aeiou].*ist$/, Adj],
    [/^[a-z]et$/, Verb],
  ],
  s: [
    [/.[^aeiou]ises$/, Pres],
    [/.[rln]ates$/, Pres],
    [/.[^z]ens$/, Verb],
    [/.[lstrn]us$/, Sing],
    [/.[aeiou]sks$/, Pres],
    [/.[aeiou]kes$/, Pres],
    [/[aeiou][^aeiou]is$/, Sing],
    [/[a-z]'s$/, Noun],
    [/^yes+$/, Exp], //yessss
  ],
  v: [
    [/.[^aeiou][ai][kln]ov$/, Last], //east-europe
  ],
  y: [
    [/.[cts]hy$/, Adj],
    [/.[st]ty$/, Adj],
    [/.[tnl]ary$/, Adj],
    [/.[oe]ry$/, Sing],
    [/[rdntkbhs]ly$/, Adverb],
    [/.(gg|bb|zz)ly$/, Adj],
    [/...lly$/, Adverb],
    [/.[gk]y$/, Adj],
    [/[bszmp]{2}y$/, Adj],
    [/.[ai]my$/, Adj],
    [/[ea]{2}zy$/, Adj],
    [/.[^aeiou]ity$/, Sing],
  ],
};

const vb = 'Verb';
const nn = 'Noun';

var neighbours$1 = {
  // looking at the previous word's tags:
  leftTags: [
    ['Adjective', nn],
    ['Possessive', nn],
    ['Determiner', nn],
    ['Adverb', vb],
    ['Pronoun', vb],
    ['Value', nn],
    ['Ordinal', nn],
    ['Modal', vb],
    ['Superlative', nn],
    ['Demonym', nn],
    ['Honorific', 'Person'], //dr. Smith
  ],
  // looking at the previous word:
  leftWords: [
    ['i', vb],
    ['first', nn],
    ['it', vb],
    ['there', vb],
    ['not', vb],
    ['because', nn],
    ['if', nn],
    ['but', nn],
    ['who', vb],
    ['this', nn],
    ['his', nn],
    ['when', nn],
    ['you', vb],
    ['very', 'Adjective'],
    ['old', nn],
    ['never', vb],
    ['before', nn],
    ['a', nn],
    ['the', nn],
    ['been', vb],
  ],

  // looking at the next word's tags:
  rightTags: [
    ['Copula', nn],
    ['PastTense', nn],
    ['Conjunction', nn],
    ['Modal', nn],
  ],
  // looking at the next word:
  rightWords: [
    ['there', vb],
    ['me', vb],
    ['man', 'Adjective'],
    // ['only', vb],
    ['him', vb],
    ['it', vb],//relaunch it
    ['were', nn],
    ['took', nn],
    ['himself', vb],
    ['went', nn],
    ['who', nn],
    ['jr', 'Person'],
  ],
};

// generated in ./lib/pairs
var data = {
  "Comparative": {
    "fwd": "3:ser,ier¦1er:h,t,f,l,n¦1r:e¦2er:ss,or,om",
    "both": "3er:ver,ear,alm¦3ner:hin¦3ter:lat¦2mer:im¦2er:ng,rm,mb¦2ber:ib¦2ger:ig¦1er:w,p,k,d¦ier:y",
    "rev": "1:tter,yer¦2:uer,ver,ffer,oner,eler,ller,iler,ster,cer,uler,sher,ener,gher,aner,adder,nter,eter,rter,hter,rner,fter¦3:oser,ooler,eafer,user,airer,bler,maler,tler,eater,uger,rger,ainer,urer,ealer,icher,pler,emner,icter,nser,iser¦4:arser,viner,ucher,rosser,somer,ndomer,moter,oother,uarer,hiter¦5:nuiner,esser,emier¦ar:urther",
    "ex": "worse:bad¦better:good¦4er:fair,gray,poor¦1urther:far¦3ter:fat,hot,wet¦3der:mad,sad¦3er:shy,fun¦4der:glad¦:¦4r:cute,dire,fake,fine,free,lame,late,pale,rare,ripe,rude,safe,sore,tame,wide¦5r:eerie,stale"
  },
  "Gerund": {
    "fwd": "1:nning,tting,rring,pping,eing,mming,gging,dding,bbing,kking¦2:eking,oling,eling,eming¦3:velling,siting,uiting,fiting,loting,geting,ialing,celling¦4:graming",
    "both": "1:aing,iing,fing,xing,ying,oing,hing,wing¦2:tzing,rping,izzing,bting,mning,sping,wling,rling,wding,rbing,uping,lming,wning,mping,oning,lting,mbing,lking,fting,hting,sking,gning,pting,cking,ening,nking,iling,eping,ering,rting,rming,cting,lping,ssing,nting,nding,lding,sting,rning,rding,rking¦3:belling,siping,toming,yaking,uaking,oaning,auling,ooping,aiding,naping,euring,tolling,uzzing,ganing,haning,ualing,halling,iasing,auding,ieting,ceting,ouling,voring,ralling,garing,joring,oaming,oaking,roring,nelling,ooring,uelling,eaming,ooding,eaping,eeting,ooting,ooming,xiting,keting,ooking,ulling,airing,oaring,biting,outing,oiting,earing,naling,oading,eeding,ouring,eaking,aiming,illing,oining,eaning,onging,ealing,aining,eading¦4:thoming,melling,aboring,ivoting,weating,dfilling,onoring,eriting,imiting,tialling,rgining,otoring,linging,winging,lleting,louding,spelling,mpelling,heating,feating,opelling,choring,welling,ymaking,ctoring,calling,peating,iloring,laiting,utoring,uditing,mmaking,loating,iciting,waiting,mbating,voiding,otalling,nsoring,nselling,ocusing,itoring,eloping¦5:rselling,umpeting,atrolling,treating,tselling,rpreting,pringing,ummeting,ossoming,elmaking,eselling,rediting,totyping,onmaking,rfeiting,ntrolling¦5e:chmaking,dkeeping,severing,erouting,ecreting,ephoning,uthoring,ravening,reathing,pediting,erfering,eotyping,fringing,entoring,ombining,ompeting¦4e:emaking,eething,twining,rruling,chuting,xciting,rseding,scoping,edoring,pinging,lunging,agining,craping,pleting,eleting,nciting,nfining,ncoding,tponing,ecoding,writing,esaling,nvening,gnoring,evoting,mpeding,rvening,dhering,mpiling,storing,nviting,ploring¦3e:tining,nuring,saking,miring,haling,ceding,xuding,rining,nuting,laring,caring,miling,riding,hoking,piring,lading,curing,uading,noting,taping,futing,paring,hading,loding,siring,guring,vading,voking,during,niting,laning,caping,luting,muting,ruding,ciding,juring,laming,caling,hining,uoting,liding,ciling,duling,tuting,puting,cuting,coring,uiding,tiring,turing,siding,rading,enging,haping,buting,lining,taking,anging,haring,uiring,coming,mining,moting,suring,viding,luding¦2e:tring,zling,uging,oging,gling,iging,vring,fling,lging,obing,psing,pling,ubing,cling,dling,wsing,iking,rsing,dging,kling,ysing,tling,rging,eging,nsing,uning,osing,uming,using,ibing,bling,aging,ising,asing,ating¦2ie:rlying¦1e:zing,uing,cing,ving",
    "rev": "ying:ie¦1ing:se,ke,te,we,ne,re,de,pe,me,le,c,he¦2ing:ll,ng,dd,ee,ye,oe,rg,us¦2ning:un¦2ging:og,ag,ug,ig,eg¦2ming:um¦2bing:ub,ab,eb,ob¦3ning:lan,can,hin,pin,win¦3ring:cur,lur,tir,tar,pur,car¦3ing:ait,del,eel,fin,eat,oat,eem,lel,ool,ein,uin¦3ping:rop,rap,top,uip,wap,hip,hop,lap,rip,cap¦3ming:tem,wim,rim,kim,lim¦3ting:mat,cut,pot,lit,lot,hat,set,pit,put¦3ding:hed,bed,bid¦3king:rek¦3ling:cil,pel¦3bing:rib¦4ning:egin¦4ing:isit,ruit,ilot,nsit,dget,rkel,ival,rcel¦4ring:efer,nfer¦4ting:rmit,mmit,ysit,dmit,emit,bmit,tfit,gret¦4ling:evel,xcel,ivel¦4ding:hred¦5ing:arget,posit,rofit¦5ring:nsfer¦5ting:nsmit,orget,cquit¦5ling:ancel,istil",
    "ex": "3:adding,eating,aiming,aiding,airing,outing,gassing,setting,getting,putting,cutting,winning,sitting,betting,mapping,tapping,letting,bidding,hitting,tanning,netting,popping,fitting,capping,lapping,barring,banning,vetting,topping,rotting,tipping,potting,wetting,pitting,dipping,budding,hemming,pinning,jetting,kidding,padding,podding,sipping,wedding,bedding,donning,warring,penning,gutting,cueing,wadding,petting,ripping,napping,matting,tinning,binning,dimming,hopping,mopping,nodding,panning,rapping,ridding,sinning¦4:selling,falling,calling,waiting,editing,telling,rolling,heating,boating,hanging,beating,coating,singing,tolling,felling,polling,discing,seating,voiding,gelling,yelling,baiting,reining,ruining,seeking,spanning,stepping,knitting,emitting,slipping,quitting,dialing,omitting,clipping,shutting,skinning,abutting,flipping,trotting,cramming,fretting,suiting¦5:bringing,treating,spelling,stalling,trolling,expelling,rivaling,wringing,deterring,singeing,befitting,refitting¦6:enrolling,distilling,scrolling,strolling,caucusing,travelling¦7:installing,redefining,stencilling,recharging,overeating,benefiting,unraveling,programing¦9:reprogramming¦is:being¦2e:using,aging,owing¦3e:making,taking,coming,noting,hiring,filing,coding,citing,doping,baking,coping,hoping,lading,caring,naming,voting,riding,mining,curing,lining,ruling,typing,boring,dining,firing,hiding,piling,taping,waning,baling,boning,faring,honing,wiping,luring,timing,wading,piping,fading,biting,zoning,daring,waking,gaming,raking,ceding,tiring,coking,wining,joking,paring,gaping,poking,pining,coring,liming,toting,roping,wiring,aching¦4e:writing,storing,eroding,framing,smoking,tasting,wasting,phoning,shaking,abiding,braking,flaking,pasting,priming,shoring,sloping,withing,hinging¦5e:defining,refining,renaming,swathing,fringing,reciting¦1ie:dying,tying,lying,vying¦7e:sunbathing"
  },
  "Participle": {
    "fwd": "1:mt¦2:llen¦3:iven,aken¦:ne¦y:in",
    "both": "1:wn¦2:me,aten¦3:seen,bidden,isen¦4:roven,asten¦3l:pilt¦3d:uilt¦2e:itten¦1im:wum¦1eak:poken¦1ine:hone¦1ose:osen¦1in:gun¦1ake:woken¦ear:orn¦eal:olen¦eeze:ozen¦et:otten¦ink:unk¦ing:ung",
    "rev": "2:un¦oken:eak¦ought:eek¦oven:eave¦1ne:o¦1own:ly¦1den:de¦1in:ay¦2t:am¦2n:ee¦3en:all¦4n:rive,sake,take¦5n:rgive",
    "ex": "2:been¦3:seen,run¦4:given,taken¦5:shaken¦2eak:broken¦1ive:dove¦2y:flown¦3e:hidden,ridden¦1eek:sought¦1ake:woken¦1eave:woven"
  },
  "PastTense": {
    "fwd": "1:tted,wed,gged,nned,een,rred,pped,yed,bbed,oed,dded,rd,wn,mmed¦2:eed,nded,et,hted,st,oled,ut,emed,eled,lded,ken,rt,nked,apt,ant,eped,eked¦3:eared,eat,eaded,nelled,ealt,eeded,ooted,eaked,eaned,eeted,mited,bid,uit,ead,uited,ealed,geted,velled,ialed,belled¦4:ebuted,hined,comed¦y:ied¦ome:ame¦ear:ore¦ind:ound¦ing:ung,ang¦ep:pt¦ink:ank,unk¦ig:ug¦all:ell¦ee:aw¦ive:ave¦eeze:oze¦old:eld¦ave:ft¦ake:ook¦ell:old¦ite:ote¦ide:ode¦ine:one¦in:un,on¦eal:ole¦im:am¦ie:ay¦and:ood¦1ise:rose¦1eak:roke¦1ing:rought¦1ive:rove¦1el:elt¦1id:bade¦1et:got¦1y:aid¦1it:sat¦3e:lid¦3d:pent",
    "both": "1:aed,fed,xed,hed¦2:sged,xted,wled,rped,lked,kied,lmed,lped,uped,bted,rbed,rked,wned,rled,mped,fted,mned,mbed,zzed,omed,ened,cked,gned,lted,sked,ued,zed,nted,ered,rted,rmed,ced,sted,rned,ssed,rded,pted,ved,cted¦3:cled,eined,siped,ooned,uked,ymed,jored,ouded,ioted,oaned,lged,asped,iged,mured,oided,eiled,yped,taled,moned,yled,lit,kled,oaked,gled,naled,fled,uined,oared,valled,koned,soned,aided,obed,ibed,meted,nicked,rored,micked,keted,vred,ooped,oaded,rited,aired,auled,filled,ouled,ooded,ceted,tolled,oited,bited,aped,tled,vored,dled,eamed,nsed,rsed,sited,owded,pled,sored,rged,osed,pelled,oured,psed,oated,loned,aimed,illed,eured,tred,ioned,celled,bled,wsed,ooked,oiled,itzed,iked,iased,onged,ased,ailed,uned,umed,ained,auded,nulled,ysed,eged,ised,aged,oined,ated,used,dged,doned¦4:ntied,efited,uaked,caded,fired,roped,halled,roked,himed,culed,tared,lared,tuted,uared,routed,pited,naked,miled,houted,helled,hared,cored,caled,tired,peated,futed,ciled,called,tined,moted,filed,sided,poned,iloted,honed,lleted,huted,ruled,cured,named,preted,vaded,sured,talled,haled,peded,gined,nited,uided,ramed,feited,laked,gured,ctored,unged,pired,cuted,voked,eloped,ralled,rined,coded,icited,vided,uaded,voted,mined,sired,noted,lined,nselled,luted,jured,fided,puted,piled,pared,olored,cided,hoked,enged,tured,geoned,cotted,lamed,uiled,waited,udited,anged,luded,mired,uired,raded¦5:modelled,izzled,eleted,umpeted,ailored,rseded,treated,eduled,ecited,rammed,eceded,atrolled,nitored,basted,twined,itialled,ncited,gnored,ploded,xcited,nrolled,namelled,plored,efeated,redited,ntrolled,nfined,pleted,llided,lcined,eathed,ibuted,lloted,dhered,cceded¦3ad:sled¦2aw:drew¦2ot:hot¦2ke:made¦2ow:hrew,grew¦2ose:hose¦2d:ilt¦2in:egan¦1un:ran¦1ink:hought¦1ick:tuck¦1ike:ruck¦1eak:poke,nuck¦1it:pat¦1o:did¦1ow:new¦1ake:woke¦go:went",
    "rev": "3:rst,hed,hut,cut,set¦4:tbid¦5:dcast,eread,pread,erbid¦ought:uy,eek¦1ied:ny,ly,dy,ry,fy,py,vy,by,ty,cy¦1ung:ling,ting,wing¦1pt:eep¦1ank:rink¦1ore:bear,wear¦1ave:give¦1oze:reeze¦1ound:rind,wind¦1ook:take,hake¦1aw:see¦1old:sell¦1ote:rite¦1ole:teal¦1unk:tink¦1am:wim¦1ay:lie¦1ood:tand¦1eld:hold¦2d:he,ge,re,le,leed,ne,reed,be,ye,lee,pe,we¦2ed:dd,oy,or,ey,gg,rr,us,ew,to¦2ame:ecome,rcome¦2ped:ap¦2ged:ag,og,ug,eg¦2bed:ub,ab,ib,ob¦2lt:neel¦2id:pay¦2ang:pring¦2ove:trive¦2med:um¦2ode:rride¦2at:ysit¦3ted:mit,hat,mat,lat,pot,rot,bat¦3ed:low,end,tow,und,ond,eem,lay,cho,dow,xit,eld,ald,uld,law,lel,eat,oll,ray,ank,fin,oam,out,how,iek,tay,haw,ait,vet,say,cay,bow¦3d:ste,ede,ode,ete,ree,ude,ame,oke,ote,ime,ute,ade¦3red:lur,cur,pur,car¦3ped:hop,rop,uip,rip,lip,tep,top¦3ded:bed,rod,kid¦3ade:orbid¦3led:uel¦3ned:lan,can,kin,pan,tun¦3med:rim,lim¦4ted:quit,llot¦4ed:pear,rrow,rand,lean,mand,anel,pand,reet,link,abel,evel,imit,ceed,ruit,mind,peal,veal,hool,head,pell,well,mell,uell,band,hear,weak¦4led:nnel,qual,ebel,ivel¦4red:nfer,efer,sfer¦4n:sake,trew¦4d:ntee¦4ded:hred¦4ned:rpin¦5ed:light,nceal,right,ndear,arget,hread,eight,rtial,eboot¦5d:edite,nvite¦5ted:egret¦5led:ravel",
    "ex": "2:been,upped¦3:added,aged,aided,aimed,aired,bid,died,dyed,egged,erred,eyed,fit,gassed,hit,lied,owed,pent,pied,tied,used,vied,oiled,outed,banned,barred,bet,canned,cut,dipped,donned,ended,feed,inked,jarred,let,manned,mowed,netted,padded,panned,pitted,popped,potted,put,set,sewn,sowed,tanned,tipped,topped,vowed,weed,bowed,jammed,binned,dimmed,hopped,mopped,nodded,pinned,rigged,sinned,towed,vetted¦4:ached,baked,baled,boned,bored,called,caned,cared,ceded,cited,coded,cored,cubed,cured,dared,dined,edited,exited,faked,fared,filed,fined,fired,fuelled,gamed,gelled,hired,hoped,joked,lined,mined,named,noted,piled,poked,polled,pored,pulled,reaped,roamed,rolled,ruled,seated,shed,sided,timed,tolled,toned,voted,waited,walled,waned,winged,wiped,wired,zoned,yelled,tamed,lubed,roped,faded,mired,caked,honed,banged,culled,heated,raked,welled,banded,beat,cast,cooled,cost,dealt,feared,folded,footed,handed,headed,heard,hurt,knitted,landed,leaked,leapt,linked,meant,minded,molded,neared,needed,peaked,plodded,plotted,pooled,quit,read,rooted,sealed,seeded,seeped,shipped,shunned,skimmed,slammed,sparred,stemmed,stirred,suited,thinned,twinned,swayed,winked,dialed,abutted,blotted,fretted,healed,heeded,peeled,reeled¦5:basted,cheated,equalled,eroded,exiled,focused,opined,pleated,primed,quoted,scouted,shored,sloped,smoked,sniped,spelled,spouted,routed,staked,stored,swelled,tasted,treated,wasted,smelled,dwelled,honored,prided,quelled,eloped,scared,coveted,sweated,breaded,cleared,debuted,deterred,freaked,modeled,pleaded,rebutted,speeded¦6:anchored,defined,endured,impaled,invited,refined,revered,strolled,cringed,recast,thrust,unfolded¦7:authored,combined,competed,conceded,convened,excreted,extruded,redefined,restored,secreted,rescinded,welcomed¦8:expedited,infringed¦9:interfered,intervened,persevered¦10:contravened¦eat:ate¦is:was¦go:went¦are:were¦3d:bent,lent,rent,sent¦3e:bit,fled,hid,lost¦3ed:bled,bred¦2ow:blew,grew¦1uy:bought¦2tch:caught¦1o:did¦1ive:dove,gave¦2aw:drew¦2ed:fed¦2y:flew,laid,paid,said¦1ight:fought¦1et:got¦2ve:had¦1ang:hung¦2ad:led¦2ght:lit¦2ke:made¦2et:met¦1un:ran¦1ise:rose¦1it:sat¦1eek:sought¦1each:taught¦1ake:woke,took¦1eave:wove¦2ise:arose¦1ear:bore,tore,wore¦1ind:bound,found,wound¦2eak:broke¦2ing:brought,wrung¦1ome:came¦2ive:drove¦1ig:dug¦1all:fell¦2el:felt¦4et:forgot¦1old:held¦2ave:left¦1ing:rang,sang¦1ide:rode¦1ink:sank¦1ee:saw¦2ine:shone¦4e:slid¦1ell:sold,told¦4d:spent¦2in:spun¦1in:won"
  },
  "PresentTense": {
    "fwd": "1:oes¦1ve:as",
    "both": "1:xes¦2:zzes,ches,shes,sses¦3:iases¦2y:llies,plies¦1y:cies,bies,ties,vies,nies,pies,dies,ries,fies¦:s",
    "rev": "1ies:ly¦2es:us,go,do¦3es:cho,eto",
    "ex": "2:does,goes¦3:gasses¦5:focuses¦is:are¦3y:relies¦2y:flies¦2ve:has"
  },
  "Superlative": {
    "fwd": "1st:e¦1est:l,m,f,s¦1iest:cey¦2est:or,ir¦3est:ver",
    "both": "4:east¦5:hwest¦5lest:erful¦4est:weet,lgar,tter,oung¦4most:uter¦3est:ger,der,rey,iet,ong,ear¦3test:lat¦3most:ner¦2est:pt,ft,nt,ct,rt,ht¦2test:it¦2gest:ig¦1est:b,k,n,p,h,d,w¦iest:y",
    "rev": "1:ttest,nnest,yest¦2:sest,stest,rmest,cest,vest,lmest,olest,ilest,ulest,ssest,imest,uest¦3:rgest,eatest,oorest,plest,allest,urest,iefest,uelest,blest,ugest,amest,yalest,ealest,illest,tlest,itest¦4:cerest,eriest,somest,rmalest,ndomest,motest,uarest,tiffest¦5:leverest,rangest¦ar:urthest¦3ey:riciest",
    "ex": "best:good¦worst:bad¦5est:great¦4est:fast,full,fair,dull¦3test:hot,wet,fat¦4nest:thin¦1urthest:far¦3est:gay,shy,ill¦4test:neat¦4st:late,wide,fine,safe,cute,fake,pale,rare,rude,sore,ripe,dire¦6st:severe"
  },
  "AdjToNoun": {
    "fwd": "1:tistic,eable,lful,sful,ting,tty¦2:onate,rtable,geous,ced,seful,ctful¦3:ortive,ented¦arity:ear¦y:etic¦fulness:begone¦1ity:re¦1y:tiful,gic¦2ity:ile,imous,ilous,ime¦2ion:ated¦2eness:iving¦2y:trious¦2ation:iring¦2tion:vant¦3ion:ect¦3ce:mant,mantic¦3tion:irable¦3y:est,estic¦3m:mistic,listic¦3ess:ning¦4n:utious¦4on:rative,native,vative,ective¦4ce:erant",
    "both": "1:king,wing¦2:alous,ltuous,oyful,rdous¦3:gorous,ectable,werful,amatic¦4:oised,usical,agical,raceful,ocused,lined,ightful¦5ness:stful,lding,itous,nuous,ulous,otous,nable,gious,ayful,rvous,ntous,lsive,peful,entle,ciful,osive,leful,isive,ncise,reful,mious¦5ty:ivacious¦5ties:ubtle¦5ce:ilient,adiant,atient¦5cy:icient¦5sm:gmatic¦5on:sessive,dictive¦5ity:pular,sonal,eative,entic¦5sity:uminous¦5ism:conic¦5nce:mperate¦5ility:mitable¦5ment:xcited¦5n:bitious¦4cy:brant,etent,curate¦4ility:erable,acable,icable,ptable¦4ty:nacious,aive,oyal,dacious¦4n:icious¦4ce:vient,erent,stent,ndent,dient,quent,ident¦4ness:adic,ound,hing,pant,sant,oing,oist,tute¦4icity:imple¦4ment:fined,mused¦4ism:otic¦4ry:dantic¦4ity:tund,eral¦4edness:hand¦4on:uitive¦4lity:pitable¦4sm:eroic,namic¦4sity:nerous¦3th:arm¦3ility:pable,bable,dable,iable¦3cy:hant,nant,icate¦3ness:red,hin,nse,ict,iet,ite,oud,ind,ied,rce¦3ion:lute¦3ity:ual,gal,volous,ial¦3ce:sent,fensive,lant,gant,gent,lent,dant¦3on:asive¦3m:fist,sistic,iastic¦3y:terious,xurious,ronic,tastic¦3ur:amorous¦3e:tunate¦3ation:mined¦3sy:rteous¦3ty:ain¦3ry:ave¦3ment:azed¦2ness:de,on,ue,rn,ur,ft,rp,pe,om,ge,rd,od,ay,ss,er,ll,oy,ap,ht,ld,ad,rt¦2inousness:umous¦2ity:neous,ene,id,ane¦2cy:bate,late¦2ation:ized¦2ility:oble,ible¦2y:odic¦2e:oving,aring¦2s:ost¦2itude:pt¦2dom:ee¦2ance:uring¦2tion:reet¦2ion:oted¦2sion:ending¦2liness:an¦2or:rdent¦1th:ung¦1e:uable¦1ness:w,h,k,f¦1ility:mble¦1or:vent¦1ement:ging¦1tiquity:ncient¦1ment:hed¦verty:or¦ength:ong¦eat:ot¦pth:ep¦iness:y",
    "rev": "",
    "ex": "5:forceful,humorous¦8:charismatic¦13:understanding¦5ity:active¦11ness:adventurous,inquisitive,resourceful¦8on:aggressive,automatic,perceptive¦7ness:amorous,fatuous,furtive,ominous,serious¦5ness:ample,sweet¦12ness:apprehensive,cantankerous,contemptuous,ostentatious¦13ness:argumentative,conscientious¦9ness:assertive,facetious,imperious,inventive,oblivious,rapacious,receptive,seditious,whimsical¦10ness:attractive,expressive,impressive,loquacious,salubrious,thoughtful¦3edom:boring¦4ness:calm,fast,keen,tame¦8ness:cheerful,gracious,specious,spurious,timorous,unctuous¦5sity:curious¦9ion:deliberate¦8ion:desperate¦6e:expensive¦7ce:fragrant¦3y:furious¦9ility:ineluctable¦6ism:mystical¦8ity:physical,proactive,sensitive,vertical¦5cy:pliant¦7ity:positive¦9ity:practical¦12ism:professional¦6ce:prudent¦3ness:red¦6cy:vagrant¦3dom:wise"
  }
};

// 01- full-word exceptions
const checkEx = function (str, ex = {}) {
  if (ex.hasOwnProperty(str)) {
    return ex[str]
  }
  return null
};

// 02- suffixes that pass our word through
const checkSame = function (str, same = []) {
  for (let i = 0; i < same.length; i += 1) {
    if (str.endsWith(same[i])) {
      return str
    }
  }
  return null
};

// 03- check rules - longest first
const checkRules = function (str, fwd, both = {}) {
  fwd = fwd || {};
  let max = str.length - 1;
  // look for a matching suffix
  for (let i = max; i >= 1; i -= 1) {
    let size = str.length - i;
    let suff = str.substring(size, str.length);
    // check fwd rules, first
    if (fwd.hasOwnProperty(suff) === true) {
      return str.slice(0, size) + fwd[suff]
    }
    // check shared rules
    if (both.hasOwnProperty(suff) === true) {
      return str.slice(0, size) + both[suff]
    }
  }
  // try a fallback transform
  if (fwd.hasOwnProperty('')) {
    return str += fwd['']
  }
  if (both.hasOwnProperty('')) {
    return str += both['']
  }
  return null
};

//sweep-through all suffixes
const convert = function (str = '', model = {}) {
  // 01- check exceptions
  let out = checkEx(str, model.ex);
  // 02 - check same
  out = out || checkSame(str, model.same);
  // check forward and both rules
  out = out || checkRules(str, model.fwd, model.both);
  //return unchanged
  out = out || str;
  return out
};

const flipObj = function (obj) {
  return Object.entries(obj).reduce((h, a) => {
    h[a[1]] = a[0];
    return h
  }, {})
};

const reverse = function (model = {}) {
  return {
    reversed: true,
    // keep these two
    both: flipObj(model.both),
    ex: flipObj(model.ex),
    // swap this one in
    fwd: model.rev || {}
  }
};

const prefix$2 = /^([0-9]+)/;

const toObject = function (txt) {
  let obj = {};
  txt.split('¦').forEach(str => {
    let [key, vals] = str.split(':');
    vals = (vals || '').split(',');
    vals.forEach(val => {
      obj[val] = key;
    });
  });
  return obj
};

const growObject = function (key = '', val = '') {
  val = String(val);
  let m = val.match(prefix$2);
  if (m === null) {
    return val
  }
  let num = Number(m[1]) || 0;
  let pre = key.substring(0, num);
  let full = pre + val.replace(prefix$2, '');
  return full
};

const unpackOne = function (str) {
  let obj = toObject(str);
  return Object.keys(obj).reduce((h, k) => {
    h[k] = growObject(k, obj[k]);
    return h
  }, {})
};

const uncompress = function (model = {}) {
  if (typeof model === 'string') {
    model = JSON.parse(model);
  }
  model.fwd = unpackOne(model.fwd || '');
  model.both = unpackOne(model.both || '');
  model.rev = unpackOne(model.rev || '');
  model.ex = unpackOne(model.ex || '');
  return model
};

// import { reverse, uncompress } from '/Users/spencer/mountain/suffix-thumb'
// const uncompress = function () { }
// const reverse = function () { }
const fromPast = uncompress(data.PastTense);
const fromPresent = uncompress(data.PresentTense);
const fromGerund = uncompress(data.Gerund);
const fromParticiple = uncompress(data.Participle);

const toPast$3 = reverse(fromPast);
const toPresent$2 = reverse(fromPresent);
const toGerund$2 = reverse(fromGerund);
const toParticiple = reverse(fromParticiple);

const toComparative$1 = uncompress(data.Comparative);
const toSuperlative$1 = uncompress(data.Superlative);
const fromComparative$1 = reverse(toComparative$1);
const fromSuperlative$1 = reverse(toSuperlative$1);

const adjToNoun = uncompress(data.AdjToNoun);

var models = {
  fromPast,
  fromPresent,
  fromGerund,
  fromParticiple,
  toPast: toPast$3,
  toPresent: toPresent$2,
  toGerund: toGerund$2,
  toParticiple,
  // adjectives
  toComparative: toComparative$1,
  toSuperlative: toSuperlative$1,
  fromComparative: fromComparative$1,
  fromSuperlative: fromSuperlative$1,
  adjToNoun
};
// console.log(convert('collide', toPast))

var regexNormal = [
  //web tags
  [/^[\w.]+@[\w.]+\.[a-z]{2,3}$/, 'Email'],
  [/^(https?:\/\/|www\.)+\w+\.[a-z]{2,3}/, 'Url', 'http..'],
  [/^[a-z0-9./].+\.(com|net|gov|org|ly|edu|info|biz|dev|ru|jp|de|in|uk|br|io|ai)/, 'Url', '.com'],

  // timezones
  [/^[PMCE]ST$/, 'Timezone', 'EST'],

  //names
  [/^ma?c'[a-z]{3}/, 'LastName', "mc'neil"],
  [/^o'[a-z]{3}/, 'LastName', "o'connor"],
  [/^ma?cd[aeiou][a-z]{3}/, 'LastName', 'mcdonald'],

  //slang things
  [/^(lol)+[sz]$/, 'Expression', 'lol'],
  [/^wo{2,}a*h?$/, 'Expression', 'wooah'],
  [/^(hee?){2,}h?$/, 'Expression', 'hehe'],
  [/^(un|de|re)\\-[a-z\u00C0-\u00FF]{2}/, 'Verb', 'un-vite'],

  // m/h
  [/^(m|k|cm|km)\/(s|h|hr)$/, 'Unit', '5 k/m'],
  // μg/g
  [/^(ug|ng|mg)\/(l|m3|ft3)$/, 'Unit', 'ug/L'],

  // love/hate
  [/[^:/]\/\p{Letter}/u, 'SlashedTerm', 'love/hate'],
];

var regexText = [
  // #coolguy
  [/^#[\p{Number}_]*\p{Letter}/u, 'HashTag'], // can't be all numbers

  // @spencermountain
  [/^@\w{2,}$/, 'AtMention'],

  // period-ones acronyms - f.b.i.
  [/^([A-Z]\.){2}[A-Z]?/i, ['Acronym', 'Noun'], 'F.B.I'], //ascii-only

  // ending-apostrophes
  [/.{3}[lkmnp]in['‘’‛‵′`´]$/, 'Gerund', "chillin'"],
  [/.{4}s['‘’‛‵′`´]$/, 'Possessive', "flanders'"],

  //from https://www.regextester.com/106421
  // [/^([\u00a9\u00ae\u2319-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/, 'Emoji', 'emoji-range']
  // unicode character range
  [/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u, 'Emoji', 'emoji-class'],
];

var regexNumbers = [
  [/^@1?[0-9](am|pm)$/i, 'Time', '3pm'],
  [/^@1?[0-9]:[0-9]{2}(am|pm)?$/i, 'Time', '3:30pm'],
  [/^'[0-9]{2}$/, 'Year'],
  // times
  [/^[012]?[0-9](:[0-5][0-9])(:[0-5][0-9])$/, 'Time', '3:12:31'],
  [/^[012]?[0-9](:[0-5][0-9])?(:[0-5][0-9])? ?(am|pm)$/i, 'Time', '1:12pm'],
  [/^[012]?[0-9](:[0-5][0-9])(:[0-5][0-9])? ?(am|pm)?$/i, 'Time', '1:12:31pm'], //can remove?

  // iso-dates
  [/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/i, 'Date', 'iso-date'],
  [/^[0-9]{1,4}-[0-9]{1,2}-[0-9]{1,4}$/, 'Date', 'iso-dash'],
  [/^[0-9]{1,4}\/[0-9]{1,2}\/([0-9]{4}|[0-9]{2})$/, 'Date', 'iso-slash'],
  [/^[0-9]{1,4}\.[0-9]{1,2}\.[0-9]{1,4}$/, 'Date', 'iso-dot'],
  [/^[0-9]{1,4}-[a-z]{2,9}-[0-9]{1,4}$/i, 'Date', '12-dec-2019'],

  // timezones
  [/^utc ?[+-]?[0-9]+$/, 'Timezone', 'utc-9'],
  [/^(gmt|utc)[+-][0-9]{1,2}$/i, 'Timezone', 'gmt-3'],

  //phone numbers
  [/^[0-9]{3}-[0-9]{4}$/, 'PhoneNumber', '421-0029'],
  [/^(\+?[0-9][ -])?[0-9]{3}[ -]?[0-9]{3}-[0-9]{4}$/, 'PhoneNumber', '1-800-'],

  //money
  //like $5.30
  [/^[-+]?\p{Currency_Symbol}[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?([kmb]|bn)?\+?$/u, ['Money', 'Value'], '$5.30'],
  //like 5.30$
  [/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?\p{Currency_Symbol}\+?$/u, ['Money', 'Value'], '5.30£'],
  //like
  [/^[-+]?[$£]?[0-9]([0-9,.])+(usd|eur|jpy|gbp|cad|aud|chf|cny|hkd|nzd|kr|rub)$/i, ['Money', 'Value'], '$400usd'],

  //numbers
  // 50 | -50 | 3.23  | 5,999.0  | 10+
  [/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?\+?$/, ['Cardinal', 'NumericValue'], '5,999'],
  [/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?(st|nd|rd|r?th)$/, ['Ordinal', 'NumericValue'], '53rd'],
  // .73th
  [/^\.[0-9]+\+?$/, ['Cardinal', 'NumericValue'], '.73th'],
  //percent
  [/^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?%\+?$/, ['Percent', 'Cardinal', 'NumericValue'], '-4%'],
  [/^\.[0-9]+%$/, ['Percent', 'Cardinal', 'NumericValue'], '.3%'],
  //fraction
  [/^[0-9]{1,4}\/[0-9]{1,4}(st|nd|rd|th)?s?$/, ['Fraction', 'NumericValue'], '2/3rds'],
  //range
  [/^[0-9.]{1,3}[a-z]{0,2}[-–—][0-9]{1,3}[a-z]{0,2}$/, ['Value', 'NumberRange'], '3-4'],
  //time-range
  [/^[0-9]{1,2}(:[0-9][0-9])?(am|pm)? ?[-–—] ?[0-9]{1,2}(:[0-9][0-9])?(am|pm)$/, ['Time', 'NumberRange'], '3-4pm'],
  //number with unit
  [/^[0-9.]+([a-z°]{1,4})$/, 'NumericValue', '9km'],
];

//nouns that also signal the title of an unknown organization
//todo remove/normalize plural forms
var orgWords = [
  'academy',
  'administration',
  'agence',
  'agences',
  'agencies',
  'agency',
  'airlines',
  'airways',
  'army',
  'assoc',
  'associates',
  'association',
  'assurance',
  'authority',
  'autorite',
  'aviation',
  'bank',
  'banque',
  'board',
  'boys',
  'brands',
  'brewery',
  'brotherhood',
  'brothers',
  'bureau',
  'cafe',
  'co',
  'caisse',
  'capital',
  'care',
  'cathedral',
  'center',
  'centre',
  'chemicals',
  'choir',
  'chronicle',
  'church',
  'circus',
  'clinic',
  'clinique',
  'club',
  'co',
  'coalition',
  'coffee',
  'collective',
  'college',
  'commission',
  'committee',
  'communications',
  'community',
  'company',
  'comprehensive',
  'computers',
  'confederation',
  'conference',
  'conseil',
  'consulting',
  'containers',
  'corporation',
  'corps',
  'corp',
  'council',
  'crew',
  'data',
  'departement',
  'department',
  'departments',
  'design',
  'development',
  'directorate',
  'division',
  'drilling',
  'education',
  'eglise',
  'electric',
  'electricity',
  'energy',
  'ensemble',
  'enterprise',
  'enterprises',
  'entertainment',
  'estate',
  'etat',
  'faculty',
  'faction',
  'federation',
  'financial',
  'fm',
  'foundation',
  'fund',
  'gas',
  'gazette',
  'girls',
  'government',
  'group',
  'guild',
  'herald',
  'holdings',
  'hospital',
  'hotel',
  'hotels',
  'inc',
  'industries',
  'institut',
  'institute',
  'institutes',
  'insurance',
  'international',
  'interstate',
  'investment',
  'investments',
  'investors',
  'journal',
  'laboratory',
  'labs',
  'llc',
  'ltd',
  'limited',
  'machines',
  'magazine',
  'management',
  'marine',
  'marketing',
  'markets',
  'media',
  'memorial',
  'ministere',
  'ministry',
  'military',
  'mobile',
  'motor',
  'motors',
  'musee',
  'museum',
  'news',
  'observatory',
  'office',
  'oil',
  'optical',
  'orchestra',
  'organization',
  'partners',
  'partnership',
  'petrol',
  'petroleum',
  'pharmacare',
  'pharmaceutical',
  'pharmaceuticals',
  'pizza',
  'plc',
  'police',
  'politburo',
  'polytechnic',
  'post',
  'power',
  'press',
  'productions',
  'quartet',
  'radio',
  'reserve',
  'resources',
  'restaurant',
  'restaurants',
  'savings',
  'school',
  'securities',
  'service',
  'services',
  'societe',
  'subsidiary',
  'society',
  'sons',
  // 'standard',
  'subcommittee',
  'syndicat',
  'systems',
  'telecommunications',
  'telegraph',
  'television',
  'times',
  'tribunal',
  'tv',
  'union',
  'university',
  'utilities',
  'workers',
].reduce((h, str) => {
  h[str] = true;
  return h
}, {});

var placeWords = [
  // geology
  'atoll',
  'basin',
  'bay',
  'beach',
  'bluff',
  'bog',
  'camp',
  'canyon',
  'canyons',
  'cape',
  'cave',
  'caves',
  // 'cliff',
  'cliffs',
  'coast',
  'cove',
  'coves',
  'crater',
  'crossing',
  'creek',
  'desert',
  'dune',
  'dunes',
  'downs',
  'estates',
  'escarpment',
  'estuary',
  'falls',
  'fjord',
  'fjords',
  'forest',
  'forests',
  'glacier',
  'gorge',
  'gorges',
  'grove',
  'gulf',
  'gully',
  'highland',
  'heights',
  'hollow',
  'hill',
  'hills',
  'inlet',
  'island',
  'islands',
  'isthmus',
  'junction',
  'knoll',
  'lagoon',
  'lake',
  'lakeshore',
  'marsh',
  'marshes',
  'mount',
  'mountain',
  'mountains',
  'narrows',
  'peninsula',
  'plains',
  'plateau',
  'pond',
  'rapids',
  'ravine',
  'reef',
  'reefs',
  'ridge',
  // 'river delta',
  'river',
  'rivers',
  'sandhill',
  'shoal',
  'shore',
  'shoreline',
  'shores',
  'strait',
  'straits',
  'springs',
  'stream',
  'swamp',
  'tombolo',
  'trail',
  'trails',
  'trench',
  'valley',
  'vallies',
  'village',
  'volcano',
  'waterfall',
  'watershed',
  'wetland',
  'woods',
  'acres',

  // districts
  'burough',
  'county',
  'district',
  'municipality',
  'prefecture',
  'province',
  'region',
  'reservation',
  'state',
  'territory',
  'borough',
  'metropolis',
  'downtown',
  'uptown',
  'midtown',
  'city',
  'town',
  'township',
  'hamlet',
  'country',
  'kingdom',
  'enclave',
  'neighbourhood',
  'neighborhood',
  'kingdom',
  'ward',
  'zone',
  // 'range',

  //building/ complex
  'airport',
  'amphitheater',
  'arch',
  'arena',
  'auditorium',
  'bar',
  'barn',
  'basilica',
  'battlefield',
  'bridge',
  'building',
  'castle',
  'centre',
  'coliseum',
  'cineplex',
  'complex',
  'dam',
  'farm',
  'field',
  'fort',
  'garden',
  'gardens',
  // 'grounds',
  'gymnasium',
  'hall',
  'house',
  'levee',
  'library',
  'manor',
  'memorial',
  'monument',
  'museum',
  'gallery',
  'palace',
  'pillar',
  'pits',
  // 'pit',
  // 'place',
  // 'point',
  // 'room',
  'plantation',
  'playhouse',
  'quarry',
  // 'ruins',
  'sportsfield',
  'sportsplex',
  'stadium',
  // 'statue',
  'terrace',
  'terraces',
  'theater',
  'tower',
  'park',
  'parks',
  'site',
  'ranch',
  'raceway',
  'sportsplex',

  // 'sports centre',
  // 'sports field',
  // 'soccer complex',
  // 'soccer centre',
  // 'sports complex',
  // 'civic centre',

  // roads
  'ave',
  'st',
  'street',
  'rd',
  'road',
  'lane',
  'landing',
  'crescent',
  'cr',
  'way',
  'tr',
  'terrace',
  'avenue',
].reduce((h, str) => {
  h[str] = true;
  return h
}, {});

var rules$1 = [
  [/([^v])ies$/i, '$1y'],
  [/(ise)s$/i, '$1'],//promises
  [/(kn|[^o]l|w)ives$/i, '$1ife'],
  [/^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)ves$/i, '$1f'],
  [/^(dwar|handkerchie|hoo|scar|whar)ves$/i, '$1f'],
  [/(antenn|formul|nebul|vertebr|vit)ae$/i, '$1a'],
  [/(octop|vir|radi|nucle|fung|cact|stimul)(i)$/i, '$1us'],
  [/(buffal|tomat|tornad)(oes)$/i, '$1o'],

  [/(ause)s$/i, '$1'],//causes
  [/(ease)s$/i, '$1'],//diseases
  [/(ious)es$/i, '$1'],//geniouses
  [/(ouse)s$/i, '$1'],//houses
  [/(ose)s$/i, '$1'],//roses

  [/(..ase)s$/i, '$1'],
  [/(..[aeiu]s)es$/i, '$1'],
  [/(vert|ind|cort)(ices)$/i, '$1ex'],
  [/(matr|append)(ices)$/i, '$1ix'],
  [/([xo]|ch|ss|sh)es$/i, '$1'],
  [/men$/i, 'man'],
  [/(n)ews$/i, '$1ews'],
  [/([ti])a$/i, '$1um'],
  [/([^aeiouy]|qu)ies$/i, '$1y'],
  [/(s)eries$/i, '$1eries'],
  [/(m)ovies$/i, '$1ovie'],
  [/(cris|ax|test)es$/i, '$1is'],
  [/(alias|status)es$/i, '$1'],
  [/(ss)$/i, '$1'],
  [/(ic)s$/i, '$1'],
  [/s$/i, ''],
];

const invertObj = function (obj) {
  return Object.keys(obj).reduce((h, k) => {
    h[obj[k]] = k;
    return h
  }, {})
};

const toSingular = function (str, model) {
  const { irregularPlurals } = model.two;
  const invert = invertObj(irregularPlurals); //(not very efficient)
  // check irregulars list
  if (invert.hasOwnProperty(str)) {
    return invert[str]
  }
  // go through our regexes
  for (let i = 0; i < rules$1.length; i++) {
    if (rules$1[i][0].test(str) === true) {
      // console.log(rules[i])
      str = str.replace(rules$1[i][0], rules$1[i][1]);
      return str
    }
  }
  return str
};

const all$2 = function (str, model) {
  const arr = [str];
  const p = pluralize(str, model);
  if (p !== str) {
    arr.push(p);
  }
  const s = toSingular(str, model);
  if (s !== str) {
    arr.push(s);
  }
  return arr
};

var nouns$2 = { toPlural: pluralize, toSingular, all: all$2 };

let guessVerb = {
  Gerund: ['ing'],
  Actor: ['erer'],
  Infinitive: [
    'ate',
    'ize',
    'tion',
    'rify',
    'then',
    'ress',
    'ify',
    'age',
    'nce',
    'ect',
    'ise',
    'ine',
    'ish',
    'ace',
    'ash',
    'ure',
    'tch',
    'end',
    'ack',
    'and',
    'ute',
    'ade',
    'ock',
    'ite',
    'ase',
    'ose',
    'use',
    'ive',
    'int',
    'nge',
    'lay',
    'est',
    'ain',
    'ant',
    'ent',
    'eed',
    'er',
    'le',
    'unk',
    'ung',
    'upt',
    'en',
  ],
  PastTense: ['ept', 'ed', 'lt', 'nt', 'ew', 'ld'],
  PresentTense: [
    'rks',
    'cks',
    'nks',
    'ngs',
    'mps',
    'tes',
    'zes',
    'ers',
    'les',
    'acks',
    'ends',
    'ands',
    'ocks',
    'lays',
    'eads',
    'lls',
    'els',
    'ils',
    'ows',
    'nds',
    'ays',
    'ams',
    'ars',
    'ops',
    'ffs',
    'als',
    'urs',
    'lds',
    'ews',
    'ips',
    'es',
    'ts',
    'ns',
  ],
  Participle: ['ken', 'wn']
};
//flip it into a lookup object
guessVerb = Object.keys(guessVerb).reduce((h, k) => {
  guessVerb[k].forEach(a => (h[a] = k));
  return h
}, {});

/** it helps to know what we're conjugating from */
const getTense$1 = function (str) {
  const three = str.substring(str.length - 3);
  if (guessVerb.hasOwnProperty(three) === true) {
    return guessVerb[three]
  }
  const two = str.substring(str.length - 2);
  if (guessVerb.hasOwnProperty(two) === true) {
    return guessVerb[two]
  }
  const one = str.substring(str.length - 1);
  if (one === 's') {
    return 'PresentTense'
  }
  return null
};

const toParts = function (str, model) {
  let prefix = '';
  let prefixes = {};
  if (model.one && model.one.prefixes) {
    prefixes = model.one.prefixes;
  }
  // pull-apart phrasal verb 'fall over'
  let [verb, particle] = str.split(/ /);
  // support 'over cleaned'
  if (particle && prefixes[verb] === true) {
    prefix = verb;
    verb = particle;
    particle = '';
  }
  return {
    prefix, verb, particle
  }
};


// dunno about these..
const copulaMap = {
  are: 'be',
  were: 'be',
  been: 'be',
  is: 'be',
  am: 'be',
  was: 'be',
  be: 'be',
  being: 'be',
};

const toInfinitive$1 = function (str, model, tense) {
  const { fromPast, fromPresent, fromGerund, fromParticiple } = model.two.models;
  const { prefix, verb, particle } = toParts(str, model);
  let inf = '';
  if (!tense) {
    tense = getTense$1(str);
  }
  if (copulaMap.hasOwnProperty(str)) {
    inf = copulaMap[str];
  } else if (tense === 'Participle') {
    inf = convert(verb, fromParticiple);
  } else if (tense === 'PastTense') {
    inf = convert(verb, fromPast);
  } else if (tense === 'PresentTense') {
    inf = convert(verb, fromPresent);
  } else if (tense === 'Gerund') {
    inf = convert(verb, fromGerund);
  } else {
    return str
  }

  // stitch phrasal back on
  if (particle) {
    inf += ' ' + particle;
  }
  // stitch prefix back on
  if (prefix) {
    inf = prefix + ' ' + inf;
  }
  return inf
};

// console.log(toInfinitive('snarled', { one: {} }))
// console.log(convert('snarled', fromPast))

// import { toPast, toPresent, toGerund, toParticiple } from '../../../../model/models/index.js'

// pull-apart phrasal verb 'fall over'
const parse$3 = (inf) => {
  if (/ /.test(inf)) {
    return inf.split(/ /)
  }
  return [inf, '']
};

//we run this on every verb in the lexicon, so please keep it fast
//we assume the input word is a proper infinitive
const conjugate = function (inf, model) {
  const { toPast, toPresent, toGerund, toParticiple } = model.two.models;
  // ad-hoc Copula response
  if (inf === 'be') {
    return {
      Infinitive: inf,
      Gerund: 'being',
      PastTense: 'was',
      PresentTense: 'is',
    }
  }
  const [str, particle] = parse$3(inf);
  const found = {
    Infinitive: str,
    PastTense: convert(str, toPast),
    PresentTense: convert(str, toPresent),
    Gerund: convert(str, toGerund),
    FutureTense: 'will ' + str
  };
  // add past-participle if it's interesting
  // drive -> driven (not drove)
  let pastPrt = convert(str, toParticiple);
  if (pastPrt !== inf && pastPrt !== found.PastTense) {
    // ensure it's a known participle
    const lex = model.one.lexicon || {};
    if (lex[pastPrt] === 'Participle' || lex[pastPrt] === 'Adjective') {
      // one exception
      if (inf === 'play') {
        pastPrt = 'played';
      }
      found.Participle = pastPrt;
    }
  }
  // put phrasal-verbs back together again
  if (particle) {
    Object.keys(found).forEach(k => {
      found[k] += ' ' + particle;
    });
  }
  return found
};

// console.log(toPresent.rules.y)
// console.log(convert('buy', toPresent))

const all$1 = function (str, model) {
  const res = conjugate(str, model);
  delete res.FutureTense;
  return Object.values(res).filter(s => s)
};
var verbs$3 = {
  toInfinitive: toInfinitive$1, conjugate, all: all$1
};

// import toAdverb from './adverbs/toAdverb.js'


const toSuperlative = function (adj, model) {
  const mod = model.two.models.toSuperlative;
  return convert(adj, mod)
};
const toComparative = function (adj, model) {
  const mod = model.two.models.toComparative;
  return convert(adj, mod)
};
const fromComparative = function (adj, model) {
  const mod = model.two.models.fromComparative;
  return convert(adj, mod)
};
const fromSuperlative = function (adj, model) {
  const mod = model.two.models.fromSuperlative;
  return convert(adj, mod)
};
const toNoun = function (adj, model) {
  const mod = model.two.models.adjToNoun;
  return convert(adj, mod)
};

//sweep-through all suffixes
const suffixLoop$1 = function (str = '', suffixes = []) {
  const len = str.length;
  const max = len <= 6 ? len - 1 : 6;
  for (let i = max; i >= 1; i -= 1) {
    const suffix = str.substring(len - i, str.length);
    if (suffixes[suffix.length].hasOwnProperty(suffix) === true) {
      const pre = str.slice(0, len - i);
      const post = suffixes[suffix.length][suffix];
      return pre + post
    }
  }
  return null
};

const s = 'ically';
const ical = new Set([
  'analyt' + s, //analytical
  'chem' + s,// chemical
  'class' + s, //classical
  'clin' + s, // clinical
  'crit' + s,// critical
  'ecolog' + s,// ecological
  'electr' + s,// electrical
  'empir' + s, // empirical
  'frant' + s, // frantical
  'grammat' + s,// grammatical
  'ident' + s, // identical
  'ideolog' + s, // ideological
  'log' + s, // logical
  'mag' + s, //magical
  'mathemat' + s,// mathematical
  'mechan' + s,// mechanical
  'med' + s,// medical
  'method' + s, // methodical
  'method' + s,// methodical
  'mus' + s, // musical
  'phys' + s, // physical
  'phys' + s,// physical
  'polit' + s,// political
  'pract' + s,// practical
  'rad' + s, //radical
  'satir' + s, // satirical
  'statist' + s, // statistical
  'techn' + s,// technical
  'technolog' + s, // technological
  'theoret' + s,// theoretical
  'typ' + s,// typical
  'vert' + s,// vertical
  'whims' + s,// whimsical
]);

const suffixes$2 = [
  null,
  {},
  { 'ly': '' },
  {
    'ily': 'y',
    'bly': 'ble',
    'ply': 'ple',
  },
  {
    'ally': 'al',
    'rply': 'rp',
  },
  {
    'ually': 'ual',
    'ially': 'ial',
    'cally': 'cal',
    'eally': 'eal',
    'rally': 'ral',
    'nally': 'nal',
    'mally': 'mal',
    'eeply': 'eep',
    'eaply': 'eap',
  },
  {
    ically: 'ic',
  }
];

const noAdj = new Set([
  'early',
  'only',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'mostly',
  'duly',
  'unduly',
  'especially',
  'undoubtedly',
  'conversely',
  'namely',
  'exceedingly',
  'presumably',
  'accordingly',
  'overly',
  'best',
  'latter',
  'little',
  'long',
  'low'
]);

// exceptions to rules
const exceptions$2 = {
  wholly: 'whole',
  fully: 'full',
  truly: 'true',
  gently: 'gentle',
  singly: 'single',
  customarily: 'customary',
  idly: 'idle',
  publically: 'public',
  quickly: 'quick',
  superbly: 'superb',
  cynically: 'cynical',
  well: 'good',// -?
};


const toAdjective = function (str) {
  if (!str.endsWith('ly')) {
    return null
  }
  // 'electronic' vs 'electronical'
  if (ical.has(str)) {
    return str.replace(/ically/, 'ical')
  }
  if (noAdj.has(str)) {
    return null
  }
  if (exceptions$2.hasOwnProperty(str)) {
    return exceptions$2[str]
  }
  return suffixLoop$1(str, suffixes$2) || str
};

// console.log(toAdjective('emphatically'))
// console.log(toAdjective('usually'))
// console.log(toAdjective('mechanically'))
// console.log(toAdjective('vertically'))

const suffixes$1 = [
  null,
  {
    y: 'ily'
  },
  {
    ly: 'ly',//unchanged
    ic: 'ically'
  },
  {
    ial: 'ially',
    ual: 'ually',
    tle: 'tly',
    ble: 'bly',
    ple: 'ply',
    ary: 'arily',
  },
  {},
  {},
  {},
];

const exceptions$1 = {
  cool: 'cooly',
  whole: 'wholly',
  full: 'fully',
  good: 'well',
  idle: 'idly',
  public: 'publicly',
  single: 'singly',
  special: 'especially',
};

// a lot of adjectives *don't really* have a adverb
// 'roomy' -> 'roomily'
// but here, conjugate what it would be, if it made sense to
const toAdverb = function (str) {
  if (exceptions$1.hasOwnProperty(str)) {
    return exceptions$1[str]
  }
  let adv = suffixLoop$1(str, suffixes$1);
  if (!adv) {
    adv = str + 'ly';
  }
  // only return this if it exists in lexicon?
  // console.log(model.one.lexicon[adv])
  return adv
};
// console.log(toAdverb('unsightly'))

// import toNoun from './conjugate/toNoun.js'

const all = function (str, model) {
  let arr = [str];
  arr.push(toSuperlative(str, model));
  arr.push(toComparative(str, model));
  arr.push(toAdverb(str));
  arr = arr.filter(s => s);
  arr = new Set(arr);
  return Array.from(arr)
};


var adjectives$1 = {
  toSuperlative, toComparative, toAdverb, toNoun,
  fromAdverb: toAdjective, fromSuperlative, fromComparative,
  all,
};

var transform = {
  noun: nouns$2,
  verb: verbs$3,
  adjective: adjectives$1
};

// transformations to make on our lexicon
var byTag = {
  // add plural forms of singular nouns
  Singular: (word, lex, methods, model) => {
    const already = model.one.lexicon;
    const plural = methods.two.transform.noun.toPlural(word, model);
    if (!already[plural]) {
      lex[plural] = lex[plural] || 'Plural';
    }
  },
  // 'lawyer', 'manager' plural forms
  Actor: (word, lex, methods, model) => {
    const already = model.one.lexicon;
    const plural = methods.two.transform.noun.toPlural(word, model);
    if (!already[plural]) {
      lex[plural] = lex[plural] || ['Plural', 'Actor'];
    }
  },

  // superlative/ comparative forms for adjectives
  Comparable: (word, lex, methods, model) => {
    const already = model.one.lexicon;
    const { toSuperlative, toComparative } = methods.two.transform.adjective;
    // fast -> fastest
    const sup = toSuperlative(word, model);
    if (!already[sup]) {
      lex[sup] = lex[sup] || 'Superlative';
    }
    // fast -> faster
    const comp = toComparative(word, model);
    if (!already[comp]) {
      lex[comp] = lex[comp] || 'Comparative';
    }
    // overwrite
    lex[word] = 'Adjective';
  },

  // 'german' -> 'germans'
  Demonym: (word, lex, methods, model) => {
    const plural = methods.two.transform.noun.toPlural(word, model);
    lex[plural] = lex[plural] || ['Demonym', 'Plural'];
  },

  // conjugate all forms of these verbs
  Infinitive: (word, lex, methods, model) => {
    const already = model.one.lexicon;
    const all = methods.two.transform.verb.conjugate(word, model);
    Object.entries(all).forEach(a => {
      if (!already[a[1]] && !lex[a[1]] && a[0] !== 'FutureTense') {
        lex[a[1]] = a[0];
      }
    });
  },

  // 'walk up' should conjugate, too
  PhrasalVerb: (word, lex, methods, model) => {
    const already = model.one.lexicon;
    lex[word] = ['PhrasalVerb', 'Infinitive'];
    const _multi = model.one._multiCache;
    const [inf, rest] = word.split(' ');
    // add root verb
    if (!already[inf]) {
      lex[inf] = lex[inf] || 'Infinitive';
    }
    // conjugate it
    const all = methods.two.transform.verb.conjugate(inf, model);
    delete all.FutureTense;
    Object.entries(all).forEach(a => {
      // not 'walker up', or 'had taken up'
      if (a[0] === 'Actor' || a[1] === '') {
        return
      }
      // add the root verb, alone
      if (!lex[a[1]] && !already[a[1]]) {
        lex[a[1]] = a[0];
      }
      _multi[a[1]] = 2;
      const str = a[1] + ' ' + rest;
      lex[str] = lex[str] || [a[0], 'PhrasalVerb'];
    });
  },

  // expand 'million'
  Multiple: (word, lex) => {
    lex[word] = ['Multiple', 'Cardinal'];
    // 'millionth'
    lex[word + 'th'] = ['Multiple', 'Ordinal'];
    // 'millionths'
    lex[word + 'ths'] = ['Multiple', 'Fraction'];
  },
  // expand number-words
  Cardinal: (word, lex) => {
    lex[word] = ['TextValue', 'Cardinal'];
  },

  // 'millionth'
  Ordinal: (word, lex) => {
    lex[word] = ['TextValue', 'Ordinal'];
    lex[word + 's'] = ['TextValue', 'Fraction'];
  },
  // 'thames'
  Place: (word, lex) => {
    lex[word] = ['Place', 'ProperNoun'];
  },
  // 'ontario'
  Region: (word, lex) => {
    lex[word] = ['Region', 'ProperNoun'];
  },
};

// derive clever things from our lexicon key-value pairs
// this method runs as the pre-tagger plugin gets loaded
const expand$1 = function (words, world) {
  const { methods, model } = world;
  const lex = {};
  // console.log('start:', Object.keys(lex).length)
  const _multi = {};
  // go through each word in this key-value obj:
  Object.keys(words).forEach(word => {
    const tag = words[word];
    // normalize lexicon a little bit
    word = word.toLowerCase().trim();
    word = word.replace(/'s\b/, '');
    // cache multi-word terms
    const split = word.split(/ /);
    if (split.length > 1) {
      // prefer longer ones
      if (_multi[split[0]] === undefined || split.length > _multi[split[0]]) {
        _multi[split[0]] = split.length;
      }
    }
    // do any clever-business, by it's tag
    if (byTag.hasOwnProperty(tag) === true) {
      byTag[tag](word, lex, methods, model);
    }
    lex[word] = lex[word] || tag;
  });
  // cleanup
  delete lex[''];
  delete lex[null];
  delete lex[' '];
  return { lex, _multi }
};

// roughly, split a document by comma or semicolon

const splitOn = function (terms, i) {
  const isNum = /^[0-9]+$/;
  const term = terms[i];
  // early on, these may not be dates yet:
  if (!term) {
    return false
  }
  const maybeDate = new Set(['may', 'april', 'august', 'jan']);
  // veggies, like figs
  if (term.normal === 'like' || maybeDate.has(term.normal)) {
    return false
  }
  // toronto, canada  - tuesday, march
  if (term.tags.has('Place') || term.tags.has('Date')) {
    return false
  }
  if (terms[i - 1]) {
    const lastTerm = terms[i - 1];
    // thursday, june
    if (lastTerm.tags.has('Date') || maybeDate.has(lastTerm.normal)) {
      return false
    }
    // pretty, nice, and fun
    if (lastTerm.tags.has('Adjective') || term.tags.has('Adjective')) {
      return false
    }
  }
  // don't split numbers, yet
  const str = term.normal;
  if (str.length === 1 || str.length === 2 || str.length === 4) {
    if (isNum.test(str)) {
      return false
    }
  }
  return true
};

// kind-of a dirty sentence chunker
const quickSplit = function (document) {
  const splitHere = /[,:;]/;
  const arr = [];
  document.forEach(terms => {
    let start = 0;
    terms.forEach((term, i) => {
      // does it have a comma/semicolon ?
      if (splitHere.test(term.post) && splitOn(terms, i + 1)) {
        arr.push(terms.slice(start, i + 1));
        start = i + 1;
      }
    });
    if (start < terms.length) {
      arr.push(terms.slice(start, terms.length));
    }
  });
  return arr
};

//similar to plural/singularize rules, but not the same
const isPlural$4 = {
  e: ['mice', 'louse', 'antennae', 'formulae', 'nebulae', 'vertebrae', 'vitae'],
  i: ['tia', 'octopi', 'viri', 'radii', 'nuclei', 'fungi', 'cacti', 'stimuli'],
  n: ['men'],
  t: ['feet'],
};
// plural words as exceptions to suffix-rules
const exceptions = new Set([
  // 'formulas',
  // 'umbrellas',
  // 'gorillas',
  // 'koalas',
  'israelis',
  'menus',
  'logos',
]);

const notPlural$1 = [
  'bus',
  'mas', //christmas
  'was',
  // 'las',
  'ias', //alias
  'xas',
  'vas',
  'cis', //probocis
  'lis',
  'nis', //tennis
  'ois',
  'ris',
  'sis', //thesis
  'tis', //mantis, testis
  'xis',
  'aus',
  'cus',
  'eus', //nucleus
  'fus', //doofus
  'gus', //fungus
  'ius', //radius
  'lus', //stimulus
  'nus',
  'das',
  'ous',
  'pus', //octopus
  'rus', //virus
  'sus', //census
  'tus', //status,cactus
  'xus',
  'aos', //chaos
  'igos',
  'ados', //barbados
  'ogos',
  "'s",
  'ss',
];

const looksPlural = function (str) {
  // not long enough to be plural
  if (!str || str.length <= 3) {
    return false
  }
  // 'menus' etc
  if (exceptions.has(str)) {
    return true
  }
  const end = str[str.length - 1];
  // look at 'firemen'
  if (isPlural$4.hasOwnProperty(end)) {
    return isPlural$4[end].find(suff => str.endsWith(suff))
  }
  if (end !== 's') {
    return false
  }
  // look for 'virus'
  if (notPlural$1.find(suff => str.endsWith(suff))) {
    return false
  }
  // ends with an s, seems plural i guess.
  return true
};

var methods$1 = {
  two: {
    quickSplit,
    expandLexicon: expand$1,
    transform,
    looksPlural
  },
};

// import irregularVerbs from './conjugations.js'
// harvest list of irregulars for any juicy word-data
const expandIrregulars = function (model) {
  const { irregularPlurals } = model.two;
  const { lexicon } = model.one;
  Object.entries(irregularPlurals).forEach(a => {
    lexicon[a[0]] = lexicon[a[0]] || 'Singular';
    lexicon[a[1]] = lexicon[a[1]] || 'Plural';
  });
  return model
};

const tmpModel = {
  one: { lexicon: {} },
  two: { models }
};

// defaults for switches
const switchDefaults = {
  // 'pilot'
  'Actor|Verb': 'Actor', //
  // 'amusing'
  'Adj|Gerund': 'Adjective', //+conjugations
  // 'standard'
  'Adj|Noun': 'Adjective',
  // 'boiled'
  'Adj|Past': 'Adjective', //+conjugations
  // 'smooth'
  'Adj|Present': 'Adjective',//+conjugations
  // 'box'
  'Noun|Verb': 'Singular', //+conjugations (no-present)
  //'singing'
  'Noun|Gerund': 'Gerund', //+conjugations
  // 'hope'
  'Person|Noun': 'Noun',
  // 'April'
  'Person|Date': 'Month',
  // 'rob'
  'Person|Verb': 'FirstName',//+conjugations
  // 'victoria'
  'Person|Place': 'Person',
  // 'rusty'
  'Person|Adj': 'Comparative',
  // 'boxes'
  'Plural|Verb': 'Plural', //(these are already derivative)
  // 'miles'
  'Unit|Noun': 'Noun',
};

const expandLexicon = function (words, model) {
  // do clever tricks to grow the words
  const world = { model, methods: methods$1 };
  const { lex, _multi } = methods$1.two.expandLexicon(words, world);
  // store multiple-word terms in a cache
  Object.assign(model.one.lexicon, lex);
  Object.assign(model.one._multiCache, _multi);
  return model
};

// these words have no singular/plural conjugation
const addUncountables = function (words, model) {
  Object.keys(words).forEach(k => {
    if (words[k] === 'Uncountable') {
      model.two.uncountable[k] = true;
      words[k] = 'Uncountable';
    }
  });
  return model
};

const expandVerb = function (str, words, doPresent) {
  const obj = conjugate(str, tmpModel);
  words[obj.PastTense] = words[obj.PastTense] || 'PastTense';
  words[obj.Gerund] = words[obj.Gerund] || 'Gerund';
  if (doPresent === true) {
    // is this plural noun, or present-tense?
    words[obj.PresentTense] = words[obj.PresentTense] || 'PresentTense';
  }
};

const expandAdjective = function (str, words, model) {
  const sup = toSuperlative(str, model);
  words[sup] = words[sup] || 'Superlative';
  const comp = toComparative(str, model);
  words[comp] = words[comp] || 'Comparative';
};

const expandNoun = function (str, words, model) {
  const plur = pluralize(str, model);
  words[plur] = words[plur] || 'Plural';
};

// harvest ambiguous words for any conjugations
const expandVariable = function (switchWords, model) {
  const words = {};
  const lex = model.one.lexicon;
  //add first tag as an assumption for each variable word
  Object.keys(switchWords).forEach(w => {
    const name = switchWords[w];
    words[w] = switchDefaults[name];
    // conjugate some verbs
    if (name === 'Noun|Verb' || name === 'Person|Verb' || name === 'Actor|Verb') {
      expandVerb(w, lex, false);
    }
    if (name === 'Adj|Present') {
      expandVerb(w, lex, true);
      expandAdjective(w, lex, model);
    }
    if (name === 'Person|Adj') {
      expandAdjective(w, lex, model);
    }
    // add infinitives for gerunds
    if (name === 'Adj|Gerund' || name === 'Noun|Gerund') {
      const inf = toInfinitive$1(w, tmpModel, 'Gerund');
      if (!lex[inf]) {
        words[inf] = 'Infinitive'; //expand it later
      }
    }
    // add plurals for nouns
    if (name === 'Noun|Gerund' || name === 'Adj|Noun' || name === 'Person|Noun') {
      expandNoun(w, lex, model);
    }
    if (name === 'Adj|Past') {
      const inf = toInfinitive$1(w, tmpModel, 'PastTense');
      if (!lex[inf]) {
        words[inf] = 'Infinitive'; //expand it later
      }
    }
  });
  // add conjugations
  model = expandLexicon(words, model);
  return model
};

const expand = function (model) {
  model = expandLexicon(model.one.lexicon, model);
  model = addUncountables(model.one.lexicon, model);
  model = expandVariable(model.two.switches, model);
  model = expandIrregulars(model);
  return model
};

let model$1 = {
  one: {
    _multiCache: {},
    lexicon,
    frozenLex,
  },
  two: {
    irregularPlurals,
    models,

    suffixPatterns,
    prefixPatterns,
    endsWith,
    neighbours: neighbours$1,

    regexNormal,
    regexText,
    regexNumbers,

    switches,
    clues,

    uncountable: {},

    orgWords,
    placeWords,
  },
};
model$1 = expand(model$1);

// console.log(model.one.lexicon.see)

const byPunctuation = function (terms, i, model, world) {
  const setTag = world.methods.one.setTag;
  // colon following first word
  // edit: foo
  // breaking: foobar
  if (terms.length >= 3) {
    const hasColon = /:/;
    const post = terms[0].post;
    if (post.match(hasColon)) {
      // phone: 555-2938
      const nextTerm = terms[1];
      if (nextTerm.tags.has('Value') || nextTerm.tags.has('Email') || nextTerm.tags.has('PhoneNumber')) {
        return
      }
      //
      setTag([terms[0]], 'Expression', world, null, `2-punct-colon''`);
    }
  }
};

const byHyphen = function (terms, i, model, world) {
  const setTag = world.methods.one.setTag;
  // two words w/ a dash
  if (terms[i].post === '-' && terms[i + 1]) {
    setTag([terms[i], terms[i + 1]], 'Hyphenated', world, null, `1-punct-hyphen''`);

    // bone-headed, man-made, good-tempered, coursely-ground
    // if (terms[i + 1].tags.has('PastTense')) {
    //   let tags = terms[i].tags
    //   if (tags.has('Noun') || tags.has('Adverb')) {
    //     setTag([terms[i], terms[i + 1]], 'Adjective', world, null, `2-punct-dash''`)
    //   }

    // }
  }
};

const prefix$1 = /^(under|over|mis|re|un|dis|semi)-?/;

const tagSwitch = function (terms, i, model) {
  const switches = model.two.switches;
  const term = terms[i];
  if (switches.hasOwnProperty(term.normal)) {
    term.switch = switches[term.normal];
    return
  }
  // support 'restrike' -> 'strike'
  if (prefix$1.test(term.normal)) {
    const stem = term.normal.replace(prefix$1, '');
    if (stem.length > 3 && switches.hasOwnProperty(stem)) {
      term.switch = switches[stem];
    }
  }
};

// verbose-mode tagger debuging
const log = (term, tag, reason = '') => {
  const yellow = str => '\x1b[33m\x1b[3m' + str + '\x1b[0m';
  const i = str => '\x1b[3m' + str + '\x1b[0m';
  const word = term.text || '[' + term.implicit + ']';
  if (typeof tag !== 'string' && tag.length > 2) {
    tag = tag.slice(0, 2).join(', #') + ' +'; //truncate the list of tags
  }
  tag = typeof tag !== 'string' ? tag.join(', #') : tag;
  console.log(` ${yellow(word).padEnd(24)} \x1b[32m→\x1b[0m #${tag.padEnd(22)}  ${i(reason)}`); // eslint-disable-line
};

// a faster version than the user-facing one in ./methods
const fastTag = function (term, tag, reason) {
  if (!tag || tag.length === 0) {
    return
  }
  if (term.frozen === true) {
    return
  }
  // some logging for debugging
  const env = typeof process === 'undefined' || !process.env ? self.env || {} : process.env;
  if (env && env.DEBUG_TAGS) {
    log(term, tag, reason);
  }
  term.tags = term.tags || new Set();
  if (typeof tag === 'string') {
    term.tags.add(tag);
  } else {
    tag.forEach(tg => term.tags.add(tg));
  }
};

// tags that are neither plural or singular
const uncountable = [
  'Acronym',
  'Abbreviation',
  'ProperNoun',
  'Uncountable',
  'Possessive',
  'Pronoun',
  'Activity',
  'Honorific',
  'Month',
];
// try to guess if each noun is a plural/singular
const setPluralSingular = function (term) {
  if (!term.tags.has('Noun') || term.tags.has('Plural') || term.tags.has('Singular')) {
    return
  }
  if (uncountable.find(tag => term.tags.has(tag))) {
    return
  }
  if (looksPlural(term.normal)) {
    fastTag(term, 'Plural', '3-plural-guess');
  } else {
    fastTag(term, 'Singular', '3-singular-guess');
  }
};

// try to guess the tense of a naked verb
const setTense = function (term) {
  const tags = term.tags;
  if (tags.has('Verb') && tags.size === 1) {
    const guess = getTense$1(term.normal);
    if (guess) {
      fastTag(term, guess, '3-verb-tense-guess');
    }
  }
};

//add deduced parent tags to our terms
const fillTags = function (terms, i, model) {
  const term = terms[i];
  //there is probably just one tag, but we'll allow more
  const tags = Array.from(term.tags);
  for (let k = 0; k < tags.length; k += 1) {
    if (model.one.tagSet[tags[k]]) {
      const toAdd = model.one.tagSet[tags[k]].parents;
      fastTag(term, toAdd, ` -inferred by #${tags[k]}`);
    }
  }
  // turn 'Noun' into Plural/Singular
  setPluralSingular(term);
  // turn 'Verb' into Present/PastTense
  setTense(term);
};

const titleCase$1 = /^\p{Lu}[\p{Ll}'’]/u;
const hasNumber = /[0-9]/;
const notProper = ['Date', 'Month', 'WeekDay', 'Unit', 'Expression'];

// roman numeral by regex
const hasIVX = /[IVX]/; // does it ~look like~ a roman numeral?
// quick-version
const romanNumeral = /^[IVXLCDM]{2,}$/;
// https://stackoverflow.com/a/267405/168877
const romanNumValid = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
const nope = {
  li: true,
  dc: true,
  md: true,
  dm: true,
  ml: true,
};

// if it's a unknown titlecase word, it's a propernoun
const checkCase = function (terms, i, model) {
  const term = terms[i];
  // assume terms are already indexed
  term.index = term.index || [0, 0];
  const index = term.index[1];
  const str = term.text || ''; //need case info
  // titlecase and not first word of sentence
  if (index !== 0 && titleCase$1.test(str) === true && hasNumber.test(str) === false) {
    // skip Dates and stuff
    if (notProper.find(tag => term.tags.has(tag))) {
      return null
    }
    // first word in a quotation?
    if (term.pre.match(/["']$/)) {
      return null
    }
    if (term.normal === 'the') {
      return null
    }
    fillTags(terms, i, model);
    if (!term.tags.has('Noun') && !term.frozen) {
      term.tags.clear();
    }
    fastTag(term, 'ProperNoun', '2-titlecase');
    return true
  }
  //roman numberals - XVII
  if (str.length >= 2 && romanNumeral.test(str) && hasIVX.test(str) && romanNumValid.test(str) && !nope[term.normal]) {
    fastTag(term, 'RomanNumeral', '2-xvii');
    return true
  }

  return null
};

//sweep-through all suffixes
const suffixLoop = function (str = '', suffixes = []) {
  const len = str.length;
  let max = 7;
  if (len <= max) {
    max = len - 1;
  }
  for (let i = max; i > 1; i -= 1) {
    const suffix = str.substring(len - i, len);
    if (suffixes[suffix.length].hasOwnProperty(suffix) === true) {
      // console.log(suffix)
      const tag = suffixes[suffix.length][suffix];
      return tag
    }
  }
  return null
};

// decide tag from the ending of the word
const tagBySuffix = function (terms, i, model) {
  const term = terms[i];
  if (term.tags.size === 0) {
    let tag = suffixLoop(term.normal, model.two.suffixPatterns);
    if (tag !== null) {
      fastTag(term, tag, '2-suffix');
      term.confidence = 0.7;
      return true
    }
    // try implicit form of word, too
    if (term.implicit) {
      tag = suffixLoop(term.implicit, model.two.suffixPatterns);
      if (tag !== null) {
        fastTag(term, tag, '2-implicit-suffix');
        term.confidence = 0.7;
        return true
      }
    }
    // Infinitive suffix + 's' can be PresentTense
    // if (term.normal[term.normal.length - 1] === 's') {
    //   let str = term.normal.replace(/s$/, '')
    //   if (suffixLoop(str, model.two.suffixPatterns) === 'Infinitive') {
    //     console.log(str)
    //     fastTag(term, 'PresentTense', '2-implied-present')
    //     term.confidence = 0.5
    //     return true
    //   }
    // }
  }
  return null
};

const hasApostrophe = /['‘’‛‵′`´]/;

// normal regexes
const doRegs = function (str, regs) {
  for (let i = 0; i < regs.length; i += 1) {
    if (regs[i][0].test(str) === true) {
      return regs[i]
    }
  }
  return null
};
// suffix-regexes, indexed by last-character
const doEndsWith = function (str = '', byEnd) {
  const char = str[str.length - 1];
  if (byEnd.hasOwnProperty(char) === true) {
    const regs = byEnd[char] || [];
    for (let r = 0; r < regs.length; r += 1) {
      if (regs[r][0].test(str) === true) {
        return regs[r]
      }
    }
  }
  return null
};

const checkRegex = function (terms, i, model, world) {
  const setTag = world.methods.one.setTag;
  const { regexText, regexNormal, regexNumbers, endsWith } = model.two;
  const term = terms[i];
  const normal = term.machine || term.normal;
  let text = term.text;
  // keep dangling apostrophe?
  if (hasApostrophe.test(term.post) && !hasApostrophe.test(term.pre)) {
    text += term.post.trim();
  }
  let arr = doRegs(text, regexText) || doRegs(normal, regexNormal);
  // hide a bunch of number regexes behind this one
  if (!arr && /[0-9]/.test(normal)) {
    arr = doRegs(normal, regexNumbers);
  }
  // only run endsWith if we're desperate
  if (!arr && term.tags.size === 0) {
    arr = doEndsWith(normal, endsWith);
  }
  if (arr) {
    // console.log(arr)
    setTag([term], arr[1], world, null, `2-regex-'${arr[2] || arr[0]}'`);
    term.confidence = 0.6;
    return true
  }
  return null
};

// const prefixes = /^(anti|re|un|non|extra|inter|intra|over)([a-z-]{3})/

//sweep-through all prefixes
const prefixLoop = function (str = '', prefixes = []) {
  const len = str.length;
  let max = 7;
  if (max > len - 3) {
    max = len - 3;
  }
  for (let i = max; i > 2; i -= 1) {
    const prefix = str.substring(0, i);
    if (prefixes[prefix.length].hasOwnProperty(prefix) === true) {
      const tag = prefixes[prefix.length][prefix];
      return tag
    }
  }
  return null
};

// give 'overwork' the same tag as 'work'
const checkPrefix = function (terms, i, model) {
  const term = terms[i];
  if (term.tags.size === 0) {
    const tag = prefixLoop(term.normal, model.two.prefixPatterns);
    if (tag !== null) {
      // console.log(term.normal, '->', tag)
      fastTag(term, tag, '2-prefix');
      term.confidence = 0.5;
      return true
    }
  }
  return null
};

const min = 1400;
const max = 2100;

const dateWords = new Set([
  'in',
  'on',
  'by',
  'until',
  'for',
  'to',
  'during',
  'throughout',
  'through',
  'within',
  'before',
  'after',
  'of',
  'this',
  'next',
  'last',
  'circa',
  'around',
  'post',
  'pre',
  'budget',
  'classic',
  'plan',
  'may',
]);

const seemsGood$1 = function (term) {
  if (!term) {
    return false
  }
  const str = term.normal || term.implicit;
  if (dateWords.has(str)) {
    return true
  }
  if (term.tags.has('Date') || term.tags.has('Month') || term.tags.has('WeekDay') || term.tags.has('Year')) {
    return true
  }
  // 1999 Film Festival
  if (term.tags.has('ProperNoun')) {
    return true
  }
  return false
};

const seemsOkay = function (term) {
  if (!term) {
    return false
  }
  if (term.tags.has('Ordinal')) {
    return true
  }
  // untagged 'june 13 2007'
  if (term.tags.has('Cardinal') && term.normal.length < 3) {
    return true
  }
  // 2020 was ..
  if (term.normal === 'is' || term.normal === 'was') {
    return true
  }
  return false
};

const seemsFine = function (term) {
  return term && (term.tags.has('Date') || term.tags.has('Month') || term.tags.has('WeekDay') || term.tags.has('Year'))
};

// recognize '1993' as a year
const tagYear = function (terms, i) {
  const term = terms[i];
  if (term.tags.has('NumericValue') && term.tags.has('Cardinal') && term.normal.length === 4) {
    const num = Number(term.normal);
    // number between 1400 and 2100
    if (num && !isNaN(num)) {
      if (num > min && num < max) {
        const lastTerm = terms[i - 1];
        const nextTerm = terms[i + 1];
        if (seemsGood$1(lastTerm) || seemsGood$1(nextTerm)) {
          return fastTag(term, 'Year', '2-tagYear')
        }
        // or is it really-close to a year?
        if (num >= 1920 && num < 2025) {
          // look at neighbours
          if (seemsOkay(lastTerm) || seemsOkay(nextTerm)) {
            return fastTag(term, 'Year', '2-tagYear-close')
          }
          // look at far-neighbours
          if (seemsFine(terms[i - 2]) || seemsFine(terms[i + 2])) {
            return fastTag(term, 'Year', '2-tagYear-far')
          }
          // 'the 2002 hit', 'my 1950 convertable'
          if (lastTerm && (lastTerm.tags.has('Determiner') || lastTerm.tags.has('Possessive'))) {
            if (nextTerm && nextTerm.tags.has('Noun') && !nextTerm.tags.has('Plural')) {
              return fastTag(term, 'Year', '2-tagYear-noun')
            }
          }
        }
      }
    }
  }
  return null
};

const verbType = function (terms, i, model, world) {
  const setTag = world.methods.one.setTag;
  const term = terms[i];
  const types = ['PastTense', 'PresentTense', 'Auxiliary', 'Modal', 'Particle'];
  if (term.tags.has('Verb')) {
    const type = types.find(typ => term.tags.has(typ));
    // is it a bare #Verb tag?
    if (!type) {
      setTag([term], 'Infinitive', world, null, `2-verb-type''`);
    }
  }
};

const oneLetterAcronym = /^[A-Z]('s|,)?$/;
const isUpperCase = /^[A-Z-]+$/;
const upperThenS = /^[A-Z]+s$/;
const periodAcronym = /([A-Z]\.)+[A-Z]?,?$/;
const noPeriodAcronym = /[A-Z]{2,}('s|,)?$/;
const lowerCaseAcronym = /([a-z]\.)+[a-z]\.?$/;

const oneLetterWord = {
  I: true,
  A: true,
};

// only assume these are places if they are uppercased
const places$1 = {
  la: true,
  ny: true,
  us: true,
  dc: true,
  gb: true,
};

// just uppercase acronyms, no periods - 'UNOCHA'
const isNoPeriodAcronym = function (term, model) {
  let str = term.text;
  // ensure it's all upper-case
  if (isUpperCase.test(str) === false) {
    // allow lower-case plural - 'MMVAs'
    if (str.length > 3 && upperThenS.test(str) === true) {
      str = str.replace(/s$/, '');
    } else {
      return false
    }
  }
  // long capitalized words are not usually either
  if (str.length > 5) {
    return false
  }
  // 'I' is not a acronym
  if (oneLetterWord.hasOwnProperty(str)) {
    return false
  }
  // known-words, like 'PIZZA' is not an acronym.
  if (model.one.lexicon.hasOwnProperty(term.normal)) {
    return false
  }
  //like N.D.A
  if (periodAcronym.test(str) === true) {
    return true
  }
  //like c.e.o
  if (lowerCaseAcronym.test(str) === true) {
    return true
  }
  //like 'F.'
  if (oneLetterAcronym.test(str) === true) {
    return true
  }
  //like NDA
  if (noPeriodAcronym.test(str) === true) {
    return true
  }
  return false
};

const isAcronym = function (terms, i, model) {
  const term = terms[i];
  //these are not acronyms
  if (term.tags.has('RomanNumeral') || term.tags.has('Acronym') || term.frozen) {
    return null
  }
  //non-period ones are harder
  if (isNoPeriodAcronym(term, model)) {
    term.tags.clear();
    fastTag(term, ['Acronym', 'Noun'], '3-no-period-acronym');
    // ny, la
    if (places$1[term.normal] === true) {
      fastTag(term, 'Place', '3-place-acronym');
    }
    // UFOs
    if (upperThenS.test(term.text) === true) {
      fastTag(term, 'Plural', '3-plural-acronym');
    }
    // if(term.normal
    return true
  }
  // one-letter acronyms
  if (!oneLetterWord.hasOwnProperty(term.text) && oneLetterAcronym.test(term.text)) {
    term.tags.clear();
    fastTag(term, ['Acronym', 'Noun'], '3-one-letter-acronym');
    return true
  }
  //if it's a very-short organization?
  if (term.tags.has('Organization') && term.text.length <= 3) {
    fastTag(term, 'Acronym', '3-org-acronym');
    return true
  }
  // upper-case org, like UNESCO
  if (term.tags.has('Organization') && isUpperCase.test(term.text) && term.text.length <= 6) {
    fastTag(term, 'Acronym', '3-titlecase-acronym');
    return true
  }
  return null
};

const lookAtWord = function (term, words) {
  if (!term) {
    return null
  }
  // look at prev word <-
  const found = words.find(a => term.normal === a[0]);
  if (found) {
    return found[1]
  }
  return null
};

const lookAtTag = function (term, tags) {
  if (!term) {
    return null
  }
  const found = tags.find(a => term.tags.has(a[0]));
  if (found) {
    return found[1]
  }
  return null
};

// look at neighbours for hints on unknown words
const neighbours = function (terms, i, model) {
  const { leftTags, leftWords, rightWords, rightTags } = model.two.neighbours;
  const term = terms[i];
  if (term.tags.size === 0) {
    let tag = null;
    // look left <-
    tag = tag || lookAtWord(terms[i - 1], leftWords);
    // look right ->
    tag = tag || lookAtWord(terms[i + 1], rightWords);
    // look left <-
    tag = tag || lookAtTag(terms[i - 1], leftTags);
    // look right ->
    tag = tag || lookAtTag(terms[i + 1], rightTags);
    if (tag) {
      fastTag(term, tag, '3-[neighbour]');
      fillTags(terms, i, model);
      terms[i].confidence = 0.2;
      return true
    }
  }
  return null
};

const isTitleCase$2 = (str) => /^\p{Lu}[\p{Ll}'’]/u.test(str);

const isOrg = function (term, i, yelling) {
  if (!term) {
    return false
  }
  if (term.tags.has('FirstName') || term.tags.has('Place')) {
    return false
  }
  if (term.tags.has('ProperNoun') || term.tags.has('Organization') || term.tags.has('Acronym')) {
    return true
  }
  // allow anything titlecased to be an org
  if (!yelling && isTitleCase$2(term.text)) {
    // only tag a titlecased first-word, if it checks-out
    if (i === 0) {
      return term.tags.has('Singular')
    }
    return true
  }
  return false
};

const tagOrgs$1 = function (terms, i, world, yelling) {
  const orgWords = world.model.two.orgWords;
  const setTag = world.methods.one.setTag;
  const term = terms[i];
  const str = term.machine || term.normal;
  if (orgWords[str] === true && isOrg(terms[i - 1], i - 1, yelling)) {
    setTag([terms[i]], 'Organization', world, null, '3-[org-word]');
    // loop backwards, tag organization-like things
    for (let t = i; t >= 0; t -= 1) {
      if (isOrg(terms[t], t, yelling)) {
        setTag([terms[t]], 'Organization', world, null, '3-[org-word]');
      } else {
        break
      }
    }
  }
  return null
};

const isTitleCase$1 = str => /^\p{Lu}[\p{Ll}'’]/u.test(str);
const isPossessive$1 = /'s$/;

// words that can fit inside a place
const placeCont = new Set([
  'athletic',
  'city',
  'community',
  'eastern',
  'federal',
  'financial',
  'great',
  'historic',
  'historical',
  'local',
  'memorial',
  'municipal',
  'national',
  'northern',
  'provincial',
  'southern',
  'state',
  'western',
  'spring',
  'pine',
  'sunset',
  'view',
  'oak',
  'maple',
  'spruce',
  'cedar',
  'willow',
]);
// center of...
const noBefore = new Set(['center', 'centre', 'way', 'range', 'bar', 'bridge', 'field', 'pit']);

const isPlace = function (term, i, yelling) {
  if (!term) {
    return false
  }
  const tags = term.tags;
  if (tags.has('Organization') || tags.has('Possessive') || isPossessive$1.test(term.normal)) {
    return false
  }
  if (tags.has('ProperNoun') || tags.has('Place')) {
    return true
  }
  // allow anything titlecased to be an org
  if (!yelling && isTitleCase$1(term.text)) {
    // only tag a titlecased first-word, if it checks-out
    if (i === 0) {
      return tags.has('Singular')
    }
    return true
  }
  return false
};

const tagOrgs = function (terms, i, world, yelling) {
  const placeWords = world.model.two.placeWords;
  const setTag = world.methods.one.setTag;
  const term = terms[i];
  const str = term.machine || term.normal;

  // 'river', delta, street, etc
  if (placeWords[str] === true) {
    //loop backward - 'Foo River ...'
    for (let n = i - 1; n >= 0; n -= 1) {
      // 'municipal ...'
      if (placeCont.has(terms[n].normal)) {
        continue
      }
      if (isPlace(terms[n], n, yelling)) {
        setTag(terms.slice(n, i + 1), 'Place', world, null, '3-[place-of-foo]');
        continue
      }
      break
    }
    //loop forward - 'River of Foo...'
    // 'center of x'
    if (noBefore.has(str)) {
      return false
    }
    for (let n = i + 1; n < terms.length; n += 1) {
      if (isPlace(terms[n], n, yelling)) {
        setTag(terms.slice(i, n + 1), 'Place', world, null, '3-[foo-place]');
        return true
      }
      // 'municipal ...'
      if (terms[n].normal === 'of' || placeCont.has(terms[n].normal)) {
        continue
      }
      break
    }
  }
  return null
};

const nounFallback = function (terms, i, model) {
  let isEmpty = false;
  const tags = terms[i].tags;
  if (tags.size === 0) {
    isEmpty = true;
  } else if (tags.size === 1) {
    // weaker tags to ignore
    if (tags.has('Hyphenated') || tags.has('HashTag') || tags.has('Prefix') || tags.has('SlashedTerm')) {
      isEmpty = true;
    }
  }
  if (isEmpty) {
    fastTag(terms[i], 'Noun', '3-[fallback]');
    // try to give it singluar/plural tags, too
    fillTags(terms, i, model);
    terms[i].confidence = 0.1;
  }
};

const isTitleCase = /^[A-Z][a-z]/;

const isCapital = (terms, i) => {
  if (terms[i].tags.has('ProperNoun') && isTitleCase.test(terms[i].text)) {// 'Comfort Inn'
    return 'Noun'
  }
  return null
};

const isAlone = (terms, i, tag) => {
  if (i === 0 && !terms[1]) {// 'Help'
    return tag
  }
  return null
};

// 'a rental'
const isEndNoun = function (terms, i) {
  if (!terms[i + 1] && terms[i - 1] && terms[i - 1].tags.has('Determiner')) {
    return 'Noun'
  }
  return null
};

// the first word in the sentence
const isStart = function (terms, i, tag) {
  if (i === 0 && terms.length > 3) {
    return tag
  }
  return null
};

const adhoc = {
  'Adj|Gerund': (terms, i) => {
    return isCapital(terms, i)
  },
  'Adj|Noun': (terms, i) => {
    return isCapital(terms, i) || isEndNoun(terms, i)
  },
  'Actor|Verb': (terms, i) => {
    return isCapital(terms, i)
  },
  'Adj|Past': (terms, i) => {
    return isCapital(terms, i)
  },
  'Adj|Present': (terms, i) => {
    return isCapital(terms, i)
  },
  'Noun|Gerund': (terms, i) => {
    return isCapital(terms, i)
  },
  'Noun|Verb': (terms, i) => {
    return (i > 0 && isCapital(terms, i)) || isAlone(terms, i, 'Infinitive')
  },
  'Plural|Verb': (terms, i) => {
    return isCapital(terms, i) || isAlone(terms, i, 'PresentTense') || isStart(terms, i, 'Plural')
  },
  'Person|Noun': (terms, i) => {
    return isCapital(terms, i)
  },
  'Person|Verb': (terms, i) => {
    if (i !== 0) {
      return isCapital(terms, i)
    }
    return null
  },
  'Person|Adj': (terms, i) => {
    if (i === 0 && terms.length > 1) {
      return 'Person'
    }
    return isCapital(terms, i) ? 'Person' : null
  },
};

/* eslint-disable no-console */
const env = typeof process === 'undefined' || !process.env ? self.env || {} : process.env;
const prefix = /^(under|over|mis|re|un|dis|semi)-?/;

const checkWord = (term, obj) => {
  if (!term || !obj) {
    return null
  }
  const str = term.normal || term.implicit;
  let found = null;
  if (obj.hasOwnProperty(str)) {
    found = obj[str];
  }
  if (found && env.DEBUG_TAGS) {
    console.log(`\n  \x1b[2m\x1b[3m     ↓ - '${str}' \x1b[0m`);
  }
  return found
};

const checkTag = (term, obj = {}, tagSet) => {
  if (!term || !obj) {
    return null
  }
  // rough sort, so 'Noun' is after ProperNoun, etc
  const tags = Array.from(term.tags).sort((a, b) => {
    const numA = tagSet[a] ? tagSet[a].parents.length : 0;
    const numB = tagSet[b] ? tagSet[b].parents.length : 0;
    return numA > numB ? -1 : 1
  });
  let found = tags.find(tag => obj[tag]);
  if (found && env.DEBUG_TAGS) {
    console.log(`  \x1b[2m\x1b[3m      ↓ - '${term.normal || term.implicit}' (#${found})  \x1b[0m`);
  }
  found = obj[found];
  return found
};

const pickTag = function (terms, i, clues, model) {
  if (!clues) {
    return null
  }
  const beforeIndex = terms[i - 1]?.text !== 'also' ? i - 1 : Math.max(0, i - 2);
  const tagSet = model.one.tagSet;
  // look -> right word, first
  let tag = checkWord(terms[i + 1], clues.afterWords);
  // look <- left word, second
  tag = tag || checkWord(terms[beforeIndex], clues.beforeWords);
  // look <- left tag
  tag = tag || checkTag(terms[beforeIndex], clues.beforeTags, tagSet);
  // look -> right tag
  tag = tag || checkTag(terms[i + 1], clues.afterTags, tagSet);
  // console.log(clues)
  return tag
};

// words like 'bob' that can change between two tags
const doSwitches = function (terms, i, world) {
  const model = world.model;
  const setTag = world.methods.one.setTag;
  const { switches, clues } = model.two;
  const term = terms[i];
  let str = term.normal || term.implicit || '';
  // support prefixes for switching words
  if (prefix.test(str) && !switches[str]) {
    str = str.replace(prefix, ''); // could use some guards, here
  }
  if (term.switch) {
    const form = term.switch;
    // skip propernouns, acronyms, etc
    if (term.tags.has('Acronym') || term.tags.has('PhrasalVerb')) {
      return
    }
    let tag = pickTag(terms, i, clues[form], model);
    // lean-harder on some variable forms
    if (adhoc[form]) {
      tag = adhoc[form](terms, i) || tag;
    }
    // did we find anything?
    if (tag) {
      // tag it
      setTag([term], tag, world, null, `3-[switch] (${form})`);
      // add plural/singular etc.
      fillTags(terms, i, model);
    } else if (env.DEBUG_TAGS) {
      console.log(`\n -> X  - '${str}'  : (${form})  `);
    }
  }
};

const beside = {
  there: true, //go there
  this: true, //try this
  it: true, //do it
  him: true,
  her: true,
  us: true, //tell us
};

// '[place] tea bags in hot water'
const imperative$1 = function (terms, world) {
  const setTag = world.methods.one.setTag;
  const multiWords = world.model.one._multiCache || {};
  const t = terms[0];
  const isRight = t.switch === 'Noun|Verb' || t.tags.has('Infinitive');
  if (isRight && terms.length >= 2) {
    // ensure rest of sentence is ok
    if (terms.length < 4 && !beside[terms[1].normal]) {
      return
    }
    // avoid multi-noun words like '[board] room'
    if (!t.tags.has('PhrasalVerb') && multiWords.hasOwnProperty(t.normal)) {
      return
    }
    // is the next word a noun? - 'compile information ..'
    const nextNoun = terms[1].tags.has('Noun') || terms[1].tags.has('Determiner');
    if (nextNoun) {
      // ensure no soon-verb -  'waste materials are ..'
      const soonVerb = terms.slice(1, 3).some(term => term.tags.has('Verb'));
      if (!soonVerb || t.tags.has('#PhrasalVerb')) {
        setTag([t], 'Imperative', world, null, '3-[imperative]');
      }
    }
  }
};

// is it all yelling-case?
const ignoreCase = function (terms) {
  // allow 'John F Kennedy'
  if (terms.filter(t => !t.tags.has('ProperNoun')).length <= 3) {
    return false
  }
  const lowerCase = /^[a-z]/;
  return terms.every(t => !lowerCase.test(t.text))
};

// taggers with no clause-splitting
const firstPass = function (docs, model, world) {
  docs.forEach(terms => {
    // check whitespace/punctuation
    byPunctuation(terms, 0, model, world);
  });
};

// these methods don't care about word-neighbours
const secondPass = function (terms, model, world, isYelling) {
  for (let i = 0; i < terms.length; i += 1) {
    // skip frozen terms, for now
    if (terms[i].frozen === true) {
      continue
    }
    // mark Noun|Verb on term metadata
    tagSwitch(terms, i, model);
    //  is it titlecased?
    if (isYelling === false) {
      checkCase(terms, i, model);
    }
    // look at word ending
    tagBySuffix(terms, i, model);
    // try look-like rules
    checkRegex(terms, i, model, world);
    // check for recognized prefix, like 'micro-'
    checkPrefix(terms, i, model);
    // turn '1993' into a year
    tagYear(terms, i);
  }
};

// neighbour-based tagging
const thirdPass = function (terms, model, world, isYelling) {
  for (let i = 0; i < terms.length; i += 1) {
    // let these tags get layered
    let found = isAcronym(terms, i, model);
    // deduce parent tags
    fillTags(terms, i, model);
    // look left+right for hints
    found = found || neighbours(terms, i, model);
    //  ¯\_(ツ)_/¯ - found nothing
    found = found || nounFallback(terms, i, model);
  }
  for (let i = 0; i < terms.length; i += 1) {
    // skip these
    if (terms[i].frozen === true) {
      continue
    }
    // Johnson LLC
    tagOrgs$1(terms, i, world, isYelling);
    // Wawel Castle
    tagOrgs(terms, i, world, isYelling);
    // verb-noun disambiguation, etc
    doSwitches(terms, i, world);
    // give bare verbs more tags
    verbType(terms, i, model, world);
    // hard-nosed
    byHyphen(terms, i, model, world);
  }
  // place tea bags
  imperative$1(terms, world);
};

const preTagger = function (view) {
  const { methods, model, world } = view;
  const docs = view.docs;
  // try some early stuff
  firstPass(docs, model, world);
  // roughly split sentences up by clause
  const document = methods.two.quickSplit(docs);
  // start with all terms
  for (let n = 0; n < document.length; n += 1) {
    const terms = document[n];
    // is it all upper-case?
    const isYelling = ignoreCase(terms);
    // guess by the letters
    secondPass(terms, model, world, isYelling);
    // guess by the neighbours
    thirdPass(terms, model, world, isYelling);
  }
  return document
};

const toRoot$2 = {
  // 'spencer's' -> 'spencer'
  'Possessive': (term) => {
    let str = term.machine || term.normal || term.text;
    str = str.replace(/'s$/, '');
    return str
  },
  // 'drinks' -> 'drink'
  'Plural': (term, world) => {
    const str = term.machine || term.normal || term.text;
    return world.methods.two.transform.noun.toSingular(str, world.model)
  },
  // ''
  'Copula': () => {
    return 'is'
  },
  // 'walked' -> 'walk'
  'PastTense': (term, world) => {
    const str = term.machine || term.normal || term.text;
    return world.methods.two.transform.verb.toInfinitive(str, world.model, 'PastTense')
  },
  // 'walking' -> 'walk'
  'Gerund': (term, world) => {
    const str = term.machine || term.normal || term.text;
    return world.methods.two.transform.verb.toInfinitive(str, world.model, 'Gerund')
  },
  // 'walks' -> 'walk'
  'PresentTense': (term, world) => {
    const str = term.machine || term.normal || term.text;
    if (term.tags.has('Infinitive')) {
      return str
    }
    return world.methods.two.transform.verb.toInfinitive(str, world.model, 'PresentTense')
  },
  // 'quieter' -> 'quiet'
  'Comparative': (term, world) => {
    const str = term.machine || term.normal || term.text;
    return world.methods.two.transform.adjective.fromComparative(str, world.model)
  },
  // 'quietest' -> 'quiet'
  'Superlative': (term, world) => {
    const str = term.machine || term.normal || term.text;
    return world.methods.two.transform.adjective.fromSuperlative(str, world.model)
  },
  // 'suddenly' -> 'sudden'
  'Adverb': (term, world) => {
    const { fromAdverb } = world.methods.two.transform.adjective;
    const str = term.machine || term.normal || term.text;
    return fromAdverb(str)
  },
};

const getRoot$1 = function (view) {
  const world = view.world;
  const keys = Object.keys(toRoot$2);
  view.docs.forEach(terms => {
    for (let i = 0; i < terms.length; i += 1) {
      const term = terms[i];
      for (let k = 0; k < keys.length; k += 1) {
        if (term.tags.has(keys[k])) {
          const fn = toRoot$2[keys[k]];
          const root = fn(term, world);
          if (term.normal !== root) {
            term.root = root;
          }
          break
        }
      }
    }
  });
};

// rough connection between compromise tagset and Penn Treebank
// https://www.ling.upenn.edu/courses/Fall_2003/ling001/penn_treebank_pos.html

const mapping$1 = {
  // adverbs
  // 'Comparative': 'RBR',
  // 'Superlative': 'RBS',
  Adverb: 'RB',

  // adjectives
  Comparative: 'JJR',
  Superlative: 'JJS',
  Adjective: 'JJ',
  TO: 'Conjunction',

  // verbs
  Modal: 'MD',
  Auxiliary: 'MD',
  Gerund: 'VBG', //throwing
  PastTense: 'VBD', //threw
  Participle: 'VBN', //thrown
  PresentTense: 'VBZ', //throws
  Infinitive: 'VB', //throw
  Particle: 'RP', //phrasal particle
  Verb: 'VB', // throw

  // pronouns
  Pronoun: 'PRP',

  // misc
  Cardinal: 'CD',
  Conjunction: 'CC',
  Determiner: 'DT',
  Preposition: 'IN',
  // 'Determiner': 'WDT',
  // 'Expression': 'FW',
  QuestionWord: 'WP',
  Expression: 'UH',

  //nouns
  Possessive: 'POS',
  ProperNoun: 'NNP',
  Person: 'NNP',
  Place: 'NNP',
  Organization: 'NNP',
  Singular: 'NN',
  Plural: 'NNS',
  Noun: 'NN',

  There: 'EX', //'there'
  // 'Adverb':'WRB',
  // 'Noun':'PDT', //predeterminer
  // 'Noun':'SYM', //symbol
  // 'Noun':'NFP', //

  //  WDT 	Wh-determiner
  // 	WP 	Wh-pronoun
  // 	WP$ 	Possessive wh-pronoun
  // 	WRB 	Wh-adverb
};

const toPenn = function (term) {
  // try some ad-hoc ones
  if (term.tags.has('ProperNoun') && term.tags.has('Plural')) {
    return 'NNPS'
  }
  if (term.tags.has('Possessive') && term.tags.has('Pronoun')) {
    return 'PRP$'
  }
  if (term.normal === 'there') {
    return 'EX'
  }
  if (term.normal === 'to') {
    return 'TO'
  }
  // run through an ordered list of tags
  const arr = term.tagRank || [];
  for (let i = 0; i < arr.length; i += 1) {
    if (mapping$1.hasOwnProperty(arr[i])) {
      return mapping$1[arr[i]]
    }
  }
  return null
};

const pennTag = function (view) {
  view.compute('tagRank');
  view.docs.forEach(terms => {
    terms.forEach(term => {
      term.penn = toPenn(term);
    });
  });
};

var compute$3 = { preTagger, root: getRoot$1, penn: pennTag };

const entity = ['Person', 'Place', 'Organization'];

var nouns$1 = {
  Noun: {
    not: ['Verb', 'Adjective', 'Adverb', 'Value', 'Determiner'],
  },
  Singular: {
    is: 'Noun',
    not: ['Plural', 'Uncountable'],
  },
  // 'Canada'
  ProperNoun: {
    is: 'Noun',
  },
  Person: {
    is: 'Singular',
    also: ['ProperNoun'],
    not: ['Place', 'Organization', 'Date'],
  },
  FirstName: {
    is: 'Person',
  },
  MaleName: {
    is: 'FirstName',
    not: ['FemaleName', 'LastName'],
  },
  FemaleName: {
    is: 'FirstName',
    not: ['MaleName', 'LastName'],
  },
  LastName: {
    is: 'Person',
    not: ['FirstName'],
  },
  // 'dr.'
  Honorific: {
    is: 'Person',
    not: ['FirstName', 'LastName', 'Value'],
  },
  Place: {
    is: 'Singular',
    not: ['Person', 'Organization'],
  },
  Country: {
    is: 'Place',
    also: ['ProperNoun'],
    not: ['City'],
  },
  City: {
    is: 'Place',
    also: ['ProperNoun'],
    not: ['Country'],
  },
  // 'california'
  Region: {
    is: 'Place',
    also: ['ProperNoun'],
  },
  Address: {
    // is: 'Place',
  },
  Organization: {
    is: 'ProperNoun',
    not: ['Person', 'Place'],
  },
  SportsTeam: {
    is: 'Organization',
  },
  School: {
    is: 'Organization',
  },
  Company: {
    is: 'Organization',
  },
  Plural: {
    is: 'Noun',
    not: ['Singular', 'Uncountable'],
  },
  // 'gravity'
  Uncountable: {
    is: 'Noun',
  },
  // 'it'
  Pronoun: {
    is: 'Noun',
    not: entity,
  },
  // 'swimmer'
  Actor: {
    is: 'Noun',
    not: ['Place', 'Organization'],
  },
  // walking
  Activity: {
    is: 'Noun',
    not: ['Person', 'Place'],
  },
  // kilometres
  Unit: {
    is: 'Noun',
    not: entity,
  },
  // canadian
  Demonym: {
    is: 'Noun',
    also: ['ProperNoun'],
    not: entity,
  },
  // [spencer's] hat
  Possessive: {
    is: 'Noun',
  },
  // 'yourself'
  Reflexive: {
    is: 'Pronoun',
  },
};

var verbs$2 = {
  Verb: {
    not: ['Noun', 'Adjective', 'Adverb', 'Value', 'Expression'],
  },
  // 'he [walks]'
  PresentTense: {
    is: 'Verb',
    not: ['PastTense', 'FutureTense'],
  },
  // 'will [walk]'
  Infinitive: {
    is: 'PresentTense',
    not: ['Gerund'],
  },
  // '[walk] now!'
  Imperative: {
    is: 'Verb',
    not: ['PastTense', 'Gerund', 'Copula'],
  },
  // walking
  Gerund: {
    is: 'PresentTense',
    not: ['Copula'],
  },
  // walked
  PastTense: {
    is: 'Verb',
    not: ['PresentTense', 'Gerund', 'FutureTense'],
  },
  // will walk
  FutureTense: {
    is: 'Verb',
    not: ['PresentTense', 'PastTense'],
  },
  // is/was
  Copula: {
    is: 'Verb',
  },
  // '[could] walk'
  Modal: {
    is: 'Verb',
    not: ['Infinitive'],
  },
  // 'awaken'
  Participle: {
    is: 'PastTense',
  },
  // '[will have had] walked'
  Auxiliary: {
    is: 'Verb',
    not: ['PastTense', 'PresentTense', 'Gerund', 'Conjunction'],
  },
  // 'walk out'
  PhrasalVerb: {
    is: 'Verb',
  },
  // 'walk [out]'
  Particle: {
    is: 'PhrasalVerb',
    not: ['PastTense', 'PresentTense', 'Copula', 'Gerund'],
  },
  // 'walked by'
  Passive: {
    is: 'Verb',
  },
};

var values = {
  Value: {
    not: ['Verb', 'Adjective', 'Adverb'],
  },
  Ordinal: {
    is: 'Value',
    not: ['Cardinal'],
  },
  Cardinal: {
    is: 'Value',
    not: ['Ordinal'],
  },
  Fraction: {
    is: 'Value',
    not: ['Noun'],
  },
  Multiple: {
    is: 'TextValue',
  },
  RomanNumeral: {
    is: 'Cardinal',
    not: ['TextValue'],
  },
  TextValue: {
    is: 'Value',
    not: ['NumericValue'],
  },
  NumericValue: {
    is: 'Value',
    not: ['TextValue'],
  },
  Money: {
    is: 'Cardinal',
  },
  Percent: {
    is: 'Value',
  },
};

var dates$1 = {
  Date: {
    not: ['Verb', 'Adverb', 'Adjective'],
  },
  Month: {
    is: 'Date',
    also: ['Noun'],
    not: ['Year', 'WeekDay', 'Time'],
  },
  WeekDay: {
    is: 'Date',
    also: ['Noun'],
  },
  Year: {
    is: 'Date',
    not: ['RomanNumeral'],
  },
  FinancialQuarter: {
    is: 'Date',
    not: 'Fraction',
  },
  // 'easter'
  Holiday: {
    is: 'Date',
    also: ['Noun'],
  },
  // 'summer'
  Season: {
    is: 'Date',
  },
  Timezone: {
    is: 'Date',
    also: ['Noun'],
    not: ['ProperNoun'],
  },
  Time: {
    is: 'Date',
    not: ['AtMention'],
  },
  // 'months'
  Duration: {
    is: 'Date',
    also: ['Noun'],
  },
};

const anything = ['Noun', 'Verb', 'Adjective', 'Adverb', 'Value', 'QuestionWord'];

var misc$1 = {
  Adjective: {
    not: ['Noun', 'Verb', 'Adverb', 'Value'],
  },
  Comparable: {
    is: 'Adjective',
  },
  Comparative: {
    is: 'Adjective',
  },
  Superlative: {
    is: 'Adjective',
    not: ['Comparative'],
  },
  NumberRange: {},
  Adverb: {
    not: ['Noun', 'Verb', 'Adjective', 'Value'],
  },

  Determiner: {
    not: ['Noun', 'Verb', 'Adjective', 'Adverb', 'QuestionWord', 'Conjunction'], //allow 'a' to be a Determiner/Value
  },
  Conjunction: {
    not: anything,
  },
  Preposition: {
    not: ['Noun', 'Verb', 'Adjective', 'Adverb', 'QuestionWord', 'Determiner'],
  },
  QuestionWord: {
    not: ['Determiner'],
  },
  Currency: {
    is: 'Noun',
  },
  Expression: {
    not: ['Noun', 'Adjective', 'Verb', 'Adverb'],
  },
  Abbreviation: {},
  Url: {
    not: ['HashTag', 'PhoneNumber', 'Verb', 'Adjective', 'Value', 'AtMention', 'Email', 'SlashedTerm'],
  },
  PhoneNumber: {
    not: ['HashTag', 'Verb', 'Adjective', 'Value', 'AtMention', 'Email'],
  },
  HashTag: {},
  AtMention: {
    is: 'Noun',
    not: ['HashTag', 'Email'],
  },
  Emoji: {
    not: ['HashTag', 'Verb', 'Adjective', 'Value', 'AtMention'],
  },
  Emoticon: {
    not: ['HashTag', 'Verb', 'Adjective', 'Value', 'AtMention', 'SlashedTerm'],
  },
  SlashedTerm: {
    not: ['Emoticon', 'Url', 'Value']
  },
  Email: {
    not: ['HashTag', 'Verb', 'Adjective', 'Value', 'AtMention'],
  },
  Acronym: {
    not: ['Plural', 'RomanNumeral', 'Pronoun', 'Date'],
  },
  Negative: {
    not: ['Noun', 'Adjective', 'Value', 'Expression'],
  },
  Condition: {
    not: ['Verb', 'Adjective', 'Noun', 'Value'],
  },
  // existential 'there'
  There: {
    not: ['Verb', 'Adjective', 'Noun', 'Value', 'Conjunction', 'Preposition'],
  },
  // 'co-wrote'
  Prefix: {
    not: ['Abbreviation', 'Acronym', 'ProperNoun'],
  },
  // hard-nosed, bone-headed
  Hyphenated: {},
};

const allTags = Object.assign({}, nouns$1, verbs$2, values, dates$1, misc$1);

var preTag = {
  compute: compute$3,
  methods: methods$1,
  model: model$1,
  tags: allTags,
  hooks: ['preTagger'],
};

const postPunct = /[,)"';:\-–—.…]/;

const setContraction = function (m, suffix) {
  if (!m.found) {
    return
  }
  const terms = m.termList();
  //avoid any problematic punctuation
  for (let i = 0; i < terms.length - 1; i++) {
    const t = terms[i];
    if (postPunct.test(t.post)) {
      return
    }
  }
  // set first word as full text
  terms[0].implicit = terms[0].normal;
  terms[0].text += suffix;
  terms[0].normal += suffix;
  // clean-up the others
  terms.slice(1).forEach(t => {
    t.implicit = t.normal;
    t.text = '';
    t.normal = '';
  });
  for (let i = 0; i < terms.length - 1; i++) {
    terms[i].post = terms[i].post.replace(/ /, '');
  }
};

/** turn 'i am' into i'm */
const contract = function () {
  const doc = this.not('@hasContraction');
  // we are -> we're
  let m = doc.match('(we|they|you) are');
  setContraction(m, `'re`);
  // they will -> they'll
  m = doc.match('(he|she|they|it|we|you) will');
  setContraction(m, `'ll`);
  // she is -> she's
  m = doc.match('(he|she|they|it|we) is');
  setContraction(m, `'s`);
  // spencer is -> spencer's
  m = doc.match('#Person is');
  setContraction(m, `'s`);
  // spencer would -> spencer'd
  m = doc.match('#Person would');
  setContraction(m, `'d`);
  // would not -> wouldn't
  m = doc.match('(is|was|had|would|should|could|do|does|have|has|can) not');
  setContraction(m, `n't`);
  // i have -> i've
  m = doc.match('(i|we|they) have');
  setContraction(m, `'ve`);
  // would have -> would've
  m = doc.match('(would|should|could) have');
  setContraction(m, `'ve`);
  // i am -> i'm
  m = doc.match('i am');
  setContraction(m, `'m`);
  // going to -> gonna
  m = doc.match('going to');
  return this
};

const titleCase = /^\p{Lu}[\p{Ll}'’]/u; //upercase, then lowercase

const toTitleCase = function (str = '') {
  str = str.replace(/^ *[a-z\u00C0-\u00FF]/, x => x.toUpperCase()); //TODO: support unicode
  return str
};

const api$j = function (View) {
  /** */
  class Contractions extends View {
    constructor(document, pointer, groups) {
      super(document, pointer, groups);
      this.viewType = 'Contraction';
    }
    /** i've -> 'i have' */
    expand() {
      this.docs.forEach(terms => {
        const isTitleCase = titleCase.test(terms[0].text);
        terms.forEach((t, i) => {
          t.text = t.implicit || '';
          delete t.implicit;
          //add whitespace
          if (i < terms.length - 1 && t.post === '') {
            t.post += ' ';
          }
          // flag it as dirty
          t.dirty = true;
        });
        // make the first word title-case?
        if (isTitleCase) {
          terms[0].text = toTitleCase(terms[0].text);
        }
      });
      this.compute('normal'); //re-set normalized text
      return this
    }
  }
  // add fn to View
  View.prototype.contractions = function () {
    const m = this.match('@hasContraction+');
    return new Contractions(this.document, m.pointer)
  };
  View.prototype.contract = contract;
};

// put n new words where 1 word was
const insertContraction = function (document, point, words) {
  const [n, w] = point;
  if (!words || words.length === 0) {
    return
  }
  words = words.map((word, i) => {
    word.implicit = word.text;
    word.machine = word.text;
    word.pre = '';
    word.post = '';
    word.text = '';
    word.normal = '';
    word.index = [n, w + i];
    return word
  });
  if (words[0]) {
    // move whitespace over
    words[0].pre = document[n][w].pre;
    words[words.length - 1].post = document[n][w].post;
    // add the text/normal to the first term
    words[0].text = document[n][w].text;
    words[0].normal = document[n][w].normal; // move tags too?
  }
  // do the splice
  document[n].splice(w, 1, ...words);
};

const hasContraction$1 = /'/;

const hasWords = new Set([
  'been', //the meeting's been ..
  'become', //my son's become
]);
const isWords = new Set([
  'what', //it's what
  'how', //it's how
  'when',
  'if', //it's if
  'too',
]);
const adjLike$1 = new Set(['too', 'also', 'enough']);

// the big clue is the tense of the following verb
const isOrHas = (terms, i) => {
  // scan ahead for the next verb or adjective
  for (let o = i + 1; o < terms.length; o += 1) {
    const t = terms[o];
    if (hasWords.has(t.normal)) {
      return 'has'
    }
    if (isWords.has(t.normal)) {
      return 'is'
    }
    // the cat's sleeping
    if (t.tags.has('Gerund')) {
      return 'is'
    }
    // she's the one
    if (t.tags.has('Determiner')) {
      return 'is'
    }
    // the food's ready
    if (t.tags.has('Adjective')) {
      return 'is'
    }
    // the car's parked
    if (t.switch === 'Adj|Past') {
      if (terms[o + 1]) {
        // car's parked too ..
        if (adjLike$1.has(terms[o + 1].normal)) {
          return 'is'
        }
        // car's parked on ..
        if (terms[o + 1].tags.has('Preposition')) {
          return 'is'
        }
      }
      // return 'is'
    }
    // The meeting's scheduled vs The plane's landed
    if (t.tags.has('PastTense')) {
      // meeting's scheduled for
      if (terms[o + 1] && terms[o + 1].normal === 'for') {
        return 'is'
      }
      return 'has'
    }
  }
  return 'is'
};

// 's -> [possessive, 'has', 'is', 'are', 'us']
const apostropheS$1 = function (terms, i) {
  // possessive, is/has
  const before = terms[i].normal.split(hasContraction$1)[0];
  // let's - >[let, us]
  if (before === 'let') {
    return [before, 'us']
  }
  // allow slang "there's cookies" -> there are
  if (before === 'there') {
    const t = terms[i + 1];
    if (t && t.tags.has('Plural')) {
      return [before, 'are']
    }
  }
  // spencer's got -> spencer has got
  if (isOrHas(terms, i) === 'has') {
    return [before, 'has']
  }
  return [before, 'is']
};

const hasContraction = /'/;

const hadWords = new Set([
  'better', //had better
  'done', //had done
  'before', // he'd _ before
  'it', // he'd _ it
  'had', //she'd had -> she would have..
]);

const wouldWords = new Set([
  'have', // 'i'd have' -> i would have..
  'be', //' she'd be'
]);

//look for a past-tense verb
// You'd mentioned -> you had mentioned
// You'd mention -> you would mention
const hadOrWould = (terms, i) => {
  // scan ahead
  for (let o = i + 1; o < terms.length; o += 1) {
    const t = terms[o];
    // you'd better go
    if (hadWords.has(t.normal)) {
      return 'had'
    }
    // we'd have
    if (wouldWords.has(t.normal)) {
      return 'would'
    }
    // You'd mentioned -> you had mentioned
    if (t.tags.has('PastTense') || t.switch === 'Adj|Past') {
      return 'had'
    }
    // You'd mention -> you would mention
    if (t.tags.has('PresentTense') || t.tags.has('Infinitive')) {
      return 'would'
    }
    // i'd an issue
    if (t.tags.has('#Determiner')) {
      return 'had'
    }
    if (t.tags.has('Adjective')) {
      return 'would'
    }
  }
  return false
};

// he'd walked -> had
// how'd -> did
// he'd go -> would
const _apostropheD = function (terms, i) {
  const before = terms[i].normal.split(hasContraction)[0];
  // what'd, how'd
  if (before === 'how' || before === 'what') {
    return [before, 'did']
  }
  if (hadOrWould(terms, i) === 'had') {
    return [before, 'had']
  }
  // had/would/did
  return [before, 'would']
};

const lastNoun$1 = function (terms, i) {
  for (let n = i - 1; n >= 0; n -= 1) {
    if (
      terms[n].tags.has('Noun') ||
      terms[n].tags.has('Pronoun') ||
      terms[n].tags.has('Plural') ||
      terms[n].tags.has('Singular')
    ) {
      return terms[n]
    }
  }
  return null
};

//ain't -> are/is not
const apostropheT = function (terms, i) {
  if (terms[i].normal === "ain't" || terms[i].normal === 'aint') {
    // "ain't never" -> have never (?)
    if (terms[i + 1] && terms[i + 1].normal === 'never') {
      return ['have']
    }
    // we aint -> are not,   she aint -> is not
    const noun = lastNoun$1(terms, i);
    if (noun) {
      // plural/singular pronouns
      if (noun.normal === 'we' || noun.normal === 'they') {
        return ['are', 'not']
      }
      if (noun.normal === 'i') {
        return ['am', 'not']
      }
      // plural/singular tags
      if (noun.tags && noun.tags.has('Plural')) {
        return ['are', 'not']
      }
    }
    return ['is', 'not']
  }
  const before = terms[i].normal.replace(/n't/, '');
  return [before, 'not']
};

const banList = {
  that: true,
  there: true,
  let: true,
  here: true,
  everywhere: true,
};

const beforePossessive = {
  in: true, //in sunday's
  by: true, //by sunday's
  for: true, //for sunday's
};
const adjLike = new Set(['too', 'also', 'enough', 'about']);
const nounLike = new Set(['is', 'are', 'did', 'were', 'could', 'should', 'must', 'had', 'have']);

const isPossessive = (terms, i) => {
  const term = terms[i];
  // these can't be possessive
  if (banList.hasOwnProperty(term.machine || term.normal)) {
    return false
  }
  // if we already know it
  if (term.tags.has('Possessive')) {
    return true
  }
  // who's
  if (term.tags.has('QuestionWord')) {
    return false
  }
  // some pronouns are never possessive
  if (term.normal === `he's` || term.normal === `she's`) {
    return false
  }
  //if end of sentence, it is possessive - "was spencer's"
  const nextTerm = terms[i + 1];
  if (!nextTerm) {
    return true
  }
  // "it's a life" vs "run it's business"
  if (term.normal === `it's`) {
    if (nextTerm.tags.has('#Noun')) {
      return true
    }
    return false
  }
  // the sun's setting vs the artist's painting
  // gerund = is,  noun = possessive
  // (we are doing some dupe-work of the switch classifier here)
  if (nextTerm.switch == 'Noun|Gerund') {
    const next2 = terms[i + 2];
    // the artist's painting.
    if (!next2) {
      if (term.tags.has('Actor') || term.tags.has('ProperNoun')) {
        return true
      }
      return false
    }
    // the artist's painting is..
    if (next2.tags.has('Copula')) {
      return true
    }
    // the cat's sleeping on ..
    if (next2.normal === 'on' || next2.normal === 'in') {
      return false
    }
    return false
  }
  //a gerund suggests 'is walking'
  if (nextTerm.tags.has('Verb')) {
    //fix 'jamie's bite'
    if (nextTerm.tags.has('Infinitive')) {
      return true
    }
    //'jamaica's growing'
    if (nextTerm.tags.has('Gerund')) {
      return false
    }
    //fix 'spencer's runs'
    if (nextTerm.tags.has('PresentTense')) {
      return true
    }
    return false
  }

  // john's nuts
  if (nextTerm.switch === 'Adj|Noun') {
    const twoTerm = terms[i + 2];
    if (!twoTerm) {
      return false //adj
    }
    // john's nuts were..
    if (nounLike.has(twoTerm.normal)) {
      return true
    }
    // john's nuts about..
    if (adjLike.has(twoTerm.normal)) {
      return false //adj
    }
  }
  //spencer's house
  if (nextTerm.tags.has('Noun')) {
    const nextStr = nextTerm.machine || nextTerm.normal;
    // 'spencer's here'
    if (nextStr === 'here' || nextStr === 'there' || nextStr === 'everywhere') {
      return false
    }
    // the chair's his
    if (nextTerm.tags.has('Possessive')) {
      return false
    }
    // the captain's John
    if (nextTerm.tags.has('ProperNoun') && !term.tags.has('ProperNoun')) {
      return false
    }
    return true
  }

  // by sunday's final
  if (terms[i - 1] && beforePossessive[terms[i - 1].normal] === true) {
    return true
  }

  // spencer's tired
  if (nextTerm.tags.has('Adjective')) {
    const twoTerm = terms[i + 2];
    //the rocket's red
    if (!twoTerm) {
      return false
    }
    // rocket's red nozzle
    if (twoTerm.tags.has('Noun') && !twoTerm.tags.has('Pronoun')) {
      //project's behind schedule
      const str = nextTerm.normal;
      if (str === 'above' || str === 'below' || str === 'behind') {
        return false
      }
      return true
    }
    // rocket's red glare
    if (twoTerm.switch === 'Noun|Verb') {
      return true
    }
    //othwerwise, an adjective suggests 'is good'
    return false
  }
  // baby's first steps
  if (nextTerm.tags.has('Value')) {
    return true
  }
  // otherwise not possessive
  return false
};

const byApostrophe = /'/;

// poor-mans reindexing of this sentence only
const reIndex = function (terms) {
  terms.forEach((t, i) => {
    if (t.index) {
      t.index[1] = i;
    }
  });
};

// run tagger on our new implicit terms
const reTag = function (terms, view, start, len) {
  const tmp = view.update();
  tmp.document = [terms];
  // offer to re-tag neighbours, too
  let end = start + len;
  if (start > 0) {
    start -= 1;
  }
  if (terms[end]) {
    end += 1;
  }
  tmp.ptrs = [[0, start, end]];
  tmp.compute(['freeze', 'lexicon', 'preTagger', 'unfreeze']);
  // don't for a reindex of the whole document
  reIndex(terms);
};

const byEnd = {
  // how'd
  d: (terms, i) => _apostropheD(terms, i),
  // we ain't
  t: (terms, i) => apostropheT(terms, i),
  // bob's
  s: (terms, i, world) => {
    // [bob's house] vs [bob's cool]
    if (isPossessive(terms, i)) {
      return world.methods.one.setTag([terms[i]], 'Possessive', world, null, '2-contraction')
    }
    return apostropheS$1(terms, i)
  },
};

const toDocs = function (words, view) {
  const doc = view.fromText(words.join(' '));
  doc.compute('id');
  return doc.docs[0]
};

//really easy ones
const contractionTwo$1 = view => {
  const { world, document } = view;
  // each sentence
  document.forEach((terms, n) => {
    // loop through terms backwards
    for (let i = terms.length - 1; i >= 0; i -= 1) {
      // is it already a contraction
      if (terms[i].implicit) {
        continue
      }
      let after = null;
      if (byApostrophe.test(terms[i].normal) === true) {
        after = terms[i].normal.split(byApostrophe)[1];
      }
      let words = null;
      // any known-ones, like 'dunno'?
      if (byEnd.hasOwnProperty(after)) {
        words = byEnd[after](terms, i, world);
      }
      // actually insert the new terms
      if (words) {
        words = toDocs(words, view);
        insertContraction(document, [n, i], words);
        reTag(document[n], view, i, words.length);
        continue
      }
    }
  });
};
var compute$2 = { contractionTwo: contractionTwo$1 };

var contractionTwo = {
  compute: compute$2,
  api: api$j,
  hooks: ['contractionTwo']
};

var adj = [
  // all fell apart
  { match: '[(all|both)] #Determiner #Noun', group: 0, tag: 'Noun', reason: 'all-noun' },
  //sometimes not-adverbs
  { match: '#Copula [(just|alone)]$', group: 0, tag: 'Adjective', reason: 'not-adverb' },
  //jack is guarded
  { match: '#Singular is #Adverb? [#PastTense$]', group: 0, tag: 'Adjective', reason: 'is-filled' },
  // smoked poutine is
  { match: '[#PastTense] #Singular is', group: 0, tag: 'Adjective', reason: 'smoked-poutine' },
  // baked onions are
  { match: '[#PastTense] #Plural are', group: 0, tag: 'Adjective', reason: 'baked-onions' },
  // well made
  { match: 'well [#PastTense]', group: 0, tag: 'Adjective', reason: 'well-made' },
  // is f*ed up
  { match: '#Copula [fucked up?]', group: 0, tag: 'Adjective', reason: 'swears-adjective' },
  //jack seems guarded
  { match: '#Singular (seems|appears) #Adverb? [#PastTense$]', group: 0, tag: 'Adjective', reason: 'seems-filled' },
  // jury is out - preposition ➔ adjective
  { match: '#Copula #Adjective? [(out|in|through)]$', group: 0, tag: 'Adjective', reason: 'still-out' },
  // shut the door
  { match: '^[#Adjective] (the|your) #Noun', group: 0, notIf: '(all|even)', tag: 'Infinitive', reason: 'shut-the' },
  // the said card
  { match: 'the [said] #Noun', group: 0, tag: 'Adjective', reason: 'the-said-card' },
  // faith-based, much-appreciated, soft-boiled
  { match: '[#Hyphenated (#Hyphenated && #PastTense)] (#Noun|#Conjunction)', group: 0, tag: 'Adjective', notIf: '#Adverb', reason: 'faith-based' },
  //self-driving
  { match: '[#Hyphenated (#Hyphenated && #Gerund)] (#Noun|#Conjunction)', group: 0, tag: 'Adjective', notIf: '#Adverb', reason: 'self-driving' },
  //dammed-up
  { match: '[#PastTense (#Hyphenated && #PhrasalVerb)] (#Noun|#Conjunction)', group: 0, tag: 'Adjective', reason: 'dammed-up' },
  //two-fold
  { match: '(#Hyphenated && #Value) fold', tag: 'Adjective', reason: 'two-fold' },
  //must-win
  { match: 'must (#Hyphenated && #Infinitive)', tag: 'Adjective', reason: 'must-win' },
  // vacuum-sealed
  { match: `(#Hyphenated && #Infinitive) #Hyphenated`, tag: 'Adjective', notIf: '#PhrasalVerb', reason: 'vacuum-sealed' },

  { match: 'too much', tag: 'Adverb Adjective', reason: 'bit-4' },
  { match: 'a bit much', tag: 'Determiner Adverb Adjective', reason: 'bit-3' },

  // adjective-prefixes - 'un skilled'
  { match: '[(un|contra|extra|inter|intra|macro|micro|mid|mis|mono|multi|pre|sub|tri|ex)] #Adjective', group: 0, tag: ['Adjective', 'Prefix'], reason: 'un-skilled' },

];

const adverbAdj = `(dark|bright|flat|light|soft|pale|dead|dim|faux|little|wee|sheer|most|near|good|extra|all)`;
const noLy = '(hard|fast|late|early|high|right|deep|close|direct)';

var advAdj = [
  // kinda sparkly
  { match: `#Adverb [#Adverb] (and|or|then)`, group: 0, tag: 'Adjective', reason: 'kinda-sparkly-and' },
  // dark green
  { match: `[${adverbAdj}] #Adjective`, group: 0, tag: 'Adverb', reason: 'dark-green' },
  // far too
  { match: `#Copula [far too] #Adjective`, group: 0, tag: 'Adverb', reason: 'far-too' },
  // was still in
  { match: `#Copula [still] (in|#Gerund|#Adjective)`, group: 0, tag: 'Adverb', reason: 'was-still-walking' },
  // studies hard
  { match: `#Plural ${noLy}`, tag: '#PresentTense #Adverb', reason: 'studies-hard' },
  // shops direct
  {
    match: `#Verb [${noLy}] !#Noun?`,
    group: 0,
    notIf: '(#Copula|get|got|getting|become|became|becoming|feel|feels|feeling|#Determiner|#Preposition)',
    tag: 'Adverb',
    reason: 'shops-direct',
  },
  // studies a lot
  { match: `[#Plural] a lot`, tag: 'PresentTense', reason: 'studies-a-lot' },
];

// Gerund-Adjectives - 'amusing, annoying'
var gerundAdj = [
  //a staggering cost
  // { match: '(a|an) [#Gerund]', group: 0, tag: 'Adjective', reason: 'a|an' },
  //as amusing as
  { match: 'as [#Gerund] as', group: 0, tag: 'Adjective', reason: 'as-gerund-as' },
  // more amusing than
  { match: 'more [#Gerund] than', group: 0, tag: 'Adjective', reason: 'more-gerund-than' },
  // very amusing
  { match: '(so|very|extremely) [#Gerund]', group: 0, tag: 'Adjective', reason: 'so-gerund' },
  // found it amusing
  { match: '(found|found) it #Adverb? [#Gerund]', group: 0, tag: 'Adjective', reason: 'found-it-gerund' },
  // a bit amusing
  { match: 'a (little|bit|wee) bit? [#Gerund]', group: 0, tag: 'Adjective', reason: 'a-bit-gerund' },
  // looking annoying
  {
    match: '#Gerund [#Gerund]',
    group: 0,
    tag: 'Adjective',
    notIf: '(impersonating|practicing|considering|assuming)',
    reason: 'looking-annoying',
  },
  // looked amazing
  {
    match: '(looked|look|looks) #Adverb? [%Adj|Gerund%]',
    group: 0,
    tag: 'Adjective',
    notIf: '(impersonating|practicing|considering|assuming)',
    reason: 'looked-amazing',
  },
  // were really amazing
  // { match: '(looked|look|looks) #Adverb [%Adj|Gerund%]', group: 0, tag: 'Adjective', notIf: '(impersonating|practicing|considering|assuming)', reason: 'looked-amazing' },
  // developing a
  { match: '[%Adj|Gerund%] #Determiner', group: 0, tag: 'Gerund', reason: 'developing-a' },
  // world's leading manufacturer
  { match: '#Possessive [%Adj|Gerund%] #Noun', group: 0, tag: 'Adjective', reason: 'leading-manufacturer' },
  // meaning alluring
  { match: '%Noun|Gerund% %Adj|Gerund%', tag: 'Gerund #Adjective', reason: 'meaning-alluring' },

  // face shocking revelations
  {
    match: '(face|embrace|reveal|stop|start|resume) %Adj|Gerund%',
    tag: '#PresentTense #Adjective',
    reason: 'face-shocking',
  },
  // are enduring symbols
  { match: '(are|were) [%Adj|Gerund%] #Plural', group: 0, tag: 'Adjective', reason: 'are-enduring-symbols' },
];

var nounAdj = [
  //the above is clear
  { match: '#Determiner [#Adjective] #Copula', group: 0, tag: 'Noun', reason: 'the-adj-is' },
  //real evil is
  { match: '#Adjective [#Adjective] #Copula', group: 0, tag: 'Noun', reason: 'adj-adj-is' },
  //his fine
  { match: '(his|its) [%Adj|Noun%]', group: 0, tag: 'Noun', notIf: '#Hyphenated', reason: 'his-fine' },
  //is all
  { match: '#Copula #Adverb? [all]', group: 0, tag: 'Noun', reason: 'is-all' },
  // have fun
  { match: `(have|had) [#Adjective] #Preposition .`, group: 0, tag: 'Noun', reason: 'have-fun' },
  // brewing giant
  { match: `#Gerund (giant|capital|center|zone|application)`, tag: 'Noun', reason: 'brewing-giant' },
  // in an instant
  { match: `#Preposition (a|an) [#Adjective]$`, group: 0, tag: 'Noun', reason: 'an-instant' },
  // no golden would
  { match: `no [#Adjective] #Modal`, group: 0, tag: 'Noun', reason: 'no-golden' },
  // brand new
  { match: `[brand #Gerund?] new`, group: 0, tag: 'Adverb', reason: 'brand-new' },
  // some kind
  { match: `(#Determiner|#Comparative|new|different) [kind]`, group: 0, tag: 'Noun', reason: 'some-kind' },
  // her favourite sport
  { match: `#Possessive [%Adj|Noun%] #Noun`, group: 0, tag: 'Adjective', reason: 'her-favourite' },
  // must-win
  { match: `must && #Hyphenated .`, tag: 'Adjective', reason: 'must-win' },
  // the present
  {
    match: `#Determiner [#Adjective]$`,
    tag: 'Noun',
    notIf: '(this|that|#Comparative|#Superlative)',
    reason: 'the-south',
  }, //are that crazy.
  // company-wide
  {
    match: `(#Noun && #Hyphenated) (#Adjective && #Hyphenated)`,
    tag: 'Adjective',
    notIf: '(this|that|#Comparative|#Superlative)',
    reason: 'company-wide',
  },
  // the poor were
  {
    match: `#Determiner [#Adjective] (#Copula|#Determiner)`,
    notIf: '(#Comparative|#Superlative)',
    group: 0,
    tag: 'Noun',
    reason: 'the-poor',
  },
  // professional bodybuilder
  {
    match: `[%Adj|Noun%] #Noun`,
    notIf: '(#Pronoun|#ProperNoun)',
    group: 0,
    tag: 'Adjective',
    reason: 'stable-foundations',
  },
];

var adjVerb = [
  // amusing his aunt
  // { match: '[#Adjective] #Possessive #Noun', group: 0, tag: 'Verb', reason: 'gerund-his-noun' },
  // loving you
  // { match: '[#Adjective] (us|you)', group: 0, tag: 'Gerund', reason: 'loving-you' },
  // slowly stunning
  { match: '(slowly|quickly) [#Adjective]', group: 0, tag: 'Verb', reason: 'slowly-adj' },
  // does mean
  { match: 'does (#Adverb|not)? [#Adjective]', group: 0, tag: 'PresentTense', reason: 'does-mean' },
  // okay by me
  { match: '[(fine|okay|cool|ok)] by me', group: 0, tag: 'Adjective', reason: 'okay-by-me' },
  // i mean
  { match: 'i (#Adverb|do)? not? [mean]', group: 0, tag: 'PresentTense', reason: 'i-mean' },
  //will secure our
  { match: 'will #Adjective', tag: 'Auxiliary Infinitive', reason: 'will-adj' },
  //he disguised the thing
  { match: '#Pronoun [#Adjective] #Determiner #Adjective? #Noun', group: 0, tag: 'Verb', reason: 'he-adj-the' },
  //is eager to go
  { match: '#Copula [%Adj|Present%] to #Verb', group: 0, tag: 'Verb', reason: 'adj-to' },
  //is done well
  { match: '#Copula [#Adjective] (well|badly|quickly|slowly)', group: 0, tag: 'Verb', reason: 'done-well' },
  // rude and insulting
  { match: '#Adjective and [#Gerund] !#Preposition?', group: 0, tag: 'Adjective', reason: 'rude-and-x' },
  // were over cooked
  { match: '#Copula #Adverb? (over|under) [#PastTense]', group: 0, tag: 'Adjective', reason: 'over-cooked' },
  // was bland and overcooked
  { match: '#Copula #Adjective+ (and|or) [#PastTense]$', group: 0, tag: 'Adjective', reason: 'bland-and-overcooked' },
  // got tired of
  { match: 'got #Adverb? [#PastTense] of', group: 0, tag: 'Adjective', reason: 'got-tired-of' },
  //felt loved
  {
    match:
      '(seem|seems|seemed|appear|appeared|appears|feel|feels|felt|sound|sounds|sounded) (#Adverb|#Adjective)? [#PastTense]',
    group: 0,
    tag: 'Adjective',
    reason: 'felt-loved',
  },
  // seem confused
  { match: '(seem|feel|seemed|felt) [#PastTense #Particle?]', group: 0, tag: 'Adjective', reason: 'seem-confused' },
  // a bit confused
  { match: 'a (bit|little|tad) [#PastTense #Particle?]', group: 0, tag: 'Adjective', reason: 'a-bit-confused' },
  // do not be embarrassed
  { match: 'not be [%Adj|Past% #Particle?]', group: 0, tag: 'Adjective', reason: 'do-not-be-confused' },
  // is just right
  { match: '#Copula just [%Adj|Past% #Particle?]', group: 0, tag: 'Adjective', reason: 'is-just-right' },
  // as pale as
  { match: 'as [#Infinitive] as', group: 0, tag: 'Adjective', reason: 'as-pale-as' },
  //failed and oppressive
  { match: '[%Adj|Past%] and #Adjective', group: 0, tag: 'Adjective', reason: 'faled-and-oppressive' },
  // or heightened emotion
  {
    match: 'or [#PastTense] #Noun',
    group: 0,
    tag: 'Adjective',
    notIf: '(#Copula|#Pronoun)',
    reason: 'or-heightened-emotion',
  },
  // became involved
  { match: '(become|became|becoming|becomes) [#Verb]', group: 0, tag: 'Adjective', reason: 'become-verb' },
  // their declared intentions
  { match: '#Possessive [#PastTense] #Noun', group: 0, tag: 'Adjective', reason: 'declared-intentions' },
  // is he cool
  { match: '#Copula #Pronoun [%Adj|Present%]', group: 0, tag: 'Adjective', reason: 'is-he-cool' },
  // is crowded with
  {
    match: '#Copula [%Adj|Past%] with',
    group: 0,
    tag: 'Adjective',
    notIf: '(associated|worn|baked|aged|armed|bound|fried|loaded|mixed|packed|pumped|filled|sealed)',
    reason: 'is-crowded-with',
  },
  // is empty$
  { match: '#Copula #Adverb? [%Adj|Present%]$', group: 0, tag: 'Adjective', reason: 'was-empty$' },
];

// const adverbAdj = '(dark|bright|flat|light|soft|pale|dead|dim|faux|little|wee|sheer|most|near|good|extra|all)'

var adv = [
  //still good
  { match: '[still] #Adjective', group: 0, tag: 'Adverb', reason: 'still-advb' },
  //still make
  { match: '[still] #Verb', group: 0, tag: 'Adverb', reason: 'still-verb' },
  // so hot
  { match: '[so] #Adjective', group: 0, tag: 'Adverb', reason: 'so-adv' },
  // way hotter
  { match: '[way] #Comparative', group: 0, tag: 'Adverb', reason: 'way-adj' },
  // way too hot
  { match: '[way] #Adverb #Adjective', group: 0, tag: 'Adverb', reason: 'way-too-adj' },
  // all singing
  { match: '[all] #Verb', group: 0, tag: 'Adverb', reason: 'all-verb' },
  // sing like an angel
  { match: '#Verb  [like]', group: 0, notIf: '(#Modal|#PhrasalVerb)', tag: 'Adverb', reason: 'verb-like' },
  //barely even walk
  { match: '(barely|hardly) even', tag: 'Adverb', reason: 'barely-even' },
  //even held
  { match: '[even] #Verb', group: 0, tag: 'Adverb', reason: 'even-walk' },
  //even worse
  { match: '[even] #Comparative', group: 0, tag: 'Adverb', reason: 'even-worse' },
  // even the greatest
  { match: '[even] (#Determiner|#Possessive)', group: 0, tag: '#Adverb', reason: 'even-the' },
  // even left
  { match: 'even left', tag: '#Adverb #Verb', reason: 'even-left' },
  // way over
  { match: '[way] #Adjective', group: 0, tag: '#Adverb', reason: 'way-over' },
  //cheering hard - dropped -ly's
  {
    match: '#PresentTense [(hard|quick|bright|slow|fast|backwards|forwards)]',
    notIf: '#Copula',
    group: 0,
    tag: 'Adverb',
    reason: 'lazy-ly',
  },
  // much appreciated
  { match: '[much] #Adjective', group: 0, tag: 'Adverb', reason: 'bit-1' },
  // is well
  { match: '#Copula [#Adverb]$', group: 0, tag: 'Adjective', reason: 'is-well' },
  // a bit cold
  { match: 'a [(little|bit|wee) bit?] #Adjective', group: 0, tag: 'Adverb', reason: 'a-bit-cold' },
  // super strong
  { match: `[(super|pretty)] #Adjective`, group: 0, tag: 'Adverb', reason: 'super-strong' },
  // become overly weakened
  { match: '(become|fall|grow) #Adverb? [#PastTense]', group: 0, tag: 'Adjective', reason: 'overly-weakened' },
  // a completely beaten man
  { match: '(a|an) #Adverb [#Participle] #Noun', group: 0, tag: 'Adjective', reason: 'completely-beaten' },
  //a close
  { match: '#Determiner #Adverb? [close]', group: 0, tag: 'Adjective', reason: 'a-close' },
  //walking close
  { match: '#Gerund #Adverb? [close]', group: 0, tag: 'Adverb', notIf: '(getting|becoming|feeling)', reason: 'being-close' },
  // a blown motor
  { match: '(the|those|these|a|an) [#Participle] #Noun', group: 0, tag: 'Adjective', reason: 'blown-motor' },
  // charged back
  { match: '(#PresentTense|#PastTense) [back]', group: 0, tag: 'Adverb', notIf: '(#PhrasalVerb|#Copula)', reason: 'charge-back' },
  // send around
  { match: '#Verb [around]', group: 0, tag: 'Adverb', notIf: '#PhrasalVerb', reason: 'send-around' },
  // later say
  { match: '[later] #PresentTense', group: 0, tag: 'Adverb', reason: 'later-say' },
  // the well
  { match: '#Determiner [well] !#PastTense?', group: 0, tag: 'Noun', reason: 'the-well' },
  // high enough
  { match: '#Adjective [enough]', group: 0, tag: 'Adverb', reason: 'high-enough' },
];

var dates = [
  // ==== Holiday ====
  { match: '#Holiday (day|eve)', tag: 'Holiday', reason: 'holiday-day' },
  //5th of March
  { match: '#Value of #Month', tag: 'Date', reason: 'value-of-month' },
  //5 March
  { match: '#Cardinal #Month', tag: 'Date', reason: 'cardinal-month' },
  //march 5 to 7
  { match: '#Month #Value to #Value', tag: 'Date', reason: 'value-to-value' },
  //march the 12th
  { match: '#Month the #Value', tag: 'Date', reason: 'month-the-value' },
  //june 7
  { match: '(#WeekDay|#Month) #Value', tag: 'Date', reason: 'date-value' },
  //7 june
  { match: '#Value (#WeekDay|#Month)', tag: 'Date', reason: 'value-date' },
  //may twenty five
  { match: '(#TextValue && #Date) #TextValue', tag: 'Date', reason: 'textvalue-date' },
  // 'aug 20-21'
  { match: `#Month #NumberRange`, tag: 'Date', reason: 'aug 20-21' },
  // wed march 5th
  { match: `#WeekDay #Month #Ordinal`, tag: 'Date', reason: 'week mm-dd' },
  // aug 5th 2021
  { match: `#Month #Ordinal #Cardinal`, tag: 'Date', reason: 'mm-dd-yyy' },

  // === timezones ===
  // china standard time
  { match: `(#Place|#Demonmym|#Time) (standard|daylight|central|mountain)? time`, tag: 'Timezone', reason: 'std-time' },
  // eastern time
  {
    match: `(eastern|mountain|pacific|central|atlantic) (standard|daylight|summer)? time`,
    tag: 'Timezone',
    reason: 'eastern-time',
  },
  // 5pm central
  { match: `#Time [(eastern|mountain|pacific|central|est|pst|gmt)]`, group: 0, tag: 'Timezone', reason: '5pm-central' },
  // central european time
  { match: `(central|western|eastern) european time`, tag: 'Timezone', reason: 'cet' },
];

var ambigDates = [
  // ==== WeekDay ====
  // sun the 5th
  { match: '[sun] the #Ordinal', tag: 'WeekDay', reason: 'sun-the-5th' },
  //sun feb 2
  { match: '[sun] #Date', group: 0, tag: 'WeekDay', reason: 'sun-feb' },
  //1pm next sun
  { match: '#Date (on|this|next|last|during)? [sun]', group: 0, tag: 'WeekDay', reason: '1pm-sun' },
  //this sat
  { match: `(in|by|before|during|on|until|after|of|within|all) [sat]`, group: 0, tag: 'WeekDay', reason: 'sat' },
  { match: `(in|by|before|during|on|until|after|of|within|all) [wed]`, group: 0, tag: 'WeekDay', reason: 'wed' },
  { match: `(in|by|before|during|on|until|after|of|within|all) [march]`, group: 0, tag: 'Month', reason: 'march' },
  //sat november
  { match: '[sat] #Date', group: 0, tag: 'WeekDay', reason: 'sat-feb' },

  // ==== Month ====
  //all march
  { match: `#Preposition [(march|may)]`, group: 0, tag: 'Month', reason: 'in-month' },
  //this march
  { match: `(this|next|last) (march|may) !#Infinitive?`, tag: '#Date #Month', reason: 'this-month' },
  // march 5th
  { match: `(march|may) the? #Value`, tag: '#Month #Date #Date', reason: 'march-5th' },
  // 5th of march
  { match: `#Value of? (march|may)`, tag: '#Date #Date #Month', reason: '5th-of-march' },
  // march and feb
  { match: `[(march|may)] .? #Date`, group: 0, tag: 'Month', reason: 'march-and-feb' },
  // feb to march
  { match: `#Date .? [(march|may)]`, group: 0, tag: 'Month', reason: 'feb-and-march' },
  //quickly march
  { match: `#Adverb [(march|may)]`, group: 0, tag: 'Verb', reason: 'quickly-march' },
  //march quickly
  { match: `[(march|may)] #Adverb`, group: 0, tag: 'Verb', reason: 'march-quickly' },
  //12 am
  { match: `#Value (am|pm)`, tag: 'Time', reason: '2-am' },
];

const infNouns =
  '(feel|sense|process|rush|side|bomb|bully|challenge|cover|crush|dump|exchange|flow|function|issue|lecture|limit|march|process)';
var noun = [
  //'more' is not always an adverb
  // any more
  { match: '(the|any) [more]', group: 0, tag: 'Singular', reason: 'more-noun' },
  // more players
  { match: '[more] #Noun', group: 0, tag: 'Adjective', reason: 'more-noun' },
  // rights of man
  { match: '(right|rights) of .', tag: 'Noun', reason: 'right-of' },
  // a bit
  { match: 'a [bit]', group: 0, tag: 'Singular', reason: 'bit-2' },
  // a must
  { match: 'a [must]', group: 0, tag: 'Singular', reason: 'must-2' },
  // we all
  { match: '(we|us) [all]', group: 0, tag: 'Noun', reason: 'we all' },
  // due to weather
  { match: 'due to [#Verb]', group: 0, tag: 'Noun', reason: 'due-to' },

  //some pressing issues
  { match: 'some [#Verb] #Plural', group: 0, tag: 'Noun', reason: 'determiner6' },
  // my first thought
  { match: '#Possessive #Ordinal [#PastTense]', group: 0, tag: 'Noun', reason: 'first-thought' },
  //the nice swim
  {
    match: '(the|this|those|these) #Adjective [%Verb|Noun%]',
    group: 0,
    tag: 'Noun',
    notIf: '#Copula',
    reason: 'the-adj-verb',
  },
  // the truly nice swim
  { match: '(the|this|those|these) #Adverb #Adjective [#Verb]', group: 0, tag: 'Noun', reason: 'determiner4' },
  //the wait to vote
  { match: 'the [#Verb] #Preposition .', group: 0, tag: 'Noun', reason: 'determiner1' },
  //a sense of
  { match: '(a|an|the) [#Verb] of', group: 0, tag: 'Noun', reason: 'the-verb-of' },
  //the threat of force
  { match: '#Determiner #Noun of [#Verb]', group: 0, tag: 'Noun', notIf: '#Gerund', reason: 'noun-of-noun' },
  // ended in ruins
  {
    match: '#PastTense #Preposition [#PresentTense]',
    group: 0,
    notIf: '#Gerund',
    tag: 'Noun',
    reason: 'ended-in-ruins',
  },
  //'u' as pronoun
  { match: '#Conjunction [u]', group: 0, tag: 'Pronoun', reason: 'u-pronoun-2' },
  { match: '[u] #Verb', group: 0, tag: 'Pronoun', reason: 'u-pronoun-1' },
  //the western line
  {
    match: '#Determiner [(western|eastern|northern|southern|central)] #Noun',
    group: 0,
    tag: 'Noun',
    reason: 'western-line',
  },
  //air-flow
  { match: '(#Singular && @hasHyphen) #PresentTense', tag: 'Noun', reason: 'hyphen-verb' },
  //is no walk
  { match: 'is no [#Verb]', group: 0, tag: 'Noun', reason: 'is-no-verb' },
  //do so
  { match: 'do [so]', group: 0, tag: 'Noun', reason: 'so-noun' },
  // what the hell
  { match: '#Determiner [(shit|damn|hell)]', group: 0, tag: 'Noun', reason: 'swears-noun' },
  // go to shit
  { match: 'to [(shit|hell)]', group: 0, tag: 'Noun', reason: 'to-swears' },
  // the staff were
  { match: '(the|these) [#Singular] (were|are)', group: 0, tag: 'Plural', reason: 'singular-were' },
  // a comdominium, or simply condo
  { match: `a #Noun+ or #Adverb+? [#Verb]`, group: 0, tag: 'Noun', reason: 'noun-or-noun' },
  // walk the walk
  {
    match: '(the|those|these|a|an) #Adjective? [#PresentTense #Particle?]',
    group: 0,
    tag: 'Noun',
    notIf: '(seem|appear|include|#Gerund|#Copula)',
    reason: 'det-inf',
  },
  // { match: '(the|those|these|a|an) #Adjective? [#PresentTense #Particle?]', group: 0, tag: 'Noun', notIf: '(#Gerund|#Copula)', reason: 'det-pres' },

  // ==== Actor ====
  //Aircraft designer
  { match: '#Noun #Actor', tag: 'Actor', notIf: '(#Person|#Pronoun)', reason: 'thing-doer' },
  //lighting designer
  { match: '#Gerund #Actor', tag: 'Actor', reason: 'gerund-doer' },
  // captain sanders
  // { match: '[#Actor+] #ProperNoun', group: 0, tag: 'Honorific', reason: 'sgt-kelly' },
  // co-founder
  { match: `co #Singular`, tag: 'Actor', reason: 'co-noun' },
  // co-founder
  {
    match: `[#Noun+] #Actor`,
    group: 0,
    tag: 'Actor',
    notIf: '(#Honorific|#Pronoun|#Possessive)',
    reason: 'air-traffic-controller',
  },
  // fine-artist
  {
    match: `(urban|cardiac|cardiovascular|respiratory|medical|clinical|visual|graphic|creative|dental|exotic|fine|certified|registered|technical|virtual|professional|amateur|junior|senior|special|pharmaceutical|theoretical)+ #Noun? #Actor`,
    tag: 'Actor',
    reason: 'fine-artist',
  },
  // dance coach
  {
    match: `#Noun+ (coach|chef|king|engineer|fellow|personality|boy|girl|man|woman|master)`,
    tag: 'Actor',
    reason: 'dance-coach',
  },
  // chief design officer
  { match: `chief . officer`, tag: 'Actor', reason: 'chief-x-officer' },
  // chief of police
  { match: `chief of #Noun+`, tag: 'Actor', reason: 'chief-of-police' },
  // president of marketing
  { match: `senior? vice? president of #Noun+`, tag: 'Actor', reason: 'president-of' },

  // ==== Singular ====
  //the sun
  { match: '#Determiner [sun]', group: 0, tag: 'Singular', reason: 'the-sun' },
  //did a 900, paid a 20
  { match: '#Verb (a|an) [#Value]$', group: 0, tag: 'Singular', reason: 'did-a-value' },
  //'the can'
  { match: 'the [(can|will|may)]', group: 0, tag: 'Singular', reason: 'the can' },

  // ==== Possessive ====
  //spencer kelly's
  { match: '#FirstName #Acronym? (#Possessive && #LastName)', tag: 'Possessive', reason: 'name-poss' },
  //Super Corp's fundraiser
  { match: '#Organization+ #Possessive', tag: 'Possessive', reason: 'org-possessive' },
  //Los Angeles's fundraiser
  { match: '#Place+ #Possessive', tag: 'Possessive', reason: 'place-possessive' },
  // Ptolemy's experiments
  { match: '#Possessive #PresentTense #Particle?', notIf: '(#Gerund|her)', tag: 'Noun', reason: 'possessive-verb' }, // anna's eating vs anna's eating lunch
  // my presidents house
  { match: '(my|our|their|her|his|its) [(#Plural && #Actor)] #Noun', tag: 'Possessive', reason: 'my-dads' },

  // 10th of a second
  { match: '#Value of a [second]', group: 0, unTag: 'Value', tag: 'Singular', reason: '10th-of-a-second' },
  // 10 seconds
  { match: '#Value [seconds]', group: 0, unTag: 'Value', tag: 'Plural', reason: '10-seconds' },
  // in time
  { match: 'in [#Infinitive]', group: 0, tag: 'Singular', reason: 'in-age' },
  // a minor in
  { match: 'a [#Adjective] #Preposition', group: 0, tag: 'Noun', reason: 'a-minor-in' },
  //the repairer said
  { match: '#Determiner [#Singular] said', group: 0, tag: 'Actor', reason: 'the-actor-said' },
  //the euro sense
  {
    match: `#Determiner #Noun [${infNouns}] !(#Preposition|to|#Adverb)?`,
    group: 0,
    tag: 'Noun',
    reason: 'the-noun-sense',
  },
  // photographs of a computer are
  { match: '[#PresentTense] (of|by|for) (a|an|the) #Noun #Copula', group: 0, tag: 'Plural', reason: 'photographs-of' },
  // fight and win
  { match: '#Infinitive and [%Noun|Verb%]', group: 0, tag: 'Infinitive', reason: 'fight and win' },
  // peace and flowers and love
  { match: '#Noun and [#Verb] and #Noun', group: 0, tag: 'Noun', reason: 'peace-and-flowers' },
  // the 1992 classic
  { match: 'the #Cardinal [%Adj|Noun%]', group: 0, tag: 'Noun', reason: 'the-1992-classic' },
  // the premier university
  { match: '#Copula the [%Adj|Noun%] #Noun', group: 0, tag: 'Adjective', reason: 'the-premier-university' },

  // scottish - i ate me sandwich
  { match: 'i #Verb [me] #Noun', group: 0, tag: 'Possessive', reason: 'scottish-me' },
  // dance music
  {
    match: '[#PresentTense] (music|class|lesson|night|party|festival|league|ceremony)',
    group: 0,
    tag: 'Noun',
    reason: 'dance-music',
  },
  // wit it
  { match: '[wit] (me|it)', group: 0, tag: 'Presposition', reason: 'wit-me' },
  //left-her-boots, shoved her hand
  { match: '#PastTense #Possessive [#Verb]', group: 0, tag: 'Noun', notIf: '(saw|made)', reason: 'left-her-boots' },
  //35 signs
  { match: '#Value [%Plural|Verb%]', group: 0, tag: 'Plural', notIf: '(one|1|a|an)', reason: '35-signs' },
  //had time
  { match: 'had [#PresentTense]', group: 0, tag: 'Noun', notIf: '(#Gerund|come|become)', reason: 'had-time' },
  //instant access
  { match: '%Adj|Noun% %Noun|Verb%', tag: '#Adjective #Noun', notIf: '#ProperNoun #Noun', reason: 'instant-access' },
  // a representative to
  { match: '#Determiner [%Adj|Noun%] #Conjunction', group: 0, tag: 'Noun', reason: 'a-rep-to' },
  // near death experiences, ambitious sales targets
  {
    match: '#Adjective #Noun [%Plural|Verb%]$',
    group: 0,
    tag: 'Plural',
    notIf: '#Pronoun',
    reason: 'near-death-experiences',
  },
  // your guild colors
  { match: '#Possessive #Noun [%Plural|Verb%]$', group: 0, tag: 'Plural', reason: 'your-guild-colors' },
];

var gerundNouns = [
  // the planning processes
  { match: '(this|that|the|a|an) [#Gerund #Infinitive]', group: 0, tag: 'Singular', reason: 'the-planning-process' },
  // the paving stones
  { match: '(that|the) [#Gerund #PresentTense]', group: 0, ifNo: '#Copula', tag: 'Plural', reason: 'the-paving-stones' },
  // this swimming
  // { match: '(this|that|the) [#Gerund]', group: 0, tag: 'Noun', reason: 'this-gerund' },
  // the remaining claims
  { match: '#Determiner [#Gerund] #Noun', group: 0, tag: 'Adjective', reason: 'the-gerund-noun' },
  // i think tipping sucks
  { match: `#Pronoun #Infinitive [#Gerund] #PresentTense`, group: 0, tag: 'Noun', reason: 'tipping-sucks' },
  // early warning
  { match: '#Adjective [#Gerund]', group: 0, tag: 'Noun', notIf: '(still|even|just)', reason: 'early-warning' },
  //walking is cool
  { match: '[#Gerund] #Adverb? not? #Copula', group: 0, tag: 'Activity', reason: 'gerund-copula' },
  //are doing is
  { match: '#Copula [(#Gerund|#Activity)] #Copula', group: 0, tag: 'Gerund', reason: 'are-doing-is' },
  //walking should be fun
  { match: '[#Gerund] #Modal', group: 0, tag: 'Activity', reason: 'gerund-modal' },
  // finish listening
  // { match: '#Infinitive [#Gerund]', group: 0, tag: 'Activity', reason: 'finish-listening' },
  // the ruling party

  // responsibility for setting
  { match: '#Singular for [%Noun|Gerund%]', group: 0, tag: 'Gerund', reason: 'noun-for-gerund' },
  // better for training
  { match: '#Comparative (for|at) [%Noun|Gerund%]', group: 0, tag: 'Gerund', reason: 'better-for-gerund' },
  // keep the touching
  { match: '#PresentTense the [#Gerund]', group: 0, tag: 'Noun', reason: 'keep-the-touching' },
];

var presNouns = [
  // do the dance
  { match: '#Infinitive (this|that|the) [#Infinitive]', group: 0, tag: 'Noun', reason: 'do-this-dance' },
  //running-a-show
  { match: '#Gerund #Determiner [#Infinitive]', group: 0, tag: 'Noun', reason: 'running-a-show' },
  //the-only-reason
  { match: '#Determiner (only|further|just|more|backward) [#Infinitive]', group: 0, tag: 'Noun', reason: 'the-only-reason' },
  // a stream runs
  { match: '(the|this|a|an) [#Infinitive] #Adverb? #Verb', group: 0, tag: 'Noun', reason: 'determiner5' },
  //a nice deal
  { match: '#Determiner #Adjective #Adjective? [#Infinitive]', group: 0, tag: 'Noun', reason: 'a-nice-inf' },
  // the mexican train
  { match: '#Determiner #Demonym [#PresentTense]', group: 0, tag: 'Noun', reason: 'mexican-train' },
  //next career move
  { match: '#Adjective #Noun+ [#Infinitive] #Copula', group: 0, tag: 'Noun', reason: 'career-move' },
  // at some point
  { match: 'at some [#Infinitive]', group: 0, tag: 'Noun', reason: 'at-some-inf' },
  // goes to sleep
  { match: '(go|goes|went) to [#Infinitive]', group: 0, tag: 'Noun', reason: 'goes-to-verb' },
  //a close watch on
  { match: '(a|an) #Adjective? #Noun [#Infinitive] (#Preposition|#Noun)', group: 0, notIf: 'from', tag: 'Noun', reason: 'a-noun-inf' },
  //a tv show
  { match: '(a|an) #Noun [#Infinitive]$', group: 0, tag: 'Noun', reason: 'a-noun-inf2' },
  //is mark hughes
  // { match: '#Copula [#Infinitive] #Noun', group: 0, tag: 'Noun', reason: 'is-pres-noun' },
  // good wait staff
  // { match: '#Adjective [#Infinitive] #Noun', group: 0, tag: 'Noun', reason: 'good-wait-staff' },
  // running for congress
  { match: '#Gerund #Adjective? for [#Infinitive]', group: 0, tag: 'Noun', reason: 'running-for' },
  // running to work
  // { match: '#Gerund #Adjective to [#Infinitive]', group: 0, tag: 'Noun', reason: 'running-to' },
  // about love
  { match: 'about [#Infinitive]', group: 0, tag: 'Singular', reason: 'about-love' },
  // singers on stage
  { match: '#Plural on [#Infinitive]', group: 0, tag: 'Noun', reason: 'on-stage' },
  // any charge
  { match: 'any [#Infinitive]', group: 0, tag: 'Noun', reason: 'any-charge' },
  // no doubt
  { match: 'no [#Infinitive]', group: 0, tag: 'Noun', reason: 'no-doubt' },
  // number of seats
  { match: 'number of [#PresentTense]', group: 0, tag: 'Noun', reason: 'number-of-x' },
  // teaches/taught
  { match: '(taught|teaches|learns|learned) [#PresentTense]', group: 0, tag: 'Noun', reason: 'teaches-x' },
  // use reverse
  { match: '(try|use|attempt|build|make) [#Verb #Particle?]', notIf: '(#Copula|#Noun|sure|fun|up)', group: 0, tag: 'Noun', reason: 'do-verb' },//make sure of
  // checkmate is
  { match: '^[#Infinitive] (is|was)', group: 0, tag: 'Noun', reason: 'checkmate-is' },
  // get much sleep
  { match: '#Infinitive much [#Infinitive]', group: 0, tag: 'Noun', reason: 'get-much' },
  // cause i gotta
  { match: '[cause] #Pronoun #Verb', group: 0, tag: 'Conjunction', reason: 'cause-cuz' },
  // the cardio dance party
  { match: 'the #Singular [#Infinitive] #Noun', group: 0, tag: 'Noun', notIf: '#Pronoun', reason: 'cardio-dance' },

  // that should smoke
  { match: '#Determiner #Modal [#Noun]', group: 0, tag: 'PresentTense', reason: 'should-smoke' },
  //this rocks
  { match: 'this [#Plural]', group: 0, tag: 'PresentTense', notIf: '(#Preposition|#Date)', reason: 'this-verbs' },
  //voice that rocks
  { match: '#Noun that [#Plural]', group: 0, tag: 'PresentTense', notIf: '(#Preposition|#Pronoun|way)', reason: 'voice-that-rocks' },
  //that leads to
  { match: 'that [#Plural] to', group: 0, tag: 'PresentTense', notIf: '#Preposition', reason: 'that-leads-to' },
  //let him glue
  {
    match: '(let|make|made) (him|her|it|#Person|#Place|#Organization)+ [#Singular] (a|an|the|it)',
    group: 0,
    tag: 'Infinitive',
    reason: 'let-him-glue',
  },

  // assign all tasks
  { match: '#Verb (all|every|each|most|some|no) [#PresentTense]', notIf: '#Modal', group: 0, tag: 'Noun', reason: 'all-presentTense' },  // PresentTense/Noun ambiguities
  // big dreams, critical thinking
  // have big dreams
  { match: '(had|have|#PastTense) #Adjective [#PresentTense]', group: 0, tag: 'Noun', notIf: 'better', reason: 'adj-presentTense' },
  // excellent answer spencer
  // { match: '^#Adjective [#PresentTense]', group: 0, tag: 'Noun', reason: 'start adj-presentTense' },
  // one big reason
  { match: '#Value #Adjective [#PresentTense]', group: 0, tag: 'Noun', notIf: '#Copula', reason: 'one-big-reason' },
  // won widespread support
  { match: '#PastTense #Adjective+ [#PresentTense]', group: 0, tag: 'Noun', notIf: '(#Copula|better)', reason: 'won-wide-support' },
  // many poses
  { match: '(many|few|several|couple) [#PresentTense]', group: 0, tag: 'Noun', notIf: '#Copula', reason: 'many-poses' },
  // very big dreams
  { match: '#Determiner #Adverb #Adjective [%Noun|Verb%]', group: 0, tag: 'Noun', notIf: '#Copula', reason: 'very-big-dream' },
  // from start to finish
  { match: 'from #Noun to [%Noun|Verb%]', group: 0, tag: 'Noun', reason: 'start-to-finish' },
  // for comparison or contrast
  { match: '(for|with|of) #Noun (and|or|not) [%Noun|Verb%]', group: 0, tag: 'Noun', notIf: '#Pronoun', reason: 'for-food-and-gas' },
  // adorable little store
  { match: '#Adjective #Adjective [#PresentTense]', group: 0, tag: 'Noun', notIf: '#Copula', reason: 'adorable-little-store' },
  // of basic training
  // { match: '#Preposition #Adjective [#PresentTense]', group: 0, tag: 'Noun', reason: 'of-basic-training' },
  // justifiying higher costs
  { match: '#Gerund #Adverb? #Comparative [#PresentTense]', group: 0, tag: 'Noun', notIf: '#Copula', reason: 'higher-costs' },

  { match: '(#Noun && @hasComma) #Noun (and|or) [#PresentTense]', group: 0, tag: 'Noun', notIf: '#Copula', reason: 'noun-list' },

  // any questions for
  { match: '(many|any|some|several) [#PresentTense] for', group: 0, tag: 'Noun', reason: 'any-verbs-for' },
  // to facilitate gas exchange with
  { match: `to #PresentTense #Noun [#PresentTense] #Preposition`, group: 0, tag: 'Noun', reason: 'gas-exchange' },
  // waited until release
  { match: `#PastTense (until|as|through|without) [#PresentTense]`, group: 0, tag: 'Noun', reason: 'waited-until-release' },
  // selling like hot cakes
  { match: `#Gerund like #Adjective? [#PresentTense]`, group: 0, tag: 'Plural', reason: 'like-hot-cakes' },
  // some valid reason
  { match: `some #Adjective [#PresentTense]`, group: 0, tag: 'Noun', reason: 'some-reason' },
  // for some reason
  { match: `for some [#PresentTense]`, group: 0, tag: 'Noun', reason: 'for-some-reason' },
  // same kind of shouts
  { match: `(same|some|the|that|a) kind of [#PresentTense]`, group: 0, tag: 'Noun', reason: 'some-kind-of' },
  // a type of shout
  { match: `(same|some|the|that|a) type of [#PresentTense]`, group: 0, tag: 'Noun', reason: 'some-type-of' },
  // doing better for fights
  { match: `#Gerund #Adjective #Preposition [#PresentTense]`, group: 0, tag: 'Noun', reason: 'doing-better-for-x' },
  // get better aim
  { match: `(get|got|have) #Comparative [#PresentTense]`, group: 0, tag: 'Noun', reason: 'got-better-aim' },
  // whose name was
  { match: 'whose [#PresentTense] #Copula', group: 0, tag: 'Noun', reason: 'whos-name-was' },
  // give up on reason
  { match: `#PhrasalVerb #Particle #Preposition [#PresentTense]`, group: 0, tag: 'Noun', reason: 'given-up-on-x' },
  //there are reasons
  { match: 'there (are|were) #Adjective? [#PresentTense]', group: 0, tag: 'Plural', reason: 'there-are' },
  // 30 trains
  { match: '#Value [#PresentTense] of', group: 0, notIf: '(one|1|#Copula|#Infinitive)', tag: 'Plural', reason: '2-trains' },
  // compromises are possible
  { match: '[#PresentTense] (are|were) #Adjective', group: 0, tag: 'Plural', reason: 'compromises-are-possible' },
  // hope i helped
  { match: '^[(hope|guess|thought|think)] #Pronoun #Verb', group: 0, tag: 'Infinitive', reason: 'suppose-i' },
  //pursue its dreams
  // { match: '#PresentTense #Possessive [#PresentTense]', notIf: '#Gerund', group: 0, tag: 'Plural', reason: 'pursue-its-dreams' },
  // our unyielding support
  { match: '#Possessive #Adjective [#Verb]', group: 0, tag: 'Noun', notIf: '#Copula', reason: 'our-full-support' },
  // tastes good
  { match: '[(tastes|smells)] #Adverb? #Adjective', group: 0, tag: 'PresentTense', reason: 'tastes-good' },
  // are you playing golf
  // { match: '^are #Pronoun [#Noun]', group: 0, notIf: '(here|there)', tag: 'Verb', reason: 'are-you-x' },
  // ignoring commute
  { match: '#Copula #Gerund [#PresentTense] !by?', group: 0, tag: 'Noun', notIf: 'going', reason: 'ignoring-commute' },
  // noun-pastTense variables
  { match: '#Determiner #Adjective? [(shed|thought|rose|bid|saw|spelt)]', group: 0, tag: 'Noun', reason: 'noun-past' },

  // 'verb-to'
  // how to watch
  { match: 'how to [%Noun|Verb%]', group: 0, tag: 'Infinitive', reason: 'how-to-noun' },
  // which boost it
  { match: 'which [%Noun|Verb%] #Noun', group: 0, tag: 'Infinitive', reason: 'which-boost-it' },
  // asking questions
  { match: '#Gerund [%Plural|Verb%]', group: 0, tag: 'Plural', reason: 'asking-questions' },
  // ready to stream
  { match: '(ready|available|difficult|hard|easy|made|attempt|try) to [%Noun|Verb%]', group: 0, tag: 'Infinitive', reason: 'ready-to-noun' },
  // bring to market
  { match: '(bring|went|go|drive|run|bike) to [%Noun|Verb%]', group: 0, tag: 'Noun', reason: 'bring-to-noun' },
  // can i sleep, would you look
  { match: '#Modal #Noun [%Noun|Verb%]', group: 0, tag: 'Infinitive', reason: 'would-you-look' },
  // is just spam
  { match: '#Copula just [#Infinitive]', group: 0, tag: 'Noun', reason: 'is-just-spam' },
  // request copies
  { match: '^%Noun|Verb% %Plural|Verb%', tag: 'Imperative #Plural', reason: 'request-copies' },
  // homemade pickles and drinks
  { match: '#Adjective #Plural and [%Plural|Verb%]', group: 0, tag: '#Plural', reason: 'pickles-and-drinks' },
  // the 1968 film
  { match: '#Determiner #Year [#Verb]', group: 0, tag: 'Noun', reason: 'the-1968-film' },
  // the break up
  { match: '#Determiner [#PhrasalVerb #Particle]', group: 0, tag: 'Noun', reason: 'the-break-up' },
  // the individual goals
  { match: '#Determiner [%Adj|Noun%] #Noun', group: 0, tag: 'Adjective', notIf: '(#Pronoun|#Possessive|#ProperNoun)', reason: 'the-individual-goals' },
  // work or prepare
  { match: '[%Noun|Verb%] or #Infinitive', group: 0, tag: 'Infinitive', reason: 'work-or-prepare' },
  // to give thanks
  { match: 'to #Infinitive [#PresentTense]', group: 0, tag: 'Noun', notIf: '(#Gerund|#Copula|help)', reason: 'to-give-thanks' },
  // kills me
  { match: '[#Noun] me', group: 0, tag: 'Verb', reason: 'kills-me' },
  // removes wrinkles
  { match: '%Plural|Verb% %Plural|Verb%', tag: '#PresentTense #Plural', reason: 'removes-wrinkles' },
];

var money = [
  { match: '#Money and #Money #Currency?', tag: 'Money', reason: 'money-and-money' },
  // 6 dollars and 5 cents
  { match: '#Value #Currency [and] #Value (cents|ore|centavos|sens)', group: 0, tag: 'money', reason: 'and-5-cents' },
  // maybe currencies
  { match: '#Value (mark|rand|won|rub|ore)', tag: '#Money #Currency', reason: '4-mark' },
  // 3 pounds
  { match: 'a pound', tag: '#Money #Unit', reason: 'a-pound' },
  { match: '#Value (pound|pounds)', tag: '#Money #Unit', reason: '4-pounds' },
];

var fractions = [
  // half a penny
  { match: '[(half|quarter)] of? (a|an)', group: 0, tag: 'Fraction', reason: 'millionth' },
  // nearly half
  { match: '#Adverb [half]', group: 0, tag: 'Fraction', reason: 'nearly-half' },
  // half the
  { match: '[half] the', group: 0, tag: 'Fraction', reason: 'half-the' },
  // and a half
  { match: '#Cardinal and a half', tag: 'Fraction', reason: 'and-a-half' },
  // two-halves
  { match: '#Value (halves|halfs|quarters)', tag: 'Fraction', reason: 'two-halves' },

  // ---ordinals as fractions---
  // a fifth
  { match: 'a #Ordinal', tag: 'Fraction', reason: 'a-quarter' },
  // seven fifths
  { match: '[#Cardinal+] (#Fraction && /s$/)', tag: 'Fraction', reason: 'seven-fifths' },
  // doc.match('(#Fraction && /s$/)').lookBefore('#Cardinal+$').tag('Fraction')
  // one third of ..
  { match: '[#Cardinal+ #Ordinal] of .', group: 0, tag: 'Fraction', reason: 'ordinal-of' },
  // 100th of
  { match: '[(#NumericValue && #Ordinal)] of .', group: 0, tag: 'Fraction', reason: 'num-ordinal-of' },
  // a twenty fifth
  { match: '(a|one) #Cardinal?+ #Ordinal', tag: 'Fraction', reason: 'a-ordinal' },

  // //  '3 out of 5'
  { match: '#Cardinal+ out? of every? #Cardinal', tag: 'Fraction', reason: 'out-of' },
];

// {match:'', tag:'',reason:''},

var numbers$1 = [
  // ==== Ambiguous numbers ====
  // 'second'
  { match: `#Cardinal [second]`, tag: 'Unit', reason: 'one-second' },
  //'a/an' can mean 1 - "a hour"
  {
    match: '!once? [(a|an)] (#Duration|hundred|thousand|million|billion|trillion)',
    group: 0,
    tag: 'Value',
    reason: 'a-is-one',
  },
  // ==== PhoneNumber ====
  //1 800 ...
  { match: '1 #Value #PhoneNumber', tag: 'PhoneNumber', reason: '1-800-Value' },
  //(454) 232-9873
  { match: '#NumericValue #PhoneNumber', tag: 'PhoneNumber', reason: '(800) PhoneNumber' },

  // ==== Currency ====
  // chinese yuan
  { match: '#Demonym #Currency', tag: 'Currency', reason: 'demonym-currency' },
  // ten bucks
  { match: '#Value [(buck|bucks|grand)]', group: 0, tag: 'Currency', reason: 'value-bucks' },
  // ==== Money ====
  { match: '[#Value+] #Currency', group: 0, tag: 'Money', reason: '15 usd' },

  // ==== Ordinal ====
  { match: '[second] #Noun', group: 0, tag: 'Ordinal', reason: 'second-noun' },

  // ==== Units ====
  //5 yan
  { match: '#Value+ [#Currency]', group: 0, tag: 'Unit', reason: '5-yan' },
  { match: '#Value [(foot|feet)]', group: 0, tag: 'Unit', reason: 'foot-unit' },
  //5 kg.
  { match: '#Value [#Abbreviation]', group: 0, tag: 'Unit', reason: 'value-abbr' },
  { match: '#Value [k]', group: 0, tag: 'Unit', reason: 'value-k' },
  { match: '#Unit an hour', tag: 'Unit', reason: 'unit-an-hour' },

  // ==== Magnitudes ====
  //minus 7
  { match: '(minus|negative) #Value', tag: 'Value', reason: 'minus-value' },
  //seven point five
  { match: '#Value (point|decimal) #Value', tag: 'Value', reason: 'value-point-value' },
  //quarter million
  { match: '#Determiner [(half|quarter)] #Ordinal', group: 0, tag: 'Value', reason: 'half-ordinal' },
  // thousand and two
  { match: `#Multiple+ and #Value`, tag: 'Value', reason: 'magnitude-and-value' },
  // ambiguous units like 'gb'
  // { match: '#Value square? [(kb|mb|gb|tb|ml|pt|qt|tbl|tbsp|km|cm|mm|mi|ft|yd|kg|hg|mg|oz|lb|mph|pa|miles|yard|yards|pound|pounds)]', group: 0, tag: 'Unit', reason: '12-gb' },
  // 5 miles per hour
  { match: '#Value #Unit [(per|an) (hr|hour|sec|second|min|minute)]', group: 0, tag: 'Unit', reason: '12-miles-per-second' },
  // 5 square miles
  { match: '#Value [(square|cubic)] #Unit', group: 0, tag: 'Unit', reason: 'square-miles' },
  // 5) The expenses
  // { match: '^[#Value] (#Determiner|#Gerund)', group: 0, tag: 'Expression', unTag: 'Value', reason: 'numbered-list' },
];

var person = [
  // ==== FirstNames ====
  //is foo Smith
  { match: '#Copula [(#Noun|#PresentTense)] #LastName', group: 0, tag: 'FirstName', reason: 'copula-noun-lastname' },
  //pope francis
  {
    match: '(sister|pope|brother|father|aunt|uncle|grandpa|grandfather|grandma) #ProperNoun',
    tag: 'Person',
    reason: 'lady-titlecase',
    safe: true,
  },

  // ==== Nickname ====
  // Dwayne 'the rock' Johnson
  { match: '#FirstName [#Determiner #Noun] #LastName', group: 0, tag: 'Person', reason: 'first-noun-last' },
  {
    match: '#ProperNoun (b|c|d|e|f|g|h|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z) #ProperNoun',
    tag: 'Person',
    reason: 'titlecase-acronym-titlecase',
    safe: true,
  },
  { match: '#Acronym #LastName', tag: 'Person', reason: 'acronym-lastname', safe: true },
  { match: '#Person (jr|sr|md)', tag: 'Person', reason: 'person-honorific' },
  //remove single 'mr'
  { match: '#Honorific #Acronym', tag: 'Person', reason: 'Honorific-TitleCase' },
  { match: '#Person #Person the? #RomanNumeral', tag: 'Person', reason: 'roman-numeral' },
  { match: '#FirstName [/^[^aiurck]$/]', group: 0, tag: ['Acronym', 'Person'], reason: 'john-e' },
  //j.k Rowling
  { match: '#Noun van der? #Noun', tag: 'Person', reason: 'van der noun', safe: true },
  //king of spain
  { match: '(king|queen|prince|saint|lady) of #Noun', tag: 'Person', reason: 'king-of-noun', safe: true },
  //lady Florence
  { match: '(prince|lady) #Place', tag: 'Person', reason: 'lady-place' },
  //saint Foo
  { match: '(king|queen|prince|saint) #ProperNoun', tag: 'Person', notIf: '#Place', reason: 'saint-foo' },

  // al sharpton
  { match: 'al (#Person|#ProperNoun)', tag: 'Person', reason: 'al-borlen', safe: true },
  //ferdinand de almar
  { match: '#FirstName de #Noun', tag: 'Person', reason: 'bill-de-noun' },
  //Osama bin Laden
  { match: '#FirstName (bin|al) #Noun', tag: 'Person', reason: 'bill-al-noun' },
  //John L. Foo
  { match: '#FirstName #Acronym #ProperNoun', tag: 'Person', reason: 'bill-acronym-title' },
  //Andrew Lloyd Webber
  { match: '#FirstName #FirstName #ProperNoun', tag: 'Person', reason: 'bill-firstname-title' },
  //Mr Foo
  { match: '#Honorific #FirstName? #ProperNoun', tag: 'Person', reason: 'dr-john-Title' },
  //peter the great
  { match: '#FirstName the #Adjective', tag: 'Person', reason: 'name-the-great' },

  // dick van dyke
  { match: '#ProperNoun (van|al|bin) #ProperNoun', tag: 'Person', reason: 'title-van-title', safe: true },
  //jose de Sucre
  { match: '#ProperNoun (de|du) la? #ProperNoun', tag: 'Person', notIf: '#Place', reason: 'title-de-title' },
  //Jani K. Smith
  { match: '#Singular #Acronym #LastName', tag: '#FirstName #Person .', reason: 'title-acro-noun', safe: true },
  //Foo Ford
  { match: '[#ProperNoun] #Person', group: 0, tag: 'Person', reason: 'proper-person', safe: true },
  // john keith jones
  {
    match: '#Person [#ProperNoun #ProperNoun]',
    group: 0,
    tag: 'Person',
    notIf: '#Possessive',
    reason: 'three-name-person',
    safe: true,
  },
  //John Foo
  {
    match: '#FirstName #Acronym? [#ProperNoun]',
    group: 0,
    tag: 'LastName',
    notIf: '#Possessive',
    reason: 'firstname-titlecase',
  },
  // john stewart
  { match: '#FirstName [#FirstName]', group: 0, tag: 'LastName', reason: 'firstname-firstname' },
  //Joe K. Sombrero
  { match: '#FirstName #Acronym #Noun', tag: 'Person', reason: 'n-acro-noun', safe: true },
  //Anthony de Marco
  { match: '#FirstName [(de|di|du|van|von)] #Person', group: 0, tag: 'LastName', reason: 'de-firstname' },

  // baker jenna smith
  // { match: '[#Actor+] #Person', group: 0, tag: 'Person', reason: 'baker-sam-smith' },
  // sergeant major Harold
  {
    match:
      '[(lieutenant|corporal|sergeant|captain|qeen|king|admiral|major|colonel|marshal|president|queen|king)+] #ProperNoun',
    group: 0,
    tag: 'Honorific',
    reason: 'seargeant-john',
  },
  // ==== Honorics ====
  {
    match: '[(private|general|major|rear|prime|field|count|miss)] #Honorific? #Person',
    group: 0,
    tag: ['Honorific', 'Person'],
    reason: 'ambg-honorifics',
  },
  // dr john foobar
  {
    match: '#Honorific #FirstName [#Singular]',
    group: 0,
    tag: 'LastName',
    notIf: '#Possessive',
    reason: 'dr-john-foo',
    safe: true,
  },
  //his-excellency
  {
    match: '[(his|her) (majesty|honour|worship|excellency|honorable)] #Person',
    group: 0,
    tag: 'Honorific',
    reason: 'his-excellency',
  },
  // Lieutenant colonel
  { match: '#Honorific #Actor', tag: 'Honorific', reason: 'Lieutenant colonel' },
  // first lady, second admiral
  { match: '(first|second|third|1st|2nd|3rd) #Actor', tag: 'Honorific', reason: 'first lady' },
  // Louis IV
  { match: '#Person #RomanNumeral', tag: 'Person', reason: 'louis-IV' },
];

// const personAdj = '(misty|rusty|dusty|rich|randy|sandy|young|earnest|frank|brown)'

var personName = [
  // ebenezer scrooge
  {
    match: '#FirstName #Noun$',
    tag: '. #LastName',
    notIf: '(#Possessive|#Organization|#Place|#Pronoun|@hasTitleCase)',
    reason: 'firstname-noun',
  },

  // ===person-date===
  { match: '%Person|Date% #Acronym? #ProperNoun', tag: 'Person', reason: 'jan-thierson' },
  // ===person-noun===
  //Cliff Clavin
  { match: '%Person|Noun% #Acronym? #ProperNoun', tag: 'Person', reason: 'switch-person', safe: true },
  // olive garden
  { match: '%Person|Noun% #Organization', tag: 'Organization', reason: 'olive-garden' },
  // ===person-verb===
  // ollie faroo
  { match: '%Person|Verb% #Acronym? #ProperNoun', tag: 'Person', reason: 'verb-propernoun', ifNo: '#Actor' },
  // chuck will ...
  {
    match: `[%Person|Verb%] (will|had|has|said|says|told|did|learned|wants|wanted)`,
    group: 0,
    tag: 'Person',
    reason: 'person-said',
  },

  // ===person-place===
  //sydney harbour
  {
    match: `[%Person|Place%] (harbor|harbour|pier|town|city|place|dump|landfill)`,
    group: 0,
    tag: 'Place',
    reason: 'sydney-harbour',
  },
  // east sydney
  { match: `(west|east|north|south) [%Person|Place%]`, group: 0, tag: 'Place', reason: 'east-sydney' },

  // ===person-adjective===
  // rusty smith
  // { match: `${personAdj} #Person`, tag: 'Person', reason: 'randy-smith' },
  // rusty a. smith
  // { match: `${personAdj} #Acronym? #ProperNoun`, tag: 'Person', reason: 'rusty-smith' },
  // very rusty
  // { match: `#Adverb [${personAdj}]`, group: 0, tag: 'Adjective', reason: 'really-rich' },

  // ===person-verb===
  // would wade
  { match: `#Modal [%Person|Verb%]`, group: 0, tag: 'Verb', reason: 'would-mark' },
  // really wade
  { match: `#Adverb [%Person|Verb%]`, group: 0, tag: 'Verb', reason: 'really-mark' },
  // drew closer
  { match: `[%Person|Verb%] (#Adverb|#Comparative)`, group: 0, tag: 'Verb', reason: 'drew-closer' },
  // wade smith
  { match: `%Person|Verb% #Person`, tag: 'Person', reason: 'rob-smith' },
  // wade m. Cooper
  { match: `%Person|Verb% #Acronym #ProperNoun`, tag: 'Person', reason: 'rob-a-smith' },
  // will go
  { match: '[will] #Verb', group: 0, tag: 'Modal', reason: 'will-verb' },
  // will Pharell
  { match: '(will && @isTitleCase) #ProperNoun', tag: 'Person', reason: 'will-name' },
  // jack layton won
  {
    match: '(#FirstName && !#Possessive) [#Singular] #Verb',
    group: 0,
    safe: true,
    tag: 'LastName',
    reason: 'jack-layton',
  },
  // sherwood anderson told
  { match: '^[#Singular] #Person #Verb', group: 0, safe: true, tag: 'Person', reason: 'sherwood-anderson' },
  // bought a warhol
  { match: '(a|an) [#Person]$', group: 0, unTag: 'Person', reason: 'a-warhol' },
];

var verbs$1 = [
  //sometimes adverbs - 'pretty good','well above'
  {
    match: '#Copula (pretty|dead|full|well|sure) (#Adjective|#Noun)',
    tag: '#Copula #Adverb #Adjective',
    reason: 'sometimes-adverb',
  },
  //i better ..
  { match: '(#Pronoun|#Person) (had|#Adverb)? [better] #PresentTense', group: 0, tag: 'Modal', reason: 'i-better' },
  // adj -> gerund
  // like
  { match: '(#Modal|i|they|we|do) not? [like]', group: 0, tag: 'PresentTense', reason: 'modal-like' },
  // ==== Tense ====
  //he left
  { match: '#Noun #Adverb? [left]', group: 0, tag: 'PastTense', reason: 'left-verb' },

  // ==== Copula ====
  //will be running (not copula)
  { match: 'will #Adverb? not? #Adverb? [be] #Gerund', group: 0, tag: 'Copula', reason: 'will-be-copula' },
  //for more complex forms, just tag 'be'
  { match: 'will #Adverb? not? #Adverb? [be] #Adjective', group: 0, tag: 'Copula', reason: 'be-copula' },
  // ==== Infinitive ====
  //march to
  { match: '[march] (up|down|back|toward)', notIf: '#Date', group: 0, tag: 'Infinitive', reason: 'march-to' },
  //must march
  { match: '#Modal [march]', group: 0, tag: 'Infinitive', reason: 'must-march' },
  // may be
  { match: `[may] be`, group: 0, tag: 'Verb', reason: 'may-be' },
  // subject to
  { match: `[(subject|subjects|subjected)] to`, group: 0, tag: 'Verb', reason: 'subject to' },
  // subject to
  { match: `[home] to`, group: 0, tag: 'PresentTense', reason: 'home to' },

  // === misc==
  // side with
  // { match: '[(side|fool|monkey)] with', group: 0, tag: 'Infinitive', reason: 'fool-with' },
  // open the door
  { match: '[open] #Determiner', group: 0, tag: 'Infinitive', reason: 'open-the' },
  //were being run
  { match: `(were|was) being [#PresentTense]`, group: 0, tag: 'PastTense', reason: 'was-being' },
  //had been broken
  { match: `(had|has|have) [been /en$/]`, group: 0, tag: 'Auxiliary Participle', reason: 'had-been-broken' },
  //had been smoked
  { match: `(had|has|have) [been /ed$/]`, group: 0, tag: 'Auxiliary PastTense', reason: 'had-been-smoked' },
  //were being run
  { match: `(had|has) #Adverb? [been] #Adverb? #PastTense`, group: 0, tag: 'Auxiliary', reason: 'had-been-adj' },
  //had to walk
  { match: `(had|has) to [#Noun] (#Determiner|#Possessive)`, group: 0, tag: 'Infinitive', reason: 'had-to-noun' },
  // have read
  { match: `have [#PresentTense]`, group: 0, tag: 'PastTense', notIf: '(come|gotten)', reason: 'have-read' },
  // does that work
  { match: `(does|will|#Modal) that [work]`, group: 0, tag: 'PastTense', reason: 'does-that-work' },
  // sounds fun
  { match: `[(sound|sounds)] #Adjective`, group: 0, tag: 'PresentTense', reason: 'sounds-fun' },
  // look good
  { match: `[(look|looks)] #Adjective`, group: 0, tag: 'PresentTense', reason: 'looks-good' },
  // stops thinking
  { match: `[(start|starts|stop|stops|begin|begins)] #Gerund`, group: 0, tag: 'Verb', reason: 'starts-thinking' },
  // have read
  { match: `(have|had) read`, tag: 'Modal #PastTense', reason: 'read-read' },
  //were under cooked
  {
    match: `(is|was|were) [(under|over) #PastTense]`,
    group: 0,
    tag: 'Adverb Adjective',
    reason: 'was-under-cooked',
  },

  // damn them
  { match: '[shit] (#Determiner|#Possessive|them)', group: 0, tag: 'Verb', reason: 'swear1-verb' },
  { match: '[damn] (#Determiner|#Possessive|them)', group: 0, tag: 'Verb', reason: 'swear2-verb' },
  { match: '[fuck] (#Determiner|#Possessive|them)', group: 0, tag: 'Verb', reason: 'swear3-verb' },

  // jobs that fit
  { match: '#Plural that %Noun|Verb%', tag: '. #Preposition #Infinitive', reason: 'jobs-that-work' },
  // works for me
  { match: '[works] for me', group: 0, tag: 'PresentTense', reason: 'works-for-me' },
  // as we please
  { match: 'as #Pronoun [please]', group: 0, tag: 'Infinitive', reason: 'as-we-please' },
  // verb-prefixes - 'co write'
  { match: '[(co|mis|de|inter|intra|pre|re|un|out|under|over|counter)] #Verb', group: 0, tag: ['Verb', 'Prefix'], notIf: '(#Copula|#PhrasalVerb)', reason: 'co-write' },
  // dressed and left
  { match: '#PastTense and [%Adj|Past%]', group: 0, tag: 'PastTense', reason: 'dressed-and-left' },
  // melted and fallen
  { match: '[%Adj|Past%] and #PastTense', group: 0, tag: 'PastTense', reason: 'dressed-and-left' },
  // is he stoked
  { match: '#Copula #Pronoun [%Adj|Past%]', group: 0, tag: 'Adjective', reason: 'is-he-stoked' },
  // to dream of
  { match: 'to [%Noun|Verb%] #Preposition', group: 0, tag: 'Infinitive', reason: 'to-dream-of' },
];

// these are some of our heaviest-used matches
var auxiliary = [
  // ==== Auxiliary ====
  // have been
  { match: `will (#Adverb|not)+? [have] (#Adverb|not)+? #Verb`, group: 0, tag: 'Auxiliary', reason: 'will-have-vb' },
  //was walking
  { match: `[#Copula] (#Adverb|not)+? (#Gerund|#PastTense)`, group: 0, tag: 'Auxiliary', reason: 'copula-walking' },
  //would walk
  { match: `[(#Modal|did)+] (#Adverb|not)+? #Verb`, group: 0, tag: 'Auxiliary', reason: 'modal-verb' },
  //would have had
  { match: `#Modal (#Adverb|not)+? [have] (#Adverb|not)+? [had] (#Adverb|not)+? #Verb`, group: 0, tag: 'Auxiliary', reason: 'would-have' },
  //support a splattering of auxillaries before a verb
  { match: `[(has|had)] (#Adverb|not)+? #PastTense`, group: 0, tag: 'Auxiliary', reason: 'had-walked' },
  // will walk
  { match: '[(do|does|did|will|have|had|has|got)] (not|#Adverb)+? #Verb', group: 0, tag: 'Auxiliary', reason: 'have-had' },
  // about to go
  { match: '[about to] #Adverb? #Verb', group: 0, tag: ['Auxiliary', 'Verb'], reason: 'about-to' },
  //would be walking
  { match: `#Modal (#Adverb|not)+? [be] (#Adverb|not)+? #Verb`, group: 0, tag: 'Auxiliary', reason: 'would-be' },
  //had been walking
  { match: `[(#Modal|had|has)] (#Adverb|not)+? [been] (#Adverb|not)+? #Verb`, group: 0, tag: 'Auxiliary', reason: 'had-been' },
  // was being driven
  { match: '[(be|being|been)] #Participle', group: 0, tag: 'Auxiliary', reason: 'being-driven' },
  // may want
  { match: '[may] #Adverb? #Infinitive', group: 0, tag: 'Auxiliary', reason: 'may-want' },
  // was being walked
  { match: '#Copula (#Adverb|not)+? [(be|being|been)] #Adverb+? #PastTense', group: 0, tag: 'Auxiliary', reason: 'being-walked' },
  // will be walked
  { match: 'will [be] #PastTense', group: 0, tag: 'Auxiliary', reason: 'will-be-x' },
  // been walking
  { match: '[(be|been)] (#Adverb|not)+? #Gerund', group: 0, tag: 'Auxiliary', reason: 'been-walking' },
  // used to walk
  { match: '[used to] #PresentTense', group: 0, tag: 'Auxiliary', reason: 'used-to-walk' },
  // was going to walk
  { match: '#Copula (#Adverb|not)+? [going to] #Adverb+? #PresentTense', group: 0, tag: 'Auxiliary', reason: 'going-to-walk' },
  // tell me
  { match: '#Imperative [(me|him|her)]', group: 0, tag: 'Reflexive', reason: 'tell-him' },
  // there is no x
  { match: '(is|was) #Adverb? [no]', group: 0, tag: 'Negative', reason: 'is-no' },
  // been told
  { match: '[(been|had|became|came)] #PastTense', group: 0, notIf: '#PhrasalVerb', tag: 'Auxiliary', reason: 'been-told' },
  // being born
  { match: '[(being|having|getting)] #Verb', group: 0, tag: 'Auxiliary', reason: 'being-born' },
  // be walking
  { match: '[be] #Gerund', group: 0, tag: 'Auxiliary', reason: 'be-walking' },
  // better go
  { match: '[better] #PresentTense', group: 0, tag: 'Modal', notIf: '(#Copula|#Gerund)', reason: 'better-go' },
  // even better
  { match: 'even better', tag: 'Adverb #Comparative', reason: 'even-better' },
];

var phrasal = [
  // ==== Phrasal ====
  //'foo-up'
  { match: '(#Verb && @hasHyphen) up', tag: 'PhrasalVerb', reason: 'foo-up' },
  { match: '(#Verb && @hasHyphen) off', tag: 'PhrasalVerb', reason: 'foo-off' },
  { match: '(#Verb && @hasHyphen) over', tag: 'PhrasalVerb', reason: 'foo-over' },
  { match: '(#Verb && @hasHyphen) out', tag: 'PhrasalVerb', reason: 'foo-out' },
  // walk in on
  {
    match: '[#Verb (in|out|up|down|off|back)] (on|in)',
    notIf: '#Copula',
    tag: 'PhrasalVerb Particle',
    reason: 'walk-in-on',
  },
  // went on for
  { match: '(lived|went|crept|go) [on] for', group: 0, tag: 'PhrasalVerb', reason: 'went-on' },
  // the curtains come down
  { match: '#Verb (up|down|in|on|for)$', tag: 'PhrasalVerb #Particle', notIf: '#PhrasalVerb', reason: 'come-down$' },
  // got me thinking
  // { match: '(got|had) me [#Noun]', group: 0, tag: 'Verb', reason: 'got-me-gerund' },
  // help stop
  { match: 'help [(stop|end|make|start)]', group: 0, tag: 'Infinitive', reason: 'help-stop' },
  // work in the office
  { match: '#PhrasalVerb (in && #Particle) #Determiner', tag: '#Verb #Preposition #Determiner', unTag: 'PhrasalVerb', reason: 'work-in-the' },
  // start listening
  { match: '[(stop|start|finish|help)] #Gerund', group: 0, tag: 'Infinitive', reason: 'start-listening' },
  // mis-fired
  // { match: '[(mis)] #Verb', group: 0, tag: 'Verb', reason: 'mis-firedsa' },
  //back it up
  {
    match: '#Verb (him|her|it|us|himself|herself|itself|everything|something) [(up|down)]',
    group: 0,
    tag: 'Adverb',
    reason: 'phrasal-pronoun-advb',
  },
];

// this is really hard to do
const notIf = '(i|we|they)'; //we do not go
var imperative = [
  // do not go
  { match: '^do not? [#Infinitive #Particle?]', notIf, group: 0, tag: 'Imperative', reason: 'do-eat' },
  // please go
  { match: '^please do? not? [#Infinitive #Particle?]', group: 0, tag: 'Imperative', reason: 'please-go' },
  // just go
  { match: '^just do? not? [#Infinitive #Particle?]', group: 0, tag: 'Imperative', reason: 'just-go' },
  // do it better
  { match: '^[#Infinitive] it #Comparative', notIf, group: 0, tag: 'Imperative', reason: 'do-it-better' },
  // do it again
  { match: '^[#Infinitive] it (please|now|again|plz)', notIf, group: 0, tag: 'Imperative', reason: 'do-it-please' },
  // go quickly.
  { match: '^[#Infinitive] (#Adjective|#Adverb)$', group: 0, tag: 'Imperative', notIf: '(so|such|rather|enough)', reason: 'go-quickly' },
  // turn down the noise
  { match: '^[#Infinitive] (up|down|over) #Determiner', group: 0, tag: 'Imperative', reason: 'turn-down' },
  // eat my shorts
  { match: '^[#Infinitive] (your|my|the|a|an|any|each|every|some|more|with|on)', group: 0, notIf: 'like', tag: 'Imperative', reason: 'eat-my-shorts' },
  // tell him the story
  { match: '^[#Infinitive] (him|her|it|us|me|there)', group: 0, tag: 'Imperative', reason: 'tell-him' },
  // avoid loud noises
  { match: '^[#Infinitive] #Adjective #Noun$', group: 0, tag: 'Imperative', reason: 'avoid-loud-noises' },
  // call and reserve
  { match: '^[#Infinitive] (#Adjective|#Adverb)? and #Infinitive', group: 0, tag: 'Imperative', reason: 'call-and-reserve' },
  // one-word imperatives
  { match: '^(go|stop|wait|hurry) please?$', tag: 'Imperative', reason: 'go' },
  // somebody call
  { match: '^(somebody|everybody) [#Infinitive]', group: 0, tag: 'Imperative', reason: 'somebody-call' },
  // let's leave
  { match: '^let (us|me) [#Infinitive]', group: 0, tag: 'Imperative', reason: 'lets-leave' },
  // shut the door
  { match: '^[(shut|close|open|start|stop|end|keep)] #Determiner #Noun', group: 0, tag: 'Imperative', reason: 'shut-the-door' },
  // turn off the light
  { match: '^[#PhrasalVerb #Particle] #Determiner #Noun', group: 0, tag: 'Imperative', reason: 'turn-off-the-light' },
  // go to toronto
  { match: '^[go] to .', group: 0, tag: 'Imperative', reason: 'go-to-toronto' },
  // would you recommend
  { match: '^#Modal you [#Infinitive]', group: 0, tag: 'Imperative', reason: 'would-you-' },
  // never say
  { match: '^never [#Infinitive]', group: 0, tag: 'Imperative', reason: 'never-stop' },
  // come have a drink
  { match: '^come #Infinitive', tag: 'Imperative', notIf: 'on', reason: 'come-have' },
  // come and have a drink
  { match: '^come and? #Infinitive', tag: 'Imperative . Imperative', notIf: '#PhrasalVerb', reason: 'come-and-have' },
  // stay away
  { match: '^stay (out|away|back)', tag: 'Imperative', reason: 'stay-away' },
  // stay cool
  { match: '^[(stay|be|keep)] #Adjective', group: 0, tag: 'Imperative', reason: 'stay-cool' },
  // keep it silent
  { match: '^[keep it] #Adjective', group: 0, tag: 'Imperative', reason: 'keep-it-cool' },
  // don't be late
  { match: '^do not [#Infinitive]', group: 0, tag: 'Imperative', reason: 'do-not-be' },
  // allow yourself
  { match: '[#Infinitive] (yourself|yourselves)', group: 0, tag: 'Imperative', reason: 'allow-yourself' },
  // look what
  { match: '[#Infinitive] what .', group: 0, tag: 'Imperative', reason: 'look-what' },
  // continue playing
  { match: '^[#Infinitive] #Gerund', group: 0, tag: 'Imperative', reason: 'keep-playing' },
  // go to it
  { match: '^[#Infinitive] (to|for|into|toward|here|there)', group: 0, tag: 'Imperative', reason: 'go-to' },
  // relax and unwind
  { match: '^[#Infinitive] (and|or) #Infinitive', group: 0, tag: 'Imperative', reason: 'inf-and-inf' },

  // commit to
  { match: '^[%Noun|Verb%] to', group: 0, tag: 'Imperative', reason: 'commit-to' },
  // maintain eye contact
  { match: '^[#Infinitive] #Adjective? #Singular #Singular', group: 0, tag: 'Imperative', reason: 'maintain-eye-contact' },
  // don't forget to clean
  { match: 'do not (forget|omit|neglect) to [#Infinitive]', group: 0, tag: 'Imperative', reason: 'do-not-forget' },
  // pay attention
  { match: '^[(ask|wear|pay|look|help|show|watch|act|fix|kill|stop|start|turn|try|win)] #Noun', group: 0, tag: 'Imperative', reason: 'pay-attention' },

];

var adjGerund = [
  // that were growing
  { match: '(that|which) were [%Adj|Gerund%]', group: 0, tag: 'Gerund', reason: 'that-were-growing' },
  // was dissapointing
  // { match: '#Copula [%Adj|Gerund%]$', group: 0, tag: 'Adjective', reason: 'was-disappointing$' },

  // repairing crubling roads
  { match: '#Gerund [#Gerund] #Plural', group: 0, tag: 'Adjective', reason: 'hard-working-fam' },

  // { match: '(that|which) were [%Adj|Gerund%]', group: 0, tag: 'Gerund', reason: 'that-were-growing' },
];

// ==== Passive voice ===
var passive$1 = [
  // got walked, was walked, were walked
  { match: '(got|were|was|is|are|am) (#PastTense|#Participle)', tag: 'Passive', reason: 'got-walked' },
  // was being walked
  { match: '(was|were|is|are|am) being (#PastTense|#Participle)', tag: 'Passive', reason: 'was-being' },
  // had been walked, have been eaten
  { match: '(had|have|has) been (#PastTense|#Participle)', tag: 'Passive', reason: 'had-been' },
  // will be cleaned
  { match: 'will be being? (#PastTense|#Participle)', tag: 'Passive', reason: 'will-be-cleaned' },
  // suffered by the country
  { match: '#Noun [(#PastTense|#Participle)] by (the|a) #Noun', group: 0, tag: 'Passive', reason: 'suffered-by' },

];

// order matters
const matches$1 = [
  // u r cool
  { match: 'u r', tag: '#Pronoun #Copula', reason: 'u r' },
  { match: '#Noun [(who|whom)]', group: 0, tag: 'Determiner', reason: 'captain-who' },

  // ==== Conditions ====
  // had he survived,
  { match: '[had] #Noun+ #PastTense', group: 0, tag: 'Condition', reason: 'had-he' },
  // were he to survive
  { match: '[were] #Noun+ to #Infinitive', group: 0, tag: 'Condition', reason: 'were-he' },

  // some sort of
  { match: 'some sort of', tag: 'Adjective Noun Conjunction', reason: 'some-sort-of' },
  // some of
  // { match: 'some of', tag: 'Noun Conjunction', reason: 'some-of' },
  // of some sort
  { match: 'of some sort', tag: 'Conjunction Adjective Noun', reason: 'of-some-sort' },
  // such skill
  { match: '[such] (a|an|is)? #Noun', group: 0, tag: 'Determiner', reason: 'such-skill' },
  // another one
  // { match: '[another] (#Noun|#Value)', group: 0, tag: 'Adjective', reason: 'another-one' },
  // right after
  { match: '[right] (before|after|in|into|to|toward)', group: 0, tag: '#Adverb', reason: 'right-into' },
  // at about
  { match: '#Preposition [about]', group: 0, tag: 'Adjective', reason: 'at-about' },
  // are ya
  { match: '(are|#Modal|see|do|for) [ya]', group: 0, tag: 'Pronoun', reason: 'are-ya' },
  // long live
  { match: '[long live] .', group: 0, tag: '#Adjective #Infinitive', reason: 'long-live' },
  // plenty of
  { match: '[plenty] of', group: 0, tag: '#Uncountable', reason: 'plenty-of' },
  // 'there' as adjective
  { match: '(always|nearly|barely|practically) [there]', group: 0, tag: 'Adjective', reason: 'always-there' },
  // existential 'there'
  // there she is
  { match: '[there] (#Adverb|#Pronoun)? #Copula', group: 0, tag: 'There', reason: 'there-is' },
  // is there food
  { match: '#Copula [there] .', group: 0, tag: 'There', reason: 'is-there' },
  // should there
  { match: '#Modal #Adverb? [there]', group: 0, tag: 'There', reason: 'should-there' },
  // do you
  { match: '^[do] (you|we|they)', group: 0, tag: 'QuestionWord', reason: 'do-you' },
  // does he
  { match: '^[does] (he|she|it|#ProperNoun)', group: 0, tag: 'QuestionWord', reason: 'does-he' },
  // the person who
  { match: '#Determiner #Noun+ [who] #Verb', group: 0, tag: 'Preposition', reason: 'the-x-who' },
  // the person which
  { match: '#Determiner #Noun+ [which] #Verb', group: 0, tag: 'Preposition', reason: 'the-x-which' },
  // a while
  { match: 'a [while]', group: 0, tag: 'Noun', reason: 'a-while' },
  // guess who
  { match: 'guess who', tag: '#Infinitive #QuestionWord', reason: 'guess-who' },
  // swear words
  { match: '[fucking] !#Verb', group: 0, tag: '#Gerund', reason: 'f-as-gerund' },
];

// import orgWords from './_orgWords.js'
// let orgMap = `(${orgWords.join('|')})`

/*
const multi = [
  'building society',
  'central bank',
  'department store',
  'institute of technology',
  'liberation army',
  'people party',
  'social club',
  'state police',
  'state university',
]
*/

var orgs = [
  // Foo University
  // { match: `#Noun ${orgMap}`, tag: 'Organization', safe: true, reason: 'foo-university' },
  // // University of Toronto
  // { match: `${orgMap} of #Place`, tag: 'Organization', safe: true, reason: 'university-of-foo' },

  // // foo regional health authority
  // { match: `${orgMap} (health|local|regional)+ authority`, tag: 'Organization', reason: 'regional-health' },
  // // foo stock exchange
  // { match: `${orgMap} (stock|mergantile)+ exchange`, tag: 'Organization', reason: 'stock-exchange' },
  // // foo news service
  // { match: `${orgMap} (daily|evening|local)+ news service?`, tag: 'Organization', reason: 'foo-news' },
  //University of Foo
  { match: 'university of #Place', tag: 'Organization', reason: 'university-of-Foo' },
  //John & Joe's
  { match: '#Noun (&|n) #Noun', tag: 'Organization', reason: 'Noun-&-Noun' },
  // teachers union of Ontario
  { match: '#Organization of the? #ProperNoun', tag: 'Organization', reason: 'org-of-place', safe: true },
  //walmart USA
  { match: '#Organization #Country', tag: 'Organization', reason: 'org-country' },
  //organization
  { match: '#ProperNoun #Organization', tag: 'Organization', notIf: '#FirstName', reason: 'titlecase-org' },
  //FitBit Inc
  { match: '#ProperNoun (ltd|co|inc|dept|assn|bros)', tag: 'Organization', reason: 'org-abbrv' },
  // the OCED
  { match: 'the [#Acronym]', group: 0, tag: 'Organization', reason: 'the-acronym', safe: true },
  // government of india
  { match: 'government of the? [#Place+]', tag: 'Organization', reason: 'government-of-x' },
  // school board
  { match: '(health|school|commerce) board', tag: 'Organization', reason: 'school-board' },
  // special comittee
  {
    match: '(nominating|special|conference|executive|steering|central|congressional) committee',
    tag: 'Organization',
    reason: 'special-comittee',
  },
  // global trade union
  {
    match: '(world|global|international|national|#Demonym) #Organization',
    tag: 'Organization',
    reason: 'global-org',
  },
  // schools
  { match: '#Noun+ (public|private) school', tag: 'School', reason: 'noun-public-school' },
  // new york yankees
  { match: '#Place+ #SportsTeam', tag: 'SportsTeam', reason: 'place-sportsteam' },
  // 'manchester united'
  {
    match: '(dc|atlanta|minnesota|manchester|newcastle|sheffield) united',
    tag: 'SportsTeam',
    reason: 'united-sportsteam',
  },
  // 'toronto fc'
  { match: '#Place+ fc', tag: 'SportsTeam', reason: 'fc-sportsteam' },

  // baltimore quilting club
  {
    match: '#Place+ #Noun{0,2} (club|society|group|team|committee|commission|association|guild|crew)',
    tag: 'Organization',
    reason: 'place-noun-society',
  },
];

var places = [
  // ==== Region ====
  // West Norforlk
  { match: '(west|north|south|east|western|northern|southern|eastern)+ #Place', tag: 'Region', reason: 'west-norfolk' },
  //some us-state acronyms (exlude: al, in, la, mo, hi, me, md, ok..)
  {
    match: '#City [(al|ak|az|ar|ca|ct|dc|fl|ga|id|il|nv|nh|nj|ny|oh|pa|sc|tn|tx|ut|vt|pr)]',
    group: 0,
    tag: 'Region',
    reason: 'us-state',
  },
  // portland oregon
  { match: 'portland [or]', group: 0, tag: 'Region', reason: 'portland-or' },
  //words removed from preTagger/placeWords
  {
    match: '#ProperNoun+ (cliff|place|range|pit|place|point|room|grounds|ruins)',
    tag: 'Place',
    reason: 'foo-point',
  },
  // in Foo California
  { match: 'in [#ProperNoun] #Place', group: 0, tag: 'Place', reason: 'propernoun-place' },
  // Address
  {
    match: '#Value #Noun (st|street|rd|road|crescent|cr|way|tr|terrace|avenue|ave)',
    tag: 'Address',
    reason: 'address-st',
  },
  // port dover
  { match: '(port|mount|mt) #ProperName', tag: 'Place', reason: 'port-name' },
  // generic 'oak ridge' names
  // { match: '(oak|maple|spruce|pine|cedar|willow|green|sunset|sunrise) #Place', tag: 'Place', reason: 'tree-name' },
  // generic 'sunset view' names
  // { match: '() #Place', tag: 'Place', reason: 'tree-name' },

  // Sports Arenas and Complexs
  // {
  //   match:
  //     '(#Place+|#Place|#ProperNoun) (memorial|athletic|community|financial)? (sportsplex|stadium|sports centre|sports field|soccer complex|soccer centre|sports complex|civic centre|centre|arena|gardens|complex|coliseum|auditorium|place|building)',
  //   tag: 'Place',
  //   reason: 'sport-complex',
  // },
];

var conjunctions = [
  // ==== Conjunctions ====
  { match: '[so] #Noun', group: 0, tag: 'Conjunction', reason: 'so-conj' },
  //how he is driving
  {
    match: '[(who|what|where|why|how|when)] #Noun #Copula #Adverb? (#Verb|#Adjective)',
    group: 0,
    tag: 'Conjunction',
    reason: 'how-he-is-x',
  },
  // when he
  { match: '#Copula [(who|what|where|why|how|when)] #Noun', group: 0, tag: 'Conjunction', reason: 'when-he' },
  // says that he..
  { match: '#Verb [that] #Pronoun', group: 0, tag: 'Conjunction', reason: 'said-that-he' },
  // things that are required
  { match: '#Noun [that] #Copula', group: 0, tag: 'Conjunction', reason: 'that-are' },
  // things that seem cool
  { match: '#Noun [that] #Verb #Adjective', group: 0, tag: 'Conjunction', reason: 'that-seem' },
  // wasn't that wide..
  { match: '#Noun #Copula not? [that] #Adjective', group: 0, tag: 'Adverb', reason: 'that-adj' },

  // ==== Prepositions ====
  //all students
  { match: '#Verb #Adverb? #Noun [(that|which)]', group: 0, tag: 'Preposition', reason: 'that-prep' },
  //work, which has been done.
  { match: '@hasComma [which] (#Pronoun|#Verb)', group: 0, tag: 'Preposition', reason: 'which-copula' },
  //folks like her
  { match: '#Noun [like] #Noun', group: 0, tag: 'Preposition', reason: 'noun-like' },
  //like the time
  { match: '^[like] #Determiner', group: 0, tag: 'Preposition', reason: 'like-the' },
  //a day like this
  { match: 'a #Noun [like] (#Noun|#Determiner)', group: 0, tag: 'Preposition', reason: 'a-noun-like' },
  // really like
  { match: '#Adverb [like]', group: 0, tag: 'Verb', reason: 'really-like' },
  // nothing like
  { match: '(not|nothing|never) [like]', group: 0, tag: 'Preposition', reason: 'nothing-like' },
  // treat them like
  { match: '#Infinitive #Pronoun [like]', group: 0, tag: 'Preposition', reason: 'treat-them-like' },




  // ==== Questions ====
  // where
  // why
  // when
  // who
  // whom
  // whose
  // what
  // which
  //the word 'how many'
  // { match: '^(how|which)', tag: 'QuestionWord', reason: 'how-question' },
  // how-he, when the
  { match: '[#QuestionWord] (#Pronoun|#Determiner)', group: 0, tag: 'Preposition', reason: 'how-he' },
  // when stolen
  { match: '[#QuestionWord] #Participle', group: 0, tag: 'Preposition', reason: 'when-stolen' },
  // how is
  { match: '[how] (#Determiner|#Copula|#Modal|#PastTense)', group: 0, tag: 'QuestionWord', reason: 'how-is' },
  // children who dance
  { match: '#Plural [(who|which|when)] .', group: 0, tag: 'Preposition', reason: 'people-who' },
];

var expressions = [

  //swear-words as non-expression POS
  { match: 'holy (shit|fuck|hell)', tag: 'Expression', reason: 'swears-expression' },
  // well..
  { match: '^[(well|so|okay|now)] !#Adjective?', group: 0, tag: 'Expression', reason: 'well-' },
  // well..
  { match: '^come on', tag: 'Expression', reason: 'come-on' },
  // sorry
  { match: '(say|says|said) [sorry]', group: 0, tag: 'Expression', reason: 'say-sorry' },
  // ok,
  { match: '^(ok|alright|shoot|hell|anyways)', tag: 'Expression', reason: 'ok-' },
  // c'mon marge..
  // { match: '^[come on] #Noun', group: 0, tag: 'Expression', reason: 'come-on' },
  // say,
  { match: '^(say && @hasComma)', tag: 'Expression', reason: 'say-' },
  { match: '^(like && @hasComma)', tag: 'Expression', reason: 'like-' },
  // dude we should
  { match: '^[(dude|man|girl)] #Pronoun', group: 0, tag: 'Expression', reason: 'dude-i' },
];

const matches = [].concat(
  // order matters top-matches can get overwritten
  passive$1,
  adj,
  advAdj,
  gerundAdj,
  nounAdj,
  adv,
  ambigDates,
  dates,
  noun,
  gerundNouns,
  presNouns,
  money,
  fractions,
  numbers$1,
  person,
  personName,
  verbs$1,
  adjVerb,
  auxiliary,
  phrasal,
  imperative,
  adjGerund,
  matches$1,
  orgs,
  places,
  conjunctions,
  expressions
);
var model = {
  two: {
    matches,
  },
};

let net$1 = null;

// runs all match/tag patterns in model.two.matches
const postTagger = function (view) {
  const { world } = view;
  const { model, methods } = world;
  net$1 = net$1 || methods.one.buildNet(model.two.matches, world);
  // perform these matches on a comma-seperated document
  const document = methods.two.quickSplit(view.document);
  const ptrs = document.map(terms => {
    const t = terms[0];
    return [t.index[0], t.index[1], t.index[1] + terms.length]
  });
  const m = view.update(ptrs);
  m.cache();
  m.sweep(net$1);
  view.uncache();
  view.unfreeze();
  return view
};

// helper function for compute('tagger')
const tagger = view => view.compute(['freeze', 'lexicon', 'preTagger', 'postTagger', 'unfreeze']);

var compute$1 = { postTagger, tagger };

const round$1 = n => Math.round(n * 100) / 100;

function api$i (View) {
  // average tagger score
  View.prototype.confidence = function () {
    let sum = 0;
    let count = 0;
    this.docs.forEach(terms => {
      terms.forEach(term => {
        count += 1;
        sum += term.confidence || 1;
      });
    });
    if (count === 0) {
      return 1
    }
    return round$1(sum / count)
  };

  // (re-) run the POS-tagger
  View.prototype.tagger = function () {
    return this.compute(['tagger'])
  };
}

const plugin$3 = {
  api: api$i,
  compute: compute$1,
  model,
  hooks: ['postTagger'],
};

const getWords = function (net) {
  return Object.keys(net.hooks).filter(w => !w.startsWith('#') && !w.startsWith('%'))
};

const maybeMatch = function (doc, net) {
  // must have *atleast* one of these words
  const words = getWords(net);
  if (words.length === 0) {
    return doc
  }
  if (!doc._cache) {
    doc.cache();
  }
  const cache = doc._cache;
  // return sentences that have one of our needed words
  return doc.filter((_m, i) => {
    return words.some(str => cache[i].has(str))
  })
};

// tokenize first, then only tag sentences required
const lazyParse = function (input, reg) {
  let net = reg;
  if (typeof reg === 'string') {
    net = this.buildNet([{ match: reg }]);
  }
  const doc = this.tokenize(input);
  const m = maybeMatch(doc, net);
  if (m.found) {
    m.compute(['index', 'tagger']);
    return m.match(reg)
  }
  return doc.none()
};

var lazy = {
  lib: {
    lazy: lazyParse
  }
};

const matchVerb = function (m, lemma) {
  const conjugate = m.methods.two.transform.verb.conjugate;
  const all = conjugate(lemma, m.model);
  if (m.has('#Gerund')) {
    return all.Gerund
  }
  if (m.has('#PastTense')) {
    return all.PastTense
  }
  if (m.has('#PresentTense')) {
    return all.PresentTense
  }
  if (m.has('#Gerund')) {
    return all.Gerund
  }
  return lemma
};

const swapVerb = function (vb, lemma) {
  let str = lemma;
  vb.forEach(m => {
    if (!m.has('#Infinitive')) {
      str = matchVerb(m, lemma);
    }
    m.replaceWith(str);
  });
  return vb
};

const swapNoun = function (m, lemma) {
  let str = lemma;
  if (m.has('#Plural')) {
    const toPlural = m.methods.two.transform.noun.toPlural;
    str = toPlural(lemma, m.model);
  }
  m.replaceWith(str, { possessives: true });
};

const swapAdverb = function (m, lemma) {
  const { toAdverb } = m.methods.two.transform.adjective;
  const str = lemma;
  const adv = toAdverb(str);
  if (adv) {
    m.replaceWith(adv);
  }
};
const swapAdjective = function (m, lemma) {
  const { toComparative, toSuperlative } = m.methods.two.transform.adjective;
  let str = lemma;
  if (m.has('#Comparative')) {
    str = toComparative(str, m.model);
  } else if (m.has('#Superlative')) {
    str = toSuperlative(str, m.model);
  }
  if (str) {
    m.replaceWith(str);
  }
};

const swap$1 = function (from, to, tag) {
  let reg = from.split(/ /g).map(str => str.toLowerCase().trim());
  reg = reg.filter(str => str);
  reg = reg.map(str => `{${str}}`).join(' ');
  let m = this.match(reg);
  // guard against some homonyms
  if (tag) {
    m = m.if(tag);
  }
  if (m.has('#Verb')) {
    return swapVerb(m, to)
  }
  if (m.has('#Noun')) {
    return swapNoun(m, to)
  }
  if (m.has('#Adverb')) {
    return swapAdverb(m, to)
  }
  if (m.has('#Adjective')) {
    return swapAdjective(m, to)
  }
  return this
};

const api$h = function (View) {
  View.prototype.swap = swap$1;
};

var swap = {
  api: api$h
};

nlp.plugin(preTag); //~103kb
nlp.plugin(contractionTwo); //
nlp.plugin(plugin$3); //~33kb
nlp.plugin(lazy); //
nlp.plugin(swap); //

// guard against superlative+comparative forms
const toRoot$1 = function (adj) {
  const { fromComparative, fromSuperlative } = adj.methods.two.transform.adjective;
  const str = adj.text('normal');
  if (adj.has('#Comparative')) {
    return fromComparative(str, adj.model)
  }
  if (adj.has('#Superlative')) {
    return fromSuperlative(str, adj.model)
  }
  return str
};

const api$g = function (View) {

  class Adjectives extends View {
    constructor(document, pointer, groups) {
      super(document, pointer, groups);
      this.viewType = 'Adjectives';
    }
    json(opts = {}) {
      const { toAdverb, toNoun, toSuperlative, toComparative } = this.methods.two.transform.adjective;
      opts.normal = true;
      return this.map(m => {
        const json = m.toView().json(opts)[0] || {};
        const str = toRoot$1(m);
        json.adjective = {
          adverb: toAdverb(str, this.model),
          noun: toNoun(str, this.model),
          superlative: toSuperlative(str, this.model),
          comparative: toComparative(str, this.model),
        };
        return json
      }, [])
    }
    adverbs() {
      return this.before('#Adverb+$').concat(this.after('^#Adverb+'))
    }
    conjugate(n) {
      const { toComparative, toSuperlative, toNoun, toAdverb } = this.methods.two.transform.adjective;
      return this.getNth(n).map(adj => {
        const root = toRoot$1(adj);
        return {
          Adjective: root,
          Comparative: toComparative(root, this.model),
          Superlative: toSuperlative(root, this.model),
          Noun: toNoun(root, this.model),
          Adverb: toAdverb(root, this.model),
        }
      }, [])
    }
    toComparative(n) {
      const { toComparative } = this.methods.two.transform.adjective;
      return this.getNth(n).map(adj => {
        const root = toRoot$1(adj);
        const str = toComparative(root, this.model);
        return adj.replaceWith(str)
      })
    }
    toSuperlative(n) {
      const { toSuperlative } = this.methods.two.transform.adjective;
      return this.getNth(n).map(adj => {
        const root = toRoot$1(adj);
        const str = toSuperlative(root, this.model);
        return adj.replaceWith(str)
      })
    }
    toAdverb(n) {
      const { toAdverb } = this.methods.two.transform.adjective;
      return this.getNth(n).map(adj => {
        const root = toRoot$1(adj);
        const str = toAdverb(root, this.model);
        return adj.replaceWith(str)
      })
    }
    toNoun(n) {
      const { toNoun } = this.methods.two.transform.adjective;
      return this.getNth(n).map(adj => {
        const root = toRoot$1(adj);
        const str = toNoun(root, this.model);
        return adj.replaceWith(str)
      })
    }
  }

  View.prototype.adjectives = function (n) {
    let m = this.match('#Adjective');
    m = m.getNth(n);
    return new Adjectives(m.document, m.pointer)
  };
  View.prototype.superlatives = function (n) {
    let m = this.match('#Superlative');
    m = m.getNth(n);
    return new Adjectives(m.document, m.pointer)
  };
  View.prototype.comparatives = function (n) {
    let m = this.match('#Comparative');
    m = m.getNth(n);
    return new Adjectives(m.document, m.pointer)
  };
};
var adjectives = { api: api$g };

// guard against superlative+comparative forms
const toRoot = function (adj) {
  const str = adj.compute('root').text('root');
  return str
};

// return the nth elem of a doc
const api$f = function (View) {

  class Adverbs extends View {
    constructor(document, pointer, groups) {
      super(document, pointer, groups);
      this.viewType = 'Adverbs';
    }
    conjugate(n) {
      return this.getNth(n).map(adv => {
        const adj = toRoot(adv);
        return {
          Adverb: adv.text('normal'),
          Adjective: adj,
        }
      }, [])
    }
    json(opts = {}) {
      const fromAdverb = this.methods.two.transform.adjective.fromAdverb;
      opts.normal = true;
      return this.map(m => {
        const json = m.toView().json(opts)[0] || {};
        json.adverb = {
          adjective: fromAdverb(json.normal)
        };
        return json
      }, [])
    }
  }

  View.prototype.adverbs = function (n) {
    let m = this.match('#Adverb');
    m = m.getNth(n);
    return new Adverbs(m.document, m.pointer)
  };
};
var adverbs = { api: api$f };

const byComma = function (doc) {
  let commas = doc.match('@hasComma');
  // remove any non-clause uses
  commas = commas.filter(m => {
    // don't split the first word
    if (m.growLeft('.').wordCount() === 1) {
      return false
    }
    // don't split the last word
    if (m.growRight('. .').wordCount() === 1) {
      return false
    }
    let more = m.grow('.'); // grow by 1 word in either direction
    more = more.ifNo('@hasComma @hasComma'); //fun, cool...
    more = more.ifNo('@hasComma (and|or) .'); //cool, and fun
    more = more.ifNo('(#City && @hasComma) #Country'); //'toronto, canada'
    more = more.ifNo('(#WeekDay && @hasComma) #Date'); //'tuesday, march 2nd'
    more = more.ifNo('(#Date+ && @hasComma) #Value'); //'july 6, 1992'
    more = more.ifNo('(#Adjective && @hasComma) #Adjective'); //nice, pretty
    // more = more.ifNo('@hasComma (too|also)$') //at end of sentence
    return more.found
  });
  return doc.splitAfter(commas)
};

// should we split-out a clause (in brackets)?
const splitParentheses = function (doc) {
  let matches = doc.parentheses();
  matches = matches.filter(m => {
    return m.wordCount() >= 3 && m.has('#Verb') && m.has('#Noun')
  });
  return doc.splitOn(matches)
};

// split-out a long quotion, but not 'inline quotes'.
const splitQuotes = function (doc) {
  let matches = doc.quotations();
  matches = matches.filter(m => {
    return m.wordCount() >= 3 && m.has('#Verb') && m.has('#Noun')
  });
  return doc.splitOn(matches)
};

const clauses = function (n) {
  let found = this;

  found = splitParentheses(found);
  found = splitQuotes(found);

  found = byComma(found);

  found = found.splitAfter('(@hasEllipses|@hasSemicolon|@hasDash|@hasColon)');

  // i said
  found = found.splitAfter('^#Pronoun (said|says)');
  // ... said John.
  found = found.splitBefore('(said|says) #ProperNoun$');

  // ... if it was
  found = found.splitBefore('. . if .{4}');

  // various conjunctions
  found = found.splitBefore('and while');
  found = found.splitBefore('now that');
  found = found.splitBefore('ever since');
  found = found.splitBefore('(supposing|although)');
  found = found.splitBefore('even (while|if|though)');
  found = found.splitBefore('(whereas|whose)');
  // found = found.splitBefore('as (far|long|much|soon) as')
  found = found.splitBefore('as (though|if)');
  found = found.splitBefore('(til|until)');

  // it is cool but it is ..
  const m = found.match('#Verb .* [but] .* #Verb', 0);
  if (m.found) {
    found = found.splitBefore(m);
  }
  // it is cool and it is ..
  // let conjunctions = found.if('#Copula #Adjective #Conjunction (#Pronoun|#Determiner) #Verb').match('#Conjunction')
  // found = found.splitBefore(conjunctions)

  // if it is this then that
  const condition = found.if('if .{2,9} then .').match('then');
  found = found.splitBefore(condition);

  // // misc clause partitions
  // found = found.splitBefore('as well as .')
  // found = found.splitBefore('such as .')
  // found = found.splitBefore('in addition to .')

  // // semicolons, dashes
  // found = found.splitAfter('@hasSemicolon')
  // found = found.splitAfter('@hasDash')

  // //
  // found = found.splitBefore('which (were|are|will)')

  // // he said [...]
  // found = found.splitAfter('#Noun (said|say|says)')

  // passive voice verb - '.. which was robbed is empty'
  // let passive = found.match('#Noun (which|that) (was|is) #Adverb? #PastTense #Adverb?')
  // if (passive.found) {
  //   found = found.splitAfter(passive)
  // }
  // //which the boy robbed
  // passive = found.match('#Noun (which|that) the? #Noun+ #Adverb? #PastTense #Adverb?')
  // if (passive.found) {
  //   found = found.splitAfter(passive)
  // }
  // does there appear to have relative/subordinate clause still?
  // let tooLong = found.filter(d => d.wordCount() > 5 && d.match('#Verb+').length >= 2)
  // if (tooLong.found) {
  //   // and after the ..
  //   found = found.splitBefore('#Conjunction #Preposition')

  //   // let m = tooLong.splitAfter('#Noun .* #Verb .* #Noun+')
  //   // found = found.splitOn(m.eq(0))
  // }
  if (typeof n === 'number') {
    found = found.get(n);
  }
  return found
};

// split terms into Nounphrase, verbphrase, etc groups
const chunks = function (doc) {
  const all = [];
  let lastOne = null;
  // first, split by comma, etc
  const m = doc.clauses();
  // loop through each clause
  m.docs.forEach(terms => {
    terms.forEach(term => {
      // new chunk
      if (!term.chunk || term.chunk !== lastOne) {
        lastOne = term.chunk;
        all.push([term.index[0], term.index[1], term.index[1] + 1]);
      } else {
        // keep the chunk going
        all[all.length - 1][2] = term.index[1] + 1;
      }
    });
    lastOne = null;
  });
  const parts = doc.update(all);
  return parts
};

const api$e = function (View) {

  class Chunks extends View {
    constructor(document, pointer, groups) {
      super(document, pointer, groups);
      this.viewType = 'Chunks';
    }
    isVerb() {
      return this.filter(c => c.has('<Verb>'))
    }
    isNoun() {
      return this.filter(c => c.has('<Noun>'))
    }
    isAdjective() {
      return this.filter(c => c.has('<Adjective>'))
    }
    isPivot() {
      return this.filter(c => c.has('<Pivot>'))
    }
    // chunk-friendly debug
    debug() {
      this.toView().debug('chunks');
      return this
    }
    // overloaded - keep Sentences class
    update(pointer) {
      const m = new Chunks(this.document, pointer);
      m._cache = this._cache; // share this full thing
      return m
    }
  }

  View.prototype.chunks = function (n) {
    let m = chunks(this);
    m = m.getNth(n);
    return new Chunks(this.document, m.pointer)
  };
  View.prototype.clauses = clauses;
};

const byWord = {
  this: 'Noun',
  then: 'Pivot'
};

// simply chunk Nouns as <Noun>
const easyMode = function (document) {
  for (let n = 0; n < document.length; n += 1) {
    for (let t = 0; t < document[n].length; t += 1) {
      const term = document[n][t];

      if (byWord.hasOwnProperty(term.normal) === true) {
        term.chunk = byWord[term.normal];
        continue
      }
      if (term.tags.has('Verb')) {
        term.chunk = 'Verb';
        continue
      }
      if (term.tags.has('Noun') || term.tags.has('Determiner')) {
        term.chunk = 'Noun';
        continue
      }
      // 100 cats
      if (term.tags.has('Value')) {
        term.chunk = 'Noun';
        continue
      }
      //
      if (term.tags.has('QuestionWord')) {
        term.chunk = 'Pivot';
        continue
      }

    }
  }
};

// simply chunk Nouns as <Noun>
const byNeighbour = function (document) {
  for (let n = 0; n < document.length; n += 1) {
    for (let t = 0; t < document[n].length; t += 1) {
      const term = document[n][t];
      if (term.chunk) {
        continue
      }
      // based on next-term
      const onRight = document[n][t + 1];
      // based on last-term
      const onLeft = document[n][t - 1];

      //'is cool' vs 'the cool dog'
      if (term.tags.has('Adjective')) {
        // 'is cool'
        if (onLeft && onLeft.tags.has('Copula')) {
          term.chunk = 'Adjective';
          continue
        }
        // 'the cool'
        if (onLeft && onLeft.tags.has('Determiner')) {
          term.chunk = 'Noun';
          continue
        }
        // 'cool dog'
        if (onRight && onRight.tags.has('Noun')) {
          term.chunk = 'Noun';
          continue
        }
        continue
      }
      // 'really swimming' vs 'really cool'
      if (term.tags.has('Adverb') || term.tags.has('Negative')) {
        if (onLeft && onLeft.tags.has('Adjective')) {
          term.chunk = 'Adjective';
          continue
        }
        if (onLeft && onLeft.tags.has('Verb')) {
          term.chunk = 'Verb';
          continue
        }

        if (onRight && onRight.tags.has('Adjective')) {
          term.chunk = 'Adjective';
          continue
        }
        if (onRight && onRight.tags.has('Verb')) {
          term.chunk = 'Verb';
          continue
        }
      }
    }
  }
};

const rules = [
  // === Conjunction ===
  // that the houses
  { match: '[that] #Determiner #Noun', group: 0, chunk: 'Pivot' },
  // estimated that
  { match: '#PastTense [that]', group: 0, chunk: 'Pivot' },
  // so the
  { match: '[so] #Determiner', group: 0, chunk: 'Pivot' },

  // === Adjective ===
  // was really nice
  { match: '#Copula #Adverb+? [#Adjective]', group: 0, chunk: 'Adjective' },
  // was nice
  // { match: '#Copula [#Adjective]', group: 0, chunk: 'Adjective' },
  // nice and cool
  { match: '#Adjective and #Adjective', chunk: 'Adjective' },
  // really nice
  // { match: '#Adverb+ #Adjective', chunk: 'Adjective' },

  // === Verb ===
  // quickly and suddenly run
  { match: '#Adverb+ and #Adverb #Verb', chunk: 'Verb' },
  // sitting near
  { match: '#Gerund #Adjective$', chunk: 'Verb' },
  // going to walk
  { match: '#Gerund to #Verb', chunk: 'Verb' },
  // come and have a drink
  { match: '#PresentTense and #PresentTense', chunk: 'Verb' },
  // really not
  { match: '#Adverb #Negative', chunk: 'Verb' },
  // want to see
  { match: '(want|wants|wanted) to #Infinitive', chunk: 'Verb' },
  // walk ourselves
  { match: '#Verb #Reflexive', chunk: 'Verb' },
  // tell him the story
  // { match: '#PresentTense [#Pronoun] #Determiner', group: 0, chunk: 'Verb' },
  // tries to walk
  { match: '#Verb [to] #Adverb? #Infinitive', group: 0, chunk: 'Verb' },
  // upon seeing
  { match: '[#Preposition] #Gerund', group: 0, chunk: 'Verb' },
  // ensure that
  { match: '#Infinitive [that] <Noun>', group: 0, chunk: 'Verb' },

  // === Noun ===
  // the brown fox
  // { match: '#Determiner #Adjective+ #Noun', chunk: 'Noun' },
  // the fox
  // { match: '(the|this) <Noun>', chunk: 'Noun' },
  // brown fox
  // { match: '#Adjective+ <Noun>', chunk: 'Noun' },
  // --- of ---
  // son of a gun
  { match: '#Noun of #Determiner? #Noun', chunk: 'Noun' },
  // 3 beautiful women
  { match: '#Value+ #Adverb? #Adjective', chunk: 'Noun' },
  // the last russian tsar
  { match: 'the [#Adjective] #Noun', chunk: 'Noun' },
  // breakfast in bed
  { match: '#Singular in #Determiner? #Singular', chunk: 'Noun' },
  // Some citizens in this Canadian capital
  { match: '#Plural [in] #Determiner? #Noun', group: 0, chunk: 'Pivot' },
  // indoor and outdoor seating
  { match: '#Noun and #Determiner? #Noun', notIf: '(#Possessive|#Pronoun)', chunk: 'Noun' },
  //  boys and girls
  // { match: '#Plural and #Determiner? #Plural', chunk: 'Noun' },
  // tomatoes and cheese
  // { match: '#Noun and #Determiner? #Noun', notIf: '#Pronoun', chunk: 'Noun' },
  // that is why
  // { match: '[that] (is|was)', group: 0, chunk: 'Noun' },
];

let net = null;
const matcher = function (view, _, world) {
  const { methods } = world;
  net = net || methods.one.buildNet(rules, world);
  view.sweep(net);
};

const setChunk = function (term, chunk) {
  const env = typeof process === 'undefined' || !process.env ? self.env || {} : process.env;
  if (env.DEBUG_CHUNKS) {
    const str = (term.normal + "'").padEnd(8);
    console.log(`  | '${str}  →  \x1b[34m${chunk.padEnd(12)}\x1b[0m \x1b[2m -fallback- \x1b[0m`); // eslint-disable-line
  }
  term.chunk = chunk;
};

// ensure everything has a chunk
const fallback = function (document) {
  for (let n = 0; n < document.length; n += 1) {
    for (let t = 0; t < document[n].length; t += 1) {
      const term = document[n][t];
      if (term.chunk === undefined) {
        // conjunctions stand alone
        if (term.tags.has('Conjunction')) {
          setChunk(term, 'Pivot');
        } else if (term.tags.has('Preposition')) {
          setChunk(term, 'Pivot');
        } else if (term.tags.has('Adverb')) {
          setChunk(term, 'Verb');
        }
        // just take the chunk on the right?
        // else if (document[n][t + 1] && document[n][t + 1].chunk) {
        //   setChunk(term, document[n][t + 1].chunk)
        // }
        // // or take the chunk on the left
        // else if (document[n][t - 1] && document[n][t - 1].chunk) {
        //   setChunk(term, document[n][t - 1].chunk)
        else {
          //  ¯\_(ツ)_/¯
          term.chunk = 'Noun';
        }
      }
    }
  }
};

const fixUp = function (docs) {
  const byChunk = [];
  let current = null;
  docs.forEach(terms => {
    // ensure an adjective chunk is preceded by a copula
    for (let i = 0; i < terms.length; i += 1) {
      const term = terms[i];
      if (current && term.chunk === current) {
        byChunk[byChunk.length - 1].terms.push(term);
      } else {
        byChunk.push({ chunk: term.chunk, terms: [term] });
        current = term.chunk;
      }
    }
  });
  // ensure every verb-phrase actually has a verb
  byChunk.forEach(c => {
    if (c.chunk === 'Verb') {
      const hasVerb = c.terms.find(t => t.tags.has('Verb'));
      if (!hasVerb) {
        c.terms.forEach(t => t.chunk = null);
      }
    }
  });
};

/* Chunks:
    Noun
    Verb
    Adjective
    Pivot
*/

const findChunks = function (view) {
  const { document, world } = view;
  easyMode(document);
  byNeighbour(document);
  matcher(view, document, world);
  // matcher(view, document, world) //run it 2nd time
  fallback(document);
  fixUp(document);
};
var compute = { chunks: findChunks };

var chunker = {
  compute: compute,
  api: api$e,
  hooks: ['chunks'],
};

// return the nth elem of a doc
const hasPeriod = /\./g;

const api$d = function (View) {

  class Acronyms extends View {
    constructor(document, pointer, groups) {
      super(document, pointer, groups);
      this.viewType = 'Acronyms';
    }
    strip() {
      this.docs.forEach(terms => {
        terms.forEach(term => {
          term.text = term.text.replace(hasPeriod, '');
          term.normal = term.normal.replace(hasPeriod, '');
        });
      });
      return this
    }
    addPeriods() {
      this.docs.forEach(terms => {
        terms.forEach(term => {
          term.text = term.text.replace(hasPeriod, '');
          term.normal = term.normal.replace(hasPeriod, '');
          term.text = term.text.split('').join('.') + '.';
          term.normal = term.normal.split('').join('.') + '.';
        });
      });
      return this
    }
  }

  View.prototype.acronyms = function (n) {
    let m = this.match('#Acronym');
    m = m.getNth(n);
    return new Acronyms(m.document, m.pointer)
  };
};

const hasOpen$1 = /\(/;
const hasClosed$1 = /\)/;

const findEnd$1 = function (terms, i) {
  for (; i < terms.length; i += 1) {
    if (terms[i].post && hasClosed$1.test(terms[i].post)) {
      let [, index] = terms[i].index;
      index = index || 0;
      return index
    }
  }
  return null
};

const find$5 = function (doc) {
  const ptrs = [];
  doc.docs.forEach(terms => {
    for (let i = 0; i < terms.length; i += 1) {
      const term = terms[i];
      if (term.pre && hasOpen$1.test(term.pre)) {
        const end = findEnd$1(terms, i);
        if (end !== null) {
          const [n, start] = terms[i].index;
          ptrs.push([n, start, end + 1, terms[i].id]);
          i = end;
        }
      }
    }
  });
  return doc.update(ptrs)
};

const strip$1 = function (m) {
  m.docs.forEach(terms => {
    terms[0].pre = terms[0].pre.replace(hasOpen$1, '');
    const last = terms[terms.length - 1];
    last.post = last.post.replace(hasClosed$1, '');
  });
  return m
};

const api$c = function (View) {
  class Parentheses extends View {
    constructor(document, pointer, groups) {
      super(document, pointer, groups);
      this.viewType = 'Possessives';
    }
    strip() {
      return strip$1(this)
    }
  }

  View.prototype.parentheses = function (n) {
    let m = find$5(this);
    m = m.getNth(n);
    return new Parentheses(m.document, m.pointer)
  };
};

// return the nth elem of a doc
const apostropheS = /'s$/;

const find$4 = function (doc) {
  let m = doc.match('#Possessive+');
  // expand it to include 'john smith's'
  if (m.has('#Person')) {
    m = m.growLeft('#Person+');
  }
  if (m.has('#Place')) {
    m = m.growLeft('#Place+');
  }
  if (m.has('#Organization')) {
    m = m.growLeft('#Organization+');
  }
  return m
};


const api$b = function (View) {

  class Possessives extends View {
    constructor(document, pointer, groups) {
      super(document, pointer, groups);
      this.viewType = 'Possessives';
    }
    strip() {
      this.docs.forEach(terms => {
        terms.forEach(term => {
          term.text = term.text.replace(apostropheS, '');
          term.normal = term.normal.replace(apostropheS, '');
        });
      });
      return this
    }
  }

  View.prototype.possessives = function (n) {
    let m = find$4(this);
    m = m.getNth(n);
    return new Possessives(m.document, m.pointer)
  };
};

/* eslint-disable regexp/no-dupe-characters-character-class */

const pairs = {
  '\u0022': '\u0022', // 'StraightDoubleQuotes'
  '\uFF02': '\uFF02', // 'StraightDoubleQuotesWide'
  '\u0027': '\u0027', // 'StraightSingleQuotes'
  '\u201C': '\u201D', // 'CommaDoubleQuotes'
  '\u2018': '\u2019', // 'CommaSingleQuotes'
  '\u201F': '\u201D', // 'CurlyDoubleQuotesReversed'
  '\u201B': '\u2019', // 'CurlySingleQuotesReversed'
  '\u201E': '\u201D', // 'LowCurlyDoubleQuotes'
  '\u2E42': '\u201D', // 'LowCurlyDoubleQuotesReversed'
  '\u201A': '\u2019', // 'LowCurlySingleQuotes'
  '\u00AB': '\u00BB', // 'AngleDoubleQuotes' «, »
  '\u2039': '\u203A', // 'AngleSingleQuotes'
  // Prime 'non quotation'
  '\u2035': '\u2032', // 'PrimeSingleQuotes'
  '\u2036': '\u2033', // 'PrimeDoubleQuotes'
  '\u2037': '\u2034', // 'PrimeTripleQuotes'
  // Prime 'quotation' variation
  '\u301D': '\u301E', // 'PrimeDoubleQuotes'
  '\u0060': '\u00B4', // 'PrimeSingleQuotes'
  '\u301F': '\u301E', // 'LowPrimeDoubleQuotesReversed'
};

const hasOpen = RegExp('[' + Object.keys(pairs).join('') + ']');
const hasClosed = RegExp('[' + Object.values(pairs).join('') + ']');

const findEnd = function (terms, i) {
  const have = terms[i].pre.match(hasOpen)[0] || '';
  if (!have || !pairs[have]) {
    return null
  }
  const want = pairs[have];
  for (; i < terms.length; i += 1) {
    if (terms[i].post && terms[i].post.match(want)) {
      return i
    }
  }
  return null
};

const find$3 = function (doc) {
  const ptrs = [];
  doc.docs.forEach(terms => {
    for (let i = 0; i < terms.length; i += 1) {
      const term = terms[i];
      if (term.pre && hasOpen.test(term.pre)) {
        const end = findEnd(terms, i);
        if (end !== null) {
          const [n, start] = terms[i].index;
          ptrs.push([n, start, end + 1, terms[i].id]);
          i = end;
        }
      }
    }
  });
  return doc.update(ptrs)
};

const strip = function (m) {
  m.docs.forEach(terms => {
    terms[0].pre = terms[0].pre.replace(hasOpen, '');
    const lastTerm = terms[terms.length - 1];
    lastTerm.post = lastTerm.post.replace(hasClosed, '');
  });
};

const api$a = function (View) {

  class Quotations extends View {
    constructor(document, pointer, groups) {
      super(document, pointer, groups);
      this.viewType = 'Possessives';
    }
    strip() {
      return strip(this)
    }
  }

  View.prototype.quotations = function (n) {
    let m = find$3(this);
    m = m.getNth(n);
    return new Quotations(m.document, m.pointer)
  };
};

/** return anything tagged as a phone number */
const phoneNumbers = function (n) {
  let m = this.splitAfter('@hasComma');
  m = m.match('#PhoneNumber+');
  m = m.getNth(n);
  return m
};

// setup easy helper methods
const selections = [
  ['hyphenated', '@hasHyphen .'],
  ['hashTags', '#HashTag'],
  ['emails', '#Email'],
  ['emoji', '#Emoji'],
  ['emoticons', '#Emoticon'],
  ['atMentions', '#AtMention'],
  ['urls', '#Url'],
  // ['pronouns', '#Pronoun'],
  ['conjunctions', '#Conjunction'],
  ['prepositions', '#Preposition'],
  ['abbreviations', '#Abbreviation'],
  ['honorifics', '#Honorific'],
];

// aliases
const aliases = [
  ['emojis', 'emoji'],
  ['atmentions', 'atMentions'],
];

const addMethods = function (View) {
  // add a list of new helper methods
  selections.forEach(a => {
    View.prototype[a[0]] = function (n) {
      const m = this.match(a[1]);
      return typeof n === 'number' ? m.get(n) : m
    };
  });
  View.prototype.phoneNumbers = phoneNumbers;
  // add aliases
  aliases.forEach(a => {
    View.prototype[a[0]] = View.prototype[a[1]];
  });
};

const hasSlash = /\//;

const api$9 = function (View) {

  class Slashes extends View {
    constructor(document, pointer, groups) {
      super(document, pointer, groups);
      this.viewType = 'Slashes';
    }
    split() {
      return this.map((m) => {
        const str = m.text();
        const arr = str.split(hasSlash);
        m = m.replaceWith(arr.join(' '));
        return m.growRight('(' + arr.join('|') + ')+')
      })
    }
  }

  View.prototype.slashes = function (n) {
    let m = this.match('#SlashedTerm');
    m = m.getNth(n);
    return new Slashes(m.document, m.pointer)
  };
};

var misc = {
  api: function (View) {
    api$d(View);
    api$c(View);
    api$b(View);
    api$a(View);
    addMethods(View);
    api$9(View);
  }
};

const termLoop = function (view, cb) {
  view.docs.forEach(terms => {
    terms.forEach(cb);
  });
};

var methods = {
  // remove titlecasing, uppercase
  'case': (doc) => {
    termLoop(doc, (term) => {
      term.text = term.text.toLowerCase();
    });
  },
  // visually romanize/anglicize 'Björk' into 'Bjork'.
  'unicode': (doc) => {
    const world = doc.world;
    const killUnicode = world.methods.one.killUnicode;
    termLoop(doc, (term) => term.text = killUnicode(term.text, world));
  },
  // remove hyphens, newlines, and force one space between words
  'whitespace': (doc) => {
    termLoop(doc, (term) => {
      // one space between words
      term.post = term.post.replace(/\s+/g, ' ');
      term.post = term.post.replace(/\s([.,?!:;])/g, '$1');//no whitespace before a period, etc
      // no whitepace before a word
      term.pre = term.pre.replace(/\s+/g, '');
    });
  },
  // remove commas, semicolons - but keep sentence-ending punctuation
  'punctuation': (doc) => {
    termLoop(doc, (term) => {
      // turn dashes to spaces
      term.post = term.post.replace(/[–—-]/g, ' ');
      // remove comma, etc 
      term.post = term.post.replace(/[,:;]/g, '');
      // remove elipses
      term.post = term.post.replace(/\.{2,}/g, '');
      // remove repeats
      term.post = term.post.replace(/\?{2,}/g, '?');
      term.post = term.post.replace(/!{2,}/g, '!');
      // replace ?!
      term.post = term.post.replace(/\?!+/g, '?');
    });
    // trim end
    const docs = doc.docs;
    const terms = docs[docs.length - 1];
    if (terms && terms.length > 0) {
      const lastTerm = terms[terms.length - 1];
      lastTerm.post = lastTerm.post.replace(/ /g, '');
    }
  },

  // ====== subsets ===

  // turn "isn't" to "is not"
  'contractions': (doc) => {
    doc.contractions().expand();
  },
  //remove periods from acronyms, like 'F.B.I.'
  'acronyms': (doc) => {
    doc.acronyms().strip();
  },
  //remove words inside brackets (like these)
  'parentheses': (doc) => {
    doc.parentheses().strip();
  },
  // turn "Google's tax return" to "Google tax return"
  'possessives': (doc) => {
    doc.possessives().strip();
  },
  // turn "tax return" to tax return
  'quotations': (doc) => {
    doc.quotations().strip();
  },

  // remove them
  'emoji': (doc) => {
    doc.emojis().remove();
  },
  //turn 'Vice Admiral John Smith' to 'John Smith'
  'honorifics': (doc) => {
    doc.match('#Honorific+ #Person').honorifics().remove();
  },
  // remove needless adverbs
  'adverbs': (doc) => {
    doc.adverbs().remove();
  },

  // turn "batmobiles" into "batmobile"
  'nouns': (doc) => {
    doc.nouns().toSingular();
  },
  // turn all verbs into Infinitive form - "I walked" → "I walk"
  'verbs': (doc) => {
    doc.verbs().toInfinitive();
  },
  // turn "fifty" into "50"
  'numbers': (doc) => {
    doc.numbers().toNumber();
  },

  /** remove bullets from beginning of phrase */
  'debullet': (doc) => {
    const hasBullet = /^\s*([-–—*•])\s*$/;
    doc.docs.forEach(terms => {
      //remove bullet symbols
      if (hasBullet.test(terms[0].pre)) {
        terms[0].pre = terms[0].pre.replace(hasBullet, '');
      }
    });
    return doc
  }
};

// turn presets into key-vals
const split = (str) => {
  return str.split('|').reduce((h, k) => {
    h[k] = true;
    return h
  }, {})
};

const light = 'unicode|punctuation|whitespace|acronyms';
const medium = '|case|contractions|parentheses|quotations|emoji|honorifics|debullet';
const heavy = '|possessives|adverbs|nouns|verbs';
const presets = {
  light: split(light),
  medium: split(light + medium),
  heavy: split(light + medium + heavy)
};

function api$8 (View) {
  View.prototype.normalize = function (opts = 'light') {
    if (typeof opts === 'string') {
      opts = presets[opts];
    }
    // run each method
    Object.keys(opts).forEach(fn => {
      if (methods.hasOwnProperty(fn)) {
        methods[fn](this, opts[fn]);
      }
    });
    return this
  };
}

var normalize = {
  api: api$8
};

const findNouns = function (doc) {
  let m = doc.clauses().match('<Noun>');
  let commas = m.match('@hasComma');
  // allow toronto, ontario
  commas = commas.not('#Place');
  if (commas.found) {
    m = m.splitAfter(commas);
  }
  // yo there
  m = m.splitOn('#Expression');
  // these are individual nouns
  m = m.splitOn('(he|she|we|you|they|i)');
  // a client i saw
  m = m.splitOn('(#Noun|#Adjective) [(he|him|she|it)]', 0);
  // give him the best
  m = m.splitOn('[(he|him|she|it)] (#Determiner|#Value)', 0);
  // the noise the slide makes
  m = m.splitBefore('#Noun [(the|a|an)] #Adjective? #Noun', 0);
  // here spencer slept
  m = m.splitOn('[(here|there)] #Noun', 0);
  // put it there
  m = m.splitOn('[#Noun] (here|there)', 0);
  // its great purposes
  // give [parents] [our money]
  m = m.splitBefore('(our|my|their|your)');
  // tell my friend that he
  m = m.splitOn('#Noun [#Determiner]', 0);
  // his excuses
  // m = m.splitAfter('(his|hers|yours|ours|theirs)')
  // m = m.not('^#Determiner')
  //ensure there's actually a noun
  m = m.if('#Noun');
  return m
};

// https://www.trentu.ca/history/subordinate-clause-and-complex-sentence
const list$1 = [
  'after',
  'although',
  'as if',
  'as long as',
  'as',
  'because',
  'before',
  'even if',
  'even though',
  'ever since',
  'if',
  'in order that',
  'provided that',
  'since',
  'so that',
  'than',
  'that',
  'though',
  'unless',
  'until',
  'what',
  'whatever',
  'when',
  'whenever',
  'where',
  'whereas',
  'wherever',
  'whether',
  'which',
  'whichever',
  'who',
  'whoever',
  'whom',
  'whomever',
  'whose',
];

const isSubordinate = function (m) {
  // athletes from toronto, days since december
  if (m.before('#Preposition$').found) {
    return true
  }
  const leadIn = m.before();
  if (!leadIn.found) {
    return false
  }
  for (let i = 0; i < list$1.length; i += 1) {
    if (m.has(list$1[i])) {
      return true
    }
  }
  return false
};

const notPlural = '(#Pronoun|#Place|#Value|#Person|#Uncountable|#Month|#WeekDay|#Holiday|#Possessive)';

const isPlural$3 = function (m, root) {
  // const { looksPlural } = m.world.methods.two
  if (m.has('#Plural')) {
    return true
  }
  // two singular nouns are plural noun phrase
  if (m.has('#Noun and #Noun')) {
    return true
  }
  if (m.has('(we|they)')) {
    return true
  }
  // these can't be plural
  if (root.has(notPlural) === true) {
    return false
  }
  if (m.has('#Singular')) {
    return false
  }
  // word-reg fallback
  const str = root.text('normal');
  // ends with a brutal s fallback
  return str.length > 3 && str.endsWith('s') && !str.endsWith('ss')
};

const getRoot = function (m) {
  let tmp = m.clone();
  tmp = tmp.match('#Noun+');
  tmp = tmp.remove('(#Adjective|#Preposition|#Determiner|#Value)');
  tmp = tmp.not('#Possessive');
  tmp = tmp.first();
  if (!tmp.found) {
    return m
  }
  return tmp
};

const parseNoun = function (m) {
  const root = getRoot(m);
  return {
    determiner: m.match('#Determiner').eq(0),
    adjectives: m.match('#Adjective'),
    number: m.values(),
    isPlural: isPlural$3(m, root),
    isSubordinate: isSubordinate(m),
    root: root,
  }
};

const toText$2 = m => m.text();
const toArray$1 = m => m.json({ terms: false, normal: true }).map(s => s.normal);

const getNum = function (m) {
  const num = null;
  if (!m.found) {
    return num
  }
  const val = m.values(0);
  if (val.found) {
    const obj = val.parse()[0] || {};
    return obj.num
  }
  return num
};

const toJSON$1 = function (m) {
  const res = parseNoun(m);
  return {
    root: toText$2(res.root),
    number: getNum(res.number),
    determiner: toText$2(res.determiner),
    adjectives: toArray$1(res.adjectives),
    isPlural: res.isPlural,
    isSubordinate: res.isSubordinate,
  }
};

const hasPlural = function (root) {
  if (root.has('^(#Uncountable|#ProperNoun|#Place|#Pronoun|#Acronym)+$')) {
    return false
  }
  return true
};

const keep$7 = { tags: true };

const nounToPlural = function (m, parsed) {
  // already plural?
  if (parsed.isPlural === true) {
    return m
  }
  // handle "steve's"
  if (parsed.root.has('#Possessive')) {
    parsed.root = parsed.root.possessives().strip();
  }
  // is a plural appropriate?
  if (!hasPlural(parsed.root)) {
    return m
  }
  const { methods, model } = m.world;
  const { toPlural } = methods.two.transform.noun;
  // inflect the root noun
  const str = parsed.root.text({ keepPunct: false });
  const plural = toPlural(str, model);
  m.match(parsed.root).replaceWith(plural, keep$7).tag('Plural', 'toPlural');
  // should we change the determiner/article?
  if (parsed.determiner.has('(a|an)')) {
    // 'a captain' -> 'the captains'
    // m.replace(parsed.determiner, 'the', keep)
    m.remove(parsed.determiner);
  }
  // should we change the following copula?
  const copula = parsed.root.after('not? #Adverb+? [#Copula]', 0);
  if (copula.found) {
    if (copula.has('is')) {
      m.replace(copula, 'are');
    } else if (copula.has('was')) {
      m.replace(copula, 'were');
    }
  }
  return m
};

const keep$6 = { tags: true };

const nounToSingular = function (m, parsed) {
  // already singular?
  if (parsed.isPlural === false) {
    return m
  }
  const { methods, model } = m.world;
  const { toSingular } = methods.two.transform.noun;
  // inflect the root noun
  const str = parsed.root.text('normal');
  const single = toSingular(str, model);
  m.replace(parsed.root, single, keep$6).tag('Singular', 'toPlural');
  // should we change the determiner/article?
  // m.debug()
  return m
};

const api$7 = function (View) {
  class Nouns extends View {
    constructor(document, pointer, groups) {
      super(document, pointer, groups);
      this.viewType = 'Nouns';
    }

    parse(n) {
      return this.getNth(n).map(parseNoun)
    }

    json(n) {
      const opts = typeof n === 'object' ? n : {};
      return this.getNth(n).map(m => {
        const json = m.toView().json(opts)[0] || {};
        if (opts && opts.noun !== false) {
          json.noun = toJSON$1(m);
        }
        return json
      }, [])
    }
    conjugate(n) {
      const methods = this.world.methods.two.transform.noun;
      return this.getNth(n).map(m => {
        const parsed = parseNoun(m);
        const root = parsed.root.compute('root').text('root');
        const res = {
          Singular: root,
        };
        if (hasPlural(parsed.root)) {
          res.Plural = methods.toPlural(root, this.model);
        }
        // only show plural if one exists
        if (res.Singular === res.Plural) {
          delete res.Plural;
        }
        return res
      }, [])
    }
    isPlural(n) {
      const res = this.filter(m => parseNoun(m).isPlural);
      return res.getNth(n)
    }

    isSingular(n) {
      const res = this.filter(m => !parseNoun(m).isPlural);
      return res.getNth(n)
    }

    adjectives(n) {
      let res = this.update([]);
      this.forEach(m => {
        const adj = parseNoun(m).adjectives;
        if (adj.found) {
          res = res.concat(adj);
        }
      });
      return res.getNth(n)
    }

    toPlural(n) {
      return this.getNth(n).map(m => {
        return nounToPlural(m, parseNoun(m))
      })
      // return new Nouns(all.document, all.pointer)
    }

    toSingular(n) {
      return this.getNth(n).map(m => {
        const res = parseNoun(m);
        return nounToSingular(m, res)
      })
    }
    // create a new View, from this one
    update(pointer) {
      const m = new Nouns(this.document, pointer);
      m._cache = this._cache; // share this full thing
      return m
    }
  }
  View.prototype.nouns = function (n) {
    let m = findNouns(this);
    m = m.getNth(n);
    return new Nouns(this.document, m.pointer)
  };
};

var nouns = {
  api: api$7,
};

const findFractions = function (doc, n) {
  // five eighths
  let m = doc.match('#Fraction+');
  // remove 'two and five eights'
  m = m.filter(r => {
    return !r.lookBehind('#Value and$').found
  });
  // thirty seconds
  m = m.notIf('#Value seconds');
  return m
};

//support global multipliers, like 'half-million' by doing 'million' then multiplying by 0.5
const findModifiers = str => {
  const mults = [
    {
      reg: /^(minus|negative)[\s-]/i,
      mult: -1,
    },
    {
      reg: /^(a\s)?half[\s-](of\s)?/i,
      mult: 0.5,
    },
    //  {
    //   reg: /^(a\s)?quarter[\s\-]/i,
    //   mult: 0.25
    // }
  ];
  for (let i = 0; i < mults.length; i++) {
    if (mults[i].reg.test(str) === true) {
      return {
        amount: mults[i].mult,
        str: str.replace(mults[i].reg, ''),
      }
    }
  }
  return {
    amount: 1,
    str: str,
  }
};

var words = {
  ones: {
    zeroth: 0,
    first: 1,
    second: 2,
    third: 3,
    fourth: 4,
    fifth: 5,
    sixth: 6,
    seventh: 7,
    eighth: 8,
    ninth: 9,
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  },
  teens: {
    tenth: 10,
    eleventh: 11,
    twelfth: 12,
    thirteenth: 13,
    fourteenth: 14,
    fifteenth: 15,
    sixteenth: 16,
    seventeenth: 17,
    eighteenth: 18,
    nineteenth: 19,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
  },
  tens: {
    twentieth: 20,
    thirtieth: 30,
    fortieth: 40,
    fourtieth: 40,
    fiftieth: 50,
    sixtieth: 60,
    seventieth: 70,
    eightieth: 80,
    ninetieth: 90,
    twenty: 20,
    thirty: 30,
    forty: 40,
    fourty: 40,
    fifty: 50,
    sixty: 60,
    seventy: 70,
    eighty: 80,
    ninety: 90,
  },
  multiples: {
    hundredth: 100,
    thousandth: 1000,
    millionth: 1e6,
    billionth: 1e9,
    trillionth: 1e12,
    quadrillionth: 1e15,
    quintillionth: 1e18,
    sextillionth: 1e21,
    septillionth: 1e24,
    hundred: 100,
    thousand: 1000,
    million: 1e6,
    billion: 1e9,
    trillion: 1e12,
    quadrillion: 1e15,
    quintillion: 1e18,
    sextillion: 1e21,
    septillion: 1e24,
    grand: 1000,
  },
};

//prevent things like 'fifteen ten', and 'five sixty'
const isValid = (w, has) => {
  if (words.ones.hasOwnProperty(w)) {
    if (has.ones || has.teens) {
      return false
    }
  } else if (words.teens.hasOwnProperty(w)) {
    if (has.ones || has.teens || has.tens) {
      return false
    }
  } else if (words.tens.hasOwnProperty(w)) {
    if (has.ones || has.teens || has.tens) {
      return false
    }
  }
  return true
};

//concatenate into a string with leading '0.'
const parseDecimals = function (arr) {
  let str = '0.';
  for (let i = 0; i < arr.length; i++) {
    const w = arr[i];
    if (words.ones.hasOwnProperty(w) === true) {
      str += words.ones[w];
    } else if (words.teens.hasOwnProperty(w) === true) {
      str += words.teens[w];
    } else if (words.tens.hasOwnProperty(w) === true) {
      str += words.tens[w];
    } else if (/^[0-9]$/.test(w) === true) {
      str += w;
    } else {
      return 0
    }
  }
  return parseFloat(str)
};

//parse a string like "4,200.1" into Number 4200.1
const parseNumeric$1 = str => {
  //remove ordinal - 'th/rd'
  str = str.replace(/1st$/, '1');
  str = str.replace(/2nd$/, '2');
  str = str.replace(/3rd$/, '3');
  str = str.replace(/([4567890])r?th$/, '$1');
  //remove prefixes
  str = str.replace(/^[$€¥£¢]/, '');
  //remove suffixes
  str = str.replace(/[%$€¥£¢]$/, '');
  //remove commas
  str = str.replace(/,/g, '');
  //split '5kg' from '5'
  str = str.replace(/([0-9])([a-z\u00C0-\u00FF]{1,2})$/, '$1');
  return str
};

const improperFraction = /^([0-9,. ]+)\/([0-9,. ]+)$/;

//some numbers we know
const casualForms = {
  'a few': 3,
  'a couple': 2,
  'a dozen': 12,
  'two dozen': 24,
  zero: 0,
};

// a 'section' is something like 'fifty-nine thousand'
// turn a section into something we can add to - like 59000
const section_sum = obj => {
  return Object.keys(obj).reduce((sum, k) => {
    sum += obj[k];
    return sum
  }, 0)
};

//turn a string into a number
const parse$2 = function (str) {
  //convert some known-numbers
  if (casualForms.hasOwnProperty(str) === true) {
    return casualForms[str]
  }
  //'a/an' is 1
  if (str === 'a' || str === 'an') {
    return 1
  }
  const modifier = findModifiers(str);
  str = modifier.str;
  let last_mult = null;
  let has = {};
  let sum = 0;
  let isNegative = false;
  const terms = str.split(/[ -]/);
  // const isFraction = findFraction(terms)
  for (let i = 0; i < terms.length; i++) {
    let w = terms[i];
    w = parseNumeric$1(w);

    if (!w || w === 'and') {
      continue
    }
    if (w === '-' || w === 'negative') {
      isNegative = true;
      continue
    }
    if (w.charAt(0) === '-') {
      isNegative = true;
      w = w.substring(1);
    }

    //decimal mode
    if (w === 'point') {
      sum += section_sum(has);
      sum += parseDecimals(terms.slice(i + 1, terms.length));
      sum *= modifier.amount;
      return sum
    }

    //improper fraction
    const fm = w.match(improperFraction);
    if (fm) {
      const num = parseFloat(fm[1].replace(/[, ]/g, ''));
      const denom = parseFloat(fm[2].replace(/[, ]/g, ''));
      if (denom) {
        sum += num / denom || 0;
      }
      continue
    }
    // try to support 'two fifty'
    if (words.tens.hasOwnProperty(w)) {
      if (has.ones && Object.keys(has).length === 1) {
        sum = has.ones * 100;
        has = {};
      }
    }

    //prevent mismatched units, like 'seven eleven' if not a fraction
    if (isValid(w, has) === false) {
      return null
    }

    //buildOut section, collect 'has' values
    if (/^[0-9.]+$/.test(w)) {
      has.ones = parseFloat(w); //not technically right
    } else if (words.ones.hasOwnProperty(w) === true) {
      has.ones = words.ones[w];
    } else if (words.teens.hasOwnProperty(w) === true) {
      has.teens = words.teens[w];
    } else if (words.tens.hasOwnProperty(w) === true) {
      has.tens = words.tens[w];
    } else if (words.multiples.hasOwnProperty(w) === true) {
      let mult = words.multiples[w];

      //something has gone wrong : 'two hundred five hundred'
      //possibly because it's a fraction
      if (mult === last_mult) {
        return null
      }
      //support 'hundred thousand'
      //this one is tricky..
      if (mult === 100 && terms[i + 1] !== undefined) {
        const w2 = terms[i + 1];
        if (words.multiples[w2]) {
          mult *= words.multiples[w2]; //hundredThousand/hundredMillion
          i += 1;
        }
      }
      //natural order of things
      //five thousand, one hundred..
      if (last_mult === null || mult < last_mult) {
        sum += (section_sum(has) || 1) * mult;
        last_mult = mult;
        has = {};
      } else {
        //maybe hundred .. thousand
        sum += section_sum(has);
        last_mult = mult;
        sum = (sum || 1) * mult;
        has = {};
      }
    }
  }
  //dump the remaining has values
  sum += section_sum(has);
  //post-process add modifier
  sum *= modifier.amount;
  sum *= isNegative ? -1 : 1;
  //dont return 0, if it went straight-through
  if (sum === 0 && Object.keys(has).length === 0) {
    return null
  }
  return sum
};

const endS = /s$/;

// just using .toNumber() again may risk an infinite-loop
const parseNumber$1 = function (m) {
  const str = m.text('reduced');
  return parse$2(str)
};

const mapping = {
  half: 2,
  halve: 2,
  quarter: 4,
};

const slashForm = function (m) {
  const str = m.text('reduced');
  const found = str.match(/^([-+]?[0-9]+)\/([-+]?[0-9]+)(st|nd|rd|th)?s?$/);
  if (found && found[1] && found[0]) {
    return {
      numerator: Number(found[1]),
      denominator: Number(found[2]),
    }
  }
  return null
};

// parse '4 out of 4'
const nOutOfN = function (m) {
  const found = m.match('[<num>#Value+] out of every? [<den>#Value+]');
  if (found.found !== true) {
    return null
  }
  let { num, den } = found.groups();
  if (!num || !den) {
    return null
  }
  num = parseNumber$1(num);
  den = parseNumber$1(den);
  if (!num || !den) {
    return null
  }
  if (typeof num === 'number' && typeof den === 'number') {
    return {
      numerator: num,
      denominator: den,
    }
  }
  return null
};

// parse 'five thirds'
const nOrinalth = function (m) {
  const found = m.match('[<num>(#Cardinal|a)+] [<den>#Fraction+]');
  if (found.found !== true) {
    return null
  }
  let { num, den } = found.groups();
  // -- parse numerator---
  // quick-support for 'a third'
  if (num.has('a')) {
    num = 1;
  } else {
    // abuse the number-parser for 'thirty three'
    // let tmp = num.clone().unTag('Fraction')
    // num = tmp.numbers().get()[0]
    num = parseNumber$1(num);
  }
  // -- parse denominator --
  // turn 'thirds' into third
  let str = den.text('reduced');
  if (endS.test(str)) {
    str = str.replace(endS, '');
    den = den.replaceWith(str);
  }
  // support 'one half' as '1/2'
  if (mapping.hasOwnProperty(str)) {
    den = mapping[str];
  } else {
    // dem = dem.numbers().get()[0]
    den = parseNumber$1(den);
  }
  if (typeof num === 'number' && typeof den === 'number') {
    return {
      numerator: num,
      denominator: den,
    }
  }
  return null
};

// implied 1 in '100th of a', 'fifth of a'
const oneNth = function (m) {
  const found = m.match('^#Ordinal$');
  if (found.found !== true) {
    return null
  }
  // ensure it's '100th of a '
  if (m.lookAhead('^of .')) {
    // let num = found.numbers().get()[0]
    const num = parseNumber$1(found);
    return {
      numerator: 1,
      denominator: num,
    }
  }
  return null
};

// 'half'
const named = function (m) {
  const str = m.text('reduced');
  if (mapping.hasOwnProperty(str)) {
    return { numerator: 1, denominator: mapping[str] }
  }
  return null
};

const round = n => {
  const rounded = Math.round(n * 1000) / 1000;
  // don't round 1 millionth down into 0
  if (rounded === 0 && n !== 0) {
    return n
  }
  return rounded
};

const parseFraction = function (m) {
  m = m.clone();
  const res = named(m) || slashForm(m) || nOutOfN(m) || nOrinalth(m) || oneNth(m) || null;
  if (res !== null) {
    // do the math
    if (res.numerator && res.denominator) {
      res.decimal = res.numerator / res.denominator;
      res.decimal = round(res.decimal);
    }
  }
  return res
};

/**
 * turn big numbers, like 2.3e+22, into a string with a ton of trailing 0's
 * */
const numToString = function (n) {
  if (n < 1000000) {
    return String(n)
  }
  let str;
  if (typeof n === 'number') {
    str = n.toFixed(0);
  } else {
    str = n;
  }
  if (str.indexOf('e+') === -1) {
    return str
  }
  return str
    .replace('.', '')
    .split('e+')
    .reduce(function (p, b) {
      return p + Array(b - p.length + 2).join(0)
    })
};
// console.log(numToString(2.5e+22));

const tens_mapping = [
  ['ninety', 90],
  ['eighty', 80],
  ['seventy', 70],
  ['sixty', 60],
  ['fifty', 50],
  ['forty', 40],
  ['thirty', 30],
  ['twenty', 20],
];
const ones_mapping = [
  '',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];

const sequence = [
  [1e24, 'septillion'],
  [1e20, 'hundred sextillion'],
  [1e21, 'sextillion'],
  [1e20, 'hundred quintillion'],
  [1e18, 'quintillion'],
  [1e17, 'hundred quadrillion'],
  [1e15, 'quadrillion'],
  [1e14, 'hundred trillion'],
  [1e12, 'trillion'],
  [1e11, 'hundred billion'],
  [1e9, 'billion'],
  [1e8, 'hundred million'],
  [1e6, 'million'],
  [100000, 'hundred thousand'],
  [1000, 'thousand'],
  [100, 'hundred'],
  [1, 'one'],
];

/**
 * turns an integer/float into.ber, like 'fifty-five'
 */

//turn number into an array of magnitudes, like [[5, million], [2, hundred]]
const breakdown_magnitudes = function (num) {
  let working = num;
  const have = [];
  sequence.forEach(a => {
    if (num >= a[0]) {
      const howmany = Math.floor(working / a[0]);
      working -= howmany * a[0];
      if (howmany) {
        have.push({
          unit: a[1],
          count: howmany,
        });
      }
    }
  });
  return have
};

//turn numbers from 100-0 into their text
const breakdown_hundred = function (num) {
  const arr = [];
  if (num > 100) {
    return arr //something bad happened..
  }
  for (let i = 0; i < tens_mapping.length; i++) {
    if (num >= tens_mapping[i][1]) {
      num -= tens_mapping[i][1];
      arr.push(tens_mapping[i][0]);
    }
  }
  //(hopefully) we should only have 20-0 now
  if (ones_mapping[num]) {
    arr.push(ones_mapping[num]);
  }
  return arr
};

/** print-out 'point eight nine'*/
const handle_decimal = num => {
  const names = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const arr = [];
  //parse it out like a string, because js math is such shit
  const str = numToString(num);
  const decimal = str.match(/\.([0-9]+)/);
  if (!decimal || !decimal[0]) {
    return arr
  }
  arr.push('point');
  const decimals = decimal[0].split('');
  for (let i = 0; i < decimals.length; i++) {
    arr.push(names[decimals[i]]);
  }
  return arr
};

/** turns an integer into a textual number */
const toText$1 = function (obj) {
  let num = obj.num;
  // handle zero, quickly
  if (num === 0 || num === '0') {
    return 'zero' // no?
  }
  //big numbers, north of sextillion, aren't gonna work well..
  //keep them small..
  if (num > 1e21) {
    num = numToString(num);
  }
  let arr = [];
  //handle negative numbers
  if (num < 0) {
    arr.push('minus');
    num = Math.abs(num);
  }
  //break-down into units, counts
  const units = breakdown_magnitudes(num);
  //build-up the string from its components
  for (let i = 0; i < units.length; i++) {
    let unit_name = units[i].unit;
    if (unit_name === 'one') {
      unit_name = '';
      //put an 'and' in here
      if (arr.length > 1) {
        arr.push('and');
      }
    }
    arr = arr.concat(breakdown_hundred(units[i].count));
    arr.push(unit_name);
  }
  //also support decimals - 'point eight'
  arr = arr.concat(handle_decimal(num));
  //remove empties
  arr = arr.filter(s => s);
  if (arr.length === 0) {
    arr[0] = '';
  }
  return arr.join(' ')
};

// console.log(to_text(-1000.8));

const toCardinal = function (obj) {
  if (!obj.numerator || !obj.denominator) {
    return ''
  }
  const a = toText$1({ num: obj.numerator });
  const b = toText$1({ num: obj.denominator });
  return `${a} out of ${b}`
};

const irregulars = {
  one: 'first',
  two: 'second',
  three: 'third',
  five: 'fifth',
  eight: 'eighth',
  nine: 'ninth',
  twelve: 'twelfth',
  twenty: 'twentieth',
  thirty: 'thirtieth',
  forty: 'fortieth',
  fourty: 'fourtieth',
  fifty: 'fiftieth',
  sixty: 'sixtieth',
  seventy: 'seventieth',
  eighty: 'eightieth',
  ninety: 'ninetieth',
};

/**
 * convert a javascript number to 'twentieth' format
 * */
const textOrdinal = obj => {
  const words = toText$1(obj).split(' ');
  //convert the last number to an ordinal
  const last = words[words.length - 1];
  if (irregulars.hasOwnProperty(last)) {
    words[words.length - 1] = irregulars[last];
  } else {
    words[words.length - 1] = last.replace(/y$/, 'i') + 'th';
  }
  return words.join(' ')
};

const toOrdinal = function (obj) {
  // don't divide by zero!
  if (!obj.numerator || !obj.denominator) {
    return ''
  }
  // create [two] [fifths]
  const start = toText$1({ num: obj.numerator });
  let end = textOrdinal({ num: obj.denominator });
  // 'one secondth' -> 'one half'
  if (obj.denominator === 2) {
    end = 'half';
  }
  if (start && end) {
    if (obj.numerator !== 1) {
      end += 's';
    }
    return `${start} ${end}`
  }
  return ''
};

const plugin$2 = function (View) {
  /**
   */
  class Fractions extends View {
    constructor(document, pointer, groups) {
      super(document, pointer, groups);
      this.viewType = 'Fractions';
    }
    parse(n) {
      return this.getNth(n).map(parseFraction)
    }
    get(n) {
      return this.getNth(n).map(parseFraction)
    }
    json(n) {
      return this.getNth(n).map(p => {
        const json = p.toView().json(n)[0];
        const parsed = parseFraction(p);
        json.fraction = parsed;
        return json
      }, [])
    }
    // become 0.5
    toDecimal(n) {
      this.getNth(n).forEach(m => {
        const { decimal } = parseFraction(m);
        m = m.replaceWith(String(decimal), true);
        m.tag('NumericValue');
        m.unTag('Fraction');
      });
      return this
    }
    toFraction(n) {
      this.getNth(n).forEach(m => {
        const obj = parseFraction(m);
        if (obj && typeof obj.numerator === 'number' && typeof obj.denominator === 'number') {
          const str = `${obj.numerator}/${obj.denominator}`;
          this.replace(m, str);
        }
      });
      return this
    }
    toOrdinal(n) {
      this.getNth(n).forEach(m => {
        const obj = parseFraction(m);
        let str = toOrdinal(obj);
        if (m.after('^#Noun').found) {
          str += ' of'; // three fifths of dentists
        }
        m.replaceWith(str);
      });
      return this
    }
    toCardinal(n) {
      this.getNth(n).forEach(m => {
        const obj = parseFraction(m);
        const str = toCardinal(obj);
        m.replaceWith(str);
      });
      return this
    }
    toPercentage(n) {
      this.getNth(n).forEach(m => {
        const { decimal } = parseFraction(m);
        let percent = decimal * 100;
        percent = Math.round(percent * 100) / 100; // round it
        m.replaceWith(`${percent}%`);
      });
      return this
    }
  }

  View.prototype.fractions = function (n) {
    let m = findFractions(this);
    m = m.getNth(n);
    return new Fractions(this.document, m.pointer)
  };
};

const ones = 'one|two|three|four|five|six|seven|eight|nine';
const tens = 'twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|fourty';
const teens = 'eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen';

// this is a bit of a mess
// segment consecutive number-words into sensible chunks
const findNumbers = function (doc) {
  let m = doc.match('#Value+');

  //"50 83"
  if (m.has('#NumericValue #NumericValue')) {
    //a comma may mean two numbers
    if (m.has('#Value @hasComma #Value')) {
      m.splitAfter('@hasComma');
    } else if (m.has('#NumericValue #Fraction')) {
      m.splitAfter('#NumericValue #Fraction');
    } else {
      m = m.splitAfter('#NumericValue');
    }
  }

  //three-length
  if (m.has('#Value #Value #Value') && !m.has('#Multiple')) {
    //twenty-five-twenty
    if (m.has('(' + tens + ') #Cardinal #Cardinal')) {
      m = m.splitAfter('(' + tens + ') #Cardinal');
    }
  }

  //two-length ones
  if (m.has('#Value #Value')) {
    //june 21st 1992 is two seperate values
    if (m.has('#NumericValue #NumericValue')) {
      m = m.splitOn('#Year');
    }
    //sixty fifteen
    if (m.has('(' + tens + ') (' + teens + ')')) {
      m = m.splitAfter('(' + tens + ')');
    }

    //"72 82"
    const double = m.match('#Cardinal #Cardinal');
    if (double.found && !m.has('(point|decimal|#Fraction)')) {
      //not 'two hundred'
      if (!double.has('#Cardinal (#Multiple|point|decimal)')) {
        // two fifty five
        const noMultiple = m.has(`(${ones}) (${tens})`);
        // twenty one
        const tensVal = double.has('(' + tens + ') #Cardinal');
        // hundredOne
        const multVal = double.has('#Multiple #Value');
        //one proper way, 'twenty one', or 'hundred one'
        if (!noMultiple && !tensVal && !multVal) {
          // double = double.firstTerm()
          double.terms().forEach(d => {
            m = m.splitOn(d);
          });
        }
      }
    }

    //seventh fifth
    if (m.match('#Ordinal #Ordinal').match('#TextValue').found && !m.has('#Multiple')) {
      //the one proper way, 'twenty first'
      if (!m.has('(' + tens + ') #Ordinal')) {
        m = m.splitAfter('#Ordinal');
      }
    }
    // one thirty am != 130
    if (m.has('#Time')) {
      m = m.splitOn('#Time');
    }
    //fifth five
    m = m.splitBefore('#Ordinal [#Cardinal]', 0);
    //five 2017 (support '5 hundred', and 'twenty 5'
    if (m.has('#TextValue #NumericValue') && !m.has('(' + tens + '|#Multiple)')) {
      m = m.splitBefore('#TextValue #NumericValue');
    }
  }

  //5-8
  m = m.splitAfter('#NumberRange');
  // june 5th 1999
  m = m.splitBefore('#Year');
  return m
};

const parseNumeric = function (str, m) {
  str = str.replace(/,/g, '');
  //parse a numeric-number
  const arr = str.split(/([0-9.,]*)/);
  // eslint-disable-next-line prefer-const
  let [prefix, num] = arr;
  let suffix = arr.slice(2).join('');
  if (num !== '' && m.length < 2) {
    num = Number(num || str);
    //ensure that num is an actual number
    if (typeof num !== 'number') {
      num = null;
    }
    // strip an ordinal off the suffix
    suffix = suffix || '';
    if (suffix === 'st' || suffix === 'nd' || suffix === 'rd' || suffix === 'th') {
      suffix = '';
    }
    // support M for million, k for thousand
    // if (suffix === 'm' || suffix === 'M') {
    //   num *= 1000000
    //   suffix = ''
    // }
    // if (suffix === 'k' || suffix === 'k') {
    //   num *= 1000
    //   suffix = ''
    // }
    return {
      prefix: prefix || '',
      num: num,
      suffix: suffix,
    }
  }
  return null
};

// get a numeric value from this phrase
const parseNumber = function (m) {
  if (typeof m === 'string') {
    return { num: parse$2(m) }
  }
  let str = m.text('reduced');
  // reach for '12 litres'
  const unit = m.growRight('#Unit').match('#Unit$').text('machine');
  // is it in '3,123' format?
  const hasComma = /[0-9],[0-9]/.test(m.text('text'));
  // parse a numeric-number like '$4.00'
  if (m.terms().length === 1 && !m.has('#Multiple')) {
    const res = parseNumeric(str, m);
    if (res !== null) {
      res.hasComma = hasComma;
      res.unit = unit;
      return res
    }
  }
  // -- parse text-formats --
  // Fractions: remove 'and a half' etc. from the end
  let frPart = m.match('#Fraction{2,}$');
  frPart = frPart.found === false ? m.match('^#Fraction$') : frPart;
  let fraction = null;
  if (frPart.found) {
    if (frPart.has('#Value and #Value #Fraction')) {
      frPart = frPart.match('and #Value #Fraction');
    }
    fraction = parseFraction(frPart);
    // remove it from our string
    m = m.not(frPart);
    m = m.not('and$');
    str = m.text('reduced');
  }
  let num = 0;
  if (str) {
    num = parse$2(str) || 0;
  }
  // apply numeric fraction
  if (fraction && fraction.decimal) {
    num += fraction.decimal;
  }


  return {
    hasComma,
    prefix: '',
    num,
    suffix: '',
    isOrdinal: m.has('#Ordinal'),
    isText: m.has('#TextValue'),
    isFraction: m.has('#Fraction'),
    isMoney: m.has('#Money'),
    unit
  }
};

/**
 * turn a number like 5 into an ordinal like 5th
 */
const numOrdinal = function (obj) {
  const num = obj.num;
  if (!num && num !== 0) {
    return null
  }
  //the teens are all 'th'
  const tens = num % 100;
  if (tens > 10 && tens < 20) {
    return String(num) + 'th'
  }
  //the rest of 'em
  const mapping = {
    0: 'th',
    1: 'st',
    2: 'nd',
    3: 'rd',
  };
  let str = numToString(num);
  const last = str.slice(str.length - 1, str.length);
  if (mapping[last]) {
    str += mapping[last];
  } else {
    str += 'th';
  }
  return str
};

const prefixes = {
  '¢': 'cents',
  $: 'dollars',
  '£': 'pounds',
  '¥': 'yen',
  '€': 'euros',
  '₡': 'colón',
  '฿': 'baht',
  '₭': 'kip',
  '₩': 'won',
  '₹': 'rupees',
  '₽': 'ruble',
  '₺': 'liras',
};
const suffixes = {
  '%': 'percent',
  // s: 'seconds',
  // cm: 'centimetres',
  // km: 'kilometres',
  // ft: 'feet',
  '°': 'degrees'
};

const addSuffix = function (obj) {
  const res = {
    suffix: '',
    prefix: obj.prefix,
  };
  // $5 to 'five dollars'
  if (prefixes.hasOwnProperty(obj.prefix)) {
    res.suffix += ' ' + prefixes[obj.prefix];
    res.prefix = '';
  }
  // 5% to 'five percent'
  if (suffixes.hasOwnProperty(obj.suffix)) {
    res.suffix += ' ' + suffixes[obj.suffix];
  }
  if (res.suffix && obj.num === 1) {
    res.suffix = res.suffix.replace(/s$/, '');
  }
  // misc other suffixes
  if (!res.suffix && obj.suffix) {
    res.suffix += ' ' + obj.suffix;
  }
  return res
};

const format = function (obj, fmt) {
  if (fmt === 'TextOrdinal') {
    const { prefix, suffix } = addSuffix(obj);
    return prefix + textOrdinal(obj) + suffix
  }
  if (fmt === 'Ordinal') {
    return obj.prefix + numOrdinal(obj) + obj.suffix
  }
  if (fmt === 'TextCardinal') {
    const { prefix, suffix } = addSuffix(obj);
    return prefix + toText$1(obj) + suffix
  }
  // assume Cardinal
  let num = obj.num;
  if (obj.hasComma) {
    num = num.toLocaleString();
  }
  return obj.prefix + String(num) + obj.suffix
};

const isArray = arr => Object.prototype.toString.call(arr) === '[object Array]';

// turn anything into {foo:true} format
const coerceToObject = function (input) {
  if (typeof input === 'string' || typeof input === 'number') {
    const tmp = {};
    tmp[input] = true;
    return tmp
  }
  if (isArray(input)) {
    return input.reduce((h, s) => {
      h[s] = true;
      return h
    }, {})
  }
  return input || {}
};

// only return values with the given unit
const isUnit = function (doc, input = {}) {
  input = coerceToObject(input);
  return doc.filter(p => {
    const { unit } = parseNumber(p);
    if (unit && input[unit] === true) {
      return true
    }
    return false
  })
};

const addMethod$2 = function (View) {
  /**   */
  class Numbers extends View {
    constructor(document, pointer, groups) {
      super(document, pointer, groups);
      this.viewType = 'Numbers';
    }
    parse(n) {
      return this.getNth(n).map(parseNumber)
    }
    get(n) {
      return this.getNth(n)
        .map(parseNumber)
        .map(o => o.num)
    }
    json(n) {
      const opts = typeof n === 'object' ? n : {};
      return this.getNth(n).map(p => {
        const json = p.toView().json(opts)[0];
        const parsed = parseNumber(p);
        json.number = {
          prefix: parsed.prefix,
          num: parsed.num,
          suffix: parsed.suffix,
          hasComma: parsed.hasComma,
          unit: parsed.unit,
        };
        return json
      }, [])
    }
    /** any known measurement unit, for the number */
    units() {
      return this.growRight('#Unit').match('#Unit$')
    }
    /** return values that match a given unit */
    isUnit(allowed) {
      return isUnit(this, allowed)
    }
    /** return only ordinal numbers */
    isOrdinal() {
      return this.if('#Ordinal')
    }
    /** return only cardinal numbers*/
    isCardinal() {
      return this.if('#Cardinal')
    }

    /** convert to numeric form like '8' or '8th' */
    toNumber() {
      const res = this.map(val => {
        if (!this.has('#TextValue')) {
          return val
        }
        const obj = parseNumber(val);
        if (obj.num === null) {
          return val
        }
        const fmt = val.has('#Ordinal') ? 'Ordinal' : 'Cardinal';
        const str = format(obj, fmt);
        val.replaceWith(str, { tags: true });
        return val.tag('NumericValue')
      });
      return new Numbers(res.document, res.pointer)
    }
    /** add commas, or nicer formatting for numbers */
    toLocaleString() {
      const m = this;
      m.forEach(val => {
        const obj = parseNumber(val);
        if (obj.num === null) {
          return
        }
        let num = obj.num.toLocaleString();
        // support ordinal ending, too
        if (val.has('#Ordinal')) {
          const str = format(obj, 'Ordinal');
          const end = str.match(/[a-z]+$/);
          if (end) {
            num += end[0] || '';
          }
        }
        val.replaceWith(num, { tags: true });
      });
      return this
    }
    /** convert to numeric form like 'eight' or 'eighth' */
    toText() {
      const m = this;
      const res = m.map(val => {
        if (val.has('#TextValue')) {
          return val
        }
        const obj = parseNumber(val);
        if (obj.num === null) {
          return val
        }
        const fmt = val.has('#Ordinal') ? 'TextOrdinal' : 'TextCardinal';
        const str = format(obj, fmt);
        val.replaceWith(str, { tags: true });
        val.tag('TextValue');
        return val
      });
      return new Numbers(res.document, res.pointer)
    }
    /** convert ordinal to cardinal form, like 'eight', or '8' */
    toCardinal() {
      const m = this;
      const res = m.map(val => {
        if (!val.has('#Ordinal')) {
          return val
        }
        const obj = parseNumber(val);
        if (obj.num === null) {
          return val
        }
        const fmt = val.has('#TextValue') ? 'TextCardinal' : 'Cardinal';
        const str = format(obj, fmt);
        val.replaceWith(str, { tags: true });
        val.tag('Cardinal');
        return val
      });
      return new Numbers(res.document, res.pointer)
    }
    /** convert cardinal to ordinal form, like 'eighth', or '8th' */
    toOrdinal() {
      const m = this;
      const res = m.map(val => {
        if (val.has('#Ordinal')) {
          return val
        }
        const obj = parseNumber(val);
        if (obj.num === null) {
          return val
        }
        const fmt = val.has('#TextValue') ? 'TextOrdinal' : 'Ordinal';
        const str = format(obj, fmt);
        val.replaceWith(str, { tags: true });
        val.tag('Ordinal');
        return val
      });
      return new Numbers(res.document, res.pointer)
    }

    /** return only numbers that are == n */
    isEqual(n) {
      return this.filter(val => {
        const num = parseNumber(val).num;
        return num === n
      })
    }
    /** return only numbers that are > n*/
    greaterThan(n) {
      return this.filter(val => {
        const num = parseNumber(val).num;
        return num > n
      })
    }
    /** return only numbers that are < n*/
    lessThan(n) {
      return this.filter(val => {
        const num = parseNumber(val).num;
        return num < n
      })
    }
    /** return only numbers > min and < max */
    between(min, max) {
      return this.filter(val => {
        const num = parseNumber(val).num;
        return num > min && num < max
      })
    }
    /** set these number to n */
    set(n) {
      if (n === undefined) {
        return this // don't bother
      }
      if (typeof n === 'string') {
        n = parseNumber(n).num;
      }
      const m = this;
      const res = m.map(val => {
        const obj = parseNumber(val);
        obj.num = n;
        if (obj.num === null) {
          return val
        }
        let fmt = val.has('#Ordinal') ? 'Ordinal' : 'Cardinal';
        if (val.has('#TextValue')) {
          fmt = val.has('#Ordinal') ? 'TextOrdinal' : 'TextCardinal';
        }
        let str = format(obj, fmt);
        // add commas to number
        if (obj.hasComma && fmt === 'Cardinal') {
          str = Number(str).toLocaleString();
        }
        val = val.not('#Currency');
        val.replaceWith(str, { tags: true });
        // handle plural/singular unit
        // agreeUnits(agree, val, obj)
        return val
      });
      return new Numbers(res.document, res.pointer)
    }
    add(n) {
      if (!n) {
        return this // don't bother
      }
      if (typeof n === 'string') {
        n = parseNumber(n).num;
      }
      const m = this;
      const res = m.map(val => {
        const obj = parseNumber(val);
        if (obj.num === null) {
          return val
        }
        obj.num += n;
        let fmt = val.has('#Ordinal') ? 'Ordinal' : 'Cardinal';
        if (obj.isText) {
          fmt = val.has('#Ordinal') ? 'TextOrdinal' : 'TextCardinal';
        }
        const str = format(obj, fmt);
        val.replaceWith(str, { tags: true });
        // handle plural/singular unit
        // agreeUnits(agree, val, obj)
        return val
      });
      return new Numbers(res.document, res.pointer)
    }
    /** decrease each number by n*/
    subtract(n, agree) {
      return this.add(n * -1, agree)
    }
    /** increase each number by 1 */
    increment(agree) {
      return this.add(1, agree)
    }
    /** decrease each number by 1 */
    decrement(agree) {
      return this.add(-1, agree)
    }
    // overloaded - keep Numbers class
    update(pointer) {
      const m = new Numbers(this.document, pointer);
      m._cache = this._cache; // share this full thing
      return m
    }
  }
  // aliases
  Numbers.prototype.toNice = Numbers.prototype.toLocaleString;
  Numbers.prototype.isBetween = Numbers.prototype.between;
  Numbers.prototype.minus = Numbers.prototype.subtract;
  Numbers.prototype.plus = Numbers.prototype.add;
  Numbers.prototype.equals = Numbers.prototype.isEqual;

  View.prototype.numbers = function (n) {
    let m = findNumbers(this);
    m = m.getNth(n);
    return new Numbers(this.document, m.pointer)
  };
  View.prototype.percentages = function (n) {
    let m = findNumbers(this);
    m = m.filter(v => v.has('#Percent') || v.after('^percent'));
    m = m.getNth(n);
    return new Numbers(this.document, m.pointer)
  };
  View.prototype.money = function (n) {
    let m = findNumbers(this);
    m = m.filter(v => v.has('#Money') || v.after('^#Currency'));
    m = m.getNth(n);
    return new Numbers(this.document, m.pointer)
  };
  // alias
  View.prototype.values = View.prototype.numbers;
};

const api$6 = function (View) {
  plugin$2(View);
  addMethod$2(View);
};

var numbers = {
  api: api$6,

  // add @greaterThan, @lessThan
  // mutate: world => {
  //   let termMethods = world.methods.one.termMethods

  //   termMethods.lessThan = function (term) {
  //     return false //TODO: implement
  //     // return /[aeiou]/.test(term.text)
  //   }
  // },
};

const defaults$1 = {
  people: true,
  emails: true,
  phoneNumbers: true,
  places: true,
};

const redact = function (opts = {}) {
  opts = Object.assign({}, defaults$1, opts);
  if (opts.people !== false) {
    this.people().replaceWith('██████████');
  }
  if (opts.emails !== false) {
    this.emails().replaceWith('██████████');
  }
  if (opts.places !== false) {
    this.places().replaceWith('██████████');
  }
  if (opts.phoneNumbers !== false) {
    this.phoneNumbers().replaceWith('███████');
  }
  return this
};

const plugin$1 = {
  api: function (View) {
    View.prototype.redact = redact;
  }
};

//is this sentence asking a question?
const isQuestion = function (doc) {
  const clauses = doc.clauses();

  // Has ellipsis at the end means it's probably not a question
  // e.g., Is this just fantasy...
  if (/\.\.$/.test(doc.out('text'))) {
    return false
  }

  // Starts with question word, but has a comma, so probably not a question
  // e.g., Why are we caught in a land slide, no escape from reality
  if (doc.has('^#QuestionWord') && doc.has('@hasComma')) {
    return false
  }

  // do you see it or not
  if (doc.has('or not$')) {
    return true
  }

  // Starts with a #QuestionWord
  // e.g., What open your eyes look up to the skies and see
  if (doc.has('^#QuestionWord')) {
    return true
  }

  // Second word is a #QuestionWord
  // e.g., I'm what a poor boy
  // case ts.has('^\w+\s#QuestionWord'):
  // return true;

  // is it, do you - start of sentence
  // e.g., Do I need no sympathy
  if (doc.has('^(do|does|did|is|was|can|could|will|would|may) #Noun')) {
    return true
  }

  // these are a little more loose..
  // e.g., Must I be come easy come easy go
  if (doc.has('^(have|must) you')) {
    return true
  }

  // Clause starts with a question word
  // e.g., Anyway the wind blows, what doesn't really matter to me
  // if (clauses.has('^#QuestionWord')) {
  //   return true
  // }

  //is wayne gretskzy alive
  if (clauses.has('(do|does|is|was) #Noun+ #Adverb? (#Adjective|#Infinitive)$')) {
    return true
  }

  // Probably not a question
  return false
};

const findQuestions = function (view) {
  const hasQ = /\?/;
  const { document } = view;
  return view.filter(m => {
    const terms = m.docs[0] || [];
    const lastTerm = terms[terms.length - 1];
    // is it not a full sentence?
    if (!lastTerm || document[lastTerm.index[0]].length !== terms.length) {
      return false
    }
    // does it end with a question mark?
    if (hasQ.test(lastTerm.post)) {
      return true
    }
    // try to guess a sentence without a question-mark
    return isQuestion(m)
  })
};

// if a clause starts with these, it's not a main clause
const subordinate = `(after|although|as|because|before|if|since|than|that|though|when|whenever|where|whereas|wherever|whether|while|why|unless|until|once)`;
const relative = `(that|which|whichever|who|whoever|whom|whose|whomever)`;

//try to remove secondary clauses
const mainClause = function (s) {
  let m = s;
  if (m.length === 1) {
    return m
  }
  // if there's no verb, it's dependent
  m = m.if('#Verb');
  if (m.length === 1) {
    return m
  }
  // this is a signal for subordinate-clauses
  m = m.ifNo(subordinate);
  m = m.ifNo('^even (if|though)');
  m = m.ifNo('^so that');
  m = m.ifNo('^rather than');
  m = m.ifNo('^provided that');
  if (m.length === 1) {
    return m
  }
  // relative clauses
  m = m.ifNo(relative);
  if (m.length === 1) {
    return m
  }

  // check for subordinating conjunctions -- must be at the beginning of the clause
  m = m.ifNo('(^despite|^during|^before|^through|^throughout)');
  if (m.length === 1) {
    return m
  }

  // check for clauses beginning with Gerund ("Taking ..., ...")
  m = m.ifNo('^#Gerund');
  if (m.length === 1) {
    return m
  }

  // did we go too far?
  if (m.length === 0) {
    m = s;
  }
  // choose the first one?
  return m.eq(0)
};

const grammar = function (vb) {
  let tense = null;
  if (vb.has('#PastTense')) {
    tense = 'PastTense';
  } else if (vb.has('#FutureTense')) {
    tense = 'FutureTense';
  } else if (vb.has('#PresentTense')) {
    tense = 'PresentTense';
  }
  return {
    tense
  }
};

const parse$1 = function (s) {
  const clauses = s.clauses();
  const main = mainClause(clauses);
  const chunks = main.chunks();
  let subj = s.none();
  let verb = s.none();
  let pred = s.none();
  chunks.forEach((ch, i) => {
    if (i === 0 && !ch.has('<Verb>')) {
      subj = ch;
      return
    }
    if (!verb.found && ch.has('<Verb>')) {
      verb = ch;
      return
    }
    if (verb.found) {
      pred = pred.concat(ch);
    }
  });
  // cleanup a missed parse
  if (verb.found && !subj.found) {
    subj = verb.before('<Noun>+').first();
  }
  return {
    subj,
    verb,
    pred,
    grammar: grammar(verb)
  }
};

const toPast$2 = function (s) {
  let verbs = s.verbs();
  // translate the first verb, no-stress
  const first = verbs.eq(0);
  // already past
  if (first.has('#PastTense')) {
    return s
  }
  first.toPastTense();

  // force agreement with any 2nd/3rd verbs:
  if (verbs.length > 1) {
    verbs = verbs.slice(1);
    // remove any sorta infinitive - 'to engage'
    verbs = verbs.filter((v) => !v.lookBehind('to$').found);

    // keep -ing verbs
    verbs = verbs.if('#PresentTense');
    verbs = verbs.notIf('#Gerund');

    //run-on infinitive-list - 'to walk, sit and eat'
    const list = s.match('to #Verb+ #Conjunction #Verb').terms();
    verbs = verbs.not(list);

    // otherwise, I guess so?
    if (verbs.found) {
      verbs.verbs().toPastTense();
    }
  }

  // s.compute('chunks')
  return s
};

const toPresent$1 = function (s) {
  let verbs = s.verbs();
  // translate the first verb, no-stress
  const first = verbs.eq(0);
  // already present
  // if (first.has('#PresentTense')) {
  //   return s
  // }
  first.toPresentTense();

  // force agreement with any 2nd/3rd verbs:
  if (verbs.length > 1) {
    verbs = verbs.slice(1);
    // remove any sorta infinitive - 'to engage'
    verbs = verbs.filter((v) => !v.lookBehind('to$').found);

    // keep -ing verbs
    // verbs = verbs.if('#PresentTense')
    verbs = verbs.notIf('#Gerund');

    //run-on infinitive-list - 'to walk, sit and eat'
    // let list = s.match('to #Verb+ #Conjunction #Verb').terms()
    // verbs = verbs.not(list)

    // otherwise, I guess so?
    if (verbs.found) {
      verbs.verbs().toPresentTense();
    }
  }

  // s.compute('chunks')
  return s
};

const toFuture$1 = function (s) {
  let verbs = s.verbs();
  // translate the first verb, no-stress
  const first = verbs.eq(0);
  first.toFutureTense();
  s = s.fullSentence();
  verbs = s.verbs();//re-do it
  // verbs.debug()
  // force agreement with any 2nd/3rd verbs:
  if (verbs.length > 1) {
    verbs = verbs.slice(1);
    // which following-verbs should we also change?
    const toChange = verbs.filter((vb) => {
      // remove any sorta infinitive - 'to engage'
      if (vb.lookBehind('to$').found) {
        return false
      }
      // is watching
      if (vb.has('#Copula #Gerund')) {
        return true
      }
      // keep -ing verbs
      if (vb.has('#Gerund')) {
        return false
      }
      // he is green and he is friendly
      if (vb.has('#Copula')) {
        return true
      }
      // 'he will see when he watches'
      if (vb.has('#PresentTense') && !vb.has('#Infinitive') && vb.lookBefore('(he|she|it|that|which)$').found) {
        return false
      }
      return true
    });
    // otherwise, change em too
    if (toChange.found) {
      toChange.forEach(m => {
        //extra rules for 'is'
        if (m.has('#Copula')) {
          // when he was out..
          m.match('was').replaceWith('is');
          // when he is out
          m.match('is').replaceWith('will be');
          return
        }
        // if (m.has('#PastTense')) {
        //   m.toPresentTense()
        //   return
        // }
        m.toInfinitive();
      });
    }
  }
  return s
};

const toNegative$1 = function (s) {
  s.verbs().first().toNegative().compute('chunks');
  return s
};
const toPositive = function (s) {
  s.verbs().first().toPositive().compute('chunks');
  return s
};

const toInfinitive = function (s) {
  s.verbs().toInfinitive();
  // s.compute('chunks')
  return s
};

const api$5 = function (View) {
  class Sentences extends View {
    constructor(document, pointer, groups) {
      super(document, pointer, groups);
      this.viewType = 'Sentences';
    }
    json(opts = {}) {
      return this.map(m => {
        const json = m.toView().json(opts)[0] || {};
        const { subj, verb, pred, grammar } = parse$1(m);
        json.sentence = {
          subject: subj.text('normal'),
          verb: verb.text('normal'),
          predicate: pred.text('normal'),
          grammar
        };
        return json
      }, [])
    }
    toPastTense(n) {
      return this.getNth(n).map(s => {
        parse$1(s);
        return toPast$2(s)
      })
    }
    toPresentTense(n) {
      return this.getNth(n).map(s => {
        parse$1(s);
        return toPresent$1(s)
      })
    }
    toFutureTense(n) {
      return this.getNth(n).map(s => {
        parse$1(s);
        s = toFuture$1(s);
        return s
      })
    }
    toInfinitive(n) {
      return this.getNth(n).map(s => {
        parse$1(s);
        return toInfinitive(s)
      })
    }
    toNegative(n) {
      return this.getNth(n).map(vb => {
        parse$1(vb);
        return toNegative$1(vb)
      })
    }
    toPositive(n) {
      return this.getNth(n).map(vb => {
        parse$1(vb);
        return toPositive(vb)
      })
    }
    isQuestion(n) {
      return this.questions(n)
    }
    isExclamation(n) {
      const res = this.filter(s => s.lastTerm().has('@hasExclamation'));
      return res.getNth(n)
    }
    isStatement(n) {
      const res = this.filter(s => !s.isExclamation().found && !s.isQuestion().found);
      return res.getNth(n)
    }
    // overloaded - keep Sentences class
    update(pointer) {
      const m = new Sentences(this.document, pointer);
      m._cache = this._cache; // share this full thing
      return m
    }
  }
  // aliases
  Sentences.prototype.toPresent = Sentences.prototype.toPresentTense;
  Sentences.prototype.toPast = Sentences.prototype.toPastTense;
  Sentences.prototype.toFuture = Sentences.prototype.toFutureTense;

  const methods = {
    sentences: function (n) {
      let m = this.map(s => s.fullSentence());
      m = m.getNth(n);
      return new Sentences(this.document, m.pointer)
    },
    questions: function (n) {
      const m = findQuestions(this);
      return m.getNth(n)
    },
  };

  Object.assign(View.prototype, methods);
};

var sentences = { api: api$5 };

const find$2 = function (doc) {
  let m = doc.splitAfter('@hasComma');
  m = m.match('#Honorific+? #Person+');
  // Spencer's King
  const poss = m.match('#Possessive').notIf('(his|her)'); //her majesty ...
  m = m.splitAfter(poss);
  return m
};

const parse = function (m) {
  const res = {};
  res.firstName = m.match('#FirstName+');
  res.lastName = m.match('#LastName+');
  res.honorific = m.match('#Honorific+');

  const last = res.lastName;
  const first = res.firstName;
  if (!first.found || !last.found) {
    // let p = m.clone()
    // assume 'Mr Springer' is a last-name
    if (!first.found && !last.found && m.has('^#Honorific .$')) {
      res.lastName = m.match('.$');
      return res
    }
  }
  return res
};

/*
  Important notice - 
  this method makes many assumptions about gender-identity, in-order to assign grammatical gender.
  it should not be used for any other purposes, other than resolving pronouns in english
*/
const m = 'male';
const f = 'female';

// known gendered honorifics
const honorifics = {
  mr: m,
  mrs: f,
  miss: f,
  madam: f,

  // british stuff
  king: m,
  queen: f,
  duke: m,
  duchess: f,
  baron: m,
  baroness: f,
  count: m,
  countess: f,
  prince: m,
  princess: f,
  sire: m,
  dame: f,
  lady: f,

  ayatullah: m, //i think?

  congressman: m,
  congresswoman: f,
  'first lady': f,

  // marked as non-binary
  mx: null,
};

const predictGender = function (parsed, person) {
  const { firstName, honorific } = parsed;
  // use first-name as signal-signal
  if (firstName.has('#FemaleName')) {
    return f
  }
  if (firstName.has('#MaleName')) {
    return m
  }
  // use honorics as gender-signal
  if (honorific.found) {
    let hon = honorific.text('normal');
    hon = hon.replace(/\./g, ''); //clean it up a bit
    if (honorifics.hasOwnProperty(hon)) {
      return honorifics[hon]
    }
    // her excelency
    if (/^her /.test(hon)) {
      return f
    }
    if (/^his /.test(hon)) {
      return m
    }
  }
  // offer used-pronouns as a signal
  const after = person.after();
  if (!after.has('#Person') && after.has('#Pronoun')) {
    const pro = after.match('#Pronoun');
    // manual use of gender-neutral
    if (pro.has('(they|their)')) {
      return null
    }
    const hasMasc = pro.has('(he|his)');
    const hasFem = pro.has('(she|her|hers)');
    if (hasMasc && !hasFem) {
      return m
    }
    if (hasFem && !hasMasc) {
      return f
    }
  }
  return null
};

const addMethod$1 = function (View) {
  /**
   *
   */
  class People extends View {
    constructor(document, pointer, groups) {
      super(document, pointer, groups);
      this.viewType = 'People';
    }
    parse(n) {
      return this.getNth(n).map(parse)
    }
    json(n) {
      const opts = typeof n === 'object' ? n : {};
      return this.getNth(n).map(p => {
        const json = p.toView().json(opts)[0];
        const parsed = parse(p);
        json.person = {
          firstName: parsed.firstName.text('normal'),
          lastName: parsed.lastName.text('normal'),
          honorific: parsed.honorific.text('normal'),
          presumed_gender: predictGender(parsed, p),
        };
        return json
      }, [])
    }
    // used for co-reference resolution only
    presumedMale() {
      return this.filter(m => {
        return m.has('(#MaleName|mr|mister|sr|jr|king|pope|prince|sir)')//todo configure these in .world
      })
    }
    presumedFemale() {
      return this.filter(m => {
        return m.has('(#FemaleName|mrs|miss|queen|princess|madam)')
      })
    }
    // overloaded - keep People class
    update(pointer) {
      const m = new People(this.document, pointer);
      m._cache = this._cache; // share this full thing
      return m
    }
  }

  View.prototype.people = function (n) {
    let m = find$2(this);
    m = m.getNth(n);
    return new People(this.document, m.pointer)
  };
};

const find$1 = function (doc) {
  let m = doc.match('(#Place|#Address)+');

  // split all commas except for 'paris, france'
  let splits = m.match('@hasComma');
  splits = splits.filter(c => {
    // split 'europe, china'
    if (c.has('(asia|africa|europe|america)$')) {
      return true
    }
    // don't split 'paris, france'
    if (c.has('(#City|#Region|#ProperNoun)$') && c.after('^(#Country|#Region)').found) {
      return false
    }
    return true
  });
  m = m.splitAfter(splits);
  return m
};

const addMethod = function (View) {
  View.prototype.places = function (n) {
    let m = find$1(this);
    m = m.getNth(n);
    return new View(this.document, m.pointer)
  };
};

const api$4 = function (View) {
  View.prototype.organizations = function (n) {
    const m = this.match('#Organization+');
    return m.getNth(n)
  };
};

//combine them with .topics() method
const find = function (n) {
  const r = this.clauses();
  // Find people, places, and organizations
  let m = r.people();
  m = m.concat(r.places());
  m = m.concat(r.organizations());
  m = m.not('(someone|man|woman|mother|brother|sister|father)');
  //return them to normal ordering
  m = m.sort('seq');
  // m = m.unique()
  m = m.getNth(n);
  return m
};

const api$3 = function (View) {
  View.prototype.topics = find;
};

const api$2 = function (View) {
  addMethod$1(View);
  addMethod(View);
  api$4(View);
  api$3(View);
};
var topics = { api: api$2 };

const findVerbs = function (doc) {
  let m = doc.match('<Verb>');
  // want to see
  m = m.not('#Conjunction');
  // by walking
  m = m.not('#Preposition');


  m = m.splitAfter('@hasComma');

  // the reason he will is ...
  // all i do is talk
  m = m.splitAfter('[(do|did|am|was|is|will)] (is|was)', 0);
  // m = m.splitAfter('[(do|did|am|was|is|will)] #PresentTense', 0)

  // cool

  // like being pampered
  m = m.splitBefore('(#Verb && !#Copula) [being] #Verb', 0);
  // like to be pampered
  m = m.splitBefore('#Verb [to be] #Verb', 0);

  // implicit conjugation - 'help fix'

  m = m.splitAfter('[help] #PresentTense', 0);
  // what i can sell is..
  m = m.splitBefore('(#PresentTense|#PastTense) [#Copula]$', 0);
  // what i can sell will be
  m = m.splitBefore('(#PresentTense|#PastTense) [will be]$', 0);
  // directing had
  m = m.splitBefore('(#PresentTense|#PastTense) [(had|has)]', 0);

  // 'allow yourself'
  m = m.not('#Reflexive$');
  // sitting near
  m = m.not('#Adjective');

  // pastTense-pastTense
  // Everyone he [met] [told] him
  m = m.splitAfter('[#PastTense] #PastTense', 0);
  // Everyone he [met] had [told] him
  m = m.splitAfter('[#PastTense] #Auxiliary+ #PastTense', 0);

  // fans that were blowing felt amazing
  m = m.splitAfter('#Copula [#Gerund] #PastTense', 0);

  // managed to see
  // m = m.splitOn('#PastTense [to] #Infinitive', 0)


  //ensure there's actually a verb
  m = m.if('#Verb');
  // the reason he will is ...
  // ensure it's not two verbs
  // held annually is called
  if (m.has('(#Verb && !#Auxiliary) #Adverb+? #Copula')) {
    m = m.splitBefore('#Copula');
  }
  return m
};

// find the main verb, from a verb phrase
const getMain = function (vb) {
  let root = vb;
  if (vb.wordCount() > 1) {
    root = vb.not('(#Negative|#Auxiliary|#Modal|#Adverb|#Prefix)');
  }
  // fallback to just the last word, sometimes
  if (root.length > 1 && !root.has('#Phrasal #Particle')) {
    root = root.last();
  }
  // look for more modals
  root = root.not('(want|wants|wanted) to');

  // fallback
  if (!root.found) {
    root = vb.not('#Negative');
    return root
  }
  return root
};

// split adverbs as before/after the root
const getAdverbs = function (vb, root) {
  const res = {
    pre: vb.none(),
    post: vb.none(),
  };
  if (!vb.has('#Adverb')) {
    return res
  }
  // pivot on the main verb
  const parts = vb.splitOn(root);
  if (parts.length === 3) {
    return {
      pre: parts.eq(0).adverbs(),
      post: parts.eq(2).adverbs(),
    }
  }
  // it must be the second one
  if (parts.eq(0).isDoc(root)) {
    res.post = parts.eq(1).adverbs();
    return res
  }
  res.pre = parts.eq(0).adverbs();
  return res
};

const getAuxiliary = function (vb, root) {
  const parts = vb.splitBefore(root);
  if (parts.length <= 1) {
    return vb.none()
  }
  let aux = parts.eq(0);
  aux = aux.not('(#Adverb|#Negative|#Prefix)');
  return aux
};

const getNegative = function (vb) {
  return vb.match('#Negative')
};

// pull-apart phrasal-verb into verb-particle
const getPhrasal = function (root) {
  if (!root.has('(#Particle|#PhrasalVerb)')) {
    return {
      verb: root.none(),
      particle: root.none()
    }
  }
  const particle = root.match('#Particle$');
  return {
    verb: root.not(particle),
    particle: particle,
  }
};

const parseVerb = function (view) {
  const vb = view.clone();
  vb.contractions().expand();
  const root = getMain(vb);
  const res = {
    root: root,
    prefix: vb.match('#Prefix'),
    adverbs: getAdverbs(vb, root),
    auxiliary: getAuxiliary(vb, root),
    negative: getNegative(vb),
    phrasal: getPhrasal(root),
  };
  return res
};

const present = { tense: 'PresentTense' };
const conditional = { conditional: true };
const future = { tense: 'FutureTense' };
const prog = { progressive: true };
const past = { tense: 'PastTense' };
const complete = { complete: true, progressive: false };
const passive = { passive: true };
const plural = { plural: true };
const singular = { plural: false };

const getData = function (tags) {
  const data = {};
  tags.forEach(o => {
    Object.assign(data, o);
  });
  return data
};

const verbForms = {
  // === Simple ===
  'imperative': [
    // walk!
    ['#Imperative', []],
  ],

  'want-infinitive': [
    ['^(want|wants|wanted) to #Infinitive$', [present]],
    ['^wanted to #Infinitive$', [past]],
    ['^will want to #Infinitive$', [future]],
  ],

  'gerund-phrase': [
    // started looking
    ['^#PastTense #Gerund$', [past]],
    // starts looking
    ['^#PresentTense #Gerund$', [present]],
    // start looking
    ['^#Infinitive #Gerund$', [present]],
    // will start looking
    ['^will #Infinitive #Gerund$', [future]],
    // have started looking
    ['^have #PastTense #Gerund$', [past]],
    // will have started looking
    ['^will have #PastTense #Gerund$', [past]],
  ],

  'simple-present': [
    // he walks',
    ['^#PresentTense$', [present]],
    // we walk
    ['^#Infinitive$', [present]],
  ],
  'simple-past': [
    // he walked',
    ['^#PastTense$', [past]],
  ],
  'simple-future': [
    // he will walk
    ['^will #Adverb? #Infinitive', [future]],
  ],

  // === Progressive ===
  'present-progressive': [
    // he is walking
    ['^(is|are|am) #Gerund$', [present, prog]],
  ],
  'past-progressive': [
    // he was walking
    ['^(was|were) #Gerund$', [past, prog]],
  ],
  'future-progressive': [
    // he will be
    ['^will be #Gerund$', [future, prog]],
  ],

  // === Perfect ===
  'present-perfect': [
    // he has walked
    ['^(has|have) #PastTense$', [past, complete]], //past?
  ],
  'past-perfect': [
    // he had walked
    ['^had #PastTense$', [past, complete]],
    // had been to see
    ['^had #PastTense to #Infinitive', [past, complete]],
  ],
  'future-perfect': [
    // he will have
    ['^will have #PastTense$', [future, complete]],
  ],

  // === Progressive-perfect ===
  'present-perfect-progressive': [
    // he has been walking
    ['^(has|have) been #Gerund$', [past, prog]], //present?
  ],
  'past-perfect-progressive': [
    // he had been
    ['^had been #Gerund$', [past, prog]],
  ],
  'future-perfect-progressive': [
    // will have been
    ['^will have been #Gerund$', [future, prog]],
  ],

  // ==== Passive ===
  'passive-past': [
    // got walked, was walked, were walked
    ['(got|were|was) #Passive', [past, passive]],
    // was being walked
    ['^(was|were) being #Passive', [past, passive]],
    // had been walked, have been eaten
    ['^(had|have) been #Passive', [past, passive]],
  ],
  'passive-present': [
    // is walked, are stolen
    ['^(is|are|am) #Passive', [present, passive]],
    // is being walked
    ['^(is|are|am) being #Passive', [present, passive]],
    // has been cleaned
    ['^has been #Passive', [present, passive]],
  ],
  'passive-future': [
    // will have been walked
    ['will have been #Passive', [future, passive, conditional]],
    // will be cleaned
    ['will be being? #Passive', [future, passive, conditional]],
  ],

  // === Conditional ===
  'present-conditional': [
    // would be walked
    ['would be #PastTense', [present, conditional]],
  ],
  'past-conditional': [
    // would have been walked
    ['would have been #PastTense', [past, conditional]],
  ],

  // ==== Auxiliary ===
  'auxiliary-future': [
    // going to drink
    ['(is|are|am|was) going to (#Infinitive|#PresentTense)', [future]],
  ],
  'auxiliary-past': [
    // he did walk
    ['^did #Infinitive$', [past, singular]],
    // used to walk
    ['^used to #Infinitive$', [past, complete]],
  ],
  'auxiliary-present': [
    // we do walk
    ['^(does|do) #Infinitive$', [present, complete, plural]],
  ],

  // === modals ===
  'modal-past': [
    // he could have walked
    ['^(could|must|should|shall) have #PastTense$', [past]],
  ],
  'modal-infinitive': [
    // he can walk
    ['^#Modal #Infinitive$', []],
  ],

  'infinitive': [
    // walk
    ['^#Infinitive$', []],
  ],
};

const list = [];
Object.keys(verbForms).map(k => {
  verbForms[k].forEach(a => {
    list.push({
      name: k,
      match: a[0],
      data: getData(a[1]),
    });
  });
});

const cleanUp$1 = function (vb, res) {
  vb = vb.clone();
  // remove adverbs
  if (res.adverbs.post && res.adverbs.post.found) {
    vb.remove(res.adverbs.post);
  }
  if (res.adverbs.pre && res.adverbs.pre.found) {
    vb.remove(res.adverbs.pre);
  }
  // remove negatives
  if (vb.has('#Negative')) {
    vb = vb.remove('#Negative');
  }
  // remove prefixes like 'anti'
  if (vb.has('#Prefix')) {
    vb = vb.remove('#Prefix');
  }
  // cut-off phrasal-verb
  if (res.root.has('#PhrasalVerb #Particle')) {
    vb.remove('#Particle$');
  }
  // did we miss any of these?
  // vb = vb.remove('#Adverb')
  vb = vb.not('#Adverb');
  return vb
};

// 'learned [to code]'
const isInfinitive = function (vb) {
  if (vb.has('#Infinitive')) {
    const m = vb.growLeft('to');
    if (m.has('^to #Infinitive')) {
      return true
    }
  }
  return false
};

const getGrammar = function (vb, res) {
  const grammar = {};
  // make it easy to classify, first
  vb = cleanUp$1(vb, res);
  for (let i = 0; i < list.length; i += 1) {
    const todo = list[i];
    if (vb.has(todo.match) === true) {
      grammar.form = todo.name;
      Object.assign(grammar, todo.data);
      break //only match one
    }
  }
  // did we find nothing?
  if (!grammar.form) {
    if (vb.has('^#Verb$')) {
      grammar.form = 'infinitive';
    }
  }
  // fallback to 'naiive' tense detection
  if (!grammar.tense) {
    grammar.tense = res.root.has('#PastTense') ? 'PastTense' : 'PresentTense';
  }
  grammar.copula = res.root.has('#Copula');
  // 'learn to code'
  grammar.isInfinitive = isInfinitive(vb);
  return grammar
};

const shouldSkip = function (last) {
  // is it our only choice?
  if (last.length <= 1) {
    return false
  }
  const obj = last.parse()[0] || {};
  return obj.isSubordinate
};

// try to chop-out any obvious conditional phrases
// he wore, [if it was raining], a raincoat.
const noSubClause = function (before) {
  let parts = before.clauses();
  parts = parts.filter((m, i) => {
    // if it was raining..
    if (m.has('^(if|unless|while|but|for|per|at|by|that|which|who|from)')) {
      return false
    }
    // bowed to her,
    if (i > 0 && m.has('^#Verb . #Noun+$')) {
      return false
    }
    // the fog, suddenly increasing in..
    if (i > 0 && m.has('^#Adverb')) {
      return false
    }
    return true
  });
  // don't drop the whole thing.
  if (parts.length === 0) {
    return before
  }
  return parts
};

//
const lastNoun = function (vb) {
  let before = vb.before();
  // try to drop any mid-sentence clauses
  before = noSubClause(before);
  // parse-out our preceding nouns
  const nouns = before.nouns();
  // look for any dead-ringers
  let last = nouns.last();
  // i/she/he/they are very strong
  const pronoun = last.match('(i|he|she|we|you|they)');
  if (pronoun.found) {
    return pronoun.nouns()
  }
  // these are also good hints
  let det = nouns.if('^(that|this|those)');
  if (det.found) {
    return det
  }
  if (nouns.found === false) {
    det = before.match('^(that|this|those)');
    if (det.found) {
      return det
    }
  }

  // should we skip a subbordinate clause or two?
  last = nouns.last();
  if (shouldSkip(last)) {
    nouns.remove(last);
    last = nouns.last();
  }
  // i suppose we can skip two?
  if (shouldSkip(last)) {
    nouns.remove(last);
    last = nouns.last();
  }
  return last
};

const isPlural$2 = function (subj, vb) {
  // 'we are' vs 'he is'
  if (vb.has('(are|were|does)')) {
    return true
  }
  if (subj.has('(those|they|we)')) {
    return true
  }
  if (subj.found && subj.isPlural) {
    return subj.isPlural().found
  }
  return false
};

const getSubject = function (vb) {
  const subj = lastNoun(vb);
  return {
    subject: subj,
    plural: isPlural$2(subj, vb),
  }
};

const noop = vb => vb;

const isPlural$1 = (vb, parsed) => {
  const subj = getSubject(vb);
  const m = subj.subject;
  if (m.has('i') || m.has('we')) {
    return true
  }
  return subj.plural
};

const wasWere = (vb, parsed) => {
  const { subject, plural } = getSubject(vb);
  if (plural || subject.has('we')) {
    return 'were'
  }
  return 'was'
};

// present-tense copula
const isAreAm = function (vb, parsed) {
  // 'people were' -> 'people are'
  if (vb.has('were')) {
    return 'are'
  }
  // 'i was' -> i am
  const { subject, plural } = getSubject(vb);
  if (subject.has('i')) {
    return 'am'
  }
  if (subject.has('we') || plural) {
    return 'are'
  }
  // 'he was' -> he is
  return 'is'
};


const doDoes = function (vb, parsed) {
  const subj = getSubject(vb);
  const m = subj.subject;
  if (m.has('i') || m.has('we')) {
    return 'do'
  }
  if (subj.plural) {
    return 'do'
  }
  return 'does'
};

const getTense = function (m) {
  if (m.has('#Infinitive')) {
    return 'Infinitive'
  }
  if (m.has('#Participle')) {
    return 'Participle'
  }
  if (m.has('#PastTense')) {
    return 'PastTense'
  }
  if (m.has('#Gerund')) {
    return 'Gerund'
  }
  if (m.has('#PresentTense')) {
    return 'PresentTense'
  }
  return undefined
};

const toInf$2 = function (vb, parsed) {
  const { toInfinitive } = vb.methods.two.transform.verb;
  let str = parsed.root.text({ keepPunct: false });
  str = toInfinitive(str, vb.model, getTense(vb));
  if (str) {
    vb.replace(parsed.root, str);
  }
  return vb
};



// i will start looking -> i started looking
// i will not start looking -> i did not start looking
const noWill = (vb) => {
  if (vb.has('will not')) {
    return vb.replace('will not', 'have not')
  }
  return vb.remove('will')
};

const toArray = function (m) {
  if (!m || !m.isView) {
    return []
  }
  const opts = { normal: true, terms: false, text: false };
  return m.json(opts).map(s => s.normal)
};

const toText = function (m) {
  if (!m || !m.isView) {
    return ''
  }
  return m.text('normal')
};

const toInf$1 = function (root) {
  const { toInfinitive } = root.methods.two.transform.verb;
  const str = root.text('normal');
  return toInfinitive(str, root.model, getTense(root))
};

const toJSON = function (vb) {
  const parsed = parseVerb(vb);
  vb = vb.clone().toView();
  const info = getGrammar(vb, parsed);
  return {
    root: parsed.root.text(),
    preAdverbs: toArray(parsed.adverbs.pre),
    postAdverbs: toArray(parsed.adverbs.post),
    auxiliary: toText(parsed.auxiliary),
    negative: parsed.negative.found,
    prefix: toText(parsed.prefix),
    infinitive: toInf$1(parsed.root),
    grammar: info,
  }
};

const keep$5 = { tags: true };

// all verb forms are the same
const toInf = function (vb, parsed) {
  const { toInfinitive } = vb.methods.two.transform.verb;
  const { root, auxiliary } = parsed;
  const aux = auxiliary.terms().harden();
  let str = root.text('normal');
  str = toInfinitive(str, vb.model, getTense(root));
  if (str) {
    vb.replace(root, str, keep$5).tag('Verb').firstTerm().tag('Infinitive');
  }
  // remove any auxiliary terms
  if (aux.found) {
    vb.remove(aux);
  }
  // there is no real way to do this
  // 'i not walk'?  'i walk not'?
  if (parsed.negative.found) {
    if (!vb.has('not')) {
      vb.prepend('not');
    }
    const does = doDoes(vb);
    vb.prepend(does);
  }
  vb.fullSentence().compute(['freeze', 'lexicon', 'preTagger', 'postTagger', 'unfreeze', 'chunks']);
  return vb
};

const keep$4 = { tags: true };

const fns = {

  noAux: (vb, parsed) => {
    if (parsed.auxiliary.found) {
      vb = vb.remove(parsed.auxiliary);
    }
    return vb
  },

  // walk->walked
  simple: (vb, parsed) => {
    const { conjugate, toInfinitive } = vb.methods.two.transform.verb;
    const root = parsed.root;
    // 'i may'
    if (root.has('#Modal')) {
      return vb
    }
    let str = root.text({ keepPunct: false });
    str = toInfinitive(str, vb.model, getTense(root));
    const all = conjugate(str, vb.model);
    // 'driven' || 'drove'
    str = all.PastTense;
    // all.Participle || all.PastTense
    // but skip the 'is' participle..
    str = str === 'been' ? 'was' : str;
    if (str === 'was') {
      str = wasWere(vb);
    }
    if (str) {
      vb.replace(root, str, keep$4);
    }
    return vb
  },

  both: function (vb, parsed) {
    // 'he did not walk'
    if (parsed.negative.found) {
      vb.replace('will', 'did');
      return vb
    }
    // 'he walked'
    vb = fns.simple(vb, parsed);
    vb = fns.noAux(vb, parsed);
    return vb
  },

  hasHad: vb => {
    vb.replace('has', 'had', keep$4);
    return vb
  },

  // some verbs have this weird past-tense form
  // drive -> driven, (!drove)
  hasParticiple: (vb, parsed) => {
    const { conjugate, toInfinitive } = vb.methods.two.transform.verb;
    const root = parsed.root;
    let str = root.text('normal');
    str = toInfinitive(str, vb.model, getTense(root));
    return conjugate(str, vb.model).Participle
  },



};


const forms$4 = {
  // walk -> walked
  'infinitive': fns.simple,
  // he walks -> he walked
  'simple-present': fns.simple,
  // he walked
  'simple-past': noop,
  // he will walk -> he walked
  'simple-future': fns.both,

  // he is walking
  'present-progressive': vb => {
    vb.replace('are', 'were', keep$4);
    vb.replace('(is|are|am)', 'was', keep$4);
    return vb
  },
  // he was walking
  'past-progressive': noop,
  // he will be walking
  'future-progressive': (vb, parsed) => {
    vb.match(parsed.root).insertBefore('was');
    vb.remove('(will|be)');
    return vb
  },

  // has walked -> had walked (?)
  'present-perfect': fns.hasHad,
  // had walked
  'past-perfect': noop,
  // will have walked -> had walked
  'future-perfect': (vb, parsed) => {
    vb.match(parsed.root).insertBefore('had');
    if (vb.has('will')) {
      vb = noWill(vb);
    }
    vb.remove('have');
    return vb
  },

  // has been walking -> had been
  'present-perfect-progressive': fns.hasHad,
  // had been walking
  'past-perfect-progressive': noop,
  // will have been -> had
  'future-perfect-progressive': vb => {
    vb.remove('will');
    vb.replace('have', 'had', keep$4);
    return vb
  },

  // got walked
  'passive-past': vb => {
    // 'have been walked' -> 'had been walked'
    vb.replace('have', 'had', keep$4);
    return vb
  },
  // is being walked  -> 'was being walked'
  'passive-present': vb => {
    vb.replace('(is|are)', 'was', keep$4);
    return vb
  },
  // will be walked -> had been walked
  'passive-future': (vb, parsed) => {
    if (parsed.auxiliary.has('will be')) {
      vb.match(parsed.root).insertBefore('had been');
      vb.remove('(will|be)');
    }
    // will have been walked -> had been walked
    if (parsed.auxiliary.has('will have been')) {
      vb.replace('have', 'had', keep$4);
      vb.remove('will');
    }
    return vb
  },

  // would be walked -> 'would have been walked'
  'present-conditional': vb => {
    vb.replace('be', 'have been');
    return vb
  },
  // would have been walked
  'past-conditional': noop,

  // is going to drink -> was going to drink
  'auxiliary-future': vb => {
    vb.replace('(is|are|am)', 'was', keep$4);
    return vb
  },
  // used to walk
  'auxiliary-past': noop,
  // we do walk -> we did walk
  'auxiliary-present': vb => {
    vb.replace('(do|does)', 'did', keep$4);
    return vb
  },

  // must walk -> 'must have walked'
  'modal-infinitive': (vb, parsed) => {
    // this modal has a clear tense
    if (vb.has('can')) {
      // can drive -> could drive
      vb.replace('can', 'could', keep$4);
    } else {
      // otherwise, 
      //  walk -> have walked
      //  drive -> have driven
      fns.simple(vb, parsed);
      vb.match('#Modal').insertAfter('have').tag('Auxiliary');
    }
    return vb
  },
  // must have walked
  'modal-past': noop,
  // wanted to walk
  'want-infinitive': vb => {
    vb.replace('(want|wants)', 'wanted', keep$4);
    vb.remove('will');
    return vb
  },
  // started looking
  'gerund-phrase': (vb, parsed) => {
    parsed.root = parsed.root.not('#Gerund$');
    fns.simple(vb, parsed);
    noWill(vb);
    return vb
  },
};

const toPast$1 = function (vb, parsed, form) {
  // console.log(form)
  if (forms$4.hasOwnProperty(form)) {
    vb = forms$4[form](vb, parsed);
    vb.fullSentence().compute(['tagger', 'chunks']);
    return vb
  }
  // do nothing i guess?
  return vb
};

const haveHas = function (vb, parsed) {
  const subj = getSubject(vb);
  const m = subj.subject;
  if (m.has('(i|we|you)')) {
    return 'have'
  }
  // the dog has
  if (subj.plural === false) {
    return 'has'
  }
  // spencer has
  if (m.has('he') || m.has('she') || m.has('#Person')) {
    return 'has'
  }
  return 'have'
};

// walk-> has walked
const simple$2 = (vb, parsed) => {
  const { conjugate, toInfinitive } = vb.methods.two.transform.verb;
  const { root, auxiliary } = parsed;
  // 'i may'
  if (root.has('#Modal')) {
    return vb
  }
  let str = root.text({ keepPunct: false });
  str = toInfinitive(str, vb.model, getTense(root));
  const all = conjugate(str, vb.model);
  // 'driven' || 'drove'
  str = all.Participle || all.PastTense;

  if (str) {
    vb = vb.replace(root, str);
    // 'have/had/has eaten'
    const have = haveHas(vb);
    vb.prepend(have).match(have).tag('Auxiliary');
    vb.remove(auxiliary);
  }

  return vb
};



const forms$3 = {
  // walk -> walked
  'infinitive': simple$2,
  // he walks -> he walked
  'simple-present': simple$2,
  // he walked
  // 'simple-past': noop,
  // he will walk -> he walked
  'simple-future': (vb, parsed) => vb.replace('will', haveHas(vb)),

  // he is walking
  // 'present-progressive': noop,
  // he was walking
  // 'past-progressive': noop,
  // he will be walking
  // 'future-progressive': noop,

  // has walked -> had walked (?)
  'present-perfect': noop,
  // had walked
  'past-perfect': noop,
  // will have walked -> had walked
  'future-perfect': (vb, parsed) => vb.replace('will have', haveHas(vb)),

  // has been walking -> had been
  'present-perfect-progressive': noop,
  // had been walking
  'past-perfect-progressive': noop,
  // will have been -> had
  'future-perfect-progressive': noop,

  // got walked
  // 'passive-past': noop,
  // is being walked  -> 'was being walked'
  // 'passive-present': noop,
  // will be walked -> had been walked
  // 'passive-future': noop,

  // would be walked -> 'would have been walked'
  // 'present-conditional': noop,
  // would have been walked
  // 'past-conditional': noop,

  // is going to drink -> was going to drink
  // 'auxiliary-future': noop,
  // used to walk
  // 'auxiliary-past': noop,
  // we do walk -> we did walk
  // 'auxiliary-present': noop,

  // must walk -> 'must have walked'
  // 'modal-infinitive': noop,
  // must have walked
  // 'modal-past': noop,
  // wanted to walk
  // 'want-infinitive': noop,
  // started looking
  // 'gerund-phrase': noop,
};

const toPast = function (vb, parsed, form) {
  // console.log(form)
  if (forms$3.hasOwnProperty(form)) {
    vb = forms$3[form](vb, parsed);
    vb.fullSentence().compute(['tagger', 'chunks']);
    return vb
  }
  // do the simple form
  vb = simple$2(vb, parsed);
  vb.fullSentence().compute(['tagger', 'chunks']);
  // do nothing, then
  return vb
};

const keep$3 = { tags: true };

// walk->walked
const simple$1 = (vb, parsed) => {
  const { conjugate, toInfinitive } = vb.methods.two.transform.verb;
  const root = parsed.root;
  let str = root.text('normal');
  str = toInfinitive(str, vb.model, getTense(root));
  // 'i walk' vs 'he walks'
  if (isPlural$1(vb) === false) {
    str = conjugate(str, vb.model).PresentTense;
  }
  // handle copula
  if (root.has('#Copula')) {
    str = isAreAm(vb);
  }
  if (str) {
    vb = vb.replace(root, str, keep$3);
    vb.not('#Particle').tag('PresentTense');
  }
  // vb.replace('not ' + str, str + ' not')
  return vb
};

const toGerund$1 = (vb, parsed) => {
  const { conjugate, toInfinitive } = vb.methods.two.transform.verb;
  const root = parsed.root;
  let str = root.text('normal');
  str = toInfinitive(str, vb.model, getTense(root));
  // 'i walk' vs 'he walks'
  if (isPlural$1(vb) === false) {
    str = conjugate(str, vb.model).Gerund;
  }
  if (str) {
    vb = vb.replace(root, str, keep$3);
    vb.not('#Particle').tag('Gerund');
  }
  return vb
};

const vbToInf = (vb, parsed) => {
  const { toInfinitive } = vb.methods.two.transform.verb;
  const root = parsed.root;
  let str = parsed.root.text('normal');
  str = toInfinitive(str, vb.model, getTense(root));
  if (str) {
    vb = vb.replace(parsed.root, str, keep$3);
  }
  return vb
};



const forms$2 = {
  // walk
  'infinitive': simple$1,
  // he walks -> he walked
  'simple-present': (vb, parsed) => {
    const { conjugate } = vb.methods.two.transform.verb;
    const { root } = parsed;
    // is it *only* a infinitive? - 'we buy' etc
    if (root.has('#Infinitive')) {
      const subj = getSubject(vb);
      const m = subj.subject;
      if (isPlural$1(vb) || m.has('i')) {
        // keep it infinitive
        return vb
      }
      const str = root.text('normal');
      const pres = conjugate(str, vb.model).PresentTense;
      if (str !== pres) {
        vb.replace(root, pres, keep$3);
      }
    } else {
      return simple$1(vb, parsed)
    }
    return vb
  },
  // he walked
  'simple-past': simple$1,
  // he will walk -> he walked
  'simple-future': (vb, parsed) => {
    const { root, auxiliary } = parsed;
    // handle 'will be'
    if (auxiliary.has('will') && root.has('be')) {
      const str = isAreAm(vb);
      vb.replace(root, str);
      vb = vb.remove('will');
      vb.replace('not ' + str, str + ' not');
    } else {
      simple$1(vb, parsed);
      vb = vb.remove('will');
    }
    return vb
  },

  // is walking ->
  'present-progressive': noop,
  // was walking -> is walking
  'past-progressive': (vb, parsed) => {
    const str = isAreAm(vb);
    return vb.replace('(were|was)', str, keep$3)
  },
  // will be walking -> is walking
  'future-progressive': vb => {
    vb.match('will').insertBefore('is');
    vb.remove('be');
    return vb.remove('will')
  },

  // has walked ->  (?)
  'present-perfect': (vb, parsed) => {
    simple$1(vb, parsed);
    vb = vb.remove('(have|had|has)');
    return vb
  },

  // had walked -> has walked
  'past-perfect': (vb, parsed) => {
    // not 'we has walked'
    const subj = getSubject(vb);
    const m = subj.subject;
    if (isPlural$1(vb) || m.has('i')) {
      vb = toInf$2(vb, parsed);// we walk
      vb.remove('had');
      return vb
    }
    vb.replace('had', 'has', keep$3);
    return vb
  },
  // will have walked -> has walked
  'future-perfect': vb => {
    vb.match('will').insertBefore('has');
    return vb.remove('have').remove('will')
  },

  // has been walking
  'present-perfect-progressive': noop,
  // had been walking
  'past-perfect-progressive': vb => vb.replace('had', 'has', keep$3),
  // will have been -> has been
  'future-perfect-progressive': vb => {
    vb.match('will').insertBefore('has');
    return vb.remove('have').remove('will')
  },

  // got walked -> is walked
  // was walked -> is walked
  // had been walked -> is walked
  'passive-past': (vb, parsed) => {
    const str = isAreAm(vb);
    if (vb.has('(had|have|has)') && vb.has('been')) {
      vb.replace('(had|have|has)', str, keep$3);
      vb.replace('been', 'being');
      return vb
    }
    return vb.replace('(got|was|were)', str)
  },
  // is being walked  ->
  'passive-present': noop,
  // will be walked -> is being walked
  'passive-future': vb => {
    vb.replace('will', 'is');
    return vb.replace('be', 'being')
  },

  // would be walked ->
  'present-conditional': noop,
  // would have been walked ->
  'past-conditional': vb => {
    vb.replace('been', 'be');
    return vb.remove('have')
  },

  // is going to drink -> is drinking
  'auxiliary-future': (vb, parsed) => {
    toGerund$1(vb, parsed);
    vb.remove('(going|to)');
    return vb
  },
  // used to walk -> is walking
  // did walk -> is walking
  'auxiliary-past': (vb, parsed) => {
    // 'did provide' -> 'does provide'
    if (parsed.auxiliary.has('did')) {
      const str = doDoes(vb);
      vb.replace(parsed.auxiliary, str);
      return vb
    }
    toGerund$1(vb, parsed);
    vb.replace(parsed.auxiliary, 'is');
    return vb
  },
  // we do walk ->
  'auxiliary-present': noop,

  // must walk -> 'must have walked'
  'modal-infinitive': noop,
  // must have walked
  'modal-past': (vb, parsed) => {
    vbToInf(vb, parsed);
    return vb.remove('have')
  },
  // started looking
  'gerund-phrase': (vb, parsed) => {
    parsed.root = parsed.root.not('#Gerund$');
    simple$1(vb, parsed);
    return vb.remove('(will|have)')
  },
  // wanted to walk
  'want-infinitive': (vb, parsed) => {
    let str = 'wants';
    if (isPlural$1(vb)) {
      str = 'want';//we want
    }
    vb.replace('(want|wanted|wants)', str, keep$3);
    vb.remove('will');
    return vb
  },
};

const toPresent = function (vb, parsed, form) {
  // console.log(form)
  if (forms$2.hasOwnProperty(form)) {
    vb = forms$2[form](vb, parsed);
    vb.fullSentence().compute(['tagger', 'chunks']);
    return vb
  }
  return vb
};

const keep$2 = { tags: true };

const simple = (vb, parsed) => {
  const { toInfinitive } = vb.methods.two.transform.verb;
  const { root, auxiliary } = parsed;
  // 'i may'
  if (root.has('#Modal')) {
    return vb
  }
  let str = root.text('normal');
  str = toInfinitive(str, vb.model, getTense(root));
  if (str) {
    vb = vb.replace(root, str, keep$2);
    vb.not('#Particle').tag('Verb');
  }
  vb.prepend('will').match('will').tag('Auxiliary');
  vb.remove(auxiliary);
  return vb
};

// 'will be walking'
const progressive = (vb, parsed) => {
  const { conjugate, toInfinitive } = vb.methods.two.transform.verb;
  const { root, auxiliary } = parsed;
  let str = root.text('normal');
  str = toInfinitive(str, vb.model, getTense(root));
  if (str) {
    str = conjugate(str, vb.model).Gerund;
    vb.replace(root, str, keep$2);
    vb.not('#Particle').tag('PresentTense');
  }
  vb.remove(auxiliary);
  vb.prepend('will be').match('will be').tag('Auxiliary');
  return vb
};

const forms$1 = {
  // walk ->
  'infinitive': simple,
  // he walks ->
  'simple-present': simple,
  // he walked
  'simple-past': simple,
  // he will walk ->
  'simple-future': noop,

  // is walking ->
  'present-progressive': progressive,
  // was walking ->
  'past-progressive': progressive,
  // will be walking ->
  'future-progressive': noop,

  // has walked ->
  'present-perfect': (vb) => {
    vb.match('(have|has)').replaceWith('will have');
    return vb
  },
  // had walked ->
  'past-perfect': vb => vb.replace('(had|has)', 'will have'),
  // will have walked ->
  'future-perfect': noop,

  // has been walking
  'present-perfect-progressive': vb => vb.replace('has', 'will have'),
  // had been walking
  'past-perfect-progressive': vb => vb.replace('had', 'will have'),
  // will have been ->
  'future-perfect-progressive': noop,

  // got walked ->
  // was walked ->
  // was being walked ->
  // had been walked ->
  'passive-past': vb => {
    if (vb.has('got')) {
      return vb.replace('got', 'will get')
    }
    if (vb.has('(was|were)')) {
      vb.replace('(was|were)', 'will be');
      return vb.remove('being')
    }
    if (vb.has('(have|has|had) been')) {
      return vb.replace('(have|has|had) been', 'will be')
    }
    return vb
  },
  // is being walked  ->
  'passive-present': vb => {
    vb.replace('being', 'will be');
    vb.remove('(is|are|am)');
    return vb
  },
  // will be walked ->
  'passive-future': noop,
  // would be walked ->
  'present-conditional': vb => vb.replace('would', 'will'),
  // would have been walked ->
  'past-conditional': vb => vb.replace('would', 'will'),

  // is going to drink ->
  'auxiliary-future': noop,
  // used to walk -> is walking
  // did walk -> is walking
  'auxiliary-past': vb => {
    if (vb.has('used') && vb.has('to')) {
      vb.replace('used', 'will');
      return vb.remove('to')
    }
    vb.replace('did', 'will');
    return vb
  },
  // we do walk ->
  // he does walk ->
  'auxiliary-present': vb => {
    return vb.replace('(do|does)', 'will')
  },

  // must walk ->
  'modal-infinitive': noop,
  // must have walked
  'modal-past': noop,
  // started looking
  'gerund-phrase': (vb, parsed) => {
    parsed.root = parsed.root.not('#Gerund$');
    simple(vb, parsed);
    return vb.remove('(had|have)')
  },
  // wanted to walk
  'want-infinitive': vb => {
    vb.replace('(want|wants|wanted)', 'will want');
    return vb
  },
};

const toFuture = function (vb, parsed, form) {
  // console.log(form)
  // is it already future-tense?
  if (vb.has('will') || vb.has('going to')) {
    return vb
  }
  if (forms$1.hasOwnProperty(form)) {
    vb = forms$1[form](vb, parsed);
    vb.fullSentence().compute(['tagger', 'chunks']);
    return vb
  }
  return vb
};

const keep$1 = { tags: true };

// all verb forms are the same
const toGerund = function (vb, parsed) {
  // console.log(form)
  const { toInfinitive, conjugate } = vb.methods.two.transform.verb;
  const { root, auxiliary } = parsed;
  if (vb.has('#Gerund')) {
    return vb
  }

  // conjugate '-ing' verb
  let str = root.text('normal');
  str = toInfinitive(str, vb.model, getTense(root));
  const gerund = conjugate(str, vb.model).Gerund;
  // 'are walking', 'is walking'
  if (gerund) {
    const aux = isAreAm(vb);
    vb.replace(root, gerund, keep$1);
    vb.remove(auxiliary);
    vb.prepend(aux);//.match(aux)
  }
  // remove any existing auxiliary
  // if (auxiliary.found) {
  // vb.match(auxiliary).debug()
  // vb.remove(auxiliary)
  // }

  vb.replace('not is', 'is not');
  vb.replace('not are', 'are not');
  vb.fullSentence().compute(['tagger', 'chunks']);
  return vb
};

const keep = { tags: true };

// do/does not walk 
const doesNot = function (vb, parsed) {
  const does = doDoes(vb);
  vb.prepend(does + ' not');
  return vb
};

const isWas = function (vb) {
  // not be
  let m = vb.match('be');
  if (m.found) {
    m.prepend('not');
    return vb
  }
  // will not
  m = vb.match('(is|was|am|are|will|were)');
  if (m.found) {
    m.append('not');
    return vb
  }
  return vb
};

const hasCopula = (vb) => vb.has('(is|was|am|are|will|were|be)');

//vaguely, turn 'he is cool' into 'he is not cool'
const forms = {


  // he walks' -> 'he does not walk'
  'simple-present': (vb, parsed) => {
    // is/was
    if (hasCopula(vb) === true) {
      return isWas(vb)
    }
    // he walk
    vb = toInf$2(vb, parsed);
    // does not 
    vb = doesNot(vb);
    return vb
  },
  // 'he walked' -> 'he did not walk'
  'simple-past': (vb, parsed) => {
    // is/was
    if (hasCopula(vb) === true) {
      return isWas(vb)
    }
    // he walk
    vb = toInf$2(vb, parsed);
    // vb.debug()
    // did not walk
    vb.prepend('did not');
    return vb
  },

  // walk! -> 'do not walk'
  'imperative': (vb) => {
    vb.prepend('do not');
    return vb
  },
  // walk -> does not walk
  'infinitive': (vb, parsed) => {
    if (hasCopula(vb) === true) {
      return isWas(vb)
    }
    return doesNot(vb)
  },

  'passive-past': (vb) => {
    // got walked -> did not get walked
    if (vb.has('got')) {
      vb.replace('got', 'get', keep);
      vb.prepend('did not');
      return vb
    }
    // was walked, were walked
    // was being walked
    // had been walked, have been eaten
    const m = vb.match('(was|were|had|have)');
    if (m.found) {
      m.append('not');
    }
    return vb
  },
  'auxiliary-past': (vb) => {
    // used to walk
    if (vb.has('used')) {
      vb.prepend('did not');
      return vb
    }
    // he did walk
    const m = vb.match('(did|does|do)');
    if (m.found) {
      m.append('not');
    }
    return vb
  },

  // wants to walk
  'want-infinitive': (vb, parsed) => {
    // does not 
    vb = doesNot(vb);
    // want
    vb = vb.replace('wants', 'want', keep);
    return vb
  },

};

const toNegative = function (vb, parsed, form) {
  // console.log(form)
  if (vb.has('#Negative')) {
    return vb
  }
  if (forms.hasOwnProperty(form)) {
    vb = forms[form](vb, parsed);
    return vb
  }

  // 'not be'
  let m = vb.matchOne('be');
  if (m.found) {
    m.prepend('not');
    return vb
  }
  // is/was not
  if (hasCopula(vb) === true) {
    return isWas(vb)
  }

  // 'would not'
  m = vb.matchOne('(will|had|have|has|did|does|do|#Modal)');
  if (m.found) {
    m.append('not');
    return vb
  }
  // do nothing i guess?
  return vb
};

const api$1 = function (View) {
  class Verbs extends View {
    constructor(document, pointer, groups) {
      super(document, pointer, groups);
      this.viewType = 'Verbs';
    }
    parse(n) {
      return this.getNth(n).map(parseVerb)
    }
    json(opts, n) {
      const m = this.getNth(n);
      const arr = m.map(vb => {
        const json = vb.toView().json(opts)[0] || {};
        json.verb = toJSON(vb);
        return json
      }, []);
      return arr
    }
    subjects(n) {
      return this.getNth(n).map(vb => {
        parseVerb(vb);
        return getSubject(vb).subject
      })
    }
    adverbs(n) {
      return this.getNth(n).map(vb => vb.match('#Adverb'))
    }
    isSingular(n) {
      return this.getNth(n).filter(vb => {
        return getSubject(vb).plural !== true
      })
    }
    isPlural(n) {
      return this.getNth(n).filter(vb => {
        return getSubject(vb).plural === true
      })
    }
    isImperative(n) {
      return this.getNth(n).filter(vb => vb.has('#Imperative'))
    }
    toInfinitive(n) {
      return this.getNth(n).map(vb => {
        const parsed = parseVerb(vb);
        const info = getGrammar(vb, parsed);
        return toInf(vb, parsed, info.form)
      })
    }
    toPresentTense(n) {
      return this.getNth(n).map(vb => {
        const parsed = parseVerb(vb);
        const info = getGrammar(vb, parsed);
        if (info.isInfinitive) {
          return vb
        }
        return toPresent(vb, parsed, info.form)
      })
    }
    toPastTense(n) {
      return this.getNth(n).map(vb => {
        const parsed = parseVerb(vb);
        const info = getGrammar(vb, parsed);
        if (info.isInfinitive) {
          return vb
        }
        return toPast$1(vb, parsed, info.form)
      })
    }
    toFutureTense(n) {
      return this.getNth(n).map(vb => {
        const parsed = parseVerb(vb);
        const info = getGrammar(vb, parsed);
        if (info.isInfinitive) {
          return vb
        }
        return toFuture(vb, parsed, info.form)
      })
    }
    toGerund(n) {
      return this.getNth(n).map(vb => {
        const parsed = parseVerb(vb);
        const info = getGrammar(vb, parsed);
        if (info.isInfinitive) {
          return vb
        }
        return toGerund(vb, parsed, info.form)
      })
    }
    toPastParticiple(n) {
      return this.getNth(n).map(vb => {
        const parsed = parseVerb(vb);
        const info = getGrammar(vb, parsed);
        if (info.isInfinitive) {
          return vb
        }
        return toPast(vb, parsed, info.form)
      })
    }
    conjugate(n) {
      const { conjugate, toInfinitive } = this.world.methods.two.transform.verb;
      return this.getNth(n).map(vb => {
        const parsed = parseVerb(vb);
        const info = getGrammar(vb, parsed);
        // allow imperatives like 'go!' to be conjugated here (only)
        if (info.form === 'imperative') {
          info.form = 'simple-present';
        }
        let inf = parsed.root.text('normal');
        if (!parsed.root.has('#Infinitive')) {
          const tense = getTense(parsed.root);
          inf = toInfinitive(inf, vb.model, tense) || inf;
        }
        return conjugate(inf, vb.model)
      }, [])
    }

    /** return only verbs with 'not'*/
    isNegative() {
      return this.if('#Negative')
    }
    /**  return only verbs without 'not'*/
    isPositive() {
      return this.ifNo('#Negative')
    }
    /** remove 'not' from these verbs */
    toPositive() {
      const m = this.match('do not #Verb');
      if (m.found) {
        m.remove('do not');
      }
      return this.remove('#Negative')
    }
    toNegative(n) {
      return this.getNth(n).map(vb => {
        const parsed = parseVerb(vb);
        const info = getGrammar(vb, parsed);
        return toNegative(vb, parsed, info.form)
      })
    }
    // overloaded - keep Verb class
    update(pointer) {
      const m = new Verbs(this.document, pointer);
      m._cache = this._cache; // share this full thing
      return m
    }
  }
  Verbs.prototype.toPast = Verbs.prototype.toPastTense;
  Verbs.prototype.toPresent = Verbs.prototype.toPresentTense;
  Verbs.prototype.toFuture = Verbs.prototype.toFutureTense;

  View.prototype.verbs = function (n) {
    let vb = findVerbs(this);
    vb = vb.getNth(n);
    return new Verbs(this.document, vb.pointer)
  };
};

var verbs = {
  api: api$1,
};

// borrow a reference from another pronoun
// 'mike is tall, [he] climbs and [he] swims'
const findChained = function (want, s) {
  const m = s.match(want);
  if (m.found) {
    const ref = m.pronouns().refersTo();
    if (ref.found) {
      return ref
    }
  }
  return s.none()
};

const prevSentence = function (m) {
  if (!m.found) {
    return m
  }
  const [n] = m.fullPointer[0];
  if (n && n > 0) {
    return m.update([[n - 1]])
  }
  return m.none()
};

// only filter if we know a gender
// ambiguous names like 'jamie smith' will refer to either he or she
const byGender = function (ppl, gender) {
  if (gender === 'm') {
    return ppl.filter(m => !m.presumedFemale().found)
  } else if (gender === 'f') {
    return ppl.filter(m => !m.presumedMale().found)
  }
  return ppl
};


const getPerson = function (s, gender) {
  // look at current sentence
  let people = s.people();
  people = byGender(people, gender);
  if (people.found) {
    return people.last()
  }
  // non-named people, like 'the cowboy'
  people = s.nouns('#Actor');
  if (people.found) {
    return people.last()
  }
  // existing pronouns
  if (gender === 'f') {
    return findChained('(she|her|hers)', s)
  }
  if (gender === 'm') {
    return findChained('(he|him|his)', s)
  }
  return s.none()
};

// find best reference for 'they' & 'their'
const getThey = function (s) {
  const nouns = s.nouns();

  // 'the bananas'
  let things = nouns.isPlural().notIf('#Pronoun');
  if (things.found) {
    return things.last()
  }
  // re-use existing pronoun reference
  const chain = findChained('(they|their|theirs)', s);
  if (chain.found) {
    return chain
  }

  // they can also refer to a singular noun
  // "the restaurant sold their food"
  // "a choir sang their song"

  // somebody shaved their head
  things = nouns.match('(somebody|nobody|everybody|anybody|someone|noone|everyone|anyone)');
  if (things.found) {
    return things.last()
  }
  return s.none()
};

const addReference = function (pron, m) {
  if (m && m.found) {
    // add reference on the pronoun
    const term = pron.docs[0][0];//pronouns are 1 word only
    term.reference = m.ptrs[0];
  }
};

const stepBack = function (m, cb) {
  // 1st - in same sentence
  let s = m.before();
  let res = cb(s);
  if (res.found) {
    return res
  }
  // 2nd - previous sentence
  s = prevSentence(m);
  res = cb(s);
  if (res.found) {
    return res
  }
  // 3rd - two sentences back
  s = prevSentence(s);
  res = cb(s);
  if (res.found) {
    return res
  }
  return m.none()
};

const coreference$1 = function (view) {
  const pronouns = view.pronouns().if('(he|him|his|she|her|hers|they|their|theirs|it|its)');
  pronouns.forEach(pron => {
    let res = null;
    // connect pronoun to its reference
    if (pron.has('(he|him|his)')) {
      res = stepBack(pron, (m) => getPerson(m, 'm'));
    } else if (pron.has('(she|her|hers)')) {
      res = stepBack(pron, (m) => getPerson(m, 'f'));
    } else if (pron.has('(they|their|theirs)')) {
      res = stepBack(pron, getThey);
    }
    if (res && res.found) {
      addReference(pron, res);
    }
  });
};

const api = function (View) {

  class Pronouns extends View {
    constructor(document, pointer, groups) {
      super(document, pointer, groups);
      this.viewType = 'Pronouns';
    }
    hasReference() {
      this.compute('coreference');
      return this.filter(m => {
        const term = m.docs[0][0];
        return term.reference
      })
    }
    // get the noun-phrase this pronoun refers to
    refersTo() {
      //calculate links
      this.compute('coreference');
      // return them
      return this.map(m => {
        if (!m.found) {
          return m.none()
        }
        const term = m.docs[0][0];
        if (term.reference) {
          return m.update([term.reference])
        }
        return m.none()
      })
    }
    // overloaded - keep Numbers class
    update(pointer) {
      const m = new Pronouns(this.document, pointer);
      m._cache = this._cache; // share this full thing
      return m
    }
  }

  View.prototype.pronouns = function (n) {
    let m = this.match('#Pronoun');
    m = m.getNth(n);
    return new Pronouns(m.document, m.pointer)
  };
};

var coreference = {
  compute: { coreference: coreference$1 },
  api
};

nlp.plugin(adjectives); //
nlp.plugin(adverbs); //
nlp.plugin(chunker); //
nlp.plugin(coreference);
nlp.plugin(misc); //
nlp.plugin(normalize); //
nlp.plugin(nouns); //
nlp.plugin(numbers); //
nlp.plugin(plugin$1); //
nlp.plugin(sentences); //
nlp.plugin(topics); //
nlp.plugin(verbs); //

const fromTemplate = function (doc) {
  const tmpl = doc.template('short description');
  if (tmpl) {
    const json = tmpl.json() || {};
    return json.description || ''
  }
  return null
};

const preProcess = function (doc) {
  doc.parentheses().remove();
  return doc
};

const cleanUp = function (s) {
  // 'an actor and was a politician'
  s = s.remove('and #Copula .*');
  return s
};

//  founded in 1952 as the flagship ..
const findPivot = function (s) {
  let m = s.matchOne('#Copula+ (a|an|the|any|one) of?');
  if (!m.found) {
    m = s.matchOne('#Copula+');
  }
  if (!m.found) {
    m = s.matchOne('refers to (a|an|the|any)? of?');
  }
  if (!m.found) {
    m = s.matchOne('(constitutes|describes) (a|an|the|any)? of?');
  }
  if (!m.found) {
    return null
  }
  const f = s.splitOn(m);
  const verb = f.eq(1);
  // grab the article from the pivot, before any mutation -
  // in compromise v14, .remove() shifts the other views' pointers
  const article = verb.match(`(a|an|the|any)? of?`);
  return {
    before: f.eq(0),
    verb: verb,
    article: article,
    after: cleanUp(f.eq(2)),
  }
};

const byClause = function (s) {
  // 'an actor and also a politician'
  s.remove('and (also|eventually) (a|an|the|#Possessive) .*');
  // 'an actor who was a politician'
  s.remove('!of (who|that|which) #Adverb? (#Copula|form|comprise|forms|comprises) .*');
  // past-tense verbs 'located in spain'
  s.remove('#Adverb? (located|situated|founded|found|formed|built|developed) .*');
  //
  s.remove('#Adverb? (located|situated|founded|found|formed|built|developed) .*');

  return s
};

const safeCuts = function (s) {
  // 'in hamilton, Canada'
  if (s.has('(#Place && @hasComma) #Country+$')) {
    s.remove('#Country+$');
  }
  // 'which spans the '
  if (s.has('#Noun (that|which|who) #PresentTense the .*')) {
    s.remove(' that #PresentTense the .*');
  }
  // 'owned by the ...'
  if (s.has('#Noun #PastTense by the .*')) {
    s.remove('#PastTense by the .*');
  }
  // 'an american actress'
  s.remove('#Demonym');
  // professional hockey player
  s.remove('(professional|former)');

  //event-templates
  s.remove('and? held annually .*');
  s.remove('taking place each .*');

  // ordinal templates - the fifth fastest ..
  s.remove('^one of (the|many|several|#Value)+');
  s.remove('^(a|an|the)? #Ordinal? #Superlative');
  s.remove('^(a|an|the)? #Ordinal? most #Adjective');

  //
  s.remove('born in .*');
  s.remove('born #Date+ in? #Place+?');
  s.remove('(first|initially|originally)? (located|founded|started|based|formed) in .*');
  s.remove('(which|who|that) (is|was) .*');
  s.remove('^the name of');

  return s
};

const isIndependent = function (c) {
  if (c.has('^(and|the|which|who|whom|also|a|an|the)')) {
    return true
  }
  // 'part of abu dabi'
  if (c.has('^(west|north|south|east|part) of')) {
    return true
  }
  // 'written by .'
  if (c.has('^#PastTense by .')) {
    return true
  }
  // 'sometimes called ..'
  if (c.has('^(occasionally|sometimes|frequently)')) {
    return true
  }
  // 'such as ..'
  if (c.has('^such as')) {
    return true
  }
  // 'featuring gold feathers ..'
  if (c.has('^(including|featuring|depicting)')) {
    return true
  }
  return false
};

const hardCuts = function (s) {
  // .. in san fransisco
  if (s.has('#Noun (located|based|situated|sited|found|discovered) (in|on) #Place+$')) {
    s.remove('(located|based) in #Place+$');
  } else if (
    s.has(
      '(#Noun|#Value) (in|on) the #Adjective? (region|province|district|coast|city) of #Place+$'
    )
  ) {
    s.remove('(in|on) the #Adjective? (region|province|district|coast|city) of #Place+$');
  } else if (s.has('(#Noun|#Value) in #Place+$')) {
    s.remove('in #Place+$');
  } else {
    s.remove('and? part of #Place+$');
    s.remove('and? near #Place+$');
  }

  // by clause
  const clauses = s.clauses();
  if (clauses.length > 1) {
    const first = clauses.eq(0);
    const second = clauses.eq(1);
    //can we just choose the first clause?
    if (isIndependent(second)) {
      s = clauses.eq(0);
    } else if (second.has('^(#PastTense)') && first.has('(#Noun|#Value)$')) {
      // 'produced by...'
      s = clauses.eq(0);
    } else if (second.has('^(#Gerund)') && first.has('#Noun$')) {
      // 'featuring a ...'
      s = clauses.eq(0);
    } else {
      // can we remove the last clause, atleast?
      const last = clauses.last();
      if (isIndependent(last)) {
        s = clauses.slice(0, clauses.length - 1);
      }
    }
  }

  //.. writen by sandro leonardo
  if (s.has('(#Noun|and) #PastTense by')) {
    s.remove('#PastTense by .*');
  }
  //
  s.remove('and? designed to .*');
  s.remove('and? owned by .*');
  s.remove('and? consisting of .*');
  // , which collapsed
  if (s.has('@hasComma (which|who) #Verb')) {
    s.remove('(which|who) .*');
  }
  // , then
  // if (s.has('@hasComma (then)')) {
  //   s.remove('(which|who) .*')
  // }
  return s
};

const lastTry = function (s) {
  s.remove('(small|large|minor|major)');
  s.remove('(extinct|retired|annual|biweekly|monthly|daily)');
  s.remove('(female|male)');
  s.remove('(private|independent|official|unofficial|officially)');
  s.remove('(southern|northern|eastern|western|northeastern|northwestern)');

  //
  s.remove('^(family|clade|genus|species|order) of');
  return s
};

//check text is appropriate length
const isGood = function (doc, options) {
  if (doc && typeof doc.text === 'function') {
    const text = doc.text();
    if (text && text.length > options.min && text.length < options.max) {
      return true
    }
  }
  return false
};

const post = function (s) {
  s.remove('^(and|or|but)');
  s.remove('(and|or|but)$');
  s.post(''); // remove trailing comma
  return s.text()
};

// let count = 0
const doSentence = function (doc, options) {
  const sentence = doc.sentence(0);
  if (!sentence) {
    return ''
  }
  const txt = sentence.text();
  const s = nlp(txt);
  preProcess(s);

  const pivot = findPivot(s);
  // if we can't pivot it properly, don't bother
  if (!pivot || !pivot.verb || !pivot.verb.found) {
    return ''
  }
  let after = pivot.after;
  if (options.article && pivot.article && pivot.article.found) {
    after.prepend(pivot.article.text());
  }
  // maybe it's good already
  if (isGood(after, options)) {
    return post(after)
  }
  // parse major chunks
  after = byClause(after);
  if (isGood(after, options)) {
    return post(after)
  }
  // perform some modifications
  after = safeCuts(after);
  if (isGood(after, options)) {
    return post(after)
  }
  // really give it a go
  after = hardCuts(after);
  if (isGood(after, options)) {
    return post(after)
  }
  // atleast we tried
  after = lastTry(after);
  if (isGood(after, options)) {
    return post(after)
  }
  // console.log(after.text())
  // count += 1
  // console.log(count)
  // console.log(after.match('#PastTense').text())
  // console.log(after.text())
  // console.log('\n')
  return ''
};

const bad = [
  'living',
  'births',
  'former',
  'deceased',
  'missing',
  'with',
  'descent',
  'award',
  'winners',
  'nominees',
  'alumni',
  'other'
].map((str) => new RegExp(`\\b${str}\\b`, 'i'));

const good = ['male', 'female'].map((str) => new RegExp(`\\b${str}\\b`, 'i'));

const like = ['male', 'female', 'century'].map((str) => new RegExp(`\\b${str}\\b`, 'i'));

const dislike = ['people', 'place', 'from', 'in', 'people from'].map((str) => new RegExp(`\\b${str}\\b`, 'i'));

const hasYear = /[0-9]{4}/;
const isPlural = /s$/;

const fromCategory = function (doc) {
  let cats = doc.categories();

  // try to focus on the best ones, first
  let tmp = cats.filter((cat) => {
    return good.find((reg) => reg.test(cat))
  });
  if (tmp.length > 0) {
    cats = tmp;
  }

  // remove bad ones
  cats = cats.filter((cat) => {
    if (bad.find((reg) => reg.test(cat))) {
      return false
    }
    if (hasYear.test(cat)) {
      return false
    }
    return true
  });

  if (cats.length === 0) {
    return ''
  }
  // look at sorting by preferences
  tmp = cats.filter((cat) => {
    return like.find((reg) => reg.test(cat))
  });
  if (tmp.length > 0) {
    cats = tmp;
  }
  // remove disliked ones
  tmp = cats.filter((cat) => {
    // not a plural ending
    if (isPlural.test(cat) === false) {
      return false
    }
    // just one word
    if (cat.slice(' ').length === 1) {
      return false
    }
    return dislike.find((reg) => reg.test(cat)) === undefined
  });
  if (tmp.length > 0) {
    cats = tmp;
  }

  // sort them by most words
  cats = cats.sort((a, b) => {
    const aWords = a.split(' ').length;
    const bWords = b.split(' ').length;
    if (aWords > bWords) {
      return -1
    } else if (aWords < bWords) {
      return 1
    }
    return 0
  });
  // console.log(cats)

  return cats[0]
};

const useAn = function (str) {
  const a_regexs = [
    /^onc?e/i, //'wu' sound of 'o'
    /^u[bcfhjknq-t][aeiou]/i, // 'yu' sound for hard 'u'
    /^eul/i
  ];
  for (let i = 0; i < a_regexs.length; i++) {
    if (a_regexs[i].test(str)) {
      return false
    }
  }
  //basic vowel-startings
  if (/^[aeiou]/i.test(str)) {
    return true
  }
  return false
};

// 'American songwriters' to 'an American songwriter'
const changeCat = function (cat, options) {
  const c = nlp(cat);
  const hadCapital = c.terms().out('array').map((w) => /^[A-Z]/.test(w));
  c.nouns().toSingular();
  // compromise-14 lowercases words when it singularizes them - restore our capitals
  const terms = c.terms();
  hadCapital.forEach((had, i) => {
    if (had && terms.eq(i).found) {
      terms.eq(i).toTitleCase();
    }
  });
  // add article to the front
  if (options.article) {
    let article = 'A';
    // let noun = c.nouns(0)
    if (useAn(cat) === true) {
      // console.log(c.nouns(0))
      // article = c.nouns(0).json({ terms: false })[0].article || article
      article = 'An';
    }
    const first = c.terms(0);
    if (first.has('#ProperNoun') === false) {
      first.toLowerCase();
    }
    c.prepend(article);
  }
  // remove any parentheses
  c.parentheses().remove();
  return c.text()
};

const byCategory = function (doc, options) {
  const cat = fromCategory(doc);
  if (!cat) {
    return ''
  }
  return changeCat(cat, options)
};

const defaults = {
  article: true,
  template: true,
  sentence: true,
  category: true,
  max: 80,
  min: 3
};

const seemsGood = function (txt, options) {
  return txt && txt.length > 5 && txt.length < options.max
};

const plugin = function (models) {
  // add a new method to main class
  models.Doc.prototype.summary = function (options) {
    const doc = this;
    options = options || {};
    options = Object.assign({}, defaults, options);

    // generate from {{short description}} template
    let txt = '';
    if (options.template) {
      txt = fromTemplate(doc);
      if (seemsGood(txt, options)) {
        return txt.trim()
      }
    }
    // generate from first-sentence
    if (options.sentence) {
      txt = doSentence(doc, options);
      if (seemsGood(txt, options)) {
        return txt.trim()
      }
    }
    if (options.category) {
      return byCategory(doc, options)
    }
    return ''
  };

  // should we use 'it', 'he', 'they'...
  models.Doc.prototype.article = function () {
    let txt = '';
    // prefer the 2nd sentence
    if (this.sentence(1)) {
      txt = this.sentence(1).text();
    } else if (this.sentence(0)) {
      txt = this.sentence(0).text();
    }
    const doc = nlp(txt);
    const found = doc.match('(#Pronoun|#Article)').eq(0).text().toLowerCase();
    return found || 'it'
  };

  // was event in past? is person dead?
  models.Doc.prototype.tense = function () {
    const txt = this.sentence() ? this.sentence().text() : '';
    const doc = nlp(txt);
    const copula = doc.match('#Copula+').first();
    if (copula.has('was')) {
      return 'Past'
    }
    const vb = doc.verbs(0);
    if (vb.has('#PastTense')) {
      return 'Past'
    }
    if (doc.has('will #Adverb? be') || doc.has('(a|an) (upcoming|planned)')) {
      return 'Future'
    }
    return 'Present'
  };
};

export { plugin as default };
