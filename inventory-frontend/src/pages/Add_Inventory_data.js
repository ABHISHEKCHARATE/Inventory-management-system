import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Base from './base';

const AddInventoryData = () => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        quantity: '',
        price: '',
        supplier: '',
        expiration_date: '',
        threshold: 5, // Default threshold value
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Ensure the inventory item is saved first
    try {
        const authToken = localStorage.getItem('authToken'); // Ensure auth token is present
        if (!authToken) {
            setError('Authentication token missing.');
            return;
        }

        // Debugging the form data
        console.log('Form data being submitted:', formData);

        const response = await fetch('http://127.0.0.1:8000/api/inventory-items/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            setSuccess(true);
            setFormData({
                name: '',
                sku: '',
                quantity: '',
                price: '',
                supplier: '',
                expiration_date: '',
                threshold: 5, // Reset threshold to default
            });
            console.log('Inventory item saved successfully.');

            // Now check if threshold is less than 5 and trigger StockAlert API
            if (formData.threshold < 5) {
                try {
                    const alertResponse = await fetch('http://127.0.0.1:8000/api/stock-alert/', {
                        method: 'GET', // Assuming the API uses GET for stock alert
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                        },
                    });

                    if (alertResponse.ok) {
                        const data = await alertResponse.json();
                        console.log('Stock alert response:', data);
                        setError('');
                    } else {
                        const data = await alertResponse.json();
                        console.error('Error response from stock alert API:', data);
                        setError(data.detail || 'Failed to send stock alert.');
                    }
                } catch (err) {
                    console.error('Error connecting to the stock alert API:', err);
                    setError('Error connecting to the stock alert API.');
                }
            }

            // Redirect after success (optional)
            navigate('/dashboard');
        } else {
            const data = await response.json();
            console.error('Error response data:', data);
            setError(data.detail || 'Failed to add inventory item.');
        }
    } catch (err) {
        console.error('Error connecting to the server:', err);
        setError('Error connecting to the server.');
    }
};







    return (
        <Base>
            <div className="main-container" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
                <div className="pd-ltr-20">
                    <h4 style={{ color: '#3b3b3b', marginBottom: '20px' }}>Add Inventory Data</h4>

                    {success && (
                        <div style={{ color: 'green', marginBottom: '20px' }}>Inventory item added successfully!</div>
                    )}
                    {error && (
                        <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label>SKU:</label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Quantity:</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Price:</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Supplier:</label>
                            <input
                                type="text"
                                name="supplier"
                                value={formData.supplier}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Expiration Date:</label>
                            <input
                                type="date"
                                name="expiration_date"
                                value={formData.expiration_date}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Threshold:</label>
                            <input
                                type="number"
                                name="threshold"
                                value={formData.threshold}
                                onChange={handleChange}
                                min="1"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Add Item
                        </button>
                    </form>
                </div>
            </div>
        </Base>
    );
};

export default AddInventoryData;
