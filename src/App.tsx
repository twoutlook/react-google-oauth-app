// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // clearly import this
import GoogleLoginButton from './GoogleLoginButton';
import MePage from './pages/MePage';

// ⚠️ Explicitly insert your Google Client ID here:
const googleClientId = '863538454019-jm9k4k321b3t2gi25mvb3kq54mqem7sm.apps.googleusercontent.com';

const App: React.FC = () => {
    return (
        <GoogleOAuthProvider clientId={googleClientId}> {/* 👈 clearly wrap the app here */}
            <Router>
                <nav style={{ padding: '10px', background: '#eee' }}>
                    <Link to="/">Home</Link> | <Link to="/me">My Profile (/me)</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<GoogleLoginButton />} />
                    <Route path="/me" element={<MePage />} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
};

export default App;
