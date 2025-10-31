import express from 'express';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import {
  createPoll, getOpenPolls, getAdminPolls,
  updatePoll, deletePoll, closePoll, getResults
} from '../controllers/pollController.js';

const router = express.Router();

router.post('/', auth, admin, createPoll);
router.get('/open', auth, getOpenPolls);
router.get('/admin', auth, admin, getAdminPolls);
router.put('/:id', auth, admin, updatePoll);
router.delete('/:id', auth, admin, deletePoll);
router.patch('/:id/close', auth, admin, closePoll);
router.get('/:id/results', auth, getResults);

export default router;