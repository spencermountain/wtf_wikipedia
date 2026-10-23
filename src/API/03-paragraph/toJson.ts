const toJson = (p) => ({
  sentences: p.sentences().map((s) => s.json()),
})

export default toJson
