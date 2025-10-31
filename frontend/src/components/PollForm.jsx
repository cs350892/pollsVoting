import { useState } from 'react';

export default function PollForm({ initial = {}, onSubmit }) {
  const [question, setQuestion] = useState(initial.question || '');
  const [options, setOptions] = useState(initial.options?.join('\n') || '');
  const [closingAt, setClosingAt] = useState(initial.closingAt?.slice(0,16) || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const opts = options.split('\n').map(s => s.trim()).filter(Boolean);
    if (opts.length < 2) return alert('Min 2 options');
    onSubmit({ question, options: opts, closingAt });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Question" value={question} onChange={e => setQuestion(e.target.value)} required />
      <textarea placeholder="Options (one per line)" value={options} onChange={e => setOptions(e.target.value)} rows={4} required />
      <input type="datetime-local" value={closingAt} onChange={e => setClosingAt(e.target.value)} required />
      <button type="submit">Save</button>
    </form>
  );
}