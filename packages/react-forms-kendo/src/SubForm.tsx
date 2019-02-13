import { computed } from 'mobx'
import * as React from 'react'
import { GroupViewModel, ViewModelGroup } from '@thejohnfreeman/react-forms'

import { FormContext } from './FormContext'

export type SubFormProps<G extends ViewModelGroup> = {
  viewModel: GroupViewModel<G>
}

export class SubForm<
  G extends ViewModelGroup = ViewModelGroup
> extends React.Component<SubFormProps<G>> {
  public static contextType = FormContext

  public get viewModel() {
    return this.props.viewModel
  }

  public get fields() {
    return this.props.viewModel.members
  }

  @computed
  public get submitted() {
    return this.context.form.submitted
  }

  public readonly onChange = (event: any) => {
    const name = event.target.name
    this.fields[name].repr = event.target.value
  }

  public render() {
    return (
      <FormContext.Provider value={{ form: this }}>
        {this.props.children}
      </FormContext.Provider>
    )
  }
}
