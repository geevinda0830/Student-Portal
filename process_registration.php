<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: register.html');
    exit();
}

$firstName = sanitizeInput($_POST['firstName']);
$lastName = sanitizeInput($_POST['lastName']);
$email = sanitizeInput($_POST['email']);
$studentId = sanitizeInput($_POST['studentId']);
$password = $_POST['password'];
$confirmPassword = $_POST['confirmPassword'];
$course = sanitizeInput($_POST['course']);

// Validation
$errors = [];

if (empty($firstName)) $errors[] = "First name is required";
if (empty($lastName)) $errors[] = "Last name is required";
if (empty($email)) $errors[] = "Email is required";
if (empty($studentId)) $errors[] = "Student ID is required";
if (empty($password)) $errors[] = "Password is required";
if (empty($confirmPassword)) $errors[] = "Confirm password is required";
if (empty($course)) $errors[] = "Course is required";

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format";
}

if (strlen($password) < 8) {
    $errors[] = "Password must be at least 8 characters long";
}

if ($password !== $confirmPassword) {
    $errors[] = "Passwords do not match";
}

// Check if email already exists
$users = loadUsers();
foreach ($users as $user) {
    if ($user['email'] === $email) {
        $errors[] = "Email already exists";
        break;
    }
    if ($user['studentId'] === $studentId) {
        $errors[] = "Student ID already exists";
        break;
    }
}

if (!empty($errors)) {
    $_SESSION['registration_errors'] = $errors;
    $_SESSION['registration_data'] = $_POST;
    header('Location: register.html');
    exit();
}

// Create new user
$newUser = [
    'id' => uniqid(),
    'firstName' => $firstName,
    'lastName' => $lastName,
    'email' => $email,
    'studentId' => $studentId,
    'password' => password_hash($password, PASSWORD_DEFAULT),
    'course' => $course,
    'registrationDate' => date('Y-m-d H:i:s')
];

$users[] = $newUser;
saveUsers($users);

// Auto-login after registration
$_SESSION['user_id'] = $newUser['id'];
$_SESSION['email'] = $newUser['email'];
$_SESSION['firstName'] = $newUser['firstName'];
$_SESSION['lastName'] = $newUser['lastName'];

$_SESSION['success_message'] = "Registration successful! Welcome, " . $firstName . "!";
header('Location: profile.php');
exit();
?>