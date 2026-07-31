import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Globe, Clock, Sun, Moon, Coffee, Zap, MessageSquare } from 'lucide-react';

export const TimezoneMatrix = () => {
  const { members } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCityTime = (utcOffset) => {
    const utc = time.getTime() + time.getTimezoneOffset() * 60000;
    const cityDate = new Date(utc + 3600000 * utcOffset);
    return cityDate;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Info */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe className="accent-icon" style={{ color: 'var(--accent-primary)' }} size={24} />
            Global Timezone Overlap Matrix
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Visualize real-time locations and synchronous working hour overlaps across your remote team.
          </p>
        </div>
        <div className="badge badge-medium" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
          <Clock size={16} /> Live UTC Sync
        </div>
      </div>

      {/* Live Clocks Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {members.map((m) => {
          const cityTime = getCityTime(m.utcOffset);
          const hour = cityTime.getHours();
          const isDaytime = hour >= 8 && hour <= 19;

          return (
            <div key={m.id} className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={m.avatar} alt={m.name} className="avatar" style={{ width: '32px', height: '32px' }} />
                    <span className={`presence-dot presence-${m.status}`} style={{ position: 'absolute', bottom: 0, right: 0, border: '2px solid var(--bg-secondary)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{m.name.split(' ')[0]}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.location}</div>
                  </div>
                </div>
                {isDaytime ? <Sun size={18} style={{ color: 'var(--accent-amber)' }} /> : <Moon size={18} style={{ color: 'var(--accent-primary)' }} />}
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-code)' }}>
                  {cityTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {m.timezone} (UTC {m.utcOffset >= 0 ? `+${m.utcOffset}` : m.utcOffset})
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Status:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.statusText || m.status}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 24-Hour Work Overlap Matrix Bar */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
          24-Hour Team Overlap Timeline (Green = Active Work Window)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {members.map((m) => {
            const currentHour = getCityTime(m.utcOffset).getHours();
            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '140px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src={m.avatar} alt={m.name} className="avatar" style={{ width: '24px', height: '24px' }} />
                  <span>{m.name.split(' ')[0]} ({m.timezone})</span>
                </div>

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', gap: '4px' }}>
                  {hours.map((h) => {
                    // Estimate local hour for member
                    const localH = (h + m.utcOffset + 24) % 24;
                    const isWorkingHour = localH >= 9 && localH <= 17;
                    const isCurrent = Math.floor(localH) === Math.floor(currentHour);

                    let bg = 'var(--bg-tertiary)';
                    if (isWorkingHour) bg = 'rgba(16, 185, 129, 0.25)';
                    if (isCurrent) bg = 'var(--accent-primary)';

                    return (
                      <div
                        key={h}
                        title={`Hour UTC ${h}:00 -> Local ${localH.toFixed(0)}:00 (${isWorkingHour ? 'Working' : 'Off-hours'})`}
                        style={{
                          height: '24px',
                          borderRadius: '4px',
                          background: bg,
                          border: isCurrent ? '2px solid var(--accent-primary)' : '1px solid transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'center',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: isCurrent ? '#fff' : 'var(--text-muted)'
                        }}
                      >
                        {h}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
