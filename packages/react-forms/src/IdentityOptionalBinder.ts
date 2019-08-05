import { AbstractOptionalBinder } from './AbstractOptionalBinder'
import { ShouldBe } from './Binder'

// A binder where the value and representation have the same type but
// different "missing" sentinels.
export class IdentityOptionalBinder<V> extends AbstractOptionalBinder<V> {
  public parse(repr: V | undefined): ShouldBe<V | null> {
    return { value: typeof repr === 'undefined' ? null : repr }
  }

  public render(value: V | null): V | undefined {
    return value === null ? undefined : value
  }
}
