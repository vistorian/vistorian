import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { ConfigProvider } from "antd"
import uiTheme from "./assets/uiTheme.json"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider
      theme={uiTheme}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
