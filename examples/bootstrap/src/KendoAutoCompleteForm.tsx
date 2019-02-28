// We want a ComboBox that takes options from a query function.
// We really just want ComboBox that checks whether its options prop is
// a function.

import * as React from 'react'
import { ComboBoxFilterChangeEvent } from '@progress/kendo-react-dropdowns'
import { of, from, Observable, Subject } from 'rxjs'
import { map, switchAll } from 'rxjs/operators'
import { observer } from '@thejohnfreeman/observer'
import { ViewModels } from '@thejohnfreeman/react-forms'
import {
  Form,
  ComboBox,
  ComboBoxProps,
} from '@thejohnfreeman/react-forms-kendo'
import { Omit } from 'utility-types'

import { STATES } from './states'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const stateOptions = STATES.map(({ name, abbreviation }) => ({
  text: name,
  value: abbreviation,
}))

type OptionsArray = { text: string; value: any }[]
type ObservableLike<T> = T | Promise<T> | Observable<T>
type OptionsFunction = (query: string) => ObservableLike<OptionsArray>
type OptionsLike = OptionsArray | OptionsFunction

function searchArray(options: OptionsArray, query: string) {
  return options.filter(({ text }) =>
    text.toLowerCase().includes(query.toLowerCase()),
  )
}

function asObservable<T>(value: ObservableLike<T>): Observable<T> {
  if (value && typeof value === 'object') {
    if (typeof value['then'] === 'function') {
      return from(value as Promise<T>)
    } else if (typeof value['subscribe'] === 'function') {
      return value as Observable<T>
    }
  }
  return of(value as T)
}

type OptionsPipeline = [(query: string) => void, Observable<OptionsArray>]

function useOptionsPipeline(options: OptionsLike): OptionsPipeline {
  const search =
    typeof options === 'function'
      ? options
      : (query: string) => searchArray(options, query)
  const query$ = new Subject<string>()
  const results$ = query$.pipe(
    map(search),
    map(asObservable),
    switchAll(),
  )
  return [(query: string) => query$.next(query), results$]
}

export interface DynamicComboBoxProps extends Omit<ComboBoxProps, 'options'> {
  options: OptionsLike
}

export class DynamicComboBox extends React.Component<DynamicComboBoxProps> {
  public state = { options: [] }

  private readonly pipeline = useOptionsPipeline(this.props.options)
  private readonly ssOptions = this.pipeline[1].subscribe(options =>
    this.setState({ options }),
  )

  private onFilterChange = (event: ComboBoxFilterChangeEvent) => {
    this.pipeline[0](event.filter.value)
  }

  public componentWillUnmount() {
    this.ssOptions.unsubscribe()
  }

  public render() {
    const { options, ...props } = this.props
    return (
      <ComboBox
        {...props}
        onFilterChange={this.onFilterChange}
        options={this.state.options}
      />
    )
  }
}

const search = (query: string): OptionsArray => {
  console.log('search')
  return searchArray(stateOptions, query)
}

const searchAsync = async (query: string): Promise<OptionsArray> => {
  console.log('searchAsync')
  await sleep(1000)
  return searchArray(stateOptions, query)
}

const searchObservable = (query: string): Observable<OptionsArray> => {
  return from(searchAsync(query))
}

const AutoCompleteViewModel = ViewModels.group({
  query: ViewModels.object(),
})

class _AutoCompleteForm extends React.Component {
  private readonly viewModel = AutoCompleteViewModel.construct()

  private readonly onSubmit = async ({ query }) => {
    console.log('submit:', query)
  }

  public render() {
    return (
      <Form viewModel={this.viewModel} onSubmit={this.onSubmit}>
        <DynamicComboBox
          name="query"
          label="stateOptions"
          options={stateOptions}
        />
        <DynamicComboBox name="query" label="search" options={search} />
        <DynamicComboBox
          name="query"
          label="searchAsync"
          options={searchAsync}
        />
        <DynamicComboBox
          name="query"
          label="searchObservable"
          options={searchObservable}
        />
      </Form>
    )
  }
}

// We could use a class expression, but we do it this way for less
// indentation. We would prefer to use decorators, but TypeScript does not
// permit them to change the class type.
// https://github.com/Microsoft/TypeScript/issues/4881
export const AutoCompleteForm = observer(_AutoCompleteForm)
