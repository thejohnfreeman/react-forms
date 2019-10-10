import { titleCase } from 'change-case'
import classNames from 'classnames/dedupe'
import { observer } from 'mobx-react'
import {
  Input as KendoInput,
  InputProps as KendoInputProps,
} from '@progress/kendo-react-inputs'
import * as React from 'react'

import { Field } from './Field'
import { errorsToMessage } from './Message'
import { withRef, WithRefProps } from './refs'

// `name` is optional in `KendoInputProps`
export interface InputProps extends KendoInputProps, WithRefProps {
  inputClassName?: string
  label?: string
  name: string
  rootClassName?: string
  type?: string
}

class _Input extends Field<InputProps> {
  public render() {
    const {
      innerRef,
      inputClassName,
      label,
      name,
      rootClassName,
      type,
      ...kendoProps
    } = this.props
    const opts = this.field.binder
    return (
      <label
        className={classNames('k-form-field', rootClassName)}
        ref={innerRef}
      >
        <span>{label || titleCase(name)}</span>
        <KendoInput
          className={classNames('form-control', inputClassName)}
          disabled={this.field.disabled}
          maxLength={opts.optMaxLength}
          minLength={opts.optMinLength}
          pattern={opts.optPattern}
          name={name}
          onChange={this.context.form.onChange}
          required={opts.optRequired}
          style={{ width: '100%' }}
          type={type || this.field.type}
          valid={this.field.valid}
          // TODO: Switch to HTML popups.
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

export const Input = withRef(observer(_Input))
