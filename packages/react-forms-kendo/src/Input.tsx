import { titleCase } from 'change-case'
import {
  Input as KendoInput,
  InputProps as KendoInputProps,
} from '@progress/kendo-react-inputs'
import { isNil } from 'lodash-es'
import * as React from 'react'

import { FormContext } from './Form'

// `name` is optional in `KendoInputProps`
export type InputProps = KendoInputProps & { name: string }

export class Input extends React.Component<InputProps> {
  public static contextType = FormContext

  public render() {
    const field = this.context.form.state.fields[this.props.name]
    if (isNil(field)) {
      console.error(`no field named ${this.props.name} in form`)
    }
    return (
      <KendoInput
        {...this.props}
        label={titleCase(this.props.name)}
        style={{ width: '100%' }}
        onChange={this.context.form.onChange}
        value={field.value}
        validityStyles={field.touched || this.context.form.state.touched}
      />
    )
  }
}
