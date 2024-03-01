import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Home from "./components/Home/Home";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import Dash from "./components/dash/dash";
import Dashboard from "./components/Dashboard/dashboard";
import Report from "./components/Report/report";
import MyReports from "./components/MyReports/myreports";
import Contact from "./components/Contact/contact";
import './App.css'

function App() {

    const [authenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  
    const router = createBrowserRouter(
      createRoutesFromElements(
        <Route>
          <Route path='/' element={<Home />} />
  
          {/*Checks if user is logged in, if yes, they're redirected to the dashboard to signout first*/}
          <Route path='/Login' element={authenticated ? <Navigate to='/dashboard' /> : <Login authenticated={authenticated} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/resetPassword' element={<ResetPassword />} />
  
            {/* If user is not logged in, they can't use history to go back to a previously logged in route and will be redirected to login page*/}
            <Route path='/dashboard' element={authenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to='/Login' />} >
            <Route path='reportaccident' element={authenticated ? <Report setIsAuthenticated={setIsAuthenticated} /> : <Navigate to='/Login' />} />
            <Route path='dash' element={authenticated ? <Dash setIsAuthenticated={setIsAuthenticated} /> : <Navigate to='/Login' />} />
            <Route path='myreports' element={authenticated ? <MyReports setIsAuthenticated={setIsAuthenticated} /> : <Navigate to='/Login' />} />
            <Route path='contact' element={authenticated ? <Contact setIsAuthenticated={setIsAuthenticated} /> : <Navigate to='/Login' />} />
          </Route>
        </Route>
      )
    )
    return (
      <div className='appdiv'>
        <RouterProvider router={router} />
      </div>
    );
  }
  
  export default App;
  