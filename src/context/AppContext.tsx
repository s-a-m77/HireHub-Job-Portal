import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { FIREBASE_ENABLED, firestore } from '@/firebase';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import type {
  User,
  Job,
  Application,
  Message,
  MessageReply,
  Page,
  UserRole,
  AdminMessage,
  StudentMessage,
  StudentMessageReply,
  ContactMessage,
  Announcement,
} from '@/types';
import { useAuth } from '@/context/AuthContext';

interface AppState {
  users: User[];
  jobs: Job[];
  applications: Application[];
  messages: Message[];
  adminMessages: AdminMessage[];
  studentMessages: StudentMessage[];
  announcements: Announcement[];
  currentUser: User | null;
  currentPage: Page;
  selectedJobId: string | null;
  searchQuery: string;
  filterType: string;
  location: string;
  theme: 'light' | 'dark';
}

interface AppContextType extends AppState {
  navigate: (page: Page, jobId?: string) => void;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  register: (user: Omit<User, 'uid' | 'id' | 'createdAt'>, password?: string) => Promise<boolean>;
  postJob: (job: Omit<Job, 'id' | 'postedDate' | 'applicantCount'>) => void;
  updateJob: (job: Job) => void;
  deleteJob: (jobId: string) => void;
  applyForJob: (jobId: string, coverLetter: string) => boolean;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  approveEmployer: (employerId: string) => void;
  rejectEmployer: (employerId: string) => void;
  setSearchQuery: (q: string) => void;
  setFilterType: (f: string) => void;
  setLocation: (l: string) => void;
  toggleTheme: () => void;
  getJobById: (id: string) => Job | undefined;
  getApplicationsForJob: (jobId: string) => Application[];
  getApplicationsForStudent: (studentId: string) => Application[];
  getJobsForEmployer: (employerId: string) => Job[];
  getStudents: () => User[];
  getEmployers: () => User[];
  hasApplied: (jobId: string) => boolean;
  sendMessage: (subject: string, body: string) => void;
  getMessagesForAdmin: () => Message[];
  getUnreadMessagesForAdminCount: () => number;
  markMessageAsRead: (messageId: string) => void;
  replyToMessage: (messageId: string, replyBody: string) => void;
  sendAdminMessage: (employerId: string, subject: string, body: string) => void;
  getAdminMessagesForEmployer: (employerId: string) => AdminMessage[];
  markAdminMessageAsRead: (messageId: string) => void;
  acceptAdminMessage: (messageId: string) => void;
  rejectAdminMessage: (messageId: string) => void;
  getUnreadAdminMessagesCount: (employerId: string) => number;
  sendStudentMessage: (studentId: string, subject: string, body: string) => void;
  getMessagesForStudent: (studentId: string) => StudentMessage[];
  getUnreadStudentMessagesCount: (studentId: string) => number;
  markStudentMessageAsRead: (messageId: string) => void;
  replyToStudentMessage: (messageId: string, replyBody: string) => void;
  getMessagesForEmployerFromStudent: (employerId: string) => StudentMessage[];
  deleteStudentMessage: (messageId: string) => void;
  deleteEmployerMessage: (messageId: string) => void;
  sendMessageToEmployer: (employerId: string, subject: string, body: string) => void;
  getUnreadMessagesFromStudentCount: (employerId: string) => number;
  sendContactMessage: (name: string, email: string, subject: string, message: string) => void;
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'postedDate' | 'postedBy'>) => void;
  updateAnnouncement: (announcement: Announcement) => void;
  deleteAnnouncement: (announcementId: string) => void;
  getAnnouncementsForUser: (userRole: UserRole) => Announcement[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

/* -------------------- SEED USERS -------------------- */
const SEED_USERS: User[] = [
  {
    uid: 'admin1',
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@hirehub.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    uid: 'emp1',
    id: 'emp1',
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    role: 'employer',
    companyName: 'TechCorp Solutions',
    companyLogo: '🏢',
    companyDescription:
      'Leading technology solutions provider specializing in AI and cloud computing. We build the future of enterprise software.',
    companyWebsite: 'https://techcorp.example.com',
    companySize: '500-1000',
    industry: 'Technology',
    companyLocation: 'San Francisco, CA',
    isApproved: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    uid: 'emp2',
    id: 'emp2',
    name: 'Michael Chen',
    email: 'michael@designhub.com',
    role: 'employer',
    companyName: 'DesignHub Creative',
    companyLogo: '🎨',
    companyDescription:
      'Award-winning creative agency focused on brand identity, UX/UI design, and digital marketing campaigns.',
    companyWebsite: 'https://designhub.example.com',
    companySize: '50-200',
    industry: 'Design & Creative',
    companyLocation: 'New York, NY',
    isApproved: true,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    uid: 'emp3',
    id: 'emp3',
    name: 'Emily Rodriguez',
    email: 'emily@greenenergy.com',
    role: 'employer',
    companyName: 'GreenEnergy Inc',
    companyLogo: '🌱',
    companyDescription:
      'Pioneering renewable energy solutions for a sustainable future. Solar, wind, and battery storage technologies.',
    companyWebsite: 'https://greenenergy.example.com',
    companySize: '200-500',
    industry: 'Energy & Environment',
    companyLocation: 'Austin, TX',
    isApproved: true,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    uid: 'emp4',
    id: 'emp4',
    name: 'David Park',
    email: 'david@financeplus.com',
    role: 'employer',
    companyName: 'FinancePlus',
    companyLogo: '💰',
    companyDescription:
      'Modern fintech company revolutionizing personal and business banking with cutting-edge technology.',
    companyWebsite: 'https://financeplus.example.com',
    companySize: '1000+',
    industry: 'Finance & Banking',
    companyLocation: 'Chicago, IL',
    isApproved: true,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    uid: 'emp5',
    id: 'emp5',
    name: 'Your Company Name',
    email: 'your@email.com',
    role: 'employer',
    companyName: 'Your Company',
    companyLogo: '🏢',
    companyDescription: 'Your company description here.',
    companyWebsite: 'https://yourcompany.com',
    companySize: '50-200',
    industry: 'Technology',
    companyLocation: 'Your City, Country',
    isApproved: false,
    createdAt: new Date().toISOString(),
  },
  {
    uid: 'stu1',
    id: 'stu1',
    name: 'Alex Thompson',
    email: 'alex@student.com',
    role: 'student',
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    education: 'BS Computer Science - Stanford University',
    bio: 'Passionate software engineering student looking for full-time opportunities.',
    phone: '+1-555-0101',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

/* -------------------- SEED JOBS -------------------- */
const SEED_JOBS: Job[] = [
  {
    id: 'job1',
    employerId: 'emp1',
    companyName: 'TechCorp Solutions',
    companyLogo: '🏢',
    title: 'Senior Frontend Developer',
    description:
      'We are looking for an experienced Frontend Developer to join our team and help build next-generation web applications. You will work with React, TypeScript, and modern web technologies to create beautiful, performant user interfaces.\n\nResponsibilities:\n- Build and maintain complex web applications\n- Collaborate with designers and backend engineers\n- Write clean, testable code\n- Mentor junior developers',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $160,000',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'CSS/Tailwind expertise', 'Git version control'],
    category: 'Engineering',
    postedDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 28 * 86400000).toISOString(),
    status: 'active',
    applicantCount: 0,
  },
  {
    id: 'job2',
    employerId: 'emp1',
    companyName: 'TechCorp Solutions',
    companyLogo: '🏢',
    title: 'Backend Engineer - Python',
    description:
      'Join our backend team to design and implement scalable microservices. You will work on distributed systems that process millions of requests daily.\n\nResponsibilities:\n- Design and implement REST APIs\n- Optimize database queries and system performance\n- Work with cloud services (AWS/GCP)\n- Participate in code reviews',
    location: 'Remote',
    type: 'Full-time',
    salary: '$130,000 - $170,000',
    requirements: ['Python/Django experience', 'SQL & NoSQL databases', 'REST API design', 'Cloud services experience'],
    category: 'Engineering',
    postedDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 25 * 86400000).toISOString(),
    status: 'active',
    applicantCount: 0,
  },
  {
    id: 'job3',
    employerId: 'emp2',
    companyName: 'DesignHub Creative',
    companyLogo: '🎨',
    title: 'UX/UI Designer',
    description:
      'We need a talented UX/UI Designer to create intuitive and visually stunning designs for our clients. You will work on a variety of projects from mobile apps to enterprise platforms.\n\nResponsibilities:\n- Create wireframes, prototypes, and high-fidelity designs\n- Conduct user research and usability testing\n- Maintain and evolve our design system\n- Present designs to stakeholders',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$90,000 - $130,000',
    requirements: ['Figma expertise', 'Portfolio required', 'User research skills', '3+ years experience'],
    category: 'Design',
    postedDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
    status: 'active',
    applicantCount: 0,
  },
  {
    id: 'job4',
    employerId: 'emp2',
    companyName: 'DesignHub Creative',
    companyLogo: '🎨',
    title: 'Graphic Design Intern',
    description:
      'Great opportunity for design students to gain real-world experience at a top creative agency. You will assist the design team on client projects and internal branding initiatives.\n\nWhat you will learn:\n- Professional design workflow\n- Client communication\n- Brand identity development\n- Print and digital design',
    location: 'New York, NY',
    type: 'Internship',
    salary: '$20/hour',
    requirements: ['Currently enrolled in design program', 'Adobe Creative Suite', 'Strong visual skills', 'Eagerness to learn'],
    category: 'Design',
    postedDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 20 * 86400000).toISOString(),
    status: 'active',
    applicantCount: 0,
  },
  {
    id: 'job5',
    employerId: 'emp3',
    companyName: 'GreenEnergy Inc',
    companyLogo: '🌱',
    title: 'Environmental Engineer',
    description:
      'Help us design and implement sustainable energy solutions. You will work on cutting-edge solar and wind energy projects across the country.\n\nResponsibilities:\n- Design renewable energy systems\n- Conduct environmental impact assessments\n- Manage project timelines and budgets\n- Collaborate with regulatory agencies',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$95,000 - $125,000',
    requirements: ['Environmental Engineering degree', 'Renewable energy experience', 'AutoCAD skills', 'PE license preferred'],
    category: 'Engineering',
    postedDate: new Date(Date.now() - 4 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 22 * 86400000).toISOString(),
    status: 'active',
    applicantCount: 0,
  },
  {
    id: 'job6',
    employerId: 'emp3',
    companyName: 'GreenEnergy Inc',
    companyLogo: '🌱',
    title: 'Marketing Coordinator',
    description:
      'We are looking for a Marketing Coordinator to help spread the word about clean energy. You will manage social media, create content, and coordinate marketing campaigns.\n\nResponsibilities:\n- Manage social media accounts\n- Create compelling content\n- Coordinate events and trade shows\n- Analyze marketing metrics',
    location: 'Austin, TX',
    type: 'Part-time',
    salary: '$45,000 - $55,000',
    requirements: ['Marketing degree', 'Social media expertise', 'Content creation skills', 'Analytics experience'],
    category: 'Marketing',
    postedDate: new Date(Date.now() - 6 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 18 * 86400000).toISOString(),
    status: 'active',
    applicantCount: 0,
  },
  {
    id: 'job7',
    employerId: 'emp4',
    companyName: 'FinancePlus',
    companyLogo: '💰',
    title: 'Data Analyst',
    description:
      'Analyze financial data and build reports that drive business decisions. You will work with large datasets and create visualizations for executive leadership.\n\nResponsibilities:\n- Build dashboards and reports\n- Analyze financial trends\n- Create data pipelines\n- Present findings to leadership',
    location: 'Chicago, IL',
    type: 'Full-time',
    salary: '$85,000 - $110,000',
    requirements: ['SQL proficiency', 'Python/R experience', 'Tableau or Power BI', 'Finance knowledge'],
    category: 'Data & Analytics',
    postedDate: new Date(Date.now() - 7 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 15 * 86400000).toISOString(),
    status: 'active',
    applicantCount: 0,
  },
  {
    id: 'job8',
    employerId: 'emp4',
    companyName: 'FinancePlus',
    companyLogo: '💰',
    title: 'Software Engineering Intern',
    description:
      'Summer internship opportunity for CS students interested in fintech. Work alongside experienced engineers on production features.\n\nWhat we offer:\n- Mentorship program\n- Real project ownership\n- Lunch & learns\n- Potential full-time offer',
    location: 'Chicago, IL',
    type: 'Internship',
    salary: '$35/hour',
    requirements: ['CS major (Junior/Senior)', 'Java or Python', 'Basic data structures', 'Team player'],
    category: 'Engineering',
    postedDate: new Date(Date.now() - 8 * 86400000).toISOString(),
    deadline: new Date(Date.now() + 12 * 86400000).toISOString(),
    status: 'active',
    applicantCount: 0,
  },
];

const STORAGE_KEY = 'hirehub_state';

function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { }
  return null;
}

async function saveState(state: Partial<AppState>) {
  try {
    const existing = loadState() || {};
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...state }));
  } catch { }

  if (FIREBASE_ENABLED && firestore) {
    try {
      console.log('Attempting Firestore write', { FIREBASE_ENABLED, firestorePresent: !!firestore });
      const ref = doc(firestore, 'app', 'state');
      await setDoc(ref, state, { merge: true });
      console.log('Saved state to Firestore (app/state)');
    } catch (e) {
      console.warn('Failed to save state to Firestore', e);
    }
  }
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  const [state, setState] = useState<AppState>(() => {
    const saved = loadState();
    // Get initial page from URL
    const path = window.location.pathname.slice(1) || 'home';
    const initialPage = (path === '' ? 'home' : path) as Page;
    // For now, keep seed data for jobs and applications, but users will come from Firestore
    // Note: Don't initialize currentUser here - it will be synced via useEffect
    return {
      users: saved?.users || SEED_USERS, // Fallback to seed users for demo
      jobs: saved?.jobs || SEED_JOBS,
      applications: saved?.applications || [],
      messages: saved?.messages || [],
      adminMessages: saved?.adminMessages || [],
      studentMessages: saved?.studentMessages || [],
      announcements: saved?.announcements || [],
      currentUser: null, // Will be synced from AuthContext via useEffect
      currentPage: initialPage || 'home',
      selectedJobId: null,
      searchQuery: '',
      filterType: '',
      location: '',
      theme: 'dark' as 'light' | 'dark',
    };
  });

  /* ---------------- FIREBASE LOAD ---------------- */
  useEffect(() => {
    if (!FIREBASE_ENABLED || !firestore) return;

    let cancelled = false;
    (async () => {
      try {
        const ref = doc(firestore, 'app', 'state');
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            users: state.users,
            jobs: state.jobs,
            applications: state.applications,
            messages: state.messages,
            adminMessages: state.adminMessages,
            studentMessages: state.studentMessages,
            currentUser: state.currentUser,
            theme: state.theme,
          });
          return;
        }
        const data = snap.data();
        if (cancelled) return;
        setState(prev => ({
          ...prev,
          // Let the 'users' collection listener manage the users state
          jobs: (data.jobs as Job[] | undefined) || prev.jobs,
          applications: (data.applications as Application[] | undefined) || prev.applications,
          messages: (data.messages as Message[] | undefined) || prev.messages,
          adminMessages: (data.adminMessages as AdminMessage[] | undefined) || prev.adminMessages,
          studentMessages:
            (data.studentMessages as StudentMessage[] | undefined) || prev.studentMessages,
          currentUser: (data.currentUser as User | undefined) || prev.currentUser,
          theme: (data.theme as 'light' | 'dark' | undefined) || prev.theme,
        }));
      } catch (e) {
        console.warn('Failed to load state from Firestore', e);
      }
    })();

    // Set up real-time listener for the independent 'users' collection
    const usersCollectionRef = collection(firestore, 'users');
    const unsubscribeUsers = onSnapshot(usersCollectionRef, (snapshot) => {
      const dbUsers: User[] = [];
      snapshot.forEach((doc) => {
        dbUsers.push(doc.data() as User);
      });
      if (!cancelled) {
        setState(prev => {
          // Merge dbUsers with SEED_USERS that don't exist in DB to not break demo mode
          const newUsersMap = new Map<string, User>();
          SEED_USERS.forEach(su => newUsersMap.set(su.id, su));
          dbUsers.forEach(dbu => newUsersMap.set(dbu.id, dbu));
          return { ...prev, users: Array.from(newUsersMap.values()) };
        });
      }
    }, (error) => {
      console.warn('Failed to listen to users collection:', error);
    });

    return () => {
      cancelled = true;
      unsubscribeUsers();
    };
  }, []);

  useEffect(() => {
    void saveState({
      // Do not save users into app/state as they are handled in their own collection
      jobs: state.jobs,
      applications: state.applications,
      messages: state.messages,
      adminMessages: state.adminMessages,
      studentMessages: state.studentMessages,
      currentUser: state.currentUser,
      theme: state.theme,
    });
  }, [
    state.jobs,
    state.applications,
    state.messages,
    state.adminMessages,
    state.studentMessages,
    state.currentUser,
    state.theme,
  ]);

  const navigate = useCallback((page: Page, jobId?: string) => {
    setState(prev => ({ ...prev, currentPage: page, selectedJobId: jobId || prev.selectedJobId }));
    // Update URL without triggering navigation
    const newPath = page === 'home' ? '/' : `/${page}`;
    window.history.pushState(null, '', newPath);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1) || 'home';
      const page = path as Page;
      setState(prev => ({ ...prev, currentPage: page }));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync currentUser with AuthContext
  useEffect(() => {
    if (auth.currentUser !== state.currentUser) {
      setState(prev => ({ ...prev, currentUser: auth.currentUser }));
    }
  }, [auth.currentUser, state.currentUser]);

  // Auto-navigate to dashboard when user signs in
  useEffect(() => {
    if (state.currentUser && (state.currentPage === 'login' || state.currentPage === 'register' || state.currentPage === 'home')) {
      navigate(getDefaultPage(state.currentUser.role));
    }
  }, [state.currentUser, state.currentPage, navigate]);

  /* ---------------- AUTH (MOVED TO AuthContext) ---------------- */

  const login = useCallback(
    async (email: string, password: string): Promise<User | null> => {
      try {
        const user = await auth.login(email, password);
        if (!user) return null;

        setState(prev => ({
          ...prev,
          currentUser: user,
          currentPage: getDefaultPage(user.role),
        }));
        return user;
      } catch (error) {
        console.error('Login error:', error);
        return null;
      }
    },
    [auth]
  );

  const logout = useCallback(async () => {
    try {
      await auth.logout();
      setState(prev => ({ ...prev, currentUser: null, currentPage: 'home' }));
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [auth]);

  const register = useCallback(
    async (
      userData: Omit<User, 'uid' | 'id' | 'createdAt'>,
      password?: string
    ): Promise<boolean> => {
      try {
        // Forward the password to AuthContext so Firebase can create the Auth user
        const newUser = await auth.register(userData, password);
        if (!newUser) return false;

        // For demo persistence, users array is synced from DB anyway
        return true;
      } catch (error: any) {
        console.error('Registration error:', error);
        // Re-throw the error to be handled by the UI layer so it can show a message
        throw error;
      }
    },
    [auth]
  );

  /* ---------------- JOBS ---------------- */

  const postJob = useCallback((jobData: Omit<Job, 'id' | 'postedDate' | 'applicantCount'>) => {
    const newJob: Job = {
      ...jobData,
      id: generateId(),
      postedDate: new Date().toISOString(),
      applicantCount: 0,
    };

    setState(prev => {
      const updatedJobs = [newJob, ...prev.jobs];
      void saveState({ jobs: updatedJobs });
      return { ...prev, jobs: updatedJobs };
    });
  }, []);

  const updateJob = useCallback((job: Job) => {
    setState(prev => {
      const updatedJobs = prev.jobs.map(j => (j.id === job.id ? job : j));
      void saveState({ jobs: updatedJobs });
      return { ...prev, jobs: updatedJobs };
    });
  }, []);

  const deleteJob = useCallback((jobId: string) => {
    setState(prev => {
      const updatedJobs = prev.jobs.filter(j => j.id !== jobId);
      const updatedApplications = prev.applications.filter(a => a.jobId !== jobId);
      void saveState({ jobs: updatedJobs, applications: updatedApplications });
      return { ...prev, jobs: updatedJobs, applications: updatedApplications };
    });
  }, []);

  const applyForJob = useCallback(
    (jobId: string, coverLetter: string): boolean => {
      // Allow both students and admins to apply
      if (!state.currentUser || (state.currentUser.role !== 'student' && state.currentUser.role !== 'admin')) return false;
      const alreadyApplied = state.applications.some(
        a => a.jobId === jobId && a.studentId === state.currentUser!.id
      );
      if (alreadyApplied) return false;

      const newApp: Application = {
        id: generateId(),
        jobId,
        studentId: state.currentUser.id,
        studentName: state.currentUser.name,
        studentEmail: state.currentUser.email,
        status: 'pending',
        appliedDate: new Date().toISOString(),
        coverLetter,
      };

      setState(prev => ({
        ...prev,
        applications: [...prev.applications, newApp],
        jobs: prev.jobs.map(j =>
          j.id === jobId ? { ...j, applicantCount: j.applicantCount + 1 } : j
        ),
      }));

      void saveState({
        applications: [...state.applications, newApp],
        jobs: state.jobs.map(j =>
          j.id === jobId ? { ...j, applicantCount: j.applicantCount + 1 } : j
        ),
      });

      return true;
    },
    [state.currentUser, state.applications, state.jobs]
  );

  const updateApplicationStatus = useCallback(
    (applicationId: string, status: Application['status']) => {
      setState(prev => ({
        ...prev,
        applications: prev.applications.map(a =>
          a.id === applicationId ? { ...a, status } : a
        ),
      }));
      void saveState({
        applications: state.applications.map(a =>
          a.id === applicationId ? { ...a, status } : a
        ),
      });
    },
    [state.applications]
  );

  const updateUser = useCallback(
    async (user: User) => {
      if (FIREBASE_ENABLED && firestore) {
        try {
          const userRef = doc(firestore, 'users', user.id);
          await setDoc(userRef, user, { merge: true });
        } catch (error) {
          console.error('Failed to update user in Firestore:', error);
        }
      } else {
        setState(prev => ({
          ...prev,
          users: prev.users.map(u => (u.id === user.id ? user : u)),
          currentUser: prev.currentUser?.id === user.id ? user : prev.currentUser,
        }));
      }
    },
    [state.users, state.currentUser]
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      if (FIREBASE_ENABLED && firestore) {
        try {
          const { deleteDoc } = await import('firebase/firestore');
          const userRef = doc(firestore, 'users', userId);
          await deleteDoc(userRef);
        } catch (error) {
          console.error('Failed to delete user in Firestore:', error);
        }
      }
      setState(prev => ({
        ...prev,
        users: prev.users.filter(u => u.id !== userId),
        jobs: prev.jobs.filter(j => j.employerId !== userId),
        applications: prev.applications.filter(a => a.studentId !== userId),
      }));
      void saveState({
        jobs: state.jobs.filter(j => j.employerId !== userId),
        applications: state.applications.filter(a => a.studentId !== userId),
      });
    },
    [state.users, state.jobs, state.applications]
  );

  const approveEmployer = useCallback(
    async (employerId: string) => {
      setState(prev => {
        const updatedUsers = prev.users.map(u =>
          u.id === employerId ? { ...u, isApproved: true } : u
        );
        void saveState({ users: updatedUsers });
        return { ...prev, users: updatedUsers };
      });

      // Also update in Firestore so it persists across logins
      if (FIREBASE_ENABLED && firestore) {
        try {
          const employerRef = doc(firestore, 'users', employerId);
          await setDoc(employerRef, { isApproved: true }, { merge: true });
          console.log('Employer approved in Firestore:', employerId);
        } catch (error) {
          console.error('Failed to update employer approval in Firestore:', error);
        }
      }
    },
    [state.users]
  );

  const rejectEmployer = useCallback(
    async (employerId: string) => {
      setState(prev => {
        const updatedUsers = prev.users.filter(u => u.id !== employerId);
        const updatedJobs = prev.jobs.filter(j => j.employerId !== employerId);
        const updatedApplications = prev.applications.filter(a => a.studentId !== employerId);
        void saveState({
          users: updatedUsers,
          jobs: updatedJobs,
          applications: updatedApplications
        });
        return {
          ...prev,
          users: updatedUsers,
          jobs: updatedJobs,
          applications: updatedApplications
        };
      });

      // Also remove from Firestore so it persists across logins
      if (FIREBASE_ENABLED && firestore) {
        try {
          const employerRef = doc(firestore, 'users', employerId);
          await setDoc(employerRef, { isApproved: false }, { merge: true });
          console.log('Employer rejected in Firestore:', employerId);
        } catch (error) {
          console.error('Failed to update employer rejection in Firestore:', error);
        }
      }
    },
    [state.users, state.jobs, state.applications]
  );

  const setSearchQuery = useCallback((q: string) => {
    setState(prev => ({ ...prev, searchQuery: q }));
  }, []);

  const setFilterType = useCallback((f: string) => {
    setState(prev => ({ ...prev, filterType: f }));
  }, []);

  const setLocation = useCallback((l: string) => {
    setState(prev => ({ ...prev, location: l }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  }, []);

  const getJobById = useCallback((id: string) => state.jobs.find(j => j.id === id), [state.jobs]);
  const getApplicationsForJob = useCallback(
    (jobId: string) => state.applications.filter(a => a.jobId === jobId),
    [state.applications]
  );
  const getApplicationsForStudent = useCallback(
    (studentId: string) => state.applications.filter(a => a.studentId === studentId),
    [state.applications]
  );
  const getJobsForEmployer = useCallback(
    (employerId: string) => state.jobs.filter(j => j.employerId === employerId),
    [state.jobs]
  );
  const getStudents = useCallback(() => state.users.filter(u => u.role === 'student'), [state.users]);
  const getEmployers = useCallback(
    () => state.users.filter(u => u.role === 'employer'),
    [state.users]
  );
  const hasApplied = useCallback(
    (jobId: string) => {
      if (!state.currentUser) return false;
      return state.applications.some(
        a => a.jobId === jobId && a.studentId === state.currentUser!.id
      );
    },
    [state.currentUser, state.applications]
  );

  const sendMessage = useCallback(
    (subject: string, body: string) => {
      if (!state.currentUser || state.currentUser.role !== 'employer') return;

      const newMessage: Message = {
        id: generateId(),
        employerId: state.currentUser.id,
        employerName: state.currentUser.name,
        employerEmail: state.currentUser.email,
        companyName: state.currentUser.companyName || state.currentUser.name,
        subject,
        body,
        sentDate: new Date().toISOString(),
        read: false,
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));

      void saveState({
        messages: [...state.messages, newMessage],
      });
    },
    [state.currentUser, state.messages]
  );

  const getMessagesForAdmin = useCallback(() => {
    return state.messages;
  }, [state.messages]);

  const getUnreadMessagesForAdminCount = useCallback(() => {
    return state.messages.filter(msg => !msg.read).length;
  }, [state.messages]);

  const markMessageAsRead = useCallback(
    (messageId: string) => {
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        ),
      }));

      void saveState({
        messages: state.messages.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        ),
      });
    },
    [state.messages]
  );

  const replyToMessage = useCallback(
    (messageId: string, replyBody: string) => {
      if (!state.currentUser || state.currentUser.role !== 'admin') return;

      const newReply: MessageReply = {
        id: generateId(),
        messageId,
        adminId: state.currentUser.id,
        adminName: state.currentUser.name,
        adminEmail: state.currentUser.email,
        body: replyBody,
        sentDate: new Date().toISOString(),
      };

      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg =>
          msg.id === messageId
            ? { ...msg, replies: [...(msg.replies || []), newReply], read: true }
            : msg
        ),
      }));

      void saveState({
        messages: state.messages.map(msg =>
          msg.id === messageId
            ? { ...msg, replies: [...(msg.replies || []), newReply], read: true }
            : msg
        ),
      });
    },
    [state.currentUser, state.messages]
  );

  /* ---------------- ADMIN MESSAGES ---------------- */

  const sendAdminMessage = useCallback(
    (employerId: string, subject: string, body: string) => {
      if (!state.currentUser || state.currentUser.role !== 'admin') return;

      const employer = state.users.find(u => u.id === employerId);
      if (!employer) return;

      const newAdminMessage: AdminMessage = {
        id: generateId(),
        adminId: state.currentUser.id,
        adminName: state.currentUser.name,
        employerId,
        employerName: employer.name,
        employerEmail: employer.email,
        subject,
        body,
        sentDate: new Date().toISOString(),
        read: false,
        status: 'pending',
      };

      setState(prev => ({
        ...prev,
        adminMessages: [...prev.adminMessages, newAdminMessage],
      }));

      void saveState({
        adminMessages: [...state.adminMessages, newAdminMessage],
      });
    },
    [state.currentUser, state.users, state.adminMessages]
  );

  const getAdminMessagesForEmployer = useCallback(
    (employerId: string) => {
      return state.adminMessages.filter(msg => msg.employerId === employerId);
    },
    [state.adminMessages]
  );

  const markAdminMessageAsRead = useCallback(
    (messageId: string) => {
      setState(prev => ({
        ...prev,
        adminMessages: prev.adminMessages.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        ),
      }));

      void saveState({
        adminMessages: state.adminMessages.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        ),
      });
    },
    [state.adminMessages]
  );

  const acceptAdminMessage = useCallback(
    (messageId: string) => {
      setState(prev => ({
        ...prev,
        adminMessages: prev.adminMessages.map(msg =>
          msg.id === messageId ? { ...msg, accepted: true, rejected: false } : msg
        ),
      }));

      void saveState({
        adminMessages: state.adminMessages.map(msg =>
          msg.id === messageId ? { ...msg, accepted: true, rejected: false } : msg
        ),
      });
    },
    [state.adminMessages]
  );

  const rejectAdminMessage = useCallback(
    (messageId: string) => {
      setState(prev => ({
        ...prev,
        adminMessages: prev.adminMessages.map(msg =>
          msg.id === messageId ? { ...msg, rejected: true, accepted: false } : msg
        ),
      }));

      void saveState({
        adminMessages: state.adminMessages.map(msg =>
          msg.id === messageId ? { ...msg, rejected: true, accepted: false } : msg
        ),
      });
    },
    [state.adminMessages]
  );

  const getUnreadAdminMessagesCount = useCallback(
    (employerId: string) => {
      return state.adminMessages.filter(
        msg => msg.employerId === employerId && !msg.read
      ).length;
    },
    [state.adminMessages]
  );

  /* ---------------- STUDENT MESSAGES ---------------- */

  const sendStudentMessage = useCallback(
    (studentId: string, subject: string, body: string) => {
      if (!state.currentUser || state.currentUser.role !== 'employer') {
        console.warn('Cannot send student message: user is not an employer');
        return;
      }

      const employerName = state.currentUser.companyName || state.currentUser.name || 'Employer';

      const newStudentMessage: StudentMessage = {
        id: generateId(),
        employerId: state.currentUser.id,
        employerName,
        studentId,
        senderRole: 'employer',
        subject,
        body,
        sentDate: new Date().toISOString(),
        status: 'sent',
      };

      setState(prev => {
        const updatedMessages = [...prev.studentMessages, newStudentMessage];
        void saveState({
          studentMessages: updatedMessages,
        });
        console.log('Student message sent:', newStudentMessage);
        return {
          ...prev,
          studentMessages: updatedMessages,
        };
      });
    },
    [state.currentUser]
  );

  const getMessagesForStudent = useCallback(
    (studentId: string) => {
      return state.studentMessages.filter(msg => msg.studentId === studentId);
    },
    [state.studentMessages]
  );

  const getUnreadStudentMessagesCount = useCallback(
    (studentId: string) => {
      return state.studentMessages.filter(
        msg => msg.studentId === studentId && msg.status === 'sent'
      ).length;
    },
    [state.studentMessages]
  );

  const markStudentMessageAsRead = useCallback(
    (messageId: string) => {
      setState(prev => ({
        ...prev,
        studentMessages: prev.studentMessages.map(msg =>
          msg.id === messageId ? { ...msg, status: 'read' } : msg
        ),
      }));

      void saveState({
        studentMessages: state.studentMessages.map(msg =>
          msg.id === messageId ? { ...msg, status: 'read' } : msg
        ),
      });
    },
    [state.studentMessages]
  );

  const replyToStudentMessage = useCallback(
    (messageId: string, replyBody: string) => {
      if (!state.currentUser) return;

      const newReply: StudentMessageReply = {
        id: generateId(),
        messageId,
        senderId: state.currentUser.id,
        senderRole: state.currentUser.role as 'student' | 'employer',
        body: replyBody,
        sentDate: new Date().toISOString(),
      };

      setState(prev => ({
        ...prev,
        studentMessages: prev.studentMessages.map(msg =>
          msg.id === messageId
            ? {
              ...msg,
              replies: [...(msg.replies || []), newReply],
              status: 'read',
            }
            : msg
        ),
      }));

      void saveState({
        studentMessages: state.studentMessages.map(msg =>
          msg.id === messageId
            ? {
              ...msg,
              replies: [...(msg.replies || []), newReply],
            }
            : msg
        ),
      });
    },
    [state.currentUser, state.studentMessages]
  );

  const getMessagesForEmployerFromStudent = useCallback(
    (employerId: string) => {
      return state.studentMessages.filter(msg => msg.employerId === employerId);
    },
    [state.studentMessages]
  );

  const deleteStudentMessage = useCallback(
    (messageId: string) => {
      setState(prev => ({
        ...prev,
        studentMessages: prev.studentMessages.filter(msg => msg.id !== messageId),
      }));

      void saveState({
        studentMessages: state.studentMessages.filter(msg => msg.id !== messageId),
      });
    },
    [state.studentMessages]
  );

  const deleteEmployerMessage = useCallback(
    (messageId: string) => {
      setState(prev => ({
        ...prev,
        studentMessages: prev.studentMessages.filter(msg => msg.id !== messageId),
      }));

      void saveState({
        studentMessages: state.studentMessages.filter(msg => msg.id !== messageId),
      });
    },
    [state.studentMessages]
  );

  const sendMessageToEmployer = useCallback(
    (employerId: string, subject: string, body: string) => {
      if (!state.currentUser || state.currentUser.role !== 'student') {
        console.warn('Cannot send message to employer: user is not a student');
        return;
      }

      const employer = state.users.find(u => u.id === employerId);
      if (!employer) return;

      const newStudentMessage: StudentMessage = {
        id: generateId(),
        employerId,
        employerName: employer.companyName || employer.name || 'Employer',
        studentId: state.currentUser.id,
        senderRole: 'student',
        subject,
        body,
        sentDate: new Date().toISOString(),
        status: 'sent',
      };

      setState(prev => {
        const updatedMessages = [...prev.studentMessages, newStudentMessage];
        void saveState({
          studentMessages: updatedMessages,
        });
        console.log('Message sent to employer:', newStudentMessage);
        return {
          ...prev,
          studentMessages: updatedMessages,
        };
      });
    },
    [state.currentUser, state.users]
  );

  const getUnreadMessagesFromStudentCount = useCallback(
    (employerId: string) => {
      return state.studentMessages.filter(
        msg => msg.employerId === employerId && msg.status === 'sent'
      ).length;
    },
    [state.studentMessages]
  );

  /* ---------------- CONTACT MESSAGES ---------------- */

  const sendContactMessage = useCallback(
    async (name: string, email: string, subject: string, message: string) => {
      if (!firestore) return;
      try {
        await addDoc(collection(firestore, 'contactMessages'), {
          name,
          email,
          subject,
          message,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.error('Error sending contact message:', error);
      }
    },
    []
  );

  /* ---------------- ANNOUNCEMENTS ---------------- */

  const createAnnouncement = useCallback((announcementData: Omit<Announcement, 'id' | 'postedDate' | 'postedBy'>) => {
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: generateId(),
      postedDate: new Date().toISOString(),
      postedBy: state.currentUser?.name || 'Admin',
    };

    setState(prev => {
      const updatedAnnouncements = [newAnnouncement, ...prev.announcements];
      void saveState({ announcements: updatedAnnouncements });
      return { ...prev, announcements: updatedAnnouncements };
    });
  }, [state.currentUser]);

  const updateAnnouncement = useCallback((announcement: Announcement) => {
    setState(prev => {
      const updatedAnnouncements = prev.announcements.map(a => (a.id === announcement.id ? announcement : a));
      void saveState({ announcements: updatedAnnouncements });
      return { ...prev, announcements: updatedAnnouncements };
    });
  }, []);

  const deleteAnnouncement = useCallback((announcementId: string) => {
    setState(prev => {
      const updatedAnnouncements = prev.announcements.filter(a => a.id !== announcementId);
      void saveState({ announcements: updatedAnnouncements });
      return { ...prev, announcements: updatedAnnouncements };
    });
  }, []);

  const getAnnouncementsForUser = useCallback((userRole: UserRole) => {
    const now = new Date();
    return state.announcements
      .filter(a => {
        // Filter by target audience
        if (a.targetAudience && a.targetAudience !== 'all') {
          // Map UserRole to targetAudience values
          const audienceMap: Record<UserRole, string> = {
            'student': 'students',
            'employer': 'employers',
            'admin': 'all'
          };
          const userAudience = audienceMap[userRole];
          if (a.targetAudience !== userAudience) {
            return false;
          }
        }
        // Filter expired announcements
        if (a.expiryDate && new Date(a.expiryDate) < now) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }, [state.announcements]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        navigate,
        login,
        logout,
        register,
        postJob,
        updateJob,
        deleteJob,
        applyForJob,
        updateApplicationStatus,
        updateUser,
        deleteUser,
        approveEmployer,
        rejectEmployer,
        setSearchQuery,
        setFilterType,
        setLocation,
        toggleTheme,
        getJobById,
        getApplicationsForJob,
        getApplicationsForStudent,
        getJobsForEmployer,
        getStudents,
        getEmployers,
        hasApplied,
        sendMessage,
        getMessagesForAdmin,
        getUnreadMessagesForAdminCount,
        markMessageAsRead,
        replyToMessage,
        sendAdminMessage,
        getAdminMessagesForEmployer,
        markAdminMessageAsRead,
        acceptAdminMessage,
        rejectAdminMessage,
        getUnreadAdminMessagesCount,
        sendStudentMessage,
        getMessagesForStudent,
        getUnreadStudentMessagesCount,
        markStudentMessageAsRead,
        replyToStudentMessage,
        getMessagesForEmployerFromStudent,
        deleteStudentMessage,
        deleteEmployerMessage,
        sendMessageToEmployer,
        getUnreadMessagesFromStudentCount,
        sendContactMessage,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        getAnnouncementsForUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

function getDefaultPage(role: UserRole): Page {
  switch (role) {
    case 'student':
      return 'student-dashboard';
    case 'employer':
      return 'employer-dashboard';
    case 'admin':
      return 'admin-dashboard';
  }
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
