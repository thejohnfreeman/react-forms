import { Binder, ShouldBe } from './Binder'
import { DebugBinder } from './DebugBinder'
import { ViewModel, ViewModelConstructor } from './ViewModel'
import { FieldViewModel } from './FieldViewModel'

export abstract class AbstractBinder<V, R = V>
  implements Binder<V | null, R>, ViewModelConstructor<V | null, R> {
  // Non-null should be the default, just as in SQL.
  public optRequired: boolean = true

  public constructor(
    public readonly type: string,
    public readonly defaultValue: V | null,
  ) {}

  public optional(): this {
    this.optRequired = false
    return this
  }

  public debug(): DebugBinder<V, R> {
    return new DebugBinder(this)
  }

  public construct(initValue: V | null = null): ViewModel<V | null, R> {
    return new FieldViewModel<V, R>(this, initValue)
  }

  public equals(a: V, b: V): boolean {
    return a === b
  }

  public parse(repr: R): ShouldBe<V | null> {
    return { value: (repr as unknown) as V }
  }

  public validate(value: V | null): React.ReactNode[] {
    const errors: React.ReactNode[] = []
    if (value === null && this.optRequired) {
      errors.push('Please enter this field.')
    }
    return errors
  }

  public render(value: V): R {
    return (value as unknown) as R
  }
}
