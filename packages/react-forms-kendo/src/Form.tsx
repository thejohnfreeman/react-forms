import * as React from 'react'

import {
  Flatten,
  GroupViewModel,
  ViewModelGroup,
} from '@thejohnfreeman/react-forms'

// How do we say "a Form of any ViewModelGroup"?
export const FormContext = React.createContext<{
  form: Form<any>
} | null>(null)

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
  public readonly onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const name = event.currentTarget.name
    this.props.viewModel.members[name].repr = event.currentTarget.value
  }

  private readonly onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    this.props.onSubmit(this.props.viewModel.value)
  }

  public render() {
    return (
      // We have to construct a new context value on each render
      // to trigger updates in children dependent on that context.
      <FormContext.Provider value={{ form: this }}>
        <form className={this.props.className} onSubmit={this.onSubmit}>
          {this.props.children}
        </form>
      </FormContext.Provider>
    )
  }
}
