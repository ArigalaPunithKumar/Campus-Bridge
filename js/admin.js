// Contains functions to load and manage content for the admin interface

async function loadAdminDashboard() {
    const contentDiv = document.getElementById('admin-dashboard-content');
    try {
        const stats = await campusApi.getAdminDashboardData();
        let html = `
            <h4>Platform Overview</h4>
             <div class="dashboard-stats">
                <div class="stat-card">
                    <h5>Total Students</h5>
                    <p>${stats.totalStudents}</p>
                </div>
                 <div class="stat-card">
                    <h5>Total Faculty</h5>
                    <p>${stats.totalFaculty}</p>
                </div>
                <div class="stat-card">
                    <h5>Active Coding Users</h5>
                    <p>${stats.activeCodingUsers}</p>
                </div>
                 <div class="stat-card">
                    <h5>Avg. Placement Readiness</h5>
                     <p>${stats.avgPlacementReadiness}%</p>
                 </div>
            </div>

            <h4>Quick Actions</h4>
            <div class="quick-actions">
                <button onclick="navigateTo('admin-manage-tests')">Schedule Test/Contest</button>
                <button onclick="navigateTo('admin-leaderboard')">View Leaderboard</button>
                <button onclick="navigateTo('admin-reports')">Generate Reports</button>
                <!-- Add more quick actions as needed -->
             </div>
        `;
        contentDiv.innerHTML = html;

    } catch (error) {
        console.error("Error loading admin dashboard:", error);
        contentDiv.innerHTML = '<p class="error-message">Could not load admin dashboard data.</p>';
    }
}


async function loadAdminSkillMetrics() {
    const contentDiv = document.getElementById('admin-skill-metrics-content');
    try {
        const metrics = await campusApi.getSkillMetrics();
        let html = `
            <h4>Aggregate Skill Proficiency (Platform Wide)</h4>
            <div class="card">
                <div class="chart-placeholder" id="skill-metrics-chart">
                    Overall Skill Distribution Chart Placeholder
                 </div>
                <!-- Render chart using metrics data -->
            </div>

             <h4>Placement Readiness Index (Placeholder)</h4>
             <div class="card">
                 <p>A composite score indicating the overall readiness of students for placements based on academic and coding performance.</p>
                 <div class="readiness-gauge" style="width: 200px; height: 100px; border: 1px solid #ccc; border-radius: 100px 100px 0 0; margin: 20px auto; text-align: center; position: relative; background: linear-gradient(to right, red, yellow, lightgreen);">
                     <div style="position: absolute; bottom: 5px; left: 0; right: 0; font-size: 1.5em; font-weight: bold;">${mockData.adminStats.avgPlacementReadiness}%</div>
                     <!-- Needle would require more complex SVG/CSS -->
                 </div>
                 <p><em>(Gauge visualization placeholder)</em></p>
             </div>
        `;
        contentDiv.innerHTML = html;

        // Placeholder: Render chart if a library was included
        const chartPlaceholder = document.getElementById('skill-metrics-chart');
        if (chartPlaceholder && metrics) {
            // Similar chart rendering logic as in faculty monitor progress can be used
            // Example: Simple Bar chart
            let chartHtml = '<div style="display: flex; justify-content: space-around; align-items: flex-end; height: 200px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">';
            const skills = Object.keys(metrics);
            const values = Object.values(metrics);
            const maxVal = Math.max(...values, 100);

            values.forEach((value, index) => {
                const heightPercent = (value / maxVal) * 100;
                chartHtml += `
                    <div style="width: ${100 / values.length - 5}%; background-color: #28a745; height: ${heightPercent}%; text-align: center; position: relative;">
                         <span style="color: white; font-size: 0.8em; position: absolute; top: -20px; left: 0; right: 0;">${skills[index]}</span>
                         <span style="color: white; font-size: 0.7em; position: absolute; bottom: 2px; left: 0; right: 0;">${value}%</span>
                    </div>
                 `;
            });
            chartHtml += '</div>';
            chartPlaceholder.innerHTML = chartHtml;
            chartPlaceholder.style.border = 'none';
            chartPlaceholder.style.background = 'none';
        }

    } catch (error) {
        console.error("Error loading admin skill metrics:", error);
        contentDiv.innerHTML = '<p class="error-message">Could not load skill metrics data.</p>';
    }
}

async function loadAdminLeaderboard() {
    const contentDiv = document.getElementById('admin-leaderboard-content');
    try {
        const leaderboardData = await campusApi.getLeaderboard();

        if (!leaderboardData || leaderboardData.length === 0) {
            contentDiv.innerHTML = '<p>Leaderboard data is not available.</p>';
            return;
        }

        let html = `
            <h4>Coding Platform Leaderboard</h4>
             <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                        <th>Problems Solved</th>
                     </tr>
                </thead>
                <tbody>
                    ${leaderboardData.map(entry => `
                        <tr>
                            <td>${entry.rank}</td>
                            <td>${entry.name} ${entry.name === mockData.studentProfile.name ? '(You)' : ''}</td>
                            <td>${entry.score}</td>
                            <td>${entry.problemsSolved}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        contentDiv.innerHTML = html;

    } catch (error) {
        console.error("Error loading admin leaderboard:", error);
        contentDiv.innerHTML = '<p class="error-message">Could not load leaderboard data.</p>';
    }
}

function loadAdminManageTests() {
    const contentDiv = document.getElementById('admin-manage-tests-content');
    // Show form to schedule tests/contests
    let html = `
        <h4>Schedule Mock Test or Coding Contest</h4>
        <div class="card">
            <form id="schedule-test-form">
                 <div class="form-group">
                    <label for="test-title">Test/Contest Title:</label>
                    <input type="text" id="test-title" name="title" required>
                </div>
                 <div class="form-group">
                    <label for="test-type">Type:</label>
                    <select id="test-type" name="type" required>
                        <option value="Mock Interview Test">Mock Interview Test</option>
                        <option value="Coding Contest">Coding Contest</option>
                        <option value="Academic Quiz">Academic Quiz</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="test-start-time">Start Time:</label>
                    <input type="datetime-local" id="test-start-time" name="startTime" required>
                </div>
                 <div class="form-group">
                    <label for="test-duration">Duration (minutes):</label>
                    <input type="number" id="test-duration" name="duration" required min="10">
                </div>
                 <div class="form-group">
                    <label for="test-eligibility">Eligibility Criteria (Optional):</label>
                    <textarea id="test-eligibility" name="eligibility" rows="3" placeholder="e.g., 3rd & 4th Year CSE, CGPA > 7.0"></textarea>
                </div>
                 <button type="submit">Schedule Test</button>
            </form>
        </div>

         <h4>Monitor Academic Eligibility (Placeholder)</h4>
         <div class="card">
            <p>Functionality to check student eligibility based on academic performance (e.g., CGPA, backlogs) would go here.</p>
            <input type="text" placeholder="Search Student ID or Name">
            <button disabled>Check Eligibility</button>
         </div>
    `;
    contentDiv.innerHTML = html;

    // Handle form submission
    document.getElementById('schedule-test-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const testDetails = Object.fromEntries(formData.entries());
        try {
            const result = await campusApi.scheduleTest(testDetails);
            if (result.success) {
                alert(`Success: ${result.message}`);
                e.target.reset();
            } else {
                alert(`Error: ${result.message || 'Could not schedule test.'}`);
            }
        } catch (error) {
            alert(`Submission Error: ${error.message || 'Network error'}`);
        }
    });
}

function loadAdminReports() {
    const contentDiv = document.getElementById('admin-reports-content');
    let html = `
        <h4>Generate and Export Reports</h4>
        <div class="card">
            <p>Select the type of report you want to generate for stakeholders.</p>
            <div class="form-group">
                <label for="report-type">Report Type:</label>
                <select id="report-type" name="reportType">
                    <option value="Placement Readiness">Placement Readiness Summary</option>
                    <option value="Coding Skill Distribution">Coding Skill Distribution</option>
                    <option value="Course Performance">Course Performance Overview</option>
                    <option value="Student Activity Log">Student Activity Log</option>
                </select>
            </div>
             <div class="form-group">
                 <label for="report-format">Format:</label>
                 <select id="report-format" name="format">
                     <option value="CSV">CSV</option>
                     <option value="PDF">PDF</option>
                     <!-- <option value="Excel">Excel</option> -->
                </select>
            </div>
            <button id="generate-report-btn">Generate & Export Report</button>
            <p id="report-status" style="margin-top: 10px;"></p>
        </div>
    `;
    contentDiv.innerHTML = html;

    // Handle button click
    document.getElementById('generate-report-btn').addEventListener('click', async () => {
        const reportType = document.getElementById('report-type').value;
        const format = document.getElementById('report-format').value;
        const statusP = document.getElementById('report-status');
        statusP.textContent = `Generating ${reportType} report in ${format} format... (Simulated)`;
        statusP.style.color = '#333';

        try {
            const result = await campusApi.exportReport(reportType);
            if (result.success) {
                statusP.textContent = `Success: ${result.message} File download would start in a real application.`;
                statusP.style.color = 'green';
            } else {
                statusP.textContent = `Error: ${result.message || 'Could not generate report.'}`;
                statusP.style.color = 'red';
            }
        } catch (error) {
            statusP.textContent = `Error: ${error.message || 'Network error'}`;
            statusP.style.color = 'red';
        }
    });
}


// Make functions accessible globally
window.loadAdminDashboard = loadAdminDashboard;
window.loadAdminSkillMetrics = loadAdminSkillMetrics;
window.loadAdminLeaderboard = loadAdminLeaderboard;
window.loadAdminManageTests = loadAdminManageTests;
window.loadAdminReports = loadAdminReports;