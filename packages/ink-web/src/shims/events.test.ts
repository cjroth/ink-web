import { describe, expect, test } from 'bun:test'
import { EventEmitter } from './events'

describe('EventEmitter shim', () => {
  test('setMaxListeners returns this (chainable)', () => {
    const ee = new EventEmitter()
    expect(ee.setMaxListeners(10)).toBe(ee)
  })

  test('getMaxListeners returns Infinity', () => {
    const ee = new EventEmitter()
    expect(ee.getMaxListeners()).toBe(Infinity)
  })

  test('listenerCount returns correct count', () => {
    const ee = new EventEmitter()
    expect(ee.listenerCount('data')).toBe(0)
    ee.on('data', () => {})
    expect(ee.listenerCount('data')).toBe(1)
    ee.on('data', () => {})
    expect(ee.listenerCount('data')).toBe(2)
  })

  test('listeners returns array of registered listeners', () => {
    const ee = new EventEmitter()
    expect(ee.listeners('data')).toEqual([])
    const fn1 = () => {}
    const fn2 = () => {}
    ee.on('data', fn1)
    ee.on('data', fn2)
    expect(ee.listeners('data')).toEqual([fn1, fn2])
  })

  test('rawListeners returns same as listeners', () => {
    const ee = new EventEmitter()
    const fn = () => {}
    ee.on('data', fn)
    expect(ee.rawListeners('data')).toEqual(ee.listeners('data'))
  })

  test('eventNames returns registered event names', () => {
    const ee = new EventEmitter()
    expect(ee.eventNames()).toEqual([])
    ee.on('data', () => {})
    ee.on('error', () => {})
    expect(ee.eventNames()).toEqual(['data', 'error'])
  })

  test('prependListener registers a listener', () => {
    const ee = new EventEmitter()
    const results: number[] = []
    ee.prependListener('data', () => results.push(1))
    ee.emit('data')
    expect(results).toEqual([1])
  })

  test('prependOnceListener fires once then unregisters', () => {
    const ee = new EventEmitter()
    const results: number[] = []
    ee.prependOnceListener('data', () => results.push(1))
    ee.emit('data')
    ee.emit('data')
    expect(results).toEqual([1])
  })
})
