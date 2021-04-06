'use strict';

// Get userID from local storage
const userId = localStorage.getItem('userId');

// Get userID from local storage
const userToken = localStorage.getItem('token');

// fetch profile stats from back end
const fetchProfileStatCount = async (userID, fetchRoute) => {
  try {
    const response = await fetch(`./${fetchRoute}/user/${userID}`);
    const result = await response.json();
    if (result) {
      $(`.profile-stats #${fetchRoute}`).html(result.count);
      //return result.count;
    }
  } catch (err) {
    console.log(err.message);
  }
};

const myCustomFetch = async (url, fetchOptions) => {
  if (fetchOptions) {
    try {
      const response = await fetch(url, fetchOptions);
      const result = await response.json();
      return result;
    } catch (err) {
      console.log(err.message);
    }
  } else {
    try {
      const response = await fetch(url);
      const result = await response.json();
      return result;
    } catch (err) {
      console.log(err.message);
    }
  }
};

export { userId, userToken, fetchProfileStatCount, myCustomFetch };
