import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { X, Plus, Calendar, Clock, Tag, Layers, Sparkles } from 'lucide-react';

export const CreateTaskModal = () => {
  const { members, currentUser } = useAuth();
  const { isCreateModalOpen, setIsCreateModalOpen, createTask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Frontend');
  const [tagsInput, setTagsInput] = useState('React, Feature');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [estimatedHours, setEstimatedHours] = useState('8');
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState(
    currentUser ? [currentUser.id] : []
  );

  if (!isCreateModalOpen) return null;

  const toggleAssignee = (id) => {
    if (selectedAssigneeIds.includes(id)) {
      setSelectedAssigneeIds(selectedAssigneeIds.filter((aId) => aId !== id));
    } else {
      setSelectedAssigneeIds([...selectedAssigneeIds, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tagsArr = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    createTask({
      title,
      description,
      priority,
      category,
      tags: tagsArr.length > 0 ? tagsArr : ['General'],
      dueDate,
      estimatedHours,
      assigneeIds: selectedAssigneeIds.length > 0 ? selectedAssigneeIds : [members[0].id],
      status: 'todo',
      subtasks: [
        { id: `st-init-1`, title: 'Initial setup & requirements audit', completed: false },
        { id: `st-init-2`, title: 'Implementation & code review', completed: false }
      ]
    });

    // Reset Form
    setTitle('');
    setDescription('');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
            Create New Remote Task
          </h2>
          <button className="btn btn-ghost btn-icon" onClick={() => setIsCreateModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
              Task Title *
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Optimize Database Query Performance"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
              Description & Specifications
            </label>
            <textarea
              className="textarea-field"
              rows={3}
              placeholder="Detail the expected deliverables, acceptance criteria, or relevant links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Priority Level
              </label>
              <select className="select-field" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🔵 Low</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Category
              </label>
              <select className="select-field" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Design">Design</option>
                <option value="DevOps">DevOps</option>
                <option value="Analytics">Analytics</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Estimate (Hours)
              </label>
              <input
                type="number"
                min="1"
                className="input-field"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Tags (Comma separated)
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="API, Security, UI"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Target Due Date
              </label>
              <input
                type="date"
                className="input-field"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Assignees Selector */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
              Assign Team Members
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {members.map((m) => {
                const isSelected = selectedAssigneeIds.includes(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => toggleAssignee(m.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      background: isSelected ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                      color: isSelected ? '#ffffff' : 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <img src={m.avatar} alt={m.name} className="avatar" style={{ width: '20px', height: '20px' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{m.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Plus size={18} /> Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
