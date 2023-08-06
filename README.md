# Tic-Tac-Toe
Tic Tac Toe game built with JS, HTML, CSS

👉 [Live Demo](https://data-sandbox.github.io/tic-tac-toe/)


Techniques Implemented:
- Minimize global code. Wrap everything inside modules or factories to control scope.
- Separate game logic from UI. All logic is contained in JS and can be played in full in the console.
- UI layer is handled by single `ScreenController()` module. This decouples the DOM from the game logic, making the DOM only responsible for reading and displaying the game state and providing a UI for the user to interact with the appropriate game methods.
