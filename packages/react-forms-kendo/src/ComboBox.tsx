import { titleCase } from 'change-case'
import { observer } from 'mobx-react'
import {
  ComboBox as KendoComboBox,
  ComboBoxProps as KendoComboBoxProps,
} from '@progress/kendo-react-dropdowns'
import * as React from 'react'

import { Field } from './Field'

export type Options<T = number> = { text: string; value: T }[] | undefined

export type ComboBoxProps = KendoComboBoxProps & {
  label?: string
  name: string
  options: Options<any>
}

// Assumes that the options and value are always and only
// { text: string, value: number }
class _ComboBox extends Field<ComboBoxProps> {
  public render() {
    const { label, name, options, ...kendoProps } = this.props
    return (
      <label className="k-form-field">
        <span>{label || titleCase(name)}</span>
        <KendoComboBox
          data={options}
          dataItemKey="value"
          disabled={this.field.disabled}
          name={name}
          onChange={this.context.form.onChange}
          textField="text"
          value={this.field.repr}
          {...kendoProps}
        />
      </label>
    )
  }
}

export const ComboBox = observer(_ComboBox)
