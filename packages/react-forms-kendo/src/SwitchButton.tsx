import { titleCase } from 'change-case'
import classNames from 'classnames/dedupe'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import {
  Button as KendoButton,
  ButtonProps as KendoButtonProps,
} from '@progress/kendo-react-buttons'
import * as React from 'react'

import { Field } from './Field'

export type SwitchButtonProps = KendoButtonProps & {
  inputClassName?: string
  label?: string
  name: string
  rootClassName?: string
}

class _SwitchButton extends Field<SwitchButtonProps> {
  private readonly onChange = action(() => {
    this.field.repr = !this.field.repr
  })

  public render() {
    const {
      inputClassName,
      label,
      name,
      rootClassName,
      ...kendoProps
    } = this.props
    return (
      <p className={classNames('k-form-field', rootClassName)}>
        <KendoButton
          className={classNames('form-control', inputClassName)}
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
