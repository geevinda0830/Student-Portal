// Global variables
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize theme
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeEventListeners();
    
    // Form-specific initializations
    if (document.getElementById('registerForm')) {
        initializeRegistrationForm();
    }
    
    if (document.getElementById('loginForm')) {
        initializeLoginForm();
    }
    
    if (document.getElementById('contactForm')) {
        initializeContactForm();
    }
});

// Theme Management
function initializeTheme() {
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeButton('🌞');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeButton('🌙');
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    
    const themeButton = document.getElementById('theme-toggle');
    updateThemeButton(currentTheme === 'dark' ? '🌞' : '🌙');
}

function updateThemeButton(icon) {
    const themeButton = document.getElementById('theme-toggle');
    if (themeButton) {
        themeButton.textContent = icon;
    }
}

// Event Listeners
function initializeEventListeners() {
    const themeButton = document.getElementById('theme-toggle');
    if (themeButton) {
        themeButton.addEventListener('click', toggleTheme);
    }
    
    // Modal close events
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close');
    const modalOk = document.getElementById('modal-ok');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (modalOk) {
        modalOk.addEventListener('click', closeModal);
    }
    
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
}

// Password Toggle
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = field.nextElementSibling;
    
    if (field.type === 'password') {
        field.type = 'text';
        toggle.textContent = '🙈';
    } else {
        field.type = 'password';
        toggle.textContent = '👁️';
    }
}

// Validation Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function validateRequired(value) {
    return value.trim() !== '';
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
}

// Modal Functions
function showModal(title, message, type = 'info') {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    
    if (modal && modalTitle && modalMessage) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.style.display = 'block';
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Registration Form
function initializeRegistrationForm() {
    const form = document.getElementById('registerForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            // Allow form to submit to PHP, but validate first
            if (!validateRegistrationForm()) {
                e.preventDefault();
            }
        });
        
        // Real-time validation
        const fields = ['firstName', 'lastName', 'email', 'studentId', 'password', 'confirmPassword', 'course'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', () => validateField(fieldId));
                field.addEventListener('input', () => clearError(fieldId));
            }
        });
    }
}

function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    
    switch(fieldId) {
        case 'firstName':
        case 'lastName':
        case 'studentId':
        case 'course':
            if (!validateRequired(value)) {
                showError(fieldId, 'This field is required');
                return false;
            }
            break;
            
        case 'email':
            if (!validateRequired(value)) {
                showError(fieldId, 'Email is required');
                return false;
            }
            if (!validateEmail(value)) {
                showError(fieldId, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'password':
            if (!validateRequired(value)) {
                showError(fieldId, 'Password is required');
                return false;
            }
            if (!validatePassword(value)) {
                showError(fieldId, 'Password must be at least 8 characters long');
                return false;
            }
            break;
            
        case 'confirmPassword':
            const password = document.getElementById('password').value;
            if (!validateRequired(value)) {
                showError(fieldId, 'Please confirm your password');
                return false;
            }
            if (value !== password) {
                showError(fieldId, 'Passwords do not match');
                return false;
            }
            break;
    }
    
    clearError(fieldId);
    return true;
}

function validateRegistrationForm() {
    clearAllErrors();
    
    const fields = ['firstName', 'lastName', 'email', 'studentId', 'password', 'confirmPassword', 'course'];
    let isValid = true;
    
    fields.forEach(fieldId => {
        if (!validateField(fieldId)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Login Form
function initializeLoginForm() {
    const form = document.getElementById('loginForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            // Allow form to submit to PHP, but validate first
            if (!validateLoginForm()) {
                e.preventDefault();
            }
        });
        
        // Real-time validation
        const emailField = document.getElementById('loginEmail');
        const passwordField = document.getElementById('loginPassword');
        
        if (emailField) {
            emailField.addEventListener('blur', () => validateLoginField('loginEmail'));
            emailField.addEventListener('input', () => clearError('loginEmail'));
        }
        
        if (passwordField) {
            passwordField.addEventListener('blur', () => validateLoginField('loginPassword'));
            passwordField.addEventListener('input', () => clearError('loginPassword'));
        }
    }
}

function validateLoginField(fieldId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    
    switch(fieldId) {
        case 'loginEmail':
            if (!validateRequired(value)) {
                showError(fieldId, 'Email is required');
                return false;
            }
            if (!validateEmail(value)) {
                showError(fieldId, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'loginPassword':
            if (!validateRequired(value)) {
                showError(fieldId, 'Password is required');
                return false;
            }
            break;
    }
    
    clearError(fieldId);
    return true;
}

function validateLoginForm() {
    clearAllErrors();
    
    const fields = ['loginEmail', 'loginPassword'];
    let isValid = true;
    
    fields.forEach(fieldId => {
        if (!validateLoginField(fieldId)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Contact Form
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        // Check if this is the static contact form (contact.html) or the PHP version
        const isStaticForm = !form.action || form.action.includes('contact.html') || form.action === '';
        
        form.addEventListener('submit', function(e) {
            if (isStaticForm) {
                // For static form, prevent submission and show modal
                e.preventDefault();
                validateContactForm();
            } else {
                // For PHP form, validate and allow submission
                if (!validateContactFormPHP()) {
                    e.preventDefault();
                }
            }
        });
        
        // Initialize rating system
        initializeRating();
    }
}

function initializeRating() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating');
    
    if (stars.length > 0 && ratingInput) {
        stars.forEach((star, index) => {
            star.addEventListener('click', function() {
                const rating = index + 1;
                ratingInput.value = rating;
                updateStars(rating);
            });
            
            star.addEventListener('mouseover', function() {
                updateStars(index + 1);
            });
        });
        
        const ratingContainer = document.querySelector('.rating-input');
        if (ratingContainer) {
            ratingContainer.addEventListener('mouseleave', function() {
                updateStars(ratingInput.value || 0);
            });
        }
    }
}

function updateStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// For static contact form (contact.html)
function validateContactForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    clearAllErrors();
    let isValid = true;
    
    if (!validateRequired(name)) {
        showError('name', 'Name is required');
        isValid = false;
    }
    
    if (!validateRequired(email)) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!validateRequired(message)) {
        showError('message', 'Message is required');
        isValid = false;
    }
    
    if (isValid) {
        showModal('Success!', 'Your message has been submitted successfully! (This is a demo)');
        // Reset form
        setTimeout(() => {
            document.getElementById('contactForm').reset();
            closeModal();
        }, 2000);
    } else {
        showModal('Validation Error', 'Please correct the errors and try again.');
    }
}

// For PHP contact form (contact.php)
function validateContactFormPHP() {
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const rating = document.getElementById('rating').value;
    
    clearAllErrors();
    let isValid = true;
    
    if (!validateRequired(subject)) {
        showError('subject', 'Subject is required');
        isValid = false;
    }
    
    if (!validateRequired(message)) {
        showError('message', 'Message is required');
        isValid = false;
    }
    
    if (!rating || rating < 1 || rating > 5) {
        showError('rating', 'Please provide a rating');
        isValid = false;
    }
    
    return isValid;
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Auto-hide success/error messages after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => {
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                message.style.display = 'none';
            }, 300);
        }, 5000);
    });
});