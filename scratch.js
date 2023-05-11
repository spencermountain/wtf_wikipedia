import wtf from './src/index.js'
import plg from './plugins/api/src/index.js'
wtf.plugin(plg)

// let str = `{{float |top=2.0em |left=2px |width=10em | the content to float}}.`
// let str = `{{splitspan|foo|bar}}`
// let str = `  {{font|text=也可以只選用其中一項選項。|size=25px}}  `
// let doc = wtf(str)
// console.log(doc.text())


let str = `
{{PBPE|Camiseta|''t-shirt''}} ({{IPA-pt|tiˈʃɐrt|}}; {{IPA-en|ˈtiː ʃɜːɹt}}), é uma pequena [[camisa]], de mangas curtas ou sem mangas, geralmente em [[malharia|malha]] de [[algodão]], e mais recentemente em vários outros materiais, tais como [[poliéster]].<ref>{{Citar web|titulo=Significado de Camiseta|url=https://www.dicio.com.br/camiseta/|acessodata=10 de outubro de 2019|publicado=Dicio}}</ref>

Trata-se de um elemento do [[vestuário]], que na contemporaneidade é utilizada pelas empresas de [[moda]] para estampar [[imagem|imagens]] e [[frase]]s chamativas. As estampas podem ser de temática [[política]], artística ou de identificação de um grupo, por exemplo militares, funcionário de uma empresa, torcida de um time de futebol, etc.


`
let doc = wtf(str)
console.log(doc.text())


// wtf.fetch("Formula One drivers from Finland", "en")
// trunc
// wtf.fetch("2007 FIFA Women's World Cup Group A", "en")

// fails on percentage template
// wtf.fetch("Sacramento Mountain Lions", "es")

// fails on min template
// wtf.fetch("Phase finale du Championnat du monde masculin de handball 2019", "fr")
