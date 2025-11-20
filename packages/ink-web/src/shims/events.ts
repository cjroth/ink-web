type Listener = (...args: unknown[]) => void

export class EventEmitter {
  private listenerMap: Map<string, Set<Listener>> = new Map()

  on(event: string, listener: Listener) {
    let set = this.listenerMap.get(event)
    if (!set) {
      set = new Set()
      this.listenerMap.set(event, set)
    }
    set.add(listener)
    return this
  }

  addListener(event: string, listener: Listener) {
    return this.on(event, listener)
  }

  off(event: string, listener: Listener) {
    const set = this.listenerMap.get(event)
    if (set) set.delete(listener)
    return this
  }

  removeListener(event: string, listener: Listener) {
    return this.off(event, listener)
  }

  once(event: string, listener: Listener) {
    const wrapped: Listener = (...args: unknown[]) => {
      this.off(event, wrapped)
      listener(...args)
    }
    return this.on(event, wrapped)
  }

  emit(event: string, ...args: unknown[]) {
    const set = this.listenerMap.get(event)
    if (!set || set.size === 0) return false
    for (const listener of Array.from(set)) listener(...args)
    return true
  }

  removeAllListeners(event?: string) {
    if (typeof event === 'string') {
      this.listenerMap.delete(event)
    } else {
      this.listenerMap.clear()
    }
    return this
  }
}

export default EventEmitter
