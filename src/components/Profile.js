import React from 'react';
import { FaEnvelope, FaUser } from 'react-icons/fa';
import '../styles/Profile.css';

const Profile = ({ user }) => {
    return (
        <div className="profile-card-dark">
            <div className="profile-header-dark">
            </div>
            <div className="profile-details-dark">
                <div className="profile-detail-dark">
                    <strong>Name:</strong> {user.name}
                </div>
                <div className="profile-detail-dark">
                    <FaEnvelope className="profile-icon-dark" />
                    <strong>Email:</strong> {user.email}
                </div>
            </div>
            <div className="profile-avatar-dark">
                <img src={user.picture} alt={`${user.name}'s Avatar`} className="avatar-img-dark" />
            </div>
        </div>
    );
};

export default Profile;
