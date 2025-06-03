// src/components/LawyerVerification.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LawyerVerification = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [proofDoc, setProofDoc] = useState('');
    const [specialization, setSpecialization] = useState('');
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/lawyer-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, name, email, dob, proofDoc, specialization }),
        });
        const data = await response.json();
        if (data.success) {
            navigate('/lawyer-verification-status');
        } else {
            alert(data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
            <h2 className="text-2xl mb-4">Lawyer Verification</h2>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mb-4 border"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-4 border"
            />
            <input
                type="date"
                placeholder="Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-2 mb-4 border"
            />
            <input
                type="text"
                placeholder="Proof Document (e.g., Bar Council ID)"
                value={proofDoc}
                onChange={(e) => setProofDoc(e.target.value)}
                className="w-full p-2 mb-4 border"
            />
            <input
                type="text"
                placeholder="Specialization (e.g., Criminal, Civil, Family)"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full p-2 mb-4 border"
            />
            <button type="submit" className="w-full p-2 bg-blue-500 text-white">
                Apply
            </button>
        </form>
    );
};

export default LawyerVerification;