/* eslint-disable no-console */
// fetch + parse a json response from the mediawiki api.
// failures warn to the console and resolve to {}
const hints = {
  403: 'wikimedia blocks generic user-agents - set an Api-User-Agent option with contact-info',
  429: 'wikimedia wants you to slow down - run requests serially, and set an Api-User-Agent option',
}

const http = function (url, headers) {
  return fetch(url, headers)
    .then((res) => {
      if (res.ok !== true) {
        let msg = `wtf-plugin-api: http-${res.status} error from the wikimedia api`
        if (hints[res.status]) {
          msg += `\n  → ${hints[res.status]}`
        }
        console.warn(msg)
        return {}
      }
      return res.json()
    })
    .catch((e) => {
      console.warn(`wtf-plugin-api: request failed - ${e.message}`)
      return {}
    })
}
export default http
