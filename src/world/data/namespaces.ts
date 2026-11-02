const namespaces = [
  'Media', 'Special', 'Talk', 'User', 'User talk', 'Wikipedia', 'Wikipedia talk',
  'File', 'File talk', 'MediaWiki', 'MediaWiki talk', 'Template', 'Template talk',
  'Help', 'Help talk', 'Category', 'Category talk', 'Portal', 'Portal talk',
  'Module', 'Module talk', 'Draft', 'Draft talk',
]
const namespaceNames = Object.fromEntries(namespaces.map((name) => [name.toLowerCase(), name]))

export default namespaceNames
