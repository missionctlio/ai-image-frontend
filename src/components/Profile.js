import React from 'react';
import useProfile from '../hooks/useProfile'; // Import the custom hook
import useTheme from '../hooks/useTheme'; // Import useTheme hook
import "../styles/Profile.css";

const Profile = () => {
    const { user } = useProfile(); // Use the hook to get user data and theme
    const { theme } = useTheme();

    return (
        <div className={`user-profile ${theme}-theme`}>
            <img src={user?.picture} alt={`${user?.name}'s profile`} className="profile-pic" />
            <h2>{user?.name}</h2>
            <p>Email: {user?.email}</p>
        </div>
    );
};

export default Profile;
