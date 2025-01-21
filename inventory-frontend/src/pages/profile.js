import React, { useEffect, useState } from "react";
import Base from "./base"; // Importing the Base component

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem("authToken"); // Replace with your token storage logic
                const response = await fetch("http://localhost:8000/api/profile/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProfileData(data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch profile data");
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const containerStyle = {
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        fontFamily: "'Arial', sans-serif",
    };

    const titleStyle = {
        textAlign: "center",
        marginBottom: "20px",
        color: "#333",
        textTransform: "uppercase",
        letterSpacing: "2px",
    };

    const textStyle = {
        margin: "10px 0",
        fontSize: "16px",
        color: "#555",
    };

    const errorStyle = {
        color: "red",
        textAlign: "center",
        fontWeight: "bold",
    };

    if (loading) {
        return <div style={{ textAlign: "center" }}>Loading...</div>;
    }

    if (error) {
        return <div style={errorStyle}>{error}</div>;
    }

    return (
        <Base>
            <div style={containerStyle}>
                <h1 style={titleStyle}>User Profile</h1>
                {profileData && (
                    <div>
                        <p style={textStyle}>
                            <strong>Username:</strong> {profileData.username}
                        </p>
                        <p style={textStyle}>
                            <strong>Full Name:</strong> {profileData.full_name}
                        </p>
                        <p style={textStyle}>
                            <strong>Email:</strong> {profileData.email}
                        </p>
                        <p style={textStyle}>
                            <strong>Phone Number:</strong>{" "}
                            {profileData.phone_number || "N/A"}
                        </p>
                        <p style={textStyle}>
                            <strong>Address:</strong> {profileData.address || "N/A"}
                        </p>
                        <p style={textStyle}>
                            <strong>Role:</strong> {profileData.role}
                        </p>
                    </div>
                )}
            </div>
        </Base>
    );
};

export default Profile;
