import { useCallback, useEffect, useState } from 'react';

export const usePasswordStatus = () => {
    const [passwordStatus, setPasswordStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPasswordStatus = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:3000/api/users/password-status', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const status = await response.json();
                setPasswordStatus(status);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to fetch password status');
            }
        } catch (error) {
            console.error('Failed to fetch password status:', error);
            setError('Network error while fetching password status');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPasswordStatus();
    }, [fetchPasswordStatus]);

    return {
        passwordStatus,
        loading,
        error,
        refetchStatus: fetchPasswordStatus
    };
};

export default usePasswordStatus;
