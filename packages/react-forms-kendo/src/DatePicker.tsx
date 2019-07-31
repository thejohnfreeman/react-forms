import { titleCase } from 'change-case'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import {
  DatePicker as KendoDatePicker,
  DatePickerProps as KendoDatePickerProps,
} from '@progress/kendo-react-dateinputs'
import * as React from 'react'

import { Field } from './Field'
import { errorsToMessage } from './Message'

export type DatePickerProps = KendoDatePickerProps & {
  inputClassName?: string
  label?: React.ReactNode
  name: string
  rootClassName?: string
}

class _DatePicker extends Field<DatePickerProps> {
  public render() {
    const {
      inputClassName,
      label,
      name,
      rootClassName,
      ...kendoProps
    } = this.props
    return (
      <label className={classNames(rootClassName, 'k-form-field')}>
        <span>{label || titleCase(name)}</span>
        <KendoDatePicker
          className={classNames(inputClassName, 'form-control')}
          disabled={this.field.disabled}
          name={name}
          onChange={this.context.form.onChange}
          valid={this.field.valid}
          validationMessage={errorsToMessage(this.field.errors)}
          validityStyles={
            this.field.touched ||
            (this.context.form.viewModel.touched && this.context.form.submitted)
          }
          value={this.field.repr}
          {...kendoProps}
        />
      </label>
    )
  }
}

export const DatePicker = observer(_DatePicker)
