import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { MessageSquare, ThumbsUp, AlertCircle, CheckCircle2, Plus, Calendar, Sparkles } from 'lucide-react';

export const AsyncStandups = () => {
  const { members, currentUser } = useAuth();
  const { standups, addStandup, likeStandup } = useTasks();

  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [blockers, setBlockers] = useState('');
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!yesterday || !today) return;
    addStandup({ yesterday, today, blockers: blockers || 'None' });
    setYesterday('');
    setToday('');
    setBlockers('');
    setIsSubmitOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare className="accent-icon" style={{ color: 'var(--accent-secondary)' }} size={24} />
            Async Daily Standup Hub
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Keep global team members aligned asynchronously without wasteful status calls.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsSubmitOpen(true)}>
          <Plus size={18} /> Post Today's Update
        </button>
      </div>

      {/* New Standup Form Modal / Expandable Card */}
      {isSubmitOpen && (
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--accent-primary)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} /> Submit Daily Standup Update
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                1. What did you accomplish yesterday? *
              </label>
              <textarea
                className="textarea-field"
                rows={2}
                placeholder="Shipped Redis caching fix, reviewed PR #104..."
                value={yesterday}
                onChange={(e) => setYesterday(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                2. What is your main focus today? *
              </label>
              <textarea
                className="textarea-field"
                rows={2}
                placeholder="Hook up React AuthContext interceptors, test token renewals..."
                value={today}
                onChange={(e) => setToday(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                3. Any blockers or dependencies?
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="None, or waiting for API gateway deployment..."
                value={blockers}
                onChange={(e) => setBlockers(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setIsSubmitOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Post Update
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Standups Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {standups.map((std) => {
          const author = members.find((m) => m.id === std.userId) || {
            name: 'Remote Contributor',
            role: 'Specialist',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            timezone: 'PST'
          };

          const hasBlockers = std.blockers && std.blockers.toLowerCase() !== 'none';

          return (
            <div key={std.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Standup Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={author.avatar} alt={author.name} className="avatar" style={{ width: '38px', height: '38px' }} />
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{author.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {author.role} • <span style={{ color: 'var(--accent-primary)' }}>{author.timezone}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> {std.date}
                  </span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => likeStandup(std.id)}
                    style={{ gap: '6px' }}
                  >
                    <ThumbsUp size={15} style={{ color: 'var(--accent-primary)' }} />
                    <span>{std.likes}</span>
                  </button>
                </div>
              </div>

              {/* Standup Content Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Yesterday
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{std.yesterday}</div>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={14} /> Today's Goal
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{std.today}</div>
                </div>

                <div style={{ background: hasBlockers ? 'rgba(244, 63, 94, 0.1)' : 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: hasBlockers ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: hasBlockers ? 'var(--accent-rose)' : 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={14} /> Blockers
                  </div>
                  <div style={{ fontSize: '0.85rem', color: hasBlockers ? 'var(--accent-rose)' : 'var(--text-muted)' }}>{std.blockers}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
