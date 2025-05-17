import React, { useState } from "react";
import "./AvatarProfile.css";
import { useTranslation } from "react-i18next";

const AvatarCreator = ({ onSave }) => {
  const { t }=useTranslation();
  const [hair, setHair] = useState("shaggy");
  const [eyes, setEyes] = useState("default");
  const [skinColor, setSkincolor] = useState("f8d25c");
  const [clothing, setClothing] = useState("blazerAndShirt");
  const [bcolor, setbColor] = useState("b6e3f4");

  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?clothesColor=25557c&top=${hair}&eyes=${eyes}&skinColor=${skinColor}&clothing=${clothing}&backgroundColor=${bcolor}&mouth=default`;

  const handleSave = () => {
    onSave(avatarUrl);
  };

  return (
    <div className="avatar-container">
      <h2>{t("Customize Your Avatar")}</h2>
      <div className="avatar-preview">
        <img src={avatarUrl} alt="avatar" width="150" />
      </div>

      <div className="option-group">
        <label>{t("Hair Style")}</label>
        <div className="option-buttons">
          {["shaggy", "bigHair", "bob", "frida", "dreads01", "dreads02"].map((style) => (
            <button
              key={style}
              className={`option-button ${hair === style ? "active" : ""}`}
              onClick={() => setHair(style)}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div className="option-group">
        <label>{t("Eyes")}</label>
        <div className="option-buttons">
          {["default", "happy", "hearts", "side", "xDizzy", "surprised"].map((eye) => (
            <button
              key={eye}
              className={`option-button ${eyes === eye ? "active" : ""}`}
              onClick={() => setEyes(eye)}
            >
              {eye}
            </button>
          ))}
        </div>
      </div>

      <div className="option-group">
        <label>{t("Skin Color")}</label>
        <div className="option-buttons">
          {[
            { code: "f8d25c", label: "Default" },
            { code: "d08b5b", label: "Color 1" },
            { code: "edb98a", label: "Color 2" },
            { code: "ffdbb4", label: "Color 3" },
            { code: "ae5d29", label: "Color 4" },
            { code: "fd9841", label: "Color 5" },
          ].map((color) => (
            <button
              key={color.code}
              className={`option-button ${skinColor === color.code ? "active" : ""}`}
              onClick={() => setSkincolor(color.code)}
            >
              {color.label}
            </button>
          ))}
        </div>
      </div>

      <div className="option-group">
        <label>{t("Clothing")}</label>
        <div className="option-buttons">
          {[
            { code: "blazerAndShirt", label: "Default" },
            { code: "blazerAndSweater", label: "Style 1" },
            { code: "collarAndSweater", label: "Style 2" },
            { code: "graphicShirt", label: "Style 3" },
            { code: "hoodie", label: "Style 4" },
            { code: "shirtCrewNeck", label: "Style 5" },
          ].map((cloth) => (
            <button
              key={cloth.code}
              className={`option-button ${clothing === cloth.code ? "active" : ""}`}
              onClick={() => setClothing(cloth.code)}
            >
              {cloth.label}
            </button>
          ))}
        </div>
      </div>

      <div className="option-group">
        <label>{t("Background Color")}</label>
        <div className="option-buttons">
          {[
            { code: "b6e3f4", label: "Default" },
            { code: "c0aede", label: "Style 1" },
            { code: "d1d4f9", label: "Style 2" },
            { code: "ffd5dc", label: "Style 3" },
            { code: "ffdfbf", label: "Style 4" },
          ].map((bg) => (
            <button
              key={bg.code}
              className={`option-button ${bcolor === bg.code ? "active" : ""}`}
              onClick={() => setbColor(bg.code)}
            >
              {bg.label}
            </button>
          ))}
        </div>
      </div>

      <button className="save-button" onClick={handleSave}>
        {t("save_avatar")}
      </button>
    </div>
  );
};

export default AvatarCreator;
