import { NeonBorderCard } from '../../components/ui/NeonBorderCard';
import { ScrambleText } from '../../components/ui/ScrambleText';
import './styles.css';

function Dashboard({ user, apiUrl }) {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1><ScrambleText text={`ACCESS_GRANTED: ${user?.fullName || user?.name}`} className="text-[var(--status-live)] font-mono" /></h1>
        <p>SYSTEM_ORIGIN: {user?.institution || 'UNKNOWN_STATION'}</p>
      </div>

      <div className="dashboard-grid">
        <NeonBorderCard>
        <div className="glass-card profile-card h-full">
          <div className="card-header">
            <h2>USER_PROFILE</h2>
          </div>
          <div className="profile-info">
            <div className="info-item">
              <span className="info-label">IDENTIFIER</span>
              <span className="info-value">{user?.rollNumber || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">COMMS_CHANNEL</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">PRIMARY_DOMAIN</span>
              <span className="info-value">{user?.domain || 'UNASSIGNED'}</span>
            </div>
          </div>
        </div>
        </NeonBorderCard>

        <NeonBorderCard>
        <div className="glass-card status-card h-full">
          <div className="card-header">
            <h2>CLEARANCE_STATUS</h2>
          </div>
          <div className="status-display">
            <div className={`status-indicator ${user?.role === 'admin' ? 'verified' : user?.role === 'teamlead' ? 'verified' : 'pending'}`}>
              {user?.role === 'admin' ? 'SYSTEM_ADMIN' : user?.role === 'teamlead' ? 'SQUAD_COMMANDER' : 'PENDING_AUTH'}
            </div>
            <p className="status-message">
              {user?.role === 'admin' 
                ? 'Full system access protocols active.' 
                : user?.role === 'teamlead'
                ? 'Squad command protocols initialized. Operative leading mission.'
                : 'Awaiting administrator verification for deployment.'}
            </p>
          </div>
        </div>
        </NeonBorderCard>

        {(user?.role === 'student' || user?.role === 'teamlead') && (
          <NeonBorderCard>
          <div className="glass-card team-preview-card h-full">
            <div className="card-header">
              <h2>TEAM_OPERATIONS</h2>
            </div>
            <div className="no-team">
              <p>{user?.role === 'teamlead' ? 'SQUAD_ACTIVE' : 'NO_ACTIVE_SQUAD_DETECTED'}</p>
              <a href="/teams" className="glow-button">
                {user?.role === 'teamlead' ? 'MANAGE_SQUAD' : 'INITIALIZE_FORMATION'}
              </a>
            </div>
          </div>
          </NeonBorderCard>
        )}

        {user?.role === 'admin' && (
          <NeonBorderCard>
          <div className="glass-card admin-ops-card h-full">
            <div className="card-header">
              <h2>COMMAND_CENTER</h2>
            </div>
            <div className="admin-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="/admin" className="action-link"> {'>'} MANAGE_OPERATIVES</a>
              <a href="/problem-statements" className="action-link"> {'>'} SECTOR_OBJECTIVES</a>
              <a href="/leaderboard" className="action-link"> {'>'} GLOBAL_RANKINGS</a>
            </div>
          </div>
          </NeonBorderCard>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
