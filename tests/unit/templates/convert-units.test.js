import test from 'tape'
import wtf from '../../lib/index.js'

const check = (t, cases) => {
  cases.forEach(([input, want]) => {
    t.equal(wtf(input).text(), want, input)
  })
}

test('convert does the common conversions', (t) => {
  check(t, [
    ['{{convert|37|ft}}', '37 feet (11 m)'],
    ['{{convert|37|ft|m}}', '37 feet (11 m)'],
    ['{{convert|10|km|mi|abbr=on}}', '10 km (6.2 mi)'],
    ['{{convert|1,000|km}}', '1,000 kilometres (620 mi)'],
    ['{{convert|0.5|mi}}', '0.5 miles (0.80 km)'],
    ['{{convert|70|m}}', '70 metres (230 ft)'],
    ['{{convert|1.5|m|ft}}', '1.5 metres (4.9 ft)'],
    ['{{convert|3|cm|in}}', '3 centimetres (1.2 in)'],
    ['{{convert|10|in|cm}}', '10 inches (25 cm)'],
    ['{{convert|100|kg|lb}}', '100 kilograms (220 lb)'],
    ['{{convert|200|ha}}', '200 hectares (490 acres)'],
    ['{{convert|50|km2}}', '50 square kilometres (19 sq mi)'],
    ['{{convert|120|km/h}}', '120 kilometres per hour (75 mph)'],
    ['{{convert|37|ft|m|disp=output only}}', '11 m'],
    ['{{convert|630|km2|sqmi|0}}', '630 square kilometres (243 sq mi)'],
    ['{{convert|630|km2|sqmi|1}}', '630 square kilometres (243.2 sq mi)'],
    ['{{convert|1234|m|ft|-2}}', '1,234 metres (4,000 ft)'],
    ['{{convert|12345|m}}', '12,345 metres (40,502 ft)'],
    ['{{convert|52419|sqmi|km2}}', '52,419 square miles (135,760 km²)'],
    ['{{convert|630|km2|sqmi|sigfig=2}}', '630 square kilometres (240 sq mi)'],
  ])
  t.end()
})

test('convert spelling, plurals and abbreviations', (t) => {
  check(t, [
    ['{{convert|1|ft}}', '1 foot (0.30 m)'],
    ['{{convert|1|km}}', '1 kilometre (0.62 mi)'],
    ['{{convert|10|km|mi|sp=us}}', '10 kilometers (6.2 mi)'],
    ['{{convert|10|km|mi|abbr=on}}', '10 km (6.2 mi)'],
    ['{{convert|10|km|mi|abbr=off}}', '10 kilometres (6.2 miles)'],
    ['{{convert|10|km|mi|abbr=in}}', '10 km (6.2 miles)'],
    ['{{cvt|37|ft}}', '37 ft (11 m)'],
    ['{{cvt|10|km|mi}}', '10 km (6.2 mi)'],
    ['{{convert|37|ft|adj=on}}', '37-foot (11 m)'],
    ['{{convert|12|furlong}}', '12 furlong'],
  ])
  t.end()
})

test('convert temperatures', (t) => {
  check(t, [
    ['{{convert|10|C|F}}', '10 °C (50 °F)'],
    ['{{convert|20|C}}', '20 °C (68 °F)'],
    ['{{convert|98.6|F|C}}', '98.6 °F (37.0 °C)'],
    ['{{convert|300|K}}', '300 K (27 °C)'],
    ['{{convert|-40|C|F}}', '-40 °C (-40 °F)'],
  ])
  t.end()
})

test('convert leaves what it does not know alone', (t) => {
  check(t, [
    ['{{convert|12|furlong}}', '12 furlong'],
    ['{{convert|10|m|cm}}', '10 metres'],
    ['{{convert|5|ft|11|in|m}}', '5 feet 11 inches'],
    ['{{convert|7|and|8|km}}', '7 and 8 kilometres'],
    ['{{convert|7|to|8|mi}}', '7 to 8 miles'],
    ['{{convert|abc|km}}', 'abc kilometres'],
  ])
  t.end()
})
