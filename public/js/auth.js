'use strict';

const query = './auth/';

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
};

const registerUser = async (formData, validator) => {
  console.log('Im getting called:-');
  try {
    const response = await myFetch('register', formData);

    if (response.errors) {
      response.errors.forEach((error) => {
        console.log('This is error: ' , error)
        if (error.username) {
          validator.showErrors({
            username: error.username,
          });
        }
        if (error.email) {
          validator.showErrors({
            email: error.email,
          });
        }
        if (error.password) {
          validator.showErrors({
            password: error.password,
          });
        }
        if (error.confirmPassword) {
          validator.showErrors({
            confirm_pass: error.confirmPassword,
          });
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

const loginUser = async (formData, errorLabel) => {
  try {
    const response = await myFetch('login', formData);
    if (response.token) {
      saveToken(response);
      location.replace('./index.html');
    } else {
      errorLabel.html(response.error);
      console.log('Error occoured', response.error);
    }
  } catch (err) {
    console.log('Error login', err);
  }
};

$(() => {

  $('#create-account-link').on('click',(event)=>{
    $('#signUpForm').show();
    $('#loginForm').hide(); 
  })

  $('#signin-link').on('click',(event)=>{
    $('#signUpForm').hide();
    $('#loginForm').show(); 
  })
  // Signup form elements ===============================================================================================



  // Form validator from Jquery plugin 'Validator'
  $.validator.addMethod(
    'customemail',
    (value, element) => {
      return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value
      );
    },
    "Email doesn't match format:ex@abc.xyz"
  );

  $('#signUpForm').validate({
    rules: {
      username: {
        required: true,
        minlength: 3,
      },
      email: {
        required: true,
        customemail: true,
      },
      password: {
        required: true,
        minlength: 5,
      },
      confirm_pass: {
        required: true,
        minlength: 5,
        equalTo: '#signUpPassword',
      },
      message: {
        username: {
          required: 'Username is required',
          minlength: jQuery.validator.format(
            'At least {0} characters required!'
          ),
        },

        email: {
          required: 'Email is required',
          minlength: jQuery.validator.format(
            'At least {0} characters required!'
          ),
        },
        password: {
          required: 'Password is required',
          minlength: jQuery.validator.format(
            'At least {0} characters required!'
          ),
        },
        confirm_pass: {
          equalTo: 'Password do not match',
        },
      },
    },
    submitHandler: (form) => {
      localStorage.clear();

      var validator = $(form).validate();

      const fd = {
        username: $('#signUpUsername').val(),
        email: $('#signUpEmail').val(),
        password: $('#signUpPassword').val(),
        confirmPassword: $('#confirmPassword').val(),
      };

      registerUser(fd, validator);
     
      
    },
  });

  // Signin form elements ===============================================================================================

  $('#loginForm').on('submit', async (event) => {
    localStorage.clear();
    event.preventDefault();

    const fd = {
      email: $('#signInEmail').val(),
      password: $('#signInPassword').val(),
    };

    const $label = $('.login100-form-errorMessage');

    loginUser(fd, $label);
  });
});
