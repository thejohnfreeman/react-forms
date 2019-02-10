import '@progress/kendo-theme-material/dist/all.css'

import { Button } from '@progress/kendo-react-buttons'
import * as React from 'react'

import { ViewModels } from '@thejohnfreeman/react-forms'
import {
  ComboBox,
  Form,
  Input,
  Options,
} from '@thejohnfreeman/react-forms-kendo'
import { observer } from '@thejohnfreeman/observer'

import { STATES } from './states'

const STATE_OPTIONS: Options<string> = STATES.map(({ name, abbreviation }) => ({
  text: name,
  value: abbreviation,
}))

const AddressViewModel = ViewModels.group({
  address1: ViewModels.text(),
  address2: ViewModels.text().optional(),
  city: ViewModels.text(),
  state: ViewModels.object(),
  zip: ViewModels.text(),
})

export type AddressFormProps = {}

class _AddressForm extends React.Component<AddressFormProps> {
  private readonly viewModel = AddressViewModel.construct()

  private readonly onSubmit = async values => {
    console.log('submit:', { ...values, state: values.state.value })
  }

  public render() {
    return (
      <Form viewModel={this.viewModel} onSubmit={this.onSubmit}>
        <Input name="address1" label="Address Line 1" />
        <Input name="address2" label="Address Line 2" />
        <Input name="city" />
        <ComboBox options={STATE_OPTIONS} name="state" />
        <Input name="zip" />
        <Button type="submit">Submit</Button>
      </Form>
    )
  }
}

// We could use a class expression, but we do it this way for less
// indentation. We would prefer to use decorators, but TypeScript does not
// permit them to change the class type.
// https://github.com/Microsoft/TypeScript/issues/4881
export const AddressForm = observer(_AddressForm)
