import React from 'react'
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Sidebar from './Sidebar/Sidebar';
import Widgets from './Widgets/Widgets';
import { useUserAuth } from '../context/UserAuthContext';

const Home = () => {
  const {logOut,user}=useUserAuth()
  const navigate = useNavigate();
  // const user = {
  //   displayName: "vamshi",
  //   email: "vamshi@gmail.com",
  // };

  const handlelogout = async () => {    
    try {
      await logOut()
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="app">
      <Sidebar handlelogout={handlelogout} user={user} />
      <Outlet/>
      <Widgets/>
    </div>
  );
}

export default Home