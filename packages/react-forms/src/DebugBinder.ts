import { Binder, ShouldBe } from './Binder'
import { ViewModel, ViewModelConstructor } from './ViewModel'

type BinderViewModelConstructor<V, R> = Binder<V | null, R> &
  ViewModelConstructor<V | null, V | null, R>

// A binder for debugging other binders. It proxies another binder, logging
// each method's arguments and return value.
export class DebugBinder<V, R>
  implements Binder<V | null, R>, ViewModelConstructor<V | null, V | null, R> {
  public constructor(
    private readonly _target: BinderViewModelConstructor<V, R>,
  ) {}

  public get type() {
    return this._target.type
  }

  public get defaultValue() {
    return this._target.defaultValue
  }

  public construct(
    initValue: V | null = this._target.defaultValue,
  ): ViewModel<V | null, R> {
    const viewModel = this._target.construct(initValue)
    console.log('construct(', initValue, ') =>', viewModel)
    return viewModel
  }

  public equals(a: V | null, b: V | null) {
    return this._target.equals(a, b)
  }

  public parse(repr: R): ShouldBe<V | null> {
    const parsed = this._target.parse(repr)
    console.log('parse(', repr, ') =>', parsed)
    return parsed
  }

  public async validate(value: V | null): Promise<React.ReactNode[]> {
    const errors = await this._target.validate(value)
    console.log('validate(', value, ') =>', errors)
    return errors
  }

  public render(value: V | null): R {
    const rendered = this._target.render(value)
    console.log('render(', value, ') =>', rendered)
    return rendered
  }
}
