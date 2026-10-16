import { images } from '../../../_data/i18n/index.ts'

const namespace = new RegExp(`^(?:${images.join('|')}):`, 'i')

const normalizeFile = (file) => {
  file = file.trim()
  // Infobox fields may contain full image markup, including layout and caption.
  if (file.startsWith('[[')) {
    file = file.slice(2).replace(/^:/, '').split(/[|\]]/, 1)[0].trim()
  }
  return file.replace(namespace, (prefix) => {
    if (/^(file|image):$/i.test(prefix)) {
      return prefix
    }
    return 'File:'
  })
}

export default normalizeFile
