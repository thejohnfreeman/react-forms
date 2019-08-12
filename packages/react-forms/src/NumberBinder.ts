import { Errors } from './Binder'
import { IdentityOptionalBinder } from './IdentityOptionalBinder'

export class NumberBinder extends IdentityOptionalBinder<number> {
  public optMinimum: number = Number.NEGATIVE_INFINITY
  public optMaximum: number = Number.POSITIVE_INFINITY

  public constructor(
    defaultValue: number | null = null,
    type: string = 'number',
  ) {
    super(type, defaultValue)
  }

  public minimum(minimum: number): this {
    this.optMinimum = minimum
    return this
  }

  public maximum(maximum: number): this {
    this.optMaximum = maximum
    return this
  }

  public async validate(value: number | null): Promise<Errors> {
    const errors: Errors = await super.validate(value)
    if (typeof value === 'number') {
      if (value < this.optMinimum) {
        errors.push(`Must be greater than ${this.optMinimum}.`)
      } else if (value > this.optMaximum) {
        errors.push(`Must be less than ${this.optMaximum}.`)
      }
    }
    return errors
  }
}
