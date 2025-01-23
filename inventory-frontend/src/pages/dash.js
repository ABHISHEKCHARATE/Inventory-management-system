import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import Base from './base';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Dash = () => {
    const [username, setUsername] = useState('');
    const [inventoryStats, setInventoryStats] = useState({
        total_items: 0,
        low_stock_items: 0,
        total_stock_value: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername || 'User');
    }, []);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                if (!authToken) {
                    setError('Authentication token missing. Please log in again.');
                    return;
                }

                setLoading(true);
                setError('');

                const response = await fetch(`http://127.0.0.1:8000/api/dashboard/`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setError(errorData.detail || 'Failed to fetch dashboard data.');
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setInventoryStats({
                    total_items: data.total_items || 0,
                    low_stock_items: data.low_stock_items || 0,
                    total_stock_value: data.total_stock_value || 0,
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                setError('Error connecting to the server. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    // Bar Chart Data
    const barData = {
        labels: ['Total Items', 'Low Stock Items', 'Total Stock Value'],
        datasets: [
            {
                label: 'Inventory Statistics',
                data: [
                    inventoryStats.total_items,
                    inventoryStats.low_stock_items,
                    inventoryStats.total_stock_value,
                ],
                backgroundColor: ['#007bff', '#dc3545', '#28a745'],
            },
        ],
    };

    // Pie Chart Data
    const pieData = {
        labels: ['Low Stock Items', 'Other Items'],
        datasets: [
            {
                data: [
                    inventoryStats.low_stock_items,
                    inventoryStats.total_items - inventoryStats.low_stock_items,
                ],
                backgroundColor: ['#dc3545', '#28a745'],
            },
        ],
    };

    return (
        <Base>
            <div className="main-container" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
                <div className="pd-ltr-20">
                    <h4 style={{ color: '#3b3b3b', marginBottom: '20px' }}>Dashboard Summary</h4>

                    {loading ? (
                        <p>Loading dashboard data...</p>
                    ) : error ? (
                        <p style={{ color: 'red' }}>{error}</p>
                    ) : (
                        <>
                            <div className="row">
                                {/* Total Items Card */}
                                <div className="col-md-4">
                                    <div className="card" style={cardStyle}>
                                        <div className="card-body">
                                            <h5 className="card-title" style={cardTitleStyle}>Total Items</h5>
                                            <p className="card-text" style={cardTextStyle}>
                                                {inventoryStats.total_items}
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
                                                {inventoryStats.low_stock_items}
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
                                                ${inventoryStats.total_stock_value.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts Section */}
                            <div style={{ marginTop: '30px' }}>
                                <h5 style={{ marginBottom: '20px' }}>Data Visualization</h5>
                                <div className="row">
                                    {/* Bar Chart */}
                                    <div className="col-md-6">
                                        <h6>Inventory Statistics (Bar Chart)</h6>
                                        <Bar data={barData} />
                                    </div>

                                    {/* Pie Chart */}
                                    <div className="col-md-6">
                                        <h6>Low Stock vs Other Items (Pie Chart)</h6>
                                        <Pie data={pieData} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
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

export default Dash;
