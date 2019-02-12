import { titleCase } from 'change-case'
import classNames from 'classnames'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import * as React from 'react'
import { defaultProps } from 'recompose'

import { Field } from './Field'

// `name` is optional in `KendoPickProps`
type PickProps = {
  className?: string
  label?: string
  name: string
  type: 'checkbox' | 'radio'
}

class _Pick extends Field<PickProps> {
  private readonly onChange = action((event: any) => {
    this.field.repr = event.target.checked
  })

  public render() {
    const { className, label, name, type } = this.props
    return (
      <div
        className={classNames(className, 'custom-control', `custom-${type}`)}
      >
        <input
          className="custom-control-input"
          checked={this.field.repr}
          disabled={this.field.disabled}
          id={name}
          name={name}
          onChange={this.onChange}
          required={this.field.binder.optRequired}
          type={type}
        />
        <label className="custom-control-label" htmlFor={name}>
          {label || titleCase(name)}
        </label>
      </div>
    )
  }
}

export type CheckboxProps = PickProps
export type RadioProps = PickProps

export const Checkbox = defaultProps({ type: 'checkbox' })(observer(_Pick))
export const Radio = defaultProps({ type: 'radio' })(observer(_Pick))
