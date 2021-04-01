const wtf = require('./src/index')
wtf.extend(require('./plugins/image/src'))

let str = `{{Infobox settlement
|name = Toronto
|official_name = City of Toronto
|settlement_type = [[List of cities in Ontario|City]] ([[List of municipalities in Ontario#Single-tier municipalities|single-tier]])
|nickname = [[Name of Toronto|T.O., T-Dot, Hogtown, The Queen City, Toronto the Good, The City Within a Park]]<!-- Do not add Centre of the Universe, since there are no valid citations for that term, and it is originally a popular nickname for NYC not Toronto --><!-- Do not add El Toro, since it is just a marketing ploy by Eye Weekly (later re-branded as the Grid) --><!-- Do not add York, Upper Canada, since it is a historical name, not a nickname --><!-- Do not add The 6, since it is a promotional name used by Drake and his fans -->
|motto = Diversity Our Strength
|image_skyline = Montage of Toronto 7.jpg <!-- Please do not change the infobox image without starting a discussion on the talk page and reaching consensus -->
|image_caption = From top left: [[Downtown Toronto]] featuring the [[CN Tower]] and [[Financial District, Toronto|Financial District]] from the [[Toronto Islands]], [[Toronto City Hall|City Hall]], the [[Ontario Legislative Building]], [[Casa Loma]], [[Prince Edward Viaduct]], and the [[Scarborough Bluffs]]
|image_flag = Toronto Flag.svg
}}`

let doc = wtf(str)
console.log(doc.mainImage())
// console.log(doc._wiki)
// console.log(doc.templates())
// console.log(doc.isDisambiguation())
// console.log(doc.disambiguation())
// console.log(doc.link(3).json())

// let doc = wtf(`[[cool|fun ''times'']] and [[nice]]`)
// console.log(doc.links(0))

// str = `hello {{Coord|44.112|N|87.913|W|display=title}} world`
// let obj = wtf(str).coordinate(0)
// console.log(obj)
