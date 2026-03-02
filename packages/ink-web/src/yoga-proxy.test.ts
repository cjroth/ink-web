import { describe, expect, test } from 'bun:test'
import Yoga from 'yoga-layout'

/**
 * This test verifies that yoga layout engine works correctly.
 * Ink uses yoga-layout internally for flexbox layout computation.
 *
 * Note: We test yoga directly rather than through ink's render, because
 * resize.test.ts uses mock.module('ink', ...) which globally replaces the
 * ink module in the same bun test process.
 */

describe('Yoga layout engine', () => {
  test('Yoga.Node.create() works', () => {
    const node = Yoga.Node.create()
    expect(node).toBeDefined()

    node.setWidth(100)
    node.setHeight(50)
    node.calculateLayout(100, 50)

    expect(node.getComputedWidth()).toBe(100)
    expect(node.getComputedHeight()).toBe(50)

    node.free()
  })

  test('nested yoga layout works', () => {
    const root = Yoga.Node.create()
    root.setWidth(200)
    root.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN)

    const child1 = Yoga.Node.create()
    child1.setHeight(30)
    root.insertChild(child1, 0)

    const child2 = Yoga.Node.create()
    child2.setHeight(40)
    root.insertChild(child2, 1)

    root.calculateLayout(200, undefined)

    expect(child1.getComputedTop()).toBe(0)
    expect(child1.getComputedHeight()).toBe(30)
    expect(child2.getComputedTop()).toBe(30)
    expect(child2.getComputedHeight()).toBe(40)

    // Total height should be sum of children
    expect(root.getComputedHeight()).toBe(70)

    child1.free()
    child2.free()
    root.free()
  })

  test('can access Yoga constants through proxy directly', async () => {
    // Note: __yogaPromise is set by post-build script, may not exist in test env
    const yogaPromise = (globalThis as any).__yogaPromise

    if (!yogaPromise) {
      console.log('⚠️ __yogaPromise not available (post-build feature), skipping direct yoga access test')
      return
    }

    const yoga = await yogaPromise
    expect(yoga).toBeDefined()
    expect(yoga.Node).toBeDefined()
    expect(typeof yoga.Node.create).toBe('function')

    const node = yoga.Node.create()
    expect(node).toBeDefined()
  })

  test('nested proxy caching works correctly', async () => {
    const yogaPromise = (globalThis as any).__yogaPromise
    if (yogaPromise) {
      const yoga = await yogaPromise

      const node1 = yoga.Node
      const node2 = yoga.Node

      expect(node1).toBe(node2)
      expect(typeof node1.create).toBe('function')
      expect(typeof node2.create).toBe('function')

      const instance1 = node1.create()
      const instance2 = node2.create()

      expect(instance1).toBeDefined()
      expect(instance2).toBeDefined()

      instance1.free()
      instance2.free()
    }
  })
})
