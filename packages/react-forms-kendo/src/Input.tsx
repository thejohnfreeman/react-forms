import { titleCase } from 'change-case'
import { observer } from 'mobx-react'
import {
  Input as KendoInput,
  InputProps as KendoInputProps,
} from '@progress/kendo-react-inputs'
import * as React from 'react'

import { Field } from './Field'

// `name` is optional in `KendoInputProps`
export type InputProps = KendoInputProps & {
  label?: string
  name: string
  type?: string
}

class _Input extends Field<InputProps> {
  public render() {
    const { label, name, type, ...kendoProps } = this.props
    const opts = this.field.binder
    return (
      <label className="k-form-field">
        <span>{label || titleCase(name)}</span>
        <KendoInput
          {...kendoProps}
          disabled={this.field.disabled}
          maxLength={opts.optMaxLength}
          minLength={opts.optMinLength}
          pattern={opts.optPattern}
          name={name}
          onChange={this.context.form.onChange}
          required={opts.optRequired}
          style={{ width: '100%' }}
          type={type || this.field.type}
          value={this.field.repr}
          validityStyles={
            this.field.touched || this.context.form.viewModel.touched
          }
        />
      </label>
    )
  }
}

export const Input = observer(_Input)
