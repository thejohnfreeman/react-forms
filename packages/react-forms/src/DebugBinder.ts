import { Binder, ShouldBe } from './Binder'
import { FieldViewModel } from './FieldViewModel'
import { ViewModel, ViewModelConstructor } from './ViewModel'

// A binder for debugging controls with an unknown representation. This binder
// will accept any representation and assign it to the value unchanged, and it
// logs every parse and render.
export class DebugBinder<T>
  implements
    Binder<T | null, T | undefined>,
    ViewModelConstructor<T | null, T | undefined> {
  public constructor(
    public readonly type = 'debug',
    public readonly defaultValue = null,
  ) {}

  public construct(
    initValue: T | null = null,
  ): ViewModel<T | null, T | undefined> {
    return new FieldViewModel<T, T | undefined>(this, initValue)
  }

  public equals(a: T | null, b: T | null) {
    return a === b
  }

  public parse(repr: T | undefined): ShouldBe<T | null> {
    console.log('parse', repr)
    return { value: repr || null }
  }

  public validate(_value: T | null): React.ReactNode[] {
    return []
  }

  public render(value: T | null): T | undefined {
    console.log('parse', value)
    return value || undefined
  }
}
