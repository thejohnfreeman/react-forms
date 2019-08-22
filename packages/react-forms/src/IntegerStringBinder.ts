import { AbstractOptionalBinder } from './AbstractOptionalBinder'
import { ShouldBe } from './Binder'

export class IntegerStringBinder extends AbstractOptionalBinder<
  number,
  string
> {
  public constructor(defaultValue: number | null = null) {
    super('integer-string', defaultValue)
  }

  public parse(repr: string | undefined): ShouldBe<number | null> {
    if (typeof repr === 'undefined') {
      return { value: null }
    }
    const value = parseInt(repr)
    if (Number.isNaN(value)) {
      return { errors: ['Please enter an integer.'] }
    }
    return { value }
  }

  public render(value: number | null): string | undefined {
    return value === null ? undefined : `${value}`
  }
}
