var test = require('tape')
var wtf = require('../lib')


test('fetch-innerWiki-wikibooks', t => {
    t.plan(1)
    var p = wtf.fetch('https://en.wikibooks.org/wiki/JavaScript', {
        'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
    })
    p.then(function (doc) {
        t.ok(doc.sections().length > 0, 'alternate wiki returned document')
    })
    p.catch(function (e) {
        t.throw(e)
    })
})


test('fetch-innerWiki-wikidata', t => {
    t.plan(1)
    var p = wtf.fetch('https://www.wikidata.org/wiki/Wikidata:Main_Page', {
        'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
    })
    p.then(function (doc) {
        t.ok(doc.sections().length > 0, 'alternate wiki returned document')
    })
    p.catch(function (e) {
        t.throw(e)
    })
})


test('fetch-innerWiki-wikimedia', t => {
    t.plan(1)
    var p = wtf.fetch('https://meta.wikimedia.org/wiki/Parser_testing', {
        'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
    })
    p.then(function (doc) {
        t.ok(doc.sections().length > 0, 'alternate wiki returned document')
    })
    p.catch(function (e) {
        t.throw(e)
    })
})


test('fetch-innerWiki-wikinews', t => {
    t.plan(1)
    var p = wtf.fetch('https://en.wikinews.org/wiki/Donald_Trump_elected_US_president', {
        'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
    })
    p.then(function (doc) {
        t.ok(doc.sections().length > 0, 'alternate wiki returned document')
    })
    p.catch(function (e) {
        t.throw(e)
    })
})


test('fetch-innerWiki-wikipedia', t => {
    t.plan(1)
    var p = wtf.fetch('https://en.wikipedia.org/wiki/Ethereum', {
        'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
    })
    p.then(function (doc) {
        t.ok(doc.sections().length > 0, 'alternate wiki returned document')
    })
    p.catch(function (e) {
        t.throw(e)
    })
})


test('fetch-innerWiki-wikiquote', t => {
    t.plan(1)
    var p = wtf.fetch('https://en.wikiquote.org/wiki/Chadwick_Boseman', {
        'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
    })
    p.then(function (doc) {
        t.ok(doc.sections().length > 0, 'alternate wiki returned document')
    })
    p.catch(function (e) {
        t.throw(e)
    })
})


test('fetch-innerWiki-wikisource', t => {
    t.plan(1)
    var p = wtf.fetch('https://en.wikisource.org/wiki/Proclamation_of_the_Irish_Republic', {
        'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
    })
    p.then(function (doc) {
        t.ok(doc.sections().length > 0, 'alternate wiki returned document')
    })
    p.catch(function (e) {
        t.throw(e)
    })
})


test('fetch-innerWiki-wikispecies', t => {
    t.plan(1)
    var p = wtf.fetch('https://species.wikimedia.org/wiki/Michotamia_aurata', {
        'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
    })
    p.then(function (doc) {
        t.ok(doc.sections().length > 0, 'alternate wiki returned document')
    })
    p.catch(function (e) {
        t.throw(e)
    })
})


test('fetch-innerWiki-wikiversity', t => {
    t.plan(1)
    var p = wtf.fetch('https://en.wikiversity.org/wiki/Introduction_to_Swedish', {
        'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
    })
    p.then(function (doc) {
        t.ok(doc.sections().length > 0, 'alternate wiki returned document')
    })
    p.catch(function (e) {
        t.throw(e)
    })
})


test('fetch-innerWiki-wikivoyage', t => {
    t.plan(1)
    var p = wtf.fetch('https://en.wikivoyage.org/wiki/Marvel_Cinematic_Universe_tourism', {
        'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
    })
    p.then(function (doc) {
        t.ok(doc.sections().length > 0, 'alternate wiki returned document')
    })
    p.catch(function (e) {
        t.throw(e)
    })
})


test('fetch-innerWiki-wiktionary', t => {
    t.plan(1)
    var p = wtf.fetch('https://en.wiktionary.org/wiki/masterly', {
        'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
    })
    p.then(function (doc) {
        t.ok(doc.sections().length > 0, 'alternate wiki returned document')
    })
    p.catch(function (e) {
        t.throw(e)
    })
})


// I dont know where there is a wiki for the foundation site
// test('fetch-innerWiki-foundation', t => {
//     t.plan(1)
//     var p = wtf.fetch('', {
//         'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
//     })
//     p.then(function (doc) {
//         t.ok(doc.sections().length > 0, 'alternate wiki returned document')
//     })
//     p.catch(function (e) {
//         t.throw(e)
//     })
// })


test('fetch-innerWiki-meta', t => {
    t.plan(1)
    var p = wtf.fetch('https://meta.wikimedia.org/wiki/Steward_requests/Bot_status', {
        'Api-User-Agent': 'wtf_wikipedia test script - <spencermountain@gmail.com>',
    })
    p.then(function (doc) {
        t.ok(doc.sections().length > 0, 'alternate wiki returned document')
    })
    p.catch(function (e) {
        t.throw(e)
    })
})
