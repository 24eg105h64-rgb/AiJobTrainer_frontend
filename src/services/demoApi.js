export const DEMO_TOKEN = 'ai-job-trainer-local-demo';
const DEMO_MODE_KEY = 'aiJobTrainerDemoMode';
const DEMO_USER_KEY = 'aiJobTrainerDemoUser';
const DEMO_DATA_KEY = 'aiJobTrainerDemoData';

const baseDemoUser = {
  _id: 'demo-user',
  name: 'Demo Student',
  email: 'demo@local.test',
  role: 'user',
  college: 'Demo University',
  degree: 'B.Tech',
  branch: 'Computer Science',
  graduationYear: 2026,
  skills: ['JavaScript', 'React', 'SQL'],
};

const demoQuestions = [
  { text: 'Tell me about a project you are proud of and the impact it had.' },
  { text: 'How do you investigate a slow API endpoint?' },
  { text: 'What is the difference between a primary key and a foreign key?' },
];

const demoProblems = [
  {
    _id: 'demo-problem-1',
    title: 'Two Sum',
    category: 'DSA',
    difficulty: 'Easy',
    description: 'Return the indices of two numbers that add up to a target.',
    input: 'nums = [2, 7, 11, 15], target = 9',
    output: '[0, 1]',
    examples: ['[2, 7, 11, 15], 9 -> [0, 1]'],
    constraints: 'Use a hash map for an efficient solution.',
  },
  {
    _id: 'demo-problem-2',
    title: 'Palindrome Check',
    category: 'JavaScript',
    difficulty: 'Easy',
    description: 'Check whether a string reads the same forward and backward.',
    input: '"level"',
    output: 'true',
    examples: ['"level" -> true'],
    constraints: 'Ignore case and spaces.',
  },
];

const defaultDemoData = () => ({
  progress: {
    interviewsCompleted: 3,
    averageInterviewScore: 84,
    resumeScore: 78,
    codingProblemsSolved: 5,
    currentStreak: 4,
    skills: { Communication: 84, Technical: 88, Resume: 78, Coding: 72 },
    weeklyActivity: [2, 4, 5, 3, 6, 2, 1],
  },
  interviews: [
    {
      _id: 'demo-interview-1',
      interviewType: 'Technical',
      type: 'Technical',
      difficulty: 'Intermediate',
      score: 86,
      communicationScore: 88,
      technicalScore: 84,
      confidenceScore: 85,
      relevanceScore: 87,
      problemSolvingScore: 83,
      questions: [{ text: 'How do you design a reliable REST API?', answer: 'I start with clear resource boundaries, validation, and consistent error responses.' }],
      answers: [],
      strengths: ['Clear technical explanations', 'Good API design fundamentals'],
      suggestions: ['Include more measurable examples'],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
  analyses: [],
  problems: demoProblems,
});

export const isDemoMode = () => localStorage.getItem(DEMO_MODE_KEY) === 'true';

export function getDemoUser() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_USER_KEY)) || baseDemoUser;
  } catch {
    return baseDemoUser;
  }
}

export function startDemoSession() {
  localStorage.setItem(DEMO_MODE_KEY, 'true');
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify(baseDemoUser));
  return baseDemoUser;
}

export function endDemoSession() {
  localStorage.removeItem(DEMO_MODE_KEY);
  localStorage.removeItem(DEMO_USER_KEY);
}

function readDemoData() {
  try {
    return { ...defaultDemoData(), ...JSON.parse(localStorage.getItem(DEMO_DATA_KEY) || '{}') };
  } catch {
    return defaultDemoData();
  }
}

function writeDemoData(data) {
  localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(data));
}

function makeResponse(config, data) {
  return Promise.resolve({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
    request: null,
  });
}

function requestBody(config) {
  if (typeof config.data !== 'string') return config.data || {};
  try {
    return JSON.parse(config.data);
  } catch {
    return {};
  }
}

export async function demoAdapter(config) {
  const url = new URL(config.url, config.baseURL);
  const path = url.pathname.replace(/^\/api/, '');
  const method = (config.method || 'get').toLowerCase();
  const data = readDemoData();
  const body = requestBody(config);

  if (path === '/auth/me') return makeResponse(config, { user: getDemoUser() });
  if (path === '/progress') return makeResponse(config, { progress: data.progress });
  if (path === '/interviews/questions') return makeResponse(config, { questions: demoQuestions });
  if (path === '/interviews' && method === 'get') return makeResponse(config, { interviews: data.interviews });
  if (path.startsWith('/interviews/') && method === 'get') {
    const interview = data.interviews.find((item) => item._id === path.split('/').pop());
    return makeResponse(config, { interview });
  }
  if (path === '/interviews' && method === 'post') {
    const score = 86;
    const interview = {
      _id: `demo-interview-${Date.now()}`,
      interviewType: body.interviewType || 'Technical',
      type: body.interviewType || 'Technical',
      difficulty: body.difficulty || 'Intermediate',
      score,
      communicationScore: 88,
      technicalScore: 84,
      confidenceScore: 85,
      relevanceScore: 87,
      problemSolvingScore: 83,
      questions: (body.questions || []).map((question, index) => ({ ...question, answer: body.answers?.[index] || '' })),
      answers: body.answers || [],
      strengths: ['Structured responses', 'Relevant technical examples'],
      suggestions: ['Add specific results and metrics'],
      createdAt: new Date().toISOString(),
    };
    data.interviews.unshift(interview);
    data.progress.interviewsCompleted += 1;
    data.progress.averageInterviewScore = Math.round(
      (data.progress.averageInterviewScore * (data.progress.interviewsCompleted - 1) + score) / data.progress.interviewsCompleted,
    );
    writeDemoData(data);
    return makeResponse(config, { message: 'Demo interview completed.', interview });
  }
  if (path.startsWith('/interviews/') && method === 'delete') {
    data.interviews = data.interviews.filter((item) => item._id !== path.split('/').pop());
    writeDemoData(data);
    return makeResponse(config, { message: 'Demo interview deleted.' });
  }
  if (path === '/resume/history') return makeResponse(config, { analyses: data.analyses });
  if (path === '/resume/analyze' && method === 'post') {
    const analysis = {
      _id: `demo-analysis-${Date.now()}`,
      score: 82,
      jobTitle: body.jobTitle || 'Full Stack Developer',
      fileName: 'Demo resume',
      skillsScore: 84,
      educationScore: 80,
      projectsScore: 78,
      experienceScore: 76,
      keywordScore: 85,
      formattingScore: 88,
      strengths: ['Relevant technical skills', 'Clear project focus'],
      missingSkills: ['Add measurable project outcomes'],
      suggestions: ['Use quantified results in experience bullets'],
      createdAt: new Date().toISOString(),
    };
    data.analyses.unshift(analysis);
    data.progress.resumeScore = analysis.score;
    writeDemoData(data);
    return makeResponse(config, { message: 'Demo analysis complete.', analysis });
  }
  if (path === '/coding/problems') return makeResponse(config, { problems: data.problems });
  if (path === '/coding/submit' && method === 'post') {
    data.progress.codingProblemsSolved += body.solved ? 1 : 0;
    writeDemoData(data);
    return makeResponse(config, {
      result: { status: body.solved ? 'ACCEPTED' : 'WRONG_ANSWER', score: body.solved ? 92 : 60, executionTime: '42 ms' },
    });
  }
  if (path === '/users/profile' && method === 'get') return makeResponse(config, { user: getDemoUser() });
  if (path === '/users/profile' && method === 'put') {
    const user = { ...getDemoUser(), ...body };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
    return makeResponse(config, { message: 'Demo profile updated locally.', user });
  }
  if (path === '/users/password' && method === 'put') {
    return makeResponse(config, { message: 'Password changes are disabled in demo mode.' });
  }
  if (path === '/users/account' && method === 'delete') {
    return makeResponse(config, { message: 'Demo account data remains local to this browser.' });
  }
  if (path === '/questions' && method === 'get') return makeResponse(config, { questions: [] });
  if (path === '/admin/statistics') return makeResponse(config, { stats: { totalUsers: 1, totalQuestions: 0, totalInterviews: data.interviews.length, averageScore: 86, activeUsers: 1 } });
  if (path === '/admin/users') return makeResponse(config, { users: [getDemoUser()] });

  return makeResponse(config, { message: 'This action is unavailable in local demo mode.' });
}