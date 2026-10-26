import type { PageData } from '../../../types/index.ts'

const parseComments = (page: PageData) => {
  let wiki = page.remaining
  wiki = wiki.replace(/<!--.{0,3000}?-->/gs, (match) => {
    page.comments = page.comments || []
    page.comments.push(match)
    return ''
  })
  page.remaining = wiki
  return page
}

export default parseComments
