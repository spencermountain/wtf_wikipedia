export default {
  "Document": [
    {
      "name": "title",
      "returns": "String",
      "description": "get, or guess the title of the page from the first-sentence"
    },
    {
      "name": "pageID",
      "returns": "Number",
      "description": "grab the wikimedia id of the page, if we have it"
    },
    {
      "name": "namespace",
      "returns": "String",
      "description": "grab the wikimedia namespace of the page, if we have it"
    },
    {
      "name": "language",
      "returns": "String",
      "description": "get/set the language of the page"
    },
    {
      "name": "url",
      "returns": "String",
      "description": "try to get the url of the article"
    },
    {
      "name": "isRedirect",
      "returns": "Boolean",
      "description": "if the page is just a redirect to another page"
    },
    {
      "name": "redirectTo",
      "returns": "Boolean",
      "description": "the page this redirects to"
    },
    {
      "name": "isDisambiguation",
      "returns": "Boolean",
      "description": "is this a placeholder page to direct you to one-of-many possible pages",
      "aliases": ["isDisambig"]
    },
    {
      "name": "categories",
      "returns": "Array",
      "description": ""
    },
    {
      "name": "sections",
      "returns": "Array",
      "description": "return a list, or given-index of the Document's sections"
    },
    {
      "name": "paragraphs",
      "returns": "Array",
      "description": "return a list, or given-index of Paragraphs, in all sections"
    },
    {
      "name": "sentences",
      "returns": "Array",
      "description": "return a list, or given-index of all sentences in the document"
    },
    {
      "name": "images",
      "returns": "Array",
      "description": ""
    },
    {
      "name": "links",
      "returns": "Array",
      "description": "return a list, or given-index of all links, in all parts of the document"
    },
    {
      "name": "lists",
      "returns": "Array",
      "description": "sections in a page where each line begins with a bullet point"
    },
    {
      "name": "tables",
      "returns": "Array",
      "description": "return a list, or given-index of all structured tables in the document"
    },
    {
      "name": "templates",
      "returns": "Array",
      "description": "any type of structured-data elements, typically wrapped in like {{this}}"
    },
    {
      "name": "infoboxes",
      "returns": "Array",
      "description": "specific type of template, that appear on the top-right of the page"
    },
    {
      "name": "references",
      "returns": "Array",
      "description": "return a list, or given-index of 'citations' in the document"
    },
    {
      "name": "coordinates",
      "returns": "Array",
      "description": "geo-locations that appear on the page",
      "aliases": ["coords"]
    },
    {
      "name": "text",
      "returns": "String",
      "description": "plaintext, human-readable output for the page",
      "aliases": ["plaintext"]
    },
    {
      "name": "json",
      "returns": "String",
      "description": "a 'stringifyable' output of the page's main data",
      "aliases": ["toJson"]
    }
  ],
  "Section": [
    {
      "name": "title",
      "returns": "String",
      "example": "",
      "description": "the name of the section, between ==these tags=="
    },
    {
      "name": "index",
      "returns": "Integer",
      "example": "",
      "description": "which number section is this, in the whole document."
    },
    {
      "name": "indentation",
      "returns": "Integer",
      "example": "",
      "description": "how many steps deep into the table of contents it is"
    },
    {
      "name": "sentences",
      "returns": "Array",
      "example": "",
      "description": "return a list, or given-index, of sentences in this section"
    },
    {
      "name": "paragraphs",
      "returns": "Array",
      "description": "return a list, or given-index, of paragraphs in this section"
    },
    {
      "name": "links",
      "returns": "Array",
      "example": "",
      "description": ""
    },
    {
      "name": "tables",
      "returns": "Array",
      "example": "",
      "description": ""
    },
    {
      "name": "templates",
      "returns": "Array",
      "example": "",
      "description": ""
    },
    {
      "name": "infoboxes",
      "returns": "Array",
      "example": "",
      "description": ""
    },
    {
      "name": "coordinates",
      "returns": "Array",
      "description": "",
      "aliases": ["coords"]
    },
    {
      "name": "lists",
      "returns": "Array",
      "example": "",
      "description": ""
    },
    {
      "name": "interwiki",
      "returns": "Array",
      "example": "",
      "description": "any links to other language wikis"
    },
    {
      "name": "images",
      "returns": "Array",
      "example": "",
      "description": "return a list, or given index, of any images in this section"
    },
    {
      "name": "references",
      "returns": "Array",
      "description": "return a list, or given index, of 'citations' in this section"
    },
    {
      "name": "remove",
      "returns": "Document",
      "example": "doc.section('References').remove()",
      "description": "remove the current section from the document"
    },
    {
      "name": "nextSibling",
      "returns": "Section",
      "example": "",
      "description": "a section following this one, under the current parent: eg. 1920s → 1930s ",
      "aliases": ["next"]
    },
    {
      "name": "lastSibling",
      "returns": "Section",
      "example": "",
      "description": "a section before this one, under the current parent: eg. 1930s → 1920s",
      "aliases": ["last", "previous", "previousSibling"]
    },
    {
      "name": "children",
      "returns": "Array",
      "example": "",
      "description": "any sections more specific than this one: eg. History → [PreHistory, 1920s, 1930s]"
    },
    {
      "name": "parent",
      "returns": "Section",
      "example": "",
      "description": "the section, broader than this one: eg. 1920s → History "
    },
    {
      "name": "text",
      "returns": "String",
      "example": "",
      "description": ""
    },
    {
      "name": "json",
      "returns": "Array",
      "example": "",
      "description": ""
    }
  ],

  "Paragraph": [
    {
      "name": "sentences",
      "returns": "Array",
      "example": "",
      "description": ""
    },
    {
      "name": "references",
      "returns": "Array",
      "example": "",
      "description": ""
    },
    {
      "name": "lists",
      "returns": "Array",
      "example": "",
      "description": ""
    },
    {
      "name": "images",
      "returns": "Array",
      "example": "",
      "description": ""
    },
    {
      "name": "links",
      "returns": "Array",
      "example": "",
      "description": ""
    },
    {
      "name": "interwiki",
      "returns": "Array",
      "example": "",
      "description": ""
    },
    {
      "name": "text",
      "returns": "String",
      "example": "",
      "description": "generate readable plaintext for this paragraph"
    },
    {
      "name": "json",
      "returns": "Array",
      "example": "",
      "description": "generate some generic data for this paragraph in JSON format"
    }
  ],

  "Sentence": [
    {
      "name": "links",
      "returns": "Array",
      "description": ""
    },
    {
      "name": "bolds",
      "returns": "Array",
      "description": ""
    },
    {
      "name": "italics",
      "returns": "Array",
      "description": ""
    },
    {
      "name": "json",
      "returns": "Object",
      "description": ""
    }
  ],

  "Image": [
    {
      "name": "links",
      "returns": "Array",
      "description": ""
    },
    {
      "name": "thumbnail",
      "returns": "String",
      "description": ""
    },
    {
      "name": "format",
      "returns": "String",
      "description": ""
    },
    {
      "name": "json",
      "returns": "Object",
      "description": "return some generic metadata for this image"
    },
    {
      "name": "text",
      "returns": "String",
      "description": "does nothing"
    }
  ],
  "Infobox": [
    {
      "name": "links",
      "returns": "Array",
      "example": "",
      "description": ""
    },
    {
      "name": "keyValue",
      "returns": "Array",
      "example": "",
      "description": "generate simple key:value strings from this infobox"
    },
    {
      "name": "image",
      "returns": "Image",
      "example": "",
      "description": "grab the main image from this infobox"
    },
    {
      "name": "get",
      "returns": "Sentence",
      "example": "",
      "description": "lookup properties from their key"
    },
    {
      "name": "template",
      "returns": "String",
      "example": "",
      "description": "which infobox, eg 'Infobox Person'"
    },
    {
      "name": "text",
      "returns": "String",
      "example": "",
      "description": "generate readable plaintext for this infobox"
    },
    {
      "name": "json",
      "returns": "Array",
      "example": "",
      "description": "generate some generic 'stringifyable' data for this infobox"
    }
  ],
  "List": [
    {
      "name": "lines",
      "returns": "Array",
      "example": "",
      "description": "get an array of each member of the list"
    },
    {
      "name": "links",
      "returns": "Array",
      "example": "",
      "description": "get all links mentioned in this list"
    },
    {
      "name": "text",
      "returns": "String",
      "example": "",
      "description": "generate readable plaintext for this list"
    },
    {
      "name": "json",
      "returns": "Array",
      "example": "",
      "description": "generate some generic easily-parsable data for this list"
    }
  ],
  "Reference": [
    {
      "name": "title",
      "returns": "String",
      "example": "",
      "description": "generate human-facing text for this reference"
    },
    {
      "name": "links",
      "returns": "Array",
      "example": "",
      "description": "get any links mentioned in this reference"
    },
    {
      "name": "text",
      "returns": "String",
      "example": "",
      "description": "returns nothing"
    },
    {
      "name": "json",
      "returns": "Array",
      "example": "",
      "description": "generate some generic metadata data for this reference"
    }
  ],
  "Table": [
    {
      "name": "links",
      "returns": "Array",
      "example": "",
      "description": "get any links mentioned in this table"
    },
    {
      "name": "keyValue",
      "returns": "Object",
      "example": "",
      "description": "generate a simple list of key:value objects for this table"
    },
    {
      "name": "text",
      "returns": "String",
      "example": "",
      "description": "returns nothing"
    },
    {
      "name": "json",
      "returns": "Array",
      "example": "",
      "description": "generate some useful metadata data for this table"
    }
  ]
}
