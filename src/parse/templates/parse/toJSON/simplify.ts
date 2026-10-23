// Simplify argument blocks only, before handlers build their own structured data.
const simplifyArguments = (args) => {
  const result: Record<string, any> = {}
  const keys = Object.keys(args)
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]
    if (key === 'template') {
      result[key] = args[key]
    } else if (key === 'list') {
      result[key] = args[key].map((block) => block.text)
    } else {
      result[key] = args[key].text
    }
  }
  return result
}

export default simplifyArguments
