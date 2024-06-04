import { Router } from 'express';
import db from '../db';
import axios from 'axios';

const router = Router();

router.post('/', async (req, res) => {
    const { userId, token, chain } = req.body;

    let depositAddress = '';
    try {
        if (chain === 'TRC20') {
            depositAddress = 'TTron_example_address';
        } else if (chain === 'ERC20') {
            depositAddress = 'TEth_example_address';
        }

        const result = await db.query(
            'INSERT INTO deposits (user_id, token, chain, deposit_address) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, token, chain, depositAddress]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error creating deposit:', err);
        res.status(500).send('Server error');
    }
});

export default router;
