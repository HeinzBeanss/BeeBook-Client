import '../Home/Home.css';
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

const UserContacts = ({ targetUser }) => {

    const [error, setError] = useState(null);
    
    if (!targetUser) {
        return <div className='user-contacts-loading'>Loading...</div>
    }

    if (error) {
        return <div className='user-contacts-loading'>Error: {error.message}</div>
    }

    return (
        <div className="user-contacts-outer">
            <h4 className='outer-title'>{targetUser.first_name}'s Buddies</h4>
            <div className='user-contacts-section'>
                { targetUser.friends.length > 0 ? (
                    targetUser.friends.map((user, index) => {
                        return (
                            <div className='contact-section-item' key={index}>
                                <Link className="user-profilepicture-medium" to={`/user/${user._id}`}><img className="user-profilepicture-medium" src={`data:${user.profile_picture.contentType};base64,${user.profile_picture.data}`} alt={`${user.first_name} profile`} /></Link>
                                <Link to={`/user/${user._id}`}><h5 className='small-user-name'>{user.first_name} {user.last_name}</h5></Link>
                            </div>
                        )
                    })
                ) : (
                    <div className='user-contacts-loading'>This user has no friends added.</div>
                )}
            
                </div>
        </div>
    )
}

export default UserContacts;