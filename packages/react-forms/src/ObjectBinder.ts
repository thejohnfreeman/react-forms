import { ShouldBe } from './Binder'
import { AbstractOptionalBinder } from './AbstractOptionalBinder'

// A binder for objects selected from a list. They'll generally have a name
// (or other human-readable representation) and a value (usually an
// identifier).
export class ObjectBinder<
  V extends object = { text: string; value: number },
  R extends object = V
> extends AbstractOptionalBinder<V, R> {
  public optShape: Record<string, string> = { text: 'text', value: 'value' }

  public constructor(defaultValue: V | null = null) {
    super('object', defaultValue)
  }

  public to(shape: Record<string, string>): this {
    this.optShape = shape
    return this
  }

  public parse(repr: R | undefined): ShouldBe<V | null> {
    if (typeof repr === 'undefined') {
      return { value: null }
    }
    const value = {} as V
    for (const [rkey, vkey] of Object.entries(this.optShape)) {
      value[vkey] = repr[rkey]
    }
    return { value }
  }

  public render(value: V | null): R | undefined {
    if (value === null) {
      return
    }
    const repr = {} as R
    for (const [rkey, vkey] of Object.entries(this.optShape)) {
      repr[rkey] = value[vkey]
    }
    return repr
  }
}
