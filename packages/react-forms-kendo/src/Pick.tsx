import { titleCase } from 'change-case'
import classNames from 'classnames/dedupe'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import * as React from 'react'
import uuidv4 from 'uuid/v4'

import { Field } from './Field'
import { defaultProps } from './recompose'

// `name` is optional in `KendoPickProps`
type PickProps = {
  inputClassName?: string
  label?: string
  name: string
  rootClassName?: string
  type: 'checkbox' | 'radio'
}

class _Pick extends Field<PickProps> {
  private readonly onChange = action((event: any) => {
    this.field.repr = event.target.checked
  })

  private readonly id = uuidv4()

  public render() {
    const { inputClassName, label, name, rootClassName, type } = this.props
    return (
      <div
        className={classNames(
          'custom-control',
          `custom-${type}`,
          rootClassName,
        )}
      >
        <input
          className={classNames('custom-control-input', inputClassName)}
          checked={this.field.repr}
          disabled={this.field.disabled}
          id={this.id}
          name={name}
          onChange={this.onChange}
          required={this.field.binder.optRequired}
          type={type}
        />
        <label className="custom-control-label" htmlFor={this.id}>
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
