import { Binder, ShouldBe } from './Binder'
import { ValidatorLike } from './Errors'
import { DebugBinder } from './DebugBinder'
import { FieldViewModel, FieldViewModelConstructor } from './FieldViewModel'

export abstract class AbstractBinder<V, R = V>
  implements Binder<V, R>, FieldViewModelConstructor<V, V, R> {
  public readonly validators: ValidatorLike<V>[] = []

  public constructor(
    public readonly type: string,
    public readonly defaultValue: V,
  ) {}

  public test(validatorLike: ValidatorLike<V>): this {
    this.validators.push(validatorLike)
    return this
  }

  public debug(): DebugBinder<V, V, R> {
    return new DebugBinder(this)
  }

  public construct(
    initValue: FieldViewModel<V, R> | V = this.defaultValue,
  ): FieldViewModel<V, R> {
    if (initValue instanceof FieldViewModel) {
      return initValue
    }
    return new FieldViewModel<V, R>(this, initValue)
  }

  public equals(a: V, b: V): boolean {
    return a === b
  }

  public abstract parse(repr: R): ShouldBe<V>

  public abstract render(value: V): R
}
