import { Errors, ValidatorLike } from './Errors'

export type ShouldBe<V> = { value: V } | { errors: Errors }

// A Binder handles the binding between value (i.e. model) and representation
// (i.e. view).
export interface Binder<V, R = V> {
  readonly type: string

  readonly defaultValue: V

  // Used to detect "dirty" values.
  equals(a: V, b: V): boolean

  // Takes the representation and returns either a value or an array of error
  // messages (as HTML or text).
  parse(repr: R): ShouldBe<V>

  readonly validators: ValidatorLike<V>[]

  // Takes the value and returns the representation. Must not fail.
  render(value: V): R
}
