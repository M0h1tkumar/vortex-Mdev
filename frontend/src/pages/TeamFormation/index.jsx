import { useState, useEffect } from 'react';
import { NeonBorderCard } from '../../components/ui/NeonBorderCard';
import { ScrambleText } from '../../components/ui/ScrambleText';
import './styles.css';

function TeamFormation({ user, apiUrl }) {
  const [myTeam, setMyTeam] = useState(null);
  const [compatibleTeams, setCompatibleTeams] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ teamName: '' });
  const [config, setConfig] = useState({});

  useEffect(() => {
    fetch(`${apiUrl}/awards/config`).then(res => res.json()).then(setConfig);
    refreshData();
  }, [apiUrl, user.id, user.psId]);

  const refreshData = async () => {
    // Check if user has a team
    const teamRes = await fetch(`${apiUrl}/teams?leaderId=${user.id}`);
    const teamData = await teamRes.json();
    const foundTeam = teamData.teams?.find(t => t.members.some(m => m.studentId === user.id));
    setMyTeam(foundTeam);

    if (!foundTeam) {
      // Find compatible squads
      const compRes = await fetch(`${apiUrl}/teams/compatible?psId=${user.psId}`);
      const compData = await compRes.json();
      setCompatibleTeams(compData.teams || []);
    } else {
      // If leader, check requests
      if (foundTeam.leaderId === user.id) {
        const reqRes = await fetch(`${apiUrl}/teams/${foundTeam.id}/requests`);
        const reqData = await reqRes.json();
        setRequests(reqData);
      }
    }
  };

  const handleCreateTeam = async () => {
    if (config.lockdownActive) return alert('LOCKDOWN_ACTIVE: FORMATION_CLOSED');
    const res = await fetch(`${apiUrl}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamName: form.teamName, psId: user.psId, leaderId: user.id }),
    });
    if (res.ok) refreshData();
    else alert('FAILURE: DESIGNATION_TAKEN');
  };

  const handleJoinRequest = async (teamId) => {
    await fetch(`${apiUrl}/teams/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId, studentId: user.id }),
    });
    alert('UPLINK_REQUEST_SENT');
  };

  const handleProcessRequest = async (requestId, action) => {
    await fetch(`${apiUrl}/teams/request`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, action }),
    });
    refreshData();
  };

  return (
    <div className="team-page">
      <div className="page-header">
        <h1>SQUAD_FORMATION</h1>
        <p>MISSION: {user.problemStatement?.title || 'AWAITING_OBJECTIVE'}</p>
      </div>

      {config.lockdownActive && (
        <div className="error-message" style={{ marginBottom: '24px' }}>
          SYSTEM_LOCKDOWN: TEAM_FORMATION_STATIONS_OFFLINE
        </div>
      )}

      {!myTeam ? (
        <div className="team-content">
          <NeonBorderCard className="create-card">
            <div className="glass-card">
              <h3>INITIALIZE_NEW_SQUAD</h3>
              <div className="create-form">
                <input
                  placeholder="SQUAD_DESIGNATION"
                  className="input-glass"
                  value={form.teamName}
                  onChange={e => setForm({ ...form, teamName: e.target.value })}
                />
                <button 
                  onClick={handleCreateTeam} 
                  className="glow-button"
                  disabled={config.lockdownActive}
                >
                  INIT_SQUAD
                </button>
              </div>
            </div>
          </NeonBorderCard>

          <div className="compatible-section">
            <h3>COMPATIBLE_SQUADS (SAME_OBJECTIVE)</h3>
            <div className="available-list" style={{ marginTop: '20px' }}>
              {compatibleTeams.map(t => (
                <NeonBorderCard key={t.id} className="mb-4">
                  <div className="glass-card team-card">
                    <div className="team-header">
                      <h4>{t.teamName}</h4>
                      <span className="ps-name">{t.leader.email}</span>
                    </div>
                    <div className="validation-details" style={{ margin: '12px 0' }}>
                      <span>OPS: {t.members.length}/5</span>
                      <span>FEM: {t.members.filter(m => m.student.gender === 'Female').length < 1 ? '⚠️ PENDING' : '✓ OK'}</span>
                    </div>
                    <button 
                      onClick={() => handleJoinRequest(t.id)} 
                      className="btn-add"
                      disabled={config.lockdownActive}
                    >
                      REQUEST_ENLISTMENT
                    </button>
                  </div>
                </NeonBorderCard>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="team-content">
          <NeonBorderCard className="team-info-card">
            <div className="glass-card">
              <div className="team-header">
                <h2>{myTeam.teamName}</h2>
                <span className="status-badge verified">{myTeam.teamStatus}</span>
              </div>
              <p className="ps-name">OBJECTIVE: {myTeam.problemStatement.title}</p>
              <div className="members-list" style={{ marginTop: '20px' }}>
                {myTeam.members.map(m => (
                  <div key={m.studentId} className="member-item">
                    <span>{m.student.fullName} ({m.student.gender})</span>
                    <span className="member-role">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </NeonBorderCard>

          {myTeam.leaderId === user.id && requests.length > 0 && (
            <div className="requests-section">
              <h3>PENDING_ENLISTMENT_REQUESTS</h3>
              {requests.map(r => (
                <NeonBorderCard key={r.id} className="mb-4">
                  <div className="glass-card">
                    <div className="request-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{r.student.fullName}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{r.student.email}</span>
                    </div>
                    <p style={{ fontSize: '12px', margin: '10px 0', color: 'var(--text-secondary)' }}>
                      {r.student.summary}
                    </p>
                    <div className="action-buttons">
                      <button className="btn-verify" onClick={() => handleProcessRequest(r.id, 'ACCEPTED')}>ACCEPT</button>
                      <button className="btn-reject" onClick={() => handleProcessRequest(r.id, 'REJECTED')}>DENY</button>
                    </div>
                  </div>
                </NeonBorderCard>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TeamFormation;
