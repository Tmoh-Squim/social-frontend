import React from 'react'
import {HashRouter} from "react-router-dom"
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Provider} from "react-redux"
import store from "./redux/store"

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <HashRouter>
    <App />
  </HashRouter>
  </Provider >
)
