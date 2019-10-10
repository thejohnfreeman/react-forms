import { titleCase } from 'change-case'
import classNames from 'classnames/dedupe'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import {
  Switch as KendoSwitch,
  SwitchProps as KendoSwitchProps,
} from '@progress/kendo-react-inputs'
import * as React from 'react'

import { Field } from './Field'
import { withRef, WithRefProps } from './refs'

export interface SwitchProps extends KendoSwitchProps, WithRefProps {
  inputClassName?: string
  label?: string
  name: string
  rootClassName?: string
}

class _Switch extends Field<SwitchProps> {
  private readonly onChange = action((event: any) => {
    this.field.repr = event.target.value
  })

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
        <KendoSwitch
          className={classNames('form-control', inputClassName)}
          disabled={this.field.disabled}
          onChange={this.onChange}
          checked={this.field.repr}
          {...kendoProps}
        />
      </label>
    )
  }
}

export const Switch = withRef(observer(_Switch))
