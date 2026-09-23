const entry = process.env.TESTENV === 'prod'
  ? '../../builds/wtf_wikipedia.mjs'
  : '../../src/index.ts'

export default (await import(entry)).default
