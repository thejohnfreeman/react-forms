import dayjs from 'dayjs'
// I guess they don't have types for the plugins.
// @ts-ignore
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

import { AbstractBinder } from './AbstractBinder'
import { ShouldBe } from './Binder'

// A binder for dates as strings. For dates as dates, use DateBinder.
export class DateStringBinder extends AbstractBinder<string, Date | undefined> {
  public optFormat: string | undefined = undefined

  public constructor(defaultValue: string | null = null) {
    super('date-string', defaultValue)
  }

  public format(format?: string): this {
    this.optFormat = format
    return this
  }

  public parse(repr: Date | undefined): ShouldBe<string | null> {
    return { value: repr ? dayjs(repr).format(this.optFormat) : null }
  }

  public render(value: string | null): Date | undefined {
    return value ? dayjs(value, this.optFormat as any).toDate() : undefined
  }
}
