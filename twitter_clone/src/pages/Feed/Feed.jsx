import React, { useEffect, useState } from "react";
import "./feed.css";
import Posts from "./Posts/Posts";
import Tweetbox from "./Tweetbox/Tweetbox";
import useLoggedinuser from "../hooks/useLoggedinuser";
import { useTranslation } from "react-i18next";

const Feed = () => {
  const [post, setpost] = useState([]);
  const [loggedinuser] = useLoggedinuser();
  const { t }=useTranslation();

  // console.log(loggedinuser[0]._id)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_API_URL}/post`)
      .then((res) => res.json())
      .then((data) => {
        setpost(data);
      });
  }, [post]);

  // const data = [
  //   {
  //     _id: "1",
  //     name: "Jane Doe",
  //     username: "jane_doe",
  //     profilePhoto: "https://example.com/profiles/jane.jpg",
  //     post: "Exploring the new features in JavaScript! 🚀 #coding #JavaScript",
  //     photo: "https://example.com/posts/javascript.png",
  //   },

  //   {
  //     _id: "2",
  //     name: "John Smith",
  //     username: "johnsmith",
  //     profilePhoto: "https://example.com/profiles/john.jpg",
  //     post: "Just finished a great workout session! 💪 #fitness #health",
  //     photo: "https://example.com/posts/workout.png",
  //   },
  //   {
  //     _id: "3",
  //     name: "Alice Johnson",
  //     username: "alicejohnson",
  //     profilePhoto: "https://example.com/profiles/alice.jpg",
  //     post: "Loving the new features in CSS! #webdevelopment #design",
  //     photo: "https://example.com/posts/css.png",
  //   },
  // ];
  // setpost(data)
  return (
    <div className="feed">
      <div className="feed__header">
        <h2>{t("Home")}</h2>
      </div>
      <Tweetbox />
      {loggedinuser?.[0]?._id &&
        post.map((p) => (
          <Posts p={p} key={p._id} currentUserId={loggedinuser[0]._id} currentUserEmail={loggedinuser[0].email} />
        ))}
    </div>
  );
};

export default Feed;
