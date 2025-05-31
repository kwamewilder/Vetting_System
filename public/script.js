const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

// Panel switching
signUpButton?.addEventListener('click', () => {
  container.classList.add("right-panel-active");
  animateFormTransition();
});

signInButton?.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
  animateFormTransition();
});

// Slide + fade animation for mobile
function animateFormTransition() {
  const forms = document.querySelectorAll('.form-container');
  forms.forEach(f => {
    f.style.opacity = 0;
    setTimeout(() => {
      f.style.opacity = 1;
    }, 300);
  });
}

// Remember Me: Load username from cookie
window.addEventListener('DOMContentLoaded', () => {
  const remembered = getCookie("rememberedUser");
  const usernameInput = document.getElementById("username");
  const rememberCheckbox = document.getElementById("remember");

  if (remembered && usernameInput) {
    usernameInput.value = remembered;
    if (rememberCheckbox) rememberCheckbox.checked = true;
  }
});

// On form submit: save username if "remember me" checked
document.querySelector('form[action="/auth/login"]')?.addEventListener('submit', function (e) {
  const username = document.getElementById("username").value;
  const remember = document.getElementById("remember").checked;
  if (remember) {
    document.cookie = `rememberedUser=${username}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
  } else {
    document.cookie = "rememberedUser=; path=/; max-age=0";
  }
});

// Helper to get cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Mobile toggle buttons
document.getElementById('goToSignUp')?.addEventListener('click', (e) => {
  e.preventDefault();
  container.classList.add('right-panel-active');
});

document.getElementById('goToSignIn')?.addEventListener('click', (e) => {
  e.preventDefault();
  container.classList.remove('right-panel-active');
});

/// Add this to your existing script.js
document.addEventListener('DOMContentLoaded', function() {
  // Check if form has shake class and remove it after animation
  const loginForm = document.getElementById('loginForm');
  if (loginForm && loginForm.classList.contains('shake')) {
    loginForm.addEventListener('animationend', function() {
      loginForm.classList.remove('shake');
    }, { once: true });
  }

  // Your existing code...
  const signUpButton = document.getElementById('signUp');
  const signInButton = document.getElementById('signIn');
  // ... rest of your existing code
});

