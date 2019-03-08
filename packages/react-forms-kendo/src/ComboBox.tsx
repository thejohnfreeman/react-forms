import { titleCase } from 'change-case'
import classNames from 'classnames'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import {
  ComboBox as KendoComboBox,
  ComboBoxProps as KendoComboBoxProps,
} from '@progress/kendo-react-dropdowns'
import * as React from 'react'

import { Field } from './Field'
import { newOptionsSource, OptionsLike, OptionsSource } from './OptionsSource'

export type ComboBoxProps = KendoComboBoxProps & {
  inputClassName?: string
  label?: string
  name: string
  options?: OptionsLike<any>
  rootClassName?: string
}

// Assumes that the options and value are always and only
// { text: string, value: any }
class _ComboBox extends Field<ComboBoxProps> {
  @computed
  private get optionsSource(): OptionsSource<any> {
    return newOptionsSource(this.props.options || this.field.binder.options)
  }

  private readonly onOpen = () => {
    this.optionsSource.filter(this.field.repr || '')
  }

  public render() {
    const {
      inputClassName,
      label,
      name,
      options,
      rootClassName,
      ...kendoProps
    } = this.props
    return (
      <label className={classNames(rootClassName, 'k-form-field')}>
        <span>{label || titleCase(name)}</span>
        <KendoComboBox
          className={classNames(inputClassName, 'form-control')}
          data={this.optionsSource.options}
          dataItemKey="value"
          disabled={this.field.disabled}
          filterable={true}
          name={name}
          onChange={this.context.form.onChange}
          onFilterChange={this.optionsSource.onFilterChange}
          onOpen={this.onOpen}
          textField="text"
          value={this.field.repr}
          {...kendoProps}
        />
      </label>
    )
  }
}

export const ComboBox = observer(_ComboBox)
