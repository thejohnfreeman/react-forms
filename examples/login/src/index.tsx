import CssBaseline from '@material-ui/core/CssBaseline'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

// We choose to load the Roboto font from CDN instead of packaging it in our
// bundle, primarily because I do not yet know how to "[m]ake sure [our]
// bundler doesn't eager load all the font variations". The downside is that
// we cannot guarantee the font is delivered, but the chance it is not may be
// too small to worry about.
// https://material-ui.com/style/typography/#install-with-npm

ReactDOM.render(
  <>
    <CssBaseline />
  </>,
  document.getElementById('root'),
)
