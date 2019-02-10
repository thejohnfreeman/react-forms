import { AbstractBinder } from './AbstractBinder'
import { ShouldBe } from './Binder'

// A binder for objects selected from a list. They'll generally have a name
// (or other human-readable representation) and a value (usually an
// identifier).
export class ObjectBinder<
  O extends object = { text: string; value: number }
> extends AbstractBinder<O, O | null> {
  public constructor(defaultValue: O | null = null) {
    super('object', defaultValue)
  }

  public parse(repr: O | null): ShouldBe<O | null> {
    return { value: repr }
  }

  public render(value: O | null): O | null {
    return value
  }
}
