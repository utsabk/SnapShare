'use strict';
const url = 'http://localhost:3000';

const getImages = async () => {
  const response = await fetch(url + '/image/');
  const images = await response.json();
  $(() => {
    images.map((image) => {
      $('ul').append(`
        <li>
        <h2>${image.image_id}</h2>
        <figure>
            <img src="./uploads/${image.imagename}" class="resp">
        </figure>
        <p>Uploaded: ${image.time_stamp}</p>
        <p>Owner: ${image.user_id}</p>
    </li>
        `);
    });
  });
};

getImages();
