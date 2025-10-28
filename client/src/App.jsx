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
import TicketDetails from './components/TicketDetails.jsx'
import Comment from './components/Comment.jsx'
import Assign from './components/Assign.jsx'
import Resolve from './components/Resolve.jsx'
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
        <Route path="/View/:ticketID" element={<TicketDetails />} />
        <Route path="/Log/:ticketID" element={<Comment />} />
        <Route path="/Assign/:ticketID" element={<Assign />} />
        <Route path="/Resolve/:ticketID" element={<Resolve />} />
      </Routes>
    </BrowserRouter>
  )

}

export default App
