import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import {HashRouter} from "react-router-dom"
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Provider} from "react-redux"
import store from "./redux/store"

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="753309539015-sn6dkjvafa29idvse9666paqkhfv6oj6.apps.googleusercontent.com">
  <Provider store={store}>
  <HashRouter>
    <App />
  </HashRouter>
  </Provider >
  </GoogleOAuthProvider>
)
