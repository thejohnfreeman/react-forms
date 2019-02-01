import map from 'just-map-values'

// Cannoth both import *and* re-export.
// https://stackoverflow.com/q/54466881/618906
import { ViewModel as LocalViewModel } from './ViewModel.interface'
import { FieldViewModel } from './FieldViewModel'
import { GroupViewModel } from './GroupViewModel'

interface Constructor<T> {
  (initValue: T): LocalViewModel<T>
}

export namespace ViewModel {
  export function group<G>(
    ctors: { [K in keyof G]: Constructor<G[K]> },
  ): Constructor<G> {
    return initValues =>
      new GroupViewModel<G>(map(ctors, (ctor, key) => ctor(initValues[key])))
  }

  export function password(): (value: string) => FieldViewModel<string> {
    return initValue => new FieldViewModel('password', initValue)
  }

  export function text() {
    return initValue => new FieldViewModel('text', initValue)
  }
}
