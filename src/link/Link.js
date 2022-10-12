import wikis from '../_data/interwiki.js'

const defaults = {
  type: 'internal',
}

class Link {
  constructor (data) {
    data = data || {}
    data = Object.assign({}, defaults, data)
    this.data = data
  }

  /**
   * getter and setter for the link text
   *
   * @param {string} str the text to set
   * @returns {string} the text
   */
  text (str) {
    if (str !== undefined) {
      this.data.text = str
    }

    let txt = this.data.text || this.data.page || ''
    // remove bold/italics
    txt = txt.replace(/'{2,}/g, '')
    return txt
  }

  /**
   * Link json serializer
   * @returns {object} the json object
   */
  json () {
    let obj = {
      text: this.data.text,
      type: this.type(),
    }

    if (obj.type === 'internal') {
      obj.page = this.page()
    } else if (obj.type === 'interwiki') {
      obj.wiki = this.wiki()
    } else {
      obj.site = this.site()
    }

    let anchor = this.anchor()
    if (anchor) {
      obj.anchor = anchor
    }

    return obj
  }

  /**
   *
   * @returns {string} the wiki text
   */
  wikitext () {
    let txt = this.data.raw || ''
    return txt
  }

  /**
   * getter and setter for the page
   *
   * @param {string} [str] the page to set
   * @returns {string} the page
   */
  page (str) {
    if (str !== undefined) {
      this.data.page = str
    }
    return this.data.page
  }

  /**
   * getter and setter for the anchor
   *
   * @param {string} [str] the anchor to set
   * @returns {string} the anchor
   */
  anchor (str) {
    if (str !== undefined) {
      this.data.anchor = str
    }
    return this.data.anchor || ''
  }

  /**
   * getter and setter for the wiki
   *
   * @param {string} [str] the wiki to set
   * @returns {string} the wiki
   */
  wiki (str) {
    if (str !== undefined) {
      this.data.wiki = str
    }
    return this.data.wiki
  }

  /**
   * getter and setter for the type
   *
   * @param {string} [str] the type to set
   * @returns {string} the type
   */
  type (str) {
    if (str !== undefined) {
      this.data.type = str
    }
    return this.data.type
  }

  /**
   * getter and setter for the site
   *
   * @param {string} [str] the site to set
   * @returns {string} the site
   */
  site (str) {
    if (str !== undefined) {
      this.data.site = str
    }
    return this.data.site
  }

  /**
   * create a url for any type of link
   * @returns {string} the url
   */
  href () {
    let type = this.type()
    if (type === 'external') {
      return this.site()
    }
    let page = this.page()
    page = page.replace(/ /g, '_')
    page = encodeURIComponent(page)
    let url = ''

    if (type === 'interwiki') {
      let wiki = this.wiki()
      url = 'https://en.wikipedia.org/wiki/$1'
      if (Object.keys(wikis).includes(wiki)) {
        url = 'http://' + wikis[this.wiki()]
      }
      url = url.replace(/\$1/g, page)
    } else {
      //internal link
      url = `./${this.page()}`
    }
    //add anchor on the end
    if (this.anchor()) {
      url += '#' + this.anchor()
    }
    return url
  }
}

export default Link
