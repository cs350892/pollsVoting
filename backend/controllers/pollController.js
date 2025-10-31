import Poll from '../models/Poll.js';
import Vote from '../models/Vote.js';

export const createPoll = async (req, res) => {
  const { question, options, closingAt } = req.body;
  if (!question || !options || options.length < 2 || !closingAt) {
    return res.status(400).json({ msg: 'Invalid poll data' });
  }

  try {
    const poll = new Poll({
      question,
      options,
      closingAt,
      createdBy: req.user.id
    });
    await poll.save();
    res.json(poll);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
//get polls
export const getOpenPolls = async (req, res) => {
  try {
    const now = new Date();
    const polls = await Poll.find({
      $or: [{ closingAt: { $gt: now } }, { isClosed: false }]
    }).select('-createdBy');
    res.json(polls);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getAdminPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ 
      createdBy: req.user.id
     });
    res.json(polls);
  } catch (err) {
    res.status(500).json({
       msg: 'Server error'
       });
  }
};
//update
export const updatePoll = async (req, res) => {
  const { id } = req.params;
  try {
    let poll = await Poll.findById(id);
    if (!poll) return res.status(404).json({
       msg: 'Poll not found' 
      });
    if (poll.createdBy.toString() !== req.user.id) return res.status(403).json({ msg: 'Unauthorized' });

    const updated = await Poll.findByIdAndUpdate(id,
       { $set: req.body }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ 
      msg: 'Server error' 
    });
  }
};
//delete
export const deletePoll = async (req, res) => {
  const { id } = req.params;
  try {
    const poll = await Poll.findById(id);
    if (!poll) return res.status(404).json({
       msg: 'Poll not found'
       });
    if (poll.createdBy.toString() !== req.user.id) return res.status(403).json({ msg: 'Unauthorized' });

    await Poll.deleteOne({ _id: id });
    await Vote.deleteMany({ poll: id });
    res.json({
       msg: 'Poll deleted'
       });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const closePoll = async (req, res) => {
  const { id } = req.params;
  try {
    const poll = await Poll.findById(id);
    if (!poll) return res.status(404).json({ msg: 'Poll not found' });
    if (poll.createdBy.toString() !== req.user.id) return res.status(403).json({ msg: 'Unauthorized' });

    poll.isClosed = true;
    await poll.save();
    res.json(poll);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getResults = async (req, res) => {
  const { id } = req.params;
  try {
    const poll = await Poll.findById(id);
    if (!poll) return res.status(404).json({ msg: 'Poll not found' });

    const isClosed = poll.isClosed || new Date() >= poll.closingAt;
    if (!isClosed) return res.status(400).json({ msg: 'Poll still open' });

    const votes = await Vote.aggregate([
      { $match: { poll: poll._id } },
      { $group: { _id: '$optionIndex', count: { $sum: 1 } } }
    ]);

    const results = poll.options.map((opt, idx) => {
      const v = votes.find(v => v._id === idx);
      return { option: opt, votes: v ? v.count : 0 };
    });

    res.json({ poll, results });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};