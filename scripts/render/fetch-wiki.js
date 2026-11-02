const fetchWiki = async (title, lang = 'en') => {
  const url = new URL(`https://${lang}.wikipedia.org/w/api.php`)
  url.search = new URLSearchParams({
    action: 'parse',
    page: title,
    prop: 'wikitext',
    redirects: '1',
    format: 'json',
    formatversion: '2',
    origin: '*',
  }).toString()

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Wikipedia request failed: ${response.status}`)
  }
  const data = await response.json()
  if (data.error) {
    throw new Error(data.error.info)
  }
  return data.parse.wikitext
}

export default fetchWiki
