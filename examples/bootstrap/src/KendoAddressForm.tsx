import axios from 'axios'
import { reaction } from 'mobx'
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
  state: ViewModels.oneOf(STATE_OPTIONS),
  zip: ViewModels.text(),
})

export type AddressFormProps = {}

class _AddressForm extends React.Component<AddressFormProps> {
  private readonly viewModel = AddressViewModel.construct()

  private readonly onSubmit = async values => {
    console.log('submit:', { ...values })
  }

  private readonly unsubZip = reaction(
    () => this.viewModel.$.zip,
    async zip => {
      if (zip.length < 5) {
        return
      }
      let response
      try {
        response = await axios.get(`https://api.zippopotam.us/us/${zip}`)
      } catch {
        // Unknown zip code. Not an error.
        return
      }
      const place = response.data['places'][0]
      if (!place || zip !== response.data['post code']) {
        return
      }
      const fields = this.viewModel.$
      fields.city = place['place name']
      fields.state = place['state abbreviation']
    },
  )

  public componentWillUnmount() {
    this.unsubZip()
  }

  public render() {
    return (
      <Form
        className="d-flex flex-column"
        viewModel={this.viewModel}
        onSubmit={this.onSubmit}
      >
        <Input rootClassName="order-1" name="address1" label="Address Line 1" />
        <Input rootClassName="order-2" name="address2" label="Address Line 2" />
        <Input rootClassName="order-5" name="zip" />
        <Input rootClassName="order-3" name="city" />
        <ComboBox rootClassName="order-4" name="state" />
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
export const AddressForm = observer(_AddressForm)
