import map from 'just-map-values'

import { ArrayViewModel } from './ArrayViewModel'
import { BooleanBinder } from './BooleanBinder'
import { DateBinder } from './DateBinder'
import { DateStringBinder } from './DateStringBinder'
import { Flatten, GroupViewModel, ViewModelGroup } from './GroupViewModel'
import { IntegerBinder } from './IntegerBinder'
import { ObjectBinder } from './ObjectBinder'
import { Option, OptionBinder } from './OptionBinder'
import { TextBinder } from './TextBinder'
import { ViewModelConstructor } from './ViewModel'

// TODO: Is there really no better way to declare these types?
interface GroupViewModelConstructor<
  G extends ViewModelGroup,
  V extends Flatten<G, 'value'> = Flatten<G, 'value'>,
  R extends Flatten<G, 'repr'> = Flatten<G, 'repr'>
  > extends ViewModelConstructor<V, R, GroupViewModel<G, V, R>> {
  construct(
    initValues?: GroupViewModel<G, V, R> | Partial<V>,
  ): GroupViewModel<G, V, R>
}

interface ArrayViewModelConstructor<V, R>
  extends ViewModelConstructor<V[], R[]> {
  construct(initValues?: ArrayViewModel<V, R> | V[]): ArrayViewModel<V, R>
}

export namespace ViewModels {
  export function array<V, R>(
    ctor: ViewModelConstructor<V, R>,
  ): ArrayViewModelConstructor<V, R> {
    return {
      construct(
        initValues: ArrayViewModel<V, R> | V[] = [],
      ): ArrayViewModel<V, R> {
        if (initValues instanceof ArrayViewModel) {
          return initValues
        }
        return new ArrayViewModel(
          initValues.map(initValue => ctor.construct(initValue)),
        )
      },
    }
  }

  export function boolean(defaultValue: boolean = false): BooleanBinder {
    return new BooleanBinder(defaultValue)
  }

  export function date(defaultValue?: Date): DateBinder {
    return new DateBinder(defaultValue)
  }

  export function dateString(defaultValue?: string): DateStringBinder {
    return new DateStringBinder(defaultValue)
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
    // TODO: Add a `debug()` method that tells `construct(...)` to log to
    // console.
    return {
      construct(
        initValues: GroupViewModel<G, V, R> | Partial<V> = {},
      ): GroupViewModel<G, V, R> {
        if (initValues instanceof GroupViewModel) {
          return initValues
        }
        const viewModelGroup = map(ctors, (ctor, key) =>
          ctor.construct(initValues[key]),
        ) as G
        return new GroupViewModel(viewModelGroup)
      },
    }
  }

  export function integer(defaultValue?: number): IntegerBinder {
    return new IntegerBinder(defaultValue)
  }

  export function object<O extends object>(
    defaultValue: O | null = null,
  ): ObjectBinder<O> {
    return new ObjectBinder(defaultValue)
  }

  export function oneOf<T>(
    options: Option<T>[],
    defaultValue: T | null = null,
  ) {
    return new OptionBinder(options, defaultValue)
  }

  export function password(): TextBinder {
    return new TextBinder('password')
  }

  export function text(defaultValue?: string): TextBinder {
    return new TextBinder('text', defaultValue)
  }
}
