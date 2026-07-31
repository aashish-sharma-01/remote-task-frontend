import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { Clock, CheckSquare, MessageSquare, ArrowUpDown, ChevronRight } from 'lucide-react';

export const TaskList = () => {
  const { members } = useAuth();
  const { filteredTasks, setSelectedTask, updateTaskStatus } = useTasks();
  const [sortField, setSortField] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Task Matrix Directory ({sortedTasks.length})</h3>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
            <th style={{ padding: '12px 10px', cursor: 'pointer' }} onClick={() => toggleSort('title')}>
              Task Title <ArrowUpDown size={12} />
            </th>
            <th style={{ padding: '12px 10px', cursor: 'pointer' }} onClick={() => toggleSort('status')}>
              Status <ArrowUpDown size={12} />
            </th>
            <th style={{ padding: '12px 10px', cursor: 'pointer' }} onClick={() => toggleSort('priority')}>
              Priority <ArrowUpDown size={12} />
            </th>
            <th style={{ padding: '12px 10px' }}>Category</th>
            <th style={{ padding: '12px 10px' }}>Assignees</th>
            <th style={{ padding: '12px 10px', cursor: 'pointer' }} onClick={() => toggleSort('dueDate')}>
              Due Date <ArrowUpDown size={12} />
            </th>
            <th style={{ padding: '12px 10px' }}>Hours</th>
            <th style={{ padding: '12px 10px', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No tasks matching the selected filters.
              </td>
            </tr>
          ) : (
            sortedTasks.map((task) => {
              const assignees = members.filter((m) => task.assigneeIds.includes(m.id));
              return (
                <tr
                  key={task.id}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'var(--transition-fast)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => setSelectedTask(task)}
                >
                  <td style={{ padding: '14px 10px', fontWeight: 600 }}>
                    <div>{task.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {task.subtasks.length} subtasks • {task.comments.length} comments
                    </div>
                  </td>
                  <td style={{ padding: '14px 10px' }} onClick={(e) => e.stopPropagation()}>
                    <select
                      className="select-field"
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      style={{ fontSize: '0.78rem', padding: '4px 8px', height: '30px', width: 'auto' }}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="in_review">Under Review</option>
                      <option value="done">Completed</option>
                    </select>
                  </td>
                  <td style={{ padding: '14px 10px' }}>
                    <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                  </td>
                  <td style={{ padding: '14px 10px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    {task.category}
                  </td>
                  <td style={{ padding: '14px 10px' }}>
                    <div className="avatar-group">
                      {assignees.map((a) => (
                        <img key={a.id} src={a.avatar} alt={a.name} title={a.name} className="avatar" style={{ width: '24px', height: '24px' }} />
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '14px 10px', color: 'var(--text-secondary)' }}>{task.dueDate}</td>
                  <td style={{ padding: '14px 10px', fontSize: '0.82rem' }}>
                    <span style={{ fontWeight: 700 }}>{task.loggedHours}h</span> / {task.estimatedHours}h
                  </td>
                  <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelectedTask(task)}>
                      View <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
