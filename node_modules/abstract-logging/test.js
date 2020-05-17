'use strict'

const assert = require('assert')

const one = require('./')
const two = require('./')

assert.notEqual(one, two)
two.info = () => 'info'

const result1 = one.info()
assert.equal(result1, undefined)

const result2 = two.info()
assert.equal(result2, 'info')
