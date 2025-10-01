/*
*   App.jsx
*
*   Main router for the whole site
*/

import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import CreateTicket from './components/CreateTicket.jsx'
import './bootstrap.min.css'

function App() {
  
   return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element = {<Login/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createticket" element={<CreateTicket />} />
      </Routes>
    </BrowserRouter>
  )

}

export default App
