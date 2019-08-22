import { AbstractBinder } from './AbstractBinder'

// An `AbstractOptionalBinder` should really be divided into two classes:
// a builder (with methods `optional()`, `debug()`, and others that configure
// the set of validators) and an immutable `Binder` that cannot be configured
// after construction. I have not yet spent much time looking for a good way
// to do it.
//
// `AbstractOptionalBinder` is the base class for most scalar field binders.
// Every HTML element can have an `undefined` value, corresponding to
// a missing value attribute. By convention, we should expect custom elements
// to be the same in that regard. Therefore, every binder needs to handle
// a "missing value" case. That means the value can be `null` and the
// representation can be `undefined`.
//
// It is impossible to have the same binder type implement both nullable and
// non-nullable fields without side-stepping the type-checker with casts. The
// nullable implementation must have a branch that checks whether the
// representation is `undefined` and thus sets the `value` to `null`, but that
// assignment is illegal in the non-nullable implementation. If we use casts
// everywhere, the type-checker becomes effectively useless. We want dependent
// types instead.
//
// TODO: Differentiate `parsedValue` from `validatedValue`. Maybe it will let
// us implement optional values without any casting.
export abstract class AbstractOptionalBinder<V, R = V> extends AbstractBinder<
  V | null,
  R | undefined
> {
  // Non-nullable should be the default, just as in SQL.
  public optRequired: boolean = true

  public constructor(
    public readonly type: string,
    public readonly defaultValue: V | null = null,
  ) {
    super(type, defaultValue)
    this.test((value: V | null) => {
      if (value === null && this.optRequired) {
        return 'Please enter this field.'
      }
    })
  }

  public optional(optional: boolean = true): this {
    this.optRequired = !optional
    return this
  }
}
