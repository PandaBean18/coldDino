'use client'

import { useState } from 'react';

const WaitlistPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        if (!email) {
            setError('Please enter your email address.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setEmail('');
            } else {
                setError(data.error);
            }
        } catch (err) {
            console.error('Error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100" style={{fontFamily: "Bebas Neue"}}>
                
            <div className='w-full max-w-md p-[20px]'>
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md p-[20px]">
                    <h2 className="text-4xl font-semibold mb-4 text-gray-800" style={{fontFamily: "Bebas Neue"}}>Join The Waitlist</h2>
                    {message && <p className="text-green-500 mb-4">{message}</p>}
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-gray-700 text-xl  mb-2">
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your email"
                                style={{fontFamily: "Poppins"}}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#121212] hover:bg-[#121212] text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full hover:cursor-pointer"
                            style={{fontFamily: "Poppins"}}
                        >
                            {loading ? 'Joining...' : 'Join Waitlist'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default WaitlistPage;