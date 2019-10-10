import { titleCase } from 'change-case'
import classNames from 'classnames/dedupe'
import { observer } from 'mobx-react'
import {
  NumericTextBox,
  NumericTextBoxProps,
} from '@progress/kendo-react-inputs'
import * as React from 'react'

import { Field } from './Field'
import { errorsToMessage } from './Message'
import { withRef, WithRefProps } from './refs'

export interface NumericInputProps extends NumericTextBoxProps, WithRefProps {
  inputClassName?: string
  label?: string
  name: string
  rootClassName?: string
}

class _NumericInput extends Field<NumericInputProps> {
  public render() {
    const {
      innerRef,
      inputClassName,
      label,
      name,
      rootClassName,
      ...kendoProps
    } = this.props
    return (
      <label
        className={classNames('k-form-field', rootClassName)}
        ref={innerRef}
      >
        <span>{label || titleCase(name)}</span>
        <NumericTextBox
          className={classNames('form-control', inputClassName)}
          disabled={this.field.disabled}
          min={this.field.binder.optMinimum}
          max={this.field.binder.optMaximum}
          name={name}
          onChange={this.context.form.onChange}
          required={this.field.binder.optRequired}
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

export const NumericInput = withRef(observer(_NumericInput))
