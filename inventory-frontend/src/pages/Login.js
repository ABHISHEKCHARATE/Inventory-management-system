import React, { useState } from 'react';
import axios from 'axios';
import '../styles/core.css';
import '../styles/icon-font.min.css';
import '../styles/style.css';
import logo from '../images/deskapp-logo.svg';
import loginImage from '../images/login-page-img.png';

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        console.log('Username:', username);
        console.log('Password:', password);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', {
                username: username,
                password: password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Log the response to check what you get
            console.log('Response:', response);

            // Check if the response contains the access token
            if (response.data.access) {
                alert('Login successful!');
                localStorage.setItem('authToken', response.data.access);  // Store the access token
                localStorage.setItem('username', username);  // Store the username
                window.location.href = "/dash";  // Redirect to dashboard on success
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            // If there's an error, show the error message
            console.error('Login error:', err);
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-header box-shadow">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <div className="brand-logo">
                        <a href="/login">
                            <img src={logo} alt="Logo" />
                        </a>
                    </div>
                    <div className="login-menu">
                        <ul>
                            <li><a href="http://localhost:8000/admin/">Admin login</a></li>
                        </ul>
                    </div>
                    <div className="login-menu">
                        <ul>
                            <li>
                                <a href="/register">Register</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="login-wrap d-flex align-items-center flex-wrap justify-content-center">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 col-lg-7">
                            <img
                                src={loginImage}
                                alt="Login"
                                className="img-fluid"
                            />
                        </div>
                        <div className="col-md-6 col-lg-5">
                            <div className="login-box bg-white box-shadow border-radius-10">
                                <div className="login-title">
                                    <h2 className="text-center text-primary">Login To DeskApp</h2>
                                </div>
                                <form onSubmit={handleLogin}>
                                    <div className="input-group custom">
                                        <input
                                            type="text"
                                            id="username"  // This will now be the username field
                                            name="username"
                                            className="form-control form-control-lg"
                                            placeholder="Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}  // Update 'username' on input change
                                            required
                                        />
                                        <div className="input-group-append custom">
                                            <span className="input-group-text">
                                                <i className="icon-copy dw dw-user1"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="input-group custom">
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            className="form-control form-control-lg"
                                            placeholder="**********"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <div className="input-group-append custom">
                                            <span className="input-group-text">
                                                <i className="dw dw-padlock1"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="row pb-30">
                                        <div className="col-6">
                                            <div className="custom-control custom-checkbox">
                                                <input
                                                    type="checkbox"
                                                    className="custom-control-input"
                                                    id="customCheck1"
                                                />
                                                <label
                                                    className="custom-control-label"
                                                    htmlFor="customCheck1"
                                                >
                                                    Remember
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="forgot-password">
                                                <a href="/forgot-password">Forgot Password</a>
                                            </div>
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="alert alert-danger mt-3">{error}</div>
                                    )}
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="input-group mb-0">
                                                <button
                                                    className="btn btn-primary btn-lg btn-block"
                                                    type="submit"
                                                >
                                                    Sign In
                                                </button>
                                            </div>
                                            <div
                                                className="font-16 weight-600 pt-10 pb-10 text-center"
                                                data-color="#707373"
                                            >
                                                OR
                                            </div>
                                            <div className="input-group mb-0">
                                                <a
                                                    className="btn btn-outline-primary btn-lg btn-block"
                                                    href="/register"
                                                >
                                                    Register To Create Account
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <script src="../scripts/core.js"></script>
            <script src="../scripts/script.min.js"></script>
            <script src="../scripts/process.js"></script>
            <script src="../scripts/layout-settings.js"></script>
        </div>
    );
}

export default App;
