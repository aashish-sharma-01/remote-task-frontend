import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { BarChart3, CheckCircle2, Clock, Zap, AlertTriangle, Users, PieChart } from 'lucide-react';

export const AnalyticsDashboard = () => {
  const { members } = useAuth();
  const { tasks } = useTasks();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalLoggedHours = tasks.reduce((acc, t) => acc + (t.loggedHours || 0), 0);
  const totalEstHours = tasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);

  const urgentCount = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length;

  const statusCounts = {
    todo: tasks.filter((t) => t.status === 'todo').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    in_review: tasks.filter((t) => t.status === 'in_review').length,
    done: tasks.filter((t) => t.status === 'done').length
  };

  const priorityCounts = {
    urgent: tasks.filter((t) => t.priority === 'urgent').length,
    high: tasks.filter((t) => t.priority === 'high').length,
    medium: tasks.filter((t) => t.priority === 'medium').length,
    low: tasks.filter((t) => t.priority === 'low').length
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BarChart3 className="accent-icon" style={{ color: 'var(--accent-primary)' }} size={24} />
          Sprint Velocity & Team Workload Analytics
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Overview of Sprint 42 deliverable stats, time tracking metrics, and remote team member workload balances.
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Task Completion</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{completionPercentage}%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{completedTasks} of {totalTasks} tasks</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Hours Logged</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{totalLoggedHours}h</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Estimated total: {totalEstHours}h</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-secondary)' }}>
            <Zap size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Sprint Velocity</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>42 pts / wk</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>+14% vs last sprint</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Urgent Blockers</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{urgentCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Needs immediate review</div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Status Breakdown & Team Member Workload */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Status Distribution */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} style={{ color: 'var(--accent-primary)' }} /> Task Status Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>To Do</span>
                <span style={{ fontWeight: 700 }}>{statusCounts.todo} tasks</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(statusCounts.todo / totalTasks) * 100}%`, background: 'var(--text-muted)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>In Progress</span>
                <span style={{ fontWeight: 700 }}>{statusCounts.in_progress} tasks</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(statusCounts.in_progress / totalTasks) * 100}%`, background: 'var(--accent-primary)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>Under Review</span>
                <span style={{ fontWeight: 700 }}>{statusCounts.in_review} tasks</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(statusCounts.in_review / totalTasks) * 100}%`, background: 'var(--accent-amber)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>Completed</span>
                <span style={{ fontWeight: 700 }}>{statusCounts.done} tasks</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(statusCounts.done / totalTasks) * 100}%`, background: 'var(--accent-emerald)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Team Workload Allocation */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} style={{ color: 'var(--accent-secondary)' }} /> Team Member Workload
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {members.map((m) => {
              const memberTasks = tasks.filter((t) => t.assigneeIds.includes(m.id));
              const memberHours = memberTasks.reduce((acc, t) => acc + (t.loggedHours || 0), 0);

              return (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={m.avatar} alt={m.name} className="avatar" style={{ width: '28px', height: '28px' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{m.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.role}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                      {memberTasks.length} Tasks
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{memberHours} hrs logged</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
