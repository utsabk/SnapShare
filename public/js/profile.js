'use strict';

import { userId,fetchProfileStatCount, myCustomFetch } from '../js/main.js';

$(() => {

 const populateProfile = async (id) => {
    const user = await myCustomFetch('./user/' + id);
    if (user.user_id) {
      $('.profile-image').css('background-image', `url(./profiles/${user.dp})`);
      $('.profile-user-name').text(user.username);
    }
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
    console.log('This is the file uploaded:-', file)
    if (file) {
      try {
        const fd = new FormData();
        fd.append('profile', file);
        fd.append('ownerId', userId);

        const fetchOptions = {
          method: 'POST',
          body: fd,
        };

        const upload = await myCustomFetch('./user/profile',fetchOptions);
        const response = await upload;

        if(response.status){
            console.log('this is the response upload:-', response);
            populateProfile(userId)
        }

      } catch (err) {
        console.log('Error while profile update', err);
      }
    }
  });

  // Logout modal click listners
  const $modal = $('#id01');
  $('#id01 .close').on('click', (event) => {
    event.preventDefault();
    $modal.hide();
  });

  $('#profile-settings-btn').on('click', (event) => {
    $modal.show();
  });

  $('#id01 .cancelbtn').on('click', (event) => {
    event.preventDefault();
    $modal.hide();
  });

  $('#id01 .deletebtn').on('click', (event) => {
    event.preventDefault();
    localStorage.clear();
    location.reload();
    $modal.hide();
  });

  // When the user clicks anywhere outside of the modal, close it
  $(document).on('click',(event) => {
      if ($(event.target).is($modal) ) {
          $modal.hide();
      }  
  })




});
