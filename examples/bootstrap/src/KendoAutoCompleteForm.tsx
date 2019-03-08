import { Button } from '@progress/kendo-react-buttons'
import * as React from 'react'
import { from, Observable } from 'rxjs'
import { observer } from '@thejohnfreeman/observer'
import { ViewModels } from '@thejohnfreeman/react-forms'
import { Form, ComboBox, Options } from '@thejohnfreeman/react-forms-kendo'

import { STATES } from './states'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const stateOptions = STATES.map(({ name, abbreviation }) => ({
  text: name,
  value: abbreviation,
}))

function searchArray(options: Options<string>, query: string) {
  return options!.filter(({ text }) =>
    text.toLowerCase().includes(query.toLowerCase()),
  )
}

const search = (query: string): Options<string> => {
  return searchArray(stateOptions, query)
}

const searchAsync = async (query: string): Promise<Options<string>> => {
  await sleep(1000)
  return searchArray(stateOptions, query)
}

const searchObservable = (query: string): Observable<Options<string>> => {
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
        <ComboBox name="query" label="stateOptions" options={stateOptions} />
        <ComboBox name="query" label="search" options={search} />
        <ComboBox name="query" label="searchAsync" options={searchAsync} />
        <ComboBox
          name="query"
          label="searchObservable"
          options={searchObservable}
        />
        <Button className="order-5" type="submit">
          Submit
        </Button>
      </Form>
    )
  }
}

// We could use a class expression, but we do it this way for less
// indentation. We would prefer to use decorators, but TypeScript does not
// permit them to change the class type.
// https://github.com/Microsoft/TypeScript/issues/4881
export const AutoCompleteForm = observer(_AutoCompleteForm)
