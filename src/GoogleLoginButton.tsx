import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const GoogleLoginButton: React.FC = () => {
    const [googleJwtClaims, setGoogleJwtClaims] = useState<any>(null);
    const [backendJwtClaims, setBackendJwtClaims] = useState<any>(null);
    const [rawBackendJWT, setRawBackendJWT] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        setError(null);
        setBackendJwtClaims(null);
        setGoogleJwtClaims(null);
        setRawBackendJWT(null);

        if (credentialResponse.credential) {
            const decodedGoogle: any = jwtDecode(credentialResponse.credential);
            setGoogleJwtClaims(decodedGoogle);

            try {
                const response = await axios.post(
                    'https://api.ovb3.com/api/Auth/google-authenticate',
                    { token: credentialResponse.credential }
                );

                const backendJWT = response.data.token;

                // Explicitly store JWT to localStorage
                localStorage.setItem('backendJWT', backendJWT);

                const decodedBackend: any = jwtDecode(backendJWT);

                setRawBackendJWT(backendJWT);
                setBackendJwtClaims(decodedBackend);
            } catch (err: any) {
                console.error('Backend authentication error:', err);
                setError('Backend authentication failed.');
            }
        }
    };

    const handleLoginError = () => {
        setError('Google login failed.');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
                useOneTap
            />

            {error && (
                <div style={{ marginTop: '20px', color: 'red' }}>
                    <strong>{error}</strong>
                </div>
            )}

            {rawBackendJWT && (
                <div style={{ marginTop: '20px' }}>
                    <h3>🗝️ Raw Backend JWT:</h3>
                    <textarea
                        readOnly
                        style={{ width: '100%', height: '120px', fontFamily: 'monospace', padding: '10px' }}
                        value={rawBackendJWT}
                    />
                </div>
            )}

            {googleJwtClaims && (
                <div style={{ marginTop: '20px' }}>
                    <h3>🌐 Google JWT Claims (Frontend):</h3>
                    <pre>{JSON.stringify(googleJwtClaims, null, 2)}</pre>
                </div>
            )}

            {backendJwtClaims && (
                <div style={{ marginTop: '20px' }}>
                    <h3>🔒 Backend JWT Claims (Server):</h3>
                    <pre>{JSON.stringify(backendJwtClaims, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default GoogleLoginButton;
