import { serverTimestamp } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Please enter your email address.' });
        }

        try {
            const waitlistCollectionRef = db.collection('waitlist');
            await waitlistCollectionRef.add({
                email: email,
                timestamp: new Date(),
            });
            return res.status(200).json({ message: 'You have successfully joined the waitlist!' });
        } catch (err) {
            console.error('Error adding to waitlist:', err);
            return res.status(500).json({ error: 'Failed to join the waitlist. Please try again later.' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}