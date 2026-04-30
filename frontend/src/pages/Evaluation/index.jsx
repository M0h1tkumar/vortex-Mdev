import { useState, useEffect } from 'react';
import { NeonBorderCard } from '../../components/ui/NeonBorderCard';
import './styles.css';

function Evaluation({ user, apiUrl }) {
  const [search, setSearch] = useState('');
  const [team, setTeam] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [marks, setMarks] = useState({});
  const [feedback, setFeedback] = useState('');
  const [round, setRound] = useState(1);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/evaluations/criteria`).then(res => res.json()).then(setCriteria);
  }, [apiUrl]);

  const handleSearch = async () => {
    const res = await fetch(`${apiUrl}/teams`);
    const data = await res.json();
    const found = data.teams.find(t => t.teamName.toLowerCase().includes(search.toLowerCase()) || t.id === search);
    setTeam(found);
    setLocked(false);
    setMarks({});
    setFeedback('');
    
    if (found) {
        // Check if already evaluated
        const evalRes = await fetch(`${apiUrl}/evaluations?teamId=${found.id}&round=${round}`);
        const evalData = await evalRes.json();
        if (evalData.count > 0) {
            setLocked(true);
            alert('SYSTEM_ALERT: EVALUATION_LOCKED_FOR_THIS_ROUND');
        }
    }
  };

  const handleSubmit = async () => {
    if (locked) return;
    const scores = criteria.map(c => ({
      criteriaId: c.id,
      marks: parseFloat(marks[c.id] || 0)
    }));

    const res = await fetch(`${apiUrl}/evaluations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamId: team.id,
        round,
        juryId: user.id,
        feedback,
        scores
      }),
    });

    if (res.ok) {
      alert('EVALUATION_FINALIZED: DATA_IMMUTABLE');
      setLocked(true);
    } else {
      const err = await res.json();
      alert(err.error || 'SUBMISSION_FAILURE');
    }
  };

  return (
    <div className="evaluation-page">
      <div className="page-header">
        <h1>TACTICAL_EVALUATION</h1>
        <p>JURY_UPLINK: {user.fullName}</p>
      </div>

      <div className="search-section" style={{ display: 'flex', gap: '10px', marginBottom: '32px' }}>
        <input 
          placeholder="ENTER_SQUAD_DESIGNATION_OR_ID" 
          className="input-glass"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button onClick={handleSearch} className="glow-button">RETRIEVE_INTEL</button>
      </div>

      {team && (
        <div className="eval-container">
          <NeonBorderCard>
            <div className="glass-card">
              <h3>SQUAD_INTEL: {team.teamName}</h3>
              <p className="ps-name">OBJECTIVE: {team.problemStatement.title}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                {team.problemStatement.description || 'NO_MISSION_DESCRIPTION_PROVIDED'}
              </p>
              <div className="members-list-mini" style={{ marginTop: '20px' }}>
                {team.members.map(m => (
                  <div key={m.studentId} className="mini-member">
                    <span>{m.student.fullName}</span>
                    <span>{m.student.domain?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </NeonBorderCard>

          <div className="evaluation-form" style={{ marginTop: '32px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {[1, 2, 3].map(r => (
                    <button 
                        key={r}
                        onClick={() => setRound(r)}
                        className="btn-verify"
                        style={{ background: round === r ? 'var(--accent-cyan)' : '', color: round === r ? '#000' : '' }}
                    >
                        ROUND_{r}
                    </button>
                ))}
            </div>

            {criteria.map(c => (
              <div key={c.id} style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-dim)', marginBottom: '5px' }}>
                  {c.name} (MAX: {c.maxMarks})
                </label>
                <input 
                  type="number" 
                  className="input-glass"
                  disabled={locked}
                  max={c.maxMarks}
                  value={marks[c.id] || ''}
                  onChange={e => setMarks({ ...marks, [c.id]: e.target.value })}
                />
              </div>
            ))}
            <textarea 
              placeholder="TACTICAL_FEEDBACK" 
              className="input-glass"
              style={{ minHeight: '100px', marginTop: '10px' }}
              disabled={locked}
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
            />
            <button 
                onClick={handleSubmit} 
                className="glow-button submit-btn" 
                style={{ marginTop: '20px' }}
                disabled={locked}
            >
              {locked ? 'DATA_LOCKED' : 'FINALIZE_EVALUATION'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Evaluation;
