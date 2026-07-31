export const INITIAL_MEMBERS = [
  {
    id: 'user-1',
    name: 'Elena Rostova',
    email: 'elena@syncpulse.io',
    role: 'Product Lead',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    timezone: 'PST',
    location: 'San Francisco, USA',
    status: 'online',
    statusText: 'Reviewing Q3 roadmap specs',
    utcOffset: -7
  },
  {
    id: 'user-2',
    name: 'Marcus Vance',
    email: 'marcus@syncpulse.io',
    role: 'Senior Fullstack Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    timezone: 'EST',
    location: 'New York, USA',
    status: 'deepwork',
    statusText: 'Refactoring API gateway endpoint',
    utcOffset: -4
  },
  {
    id: 'user-3',
    name: 'Aisha Patel',
    email: 'aisha@syncpulse.io',
    role: 'Lead UI/UX Designer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    timezone: 'GMT',
    location: 'London, UK',
    status: 'online',
    statusText: 'Designing glassmorphic system tokens',
    utcOffset: +1
  },
  {
    id: 'user-4',
    name: 'Kenji Takahashi',
    email: 'kenji@syncpulse.io',
    role: 'DevOps & Security Specialist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    timezone: 'JST',
    location: 'Tokyo, Japan',
    status: 'break',
    statusText: 'Coffee break ☕',
    utcOffset: +9
  },
  {
    id: 'user-5',
    name: 'Rohan Sharma',
    email: 'rohan@syncpulse.io',
    role: 'Backend Architect',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    timezone: 'IST',
    location: 'Bangalore, India',
    status: 'online',
    statusText: 'Optimizing Redis cache clusters',
    utcOffset: +5.5
  }
];

export const INITIAL_TASKS = [
  {
    id: 'task-101',
    title: 'Migrate Auth Service to JWT Refresh Tokens',
    description: 'Implement secure HTTP-only cookie storage for refresh tokens and update client-side AuthContext interceptors for seamless background renewal.',
    status: 'in_progress',
    priority: 'urgent',
    category: 'Backend',
    tags: ['Security', 'API', 'Auth'],
    assigneeIds: ['user-2', 'user-5'],
    dueDate: '2026-07-26',
    estimatedHours: 12,
    loggedHours: 7,
    subtasks: [
      { id: 'st-1', title: 'Implement refreshToken rotation in backend controller', completed: true },
      { id: 'st-2', title: 'Update React AuthContext interceptor logic', completed: true },
      { id: 'st-3', title: 'Write unit test suite for token expiration edge cases', completed: false }
    ],
    comments: [
      {
        id: 'c-1',
        authorId: 'user-5',
        text: 'The redis session TTL issue has been patched. Ready for frontend integration tests.',
        createdAt: '2026-07-23T08:30:00Z'
      }
    ]
  },
  {
    id: 'task-102',
    title: 'Design Async Standup Digest Component',
    description: 'Create responsive card interfaces displaying remote team daily updates, blocker highlights, and interactive reactions.',
    status: 'in_review',
    priority: 'high',
    category: 'Design',
    tags: ['UI/UX', 'Components', 'Figma'],
    assigneeIds: ['user-3'],
    dueDate: '2026-07-25',
    estimatedHours: 8,
    loggedHours: 8,
    subtasks: [
      { id: 'st-4', title: 'Figma high-fidelity prototype', completed: true },
      { id: 'st-5', title: 'Export design tokens & SVG assets', completed: true },
      { id: 'st-6', title: 'Review accessibility contrast ratio (WCAG 2.1)', completed: true }
    ],
    comments: [
      {
        id: 'c-2',
        authorId: 'user-1',
        text: 'Looks phenomenal! The glassmorphism borders make the blockers pop out nicely.',
        createdAt: '2026-07-23T09:15:00Z'
      }
    ]
  },
  {
    id: 'task-103',
    title: 'Setup Kubernetes Cluster Auto-scaling in EU Region',
    description: 'Configure HPA (Horizontal Pod Autoscaler) metrics for worker pods handling video transcoding and file synchronization.',
    status: 'todo',
    priority: 'urgent',
    category: 'DevOps',
    tags: ['K8s', 'AWS', 'Infrastructure'],
    assigneeIds: ['user-4'],
    dueDate: '2026-07-28',
    estimatedHours: 16,
    loggedHours: 2,
    subtasks: [
      { id: 'st-7', title: 'Define Prometheus alert manager rules', completed: false },
      { id: 'st-8', title: 'Stress test node group scaling triggers', completed: false }
    ],
    comments: []
  },
  {
    id: 'task-104',
    title: 'Interactive Timezone Overlap Clock Matrix',
    description: 'Build real-time matrix calculating overlapping active work hours between SF, NY, London, Bangalore, and Tokyo offices.',
    status: 'in_progress',
    priority: 'medium',
    category: 'Frontend',
    tags: ['React', 'Feature', 'Remote'],
    assigneeIds: ['user-2', 'user-3'],
    dueDate: '2026-07-27',
    estimatedHours: 10,
    loggedHours: 6,
    subtasks: [
      { id: 'st-9', title: 'UTC offset calculation utility', completed: true },
      { id: 'st-10', title: 'Overlapping active window indicator bar', completed: true },
      { id: 'st-11', title: 'Local time format toggle (12h / 24h)', completed: false }
    ],
    comments: []
  },
  {
    id: 'task-105',
    title: 'Sprint Burn-down & Workload Analytics Chart',
    description: 'Integrate interactive summary cards displaying sprint velocity, completion percentages, and member task allocation ratios.',
    status: 'done',
    priority: 'medium',
    category: 'Analytics',
    tags: ['Metrics', 'Dashboard', 'Charts'],
    assigneeIds: ['user-1'],
    dueDate: '2026-07-22',
    estimatedHours: 6,
    loggedHours: 6,
    subtasks: [
      { id: 'st-12', title: 'Data aggregation pipeline', completed: true },
      { id: 'st-13', title: 'Visual summary metrics component', completed: true }
    ],
    comments: [
      {
        id: 'c-3',
        authorId: 'user-1',
        text: 'Deployed to staging. All metric targets met for Sprint 42.',
        createdAt: '2026-07-22T16:45:00Z'
      }
    ]
  },
  {
    id: 'task-106',
    title: 'Audit Web Security & CORS Policies',
    description: 'Ensure cross-origin resource sharing headers are locked down to subdomains and perform dependency vulnerability audit.',
    status: 'todo',
    priority: 'low',
    category: 'DevOps',
    tags: ['Security', 'Audit'],
    assigneeIds: ['user-4', 'user-5'],
    dueDate: '2026-07-30',
    estimatedHours: 4,
    loggedHours: 0,
    subtasks: [
      { id: 'st-14', title: 'Run npm audit & fix high severity vulns', completed: false },
      { id: 'st-15', title: 'Verify Content-Security-Policy headers', completed: false }
    ],
    comments: []
  }
];

export const INITIAL_STANDUPS = [
  {
    id: 'std-1',
    userId: 'user-2',
    date: 'Today',
    yesterday: 'Finished Redis cache key structure & JWT refresh token handler.',
    today: 'Connecting AuthContext with frontend interceptors and testing cookie persistence.',
    blockers: 'None so far!',
    likes: 4
  },
  {
    id: 'std-2',
    userId: 'user-3',
    date: 'Today',
    yesterday: 'Exported dark glassmorphic design tokens and task modal wireframes.',
    today: 'Working on Timezone Matrix visual layout and responsive sidebar transitions.',
    blockers: 'Awaiting updated UX feedback on mobile view layout.',
    likes: 6
  },
  {
    id: 'std-3',
    userId: 'user-5',
    date: 'Today',
    yesterday: 'Patched DB connection pool leaks during peak background queue jobs.',
    today: 'Assisting Marcus with token session invalidation logic and load testing.',
    blockers: 'Staging DB migration needs DevOps approval.',
    likes: 3
  }
];
