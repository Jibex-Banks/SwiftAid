import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { Link, useNavigate } from 'react-router-dom';  // Import useNavigate hook
import './Auth.css';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            console.log('User logged in successfully');
            navigate("/dashboard");  
        } catch (error) {
            setError(error.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            console.log('User logged in with Google successfully');
            navigate('/dashboard');  // Redirect to dashboard
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="auth">
        <div className="auth-container" id='login'>
            <h2>Login to <span className="brand">SwiftAid</span></h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    required 
                    onChange={handleChange} 
                    value={formData.email}
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    required 
                    onChange={handleChange} 
                    value={formData.password}
                />
                <button type="submit" className="submit-btn">Login</button>
            </form>
            <div className="divider">
                <hr /><span>or</span><hr />
            </div>
            <button onClick={handleGoogleLogin} className="google-btn">
                <FcGoogle /> Login with Google
            </button>
            <p className="auth-switch">Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
        </div>
    );
}