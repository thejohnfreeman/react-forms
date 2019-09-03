import classNames from 'classnames'
import { action, computed, observable } from 'mobx'
import * as React from 'react'
import {
  GroupViewModel,
  ValueGroup,
  ViewModelGroup,
} from '@thejohnfreeman/react-forms'

// How do we say "a Form of any ViewModelGroup"?
export const FormContext = React.createContext<{
  form: Form<any> | null
}>({ form: null })

export type FormProps<G extends ViewModelGroup> = {
  className?: string
  viewModel?: GroupViewModel<G>
  onSubmit: (value: ValueGroup<G>) => void
}

const defaultOnSubmit = () => {}

// Require users to set `key` on `Form`s? It triggers state reconstruction and
// lets us ignore props after construction.
export class Form<
  G extends ViewModelGroup = ViewModelGroup
> extends React.Component<FormProps<G>> {
  // If the context is non-null, this is a nested form.
  public static contextType = FormContext
  public static defaultProps = {
    onSubmit: defaultOnSubmit,
  }

  // This method may go unused, but we cannot conditionally initialize it
  // inside the constructor because the context is not available there.
  @action
  private readonly onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    this._submitted = true
    this.props.onSubmit!(this.viewModel.value)
  }

  public componentDidMount() {
    if (this.parent && this.props.onSubmit !== defaultOnSubmit) {
      console.error('onSubmit prop to nested form will be ignored')
    }
  }

  private get parent(): Form<any> | null {
    return this.context.form
  }

  public get viewModel(): GroupViewModel<G> {
    return this.props.viewModel || this.parent!.viewModel
  }

  public get fields() {
    return this.viewModel.members
  }

  // We want a read/write private interface, but a readonly public interface,
  // so we must split this field between a private observable and a public
  // computed.
  @observable
  private _submitted = false

  @computed
  public get submitted(): boolean {
    return this.parent ? this.parent.submitted : this._submitted
  }

  // This default onChange handler is good for most controls.
  // TODO: What is the event type?
  public readonly onChange = (event: any) => {
    const name = event.target.name
    this.fields[name].repr = event.target.value
  }

  public render() {
    let element = (
      // We have to construct a new context value on each render
      // to trigger updates in children dependent on that context.
      <FormContext.Provider value={{ form: this }}>
        {this.props.children}
      </FormContext.Provider>
    )

    // Wrap in a <form> only if we are the root <Form>.
    if (!this.parent) {
      element = (
        <form
          className={classNames('k-form', this.props.className)}
          onSubmit={this.onSubmit}
        >
          {element}
        </form>
      )
    }

    return element
  }
}
