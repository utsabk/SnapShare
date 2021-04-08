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

const modalClickHandler = async (modal) =>{

  $(`${modal} .close`).on('click', (e) => {
    e.preventDefault();

    $(modal).hide();
  });

  $(`${modal} .cancelbtn`).on('click', (event) => {
     event.preventDefault();
    $('label.error').remove();
    $(modal).find('.error').removeClass('error')
    $(modal).hide();
  });

  // When the user clicks anywhere outside of the modal, close it
  $(document).on('click', (event) => {
    if ($(event.target).is(modal)) {
      $(modal).hide();
    }
  });
 
}


const timeDiff = (time)=>{
    if (typeof time === 'string') {
        time = Date.parse(time);
      }
      const difference = Date.now() - time;

    return difference;
}

// Function to disply time ago in each comments
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
        result =`${Math.floor((difference / 1000 / 60 / 60) % 24)} hour${s}`
      } 
    }

    //it has days
    if ((difference % 1000) * 3600 * 60 * 24 > 0) {
      if (Math.floor(difference / 1000 / 60 / 60 / 24) > 0) {
        let s = Math.floor(difference / 1000 / 60 / 60 / 24) == 1 ? '' : 's';
        result = `${Math.floor(difference / 1000 / 60 / 60 / 24)} day${s}`
      }
    }

    return result + ' ago';
};


// Update comment's time
const updateTimeElement = (element, time, timeInterval) => {
  setInterval(() => {
    element.html(timeAgo(time)); //every "timeInterval" ,"time" is updated on "element"
  }, timeInterval * 1000);
};


const updateTimeInterval = (element, time) => {
    if (timeDiff(time) < 10 * 1000) {
    updateTimeElement(element, time, 5); // if less than 10 secs upadte every 5 secs
    }else if(timeDiff(time) < 60 * 1000) {
      updateTimeElement(element, time, 20); // if less than 50 secs upadte every 30 secs
    } else if (timeDiff(time) < 3600 * 1000) {
    updateTimeElement(element, time, 60); // if less than an hour upadte every minute
    } else {
    updateTimeElement(element, time, 3600); // if more than an hour update every hour
    }
};
    

export { userId, userToken, fetchProfileStatCount, myCustomFetch, timeDiff, timeAgo , updateTimeInterval, modalClickHandler};
