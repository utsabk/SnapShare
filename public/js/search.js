'use strict';
import { myCustomFetch, userId } from './main.js';

import { populateImages, createPostCards} from './index.js';

const searchForm = document.getElementById('search-form');
const searchInput = document.querySelector('#search-form input');

searchInput.addEventListener('keyup', async(event) =>{

    event.preventDefault();

    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const query = searchInput.value;

    const response = await myCustomFetch(`./user/?name=${query}`,requestOptions);

    console.log('fetch result:-',response)

    createPostCards(response);
})
