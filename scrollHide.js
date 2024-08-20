

// scrollTop: Measures how far the user has scrolled from the top of the element.
// scrollHeight: The total height of the scrollable content, including the part that's hidden off-screen.
// clientHeight: The height of the visible portion of the scrollable element.
// scrollPercentage: This is calculated by dividing the current scroll position (scrollTop) by the total scrollable content (scrollHeight - clientHeight) and multiplying by 100 to get a percentage.

let scrollableList = countryCardContainer;
// console.log(scrollableList);

// Scroll event listener
scrollableList.addEventListener("scroll", (event) => {	
  // console.log(event);
  // Calculate the percentage of the scroll
  let scrollTop = scrollableList.scrollTop;
  let scrollHeight = scrollableList.scrollHeight;
  let clientHeight = scrollableList.clientHeight;

  //Calculate the percentage of the scroll ( current position / total scrollable content)
  let scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
  
  // Check if scroll is greater than or equal to 70%
  if (scrollPercent >= 99.9) { 
    bottomGradient.style.display = "none";
  } else {
    bottomGradient.style.display = "block";
  }
  // console.log(scrollPercent);
});