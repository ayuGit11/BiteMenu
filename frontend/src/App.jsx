import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from './Pages/Home'
import ManageFoodMenu from './Pages/ManageFoodMenu';
import Register from './Pages/Register';
import Login from './Pages/Login';


function App() {
  return (
     <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/register" element={<Register />} />
       <Route path="/login" element={<Login />} />
       <Route path="/menu" element={<ManageFoodMenu />} />   
     </Routes>
  )
}

export default App