import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import  Login from  './pages/Login'
import  Home from  './pages/Home'
import  Register from  './pages/Register'
import  NotFound from  './pages/NotFound'
import ProtectedRouts from './components/ProtectedRouts'


function Logout(){
  localStorage.clear()
  return <Navigate to='/login'/>
}

function RegisterandLogout(){
  localStorage.clear()
  return <Register />

}




function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route 
            path='/'
            element ={
              <ProtectedRouts>
                  <Home />
              </ProtectedRouts>
            }
          
          />


          <Route path= "/login"element={<Login />}/>
          <Route path= "/logout"element={<Logout />}/>
          
          <Route path= "/register" element={<RegisterandLogout />}/>
          <Route path= "*" element={<NotFound />}/>

        </Routes>

    </ BrowserRouter>

    
  )
    
}

export default App;
