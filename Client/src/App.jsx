import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './components/Login/Login'
import Holidays from './components/Holidays/Holidays'
import LeaveRequestForm from './components/LeaveRequestForm/LeaveRequestForm'
import Rules from './components/Rules/Rules'
import ProtectedRoute from './components/ProtectedRoutes/ProtectedRoute'
import LeaveApproval from './components/LeaveApproval/LeaveApproval'
import LeavesApproved from './components/LeavesApproved/LeavesApproved'

const App = () => {
  return (
    <div>
      <BrowserRouter
      future={{
        v7_startTransition: true,  // Opt-in to startTransition behavior
        v7_relativeSplatPath: true, // Opt-in to relative splat path behavior
    }}>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route element={<ProtectedRoute />}>
          <Route path='/holidays' element={<Holidays/>}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
          <Route path='/leaveapproval' element={<LeaveApproval/>}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
          <Route path='/leaverequest' element={<LeaveRequestForm/>}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
          <Route path='/rules' element={<Rules/>}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
          <Route path='/leavesapproved' element={<LeavesApproved/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App