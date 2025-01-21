import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Base from './base';  // Make sure the path is correct

const Dash = () => {
    const [username, setUsername] = useState('');
    const [inventoryStats, setInventoryStats] = useState({
        total_items: 0,
        low_stock_items: 0,
        total_stock_value: 0,
    });

    // Fetch username from localStorage
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername || 'User');
    }, []);

    // Fetch summary statistics from the API
    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                
                const response = await fetch(`http://127.0.0.1:8000/api/dashboard/`, {
                    headers: {
                        "Authorization": `Bearer ${authToken}`
                    }
                });
                const data = await response.json();
                console.log('API Response:', data);
                setInventoryStats(data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };

        fetchDashboardStats();
    }, []);

    return (
        <Base>
            <div className="main-container" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
                <div className="pd-ltr-20">
                    <h4 style={{ color: '#3b3b3b', marginBottom: '20px' }}>Dashboard Summary</h4>
                    <div className="row">
                        {/* Total Items Card */}
                        <div className="col-md-4">
                            <div className="card" style={cardStyle}>
                                <div className="card-body">
                                    <h5 className="card-title" style={cardTitleStyle}>Total Items</h5>
                                    <p className="card-text" style={cardTextStyle}>
                                        {inventoryStats.total_items || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Low Stock Items Card */}
                        <div className="col-md-4">
                            <div className="card" style={cardStyle}>
                                <div className="card-body">
                                    <h5 className="card-title" style={cardTitleStyle}>Low Stock Items</h5>
                                    <p className="card-text" style={cardTextStyle}>
                                        {inventoryStats.low_stock_items || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Total Stock Value Card */}
                        <div className="col-md-4">
                            <div className="card" style={cardStyle}>
                                <div className="card-body">
                                    <h5 className="card-title" style={cardTitleStyle}>Total Stock Value</h5>
                                    <p className="card-text" style={cardTextStyle}>
                                        ${inventoryStats.total_stock_value?.toFixed(2) || '0.00'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Base>
    );
};


// Card styles
const cardStyle = {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
};

const cardTitleStyle = {
    fontWeight: 'bold',
    color: '#333333',
};

const cardTextStyle = {
    fontSize: '24px',
    color: '#007bff',
};

// Chart styles for visualization (dummy data bars)
const chartContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '200px',
    marginTop: '20px',
};

const chartBarStyle = (height) => ({
    width: '30%',
    height: `${height}%`,
    backgroundColor: '#4caf50',
    borderRadius: '5px',
});

export default Dash;
