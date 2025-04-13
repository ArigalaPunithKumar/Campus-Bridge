document.addEventListener('DOMContentLoaded', () => {
    // If user is already logged in (e.g., page refresh on dashboard), redirect back
    if (window.location.pathname.includes('dashboard.html') && !sessionStorage.getItem('userRole')) {
        window.location.href = 'index.html';
        return;
    }
    // If user is on login page but already logged in, redirect to dashboard
    if (!window.location.pathname.includes('dashboard.html') && sessionStorage.getItem('userRole')) {
        window.location.href = 'dashboard.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');

    // Only add login listener if the form exists (i.e., on index.html)
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent actual form submission
            loginError.textContent = ''; // Clear previous errors

            const email = emailInput.value;
            const password = passwordInput.value; // In real app, NEVER use plain text password

            // --- SIMULATED AUTHENTICATION ---
            // In a real application, this would be an API call to a backend server
            let userRole = null;
            let userName = null;

            if (password === 'password') { // Using a simple password for demo
                if (email === 'student@university.edu') {
                    userRole = 'student';
                    userName = 'Demo Student';
                } else if (email === 'faculty@university.edu') {
                    userRole = 'faculty';
                    userName = 'Dr. Faculty';
                } else if (email === 'admin@university.edu') {
                    userRole = 'admin';
                    userName = 'Admin User';
                }
            }
            // --- END SIMULATION ---

            if (userRole) {
                // Store user info in sessionStorage (clears when browser tab closes)
                // Use localStorage for more persistent login simulation
                sessionStorage.setItem('userRole', userRole);
                sessionStorage.setItem('userName', userName);
                sessionStorage.setItem('userEmail', email);

                // Redirect to the dashboard
                window.location.href = 'dashboard.html';
            } else {
                loginError.textContent = 'Invalid email or password.';
            }
        });
    }

    // Logout functionality (will be attached in app.js for the dashboard button)
    window.logout = function () {
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    };
});