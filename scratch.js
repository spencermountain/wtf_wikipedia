const wtf = require('./src/index')
wtf.extend(require('./plugins/disambig/src'))

let str = `'''[[Barrie]]''' is a city in Ontario, Canada.

'''Barrie''' may also refer to:

* [[Barrie (electoral district)]], Canadian federal electoral district
* [[Barrie (provincial electoral district)]], provincial electoral district
* or I guess, if you're weird [[Barrie—Simcoe—Bradford]], former Canadian electoral district
* [[Barrie School]], private school in Silver Spring, Maryland
* [[Barrie (company)]], fashion company owned by Chanel
* [[Little Barrie]], British band
==Surname==
* [[Barrie (name)]]

==See also==
* [[Barre (disambiguation)]]
* [[Barry (disambiguation)]]
* [[Berry (disambiguation)]]
{{srt}}`

let doc = wtf(str)
// console.log(doc.isDisambiguation())
console.log(doc.disambiguation())
