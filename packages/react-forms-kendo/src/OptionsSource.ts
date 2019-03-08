import { isArrayLike, map } from 'lodash-es'
import { computed, observable } from 'mobx'
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  filterBy as kendoFilterBy,
} from '@progress/kendo-data-query'
import { ComboBoxFilterChangeEvent } from '@progress/kendo-react-dropdowns'
import { of, from, Observable, Subject } from 'rxjs'
import { map as rxMap, switchAll } from 'rxjs/operators'

// Kendo does not export its `FilterChangeEvent`. It is subtyped for every
// dropdown type (though none of them add any props).
type FilterChangeEvent = ComboBoxFilterChangeEvent

// Kendo's `DataResult` is not strongly typed.
interface DataResult<T> {
  data: T[]
  total: number
}

// Turn a promise, observable, or solo value into an observable.
function asObservable<T>(observableLike: ObservableLike<T>): Observable<T> {
  if (observableLike && typeof observableLike === 'object') {
    if (typeof observableLike['then'] === 'function') {
      return from(observableLike as Promise<T>)
    } else if (typeof observableLike['subscribe'] === 'function') {
      return observableLike as Observable<T>
    }
  }
  return of(observableLike as T)
}

export type Options<T = number> = { text: string; value: T }[] | undefined
export type OptionsArrayLike<T> = T[] | DataResult<T> | Options<T>
export type ObservableLike<T> = T | Promise<T> | Observable<T>
export type OptionsFunction<T> = (
  query: string,
) => ObservableLike<OptionsArrayLike<T>>
export type OptionsLike<T> = OptionsArrayLike<T> | OptionsFunction<T>

function asOptions<T>(arrayLike: OptionsArrayLike<T>): Options<T> {
  if (typeof arrayLike === 'undefined') {
    return arrayLike
  }
  if (isArrayLike(arrayLike)) {
    // Empty options become `undefined`.
    if (!arrayLike.length) {
      return undefined
    }
    const elt = arrayLike[0]
    if (typeof elt === 'object' && 'text' in elt && 'value' in elt) {
      return arrayLike as Options<T>
    }
    return map(arrayLike, value => ({ text: '' + value, value: value as T }))
  }
  if ('data' in arrayLike) {
    return asOptions(arrayLike.data)
  }
  console.error('expected options', arrayLike)
}

// We need a version of Kendo's `filterBy` for which both the options array
// and the filter are optional.
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
  readonly options: Options<T>
  readonly onFilterChange: (event: FilterChangeEvent) => void
  readonly filter: (query: string) => void
}

export class ArrayOptionsSource<T> implements OptionsSource<T> {
  @observable
  private filterDescriptor?: FilterDescriptor

  public constructor(private readonly _options: Options<T>) {}

  public readonly onFilterChange = (event: FilterChangeEvent) => {
    this.filterDescriptor = event.filter
  }

  public readonly filter = (query: string) => {
    this.filterDescriptor = {
      field: 'text',
      operator: 'contains',
      value: query,
    }
  }

  @computed
  public get options(): Options<T> {
    return filterBy(this._options, this.filterDescriptor)
  }
}

export class FunctionOptionsSource<T> implements OptionsSource<T> {
  private readonly query$: Subject<string>

  public constructor(search: OptionsFunction<T>) {
    this.query$ = new Subject<string>()
    this.query$
      .pipe(
        rxMap(search),
        rxMap(asObservable),
        switchAll(),
        rxMap(asOptions),
      )
      .subscribe(options => (this.options = options))
  }

  public readonly onFilterChange = (event: FilterChangeEvent) => {
    this.query$.next(event.filter.value)
  }

  public readonly filter = (query: string) => {
    this.query$.next(query)
  }

  @observable
  public options: Options<T>
}

// We take a wide range of options arguments, from a constant array to an
// asynchronous function that returns a Kendo `DataResult`.
export function newOptionsSource<T>(
  optionsLike: OptionsLike<T>,
): OptionsSource<T> {
  return typeof optionsLike === 'function'
    ? new FunctionOptionsSource(optionsLike)
    : new ArrayOptionsSource(asOptions(optionsLike))
}
