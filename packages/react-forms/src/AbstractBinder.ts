import {
  Binder,
  Errors,
  ShouldBe,
  validator,
  Validator,
  ValidatorLike,
} from './Binder'
import { DebugBinder } from './DebugBinder'
import { ViewModel, ViewModelConstructor } from './ViewModel'
import { FieldViewModel } from './FieldViewModel'

// An AbstractBinder should really be divided into two classes: a builder
// (with methods `optional()`, `debug()`, and others that configure the set of
// validators) and an immutable `Binder` that cannot be configured after
// construction. Alas, I have not found an easy, readable, maintainable way to
// do it yet.
export abstract class AbstractBinder<V, R = V>
  implements Binder<V | null, R>, ViewModelConstructor<V | null, R> {
  // Non-null should be the default, just as in SQL.
  public optRequired: boolean = true
  public validators: Validator<V | null>[] = []

  public constructor(
    public readonly type: string,
    public readonly defaultValue: V | null,
  ) {}

  public optional(): this {
    this.optRequired = false
    return this
  }

  public check(validatorLike: ValidatorLike<V | null>) {
    this.validators.push(validator(validatorLike))
    return this
  }

  public debug(): DebugBinder<V, R> {
    return new DebugBinder(this)
  }

  public construct(
    initValue: FieldViewModel<V, R> | V | null = this.defaultValue,
  ): ViewModel<V | null, R> {
    if (initValue instanceof FieldViewModel) {
      return initValue
    }
    return new FieldViewModel<V, R>(this, initValue)
  }

  public equals(a: V, b: V): boolean {
    return a === b
  }

  public parse(repr: R): ShouldBe<V | null> {
    return { value: (repr as unknown) as V }
  }

  public async validate(value: V | null): Promise<Errors> {
    let errors: Errors = []
    if (value === null && this.optRequired) {
      errors.push('Please enter this field.')
    }
    const promises = this.validators.map(validator => validator(value))
    errors = errors.concat(...(await Promise.all(promises)))
    return errors
  }

  public render(value: V): R {
    return (value as unknown) as R
  }
}
