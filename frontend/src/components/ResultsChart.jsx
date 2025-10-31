import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ResultsChart({ data }) {
  const chartData = data.map(d => ({ name: d.option, votes: d.votes }));

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Results</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="votes" fill="#1877f2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}