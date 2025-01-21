import React, { useEffect, useState } from 'react';
import Base from './base';

const Dashboard = () => {
    const [username, setUsername] = useState('');
    const [inventoryItems, setInventoryItems] = useState([]);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    // Fetch username from localStorage
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername || 'User');
    }, []);

    // Fetch inventory data from the API with authentication
    useEffect(() => {
        const fetchInventoryItems = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                if (!authToken) {
                    console.error('No auth token found.');
                    return;
                }

                const response = await fetch(`http://127.0.0.1:8000/api/inventory-items/?page=${page}&search=${searchQuery}`, {
                    headers: {
                        "Authorization": `Bearer ${authToken}`
                    }
                });
                const data = await response.json();
                console.log('API Response:', data);
                if (data.results) {
                    setInventoryItems(data.results);
                    setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 items per page
                } else {
                    console.error('Unexpected API response format:', data);
                }
            } catch (error) {
                console.error('Error fetching inventory items:', error);
            }
        };

        fetchInventoryItems();
    }, [page, searchQuery]);

    // Handle page change for pagination
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    // Handle search input changes
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1); // Reset to page 1 on new search
    };

    // Generate and download CSV file
    const handleDownloadCSV = () => {
        const headers = ['Name', 'SKU', 'Quantity', 'Price', 'Supplier', 'Expiration Date'];
        const csvContent = [
            headers.join(','), // Add headers
            ...inventoryItems.map(item =>
                [
                    item.name,
                    item.sku,
                    item.quantity,
                    item.price,
                    item.supplier,
                    item.expiration_date || 'N/A'
                ].join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'inventory_data.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Base>
            <div className="main-container" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
                <div className="pd-ltr-20">
                    <h4 style={{ color: '#3b3b3b', marginBottom: '20px' }}>Search bar</h4>

                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search Inventory"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={{
                            marginBottom: '20px',
                            padding: '10px',
                            width: '100%',
                            maxWidth: '400px',
                            borderRadius: '5px',
                            border: '1px solid #ddd',
                            boxSizing: 'border-box'
                        }}
                    />

                    {/* Download Button */}
                    <button
                        onClick={handleDownloadCSV}
                        className="btn btn-success"
                        style={{
                            marginBottom: '20px',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Download Data
                    </button>

                    <div className="card-box pd-20 height-100-p mb-30">
                        <div className="row align-items-center">
                            <div className="container" style={{ overflowX: 'auto' }}></div>
                        </div>
                    </div>

                    <div className="card-box pd-20 height-100-p mb-30">
                        <div className="row align-items-center">
                            <div className="container" style={{ overflowX: 'auto' }}>
                                {/* Inventory Items Table */}
                                <table className="table table-striped" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                                    <thead style={{ backgroundColor: '#f4f4f4' }}>
                                        <tr>
                                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>SKU</th>
                                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Quantity</th>
                                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Price</th>
                                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Supplier</th>
                                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Expiration Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventoryItems.length > 0 ? (
                                            inventoryItems.map((item) => (
                                                <tr key={item.id} style={{ backgroundColor: '#fff', borderBottom: '1px solid #ddd' }}>
                                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.name}</td>
                                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.sku}</td>
                                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.quantity}</td>
                                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>${item.price}</td>
                                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.supplier}</td>
                                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.expiration_date || 'N/A'}</td>
                                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                        <button
                                                            onClick={() => window.location.href = `/update-inventory/${item.id}`}
                                                            className="btn btn-primary"
                                                            style={{ marginRight: '10px' }}
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            onClick={() => window.location.href = `/delete-inventory/${item.id}`}
                                                            className="btn btn-danger"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center" style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                    No inventory items found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        className="btn btn-primary"
                                        style={{
                                            padding: '10px 20px',
                                            marginRight: '10px',
                                            borderRadius: '5px',
                                            backgroundColor: '#007bff',
                                            color: '#fff',
                                            border: 'none',
                                            cursor: page === 1 ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Previous
                                    </button>
                                    <span style={{ margin: '0 10px', alignSelf: 'center', fontWeight: 'bold' }}>
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages}
                                        className="btn btn-primary"
                                        style={{
                                            padding: '10px 20px',
                                            marginLeft: '10px',
                                            borderRadius: '5px',
                                            backgroundColor: '#007bff',
                                            color: '#fff',
                                            border: 'none',
                                            cursor: page === totalPages ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Base>
    );
};

export default Dashboard;
