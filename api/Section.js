module.exports = [
  {
    name: 'indentation',
    returns: 'Integer',
    description: '',
  },
  {
    name: 'sentences',
    returns: 'Array',
    description: '',
  },
  {
    name: 'links',
    returns: 'Array',
    description: '',
  },
  {
    name: 'tables',
    returns: 'Array',
    description: '',
  },
  {
    name: 'templates',
    returns: 'Array',
    description: '',
  },
  {
    name: 'lists',
    returns: 'Array',
    description: '',
  },
  {
    name: 'interwiki',
    returns: 'Array',
    description: '',
  },
  {
    name: 'images',
    returns: 'Array',
    description: '',
  },
  {
    name: 'index',
    returns: 'Integer',
    description: 'which number section is this, in the whole document.',
  },
  {
    name: 'nextSibling',
    returns: 'Section',
    description: 'a section following this one, under the current parent: eg. 1920s → 1930s ',
    aliases: ['next']
  },
  {
    name: 'lastSibling',
    returns: 'Section',
    description: 'a section before this one, under the current parent: eg. 1930s → 1920s',
    aliases: ['last', 'previous', 'previousSibling']
  },
  {
    name: 'children',
    returns: 'Array',
    description: 'any sections more specific than this one: eg. History → [PreHistory, 1920s, 1930s]',
  },
  {
    name: 'parent',
    returns: 'Section',
    description: 'the section, broader than this one: eg. 1920s → History ',
  },
  {
    name: 'toMarkdown',
    returns: 'String',
    description: '',
  },
  {
    name: 'toHtml',
    returns: 'String',
    description: '',
  },
  {
    name: 'toPlaintext',
    returns: 'String',
    description: '',
  },
  {
    name: 'toJSON',
    returns: 'Array',
    description: '',
  },
];
