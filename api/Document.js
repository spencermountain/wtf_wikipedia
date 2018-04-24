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
    name: 'toPlaintext',
    returns: 'String',
    description: '',
    aliases: ['plaintext', 'text']
  },
  {
    name: 'toMarkdown',
    returns: 'String',
    description: '',
    aliases: ['markdown']
  },
  {
    name: 'toHtml',
    returns: 'String',
    description: '',
    aliases: ['html', 'toHTML']
  },
  {
    name: 'toLatex',
    returns: 'String',
    description: '',
    aliases: ['latex', 'toLATEX']
  }

];
