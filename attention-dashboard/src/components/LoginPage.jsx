import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './LoginPage.css';

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isSignup ? 'register' : 'login';
        const body = isSignup
            ? { name, email, password }
            : { email, password };

        try {
            const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.msg || 'Something went wrong');
                setLoading(false);
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            onLogin(data.user, isSignup);
        } catch (err) {
            setError('Cannot connect to server');
        }
        setLoading(false);
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.msg || 'Google login failed');
                setLoading(false);
                return;
            }
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            onLogin(data.user, data.isNewUser);
        } catch (err) {
            setError('Google Client ID is missing or invalid. Set it up in main.jsx and .env');
        }
        setLoading(false);
    };

    const handleDevBypass = () => {
        const guestName = prompt("Enter your name for the trial:") || "Dev Guest";
        const mockUser = { name: guestName, avatar: guestName.charAt(0).toUpperCase() };
        localStorage.setItem('token', 'mock_token');
        localStorage.setItem('user', JSON.stringify(mockUser));
        onLogin(mockUser, true); // true = show preference page
    };

    return (
        <div className="login-wrapper">
            <div className="login-glow-orb orb-1"></div>
            <div className="login-glow-orb orb-2"></div>

            <div className="login-card glass-login">
                <div className="login-header">
                    <div className="login-logo">
                        <span className="logo-icon">★</span>
                    </div>
                    <h1 className="login-title">Attention Seekers</h1>
                    <p className="login-subtitle">{isSignup ? 'Create your account' : 'Welcome back'}</p>
                </div>

                {error && <div className="login-error">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className="login-field">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="login-field">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="you@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-field">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn primary-login-btn" disabled={loading}>
                        {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
                    </button>
                </form>

                <div className="login-divider">
                    <span>or continue with</span>
                </div>

                <div className="social-login-row">
                    <div className="google-login-wrapper">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Sign-In failed')}
                            theme="filled_black"
                            shape="pill"
                            size="large"
                            text="continue_with"
                            width="200"
                        />
                    </div>
                    <button className="social-btn apple-btn" type="button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
                        <span>Apple</span>
                    </button>
                </div>

                <div className="login-footer">
                    <button type="button" className="dev-bypass-link" onClick={handleDevBypass}>
                        🚧 Dev Bypass: Skip to Preferences
                    </button>
                    <div style={{ marginTop: '12px' }}>
                        <span>{isSignup ? 'Already have an account?' : "Don't have an account?"}</span>
                        <button type="button" className="toggle-auth-btn" onClick={() => { setIsSignup(!isSignup); setError(''); }}>
                            {isSignup ? 'Sign In' : 'Sign Up'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
