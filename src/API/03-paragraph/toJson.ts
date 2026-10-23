const toJson = (p) => ({
  wiki: p.wikitext(),
  images: p.images().map((image) => image.json()),
  lists: p.lists().map((list) => list.json()),
  sentences: p.sentences().map((s) => s.json()),
})

export default toJson
