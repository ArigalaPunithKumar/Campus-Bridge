// --- MOCK DATA ---
// In a real app, this data would come from a database via API calls.

const mockData = {
    courses: [
        { id: 'CS101', name: 'Introduction to Programming', faculty: 'Dr. Smith', credits: 3, description: 'Fundamentals of programming using Python.', materials: [{ type: 'pdf', title: 'Syllabus', url: '#' }, { type: 'video', title: 'Lecture 1: Intro', url: '#' }] },
        { id: 'MA201', name: 'Linear Algebra', faculty: 'Dr. Jones', credits: 4, description: 'Vectors, matrices, and linear transformations.', materials: [{ type: 'pdf', title: 'Chapter 1 Notes', url: '#' }] },
        { id: 'DS300', name: 'Data Structures & Algorithms', faculty: 'Dr. Chen', credits: 4, description: 'Core data structures and algorithm analysis.', materials: [{ type: 'pdf', title: 'Lecture Slides - Week 3', url: '#' }, { type: 'link', title: 'Complexity Cheatsheet', url: '#' }] },
        { id: 'WD401', name: 'Web Development', faculty: 'Prof. Web', credits: 3, description: 'Frontend and Backend basics.', materials: [] }
    ],
    attendance: {
        'CS101': { present: 18, total: 20, percentage: 90 },
        'MA201': { present: 22, total: 24, percentage: 91.7 },
        'DS300': { present: 15, total: 15, percentage: 100 },
        'WD401': { present: 10, total: 12, percentage: 83.3 },
    },
    assignments: [
        { id: 'A1', courseId: 'CS101', title: 'Python Basics Quiz', dueDate: '2023-11-15', type: 'Quiz', status: 'Submitted', score: '85/100' },
        { id: 'A2', courseId: 'DS300', title: 'Implement Linked List', dueDate: '2023-11-20', type: 'Coding', status: 'Pending', score: null },
        { id: 'A3', courseId: 'MA201', title: 'Matrix Operations Worksheet', dueDate: '2023-11-10', type: 'PDF Upload', status: 'Graded', score: '9/10' },
    ],
    codingTracks: [
        { id: 'dsa', name: 'Data Structures & Algorithms', description: 'Master fundamental DSA concepts.', enrolled: true },
        { id: 'webdev', name: 'Full Stack Web Development', description: 'Learn HTML, CSS, JS, Node.js, React.', enrolled: false },
        { id: 'python', name: 'Python Programming', description: 'From basics to advanced Python.', enrolled: true },
        { id: 'java', name: 'Java Programming', description: 'Object-oriented programming with Java.', enrolled: false },
    ],
    codingProblems: [
        { id: 'P1', trackId: 'dsa', title: 'Two Sum', difficulty: 'Easy', status: 'Solved', tags: ['Array', 'Hash Table'] },
        { id: 'P2', trackId: 'dsa', title: 'Reverse Linked List', difficulty: 'Easy', status: 'Attempted', tags: ['Linked List'] },
        { id: 'P3', trackId: 'python', title: 'Fibonacci Sequence', difficulty: 'Medium', status: 'Not Attempted', tags: ['Recursion', 'DP'] },
        { id: 'P4', trackId: 'dsa', title: 'Validate Binary Search Tree', difficulty: 'Medium', status: 'Solved', tags: ['Tree', 'BST', 'Recursion'] },
        { id: 'P5', trackId: 'java', title: 'Implement Stack using Array', difficulty: 'Easy', status: 'Not Attempted', tags: ['Stack', 'Array'] },
    ],
    studentProfile: {
        name: 'Demo Student',
        email: 'student@university.edu',
        id: 'S12345',
        program: 'B.Tech Computer Science',
        year: 3,
        badges: ['Pythonista', 'Problem Solver Lv. 2', 'Consistency King'],
        weeklyStreak: 5,
        skills: { // Data for heatmap (simplified)
            'Arrays': 80, 'Linked Lists': 70, 'Trees': 55, 'Graphs': 40,
            'Sorting': 75, 'Searching': 85, 'Recursion': 60, 'DP': 30,
            'Python': 90, 'Java': 45, 'C++': 65, 'Web Basics': 20
        }
    },
    facultyInfo: {
        coursesTaught: ['CS101', 'DS300'],
        studentsMonitored: 50, // Example count
    },
    adminStats: {
        totalStudents: 500,
        totalFaculty: 50,
        activeCodingUsers: 350,
        avgPlacementReadiness: 75, // Percentage
    },
    leaderboard: [
        { rank: 1, name: 'Alice Coder', score: 2500, problemsSolved: 150 },
        { rank: 2, name: 'Bob Debug', score: 2350, problemsSolved: 140 },
        { rank: 3, name: 'Demo Student', score: 2100, problemsSolved: 120 }, // Example inclusion
        { rank: 4, name: 'Charlie Algo', score: 2050, problemsSolved: 115 },
        { rank: 5, name: 'Diana Struct', score: 1900, problemsSolved: 110 },
    ],
    jobMatches: [
        { jobId: 'J101', title: 'Software Engineer Intern', company: 'Tech Solutions Inc.', matchScore: 85, requiredSkills: ['Python', 'DSA', 'Problem Solving'], description: 'Assist senior engineers in developing new features...' },
        { jobId: 'J102', title: 'Web Developer (Frontend)', company: 'Creative Designs Co.', matchScore: 60, requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'], description: 'Build responsive user interfaces for web applications...' },
        { jobId: 'J103', title: 'Data Analyst Intern', company: 'Data Insights Ltd.', matchScore: 70, requiredSkills: ['Python', 'SQL', 'Data Analysis'], description: 'Analyze datasets to generate insights for clients...' }
    ]
};

// --- SIMULATED API FUNCTIONS ---

const api = {
    // General
    getUserInfo: () => new Promise(resolve => setTimeout(() => resolve({
        name: sessionStorage.getItem('userName'),
        email: sessionStorage.getItem('userEmail'),
        role: sessionStorage.getItem('userRole')
    }), 200)), // Simulate network delay

    // Student Data
    getStudentCourses: () => new Promise(resolve => setTimeout(() => resolve(mockData.courses), 300)),
    getStudentAttendance: () => new Promise(resolve => setTimeout(() => resolve(mockData.attendance), 250)),
    getStudentAssignments: () => new Promise(resolve => setTimeout(() => resolve(mockData.assignments), 350)),
    getCodingTracks: () => new Promise(resolve => setTimeout(() => resolve(mockData.codingTracks), 200)),
    getCodingProblems: (trackId = null) => new Promise(resolve => setTimeout(() => {
        const problems = trackId ? mockData.codingProblems.filter(p => p.trackId === trackId) : mockData.codingProblems;
        resolve(problems);
    }, 400)),
    getCodingProblemDetails: (problemId) => new Promise(resolve => setTimeout(() => {
        const problem = mockData.codingProblems.find(p => p.id === problemId);
        // Add mock description and starter code
        if (problem) {
            problem.description = `Solve the ${problem.title} problem. Given an input array/list/tree, return the expected output according to the problem statement. Constraints: ... Examples: ...`;
            problem.starterCode = {
                python: `# Write your Python code here\ndef solve():\n    pass`,
                java: `// Write your Java code here\nclass Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
                cpp: `// Write your C++ code here\n#include <iostream>\n\nint main() {\n    // Your code here\n    return 0;\n}`
            };
        }
        resolve(problem);
    }, 450)),
    getStudentProfile: () => new Promise(resolve => setTimeout(() => resolve(mockData.studentProfile), 300)),
    getJobMatches: () => new Promise(resolve => setTimeout(() => resolve(mockData.jobMatches), 500)),
    submitCode: (problemId, code, language) => new Promise(resolve => setTimeout(() => {
        console.log(`Simulating submission for ${problemId} in ${language}:\n${code}`);
        // Simulate different outcomes
        const random = Math.random();
        if (random < 0.6) resolve({ status: 'Accepted', output: 'All test cases passed!', executionTime: '120ms' });
        else if (random < 0.8) resolve({ status: 'Wrong Answer', output: 'Test case 3 failed. Expected: 10, Got: 5', executionTime: '50ms' });
        else resolve({ status: 'Time Limit Exceeded', output: 'Execution exceeded time limit on test case 5.', executionTime: '2000ms' });
    }, 1500)), // Simulate compilation/run time
    // Simulate AI Features (returning canned responses)
    getCodeHint: (problemId) => new Promise(resolve => setTimeout(() => resolve({ hint: `Consider using a hash map to store elements you've already seen for the ${mockData.codingProblems.find(p => p.id === problemId)?.title || 'problem'}.` }), 800)),
    debugCode: (code, language) => new Promise(resolve => setTimeout(() => resolve({ suggestions: [`Potential issue on line 5: Variable 'count' might not be initialized.`, `Consider edge case: What if the input array is empty?`] }), 1200)),
    reviewCode: (code, language) => new Promise(resolve => setTimeout(() => resolve({
        feedback: [
            { type: 'Style', message: 'Variable name `tempVar` could be more descriptive.' },
            { type: 'Best Practice', message: 'Consider using `===` instead of `==` for strict equality checks in JavaScript.' },
            { type: 'Potential Bug', message: 'Loop condition might lead to an off-by-one error.' }
        ]
    }), 1500)),

    // Faculty Data
    getFacultyCourses: () => new Promise(resolve => setTimeout(() => resolve(mockData.courses.filter(c => mockData.facultyInfo.coursesTaught.includes(c.id))), 300)),
    getFacultyDashboardData: () => new Promise(resolve => setTimeout(() => resolve({
        courses: mockData.courses.filter(c => mockData.facultyInfo.coursesTaught.includes(c.id)),
        upcomingDeadlines: mockData.assignments.filter(a => mockData.facultyInfo.coursesTaught.includes(a.courseId) && new Date(a.dueDate) > new Date()).slice(0, 3),
        recentSubmissions: mockData.assignments.filter(a => mockData.facultyInfo.coursesTaught.includes(a.courseId) && a.status !== 'Pending').slice(0, 5) // Simplified
    }), 400)),
    createCourseContent: (courseId, content) => new Promise(resolve => setTimeout(() => {
        console.log(`Simulating adding content to ${courseId}:`, content);
        resolve({ success: true, message: 'Content added successfully.' });
    }, 500)),
    createCodingAssignment: (assignment) => new Promise(resolve => setTimeout(() => {
        console.log(`Simulating creation of coding assignment:`, assignment);
        assignment.id = `CA${Math.floor(Math.random() * 1000)}`;
        // In real app, add to database
        resolve({ success: true, message: 'Coding assignment created.', assignmentId: assignment.id });
    }, 600)),
    getStudentProgressAnalytics: (courseId = null) => new Promise(resolve => setTimeout(() => resolve({
        overallCompletion: 75, // Mock data
        averageScore: 82,
        studentsStruggling: ['S12345', 'S67890'], // Dummy IDs
        topicPerformance: { 'Arrays': 80, 'Loops': 90, 'Functions': 70 } // Mock data
    }), 700)),


    // Admin Data
    getAdminDashboardData: () => new Promise(resolve => setTimeout(() => resolve(mockData.adminStats), 300)),
    getSkillMetrics: () => new Promise(resolve => setTimeout(() => resolve({ // Aggregate skill data
        'Python': 75, 'Java': 60, 'C++': 55, 'DSA': 65, 'WebDev': 40
    }), 500)),
    getLeaderboard: () => new Promise(resolve => setTimeout(() => resolve(mockData.leaderboard), 400)),
    scheduleTest: (testDetails) => new Promise(resolve => setTimeout(() => {
        console.log(`Simulating scheduling test:`, testDetails);
        resolve({ success: true, message: `Test "${testDetails.title}" scheduled successfully.` });
    }, 600)),
    exportReport: (reportType) => new Promise(resolve => setTimeout(() => {
        console.log(`Simulating export of ${reportType} report...`);
        // In a real app, this would generate a file (CSV/PDF)
        resolve({ success: true, message: `${reportType} report generation started.` });
    }, 800)),
};