import type { LinkData } from '../../../types/index'

// str.replace(find, text) for each link in turn. Links come in page order, so set aside what's
// before each one, and each search starts close by. The latest replacement stays in the search,
// because the next link can be inside it.
const replaceLinks = function (str: string, links: LinkData[], toText: (link: LinkData) => string) {
  let done = ''
  links.forEach((link) => {
    const at = str.indexOf(link.wiki)
    if (at === -1) {
      done = done.replace(link.wiki, () => toText(link))
      return
    }
    done += str.slice(0, at)
    str = toText(link) + str.slice(at + link.wiki.length)
  })
  return done + str
}

export default replaceLinks
