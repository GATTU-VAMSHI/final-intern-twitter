import React, { useState } from "react";
import "./Tweetbox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import axios from "axios";
import { useUserAuth } from "../../../context/UserAuthContext";
import useLoggedinuser from "../../hooks/useLoggedinuser";
import AudioUploader from "../../AudioUploader/AudioUploader";
import { useTranslation } from "react-i18next";

const Tweetbox = () => {
  const { t }=useTranslation();

  const [post, setpost] = useState("");
  const [imageurl, setimageurl] = useState("");
  const [isloading, setisloading] = useState(false);
  const [name, setname] = useState("");
  const [username, setusername] = useState("");
  // const [message,setMessage]=useState(null)
  const { user } = useUserAuth();
  const [loggedinuser] = useLoggedinuser();
  const email = user?.email;
  const userprofilepic = loggedinuser[0]?.profileImage
    ? loggedinuser[0].profileImage
    : user && user.photoURL;
    
  const handleuploadimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    // console.log(image)
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        import.meta.env.VITE_IMGBB_API,
        formData
      )
      .then((res) => {
        setimageurl(res.data.data.display_url);
        console.log(res.data.data.display_url);
        setisloading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handletweet = (e) => {
    e.preventDefault();
    if (user?.providerData[0]?.providerId === "password") {
      fetch(`${import.meta.env.VITE_BACKEND_API_URL}/loggedinuser?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data); 
          setname(data[0]?.name); 
          setusername(data[0]?.username); 
        });
    } else {
      setname(user?.displayName);
      setusername(email?.split("@")[0]);
    } 
    // console.log(name);
    if (name) {
      const userpost = {
        profilephoto: userprofilepic,
        post: post,
        photo: imageurl,
        username: username,
        name: name,
        email: email,
      };
      // console.log(userpost);
      setpost("");
      setimageurl("");
      fetch(`${import.meta.env.VITE_BACKEND_API_URL}/post`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userpost),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.message);
        });
    }
  };

  return (
    <div className="tweetBox">
      <form onSubmit={handletweet}>
        <div className="tweetBox__input">
          <Avatar src={
              loggedinuser[0]?.profileImage
                ? loggedinuser[0].profileImage
                : user && user.photoURL
            }/>
          <input
            type="text"
            placeholder={t("What's Happening?")}
            onChange={(e) => setpost(e.target.value)}
            value={post}
            required
          />
        </div>
        <div className="imageIcon_tweetButton">
          <label htmlFor="image" className="imageIcon">
            {isloading ? (
              <p>{t("Uploading Image")}</p>
            ) : (
              <p>
                {imageurl ? (
                  "Image Uploaded"
                ) : (
                  <AddPhotoAlternateOutlinedIcon />
                )}
              </p>
            )}
          </label>
          <input type="file" id="image" className="imageInput" onChange={handleuploadimage}/>
          <Button className="tweetBox__tweetButton" type="submit">
          {t("Tweets")}
          </Button>
        </div>
          <AudioUploader />
      </form>
    </div>
  );
};

export default Tweetbox;
