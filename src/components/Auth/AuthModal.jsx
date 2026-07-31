import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogIn, UserPlus, Shield, Globe, Sparkles, X, Check } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, signup, loginAsDemo, members } = useAuth();
  const [tab, setTab] = useState('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Senior Frontend Developer');
  const [timezone, setTimezone] = useState('PST');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    signup({ name, email, password, role, timezone });
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles className="accent-icon" style={{ color: 'var(--accent-primary)' }} size={22} />
              Welcome to SyncPulse
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Task management & async hub for global remote teams
            </p>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={() => setIsAuthModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', padding: '0 28px', background: 'var(--bg-tertiary)' }}>
          <button
            style={{
              padding: '14px 20px',
              border: 'none',
              background: 'none',
              color: tab === 'login' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              borderBottom: tab === 'login' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={() => setTab('login')}
          >
            <LogIn size={16} /> Log In
          </button>
          <button
            style={{
              padding: '14px 20px',
              border: 'none',
              background: 'none',
              color: tab === 'signup' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              borderBottom: tab === 'signup' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={() => setTab('signup')}
          >
            <UserPlus size={16} /> Register New Team Member
          </button>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                  Work Email
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="elena@syncpulse.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                  Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', width: '100%' }}>
                <LogIn size={18} /> Sign In
              </button>

              {/* Demo Accounts Quick Fill */}
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  ⚡ Quick Demo Login (One-click)
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {members.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => loginAsDemo(member.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={member.avatar} alt={member.name} className="avatar" style={{ width: '28px', height: '28px' }} />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{member.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{member.role}</div>
                        </div>
                      </div>
                      <span className="badge badge-tag">{member.timezone}</span>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                  Work Email
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="sarah@syncpulse.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                    Role / Title
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Product Manager"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                    Primary Timezone
                  </label>
                  <select className="select-field" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                    <option value="PST">PST (San Francisco)</option>
                    <option value="EST">EST (New York)</option>
                    <option value="GMT">GMT (London)</option>
                    <option value="CET">CET (Berlin)</option>
                    <option value="IST">IST (India)</option>
                    <option value="JST">JST (Tokyo)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                  Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', width: '100%' }}>
                <UserPlus size={18} /> Complete Registration & Join Team
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
