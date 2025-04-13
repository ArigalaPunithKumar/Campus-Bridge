document.addEventListener('DOMContentLoaded', () => {
    const userNameDisplay = document.getElementById('user-name');
    const userRoleDisplay = document.getElementById('user-role');
    const logoutButton = document.getElementById('logout-button');
    const sidebar = document.getElementById('sidebar').querySelector('ul');
    const mainContent = document.getElementById('main-content');
    const contentSections = mainContent.querySelectorAll('.content-section');

    // --- Check Login Status ---
    const userRole = sessionStorage.getItem('userRole');
    const userName = sessionStorage.getItem('userName');

    if (!userRole || !userName) {
        console.error("User not logged in. Redirecting...");
        window.location.href = 'index.html'; // Redirect to login if no role found
        return; // Stop script execution
    }

    // --- Update Header ---
    userNameDisplay.textContent = userName;
    userRoleDisplay.textContent = userRole.charAt(0).toUpperCase() + userRole.slice(1); // Capitalize role

    // Verify logout button exists and attach handler
    if (logoutButton) {
        console.log('Logout button found, attaching handler');
        logoutButton.addEventListener('click', window.logout); // Attach logout function from auth.js
    } else {
        console.error('Logout button not found in DOM');
    }

    // --- Setup UI based on Role ---
    setupSidebar(userRole);
    setupRouting();

    // --- Initial Content Load ---
    // Load a default view or the first item in the sidebar
    const defaultTarget = getDefaultView(userRole);
    navigateTo(defaultTarget);


    // --- Functions ---

    function setupSidebar(role) {
        sidebar.innerHTML = ''; // Clear existing links
        let links = [];

        const commonLinks = [
            // Maybe a profile link common to all?
            // { text: 'My Profile', target: 'profile' }
        ];

        if (role === 'student') {
            links = [
                { text: 'My Courses (LMS)', target: 'student-courses' },
                { text: 'My Attendance', target: 'student-attendance' },
                { text: 'My Assignments', target: 'student-assignments' },
                { text: 'Coding Tracks', target: 'student-coding-tracks' },
                { text: 'My Profile & Skills', target: 'student-profile' },
                { text: 'Group Code Rooms', target: 'student-group-code' },
                { text: 'Job Matcher', target: 'student-job-match' }
            ];
        } else if (role === 'faculty') {
            links = [
                { text: 'Dashboard', target: 'faculty-dashboard' },
                { text: 'Manage Courses', target: 'faculty-manage-courses' },
                { text: 'Manage Coding', target: 'faculty-manage-coding' },
                { text: 'Monitor Progress', target: 'faculty-monitor-progress' }
            ];
        } else if (role === 'admin') {
            links = [
                { text: 'Admin Dashboard', target: 'admin-dashboard' },
                { text: 'Skill Metrics', target: 'admin-skill-metrics' },
                { text: 'Leaderboard', target: 'admin-leaderboard' },
                { text: 'Schedule Tests', target: 'admin-manage-tests' },
                { text: 'Export Reports', target: 'admin-reports' }
            ];
        }

        links = [...links, ...commonLinks]; // Add common links if any

        links.forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${link.target}`; // Use hash for simple routing
            a.textContent = link.text;
            a.dataset.target = link.target; // Store target section ID
            li.appendChild(a);
            sidebar.appendChild(li);
        });
    }

    function setupRouting() {
        sidebar.addEventListener('click', (event) => {
            if (event.target.tagName === 'A' && event.target.dataset.target) {
                event.preventDefault();
                const targetId = event.target.dataset.target;
                navigateTo(targetId);

                // Update active link style
                document.querySelectorAll('.sidebar a').forEach(link => link.classList.remove('active'));
                event.target.classList.add('active');
            }
        });

        // Handle hash changes (e.g., browser back/forward)
        window.addEventListener('hashchange', () => {
            const targetId = window.location.hash.substring(1);
            if (targetId) {
                navigateTo(targetId);
                // Update active link style based on hash
                document.querySelectorAll('.sidebar a').forEach(link => {
                    link.classList.toggle('active', link.dataset.target === targetId);
                });
            } else {
                // If hash is empty, navigate to default view
                const defaultTarget = getDefaultView(userRole);
                navigateTo(defaultTarget);
                document.querySelectorAll('.sidebar a').forEach(link => {
                    link.classList.toggle('active', link.dataset.target === defaultTarget);
                });
            }
        });
    }

    function navigateTo(targetId) {
        // Hide all content sections first
        contentSections.forEach(section => section.style.display = 'none');
        document.getElementById('welcome-message')?.remove(); // Remove initial welcome message

        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.style.display = 'block';
            window.location.hash = targetId; // Update hash in URL

            // --- Load Content Dynamically based on Role and Target ---
            // This is where you call functions from student.js, faculty.js, admin.js
            loadContentForSection(targetId, userRole);
        } else {
            console.warn(`Content section with id "${targetId}" not found.`);
            // Optionally show a default "not found" message
            mainContent.innerHTML = `<p>Section not found.</p>`;
        }
    }

    function loadContentForSection(targetId, role) {
        console.log(`Loading content for: ${targetId}, Role: ${role}`);
        // Clear previous dynamic content within the section if necessary
        const contentDiv = document.getElementById(`${targetId}-content`);
        if (contentDiv) {
            contentDiv.innerHTML = '<p><em>Loading...</em></p>'; // Show loading indicator
        } else if (document.getElementById(targetId)) {
            // If no specific content div, clear the whole section but keep the H2
            const section = document.getElementById(targetId);
            const h2 = section.querySelector('h2');
            section.innerHTML = ''; // Clear everything
            if (h2) section.appendChild(h2); // Add H2 back
            section.insertAdjacentHTML('beforeend', '<p><em>Loading...</em></p>');
        }


        // --- Role-Based Content Loading ---
        if (role === 'student') {
            switch (targetId) {
                case 'student-courses':
                    loadStudentCourses(); // Function defined in student.js
                    break;
                case 'student-attendance':
                    loadStudentAttendance(); // Function defined in student.js
                    break;
                case 'student-assignments':
                    loadStudentAssignments(); // Function defined in student.js
                    break;
                case 'student-coding-tracks':
                    loadStudentCodingTracks(); // Function defined in student.js
                    break;
                case 'student-profile':
                    loadStudentProfile(); // Function defined in student.js
                    break;
                case 'student-job-match':
                    loadStudentJobMatches(); // Function defined in student.js
                    break;
                // Add cases for other student sections
            }
        } else if (role === 'faculty') {
            switch (targetId) {
                case 'faculty-dashboard':
                    loadFacultyDashboard(); // Function defined in faculty.js
                    break;
                case 'faculty-manage-courses':
                    loadFacultyManageCourses(); // Function defined in faculty.js
                    break;
                case 'faculty-manage-coding':
                    loadFacultyManageCoding(); // Function defined in faculty.js
                    break;
                case 'faculty-monitor-progress':
                    loadFacultyMonitorProgress(); // Function defined in faculty.js
                    break;
                // Add cases for other faculty sections
            }
        } else if (role === 'admin') {
            switch (targetId) {
                case 'admin-dashboard':
                    loadAdminDashboard(); // Function defined in admin.js
                    break;
                case 'admin-skill-metrics':
                    loadAdminSkillMetrics(); // Function defined in admin.js
                    break;
                case 'admin-leaderboard':
                    loadAdminLeaderboard(); // Function defined in admin.js
                    break;
                case 'admin-manage-tests':
                    loadAdminManageTests(); // Function defined in admin.js
                    break;
                case 'admin-reports':
                    loadAdminReports(); // Function defined in admin.js
                    break;
                // Add cases for other admin sections
            }
        }
    }

    function getDefaultView(role) {
        if (role === 'student') return 'student-courses';
        if (role === 'faculty') return 'faculty-dashboard';
        if (role === 'admin') return 'admin-dashboard';
        return 'welcome-message'; // Fallback
    }

    // --- Global Helper (Optional) ---
    // Make API accessible globally if needed by other modules, or pass it explicitly
    window.campusApi = api;
});