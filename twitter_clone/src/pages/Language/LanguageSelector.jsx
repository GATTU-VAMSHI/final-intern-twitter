import { useTranslation } from "react-i18next";
import axios from "axios";
import { useEffect, useState } from "react";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [selectedLang, setSelectedLang] = useState("en");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang) {
      setSelectedLang(savedLang);
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const handleLanguageChange = (lang) => {
    setSelectedLang(lang);
    setOtpSent(false);
    setOtp("");
    setEmail("");
    setPhone("");
    setShowVerificationInput(false);
  };

  const requestOTP = async () => {
    try {
      if (selectedLang === "fr") {
        if (!email) return alert("Please enter a valid email");
        await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/send-email-otp`, { email });
      } else if (["es", "hi", "pt", "zh"].includes(selectedLang)) {
        if (!phone) return alert("Please enter a valid phone number");
        await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/send-sms-otp`, { phone });
      }
      setOtpSent(true);
      setShowVerificationInput(true);
    } catch (err) {
      alert("Failed to send OTP. Please try again.", err);
    }
  };

  const verifyOTP = async () => {
    try {
      const endpoint =
        selectedLang === "fr"
          ? `${import.meta.env.VITE_BACKEND_API_URL}/api/verify-email-otp`
          : `${import.meta.env.VITE_BACKEND_API_URL}/api/verify-sms-otp`;
      const res = await axios.post(endpoint, { otp });
      if (res.data.success) {
        i18n.changeLanguage(selectedLang);
        localStorage.setItem("selectedLanguage", selectedLang);

        alert("Language changed successfully");
        setOtp("");
        setOtpSent(false);
      } else {
        alert("Invalid OTP");
      }
    } catch (err) {
      alert("OTP verification failed", err);
    }
  };

  return (
    <div className="page">
  <div style={{ marginBottom: "1rem", color: "gray", fontSize: "14px" }}>
    <p>
      Note: Only verified phone numbers can receive OTPs because this is a Twilio trial version.
    </p>
    <p>
      Use my number <strong>+918015137795</strong> for testing. Call me and I will tell you the OTP.
    </p>
    <p>
      Please include the country code along with your phone number. For example: +91XXXXXXXXXX
    </p>
  </div>


      <select
        value={selectedLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
        <option value="hi">हिंदी</option>
        <option value="pt">Português</option>
        <option value="zh">中文</option>
      </select>
    
      {selectedLang === "fr" && (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={requestOTP}>Send OTP</button>
        </div>
      )}

      {["en", "es", "hi", "pt", "zh"].includes(selectedLang) && !otpSent && (
        <div>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={requestOTP}>Send OTP</button>
        </div>
      )}

      {showVerificationInput && otpSent && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP}>Verify OTP</button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

// import { useTranslation } from 'react-i18next';
// import axios from 'axios';
// import { useState } from 'react';

// const LanguageSelector = () => {
//   const { i18n } = useTranslation();
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [selectedLang, setSelectedLang] = useState("");

//   const handleLanguageChange = async (lang) => {
//     setSelectedLang(lang);
//     if (lang === 'fr') {
//       const email = prompt("Enter your email:");
//       await axios.post('/api/send-email-otp', { email });
//     } else if (['es', 'hi', 'pt', 'zh'].includes(lang)) {
//       const phone = prompt("Enter your phone number:");
//       await axios.post('/api/send-sms-otp', { phone });
//     }
//     setOtpSent(true);
//   };

//   const verifyOTP = async () => {
//     if (selectedLang === 'fr') {
//       const res = await axios.post('/api/verify-email-otp', { otp });
//       if (res.data.success) i18n.changeLanguage(selectedLang);
//     } else {
//       const res = await axios.post('/api/verify-sms-otp', { otp });
//       if (res.data.success) i18n.changeLanguage(selectedLang);
//     }
//   };

//   return (
//     <div>
//       <select onChange={(e) => handleLanguageChange(e.target.value)}>
//         <option value="en">English</option>
//         <option value="fr">French</option>
//         <option value="es">Spanish</option>
//         <option value="hi">Hindi</option>
//         <option value="pt">Portuguese</option>
//         <option value="zh">Chinese</option>
//       </select>

//       {otpSent && (
//         <div>
//           <input
//             type="text"
//             placeholder="Enter OTP"
//             onChange={(e) => setOtp(e.target.value)}
//           />
//           <button onClick={verifyOTP}>Verify OTP</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LanguageSelector;
