import { useEffect, useState } from 'react';
import axios from 'axios';

const FibPage = () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [valuesRes, seenIndexesRes] = await Promise.allSettled([
        axios.get('/api/values/current'),
        axios.get('/api/values/all'),
      ]);
      setValues(valuesRes?.value?.data ?? {});
      setSeenIndexes(seenIndexesRes?.value?.data ?? []);
    };
    fetchData();
  }, []);

  const submitIndex = async (e) => {
    e.preventDefault();
    await axios.post('/api/values', { index });
    setIndex('');
  };

  return (
    <div>
      <form onSubmit={submitIndex} className="column" style={{ marginBottom: '2rem' }}>
        <label style={{ marginBottom: '1rem' }}>Enter your desired index:</label>
        <input style={{ marginBottom: '1rem' }} value={index} onChange={e => setIndex(e.target.value)} />
        <button type="submit" style={{ width: '10rem' }}>Submit</button>
      </form>
      <h3>Indexes I have seen:</h3>
      <p>{seenIndexes.map(({ number }) => number).join(', ')}</p>
      <h3>Calculated Values:</h3>
      {Object.keys(values).map(key => (
        <p key={key}>For index {key} I calculated {values[key]}</p>
      ))}
    </div>
  );
};

export default FibPage;
