import '@progress/kendo-theme-material/dist/all.css'

import { autorun, observable } from 'mobx'
import { Button } from '@progress/kendo-react-buttons'
import * as React from 'react'

import { ViewModels } from '@thejohnfreeman/react-forms'
import { ComboBox, Form, Options } from '@thejohnfreeman/react-forms-kendo'
import { observer } from '@thejohnfreeman/observer'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const DATA = {
  cars: {
    Lamborghini: ['Aventador', 'Gallardo'],
    Lotus: ['Elise', 'Evora'],
  },
  motorcycles: {
    Honda: ['Rebel', 'Shadow'],
    Triumph: ['Scrambler', 'Bonneville'],
  },
}

function makes(vehicleType): Options {
  return Object.keys(DATA[vehicleType]).map((make, index) => ({
    text: make,
    value: index,
  }))
}

// These options are loaded asynchronously.
async function models(vehicleType, make): Promise<Options> {
  await sleep(1000)
  return DATA[vehicleType][make].map((model, index) => ({
    text: model,
    value: index,
  }))
}

const CarSearchViewModel = ViewModels.group({
  vehicleType: ViewModels.object(),
  make: ViewModels.object(),
  model: ViewModels.object(),
})

export type CarSearchFormProps = {}

class _CarSearchForm extends React.Component<CarSearchFormProps> {
  private readonly viewModel = CarSearchViewModel.construct()

  private readonly onSubmit = async ({ vehicleType, make, model }) => {
    console.log('submit:', { ...vehicleType }, { ...make }, { ...model })
  }

  private readonly vehicleTypeOptions: Options = Object.keys(DATA).map(
    (type, index) => ({
      text: type,
      value: index,
    }),
  )

  @observable
  private makeOptions: Options

  private readonly _unsubMakeOptions = autorun(() => {
    const fields = this.viewModel.$
    const vehicleType = fields.vehicleType
    fields.make = null
    this.makeOptions = vehicleType ? makes(vehicleType.text) : undefined
  })

  @observable
  private modelOptions: Options

  private readonly _unsubModelOptions = autorun(async () => {
    const fields = this.viewModel.$
    const vehicleType = fields.vehicleType
    const make = fields.make
    fields.model = null
    this.modelOptions =
      vehicleType && make
        ? await models(vehicleType.text, make.text)
        : undefined
  })

  public componentDidUnmount() {
    this._unsubMakeOptions()
    this._unsubModelOptions()
  }

  public render() {
    return (
      <Form viewModel={this.viewModel} onSubmit={this.onSubmit}>
        <ComboBox options={this.vehicleTypeOptions} name="vehicleType" />
        <ComboBox options={this.makeOptions} name="make" />
        <ComboBox options={this.modelOptions} name="model" />
        <Button type="submit">Search</Button>
      </Form>
    )
  }
}

export const CarSearchForm = observer(_CarSearchForm)
