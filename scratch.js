import wtf from './src/index.js'
// import plg from './plugins/api/src/index.js'
// wtf.plugin(plg)
let str = `
{{Info/Eleição
|em_curso         = não
|país             = Tunísia
|data             = outubro de 2019
|eleição_anterior = Eleições legislativas na Tunísia em 2014
|data_anterior    = outubro de 2014
|variante         = 
|tamanho_bandeira = 50px
|eleição_seguinte = 
|data_seguinte    = 
|tipo             =Legislativa 
|em_disputa      = Todos os 217 lugares na [[Assembleia de Representantes do Povo]]
}}
<!--
ESTA PARTE FICARÁ OCULTA ATÉ SE SABER OS RESULTADOS
|inscritos        =
|votantes         = 
|votantes2        = 
|abstenção        = 
|campanha         = 
|símbolo1         = 
|cor1             = red
|partido1         = [[Nidaa Tounes (partido)|Nidaa Tounes]]
|líder1           = [[Mohsen Marzouk]]
|votos1           = 
|votos1_ant       = 1279941
|percentagem1     = 
|lugares1         = 
|lugares1_ant     = 86
|barras1          = 
|cor_barras1      = red
|percentagem_barras1 = 
|símbolo2         = 
|cor2             = navy
|partido2         = [[Movimento Ennahda]]
|líder2           = [[Rached Ghannouchi]]
|origem2          = 
|votos2           = 
|votos2_ant       = 947034
|percentagem2     = 
|lugares2         = 
|lugares2_ant     = 69
|barras2          = 
|cor_barras2      = 
|percentagem_barras2 = 
|símbolo3         = 
|cor3             = darkred
|partido3         = [[União Patriótica Livre]]
|líder3           = [[Slim Riahi]]
|votos3           = 
|votos3_ant       = 137110
|percentagem3     = 
|lugares3         = 
|lugares3_ant     = 16
|barras3          = 
|cor_barras3      = darkred
|percentagem_barras3 = 
|símbolo4         = File:Popular Front Logo.svg
|cor4            = IndianRed
|candidato4       = 
|partido4        = [[Frente Popular (Tunísia)|Frente Popular]]
|líder4           = [[Hamma Hammami]]
|origem4          = 
|voto_eleitoral4  = 
|votos4          = 
|votos4_ant      = 124654
|percentagem4     = 
|lugares4        = 
|lugares4_ant    = 15
|barras4          = 
|cor_barras4      = 
|percentagem_barras4 = 
|imagem5          = 
|símbolo5         = 
|cor5             = OrangeRed
|candidato5       = 
|partido5         = [[Afek Tounes]]
|líder5           = [[Yassine Brahim]]
|origem5          = 
|voto_eleitoral5  = 
|votos5           = 
|votos5_ant       = 102916
|percentagem5     = 
|lugares5         =
|lugares5_ant     = 8
|barras5          = 
|cor_barras5      = 
|percentagem_barras5 = 
|tipo_divisão     = 
|divisõesN        = 
|mapa_título      = 
|mapa             = 
|mapa_tamanho     = 
|mapa_subtítulo   = 
|diagrama         = 
|diagrama_tamanho = 
|legenda1         = 
|legenda2         = 
|título_barras    = 
|subtítulo_barras = 
|cargo            = 
|predecessor      = 
|partido_predecessor = 
|sucessor         = 
|partido_sucessor = 
|web              = 
|extra_cabeçalho  = 
|extra_conteúdo   = 
}} -->
Em 2019 decorreram as 14ªs eleições legislativas na [[Tunísia]], e as terceiras desde a [[Revolução de Jasmim|Revolução tunisina]], em que, em 6 de outubro, foi eleita a segunda legislatura da [[Assembleia dos Representantes do Povo]].`

// str = `{{subst|Medicine}}`
// str = `{{Rounddown|3.14159|3}}`

// str = `{{SubSup|a|b|C}}`
// str = `For example, fact {{r|RefName|p=22}}`

// str = `before
// :indent
// after`

// str = `hello
// : first
// :: second
// world`

// https://en.m.wikipedia.org/wiki/Category:Internal_link_templates

// console.log(wtf('This is an\n:before\nafter').text())

// str = `{{Φ}}`

// str = `{{Refplease|date=November 2023|reason=Your explanation here}} in [[Jolgeh-ye Musaabad Rural District]],`

let doc = wtf(str)
console.log(doc.text())

// console.log(doc.json().sections[0])
// const doc = await wtf.fetch('Philharmonie de Berlin', 'fr')
// console.log(doc.pageImage().json())
// console.log(doc.wikidata() + '|')

// console.log(doc.template().json())
// console.log(doc.text())
// console.log(doc.references().map((r) => r.json()))
// console.log(doc.templates().map((r) => r.json()))
