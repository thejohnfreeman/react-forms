import { Binder, ShouldBe } from './Binder'
import { FieldViewModel } from './FieldViewModel'
import { ViewModel, ViewModelConstructor } from './ViewModel'

// A binder for dates as dates. For dates as strings, use DateStringBinder.
// Once we add validation, factor it to a common superclass of DateBinder and
// DateStringBinder.
export class DateBinder
  implements
    Binder<Date | null, Date | undefined>,
    ViewModelConstructor<Date | null, Date | undefined> {
  public constructor(public readonly defaultValue: Date | null = null) {}

  public readonly type = 'date'

  public construct(
    initValue: Date | null = null,
  ): ViewModel<Date | null, Date | undefined> {
    return new FieldViewModel<Date, Date | undefined>(this, initValue)
  }

  public equals(a: Date | null, b: Date | null) {
    return a === b
  }

  public parse(repr: Date | undefined): ShouldBe<Date | null> {
    return { value: repr || null }
  }

  public validate(_value: Date | null): React.ReactNode[] {
    return []
  }

  public render(value: Date | null): Date | undefined {
    return value || undefined
  }
}
