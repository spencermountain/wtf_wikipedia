import Link from './Link.ts'

class Links extends Array<Link> {
  // map(), filter(), and slice() return ordinary arrays.
  static get [Symbol.species]() {
    return Array
  }
}

Object.getOwnPropertyNames(Link.prototype).forEach((name) => {
  const method = Object.getOwnPropertyDescriptor(Link.prototype, name).value
  if (name in Links.prototype || typeof method !== 'function') {
    return
  }
  Object.defineProperty(Links.prototype, name, {
    configurable: true,
    writable: true,
    value(...args) {
      return this.map((link) => link[name](...args))
    },
  })
})

export default Links
