import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import UserContext from './context/UserContext.jsx'
import {Provider} from 'react-redux'
import { store } from './redux/store.js'
import { ToastContainer} from 'react-toastify';
import AuthProvider from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <UserContext>
            <App />
            <ToastContainer  position="top-center" autoClose={1500}/>
          </UserContext>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
)
