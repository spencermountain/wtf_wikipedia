'use strict';
var test = require('tape');
var wtf = require('./lib');

test('fetch-as-promise', t => {
  t.plan(1);
  var p = wtf.fetch('Tony Hawk', 'en', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
  });
  p.then(function(doc) {
    t.ok(doc.sections().length > 0, 'promise returned document');
  });
  p.catch(function(e) {
    t.throw(e);
  });
});

test('fetch-as-callback', t => {
  t.plan(1);
  wtf.fetch('Tony Danza', 'en', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
  }, function(err, doc) {
    if (err) {
      t.throw(err);
    }
    t.ok(doc.categories().length > 0, 'callback returned document');
  });
});

test('fetch-invalid', t => {
  t.plan(1);
  var p = wtf.fetch('Taylor%20Swift', 'en', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
  });
  p.then(function(doc) {
    t.ok(doc === null, 'invalid character query returns null');
  });
  p.catch(function(e) {
    t.throw(e);
  });
});

test('fetch-missing', t => {
  t.plan(1);
  var p = wtf.fetch('NonExistentPage', 'en', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
  });
  p.then(function(doc) {
    t.ok(doc === null, 'fetching non-existent page returns null');
  });
  p.catch(function(e) {
    t.throw(e);
  });
});

test('fetch-redirect', t => {
  t.plan(1);
  var p = wtf.fetch('USA', 'simple', {
    follow_redirects: false,
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
  });
  p.then(function(doc) {
    t.ok(doc.isRedirect(), 'got redirect');
  });
  p.catch(function(e) {
    t.throw(e);
  });
});

test('fetch-alternate-wiki', t => {
  t.plan(1);
  var p = wtf.fetch(336711, 'en', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
    wikiUrl: 'https://www.mixesdb.com/db/api.php'
  });
  p.then(function(doc) {
    t.ok(doc.sections().length > 0, 'alternate wiki returned document');
  });
  p.catch(function(e) {
    t.throw(e);
  });
});

test('random', t => {
  t.plan(1);
  var p = wtf.random('simple', 'simple', {
    follow_redirects: false,
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
  });
  p.then(function(doc) {
    t.ok(doc.title(), 'got redirect');
  });
  p.catch(function(e) {
    t.throw(e);
  });
});

test('category', t => {
  t.plan(2);
  var p = wtf.category('Category:Basketball teams in Toronto', {
    'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>'
  });
  p.then(function(res) {
    t.ok(res.pages.length > 2, 'got some pages');
    t.ok(res.categories.length > 1, 'got a subcategory');
  });
  p.catch(function(e) {
    t.throw(e);
  });
});

//uncomment for testing on node>6
/*
test('ambiguous-pageids', async function(t) {
  var doc = await wtf.fetch(1984, 'en');
  t.equal(doc.title(), 'Arab world', 'input as pageid');

  doc = await wtf.fetch('1984', 'en');
  t.equal(doc.title(), '1984', 'input as text');

  var docs = await wtf.fetch([2983, 7493], 'en');
  t.equal(docs.length, 2, 'got two pageid results');
  t.equal(docs[0].title(), 'Austria-Hungary', 'first pageid');
  t.equal(docs[1].title(), 'Talk:P versus NP problem/Archive 1', 'second pageid');

  docs = await wtf.fetch(['June', 'July'], 'en');
  t.equal(docs.length, 2, 'got two results');
  t.equal(docs[0].title(), 'June', 'input as text');
  t.equal(docs[1].title(), 'July', 'input as text');
  t.end();
});
*/
