import parseArguments from '../../parse/templates/parse/toJSON/index.ts'

const positions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

// Formatting wrappers pass markup onward so the containing block owns its links.
const inline = (position, wiki, _parse, opts) => {
  const args = parseArguments(wiki, positions, opts)
  return { data: null, replacement: args[String(position)]?.wiki || '' }
}

export default inline
