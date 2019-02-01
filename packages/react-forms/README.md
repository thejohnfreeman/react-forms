# react-forms

Low effort, high quality forms.

[![npm](https://img.shields.io/npm/v/@thejohnfreeman/react-forms.svg)](https://www.npmjs.com/package/@thejohnfreeman/react-forms)
[![code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![build status](https://travis-ci.org/thejohnfreeman/react-forms.svg?branch=master)](https://travis-ci.org/thejohnfreeman/react-forms)


## Usage

```typescript
import { observer } from '@thejohnfreeman/observer'
import { Form, ViewModel } from '@thejohnfreeman/react-forms'
import { Button, TextField, Errors } from '@thejohnfreeman/react-forms/material-ui'

const makeViewModel = ViewModel.group({
  username: ViewModel.text().required(),
  password: ViewModel.password().required().minLength(8),
})

@observer
class MyComponent extends React.Component {
  // Reference to the backend service.
  private readonly auth = this.props.backend.auth

  // Initializes with `username` and `password` from `props`, if present.
  private readonly viewModel = makeViewModel(this.props)

  // Only called when form is valid.
  private readonly onSubmit = ({ username, password }) => {
    this.auth.logIn(username, password)
  }

  public render() {
    // Submit button is disabled if form invalid *or* while waiting for
    // response from backend. Errors are presented as dismissable cards with
    // a red background.
    return (
      <Form viewModel={this.viewModel} onSubmit={this.onSubmit}>
        <TextField name="username" />
        <TextField name="password" />
        <Button type="submit" disabled={this.auth.isLoggingIn}>
          {this.auth.isLoggingIn ? 'Logging in...' : 'Log in'}
        </Button>
        <Errors errors={[this.auth.error]} />
      </Form>
    )
  }
}
```
