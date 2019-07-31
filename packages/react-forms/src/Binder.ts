export type Errors = React.ReactNode[]

type ErrorsLike = undefined | React.ReactNode | Errors

export type ShouldBe<V> = { value: V } | { errors: Errors }

// A Validator checks a value and returns 0, 1, or more errors (as HTML or
// text).
export type Validator<V> = (value: V) => Promise<Errors>

export type ValidatorLike<V> = (value: V) => ErrorsLike | Promise<ErrorsLike>

export function validator<V>(validatorLike: ValidatorLike<V>): Validator<V> {
  return async (value: V) => {
    const errors = await validatorLike(value)
    if (!errors) {
      return []
    }
    if (Array.isArray(errors)) {
      return errors
    }
    return [errors]
  }
}

// A Binder handles the binding between value (i.e. model) and representation
// (i.e. view).
export interface Binder<V, R = V> {
  readonly type: string

  readonly defaultValue: V

  equals(a: V, b: V): boolean

  // Takes the representation and returns either a value or an array of error
  // messages (as HTML or text).
  parse(repr: R): ShouldBe<V>

  // Takes the value and returns a possibly empty array of error messages (as
  // HTML or text).
  validate(value: V): Promise<Errors>

  // Takes the value and returns the representation. Must not fail.
  render(value: V): R
}
