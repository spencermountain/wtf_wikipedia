if (typeof process !== undefined && typeof module !== undefined) {
  let wtf
  if (process.env.TESTENV === 'prod') {
    wtf = require('../../../')
    wtf.extend(require(`../`))
  } else {
    wtf = require('../../../src')
    wtf.extend(require(`../src`))
  }

  module.exports = wtf
}
