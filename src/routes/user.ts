import { Router } from 'express';
import db from '../db';

const router = Router();

router.post('/addUser', async (req, res) => {
    const { username, email } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *',
            [username, email]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).send('Server error');
    }
});

export default router;
