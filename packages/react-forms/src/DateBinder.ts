import { IdentityOptionalBinder } from './IdentityOptionalBinder'

// A binder for dates as dates. For dates as strings, use DateStringBinder.
// Once we add validation, factor it to a common superclass of DateBinder and
// DateStringBinder.
export class DateBinder extends IdentityOptionalBinder<Date> {
  public constructor(defaultValue: Date | null = null) {
    super('date', defaultValue)
  }
}
