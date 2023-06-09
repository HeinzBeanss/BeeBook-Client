import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"

import CreatePost from "../Home/HomeCreatePost";
import ProfilePostContainer from "./ProfilePostContainer";
import ProfilePageUser from "./ProfilePageUser";
import UserPhotos from "../User/UserPhotos";
import UserFriends from "../User/UserFriends";
import Settings from "../Shared/Settings";


const ProfilePage = ({theme, setTheme, isMobile, loadingStatus, setGuestMode, guestMode, isLoggedIn, setRefreshMainUserData, setIsLoggedIn, userData }) => {

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
    }

    useEffect(() => {
      document.documentElement.scrollTop = 0;
    }, []);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoggedIn && !guestMode && !loadingStatus) {
            navigate("/login");
        }
    }, [isLoggedIn, guestMode, loadingStatus]);

    useEffect(() => {
        if (guestMode) {
            navigate("/")
        }
    }, [loadingStatus]);

    const [profileUser, setProfileUser] = useState(null);
    const [refreshData, setRefreshData] = useState(true);
    const [bannerFeedback, setbannerFeedback] = useState("");

    useEffect(() => {
        if (userData && refreshData) {
            const fetchUserInfo = async () => {
                const response = await fetch(`https://beebuddies.up.railway.app/api/users/${userData.updatedUser._id}`);
                const profileUserData = await response.json();
                setProfileUser(profileUserData);
                setRefreshData(false);
            };    
            fetchUserInfo();
        }
    }, [refreshData, userData])

    const handleFileUpload = () => {
        const fileInput = document.querySelector('.createpost-file-banner');
        setbannerFeedback("");
        fileInput.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        const allowedFileTypes = [  
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/tiff',
        'image/webp'
        ];

        // Validate File Size
        if (file.size > 4 * 1024 * 1024) {
            setbannerFeedback(<div className='createpost-file-error'>Sorry, your file was too big for your banner. (Over 4MB)</div>)
            e.target.value = "";

            if (isMobile) {
              setTimeout(() => {
                setbannerFeedback(null);
              }, 3000);
            }
            return;
        } 
        if (!allowedFileTypes.includes(file.type)) {
            setbannerFeedback(<div className='createpost-file-error'>{file.type} isn't a supported file type for your banner.</div>);
            e.target.value = "";
            if (isMobile) {
              setTimeout(() => {
                setbannerFeedback(null);
              }, 3000);
            }
            return;
        }
        setbannerFeedback("");
        // It's all good, now upload the photo, then refresh the data.
        const formData = new FormData();
        formData.append("image", file);
        formData.append("mimeType", file.type);
        const response = await fetch(`https://beebuddies.up.railway.app/api/users/${userData.updatedUser._id}/update-banner`, {
            method: "PUT",
            body: formData,
        });
        const message = await response.json();
        setRefreshData(true);
    }

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
        if (userData && profileUser) {
        if (page > 1) {
          const fetchMorePosts = async () => {
            let url = `https://beebuddies.up.railway.app/api/users/${userData.updatedUser._id}?page=${page}`;
    
            if (guestMode) {
              url += '&guestMode=true';
            }
    
            try {
              const response = await fetch(url);
              const morePosts = await response.json();
              if (morePosts.posts.length === 0) {
                setHasMore(false);
              } else {
                setProfileUser(prevProfileUser => ({
                    ...prevProfileUser,
                    posts: [...prevProfileUser.posts, ...morePosts.posts]
                  }));                  
              }
            } catch (error) {
              console.error('Error fetching more posts:', error);
            }
          };
          fetchMorePosts();
        }
    }
      }, [page, userData, guestMode]);

    return (
        <div className="profile-page">
            {profileUser ? (
                <div className="profile-banner">
                    <input className="createpost-file-banner" type="file" accept="image/*" onChange={handleFileChange}/>
                    <button className="banner-button" onClick={handleFileUpload}>Update Banner</button>
                    <img className="profile-banner" src={`data:${profileUser.banner.contentType};base64,${profileUser.banner.data}`} alt={`${profileUser.first_name} banner`} />
                </div>
            ) :
            <div className="profile-banner"></div>}
            <div className="profile-page-content">
            <div className="profile-section-one">
                <ProfilePageUser isMobile={isMobile} setBannerFeedback={setbannerFeedback} setRefreshMainUserData={setRefreshMainUserData} profileUser={profileUser} setRefreshData={setRefreshData}/>
                <UserFriends targetUser={profileUser} />
                <UserPhotos isMobile={isMobile} setRefreshData={setRefreshData} userData={userData} targetUser={profileUser} />
                {isMobile ? null : <Settings guestMode={guestMode} setTheme={setTheme} theme={theme} setGuestMode={setGuestMode} setIsLoggedIn={setIsLoggedIn} userData={userData} />}
            </div>
            <div className="profile-section-two">
                <div className="banner-feedback">{bannerFeedback}</div>
                <CreatePost refreshData={refreshData} setRefreshPostData={setRefreshData} setRefreshData={setRefreshData} userData={userData} />
                <ProfilePostContainer isMobile={isMobile} setRefreshData={setRefreshData} profileUser={profileUser} userData={userData} />
            </div>
            </div>
        </div>
    )
}

export default ProfilePage;