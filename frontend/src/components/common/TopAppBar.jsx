import './styles.css';

function TopAppBar({ isRegistered, user, onLogout }) {
  return (
    <header className="topappbar">
      <div className="topappbar-content">
        <a href="/" className="logo">
          <div className="logo-glow"></div>
          <span className="logo-text">VORTEX</span>
        </a>
        {isRegistered && (
          <nav className="nav-links">
            <a href="/dashboard" className="nav-link">Dashboard</a>
            <a href="/teams" className="nav-link">Teams</a>
            <a href="/leaderboard" className="nav-link">Leaderboard</a>
            <a href="/awards" className="nav-link">Awards</a>
            {user?.role === 'admin' && (
              <a href="/admin" className="nav-link admin-link">Admin</a>
            )}
            {user?.role === 'admin' && (
              <a href="/problem-statements" className="nav-link admin-link">PS</a>
            )}
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </nav>
        )}
      </div>
    </header>
  );
}

export default TopAppBar;
