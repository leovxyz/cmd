const userCardTemplate = document.querySelector("[data-user-template]")
const userCardContainer = document.querySelector("[data-user-cards-container]")
const searchInput = document.querySelector("[data-search]")
const commandMenu = document.querySelector("[data-command-menu]")
const bottomGradient = document.querySelector("[data-bottom-gradient]")
const main = document.querySelector("main")
const button = document.querySelector("[command-menu-button]")
const card = document.querySelector(".card")
let users = []

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase()
  users.forEach(user => {
    const isVisible =
      user.name.toLowerCase().includes(value)
    user.element.classList.toggle("hide", !isVisible)
  })
})

// Fetches data from the API
fetch("https://freetestapi.com/api/v1/countries")
  .then(res => res.json()) 
  .then(data => { 
    users = data.map(user => { 
      const card = userCardTemplate.content.cloneNode(true).children[0] 
      const header = card.querySelector("[data-header]")
      const population = card.querySelector("[data-population]")
      header.textContent = user.name 
      population.textContent = user.population
    //   card.style.backgroundColor = "red";
      userCardContainer.append(card) 
      return { name: user.name, element: card } 
    })
  })

userCardContainer.addEventListener("click", (event) => {
  const clickedCard = event.target.closest("[data-card]");
  if (clickedCard) {
    alert(clickedCard.querySelector("[data-header]").textContent + " has a population of approximately " + clickedCard.querySelector("[data-population]").textContent + " people")
  }
});

document.addEventListener("keydown", (event) => {
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  if ((isMac ? event.metaKey : event.ctrlKey) && event.key === "k") {
    event.preventDefault();
    // console.log("Command/Ctrl + K pressed");

    if (commandMenu.style.display === "none" || commandMenu.style.display === "") {
      commandMenu.style.display = "block";
      button.style.display = "none";
      searchInput.focus();
    } else {
      commandMenu.style.display = "none";
      searchInput.value = "";
      button.style.display = "block";
    }
  }
  if (event.key === "Escape") {
    commandMenu.style.display = "none";
    searchInput.value = "";
    button.style.display = "block";
  }
  
})

document.addEventListener("click", (event) => {
  if (event.target === main) {
    commandMenu.style.display = "none";
    searchInput.value = "";
    button.style.display = "block";
  }
})

button.addEventListener("click", (event) => {
    commandMenu.style.display = "block";
    button.style.display = "none";
    searchInput.focus();
})


document.addEventListener("mouseover", (event) => {
  if (event.target.classList.contains("card")) {
        event.target.classList.toggle("hover")
    }
})

document.addEventListener("mouseout", (event) => {
  if (event.target.classList.contains("card")) {
    event.target.classList.toggle("hover")  }
})

document.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const hoveredCard = document.querySelector(".card.hover");
    if (hoveredCard) {
        alert(hoveredCard.querySelector("[data-header]").textContent + " has a population of approximately " + hoveredCard.querySelector("[data-population]").textContent + " people")
    }
  }
});


// Hide the bottom gradient when the command menu is below(340px)

const thresholdHeight = 340; //Threshold height

const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        const currentHeight = entry.contentRect.height;

        if (currentHeight < thresholdHeight) {
            // console.log('The command menu height is below 250px.');
            bottomGradient.style.display = "none";
        }
        else {
            // console.log('The command menu height is above 250px.');
            bottomGradient.style.display = "block";
        }
    }
});

resizeObserver.observe(commandMenu);

document.addEventListener('keydown', function(event) {
    const containerArrowScroll = document.querySelector("[data-user-cards-container]");
    
    // Check which key is pressed
    if (event.key === 'ArrowDown') {
        // Scroll down by a certain amount (e.g., 20 pixels)
        containerArrowScroll.scrollBy(0, 20);
    } else if (event.key === 'ArrowUp') {
        // Scroll up by a certain amount (e.g., 20 pixels)
        containerArrowScroll.scrollBy(0, -20);
    }
});
