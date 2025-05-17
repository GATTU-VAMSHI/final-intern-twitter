import React, { useState } from "react";
import AvatarCreator from "./AvatarCreator";
import { Box, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

// import "../Editprofile/Editprofile.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 8,
  p: 2,
};

const Avatarprofile = ({user}) => {
  const { t }=useTranslation();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [open, setOpen] = useState(false);

  const handleSaveAvatar = (url) => {
    setAvatarUrl(url);
  };

  const handleSave = () => {
    console.log("Saved Avatar URL: ", avatarUrl);
    const userprofileimage = {
      email: user?.email,
      profileImage: avatarUrl,
    };
    if (avatarUrl) {
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
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    console.log("opened")
  };

  const handleClose = () => {
    setOpen(false);
    console.log("closed")
  };

  return (
    <div>
      <button onClick={handleOpen} className="Edit-profile-btn">
        {t("Create Avatar")}
      </button>

      <Modal
        open={open}
        onClose={handleClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modal">
          <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
            <h2 className="header-title">{t("Create Avatar")}</h2>
            <button className="save-btn" onClick={handleSave}>
              {t("Save")}
            </button>
          </div>

          <div style={{ margin: "10px 0" }}>
            {avatarUrl && (
              <img src={avatarUrl} alt="User Avatar" width="100" />
            )}
          </div>

          <AvatarCreator onSave={handleSaveAvatar} />
        </Box>
      </Modal>
    </div>
  );
};

export default Avatarprofile;
