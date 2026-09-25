import React from 'react'
import LoginPage from './pages/LoginPage.jsx'

const App = () => {
  return (
    <div>
      <div className="header">
      <h1 style={{ textAlign: 'center', margin: '0 auto',display: 'block', flexDirection: 'column', gap: '10px' }}>Welcome to Co_Ride</h1>
      </div>
      <LoginPage />
    </div>
  )
}

export default App