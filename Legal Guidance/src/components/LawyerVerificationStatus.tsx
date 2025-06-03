// src/components/LawyerVerificationStatus.tsx
import { useEffect, useState } from 'react';

const LawyerVerificationStatus = () => {
    const [status, setStatus] = useState('pending');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchStatus = async () => {
            const response = await fetch(`http://localhost:5000/api/lawyer-verification-status/${userId}`);
            const data = await response.json();
            setStatus(data.status);
        };
        fetchStatus();
    }, [userId]);

    return (
        <div className="text-center mt-10">
            <h2 className="text-2xl mb-4">Verification Status</h2>
            {status === 'pending' && <p>Applied. Awaiting admin approval.</p>}
            {status === 'accepted' && <p>Verification Accepted! You can now sign in.</p>}
            {status === 'rejected' && (
                <p>Verification Rejected. Try again after some time or contact us.</p>
            )}
        </div>
    );
};

export default LawyerVerificationStatus;