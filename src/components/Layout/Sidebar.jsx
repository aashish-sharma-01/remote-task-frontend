import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import {
  LayoutGrid,
  ListTodo,
  Globe,
  MessageSquare,
  BarChart3,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const Sidebar = () => {
  const { members, setIsAuthModalOpen } = useAuth();
  const { activeView, setActiveView, tasks } = useTasks();

  const totalActive = tasks.filter((t) => t.status !== 'done').length;
  const urgentCount = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length;

  const navItems = [
    { id: 'kanban', label: 'Kanban Board', icon: LayoutGrid },
    { id: 'list', label: 'Task Matrix List', icon: ListTodo },
    { id: 'timezones', label: 'Timezone Overlap', icon: Globe, badge: 'Remote' },
    { id: 'standups', label: 'Async Standups', icon: MessageSquare, badge: 'Daily' },
    { id: 'analytics', label: 'Team Analytics', icon: BarChart3 }
  ];

  return (
    <aside
      className="glass-panel"
      style={{
        width: '260px',
        borderRadius: 0,
        borderTop: 0,
        borderBottom: 0,
        borderLeft: 0,
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        padding: '20px 14px',
        height: 'calc(100vh - 65px)',
        zIndex: 40
      }}
    >
      {/* Upper Navigation Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Navigation Links */}
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '10px',
              paddingLeft: '10px'
            }}
          >
            Workspace Views
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)' : 'transparent',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'var(--bg-tertiary)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={18} />
                    <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: 'var(--accent-primary)',
                        border: '1px solid rgba(99, 102, 241, 0.3)'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Workspace Stats */}
        <div
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Sprint 42 Health
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active Tasks</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{totalActive}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Urgent Blockers</span>
            <span className="badge badge-urgent">{urgentCount}</span>
          </div>
        </div>
      </div>

      {/* Remote Team Roster */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '4px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Global Roster ({members.length})
          </span>
          <Users size={14} style={{ color: 'var(--text-muted)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
          {members.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '6px 8px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ position: 'relative' }}>
                  <img src={m.avatar} alt={m.name} className="avatar" style={{ width: '26px', height: '26px' }} />
                  <span
                    className={`presence-dot presence-${m.status}`}
                    style={{ position: 'absolute', bottom: 0, right: 0, border: '1.5px solid var(--bg-secondary)', width: '8px', height: '8px' }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{m.name.split(' ')[0]}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.timezone}</div>
                </div>
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{m.utcOffset >= 0 ? `+${m.utcOffset}` : m.utcOffset}h</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
