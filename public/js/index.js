'use strict';

import {
  userId,
  userToken,
  fetchProfileStatCount,
  myCustomFetch,
  timeAgo,
  updateTimeInterval,
  modalClickHandler,
} from './main.js';

//<! HTML for Post info--===============================================================================================-->

const postData = `<div class="gallery-item-info">
    <ul>

      <li class="gallery-item-likes">
        <button id="like-button">Like</button>
        <span class="visually-hidden">Likes:</span>
        <i class="fas fa-heart" aria-hidden="true"></i> 
        <span id="likes-count"></span>
      </li>

      <li class="gallery-item-comments">
        <button id="comment-button">Comment</button>
        <span class="visually-hidden">Comments:</span>
        <i class="fas fa-comment" aria-hidden="true"></i> 
        <span id="comments-count"></span>
      </li>

      <p class="m-0"></p>

    </ul>
      
    </div>

    <div class="comment-section">
      <div id="posted-comments"></div>
      <form class="comment-form" method="POST">
        <textarea aria-label="Add a comment…" placeholder="Add a comment…" ></textarea>
        <button type="submit" disabled="">Post</button>
      </form>
    </div>

    <div class="modal">
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
    </div>
  </div>`;

//Populate each cards
const createPostCards = (posts) => {
  $('.gallery').html('');
  posts.forEach((post, i) => {
    $('.gallery').append(
      // Each gallery div is assigned with unique id with index number 'image-index-${i}'
      `<div id="image-index-${i}" class="gallery-item" tabindex="0">
        
        <div class="chip">
          <img class="dpPost" src="./profiles/${post.dp}"  alt="Person" width="96" height="96">
          ${post.username}
          <i  id="trash" class="fa fa-trash" aria-hidden="true"></i>
        </div>


        <img src="./uploads/${post.imagename}" class="gallery-image" alt="" />
        
        ${postData}

      </div>`
    );

    const $imageWithIndex = `#image-index-${i}`;
    const $galleryItemInfo = `${$imageWithIndex} .gallery-item-info`;
    const $commentSection = `${$imageWithIndex} .comment-section`;
    const $deleteModal = `${$imageWithIndex} .modal`;
    const $likeBtn = $(`${$galleryItemInfo} #like-button`);
    const $commentBtn = $(`${$galleryItemInfo} #comment-button`);
    const $postedComments = `${$commentSection} #posted-comments`;
    const $commentInputField = `${$commentSection} textarea`;

    const $postUplodedTime = $(`${$galleryItemInfo} .m-0`);

    // Attach posted time for each post when loded first time
    $postUplodedTime.html(timeAgo(post.creation_date));

    // Update posted time for each post every timeinterval
    updateTimeInterval($postUplodedTime, post.creation_date);

    // Like and Comment allowed only when logged in
    if (!userId) {
      $($likeBtn).prop('disabled', true);
      $($commentBtn).prop('disabled', true);
    } else {
      $($likeBtn).prop('disabled', false);
      $($commentBtn).prop('disabled', false);
    }

    // Only owner of the post allowed to delete
    if (userId == post.owner_id) {
      $(`${$imageWithIndex} .chip i`).show();
    }

    // Populate Likes on each post
    // When like button is clicked
    $likeBtn.on('click', (e) => {
      if ($likeBtn.html() == 'Like') {
        fetchLikes('POST', 'add', post.image_id);
        $likeBtn.html('Liked');
        $likeBtn.css('background-color', '#3675EA');
      } else {
        fetchLikes('DELETE', 'remove', post.image_id);
        $likeBtn.html('Like');
        $likeBtn.css('background-color', '');
      }
    });

    // Fetch likes of a post from backend for all users
    const getLikes = async (imageId) => {
      const like = await myCustomFetch(`./like/${imageId}`);
      if (like.likes_count) {
        $(`${$imageWithIndex} #likes-count`).html(like.likes_count);
      } else {
        $(`${$imageWithIndex} #likes-count`).html('');
      }
    };

    // Fetch likes from backend for specific user only (Logged in user)
    const fetchLikes = async (myMethod, route, imageId) => {
      var urlencoded = new URLSearchParams();
      urlencoded.append('userId', userId);
      urlencoded.append('imageId', imageId);

      const fetchOptions = {
        method: myMethod,
        body: urlencoded,
        redirect: 'follow',
      };
      const like = await myCustomFetch(`./like/${route}/`, fetchOptions);

      if (like.message) {
        getLikes(imageId);
        fetchProfileStatCount(userId, 'like');
      }
      if (like.status) {
        const image = like.status.image_id;
        $likeBtn.html('Liked');
        $likeBtn.css('background-color', '#3675EA');
      }
    };

    // Populate comments on each post

    //Slide down & up comment section
    $commentBtn.on('click', (e) => {
      $($commentSection).slideToggle('slow');
    });

    const createComments = async (comments) => {
      $($postedComments).html('');
      const comments_count = comments.filter(
        (comment) => comment.image_id == post.image_id
      ).length;
      comments.forEach((comment) => {
        const listItem = `
        <div class="comment-heading">
            <div class="comment-info">
              <a href="#" class="comment-author">${comment.username}</a>
              <p id=${comment.comment_id} class="m-0">
              ${timeAgo(comment.time_stamp)}
              </p>
          </div>
        </div>

          <div class="comment-body">
            <p> ${comment.content}</p>
          </div>`;
        $($postedComments).append(listItem);

        // update time for each comment
        $(`${$postedComments} .m-0`).each((index, element) => {
          if (element.id == comment.comment_id) {
            updateTimeInterval($(element), comment.time_stamp);
          }
        });

        // If more than one comment update comment element
        if (comments_count) {
          $(`${$imageWithIndex} #comments-count`).html(comments_count);
        }
      });
    };

    // Fetch comments of a post from backend for all users
    const getComments = async (id) => {
      const comments = await myCustomFetch(`./comment/${id}`);
      createComments(comments);
      fetchProfileStatCount(userId, 'comment');
    };

    //Validate the comment input is not blank
    $($commentInputField).on('keyup', (event) => {
      const $inputVal = $($commentInputField).val();

      if ($inputVal != '') {
        $(`${$commentSection} button`).attr('disabled', false);
      } else {
        $(`${$commentSection} button`).attr('disabled', true);
      }
    });

    // When comment is posted
    $(`${$commentSection} form`).on('submit', async (event) => {
      event.preventDefault();

      const urlencoded = new URLSearchParams();
      urlencoded.append('content', $($commentInputField).val());
      urlencoded.append('userId', userId);
      urlencoded.append('imageId', post.image_id);

      const requestOptions = {
        method: 'POST',
        body: urlencoded,
        redirect: 'follow',
      };
      const result = await myCustomFetch('./comment/', requestOptions);
      if (result.message) {
        $($commentInputField).val('');
        $(`${$commentSection} button`).attr('disabled', true);
        getComments(post.image_id);
      }
    });

    $('.gallery-image').on('click', () => {
      //Get original image URL
      const imgUrl = `./uploads/${post.imagename}`;
      //Open image in new tab
      window.open(imgUrl, '_blank');
    });

    // When clicked on the trash icon
    $(`${$imageWithIndex} #trash`).on('click', (event) => {
      $($deleteModal).show(); // delete picture modal
    });

    modalClickHandler($deleteModal);

    // When trash icon is presse, DELETE a post/image
    $(`${$deleteModal} .deletebtn`).on('click', async (event) => {
      event.preventDefault();

      const fetchOptions = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + userToken,
        },
      };

      const deleteRes = await myCustomFetch(
        `./image/${post.image_id}`,
        fetchOptions
      );
      if (deleteRes.status) {
        populateImages();
        fetchProfileStatCount(userId, 'image');
        fetchProfileStatCount(userId, 'like');
        fetchProfileStatCount(userId, 'comment');
        $($modal).hide();
      }
    });

    //When page is loaded
    getComments(post.image_id); //Get all the comments
    getLikes(post.image_id); //Get all the likes
    fetchLikes('POST', 'status', post.image_id); //Get the staus of like button
  });
};

//<! End of post card--===============================================================================================-->

// Fetch all the posts and populate them
const populateImages = async () => {
  const images = await myCustomFetch('./image/');
  createPostCards(images);
};

$(() => {
  populateImages(); // call this when loaded

  //chageDPPost()

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

    const result = await myCustomFetch('./image/', fetchOptions);

    if (result.status) {
      $('#fileLabel').text('Upload');
      $('.upload-form').trigger('reset');
      populateImages();
      fetchProfileStatCount(userId, 'image');
    }
  });
});

export { populateImages };
