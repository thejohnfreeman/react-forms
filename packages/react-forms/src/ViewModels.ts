import { ArrayViewModel, ArrayViewModelConstructor } from './ArrayViewModel'
import { BooleanBinder } from './BooleanBinder'
import { DateBinder } from './DateBinder'
import { DateStringBinder } from './DateStringBinder'
import { GroupBinder } from './GroupBinder'
import {
  ViewModelConstructorGroup,
  ViewModelGroupIsomorphicTo,
} from './GroupViewModel'
import { IntegerBinder } from './IntegerBinder'
import { IntegerStringBinder } from './IntegerStringBinder'
import { NumberBinder } from './NumberBinder'
import { ObjectBinder } from './ObjectBinder'
import { Option, OptionBinder } from './OptionBinder'
import { TextBinder } from './TextBinder'
import { ViewModel, ViewModelConstructor } from './ViewModel'

export namespace ViewModels {
  export function array<
    I,
    V extends I = I,
    R = V,
    M extends ViewModel<V, R> = ViewModel<V, R>
  >(
    ctor: ViewModelConstructor<I, V, R, M>,
  ): ArrayViewModelConstructor<I, V, R, M> {
    return {
      construct(
        initValues: ArrayViewModel<V, R, M> | I[] = [],
      ): ArrayViewModel<V, R, M> {
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
  ): GroupBinder<ViewModelGroupIsomorphicTo<G>> {
    return new GroupBinder(ctors)
  }

  export function integer(defaultValue: number | null = null): IntegerBinder {
    return new IntegerBinder(defaultValue)
  }

  export function integerString(
    defaultValue: number | null = null,
  ): IntegerStringBinder {
    return new IntegerStringBinder(defaultValue)
  }

  export function money(defaultValue: number | null = 0.0): NumberBinder {
    return new NumberBinder(defaultValue).minimum(0.0)
  }

  export function number(defaultValue: number | null = null): NumberBinder {
    return new NumberBinder(defaultValue)
  }

  export function object<O extends object = Option<number>>(
    defaultValue: O | null = null,
  ): ObjectBinder<O> {
    return new ObjectBinder(defaultValue)
  }

  export function oneOf<T>(
    options: Option<T>[],
    defaultValue: T | null = null,
  ): OptionBinder<T> {
    return new OptionBinder(options, defaultValue)
  }

  export function password(): TextBinder {
    return new TextBinder('password', null)
  }

  export function text(defaultValue: string | null = null): TextBinder {
    return new TextBinder('text', defaultValue)
  }
}
