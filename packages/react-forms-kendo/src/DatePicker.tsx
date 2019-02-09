import { titleCase } from 'change-case'
import { observer } from 'mobx-react'
import * as React from 'react'
import {
  DatePicker as KendoDatePicker,
  DatePickerProps as KendoDatePickerProps,
} from '@progress/kendo-react-dateinputs'

import { FormContext } from './Form'

export type DatePickerProps = KendoDatePickerProps & {
  label?: React.ReactNode
  name: string
}

class _DatePicker extends React.Component<DatePickerProps> {
  public static contextType = FormContext

  public render() {
    // TODO: @computed field?
    const field = this.context.form.fields[this.props.name]
    return (
      <label className="k-form-field">
        <span>{this.props.label || titleCase(this.props.name)}</span>
        <KendoDatePicker
          {...this.props}
          value={field.repr}
          onChange={this.context.form.onChange}
        />
      </label>
    )
  }
}

export const DatePicker = observer(_DatePicker)
