import { Router } from 'express';
import db from '../db';
import axios from 'axios';
import dotenv from 'dotenv';
import { Alchemy, Network } from 'alchemy-sdk';
import { ethers } from 'ethers';

dotenv.config();

const router = Router();

const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);

router.post('/', async (req, res) => {
    const { userId, token, chain } = req.body;

    try {
        // Check if the user exists
        const userResult = await db.query('SELECT id FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        let depositAddress = '';
        if (chain === 'TRC20') {
            const response = await axios.get(`https://api.trongrid.io/wallet/generateaddress`);
            depositAddress = response.data.address;
        } else if (chain === 'ERC20') {
            // Generate a new Ethereum address using ethers
            const wallet = ethers.Wallet.createRandom();
            depositAddress = wallet.address;
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
