import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('access_token'); // Check if user is authenticated

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" />;
    }

    return children; // If authenticated, show the children (Dashboard)
};

export default ProtectedRoute;
