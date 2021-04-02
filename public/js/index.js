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

  const createPostCards = (posts) => {
    $('.gallery').html('');
    posts.forEach((post, i) => {
      $('.gallery').append(
        `<div id="image-index-${i}" class="gallery-item" tabindex="0">
          <div class="chip">
            <img src="./profiles/${post.dp}"  alt="Person" width="96" height="96">
            ${post.username}
            <i class="fa fa-trash" aria-hidden="true"></i>
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

      $(`#image-index-${i}`).append(
        `<div id="image-index-${i}-modal" class="modal">
          <span class="close" title="Close Modal">×</span>
          <form class="modal-content">
            <div class="container"> 
              <h1>Delete</h1>
              <p>Are you sure you want to Delete?</p>
            
              <div class="clearfix">
                <button class="cancelbtn">Cancel</button>
                <button class="deletebtn">Delete</button>
              </div>
            </div>
          </form>
        </div>`
      );

      $(`#image-index-${i} .chip i`).on('click', (event) => {
      
          const $modal = $(`#image-index-${i}-modal`);

          $modal.show();

          $(`#image-index-${i}-modal .close`).on('click', (e) => {
            e.preventDefault();

            $modal.hide();
          });

          $(`#image-index-${i}-modal .cancelbtn`).on('click', (event) => {
            event.preventDefault();
            $modal.hide();
          });

          $(`#image-index-${i}-modal  .deletebtn`).on('click', async (event) => {
            event.preventDefault();

            const clickTarget = event.target;

            console.log('This is clickTarget', clickTarget);
            console.log('This is post.image_id}', post.image_id);

            const fetchOptions = {
              method: 'DELETE',
            };
            try {
              const response = await fetch(`./image/${post.image_id}`,fetchOptions)
              const json = await response.json();
              console.log('delete response', json);
              populateImages();
            } catch (err) {
              console.log(err.message);
            }
            $modal.hide();
          });
          // When the user clicks anywhere outside of the modal, close it
          $(document).on('click', (event) => {
            if ($(event.target).is($modal)) {
              $modal.hide();
            }
          });
        });


      if (post.like_count) {
        $(`.${post.image_id}-likes`).append(post.like_count);
      }
      if (post.comment_count) {
        $(`.${post.image_id}-comments`).append(post.comment_count);
      }

      //<!--===============================================================================================-->
      /*--- MAP  MODAL  ---*/

      $('.gallery-image').on('click', () => {
        //Get original image URL
        const imgUrl = `./uploads/${post.imagename}`;
        //Open image in new tab
        window.open(imgUrl, '_blank');
      });
    });
  };

  const populateImages = async () => {
    const response = await fetch('./image/');
    const images = await response.json();
    createPostCards(images);
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
      $('#fileLabel').text('Upload');
      $('.upload-form').trigger('reset');
      populateImages();
    }
  });
});
