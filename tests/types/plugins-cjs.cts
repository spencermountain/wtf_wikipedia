// type-only test: the plugins' require() declarations (index.d.cts) compile
// and export the right shapes. (the full consumer flow is exercised in plugins.mts)
import type { Plugin } from 'wtf_wikipedia'
import htmlPlugin = require('wtf-plugin-html')
import classifyPlugin = require('wtf-plugin-classify')
import sports = require('wtf-plugin-sports')

const fn1: Plugin = htmlPlugin
const c: classifyPlugin.ClassifyResult = { type: null, score: 0 }
const fn2: Plugin = sports.mlb
const fn3: Plugin = sports.nhl
console.log(fn1, c, fn2, fn3)
