import { AbstractBinder } from './AbstractBinder'
import { ShouldBe } from './Binder'

export type Option<T> = { text: string; value: T }

export class OptionBinder<T> extends AbstractBinder<
  T | null,
  Option<T> | undefined
> {
  public constructor(
    public readonly options: Option<T>[],
    defaultValue: T | null = null,
  ) {
    super('option', defaultValue)
  }

  public parse(repr: Option<T> | undefined): ShouldBe<T | null> {
    return { value: repr ? repr.value : null }
  }

  public render(value: T | null): Option<T> | undefined {
    if (!value) {
      return
    }
    const option = this.options.find(option => option.value === value)
    if (!option) {
      console.error('value missing from options', value, this.options)
      return
    }
    return option
  }
}
