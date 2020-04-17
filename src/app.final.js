/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {homepage} from '../package.json'
import {FullPageSpinner, FullPageErrorFallback} from './components/lib'
import * as authClient from './utils/auth-client'
import {useAsync} from './utils/use-async'
import {AuthContext} from './context/auth-context'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'

const fullUrl = new URL(homepage)
const basename = fullUrl.pathname.endsWith('/')
  ? fullUrl.pathname.slice(0, fullUrl.pathname.length - 1)
  : fullUrl.pathname

function App() {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  React.useEffect(() => {
    run(authClient.getUser())
  }, [run])

  const login = form => authClient.login(form).then(user => setData(user))
  const register = form => authClient.register(form).then(user => setData(user))
  const logout = () => {
    authClient.logout()
    setData(null)
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  if (isSuccess) {
    const props = {user, login, register, logout}
    return (
      <AuthContext.Provider value={props}>
        {user ? (
          <Router basename={basename}>
            <AuthenticatedApp />
          </Router>
        ) : (
          <UnauthenticatedApp />
        )}
      </AuthContext.Provider>
    )
  }
}

export {App}
