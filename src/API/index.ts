//export classes for plugin development
import Document from './01-document/Document.ts'
import Section from './02-section/Section.ts'
import Paragraph from './03-paragraph/Paragraph.ts'
import Sentence from './03-paragraph/sentence/Sentence.ts'
import Image from './03-paragraph/image/Image.ts'
import Infobox from './03-paragraph/infobox/Infobox.ts'
import Link from './03-paragraph/link/Link.ts'
import List from './03-paragraph/list/List.ts'
import Reference from './03-paragraph/reference/Reference.ts'
import Table from './03-paragraph/table/Table.ts'
import Template from './03-paragraph/template/Template.ts'
import infoboxes from '../parse/templates/parse/_infoboxes.ts'

export { Document, Section, Paragraph, Sentence, Image, Infobox, Link, List, Reference, Table, Template, infoboxes }
