import React from "react";
import './widgets.css';
import SearchIcon from "@mui/icons-material/Search";
import { TwitterTimelineEmbed, TwitterTweetEmbed } from "react-twitter-embed";
import { useTranslation } from "react-i18next";

const Widgets = () => {
  const { t }=useTranslation();

  return (
    <div className="widgets">
      <div className="widgets__input">
        <SearchIcon className="widgets__searchIcon" />
        <input placeholder={t("Search Twitter")} type="text" />
      </div>
      <div className="widgets__widgetContainer">
        <h2>{t("What's Happening?")}</h2>
        <TwitterTweetEmbed tweetId={"1816174440071241866"} />
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="Valorant"
          options={{ height: 400 }}
        />
      </div>
    </div>
  );
};

export default Widgets;