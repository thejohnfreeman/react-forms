import map from 'just-map-values'

import { BooleanBinder } from './BooleanBinder'
import { DateStringBinder } from './DateStringBinder'
import { DebugBinder } from './DebugBinder'
import { Flatten, GroupViewModel, ViewModelGroup } from './GroupViewModel'
import { TextBinder } from './TextBinder'
import { ViewModelConstructor } from './ViewModel'

// TODO: Is there really no better way to declare these types?
interface GroupViewModelConstructor<
  G extends ViewModelGroup,
  V extends Flatten<G, 'value'> = Flatten<G, 'value'>,
  R extends Flatten<G, 'repr'> = Flatten<G, 'repr'>
> extends ViewModelConstructor<V, R> {
  construct(initValue?: Partial<V>): GroupViewModel<G, V, R>
}

export namespace ViewModels {
  export function boolean(defaultValue: boolean = false): BooleanBinder {
    return new BooleanBinder(defaultValue)
  }

  export function dateString(defaultValue?: string): DateStringBinder {
    return new DateStringBinder(defaultValue)
  }

  export function debug<T = any>(): DebugBinder<T> {
    return new DebugBinder()
  }

  export function group<
    G extends ViewModelGroup,
    V extends Flatten<G, 'value'> = Flatten<G, 'value'>,
    R extends Flatten<G, 'repr'> = Flatten<G, 'repr'>
  >(
    ctors: {
      [K in keyof G]: ViewModelConstructor<G[K]['value'], G[K]['repr']>
    },
  ): GroupViewModelConstructor<G, V, R> {
    return {
      construct(initValues: Partial<V> = {}): GroupViewModel<G, V, R> {
        const viewModelGroup = map(ctors, (ctor, key) =>
          ctor.construct(initValues[key]),
        ) as G
        return new GroupViewModel(viewModelGroup)
      },
    }
  }

  export function password(): TextBinder {
    return new TextBinder('password')
  }

  export function text(defaultValue?: string): TextBinder {
    return new TextBinder('text', defaultValue)
  }
}
