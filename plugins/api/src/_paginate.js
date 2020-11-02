const paginate = async function (url, prop, http) {
  const doOne = function () {
    http(url).then((res) => {
      let pages = Object.keys(res.query.pages || {})
      if (pages.length === 0) {
        return []
      }
      return res.query.pages[pages[0]].transcludedin || []
    })
  }
}
module.exports = paginate
