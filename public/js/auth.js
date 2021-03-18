'use strict';

const query = 'http://localhost:3000/auth/';

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

const saveToken = (response) => {
  localStorage.setItem('userId', response.user_id);
  localStorage.setItem('token', response.token);
  location.replace('./upload');
};

$(() => {
  // Signup form elements ===============================================================================================

  const $signUpUsername = $('#signUpUsername');
  const $signUpEmail = $('#signUpEmail');
  const $signUpPassword = $('#signUpPassword');
  const $confirmPassword = $('#confirmPassword');

  const validatePassword = () => {
    if ($signUpPassword.val() != $confirmPassword.val()) {
      $confirmPassword[0].setCustomValidity('Passwords do not match');
    } else {
      $confirmPassword[0].setCustomValidity('');
    }
  };

  const validateEmail = () => {
    const mailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!$signUpEmail.val().match(mailformat)) {
      $signUpEmail[0].setCustomValidity('Valid email is required: ex@abc.xyz');
    } else {
      $signUpEmail[0].setCustomValidity('');
    }
  };

  // Event Listeners
  $signUpEmail.on('change', validateEmail);
  $signUpPassword.on('blur', validatePassword);
  $confirmPassword.on('blur', validatePassword);

  $('#signUpForm').on('submit', async (event) => {
    event.preventDefault();
    localStorage.clear();

    const fd = {
      username: $signUpUsername.val(),
      email: $signUpEmail.val(),
      password: $signUpPassword.val(),
    };

    const response = await myFetch('register', fd);

    if (response.token) {
      saveToken(response.token);
    } else {
      console.log('Error occoured', response.error);
    }
  });

  // Signin form elements ===============================================================================================

  $('#loginForm').on('submit', async (event) => {
    localStorage.clear();
    event.preventDefault();

    const fd = {
      email: $('#signInEmail').val(),
      password: $('#signInPassword').val(),
    };

    const response = await myFetch('login', fd);
    console.log('this is token', response);
    if (response.token) {
      saveToken(response.token);
    } else {
      $('.login100-form-errorMessage').html(response.error);
      console.log('Error occoured', response.error);
    }
  });
});
