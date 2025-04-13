// Contains functions to load and manage content for the faculty interface

async function loadFacultyDashboard() {
    const contentDiv = document.getElementById('faculty-dashboard-content');
    try {
        const data = await campusApi.getFacultyDashboardData();

        let html = `
            <div class="dashboard-stats">
                <div class="stat-card">
                    <h4>Courses Taught</h4>
                    <p>${data.courses.length}</p>
                    <span>${data.courses.map(c => c.name).join(', ')}</span>
                 </div>
                 <div class="stat-card">
                    <h4>Students Monitored</h4>
                    <p>${mockData.facultyInfo.studentsMonitored}</p> {/* Assuming static for demo */}
                    <span>Across assigned courses</span>
                 </div>
            </div>

            <div class="dashboard-section">
                <h4>Upcoming Deadlines</h4>
                ${data.upcomingDeadlines.length > 0 ? `
                    <ul>
                        ${data.upcomingDeadlines.map(a => `<li>${a.title} (${a.courseId}) - Due: ${a.dueDate}</li>`).join('')}
                    </ul>
                ` : '<p>No upcoming deadlines.</p>'}
            </div>

             <div class="dashboard-section">
                <h4>Recent Submissions</h4>
                 ${data.recentSubmissions.length > 0 ? `
                    <table>
                        <thead><tr><th>Assignment</th><th>Course</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            ${data.recentSubmissions.map(a => `
                                <tr>
                                    <td>${a.title}</td>
                                    <td>${a.courseId}</td>
                                    <td>${a.status} ${a.score ? '(' + a.score + ')' : ''}</td>
                                    <td><button class="btn-small">View/Grade</button></td>
                                </tr>`).join('')}
                        </tbody>
                    </table>
                ` : '<p>No recent submissions to show.</p>'}
            </div>
        `;
        contentDiv.innerHTML = html;

    } catch (error) {
        console.error("Error loading faculty dashboard:", error);
        contentDiv.innerHTML = '<p class="error-message">Could not load dashboard data.</p>';
    }
}

async function loadFacultyManageCourses() {
    const contentDiv = document.getElementById('faculty-manage-courses-content');
    try {
        const courses = await campusApi.getFacultyCourses();

        let html = `
            <h4>Your Courses</h4>
            ${courses.map(course => `
                <div class="card">
                    <h5>${course.name} (${course.id})</h5>
                    <button onclick="showUploadContentForm('${course.id}')">Upload Content</button>
                    <button class="btn-secondary" onclick="viewCourseMaterials('${course.id}')">View Materials</button>
                    <button class="btn-secondary" onclick="createAcademicAssignmentForm('${course.id}')">Create Assignment</button>
                </div>
            `).join('')}

            <div id="faculty-action-form-area" style="margin-top: 20px;">
                <!-- Forms will be loaded here -->
            </div>
        `;
        contentDiv.innerHTML = html;

    } catch (error) {
        console.error("Error loading faculty courses:", error);
        contentDiv.innerHTML = '<p class="error-message">Could not load course management data.</p>';
    }
}

function showUploadContentForm(courseId) {
    const formArea = document.getElementById('faculty-action-form-area');
    formArea.innerHTML = `
        <div class="card">
            <h4>Upload Content for ${courseId}</h4>
            <form id="upload-content-form">
                <input type="hidden" name="courseId" value="${courseId}">
                <div class="form-group">
                    <label for="content-title">Content Title:</label>
                    <input type="text" id="content-title" name="title" required>
                </div>
                 <div class="form-group">
                    <label for="content-type">Content Type:</label>
                    <select id="content-type" name="type" required>
                        <option value="pdf">PDF</option>
                        <option value="video">Video Link</option>
                        <option value="link">External Link</option>
                        <option value="notes">Text Notes</option>
                    </select>
                </div>
                 <div class="form-group" id="file-upload-group">
                    <label for="content-file">Upload File (PDF):</label>
                    <input type="file" id="content-file" name="file" accept=".pdf">
                </div>
                 <div class="form-group" id="link-upload-group" style="display: none;">
                    <label for="content-link">URL:</label>
                    <input type="url" id="content-link" name="url">
                </div>
                <button type="submit">Upload Content</button>
            </form>
        </div>
    `;

    // Simple logic to show/hide file/link input based on type
    const typeSelect = formArea.querySelector('#content-type');
    const fileGroup = formArea.querySelector('#file-upload-group');
    const linkGroup = formArea.querySelector('#link-upload-group');
    typeSelect.addEventListener('change', (e) => {
        fileGroup.style.display = e.target.value === 'pdf' ? 'block' : 'none';
        linkGroup.style.display = (e.target.value === 'video' || e.target.value === 'link') ? 'block' : 'none';
    });

    // Handle form submission (simulation)
    formArea.querySelector('#upload-content-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const content = Object.fromEntries(formData.entries());
        alert(`Simulating upload for ${courseId}:\nTitle: ${content.title}\nType: ${content.type}\nFile/Link: ${content.file?.name || content.url || 'N/A'}`);
        // In real app: await campusApi.createCourseContent(courseId, content);
        formArea.innerHTML = '<p style="color: green;">Content uploaded successfully (simulated).</p>';
    });
}

function createAcademicAssignmentForm(courseId) {
    const formArea = document.getElementById('faculty-action-form-area');
    formArea.innerHTML = `
        <div class="card">
             <h4>Create Academic Assignment for ${courseId}</h4>
             <form id="create-assignment-form">
                 <input type="hidden" name="courseId" value="${courseId}">
                <div class="form-group">
                    <label for="assign-title">Title:</label>
                    <input type="text" id="assign-title" name="title" required>
                </div>
                 <div class="form-group">
                    <label for="assign-type">Assignment Type:</label>
                    <select id="assign-type" name="type" required>
                        <option value="Quiz">Quiz</option>
                        <option value="PDF Upload">PDF Upload</option>
                        <option value="Text Submission">Text Submission</option>
                     </select>
                </div>
                 <div class="form-group">
                    <label for="assign-due-date">Due Date:</label>
                    <input type="date" id="assign-due-date" name="dueDate" required>
                </div>
                 <div class="form-group">
                    <label for="assign-instructions">Instructions:</label>
                    <textarea id="assign-instructions" name="instructions" rows="4"></textarea>
                </div>
                <button type="submit">Create Assignment</button>
             </form>
        </div>
     `;
    // Handle submission (simulation)
    formArea.querySelector('#create-assignment-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const assignmentDetails = Object.fromEntries(formData.entries());
        alert(`Simulating creation of assignment for ${courseId}:\nTitle: ${assignmentDetails.title}`);
        // In real app: await campusApi.createAcademicAssignment(assignmentDetails);
        formArea.innerHTML = '<p style="color: green;">Academic assignment created successfully (simulated).</p>';
    });
}


async function loadFacultyManageCoding() {
    const contentDiv = document.getElementById('faculty-manage-coding-content');
    // Fetch problems created by this faculty (or all problems if admin-like faculty)
    // For demo, let's just show a form to create a new one.
    // We could also list existing problems created by this faculty.
    const courses = await campusApi.getFacultyCourses(); // Needed for dropdown

    let html = `
         <h4>Create New Coding Assignment/Problem</h4>
         <div class="card">
            <form id="create-coding-problem-form">
                 <div class="form-group">
                    <label for="coding-assign-course">Assign to Course (Optional):</label>
                    <select id="coding-assign-course" name="courseId">
                        <option value="">-- Select Course --</option>
                        ${courses.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>
                 <div class="form-group">
                    <label for="problem-title">Problem Title:</label>
                    <input type="text" id="problem-title" name="title" required>
                </div>
                <div class="form-group">
                    <label for="problem-difficulty">Difficulty:</label>
                    <select id="problem-difficulty" name="difficulty" required>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
                 <div class="form-group">
                    <label for="problem-track">Coding Track (e.g., DSA, Java):</label>
                    <input type="text" id="problem-track" name="trackId" placeholder="dsa" required>
                 </div>
                <div class="form-group">
                    <label for="problem-description">Problem Description:</label>
                    <textarea id="problem-description" name="description" rows="6" required></textarea>
                </div>
                 <div class="form-group">
                    <label for="problem-test-cases">Test Cases (e.g., input:output format, one per line):</label>
                    <textarea id="problem-test-cases" name="testCases" rows="5" placeholder="Input: 1 2\nOutput: 3\n---\nInput: 5 5\nOutput: 10"></textarea>
                </div>
                <button type="submit">Create Problem</button>
            </form>
         </div>

         <h4>Existing Coding Problems (Placeholder)</h4>
         <p>List of problems created by you would appear here.</p>
    `;
    contentDiv.innerHTML = html;

    // Handle form submission
    document.getElementById('create-coding-problem-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const problemData = Object.fromEntries(formData.entries());
        try {
            const result = await campusApi.createCodingAssignment(problemData); // Use the simulated API
            if (result.success) {
                alert(`Success: ${result.message} (ID: ${result.assignmentId})`);
                e.target.reset(); // Clear the form
                // TODO: Potentially refresh a list of existing problems
            } else {
                alert(`Error: ${result.message || 'Could not create problem.'}`);
            }
        } catch (error) {
            alert(`Submission Error: ${error.message || 'Network error'}`);
        }
    });
}

async function loadFacultyMonitorProgress() {
    const contentDiv = document.getElementById('faculty-monitor-progress-content');
    try {
        // For demo, get overall analytics. A real app might allow selecting a course first.
        const analytics = await campusApi.getStudentProgressAnalytics();

        let html = `
            <h4>Overall Student Progress (Across Your Courses)</h4>
            <div class="card">
                 <p><strong>Overall Completion Rate:</strong> ${analytics.overallCompletion}%</p>
                 <p><strong>Average Assessment Score:</strong> ${analytics.averageScore}%</p>
                 <p><strong>Students Potentially Struggling (IDs):</strong> ${analytics.studentsStruggling.join(', ') || 'None identified'}</p>
            </div>

             <h4>Topic Performance (Aggregated)</h4>
            <div class="card">
                <div class="chart-placeholder" id="topic-performance-chart">
                    Topic Performance Bar Chart Placeholder
                </div>
                 <!-- Actual chart rendering using analytics.topicPerformance data -->
             </div>

            <h4>Detailed View (Placeholder)</h4>
            <p>Functionality to view individual student progress or drill down by course would go here.</p>
            <select><option>-- Select Course for Detailed View --</option></select>
            <select><option>-- Select Student --</option></select>
            <button disabled>View Details</button>
        `;
        contentDiv.innerHTML = html;

        // Placeholder: Render chart if a library was included
        const chartPlaceholder = document.getElementById('topic-performance-chart');
        if (chartPlaceholder && analytics.topicPerformance) {
            let chartHtml = '<div style="display: flex; justify-content: space-around; align-items: flex-end; height: 200px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">';
            const topics = Object.keys(analytics.topicPerformance);
            const values = Object.values(analytics.topicPerformance);
            const maxVal = Math.max(...values, 100); // Ensure scale goes to 100 or max value

            values.forEach((value, index) => {
                const heightPercent = (value / maxVal) * 100;
                chartHtml += `
                    <div style="width: ${100 / values.length - 5}%; background-color: #007bff; height: ${heightPercent}%; text-align: center; position: relative;">
                         <span style="color: white; font-size: 0.8em; position: absolute; top: -20px; left: 0; right: 0;">${topics[index]}</span>
                         <span style="color: white; font-size: 0.7em; position: absolute; bottom: 2px; left: 0; right: 0;">${value}%</span>
                    </div>
                 `;
            });
            chartHtml += '</div>';
            chartPlaceholder.innerHTML = chartHtml; // Replace placeholder text
            chartPlaceholder.style.border = 'none';
            chartPlaceholder.style.background = 'none';
        }

    } catch (error) {
        console.error("Error loading faculty progress monitoring:", error);
        contentDiv.innerHTML = '<p class="error-message">Could not load student progress data.</p>';
    }
}


// Make functions accessible globally
window.loadFacultyDashboard = loadFacultyDashboard;
window.loadFacultyManageCourses = loadFacultyManageCourses;
window.loadFacultyManageCoding = loadFacultyManageCoding;
window.loadFacultyMonitorProgress = loadFacultyMonitorProgress;
window.showUploadContentForm = showUploadContentForm; // Make helper accessible
window.createAcademicAssignmentForm = createAcademicAssignmentForm; // Make helper accessible