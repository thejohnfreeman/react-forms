import dayjs from 'dayjs'
// I guess they don't have types for the plugins.
// @ts-ignore
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

import { Binder, ShouldBe } from './Binder'
import { FieldViewModel } from './FieldViewModel'
import { ViewModel, ViewModelConstructor } from './ViewModel'

// A binder for dates as strings. For dates as dates, use DateBinder.
export class DateStringBinder
  implements
    Binder<string | null, Date | undefined>,
    ViewModelConstructor<string | null, Date | undefined> {
  private _format: string | undefined = undefined

  public constructor(public readonly defaultValue: string | null = null) {}

  public readonly type = 'date-string'

  public format(format?: string): this {
    this._format = format
    return this
  }

  public construct(
    initValue: string | null = null,
  ): ViewModel<string | null, Date | undefined> {
    return new FieldViewModel<string, Date | undefined>(this, initValue)
  }

  public equals(a: string | null, b: string | null) {
    return a === b
  }

  public parse(repr: Date | undefined): ShouldBe<string | null> {
    return { value: repr ? dayjs(repr).format(this._format) : null }
  }

  public validate(_value: string | null): React.ReactNode[] {
    return []
  }

  public render(value: string | null): Date | undefined {
    return value ? dayjs(value, this._format as any).toDate() : undefined
  }
}
