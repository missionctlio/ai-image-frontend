# React Image Generator App

This is a React application that allows users to generate and manage images based on prompts. The application includes features for generating images, viewing thumbnails, and clearing images.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
- [Hooks](#hooks)

## Installation

To get started with the application, follow these steps:

1. **Clone the Repository**

   ```
   git clone https://github.com/missionctlio/ai-image-frontend.git
   ```

2. **Navigate to the Project Directory**

   ```
   cd ai-image-frontend
   ```

3. **Set Up the Environment**

   Ensure you have the necessary environment variables. Create a `.env` file in the project root directory with the following variables:

   ```
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Start the Development Server**

   ```
   docker-compose up
   ```

   This will start the development server and open the application in your default web browser.

   It can be accessed at `http://localhost:3000`


5. **Use local inference server ([ai-image](https://github.com/missionctlio/ai-image))**

   Edit the baseUrl to `localhost:8888` ([here](https://github.com/missionctlio/ai-image-frontend/blob/develop/src/api.js#L3))

## Usage

Once the application is running, you can:

- **Generate Images**: Enter a prompt, select an aspect ratio, and click "Generate" to create new images.
- **View Thumbnails**: See the generated images as thumbnails.
- **Delete Images**: Remove individual images or clear all images using the provided buttons.

## Components

- **`FullImageViewer.js`**: A component to display a full-size image with a close button.
- **`ImageGenerator.js`**: The main component for generating images based on user input.
- **`ThemeSelector.js`**: Allows users to select and switch themes.
- **`Thumbnails.js`**: Displays thumbnails of generated images and handles image deletion.
- **`Auth.js`**: Component handles the authentication process using Google OAuth. This component leverages the `@react-oauth/google` library to provide an easy-to-use interface for signing in and out with Google.

## Hooks

- **`useSaveToLocalStorage.js`**: A custom hook for saving data to local storage.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
