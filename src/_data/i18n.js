/**
 * wikipedia special terms lifted and augmented from parsoid parser april 2015
 * and then manually on March 2020
 *
 * @type {{
 *  images: string[],
 *  references: string[],
 *  redirects: string[],
 *  infoboxes: string[],
 *  categories: string[],
 *   disambig: string[]
 * }}
 */
import categories from './categories.js'
import disambig_templates from './disambig_templates.js'
import disambig_titles from './disambig_titles.js'
import images from './images.js'
import stubs from './stubs.js'
import infoboxes from './infoboxes.js'
import redirects from './redirects.js'
import references from './references.js'

export { categories, disambig_templates, disambig_titles, images, stubs, infoboxes, redirects, references }
