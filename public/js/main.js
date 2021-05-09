'use strict';
/**
 * This file holds the key functions which will be served to the other files
 */

// Get userID from local storage
const userId = sessionStorage.getItem('userId');

// Get userID from local storage
const userToken = sessionStorage.getItem('token');

// Hide HTML element
const hideContent = (element) => {
  element.style.display = 'none';
};

// Display HTML element
const showContent = (element) => {
  element.style.display = 'block';
};

// Slide-toggle logic
const slideToggle = (target) => {
  if (window.getComputedStyle(target).display === 'none') {
    target.style.display = 'block';
  } else {
    target.style.display = 'none';
  }
};

// fetch profile stats from back end
const fetchProfileStatCount = async (userID, fetchRoute) => {
  const fetchOptions = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + userToken,
    },
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      `./${fetchRoute}/user/${userID}`,
      fetchOptions
    );
    const result = await response.json();
    if (result) {
      document.querySelector(`.profile-stats #${fetchRoute}`).innerText =
        result.count;
      //return result.count;
    }
  } catch (err) {
    console.log(err.message);
  }
};

const myCustomFetch = async (url, fetchOptions) => {
  // Serves Fetch API for fetching resources
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

// Hide modal along with remove errors
const hideModal = (modal) => {
  const errors = modal.getElementsByClassName('error');
  if (errors) {
    Array.from(errors).map((element) => {
      element.classList.remove('error');
    });
  }
  hideContent(modal);
};

const modalClickHandler = async (modal) => {
  const closeBtn = modal.getElementsByClassName('close')[0];

  const cancelBtn = modal.getElementsByClassName('cancelbtn')[0];

  hideModal(modal);

  closeBtn.addEventListener('click', (event) => {
    event.preventDefault();
    hideModal(modal);
  });

  cancelBtn.addEventListener('click', (event) => {
    event.preventDefault();
    hideModal(modal);
  });

  // When the user clicks anywhere outside of the modal, close it
  document.addEventListener('click', (event) => {
    if (event.target == modal) {
      hideContent(modal);
    }
  });
};

const timeDiff = (time) => {
  if (typeof time === 'string') {
    time = Date.parse(time); // Change string to type date
  }
  const difference = Date.now() - time;

  return difference;
};

/**
 *
 * @param {String} time
 * @returns string in minutes, hours or day depending upon the time difference
 */
const timeAgo = (time) => {
  let result;

  const difference = timeDiff(time);

  if (difference < 5 * 1000) {
    return 'just now';
  } else if (difference < 60 * 1000) {
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
      result = `${Math.floor((difference / 1000 / 60 / 60) % 24)} hour${s}`;
    }
  }

  //it has days
  if ((difference % 1000) * 3600 * 60 * 24 > 0) {
    if (Math.floor(difference / 1000 / 60 / 60 / 24) > 0) {
      let s = Math.floor(difference / 1000 / 60 / 60 / 24) == 1 ? '' : 's';
      result = `${Math.floor(difference / 1000 / 60 / 60 / 24)} day${s}`;
    }
  }

  return result + ' ago';
};

// Update comment's time
const updateTimeElement = (element, time, timeInterval) => {
  setInterval(() => {
    element.innerText = timeAgo(time); //Depending upon the "timeInterval" ,"time" is updated on each "element"
  }, timeInterval * 1000);
};

const updateTimeInterval = (element, time) => {
  if (timeDiff(time) < 10 * 1000) {
    updateTimeElement(element, time, 5); // if less than 10 secs upadte every 5 secs
  } else if (timeDiff(time) < 60 * 1000) {
    updateTimeElement(element, time, 20); // if less than 50 secs upadte every 30 secs
  } else if (timeDiff(time) < 3600 * 1000) {
    updateTimeElement(element, time, 60); // if less than an hour upadte every minute
  } else {
    updateTimeElement(element, time, 3600); // if more than an hour update every hour
  }
};

export {
  userId,
  userToken,
  fetchProfileStatCount,
  myCustomFetch,
  timeDiff,
  timeAgo,
  updateTimeInterval,
  modalClickHandler,
  hideContent,
  showContent,
  slideToggle,
  hideModal,
};
