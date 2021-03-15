'use strict';
const url = 'http://localhost:3000';

const ul = document.querySelector('ul');

const getImages = async () => {
  const response = await fetch(url + '/image/');
  const images = await response.json();

  console.log('this is images:-',images)

  images.map((image) => {
    ul.innerHTML += `
        <li>
        <h2>${image.image_id}</h2>
        <figure>
            <img src="./uploads/${image.imagename}" class="resp">
        </figure>
        <p>Uploaded: ${image.time_stamp}</p>
        <p>Owner: ${image.user_id}</p>
    </li>
        `;
  });
};

getImages();
