import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

// We choose to load the Roboto font from CDN instead of packaging it in our
// bundle, primarily because I do not yet know how to "[m]ake sure [our]
// bundler doesn't eager load all the font variations". The downside is that
// we cannot guarantee the font is delivered, but the chance it is not may be
// too small to worry about.
// https://material-ui.com/style/typography/#install-with-npm

// import { LogInForm as ComponentUnderTest } from './KendoLogInForm'
// import { CarSearchForm as ComponentUnderTest } from './KendoCarSearchForm'
import { AddressForm as ComponentUnderTest } from './KendoAddressForm'

ReactDOM.render(
  <>
    <CssBaseline />
    <Grid container>
      <Grid item>
        <ComponentUnderTest />
      </Grid>
    </Grid>
  </>,
  document.getElementById('root'),
)
