const userCardTemplate = document.querySelector("[data-user-template]")
const userCardContainer = document.querySelector("[data-user-cards-container]")
const searchInput = document.querySelector("[data-search]")
const commandMenu = document.querySelector("[data-command-menu]")
const bottomGradient = document.querySelector("[data-bottom-gradient]")
const main = document.querySelector("main")
const button = document.querySelector("[command-menu-button]")
const card = document.querySelector(".card")
let users = []
let currentIndex = 0;

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase()
  users.forEach(user => {
    const isVisible =
      user.name.toLowerCase().includes(value)
    user.element.classList.toggle("hide", !isVisible)
  })
  initializeCardNavigation(); // Reinitialize card navigation after filtering
})

// Fetches data from the API
fetch("https://freetestapi.com/api/v1/countries")
  .then(res => res.json()) 
  .then(data => { 
    clearCards(); // Clear existing cards before creating new ones
    users = data.map(createCard);
    initializeCardNavigation();
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

// Hide the bottom gradient when the command menu is below(340px)

const thresholdHeight = 340; //Threshold height

const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        const currentHeight = entry.contentRect.height;

        if (currentHeight < thresholdHeight) {
            // console.log('The command menu height is below 340px.');
            bottomGradient.style.display = "none";
        }
        else {
            // console.log('The command menu height is above 340px.');
            bottomGradient.style.display = "block";
        }
    }
});

resizeObserver.observe(commandMenu);

function clearCards() {
  userCardContainer.innerHTML = '';
}

function createCard(user) {
  const card = userCardTemplate.content.cloneNode(true).children[0]
  const header = card.querySelector("[data-header]")
  const population = card.querySelector("[data-population]")
  header.textContent = user.name 
  population.textContent = user.population
  userCardContainer.append(card) 
  return { name: user.name, element: card }
}

function getVisibleCards() {
  return Array.from(document.querySelectorAll('.card:not(.hide)'));
}

function initializeCardNavigation() {
  const visibleCards = getVisibleCards();
  if (visibleCards.length > 0) {
    currentIndex = 0;
    updateHoverState(currentIndex);
  }
}

function updateHoverState(newIndex) {
  const visibleCards = getVisibleCards();
  if (visibleCards.length === 0) return;

  visibleCards.forEach(card => card.classList.remove('hover'));
  currentIndex = newIndex;
  visibleCards[currentIndex].classList.add('hover');
  visibleCards[currentIndex].scrollIntoView({ block: 'nearest' });
}

document.addEventListener('keydown', function(event) {
  const visibleCards = getVisibleCards();
  if (visibleCards.length === 0) return;

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    let newIndex;
    if (event.key === 'ArrowDown') {
      newIndex = (currentIndex + 1) % visibleCards.length;
    } else if (event.key === 'ArrowUp') {
      newIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
    }
    updateHoverState(newIndex);
  } else if (event.key === 'Enter') {
    const hoveredCard = visibleCards[currentIndex];
    if (hoveredCard) {
      alert(hoveredCard.querySelector("[data-header]").textContent + " has a population of approximately " + hoveredCard.querySelector("[data-population]").textContent + " people");
    }
  }
});

document.addEventListener('mouseover', (event) => {
  const cardElement = event.target.closest('.card:not(.hide)');
  if (cardElement) {
    const visibleCards = getVisibleCards();
    const newIndex = visibleCards.indexOf(cardElement);
    if (newIndex !== -1) {
      updateHoverState(newIndex);
    }
  }
});
