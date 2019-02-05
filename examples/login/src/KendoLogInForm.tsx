import '@progress/kendo-theme-material/dist/all.css'

import { observable } from 'mobx'
import { Button } from '@progress/kendo-react-buttons'
import * as React from 'react'

import { ViewModels } from '@thejohnfreeman/react-forms'
import { Form, Input } from '@thejohnfreeman/react-forms-kendo'
import { observer } from '@thejohnfreeman/observer'

export type LogInFormProps = {}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const LogInViewModel = ViewModels.group({
  username: ViewModels.text(),
  password: ViewModels.password().minLength(8),
})

class _LogInForm extends React.Component<LogInFormProps> {
  private readonly viewModel = LogInViewModel.construct()

  private readonly onSubmit = async ({ username, password }) => {
    console.log('submit:', username, password)
    this.isLoggingIn = true
    await sleep(1000)
    this.isLoggingIn = false
  }

  @observable
  private isLoggingIn = false

  public render() {
    return (
      <Form viewModel={this.viewModel} onSubmit={this.onSubmit}>
        <Input name="username" required />
        <Input name="password" required minLength={8} />
        <Button className="mt-3" type="submit" disabled={this.isLoggingIn}>
          {this.isLoggingIn ? 'Logging in...' : 'Log in'}
        </Button>
      </Form>
    )
  }
}

// We could use a class expression, but we do it this way for less
// indentation. We would prefer to use decorators, but TypeScript does not
// permit them to change the class type.
// https://github.com/Microsoft/TypeScript/issues/4881
export const LogInForm = observer(_LogInForm)
