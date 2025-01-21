import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Base from './base';

const DeleteInventoryData = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            const authToken = localStorage.getItem('authToken');

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/inventory-items/${id}/`, {
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setItem(data);
                    setLoading(false);
                } else {
                    setError('Item not found');
                    setLoading(false);
                }
            } catch (error) {
                setError('Error fetching item details');
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]); // Re-run when 'id' changes

    const handleDelete = async () => {
        const authToken = localStorage.getItem('authToken');

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/inventory-items/${id}/delete/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                // If deletion is successful, remove the item from the state
                setItem(null);  // Item is deleted, so set it to null
                navigate('/dashboard');  // Redirect to the dashboard
            } else {
                setError('Failed to delete item');
            }
        } catch (error) {
            setError('Error deleting item');
        }
    };

    return (
        <Base>
            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <h3 style={{ color: '#333' }}>Delete Inventory Item</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {item && (
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '18px', color: '#555' }}>
                                    Are you sure you want to delete the item "{item.name}"?
                                </p>
                                <div>
                                    <button
                                        onClick={handleDelete}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            marginRight: '10px',
                                        }}
                                    >
                                        Yes, Delete
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Base>
    );
};

export default DeleteInventoryData;
