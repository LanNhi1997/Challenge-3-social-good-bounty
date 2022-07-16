import 'regenerator-runtime/runtime'
import React from 'react'
import { login, logout } from './utils'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from './pages/Home'
import Thanks from './pages/Thanks'
import './global.css'

export default function App() {
  return (
    <>
      {window.walletConnection.isSignedIn() ? 
          <button className="auth-button" onClick={logout}>
            Sign out
          </button> : 
          <button className="auth-button" onClick={login}>
            Sign in
          </button>
        }
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="thanks" element={<Thanks />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}