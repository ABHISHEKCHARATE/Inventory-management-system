import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import Dash from './pages/dash';
import AddInventoryData from './pages/Add_Inventory_data';
import UpdateInventoryData from './pages/update_inventory_data';
import DeleteInventoryData from './pages/delete_inventory_data';
import DownloadInventoryData from './pages/DownloadInventoryData';
import Profile from "./pages/profile";

function App() {
  return (
    <Router>
      <div>
        <h1>Inventory Management System</h1>
        <Routes>
          
          <Route path="/" element={<Login />} /> {/* Login page */}
          <Route path="/register" element={<Register />} /> {/* Register page */}
          <Route path="/dash" element={<Dash />} /> {/* Route for Dash */}  {/* Example Dash page */}
          {/* Protected Route for Dashboard */}
          <Route path="/add-inventory-data" element={<AddInventoryData />} />
          <Route path="/download-inventory" element={<DownloadInventoryData />} />

          <Route path="/update-inventory/:id" element={<UpdateInventoryData />} />
          <Route path="/delete-inventory/:id" element={<DeleteInventoryData />} />
          <Route path="/profile" element={<Profile />} /> {/* Profile Page */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard /> {/* Dashboard should only be accessible if protected */}
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
