import { useEffect, useState } from 'react';
import {
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  Award,
  BarChart2,
  BookOpen,
  Briefcase,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Code,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Trash2,
  Upload,
  User,
  Zap,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import './App.css';
import { useAuth } from './context/AuthContext';
import api from './services/api';

const featureCards = [
  { icon: '🎤', title: 'AI Mock Interviews', description: 'Real-time practice for HR, Technical, Behavioral, and Coding rounds with instant scoring.' },
  { icon: '📄', title: 'Resume Analyzer', description: 'Upload PDF/DOCX resumes for ATS scoring, keyword matching, and missing skill analysis.' },
  { icon: '💻', title: 'Coding Practice', description: 'Solve curated DSA and SQL problems with multi-language starter templates.' },
  { icon: '📈', title: 'Progress Tracking', description: 'Monitor interview scores, daily streaks, and skill mastery with dynamic analytics.' },
  { icon: '🧠', title: 'Personalized Feedback', description: 'Get granular breakdown of communication, technical depth, and actionable suggestions.' },
  { icon: '📚', title: 'Question Bank', description: 'Browse and search hundreds of standard campus placement questions across categories.' },
];

const tutorialSteps = [
  { step: '1', title: 'Create Account', desc: 'Sign up with your college, degree, and graduation year details.' },
  { step: '2', title: 'Take Mock Interviews', desc: 'Select interview type, difficulty, and answer realistic questions.' },
  { step: '3', title: 'Analyze Resume', desc: 'Upload your CV to uncover missing keywords and boost ATS readiness.' },
  { step: '4', title: 'Practice Coding & DSA', desc: 'Write and submit solutions to core placement algorithmic problems.' },
  { step: '5', title: 'Get Job Ready', desc: 'Track your growth and step into campus placements with total confidence.' },
];

const interviewTypes = ['Technical', 'HR', 'Behavioral', 'Coding', 'Mixed'];
const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];
const questionOptions = [3, 5, 10, 15];

const starterCodeMap = {
  Java: `class Solution {\n    public int[] solve(int[] nums, int target) {\n        // Write your Java solution here\n        return new int[]{0, 1};\n    }\n}`,
  Python: `class Solution:\n    def solve(self, nums, target):\n        # Write your Python solution here\n        return [0, 1]`,
  JavaScript: `function solve(nums, target) {\n    // Write your JavaScript solution here\n    return [0, 1];\n}`,
  'C++': `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> solve(vector<int>& nums, int target) {\n        // Write your C++ solution here\n        return {0, 1};\n    }\n};`,
  C: `#include <stdio.h>\n\nvoid solve() {\n    // Write your C solution here\n}`,
  SQL: `SELECT department_id, MAX(salary) AS max_salary\nFROM employees\nGROUP BY department_id;`,
};

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-shell" style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="brand-mark" style={{ margin: '0 auto 16px', animation: 'pulse 1.5s infinite' }}>AI</div>
          <p style={{ color: 'var(--muted)', fontWeight: 600 }}>Loading AI Job Trainer...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/interview', label: 'Mock Interview', icon: Briefcase },
    { to: '/interviews', label: 'Interview History', icon: BookOpen },
    { to: '/resume', label: 'Resume Analyzer', icon: FileText },
    { to: '/coding', label: 'Coding Practice', icon: Code },
    { to: '/questions', label: 'Question Bank', icon: HelpCircle },
    { to: '/progress', label: 'Progress Tracking', icon: BarChart2 },
    { to: '/profile', label: 'Student Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  if (isAdmin) {
    navItems.push({ to: '/admin', label: 'Admin Dashboard', icon: Shield });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <aside className="side-panel">
        <div className="brand-wrap">
          <div className="brand-mark">AI</div>
          <div>
            <h2>AI Job Trainer</h2>
            <p>Placement Platform</p>
          </div>
        </div>

        <nav className="side-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <Icon size={18} style={{ marginRight: 10, verticalAlign: 'middle' }} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="user-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #38bdf8)', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>{user?.name || 'Student'}</strong>
              <span style={{ fontSize: '0.78rem', color: isAdmin ? '#38bdf8' : 'var(--muted)', fontWeight: 700 }}>
                {user?.role?.toUpperCase() || 'USER'}
              </span>
            </div>
          </div>
          <button type="button" className="secondary-btn" onClick={handleLogout} style={{ width: '100%', padding: '0.55rem' }}>
            <LogOut size={15} style={{ marginRight: 6 }} /> Logout
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow" style={{ textTransform: 'capitalize' }}>
              {location.pathname.replace('/', '') || 'Dashboard'}
            </p>
            <h1>{user?.name ? `Welcome back, ${user.name}` : 'Welcome back'}</h1>
          </div>
          <div className="topbar-actions">
            <Link to="/interview" className="primary-btn" style={{ padding: '0.65rem 1.1rem', fontSize: '0.88rem' }}>
              <Zap size={16} style={{ marginRight: 6 }} /> Start Mock
            </Link>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="brand-header">
          <span className="brand-mark small">AI</span>
          <span>AI Job Trainer</span>
        </div>
        <nav>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
          <Link to="/login" className="secondary-btn" style={{ padding: '0.6rem 1.1rem' }}>Login</Link>
          <Link to="/register" className="primary-btn" style={{ padding: '0.6rem 1.1rem' }}>Start Training</Link>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow accent">Java Full Stack + Spring Boot + MongoDB</span>
          <h1>Train Smarter. Interview Better. Get Hired.</h1>
          <p>
            AI-powered interview preparation for students and aspiring professionals.
            Practice realistic mock interviews, analyze your resume, and master coding challenges.
          </p>
          <div className="cta-row">
            <Link to="/register" className="primary-btn large">
              Start Training <ChevronRight size={18} style={{ marginLeft: 6 }} />
            </Link>
            <Link to="/login" className="secondary-btn large">Login to Account</Link>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="glass-card">
            <div className="stat-row">
              <span>Latest Mock Score</span>
              <strong style={{ color: '#22c55e', fontSize: '1.4rem' }}>92 / 100</strong>
            </div>
            <div className="progress-bar"><span style={{ width: '92%' }} /></div>
            <ul>
              <li><strong>Technical Readiness:</strong> 94%</li>
              <li><strong>Communication Skills:</strong> 90%</li>
              <li><strong>Resume ATS Score:</strong> 88%</li>
              <li><strong>DSA Problems Solved:</strong> 18</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="features" className="feature-section">
        <div className="section-heading">
          <span className="eyebrow">Comprehensive Platform</span>
          <h2>Everything You Need for Campus Placements</h2>
        </div>
        <div className="feature-grid">
          {featureCards.map((item) => (
            <div key={item.title} className="feature-card">
              <div className="feature-icon" style={{ fontSize: '2rem', marginBottom: 12 }}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="info-section">
        <div className="section-heading">
          <span className="eyebrow">Guided Path</span>
          <h2>How It Works in 5 Simple Steps</h2>
        </div>
        <div className="steps-grid">
          {tutorialSteps.map((item) => (
            <div key={item.step} className="step-card">
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="about-section" style={{ textAlign: 'center', padding: '70px 80px' }}>
        <div className="section-heading">
          <span className="eyebrow">Our Mission</span>
          <h2>Built for Next-Gen Engineers</h2>
        </div>
        <p style={{ maxWidth: 720, margin: '0 auto', color: 'var(--muted)', fontSize: '1.15rem', lineHeight: 1.8 }}>
          AI Job Trainer brings AI Mock Interviews, ATS Resume Evaluation, Coding Practice, and live Skill Analytics
          into one unified platform. Powered by Spring Boot and MongoDB, it guarantees students receive actionable feedback
          for every placement round.
        </p>
      </section>

      <footer style={{ textAlign: 'center', padding: '30px', borderTop: '1px solid var(--border)', color: 'var(--muted)', fontSize: '0.9rem' }}>
        AI Job Trainer · Professional Java Full Stack (Spring Boot + React.js + MongoDB)
      </footer>
    </div>
  );
}

function AuthPage({ mode }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    degree: '',
    branch: '',
    graduationYear: new Date().getFullYear(),
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        if (form.password !== form.confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        if (form.password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        const res = await register(form);
        if (res?.user?.role?.toUpperCase() === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        const res = await login(form.email, form.password);
        if (res?.user?.role?.toUpperCase() === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div className="brand-mark" style={{ margin: '0 auto 12px' }}>AI</div>
          <h2>{mode === 'register' ? 'Create Your Account' : 'Welcome Back'}</h2>
          <p className="muted-text">
            {mode === 'register' ? 'Start your placement training journey today.' : 'Login to access your AI mock interviews and preparation.'}
          </p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          )}
          <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handleChange} required />

          {mode === 'register' && (
            <>
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
              <input name="college" placeholder="College / University" value={form.college} onChange={handleChange} required />
              <input name="degree" placeholder="Degree (e.g. B.Tech, MCA)" value={form.degree} onChange={handleChange} required />
              <input name="branch" placeholder="Branch (e.g. Computer Science)" value={form.branch} onChange={handleChange} required />
              <input type="number" name="graduationYear" placeholder="Graduation Year" value={form.graduationYear} onChange={handleChange} />
            </>
          )}

          <button type="submit" className="primary-btn" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
            {loading ? 'Please wait...' : mode === 'register' ? 'Register Now' : 'Login'}
          </button>
        </form>

        <p className="switch-link">
          {mode === 'register' ? 'Already have an account?' : 'Need an account?'}{' '}
          <Link to={mode === 'register' ? '/login' : '/register'}>
            {mode === 'register' ? 'Login' : 'Create Account'}
          </Link>
        </p>

        {mode === 'login' && (
          <div style={{ marginTop: 20, padding: 12, borderRadius: 10, background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '0.85rem' }}>
            <p style={{ margin: 0, color: 'var(--muted)' }}>
              <strong>Demo Admin:</strong> admin@aijobtrainer.com / Admin@123
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    interviewsCompleted: 0,
    averageInterviewScore: 0,
    resumeScore: 0,
    codingProblemsSolved: 0,
    currentStreak: 1,
    skills: {},
    weeklyActivity: [2, 4, 5, 3, 6, 2, 1],
  });
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/progress'),
      api.get('/interviews'),
    ])
      .then(([progRes, intRes]) => {
        if (progRes.data?.progress) {
          setStats(progRes.data.progress);
        }
        if (intRes.data?.interviews) {
          setRecentInterviews(intRes.data.interviews.slice(0, 3));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Interviews Completed', value: stats.interviewsCompleted, icon: Briefcase, color: '#38bdf8' },
    { label: 'Average Score', value: `${stats.averageInterviewScore}%`, icon: Award, color: '#22c55e' },
    { label: 'Resume ATS Score', value: `${stats.resumeScore}%`, icon: FileText, color: '#a855f7' },
    { label: 'Problems Solved', value: stats.codingProblemsSolved, icon: Code, color: '#f59e0b' },
    { label: 'Current Streak', value: `${stats.currentStreak} Days`, icon: Zap, color: '#ec4899' },
  ];

  const defaultSkills = {
    Technical: stats.skills?.Technical || 82,
    Communication: stats.skills?.Communication || 78,
    Coding: stats.skills?.Coding || 75,
    Resume: stats.skills?.Resume || 80,
    'Problem Solving': stats.skills?.['Problem Solving'] || 85,
  };

  return (
    <div className="content-stack">
      <section className="stats-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span>{card.label}</span>
                <Icon size={20} color={card.color} />
              </div>
              <strong>{loading ? '...' : card.value}</strong>
            </div>
          );
        })}
      </section>

      <section className="dashboard-grid">
        <div className="panel-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>Recommended Practice</h3>
            <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>AI Tailored</span>
          </div>
          <ul className="list-stack">
            <li style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <strong>Technical Round:</strong> Core Spring Boot, Dependency Injection & MongoDB queries.
            </li>
            <li style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <strong>Behavioral Round:</strong> STAR framework for resolving team conflict under pressure.
            </li>
            <li style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <strong>Coding Round:</strong> Two-pointer and sliding window algorithms for arrays.
            </li>
          </ul>
        </div>

        <div className="panel-card">
          <h3>Skill Progress</h3>
          <div className="progress-list" style={{ marginTop: 14 }}>
            {Object.entries(defaultSkills).map(([label, value]) => (
              <div key={label} className="progress-row">
                <span style={{ minWidth: 120 }}>{label}</span>
                <div className="progress-bar small"><span style={{ width: `${value}%` }} /></div>
                <strong style={{ minWidth: 40, textAlign: 'right' }}>{value}%</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel-card">
        <h3>Quick Actions</h3>
        <div className="button-row" style={{ marginTop: 14 }}>
          <Link to="/interview" className="primary-btn"><Briefcase size={16} style={{ marginRight: 6 }} /> Start Mock Interview</Link>
          <Link to="/resume" className="secondary-btn"><FileText size={16} style={{ marginRight: 6 }} /> Analyze Resume</Link>
          <Link to="/coding" className="secondary-btn"><Code size={16} style={{ marginRight: 6 }} /> Practice Coding</Link>
          <Link to="/questions" className="secondary-btn"><BookOpen size={16} style={{ marginRight: 6 }} /> Question Bank</Link>
          <Link to="/progress" className="secondary-btn"><BarChart2 size={16} style={{ marginRight: 6 }} /> View Progress</Link>
        </div>
      </section>

      <section className="panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3>Recent Interviews</h3>
          <Link to="/interviews" style={{ color: '#38bdf8', fontSize: '0.88rem', fontWeight: 600 }}>View All History</Link>
        </div>
        {recentInterviews.length === 0 ? (
          <div className="empty-box">No interviews completed yet. Take your first mock interview above!</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Difficulty</th>
                  <th>Score</th>
                  <th>Questions</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentInterviews.map((item) => (
                  <tr key={item.id || item._id}>
                    <td><strong>{item.interviewType}</strong></td>
                    <td><span className="tag">{item.difficulty}</span></td>
                    <td><strong style={{ color: item.score >= 70 ? '#22c55e' : '#f59e0b' }}>{item.score}%</strong></td>
                    <td>{item.questions?.length || 0} Questions</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/interviews/${item.id || item._id}`} className="action-link" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function InterviewPage() {
  const [type, setType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [questionCount, setQuestionCount] = useState(5);

  const [sessionActive, setSessionActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startInterview = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/interviews/questions', {
        params: { type, difficulty, count: questionCount },
      });
      const fetched = res.data?.questions || [];
      if (fetched.length === 0) {
        setQuestions([
          { text: 'Describe a significant engineering project you designed and implemented.' },
          { text: 'What is the difference between SQL and MongoDB databases?' },
          { text: 'How do you approach performance debugging in high traffic applications?' },
        ]);
      } else {
        setQuestions(fetched);
      }
      setAnswers({});
      setCurrentIndex(0);
      setSessionActive(true);
      setSubmitted(null);
    } catch {
      setError('Could not fetch questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (text) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: text }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitInterview = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        interviewType: type,
        difficulty,
        questionCount: questions.length,
        questions: questions.map((q) => ({ text: q.text })),
        answers: questions.map((_, i) => answers[i] || ''),
      };
      const res = await api.post('/interviews', payload);
      setSubmitted(res.data.interview);
      setSessionActive(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Interview submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-stack">
      {!sessionActive && !submitted && (
        <section className="panel-card">
          <h3>Configure Your AI Mock Interview</h3>
          <p className="muted-text" style={{ marginBottom: 20 }}>
            Simulate realistic campus and company interviews. Our evaluator analyzes technical depth, clarity, and relevance.
          </p>

          <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <label style={{ display: 'grid', gap: 6, fontWeight: 600 }}>
              Interview Type
              <select value={type} onChange={(e) => setType(e.target.value)}>
                {interviewTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>

            <label style={{ display: 'grid', gap: 6, fontWeight: 600 }}>
              Difficulty Level
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                {difficultyLevels.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>

            <label style={{ display: 'grid', gap: 6, fontWeight: 600 }}>
              Number of Questions
              <select value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))}>
                {questionOptions.map((c) => <option key={c} value={c}>{c} Questions</option>)}
              </select>
            </label>
          </div>

          {error && <div className="error-banner" style={{ marginTop: 16 }}>{error}</div>}

          <div className="button-row" style={{ marginTop: 24 }}>
            <button type="button" className="primary-btn large" onClick={startInterview} disabled={loading}>
              {loading ? 'Preparing Session...' : 'Start Mock Interview'}
            </button>
          </div>
        </section>
      )}

      {sessionActive && (
        <section className="panel-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <span className="tag" style={{ marginRight: 8 }}>{type}</span>
              <span className="tag">{difficulty}</span>
            </div>
            <strong>
              Question {currentIndex + 1} of {questions.length}
            </strong>
          </div>

          <div className="progress-bar" style={{ margin: '10px 0 24px' }}>
            <span style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
          </div>

          <div className="question-block" style={{ background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 14, border: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: 16 }}>
              Q{currentIndex + 1}. {questions[currentIndex]?.text}
            </h4>

            <textarea
              rows={8}
              value={answers[currentIndex] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Type your comprehensive interview answer here... (Tip: include practical examples, architecture trade-offs, or STAR situation details)"
              style={{ width: '100%', fontSize: '1rem', padding: '14px', borderRadius: 10, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6, color: 'var(--muted)', fontSize: '0.8rem' }}>
              Word count: {(answers[currentIndex] || '').trim().split(/\s+/).filter(Boolean).length}
            </div>
          </div>

          {error && <div className="error-banner" style={{ marginTop: 14 }}>{error}</div>}

          <div className="button-row" style={{ marginTop: 20, justifyContent: 'space-between' }}>
            <button
              type="button"
              className="secondary-btn"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={16} style={{ marginRight: 6 }} /> Previous Question
            </button>

            <div style={{ display: 'flex', gap: 10 }}>
              {currentIndex < questions.length - 1 ? (
                <button type="button" className="secondary-btn" onClick={handleNext}>
                  Next Question <ChevronRight size={16} style={{ marginLeft: 6 }} />
                </button>
              ) : null}

              <button
                type="button"
                className="primary-btn"
                onClick={handleSubmitInterview}
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Finish & Submit Interview'}
              </button>
            </div>
          </div>
        </section>
      )}

      {submitted && (
        <section className="panel-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2>Interview Evaluation Result</h2>
              <p className="muted-text">{submitted.interviewType} Round · {submitted.difficulty}</p>
            </div>
            <div style={{ textAlign: 'center', padding: '10px 20px', borderRadius: 14, background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block' }}>OVERALL SCORE</span>
              <strong style={{ fontSize: '2.4rem', color: '#22c55e' }}>{submitted.score}%</strong>
            </div>
          </div>

          <div className="scores-grid" style={{ marginBottom: 24 }}>
            <div className="mini-stat">
              <span>Communication</span>
              <strong>{submitted.communicationScore}%</strong>
            </div>
            <div className="mini-stat">
              <span>Technical Depth</span>
              <strong>{submitted.technicalScore}%</strong>
            </div>
            <div className="mini-stat">
              <span>Confidence</span>
              <strong>{submitted.confidenceScore}%</strong>
            </div>
            <div className="mini-stat">
              <span>Relevance</span>
              <strong>{submitted.relevanceScore}%</strong>
            </div>
            <div className="mini-stat">
              <span>Problem Solving</span>
              <strong>{submitted.problemSolvingScore}%</strong>
            </div>
          </div>

          <div className="dashboard-grid" style={{ marginBottom: 20 }}>
            <div className="panel-card" style={{ background: 'rgba(34, 197, 94, 0.05)', borderColor: 'rgba(34, 197, 94, 0.2)' }}>
              <h4 style={{ color: '#22c55e', marginBottom: 10 }}>Key Strengths</h4>
              <ul className="list-stack">
                {(submitted.strengths || []).map((s, i) => (
                  <li key={i}><CheckCircle size={14} color="#22c55e" style={{ marginRight: 6, verticalAlign: 'middle' }} /> {s}</li>
                ))}
              </ul>
            </div>

            <div className="panel-card" style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <h4 style={{ color: '#f87171', marginBottom: 10 }}>Areas to Refine</h4>
              <ul className="list-stack">
                {(submitted.weaknesses || []).map((w, i) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="panel-card" style={{ background: 'rgba(56, 189, 248, 0.05)', borderColor: 'rgba(56, 189, 248, 0.2)', marginBottom: 20 }}>
            <h4 style={{ color: '#38bdf8', marginBottom: 10 }}>Actionable Suggestions</h4>
            <ul className="list-stack">
              {(submitted.suggestions || []).map((sug, i) => (
                <li key={i}>→ {sug}</li>
              ))}
            </ul>
          </div>

          <div className="button-row">
            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                setSubmitted(null);
                setSessionActive(false);
              }}
            >
              Take Another Interview
            </button>
            <Link to="/interviews" className="secondary-btn">View All Interviews</Link>
          </div>
        </section>
      )}
    </div>
  );
}

function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/interviews')
      .then((res) => setInterviews(res.data?.interviews || []))
      .catch(() => setInterviews([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview record?')) return;
    try {
      await api.delete(`/interviews/${id}`);
      setInterviews((prev) => prev.filter((it) => (it.id || it._id) !== id));
    } catch {}
  };

  return (
    <div className="content-stack">
      <section className="panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3>Interview History</h3>
            <p className="muted-text">Review your past performance, questions, and feedback over time.</p>
          </div>
          <Link to="/interview" className="primary-btn" style={{ padding: '0.6rem 1.1rem' }}>
            <Plus size={16} style={{ marginRight: 6 }} /> New Mock
          </Link>
        </div>

        {loading ? (
          <div className="empty-box">Loading interview history...</div>
        ) : interviews.length === 0 ? (
          <div className="empty-box">No interviews completed yet. Start your first mock round!</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Difficulty</th>
                  <th>Overall Score</th>
                  <th>Tech</th>
                  <th>Comm</th>
                  <th>Questions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((item) => {
                  const id = item.id || item._id;
                  return (
                    <tr key={id}>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td><strong>{item.interviewType}</strong></td>
                      <td><span className="tag">{item.difficulty}</span></td>
                      <td><strong style={{ color: item.score >= 70 ? '#22c55e' : '#f59e0b' }}>{item.score}%</strong></td>
                      <td>{item.technicalScore}%</td>
                      <td>{item.communicationScore}%</td>
                      <td>{item.questions?.length || 0}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Link to={`/interviews/${id}`} className="action-link" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                            View Details
                          </Link>
                          <button
                            type="button"
                            className="danger-btn"
                            onClick={() => handleDelete(id)}
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function InterviewDetailPage() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/interviews/${id}`)
      .then((res) => setInterview(res.data?.interview))
      .catch(() => setError('Could not load interview details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="panel-card"><div className="empty-box">Loading interview session details...</div></div>;
  if (error || !interview) return <div className="panel-card"><div className="error-banner">{error || 'Interview not found.'}</div></div>;

  return (
    <div className="content-stack">
      <section className="panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <Link to="/interviews" style={{ display: 'inline-flex', alignItems: 'center', color: '#38bdf8', marginBottom: 8, fontSize: '0.88rem' }}>
              <ChevronLeft size={16} /> Back to History
            </Link>
            <h2>{interview.interviewType} Mock Interview</h2>
            <p className="muted-text">Difficulty: {interview.difficulty} · Completed on {new Date(interview.createdAt).toLocaleString()}</p>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 24px', borderRadius: 14, background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block' }}>SCORE</span>
            <strong style={{ fontSize: '2.4rem', color: '#22c55e' }}>{interview.score}%</strong>
          </div>
        </div>

        <div className="scores-grid" style={{ marginBottom: 24 }}>
          <div className="mini-stat"><span>Communication</span><strong>{interview.communicationScore}%</strong></div>
          <div className="mini-stat"><span>Technical</span><strong>{interview.technicalScore}%</strong></div>
          <div className="mini-stat"><span>Confidence</span><strong>{interview.confidenceScore}%</strong></div>
          <div className="mini-stat"><span>Relevance</span><strong>{interview.relevanceScore}%</strong></div>
          <div className="mini-stat"><span>Problem Solving</span><strong>{interview.problemSolvingScore}%</strong></div>
        </div>

        <h3 style={{ marginBottom: 14 }}>Questions & Answers Review</h3>
        <div className="stack-list">
          {(interview.questions || []).map((q, idx) => (
            <div key={idx} className="panel-card" style={{ background: 'rgba(255,255,255,0.02)', marginBottom: 12 }}>
              <h4 style={{ color: '#38bdf8', marginBottom: 8 }}>Q{idx + 1}. {q.text || q.question}</h4>
              <p style={{ margin: '8px 0 0', padding: 12, background: 'rgba(0,0,0,0.25)', borderRadius: 8, fontSize: '0.95rem' }}>
                <strong>Your Answer:</strong> {q.answer || interview.answers?.[idx] || <em style={{ color: 'var(--muted)' }}>No answer provided</em>}
              </p>
            </div>
          ))}
        </div>

        <div className="dashboard-grid" style={{ marginTop: 20 }}>
          <div className="panel-card">
            <h4 style={{ color: '#22c55e', marginBottom: 10 }}>Strengths</h4>
            <ul className="list-stack">
              {(interview.strengths || []).map((s, idx) => <li key={idx}>✓ {s}</li>)}
            </ul>
          </div>
          <div className="panel-card">
            <h4 style={{ color: '#38bdf8', marginBottom: 10 }}>Suggestions</h4>
            <ul className="list-stack">
              {(interview.suggestions || []).map((s, idx) => <li key={idx}>→ {s}</li>)}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function ResumePage() {
  const [jobTitle, setJobTitle] = useState('Full Stack Developer');
  const [skills, setSkills] = useState('Java, Spring Boot, React, MongoDB, REST APIs, Git, SQL');
  const [summary, setSummary] = useState('');
  const [file, setFile] = useState(null);

  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/resume/history')
      .then((res) => setHistory(res.data?.analyses || []))
      .catch(() => {});
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('jobTitle', jobTitle);
        formData.append('summary', summary);
        formData.append('skills', skills);

        res = await api.post('/resume/analyze', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await api.post('/resume/analyze', {
          jobTitle,
          summary,
          skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        });
      }

      setAnalysis(res.data.analysis);
      setHistory((prev) => [res.data.analysis, ...prev]);
    } catch (err) {
      setError(err.response?.data?.message || 'Resume analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-stack">
      <section className="panel-card">
        <h3>Resume Analyzer & ATS Scoring</h3>
        <p className="muted-text" style={{ marginBottom: 20 }}>
          Upload your resume document (PDF, DOC, DOCX) or paste summary text to identify ATS keyword matches and missing skills.
        </p>

        <form onSubmit={handleAnalyze} className="auth-form" style={{ maxWidth: '100%' }}>
          <div className="form-grid two-col">
            <label style={{ display: 'grid', gap: 6, fontWeight: 600 }}>
              Target Job Title
              <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Java Full Stack Developer" required />
            </label>
            <label style={{ display: 'grid', gap: 6, fontWeight: 600 }}>
              Key Technical Skills (comma separated)
              <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. Java, React, SQL, Spring Boot" />
            </label>
          </div>

          <div style={{ marginTop: 12, padding: 20, border: '2px dashed var(--border)', borderRadius: 14, textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
            <Upload size={28} style={{ color: '#38bdf8', marginBottom: 8 }} />
            <p style={{ margin: '0 0 10px', fontWeight: 600 }}>
              {file ? file.name : 'Upload Resume File (PDF, DOC, DOCX)'}
            </p>
            <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} style={{ maxWidth: 300, margin: '0 auto' }} />
          </div>

          <label style={{ display: 'grid', gap: 6, fontWeight: 600, marginTop: 14 }}>
            Or Paste Resume Summary / Experience Text:
            <textarea
              rows={5}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Paste your resume content, experience bullets, and project descriptions here..."
            />
          </label>

          {error && <div className="error-banner">{error}</div>}

          <div className="button-row" style={{ marginTop: 18 }}>
            <button type="submit" className="primary-btn large" disabled={loading}>
              {loading ? 'Analyzing with ATS Engine...' : 'Analyze Resume'}
            </button>
          </div>
        </form>
      </section>

      {analysis && (
        <section className="panel-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2>Analysis Report: {analysis.jobTitle || 'Developer Profile'}</h2>
              <p className="muted-text">File: {analysis.fileName || 'Direct Text Input'}</p>
            </div>
            <div style={{ textAlign: 'center', padding: '12px 24px', borderRadius: 14, background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block' }}>ATS SCORE</span>
              <strong style={{ fontSize: '2.4rem', color: '#38bdf8' }}>{analysis.score} / 100</strong>
            </div>
          </div>

          <div className="scores-grid" style={{ marginBottom: 24 }}>
            <div className="mini-stat"><span>Skills Alignment</span><strong>{analysis.skillsScore}%</strong></div>
            <div className="mini-stat"><span>Education</span><strong>{analysis.educationScore}%</strong></div>
            <div className="mini-stat"><span>Projects Depth</span><strong>{analysis.projectsScore}%</strong></div>
            <div className="mini-stat"><span>Experience</span><strong>{analysis.experienceScore}%</strong></div>
            <div className="mini-stat"><span>Keywords Match</span><strong>{analysis.keywordScore}%</strong></div>
            <div className="mini-stat"><span>Formatting</span><strong>{analysis.formattingScore}%</strong></div>
          </div>

          <div className="dashboard-grid" style={{ marginBottom: 20 }}>
            <div className="panel-card" style={{ background: 'rgba(34, 197, 94, 0.05)', borderColor: 'rgba(34, 197, 94, 0.2)' }}>
              <h4 style={{ color: '#22c55e', marginBottom: 10 }}>Identified Strengths</h4>
              <ul className="list-stack">
                {(analysis.strengths || []).map((s, idx) => <li key={idx}>✓ {s}</li>)}
              </ul>
            </div>

            <div className="panel-card" style={{ background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
              <h4 style={{ color: '#f59e0b', marginBottom: 10 }}>Missing In-Demand Skills</h4>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {(analysis.missingSkills || []).map((sk, idx) => (
                  <span key={idx} className="tag" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    + {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="panel-card" style={{ background: 'rgba(56, 189, 248, 0.05)', borderColor: 'rgba(56, 189, 248, 0.2)' }}>
            <h4 style={{ color: '#38bdf8', marginBottom: 10 }}>ATS Recommendations</h4>
            <ul className="list-stack">
              {(analysis.suggestions || []).map((sug, idx) => <li key={idx}>→ {sug}</li>)}
            </ul>
          </div>
        </section>
      )}

      {history.length > 0 && (
        <section className="panel-card">
          <h3>Resume Scoring History</h3>
          <div className="table-wrap" style={{ marginTop: 14 }}>
            <table>
              <thead>
                <tr>
                  <th>Target Role</th>
                  <th>File</th>
                  <th>Score</th>
                  <th>Skills Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id || h._id}>
                    <td><strong>{h.jobTitle}</strong></td>
                    <td>{h.fileName || 'Text Input'}</td>
                    <td><strong style={{ color: h.score >= 75 ? '#22c55e' : '#f59e0b' }}>{h.score}%</strong></td>
                    <td>{h.skillsScore}%</td>
                    <td>{new Date(h.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function CodingPage() {
  const { id } = useParams();
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [language, setLanguage] = useState('Java');
  const [code, setCode] = useState(starterCodeMap.Java);
  const [filterDifficulty, setFilterDifficulty] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/coding/problems').then((res) => {
      const list = res.data?.problems || [];
      setProblems(list);
      if (id) {
        const found = list.find((p) => (p.id || p._id) === id);
        if (found) setSelectedProblem(found);
        else if (list.length > 0) setSelectedProblem(list[0]);
      } else if (list.length > 0) {
        setSelectedProblem(list[0]);
      }
    });
  }, [id]);

  const handleSelectProblem = (prob) => {
    setSelectedProblem(prob);
    setSubmissionResult(null);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(starterCodeMap[lang] || starterCodeMap.Java);
  };

  const handleSubmitCode = async () => {
    if (!selectedProblem) return;
    setSubmitting(true);
    setSubmissionResult(null);

    try {
      const res = await api.post('/coding/submit', {
        problemId: selectedProblem.id || selectedProblem._id,
        language,
        code,
        solved: true,
      });
      setSubmissionResult(res.data?.result || { status: 'ACCEPTED', score: 90, executionTime: '45 ms' });
    } catch {
      setSubmissionResult({ status: 'ERROR', score: 0, executionTime: '0 ms' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProblems = problems.filter((p) => {
    const diffMatch = filterDifficulty === 'ALL' || p.difficulty?.toUpperCase() === filterDifficulty;
    const catMatch = filterCategory === 'ALL' || p.category?.toUpperCase() === filterCategory;
    return diffMatch && catMatch;
  });

  return (
    <div className="content-stack">
      <section className="panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3>Coding Practice & Algorithms</h3>
            <p className="muted-text">Solve core interview DSA and SQL questions in multiple languages.</p>
          </div>
          <div className="filter-row">
            <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}>
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="ALL">All Categories</option>
              <option value="DSA">DSA</option>
              <option value="SQL">SQL</option>
              <option value="JAVASCRIPT">JavaScript</option>
              <option value="PYTHON">Python</option>
            </select>
          </div>
        </div>

        <div className="coding-layout" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
          <div className="problem-list" style={{ maxHeight: 680, overflowY: 'auto' }}>
            {filteredProblems.map((p) => {
              const pid = p.id || p._id;
              const isSelected = (selectedProblem?.id || selectedProblem?._id) === pid;
              return (
                <button
                  key={pid}
                  type="button"
                  className={isSelected ? 'problem-item active' : 'problem-item'}
                  onClick={() => handleSelectProblem(p)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{p.title}</strong>
                    <span className="tag" style={{ fontSize: '0.72rem' }}>{p.difficulty}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{p.category}</span>
                </button>
              );
            })}
          </div>

          {selectedProblem ? (
            <div className="problem-detail">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2>{selectedProblem.title}</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="tag" style={{ color: '#22c55e', borderColor: '#22c55e' }}>{selectedProblem.difficulty}</span>
                  <span className="tag">{selectedProblem.category}</span>
                </div>
              </div>

              <p style={{ color: 'var(--text)', lineHeight: 1.6, marginBottom: 16 }}>
                {selectedProblem.description}
              </p>

              {selectedProblem.examples && selectedProblem.examples.length > 0 && (
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 10, border: '1px solid var(--border)', marginBottom: 16 }}>
                  <strong style={{ display: 'block', color: '#38bdf8', marginBottom: 6 }}>Example:</strong>
                  {selectedProblem.examples.map((ex, idx) => (
                    <div key={idx} style={{ fontFamily: 'monospace', fontSize: '0.88rem' }}>{ex}</div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Language:</span>
                  <select value={language} onChange={(e) => handleLanguageChange(e.target.value)} style={{ padding: '0.4rem 0.8rem' }}>
                    <option value="Java">Java (JDK 17)</option>
                    <option value="Python">Python 3</option>
                    <option value="JavaScript">JavaScript (ES6)</option>
                    <option value="C++">C++ (GCC)</option>
                    <option value="C">C</option>
                    <option value="SQL">SQL</option>
                  </select>
                </div>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setCode(starterCodeMap[language] || starterCodeMap.Java)}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                >
                  <RefreshCw size={13} style={{ marginRight: 4 }} /> Reset Code
                </button>
              </div>

              <textarea
                rows={13}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  width: '100%',
                  fontFamily: 'Consolas, Monaco, monospace',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  padding: 16,
                  borderRadius: 12,
                  background: '#070f1e',
                  border: '1px solid var(--border)',
                  color: '#93c5fd',
                }}
              />

              <div className="button-row" style={{ marginTop: 14, justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                  Safe sandbox execution enabled.
                </span>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={handleSubmitCode}
                  disabled={submitting}
                >
                  {submitting ? 'Evaluating Code...' : 'Submit Solution'}
                </button>
              </div>

              {submissionResult && (
                <div
                  style={{
                    marginTop: 18,
                    padding: 16,
                    borderRadius: 12,
                    background: submissionResult.status === 'ACCEPTED' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${submissionResult.status === 'ACCEPTED' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: submissionResult.status === 'ACCEPTED' ? '#22c55e' : '#f87171', fontSize: '1.1rem' }}>
                        Verdict: {submissionResult.status}
                      </strong>
                      <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.88rem' }}>
                        Execution Time: {submissionResult.executionTime} · Test cases evaluated
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block' }}>Score</span>
                      <strong style={{ fontSize: '1.5rem', color: '#38bdf8' }}>{submissionResult.score} / 100</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-box">Select a coding problem to begin practice.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get('/questions', { params: { type, difficulty, search } })
      .then((res) => setQuestions(res.data?.questions || []))
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, [type, difficulty, search]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="content-stack">
      <section className="panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h3>Campus Question Bank</h3>
            <p className="muted-text">Browse frequently asked interview questions with model answers and key takeaways.</p>
          </div>
        </div>

        <div className="filter-row" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '0 12px', border: '1px solid var(--border)', flex: 1 }}>
            <Search size={16} color="var(--muted)" style={{ marginRight: 8 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions by topic, keyword, or concept..."
              style={{ border: 'none', background: 'transparent', padding: '10px 0', width: '100%', outline: 'none' }}
            />
          </div>

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="HR">HR</option>
            <option value="Behavioral">Behavioral</option>
            <option value="DSA">DSA</option>
            <option value="SQL">SQL</option>
            <option value="Aptitude">Aptitude</option>
          </select>

          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {loading ? (
          <div className="empty-box">Loading question bank...</div>
        ) : questions.length === 0 ? (
          <div className="empty-box">No matching questions found. Try refining your search.</div>
        ) : (
          <div className="stack-list">
            {questions.map((item) => {
              const qid = item.id || item._id;
              const isExpanded = expandedId === qid;
              return (
                <div
                  key={qid}
                  className="question-row"
                  onClick={() => toggleExpand(qid)}
                  style={{ cursor: 'pointer', display: 'block', padding: 18 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                        <span className="tag" style={{ color: '#38bdf8' }}>{item.category || item.type}</span>
                        <span className="tag">{item.difficulty}</span>
                      </div>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text)' }}>
                        {item.title || item.question}
                      </h4>
                    </div>
                    <span style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600 }}>
                      {isExpanded ? 'Hide Answer' : 'Show Answer'}
                    </span>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                      {item.description && (
                        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 10 }}>
                          <strong>Context:</strong> {item.description}
                        </p>
                      )}
                      <div style={{ background: 'rgba(56, 189, 248, 0.05)', padding: 14, borderRadius: 10, border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                        <strong style={{ color: '#38bdf8', display: 'block', marginBottom: 6 }}>Recommended Answer:</strong>
                        <p style={{ margin: 0, lineHeight: 1.6, fontSize: '0.93rem' }}>
                          {item.answer || 'Provide a structured answer with technical justification and trade-offs.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function ProgressPage() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/progress')
      .then((res) => setProgress(res.data?.progress))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const chartData = [
    { day: 'Mon', activity: progress?.weeklyActivity?.[0] || 2 },
    { day: 'Tue', activity: progress?.weeklyActivity?.[1] || 4 },
    { day: 'Wed', activity: progress?.weeklyActivity?.[2] || 5 },
    { day: 'Thu', activity: progress?.weeklyActivity?.[3] || 3 },
    { day: 'Fri', activity: progress?.weeklyActivity?.[4] || 6 },
    { day: 'Sat', activity: progress?.weeklyActivity?.[5] || 2 },
    { day: 'Sun', activity: progress?.weeklyActivity?.[6] || 4 },
  ];

  const skillBars = [
    { skill: 'Technical Knowledge', value: progress?.skills?.Technical || 85, color: '#38bdf8' },
    { skill: 'Communication Skills', value: progress?.skills?.Communication || 78, color: '#22c55e' },
    { skill: 'Coding & Algorithms', value: progress?.skills?.Coding || 72, color: '#f59e0b' },
    { skill: 'Problem Solving', value: progress?.skills?.['Problem Solving'] || 80, color: '#a855f7' },
    { skill: 'Resume Strength', value: progress?.resumeScore || 75, color: '#ec4899' },
  ];

  return (
    <div className="content-stack">
      <section className="panel-card">
        <h3>Performance Summary</h3>
        <p className="muted-text" style={{ marginBottom: 18 }}>Aggregated metrics tracking your interview readiness.</p>

        <div className="scores-grid">
          <div className="mini-stat">
            <span>Interviews Done</span>
            <strong>{loading ? '...' : progress?.interviewsCompleted || 0}</strong>
          </div>
          <div className="mini-stat">
            <span>Average Score</span>
            <strong style={{ color: '#22c55e' }}>{loading ? '...' : `${progress?.averageInterviewScore || 0}%`}</strong>
          </div>
          <div className="mini-stat">
            <span>Resume ATS Score</span>
            <strong style={{ color: '#38bdf8' }}>{loading ? '...' : `${progress?.resumeScore || 0}%`}</strong>
          </div>
          <div className="mini-stat">
            <span>Coding Solved</span>
            <strong style={{ color: '#f59e0b' }}>{loading ? '...' : progress?.codingProblemsSolved || 0}</strong>
          </div>
          <div className="mini-stat">
            <span>Active Streak</span>
            <strong style={{ color: '#ec4899' }}>{loading ? '...' : `${progress?.currentStreak || 1} Days`}</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel-card">
          <h3>Weekly Preparation Activity</h3>
          <p className="muted-text" style={{ marginBottom: 14 }}>Daily practice sessions and drill completions</p>
          <div style={{ height: 260, width: '100%', marginTop: 10 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="var(--muted)" />
                <YAxis stroke="var(--muted)" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="activity" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel-card">
          <h3>Skill Mastery Breakdown</h3>
          <p className="muted-text" style={{ marginBottom: 14 }}>Evaluated across all mock interview rounds</p>
          <div className="progress-list" style={{ marginTop: 16 }}>
            {skillBars.map((item) => (
              <div key={item.skill} className="progress-row">
                <span style={{ minWidth: 150 }}>{item.skill}</span>
                <div className="progress-bar small"><span style={{ width: `${item.value}%`, background: item.color }} /></div>
                <strong style={{ minWidth: 40, textAlign: 'right' }}>{item.value}%</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    college: user?.college || '',
    degree: user?.degree || '',
    branch: user?.branch || '',
    graduationYear: user?.graduationYear || new Date().getFullYear(),
    skills: (user?.skills || []).join(', '),
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        college: user.college || '',
        degree: user.degree || '',
        branch: user.branch || '',
        graduationYear: user.graduationYear || new Date().getFullYear(),
        skills: (user.skills || []).join(', '),
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const res = await api.put('/users/profile', {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setUser(res.data.user);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="content-stack">
      <section className="panel-card" style={{ maxWidth: 760 }}>
        <h3>Student Profile</h3>
        <p className="muted-text" style={{ marginBottom: 20 }}>Keep your academic and skill details up to date for targeted recommendations.</p>

        {success && <div className="success-banner">{success}</div>}
        {error && <div className="error-banner">{error}</div>}

        <form className="auth-form" onSubmit={handleSave} style={{ maxWidth: '100%' }}>
          <label style={{ display: 'grid', gap: 6, fontWeight: 600 }}>
            Full Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label style={{ display: 'grid', gap: 6, fontWeight: 600 }}>
            Registered Email
            <input value={user?.email || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
          </label>

          <div className="form-grid two-col">
            <label style={{ display: 'grid', gap: 6, fontWeight: 600 }}>
              College / University
              <input name="college" value={form.college} onChange={handleChange} required />
            </label>
            <label style={{ display: 'grid', gap: 6, fontWeight: 600 }}>
              Degree
              <input name="degree" value={form.degree} onChange={handleChange} required />
            </label>
          </div>

          <div className="form-grid two-col">
            <label style={{ display: 'grid', gap: 6, fontWeight: 600 }}>
              Branch / Department
              <input name="branch" value={form.branch} onChange={handleChange} required />
            </label>
            <label style={{ display: 'grid', gap: 6, fontWeight: 600 }}>
              Graduation Year
              <input type="number" name="graduationYear" value={form.graduationYear} onChange={handleChange} />
            </label>
          </div>

          <label style={{ display: 'grid', gap: 6, fontWeight: 600 }}>
            Technical Skills (comma separated)
            <input name="skills" value={form.skills} onChange={handleChange} placeholder="e.g. Java, React, MongoDB, DSA, SQL" />
          </label>

          <div className="button-row" style={{ marginTop: 12 }}>
            <button type="submit" className="primary-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function SettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage('');
    setError('');

    try {
      await api.put('/users/password', passwords);
      setMessage('Password updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Password update failed.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you absolutely sure you want to delete your account? All interview histories, resume evaluations, and progress records will be permanently removed from MongoDB.'
    );
    if (!confirmed) return;

    try {
      await api.delete('/users/account');
      logout();
      navigate('/');
    } catch {
      alert('Could not delete account. Please try again.');
    }
  };

  return (
    <div className="content-stack">
      <section className="panel-card" style={{ maxWidth: 640 }}>
        <h3>Security Settings</h3>
        <p className="muted-text" style={{ marginBottom: 18 }}>Update your password to keep your account secure.</p>

        {message && <div className="success-banner">{message}</div>}
        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handlePasswordChange} className="auth-form" style={{ maxWidth: '100%' }}>
          <input
            type="password"
            placeholder="Current Password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords((prev) => ({ ...prev, currentPassword: e.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="New Password (min 6 characters)"
            value={passwords.newPassword}
            onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))}
            required
          />
          <button type="submit" className="primary-btn" disabled={updating}>
            {updating ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </section>

      <section className="panel-card danger-box" style={{ maxWidth: 640 }}>
        <h3 style={{ color: '#f87171' }}>Danger Zone</h3>
        <p className="muted-text" style={{ marginBottom: 16 }}>
          Permanently delete your user account and all associated MongoDB collections data.
        </p>
        <button type="button" className="danger-btn" onClick={handleDeleteAccount}>
          <Trash2 size={16} style={{ marginRight: 6 }} /> Delete My Account
        </button>
      </section>
    </div>
  );
}

function AdminPage() {
  const [stats, setStats] = useState({ totalUsers: 0, totalQuestions: 0, totalInterviews: 0, averageScore: 0, activeUsers: 0 });
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  const [newQuestion, setNewQuestion] = useState({
    title: '',
    category: 'Technical',
    difficulty: 'Medium',
    type: 'Technical',
    answer: '',
  });
  const [creatingQ, setCreatingQ] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/admin/statistics'),
      api.get('/admin/users'),
      api.get('/questions'),
    ]).then(([sRes, uRes, qRes]) => {
      setStats(sRes.data?.stats || {});
      setUsers(uRes.data?.users || []);
      setQuestions(qRes.data?.questions || []);
    });
  }, []);

  const handleToggleRole = async (userId, currentRole) => {
    const nextRole = currentRole?.toUpperCase() === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await api.put(`/admin/users/${userId}/role`, { role: nextRole });
      setUsers((prev) => prev.map((u) => (u.id || u._id === userId ? { ...u, role: nextRole } : u)));
    } catch {}
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user? All their interviews and records will be deleted.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== userId));
      setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
    } catch {}
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    setCreatingQ(true);
    try {
      const res = await api.post('/admin/questions', newQuestion);
      if (res.data?.question) {
        setQuestions((prev) => [res.data.question, ...prev]);
        setStats((prev) => ({ ...prev, totalQuestions: prev.totalQuestions + 1 }));
        setNewQuestion({ title: '', category: 'Technical', difficulty: 'Medium', type: 'Technical', answer: '' });
      }
    } catch {
      alert('Could not create question');
    } finally {
      setCreatingQ(false);
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (!window.confirm('Delete this question from question bank?')) return;
    try {
      await api.delete(`/admin/questions/${qId}`);
      setQuestions((prev) => prev.filter((q) => (q.id || q._id) !== qId));
      setStats((prev) => ({ ...prev, totalQuestions: prev.totalQuestions - 1 }));
    } catch {}
  };

  return (
    <div className="content-stack">
      <section className="stats-grid">
        <div className="stat-card"><span>Total Registered Users</span><strong>{stats.totalUsers}</strong></div>
        <div className="stat-card"><span>Total Mock Interviews</span><strong>{stats.totalInterviews}</strong></div>
        <div className="stat-card"><span>Platform Average Score</span><strong>{stats.averageScore}%</strong></div>
        <div className="stat-card"><span>Question Bank Total</span><strong>{stats.totalQuestions}</strong></div>
        <div className="stat-card"><span>Active Candidates</span><strong>{stats.activeUsers}</strong></div>
      </section>

      <div className="button-row" style={{ marginBottom: 12 }}>
        <button
          type="button"
          className={activeTab === 'users' ? 'primary-btn' : 'secondary-btn'}
          onClick={() => setActiveTab('users')}
        >
          User Management ({users.length})
        </button>
        <button
          type="button"
          className={activeTab === 'questions' ? 'primary-btn' : 'secondary-btn'}
          onClick={() => setActiveTab('questions')}
        >
          Question Bank Management ({questions.length})
        </button>
      </div>

      {activeTab === 'users' && (
        <section className="panel-card">
          <h3>Registered Users Management</h3>
          <div className="table-wrap" style={{ marginTop: 14 }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>College</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const uid = u.id || u._id;
                  const isAdmin = u.role?.toUpperCase() === 'ADMIN';
                  return (
                    <tr key={uid}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.college || '—'}</td>
                      <td>
                        <span className="tag" style={{ color: isAdmin ? '#38bdf8' : 'var(--text)' }}>
                          {u.role?.toUpperCase()}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => handleToggleRole(uid, u.role)}
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          >
                            Set to {isAdmin ? 'USER' : 'ADMIN'}
                          </button>
                          <button
                            type="button"
                            className="danger-btn"
                            onClick={() => handleDeleteUser(uid)}
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'questions' && (
        <section className="panel-card">
          <h3>Add Question to Platform Bank</h3>
          <form onSubmit={handleCreateQuestion} className="auth-form" style={{ maxWidth: '100%', marginBottom: 30 }}>
            <label style={{ display: 'grid', gap: 6, fontWeight: 600 }}>
              Question Text / Title
              <input
                value={newQuestion.title}
                onChange={(e) => setNewQuestion((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Explain how database indexing works under the hood."
                required
              />
            </label>

            <div className="form-grid two-col">
              <label style={{ display: 'grid', gap: 6, fontWeight: 600 }}>
                Category
                <select value={newQuestion.category} onChange={(e) => setNewQuestion((prev) => ({ ...prev, category: e.target.value, type: e.target.value }))}>
                  <option value="Technical">Technical</option>
                  <option value="HR">HR</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="DSA">DSA</option>
                  <option value="SQL">SQL</option>
                  <option value="Aptitude">Aptitude</option>
                </select>
              </label>

              <label style={{ display: 'grid', gap: 6, fontWeight: 600 }}>
                Difficulty
                <select value={newQuestion.difficulty} onChange={(e) => setNewQuestion((prev) => ({ ...prev, difficulty: e.target.value }))}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </label>
            </div>

            <label style={{ display: 'grid', gap: 6, fontWeight: 600 }}>
              Model Answer / Explanation
              <textarea
                rows={3}
                value={newQuestion.answer}
                onChange={(e) => setNewQuestion((prev) => ({ ...prev, answer: e.target.value }))}
                placeholder="Recommended comprehensive model answer..."
              />
            </label>

            <div className="button-row" style={{ marginTop: 10 }}>
              <button type="submit" className="primary-btn" disabled={creatingQ}>
                {creatingQ ? 'Adding...' : 'Add Question'}
              </button>
            </div>
          </form>

          <h3>Existing Questions ({questions.length})</h3>
          <div className="table-wrap" style={{ marginTop: 14 }}>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Question</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => {
                  const qid = q.id || q._id;
                  return (
                    <tr key={qid}>
                      <td><span className="tag">{q.category || q.type}</span></td>
                      <td><span className="tag">{q.difficulty}</span></td>
                      <td><strong>{q.title || q.question}</strong></td>
                      <td>
                        <button
                          type="button"
                          className="danger-btn"
                          onClick={() => handleDeleteQuestion(qid)}
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview"
        element={
          <ProtectedRoute>
            <AppLayout>
              <InterviewPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviews"
        element={
          <ProtectedRoute>
            <AppLayout>
              <InterviewsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/interviews/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <InterviewDetailPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ResumePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/coding"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CodingPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/coding/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CodingPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/questions"
        element={
          <ProtectedRoute>
            <AppLayout>
              <QuestionsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProgressPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AppLayout>
              <AdminPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
    </Routes>
  );
}