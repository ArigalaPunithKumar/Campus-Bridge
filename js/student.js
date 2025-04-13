// js/student.js
// Contains functions to load and manage content for the student dashboard sections
// EXCLUDING the dedicated coding practice environment.

// --- Keep your existing campusApi reference ---
// import campusApi from './api.js'; // Or however you manage your API access

async function loadStudentGroupCodeRooms() {
    const contentDiv = document.getElementById('student-group-code-content');
    contentDiv.innerHTML = '<p><em>Loading group code rooms...</em></p>'; // Loading indicator
    try {
        const groupCodeRooms = await campusApi.getGroupCodeRooms(); // Fetch group code rooms from API

        if (!groupCodeRooms || groupCodeRooms.length === 0) {
            contentDiv.innerHTML = '<p>No group code rooms available.</p>';
            return;
        }

        let html = groupCodeRooms.map(room => `
            <div class="card group-code-room">
                <h3>${room.name}</h3>
                <p><strong>Members:</strong> ${room.members.join(', ')}</p>
                <p>${room.description}</p>
                <button class="btn btn-primary" onclick="joinRoom('${room.id}')">Join Room</button>
            </div>
        `).join('');
        contentDiv.innerHTML = html;

    } catch (error) {
        console.error("Error loading group code rooms:", error);
        contentDiv.innerHTML = '<p class="error-message">Could not load group code rooms data. Please try again later.</p>';
    }
}

function joinRoom(roomId) {
    // Logic to join the group code room
    alert(`Joining room: ${roomId}`);
}

async function loadStudentCourses() {
    // ... (Keep your existing code for loadStudentCourses - NO CHANGES NEEDED HERE)
    const contentDiv = document.getElementById('student-courses-content');
    try {
        const courses = await campusApi.getStudentCourses(); // Still uses mock API for this part
        if (!courses || courses.length === 0) {
            contentDiv.innerHTML = '<p>You are not enrolled in any courses yet.</p>';
            return;
        }

        let html = courses.map(course => `
            <div class="card course-card">
                <h3>${course.name} (${course.id})</h3>
                <p><strong>Faculty:</strong> ${course.faculty}</p>
                <p><strong>Credits:</strong> ${course.credits}</p>
                <p>${course.description}</p>
                ${course.materials.length > 0 ? `
                    <h4>Materials:</h4>
                    <ul>
                        ${course.materials
                    .filter(mat => mat.type.toLowerCase() !== 'pdf' && mat.type.toLowerCase() !== 'video') // Filter out PDFs and videos
                    .map(mat => `<li><a href="${mat.url}" target="_blank">[${mat.type.toUpperCase()}] ${mat.title}</a></li>`)
                    .join('')}
                    </ul>
                ` : '<p>No materials uploaded yet.</p>'}
            </div>
        `).join('');
        contentDiv.innerHTML = html;
    } catch (error) {
        console.error("Error loading student courses:", error);
        contentDiv.innerHTML = '<p class="error-message">Could not load course data. Please try again later.</p>';
    }
}

async function loadStudentAttendance() {
    const contentDiv = document.getElementById('student-attendance-content');
    try {
        const attendanceData = await campusApi.getStudentAttendance();
        const courses = await campusApi.getStudentCourses();

        if (!attendanceData || Object.keys(attendanceData).length === 0) {
            contentDiv.innerHTML = '<p>Attendance data is not available.</p>';
            return;
        }

        let html = `<div class="attendance-chart-container">`;

        for (const courseId in attendanceData) {
            const course = courses.find(c => c.id === courseId);
            const data = attendanceData[courseId];
            const percentage = data.percentage.toFixed(1);

            // Determine color based on percentage
            let barColor = '#dc3545'; // Red (low)
            if (percentage >= 75) barColor = '#28a745'; // Green (good)
            else if (percentage >= 50) barColor = '#ffc107'; // Yellow (medium)

            html += `
                <div class="attendance-item">
                    <div class="course-name">${course ? course.name : courseId}</div>
                    <div class="attendance-bar-container">
                        <div class="attendance-bar" 
                             style="width: ${percentage}%; background-color: ${barColor};"
                             title="${data.present}/${data.total} classes (${percentage}%)">
                            <span class="attendance-percentage">${percentage}%</span>
                        </div>
                    </div>
                </div>
            `;
        }

        html += `</div>`;
        contentDiv.innerHTML = html;

    } catch (error) {
        console.error("Error loading student attendance:", error);
        contentDiv.innerHTML = '<p class="error-message">Could not load attendance data.</p>';
    }
}

async function loadStudentAssignments() {
    // ... (Keep your existing code for loadStudentAssignments - NO CHANGES NEEDED HERE)
    const contentDiv = document.getElementById('student-assignments-content');
    try {
        const assignments = await campusApi.getStudentAssignments(); // Still uses mock API
        const courses = await campusApi.getStudentCourses(); // Need course names

        if (!assignments || assignments.length === 0) {
            contentDiv.innerHTML = '<p>You have no assignments.</p>';
            return;
        }

        let html = `
             <table>
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
        `;

        assignments.forEach(assignment => {
            const course = courses.find(c => c.id === assignment.courseId);
            html += `
                <tr>
                    <td>${course ? course.name : assignment.courseId}</td>
                    <td>${assignment.title}</td>
                    <td>${assignment.type}</td>
                    <td>${assignment.dueDate}</td>
                    <td><span class="status-${assignment.status.toLowerCase().replace(' ', '-')}">${assignment.status}</span></td>
                    <td>${assignment.score || '-'}</td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        contentDiv.innerHTML = html;

    } catch (error) {
        console.error("Error loading student assignments:", error);
        contentDiv.innerHTML = '<p class="error-message">Could not load assignment data.</p>';
    }
}

async function loadStudentProfile() {
    // ... (Keep your existing code for loadStudentProfile - NO CHANGES NEEDED HERE)
    const contentDiv = document.getElementById('student-profile-content');
    try {
        const profile = await campusApi.getStudentProfile(); // Still uses mock API

        // Basic Info
        let html = `
            <div class="card profile-info">
                <h3>${profile.name} (${profile.id})</h3>
                <p><strong>Email:</strong> ${profile.email}</p>
                <p><strong>Program:</strong> ${profile.program}</p>
                <p><strong>Year:</strong> ${profile.year}</p>
            </div>
        `;

        // Badges & Streaks
        html += `
            <div class="card profile-gamification">
                <h4>Progress & Achievements</h4>
                <p><strong>Weekly Coding Streak:</strong> ${profile.weeklyStreak} weeks 🔥</p>
                <p><strong>Badges Earned:</strong></p>
                <div class="badges-container">
                    ${profile.badges.map(badge => `<span class="badge">${badge}</span>`).join('')}
                </div>
            </div>
        `;

        // Skills Heatmap (Placeholder or simple bars)
        html += `
            <div class="card profile-skills">
                <h4>Skill Heatmap</h4>
                <p>Visual representation of your strengths across different coding topics.</p>
                <div class="heatmap-placeholder" id="skill-heatmap-viz">Skill Heatmap Visualization Placeholder</div>
            </div>
        `;

        contentDiv.innerHTML = html;

        // Render simple bar chart for skills (example)
        const skillsData = profile.skills;
        const heatmapPlaceholder = contentDiv.querySelector('#skill-heatmap-viz');
        if (heatmapPlaceholder && skillsData && Object.keys(skillsData).length > 0) {
            let skillBarsHtml = '<div style="display: flex; flex-wrap: wrap; gap: 15px 25px; margin-top: 15px; padding: 10px; background-color: #fff; border-radius: 5px;">';
            for (const skill in skillsData) {
                const score = skillsData[skill] || 0; // Handle null/undefined scores
                // Determine color based on score (example gradient)
                let barColor = '#dc3545'; // Red (low)
                if (score >= 75) barColor = '#28a745'; // Green (high)
                else if (score >= 50) barColor = '#ffc107'; // Yellow (medium)

                skillBarsHtml += `
                    <div style="width: 120px; text-align: left;">
                        <div style="font-size: 0.9em; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${skill}">${skill}</div>
                        <div style="background-color: #e9ecef; border-radius: 3px; overflow: hidden; height: 18px; position: relative;">
                            <div style="width: ${score}%; background-color: ${barColor}; height: 100%;"></div>
                             <span style="position: absolute; left: 5px; top: 1px; color: ${score > 50 ? 'white' : '#333'}; font-size: 0.75em; font-weight: bold;">
                                ${score}%
                             </span>
                        </div>
                    </div>
                `;
            }
            skillBarsHtml += '</div>';
            heatmapPlaceholder.innerHTML = skillBarsHtml; // Replace placeholder text
            heatmapPlaceholder.style.height = 'auto';
            heatmapPlaceholder.style.border = 'none';
            heatmapPlaceholder.style.background = 'none';
            heatmapPlaceholder.style.padding = '0';
        } else if (heatmapPlaceholder) {
            heatmapPlaceholder.innerHTML = '<p><em>Skill data not yet available. Keep practicing!</em></p>';
        }


    } catch (error) {
        console.error("Error loading student profile:", error);
        contentDiv.innerHTML = '<p class="error-message">Could not load profile data.</p>';
    }
}

async function loadStudentJobMatches() {
    // ... (Keep your existing code for loadStudentJobMatches - NO CHANGES NEEDED HERE)
    const contentDiv = document.getElementById('student-job-match-content');
    contentDiv.innerHTML = '<p><em>Loading potential job matches based on your profile... (Simulated AI)</em></p>';
    try {
        const matches = await campusApi.getJobMatches(); // Still uses mock API

        if (!matches || matches.length === 0) {
            contentDiv.innerHTML = '<p>No job matches found at this time. Keep building your skills!</p>';
            return;
        }

        let html = matches.map(job => `
            <div class="card job-match-card">
                 <div style="float: right; font-weight: bold; color: ${job.matchScore > 75 ? 'green' : (job.matchScore > 50 ? 'orange' : 'red')};">${job.matchScore}% Match</div>
                <h3>${job.title}</h3>
                <p><strong>Company:</strong> ${job.company}</p>
                <p style="font-size: 0.9em;"><strong>Required Skills:</strong> ${job.requiredSkills.join(', ')}</p>
                <details style="margin-top: 10px;">
                    <summary style="cursor: pointer; color: #007bff;">View Description</summary>
                    <p style="font-size: 0.9em; margin-top: 5px; background-color: #f8f8f8; padding: 8px; border-radius: 3px;">${job.description}</p>
                </details>
                <button onclick="alert('Simulating application view for Job ID: ${job.jobId}')" style="margin-top: 10px;">View & Apply (Simulated)</button>
            </div>
        `).join('');

        contentDiv.innerHTML = `<h4>Potential Job Opportunities</h4>${html}`;

    } catch (error) {
        console.error("Error loading job matches:", error);
        contentDiv.innerHTML = '<p class="error-message">Could not load job matches.</p>';
    }
}


// --- MODIFIED: loadStudentCodingTracks ---
async function loadStudentCodingTracks() {
    const contentDiv = document.getElementById('student-coding-tracks-content');
    if (!contentDiv) {
        console.error("Target content div 'student-coding-tracks-content' not found.");
        return;
    }
    contentDiv.innerHTML = '<p><em>Loading coding tracks...</em></p>'; // Loading indicator
    try {
        // NOTE: Assuming campusApi.getCodingTracks() returns an array like:
        // [{ id: 'track1', name: 'Data Structures', description: '...', enrolled: true }, ...]
        const tracks = await campusApi.getCodingTracks(); // Still uses mock API

        if (!tracks || tracks.length === 0) {
            contentDiv.innerHTML = '<p>No coding tracks available yet.</p>';
            return;
        }

        let html = ''; // Start with empty html

        // Separate enrolled and available tracks for better UI
        const enrolledTracks = tracks.filter(t => t.enrolled);
        const availableTracks = tracks.filter(t => !t.enrolled);

        // --- Display Enrolled Tracks ---
        if (enrolledTracks.length > 0) {
            html += `<h5>Enrolled Tracks</h5>`;
            html += enrolledTracks.map(track => `
                <div class="card coding-track-card enrolled-track">
                    <div class="track-info">
                        <h3>${track.name}</h3>
                        <p>${track.description}</p>
                    </div>
                    <div class="track-actions">
                        <!-- MODIFIED: Navigate to practice.html, pass trackId as URL parameter -->
                        <button class="btn btn-primary" onclick="window.location.href='practice.html?trackId=${track.id}'">
                            Go to Practice <i class="fas fa-arrow-right"></i>
                        </button>
                        <!-- You could add other actions like 'View Progress' if needed -->
                    </div>
                </div>
            `).join('');
        } else {
            html += '<p>You are not enrolled in any tracks yet. Explore available tracks below!</p>';
        }

        // --- Display Available Tracks ---
        if (availableTracks.length > 0) {
            html += `<h5 style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">Available Tracks</h5>`;
            html += availableTracks.map(track => `
                <div class="card coding-track-card available-track">
                     <div class="track-info">
                        <h3>${track.name}</h3>
                        <p>${track.description}</p>
                    </div>
                    <div class="track-actions">
                        <button data-track-id="${track.id}" class="btn btn-secondary enroll-btn">
                            Enroll Now
                        </button>
                    </div>
                </div>
            `).join('');
        }

        contentDiv.innerHTML = html;

        // --- Add event listeners for NEW "Enroll Now" buttons (simulation) ---
        contentDiv.querySelectorAll('button.enroll-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const trackId = e.target.dataset.trackId;
                const trackCard = e.target.closest('.coding-track-card'); // Find parent card
                const trackName = trackCard ? trackCard.querySelector('h3').textContent : trackId; // Get name for alert

                // Simulate enrollment API call
                try {
                    e.target.textContent = 'Enrolling...';
                    e.target.disabled = true;

                    // --- Replace this with your ACTUAL API call ---
                    console.log(`Simulating enrollment API call for track: ${trackId}`);
                    // Example: await campusApi.enrollInTrack(trackId);
                    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network delay
                    // --- End of simulation block ---

                    alert(`Successfully enrolled in track: ${trackName}!`);

                    // Refresh the coding tracks section to show the updated status
                    // This will re-run loadStudentCodingTracks() which gets fresh data
                    loadStudentCodingTracks();

                } catch (error) {
                    console.error(`Error enrolling in track ${trackId}:`, error);
                    alert(`Failed to enroll in track: ${trackName}. Please try again later.`);
                    // Re-enable button on failure
                    e.target.textContent = 'Enroll Now';
                    e.target.disabled = false;
                }
            });
        });

    } catch (error) {
        console.error("Error loading coding tracks:", error);
        contentDiv.innerHTML = '<p class="error-message">Could not load coding tracks data. Please try again later.</p>';
    }
}


// --- REMOVED FUNCTIONS ---
// navigateToCodingPractice() -> No longer needed, handled by direct link
// loadStudentCodingPractice() -> Moved to practice.js
// loadProblemDetails() -> Moved to practice.js
// updateEditorLanguage() -> Moved to practice.js
// handleRunCode() -> Moved to practice.js
// handleSubmitCode() -> Moved to practice.js
// processJudge0Result() -> Moved to practice.js
// handleGetHint() -> Moved to practice.js
// handleDebugCode() -> Moved to practice.js
// handleReviewCode() -> Moved to practice.js


// --- Make functions accessible globally for app.js ---
// Ensure only the functions DEFINED IN THIS FILE are exported
window.loadStudentCourses = loadStudentCourses;
window.loadStudentAttendance = loadStudentAttendance;
window.loadStudentAssignments = loadStudentAssignments;
window.loadStudentCodingTracks = loadStudentCodingTracks;
window.loadStudentProfile = loadStudentProfile;
window.loadStudentJobMatches = loadStudentJobMatches;
window.loadStudentGroupCodeRooms = loadStudentGroupCodeRooms;

// REMOVE the exports for the functions that were moved/deleted:
// delete window.loadStudentCodingPractice; // Example of explicit removal if needed
// delete window.navigateToCodingPractice;
// etc. (Or just don't include them in the list above)

console.log("student.js loaded - Practice functions removed, CodingTracks updated.");