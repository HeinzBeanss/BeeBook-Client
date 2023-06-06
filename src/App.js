import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from "react";

import defaultpfp from "./Assets/default_bee_profile.jpg";

import './App.css';
import "./Components/LoginSignup.css";
import './Components/Nav.css';
import "./Components/Home/Home.css";
import './Components/Shared/Shared.css';
import './Components/Friends/Friends.css';
import './Components/Profile/Profile.css';
import './Components/User/User.css';
import './Components/UserList/UserIndexPage.css';

import NavBar from "./Components/NavBar";
import LoginPage from "./Components/LoginPage";
import SignupPage from "./Components/SignupPage";
import Home from "./Components/Home/Home";
import UserPage from "./Components/User/UserPage";
import ProfilePage from "./Components/Profile/ProfilePage";
import UserIndexPage from "./Components/UserList/UserIndexPage";
import FriendsPage from "./Components/Friends/FriendsPage";
import PhotosPage from "./Components/Photos/PhotosPage";


const App = () => {

  // const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [refreshMainUserData, setRefreshMainUserData] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

  // Verify Token on page load up.
  useEffect(() => {
    setUserData(null);

    const verifyToken = async () => {
      try {
        console.log("Attempting to verify token");
        console.log(token);
        const response = await fetch("http://localhost:4000/auth/verify-token", {
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          console.log("ok");
          const userData = await response.json();
          console.log(userData);
          setUserData(userData);
          setGuestMode(false);
          setIsLoggedIn(true);
          setRefreshMainUserData(false);
        } else {
          console.log("not ok");
          const errorData = await response.json();
          setError(errorData.message);
          // window.location.href = "/login";
          setRefreshMainUserData(false);
        }
      } catch (error) {
        console.error("Error verifiying token:", error);
        setError("An error occured while verifying the token");
        setIsLoggedIn(false);
        setRefreshMainUserData(false);
        // navigate("/login");
      }
    }

    // Get the token in storage
    const token = localStorage.getItem("token");
    const isGuest = localStorage.getItem("isGuest");

    if (!token && !isGuest) {
      setIsLoggedIn(false);
      console.log("NO TOKEN OR GUEST LS");
    } else if (isGuest === "true") {
      console.log("GUEST LOCAL STORAGE IS TRUE");
      setGuestMode(true);
      setUserData({
        updatedUser: {
          first_name: "Guest",
          last_name: "Account",
          profile_picture: defaultpfp,
          friends: [],
          friend_requests_in: [],
          friend_requests_out: [],
          posts: [],
          _id: 0,
        }
      })
    } else {
      console.log("VERIFYING TOKEN NOW");
      console.log(isGuest);
      console.log((isGuest === "true"));
      verifyToken();
    }
  }, [isLoggedIn, guestMode, refreshMainUserData]);


  return (
    <>
      <Router>
      {isLoggedIn || guestMode ? (
        <NavBar guestMode={guestMode} userData={userData} />
        ) : null}
        <Routes>
          <Route
            exact
            path={'/'}
            element={<Home setGuestMode={setGuestMode} guestMode={guestMode} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userData={userData} />}
          />
          <Route
            path={'/login'}
            element={<LoginPage guestMode={guestMode} setGuestMode={setGuestMode} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />}
          />
          <Route path={'/signup'} guestMode={guestMode} element={<SignupPage setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
  

            <>
              <Route
                path={"/profile"}
                element={
                  <ProfilePage
                    guestMode={guestMode}
                    setGuestMode={setGuestMode}
                    isLoggedIn={isLoggedIn}
                    setRefreshMainUserData={setRefreshMainUserData}
                    setIsLoggedIn={setIsLoggedIn}
                    userData={userData}
                  />
                }
              />
              <Route
                path={"/user/:userId"}
                element={
                  <UserPage
                    guestMode={guestMode}
                    setGuestMode={setGuestMode}
                    setRefreshMainUserData={setRefreshMainUserData}
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                    userData={userData}
                  />
                }
              />
  
              <Route
                path={"/users"}
                setGuestMode={setGuestMode}
                element={<UserIndexPage setGuestMode={setGuestMode} guestMode={guestMode} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userData={userData} />}
              />
              <Route
                path={"/friends"}
                setGuestMode={setGuestMode}
                element={<FriendsPage  guestMode={guestMode} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userData={userData} />}
              />
              <Route
                path={"/photos"}
                setGuestMode={setGuestMode}
                element={<PhotosPage  guestMode={guestMode} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} userData={userData} />}
              />
            </>
  
        </Routes>
      </Router>
    </>
  );
  
}

export default App;
