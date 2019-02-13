import { isNil } from 'lodash-es'
import { computed } from 'mobx'
import * as React from 'react'

import { FormContext } from './Form'

export type FieldProps = { name: string }

export class Field<P extends FieldProps> extends React.Component<P> {
  public static contextType = FormContext

  @computed
  protected get field() {
    const field = this.context.form.fields[this.props.name]
    if (isNil(field)) {
      console.error(`no field named ${this.props.name} in form`)
    }
    return field
  }
}
