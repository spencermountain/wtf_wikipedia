class WrapperArray<T> extends Array<T> {
  // map(), filter(), and slice() return ordinary arrays.
  static get [Symbol.species]() {
    return Array
  }
}

const wrapMethods = (Collection, Item) => {
  for (let prototype = Item.prototype; prototype !== Object.prototype; prototype = Object.getPrototypeOf(prototype)) {
    Object.getOwnPropertyNames(prototype).forEach((name) => {
      const method = Object.getOwnPropertyDescriptor(prototype, name).value
      // Preserve custom collection methods and native Array methods.
      if (name in Collection.prototype || typeof method !== 'function') {
        return
      }
      Object.defineProperty(Collection.prototype, name, {
        configurable: true,
        writable: true,
        value(...args) {
          return this.map((item) => item[name](...args))
        },
      })
    })
  }
}

export { wrapMethods, WrapperArray }
