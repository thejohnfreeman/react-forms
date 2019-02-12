import { titleCase } from 'change-case'
import classNames from 'classnames'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import {
  Switch as KendoSwitch,
  SwitchProps as KendoSwitchProps,
} from '@progress/kendo-react-inputs'
import * as React from 'react'

import { Field } from './Field'

export type SwitchProps = KendoSwitchProps & {
  className?: string
  label?: string
  name: string
}

class _Switch extends Field<SwitchProps> {
  private readonly onChange = action((event: any) => {
    this.field.repr = event.target.value
  })

  public render() {
    const { className, label, name, ...kendoProps } = this.props
    return (
      <label className="k-form-field">
        <span>{label || titleCase(name)}</span>
        <KendoSwitch
          className={classNames(className, 'form-control')}
          disabled={this.field.disabled}
          onChange={this.onChange}
          checked={this.field.repr}
          {...kendoProps}
        />
      </label>
    )
  }
}

export const Switch = observer(_Switch)
