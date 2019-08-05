import { AbstractBinder } from './AbstractBinder'
import { ShouldBe } from './Binder'

// A binder for dates as dates. For dates as strings, use DateStringBinder.
// Once we add validation, factor it to a common superclass of DateBinder and
// DateStringBinder.
export class DateBinder extends AbstractBinder<Date | null, Date | undefined> {
  public constructor(defaultValue: Date | null = null) {
    super('date', defaultValue)
  }

  public parse(repr: Date | undefined): ShouldBe<Date | null> {
    return { value: repr || null }
  }

  public render(value: Date | null): Date | undefined {
    return value || undefined
  }
}
