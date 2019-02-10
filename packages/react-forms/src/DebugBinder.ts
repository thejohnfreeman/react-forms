import { Binder, ShouldBe } from './Binder'
import { FieldViewModel } from './FieldViewModel'
import { ViewModel, ViewModelConstructor } from './ViewModel'

// A binder for debugging other binders. It proxies another binder, logging
// each method's arguments and return value.
export class DebugBinder<V, R>
  implements Binder<V | null, R>, ViewModelConstructor<V | null, R> {
  public constructor(private readonly _target: Binder<V | null, R>) {}

  public get type() {
    return this._target.type
  }

  public get defaultValue() {
    return this._target.defaultValue
  }

  public construct(initValue: V | null = null): ViewModel<V | null, R> {
    return new FieldViewModel<V, R>(this, initValue)
  }

  public equals(a: V | null, b: V | null) {
    return this._target.equals(a, b)
  }

  public parse(repr: R): ShouldBe<V | null> {
    const parsed = this._target.parse(repr)
    console.log('parse(', repr, ') =>', parsed)
    return parsed
  }

  public validate(value: V | null): React.ReactNode[] {
    const errors = this._target.validate(value)
    console.log('validate(', value, ') =>', errors)
    return errors
  }

  public render(value: V | null): R {
    const rendered = this._target.render(value)
    console.log('render(', value, ') =>', rendered)
    return rendered
  }
}
