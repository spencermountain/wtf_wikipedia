const methods = {
  text: function () {
    return ''
  },
  json: function () {
    return this.data
  },
}

const Template = function (data) {
  Object.defineProperty(this, 'data', {
    enumerable: false,
    value: data,
  })
}

Object.keys(methods).forEach((k) => {
  Template.prototype[k] = methods[k]
})
module.exports = Template
