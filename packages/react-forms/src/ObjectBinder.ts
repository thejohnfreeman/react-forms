import compare from 'just-compare'

import { ShouldBe } from './Binder'
import { AbstractOptionalBinder } from './AbstractOptionalBinder'
import { Option } from './OptionBinder'

// A binder for objects selected from a list. They'll generally have a name
// (or other human-readable representation) and a value (usually an
// identifier).
export class ObjectBinder<
  V extends object = Option<number>,
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

  public equals(a: V | null, b: V | null): boolean {
    return compare(a, b)
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
