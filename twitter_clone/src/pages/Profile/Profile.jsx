import React from 'react'
import '../pages.css'
import Mainprofile from './Mainprofile/Mainprofile'
import { useUserAuth } from "../../context/UserAuthContext";

const Profile = () => {
  const { user } = useUserAuth();

  // const user = {
  //   displayName: "vamshi",
  //   email: "vamshi@gmail.com",
  // };
  return (
    <div className="profilePage">
      <Mainprofile user={user} />
    </div>
  )
}

export default Profile
