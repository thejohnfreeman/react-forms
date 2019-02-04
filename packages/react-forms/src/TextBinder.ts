import { Binder, ShouldBe } from './Binder'
import { FieldViewModel } from './FieldViewModel'
import { ViewModel, ViewModelConstructor } from './ViewModel'

export class TextBinder
  implements
    Binder<string | null, string>,
    ViewModelConstructor<string | null, string> {
  // Non-null should be the default, just as in SQL.
  private _required: boolean = true
  private _minLength: number = 0
  private _maxLength: number = Number.MAX_SAFE_INTEGER
  private _pattern?: RegExp

  public constructor(
    public readonly type = 'text',
    public readonly defaultValue = null,
  ) {}

  public construct(
    initValue: string | null = null,
  ): ViewModel<string | null, string> {
    return new FieldViewModel<string, string>(this, initValue)
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
  public pattern(pattern: any, flags?: string) {
    this._pattern = new RegExp(pattern, flags)
    return this
  }

  public equals(a: string | null, b: string | null) {
    return a === b
  }

  public parse(repr: string | undefined): ShouldBe<string | null> {
    return { value: repr || null }
  }

  public validate(value: string | null): React.ReactNode[] {
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

  public render(value: string | null): string {
    return value || ''
  }
}
