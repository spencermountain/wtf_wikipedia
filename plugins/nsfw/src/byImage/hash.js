/* eslint-disable no-bitwise */
// the list uses spaces, but wtf_wikipedia returns file names with underscores
export const normalize = (str) => str.toLowerCase().replace(/_/g, ' ').trim()

// small synchronous hash for browser support and compact storage
const hash = (str) => {
  let value = 0
  for (let i = 0; i < str.length; i++) {
    value = (value * 31 + str.charCodeAt(i)) | 0
  }
  return (value >>> 0).toString(36)
}

export default hash
