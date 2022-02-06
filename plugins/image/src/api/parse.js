/**
 * Parses the api response for a single image.
 * 
 * @private
 * @param {Object} fetchedImage
 * @returns {Object} method(s) results
 */
const parseImage = function (fetchedImage) {
  // if the data is missing return empty object
  if (fetchedImage['missing']) {
    return {}
  }

  const metaData = fetchedImage.imageinfo[0].extmetadata // call to iiprop "extmetadata"
  const url = fetchedImage.imageinfo[0].url // call to iiprop "url"
  return { // add the data for the properties that exists
    ...(metaData && {
      licenseRes:{
        license: metaData.LicenseShortName && metaData.LicenseShortName.value || "",
        artist: metaData.Artist && metaData.Artist.value || "",
        credit: metaData.Credit && metaData.Credit.value || "",
        attributionRequired: metaData.AttributionRequired && metaData.AttributionRequired.value || ""
      }
    }),
    ...(url && {existsRes: true})
  }
}
/**
 * Parses the wikimedia API's "imageinfo" prop response for an array of images or a single image.
 *
 * @private
 * @param {string[]} titles an array of images' titles (".file()" results)
 * @param {Object} fetched api response
 * @param {boolean} isDoc whether the call is from a Document or an Image
 * @returns {Object | Object[]} 
 */
const parseFetched = function (titles, fetched, isDoc) {
  if (isDoc) {
    // sort the results because API response is not in order, then find the info we need
    const fetchedValues = Object.values(fetched.query.pages)
    const newMethodsRes = []
    for (const i of titles) {
      for (const f of fetchedValues) {
        if (f.title === i.replace(/_/g," ")) {
          newMethodsRes.push(parseImage(f))
          break
        }
      }
    }
    return newMethodsRes
  }

  return parseImage(Object.values(fetched.query.pages)[0])
}
module.exports = parseFetched
