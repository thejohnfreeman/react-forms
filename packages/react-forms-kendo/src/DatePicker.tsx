import { titleCase } from 'change-case'
import { observer } from 'mobx-react'
import {
  DatePicker as KendoDatePicker,
  DatePickerProps as KendoDatePickerProps,
} from '@progress/kendo-react-dateinputs'
import * as React from 'react'

import { Field } from './Field'

export type DatePickerProps = KendoDatePickerProps & {
  label?: React.ReactNode
  name: string
}

class _DatePicker extends Field<DatePickerProps> {
  public render() {
    const { label, name, ...kendoProps } = this.props
    return (
      <label className="k-form-field">
        <span>{label || titleCase(name)}</span>
        <KendoDatePicker
          {...kendoProps}
          name={name}
          value={this.field.repr}
          onChange={this.context.form.onChange}
        />
      </label>
    )
  }
}

export const DatePicker = observer(_DatePicker)
