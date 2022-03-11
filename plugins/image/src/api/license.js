const fetch = require('./fetch')

/**
 * Returns the license information for the image.
 * 
 * @returns {Promise<Object>}
 */
const license = async function () {
  await fetch.call(this, "license")
  return this.data.pluginData.licenseRes || null
}
module.exports = license
