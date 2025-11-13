class LoginController {
    constructor() {
        this.initializeLoginEvents();
    }

    initializeLoginEvents() {
        $('#login-form').on('submit', (e) => this.handleLogin(e));
        $('#logout-btn').on('click', () => this.handleLogout());
    }

    handleLogin(e) {
        e.preventDefault();

        let username = $("#username").val();
        let password = $("#password").val();

        if (username === "admin" && password === "1234") {
            $('#login-section').hide();
            $('#main-application').show();
            this.showAlert('Login successful!', 'success');

            // Initialize main application
            if (window.mainController) {
                window.mainController.initializeApplication();
            }
        } else {
            this.showAlert('Invalid username or password!', 'error');
        }
    }

    handleLogout() {
        $('#main-application').hide();
        $('#login-section').show();
        $('#login-form')[0].reset();
        this.showAlert('You have been logged out!', 'info');
    }

    showAlert(message, type = 'info') {
        // Remove existing alerts
        $('.alert').remove();

        const alertClass = type === 'error' ? 'alert-danger' :
            type === 'success' ? 'alert-success' : 'alert-info';

        const alertHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        $('body').append(alertHTML);

        setTimeout(() => {
            $('.alert').alert('close');
        }, 3000);
    }
}

// Initialize Login Controller
$(document).ready(function() {
    window.loginController = new LoginController();
});

export default LoginController;