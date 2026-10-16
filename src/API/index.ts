//export classes for plugin development
import Document from './01-document/Document.ts'
import Section from './02-section/Section.ts'
import Paragraph from './03-paragraph/Paragraph.ts'
import Sentence from './04-sentence/Sentence.ts'
import Image from './image/Image.ts'
import Infobox from './infobox/Infobox.ts'
import Link from './link/Link.ts'
import List from './list/List.ts'
import Reference from './reference/Reference.ts'
import Table from './table/Table.ts'
import Template from './template/Template.ts'
import infoboxes from '../parse/templates/parse/_infoboxes.ts'

export { Document, Section, Paragraph, Sentence, Image, Infobox, Link, List, Reference, Table, Template, infoboxes }
