export type ShouldBe<V> = { value: V } | { errors: React.ReactNode[] }

// A Binder handles the binding between value (i.e. model) and representation
// (i.e. view).
export interface Binder<V, R = V> {
  type: string

  equals(a: V, b: V): boolean

  // Takes the representation and returns either a value or an array of error
  // messages (as HTML or text).
  parse(repr: R): ShouldBe<V>

  // Takes the value and returns a possibly empty array of error messages (as
  // HTML or text).
  validate(value: V): React.ReactNode[]

  // Takes the value and returns the representation. Must not fail.
  render(value: V): R
}
