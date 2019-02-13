import classNames from 'classnames'
import { action, computed, observable } from 'mobx'
import * as React from 'react'
import {
  Flatten,
  GroupViewModel,
  ViewModelGroup,
} from '@thejohnfreeman/react-forms'

import { FormContext } from './FormContext'

export type FormProps<G extends ViewModelGroup> = {
  className?: string
  viewModel: GroupViewModel<G>
  onSubmit: (value: Flatten<G, 'value'>) => void
}

// Require users to set `key` on `Form`s? It triggers state reconstruction and
// lets us ignore props after construction.
export class Form<
  G extends ViewModelGroup = ViewModelGroup
> extends React.Component<FormProps<G>> {
  public get viewModel() {
    return this.props.viewModel
  }

  public get fields() {
    return this.props.viewModel.members
  }

  // We want a read/write private interface, but a readonly public interface,
  // so we must split this field between a private observable and a public
  // computed.
  @observable
  private _submitted = false

  @computed
  public get submitted() {
    return this._submitted
  }

  // TODO: What is the event type?
  public readonly onChange = (event: any) => {
    const name = event.target.name
    this.fields[name].repr = event.target.value
  }

  @action
  private readonly onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    this._submitted = true
    this.props.onSubmit(this.props.viewModel.value)
  }

  public render() {
    return (
      // We have to construct a new context value on each render
      // to trigger updates in children dependent on that context.
      <FormContext.Provider value={{ form: this }}>
        <form
          className={classNames('k-form', this.props.className)}
          onSubmit={this.onSubmit}
        >
          {this.props.children}
        </form>
      </FormContext.Provider>
    )
  }
}
