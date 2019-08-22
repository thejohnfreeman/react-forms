import { IdentityOptionalBinder } from './IdentityOptionalBinder'

export class NumberBinder extends IdentityOptionalBinder<number> {
  public optMinimum: number = Number.NEGATIVE_INFINITY
  public optMaximum: number = Number.POSITIVE_INFINITY

  public constructor(
    defaultValue: number | null = null,
    type: string = 'number',
  ) {
    super(type, defaultValue)
    this.test((value: number | null) => {
      if (typeof value !== 'number') {
        return
      }
      if (value < this.optMinimum) {
        return `Must be greater than ${this.optMinimum}.`
      }
      if (value > this.optMaximum) {
        return `Must be less than ${this.optMaximum}.`
      }
    })
  }

  public minimum(minimum: number): this {
    this.optMinimum = minimum
    return this
  }

  public maximum(maximum: number): this {
    this.optMaximum = maximum
    return this
  }
}
