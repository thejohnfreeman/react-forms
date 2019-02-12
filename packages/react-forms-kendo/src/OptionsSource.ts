import { computed, observable } from 'mobx'
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  filterBy as kendoFilterBy,
} from '@progress/kendo-data-query'

export type Options<T = number> = { text: string; value: T }[] | undefined

// function toOptions(incoming: Options): Options
// function toOptions(incoming: DataResult): Options
// function toOptions(incoming: any): Options {
//   if (typeof incoming === 'undefined' || Array.isArray(incoming)) {
//     return incoming
//   }
//   if ('data' in incoming) {
//     return incoming.data
//   }
//   console.error('expected options', incoming)
// }

interface FilterChangeEvent {
  filter: FilterDescriptor
}

function filterBy(
  options: Options<any>,
  descriptor: FilterDescriptor | CompositeFilterDescriptor | undefined,
): Options<any> {
  return options
    ? descriptor
      ? kendoFilterBy(options, descriptor)
      : options
    : undefined
}

export interface OptionsSource<T> {
  options: Options<T>
  onFilterChange?: (event: FilterChangeEvent) => void
}

export class ArrayOptionsSource<T> implements OptionsSource<T> {
  @observable
  private filterDescriptor?: FilterDescriptor

  public constructor(private readonly _options: Options<T>) {}

  public readonly onFilterChange = (event: FilterChangeEvent) => {
    this.filterDescriptor = event.filter
  }

  @computed
  public get options(): Options<T> {
    return filterBy(this._options, this.filterDescriptor)
  }
}

// We want to handle different kinds of options arguments, from a constant
// array to an asynchronous function that returns a Kendo `DataResult`.
export function newOptionsSource<T>(options: Options<T>): OptionsSource<T> {
  return new ArrayOptionsSource(options)
}
