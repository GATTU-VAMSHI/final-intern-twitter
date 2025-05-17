import { useState, useRef } from "react";
import axios from "axios";
import useLoggedinuser from "../hooks/useLoggedinuser";
import MicIcon from "@mui/icons-material/Mic";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useUserAuth } from "../../context/UserAuthContext";
import { useTranslation } from "react-i18next";

const AudioUploader = () => {
    const { t }=useTranslation();
  const [audioBlob, setAudioBlob] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [recording, setRecording] = useState(false);
  const [loggedinuser] = useLoggedinuser();
  const { user } = useUserAuth();

  const userprofilepic = loggedinuser[0]?.profileImage
  ? loggedinuser[0].profileImage
  : user && user.photoURL;

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const getISTTime = () => {
    const now = new Date();
    const ISTOffset = 5.5 * 60 * 60 * 1000;
    return new Date(now.getTime() + ISTOffset);
  };

  const isUploadTimeValid = () => {
    const now = getISTTime().getUTCHours();
    return now >= 14 && now <= 19;
  };

  const handleRecordAudio = async () => {
    if (!isUploadTimeValid()) {
      alert("Upload allowed only between 2 PM to 7 PM IST.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (blob.size > 100 * 1024 * 1024) {
          alert("File exceeds 100MB");
          return;
        }
        setAudioBlob(blob);
        setRecording(false);
        stream.getTracks().forEach((track) => track.stop()); // clean up stream
      };

      mediaRecorder.start();
      setRecording(true);

      // Optional: Auto stop after 5 mins
      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
      }, 5 * 60 * 1000);
    } catch (error) {
      alert("Microphone access denied or error: " + error.message);
    }
  };

  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const sendOtp = async () => {
    await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/send_otp/${loggedinuser[0].email}`);
    setOtpSent(true);
  };

  const verifyOtp = async () => {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_API_URL}/verify_otp/${loggedinuser[0].email}`,
      { otp }
    );
    if (res.data.message === "OTP verified") {
      setOtpVerified(true);
      setOtpSent(false);
      setOtp(false);
    } else {
      alert(res.data.message);
    }
  };

  const uploadAudio = async () => {
    if (!audioBlob || !loggedinuser || !loggedinuser[0]?.email) {
      alert("Missing audio or user info.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("email", loggedinuser[0].email);
    formData.append("profilephoto", userprofilepic);
    formData.append("username", loggedinuser[0].email?.split("@")[0]);
    formData.append("name", user?.displayName);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_URL}/upload-audio`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.message === "Audio uploaded successfully") {
        alert("Audio uploaded to backend & saved in DB!");
        setRecording(false);
        setAudioBlob(null);
        setOtpSent(false);
        setOtpVerified(false);
      } else {
        alert("Upload failed: " + res.data.error);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong while uploading.");
    }
  };
  const cancelRecorded = () => {
    setRecording(false);
    setAudioBlob(null);
    setOtpSent(false);
    setOtpVerified(false);
  };

  return (
    <div>
      {!audioBlob ? (
        <MicIcon
          className="mic-style"
          onClick={handleRecordAudio}
          disabled={recording}
          style={{
            marginLeft: "22px",
            color: "var(--twitter-color)",
            cursor: "pointer",
          }}
        />
      ) : (
        <CancelIcon onClick={cancelRecorded} />
      )}
      {recording && (
        <StopCircleIcon
          onClick={handleStopRecording}
          style={{ marginLeft: "10px", color: "red" }}
        />
      )}

      {audioBlob && (
        <div style={{ marginTop: "10px" }}>
          <audio
            controls
            src={URL.createObjectURL(audioBlob)}
            style={{ marginLeft: "10px" }}
          />
        </div>
      )}

      {audioBlob && !otpSent && (
        // <button onClick={sendOtp} style={{ display: "block", marginTop: "10px" }}>
        //   Verify Before Upload
        // </button>
        <Button
          variant="contained"
          onClick={sendOtp}
          style={{
            display: "block",
            marginTop: "10px",
            marginLeft: "10px",
            backgroundColor: "var(--twitter-color)",
            borderRadius: "50px",
          }}
        >
          {t("Verify Before Upload")}
        </Button>
      )}

      {otpSent && (
        <>
          {/* <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            style={{ marginTop: "10px" }}
          /> */}
          <TextField
            id="outlined-number"
            label={t("Enter OTP")}
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            style={{
              marginLeft: "10px",
              marginTop: "10px",
            }}
          />
          {/* <button onClick={verifyOtp}>Verify OTP</button> */}
          <Button
            variant="contained"
            onClick={verifyOtp}
            style={{
              display: "block",
              marginTop: "10px",
              marginLeft: "10px",
              backgroundColor: "var(--twitter-color)",
              borderRadius: "50px",
            }}
          >
            {t("Verify OTP")}
          </Button>
        </>
      )}

      {otpVerified && (
        // <button
        //   onClick={uploadAudio}
        //   style={{ display: "block", marginTop: "10px" }}
        // >
        //   Upload Audio
        // </button>
        <Button
          variant="contained"
          onClick={uploadAudio}
          style={{
            display: "block",
            marginTop: "10px",
            marginLeft: "10px",
            backgroundColor: "var(--twitter-color)",
            borderRadius: "50px",
          }}
        >
          {t("Upload Audio")}
        </Button>
      )}
    </div>
  );
};

export default AudioUploader;
