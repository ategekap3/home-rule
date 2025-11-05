import React from "react";

const ProfileCard = ({ student }) => (
  <div className="profile-card">
    <h2>Profile</h2>
    <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
    <p><strong>Email:</strong> {student.email}</p>
    <p><strong>Phone:</strong> {student.phone}</p>
  </div>
);

export default ProfileCard;
