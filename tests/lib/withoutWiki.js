// Source metadata is optional in parsed JSON; compare the interpreted data.
const withoutWiki = (value) => {
  if (Array.isArray(value)) {
    return value.map(withoutWiki)
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== 'wiki')
        .map(([key, item]) => [key, withoutWiki(item)])
    )
  }
  return value
}

export default withoutWiki
