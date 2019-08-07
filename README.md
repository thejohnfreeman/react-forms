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


## Development

I am trying to manage this project with [Lerna][]. I say _try_ because it is
confusing, documentation is sparse, there is no official tutorial, and
changes are coming so quickly that even recent discussion has fallen
out-of-date. I'll try to summarize what I know here.

1. After checking out the code, call `lerna bootstrap` from the root package
   to install dependencies and link the packages to each other.

2. If you want to run tests or linters, you can call `yarn test` or `yarn
   lint` from the root package or any workspace.

3. To publish, you must call `lerna publish` from the root package. You must
   not call `yarn publish` from any package. Before doing that, you will need
   to bump package versions and dependency versions yourself, manually. `lerna
   publish` will offer to bump package versions, but it will not bump
   dependency versions, which means individual packages will fall out of sync
   with each other. You can call `lerna changed` to see which packages need
   new versions. Those same packages should have their dependencies updated if
   they were changed in response to a dependency change. Don't forget to
   change the shared version number in `lerna.json`.

4. If you want to add a development dependency for a package, add it to the
   root package only with `yarn add -DW`. If you add a peer dependency to
   a package, add it as a development dependency on the root package as well.

[Lerna]: https://lerna.js.org/
