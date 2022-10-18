import test from 'tape'
import { trim_whitespace, capitalise, isArray, isObject } from '../../../src/_lib/helpers.js'


// capitalise 
test('capitalise - should return the capitalized word', (t) => {
    t.equal(capitalise('hello'), 'Hello', 'capitalise')
    t.end()
})

test('capitalise - should return the capitalized sentence', (t) => {
    t.equal(capitalise('hello world'), 'Hello world', 'capitalise')
    t.end()
})

test('capitalise - should return not capitalise numbers', (t) => {
    t.equal(capitalise('123 hello'), '123 hello', 'capitalise')
    t.end()
})

test('capitalise - should return not capitalise special characters', (t) => {
    t.equal(capitalise('!@#$%^&*() hello'), '!@#$%^&*() hello', 'capitalise')
    t.end()
})

test('capitalise - should return not capitalise empty string', (t) => {
    t.equal(capitalise(''), '', 'capitalise')
    t.end()
})

test('capitalise - should return not capitalise non strings', (t) => {
    t.equal(capitalise(123), '', 'capitalise')
    t.equal(capitalise(true), '', 'capitalise')
    t.equal(capitalise(null), '', 'capitalise')
    t.equal(capitalise(undefined), '', 'capitalise')
    t.equal(capitalise({}), '', 'capitalise')
    t.equal(capitalise([]), '', 'capitalise')
    t.end()
})


// trim_whitespace
test('trim_whitespace - should return the trimmed string', (t) => {
    t.equal(trim_whitespace(' hello '), 'hello', 'trim_whitespace')
    t.end()
})

test('trim_whitespace - should return the trimmed string with tabs', (t) => {
    t.equal(trim_whitespace(' hello\t'), 'hello', 'trim_whitespace')
    t.end()
})

test('trim_whitespace - should return the trimmed string with new lines', (t) => {
    t.equal(trim_whitespace('\nhello\n\r'), 'hello', 'trim_whitespace')
    t.end()
})

test('trim_whitespace - should return the trimmed string with new lines and tabs', (t) => {
    t.equal(trim_whitespace('\nhello\t\r'), 'hello', 'trim_whitespace')
    t.end()
})

// isArray
test('isArray - should return true if the value is an array', (t) => {
    t.equal(isArray([1, 2, 3]), true, 'isArray')
    t.end()
})

test('isArray - should return false if the value is not an array', (t) => {
    t.equal(isArray({}), false, 'isArray')
    t.end()
})

// isObject
test('isObject - should return true if the value is an object', (t) => {
    t.equal(isObject({}), true, 'isObject')
    t.end()
})

test('isObject - should return false if the value is not an object', (t) => {
    t.equal(isObject([]), false, 'isObject')
    t.end()
})