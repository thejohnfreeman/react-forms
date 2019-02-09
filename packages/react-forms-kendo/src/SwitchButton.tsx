import { titleCase } from 'change-case'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import {
  Button as KendoButton,
  ButtonProps as KendoButtonProps,
} from '@progress/kendo-react-buttons'
import * as React from 'react'

import { Field } from './Field'

export type SwitchButtonProps = KendoButtonProps & {
  label?: string
  name: string
}

class _SwitchButton extends Field<SwitchButtonProps> {
  private readonly onChange = action(() => {
    this.field.repr = !this.field.repr
  })

  public render() {
    const { label, name, ...kendoProps } = this.props
    return (
      <p>
        <KendoButton
          name={name}
          onClick={this.onChange}
          selected={this.field.repr}
          togglable={true}
          type="button"
          {...kendoProps}
        >
          {label || titleCase(name)}
        </KendoButton>
      </p>
    )
  }
}

export const SwitchButton = observer(_SwitchButton)
