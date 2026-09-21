# Albanian Grammar Checker

A full-stack web application designed to be the first dedicated grammar and spelling checker for the Albanian language. This tool provides real-time corrections and suggestions, leveraging the power of the OpenAI API to deliver accurate results.

This project was built not only to solve a unique problem but also to serve as a professional portfolio piece demonstrating best practices in web development, including a full testing suite, code quality tooling, and a secure backend.

---

### Live Demo

*[Link to your live application (when deployed)]*

### Screenshot



![Application Screenshot](./docs/images/screenshot.png)

---

## Features

-   **Real-time Correction:** Get instant grammar and spelling corrections for Albanian text.
-   **Side-by-Side Comparison:** Clearly see the suggested changes highlighted next to your original text.
-   **Detailed Suggestions:** View a list of specific corrections to understand the changes made.
-   **Secure Backend:** The server is built with security in mind, including rate limiting to prevent abuse.
-   **Professional Codebase:** The project includes a full test suite, linting, and code formatting to ensure high-quality, maintainable code.

---

## Tech Stack

-   **Frontend:** HTML5, CSS3, Vanilla JavaScript
-   **Backend:** Node.js, Express.js
-   **API:** OpenAI API (gpt-3.5-turbo)
-   **Testing:** Jest & Supertest
-   **Code Quality:** ESLint & Prettier

---

## Setup and Installation

To get this project running locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/gramarly.git
    cd gramarly
    ```

2.  **Set up the Backend:**
    -   Navigate to the backend directory:
        ```bash
        cd backend
        ```
    -   Install the required dependencies:
        ```bash
        npm install
        ```
    -   Create an environment file. Make a copy of `.env.example` and name it `.env`.
        ```bash
        cp .env.example .env
        ```
    -   Open the `.env` file and add your OpenAI API key:
        ```
        OPEN_API_KEY=your_openai_api_key_here
        ```

---

## How to Run

1.  **Start the backend server:**
    -   Make sure you are in the `backend` directory.
    -   Run the start command:
        ```bash
        npm start
        ```
    -   The server will be running at `http://localhost:5000`.

2.  **Open the application:**
    -   Open your web browser and navigate to `http://localhost:5000`.

---

## Running Tests

To ensure the application is working correctly, you can run the test suite.

1.  Navigate to the `backend` directory.
2.  Run the test command:
    ```bash
    npm test
    ```
