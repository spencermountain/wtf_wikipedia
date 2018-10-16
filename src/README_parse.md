## Parsing the Wiki Document
The main parsing method of the fetched or loaded wiki source is called in `/src/document/index.js` with
```javascript
   r.sections = parse.section(wiki, options) || [];
```
The call of sections generates all section elements in the Abstract Syntax Tree (AST) which is stored in the returned variable `r`.

## Parse Section
The module `/src/section/index.js` exports the section parser. The call of `parse.section(wiki, options)`
* splits the wiki source into sections,
* determines the section title and depth, i.e. section, subsection, subsubsection, ...
* and parses the section content
The exported function/method is `splitSections(wiki, options)`, that returns the sections.

### Section Heading/Title
The section header and depth is parsed in `src/section/heading.js`.

### Regular Expression to Split Sections
As a regular expression to split the sections the following regular expression is used:
```javascript
const section_reg = /[\n^](={1,5}[^=]{1,200}?={1,5})/g;
let split = wiki.split(section_reg); //.filter(s => s);
let sections = [];
for (let i = 0; i < split.length; i += 2) {
  let heading = split[i - 1] || '';
  let content = split[i] || '';
  ...
}
```
The brackets in "(" and ")" in the regular expression are used for storing the matched header `={1,5}[^=]{1,200}?={1,5}` (e.g. `===My Heading===`) in the split array `split`. This leads to the fact, that the split array contains alternating `[content0,heading1,content1,heading2,content2,...`. The first element in the array `content0` contains the preceeding text before the first section heading is defined in the wiki source text. The `content` parts of the split are processed by `doSection(section, wiki, options)` and the parameter `wiki` of the function contains the content body of the section.


### Section Body/Content
After each heading the body/content of the section is parsed with the method `doSection(section, wiki, options)` in `/src/section/index.js`, which returns the populated section node of the Abstract Syntax Tree (AST) of the document. The structure of the tree node is populated by different parsing methods for the content elements.
```javascript
wiki = parse.xmlTemplates(section, wiki, options);
// //parse the <ref></ref> tags
wiki = parse.references(section, wiki, options);
//parse-out all {{templates}}
wiki = parse.templates(section, wiki, options);
// //parse the tables
wiki = parse.table(section, wiki);
// //parse the lists
wiki = parse.list(section, wiki);
// //parse+remove scary '[[ [[]] ]]' stuff
//second, remove [[file:...[[]] ]] recursions
let matches = find_recursive('[', ']', wiki);
wiki = parse.image(matches, section, wiki, options);
wiki = parse.interwiki(matches, section, wiki, options);
//do each sentence
parse.eachSentence(section, wiki)
```
