import { titleCase } from 'change-case'
import classNames from 'classnames/dedupe'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import {
  ComboBox as KendoComboBox,
  ComboBoxProps as KendoComboBoxProps,
} from '@progress/kendo-react-dropdowns'
import * as React from 'react'

import { Field } from './Field'
import { errorsToMessage } from './Message'
import { newOptionsSource, OptionsLike, OptionsSource } from './OptionsSource'
import { withRef, WithRefProps } from './refs'

export interface ComboBoxProps extends KendoComboBoxProps, WithRefProps {
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
      innerRef,
      inputClassName,
      label,
      name,
      options,
      rootClassName,
      ...kendoProps
    } = this.props
    return (
      <label
        className={classNames('k-form-field', rootClassName)}
        ref={innerRef}
      >
        <span>{label || titleCase(name)}</span>
        <KendoComboBox
          className={classNames('form-control', inputClassName)}
          data={this.optionsSource.options}
          dataItemKey="value"
          disabled={this.field.disabled}
          filterable={true}
          name={name}
          onChange={this.context.form.onChange}
          onFilterChange={this.optionsSource.onFilterChange}
          onOpen={this.onOpen}
          required={this.field.binder.optRequired}
          textField="text"
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

export const ComboBox = withRef(observer(_ComboBox))
