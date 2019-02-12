import { titleCase } from 'change-case'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import {
  DatePicker as KendoDatePicker,
  DatePickerProps as KendoDatePickerProps,
} from '@progress/kendo-react-dateinputs'
import * as React from 'react'

import { Field } from './Field'

export type DatePickerProps = KendoDatePickerProps & {
  className?: string
  label?: React.ReactNode
  name: string
}

class _DatePicker extends Field<DatePickerProps> {
  public render() {
    const { className, label, name, ...kendoProps } = this.props
    return (
      <label className="k-form-field">
        <span>{label || titleCase(name)}</span>
        <KendoDatePicker
          className={classNames(className, 'form-control')}
          disabled={this.field.disabled}
          name={name}
          onChange={this.context.form.onChange}
          value={this.field.repr}
          {...kendoProps}
        />
      </label>
    )
  }
}

export const DatePicker = observer(_DatePicker)
