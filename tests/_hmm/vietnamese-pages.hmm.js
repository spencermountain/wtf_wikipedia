import test from 'tape'
import wtf from '../lib/index.js'
import { readPage } from '../_examples/index.js'

test('Vietnamese-Artwork-Image', (t) => {
  const doc = wtf(readPage('The-Starry-Night-Vi'))
  t.ok(
    doc.images().some((image) => image.file() === 'File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg'),
    'artwork image_file is extracted'
  )
  t.end()
})

test('Vietnamese-Nested-Image-Caption-Link', (t) => {
  const doc = wtf(readPage('Toronto-Vi'))
  t.ok(doc.links().some((link) => link.page() === 'Tháp CN'), 'CN Tower link in nested image caption')
  t.end()
})
