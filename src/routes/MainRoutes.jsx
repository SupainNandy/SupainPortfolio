
import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Portfolio from '../component/Home'
import About from '../component/About'
import Projects from '../component/Projects'
import Contact from '../component/Contact'
import Admin from '../component/Admin'
const MainRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Portfolio/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/projects' element={<Projects/>}/>
            <Route path='/contact' element={<Contact/>}/>
            <Route path='/admin' element={<Admin/>}/>
        </Routes>
    </div>
  )
}

export default MainRoutes
