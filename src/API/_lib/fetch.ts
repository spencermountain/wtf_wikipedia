import { warnHttp, warnNetwork } from './warn.ts'

// bare-bones http helper, given to plugins via models.http
// failures warn to the console and resolve to {}
const request = function (url, opts) {
  return fetch(url, opts)
    .then((res) => {
      if (res.ok !== true) {
        warnHttp(res.status, url, res.headers?.get?.('retry-after'))
        return {}
      }
      return res.json()
    })
    .catch((e) => {
      warnNetwork(url, e)
      return {}
    })
}
export default request
