const userCardTemplate = document.querySelector("[data-user-template]")
const userCardContainer = document.querySelector("[data-user-cards-container]")
const searchInput = document.querySelector("[data-search]")
const commandMenu = document.querySelector("[data-command-menu]")
const main = document.querySelector("main")
const button = document.querySelector("[command-menu-button]")
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
    console.log("Command/Ctrl + K pressed");

    if (commandMenu.style.display === "none" || commandMenu.style.display === "") {
      commandMenu.style.display = "block";
      button.style.display = "none";

    } else {
      commandMenu.style.display = "none";
      button.style.display = "block";
    }
  }
  if (event.key === "Escape") {
    commandMenu.style.display = "none";
    button.style.display = "block";
  }
  
})

document.addEventListener("click", (event) => {
  if (event.target === main) {
    commandMenu.style.display = "none";
    button.style.display = "block";
  }
})

button.addEventListener("click", (event) => {
    commandMenu.style.display = "block";
    button.style.display = "none";
})