import Vote from '../models/Vote.js';
import Poll from '../models/Poll.js';

export const castVote = async (req, res) => {
  const { pollId, optionIndex } = req.body;

  try {
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ msg: 'Poll not found' });

    const now = new Date();
    if (poll.isClosed || now >= poll.closingAt) {
      return res.status(400).json({ msg: 'Poll is closed' });
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ msg: 'Invalid option' });
    }

    const existing = await Vote.findOne({ poll: pollId, user: req.user.id });
    if (existing) return res.status(400).json({ msg: 'Already voted' });

    const vote = new Vote({ poll: pollId, user: req.user.id, optionIndex });
    await vote.save();
    res.json({ msg: 'Vote recorded' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const hasUserVoted = async (req, res) => {
  const { pollId } = req.params;
  try {
    const vote = await Vote.findOne({ poll: pollId, user: req.user.id });
    res.json({ voted: !!vote });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};