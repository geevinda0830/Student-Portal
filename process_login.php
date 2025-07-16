<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: login.php');
    exit();
}

$email = sanitizeInput($_POST['email']);
$password = $_POST['password'];
$rememberMe = isset($_POST['rememberMe']);

// Validation
if (empty($email) || empty($password)) {
    $_SESSION['login_error'] = "Email and password are required";
    header('Location: login.php');
    exit();
}

// Check credentials
$users = loadUsers();
$user = null;

foreach ($users as $u) {
    if ($u['email'] === $email && password_verify($password, $u['password'])) {
        $user = $u;
        break;
    }
}

if (!$user) {
    $_SESSION['login_error'] = "Invalid email or password";
    header('Location: login.php');
    exit();
}

// Set session
$_SESSION['user_id'] = $user['id'];
$_SESSION['email'] = $user['email'];
$_SESSION['firstName'] = $user['firstName'];
$_SESSION['lastName'] = $user['lastName'];

// Set cookie if remember me is checked
if ($rememberMe) {
    setcookie('remember_user', $user['email'], time() + (30 * 24 * 60 * 60), '/'); // 30 days
}

$_SESSION['success_message'] = "Welcome back, " . $user['firstName'] . "!";
header('Location: profile.php');
exit();
?>