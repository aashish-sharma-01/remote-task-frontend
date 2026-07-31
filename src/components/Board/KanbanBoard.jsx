import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskCard } from './TaskCard';
import { Plus, Circle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const KanbanBoard = () => {
  const { filteredTasks, setIsCreateModalOpen, updateTaskStatus } = useTasks();

  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      color: 'var(--text-muted)',
      icon: Circle
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      color: 'var(--accent-primary)',
      icon: Clock
    },
    {
      id: 'in_review',
      title: 'Under Review',
      color: 'var(--accent-amber)',
      icon: AlertCircle
    },
    {
      id: 'done',
      title: 'Completed',
      color: 'var(--accent-emerald)',
      icon: CheckCircle2
    }
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTaskStatus(taskId, columnId);
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(270px, 1fr))',
        gap: '20px',
        alignItems: 'start',
        overflowX: 'auto',
        paddingBottom: '20px'
      }}
    >
      {columns.map((col) => {
        const columnTasks = filteredTasks.filter((t) => t.status === col.id);
        const Icon = col.icon;

        return (
          <div
            key={col.id}
            className="glass-panel"
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              minHeight: '650px',
              background: 'rgba(30, 41, 59, 0.4)'
            }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon size={16} style={{ color: col.color }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{col.title}</h3>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {columnTasks.length}
                </span>
              </div>

              <button
                className="btn btn-ghost btn-icon btn-sm"
                onClick={() => setIsCreateModalOpen(true)}
                title={`Add task to ${col.title}`}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Task Cards Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {columnTasks.length === 0 ? (
                <div
                  style={{
                    padding: '30px 16px',
                    textAlign: 'center',
                    border: '2px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-muted)',
                    fontSize: '0.82rem'
                  }}
                >
                  No tasks in {col.title.toLowerCase()}
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
                  >
                    <TaskCard task={task} />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
