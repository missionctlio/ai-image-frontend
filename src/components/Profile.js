import React, { useState, useEffect } from "react";
import { THEME_LOCAL_STORAGE_KEY } from './ThemeSelector'
import "../styles/Profile.css";
const Profile = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark'); // Default theme
  // Fetch user data from local storage or props
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
    if (savedTheme) {
        setTheme(savedTheme);
    }

    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
  }, [theme]);

  return (
    <div className={`user-profile`}>
      <img src={user?.picture} alt={`${user?.name}'s profile`} className="profile-pic" />
      <h2>{user?.name}</h2>
      <p>Email: {user?.email}</p>
    </div>
  );
};

export default Profile;
