import React, {  useEffect, useState } from "react";
import "./Posts.css";
import { Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Posts = ({ p, currentUserId,currentUserEmail }) => {
  const { t }=useTranslation();

  const { name, username, mediaSrc,type, post, profilephoto,email: post_email } = p;
  const [follow, setFollow] = useState(false);
  // Fetch follow status on mount
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API_URL}/users/${currentUserId}/following/${encodeURIComponent(post_email)}`
        );
        console.log(res.data)
        setFollow(res.data.isFollowing);
        // console.error(res.data.isFollowing);
      } catch (err) {
        console.error("Error checking follow status", err);
      }
    };

    checkFollowStatus();
  }, [post_email,currentUserId]);

  const handleClick = async () => {
    try {
      console.log(post_email)
      const url = `${import.meta.env.VITE_BACKEND_API_URL}/users/${currentUserId}/${
        follow ? "unfollow" : "follow"
      }`;
      const res=await axios.post(url, {post_email });
      setFollow(!follow);
      console.log(res.data)
    } catch (err) {
      console.error("Follow/unfollow failed", err);
    }
  };

  return (
    <div className="post">
      <div className="post__avatar">
        <Avatar src={profilephoto} />
      </div>
      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3>
              {name}{" "}
              <span className="post__headerSpecial">
                <VerifiedUserIcon className="post__badge" /> @{username}
              </span>
              {currentUserEmail !== post_email && (
                <button onClick={handleClick}>
                  {follow ? t("Following") : t("Follow")}
                </button>
              )}
            </h3>
          </div>
          <div className="post__headerDescription">
            <p>{post}</p>
          </div>
        </div>
        {type === "image" && <img src={mediaSrc} alt="post" width="500" />}
          {type === "audio" && <audio controls src={mediaSrc} />}
        <div className="post__footer">
          <ChatBubbleOutlineIcon
            className="post__fotter__icon"
            fontSize="small"
          />
          <RepeatIcon className="post__fotter__icon" fontSize="small" />
          <FavoriteBorderIcon className="post__fotter__icon" fontSize="small" />
          <PublishIcon className="post__fotter__icon" fontSize="small" />
        </div>
      </div>
    </div>
  );
};

export default Posts;
