import { Router } from 'express';
import db from '../db';

const router = Router();

router.post('/', async (req, res) => {
    const { userId, token, chain, amount, withdrawalAddress } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO withdrawals (user_id, token, chain, withdrawal_address, amount) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, token, chain, withdrawalAddress, amount]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error processing withdrawal:', err);
        res.status(500).send('Server error');
    }
});

export default router;
