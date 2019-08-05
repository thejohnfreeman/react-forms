import { AbstractBinder } from './AbstractBinder'
import { ShouldBe } from './Binder'

// A binder where the value and representation have the same type but
// different "missing" sentinels.
export class IdentityBinder<V> extends AbstractBinder<V, V> {
  public parse(repr: V | undefined): ShouldBe<V | null> {
    return { value: repr === undefined ? null : repr }
  }

  public render(value: V | null): V | undefined {
    return value === null ? undefined : value
  }
}
