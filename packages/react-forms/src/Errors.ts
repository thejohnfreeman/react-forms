export type PromiseLike<T> = T | Promise<T>

export type Errors = React.ReactNode[]

export type ErrorsLike = undefined | React.ReactNode | Errors

// Convert an ErrorsLike to an Errors.
export function Errors(errorsLike: ErrorsLike): Errors {
  if (!errorsLike) {
    return []
  }
  if (Array.isArray(errorsLike)) {
    return errorsLike
  }
  return [errorsLike]
}

// A Validator checks a value and returns 0, 1, or more errors (as HTML or
// text).
export type Validator<V> = (value: V) => Promise<Errors>

// A ValidatorLike is like a Validator, but returns something convertible to
// Errors.
export type ValidatorLike<V> = (value: V) => PromiseLike<ErrorsLike>

// Convert a ValidatorLike to a Validator.
export function Validator<V>(validatorLike: ValidatorLike<V>): Validator<V> {
  return async (value: V) => Errors(await validatorLike(value))
}
