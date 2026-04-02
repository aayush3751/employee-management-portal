import {Navbar} from './components/Navbar'
import {Info} from './components/Info'
import {Profile} from './components/Profile'
import {Admin} from './components/Admin'
import {useEffect} from 'react'
import {Home} from './pages/Home'
import {Login} from './pages/Login'
import {User} from './pages/User'

import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
   useEffect(() => {
    fetch("http://localhost:5001/api/employees")
      .then(res => res.json())
      .then(data => console.log(data));
  }, []);
  return (
     <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/employee" element={<User />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
