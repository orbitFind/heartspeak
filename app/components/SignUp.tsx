"use client"
import { useState } from 'react';
import { auth } from '@/app/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setError(null);
            alert('User registered successfully!');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="border border-gray-300 px-4 py-2 rounded"
                    style={{ color: 'black' }} // Set the text color to black
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="border border-gray-300 px-4 py-2 rounded"
                    style={{ color: 'black' }} // Set the text color to black
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                    className="border border-gray-300 px-4 py-2 rounded"
                    style={{ color: 'black' }} // Set the text color to black
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Sign Up
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    );
};

export default SignUp;
