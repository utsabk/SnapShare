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

  const fetchProfileStatCount = async (id, route) => {
    try {
      const response = await fetch(`./${route}/user/${id}`);
      const result = await response.json();
      if (result) {
        console.log('this is log:-',result.count)
        $(`.profile-stats #${route}`).html(result.count)
        //return result.count;
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  fetchProfileStatCount(userId,'image')
  fetchProfileStatCount(userId,'like');
  fetchProfileStatCount(userId,'comment');





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
            <button id="like-button">Like</button>

            <li class="gallery-item-likes">
                <span class="visually-hidden">Likes:</span>
                <i class="fas fa-heart" aria-hidden="true"></i> 
                <span class="image-index-${i}-likes"></span>
              </li>
              <button id="comment-button">Comment</button>

              <li class="gallery-item-comments">
              <span class="visually-hidden">Comments:</span>
              <i class="fas fa-comment" aria-hidden="true"></i> 
              <span class="image-index-${i}-comments"></span>
              </li>

            </ul>
            
        </div>
        <div class="comment-section">
        <div id="posted-comments"></div>
          <form class="comment-form" method="POST">
            <textarea aria-label="Add a comment…" placeholder="Add a comment…" ></textarea>
            <button type="submit" disabled="">Post</button>
          </form>
        </div>
      </div>
      `
      );

      // Each gallery div is assigned with unique id with index number 'image-index-${i}'
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

      $(`#image-index-${i} #comment-button`).on('click',(e)=>{
        $(`#image-index-${i} .comment-section`).slideToggle('slow');
      })

      $(`#image-index-${i} #like-button`).on('click',(e)=>{
        if($(`#image-index-${i} #like-button`).html() == 'Like'){
          fetchLikes('POST','add',post.image_id)
          $(`#image-index-${i} #like-button`).html('Liked')
          $(`#image-index-${i} #like-button`).css("background-color", "#3675EA");
        }else{
          fetchLikes('DELETE','remove',post.image_id)
          $(`#image-index-${i} #like-button`).html('Like')
          $(`#image-index-${i} #like-button`).css("background-color", "");

        }
      })

      const getComments = async (id) => {
        try {
          const response = await fetch(`./comment/${id}`);
          const comments = await response.json();
          createComments(comments);
          fetchProfileStatCount(userId,'comment');


          
        } catch (err) {
          console.log(err.message);
        }
      };

    
      const getLike = async(imageId)=>{
        try {
          const response = await fetch(`./like/${imageId}`);
          const like = await response.json();
          if(like.likes_count){
            $(`.image-index-${i}-likes`).html(like.likes_count);
          }else{
            $(`.image-index-${i}-likes`).html('');
          }
        } catch (err) {
          console.log(err.message);
        }
      }

      const fetchLikes = async (myMethod,route,imageId) => {
        var urlencoded = new URLSearchParams();
        urlencoded.append("userId", userId);
        urlencoded.append("imageId", imageId);
        
        const fetchOptions = {
          method: myMethod,
          body: urlencoded,
          redirect: 'follow'
        };
        try {
          const response = await fetch(`./like/${route}/`,fetchOptions);
          const like = await response.json();
          if(like.message){
            getLike(imageId)
            fetchProfileStatCount(userId,'like');
          }
          if(like.status){
            const image = like.status.image_id
            $(`#image-index-${i} #like-button`).html('Liked')
            $(`#image-index-${i} #like-button`).css("background-color", "#3675EA");
          }
        } catch (err) {
          console.log(err.message);
        }
      }

      const createComments = async (comments) => {
        $(`#image-index-${i} #posted-comments`).html('');
        comments.forEach((comment) => {
          const listItem = `
          <div class="comment-heading">
              <div class="comment-info">
                <a href="#" class="comment-author">${comment.username}</a>
                <p id=${comment.comment_id} class="m-0"></p>
            </div>
          </div>

            <div class="comment-body">
              <p> ${comment.content}</p>
            </div>`;
          $(`#image-index-${i} #posted-comments`).append(listItem);

          setInterval(() => {
            $(`#image-index-${i} #${comment.comment_id}`).html(
              timeAgo(comment.time_stamp)
            );
          }, 1000);

          if (comment.comment_count) {
            $(`.image-index-${i}-comments`).html(comment.comment_count);
          }
        });
      };

      

      getComments(post.image_id);
      getLike(post.image_id);
      fetchLikes('POST','status',post.image_id);

      // Only owner of the post allowed to delete
      if (userId == post.owner_id) {
        $(`#image-index-${i} .chip i`).show();
      }

      // When clicked on the trash icon
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

          const fetchOptions = {
            method: 'DELETE',
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          };
          try {
            const response = await fetch(
              `./image/${post.image_id}`,
              fetchOptions
            );
            const json = await response.json();
            console.log('delete response', json);
            populateImages();
            fetchProfileStatCount(userId,'image');
            fetchProfileStatCount(userId,'like');
            fetchProfileStatCount(userId,'comment');

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

      $(`#image-index-${i} textarea`).on('keyup', (event) => {
        const textare_val = $(`#image-index-${i} textarea`).val();

        if (textare_val != '') {
          $(`#image-index-${i} .comment-form button`).attr('disabled', false);
        } else {
          $(`#image-index-${i} .comment-form button`).attr('disabled', true);
        }
      });

      $(`#image-index-${i} .comment-form`).on('submit', async (event) => {
        event.preventDefault();
        
        const urlencoded = new URLSearchParams();
        urlencoded.append("content", $(`#image-index-${i} textarea`).val());
        urlencoded.append("userId", userId);
        urlencoded.append("imageId", post.image_id);
        
        const requestOptions = {
          method: 'POST',
          body: urlencoded,
          redirect: 'follow'
        };

        try {
          const response = await fetch('./comment/', requestOptions);
          const result = await response.json();
          if (result.message) {
            $(`#image-index-${i} textarea`).val('')
            $(`#image-index-${i} .comment-form button`).attr('disabled', true);
            getComments(post.image_id);
          }
        } catch (e) {
          console.log(e.message);
        }
      });

      
      

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
      fetchProfileStatCount(userId,'image');
    }
  });

  const timeAgo = (time) => {
    let result;
    if (typeof time === 'string') {
      time = Date.parse(time);
    }
    const difference = Date.now() - time;

    if (difference < 5 * 1000) {
      return 'just now';
    } else if (difference < 90 * 1000) {
      return 'moments ago';
    }

    //it has minutes
    if ((difference % 1000) * 3600 > 0) {
      if (Math.floor((difference / 1000 / 60) % 60) > 0) {
        let s = Math.floor((difference / 1000 / 60) % 60) == 1 ? '' : 's';
        result = `${Math.floor((difference / 1000 / 60) % 60)} minute${s} `;
      }
    }

    //it has hours
    if ((difference % 1000) * 3600 * 60 > 0) {
      if (Math.floor((difference / 1000 / 60 / 60) % 24) > 0) {
        let s = Math.floor((difference / 1000 / 60 / 60) % 24) == 1 ? '' : 's';
        result =
          `${Math.floor((difference / 1000 / 60 / 60) % 24)} hour${s}${
            result == '' ? '' : ','
          } ` + result;
      }
    }

    //it has days
    if ((difference % 1000) * 3600 * 60 * 24 > 0) {
      if (Math.floor(difference / 1000 / 60 / 60 / 24) > 0) {
        let s = Math.floor(difference / 1000 / 60 / 60 / 24) == 1 ? '' : 's';
        result =
          `${Math.floor(difference / 1000 / 60 / 60 / 24)} day${s}${
            result == '' ? '' : ','
          } ` + result;
      }
    }

    return result + ' ago';
  };
});
