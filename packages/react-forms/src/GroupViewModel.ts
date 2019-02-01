import map from 'just-map-values'
import { computed } from 'mobx'

import { ViewModel } from './ViewModel.interface'

// We really want type aliases within class scopes.
// https://github.com/Microsoft/TypeScript/issues/7061
export class GroupViewModel<
  G extends { [key: string]: ViewModel<any, any> },
  V = { [K in keyof G]: G[K]['value'] },
  R = { [K in keyof G]: G[K]['repr'] }
> implements ViewModel<V, R> {
  private readonly proxy: V

  public constructor(public readonly members: G) {
    this.proxy = makeGroupProxy(this)
  }

  public get value(): V {
    return this.proxy
  }

  public get $(): V {
    return this.value
  }

  public set value(value: V) {
    Object.assign(this.proxy, value)
  }

  public get repr(): R {
    return map(this.members, vm => vm.repr)
  }

  @computed
  public get touched(): boolean {
    return Object.values(this.members).some(vm => vm.touched)
  }

  public set touched(touched: boolean) {
    Object.values(this.members).forEach(vm => (vm.touched = touched))
  }

  @computed
  public get untouched(): boolean {
    return !this.touched
  }

  public set untouched(untouched: boolean) {
    this.touched = !untouched
  }
}

// TODO: Use a real Proxy to make this easier.
function makeGroupProxy<G extends { [key: string]: ViewModel<any, any> }, V, R>(
  gvm: GroupViewModel<G, V, R>,
): V {
  const proxy = {}
  Object.keys(gvm.members).forEach(key => {
    Object.defineProperty(proxy, key, {
      enumerable: true,
      get: () => gvm.members[key].value,
      set: value => (gvm.members[key].value = value),
    })
  })
  return Object.freeze(proxy) as V
}

// export function group(ctors: ) {
//   return function makeGroup(
// }
