import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import {
  Clock,
  CheckSquare,
  MessageSquare,
  MoreVertical,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const TaskCard = ({ task }) => {
  const { members } = useAuth();
  const { setSelectedTask, updateTaskStatus } = useTasks();

  const assignees = members.filter((m) => task.assigneeIds.includes(m.id));
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const subtaskRatio = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const priorityBadgeClass = {
    urgent: 'badge-urgent',
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low'
  }[task.priority];

  return (
    <div
      className="glass-panel"
      style={{
        padding: '16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative'
      }}
      onClick={() => setSelectedTask(task)}
    >
      {/* Top Header: Category & Priority */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--accent-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}
        >
          {task.category}
        </span>
        <span className={`badge ${priorityBadgeClass}`}>{task.priority}</span>
      </div>

      {/* Title & Description */}
      <div>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px', lineHeight: '1.3' }}>
          {task.title}
        </h4>
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {task.description}
        </p>
      </div>

      {/* Subtasks Progress */}
      {totalSubtasks > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckSquare size={13} /> {completedSubtasks}/{totalSubtasks} Subtasks
            </span>
            <span>{Math.round(subtaskRatio)}%</span>
          </div>
          <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${subtaskRatio}%`,
                background: subtaskRatio === 100 ? 'var(--accent-emerald)' : 'var(--accent-primary)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {task.tags.map((tag) => (
            <span key={tag} className="badge badge-tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Info: Due Date, Comments Count, Assignee Avatars */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-color)',
          marginTop: '4px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> {task.dueDate}
          </span>
          {task.comments.length > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MessageSquare size={13} /> {task.comments.length}
            </span>
          )}
        </div>

        {/* Assignees */}
        <div className="avatar-group">
          {assignees.map((a) => (
            <img key={a.id} src={a.avatar} alt={a.name} title={a.name} className="avatar" style={{ width: '24px', height: '24px' }} />
          ))}
        </div>
      </div>
    </div>
  );
};
