import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './components/Login/index.jsx'
import Signup from './components/Signup/index.jsx'
import { AppProvider } from "./context/AppContext.jsx";
import Preview from './components/Preview/index.jsx'
import UserProfile from './components/UserProfile/index.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/user/:userId" element={<UserProfile />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>,

  </StrictMode>
)
