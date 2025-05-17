import { Route } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Login/Signup";
import Login from "./pages/Login/Login";
import Home from "./pages/Home";
import { Routes } from "react-router-dom";
import Feed from "./pages/Feed/Feed";
import Explore from "./pages/Explore/Explore";
import Notification from "./pages/Notification/Notification";
import Messages from "./pages/Messages/Messages";
import Lists from "./pages/Lists/Lists";
import Profile from "./pages/Profile/Profile";
import More from "./pages/More/More";
import Bookmark from "./pages/Bookmark/Bookmark";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import LanguageSelector from "./pages/Language/LanguageSelector";

function App() {
  return (
    <div className="app">
      <UserAuthContextProvider>
        <Routes>
        <Route
            path="/"
            element={
              <ProtectedRoute>
                {" "}
                <Home />
              </ProtectedRoute>
            }
          >
            <Route index element={<Feed />} />
          </Route>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {" "}
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/home" element={<Home />}>
            <Route path="feed" element={<Feed />} />
            <Route path="explore" element={<Explore />} />
            <Route path="notification" element={<Notification />} />
            <Route path="messages" element={<Messages />} />
            <Route path="bookmarks" element={<Bookmark />} />
            <Route path="lists" element={<Lists />} />
            <Route path="profile" element={<Profile />} />
            <Route path="more" element={<More />} />
            <Route path="language" element={<LanguageSelector/>} />
          </Route>
        </Routes>
      </UserAuthContextProvider>
    </div>
  );
}

export default App;
