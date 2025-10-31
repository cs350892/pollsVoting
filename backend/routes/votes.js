import express from 'express';
import auth from '../middleware/auth.js';
import { castVote, hasUserVoted } from '../controllers/voteController.js';

const router = express.Router();

router.post('/', auth, castVote);
router.get('/:pollId/voted', auth, hasUserVoted);

export default router;