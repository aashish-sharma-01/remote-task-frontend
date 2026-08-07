const API_URL = 'http://localhost:5000/api';
// ---- Auth token handling ----
// Token is kept in memory + localStorage so it survives a page refresh
let authToken = localStorage.getItem('syncpulse_token') || null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('syncpulse_token', token);
  } else {
    localStorage.removeItem('syncpulse_token');
  }
};

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data;
}

// ---- Normalizers: turn Mongo's _id into the id field the UI already uses ----

export const normalizeUser = (u) => ({
  ...u,
  id: u._id
});

export const normalizeTask = (t) => ({
  ...t,
  id: t._id,
  dueDate: t.dueDate ? String(t.dueDate).slice(0, 10) : '',
  subtasks: (t.subtasks || []).map((s) => ({ ...s, id: s._id })),
  comments: (t.comments || []).map((c) => ({ ...c, id: c._id }))
});

export const normalizeStandup = (s) => ({
  ...s,
  id: s._id
});

// ---- Users ----

export const usersApi = {
  getAll: async () => {
    const data = await request('/users');
    return data.map(normalizeUser);
  },
  login: async (email, password) => {
    const data = await request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setAuthToken(data.token);
    return normalizeUser(data.user);
  },
  signup: async (userData) => {
    const data = await request('/users/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    setAuthToken(data.token);
    return normalizeUser(data.user);
  },
  update: async (id, updates) => {
    const data = await request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    return normalizeUser(data);
  }
};

// ---- Tasks ----

export const tasksApi = {
  getAll: async () => {
    const data = await request('/tasks');
    return data.map(normalizeTask);
  },
  create: async (taskData) => {
    const data = await request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
    return normalizeTask(data);
  },
  update: async (id, updates) => {
    const data = await request(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    return normalizeTask(data);
  },
  remove: async (id) => {
    await request(`/tasks/${id}`, { method: 'DELETE' });
  },
  updateStatus: async (id, status) => {
    const data = await request(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    return normalizeTask(data);
  },
  toggleSubtask: async (id, subtaskId) => {
    const data = await request(`/tasks/${id}/subtasks/${subtaskId}`, {
      method: 'PATCH'
    });
    return normalizeTask(data);
  },
  addComment: async (id, authorId, text) => {
    const data = await request(`/tasks/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ authorId, text })
    });
    return normalizeTask(data);
  },
  logHours: async (id, hours) => {
    const data = await request(`/tasks/${id}/log-hours`, {
      method: 'PATCH',
      body: JSON.stringify({ hours })
    });
    return normalizeTask(data);
  }
};

// ---- Standups ----

export const standupsApi = {
  getAll: async () => {
    const data = await request('/standups');
    return data.map(normalizeStandup);
  },
  create: async (standupData) => {
    const data = await request('/standups', {
      method: 'POST',
      body: JSON.stringify(standupData)
    });
    return normalizeStandup(data);
  },
  like: async (id) => {
    const data = await request(`/standups/${id}/like`, { method: 'PATCH' });
    return normalizeStandup(data);
  }
};
