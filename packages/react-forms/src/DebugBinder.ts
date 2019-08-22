import { Binder, ShouldBe } from './Binder'
import { ValidatorLike } from './Errors'
import { ViewModel, ViewModelConstructor } from './ViewModel'

// A binder for debugging other binders. It proxies another binder, logging
// each method's arguments and return value.
// TODO: Try a Proxy.
export class DebugBinder<I, V extends I, R>
  implements Binder<V, R>, ViewModelConstructor<I, V, R> {
  public constructor(
    private readonly _target: Binder<V, R> & ViewModelConstructor<I, V, R>,
  ) {}

  public get type() {
    return this._target.type
  }

  public get defaultValue() {
    return this._target.defaultValue
  }

  public get validators() {
    return this._target.validators
  }

  public construct(
    initValue: ViewModel<V, R> | I = this._target.defaultValue,
  ): ViewModel<V, R> {
    const viewModel = this._target.construct(initValue)
    console.log('construct(', initValue, ') =>', viewModel)
    return viewModel
  }

  public equals(a: V, b: V) {
    return this._target.equals(a, b)
  }

  public parse(repr: R): ShouldBe<V> {
    const parsed = this._target.parse(repr)
    console.log('parse(', repr, ') =>', parsed)
    return parsed
  }

  public test(validatorLike: ValidatorLike<V>): this {
    this._target.validators.push(async (value: V) => {
      const errors = await validatorLike(value)
      console.log('validate(', value, ') =>', errors)
      return errors
    })
    return this
  }

  public render(value: V): R {
    const rendered = this._target.render(value)
    console.log('render(', value, ') =>', rendered)
    return rendered
  }
}
