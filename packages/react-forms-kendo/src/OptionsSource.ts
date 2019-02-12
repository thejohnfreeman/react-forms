import { isArrayLike, map } from 'lodash-es'
import { computed, observable } from 'mobx'
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  filterBy as kendoFilterBy,
} from '@progress/kendo-data-query'

interface DataResult<T> {
  data: T[]
  total: number
}

export type Options<T = number> = { text: string; value: T }[] | undefined

export type OptionsLike<T = number> = T[] | DataResult<T> | Options<T>

function toOptions<T>(optionsLike: OptionsLike<T>): Options<T> {
  if (typeof optionsLike === 'undefined') {
    return optionsLike
  }
  if (isArrayLike(optionsLike)) {
    if (!optionsLike.length) {
      return undefined
    }
    const elt = optionsLike[0]
    if (typeof elt === 'object' && 'text' in elt && 'value' in elt) {
      return optionsLike as Options<T>
    }
    return map(optionsLike, value => ({ text: '' + value, value: value as T }))
  }
  if ('data' in optionsLike) {
    return toOptions(optionsLike.data)
  }
  console.error('expected options', optionsLike)
}

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
export function newOptionsSource<T>(
  optionsLike: OptionsLike<T>,
): OptionsSource<T> {
  return new ArrayOptionsSource(toOptions(optionsLike))
}
