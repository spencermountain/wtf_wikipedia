/* eslint-disable no-console */

// type-only test: the plugins' require() declarations (index.d.cts) compile
// and export the right shapes. (the full consumer flow is exercised in plugins.mts)
import type { Plugin } from 'wtf_wikipedia'
import htmlPlugin = require('wtf-plugin-html')
import classifyPlugin = require('wtf-plugin-classify')
import personPlugin = require('wtf-plugin-person')
import sports = require('wtf-plugin-sports')

const fn1: Plugin = htmlPlugin
const c: classifyPlugin.ClassifyResult = { root: null, type: null, score: 0, details: {} }
const fn2: Plugin = sports.mlb
const fn3: Plugin = sports.nhl
const fn4: Plugin = personPlugin
const born: personPlugin.PersonDate = { year: 1950 }
const married: personPlugin.Spouse = { name: 'Jane', from: '1990', to: null, end: null }
const kids: personPlugin.PersonChildren = { count: 2, names: ['A', 'B'] }
console.log(fn1, c, fn2, fn3, fn4, born, married, kids)
