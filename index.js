import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import 'core-js/es6/map'
import 'core-js/es6/set'
import ErrorBoundary from './ErrorBoundary'

import Amplify from 'aws-amplify'
import awsExports from '../.aws-exports'

import App from './App'

if (!global._babelPolyfill) {
	require('babel-polyfill');
}

Amplify.configure(awsExports)

ReactDOM.render(
  <Router>
    <ErrorBoundary>
      <Switch>
        <App />
      </Switch>
    </ErrorBoundary>
  </Router>,
  document.getElementById('app')
)
