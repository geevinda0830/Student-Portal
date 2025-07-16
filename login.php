<?php
require_once 'config.php';

// If already logged in, redirect to profile
if (isLoggedIn()) {
    header('Location: profile.php');
    exit();
}

// Check for remember me cookie
if (isset($_COOKIE['remember_user']) && !isLoggedIn()) {
    $users = loadUsers();
    foreach ($users as $user) {
        if ($user['email'] === $_COOKIE['remember_user']) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['firstName'] = $user['firstName'];
            $_SESSION['lastName'] = $user['lastName'];
            header('Location: profile.php');
            exit();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Portal - Login</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <h1 class="nav-logo">Student Portal</h1>
            <ul class="nav-menu">
                <li><a href="index.html" class="nav-link">Home</a></li>
                <li><a href="register.php" class="nav-link">Register</a></li>
                <li><a href="login.php" class="nav-link active">Login</a></li>
                <li><a href="contact.html" class="nav-link">Contact</a></li>
            </ul>
            <button id="theme-toggle" class="theme-btn">🌙</button>
        </div>
    </nav>

    <main class="main-content">
        <div class="form-container">
            <h2>Student Login</h2>
            
            <?php if (isset($_SESSION['login_error'])): ?>
                <div class="message error">
                    <p><?php echo $_SESSION['login_error']; unset($_SESSION['login_error']); ?></p>
                </div>
            <?php endif; ?>

            <form id="loginForm" action="process_login.php" method="POST">
                <div class="form-group">
                    <label for="loginEmail">Email</label>
                    <input type="email" id="loginEmail" name="email" required>
                    <span class="error-message" id="loginEmailError"></span>
                </div>

                <div class="form-group">
                    <label for="loginPassword">Password</label>
                    <div class="password-input">
                        <input type="password" id="loginPassword" name="password" required>
                        <button type="button" class="password-toggle" onclick="togglePassword('loginPassword')">👁️</button>
                    </div>
                    <span class="error-message" id="loginPasswordError"></span>
                </div>

                <div class="form-group checkbox-group">
                    <input type="checkbox" id="rememberMe" name="rememberMe">
                    <label for="rememberMe">Remember me</label>
                </div>

                <button type="submit" class="btn btn-primary">Login</button>
            </form>

            <p class="form-footer">
                Don't have an account? <a href="register.php">Register here</a>
            </p>
        </div>
    </main>

    <footer class="footer">
        <p>&copy; 2025 Student Portal. All rights reserved.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>