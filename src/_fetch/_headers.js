const makeHeaders = function(options) {
  let agent =
    options.userAgent ||
    options['User-Agent'] ||
    options['Api-User-Agent'] ||
    'User of the wtf_wikipedia library'

  let origin = 
    options.noOrigin ? {} : { Origin: options.origin || options.Origin || '*' }

  const opts = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Api-User-Agent': agent,
      'User-Agent': agent,
      ...origin
    },
    redirect: 'follow'
  }
  return opts
}
module.exports = makeHeaders
