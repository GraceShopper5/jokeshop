import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import {Navbar, Footer} from './components'
import Routes from './routes'

const App = () => {
  return (
    <div>
      <CssBaseline />
      <Navbar />
      <Routes />
      <Footer />
    </div>
  )
}

export default App
