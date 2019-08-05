import { ArrayViewModel, ArrayViewModelConstructor } from './ArrayViewModel'
import { BooleanBinder } from './BooleanBinder'
import { DateBinder } from './DateBinder'
import { DateStringBinder } from './DateStringBinder'
import {
  GroupViewModel,
  GroupViewModelConstructor,
  ValueGroup,
  ViewModelConstructorGroup,
  ViewModelGroupIsomorphicTo,
} from './GroupViewModel'
import { IntegerBinder } from './IntegerBinder'
import { ObjectBinder } from './ObjectBinder'
import { map } from './Objects'
import { Option, OptionBinder } from './OptionBinder'
import { TextBinder } from './TextBinder'
import { ViewModelConstructor } from './ViewModel'

export namespace ViewModels {
  export function array<I, V extends I, R>(
    ctor: ViewModelConstructor<I, V, R>,
  ): ArrayViewModelConstructor<I, V, R> {
    return {
      construct(
        initValues: ArrayViewModel<V, R> | I[] = [],
      ): ArrayViewModel<V, R> {
        return initValues instanceof ArrayViewModel
          ? initValues
          : new ArrayViewModel(
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

  export function group<G extends ViewModelConstructorGroup>(
    ctors: G,
  ): GroupViewModelConstructor<ViewModelGroupIsomorphicTo<G>> {
    // TODO: Add a `debug()` method that tells `construct(...)` to log to
    // console.
    return {
      construct(
        initValues:
          | GroupViewModel<ViewModelGroupIsomorphicTo<G>>
          | Partial<ValueGroup<ViewModelGroupIsomorphicTo<G>>> = {},
      ): GroupViewModel<ViewModelGroupIsomorphicTo<G>> {
        return initValues instanceof GroupViewModel
          ? initValues
          : new GroupViewModel(map(ctors, (ctor, key) =>
              ctor.construct(initValues[key]),
            ) as ViewModelGroupIsomorphicTo<G>)
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
