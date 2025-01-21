// import React, { useEffect, useState } from 'react';
// import Base from './base';
// const Dashboard = () => {
//     const [username, setUsername] = useState('');
//     const [inventoryItems, setInventoryItems] = useState([]);
//     const [page, setPage] = useState(1);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [totalPages, setTotalPages] = useState(1);

//     // Fetch username from localStorage
//     useEffect(() => {
//         const storedUsername = localStorage.getItem('username');
//         setUsername(storedUsername || 'User');
//     }, []);

//     // Fetch inventory data from the API
//     useEffect(() => {
//         const fetchInventoryItems = async () => {
//             try {
//                 const response = await fetch(`http://127.0.0.1:8000/api/inventory-items/?page=${page}&search=${searchQuery}`);
//                 const data = await response.json();
//                 console.log('API Response:', data);
//                 if (data.results) {
//                     setInventoryItems(data.results);
//                     setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 items per page
//                 } else {
//                     console.error('Unexpected API response format:', data);
//                 }
//             } catch (error) {
//                 console.error('Error fetching inventory items:', error);
//             }
//         };

//         fetchInventoryItems();
//     }, [page, searchQuery]);

//     // Fetch inventory data with authorization headers
//     useEffect(() => {
//         const fetchInventoryItemsWithAuth = async () => {
//             try {
//                 const authToken = localStorage.getItem('authToken');
//                 const response = await fetch(`http://127.0.0.1:8000/api/inventory-items/`, {
//                     headers: {
//                         "Authorization": `Bearer ${authToken}`
//                     }
//                 });
//                 const data = await response.json();
//                 console.log('API Response:', data);
//                 if (data.results) {
//                     setInventoryItems(data.results);
//                     setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 items per page
//                 } else {
//                     console.error('Unexpected API response format:', data);
//                 }
//             } catch (error) {
//                 console.error('Error fetching inventory items with auth:', error);
//             }
//         };

//         fetchInventoryItemsWithAuth();
//     }, []);

//     // Handle page change for pagination
//     const handlePageChange = (newPage) => {
//         if (newPage > 0 && newPage <= totalPages) {
//             setPage(newPage);
//         }
//     };

//     // Handle search input changes
//     const handleSearchChange = (event) => {
//         setSearchQuery(event.target.value);
//         setPage(1); // Reset to page 1 on new search
//     };

//     return (
//         <Base>
//             <div className="main-container" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
//                 <div className="pd-ltr-20">
//                     <h4 style={{ color: '#3b3b3b', marginBottom: '20px' }}>Search bar</h4>

//                     {/* Search Bar */}
//                     <input
//                         type="text"
//                         placeholder="Search Inventory"
//                         value={searchQuery}
//                         onChange={handleSearchChange}
//                         style={{
//                             marginBottom: '20px',
//                             padding: '10px',
//                             width: '100%',
//                             maxWidth: '400px',
//                             borderRadius: '5px',
//                             border: '1px solid #ddd',
//                             boxSizing: 'border-box'
//                         }}
//                     />
//                     <div className="card-box pd-20 height-100-p mb-30">
//                         <div className="row align-items-center">
//                             <div className="container" style={{ overflowX: 'auto' }}></div>



//                         </div>
//                     </div>

//                     <div className="card-box pd-20 height-100-p mb-30">
//                         <div className="row align-items-center">
//                             <div className="container" style={{ overflowX: 'auto' }}>
//                                 {/* Inventory Items Table */}
//                                 <table className="table table-striped" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
//                                     <thead style={{ backgroundColor: '#f4f4f4' }}>
//                                         <tr>
//                                             <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
//                                             <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>SKU</th>
//                                             <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Quantity</th>
//                                             <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Price</th>
//                                             <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Supplier</th>
//                                             <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Expiration Date</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {inventoryItems.length > 0 ? (
//                                             inventoryItems.map((item) => (
//                                                 <tr key={item.id} style={{ backgroundColor: '#fff', borderBottom: '1px solid #ddd' }}>
//                                                     <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.name}</td>
//                                                     <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.sku}</td>
//                                                     <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.quantity}</td>
//                                                     <td style={{ padding: '10px', border: '1px solid #ddd' }}>${item.price}</td>
//                                                     <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.supplier}</td>
//                                                     <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.expiration_date || 'N/A'}</td>
//                                                 </tr>
//                                             ))
//                                         ) : (
//                                             <tr>
//                                                 <td colSpan="6" className="text-center" style={{ padding: '10px', border: '1px solid #ddd' }}>
//                                                     No inventory items found.
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </table>

//                                 {/* Pagination */}
//                                 <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
//                                     <button
//                                         onClick={() => handlePageChange(page - 1)}
//                                         disabled={page === 1}
//                                         className="btn btn-primary"
//                                         style={{
//                                             padding: '10px 20px',
//                                             marginRight: '10px',
//                                             borderRadius: '5px',
//                                             backgroundColor: '#007bff',
//                                             color: '#fff',
//                                             border: 'none',
//                                             cursor: page === 1 ? 'not-allowed' : 'pointer'
//                                         }}
//                                     >
//                                         Previous
//                                     </button>
//                                     <span style={{ margin: '0 10px', alignSelf: 'center', fontWeight: 'bold' }}>
//                                         Page {page} of {totalPages}
//                                     </span>
//                                     <button
//                                         onClick={() => handlePageChange(page + 1)}
//                                         disabled={page === totalPages}
//                                         className="btn btn-primary"
//                                         style={{
//                                             padding: '10px 20px',
//                                             marginLeft: '10px',
//                                             borderRadius: '5px',
//                                             backgroundColor: '#007bff',
//                                             color: '#fff',
//                                             border: 'none',
//                                             cursor: page === totalPages ? 'not-allowed' : 'pointer'
//                                         }}
//                                     >
//                                         Next
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </Base>
//     );
// };

// export default Dashboard;


// const Dash = () => {
//     const [username, setUsername] = useState('');
//     const [inventoryStats, setInventoryStats] = useState({
//         total_items: 0,
//         low_stock_items: 0,
//         total_stock_value: 0,
//     });

//     // Fetch username from localStorage
//     useEffect(() => {
//         const storedUsername = localStorage.getItem('username');
//         setUsername(storedUsername || 'User');
//     }, []);

//     // Fetch summary statistics from the API
//     useEffect(() => {
//         const fetchDashboardStats = async () => {
//             try {
//                 const response = await fetch('http://127.0.0.1:8000/api/dashboard/');
//                 const data = await response.json();
//                 console.log('API Response:', data);
//                 setInventoryStats(data);
//             } catch (error) {
//                 console.error('Error fetching dashboard stats:', error);
//             }
//         };

//         fetchDashboardStats();
//     }, []);

//     return (
//         <Base>
//             <div className="main-container" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
//                 <div className="pd-ltr-20">
//                     <h4 style={{ color: '#3b3b3b', marginBottom: '20px' }}>Dashboard Summary</h4>
//                     <div className="row">
//                         {/* Total Items Card */}
//                         <div className="col-md-4">
//                             <div className="card" style={cardStyle}>
//                                 <div className="card-body">
//                                     <h5 className="card-title" style={cardTitleStyle}>Total Items</h5>
//                                     <p className="card-text" style={cardTextStyle}>{inventoryStats.total_items}</p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Low Stock Items Card */}
//                         <div className="col-md-4">
//                             <div className="card" style={cardStyle}>
//                                 <div className="card-body">
//                                     <h5 className="card-title" style={cardTitleStyle}>Low Stock Items</h5>
//                                     <p className="card-text" style={cardTextStyle}>{inventoryStats.low_stock_items}</p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Total Stock Value Card */}
//                         <div className="col-md-4">
//                             <div className="card" style={cardStyle}>
//                                 <div className="card-body">
//                                     <h5 className="card-title" style={cardTitleStyle}>Total Stock Value</h5>
//                                     <p className="card-text" style={cardTextStyle}>${inventoryStats.total_stock_value.toFixed(2)}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Visualization Section */}
//                     <div style={{ marginTop: '30px' }}>
//                         <h5>Stock Visualization</h5>
//                         {/* You can use libraries like Chart.js or any other to show visualization */}
//                         {/* Example for a simple bar chart using inline styles */}
//                         <div style={chartContainerStyle}>
//                             <div style={chartBarStyle(50)} />
//                             <div style={chartBarStyle(30)} />
//                             <div style={chartBarStyle(80)} />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </Base>
//     );
// };

// // Card styles
// const cardStyle = {
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//     borderRadius: '8px',
//     marginBottom: '20px',
//     backgroundColor: '#ffffff',
// };

// const cardTitleStyle = {
//     fontWeight: 'bold',
//     color: '#333333',
// };

// const cardTextStyle = {
//     fontSize: '24px',
//     color: '#007bff',
// };

// // Chart styles for visualization (dummy data bars)
// const chartContainerStyle = {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'flex-end',
//     height: '200px',
//     marginTop: '20px',
// };

// const chartBarStyle = (height) => ({
//     width: '30%',
//     height: `${height}%`,
//     backgroundColor: '#4caf50',
//     borderRadius: '5px',
// });

// export default Dash;
