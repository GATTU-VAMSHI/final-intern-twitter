import React, { useEffect, useState } from "react";
import Posts from "../Posts/Posts";
import "./Mainprofile.css";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import LockResetIcon from "@mui/icons-material/LockReset";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLinkIcon from "@mui/icons-material/AddLink";
import Editprofile from "../Editprofile/Editprofile";
import axios from "axios";
import useLoggedinuser from "../../hooks/useLoggedinuser";
import Avatarprofile from "../Avatarprofile/Avatarprofile";
import { useTranslation } from "react-i18next";

const Mainprofile = ({ user }) => {
      const { t }=useTranslation();

  const [anchorE1, setanchorE1] = useState(null);
  const openmenu = Boolean(anchorE1);
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(false);
  const [loggedinuser] = useLoggedinuser();
  const username = user?.email?.split("@")[0];
  const [post, setpost] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_API_URL}/userpost?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        setpost(data);
      });
  }, [user.email]);

  const handleuploadcoverimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    // console.log(image)
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=b0ea2f6cc0f276633b2a8a86d2c43335",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        // console.log(res.data.data.display_url);
        const usercoverimage = {
          email: user?.email,
          coverimage: url,
        };
        setisloading(false);
        if (url) {
          fetch(`${import.meta.env.VITE_BACKEND_API_URL}/userupdate/${user?.email}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(usercoverimage),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("done", data);
            });
        }
      })
      .catch((e) => {
        console.log(e);
        window.alert(e);
        setisloading(false);
      });
  };
  const handleuploadprofileimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    console.log(image);
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=b0ea2f6cc0f276633b2a8a86d2c43335",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        console.log(res.data.data.display_url);
        const userprofileimage = {
          email: user?.email,
          profileImage: url,
        };
        setisloading(false);

        if (url) {
          fetch(`${import.meta.env.VITE_BACKEND_API_URL}/userupdate/${user?.email}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(userprofileimage),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("done", data);
            });
        }
      })
      .catch((e) => {
        console.log(e);
        window.alert(e);
        setisloading(false);
      });
  };
  // const data = [
  //   {
  //     _id: 1,
  //     name: "Jane Doe",
  //     username: "jane_doe",
  //     profilePhoto: "https://example.com/profiles/jane.jpg",
  //     post: "Exploring the new features in JavaScript! 🚀 #coding #JavaScript",
  //     photo: "https://example.com/posts/javascript.png",
  //   },
  //   {
  //     _id: 2,
  //     name: "John Smith",
  //     username: "johnsmith",
  //     profilePhoto: "https://example.com/profiles/john.jpg",
  //     post: "Just finished a great workout session! 💪 #fitness #health",
  //     photo: "https://example.com/posts/workout.png",
  //   },
  //   {
  //     _id: 3,
  //     name: "Alice Johnson",
  //     username: "alicejohnson",
  //     profilePhoto: "https://example.com/profiles/alice.jpg",
  //     post: "Loving the new features in CSS! #webdevelopment #design",
  //     photo: "https://example.com/posts/css.png",
  //   },
  // ];
  const handleclick = (e) => {
    setanchorE1(e.currentTarget);
  };
  const handleclose = () => {
    setanchorE1(null);
  };
  return (
    <div>
      <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
      <h4 className="heading-4">{username}</h4>
      <div className="mainprofile">
        <div className="profile-bio">
          {
            <div>
              <div className="coverImageContainer">
                <img
                  src={
                    loggedinuser[0]?.coverimage
                      ? loggedinuser[0].coverimage
                      : user && user.photoURL
                    //: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                  }
                  alt=""
                  className="coverImage"
                />
                <div className="hoverCoverImage">
                  <div className="imageIcon_tweetButton">
                    <label htmlFor="image" className="imageIcon">
                      {isloading ? (
                        <LockResetIcon className="photoIcon photoIconDisabled" />
                      ) : (
                        <CenterFocusWeakIcon className="photoIcon" />
                      )}
                    </label>
                    <input
                      type="file"
                      id="image"
                      className="imageInput"
                      onChange={handleuploadcoverimage}
                    />
                  </div>
                </div>
              </div>
              <div className="avatar-img">
                <div className="avatarContainer">
                  <img
                    src={
                      loggedinuser[0]?.profileImage
                        ? loggedinuser[0].profileImage
                        : user && user.photoURL
                      // :"https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                    }
                    alt=""
                    className="avatar"
                  />
                  <div className="hoverAvatarImage">
                    <div className="imageIcon_tweetButton">
                      <label className="imageIcon">
                        {isloading ? (
                          <LockResetIcon className="photoIcon photoIconDisabled" />
                        ) : (
                          <div>
                            <IconButton
                              size="small"
                              sx={{ ml: 2 }}
                              aria-controls={
                                openmenu ? "profile-change" : undefined
                              }
                              aria-haspopup="true"
                              aria-valuetext={openmenu ? "true" : undefined}
                              onClick={handleclick}
                            >
                              <CenterFocusWeakIcon className="photoIcon" />
                            </IconButton>
                            <Menu
                              id="profile-change"
                              anchorEl={anchorE1}
                              open={openmenu}
                              onClick={handleclose}
                              onClose={handleclose}
                            >
                              <MenuItem>
                                <label htmlFor="profileImage">
                                  <input
                                    type="file"
                                    id="profileImage"
                                    className="imageInput"
                                    onChange={handleuploadprofileimage}
                                  />
                                  {t("Select from device")}
                                </label>
                              </MenuItem>
                              <MenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <Avatarprofile user={user} />
                              </MenuItem>
                            </Menu>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="userInfo">
                  <div>
                    <h3 className="heading-3">
                      {loggedinuser[0]?.name
                        ? loggedinuser[0].name
                        : user && user.displayName}
                    </h3>
                    <p className="usernameSection">@{username}</p>
                  </div>
                  <Editprofile user={user} loggedinuser={loggedinuser} />
                </div>
                <div className="infoContainer">
                  {loggedinuser[0]?.bio ? (
                    <p>{loggedinuser[0].bio}</p>
                  ) : (
                    "User bio"
                  )}
                  <div className="follow-section">
                    <div className="follow-following">
                      {loggedinuser[0]?.following ? (
                        <p>{t("following")} {loggedinuser[0].following.length}</p>
                      ) : (
                        "following 0"
                      )}
                    </div>
                    <div className="follow-followers">
                      {loggedinuser[0]?.followers ? (
                        <p>{t("followers")} {loggedinuser[0].followers.length}</p>
                      ) : (
                        "followers 0"
                      )}
                    </div>
                  </div>
                  <div className="locationAndLink">
                    {loggedinuser[0]?.location ? (
                      <p className="suvInfo">
                        <MyLocationIcon /> {loggedinuser[0].location}
                      </p>
                    ) : (
                      "Location"
                    )}
                    {loggedinuser[0]?.website ? (
                      <p className="subInfo link">
                        <AddLinkIcon /> {loggedinuser[0].website}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <h4 className="tweetsText">{t("Tweets")}</h4>
                <hr />
              </div>
              {post.map((p) => (
                <Posts p={p} key={p._id} />
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Mainprofile;
