# react-forms

Low effort, high quality forms in React.

[![npm](https://img.shields.io/npm/v/@thejohnfreeman/react-forms.svg)](https://www.npmjs.com/package/@thejohnfreeman/react-forms)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@thejohnfreeman/react-forms.svg?style=flat)](https://bundlephobia.com/result?p=@thejohnfreeman/react-forms)
[![code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![build status](https://travis-ci.org/thejohnfreeman/react-forms.svg?branch=master)](https://travis-ci.org/thejohnfreeman/react-forms)


## Usage

```typescript
import * as React from 'react'
import { observer } from '@thejohnfreeman/observer'
import { ViewModels } from '@thejohnfreeman/react-forms'
import {
  Button,
  Errors,
  Form,
  TextField
} from '@thejohnfreeman/react-forms-material'

// Build the constructor for our view models.
// Note: fields are required (i.e. non-null) by default, just as in SQL.
const MyViewModel = ViewModels.group({
  username: ViewModels.text(),
  password: ViewModels.password().minLength(8),
})

@observer
class MyComponent extends React.Component {
  // Reference to the backend service.
  private readonly auth = this.props.backend.auth

  // Initializes with `username` and `password` from `props`, if present.
  private readonly viewModel = MyViewModel.construct(this.props)

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
