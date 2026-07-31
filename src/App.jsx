import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTasks } from './context/TaskContext';

import { Navbar } from './components/Layout/Navbar';
import { Sidebar } from './components/Layout/Sidebar';

import { KanbanBoard } from './components/Board/KanbanBoard';
import { TaskList } from './components/Board/TaskList';
import { TaskDetailModal } from './components/Board/TaskDetailModal';
import { CreateTaskModal } from './components/Board/CreateTaskModal';

import { TimezoneMatrix } from './components/Remote/TimezoneMatrix';
import { AsyncStandups } from './components/Remote/AsyncStandups';
import { AnalyticsDashboard } from './components/Analytics/AnalyticsDashboard';

import { AuthModal } from './components/Auth/AuthModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainApp = () => {
  const { activeView } = useTasks();
  const { toasts } = useAuth();

  return (
    <div className="app-layout">
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar />

        <div className="view-container">
          {activeView === 'kanban' && <KanbanBoard />}
          {activeView === 'list' && <TaskList />}
          {activeView === 'timezones' && <TimezoneMatrix />}
          {activeView === 'standups' && <AsyncStandups />}
          {activeView === 'analytics' && <AnalyticsDashboard />}
        </div>
      </div>

      {/* Modals & Dialogs */}
      <TaskDetailModal />
      <CreateTaskModal />
      <AuthModal />

      {/* Toast System */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            {t.type === 'success' && <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />}
            {t.type === 'error' && <AlertCircle size={18} style={{ color: 'var(--accent-rose)' }} />}
            {t.type === 'info' && <Info size={18} style={{ color: 'var(--accent-primary)' }} />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <MainApp />
      </TaskProvider>
    </AuthProvider>
  );
}
