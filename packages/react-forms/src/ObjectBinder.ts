import { IdentityOptionalBinder } from './IdentityOptionalBinder'

// A binder for objects selected from a list. They'll generally have a name
// (or other human-readable representation) and a value (usually an
// identifier).
export class ObjectBinder<
  O extends object = { text: string; value: number }
> extends IdentityOptionalBinder<O> {
  public constructor(defaultValue: O | null = null) {
    super('object', defaultValue)
  }
}
