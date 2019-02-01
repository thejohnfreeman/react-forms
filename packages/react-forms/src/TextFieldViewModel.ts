import { FieldViewModel, ShouldBe } from './FieldViewModel'

export class TextFieldViewModel extends FieldViewModel<string> {
  // Non-null should be the default, just as in SQL.
  private _required: boolean = true
  private _minLength: number = 0
  private _maxLength: number = Number.MAX_SAFE_INTEGER
  private _pattern?: RegExp

  public constructor(public initValue: string | null, type: string = 'text') {
    super(type, initValue)
  }

  public optional(): this {
    this._required = false
    return this
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
  public pattern(pattern, flags) {
    this._pattern = new RegExp(pattern, flags)
    return this
  }

  protected _parse(repr: string | null): ShouldBe<string | null> {
    return { value: repr }
  }

  protected _validate(value: string | null): React.ReactNode[] {
    const errors: React.ReactNode[] = []
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
    } else if (this._required) {
      errors.push('Please enter this field.')
    }
    return errors
  }

  protected _render(value: string | null): string | null {
    return value
  }
}
