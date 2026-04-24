import { Link } from 'react-router-dom';

const PortalNavbar = ({
  role,
  tabs,
  activeTab,
  onTabChange,
  theme,
  onThemeToggle,
  userInitials,
  userName,
  extraPill,
}) => {
  const isLight = theme === 'light';

  return (
    <nav className="navbar">
      <div className="portal-navbar-brand">
        <Link to="/" className="navbar-brand">
          <span className="brand-ride">Ride</span>
          <span className="brand-flow">Flow</span>
        </Link>
        {role && <span className="navbar-context">· {role}</span>}
      </div>

      {tabs && tabs.length > 0 ? (
        <div className="navbar-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`navbar-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : (
        <div />
      )}

      <div className="navbar-right">
        {extraPill}
        <label className="theme-toggle" aria-label="Toggle theme">
          <span>{isLight ? 'Light' : 'Dark'}</span>
          <span className="toggle-switch">
            <input
              type="checkbox"
              checked={isLight}
              onChange={onThemeToggle}
            />
            <span className="toggle-track" />
            <span className="toggle-thumb" />
          </span>
        </label>
        {userName && <span className="portal-username">{userName}</span>}
        {userInitials && <div className="user-avatar">{userInitials}</div>}
      </div>
    </nav>
  );
};

export default PortalNavbar;
