import { AbstractBinder } from './AbstractBinder'
import { ShouldBe } from './Binder'

export class TextBinder extends AbstractBinder<string, string> {
  public optMinLength: number = 0
  public optMaxLength: number = Number.MAX_SAFE_INTEGER
  public optPattern?: RegExp
  // If true, do not trim the string in parse.
  public optRaw: boolean = false

  public constructor(type = 'text', defaultValue: string | null = null) {
    super(type, defaultValue)
  }

  public minLength(minLength: number): this {
    this.optMinLength = minLength
    return this
  }

  public maxLength(maxLength: number): this {
    this.optMaxLength = maxLength
    return this
  }

  public pattern(pattern: RegExp, flags?: string): this
  public pattern(pattern: string, flags?: string): this
  public pattern(pattern: any, flags?: string) {
    this.optPattern = new RegExp(pattern, flags)
    return this
  }

  public raw(): this {
    this.optRaw = true
    return this
  }

  public parse(repr: string | undefined): ShouldBe<string | null> {
    if (!repr) {
      return { value: null }
    }
    if (!this.optRaw) {
      repr = repr.trim()
    }
    return { value: repr }
  }

  public validate(value: string | null): React.ReactNode[] {
    const errors: React.ReactNode[] = super.validate(value)
    if (typeof value === 'string') {
      if (value.length < this.optMinLength) {
        errors.push(
          `Please enter at least ${this.optMinLength} characters (currently ${
            value.length
          } characters).`,
        )
      } else if (value.length > this.optMaxLength) {
        errors.push(
          `Please enter no more than ${
            this.optMaxLength
          } characters (currently ${value.length} characters).`,
        )
      }
      if (this.optPattern && !this.optPattern.test(value)) {
        errors.push(`Please match this pattern: ${this.optPattern}`)
      }
    }
    return errors
  }

  public render(value: string | null): string {
    return value || ''
  }
}
