/**
 * The constructor for the document class
This function starts parsing the wiki text and sets the options in the class
 * @param [wiki] - The wiki text
 * @param [options] - The options for the parser
 */
declare class Document {
    constructor(wiki?: string, options?: any);
    /**
     * Getter and setter for the tile.
    If string is given then this function is a setter and sets the variable and returns the set value
    If the string is not given then it will check if the title is available
    If it is available it returns the title.
    Else it will look if the first sentence contains a bolded phrase and assumes that's the title and returns it
     * @param [str] - The title that will be set
     * @returns The title found or given
     */
    title(str?: string): null | string;
    /**
     * If an pageID is given then it sets the pageID and returns the given pageID
    Else if the pageID is already set it returns the pageID
     * @param [id] - The pageID that will be set
     * @returns The given or found pageID
     */
    pageID(id?: number): number | null;
    /**
     * If an WikidataID is given then it sets the WikidataID and returns the given WikidataID
    Else if the WikidataID is already set it returns the WikidataID
     * @param [id] - The WikidataID that will be set
     * @returns The given or found WikidataID
     */
    wikidata(id?: string): string | null;
    /**
     * If an domain is given then it sets the domain and returns the given domain
    Else if the domain is already set it returns the domain
     * @param [str] - The domain that will be set
     * @returns The given or found domain
     */
    domain(str?: string): string | null;
    /**
     * If an language is given then it sets the language and returns the given language
    Else if the language is already set it returns the language
     * @param [lang] - The language that will be set
     * @returns The given or found language
     */
    language(lang?: string): string | null;
    /**
     * Gets the url of the page
    If the language or domain is not available we substitute 'en' and 'wikipedia.org'
    Then we use the template of `https://${lang}.${domain}/wiki/${title}` to make the url
     * @returns The url of the page
     */
    url(): string | null;
    /**
     * If an namespace is given then it sets the namespace and returns the given namespace
    Else if the namespace is already set it returns the namespace
     * @param [ns] - The namespace that will be set
     * @returns The given or found namespace
     */
    namespace(ns?: string): string | null;
    /**
     * Returns if the page is a redirect
     * @returns Is the page a redirect
     */
    isRedirect(): boolean;
    /**
     * Returns information about the page this page redirects to
     * @returns The redirected page
     */
    redirectTo(): null | any;
    /**
     * This function finds out if a page is a disambiguation page
     * @returns Whether the page is a disambiguation page
     */
    isDisambiguation(): boolean;
    /**
     * If a clue is available return the category at that index
    Else return all categories
     * @param [clue] - The index of the wanted category
     * @returns The category at the provided index or all categories
     */
    categories(clue?: number): string | string[];
    /**
     * Returns the 0th or clue-th category
     * @param [clue] - The index of the wanted category
     * @returns The category at the provided index
     */
    category(clue?: number): any | string | number;
    /**
     * returns the sections of the document
    
    If the clue is a string then it will return the section with that exact title
    Else if the clue is a number then it returns the section at that index
    Else it returns all the sections
     * @param [clue] - A title of a section or a index of a wanted section
     * @returns A section or a array of sections
     */
    sections(clue?: number | string): Section | Section[];
    /**
     * Returns the 0th or clue-th category
     * @param [clue] - The index of the wanted section
     * @returns The section at the provided index
     */
    section(clue?: number): Section;
    /**
     * Returns the paragraphs in the document
    
    If the clue is a number then it returns the paragraph at that index
    Else it returns all paragraphs in an array
     * @param [clue] - The index of the to be selected paragraph
     * @returns the selected paragraph or an array of all paragraphs
     */
    paragraphs(clue?: number): Paragraph | Paragraph[];
    /**
     * returns the first or the clue-th paragraph
     * @param [clue] - the index of the paragraph
     * @returns The selected paragraph
     */
    paragraph(clue?: number): Paragraph;
    /**
     * if no clue is provided, it compiles an array of sentences in the wiki text.
    if the clue is provided it return the sentence at the provided index
     * @param clue - the index of the wanted sentence
     * @returns an array of sentences or a single sentence
     */
    sentences(clue: number): Sentence[] | Sentence;
    /**
     * Returns the 0th or clue-th sentence
     * @param [clue] - The index of the wanted sentence
     * @returns The sentence at the provided index
     */
    sentence(clue?: number): Sentence;
    /**
     * This function search the whole page, including the infobox and image gallery templates for images
    and then returns them in an array if no clue is provided.
    if an clue is profieded then it returns the image at the clue-th index
     * @param [clue] - the index of the image to be selected
     * @returns a single image or an array of images
     */
    images(clue?: number): Image[] | Image;
    /**
     * Returns the 0th or clue-th image
     * @param [clue] - The index of the wanted image
     * @returns The image at the provided index
     */
    image(clue?: number): Image;
    /**
     * Return all links or if a clue is provided only the link at that index
     * @param [clue] - the index of the wanted link
     * @returns all the links or the selected link
     */
    links(clue?: number): string[] | string;
    /**
     * Returns the 0th or clue-th link
     * @param [clue] - The index of the wanted link
     * @returns The link at the provided index
     */
    link(clue?: number): any | string | number;
    /**
     * Return all inter wiki links or if a clue is provided only the inter wiki link at that index
     * @param [clue] - the index of the wanted inter wiki link
     * @returns all the inter wiki links or the selected inter wiki link
     */
    interwiki(clue?: number): string[] | string;
    /**
     * If a clue is available return the list at that index
    Else return all lists
     * @param [clue] - The index of the wanted list
     * @returns The list at the provided index or all lists
     */
    lists(clue?: number): List | List[];
    /**
     * Returns the 0th or clue-th list
     * @param [clue] - The index of the wanted list
     * @returns The list at the provided index
     */
    list(clue?: number): any | string | number;
    /**
     * If a clue is available return the tables at that index
    Else return all tables
     * @param [clue] - The index of the wanted table
     * @returns The table at the provided index or all tables
     */
    tables(clue?: number): Table | Tables[];
    /**
     * Returns the 0th or clue-th table
     * @param [clue] - The index of the wanted table
     * @returns The table at the provided index
     */
    table(clue?: number): any | string | number;
    /**
     * If a clue is available return the template at that index
    Else return all templates
     * @param [clue] - The index of the wanted template
     * @returns The category at the provided index or all categories
     */
    templates(clue?: number): Template | Template[];
    /**
     * Returns the 0th or clue-th template
     * @param [clue] - The index of the wanted template
     * @returns The template at the provided index
     */
    template(clue?: number): any | string | number;
    /**
     * If a clue is available return the references at that index
    Else return all references
     * @param [clue] - The index of the wanted references
     * @returns The category at the provided index or all references
     */
    references(clue?: number): Reference | Reference[];
    /**
     * Returns the 0th or clue-th reference
     * @param [clue] - The index of the wanted reference
     * @returns The reference at the provided index
     */
    reference(clue?: number): any | string | number;
    /**
     * Returns the 0th or clue-th citation
     * @param [clue] - The index of the wanted citation
     * @returns The citation at the provided index
     */
    citation(clue?: number): any | string | number;
    /**
     * finds and returns all coordinates
    or if an clue is given, the coordinate at the index
     * @param [clue] - the index of the coordinate returned
     * @returns if a clue is given, the coordinate of null, else an array of coordinates
     */
    coordinates(clue?: number): object[] | any | null;
    /**
     * Returns the 0th or clue-th coordinate
     * @param [clue] - The index of the wanted coordinate
     * @returns The coordinate at the provided index
     */
    coordinate(clue?: number): any | string | number;
    /**
     * If clue is unidentified then it returns all infoboxes
    If clue is a number then it returns the infobox at that index
    It always sorts the infoboxes by size
     * @param [clue] - the index of the infobox you want to select
     * @returns the selected infobox or an array of infoboxes
     */
    infoboxes(clue?: number): Infobox | Infobox[];
    /**
     * Returns the 0th or clue-th infobox
     * @param [clue] - The index of the wanted infobox
     * @returns The infobox at the provided index
     */
    infobox(clue?: number): any | string | number;
    /**
     * return a plain text version of the wiki article
     * @param [options] - the options for the parser
     * @returns the plain text version of the article
     */
    text(options?: any): string;
    /**
     * return a json version of the Document class
     * @param [options] - options for the rendering
     * @returns this document as json
     */
    json(options?: any): any;
    /**
     * prints the title of every section
     * @returns the document itself
     */
    debug(): Document;
}

/**
 * the stuff between headings - 'History' section for example
 * @param data - the data already gathered about the section
 * @param doc - the document that this section belongs to
 */
declare class Section {
    constructor(data: any, doc: Document);
}

/**
 * returns one sentence object
 * @param str - create a object from a sentence
 * @returns the Sentence created from the text
 */
declare function fromText(str: string): Sentence;

declare type fetchDefaults = {
    path?: string | undefined;
    wiki?: string | undefined;
    domain?: string | undefined;
    follow_redirects?: boolean | undefined;
    lang?: string | undefined;
    path?: string | undefined;
    title?: string | number | (string | number)[] | undefined;
    "Api-User-Agent"?: string | undefined;
};

declare const defaults: fetchDefaults;

/**
 * fetches the page from the wiki and returns a Promise with the parsed wikitext
 * @param title - the title, PageID, URL or an array of all three of the page(s) you want to fetch
 * @param [options] - the options for the fetch or the language of the wiki for the article or the callback if you dont provide any options
 * @param [c] - the callback function for the call or the options for the fetch
 */
declare function fetch(title: string | number | (number | string)[], options?: fetchDefaults | ((...params: any[]) => any) | string, c?: ((...params: any[]) => any) | fetchDefaults): Promise<null | Document | Document[]>;

declare type HeaderOptions = {
    redirect: string;
    method: string;
};

/**
 * factory for header options
 * @returns the generated options
 */
declare function makeHeaders(options: any): HeaderOptions;

