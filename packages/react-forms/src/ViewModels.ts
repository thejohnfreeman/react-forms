import map from 'just-map-values'

// Cannoth both import *and* re-export.
// https://stackoverflow.com/q/54466881/618906
import { ViewModelConstructor } from './ViewModel'
import { GroupViewModel, ViewModelGroup } from './GroupViewModel'
import { TextBinder } from './TextBinder'

export namespace ViewModels {
  export function group<
    G extends ViewModelGroup,
    V = { [K in keyof G]: G[K]['value'] },
    R = { [K in keyof G]: G[K]['repr'] }
  >(
    ctors: {
      [K in keyof G]: ViewModelConstructor<G[K]['value'], G[K]['repr']>
    },
  ): ViewModelConstructor<V, R> {
    return {
      construct(initValues) {
        return new GroupViewModel(
          map(ctors, (ctor, key) => ctor.construct(initValues[key])),
        )
      },
    }
  }

  export function password(): ViewModelConstructor<string | null> & TextBinder {
    return new TextBinder('password')
  }

  export function text(): ViewModelConstructor<string | null> & TextBinder {
    return new TextBinder()
  }
}
