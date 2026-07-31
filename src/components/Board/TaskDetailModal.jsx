import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import {
  X,
  Clock,
  CheckSquare,
  MessageSquare,
  Trash2,
  Send,
  Plus,
  Tag,
  UserPlus,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export const TaskDetailModal = () => {
  const { members, currentUser } = useAuth();
  const {
    selectedTask,
    setSelectedTask,
    updateTaskStatus,
    toggleSubtask,
    addComment,
    logHours,
    deleteTask,
    updateTask
  } = useTasks();

  const [commentInput, setCommentInput] = useState('');
  const [logHoursInput, setLogHoursInput] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  if (!selectedTask) return null;

  const assignees = members.filter((m) => selectedTask.assigneeIds.includes(m.id));

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(selectedTask.id, commentInput);
    setCommentInput('');
  };

  const handleLogHours = (e) => {
    e.preventDefault();
    if (!logHoursInput) return;
    logHours(selectedTask.id, logHoursInput);
    setLogHoursInput('');
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSt = {
      id: `st-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false
    };
    updateTask(selectedTask.id, {
      subtasks: [...selectedTask.subtasks, newSt]
    });
    setNewSubtaskTitle('');
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
      <div
        className="modal-content"
        style={{ maxWidth: '720px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
              {selectedTask.category}
            </span>
            <span className={`badge badge-${selectedTask.priority}`}>{selectedTask.priority}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteTask(selectedTask.id)}
              title="Delete Task"
            >
              <Trash2 size={16} />
            </button>
            <button className="btn btn-ghost btn-icon" onClick={() => setSelectedTask(null)}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Title & Description */}
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '8px' }}>
              {selectedTask.title}
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {selectedTask.description}
            </p>
          </div>

          {/* Quick Properties Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Status</div>
              <select
                className="select-field"
                value={selectedTask.status}
                onChange={(e) => updateTaskStatus(selectedTask.id, e.target.value)}
                style={{ fontSize: '0.85rem', padding: '4px 8px' }}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">Under Review</option>
                <option value="done">Completed</option>
              </select>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Due Date</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '4px' }}>
                <Calendar size={15} style={{ color: 'var(--accent-primary)' }} />
                {selectedTask.dueDate}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Time Tracked</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '4px' }}>
                <Clock size={15} style={{ color: 'var(--accent-emerald)' }} />
                {selectedTask.loggedHours}h / {selectedTask.estimatedHours}h
              </div>
            </div>
          </div>

          {/* Assignees Section */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Assigned Team Members
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {assignees.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <img src={m.avatar} alt={m.name} className="avatar" style={{ width: '22px', height: '22px' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{m.name}</span>
                  <span className="badge badge-tag">{m.timezone}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subtasks Section */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Checklist & Subtasks ({selectedTask.subtasks.filter((s) => s.completed).length}/{selectedTask.subtasks.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {selectedTask.subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => toggleSubtask(selectedTask.id, st.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => {}}
                    style={{ cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                  />
                  <span
                    style={{
                      fontSize: '0.88rem',
                      textDecoration: st.completed ? 'line-through' : 'none',
                      color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)'
                    }}
                  >
                    {st.title}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSubtask} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Add subtask item..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-secondary btn-sm">
                <Plus size={16} /> Add
              </button>
            </form>
          </div>

          {/* Log Time Form */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Log Work Hours
            </h4>
            <form onSubmit={handleLogHours} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="number"
                step="0.5"
                min="0.5"
                className="input-field"
                placeholder="Hours spent (e.g. 2.5)"
                value={logHoursInput}
                onChange={(e) => setLogHoursInput(e.target.value)}
                style={{ width: '200px', fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                <Clock size={16} /> Log Time
              </button>
            </form>
          </div>

          {/* Discussion & Comments */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
              Discussion Thread ({selectedTask.comments.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {selectedTask.comments.map((c) => {
                const author = members.find((m) => m.id === c.authorId) || {
                  name: 'Team Member',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
                };
                return (
                  <div key={c.id} style={{ display: 'flex', gap: '12px' }}>
                    <img src={author.avatar} alt={author.name} className="avatar" style={{ width: '32px', height: '32px' }} />
                    <div
                      style={{
                        flex: 1,
                        background: 'var(--bg-secondary)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{author.name}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>{c.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Write a comment or mention team member..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                <Send size={16} /> Comment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
