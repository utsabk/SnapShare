'use strict';

const query = './auth/';

// SignIn form elements
const signInForm = document.getElementById('loginForm');
const signInEmail = document.getElementById('signInEmail');
const signInPassword = document.getElementById('signInPassword');
const errorMessage = document.querySelector('.login100-form-errorMessage');

// Signup form elements
const signUpForm = document.getElementById('signUpForm');
const signUpUsername = document.getElementById('signUpUsername');
const signUpEmail = document.getElementById('signUpEmail');
const signUpPassword = document.getElementById('signUpPassword');
const confirmPassword = document.getElementById('confirmPassword');


const validateEmail = () => {
  const mailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!signUpEmail.value.match(mailformat)) {
    signUpEmail.setCustomValidity('Valid email is required: ex@abc.xyz');
    signUpEmail.reportValidity();
  } else {
    signUpEmail.setCustomValidity('');
  }
};

const validatePassword = () => {
  const passwordFormat = /^((?=.*[A-Z])[a-zA-Z\d]{5,})$/;
  if (!signUpPassword.value.match(passwordFormat)) {
    signUpPassword.setCustomValidity('Min 5 characters with one uppercase');
  } else {
    signUpPassword.setCustomValidity('');
  }
};

const validatePasswordMatch = () => {
  if (signUpPassword.value != confirmPassword.value) {
    confirmPassword.setCustomValidity('Passwords do not match');
    confirmPassword.reportValidity();
  } else {
    confirmPassword.setCustomValidity('');
  }
};

// Event Listeners
signUpEmail.onkeyup = validateEmail;
signUpPassword.onkeyup = validatePassword;
confirmPassword.onkeyup = validatePasswordMatch;

const myFetch = async (endpoint, fd) => {
  var requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fd),
    redirect: 'follow',
  };

  try {
    const result = await fetch(query + endpoint, requestOptions);
    const response = await result.json();
    return response;
  } catch (e) {
    console.log('error', e.message);
  }
};

/**
 * Saves the tokens to the session storage
 * @param {Object} response is a reponse from the server
 */
const saveToken = (response) => {
  sessionStorage.setItem('userId', response.user_id);
  sessionStorage.setItem('token', response.token);
};

const registerUser = async (formData) => {
  try {
    const response = await myFetch('register', formData);

    /**
     * Even though the form is validated in the frontend,
     * Request is also validated with `express-validator`, e.g. if email/username is already in use
     * Express validator will return errors object in case of validation failure
     */
    if (response.errors) {
      response.errors.forEach((error) => {
        console.error('Validation error:-', error);
        if (error.username) {
          signUpUsername.setCustomValidity(error.username);
          signUpUsername.reportValidity();
        }
        if (error.email) {
          signUpEmail.setCustomValidity(error.email);
          signUpEmail.reportValidity();
        }
        if (error.password) {
          signUpPassword.setCustomValidity(error.password);
          signUpPassword.reportValidity();
        }
        if (error.confirmPassword) {
          confirmPassword.setCustomValidity(error.confirmPassword);
          confirmPassword.reportValidity();
        }
      });
    }
    if (response.token) {
      saveToken(response);
      location.replace('./index.html');
    }
  } catch (err) {
    console.log('Error catched', err);
  }
};

const loginUser = async (formData) => {
  try {
    const response = await myFetch('login', formData);
    if (response.token) {
      saveToken(response);
      location.replace('./index.html');
    } else {
      errorMessage.innerHTML = response.error;
      console.log('Error occoured', response.error);
    }
  } catch (err) {
    console.log('Error login', err);
  }
};

document
  .getElementById('create-account-link')
  .addEventListener('click', (event) => {
    document.getElementById('signUpForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
  });

document.getElementById('signin-link').addEventListener('click', (event) => {
  document.getElementById('signUpForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
});

// Signup form submit
signUpForm.addEventListener('submit', (event) => {
  if (signUpForm.checkValidity()) {
    event.preventDefault();
    sessionStorage.clear();
    const fd = {
      username: signUpUsername.value,
      email: signUpEmail.value,
      password: signUpPassword.value,
      confirmPassword: confirmPassword.value,
    };
    console.log('Signupform formdata:-', fd);
    registerUser(fd);
  } else {
    console.log('Form is not validated');
  }
});

// Signin form submit
signInForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  localStorage.clear();

  const fd = {
    email: signInEmail.value,
    password: signInPassword.value,
  };

  loginUser(fd);
});
