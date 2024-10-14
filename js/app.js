// Global variables and DOM element selections
const countryCardTemplate = document.querySelector("[data-country-template]");
const countryCardContainer = document.querySelector("[data-country-cards-container]");
const searchInput = document.querySelector("[data-search]");
const commandMenu = document.querySelector("[data-command-menu]");
const bottomGradient = document.querySelector("[data-bottom-gradient]");
const main = document.querySelector("main");
const button = document.querySelector("[command-menu-button]");
const card = document.querySelector(".country-card");

let scrollableList = countryCardContainer;
let countries = [];
let currentIndex = 0;

// Search input event listener
searchInput.addEventListener("input", (e) => {
  // Filter and display cards based on search input
  const value = e.target.value.toLowerCase();
  countries.forEach((country) => {
    const isVisible = country.name.toLowerCase().includes(value);
    country.element.classList.toggle("hide", !isVisible);
  });
  initializeCardNavigation(); // Reinitialize card navigation after filtering
});

// Fetch data from API and create cards
fetch("https://restcountries.com/v3.1/all")
  .then((res) => res.json())
  .then((data) => {
    clearCards(); // Clear existing cards before creating new ones
    countries = data.map(country => ({
      name: country.name.common,
      population: country.population
    })).map(createCountryCard);
    initializeCardNavigation();
  })
  .catch(error => {
    console.error("Error fetching country data:", error);
    // Optionally, display an error message to the user
  });

const resizeObserver = new ResizeObserver((entries) => { 
  // Toggle bottom gradient visibility based on command menu height
  const thresholdHeight = 340; //Threshold height
  for (let entry of entries) {
    const currentHeight = entry.contentRect.height;

    if (currentHeight < thresholdHeight) {
      // console.log('The command menu height is below 340px.');
      bottomGradient.style.display = "none";
    } else {
      // console.log('The command menu height is above 340px.');
      bottomGradient.style.display = "block";
    }
  }
});

resizeObserver.observe(commandMenu);



function clearCards() {
  // Clear all cards from the container
  countryCardContainer.innerHTML = "";
}

function createCountryCard(country) {
  // Create and append a new card element
  const card = countryCardTemplate.content.cloneNode(true).children[0];
  const header = card.querySelector("[data-header]");
  const population = card.querySelector("[data-population]");
  header.textContent = country.name;
  population.textContent = country.population.toLocaleString(); // Format population number
  countryCardContainer.append(card);
  return { name: country.name, element: card };
}

function getVisibleCards() {
  // Get all visible (non-hidden) cards
  return Array.from(document.querySelectorAll(".country-card:not(.hide)"));
}

function initializeCardNavigation() {
  // Initialize card navigation with the first visible card
  const visibleCards = getVisibleCards();
  if (visibleCards.length > 0) {
    currentIndex = 0;
    updateHoverState(currentIndex);
  }
}

function updateHoverState(newIndex) {
  // Update the hover state of cards
  const visibleCards = getVisibleCards();
  if (visibleCards.length === 0) return;

  visibleCards.forEach((card) => card.classList.remove("hover"));
  currentIndex = newIndex;
  visibleCards[currentIndex].classList.add("hover");
  visibleCards[currentIndex].scrollIntoView({ block: "nearest" });
}

// Card click event listener
countryCardContainer.addEventListener("click", (event) => {
  const clickedCard = event.target.closest("[data-country-card]");
  if (clickedCard) {
    event.preventDefault();
    const header = clickedCard.querySelector("[data-header]").textContent;
    const population = clickedCard.querySelector("[data-population]").textContent;
    showCustomModal(header, population);
  }
});

// Keyboard navigation event listener
document.addEventListener("keydown", function (event) {
  const visibleCards = getVisibleCards();
  if (visibleCards.length === 0) return;

  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    let newIndex;
    if (event.key === "ArrowDown") {
      newIndex = (currentIndex + 1) % visibleCards.length;
    } else if (event.key === "ArrowUp") {
      newIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
    }
    updateHoverState(newIndex);
    event.preventDefault();
  } else if (event.key === "Enter") {
    const hoveredCard = visibleCards[currentIndex];
    if (hoveredCard) {
      event.preventDefault();
      const header = hoveredCard.querySelector("[data-header]").textContent;
      const population = hoveredCard.querySelector("[data-population]").textContent;
      showCustomModal(header, population);
    }
  }
});

// Remove the showCustomModal function as it's no longer needed
// function showCustomModal(header, population) { ... }

document.addEventListener("mouseover", (event) => {
  // Update hover state when mouse moves over a card
  const cardElement = event.target.closest(".country-card:not(.hide)");
  if (cardElement) {
    const visibleCards = getVisibleCards();
    const newIndex = visibleCards.indexOf(cardElement);
    if (newIndex !== -1) {
      updateHoverState(newIndex);
    }
  }
});

scrollableList.addEventListener("scroll", (event) => {
  let scrollTop = scrollableList.scrollTop;
  let scrollHeight = scrollableList.scrollHeight;
  let clientHeight = scrollableList.clientHeight;

  // Calculate the percentage of the scroll ( current position / total scrollable content)
  let scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;

  // 99.9 is the absoulte bottom of the scrollable list, so we want to hide the gradient when we get close to the bottom.
  if (scrollPercent >= 99) {
    bottomGradient.style.display = "none";
  } else {
    bottomGradient.style.display = "block";
  }
});

document.addEventListener("keydown", (event) => {
  // Handle Cmd/Ctrl + K and Escape key events
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  if ((isMac ? event.metaKey : event.ctrlKey) && event.key === "k") {
    event.preventDefault();
    // Toggle command menu visibility
    if (commandMenu.style.display === "none" || commandMenu.style.display === "") {
      commandMenu.style.display = "block";
      button.style.display = "none";
    } else {
      commandMenu.style.display = "none";
      button.style.display = "block";
    }
    searchInput.value = ""; // Clear search input when toggling
    searchInput.focus(); // Always focus on searchInput
  } else if (event.key === "Escape" && !activeModal) {
    // Hide command menu on Escape key press only if no modal is active
    if (commandMenu.style.display === "block") {
      commandMenu.style.display = "none";
      searchInput.value = "";
      button.style.display = "block";
      searchInput.focus();
    }
  }
});

// Click event listener to hide command menu
document.addEventListener("click", (event) => {
  if (event.target === main) {
    commandMenu.style.display = "none";
    searchInput.value = "";
    button.style.display = "block";
    searchInput.focus();
  }
});

button.addEventListener("click", (event) => {
  // Show command menu and focus on search input
  commandMenu.style.display = "block";
  button.style.display = "none";
  searchInput.focus();
});

// Custom modal function
let activeModal = null;

function showCustomModal(header, population) {
  if (activeModal) return; // Prevent creating multiple modals

  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '999';

  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.left = '50%';
  modal.style.top = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.backgroundColor = '#131316';
  modal.style.color = '#9394A1';
  modal.style.padding = '20px';
  modal.style.borderRadius = '8px';
  modal.style.border = '1px solid #28292F';
  modal.style.boxShadow = '0px 0px 30px 10px #11111166';
  modal.style.zIndex = '1000';
  modal.style.fontFamily = "'Inter', sans-serif";
  modal.style.width = 'clamp(300px, 90%, 400px)';
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const escapeText = isMobile ? '' : '<span style="font-size: 0.8em; opacity: 0.7; background-color: #35363D; padding: 2px 4px; border-radius: 4px; margin-left: 4px;">Esc</span>';
  
  modal.innerHTML = `
    <p style="margin-bottom: 15px; color: #D9D9DE; font-size: 0.9em;"><b>${header}</b> has a population of approximately ${population} people</p>
    <button id="closeModal" style="background-color: #28292F; color: #fff; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-family: 'Inter', sans-serif;">Close${escapeText}</button>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  activeModal = { modal, overlay };

  const closeButton = modal.querySelector('#closeModal');
  closeButton.addEventListener('click', closeModal);
  closeButton.addEventListener('mouseover', () => {
    closeButton.style.backgroundColor = '#28292F';
  });
  closeButton.addEventListener('mouseout', () => {
    closeButton.style.backgroundColor = '#1D1D21';
  });

  overlay.addEventListener('click', closeModal);

  const modalEscapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      e.preventDefault();
    }
  };

  document.addEventListener('keydown', modalEscapeHandler);

  function closeModal() {
    if (!activeModal) return;
    
    document.body.removeChild(activeModal.modal);
    document.body.removeChild(activeModal.overlay);
    document.removeEventListener('keydown', modalEscapeHandler);
    activeModal = null;
    searchInput.focus();
  }
}
