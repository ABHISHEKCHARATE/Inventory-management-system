import React, { useState } from 'react';
import '../styles/core.css';
import '../styles/icon-font.min.css';
import '../styles/style.css';
import logo from '../images/deskapp-logo.svg';
import loginImage from '../images/login-page-img.png';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        full_name: '',
        password: '',
        address: '',
        phone_number: '',
        role: 'viewer',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form's default submission behavior
        setIsSubmitting(true); // Show a loading indicator
        setSubmissionError(null); // Clear any previous errors

        const payload = { ...formData }; // Collect form data into the payload

        try {
            // Make the API call
            const response = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify JSON format
                },
                body: JSON.stringify(payload), // Convert payload to JSON string
            });

            if (response.ok) {
                // If successful, navigate to the home page
                navigate('/');
            } else {
                // If response is not OK, handle errors
                const errorData = await response.json();

                // Log error details for debugging
                console.error("API Error:", errorData);

                // Handle specific errors or show a generic message
                setSubmissionError(errorData?.message || errorData?.detail || 'Registration failed');
            }
        } catch (error) {
            // Log unexpected errors
            console.error("Unexpected Error:", error);

            // Set a user-friendly error message
            setSubmissionError('Something went wrong. Please try again later.');
        } finally {
            // Stop loading indicator
            setIsSubmitting(false);
        }
    };


    const handleNext = () => setStep((prev) => prev + 1);
    const handlePrevious = () => setStep((prev) => prev - 1);
    return (
        <div>
            <div className="login-header box-shadow">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <div className="brand-logo">
                        <a href="/login">
                            <img src={logo} alt="DeskApp Logo" />
                        </a>
                    </div>
                    <div className="login-menu">
                        <ul>
                            <li><a href="http://localhost:8000/admin/">Admin login</a></li>
                        </ul>
                    </div>
                    <div className="login-menu">
                        <ul>
                            <li><a href="/">Login</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="register-page-wrap d-flex align-items-center flex-wrap justify-content-center">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 col-lg-7">
                            <img src={loginImage} alt="Login Illustration" />
                        </div>
                        <div className="col-md-6 col-lg-5">
                            <div className="register-box bg-white box-shadow border-radius-10">
                                <div className="wizard-content">
                                    <form
                                        className="tab-wizard2 wizard-circle wizard"
                                        id="registrationForm"
                                        method="POST"
                                        onSubmit={handleSubmit}
                                        style={{ maxWidth: '700px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}
                                    >
                                        {/* Step 1: Account Information */}
                                        {step === 1 && (
                                            <section className="form-section" id="section-1" style={{ display: 'block' }}>
                                                <div className="form-wrap" style={{ maxWidth: '600px', margin: '0 auto' }}>
                                                    <div className="form-group row" style={{ marginBottom: '15px' }}>
                                                        <label className="col-sm-4 col-form-label" style={{ fontWeight: 'bold' }}>Email Address*</label>
                                                        <div className="col-sm-8">
                                                            <input
                                                                type="email"
                                                                className="form-control"
                                                                name="email"
                                                                required
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                                style={{ padding: '8px', fontSize: '14px' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row" style={{ marginBottom: '15px' }}>
                                                        <label className="col-sm-4 col-form-label" style={{ fontWeight: 'bold' }}>Username*</label>
                                                        <div className="col-sm-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="username"
                                                                required
                                                                value={formData.username}
                                                                onChange={handleChange}
                                                                style={{ padding: '8px', fontSize: '14px' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row" style={{ marginBottom: '15px' }}>
                                                        <label className="col-sm-4 col-form-label" style={{ fontWeight: 'bold' }}>Password*</label>
                                                        <div className="col-sm-8">
                                                            <input
                                                                type="password"
                                                                className="form-control"
                                                                name="password"
                                                                required
                                                                value={formData.password}
                                                                onChange={handleChange}
                                                                style={{ padding: '8px', fontSize: '14px' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row" style={{ marginBottom: '15px' }}>
                                                        <label className="col-sm-4 col-form-label" style={{ fontWeight: 'bold' }}>Address*</label>
                                                        <div className="col-sm-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="address"
                                                                required
                                                                value={formData.address}
                                                                onChange={handleChange}
                                                                style={{ padding: '8px', fontSize: '14px' }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="form-wrap" style={{ textAlign: 'center', marginTop: '20px' }}>
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary"
                                                            id="next-1"
                                                            style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white' }}
                                                            onClick={handleNext}
                                                        >
                                                            Next
                                                        </button>
                                                    </div>
                                                </div>
                                            </section>
                                        )}

                                        {/* Step 2: Personal Information */}
                                        {step === 2 && (
                                            <section className="form-section" id="section-2" style={{ display: 'block' }}>
                                                <div className="form-wrap" style={{ maxWidth: '600px', margin: '0 auto' }}>
                                                    <div className="form-group row" style={{ marginBottom: '15px' }}>
                                                        <label className="col-sm-4 col-form-label" style={{ fontWeight: 'bold' }}>Phone Number</label>
                                                        <div className="col-sm-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="phone_number"
                                                                required
                                                                value={formData.phone_number}
                                                                onChange={handleChange}
                                                                style={{ padding: '8px', fontSize: '14px' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row" style={{ marginBottom: '15px' }}>
                                                        <label className="col-sm-4 col-form-label" style={{ fontWeight: 'bold' }}>Full Name*</label>
                                                        <div className="col-sm-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="full_name"
                                                                required
                                                                value={formData.full_name}
                                                                onChange={handleChange}
                                                                style={{ padding: '8px', fontSize: '14px' }}
                                                            />
                                                        </div>
                                                    </div>


                                                    {/* Role Dropdown */}
                                                    <div className="form-group row" style={{ marginBottom: '15px' }}>
                                                        <label className="col-sm-4 col-form-label" style={{ fontWeight: 'bold' }}>Role*</label>
                                                        <div className="col-sm-8">
                                                            <select
                                                                className="form-control"
                                                                name="role"
                                                                required
                                                                value={formData.role}
                                                                onChange={handleChange}
                                                                style={{ padding: '8px', fontSize: '14px' }}
                                                            >
                                                                <option value="viewer">Viewer</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="form-wrap" style={{ textAlign: 'center', marginTop: '20px' }}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        id="previous-2"
                                                        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white' }}
                                                        onClick={handlePrevious}
                                                    >
                                                        Previous
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        id="next-2"
                                                        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white' }}
                                                        onClick={handleNext}
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </section>
                                        )}

                                        {/* Step 3: Overview Information */}
                                        {step === 3 && (
                                            <section className="form-section" id="section-3" style={{ display: 'block' }}>
                                                <div className="form-wrap" style={{ maxWidth: '600px', margin: '0 auto' }}>
                                                    <ul className="register-info" style={{ listStyleType: 'none', padding: '0' }}>
                                                        <li style={{ marginBottom: '15px' }}>
                                                            <div className="row">
                                                                <div className="col-sm-4" style={{ fontWeight: 'bold' }}>Email Address</div>
                                                                <div className="col-sm-8">{formData.email}</div>
                                                            </div>
                                                        </li>
                                                        <li style={{ marginBottom: '15px' }}>
                                                            <div className="row">
                                                                <div className="col-sm-4" style={{ fontWeight: 'bold' }}>Username</div>
                                                                <div className="col-sm-8">{formData.username}</div>
                                                            </div>
                                                        </li>
                                                        <li style={{ marginBottom: '15px' }}>
                                                            <div className="row">
                                                                <div className="col-sm-4" style={{ fontWeight: 'bold' }}>Full Name</div>
                                                                <div className="col-sm-8">{formData.full_name}</div>
                                                            </div>
                                                        </li>
                                                        <li style={{ marginBottom: '15px' }}>
                                                            <div className="row">
                                                                <div className="col-sm-4" style={{ fontWeight: 'bold' }}>Address</div>
                                                                <div className="col-sm-8">{formData.address}</div>
                                                            </div>
                                                        </li>
                                                        <li style={{ marginBottom: '15px' }}>
                                                            <div className="row">
                                                                <div className="col-sm-4" style={{ fontWeight: 'bold' }}>Phone Number</div>
                                                                <div className="col-sm-8">{formData.phone_number}</div>
                                                            </div>
                                                        </li>
                                                        <li style={{ marginBottom: '15px' }}>
                                                            <div className="row">
                                                                <div className="col-sm-4" style={{ fontWeight: 'bold' }}>Role</div>
                                                                <div className="col-sm-8">{formData.role}</div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="form-wrap" style={{ textAlign: 'center', marginTop: '20px' }}>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-secondary"
                                                        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white' }}
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </section>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;
