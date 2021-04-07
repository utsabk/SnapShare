'use strict';

import {
  modalClickHandler,
  userId,
  fetchProfileStatCount,
  myCustomFetch,
} from './main.js';
import { populateImages } from './index.js';

$(() => {
  const $editProfileUsername = $('#editProfileUsername');
  const $editProfileEmail = $('#editProfileEmail');

  const populateProfile = async (id) => {
    const user = await myCustomFetch('./user/' + id);
    if (user.user_id) {
      // Check if user profile exits
      if (user.dp) {
        $('.profile-image').css(
          'background-image',
          `url(./profiles/${user.dp})`
        );
      } else {
        $('.profile-image').css('background-image', 'url(./images/logo.png)');
      }

      $('.profile-user-name').text(user.username);
    }

    $('#edit-profile').on('click', async (event) => {
      $editProfileUsername.val(user.username);
      $editProfileEmail.val(user.email);
    });
  };

  // remove signin button if loggedin
  if (userId) {
    $('.profile').show();
    $('.signin').hide();
    populateProfile(userId);
  }
  // remove upload button if not loggedin
  if (!userId) {
    $('.upload-form').hide();
    $('.profile').hide();
  }

  fetchProfileStatCount(userId, 'image'); //Posts count
  fetchProfileStatCount(userId, 'like'); //Likes count
  fetchProfileStatCount(userId, 'comment'); //Comments count

  // Eventlistner to catch when file added
  $('#profileImg').on('change', async (e) => {
    // Get the selected file
    const [file] = e.target.files;
    console.log('This is the file uploaded:-', file);
    if (file) {
      try {
        const fd = new FormData();
        fd.append('profile', file);
        fd.append('ownerId', userId);

        const fetchOptions = {
          method: 'POST',
          body: fd,
        };

        const upload = await myCustomFetch('./user/profile', fetchOptions);
        const response = await upload;

        if (response.status) {
          console.log('this is the response upload:-', response);
          populateProfile(userId);
          populateImages();
        }
      } catch (err) {
        console.log('Error while profile update', err);
      }
    }
  });

  // Edit profile modal click listners
  const $editProfileModal = '#edit-profile-modal';

  $('#edit-profile').on('click', (event) => {
    $($editProfileModal).show();
  });

  modalClickHandler($editProfileModal);

  var $editFormValidator = $('#editProfileForm').validate()

  $('#editProfileForm .deletebtn').on('click', async (event) => {
    event.preventDefault();

    const urlencoded = new URLSearchParams();
    urlencoded.append('username', $editProfileUsername.val());
    urlencoded.append('email', $editProfileEmail.val());

    console.log('This is form data:-', urlencoded);

    const requestOptions = {
      method: 'PUT',
      body: urlencoded,
      redirect: 'follow',
    };

    try{
      const result = await myCustomFetch(`./user/${userId}`,requestOptions)
      console.log('Result from server:-',result);

      if(result.errors){
        result.errors.forEach(err => {
          console.log('this is err:-',err);
          if(err.username){
            $editFormValidator.showErrors({
              username:err.username
            })
          }

          if(err.email){
            $editFormValidator.showErrors({
              email:err.email
            })
          }
        })
      }else if(result.status){
        console.log('result.statts:-',result.status);
        populateImages();
        populateProfile(userId)
        $($editProfileModal).hide();
      }

    }catch (err) {
      console.log('Error:-',err);
    }
  });

  // Logout modal click listners
  const $logoutModal = '#id01';

  $('#profile-settings-btn').on('click', (event) => {
    $($logoutModal).show();
  });

  modalClickHandler($logoutModal);

  $(`${$logoutModal} .deletebtn`).on('click', (event) => {
    event.preventDefault();
    localStorage.clear();
    location.reload();
    $($logoutModal).hide();
  });
});
