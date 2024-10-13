# Command Menu

A dynamic command menu featuring countries fetched from the REST Countries API. This project demonstrates a responsive and interactive user interface with real-time search functionality and keyboard navigation.

## Features

- Fetches countries from [REST Countries API](https://restcountries.com/v3.1/all)
- Real-time search filtering of countries
- Keyboard shortcuts:
  - Ctrl+K (Windows) or Cmd+K (Mac) to toggle the command menu
  - Esc to close the menu
  - Arrow keys for navigation
  - Enter to select a country
- Click outside the menu to close it
- Responsive design for various screen sizes
- Displays country name and population in a custom modal when selected

## Technical Details

- Built with vanilla JavaScript, HTML, and CSS
- Utilizes the Fetch API for data retrieval
- Implements custom keyboard navigation and event handling
- Uses a template for efficient card creation in the DOM
- Employs ResizeObserver for efficient UI updates

## Usage

1. Open `index.html` in a web browser
2. Click the "⌘K" button or use the keyboard shortcut to open the command menu
3. Type to search for countries in real-time
4. Use arrow keys to navigate through the list
5. Press Enter or click on a country to view its details in a custom modal

## Performance Optimization

- Implements efficient DOM updates to minimize repaints and reflows
- Uses ResizeObserver for responsive UI adjustments
- Employs event delegation for improved performance

## Custom Modal

- Displays country information in a custom-styled modal
- Closes on button click, overlay click, or Escape key press
- Ensures only one modal is active at a time

## Accessibility

- Keyboard navigation support throughout the application
- Visual feedback for hovered and selected items

## License

This project is open source and available under the MIT License.

/ Leo
