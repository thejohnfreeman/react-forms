import { AbstractBinder } from './AbstractBinder'
import { ShouldBe } from './Binder'

export class TextBinder extends AbstractBinder<string, string> {
  private _minLength: number = 0
  private _maxLength: number = Number.MAX_SAFE_INTEGER
  private _pattern?: RegExp
  // If true, do not trim the string in parse.
  private _raw: boolean = false

  public constructor(type = 'text', defaultValue: string | null = null) {
    super(type, defaultValue)
  }

  public minLength(minLength: number): this {
    this._minLength = minLength
    return this
  }

  public maxLength(maxLength: number): this {
    this._maxLength = maxLength
    return this
  }

  public pattern(pattern: RegExp, flags?: string): this
  public pattern(pattern: string, flags?: string): this
  public pattern(pattern: any, flags?: string) {
    this._pattern = new RegExp(pattern, flags)
    return this
  }

  public raw(): this {
    this._raw = true
    return this
  }

  public parse(repr: string | undefined): ShouldBe<string | null> {
    if (!repr) {
      return { value: null }
    }
    if (!this._raw) {
      repr = repr.trim()
    }
    return { value: repr }
  }

  public validate(value: string | null): React.ReactNode[] {
    const errors: React.ReactNode[] = super.validate(value)
    if (typeof value === 'string') {
      if (value.length < this._minLength) {
        errors.push(
          `Please enter at least ${this._minLength} characters (currently ${
            value.length
          } characters).`,
        )
      } else if (value.length > this._maxLength) {
        errors.push(
          `Please enter no more than ${this._maxLength} characters (currently ${
            value.length
          } characters).`,
        )
      }
      if (this._pattern && !this._pattern.test(value)) {
        errors.push(`Please match this pattern: ${this._pattern}`)
      }
    }
    return errors
  }

  public render(value: string | null): string {
    return value || ''
  }
}
