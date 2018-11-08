const external = require('./external-links');
const geo = require('./geo');
const wikipedia = require('./wikipedia-cruft');
const pronounce = require('./pronounce');

module.exports = Object.assign({}, geo, pronounce, wikipedia, external);
