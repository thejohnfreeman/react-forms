import { titleCase } from 'change-case'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import {
  Switch as KendoSwitch,
  SwitchProps as KendoSwitchProps,
} from '@progress/kendo-react-inputs'
import * as React from 'react'

import { Field } from './Field'

export type SwitchProps = KendoSwitchProps & {
  label?: string
  name: string
}

class _Switch extends Field<SwitchProps> {
  private readonly onChange = action((event: any) => {
    this.field.repr = event.target.value
  })

  public render() {
    const { label, name, ...kendoProps } = this.props
    return (
      <label className="k-form-field">
        <span>{label || titleCase(name)}</span>
        <KendoSwitch
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
