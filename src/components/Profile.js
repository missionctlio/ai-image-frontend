import React from 'react';
import '../styles/Profile.css';

const Profile = ({ user, theme }) => {
    if (!user) {
        return <div className={`profile-container ${theme}-theme`}>No user data available.</div>;
    }

    return (
        <div className={`profile-container ${theme}-theme`}>
            <h2>{user.name}'s Profile</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <img src={user.picture} alt="Profile" className="profile-picture" />
        </div>
    );
};

export default Profile;