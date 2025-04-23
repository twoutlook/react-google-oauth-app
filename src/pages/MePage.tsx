import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MePage: React.FC = () => {
    const [userData, setUserData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('backendJWT'); // explicitly get JWT from local storage
            if (!token) {
                setError("No JWT token available. Please login first.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('https://api.ovb3.com/api/Auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}` // explicitly include JWT in request
                    }
                });
                setUserData(response.data);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to fetch user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>🔍 User Info (/me)</h2>

            {loading && <div>Loading...</div>}

            {error && <div style={{ color: 'red' }}>{error}</div>}

            {userData && (
                <pre style={{ marginTop: '20px' }}>
                    {JSON.stringify(userData, null, 2)}
                </pre>
            )}
        </div>
    );
};

export default MePage;
