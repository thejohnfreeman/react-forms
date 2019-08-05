import { AbstractBinder } from './AbstractBinder'
import { ShouldBe } from './Binder'

// A binder where the value and representation have the same type.
export class IdentityBinder<V> extends AbstractBinder<V> {
  public parse(repr: V): ShouldBe<V> {
    return { value: repr }
  }

  public render(value: V): V {
    return value
  }
}
