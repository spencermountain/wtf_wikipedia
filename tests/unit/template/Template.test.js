import test from 'tape'
import wtf from '../../lib/index.js'

// text
test('text - should return the text of the template', (t) => {
    const doc = wtf(`{{Start date|1954|10|30}}`)
    const template = doc.templates()[0]
    t.equal(template.text(), 'October 30, 1954', 'should return the text of the template')
    t.end()
})

// json
test('json - should return the data of the template in json format', (t) => {
    const doc = wtf(`{{Start date|1954|10|30}}`)
    const template = doc.templates()[0]
    t.deepEqual(template.json(),
        {
            template: 'date',
            data: {
                year: '1954',
                month: '10',
                date: '30',
                template: 'start date',
                text: 'October 30, 1954'
            }
        },
        'should return the data of the template in json format'
    )
    t.end()
})

// wikitext
test('wikitext - should return the wiki text of the template', (t) => {
    const doc = wtf(`{{Start date|1954|10|30}}`)
    const template = doc.templates()[0]
    t.equal(template.wikitext(), '{{Start date|1954|10|30}}', 'should return the wiki text of the template')
    t.end()
})