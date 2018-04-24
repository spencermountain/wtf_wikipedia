module.exports = [
  {
    name: 'isRedirect',
    returns: 'Boolean',
    description: '',
  },
  {
    name: 'isDisambiguation',
    returns: 'Boolean',
    description: '',
    aliases: ['isDisambig']
  },
  {
    name: 'categories',
    returns: 'Array',
    description: '',
  },
  {
    name: 'sections',
    returns: 'Array',
    description: '',
  },
  {
    name: 'section',
    returns: 'Section',
    description: 'return the first section matching a given title or index',
  },
  {
    name: 'sentences',
    returns: 'Array',
    description: '',
  },
  {
    name: 'images',
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
    name: 'citations',
    returns: 'Array',
    description: '',
  },
  {
    name: 'infoboxes',
    returns: 'Array',
    description: '',
  },
  {
    name: 'coordinates',
    returns: 'Array',
    description: '',
    aliases: ['coords']
  },
  {
    name: 'plaintext',
    returns: 'String',
    description: '',
    aliases: ['text']
  },
  {
    name: 'markdown',
    returns: 'String',
    description: '',
    aliases: ['toMarkdown']
  },
  {
    name: 'html',
    returns: 'String',
    description: '',
    aliases: ['toHTML']
  },
  {
    name: 'latex',
    returns: 'String',
    description: '',
    aliases: ['toLATEX']
  }

];
