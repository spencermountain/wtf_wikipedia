import aliases from './aliases.js'
import citations from './citations.js'

const infoboxes = []

export default {
  lang: 'fr',
  enLang: 'french',
  category: ['catégorie'],
  redirect: ['redirection'],
  stub: ['ébauche'],
  infobox: [],
  image: ['fichier'],
  reference: ['notes et références', 'références'],
  disambig: ['homonymie'],
  disambigTitle: ['homonymie'],
  aliases,
  infoboxes,
  templates: citations,
  // too generic to claim globally — applied only when a document's lang is 'fr'
  gated: {
    'monnaie': { template: 'currency' },
    'unité': { template: 'currency' },
    'nombre': { template: 'currency' },
    'nb': { template: 'currency' },
    'iso4217': { template: 'currency' },
  },
}
