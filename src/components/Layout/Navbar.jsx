import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import {
  Search,
  Sun,
  Moon,
  Plus,
  Bell,
  LogOut,
  User,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  Globe
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, theme, toggleTheme, logout, setIsAuthModalOpen, updateStatus } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    selectedPriority,
    setSelectedPriority,
    selectedCategory,
    setSelectedCategory,
    setIsCreateModalOpen
  } = useTasks();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [customStatusInput, setCustomStatusInput] = useState('');

  const handleStatusChange = (status) => {
    updateStatus(status, customStatusInput || currentUser?.statusText);
    setIsStatusMenuOpen(false);
  };

  return (
    <header
      className="glass-panel"
      style={{
        borderRadius: 0,
        borderLeft: 0,
        borderRight: 0,
        borderTop: 0,
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        zIndex: 50,
        position: 'sticky',
        top: 0
      }}
    >
      {/* Brand & Workspace Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Sync<span style={{ color: 'var(--accent-primary)' }}>Pulse</span>
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                display: 'block',
                color: 'var(--text-muted)',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            >
              Remote Team Engine
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Search tasks, tags, descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            className="select-field"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '6px 10px', height: '36px' }}
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent 🔴</option>
            <option value="high">High 🟠</option>
            <option value="medium">Medium 🟡</option>
            <option value="low">Low 🔵</option>
          </select>

          <select
            className="select-field"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ fontSize: '0.8rem', padding: '6px 10px', height: '36px' }}
          >
            <option value="all">All Categories</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Design">Design</option>
            <option value="DevOps">DevOps</option>
            <option value="Analytics">Analytics</option>
          </select>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Create Task Button */}
        <button className="btn btn-primary btn-sm" onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={16} /> New Task
        </button>

        {/* Theme Switcher */}
        <button
          className="btn btn-secondary btn-icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification Bell */}
        <button className="btn btn-secondary btn-icon" style={{ position: 'relative' }} title="Notifications">
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent-rose)',
              boxShadow: '0 0 6px var(--accent-rose)'
            }}
          />
        </button>

        {/* User Presence & Profile Pill */}
        {currentUser ? (
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '4px 10px 4px 6px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer'
              }}
            >
              <div style={{ position: 'relative' }}>
                <img src={currentUser.avatar} alt={currentUser.name} className="avatar" style={{ width: '30px', height: '30px' }} />
                <span
                  className={`presence-dot presence-${currentUser.status}`}
                  style={{ position: 'absolute', bottom: 0, right: 0, border: '2px solid var(--bg-secondary)' }}
                />
              </div>
              <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{currentUser.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentUser.timezone}</div>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            </div>

            {/* Profile Menu Dropdown */}
            {isProfileMenuOpen && (
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  width: '240px',
                  padding: '12px',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{currentUser.role}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '4px' }}>
                    Status: {currentUser.statusText || currentUser.status}
                  </div>
                </div>

                {/* Status Switcher Quick Menu */}
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>
                  Set Status
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleStatusChange('online')}>
                    🟢 Online
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleStatusChange('deepwork')}>
                    ⚡ Deep Work
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleStatusChange('break')}>
                    ☕ Break
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleStatusChange('offline')}>
                    🌙 Offline
                  </button>
                </div>

                <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'flex-start', color: 'var(--accent-rose)' }}
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }}
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={() => setIsAuthModalOpen(true)}>
            <User size={16} /> Sign In
          </button>
        )}
      </div>
    </header>
  );
};
