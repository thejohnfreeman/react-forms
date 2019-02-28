// We want a ComboBox that takes options from a query function.
// We really just want ComboBox that checks whether its options prop is
// a function.

import * as React from 'react'
import { ComboBoxFilterChangeEvent } from '@progress/kendo-react-dropdowns'
import { of, from, Subject } from 'rxjs'
import { observer } from '@thejohnfreeman/observer'
import { ViewModels } from '@thejohnfreeman/react-forms'
import {
  Form,
  ComboBox,
  ComboBoxProps,
} from '@thejohnfreeman/react-forms-kendo'
import { Omit } from 'utility-types'

import { STATES } from './states'

const stateOptions = STATES.map(({ name, abbreviation }) => ({
  text: name,
  value: abbreviation,
}))

type OptionsArray = { text: string; value: any }[]
type PromiseLike<T> = T | Promise<T>
type OptionsFunction = (query: string) => PromiseLike<OptionsArray>
type OptionsLike = OptionsArray | OptionsFunction

export interface DynamicComboBoxProps extends Omit<ComboBoxProps, 'options'> {
  options: OptionsLike
}

// We want to set an `onFilterChange` handler that depends on the props.
function searchArray(self: DynamicComboBox, event: ComboBoxFilterChangeEvent) {
  const query = event.filter.value
  const options = (self.props.options as OptionsArray).filter(({ text }) =>
    text.toLowerCase().includes(query.toLowerCase()),
  )
  self.setState({ options })
}

async function searchFunction(
  self: DynamicComboBox,
  event: ComboBoxFilterChangeEvent,
) {
  const query = event.filter.value
  const options = await (self.props.options as OptionsFunction)(query)
  self.setState({ options })
}

async function searchOptionsLike(
  self: DynamicComboBox,
  event: ComboBoxFilterChangeEvent,
) {
  return typeof this.props.options === 'function'
    ? searchFunction(this, event)
    : searchArray(this, event)
}

export class DynamicComboBox extends React.Component<DynamicComboBoxProps> {
  public state = { options: [] }

  private onFilterChange = (event: ComboBoxFilterChangeEvent) =>
    searchOptionsLike(this, event)

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

const search = (query: string) => {
  return [{ text: 'Alabama', value: 'AL' }]
}

const AutoCompleteViewModel = ViewModels.group({
  query: ViewModels.text(),
})

class _AutoCompleteForm extends React.Component {
  private readonly viewModel = AutoCompleteViewModel.construct()

  private readonly onSubmit = async ({ query }) => {
    console.log('submit:', query)
  }

  public render() {
    return (
      <Form viewModel={this.viewModel} onSubmit={this.onSubmit}>
        <DynamicComboBox name="query" label="State" options={search} />
      </Form>
    )
  }
}

// We could use a class expression, but we do it this way for less
// indentation. We would prefer to use decorators, but TypeScript does not
// permit them to change the class type.
// https://github.com/Microsoft/TypeScript/issues/4881
export const AutoCompleteForm = observer(_AutoCompleteForm)
