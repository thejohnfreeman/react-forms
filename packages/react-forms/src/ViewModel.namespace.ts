import map from 'just-map-values'

// Cannoth both import *and* re-export.
// https://stackoverflow.com/q/54466881/618906
import { ViewModel as LocalViewModel } from './ViewModel.interface'
import { FieldViewModel } from './FieldViewModel'
import { GroupViewModel } from './GroupViewModel'

interface Constructor<V, R = V> {
  (initValue: V): LocalViewModel<V, R>
}

export namespace ViewModel {
  export function group<
    G extends { [key: string]: LocalViewModel<any, any> },
    V = { [K in keyof G]: G[K]['value'] },
    R = { [K in keyof G]: G[K]['repr'] }
  >(
    ctors: { [K in keyof G]: Constructor<G[K]['value'], G[K]['repr']> },
  ): Constructor<V, R> {
    return initValues =>
      new GroupViewModel(map(ctors, (ctor, key) => ctor(initValues[key])))
  }

  export function password(): Constructor<string | null> {
    return initValue => new FieldViewModel('password', initValue)
  }

  export function text(): Constructor<string | null> {
    return initValue => new FieldViewModel('text', initValue)
  }
}
