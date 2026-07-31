import React, { createContext, useContext, useState, useEffect } from 'react';
import { tasksApi, standupsApi } from '../api/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { currentUser, addToast } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [standups, setStandups] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  const [activeView, setActiveView] = useState('kanban'); // 'kanban', 'list', 'timezones', 'standups', 'analytics'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAssignee, setSelectedAssignee] = useState('all');

  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Load tasks + standups from the backend (MongoDB) on mount
  useEffect(() => {
    (async () => {
      try {
        const [fetchedTasks, fetchedStandups] = await Promise.all([
          tasksApi.getAll(),
          standupsApi.getAll()
        ]);
        setTasks(fetchedTasks);
        setStandups(fetchedStandups);
      } catch (err) {
        console.error('Failed to load tasks from backend:', err);
        addToast('Could not reach the backend. Is the server running?', 'error');
      } finally {
        setIsLoadingTasks(false);
      }
    })();
  }, []);

  // Filtered Tasks Calculation
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesAssignee =
      selectedAssignee === 'all' || task.assigneeIds.includes(selectedAssignee);

    return matchesSearch && matchesPriority && matchesCategory && matchesAssignee;
  });

  const createTask = async (taskData) => {
    try {
      const newTask = await tasksApi.create({
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        category: taskData.category || 'General',
        tags: taskData.tags || ['Feature'],
        assigneeIds: taskData.assigneeIds || (currentUser ? [currentUser.id] : []),
        dueDate: taskData.dueDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        estimatedHours: Number(taskData.estimatedHours) || 8,
        subtasks: taskData.subtasks || []
      });

      setTasks((prev) => [newTask, ...prev]);
      setIsCreateModalOpen(false);
      addToast(`Task "${newTask.title}" created successfully!`, 'success');
    } catch (err) {
      addToast('Could not create task.', 'error');
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const updated = await tasksApi.update(taskId, updates);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      if (selectedTask?.id === taskId) setSelectedTask(updated);
    } catch (err) {
      addToast('Could not update task.', 'error');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await tasksApi.remove(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (selectedTask?.id === taskId) setSelectedTask(null);
      addToast('Task deleted', 'info');
    } catch (err) {
      addToast('Could not delete task.', 'error');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const updated = await tasksApi.updateStatus(taskId, newStatus);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      if (selectedTask?.id === taskId) setSelectedTask(updated);
      addToast(`Task status updated`, 'info');
    } catch (err) {
      addToast('Could not update task status.', 'error');
    }
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    try {
      const updated = await tasksApi.toggleSubtask(taskId, subtaskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      if (selectedTask?.id === taskId) setSelectedTask(updated);
    } catch (err) {
      addToast('Could not update subtask.', 'error');
    }
  };

  const addComment = async (taskId, text) => {
    if (!currentUser || !text.trim()) return;
    try {
      const updated = await tasksApi.addComment(taskId, currentUser.id, text.trim());
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      if (selectedTask?.id === taskId) setSelectedTask(updated);
      addToast('Comment added', 'success');
    } catch (err) {
      addToast('Could not add comment.', 'error');
    }
  };

  const logHours = async (taskId, hours) => {
    const num = Number(hours);
    if (isNaN(num) || num <= 0) return;
    try {
      const updated = await tasksApi.logHours(taskId, num);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      if (selectedTask?.id === taskId) setSelectedTask(updated);
      addToast(`Logged ${num} hour(s)`, 'success');
    } catch (err) {
      addToast('Could not log hours.', 'error');
    }
  };

  const addStandup = async (standupData) => {
    if (!currentUser) return;
    try {
      const newStandup = await standupsApi.create({
        userId: currentUser.id,
        date: 'Today',
        yesterday: standupData.yesterday,
        today: standupData.today,
        blockers: standupData.blockers || 'None'
      });
      setStandups((prev) => [newStandup, ...prev]);
      addToast('Daily standup update posted!', 'success');
    } catch (err) {
      addToast('Could not post standup.', 'error');
    }
  };

  const likeStandup = async (standupId) => {
    try {
      const updated = await standupsApi.like(standupId);
      setStandups((prev) => prev.map((s) => (s.id === standupId ? updated : s)));
    } catch (err) {
      addToast('Could not like standup.', 'error');
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        standups,
        isLoadingTasks,
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        selectedPriority,
        setSelectedPriority,
        selectedCategory,
        setSelectedCategory,
        selectedAssignee,
        setSelectedAssignee,
        selectedTask,
        setSelectedTask,
        isCreateModalOpen,
        setIsCreateModalOpen,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        toggleSubtask,
        addComment,
        logHours,
        addStandup,
        likeStandup
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
};
