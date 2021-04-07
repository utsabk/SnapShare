'use strict';
import { myCustomFetch, userId } from './main.js';

import { populateImages, createPostCards} from './index.js';

const $searchForm = $('#search-form');
const $searchInput = $('#search-form input');

$searchInput.on('keyup', async(event) =>{

    event.preventDefault();

    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const query = $searchInput.val();

    const response = await myCustomFetch(`./user/?name=${query}`,requestOptions);

    console.log('fetch result:-',response)

    createPostCards(response);
})
