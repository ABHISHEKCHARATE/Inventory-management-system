import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Base from './base'; // Import Base component for consistent layout or styling

const UpdateInventoryData = () => {
    const { id } = useParams(); // Use useParams to get the ID from the URL
    const [item, setItem] = useState({
        name: '',
        sku: '',
        quantity: '',
        price: '',
        supplier: '',
        expiration_date: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            const authToken = localStorage.getItem('authToken');
            setLoading(true);

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/inventory-items/${id}/`, {
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setItem(data);
                } else {
                    setError('Item not found');
                }
            } catch (error) {
                setError('Error fetching item details');
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]); // Depend on `id` instead of `match.params`

    const handleSubmit = async (event) => {
        event.preventDefault();
        const authToken = localStorage.getItem('authToken');
        setLoading(true);

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/inventory-items/${id}/update/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(item),
            });

            if (response.ok) {
                window.location.href = '/dashboard'; // Redirect back to dashboard
            } else {
                setError('Failed to update item');
            }
        } catch (error) {
            setError('Error updating item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Base>
            <div style={styles.container}>
                <h3 style={styles.title}>Update Inventory Item</h3>
                {error && <p style={styles.error}>{error}</p>}
                {loading && <p style={styles.loading}>Loading...</p>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Name</label>
                        <input
                            type="text"
                            value={item.name}
                            onChange={(e) => setItem({ ...item, name: e.target.value })}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>SKU</label>
                        <input
                            type="text"
                            value={item.sku}
                            onChange={(e) => setItem({ ...item, sku: e.target.value })}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Quantity</label>
                        <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => setItem({ ...item, quantity: e.target.value })}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Price</label>
                        <input
                            type="number"
                            value={item.price}
                            onChange={(e) => setItem({ ...item, price: e.target.value })}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Supplier</label>
                        <input
                            type="text"
                            value={item.supplier}
                            onChange={(e) => setItem({ ...item, supplier: e.target.value })}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Expiration Date</label>
                        <input
                            type="date"
                            value={item.expiration_date}
                            onChange={(e) => setItem({ ...item, expiration_date: e.target.value })}
                            style={styles.input}
                        />
                    </div>
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                </form>
            </div>
        </Base>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '24px',
        color: '#333',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: '15px',
    },
    loading: {
        color: 'blue',
        textAlign: 'center',
        marginBottom: '15px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '8px',
        fontSize: '16px',
        color: '#555',
    },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '16px',
    },
    button: {
        padding: '12px',
        borderRadius: '5px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        fontSize: '16px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default UpdateInventoryData;
