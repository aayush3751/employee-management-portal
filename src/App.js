import {Navbar} from './components/Navbar'
import {Info} from './components/Info'
import {Profile} from './components/Profile'
import {Home} from './components/Home'
import {useEffect} from 'react'

import './App.css';
import {createBrowserRouter,RouterProvider} from "react-router-dom";
function App() {
   useEffect(() => {
    fetch("http://localhost:5001/api/employees")
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);


   const router=createBrowserRouter([
    {
      path:"/info",
      element:<><Navbar title="Employee management desk" /><Info/></>
    },
    {
      path:"/",
      element: <><Navbar title="Employee management desk"/><Home/></>
    },
    {
      path:"/profile",
      element: <><Navbar title="Employee management desk"/><Profile/></>
    }
  ])
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
