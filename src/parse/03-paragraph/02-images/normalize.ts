import { images } from '../../../_data/i18n/index.ts'

const namespace = new RegExp(`^(?:${images.join('|')}):`, 'i')

const normalizeFile = (file) => {
  file = file.trim()
  // Infobox fields may contain full image markup, including layout and caption.
  if (file.startsWith('[[')) {
    file = file.slice(2).replace(/^:/, '').split(/[|\]]/, 1)[0].trim()
  }
  file = file.replace(namespace, (prefix) => {
    if (/^(file|image):$/i.test(prefix)) {
      return prefix
    }
    return 'File:'
  })
  if (!file) {
    return ''
  }
  if (!/^(image|file):/i.test(file)) {
    file = `File:${file}`
  }
  file = file.charAt(0).toUpperCase() + file.substring(1)
  return file.replace(/ /g, '_')
}

export default normalizeFile
