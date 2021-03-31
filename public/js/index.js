'use strict';


$(() => {
  // window makes it a global variable, accisible from any js file
  window.userId = localStorage.getItem('userId');

  window.populateProfile = async (id) => {
    const response = await fetch('./user/' + id);
    const user = await response.json();
    if (user) {
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
  // populate profile databse

  const populateImages = async () => {
    const response = await fetch('./image/');
    const images = await response.json();
    $('.gallery').html('');
    images.forEach((post) => {
      $('.gallery').append(
        `<div class="gallery-item" tabindex="0">
        

          <div class="chip">
            <img src="./profiles/${post.dp}"  alt="Person" width="96" height="96">
            ${post.username}
            <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
          </div>


          <img src="./uploads/${post.imagename}" class="gallery-image" alt="" />
          <div class="gallery-item-info">
            <ul>
            <li class="gallery-item-likes">
                <span class="visually-hidden">Likes:</span>
                <i class="fas fa-heart" aria-hidden="true"></i> 
                <span class="${post.image_id}-likes"></span>
              </li>

              <li class="gallery-item-comments">
              <span class="visually-hidden">Comments:</span>
              <i class="fas fa-comment" aria-hidden="true"></i> 
              <span class="${post.image_id}-comments"></span>
              </li>
            </ul>
        </div>
      </div>
      `
      );

      if (post.like_count) {
        $(`.${post.image_id}-likes`).append(post.like_count);
      }
      if (post.comment_count) {
        $(`.${post.image_id}-comments`).append(post.comment_count);
      }

      $('.gallery-image').on('click', () => {
        //Get original image URL
        const imgUrl = `./uploads/${post.imagename}`;
        //Open image in new tab
        window.open(imgUrl, '_blank');
      });
    });
  };

  populateImages();

  // Eventlistner to reflect file name
  $('#fileInput').on('change', (e) => {
    // Get the selected file
    const [file] = e.target.files;
    // Get the file name and size
    const { name: fileName, size } = file;
    // Convert size in bytes to kilo bytes
    const fileSize = (size / 1000).toFixed(2);

    $('#fileLabel').text(fileName);
  });

  // submit upload image
  $('.upload-form').on('submit', async (event) => {
    event.preventDefault();

    const fd = new FormData();
    fd.append('image', $('#fileInput')[0].files[0]);
    fd.append('ownerId', userId);

    const fetchOptions = {
      method: 'POST',
      body: fd,
    };

    console.log('fetchOptions', fetchOptions);
    const response = await fetch('./image/', fetchOptions);
    const result = await response.json();
    if (result.status) {
      populateImages();
    }
  });
});
