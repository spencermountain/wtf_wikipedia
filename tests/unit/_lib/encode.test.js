import test from 'tape'
import encodeObject from '../../../src/_lib/encode.js'

test('encodeObject - should remove unwanted characters for the keys', (t) => {
    const obj = {
        "a.b": "a.b",
        "$ab": "a$b",
        "a\\b": "a\\b",
        "$a.bc": "a.b$c",
        "$a.bc\\d": "a.b$c\\d",
    }

    const expected = {
        "a\\u002eb": "a.b",
        "\\u0024ab": "a$b",
        "a\\\\b": "a\\b",
        "\\u0024a\\u002ebc": "a.b$c",
        "\\u0024a\\u002ebc\\\\d": "a.b$c\\d",
    }

    const actual = encodeObject(obj)

    t.deepEqual(actual, expected, 'should remove unwanted characters for the keys')
    t.end()
})