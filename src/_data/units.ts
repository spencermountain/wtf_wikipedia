// the common {{convert}} unit pairs - https://en.wikipedia.org/wiki/Help:Convert_units
// [symbol, default output unit, factor to that unit]  (temperatures are handled separately)
interface Unit {
  to: string
  factor: number
}
const units: Record<string, Unit> = {
  // length
  km: { to: 'mi', factor: 0.621371192 },
  mi: { to: 'km', factor: 1.609344 },
  m: { to: 'ft', factor: 3.2808399 },
  ft: { to: 'm', factor: 0.3048 },
  cm: { to: 'in', factor: 0.393700787 },
  mm: { to: 'in', factor: 0.0393700787 },
  in: { to: 'mm', factor: 25.4 },
  yd: { to: 'm', factor: 0.9144 },
  nmi: { to: 'km', factor: 1.852 },
  // area
  km2: { to: 'sqmi', factor: 0.386102159 },
  sqmi: { to: 'km2', factor: 2.58998811 },
  m2: { to: 'sqft', factor: 10.7639104 },
  sqft: { to: 'm2', factor: 0.09290304 },
  ha: { to: 'acres', factor: 2.47105381 },
  acre: { to: 'ha', factor: 0.404685642 },
  acres: { to: 'ha', factor: 0.404685642 },
  // mass
  kg: { to: 'lb', factor: 2.20462262 },
  lb: { to: 'kg', factor: 0.45359237 },
  g: { to: 'oz', factor: 0.0352739619 },
  oz: { to: 'g', factor: 28.3495231 },
  t: { to: 'LT', factor: 0.984206528 },
  // volume
  l: { to: 'impgal', factor: 0.219969157 },
  ml: { to: 'impoz', factor: 0.0351950652 },
  // speed
  'km/h': { to: 'mph', factor: 0.621371192 },
  mph: { to: 'km/h', factor: 1.609344 },
  'm/s': { to: 'ft/s', factor: 3.2808399 },
  kn: { to: 'km/h', factor: 1.852 },
}
// a unit's symbol as rendered, where it differs from its key
const symbols: Record<string, string> = {
  km2: 'km²',
  m2: 'm²',
  sqmi: 'sq mi',
  sqft: 'sq ft',
  l: 'L',
  impgal: 'imp gal',
  impoz: 'imp fl oz',
  LT: 'long tons',
  C: '°C',
  F: '°F',
  K: 'K',
  'C-change': '°C',
  'F-change': '°F',
}
export { units, symbols }
