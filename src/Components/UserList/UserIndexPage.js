import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import SharedUser from "../Shared/User";
import SharedNavigation from "../Shared/Navigation";
import SharedSettings from "../Shared/Settings";
import SearchBar from "../Shared/SearchBar";
import UserList from "../UserList/UserList";
import UserIndex from "../UserList/UserIndexRequests";

const UserIndexPage = ({setGuestMode, guestMode, isLoggedIn, userData, setIsLoggedIn, setRefreshUserData }) => {

    console.log(`guest mode: ${guestMode}`);

    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoggedIn && !guestMode) {
            navigate("/login");
        }
    }, [isLoggedIn, guestMode]);
    console.log(isLoggedIn);


    const [refreshData, setRefreshData] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (userData && refreshData) {
            const fetchUsers = async () => {
                try {

                    let url = `http://localhost:4000/api/user/${userData.updatedUser._id}/unadded-users`;

                    if (guestMode) {
                        url += '?guestMode=true';
                      }
                      
                    console.log("FETCHING USERS NOW")
                    const response = await fetch(url);
                    const data = await response.json();
                    setData(data);
                    setRefreshData(false);
                    console.log(data);
                } catch (err) {

                }
            };
            fetchUsers();
        }
    }, [userData, refreshData]);

    return (
        <div className="userindex-component">
            <div className="userindex-section-one">
                <SharedUser guestMode={guestMode} userData={userData} />
                <SharedNavigation guestMode={guestMode}/>
                <SharedSettings setGuestMode={setGuestMode} setIsLoggedIn={setIsLoggedIn} />
            </div>
            <div className='userindex-section-two'>
                <UserIndex guestMode={guestMode} data={data} setRefreshData={setRefreshData} userData={userData}/>
                <SearchBar guestMode={guestMode} friends={data}/>
                <UserList guestMode={guestMode} data={data} setRefreshData={setRefreshData} userData={userData}/>
            </div>
            
        </div>
    )
}

export default UserIndexPage;