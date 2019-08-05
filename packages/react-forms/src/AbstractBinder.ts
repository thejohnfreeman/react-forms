import {
  Binder,
  Errors,
  ShouldBe,
  validator,
  Validator,
  ValidatorLike,
} from './Binder'
import { DebugBinder } from './DebugBinder'
import { FieldViewModel, FieldViewModelConstructor } from './FieldViewModel'

// An AbstractBinder should really be divided into two classes: a builder
// (with methods `optional()`, `debug()`, and others that configure the set of
// validators) and an immutable `Binder` that cannot be configured after
// construction. Alas, I have not found an easy, readable, maintainable way to
// do it yet.
//
// `AbstractBinder` is the base class for most scalar field binders. Every
// HTML element can have an `undefined` value, corresponding to a missing
// value attribute. By convention, we should expect custom elements to be the
// same in that regard. Therefore, every binder needs to handle a "missing
// value" case. That means the value can be `null` and the representation can
// be `undefined`.
//
// It is impossible to have the same binder type implement both nullable and
// non-nullable fields without side-stepping the type-checker with casts. The
// nullable implementation must have a branch that checks whether the
// representation is `undefined` and thus sets the `value` to `null`, but that
// assignment is illegal in the non-nullable implementation. If we use casts
// everywhere, the type-checker becomes effectively useless. We want dependent
// types instead.
export abstract class AbstractBinder<V, R = V>
  implements
    Binder<V | null, R | undefined>,
    FieldViewModelConstructor<V | null, V | null, R | undefined> {
  public validators: Validator<V | null>[] = []
  // Non-nullable should be the default, just as in SQL.
  public optRequired: boolean = true

  public constructor(
    public readonly type: string,
    public readonly defaultValue: V | null = null,
  ) {}

  public optional(): this {
    this.optRequired = false
    return this
  }

  public test(validatorLike: ValidatorLike<V | null>): this {
    this.validators.push(validator(validatorLike))
    return this
  }

  public debug(): DebugBinder<V | null, V | null, R | undefined> {
    return new DebugBinder(this)
  }

  public construct(
    initValue: FieldViewModel<V | null, R | undefined> | V | null = this
      .defaultValue,
  ): FieldViewModel<V | null, R | undefined> {
    if (initValue instanceof FieldViewModel) {
      return initValue
    }
    return new FieldViewModel<V | null, R | undefined>(this, initValue)
  }

  public equals(a: V | null, b: V | null): boolean {
    return a === b
  }

  public abstract parse(repr: R | undefined): ShouldBe<V | null>

  public async validate(value: V | null): Promise<Errors> {
    let errors: Errors = []
    if (value === null && this.optRequired) {
      errors.push('Please enter this field.')
    }
    const promises = this.validators.map(validator => validator(value))
    errors = errors.concat(...(await Promise.all(promises)))
    return errors
  }

  public abstract render(value: V | null): R | undefined
}
