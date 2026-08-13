import React from 'react'
import { Routes, Route } from "react-router-dom";
import Home from './Pages/Home'
import ManageFoodMenu from './Pages/ManageFoodMenu';


function App() {
  return (
     <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/menu" element={<ManageFoodMenu />} />   
     </Routes>
  )
}

export default App