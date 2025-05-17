import { useEffect, useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";

const useLoggedinuser = () => {
  const { user } = useUserAuth();
  const email = user?.email;
  const [loggedinuser, setloggedinuser] = useState({});
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_API_URL}/loggedinuser?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        setloggedinuser(data);
      });
  }, [email]);

  return [loggedinuser, setloggedinuser];

};

export default useLoggedinuser;
