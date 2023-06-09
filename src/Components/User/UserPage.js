import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import UserPostContainer from "./UserPostContainer";
import UserPageUser from "./UserPageUser";
import UserPhotos from "./UserPhotos";
import UserFriends from "./UserFriends";
import Settings from "../Shared/Settings";


const UserPage = ({setTheme, theme, isMobile, loadingStatus, setGuestMode, guestMode, isLoggedIn, setIsLoggedIn, userData, setRefreshMainUserData}) => {

    window.onbeforeunload = function () {
    window.scrollTo(0, 0);
    }

    useEffect(() => {
      document.documentElement.scrollTop = 0;
    }, [])

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoggedIn && !guestMode && !loadingStatus) {
            navigate("/login");
        }
    }, [isLoggedIn, guestMode, loadingStatus]);

    const { userId } = useParams();
    const [targetUser, setTargetUser] = useState(null);
    const [refreshData, setRefreshData] = useState(true);

    useEffect(() => {
        setRefreshData(true);
        setPage(1);
        setHasMore(true);
    }, [userId]);

    useEffect(() => {
        if (userData) {
            if (userId === userData.updatedUser._id) {
                navigate("/profile");
            }
            if (refreshData) {
                const fetchUserInfo = async () => {
                    const response = await fetch(`https://beebuddies.up.railway.app/api/users/${userId}`);
                    const targetUserData = await response.json();
                    setTargetUser(targetUserData);
                    setRefreshData(false);
                };    
                fetchUserInfo();
            }
        }
    }, [refreshData, userData])

    // New stuff ------------------------------------------------------------
    const handleScroll = () => {
        if (hasMore && window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
          setPage(prevPage => prevPage + 1);
        }
      };

      useEffect(() => {
        setPage(1);
    }, []);
    
      useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, [hasMore]);

      useEffect(() => {
        if (userData && targetUser) {
        if (page > 1) {
          const fetchMorePosts = async () => {
            let url = `https://beebuddies.up.railway.app/api/users/${userId}?page=${page}`;
    
            if (guestMode) {
              url += '&guestMode=true';
            }
    
            try {
              const response = await fetch(url);
              const morePosts = await response.json();
              if (morePosts.posts.length === 0) {
                setHasMore(false);
              } else {
                setTargetUser(prevTargetUser => ({
                    ...prevTargetUser,
                    posts: [...prevTargetUser.posts, ...morePosts.posts]
                  }));                  
              }
            } catch (error) {
              // Handle error
            }
          };
          fetchMorePosts();
        }
    }
      }, [page, userData, guestMode]);

      // END OF NEW STUFF ------------------------------------------------------------

    return (
        <div className="user-page">
            {targetUser ? (
                <img className="user-banner" src={`data:${targetUser.banner.contentType};base64,${targetUser.banner.data}`} alt={`${targetUser.first_name} banner`} />
            ) :
            <div className="user-banner"></div>}
            <div className="user-page-content">
                <div className="user-section-one">
                    <UserPageUser guestMode={guestMode} setRefreshMainUserData={setRefreshMainUserData} setRefreshData={setRefreshData} userData={userData} targetUser={targetUser} />
                    <UserFriends targetUser={targetUser} />
                    <UserPhotos isMobile={isMobile} guestMode={guestMode} setRefreshData={setRefreshData} userData={userData} targetUser={targetUser} />
                    {isMobile ? null : <Settings guestMode={guestMode} setTheme={setTheme} theme={theme} setGuestMode={setGuestMode} setIsLoggedIn={setIsLoggedIn} userData={userData} /> }
                </div>
                <div className="user-section-two">
                    <UserPostContainer isMobile={isMobile} guestMode={guestMode} setRefreshData={setRefreshData} targetUser={targetUser} userData={userData} />
                </div>
            </div>
        </div>
    )
}

export default UserPage;